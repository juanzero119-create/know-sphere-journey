import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { ActorPortrait } from '@/components/ActorPortrait';

afterEach(cleanup);
describe('Actor portraits', () => {
  it('shows an existing cast portrait', () => {
    render(<ActorPortrait name="Tom Hanks"/>);
    expect(screen.getByRole('img', { name: 'Portrait of Tom Hanks' })).toHaveAttribute('src', expect.stringContaining('https://'));
  });
  it('normalizes apostrophes for cast names', () => {
    render(<ActorPortrait name="Peter O’Toole"/>);
    expect(screen.getByRole('img', { name: 'Portrait of Peter O’Toole' })).toHaveAttribute('src');
  });
  it('replaces a failed photo with stable initials', () => {
    render(<ActorPortrait name="Tom Hanks"/>);
    fireEvent.error(screen.getByRole('img'));
    expect(screen.getByRole('img', { name: 'Portrait unavailable for Tom Hanks' })).toHaveTextContent('TH');
  });
});