import { useState } from 'react';
import { Images, Play } from 'lucide-react';
import type { Movie } from '@/lib/movies';
import { FilmPoster } from '@/components/FilmPoster';
import trailers from '@/lib/film-trailers.json';

type Panel = 'photos' | 'trailer';

const TRAILERS = trailers as Record<string, string | undefined>;

/**
 * Beveled icon toggles for a film's photos and trailer. Each opens a panel
 * under the film header; tapping the active icon again closes it.
 */
export function FilmMedia({ movie }: { movie: Movie }) {
  const [panel, setPanel] = useState<Panel | null>(null);
  const trailerId = TRAILERS[movie.id];
  const toggle = (next: Panel) => setPanel(current => (current === next ? null : next));

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Movie photos and trailer">
        <button
          type="button"
          className="film-chip"
          aria-expanded={panel === 'photos'}
          onClick={() => toggle('photos')}
        >
          <span className="grid size-6 shrink-0 place-items-center rounded border border-chip-hi bg-secondary text-secondary-foreground" aria-hidden>
            <Images className="size-3.5" />
          </span>
          <span className="film-chip-label">Photos</span>
        </button>
        <button
          type="button"
          className="film-chip"
          aria-expanded={panel === 'trailer'}
          onClick={() => toggle('trailer')}
        >
          <span className="grid size-6 shrink-0 place-items-center rounded border border-chip-hi bg-secondary text-secondary-foreground" aria-hidden>
            <Play className="size-3.5" />
          </span>
          <span className="film-chip-label">Trailer</span>
        </button>
      </div>

      {panel === 'photos' && (
        <div className="mt-4 rounded-lg border border-border bg-card p-4">
          <div className="max-w-xs">
            <FilmPoster movie={movie} lazy />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Film-inspired artwork · Not an official poster or still
          </p>
        </div>
      )}

      {panel === 'trailer' && trailerId && (
        <div className="mt-4 rounded-lg border border-border bg-card p-4">
          <div className="overflow-hidden rounded-md bg-ink">
            <iframe
              className="aspect-video w-full"
              src={`https://www.youtube-nocookie.com/embed/${trailerId}`}
              title={`${movie.title} (${movie.year}) official trailer`}
              allow="accelerometer; encrypted-media; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Official trailer for {movie.title} ({movie.year}) · Plays from YouTube
          </p>
        </div>
      )}
    </div>
  );
}
