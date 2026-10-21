import type { ReactNode } from 'react';
import type { TickerState } from './types';

const Icon = {
  pause: <svg viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="2" width="3.5" height="12" rx="1" fill="currentColor" /><rect x="9.5" y="2" width="3.5" height="12" rx="1" fill="currentColor" /></svg>,
  play: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5v11l9-5.5z" fill="currentColor" /></svg>,
  skip: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 3v10l6-5zM8 3v10l6-5z" fill="currentColor" /></svg>,
};

export type SpeedControls = {
  /** False before tip-off: the buttons show but do nothing yet. */
  active: boolean;
  paused: boolean;
  speed: 1 | 2 | 4;
  onTogglePause: () => void;
  onSpeed: (s: 1 | 2 | 4) => void;
  onSkip: () => void;
};

export function Controls({ c, className }: { c: SpeedControls; className: string }) {
  return (
    <div className={`ctrl ${className}`}>
      <button type="button" className={c.active && !c.paused ? 'on' : ''} disabled={!c.active} onClick={c.onTogglePause} aria-label={c.paused ? 'Resume' : 'Pause'}>
        {c.active && !c.paused ? Icon.pause : Icon.play}
      </button>
      {([1, 2, 4] as const).map((s) => (
        <button key={s} type="button" className={c.speed === s ? 'on' : ''} disabled={!c.active} onClick={() => c.onSpeed(s)}>
          {s}x
        </button>
      ))}
      <button type="button" title="Skip to final" aria-label="Skip to final" disabled={!c.active} onClick={c.onSkip}>
        {Icon.skip}
      </button>
    </div>
  );
}

export default function Ticker({ t, controls, extra }: { t: TickerState; controls: SpeedControls | null; extra?: ReactNode }) {
  return (
    <div className="ticker">
      <div className={`poss ${t.side}`}>
        <span>
          {t.big}
          <small>{t.small}</small>
        </span>
      </div>
      <div className="pbp" aria-live="polite">
        <span className={`tag ${t.hot ? 'hot' : ''}`}>{t.tag}</span>
        <span>{t.text}</span>
        <span className="time">{t.time}</span>
      </div>
      {controls ? <Controls c={controls} className="d-only" /> : extra}
    </div>
  );
}
