import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
vi.mock('@/lib/chess-ai.functions', () => ({ getAiMove: vi.fn(() => new Promise(() => {})) }));
import { ChessModelPick } from '@/components/ChessModelPick';
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
  render(<ChessModelPick />);
  const white = screen.getByRole('combobox', { name: 'White AI model' });
  const black = screen.getByRole('combobox', { name: 'Black AI model' });
  expect(white).toHaveTextContent('GPT-6 Luna');
  expect(black).toHaveTextContent('Claude Sonnet 5');
  expect(screen.getByText(/claude-sonnet-5/)).toBeInTheDocument();
  cleanup();
});

it('assigns a model to both colours from the model list', () => {
  chooseChessModelForBoth('openai/gpt-6-astra');
  render(<ModelManager pickers={false} />);
  const card = screen.getByRole('button', { name: 'GPT-6 Luna OpenAI' });
  expect(card).toHaveAttribute('aria-pressed', 'false');
  fireEvent.click(card);
  expect(card).toHaveAttribute('aria-pressed', 'true');
  expect(getChessModelFor('w')).toBe('openai/gpt-6-luna');
  expect(getChessModelFor('b')).toBe('openai/gpt-6-luna');
});
