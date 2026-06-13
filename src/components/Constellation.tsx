import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { EMOTIONS, type Emotion } from "@/lib/waves-data";

/** The celestial emotional constellation. Eight planetary nodes around a breathing core. */
export function Constellation() {
  const [hover, setHover] = useState<string | null>(null);
  const active = EMOTIONS.find((e) => e.id === hover);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[720px]">
      {/* outer orbital ring */}
      <div aria-hidden className="absolute inset-0 rounded-full border border-white/5 animate-orbit-slow" />
      <div aria-hidden className="absolute inset-[8%] rounded-full border border-white/5" />
      <div aria-hidden className="absolute inset-[18%] rounded-full border border-white/[0.04]" />

      {/* central breathing core */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative h-44 w-44 sm:h-56 sm:w-56">
          <div className="absolute inset-0 rounded-full animate-breathe"
            style={{
              background: active
                ? `radial-gradient(circle, oklch(0.85 0.14 ${active.hue} / 0.55), transparent 70%)`
                : "radial-gradient(circle, color-mix(in oklab, var(--aurora) 45%, transparent), transparent 70%)",
              filter: "blur(24px)",
            }} />
          <div className="absolute inset-6 rounded-full animate-breathe-soft"
            style={{
              background: "radial-gradient(circle at 35% 30%, color-mix(in oklab, white 18%, transparent), color-mix(in oklab, var(--aurora) 35%, transparent) 60%, transparent 85%)",
              boxShadow: "inset 0 0 60px color-mix(in oklab, white 8%, transparent), 0 0 80px color-mix(in oklab, var(--aurora) 30%, transparent)",
              border: "1px solid color-mix(in oklab, white 10%, transparent)",
            }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center select-none">
              <div className="text-[10px] uppercase tracking-[0.32em] text-foreground/60">Core</div>
              <div className="font-display text-2xl mt-1 text-foreground/90">
                {active ? active.name : "Listen"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* emotional nodes positioned on orbit */}
      {EMOTIONS.map((e, i) => {
        const angle = (i / EMOTIONS.length) * Math.PI * 2 - Math.PI / 2;
        const r = 44; // % radius
        const x = 50 + Math.cos(angle) * r;
        const y = 50 + Math.sin(angle) * r;
        return <Node key={e.id} e={e} x={x} y={y} onHover={setHover} active={hover === e.id} />;
      })}

      {/* hover detail */}
      <div className="pointer-events-none absolute inset-x-0 -bottom-2 flex justify-center">
        <div className={`glass-soft rounded-full px-4 py-2 text-xs text-muted-foreground transition-opacity duration-700 ${active ? "opacity-100" : "opacity-0"}`}>
          {active && <><span className="text-foreground/90">{active.name}</span> · {active.frequency} · enters <span className="text-foreground/90">{active.module}</span></>}
        </div>
      </div>
    </div>
  );
}

function Node({ e, x, y, onHover, active }: { e: Emotion; x: number; y: number; onHover: (id: string | null) => void; active: boolean }) {
  return (
    <Link
      to="/session/$emotion"
      params={{ emotion: e.id }}
      onMouseEnter={() => onHover(e.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(e.id)}
      onBlur={() => onHover(null)}
      className="group absolute -translate-x-1/2 -translate-y-1/2 outline-none"
      style={{ left: `${x}%`, top: `${y}%` }}
      aria-label={`Enter ${e.name} — ${e.description}`}
    >
      <div className="relative">
        {/* bloom */}
        <div
          className={`absolute -inset-6 rounded-full transition-all duration-700 ${active ? "opacity-100 scale-125" : "opacity-50 scale-100"}`}
          style={{
            background: `radial-gradient(circle, oklch(0.85 0.16 ${e.hue} / 0.55), transparent 70%)`,
            filter: "blur(14px)",
          }}
        />
        {/* planet */}
        <div
          className={`relative h-4 w-4 sm:h-5 sm:w-5 rounded-full transition-all duration-700 ${active ? "scale-125" : "scale-100"} animate-breathe-soft`}
          style={{
            background: `radial-gradient(circle at 30% 30%, oklch(0.95 0.08 ${e.hue}), oklch(0.55 0.16 ${e.hue}))`,
            boxShadow: `0 0 24px oklch(0.7 0.18 ${e.hue} / 0.55), inset 0 0 8px color-mix(in oklab, white 30%, transparent)`,
            animationDelay: `-${(e.hue % 8)}s`,
          }}
        />
        {/* label */}
        <div
          className={`absolute left-1/2 top-full mt-3 -translate-x-1/2 whitespace-nowrap text-[11px] uppercase tracking-[0.24em] transition-opacity duration-500 ${active ? "opacity-100 text-foreground" : "opacity-60 text-muted-foreground group-hover:opacity-100"}`}
        >
          {e.name}
        </div>
      </div>
    </Link>
  );
}
