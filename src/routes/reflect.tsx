import { completeSession } from "@/lib/data/sessions-repository";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Atmosphere } from "@/components/Atmosphere";
import { Nav } from "@/components/Nav";
import {
  createReflectionId,
  deleteReflection,
  listReflections,
  saveReflection,
} from "@/lib/data/reflections-repository";
import {
  loadVoiceRecording,
  saveVoiceRecording,
} from "@/lib/data/media-repository";
import type { ReflectionRecord } from "@/lib/data/types";

const TAGS = [
  "Lighter",
  "Held",
  "Clearer",
  "Quieter",
  "Open",
  "Tender",
  "Steady",
  "Awake",
];

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const remainder = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainder}`;
}

export const Route = createFileRoute("/reflect")({
    validateSearch: (search: Record<string, unknown>) => {
    const duration = Number(search.durationSeconds);

    return {
      sessionId:
        typeof search.sessionId === "string"
          ? search.sessionId
          : undefined,
      durationSeconds: Number.isFinite(duration)
        ? Math.max(0, duration)
        : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "WAVES — Reflect" },
      {
        name: "description",
        content: "Close a session. Generate a memory artifact.",
      },
    ],
  }),
  component: Reflect,
});

function VoicePlayer({ assetId }: { assetId: string }) {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | null = null;

    loadVoiceRecording(assetId)
      .then((result) => {
        if (cancelled) return;

        if (!result) {
          setError(true);
          return;
        }

        objectUrl = URL.createObjectURL(result.blob);
        setUrl(objectUrl);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [assetId]);

  if (error) {
    return (
      <p className="mt-3 text-xs text-muted-foreground">
        This recording could not be loaded.
      </p>
    );
  }

  if (!url) {
    return (
      <p className="mt-3 text-xs text-muted-foreground">
        Loading voice note…
      </p>
    );
  }

  return (
    <audio
      controls
      preload="metadata"
      src={url}
      className="mt-3 w-full"
      aria-label="Saved voice note"
    />
  );
}

function Reflect() {
    const {
    sessionId: activeSessionId,
    durationSeconds,
  } = Route.useSearch();
  const [note, setNote] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [reflectionId, setReflectionId] = useState<string | null>(null);
  const [voiceAssetId, setVoiceAssetId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
 const [savedReflections, setSavedReflections] = useState<
  ReflectionRecord[]
>([]);
const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [recording, setRecording] = useState(false);
  const [processingVoice, setProcessingVoice] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recordingStartedAtRef = useRef(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (activeSessionId) {
        try {
          await completeSession(
            activeSessionId,
            durationSeconds ?? 0,
          );
        } catch {
          if (!cancelled) {
            setError(
              "The session history could not be updated. Your reflection can still be saved.",
            );
          }
        }
      }

      try {
        const records = await listReflections();

        if (!cancelled) {
          setSavedReflections(records);
        }
      } catch {
        if (!cancelled) {
          setError("Your reflections could not be loaded.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [activeSessionId, durationSeconds]);

  useEffect(() => {
    if (!recording) return;

    const timer = window.setInterval(() => {
      setRecordingSeconds(
        Math.floor((Date.now() - recordingStartedAtRef.current) / 1000),
      );
    }, 500);

    return () => window.clearInterval(timer);
  }, [recording]);

  useEffect(() => {
    return () => {
      const recorder = recorderRef.current;

      if (recorder && recorder.state !== "inactive") {
        // Do not save an accidental partial recording when leaving the page.
        recorder.onstop = null;
        recorder.ondataavailable = null;

        try {
          recorder.stop();
        } catch {
          // The recorder may already have stopped.
        }
      }

      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const toggle = (tag: string) => {
    setPicked((current) =>
      current.includes(tag)
        ? current.filter((item) => item !== tag)
        : [...current, tag],
    );

    setMessage("");
    setError("");
  };

  async function startRecording() {
    setError("");
    setMessage("");

    if (
      !navigator.mediaDevices?.getUserMedia ||
      typeof MediaRecorder === "undefined"
    ) {
      setError(
        "Voice recording is not supported by this browser. Try a recent version of Chrome or Edge.",
      );
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      streamRef.current = stream;
      chunksRef.current = [];

      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      recordingStartedAtRef.current = Date.now();

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onerror = () => {
        setError("Something went wrong while recording. Please try again.");
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        recorderRef.current = null;
        setRecording(false);

        const duration = Math.max(
          1,
          Math.round(
            (Date.now() - recordingStartedAtRef.current) / 1000,
          ),
        );

        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });

        chunksRef.current = [];

        if (blob.size === 0) {
          setProcessingVoice(false);
          setError("No audio was captured. Please record again.");
          return;
        }

        try {
          const asset = await saveVoiceRecording(blob, duration);
          const url = URL.createObjectURL(blob);

          setVoiceAssetId(asset.id);
          setPreviewUrl(url);
          setMessage(
            "Voice note saved on this device. Save your reflection to keep it with your entry.",
          );
          setError("");
        } catch {
          setError("The voice note could not be saved. Please try again.");
        } finally {
          setProcessingVoice(false);
        }
      };

      setRecordingSeconds(0);
      setRecording(true);
      recorder.start();
    } catch {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;

      setError(
        "Microphone access was denied or unavailable. Allow microphone access in your browser settings and try again.",
      );
    }
  }

  function stopRecording() {
    const recorder = recorderRef.current;

    if (!recorder || recorder.state === "inactive") return;

    setProcessingVoice(true);

    try {
      recorder.stop();
    } catch {
      setProcessingVoice(false);
      setError("The recording could not be stopped. Please try again.");
    }
  }

  async function handleSave() {
    if (saving || recording || processingVoice) return;

    if (!note.trim() && picked.length === 0 && !voiceAssetId) {
      setError("Choose a feeling, write a note, or record a voice note.");
      setMessage("");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const saved = await saveReflection({
        id: reflectionId ?? createReflectionId(),
        sessionId: activeSessionId ?? null,
        moodTags: picked,
        note: note.trim(),
        voiceAssetId,
        status: "saved",
      });

      setReflectionId(saved.id);

      setSavedReflections((current) =>
        [saved, ...current.filter((item) => item.id !== saved.id)].sort(
          (a, b) => b.updatedAt - a.updatedAt,
        ),
      );

      setMessage("Reflection saved privately on this device.");
    } catch {
      setError("Your reflection could not be saved. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function startNewReflection() {
    setReflectionId(null);
    setNote("");
    setPicked([]);
    setVoiceAssetId(null);
    setPreviewUrl(null);
    setMessage("");
    setError("");
    setRecordingSeconds(0);
  }
const normalizedSearch = searchQuery.trim().toLowerCase();

const filteredReflections = savedReflections.filter((reflection) => {
  const searchableText = [
    reflection.note,
    ...reflection.moodTags,
  ]
    .join(" ")
    .toLowerCase();

  return searchableText.includes(normalizedSearch);
});

async function handleDeleteReflection(reflection: ReflectionRecord) {
  const confirmed = window.confirm(
    "Delete this reflection? This cannot be undone. Its voice note will also be deleted if nothing else uses it.",
  );

  if (!confirmed) return;

  setError("");
  setMessage("");

  try {
    const deleted = await deleteReflection(reflection.id);

    if (!deleted) {
      setError("This reflection could not be found or deleted.");
      return;
    }

    setSavedReflections((current) =>
      current.filter((item) => item.id !== reflection.id),
    );

    if (reflectionId === reflection.id) {
      startNewReflection();
    }

    setMessage("Reflection deleted.");
  } catch {
    setError("The reflection could not be deleted. Please try again.");
  }
}
  return (
    <main className="relative min-h-dvh text-foreground">
      <Atmosphere />
      <Nav />

      <section className="mx-auto max-w-3xl px-6 pb-20 pt-36 text-center lg:px-10">
        <div className="relative mx-auto h-40 w-40">
          <div
            className="absolute inset-0 animate-breathe rounded-full"
            style={{
              background:
                "radial-gradient(circle, color-mix(in oklab, var(--aurora) 60%, transparent), transparent 70%)",
              filter: "blur(24px)",
            }}
          />
          <div
            className="absolute inset-6 animate-breathe-soft rounded-full"
            style={{
              background:
                "radial-gradient(circle at 35% 30%, color-mix(in oklab, white 20%, transparent), color-mix(in oklab, var(--aurora) 30%, transparent) 70%, transparent 90%)",
            }}
          />
        </div>

        <h1 className="mt-10 font-display text-5xl leading-tight text-foreground/95">
          How do you feel now?
        </h1>
        <p className="mt-4 text-muted-foreground">
          Take a moment. The session will hold a shape for you.
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              aria-pressed={picked.includes(tag)}
              onClick={() => toggle(tag)}
              className={`glass-soft rounded-full px-4 py-2 text-xs uppercase tracking-[0.22em] transition ${
                picked.includes(tag)
                  ? "bg-white/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="glass mt-10 rounded-3xl p-6 text-left">
          <label className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
            A small note
          </label>

          <textarea
            value={note}
            onChange={(event) => {
              setNote(event.target.value);
              setMessage("");
            }}
            placeholder="A single sentence is enough."
            rows={4}
            className="mt-3 w-full resize-none bg-transparent font-display text-xl text-foreground outline-none placeholder:text-muted-foreground/60"
          />

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Voice note · optional
            </span>

            <button
              type="button"
              onClick={recording ? stopRecording : startRecording}
              disabled={processingVoice || saving}
              className="glass-soft rounded-full px-4 py-2 text-xs uppercase tracking-[0.18em] transition hover:bg-white/10 disabled:opacity-50"
            >
              {recording
                ? `■ Stop · ${formatTime(recordingSeconds)}`
                : processingVoice
                  ? "Saving audio…"
                  : voiceAssetId
                    ? "● Record again"
                    : "● Record voice"}
            </button>
          </div>

          {recording && (
            <p className="mt-3 text-xs text-muted-foreground" role="status">
              Recording is active. Your microphone is in use.
            </p>
          )}

          {previewUrl && (
            <div className="mt-4">
              <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Listen to your recording
              </p>
              <audio
                controls
                src={previewUrl}
                className="w-full"
                aria-label="Preview voice recording"
              />
            </div>
          )}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || recording || processingVoice}
            className="glass rounded-full px-7 py-3 text-sm transition hover:bg-white/5 disabled:cursor-wait disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save reflection"}
          </button>

          {reflectionId && (
            <button
              type="button"
              onClick={startNewReflection}
              disabled={saving || recording || processingVoice}
              className="rounded-full px-5 py-3 text-sm text-muted-foreground transition hover:text-foreground disabled:opacity-50"
            >
              New reflection
            </button>
          )}
        </div>

        {message && (
          <p role="status" className="mt-4 text-sm text-muted-foreground">
            {message}
          </p>
        )}

        {error && (
          <p role="alert" className="mt-4 text-sm text-red-300">
            {error}
          </p>
        )}

        <section className="mt-20 text-left">
          <p className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
            Your reflections
          </p>
          <h2 className="mt-3 font-display text-3xl text-foreground/95">
            Keep what you noticed
          </h2>
          <div className="mt-6">
  <label
    htmlFor="reflection-search"
    className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground"
  >
    Search your reflections
  </label>

  <input
    id="reflection-search"
    type="search"
    value={searchQuery}
    onChange={(event) => setSearchQuery(event.target.value)}
    placeholder="Search notes or moods…"
    className="glass mt-3 w-full rounded-2xl px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
  />
