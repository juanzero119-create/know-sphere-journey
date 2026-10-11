import { useEffect, useState } from "react";
import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TopicWord } from "@/lib/topics";
import { getWordDetail } from "@/lib/word-details";

export function WordDetails({ word }: { word: TopicWord }) {
  const detail = getWordDetail(word.word);
  const [speechAvailable, setSpeechAvailable] = useState(false);
  const [speechError, setSpeechError] = useState(false);
  useEffect(() => {
    setSpeechAvailable("speechSynthesis" in window && "SpeechSynthesisUtterance" in window);
    return () => { if ("speechSynthesis" in window) window.speechSynthesis.cancel(); };
  }, []);
  function pronounce() {
    if (!speechAvailable) return;
    setSpeechError(false);
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word.word);
    utterance.lang = detail?.language ?? "en-US";
    utterance.rate = 0.85;
    utterance.onerror = () => setSpeechError(true);
    window.speechSynthesis.speak(utterance);
  }
  return (
    <div className="space-y-6 break-words pt-3 text-sm leading-relaxed">
      <div className="flex flex-wrap items-center gap-3 border-b border-border pb-4">
        <span className="italic text-muted-foreground">{word.pos}</span>
        {detail && <span className="font-medium">{detail.pronunciation}</span>}
        <Button variant="ghost" size="icon" className="chip-icon h-8 w-8" disabled={!speechAvailable} aria-label={`Pronounce ${word.word}`} title="Pronounce word" onClick={pronounce}><Volume2 className="size-4" /></Button>
        {speechError && <span role="status" className="text-xs text-muted-foreground">Audio unavailable on this device.</span>}
      </div>
      <section aria-label={`Meaning of ${word.word}`}>
        <h4 className="mb-2 text-lg font-semibold text-primary">What it means</h4>
        <p className="font-medium">{word.meaning}</p>
        {detail && <p className="mt-3">{detail.explanation}</p>}
      </section>
      <section aria-label={`Examples of ${word.word}`}>
        <h4 className="mb-2 text-lg font-semibold text-primary">Examples</h4>
        <p className="italic text-muted-foreground">“{word.example}”</p>
        {detail && <p className="mt-3 italic text-muted-foreground">“{detail.example}”</p>}
      </section>
      {detail && <section aria-label={`Facts about ${word.word}`}>
        <h4 className="mb-2 text-lg font-semibold text-primary">Did you know?</h4>
        <p>{detail.fact}</p>
      </section>}
      {word.synonym && <p className="border-t border-border pt-4 text-muted-foreground">Synonym: <span className="font-medium text-foreground">{word.synonym}</span></p>}
    </div>
  );
}