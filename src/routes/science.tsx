import { createFileRoute, Link } from "@tanstack/react-router";
import { Atmosphere } from "@/components/Atmosphere";
import { Nav } from "@/components/Nav";
import { SCIENCE } from "@/lib/waves-data";

export const Route = createFileRoute("/science")({
  head: () => ({
    meta: [
      { title: "WAVES — The Science Behind" },
      { name: "description", content: "Psychoacoustics, neuroplasticity, polyvagal theory, and the architecture of emotional sound." },
      { property: "og:title", content: "WAVES — The Science Behind" },
      { property: "og:description", content: "Quiet research, plainly spoken." },
    ],
  }),
  component: Science,
});

function Science() {
  return (
    <main className="relative min-h-dvh text-foreground">
      <Atmosphere />
      <Nav />

      <section className="px-6 lg:px-10 pt-36 pb-20 max-w-7xl mx-auto">
        <div className="max-w-3xl">
          <div className="text-[11px] uppercase tracking-[0.32em] text-accent/80">The Science Behind WAVES</div>
          <h1 className="mt-5 font-display text-5xl sm:text-6xl leading-[1.04] text-foreground/95">
            Sound is the oldest interface we have.
          </h1>
          <p className="mt-6 text-muted-foreground leading-relaxed text-lg">
            Before language, before image, the nervous system listened. WAVES is built on decades of
            psychoacoustic and clinical research — distilled into environments simple enough to feel.
          </p>
        </div>
      </section>

      <section className="px-6 lg:px-10 pb-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 rounded-3xl overflow-hidden border border-white/5">
          {SCIENCE.map((s, i) => (
            <article key={s.id} className="bg-background/40 backdrop-blur p-10 hover:bg-white/[0.03] transition relative overflow-hidden">
              <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full opacity-30 animate-breathe-soft"
                style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--aurora) 60%, transparent), transparent 70%)", filter: "blur(30px)", animationDelay: `-${i}s` }} />
              <div className="relative">
                <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
                  0{i + 1} · {s.title}
                </div>
                <p className="mt-6 font-display text-2xl text-foreground/95 leading-snug">{s.body}</p>
                <DiagramPlaceholder seed={i} />
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link to="/" className="inline-flex items-center gap-3 glass rounded-full px-6 py-3 text-sm hover:bg-white/5 transition">
            Return to the constellation
          </Link>
        </div>
      </section>
    </main>
  );
}

function DiagramPlaceholder({ seed }: { seed: number }) {
  const points = Array.from({ length: 60 }).map((_, i) => {
    const y = 50 + Math.sin((i + seed * 3) * 0.35) * 18 + Math.sin((i + seed) * 0.12) * 8;
    return `${(i / 59) * 100},${y}`;
  });
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="mt-8 w-full h-24 opacity-70">
      <defs>
        <linearGradient id={`g${seed}`} x1="0" x2="1">
          <stop offset="0%" stopColor="oklch(0.72 0.13 220)" stopOpacity="0.1" />
          <stop offset="50%" stopColor="oklch(0.72 0.13 220)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="oklch(0.55 0.16 290)" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <polyline points={points.join(" ")} fill="none" stroke={`url(#g${seed})`} strokeWidth="0.6" />
    </svg>
  );
}
