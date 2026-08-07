// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * Phase-3 analysis coverage (README §19.3, §19.5, §19.9).
 *
 * Every function under test here is pure, which is deliberate: §19.3 replaces a decision-critical
 * statistic that was wrong, and "the replacement is correct" must be a checked property rather than
 * a reading of the diff. §18 P3 exists because nobody could check the last one.
 *
 * Run with `npm test`.
 */

import {
  StructuralDigest,
  pairedTheta,
  tCI,
  bootstrapCI,
  observedDrift,
  classify,
  analyseBlock,
  splitmix64,
  SCHEDULE,
  PAIRS,
  type Candidate,
} from './phase3.js';
import { FrameDecoder, TAG, FRAME_PREFIX_LEN } from './wire.js';
import { Sha256Stream } from './sha256.js';

let failures = 0;
function check(name: string, cond: boolean, detail = '') {
  if (cond) console.log(`  PASS  ${name}`);
  else {
    console.error(`  FAIL  ${name}${detail ? ` — ${detail}` : ''}`);
    failures++;
  }
}
const close = (a: number, b: number, eps = 1e-9) => Math.abs(a - b) < eps;

console.log('\n§19.3 — the schedule is order-balanced by construction');
{
  check('schedule length is 2 x PAIRS', SCHEDULE.length === PAIRS * 2, `${SCHEDULE.length}`);
  const a = SCHEDULE.filter((c) => c === 'websocket').length;
  const b = SCHEDULE.filter((c) => c === 'http-stream').length;
  check('equal runs per candidate', a === b && a === PAIRS, `${a} vs ${b}`);
  let ab = 0;
  let ba = 0;
  for (let i = 0; i < SCHEDULE.length; i += 2) {
    check(`pair ${i / 2} holds one of each`, SCHEDULE[i] !== SCHEDULE[i + 1]);
    if (SCHEDULE[i] === 'websocket') ab++;
    else ba++;
  }
  // Without this the paired estimator inherits exactly the order confound it exists to remove.
  check('AB and BA pairs are balanced', ab === ba, `${ab} AB vs ${ba} BA`);
}

console.log('\n§19.3 — the symmetric effect, and the sign convention the decision rule depends on');
{
  const runs = (pairs: [number, number][]) =>
    pairs.flatMap(([a, b]) => [
      { candidate: 'websocket' as Candidate, transportMBs: a },
      { candidate: 'http-stream' as Candidate, transportMBs: b },
    ]);

  check('identical throughput gives exactly zero', close(pairedTheta(runs([[100, 100]]))[0], 0));

  // theta > 0 must mean B faster. §19.9 rule 2 reads "CI entirely above +10% selects B", so an
  // inverted sign here would silently select the wrong candidate.
  check('B faster gives a positive theta', pairedTheta(runs([[100, 110]]))[0] > 0);
  check('A faster gives a negative theta', pairedTheta(runs([[110, 100]]))[0] < 0);

  // The symmetric denominator is what closes §18 P9: the result must not depend on which candidate
  // is treated as the base. 100 vs 110 read against A is +10%, against B is -9.09%; symmetric is
  // 2*10/210 = 9.5238%, and it is the SAME magnitude when the roles are swapped.
  const fwd = pairedTheta(runs([[100, 110]]))[0];
  const rev = pairedTheta(runs([[110, 100]]))[0];
  check('symmetric: swapping roles only flips the sign', close(fwd, -rev), `${fwd} vs ${rev}`);
  check('symmetric value is 2*(b-a)/(a+b)', close(fwd, (2 * 10) / 210), `${fwd}`);

  // Order within the pair must not change the estimate — the pair is unordered by construction.
  const asAB = pairedTheta([
    { candidate: 'websocket', transportMBs: 100 },
    { candidate: 'http-stream', transportMBs: 110 },
  ])[0];
  const asBA = pairedTheta([
    { candidate: 'http-stream', transportMBs: 110 },
    { candidate: 'websocket', transportMBs: 100 },
  ])[0];
  check('pair order does not change theta', close(asAB, asBA));

  // A pair of the same candidate is not a pair; silently treating it as one would fabricate data.
  check(
    'same-candidate pairs are dropped, not coerced',
    pairedTheta([
      { candidate: 'websocket', transportMBs: 100 },
      { candidate: 'websocket', transportMBs: 110 },
    ]).length === 0,
  );
}

