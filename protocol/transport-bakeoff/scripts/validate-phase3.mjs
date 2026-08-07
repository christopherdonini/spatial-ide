#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * Tester-side independent revalidation of the Phase-3 artifacts (README §19).
 *
 * Written to be independent of BOTH `web/src/phase3.ts` (the harness's own analysis) and
 * `scripts/verify-phase3.mjs` (the harness author's verifier):
 *
 *   - the Student-t quantile is COMPUTED (regularized incomplete beta + bisection), not tabulated,
 *     so a wrong table entry in either of the other two implementations cannot be inherited;
 *   - splitmix64 is checked against the published reference vector for seed 0 before it is used;
 *   - every statistic is recomputed from `runs[].transportMBs` / `runs[].candidate` only.
 *
 *   node scripts/validate-phase3.mjs results/phase3/*.json
 */
import fs from 'node:fs';
import path from 'node:path';

// ------------------------------------------------------------------------------------------------
// Student-t quantile, computed rather than tabulated.
// ------------------------------------------------------------------------------------------------

function logGamma(x) {
  // Lanczos g=7, n=9
  const g = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313,
    -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6,
    1.5056327351493116e-7,
  ];
  if (x < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * x)) - logGamma(1 - x);
  x -= 1;
  let a = g[0];
  const t = x + 7.5;
  for (let i = 1; i < 9; i++) a += g[i] / (x + i);
  return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
}

/** Continued-fraction regularized incomplete beta I_x(a,b) (Lentz). */
function betacf(a, b, x) {
  const FPMIN = 1e-300, EPS = 3e-16;
  const qab = a + b, qap = a + 1, qam = a - 1;
  let c = 1, d = 1 - (qab * x) / qap;
  if (Math.abs(d) < FPMIN) d = FPMIN;
  d = 1 / d;
  let h = d;
  for (let m = 1; m <= 300; m++) {
    const m2 = 2 * m;
    let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2));
    d = 1 + aa * d; if (Math.abs(d) < FPMIN) d = FPMIN;
    c = 1 + aa / c; if (Math.abs(c) < FPMIN) c = FPMIN;
    d = 1 / d; h *= d * c;
    aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2));
    d = 1 + aa * d; if (Math.abs(d) < FPMIN) d = FPMIN;
    c = 1 + aa / c; if (Math.abs(c) < FPMIN) c = FPMIN;
    d = 1 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < EPS) break;
  }
  return h;
}

function ibeta(a, b, x) {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const lbt = logGamma(a + b) - logGamma(a) - logGamma(b) + a * Math.log(x) + b * Math.log(1 - x);
  const bt = Math.exp(lbt);
  return x < (a + 1) / (a + b + 2) ? (bt * betacf(a, b, x)) / a : 1 - (bt * betacf(b, a, 1 - x)) / b;
}

/** P(T <= t) for Student-t with df degrees of freedom. */
function tCDF(t, df) {
  const x = df / (df + t * t);
  const p = 0.5 * ibeta(df / 2, 0.5, x);
  return t > 0 ? 1 - p : p;
}

