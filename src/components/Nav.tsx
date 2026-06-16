import { Link } from "@tanstack/react-router";

const links = [
  { to: "/", label: "Home" },
  { to: "/memory", label: "Memory" },
  { to: "/science", label: "Science" },
  { to: "/reflect", label: "Reflect" },
] as const;

/**
 * True 3-column header. The center column is optically locked to the
 * viewport's vertical centerline — independent of logo / AI capsule widths.
 */
export function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-40 pointer-events-none">
      <div className="relative h-[68px] px-6 lg:px-10">
        {/* LEFT — logo */}
        <div className="absolute left-6 lg:left-10 top-1/2 -translate-y-1/2 pointer-events-auto">
          <Link to="/" className="group flex items-center gap-3">
            <span className="relative inline-flex h-7 w-7 items-center justify-center">
              <span
                className="absolute inset-0 rounded-full animate-breathe-soft"
                style={{
                  background:
                    "radial-gradient(circle, color-mix(in oklab, var(--aurora) 70%, transparent), transparent 70%)",
                  filter: "blur(6px)",
                }}
              />
              <span className="relative h-2.5 w-2.5 rounded-full bg-foreground/90" />
            </span>
            <span className="font-display text-xl tracking-[0.22em] text-foreground/90">
              WAVES
            </span>
          </Link>
        </div>

        {/* CENTER — locked to viewport centerline */}
        <nav
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto hidden md:flex items-center gap-1 glass rounded-full px-2 py-1.5"
          aria-label="Primary"
        >
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="px-4 py-1.5 text-[12px] tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground transition-colors rounded-full"
              activeProps={{
                className:
                  "px-4 py-1.5 text-[12px] tracking-[0.18em] uppercase rounded-full text-foreground bg-white/[0.06]",
              }}
              activeOptions={{ exact: true }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
