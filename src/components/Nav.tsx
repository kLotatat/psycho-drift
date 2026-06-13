import { Link } from "@tanstack/react-router";

const links = [
  { to: "/", label: "Atrium" },
  { to: "/memory", label: "Memory" },
  { to: "/science", label: "Science" },
  { to: "/reflect", label: "Reflect" },
] as const;

export function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-5 flex items-center justify-between">
        <Link to="/" className="group flex items-center gap-3">
          <span className="relative inline-flex h-7 w-7 items-center justify-center">
            <span className="absolute inset-0 rounded-full animate-breathe-soft"
              style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--aurora) 70%, transparent), transparent 70%)", filter: "blur(6px)" }} />
            <span className="relative h-2.5 w-2.5 rounded-full bg-foreground/90" />
          </span>
          <span className="font-display text-xl tracking-[0.18em] text-foreground/90">WAVES</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1 glass rounded-full px-2 py-1.5">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="px-4 py-1.5 text-[13px] tracking-wide text-muted-foreground hover:text-foreground transition-colors rounded-full"
              activeProps={{ className: "px-4 py-1.5 text-[13px] tracking-wide rounded-full text-foreground bg-white/5" }}
              activeOptions={{ exact: true }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-breathe" />
          Adaptive Intelligence
        </div>
      </div>
    </header>
  );
}
