import { createFileRoute } from '@tanstack/react-router';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Square } from 'chess.js';
import { Shell } from '@/components/Shell';
import { Section } from '@/components/Section';
import { Button } from '@/components/ui/button';
import { ModelManager } from '@/routes/ai';
import { ChessElo } from '@/components/ChessElo';
import { ChessRating } from '@/components/ChessRating';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { playMove, resetChess, setChessHumanSide, setChessMode, setChessPaused, useChessStore } from '@/lib/chess-store';
import { setChessMuted, useChessMuted } from '@/lib/chess-sounds';

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

interface BoardProps {
  game: ReturnType<typeof useChessStore>['game'];
  picked: Square | null;
  lastMove: [Square, Square] | null;
  interactive: boolean;
  onTap: (r: number, c: number) => void;
}

// Memoized so clock ticks (which bump state but not these props) don't
// re-render the 64 squares — the board only repaints on real moves.
const Board = memo(function Board({ game, picked, lastMove, interactive, onTap }: BoardProps) {
  const turn = game.turn();
  const targets = picked ? game.moves({ square: picked, verbose: true }).map(m => m.to) : [];
  const checkSq = game.inCheck() ? game.board().flat().find(p => p?.type === 'k' && p.color === turn)?.square : undefined;

  // Slide the moved piece from its old square to the new one.
  const [anim, setAnim] = useState<{ from: Square; to: Square; color: string; type: string } | null>(null);
  const [animGo, setAnimGo] = useState(false);
  const prevMove = useRef<typeof lastMove>(null);
  useEffect(() => {
    if (lastMove && lastMove !== prevMove.current) {
      const p = game.get(lastMove[1]);
      if (p) {
        setAnim({ from: lastMove[0], to: lastMove[1], color: p.color, type: p.type });
        setAnimGo(false);
      }
    }
    prevMove.current = lastMove;
  }, [lastMove, game]);
  useEffect(() => {
    if (!anim) return;
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setAnimGo(true)));
    const t = setTimeout(() => setAnim(null), 240);
    return () => { cancelAnimationFrame(raf); clearTimeout(t); };
  }, [anim]);

  const rc = (s: Square) => ({ r: Number(s[1]!) - 1, c: FILES.indexOf(s[0]!) });
  const a1 = anim ? rc(anim.from) : null;
  const a2 = anim ? rc(anim.to) : null;

  return <div role="group" aria-label="Chess board" className="relative grid aspect-square w-full grid-cols-8 overflow-hidden">
    {Array.from({ length: 8 }, (_, r) => Array.from({ length: 8 }, (_, c) => {
      const s = sq(r, c); const p = game.get(s); const isTarget = targets.includes(s);
      return <Button variant="ghost" key={s} aria-label={`Square ${s}${p ? ' ' + (p.color === 'w' ? 'white' : 'black') + ' ' + pieceNames[p.type] : ''}`} aria-pressed={picked === s} onClick={() => interactive && onTap(r, c)} className={'chess-square relative h-auto min-w-0 rounded-none p-0 aspect-square ' + ((r + c) % 2 ? 'chess-dark ' : '') + (lastMove?.includes(s) || picked === s ? 'chess-last' : '')}>
        {lastMove?.[0] === s && <span aria-hidden="true" className="chess-square chess-origin absolute inset-0"/>}
        {checkSq === s && <span aria-hidden="true" className="absolute inset-0 bg-destructive/60"/>}
        {p && anim?.to !== s && <img src={pieceUrl(p.color, p.type)} alt="" draggable={false} className="relative h-[90%] w-[90%] object-contain"/>}
        {isTarget && (p ? <span aria-hidden="true" className="absolute inset-[4%] rounded-full border-4 border-ink/30"/> : <span aria-hidden="true" className="absolute size-1/3 rounded-full bg-ink/25"/>)}
        {r === 0 && <span aria-hidden="true" className="absolute right-1 top-0.5 text-xs font-semibold sm:right-2 sm:top-1 sm:text-base">{FILES[c]}</span>}
        {c === 0 && <span aria-hidden="true" className="absolute bottom-0.5 left-1 text-xs font-semibold sm:bottom-1 sm:left-2 sm:text-base">{r + 1}</span>}
      </Button>;
    }))}
    {anim && a1 && a2 && <img src={pieceUrl(anim.color, anim.type)} alt="" aria-hidden="true" draggable={false} className="pointer-events-none absolute z-10 object-contain transition-transform duration-200 ease-out" style={{ left: `${a1.c * 12.5}%`, top: `${a1.r * 12.5}%`, width: '12.5%', height: '12.5%', padding: '0.4%', transform: animGo ? `translate(${(a2.c - a1.c) * 100}%, ${(a2.r - a1.r) * 100}%)` : 'none' }} />}
  </div>;
});