/** Two-sided 97.5th percentile of Student-t at df, by bisection on the computed CDF. */
function tQuantile975(df) {
  let lo = 0, hi = 100;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (tCDF(mid, df) < 0.975) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

// ------------------------------------------------------------------------------------------------
// splitmix64, checked against the published reference vector before use.
// ------------------------------------------------------------------------------------------------

function splitmix64Raw(seed) {
  let s = BigInt.asUintN(64, seed);
  const M = 0xffffffffffffffffn;
  return () => {
    s = (s + 0x9e3779b97f4a7c15n) & M;
    let z = s;
    z = ((z ^ (z >> 30n)) * 0xbf58476d1ce4e5b9n) & M;
    z = ((z ^ (z >> 27n)) * 0x94d049bb133111ebn) & M;
    return z ^ (z >> 31n);
  };
}

function selfTestSplitmix() {
  const r = splitmix64Raw(0n);
  const want = [0xe220a8397b1dcdafn, 0x6e789e6aa1b965f4n, 0x06c45d188009454fn];
  const got = [r(), r(), r()];
  const ok = want.every((w, i) => w === got[i]);
  return { ok, got: got.map((x) => x.toString(16)) };
}

const doubles = (seed) => {
  const r = splitmix64Raw(seed);
  return () => Number(r() >> 11n) / 2 ** 53;
};

// ------------------------------------------------------------------------------------------------
// §19.3 statistics.
// ------------------------------------------------------------------------------------------------

const mean = (xs) => xs.reduce((a, x) => a + x, 0) / xs.length;
const sdev = (xs) => {
  const m = mean(xs);
  return Math.sqrt(xs.reduce((a, x) => a + (x - m) ** 2, 0) / (xs.length - 1));
};
const pct = (xs, p) => {
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.floor((p / 100) * s.length))];
};

/** §19.3: theta_i = 2 (thr_B - thr_A) / (thr_A + thr_B) over the adjacent-pair decomposition. */
function pairTheta(runs) {
  const out = [];
  for (let i = 0; i + 1 < runs.length; i += 2) {
    const pairRuns = [runs[i], runs[i + 1]];
    const A = pairRuns.find((r) => r.candidate === 'websocket');
    const B = pairRuns.find((r) => r.candidate === 'http-stream');
    if (!A || !B) { out.push(NaN); continue; }
    out.push((2 * (B.transportMBs - A.transportMBs)) / (A.transportMBs + B.transportMBs));
  }
  return out;
}

function studentCI(xs) {
  const n = xs.length;
  const t = tQuantile975(n - 1);
  const h = (t * sdev(xs)) / Math.sqrt(n);
  return { lo: mean(xs) - h, hi: mean(xs) + h, half: h, t };
}

function percentileBootstrap(xs, resamples = 10_000, seed = 0x5eed305100000001n) {
  const rnd = doubles(seed);
  const ms = new Array(resamples);
  for (let i = 0; i < resamples; i++) {
    let acc = 0;
    for (let j = 0; j < xs.length; j++) acc += xs[Math.floor(rnd() * xs.length)];
    ms[i] = acc / xs.length;
  }
  ms.sort((a, b) => a - b);
  return [ms[Math.floor(0.025 * resamples)], ms[Math.floor(0.975 * resamples)]];
}

/** §19.3: (max pair-mean throughput - min pair-mean throughput) / grand mean of pair-means. */
function observedDrift(runs) {
  const pm = [];
  for (let i = 0; i + 1 < runs.length; i += 2) pm.push((runs[i].transportMBs + runs[i + 1].transportMBs) / 2);
  const g = mean(pm);
  return { drift: (Math.max(...pm) - Math.min(...pm)) / g, pairMeans: pm, grand: g };
}

/** §19.9 rules 2-5 applied to one interval on the symmetric scale. */
function classify([lo, hi], band = 0.1) {
  if (!isFinite(lo) || !isFinite(hi)) return 'inconclusive';
  if (lo > band) return 'B-wins';
  if (hi < -band) return 'A-wins';
  if (lo >= -band && hi <= band) return 'equivalent';
  return 'inconclusive';
}

// ------------------------------------------------------------------------------------------------

const p2 = (x) => (x * 100).toFixed(2);
const problems = [];
const flag = (m) => { problems.push(m); console.log(`   !! ${m}`); };

const st = selfTestSplitmix();
console.log(`splitmix64 reference vector (seed 0): ${st.ok ? 'MATCH' : 'MISMATCH'} [${st.got.join(', ')}]`);
if (!st.ok) flag('splitmix64 self-test failed — bootstrap figures below are not trustworthy');
console.log(
  `computed t quantiles: df=9 -> ${tQuantile975(9).toFixed(6)} (harness table 2.262) · ` +
  `df=19 -> ${tQuantile975(19).toFixed(6)}`,
);

