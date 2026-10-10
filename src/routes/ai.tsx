import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Check, Bot, Plus, Trash2 } from 'lucide-react';
import { Shell } from '@/components/Shell';
import { Section } from '@/components/Section';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

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

const defaultModels = [
  { id: 'openai/gpt-6-astra', name: 'GPT-6 Astra', maker: 'OpenAI', note: 'Balanced default — strong reasoning.' },
  { id: 'openai/gpt-6-luna', name: 'GPT-6 Luna', maker: 'OpenAI', note: 'Fast and light for quick answers.' },
  { id: 'anthropic/claude-sonnet-5', name: 'Claude Sonnet 5', maker: 'Anthropic', note: 'Thoughtful, clear explanations.' },
  { id: 'anthropic/claude-haiku-4-5', name: 'Claude Haiku 4.5', maker: 'Anthropic', note: 'Quick and inexpensive.' },
  { id: 'google/gemini-3-flash', name: 'Gemini 3 Flash', maker: 'Google', note: 'Fast multimodal model.' },
];
const KEY = 'lexi-ai-model';

export function ModelManager() {
  const [models, setModels] = useState(defaultModels);
  const [selected, setSelected] = useState('openai/gpt-6-astra');
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [maker, setMaker] = useState('');
  const [modelId, setModelId] = useState('');
  const [error, setError] = useState('');
  useEffect(() => { const saved = localStorage.getItem(KEY); if (saved && defaultModels.some(m => m.id === saved)) setSelected(saved); }, []);
  function choose(id: string) { setSelected(id); if (defaultModels.some(m => m.id === id)) localStorage.setItem(KEY, id); }
  function add(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim() || !maker.trim() || !modelId.trim()) { setError('Enter a model name, provider, and model ID.'); return; }
    if (models.some(m => m.id === modelId.trim())) { setError('This model ID is already in your list.'); return; }
    setModels(items => [...items, { id: modelId.trim(), name: name.trim(), maker: maker.trim(), note: 'Custom model · Not connected' }]);
    setOpen(false); setName(''); setMaker(''); setModelId(''); setError('');
  }
  function remove(id: string) {
    setModels(items => items.filter(m => m.id !== id));
    if (selected === id) choose('openai/gpt-6-astra');
  }
  const current = models.find(m => m.id === selected) ?? defaultModels[0];
  return <>
    <Section number="01" title="Current model">
      <div className="flex items-center gap-4 border-y border-border py-5"><span className="grid size-12 shrink-0 place-items-center rounded-2xl nav-tile"><Bot className="size-5"/></span><div className="min-w-0"><p className="break-words font-semibold">{current?.name}</p><p className="text-sm text-muted-foreground">{current?.maker} · Not connected</p></div></div>
    </Section>
    <Section number="02" title="AI models">
      <div className="mb-4 flex items-center justify-between gap-3"><p className="text-sm text-muted-foreground">No AI service connected</p><Button variant="outline" onClick={() => setOpen(true)}><Plus/>Add model</Button></div>
      <div className="grid gap-3 sm:grid-cols-2">{models.map(m => <div key={m.id} className="flex min-w-0 items-center gap-2"><Button variant={m.id === selected ? 'secondary' : 'outline'} aria-pressed={m.id === selected} onClick={() => choose(m.id)} className="h-auto min-w-0 flex-1 justify-between whitespace-normal p-4 text-left"><span className="min-w-0"><span className="block break-words font-semibold">{m.name}</span><span className="block text-xs text-muted-foreground">{m.maker}</span><span className="mt-1 block break-all text-xs text-muted-foreground">{m.id}</span></span>{m.id === selected && <Check className="shrink-0"/>}</Button>{!defaultModels.some(item => item.id === m.id) && <Button variant="ghost" size="icon" aria-label={`Remove ${m.name}`} title={`Remove ${m.name}`} onClick={() => remove(m.id)}><Trash2/></Button>}</div>)}</div>
    </Section>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[85dvh] w-[calc(100%-2rem)] overflow-y-auto rounded-lg">
        <DialogHeader><DialogTitle>Add AI model</DialogTitle><DialogDescription>Custom model · Not connected · This visit only</DialogDescription></DialogHeader>
        <form onSubmit={add} className="space-y-4">
          <label className="block space-y-2 text-sm">Model name<Input value={name} onChange={e => setName(e.target.value)} maxLength={80}/></label>
          <label className="block space-y-2 text-sm">Provider<Input value={maker} onChange={e => setMaker(e.target.value)} maxLength={80}/></label>
          <label className="block space-y-2 text-sm">Model ID<Input value={modelId} onChange={e => setModelId(e.target.value)} maxLength={160} placeholder="provider/model-id"/></label>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full"><Plus/>Add model</Button>
        </form>
      </DialogContent>
    </Dialog>
  </>;
}
function AiPage() { return <Shell title="AI models"><ModelManager/></Shell>; }
