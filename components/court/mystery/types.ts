export type Clue = {
  label: string;
  value: string;
  /** Shorter form for the flip tiles on the stage, if the full value is long. */
  short?: string;
};

export type Mystery = {
  id: string;
  /** Shown as "Mystery No. N". */
  number: number;
  answerId: string;
  name: string;
  team: string;
  years: string;
  jersey: string;
  /** In ladder order. Each one unlocked costs a point. */
  clues: Clue[];
  /** One-liner shown when the player misses it. */
  missLine: string;
  /** Optional nudges for specific wrong guesses, by player id. */
  nearMisses?: Record<string, string>;
};

export type Guess = { id: string; name: string; correct: boolean };
