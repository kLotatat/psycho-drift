import { createFileRoute, Link } from "@tanstack/react-router";
import { Atmosphere } from "@/components/Atmosphere";
import { Nav } from "@/components/Nav";
import { MODULES } from "@/lib/waves-data";

/**
 * /system — internal design-system reference. Not linked from primary nav.
 * Single source of truth for tokens, type scale, motion, components.
 */
export const Route = createFileRoute("/system")({
  head: () => ({
    meta: [
      { title: "WAVES — Design System" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: System,
});

function System() {
  return (
    <main className="relative min-h-dvh text-foreground">
      <Atmosphere />
      <Nav />

      <section className="px-6 lg:px-10 pt-36 pb-16 max-w-5xl mx-auto">
        <div className="text-[10px] uppercase tracking-[0.42em] text-accent/80">Internal · Design System</div>
        <h1 className="mt-5 font-display text-5xl sm:text-6xl leading-[1.04] text-foreground/95">
          The grammar of WAVES.
        </h1>
        <p className="mt-6 text-muted-foreground leading-relaxed max-w-2xl">
          A working reference. Tokens, type, motion, components. The single source of truth for everything the
          product touches.
        </p>
      </section>

      <Section title="Typography">
        <div className="space-y-6">
          {[
            { cls: "font-display text-6xl tracking-tight", label: "Display · 60" },
            { cls: "font-display text-4xl tracking-tight", label: "Heading · 36" },
            { cls: "font-display text-2xl tracking-tight", label: "Subhead · 24" },
            { cls: "text-base text-foreground/85", label: "Body · 16" },
            { cls: "text-sm text-muted-foreground", label: "Caption · 14" },
            { cls: "text-[10px] uppercase tracking-[0.36em] text-muted-foreground", label: "Eyebrow · 10/0.36em" },
          ].map((t) => (
            <div key={t.label} className="grid grid-cols-[160px_1fr] gap-6 items-baseline border-b border-white/5 pb-5">
              <div className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">{t.label}</div>
              <div className={t.cls}>Listen. Reflect. Return.</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Module color identities">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {MODULES.map((m) => (
            <div key={m.id} className="glass rounded-2xl p-5 relative overflow-hidden">
              <div
                className="absolute -top-12 -right-12 h-32 w-32 rounded-full opacity-60"
                style={{
                  background: `radial-gradient(circle, oklch(0.75 0.18 ${m.hue} / 0.7), transparent 70%)`,
                  filter: "blur(24px)",
                }}
              />
              <div className="relative">
                <div className="font-display text-xl tracking-[0.2em]">{m.name}</div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">{m.accentName}</div>
                <div className="mt-3 text-[10px] font-mono text-muted-foreground">hue {m.hue}° · {m.freqLabel}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Spacing & radius">
        <div className="flex flex-wrap gap-3">
          {[8, 12, 16, 24, 32, 48].map((px) => (
            <div key={px} className="glass-soft rounded-xl p-4 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
              <div className="h-6 bg-white/10 rounded" style={{ width: px * 2 }} />
              <div className="mt-2">{px}px</div>
            </div>
          ))}
          <div className="flex items-end gap-3">
            {[8, 12, 16, 24, 9999].map((r) => (
              <div key={r} className="text-center">
                <div className="h-14 w-14 glass" style={{ borderRadius: r }} />
                <div className="mt-1 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">r {r === 9999 ? "full" : r}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Motion">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { name: "breathe", desc: "Living surfaces · 8s" },
            { name: "breathe-soft", desc: "Ambient pulses · 11s" },
            { name: "drift-slow", desc: "Atmospheric drift · 22s" },
          ].map((m) => (
            <div key={m.name} className="glass rounded-2xl p-6">
              <div className={`mx-auto h-20 w-20 rounded-full animate-${m.name}`} style={{
                background: "radial-gradient(circle at 30% 28%, color-mix(in oklab, white 28%, transparent), color-mix(in oklab, var(--aurora) 42%, transparent) 60%, transparent 85%)",
              }} />
              <div className="mt-4 font-mono text-[11px] text-foreground/80">animate-{m.name}</div>
              <div className="text-[11px] text-muted-foreground mt-1">{m.desc}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Glass surfaces">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="glass rounded-2xl p-6">
            <div className="font-mono text-[11px] text-foreground/70">.glass</div>
            <p className="mt-2 text-sm text-muted-foreground">Primary surface. Cards, modals, central instruments.</p>
          </div>
          <div className="glass-soft rounded-2xl p-6">
            <div className="font-mono text-[11px] text-foreground/70">.glass-soft</div>
            <p className="mt-2 text-sm text-muted-foreground">Secondary surface. Ambient capsules, quiet chrome.</p>
          </div>
        </div>
      </Section>

      <section className="px-6 lg:px-10 py-24 max-w-5xl mx-auto text-center">
        <Link to="/" className="inline-flex items-center gap-3 glass rounded-full px-6 py-3 text-sm hover:bg-white/5 transition">
          ← Return to the rooms
        </Link>
      </section>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="px-6 lg:px-10 py-16 max-w-5xl mx-auto border-t border-white/5">
      <div className="text-[10px] uppercase tracking-[0.36em] text-muted-foreground mb-10">{title}</div>
      {children}
    </section>
  );
}
