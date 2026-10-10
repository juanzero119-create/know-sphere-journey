export const noteColors = [
  { id: 'gold', label: 'Gold', className: 'bg-name-gold' },
  { id: 'blue', label: 'Blue', className: 'bg-name-blue' },
  { id: 'rose', label: 'Rose', className: 'bg-name-rose' },
  { id: 'green', label: 'Green', className: 'bg-name-green' },
] as const;
export type NoteColor = (typeof noteColors)[number]['id'];
export type NoteHighlight = { start: number; end: number; color: NoteColor };

export function applyHighlight(ranges: NoteHighlight[], start: number, end: number, color: NoteColor | null): NoteHighlight[] {
  if (start >= end) return ranges;
  const next = ranges.flatMap(range => {
    if (range.end <= start || range.start >= end) return [range];
    return [
      ...(range.start < start ? [{ ...range, end: start }] : []),
      ...(range.end > end ? [{ ...range, start: end }] : []),
    ];
  });
  if (color) next.push({ start, end, color });
  return next.sort((a, b) => a.start - b.start);
}

export function adjustHighlights(ranges: NoteHighlight[], before: string, after: string): NoteHighlight[] {
  let start = 0;
  while (start < before.length && start < after.length && before[start] === after[start]) start++;
  let oldEnd = before.length;
  let newEnd = after.length;
  while (oldEnd > start && newEnd > start && before[oldEnd - 1] === after[newEnd - 1]) { oldEnd--; newEnd--; }
  const delta = newEnd - oldEnd;
  return ranges.flatMap(range => {
    if (range.end <= start) return [range];
    if (range.start >= oldEnd) return [{ ...range, start: range.start + delta, end: range.end + delta }];
    return [
      ...(range.start < start ? [{ ...range, end: start }] : []),
      ...(range.end > oldEnd ? [{ ...range, start: newEnd, end: range.end + delta }] : []),
    ];
  });
}