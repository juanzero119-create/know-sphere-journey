import moveAsset from '@/assets/chess-move.mp3.asset.json';
import endAsset from '@/assets/chess-game-end.mp3.asset.json';

// Browser-only one-shot sounds for the chess game. Safe to call from the
// module-level store; no-ops during SSR.
function play(url: string) {
  if (typeof window === 'undefined') return;
  const audio = new Audio(url);
  void audio.play().catch(() => {
    // Browsers block audio before the first user gesture; ignore.
  });
}

export function playMoveSound() {
  play(moveAsset.url);
}

export function playGameEndSound() {
  play(endAsset.url);
}
