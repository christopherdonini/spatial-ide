/**
 * The probe: opens two streams, draws them, supersedes one, and records what happened.
 *
 * ## Declared recovery policy (ADR-010 rule 7)
 *
 * **`none` — fail visibly and terminate.** No retry, no reconnect, no resumption. Global `error` and
 * `unhandledrejection` handlers are installed **unconditionally** and their output is both visible
 * (on the page) and persisted (in `window.__probeLog`, which outlives the run). The M4 forensics are
 * why: every liveness signal stayed healthy while an unhandled `TypeError` had silently killed the
 * session, and only the global handler answered the question.
 *
 * ## What the numbers here are and are not
 *
 * In-situ, single-session, **hypothesis-forming**. No preregistration, no counterbalanced schedule,
 * no replication. They may not be cited in ADR-012 and may not re-open it; they are raw material for
 * the reserved ADR-014. Nothing here is compared with any bake-off figure — the machine drifts
 * between sessions asymmetrically (README §21 Q1 / §22.1), so only within-session comparisons appear.
 */

import { prewarm, startStream } from './adapter-ws.js';
import { decodeBatch, type DecodedBatch } from './geoarrow.js';
import { drawBatch, drawIncompleteBanner, fitViewport, type Viewport } from './render.js';
import { UNKNOWN_TOTAL, type Progress, type StreamHandle, type Terminal } from './transport.js';

interface StreamRecord {
  label: string;
  handle?: StreamHandle;
  batches: number;
  rows: number;
  vertices: number;
  payloadBytes: number;
  /**
   * **The budget's zero.** Taken immediately before `startStream(...)` — the moment the application
   * decides to run this query. `docs/08` says "first pixels < 100 ms after **query start**", and
   * page setup is not query start; see `kernel/PROBE-PREREGISTRATION.md` §1a.
   */
  queryStartMs?: number;
  openedMs?: number;
  firstBatchMs?: number;
  /** `decodeBatch` has returned for batch 0 — the JS decode segment ends here. */
  firstDecodedMs?: number;
  firstPixelsMs?: number;
  lastPixelsMs?: number;
  /** Payload bytes of batch 0 alone, so the progressive first-batch policy is visible in the record. */
  firstBatchBytes?: number;
  terminal?: Terminal;
  /** Batches whose Arrow buffers were views into the delivered bytes rather than realigned copies. */
  batchesSharingWireBuffer: number;
  /** Distinct coordinate-buffer byte offsets seen, for the alignment record. */
  coordByteOffsets: number[];
  reassemblyCopies: number;
  jsonFramesSeen: number;
  envelope?: Record<string, string | undefined>;
}

const log: string[] = [];
(window as unknown as { __probeLog: string[] }).__probeLog = log;

function note(line: string): void {
  log.push(`${performance.now().toFixed(1)} ${line}`);
  const el = document.getElementById('log');
  if (el) el.textContent = log.slice(-24).join('\n');
}

// ADR-010 rule 7: unconditional, visible, persisted. Not conditioned on anything.
window.addEventListener('error', (e) => {
  note(`UNCAUGHT ERROR: ${e.message} @ ${e.filename}:${e.lineno}`);
  fail(`uncaught error: ${e.message}`);
});
window.addEventListener('unhandledrejection', (e) => {
  note(`UNHANDLED REJECTION: ${String(e.reason)}`);
  fail(`unhandled rejection: ${String(e.reason)}`);
});

function fail(reason: string): void {
  const results = (window as unknown as { __sliceResults?: Record<string, unknown> }).__sliceResults;
  if (results) results.failure = reason;
  const el = document.getElementById('status');
  if (el) {
    el.textContent = `FAILED — ${reason}`;
    el.className = 'failed';
  }
}

function emptyRecord(label: string): StreamRecord {
  return {
    label,
    batches: 0,
    rows: 0,
    vertices: 0,
    payloadBytes: 0,
    batchesSharingWireBuffer: 0,
    coordByteOffsets: [],
    reassemblyCopies: 0,
    jsonFramesSeen: 0,
  };
}

