import { ERA_TEAMS } from './data';

/* Sample season and playoff data for the calendar and bracket screens. */

export type Game = {
  /** 1 to 82. */
  n: number;
  date: Date;
  opp: string;
  home: boolean;
  win: boolean;
  you: number;
  them: number;
};

export const SEASON_LENGTH = 82;
export const MONTHS: [offsetYear: number, month: number, label: string][] = [
  [0, 9, 'OCT'], [0, 10, 'NOV'], [0, 11, 'DEC'], [1, 0, 'JAN'], [1, 1, 'FEB'], [1, 2, 'MAR'], [1, 3, 'APR'],
];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const formatDate = (d: Date) => `${WEEKDAYS[d.getDay()]}, ${MONTH_NAMES[d.getMonth()]} ${d.getDate()}`;

function rng(seed: number) {
  let s = seed >>> 0;
  return () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296;
}

const seedFor = (era: string) => [...era].reduce((a, c) => a * 31 + c.charCodeAt(0), 7);

function shuffled<T>(list: T[], r: () => number): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** The year the sample season starts in, e.g. 2018 for the 2010s. */
export const seasonStartYear = (era: string) => parseInt(era, 10) + 8;

export function buildSeason(era: string): Game[] {
  const r = rng(seedFor(era));
  const teams = ERA_TEAMS[era].map((t) => t[0]);
  const y = seasonStartYear(era);
  const days: Date[] = [];
  for (const d = new Date(y, 9, 16); d <= new Date(y + 1, 3, 10); d.setDate(d.getDate() + 1)) days.push(new Date(d));
  const gameDays = shuffled(days.map((_, i) => i), r).slice(0, SEASON_LENGTH).sort((a, b) => a - b);
  const opps: string[] = [];
  while (opps.length < SEASON_LENGTH) opps.push(...shuffled(teams, r));
  const losses = new Set(shuffled([...Array(SEASON_LENGTH).keys()], r).slice(0, 22));
  return gameDays.map((di, i) => {
    const win = !losses.has(i);
    const hi = 100 + Math.floor(r() * 24);
    const lo = hi - 2 - Math.floor(r() * 16);
    return { n: i + 1, date: days[di], opp: opps[i], home: r() > 0.5, win, you: win ? hi : lo, them: win ? lo : hi };
  });
}

/* ---------------- playoffs ---------------- */

export type Slot = { seed: string; label: string; wins: number };
export type Series = {
  id: string;
  a: Slot;
  b: Slot;
  mine?: boolean;
  /** The series in progress. */
  cur?: boolean;
  tbd?: boolean;
};
export type Bracket = {
  /** Per side, rounds in order: first round up to the conference finals. */
  west: Series[][];
  east: Series[][];
  final: Series;
  /** Series id to the id of the series its winner moves into. */
  next: Record<string, string>;
  /** Ids on your path. */
  path: Set<string>;
  roundNames: string[];
  size: number;
  rival: string;
  eastChamp: string;
};

export const FINAL_ID = 'F';
const ORDER: Record<number, [number, number][]> = {
  8: [[1, 8], [4, 5], [3, 6], [2, 7]],
  4: [[1, 4], [2, 3]],
};

export function buildBracket(era: string): Bracket {
  const r = rng(seedFor(era) + 1);
  const pool = shuffled(ERA_TEAMS[era].map((t) => t[0]), r);
  const per = pool.length >= 16 ? 8 : 4;
  const rounds = per === 8 ? 3 : 2;
  const westTeams = ['YOU', ...pool.slice(0, per - 1)];
  const eastTeams = pool.slice(per - 1, 2 * per - 1);

  const side = (tag: 'a' | 'b', teams: string[], youSide: boolean): Series[][] => {
    const out: Series[][] = [];
    let alive: { pos: number; seed: number; label: string }[] = teams.map((label, i) => ({ pos: i + 1, seed: i + 1, label }));
    let matchups: [number, number][] = ORDER[per];
    for (let round = 1; round <= rounds; round++) {
      const list: Series[] = [];
      const winners: typeof alive = [];
      matchups.forEach(([sa, sb], i) => {
        const A = alive.find((t) => t.pos === sa)!;
        const B = alive.find((t) => t.pos === sb)!;
        const aWins = youSide && A.label === 'YOU' ? true : r() > 0.22;
        const loserWins = youSide && A.label === 'YOU' ? (round === 1 ? 0 : 1) : Math.floor(r() * 4);
        const s: Series = {
          id: `${tag}${round}${i}`,
          a: { seed: String(A.seed), label: A.label, wins: aWins ? 4 : loserWins },
          b: { seed: String(B.seed), label: B.label, wins: aWins ? loserWins : 4 },
          mine: A.label === 'YOU' || B.label === 'YOU',
        };
        list.push(s);
        winners.push(aWins ? A : B);
      });
      out.push(list);
      // Winners of neighbouring series meet next, in bracket order.
      alive = winners.map((w, i) => ({ pos: i + 1, seed: w.seed, label: w.label }));
      matchups = Array.from({ length: alive.length / 2 }, (_, i) => [2 * i + 1, 2 * i + 2] as [number, number]);
    }
    return out;
  };

  // West: you are the 1 seed. Stop before the conference finals so we can set that series by hand.
  const west = side('a', westTeams, true);
  const east = side('b', eastTeams, false);

  const lastW = west[rounds - 1][0];
  const prevW = west[rounds - 2];
  const rivalSlot = prevW[1];
  const rival = rivalSlot.a.wins === 4 ? rivalSlot.a.label : rivalSlot.b.label;
  west[rounds - 1] = [
    { id: lastW.id, a: { seed: '1', label: 'YOU', wins: 3 }, b: { seed: rivalSlot.a.wins === 4 ? rivalSlot.a.seed : rivalSlot.b.seed, label: rival, wins: 2 }, mine: true, cur: true },
  ];

  const eastFinal = east[rounds - 1][0];
  const eastChamp = eastFinal.a.wins === 4 ? eastFinal.a.label : eastFinal.b.label;

  const next: Record<string, string> = {};
  [west, east].forEach((sideRounds) =>
    sideRounds.forEach((list, ri) =>
      list.forEach((s) => {
        next[s.id] = ri === rounds - 1 ? FINAL_ID : sideRounds[ri + 1][Math.floor(Number(s.id.slice(2)) / 2)].id;
      }),
    ),
  );

  return {
    west,
    east,
    final: { id: FINAL_ID, a: { seed: '', label: 'West champion', wins: 0 }, b: { seed: '1', label: eastChamp, wins: 0 }, tbd: true },
    next,
    path: new Set(west.flat().filter((s) => s.mine).map((s) => s.id)),
    roundNames: rounds === 3 ? ['FIRST ROUND', 'SEMIS', 'WEST FINALS'] : ['FIRST ROUND', 'WEST FINALS'],
    size: per * 2,
    rival,
    eastChamp,
  };
}
