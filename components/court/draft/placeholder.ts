import type { DraftPlayer, DraftResult } from '@/components/court/draft/types';

// PLACEHOLDER DATA ONLY: hardcoded players and a fake result so the 82-0
// draft screen can be judged visually. Safe to delete.

export const PLACEHOLDER_PLAYERS: DraftPlayer[] = [
  { id: 'p1', name: 'Magic Johnson', era: '1980s', positions: ['PG'] },
  { id: 'p2', name: 'Stephen Curry', era: '2010s', positions: ['PG'] },
  { id: 'p3', name: 'Oscar Robertson', era: '1960s', positions: ['PG', 'SG'] },
  { id: 'p4', name: 'Bob Cousy', era: '1950s', positions: ['PG'] },
  { id: 'p5', name: 'Michael Jordan', era: '1990s', positions: ['SG'] },
  { id: 'p6', name: 'Kobe Bryant', era: '2000s', positions: ['SG', 'SF'] },
  { id: 'p7', name: 'Jerry West', era: '1960s', positions: ['SG', 'PG'] },
  { id: 'p8', name: 'LeBron James', era: '2010s', positions: ['SF', 'PF'] },
  { id: 'p9', name: 'Larry Bird', era: '1980s', positions: ['SF', 'PF'] },
  { id: 'p10', name: 'Kevin Durant', era: '2010s', positions: ['SF', 'PF'] },
  { id: 'p11', name: 'Tim Duncan', era: '2000s', positions: ['PF', 'C'] },
  { id: 'p12', name: 'Giannis Antetokounmpo', era: '2020s', positions: ['PF'] },
  { id: 'p13', name: 'Bob Pettit', era: '1950s', positions: ['PF'] },
  { id: 'p14', name: 'Kareem Abdul-Jabbar', era: '1970s', positions: ['C'] },
  { id: 'p15', name: 'Bill Russell', era: '1960s', positions: ['C'] },
  { id: 'p16', name: 'Shaquille O’Neal', era: '2000s', positions: ['C'] },
  { id: 'p17', name: 'George Mikan', era: '1940s', positions: ['C'] },
  { id: 'p18', name: 'Nikola Jokić', era: '2020s', positions: ['C'] },
];

export const PLACEHOLDER_RESULT: DraftResult = { wins: 64, par: 58 };
