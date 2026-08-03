/**
 * Bake-off consumer and measurement harness.
 *
 * One consumer, both candidates. The ONLY thing that differs between them is the construction site
 * in `makeTransport()` — that is H6, and it is asserted here as a checked outcome rather than
 * asserted in prose.
 */

import { tableFromIPC } from 'apache-arrow';
import { HttpStreamTransport } from './adapter-http.js';
import { WebSocketTransport } from './adapter-ws.js';
import { PointRenderer } from './render.js';
import type { BatchTransport, Terminal } from './transport.js';
import { FRAME_PREFIX_LEN } from './wire.js';

const TOKEN: string = (window as any).__BAKEOFF_TOKEN__;
const BASE = window.location.origin;

const TOTAL_ROWS = 10_000_000;
const ROWS_PER_BATCH = 100_000;
const BATCH_COUNT = TOTAL_ROWS / ROWS_PER_BATCH;
/**
 * Smoke mode (`?smoke=1`) exists only to verify the harness end-to-end quickly. It runs fewer
 * repetitions than the preregistration declares, so **it marks its own report invalid** — README §8
 * makes "fewer than the declared runs" inadmissible, and a mode that could silently produce
 * publishable-looking numbers would be exactly the trap M2's validity gate was added to close.
 */
const SMOKE = new URLSearchParams(window.location.search).get('smoke') === '1';
const FULL_RUNS = SMOKE ? 1 : 3;
const CANCEL_TRIALS = SMOKE ? 2 : 10;
const ABORT_AT_MS = 400;
const PAUSE_MS = 3000;
const PAUSE_AFTER_BATCH = 20;
const CLOCK_PROBES = 21;
const CLOCK_BOUND_LIMIT_MS = 10;
const WATCHDOG_MS = 180_000;

// -------------------------------------------------------------------------------------------
// ADR-010 rule 7 — observable failure and recovery.
//
// Global handlers are UNCONDITIONAL. Declared recovery policy for this harness:
//   `none — fail visibly, mark the run invalid, and terminate with a surfaced error.`
// That is a valid declaration under rule 7 and the right one for a benchmark: silently recovering
// from a fault would corrupt the comparison. Heartbeat and watchdog are still instrumented, not to
// recover but so a stall lands as `invalid` rather than as a fast-looking number.
//
// Spike M4 lost an entire investigation cycle to an uncaught TypeError that presented as a hardware
// freeze while every liveness probe stayed healthy. Only a global exception listener answers that.
// -------------------------------------------------------------------------------------------
const fatalErrors: string[] = [];
window.addEventListener('error', (e) => {
  fatalErrors.push(`error: ${e.message}`);
  log(`FATAL error: ${e.message}`);
});
window.addEventListener('unhandledrejection', (e) => {
  fatalErrors.push(`unhandledrejection: ${String(e.reason)}`);
  log(`FATAL unhandledrejection: ${String(e.reason)}`);
});

let lastHeartbeat = performance.now();
const heartbeat = () => {
  lastHeartbeat = performance.now();
};
let watchdogFired = false;
setInterval(() => {
  if (performance.now() - lastHeartbeat > WATCHDOG_MS) {
    watchdogFired = true;
    log('WATCHDOG fired — no heartbeat within the declared interval');
  }
}, 1000);

// BEGIN/END checkpoints: "the last BEGIN with no matching END names the culprit" (ADR-010 rule 7).
const checkpoints: [string, boolean][] = [];
const begin = (p: string) => {
  checkpoints.push([p, true]);
  heartbeat();
};
const end = (p: string) => {
  checkpoints.push([p, false]);
  heartbeat();
};
function danglingCheckpoint(): string | null {
  const depth = new Map<string, number>();
  for (const [p, b] of checkpoints) depth.set(p, (depth.get(p) ?? 0) + (b ? 1 : -1));
  for (let i = checkpoints.length - 1; i >= 0; i--) {
    const [p, b] = checkpoints[i];
    if (b && (depth.get(p) ?? 0) > 0) return p;
  }
  return null;
}

