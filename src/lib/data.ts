export type Q = { prompt: string; answer: string; options: string[]; note?: string };

export const words: { word: string; meaning: string; example: string }[] = [
  { word: "Ephemeral", meaning: "Lasting a very short time", example: "The ephemeral beauty of a sunset." },
  { word: "Ubiquitous", meaning: "Found everywhere", example: "Phones are ubiquitous today." },
  { word: "Candid", meaning: "Truthful and straightforward", example: "She gave a candid answer." },
  { word: "Resilient", meaning: "Able to recover quickly", example: "Kids are remarkably resilient." },
  { word: "Meticulous", meaning: "Very careful and precise", example: "A meticulous editor." },
  { word: "Lethargic", meaning: "Sluggish and lacking energy", example: "The heat made us lethargic." },
  { word: "Benevolent", meaning: "Kind and well-meaning", example: "A benevolent ruler." },
  { word: "Pragmatic", meaning: "Dealing with things practically", example: "A pragmatic solution." },
];

export const anatomy: { part: string; system: string; fact: string }[] = [
  { part: "Femur", system: "Skeletal", fact: "The longest and strongest bone in the body." },
  { part: "Frontal bone", system: "Skeletal", fact: "Forms the forehead and roof of the eye sockets." },
  { part: "Left ventricle", system: "Cardiovascular", fact: "Pumps oxygen-rich blood to the whole body." },
  { part: "Alveoli", system: "Respiratory", fact: "Tiny air sacs where gas exchange happens." },
  { part: "Hippocampus", system: "Nervous", fact: "Key brain region for forming memories." },
  { part: "Biceps brachii", system: "Muscular", fact: "Flexes the elbow and rotates the forearm." },
  { part: "Liver", system: "Digestive", fact: "Filters blood and produces bile." },
  { part: "Nephron", system: "Urinary", fact: "The filtering unit of the kidney." },
];

function shuffle<T>(a: T[]) { return [...a].sort(() => Math.random() - 0.5); }

export function buildQuiz(kind: "words" | "anatomy" | "mixed", n = 6): Q[] {
  const w: Q[] = words.map((x) => ({
    prompt: `What does “${x.word}” mean?`,
    answer: x.meaning,
    options: shuffle([x.meaning, ...shuffle(words.filter((y) => y !== x)).slice(0, 3).map((y) => y.meaning)]),
    note: x.example,
  }));
  const a: Q[] = anatomy.map((x) => ({
    prompt: x.fact.replace(/^The |^A |^Key |^Tiny |^Forms |^Pumps |^Filters |^Flexes /, (m) => m) + " Which part is this?",
    answer: x.part,
    options: shuffle([x.part, ...shuffle(anatomy.filter((y) => y !== x)).slice(0, 3).map((y) => y.part)]),
    note: `${x.system} system`,
  }));
  const pool = kind === "words" ? w : kind === "anatomy" ? a : [...w, ...a];
  return shuffle(pool).slice(0, n);
}

export type Video = { id: string; title: string; channel: string; topic: "Anatomy" | "Words" | "Film"; year: number; rating: number };

export const videos: Video[] = [
  { id: "uBGl2BujkPQ", title: "Introduction to Anatomy & Physiology", channel: "CrashCourse", topic: "Anatomy", year: 2015, rating: 8.9 },
  { id: "uBGl2BujkPQ", title: "How the Heart Pumps Blood", channel: "Study Hall", topic: "Anatomy", year: 2021, rating: 8.4 },
  { id: "uBGl2BujkPQ", title: "50 Words That Make You Sound Smart", channel: "Word Nerd", topic: "Words", year: 2023, rating: 7.8 },
  { id: "uBGl2BujkPQ", title: "The Science of Memory", channel: "Brain Lab", topic: "Anatomy", year: 2022, rating: 8.7 },
  { id: "uBGl2BujkPQ", title: "Greatest Film Openings, Explained", channel: "Cine Notes", topic: "Film", year: 2024, rating: 9.1 },
  { id: "uBGl2BujkPQ", title: "Etymology of Everyday Words", channel: "Word Nerd", topic: "Words", year: 2020, rating: 8.1 },
];
