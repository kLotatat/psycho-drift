import { useEffect, useState } from "react";

const KEY = "waves.headphone-notice";

export function HeadphoneModal() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    try { if (!localStorage.getItem(KEY)) setOpen(true); } catch { /* ignore */ }
  }, []);

  const close = (remember: boolean) => {
    try { if (remember) localStorage.setItem(KEY, "dismissed"); } catch { /* ignore */ }
    setOpen(false);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-background/70 backdrop-blur-md animate-[fade-in_0.4s_ease-out]" onClick={() => close(false)} />
      <div className="relative max-w-md w-full glass rounded-3xl p-8 text-center animate-rise">
        <div className="mx-auto h-14 w-14 rounded-full grid place-items-center"
          style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--aurora) 50%, transparent), transparent 70%)" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-foreground/90">
            <path d="M4 14v-2a8 8 0 0116 0v2" />
            <rect x="3" y="14" width="4" height="6" rx="1.5" />
            <rect x="17" y="14" width="4" height="6" rx="1.5" />
          </svg>
        </div>
        <div className="mt-5 text-[10px] uppercase tracking-[0.32em] text-accent/80">Recommended Experience</div>
        <h2 className="mt-3 font-display text-3xl text-foreground/95">For the best experience, use headphones.</h2>
        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
          WAVES uses spatial audio, binaural layers, and adaptive sound environments
          designed to be experienced through stereo listening.
        </p>
        <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => close(false)}
            className="glass rounded-full px-6 py-3 text-sm tracking-wide text-foreground hover:bg-white/[0.08] transition">
            Continue
          </button>
          <button onClick={() => close(true)}
            className="rounded-full px-6 py-3 text-sm tracking-wide text-muted-foreground hover:text-foreground transition">
            Don't show again
          </button>
        </div>
      </div>
    </div>
  );
}
