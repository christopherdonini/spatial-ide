// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { invoke } from "@tauri-apps/api/core";
import { percentile } from "./benchmark";
import { f64ToHexBits, hexBitsToF64 } from "./bit-encoding";
import { verifyNoCopyAtArrowParse } from "./p1-loader";

// M5 — data-plane audit (README Milestones: "count every copy end-to-end
// (Rust -> IPC -> JS -> GPU), MB/s throughput, cancellation < 100 ms
// mid-load (ADR-004 honesty check)"). Item 4 was upgraded after the M4
// diagnostic notes found a plain f64 command argument isn't reliably
// bit-exact across Tauri IPC (3/9 runs, 1-ULP loss) — see README's ADR-004
// amendment draft. Same discipline as every milestone before this one: no
// number here is claimed without a run behind it, and every scope limit is
// named rather than left implicit.

let currentCheckpointPhase: string | null = null;
function setStatus(s: string) {
  const el = document.querySelector<HTMLParagraphElement>("#m5-status");
  if (el) el.textContent = s;
  if (currentCheckpointPhase !== null) checkpoint(`END ${currentCheckpointPhase}`);
  currentCheckpointPhase = s;
  checkpoint(`BEGIN ${s}`);
}

function appendLog(line: string) {
  const el = document.querySelector<HTMLPreElement>("#m5-log");
  if (el) el.textContent = (el.textContent ? el.textContent + "\n" : "") + line;
  console.log("[M5]", line);
}

function checkpoint(label: string) {
  void invoke("js_checkpoint", { label }).catch(() => {});
}

// ---- item 1: copy-count audit ---------------------------------------------

interface CopyAuditStage {
  stage: string;
  copies: number;
  note: string;
}

/**
 * Rust->IPC->JS->GPU copy count for the P1/P2 hot path, read from source
 * (arrow_en.rs and p1-loader.ts each carry the same accounting in their own
 * doc comments — this is that accounting made into a measured report row,
 * not a fresh claim) plus one thing actually re-checked live every run
 * rather than trusted from a comment: whether apache-arrow's column
 * .toArray() shares the fetched ArrayBuffer or copies it.
 */
async function auditCopies(): Promise<{ stages: CopyAuditStage[]; verifiedNoCopyAtArrowParse: boolean; datasetBytes: number }> {
  const stages: CopyAuditStage[] = [
    {
      stage: "Rust: to_vec() into Float64Array",
      copies: 1,
      note: "arrow_en::serialize_en takes &[f64]; to_vec() clones into the Arrow array's own buffer. Necessary because callers (p1.rs/p2.rs) keep their storage for reuse across requests.",
    },
    {
      stage: "Rust: Arrow IPC serialization into Vec<u8>",
      copies: 1,
      note: "StreamWriter writes the RecordBatch (wrapping the Float64Array from stage 1) into a fresh Vec<u8> stream buffer.",
    },
    {
      stage: "Rust: response body handoff",
      copies: 0,
      note: "P1's default path: Vec<u8>::leak() to 'static, no further copy, served by reference for the process lifetime. P2/diagnostic/marker paths: freshly owned per request (no leak, since those datasets can change or are one-off) -- effectively a 3rd copy on those paths specifically, not on P1's hot path.",
    },
    {
      stage: "OS/webview: response body into fetch buffer",
      copies: 1,
      note: "An OS-level copy crossing the custom-protocol response into the webview's fetch() ArrayBuffer. Not application code -- inherent to the protocol boundary, not something this spike's code controls or could remove.",
    },
    {
      stage: "JS: apache-arrow Arrow IPC parse",
      copies: 0,
      note: "tableFromIPC wraps the fetched ArrayBuffer in typed-array views; Vector.toArray() returns a Float64Array over the SAME buffer for a single-chunk numeric column (this spike always serializes exactly one RecordBatch). Verified live below, not just asserted from the library's docs.",
    },
    {
      stage: "JS: f64 -> f32 recenter for GPU upload",
      copies: 1,
      note: "p1-loader.ts's fetchAndParse allocates one new Float32Array, subtracting the origin in f64 before narrowing -- the offset-relative technique ADR-003's whole gate rests on. Unavoidable: WebGL2 attribute buffers don't support f64.",
    },
    {
      stage: "GPU: CPU RAM -> VRAM upload",
      copies: 1,
      note: "gl.bufferData (via luma.gl/deck.gl), not counted as an 'avoidable' application copy in the same sense as the others -- physically required to get data onto the GPU at all. Listed for completeness, not as a target for reduction.",
    },
  ];
  const check = await verifyNoCopyAtArrowParse();
  // Correct the audited stage's copy count in place if live reality ever
  // disagrees with the source-read claim, rather than silently reporting
  // a comment as a measurement.
  const parseStage = stages.find((s) => s.stage === "JS: apache-arrow Arrow IPC parse");
  if (parseStage && !check.noCopy) {
    parseStage.copies = 1;
    parseStage.note += " CONTRADICTED BY LIVE CHECK THIS RUN -- toArray() did NOT share the fetch buffer; treat the 0 above as wrong until re-verified.";
  }
  return { stages, verifiedNoCopyAtArrowParse: check.noCopy, datasetBytes: check.datasetBytes };
}