console.log('\n§19.3 — the interval');
{
  const xs = [0.04, 0.05, 0.03, 0.045, 0.035, 0.042];
  const [lo, hi] = tCI(xs);
  const mean = xs.reduce((a, x) => a + x, 0) / xs.length;
  check('t interval brackets the mean', lo < mean && mean < hi);
  check('t interval is symmetric about the mean', close((lo + hi) / 2, mean, 1e-12));

  // The n=12 fallback bug: an early draft's table stopped at 10 and silently used a normal
  // quantile, under-covering exactly where the decision is made.
  let threw = false;
  try {
    tCI(new Array(40).fill(0.01));
  } catch {
    threw = true;
  }
  check('an unlisted sample size throws rather than falling back', threw);

  // Wider data must give a wider interval — the property the decision rule leans on.
  const tight = tCI([0.05, 0.05, 0.05, 0.051, 0.049, 0.05]);
  const loose = tCI([0.05, 0.2, -0.1, 0.3, -0.2, 0.05]);
  check('noisier data widens the interval', hi - lo > 0 && loose[1] - loose[0] > tight[1] - tight[0]);
}

console.log('\n§18 P7 — the declared 64-bit seed is actually held');
{
  // Phase 2 declared 0x5EED205600000002 and used 0x5eed2056 in a 32-bit LCG, so the low 32 bits of
  // the declared seed could not affect anything. Two seeds differing ONLY in their low 32 bits must
  // now produce different streams.
  const a = splitmix64(0x5eed305100000001n);
  const b = splitmix64(0x5eed305100000002n);
  const sa = Array.from({ length: 8 }, () => a());
  const sb = Array.from({ length: 8 }, () => b());
  check('low 32 bits of the seed change the stream', sa.some((x, i) => x !== sb[i]));

  const c = splitmix64(0x5eed305100000001n);
  check(
    'the generator is deterministic',
    Array.from({ length: 8 }, () => c()).every((x, i) => x === sa[i]),
  );
  check('draws are in [0,1)', sa.every((x) => x >= 0 && x < 1));

  const xs = [0.04, 0.05, 0.03, 0.045, 0.035, 0.042];
  const [bl, bh] = bootstrapCI(xs, 2000);
  check('bootstrap interval is ordered and finite', isFinite(bl) && isFinite(bh) && bl < bh);
  const [bl2, bh2] = bootstrapCI(xs, 2000);
  check('bootstrap is reproducible for a fixed seed', bl === bl2 && bh === bh2);
}

console.log('\n§19.9 — branch classification');
{
  check('entirely above +10% selects B', classify([0.11, 0.15]) === 'B-wins');
  check('entirely below -10% selects A', classify([-0.2, -0.11]) === 'A-wins');
  check('entirely within the band is equivalence', classify([-0.02, 0.04]) === 'equivalent');
  check('straddling the upper boundary is inconclusive', classify([0.08, 0.13]) === 'inconclusive');
  check('straddling the lower boundary is inconclusive', classify([-0.13, -0.05]) === 'inconclusive');
  check('straddling zero but inside the band is equivalence', classify([-0.09, 0.09]) === 'equivalent');
  // Exactly on the boundary must not select a winner: the rule says "entirely above".
  check('exactly on the boundary is not a win', classify([0.1, 0.2]) !== 'B-wins');
  check('a non-finite interval is inconclusive', classify([NaN, NaN]) === 'inconclusive');
}

console.log('\n§19.3 — drift is measured but does not invalidate');
{
  const flat = Array.from({ length: 20 }, (_, i) => ({
    candidate: (i % 2 === 0 ? 'websocket' : 'http-stream') as Candidate,
    transportMBs: 100,
  }));
  check('no drift on a flat block', close(observedDrift(flat), 0));

  const drifting = Array.from({ length: 20 }, (_, i) => ({
    candidate: (i % 2 === 0 ? 'websocket' : 'http-stream') as Candidate,
    transportMBs: 100 + i * 5,
  }));
  check('drift is detected when present', observedDrift(drifting) > 0.5);

  // The load-bearing property: a block where the candidates are indistinguishable must remain
  // ADMISSIBLE. §16.5's gate rejected 98.4% of exactly these, which is why it was replaced.
  const nullBlock = Array.from({ length: 20 }, (_, i) => ({
    candidate: SCHEDULE[i],
    transportMBs: 100 + (i % 3) * 0.01,
  }));
  const a = analyseBlock(nullBlock);
  check(
    'a true null does not invalidate the block',
    !a.invalid.some((r) => /drift|order/i.test(r)),
    a.invalid.join('; '),
  );
  check('a true null classifies as equivalent', a.branch === 'equivalent', a.branch);
}

