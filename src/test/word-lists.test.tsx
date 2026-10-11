import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

beforeEach(() => { vi.resetModules(); localStorage.clear(); });
afterEach(() => { cleanup(); localStorage.clear(); });

async function showStoredLists(value: unknown) {
  localStorage.setItem("lexi-word-lists", JSON.stringify(value));
  const { useWordLists } = await import("@/lib/word-lists");
  function Snapshot() {
    return <output data-testid="lists">{JSON.stringify(useWordLists())}</output>;
  }
  render(<Snapshot />);
  return JSON.parse(screen.getByTestId("lists").textContent ?? "{}");
}

describe("saved word list recovery", () => {
  it("skips broken words while preserving valid words and recovering collection word arrays", async () => {
    const word = { word: "Custom", meaning: "A saved meaning", pos: "noun", example: "A saved example." };
    const lists = await showStoredLists({ customWords: [null, { word: 42 }, word], collections: [null, { id: "one", name: "Saved", words: null }], favorites: [null, "Custom"], history: [42, "Custom"] });
    expect(lists.customWords).toEqual([word]);
    expect(lists.collections).toEqual([{ id: "one", name: "Saved", words: [] }]);
    expect(lists.favorites).toEqual(["Custom"]);
    expect(lists.history).toEqual(["Custom"]);
  });
  it.each([null, [], "bad data"])("handles a non-object saved payload %s", async value => {
    expect(await showStoredLists(value)).toEqual({ favorites: [], customWords: [], history: [], collections: [] });
  });
});