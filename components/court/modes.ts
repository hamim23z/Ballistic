export type PositionId = "PG" | "SG" | "SF" | "PF" | "C";

export type CourtPosition = {
  id: PositionId;
  name: string;
  x: number;
  y: number;
  modeTitle: string;
  modeDescription: string;
  /** Where the dialog's Start button goes. Modes without one do nothing yet. */
  href?: string;
};

export const POSITIONS: CourtPosition[] = [
  {
    id: "PG",
    name: "82-0",
    x: 250,
    y: 372,
    modeTitle: "82-0",
    href: "/court/82-0",
    modeDescription:
      "Draft the best five-man lineup in basketball history from the 1940s to today. Build a team good enough to win every game of the season.",
  },
  {
    id: "SG",
    name: "0-82",
    x: 418,
    y: 262,
    modeTitle: "0-82",
    href: "/court/0-82",
    modeDescription:
      "The reverse challenge. Not as easy as it seems. Draft the worst lineup you can and try to lose every single game.",
  },
  {
    id: "SF",
    name: "Simulate",
    x: 82,
    y: 262,
    modeTitle: "Simulate",
    modeDescription:
      "Pick your five, then play out a full 82-game season + playoffs and see what record your team actually earns and if you can win the championship.",
  },
  {
    id: "PF",
    name: "Pass Chain",
    x: 342,
    y: 150,
    modeTitle: "Pass Chain",
    modeDescription:
      "Connect two players through the teammates they shared. Find the shortest chain you can, one link at a time.",
  },
  {
    id: "C",
    name: "Mystery Player",
    x: 168,
    y: 104,
    modeTitle: "Mystery Player",
    modeDescription:
      "A hidden player, a handful of clues. Use their stats, teams and draft year to name them in as few guesses as possible.",
  },
];
