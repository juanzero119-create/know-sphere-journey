import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { eloLabel, eloPresets } from '@/lib/chess-elo';
import { setChessElo, useChessStore } from '@/lib/chess-store';

export function ChessElo() {
  const { state } = useChessStore();
  const aiSide: 'w' | 'b' = state.humanSide === 'w' ? 'b' : 'w';
  const sides: ('w' | 'b')[] = state.mode === 'aivai' ? ['w', 'b'] : [aiSide];
  return <div className="space-y-5 border-t border-border pt-5">
    <div className="flex flex-wrap items-baseline justify-between gap-2">
      <h3 className="text-sm font-semibold">AI difficulty</h3>
      <span className="text-xs text-muted-foreground">Approximate Elo · not a rated engine</span>
    </div>
    <div className="grid gap-6 sm:grid-cols-2">
      {sides.map(side => {
        const name = side === 'w' ? 'White AI' : 'Black AI';
        const elo = state.elo[side];
        return <div key={side} className="min-w-0 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <label id={`elo-label-${side}`} className="text-sm font-medium">{name}</label>
            <span className="font-mono text-lg tabular-nums">{elo} <span className="text-xs text-muted-foreground">Elo</span></span>
          </div>
          <Slider aria-label={`${name} Elo`} min={400} max={2400} step={100} value={[elo]} onValueChange={values => { const value = values[0]; if (value !== undefined) setChessElo(side, value); }} />
          <div className="flex justify-between text-xs text-muted-foreground"><span>400</span><span>2400</span></div>
          <Select value={String(elo)} onValueChange={value => setChessElo(side, Number(value))}>
            <SelectTrigger aria-label={`${name} Elo preset`}><SelectValue /></SelectTrigger>
            <SelectContent>
              {!eloPresets.some(preset => preset.elo === elo) && <SelectItem value={String(elo)}>{elo} · {eloLabel(elo)}</SelectItem>}
              {eloPresets.map(preset => <SelectItem key={preset.elo} value={String(preset.elo)}>{preset.elo} · {preset.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>;
      })}
    </div>
  </div>;
}