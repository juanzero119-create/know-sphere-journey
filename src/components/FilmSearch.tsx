import { Link } from '@tanstack/react-router';
import { useDeferredValue, useMemo, useState } from 'react';
import { Search, X, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Section } from '@/components/Section';
import { searchActors, searchMovies } from '@/lib/film-search';
import portraits from '@/lib/actor-portraits.json';

type Tab = 'all' | 'actors' | 'movies';

export function FilmSearch() {
  const [q, setQ] = useState('');
  const [tab, setTab] = useState<Tab>('all');
  const dq = useDeferredValue(q);
  const actors = useMemo(() => searchActors(dq), [dq]);
  const films = useMemo(() => searchMovies(dq), [dq]);
  const has = dq.trim().length > 0;
  const pics = portraits as Record<string, string>;

  return (
    <Section number="01" title="Search actors & movies" subtitle="Find anyone or anything — typos are okay.">
      <div className="relative">
        <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
        <Input aria-label="Search actors and movies" placeholder="Try “pacino”, “godfathr”, or “Neo”…" className="h-10 bg-card pl-10 pr-10" value={q} onChange={e => setQ(e.target.value)} />
        {q && <button aria-label="Clear search" className="absolute right-3 top-3 text-muted-foreground" onClick={() => setQ('')}><X className="size-4" /></button>}
      </div>
      <div className="flex gap-2" role="group" aria-label="Search type">
        {(['all', 'actors', 'movies'] as Tab[]).map(t => (
          <Button key={t} size="sm" variant={tab === t ? 'default' : 'secondary'} aria-pressed={tab === t} onClick={() => setTab(t)} className="capitalize">{t}</Button>
        ))}
      </div>
      {has && (
        <div className="space-y-6">
          {tab !== 'movies' && (
            <div>
              <h3 className="mb-2 text-xs font-semibold text-muted-foreground">ACTORS · {actors.length}</h3>
              {actors.length === 0 ? <p className="text-sm text-muted-foreground">No actors found.</p> : (
                <ul className="divide-y divide-border rounded-lg border border-border bg-card">
                  {actors.map(a => (
                    <li key={a.name} className="flex gap-3 p-3">
                      {pics[a.name] ? <img src={pics[a.name]} alt={a.name} loading="lazy" className="size-12 shrink-0 rounded-full object-cover" /> : <div className="grid size-12 shrink-0 place-items-center rounded-full bg-secondary text-sm font-semibold">{a.name.split(' ').map(w => w[0]).join('').slice(0, 2)}</div>}
                      <div className="min-w-0">
                        <p className="font-semibold">{a.name}</p>
                        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
                          {a.films.map(f => <Link key={f.movie.id} to="/film/$id" params={{ id: f.movie.id }} className="text-xs text-muted-foreground underline underline-offset-4">{f.movie.title} ({f.movie.year}) · {f.role}</Link>)}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          {tab !== 'actors' && (
            <div>
              <h3 className="mb-2 text-xs font-semibold text-muted-foreground">MOVIES · {films.length}</h3>
              {films.length === 0 ? <p className="text-sm text-muted-foreground">No movies found.</p> : (
                <ul className="divide-y divide-border rounded-lg border border-border bg-card">
                  {films.map(({ movie: m, reason }) => (
                    <li key={m.id}>
                      <Link to="/film/$id" params={{ id: m.id }} className="flex gap-3 p-3">
                        {m.image ? <img src={m.image} alt={`${m.title} poster`} loading="lazy" className="h-16 w-11 shrink-0 rounded object-cover" /> : <div className="h-16 w-11 shrink-0 rounded bg-secondary" />}
                        <div className="min-w-0">
                          <p className="font-semibold leading-snug">{m.title} <span className="font-normal text-muted-foreground">({m.year})</span></p>
                          <p className="mt-0.5 flex items-center gap-1 text-xs"><Star className="size-3 fill-gold text-gold" />{m.score.toFixed(1)} · {m.director}</p>
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">Matched {reason}</p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </Section>
  );
}
