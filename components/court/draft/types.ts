import type { PositionId } from '@/components/court/modes';

export type DraftPlayer = {
  id: string;
  name: string;
  team: string;
  era: string;
  positions: PositionId[];
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

export type Spins = Record<PositionId, DraftSpin | null>;

export function spinLabel(spin: DraftSpin) {
  return `${spin.era} ${spin.team}`;
}

export function shortSpinLabel(spin: DraftSpin) {
  return `’${spin.era.slice(2)} ${spin.team}`;
}
