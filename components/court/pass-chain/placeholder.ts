import type { ChainPlayer } from '@/components/court/pass-chain/types';

// PLACEHOLDER DATA ONLY: a hardcoded pool of players and team spells so the
// Pass Chain screen can be played and judged visually. Years are approximate.

type Row = [name: string, stints: [team: string, from: number, to: number][]];

const ROWS: Row[] = [
  ['Tim Duncan', [['Spurs', 1997, 2016]]],
  ['Tony Parker', [['Spurs', 2001, 2018], ['Hornets', 2018, 2019]]],
  ['Manu Ginóbili', [['Spurs', 2002, 2018]]],
  ['Kawhi Leonard', [['Spurs', 2011, 2018], ['Raptors', 2018, 2019], ['Clippers', 2019, 2026]]],
  ['Kyle Lowry', [['Grizzlies', 2006, 2009], ['Rockets', 2009, 2012], ['Raptors', 2012, 2021], ['Heat', 2021, 2024], ['76ers', 2024, 2026]]],
  ['DeMar DeRozan', [['Raptors', 2009, 2018], ['Spurs', 2018, 2021], ['Bulls', 2021, 2024], ['Kings', 2024, 2026]]],
  ['Jimmy Butler', [['Bulls', 2011, 2017], ['Timberwolves', 2017, 2018], ['76ers', 2018, 2019], ['Heat', 2019, 2025], ['Warriors', 2025, 2026]]],
  ['Derrick Rose', [['Bulls', 2008, 2016], ['Knicks', 2016, 2017], ['Cavaliers', 2017, 2018], ['Timberwolves', 2018, 2019], ['Pistons', 2019, 2021], ['Knicks', 2021, 2023], ['Grizzlies', 2023, 2024]]],
  ['Joakim Noah', [['Bulls', 2007, 2016], ['Knicks', 2016, 2018]]],
  ['Carmelo Anthony', [['Nuggets', 2003, 2011], ['Knicks', 2011, 2017], ['Thunder', 2017, 2018], ['Rockets', 2018, 2019], ['Trail Blazers', 2019, 2021], ['Lakers', 2021, 2022]]],
  ['LeBron James', [['Cavaliers', 2003, 2010], ['Heat', 2010, 2014], ['Cavaliers', 2014, 2018], ['Lakers', 2018, 2026]]],
  ['Dwyane Wade', [['Heat', 2003, 2016], ['Bulls', 2016, 2017], ['Cavaliers', 2017, 2018], ['Heat', 2018, 2019]]],
  ['Chris Bosh', [['Raptors', 2003, 2010], ['Heat', 2010, 2016]]],
  ['Ray Allen', [['Bucks', 1996, 2003], ['SuperSonics', 2003, 2007], ['Celtics', 2007, 2012], ['Heat', 2012, 2014]]],
  ['Paul Pierce', [['Celtics', 1998, 2013], ['Nets', 2013, 2014], ['Wizards', 2014, 2015], ['Clippers', 2015, 2017]]],
  ['Kevin Garnett', [['Timberwolves', 1995, 2007], ['Celtics', 2007, 2013], ['Nets', 2013, 2015], ['Timberwolves', 2015, 2016]]],
  ['Kevin Love', [['Timberwolves', 2008, 2014], ['Cavaliers', 2014, 2023], ['Heat', 2023, 2025]]],
  ['Kyrie Irving', [['Cavaliers', 2011, 2017], ['Celtics', 2017, 2019], ['Nets', 2019, 2023], ['Mavericks', 2023, 2026]]],
  ['Kevin Durant', [['SuperSonics', 2007, 2008], ['Thunder', 2008, 2016], ['Warriors', 2016, 2019], ['Nets', 2019, 2023], ['Suns', 2023, 2025], ['Rockets', 2025, 2026]]],
  ['Kevin McHale', [['Celtics', 1980, 1993]]],
  ['Russell Westbrook', [['Thunder', 2008, 2019], ['Rockets', 2019, 2020], ['Wizards', 2020, 2021], ['Lakers', 2021, 2023], ['Clippers', 2023, 2024], ['Nuggets', 2024, 2025]]],
  ['Stephen Curry', [['Warriors', 2009, 2026]]],
  ['Klay Thompson', [['Warriors', 2011, 2024], ['Mavericks', 2024, 2026]]],
  ['Draymond Green', [['Warriors', 2012, 2026]]],
  ['Anthony Davis', [['Pelicans', 2012, 2019], ['Lakers', 2019, 2025], ['Mavericks', 2025, 2026]]],
  ['Pau Gasol', [['Grizzlies', 2001, 2008], ['Lakers', 2008, 2014], ['Bulls', 2014, 2016], ['Spurs', 2016, 2019]]],
  ['Kobe Bryant', [['Lakers', 1996, 2016]]],
  ["Shaquille O'Neal", [['Magic', 1992, 1996], ['Lakers', 1996, 2004], ['Heat', 2004, 2008], ['Suns', 2008, 2009], ['Cavaliers', 2009, 2010], ['Celtics', 2010, 2011]]],
];

export const PLACEHOLDER_CHAIN_PLAYERS: ChainPlayer[] = ROWS.map(([name, stints]) => ({
  id: name
    .normalize('NFD')
    .replace(/[̀-ͯ']/g, '')
    .toLowerCase()
    .replace(/\s+/g, '-'),
  name,
  stints: stints.map(([team, from, to]) => ({ team, from, to })),
}));

/** Who has the ball at tip-off, one per run in order. */
export const PLACEHOLDER_CHAIN_STARTS = ['tim-duncan', 'stephen-curry', 'shaquille-oneal', 'lebron-james'];

/** Earlier runs (passes made) so the results card has something to compare against. */
export const PLACEHOLDER_CHAIN_RUNS = [4, 12, 6];
