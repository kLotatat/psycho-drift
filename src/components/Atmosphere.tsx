/** Living atmospheric backdrop: aurora wash + drifting particles + starfield. */
export function Atmosphere() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden atmosphere">
      {/* aurora layers */}
      <div className="absolute -inset-[20%] opacity-70 animate-aurora"
        style={{
          background:
            "radial-gradient(40rem 30rem at 30% 20%, color-mix(in oklab, var(--aurora) 30%, transparent), transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div className="absolute -inset-[20%] opacity-60 animate-aurora" style={{ animationDelay: "-8s",
        background:
          "radial-gradient(35rem 28rem at 75% 60%, color-mix(in oklab, var(--aurora-deep) 28%, transparent), transparent 70%)",
        filter: "blur(50px)",
      }} />
      <div className="absolute -inset-[20%] opacity-50 animate-aurora" style={{ animationDelay: "-14s",
        background:
          "radial-gradient(28rem 22rem at 50% 90%, color-mix(in oklab, var(--aurora-warm) 22%, transparent), transparent 70%)",
        filter: "blur(60px)",
      }} />

      {/* starfield (tiled subtle stars) */}
      <div className="absolute inset-0 starfield opacity-50 animate-shimmer" style={{ backgroundSize: "640px 640px" }} />
      <div className="absolute inset-0 starfield opacity-30 animate-shimmer"
        style={{ backgroundSize: "420px 420px", animationDelay: "-3s", transform: "translate(40px,80px)" }} />

      {/* grain */}
      <div className="absolute inset-0 mix-blend-overlay opacity-[0.06]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.7'/></svg>\")",
        }}
      />

      {/* vignette */}
      <div className="absolute inset-0"
        style={{ background: "radial-gradient(80% 60% at 50% 50%, transparent 50%, color-mix(in oklab, black 60%, transparent) 100%)" }}
      />
    </div>
  );
}
