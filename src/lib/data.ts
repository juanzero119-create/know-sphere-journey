export type Q = { prompt: string; answer: string; options: string[]; note?: string };

export type PartOfSpeech = "noun" | "pronoun" | "verb" | "adjective" | "adverb";

export const partsOfSpeech: { pos: PartOfSpeech; meaning: string; example: string }[] = [
  { pos: "noun", meaning: "Names a person, place, thing, or idea.", example: "The eclipse was a spectacle." },
  { pos: "pronoun", meaning: "Stands in for a noun.", example: "She gave her answer quickly." },
  { pos: "verb", meaning: "Shows an action or a state of being.", example: "Kids recover quickly from setbacks." },
  { pos: "adjective", meaning: "Describes or limits a noun.", example: "A meticulous editor checked every page." },
  { pos: "adverb", meaning: "Describes a verb, adjective, or another adverb.", example: "She answered remarkably candidly." },
];

export const words: { word: string; meaning: string; example: string; pos: PartOfSpeech; synonym?: string }[] = [
  { word: "Forgo", meaning: "To give up or go without something", example: "She decided to forgo dessert.", pos: "verb", synonym: "Abstain" },
  { word: "Egocentric", meaning: "Self-centered; viewing everything from your own angle", example: "An egocentric boss rarely listens.", pos: "adjective", synonym: "Self-absorbed" },
  { word: "Contemplating", meaning: "Thinking about something deeply and at length", example: "He was contemplating a career change.", pos: "verb", synonym: "Pondering" },
  { word: "Denigrate", meaning: "To unfairly criticize or belittle someone", example: "Rivals denigrated her breakthrough.", pos: "verb", synonym: "Belittle" },
  { word: "Tantamount", meaning: "Practically the same as something, usually bad", example: "His silence was tantamount to an admission.", pos: "adjective", synonym: "Equivalent" },
  { word: "Itinerant", meaning: "Traveling from place to place, often for work", example: "An itinerant preacher visited weekly.", pos: "adjective", synonym: "Nomadic" },
  { word: "Eminent", meaning: "Famous, respected and skilled in a field", example: "An eminent surgeon gave the lecture.", pos: "adjective", synonym: "Distinguished" },
  { word: "Rudimentary", meaning: "Basic; at the earliest stage of development", example: "He has a rudimentary grasp of Italian.", pos: "adjective", synonym: "Basic" },
  { word: "Derivative", meaning: "Lacking originality; copied from something else", example: "Critics called the sequel derivative.", pos: "adjective", synonym: "Unoriginal" },
  { word: "Immutable", meaning: "Unchanging forever", example: "The laws of physics are immutable.", pos: "adjective", synonym: "Permanent" },
  { word: "Intangible", meaning: "Impossible to touch or grasp physically", example: "Trust is an intangible asset.", pos: "adjective", synonym: "Untouchable" },
  { word: "Gratuitous", meaning: "Uncalled-for; without good reason", example: "The film was full of gratuitous violence.", pos: "adjective", synonym: "Unwarranted" },
  { word: "Opaque", meaning: "Not transparent; hard to understand", example: "The report was deliberately opaque.", pos: "adjective", synonym: "Unclear" },
  { word: "Figurative", meaning: "Not literal; using figures of speech", example: "“Busy as a bee” is figurative language.", pos: "adjective", synonym: "Metaphorical" },
  { word: "Unravel", meaning: "To come apart, or to solve something tangled", example: "The detective began to unravel the plot.", pos: "verb", synonym: "Untangle" },
  { word: "Impeccable", meaning: "Without any faults; flawless", example: "Her manners were impeccable.", pos: "adjective", synonym: "Faultless" },
  { word: "Asinine", meaning: "Extremely silly or foolish", example: "An asinine excuse fooled no one.", pos: "adjective", synonym: "Foolish" },
  { word: "Reputable", meaning: "Having a good reputation", example: "Buy only from a reputable dealer.", pos: "adjective", synonym: "Trustworthy" },
  { word: "Indubitable", meaning: "Impossible to doubt; completely certain", example: "The fingerprint was indubitable proof.", pos: "adjective", synonym: "Undeniable" },
  { word: "Indolent", meaning: "Habitually lazy; avoiding effort", example: "An indolent afternoon by the pool.", pos: "adjective", synonym: "Lazy" },
  { word: "Animosity", meaning: "Strong hostility or resentment", example: "Old animosity divided the two families.", pos: "noun", synonym: "Hostility" },
  { word: "Exacerbate", meaning: "To make a problem or feeling worse", example: "Loud neighbors exacerbate his stress.", pos: "verb", synonym: "Worsen" },
  { word: "Reminiscing", meaning: "Recalling past events fondly", example: "They spent the evening reminiscing.", pos: "verb", synonym: "Recalling" },
  { word: "Accede", meaning: "To agree to a demand or request", example: "The board acceded to the terms.", pos: "verb", synonym: "Consent" },
  { word: "Acculturate", meaning: "To adopt the customs of another culture", example: "Immigrants acculturate over generations.", pos: "verb", synonym: "Assimilate" },
  { word: "Audacious", meaning: "Boldly daring, even reckless", example: "An audacious daylight robbery.", pos: "adjective", synonym: "Daring" },
  { word: "Dogmatic", meaning: "Asserting opinions as unarguable facts", example: "A dogmatic boss brooked no debate.", pos: "adjective", synonym: "Opinionated" },
  { word: "Meticulous", meaning: "Extremely careful about small details", example: "Meticulous notes made the audit easy.", pos: "adjective", synonym: "Thorough" },
  { word: "Conspicuous", meaning: "Easily seen; standing out", example: "His red coat was conspicuous in the crowd.", pos: "adjective", synonym: "Noticeable" },
  { word: "Cryptic", meaning: "Mysterious; with hidden meaning", example: "She left a cryptic note.", pos: "adjective", synonym: "Enigmatic" },
  { word: "Obligation", meaning: "A duty or commitment you must fulfill", example: "Paying taxes is an obligation.", pos: "noun", synonym: "Duty" },
  { word: "Tenacious", meaning: "Holding firmly on; refusing to give up", example: "A tenacious lawyer pursued the case.", pos: "adjective", synonym: "Persistent" },
  { word: "Magnanimous", meaning: "Generous, especially toward a rival", example: "The magnanimous winner praised her opponent.", pos: "adjective", synonym: "Generous" },
  { word: "Abstain", meaning: "To choose not to do or take something", example: "He abstained from the final vote.", pos: "verb", synonym: "Refrain" },
  { word: "Vilify", meaning: "To speak damagingly of someone; defame", example: "The press vilified the senator.", pos: "verb", synonym: "Defame" },
  { word: "Insidious", meaning: "Harmful in a gradual, sneaky way", example: "An insidious rumor spread through the office.", pos: "adjective", synonym: "Treacherous" },
  { word: "Superfluous", meaning: "More than is needed; unnecessary", example: "Delete the superfluous paragraphs.", pos: "adjective", synonym: "Unnecessary" },
  { word: "Spectacle", meaning: "An impressive or dramatic sight", example: "The eclipse was a stunning spectacle.", pos: "noun", synonym: "Display" },
  { word: "Juxtapose", meaning: "To place side by side for contrast", example: "The exhibit juxtaposes old and new art.", pos: "verb", synonym: "Contrast" },
  { word: "Advocating", meaning: "Publicly supporting or recommending", example: "She is advocating for cleaner energy.", pos: "verb", synonym: "Supporting" },
  { word: "Controversial", meaning: "Causing public disagreement", example: "A controversial new policy split the town.", pos: "adjective", synonym: "Divisive" },
  { word: "Covet", meaning: "To want something that belongs to another", example: "He coveted his neighbor’s vintage car.", pos: "verb", synonym: "Envy" },
  { word: "Belligerent", meaning: "Hostile and ready to fight", example: "A belligerent customer demanded a refund.", pos: "adjective", synonym: "Aggressive" },
  { word: "Circumvent", meaning: "To find a way around a rule or obstacle", example: "They circumvented the security check.", pos: "verb", synonym: "Bypass" },
  { word: "Ameliorate", meaning: "To make something bad better", example: "New roads ameliorated the traffic.", pos: "verb", synonym: "Improve" },
  { word: "Incongruent", meaning: "Not matching; out of place", example: "His cheerful tone felt incongruent with the news.", pos: "adjective", synonym: "Mismatched" },
  { word: "Auspicious", meaning: "Favorable; promising success", example: "They chose an auspicious date for the wedding.", pos: "adjective", synonym: "Promising" },
  { word: "Oblivious", meaning: "Unaware of what is happening around you", example: "He was oblivious to the commotion.", pos: "adjective", synonym: "Unaware" },
  { word: "Lethal", meaning: "Able to cause death", example: "A lethal dose of the toxin.", pos: "adjective", synonym: "Deadly" },
  { word: "Fornication", meaning: "Sexual relations between people not married to each other", example: "Old statutes once punished fornication.", pos: "noun" },
  { word: "Peruse", meaning: "To read or examine carefully", example: "She perused the contract before signing.", pos: "verb", synonym: "Study" },
  { word: "Condone", meaning: "To accept or overlook wrongdoing", example: "The school does not condone cheating.", pos: "verb", synonym: "Overlook" },
  { word: "Coherent", meaning: "Logical, consistent and clearly organized", example: "A coherent argument won the debate.", pos: "adjective", synonym: "Logical" },
  { word: "Callous", meaning: "Unfeeling toward others’ suffering", example: "A callous remark about the layoffs.", pos: "adjective", synonym: "Heartless" },
  { word: "Diligent", meaning: "Working carefully and steadily", example: "A diligent student finished early.", pos: "adjective", synonym: "Hardworking" },
  { word: "Pragmatic", meaning: "Dealing with things in a practical way", example: "A pragmatic fix saved time and money.", pos: "adjective", synonym: "Practical" },
  { word: "Forthcoming", meaning: "Willing to give information or help", example: "He wasn’t forthcoming with the facts.", pos: "adjective", synonym: "Candid" },
  { word: "Bureaucrat", meaning: "An official who works through fixed rules and paperwork", example: "A bureaucrat buried the application in forms.", pos: "noun", synonym: "Functionary" },
  { word: "Charlatan", meaning: "A fake expert who pretends to have special skill or knowledge", example: "The miracle cure was sold by a charlatan.", pos: "noun", synonym: "Fraud" },

  { word: "Puerile", meaning: "Childishly silly; immature", example: "Puerile jokes disrupted the meeting.", pos: "adjective", synonym: "Immature" },
  { word: "Vindicate", meaning: "To clear of blame or prove right", example: "The appeal vindicated the defendant.", pos: "verb", synonym: "Exonerate" },
  { word: "Demagogue", meaning: "A leader who stirs people up with emotions and prejudice", example: "The demagogue blamed every woe on outsiders.", pos: "noun", synonym: "Rabble-rouser" },
  { word: "Dilettante", meaning: "A dabbler with only a superficial interest", example: "A dilettante with no real training.", pos: "noun", synonym: "Amateur" },
  { word: "Cynical", meaning: "Distrustful of people’s motives", example: "She was cynical about the charity’s motives.", pos: "adjective", synonym: "Skeptical" },
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
