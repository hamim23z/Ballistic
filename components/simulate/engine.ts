import type { Pt, Row, Side, Snapshot, TickerState } from './types';

/**
 * Plays out a short scripted stretch of a game on the court: half-court sets, a fast break each way,
 * the teams switching ends, and a substitution. Nothing here is a real simulation. It only moves the
 * dots and updates sample numbers so the screen has something to animate.
 *
 * Court coordinates are feet: x runs 0 to 94 and y runs 0 to 50. Your team attacks the right hoop.
 */

const RIGHT = 88.75;
const LEFT = 5.25;
const DIR: Record<Side, number> = { you: 1, opp: -1 };
const HX: Record<Side, number> = { you: RIGHT, opp: LEFT };
const LANES = [25, 8, 42, 16, 34];
const FLAG_MS = 4.5;

type Spot = 'top' | 'wingL' | 'wingR' | 'cornL' | 'cornR' | 'elbowL' | 'elbowR' | 'post' | 'postL' | 'postR' | 'rim';
const SPOTS: Record<Spot, Pt> = {
  top: [26, 25], wingL: [21, 9], wingR: [21, 41], cornL: [7, 4], cornR: [7, 46], elbowL: [17, 18], elbowR: [17, 32],
  post: [9, 25], postL: [10, 19], postR: [10, 31], rim: [2.5, 25],
};

type Step = { start: number; dur: number; run: () => void };
type Flight = { from: Pt; to: Pt | (() => Pt); t: number; dur: number; done?: () => void };

export type EngineInit = {
  you: Row[];
  opp: Row[];
  benchYou: Row[];
  benchOpp: Row[];
  oppShort: string;
};

export const START_POSITIONS: { you: Pt[]; opp: Pt[]; ball: Pt } = {
  you: [[66, 22], [71, 44], [80, 8], [83, 31], [86, 20]],
  opp: [[69, 26], [74, 40], [81, 12], [84, 27], [87, 23]],
  ball: [71, 44],
};

const other = (s: Side): Side => (s === 'you' ? 'opp' : 'you');
const clone = (rows: Row[]) => rows.map((r) => ({ ...r }));

export class GameEngine {
  private t = 0;
  private spd = 2.2;
  private tShot = 0;
  private tFlag = 0;
  private stepI = 0;
  private total = 0;
  private steps: Step[] = [];
  private pl: { you: Pt[]; opp: Pt[] };
  private tg: { you: Pt[]; opp: Pt[] };
  private ball = { x: START_POSITIONS.ball[0], y: START_POSITIONS.ball[1], holder: null as { side: Side; i: number } | null, fly: null as Flight | null };
  private rows: { you: Row[]; opp: Row[] };
  private bench: { you: Row[]; opp: Row[] };
  private score = { you: 71, opp: 66 };
  private fouls = { you: 3, opp: 4 };
  private wy = 63;
  private hist = [0.57, 0.55, 0.6, 0.52, 0.48, 0.5, 0.58, 0.61, 0.56, 0.6, 0.66, 0.62, 0.59, 0.63];
  private ticker: TickerState;
  private splash: { big: string; who: string; cls: string } | null = null;
  private flash: { side: Side; i: number } | null = null;
  private bump = { you: false, opp: false };
  private flagClearAt: number | null = null;
  private done = false;
  private oppShort: string;

  constructor(init: EngineInit) {
    this.rows = { you: clone(init.you), opp: clone(init.opp) };
    this.bench = { you: clone(init.benchYou), opp: clone(init.benchOpp) };
    this.oppShort = init.oppShort;
    this.pl = { you: START_POSITIONS.you.map((p) => [...p] as Pt), opp: START_POSITIONS.opp.map((p) => [...p] as Pt) };
    this.tg = { you: START_POSITIONS.you.map((p) => [...p] as Pt), opp: START_POSITIONS.opp.map((p) => [...p] as Pt) };
    this.ticker = { side: 'y', big: 'YOUR BALL', small: 'half court', text: '', tag: 'PLAY', hot: false, time: '4:12' };
    this.script();
  }

