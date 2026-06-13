import { createFileRoute, Link } from "@tanstack/react-router";
import { Atmosphere } from "@/components/Atmosphere";
import { Nav } from "@/components/Nav";
import { Constellation } from "@/components/Constellation";
import { MODULES, MEMORIES, SCIENCE } from "@/lib/waves-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WAVES — Adaptive Psychoacoustic Instrument" },
      { name: "description", content: "An adaptive psychoacoustic instrument for emotional regulation, attention and memory. Sound is the interface." },
      { property: "og:title", content: "WAVES — Adaptive Psychoacoustic Instrument" },
      { property: "og:description", content: "A musical instrument for the human mind. Listen, don't think." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative min-h-dvh text-foreground">
      <Atmosphere />
      <Nav />

      {/* RESONANCE FIELD */}
      <section className="relative min-h-dvh flex flex-col items-center justify-center px-6 pt-28 pb-16">
        <div className="text-center max-w-3xl animate-rise">
          <div className="text-[11px] uppercase tracking-[0.36em] text-muted-foreground">
            Waveform · Activated · Vestibular · Emotional · System
          </div>
          <h1 className="mt-8 font-display text-5xl sm:text-6xl md:text-7xl leading-[1.04] text-foreground/95">
            What do you need<br /><em className="not-italic text-foreground/70">right now?</em>
          </h1>
          <p className="mt-6 text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            WAVES is an adaptive psychoacoustic instrument. Choose a module —
            an acoustic environment will begin within three seconds. Headphones recommended.
          </p>
        </div>

        <div className="mt-12 w-full animate-rise" style={{ animationDelay: "200ms" }}>
          <Constellation />
        </div>

        <div className="mt-10 flex items-center gap-6 text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
          <span className="inline-flex items-center gap-2"><Dot /> Web Audio</span>
          <span className="hidden sm:inline-flex items-center gap-2"><Dot /> Binaural Entrainment</span>
          <span className="hidden md:inline-flex items-center gap-2"><Dot /> Adaptive Intelligence</span>
        </div>
      </section>

      {/* SIX MODULES */}
      <section className="relative px-6 lg:px-10 py-32 max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="The Six Modules"
          title="Environments, not playlists."
          lede="Each module is an acoustic architecture engineered for a specific nervous-system posture. Step inside; the room becomes it."
        />
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MODULES.map((m, i) => (
            <Link
              key={m.id}
              to="/session/$emotion"
              params={{ emotion: m.id }}
              className="group relative glass rounded-3xl p-8 overflow-hidden transition-all duration-700 hover:-translate-y-1 block"
            >
              <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full opacity-30 group-hover:opacity-70 transition-opacity duration-1000 animate-breathe-soft"
                style={{ background: `radial-gradient(circle, oklch(0.7 0.18 ${m.hue} / 0.7), transparent 70%)`, filter: "blur(30px)" }} />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">0{i + 1} · {m.accentName}</div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{m.freqLabel}</div>
                </div>
                <h3 className="mt-5 font-display text-3xl text-foreground/95">{m.name}</h3>
                <div className="mt-1 text-sm tracking-wide" style={{ color: `oklch(0.78 0.12 ${m.hue})` }}>{m.line}</div>
                <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{m.body}</p>
                <div className="mt-8 flex items-center justify-between text-[11px] uppercase tracking-[0.28em] text-muted-foreground/80">
                  <span>{m.sound.split(" · ")[0]}</span>
                  <span aria-hidden className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* MEMORY ARCHITECTURE */}
      <section className="relative px-6 lg:px-10 py-32 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <SectionHeader
              align="left"
              eyebrow="Recall · Memory Architecture"
              title="An emotional museum, not a database."
              lede="Photographs, voice notes, places, fragments. WAVES renders each memory as an acoustic environment — a room you can walk back into."
            />
            <Link to="/memory" className="mt-8 inline-flex items-center gap-3 glass rounded-full px-5 py-2.5 text-sm hover:bg-white/5 transition">
              Enter Memory Space <span aria-hidden>→</span>
            </Link>
          </div>

          <div className="lg:col-span-7 relative">
            <div aria-hidden className="absolute inset-0 -m-6 rounded-[2rem]"
              style={{ background: "radial-gradient(50% 60% at 50% 40%, color-mix(in oklab, var(--aurora-deep) 18%, transparent), transparent 70%)", filter: "blur(40px)" }} />
            <div className="relative grid grid-cols-2 gap-4">
              {MEMORIES.map((m, i) => (
                <div key={m.id}
                  className={`glass rounded-2xl p-5 animate-drift ${i % 2 ? "translate-y-6" : ""}`}
                  style={{ animationDelay: `-${i * 1.7}s`, animationDuration: `${14 + i * 0.8}s` }}>
                  <div className="flex items-start justify-between text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                    <span>{m.year}</span><span className="text-accent/80">{m.tag}</span>
                  </div>
                  <div className="mt-6 font-display text-lg text-foreground/95 leading-snug">{m.title}</div>
                  <Waveform />
                  <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                    <span>Resonance · {m.ms}</span><span>↻</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ENGINE */}
      <section className="relative px-6 lg:px-10 py-32 max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="The Engine"
          title="Architectural light. Not equalizers."
          lede="Beneath the surface: dual-oscillator binaural carriers, isochronic envelopes, spatial fields and convolution reverbs — synthesized live in your browser. You will not see them. You will feel the room change."
        />
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { k: "Binaural Δ", v: "Δf 4 – 14 Hz", d: "Inter-aural phase difference inducing theta–beta drift." },
            { k: "Isochronic", v: "Amplitude pulse", d: "Pulsed envelope on the carrier for cortical entrainment." },
            { k: "Spatial Field", v: "Convolution IR", d: "Procedural impulse response — vestibular envelopment, felt safety." },
          ].map((x) => (
            <div key={x.k} className="glass rounded-2xl p-8">
              <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">{x.k}</div>
              <div className="mt-3 font-mono text-3xl text-foreground/95">{x.v}</div>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{x.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SCIENCE */}
      <section className="relative px-6 lg:px-10 py-32 max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="The Science Behind WAVES"
          title="Quiet research, plainly spoken."
          lede="Decades of work in psychoacoustics, polyvagal theory, and memory consolidation made WAVES possible."
        />
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 rounded-3xl overflow-hidden border border-white/5">
          {SCIENCE.slice(0, 6).map((s) => (
            <article key={s.id} className="bg-background/40 backdrop-blur p-8 hover:bg-white/[0.03] transition">
              <div className="text-[10px] uppercase tracking-[0.32em] text-accent/80">{s.title}</div>
              <p className="mt-4 text-base text-foreground/90 font-display text-xl leading-snug">{s.body}</p>
            </article>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link to="/science" className="inline-flex items-center gap-3 text-sm tracking-wide text-muted-foreground hover:text-foreground transition">
            Read the full library <span aria-hidden>→</span>
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
          The instrument is ready when you are.
        </h2>
        <p className="mt-6 text-muted-foreground">Put on headphones. Lower the lights. Choose a module.</p>
      </section>

      <footer className="relative px-6 lg:px-10 py-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
          <div>WAVES · Adaptive Psychoacoustic Instrument</div>
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

function Waveform() {
  const heights = [22, 38, 28, 64, 44, 30, 52, 36, 72, 42, 30, 56, 34, 48, 26, 60, 32, 22];
  return (
    <div className="mt-5 flex items-end gap-[3px] h-12">
      {heights.map((h, i) => (
        <span key={i} className="flex-1 rounded-full animate-breathe-soft"
          style={{
            height: `${h}%`,
            background: "linear-gradient(180deg, color-mix(in oklab, var(--aurora) 70%, transparent), color-mix(in oklab, var(--aurora-deep) 60%, transparent))",
            animationDelay: `-${i * 0.3}s`,
            animationDuration: `${6 + (i % 5)}s`,
          }}
        />
      ))}
    </div>
  );
}
