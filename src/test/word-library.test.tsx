import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { WordLibrary } from '@/components/WordLibrary';
import { renderWithRouter } from '@/test/router';

describe('Word library', () => {
  it('shows only the word and its part of speech until the detail key is used', async () => {
    await renderWithRouter(<WordLibrary posFilter={null} />);

    expect(screen.getByText('Ephemeral')).toBeInTheDocument();
    expect(screen.queryByText('Lasting a very short time')).toBeNull();

    const key = screen.getByRole('button', { name: 'Show full definition of Ephemeral' });
    expect(key).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(key);

    expect(screen.getByText('Lasting a very short time')).toBeInTheDocument();
    expect(screen.getByText('“The ephemeral beauty of a sunset.”')).toBeInTheDocument();
    expect(screen.getByText('Fleeting')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Hide full definition of Ephemeral' })).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(screen.getByRole('button', { name: 'Hide full definition of Ephemeral' }));
    expect(screen.queryByText('Lasting a very short time')).toBeNull();
  });

  it('opens one word at a time', async () => {
    await renderWithRouter(<WordLibrary posFilter={null} />);

    fireEvent.click(screen.getByRole('button', { name: 'Show full definition of Ephemeral' }));
    fireEvent.click(screen.getByRole('button', { name: 'Show full definition of Candid' }));

    expect(screen.queryByText('Lasting a very short time')).toBeNull();
    expect(screen.getByText('Truthful and straightforward')).toBeInTheDocument();
  });

  it('keeps the part-of-speech filter and search working', async () => {
    await renderWithRouter(<WordLibrary posFilter="verb" />);

    expect(screen.getByText('Persevere')).toBeInTheDocument();
    expect(screen.queryByText('Ephemeral')).toBeNull();

    fireEvent.change(screen.getByLabelText('Search words'), { target: { value: 'persevere' } });
    expect(screen.queryByText('Clarify')).toBeNull();

    fireEvent.change(screen.getByLabelText('Search words'), { target: { value: 'zzz' } });
    expect(screen.getByText('No words match your search.')).toBeInTheDocument();
  });
});
