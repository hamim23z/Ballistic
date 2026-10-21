import type { PositionId } from '@/components/court/modes';
import type { Config, Lineups, Row, SimPlayer, StatLine, TeamRef } from './types';

/* Everything in this file is sample data so the screens have something to show. */

export const POSITION_ORDER: PositionId[] = ['PG', 'SG', 'SF', 'PF', 'C'];
export const ERAS = ['1940s', '1950s', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s'];

type Team = [abbr: string, name: string];

const THIRTY: Team[] = [
  ['ATL', 'Hawks'], ['BOS', 'Celtics'], ['BKN', 'Nets'], ['CHA', 'Hornets'], ['CHI', 'Bulls'], ['CLE', 'Cavaliers'],
  ['DAL', 'Mavericks'], ['DEN', 'Nuggets'], ['DET', 'Pistons'], ['GSW', 'Warriors'], ['HOU', 'Rockets'], ['IND', 'Pacers'],
  ['LAC', 'Clippers'], ['LAL', 'Lakers'], ['MEM', 'Grizzlies'], ['MIA', 'Heat'], ['MIL', 'Bucks'], ['MIN', 'Timberwolves'],
  ['NOP', 'Pelicans'], ['NYK', 'Knicks'], ['OKC', 'Thunder'], ['ORL', 'Magic'], ['PHI', '76ers'], ['PHX', 'Suns'],
  ['POR', 'Trail Blazers'], ['SAC', 'Kings'], ['SAS', 'Spurs'], ['TOR', 'Raptors'], ['UTA', 'Jazz'], ['WAS', 'Wizards'],
];

const CLASSIC: Team[] = [
  ['BOS', 'Celtics'], ['NYK', 'Knicks'], ['LAL', 'Lakers'], ['PHI', '76ers'], ['GSW', 'Warriors'], ['ATL', 'Hawks'],
  ['CLE', 'Cavaliers'], ['DET', 'Pistons'], ['WAS', 'Bullets'], ['CHI', 'Bulls'], ['SEA', 'SuperSonics'], ['HOU', 'Rockets'],
  ['PHX', 'Suns'], ['MIL', 'Bucks'], ['POR', 'Trail Blazers'], ['SAC', 'Kings'], ['NJN', 'Nets'], ['SAS', 'Spurs'],
  ['DEN', 'Nuggets'], ['IND', 'Pacers'], ['UTA', 'Jazz'], ['DAL', 'Mavericks'], ['LAC', 'Clippers'], ['CHA', 'Hornets'],
  ['MIA', 'Heat'], ['ORL', 'Magic'], ['MIN', 'Timberwolves'], ['TOR', 'Raptors'], ['VAN', 'Grizzlies'],
];

/** Teams per era. Older eras had fewer teams, so the grids shrink. */
export const ERA_TEAMS: Record<string, Team[]> = {
  '1940s': [['BOS', 'Celtics'], ['NYK', 'Knicks'], ['LAL', 'Lakers'], ['PHW', 'Warriors'], ['DET', 'Pistons'], ['ROC', 'Royals'], ['WAS', 'Capitols'], ['CHI', 'Stags'], ['BAL', 'Bullets'], ['SYR', 'Nationals']],
  '1950s': [['BOS', 'Celtics'], ['NYK', 'Knicks'], ['LAL', 'Lakers'], ['PHW', 'Warriors'], ['SYR', 'Nationals'], ['DET', 'Pistons'], ['STL', 'Hawks'], ['CIN', 'Royals']],
  '1960s': [['BOS', 'Celtics'], ['NYK', 'Knicks'], ['LAL', 'Lakers'], ['PHI', '76ers'], ['SFW', 'Warriors'], ['STL', 'Hawks'], ['CIN', 'Royals'], ['DET', 'Pistons'], ['BAL', 'Bullets'], ['CHI', 'Bulls'], ['SEA', 'SuperSonics'], ['HOU', 'Rockets'], ['PHX', 'Suns'], ['MIL', 'Bucks']],
  '1970s': CLASSIC.slice(0, 20),
  '1980s': CLASSIC.slice(0, 24),
  '1990s': CLASSIC,
  '2000s': THIRTY,
  '2010s': THIRTY,
  '2020s': THIRTY,
};

export function teamName(ref: TeamRef): string {
  return ERA_TEAMS[ref.era]?.find((t) => t[0] === ref.abbr)?.[1] ?? ref.abbr;
}

/** The player search and "Most chosen" list. */
export const PLAYERS: SimPlayer[] = (
  [
    ['Michael Jordan', 'Jordan', 23, ['SG', 'SF'], '1990S BULLS'],
    ['LeBron James', 'LeBron', 23, ['SF', 'PF', 'PG'], '2010S HEAT / CAVALIERS'],
    ['Stephen Curry', 'Curry', 30, ['PG'], '2010S WARRIORS'],
    ['Kobe Bryant', 'Kobe', 24, ['SG', 'SF'], '2000S LAKERS'],
    ['Magic Johnson', 'Magic', 32, ['PG', 'SG'], '1980S LAKERS'],
    ['Larry Bird', 'Bird', 33, ['SF', 'PF'], '1980S CELTICS'],
    ['Tim Duncan', 'Duncan', 21, ['PF', 'C'], '2000S SPURS'],
    ["Shaquille O'Neal", 'Shaq', 34, ['C'], '2000S LAKERS'],
    ['Kevin Durant', 'Durant', 35, ['SF', 'PF'], '2010S WARRIORS'],
    ['Karl Malone', 'Malone', 32, ['PF'], '1990S JAZZ'],
    ['Kareem Abdul-Jabbar', 'Kareem', 33, ['C'], '1980S LAKERS'],
    ['Kevin Garnett', 'Garnett', 21, ['PF', 'C'], '2000S TIMBERWOLVES'],
    ['Dirk Nowitzki', 'Dirk', 41, ['PF'], '2000S MAVERICKS'],
    ['Hakeem Olajuwon', 'Hakeem', 34, ['C'], '1990S ROCKETS'],
    ['Charles Barkley', 'Barkley', 34, ['PF'], '1990S SUNS'],
    ['Wilt Chamberlain', 'Wilt', 13, ['C'], '1960S WARRIORS'],
    ['Bill Russell', 'Russell', 6, ['C'], '1960S CELTICS'],
    ['Allen Iverson', 'Iverson', 3, ['SG', 'PG'], '2000S 76ERS'],
    ['Dwyane Wade', 'Wade', 3, ['SG'], '2000S HEAT'],
    ['Giannis Antetokounmpo', 'Giannis', 34, ['PF', 'SF'], '2020S BUCKS'],
    ['Nikola Jokic', 'Jokic', 15, ['C'], '2020S NUGGETS'],
    ['Luka Doncic', 'Luka', 77, ['PG', 'SG'], '2020S MAVERICKS'],
    ['John Stockton', 'Stockton', 12, ['PG'], '1990S JAZZ'],
    ['Julius Erving', 'Dr. J', 6, ['SF'], '1970S 76ERS'],
    ['Scottie Pippen', 'Pippen', 33, ['SF'], '1990S BULLS'],
    ['Kawhi Leonard', 'Kawhi', 2, ['SF'], '2010S SPURS / RAPTORS'],
    ['Steve Nash', 'Nash', 13, ['PG'], '2000S SUNS'],
    ['Dennis Rodman', 'Rodman', 91, ['PF'], '1990S BULLS'],
    ['David Robinson', 'Robinson', 50, ['C'], '1990S SPURS'],
    ['Patrick Ewing', 'Ewing', 33, ['C'], '1990S KNICKS'],
    ['Isiah Thomas', 'Isiah', 11, ['PG'], '1980S PISTONS'],
    ['Jerry West', 'West', 44, ['SG', 'PG'], '1960S LAKERS'],
    ['Oscar Robertson', 'Oscar', 1, ['PG'], '1960S ROYALS'],
    ['Paul Pierce', 'Pierce', 34, ['SF'], '2000S CELTICS'],
    ['Chris Paul', 'CP3', 3, ['PG'], '2010S CLIPPERS'],
    ['James Harden', 'Harden', 13, ['SG'], '2010S ROCKETS'],
  ] as [string, string, number, PositionId[], string][]
).map(([name, short, num, positions, era], id) => ({ id, name, short, num, positions, era }));

/** Player ids in "Most chosen" order. */
export const MOST_CHOSEN = [0, 1, 2, 3, 4, 5, 6, 7, 8];

const DEFAULT_82: Pick<SimPlayer, 'name' | 'short' | 'num'>[] = [
  { name: 'Magic Johnson', short: 'Magic', num: 32 },
  { name: 'Kobe Bryant', short: 'Kobe', num: 24 },
  { name: 'LeBron James', short: 'LeBron', num: 23 },
  { name: 'Tim Duncan', short: 'Duncan', num: 21 },
  { name: "Shaquille O'Neal", short: 'Shaq', num: 34 },
];

type RosterEntry = [pos: PositionId, name: string, short: string, num: number];
type Roster = { starters: RosterEntry[]; bench: RosterEntry[] };

const ROSTERS: Record<string, Roster> = {
  '1990s|CHI': {
    starters: [['PG', 'Ron Harper', 'Harper', 9], ['SG', 'Michael Jordan', 'Jordan', 23], ['SF', 'Scottie Pippen', 'Pippen', 33], ['PF', 'Dennis Rodman', 'Rodman', 91], ['C', 'Luc Longley', 'Longley', 13]],
    bench: [['SF', 'Toni Kukoc', 'Kukoc', 7], ['PG', 'Steve Kerr', 'Kerr', 25], ['PG', 'Randy Brown', 'Brown', 1], ['C', 'Bill Wennington', 'Wennington', 34], ['SF', 'Jud Buechler', 'Buechler', 30], ['PF', 'Dickey Simpkins', 'Simpkins', 8], ['C', 'Jack Haley', 'Haley', 44], ['SG', 'Scott Burrell', 'Burrell', 24]],
  },
  '1980s|BOS': {
    starters: [['PG', 'Dennis Johnson', 'D. Johnson', 3], ['SG', 'Danny Ainge', 'Ainge', 44], ['SF', 'Larry Bird', 'Bird', 33], ['PF', 'Kevin McHale', 'McHale', 32], ['C', 'Robert Parish', 'Parish', 0]],
    bench: [['SG', 'Jerry Sichting', 'Sichting', 12], ['SF', 'Scott Wedman', 'Wedman', 11], ['PG', 'Gerald Henderson', 'Henderson', 43], ['C', 'Bill Walton', 'Walton', 5], ['PF', 'Greg Kite', 'Kite', 50], ['SF', 'Rick Carlisle', 'Carlisle', 24], ['PG', 'Jim Paxson', 'Paxson', 20], ['C', 'Fred Roberts', 'Roberts', 35]],
  },
  '2010s|GSW': {
    starters: [['PG', 'Stephen Curry', 'Curry', 30], ['SG', 'Klay Thompson', 'Thompson', 11], ['SF', 'Kevin Durant', 'Durant', 35], ['PF', 'Draymond Green', 'Green', 23], ['C', 'DeMarcus Cousins', 'Cousins', 0]],
    bench: [['SF', 'Andre Iguodala', 'Iguodala', 9], ['PG', 'Shaun Livingston', 'Livingston', 34], ['C', 'Kevon Looney', 'Looney', 5], ['SG', 'Quinn Cook', 'Cook', 4], ['PF', 'Jonas Jerebko', 'Jerebko', 8], ['SG', 'Alfonzo McKinnie', 'McKinnie', 28], ['PF', 'Jordan Bell', 'Bell', 2], ['SG', 'Damion Lee', 'Lee', 1]],
  },
};

const SAMPLE_BENCH: RosterEntry[] = [
  ['PG', 'Derek Fisher', 'Fisher', 2], ['SF', 'Michael Cooper', 'Cooper', 21], ['SG', 'Byron Scott', 'Scott', 4], ['SG', 'Rick Fox', 'Fox', 17],
  ['SF', 'Shane Battier', 'Battier', 31], ['PG', 'Mario Chalmers', 'Chalmers', 15], ['PF', 'Robert Horry', 'Horry', 25], ['C', 'Brian Shaw', 'Shaw', 20],
];

const ROSTER_KEYS = Object.keys(ROSTERS);

/** Pick a sample opponent for the "Random" option. */
export function randomOpponent(): TeamRef {
  const [era, abbr] = ROSTER_KEYS[Math.floor(Math.random() * ROSTER_KEYS.length)].split('|');
  return { era, abbr };
}

function rosterFor(ref: TeamRef): Roster {
  const known = ROSTERS[`${ref.era}|${ref.abbr}`];
  if (known) return known;
  return {
    starters: POSITION_ORDER.map((p, i) => [p, `${ref.abbr} ${p}`, `${ref.abbr} ${p}`, 10 + i] as RosterEntry),
    bench: Array.from({ length: 8 }, (_, i) => [POSITION_ORDER[i % 5], `${ref.abbr} bench ${i + 1}`, `${ref.abbr} B${i + 1}`, 20 + i] as RosterEntry),
  };
}

/* Sample box score lines. */
export const LIVE_YOU: StatLine[] = [[24, 10, 4, 8, 3, 8, 1], [25, 14, 5, 11, 3, 2, 2], [27, 17, 6, 11, 6, 5, 1], [24, 8, 3, 7, 9, 1, 2], [22, 8, 4, 6, 8, 0, 3]];
export const LIVE_OPP: StatLine[] = [[24, 6, 2, 5, 2, 3, 1], [27, 22, 8, 16, 4, 3, 2], [26, 14, 5, 10, 5, 4, 2], [25, 4, 2, 3, 12, 1, 3], [20, 8, 4, 6, 5, 1, 2]];
const BENCH_YOU: StatLine[] = [[12, 6, 2, 4, 1, 2, 1], [8, 0, 0, 2, 1, 1, 1], [11, 3, 1, 4, 1, 0, 0], [6, 0, 0, 1, 1, 0, 1], [9, 3, 1, 3, 2, 0, 0], [5, 0, 0, 1, 0, 1, 0], [7, 2, 1, 1, 2, 0, 1], [4, 0, 0, 0, 1, 1, 0]];
const BENCH_OPP: StatLine[] = [[18, 7, 3, 6, 3, 2, 1], [11, 3, 1, 2, 0, 1, 0], [6, 2, 1, 1, 0, 1, 1], [8, 0, 0, 2, 2, 0, 2], [5, 0, 0, 1, 1, 0, 0], [4, 0, 0, 0, 1, 0, 1], [2, 0, 0, 0, 0, 0, 0], [3, 0, 0, 0, 0, 0, 0]];
export const FINAL_YOU: StatLine[] = [[40, 17, 6, 12, 7, 14, 2], [41, 28, 11, 22, 5, 4, 3], [43, 30, 12, 19, 10, 8, 2], [39, 15, 6, 12, 14, 3, 3], [37, 14, 6, 10, 12, 1, 4]];
export const FINAL_OPP: StatLine[] = [[36, 12, 4, 10, 4, 5, 3], [44, 40, 15, 28, 6, 5, 2], [42, 26, 10, 18, 8, 7, 3], [40, 8, 4, 6, 17, 2, 5], [31, 14, 6, 9, 7, 2, 4]];
const ZERO: StatLine = [0, 0, 0, 0, 0, 0, 0];

export const toRow = (pos: PositionId, name: string, short: string, num: number | string, s: StatLine = ZERO, flag?: Row['flag']): Row => ({
  pos, name, short, num, min: s[0], pts: s[1], fgm: s[2], fga: s[3], reb: s[4], ast: s[5], pf: s[6], flag,
});

export const EMPTY_PICKS: (SimPlayer | null)[] = [null, null, null, null, null];

export function defaultConfig(): Config {
  return { mode: 'one', team: '82', opp: 'random', chosen: null, seasonEra: '2010s', speed: 'live', picks: EMPTY_PICKS };
}

export type Stage = 'setup' | 'live' | 'final';

/**
 * Rows for the box scores. `rand` is the team the "Random" option landed on at tip-off.
 * Before tip-off a random opponent is still a mystery, so those rows show "?".
 */
export function buildLineups(config: Config, stage: Stage, rand: TeamRef | null, seasonOpp?: TeamRef | null): Lineups {
  const oppRef = seasonOpp ?? (config.opp === 'choose' ? config.chosen : rand);
  const roster = oppRef ? rosterFor(oppRef) : null;
  const youSrc = config.team === 'build' ? config.picks : DEFAULT_82.map((p) => p);
  const youStats = stage === 'live' ? LIVE_YOU : stage === 'final' ? FINAL_YOU : null;
  const oppStats = stage === 'live' ? LIVE_OPP : stage === 'final' ? FINAL_OPP : null;

  const you = POSITION_ORDER.map((pos, i) => {
    const p = youSrc[i];
    const s = youStats?.[i] ?? ZERO;
    return p ? toRow(pos, p.name, p.short, p.num, s) : toRow(pos, 'Open', '', pos, s, 'open');
  });
  const opp = roster
    ? roster.starters.map(([pos, name, short, num], i) => toRow(pos, name, short, num, oppStats?.[i] ?? ZERO))
    : POSITION_ORDER.map((pos) => toRow(pos, '—', '', '?'));

  const benchStage = stage !== 'setup';
  const benchYou = SAMPLE_BENCH.map(([pos, name, short, num], i) => toRow(pos, name, short, num, benchStage ? BENCH_YOU[i] : ZERO));
  const benchOpp = (roster ?? rosterFor({ era: '1990s', abbr: 'CHI' })).bench.map(([pos, name, short, num], i) => toRow(pos, name, short, num, benchStage ? BENCH_OPP[i] : ZERO));

  return {
    you,
    opp,
    benchYou,
    benchOpp,
    oppName: oppRef ? `${oppRef.era} ${teamName(oppRef)}` : 'Opponent',
    oppShort: oppRef ? teamName(oppRef) : 'Opponent',
    oppTag: oppRef ? (config.opp === 'choose' || seasonOpp ? 'Your pick' : 'Random matchup') : 'Not chosen yet',
    youTag: config.team === 'build' ? 'Your custom five' : 'From your 82-0 draft',
  };
}

/** "Michael Jordan" becomes "M. Jordan". Placeholder names that start with a team code are left alone. */
export const shortName = (name: string) => (/^[A-Z]{2,4} /.test(name) ? name : name.replace(/^(\S)\S+ /, '$1. '));
