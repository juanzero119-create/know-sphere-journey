import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/Shell";
import { Quiz } from "@/components/Quiz";
import { words } from "@/lib/data";

export const Route = createFileRoute("/words")({
  head: () => ({
    meta: [
      { title: "Words — Lexi vocabulary builder" },
      { name: "description", content: "Flip through vocabulary cards and quiz yourself on new words." },
      { property: "og:title", content: "Words — Lexi vocabulary builder" },
      { property: "og:description", content: "Flip through vocabulary cards and quiz yourself." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Words,
});

function Words() {
  const [i, setI] = useState(0);
  const [flip, setFlip] = useState(false);
  const [quiz, setQuiz] = useState(false);
  const w = words[i];
  return (
    <Shell title="Words">
      <button onClick={() => setFlip(!flip)} className="chunky flex min-h-72 w-full flex-col items-center justify-center rounded-3xl bg-cream p-8 text-center text-ink">
        {flip ? (
          <>
            <p className="text-2xl font-bold">{w.meaning}</p>
            <p className="mt-4 italic opacity-70">“{w.example}”</p>
          </>
        ) : (
          <>
            <p className="font-display text-5xl">{w.word}</p>
            <p className="mt-4 text-sm opacity-60">Tap to reveal</p>
          </>
        )}
      </button>
      <div className="flex gap-3">
        <button onClick={() => { setFlip(false); setI((i - 1 + words.length) % words.length); }} className="chunky chunky-press flex-1 rounded-full bg-card py-3 font-semibold">Back</button>
        <button onClick={() => { setFlip(false); setI((i + 1) % words.length); }} className="chunky chunky-press flex-1 rounded-full bg-primary py-3 font-semibold text-primary-foreground">Next</button>
      </div>
      <button onClick={() => setQuiz(true)} className="chunky chunky-press w-full rounded-3xl bg-success p-5 text-xl font-bold text-ink">Quiz me on words</button>
      {quiz && <Quiz mode={{ kind: "words", name: "Word quiz" }} onClose={() => setQuiz(false)} />}
    </Shell>
  );
}
