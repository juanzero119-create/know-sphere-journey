import { useSyncExternalStore } from 'react';
import moveAsset from '@/assets/chess-move.mp3.asset.json';
import endAsset from '@/assets/chess-game-end.mp3.asset.json';

// Browser-only one-shot sounds for the chess game. Safe to call from the
// module-level store; no-ops during SSR. Both clips are fetched and decoded
// into Web Audio buffers up front so playback starts with no decode delay.
let ctx: AudioContext | null = null;
const buffers: Partial<Record<'move' | 'end', AudioBuffer>> = {};
let loadPromise: Promise<void> | null = null;

// Mute state: visit-scoped flag persisted to localStorage so the choice
// survives reloads. play() checks it before every sound.
const MUTE_KEY = 'lexi-chess-muted';
const muteListeners = new Set<() => void>();
let muted =
  typeof window !== 'undefined' && window.localStorage.getItem(MUTE_KEY) === '1';

export function subscribeChessMute(listener: () => void) {
  muteListeners.add(listener);
  return () => {
    muteListeners.delete(listener);
  };
}
const getMuteServerSnapshot = () => false;
export function useChessMuted() {
  return useSyncExternalStore(subscribeChessMute, () => muted, getMuteServerSnapshot);
}

export function setChessMuted(value: boolean) {
  if (muted === value) return;
  muted = value;
  try {
    window.localStorage.setItem(MUTE_KEY, value ? '1' : '0');
  } catch {
    // Storage may be unavailable; the flag still applies for this visit.
  }
  muteListeners.forEach((l) => l());
}

// Skip the small bit of silence at the start of each clip.
const START_OFFSET: Record<'move' | 'end', number> = { move: 0, end: 0.07 };

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

async function loadBuffers(audio: AudioContext) {
  const entries: Array<['move' | 'end', string]> = [
    ['move', moveAsset.url],
    ['end', endAsset.url],
  ];
  await Promise.all(
    entries.map(async ([kind, url]) => {
      try {
        const res = await fetch(url);
        const data = await res.arrayBuffer();
        buffers[kind] = await audio.decodeAudioData(data);
      } catch {
        // Ignore; playback just no-ops if a clip failed to load.
      }
    }),
  );
}

function ensureLoaded(): AudioContext | null {
  const audio = getContext();
  if (!audio) return null;
  if (!loadPromise) loadPromise = loadBuffers(audio);
  return audio;
}

// Start fetching and decoding both clips as soon as this module loads in the
// browser, so the first move/end sound is already decoded and instant.
if (typeof window !== 'undefined') {
  const warm = () => ensureLoaded();
  window.addEventListener('pointerdown', warm, { once: true });
  window.addEventListener('keydown', warm, { once: true });
  warm();
}

function play(kind: 'move' | 'end') {
  if (muted) return;
  const audio = ensureLoaded();
  const buffer = buffers[kind];
  if (!audio || !buffer) return;
  const source = audio.createBufferSource();
  source.buffer = buffer;
  source.connect(audio.destination);
  source.start(0, START_OFFSET[kind]);
}

export function playMoveSound() {
  play('move');
}

export function playGameEndSound() {
  play('end');
}