const logLines: string[] = [];
function log(s: string) {
  const line = `[${(performance.now() / 1000).toFixed(2)}s] ${s}`;
  logLines.push(line);
  // eslint-disable-next-line no-console
  console.log(line);
  const el = document.getElementById('log');
  if (el) {
    el.textContent = logLines.slice(-24).join('\n');
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Visibility is a measurement-validity concern, not a convenience.
 *
 * A hidden or backgrounded tab suspends `requestAnimationFrame` entirely. Found the hard way on the
 * first live run: the harness sat for two minutes with a healthy transport (4 batches delivered,
 * credit correctly exhausted) and no error, because the first `await raf()` never resolved. Two
 * consequences, both handled rather than papered over: `raf()` can no longer hang forever, and any
 * run whose pixel timings were taken while throttled is marked **invalid** — "time to first
 * meaningful pixels" in a tab that is not compositing is not a slow number, it is not a number.
 */
const RAF_TIMEOUT_MS = 2000;
let rafThrottleEvents = 0;
let becameHiddenDuringRun = false;
document.addEventListener('visibilitychange', () => {
  if (document.hidden) becameHiddenDuringRun = true;
});

const raf = () =>
  new Promise<void>((resolve) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      rafThrottleEvents++;
      resolve();
    }, RAF_TIMEOUT_MS);
    requestAnimationFrame(() => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve();
    });
  });

function percentile(xs: number[], p: number): number {
  if (xs.length === 0) return NaN;
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.floor((p / 100) * s.length))];
}

// -------------------------------------------------------------------------------------------
// The single construction site H6 is about. Swapping candidates touches this function and nothing
// else — no semantic code below knows which transport it is talking to.
// -------------------------------------------------------------------------------------------
type Candidate = 'websocket' | 'http-stream';
function makeTransport(c: Candidate): BatchTransport {
  return c === 'websocket'
    ? new WebSocketTransport(BASE, TOKEN)
    : new HttpStreamTransport(BASE, TOKEN);
}

async function hex(b: ArrayBuffer): Promise<string> {
  return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join('');
}

/**
 * `crypto.subtle.digest` wants a `BufferSource` backed by a plain `ArrayBuffer`, while a view taken
 * with `subarray` is typed over `ArrayBufferLike` (TS 5.7+). The assertion is sound here rather
 * than merely convenient: this page is not cross-origin isolated, so `SharedArrayBuffer` is not
 * available at all and the union can only ever be `ArrayBuffer`. Hashing a copy instead would add
 * an uncounted copy to a harness whose whole point is counting them.
 */
function sha256(b: Uint8Array): Promise<ArrayBuffer> {
  return crypto.subtle.digest('SHA-256', b as unknown as BufferSource);
}

