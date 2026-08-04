/**
 * Phase 3 — repaired instrument, re-measurement (README §19).
 *
 * Differences from Phase 2 that change what the numbers mean:
 *
 * - **No cryptographic hasher inside the timed path** (§19.5). §17.7 established that a pure-JS
 *   streaming SHA-256 in the frame decoder consumed 61-63% of t1, so Phase 2's throughput was a
 *   floor of the instrument. Timed runs carry an O(batches) structural digest instead; cryptographic
 *   identity is established by a separate untimed verification run per candidate per configuration.
 * - **Paired symmetric effect with a Student-t interval** (§19.3), replacing §16.5's order-effect
 *   gate, which §19.2 shows rejects 98.4% of blocks at a true null.
 * - **Producer facts reach the artifact** (§18 P6): the stream id is read from the OPEN frame, so
 *   every producer-side assertion is verifiable from the record rather than out of band.
 * - **Per-run heartbeat** (§18 P5), so a long block cannot trip the watchdog with a healthy
 *   transport underneath.
 */

import { tableFromIPC } from 'apache-arrow';
import { makeTransport, type Candidate } from './make-transport.js';
import { Sha256Stream } from './sha256.js';
import type { Terminal } from './transport.js';

export type { Candidate };

/**
 * §19.7's declared schedule: 10 pairs = 20 timed runs, `AB BA` alternating so the pair-level
 * decomposition is order-balanced by construction — 5 `AB` pairs and 5 `BA` pairs.
 */
export const PAIRS = 10;
export const SCHEDULE: Candidate[] = Array.from({ length: PAIRS }, (_, i) =>
  i % 2 === 0
    ? (['websocket', 'http-stream'] as Candidate[])
    : (['http-stream', 'websocket'] as Candidate[]),
).flat();

/**
 * §19.5's structural digest — **O(batches), not O(bytes)**.
 *
 * Detects truncation, dropped or reordered batches, frame-boundary corruption and a length field
 * that lies. Does **not** detect silent corruption of payload interior bytes; that is what the
 * untimed verification run covers. Stated here because §19.5 declares the residual rather than
 * letting a loopback-TCP argument stand in for a control.
 *
 * FNV-1a over a per-batch tuple. Cost is independent of payload size, so it cannot become §17.7's
 * defect at reduced amplitude.
 */
export class StructuralDigest {
  private h = 0xcbf29ce484222325n;
  private readonly M = 0xffffffffffffffffn;
  private readonly PRIME = 0x100000001b3n;

  private fold(byte: number): void {
    this.h = ((this.h ^ BigInt(byte & 0xff)) * this.PRIME) & this.M;
  }

  update(index: number, payload: Uint8Array): void {
    for (let s = 24; s >= 0; s -= 8) this.fold(index >>> s);
    const len = payload.length;
    for (let s = 24; s >= 0; s -= 8) this.fold(len >>> s);
    const n = Math.min(8, len);
    for (let i = 0; i < n; i++) this.fold(payload[i]);
    for (let i = 0; i < n; i++) this.fold(payload[len - n + i]);
  }

  digest(): string {
    return this.h.toString(16).padStart(16, '0');
  }
}

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
  /** §18 P8: the credit window proper, 4 x batch. */
  creditWindowBytes?: number;
  /** §18 P8: (4+1) x batch — what Phase 2 mislabelled as the credit window. */
  producerResidentBoundBytes?: number;
  tcpNoDelay?: { requested: boolean; connectionsVerified: number; connectionsFailed: number };
}

/** Producer-side facts, fetched per run so §19.8's "producer facts absent" invalidator can bind. */
export interface ProducerFacts {
  adapter?: string;
  residentBytesMax?: number;
  batchesGenerated?: number;
  batchesAfterCancel?: number;
  bytesEmitted?: number;
  memorySamples?: number;
  sampleGapsUs?: number[];
  [k: string]: unknown;
}

