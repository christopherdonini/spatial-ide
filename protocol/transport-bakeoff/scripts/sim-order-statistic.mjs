/**
 * Operating characteristic of §16.5's order-effect gate versus §19.3's replacement.
 *
 * **Why this file exists.** §18 P3 records that §16.5's gate divides the drift interaction by the
 * candidate effect under test, so a true null diverges. That argument is algebraic and holds without
 * any data. This simulation converts "provably degenerate" from an assertion into something a reader
 * can re-run: it sweeps declared drift / effect / noise parameters and reports how often each
 * statistic declares a block confounded.
 *
 * **It deliberately uses no measured data.** Demonstrating the defect on the Phase-2 M/L blocks would
 * mean computing a new signed effect estimate over runs §8 declares inadmissible — "not 'worse data'
 * — not data". Dispersion from those blocks is used to size the budget (§19.7, declared there); no
 * signed effect from them appears anywhere.
 *
 * Run: node scripts/sim-order-statistic.mjs
 */

const SEED = 0x5eed305100000001n; // Phase 3, stream 1. 64-bit, honored — see §18 P7.
const REPS = 4000;
const RESAMPLES = 1000;

/**
 * splitmix64 — the declared 64-bit generator. §18 P7 records that Phase 2's 32-bit LCG silently
 * truncated the declared seed; this holds all 64 bits.
 *
 * BigInt arithmetic costs ~1 us per draw, and this sweep needs ~10^8 of them. So splitmix64 is used
 * for what it is declared for — turning the declared 64-bit seed into state — and its first two
 * outputs seed a fast Number-space generator for the draws themselves. The declared seed still
 * determines every number produced, which is what P7 requires; nothing is truncated on the way in.
 * The harness's own CI computation calls splitmix64 directly (10^4 draws, where the cost is fine).
 */
function splitmix64(seed) {
  let s = BigInt.asUintN(64, seed);
  const M = 0xffffffffffffffffn;
  return () => {
    s = (s + 0x9e3779b97f4a7c15n) & M;
    let z = s;
    z = ((z ^ (z >> 30n)) * 0xbf58476d1ce4e5b9n) & M;
    z = ((z ^ (z >> 27n)) * 0x94d049bb133111ebn) & M;
    z = z ^ (z >> 31n);
    return z;
  };
}

/** sfc32, seeded from splitmix64's output. Deterministic given SEED. */
function fastRng(seed) {
  const sm = splitmix64(seed);
  const w = () => Number(sm() & 0xffffffffn) >>> 0;
  let a = w(), b = w(), c = w(), d = w();
  return () => {
    a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
    let t = (a + b) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    d = (d + 1) | 0;
    t = (t + d) | 0;
    c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
  };
}

/** Box-Muller on a uniform source. */
function gaussian(rnd) {
  let u = 0;
  while (u === 0) u = rnd();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rnd());
}

/** The counterbalanced schedule under test: ABBA BAAB ABBA (§16.5, carried forward). */
const SCHEDULE = ['A', 'B', 'B', 'A', 'B', 'A', 'A', 'B', 'A', 'B', 'B', 'A'];

/**
 * Synthesize one block.
 * @param delta  true candidate effect on throughput: B is `delta` faster than A (0 = true null)
 * @param drift  monotone drift in throughput across the block, as a fraction, first run to last
 * @param noise  per-run multiplicative noise SD, as a fraction
 */
function block(rnd, delta, drift, noise) {
  return SCHEDULE.map((c, p) => {
    const base = 1 + (c === 'B' ? delta : 0);
    const trend = 1 + drift * (p / (SCHEDULE.length - 1));
    return { candidate: c, position: p, thr: base * trend * (1 + noise * gaussian(rnd)) };
  });
}

/** §16.5 as implemented in `web/src/phase2.ts::orderEffect` — reproduced exactly. */
function oldGate(runs) {
  const half = runs.length / 2;
  const mean = (xs) => (xs.length ? xs.reduce((a, r) => a + r.thr, 0) / xs.length : NaN);
  const gap = (xs) =>
    mean(xs.filter((r) => r.candidate === 'A')) - mean(xs.filter((r) => r.candidate === 'B'));
  const earlyGap = gap(runs.filter((r) => r.position < half));
  const lateGap = gap(runs.filter((r) => r.position >= half));
  const main = Math.abs((earlyGap + lateGap) / 2);
  if (!isFinite(main) || main === 0) return Infinity;
  return Math.abs(earlyGap - lateGap) / main;
}

