// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * The residency measurement instrument (viewport-residency cut, P1;
 * `RESIDENCY-PREREGISTRATION.md` §6: "Instruments -- the quantities table"). DEV-ONLY, gated
 * exactly like `e2e-test-surface.ts` (`import.meta.env.DEV`, Vite's literal-`false` replacement for
 * `npm run build`, letting esbuild's minifier dead-code-eliminate every guarded branch -- proven by
 * `npm run build` succeeding and the dist grep this piece's own tests run, not merely claimed here).
 *
 * **Instrument-off is the default, and "off" means ZERO code beyond the flag check.**
 * `RESIDENCY-PREREGISTRATION.md` §8's wire-bytes-identity assertion depends on this literally: only
 * `enableResidencyInstrument` carries its own `import.meta.env.DEV` guard (the one place this
 * module's runtime `enabled` flag can ever become `true`); every other exported mutator below gates
 * on that ALREADY-false-unless-enabled-in-DEV flag alone, so calling any of them before
 * `enableResidencyInstrument` ever ran costs exactly one boolean read and a return -- no listener
 * registered (`beginResidencyStep` never starts a `requestAnimationFrame` loop unless `enabled`), no
 * timer, no state mutation. Every call site that reaches this module from PRODUCT code
 * (`WorkingCanvas.tsx`, `streaming/viewportStreamManager.ts`, `App.tsx`) is additionally wrapped in
 * its own `if (import.meta.env.DEV)` check at the call site itself -- not merely inside this module
 * -- so a production build's dead-code elimination removes the call, and this module's own code,
 * entirely (the same mechanism that already gets `__SPATIAL_E2E__` to zero dist hits despite
 * `e2e-test-surface.ts` being imported unconditionally at the top of those same files).
 *
 * **A measurement SIBLING to `console/recorder.ts`, not an extension of it** (this piece's own
 * instruction) -- same discipline (a subscriber-shaped consumer failing must never break the frame
 * that produced the event it consumes; see `frameTick`'s own try/catch-free design below, which
 * achieves the same inertness structurally, by never calling back into caller-supplied code at all),
 * but a completely separate bounded state machine with no shared storage: the recorder logs
 * requests for display; this module counts and times ONE active camera-trace step at a time for a
 * driver to score OFFLINE (`RESIDENCY-PREREGISTRATION.md` §6: "p50/p95 computed OFFLINE by the
 * driver, never in-page").
 *
 * The state machine itself is the pure `ResidencyInstrumentCore` class below, exported so
 * `residencyInstrument.test.ts` can drive it directly with synthetic timestamps -- no DOM, no real
 * `requestAnimationFrame`, matching `WorkingCanvas.tsx`'s own established pure-seam precedent
 * (`applyStyleChange`, `summarizePixels`): "DOM-free testability... a pure seam a unit test can
 * actually drive."
 */

export interface ResidencyStepCounters {
  streamsIssued: number;
  batchesReceived: number;
  featuresDecoded: number;
  bytesDecoded: number;
  /** Placeholder -- the tile concept arrives in P3 (`RESIDENCY-PREREGISTRATION.md` §4d/§9). Always
   * 0 through this piece's own wiring; the field exists now, and `recordTileRequested` below already
   * exists to increment it, so P3 plugs a real per-tile-fetch count in without reshaping this
   * interface or any of its consumers (the driver's evidence-file schema, `endResidencyStep`'s
   * return shape). */
  tilesRequested: number;
}

function zeroCounters(): ResidencyStepCounters {
  return { streamsIssued: 0, batchesReceived: 0, featuresDecoded: 0, bytesDecoded: 0, tilesRequested: 0 };
}

export interface ResidencyStepResult {
  stepId: string;
  counters: ResidencyStepCounters;
  /** ms from `beginStep(stepId, nowMs)` to the first `recordAfterRender` this instrument observed
   * during the step, or `null` if none fired before `endStep` was called. */
  firstPixelMs: number | null;
  /** One raw timestamp per frame observed while the step was active (`recordFrame`'s own `nowMs`
   * argument) -- p50/p95 are the driver's job (§6), never computed here. */
  frameTimestamps: number[];
  /** One entry per input event whose next frame was observed before `endStep` -- each entry is that
   * frame's timestamp minus the input event's own timestamp. Named a PROXY throughout (§6): "the
   * rAF-after-present timestamp," not a true present-time measurement -- reported, never gated. */
  inputToPresentProxiesMs: number[];
}

interface ActiveStep {
  stepId: string;
  startedAtMs: number;
  counters: ResidencyStepCounters;
  firstPixelMs: number | null;
  firstPixelArmed: boolean;
  frameTimestamps: number[];
  inputToPresentProxiesMs: number[];
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

  beginStep(stepId: string, nowMs: number): void {
    this.active = {
      stepId,
      startedAtMs: nowMs,
      counters: zeroCounters(),
      firstPixelMs: null,
      firstPixelArmed: true,
      frameTimestamps: [],
      inputToPresentProxiesMs: [],
      pendingInputAtMs: null,
    };
  }

  /** Ends the active step and returns its snapshot, or `null` if no step was active. Idempotent: a
   * second call before the next `beginStep` returns `null`, never a stale or duplicate snapshot. */
  endStep(): ResidencyStepResult | null {
    if (!this.active) return null;
    const s = this.active;
    this.active = null;
    return {
      stepId: s.stepId,
      counters: s.counters,
      firstPixelMs: s.firstPixelMs,
      frameTimestamps: s.frameTimestamps,
      inputToPresentProxiesMs: s.inputToPresentProxiesMs,
    };
  }

  recordStreamIssued(): void {
    if (!this.active) return;
    this.active.counters.streamsIssued++;
  }

  recordBatch(features: number, bytes: number): void {
    if (!this.active) return;
    this.active.counters.batchesReceived++;
    this.active.counters.featuresDecoded += features;
    this.active.counters.bytesDecoded += bytes;
  }

  /** `tilesRequested` placeholder increment -- P3's own extension point (this interface's doc
   * comment). Unreachable from anywhere this piece itself wires. */
  recordTileRequested(): void {
    if (!this.active) return;
    this.active.counters.tilesRequested++;
  }

  /** Called from the one-shot `onAfterRender` hook `WorkingCanvas.tsx` arms per step (reusing
   * `capturePixels`' own pattern -- see that file's doc comment on this module). One-shot per step:
   * `firstPixelArmed` only ever fires once, the FIRST render observed after `beginStep`. */
  recordAfterRender(nowMs: number): void {
    if (!this.active) return;
    if (this.active.firstPixelArmed) {
      this.active.firstPixelArmed = false;
      this.active.firstPixelMs = nowMs - this.active.startedAtMs;
    }
  }

  /** Called on every animation frame while a step is active -- the frame-time series (§6), p50/p95
   * computed offline by the driver. Also resolves any pending input-to-present proxy (below): the
   * FIRST frame observed after a recorded input is that input's proxy latency. */
  recordFrame(nowMs: number): void {
    if (!this.active) return;
    this.active.frameTimestamps.push(nowMs);
    if (this.active.pendingInputAtMs !== null) {
      this.active.inputToPresentProxiesMs.push(nowMs - this.active.pendingInputAtMs);
      this.active.pendingInputAtMs = null;
    }
  }

  /** Records an input event's timestamp -- resolved into `inputToPresentProxiesMs` by the NEXT
   * `recordFrame` call, per this class's own "rAF-after-present timestamp" proxy definition. A
   * second input recorded before the pending one resolves overwrites the pending timestamp (only
   * the most recent unresolved input is tracked) -- reported, never gated (§6), so this is not a
   * loss any gate's scoring depends on. */
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
let rafHandle: number | null = null;

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

/** Flips the instrument off and discards any step in progress -- also stops the frame loop
 * (`stopFrameLoop`), so a disabled instrument truly registers nothing, matching `beginResidencyStep`
 * never starting one in the first place. DEV-gated for the same reason `enableResidencyInstrument`
 * is (symmetry; `enabled` is already `false` outside DEV regardless). */
export function disableResidencyInstrument(): void {
  if (!import.meta.env.DEV) return;
  enabled = false;
  stopFrameLoop();
  core.endStep();
}

function stopFrameLoop(): void {
  if (rafHandle !== null) {
    cancelAnimationFrame(rafHandle);
    rafHandle = null;
  }
}

function frameTick(nowMs: number): void {
  if (!enabled || !core.isStepActive) {
    rafHandle = null;
    return;
  }
  core.recordFrame(nowMs);
  rafHandle = requestAnimationFrame(frameTick);
}

/** Starts a new step -- resets the step-scoped counters/timings and arms the frame-time loop (a
 * no-op if a loop from a still-active previous step is somehow already running; `endResidencyStep`
 * is expected to be called before the next `beginResidencyStep`, but this guards the loop identity
 * regardless rather than leaking a second one). A disabled instrument never starts the loop at all
 * -- this is the "no listener is ever registered" half of this module's own top doc comment. */
export function beginResidencyStep(stepId: string): void {
  if (!enabled) return;
  core.beginStep(stepId, performance.now());
  if (rafHandle === null) {
    rafHandle = requestAnimationFrame(frameTick);
  }
}

/** Ends the active step, stops the frame loop (a fresh `beginResidencyStep` restarts it), and
 * returns the step's snapshot -- `null` if the instrument is disabled or no step was active. */
export function endResidencyStep(): ResidencyStepResult | null {
  if (!enabled) return null;
  stopFrameLoop();
  return core.endStep();
}

export function recordResidencyStreamIssued(): void {
  if (!enabled) return;
  core.recordStreamIssued();
}

export function recordResidencyBatch(features: number, bytes: number): void {
  if (!enabled) return;
  core.recordBatch(features, bytes);
}

export function recordResidencyAfterRender(): void {
  if (!enabled) return;
  core.recordAfterRender(performance.now());
}

export function recordResidencyInput(): void {
  if (!enabled) return;
  core.recordInput(performance.now());
}
