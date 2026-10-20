import type { Clue } from '@/components/court/mystery/types';

const FLIP_STYLE = `
.mystery-flip { transform-style: preserve-3d; transition: transform .7s cubic-bezier(.2,.8,.2,1) }
.mystery-face { backface-visibility: hidden; -webkit-backface-visibility: hidden }
`;

// The first few clues as trading-card tiles that flip face up as they unlock.
export default function ClueTiles({ clues, unlocked, muted }: { clues: Clue[]; unlocked: number; muted: boolean }) {
  return (
    <ul
      aria-label="Clue cards"
      className={[
        'grid w-full max-w-xs grid-cols-1 gap-3 transition-[filter,opacity] duration-700 max-sm:max-w-none max-sm:grid-cols-3',
        muted ? 'opacity-70 grayscale' : '',
      ].join(' ')}
    >
      <style>{FLIP_STYLE}</style>
      {clues.map((clue, i) => {
        const up = i < unlocked;
        const next = !muted && i === unlocked;
        return (
          <li key={clue.label} className="[perspective:900px]">
            <div className="mystery-flip relative h-20 sm:h-24" style={{ transform: up ? 'none' : 'rotateY(180deg)' }}>
              <div
                aria-hidden={!up}
                className="mystery-face absolute inset-0 flex flex-col justify-center rounded-xl border border-ember/50 bg-gradient-to-br from-ember/20 to-court-navy px-3 sm:px-4"
              >
                <p className="text-[10px] font-semibold uppercase tracking-wider text-ember-glow">{clue.label}</p>
                <p className="mt-1 whitespace-nowrap font-display text-[13px] font-bold leading-tight text-white sm:text-lg">
                  {clue.short ?? clue.value}
                </p>
              </div>
              <div
                aria-hidden={up}
                className={[
                  'mystery-face absolute inset-0 flex items-center justify-between rounded-xl border px-3 sm:px-4',
                  next ? 'border-dashed border-ember shadow-[0_0_24px_rgba(255,90,31,0.35)]' : 'border-court-line',
                ].join(' ')}
                style={{ transform: 'rotateY(180deg)', background: 'repeating-linear-gradient(45deg, #0f1729 0 10px, #121c31 10px 20px)' }}
              >
                <span className={`text-[10px] font-semibold uppercase tracking-wider ${next ? 'text-ember-glow' : 'text-slate-500'}`}>
                  {next ? 'Next flip' : `Clue ${i + 1}`}
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-court-line bg-court-ink font-display text-lg font-bold text-ember/60">
                  ?
                </span>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
