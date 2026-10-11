import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { words } from "@/lib/data";
import { allTopics } from "@/lib/topics";
import { getWordDetail } from "@/lib/word-details";
import { WordLibrary } from "@/components/WordLibrary";
import { WordDetails } from "@/components/WordDetails";
import { renderWithRouter } from "@/test/router";

describe("dictionary-style word details", () => {
  it("provides individual editorial content for every built-in library and topic word", () => {
    for (const word of [...words, ...allTopics().flatMap(topic => topic.words)]) {
      const detail = getWordDetail(word.word);
      expect(detail, word.word).toBeDefined();
      expect(detail?.pronunciation.length).toBeGreaterThan(1);
      expect(detail?.explanation.length).toBeGreaterThan(75);
      expect(detail?.example.length).toBeGreaterThan(15);
      expect(detail?.fact.length).toBeGreaterThan(60);
    }
    expect(getWordDetail("  IMMUTABLE ")).toEqual(getWordDetail("Immutable"));
  });
  it("opens fuller meanings, two examples, pronunciation and facts with the existing detail key", async () => {
    await renderWithRouter(<WordLibrary posFilter={null} />);
    expect(screen.queryByText("Did you know?")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Show full definition of Forgo" }));
    expect(screen.getByText("What it means")).toBeInTheDocument();
    expect(screen.getByText("Examples")).toBeInTheDocument();
    expect(screen.getByText("Did you know?")).toBeInTheDocument();
    expect(screen.getByText("for-GOH")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Pronounce Forgo" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Hide full definition of Forgo" }));
    expect(screen.queryByText("Did you know?")).not.toBeInTheDocument();
  });
  it("preserves user-added definitions without inventing facts", async () => {
    await renderWithRouter(<WordDetails word={{ word: "My custom word", pos: "noun", meaning: "My meaning", example: "My example." }} />);
    expect(screen.getByText("My meaning")).toBeInTheDocument();
    expect(screen.queryByText("Did you know?")).not.toBeInTheDocument();
  });
});