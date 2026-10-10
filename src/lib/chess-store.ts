import { useSyncExternalStore } from 'react';
import { Chess, type Square } from 'chess.js';
import { getAiMove } from '@/lib/chess-ai.functions';
import { DEFAULT_ELO, eloSchema } from '@/lib/chess-elo';

export type ChessMode = 'ai' | '2p' | 'aivai';

const BLITZ = 3 * 60 * 1000;
const INC = 2000;

export interface ChessState {
  version: number;
  clock: { w: number; b: number };
  started: boolean;
  mode: ChessMode;
  humanSide: 'w' | 'b';
  lastMove: [Square, Square] | null;
  thinking: boolean;
  aiNote: string;
  elo: { w: number; b: number };
}

const initialState: ChessState = {
  version: 0,
  clock: { w: BLITZ, b: BLITZ },
  started: false,
  mode: 'ai',
  humanSide: 'w',
  lastMove: null,
  thinking: false,
  aiNote: '',
  elo: { w: DEFAULT_ELO, b: DEFAULT_ELO },
};

// Module-level game + state: survives route unmounts, so the game (and AI
// moves) keep running while the user browses other tabs. Visit-scoped only.
let game = new Chess();
let state: ChessState = initialState;
const listeners = new Set<() => void>();

function emit() {
  state = { ...state, version: state.version + 1 };
  listeners.forEach((l) => l());
}

export function subscribeChess(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
export function getChessSnapshot(): ChessState {
  return state;
}
const getChessServerSnapshot = (): ChessState => initialState;

export function useChessStore() {
  const snapshot = useSyncExternalStore(subscribeChess, getChessSnapshot, getChessServerSnapshot);
  return { game, state: snapshot };
}

let clockId: ReturnType<typeof setInterval> | null = null;
let lastTick = 0;

function isOver() {
  return game.isGameOver() || state.clock.w <= 0 || state.clock.b <= 0;
}

function startClock() {
  if (clockId) return;
  lastTick = Date.now();
  clockId = setInterval(() => {
    const now = Date.now();
    const d = now - lastTick;
    lastTick = now;
    if (game.isGameOver()) {
      stopClock();
      return;
    }
    const turn = game.turn();
    state.clock = { ...state.clock, [turn]: state.clock[turn] - d };
    emit();
    if (state.clock[turn] <= 0) stopClock();
  }, 100);
}

function stopClock() {
  if (clockId) {
    clearInterval(clockId);
    clockId = null;
  }
}

function applyMove(from: Square, to: Square, turn: 'w' | 'b') {
  state.clock = { ...state.clock, [turn]: state.clock[turn] + (state.started ? INC : 0) };
  state.started = true;
  state.lastMove = [from, to];
  startClock();
  emit();
  void maybeAiMove();
}

export function playMove(from: Square, to: Square) {
  if (isOver() || state.thinking) return;
  const turn = game.turn();
  if (state.mode === 'aivai' || (state.mode === 'ai' && turn !== state.humanSide)) return;
  game.move({ from, to, promotion: 'q' });
  applyMove(from, to, turn);
}

let aiRunning = false;
async function maybeAiMove() {
  const turn = game.turn();
  const aiTurn = state.mode === 'aivai' || (state.mode === 'ai' && turn !== state.humanSide);
  if (!aiTurn || isOver() || aiRunning) return;
  aiRunning = true;
  state.thinking = true;
  state.aiNote = '';
  emit();
  const fen = game.fen();
  const model = localStorage.getItem('lexi-ai-model') || 'openai/gpt-6-astra';
  try {
    const r = await getAiMove({ data: { fen, model, elo: state.elo[turn] } });
    if (game.fen() !== fen) return; // game was reset while waiting
    if (isOver()) return; // clock ran out or game ended while the AI was thinking
    if ('error' in r && r.error) {
      state.aiNote = r.error;
      return;
    }
    if (!('move' in r) || !r.move) return;
    const m = game.move(r.move);
    if (!m) return;
    if (r.fallback) state.aiNote = 'The AI gave an unclear answer, so a random legal move was played.';
    applyMove(m.from, m.to, turn);
  } catch {
    state.aiNote = 'The AI could not move. Try again.';
  } finally {
    aiRunning = false;
    state.thinking = false;
    emit();
    void maybeAiMove();
  }
}

export function resetChess(mode?: ChessMode) {
  stopClock();
  game = new Chess();
  state = {
    ...initialState,
    version: state.version + 1,
    mode: mode ?? state.mode,
    clock: { w: BLITZ, b: BLITZ },
    elo: { ...state.elo },
  };
  listeners.forEach((l) => l());
  void maybeAiMove();
}

export function setChessMode(mode: ChessMode) {
  resetChess(mode);
}

export function setChessElo(side: 'w' | 'b', elo: number) {
  const parsed = eloSchema.safeParse(elo);
  if (!parsed.success) return;
  state = { ...state, elo: { ...state.elo, [side]: parsed.data } };
  emit();
}
