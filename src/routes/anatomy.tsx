import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/Shell";
import { Quiz } from "@/components/Quiz";
import { anatomy } from "@/lib/data";

export const Route = createFileRoute("/anatomy")({
  head: () => ({
    meta: [
      { title: "Anatomy — Learn the body fast | Lexi" },
      { name: "description", content: "Explore body systems with quick facts and anatomy quizzes." },
      { property: "og:title", content: "Anatomy — Learn the body fast" },
      { property: "og:description", content: "Explore body systems with quick facts and quizzes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Anatomy,
});

const colors = ["bg-pink", "bg-gold", "bg-primary", "bg-success", "bg-accent"];

function Anatomy() {
  const systems = [...new Set(anatomy.map((a) => a.system))];
  const [sys, setSys] = useState<string | null>(null);
  const [quiz, setQuiz] = useState(false);
  const list = anatomy.filter((a) => !sys || a.system === sys);
  return (
    <Shell title="Anatomy">
      <section>
        <p className="font-display text-4xl leading-tight">Learn anatomy <em className="text-pink">fast</em></p>
        <button onClick={() => setQuiz(true)} className="chunky chunky-press mt-4 w-full rounded-full bg-gold py-4 text-lg font-bold text-ink">Start anatomy quiz ›</button>
      </section>
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setSys(null)} className={`chunky rounded-full px-4 py-1 font-semibold ${!sys ? "bg-cream text-ink" : "bg-card"}`}>All</button>
        {systems.map((s) => (
          <button key={s} onClick={() => setSys(s)} className={`chunky rounded-full px-4 py-1 font-semibold ${sys === s ? "bg-cream text-ink" : "bg-card"}`}>{s}</button>
        ))}
      </div>
      <div className="space-y-3">
        {list.map((a) => (
          <article key={a.part} className="chunky flex gap-4 rounded-3xl bg-card p-5">
            <span className={`mt-1 size-4 shrink-0 rounded-full border-2 ${colors[systems.indexOf(a.system) % colors.length]}`} />
            <div>
              <h3 className="text-xl font-bold">{a.part}</h3>
              <p className="text-sm text-muted-foreground">{a.system} system</p>
              <p className="mt-2">{a.fact}</p>
            </div>
          </article>
        ))}
      </div>
      {quiz && <Quiz mode={{ kind: "anatomy", name: "Anatomy quiz" }} onClose={() => setQuiz(false)} />}
    </Shell>
  );
}
