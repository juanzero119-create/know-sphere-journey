import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Bot, Check, Plus, Trash2 } from 'lucide-react';
import { Shell } from '@/components/Shell';
import { Section } from '@/components/Section';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ChessModelPick } from '@/components/ChessModelPick';
import { addChessModel, chooseChessModelForBoth, isDefaultModel, modelById, removeChessModel, useChessModels, type ChessSide } from '@/lib/chess-models';

export const Route = createFileRoute('/ai')({
  head: () => ({ meta: [
    { title: 'AI models — Lexi settings' },
    { name: 'description', content: 'Choose the AI model Lexi uses for each chess colour.' },
    { property: 'og:title', content: 'AI models — Lexi settings' },
    { property: 'og:description', content: 'Choose the AI model Lexi uses for each chess colour.' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' },
  ] }),
  component: AiPage,
});

const sides: ChessSide[] = ['w', 'b'];

export function ModelManager({ pickers = true }: { pickers?: boolean }) {
  const { models, selected } = useChessModels();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [maker, setMaker] = useState('');
  const [modelId, setModelId] = useState('');
  const [error, setError] = useState('');

  function add(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim() || !maker.trim() || !modelId.trim()) { setError('Enter a model name, provider, and model ID.'); return; }
    if (!addChessModel({ name, maker, id: modelId })) { setError('This model ID is already in your list.'); return; }
    setOpen(false); setName(''); setMaker(''); setModelId(''); setError('');
  }

  return <>
    <Section number="02" title="Current chess model">
      <div>{sides.map((side) => {
        const current = modelById(models, selected[side]);
        return <div key={side} className="flex items-center gap-4 border-y border-border py-5">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl nav-tile"><Bot className="size-5" /></span>
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{side === 'w' ? 'White AI' : 'Black AI'}</p>
            <p className="break-words font-semibold">{current.name}</p>
            <p className="text-sm text-muted-foreground">{current.maker} · Not connected</p>
          </div>
        </div>;
      })}</div>
      {pickers && <ChessModelPick />}
    </Section>
    <Section number="03" title="Chess AI models">
      <div className="mb-4 flex items-center justify-between gap-3"><p className="text-sm text-muted-foreground">No AI service connected</p><Button variant="outline" onClick={() => setOpen(true)}><Plus/>Add model</Button></div>
      <div className="grid gap-3 sm:grid-cols-2">{models.map((model) => {
        const usedBy = sides.filter((side) => selected[side] === model.id);
        return <div key={model.id} className="flex min-w-0 items-center gap-2">
          <Button variant={usedBy.length ? 'secondary' : 'outline'} aria-pressed={usedBy.length > 0} aria-label={`${model.name} ${model.maker}`} onClick={() => chooseChessModelForBoth(model.id)} className="h-auto min-w-0 flex-1 justify-between whitespace-normal p-4 text-left">
            <span className="min-w-0">
              <span className="block break-words font-semibold">{model.name}</span>
              <span className="block text-xs text-muted-foreground">{model.maker}</span>
              <span className="mt-1 block break-all text-xs text-muted-foreground">{model.id}</span>
              {usedBy.length > 0 && <span className="mt-1 block text-xs text-muted-foreground">Plays {usedBy.map((side) => (side === 'w' ? 'White' : 'Black')).join(' and ')}</span>}
            </span>
            {usedBy.length > 0 && <Check className="shrink-0" />}
          </Button>
          {!isDefaultModel(model.id) && <Button variant="ghost" size="icon" aria-label={`Remove ${model.name}`} title={`Remove ${model.name}`} onClick={() => removeChessModel(model.id)}><Trash2/></Button>}
        </div>;
      })}</div>
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
