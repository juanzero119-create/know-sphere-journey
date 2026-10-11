import { describe, expect, it } from 'vitest';
import { getChessSnapshot, resetChess, setChessPaused, startChess } from '@/lib/chess-store';

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
});