/** §19.3's replacement: per-pair symmetric relative effect over the adjacent-pair decomposition. */
export function pairedTheta(runs) {
  const out = [];
  for (let i = 0; i < runs.length; i += 2) {
    const x = runs[i];
    const y = runs[i + 1];
    if (x.candidate === y.candidate) continue; // decomposition requires one of each
    const a = (x.candidate === 'A' ? x : y).thr;
    const b = (x.candidate === 'B' ? x : y).thr;
    out.push((2 * (b - a)) / (a + b));
  }
  return out;
}

/** Percentile bootstrap over pair-level values — §19.3's declared analysis plan, small-n variant. */
function bootstrapCI(xs, rnd, resamples = RESAMPLES) {
  if (xs.length < 2) return [NaN, NaN];
  const means = new Float64Array(resamples);
  for (let i = 0; i < resamples; i++) {
    let acc = 0;
    for (let j = 0; j < xs.length; j++) acc += xs[Math.floor(rnd() * xs.length)];
    means[i] = acc / xs.length;
  }
  means.sort();
  return [means[Math.floor(0.025 * resamples)], means[Math.floor(0.975 * resamples)]];
}

const rnd = fastRng(SEED);
const pct = (x) => (x * 100).toFixed(1).padStart(5) + '%';

console.log('Operating characteristic, §16.5 gate vs §19.3 paired estimator');
console.log(`seed 0x${SEED.toString(16)} · ${REPS} blocks per cell · schedule ${SCHEDULE.join('')}`);
console.log('');
console.log('"old invalidates" = fraction of blocks §16.5 declares confounded at its 5% threshold.');
console.log('"new covers"      = fraction of blocks whose §19.3 CI contains the true effect.');
console.log('A correct gate should invalidate at a rate driven by DRIFT, never by the effect size.');
console.log('');

const drifts = [0, 0.01, 0.03, 0.05];
const deltas = [0, 0.005, 0.01, 0.02, 0.05, 0.1, 0.2];
const noise = 0.01;

for (const drift of drifts) {
  console.log(`--- drift ${(drift * 100).toFixed(0)}% across the block, per-run noise SD ${(noise * 100).toFixed(0)}% ---`);
  console.log('  true effect | old invalidates | new covers | new median CI half-width');
  for (const delta of deltas) {
    let invalid = 0;
    let covered = 0;
    let halfWidths = [];
    for (let r = 0; r < REPS; r++) {
      const runs = block(rnd, delta, drift, noise);
      if (oldGate(runs) > 0.05) invalid++;
      const th = pairedTheta(runs);
      const [lo, hi] = bootstrapCI(th, rnd);
      // true symmetric effect for a multiplicative delta
      const trueTheta = (2 * delta) / (2 + delta);
      if (lo <= trueTheta && trueTheta <= hi) covered++;
      halfWidths.push((hi - lo) / 2);
    }
    halfWidths.sort((a, b) => a - b);
    console.log(
      `  ${pct(delta)}      | ${pct(invalid / REPS)}          | ${pct(covered / REPS)}     | ` +
        `+/-${(halfWidths[Math.floor(halfWidths.length / 2)] * 100).toFixed(2)} pp`,
    );
  }
  console.log('');
}

// ---------------------------------------------------------------------------------------------
// Interval calibration. The decision rule compares the interval against +/-10%, so an
// under-covering interval systematically over-selects the "entirely within +/-10%" branch — which
// is the branch that falls through to the copies ordering and selects Candidate A. An
// anti-conservative interval would therefore bias the study toward its own expected answer. The
// method is chosen here, before measuring, on measured coverage rather than on convention.
// ---------------------------------------------------------------------------------------------

/** Student-t interval over pair-level values. */
function tCI(xs) {
  // Two-sided 97.5th percentile of t at n-1 df, keyed by n. Must cover every pair count the
  // schedule can produce: a missing key silently falling back to a normal quantile under-covers.
  const T = {
    3: 4.303, 4: 3.182, 5: 2.776, 6: 2.571, 7: 2.447, 8: 2.365, 9: 2.306, 10: 2.262,
    11: 2.228, 12: 2.201, 13: 2.179, 14: 2.160, 15: 2.145, 16: 2.131, 17: 2.120, 18: 2.110,
    19: 2.101, 20: 2.093, 21: 2.086, 22: 2.080, 23: 2.074, 24: 2.069, 25: 2.064, 26: 2.060,
  };
  const n = xs.length;
  if (!(n in T)) throw new Error(`no t quantile for n=${n} — extend the table rather than falling back`);
  const m = xs.reduce((a, x) => a + x, 0) / n;
  const sd = Math.sqrt(xs.reduce((a, x) => a + (x - m) ** 2, 0) / (n - 1));
  const h = (T[n] ?? 2.0) * (sd / Math.sqrt(n));
  return [m - h, m + h];
}

