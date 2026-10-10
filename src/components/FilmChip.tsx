import { Link } from '@tanstack/react-router';
import type { Movie } from '@/lib/movies';

/**
 * A beveled tile for one film an actor appears in: raised gray key with a
 * light top edge, a dark bottom edge and a hard lip underneath, plus the
 * film's poster as a tiny thumbnail. The film you are already reading gets
 * the pressed/highlighted variant.
 */
export function FilmChip({ movie, current = false, note }: { movie: Movie; current?: boolean; note?: string }) {
  return (
    <Link
      to="/film/$id"
      params={{ id: movie.id }}
      aria-label={`${movie.title} (${movie.year})`}
      className={current ? 'film-chip film-chip-active' : 'film-chip'}
    >
      {movie.image
        ? <img src={movie.image} alt="" loading="lazy" className="film-chip-art" />
        : <span aria-hidden className="film-chip-art bg-secondary" />}
      <span className="film-chip-label">
        {movie.title}
        {note ? <span className="block text-[0.62rem] opacity-70">{note}</span> : null}
      </span>
    </Link>
  );
}