export interface RunResult {
  candidate: Candidate;
  position: number;
  pair: number;
  /** Mode R — timed receive, no cryptographic hashing (§19.5). */
  firstBatchMs: number;
  t1TransportMs: number;
  transportMBs: number;
  structuralDigest: string;
  /** Mode F — timed receive + Arrow decode. */
  t3DecodedMs: number;
  decodeOnlyMs: number;
  rows: number;
  crsTaggedBatches: number;
  arrowParseSharesBuffer: number;
  /** Shared. */
  batches: number;
  contiguousBatches: number;
  reassemblyCopies: number;
  jsonFramesSeen: number;
  terminal: Terminal | null;
  peakJsHeapBytes: number;
  hashingEnabled: boolean;
  producerFacts: ProducerFacts | null;
  invalid: string[];
}

const nowMs = () => performance.now();

async function fetchFacts(base: string, token: string, streamId: string): Promise<ProducerFacts | null> {
  try {
    const r = await fetch(`${base}/facts/${streamId}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    return r.ok ? ((await r.json()) as ProducerFacts) : null;
  } catch {
    return null;
  }
}

/**
 * Mode R — timed raw receipt. **No cryptographic hasher** (§19.5).
 *
 * `hashing` exists so the verification run uses this same function, same build, same decoder path,
 * with the hasher as the only difference (§19.5's equal-instrumentation condition). Its value is
 * recorded in every artifact.
 */
export async function modeR(
  candidate: Candidate,
  base: string,
  token: string,
  m: Manifest,
  hashing: boolean,
): Promise<Partial<RunResult> & { wireDigest?: string }> {
  const t = makeTransport(candidate, base, token);
  const invalid: string[] = [];
  const structural = new StructuralDigest();
  const hasher = hashing ? new Sha256Stream() : null;
  if (hasher) t.batchByteSink = (s) => hasher.update(s);

  let batches = 0;
  let contiguous = 0;
  let firstBatchMs = 0;
  let t1 = 0;
  let streamId = '';
  let terminal: Terminal | null = null;
  const start = nowMs();

  for await (const f of t.frames()) {
    if (f.t === 'open') {
      streamId = f.handle.streamId;
    } else if (f.t === 'batch') {
      structural.update(batches, f.payload);
      batches++;
      if (f.contiguous) contiguous++;
      if (firstBatchMs === 0) firstBatchMs = nowMs() - start;
      t1 = nowMs() - start;
    } else if (f.t === 'terminal') {
      terminal = f.terminal;
    }
  }

  const expected = m.corpus?.batchCount ?? 0;
  if (batches !== expected) invalid.push(`${candidate}: ${batches} batches, expected ${expected}`);
  if (terminal?.kind !== 'Completed') {
    invalid.push(`${candidate}: terminal ${terminal?.kind ?? 'missing'}`);
  }

  const wireDigest = hasher?.digest();
  if (hasher && wireDigest !== m.corpus?.wireDigest) {
    invalid.push(`${candidate}: verification digest != manifest`);
  }

  // §18 P6 — after t1, so it cannot perturb the measurement.
  const producerFacts = streamId ? await fetchFacts(base, token, streamId) : null;
  if (!producerFacts) invalid.push(`${candidate}: producer facts absent from the record`);

  const bytes = m.corpus?.totalWireBytes ?? 0;
  return {
    firstBatchMs,
    t1TransportMs: t1,
    transportMBs: bytes / 1e6 / (t1 / 1000),
    structuralDigest: structural.digest(),
    wireDigest,
    batches,
    contiguousBatches: contiguous,
    reassemblyCopies: t.stats.reassemblyCopies,
    jsonFramesSeen: t.stats.jsonFramesSeen,
    terminal,
    hashingEnabled: hashing,
    producerFacts,
    invalid,
  };
}

/** Mode F — timed receive + Arrow decode. Yields end-to-usable-data. No hasher. */
export async function modeF(
  candidate: Candidate,
  base: string,
  token: string,
  m: Manifest,
): Promise<Partial<RunResult>> {
  const t = makeTransport(candidate, base, token);
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
      const mem = (performance as { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize ?? 0;
      if (mem > peakHeap) peakHeap = mem;
    }
  }
  const t3 = nowMs() - start;

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

/**
 * §19.7's N=2 configuration: two concurrent streams, same candidate, simultaneous start, each
 * carrying the full corpus. θ is computed on **aggregate** throughput — total bytes across both
 * streams over first-open to last-t1 — because that is the scale the ceiling is declared on.
 */
export async function runN2(
  candidate: Candidate,
  base: string,
  token: string,
  m: Manifest,
): Promise<Partial<RunResult> & { perStreamMBs?: number[]; aggregateResidentBytes?: number }> {
  const start = nowMs();
  const one = async () => {
    const t = makeTransport(candidate, base, token);
    let batches = 0;
    let streamId = '';
    let t1 = 0;
    let terminal: Terminal | null = null;
    const structural = new StructuralDigest();
    for await (const f of t.frames()) {
      if (f.t === 'open') streamId = f.handle.streamId;
      else if (f.t === 'batch') {
        structural.update(batches, f.payload);
        batches++;
        t1 = nowMs() - start;
      } else if (f.t === 'terminal') terminal = f.terminal;
    }
    const facts = streamId ? await fetchFacts(base, token, streamId) : null;
    return { batches, t1, terminal, stats: t.stats, facts, digest: structural.digest() };
  };

  const [a, b] = await Promise.all([one(), one()]);
  const lastT1 = Math.max(a.t1, b.t1);
  const bytes = (m.corpus?.totalWireBytes ?? 0) * 2;
  const invalid: string[] = [];
  const expected = m.corpus?.batchCount ?? 0;
  for (const s of [a, b]) {
    if (s.batches !== expected) invalid.push(`${candidate} N=2: ${s.batches} batches, expected ${expected}`);
    if (s.terminal?.kind !== 'Completed') invalid.push(`${candidate} N=2: terminal ${s.terminal?.kind ?? 'missing'}`);
  }
  if (a.digest !== b.digest) invalid.push(`${candidate} N=2: the two streams did not carry identical bytes`);

  // §19.7 requires the aggregate producer-resident bound be asserted as MEASURED, not derived from
  // "credit is per-stream".
  const resident = [a.facts, b.facts].reduce<number>(
    (acc, f) => acc + (typeof f?.residentBytesMax === 'number' ? f.residentBytesMax : 0),
    0,
  );
  const bound = 2 * (m.producerResidentBoundBytes ?? 0);
  if (bound > 0 && resident > bound) {
    invalid.push(`${candidate} N=2: aggregate resident ${resident} B exceeds the declared ${bound} B`);
  }
  if (!a.facts || !b.facts) invalid.push(`${candidate} N=2: producer facts absent from the record`);

  return {
    t1TransportMs: lastT1,
    transportMBs: bytes / 1e6 / (lastT1 / 1000),
    perStreamMBs: [
      (m.corpus?.totalWireBytes ?? 0) / 1e6 / (a.t1 / 1000),
      (m.corpus?.totalWireBytes ?? 0) / 1e6 / (b.t1 / 1000),
    ],
    aggregateResidentBytes: resident,
    batches: a.batches + b.batches,
    reassemblyCopies: a.stats.reassemblyCopies + b.stats.reassemblyCopies,
    jsonFramesSeen: a.stats.jsonFramesSeen + b.stats.jsonFramesSeen,
    terminal: a.terminal,
    structuralDigest: a.digest,
    invalid,
  };
}

// -----------------------------------------------------------------------------------------------
// §19.3's analysis. Every function here is pure, so `analysis.test.ts` can pin it without a browser.
// -----------------------------------------------------------------------------------------------

/** splitmix64 — §18 P7. Phase 2's 32-bit LCG could not hold the declared 64-bit seed; this does. */
export function splitmix64(seed: bigint): () => number {
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

/**
 * §19.3's per-pair symmetric relative effect on throughput.
 *
 * `θ = 2(thr_B − thr_A) / (thr_A + thr_B)`, so **θ > 0 means Candidate B is faster**. The symmetric
 * denominator is what closes §18 P9: §16.9's "differs by more than 10%" never said 10% *of what*,
 * and the same gap read as 4.02% or 4.20% depending on which candidate sat underneath. Here the
 * denominator is fixed by the formula and cannot be chosen after the fact.
 */
export function pairedTheta(
  runs: { candidate: Candidate; transportMBs: number }[],
): number[] {
  const out: number[] = [];
  for (let i = 0; i + 1 < runs.length; i += 2) {
    const x = runs[i];
    const y = runs[i + 1];
    if (x.candidate === y.candidate) continue;
    const a = (x.candidate === 'websocket' ? x : y).transportMBs;
    const b = (x.candidate === 'http-stream' ? x : y).transportMBs;
    out.push((2 * (b - a)) / (a + b));
  }
  return out;
}

/**
 * Two-sided 97.5th percentile of t at n-1 df. A missing key must throw rather than fall back to a
 * normal quantile: an early draft silently fell back to 2.0 at n=12 and under-covered.
 */
const T_QUANTILE: Record<number, number> = {
  3: 4.303, 4: 3.182, 5: 2.776, 6: 2.571, 7: 2.447, 8: 2.365, 9: 2.306, 10: 2.262,
  11: 2.228, 12: 2.201, 13: 2.179, 14: 2.16, 15: 2.145, 16: 2.131, 17: 2.12, 18: 2.11,
  19: 2.101, 20: 2.093, 21: 2.086, 22: 2.08, 23: 2.074, 24: 2.069, 25: 2.064, 26: 2.06,
};

/**
 * §19.3's **decision interval**: Student-t over pair-level values.
 *
 * Chosen on measured coverage, not convention. §16.4's percentile bootstrap covers 86.9-90.8% of a
 * nominal 95% at these sample sizes, and the direction of that error matters — too narrow
 * over-selects "entirely within ±10%", the branch that falls through to the copies ordering and
 * selects Candidate A. An anti-conservative interval would bias the study toward its own expected
 * answer. Student-t measures 94.9-95.8% (`scripts/sim-order-statistic.mjs`).
 */
export function tCI(xs: number[]): [number, number] {
  const n = xs.length;
  const t = T_QUANTILE[n];
  if (t === undefined) throw new Error(`no t quantile for n=${n} — extend the table, never fall back`);
  const m = xs.reduce((a, x) => a + x, 0) / n;
  const sd = Math.sqrt(xs.reduce((a, x) => a + (x - m) ** 2, 0) / (n - 1));
  const h = (t * sd) / Math.sqrt(n);
  return [m - h, m + h];
}

/**
 * Percentile bootstrap over pair-level values, reported alongside the t interval because the human
 * directed the bootstrap discipline be carried forward. Seed held at full 64 bits (§18 P7).
 * §19.3 pre-declares that a disagreement between the two intervals about which §19.9 branch fires
 * makes the outcome inconclusive.
 */
export function bootstrapCI(
  xs: number[],
  resamples = 10_000,
  seed = 0x5eed305100000001n,
): [number, number] {
  if (xs.length < 2) return [NaN, NaN];
  const rnd = splitmix64(seed);
  const means: number[] = [];
  for (let i = 0; i < resamples; i++) {
    let acc = 0;
    for (let j = 0; j < xs.length; j++) acc += xs[Math.floor(rnd() * xs.length)];
    means.push(acc / xs.length);
  }
  means.sort((a, b) => a - b);
  return [means[Math.floor(0.025 * resamples)], means[Math.floor(0.975 * resamples)]];
}

/**
 * §19.3's drift figure: pair-mean throughput range over the grand mean. **Reported, not a gate** —
 * the simulation shows the paired estimator's coverage holds at 94.5-98.0% across four drift shapes
 * up to 50% drift, so invalidating on drift would repeat §16.5's error of discarding sound blocks.
 * Above 20% a block is flagged and may not decide §19.9 alone.
 */
export function observedDrift(runs: { transportMBs: number }[]): number {
  const pm: number[] = [];
  for (let i = 0; i + 1 < runs.length; i += 2) {
    pm.push((runs[i].transportMBs + runs[i + 1].transportMBs) / 2);
  }
  if (pm.length < 2) return 0;
  const g = pm.reduce((a, x) => a + x, 0) / pm.length;
  return g === 0 ? 0 : (Math.max(...pm) - Math.min(...pm)) / g;
}

export type Branch = 'B-wins' | 'A-wins' | 'equivalent' | 'inconclusive';

/** §19.9 rules 2-5, applied to one interval. Pure, so it is pinned by test rather than by reading. */
export function classify(ci: [number, number], band = 0.1): Branch {
  const [lo, hi] = ci;
  if (!isFinite(lo) || !isFinite(hi)) return 'inconclusive';
  if (lo > band) return 'B-wins';
  if (hi < -band) return 'A-wins';
  if (lo >= -band && hi <= band) return 'equivalent';
  return 'inconclusive';
}

export interface BlockAnalysis {
  pairs: number;
  theta: number[];
  thetaMean: number;
  tCI: [number, number];
  bootstrapCI: [number, number];
  tBranch: Branch;
  bootstrapBranch: Branch;
  branch: Branch;
  driftFraction: number;
  driftFlagged: boolean;
  halfWidth: number;
  invalid: string[];
}

/** The whole of §19.3 + §19.9 for one block, computed only after the schedule completes. */
export function analyseBlock(runs: { candidate: Candidate; transportMBs: number }[]): BlockAnalysis {
  const theta = pairedTheta(runs);
  const invalid: string[] = [];
  if (theta.length !== PAIRS) {
    invalid.push(`${theta.length} usable pairs, expected ${PAIRS}`);
  }
  const ab = runs.filter((_, i) => i % 2 === 0 && runs[i].candidate === 'websocket').length;
  if (ab * 2 !== PAIRS) invalid.push(`AB/BA imbalance: ${ab} AB pairs of ${PAIRS}`);

  const mean = theta.length ? theta.reduce((a, x) => a + x, 0) / theta.length : NaN;
  const t = theta.length >= 3 ? tCI(theta) : ([NaN, NaN] as [number, number]);
  const b = bootstrapCI(theta);
  const halfWidth = (t[1] - t[0]) / 2;
  if (isFinite(halfWidth) && halfWidth > 0.1) {
    invalid.push(`realized CI half-width ±${(halfWidth * 100).toFixed(2)} pp exceeds the declared ±10 pp`);
  }
  const tBranch = classify(t);
  const bootstrapBranch = classify(b);
  if (tBranch !== bootstrapBranch) {
    invalid.push(`t and bootstrap intervals select different branches (${tBranch} vs ${bootstrapBranch})`);
  }
  const drift = observedDrift(runs);

  return {
    pairs: theta.length,
    theta,
    thetaMean: mean,
    tCI: t,
    bootstrapCI: b,
    tBranch,
    bootstrapBranch,
    branch: tBranch === bootstrapBranch ? tBranch : 'inconclusive',
    driftFraction: drift,
    driftFlagged: drift > 0.2,
    halfWidth,
    invalid,
  };
}

/**
 * Runs the declared schedule. `heartbeat` is called after every mode of every run — §18 P5, where
 * Phase 2 bracketed all 12 runs in a single begin/end pair and tripped a 180 s watchdog with a
 * healthy transport underneath.
 */
export async function runPhase3(
  base: string,
  token: string,
  m: Manifest,
  log: (s: string) => void,
  heartbeat: () => void,
  n2 = false,
): Promise<RunResult[]> {
  const results: RunResult[] = [];
  for (let i = 0; i < SCHEDULE.length; i++) {
    const candidate = SCHEDULE[i];
    let merged: RunResult;
    if (n2) {
      const r = await runN2(candidate, base, token, m);
      heartbeat();
      merged = { ...(r as RunResult), candidate, position: i, pair: Math.floor(i / 2) };
    } else {
      const r = await modeR(candidate, base, token, m, false);
      heartbeat();
      const f = await modeF(candidate, base, token, m);
      heartbeat();
      merged = {
        ...(r as RunResult),
        ...(f as RunResult),
        candidate,
        position: i,
        pair: Math.floor(i / 2),
        invalid: [...(r.invalid ?? []), ...(f.invalid ?? [])],
      };
    }
    results.push(merged);
    log(
      `  [${i + 1}/${SCHEDULE.length}] ${candidate}: t1 ${merged.t1TransportMs.toFixed(1)}ms ` +
        `(${merged.transportMBs.toFixed(1)} MB/s) · reasm ${merged.reassemblyCopies}` +
        (merged.invalid?.length ? ` · INVALID: ${merged.invalid.join('; ')}` : ''),
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
