import { useEffect, useState } from "react";

type Progress = { xp: number; streak: number; lastDay: string; ratings: Record<string, number> };
const KEY = "lexi-progress";
const empty: Progress = { xp: 0, streak: 0, lastDay: "", ratings: {} };

function read(): Progress {
  try { return { ...empty, ...JSON.parse(localStorage.getItem(KEY) || "{}") }; } catch { return empty; }
}

export function useProgress() {
  const [p, setP] = useState<Progress>(empty);
  useEffect(() => setP(read()), []);
  const save = (next: Progress) => { localStorage.setItem(KEY, JSON.stringify(next)); setP(next); };
  const addXp = (n: number) => {
    const cur = read();
    const today = new Date().toDateString();
    const y = new Date(Date.now() - 864e5).toDateString();
    const streak = cur.lastDay === today ? cur.streak : cur.lastDay === y ? cur.streak + 1 : 1;
    save({ ...cur, xp: cur.xp + n, streak, lastDay: today });
  };
  const rate = (title: string, stars: number) => {
    const cur = read();
    save({ ...cur, ratings: { ...cur.ratings, [title]: stars } });
  };
  return { ...p, addXp, rate };
}
