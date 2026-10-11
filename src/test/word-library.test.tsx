import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { WordLibrary } from '@/components/WordLibrary';
import { renderWithRouter } from '@/test/router';

describe('Word library', () => {
  it('shows only the word and its part of speech until the detail key is used', async () => {
    await renderWithRouter(<WordLibrary posFilter={null} />);

    expect(screen.getByText('Immutable')).toBeInTheDocument();
    expect(screen.queryByText('Unchanging forever')).toBeNull();

    const key = screen.getByRole('button', { name: 'Show full definition of Immutable' });
    expect(key).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(key);

    expect(screen.getByText('Unchanging forever')).toBeInTheDocument();
    expect(screen.getByText('“The laws of physics are immutable.”')).toBeInTheDocument();
    expect(screen.getByText('Permanent')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Hide full definition of Immutable' })).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(screen.getByRole('button', { name: 'Hide full definition of Immutable' }));
    expect(screen.queryByText('Unchanging forever')).toBeNull();
  });

  it('opens one word at a time', async () => {
    await renderWithRouter(<WordLibrary posFilter={null} />);

    fireEvent.click(screen.getByRole('button', { name: 'Show full definition of Immutable' }));
    fireEvent.click(screen.getByRole('button', { name: 'Show full definition of Callous' }));

    expect(screen.queryByText('Unchanging forever')).toBeNull();
    expect(screen.getByText('Unfeeling toward others’ suffering')).toBeInTheDocument();
  });

  it('keeps the part-of-speech filter and search working', async () => {
    await renderWithRouter(<WordLibrary posFilter="verb" />);

    expect(screen.getByText('Forgo')).toBeInTheDocument();
    expect(screen.queryByText('Immutable')).toBeNull();

    fireEvent.change(screen.getByLabelText('Search words'), { target: { value: 'forgo' } });
    expect(screen.queryByText('Contemplating')).toBeNull();

    fireEvent.change(screen.getByLabelText('Search words'), { target: { value: 'zzz' } });
    expect(screen.getByText('No words match your search.')).toBeInTheDocument();
  });

  it('lists words alphabetically and reverses with the Z–A toggle', async () => {
    await renderWithRouter(<WordLibrary posFilter={null} />);

    const rows = () => screen.getAllByRole('article').map(a => a.querySelector('h3')?.textContent);
    expect(rows().slice(0, 3)).toEqual(['Abstain', 'Accede', 'Acculturate']);
    expect(rows().at(-1)).toBe('Vindicate');

    fireEvent.click(screen.getByRole('button', { name: 'Z–A' }));
    expect(rows().slice(0, 3)).toEqual(['Vindicate', 'Vilify', 'Unravel']);
    expect(rows().at(-1)).toBe('Abstain');

    fireEvent.click(screen.getByRole('button', { name: 'A–Z' }));
    expect(rows()[0]).toBe('Abstain');
  });
});
