import { useState } from "react";
import { Info, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { words, type PartOfSpeech } from "@/lib/data";

/**
 * Compact word library. Each row shows only the word and its part of speech;
 * the beveled detail key opens that word's full definition, example and synonym.
 */
export function WordLibrary({ posFilter }: { posFilter: PartOfSpeech | null }) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState<string | null>(null);
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
      <div className="mt-3 grid items-start gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {list.map(w => {
          const shown = open === w.word;
          return (
            <article
              key={w.word}
              className={`rounded-md border bg-card px-3 py-2 ${shown ? "border-primary ring-2 ring-ring" : "border-border"}`}
            >
              <div className="flex items-center gap-2">
                <h3 className="min-w-0 flex-1 truncate text-sm font-semibold">{w.word}</h3>
                <span className="shrink-0 rounded-full border border-border px-1.5 py-0.5 text-[10px] uppercase tracking-wide capitalize text-muted-foreground">
                  {w.pos}
                </span>
                <Button
                  variant="ghost"
                  type="button"
                  aria-expanded={shown}
                  aria-label={`${shown ? "Hide" : "Show"} full definition of ${w.word}`}
                  title="Full definition"
                  onClick={() => setOpen(shown ? null : w.word)}
                  className="chip-icon ml-auto h-7 w-7 p-0"
                >
                  {shown ? <X className="size-3.5" /> : <Info className="size-3.5" />}
                </Button>
              </div>
              {shown && (
                <div className="mt-2 border-t border-border pt-2">
                  <p className="text-sm leading-snug">{w.meaning}</p>
                  <p className="mt-1.5 text-xs italic text-muted-foreground">“{w.example}”</p>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Synonym: <span className="font-medium text-foreground">{w.synonym}</span>
                  </p>
                </div>
              )}
            </article>
          );
        })}
      </div>
      {list.length === 0 && (
        <p className="py-6 text-center text-muted-foreground">No words match your search.</p>
      )}
    </div>
  );
}
