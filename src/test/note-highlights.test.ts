import { describe, expect, it } from 'vitest';
import { adjustHighlights, applyHighlight, blendColors, colorClass, isNoteColor, noteColors } from '@/lib/note-highlights';

describe('note highlighting', () => {
  it('offers ten unique colors and preserves saved blend colors', () => {
    expect(noteColors).toHaveLength(10);
    expect(new Set(noteColors.map(color => color.id)).size).toBe(10);
    for (const color of noteColors) {
      expect(isNoteColor(color.id)).toBe(true);
      expect(colorClass(color.id)).toBe(color.className);
      expect(applyHighlight([], 0, 5, color.id)).toEqual([{ start: 0, end: 5, color: color.id }]);
    }
    for (const a of noteColors) for (const b of noteColors) {
      expect(blendColors(a.id, b.id)).toBe(blendColors(b.id, a.id));
      if (a.id !== b.id) {
        expect(blendColors(a.id, b.id)).not.toBe(a.id);
        expect(blendColors(a.id, b.id)).not.toBe(b.id);
      }
    }
    expect(isNoteColor('olive')).toBe(true);
    expect(isNoteColor('unknown')).toBe(false);
  });
  it('blends colors where a new highlight overlaps a different color', () => {
    const ranges = applyHighlight([], 0, 10, 'gold');
    expect(applyHighlight(ranges, 3, 7, 'blue')).toEqual([
      { start: 0, end: 3, color: 'gold' }, { start: 3, end: 7, color: 'green' }, { start: 7, end: 10, color: 'gold' },
    ]);
  });
  it('keeps the color when highlighting over the same color and blends every base pair', () => {
    expect(applyHighlight([{ start: 0, end: 5, color: 'gold' }], 0, 5, 'gold')).toEqual([{ start: 0, end: 5, color: 'gold' }]);
    expect(applyHighlight([{ start: 0, end: 5, color: 'gold' }], 0, 5, 'rose')).toEqual([{ start: 0, end: 5, color: 'orange' }]);
    expect(applyHighlight([{ start: 0, end: 5, color: 'blue' }], 0, 5, 'rose')).toEqual([{ start: 0, end: 5, color: 'purple' }]);
    expect(applyHighlight([{ start: 0, end: 5, color: 'blue' }], 0, 5, 'green')).toEqual([{ start: 0, end: 5, color: 'teal' }]);
    expect(applyHighlight([{ start: 0, end: 5, color: 'gold' }], 0, 5, 'green')).toEqual([{ start: 0, end: 5, color: 'lime' }]);
    expect(applyHighlight([{ start: 0, end: 5, color: 'rose' }], 0, 5, 'green')).toEqual([{ start: 0, end: 5, color: 'olive' }]);
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