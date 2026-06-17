import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { MODULES } from "@/lib/waves-data";

const KEY = "waves.onboarded.v1";
const LEGACY = "waves.headphone-notice";

type Step = 0 | 1 | 2 | 3;

/**
 * First-time user flow.
 * 0 · Welcome (what is WAVES)
 * 1 · Headphone recommendation
 * 2 · Choose a sound space
 * 3 · Begin
 *
 * Replaces the standalone headphone modal. Minimal, elegant, single-modal flow.
 */
export function Onboarding() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>(0);

  useEffect(() => {
    try {
      const seen = localStorage.getItem(KEY) || localStorage.getItem(LEGACY);
      if (!seen) setOpen(true);
    } catch { /* ignore */ }
  }, []);

  const close = () => {
    try { localStorage.setItem(KEY, "1"); } catch { /* ignore */ }
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-5 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to WAVES"
    >
      <div className="absolute inset-0 bg-background/85 backdrop-blur-xl animate-[fade-in_0.5s_ease-out]" />

      <div
        className="relative w-full max-w-md glass rounded-3xl p-7 sm:p-9 animate-rise"
        style={{
          marginTop: "env(safe-area-inset-top)",
          marginBottom: "env(safe-area-inset-bottom)",
        }}
      >
        {/* progress dots */}
        <div className="flex items-center justify-center gap-2 mb-7">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === step ? "w-8 bg-foreground/80" : "w-1.5 bg-foreground/20"
              }`}
            />
          ))}
        </div>

        {step === 0 && (
          <StepWrap eyebrow="Welcome" title="WAVES">
            <p className="mt-4 text-[15px] text-muted-foreground leading-relaxed">
              An adaptive psychoacoustic instrument. Six tuned acoustic rooms for attention,
              memory, and feeling.
            </p>
            <p className="mt-3 text-[15px] text-muted-foreground leading-relaxed">
              Step inside one. Stay awhile. Return when ready.
            </p>
            <Actions onSkip={close} onNext={() => setStep(1)} nextLabel="Begin" />
          </StepWrap>
        )}

        {step === 1 && (
          <StepWrap eyebrow="Recommended" title="Use headphones.">
            <div
              className="mx-auto mt-5 h-16 w-16 rounded-full grid place-items-center"
              style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--aurora) 50%, transparent), transparent 70%)" }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-foreground/90">
                <path d="M4 14v-2a8 8 0 0116 0v2" />
                <rect x="3" y="14" width="4" height="6" rx="1.5" />
                <rect x="17" y="14" width="4" height="6" rx="1.5" />
              </svg>
            </div>
            <p className="mt-5 text-[15px] text-muted-foreground leading-relaxed text-center">
              WAVES uses spatial audio, binaural layers, and adaptive sound environments
              designed for stereo listening.
            </p>
            <Actions onSkip={close} onBack={() => setStep(0)} onNext={() => setStep(2)} />
          </StepWrap>
        )}

        {step === 2 && (
          <StepWrap eyebrow="Choose a space" title="Where do you want to be?">
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              You can change at any time.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              {MODULES.map((m) => (
                <Link
                  key={m.id}
                  to="/session/$emotion"
                  params={{ emotion: m.id }}
                  onClick={close}
                  className="group relative rounded-2xl glass-soft px-4 py-4 text-left hover:bg-white/[0.05] transition overflow-hidden"
                >
                  <span
                    className="absolute -top-8 -right-8 h-20 w-20 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"
                    style={{
                      background: `radial-gradient(circle, oklch(0.78 0.16 ${m.hue} / 0.55), transparent 70%)`,
                      filter: "blur(14px)",
                    }}
                  />
                  <span className="relative font-display text-base tracking-[0.18em] text-foreground/90 block">
                    {m.name}
                  </span>
                  <span className="relative text-[10px] uppercase tracking-[0.24em] text-muted-foreground mt-1 block">
                    {m.freqLabel}
                  </span>
                </Link>
              ))}
            </div>
            <Actions onSkip={close} onBack={() => setStep(1)} onNext={() => setStep(3)} nextLabel="Later" />
          </StepWrap>
        )}

        {step === 3 && (
          <StepWrap eyebrow="Ready" title="Listen. Reflect. Return.">
            <p className="mt-4 text-[15px] text-muted-foreground leading-relaxed text-center">
              WAVES remembers how you listen — quietly, without analytics — and slowly attunes to you.
            </p>
            <div className="mt-7 flex justify-center">
              <button
                onClick={close}
                className="glass rounded-full px-7 py-3 text-sm tracking-[0.18em] uppercase text-foreground hover:bg-white/[0.08] transition"
              >
                Enter WAVES
              </button>
            </div>
          </StepWrap>
        )}
      </div>
    </div>
  );
}

function StepWrap({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <div className="text-center">
      <div className="text-[10px] uppercase tracking-[0.36em] text-accent/80">{eyebrow}</div>
      <h2 className="mt-3 font-display text-3xl sm:text-4xl text-foreground/95 leading-tight">{title}</h2>
      <div className="text-left">{children}</div>
    </div>
  );
}

function Actions({
  onSkip, onBack, onNext, nextLabel = "Continue",
}: { onSkip: () => void; onBack?: () => void; onNext: () => void; nextLabel?: string }) {
  return (
    <div className="mt-7 flex items-center justify-between gap-3">
      <button
        onClick={onSkip}
        className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground hover:text-foreground transition px-2 py-2"
      >
        Skip
      </button>
      <div className="flex items-center gap-2">
        {onBack && (
          <button
            onClick={onBack}
            className="glass-soft rounded-full px-5 py-2.5 text-sm text-foreground/80 hover:text-foreground transition"
          >
            Back
          </button>
        )}
        <button
          onClick={onNext}
          className="glass rounded-full px-6 py-2.5 text-sm tracking-wide text-foreground hover:bg-white/[0.08] transition"
        >
          {nextLabel}
        </button>
      </div>
    </div>
  );
}
