// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * The residency measurement instrument (viewport-residency cut, P1/P1b;
 * `RESIDENCY-PREREGISTRATION.md` §6: "Instruments -- the quantities table"). DEV-ONLY, gated
 * exactly like `e2e-test-surface.ts` (`import.meta.env.DEV`, Vite's literal-`false` replacement for
 * `npm run build`, letting esbuild's minifier dead-code-eliminate every guarded branch -- proven by
 * `npm run build` succeeding and the dist grep this piece's own `check:dist-clean` script runs, not
 * merely claimed here).
 *
 * **Instrument-off is the default, and "off" means ZERO code beyond the flag check.**
 * `RESIDENCY-PREREGISTRATION.md` §8's wire-bytes-identity assertion depends on this literally: only
 * `enableResidencyInstrument` carries its own `import.meta.env.DEV` guard (the one place this
 * module's runtime `enabled` flag can ever become `true`); every other exported mutator below gates
 * on that ALREADY-false-unless-enabled-in-DEV flag alone, so calling any of them before
 * `enableResidencyInstrument` ever ran costs exactly one boolean read and a return -- no timer, no
 * state mutation. Every call site that reaches this module from PRODUCT code (`WorkingCanvas.tsx`,
 * `streaming/viewportStreamManager.ts`, `App.tsx`) is additionally wrapped in its own
 * `if (import.meta.env.DEV)` check at the call site itself -- not merely inside this module -- so a
 * production build's dead-code elimination removes the call, and this module's own code, entirely
 * (the same mechanism that already gets `__SPATIAL_E2E__` to zero dist hits despite
 * `e2e-test-surface.ts` being imported unconditionally at the top of those same files).
 *
 * **P1b reviewer-gate remediation (M1/M2/M3/M6, this file's own share of it):**
 * - **M1.** `firstPixelMs`'s clock now starts at the step's FIRST `recordStreamIssued` (the query
 *   actually issuing), not at `beginStep` -- and the stamp only fires once BOTH a query was issued
 *   AND its first ACCEPTED batch has arrived (`firstBatchArrived`, set by `recordBatch` only on a
 *   non-refused batch) -- never from a render caused by the step's own input gesture alone. A step
 *   with zero streams or zero accepted batches reports `firstPixelMs: null` with an honest
 *   `firstPixelReason` (`"no-query"` / `"no-batch"` / `"no-paint"`), never a gesture-repaint number.
 * - **M2.** `recordBatch` now takes a `refused` boolean and counts decoded-and-accepted
 *   (`batchesReceived`/`featuresDecoded`/`bytesDecoded`) separately from decoded-and-refused
 *   (`batchesRefused`/`featuresRefused`/`bytesRefused`) -- a ceiling-refused batch is no longer
 *   silently dropped from every counter.
 * - **M3.** The old `requestAnimationFrame` loop (`frameTick`) is GONE. `recordFrame` is now driven
 *   exclusively by `WorkingCanvas.tsx`'s own persistent, per-step, timeout-guarded `onAfterRender`
 *   hook (`recordResidencyRenderTick`, called on every REAL deck.gl render while armed) -- so
 *   `frameTimestamps` is a real render/paint series, not an idle rAF tick series that happened to be
 *   mislabeled as one.
 * - **M6.** `recordStreamEnded`/`recordResidencyStreamEnded` pairs with `recordStreamIssued`
 *   (`viewportStreamManager.ts`'s own single terminal call site) to maintain a driver-visible
 *   in-flight stream count (`getResidencyInFlightStreamCount`), so a driver's settle check can
 *   require in-flight === 0, not merely console quiescence.
 *
 * **A measurement SIBLING to `console/recorder.ts`, not an extension of it** (this piece's own
 * instruction) -- same discipline (a subscriber-shaped consumer failing must never break the frame
 * that produced the event it consumes), but a completely separate bounded state machine with no
 * shared storage: the recorder logs requests for display; this module counts and times ONE active
 * camera-trace step at a time for a driver to score OFFLINE -- computed offline by the driver
 * (`residency-harness.mjs`'s own `frameTimeStatsMs`), never in-page: this module only ever records
 * raw per-frame timestamps and raw counters, consistent with §6's table naming these a "client
 * clock"/"client compositor-frame timer" instrument, never a percentile (paraphrase of §6's own
 * framing, not a quotation of it -- corrected here, P1b M4: an earlier version of this comment
 * attributed a fabricated sentence to §6 that does not appear in that section's actual text).
 *
 * The state machine itself is the pure `ResidencyInstrumentCore` class below, exported so
 * `residencyInstrument.test.ts` can drive it directly with synthetic timestamps -- no DOM, no real
 * `requestAnimationFrame`, matching `WorkingCanvas.tsx`'s own established pure-seam precedent
 * (`applyStyleChange`, `summarizePixels`): "DOM-free testability... a pure seam a unit test can
 * actually drive."
 */

export interface ResidencyStepCounters {
  streamsIssued: number;
  /** M6: paired with `streamsIssued` via `viewportStreamManager.ts`'s single terminal call site
   * (`recordResidencyStreamEnded`, at `sink.onTerminal`, before the self-cancel-suppression check --
   * every terminal transition ends a stream's in-flight lifetime, self-cancelled or not). */
  streamsEnded: number;
  /** Decoded-and-ACCEPTED only (M2) -- a batch `ResidentSet.addBatch` actually admitted. */
  batchesReceived: number;
  featuresDecoded: number;
  bytesDecoded: number;
  /** Decoded-and-REFUSED (M2) -- a batch a declared ceiling (`ResidentVertexCeilingExceeded`,
   * `PickCeilingExceeded`) refused. Counted separately from the accepted totals above, never
   * folded in: a refused batch was decoded (the bytes/features numbers are real) but never
   * rendered. */
  batchesRefused: number;
  featuresRefused: number;
  bytesRefused: number;
  /** Placeholder -- the tile concept arrives in P3 (`RESIDENCY-PREREGISTRATION.md` §4d/§9). Always
   * 0 through this piece's own wiring; the field exists now, and `recordTileRequested` below already
   * exists to increment it, so P3 plugs a real per-tile-fetch count in without reshaping this
   * interface or any of its consumers (the driver's evidence-file schema, `endResidencyStep`'s
   * return shape). */
  tilesRequested: number;
}

function zeroCounters(): ResidencyStepCounters {
  return {
    streamsIssued: 0,
    streamsEnded: 0,
    batchesReceived: 0,
    featuresDecoded: 0,
    bytesDecoded: 0,
    batchesRefused: 0,
    featuresRefused: 0,
    bytesRefused: 0,
    tilesRequested: 0,
  };
}

/** S9: an explicit cap on the per-step frame/proxy series, with a `truncated` flag rather than
 * unbounded growth -- a step that somehow never settles (a watchdog-bound trial, §7) must not grow
 * these arrays without limit. Generous relative to any real step's actual render count (a 5s
 * per-step watchdog at even 240 fps is 1200 renders); existing solely as a declared ceiling, per
 * ADR-010 rule 6's "declared, not discovered" discipline this codebase already applies elsewhere
 * (`limits.ts`). */
const MAX_FRAME_TIMESTAMPS = 5000;
const MAX_INPUT_PROXIES = 1000;

export type FirstPixelReason = "no-query" | "no-batch" | "no-paint";

export interface ResidencyStepResult {
  stepId: string;
  counters: ResidencyStepCounters;
  /** M1: ms from the step's FIRST `recordStreamIssued` call to the FIRST `recordFrame` call this
   * instrument observed AFTER the step's first ACCEPTED batch arrived -- `null` if that never
   * happened before `endStep` was called. */
  firstPixelMs: number | null;
  /** M1: present iff `firstPixelMs` is `null`, naming exactly why -- `"no-query"` (zero
   * `recordStreamIssued` calls this step), `"no-batch"` (a query issued but zero ACCEPTED batches
   * arrived), or `"no-paint"` (a query issued and a batch accepted, but no `recordFrame` was
   * observed before `endStep` -- an honest residual case, never silently absorbed into one of the
   * other two). `undefined` when `firstPixelMs` is non-null. */
  firstPixelReason?: FirstPixelReason;
  /** M3: one raw timestamp per REAL render observed while the step was active (`WorkingCanvas.tsx`'s
   * own persistent per-step `onAfterRender` hook, via `recordResidencyRenderTick`) -- p50/p95 are the
   * driver's own job (§6), never computed here. */
  frameTimestamps: number[];
  /** S9: `true` iff `frameTimestamps` hit `MAX_FRAME_TIMESTAMPS` and further renders were observed
   * but not recorded -- an honest cap flag, never a silent truncation. */
  frameTimestampsTruncated: boolean;
  /** One entry per input event whose next render was observed before `endStep` -- each entry is that
   * render's timestamp minus the input event's own timestamp. A PROXY (§6's own "Input-to-present
   * proxy" row: "client clock, pointer/keyboard event -> next composited frame carrying its effect"),
   * not a true present-time measurement -- reported, never gated. **Disclosed divergence from §6's
   * own text (M4, carried into evidence per S13):** this proxy resolves against the NEXT
   * `recordFrame` (a real deck.gl `onAfterRender` fire while armed), not against the browser's own
   * compositor-present event -- deck.gl's `onAfterRender` fires once its WebGL draw call issues,
   * which the browser's compositor may actually present on a later frame boundary than this
   * timestamp reflects, and is only observed for the window between `residencyArmFirstPixel` and
   * `residencyDisarmFirstPixel` (both driver-controlled), not for the app's whole lifetime. */
  inputToPresentProxiesMs: number[];
  /** S9: same truncation discipline as `frameTimestampsTruncated`, for `inputToPresentProxiesMs`. */
  inputToPresentProxiesTruncated: boolean;
}

interface ActiveStep {
  stepId: string;
  counters: ResidencyStepCounters;
  /** M1: the step's own clock origin -- the timestamp of the FIRST `recordStreamIssued` call this
   * step observed, or `null` if none has fired yet. */
  firstStreamIssuedAtMs: number | null;
  /** M1: has this step's first ACCEPTED (non-refused) batch arrived yet. */
  firstBatchArrived: boolean;
  firstPixelMs: number | null;
  frameTimestamps: number[];
  frameTimestampsTruncated: boolean;
  inputToPresentProxiesMs: number[];
  inputToPresentProxiesTruncated: boolean;
  pendingInputAtMs: number | null;
}

/**
 * Pure state machine, no DOM/timer of its own -- `nowMs`/frame ticks are always handed in by the
 * caller (the DEV-only wiring below, or a test's synthetic clock). Every mutator no-ops unless a
 * step is active (`beginStep` was called and `endStep` has not yet consumed it) -- one level below
 * this module's own top-level "off means zero work" discipline: a `recordX` call between `endStep`
 * and the next `beginStep` costs one null check, exactly like a disabled instrument costs one
 * boolean check above.
 */
export class ResidencyInstrumentCore {
  private active: ActiveStep | null = null;

  get isStepActive(): boolean {
    return this.active !== null;
  }

  beginStep(stepId: string, _nowMs: number): void {
    // `_nowMs` kept as a parameter (unused beyond documenting call-time) for API stability with
    // existing callers/tests -- M1 moved the step's own clock origin to the first
    // `recordStreamIssued` timestamp, not `beginStep`'s own argument, so it is no longer stored here.
    this.active = {
      stepId,
      counters: zeroCounters(),
      firstStreamIssuedAtMs: null,
      firstBatchArrived: false,
      firstPixelMs: null,
      frameTimestamps: [],
      frameTimestampsTruncated: false,
      inputToPresentProxiesMs: [],
      inputToPresentProxiesTruncated: false,
      pendingInputAtMs: null,
    };
  }

  /** Ends the active step and returns its snapshot, or `null` if no step was active. Idempotent: a
   * second call before the next `beginStep` returns `null`, never a stale or duplicate snapshot. */
  endStep(): ResidencyStepResult | null {
    if (!this.active) return null;
    const s = this.active;
    this.active = null;

    let firstPixelReason: FirstPixelReason | undefined;
    if (s.firstPixelMs === null) {
      if (s.counters.streamsIssued === 0) {
        firstPixelReason = "no-query";
      } else if (s.counters.batchesReceived === 0) {
        firstPixelReason = "no-batch";
      } else {
        firstPixelReason = "no-paint";
      }
    }

    return {
      stepId: s.stepId,
      counters: s.counters,
      firstPixelMs: s.firstPixelMs,
      firstPixelReason,
      frameTimestamps: s.frameTimestamps,
      frameTimestampsTruncated: s.frameTimestampsTruncated,
      inputToPresentProxiesMs: s.inputToPresentProxiesMs,
      inputToPresentProxiesTruncated: s.inputToPresentProxiesTruncated,
    };
  }

  /** M1: `nowMs` is the moment the query actually issued -- the FIRST call this step observes sets
   * the step's own clock origin (`firstStreamIssuedAtMs`); later calls within the same step only
   * increment the counter. */
  recordStreamIssued(nowMs: number): void {
    if (!this.active) return;
    this.active.counters.streamsIssued++;
    if (this.active.firstStreamIssuedAtMs === null) {
      this.active.firstStreamIssuedAtMs = nowMs;
    }
  }

  /** M6: pairs with `recordStreamIssued` -- one call per terminal transition, whatever its kind
   * (`viewportStreamManager.ts`'s own single call site, `sink.onTerminal`). */
  recordStreamEnded(): void {
    if (!this.active) return;
    this.active.counters.streamsEnded++;
  }

  /** M2: `refused` splits decoded-and-accepted from decoded-and-refused counting. A refused batch
   * never renders anything new, so it never arms `firstBatchArrived` either (M1). */
  recordBatch(features: number, bytes: number, refused: boolean): void {
    if (!this.active) return;
    if (refused) {
      this.active.counters.batchesRefused++;
      this.active.counters.featuresRefused += features;
      this.active.counters.bytesRefused += bytes;
      return;
    }
    this.active.counters.batchesReceived++;
    this.active.counters.featuresDecoded += features;
    this.active.counters.bytesDecoded += bytes;
    this.active.firstBatchArrived = true;
  }

  /** `tilesRequested` placeholder increment -- P3's own extension point (this interface's doc
   * comment). Unreachable from anywhere this piece itself wires. */
  recordTileRequested(): void {
    if (!this.active) return;
    this.active.counters.tilesRequested++;
  }

  /**
   * M3: called once per REAL render observed while a step is active -- `WorkingCanvas.tsx`'s own
   * persistent per-step `onAfterRender` hook, never a `requestAnimationFrame` tick. Three things
   * happen on every call, in order: (1) the render's timestamp is appended to the frame series
   * (S9-capped); (2) any pending input-to-present proxy resolves against THIS render (the FIRST one
   * observed after `recordInput`); (3) M1's first-pixel stamp fires, exactly once, the FIRST time
   * this is called after BOTH a stream has issued and its first accepted batch has arrived --
   * never from a render caused by the step's own input gesture alone, since a gesture-only render
   * (no new batch yet) leaves `firstBatchArrived` false and this stamp does not fire.
   */
  recordFrame(nowMs: number): void {
    if (!this.active) return;
    const s = this.active;

    if (s.frameTimestamps.length < MAX_FRAME_TIMESTAMPS) {
      s.frameTimestamps.push(nowMs);
    } else {
      s.frameTimestampsTruncated = true;
    }

    if (s.pendingInputAtMs !== null) {
      if (s.inputToPresentProxiesMs.length < MAX_INPUT_PROXIES) {
        s.inputToPresentProxiesMs.push(nowMs - s.pendingInputAtMs);
      } else {
        s.inputToPresentProxiesTruncated = true;
      }
      s.pendingInputAtMs = null;
    }

    if (s.firstBatchArrived && s.firstPixelMs === null && s.firstStreamIssuedAtMs !== null) {
      s.firstPixelMs = nowMs - s.firstStreamIssuedAtMs;
    }
  }

  /** Records an input event's timestamp -- resolved into `inputToPresentProxiesMs` by the NEXT
   * `recordFrame` call, per this class's own doc comment. A second input recorded before the pending
   * one resolves overwrites the pending timestamp (only the most recent unresolved input is tracked)
   * -- reported, never gated (§6), so this is not a loss any gate's scoring depends on. */
  recordInput(nowMs: number): void {
    if (!this.active) return;
    this.active.pendingInputAtMs = nowMs;
  }
}

// ---------------------------------------------------------------------------------------
// DEV-only singleton wiring -- the seam every product call site (WorkingCanvas.tsx,
// streaming/viewportStreamManager.ts, App.tsx) reaches, each behind its OWN `import.meta.env.DEV`
// check at the call site (this module's own top doc comment explains why the check is duplicated
// there rather than relied on solely here).
// ---------------------------------------------------------------------------------------

const core = new ResidencyInstrumentCore();
let enabled = false;
/** M6: a driver-visible, session-wide (not step-scoped) in-flight `viewport_query` count -- a
 * request can legitimately still be in flight across a step boundary in principle, so this is not
 * reset by `beginStep`/`endStep`. S3: no-ops (stays untouched) while `enabled` is `false`, exactly
 * like every other counter in this module -- a `--control` run therefore always reads `0` here; a
 * disclosed limitation (this piece's own report), not a silent one. */
let inFlightStreamCount = 0;

export function isResidencyInstrumentEnabled(): boolean {
  return enabled;
}

/** Flips the instrument on. Driver-only in practice (via a dev-only E2E hook `App.tsx` registers) --
 * a no-op, `enabled` staying `false`, outside a dev build, matching `registerE2eHook`'s own guard in
 * `e2e-test-surface.ts`. This is the ONE function in this module that checks `import.meta.env.DEV`
 * itself, since it is the only place `enabled` can ever become `true`. */
export function enableResidencyInstrument(): void {
  if (!import.meta.env.DEV) return;
  enabled = true;
}

/** Flips the instrument off and discards any step in progress. DEV-gated for the same reason
 * `enableResidencyInstrument` is (symmetry; `enabled` is already `false` outside DEV regardless). */
export function disableResidencyInstrument(): void {
  if (!import.meta.env.DEV) return;
  enabled = false;
  // An honest reset -- a disabled instrument tracks nothing, matching every other "off means zero
  // work" mutator in this module; a driver reading this mid-disable sees 0, never a stale count.
  inFlightStreamCount = 0;
  core.endStep();
}

/** Starts a new step -- resets the step-scoped counters/timings. M3: no longer starts any timer or
 * listener of its own (the old `requestAnimationFrame` loop is gone); the frame series is fed
 * exclusively by `recordResidencyRenderTick`, called from `WorkingCanvas.tsx`'s own persistent
 * per-step `onAfterRender` hook, armed separately by the driver via `residencyArmFirstPixel`. */
export function beginResidencyStep(stepId: string): void {
  if (!enabled) return;
  core.beginStep(stepId, performance.now());
}

/** Ends the active step and returns its snapshot -- `null` if the instrument is disabled or no step
 * was active. */
export function endResidencyStep(): ResidencyStepResult | null {
  if (!enabled) return null;
  return core.endStep();
}

export function recordResidencyStreamIssued(): void {
  if (!enabled) return;
  inFlightStreamCount++;
  core.recordStreamIssued(performance.now());
}

/** M6: pairs with `recordResidencyStreamIssued` -- called once per terminal transition
 * (`viewportStreamManager.ts`'s own single call site). */
export function recordResidencyStreamEnded(): void {
  if (!enabled) return;
  inFlightStreamCount = Math.max(0, inFlightStreamCount - 1);
  core.recordStreamEnded();
}

/** M6: driver-visible in-flight `viewport_query` count, read via the `residencyInFlightStreamCount`
 * E2E hook (`App.tsx`). Always `0` while disabled (S3) -- see this module's own `inFlightStreamCount`
 * doc comment for the disclosed control-arm limitation that follows from that. */
export function getResidencyInFlightStreamCount(): number {
  return inFlightStreamCount;
}

/** M2: `refused` is `true` for a batch a declared ceiling refused (nothing was added to residency),
 * `false` for one `ResidentSet.addBatch` actually admitted. */
export function recordResidencyBatch(features: number, bytes: number, refused: boolean): void {
  if (!enabled) return;
  core.recordBatch(features, bytes, refused);
}

/** M3: called from `WorkingCanvas.tsx`'s own persistent per-step `onAfterRender` hook, once per REAL
 * render observed while armed -- replaces the old one-shot `recordResidencyAfterRender` AND the old
 * `requestAnimationFrame`-driven frame-time loop at once (both fed a stamp from a DIFFERENT event;
 * this single call now feeds both concerns from the SAME real render event, `ResidencyInstrumentCore
 * .recordFrame`'s own doc comment has the full mechanism). */
export function recordResidencyRenderTick(): void {
  if (!enabled) return;
  core.recordFrame(performance.now());
}

export function recordResidencyInput(): void {
  if (!enabled) return;
  core.recordInput(performance.now());
}
