import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { useState } from 'react';
import { ArrowLeft, Star } from 'lucide-react';
import { FilmChip } from '@/components/FilmChip';
import { FilmPoster } from '@/components/FilmPoster';
import { ActorPortrait } from '@/components/ActorPortrait';
import { FilmMedia } from '@/components/FilmMedia';
import { Shell } from '@/components/Shell';
import { Section } from '@/components/Section';
import { Button } from '@/components/ui/button';
import { movies, runtimeLabel, type Movie } from '@/lib/movies';
import { filmsForActor } from '@/lib/film-search';

export const Route = createFileRoute('/film/$id')({
 loader:({params})=>{const movie=movies.find(m=>m.id===params.id);if(!movie)throw notFound();return movie;},
 head:({loaderData})=>{const title=loaderData?`${loaderData.title} (${loaderData.year}) — Cast & story | Lexi`:'Film not found | Lexi'; const description=loaderData?.synopsis??'This film is not in the Lexi collection.';return {meta:[{title},{name:'description',content:description},{property:'og:title',content:title},{property:'og:description',content:description},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]};},
 notFoundComponent:()=> <Shell title="Movies" theme="movies"><p>That film isn’t in the collection.</p><Button asChild><Link to="/movies">Back to movies</Link></Button></Shell>,
 component:FilmPage,
});
function FilmPage(){const movie=Route.useLoaderData();return <FilmContent key={movie.id} movie={movie}/>;}
function FilmContent({movie}:{movie:Movie}) {
 const [rating,setRating]=useState(0);
 return <Shell title="Movies" theme="movies"><Button asChild variant="link" className="px-0"><Link to="/movies"><ArrowLeft/>All movies</Link></Button>
 <div className="grid gap-6 sm:grid-cols-[220px_1fr]"><FilmPoster movie={movie} className="max-w-56"/><div className="self-center"><p className="text-xs text-muted-foreground">{movie.year} · {movie.certificate} · {runtimeLabel(movie.runtime)}</p><h2 className="mt-3 text-3xl font-semibold">{movie.title}</h2><p className="mt-3 text-sm text-muted-foreground">{movie.genres.join(' / ')}</p><p className="mt-5 leading-relaxed">{movie.synopsis}</p><div className="mt-5 flex items-center gap-2"><Star className="size-5 fill-gold text-gold"/><strong>{movie.score.toFixed(1)} / 10</strong><span className="text-xs text-muted-foreground">Sample score</span></div><p className="mt-4 text-xs text-muted-foreground">Film-inspired artwork · Not an official poster</p></div></div>
 <div className="mt-5"><FilmMedia movie={movie}/></div>
 <Section number="01" title="Cast & crew" subtitle="The people who bring the story to life."><p className="text-sm"><span className="text-muted-foreground">Directed by</span> · <strong>{movie.director}</strong></p><div className="grid gap-4 sm:grid-cols-3">{movie.cast.map(([name,role])=><div key={name} className="min-w-0 border-t border-border pt-4"><div className="flex items-center gap-3"><ActorPortrait name={name}/><div className="min-w-0"><h3 className="break-words font-semibold">{name}</h3><p className="mt-1 break-words text-sm text-muted-foreground">{role}</p></div></div><div className="mt-3 flex flex-wrap gap-2">{filmsForActor(name).map(m=><FilmChip key={m.id} movie={m} current={m.id===movie.id}/>)}</div></div>)}</div></Section>
 <Section number="02" title="Film details"><dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">{[['Release year',movie.year],['Runtime',runtimeLabel(movie.runtime)],['Original language',movie.language],['US certificate',movie.certificate]].map(([label,value])=><div key={label}><dt className="text-xs text-muted-foreground">{label}</dt><dd className="mt-2 text-sm font-semibold">{value}</dd></div>)}</dl><div className="pt-2"><h3 className="text-sm font-semibold">Themes</h3><p className="mt-2 text-sm text-muted-foreground">{movie.themes.join(' · ')}</p></div></Section>
 <Section number="03" title="Your rating" subtitle="This visit"><div className="flex flex-wrap gap-1" role="group" aria-label="Rate this movie">{Array.from({length:10},(_,i)=>i+1).map(n=><Button key={n} size="icon" variant="ghost" aria-label={`Rate ${n} out of 10`} aria-pressed={rating===n} title={`${n} / 10`} onClick={()=>setRating(n)}><Star className={n<=rating?'fill-gold text-gold':'text-muted-foreground'}/></Button>)}</div><p aria-live="polite" className="text-sm text-muted-foreground">{rating?`Your rating: ${rating} / 10`:'Not rated yet'}</p>{rating>0&&<Button variant="link" className="px-0" onClick={()=>setRating(0)}>Clear rating</Button>}</Section>
 <Section number="04" title="More to explore"><div className="grid grid-cols-2 gap-4 sm:grid-cols-3">{movies.filter(m=>m.id!==movie.id).slice(0,3).map(m=><Link key={m.id} to="/film/$id" params={{id:m.id}}><FilmPoster movie={m} lazy/><h3 className="mt-2 text-sm font-semibold">{m.title}</h3><p className="mt-1 text-xs text-muted-foreground">{m.year}</p></Link>)}</div></Section>
 </Shell>;
}
