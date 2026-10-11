import type { LucideIcon } from "lucide-react";
import {
  Palette, BookOpen, MessagesSquare, Users, Briefcase, Plane,
  GraduationCap, Landmark, Scroll, Omega, Languages, Smile,
  PersonStanding, Fingerprint, Sparkles, Scale, Zap,
  Heart, FolderHeart, PenLine, History,
} from "lucide-react";
import type { PartOfSpeech } from "@/lib/data";

export type TopicWord = {
  word: string;
  meaning: string;
  example: string;
  pos: PartOfSpeech;
  synonym?: string | undefined;
};

export type Topic = {
  id: string;
  label: string;
  icon: LucideIcon;
  blurb: string;
  words: TopicWord[];
  /** When set, the tile filters the main word library by this part of speech. */
  pos?: PartOfSpeech;
};

export type TopicGroup = { id: string; title: string; topics: Topic[] };

const w = (word: string, meaning: string, example: string, pos: PartOfSpeech, synonym?: string): TopicWord =>
  ({ word, meaning, example, pos, synonym });

export const topicGroups: TopicGroup[] = [
  {
    id: "ourselves",
    title: "About ourselves",
    topics: [
      {
        id: "emotions", label: "Emotions", icon: Smile, blurb: "Words for what we feel.",
        words: [
          w("Animosity", "Strong hostility or resentment", "Old animosity divided the two families.", "noun", "Hostility"),
          w("Reminiscing", "Recalling past events fondly", "They spent the evening reminiscing.", "verb", "Recalling"),
          w("Covet", "To want something that belongs to another", "He coveted his neighbor’s vintage car.", "verb", "Envy"),
          w("Contemplating", "Thinking about something deeply and at length", "He was contemplating a career change.", "verb", "Pondering"),
          w("Cynical", "Distrustful of people’s motives", "She was cynical about the charity’s motives.", "adjective", "Skeptical"),
        ],
      },
      {
        id: "personality", label: "Personality", icon: Fingerprint, blurb: "Words for who we are.",
        words: [
          w("Egocentric", "Self-centered; viewing everything from your own angle", "An egocentric boss rarely listens.", "adjective", "Self-absorbed"),
          w("Dogmatic", "Asserting opinions as unarguable facts", "A dogmatic boss brooked no debate.", "adjective", "Opinionated"),
          w("Callous", "Unfeeling toward others’ suffering", "A callous remark about the layoffs.", "adjective", "Heartless"),
          w("Magnanimous", "Generous, especially toward a rival", "The magnanimous winner praised her opponent.", "adjective", "Generous"),
          w("Oblivious", "Unaware of what is happening around you", "He was oblivious to the commotion.", "adjective", "Unaware"),
        ],
      },
      {
        id: "character", label: "Character", icon: PersonStanding, blurb: "Words for how we act.",
        words: [
          w("Tenacious", "Holding firmly on; refusing to give up", "A tenacious lawyer pursued the case.", "adjective", "Persistent"),
          w("Diligent", "Working carefully and steadily", "A diligent student finished early.", "adjective", "Hardworking"),
          w("Indolent", "Habitually lazy; avoiding effort", "An indolent afternoon by the pool.", "adjective", "Lazy"),
          w("Audacious", "Boldly daring, even reckless", "An audacious daylight robbery.", "adjective", "Daring"),
          w("Puerile", "Childishly silly; immature", "Puerile jokes disrupted the meeting.", "adjective", "Immature"),
        ],
      },
    ],
  },
  {
    id: "pos",
    title: "By parts of speech",
    topics: [
      { id: "verbs", label: "Verbs", icon: Zap, blurb: "Action and being words.", pos: "verb", words: [] },
      { id: "nouns", label: "Nouns", icon: BookOpen, blurb: "People, places, things, ideas.", pos: "noun", words: [] },
      { id: "adjectives", label: "Adjectives", icon: Sparkles, blurb: "Words that describe.", pos: "adjective", words: [] },
    ],
  },
  {
    id: "culture",
    title: "Culture",
    topics: [
      {
        id: "society", label: "Society", icon: Users, blurb: "Words about communities.",
        words: [
          w("Demagogue", "A leader who stirs people up with emotions and prejudice", "The demagogue blamed every woe on outsiders.", "noun", "Rabble-rouser"),
          w("Advocating", "Publicly supporting or recommending", "She is advocating for cleaner energy.", "verb", "Supporting"),
          w("Controversial", "Causing public disagreement", "A controversial new policy split the town.", "adjective", "Divisive"),
          w("Belligerent", "Hostile and ready to fight", "A belligerent customer demanded a refund.", "adjective", "Aggressive"),
          w("Condone", "To accept or overlook wrongdoing", "The school does not condone cheating.", "verb", "Overlook"),
        ],
      },
      {
        id: "talking", label: "Talking", icon: MessagesSquare, blurb: "Words for conversation.",
        words: [
          w("Coherent", "Logical, consistent and clearly organized", "A coherent argument won the debate.", "adjective", "Logical"),
          w("Cryptic", "Mysterious; with hidden meaning", "She left a cryptic note.", "adjective", "Enigmatic"),
          w("Forthcoming", "Willing to give information or help", "He wasn’t forthcoming with the facts.", "adjective", "Candid"),
          w("Denigrate", "To unfairly criticize or belittle someone", "Rivals denigrated her breakthrough.", "verb", "Belittle"),
          w("Vilify", "To speak damagingly of someone; defame", "The press vilified the senator.", "verb", "Defame"),
        ],
      },
      {
        id: "literature", label: "Literature", icon: BookOpen, blurb: "Words for books and stories.",
        words: [
          w("Figurative", "Not literal; using figures of speech", "“Busy as a bee” is figurative language.", "adjective", "Metaphorical"),
          w("Derivative", "Lacking originality; copied from something else", "Critics called the sequel derivative.", "adjective", "Unoriginal"),
          w("Opaque", "Not transparent; hard to understand", "The report was deliberately opaque.", "adjective", "Unclear"),
          w("Juxtapose", "To place side by side for contrast", "The exhibit juxtaposes old and new art.", "verb", "Contrast"),
          w("Unravel", "To come apart, or to solve something tangled", "The detective began to unravel the plot.", "verb", "Untangle"),
        ],
      },
      {
        id: "art", label: "Art", icon: Palette, blurb: "Words for judging what we make.",
        words: [
          w("Spectacle", "An impressive or dramatic sight", "The eclipse was a stunning spectacle.", "noun", "Display"),
          w("Conspicuous", "Easily seen; standing out", "His red coat was conspicuous in the crowd.", "adjective", "Noticeable"),
          w("Gratuitous", "Uncalled-for; without good reason", "The film was full of gratuitous violence.", "adjective", "Unwarranted"),
          w("Impeccable", "Without any faults; flawless", "Her manners were impeccable.", "adjective", "Faultless"),
          w("Incongruent", "Not matching; out of place", "His cheerful tone felt incongruent with the news.", "adjective", "Mismatched"),
        ],
      },
    ],
  },
  {
    id: "level",
    title: "By level",
    topics: [
      {
        id: "foundation", label: "Foundation", icon: GraduationCap, blurb: "Core words to know.",
        words: [
          w("Lethal", "Able to cause death", "A lethal dose of the toxin.", "adjective", "Deadly"),
          w("Obligation", "A duty or commitment you must fulfill", "Paying taxes is an obligation.", "noun", "Duty"),
          w("Reputable", "Having a good reputation", "Buy only from a reputable dealer.", "adjective", "Trustworthy"),
          w("Forgo", "To give up or go without something", "She decided to forgo dessert.", "verb", "Abstain"),
        ],
      },
      {
        id: "intermediate", label: "Intermediate", icon: GraduationCap, blurb: "Step up your vocabulary.",
        words: [
          w("Eminent", "Famous, respected and skilled in a field", "An eminent surgeon gave the lecture.", "adjective", "Distinguished"),
          w("Auspicious", "Favorable; promising success", "They chose an auspicious date for the wedding.", "adjective", "Promising"),
          w("Accede", "To agree to a demand or request", "The board acceded to the terms.", "verb", "Consent"),
          w("Ameliorate", "To make something bad better", "New roads ameliorated the traffic.", "verb", "Improve"),
          w("Exacerbate", "To make a problem or feeling worse", "Loud neighbors exacerbate his stress.", "verb", "Worsen"),
        ],
      },
      {
        id: "advanced", label: "Advanced", icon: GraduationCap, blurb: "Words that impress.",
        words: [
          w("Tantamount", "Practically the same as something, usually bad", "His silence was tantamount to an admission.", "adjective", "Equivalent"),
          w("Indubitable", "Impossible to doubt; completely certain", "The fingerprint was indubitable proof.", "adjective", "Undeniable"),
          w("Immutable", "Unchanging forever", "The laws of physics are immutable.", "adjective", "Permanent"),
          w("Insidious", "Harmful in a gradual, sneaky way", "An insidious rumor spread through the office.", "adjective", "Treacherous"),
          w("Dilettante", "A dabbler with only a superficial interest", "A dilettante with no real training.", "noun", "Amateur"),
        ],
      },
    ],
  },
  {
    id: "lexicon",
    title: "Lexicon",
    topics: [
      {
        id: "distinctive", label: "Distinctive words", icon: Sparkles, blurb: "Words with character.",
        words: [
          w("Rudimentary", "Basic; at the earliest stage of development", "He has a rudimentary grasp of Italian.", "adjective", "Basic"),
          w("Superfluous", "More than is needed; unnecessary", "Delete the superfluous paragraphs.", "adjective", "Unnecessary"),
          w("Intangible", "Impossible to touch or grasp physically", "Trust is an intangible asset.", "adjective", "Untouchable"),
          w("Asinine", "Extremely silly or foolish", "An asinine excuse fooled no one.", "adjective", "Foolish"),
        ],
      },
      {
        id: "legal", label: "Legal terms", icon: Scale, blurb: "Words from law.",
        words: [
          w("Vindicate", "To clear of blame or prove right", "The appeal vindicated the defendant.", "verb", "Exonerate"),
          w("Circumvent", "To find a way around a rule or obstacle", "They circumvented the security check.", "verb", "Bypass"),
          w("Abstain", "To choose not to do or take something", "He abstained from the final vote.", "verb", "Refrain"),
          w("Peruse", "To read or examine carefully", "She perused the contract before signing.", "verb", "Study"),
          w("Fornication", "Sexual relations between people not married to each other", "Old statutes once punished fornication.", "noun"),
        ],
      },
    ],
  },
  {
    id: "world",
    title: "The world around us",
    topics: [
      {
        id: "business", label: "Business", icon: Briefcase, blurb: "Words for work and trade.",
        words: [
          w("Bureaucratic charlatan", "A fake expert hiding behind official procedure", "A bureaucratic charlatan sold worthless permits.", "noun", "Fraud"),
          w("Pragmatic", "Dealing with things in a practical way", "A pragmatic fix saved time and money.", "adjective", "Practical"),
          w("Meticulous", "Extremely careful about small details", "Meticulous notes made the audit easy.", "adjective", "Thorough"),
          w("Acculturate", "To adopt the customs of another culture", "Immigrants acculturate over generations.", "verb", "Assimilate"),
        ],
      },
      {
        id: "travel", label: "Travel", icon: Plane, blurb: "Words for journeys.",
        words: [
          w("Itinerant", "Traveling from place to place, often for work", "An itinerant preacher visited weekly.", "adjective", "Nomadic"),
        ],
      },
    ],
  },
  {
    id: "test",
    title: "By test",
    topics: [
      {
        id: "gre", label: "GRE", icon: GraduationCap, blurb: "Graduate admissions words.",
        words: [
          w("Tantamount", "Practically the same as something, usually bad", "His silence was tantamount to an admission.", "adjective", "Equivalent"),
          w("Indubitable", "Impossible to doubt; completely certain", "The fingerprint was indubitable proof.", "adjective", "Undeniable"),
          w("Insidious", "Harmful in a gradual, sneaky way", "An insidious rumor spread through the office.", "adjective", "Treacherous"),
          w("Magnanimous", "Generous, especially toward a rival", "The magnanimous winner praised her opponent.", "adjective", "Generous"),
          w("Dilettante", "A dabbler with only a superficial interest", "A dilettante with no real training.", "noun", "Amateur"),
        ],
      },
      {
        id: "sat", label: "SAT", icon: GraduationCap, blurb: "College admissions words.",
        words: [
          w("Meticulous", "Extremely careful about small details", "Meticulous notes made the audit easy.", "adjective", "Thorough"),
          w("Coherent", "Logical, consistent and clearly organized", "A coherent argument won the debate.", "adjective", "Logical"),
          w("Pragmatic", "Dealing with things in a practical way", "A pragmatic fix saved time and money.", "adjective", "Practical"),
          w("Controversial", "Causing public disagreement", "A controversial new policy split the town.", "adjective", "Divisive"),
          w("Oblivious", "Unaware of what is happening around you", "He was oblivious to the commotion.", "adjective", "Unaware"),
        ],
      },
    ],
  },
  {
    id: "origin",
    title: "By origin",
    topics: [
      {
        id: "french-root", label: "French root", icon: Landmark, blurb: "Words that came via French.",
        words: [
          w("Opaque", "Not transparent; hard to understand", "The report was deliberately opaque.", "adjective", "Unclear"),
          w("Bureaucratic charlatan", "A fake expert hiding behind official procedure", "A bureaucratic charlatan sold worthless permits.", "noun", "Fraud"),
        ],
      },
      {
        id: "latin-root", label: "Latin root", icon: Scroll, blurb: "Words from Latin.",
        words: [
          w("Denigrate", "To unfairly criticize or belittle someone", "Rivals denigrated her breakthrough.", "verb", "Belittle"),
          w("Immutable", "Unchanging forever", "The laws of physics are immutable.", "adjective", "Permanent"),
          w("Superfluous", "More than is needed; unnecessary", "Delete the superfluous paragraphs.", "adjective", "Unnecessary"),
          w("Circumvent", "To find a way around a rule or obstacle", "They circumvented the security check.", "verb", "Bypass"),
          w("Vindicate", "To clear of blame or prove right", "The appeal vindicated the defendant.", "verb", "Exonerate"),
        ],
      },
      {
        id: "greek-root", label: "Greek root", icon: Omega, blurb: "Words from Greek.",
        words: [
          w("Demagogue", "A leader who stirs people up with emotions and prejudice", "The demagogue blamed every woe on outsiders.", "noun", "Rabble-rouser"),
          w("Dogmatic", "Asserting opinions as unarguable facts", "A dogmatic boss brooked no debate.", "adjective", "Opinionated"),
          w("Cynical", "Distrustful of people’s motives", "She was cynical about the charity’s motives.", "adjective", "Skeptical"),
          w("Cryptic", "Mysterious; with hidden meaning", "She left a cryptic note.", "adjective", "Enigmatic"),
          w("Pragmatic", "Dealing with things in a practical way", "A pragmatic fix saved time and money.", "adjective", "Practical"),
        ],
      },
    ],
  },
  {
    id: "languages",
    title: "Languages",
    topics: [
      {
        id: "spanish", label: "Spanish words", icon: Languages, blurb: "Handy Spanish words.",
        words: [
          w("Hola", "Hello", "Hola, ¿cómo estás?", "noun", "hello"),
          w("Gracias", "Thank you", "Gracias por tu ayuda.", "noun", "thanks"),
          w("Amigo", "Friend", "Mi amigo vive cerca.", "noun", "friend"),
          w("Rápido", "Fast; quickly", "El tren es rápido.", "adjective", "fast"),
          w("Caminar", "To walk", "Vamos a caminar al parque.", "verb", "walk"),
        ],
      },
      {
        id: "french", label: "French words", icon: Languages, blurb: "Handy French words.",
        words: [
          w("Bonjour", "Hello; good day", "Bonjour, madame.", "noun", "hello"),
          w("Merci", "Thank you", "Merci beaucoup.", "noun", "thanks"),
          w("Maison", "House", "La maison est blanche.", "noun", "house"),
          w("Beau", "Beautiful (masculine)", "Un beau jardin.", "adjective", "beautiful"),
          w("Manger", "To eat", "Nous allons manger.", "verb", "eat"),
        ],
      },
      {
        id: "german", label: "German words", icon: Languages, blurb: "Handy German words.",
        words: [
          w("Hallo", "Hello", "Hallo, wie geht's?", "noun", "hello"),
          w("Danke", "Thank you", "Danke schön.", "noun", "thanks"),
          w("Haus", "House", "Das Haus ist groß.", "noun", "house"),
          w("Schnell", "Fast; quickly", "Das Auto ist schnell.", "adjective", "fast"),
          w("Gehen", "To go; to walk", "Wir gehen nach Hause.", "verb", "go"),
        ],
      },
    ],
  },
];

export const quickTiles = [
  { id: "favorites", label: "Favorites", icon: Heart, blurb: "Words you starred." },
  { id: "collections", label: "Collections", icon: FolderHeart, blurb: "Your saved word lists." },
  { id: "own-words", label: "Your own words", icon: PenLine, blurb: "Words you added." },
  { id: "history", label: "History", icon: History, blurb: "Words you recently opened." },
] as const;

export type QuickTileId = (typeof quickTiles)[number]["id"];

export function allTopics(): Topic[] {
  return topicGroups.flatMap(g => g.topics);
}

export function findTopic(id: string): Topic | undefined {
  return allTopics().find(t => t.id === id);
}
