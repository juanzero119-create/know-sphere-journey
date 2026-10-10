import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/Shell";
import { Quiz, type Mode } from "@/components/Quiz";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lexi — Practice words, anatomy & more" },
      { name: "description", content: "Bite-sized daily practice for vocabulary and anatomy, plus videos to watch and rate." },
      { property: "og:title", content: "Lexi — Practice words, anatomy & more" },
      { property: "og:description", content: "Bite-sized daily practice for vocabulary and anatomy." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const challenges: (Mode & { emoji: string; bg: string })[] = [
  { kind: "mixed", name: "Perfection", lives: 1, emoji: "💗", bg: "bg-accent" },
  { kind: "mixed", name: "Rush", lives: 3, emoji: "⚡", bg: "bg-success" },
  { kind: "mixed", name: "Sprint", seconds: 45, emoji: "⏱️", bg: "bg-gold" },
];

function Index() {
  const [mode, setMode] = useState<Mode | null>(null);
  return (
    <Shell title="Practice">
      <section className="chunky rounded-3xl bg-primary p-6 text-primary-foreground">
        <h2 className="text-2xl font-bold">Daily lesson</h2>
        <p className="mt-1 max-w-xs">Words and body parts, mixed together. Keep your streak alive!</p>
        <button onClick={() => setMode({ kind: "mixed", name: "Daily lesson" })} className="chunky chunky-press mt-4 rounded-full bg-cream px-5 py-2 font-semibold text-ink">
          Start
        </button>
      </section>

      <section className="chunky rounded-3xl bg-card p-6">
        <h2 className="text-xl font-bold">What's your level?</h2>
        <p className="text-muted-foreground">See how much you currently know</p>
        <button onClick={() => setMode({ kind: "words", name: "Level test" })} className="chunky chunky-press mt-4 rounded-full bg-primary px-5 py-2 font-semibold text-primary-foreground">
          Take free test
        </button>
      </section>

      <div>
        <p className="section-label mb-3">Challenges</p>
        <div className="grid grid-cols-3 gap-3">
          {challenges.map((c) => (
            <button key={c.name} onClick={() => setMode(c)} className="chunky chunky-press flex aspect-[4/5] flex-col justify-between rounded-3xl bg-card p-4 text-left">
              <span className={`grid size-14 place-items-center rounded-2xl border-2 text-3xl ${c.bg}`}>{c.emoji}</span>
              <span className="text-lg font-bold">{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="section-label mb-3">Explore</p>
        <div className="space-y-3">
          <Link to="/anatomy" className="chunky chunky-press flex items-center gap-4 rounded-3xl bg-card p-5">
            <span className="grid size-12 place-items-center rounded-full border-2 bg-pink text-2xl">🦴</span>
            <span className="text-xl font-bold">Learn anatomy <em className="text-pink">fast</em></span>
          </Link>
          <Link to="/watch" className="chunky chunky-press flex items-center gap-4 rounded-3xl bg-card p-5">
            <span className="grid size-12 place-items-center rounded-full border-2 bg-gold text-2xl">🎬</span>
            <span className="text-xl font-bold">Watch & rate videos</span>
          </Link>
        </div>
      </div>

      {mode && <Quiz mode={mode} onClose={() => setMode(null)} />}
    </Shell>
  );
}
