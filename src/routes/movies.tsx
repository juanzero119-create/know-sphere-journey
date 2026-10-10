import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { Search, Star, ArrowUpRight, Film } from 'lucide-react';
import { FilmPoster } from '@/components/FilmPoster';
import { Shell } from '@/components/Shell';
import { Section } from '@/components/Section';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { movies, runtimeLabel } from '@/lib/movies';
import { ActorEditor } from '@/components/ActorEditor';
import { FilmSearch } from '@/components/FilmSearch';

export const Route = createFileRoute('/movies')({
 head:()=>({meta:[{title:'Movies — Film collection & cast | Lexi'},{name:'description',content:'Explore a curated movie collection, discover stories and cast, and browse films by genre.'},{property:'og:title',content:'Movies — Film collection & cast | Lexi'},{property:'og:description',content:'Discover cinema, from memorable stories to the people behind them.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),
 component:Movies,
});
function Movies() {
 const [search,setSearch]=useState(''); const [genre,setGenre]=useState('All'); const [sort,setSort]=useState('title');
 const featured=movies[0];
 const list=movies.filter(m=>(genre==='All'||m.genres.includes(genre))&&`${m.title} ${m.director} ${m.cast.flat().join(' ')}`.toLowerCase().includes(search.toLowerCase())).sort((a,b)=>sort==='year'?b.year-a.year:sort==='title'?a.title.localeCompare(b.title):sort==='title-desc'?b.title.localeCompare(a.title):b.score-a.score);
 if(!featured)return null;
 return <Shell title="Movies" theme="movies">
 <div className="grid gap-6 border-t border-border pt-7 sm:grid-cols-[180px_1fr] lg:grid-cols-[220px_1fr]">
 <Link to="/film/$id" params={{id:featured.id}} className="block"><img src={featured.image} alt="Film-inspired artwork of an astronaut on an ocean planet" width={512} height={768} className="aspect-[2/3] w-full max-w-56 rounded-lg object-cover"/></Link>
 <div className="self-center"><p className="flex items-center gap-2 text-xs font-semibold text-muted-foreground"><Film className="size-4"/> SPOTLIGHT / SPACE & TIME</p><h2 className="mt-4 text-3xl font-semibold">Interstellar</h2><p className="mt-2 text-sm text-muted-foreground">2014 · PG-13 · {runtimeLabel(featured.runtime)}</p><div className="mt-4 flex flex-wrap gap-2">{featured.genres.map(g=><span key={g} className="text-xs font-medium border-b border-border pb-1">{g}</span>)}</div><p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">{featured.synopsis}</p><p className="mt-4 text-sm"><span className="text-muted-foreground">Director</span> · {featured.director}</p><Button asChild className="mt-5"><Link to="/film/$id" params={{id:featured.id}}>Explore film <ArrowUpRight/></Link></Button></div></div>
 <FilmSearch/>
 <ActorEditor/>
 <Section number="03" title="Explore the collection" subtitle="Great stories. Remarkable performances.">
 <div className="flex flex-col gap-3 sm:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-3 size-4 text-muted-foreground"/><Input aria-label="Search movies" placeholder="Search films, directors, or cast…" className="h-10 bg-card pl-10" value={search} onChange={e=>setSearch(e.target.value)}/></div><select aria-label="Sort movies" className="h-10 rounded-md border border-input bg-card px-3 text-sm" value={sort} onChange={e=>setSort(e.target.value)}><option value="title">Alphabetical A–Z</option><option value="title-desc">Alphabetical Z–A</option><option value="year">Newest first</option><option value="score">Sample score</option></select></div>
 <div className="flex flex-wrap gap-2" role="group" aria-label="Movie genres">{['All','Drama','Sci-Fi','Action','Animation','Comedy','Thriller','Adventure','Fantasy','Crime'].map(g=><Button key={g} size="sm" variant={genre===g?'default':'secondary'} aria-pressed={genre===g} onClick={()=>setGenre(g)}>{g}</Button>)}</div>
 <p className="text-xs text-muted-foreground">{list.length} films · Sample scores, not live IMDb ratings. Artwork is film-inspired, not official posters.</p>
 <div className="grid grid-cols-2 gap-x-4 gap-y-7 lg:grid-cols-3">{list.map(m=><article key={m.id} className="cv-auto min-w-0" style={{containIntrinsicSize:"auto 420px"}}><Link to="/film/$id" params={{id:m.id}} className="group block"><FilmPoster movie={m} lazy className="transition-opacity group-hover:opacity-90"/><div className="mt-3 flex items-center gap-1.5 text-sm"><Star className="size-4 fill-gold text-gold"/><strong>{m.score.toFixed(1)}</strong><span className="text-xs text-muted-foreground">/ 10</span></div><h3 className="mt-2 text-base font-semibold leading-snug">{m.title}</h3></Link><p className="mt-1 text-xs text-muted-foreground">{m.year} · {runtimeLabel(m.runtime)} · {m.certificate}</p><p className="mt-1 text-xs text-muted-foreground">{m.genres.slice(0,2).join(' / ')}</p><Button asChild variant="link" className="mt-1 h-8 px-0"><Link to="/film/$id" params={{id:m.id}}>Details <ArrowUpRight/></Link></Button></article>)}</div>
 {list.length===0&&<div className="py-8 text-center"><p className="text-muted-foreground">No films match your search.</p><Button variant="link" onClick={()=>{setSearch('');setGenre('All')}}>Clear filters</Button></div>}
 </Section>
 <Section number="04" title="Behind the camera" subtitle="The directors behind the stories."><div className="divide-y divide-border">{Array.from(new Set(movies.map(m=>m.director))).map(d=><div key={d} className="flex flex-col justify-between gap-2 py-4 sm:flex-row"><h3 className="text-sm font-semibold">{d}</h3><div className="flex flex-wrap gap-3">{movies.filter(m=>m.director===d).map(m=><Link key={m.id} to="/film/$id" params={{id:m.id}} className="text-sm text-muted-foreground underline underline-offset-4">{m.title}</Link>)}</div></div>)}</div></Section>
 </Shell>;
}