</div>

          {loading ? (
            <p className="mt-6 text-sm text-muted-foreground">
              Opening your private archive…
            </p>
          ) : savedReflections.length === 0 ? (
            <p className="mt-6 text-sm leading-7 text-muted-foreground">
              Reflections you save will appear here. They remain on this
              device and are not uploaded to a cloud service.
            </p>
          ) : (
            <div className="mt-6 space-y-4">
              {filteredReflections.length === 0 && (
  <p className="text-sm text-muted-foreground">
    No reflections match “{searchQuery}”.
  </p>
)}
              {filteredReflections.map((reflection) => (
                <article
                  key={reflection.id}
                  className="glass rounded-2xl p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-2">
                      {reflection.moodTags.map((tag) => (
                        <span
                          key={tag}
                          className="glass-soft rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                   <div className="flex items-center gap-4">
  <time className="text-xs text-muted-foreground">
    {new Date(reflection.updatedAt).toLocaleString()}
  </time>

  <button
    type="button"
    onClick={() => void handleDeleteReflection(reflection)}
    className="text-xs text-muted-foreground transition hover:text-red-300"
    aria-label="Delete this reflection"
  >
    Delete
  </button>
</div>
                  </div>

                  {reflection.note && (
                    <p className="mt-4 whitespace-pre-wrap font-display text-lg leading-relaxed text-foreground/90">
                      {reflection.note}
                    </p>
                  )}

                  {reflection.voiceAssetId && (
                    <VoicePlayer assetId={reflection.voiceAssetId} />
                  )}
                </article>
              ))}
            </div>
          )}
        </section>

        <div className="mt-16">
          <Link
            to="/"
            className="text-sm text-muted-foreground transition hover:text-foreground"
          >
            ← Return to the constellation
          </Link>
        </div>
      </section>
    </main>
  );
}