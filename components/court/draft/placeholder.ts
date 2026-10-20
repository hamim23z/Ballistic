import type { DraftPlayer, DraftResult, DraftSpin } from '@/components/court/draft/types';

// PLACEHOLDER DATA ONLY: hardcoded team-eras, rosters, made-up stats and a fake result so
// the 82-0 and 0-82 draft screens can be judged visually. Safe to delete.

export const PLACEHOLDER_SPINS: DraftSpin[] = [
  { id: 'bos-1960s', team: 'Celtics', era: '1960s' },
  { id: 'lal-1980s', team: 'Lakers', era: '1980s' },
  { id: 'bos-1980s', team: 'Celtics', era: '1980s' },
  { id: 'chi-1990s', team: 'Bulls', era: '1990s' },
  { id: 'bos-2000s', team: 'Celtics', era: '2000s' },
  { id: 'sas-2000s', team: 'Spurs', era: '2000s' },
  { id: 'gsw-2010s', team: 'Warriors', era: '2010s' },
  { id: 'lal-2020s', team: 'Lakers', era: '2020s' },
  { id: 'den-2020s', team: 'Nuggets', era: '2020s' },
];

type Stats = [ppg: number, apg: number, rpg: number, spg: number | null, bpg: number | null];
type Row = [name: string, positions: DraftPlayer['positions'], stats: Stats];

const ROSTERS: Record<string, Row[]> = {
  'bos-1960s': [
    ['Bob Cousy', ['PG'], [18.4, 7.5, 5.2, null, null]],
    ['Sam Jones', ['SG'], [17.7, 2.5, 4.9, null, null]],
    ['John Havlicek', ['SF', 'SG'], [20.8, 4.8, 6.3, 1.2, 0.4]],
    ['Tom Heinsohn', ['PF'], [18.6, 2.0, 8.8, null, null]],
    ['Bill Russell', ['C'], [15.1, 4.3, 22.5, null, null]],
  ],
  'lal-1980s': [
    ['Magic Johnson', ['PG'], [19.5, 11.2, 7.2, 1.9, 0.4]],
    ['Byron Scott', ['SG'], [14.1, 2.5, 2.8, 1.1, 0.3]],
    ['Michael Cooper', ['SG', 'SF'], [8.9, 4.2, 3.2, 1.0, 0.6]],
    ['James Worthy', ['SF'], [17.6, 3.0, 5.1, 1.1, 0.7]],
    ['Kurt Rambis', ['PF'], [5.2, 0.9, 5.6, 0.8, 0.5]],
    ['Kareem Abdul-Jabbar', ['C'], [24.6, 3.6, 11.2, 0.9, 2.6]],
  ],
  'bos-1980s': [
    ['Dennis Johnson', ['PG'], [14.1, 5.0, 3.9, 1.3, 0.6]],
    ['Danny Ainge', ['SG'], [11.5, 4.0, 2.7, 1.0, 0.2]],
    ['Larry Bird', ['SF', 'PF'], [24.3, 6.3, 10.0, 1.7, 0.8]],
    ['Kevin McHale', ['PF'], [17.9, 1.7, 7.3, 0.4, 1.7]],
    ['Robert Parish', ['C'], [14.5, 1.4, 9.1, 0.8, 1.5]],
  ],
  'chi-1990s': [
    ['Ron Harper', ['PG', 'SG'], [13.8, 3.9, 4.3, 1.8, 0.7]],
    ['Michael Jordan', ['SG'], [30.1, 5.3, 6.2, 2.3, 0.8]],
    ['Scottie Pippen', ['SF'], [16.1, 5.2, 6.4, 2.0, 0.8]],
    ['Toni Kukoč', ['SF', 'PF'], [11.6, 4.2, 4.2, 0.9, 0.4]],
    ['Dennis Rodman', ['PF'], [7.3, 1.8, 13.1, 0.7, 0.6]],
    ['Luc Longley', ['C'], [7.2, 1.7, 5.0, 0.4, 1.0]],
  ],
  'bos-2000s': [
    ['Rajon Rondo', ['PG'], [9.8, 7.9, 4.5, 1.7, 0.1]],
    ['Ray Allen', ['SG'], [18.9, 3.4, 4.1, 1.1, 0.2]],
    ['Paul Pierce', ['SF', 'SG', 'PF'], [19.7, 3.5, 5.6, 1.3, 0.6]],
    ['Kevin Garnett', ['PF', 'C'], [17.8, 3.7, 10.0, 1.3, 1.4]],
    ['Kendrick Perkins', ['C'], [5.4, 1.0, 5.8, 0.4, 1.1]],
  ],
  'sas-2000s': [
    ['Tony Parker', ['PG'], [15.5, 5.6, 2.7, 0.8, 0.1]],
    ['Manu Ginóbili', ['SG'], [13.3, 3.8, 3.5, 1.3, 0.3]],
    ['Bruce Bowen', ['SF'], [6.1, 1.2, 2.9, 0.9, 0.5]],
    ['Tim Duncan', ['PF', 'C'], [19.0, 3.0, 10.8, 0.7, 2.2]],
    ['David Robinson', ['C'], [21.1, 2.5, 10.6, 1.4, 3.0]],
  ],
  'gsw-2010s': [
    ['Stephen Curry', ['PG'], [24.8, 6.4, 4.7, 1.5, 0.2]],
    ['Klay Thompson', ['SG'], [19.6, 2.3, 3.5, 0.9, 0.5]],
    ['Kevin Durant', ['SF', 'PF'], [27.3, 4.4, 7.0, 1.0, 1.1]],
    ['Draymond Green', ['PF'], [8.7, 5.6, 7.0, 1.3, 0.9]],
    ['Andrew Bogut', ['C'], [9.6, 2.2, 8.7, 0.6, 1.5]],
  ],
  'lal-2020s': [
    ['Luka Dončić', ['PG', 'SG'], [28.7, 8.3, 8.7, 1.4, 0.4]],
    ['Austin Reaves', ['SG', 'SF'], [13.1, 4.1, 3.6, 0.7, 0.3]],
    ['LeBron James', ['PG', 'SG', 'SF', 'PF', 'C'], [27.0, 7.4, 7.5, 1.5, 0.7]],
    ['Rui Hachimura', ['PF', 'SF'], [12.6, 1.2, 4.9, 0.5, 0.3]],
    ['Anthony Davis', ['PF', 'C'], [24.1, 2.4, 10.6, 1.3, 2.3]],
  ],
  'den-2020s': [
    ['Jamal Murray', ['PG'], [17.5, 4.7, 3.9, 1.0, 0.3]],
    ['Kentavious Caldwell-Pope', ['SG'], [10.9, 1.8, 3.0, 1.1, 0.2]],
    ['Michael Porter Jr.', ['SF'], [15.1, 1.0, 6.7, 0.6, 0.5]],
    ['Aaron Gordon', ['PF'], [13.6, 2.6, 6.2, 0.7, 0.6]],
    ['Nikola Jokić', ['C'], [20.9, 6.9, 10.7, 1.3, 0.7]],
  ],
};