  /* ---- helpers ---- */
  private spot(side: Side, k: Spot): Pt {
    const d = DIR[side];
    const o = SPOTS[k];
    return [HX[side] - d * o[0], o[1]];
  }
  private possession(side: Side, small: string): [TickerState['side'], string, string] {
    return [side === 'you' ? 'y' : 'o', side === 'you' ? 'YOUR BALL' : `${this.oppShort.toUpperCase()} BALL`, small];
  }
  private say(text: string, tag?: string, hot = false, poss?: [TickerState['side'], string, string]) {
    this.ticker.text = text;
    this.ticker.tag = tag ?? 'PLAY';
    this.ticker.hot = hot;
    if (poss) [this.ticker.side, this.ticker.big, this.ticker.small] = poss;
  }
  private hold(side: Side, i: number) {
    this.ball.holder = { side, i };
    this.ball.fly = null;
  }
  private fly(from: Pt, to: Pt | (() => Pt), dur: number, done?: () => void) {
    this.ball.holder = null;
    this.ball.fly = { from, to, t: 0, dur, done };
  }
  private formation(side: Side, spots: Spot[]) {
    spots.forEach((k, i) => (this.tg[side][i] = this.spot(side, k)));
  }
  private defend(side: Side) {
    const o = other(side);
    const hx = HX[o];
    this.tg[side].forEach((_, i) => {
      const q = this.tg[o][i];
      this.tg[side][i] = [q[0] + (hx - q[0]) * 0.22, q[1] + (25 - q[1]) * 0.2];
    });
  }

  /* ---- plays ---- */
  private half(side: Side, spots: Spot[], holder: number, text: string) {
    this.formation(side, spots);
    this.defend(other(side));
    this.hold(side, holder);
    this.tShot = this.t;
    this.say(text, 'SET', false, this.possession(side, 'half court'));
    this.spd = 2.2;
  }
  private inbound(side: Side, text: string) {
    const d = DIR[side];
    const ownHx = HX[other(side)];
    this.tg[side].forEach((_, i) => (this.tg[side][i] = [47 - d * 22, LANES[i]]));
    this.tg[side][0] = [ownHx - d * 3, 16];
    this.hold(side, 0);
    this.defend(other(side));
    this.tShot = this.t;
    this.say(text, 'INBOUND', false, this.possession(side, 'inbound'));
    this.spd = 2.6;
  }
  private advance(side: Side, text: string) {
    const d = DIR[side];
    this.tg[side].forEach((_, i) => (this.tg[side][i] = [47 + d * 8, LANES[i]]));
    this.tg[side][0] = [47 + d * 4, 25];
    this.defend(other(side));
    this.say(text, 'PUSH', false, this.possession(side, 'transition'));
    this.spd = 2.6;
  }
  private fastBreak(side: Side, handler: number, wings: [number, number], trailers: [number, number], text: string) {
    const d = DIR[side];
    const hx = HX[side];
    const o = other(side);
    this.tg[side][handler] = [hx - d * 22, 25];
    this.tg[side][wings[0]] = [hx - d * 10, 7];
    this.tg[side][wings[1]] = [hx - d * 9, 43];
    this.tg[side][trailers[0]] = [hx - d * 38, 25];
    this.tg[side][trailers[1]] = [hx - d * 44, 32];
    ([[34, 25], [26, 14], [14, 30], [30, 36], [8, 22]] as Pt[]).forEach(([x, y], i) => (this.tg[o][i] = [hx - d * x, y]));
    this.say(text, 'FAST BREAK', true, this.possession(side, 'transition'));
    this.spd = 3.6;
    this.tShot = this.t;
  }
  private pass(side: Side, i: number, j: number) {
    const a = this.pl[side][i];
    this.fly([a[0], a[1]], () => this.pl[side][j], 0.8, () => this.hold(side, j));
  }
  private score_(side: Side, i: number, pts: number, big: string, who: string, cls: string) {
    this.score[side] += pts;
    this.bump[side] = true;
    const r = this.rows[side][i];
    r.pts += pts;
    r.fgm += 1;
    r.fga += 1;
    this.wy = Math.max(3, Math.min(97, this.wy + (side === 'you' ? 1 : -1) * pts * 1.4));
    this.hist.push(this.wy / 100);
    this.flash = { side, i };
    this.splash = { big, who, cls };
    this.tFlag = this.t;
  }
  private shoot(side: Side, i: number, make: boolean, pts: number, big: string, who: string, cls: string, dur: number, then?: () => void) {
    const a = this.pl[side][i];
    const hx = HX[side];
    this.fly([a[0], a[1]], [hx, 25], dur, () => {
      if (make) {
        this.score_(side, i, pts, big, who, cls);
        this.ball.holder = null;
        this.ball.x = hx;
        this.ball.y = 25;
      } else {
        this.rows[side][i].fga += 1;
      }
      then?.();
    });
  }
  private rebound(side: Side, i: number) {
    this.fly([HX[other(side)], 25], () => this.pl[side][i], 0.7, () => this.hold(side, i));
  }

