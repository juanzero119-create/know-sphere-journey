import { describe, expect, it } from 'vitest';
import { flipChessBoard, getChessSnapshot, resetChess, setChessHumanSide, setChessOrientation } from '@/lib/chess-store';

describe('chess board orientation', () => {
  it('flips between white and black at the bottom', () => {
    setChessOrientation('w');
    flipChessBoard();
    expect(getChessSnapshot().orientation).toBe('b');
    flipChessBoard();
    expect(getChessSnapshot().orientation).toBe('w');
  });

  it('ignores a flip to the colour already showing', () => {
    setChessOrientation('w');
    const before = getChessSnapshot().version;
    setChessOrientation('w');
    expect(getChessSnapshot().version).toBe(before);
  });

  it('keeps the chosen orientation through a new game', () => {
    setChessOrientation('b');
    resetChess();
    expect(getChessSnapshot().orientation).toBe('b');
    expect(getChessSnapshot().paused).toBe(false);
    setChessOrientation('w');
  });

  it('turns the board to the colour the human picks', () => {
    setChessHumanSide('b');
    expect(getChessSnapshot().orientation).toBe('b');
    setChessHumanSide('w');
    expect(getChessSnapshot().orientation).toBe('w');
  });
});
