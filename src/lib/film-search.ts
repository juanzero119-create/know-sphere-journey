import { movies, type Movie } from './movies';

export type ActorHit = { name: string; films: { movie: Movie; role: string }[]; score: number };
export type MovieHit = { movie: Movie; score: number; reason: string };

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();

/** Levenshtein distance, capped for speed. */
function dist(a: string, b: string) {
  if (Math.abs(a.length - b.length) > 3) return 99;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[b.length];
}

/** Score 0–100: exact > prefix > word prefix > substring > typo-tolerant word match. */
export function matchScore(query: string, text: string) {
  const q = norm(query), t = norm(text);
  if (!q || !t) return 0;
  if (t === q) return 100;
  if (t.startsWith(q)) return 90;
  const words = t.split(' ');
  if (words.some(w => w.startsWith(q))) return 80;
  if (t.includes(q)) return 65;
  const qWords = q.split(' ');
  let total = 0;
  for (const qw of qWords) {
    let best = 0;
    for (const w of words) {
      if (w.startsWith(qw)) best = Math.max(best, 1);
      else if (qw.length >= 3) {
        const d = dist(qw, w.slice(0, Math.max(qw.length, w.length)));
        const allowed = qw.length >= 6 ? 2 : 1;
        if (d <= allowed) best = Math.max(best, 1 - d * 0.3);
      }
    }
    if (best === 0) return 0;
    total += best;
  }
  return Math.round((total / qWords.length) * 55);
}

const actorIndex = (() => {
  const map = new Map<string, { movie: Movie; role: string }[]>();
  for (const m of movies) for (const [name, role] of m.cast) {
    if (!map.has(name)) map.set(name, []);
    map.get(name)!.push({ movie: m, role });
  }
  return map;
})();

export function searchActors(query: string, limit = 8): ActorHit[] {
  if (!norm(query)) return [];
  const hits: ActorHit[] = [];
  for (const [name, films] of actorIndex) {
    const s = matchScore(query, name);
    if (s > 0) hits.push({ name, films: [...films].sort((a, b) => b.movie.score - a.movie.score), score: s + Math.min(films.length, 5) });
  }
  return hits.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name)).slice(0, limit);
}

export function searchMovies(query: string, limit = 12): MovieHit[] {
  if (!norm(query)) return [];
  const hits: MovieHit[] = [];
  for (const m of movies) {
    const cands: [number, string][] = [
      [matchScore(query, m.title), 'Title'],
      [matchScore(query, m.director) * 0.8, `Director · ${m.director}`],
      ...m.cast.map(([n, r]) => [Math.max(matchScore(query, n) * 0.75, matchScore(query, r) * 0.6), `Cast · ${n} as ${r}`] as [number, string]),
      [matchScore(query, String(m.year)) * 0.5, `Year · ${m.year}`],
      [matchScore(query, m.genres.join(' ')) * 0.4, `Genre · ${m.genres.join(' / ')}`],
    ];
    const [best, reason] = cands.reduce((a, b) => (b[0] > a[0] ? b : a));
    if (best > 0) hits.push({ movie: m, score: best + m.score / 10, reason });
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, limit);
}
