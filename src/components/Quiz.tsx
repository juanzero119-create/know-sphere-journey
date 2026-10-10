import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { buildQuiz, type Q } from "@/lib/data";
import { useProgress } from "@/lib/progress";

export type Mode = { kind: "words" | "anatomy" | "mixed"; name: string; lives?: number; seconds?: number };

export function Quiz({ mode, onClose }: { mode: Mode; onClose: () => void }) {
  const { addXp } = useProgress();
  const [qs] = useState<Q[]>(() => buildQuiz(mode.kind, mode.seconds ? 10 : 6));
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(mode.lives ?? 99);
  const [time, setTime] = useState(mode.seconds ?? 0);
  const done = i >= qs.length || lives <= 0 || (mode.seconds !== undefined && time <= 0);

  useEffect(() => {
    if (!mode.seconds || done) return;
    const t = setInterval(() => setTime((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [mode.seconds, done]);

  useEffect(() => { if (done) addXp(score * 10); }, [done]); // eslint-disable-line

  const q = qs[i];
  const choose = (o: string) => {
    if (picked) return;
    setPicked(o);
    if (o === q.answer) setScore((s) => s + 1); else setLives((l) => l - 1);
    setTimeout(() => { setPicked(null); setI((n) => n + 1); }, mode.seconds ? 500 : 1100);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-background">
      <div className="mx-auto max-w-xl p-5">
        <div className="mb-6 flex items-center gap-3">
          <button onClick={onClose} aria-label="Close"><X className="size-7" /></button>
          <div className="h-4 flex-1 overflow-hidden rounded-full border-2 bg-muted">
            <div className="h-full bg-success transition-all" style={{ width: `${(Math.min(i, qs.length) / qs.length) * 100}%` }} />
          </div>
          {mode.lives && <span className="font-semibold">❤️ {lives}</span>}
          {mode.seconds && <span className="font-semibold">⏱ {time}s</span>}
        </div>
        {done ? (
          <div className="chunky mt-10 rounded-3xl bg-primary p-8 text-center text-primary-foreground">
            <p className="font-display text-5xl">{score}/{qs.length}</p>
            <p className="mt-2 text-lg">{mode.name} complete · +{score * 10} XP</p>
            <button onClick={onClose} className="chunky chunky-press mt-6 rounded-full bg-cream px-6 py-3 font-semibold text-ink">Continue</button>
          </div>
        ) : (
          <>
            <p className="section-label">{mode.name}</p>
            <h2 className="mt-2 mb-8 text-2xl font-bold">{q.prompt}</h2>
            <div className="space-y-3">
              {q.options.map((o) => {
                const state = picked && (o === q.answer ? "bg-success text-ink" : o === picked ? "bg-accent text-ink" : "bg-card");
                return (
                  <button key={o} onClick={() => choose(o)} className={`chunky chunky-press w-full rounded-2xl p-4 text-left text-lg font-semibold ${state || "bg-card"}`}>
                    {o}
                  </button>
                );
              })}
            </div>
            {picked && q.note && <p className="mt-6 text-muted-foreground italic">{q.note}</p>}
          </>
        )}
      </div>
    </div>
  );
}
