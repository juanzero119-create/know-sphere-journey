/**
 * Shared alphabetical sorting.
 *
 * A single collator-backed comparator is used everywhere the app lists words,
 * films, actors or videos, so "A–Z" always means the same thing:
 *
 * - case-insensitive ("apple" and "Apple" are equal, never split apart)
 * - accent-insensitive ordering ("café" sits with "cafe")
 * - numeric-aware ("Hulk 2" comes before "Hulk 10", not after "Hulk 3")
 * - surrounding and repeated spaces are ignored
 * - empty keys are pushed to the end in both directions
 * - stable: entries with equal keys keep the order they were given in
 */

export type SortDirection = "az" | "za";

const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
  caseFirst: "false",
});

/** Trim, collapse internal whitespace and casefold a key before comparing. */
export function normalizeAlphabetical(value: string): string {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

/** Compare two keys A–Z. Equal keys return 0 so callers can break ties. */
export function compareAlphabetical(a: string, b: string): number {
  const an = normalizeAlphabetical(a);
  const bn = normalizeAlphabetical(b);
  if (an === bn) return 0;
  if (an === "") return 1;
  if (bn === "") return -1;
  return collator.compare(an, bn);
}

/**
 * Sort a list alphabetically without mutating it. `getKey` turns each entry
 * into the text to order by; `direction` picks A–Z (default) or Z–A.
 */
export function sortByAlphabetical<T>(
  items: readonly T[],
  getKey: (item: T) => string,
  direction: SortDirection = "az",
): T[] {
  const sign = direction === "za" ? -1 : 1;
  return items
    .map((item, index) => ({ item, index, key: normalizeAlphabetical(getKey(item)) }))
    .sort((a, b) => {
      if (a.key === b.key) return a.index - b.index;
      if (a.key === "") return 1;
      if (b.key === "") return -1;
      const primary = collator.compare(a.key, b.key);
      return primary === 0 ? a.index - b.index : sign * primary;
    })
    .map(entry => entry.item);
}
