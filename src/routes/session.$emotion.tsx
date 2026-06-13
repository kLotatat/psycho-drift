import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Atmosphere } from "@/components/Atmosphere";
import { EMOTIONS } from "@/lib/waves-data";

export const Route = createFileRoute("/session/$emotion")({
  head: ({ params }) => {
    const e = EMOTIONS.find((x) => x.id === params.emotion);
    return {
      meta: [
        { title: e ? `WAVES — ${e.name} session` : "WAVES — Session" },
        { name: "description", content: e ? `${e.description}` : "An active WAVES session." },
      ],
    };
  },
  loader: ({ params }) => {
    const e = EMOTIONS.find((x) => x.id === params.emotion);
    if (!e) throw notFound();
    return { emotion: e };
  },
  component: Session,
  notFoundComponent: () => (
    <div className="min-h-dvh flex items-center justify-center text-foreground">
      <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">Return to the constellation</Link>
    </div>
  ),
});

function Session() {
  const { emotion } = Route.useLoaderData();
  const [seconds, setSeconds] = useState(0);
  const [intensity, setIntensity] = useState(50);
  const [depth, setDepth] = useState(60);
  const [binaural, setBinaural] = useState(true);
  const [adaptive, setAdaptive] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const hue = emotion.hue;

  return (
    <main className="relative min-h-dvh overflow-hidden text-foreground">
      <Atmosphere />

      {/* state-tinted atmosphere */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-0">
        <div className="absolute inset-0 animate-aurora"
          style={{ background: `radial-gradient(60rem 50rem at 50% 40%, oklch(0.7 0.18 ${hue} / 0.28), transparent 70%)`, filter: "blur(40px)" }} />
        <div className="absolute inset-0 animate-aurora" style={{ animationDelay: "-10s",
          background: `radial-gradient(40rem 35rem at 30% 80%, oklch(0.55 0.18 ${(hue + 60) % 360} / 0.22), transparent 70%)`, filter: "blur(60px)" }} />
      </div>

      {/* top bar */}
      <header className="fixed top-0 inset-x-0 z-40 px-6 lg:px-10 py-5 flex items-center justify-between">
        <Link to="/" className="text-[11px] uppercase tracking-[0.32em] text-muted-foreground hover:text-foreground transition">
          ← Exit session
        </Link>
        <div className="text-[11px] uppercase tracking-[0.32em] text-muted-foreground">
          <span className="text-foreground/90">{emotion.name}</span> · {emotion.module} · {emotion.frequency}
        </div>
        <Link to="/reflect" className="text-[11px] uppercase tracking-[0.32em] text-muted-foreground hover:text-foreground transition">
          End & Reflect →
        </Link>
      </header>

      {/* hero sphere */}
      <section className="relative min-h-dvh flex flex-col items-center justify-center px-6">
        <div className="relative h-[60vmin] w-[60vmin] max-h-[640px] max-w-[640px]">
          <div className="absolute inset-0 rounded-full animate-breathe"
            style={{
              background: `radial-gradient(circle at 35% 30%, oklch(0.95 0.1 ${hue}), oklch(0.55 0.18 ${hue}) 60%, transparent 90%)`,
              boxShadow: `0 0 200px oklch(0.65 0.2 ${hue} / 0.55)`,
              filter: "blur(2px)",
            }} />
          <div className="absolute inset-[6%] rounded-full border border-white/10 animate-orbit-slow" />
          <div className="absolute inset-[14%] rounded-full border border-white/5" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <div className="text-[10px] uppercase tracking-[0.36em] text-foreground/70">Resonating</div>
            <div className="mt-3 font-display text-5xl sm:text-6xl text-foreground/95">{emotion.name}</div>
            <div className="mt-4 font-mono text-sm text-foreground/70">{mm}:{ss}</div>
          </div>
        </div>

        <p className="mt-12 max-w-md text-center text-sm text-muted-foreground leading-relaxed">{emotion.description}</p>
      </section>

      {/* floating glass instruments */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 w-[min(96vw,820px)]">
        <div className="glass rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-stretch gap-5">
          <Slider label="Intensity" value={intensity} onChange={setIntensity} />
          <div className="hidden sm:block w-px bg-white/10" />
          <Slider label="Spatial Depth" value={depth} onChange={setDepth} />
          <div className="hidden sm:block w-px bg-white/10" />
          <Toggle label="Binaural" value={binaural} onChange={setBinaural} />
          <Toggle label="Adaptive" value={adaptive} onChange={setAdaptive} />
        </div>
      </div>
    </main>
  );
}

function Slider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="flex-1 min-w-0 flex flex-col gap-2">
      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
        <span>{label}</span>
        <span className="font-mono text-foreground/80">{value}</span>
      </div>
      <input
        type="range" min={0} max={100} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full appearance-none h-1 rounded-full bg-white/10 accent-accent
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:shadow-[0_0_12px_var(--aurora)]"
      />
    </label>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="flex flex-col items-start gap-2 px-2"
      aria-pressed={value}
    >
      <span className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">{label}</span>
      <span className={`relative h-5 w-10 rounded-full transition-colors ${value ? "bg-accent/60" : "bg-white/10"}`}>
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-foreground shadow transition-all ${value ? "left-[22px] shadow-[0_0_10px_var(--aurora)]" : "left-0.5"}`} />
      </span>
    </button>
  );
}
