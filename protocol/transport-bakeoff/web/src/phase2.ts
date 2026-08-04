/**
 * Phase 2 — transfer-isolated measurement (README §16).
 *
 * Phase 1 measured a generator. Here the corpus is pre-built server-side before any connection is
 * accepted, so the timed interval contains transport work and nothing else.
 *
 * **Two modes per run, which is how §16.4's "raw transport receipt plus checksum, separately from
 * end-to-usable-data" is actually obtainable.** Decoding inside the receive loop would delay
 * subsequent receipt and make t1 meaningless; retaining every batch to decode afterwards would hold
 * 240 MB and change the memory result. So each run transfers twice:
 *
 * - **Mode R** — receive and hash chunk-wise. Yields t1 (last payload byte at transport level) and
 *   t2 (checksum complete). No Arrow decode.
 * - **Mode F** — receive, hash, and decode. Yields t3 (Arrow-decoded and usable).
 *
 * Both candidates run both modes, so the split is symmetric.
 */

import { tableFromIPC } from 'apache-arrow';
import { makeTransport, type Candidate } from './make-transport.js';
import { Sha256Stream } from './sha256.js';
import type { Terminal } from './transport.js';

export type { Candidate };

/**
 * Counterbalanced schedule, §16.5: `ABBA BAAB ABBA` — 12 runs, 6 per candidate, balanced by
 * position so an order effect cannot be mistaken for a candidate effect. Declared before measuring;
 * the whole block completes before any comparison is computed, and an invalid run invalidates the
 * **block**, never the single run.
 */
export const SCHEDULE: Candidate[] = [
  'websocket', 'http-stream', 'http-stream', 'websocket',
  'http-stream', 'websocket', 'websocket', 'http-stream',
  'websocket', 'http-stream', 'http-stream', 'websocket',
];

export interface Manifest {
  phase: number;
  corpus: {
    config: string;
    rowsPerBatch: number;
    batchCount: number;
    totalWireBytes: number;
    maxBatchWireBytes: number;
    wireDigest: string;
    columnDigest: string;
    buildMs: number;
    maxFrameBytesCeiling: number;
  } | null;
  maxInflightBatches?: number;
  creditWindowBytes?: number;
  /** §18 P8: (4+1) x batch. Phase 2 shipped this value under `creditWindowBytes`. */
  producerResidentBoundBytes?: number;
  tcpNoDelay?: { requested: boolean; connectionsVerified: number; connectionsFailed: number };
}

export interface RunResult {
  candidate: Candidate;
  position: number;
  /** Mode R */
  firstBatchMs: number;
  t1TransportMs: number;
  t2ChecksumMs: number;
  transportMBs: number;
  wireDigest: string;
  wireDigestMatchesManifest: boolean;
  /** Mode F */
  t3DecodedMs: number;
  decodeOnlyMs: number;
  rows: number;
  crsTaggedBatches: number;
  arrowParseSharesBuffer: number;
  /** Shared */
  batches: number;
  contiguousBatches: number;
  reassemblyCopies: number;
  jsonFramesSeen: number;
  terminal: Terminal | null;
  peakJsHeapBytes: number;
  invalid: string[];
}

const nowMs = () => performance.now();

/** Mode R — receive and hash chunk-wise. No decode. */
async function modeR(
  candidate: Candidate,
  base: string,
  token: string,
  m: Manifest,
): Promise<Partial<RunResult>> {
  const t = makeTransport(candidate, base, token);
  const hasher = new Sha256Stream();
  const invalid: string[] = [];
  let batches = 0;
  let contiguous = 0;
  let firstBatchMs = 0;
  let t1 = 0;
  let terminal: Terminal | null = null;
  const start = nowMs();

  // Fed slice-by-slice before any assembly, so hashing cannot become the place Candidate B's
  // reassembly copy hides.
  t.batchByteSink = (s) => hasher.update(s);

  for await (const f of t.frames()) {
    if (f.t === 'batch') {
      batches++;
      if (f.contiguous) contiguous++;
      if (firstBatchMs === 0) firstBatchMs = nowMs() - start;
      t1 = nowMs() - start;
    } else if (f.t === 'terminal') {
      terminal = f.terminal;
    }
  }
  const wireDigest = hasher.digest();
  const t2 = nowMs() - start;

  const expected = m.corpus?.batchCount ?? 0;
  if (batches !== expected) invalid.push(`${candidate}: ${batches} batches, expected ${expected}`);
  if (terminal?.kind !== 'Completed') {
    invalid.push(`${candidate}: terminal ${terminal?.kind ?? 'missing'}`);
  }
  const matches = wireDigest === m.corpus?.wireDigest;
  if (!matches) invalid.push(`${candidate}: wire digest != manifest`);

  const bytes = m.corpus?.totalWireBytes ?? 0;
  return {
    firstBatchMs,
    t1TransportMs: t1,
    t2ChecksumMs: t2,
    transportMBs: bytes / 1e6 / (t1 / 1000),
    wireDigest,
    wireDigestMatchesManifest: matches,
    batches,
    contiguousBatches: contiguous,
    reassemblyCopies: t.stats.reassemblyCopies,
    jsonFramesSeen: t.stats.jsonFramesSeen,
    terminal,
    invalid,
  };
}

