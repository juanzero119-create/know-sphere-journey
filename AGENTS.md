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
- Use Section for numbered content bands and the shared Button for controls; this keeps the expanded learning views consistent.

- Keep the curated film catalog in a browser-safe data module with a Movies leaf and parameterized Film detail leaf; this supports direct links without a live movie API.
- Keep the actor-entry interface in its own presentation component with independently tokenized name highlights and visit-only state; this isolates custom cast entries from the curated catalog without adding backend behavior.
- Group discipline links on the Studies leaf while preserving their direct routes; this consolidates navigation without removing learning content.
- Keep custom navigation shortcuts in a browser-only, visit-scoped shared store with a fixed empty SSR snapshot; this preserves shortcuts across page navigation without adding persistence or server behavior.
- Keep custom studies added from the Studies page in the same browser-only, visit-scoped store pattern; this isolates them from the built-in discipline cards.
- Keep added AI model entries as visit-only interface settings, without implying a live provider connection; this separates model management from future AI execution.
- Use licensed Cburnett chess piece assets with semantic board tokens; this keeps pieces readable on both square colors.
- Keep the chess game (board, clocks, mode, AI move loop) in the module-level store src/lib/chess-store.ts, not in the route component; this lets the game and AI-vs-AI moves keep running while the user browses other tabs.
- Keep per-side chess Elo targets in the visit-scoped chess store and validate them with a shared schema; this preserves difficulty across navigation and resets without claiming calibrated engine ratings.
