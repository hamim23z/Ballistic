import type { SearchOption } from '@/components/court/PlayerSearch';
import type { Mystery } from '@/components/court/mystery/types';

// PLACEHOLDER DATA ONLY: two hardcoded mysteries, a pool of guessable names and
// a made-up streak so the Mystery Player screen can be played and judged visually.

export const PLACEHOLDER_MYSTERIES: Mystery[] = [
  {
    id: 'sample-1',
    number: 214,
    answerId: 'dirk-nowitzki',
    name: 'Dirk Nowitzki',
    team: 'Mavericks',
    years: '1998–2019',
    jersey: '41',
    clues: [
      { label: 'Era', value: '1998–2019' },
      { label: 'Position', value: 'PF · C' },
      { label: 'Career line', value: '20.7 PPG · 7.5 RPG · 2.4 APG', short: '20.7 PPG' },
      { label: 'Draft', value: '1998 · No. 9 overall' },
      { label: 'Teams', value: 'One franchise, 21 seasons' },
      { label: 'Jersey', value: '#41' },
    ],
    missLine: 'Airball. It was Dirk the whole time. One-legged fadeaway, zero mercy.',
    nearMisses: {
      'pau-gasol': 'Close. Right era, right size, wrong side of the Atlantic.',
      'kevin-garnett': 'Long, skilled big from the same era. Not him.',
      'tim-duncan': 'One-franchise legend, yes. This one shot more threes.',
    },
  },
  {
    id: 'sample-2',
    number: 215,
    answerId: 'allen-iverson',
    name: 'Allen Iverson',
    team: '76ers',
    years: '1996–2010',
    jersey: '3',
    clues: [
      { label: 'Era', value: '1996–2010' },
      { label: 'Position', value: 'PG · SG' },
      { label: 'Career line', value: '26.7 PPG · 6.2 APG · 3.7 RPG', short: '26.7 PPG' },
      { label: 'Draft', value: '1996 · No. 1 overall' },
      { label: 'Teams', value: 'Four franchises' },
      { label: 'Jersey', value: '#3' },
    ],
    missLine: 'Airball. That was The Answer. Should have stepped over it.',
    nearMisses: {
      'kobe-bryant': 'Same draft, different coast.',
      'tracy-mcgrady': 'Scoring title, right era. Not him.',
    },
  },
];

const NAMES: [name: string, years: string][] = [
  ['Allen Iverson', '1996–10'],
  ['Carmelo Anthony', '2003–22'],
  ['Chris Bosh', '2003–16'],
  ['David Robinson', '1989–03'],
  ['DeMarcus Cousins', '2010–22'],
  ['Dikembe Mutombo', '1991–09'],
  ['Dirk Nowitzki', '1998–19'],
  ['Dwight Howard', '2004–22'],
  ['Jason Kidd', '1994–13'],
  ['Kevin Durant', '2007–26'],
  ['Kevin Garnett', '1995–16'],
  ['Kobe Bryant', '1996–16'],
  ['LeBron James', '2003–26'],
  ['Pau Gasol', '2001–19'],
  ['Paul Pierce', '1998–17'],
  ['Russell Westbrook', '2008–25'],
  ["Shaquille O'Neal", '1992–11'],
  ['Stephen Curry', '2009–26'],
  ['Steve Nash', '1996–14'],
  ['Tim Duncan', '1997–16'],
  ['Tony Parker', '2001–19'],
  ['Tracy McGrady', '1997–13'],
  ['Vince Carter', '1998–20'],
  ['Yao Ming', '2002–11'],
];

export const PLACEHOLDER_MYSTERY_POOL: SearchOption[] = NAMES.map(([name, years]) => ({
  id: name.replace(/'/g, '').toLowerCase().replace(/\s+/g, '-'),
  name,
  meta: years,
}));

/** Days in a row solved before today. */
export const PLACEHOLDER_MYSTERY_STREAK = 5;