  private script() {
    const add = (dur: number, run: () => void) => this.steps.push({ start: 0, dur, run });
    const Y = (i: number) => this.rows.you[i].short;
    const O = (i: number) => this.rows.opp[i].short;
    const OT = this.oppShort;

    // Possession 1: your half-court set ends in a three.
    add(1.6, () => this.half('you', ['top', 'wingL', 'wingR', 'elbowR', 'post'], 0, `${Y(0)} walks it up, ${OT} set in the half court`));
    add(1.0, () => { this.pass('you', 0, 2); this.say(`${Y(0)} to ${Y(2)} on the right wing`, 'PASS'); });
    add(1.0, () => { this.pass('you', 2, 1); this.say(`${Y(2)} kicks it out to ${Y(1)} on the left wing`, 'PASS'); });
    add(2.4, () => {
      this.say(`${Y(1)} rises for three...`, '3PT');
      this.shoot('you', 1, true, 3, '+3', `${Y(1).toUpperCase()} FROM DOWNTOWN`, '', 0.9, () => this.say(`${Y(1)} hits the 26-ft three, assist ${Y(2)}`, '3PT', true));
      this.rows.you[2].ast += 1;
    });
    // Possession 2: they miss, you break the other way.
    add(1.6, () => this.inbound('opp', `${OT} inbound, ${O(0)} pushes it up`));
    add(1.8, () => this.advance('opp', `${O(0)} brings it across half court`));
    add(1.4, () => this.half('opp', ['top', 'elbowR', 'wingL', 'post', 'cornR'], 0, `${OT} run their set, ${O(0)} at the top`));
    add(0.9, () => { this.pass('opp', 0, 1); this.say(`${O(0)} finds ${O(1)} at the elbow`, 'PASS'); });
    add(1.4, () => {
      this.say(`${O(1)} pulls up from the elbow...`, '2PT');
      this.shoot('opp', 1, false, 2, '', '', '', 0.9, () => this.say(`No good, ${Y(4)} has the board`, 'MISS'));
    });
    add(1.0, () => { this.rebound('you', 4); this.say(`${Y(4)} cleans the glass`, 'REB', false, this.possession('you', 'transition')); });
    add(0.9, () => { this.fastBreak('you', 0, [1, 2], [3, 4], `Outlet to ${Y(0)}, the break is on`); this.pass('you', 4, 0); });
    add(2.0, () => this.say(`${Y(0)} leads it, ${Y(1)} and ${Y(2)} fill the lanes`, 'FAST BREAK', true));
    add(0.7, () => { this.tg.you[2] = [RIGHT - 3, 27]; this.pass('you', 0, 2); });
    add(2.2, () => {
      this.shoot('you', 2, true, 2, 'DUNK', `${Y(2).toUpperCase()} ON THE BREAK`, '', 0.5, () => this.say(`${Y(2)} throws it down on the fast break`, '2PT', true));
      this.rows.you[0].ast += 1;
    });
    // Possession 3: they drive for a layup.
    add(1.5, () => this.inbound('opp', `${OT} inbound after the dunk`));
    add(1.7, () => this.advance('opp', `${O(0)} pushes it up the floor`));
    add(1.2, () => this.half('opp', ['top', 'wingR', 'wingL', 'post', 'cornR'], 0, `${OT} get into the half court`));
    add(0.9, () => { this.pass('opp', 0, 2); this.say(`${O(0)} to ${O(2)} on the left wing`, 'PASS'); });
    add(1.1, () => { this.tg.opp[2] = [LEFT + 3, 25]; this.say(`${O(2)} drives the baseline`, 'DRIVE'); });
    add(2.0, () => this.shoot('opp', 2, true, 2, '+2', `${O(2).toUpperCase()} AT THE RIM`, 'opp', 0.45, () => this.say(`${O(2)} finishes the layup`, '2PT', true)));
    // A substitution during the dead ball.
    add(2.2, () => {
      const out = this.rows.you[0];
      const inn = this.bench.you[0];
      inn.flag = 'in';
      out.flag = 'out';
      this.rows.you[0] = inn;
      this.bench.you[0] = out;
      this.say(`SUB: IN ${inn.name}, OUT ${out.name}`, 'SUB', false, ['y', 'YOUR BALL', 'dead ball']);
      this.flagClearAt = this.t + FLAG_MS;
    });
    // Possession 4: you miss, they break the other way.
    add(1.5, () => this.inbound('you', 'Your ball after the bucket'));
    add(1.8, () => this.advance('you', `${Y(0)} brings it up`));
    add(1.3, () => this.half('you', ['top', 'wingL', 'wingR', 'elbowL', 'post'], 0, `Your set: ${Y(4)} on the block`));
    add(0.9, () => { this.pass('you', 0, 3); this.say(`${Y(0)} to ${Y(3)} at the elbow`, 'PASS'); });
    add(1.4, () => {
      this.say(`${Y(3)} turns and shoots...`, '2PT');
      this.shoot('you', 3, false, 2, '', '', '', 0.9, () => this.say(`Rim out, ${O(3)} grabs it`, 'MISS'));
    });
    add(1.0, () => { this.rebound('opp', 3); this.say(`${O(3)} with the rebound`, 'REB', false, this.possession('opp', 'transition')); });
    add(0.9, () => { this.fastBreak('opp', 0, [1, 2], [3, 4], `${O(3)} outlets to ${O(0)}, ${OT} on the break`); this.pass('opp', 3, 0); });
    add(1.9, () => this.say(`${O(0)} leads, ${O(1)} and ${O(2)} fill the lanes`, 'FAST BREAK', true));
    add(0.7, () => { this.tg.opp[1] = [LEFT + 3, 23]; this.pass('opp', 0, 1); });
    add(2.4, () => this.shoot('opp', 1, true, 2, 'DUNK', `${O(1).toUpperCase()} ON THE BREAK`, 'opp', 0.5, () => this.say(`${O(1)} slams it home on the break`, '2PT', true)));
    add(3, () => this.say('Fast-forwarding to the final buzzer', 'SIM', true, ['y', 'YOUR BALL', 'half court']));

    let acc = 0;
    this.steps.forEach((s) => { s.start = acc; acc += s.dur; });
    this.total = acc;
  }

