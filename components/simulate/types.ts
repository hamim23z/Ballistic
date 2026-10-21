import type { PositionId } from '@/components/court/modes';

export type Side = 'you' | 'opp';
export type Pt = [number, number];

/** Sample stat tuple: minutes, points, FG made, FG attempted, rebounds, assists, fouls. */
export type StatLine = [number, number, number, number, number, number, number];

export type Row = {
  pos: PositionId;
  name: string;
  short: string;
  /** Jersey number, or the position label for an empty slot. */
  num: number | string;
  min: number;
  pts: number;
  fgm: number;
  fga: number;
  reb: number;
  ast: number;
  pf: number;
  flag?: 'in' | 'out' | 'open';
};

export type SimPlayer = {
  id: number;
  name: string;
  short: string;
  num: number;
  positions: PositionId[];
  era: string;
};

export type TeamRef = { era: string; abbr: string };

export type Config = {
  mode: 'one' | 'season';
  team: '82' | 'build';
  opp: 'random' | 'choose';
  chosen: TeamRef | null;
  seasonEra: string;
  speed: 'live' | 'instant';
  picks: (SimPlayer | null)[];
};

export type Phase = 'setup' | 'picker' | 'build' | 'live' | 'final' | 'season';

export type Lineups = {
  you: Row[];
  opp: Row[];
  benchYou: Row[];
  benchOpp: Row[];
  oppName: string;
  oppShort: string;
  oppTag: string;
  youTag: string;
};

export type TickerState = {
  side: 'y' | 'o';
  big: string;
  small: string;
  text: string;
  tag: string;
  hot: boolean;
  time: string;
};

export type Snapshot = {
  sy: number;
  so: number;
  clock: string;
  shot: number;
  fy: number;
  fo: number;
  wy: number;
  hist: number[];
  pos: { you: Pt[]; opp: Pt[] };
  ball: Pt;
  holder: { side: Side; i: number } | null;
  rows: { you: Row[]; opp: Row[] };
  bench: { you: Row[]; opp: Row[] };
  ticker: TickerState;
  splash: { big: string; who: string; cls: string } | null;
  flash: { side: Side; i: number } | null;
  bump: { you: boolean; opp: boolean };
  done: boolean;
};
