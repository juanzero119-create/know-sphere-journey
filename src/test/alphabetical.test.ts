import { describe, expect, it } from 'vitest';

import { compareAlphabetical, normalizeAlphabetical, sortByAlphabetical } from '@/lib/alphabetical';

describe('alphabetical sorting', () => {
  it('orders entries A–Z whatever their case or stray spaces', () => {
    expect(sortByAlphabetical(['zesty', 'Apple', '  banana ', 'Cherry'], w => w)).toEqual([
      'Apple',
      '  banana ',
      'Cherry',
      'zesty',
    ]);
  });

  it('reverses the same order for Z–A', () => {
    expect(sortByAlphabetical(['apple', 'banana', 'cherry'], w => w, 'za')).toEqual([
      'cherry',
      'banana',
      'apple',
    ]);
  });

  it('sorts embedded numbers by value instead of by character', () => {
    expect(sortByAlphabetical(['Hulk 10', 'Hulk 2', 'Hulk 3'], w => w)).toEqual([
      'Hulk 2',
      'Hulk 3',
      'Hulk 10',
    ]);
  });

  it('reads accented letters as their plain counterparts', () => {
    expect(compareAlphabetical('café', 'cafe')).toBe(0);
    expect(sortByAlphabetical(['cave', 'café'], w => w)).toEqual(['café', 'cave']);
  });

  it('breaks ties by original order and never mutates the input', () => {
    const input = [{ word: 'B' }, { word: 'a' }, { word: 'A' }];
    const copy = [...input];
    expect(sortByAlphabetical(input, w => w.word).map(w => w.word)).toEqual(['a', 'A', 'B']);
    expect(input).toEqual(copy);
  });

  it('pushes blank keys to the end in both directions', () => {
    expect(sortByAlphabetical(['beta', '', 'alpha'], w => w)).toEqual(['alpha', 'beta', '']);
    expect(sortByAlphabetical(['beta', '', 'alpha'], w => w, 'za')).toEqual(['beta', 'alpha', '']);
  });

  it('normalizes keys before comparing them', () => {
    expect(normalizeAlphabetical('  Bureaucratic   Charlatan ')).toBe('bureaucratic charlatan');
    expect(compareAlphabetical('apple', 'Apple')).toBe(0);
    expect(compareAlphabetical('ant', 'bee')).toBeLessThan(0);
    expect(compareAlphabetical('bee', 'ant')).toBeGreaterThan(0);
  });

  it('sorts by a key taken from an object field', () => {
    const films = [{ title: 'Toy Story 3' }, { title: 'a Bug’s Life' }, { title: 'Hulk' }];
    expect(sortByAlphabetical(films, f => f.title).map(f => f.title)).toEqual([
      'a Bug’s Life',
      'Hulk',
      'Toy Story 3',
    ]);
  });
});