// ---- item 2: throughput ----------------------------------------------------

interface ThroughputRun {
  fetchMs: number;
  mbPerSec: number;
}

async function measureThroughput(runs: number): Promise<{ datasetBytes: number; runs: ThroughputRun[] }> {
  const results: ThroughputRun[] = [];
  let datasetBytes = 0;
  for (let i = 0; i < runs; i++) {
    const { datasetBytes: bytes, fetchMs } = await verifyNoCopyAtArrowParse();
    datasetBytes = bytes;
    const mbPerSec = bytes / 1_000_000 / (fetchMs / 1000);
    results.push({ fetchMs, mbPerSec });
  }
  return { datasetBytes, runs: results };
}

// ---- item 3: cancellation latency ------------------------------------------

const CANCELLATION_TRIALS = 10;
/** Aborted partway through the ~1.5 s full-P1 transfer -- long enough to be genuinely mid-load, short enough every trial's abort() lands before natural completion. */
const ABORT_AFTER_MS = 400;

interface CancellationTrial {
  abortToRejectMs: number | null; // null = fetch resolved before abort landed (excluded, not averaged in)
}

/**
 * Client-side cancellation-acknowledgment latency only. Scope limit, named
 * up front rather than discovered by a reader: Tauri 2.11.5's
 * register_uri_scheme_protocol handler (lib.rs) is a single synchronous
 * closure with no interrupt/cancellation signal (already established by
 * M1.5's streaming diagnostic -- "no lower-level streamed-body API exists
 * in this version"). AbortController stops the *client* from waiting on
 * the response; it cannot and does not stop Rust from having already done
 * the work of generating/serializing the response body. docs/01 principle
 * 7 ("every operation cancellable") is not fully satisfied by this
 * transport for genuinely interrupting backend work -- that gap is this
 * measurement's real finding, not a caveat on an otherwise-clean pass.
 */
