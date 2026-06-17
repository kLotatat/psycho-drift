import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const links = [
  { to: "/", label: "Home" },
  { to: "/memory", label: "Memory" },
  { to: "/science", label: "Science" },
  { to: "/reflect", label: "Reflect" },
] as const;

/**
 * Adaptive header.
 * Desktop: 3-column with a centerline-locked nav pill.
 * Mobile: logo + hamburger that opens a full-screen sheet.
 */
export function Nav() {
  const [open, setOpen] = useState(false);

  // Close menu when route changes (focus moves away from button on tap)
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className="fixed inset-x-0 z-40 pointer-events-none"
      style={{ top: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="relative h-[68px] px-5 sm:px-6 lg:px-10">
        {/* LEFT — logo */}
        <div className="absolute left-5 sm:left-6 lg:left-10 top-1/2 -translate-y-1/2 pointer-events-auto">
          <Link to="/" className="group flex items-center gap-3" onClick={() => setOpen(false)}>
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

        {/* CENTER — desktop nav, locked to viewport centerline */}
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

        {/* RIGHT — mobile menu button (Adaptive Intelligence renders separately top-right on home) */}
        <div className="absolute right-5 sm:right-6 lg:right-10 top-1/2 -translate-y-1/2 pointer-events-auto md:hidden">
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid place-items-center h-11 w-11 rounded-full glass-soft text-foreground/80 hover:text-foreground transition"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              ) : (
                <>
                  <path d="M4 8h16" strokeLinecap="round" />
                  <path d="M4 16h16" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* MOBILE SHEET */}
      <div
        className={`md:hidden fixed inset-0 transition-opacity duration-500 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <div className="absolute inset-0 bg-background/85 backdrop-blur-xl" onClick={() => setOpen(false)} />
        <nav
          className="relative h-full flex flex-col items-center justify-center gap-2 px-8"
          aria-label="Mobile"
          style={{
            paddingTop: "env(safe-area-inset-top)",
            paddingBottom: "env(safe-area-inset-bottom)",
          }}
        >
          {links.map((l, i) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="font-display text-4xl tracking-[0.06em] text-foreground/70 hover:text-foreground transition-colors py-3"
              style={{ animation: open ? `rise 0.6s ${i * 60}ms cubic-bezier(0.2,0.7,0.2,1) both` : undefined }}
              activeProps={{ className: "font-display text-4xl tracking-[0.06em] text-foreground py-3" }}
              activeOptions={{ exact: true }}
            >
              {l.label}
            </Link>
          ))}
          <div className="mt-10 text-[10px] uppercase tracking-[0.36em] text-muted-foreground/70">
            Listen · Reflect · Return
          </div>
        </nav>
      </div>
    </header>
  );
}
