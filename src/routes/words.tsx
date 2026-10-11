import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Briefcase, ChevronLeft, ChevronRight, Gauge, Heart, HelpCircle, PenLine, Repeat, RotateCcw, Shuffle, Smile, Timer, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/Section";
import { useState } from "react";
import { Shell } from "@/components/Shell";
import { Quiz, type Mode } from "@/components/Quiz";
import { partsOfSpeech, words, type PartOfSpeech } from "@/lib/data";
import { categories, categoryQuiz, fillInTheGap, gameShuffle, guessTheWord, matchSynonyms, meaningMatch } from "@/lib/word-games";
import { WordLibrary } from "@/components/WordLibrary";

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
 const [i,setI]=useState(0); const [flip,setFlip]=useState(false); const [quiz,setQuiz]=useState(false); const [posFilter,setPosFilter]=useState<PartOfSpeech|null>(null); const [game,setGame]=useState<Mode|null>(null);
 const w=words[i]; if(!w) return null;
 return <Shell title="Vocabulary">
 <Section number="01" title="Daily flashcards" subtitle="Essential vocabulary · Collection 01" action={<span className="text-sm text-muted-foreground">{i+1} / {words.length}</span>}>
 <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]"><div><Button variant="ghost" aria-label="Flip vocabulary card" onClick={()=>setFlip(!flip)} className="flex h-64 w-full flex-col whitespace-normal rounded-lg border border-border bg-card px-6 text-center hover:bg-card"><span className="text-xs font-normal text-muted-foreground">{flip ? 'DEFINITION' : 'WORD OF THE MOMENT'}</span><span className="mt-2 rounded-full border border-border px-3 py-0.5 text-xs font-normal uppercase tracking-wide text-muted-foreground">{w.pos}</span><span className={flip?'mt-4 text-xl font-semibold':'mt-4 text-4xl font-semibold'}>{flip?w.meaning:w.word}</span>{flip && <span className="mt-4 text-sm font-normal italic text-muted-foreground">“{w.example}”</span>}<RotateCcw className="mt-6 text-muted-foreground"/></Button><div className="mt-3 flex items-center justify-between"><Button variant="outline" size="icon" title="Previous word" aria-label="Previous word" onClick={()=>{setFlip(false);setI((i-1+words.length)%words.length)}}><ChevronLeft/></Button><span className="text-xs text-muted-foreground">{String(i+1).padStart(2,'0')} — {String(words.length).padStart(2,'0')}</span><Button variant="outline" size="icon" title="Next word" aria-label="Next word" onClick={()=>{setFlip(false);setI((i+1)%words.length)}}><ChevronRight/></Button></div></div><div className="self-center"><BookOpen className="mb-4 size-7 text-muted-foreground"/><h3 className="text-xl font-semibold">Put your words to work.</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">Meaning is only the beginning. Connect each word to its example, then test your recall.</p><div className="my-5 flex gap-5 text-sm"><span>6 questions</span><span className="text-muted-foreground">Up to 60 XP</span></div><Button onClick={()=>setQuiz(true)}>Start vocabulary quiz <ArrowRight/></Button></div></div>
 </Section>
 <Section number="02" title="Practice" subtitle="Games, challenges and categories to train your words.">
  <div className="rounded-lg border border-border bg-card p-5">
   <div className="flex items-start justify-between gap-4"><div><h3 className="text-xl font-semibold">What’s your level?</h3><p className="mt-1 text-sm text-muted-foreground">See how much you currently know</p></div><Gauge className="size-8 shrink-0 text-muted-foreground"/></div>
   <Button className="mt-4" onClick={()=>setGame({kind:'mixed',name:'Level test',questions:gameShuffle(10)})}>Take test <ArrowRight/></Button>
  </div>
  <p className="section-label mt-8">Challenges</p>
  <div className="mt-3 grid grid-cols-3 gap-3">
   {[{name:'Sprint',icon:Timer,mode:{kind:'words',name:'Sprint',seconds:30} as Mode},{name:'Rush',icon:Zap,mode:{kind:'words',name:'Rush',seconds:15} as Mode},{name:'Perfection',icon:Heart,mode:{kind:'words',name:'Perfection',lives:1} as Mode}].map(c=><Button variant="ghost" key={c.name} onClick={()=>setGame(c.mode)} className="flex h-auto flex-col items-start gap-6 whitespace-normal rounded-lg border border-border bg-card p-4 text-left hover:bg-card"><c.icon className="size-7 text-muted-foreground"/><span className="text-base font-semibold">{c.name}</span></Button>)}
  </div>
  <p className="section-label mt-8">Games</p>
  <div className="mt-3 grid gap-3 sm:grid-cols-2">
   <Button variant="ghost" onClick={()=>setGame({kind:'words',name:'Game shuffle',questions:gameShuffle(8)})} className="flex h-auto flex-col items-start gap-2 whitespace-normal rounded-lg border border-border bg-card p-5 text-left hover:bg-card"><div className="flex w-full items-start justify-between"><div><span className="text-lg font-semibold">Try Game shuffle</span><p className="mt-1 text-sm font-normal text-muted-foreground">A mix of all games</p></div><Shuffle className="size-7 shrink-0 text-muted-foreground"/></div><span className="mt-2 inline-flex rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground">Start</span></Button>
   {[{name:'Guess the word',icon:HelpCircle,build:guessTheWord},{name:'Meaning match',icon:BookOpen,build:meaningMatch},{name:'Fill in the gap',icon:PenLine,build:fillInTheGap},{name:'Match synonyms',icon:Repeat,build:matchSynonyms}].map(g=><Button variant="ghost" key={g.name} onClick={()=>setGame({kind:'words',name:g.name,questions:g.build(6)})} className="flex h-auto flex-col items-start justify-between gap-6 whitespace-normal rounded-lg border border-border bg-card p-5 text-left hover:bg-card"><g.icon className="size-8 text-muted-foreground"/><span className="text-lg font-semibold">{g.name}</span></Button>)}
  </div>
  <p className="section-label mt-8">Categories</p>
  <div className="mt-3 grid gap-3">
   {categories.map(c=>{const Icon=c.name==='Business'?Briefcase:c.name==='Emotions'?Smile:Users;return <Button variant="ghost" key={c.name} onClick={()=>setGame({kind:'words',name:c.name,questions:categoryQuiz(c.name)})} className="flex h-auto items-center justify-between whitespace-normal rounded-lg border border-border bg-card p-5 text-left hover:bg-card"><span className="text-lg font-semibold">{c.name}</span><Icon className="size-7 text-muted-foreground"/></Button>;})}
  </div>
 </Section>
 <Section number="03" title="Parts of speech" subtitle="Noun, pronoun, verb, adjective, adverb — tap one to filter the library."><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{partsOfSpeech.map(p=><Button variant="ghost" key={p.pos} aria-pressed={posFilter===p.pos} onClick={()=>setPosFilter(posFilter===p.pos?null:p.pos)} className={`flex h-auto flex-col items-start gap-2 whitespace-normal rounded-lg border bg-card p-4 text-left hover:bg-card ${posFilter===p.pos?'border-primary ring-2 ring-ring':'border-border'}`}><span className="text-sm font-semibold capitalize">{p.pos}</span><span className="text-xs font-normal leading-relaxed text-muted-foreground">{p.meaning}</span><span className="border-t border-border pt-2 text-xs font-normal italic text-muted-foreground">“{p.example}”</span></Button>)}</div></Section>
 <Section number="04" title="Word library" subtitle="Tap a word’s detail key for its full definition."><WordLibrary posFilter={posFilter}/></Section>
 {quiz && <Quiz mode={{kind:'words',name:'Word quiz'}} onClose={()=>setQuiz(false)}/>}
 {game && <Quiz mode={game} onClose={()=>setGame(null)}/>}
 </Shell>;
}