async function measureCancellationLatency(trials: number): Promise<CancellationTrial[]> {
  const results: CancellationTrial[] = [];
  for (let i = 0; i < trials; i++) {
    const controller = new AbortController();
    const fetchPromise = fetch("http://p1.localhost/points", { signal: controller.signal });
    // Both branches handled inline (.then AND .catch) so this settling
    // early is never an unhandled rejection once abort() lands later --
    // exactly the bug class Step 0b's standing rule exists to catch, and
    // did catch here during this file's own first test run.
    let resolvedBeforeAbort = false;
    fetchPromise.then(
      () => {
        resolvedBeforeAbort = true;
      },
      () => {
        // Rejected (the expected outcome once controller.abort() runs
        // below) -- nothing to do here, the catch block after abort()
        // handles measuring it.
      },
    );
    await new Promise((resolve) => setTimeout(resolve, ABORT_AFTER_MS));
    if (resolvedBeforeAbort) {
      results.push({ abortToRejectMs: null });
      continue;
    }
    const abortT0 = performance.now();
    controller.abort();
    try {
      await fetchPromise;
      results.push({ abortToRejectMs: null });
    } catch {
      results.push({ abortToRejectMs: performance.now() - abortT0 });
    }
  }
  return results;
}

// ---- item 4: bit-critical scalar IPC encoding + property test -------------

const RANDOM_PATTERNS_PER_BATCH = 10_000;
const RANDOM_BATCHES = 10; // 100,000 random patterns total
const BATCH_TIMEOUT_MS = 30_000;

function randomHexBits(): string {
  const hi = (Math.floor(Math.random() * 0x100000000) >>> 0).toString(16).padStart(8, "0");
  const lo = (Math.floor(Math.random() * 0x100000000) >>> 0).toString(16).padStart(8, "0");
  return hi + lo;
}

/**
 * Named regression cases (the actual values captured during the M4 IPC
 * investigation, README "Precision & write-path correctness" row) plus the
 * IEEE-754 special-value classes the request specified — not just "some
 * random floats", since those are exactly the classes most likely to
 * expose an encoding edge case a purely-random sweep might statistically
 * miss (a canonical NaN is one specific bit pattern out of 2^64).
 *
 * Only 2 distinct value-pairs, not 3: the M4 investigation logged what
 * looked like three separate mismatches (one instrumented bit-pattern
 * capture, plus two decimal-only observations from earlier ad hoc runs),
 * but one of the decimal pairs (2659586.7328628874 / 2659586.732862887)
 * turned out, on computing its actual bits here, to be the exact same
 * easting mismatch the instrumented run already captured — independently
 * reproduced across two different runs, not a third distinct case. Kept
 * as one entry rather than silently padding the count to 3.
 */
function namedSpecialCases(): Record<string, string> {
  return {
    "+0": "0000000000000000",
    "-0": "8000000000000000",
    "+inf": "7ff0000000000000",
    "-inf": "fff0000000000000",
    "canonical NaN": "7ff8000000000000",
    "negative NaN": "fff8000000000000",
    "NaN, minimal payload": "7ff0000000000001",
    "smallest positive subnormal": "0000000000000001",
    "largest subnormal": "000fffffffffffff",
    "observed E-mismatch (sent, independently reproduced in 2 runs)": "41444a815dce737b",
    "observed E-mismatch (received, independently reproduced in 2 runs)": "41444a815dce737a",
    "observed N-mismatch (sent)": f64ToHexBits(1185592.4587547975),
    "observed N-mismatch (received)": f64ToHexBits(1185592.4587547977),
  };
}

async function verifyBatch(patterns: string[]): Promise<{ mismatches: string[]; timedOut: boolean }> {
  const timeout = new Promise<"timeout">((resolve) => setTimeout(() => resolve("timeout"), BATCH_TIMEOUT_MS));
  const result = await Promise.race([invoke<string[]>("verify_bit_roundtrip", { patterns }), timeout]);
  if (result === "timeout") return { mismatches: [], timedOut: true };
  const mismatches: string[] = [];
  for (let i = 0; i < patterns.length; i++) {
    if (result[i].toLowerCase() !== patterns[i].toLowerCase()) mismatches.push(patterns[i]);
  }
  return { mismatches, timedOut: false };
}

interface BitRoundtripResult {
  totalPatterns: number;
  batches: number;
  mismatches: string[];
  timedOutBatches: number;
  specialCaseResults: { label: string; hex: string; roundtripOk: boolean }[];
}

