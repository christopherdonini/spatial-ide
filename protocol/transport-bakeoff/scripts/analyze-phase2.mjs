#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * Independent analysis of a Phase 2 block artifact (README §16).
 *
 * Recomputes the verdict and every statistic from the raw per-run records rather than reading the
 * harness's own `summary` block. The harness computed those numbers; a measurement authority that
 * only transcribes them has verified nothing. Where this script and the artifact disagree, both are
 * reported.
 *
 * Two deliberate differences from the harness's in-page analysis, both stated in the results:
 *
 * 1. **Seed.** §16.4 declares seed `0x5EED205600000002`. `phase2.ts` defaults to `0x5eed2056` in a
 *    32-bit LCG — the declared 64-bit value cannot be held by that generator. This script uses the
 *    declared seed through splitmix64, so the declared analysis plan is executed as written.
 * 2. **Coverage.** The harness bootstraps only throughput. §16.4 asks for confidence intervals on
 *    the reported metrics, so all of them are computed here.
 *
 * Analysis plan, unchanged from §16.4: p50/p95/p99 by sort-and-index; percentile bootstrap over
 * **run-level means**, 10,000 resamples. Per-batch samples are not independent and are never pooled
 * for a CI.
 *
 * Usage: node scripts/analyze-phase2.mjs <report.json> [more.json ...]
 */

import { readFileSync } from 'node:fs';

const RESAMPLES = 10_000;
const SEED = 0x5eed205600000002n; // §16.4, as declared

/** splitmix64 — holds the declared 64-bit seed, which a 32-bit LCG cannot. */
function rng(seed) {
  let s = BigInt.asUintN(64, seed);
  return () => {
    s = BigInt.asUintN(64, s + 0x9e3779b97f4a7c15n);
    let z = s;
    z = BigInt.asUintN(64, (z ^ (z >> 30n)) * 0xbf58476d1ce4e5b9n);
    z = BigInt.asUintN(64, (z ^ (z >> 27n)) * 0x94d049bb133111ebn);
    z = z ^ (z >> 31n);
    return Number(z >> 11n) / 2 ** 53;
  };
}

const pct = (xs, p) => {
  if (!xs.length) return NaN;
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.floor((p / 100) * s.length))];
};
const mean = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : NaN);

/** Percentile bootstrap over run-level means (§16.4). One value per run in, [lo, hi] out. */
function bootstrapCI(runValues) {
  if (runValues.length < 2) return [NaN, NaN];
  const rnd = rng(SEED);
  const means = [];
  for (let i = 0; i < RESAMPLES; i++) {
    let acc = 0;
    for (let j = 0; j < runValues.length; j++) {
      acc += runValues[Math.floor(rnd() * runValues.length)];
    }
    means.push(acc / runValues.length);
  }
  means.sort((a, b) => a - b);
  return [means[Math.floor(0.025 * RESAMPLES)], means[Math.floor(0.975 * RESAMPLES)]];
}

/** §16.5's candidate x position interaction, recomputed from the runs. */
function orderEffect(runs, metric) {
  const half = runs.length / 2;
  const m = (xs) => mean(xs.map(metric));
  const by = (xs, c) => m(xs.filter((r) => r.candidate === c));
  const early = runs.filter((r) => r.position < half);
  const late = runs.filter((r) => r.position >= half);
  const earlyGap = by(early, 'websocket') - by(early, 'http-stream');
  const lateGap = by(late, 'websocket') - by(late, 'http-stream');
  const main = Math.abs((earlyGap + lateGap) / 2);
  return {
    earlyGap, lateGap, main,
    ratio: !isFinite(main) || main === 0 ? 0 : Math.abs(earlyGap - lateGap) / main,
    earlyA: by(early, 'websocket'), earlyB: by(early, 'http-stream'),
    lateA: by(late, 'websocket'), lateB: by(late, 'http-stream'),
  };
}

const METRICS = [
  ['t1 raw transport receipt (ms)', (r) => r.t1TransportMs],
  ['t2 - t1 checksum segment (ms)', (r) => r.t2ChecksumMs - r.t1TransportMs],
  ['Arrow decode, summed (ms)', (r) => r.decodeOnlyMs],
  ['t3 end-to-usable (ms)', (r) => r.t3DecodedMs],
  ['first-batch latency (ms)', (r) => r.firstBatchMs],
  ['transport throughput (MB/s)', (r) => r.transportMBs],
  ['peak JS heap (bytes)', (r) => r.peakJsHeapBytes],
];

