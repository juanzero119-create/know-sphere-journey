import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Check, Bot } from 'lucide-react';
import { Shell } from '@/components/Shell';
import { Section } from '@/components/Section';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/ai')({
  head: () => ({ meta: [
    { title: 'AI models — Lexi settings' },
    { name: 'description', content: 'Choose which AI model Lexi should use for future AI features.' },
    { property: 'og:title', content: 'AI models — Lexi settings' },
    { property: 'og:description', content: 'Choose which AI model Lexi should use for future AI features.' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' },
  ] }),
  component: AiPage,
});

const models = [
  { id: 'openai/gpt-6-astra', name: 'GPT-6 Astra', maker: 'OpenAI', note: 'Balanced default — strong reasoning.' },
  { id: 'openai/gpt-6-luna', name: 'GPT-6 Luna', maker: 'OpenAI', note: 'Fast and light for quick answers.' },
  { id: 'anthropic/claude-sonnet-5', name: 'Claude Sonnet 5', maker: 'Anthropic', note: 'Thoughtful, clear explanations.' },
  { id: 'anthropic/claude-haiku-4-5', name: 'Claude Haiku 4.5', maker: 'Anthropic', note: 'Quick and inexpensive.' },
  { id: 'google/gemini-3-flash', name: 'Gemini 3 Flash', maker: 'Google', note: 'Fast multimodal model.' },
];
const KEY = 'lexi-ai-model';

function AiPage() {
  const [selected, setSelected] = useState('openai/gpt-6-astra');
  useEffect(() => { const saved = localStorage.getItem(KEY); if (saved && models.some(m => m.id === saved)) setSelected(saved); }, []);
  function choose(id: string) { setSelected(id); localStorage.setItem(KEY, id); }
  const current = models.find(m => m.id === selected)!;
  return <Shell title="AI models">
    <Section number="01" title="Current model">
      <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-5"><span className="grid size-12 place-items-center rounded-2xl nav-tile"><Bot className="size-5"/></span><div><p className="font-semibold">{current.name}</p><p className="text-sm text-muted-foreground">{current.maker} · Saved on this device</p></div></div>
    </Section>
    <Section number="02" title="Choose a model">
      <p className="mb-4 text-sm text-muted-foreground">Your choice is saved now and will be used when AI features are added.</p>
      <div className="grid gap-3 sm:grid-cols-2">{models.map(m => <Button key={m.id} variant={m.id === selected ? 'secondary' : 'outline'} aria-pressed={m.id === selected} onClick={() => choose(m.id)} className="h-auto justify-between whitespace-normal p-4 text-left"><span><span className="block font-semibold">{m.name}</span><span className="block text-xs text-muted-foreground">{m.maker} · {m.note}</span></span>{m.id === selected && <Check className="shrink-0"/>}</Button>)}</div>
    </Section>
  </Shell>;
}