function playersFor(spins: DraftSpin[], rosters: Record<string, Row[]>): DraftPlayer[] {
  return spins.flatMap((spin) =>
    rosters[spin.id].map(([name, positions, [ppg, apg, rpg, spg, bpg]], i) => ({
      id: `${spin.id}-${i}`,
      name,
      team: spin.team,
      era: spin.era,
      positions,
      stats: { ppg, apg, rpg, spg, bpg },
    })),
  );
}

export const PLACEHOLDER_PLAYERS = playersFor(PLACEHOLDER_SPINS, ROSTERS);

export const PLACEHOLDER_RESULT: DraftResult = { wins: 64, par: 58 };

// 0-82: some famously rough team-eras.

export const PLACEHOLDER_TANK_SPINS: DraftSpin[] = [
  { id: 'phi-1970s', team: '76ers', era: '1970s' },
  { id: 'lac-1980s', team: 'Clippers', era: '1980s' },
  { id: 'dal-1990s', team: 'Mavericks', era: '1990s' },
  { id: 'van-1990s', team: 'Grizzlies', era: '1990s' },
  { id: 'nj-2000s', team: 'Nets', era: '2000s' },
  { id: 'cha-2010s', team: 'Bobcats', era: '2010s' },
  { id: 'nyk-2010s', team: 'Knicks', era: '2010s' },
  { id: 'phi-2010s', team: '76ers', era: '2010s' },
  { id: 'det-2020s', team: 'Pistons', era: '2020s' },
];