for (const path of process.argv.slice(2)) {
  const r = JSON.parse(readFileSync(path, 'utf8'));
  const c = r.manifest.corpus;
  console.log('='.repeat(100));
  console.log(`${path}`);
  console.log(`config ${c.config} · ${c.batchCount} x ${c.rowsPerBatch} rows · ${c.totalWireBytes} wire B · batch ${c.maxBatchWireBytes} B`);
  console.log(`timestamp ${r.timestamp} · schema ${r.schema}`);
  console.log(`wire digest   ${c.wireDigest}`);
  console.log(`column digest ${c.columnDigest}`);

  // ---- independent verdict, not the harness's ----
  const mine = [];
  const digestsOk = r.runs.every((x) => x.wireDigestMatchesManifest);
  if (!digestsOk) mine.push('consumer wire digest != manifest on at least one run');
  const distinctDigests = new Set(r.runs.map((x) => x.wireDigest));
  if (distinctDigests.size !== 1) mine.push(`consumer digest differs across runs (${distinctDigests.size} distinct)`);
  if (r.runs.some((x) => x.batches !== c.batchCount)) mine.push('batch count mismatch');
  if (r.runs.some((x) => x.rows !== c.batchCount * c.rowsPerBatch)) mine.push('row count mismatch');
  if (r.runs.some((x) => x.crsTaggedBatches !== c.batchCount)) mine.push('CRS envelope tag missing on some batch');
  if (r.runs.some((x) => x.jsonFramesSeen !== 0)) mine.push('JSON on the data path');
  if (r.runs.some((x) => x.terminal?.kind !== 'Completed')) mine.push('a run did not end in Completed');
  if (r.environment.documentHiddenAtEnd) mine.push('§8: document hidden at completion');
  if (r.environment.becameHiddenDuringRun) mine.push('§8: tab backgrounded mid-run');
  if (r.environment.rafThrottleEvents > 0) mine.push(`§8: rAF throttled ${r.environment.rafThrottleEvents}x`);
  if (/Basic Render|WARP|SwiftShader/i.test(r.environment.gpu)) mine.push('§8: software rasterizer');
  if (r.environment.smokeMode) mine.push('§8: smoke mode');
  const perCand = ['websocket', 'http-stream'].map((k) => r.runs.filter((x) => x.candidate === k).length);
  if (perCand.some((n) => n < 5)) mine.push(`§16.5: fewer than 5 runs per candidate (${perCand.join('/')})`);
  const oe = orderEffect(r.runs, (x) => x.transportMBs);
  if (oe.ratio > 0.05) mine.push(`§16.5: order effect ${(oe.ratio * 100).toFixed(1)}% > 5%`);

  console.log(`\nharness verdict : valid=${r.valid}  ${JSON.stringify(r.invalidReasons)}`);
  console.log(`independent     : valid=${mine.length === 0}  ${JSON.stringify(mine)}`);
  if (r.invalidReasons.includes('watchdog fired')) {
    console.log('  note: "watchdog fired" is a §8 invalidator the independent pass cannot re-derive');
    console.log('        from the artifact (no heartbeat timeline is recorded); it is carried through.');
  }

  console.log(`\norder effect on throughput (§16.5)`);
  console.log(`  early A ${oe.earlyA.toFixed(3)}  early B ${oe.earlyB.toFixed(3)}  gap ${oe.earlyGap.toFixed(3)}`);
  console.log(`  late  A ${oe.lateA.toFixed(3)}  late  B ${oe.lateB.toFixed(3)}  gap ${oe.lateGap.toFixed(3)}`);
  console.log(`  main effect |mean gap| ${oe.main.toFixed(4)} MB/s · interaction |early-late| ${Math.abs(oe.earlyGap - oe.lateGap).toFixed(4)} MB/s`);
  console.log(`  ratio ${(oe.ratio * 100).toFixed(1)}%  (harness: ${(r.orderEffectRatio * 100).toFixed(1)}%)  threshold 5%`);

  for (const [label, f] of METRICS) {
    console.log(`\n${label}`);
    console.log('  cand  n   p50          p95          p99          mean         95% CI (bootstrap, run-level)');
    for (const cand of ['websocket', 'http-stream']) {
      const rs = r.runs.filter((x) => x.candidate === cand);
      const v = rs.map(f);
      const [lo, hi] = bootstrapCI(v);
      console.log(
        `  ${(cand === 'websocket' ? 'A' : 'B').padEnd(6)}${String(v.length).padEnd(4)}` +
          `${pct(v, 50).toFixed(2).padEnd(13)}${pct(v, 95).toFixed(2).padEnd(13)}${pct(v, 99).toFixed(2).padEnd(13)}` +
          `${mean(v).toFixed(2).padEnd(13)}[${lo.toFixed(2)}, ${hi.toFixed(2)}]`,
      );
    }
    const a = r.runs.filter((x) => x.candidate === 'websocket').map(f);
    const b = r.runs.filter((x) => x.candidate === 'http-stream').map(f);
    const d = ((pct(a, 50) - pct(b, 50)) / pct(b, 50)) * 100;
    // §16.9 rule 2 is about transfer-isolated THROUGHPUT only. Annotating any other row with it
    // would invent a decision rule the preregistration does not contain.
    const rule = label.startsWith('transport throughput')
      ? Math.abs(d) > 10
        ? '  >10% — §16.9 rule 2 selects the faster candidate'
        : '  within the 10% band — §16.9 rule 3 (§12 ordering on measured end-to-end cost) applies'
      : '';
    console.log(`  A vs B on p50: ${d >= 0 ? '+' : ''}${d.toFixed(2)}%${rule}`);
  }

  console.log(`\ncopy accounting per run (§7 stage 3 and stage 5)`);
  for (const cand of ['websocket', 'http-stream']) {
    const rs = r.runs.filter((x) => x.candidate === cand);
    const reasm = [...new Set(rs.map((x) => x.reassemblyCopies))];
    const contig = [...new Set(rs.map((x) => x.contiguousBatches))];
    const shares = [...new Set(rs.map((x) => x.arrowParseSharesBuffer))];
    const arrowCopies = [...new Set(rs.map((x) => c.batchCount - x.arrowParseSharesBuffer))];
    const total = [...new Set(rs.map((x) => x.reassemblyCopies + (c.batchCount - x.arrowParseSharesBuffer)))];
    console.log(
      `  ${cand === 'websocket' ? 'A' : 'B'}  reassembly ${JSON.stringify(reasm)}` +
        ` · contiguous ${JSON.stringify(contig)}/${c.batchCount}` +
        ` · arrow shares ${JSON.stringify(shares)}/${c.batchCount}` +
        ` · arrow-parse copies ${JSON.stringify(arrowCopies)}` +
        ` · TOTAL whole-payload copies/run ${JSON.stringify(total)}`,
    );
  }
  console.log();
}
