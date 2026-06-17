import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Atmosphere } from "@/components/Atmosphere";
import { Nav } from "@/components/Nav";
import { SOUND_CATEGORIES, type CategoryId } from "@/lib/waves-data";
import { addLayer, fileToDataUrl, loadLayers, removeLayer, type Layer } from "@/lib/memory-store";

export const Route = createFileRoute("/memory")({
  head: () => ({
    meta: [
      { title: "WAVES — Your Sound Library" },
      { name: "description", content: "Upload the sounds that matter to you. Blend them into your sessions." },
      { property: "og:title", content: "WAVES — Your Sound Library" },
      { property: "og:description", content: "Personal sound layers for your sessions." },
    ],
  }),
  component: Memory,
});

function Memory() {
  const [layers, setLayers] = useState<Layer[]>([]);
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState<CategoryId | "all">("all");
  const fileRef = useRef<HTMLInputElement>(null);
  const [pendingName, setPendingName] = useState("");
  const [pendingCats, setPendingCats] = useState<CategoryId[]>([]);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  useEffect(() => { setLayers(loadLayers()); }, []);

  const visible = filter === "all" ? layers : layers.filter((l) => l.categories.includes(filter));

  const handleFile = (f: File) => {
    setPendingFile(f);
    setPendingName(f.name.replace(/\.[^.]+$/, ""));
    setPendingCats([]);
  };

  const save = async () => {
    if (!pendingFile || pendingCats.length === 0 || !pendingName.trim()) return;
    setBusy(true);
    try {
      const dataUrl = await fileToDataUrl(pendingFile);
      const next = addLayer({
        id: crypto.randomUUID(),
        name: pendingName.trim(),
        categories: pendingCats,
        dataUrl,
        createdAt: Date.now(),
      });
      setLayers(next);
      setPendingFile(null); setPendingName(""); setPendingCats([]);
      if (fileRef.current) fileRef.current.value = "";
    } finally { setBusy(false); }
  };

  const toggleCat = (c: CategoryId) =>
    setPendingCats((p) => p.includes(c) ? p.filter((x) => x !== c) : [...p, c]);

  return (
    <main className="relative min-h-dvh text-foreground">
      <Atmosphere />
      <Nav />

      <section className="px-6 lg:px-10 pt-36 pb-12 max-w-7xl mx-auto">
        <div className="max-w-2xl">
          <div className="text-[11px] uppercase tracking-[0.32em] text-accent/80">Your Sound Library</div>
          <h1 className="mt-5 font-display text-5xl sm:text-6xl leading-[1.04] text-foreground/95">
            The sounds that mean something to you.
          </h1>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            Upload a voice note, a field recording, the rain outside your window. Tag it with how it makes you feel.
            WAVES will blend it into your sessions automatically.
          </p>
        </div>
      </section>

      {/* UPLOAD */}
      <section className="px-6 lg:px-10 pb-12 max-w-7xl mx-auto">
        <div className="glass rounded-3xl p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-5">
              <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">Add a sound</div>
              <div className="mt-3 font-display text-2xl text-foreground/95">Rain. A voice. A street.</div>
              <p className="mt-3 text-sm text-muted-foreground">
                Audio files up to a few MB work best. Loops are great. Examples: rain, ocean, birds,
                family voices, cafe ambience, wind.
              </p>
              <label className="mt-5 inline-flex items-center gap-3 glass rounded-full px-5 py-3 text-sm cursor-pointer hover:bg-white/[0.06] transition">
                <input ref={fileRef} type="file" accept="audio/*" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
                <span>+ Choose audio</span>
              </label>
            </div>
            <div className="md:col-span-7">
              <div className="space-y-4">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">Name</div>
                  <input
                    value={pendingName}
                    onChange={(e) => setPendingName(e.target.value)}
                    placeholder="Rain on the roof"
                    className="mt-2 w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent/40"
                  />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">How does it make you feel?</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {SOUND_CATEGORIES.map((c) => {
                      const on = pendingCats.includes(c.id);
                      return (
                        <button key={c.id} type="button" onClick={() => toggleCat(c.id)}
                          className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.18em] transition border ${
                            on ? "bg-accent/20 border-accent/40 text-foreground" : "bg-white/[0.03] border-white/10 text-muted-foreground hover:text-foreground"
                          }`}>
                          {c.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <button
                  onClick={save}
                  disabled={!pendingFile || pendingCats.length === 0 || !pendingName.trim() || busy}
                  className="glass rounded-full px-6 py-3 text-sm tracking-wide text-foreground hover:bg-white/[0.08] transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {busy ? "Saving…" : pendingFile ? `Save "${pendingName || "this sound"}"` : "Choose a file first"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LIBRARY */}
      <section className="px-6 lg:px-10 pb-32 max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] uppercase tracking-[0.32em] text-muted-foreground">
            {layers.length} sound{layers.length === 1 ? "" : "s"} in your library
          </div>
          <div className="flex flex-wrap gap-2">
            <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>All</FilterChip>
            {SOUND_CATEGORIES.map((c) => (
              <FilterChip key={c.id} active={filter === c.id} onClick={() => setFilter(c.id)}>{c.label}</FilterChip>
            ))}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visible.length === 0 && (
            <div className="col-span-full glass rounded-3xl p-12 sm:p-16 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-30 pointer-events-none animate-breathe-soft"
                style={{ background: "radial-gradient(circle at 50% 50%, color-mix(in oklab, var(--aurora) 40%, transparent), transparent 70%)", filter: "blur(40px)" }} />
              <div className="relative">
                <div className="mx-auto h-16 w-16 rounded-full animate-breathe"
                  style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--aurora) 50%, transparent), transparent 70%)", filter: "blur(8px)" }} />
                <div className="mt-6 text-[10px] uppercase tracking-[0.36em] text-accent/80">Empty</div>
                <h3 className="mt-3 font-display text-3xl text-foreground/95">
                  {filter === "all" ? "A library, waiting." : "Nothing here in this feeling."}
                </h3>
                <p className="mt-4 max-w-md mx-auto text-sm text-muted-foreground leading-relaxed">
                  {filter === "all"
                    ? "Bring in the first sound that means something to you. It will fold into the rooms you enter."
                    : "Upload a sound and tag it with this feeling — it'll appear inside the matching room."}
                </p>
              </div>
            </div>
          )}
          {visible.map((l) => (
            <div key={l.id} className="glass rounded-2xl p-5 relative overflow-hidden group">
              <div className="absolute -top-14 -right-14 h-32 w-32 rounded-full opacity-30 animate-breathe-soft"
                style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--aurora) 60%, transparent), transparent 70%)", filter: "blur(30px)" }} />
              <div className="relative">
                <div className="font-display text-lg text-foreground/95 leading-snug">{l.name}</div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {l.categories.map((cid) => (
                    <span key={cid} className="text-[10px] uppercase tracking-[0.22em] px-2 py-1 rounded-full bg-white/5 text-muted-foreground">
                      {SOUND_CATEGORIES.find((c) => c.id === cid)?.label}
                    </span>
                  ))}
                </div>
                <audio src={l.dataUrl} controls className="mt-4 w-full" />
                <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                  <span>{new Date(l.createdAt).toLocaleDateString()}</span>
                  <button onClick={() => setLayers(removeLayer(l.id))}
                    className="hover:text-foreground transition">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link to="/" className="text-sm tracking-wide text-muted-foreground hover:text-foreground transition">
            ← Back to sound spaces
          </Link>
        </div>
      </section>
    </main>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-[11px] uppercase tracking-[0.22em] transition border ${
        active ? "bg-accent/20 border-accent/40 text-foreground" : "bg-white/[0.03] border-white/10 text-muted-foreground hover:text-foreground"
      }`}>
      {children}
    </button>
  );
}
