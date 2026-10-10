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

const back = ['♜','♞','♝','♛','♚','♝','♞','♜'];
const start = () => [back, Array(8).fill('♟'), ...Array.from({ length: 4 }, () => Array(8).fill('')), Array(8).fill('♙'), ['♖','♘','♗','♕','♔','♗','♘','♖']].map(r => [...r]);
const pieces = [
  ['King', '♔', 'One square in any direction.'], ['Queen', '♕', 'Any distance in a straight line or diagonal.'],
  ['Rook', '♖', 'Any distance along a row or column.'], ['Bishop', '♗', 'Any distance along a diagonal.'],
  ['Knight', '♘', 'An L-shape: two squares one way, one square sideways. It can jump.'], ['Pawn', '♙', 'Forward one square (two on its first move); captures diagonally.'],
];

function ChessPage() {
  const [board, setBoard] = useState(start);
  const [picked, setPicked] = useState<[number, number] | null>(null);
  function tap(r: number, c: number) {
    if (picked) {
      const [pr, pc] = picked;
      if (pr !== r || pc !== c) { const next = board.map(row => [...row]); next[r][c] = next[pr][pc]; next[pr][pc] = ''; setBoard(next); }
      setPicked(null);
    } else if (board[r][c]) setPicked([r, c]);
  }
  return <Shell title="Chess">
    <Section number="01" title="Practice board">
      <p className="mb-4 text-sm text-muted-foreground">Tap a piece, then tap a square to move it. Free practice — rules are not enforced.</p>
      <div className="mx-auto grid aspect-square w-full max-w-md grid-cols-8 overflow-hidden rounded-lg border border-border">
        {board.map((row, r) => row.map((p, c) => <button key={r + '-' + c} aria-label={`Square ${'abcdefgh'[c]}${8 - r}${p ? ' ' + p : ''}`} onClick={() => tap(r, c)} className={'grid place-items-center text-3xl leading-none text-ink sm:text-4xl ' + ((r + c) % 2 ? 'bg-muted-foreground' : 'bg-cream') + (picked?.[0] === r && picked?.[1] === c ? ' ring-4 ring-inset ring-accent' : '')}>{p}</button>))}
      </div>
      <div className="mt-4 flex justify-center"><Button variant="outline" onClick={() => { setBoard(start()); setPicked(null); }}>Reset board</Button></div>
    </Section>
    <Section number="02" title="How the pieces move">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{pieces.map(([n, s, d]) => <div key={n} className="flex gap-3 rounded-lg border border-border bg-card p-4"><span className="text-3xl">{s}</span><div><p className="font-semibold">{n}</p><p className="text-sm text-muted-foreground">{d}</p></div></div>)}</div>
    </Section>
  </Shell>;
}
