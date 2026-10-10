import { z } from 'zod';

export const eloSchema = z.number().int().min(400).max(2400).multipleOf(100);
export const DEFAULT_ELO = 1200;
export const eloPresets = [
  { elo: 400, label: 'Beginner' },
  { elo: 800, label: 'Casual' },
  { elo: 1200, label: 'Intermediate' },
  { elo: 1600, label: 'Advanced' },
  { elo: 2000, label: 'Expert' },
  { elo: 2400, label: 'Master' },
] as const;

export function eloLabel(elo: number) {
  return [...eloPresets].reverse().find(preset => elo >= preset.elo)?.label ?? 'Beginner';
}