/** Bias-corrected and accelerated bootstrap. */
function bcaCI(xs, rnd, resamples = RESAMPLES) {
  const n = xs.length;
  const obs = xs.reduce((a, x) => a + x, 0) / n;
  const boot = new Float64Array(resamples);
  for (let i = 0; i < resamples; i++) {
    let acc = 0;
    for (let j = 0; j < n; j++) acc += xs[Math.floor(rnd() * n)];
    boot[i] = acc / n;
  }
  boot.sort();
  let below = 0;
  for (let i = 0; i < resamples; i++) if (boot[i] < obs) below++;
  const p0 = Math.min(Math.max(below / resamples, 1e-6), 1 - 1e-6);
  const z0 = probit(p0);
  // jackknife acceleration
  const jack = xs.map((_, k) => {
    let acc = 0;
    for (let j = 0; j < n; j++) if (j !== k) acc += xs[j];
    return acc / (n - 1);
  });
  const jm = jack.reduce((a, x) => a + x, 0) / n;
  const num = jack.reduce((a, x) => a + (jm - x) ** 3, 0);
  const den = 6 * Math.pow(jack.reduce((a, x) => a + (jm - x) ** 2, 0), 1.5);
  const acc = den === 0 ? 0 : num / den;
  const adj = (z) => {
    const v = z0 + (z0 + z) / (1 - acc * (z0 + z));
    return Math.min(Math.max(normcdf(v), 1e-6), 1 - 1e-6);
  };
  const lo = boot[Math.floor(adj(-1.959964) * resamples)];
  const hi = boot[Math.min(resamples - 1, Math.floor(adj(1.959964) * resamples))];
  return [lo, hi];
}

