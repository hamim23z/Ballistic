import type { PositionId } from '@/components/court/modes';

export type DraftPlayer = {
  id: string;
  name: string;
  era: string;
  positions: PositionId[];
};

export type DraftResult = {
  wins: number;
  par: number;
};

export type Lineup = Record<PositionId, DraftPlayer | null>;
