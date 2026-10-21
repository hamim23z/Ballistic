import { useState } from 'react';
import { SearchIcon } from './chrome';
import { ERAS, ERA_TEAMS, teamName } from './data';
import type { TeamRef } from './types';

/** Era first, then a team from that era. In season mode it only picks the era. */
export default function TeamPicker({
  season,
  initialEra,
  initialTeam,
  onBack,
  onDone,
}: {
  season: boolean;
  initialEra: string;
  initialTeam: TeamRef | null;
  onBack: () => void;
  onDone: (era: string, team: TeamRef | null) => void;
}) {
  const [era, setEra] = useState(initialEra);
  const [sel, setSel] = useState<TeamRef | null>(initialTeam);
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const all = ERA_TEAMS[era];
  const list = q ? all.filter(([a, n]) => a.toLowerCase().includes(q) || n.toLowerCase().includes(q)) : all;

  const shown = (e: string) => (q && ERA_TEAMS[e].some(([a, n]) => a.toLowerCase().includes(q) || n.toLowerCase().includes(q)));
  const random = () => setSel({ era, abbr: all[Math.floor(Math.random() * all.length)][0] });

  return (
    <>
      <div className="scrim" onClick={onBack} />
      <div className="dlg wide" role="dialog" aria-label={season ? 'Choose your season era' : 'Choose your opponent'}>
        <div className="dh">
          <div>
            <button type="button" className="dback" onClick={onBack}>‹ Back</button>
            <div className="eyebrow">Simulate · {season ? 'Season' : 'Opponent'}</div>
            <h2>{season ? 'Choose your season era' : 'Choose your opponent'}</h2>
          </div>
          <div className="dhr">
            <button type="button" className="x" aria-label="Close" onClick={onBack}>×</button>
          </div>
        </div>
        <label className={`srch ${query ? 'on' : ''}`}>
          <SearchIcon />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search a team" aria-label="Search a team" autoComplete="off" />
        </label>
        <div className="eras" role="tablist" aria-label="Era">
          {ERAS.map((e) => (
            <button key={e} type="button" role="tab" aria-selected={e === era} className={`c ${e === era ? 'on' : ''} ${shown(e) ? 'hit' : ''}`} onClick={() => setEra(e)}>
              {e}
            </button>
          ))}
        </div>
        <div className="cnt">
          <b>{era}</b> · {list.length} teams{season ? ' (real teams, your schedule)' : ''}
        </div>
        <div className="tiles">
          {list.map(([abbr, name]) => {
            const on = !season && sel?.era === era && sel.abbr === abbr;
            return (
              <button key={abbr} type="button" className={`tt ${on ? 'on' : ''} ${season ? 'ro' : ''}`} aria-pressed={on} onClick={() => !season && setSel({ era, abbr })}>
                <b>{abbr}</b>
                <span>{name}</span>
              </button>
            );
          })}
        </div>
        <div className="df">
          <span className="note" style={{ textAlign: 'left' }}>
            {season ? (
              <>Season era: <b style={{ color: '#fff' }}>{era}</b> · you play all {all.length} teams</>
            ) : sel ? (
              <>Selected: <b style={{ color: '#fff' }}>{sel.era} {teamName(sel)}</b></>
            ) : (
              'Pick a team'
            )}
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            {season ? null : (
              <button type="button" className="btn s sm2" onClick={random}>Random {era} team</button>
            )}
            <button type="button" className="btn p sm2" disabled={!season && !sel} onClick={() => onDone(era, sel)}>Done</button>
          </div>
        </div>
      </div>
    </>
  );
}
