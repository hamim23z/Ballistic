import { useState } from 'react';
import { shortName } from './data';
import type { Row, Side } from './types';

type Cols = 'd' | 'm';
type Mark = { side: Side; i: number } | null;

const sum = (list: Row[]) => list.reduce((a, r) => ({ pts: a.pts + r.pts, reb: a.reb + r.reb, ast: a.ast + r.ast }), { pts: 0, reb: 0, ast: 0 });

function Head({ cols, first }: { cols: Cols; first: string }) {
  return cols === 'm' ? (
    <tr><th>{first}</th><th>MIN</th><th>PTS</th><th>REB</th><th>AST</th><th>FG</th></tr>
  ) : (
    <tr><th>{first}</th><th>MIN</th><th>PTS</th><th>FG</th><th>REB</th><th>AST</th><th>PF</th></tr>
  );
}

function Line({ r, cols, className }: { r: Row; cols: Cols; className: string }) {
  const fg = `${r.fgm}-${r.fga}`;
  return (
    <tr className={className}>
      <td>
        <span className="pos">{r.pos}</span>
        {cols === 'm' ? r.short || r.name : shortName(r.name)}
        {r.flag === 'in' ? <span className="tg in">IN</span> : r.flag === 'out' ? <span className="tg out">OUT</span> : null}
      </td>
      <td>{r.min}</td>
      <td className="hot">{r.pts}</td>
      {cols === 'm' ? (
        <>
          <td>{r.reb}</td>
          <td>{r.ast}</td>
          <td>{fg}</td>
        </>
      ) : (
        <>
          <td>{fg}</td>
          <td>{r.reb}</td>
          <td>{r.ast}</td>
          <td className={r.pf >= 5 ? 'hot' : undefined} style={r.pf >= 5 ? { color: '#ff7a45' } : undefined}>{r.pf}</td>
        </>
      )}
    </tr>
  );
}

function Totals({ list, cols }: { list: Row[]; cols: Cols }) {
  const t = sum(list);
  return cols === 'm' ? (
    <tr className="tot"><td>Team</td><td></td><td>{t.pts}</td><td>{t.reb}</td><td>{t.ast}</td><td></td></tr>
  ) : (
    <tr className="tot"><td>Team</td><td></td><td>{t.pts}</td><td></td><td>{t.reb}</td><td>{t.ast}</td><td></td></tr>
  );
}

/** On-court rows plus the full bench, with IN and OUT tags for fresh substitutions. */
function FullTable({ side, rows, bench, cols, flash, holder }: { side: Side; rows: Row[]; bench: Row[]; cols: Cols; flash: Mark; holder: Mark }) {
  const span = cols === 'm' ? 6 : 7;
  const cls = (r: Row, i: number, onCourt: boolean) =>
    [r.flag ?? '', onCourt && flash?.side === side && flash.i === i ? 'flash' : '', onCourt && holder?.side === side && holder.i === i ? 'ball' : ''].join(' ').trim();
  return (
    <table>
      <thead><Head cols={cols} first="PLAYER" /></thead>
      <tbody>
        <tr className="sec"><td colSpan={span}>ON COURT</td></tr>
        {rows.map((r, i) => <Line key={`${r.name}${i}`} r={r} cols={cols} className={cls(r, i, true)} />)}
        <tr className="sec"><td colSpan={span}>BENCH</td></tr>
        {bench.map((r, i) => <Line key={`${r.name}${i}`} r={r} cols={cols} className={cls(r, i, false)} />)}
        <Totals list={[...rows, ...bench]} cols={cols} />
      </tbody>
    </table>
  );
}

function StartersTable({ rows, cols }: { rows: Row[]; cols: Cols }) {
  return (
    <table>
      <thead><Head cols={cols} first="STARTERS" /></thead>
      <tbody>
        {rows.map((r, i) => <Line key={`${r.name}${i}`} r={r} cols={cols} className="" />)}
        <Totals list={rows} cols={cols} />
      </tbody>
    </table>
  );
}

export type BoxProps = {
  you: { name: string; tag: string; rows: Row[]; bench: Row[] };
  opp: { name: string; tag: string; rows: Row[]; bench: Row[] };
  /** Show the whole bench. Off while the setup dialog is open. */
  full: boolean;
  settingUp: boolean;
  flash: Mark;
  holder: Mark;
};

export function DesktopBox({ side, data, full, settingUp, flash, holder }: BoxProps & { side: Side; data: BoxProps['you'] }) {
  return (
    <div className={`box ${side} d-only ${full ? 'full' : ''}`}>
      <h3>
        {data.name}
        <span>{data.tag.toUpperCase()}</span>
      </h3>
      {full ? (
        <FullTable side={side} rows={data.rows} bench={data.bench} cols="d" flash={flash} holder={holder} />
      ) : (
        <>
          <StartersTable rows={data.rows} cols="d" />
          <div className="bench">
            <b>BENCH</b>
            {settingUp ? 'Eight more players fill in at random when you tip off.' : 'The bench fills in at tip-off.'}
          </div>
        </>
      )}
    </div>
  );
}

/** Phones get one team at a time behind two tabs. */
export function MobileBox({ you, opp, full, flash, holder }: BoxProps) {
  const [tab, setTab] = useState<Side>('you');
  const data = tab === 'you' ? you : opp;
  return (
    <>
      <div className="tabs m-only" role="tablist">
        <button type="button" role="tab" aria-selected={tab === 'you'} className={tab === 'you' ? 'on y' : ''} onClick={() => setTab('you')}>{you.name}</button>
        <button type="button" role="tab" aria-selected={tab === 'opp'} className={tab === 'opp' ? 'on o' : ''} onClick={() => setTab('opp')}>{opp.name}</button>
      </div>
      <div className={`mbox m-only ${tab}`}>
        {full ? <FullTable side={tab} rows={data.rows} bench={data.bench} cols="m" flash={flash} holder={holder} /> : <StartersTable rows={data.rows} cols="m" />}
      </div>
    </>
  );
}
