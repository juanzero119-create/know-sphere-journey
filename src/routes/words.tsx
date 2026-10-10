import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, BookOpen, ChevronLeft, ChevronRight, RotateCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Section } from "@/components/Section";
import { useState } from "react";
import { Shell } from "@/components/Shell";
import { Quiz } from "@/components/Quiz";
import { words } from "@/lib/data";

export const Route = createFileRoute("/words")({
  head: () => ({
    meta: [
      { title: "Words — Lexi vocabulary builder" },
      { name: "description", content: "Flip through vocabulary cards and quiz yourself on new words." },
      { property: "og:title", content: "Words — Lexi vocabulary builder" },
      { property: "og:description", content: "Flip through vocabulary cards and quiz yourself." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Words,
});

function Words() {
 const [i,setI]=useState(0); const [flip,setFlip]=useState(false); const [quiz,setQuiz]=useState(false); const [search,setSearch]=useState('');
 const w=words[i]; if(!w) return null;
 const list=words.filter(w=>`${w.word} ${w.meaning}`.toLowerCase().includes(search.toLowerCase()));
 return <Shell title="Vocabulary">
 <Section number="01" title="Daily flashcards" subtitle="Essential vocabulary · Collection 01" action={<span className="text-sm text-muted-foreground">{i+1} / {words.length}</span>}>
 <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]"><div><Button variant="ghost" aria-label="Flip vocabulary card" onClick={()=>setFlip(!flip)} className="flex h-64 w-full flex-col whitespace-normal rounded-lg border border-border bg-card px-6 text-center hover:bg-card"><span className="text-xs font-normal text-muted-foreground">{flip ? 'DEFINITION' : 'WORD OF THE MOMENT'}</span><span className={flip?'mt-5 text-xl font-semibold':'mt-5 text-4xl font-semibold'}>{flip?w.meaning:w.word}</span>{flip && <span className="mt-4 text-sm font-normal italic text-muted-foreground">“{w.example}”</span>}<RotateCcw className="mt-6 text-muted-foreground"/></Button><div className="mt-3 flex items-center justify-between"><Button variant="outline" size="icon" title="Previous word" aria-label="Previous word" onClick={()=>{setFlip(false);setI((i-1+words.length)%words.length)}}><ChevronLeft/></Button><span className="text-xs text-muted-foreground">{String(i+1).padStart(2,'0')} — {String(words.length).padStart(2,'0')}</span><Button variant="outline" size="icon" title="Next word" aria-label="Next word" onClick={()=>{setFlip(false);setI((i+1)%words.length)}}><ChevronRight/></Button></div></div><div className="self-center"><BookOpen className="mb-4 size-7 text-muted-foreground"/><h3 className="text-xl font-semibold">Put your words to work.</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">Meaning is only the beginning. Connect each word to its example, then test your recall.</p><div className="my-5 flex gap-5 text-sm"><span>6 questions</span><span className="text-muted-foreground">Up to 60 XP</span></div><Button onClick={()=>setQuiz(true)}>Start vocabulary quiz <ArrowRight/></Button></div></div>
 </Section>
 <Section number="02" title="Word library" subtitle="Definitions and examples, all in one place."><div className="relative"><Search className="absolute left-3 top-3 size-4 text-muted-foreground"/><Input value={search} onChange={e=>setSearch(e.target.value)} aria-label="Search words" placeholder="Search words or definitions…" className="h-10 bg-card pl-10"/></div><div className="grid gap-3 sm:grid-cols-2">{list.map((w,idx)=><article className="rounded-lg border border-border bg-card p-5" key={w.word}><div className="flex items-center justify-between"><h3 className="text-lg font-semibold">{w.word}</h3><span className="text-xs text-muted-foreground">{String(idx+1).padStart(2,'0')}</span></div><p className="mt-2 text-sm">{w.meaning}</p><p className="mt-4 border-t border-border pt-3 text-sm italic text-muted-foreground">“{w.example}”</p></article>)}</div>{list.length===0 && <p className="py-6 text-center text-muted-foreground">No words match your search.</p>}</Section>
 {quiz && <Quiz mode={{kind:'words',name:'Word quiz'}} onClose={()=>setQuiz(false)}/>}
 </Shell>;
}
