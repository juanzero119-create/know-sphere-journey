import { useEffect, useSyncExternalStore } from 'react';

export interface AiModel {
  id: string;
  name: string;
  maker: string;
  note: string;
}

export type ChessSide = 'w' | 'b';

export const defaultModels: AiModel[] = [
  { id: 'openai/gpt-6-astra', name: 'GPT-6 Astra', maker: 'OpenAI', note: 'Balanced default — strong reasoning.' },
  { id: 'openai/gpt-6-luna', name: 'GPT-6 Luna', maker: 'OpenAI', note: 'Fast and light for quick answers.' },
  { id: 'anthropic/claude-sonnet-5', name: 'Claude Sonnet 5', maker: 'Anthropic', note: 'Thoughtful, clear explanations.' },
  { id: 'anthropic/claude-haiku-4-5', name: 'Claude Haiku 4.5', maker: 'Anthropic', note: 'Quick and inexpensive.' },
  { id: 'google/gemini-3-flash', name: 'Gemini 3 Flash', maker: 'Google', note: 'Fast multimodal model.' },
];

export const DEFAULT_MODEL = 'openai/gpt-6-astra';

const KEYS: Record<ChessSide, string> = { w: 'lexi-ai-model-w', b: 'lexi-ai-model-b' };
const LEGACY_KEY = 'lexi-ai-model';

export interface ChessModelsState {
  models: AiModel[];
  selected: Record<ChessSide, string>;
}

// Fixed empty snapshot for SSR: the browser fills in the saved choices after hydration.
const serverSnapshot: ChessModelsState = {
  models: defaultModels,
  selected: { w: DEFAULT_MODEL, b: DEFAULT_MODEL },
};

let state: ChessModelsState = serverSnapshot;
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function subscribeChessModels(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): ChessModelsState {
  return state;
}
function getServerSnapshot(): ChessModelsState {
  return serverSnapshot;
}

function isKnown(id: string | null): id is string {
  return id !== null && defaultModels.some((model) => model.id === id);
}

function readSide(side: ChessSide): string {
  const saved = localStorage.getItem(KEYS[side]) ?? localStorage.getItem(LEGACY_KEY);
  return isKnown(saved) ? saved : DEFAULT_MODEL;
}

function hydrate() {
  if (hydrated || typeof window === 'undefined') return;
  hydrated = true;
  const selected: Record<ChessSide, string> = { w: readSide('w'), b: readSide('b') };
  if (selected.w !== state.selected.w || selected.b !== state.selected.b) {
    state = { models: state.models, selected };
    emit();
  }
}

export function useChessModels() {
  useEffect(() => {
    hydrate();
  }, []);
  return useSyncExternalStore(subscribeChessModels, getSnapshot, getServerSnapshot);
}

// Model chosen for one colour, read by the AI move loop.
export function getChessModelFor(side: ChessSide): string {
  if (typeof window === 'undefined') return DEFAULT_MODEL;
  hydrate();
  return state.selected[side];
}

export function modelById(models: AiModel[], id: string): AiModel {
  return (
    models.find((model) => model.id === id) ??
    models[0] ?? { id: DEFAULT_MODEL, name: 'GPT-6 Astra', maker: 'OpenAI', note: '' }
  );
}

export function isDefaultModel(id: string) {
  return defaultModels.some((model) => model.id === id);
}

function persist(side: ChessSide, id: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEYS[side], id);
}

export function chooseChessModel(side: ChessSide, id: string) {
  hydrate();
  if (!state.models.some((model) => model.id === id) || state.selected[side] === id) return;
  state = { models: state.models, selected: { ...state.selected, [side]: id } };
  persist(side, id);
  emit();
}

export function chooseChessModelForBoth(id: string) {
  hydrate();
  if (!state.models.some((model) => model.id === id)) return;
  state = { models: state.models, selected: { w: id, b: id } };
  persist('w', id);
  persist('b', id);
  emit();
}

export function addChessModel(input: { name: string; maker: string; id: string }) {
  hydrate();
  const id = input.id.trim();
  const name = input.name.trim();
  const maker = input.maker.trim();
  if (!id || !name || !maker || state.models.some((model) => model.id === id)) return false;
  state = {
    models: [...state.models, { id, name, maker, note: 'Custom model · Not connected' }],
    selected: state.selected,
  };
  emit();
  return true;
}

export function removeChessModel(id: string) {
  if (!state.models.some((model) => model.id === id)) return;
  const selected = { ...state.selected };
  (Object.keys(KEYS) as ChessSide[]).forEach((side) => {
    if (selected[side] === id) {
      selected[side] = DEFAULT_MODEL;
      persist(side, DEFAULT_MODEL);
    }
  });
  state = { models: state.models.filter((model) => model.id !== id), selected };
  emit();
}
