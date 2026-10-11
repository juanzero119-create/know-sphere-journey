import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
vi.mock('@/lib/chess-ai.functions', () => ({ getAiMove: vi.fn(() => new Promise(() => {})) }));
import { ChessTime } from '@/components/ChessTime';
import { timeSchema } from '@/lib/chess-time';
import { getChessSnapshot, resetChess, setChessTime } from '@/lib/chess-store';

beforeEach(() => vi.stubGlobal('ResizeObserver', class { observe() {} unobserve() {} disconnect() {} }));

afterEach(() => { cleanup(); setChessTime({ minutes: 3, incrementSec: 2 }); resetChess('2p'); });

it('validates time controls and rejects bad values', () => {
  expect(timeSchema.safeParse({ minutes: 0, incrementSec: 2 }).success).toBe(false);
  expect(timeSchema.safeParse({ minutes: 61, incrementSec: 2 }).success).toBe(false);
  expect(timeSchema.safeParse({ minutes: 5, incrementSec: 31 }).success).toBe(false);
  expect(timeSchema.safeParse({ minutes: 5, incrementSec: 3 }).success).toBe(true);
});

it('applies a new time control to the next game', () => {
  setChessTime({ minutes: 10, incrementSec: 5 });
  const state = getChessSnapshot();
  expect(state.time).toEqual({ minutes: 10, incrementSec: 5 });
  expect(state.clock.w).toBe(10 * 60 * 1000);
  expect(state.clock.b).toBe(10 * 60 * 1000);
  resetChess();
  expect(getChessSnapshot().clock.w).toBe(10 * 60 * 1000);
});

it('keeps the chosen time across new games and ignores redundant changes', () => {
  setChessTime({ minutes: 15, incrementSec: 10 });
  const before = getChessSnapshot().version;
  setChessTime({ minutes: 15, incrementSec: 10 });
  expect(getChessSnapshot().version).toBe(before);
  resetChess('ai');
  expect(getChessSnapshot().time).toEqual({ minutes: 15, incrementSec: 10 });
});

it('renders presets and sliders and applies a preset on click', () => {
  render(<ChessTime />);
  fireEvent.click(screen.getByRole('button', { name: '15+10 · Rapid+' }));
  expect(getChessSnapshot().time).toEqual({ minutes: 15, incrementSec: 10 });
  expect(screen.getByRole('slider', { name: 'Minutes per player' })).toHaveAttribute('aria-valuenow', '15');
});
