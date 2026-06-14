import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { EMOTIONS, type Emotion } from "@/lib/waves-data";

/**
 * Sound Spaces — six living blobs orbiting a breathing core.
 * Center reacts when you hover any node (magnetic / energy-transfer).
 */
export function Constellation() {
  const [hover, setHover] = useState<string | null>(null);
  const active = EMOTIONS.find((e) => e.id === hover);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[760px]">
      <div aria-hidden className="absolute inset-0 rounded-full border border-white/5 animate-orbit-slow" />
      <div aria-hidden className="absolute inset-[10%] rounded-full border border-white/5" />
      <div aria-hidden className="absolute inset-[22%] rounded-full border border-white/[0.04]" />

      {/* central breathing core */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className={`relative h-56 w-56 sm:h-64 sm:w-64 transition-transform duration-700 ${active ? "scale-110" : "scale-100"}`}>
          {/* outer ripple — strengthens on hover */}
          <div className="absolute inset-0 rounded-full animate-breathe"
            style={{
              background: active
                ? `radial-gradient(circle, oklch(0.85 0.16 ${active.hue} / 0.7), transparent 70%)`
                : "radial-gradient(circle, color-mix(in oklab, var(--aurora) 50%, transparent), transparent 70%)",
              filter: "blur(28px)",
              transition: "background 900ms ease",
            }} />
          {/* expanding hover ripple */}
          {active && (
            <div key={active.id} className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                animation: "ripple 1.8s ease-out infinite",
                border: `1px solid oklch(0.85 0.14 ${active.hue} / 0.45)`,
              }} />
          )}
          <div className="absolute inset-6 rounded-full animate-breathe-soft"
            style={{
              background: `radial-gradient(circle at 35% 30%, color-mix(in oklab, white 22%, transparent), color-mix(in oklab, ${active ? `oklch(0.75 0.16 ${active.hue})` : "var(--aurora)"} 40%, transparent) 60%, transparent 85%)`,
              boxShadow: "inset 0 0 70px color-mix(in oklab, white 10%, transparent), 0 0 100px color-mix(in oklab, var(--aurora) 35%, transparent)",
              border: "1px solid color-mix(in oklab, white 12%, transparent)",
              transition: "background 900ms ease",
            }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center select-none px-6">
              <div className="text-[10px] uppercase tracking-[0.32em] text-foreground/60">
                {active ? "Enter" : "Listening"}
              </div>
              <div className="font-display text-2xl sm:text-3xl mt-1 text-foreground/95 leading-tight">
                {active ? active.name : "What do you need?"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {EMOTIONS.map((e, i) => {
        const angle = (i / EMOTIONS.length) * Math.PI * 2 - Math.PI / 2;
        const r = 42;
        const x = 50 + Math.cos(angle) * r;
        const y = 50 + Math.sin(angle) * r;
        return (
          <Node key={e.id} e={e} x={x} y={y} i={i}
            onHover={setHover} active={hover === e.id}
            anyHover={!!hover && hover !== e.id} />
        );
      })}

      <style>{`
        @keyframes ripple {
          0% { transform: scale(1); opacity: 0.7; }
          100% { transform: scale(1.45); opacity: 0; }
        }
        @keyframes orbital-drift {
          0%, 100% { transform: translate(-50%, -50%) translate(0, 0); }
          25%      { transform: translate(-50%, -50%) translate(6px, -4px); }
          50%      { transform: translate(-50%, -50%) translate(-4px, 8px); }
          75%      { transform: translate(-50%, -50%) translate(-8px, -6px); }
        }
      `}</style>
    </div>
  );
}

function Node({ e, x, y, i, onHover, active, anyHover }: {
  e: Emotion; x: number; y: number; i: number;
  onHover: (id: string | null) => void; active: boolean; anyHover: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  // Slight magnetic offset when hovered, subtle recoil for neighbors.
  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.setProperty("--drift-delay", `-${i * 3.7}s`);
  }, [i]);

  return (
    <Link
      ref={ref}
      to="/session/$emotion"
      params={{ emotion: e.id }}
      onMouseEnter={() => onHover(e.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(e.id)}
      onBlur={() => onHover(null)}
      className="group absolute outline-none"
      style={{
        left: `${x}%`, top: `${y}%`,
        animation: `orbital-drift ${28 + (i % 4) * 6}s ease-in-out infinite`,
        animationDelay: `var(--drift-delay)`,
        transform: "translate(-50%, -50%)",
      }}
      aria-label={`${e.name} — ${e.description}`}
    >
      <div className={`relative transition-transform duration-700 ${active ? "scale-125" : anyHover ? "scale-95 opacity-80" : "scale-100"}`}>
        {/* magnetic bloom */}
        <div
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-700
            ${active ? "h-44 w-44 opacity-100" : "h-24 w-24 opacity-60"}`}
          style={{
            background: `radial-gradient(circle, oklch(0.85 0.18 ${e.hue} / 0.7), transparent 70%)`,
            filter: "blur(20px)",
          }}
        />
        {/* blob */}
        <div
          className="relative h-12 w-12 sm:h-14 sm:w-14 rounded-full animate-breathe-soft"
          style={{
            background: `radial-gradient(circle at 30% 28%, oklch(0.95 0.08 ${e.hue}), oklch(0.55 0.18 ${e.hue}) 65%, oklch(0.3 0.1 ${e.hue}) 100%)`,
            boxShadow: `0 0 ${active ? 60 : 28}px oklch(0.7 0.2 ${e.hue} / ${active ? 0.85 : 0.5}), inset 0 0 14px color-mix(in oklab, white 35%, transparent)`,
            animationDelay: `-${i * 1.3}s`,
            transition: "box-shadow 700ms ease",
          }}
        />
        <div
          className={`absolute left-1/2 top-full mt-4 -translate-x-1/2 whitespace-nowrap text-[11px] uppercase tracking-[0.26em] transition-all duration-500
            ${active ? "opacity-100 text-foreground" : "opacity-70 text-muted-foreground group-hover:opacity-100"}`}
        >
          {e.name}
        </div>
      </div>
    </Link>
  );
}