const params = new URLSearchParams(location.search);
const DATASET = params.get('dataset') ?? 'parcels';
/**
 * The token is delivered in the URL fragment, which browsers never transmit.
 *
 * It is stripped from the address bar the moment it is read. A fragment left in place lives in the
 * tab's history entry and in whatever session-restore state the browser writes to disk — so
 * ADR-012's threat-model requirement that the production transport "must not write the credential
 * to disk" would be satisfied by the producer and then undone by the consumer.
 */
const TOKEN = location.hash.replace(/^#/, '');
history.replaceState(null, '', location.pathname + location.search);

const canvas = document.getElementById('map') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

/**
 * The dataset's extent, **in the CRS named by `EXTENT_CRS`**. Hardcoded to the fixture's domain
 * because this probe has no metadata endpoint — the control plane that would carry an extent does
 * not exist in this slice.
 *
 * **The CRS travels with it, and is checked against every batch's envelope.** These four numbers
 * are ADR-010 rule 1 row-1 values — authoritative project-CRS coordinates — and rule 1 permits them
 * to cross a boundary *only* carrying CRS identity: "a value that does not carry its space's tag
 * does not leave the module that produced it." Untagged, a dataset in any other projected CRS would
 * be fitted into an LV95-shaped viewport and drawn without complaint, which is the silent-frame
 * error rule 1 exists to prevent. The query path already gets this right (`kernel/src/params.rs`
 * makes the viewport name its own CRS); this is the display path doing the same.
 */
const EXTENT_CRS = params.get('extent_crs') ?? 'EPSG:2056';
const EXTENT: [number, number, number, number] = [
  Number(params.get('xmin') ?? 2_600_000),
  Number(params.get('ymin') ?? 1_200_000),
  Number(params.get('xmax') ?? 2_608_000),
  Number(params.get('ymax') ?? 1_208_000),
];

/**
 * The **query** viewport, which is a different thing from the **display** extent above.
 *
 * Until this existed the `--extent` argument set only the draw transform, so every trial streamed
 * the whole file no matter what extent was passed — and a selectivity figure taken from this probe
 * would have described the full scan three times over. Both sides of the wire already carried a
 * bbox; the page simply never sent one. (`kernel/PROBE-PREREGISTRATION.md` amendment A2.)
 *
 * Absent, the request carries no bbox and the producer streams the whole file.
 */
const QUERY_BBOX = ((): [number, number, number, number] | undefined => {
  const raw = params.get('bbox');
  if (!raw) return undefined;
  const v = raw.split(',').map(Number);
  if (v.length !== 4 || v.some((n) => !Number.isFinite(n))) return undefined;
  return [v[0], v[1], v[2], v[3]];
})();
/** The query bbox's own CRS. It travels with the bbox or the bbox does not travel (ADR-010 rule 1). */
const QUERY_BBOX_CRS = params.get('bbox_crs') ?? EXTENT_CRS;

/** `prewarm=0` skips the pre-warmed socket, so piece 4a can be A/B-ed against itself in one session. */
const PREWARM = params.get('prewarm') !== '0';
/** `scenario=solo` runs one measured stream and stops; the default keeps the supersede scenario. */
const SCENARIO = params.get('scenario') ?? 'supersede';

const view: Viewport = fitViewport(EXTENT, canvas.width, canvas.height);

const STYLES = {
  superseded: { stroke: 'rgba(120,140,170,0.55)', fill: 'rgba(120,140,170,0.10)', lineWidth: 0.5 },
  survivor: { stroke: 'rgba(40,120,190,0.95)', fill: 'rgba(40,120,190,0.14)', lineWidth: 0.6 },
} as const;

const incomplete: string[] = [];
/** Latched so the caller-asserted CRS notice is raised once, not once per batch. */
let assertedNoted = false;

/** Draw a batch inside a rAF and time when the pixels actually landed. */
function drawSoon(batch: DecodedBatch, style: (typeof STYLES)[keyof typeof STYLES], rec: StreamRecord) {
  requestAnimationFrame(() => {
    drawBatch(ctx, batch, view, style);
    const t = performance.now();
    if (rec.firstPixelsMs === undefined) rec.firstPixelsMs = t - t0;
    rec.lastPixelsMs = t - t0;
    if (incomplete.length) drawIncompleteBanner(ctx, incomplete, view);
  });
}

let t0 = 0;

function run(
  label: string,
  style: (typeof STYLES)[keyof typeof STYLES],
  onFirstBatches: (n: number) => void,
  onOpened?: () => void,
): { record: StreamRecord; done: Promise<void>; cancel: () => void } {
  const rec = emptyRecord(label);
  let resolve!: () => void;
  const done = new Promise<void>((r) => (resolve = r));

  // The budget's clock starts here and nowhere else.
  rec.queryStartMs = performance.now() - t0;

  const stream = startStream({
    token: TOKEN,
    request: QUERY_BBOX
      ? { dataset: DATASET, bbox: QUERY_BBOX, bboxCrs: QUERY_BBOX_CRS }
      : { dataset: DATASET },
    sink: {
      onOpen(handle) {
        rec.handle = handle;
        rec.openedMs = performance.now() - t0;
        note(`${label}: open ${handle.streamId}`);
        onOpened?.();
      },
      onBatch(payload, contiguous) {
        const now = performance.now();
        const first = rec.firstBatchMs === undefined;
        if (first) {
          rec.firstBatchMs = now - t0;
          rec.firstBatchBytes = payload.length;
        }
        const batch = decodeBatch(payload, EXTENT_CRS);
        // Stamped after the decode returns, so "bytes arrived" and "bytes are usable" are two
        // instants rather than one. They were one before, and the difference is the JS decode.
        if (first) rec.firstDecodedMs = performance.now() - t0;
        // ADR-015 §3: a consumer can tell a claim from a fact without asking the engine — but only
        // if it looks. A caller-asserted CRS is marked on the canvas the same way a partial layer
        // is, because "someone told us this is LV95" and "the file says so" are different grounds
        // for everything drawn from here on.
        if (batch.envelope.crsSource === 'caller_asserted' && !assertedNoted) {
          assertedNoted = true;
          incomplete.push(
            `CRS ${batch.envelope.crs} was asserted by ${batch.envelope.crsAssertedBy ?? 'a caller'}` +
              ', not read from the file',
          );
        }
        rec.batches += 1;
        rec.rows += batch.features;
        rec.vertices += batch.vertices;
        rec.payloadBytes += payload.length;
        if (batch.sharesWireBuffer) rec.batchesSharingWireBuffer += 1;
        if (!rec.coordByteOffsets.includes(batch.coordByteOffset)) {
          rec.coordByteOffsets.push(batch.coordByteOffset);
        }
        if (!contiguous) rec.reassemblyCopies += 1;
        rec.envelope ??= { ...batch.envelope };
        drawSoon(batch, style, rec);
        onFirstBatches(rec.batches);
      },
      onProgress(p: Progress) {
        if (rec.batches === 1) {
          note(
            `${label}: progress ${p.batches} batches, total ${
              p.total === UNKNOWN_TOTAL ? 'unknown (streaming filter)' : p.total
            }`,
          );
        }
      },
      onTerminal(terminal) {
        rec.terminal = terminal;
        rec.reassemblyCopies = stream.stats.reassemblyCopies;
        rec.jsonFramesSeen = stream.stats.jsonFramesSeen;
        note(`${label}: terminal ${terminal.kind}${terminal.detail ? ` — ${terminal.detail}` : ''}`);
        if (terminal.kind !== 'Completed') {
          // H7 / ADR-010 rule 5: a partial layer is labelled on the canvas, never silently kept.
          incomplete.push(
            `${label}: ${terminal.kind} — partial, ${rec.batches} batches, ${rec.rows} features drawn`,
          );
          requestAnimationFrame(() => drawIncompleteBanner(ctx, incomplete, view));
        }
        resolve();
      },
    },
  });

  return { record: rec, done, cancel: () => stream.cancel() };
}

/**
 * The declared segment decomposition for one trial (`kernel/PROBE-PREREGISTRATION.md` §1a).
 *
 * S1 is deliberately **outside** the budget's clock and is reported anyway, so a reader can see it
 * is not hiding inside the number. The four that are inside must sum to the budget figure, and the
 * driver treats a mismatch beyond 0.5 ms as a declared invalidator: segments that do not sum mean
 * the record describes something other than the run it claims to.
 */
function segments(rec: StreamRecord): Record<string, number | null> {
  const q = rec.queryStartMs;
  const n = (a?: number, b?: number) => (a === undefined || b === undefined ? null : a - b);
  return {
    s1_scenario_to_query_start_ms: q ?? null,
    s2_query_start_to_open_ms: n(rec.openedMs, q),
    s3_open_to_first_bytes_ms: n(rec.firstBatchMs, rec.openedMs),
    s4_first_bytes_to_decoded_ms: n(rec.firstDecodedMs, rec.firstBatchMs),
    s5_decoded_to_first_pixels_ms: n(rec.firstPixelsMs, rec.firstDecodedMs),
    first_pixels_after_query_start_ms: n(rec.firstPixelsMs, q),
    full_payload_after_query_start_ms: n(rec.lastPixelsMs, q),
  };
}

async function scenario(): Promise<void> {
  t0 = performance.now();
  const results: Record<string, unknown> = { scenario: 'superseded-query cancel', dataset: DATASET };
  (window as unknown as { __sliceResults: Record<string, unknown> }).__sliceResults = results;

  if (!TOKEN) {
    fail('no session credential in the URL fragment');
    return;
  }

  results.query = {
    bbox: QUERY_BBOX ?? null,
    bbox_crs: QUERY_BBOX ? QUERY_BBOX_CRS : null,
    display_extent: EXTENT,
    display_extent_crs: EXTENT_CRS,
    prewarm: PREWARM,
    note:
      'the query bbox and the display extent are different things: the display extent is held fixed ' +
      'across query viewports so only the query changes and the draw transform does not',
  };

  if (SCENARIO === 'solo') {
    // One measured stream, run to completion. The supersede scenario below is a different
    // experiment and its second stream would land inside this one's full-payload figure.
    results.scenario = 'preregistered first-pixels trial (solo)';
    if (PREWARM) prewarm(TOKEN);
    note(`trial: solo stream, prewarm=${PREWARM}, bbox=${QUERY_BBOX ? 'yes' : 'none'}`);
    const trial = run('trial', STYLES.survivor, () => {});
    await trial.done;
    // The terminal frame arrives before the last rAF has run. Waiting for one more frame is what
    // makes `lastPixelsMs` mean "the final batch was drawn" rather than "the final batch arrived".
    await new Promise<void>((r) => requestAnimationFrame(() => r()));
    results.trial = { ...trial.record };
    results.segments = segments(trial.record);
    results.admissibility =
      'preregistered: kernel/PROBE-PREREGISTRATION.md, committed before this instrument was built ' +
      'and before any result of this pass was looked at. Within-session only. No throughput claim; ' +
      'nothing here may cite ADR-012.';
    results.done = true;
    const status = document.getElementById('status');
    if (status) {
      status.textContent =
        `trial done — ${trial.record.rows} features, ${trial.record.batches} batches, ` +
        `${trial.record.terminal?.kind}`;
    }
    note('trial complete');
    return;
  }

  // Open and authenticate a socket before the first query needs one, so the WebSocket open and the
  // credential handshake leave the per-query path. Still one stream per connection: this holds a
  // spare, it does not multiplex — the wire format carries no stream id, so two live streams on one
  // socket would make CANCEL ambiguous.
  if (PREWARM) prewarm(TOKEN);

  // ---- S1: a single stream, nothing else running. The within-session baseline. --------------
  note('S1: solo stream');
  const solo = run('solo', STYLES.survivor, () => {});
  await solo.done;
  results.s1_solo = { ...solo.record };
  results.s1_solo_segments = segments(solo.record);
  const soloCompletedMs = solo.record.lastPixelsMs;

  // Clear the canvas between scenarios; a leftover layer would be a stale view.
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  incomplete.length = 0;

  // ---- S2: two streams overlap; the older one is superseded. --------------------------------
  note('S2: superseded + survivor');
  t0 = performance.now();
  let survivorStarted = false;
  let cancelSentMs = 0;

  const superseded = run('superseded', STYLES.superseded, (n) => {
    if (n === 3 && !survivorStarted) {
      survivorStarted = true;
      startSurvivor();
    }
  });

  let survivor: ReturnType<typeof run> | null = null;
  function startSurvivor(): void {
    survivor = run(
      'survivor',
      STYLES.survivor,
      () => {},
      // **The supersede fires the moment the new stream is established, not when its first batch
      // is drawn.** That is what a viewport change actually does — the old query is waste as soon
      // as the new one exists — and it is also the only trigger that reliably catches the old
      // stream *mid-flight*.
      //
      // The first version of this probe waited for the survivor's second batch, and by then the
      // superseded stream had already delivered everything: the survivor's first batch did not
      // arrive for ~2.1 s because this consumer's single main thread was busy decoding and drawing
      // the other stream. That starvation is itself the in-situ finding, and it is recorded below
      // rather than tuned away.
      () => {
        if (cancelSentMs === 0) {
          cancelSentMs = performance.now() - t0;
          note('superseded: cancelling (a new stream superseded it)');
          superseded.cancel();
        }
      },
    );
  }

  await superseded.done;
  if (survivor) await (survivor as ReturnType<typeof run>).done;

  results.s2_overlapped = {
    superseded: { ...superseded.record },
    survivor: survivor ? { ...(survivor as ReturnType<typeof run>).record } : null,
    cancelSentMs,
  };
  results.within_session_note =
    'Comparisons are within this page load only. The machine drifts between sessions asymmetrically (bake-off README §21 Q1 / §22.1), so no figure here may be compared with one from another session or another phase.';
  results.admissibility =
    'hypothesis-forming, not a preregistered measurement; may not be cited in ADR-012 and may not re-open it; raw material for the reserved ADR-014';
  results.solo_completed_ms = soloCompletedMs;
  results.observed_questions_for_adr_014 = [
    'This consumer decodes and draws on the single main thread, so a second stream can be starved by the first regardless of what the transport does. Any concurrency measurement that does not separate the two is measuring the consumer.',
    'The supersede trigger changes the result entirely: cancelling when the new stream opens catches the old one mid-flight, while cancelling after the new stream has drawn anything may catch nothing at all.',
    'Does the N=2 ranking inversion recorded in bake-off §20.8 reproduce with this payload shape and a main-thread consumer?',
  ];
  results.done = true;

  const status = document.getElementById('status');
  if (status) {
    const sv = survivor ? (survivor as ReturnType<typeof run>).record : null;
    status.textContent =
      `done — solo ${solo.record.rows} features; superseded ${superseded.record.batches} batches ` +
      `(${superseded.record.terminal?.kind}); survivor ${sv?.rows ?? 0} features (${sv?.terminal?.kind})`;
  }
  note('scenario complete');
}

scenario().catch((e) => {
  // An async entry point may not terminate silently (ADR-010 rule 7).
  note(`scenario failed: ${String(e)}`);
  fail(String(e));
});
