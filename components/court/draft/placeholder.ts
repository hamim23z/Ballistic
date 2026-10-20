import type { DraftPlayer, DraftResult, DraftSpin } from '@/components/court/draft/types';

// PLACEHOLDER DATA ONLY: hardcoded team-eras, rosters, made-up stats and a fake result so
// the 82-0 draft screen can be judged visually. Safe to delete.

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

export const PLACEHOLDER_PLAYERS: DraftPlayer[] = PLACEHOLDER_SPINS.flatMap((spin) =>
  ROSTERS[spin.id].map(([name, positions, [ppg, apg, rpg, spg, bpg]], i) => ({
    id: `${spin.id}-${i}`,
    name,
    team: spin.team,
    era: spin.era,
    positions,
    stats: { ppg, apg, rpg, spg, bpg },
  })),
);

export const PLACEHOLDER_RESULT: DraftResult = { wins: 64, par: 58 };
