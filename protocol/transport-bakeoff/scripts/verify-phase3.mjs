#!/usr/bin/env node
/**
 * Independent verification of every Phase-3 artifact (README §19).
 *
 * Deliberately does NOT import anything from `web/src/phase3.ts`. Every statistic is recomputed here
 * from the raw per-run `transportMBs` values so that a defect in the harness's own analysis code
 * cannot be reproduced by re-running that same code. Where this script and the artifact's own
 * `analysis` block disagree, the disagreement is printed.
 *
 *   node scripts/verify-phase3.mjs results/phase3/*.json
 */
import fs from 'node:fs';
import path from 'node:path';

// ---------------------------------------------------------------------------------------------
// Statistics, implemented from §19.3's text rather than from the harness.
// ---------------------------------------------------------------------------------------------

/** Two-sided 97.5th percentile of Student-t. Independent table (R: qt(0.975, df)). */
const T975 = {
  3: 3.182446, 4: 2.776445, 5: 2.570582, 6: 2.446912, 7: 2.364624, 8: 2.306004,
  9: 2.262157, 10: 2.228139, 11: 2.200985, 12: 2.178813, 15: 2.131450, 19: 2.093024,
};

const mean = (xs) => xs.reduce((a, x) => a + x, 0) / xs.length;
const sd = (xs) => {
  const m = mean(xs);
  return Math.sqrt(xs.reduce((a, x) => a + (x - m) ** 2, 0) / (xs.length - 1));
};

/** §19.3: theta_i = 2 (thr_B - thr_A) / (thr_A + thr_B), per adjacent pair. */
function theta(runs) {
  const out = [];
  for (let i = 0; i + 1 < runs.length; i += 2) {
    const p = [runs[i], runs[i + 1]];
    const A = p.find((r) => r.candidate === 'websocket');
    const B = p.find((r) => r.candidate === 'http-stream');
    if (!A || !B) { out.push(NaN); continue; }
    out.push((2 * (B.transportMBs - A.transportMBs)) / (A.transportMBs + B.transportMBs));
  }
  return out;
}

function tCI(xs) {
  const n = xs.length;
  const t = T975[n - 1];
  if (t === undefined) throw new Error(`no t quantile for df=${n - 1}`);
  const h = (t * sd(xs)) / Math.sqrt(n);
  return [mean(xs) - h, mean(xs) + h, h];
}

/** splitmix64, written from the reference algorithm. */
function splitmix64(seed) {
  let s = BigInt.asUintN(64, seed);
  const M = 0xffffffffffffffffn;
  return () => {
    s = (s + 0x9e3779b97f4a7c15n) & M;
    let z = s;
    z = ((z ^ (z >> 30n)) * 0xbf58476d1ce4e5b9n) & M;
    z = ((z ^ (z >> 27n)) * 0x94d049bb133111ebn) & M;
    z = z ^ (z >> 31n);
    return Number(z >> 11n) / 2 ** 53;
  };
}

function bootstrapCI(xs, resamples = 10_000, seed = 0x5eed305100000001n) {
  const rnd = splitmix64(seed);
  const ms = [];
  for (let i = 0; i < resamples; i++) {
    let acc = 0;
    for (let j = 0; j < xs.length; j++) acc += xs[Math.floor(rnd() * xs.length)];
    ms.push(acc / xs.length);
  }
  ms.sort((a, b) => a - b);
  return [ms[Math.floor(0.025 * resamples)], ms[Math.floor(0.975 * resamples)]];
}

/** §19.3: (max pair-mean - min pair-mean) / grand mean of pair-means. */
function drift(runs) {
  const pm = [];
  for (let i = 0; i + 1 < runs.length; i += 2) {
    pm.push((runs[i].transportMBs + runs[i + 1].transportMBs) / 2);
  }
  const g = mean(pm);
  return (Math.max(...pm) - Math.min(...pm)) / g;
}

