import type { Metadata } from 'next';
import SimulateBoard from '@/components/simulate/SimulateBoard';

export const metadata: Metadata = {
  title: 'Simulate',
  description: 'Watch your five play a full-court game, or run a whole 82-game season and the playoffs.',
};

export default function SimulatePage() {
  return <SimulateBoard />;
}
