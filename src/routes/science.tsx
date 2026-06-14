import { createFileRoute, Link } from "@tanstack/react-router";
import { Atmosphere } from "@/components/Atmosphere";
import { Nav } from "@/components/Nav";
import { SCIENCE } from "@/lib/waves-data";

export const Route = createFileRoute("/science")({
  head: () => ({
    meta: [
      { title: "WAVES — How and Why It Works" },
      { name: "description", content: "The short, plain-language version of the research behind WAVES." },
      { property: "og:title", content: "WAVES — How and Why It Works" },
      { property: "og:description", content: "Why sound can change how you feel." },
    ],
  }),
  component: Science,
});

function Science() {
  return (
    <main className="relative min-h-dvh text-foreground">
      <Atmosphere />
      <Nav />

      <section className="px-6 lg:px-10 pt-36 pb-16 max-w-5xl mx-auto">
        <div className="max-w-3xl">
          <div className="text-[11px] uppercase tracking-[0.32em] text-accent/80">How and Why It Works</div>
          <h1 className="mt-5 font-display text-5xl sm:text-6xl leading-[1.04] text-foreground/95">
            Sound changes how you feel.
          </h1>
          <p className="mt-6 text-muted-foreground leading-relaxed text-lg">
            You already know this — a song can lift you, a room tone can calm you, a voice can hold you.
            WAVES uses what researchers have learned about sound and the nervous system, and turns it into spaces you can step into.
          </p>
        </div>
      </section>

      <section className="px-6 lg:px-10 pb-24 max-w-7xl mx-auto space-y-6">
        {SCIENCE.map((s, i) => (
          <article key={s.id}
            className="glass rounded-3xl p-8 sm:p-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative overflow-hidden hover:bg-white/[0.04] transition">
            <div aria-hidden className="absolute -top-32 -right-32 h-80 w-80 rounded-full opacity-30 animate-breathe-soft"
              style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--aurora) 70%, transparent), transparent 70%)", filter: "blur(60px)", animationDelay: `-${i * 2}s` }} />
            <div className="md:col-span-7 relative">
              <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground">0{i + 1}</div>
              <h2 className="mt-3 font-display text-6xl sm:text-7xl md:text-8xl text-foreground/95 leading-[0.95] uppercase tracking-tight">
                {s.title}
              </h2>
            </div>
            <div className="md:col-span-5 relative">
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">{s.body}</p>
              <DiagramPlaceholder seed={i} />
            </div>
          </article>
        ))}

        <div className="pt-10 text-center">
          <Link to="/" className="inline-flex items-center gap-3 glass rounded-full px-6 py-3 text-sm hover:bg-white/5 transition">
            Back to sound spaces
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
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="mt-8 w-full h-16 opacity-70">
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
