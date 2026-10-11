export type Q = { prompt: string; answer: string; options: string[]; note?: string };

export type PartOfSpeech = "noun" | "pronoun" | "verb" | "adjective" | "adverb";

export const partsOfSpeech: { pos: PartOfSpeech; meaning: string; example: string }[] = [
  { pos: "noun", meaning: "Names a person, place, thing, or idea.", example: "The sunset glowed over the harbor." },
  { pos: "pronoun", meaning: "Stands in for a noun.", example: "She gave her answer quickly." },
  { pos: "verb", meaning: "Shows an action or a state of being.", example: "Kids recover quickly from setbacks." },
  { pos: "adjective", meaning: "Describes or limits a noun.", example: "A meticulous editor checked every page." },
  { pos: "adverb", meaning: "Describes a verb, adjective, or another adverb.", example: "She answered remarkably candidly." },
];

export const words: { word: string; meaning: string; example: string; pos: PartOfSpeech; synonym: string }[] = [
  { word: "Ephemeral", synonym: "Fleeting", meaning: "Lasting a very short time", example: "The ephemeral beauty of a sunset.", pos: "adjective" },
  { word: "Ubiquitous", synonym: "Omnipresent", meaning: "Found everywhere", example: "Phones are ubiquitous today.", pos: "adjective" },
  { word: "Candid", synonym: "Frank", meaning: "Truthful and straightforward", example: "She gave a candid answer.", pos: "adjective" },
  { word: "Resilient", synonym: "Tough", meaning: "Able to recover quickly", example: "Kids are remarkably resilient.", pos: "adjective" },
  { word: "Meticulous", synonym: "Thorough", meaning: "Very careful and precise", example: "A meticulous editor.", pos: "adjective" },
  { word: "Lethargic", synonym: "Sluggish", meaning: "Sluggish and lacking energy", example: "The heat made us lethargic.", pos: "adjective" },
  { word: "Benevolent", synonym: "Charitable", meaning: "Kind and well-meaning", example: "A benevolent ruler.", pos: "adjective" },
  { word: "Pragmatic", synonym: "Practical", meaning: "Dealing with things practically", example: "A pragmatic solution.", pos: "adjective" },
  { word: "Serendipity", synonym: "Chance", meaning: "A happy discovery made by accident", example: "Meeting her was pure serendipity.", pos: "noun" },
  { word: "Candor", synonym: "Honesty", meaning: "The quality of being open and honest", example: "He spoke with refreshing candor.", pos: "noun" },
  { word: "Resilience", synonym: "Toughness", meaning: "The ability to recover from difficulty", example: "Her resilience inspired the team.", pos: "noun" },
  { word: "Whoever", synonym: "Anyone", meaning: "Any person who; no matter who", example: "Whoever finishes first wins.", pos: "pronoun" },
  { word: "Itself", synonym: "Oneself", meaning: "Refers back to the subject", example: "The door closed itself.", pos: "pronoun" },
  { word: "Persevere", synonym: "Persist", meaning: "To keep going despite difficulty", example: "Persevere through the hard days.", pos: "verb" },
  { word: "Clarify", synonym: "Explain", meaning: "To make something clear", example: "Let me clarify the rules.", pos: "verb" },
  { word: "Wander", synonym: "Roam", meaning: "To move without a fixed course", example: "We wandered through the old town.", pos: "verb" },
  { word: "Quickly", synonym: "Rapidly", meaning: "At a fast speed", example: "She answered quickly.", pos: "adverb" },
  { word: "Remarkably", synonym: "Notably", meaning: "In a way worth noticing", example: "The test was remarkably easy.", pos: "adverb" },
  { word: "Gently", synonym: "Softly", meaning: "In a soft, careful way", example: "He spoke gently to the child.", pos: "adverb" },
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
