import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Shell } from '@/components/Shell';
import { Section } from '@/components/Section';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/chess')({
  head: () => ({ meta: [
    { title: 'Chess — Lexi practice board' },
    { name: 'description', content: 'Move pieces on a practice chess board and learn how each piece moves.' },
    { property: 'og:title', content: 'Chess — Lexi practice board' },
    { property: 'og:description', content: 'Move pieces on a practice chess board and learn how each piece moves.' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' },
  ] }),
  component: ChessPage,
});

const back = ['R', 'N', 'B', 'K', 'Q', 'B', 'N', 'R'];
const start = () => [back.map(p => 'w' + p), Array.from({ length: 8 }, (_, c) => c === 3 ? '' : 'wP'), Array(8).fill(''), Array.from({ length: 8 }, (_, c) => c === 3 ? 'wP' : ''), Array(8).fill(''), Array(8).fill(''), Array(8).fill('bP'), back.map(p => 'b' + p)] as string[][];
const pieces = [
  ['King', '♔', 'One square in any direction.'], ['Queen', '♕', 'Any distance in a straight line or diagonal.'],
  ['Rook', '♖', 'Any distance along a row or column.'], ['Bishop', '♗', 'Any distance along a diagonal.'],
  ['Knight', '♘', 'An L-shape: two squares one way, one square sideways. It can jump.'], ['Pawn', '♙', 'Forward one square (two on its first move); captures diagonally.'],
];
const pieceNames: Record<string, string> = { K: 'king', Q: 'queen', R: 'rook', B: 'bishop', N: 'knight', P: 'pawn' };
const assetFiles = import.meta.glob<{ url: string }>('../assets/chess/*.asset.json', { eager: true, import: 'default' });
function pieceUrl(piece: string) { return assetFiles[`../assets/chess/${piece}.asset.json`]?.url; }

function ChessPage() {
  const [board, setBoard] = useState(start);
  const [picked, setPicked] = useState<[number, number] | null>(null);
  const [lastMove, setLastMove] = useState<[number, number][]>([[1, 3], [3, 3]]);
  function tap(r: number, c: number) {
    if (picked) {
      const [pr, pc] = picked;
      const piece = board[pr]?.[pc];
      if (piece && (pr !== r || pc !== c)) {
        const next = board.map(row => [...row]);
        const target = next[r];
        const source = next[pr];
        if (!target || !source) return;
        target[c] = piece;
        source[pc] = '';
        setBoard(next);
        setLastMove([[pr, pc], [r, c]]);
      }
      setPicked(null);
    } else if (board[r]?.[c]) setPicked([r, c]);
  }
  return <Shell title="Chess">
    <Section number="01" title="Practice board">
      <div role="group" aria-label="Chess practice board" className="mx-auto grid aspect-square w-full max-w-2xl grid-cols-8 overflow-hidden">
        {board.map((row, r) => row.map((p, c) => <Button variant="ghost" key={r + '-' + c} aria-label={`Square ${'hgfedcba'[c]}${r + 1}${p ? ' ' + (p[0] === 'w' ? 'white' : 'black') + ' ' + pieceNames[p.slice(1)] : ''}`} aria-pressed={picked?.[0] === r && picked?.[1] === c} onClick={() => tap(r, c)} className={'chess-square relative h-auto min-w-0 rounded-none p-0 aspect-square ' + ((r + c) % 2 ? 'chess-dark ' : '') + (lastMove.some(([lr, lc]) => lr === r && lc === c) ? 'chess-last' : '')}>
          {lastMove[0]?.[0] === r && lastMove[0]?.[1] === c && <span aria-hidden="true" className="chess-square chess-origin absolute inset-0"/>}
          {p && <img src={pieceUrl(p)} alt="" draggable={false} className="relative h-[90%] w-[90%] object-contain"/>}
          {r === 0 && <span aria-hidden="true" className="absolute right-1 top-0.5 text-xs font-semibold sm:right-2 sm:top-1 sm:text-base">{'hgfedcba'[c]}</span>}
          {c === 0 && <span aria-hidden="true" className="absolute bottom-0.5 left-1 text-xs font-semibold sm:bottom-1 sm:left-2 sm:text-base">{r + 1}</span>}
        </Button>))}
      </div>
      <div className="mt-4 flex items-center justify-between gap-3"><span className="text-xs text-muted-foreground">Free practice · White at top</span><Button variant="outline" onClick={() => { setBoard(start()); setPicked(null); setLastMove([[1, 3], [3, 3]]); }}>Reset board</Button></div>
      <p className="mt-3 text-xs text-muted-foreground">Pieces: Cburnett / Wikimedia Commons · CC BY-SA 3.0</p>
    </Section>
    <Section number="02" title="How the pieces move">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{pieces.map(([n, s, d]) => <div key={n} className="flex gap-3 rounded-lg border border-border bg-card p-4"><span className="text-3xl">{s}</span><div><p className="font-semibold">{n}</p><p className="text-sm text-muted-foreground">{d}</p></div></div>)}</div>
    </Section>
  </Shell>;
}
