import { useEffect, useState } from "react";
import { loadLayers } from "@/lib/memory-store";

type Phase = "Active" | "Learning" | "Adapting" | "Personalized";

function derivePhase(): Phase {
  if (typeof window === "undefined") return "Active";
  const layers = loadLayers().length;
  const sessions = Number(localStorage.getItem("waves.sessions.count") || 0);
  if (layers >= 4 && sessions >= 6) return "Personalized";
  if (layers >= 2 || sessions >= 3) return "Adapting";
  if (layers >= 1 || sessions >= 1) return "Learning";
  return "Active";
}

export function AdaptiveIntelligence() {
  const [phase, setPhase] = useState<Phase>("Active");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setPhase(derivePhase());
    const onStorage = () => setPhase(derivePhase());
    window.addEventListener("storage", onStorage);
    const t = window.setInterval(() => setPhase(derivePhase()), 30_000);
    return () => { window.removeEventListener("storage", onStorage); clearInterval(t); };
  }, []);

  return (
    <div
      className="fixed right-5 z-30 select-none hidden md:block"
      style={{ top: "calc(env(safe-area-inset-top, 0px) + 22px)" }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {/* Capsule — quieter than nav, signature heartbeat */}
      <button
        type="button"
        aria-label={`Adaptive Intelligence · ${phase}`}
        className="group relative flex items-center gap-2 rounded-full glass-soft px-3 py-1.5 text-[10px] uppercase tracking-[0.32em] text-foreground/55 hover:text-foreground/90 transition-colors"
      >
        <span className="relative inline-flex h-1.5 w-1.5">
          <span
            className="absolute inset-0 rounded-full animate-breathe-soft"
            style={{ background: "color-mix(in oklab, var(--aurora) 70%, transparent)", filter: "blur(4px)" }}
          />
          <span
            className="relative inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: "color-mix(in oklab, var(--aurora) 90%, white 10%)" }}
          />
        </span>
        <span className="hidden sm:inline">Adaptive Intelligence</span>
        <span className="hidden sm:inline text-foreground/30">·</span>
        <span className="text-foreground/45">{phase}</span>
      </button>

      {/* Expanded panel */}
      <div
        className={`pointer-events-none absolute right-0 top-[calc(100%+10px)] w-[300px] origin-top-right transition-all duration-500 ${
          open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
        }`}
        role="tooltip"
      >
        <div className="glass rounded-2xl p-5 relative overflow-hidden">
          <div
            aria-hidden
            className="absolute -top-10 -right-10 h-32 w-32 rounded-full opacity-30 animate-breathe-soft"
            style={{
              background: "radial-gradient(circle, color-mix(in oklab, var(--aurora) 60%, transparent), transparent 70%)",
              filter: "blur(28px)",
            }}
          />
          <div className="relative">
            <div className="text-[10px] uppercase tracking-[0.32em] text-accent/80">
              Adaptive Intelligence
            </div>
            <p className="mt-3 text-sm text-foreground/85 leading-relaxed">
              WAVES quietly learns from how you listen — the rooms you return to, the layers you bring in, the memories you keep close — and slowly attunes itself to you.
            </p>
            <div className="mt-4 flex items-center justify-between text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
              <span>Status</span>
              <span className="text-foreground/70">{phase}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
