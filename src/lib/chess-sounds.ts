import moveAsset from '@/assets/chess-move.mp3.asset.json';
import endAsset from '@/assets/chess-game-end.mp3.asset.json';

// Browser-only one-shot sounds for the chess game. Safe to call from the
// module-level store; no-ops during SSR. Audio elements are created and
// preloaded once so playback starts instantly on every move.
let moveAudio: HTMLAudioElement | null = null;
let endAudio: HTMLAudioElement | null = null;

function getAudio(kind: 'move' | 'end'): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null;
  if (kind === 'move') {
    if (!moveAudio) {
      moveAudio = new Audio(moveAsset.url);
      moveAudio.preload = 'auto';
      moveAudio.load();
    }
    return moveAudio;
  }
  if (!endAudio) {
    endAudio = new Audio(endAsset.url);
    endAudio.preload = 'auto';
    endAudio.load();
  }
  return endAudio;
}

function play(audio: HTMLAudioElement | null) {
  if (!audio) return;
  audio.currentTime = 0;
  void audio.play().catch(() => {
    // Browsers block audio before the first user gesture; ignore.
  });
}

export function playMoveSound() {
  play(getAudio('move'));
}

export function playGameEndSound() {
  play(getAudio('end'));
}
