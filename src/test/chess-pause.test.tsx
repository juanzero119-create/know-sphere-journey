import { describe, expect, it } from 'vitest';
import { getChessSnapshot, resetChess, setChessHumanSide, setChessPaused, startChess } from '@/lib/chess-store';

describe('chess pause', () => {
  it('starts unpaused and toggles', () => {
    resetChess();
    expect(getChessSnapshot().paused).toBe(false);
    setChessPaused(true);
    expect(getChessSnapshot().paused).toBe(true);
    setChessPaused(false);
    expect(getChessSnapshot().paused).toBe(false);
  });

  it('a new game clears pause', () => {
    setChessPaused(true);
    resetChess();
    expect(getChessSnapshot().paused).toBe(false);
  });

  it('ignores redundant toggles', () => {
    resetChess();
    const before = getChessSnapshot().version;
    setChessPaused(false);
    expect(getChessSnapshot().version).toBe(before);
    expect(getChessSnapshot().paused).toBe(false);
  });

  it('a new game is not live until Play is pressed', () => {
    resetChess();
    expect(getChessSnapshot().playPressed).toBe(false);
    startChess();
    expect(getChessSnapshot().playPressed).toBe(true);
    resetChess();
    expect(getChessSnapshot().playPressed).toBe(false);
  });

  it('Play turns the game live and resumes a pause', () => {
    resetChess();
    startChess();
    const before = getChessSnapshot().version;
    startChess();
    expect(getChessSnapshot().version).toBe(before);
    setChessPaused(true);
    expect(getChessSnapshot().paused).toBe(true);
    startChess();
    expect(getChessSnapshot().paused).toBe(false);
    expect(getChessSnapshot().playPressed).toBe(true);
  });

  it('a new game is ready, not paused, even when the AI moves first', () => {
    setChessHumanSide('b'); // the AI plays White here
    expect(getChessSnapshot().paused).toBe(false);
    expect(getChessSnapshot().playPressed).toBe(false);
    expect(getChessSnapshot().thinking).toBe(false); // it waits instead of opening
    resetChess('aivai');
    expect(getChessSnapshot().paused).toBe(false);
    expect(getChessSnapshot().playPressed).toBe(false);
    expect(getChessSnapshot().thinking).toBe(false);
    setChessHumanSide('w');
  });
});
