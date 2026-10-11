import { useState } from "react";
import { Info, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TopicWord } from "@/lib/topics";
import { recordHistory, toggleFavorite, useWordLists } from "@/lib/word-lists";

/**
 * Compact word rows shared by the word library and topic panels. Each row
 * shows the word and its part of speech; the beveled detail key opens the
 * full definition inline, and the star toggles a favorite.
 */
export function WordRows({ list }: { list: TopicWord[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const { favorites } = useWordLists();

  return (
    <div className="gap-2 sm:columns-2 lg:columns-3">
      {list.map(w => {
        const shown = open === w.word;
        const fav = favorites.includes(w.word);
        return (
          <article
            key={w.word}
            className={`mb-2 break-inside-avoid rounded-md border bg-card px-3 py-2 ${shown ? "border-primary ring-2 ring-ring" : "border-border"}`}
          >
            <div className="flex items-center gap-2">
              <h3 className="min-w-0 flex-1 truncate text-sm font-semibold">{w.word}</h3>
              <span className="shrink-0 rounded-full border border-border px-1.5 py-0.5 text-[10px] uppercase tracking-wide capitalize text-muted-foreground">
                {w.pos}
              </span>
              <Button
                variant="ghost"
                type="button"
                aria-pressed={fav}
                aria-label={`${fav ? "Remove" : "Add"} ${w.word} ${fav ? "from" : "to"} favorites`}
                title="Favorite"
                onClick={() => toggleFavorite(w.word)}
                className="chip-icon h-7 w-7 p-0"
              >
                <Star className={`size-3.5 ${fav ? "fill-current" : ""}`} />
              </Button>
              <Button
                variant="ghost"
                type="button"
                aria-expanded={shown}
                aria-label={`${shown ? "Hide" : "Show"} full definition of ${w.word}`}
                title="Full definition"
                onClick={() => {
                  const next = shown ? null : w.word;
                  setOpen(next);
                  if (next) recordHistory(next);
                }}
                className="chip-icon h-7 w-7 p-0"
              >
                {shown ? <X className="size-3.5" /> : <Info className="size-3.5" />}
              </Button>
            </div>
            {shown && (
              <div className="mt-2 border-t border-border pt-2">
                <p className="text-sm leading-snug">{w.meaning}</p>
                <p className="mt-1.5 text-xs italic text-muted-foreground">“{w.example}”</p>
                {w.synonym && (
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Synonym: <span className="font-medium text-foreground">{w.synonym}</span>
                  </p>
                )}
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
