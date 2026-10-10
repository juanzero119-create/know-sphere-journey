import { createFileRoute, Link } from '@tanstack/react-router';
import { BookOpen, Bone, ArrowRight } from 'lucide-react';
import { Shell } from '@/components/Shell';
import { Section } from '@/components/Section';
import { Button } from '@/components/ui/button';

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
  return <Shell title="Studies"><Section number="01" title="Learning disciplines" subtitle="Vocabulary & human anatomy"><div className="grid gap-4 sm:grid-cols-2">
    <article className="rounded-lg border border-border bg-card p-6"><BookOpen className="mb-5 size-8 text-muted-foreground"/><h2 className="text-xl font-semibold">Vocabulary</h2><p className="mt-2 text-sm text-muted-foreground">Words, definitions and examples</p><p className="mt-4 text-sm">8 words · Flashcards · Recall quizzes</p><Button asChild className="mt-6"><Link to="/words">Open vocabulary <ArrowRight/></Link></Button></article>
    <article className="rounded-lg border border-border bg-card p-6"><Bone className="mb-5 size-8 text-muted-foreground"/><h2 className="text-xl font-semibold">Human anatomy</h2><p className="mt-2 text-sm text-muted-foreground">Body systems and structure atlas</p><p className="mt-4 text-sm">7 systems · 8 structures · Anatomy quizzes</p><Button asChild className="mt-6"><Link to="/anatomy">Open anatomy <ArrowRight/></Link></Button></article>
  </div></Section></Shell>;
}