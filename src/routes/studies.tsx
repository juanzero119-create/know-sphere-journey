import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { BookOpen, Bone, ArrowRight, Plus } from 'lucide-react';
import { Shell } from '@/components/Shell';
import { Section } from '@/components/Section';
import { Button } from '@/components/ui/button';
import { StudyEditor, useCustomStudies, studyDestinations } from '@/components/StudyEditor';
import { iconChoices } from '@/components/NavigationEditor';

export const Route = createFileRoute('/studies')({
  head: () => ({ meta: [
    { title: 'Studies — Lexi vocabulary & anatomy' },
    { name: 'description', content: 'Explore vocabulary and human anatomy with Lexi flashcards, structure guides and quizzes.' },
    { property: 'og:title', content: 'Studies — Lexi vocabulary & anatomy' },
    { property: 'og:description', content: 'Explore vocabulary and human anatomy with flashcards, structure guides and quizzes.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: Studies,
});

function Studies() {
  const [editorOpen, setEditorOpen] = useState(false);
  const customStudies = useCustomStudies();
  return <Shell title="Studies"><Section number="01" title="Learning disciplines" subtitle="Vocabulary & human anatomy">
    <div className="grid gap-4 sm:grid-cols-2">
      <article className="rounded-lg border border-border bg-card p-6"><BookOpen className="mb-5 size-8 text-muted-foreground"/><h2 className="text-xl font-semibold">Vocabulary</h2><p className="mt-2 text-sm text-muted-foreground">Words, definitions and examples</p><p className="mt-4 text-sm">8 words · Flashcards · Recall quizzes</p><Button asChild className="mt-6"><Link to="/words">Open vocabulary <ArrowRight/></Link></Button></article>
      <article className="rounded-lg border border-border bg-card p-6"><Bone className="mb-5 size-8 text-muted-foreground"/><h2 className="text-xl font-semibold">Human anatomy</h2><p className="mt-2 text-sm text-muted-foreground">Body systems and structure atlas</p><p className="mt-4 text-sm">7 systems · 8 structures · Anatomy quizzes</p><Button asChild className="mt-6"><Link to="/anatomy">Open anatomy <ArrowRight/></Link></Button></article>
      {customStudies.map(study => {
        const StudyIcon = iconChoices.find(choice => choice.name === study.iconName)?.icon ?? BookOpen;
        const destination = studyDestinations.find(item => item.to === study.to);
        return <article key={study.id} className="rounded-lg border border-border bg-card p-6"><StudyIcon className="mb-5 size-8 text-muted-foreground"/><h2 className="text-xl font-semibold">{study.name}</h2><p className="mt-2 text-sm text-muted-foreground">Custom study</p><p className="mt-4 text-sm">Opens {destination?.label ?? 'Vocabulary'}</p><Button asChild className="mt-6"><Link to={study.to}>Open {study.name} <ArrowRight/></Link></Button></article>;
      })}
    </div>
    <div className="mt-4 flex justify-center"><Button type="button" variant="ghost" aria-label="Add study" onClick={() => setEditorOpen(true)} className="h-auto min-w-[68px] flex-col gap-1.5 rounded-none p-0 py-1 text-[0.65rem] font-medium text-muted-foreground hover:bg-transparent"><span className="nav-tile grid size-12 place-items-center rounded-2xl nav-tile-press" aria-hidden="true"><Plus className="size-5"/></span>Add study</Button></div>
    <StudyEditor open={editorOpen} onOpenChange={setEditorOpen}/>
  </Section></Shell>;
}