async function fetchFacts(streamId: string): Promise<any> {
  const r = await fetch(`${BASE}/facts/${streamId}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
    cache: 'no-store',
  });
  return r.ok ? r.json() : null;
}

// -------------------------------------------------------------------------------------------
// Cross-process clock relation. README §6: offset from the minimum-RTT probe, error bound
// +/- RTT_min/2, recorded; a bound over 10 ms invalidates the run rather than merely adding noise.
// -------------------------------------------------------------------------------------------
async function clockSync() {
  let bestRtt = Infinity;
  let offsetMs = 0;
  for (let i = 0; i < CLOCK_PROBES; i++) {
    const t0 = performance.now();
    const r = await fetch(`${BASE}/clock`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
      cache: 'no-store',
    });
    const t1 = performance.now();
    const j = await r.json();
    const rtt = t1 - t0;
    if (rtt < bestRtt) {
      bestRtt = rtt;
      // serverMs ~= clientPerfNow + offsetMs
      offsetMs = j.serverNanosSinceT0 / 1e6 - (t0 + rtt / 2);
    }
  }
  return { offsetMs, boundMs: bestRtt / 2, minRttMs: bestRtt };
}

interface RunMetrics {
  candidate: Candidate;
  run: number;
  firstBatchMs: number;
  firstPixelsMs: number;
  fullRenderMs: number;
  wholeTransferMBs: number;
  perBatchMBs: number[];
  wireBytes: number;
  rows: number;
  payloadSha256: string;
  crsTaggedBatches: number;
  arrowParseSharesBuffer: number;
  contiguousBatches: number;
  reassemblyCopies: number;
  jsonFramesSeen: number;
  terminal: Terminal | null;
  progressMonotonic: boolean;
  peakAccountedRetainedBytes: number;
  jsHeapSamples: number[];
  producerFacts: any;
}

async function fullRun(
  candidate: Candidate,
  run: number,
  renderer: PointRenderer,
): Promise<RunMetrics> {
  begin(`full:${candidate}:${run}`);
  renderer.reset();
  const t = makeTransport(candidate);
  const digests: Uint8Array[] = [];
  const arrivals: number[] = [];
  const batchWireBytes: number[] = [];
  const jsHeapSamples: number[] = [];
  let streamId = '';
  let firstBatchMs = 0;
  let firstPixelsMs = 0;
  let fullRenderMs = 0;
  let wireBytes = 0;
  let rows = 0;
  let crsTagged = 0;
  let sharesBuffer = 0;
  let contiguous = 0;
  let lastProgress = -1;
  let progressMonotonic = true;
  let terminal: Terminal | null = null;
  let peakRetained = 0;
  const tStart = performance.now();

  for await (const f of t.frames()) {
    heartbeat();
    if (f.t === 'open') {
      streamId = f.handle.streamId;
    } else if (f.t === 'batch') {
      const now = performance.now();
      arrivals.push(now);
      const frameBytes = f.payload.length + FRAME_PREFIX_LEN;
      wireBytes += frameBytes;
      batchWireBytes.push(frameBytes);
      if (firstBatchMs === 0) firstBatchMs = now - tStart;
      if (f.contiguous) contiguous++;

      // Accounted retained bytes: this is what H3's consumer-side bounded-memory claim rests on,
      // not the JS heap reading.
      peakRetained = Math.max(peakRetained, f.payload.byteLength);

      begin('decode');
      digests.push(new Uint8Array(await sha256(f.payload)));
      const table = tableFromIPC(f.payload);
      // ADR-010 rule 1: the envelope must name its coordinate space.
      const crs = table.schema.metadata.get('crs');
      const frameTag = table.schema.metadata.get('frame');
      if (crs === 'EPSG:2056' && frameTag === 'authoritative-project-crs') crsTagged++;
      const e = table.getChild('e')!.toArray() as Float64Array;
      const n = table.getChild('n')!.toArray() as Float64Array;
      // Copy-accounting stage 5, live-asserted per batch exactly as spike M5 did rather than
      // trusted from a doc comment.
      if (e.buffer === f.payload.buffer) sharesBuffer++;
      rows += e.length;
      end('decode');

      renderer.addBatch(e, n);
      if (firstPixelsMs === 0) {
        await raf();
        renderer.draw();
        firstPixelsMs = performance.now() - tStart;
      }
      if ((performance as any).memory) {
        jsHeapSamples.push((performance as any).memory.usedJSHeapSize);
      }
    } else if (f.t === 'progress') {
      if (f.progress.batches <= lastProgress) progressMonotonic = false;
      lastProgress = f.progress.batches;
    } else if (f.t === 'terminal') {
      terminal = f.terminal;
    }
  }

  await raf();
  renderer.draw();
  fullRenderMs = performance.now() - tStart;

  const chain = new Uint8Array(digests.length * 32);
  digests.forEach((d, i) => chain.set(d, i * 32));
  const payloadSha256 = await hex(await crypto.subtle.digest('SHA-256', chain));

  const perBatchMBs: number[] = [];
  for (let i = 1; i < arrivals.length; i++) {
    const dt = (arrivals[i] - arrivals[i - 1]) / 1000;
    if (dt > 0) perBatchMBs.push(batchWireBytes[i] / 1e6 / dt);
  }
  const wholeTransferMBs = wireBytes / 1e6 / ((arrivals[arrivals.length - 1] - tStart) / 1000);

  const producerFacts = streamId ? await fetchFacts(streamId) : null;
  end(`full:${candidate}:${run}`);

  return {
    candidate,
    run,
    firstBatchMs,
    firstPixelsMs,
    fullRenderMs,
    wholeTransferMBs,
    perBatchMBs,
    wireBytes,
    rows,
    payloadSha256,
    crsTaggedBatches: crsTagged,
    arrowParseSharesBuffer: sharesBuffer,
    contiguousBatches: contiguous,
    reassemblyCopies: (t as any).stats.reassemblyCopies,
    jsonFramesSeen: (t as any).stats.jsonFramesSeen,
    terminal,
    progressMonotonic,
    peakAccountedRetainedBytes: peakRetained,
    jsHeapSamples,
    producerFacts,
  };
}

/** H2 — producer-side cancellation. Measured on the PRODUCER's clock, never client-side. */
async function cancelTrial(candidate: Candidate, offsetMs: number) {
  const t = makeTransport(candidate);
  const tStart = performance.now();
  let streamId = '';
  let abortedAt = 0;
  const iter = t.frames();
  for await (const f of iter) {
    if (f.t === 'open') streamId = f.handle.streamId;
    if (performance.now() - tStart >= ABORT_AT_MS && streamId) {
      abortedAt = performance.now();
      t.cancel();
      break;
    }
  }
  // Poll the producer's own record. The client's promise-rejection latency is NOT the measurement.
  let facts: any = null;
  for (let i = 0; i < 120; i++) {
    facts = await fetchFacts(streamId);
    if (facts?.cancel_observed_nanos_since_t0 != null) break;
    await sleep(10);
  }
  if (!facts || facts.cancel_observed_nanos_since_t0 == null) {
    return { ackMs: null, batchesAfter: null, streamId, observed: false };
  }
  const observedClientMs = facts.cancel_observed_nanos_since_t0 / 1e6 - offsetMs;
  return {
    ackMs: observedClientMs - abortedAt,
    batchesAfter: facts.batches_after_cancel_observed,
    generationCostUs: facts.generation_cost_us?.slice(0, 20) ?? [],
    streamId,
    observed: true,
  };
}

/** H3 — bounded memory under a deliberately paused consumer. */
async function backpressureTrial(candidate: Candidate) {
  const t = makeTransport(candidate);
  let streamId = '';
  let seen = 0;
  let pauseStart = 0;
  let pauseEnd = 0;
  for await (const f of t.frames()) {
    if (f.t === 'open') streamId = f.handle.streamId;
    if (f.t === 'batch') {
      seen++;
      if (seen === PAUSE_AFTER_BATCH) {
        pauseStart = performance.now();
        log(`  pausing consumer ${PAUSE_MS}ms after batch ${seen}`);
        await sleep(PAUSE_MS);
        pauseEnd = performance.now();
      }
      if (seen >= PAUSE_AFTER_BATCH + 10) {
        t.cancel();
        break;
      }
    }
  }
  await sleep(150);
  const facts = await fetchFacts(streamId);
  return { streamId, pauseStart, pauseEnd, pauseApplied: pauseEnd > pauseStart, facts };
}

/** H7 — terminal-outcome behaviour at three distinct injection points. */
async function errorBehaviour(candidate: Candidate) {
  const results: any[] = [];
  for (const phase of ['production', 'transfer', 'decode'] as const) {
    const t = makeTransport(candidate);
    let streamId = '';
    let seen = 0;
    let terminal: Terminal | null = null;
    let renderedBatches = 0;
    try {
      for await (const f of t.frames()) {
        if (f.t === 'open') {
          streamId = f.handle.streamId;
          // Cancel before any batch exists: the producer is still generating.
          if (phase === 'production') t.cancel();
        }
        if (f.t === 'batch') {
          seen++;
          if (phase === 'transfer' && seen === 20) t.cancel();
          if (phase === 'decode' && seen === 20) {
            // Cancel while a decode is in flight.
            const p = sha256(f.payload);
            t.cancel();
            await p;
          }
          renderedBatches++;
        }
        if (f.t === 'terminal') terminal = f.terminal;
        if (seen > 40) break;
      }
    } catch (e) {
      terminal = { kind: 'TransportFailed', detail: String(e) };
    }
    await sleep(200);
    const facts = streamId ? await fetchFacts(streamId) : null;
    results.push({
      phase,
      terminalKind: terminal?.kind ?? null,
      terminalDetail: terminal?.detail ?? null,
      batchesReceived: seen,
      // ADR-010 rule 5, third bullet: a cancelled stream must not leave a partial view presented
      // as complete. `viewComplete` is false here by construction and is surfaced, not silent.
      viewComplete: renderedBatches >= BATCH_COUNT,
      viewSignalledIncomplete: renderedBatches < BATCH_COUNT,
      producerObservedCancel: facts?.cancel_observed_nanos_since_t0 != null,
      producerTerminal: facts?.terminal ?? null,
      danglingProducerCheckpoint: facts?.dangling_checkpoint ?? null,
    });
    log(`  ${candidate} cancel-during-${phase}: ${terminal?.kind ?? 'none'}`);
  }
  return results;
}

/** H4 — the browser half. Origin forgery is impossible from a page, so those cases are covered by
 *  the Rust live security tests instead; that split is recorded, not glossed over. */
async function securityNegativeTests() {
  const probe = async (auth: string | null) => {
    const r = await fetch(`${BASE}/clock`, {
      headers: auth ? { Authorization: `Bearer ${auth}` } : {},
      cache: 'no-store',
    });
    return r.status;
  };
  return {
    noToken: await probe(null),
    wrongToken: await probe('0'.repeat(64)),
    validToken: await probe(TOKEN),
    note: 'Origin forgery is not possible from a browser context; foreign-origin and null-origin rejection are covered by the Rust live security tests (cargo test security_tests).',
  };
}

async function main() {
  const canvas = document.getElementById('gl') as HTMLCanvasElement;
  const renderer = new PointRenderer(canvas);
  log(`GPU: ${renderer.gpuInfo()}`);
  log(`UA: ${navigator.userAgent}`);

  if (document.hidden) {
    log('document is HIDDEN — rAF is suspended; waiting up to 30s for a visible foreground tab');
    await Promise.race([
      new Promise<void>((r) => {
        const check = () => {
          if (!document.hidden) {
            document.removeEventListener('visibilitychange', check);
            r();
          }
        };
        document.addEventListener('visibilitychange', check);
      }),
      sleep(30_000),
    ]);
    if (document.hidden) {
      log('still hidden — continuing, but this run will be marked INVALID');
    } else {
      becameHiddenDuringRun = false; // it started hidden, not interrupted mid-run
    }
  }

  const clock = await clockSync();
  log(
    `clock offset ${clock.offsetMs.toFixed(3)} ms, bound +/-${clock.boundMs.toFixed(3)} ms`,
  );

  const security = await securityNegativeTests();
  log(`security probes: noToken=${security.noToken} wrongToken=${security.wrongToken} valid=${security.validToken}`);

  const runs: RunMetrics[] = [];
  const cancels: any = {};
  const backpressure: any = {};
  const errors: any = {};

  for (const candidate of ['websocket', 'http-stream'] as Candidate[]) {
    log(`=== candidate: ${candidate} ===`);
    for (let r = 1; r <= FULL_RUNS; r++) {
      const m = await fullRun(candidate, r, renderer);
      runs.push(m);
      log(
        `  run ${r}: firstBatch ${m.firstBatchMs.toFixed(1)}ms, firstPixels ${m.firstPixelsMs.toFixed(1)}ms, ` +
          `full ${m.fullRenderMs.toFixed(0)}ms, ${m.wholeTransferMBs.toFixed(1)} MB/s, rows ${m.rows}`,
      );
    }
    log(`  cancellation trials x${CANCEL_TRIALS}`);
    cancels[candidate] = [];
    for (let i = 0; i < CANCEL_TRIALS; i++) {
      cancels[candidate].push(await cancelTrial(candidate, clock.offsetMs));
    }
    const acks = cancels[candidate].map((c: any) => c.ackMs).filter((x: any) => x != null);
    log(`  cancel ack p50 ${percentile(acks, 50)?.toFixed(2)}ms max ${Math.max(...acks).toFixed(2)}ms (n=${acks.length})`);

    log('  backpressure trial');
    backpressure[candidate] = await backpressureTrial(candidate);

    log('  error-behaviour injections');
    errors[candidate] = await errorBehaviour(candidate);
  }

  // ---- validity gate (README §8) ----
  const invalidReasons: string[] = [];
  if (SMOKE) {
    invalidReasons.push(
      `smoke mode: ${FULL_RUNS} full run(s) and ${CANCEL_TRIALS} cancellation trial(s) instead of the declared 3 and 10 — inadmissible as a measurement`,
    );
  }
  const hashes = new Set(runs.map((r) => r.payloadSha256));
  if (hashes.size !== 1) invalidReasons.push(`payload digest differs across runs/adapters (${hashes.size} distinct)`);
  for (const r of runs) {
    if (r.rows !== TOTAL_ROWS) invalidReasons.push(`${r.candidate} run ${r.run}: rows ${r.rows} != ${TOTAL_ROWS}`);
    if (r.crsTaggedBatches !== BATCH_COUNT) invalidReasons.push(`${r.candidate} run ${r.run}: CRS tag on ${r.crsTaggedBatches}/${BATCH_COUNT} batches`);
    if (r.jsonFramesSeen !== 0) invalidReasons.push(`${r.candidate} run ${r.run}: ${r.jsonFramesSeen} JSON frames on the data path`);
    if (!r.progressMonotonic) invalidReasons.push(`${r.candidate} run ${r.run}: progress not monotonic`);
    // A full run must end in exactly one Completed terminal. Without this the 98-of-100 truncation
    // found in the first smoke run reads as an unremarkable short stream.
    if (r.terminal?.kind !== 'Completed') {
      invalidReasons.push(`${r.candidate} run ${r.run}: terminal ${r.terminal?.kind ?? 'missing'} (expected Completed)`);
    }
    if (r.producerFacts?.json_frames_on_data_path) invalidReasons.push(`${r.candidate} run ${r.run}: producer saw JSON frames`);
  }
  if (clock.boundMs > CLOCK_BOUND_LIMIT_MS) invalidReasons.push(`clock bound ${clock.boundMs.toFixed(2)}ms exceeds ${CLOCK_BOUND_LIMIT_MS}ms`);
  if (document.hidden) invalidReasons.push('document hidden at completion — pixel timings inadmissible');
  if (rafThrottleEvents > 0) invalidReasons.push(`requestAnimationFrame throttled ${rafThrottleEvents}x — pixel timings inadmissible`);
  if (becameHiddenDuringRun) invalidReasons.push('tab was backgrounded mid-run — frame timings inadmissible');
  if (watchdogFired) invalidReasons.push('watchdog fired');
  if (fatalErrors.length) invalidReasons.push(`uncaught errors: ${fatalErrors.join('; ')}`);
  const dangling = danglingCheckpoint();
  if (dangling) invalidReasons.push(`dangling checkpoint: ${dangling}`);
  if (security.noToken !== 401 || security.wrongToken !== 401 || security.validToken !== 200) {
    invalidReasons.push('security probes did not behave as required');
  }
  for (const c of ['websocket', 'http-stream']) {
    if (!backpressure[c].pauseApplied) invalidReasons.push(`${c}: consumer pause was not applied`);
    if (cancels[c].some((x: any) => !x.observed)) invalidReasons.push(`${c}: producer did not observe cancel in at least one trial`);
  }

  const report = {
    schema: 'transport-bakeoff/v1',
    preregistration: 'protocol/transport-bakeoff/README.md',
    timestamp: new Date().toISOString(),
    valid: invalidReasons.length === 0,
    invalidReasons,
    environment: {
      userAgent: navigator.userAgent,
      gpu: renderer.gpuInfo(),
      hardwareConcurrency: navigator.hardwareConcurrency,
      devicePixelRatio: window.devicePixelRatio,
      documentHiddenAtEnd: document.hidden,
      rafThrottleEvents,
      becameHiddenDuringRun,
      smokeMode: SMOKE,
    },
    workload: { totalRows: TOTAL_ROWS, rowsPerBatch: ROWS_PER_BATCH, batchCount: BATCH_COUNT },
    clock,
    security,
    runs,
    cancellation: cancels,
    backpressure,
    errorBehaviour: errors,
    recoveryPolicy: 'none — fail visibly, mark the run invalid, and terminate with a surfaced error',
    checkpointsDangling: dangling,
    log: logLines,
  };

  await fetch(`${BASE}/report`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(report),
  });
  log(`DONE — valid=${report.valid} ${invalidReasons.length ? invalidReasons.join(' | ') : ''}`);
  (window as any).__BAKEOFF_REPORT__ = report;
  (window as any).__BAKEOFF_DONE__ = true;
}

main().catch((e) => {
  // Rule 7: an async entry point may not terminate silently.
  fatalErrors.push(String(e));
  log(`FATAL: ${e}`);
  (window as any).__BAKEOFF_DONE__ = true;
});