/** §19.9 rules 2-5 on one interval. */
function classify([lo, hi], band = 0.1) {
  if (!isFinite(lo) || !isFinite(hi)) return 'inconclusive';
  if (lo > band) return 'B-wins';
  if (hi < -band) return 'A-wins';
  if (lo >= -band && hi <= band) return 'equivalent';
  return 'inconclusive';
}

const pct = (xs, p) => {
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.floor((p / 100) * s.length))];
};

const f2 = (x) => (x * 100).toFixed(2);
const bad = [];
const flag = (m) => { bad.push(m); console.log(`   !! ${m}`); };

// ---------------------------------------------------------------------------------------------

for (const file of process.argv.slice(2)) {
  const j = JSON.parse(fs.readFileSync(file, 'utf8'));
  const runs = j.runs;
  const n2 = String(j.configuration).startsWith('N2');
  console.log(`\n=== ${path.basename(file)}  config=${j.configuration}  valid=${j.valid}`);
  console.log(`    invalidReasons: ${JSON.stringify(j.invalidReasons)}`);

  // ---- schedule / pairing ------------------------------------------------------------------
  const sched = runs.map((r) => (r.candidate === 'websocket' ? 'A' : 'B')).join('');
  const declared = j.schedule.map((s) => (s === 'websocket' ? 'A' : 'B')).join('');
  console.log(`    realized schedule: ${sched}  (declared ${declared}) ${sched === declared ? 'MATCH' : 'MISMATCH'}`);
  if (sched !== declared) flag('realized run order differs from the declared schedule');
  let ab = 0, ba = 0;
  for (let i = 0; i + 1 < runs.length; i += 2) {
    const a = runs[i].candidate, b = runs[i + 1].candidate;
    if (a === b) flag(`pair ${i / 2} has two ${a} runs`);
    else if (a === 'websocket') ab++; else ba++;
  }
  console.log(`    pairs: ${runs.length / 2}   AB=${ab}  BA=${ba}`);
  if (ab !== ba) flag(`AB/BA imbalance ${ab}/${ba}`);
  if (runs.length !== 20) flag(`${runs.length} runs, declared 20`);
  // positions must be 0..n-1 in order, pair = floor(i/2)
  runs.forEach((r, i) => {
    if (r.position !== i) flag(`run ${i} position field ${r.position}`);
    if (r.pair !== Math.floor(i / 2)) flag(`run ${i} pair field ${r.pair}`);
  });

  // ---- theta / intervals -------------------------------------------------------------------
  const th = theta(runs);
  const [lo, hi, hw] = tCI(th);
  const boot = bootstrapCI(th);
  const dr = drift(runs);
  console.log(`    theta (mine)  mean ${f2(mean(th))}%  SD ${f2(sd(th))} pp  n=${th.length}`);
  console.log(`      t CI      [${f2(lo)}, ${f2(hi)}]  half-width +/-${f2(hw)} pp  -> ${classify([lo, hi])}`);
  console.log(`      boot CI   [${f2(boot[0])}, ${f2(boot[1])}]              -> ${classify(boot)}`);
  console.log(`      drift ${(dr * 100).toFixed(2)}%  flagged=${dr > 0.2}`);

  const a = j.analysis;
  const near = (x, y, tol = 5e-9) => Math.abs(x - y) <= tol * Math.max(1, Math.abs(y));
  const cmp = (name, mineVal, theirs, tol) => {
    if (!near(mineVal, theirs, tol)) flag(`${name}: mine ${mineVal} vs artifact ${theirs}`);
  };
  th.forEach((v, i) => cmp(`theta[${i}]`, v, a.theta[i]));
  cmp('thetaMean', mean(th), a.thetaMean);
  cmp('tCI lo', lo, a.tCI[0], 1e-3);   // their t table is 3-dp, mine is 6-dp
  cmp('tCI hi', hi, a.tCI[1], 1e-3);
  cmp('halfWidth', hw, a.halfWidth, 1e-3);
  cmp('bootstrap lo', boot[0], a.bootstrapCI[0]);
  cmp('bootstrap hi', boot[1], a.bootstrapCI[1]);
  cmp('drift', dr, a.driftFraction);
  if (classify([lo, hi]) !== a.tBranch) flag(`t branch: mine ${classify([lo, hi])} vs ${a.tBranch}`);
  if (classify(boot) !== a.bootstrapBranch) flag(`boot branch: mine ${classify(boot)} vs ${a.bootstrapBranch}`);
  if ((dr > 0.2) !== a.driftFlagged) flag(`drift flag: mine ${dr > 0.2} vs ${a.driftFlagged}`);
  // exact t-quantile sensitivity: does the 3-dp table ever change a branch?
  const tExact = T975[th.length - 1], tHarness = { 9: 2.262 }[th.length - 1];
  if (tHarness) {
    const hExact = (tExact * sd(th)) / Math.sqrt(th.length);
    const hHarn = (tHarness * sd(th)) / Math.sqrt(th.length);
    console.log(`      t-quantile sensitivity: half-width ${f2(hExact)} (6dp) vs ${f2(hHarn)} (harness 3dp) pp`);
  }

  // ---- per-candidate throughput ------------------------------------------------------------
  for (const cand of ['websocket', 'http-stream']) {
    const rs = runs.filter((r) => r.candidate === cand);
    const mbs = rs.map((r) => r.transportMBs);
    const t1 = rs.map((r) => r.t1TransportMs);
    const s = j.summary.find((x) => x.candidate === cand);
    console.log(
      `    ${cand.padEnd(12)} MB/s p50 ${pct(mbs, 50).toFixed(2)} p95 ${pct(mbs, 95).toFixed(2)} ` +
      `min ${Math.min(...mbs).toFixed(2)} max ${Math.max(...mbs).toFixed(2)} | ` +
      `t1 p50 ${pct(t1, 50).toFixed(1)} p95 ${pct(t1, 95).toFixed(1)} ms`,
    );
    cmp(`${cand} summary MB/s p50`, pct(mbs, 50), s.transportMBs.p50, 1e-9);
    cmp(`${cand} summary t1 p50`, pct(t1, 50), s.t1Ms.p50, 1e-9);
    // throughput must equal bytes / t1
    const bytes = (j.manifest.corpus.totalWireBytes) * (n2 ? 2 : 1);
    for (const r of rs) {
      const expect = bytes / 1e6 / (r.t1TransportMs / 1000);
      if (!near(r.transportMBs, expect, 1e-9)) {
        flag(`${cand} run pos${r.position}: transportMBs ${r.transportMBs} != bytes/t1 ${expect}`);
      }
    }
  }

  // ---- declared per-run assertions ---------------------------------------------------------
  const bc = j.manifest.corpus.batchCount;
  const expectBatches = n2 ? bc * 2 : bc;
  const facts = runs.map((r) => r.producerFacts);
  const hash = new Set(runs.map((r) => r.hashingEnabled));
  const terms = new Set(runs.map((r) => r.terminal?.kind));
  const batchSet = new Set(runs.map((r) => r.batches));
  const jsonSet = new Set(runs.map((r) => r.jsonFramesSeen));
  console.log(`    hashingEnabled set: ${[...hash]}   terminal set: ${[...terms]}`);
  console.log(`    batches set: ${[...batchSet]} (expect ${expectBatches})   jsonFrames set: ${[...jsonSet]}`);
  if (hash.size !== 1 || hash.has(true)) flag('hashing flag missing or true on a timed run');
  if (terms.size !== 1 || !terms.has('Completed')) flag(`terminal outcomes: ${[...terms]}`);
  if (batchSet.size !== 1 || !batchSet.has(expectBatches)) flag(`batch counts ${[...batchSet]}`);
  if (jsonSet.size !== 1 || !jsonSet.has(0)) flag(`JSON frames on the data path: ${[...jsonSet]}`);
  const missingFacts = facts.filter((f) => !f || Object.keys(f).length === 0).length;
  console.log(`    producer facts present on ${facts.length - missingFacts}/${runs.length} runs`);
  if (missingFacts) flag(`${missingFacts} runs without producer facts`);
  const runInvalid = runs.flatMap((r) => r.invalid ?? []);
  if (runInvalid.length) flag(`per-run invalid entries: ${JSON.stringify([...new Set(runInvalid)])}`);

  if (!n2) {
    const rowSet = new Set(runs.map((r) => r.rows));
    const crsSet = new Set(runs.map((r) => r.crsTaggedBatches));
    console.log(`    rows set: ${[...rowSet]}   crsTaggedBatches set: ${[...crsSet]}`);
    if (crsSet.size !== 1 || !crsSet.has(bc)) flag(`CRS tag not on every batch: ${[...crsSet]}`);
  }

  // structural digest identity
  const sdig = {};
  for (const r of runs) (sdig[r.candidate] ??= new Set()).add(r.structuralDigest);
  console.log(`    structural digests: A ${[...(sdig.websocket ?? [])]} | B ${[...(sdig['http-stream'] ?? [])]}`);
  const allDig = new Set(runs.map((r) => r.structuralDigest));
  if (allDig.size !== 1) flag(`structural digest differs across runs: ${[...allDig]}`);

  // verification transfers
  console.log(`    verification transfers: ${j.verification.length}`);
  for (const v of j.verification) {
    const ok = v.wireDigest === j.manifest.corpus.wireDigest && v.matchesManifest === true;
    console.log(`      ${v.candidate}: digest ${v.wireDigest} matches=${v.matchesManifest} struct=${v.structuralDigest} ${ok ? '' : '<-- MISMATCH'}`);
    if (!ok) flag(`verification digest mismatch for ${v.candidate}`);
    if (v.structuralDigest !== [...allDig][0]) {
      flag(`verification structural digest ${v.structuralDigest} != timed-run digest ${[...allDig][0]} (${v.candidate})`);
    }
  }
  if (j.verification.length !== 2) flag(`${j.verification.length} verification transfers, §19.7 declares 2 per configuration`);

  // ---- copies --------------------------------------------------------------------------------
  for (const cand of ['websocket', 'http-stream']) {
    const rs = runs.filter((r) => r.candidate === cand);
    const re = rs.map((r) => r.reassemblyCopies);
    const co = rs.map((r) => r.contiguousBatches);
    const sh = rs.map((r) => r.arrowParseSharesBuffer);
    const per = re.map((x) => x / bc);
    console.log(
      `    ${cand.padEnd(12)} reassembly ${Math.min(...re)}-${Math.max(...re)} (${Math.min(...per).toFixed(3)}-${Math.max(...per).toFixed(3)} /batch)` +
      ` | contiguous ${co.every((x) => x === undefined) ? 'n/a' : `${Math.min(...co)}-${Math.max(...co)}`}` +
      ` | arrowShares ${sh[0] == null ? 'n/a (no mode F)' : `${Math.min(...sh)}-${Math.max(...sh)}`}`,
    );
    if (sh[0] != null) {
      const copies = rs.map((r) => r.reassemblyCopies + (r.batches - r.arrowParseSharesBuffer));
      console.log(`      -> total whole-payload copies/run: ${Math.min(...copies)}-${Math.max(...copies)} over ${bc} batches`);
    }
    // reassembly + contiguous should equal batches when contiguity is recorded
    for (const r of rs) {
      if (r.contiguousBatches != null && r.contiguousBatches + r.reassemblyCopies !== r.batches) {
        console.log(`      note pos${r.position}: contiguous ${r.contiguousBatches} + reasm ${r.reassemblyCopies} != batches ${r.batches}`);
      }
    }
  }

  // ---- producer facts detail ------------------------------------------------------------------
  const gaps = [];
  const resident = [];
  const bytesEmitted = new Set();
  const genAfterCancel = new Set();
  const pdig = new Set();
  const cdig = new Set();
  let sampleCounts = [];
  for (const r of runs) {
    const fArr = Array.isArray(r.producerFacts) ? r.producerFacts : [r.producerFacts];
    for (const f of fArr) {
      if (!f) continue;
      if (f.sample_gaps_us) gaps.push(...f.sample_gaps_us);
      if (f.resident_samples) resident.push(...f.resident_samples.map((s) => s[1]));
      if (f.memory_samples) sampleCounts.push(f.memory_samples.length);
      bytesEmitted.add(f.bytes_emitted);
      genAfterCancel.add(f.batches_after_cancel_observed);
      pdig.add(f.payload_sha256);
      cdig.add(f.column_sha256);
    }
  }
  if (gaps.length) {
    const g = gaps.map((x) => x / 1000);
    console.log(
      `    memory-sample cadence: n=${g.length} mean ${mean(g).toFixed(2)} p50 ${pct(g, 50).toFixed(2)} ` +
      `p95 ${pct(g, 95).toFixed(2)} max ${Math.max(...g).toFixed(2)} ms (declared 50)`,
    );
    console.log(`    samples/run: ${Math.min(...sampleCounts)}-${Math.max(...sampleCounts)}`);
  }
  if (resident.length) {
    const bound = j.manifest.producerResidentBoundBytes;
    console.log(
      `    producer-resident bytes: min ${Math.min(...resident)} max ${Math.max(...resident)} ` +
      `(declared bound ${bound}${n2 ? `, aggregate ${2 * bound}` : ''}; batch wire ${j.manifest.corpus.maxBatchWireBytes})`,
    );
    const maxR = Math.max(...resident);
    if (maxR > bound) flag(`producer-resident ${maxR} exceeds per-stream bound ${bound}`);
  }
  console.log(`    producer bytes_emitted: ${[...bytesEmitted]}`);
  console.log(`    producer payload_sha256: ${[...pdig]}`);
  console.log(`    producer column_sha256 == manifest columnDigest: ${[...cdig].every((d) => d === j.manifest.corpus.columnDigest)}`);
  if (![...pdig].every((d) => d === j.manifest.corpus.wireDigest)) flag('producer payload digest != manifest wire digest');
  if (![...genAfterCancel].every((x) => x === 0)) flag(`batches_after_cancel_observed: ${[...genAfterCancel]}`);

  // ---- env assertions -------------------------------------------------------------------------
  const e = j.environment;
  console.log(
    `    env: debugAssertions=${e.debugAssertions} tcpNoDelay=${JSON.stringify(e.tcpNoDelay)} ` +
    `clockOffset ${e.clockOffsetMs?.toFixed?.(3)} +/-${e.clockBoundMs?.toFixed?.(3)} ms hidden=${e.documentHiddenAtEnd} smoke=${e.smokeMode}`,
  );
  if (e.debugAssertions !== false) flag('debugAssertions not false');
  if (!e.tcpNoDelay || e.tcpNoDelay.requested !== true || e.tcpNoDelay.connectionsFailed !== 0) {
    flag('TCP_NODELAY state absent or failed');
  }
  if (e.smokeMode !== false) flag('smokeMode true');
  if (e.documentHiddenAtEnd !== false || e.becameHiddenDuringRun !== false) flag('document hidden during the block');

  // ---- reconstruct the artifact's own validity verdict -----------------------------------------
  const mine = [];
  if (isFinite(hw) && hw > 0.1) mine.push(`realized CI half-width +/-${f2(hw)} pp exceeds the declared +/-10 pp`);
  if (classify([lo, hi]) !== classify(boot)) mine.push('t and bootstrap intervals select different branches');
  mine.push(...runInvalid);
  console.log(`    my validity verdict: valid=${mine.length === 0}  ${JSON.stringify(mine)}`);
  if ((mine.length === 0) !== j.valid) flag(`validity disagreement: mine ${mine.length === 0} vs artifact ${j.valid}`);
}

console.log(`\n${bad.length ? `${bad.length} DISAGREEMENT(S)/FINDING(S)` : 'no disagreements'}`);
