import { useState } from 'react';
import { ChevronLeft, ChevronRight, Images, Play } from 'lucide-react';
import type { Movie } from '@/lib/movies';
import { FilmPoster } from '@/components/FilmPoster';
import { Button } from '@/components/ui/button';
import { trailerPhotosForFilm } from '@/lib/film-photos';
import trailers from '@/lib/film-trailers.json';

type Panel = 'photos' | 'trailer';

const TRAILERS = trailers as Record<string, string | undefined>;

/**
 * Beveled icon toggles for a film's photos and trailer. Each opens a panel
 * under the film header; tapping the active icon again closes it.
 */
export function FilmMedia({ movie }: { movie: Movie }) {
  const [panel, setPanel] = useState<Panel | null>(null);
  const [selected, setSelected] = useState(0);
  const trailerId = TRAILERS[movie.id];
  const photos = trailerPhotosForFilm(movie.id);
  const photo = photos[selected];
  const toggle = (next: Panel) => setPanel(current => (current === next ? null : next));

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Movie photos and trailer">
        <Button
          variant="ghost"
          type="button"
          className="film-chip"
          aria-expanded={panel === 'photos'}
          onClick={() => toggle('photos')}
        >
          <span className="grid size-6 shrink-0 place-items-center rounded bg-secondary text-secondary-foreground" style={{ border: '1px solid var(--chip-hi)' }} aria-hidden>
            <Images className="size-3.5" />
          </span>
          <span className="film-chip-label">Photos</span>
        </Button>
        <Button
          variant="ghost"
          type="button"
          className="film-chip"
          aria-expanded={panel === 'trailer'}
          onClick={() => toggle('trailer')}
        >
          <span className="grid size-6 shrink-0 place-items-center rounded bg-secondary text-secondary-foreground" style={{ border: '1px solid var(--chip-hi)' }} aria-hidden>
            <Play className="size-3.5" />
          </span>
          <span className="film-chip-label">Trailer</span>
        </Button>
      </div>

      {panel === 'photos' && (
        <div className="mt-4 space-y-4" role="region" aria-label={`${movie.title} photos`}>
          {photo && <>
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold">Trailer photos</h3>
              <div className="flex shrink-0 items-center gap-2">
                <Button variant="outline" size="icon" aria-label="Previous photo" title="Previous photo" onClick={() => setSelected(current => (current + photos.length - 1) % photos.length)}><ChevronLeft /></Button>
                <span className="min-w-10 text-center text-xs text-muted-foreground" aria-live="polite">{selected + 1} / {photos.length}</span>
                <Button variant="outline" size="icon" aria-label="Next photo" title="Next photo" onClick={() => setSelected(current => (current + 1) % photos.length)}><ChevronRight /></Button>
              </div>
            </div>
            <figure className="max-w-3xl">
              <div className="flex aspect-video items-center justify-center overflow-hidden rounded-md bg-ink">
                <img src={photo.url} alt={`${movie.title} — ${photo.label}`} className="h-full w-full object-contain" decoding="async" />
              </div>
              <figcaption className="mt-2 text-xs text-muted-foreground">{photo.label} · {movie.title} ({movie.year})</figcaption>
            </figure>
            <div className="grid max-w-3xl grid-cols-3 gap-2" role="group" aria-label="Select a trailer photo">
              {photos.map((item, index) => <Button key={item.url} variant="ghost" aria-label={`View ${item.label.toLowerCase()}`} aria-pressed={selected === index} onClick={() => setSelected(index)} className={`h-auto overflow-hidden rounded-md border p-0 ${selected === index ? 'border-primary ring-2 ring-ring' : 'border-border'}`}>
                <img src={item.url} alt="" width={480} height={360} loading="lazy" decoding="async" className="aspect-video w-full object-cover" />
              </Button>)}
            </div>
          </>}
          <h3 className="pt-2 text-sm font-semibold">Poster</h3>
          <div className="max-w-xs"><FilmPoster movie={movie} lazy /></div>
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
