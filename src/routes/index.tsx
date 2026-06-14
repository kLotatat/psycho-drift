import { createFileRoute, Link } from "@tanstack/react-router";
import { Atmosphere } from "@/components/Atmosphere";
import { Nav } from "@/components/Nav";
import { Constellation } from "@/components/Constellation";
import { HeadphoneModal } from "@/components/HeadphoneModal";
import { MODULES, SCIENCE } from "@/lib/waves-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WAVES — Sound Spaces for How You Feel" },
      { name: "description", content: "Sound spaces designed to help you focus, unwind, reflect, or reset. Put on headphones and choose one." },
      { property: "og:title", content: "WAVES — Sound Spaces for How You Feel" },
      { property: "og:description", content: "Find the sound environment you need right now." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative min-h-dvh text-foreground">
      <Atmosphere />
      <Nav />
      <HeadphoneModal />

      {/* HERO */}
      <section className="relative min-h-dvh flex flex-col items-center justify-center px-6 pt-28 pb-16">
        <div className="text-center max-w-3xl animate-rise">
          <div className="text-[11px] uppercase tracking-[0.36em] text-muted-foreground">
            Sound Spaces · For How You Feel
          </div>
          <h1 className="mt-8 font-display text-5xl sm:text-6xl md:text-7xl leading-[1.04] text-foreground/95">
            What do you need<br /><em className="not-italic text-foreground/70">right now?</em>
          </h1>
          <p className="mt-6 text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Pick a sound space. It starts in a few seconds and helps you focus, unwind,
            feel grounded, or come back to yourself. Headphones recommended.
          </p>
        </div>

        <div className="mt-10 w-full animate-rise" style={{ animationDelay: "200ms" }}>
          <Constellation />
        </div>

        <div className="mt-10 flex items-center gap-6 text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
          <span className="inline-flex items-center gap-2"><Dot /> Spatial Audio</span>
          <span className="hidden sm:inline-flex items-center gap-2"><Dot /> Binaural Layers</span>
          <span className="hidden md:inline-flex items-center gap-2"><Dot /> Adapts To You</span>
        </div>
      </section>

      {/* SIX SPACES */}
      <section className="relative px-6 lg:px-10 py-32 max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="Six Sound Spaces"
          title="Pick a feeling. Step inside."
          lede="Each space is a sound environment built for a specific state. You don't have to think about it — choose one, and the room takes care of the rest."
        />
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MODULES.map((m, i) => (
            <Link
              key={m.id}
              to="/session/$emotion"
              params={{ emotion: m.id }}
              className="group relative glass rounded-3xl p-8 overflow-hidden transition-all duration-700 hover:-translate-y-1 block"
            >
              <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full opacity-30 group-hover:opacity-80 transition-opacity duration-1000 animate-breathe-soft"
                style={{ background: `radial-gradient(circle, oklch(0.7 0.18 ${m.hue} / 0.7), transparent 70%)`, filter: "blur(30px)" }} />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">0{i + 1}</div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{m.freqLabel}</div>
                </div>
                <h3 className="mt-5 font-display text-3xl text-foreground/95">{m.humanName}</h3>
                <div className="mt-1 text-sm tracking-wide" style={{ color: `oklch(0.78 0.12 ${m.hue})` }}>{m.line}</div>
                <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{m.body}</p>
                <div className="mt-8 flex items-center justify-between text-[11px] uppercase tracking-[0.28em] text-muted-foreground/80">
                  <span>Enter the space</span>
                  <span aria-hidden className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* MEMORY */}
      <section className="relative px-6 lg:px-10 py-32 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6">
            <SectionHeader
              align="left"
              eyebrow="Your Sound Library"
              title="Bring your own sounds in."
              lede="Upload a recording — rain on your window, your mother's kitchen, the cafe you write in. WAVES blends it into any sound space, automatically. Your memories become part of how you feel better."
            />
            <Link to="/memory" className="mt-8 inline-flex items-center gap-3 glass rounded-full px-5 py-2.5 text-sm hover:bg-white/5 transition">
              Open your library <span aria-hidden>→</span>
            </Link>
          </div>
          <div className="lg:col-span-6">
            <div className="relative glass rounded-3xl p-6 sm:p-8">
              <div className="text-[10px] uppercase tracking-[0.32em] text-accent/80">Inside a session</div>
              <div className="mt-3 font-display text-2xl text-foreground/95">Personal Layers</div>
              <div className="mt-6 space-y-2">
                {[
                  { n: "Rain on the roof",    t: "Safe" },
                  { n: "Forest at dawn",      t: "Grounded" },
                  { n: "Cafe in Bangalore",   t: "Focus" },
                  { n: "Ocean, July 2022",    t: "Calm" },
                ].map((l, i) => (
                  <div key={i} className="flex items-center justify-between rounded-2xl bg-white/[0.03] border border-white/5 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="h-2 w-2 rounded-full bg-accent animate-breathe-soft" style={{ animationDelay: `-${i}s` }} />
                      <span className="text-sm text-foreground/90">{l.n}</span>
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{l.t}</span>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-xs text-muted-foreground">Toggle layers on during a session. They blend in automatically — no mixing required.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SCIENCE — scanable, dominant titles */}
      <section className="relative px-6 lg:px-10 py-32 max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="The Science, Plainly"
          title="Why sound changes how you feel."
          lede="WAVES is built on decades of research. Here's the short version."
        />
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 rounded-3xl overflow-hidden border border-white/5">
          {SCIENCE.map((s, i) => (
            <article key={s.id} className="bg-background/40 backdrop-blur p-10 hover:bg-white/[0.04] transition relative overflow-hidden">
              <div className="absolute -top-16 -right-16 h-44 w-44 rounded-full opacity-20 animate-breathe-soft"
                style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--aurora) 60%, transparent), transparent 70%)", filter: "blur(40px)", animationDelay: `-${i}s` }} />
              <div className="relative">
                <h3 className="font-display text-4xl sm:text-5xl text-foreground/95 leading-[1.02] uppercase tracking-tight">
                  {s.title}
                </h3>
                <p className="mt-6 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-md">
                  {s.body}
                </p>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link to="/science" className="inline-flex items-center gap-3 text-sm tracking-wide text-muted-foreground hover:text-foreground transition">
            Read more <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      {/* CLOSING */}
      <section className="relative px-6 py-40 text-center max-w-3xl mx-auto">
        <div className="mx-auto mb-12 h-28 w-28 rounded-full animate-breathe relative">
          <div className="absolute inset-0 rounded-full"
            style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--aurora) 60%, transparent), transparent 70%)", filter: "blur(20px)" }} />
        </div>
        <h2 className="font-display text-4xl sm:text-5xl leading-tight text-foreground/95">
          Ready when you are.
        </h2>
        <p className="mt-6 text-muted-foreground">Put on headphones. Pick a space. Press play with your attention.</p>
      </section>

      <footer className="relative px-6 lg:px-10 py-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
          <div>WAVES · Sound spaces for how you feel</div>
          <div>Designed for stillness · Built with care</div>
        </div>
      </footer>
    </main>
  );
}

function Dot() {
  return <span className="inline-block h-1 w-1 rounded-full bg-accent/80 animate-breathe-soft" />;
}

function SectionHeader({ eyebrow, title, lede, align = "center" }: { eyebrow: string; title: string; lede: string; align?: "center" | "left" }) {
  const a = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <div className={`max-w-2xl ${a}`}>
      <div className="text-[11px] uppercase tracking-[0.32em] text-accent/80">{eyebrow}</div>
      <h2 className="mt-5 font-display text-4xl sm:text-5xl leading-[1.05] text-foreground/95">{title}</h2>
      <p className="mt-5 text-muted-foreground leading-relaxed">{lede}</p>
    </div>
  );
}
