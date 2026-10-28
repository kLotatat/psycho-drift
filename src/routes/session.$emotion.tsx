import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import { Atmosphere } from "@/components/Atmosphere";
import { MODULES } from "@/lib/waves-data";
import { wavesEngine } from "@/lib/audio-engine";
import { loadLayers, type Layer } from "@/lib/memory-store";
import {
  createSessionId,
  startSession,
} from "@/lib/data/sessions-repository";

export const Route = createFileRoute("/session/$emotion")({
  head: ({ params }) => {
    const m = MODULES.find((x) => x.id === params.emotion);
    return {
      meta: [
        { title: m ? `WAVES — ${m.humanName}` : "WAVES — Session" },
        { name: "description", content: m ? m.purpose : "A WAVES session." },
      ],
    };
  },
  loader: ({ params }) => {
    const m = MODULES.find((x) => x.id === params.emotion);
    if (!m) throw notFound();
    return { module: m };
  },
  component: Session,
  notFoundComponent: () => (
    <div className="min-h-dvh flex items-center justify-center text-foreground">
      <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">Return</Link>
    </div>
  ),
});

function useEngine() {
  return useSyncExternalStore(
    (cb) => wavesEngine.subscribe(cb),
    () => wavesEngine.module ?? "",
    () => "",
  );
}

