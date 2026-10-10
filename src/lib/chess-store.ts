import { useSyncExternalStore } from 'react';
import { Chess, type Square } from 'chess.js';
import { getAiMove } from '@/lib/chess-ai.functions';
import { getChessModelFor } from '@/lib/chess-models';
import { DEFAULT_ELO, eloSchema } from '@/lib/chess-elo';
import { playGameEndSound, playMoveSound } from '@/lib/chess-sounds';

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
  paused: boolean;
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
  paused: false,
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
    if (state.paused) return; // clocks freeze while paused
    const turn = game.turn();
    state.clock = { ...state.clock, [turn]: state.clock[turn] - d };
    emit();
    if (state.clock[turn] <= 0) {
      stopClock();
      maybePlayEndSound();
    }
  }, 250);
}

function stopClock() {
  if (clockId) {
    clearInterval(clockId);
    clockId = null;
  }
}

let endSoundPlayed = false;
function maybePlayEndSound() {
  if (endSoundPlayed || !isOver()) return;
  endSoundPlayed = true;
  playGameEndSound();
}

function applyMove(from: Square, to: Square, turn: 'w' | 'b') {
  state.clock = { ...state.clock, [turn]: state.clock[turn] + (state.started ? INC : 0) };
  state.started = true;
  state.lastMove = [from, to];
  playMoveSound();
  maybePlayEndSound();
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
  if (!aiTurn || isOver() || state.paused || aiRunning) return;
  aiRunning = true;
  state.thinking = true;
  state.aiNote = '';
  emit();
  const fen = game.fen();
  const model = getChessModelFor(turn);
  try {
    const r = await getAiMove({ data: { fen, model, elo: state.elo[turn] } });
    if (game.fen() !== fen) return; // game was reset while waiting
    if (isOver() || state.paused) return; // clock ran out, game ended, or the user paused while the AI was thinking
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
  endSoundPlayed = false;
  game = new Chess();
  state = {
    ...initialState,
    version: state.version + 1,
    mode: mode ?? state.mode,
    humanSide: state.humanSide,
    clock: { w: BLITZ, b: BLITZ },
    elo: { ...state.elo },
  };
  listeners.forEach((l) => l());
  void maybeAiMove();
}

export function setChessMode(mode: ChessMode) {
  resetChess(mode);
}

export function setChessHumanSide(side: 'w' | 'b') {
  if (state.humanSide === side) return;
  state = { ...state, humanSide: side, version: state.version + 1 };
  resetChess();
}

export function setChessElo(side: 'w' | 'b', elo: number) {
  const parsed = eloSchema.safeParse(elo);
  if (!parsed.success) return;
  state = { ...state, elo: { ...state.elo, [side]: parsed.data } };
  emit();
}

export function setChessPaused(paused: boolean) {
  if (state.paused === paused) return;
  state = { ...state, paused, version: state.version + 1 };
  emit();
  if (!paused) void maybeAiMove(); // resume the AI loop where it stopped
}
