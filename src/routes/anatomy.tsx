import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Section } from "@/components/Section";
import { anatomyDetails } from "@/lib/anatomy-details";
import skeleton from "@/assets/anatomy-skeleton.jpg";
import { useState } from "react";
import { Shell } from "@/components/Shell";
import { Quiz } from "@/components/Quiz";
import { anatomy } from "@/lib/data";

export const Route = createFileRoute("/anatomy")({
  head: () => ({
    meta: [
      { title: "Anatomy — Learn the body fast | Lexi" },
      { name: "description", content: "Explore body systems with quick facts and anatomy quizzes." },
      { property: "og:title", content: "Anatomy — Learn the body fast" },
      { property: "og:description", content: "Explore body systems with quick facts and quizzes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Anatomy,
});

function Anatomy() {
 const systems=[...new Set(anatomy.map(a=>a.system))];
 const [sys,setSys]=useState<string|null>(null); const [quiz,setQuiz]=useState(false); const [search,setSearch]=useState('');
 const list=anatomy.filter(a=>(!sys||a.system===sys)&&`${a.part} ${a.fact} ${a.system}`.toLowerCase().includes(search.toLowerCase()));
 return <Shell title="Anatomy">
 <section className="grid gap-6 border-y border-border py-7 sm:grid-cols-[200px_1fr] lg:grid-cols-[260px_1fr]"><img src={skeleton} width={768} height={1024} alt="Front view of a human skeleton anatomical model" className="mx-auto h-72 w-full rounded-lg object-cover bg-secondary sm:h-80"/><div className="self-center"><p className="text-xs font-semibold text-muted-foreground">HUMAN ANATOMY / FOUNDATIONS</p><h2 className="mt-3 text-3xl font-semibold">Understand the body.<br/>One structure at a time.</h2><p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">From the bones that support you to the cells that filter your blood, explore the location, function, and connections of essential structures.</p><div className="my-5 flex gap-6 text-sm"><span><strong>7</strong> systems</span><span><strong>8</strong> structures</span></div><Button onClick={()=>setQuiz(true)}>Start anatomy quiz <ArrowRight/></Button></div></section>
 <Section number="01" title="Body systems" subtitle="Explore structures by their role in the body."><div className="flex flex-wrap gap-2"><Button variant={!sys?'default':'outline'} onClick={()=>setSys(null)}>All systems <span className="opacity-60">8</span></Button>{systems.map(s=><Button key={s} variant={sys===s?'default':'outline'} onClick={()=>setSys(s)}>{s} <span className="opacity-60">{anatomy.filter(a=>a.system===s).length}</span></Button>)}</div></Section>
 <Section number="02" title={sys?sys+' structures':'Structure atlas'} subtitle="Location, function, and key connections."><div className="relative"><Search className="absolute left-3 top-3 size-4 text-muted-foreground"/><Input aria-label="Search anatomy" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search structures…" className="h-10 bg-card pl-10"/></div><div className="grid items-start gap-4 sm:grid-cols-2">{list.map(a=>{const detail=anatomyDetails[a.part];return <article key={a.part} className="rounded-lg border border-border bg-card p-5"><p className="mb-2 text-xs text-muted-foreground">{a.system.toUpperCase()} SYSTEM</p><h3 className="text-xl font-semibold">{a.part}</h3><p className="mt-3 text-sm leading-relaxed">{a.fact}</p>{detail && <dl className="mt-4 space-y-4 border-t border-border pt-4">{[['Location',detail.location],['Function',detail.role],['Connections',detail.connection]].map(([label,text])=><div key={label}><dt className="text-xs font-semibold text-muted-foreground">{label}</dt><dd className="mt-1 text-sm leading-relaxed">{text}</dd></div>)}</dl>}</article>})}</div>{list.length===0 && <p className="py-5 text-center text-muted-foreground">No structures match your search.</p>}<p className="text-xs text-muted-foreground">Educational reference · Not a substitute for medical advice. Illustration is a generated anatomical model.</p></Section>
 {quiz && <Quiz mode={{kind:'anatomy',name:'Anatomy quiz'}} onClose={()=>setQuiz(false)}/>}
 </Shell>;
}
