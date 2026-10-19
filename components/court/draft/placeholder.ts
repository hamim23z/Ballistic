import type { DraftPlayer, DraftResult, DraftSpin } from '@/components/court/draft/types';

// PLACEHOLDER DATA ONLY: hardcoded team-eras, rosters and a fake result so
// the 82-0 draft screen can be judged visually. Safe to delete.

export const PLACEHOLDER_SPINS: DraftSpin[] = [
  { id: 'bos-1960s', team: 'Celtics', era: '1960s' },
  { id: 'lal-1980s', team: 'Lakers', era: '1980s' },
  { id: 'bos-1980s', team: 'Celtics', era: '1980s' },
  { id: 'chi-1990s', team: 'Bulls', era: '1990s' },
  { id: 'sas-2000s', team: 'Spurs', era: '2000s' },
  { id: 'gsw-2010s', team: 'Warriors', era: '2010s' },
  { id: 'den-2020s', team: 'Nuggets', era: '2020s' },
];

type Row = [name: string, positions: DraftPlayer['positions']];

const ROSTERS: Record<string, Row[]> = {
  'bos-1960s': [['Bob Cousy', ['PG']], ['Sam Jones', ['SG']], ['John Havlicek', ['SF', 'SG']], ['Tom Heinsohn', ['PF']], ['Bill Russell', ['C']]],
  'lal-1980s': [['Magic Johnson', ['PG']], ['Byron Scott', ['SG']], ['Michael Cooper', ['SG', 'SF']], ['James Worthy', ['SF']], ['Kurt Rambis', ['PF']], ['Kareem Abdul-Jabbar', ['C']]],
  'bos-1980s': [['Dennis Johnson', ['PG']], ['Danny Ainge', ['SG']], ['Larry Bird', ['SF', 'PF']], ['Kevin McHale', ['PF']], ['Robert Parish', ['C']]],
  'chi-1990s': [['Ron Harper', ['PG', 'SG']], ['Michael Jordan', ['SG']], ['Scottie Pippen', ['SF']], ['Toni Kukoč', ['SF', 'PF']], ['Dennis Rodman', ['PF']], ['Luc Longley', ['C']]],
  'sas-2000s': [['Tony Parker', ['PG']], ['Manu Ginóbili', ['SG']], ['Bruce Bowen', ['SF']], ['Tim Duncan', ['PF', 'C']], ['David Robinson', ['C']]],
  'gsw-2010s': [['Stephen Curry', ['PG']], ['Klay Thompson', ['SG']], ['Kevin Durant', ['SF', 'PF']], ['Draymond Green', ['PF']], ['Andrew Bogut', ['C']]],
  'den-2020s': [['Jamal Murray', ['PG']], ['Kentavious Caldwell-Pope', ['SG']], ['Michael Porter Jr.', ['SF']], ['Aaron Gordon', ['PF']], ['Nikola Jokić', ['C']]],
};

export const PLACEHOLDER_PLAYERS: DraftPlayer[] = PLACEHOLDER_SPINS.flatMap((spin) =>
  ROSTERS[spin.id].map(([name, positions], i) => ({
    id: `${spin.id}-${i}`,
    name,
    team: spin.team,
    era: spin.era,
    positions,
  })),
);

export const PLACEHOLDER_RESULT: DraftResult = { wins: 64, par: 58 };
