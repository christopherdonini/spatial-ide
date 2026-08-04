/**
 * §19.7 precision check — is the declared Phase-3 budget capable of a conclusive answer?
 *
 * Run BEFORE the Phase-3 schedule. If the predicted CI half-width for the symmetric effect cannot
 * fit inside +/-10% even on the optimistic dispersion basis, the budget is insufficient and the
 * session stops for the human rather than being spent.
 *
 * **What this script may and may not take from Phase 2.** §8 makes inadmissible runs "not 'worse
 * data' - not data", and §16.1 forbids re-analysing a frozen phase under a later phase's rules. The
 * line §19.1 draws, and this script enforces mechanically:
 *
 *   - **Dispersion** (how noisy the instrument was) MAY be used to size a run count. A run count
 *     cannot select a candidate; it can only widen or narrow an interval, and §19.9's inconclusive
 *     branch already absorbs that.
 *   - **A signed effect estimate** (which transport was faster) MAY NOT leave the invalid blocks.
 *
 * So this script computes pair-level standard deviations and prints them. It deliberately does NOT
 * print the pair-level means, and `assertNoSignedEffect` below fails the run if a caller tries to.
 * That is not decoration: the mean is the one number that would turn a budget calculation into an
 * unauthorised re-analysis, and it is the number that would make §16.5's removal look
 * outcome-motivated.
 *
 * Run: node scripts/precision-check.mjs
 */

import fs from 'node:fs';
import path from 'node:path';

const DIR = 'results/phase2';

/** Two-sided 97.5th percentile of t at n-1 df. §19.3's decision interval. */
const T = {
  3: 4.303, 4: 3.182, 5: 2.776, 6: 2.571, 7: 2.447, 8: 2.365, 9: 2.306, 10: 2.262,
  11: 2.228, 12: 2.201, 13: 2.179, 14: 2.160, 15: 2.145, 16: 2.131, 17: 2.120, 18: 2.110,
  19: 2.101, 20: 2.093, 21: 2.086, 22: 2.080, 23: 2.074, 24: 2.069, 25: 2.064, 26: 2.060,
};

/** §17.7's measured `Sha256Stream` cost over the Phase-2 payload, per configuration, ms p50. */
const HASHER_MS = { S: 4456.8, M: 4089.9, L: 4102.5 };

/** Guard: nothing derived from an inadmissible block may be a signed effect. */
function assertNoSignedEffect(label, value) {
  if (Number.isFinite(value)) {
    throw new Error(
      `refusing to emit a signed effect estimate (${label}) derived from Phase-2 blocks — ` +
        `§19.1 permits dispersion only`,
    );
  }
}

/**
 * Pair-level dispersion for one block. Returns SD only.
 * The pair decomposition is §19.3's: adjacent runs, one A and one B, order-balanced.
 */
function pairDispersion(runs) {
  const thetas = [];
  for (let i = 0; i < runs.length; i += 2) {
    const x = runs[i];
    const y = runs[i + 1];
    if (!y || x.candidate === y.candidate) continue;
    const a = (x.candidate === 'websocket' ? x : y).t1TransportMs;
    const b = (x.candidate === 'http-stream' ? x : y).t1TransportMs;
    const thrA = 1 / a;
    const thrB = 1 / b;
    thetas.push((2 * (thrB - thrA)) / (thrA + thrB));
  }
  if (thetas.length < 2) return null;
  const m = thetas.reduce((s, x) => s + x, 0) / thetas.length;
  const sd = Math.sqrt(thetas.reduce((s, x) => s + (x - m) ** 2, 0) / (thetas.length - 1));
  // `m` is the signed effect. It stays in this scope and is never returned or printed.
  return { n: thetas.length, sd };
}

/** Mean t1 for a block, used only to derive the hasher rescaling factor. */
function meanT1(runs) {
  return runs.reduce((s, r) => s + r.t1TransportMs, 0) / runs.length;
}

