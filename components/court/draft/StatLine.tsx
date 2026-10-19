import type { PlayerStats } from '@/components/court/draft/types';

// Display scale for the little bars only: a value at or above `max` fills it.
const STATS: { key: keyof PlayerStats; label: string; long: string; max: number }[] = [
  { key: 'ppg', label: 'PPG', long: 'points', max: 32 },
  { key: 'apg', label: 'APG', long: 'assists', max: 11 },
  { key: 'rpg', label: 'RPG', long: 'rebounds', max: 20 },
  { key: 'spg', label: 'SPG', long: 'steals', max: 2.6 },
  { key: 'bpg', label: 'BPG', long: 'blocks', max: 3.2 },
];

// A five-column strip of per-game averages. The player's strongest stat
// (relative to the bar scale) is picked out in ember.
export default function StatLine({ stats }: { stats: PlayerStats }) {
  const fills = STATS.map(({ key, max }) => (stats[key] == null ? 0 : Math.min(1, stats[key] / max)));
  const best = fills.indexOf(Math.max(...fills));

  return (
    <span className="mt-3 grid grid-cols-5 gap-1.5 border-t border-court-line/80 pt-3">
      {STATS.map(({ key, label, long }, i) => {
        const value = stats[key];
        const top = i === best && value != null;
        return (
          <span key={key} className="min-w-0">
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">{label}</span>
            <span
              className={[
                'mt-0.5 block font-display text-base font-bold tabular-nums leading-tight sm:text-lg',
                value == null ? 'text-slate-600' : top ? 'text-ember-glow' : 'text-white',
              ].join(' ')}
            >
              {value == null ? '—' : value.toFixed(1)}
              <span className="sr-only">{value == null ? ` ${long} not tracked` : ` ${long} per game`}</span>
            </span>
            <span aria-hidden="true" className="mt-1.5 block h-1 overflow-hidden rounded-full bg-court-line">
              <span
                className={['block h-full rounded-full', top ? 'bg-ember' : 'bg-ember-glow/45'].join(' ')}
                style={{ width: `${fills[i] * 100}%`, animation: 'rise 0.5s ease-out both' }}
              />
            </span>
          </span>
        );
      })}
    </span>
  );
}
