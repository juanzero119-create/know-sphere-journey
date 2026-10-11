import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Section } from "@/components/Section";
import { Star, Play, Search } from "lucide-react";
import { Shell } from "@/components/Shell";
import { videos, type Video } from "@/lib/data";
import { useProgress } from "@/lib/progress";

export const Route = createFileRoute("/watch")({
  head: () => ({
    meta: [
      { title: "Watch — Learning videos rated by you | Lexi" },
      { name: "description", content: "Watch learning videos and give them your own star ratings." },
      { property: "og:title", content: "Watch — Learning videos rated by you" },
      { property: "og:description", content: "Watch learning videos and rate them." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Watch,
});

function Watch() {
 const [cur,setCur]=useState<Video|undefined>(videos[0]); const [topic,setTopic]=useState('All'); const [search,setSearch]=useState(''); const [sort,setSort]=useState('rating');
 const {ratings,rate}=useProgress(); if(!cur)return null;
 const filtered=videos.filter(v=>(topic==='All'||v.topic===topic)&&`${v.title} ${v.channel}`.toLowerCase().includes(search.toLowerCase())); const list=sort==='title'?sortByAlphabetical(filtered,v=>v.title):sort==='personal'?[...filtered].sort((a,b)=>(ratings[b.title]??0)-(ratings[a.title]??0)):[...filtered].sort((a,b)=>b.rating-a.rating);
 return <Shell title="Watch">
 <Section number="01" title="Now playing" subtitle="Learning, from another angle."><div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]"><div className="overflow-hidden rounded-lg border border-border bg-ink"><iframe className="aspect-video w-full" src={`https://www.youtube-nocookie.com/embed/${cur.id}`} title={cur.title} allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowFullScreen/></div><div className="self-center"><p className="text-xs font-semibold text-muted-foreground">{cur.topic.toUpperCase()} / SAMPLE CATALOG</p><h2 className="mt-3 text-2xl font-semibold">{cur.title}</h2><p className="mt-2 text-sm text-muted-foreground">{cur.channel} · {cur.year}</p><div className="mt-5 flex items-center gap-2 text-sm"><Star className="size-5 text-gold"/><strong>{cur.rating}</strong><span className="text-muted-foreground">/ 10 · Sample score</span></div><div className="mt-5 border-t border-border pt-4"><p className="mb-2 text-xs font-semibold text-muted-foreground">YOUR RATING</p><div className="flex gap-1">{[1,2,3,4,5].map(n=><Button variant="ghost" size="icon" key={n} onClick={()=>rate(cur.title,n)} aria-label={`${n} stars`} title={`Rate ${n} stars`}><Star className={`size-5 ${n<=(ratings[cur.title]??0)?'fill-gold text-gold':'text-muted-foreground'}`}/></Button>)}</div></div></div></div><p className="text-xs leading-relaxed text-muted-foreground">Sample catalog: all entries currently play the same CrashCourse introduction. Other titles, channels, years, and scores are illustrative.</p></Section>
 <Section number="02" title="Browse the collection" subtitle="Anatomy, vocabulary, and film."><div className="flex flex-wrap gap-2">{['All','Anatomy','Words','Film'].map(t=><Button key={t} variant={topic===t?'default':'outline'} onClick={()=>setTopic(t)}>{t}</Button>)}</div><div className="flex flex-col gap-3 sm:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-3 size-4 text-muted-foreground"/><Input aria-label="Search videos" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search titles or channels…" className="h-10 bg-card pl-10"/></div><select aria-label="Sort videos" value={sort} onChange={e=>setSort(e.target.value)} className="h-10 rounded-md border border-input bg-card px-3 text-sm"><option value="rating">Sample score</option><option value="personal">Your rating</option><option value="title">Title A–Z</option></select></div><div className="space-y-3">{list.map((v,idx)=><Button variant="ghost" key={v.title} onClick={()=>{setCur(v);window.scrollTo({top:0,behavior:'smooth'})}} className={`flex h-auto min-h-24 w-full justify-start gap-3 whitespace-normal rounded-lg border p-4 text-left hover:bg-muted ${cur.title===v.title?'border-primary bg-card':'border-border bg-card'}`}><span className="w-5 shrink-0 text-sm font-normal text-muted-foreground">{String(idx+1).padStart(2,'0')}</span><span className="grid size-11 shrink-0 place-items-center rounded-md bg-secondary"><Play/></span><span className="min-w-0 flex-1"><span className="block font-semibold">{v.title}</span><span className="mt-1 block text-xs font-normal text-muted-foreground">{v.channel} · {v.topic} · {v.year}</span>{ratings[v.title] && <span className="mt-1 block text-xs text-gold">Your rating: {ratings[v.title]} / 5</span>}</span><span className="flex shrink-0 items-center gap-1 text-sm"><Star className="text-gold"/>{v.rating}</span></Button>)}</div>{list.length===0 && <p className="py-6 text-center text-muted-foreground">No videos match your search.</p>}</Section>
 <Section number="03" title="Your ratings" subtitle="Your own perspective on the collection."><div className="flex gap-10"><div><p className="text-3xl font-semibold">{Object.keys(ratings).length}</p><p className="mt-1 text-sm text-muted-foreground">Videos rated</p></div><div><p className="text-3xl font-semibold">{Object.values(ratings).length?(Object.values(ratings).reduce((a,b)=>a+b,0)/Object.values(ratings).length).toFixed(1):'—'}</p><p className="mt-1 text-sm text-muted-foreground">Average rating / 5</p></div></div></Section>
 </Shell>;
}
