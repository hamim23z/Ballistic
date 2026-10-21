'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './simulate.css';
import BuildFive from './BuildFive';
import Court from './Court';
import FinalCard from './FinalCard';
import Playoffs from './Playoffs';
import Scoreboard from './Scoreboard';
import SeasonHub, { SeasonTabs } from './SeasonHub';
import SetupDialog from './SetupDialog';
import TeamPicker from './TeamPicker';
import Ticker, { Controls, type SpeedControls } from './Ticker';
import { DesktopBox, MobileBox } from './BoxScore';
import { Foot, Header } from './chrome';
import { buildLineups, defaultConfig, randomOpponent } from './data';
import { GameEngine } from './engine';
import { SEASON_LENGTH, buildBracket, buildSeason, type Game } from './season';
import type { Config, Phase, Pt, Snapshot, TeamRef, TickerState } from './types';

/** Where the court was opened from, so "continue" after the final knows where to go. */
type Origin = { kind: 'one' } | { kind: 'season'; n: number } | { kind: 'playoff' };

type SeasonState = { era: string; played: number; tab: 'reg' | 'po'; cf: boolean[] };

const SETUP_POS: { you: Pt[]; opp: Pt[]; ball: Pt } = {
  you: [[43, 31], [40, 12], [44, 40], [42, 19], [44, 25]],
  opp: [[50, 20], [54, 38], [51, 31], [50, 10], [50, 25]],
  ball: [47, 22],
};
const FINAL_POS: { you: Pt[]; opp: Pt[]; ball: Pt } = {
  you: [[58, 18], [62, 30], [66, 22], [60, 36], [64, 12]],
  opp: [[30, 18], [34, 30], [38, 22], [32, 36], [36, 12]],
  ball: [47, 25],
};
const FLAT_HIST = [0.5];
const FINAL_HIST = [0.57, 0.55, 0.6, 0.52, 0.48, 0.5, 0.58, 0.61, 0.56, 0.6, 0.66, 0.62, 0.59, 0.63, 0.71, 0.68, 0.6, 0.55, 0.62, 0.7, 0.66, 0.74, 0.82, 0.9, 1];
const FINAL_TICKER: TickerState = { side: 'y', big: 'YOU WIN', small: '118-112', text: 'Free throws seal it, the other bench is out of timeouts', tag: 'FINAL', hot: true, time: '0:00' };

