import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { EMOTIONS, type Emotion } from "@/lib/waves-data";

/**
 * Sound Spaces — six living blobs orbiting a breathing core.
 * Organic asymmetric placement (not a clock face).
 * Center reacts when you hover any node (magnetic / energy-transfer).
 */

// Symmetrical orbital positions (percent).
// Six emotional spaces evenly distributed around a central listening environment.
// The composition communicates balance, resonance, and emotional equilibrium.
const POSITIONS: Array<{ x: number; y: number; scale: number }> = [
  { x: 50, y: 14, scale: 1.05 }, // FOCUS — Top Center
  { x: 82, y: 32, scale: 0.95 }, // GROUND — Upper Right
  { x: 82, y: 68, scale: 1.0 },  // FLOAT — Lower Right
  { x: 50, y: 86, scale: 1.1 },  // RELEASE — Bottom Center
  { x: 18, y: 68, scale: 0.92 }, // NEST — Lower Left
  { x: 18, y: 32, scale: 1.0 },  // RECALL — Upper Left
];

export function Constellation() {
  const [hover, setHover] = useState<string | null>(null);
  const active = EMOTIONS.find((e) => e.id === hover);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[820px]">
      {/* faint orbital rings */}
      <div aria-hidden className="absolute inset-0 rounded-full border border-white/[0.04] animate-orbit-slow" />
      <div aria-hidden className="absolute inset-[12%] rounded-full border border-white/[0.035]" />
      <div aria-hidden className="absolute inset-[26%] rounded-full border border-white/[0.025]" />

      {/* CENTER — emotional heart */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div
          className={`relative h-64 w-64 sm:h-72 sm:w-72 transition-transform duration-[1200ms] ease-out ${
            active ? "scale-[1.08]" : "scale-100"
          }`}
        >
          {/* outer atmospheric bloom */}
          <div
            className="absolute -inset-8 rounded-full animate-breathe"
            style={{
              background: active
                ? `radial-gradient(circle, oklch(0.85 0.18 ${active.hue} / 0.55), transparent 70%)`
                : "radial-gradient(circle, color-mix(in oklab, var(--aurora) 45%, transparent), transparent 70%)",
              filter: "blur(40px)",
              transition: "background 1100ms ease",
            }}
          />
          {/* hover resonance ripple */}
          {active && (
            <div
              key={active.id}
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                animation: "ripple 2.2s ease-out infinite",
                border: `1px solid oklch(0.85 0.14 ${active.hue} / 0.4)`,
              }}
            />
          )}
          {/* surface */}
          <div
            className="absolute inset-6 rounded-full animate-breathe-soft"
            style={{
              background: `radial-gradient(circle at 32% 28%, color-mix(in oklab, white 28%, transparent), color-mix(in oklab, ${
                active ? `oklch(0.78 0.16 ${active.hue})` : "var(--aurora)"
              } 42%, transparent) 58%, transparent 86%)`,
              boxShadow:
                "inset 0 0 80px color-mix(in oklab, white 12%, transparent), 0 0 120px color-mix(in oklab, var(--aurora) 38%, transparent)",
              border: "1px solid color-mix(in oklab, white 12%, transparent)",
              transition: "background 1100ms ease",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center select-none px-6">
              <div className="text-[10px] uppercase tracking-[0.36em] text-foreground/55">
                {active ? "Enter" : "Listening"}
              </div>
              <div className="font-display text-2xl sm:text-3xl mt-2 text-foreground/95 leading-tight tracking-[0.04em]">
                {active ? active.name : "What do you need?"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {EMOTIONS.map((e, i) => {
        const p = POSITIONS[i] ?? { x: 50, y: 50, scale: 1 };
        return (
          <Node
            key={e.id}
            e={e}
            x={p.x}
            y={p.y}
            scale={p.scale}
            i={i}
            onHover={setHover}
            active={hover === e.id}
            anyHover={!!hover && hover !== e.id}
          />
        );
      })}

      <style>{`
        @keyframes ripple {
          0%   { transform: scale(1);    opacity: 0.55; }
          100% { transform: scale(1.55); opacity: 0;    }
        }
        @keyframes orbital-drift {
          0%, 100% { transform: translate(-50%, -50%) translate(0, 0); }
          25%      { transform: translate(-50%, -50%) translate(8px, -6px); }
          50%      { transform: translate(-50%, -50%) translate(-6px, 10px); }
          75%      { transform: translate(-50%, -50%) translate(-10px, -8px); }
        }
      `}</style>
    </div>
  );
}

function Node({
  e, x, y, scale, i, onHover, active, anyHover,
}: {
  e: Emotion; x: number; y: number; scale: number; i: number;
  onHover: (id: string | null) => void; active: boolean; anyHover: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.setProperty("--drift-delay", `-${i * 4.1}s`);
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
        left: `${x}%`,
        top: `${y}%`,
        animation: `orbital-drift ${34 + (i % 4) * 7}s ease-in-out infinite`,
        animationDelay: `var(--drift-delay)`,
        transform: "translate(-50%, -50%)",
      }}
      aria-label={`${e.name} — ${e.description}`}
    >
      <div
        className={`relative transition-transform duration-[900ms] ease-out ${
          active ? "scale-[1.35]" : anyHover ? "scale-[0.92] opacity-70" : "scale-100"
        }`}
        style={{ ["--node-scale" as never]: scale }}
      >
        {/* magnetic bloom */}
        <div
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-[900ms]
            ${active ? "h-56 w-56 opacity-100" : "h-28 w-28 opacity-55"}`}
          style={{
            background: `radial-gradient(circle, oklch(0.85 0.20 ${e.hue} / 0.75), transparent 70%)`,
            filter: "blur(24px)",
          }}
        />
        {/* blob */}
        <div
          className="relative rounded-full animate-breathe-soft"
          style={{
            width: `${64 * scale}px`,
            height: `${64 * scale}px`,
            background: `radial-gradient(circle at 30% 26%, oklch(0.96 0.08 ${e.hue}), oklch(0.55 0.18 ${e.hue}) 62%, oklch(0.28 0.10 ${e.hue}) 100%)`,
            boxShadow: `0 0 ${active ? 80 : 32}px oklch(0.7 0.22 ${e.hue} / ${active ? 0.9 : 0.5}), inset 0 0 16px color-mix(in oklab, white 38%, transparent)`,
            animationDelay: `-${i * 1.6}s`,
            transition: "box-shadow 900ms ease, width 600ms ease, height 600ms ease",
          }}
        />
        {/* label */}
        <div
          className={`absolute left-1/2 top-full mt-5 -translate-x-1/2 whitespace-nowrap text-[10px] uppercase tracking-[0.32em] transition-all duration-500
            ${active ? "opacity-100 text-foreground" : "opacity-60 text-muted-foreground group-hover:opacity-100"}`}
        >
          {e.name}
        </div>
      </div>
    </Link>
  );
}
