import { z } from 'zod';

export const timeSchema = z.object({
  minutes: z.number().int().min(1).max(60),
  incrementSec: z.number().int().min(0).max(30),
});
export type ChessTime = z.infer<typeof timeSchema>;

export const DEFAULT_TIME: ChessTime = { minutes: 3, incrementSec: 2 };

export const timePresets: { minutes: number; incrementSec: number; label: string }[] = [
  { minutes: 1, incrementSec: 0, label: 'Bullet' },
  { minutes: 3, incrementSec: 2, label: 'Blitz' },
  { minutes: 5, incrementSec: 3, label: 'Blitz+' },
  { minutes: 10, incrementSec: 0, label: 'Rapid' },
  { minutes: 15, incrementSec: 10, label: 'Rapid+' },
  { minutes: 30, incrementSec: 0, label: 'Classical' },
];

export function timeLabel(time: ChessTime) {
  return `${time.minutes}+${time.incrementSec}`;
}