async function propertyTestBitRoundtrip(): Promise<BitRoundtripResult> {
  const special = namedSpecialCases();
  const specialHexes = Object.values(special);
  const { mismatches: specialMismatches } = await verifyBatch(specialHexes);
  const specialCaseResults = Object.entries(special).map(([label, hex]) => ({
    label,
    hex,
    roundtripOk: !specialMismatches.includes(hex),
  }));

  let totalPatterns = specialHexes.length;
  const allMismatches = [...specialMismatches];
  let timedOutBatches = 0;
  for (let b = 0; b < RANDOM_BATCHES; b++) {
    const batch = Array.from({ length: RANDOM_PATTERNS_PER_BATCH }, randomHexBits);
    const { mismatches, timedOut } = await verifyBatch(batch);
    if (timedOut) {
      timedOutBatches++;
      continue;
    }
    totalPatterns += batch.length;
    allMismatches.push(...mismatches);
    appendLog(`bit-roundtrip batch ${b + 1}/${RANDOM_BATCHES}: ${batch.length} patterns, ${mismatches.length} mismatches`);
  }
  return { totalPatterns, batches: RANDOM_BATCHES, mismatches: allMismatches, timedOutBatches, specialCaseResults };
}

/**
 * Re-exercises the ACTUAL fixed path (commit_vertex_edit/resolve_p2_vertex,
 * now on bit-pattern hex strings, not raw f64) live, the same operation the
 * M4 diagnostic notes found unreliable at ~33%. Small N deliberately: this
 * corroborates the property test above against the real code path, it
 * doesn't replace it -- 100,000 live round trips through commit+resolve
 * (each acquiring the P2 mutex) would be a very different, much slower
 * measurement than what this row claims.
 */
async function liveM4PathConfirmation(samples: number): Promise<{ samples: number; allBitExact: boolean; mismatches: number }> {
  let mismatches = 0;
  for (let i = 0; i < samples; i++) {
    // Synthetic but EPSG:2056-plausible values, not just any float -- this
    // exercises the same magnitude range (~10^6) the original failures
    // were observed at, not an arbitrary/unrepresentative one.
    const e = 2_650_000 + Math.random() * 20_000;
    const n = 1_180_000 + Math.random() * 20_000;
    await invoke("commit_vertex_edit", {
      id: 0,
      eBits: f64ToHexBits(e),
      nBits: f64ToHexBits(n),
      crs: "EPSG:2056",
    });
    const resolved = await invoke<{ crs: string; eBits: string; nBits: string }>("resolve_p2_vertex", { id: 0 });
    const resolvedE = hexBitsToF64(resolved.eBits);
    const resolvedN = hexBitsToF64(resolved.nBits);
    if (resolvedE !== e || resolvedN !== n) mismatches++;
  }
  return { samples, allBitExact: mismatches === 0, mismatches };
}

// ---- report shape -----------------------------------------------------

interface M5Report {
  timestamp: string;
  copyAudit: {
    stages: CopyAuditStage[];
    verifiedNoCopyAtArrowParse: boolean;
    datasetBytes: number;
  };
  throughput: {
    datasetBytes: number;
    runs: ThroughputRun[];
    note: string;
  };
  cancellation: {
    trials: number;
    excludedResolvedBeforeAbort: number;
    abortToRejectMsP50: number;
    abortToRejectMsMax: number;
    note: string;
  };
  bitRoundtrip: BitRoundtripResult & {
    liveM4PathConfirmation: { samples: number; allBitExact: boolean; mismatches: number };
    note: string;
  };
}

// ---- orchestration ----------------------------------------------------

