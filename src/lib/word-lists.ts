import { useSyncExternalStore } from "react";
import type { TopicWord } from "@/lib/topics";
import { z } from "zod";

/**
 * Browser-only word lists: favorites, custom words, history and named
 * collections. Persisted in localStorage; a tiny store keeps every mounted
 * hook in sync within the visit.
 */

export type CustomWord = TopicWord & { custom?: boolean };
export type Collection = { id: string; name: string; words: string[] };

type Lists = {
  favorites: string[];
  customWords: CustomWord[];
  history: string[];
  collections: Collection[];
};

const KEY = "lexi-word-lists";
const empty: Lists = { favorites: [], customWords: [], history: [], collections: [] };
const customWordSchema = z.object({
  word: z.string().trim().min(1),
  meaning: z.string().trim().min(1),
  example: z.string().default("—"),
  pos: z.enum(["noun", "pronoun", "verb", "adjective", "adverb"]),
  synonym: z.string().optional(),
  custom: z.boolean().optional(),
});
const collectionSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1),
  words: z.array(z.string()).catch([]),
});

function validEntries<S extends z.ZodTypeAny>(value: unknown, schema: S): z.output<S>[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap(entry => {
    const result = schema.safeParse(entry);
    return result.success ? [result.data] : [];
  });
}

let state: Lists = empty;
const listeners = new Set<() => void>();

function load(): Lists {
  if (typeof window === "undefined") return empty;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return empty;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return empty;
    const stored = parsed as Record<string, unknown>;
    return {
      favorites: validEntries(stored['favorites'], z.string()),
      customWords: validEntries(stored['customWords'], customWordSchema),
      history: validEntries(stored['history'], z.string()),
      collections: validEntries(stored['collections'], collectionSchema),
    };
  } catch {
    return empty;
  }
}

function persist() {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable */
  }
}

function setState(next: Lists) {
  state = next;
  persist();
  listeners.forEach(l => l());
}

function ensureLoaded() {
  if (state === empty && typeof window !== "undefined") state = load();
}

export function useWordLists(): Lists {
  ensureLoaded();
  return useSyncExternalStore(
    cb => {
      ensureLoaded();
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state,
    () => empty,
  );
}

export function toggleFavorite(word: string) {
  ensureLoaded();
  const has = state.favorites.includes(word);
  setState({
    ...state,
    favorites: has ? state.favorites.filter(w => w !== word) : [word, ...state.favorites],
  });
}

export function addCustomWord(word: CustomWord) {
  ensureLoaded();
  const result = customWordSchema.safeParse(word);
  if (!result.success) return;
  const validWord = result.data;
  if (state.customWords.some(w => w.word.toLowerCase() === validWord.word.toLowerCase())) return;
  setState({ ...state, customWords: [{ ...validWord, custom: true }, ...state.customWords] });
}

export function removeCustomWord(word: string) {
  ensureLoaded();
  setState({ ...state, customWords: state.customWords.filter(w => w.word !== word) });
}

export function recordHistory(word: string) {
  ensureLoaded();
  setState({ ...state, history: [word, ...state.history.filter(w => w !== word)].slice(0, 30) });
}

export function addCollection(name: string) {
  ensureLoaded();
  const trimmed = name.trim();
  if (!trimmed) return;
  setState({
    ...state,
    collections: [...state.collections, { id: `${Date.now()}-${trimmed}`, name: trimmed, words: [] }],
  });
}

export function removeCollection(id: string) {
  ensureLoaded();
  setState({ ...state, collections: state.collections.filter(c => c.id !== id) });
}

export function toggleWordInCollection(id: string, word: string) {
  ensureLoaded();
  setState({
    ...state,
    collections: state.collections.map(c =>
      c.id === id
        ? { ...c, words: c.words.includes(word) ? c.words.filter(w => w !== word) : [...c.words, word] }
        : c,
    ),
  });
}
