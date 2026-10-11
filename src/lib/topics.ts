import type { LucideIcon } from "lucide-react";
import {
  Palette, Music, UtensilsCrossed, Sun, BookOpen, MessagesSquare, Soup, Users,
  Briefcase, Leaf, Plane, FlaskConical, Laptop, Globe, GraduationCap, SpellCheck,
  Landmark, Scroll, Castle, Omega, Languages, Smile, PersonStanding, Fingerprint,
  Sparkles, MessageCircle, Quote, Laugh, Scale, Stethoscope, Zap, Heart,
  FolderHeart, PenLine, History,
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
          w("Euphoria", "Intense happiness or excitement", "She felt euphoria after the win.", "noun", "elation"),
          w("Melancholy", "A deep, gentle sadness", "A melancholy song played softly.", "noun", "sorrow"),
          w("Anxious", "Worried about what may happen", "He felt anxious before the exam.", "adjective", "uneasy"),
          w("Serene", "Calm and peaceful", "Her serene smile eased the room.", "adjective", "tranquil"),
          w("Resent", "To feel bitterness toward", "They resented the unfair rule.", "verb", "begrudge"),
        ],
      },
      {
        id: "human-body", label: "Human body", icon: PersonStanding, blurb: "Words about the body.",
        words: [
          w("Posture", "The way you hold your body", "Good posture helps your back.", "noun", "stance"),
          w("Agile", "Able to move quickly and easily", "The agile dancer leapt high.", "adjective", "nimble"),
          w("Fatigue", "Extreme tiredness", "Fatigue set in after the hike.", "noun", "exhaustion"),
          w("Stretch", "To extend the body or limbs", "Stretch before you run.", "verb", "extend"),
          w("Vividly", "In a way that feels alive", "He vividly recalled the injury.", "adverb", "clearly"),
        ],
      },
      {
        id: "personality", label: "Personality", icon: Fingerprint, blurb: "Words for who we are.",
        words: [
          w("Gregarious", "Enjoying the company of others", "A gregarious host welcomed everyone.", "adjective", "sociable"),
          w("Introvert", "A person recharged by solitude", "The introvert preferred quiet evenings.", "noun"),
          w("Humble", "Not proud or arrogant", "She stayed humble after praise.", "adjective", "modest"),
          w("Stubborn", "Refusing to change your mind", "The stubborn mule would not move.", "adjective", "obstinate"),
          w("Empathize", "To share another's feelings", "I empathize with your loss.", "verb", "understand"),
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
          w("Civic", "Relating to a city or citizens", "Voting is a civic duty.", "adjective", "public"),
          w("Community", "A group living or working together", "The community built a garden.", "noun"),
          w("Norm", "A usual or expected behavior", "Queuing is a social norm.", "noun", "standard"),
          w("Unite", "To join together", "The crisis united the town.", "verb", "join"),
          w("Equally", "In the same measure", "They shared the work equally.", "adverb", "fairly"),
        ],
      },
      {
        id: "literature", label: "Literature", icon: BookOpen, blurb: "Words for books and stories.",
        words: [
          w("Metaphor", "A comparison without 'like' or 'as'", "'Time is a thief' is a metaphor.", "noun"),
          w("Protagonist", "The main character of a story", "The protagonist faces a dragon.", "noun", "hero"),
          w("Poignant", "Deeply moving or touching", "A poignant ending closed the novel.", "adjective", "moving"),
          w("Narrate", "To tell a story", "She narrates audiobooks.", "verb", "recount"),
          w("Ironically", "In an unexpected opposite way", "Ironically, the plumber's pipes leaked.", "adverb"),
        ],
      },
      {
        id: "talking", label: "Talking", icon: MessagesSquare, blurb: "Words for conversation.",
        words: [
          w("Eloquent", "Fluent and persuasive in speech", "An eloquent speech moved the crowd.", "adjective", "articulate"),
          w("Banter", "Playful, friendly teasing", "Their banter lightened the meeting.", "noun", "repartee"),
          w("Whisper", "To speak very softly", "Whisper the secret to me.", "verb", "murmur"),
          w("Blunt", "Direct to the point of rudeness", "His blunt reply surprised her.", "adjective", "brusque"),
          w("Briefly", "For a short time", "She spoke briefly with the mayor.", "adverb", "shortly"),
        ],
      },
      {
        id: "cuisine", label: "World cuisine", icon: Soup, blurb: "Words for food and cooking.",
        words: [
          w("Savor", "To enjoy food slowly", "Savor every bite of the stew.", "verb", "relish"),
          w("Cuisine", "A style of cooking", "Thai cuisine is famously spicy.", "noun"),
          w("Savory", "Salty or spicy rather than sweet", "A savory pie warmed the table.", "adjective"),
          w("Aroma", "A pleasant smell", "The aroma of bread filled the kitchen.", "noun", "scent"),
          w("Freshly", "Recently made or done", "Freshly baked rolls steamed.", "adverb", "newly"),
        ],
      },
      {
        id: "art", label: "Art", icon: Palette, blurb: "Words for creating and craft.",
        words: [
          w("Muse", "A source of inspiration", "The sea was her muse.", "noun"),
          w("Sketch", "A quick, rough drawing", "He made a sketch of the bridge.", "noun", "draft"),
          w("Vivid", "Bright and striking", "Vivid colors filled the mural.", "adjective", "bright"),
          w("Sculpt", "To shape stone or clay", "She sculpts figures from marble.", "verb", "carve"),
          w("Boldly", "In a confident, daring way", "He painted boldly in red.", "adverb", "daringly"),
        ],
      },
      {
        id: "music", label: "Music", icon: Music, blurb: "Words for sound and song.",
        words: [
          w("Melody", "A sequence of musical notes", "The melody stayed in my head.", "noun", "tune"),
          w("Harmony", "Notes sounding pleasantly together", "The choir sang in harmony.", "noun"),
          w("Tempo", "The speed of a piece of music", "The tempo quickened at the end.", "noun", "pace"),
          w("Hum", "To sing with closed lips", "She hummed while working.", "verb", "croon"),
          w("Softly", "In a quiet way", "The band played softly.", "adverb", "gently"),
        ],
      },
      {
        id: "food", label: "Food", icon: UtensilsCrossed, blurb: "Everyday eating words.",
        words: [
          w("Nibble", "To eat in small bites", "Mice nibble the cheese.", "verb", "peck"),
          w("Feast", "A large, special meal", "They prepared a feast for guests.", "noun", "banquet"),
          w("Crisp", "Firm and crunchy", "A crisp apple snapped loudly.", "adjective", "crunchy"),
          w("Hunger", "The need for food", "Hunger drove him to the market.", "noun"),
          w("Slowly", "At a low speed", "Eat slowly and enjoy it.", "adverb", "gradually"),
        ],
      },
      {
        id: "summer", label: "Summer", icon: Sun, blurb: "Words for the warm season.",
        words: [
          w("Sweltering", "Uncomfortably hot", "A sweltering July afternoon.", "adjective", "scorching"),
          w("Breeze", "A gentle wind", "A breeze cooled the beach.", "noun"),
          w("Bask", "To lie in pleasant warmth", "Lizards bask on the rocks.", "verb", "lounge"),
          w("Drought", "A long period without rain", "The drought dried the river.", "noun"),
          w("Lazily", "In a slow, relaxed way", "We floated lazily downstream.", "adverb", "idly"),
        ],
      },
    ],
  },
  {
    id: "level",
    title: "By level",
    topics: [
      {
        id: "beginner", label: "Beginner", icon: GraduationCap, blurb: "Everyday essentials.",
        words: [
          w("Happy", "Feeling pleasure or joy", "The happy child laughed.", "adjective", "glad"),
          w("Run", "To move fast on foot", "They run every morning.", "verb", "jog"),
          w("House", "A building people live in", "The house has a red door.", "noun", "home"),
          w("Big", "Large in size", "A big dog barked.", "adjective", "large"),
          w("Fast", "Moving quickly", "A fast car passed us.", "adjective", "quick"),
        ],
      },
      {
        id: "intermediate", label: "Intermediate", icon: GraduationCap, blurb: "Step up your vocabulary.",
        words: [
          w("Reluctant", "Unwilling or hesitant", "He was reluctant to leave.", "adjective", "hesitant"),
          w("Achieve", "To reach a goal", "She achieved her dream.", "verb", "accomplish"),
          w("Journey", "Travel from one place to another", "The journey took three days.", "noun", "trip"),
          w("Curious", "Eager to know or learn", "A curious cat explored the box.", "adjective", "inquisitive"),
          w("Nearly", "Almost but not quite", "We nearly missed the train.", "adverb", "almost"),
        ],
      },
      {
        id: "advanced", label: "Advanced", icon: GraduationCap, blurb: "Words that impress.",
        words: [
          w("Perspicacious", "Having sharp insight", "A perspicacious critic saw the flaw.", "adjective", "astute"),
          w("Obfuscate", "To deliberately make unclear", "Jargon obfuscates the report.", "verb", "cloud"),
          w("Sycophant", "A flatterer seeking favor", "The sycophant praised every word.", "noun", "flatterer"),
          w("Ineffable", "Too great for words", "The view was ineffable.", "adjective", "indescribable"),
          w("Nefarious", "Wicked or criminal", "A nefarious plot unfolded.", "adjective", "villainous"),
        ],
      },
    ],
  },
  {
    id: "lexicon",
    title: "Lexicon",
    topics: [
      {
        id: "beautiful", label: "Beautiful words", icon: Sparkles, blurb: "Words that sound lovely.",
        words: [
          w("Luminous", "Full of light; glowing", "Luminous stars filled the sky.", "adjective", "radiant"),
          w("Halcyon", "Denoting a happy, peaceful time", "Halcyon days of youth.", "adjective", "golden"),
          w("Petrichor", "The smell of earth after rain", "Petrichor rose from the garden.", "noun"),
          w("Sonorous", "Deep and full in sound", "A sonorous bell rang out.", "adjective", "resonant"),
          w("Effloresce", "To blossom forth", "Wildflowers effloresce in spring.", "verb", "bloom"),
        ],
      },
      {
        id: "slang", label: "Slang", icon: MessageCircle, blurb: "Informal, modern words.",
        words: [
          w("Ghost", "To cut off contact suddenly", "He ghosted after two dates.", "verb"),
          w("Hype", "Extravagant promotion or excitement", "The hype around the film grew.", "noun", "buzz"),
          w("Goat", "Greatest of all time", "Fans call her the GOAT.", "noun", "legend"),
          w("Salty", "Bitter or annoyed", "He was salty about losing.", "adjective", "bitter"),
          w("Low-key", "Quietly; somewhat", "I low-key love that song.", "adverb", "kind of"),
        ],
      },
      {
        id: "expressions", label: "Expressions", icon: Quote, blurb: "Phrases people say.",
        words: [
          w("Cold feet", "Sudden nervousness before a big step", "He got cold feet before the wedding.", "noun"),
          w("Break a leg", "A way to wish good luck", "Break a leg at the audition!", "verb"),
          w("Under the weather", "Feeling slightly ill", "I'm under the weather today.", "adjective", "unwell"),
          w("Hit the books", "To study hard", "Time to hit the books.", "verb", "study"),
          w("Piece of cake", "Something very easy", "The test was a piece of cake.", "noun", "breeze"),
        ],
      },
      {
        id: "funny", label: "Funny words", icon: Laugh, blurb: "Words that make you smile.",
        words: [
          w("Bamboozle", "To trick or confuse", "The magician bamboozled us all.", "verb", "hoodwink"),
          w("Gobbledygook", "Language that is nonsense", "The manual was pure gobbledygook.", "noun", "gibberish"),
          w("Wobbly", "Unsteady; shaky", "A wobbly table spilled the tea.", "adjective", "shaky"),
          w("Kerfuffle", "A commotion or fuss", "A kerfuffle broke out over seating.", "noun", "fuss"),
          w("Lollygag", "To dawdle or waste time", "Stop lollygagging and help!", "verb", "dawdle"),
        ],
      },
      {
        id: "legal", label: "Legal terms", icon: Scale, blurb: "Words from law.",
        words: [
          w("Verdict", "The decision of a jury", "The verdict was unanimous.", "noun", "ruling"),
          w("Allege", "To claim without proof", "They allege he knew.", "verb", "claim"),
          w("Lawful", "Allowed by law", "A lawful search requires a warrant.", "adjective", "legal"),
          w("Plaintiff", "The person who brings a case", "The plaintiff sought damages.", "noun"),
          w("Hereby", "By means of this statement", "You are hereby notified.", "adverb"),
        ],
      },
      {
        id: "medicine", label: "Medicine", icon: Stethoscope, blurb: "Words from healthcare.",
        words: [
          w("Remedy", "A treatment that cures or relieves", "Honey is a remedy for sore throats.", "noun", "cure"),
          w("Diagnose", "To identify an illness", "Doctors diagnosed the infection.", "verb"),
          w("Chronic", "Persisting for a long time", "Chronic pain limited her work.", "adjective", "long-term"),
          w("Dosage", "The amount of medicine to take", "Follow the dosage on the label.", "noun", "dose"),
          w("Gently", "In a mild, careful way", "Apply the ointment gently.", "adverb", "softly"),
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
          w("Revenue", "Income earned by a business", "Revenue grew this quarter.", "noun", "income"),
          w("Negotiate", "To discuss terms to agree", "They negotiated the contract.", "verb", "bargain"),
          w("Lucrative", "Producing great profit", "A lucrative deal was signed.", "adjective", "profitable"),
          w("Stakeholder", "A person with an interest in a venture", "Stakeholders reviewed the plan.", "noun"),
          w("Promptly", "Without delay", "Invoices are paid promptly.", "adverb", "quickly"),
        ],
      },
      {
        id: "flora-fauna", label: "Flora & fauna", icon: Leaf, blurb: "Words for plants and animals.",
        words: [
          w("Foliage", "The leaves of a plant", "Autumn foliage turned gold.", "noun"),
          w("Nocturnal", "Active at night", "Owls are nocturnal hunters.", "adjective"),
          w("Graze", "To feed on grass", "Sheep graze in the meadow.", "verb", "feed"),
          w("Habitat", "The natural home of a species", "Wetlands are a rich habitat.", "noun", "home"),
          w("Wildly", "In an uncontrolled way", "Ivy grew wildly over the wall.", "adverb"),
        ],
      },
      {
        id: "travel", label: "Travel", icon: Plane, blurb: "Words for journeys.",
        words: [
          w("Itinerary", "A planned route of travel", "Our itinerary included Rome.", "noun", "schedule"),
          w("Roam", "To travel without a plan", "We roamed the old streets.", "verb", "wander"),
          w("Remote", "Far from populated areas", "A remote village in the hills.", "adjective", "distant"),
          w("Voyage", "A long journey by sea or space", "The voyage lasted forty days.", "noun", "journey"),
          w("Abroad", "In or to a foreign country", "She studied abroad.", "adverb", "overseas"),
        ],
      },
      {
        id: "science", label: "Science", icon: FlaskConical, blurb: "Words for discovery.",
        words: [
          w("Hypothesis", "A proposed explanation to test", "The hypothesis proved correct.", "noun", "theory"),
          w("Observe", "To watch carefully", "Scientists observe the cells.", "verb", "watch"),
          w("Precise", "Exact and accurate", "Precise measurements matter.", "adjective", "exact"),
          w("Experiment", "A test to discover something", "The experiment confirmed the theory.", "noun", "trial"),
          w("Gradually", "Little by little", "The liquid gradually cooled.", "adverb", "slowly"),
        ],
      },
      {
        id: "technology", label: "Technology", icon: Laptop, blurb: "Words for the digital world.",
        words: [
          w("Algorithm", "A set of rules for computing", "The algorithm sorts the feed.", "noun"),
          w("Download", "To copy data to your device", "Download the file first.", "verb", "fetch"),
          w("Digital", "Relating to computer technology", "A digital archive preserves photos.", "adjective"),
          w("Interface", "The point where systems meet", "The interface is easy to use.", "noun"),
          w("Instantly", "Immediately", "The message sent instantly.", "adverb", "immediately"),
        ],
      },
      {
        id: "environment", label: "Environment", icon: Globe, blurb: "Words for our planet.",
        words: [
          w("Sustainable", "Able to continue without harm", "Sustainable farming protects soil.", "adjective", "renewable"),
          w("Erosion", "The wearing away of land", "Erosion shaped the canyon.", "noun"),
          w("Conserve", "To protect from loss", "Conserve water during droughts.", "verb", "preserve"),
          w("Climate", "The usual weather of a region", "The climate is mild here.", "noun"),
          w("Rapidly", "Very quickly", "Glaciers are melting rapidly.", "adverb", "swiftly"),
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
          w("Laconic", "Using very few words", "His laconic reply ended the debate.", "adjective", "terse"),
          w("Ephemeral", "Lasting a very short time", "Fame can be ephemeral.", "adjective", "fleeting"),
          w("Equivocate", "To speak ambiguously", "Politicians often equivocate.", "verb", "hedge"),
          w("Pragmatic", "Practical rather than idealistic", "A pragmatic approach won.", "adjective", "practical"),
          w("Ostensibly", "Apparently, but perhaps not truly", "He was ostensibly in charge.", "adverb", "seemingly"),
        ],
      },
      {
        id: "sat", label: "SAT", icon: GraduationCap, blurb: "College admissions words.",
        words: [
          w("Candid", "Truthful and straightforward", "A candid interview aired.", "adjective", "frank"),
          w("Resilient", "Able to recover quickly", "Resilient teams bounce back.", "adjective", "tough"),
          w("Clarify", "To make clear", "Clarify your thesis statement.", "verb", "explain"),
          w("Ambiguity", "Openness to more than one meaning", "The poem's ambiguity invites debate.", "noun", "vagueness"),
          w("Notably", "Especially; remarkably", "The essay was notably clear.", "adverb", "remarkably"),
        ],
      },
      {
        id: "spelling", label: "Spelling", icon: SpellCheck, blurb: "Commonly misspelled words.",
        words: [
          w("Occurrence", "An event or happening", "A rare occurrence surprised us.", "noun", "event"),
          w("Necessary", "Required; essential", "Sleep is necessary.", "adjective", "essential"),
          w("Accommodate", "To provide space or help", "The hall accommodates 200.", "verb", "house"),
          w("Separate", "To divide or keep apart", "Separate the whites from colors.", "verb", "divide"),
          w("Definitely", "Without doubt", "She definitely passed.", "adverb", "certainly"),
        ],
      },
    ],
  },
  {
    id: "origin",
    title: "By origin",
    topics: [
      {
        id: "french-root", label: "French root", icon: Landmark, blurb: "Words from French.",
        words: [
          w("Rendezvous", "A planned meeting", "Our rendezvous was at noon.", "noun", "meeting"),
          w("Facade", "The front of a building; a false front", "A calm facade hid his nerves.", "noun", "front"),
          w("Encore", "A call for another performance", "The crowd demanded an encore.", "noun"),
          w("Chic", "Stylishly fashionable", "A chic little café opened.", "adjective", "stylish"),
          w("Deja vu", "The feeling of having lived this before", "A strong sense of deja vu hit her.", "noun"),
        ],
      },
      {
        id: "latin-root", label: "Latin root", icon: Scroll, blurb: "Words from Latin.",
        words: [
          w("Verbatim", "Word for word", "She quoted him verbatim.", "adverb", "exactly"),
          w("Alibi", "Proof of being elsewhere", "His alibi checked out.", "noun"),
          w("Bonus", "Something extra", "A year-end bonus arrived.", "noun", "extra"),
          w("Emerge", "To come out into view", "The sun emerged from clouds.", "verb", "appear"),
          w("Et cetera", "And other similar things", "Pens, paper, et cetera.", "adverb"),
        ],
      },
      {
        id: "germanic-root", label: "Germanic root", icon: Castle, blurb: "Words from Germanic roots.",
        words: [
          w("Wanderlust", "A strong desire to travel", "Wanderlust took her to Peru.", "noun"),
          w("Kindergarten", "A class for young children", "Kindergarten starts at five.", "noun"),
          w("Blitz", "A sudden, intense effort", "A study blitz before finals.", "noun", "rush"),
          w("Angst", "Deep anxiety or dread", "Teenage angst filled the diary.", "noun", "anxiety"),
          w("Fest", "A gathering or festival", "The town held a film fest.", "noun", "festival"),
        ],
      },
      {
        id: "greek-root", label: "Greek root", icon: Omega, blurb: "Words from Greek.",
        words: [
          w("Democracy", "Government by the people", "Democracy needs voters.", "noun"),
          w("Chronology", "The order of events in time", "Check the chronology of events.", "noun", "timeline"),
          w("Euphoric", "Intensely happy", "A euphoric crowd cheered.", "adjective", "elated"),
          w("Analyze", "To examine in detail", "Analyze the data carefully.", "verb", "examine"),
          w("Automatic", "Working by itself", "An automatic door opened.", "adjective", "self-acting"),
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
