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
  openedMs?: number;
  firstBatchMs?: number;
  firstPixelsMs?: number;
  lastPixelsMs?: number;
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

  const stream = startStream({
    token: TOKEN,
    request: { dataset: DATASET },
    sink: {
      onOpen(handle) {
        rec.handle = handle;
        rec.openedMs = performance.now() - t0;
        note(`${label}: open ${handle.streamId}`);
        onOpened?.();
      },
      onBatch(payload, contiguous) {
        const now = performance.now();
        if (rec.firstBatchMs === undefined) rec.firstBatchMs = now - t0;
        const batch = decodeBatch(payload, EXTENT_CRS);
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

async function scenario(): Promise<void> {
  t0 = performance.now();
  const results: Record<string, unknown> = { scenario: 'superseded-query cancel', dataset: DATASET };
  (window as unknown as { __sliceResults: Record<string, unknown> }).__sliceResults = results;

  if (!TOKEN) {
    fail('no session credential in the URL fragment');
    return;
  }

  // Open and authenticate a socket before the first query needs one, so the WebSocket open and the
  // credential handshake leave the per-query path. Still one stream per connection: this holds a
  // spare, it does not multiplex — the wire format carries no stream id, so two live streams on one
  // socket would make CANCEL ambiguous.
  prewarm(TOKEN);

  // ---- S1: a single stream, nothing else running. The within-session baseline. --------------
  note('S1: solo stream');
  const solo = run('solo', STYLES.survivor, () => {});
  await solo.done;
  results.s1_solo = { ...solo.record };
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