/** Mode F — receive, hash, and decode. Yields end-to-usable-data. */
async function modeF(
  candidate: Candidate,
  base: string,
  token: string,
  m: Manifest,
): Promise<Partial<RunResult>> {
  const t = makeTransport(candidate, base, token);
  const hasher = new Sha256Stream();
  t.batchByteSink = (s) => hasher.update(s);
  const invalid: string[] = [];
  let rows = 0;
  let crsTagged = 0;
  let shares = 0;
  let decodeOnly = 0;
  let peakHeap = 0;
  const start = nowMs();

  for await (const f of t.frames()) {
    if (f.t === 'batch') {
      const d0 = nowMs();
      const table = tableFromIPC(f.payload);
      const crs = table.schema.metadata.get('crs');
      const frameTag = table.schema.metadata.get('frame');
      if (crs === 'EPSG:2056' && frameTag === 'authoritative-project-crs') crsTagged++;
      const e = table.getChild('e')!.toArray() as Float64Array;
      if (e.buffer === f.payload.buffer) shares++;
      rows += e.length;
      decodeOnly += nowMs() - d0;
      const mem = (performance as any).memory?.usedJSHeapSize ?? 0;
      if (mem > peakHeap) peakHeap = mem;
    }
  }
  const t3 = nowMs() - start;
  hasher.digest();

  const expectedRows = (m.corpus?.batchCount ?? 0) * (m.corpus?.rowsPerBatch ?? 0);
  if (rows !== expectedRows) invalid.push(`${candidate}: ${rows} rows, expected ${expectedRows}`);
  if (crsTagged !== m.corpus?.batchCount) {
    // ADR-010 rule 1 binds each batch, not the corpus — re-chunking must not drop the envelope tag.
    invalid.push(`${candidate}: CRS tag on ${crsTagged}/${m.corpus?.batchCount} batches`);
  }
  return {
    t3DecodedMs: t3,
    decodeOnlyMs: decodeOnly,
    rows,
    crsTaggedBatches: crsTagged,
    arrowParseSharesBuffer: shares,
    peakJsHeapBytes: peakHeap,
    invalid,
  };
}

export async function runPhase2(
  base: string,
  token: string,
  m: Manifest,
  log: (s: string) => void,
): Promise<RunResult[]> {
  const results: RunResult[] = [];
  for (let i = 0; i < SCHEDULE.length; i++) {
    const candidate = SCHEDULE[i];
    const r = await modeR(candidate, base, token, m);
    const f = await modeF(candidate, base, token, m);
    const merged: RunResult = {
      ...(r as RunResult),
      ...(f as RunResult),
      candidate,
      position: i,
      invalid: [...(r.invalid ?? []), ...(f.invalid ?? [])],
    };
    results.push(merged);
    log(
      `  [${i + 1}/${SCHEDULE.length}] ${candidate}: t1 ${merged.t1TransportMs.toFixed(1)}ms ` +
        `(${merged.transportMBs.toFixed(0)} MB/s) · t2 ${merged.t2ChecksumMs.toFixed(1)}ms · ` +
        `t3 ${merged.t3DecodedMs.toFixed(1)}ms · reasm ${merged.reassemblyCopies}` +
        (merged.invalid.length ? ` · INVALID: ${merged.invalid.join('; ')}` : ''),
    );
  }
  return results;
}

/** p50/p95/p99 by sort-and-index, as every prior figure in this project. */
export function pct(xs: number[], p: number): number {
  if (!xs.length) return NaN;
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.floor((p / 100) * s.length))];
}

/**
 * Percentile bootstrap over **run-level means**, §16.4's declared analysis plan.
 * Per-batch samples within a run are not independent; pooling them would be pseudo-replication and
 * would narrow the interval by construction.
 */
export function bootstrapCI(
  runMeans: number[],
  resamples = 10_000,
  seed = 0x5eed2056,
): [number, number] {
  if (runMeans.length < 2) return [NaN, NaN];
  let s = seed >>> 0;
  const rnd = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0x100000000;
  };
  const means: number[] = [];
  for (let i = 0; i < resamples; i++) {
    let acc = 0;
    for (let j = 0; j < runMeans.length; j++) {
      acc += runMeans[Math.floor(rnd() * runMeans.length)];
    }
    means.push(acc / runMeans.length);
  }
  means.sort((a, b) => a - b);
  return [means[Math.floor(0.025 * resamples)], means[Math.floor(0.975 * resamples)]];
}

/**
 * Candidate x position interaction, §16.5. If a candidate's advantage depends on where it sat in
 * the block, counterbalancing has not removed the order effect and the block is confounded.
 */
export function orderEffect(results: RunResult[], metric: (r: RunResult) => number): number {
  const half = SCHEDULE.length / 2;
  const early = results.filter((r) => r.position < half);
  const late = results.filter((r) => r.position >= half);
  const mean = (xs: RunResult[]) =>
    xs.length ? xs.reduce((a, r) => a + metric(r), 0) / xs.length : NaN;
  const byCand = (xs: RunResult[], c: Candidate) => mean(xs.filter((r) => r.candidate === c));
  const earlyGap = byCand(early, 'websocket') - byCand(early, 'http-stream');
  const lateGap = byCand(late, 'websocket') - byCand(late, 'http-stream');
  const main = Math.abs((earlyGap + lateGap) / 2);
  if (!isFinite(main) || main === 0) return 0;
  return Math.abs(earlyGap - lateGap) / main;
}
