import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Star } from "lucide-react";
import { Shell } from "@/components/Shell";
import { videos, type Video } from "@/lib/data";
import { useProgress } from "@/lib/progress";

export const Route = createFileRoute("/watch")({
  head: () => ({
    meta: [
      { title: "Watch — Learning videos rated by you | Lexi" },
      { name: "description", content: "Watch learning videos and give them your own star ratings." },
      { property: "og:title", content: "Watch — Learning videos rated by you" },
      { property: "og:description", content: "Watch learning videos and rate them." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Watch,
});

function Watch() {
  const [cur, setCur] = useState<Video>(videos[0]);
  const [topic, setTopic] = useState<string>("All");
  const { ratings, rate } = useProgress();
  const list = videos.filter((v) => topic === "All" || v.topic === topic);
  return (
    <Shell title="Watch">
      <div className="chunky overflow-hidden rounded-3xl bg-ink">
        <iframe
          className="aspect-video w-full"
          src={`https://www.youtube-nocookie.com/embed/${cur.id}`}
          title={cur.title}
          allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
        <div className="bg-card p-5">
          <h2 className="text-xl font-bold">{cur.title}</h2>
          <p className="text-sm text-muted-foreground">{cur.channel} · {cur.year} · ⭐ {cur.rating}/10</p>
          <div className="mt-3 flex items-center gap-1">
            <span className="mr-2 text-sm">Your rating:</span>
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => rate(cur.title, n)} aria-label={`${n} stars`}>
                <Star className={`size-6 ${n <= (ratings[cur.title] ?? 0) ? "fill-gold text-gold" : "text-muted-foreground"}`} />
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        {["All", "Anatomy", "Words", "Film"].map((t) => (
          <button key={t} onClick={() => setTopic(t)} className={`chunky rounded-full px-4 py-1 font-semibold ${topic === t ? "bg-cream text-ink" : "bg-card"}`}>{t}</button>
        ))}
      </div>
      <p className="section-label">Top rated</p>
      <div className="space-y-3">
        {[...list].sort((a, b) => b.rating - a.rating).map((v, idx) => (
          <button key={v.title} onClick={() => { setCur(v); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="chunky chunky-press flex w-full items-center gap-4 rounded-2xl bg-card p-4 text-left">
            <span className="font-display text-3xl text-gold">{idx + 1}</span>
            <div className="flex-1">
              <p className="font-bold">{v.title}</p>
              <p className="text-sm text-muted-foreground">{v.channel} · {v.topic}</p>
            </div>
            <span className="rounded-lg border-2 bg-gold px-2 py-1 text-sm font-bold text-ink">{v.rating}</span>
          </button>
        ))}
      </div>
    </Shell>
  );
}
