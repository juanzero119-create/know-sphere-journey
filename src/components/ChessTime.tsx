import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { timePresets, timeLabel } from '@/lib/chess-time';
import { setChessTime, useChessStore } from '@/lib/chess-store';

export function ChessTime() {
  const { state } = useChessStore();
  const { minutes, incrementSec } = state.time;
  const apply = (m: number, i: number) => setChessTime({ minutes: m, incrementSec: i });
  const current = timeLabel(state.time);
  const presetMatch = timePresets.some(p => p.minutes === minutes && p.incrementSec === incrementSec);
  return <div className="space-y-5 border-t border-border pt-5">
    <div className="flex flex-wrap items-baseline justify-between gap-2">
      <h3 className="text-sm font-semibold">Time control</h3>
      <span className="text-xs text-muted-foreground">Starts a new game · {minutes} min + {incrementSec}s per move</span>
    </div>
    <div className="flex flex-wrap gap-2">
      {timePresets.map(p => {
        const label = `${p.minutes}+${p.incrementSec}`;
        return <Button key={label} variant={current === label ? 'secondary' : 'outline'} aria-pressed={current === label} onClick={() => apply(p.minutes, p.incrementSec)}>
          {label} · {p.label}
        </Button>;
      })}
      {!presetMatch && <Button variant="secondary" aria-pressed="true">{current} · Custom</Button>}
    </div>
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="min-w-0 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <label id="time-minutes-label" className="text-sm font-medium">Minutes per player</label>
          <span className="font-mono text-lg tabular-nums">{minutes} <span className="text-xs text-muted-foreground">min</span></span>
        </div>
        <Slider aria-label="Minutes per player" min={1} max={60} step={1} value={[minutes]} onValueChange={values => { const value = values[0]; if (value !== undefined) apply(value, incrementSec); }} />
        <div className="flex justify-between text-xs text-muted-foreground"><span>1</span><span>60</span></div>
      </div>
      <div className="min-w-0 space-y-4">
        <span className="block text-sm font-medium">Bonus per move</span>
        <Select value={String(incrementSec)} onValueChange={value => apply(minutes, Number(value))}>
          <SelectTrigger aria-label="Bonus seconds per move"><SelectValue /></SelectTrigger>
          <SelectContent>
            {[0, 1, 2, 3, 5, 10, 15, 20, 30].map(sec => <SelectItem key={sec} value={String(sec)}>{sec === 0 ? 'No bonus' : `+${sec} seconds`}</SelectItem>)}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">Added to your clock after every move you make.</p>
      </div>
    </div>
  </div>;
}
