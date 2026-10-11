import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { FilmMedia } from '@/components/FilmMedia';
import { movies } from '@/lib/movies';
import { trailerPhotosForFilm } from '@/lib/film-photos';

afterEach(cleanup);

describe('Film trailer photos', () => {
  it('provides three stored trailer photos for every movie', () => {
    for (const movie of movies) {
      const photos = trailerPhotosForFilm(movie.id);
      expect(photos, movie.title).toHaveLength(3);
      expect(new Set(photos.map(photo => photo.url)).size).toBe(3);
      photos.forEach(photo => expect(photo.url).toContain('/__l5e/assets-v1/'));
    }
    expect(trailerPhotosForFilm('missing')).toEqual([]);
  });

  it('opens photos, selects frames, wraps navigation and closes the panel', () => {
    const movie = movies[0];
    if (!movie) throw new Error('Missing test movie');
    render(<FilmMedia movie={movie} />);
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Photos' }));
    expect(screen.getByRole('img', { name: `${movie.title} — Trailer frame 1` })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Next photo' }));
    expect(screen.getByRole('img', { name: `${movie.title} — Trailer frame 2` })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'View trailer frame 1' }));
    fireEvent.click(screen.getByRole('button', { name: 'Previous photo' }));
    expect(screen.getByRole('img', { name: `${movie.title} — Trailer frame 3` })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Trailer' }));
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
    expect(screen.getByTitle(`${movie.title} (${movie.year}) official trailer`)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Photos' }));
    fireEvent.click(screen.getByRole('button', { name: 'Photos' }));
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
  });
});