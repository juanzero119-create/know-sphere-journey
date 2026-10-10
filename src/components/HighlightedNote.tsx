import { noteColors, type NoteHighlight } from '@/lib/note-highlights';

export function HighlightedNote({ body, highlights }: { body: string; highlights: NoteHighlight[] }) {
  let cursor = 0;
  const parts = highlights.map((range, index) => {
    const plain = body.slice(cursor, range.start);
    cursor = range.end;
    return <span key={index}>{plain}<mark className={`rounded-sm ${noteColors.find(color => color.id === range.color)?.className ?? ''}`}>{body.slice(range.start, range.end)}</mark></span>;
  });
  return <>{parts}{body.slice(cursor)}</>;
}