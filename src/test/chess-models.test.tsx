import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
vi.mock('@/lib/chess-ai.functions', () => ({ getAiMove: vi.fn(() => new Promise(() => {})) }));
import { ChessElo } from '@/components/ChessElo';
import { ModelManager } from '@/routes/ai';
import { chooseChessModel, chooseChessModelForBoth, getChessModelFor } from '@/lib/chess-models';

beforeEach(() => vi.stubGlobal('ResizeObserver', class { observe() {} unobserve() {} disconnect() {} }));

afterEach(cleanup);

it('keeps an independent model for each colour', () => {
  chooseChessModelForBoth('openai/gpt-6-astra');
  chooseChessModel('w', 'openai/gpt-6-luna');
  expect(getChessModelFor('w')).toBe('openai/gpt-6-luna');
  expect(getChessModelFor('b')).toBe('openai/gpt-6-astra');
});

it('renders one model selector per colour, each showing its own choice', () => {
  chooseChessModel('b', 'anthropic/claude-sonnet-5');
  render(<ChessElo />);
  const white = screen.getByRole('button', { name: 'White AI model' });
  const black = screen.getByRole('button', { name: 'Black AI model' });
  expect(white).toHaveTextContent('GPT-6 Luna');
  expect(black).toHaveTextContent('Claude Sonnet 5');
  expect(screen.getByText(/claude-sonnet-5/)).toBeInTheDocument();
  cleanup();
});

it('opens the card list and picks a model for the opened colour only', () => {
  chooseChessModelForBoth('openai/gpt-6-astra');
  render(<ChessElo />);
  fireEvent.click(screen.getByRole('button', { name: 'White AI model' }));
  const card = screen.getByRole('button', { name: 'GPT-6 Luna OpenAI' });
  fireEvent.click(card);
  expect(getChessModelFor('w')).toBe('openai/gpt-6-luna');
  expect(getChessModelFor('b')).toBe('openai/gpt-6-astra');
  cleanup();
});

it('assigns a model to both colours from the model list', () => {
  chooseChessModelForBoth('openai/gpt-6-astra');
  render(<ModelManager />);
  const card = screen.getByRole('button', { name: 'GPT-6 Luna OpenAI' });
  expect(card).toHaveAttribute('aria-pressed', 'false');
  fireEvent.click(card);
  expect(card).toHaveAttribute('aria-pressed', 'true');
  expect(getChessModelFor('w')).toBe('openai/gpt-6-luna');
  expect(getChessModelFor('b')).toBe('openai/gpt-6-luna');
});