for (const file of process.argv.slice(2)) {
  const j = JSON.parse(fs.readFileSync(file, 'utf8'));
  const runs = j.runs;
  const n2 = String(j.configuration).startsWith('N2');
  const bc = j.manifest.corpus.batchCount;
  const bytes = j.manifest.corpus.totalWireBytes * (n2 ? 2 : 1);

  console.log(`\n================ ${path.basename(file)}  config=${j.configuration}  artifact valid=${j.valid}`);
  console.log(`  schema=${j.schema}  prereg=${j.preregistration}  ts=${j.timestamp}`);
  console.log(`  artifact invalidReasons: ${JSON.stringify(j.invalidReasons)}`);

  // -- schedule / decomposition ------------------------------------------------------------------
  const realized = runs.map((r) => (r.candidate === 'websocket' ? 'A' : 'B')).join('');
  const declared = j.schedule.map((s) => (s === 'websocket' ? 'A' : 'B')).join('');
  console.log(`  realized ${realized}`);
  console.log(`  declared ${declared}  ${realized === declared ? '(match)' : '(MISMATCH)'}`);
  if (realized !== declared) flag(`${path.basename(file)}: realized order != declared schedule`);
  if (runs.length !== 20) flag(`${path.basename(file)}: ${runs.length} timed runs, §19.7 declares 20`);
  let ab = 0, ba = 0;
  for (let i = 0; i + 1 < runs.length; i += 2) {
    if (runs[i].candidate === runs[i + 1].candidate) flag(`${path.basename(file)}: pair ${i / 2} holds two ${runs[i].candidate} runs`);
    else if (runs[i].candidate === 'websocket') ab++; else ba++;
  }
  if (ab !== ba) flag(`${path.basename(file)}: AB/BA imbalance ${ab}/${ba}`);
  runs.forEach((r, i) => {
    if (r.position !== i) flag(`${path.basename(file)}: run ${i} carries position ${r.position}`);
    if (r.pair !== Math.floor(i / 2)) flag(`${path.basename(file)}: run ${i} carries pair ${r.pair}`);
  });
  console.log(`  pairs ${runs.length / 2}  AB=${ab} BA=${ba}`);

  // -- throughput must be bytes / t1 -------------------------------------------------------------
  for (const r of runs) {
    const want = bytes / 1e6 / (r.t1TransportMs / 1000);
    if (Math.abs(r.transportMBs - want) > 1e-9 * Math.max(1, want)) {
      flag(`${path.basename(file)}: pos${r.position} transportMBs ${r.transportMBs} != bytes/t1 ${want}`);
    }
  }

  // -- theta / intervals / drift -----------------------------------------------------------------
  const th = pairTheta(runs);
  const ci = studentCI(th);
  const boot = percentileBootstrap(th);
  const dr = observedDrift(runs);
  const tB = classify([ci.lo, ci.hi]);
  const bB = classify(boot);

  console.log(`  theta per pair (%): ${th.map((x) => p2(x)).join(', ')}`);
  console.log(`  theta mean ${p2(mean(th))}%  SD ${p2(sdev(th))} pp  n=${th.length}`);
  console.log(`  t CI      [${p2(ci.lo)}, ${p2(ci.hi)}]  half-width +/-${p2(ci.half)} pp (t=${ci.t.toFixed(6)}) -> ${tB}`);
  console.log(`  boot CI   [${p2(boot[0])}, ${p2(boot[1])}] -> ${bB}`);
  console.log(`  pair-mean throughput MB/s: ${dr.pairMeans.map((x) => x.toFixed(1)).join(', ')}`);
  console.log(`  drift ${(dr.drift * 100).toFixed(2)}%  grand mean ${dr.grand.toFixed(2)} MB/s  flagged=${dr.drift > 0.2}`);

  const a = j.analysis;
  const near = (x, y, tol) => Math.abs(x - y) <= tol;
  th.forEach((v, i) => { if (!near(v, a.theta[i], 1e-12)) flag(`${path.basename(file)}: theta[${i}] mine ${v} vs artifact ${a.theta[i]}`); });
  if (!near(mean(th), a.thetaMean, 1e-12)) flag(`${path.basename(file)}: thetaMean mine ${mean(th)} vs ${a.thetaMean}`);
  if (!near(ci.lo, a.tCI[0], 5e-5)) flag(`${path.basename(file)}: tCI lo mine ${ci.lo} vs ${a.tCI[0]}`);
  if (!near(ci.hi, a.tCI[1], 5e-5)) flag(`${path.basename(file)}: tCI hi mine ${ci.hi} vs ${a.tCI[1]}`);
  if (!near(ci.half, a.halfWidth, 5e-5)) flag(`${path.basename(file)}: halfWidth mine ${ci.half} vs ${a.halfWidth}`);
  if (!near(boot[0], a.bootstrapCI[0], 1e-12)) flag(`${path.basename(file)}: bootstrap lo mine ${boot[0]} vs ${a.bootstrapCI[0]}`);
  if (!near(boot[1], a.bootstrapCI[1], 1e-12)) flag(`${path.basename(file)}: bootstrap hi mine ${boot[1]} vs ${a.bootstrapCI[1]}`);
  if (!near(dr.drift, a.driftFraction, 1e-12)) flag(`${path.basename(file)}: drift mine ${dr.drift} vs ${a.driftFraction}`);
  if (tB !== a.tBranch) flag(`${path.basename(file)}: t branch mine ${tB} vs ${a.tBranch}`);
  if (bB !== a.bootstrapBranch) flag(`${path.basename(file)}: bootstrap branch mine ${bB} vs ${a.bootstrapBranch}`);
  if ((dr.drift > 0.2) !== a.driftFlagged) flag(`${path.basename(file)}: drift flag mine ${dr.drift > 0.2} vs ${a.driftFlagged}`);

  // does the harness's 3-dp t quantile ever move a branch or the +/-10 pp gate?
  const hHarness = (2.262 * sdev(th)) / Math.sqrt(th.length);
  const bHarness = classify([mean(th) - hHarness, mean(th) + hHarness]);
  if (bHarness !== tB || (hHarness > 0.1) !== (ci.half > 0.1)) {
    flag(`${path.basename(file)}: 3-dp t quantile changes an outcome (harness ${bHarness}/${p2(hHarness)} vs exact ${tB}/${p2(ci.half)})`);
  }

  // -- per-candidate descriptives ----------------------------------------------------------------
  for (const cand of ['websocket', 'http-stream']) {
    const rs = runs.filter((r) => r.candidate === cand);
    const mbs = rs.map((r) => r.transportMBs);
    const t1 = rs.map((r) => r.t1TransportMs);
    const s = j.summary.find((x) => x.candidate === cand);
    console.log(
      `  ${cand.padEnd(12)} n=${rs.length} MB/s p50 ${pct(mbs, 50).toFixed(2)} p95 ${pct(mbs, 95).toFixed(2)} ` +
      `[${Math.min(...mbs).toFixed(2)}..${Math.max(...mbs).toFixed(2)}]  t1 p50 ${pct(t1, 50).toFixed(1)} p95 ${pct(t1, 95).toFixed(1)} ms`,
    );
    console.log(`     per-run MB/s: ${mbs.map((x) => x.toFixed(1)).join(', ')}`);
    if (Math.abs(pct(mbs, 50) - s.transportMBs.p50) > 1e-9) flag(`${path.basename(file)}: ${cand} summary MB/s p50 disagrees`);
    if (Math.abs(pct(t1, 50) - s.t1Ms.p50) > 1e-9) flag(`${path.basename(file)}: ${cand} summary t1 p50 disagrees`);
    for (const k of ['decodeMs', 'endToUsableMs', 'firstBatchMs']) {
      const src = { decodeMs: 'decodeOnlyMs', endToUsableMs: 't3DecodedMs', firstBatchMs: 'firstBatchMs' }[k];
      const vals = rs.map((r) => r[src]).filter((v) => typeof v === 'number');
      if (vals.length && s[k]?.p50 !== undefined && Math.abs(pct(vals, 50) - s[k].p50) > 1e-9) {
        flag(`${path.basename(file)}: ${cand} summary ${k}.p50 ${s[k].p50} != recomputed ${pct(vals, 50)}`);
      }
      if (vals.length) console.log(`     ${k}: p50 ${pct(vals, 50).toFixed(2)} p95 ${pct(vals, 95).toFixed(2)} [${Math.min(...vals).toFixed(2)}..${Math.max(...vals).toFixed(2)}]`);
    }
    const heaps = rs.map((r) => r.peakJsHeapBytes).filter((x) => typeof x === 'number');
    if (heaps.length) {
      console.log(`     peak JS heap: p50 ${pct(heaps, 50)} max ${Math.max(...heaps)} B  (summary ${s.peakJsHeapBytes})`);
      if (s.peakJsHeapBytes !== Math.max(...heaps)) flag(`${path.basename(file)}: ${cand} summary peakJsHeapBytes ${s.peakJsHeapBytes} != run max ${Math.max(...heaps)}`);
    }
    console.log(`     summary.producerResidentMax = ${s.producerResidentMax}`);
  }

  // -- declared per-run assertions ---------------------------------------------------------------
  const setOf = (f) => [...new Set(runs.map(f).map((x) => JSON.stringify(x ?? null)))].map((x) => JSON.parse(x));
  const hashing = setOf((r) => r.hashingEnabled);
  const terminals = setOf((r) => r.terminal?.kind);
  const batches = setOf((r) => r.batches);
  const jsonFrames = setOf((r) => r.jsonFramesSeen);
  const digests = setOf((r) => r.structuralDigest);
  console.log(`  hashingEnabled ${JSON.stringify(hashing)} · terminal ${JSON.stringify(terminals)} · batches ${JSON.stringify(batches)} (expect ${n2 ? bc * 2 : bc}) · jsonFrames ${JSON.stringify(jsonFrames)}`);
  console.log(`  structural digest across timed runs: ${JSON.stringify(digests)}`);
  if (hashing.length !== 1 || hashing[0] !== false) flag(`${path.basename(file)}: hashing flag ${JSON.stringify(hashing)} on timed runs`);
  if (terminals.length !== 1 || terminals[0] !== 'Completed') flag(`${path.basename(file)}: terminals ${JSON.stringify(terminals)}`);
  if (batches.length !== 1 || batches[0] !== (n2 ? bc * 2 : bc)) flag(`${path.basename(file)}: batch counts ${JSON.stringify(batches)}`);
  if (jsonFrames.length !== 1 || jsonFrames[0] !== 0) flag(`${path.basename(file)}: JSON frames on data path ${JSON.stringify(jsonFrames)}`);
  if (digests.length !== 1) flag(`${path.basename(file)}: structural digest not constant: ${JSON.stringify(digests)}`);
  const perRunInvalid = runs.flatMap((r) => r.invalid ?? []);
  if (perRunInvalid.length) flag(`${path.basename(file)}: per-run invalid entries ${JSON.stringify([...new Set(perRunInvalid)])}`);
  if (!n2) {
    console.log(`  rows ${JSON.stringify(setOf((r) => r.rows))} · crsTaggedBatches ${JSON.stringify(setOf((r) => r.crsTaggedBatches))}`);
  } else {
    console.log(`  perStreamMBs present on ${runs.filter((r) => r.perStreamMBs).length}/${runs.length} runs · aggregateResidentBytes ${JSON.stringify(setOf((r) => r.aggregateResidentBytes))}`);
  }

  // -- verification transfers --------------------------------------------------------------------
  console.log(`  verification transfers: ${j.verification?.length ?? 0}`);
  for (const v of j.verification ?? []) {
    const ok = v.wireDigest === j.manifest.corpus.wireDigest && v.matchesManifest === true;
    console.log(`    ${v.candidate}: wireDigest ${v.wireDigest} matchesManifest=${v.matchesManifest} structural=${v.structuralDigest} ${ok ? 'OK' : 'MISMATCH'}`);
    if (!ok) flag(`${path.basename(file)}: verification digest mismatch (${v.candidate})`);
    if (digests.length === 1 && v.structuralDigest !== digests[0]) {
      flag(`${path.basename(file)}: verification structural digest ${v.structuralDigest} != timed ${digests[0]} (${v.candidate})`);
    }
    if ((v.invalid ?? []).length) flag(`${path.basename(file)}: verification invalid ${JSON.stringify(v.invalid)}`);
  }
  if ((j.verification?.length ?? 0) !== 2) flag(`${path.basename(file)}: ${j.verification?.length} verification transfers, §19.7 declares 2`);

  // -- copy accounting ---------------------------------------------------------------------------
  for (const cand of ['websocket', 'http-stream']) {
    const rs = runs.filter((r) => r.candidate === cand);
    const re = rs.map((r) => r.reassemblyCopies);
    const co = rs.map((r) => r.contiguousBatches).filter((x) => x != null);
    const sh = rs.map((r) => r.arrowParseSharesBuffer).filter((x) => x != null);
    const nb = n2 ? bc * 2 : bc;
    console.log(
      `  ${cand.padEnd(12)} reassembly/run ${JSON.stringify(re)}  => ${(Math.min(...re) / nb).toFixed(4)}-${(Math.max(...re) / nb).toFixed(4)} per batch`,
    );
    if (co.length) console.log(`     contiguous ${Math.min(...co)}-${Math.max(...co)} of ${nb}; reasm+contig==batches on ${rs.filter((r) => r.contiguousBatches != null && r.contiguousBatches + r.reassemblyCopies === r.batches).length}/${rs.length}`);
    if (sh.length) {
      const tot = rs.filter((r) => r.arrowParseSharesBuffer != null).map((r) => r.reassemblyCopies + (r.batches - r.arrowParseSharesBuffer));
      console.log(`     arrowParseShares ${Math.min(...sh)}-${Math.max(...sh)} of ${nb}; total whole-payload copies/run ${Math.min(...tot)}-${Math.max(...tot)}`);
    }
  }

  // -- producer facts ----------------------------------------------------------------------------
  const gaps = [], resident = [], sampleCounts = [];
  const emitted = new Set(), pdig = new Set(), cdig = new Set(), afterCancel = new Set(), adapters = new Set();
  let missing = 0, factObjs = 0;
  for (const r of runs) {
    const arr = Array.isArray(r.producerFacts) ? r.producerFacts : [r.producerFacts];
    if (arr.every((f) => !f || Object.keys(f).length === 0)) missing++;
    for (const f of arr) {
      if (!f || Object.keys(f).length === 0) continue;
      factObjs++;
      adapters.add(f.adapter);
      if (f.sample_gaps_us) gaps.push(...f.sample_gaps_us);
      if (f.resident_samples) resident.push(...f.resident_samples.map((s) => s[1]));
      if (f.memory_samples) sampleCounts.push(f.memory_samples.length);
      emitted.add(f.bytes_emitted);
      pdig.add(f.payload_sha256);
      cdig.add(f.column_sha256);
      afterCancel.add(f.batches_after_cancel_observed);
    }
  }
  console.log(`  producer facts: ${runs.length - missing}/${runs.length} runs carry them (${factObjs} fact objects); adapters ${JSON.stringify([...adapters])}`);
  if (missing) flag(`${path.basename(file)}: ${missing} runs without producer facts`);
  if (gaps.length) {
    const g = gaps.map((x) => x / 1000);
    console.log(`  memory-sample cadence: n=${g.length} mean ${mean(g).toFixed(2)} p50 ${pct(g, 50).toFixed(2)} p95 ${pct(g, 95).toFixed(2)} max ${Math.max(...g).toFixed(2)} ms (declared 50) · samples/run-stream ${Math.min(...sampleCounts)}-${Math.max(...sampleCounts)}`);
  }
  if (resident.length) {
    const bound = j.manifest.producerResidentBoundBytes;
    console.log(`  producer-resident bytes: min ${Math.min(...resident)} max ${Math.max(...resident)} (per-stream bound ${bound}${n2 ? `; aggregate bound ${2 * bound}` : ''}; batch wire ${j.manifest.corpus.maxBatchWireBytes}; ratio ${(Math.max(...resident) / j.manifest.corpus.maxBatchWireBytes).toFixed(2)}x)`);
    if (Math.max(...resident) > bound) flag(`${path.basename(file)}: producer-resident ${Math.max(...resident)} > bound ${bound}`);
  }
  console.log(`  bytes_emitted ${JSON.stringify([...emitted])} · payload_sha256 == manifest wireDigest: ${[...pdig].every((d) => d === j.manifest.corpus.wireDigest)} · column_sha256 == manifest columnDigest: ${[...cdig].every((d) => d === j.manifest.corpus.columnDigest)} · batches_after_cancel_observed ${JSON.stringify([...afterCancel])}`);
  if (![...pdig].every((d) => d === j.manifest.corpus.wireDigest)) flag(`${path.basename(file)}: producer payload digest != manifest wire digest`);

  // -- environment -------------------------------------------------------------------------------
  const e = j.environment;
  console.log(`  env: debugAssertions=${e.debugAssertions} smokeMode=${e.smokeMode} hiddenAtEnd=${e.documentHiddenAtEnd} becameHidden=${e.becameHiddenDuringRun} rafThrottle=${e.rafThrottleEvents}`);
  console.log(`  env: tcpNoDelay ${JSON.stringify(e.tcpNoDelay)} (manifest ${JSON.stringify(j.manifest.tcpNoDelay)})`);
  console.log(`  env: clockOffset ${e.clockOffsetMs} +/-${e.clockBoundMs} ms · GPU ${e.gpu} · cores ${e.hardwareConcurrency}`);
  if (e.debugAssertions !== false) flag(`${path.basename(file)}: debugAssertions ${e.debugAssertions}`);
  if (!e.tcpNoDelay || e.tcpNoDelay.requested !== true || e.tcpNoDelay.connectionsFailed !== 0) flag(`${path.basename(file)}: TCP_NODELAY state absent/failed`);
  if (e.smokeMode !== false) flag(`${path.basename(file)}: smokeMode true`);
  if (e.documentHiddenAtEnd !== false || e.becameHiddenDuringRun !== false) flag(`${path.basename(file)}: document hidden during block`);
  console.log(`  declared ceilings: ${JSON.stringify(j.declaredAssertions.ceilings)}`);

  // -- reconstructed validity verdict -------------------------------------------------------------
  const mine = [];
  if (isFinite(ci.half) && ci.half > 0.1) mine.push(`realized CI half-width +/-${p2(ci.half)} pp exceeds the declared +/-10 pp`);
  if (tB !== bB) mine.push(`t and bootstrap intervals select different branches (${tB} vs ${bB})`);
  if (th.length !== 10) mine.push(`${th.length} usable pairs, expected 10`);
  if (ab !== ba) mine.push('AB/BA imbalance');
  mine.push(...perRunInvalid);
  console.log(`  MY VERDICT: valid=${mine.length === 0} ${JSON.stringify(mine)}`);
  if ((mine.length === 0) !== j.valid) flag(`${path.basename(file)}: validity disagreement — mine ${mine.length === 0} vs artifact ${j.valid}`);
  console.log(`  MY BRANCH (§19.9 on the t interval, bootstrap concurring): ${tB === bB ? tB : 'inconclusive (intervals disagree)'}`);
}

console.log(`\n${problems.length ? `${problems.length} FINDING(S)/DISAGREEMENT(S)` : 'no disagreements with the artifacts'}`);
