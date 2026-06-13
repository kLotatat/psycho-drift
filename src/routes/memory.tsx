import { createFileRoute, Link } from "@tanstack/react-router";
import { Atmosphere } from "@/components/Atmosphere";
import { Nav } from "@/components/Nav";
import { MEMORIES } from "@/lib/waves-data";

export const Route = createFileRoute("/memory")({
  head: () => ({
    meta: [
      { title: "WAVES — Memory Space" },
      { name: "description", content: "An emotional museum. Memories rendered as acoustic environments." },
      { property: "og:title", content: "WAVES — Memory Space" },
      { property: "og:description", content: "Walk through an archive of your own resonance." },
    ],
  }),
  component: Memory,
});

function Memory() {
  return (
    <main className="relative min-h-dvh text-foreground">
      <Atmosphere />
      <Nav />

      <section className="px-6 lg:px-10 pt-36 pb-16 max-w-7xl mx-auto">
        <div className="max-w-2xl">
          <div className="text-[11px] uppercase tracking-[0.32em] text-accent/80">Recall · Memory Space</div>
          <h1 className="mt-5 font-display text-5xl sm:text-6xl leading-[1.04] text-foreground/95">
            An archive of your own resonance.
          </h1>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            Voice notes, photographs, locations, written fragments — each becomes a room with its own
            acoustic weather. Step inside; listen to who you were.
          </p>
        </div>
      </section>

      {/* Spatial canvas */}
      <section className="relative px-6 lg:px-10 pb-32 max-w-7xl mx-auto">
        <div className="relative h-[80vh] min-h-[640px] glass rounded-[2rem] overflow-hidden">
          {/* horizon */}
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2"
            style={{ background: "linear-gradient(180deg, transparent, color-mix(in oklab, var(--aurora-deep) 18%, transparent))" }} />
          {/* drifting artifacts */}
          {MEMORIES.map((m, i) => {
            const positions = [
              { x: 12, y: 22 }, { x: 32, y: 58 }, { x: 56, y: 18 },
              { x: 72, y: 48 }, { x: 22, y: 76 }, { x: 84, y: 74 },
            ][i];
            return (
              <button
                key={m.id}
                className="group absolute -translate-x-1/2 -translate-y-1/2 text-left animate-drift-slow focus:outline-none"
                style={{ left: `${positions.x}%`, top: `${positions.y}%`, animationDelay: `-${i * 2}s` }}
              >
                <div className="relative">
                  <div className="absolute -inset-8 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-700"
                    style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--aurora) 35%, transparent), transparent 70%)", filter: "blur(18px)" }} />
                  <div className="relative glass-soft rounded-2xl px-5 py-4 w-64 hover:bg-white/[0.04] transition">
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                      <span>{m.year}</span><span className="text-accent/80">{m.tag}</span>
                    </div>
                    <div className="mt-3 font-display text-lg leading-snug text-foreground/95">{m.title}</div>
                    <div className="mt-4 flex items-center gap-1">
                      {Array.from({ length: 20 }).map((_, k) => (
                        <span key={k} className="w-[3px] rounded-full bg-foreground/30 animate-breathe-soft"
                          style={{ height: `${6 + ((k * 7) % 22)}px`, animationDelay: `-${k * 0.2}s` }} />
                      ))}
                    </div>
                    <div className="mt-3 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{m.ms}</div>
                  </div>
                </div>
              </button>
            );
          })}

          {/* center prompt */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
            <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">Capture</div>
            <button className="pointer-events-auto mt-3 glass rounded-full px-6 py-3 text-sm hover:bg-white/5 transition">
              + New memory
            </button>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5">
          {[
            { k: "Artifacts", v: "147" },
            { k: "Voice minutes", v: "8h 12m" },
            { k: "Places", v: "24" },
            { k: "Dominant tone", v: "Renewal" },
          ].map((s) => (
            <div key={s.k} className="bg-background/40 p-6">
              <div className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">{s.k}</div>
              <div className="mt-3 font-display text-2xl text-foreground/95">{s.v}</div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/" className="text-sm tracking-wide text-muted-foreground hover:text-foreground transition">
            ← Return to the constellation
          </Link>
        </div>
      </section>
    </main>
  );
}
