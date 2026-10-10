import { Film } from 'lucide-react';

export function FilmPoster({ movie, className = '', lazy = false }: { movie: { title: string; year: number; image: string; director: string }; className?: string; lazy?: boolean }) {
  if (movie.image) return <img src={movie.image} alt={`${movie.title} poster`} width={512} height={768} loading={lazy ? 'lazy' : undefined} decoding="async" className={`aspect-[2/3] w-full rounded-lg object-cover ${className}`} />;
  return (
    <div role="img" aria-label={`${movie.title} title card`} className={`flex aspect-[2/3] w-full flex-col justify-between rounded-lg border border-border bg-secondary p-4 text-secondary-foreground ${className}`}>
      <Film className="size-5 text-muted-foreground" aria-hidden />
      <div><p className="text-lg font-semibold leading-tight [overflow-wrap:anywhere]">{movie.title}</p><p className="mt-2 text-xs text-muted-foreground">{movie.year} · {movie.director}</p></div>
    </div>
  );
}
