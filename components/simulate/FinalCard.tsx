import type { Row } from './types';

export default function FinalCard({
  mvp,
  oppShort,
  runBackLabel,
  onRunBack,
  onBoxScore,
}: {
  mvp: Row;
  oppShort: string;
  runBackLabel: string;
  onRunBack: () => void;
  onBoxScore: () => void;
}) {
  const initials = mvp.name.split(' ').map((x) => x[0]).join('').slice(0, 2);
  return (
    <div className="overlay" role="dialog" aria-label="Final score">
      <div className="eyebrow">Final · Simulated game</div>
      <h2>
        Your five <span className="grad">took it.</span>
      </h2>
      <div className="final-score">
        <div>
          <div className="s w">118</div>
          <div className="t">YOU</div>
        </div>
        <div style={{ color: '#475569', fontSize: 22 }}>–</div>
        <div>
          <div className="s l">112</div>
          <div className="t">{oppShort.toUpperCase()}</div>
        </div>
      </div>
      <table className="qline">
        <thead>
          <tr><th></th><th>Q1</th><th>Q2</th><th>Q3</th><th>Q4</th><th>T</th></tr>
        </thead>
        <tbody>
          <tr><td style={{ color: '#ffb37a' }}>You</td><td>27</td><td>25</td><td>33</td><td>33</td><td className="hot">118</td></tr>
          <tr><td style={{ color: '#8fb4ff' }}>{oppShort}</td><td>31</td><td>24</td><td>27</td><td>30</td><td className="hot">112</td></tr>
        </tbody>
      </table>
      <div className="mvp">
        <div className="av">{initials}</div>
        <div>
          <div className="k">PLAYER OF THE GAME</div>
          <div className="n">{mvp.name}</div>
        </div>
        <div className="line">
          {mvp.pts} · {mvp.reb} · {mvp.ast}<small>PTS · REB · AST</small>
        </div>
      </div>
      <div className="cta">
        <button type="button" className="btn s" onClick={onBoxScore}>Box score</button>
        <button type="button" className="btn p" onClick={onRunBack}>{runBackLabel}</button>
      </div>
      <div className="note">Sample teams and numbers. Simulated game, not a prediction.</div>
    </div>
  );
}
