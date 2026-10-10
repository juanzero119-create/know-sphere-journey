import { useSyncExternalStore } from 'react';

// Player rating that builds up game by game (standard Elo, K=32).
// Browser-only, stored on this device; SSR sees a fixed snapshot.
export interface RatingState { rating: number; games: number; wins: number; losses: number; draws: number; lastChange: number | null }
const KEY = 'lexi-chess-rating';
export const START_RATING = 800;
const initial: RatingState = { rating: START_RATING, games: 0, wins: 0, losses: 0, draws: 0, lastChange: null };
let state: RatingState | null = null;
const listeners = new Set<() => void>();

function load(): RatingState {
  if (state) return state;
  try { const raw = localStorage.getItem(KEY); state = raw ? { ...initial, ...JSON.parse(raw) } : initial; } catch { state = initial; }
  return state!;
}
function save(next: RatingState) {
  state = next;
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ }
  listeners.forEach(l => l());
}

export function expectedScore(player: number, opponent: number) {
  return 1 / (1 + 10 ** ((opponent - player) / 400));
}

/** score: 1 win, 0.5 draw, 0 loss */
export function recordRatedGame(opponentElo: number, score: 0 | 0.5 | 1) {
  const s = load();
  const change = Math.round(32 * (score - expectedScore(s.rating, opponentElo)));
  save({
    rating: Math.max(100, s.rating + change), games: s.games + 1,
    wins: s.wins + (score === 1 ? 1 : 0), losses: s.losses + (score === 0 ? 1 : 0), draws: s.draws + (score === 0.5 ? 1 : 0),
    lastChange: change,
  });
}

export function resetRating() { save(initial); }

export function useChessRating() {
  return useSyncExternalStore(
    l => { listeners.add(l); return () => { listeners.delete(l); }; },
    load,
    () => initial,
  );
}
