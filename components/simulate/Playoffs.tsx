import { useLayoutEffect, useRef, useState } from 'react';
import type { Bracket, Series } from './season';

function SeriesCard({ s, mine, setRef }: { s: Series; mine: boolean; setRef: (id: string, el: HTMLDivElement | null) => void }) {
  const done = !s.cur && !s.tbd;
  const aWin = done && s.a.wins > s.b.wins;
  const bWin = done && s.b.wins > s.a.wins;
  const row = (t: Series['a'], win: boolean) => (
    <div className={`t ${win ? 'win' : ''} ${t.label === 'YOU' ? 'me' : ''}`}>
      <span className="sd">{t.seed}</span>
      {t.label}
      <span className="w">{s.tbd ? '' : t.wins}</span>
    </div>
  );
  return (
    <div ref={(el) => setRef(s.id, el)} className={`ser ${mine ? 'mine' : ''} ${s.cur ? 'cur' : ''} ${s.tbd ? 'tbd' : ''}`}>
      {s.cur ? <span className="live">LIVE</span> : null}
      {row(s.a, aWin)}
      {row(s.b, bWin)}
    </div>
  );
}

const RESULTS = ['112–104', '98–106', '121–109', '101–110', '118–112', '109–101', '115–108'];

export default function Playoffs({
  bracket,
  cf,
  onWatch,
  onSimGame,
  onSimSeries,
}: {
  bracket: Bracket;
  /** Results of your conference finals games, true for a win. */
  cf: boolean[];
  onWatch: () => void;
  onSimGame: () => void;
  onSimSeries: () => void;
}) {
  const wins = cf.filter(Boolean).length;
  const losses = cf.length - wins;
  const over = wins === 4 || losses === 4;
  const rounds = bracket.roundNames.length;

  // The live series reflects the games played so far.
  const west = bracket.west.map((round, ri) => (ri === rounds - 1 ? round.map((s) => ({ ...s, a: { ...s.a, wins }, b: { ...s.b, wins: losses }, cur: !over })) : round));
  const final: Series = over && wins === 4
    ? { ...bracket.final, a: { seed: '1', label: 'YOU', wins: 0 }, tbd: true }
    : bracket.final;

  const nodes = useRef<Record<string, HTMLDivElement | null>>({});
  const wrap = useRef<HTMLDivElement>(null);
  const [paths, setPaths] = useState<{ d: string; mine: boolean }[]>([]);
  const setRef = (id: string, el: HTMLDivElement | null) => { nodes.current[id] = el; };

  useLayoutEffect(() => {
    const draw = () => {
      const w = wrap.current;
      if (!w) return;
      const B = w.getBoundingClientRect();
      const out: { d: string; mine: boolean }[] = [];
      for (const [from, to] of Object.entries(bracket.next)) {
        const a = nodes.current[from]?.getBoundingClientRect();
        const b = nodes.current[to]?.getBoundingClientRect();
        if (!a || !b) continue;
        const left = a.left < b.left;
        const x1 = (left ? a.right : a.left) - B.left;
        const x2 = (left ? b.left : b.right) - B.left;
        const y1 = a.top + a.height / 2 - B.top;
        const y2 = b.top + b.height / 2 - B.top;
        const xm = (x1 + x2) / 2;
        out.push({ d: `M${x1} ${y1} H${xm} V${y2} H${x2}`, mine: bracket.path.has(from) });
      }
      setPaths(out);
    };
    draw();
    const ro = new ResizeObserver(draw);
    if (wrap.current) ro.observe(wrap.current);
    return () => ro.disconnect();
  }, [bracket, wins, losses]);

  const col = (head: string, list: Series[], key: string) => (
    <div key={key}>
      <div className="bh">{head}</div>
      <div className="bcol">
        {list.map((s) => <SeriesCard key={s.id} s={s} mine={bracket.path.has(s.id)} setRef={setRef} />)}
      </div>
    </div>
  );
  const names = bracket.roundNames;
  const eastNames = [...names].map((n) => n.replace('WEST', 'EAST'));
  const cols = [
    ...west.map((r, i) => col(names[i], r, `w${i}`)),
    col('FINALS', [final], 'f'),
    ...[...bracket.east].reverse().map((r, i) => col(eastNames[rounds - 1 - i], r, `e${i}`)),
  ];

  const games = [...Array(7)].map((_, i) => {
    const r = cf[i];
    if (r !== undefined) return { g: `G${i + 1}`, label: r ? 'W' : 'L', cls: r ? 'w' : 'l', score: RESULTS[i] };
    if (over) return { g: `G${i + 1}`, label: 'NOT NEEDED', cls: 'u', score: '–' };
    if (i === cf.length) return { g: `G${i + 1}`, label: 'NEXT', cls: 'n', score: i % 2 ? `vs ${bracket.rival}` : `at ${bracket.rival}` };
    return { g: `G${i + 1}`, label: 'IF NEEDED', cls: 'u', score: '–' };
  });

  return (
    <>
      <div className="bwrap" ref={wrap}>
        <svg className="lines" aria-hidden="true">
          {paths.map((p, i) => <path key={i} d={p.d} fill="none" stroke={p.mine ? '#ff7a45' : '#2a364d'} strokeWidth={p.mine ? 2 : 1.4} />)}
        </svg>
        <div className="bcols" style={{ gridTemplateColumns: `repeat(${cols.length}, 1fr)` }}>{cols}</div>
      </div>
      <div className="panel" style={{ marginTop: 22 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <div>
            <div className="k">WEST FINALS · BEST OF 7</div>
            <div className="display" style={{ fontWeight: 700, fontSize: 20, marginTop: 4 }}>
              {over
                ? wins === 4
                  ? <>You won the West <span style={{ color: 'var(--ember)' }}>{wins}–{losses}</span></>
                  : <>Knocked out by {bracket.rival} <span style={{ color: '#4f8cff' }}>{losses}–{wins}</span></>
                : <>{wins >= losses ? 'You lead' : 'You trail'} the {bracket.rival} <span style={{ color: 'var(--ember)' }}>{wins}–{losses}</span></>}
            </div>
          </div>
          {over ? (
            <div style={{ fontSize: 13, color: '#94a3b8' }}>{wins === 4 ? `Finals set: You vs ${bracket.eastChamp}` : 'Season over'}</div>
          ) : (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button type="button" className="btn p sm" style={{ margin: 0, padding: '10px 16px' }} onClick={onWatch}>Watch game {cf.length + 1} on court</button>
              <button type="button" className="btn ghost sm" style={{ margin: 0, padding: '10px 16px' }} onClick={onSimGame}>Sim game</button>
              <button type="button" className="btn ghost sm" style={{ margin: 0, padding: '10px 16px' }} onClick={onSimSeries}>Sim series</button>
            </div>
          )}
        </div>
        <div className="games">
          {games.map((g) => (
            <div key={g.g} className={`gm ${g.cls}`}>{g.g} · {g.label}<b>{g.score}</b></div>
          ))}
        </div>
      </div>
    </>
  );
}
