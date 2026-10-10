import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
vi.mock('@/lib/chess-ai.functions', () => ({ getAiMove: vi.fn(() => new Promise(() => {})) }));
import { ChessElo } from '@/components/ChessElo';
import { eloSchema } from '@/lib/chess-elo';
import { getChessSnapshot, resetChess, setChessElo, setChessHumanSide, setChessMode } from '@/lib/chess-store';

beforeEach(() => vi.stubGlobal('ResizeObserver', class { observe() {} unobserve() {} disconnect() {} }));

afterEach(() => { cleanup(); resetChess('2p'); });

it('validates bounded Elo targets and preserves them across new games', () => {
  expect(eloSchema.safeParse(300).success).toBe(false);
  expect(eloSchema.safeParse(2450).success).toBe(false);
  expect(eloSchema.safeParse(1250).success).toBe(false);
  setChessElo('b', 1600);
  setChessElo('b', 9999);
  resetChess('ai');
  expect(getChessSnapshot().elo.b).toBe(1600);
  render(<ChessElo />);
  fireEvent.keyDown(screen.getByRole('slider', { name: 'Black AI Elo' }), { key: 'ArrowRight' });
  expect(getChessSnapshot().elo.b).toBe(1700);
  cleanup();
  render(<ChessElo />);
  expect(screen.getByRole('slider', { name: 'Black AI Elo' })).toHaveAttribute('aria-valuenow', '1700');
});

it('allows independent White and Black Elo targets in AI vs AI', () => {
  setChessMode('aivai');
  setChessElo('w', 800);
  setChessElo('b', 2000);
  render(<ChessElo />);
  expect(screen.getByRole('slider', { name: 'White AI Elo' })).toHaveAttribute('aria-valuenow', '800');
  expect(screen.getByRole('slider', { name: 'Black AI Elo' })).toHaveAttribute('aria-valuenow', '2000');
});

it('shows both AI difficulties when you play Black in Vs AI', () => {
  setChessMode('ai');
  setChessHumanSide('b');
  setChessElo('w', 1400);
  expect(getChessSnapshot().humanSide).toBe('b');
  render(<ChessElo />);
  expect(screen.getByRole('slider', { name: 'White AI Elo' })).toHaveAttribute('aria-valuenow', '1400');
  expect(screen.getByRole('slider', { name: 'Black AI Elo' })).toBeInTheDocument();
  fireEvent.keyDown(screen.getByRole('slider', { name: 'White AI Elo' }), { key: 'ArrowLeft' });
  expect(getChessSnapshot().elo.w).toBe(1300);
});