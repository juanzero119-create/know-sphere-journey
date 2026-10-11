import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { WordRows } from "@/components/WordRows";
import { words, type PartOfSpeech } from "@/lib/data";

/**
 * Compact word library. Each row shows only the word and its part of speech;
 * the beveled detail key opens that word's full definition, example and synonym.
 */
export function WordLibrary({ posFilter }: { posFilter: PartOfSpeech | null }) {
  const [search, setSearch] = useState("");
  const list = words.filter(
    w =>
      (!posFilter || w.pos === posFilter) &&
      `${w.word} ${w.meaning}`.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <div className="relative">
        <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          aria-label="Search words"
          placeholder="Search words or definitions…"
          className="h-9 bg-card pl-9 text-sm"
        />
      </div>
      <div className="mt-3">
        <WordRows list={list} />
      </div>
      {list.length === 0 && (
        <p className="py-6 text-center text-muted-foreground">No words match your search.</p>
      )}
    </div>
  );
}
