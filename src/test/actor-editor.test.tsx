import { fireEvent, screen, within, cleanup } from '@testing-library/react';
import { renderWithRouter } from './router';
import { afterEach, describe, expect, it } from 'vitest';
import { ActorEditor } from '@/components/ActorEditor';

afterEach(cleanup);
describe('Actor editor', async () => {
 it('pre-loads the IMDb actor names without the six removed actors', async () => {
  await renderWithRouter(<ActorEditor/>);
  expect(screen.getAllByRole('article').length).toBe(100);
  expect(screen.getByText('Leonardo')).toBeInTheDocument();
  expect(screen.getByText('DiCaprio')).toBeInTheDocument();
  expect(screen.getAllByText('Kevin').length).toBe(1);
  expect(screen.getByText('Spacey')).toBeInTheDocument();
  expect(screen.getByText('Robin')).toBeInTheDocument();
  expect(screen.getByText('Williams')).toBeInTheDocument();
  for (const lastName of ['Hurt', 'Ruffalo', 'Damon', 'Kilmer', 'Costner']) {
   expect(screen.queryByText(lastName)).not.toBeInTheDocument();
  }
 });
 it('adds, updates, and removes an actor with independent highlights', { timeout: 20000 }, async () => {
  await renderWithRouter(<ActorEditor/>);
  fireEvent.change(screen.getByLabelText('First name'), { target: { value: 'Anne' } });
  fireEvent.change(screen.getByLabelText('Last name'), { target: { value: 'Hathaway' } });
  fireEvent.click(screen.getByRole('button', { name: 'First-name highlight: Rose' }));
  fireEvent.click(screen.getByRole('button', { name: 'Last-name highlight: Green' }));
  fireEvent.click(screen.getByRole('button', { name: 'Add actor' }));
  const actor = screen.getAllByRole('article').at(-1)!;
  expect(within(actor).getByText('Anne')).toHaveClass('bg-name-rose');
  expect(within(actor).getByText('Hathaway')).toHaveClass('bg-name-green');
  fireEvent.click(screen.getByRole('button', { name: 'Edit Anne Hathaway' }));
  fireEvent.change(screen.getByLabelText('First name'), { target: { value: 'Annie' } });
  fireEvent.click(screen.getByRole('button', { name: 'Save changes' }));
  expect(within(screen.getAllByRole('article').at(-1)!).getByText('Annie')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Remove Annie Hathaway' }));
  expect(screen.queryByText('Annie')).not.toBeInTheDocument();
  expect(screen.getAllByRole('article').length).toBe(100);
 });
 it('rejects whitespace-only names', async () => {
  await renderWithRouter(<ActorEditor/>);
  fireEvent.change(screen.getByLabelText('First name'), { target: { value: '  ' } });
  fireEvent.change(screen.getByLabelText('Last name'), { target: { value: 'Smith' } });
  fireEvent.click(screen.getByRole('button', { name: 'Add actor' }));
  expect(screen.getByText('Enter a first and last name.')).toBeInTheDocument();
  expect(screen.getAllByRole('article').length).toBe(100);
 });
});
