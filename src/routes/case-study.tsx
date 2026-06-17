import { createFileRoute, Link } from "@tanstack/react-router";
import { Atmosphere } from "@/components/Atmosphere";
import { Nav } from "@/components/Nav";

export const Route = createFileRoute("/case-study")({
  head: () => ({
    meta: [
      { title: "WAVES — Case Study" },
      { name: "description", content: "WAVES: design, research, and architecture of an adaptive psychoacoustic instrument." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: CaseStudy,
});

function CaseStudy() {
  return (
    <main className="relative min-h-dvh text-foreground">
      <Atmosphere />
      <Nav />

      {/* HERO */}
      <section className="px-6 lg:px-10 pt-36 pb-20 max-w-5xl mx-auto">
        <div className="text-[11px] uppercase tracking-[0.36em] text-accent/80">Case Study · 2026</div>
        <h1 className="mt-6 font-display text-5xl sm:text-6xl md:text-7xl leading-[1.02] text-foreground/95">
          WAVES
          <br />
          <em className="not-italic text-foreground/55">An adaptive psychoacoustic instrument.</em>
        </h1>
        <p className="mt-8 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
          A six-room sound environment that responds to attention, memory, and feeling — grounded
          in psychoacoustic research and designed as a quiet, personal instrument rather than a
          content product.
        </p>

        <dl className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5">
          {[
            ["Discipline", "Interaction · Sound"],
            ["Role", "Design & Direction"],
            ["Stack", "TanStack · WebAudio"],
            ["Status", "In production"],
          ].map(([k, v]) => (
            <div key={k} className="bg-background/40 backdrop-blur p-5">
              <dt className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">{k}</dt>
              <dd className="mt-2 text-sm text-foreground/90">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* CHAPTERS */}
      <Chapter
        n="01"
        eyebrow="The Problem"
        title="The wellness market is loud."
        body={[
          "Most mental wellness apps are libraries of content. They demand selection, completion, streaks, and scores. The user is asked to perform wellbeing.",
          "Sound — used precisely — can shift attention, soften the nervous system, and shape memory. But it is almost always packaged as background noise, sleep tracks, or generic binaural beats.",
          "WAVES asks a different question: what if sound itself were the interface?",
        ]}
      />

      <Chapter
        n="02"
        eyebrow="Research"
        title="Listening is a felt act."
        body={[
          "Psychoacoustics shows that frequency, spatialisation, and timbre directly modulate attention and autonomic state. Schumann-band tones (≈7.83 Hz) couple with grounded body states. Wide stereo fields open cognitive flexibility. Narrow, steady textures sharpen focus.",
          "Affective neuroscience frames emotion not as a label but as a body state — interoception, arousal, valence. A good sound environment can shift any of those without language.",
          "Memory research suggests that personally meaningful sound (rain on a roof, a familiar voice) recruits autobiographical networks far more strongly than novel stimuli. The personal layer matters.",
        ]}
      />

      <Chapter
        n="03"
        eyebrow="Insights"
        title="Three principles."
        body={[
          "01 · A room, not a track. Each space is an acoustic environment that can be entered and inhabited — not a piece of media to consume.",
          "02 · No metrics. Streaks, scores, and analytics turn presence into performance. WAVES tracks only what serves the listener directly.",
          "03 · Memory is part of the instrument. The sounds that already mean something to you fold into the room. The space becomes yours.",
        ]}
      />

      <Chapter
        n="04"
        eyebrow="Design Process"
        title="From metaphor to instrument."
        body={[
          "The system began as six emotional intentions — focus, ground, float, release, nest, recall. Each was mapped to a frequency band, a spatial signature, and a colour.",
          "Visual language: deep observatory, aurora hues, glass surfaces, Cormorant Garamond against Inter Tight. The interface recedes; the sound is the surface.",
          "Interaction: a hexagonal constellation of breathing nodes around a listening core. Hover transfers energy to the centre. No menus. No CTAs. The room itself is the call to action.",
        ]}
      />

      <Chapter
        n="05"
        eyebrow="System Architecture"
        title="Adaptive, local, private."
        body={[
          "Frontend: TanStack Start (React 19 + Vite 7) with file-based routing and SSR. Tailwind v4 with semantic tokens and a custom motion system.",
          "Audio engine: WebAudio with layered oscillators, biquad shaping, and per-room spatial bus. Designed for low-CPU operation on mid-range devices.",
          "Adaptive Intelligence: a lightweight on-device model that derives a four-stage listening phase from session count and personal layer depth. No analytics, no telemetry.",
          "Memory: personal sound layers stored locally as base64 audio. The user owns every byte.",
          "Mobile: Capacitor wrapper for Android — signed APK and AAB, background audio, splash, adaptive icon.",
        ]}
      />

      <Chapter
        n="06"
        eyebrow="Features"
        title="What ships."
        body={[
          "Six tuned sound spaces — FOCUS, GROUND, FLOAT, RELEASE, NEST, RECALL.",
          "Personal Layers — bring in rain, a voice note, a field recording. Tag by feeling.",
          "Adaptive Intelligence indicator — quiet, ambient, never numeric.",
          "Reflect — a private thread of short reflections after sessions.",
          "Onboarding — a four-step welcome built around listening, not configuration.",
          "/system — an internal design source of truth documenting tokens, motion, and surface variants.",
        ]}
      />

      <Chapter
        n="07"
        eyebrow="User Journey"
        title="A first session."
        body={[
          "Arrive. The atmosphere breathes. Headphone notice. Welcome.",
          "Choose a room. The constellation responds — the room you hover swells, the others recede.",
          "Enter. The environment opens. A reflection prompt waits at the end.",
          "Return. The room remembers you arrived. Personal layers fold in automatically.",
        ]}
      />

      <Chapter
        n="08"
        eyebrow="Future Vision"
        title="A listening operating system."
        body={[
          "WAVES is the first instrument in a broader system: an emotional operating layer that runs quietly under daily life.",
          "Roadmap: biofeedback-attuned rooms (HRV, breath), shared listening (two people, one room), generative composition seeded from personal memory, and a dedicated hardware companion designed around the same six spaces.",
          "Not an app. A long-term emotional environment.",
        ]}
      />

      <section className="px-6 py-32 text-center max-w-3xl mx-auto">
        <div className="text-[10px] uppercase tracking-[0.42em] text-muted-foreground/70">End</div>
        <h2 className="mt-6 font-display text-4xl sm:text-5xl text-foreground/95 leading-tight">
          Listen. Reflect. Return.
        </h2>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link to="/" className="glass rounded-full px-6 py-3 text-sm tracking-wide hover:bg-white/[0.06] transition">
            Enter WAVES
          </Link>
          <Link to="/science" className="text-sm tracking-wide text-muted-foreground hover:text-foreground transition px-4 py-3">
            Read the science →
          </Link>
        </div>
      </section>
    </main>
  );
}

function Chapter({ n, eyebrow, title, body }: { n: string; eyebrow: string; title: string; body: string[] }) {
  return (
    <section className="px-6 lg:px-10 py-20 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground">{n}</div>
          <div className="mt-2 text-[11px] uppercase tracking-[0.32em] text-accent/80">{eyebrow}</div>
        </div>
        <div className="md:col-span-9">
          <h2 className="font-display text-3xl sm:text-4xl text-foreground/95 leading-[1.1]">{title}</h2>
          <div className="mt-6 space-y-4">
            {body.map((p, i) => (
              <p key={i} className="text-[15px] text-muted-foreground leading-relaxed">{p}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
