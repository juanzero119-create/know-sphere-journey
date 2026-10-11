import { describe, expect, it } from "vitest";
import { categories, categoryQuiz, fillInTheGap, gameShuffle, guessTheWord, matchSynonyms, meaningMatch } from "@/lib/word-games";
import { words } from "@/lib/data";

describe("word games", () => {
  it("every word has a part of speech and a synonym", () => {
    for (const w of words) {
      expect(w.pos).toBeTruthy();
      expect(w.synonym).toBeTruthy();
    }
  });

  it("guess the word asks meaning -> word", () => {
    const qs = guessTheWord(6);
    expect(qs).toHaveLength(6);
    for (const q of qs) {
      expect(q.options).toContain(q.answer);
      expect(words.some((w) => w.word === q.answer)).toBe(true);
    }
  });

  it("meaning match asks word -> meaning", () => {
    for (const q of meaningMatch(6)) {
      expect(words.some((w) => w.meaning === q.answer)).toBe(true);
    }
  });

  it("fill in the gap blanks the word in the example", () => {
    for (const q of fillInTheGap(6)) {
      expect(q.prompt).toContain("_____");
      expect(q.prompt).not.toContain(q.answer);
    }
  });

  it("match synonyms answers with a real synonym", () => {
    for (const q of matchSynonyms(6)) {
      expect(words.some((w) => w.synonym === q.answer)).toBe(true);
    }
  });

  it("game shuffle mixes games", () => {
    expect(gameShuffle(8)).toHaveLength(8);
  });

  it("categories quiz from their own word bank", () => {
    expect(categories.length).toBeGreaterThanOrEqual(3);
    for (const c of categories) {
      const qs = categoryQuiz(c.name);
      expect(qs.length).toBeGreaterThan(0);
      for (const q of qs) expect(c.words.some((w) => w.meaning === q.answer)).toBe(true);
    }
  });
});
