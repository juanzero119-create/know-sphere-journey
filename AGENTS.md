<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep learning content in separate TanStack leaf routes within the shared Shell for direct navigation to each discipline.
- Store note highlights as validated text ranges with plain-text notes and render them as React marks; this avoids storing or injecting HTML.
- Use Section for numbered bands and the shared Button for controls to keep learning views consistent.

- Keep the film catalog in a browser-safe data module with Movies and Film detail leaves for direct links without a live API.
- Keep trailer photo frames in project asset pointers indexed by the film-photos module; this avoids external hotlinks.
- Render cast portraits through ActorPortrait with normalized apostrophes and an image-error fallback to prevent broken images.
- Keep the actor-entry interface in its own component with tokenized name highlights and visit-only state; this isolates custom cast entries without backend behavior.
- Render every film an actor appears in through the shared FilmChip tile (token bevel, poster, optional role note) so filmography links stay identical and readable on both themes.
- Test components that render a Link with the awaitable renderWithRouter helper in src/test/router.tsx so tests get a real router.
- Group discipline links on the Studies leaf while keeping their direct routes.
- Keep custom navigation shortcuts in a browser-only, visit-scoped store with a fixed empty SSR snapshot; no persistence or server behavior.
- Keep custom studies added from the Studies page in that same visit-scoped store pattern.
- Keep added AI model entries as visit-only interface settings that imply no live provider connection.
- Keep each chess colour's AI model in the browser-only chess-models store (one per side) so White and Black can differ without a live provider.
- Use licensed Cburnett chess piece assets with semantic board tokens; this keeps pieces readable on both square colors.
- Keep the chess game (board, clocks, mode, AI move loop) in the module-level store src/lib/chess-store.ts, not the route, so games keep running while browsing other tabs.
- Keep per-side chess Elo targets in the visit-scoped chess store, validated by a shared schema, without claiming calibrated engine ratings.
- Keep the player's chess rating in the browser-only chess-rating store, updated when a Vs AI game ends, separate from AI difficulty targets.
- Keep chess board orientation in the visit-scoped chess store, rendered by mirroring display coordinates only, so the view turns without touching game state, clocks or the AI.
- Keep iPhone installability manifest-only (public/manifest.webmanifest + icon PNGs, no service worker) to avoid stale-cache blank screens.
- Render compact list detail toggles through the shared beveled .chip-icon key, revealing extra text inline in the same tile instead of a modal.
- Keep vocabulary topic data in src/lib/topics.ts (grouped topics, each with its word list); parts-of-speech tiles filter the main library.
- Keep favorites, custom words, history and collections in the localStorage-backed src/lib/word-lists.ts with a fixed empty SSR snapshot; no backend.
- Render compact word rows through the shared WordRows component (detail key plus favorite star) so the library, topic panels and quick tiles behave identically.
- Keep original dictionary-style editorial content in the browser-safe word-details module, keyed by normalized word, rendered through shared WordDetails; this keeps user-added words free of invented facts.
- Sort every alphabetical list through src/lib/alphabetical.ts (sortByAlphabetical / compareAlphabetical), not ad-hoc localeCompare, so A–Z/Z–A, numeric-aware and accent-insensitive ordering stays identical everywhere.
