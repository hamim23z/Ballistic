import { useEffect, useState } from 'react';
import { Seg } from './chrome';
import { teamName } from './data';
import { MONTHS, SEASON_LENGTH, formatDate, seasonStartYear, type Game } from './season';
import type { Row } from './types';

export const SeasonTabs = ({ tab, onTab }: { tab: 'reg' | 'po'; onTab: (t: 'reg' | 'po') => void }) => (
  <div className="tabs2" role="tablist">
    <button type="button" role="tab" aria-selected={tab === 'reg'} className={tab === 'reg' ? 'on' : ''} onClick={() => onTab('reg')}>Regular season</button>
    <button type="button" role="tab" aria-selected={tab === 'po'} className={tab === 'po' ? 'on' : ''} onClick={() => onTab('po')}>Playoffs</button>
  </div>
);

function Month({ year, month, label, games, played, selN, onSelect }: { year: number; month: number; label: string; games: Game[]; played: number; selN: number; onSelect: (n: number) => void }) {
  const first = new Date(year, month, 1);
  const days = new Date(year, month + 1, 0).getDate();
  const here = games.filter((g) => g.n <= played && g.date.getMonth() === month && g.date.getFullYear() === year);
  const wins = here.filter((g) => g.win).length;
  const cells = [];
  for (let d = 1; d <= days; d++) {
    const g = games.find((x) => x.date.getMonth() === month && x.date.getFullYear() === year && x.date.getDate() === d);
    if (!g) { cells.push(<div key={d} className="d">{d}</div>); continue; }
    const done = g.n <= played;
    const cls = done ? (g.win ? 'w' : 'lo') : g.n === played + 1 ? 'nx' : 'g';
    cells.push(
      <button type="button" key={d} disabled={!done} className={`d ${cls} ${g.n === selN ? 'sel' : ''}`} onClick={() => onSelect(g.n)} aria-label={`${formatDate(g.date)}, ${g.home ? 'vs' : 'at'} ${g.opp}${done ? (g.win ? ', win' : ', loss') : ''}`}>
        {d}
        <span className="ab">{g.home ? '' : '@'}{g.opp}</span>
        {done ? <span className="r">{g.win ? 'W' : 'L'}</span> : null}
      </button>,
    );
  }
  return (
    <div className="mo">
      <h4>{label}<span>{here.length ? `${wins}-${here.length - wins}` : ''}</span></h4>
      <div className="cal">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((x, i) => <div key={i} className="dow">{x}</div>)}
        {Array.from({ length: first.getDay() }, (_, i) => <div key={`b${i}`} />)}
        {cells}
      </div>
    </div>
  );
}

const Legend = ({ column }: { column?: boolean }) => (
  <div className="legend" style={column ? { flexDirection: 'column', alignItems: 'flex-start', gap: 6 } : { marginTop: 14 }}>
    <span><i style={{ background: 'rgba(255,90,31,.3)', border: '1px solid #ff5a1f' }} />Win</span>
    <span><i style={{ background: 'rgba(79,140,255,.25)', border: '1px solid #4f8cff' }} />Loss</span>
    <span><i style={{ border: '1px solid #ffb37a' }} />Next game</span>
    <span><i style={{ border: '1px dashed #475569' }} />Upcoming</span>
    <span><i style={{ border: '2px solid #fff' }} />Selected</span>
  </div>
);

const SAMPLE_LINES = ['31 PTS · 9 REB', '24 PTS · 5 AST', '14 PTS · 12 REB'];

