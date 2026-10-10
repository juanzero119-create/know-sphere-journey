import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { Chess, type Square } from 'chess.js';
import { Shell } from '@/components/Shell';
import { Section } from '@/components/Section';
import { Button } from '@/components/ui/button';
import { ModelManager } from '@/routes/ai';
import { getAiMove } from '@/lib/chess-ai.functions';

export const Route = createFileRoute('/chess')({
  head: () => ({ meta: [
    { title: 'Chess — Lexi blitz board' },
    { name: 'description', content: 'Play a full-rules blitz chess game with clocks, legal moves and a move list.' },
    { property: 'og:title', content: 'Chess — Lexi blitz board' },
    { property: 'og:description', content: 'Play a full-rules blitz chess game with clocks, legal moves and a move list.' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' },
  ] }),
  component: ChessPage,
});

const FILES = 'hgfedcba';
const BLITZ = 3 * 60 * 1000;
const INC = 2000;
const pieces = [
  ['King', '♔', 'One square in any direction. Castle by moving it two squares toward a rook.'], ['Queen', '♕', 'Any distance in a straight line or diagonal.'],
  ['Rook', '♖', 'Any distance along a row or column.'], ['Bishop', '♗', 'Any distance along a diagonal.'],
  ['Knight', '♘', 'An L-shape: two squares one way, one square sideways. It can jump.'], ['Pawn', '♙', 'Forward one (two on its first move); captures diagonally; en passant; promotes to a queen.'],
];
const pieceNames: Record<string, string> = { k: 'king', q: 'queen', r: 'rook', b: 'bishop', n: 'knight', p: 'pawn' };
const assetFiles = import.meta.glob<{ url: string }>('../assets/chess/*.asset.json', { eager: true, import: 'default' });
function pieceUrl(color: string, type: string) { return assetFiles[`../assets/chess/${color}${type.toUpperCase()}.asset.json`]?.url; }
const sq = (r: number, c: number) => `${FILES[c]}${r + 1}` as Square;
const fmt = (ms: number) => { const s = Math.max(0, Math.ceil(ms / 1000)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };

function ChessPage() {
  const [game, setGame] = useState(() => new Chess());
  const [, setTick] = useState(0);
  const [picked, setPicked] = useState<Square | null>(null);
  const [lastMove, setLastMove] = useState<[Square, Square] | null>(null);
  const [clock, setClock] = useState({ w: BLITZ, b: BLITZ });
  const [started, setStarted] = useState(false);
  const [mode, setMode] = useState<'ai' | '2p' | 'aivai'>('ai');
  const [thinking, setThinking] = useState(false);
  const [aiNote, setAiNote] = useState('');
  const turn = game.turn();
  const flagged = clock.w <= 0 ? 'w' : clock.b <= 0 ? 'b' : null;
  const over = game.isGameOver() || !!flagged;

  useEffect(() => {
    if (!started || over) return;
    let prev = Date.now();
    const id = setInterval(() => { const now = Date.now(); const d = now - prev; prev = now; setClock(c => ({ ...c, [turn]: c[turn] - d })); }, 100);
    return () => clearInterval(id);
  }, [started, over, turn]);

  const targets = useMemo(() => picked ? game.moves({ square: picked, verbose: true }).map(m => m.to) : [], [picked, game, lastMove]);
  const checkSq = game.inCheck() ? game.board().flat().find(p => p?.type === 'k' && p.color === turn)?.square : undefined;

  function tap(r: number, c: number) {
    if (over || thinking || mode === 'aivai' || (mode === 'ai' && game.turn() === 'b')) return;
    const s = sq(r, c);
    const p = game.get(s);
    if (picked && targets.includes(s)) {
      game.move({ from: picked, to: s, promotion: 'q' });
      setClock(cl => ({ ...cl, [turn]: cl[turn] + (started ? INC : 0) }));
      setStarted(true); setLastMove([picked, s]); setPicked(null); setTick(t => t + 1);
    } else if (p && p.color === turn) setPicked(s === picked ? null : s);
    else setPicked(null);
  }
  useEffect(() => {
    const aiTurn = mode === 'aivai' || (mode === 'ai' && turn === 'b');
    if (!aiTurn || over || thinking) return;
    let cancelled = false;
    const fen = game.fen();
    const model = localStorage.getItem('lexi-ai-model') || 'openai/gpt-6-astra';
    setThinking(true); setAiNote('');
    getAiMove({ data: { fen, model } }).then(r => {
      if (cancelled || game.fen() !== fen) return;
      if ('error' in r && r.error) { setAiNote(r.error); return; }
      if (!('move' in r) || !r.move) return;
      const m = game.move(r.move);
      setStarted(true);
      setClock(cl => ({ ...cl, [turn]: cl[turn] + INC }));
      setLastMove([m.from, m.to]); setPicked(null); setTick(t => t + 1);
      if (r.fallback) setAiNote('The AI gave an unclear answer, so a random legal move was played.');
    }).catch(() => { if (!cancelled) setAiNote('The AI could not move. Try again.'); }).finally(() => { if (!cancelled) setThinking(false); });
    return () => { cancelled = true; setThinking(false); };
  }, [mode, over, turn, game, lastMove]);
  function reset() { setAiNote(''); setGame(new Chess()); setPicked(null); setLastMove(null); setClock({ w: BLITZ, b: BLITZ }); setStarted(false); }

  const status = flagged ? `${flagged === 'w' ? 'White' : 'Black'} ran out of time — ${flagged === 'w' ? 'Black' : 'White'} wins`
    : game.isCheckmate() ? `Checkmate — ${turn === 'w' ? 'Black' : 'White'} wins`
    : game.isDraw() ? 'Draw' : `${turn === 'w' ? 'White' : 'Black'} to move${game.inCheck() ? ' · Check!' : ''}`;
  const history = game.history();
  const Clock = ({ side }: { side: 'w' | 'b' }) => <div className={'flex items-center justify-between rounded-md px-3 py-2 text-sm ' + (turn === side && !over ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground')}><span className="font-semibold">{side === 'w' ? 'White' : 'Black'}</span><span className="font-mono text-lg tabular-nums">{fmt(clock[side])}</span></div>;

  return <Shell title="Chess">
    <Section number="01" title="Blitz game · 3+2">
      <div className="mx-auto max-w-2xl space-y-2">
        <Clock side="w" />
        <div role="group" aria-label="Chess board" className="grid aspect-square w-full grid-cols-8 overflow-hidden">
          {Array.from({ length: 8 }, (_, r) => Array.from({ length: 8 }, (_, c) => {
            const s = sq(r, c); const p = game.get(s); const isTarget = targets.includes(s);
            return <Button variant="ghost" key={s} aria-label={`Square ${s}${p ? ' ' + (p.color === 'w' ? 'white' : 'black') + ' ' + pieceNames[p.type] : ''}`} aria-pressed={picked === s} onClick={() => tap(r, c)} className={'chess-square relative h-auto min-w-0 rounded-none p-0 aspect-square ' + ((r + c) % 2 ? 'chess-dark ' : '') + (lastMove?.includes(s) || picked === s ? 'chess-last' : '')}>
              {lastMove?.[0] === s && <span aria-hidden="true" className="chess-square chess-origin absolute inset-0"/>}
              {checkSq === s && <span aria-hidden="true" className="absolute inset-0 bg-destructive/60"/>}
              {p && <img src={pieceUrl(p.color, p.type)} alt="" draggable={false} className="relative h-[90%] w-[90%] object-contain"/>}
              {isTarget && (p ? <span aria-hidden="true" className="absolute inset-[4%] rounded-full border-4 border-ink/30"/> : <span aria-hidden="true" className="absolute size-1/3 rounded-full bg-ink/25"/>)}
              {r === 0 && <span aria-hidden="true" className="absolute right-1 top-0.5 text-xs font-semibold sm:right-2 sm:top-1 sm:text-base">{FILES[c]}</span>}
              {c === 0 && <span aria-hidden="true" className="absolute bottom-0.5 left-1 text-xs font-semibold sm:bottom-1 sm:left-2 sm:text-base">{r + 1}</span>}
            </Button>;
          }))}
        </div>
        <Clock side="b" />
        <div className="flex items-center justify-between gap-3 pt-2"><span role="status" className="text-sm font-semibold">{status}</span><div className="flex flex-wrap gap-2"><Button variant={mode === 'ai' ? 'secondary' : 'outline'} aria-pressed={mode === 'ai'} onClick={() => { setMode('ai'); reset(); }}>Vs AI</Button><Button variant={mode === '2p' ? 'secondary' : 'outline'} aria-pressed={mode === '2p'} onClick={() => { setMode('2p'); reset(); }}>2 players</Button><Button variant={mode === 'aivai' ? 'secondary' : 'outline'} aria-pressed={mode === 'aivai'} onClick={() => { setMode('aivai'); reset(); }}>AI vs AI</Button><Button variant="outline" onClick={reset}>New game</Button></div></div>
        {mode === 'ai' && <p className="text-xs text-muted-foreground">You play White. The AI plays Black using the model chosen below.{thinking ? ' AI is thinking…' : ''}</p>}
        {mode === 'aivai' && <p className="text-xs text-muted-foreground">Two AIs play each other with the model chosen below — one move at a time.{thinking ? ' AI is thinking…' : ''} Each move uses AI credits.</p>}
        {aiNote && <p role="alert" className="text-xs text-destructive">{aiNote}</p>}
        <p className="text-xs text-muted-foreground">Full rules: legal moves only, check, checkmate, castling, en passant, promotion. Clock starts after White's first move.</p>
        <p className="text-xs text-muted-foreground">Pieces: Cburnett / Wikimedia Commons · CC BY-SA 3.0</p>
      </div>
    </Section>
    <Section number="02" title="Move list">
      {history.length === 0 ? <p className="text-sm text-muted-foreground">No moves yet.</p> :
        <ol className="grid grid-cols-[auto_1fr_1fr] gap-x-4 gap-y-1 font-mono text-sm">{Array.from({ length: Math.ceil(history.length / 2) }, (_, i) => <li key={i} className="contents"><span className="text-muted-foreground">{i + 1}.</span><span>{history[i * 2]}</span><span>{history[i * 2 + 1] ?? ''}</span></li>)}</ol>}
    </Section>
    <Section number="03" title="Chess AI">
      <p className="text-sm text-muted-foreground">Choose the AI model for chess. The AI opponent plays Black with the model you pick here.</p>
    </Section>
    <ModelManager/>
    <Section number="06" title="How the pieces move">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{pieces.map(([n, s, d]) => <div key={n} className="flex gap-3 rounded-lg border border-border bg-card p-4"><span className="text-3xl">{s}</span><div><p className="font-semibold">{n}</p><p className="text-sm text-muted-foreground">{d}</p></div></div>)}</div>
    </Section>
  </Shell>;
}
