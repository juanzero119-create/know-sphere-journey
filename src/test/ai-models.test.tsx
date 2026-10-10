import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import { ModelManager } from '@/routes/ai';

afterEach(cleanup);
it('validates, adds, selects, and removes a custom model', () => {
  render(<ModelManager/>);
  fireEvent.click(screen.getByRole('button', { name: 'Add model' }));
  const dialog = within(screen.getByRole('dialog'));
  fireEvent.click(dialog.getByRole('button', { name: 'Add model' }));
  expect(dialog.getByRole('alert')).toHaveTextContent('Enter a model name');
  fireEvent.change(dialog.getByLabelText('Model name'), { target: { value: 'My model' } });
  fireEvent.change(dialog.getByLabelText('Provider'), { target: { value: 'Example' } });
  fireEvent.change(dialog.getByLabelText('Model ID'), { target: { value: 'example/test' } });
  fireEvent.click(dialog.getByRole('button', { name: 'Add model' }));
  const model = screen.getByRole('button', { name: /My model Example/ });
  fireEvent.click(model);
  expect(model).toHaveAttribute('aria-pressed', 'true');
  fireEvent.click(screen.getByRole('button', { name: 'Remove My model' }));
  expect(screen.queryByRole('button', { name: /My model Example/ })).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: /GPT-6 Astra OpenAI/ })).toHaveAttribute('aria-pressed', 'true');
});