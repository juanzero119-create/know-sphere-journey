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

- Keep learning content in separate TanStack leaf routes within the shared Shell; this preserves direct navigation to each learning discipline.
- Store note highlights as validated text ranges alongside plain-text notes and render them as React marks; this preserves existing device-saved notes without storing or injecting HTML.
- Use Section for numbered content bands and the shared Button for controls; this keeps the expanded learning views consistent.

- Keep the curated film catalog in a browser-safe data module with a Movies leaf and parameterized Film detail leaf; this supports direct links without a live movie API.
- Render cast portraits through ActorPortrait with normalized apostrophes and an image-error fallback; this keeps every movie's cast photos consistent and prevents broken images.
- Keep the actor-entry interface in its own presentation component with independently tokenized name highlights and visit-only state; this isolates custom cast entries from the curated catalog without adding backend behavior.
- Render every film an actor appears in through the shared FilmChip tile with its token-driven bevel, poster thumbnail and optional role note; this keeps actor filmography links identical across film pages, actor cards and search and readable on both themes.
- Test any component that renders a Link with the awaitable renderWithRouter helper in src/test/router.tsx; this gives the link a real router so component tests don't fail on missing router context.
- Group discipline links on the Studies leaf while preserving their direct routes; this consolidates navigation without removing learning content.
- Keep custom navigation shortcuts in a browser-only, visit-scoped shared store with a fixed empty SSR snapshot; this preserves shortcuts across page navigation without adding persistence or server behavior.
- Keep custom studies added from the Studies page in the same browser-only, visit-scoped store pattern; this isolates them from the built-in discipline cards.
- Keep added AI model entries as visit-only interface settings, without implying a live provider connection; this separates model management from future AI execution.
- Keep each chess colour's chosen AI model in the browser-only chess-models store (one selection per side, persisted separately) rather than a single shared choice; this lets White and Black run different models without adding a live provider connection.
- Use licensed Cburnett chess piece assets with semantic board tokens; this keeps pieces readable on both square colors.
- Keep the chess game (board, clocks, mode, AI move loop) in the module-level store src/lib/chess-store.ts, not in the route component; this lets the game and AI-vs-AI moves keep running while the user browses other tabs.
- Keep per-side chess Elo targets in the visit-scoped chess store and validate them with a shared schema; this preserves difficulty across navigation and resets without claiming calibrated engine ratings.
- Keep the player's built-up chess rating in the browser-only chess-rating store, updated by the chess store when a Vs AI game ends; this keeps rating logic separate from AI difficulty targets.
- Keep iPhone installability manifest-only (public/manifest.webmanifest plus icon PNGs in public/, no service worker); this gives a home-screen app icon without stale-cache blank screens in preview.
