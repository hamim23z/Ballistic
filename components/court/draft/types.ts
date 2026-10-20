import type { PositionId } from '@/components/court/modes';

export type DraftPlayer = {
  id: string;
  name: string;
  team: string;
  era: string;
  positions: PositionId[];
  stats: PlayerStats;
};

/** Per-game averages. null shows as a dash (e.g. not tracked in that era). */
export type PlayerStats = {
  ppg: number | null;
  apg: number | null;
  rpg: number | null;
  spg: number | null;
  bpg: number | null;
};

/** What one spin lands on: a franchise in a given era, e.g. 1990s Bulls. */
export type DraftSpin = {
  id: string;
  team: string;
  era: string;
};

export type DraftResult = {
  wins: number;
  par: number;
};

export type Lineup = Record<PositionId, DraftPlayer | null>;

export function spinLabel(spin: DraftSpin) {
  return `${spin.era} ${spin.team}`;
}