export default function SimulateBoard() {
  const [config, setConfig] = useState<Config>(defaultConfig);
  const [phase, setPhase] = useState<Phase>('setup');
  const [pickerFor, setPickerFor] = useState<'opponent' | 'season'>('opponent');
  const [rand, setRand] = useState<TeamRef | null>(null);
  const [seasonOpp, setSeasonOpp] = useState<TeamRef | null>(null);
  const [origin, setOrigin] = useState<Origin>({ kind: 'one' });
  const [snap, setSnap] = useState<Snapshot | null>(null);
  const [paused, setPaused] = useState(false);
  const [rate, setRate] = useState<1 | 2 | 4>(1);
  const [showCard, setShowCard] = useState(true);
  const [season, setSeason] = useState<SeasonState | null>(null);
  const engine = useRef<GameEngine | null>(null);

  const patch = useCallback((p: Partial<Config>) => setConfig((c) => ({ ...c, ...p })), []);

  const lineups = useMemo(
    () => buildLineups(config, phase === 'live' ? 'live' : phase === 'final' ? 'final' : 'setup', rand, seasonOpp),
    [config, phase, rand, seasonOpp],
  );

  /* ---- the live game loop ---- */
  useEffect(() => {
    if (phase !== 'live' || paused) return;
    let last = performance.now();
    const id = window.setInterval(() => {
      const now = performance.now();
      const dt = Math.min(0.1, (now - last) / 1000) * rate;
      last = now;
      const e = engine.current;
      if (!e) return;
      e.tick(dt);
      const s = e.snapshot();
      setSnap(s);
      if (s.done) setPhase('final');
    }, 50);
    return () => window.clearInterval(id);
  }, [phase, paused, rate]);

  function startGame(opp: TeamRef | null, from: Origin) {
    const random = opp ? null : config.opp === 'random' ? randomOpponent() : null;
    setSeasonOpp(opp);
    setRand(random);
    setOrigin(from);
    setShowCard(true);
    setPaused(false);
    setRate(1);
    if (config.speed === 'instant' && from.kind === 'one') {
      setSnap(null);
      setPhase('final');
      return;
    }
    const l = buildLineups(config, 'live', random, opp);
    engine.current = new GameEngine({ you: l.you, opp: l.opp, benchYou: l.benchYou, benchOpp: l.benchOpp, oppShort: l.oppShort });
    setSnap(engine.current.snapshot());
    setPhase('live');
  }

  function stopAndFinish() {
    setSnap(null);
    setPhase('final');
  }

  function startSeason() {
    setSeason({ era: config.seasonEra, played: 64, tab: 'reg', cf: [true, false, true, false, true] });
    setPhase('season');
  }

  const seasonEra = season?.era ?? config.seasonEra;
  const games = useMemo(() => buildSeason(seasonEra), [seasonEra]);
  const bracket = useMemo(() => buildBracket(seasonEra), [seasonEra]);

  const advance = useCallback((n: number) => {
    setSeason((s) => (s ? { ...s, played: Math.min(SEASON_LENGTH, s.played + n) } : s));
  }, []);

  function watchSeasonGame(g: Game) {
    startGame({ era: seasonEra, abbr: g.opp }, { kind: 'season', n: g.n });
  }

  function continueAfterFinal() {
    setSnap(null);
    if (origin.kind === 'season' && season) {
      const n = origin.n;
      setSeason({ ...season, played: n === season.played + 1 ? n : season.played });
      setPhase('season');
    } else if (origin.kind === 'playoff' && season) {
      setSeason({ ...season, cf: season.cf.filter(Boolean).length < 4 ? [...season.cf, true] : season.cf });
      setPhase('season');
    } else {
      setSeasonOpp(null);
      setPhase('setup');
    }
    setOrigin({ kind: 'one' });
  }

  /* ---- what the board shows ---- */
  const dialog = phase === 'setup' || phase === 'picker' || phase === 'build';
  const live = phase === 'live' && snap;
  const final = phase === 'final';

  const view = (() => {
    if (live) return snap;
    const base = final ? FINAL_POS : SETUP_POS;
    return {
      sy: final ? 118 : 0,
      so: final ? 112 : 0,
      clock: 'Q1 12:00',
      shot: 24,
      fy: final ? 4 : 0,
      fo: final ? 5 : 0,
      wy: final ? 100 : 50,
      hist: final ? FINAL_HIST : FLAT_HIST,
      pos: { you: base.you, opp: base.opp },
      ball: base.ball,
      holder: null,
      rows: { you: lineups.you, opp: lineups.opp },
      bench: { you: lineups.benchYou, opp: lineups.benchOpp },
      ticker: final ? FINAL_TICKER : setupTicker(),
      splash: null,
      flash: null,
      bump: { you: false, opp: false },
      done: false,
    } satisfies Snapshot;
  })();

  function setupTicker(): TickerState {
    const text = phase === 'build' ? 'Pick your five to continue' : config.mode === 'season' ? 'Pick a season era to start' : config.opp === 'choose' && config.chosen ? 'Ready to tip off' : 'Choose your opponent to tip off';
    return { side: 'y', big: 'TIP-OFF', small: 'Q1', text, tag: 'SETUP', hot: false, time: '12:00' };
  }

  const controls: SpeedControls | null = final
    ? null
    : {
        active: !!live,
        paused,
        speed: rate,
        onTogglePause: () => setPaused((p) => !p),
        onSpeed: setRate,
        onSkip: stopAndFinish,
      };

  const oppLabel = lineups.oppName;
  const boxProps = {
    you: { name: 'Your Five', tag: lineups.youTag, rows: view.rows.you, bench: view.bench.you },
    opp: { name: oppLabel, tag: lineups.oppTag, rows: view.rows.opp, bench: view.bench.opp },
    full: !!live || final,
    settingUp: dialog,
    flash: view.flash,
    holder: view.holder,
  };

  if (phase === 'season' && season) {
    const po = season.tab === 'po';
    return (
      <main className="sim">
        <Header />
        <div className="page">
          <button type="button" className="dback" onClick={() => setPhase('setup')}>‹ Setup</button>
          <div className="phead">
            <div>
              <div className="eyebrow">Simulate · {po ? 'Playoffs' : 'Full season'}</div>
              <h1 className="big">
                {po ? <>The <span className="grad">playoffs.</span></> : <>{season.era} <span className="grad">season.</span></>}
              </h1>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              {po ? <span className="pill">{season.era} · {bracket.size} TEAMS · BEST OF 7</span> : null}
              <SeasonTabs tab={season.tab} onTab={(tab) => setSeason({ ...season, tab })} />
            </div>
          </div>
          {po ? (
            <Playoffs
              bracket={bracket}
              cf={season.cf}
              onWatch={() => startGame({ era: season.era, abbr: bracket.rival }, { kind: 'playoff' })}
              onSimGame={() => setSeason({ ...season, cf: [...season.cf, true] })}
              onSimSeries={() => setSeason({ ...season, cf: [...season.cf, ...Array(Math.max(0, 4 - season.cf.filter(Boolean).length)).fill(true)] })}
            />
          ) : (
            <SeasonHub
              era={season.era}
              games={games}
              played={season.played}
              stars={lineups.you}
              speed={config.speed}
              onSpeed={(speed) => patch({ speed })}
              onAdvance={advance}
              onWatch={watchSeasonGame}
              onPlayoffs={() => setSeason({ ...season, tab: 'po' })}
            />
          )}
        </div>
        <Foot note="Sample data · not a prediction" />
      </main>
    );
  }

  const settingUp = dialog;
  return (
    <main className="sim">
      <Header />
      {phase === 'setup' ? (
        <SetupDialog
          config={config}
          onChange={patch}
          onOpenPicker={(target) => { setPickerFor(target); setPhase('picker'); }}
          onOpenBuild={() => setPhase('build')}
          onStart={() => (config.mode === 'season' ? startSeason() : startGame(null, { kind: 'one' }))}
        />
      ) : null}
      {phase === 'picker' ? (
        <TeamPicker
          season={pickerFor === 'season'}
          initialEra={pickerFor === 'season' ? config.seasonEra : (config.chosen?.era ?? '2010s')}
          initialTeam={pickerFor === 'season' ? null : config.chosen}
          onBack={() => setPhase('setup')}
          onDone={(era, team) => {
            if (pickerFor === 'season') patch({ seasonEra: era });
            else if (team) patch({ chosen: team, opp: 'choose' });
            setPhase('setup');
          }}
        />
      ) : null}
      {phase === 'build' ? (
        <BuildFive
          picks={config.picks}
          onChange={(picks) => patch({ picks })}
          onBack={() => setPhase('setup')}
          onDone={() => { patch({ team: 'build' }); setPhase('setup'); }}
        />
      ) : null}

      <div className={`${final && showCard ? 'dim' : ''} ${settingUp ? 'pad-dlg' : ''}`} style={{ position: 'relative' }}>
        <Scoreboard
          youName="Your Five"
          oppName={oppLabel}
          oppShort={lineups.oppShort}
          sy={view.sy}
          so={view.so}
          clock={view.clock}
          shot={view.shot}
          fy={view.fy}
          fo={view.fo}
          wy={view.wy}
          hist={view.hist}
          final={final}
          bump={view.bump}
          settingUp={settingUp}
        />
        <div className="stage">
          <DesktopBox side="you" data={boxProps.you} {...boxProps} />
          <Court
            pos={view.pos}
            rows={view.rows}
            ball={view.ball}
            holder={view.holder}
            live={!!live}
            labelYou={!live}
            hideOpp={phase === 'build'}
          />
          <DesktopBox side="opp" data={boxProps.opp} {...boxProps} />
        </div>
        <div className={final && showCard ? 'd-only' : undefined}>
          <Ticker
            t={view.ticker}
            controls={controls}
            extra={final ? <button type="button" className="btn p sm2" style={{ flex: 'none' }} onClick={() => setShowCard(true)}>Back to result</button> : undefined}
          />
        </div>
        {controls && !settingUp ? (
          <div className="mctrl m-only">
            <Controls c={controls} className="" />
          </div>
        ) : null}
        <MobileBox {...boxProps} />
      </div>

      {view.splash ? (
        <div className={`splash ${view.splash.cls}`}>
          <div className="big">{view.splash.big}</div>
          <div className="who">{view.splash.who}</div>
        </div>
      ) : null}
      {final && showCard ? (
        <FinalCard
          mvp={lineups.you[2]}
          oppShort={lineups.oppShort}
          runBackLabel={origin.kind === 'one' ? 'Run it back' : origin.kind === 'season' ? 'Back to season' : 'Back to playoffs'}
          onRunBack={continueAfterFinal}
          onBoxScore={() => setShowCard(false)}
        />
      ) : null}
      <Foot />
    </main>
  );
}