const rows = [];
for (const f of fs.readdirSync(DIR).filter((x) => x.endsWith('.json')).sort()) {
  const j = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'));
  const cfg = j.manifest?.corpus?.config;
  const d = pairDispersion(j.runs);
  if (!d) continue;
  const t1 = meanT1(j.runs);
  const h = HASHER_MS[cfg] ?? 0;
  // Removing a large common per-byte cost rescales theta and its SD by t1 / (t1 - h).
  const factor = h > 0 && t1 > h ? t1 / (t1 - h) : 1;
  rows.push({
    file: f.slice(-9, -5),
    cfg,
    admissible: j.valid,
    pairs: d.n,
    sdRaw: d.sd,
    factor,
    sdProjected: d.sd * factor,
  });
}

console.log('§19.7 precision check — predicted CI half-width for the symmetric effect');
console.log('');
console.log('Dispersion input from Phase-2 blocks, INCLUDING INADMISSIBLE ONES (§19.1 design input).');
console.log('Signed effects are not computed here and never leave those blocks.');
console.log('');
console.log('  block  cfg  admissible  pairs  pair-SD (raw)  hasher factor  pair-SD (projected)');
for (const r of rows) {
  console.log(
    `  ${r.file}   ${r.cfg}   ${String(r.admissible).padEnd(10)}  ${String(r.pairs).padStart(5)}  ` +
      `${(r.sdRaw * 100).toFixed(2).padStart(10)} pp  ${r.factor.toFixed(2).padStart(11)}x  ` +
      `${(r.sdProjected * 100).toFixed(2).padStart(15)} pp`,
  );
}
console.log('');
console.log('"projected" = SD after removing the consumer hasher from the timed path (§19.5).');
console.log('Removing a large common per-byte cost rescales both theta and its SD by t1/(t1-hasher).');
console.log('');

const PAIRS = 10; // §19.7's declared budget
const tcrit = T[PAIRS];
const optimistic = Math.min(...rows.map((r) => r.sdProjected));
const pessimistic = Math.max(...rows.map((r) => r.sdProjected));
const hw = (sd) => (tcrit * sd) / Math.sqrt(PAIRS);

console.log(`Declared budget: ${PAIRS} pairs (${PAIRS * 2} timed runs) per configuration, t at ${PAIRS - 1} df = ${tcrit}`);
console.log('');
console.log(`  optimistic basis (cleanest block, SD ${(optimistic * 100).toFixed(2)} pp): half-width +/-${(hw(optimistic) * 100).toFixed(2)} pp`);
console.log(`  pessimistic basis (noisiest block, SD ${(pessimistic * 100).toFixed(2)} pp): half-width +/-${(hw(pessimistic) * 100).toFixed(2)} pp`);
console.log('');

console.log('  pairs needed for a +/-10 pp half-width, by dispersion basis:');
for (const [label, sd] of [['optimistic', optimistic], ['pessimistic', pessimistic]]) {
  let n = 3;
  while (n <= 26 && (T[n] * sd) / Math.sqrt(n) > 0.1) n++;
  console.log(`    ${label.padEnd(12)}: ${n <= 26 ? n + ' pairs' : '>26 pairs'}`);
}
console.log('');

// §19.7's declared verdict rule, applied.
const PASS = hw(optimistic) < 0.1;
console.log('§19.7 verdict rule: the budget is insufficient only if the predicted half-width cannot');
console.log('fit inside +/-10% EVEN ON THE OPTIMISTIC BASIS. On the pessimistic basis it need not');
console.log('fit — that outcome is "inconclusive", which §19.9 already treats as legitimate.');
console.log('');
if (PASS) {
  console.log(`VERDICT: BUDGET SUFFICIENT — optimistic half-width +/-${(hw(optimistic) * 100).toFixed(2)} pp fits inside +/-10%.`);
  console.log('Proceed to the R1-R8 gate (§19.6), then the schedule (§19.7).');
} else {
  console.log(`VERDICT: BUDGET INSUFFICIENT — optimistic half-width +/-${(hw(optimistic) * 100).toFixed(2)} pp does not fit inside +/-10%.`);
  console.log('STOP. Do not spend the session. Report to the human per §19.7.');
}
process.exitCode = PASS ? 0 : 2;

export { pairDispersion, assertNoSignedEffect };