function normcdf(z) {
  return 0.5 * (1 + erf(z / Math.SQRT2));
}
function erf(x) {
  const s = x < 0 ? -1 : 1;
  x = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * x);
  const y =
    1 -
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) *
      t *
      Math.exp(-x * x);
  return s * y;
}
function probit(p) {
  // Acklam's rational approximation, adequate for a bias correction term.
  const a = [-39.6968302866538, 220.946098424521, -275.928510446969, 138.357751867269, -30.6647980661472, 2.50662827745924];
  const b = [-54.4760987982241, 161.585836858041, -155.698979859887, 66.8013118877197, -13.2806815528857];
  const c = [-0.00778489400243029, -0.322396458041136, -2.40075827716184, -2.54973253934373, 4.37466414146497, 2.93816398269878];
  const d = [0.00778469570904146, 0.32246712907004, 2.445134137143, 3.75440866190742];
  const pl = 0.02425;
  if (p < pl) {
    const q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  if (p > 1 - pl) return -probit(1 - p);
  const q = p - 0.5;
  const r = q * q;
  return ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q) /
    (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
}

/** Extend a 12-run schedule to `pairs` pairs by repeating the AB/BA alternation. */
function blockN(rnd, delta, drift, noise, pairs) {
  const sched = [];
  for (let i = 0; i < pairs; i++) sched.push(...(i % 2 === 0 ? ['A', 'B'] : ['B', 'A']));
  return sched.map((c, p) => {
    const base = 1 + (c === 'B' ? delta : 0);
    const trend = 1 + drift * (p / (sched.length - 1));
    return { candidate: c, position: p, thr: base * trend * (1 + noise * gaussian(rnd)) };
  });
}

console.log('=== Interval calibration: measured 95% coverage by method and pair count ===');
console.log('(true effect 2%, drift 3%, noise SD 1% — coverage should be 95.0%)');
console.log('  pairs | percentile | Student-t |    BCa    | median t half-width');
for (const pairs of [6, 8, 10, 12]) {
  let cp = 0, ct = 0, cb = 0;
  const hw = [];
  for (let r = 0; r < REPS; r++) {
    const th = pairedTheta(blockN(rnd, 0.02, 0.03, 0.01, pairs));
    const trueTheta = (2 * 0.02) / (2 + 0.02);
    const [pl, ph] = bootstrapCI(th, rnd);
    const [tl, tv] = tCI(th);
    const [bl, bh] = bcaCI(th, rnd);
    if (pl <= trueTheta && trueTheta <= ph) cp++;
    if (tl <= trueTheta && trueTheta <= tv) ct++;
    if (bl <= trueTheta && trueTheta <= bh) cb++;
    hw.push((tv - tl) / 2);
  }
  hw.sort((a, b) => a - b);
  console.log(
    `  ${String(pairs).padStart(5)} |   ${pct(cp / REPS)}   |  ${pct(ct / REPS)}  |  ${pct(cb / REPS)}  | ` +
      `+/-${(hw[Math.floor(hw.length / 2)] * 100).toFixed(2)} pp`,
  );
}
console.log('');

// ---------------------------------------------------------------------------------------------
// Where the replacement estimator actually breaks. The adjacent-pair decomposition cancels drift
// exactly when drift is linear in position; non-linear drift leaves a residual. §19.3 declares a
// drift magnitude at which a block is flagged, and this is what sets it — the point where measured
// coverage falls away, not a round number chosen for looking reasonable.
// ---------------------------------------------------------------------------------------------

/** Drift shapes. `linear` is what the pair decomposition cancels; the others are what it does not. */
const SHAPES = {
  linear: (u) => u,
  quadratic: (u) => u * u,
  step: (u) => (u < 0.5 ? 0 : 1), // e.g. a background process starting mid-block
  spike: (u) => (u > 0.4 && u < 0.6 ? 1 : 0), // e.g. one transient stall
};

function blockShaped(rnd, delta, drift, noise, pairs, shape) {
  const sched = [];
  for (let i = 0; i < pairs; i++) sched.push(...(i % 2 === 0 ? ['A', 'B'] : ['B', 'A']));
  const f = SHAPES[shape];
  return sched.map((c, p) => {
    const base = 1 + (c === 'B' ? delta : 0);
    const trend = 1 + drift * f(p / (sched.length - 1));
    return { candidate: c, position: p, thr: base * trend * (1 + noise * gaussian(rnd)) };
  });
}

/** Observed within-block drift, as §19.3 defines it for reporting: pair-mean range / grand mean. */
function observedDrift(runs) {
  const pm = [];
  for (let i = 0; i < runs.length; i += 2) pm.push((runs[i].thr + runs[i + 1].thr) / 2);
  const g = pm.reduce((a, x) => a + x, 0) / pm.length;
  return (Math.max(...pm) - Math.min(...pm)) / g;
}

console.log('=== Drift tolerance of the paired estimator, by drift shape (10 pairs, effect 2%) ===');
console.log('Coverage should stay ~95%. Where it falls away is where the block must be flagged.');
console.log('  drift |   shape    | coverage | median observed drift');
for (const drift of [0.05, 0.1, 0.15, 0.2, 0.3, 0.5]) {
  for (const shape of ['linear', 'quadratic', 'step', 'spike']) {
    let cov = 0;
    const obs = [];
    for (let r = 0; r < REPS; r++) {
      const runs = blockShaped(rnd, 0.02, drift, 0.01, 10, shape);
      const th = pairedTheta(runs);
      const [lo, hi] = tCI(th);
      const trueTheta = (2 * 0.02) / (2 + 0.02);
      if (lo <= trueTheta && trueTheta <= hi) cov++;
      obs.push(observedDrift(runs));
    }
    obs.sort((a, b) => a - b);
    const c = cov / REPS;
    console.log(
      `  ${pct(drift)} | ${shape.padEnd(10)} |  ${pct(c)}  | ${pct(obs[Math.floor(obs.length / 2)])}` +
        (c < 0.9 ? '   <- degraded' : ''),
    );
  }
}
console.log('');

console.log('Divergence condition, stated as algebra and checkable without this simulation:');
console.log('  ratio = |earlyGap - lateGap| / |(earlyGap + lateGap)/2|');
console.log('  The numerator is the drift x candidate interaction; the denominator is the candidate');
console.log('  main effect. As the candidate effect -> 0 with any interaction noise present, the');
console.log('  denominator -> 0 and ratio -> infinity. The gate therefore rejects most strongly');
console.log('  exactly when the two candidates are most alike, which is the finding it exists to let');
console.log('  the study report. It is degenerate for its stated purpose, independent of any data.');
