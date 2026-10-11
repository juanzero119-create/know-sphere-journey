import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Section } from "@/components/Section";
import { Star, Play, Search, LoaderCircle } from "lucide-react";
import { Shell } from "@/components/Shell";
import { sortByAlphabetical } from "@/lib/alphabetical";
import { searchVideos, type LiveVideo } from "@/lib/video-search.functions";
import { useProgress } from "@/lib/progress";

export const Route = createFileRoute("/watch")({
  head: () => ({
    meta: [
      { title: "Watch — Learning videos rated by you | Lexi" },
      { name: "description", content: "Search and watch learning videos from YouTube and give them your own star ratings." },
      { property: "og:title", content: "Watch — Learning videos rated by you" },
      { property: "og:description", content: "Watch learning videos and rate them." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Watch,
});

const TOPICS = ["All", "Anatomy", "Vocabulary", "Film", "Chess", "Science"] as const;

const TOPIC_QUERIES: Record<string, string> = {
  All: "educational documentary",
  Anatomy: "human anatomy explained",
  Vocabulary: "english vocabulary lesson",
  Film: "film analysis video essay",
  Chess: "chess tactics lesson",
  Science: "science explained",
};

function Watch() {
  const [cur, setCur] = useState<LiveVideo | undefined>();
  const [topic, setTopic] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("relevance");
  const [results, setResults] = useState<LiveVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { ratings, rate } = useProgress();
  const reqRef = useRef(0);

  const runSearch = async (query: string) => {
    const req = ++reqRef.current;
    setLoading(true);
    setError(null);
    try {
      const vids = await searchVideos({ data: { query } });
      if (req !== reqRef.current) return;
      setResults(vids);
      setCur((prev) => (prev && vids.some((v) => v.id === prev.id) ? prev : vids[0]));
    } catch {
      if (req !== reqRef.current) return;
      setError("Couldn't reach YouTube right now. Check your connection and try again.");
      setResults([]);
    } finally {
      if (req === reqRef.current) setLoading(false);
    }
  };

  // Initial load + topic changes
  useEffect(() => {
    runSearch(TOPIC_QUERIES[topic] ?? TOPIC_QUERIES.All);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic]);

  // Debounced free-text search
  useEffect(() => {
    const q = search.trim();
    if (!q) return;
    const t = setTimeout(() => runSearch(q), 500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const list =
    sort === "title"
      ? sortByAlphabetical(results, (v) => v.title)
      : sort === "personal"
        ? [...results].sort((a, b) => (ratings[b.title] ?? 0) - (ratings[a.title] ?? 0))
        : results;

  return (
    <Shell title="Watch">
      <Section number="01" title="Now playing" subtitle="Live from YouTube.">
        {cur ? (
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <div className="overflow-hidden rounded-lg border border-border bg-ink">
              <iframe
                className="aspect-video w-full"
                src={`https://www.youtube-nocookie.com/embed/${cur.id}`}
                title={cur.title}
                allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="self-center">
              <p className="text-xs font-semibold text-muted-foreground">LIVE RESULT</p>
              <h2 className="mt-3 text-2xl font-semibold">{cur.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {cur.channel}
                {cur.published ? ` · ${cur.published}` : ""}
                {cur.views ? ` · ${cur.views}` : ""}
              </p>
              <div className="mt-5 border-t border-border pt-4">
                <p className="mb-2 text-xs font-semibold text-muted-foreground">YOUR RATING</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Button
                      variant="ghost"
                      size="icon"
                      key={n}
                      onClick={() => rate(cur.title, n)}
                      aria-label={`${n} stars`}
                      title={`Rate ${n} stars`}
                    >
                      <Star
                        className={`size-5 ${n <= (ratings[cur.title] ?? 0) ? "fill-gold text-gold" : "text-muted-foreground"}`}
                      />
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid aspect-video place-items-center rounded-lg border border-border bg-card text-sm text-muted-foreground">
            {loading ? "Loading videos…" : "Search for a video to start watching."}
          </div>
        )}
      </Section>

      <Section number="02" title="Browse YouTube" subtitle="Search anything, or pick a topic.">
        <div className="flex flex-wrap gap-2">
          {TOPICS.map((t) => (
            <Button key={t} variant={topic === t ? "default" : "outline"} onClick={() => setTopic(t)}>
              {t}
            </Button>
          ))}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
            <Input
              aria-label="Search YouTube"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search YouTube…"
              className="h-10 bg-card pl-10"
            />
          </div>
          <select
            aria-label="Sort videos"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-10 rounded-md border border-input bg-card px-3 text-sm"
          >
            <option value="relevance">Relevance</option>
            <option value="personal">Your rating</option>
            <option value="title">Title A–Z</option>
          </select>
        </div>
        {loading && (
          <p className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
            <LoaderCircle className="size-4 animate-spin" /> Searching YouTube…
          </p>
        )}
        {error && <p className="py-6 text-center text-muted-foreground">{error}</p>}
        {!loading && !error && (
          <div className="space-y-3">
            {list.map((v, idx) => (
              <Button
                variant="ghost"
                key={v.id}
                onClick={() => {
                  setCur(v);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`flex h-auto min-h-24 w-full justify-start gap-3 whitespace-normal rounded-lg border p-4 text-left hover:bg-muted ${cur?.id === v.id ? "border-primary bg-card" : "border-border bg-card"}`}
              >
                <span className="w-5 shrink-0 text-sm font-normal text-muted-foreground">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                {v.thumbnail ? (
                  <img
                    src={v.thumbnail}
                    alt=""
                    className="h-16 w-28 shrink-0 rounded-md object-cover"
                    loading="lazy"
                  />
                ) : (
                  <span className="grid size-11 shrink-0 place-items-center rounded-md bg-secondary">
                    <Play />
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold">{v.title}</span>
                  <span className="mt-1 block text-xs font-normal text-muted-foreground">
                    {v.channel}
                    {v.duration ? ` · ${v.duration}` : ""}
                    {v.views ? ` · ${v.views}` : ""}
                  </span>
                  {ratings[v.title] ? (
                    <span className="mt-1 block text-xs text-gold">Your rating: {ratings[v.title]} / 5</span>
                  ) : null}
                </span>
              </Button>
            ))}
            {list.length === 0 && (
              <p className="py-6 text-center text-muted-foreground">No videos found.</p>
            )}
          </div>
        )}
      </Section>

      <Section number="03" title="Your ratings" subtitle="Your own perspective on what you watch.">
        <div className="flex gap-10">
          <div>
            <p className="text-3xl font-semibold">{Object.keys(ratings).length}</p>
            <p className="mt-1 text-sm text-muted-foreground">Videos rated</p>
          </div>
          <div>
            <p className="text-3xl font-semibold">
              {Object.values(ratings).length
                ? (Object.values(ratings).reduce((a, b) => a + b, 0) / Object.values(ratings).length).toFixed(1)
                : "—"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">Average rating / 5</p>
          </div>
        </div>
      </Section>
    </Shell>
  );
}
