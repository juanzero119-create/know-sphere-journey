import { words, type Q } from "./data";

function shuffle<T>(a: T[]) {
  return [...a].sort(() => Math.random() - 0.5);
}

const pick = (n: number) => shuffle(words).slice(0, n);
const wordOptions = (w: (typeof words)[number]) =>
  shuffle([w.word, ...shuffle(words.filter((x) => x !== w)).slice(0, 3).map((x) => x.word)]);
const meaningOptions = (w: (typeof words)[number]) =>
  shuffle([w.meaning, ...shuffle(words.filter((x) => x !== w)).slice(0, 3).map((x) => x.meaning)]);
const synonymOptions = (w: (typeof words)[number]) =>
  shuffle([w.synonym, ...shuffle(words.filter((x) => x !== w)).slice(0, 3).map((x) => x.synonym)]);

/** Show the meaning, pick the word. */
export function guessTheWord(n = 6): Q[] {
  return pick(n).map((w) => ({
    prompt: `Which word means “${w.meaning}”?`,
    answer: w.word,
    options: wordOptions(w),
    note: `“${w.example}”`,
  }));
}

/** Show the word, pick the meaning. */
export function meaningMatch(n = 6): Q[] {
  return pick(n).map((w) => ({
    prompt: `What does “${w.word}” mean?`,
    answer: w.meaning,
    options: meaningOptions(w),
    note: `“${w.example}”`,
  }));
}

/** Example sentence with the word blanked out. */
export function fillInTheGap(n = 6): Q[] {
  return pick(n).map((w) => ({
    prompt: w.example.replace(new RegExp(w.word, "i"), "_____"),
    answer: w.word,
    options: wordOptions(w),
    note: w.meaning,
  }));
}

/** Show the word, pick its synonym. */
export function matchSynonyms(n = 6): Q[] {
  return pick(n).map((w) => ({
    prompt: `Which word is closest to “${w.word}”?`,
    answer: w.synonym,
    options: synonymOptions(w),
    note: w.meaning,
  }));
}

/** A mix of every game. */
export function gameShuffle(n = 8): Q[] {
  const games = [guessTheWord, meaningMatch, fillInTheGap, matchSynonyms];
  return shuffle(games.flatMap((g) => g(Math.ceil(n / games.length)))).slice(0, n);
}

export type WordCategory = { name: string; words: { word: string; meaning: string; example: string }[] };

export const categories: WordCategory[] = [
  {
    name: "Business",
    words: [
      { word: "Revenue", meaning: "Income a company earns", example: "Revenue grew this quarter." },
      { word: "Leverage", meaning: "Using something to maximum advantage", example: "She used her leverage in the deal." },
      { word: "Equity", meaning: "Ownership value in a company", example: "He owns equity in the startup." },
      { word: "Turnover", meaning: "The rate staff leave and are replaced", example: "High turnover hurts morale." },
      { word: "Forecast", meaning: "A prediction of future results", example: "The forecast looks strong." },
    ],
  },
  {
    name: "Emotions",
    words: [
      { word: "Euphoria", meaning: "Intense happiness", example: "She felt euphoria after the win." },
      { word: "Melancholy", meaning: "A gentle, lingering sadness", example: "The song filled him with melancholy." },
      { word: "Serene", meaning: "Calm and peaceful", example: "A serene morning by the lake." },
      { word: "Anxious", meaning: "Worried and uneasy", example: "He felt anxious before the exam." },
      { word: "Content", meaning: "Quietly satisfied", example: "She was content with a simple life." },
    ],
  },
  {
    name: "Society",
    words: [
      { word: "Community", meaning: "A group of people living or working together", example: "The community built a garden." },
      { word: "Culture", meaning: "The customs and arts of a group", example: "Food is a big part of the culture." },
      { word: "Tradition", meaning: "A custom passed down over time", example: "It is a family tradition." },
      { word: "Inequality", meaning: "An unfair difference in opportunity or wealth", example: "They campaigned against inequality." },
      { word: "Citizen", meaning: "A legal member of a country", example: "Every citizen can vote." },
    ],
  },
];

export function categoryQuiz(name: string, n = 5): Q[] {
  const cat = categories.find((c) => c.name === name);
  if (!cat) return [];
  return shuffle(cat.words)
    .slice(0, n)
    .map((w) => ({
      prompt: `What does “${w.word}” mean?`,
      answer: w.meaning,
      options: shuffle([w.meaning, ...shuffle(cat.words.filter((x) => x !== w)).slice(0, 3).map((x) => x.meaning)]),
      note: `“${w.example}”`,
    }));
}