  /** Advance by `dt` seconds of game time. */
  tick(dt: number) {
    if (this.done) return;
    this.t += dt;
    const t = this.t;
    while (this.stepI < this.steps.length && this.steps[this.stepI].start <= t) this.steps[this.stepI++].run();
    if (t >= this.total) this.done = true;

    (['you', 'opp'] as Side[]).forEach((side, k) =>
      this.pl[side].forEach((p, i) => {
        const g = this.tg[side][i];
        const f = Math.min(1, this.spd * dt * (0.85 + 0.1 * ((i * 3 + k) % 4)));
        p[0] += (g[0] - p[0]) * f;
        p[1] += (g[1] - p[1]) * f;
      }),
    );
    const b = this.ball;
    if (b.fly) {
      const f = b.fly;
      f.t += dt;
      const u = Math.min(1, f.t / f.dur);
      const e = u * u * (3 - 2 * u);
      const to = typeof f.to === 'function' ? f.to() : f.to;
      b.x = f.from[0] + (to[0] - f.from[0]) * e;
      b.y = f.from[1] + (to[1] - f.from[1]) * e;
      if (u >= 1) {
        b.fly = null;
        f.done?.();
      }
    } else if (b.holder) {
      const p = this.pl[b.holder.side][b.holder.i];
      b.x = p[0] + 1;
      b.y = p[1] + 1;
    }
    if (this.splash && t - this.tFlag > 1.5) {
      this.splash = null;
      this.flash = null;
      this.bump = { you: false, opp: false };
    }
    if (this.flagClearAt !== null && t > this.flagClearAt) {
      [...this.rows.you, ...this.bench.you].forEach((r) => { if (r.flag) r.flag = undefined; });
      this.flagClearAt = null;
    }
    const rem = Math.max(0, 252 - t * 4);
    this.ticker.time = `${Math.floor(rem / 60)}:${String(Math.floor(rem % 60)).padStart(2, '0')}`;
  }

  snapshot(): Snapshot {
    const t = this.t;
    const rem = Math.max(0, 252 - t * 4);
    // A little drift keeps the dots from looking pinned in place.
    const wobble = (side: Side, k: number): Pt[] =>
      this.pl[side].map((p, i) => [
        Math.max(1, Math.min(93, p[0] + 0.5 * Math.sin(t * 1.7 + i * 2 + k))),
        Math.max(2, Math.min(48, p[1] + 0.4 * Math.cos(t * 1.5 + i))),
      ]);
    return {
      sy: this.score.you,
      so: this.score.opp,
      clock: `Q3 ${Math.floor(rem / 60)}:${String(Math.floor(rem % 60)).padStart(2, '0')}`,
      shot: Math.max(1, 24 - Math.floor((t - this.tShot) * 3)),
      fy: this.fouls.you,
      fo: this.fouls.opp,
      wy: this.wy,
      hist: [...this.hist],
      pos: { you: wobble('you', 0), opp: wobble('opp', 1) },
      ball: [this.ball.x, this.ball.y],
      holder: this.ball.holder ? { ...this.ball.holder } : null,
      rows: { you: clone(this.rows.you), opp: clone(this.rows.opp) },
      bench: { you: clone(this.bench.you), opp: clone(this.bench.opp) },
      ticker: { ...this.ticker },
      splash: this.splash ? { ...this.splash } : null,
      flash: this.flash ? { ...this.flash } : null,
      bump: { ...this.bump },
      done: this.done,
    };
  }
}
