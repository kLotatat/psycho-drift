import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import { Atmosphere } from "@/components/Atmosphere";
import { MODULES } from "@/lib/waves-data";
import { wavesEngine } from "@/lib/audio-engine";

export const Route = createFileRoute("/session/$emotion")({
  head: ({ params }) => {
    const m = MODULES.find((x) => x.id === params.emotion);
    return {
      meta: [
        { title: m ? `WAVES — ${m.name} session` : "WAVES — Session" },
        { name: "description", content: m ? `${m.purpose}` : "An active WAVES session." },
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
  useEngine();

  const begin = async () => {
    wavesEngine.setIntensity(intensity / 100);
    wavesEngine.setDepth(depth / 100);
    wavesEngine.setBinaural(binaural);
    await wavesEngine.start(module.id);
    setStarted(true);
  };

  useEffect(() => () => { wavesEngine.stop(); }, []);
  useEffect(() => { if (started) wavesEngine.setIntensity(intensity / 100); }, [intensity, started]);
  useEffect(() => { if (started) wavesEngine.setDepth(depth / 100); }, [depth, started]);
  useEffect(() => { if (started) wavesEngine.setBinaural(binaural); }, [binaural, started]);

  useEffect(() => {
    if (!started) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [started]);

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
        <div className="text-[11px] uppercase tracking-[0.32em] text-muted-foreground">
          <span className="text-foreground/90">{module.name}</span> · {module.freqLabel}
        </div>
        <Link to="/reflect" className="text-[11px] uppercase tracking-[0.32em] text-muted-foreground hover:text-foreground transition">
          End & Reflect →
        </Link>
      </header>

      <section className="relative min-h-dvh flex flex-col items-center justify-center px-6">
        <ReactiveSphere hue={hue} active={started} />
        <div className="mt-12 text-center">
          <div className="text-[10px] uppercase tracking-[0.36em] text-foreground/60">{started ? "Resonating" : "Ready"}</div>
          <div className="mt-3 font-display text-5xl sm:text-6xl text-foreground/95">{module.name}</div>
          <div className="mt-4 font-mono text-sm text-foreground/70">{mm}:{ss}</div>
          <p className="mt-8 max-w-md mx-auto text-sm text-muted-foreground leading-relaxed">{module.purpose}</p>
        </div>

        {!started && (
          <button onClick={begin}
            className="mt-12 glass rounded-full px-8 py-4 text-sm tracking-[0.22em] uppercase text-foreground/95 hover:bg-white/[0.06] transition">
            Enter the field
          </button>
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
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const analyser = wavesEngine.analyserNode;
    const data = analyser ? new Uint8Array(analyser.fftSize) : null;
    const tick = () => {
      let amp = 0;
      if (analyser && data) {
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) { const v = (data[i] - 128) / 128; sum += v * v; }
        amp = Math.sqrt(sum / data.length);
      }
      if (ref.current) {
        const scale = 1 + amp * 0.35;
        const glow = 120 + amp * 380;
        ref.current.style.transform = `scale(${scale.toFixed(3)})`;
        ref.current.style.boxShadow = `0 0 ${glow}px oklch(0.7 0.2 ${hue} / 0.55)`;
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
