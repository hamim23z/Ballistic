// Words for each draft mode. The flow is identical; only the goal and the copy change.
// Plain strings only, so a page (server component) can hand one straight to DraftBoard.

export type DraftMode = {
  /** 'win' highlights wins on the results card, 'lose' highlights losses. */
  goal: 'win' | 'lose';
  eyebrow: string;
  /** Headline reads `${before}<accent>${after}`, with the accent in the gradient. */
  headline: { before: string; accent: string; after: string };
  /** Optional one-liner under the headline. */
  tagline?: string;
  reelIdle: string;
  pickerIdleAccent: string;
  pickerIdleHint: string;
  /** `{team}` is replaced with the spun team-era, e.g. "2010s Bobcats". */
  pickerSpunHint: string;
  fullTitle: string;
  fullHint: string;
  finalize: string;
  submitted: string;
  resultsEyebrow: string;
  resultsSubline: string;
  parLabel: string;
  /** Optional line under the record. Picked by how the result compares to par. */
  verdict?: { perfect: string; beatPar: string; missedPar: string };
  restart: string;
};

export const MODE_82_0: DraftMode = {
  goal: 'win',
  eyebrow: '82-0 · Spin & draft',
  headline: { before: 'Draft your ', accent: 'five', after: '.' },
  reelIdle: 'Spin for a player',
  pickerIdleAccent: 'player',
  pickerIdleHint: 'Spin to land on a team and era, then pick one player from that roster.',
  pickerSpunHint: 'Choose one {team} player and the open spot they’ll play.',
  fullTitle: 'Lineup full',
  fullHint: 'Tap a player on the court to move them, or finalize your lineup.',
  finalize: 'Finalize lineup',
  submitted: 'Submitted',
  resultsEyebrow: 'Projected season',
  resultsSubline: 'Projected wins out of 82',
  parLabel: 'Par',
  restart: 'New draft',
};

export const MODE_0_82: DraftMode = {
  goal: 'lose',
  eyebrow: '0-82 · Spin & tank',
  headline: { before: 'Draft your ', accent: 'worst', after: ' five.' },
  tagline: 'Zero wins. Zero chemistry. Zero problem.',
  reelIdle: 'Spin for a liability',
  pickerIdleAccent: 'liability',
  pickerIdleHint: 'Spin to land on a team and era, then pick the one player most likely to cost you the game.',
  pickerSpunHint: 'Choose one {team} player and the open spot they’ll brick from.',
  fullTitle: 'Tank assembled',
  fullHint: 'Tap a player on the court to move them, or lock in the tank.',
  finalize: 'Lock in the tank',
  submitted: 'Tank locked',
  resultsEyebrow: 'Projected collapse',
  resultsSubline: 'Losses out of 82. Every win is a mistake.',
  parLabel: 'Win cap',
  verdict: {
    perfect: 'Flawless. Not a single W. The ping-pong balls are sending flowers.',
    beatPar: 'Gloriously bad. Somebody still hit a buzzer-beater by accident, though.',
    missedPar: 'Too good to be this bad. Someone on this roster forgot how to miss.',
  },
  restart: 'Tank again',
};
