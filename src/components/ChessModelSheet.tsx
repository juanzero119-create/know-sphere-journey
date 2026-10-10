import { useEffect, useState } from 'react';
import { Check, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { addChessModel, chooseChessModel, isDefaultModel, removeChessModel, useChessModels, type ChessSide } from '@/lib/chess-models';

const sides: ChessSide[] = ['w', 'b'];

// Inline model list shown directly under a colour's model selector on the page.
export function ChessModelSheet({ side, open, onOpenChange }: { side: ChessSide; open: boolean; onOpenChange: (open: boolean) => void }) {
  const { models, selected } = useChessModels();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [maker, setMaker] = useState('');
  const [modelId, setModelId] = useState('');
  const [error, setError] = useState('');
  const label = side === 'w' ? 'White AI' : 'Black AI';

  useEffect(() => {
    if (!open) { setAdding(false); setError(''); }
  }, [open]);

  if (!open) return null;

  function add(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim() || !maker.trim() || !modelId.trim()) { setError('Enter a model name, provider, and model ID.'); return; }
    if (!addChessModel({ name, maker, id: modelId })) { setError('This model ID is already in your list.'); return; }
    setAdding(false); setName(''); setMaker(''); setModelId(''); setError('');
  }

  return <div className="space-y-4 rounded-lg border border-border p-4" aria-label={`${label} model list`}>
    <div>
      <p className="text-sm font-semibold">{label} model</p>
      <p className="text-xs text-muted-foreground">Pick which model this colour plays with. Custom entries stay for this visit only.</p>
    </div>
    <div className="flex items-center justify-between gap-3">
      <p className="text-sm text-muted-foreground">No AI service connected</p>
      <Button variant="outline" aria-expanded={adding} onClick={() => setAdding(value => !value)}><Plus />Add model</Button>
    </div>
    {adding && <form onSubmit={add} className="space-y-3 rounded-lg border border-border p-4">
      <label className="block space-y-2 text-sm">Model name<Input value={name} onChange={e => setName(e.target.value)} maxLength={80} /></label>
      <label className="block space-y-2 text-sm">Provider<Input value={maker} onChange={e => setMaker(e.target.value)} maxLength={80} /></label>
      <label className="block space-y-2 text-sm">Model ID<Input value={modelId} onChange={e => setModelId(e.target.value)} maxLength={160} placeholder="provider/model-id" /></label>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <Button type="submit" className="w-full"><Plus />Add model</Button>
    </form>}
    <div className="grid gap-3">{models.map((model) => {
      const usedBy = sides.filter((item) => selected[item] === model.id);
      const chosen = selected[side] === model.id;
      return <div key={model.id} className="flex min-w-0 items-center gap-2">
        <Button variant={chosen ? 'secondary' : 'outline'} aria-pressed={chosen} aria-label={`${model.name} ${model.maker}`}
          onClick={() => { chooseChessModel(side, model.id); onOpenChange(false); }}
          className="h-auto min-w-0 flex-1 justify-between whitespace-normal p-4 text-left">
          <span className="min-w-0">
            <span className="block break-words font-semibold">{model.name}</span>
            <span className="block text-xs text-muted-foreground">{model.maker}</span>
            <span className="mt-1 block break-all text-xs text-muted-foreground">{model.id}</span>
            {usedBy.length > 0 && <span className="mt-1 block text-xs text-muted-foreground">Plays {usedBy.map((item) => (item === 'w' ? 'White' : 'Black')).join(' and ')}</span>}
          </span>
          {chosen && <Check className="shrink-0" />}
        </Button>
        {!isDefaultModel(model.id) && <Button variant="ghost" size="icon" aria-label={`Remove ${model.name}`} title={`Remove ${model.name}`} onClick={() => removeChessModel(model.id)}><Trash2 /></Button>}
      </div>;
    })}</div>
  </div>;
}
