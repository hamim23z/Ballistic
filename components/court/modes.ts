export type PositionId = 'PG' | 'SG' | 'SF' | 'PF' | 'C';

export type CourtPosition = {
  id: PositionId;
  name: string;
  /** Spot on the court, in the court SVG's 500 x 470 coordinate space. */
  x: number;
  y: number;
  /** Game mode copy shown in the dialog. Left blank on purpose: fill these in. */
  modeTitle: string;
  modeDescription: string;
};

export const POSITIONS: CourtPosition[] = [
  { id: 'PG', name: 'Point Guard', x: 250, y: 372, modeTitle: '', modeDescription: '' },
  { id: 'SG', name: 'Shooting Guard', x: 418, y: 262, modeTitle: '', modeDescription: '' },
  { id: 'SF', name: 'Small Forward', x: 82, y: 262, modeTitle: '', modeDescription: '' },
  { id: 'PF', name: 'Power Forward', x: 342, y: 150, modeTitle: '', modeDescription: '' },
  { id: 'C', name: 'Center', x: 168, y: 104, modeTitle: '', modeDescription: '' },
];