export default function SeasonHub({
  era,
  games,
  played,
  stars,
  speed,
  onSpeed,
  onAdvance,
  onWatch,
  onPlayoffs,
}: {
  era: string;
  games: Game[];
  played: number;
  stars: Row[];
  speed: 'live' | 'instant';
  onSpeed: (s: 'live' | 'instant') => void;
  onAdvance: (n: number) => void;
  /** Open the court for this game. */
  onWatch: (g: Game) => void;
  onPlayoffs: () => void;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const [running, setRunning] = useState(false);
  const selN = Math.min(picked ?? played, played);
  const sel = games[selN - 1];
  const done = played >= SEASON_LENGTH;
  const pl = games.slice(0, played);
  const wins = pl.filter((g) => g.win).length;
  const losses = played - wins;
  const last = pl[pl.length - 1];
  let streak = 0;
  for (let i = pl.length - 1; i >= 0 && pl[i].win === last.win; i--) streak++;
  const home = (h: boolean, w: boolean) => pl.filter((g) => g.home === h && g.win === w).length;
  const next = games.slice(played, played + 3);
  const year = seasonStartYear(era);

  const simming = running && !done;
  useEffect(() => {
    if (!simming) return;
    const id = setTimeout(() => onAdvance(2), 140);
    return () => clearTimeout(id);
  }, [simming, played, onAdvance]);

  const controls = done ? (
    <>
      <button type="button" className="btn p sm" style={{ marginTop: 12 }} onClick={onPlayoffs}>Go to playoffs</button>
      <div style={{ marginTop: 10, fontSize: 12, color: '#94a3b8' }}>Regular season complete: {wins}–{losses}</div>
    </>
  ) : (
    <>
      <button type="button" className="btn p sm" style={{ marginTop: 12 }} onClick={() => {
        setPicked(null);
        if (speed === 'live') onWatch(next[0]);
        else onAdvance(1);
      }}>Play next game</button>
      <button type="button" className="btn ghost sm" onClick={() => { setPicked(null); onAdvance(4); }}>Sim 1 week</button>
      <button type="button" className="btn ghost sm" disabled={simming} onClick={() => { setPicked(null); setRunning(true); }}>Sim to end of season</button>
    </>
  );

  return (
    <div className="sgrid">
      <div>
        <div className="panel">
          <div className="k">YOUR RECORD · GAME {played} OF {SEASON_LENGTH}</div>
          <div className="rec">{wins}–{losses}<small>{(wins / played).toFixed(3).slice(1)}</small></div>
          <div className="wbar"><i style={{ width: `${Math.round((wins / played) * 100)}%` }} /></div>
          <div style={{ marginTop: 12 }}>
            <div className="kv"><span>Seed</span><b>#1 in the West</b></div>
            <div className="kv"><span>Streak</span><b>{last.win ? 'W' : 'L'} {streak}</b></div>
            <div className="kv"><span>Home / Away</span><b>{home(true, true)}–{home(true, false)} · {home(false, true)}–{home(false, false)}</b></div>
            <div className="kv" style={{ display: 'block' }}>
              <span>Last 10</span>
              <div className="l10">{pl.slice(-10).map((g) => <i key={g.n} className={g.win ? '' : 'l'} />)}</div>
            </div>
          </div>
        </div>
        <div className="panel" style={{ marginTop: 14 }}>
          <div className="k">SIM CONTROLS</div>
          <div style={{ marginTop: 9 }}>
            <Seg label="When you play a game" value={speed} onChange={onSpeed} items={[['live', 'Watch live'], ['instant', 'Instant']]} />
          </div>
          {controls}
        </div>
      </div>
      <div className="panel">
        <div className="months">
          {MONTHS.map(([off, m, label]) => (
            <Month key={label} year={year + off} month={m} label={label} games={games} played={played} selN={selN} onSelect={setPicked} />
          ))}
          <div className="mo" style={{ alignSelf: 'end' }}>
            <h4>KEY</h4>
            <Legend column />
          </div>
        </div>
      </div>
      <div>
        <div className="panel gcard">
          <div className="k">GAME {sel.n} · {formatDate(sel.date).toUpperCase()}</div>
          <div style={{ fontWeight: 700, fontSize: 15, marginTop: 6 }}>
            {sel.home ? 'vs' : 'at'} {teamName({ era, abbr: sel.opp })} <span className="pill" style={{ marginLeft: 6 }}>{era}</span>
          </div>
          <div className="res-big">
            <span style={sel.win ? undefined : { color: '#4f8cff' }}>{sel.win ? 'W' : 'L'}</span> {sel.you}–{sel.them}
            <small>FINAL</small>
          </div>
          {stars.slice(0, 3).map((r, i) => (
            <div key={r.name + i} className="kv" style={i === 0 ? { marginTop: 12 } : undefined}><span>{r.name}</span><b>{SAMPLE_LINES[i]}</b></div>
          ))}
          <button type="button" className="btn p sm" style={{ marginTop: 14 }} onClick={() => onWatch(sel)}>Watch on court</button>
        </div>
        <div className="panel" style={{ marginTop: 14 }}>
          <div className="k">NEXT UP</div>
          {next.length === 0 ? <div className="nxt"><div>Season complete<small>Head to the playoffs</small></div></div> : null}
          {next.map((g, i) => (
            <div key={g.n} className="nxt">
              <div>{g.home ? 'vs' : 'at'} {teamName({ era, abbr: g.opp })}<small>Game {g.n} · {formatDate(g.date)}</small></div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button type="button" className={`mini-btn ${i === 0 ? 'p' : ''}`} onClick={() => onWatch(g)}>Watch</button>
                <button type="button" className="mini-btn" onClick={() => { setPicked(null); onAdvance(i + 1); }}>Sim</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
