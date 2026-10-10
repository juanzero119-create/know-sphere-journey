import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Bone, Heart, Zap, Timer, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/Section";
import { useProgress } from "@/lib/progress";
import { useState } from "react";
import { Shell } from "@/components/Shell";
import { Quiz, type Mode } from "@/components/Quiz";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lexi — Practice words, anatomy & more" },
      { name: "description", content: "Bite-sized daily practice for vocabulary and anatomy, plus videos to watch and rate." },
      { property: "og:title", content: "Lexi — Practice words, anatomy & more" },
      { property: "og:description", content: "Bite-sized daily practice for vocabulary and anatomy." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const challenges: (Mode & { icon: typeof Heart; detail: string })[] = [
 { kind: "mixed", name: "Perfection", lives: 1, icon: Heart, detail: "One life. Every answer counts." },
 { kind: "mixed", name: "Rush", lives: 3, icon: Zap, detail: "Six questions. Three chances." },
 { kind: "mixed", name: "Sprint", seconds: 45, icon: Timer, detail: "45 seconds against the clock." },
];
function Index() {
 const [mode, setMode] = useState<Mode | null>(null);
 const { xp, streak } = useProgress();
 return <Shell title="Practice">
 <section className="grid gap-6 border-y border-border py-7 lg:grid-cols-[1fr_260px]">
 <div><span className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground"><span className="size-2 rounded-full bg-success"/> DAILY PRACTICE</span><h2 className="mt-4 text-3xl font-semibold">Small lessons.<br/>Lasting knowledge.</h2><p className="mt-3 max-w-md text-muted-foreground">Today’s lesson brings vocabulary and human anatomy together in six questions.</p><div className="my-5 flex flex-wrap gap-5 text-sm text-muted-foreground"><span className="flex items-center gap-2"><BookOpen className="size-4"/>6 questions</span><span className="flex items-center gap-2"><Sparkles className="size-4"/>Up to 60 XP</span></div><Button size="lg" onClick={() => setMode({kind:'mixed', name:'Daily lesson'})}>Start daily lesson <ArrowRight/></Button></div>
 <div className="flex flex-col justify-center border-t border-border pt-5 lg:border-t-0 lg:border-l lg:pl-6 lg:pt-0"><p className="text-sm font-semibold">Your learning snapshot</p><div className="mt-5 grid grid-cols-2 gap-5"><div><p className="text-3xl font-semibold">{xp}</p><p className="mt-1 text-xs text-muted-foreground">Total XP</p></div><div><p className="text-3xl font-semibold">{streak}</p><p className="mt-1 text-xs text-muted-foreground">Day streak</p></div></div><p className="mt-5 border-t border-border pt-4 text-sm text-muted-foreground">{xp === 0 ? 'Your next lesson is a fresh start.' : 'Keep building on what you know.'}</p></div>
 </section>
 <Section number="01" title="Learning paths" subtitle="Choose what you want to work on today."><div className="grid gap-4 sm:grid-cols-2">{[{title:'Vocabulary',to:'/words' as const,icon:BookOpen,detail:'8 words · Definitions & examples',kind:'words' as const},{title:'Human anatomy',to:'/anatomy' as const,icon:Bone,detail:'7 systems · 8 structures',kind:'anatomy' as const}].map(p=><article key={p.title} className="rounded-lg border border-border bg-card p-5"><p.icon className="mb-5 size-7 text-muted-foreground"/><h3 className="text-lg font-semibold">{p.title}</h3><p className="mt-1 text-sm text-muted-foreground">{p.detail}</p><div className="mt-5 flex items-center justify-between"><Button variant="outline" onClick={()=>setMode({kind:p.kind,name:p.title+' practice'})}>Practice <ArrowRight/></Button><Link to={p.to} className="text-sm font-semibold underline underline-offset-4">Explore</Link></div></article>)}</div></Section>
 <Section number="02" title="Challenge yourself" subtitle="A different pace. The same opportunity to grow."><div className="grid gap-3 sm:grid-cols-3">{challenges.map(c=><article key={c.name} className="rounded-lg border border-border bg-card p-5"><c.icon className="mb-4 size-6 text-muted-foreground"/><h3 className="font-semibold">{c.name}</h3><p className="mt-2 min-h-10 text-sm text-muted-foreground">{c.detail}</p><Button variant="secondary" className="mt-4 w-full" onClick={()=>setMode(c)}>Begin <ArrowRight/></Button></article>)}</div></Section>
 <Section number="03" title="Check your foundations" subtitle="Vocabulary assessment"><div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center"><div><h3 className="font-semibold">Where are you starting from?</h3><p className="mt-2 max-w-lg text-sm text-muted-foreground">Test your understanding of eight essential words. Six multiple-choice questions, with an example after every answer.</p></div><Button variant="outline" onClick={()=>setMode({kind:'words',name:'Level test'})}>Take level test <ArrowRight/></Button></div></Section>
 {mode && <Quiz mode={mode} onClose={()=>setMode(null)}/>}
 </Shell>;
}
