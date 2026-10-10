import { describe, expect, it } from 'vitest';
import { adjustHighlights, applyHighlight } from '@/lib/note-highlights';

describe('note highlighting', () => {
  it('applies a chosen color and splits overlaps when recoloring', () => {
    const ranges = applyHighlight([], 0, 10, 'gold');
    expect(applyHighlight(ranges, 3, 7, 'blue')).toEqual([
      { start: 0, end: 3, color: 'gold' }, { start: 3, end: 7, color: 'blue' }, { start: 7, end: 10, color: 'gold' },
    ]);
  });
  it('removes highlights only from the selected text', () => {
    expect(applyHighlight([{ start: 0, end: 10, color: 'rose' }], 0, 5, null)).toEqual([{ start: 5, end: 10, color: 'rose' }]);
  });
  it('moves highlights when earlier text changes', () => {
    expect(adjustHighlights([{ start: 6, end: 11, color: 'green' }], 'Hello world', 'Hey world')).toEqual([{ start: 4, end: 9, color: 'green' }]);
  });
  it('drops deleted highlights and ignores empty selections', () => {
    const ranges = [{ start: 0, end: 5, color: 'gold' as const }];
    expect(adjustHighlights(ranges, 'Hello', '')).toEqual([]);
    expect(applyHighlight(ranges, 2, 2, 'blue')).toEqual(ranges);
  });
});