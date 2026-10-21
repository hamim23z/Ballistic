import { useId } from 'react';
import type { Pt, Row, Side } from './types';

const pct = ([x, y]: Pt): [number, number] => [((x + 2) / 98) * 100, ((y + 2) / 54) * 100];

function CourtSvg() {
  const id = useId().replace(/:/g, '');
  const line = '#c48a5c';
  const L = { stroke: line, strokeWidth: 0.35, opacity: 0.75 } as const;
  const NF = { ...L, fill: 'none' } as const;
  const half = (flip: boolean) => (
    <g transform={flip ? 'translate(94 0) scale(-1 1)' : undefined}>
      <rect x="0" y="17" width="19" height="16" {...L} fill={flip ? 'rgba(79,140,255,.14)' : 'rgba(255,90,31,.14)'} />
      <circle cx="19" cy="25" r="6" {...NF} />
      <path d="M0 3 H14 A23.75 23.75 0 0 1 14 47 H0" {...NF} />
      <path d="M4 22 V28" stroke={line} strokeWidth=".5" />
      <circle cx="5.25" cy="25" r=".9" stroke="#ff7a45" strokeWidth=".4" fill="none" />
      <path d="M5.25 21 A4 4 0 0 1 5.25 29" {...NF} />
    </g>
  );
  return (
    <svg className="floor" viewBox="-2 -2 98 54" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}fl`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1b2234" />
          <stop offset="1" stopColor="#121829" />
        </linearGradient>
        <radialGradient id={`${id}cg`} cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="rgba(255,138,61,.10)" />
          <stop offset="1" stopColor="rgba(255,138,61,0)" />
        </radialGradient>
        <pattern id={`${id}pl`} width="94" height="2.2" patternUnits="userSpaceOnUse">
          <rect width="94" height="2.2" fill="none" />
          <line x1="0" x2="94" y1="2.2" y2="2.2" stroke="rgba(255,255,255,.025)" strokeWidth=".15" />
        </pattern>
      </defs>
      <rect x="-2" y="-2" width="98" height="54" rx="1.5" fill="#0d1220" />
      <rect x="0" y="0" width="94" height="50" fill={`url(#${id}fl)`} />
      <rect x="0" y="0" width="94" height="50" fill={`url(#${id}pl)`} />
      <circle cx="47" cy="25" r="16" fill={`url(#${id}cg)`} />
      <rect x="0" y="0" width="94" height="50" {...NF} />
      <line x1="47" y1="0" x2="47" y2="50" {...NF} />
      <circle cx="47" cy="25" r="6" {...NF} />
      <circle cx="47" cy="25" r="2" {...NF} />
      {half(false)}
      {half(true)}
    </svg>
  );
}

export type CourtProps = {
  pos: { you: Pt[]; opp: Pt[] };
  rows: { you: Row[]; opp: Row[] };
  ball: Pt;
  /** Who has the ball right now, during a live game. */
  holder: { side: Side; i: number } | null;
  live: boolean;
  /** Names show under every dot on your side before tip-off. */
  labelYou: boolean;
  hideOpp?: boolean;
};

/** Perspective court on desktop, a flat court on phones. Same ten dots on both. */
export default function Court({ pos, rows, ball, holder, live, labelYou, hideOpp }: CourtProps) {
  const sides: Side[] = hideOpp ? ['you'] : ['you', 'opp'];
  const chipClass = (side: Side, i: number) => {
    const r = rows[side][i];
    const has = holder?.side === side && holder.i === i;
    return `chip ${side === 'you' ? 'y' : 'o'} ${has ? 'has' : ''} ${r.flag === 'in' ? 'inn' : ''} ${r.flag === 'open' ? 'open' : ''}`;
  };
  const [bl, bt] = pct(ball);

  return (
    <>
      <div className="court-wrap d-only" aria-hidden="true">
        <div className="court">
          <CourtSvg />
          {sides.flatMap((side) =>
            pos[side].map((p, i) => {
              const [l, t] = pct(p);
              const r = rows[side][i];
              const has = holder?.side === side && holder.i === i;
              const label = (live ? has : side === 'you' && labelYou) && r.short;
              return (
                <div key={`${side}${i}`} className="dot" style={{ left: `${l}%`, top: `${t}%` }}>
                  <div className="shadow" />
                  <div className="up">
                    <div className={chipClass(side, i)}>{r.num}</div>
                    {label ? <div className="name">{label}</div> : null}
                  </div>
                </div>
              );
            }),
          )}
          <div className="ballp" style={{ left: `${bl}%`, top: `${bt}%` }}>
            <div className="up">
              <div className="b" />
            </div>
          </div>
        </div>
      </div>
      <div className="mcourt m-only" aria-hidden="true">
        <CourtSvg />
        {sides.flatMap((side) =>
          pos[side].map((p, i) => {
            const [l, t] = pct(p);
            return (
              <div key={`${side}${i}`} className="mdot" style={{ left: `${l}%`, top: `${t}%` }}>
                <div className={chipClass(side, i)}>{rows[side][i].num}</div>
              </div>
            );
          }),
        )}
        <div className="mball" style={{ left: `${bl}%`, top: `${bt}%` }} />
      </div>
    </>
  );
}