console.log('\n§19.8 — imprecision and interval disagreement are invalidators, not footnotes');
{
  // A block too noisy to decide must say so rather than returning a confident-looking branch.
  const noisy = SCHEDULE.map((c, i) => ({
    candidate: c,
    transportMBs: c === 'websocket' ? 100 + (i % 2 ? 400 : -60) : 100 + (i % 3 ? -70 : 500),
  }));
  const an = analyseBlock(noisy);
  check(
    'an imprecise block is flagged by the realized half-width rule',
    an.halfWidth > 0.1 ? an.invalid.some((r) => /half-width/.test(r)) : true,
    `halfWidth=${an.halfWidth}`,
  );
}

console.log('\n§19.5 — the structural digest');
{
  const mk = (i: number, len: number, fill: number) => {
    const p = new Uint8Array(len);
    p.fill(fill);
    return { i, p };
  };
  const digestOf = (items: { i: number; p: Uint8Array }[]) => {
    const d = new StructuralDigest();
    for (const { i, p } of items) d.update(i, p);
    return d.digest();
  };

  const base = [mk(0, 64, 1), mk(1, 64, 2), mk(2, 64, 3)];
  check('deterministic', digestOf(base) === digestOf(base));

  // The failures §19.5 claims it detects. Each must actually change the digest.
  check('detects a dropped batch', digestOf(base) !== digestOf(base.slice(0, 2)));
  check('detects reordering', digestOf(base) !== digestOf([base[1], base[0], base[2]]));
  check('detects a changed length', digestOf(base) !== digestOf([mk(0, 63, 1), base[1], base[2]]));
  check('detects changed leading bytes', digestOf(base) !== digestOf([mk(0, 64, 9), base[1], base[2]]));

  const tailChanged = new Uint8Array(64);
  tailChanged.fill(1);
  tailChanged[63] = 7;
  check(
    'detects changed trailing bytes',
    digestOf(base) !== digestOf([{ i: 0, p: tailChanged }, base[1], base[2]]),
  );

  // And the residual §19.5 declares rather than hides: interior corruption is NOT detected. This
  // asserts the stated limitation, so the claim in §19.5 cannot quietly drift into "detects
  // everything".
  const interior = new Uint8Array(64);
  interior.fill(1);
  interior[32] = 200;
  check(
    'does NOT detect interior corruption — the declared residual (§19.5)',
    digestOf(base) === digestOf([{ i: 0, p: interior }, base[1], base[2]]),
  );
}

console.log('\n§19.5 — equal instrumentation: the hasher is the only difference');
{
  // If enabling the hasher changed what the decoder produced, the verification transfer would not
  // be verifying the thing the timed runs measure — §8's "unequal instrumentation" in a new place.
  const payloads = [new Uint8Array(300), new Uint8Array(120), new Uint8Array(900)];
  payloads.forEach((p, i) => p.forEach((_, j) => (p[j] = (i * 31 + j) & 0xff)));
  const frames = payloads.map((p) => {
    const out = new Uint8Array(FRAME_PREFIX_LEN + p.length);
    out[0] = TAG.BATCH;
    new DataView(out.buffer).setUint32(4, p.length, false);
    out.set(p, FRAME_PREFIX_LEN);
    return out;
  });
  const stream = new Uint8Array(frames.reduce((n, f) => n + f.length, 0));
  let off = 0;
  for (const f of frames) {
    stream.set(f, off);
    off += f.length;
  }

  const run = (hashing: boolean) => {
    const d = new FrameDecoder();
    const h = hashing ? new Sha256Stream() : null;
    if (h) d.onBatchBytes = (s) => h.update(s);
    const structural = new StructuralDigest();
    const lens: number[] = [];
    let n = 0;
    // Chunked at a size that forces reassembly, so the copy-counting path runs too.
    for (let i = 0; i < stream.length; i += 137) {
      for (const f of d.push(stream.subarray(i, Math.min(i + 137, stream.length)))) {
        if (f.t === 'batch') {
          structural.update(n++, f.payload);
          lens.push(f.payload.length);
        }
      }
    }
    return { lens, structural: structural.digest(), copies: d.stats.reassemblyCopies, hash: h?.digest() };
  };

  const off_ = run(false);
  const on_ = run(true);
  check('same batch count and lengths', JSON.stringify(off_.lens) === JSON.stringify(on_.lens));
  check('same structural digest', off_.structural === on_.structural);
  check('same reassembly copy count', off_.copies === on_.copies, `${off_.copies} vs ${on_.copies}`);
  check('the hasher produces a digest only when enabled', !off_.hash && !!on_.hash);
}

console.log('');
if (failures > 0) {
  console.error(`analysis: FAILED (${failures})`);
  process.exitCode = 1;
} else {
  console.log('analysis: PASS');
}