function Session() {
  const { module } = Route.useLoaderData();
  const [seconds, setSeconds] = useState(0);
  const [intensity, setIntensity] = useState(50);
  const [depth, setDepth] = useState(60);
  const [binaural, setBinaural] = useState(true);
  const [adaptive, setAdaptive] = useState(true);
  const [started, setStarted] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionError, setSessionError] = useState("");
  const [layers, setLayers] = useState<Layer[]>([]);
  const [activeLayerIds, setActiveLayerIds] = useState<Set<string>>(new Set());
  useEngine();

  useEffect(() => {
    // Relevant layers: tagged with this module's category id
    const all = loadLayers().filter((l) => l.categories.includes(module.id));
    setLayers(all);
  }, [module.id]);

  const begin = async () => {
  setSessionError("");

  wavesEngine.setIntensity(intensity / 100);
  wavesEngine.setDepth(depth / 100);
  wavesEngine.setBinaural(binaural);

  await wavesEngine.start(module.id);

  setStarted(true);

  const id = createSessionId();

  try {
    await startSession({
      id,
      moduleId: module.id,
      intensity,
      spatialDepth: depth,
      binaural,
    });

    setSessionId(id);
  } catch {
    setSessionError(
      "Your audio is playing, but this session could not be saved to history.",
    );
  }
};

  useEffect(() => () => {
    activeLayerIds.forEach((id) => wavesEngine.removeLayer(id));
    wavesEngine.stop();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => { if (started) wavesEngine.setIntensity(intensity / 100); }, [intensity, started]);
  useEffect(() => { if (started) wavesEngine.setDepth(depth / 100); }, [depth, started]);
  useEffect(() => { if (started) wavesEngine.setBinaural(binaural); }, [binaural, started]);

  useEffect(() => {
    if (!started) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [started]);

  const toggleLayer = async (l: Layer) => {
    if (activeLayerIds.has(l.id)) {
      wavesEngine.removeLayer(l.id);
      const next = new Set(activeLayerIds); next.delete(l.id);
      setActiveLayerIds(next);
    } else {
      await wavesEngine.addLayer(l.id, l.dataUrl, 0.45);
      const next = new Set(activeLayerIds); next.add(l.id);
      setActiveLayerIds(next);
    }
  };

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const hue = module.hue;

  return (
    <main className="relative min-h-dvh overflow-hidden text-foreground">
      <Atmosphere />

      <div aria-hidden className="pointer-events-none fixed inset-0 -z-0">
        <div className="absolute inset-0 animate-aurora"
          style={{ background: `radial-gradient(60rem 50rem at 50% 40%, oklch(0.7 0.18 ${hue} / 0.30), transparent 70%)`, filter: "blur(40px)" }} />
        <div className="absolute inset-0 animate-aurora" style={{ animationDelay: "-10s",
          background: `radial-gradient(40rem 35rem at 30% 80%, oklch(0.55 0.18 ${(hue + 60) % 360} / 0.22), transparent 70%)`, filter: "blur(60px)" }} />
      </div>

      <header className="fixed top-0 inset-x-0 z-40 px-6 lg:px-10 py-5 flex items-center justify-between">
        <Link to="/" className="text-[11px] uppercase tracking-[0.32em] text-muted-foreground hover:text-foreground transition">
          ← Exit
        </Link>
        <div className="text-[11px] uppercase tracking-[0.32em] text-muted-foreground text-center">
          <span className="text-foreground/90">{module.humanName}</span> · {module.freqLabel}
        </div>
<Link
  to="/reflect"
  search={{
    sessionId: sessionId ?? undefined,
    durationSeconds: seconds,
  }}
  className="text-[11px] uppercase tracking-[0.32em] text-muted-foreground hover:text-foreground transition"
>
  End & Reflect →
</Link>
      </header>

      <section className="relative min-h-dvh flex flex-col items-center justify-center px-6 pt-20 pb-48">
        <ReactiveSphere hue={hue} active={started} />
        <div className="mt-12 text-center">
          <div className="text-[10px] uppercase tracking-[0.36em] text-foreground/60">{started ? "In the space" : "Ready"}</div>
          <div className="mt-3 font-display text-5xl sm:text-6xl text-foreground/95">{module.humanName}</div>
          <div className="mt-4 font-mono text-sm text-foreground/70">{mm}:{ss}</div>
          <p className="mt-8 max-w-md mx-auto text-sm text-muted-foreground leading-relaxed">{module.purpose}</p>
          {sessionError && (
  <p role="alert" className="mt-4 text-sm text-red-300">
    {sessionError}
  </p>
)}
        </div>

        {!started && (
          <button onClick={begin}
            className="mt-12 glass rounded-full px-8 py-4 text-sm tracking-[0.22em] uppercase text-foreground/95 hover:bg-white/[0.06] transition">
            Start listening
          </button>
        )}

        {started && layers.length > 0 && (
          <div className="mt-14 w-full max-w-2xl">
            <div className="text-center text-[10px] uppercase tracking-[0.32em] text-muted-foreground mb-4">
              Personal Layers
            </div>
            <div className="glass rounded-3xl p-4 sm:p-5 space-y-2">
              {layers.map((l) => {
                const on = activeLayerIds.has(l.id);
                return (
                  <button key={l.id} onClick={() => toggleLayer(l)}
                    className={`w-full flex items-center justify-between gap-4 rounded-2xl px-4 py-3 transition border ${
                      on ? "bg-white/[0.06] border-white/20" : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04]"
                    }`}>
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`h-2 w-2 rounded-full ${on ? "bg-accent animate-breathe-soft" : "bg-muted-foreground/40"}`} />
                      <span className="text-sm text-foreground/90 truncate">{l.name}</span>
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{on ? "Playing" : "Off"}</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-3 text-center text-[10px] uppercase tracking-[0.24em] text-muted-foreground/70">
              Layers blend in automatically · crossfaded · spatially placed
            </div>
          </div>
        )}

        {started && layers.length === 0 && (
          <Link to="/memory" className="mt-10 text-[11px] uppercase tracking-[0.28em] text-muted-foreground hover:text-foreground transition">
            + Add personal sounds to this space
          </Link>
        )}
      </section>

      {started && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 w-[min(96vw,860px)]">
          <div className="glass rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-stretch gap-5">
            <Slider label="Intensity" value={intensity} onChange={setIntensity} />
            <div className="hidden sm:block w-px bg-white/10" />
            <Slider label="Spatial Depth" value={depth} onChange={setDepth} />
            <div className="hidden sm:block w-px bg-white/10" />
            <Toggle label="Binaural" value={binaural} onChange={setBinaural} />
            <Toggle label="Adaptive" value={adaptive} onChange={setAdaptive} />
          </div>
        </div>
      )}
    </main>
  );
}

function ReactiveSphere({ hue, active }: { hue: number; active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const analyser = wavesEngine.analyserNode;
    const data = analyser ? new Uint8Array(analyser.fftSize) : null;
    const freqData = analyser ? new Uint8Array(analyser.frequencyBinCount) : null;
    let smoothedAmp = 0;
    let smoothedLow = 0;
    let t0 = performance.now();
    const tick = () => {
      let amp = 0, low = 0, high = 0;
      if (analyser && data && freqData) {
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) { const v = (data[i] - 128) / 128; sum += v * v; }
        amp = Math.sqrt(sum / data.length);
        analyser.getByteFrequencyData(freqData);
        const mid = Math.floor(freqData.length / 3);
        for (let i = 0; i < mid; i++) low += freqData[i];
        for (let i = mid * 2; i < freqData.length; i++) high += freqData[i];
        low /= mid * 255; high /= mid * 255;
      }
      smoothedAmp = smoothedAmp * 0.85 + amp * 0.15;
      smoothedLow = smoothedLow * 0.9 + low * 0.1;
      const dt = (performance.now() - t0) / 1000;
      const breathe = (Math.sin(dt * 0.6) + 1) / 2; // 0..1
      if (ref.current) {
        const scale = 1 + smoothedAmp * 0.4 + breathe * 0.03;
        const glow = 140 + smoothedAmp * 420 + smoothedLow * 80;
        ref.current.style.transform = `scale(${scale.toFixed(3)})`;
        ref.current.style.boxShadow = `0 0 ${glow}px oklch(0.72 0.2 ${hue} / 0.55)`;
      }
      if (innerRef.current) {
        const def = 1 + (high - low) * 0.06;
        innerRef.current.style.transform = `scale(${def.toFixed(3)}) rotate(${(dt * 4) % 360}deg)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, hue]);

  return (
    <div className="relative h-[50vmin] w-[50vmin] max-h-[560px] max-w-[560px]">
      <div ref={ref} className="absolute inset-0 rounded-full transition-[box-shadow] duration-300"
        style={{
          background: `radial-gradient(circle at 35% 30%, oklch(0.95 0.08 ${hue}), oklch(0.55 0.18 ${hue}) 60%, transparent 92%)`,
          filter: "blur(1px)",
        }} />
      <div ref={innerRef} className="absolute inset-[10%] rounded-full pointer-events-none transition-transform duration-200"
        style={{
          background: `radial-gradient(circle at 65% 70%, oklch(0.9 0.1 ${(hue + 40) % 360} / 0.35), transparent 60%)`,
          filter: "blur(6px)",
        }} />
      {!active && <div className="absolute inset-0 rounded-full animate-breathe"
        style={{ background: `radial-gradient(circle, oklch(0.7 0.18 ${hue} / 0.35), transparent 70%)`, filter: "blur(40px)" }} />}
      <div className="absolute inset-[6%] rounded-full border border-white/10 animate-orbit-slow" />
      <div className="absolute inset-[18%] rounded-full border border-white/5" />
    </div>
  );
}

function Slider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="flex-1 min-w-0 flex flex-col gap-2">
      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
        <span>{label}</span><span className="font-mono text-foreground/80">{value}</span>
      </div>
      <input type="range" min={0} max={100} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full appearance-none h-1 rounded-full bg-white/10
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:shadow-[0_0_12px_var(--aurora)]" />
    </label>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)} className="flex flex-col items-start gap-2 px-2" aria-pressed={value}>
      <span className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">{label}</span>
      <span className={`relative h-5 w-10 rounded-full transition-colors ${value ? "bg-accent/60" : "bg-white/10"}`}>
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-foreground shadow transition-all ${value ? "left-[22px] shadow-[0_0_10px_var(--aurora)]" : "left-0.5"}`} />
      </span>
    </button>
  );
}