export async function runM5(): Promise<void> {
  setStatus("M5: copy-count audit...");
  const copyAudit = await auditCopies();
  appendLog(`copy audit: ${copyAudit.stages.reduce((sum, s) => sum + s.copies, 0)} copies across ${copyAudit.stages.length} stages; apache-arrow no-copy claim verified live: ${copyAudit.verifiedNoCopyAtArrowParse}`);

  setStatus("M5: throughput...");
  const throughput = await measureThroughput(3);
  appendLog(`throughput: ${throughput.runs.map((r) => r.mbPerSec.toFixed(1)).join(", ")} MB/s across ${throughput.runs.length} runs`);

  setStatus("M5: cancellation latency...");
  const cancellationTrials = await measureCancellationLatency(CANCELLATION_TRIALS);
  const validTrials = cancellationTrials.filter((t): t is { abortToRejectMs: number } => t.abortToRejectMs !== null);
  const excludedResolvedBeforeAbort = cancellationTrials.length - validTrials.length;
  const sortedLatencies = validTrials.map((t) => t.abortToRejectMs).sort((a, b) => a - b);
  appendLog(`cancellation: ${validTrials.length}/${cancellationTrials.length} trials measured (${excludedResolvedBeforeAbort} excluded, resolved before abort landed)`);

  setStatus("M5: bit-pattern round-trip property test...");
  const bitRoundtrip = await propertyTestBitRoundtrip();
  appendLog(`bit-roundtrip: ${bitRoundtrip.totalPatterns} patterns, ${bitRoundtrip.mismatches.length} mismatches, ${bitRoundtrip.timedOutBatches} batches timed out`);

  setStatus("M5: live M4-path bit-exactness confirmation...");
  const liveConfirmation = await liveM4PathConfirmation(20);
  appendLog(`live M4 commit/resolve path: ${liveConfirmation.samples} samples, all bit-exact: ${liveConfirmation.allBitExact}`);

  const report: M5Report = {
    timestamp: new Date().toISOString(),
    copyAudit,
    throughput: {
      datasetBytes: throughput.datasetBytes,
      runs: throughput.runs,
      note: "Rust->IPC->JS fetch+arrayBuffer() time only, same fetch verifyNoCopyAtArrowParse uses -- not including Arrow parse (no-copy, ~0ms) or the f64->f32 GPU-upload copy (M1/M4's own frame-time numbers already cover render-path cost).",
    },
    cancellation: {
      trials: cancellationTrials.length,
      excludedResolvedBeforeAbort,
      abortToRejectMsP50: percentile(sortedLatencies, 50),
      abortToRejectMsMax: sortedLatencies.length ? sortedLatencies[sortedLatencies.length - 1] : NaN,
      note: `Client-side AbortController-to-rejection latency only, aborted ${ABORT_AFTER_MS} ms into the ~1.5 s full-P1 fetch. Does NOT measure genuine backend-work interruption: lib.rs's register_uri_scheme_protocol handler is a single synchronous closure (confirmed by reading the source) with no cancellation signal Rust-side, and by the time the client's fetch() call resolves or aborts, generation of the response Rust already computed cannot be un-done. docs/01 principle 7 ("every operation cancellable") is not fully met by this transport for backend interruption -- that gap is the finding, not a caveat on a clean pass.`,
    },
    bitRoundtrip: {
      ...bitRoundtrip,
      liveM4PathConfirmation: liveConfirmation,
      note: "Property test exercises verify_bit_roundtrip (pure hex<->f64 encode/decode through real IPC) at volume; liveM4PathConfirmation separately re-exercises the actual fixed commit_vertex_edit/resolve_p2_vertex path (small N) to corroborate against the specific operation the original bug was found in.",
    },
  };

  console.log("[M5 DATAPLANE REPORT]", report);
  const statsEl = document.querySelector<HTMLPreElement>("#m5-stats");
  if (statsEl) statsEl.textContent = JSON.stringify(report, null, 2);
  setStatus("M5: data-plane audit complete");
  await invoke("log_m5_report", { reportJson: JSON.stringify(report, null, 2) });
  checkpoint("END M5: data-plane audit complete");
}
