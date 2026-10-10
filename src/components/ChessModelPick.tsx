import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { chooseChessModel, modelById, useChessModels, type ChessSide } from '@/lib/chess-models';

const sides: ChessSide[] = ['w', 'b'];

export function ChessModelPick() {
  const { models, selected } = useChessModels();
  return <div className="space-y-5 border-t border-border pt-5">
    <div className="flex flex-wrap items-baseline justify-between gap-2">
      <h3 className="text-sm font-semibold">AI model per side</h3>
      <span className="text-xs text-muted-foreground">One model for each colour</span>
    </div>
    <div className="grid gap-6 sm:grid-cols-2">
      {sides.map((side) => {
        const name = side === 'w' ? 'White AI' : 'Black AI';
        const current = modelById(models, selected[side]);
        return <div key={side} className="min-w-0 space-y-2">
          <span className="block text-sm font-medium">{name} model</span>
          <Select value={current.id} onValueChange={(id) => chooseChessModel(side, id)}>
            <SelectTrigger aria-label={`${name} model`}><SelectValue /></SelectTrigger>
            <SelectContent>
              {models.map((model) => <SelectItem key={model.id} value={model.id}>{model.name} · {model.maker}</SelectItem>)}
            </SelectContent>
          </Select>
          <p className="break-all text-xs text-muted-foreground">{current.maker} · {current.id}</p>
        </div>;
      })}
    </div>
  </div>;
}
