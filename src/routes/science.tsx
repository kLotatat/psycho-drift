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

      <section className="px-6 lg:px-10 pt-36 pb-16 max-w-4xl mx-auto">
        <div className="max-w-3xl">
          <div className="text-[11px] uppercase tracking-[0.32em] text-accent/80">The Science</div>
          <h1 className="mt-5 font-display text-4xl sm:text-5xl leading-[1.06] text-foreground/95">
            Sound is the oldest instrument we have for changing how we feel.
          </h1>
          <p className="mt-6 text-muted-foreground leading-relaxed text-lg">
            WAVES draws on psychoacoustics, neuroscience, and decades of research into how the auditory system
            shapes attention, memory, and the autonomic body. What follows is the short, plain-language version —
            a field guide to the ideas underneath the rooms.
          </p>
        </div>
      </section>

      <section className="px-6 lg:px-10 pb-24 max-w-4xl mx-auto">
        <ol className="divide-y divide-white/5 border-y border-white/5">
          {SCIENCE.map((s, i) => (
            <li key={s.id} className="grid grid-cols-12 gap-6 py-12 group">
              <div className="col-span-12 sm:col-span-2 font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground pt-2">
                0{i + 1}
              </div>
              <div className="col-span-12 sm:col-span-4">
                <h2 className="font-display text-2xl sm:text-3xl text-foreground/95 leading-tight">
                  {s.title}
                </h2>
                <DiagramPlaceholder seed={i} />
              </div>
              <div className="col-span-12 sm:col-span-6">
                <p className="text-base text-muted-foreground leading-relaxed">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="pt-16 text-center">
          <Link to="/" className="inline-flex items-center gap-3 glass rounded-full px-6 py-3 text-sm hover:bg-white/5 transition">
            Return to the rooms
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
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="mt-6 w-full h-12 opacity-60">
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
