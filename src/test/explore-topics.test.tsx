import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithRouter } from "@/test/router";
import { ExploreTopics } from "@/components/ExploreTopics";
import { allTopics, topicGroups } from "@/lib/topics";
import { words } from "@/lib/data";

describe("topic data", () => {
  it("has unique topic ids and words for every non-pos topic", () => {
    const ids = allTopics().map(t => t.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const t of allTopics()) {
      if (!t.pos) expect(t.words.length).toBeGreaterThan(0);
    }
  });

  it("covers the screenshot groups", () => {
    const titles = topicGroups.map(g => g.title);
    for (const t of ["About ourselves", "By parts of speech", "Culture", "By level", "Lexicon", "The world around us", "By test", "By origin", "Languages"]) {
      expect(titles).toContain(t);
    }
  });
});

describe("ExploreTopics", () => {
  it("opens a topic and shows its words with detail keys", async () => {
    await renderWithRouter(<ExploreTopics onPickPos={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: /Emotions/ }));
    expect(screen.getByText("Animosity")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Show full definition of Animosity/ }));
    expect(screen.getByText(/Strong hostility/)).toBeInTheDocument();
  });

  it("filters topics by search", async () => {
    await renderWithRouter(<ExploreTopics onPickPos={() => {}} />);
    fireEvent.change(screen.getByLabelText("Search topics"), { target: { value: "talking" } });
    expect(screen.getByRole("button", { name: /Talking/ })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Emotions/ })).not.toBeInTheDocument();
  });

  it("routes parts-of-speech tiles to the library filter", async () => {
    let picked: string | null = null;
    await renderWithRouter(<ExploreTopics onPickPos={pos => { picked = pos; }} />);
    fireEvent.click(screen.getByRole("button", { name: /^Verbs/ }));
    expect(picked).toBe("verb");
  });

  it.each([['Nouns', 'noun'], ['Verbs', 'verb'], ['Adjectives', 'adjective']] as const)("opens %s with matching words inline", async (label, pos) => {
    await renderWithRouter(<ExploreTopics onPickPos={() => {}} />);
    const tile = screen.getByRole("button", { name: new RegExp(`^${label}`) });
    fireEvent.click(tile);
    expect(screen.getByRole("heading", { name: label })).toBeInTheDocument();
    const matching = words.filter(w => w.pos === pos);
    const detailButtons = screen.getAllByRole("button", { name: /^Show full definition of / });
    expect(detailButtons.map(button => button.getAttribute("aria-label"))).toEqual(matching.map(word => `Show full definition of ${word.word}`));
    const other = words.find(w => w.pos !== pos);
    if (other) expect(screen.queryByRole("button", { name: `Show full definition of ${other.word}` })).not.toBeInTheDocument();
    fireEvent.click(tile);
    expect(screen.queryByRole("heading", { name: label })).not.toBeInTheDocument();
  });

  it("shows favorites, history, own words and collections tiles", async () => {
    await renderWithRouter(<ExploreTopics onPickPos={() => {}} />);
    for (const label of ["Favorites", "Collections", "Your own words", "History"]) {
      expect(screen.getByRole("button", { name: label })).toBeInTheDocument();
    }
  });
});
