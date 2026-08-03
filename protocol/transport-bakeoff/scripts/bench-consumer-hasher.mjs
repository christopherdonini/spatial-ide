#!/usr/bin/env node
/**
 * Diagnostic: how fast is the consumer's streaming SHA-256, and can it account for the flat
 * ~33 MB/s "transport throughput" Phase 2 measured at every batch size?
 *
 * Why this exists: §16.4 defines t1 as "last payload byte received at transport level". The
 * consumer feeds every payload byte to `Sha256Stream` synchronously inside the frame decoder, i.e.
 * BEFORE the batch frame is yielded — so whatever the hasher costs is inside t1, and the reported
 * t2 - t1 segment only contains the final padding block. If the hasher's own ceiling is near the
 * measured transport figure, then t1 is hasher-bound and the MB/s number is a floor, not a
 * transport capability. That is the same class of instrument failure §16.0 records for Phase 1's
 * generator, so it has to be measured rather than argued.
 *
 * Method: the harness's own `web/src/sha256.ts`, unmodified, over the exact Phase 2 payload size
 * (243,835,200 B) at each configuration's chunk size. Node's V8, not WebView2's — same engine
 * family and JIT, different embedder, so this is INDICATIVE of the in-browser cost, not identical
 * to it. Stated that way in the results.
 *
 * Correctness is checked against node:crypto first: a fast wrong hasher would prove nothing.
 *
 * Usage: node --experimental-strip-types --no-warnings scripts/bench-consumer-hasher.mjs
 */

import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const { Sha256Stream } = await import(
  pathToFileURL(join(here, '..', 'web', 'src', 'sha256.ts')).href
);

// Correctness gate.
const probe = new Uint8Array(100_003);
for (let i = 0; i < probe.length; i++) probe[i] = (i * 31 + 7) & 0xff;
const s = new Sha256Stream();
for (let off = 0; off < probe.length; off += 7919) s.update(probe.subarray(off, off + 7919));
const mine = s.digest();
const ref = createHash('sha256').update(probe).digest('hex');
if (mine !== ref) {
  console.error(`hasher is INCORRECT: ${mine} != ${ref}`);
  process.exit(1);
}
console.log(`correctness: Sha256Stream == node:crypto  (${mine.slice(0, 16)}…)`);

const TOTAL = 243_835_200; // Phase 2 configuration M wire bytes; S and L are within 0.4 %
const CONFIGS = [
  ['S', 244_560],
  ['M', 2_438_352],
  ['L', 12_188_304],
];
const REPEATS = 5;

console.log(`\npayload ${TOTAL} B, ${REPEATS} repeats per configuration\n`);
console.log('config  chunk B      ms p50     ms min     MB/s p50   MB/s max');
for (const [label, chunk] of CONFIGS) {
  const block = new Uint8Array(chunk);
  for (let i = 0; i < block.length; i++) block[i] = (i * 17 + 3) & 0xff;
  const n = Math.floor(TOTAL / chunk);
  const ms = [];
  for (let r = 0; r < REPEATS; r++) {
    const h = new Sha256Stream();
    const t0 = performance.now();
    for (let i = 0; i < n; i++) h.update(block);
    h.digest();
    ms.push(performance.now() - t0);
  }
  ms.sort((a, b) => a - b);
  const p50 = ms[Math.floor(0.5 * ms.length)];
  const bytes = n * chunk;
  console.log(
    `${label.padEnd(7)}${String(chunk).padEnd(13)}${p50.toFixed(1).padEnd(11)}` +
      `${ms[0].toFixed(1).padEnd(11)}${(bytes / 1e6 / (p50 / 1000)).toFixed(2).padEnd(11)}` +
      `${(bytes / 1e6 / (ms[0] / 1000)).toFixed(2)}`,
  );
}
