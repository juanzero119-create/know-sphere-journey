export const noteColors = [
  { id: 'gold', label: 'Yellow', className: 'bg-name-gold' },
  { id: 'orange', label: 'Orange', className: 'bg-name-orange' },
  { id: 'coral', label: 'Coral', className: 'bg-name-coral' },
  { id: 'rose', label: 'Pink', className: 'bg-name-rose' },
  { id: 'purple', label: 'Purple', className: 'bg-name-purple' },
  { id: 'blue', label: 'Blue', className: 'bg-name-blue' },
  { id: 'cyan', label: 'Cyan', className: 'bg-name-cyan' },
  { id: 'teal', label: 'Teal', className: 'bg-name-teal' },
  { id: 'green', label: 'Green', className: 'bg-name-green' },
  { id: 'lime', label: 'Lime', className: 'bg-name-lime' },
] as const;
export type BaseNoteColor = (typeof noteColors)[number]['id'];
// Blended colors produced by highlighting over a different color.
export type BlendNoteColor = 'orange' | 'purple' | 'teal' | 'lime' | 'olive';
export type NoteColor = BaseNoteColor | BlendNoteColor;
export type NoteHighlight = { start: number; end: number; color: NoteColor };

const blendIds: BlendNoteColor[] = ['orange', 'purple', 'teal', 'lime', 'olive'];
export function isNoteColor(id: string): id is NoteColor {
  return noteColors.some(color => color.id === id) || (blendIds as string[]).includes(id);
}
export function colorClass(color: NoteColor): string {
  return `bg-name-${color}`;
}

const blends: Record<string, NoteColor> = {
  'blue+gold': 'green',
  'gold+rose': 'orange',
  'gold+green': 'lime',
  'blue+rose': 'purple',
  'blue+green': 'teal',
  'green+rose': 'olive',
};

export function blendColors(a: NoteColor, b: NoteColor): NoteColor {
  if (a === b) return a;
  const key = [a, b].sort().join('+');
  return blends[key] ?? b;
}

export function applyHighlight(ranges: NoteHighlight[], start: number, end: number, color: NoteColor | null): NoteHighlight[] {
  if (start >= end) return ranges;
  const covered: Array<{ start: number; end: number }> = [];
  const next = ranges.flatMap(range => {
    if (range.end <= start || range.start >= end) return [range];
    const overlapStart = Math.max(range.start, start);
    const overlapEnd = Math.min(range.end, end);
    covered.push({ start: overlapStart, end: overlapEnd });
    return [
      ...(range.start < overlapStart ? [{ ...range, end: overlapStart }] : []),
      // Overlapping part: blend with the new color, or remove when erasing.
      ...(color ? [{ start: overlapStart, end: overlapEnd, color: blendColors(range.color, color) }] : []),
      ...(range.end > overlapEnd ? [{ ...range, start: overlapEnd }] : []),
    ];
  });
  if (color) {
    // Fill only the parts of the selection not already covered (and blended) above.
    let cursor = start;
    for (const part of covered.sort((a, b) => a.start - b.start)) {
      if (part.start > cursor) next.push({ start: cursor, end: part.start, color });
      cursor = Math.max(cursor, part.end);
    }
    if (cursor < end) next.push({ start: cursor, end, color });
  }
  next.sort((a, b) => a.start - b.start);
  // Merge adjacent ranges that ended up with the same color.
  const merged: NoteHighlight[] = [];
  for (const range of next) {
    const last = merged[merged.length - 1];
    if (last && last.color === range.color && last.end === range.start) last.end = range.end;
    else merged.push({ ...range });
  }
  return merged;
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