// Countdown ring plus a live elapsed timer ("1.3s") beside it. Ticks on its
// own 100ms interval so the rest of the page doesn't re-render each tenth.
function Thinking({ since }: { since: number }) {
  const [, tick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => tick((n) => n + 1), 100);
    return () => clearInterval(id);
  }, []);
  return <span role="status" aria-label="AI is thinking" className="inline-flex items-center gap-3">
    <span className="chess-thinking-circle inline-flex size-5 items-center justify-center">
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" strokeWidth="4.5">
        <circle className="chess-thinking-track" cx="12" cy="12" r="9" />
        <circle className="chess-thinking-progress" cx="12" cy="12" r="9" pathLength="100" strokeDasharray="100" transform="rotate(-90 12 12)" />
      </svg>
    </span>
    <span className="font-mono text-xs tabular-nums">{((Date.now() - since) / 1000).toFixed(1)}s</span>
  </span>;
}

function ChessPage() {
  const { game, state } = useChessStore();
  const [picked, setPicked] = useState<Square | null>(null);
  const muted = useChessMuted();
  const { clock, mode, humanSide, lastMove, thinking, aiNote, paused } = state;
  const turn = game.turn();
  const flagged = clock.w <= 0 ? 'w' : clock.b <= 0 ? 'b' : null;
  const over = game.isGameOver() || !!flagged;

  const targets = useMemo(() => picked ? game.moves({ square: picked, verbose: true }).map(m => m.to) : [], [picked, game, lastMove]);

  const tap = useCallback((r: number, c: number) => {
    if (over || thinking || paused || mode === 'aivai' || (mode === 'ai' && turn !== humanSide)) return;
    const s = sq(r, c);
    const p = game.get(s);
    if (picked && targets.includes(s)) {
      playMove(picked, s);
      setPicked(null);
    } else if (p && p.color === turn) setPicked(s === picked ? null : s);
    else setPicked(null);
  }, [over, thinking, paused, mode, turn, humanSide, picked, targets, game]);

  const interactive = !over && !thinking && !paused && mode !== 'aivai' && !(mode === 'ai' && turn !== humanSide);

  const status = flagged ? `${flagged === 'w' ? 'White' : 'Black'} ran out of time — ${flagged === 'w' ? 'Black' : 'White'} wins`
    : game.isCheckmate() ? `Checkmate — ${turn === 'w' ? 'Black' : 'White'} wins`
    : game.isDraw() ? 'Draw' : `${paused ? 'Paused · ' : ''}${turn === 'w' ? 'White' : 'Black'} to move${game.inCheck() ? ' · Check!' : ''}`;
  const history = game.history();
  const renderClock = (side: 'w' | 'b') => <div className={'flex items-center justify-between rounded-md px-3 py-2 text-sm ' + (turn === side && !over ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground')}><span className="flex items-center gap-2 font-semibold">{side === 'w' ? 'White' : 'Black'}<span className="inline-flex items-center">{thinking && !over && !paused && turn === side && <Thinking since={state.thinkingSince} />}</span></span><span className="font-mono text-lg tabular-nums">{fmt(clock[side])}</span></div>;

  return <Shell title="Chess">
    <Section number="01" title="Blitz game · 3+2">
      <div className="mx-auto max-w-2xl space-y-2">
        {renderClock('w')}
        <Board game={game} picked={picked} lastMove={lastMove} interactive={interactive} onTap={tap} />
        {renderClock('b')}
        <div className="flex items-center justify-between gap-3 pt-2"><span role="status" className="text-sm font-semibold">{status}</span><div className="flex flex-wrap gap-2"><Button size="icon" variant="outline" aria-pressed={muted} aria-label={muted ? 'Unmute the sounds' : 'Mute the sounds'} title={muted ? 'Unmute' : 'Mute'} onClick={() => setChessMuted(!muted)}>{muted ? <VolumeX /> : <Volume2 />}</Button>{mode !== '2p' && !over && <><Button size="icon" variant={paused ? 'outline' : 'secondary'} aria-pressed={paused} aria-label="Pause the game" title="Pause" onClick={() => setChessPaused(true)}><Pause /></Button><Button size="icon" variant="outline" aria-pressed={!paused} aria-label="Play the game" title="Play" className={paused ? undefined : 'btn-play-live'} onClick={() => setChessPaused(false)}><Play /></Button></>}<Button variant={mode === 'ai' ? 'secondary' : 'outline'} aria-pressed={mode === 'ai'} onClick={() => setChessMode('ai')}>Vs AI</Button><Button variant={mode === '2p' ? 'secondary' : 'outline'} aria-pressed={mode === '2p'} onClick={() => setChessMode('2p')}>2 players</Button><Button variant={mode === 'aivai' ? 'secondary' : 'outline'} aria-pressed={mode === 'aivai'} onClick={() => setChessMode('aivai')}>AI vs AI</Button><Button variant="outline" onClick={() => resetChess()}>New game</Button></div></div>
        {mode === 'ai' && <div className="flex flex-wrap items-center gap-2"><span className="text-xs text-muted-foreground">You play</span><Button variant={humanSide === 'w' ? 'secondary' : 'outline'} aria-pressed={humanSide === 'w'} onClick={() => setChessHumanSide('w')}>White</Button><Button variant={humanSide === 'b' ? 'secondary' : 'outline'} aria-pressed={humanSide === 'b'} onClick={() => setChessHumanSide('b')}>Black</Button></div>}
        {mode === 'ai' && <p className="text-xs text-muted-foreground">You play {humanSide === 'w' ? 'White' : 'Black'}. The AI plays {humanSide === 'w' ? 'Black' : 'White'} using the model chosen for its colour below.</p>}
        {mode === 'aivai' && <p className="text-xs text-muted-foreground">Two AIs play each other, each with the model chosen for its colour below — one move at a time, even while you browse other tabs. Each move uses AI credits.</p>}
        {aiNote && <p role="alert" className="text-xs text-destructive">{aiNote}</p>}
        <p className="text-xs text-muted-foreground">Full rules: legal moves only, check, checkmate, castling, en passant, promotion. Clock starts after White's first move. The game keeps running if you switch tabs.</p>
        <p className="text-xs text-muted-foreground">Pieces: Cburnett / Wikimedia Commons · CC BY-SA 3.0</p>
        {mode === 'ai' && <ChessRating />}
        {mode !== '2p' && <ChessElo />}
      </div>
    </Section>
    <ModelManager />
    <Section number="04" title="Move list">
      {history.length === 0 ? <p className="text-sm text-muted-foreground">No moves yet.</p> :
        <ol className="grid grid-cols-[auto_1fr_1fr] gap-x-4 gap-y-1 font-mono text-sm">{Array.from({ length: Math.ceil(history.length / 2) }, (_, i) => <li key={i} className="contents"><span className="text-muted-foreground">{i + 1}.</span><span>{history[i * 2]}</span><span>{history[i * 2 + 1] ?? ''}</span></li>)}</ol>}
    </Section>
    <Section number="05" title="How the pieces move">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{pieces.map(([n, s, d]) => <div key={n} className="flex gap-3 rounded-lg border border-border bg-card p-4"><span className="text-3xl">{s}</span><div><p className="font-semibold">{n}</p><p className="text-sm text-muted-foreground">{d}</p></div></div>)}</div>
    </Section>
  </Shell>;
}
