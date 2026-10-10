import { Button } from '@/components/ui/button';
import { resetRating, useChessRating } from '@/lib/chess-rating';
import { eloLabel } from '@/lib/chess-elo';

export function ChessRating() {
  const r = useChessRating();
  const change = r.lastChange;
  return <div className="space-y-3 rounded-lg border border-border bg-card p-4">
    <div className="flex items-baseline justify-between gap-2">
      <h3 className="text-sm font-semibold">Your rating</h3>
      <Button size="sm" variant="ghost" onClick={resetRating}>Reset</Button>
    </div>
    <div className="flex items-baseline gap-3">
      <span className="font-mono text-3xl tabular-nums">{r.rating}</span>
      <span className="text-xs text-muted-foreground">{eloLabel(r.rating)}</span>
      {change !== null && <span className={'font-mono text-sm ' + (change >= 0 ? 'text-primary' : 'text-destructive')}>{change >= 0 ? '+' : ''}{change}</span>}
    </div>
    <p className="text-xs text-muted-foreground">{r.games} rated games · {r.wins}W {r.losses}L {r.draws}D. Win against the AI to build your rating — beating a stronger AI earns more points, losing to a weaker one costs more. Only Vs AI games count.</p>
  </div>;
}
