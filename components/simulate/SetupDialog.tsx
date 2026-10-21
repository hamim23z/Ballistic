import { Seg } from './chrome';
import { ERA_TEAMS, teamName } from './data';
import type { Config } from './types';

const Group = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="og">
    <div className="k">{label}</div>
    {children}
  </div>
);

export default function SetupDialog({
  config,
  onChange,
  onOpenPicker,
  onOpenBuild,
  onStart,
}: {
  config: Config;
  onChange: (patch: Partial<Config>) => void;
  onOpenPicker: (target: 'opponent' | 'season') => void;
  onOpenBuild: () => void;
  onStart: () => void;
}) {
  const season = config.mode === 'season';
  const build = config.team === 'build';
  const done = config.picks.every(Boolean);
  const blocked = !season && build && !done;
  const cta = season ? 'Start season' : 'Tip off';
  const sub = season
    ? 'Your 82 games are played against the real teams of that era.'
    : build && done
      ? `Your five: ${config.picks.map((p) => p?.short).join(' · ')}. Eight more players fill in at random when you tip off.`
      : 'Eight more players fill in at random when you tip off.';

  const startButton = (extra: string) => (
    <button type="button" className={`btn ${blocked ? 'off2' : 'p'} sm2 ${extra}`} disabled={blocked} onClick={onStart}>
      {cta}
    </button>
  );

  return (
    <div className="dlg row" role="dialog" aria-label="Set up your simulation">
      <div className="dh">
        <div>
          <div className="eyebrow">Simulate</div>
          <h2>Set up your simulation</h2>
          <div className="dsub">{sub}</div>
        </div>
        <div className="dhr">
          {season ? (
            <div className="check2"><i>✓</i>Include playoffs</div>
          ) : null}
          {startButton('cta-h')}
        </div>
      </div>
      <div className="dg">
        <Group label="MODE">
          <Seg label="Mode" value={config.mode} onChange={(mode) => onChange({ mode })} items={[['one', 'One game'], ['season', 'Full season']]} />
        </Group>
        <Group label="YOUR TEAM">
          <Seg
            label="Your team"
            value={config.team}
            onChange={(team) => (team === 'build' ? onOpenBuild() : onChange({ team }))}
            items={[['82', '82-0 team'], ['build', build && done ? 'Custom five ✓' : 'Build a team']]}
          />
        </Group>
        {season ? (
          <Group label="SEASON ERA">
            <button type="button" className="field" onClick={() => onOpenPicker('season')}>
              <span><b>{config.seasonEra}</b> · all {ERA_TEAMS[config.seasonEra].length} real teams</span>
              <i>›</i>
            </button>
          </Group>
        ) : (
          <Group label="OPPONENT">
            <Seg
              label="Opponent"
              value={config.opp}
              onChange={(opp) => (opp === 'random' ? onChange({ opp }) : onOpenPicker('opponent'))}
              items={[['random', 'Random'], ['choose', config.chosen ? `${config.chosen.era} ${teamName(config.chosen)} ›` : 'Choose era & team ›']]}
            />
          </Group>
        )}
        <Group label="SPEED">
          <Seg label="Speed" value={config.speed} onChange={(speed) => onChange({ speed })} items={[['live', 'Watch live'], ['instant', 'Instant']]} />
        </Group>
      </div>
      <div className="df mo">{startButton('')}</div>
    </div>
  );
}
