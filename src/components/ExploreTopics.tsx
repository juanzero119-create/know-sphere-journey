import { useMemo, useState } from "react";
import { ChevronLeft, Plus, Search, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WordRows } from "@/components/WordRows";
import { words as coreWords, type PartOfSpeech } from "@/lib/data";
import { sortByAlphabetical } from "@/lib/alphabetical";
import { allTopics, findTopic, quickTiles, topicGroups, type QuickTileId, type Topic, type TopicWord } from "@/lib/topics";
import {
  addCollection, addCustomWord, removeCollection, removeCustomWord,
  toggleWordInCollection, useWordLists,
} from "@/lib/word-lists";

/** Every known word, used to resolve favorites and history entries. */
function useWordIndex() {
  const { customWords } = useWordLists();
  return useMemo(() => {
    const map = new Map<string, TopicWord>();
    for (const w of coreWords) map.set(w.word, w);
    for (const t of allTopics()) for (const w of t.words) if (!map.has(w.word)) map.set(w.word, w);
    for (const w of customWords) map.set(w.word, w);
    return map;
  }, [customWords]);
}

function TopicTile({ topic, onOpen }: { topic: Topic; onOpen: (t: Topic) => void }) {
  const Icon = topic.icon;
  return (
    <Button
      variant="ghost"
      onClick={() => onOpen(topic)}
      className="flex h-auto flex-col items-start justify-between gap-8 whitespace-normal rounded-lg border border-border bg-card p-4 text-left hover:bg-card"
    >
      <Icon className="size-8 text-muted-foreground" />
      <span>
        <span className="block text-base font-semibold">{topic.label}</span>
        <span className="mt-0.5 block text-xs font-normal text-muted-foreground">{topic.blurb}</span>
      </span>
    </Button>
  );
}

