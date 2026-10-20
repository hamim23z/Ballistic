/** One spell with a team. Years are the calendar years the spell starts and ends in. */
export type Stint = { team: string; from: number; to: number };

export type ChainPlayer = {
  id: string;
  name: string;
  stints: Stint[];
};

/** Why a run ended. */
export type Turnover =
  | { kind: 'wrong-pass'; player: ChainPlayer }
  | { kind: 'shot-clock' };

function shortYear(year: number) {
  return `’${String(year).slice(-2)}`;
}

export function stintLabel(stint: Stint) {
  return `${shortYear(stint.from)}–${String(stint.to).slice(-2)} ${stint.team}`;
}

export function careerSpan(player: ChainPlayer) {
  const from = Math.min(...player.stints.map((s) => s.from));
  const to = Math.max(...player.stints.map((s) => s.to));
  return `${from}–${String(to).slice(-2)}`;
}

/** The overlapping spell two players spent on the same team, if any. */
export function sharedStint(a: ChainPlayer, b: ChainPlayer): Stint | null {
  for (const x of a.stints) {
    for (const y of b.stints) {
      if (x.team !== y.team) continue;
      const from = Math.max(x.from, y.from);
      const to = Math.min(x.to, y.to);
      if (from < to) return { team: x.team, from, to };
    }
  }
  return null;
}

/** A team both played for, just never at the same time. Used for the near-miss line. */
export function sameTeamDifferentYears(a: ChainPlayer, b: ChainPlayer) {
  const teams = new Set(a.stints.map((s) => s.team));
  return b.stints.find((s) => teams.has(s.team))?.team ?? null;
}
