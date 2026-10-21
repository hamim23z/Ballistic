import type { ReactNode } from 'react';

const Fouls = ({ n }: { n: number }) => (
  <span className="fouls">
    {Array.from({ length: 6 }, (_, i) => (
      <i key={i} className={i < n ? 'on' : ''} />
    ))}
  </span>
);

function Spark({ hist }: { hist: number[] }) {
  const w = 300;
  const h = 26;
  const n = 25;
  const pts = hist.map((v, i) => [(i / (n - 1)) * w, h - v * h]);
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const last = pts[pts.length - 1];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true">
      {[1, 2, 3].map((k) => (
        <line key={k} x1={(k * w) / 4} x2={(k * w) / 4} y1="2" y2={h - 2} stroke="#263248" strokeDasharray="2 3" />
      ))}
      <line x1="0" x2={w} y1={h / 2} y2={h / 2} stroke="#263248" strokeDasharray="2 4" />
      <path d={d} fill="none" stroke="#ff7a45" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r="3.2" fill="#ffb37a" stroke="#0a0e14" strokeWidth="1.5" />
    </svg>
  );
}

export type ScoreboardProps = {
  youName: string;
  oppName: string;
  oppShort: string;
  sy: number;
  so: number;
  clock: string;
  shot: number;
  fy: number;
  fo: number;
  wy: number;
  hist: number[];
  final: boolean;
  bump: { you: boolean; opp: boolean };
  /** True while a setup dialog is open and no opponent is locked in. */
  settingUp: boolean;
};

export default function Scoreboard(p: ScoreboardProps): ReactNode {
  const wy = Math.round(p.wy);
  return (
    <div className="board">
      <div className="score-row">
        <div className="team you">
          <div>
            <div className="tname">
              <span className="d-only">{p.youName}</span>
              <span className="m-only">You</span>
            </div>
            <div className="tsub">
              FOULS <Fouls n={p.fy} />
            </div>
          </div>
          <div className={`pts ${p.bump.you ? 'bump' : ''}`}>{p.sy}</div>
        </div>
        {p.final ? (
          <div className="clock final">
            <div className="q">FINAL</div>
            <div className="shot d-only">SIM 1 OF 1</div>
          </div>
        ) : (
          <div className="clock">
            <div className="q">{p.clock}</div>
            <div className="shot">
              SHOT<b>{p.shot}</b>
            </div>
          </div>
        )}
        <div className="team opp">
          <div>
            <div className="tname">
              <span className="d-only">{p.oppName}</span>
              <span className="m-only">{p.settingUp ? 'Opp.' : p.oppShort}</span>
            </div>
            <div className="tsub">
              <Fouls n={p.fo} /> FOULS
            </div>
          </div>
          <div className={`pts ${p.bump.opp ? 'bump' : ''}`}>{p.so}</div>
        </div>
      </div>
      <div className="wp">
        <div className="pct l">{wy}%</div>
        <div>
          <div className="lbl">WIN PROBABILITY</div>
          <Spark hist={p.hist} />
        </div>
        <div className="pct r">{100 - wy}%</div>
      </div>
    </div>
  );
}
