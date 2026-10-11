import { useState } from "react";
import { ArrowDownAZ, ArrowUpAZ, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WordRows } from "@/components/WordRows";
import { sortByAlphabetical, type SortDirection } from "@/lib/alphabetical";
import { words, type PartOfSpeech } from "@/lib/data";

/**
 * Compact word library. Each row shows only the word and its part of speech;
 * the beveled detail key opens that word's full definition, example and synonym.
 * Rows are ordered by the shared alphabetical comparator, with an A–Z / Z–A toggle.
 */
export function WordLibrary({ posFilter }: { posFilter: PartOfSpeech | null }) {
  const [search, setSearch] = useState("");
  const [sortDir, setSortDir] = useState<SortDirection>("az");

  const filtered = words.filter(
    w =>
      (!posFilter || w.pos === posFilter) &&
      `${w.word} ${w.meaning}`.toLowerCase().includes(search.toLowerCase()),
  );
  const list = sortByAlphabetical(filtered, w => w.word, sortDir);

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
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          {list.length} {list.length === 1 ? "word" : "words"}
          {posFilter ? ` · ${posFilter}s` : ""}
        </p>
        <div className="flex gap-1" role="group" aria-label="Sort words">
          <Button
            type="button"
            size="sm"
            variant={sortDir === "az" ? "default" : "secondary"}
            aria-pressed={sortDir === "az"}
            onClick={() => setSortDir("az")}
          >
            <ArrowDownAZ />
            A–Z
          </Button>
          <Button
            type="button"
            size="sm"
            variant={sortDir === "za" ? "default" : "secondary"}
            aria-pressed={sortDir === "za"}
            onClick={() => setSortDir("za")}
          >
            <ArrowUpAZ />
            Z–A
          </Button>
        </div>
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