const TANK_ROSTERS: Record<string, Row[]> = {
  'phi-1970s': [
    ['Fred Carter', ['SG', 'PG'], [20.0, 4.6, 5.8, null, null]],
    ['Hal Greer', ['PG'], [5.7, 2.3, 1.8, null, null]],
    ['Tom Van Arsdale', ['SF'], [17.7, 2.5, 4.2, null, null]],
    ['John Block', ['PF'], [12.1, 1.2, 6.8, null, null]],
    ['Leroy Ellis', ['C'], [13.8, 1.4, 10.8, null, null]],
  ],
  'lac-1980s': [
    ['Norm Nixon', ['PG'], [13.7, 8.8, 2.6, 1.2, 0.0]],
    ['Derek Smith', ['SG'], [16.6, 2.3, 3.6, 0.9, 0.4]],
    ['Marques Johnson', ['SF'], [16.0, 3.5, 5.0, 1.1, 0.3]],
    ['Michael Cage', ['PF'], [10.6, 1.5, 10.1, 0.7, 0.5]],
    ['Benoit Benjamin', ['C'], [11.3, 1.4, 7.8, 0.6, 2.6]],
  ],
  'dal-1990s': [
    ['Derek Harper', ['PG'], [18.3, 5.4, 2.6, 1.5, 0.1]],
    ['Mike Iuzzolino', ['PG'], [6.4, 3.7, 1.4, 0.5, 0.0]],
    ['Jim Jackson', ['SG', 'SF'], [16.3, 4.6, 5.3, 0.8, 0.3]],
    ['Doug Smith', ['PF'], [10.4, 2.1, 5.5, 0.9, 0.5]],
    ['Sean Rooks', ['C'], [13.5, 1.2, 7.4, 0.4, 0.8]],
  ],
  'van-1990s': [
    ['Greg Anthony', ['PG'], [14.0, 6.9, 2.4, 1.6, 0.2]],
    ['Anthony Peeler', ['SG'], [14.5, 3.6, 3.3, 1.2, 0.2]],
    ['Blue Edwards', ['SF', 'SG'], [12.7, 2.4, 3.7, 1.0, 0.3]],
    ['Shareef Abdur-Rahim', ['PF', 'SF'], [18.7, 2.2, 6.9, 1.0, 0.8]],
    ['Bryant Reeves', ['C'], [16.2, 2.3, 8.1, 0.6, 0.8]],
  ],
  'nj-2000s': [
    ['Devin Harris', ['PG'], [16.9, 6.6, 3.2, 1.2, 0.3]],
    ['Courtney Lee', ['SG'], [12.5, 1.8, 3.4, 1.1, 0.4]],
    ['Chris Douglas-Roberts', ['SF', 'SG'], [9.8, 1.6, 2.4, 0.6, 0.3]],
    ['Yi Jianlian', ['PF'], [12.0, 1.0, 7.2, 0.4, 0.8]],
    ['Brook Lopez', ['C'], [18.8, 2.3, 8.6, 0.7, 1.7]],
  ],
  'cha-2010s': [
    ['Kemba Walker', ['PG'], [12.1, 4.4, 3.5, 0.9, 0.3]],
    ['D.J. Augustin', ['PG'], [11.1, 6.4, 2.6, 0.6, 0.0]],
    ['Gerald Henderson', ['SG'], [15.1, 2.4, 4.0, 0.8, 0.4]],
    ['Corey Maggette', ['SF'], [15.0, 1.6, 3.7, 0.4, 0.1]],
    ['Boris Diaw', ['PF', 'C'], [7.4, 3.9, 5.2, 0.6, 0.5]],
    ['Bismack Biyombo', ['C'], [5.2, 0.4, 5.8, 0.4, 1.8]],
  ],
  'nyk-2010s': [
    ['Langston Galloway', ['PG', 'SG'], [11.8, 3.3, 4.2, 1.1, 0.2]],
    ['Tim Hardaway Jr.', ['SG'], [11.5, 1.8, 2.2, 0.4, 0.1]],
    ['Carmelo Anthony', ['SF', 'PF'], [24.2, 3.1, 6.6, 1.2, 0.4]],
    ['Jason Smith', ['PF', 'C'], [8.0, 1.6, 4.2, 0.4, 0.6]],
    ['Cole Aldrich', ['C'], [5.5, 0.9, 5.5, 0.6, 1.1]],
  ],
  'phi-2010s': [
    ['Ish Smith', ['PG'], [14.7, 7.0, 4.3, 0.8, 0.3]],
    ['Nik Stauskas', ['SG'], [8.5, 1.6, 2.4, 0.6, 0.4]],
    ['Robert Covington', ['SF', 'PF'], [12.8, 1.4, 6.3, 1.9, 0.6]],
    ['Jerami Grant', ['PF', 'SF'], [9.7, 1.8, 4.8, 0.8, 1.5]],
    ['Nerlens Noel', ['C', 'PF'], [11.1, 1.8, 8.1, 1.8, 1.5]],
    ['Jahlil Okafor', ['C'], [17.5, 1.2, 7.0, 0.4, 1.2]],
  ],
  'det-2020s': [
    ['Cade Cunningham', ['PG'], [22.7, 7.5, 4.3, 0.9, 0.4]],
    ['Jaden Ivey', ['SG', 'PG'], [15.4, 3.8, 3.4, 0.7, 0.5]],
    ['Ausar Thompson', ['SF'], [8.8, 1.9, 6.4, 1.1, 0.9]],
    ['Isaiah Stewart', ['PF', 'C'], [11.3, 1.6, 6.6, 0.4, 0.8]],
    ['Jalen Duren', ['C'], [13.8, 2.4, 11.6, 0.6, 0.8]],
  ],
};

export const PLACEHOLDER_TANK_PLAYERS = playersFor(PLACEHOLDER_TANK_SPINS, TANK_ROSTERS);

export const PLACEHOLDER_TANK_RESULT: DraftResult = { wins: 6, par: 11 };
