// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * Summarize a bake-off report into the evidence table ADR-012 needs.
 *
 * Usage: node scripts/summarize-report.mjs <report.json>
 *
 * Prints the validity verdict FIRST and unconditionally. A report that trips its validity gate is
 * not a slower result, it is not a result — README §8 — and this tool must never let an invalid run
 * be read as a measurement.
 */
import { readFileSync } from 'node:fs';

const path = process.argv[2];
if (!path) {
  console.error('usage: node scripts/summarize-report.mjs <report.json>');
  process.exit(2);
}
const r = JSON.parse(readFileSync(path, 'utf8'));

const pct = (xs, p) => {
  if (!xs.length) return NaN;
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.floor((p / 100) * s.length))];
};
const f = (x, d = 1) => (Number.isFinite(x) ? x.toFixed(d) : 'n/a');

console.log(`\n=== ${path} ===`);
console.log(`schema:      ${r.schema}`);
console.log(`timestamp:   ${r.timestamp}`);
console.log(`VALID:       ${r.valid}`);
if (!r.valid) {
  console.log('\n!!! THIS RUN IS INVALID — the figures below are NOT admissible as measurements !!!');
  for (const why of r.invalidReasons) console.log(`  - ${why}`);
}
console.log(`\nenvironment:`);
console.log(`  gpu:        ${r.environment.gpu}`);
console.log(`  ua:         ${r.environment.userAgent}`);
console.log(`  hidden@end: ${r.environment.documentHiddenAtEnd}   rafThrottled: ${r.environment.rafThrottleEvents}   smoke: ${r.environment.smokeMode}`);
console.log(`  clock:      offset ${f(r.clock.offsetMs, 3)} ms, bound +/-${f(r.clock.boundMs, 3)} ms`);
console.log(`  security:   noToken=${r.security.noToken} wrongToken=${r.security.wrongToken} valid=${r.security.validToken}`);

for (const candidate of ['websocket', 'http-stream']) {
  const runs = r.runs.filter((x) => x.candidate === candidate);
  if (!runs.length) continue;
  console.log(`\n--- ${candidate} (${runs.length} run(s)) ---`);
  const perBatch = runs.flatMap((x) => x.perBatchMBs);
  console.log(`  first batch            ${runs.map((x) => f(x.firstBatchMs)).join(' / ')} ms`);
  console.log(`  first pixels           ${runs.map((x) => f(x.firstPixelsMs)).join(' / ')} ms`);
  console.log(`  full-payload render    ${runs.map((x) => f(x.fullRenderMs, 0)).join(' / ')} ms`);
  console.log(`  throughput whole       ${runs.map((x) => f(x.wholeTransferMBs)).join(' / ')} MB/s`);
  console.log(`  throughput per-batch   p50 ${f(pct(perBatch, 50))} / p95 ${f(pct(perBatch, 95))} MB/s  (n=${perBatch.length})`);
  console.log(`  rows                   ${runs.map((x) => x.rows).join(' / ')}`);
  console.log(`  payload digest         ${[...new Set(runs.map((x) => x.payloadSha256.slice(0, 16)))].join(' / ')}`);
  console.log(`  CRS-tagged batches     ${runs.map((x) => x.crsTaggedBatches).join(' / ')} / 100`);
  console.log(`  JSON frames on data    ${runs.map((x) => x.jsonFramesSeen).join(' / ')}`);
  console.log(`  arrow parse 0-copy     ${runs.map((x) => x.arrowParseSharesBuffer).join(' / ')} / 100 batches share the wire buffer`);
  console.log(`  contiguous batches     ${runs.map((x) => x.contiguousBatches).join(' / ')} / 100  (reassembly copies ${runs.map((x) => x.reassemblyCopies).join(' / ')})`);
  console.log(`  terminal               ${runs.map((x) => x.terminal?.kind ?? 'none').join(' / ')}`);

  const pf = runs.map((x) => x.producerFacts).filter(Boolean);
  if (pf.length) {
    const peak = pf.map((p) => (p.peak_memory?.private_usage_bytes / 1e6) | 0);
    const gen = pf.flatMap((p) => p.generation_cost_us ?? []);
    console.log(`  peak producer private  ${peak.join(' / ')} MB`);
    console.log(`  per-batch gen cost     p50 ${f(pct(gen, 50) / 1000, 2)} ms  (lower bound on cancel detection)`);
  }

  const cs = (r.cancellation?.[candidate] ?? []).filter((c) => c.ackMs != null);
  const acks = cs.map((c) => c.ackMs);
  console.log(`  PRODUCER cancel ack    p50 ${f(pct(acks, 50), 2)} / p95 ${f(pct(acks, 95), 2)} / max ${f(Math.max(...acks), 2)} ms  (n=${acks.length}/${(r.cancellation?.[candidate] ?? []).length})`);
  console.log(`    gate <100ms:         ${acks.length && Math.max(...acks) < 100 ? 'PASS' : 'FAIL'}`);
  console.log(`    batches after cancel ${[...new Set(cs.map((c) => c.batchesAfter))].join(',')}  (H2 allows <=1)`);

  const bp = r.backpressure?.[candidate];
  if (bp?.facts) {
    const bound = bp.facts.declared_resident_bound_bytes;
    const during = (bp.facts.resident_samples ?? []).map(([, b]) => b);
    const maxResident = during.length ? Math.max(...during) : NaN;
    console.log(`  backpressure           pauseApplied=${bp.pauseApplied}  max resident ${f(maxResident / 1e6, 2)} MB vs declared bound ${f(bound / 1e6, 2)} MB`);
    console.log(`    bounded:             ${maxResident <= bound ? 'PASS' : 'FAIL'}`);
  }

  for (const e of r.errorBehaviour?.[candidate] ?? []) {
    console.log(`  cancel during ${e.phase.padEnd(10)} terminal=${e.terminalKind} producerObserved=${e.producerObservedCancel} viewSignalledIncomplete=${e.viewSignalledIncomplete} dangling=${e.danglingProducerCheckpoint ?? 'none'}`);
  }
}
console.log('');
