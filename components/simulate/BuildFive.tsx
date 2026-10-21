import { useState } from 'react';
import { SearchIcon } from './chrome';
import { MOST_CHOSEN, PLAYERS, POSITION_ORDER } from './data';
import type { SimPlayer } from './types';

/** Pick a player into the first open spot they can play. Falls back to any open spot. */
export function place(picks: (SimPlayer | null)[], player: SimPlayer): (SimPlayer | null)[] {
  if (picks.some((p) => p?.id === player.id)) return picks;
  let slot = -1;
  for (const pos of player.positions) {
    const i = POSITION_ORDER.indexOf(pos);
    if (!picks[i]) { slot = i; break; }
  }
  if (slot < 0) slot = picks.findIndex((p) => !p);
  if (slot < 0) return picks;
  const next = [...picks];
  next[slot] = player;
  return next;
}

export default function BuildFive({
  picks,
  onChange,
  onBack,
  onDone,
}: {
  picks: (SimPlayer | null)[];
  onChange: (picks: (SimPlayer | null)[]) => void;
  onBack: () => void;
  onDone: () => void;
}) {
  const [query, setQuery] = useState('');
  const n = picks.filter(Boolean).length;
  const taken = new Set(picks.flatMap((p) => (p ? [p.id] : [])));
  const q = query.trim().toLowerCase();
  const results = q ? PLAYERS.filter((p) => !taken.has(p.id) && p.name.toLowerCase().includes(q)).slice(0, 4) : [];
  const most = MOST_CHOSEN.filter((id) => !taken.has(id)).slice(0, 7);

  const add = (p: SimPlayer) => {
    onChange(place(picks, p));
    setQuery('');
  };

  return (
    <div className="dlg row bld" role="dialog" aria-label="Pick your five">
      <div className="dh">
        <div>
          <button type="button" className="dback" onClick={onBack}>‹ Back</button>
          <div className="eyebrow">Simulate · Your team</div>
          <h2>Pick your five</h2>
          <div className="dsub">{n} of 5 picked. Type a name or tap a most chosen player. The 8-man bench fills in at random after.</div>
        </div>
        <div className="dhr">
          <button type="button" className={`btn ${n === 5 ? 'p' : 'off2'} sm2`} disabled={n < 5} onClick={onDone}>Done</button>
        </div>
      </div>
      <label className={`srch ${query ? 'on' : ''}`}>
        <SearchIcon />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Type a player, 1940s to now" aria-label="Search players" autoComplete="off" />
      </label>
      {q ? (
        <div className="rlist">
          {results.length ? (
            results.map((p) => (
              <button key={p.id} type="button" className="rr" onClick={() => add(p)}>
                <div className="av2">{p.name.split(' ').map((x) => x[0]).join('').slice(0, 2)}</div>
                <div>
                  <b>{p.name}</b>
                  <span>{p.era}</span>
                </div>
                <div className="pp">
                  {p.positions.map((x) => <i key={x}>+ {x}</i>)}
                </div>
              </button>
            ))
          ) : (
            <div className="rr"><span>No player found</span></div>
          )}
        </div>
      ) : (
        <>
          <div className="k" style={{ margin: '14px 0 8px' }}>MOST CHOSEN</div>
          <div className="mcs">
            {most.map((id) => {
              const p = PLAYERS[id];
              return (
                <button key={id} type="button" className="mc" onClick={() => add(p)}>
                  <em>{MOST_CHOSEN.indexOf(id) + 1}</em>
                  <b>{p.name}</b>
                  <span>{p.positions[0]}</span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
