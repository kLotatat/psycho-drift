import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Atmosphere } from "@/components/Atmosphere";
import { Nav } from "@/components/Nav";

const TAGS = ["Lighter", "Held", "Clearer", "Quieter", "Open", "Tender", "Steady", "Awake"];

export const Route = createFileRoute("/reflect")({
  head: () => ({
    meta: [
      { title: "WAVES — Reflect" },
      { name: "description", content: "Close a session. Generate a memory artifact." },
    ],
  }),
  component: Reflect,
});

function Reflect() {
  const [note, setNote] = useState("");
  const [picked, setPicked] = useState<string[]>([]);

  const toggle = (t: string) => setPicked((p) => p.includes(t) ? p.filter((x) => x !== t) : [...p, t]);

  return (
    <main className="relative min-h-dvh text-foreground">
      <Atmosphere />
      <Nav />

      <section className="px-6 lg:px-10 pt-36 pb-20 max-w-3xl mx-auto text-center">
        <div className="relative mx-auto h-40 w-40">
          <div className="absolute inset-0 rounded-full animate-breathe"
            style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--aurora) 60%, transparent), transparent 70%)", filter: "blur(24px)" }} />
          <div className="absolute inset-6 rounded-full animate-breathe-soft"
            style={{ background: "radial-gradient(circle at 35% 30%, color-mix(in oklab, white 20%, transparent), color-mix(in oklab, var(--aurora) 30%, transparent) 70%, transparent 90%)" }} />
        </div>

        <h1 className="mt-10 font-display text-5xl leading-tight text-foreground/95">How do you feel now?</h1>
        <p className="mt-4 text-muted-foreground">Take a moment. The session will hold a shape for you.</p>

        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {TAGS.map((t) => (
            <button key={t} onClick={() => toggle(t)}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.22em] transition glass-soft ${picked.includes(t) ? "bg-white/10 text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="mt-10 glass rounded-3xl p-6 text-left">
          <label className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">A small note</label>
          <textarea
            value={note} onChange={(e) => setNote(e.target.value)}
            placeholder="A single sentence is enough."
            rows={4}
            className="mt-3 w-full bg-transparent outline-none resize-none text-foreground placeholder:text-muted-foreground/60 font-display text-xl"
          />
          <div className="mt-4 flex items-center justify-between text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            <span>Voice note · optional</span>
            <button className="glass-soft rounded-full px-3 py-1.5 hover:bg-white/5">● record</button>
          </div>
        </div>

        <button className="mt-10 glass rounded-full px-7 py-3 text-sm hover:bg-white/5 transition">
          Generate session artifact
        </button>

        <div className="mt-16">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition">
            ← Return to the constellation
          </Link>
        </div>
      </section>
    </main>
  );
}