function OwnWordsPanel() {
  const { customWords } = useWordLists();
  const [word, setWord] = useState("");
  const [meaning, setMeaning] = useState("");
  const [example, setExample] = useState("");
  const add = () => {
    if (!word.trim() || !meaning.trim()) return;
    addCustomWord({
      word: word.trim(),
      meaning: meaning.trim(),
      example: example.trim() || "—",
      pos: "noun",
    });
    setWord(""); setMeaning(""); setExample("");
  };
  return (
    <div>
      <div className="grid gap-2 sm:grid-cols-[1fr_1.4fr_1.4fr_auto]">
        <Input value={word} onChange={e => setWord(e.target.value)} aria-label="Your word" placeholder="Word" className="h-9 bg-card text-sm" />
        <Input value={meaning} onChange={e => setMeaning(e.target.value)} aria-label="Its meaning" placeholder="Meaning" className="h-9 bg-card text-sm" />
        <Input value={example} onChange={e => setExample(e.target.value)} aria-label="An example sentence" placeholder="Example sentence" className="h-9 bg-card text-sm" />
        <Button onClick={add} size="sm" className="h-9"><Plus className="size-4" /> Add</Button>
      </div>
      <div className="mt-4">
        {customWords.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">No words of your own yet — add one above.</p>
        ) : (
          <div className="gap-2 sm:columns-2 lg:columns-3">
            {customWords.map(w => (
              <article key={w.word} className="mb-2 break-inside-avoid rounded-md border border-border bg-card px-3 py-2">
                <div className="flex items-center gap-2">
                  <h3 className="min-w-0 flex-1 truncate text-sm font-semibold">{w.word}</h3>
                  <Button variant="ghost" type="button" aria-label={`Remove ${w.word}`} title="Remove" onClick={() => removeCustomWord(w.word)} className="chip-icon h-7 w-7 p-0">
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
                <p className="mt-1 text-sm leading-snug text-muted-foreground">{w.meaning}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CollectionsPanel({ index }: { index: Map<string, TopicWord> }) {
  const { collections } = useWordLists();
  const [name, setName] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const all = useMemo(() => sortByAlphabetical([...index.keys()], key => key), [index]);
  return (
    <div>
      <div className="flex gap-2">
        <Input value={name} onChange={e => setName(e.target.value)} aria-label="New collection name" placeholder="New collection name…" className="h-9 bg-card text-sm" />
        <Button size="sm" className="h-9" onClick={() => { addCollection(name); setName(""); }}><Plus className="size-4" /> Create</Button>
      </div>
      {collections.length === 0 && (
        <p className="py-4 text-center text-sm text-muted-foreground">No collections yet — create one to group words your way.</p>
      )}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {collections.map(c => (
          <article key={c.id} className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <h3 className="min-w-0 flex-1 truncate text-base font-semibold">{c.name}</h3>
              <span className="text-xs text-muted-foreground">{c.words.length} words</span>
              <Button variant="ghost" type="button" aria-label={`Edit ${c.name}`} title="Edit words" onClick={() => setEditing(editing === c.id ? null : c.id)} className="chip-icon h-7 w-7 p-0">
                {editing === c.id ? <X className="size-3.5" /> : <Plus className="size-3.5" />}
              </Button>
              <Button variant="ghost" type="button" aria-label={`Delete ${c.name}`} title="Delete collection" onClick={() => removeCollection(c.id)} className="chip-icon h-7 w-7 p-0">
                <Trash2 className="size-3.5" />
              </Button>
            </div>
            {c.words.length > 0 && (
              <p className="mt-2 text-sm text-muted-foreground">{c.words.join(", ")}</p>
            )}
            {editing === c.id && (
              <div className="mt-3 max-h-48 overflow-y-auto border-t border-border pt-3">
                {all.map(w => {
                  const inList = c.words.includes(w);
                  return (
                    <label key={w} className="flex cursor-pointer items-center gap-2 py-1 text-sm">
                      <input type="checkbox" checked={inList} onChange={() => toggleWordInCollection(c.id, w)} className="accent-current" />
                      {w}
                    </label>
                  );
                })}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}

export function ExploreTopics({ onPickPos }: { onPickPos: (pos: PartOfSpeech) => void }) {
  const [search, setSearch] = useState("");
  const [openTopic, setOpenTopic] = useState<string | null>(null);
  const [openQuick, setOpenQuick] = useState<QuickTileId | null>(null);
  const lists = useWordLists();
  const index = useWordIndex();

  const q = search.trim().toLowerCase();
  const groups = topicGroups
    .map(g => ({
      ...g,
      topics: g.topics.filter(t => !q || `${t.label} ${t.blurb}`.toLowerCase().includes(q)),
    }))
    .filter(g => g.topics.length > 0);

  const open = (t: Topic) => {
    if (t.pos) onPickPos(t.pos);
    setOpenQuick(null);
    setOpenTopic(openTopic === t.id ? null : t.id);
  };

  const topic = openTopic ? findTopic(openTopic) : undefined;
  const topicWords = topic?.pos ? coreWords.filter(w => w.pos === topic.pos) : topic?.words ?? [];
  const resolve = (names: string[]) => names.map(n => index.get(n)).filter((w): w is TopicWord => !!w);

  return (
    <div>
      <div className="relative">
        <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          aria-label="Search topics"
          placeholder="Search"
          className="h-9 bg-card pl-9 text-sm"
        />
      </div>

      {!q && (
        <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {quickTiles.map(t => {
            const Icon = t.icon;
            const active = openQuick === t.id;
            return (
              <Button
                variant="ghost"
                key={t.id}
                aria-pressed={active}
                onClick={() => { setOpenTopic(null); setOpenQuick(active ? null : t.id); }}
                className={`flex h-auto items-center gap-3 whitespace-normal rounded-lg border bg-card p-4 text-left hover:bg-card ${active ? "border-primary ring-2 ring-ring" : "border-border"}`}
              >
                <Icon className="size-7 shrink-0 text-muted-foreground" />
                <span className="text-base font-semibold">{t.label}</span>
              </Button>
            );
          })}
        </div>
      )}

      {openQuick === "favorites" && (
        <div className="mt-4 rounded-lg border border-border bg-card p-4">
          <h3 className="text-lg font-semibold">Favorites</h3>
          <div className="mt-3">
            {lists.favorites.length === 0 ? (
              <p className="py-2 text-sm text-muted-foreground">Star any word to keep it here.</p>
            ) : (
              <WordRows list={resolve(lists.favorites)} />
            )}
          </div>
        </div>
      )}
      {openQuick === "own-words" && (
        <div className="mt-4 rounded-lg border border-border bg-card p-4">
          <h3 className="text-lg font-semibold">Your own words</h3>
          <div className="mt-3"><OwnWordsPanel /></div>
        </div>
      )}
      {openQuick === "history" && (
        <div className="mt-4 rounded-lg border border-border bg-card p-4">
          <h3 className="text-lg font-semibold">History</h3>
          <div className="mt-3">
            {lists.history.length === 0 ? (
              <p className="py-2 text-sm text-muted-foreground">Words you open will appear here.</p>
            ) : (
              <WordRows list={resolve(lists.history)} />
            )}
          </div>
        </div>
      )}
      {openQuick === "collections" && (
        <div className="mt-4 rounded-lg border border-border bg-card p-4">
          <h3 className="text-lg font-semibold">Collections</h3>
          <div className="mt-3"><CollectionsPanel index={index} /></div>
        </div>
      )}

      {groups.map(g => (
        <div key={g.id} className="mt-8">
          <p className="section-label">{g.title}</p>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {g.topics.map(t => <TopicTile key={t.id} topic={t} onOpen={open} />)}
          </div>
          {topic && g.topics.some(t => t.id === topic.id) && (
            <div className="mt-3 rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" aria-label="Back to topics" title="Back" onClick={() => setOpenTopic(null)} className="h-7 w-7">
                  <ChevronLeft className="size-4" />
                </Button>
                <h3 className="text-lg font-semibold">{topic.label}</h3>
                <span className="text-xs text-muted-foreground">{topicWords.length} words</span>
              </div>
              <div className="mt-3"><WordRows list={topicWords} /></div>
            </div>
          )}
        </div>
      ))}
      {groups.length === 0 && (
        <p className="py-6 text-center text-muted-foreground">No topics match your search.</p>
      )}
    </div>
  );
}
