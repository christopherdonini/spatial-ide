import { useCallback, useEffect, useRef, useState } from "react";

import AdmissionPanel from "./admission/AdmissionPanel";
import { Admitted } from "./admission/admitDataset";
import { FormattedRefusal, formatRefusal } from "./admission/formatRefusal";
import type { AuthoritativeBbox } from "./canvas/viewportBbox";
import WorkingCanvas, { WorkingCanvasHandle } from "./canvas/WorkingCanvas";
import type { PickResult } from "./canvas/pick";
import { logSessionEvent } from "./diagnostics/log";
import FilterPanel from "./filter/FilterPanel";
import { predicateTextToFilter } from "./filter/predicateInput";
import { registerE2eHook, unregisterE2eHook } from "./e2e-test-surface";
import { DEFAULT_STYLE_STATE } from "./style/document";
import type { StyleState } from "./style/document";
import { Debounced, debounce } from "./streaming/debounce";
import type { Terminal } from "./streaming/transport";
import ErrorBanner from "./ErrorBanner";
import { encodeHexF64 } from "./skp/codec";
import { closeDataset, SkpCallError } from "./skp/client";
import type { Bbox, Filter } from "./skp/types";
import {
  RequestOutcome,
  VIEWPORT_QUERY_MIN_INTERVAL_MS,
  ViewportStreamManager,
  ViewportStreamManagerOptions,
} from "./streaming/viewportStreamManager";

function toWireBbox(bbox: AuthoritativeBbox): Bbox {
  return {
    xmin: encodeHexF64(bbox.xmin),
    ymin: encodeHexF64(bbox.ymin),
    xmax: encodeHexF64(bbox.xmax),
    ymax: encodeHexF64(bbox.ymax),
  };
}

/**
 * D4's stale-banner fix, isolated from React rendering: every `App`-level piece of UI state that
 * names something about the *previous* dataset (a canvas refusal, a viewport refusal, a hover
 * readout naming a feature id) is cleared before the new `Admitted` value is adopted. Exported and
 * parameterized over explicit setters (not a closure over `App`'s own hooks) so `App.test.ts` can
 * assert this exact sequencing directly -- see `handleAdmitted`'s doc comment in `App` for why a
 * full `<App />` render is not a practical way to test it here.
 */
export function admitAndResetStaleUiState(
  next: Admitted,
  setters: {
    setCanvasRefusal: (value: string | null) => void;
    setViewportRefusal: (value: FormattedRefusal | null) => void;
    setHover: (value: PickResult | null) => void;
    setResidencyStatus: (value: ResidencyStatus | null) => void;
    /** NEXT-CUT.md (filter-panel cut) design section: "Dataset change clears the filter via
     * `admitAndResetStaleUiState`." A predicate scoped to one dataset's columns must never ride
     * into the next dataset's first query -- the same D4 class of staleness this function already
     * closes for a refusal/hover/status. Expected to write BOTH `activeFilter` render state and
     * `activeFilterRef.current` (see `App`'s own `commitActiveFilter`), since the ref is what every
     * issue site actually reads. */
    setActiveFilter: (value: Filter | null) => void;
    /** `lastViewportBboxRef.current` -- a bbox scoped to the previous dataset's own CRS/extent
     * space is exactly the kind of untagged carryover ADR-010 rule 1 forbids (the same reasoning
     * `App`'s own `<WorkingCanvas key={admitted.dataset}>` remount comment states for canvas-side
     * refs); a fresh dataset starts with no "current viewport" of its own yet. */
    setLastViewportBbox: (value: Bbox | null) => void;
    /** NEXT-CUT.md P4: the scan-liveness machine is App-owned (rendered in both `FilterPanel` and
     * the canvas status stack's `.scan-incomplete`), so it needs the identical D4-class reset every
     * other piece of per-dataset UI state already gets here -- a `.scan-incomplete` naming one
     * dataset's cancelled scan must not survive into the next dataset's UI. */
    setScanState: (value: ScanState) => void;
    setAdmitted: (value: Admitted) => void;
  }
): void {
  setters.setCanvasRefusal(null);
  setters.setViewportRefusal(null);
  setters.setHover(null);
  // A status naming one dataset's row counts must never survive into another's UI -- the same D4
  // class of bug rider 1 (DECISIONS-PENDING.md entry 0, option (a)) explicitly calls out ("It
  // clears when ... (b) the dataset changes").
  setters.setResidencyStatus(nextResidencyStatus({ kind: "dataset-changed" }));
  setters.setActiveFilter(null);
  setters.setLastViewportBbox(null);
  setters.setScanState({ kind: "idle" });
  setters.setAdmitted(next);
}

/**
 * `requestViewport`'s single-retry-on-throttled wrapper (NEXT-CUT.md filter-panel-cut design
 * section: "On `throttled` from a user click: ONE retry after `VIEWPORT_QUERY_MIN_INTERVAL_MS`,
 * then a neutral 'not applied — try again'"). Pure over an injected `attempt` (the caller has
 * already bound whatever bbox/filter this particular call needs) and an injected `wait` (real
 * `setTimeout` in production; a zero-delay or fake-timer-driven stub in tests) so the retry timing
 * itself is directly assertable without a DOM. Resolves `attempt()`'s own `RequestOutcome`
 * unchanged on anything but a first-attempt `"throttled"` -- exactly ONE retry, never a loop: a
 * second `"throttled"` is returned as-is, for the caller to treat as "not applied".
 */
export async function requestViewportWithSingleRetry(
  attempt: () => Promise<RequestOutcome>,
  wait: (ms: number) => Promise<void> = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
): Promise<RequestOutcome> {
  const first = await attempt();
  if (first.kind !== "throttled") {
    return first;
  }
  await wait(VIEWPORT_QUERY_MIN_INTERVAL_MS);
  return attempt();
}

/**
 * `applyFilter`'s own outcome -- deliberately NOT `RequestOutcome` itself: `"applied"` is a
 * narrower claim (an issued mint whose filter this call itself supplied, now committed as
 * `activeFilter`), and a refusal is reported here as structured `FormattedRefusal` (the same shape
 * `viewportRefusal`/`AdmissionPanel`'s refusal block already render), not a raw `SkpCallError` a
 * caller would have to catch.
 */
export type ApplyFilterOutcome =
  | { kind: "applied"; streamHandle: string }
  /** Neither a refusal nor a mint -- throttled twice, superseded, or issued after `stop()`. The
   * neutral "not applied — try again" the design section names; `activeFilter` is untouched. */
  | { kind: "not-applied" }
  | { kind: "refused"; refusal: FormattedRefusal };

export interface ApplyFilterDeps {
  /** Bound to the live manager's `requestViewport`, over a bbox/filter pair THIS function supplies
   * -- never a closure this function builds itself, so a test can substitute a bare mock with no
   * manager/dataset/transport at all. */
  requestViewport: (bbox: Bbox | null, filter: Filter | null) => Promise<RequestOutcome>;
  /** `Debounced.cancel` for the pan/zoom debounce -- called FIRST, before anything else (design
   * section (a): "else a scheduled pan fires 120ms later and silently reverts the filter"). */
  cancelPendingDebounce: () => void;
  /** `lastViewportBboxRef.current` AT ISSUE TIME -- read ONLY by the refusal-recovery re-issue below
   * (human-approved design revision, 2026-08-15 walkthrough Part E E5: the PRIMARY attempt no longer
   * reads this at all, see `applyFilter`'s own doc comment). `null` until the first settled view, in
   * which case the recovery applies over the whole dataset (`bbox: null`), the same shape the
   * initial unfiltered load already uses. */
  getLastViewportBbox: () => Bbox | null;
  /** `activeFilterRef.current` AT ISSUE TIME -- also doubles as "the last successfully-issued
   * filter" for the refusal-recovery re-issue below, since this ref is only ever written by
   * `commitActiveFilter`, which nothing in this function calls before a mint actually succeeds. */
  getActiveFilter: () => Filter | null;
  /** Writes BOTH `activeFilterRef.current` (synchronously, so the very next issue site reads the
   * new value) and the `activeFilter` render state -- called ONLY when `newFilter` itself mints. */
  commitActiveFilter: (filter: Filter | null) => void;
  /** Human-approved design revision, 2026-08-15 walkthrough Part E, E5 finding: "Apply behaves
   * exactly like opening a dataset." A new filter GENERATION (any Apply or Clear that actually
   * issues) must reset `WorkingCanvas`'s fit anchor and one-shot auto-fit
   * (`WorkingCanvasHandle.resetFitForNewGeneration`) so the camera lands on the filtered matches the
   * same way it already lands on a freshly-opened dataset's own first batch -- called ONLY alongside
   * `commitActiveFilter` above, i.e. only on a real issued outcome, never on a refusal/not-applied. */
  resetFitForNewGeneration: () => void;
  wait?: (ms: number) => Promise<void>;
}

/**
 * Apply = supersede immediately (NEXT-CUT.md design section). `activeFilter` is assigned ONLY on an
 * ISSUED outcome for `newFilter` itself -- a refusal or a throttled-after-retry never becomes state
 * (design item 3).
 *
 * **The primary attempt issues `bbox: null` -- an unrestricted first look, never
 * `getLastViewportBbox()`** (human-approved design revision, 2026-08-15 walkthrough Part E, E5
 * finding: the operator applied a late-matching predicate on the slow fixture and the matches were
 * unfindable -- they lived at the grid's far top, off the viewport the UNFILTERED first look
 * happened to leave the camera at, because the filtered query had been carrying that same stale
 * viewport bbox forward. "A filter asks WHERE the matches are" -- Apply (and Clear, which is simply
 * Apply with `newFilter: null`, the SAME code path) now behaves exactly like opening a dataset: an
 * unrestricted look, camera re-fit on the first batch (see `resetFitForNewGeneration` below). Pan/
 * zoom-driven queries are UNCHANGED -- they still carry the current viewport bbox + whatever filter
 * is active, via `makeDebouncedViewportQuery`'s own existing body, not this function.
 *
 * On a refusal, the "typo-blanks-canvas fix": the refusing attempt already superseded and cleared
 * residency (`ViewportStreamManager`'s own supersede-before-mint order), so this re-issues the LAST
 * successfully-issued query -- `getActiveFilter()` over `getLastViewportBbox()` -- through the
 * identical retry helper, recovering the canvas to what was actually showing before. **The recovery
 * keeps its EXISTING semantics, unchanged by this revision**: it restores the last real view, not a
 * fresh unrestricted look, so it deliberately still reads `getLastViewportBbox()`. That recovery
 * predicate is already-admitted (it minted once before), so it cannot itself be refused on filter
 * grounds (design item 3's own claim) -- its outcome is not otherwise reported here, since this
 * function's own `ApplyFilterOutcome` is about `newFilter`'s fate, not the recovery's.
 */
export async function applyFilter(newFilter: Filter | null, deps: ApplyFilterDeps): Promise<ApplyFilterOutcome> {
  deps.cancelPendingDebounce();

  let outcome: RequestOutcome;
  try {
    outcome = await requestViewportWithSingleRetry(() => deps.requestViewport(null, newFilter), deps.wait);
  } catch (e) {
    if (e instanceof SkpCallError) {
      // NEXT-CUT.md P6 review, B2 (blocking): format the user's OWN refusal FIRST, before the
      // recovery attempt runs at all -- the recovery is a best-effort canvas restore, never part of
      // this function's contract with its caller. Recovery wrapped in its own try/catch: a non-filter
      // rejection there (too_many_pending_streams, a transport failure, the dataset having since
      // closed) must never blank the refusal the user's own typed predicate actually earned, nor
      // surface as an unrelated global banner for a query they never made. Logged, not silently
      // dropped (ADR-010 rule 8), and not re-thrown -- a caller awaiting `applyFilter` has no way to
      // distinguish "your predicate was refused" from "the internal recovery attempt also failed" if
      // this propagated, and only the former is this function's own claim to make.
      const refusal = formatRefusal(e.skpError);
      try {
        await requestViewportWithSingleRetry(
          () => deps.requestViewport(deps.getLastViewportBbox(), deps.getActiveFilter()),
          deps.wait
        );
      } catch (recoveryError) {
        logSessionEvent(
          "filter-recovery-failed",
          `re-issuing the last successfully-issued query after a refused Apply also failed: ${
            recoveryError instanceof Error ? recoveryError.message : String(recoveryError)
          }`
        );
      }
      return { kind: "refused", refusal };
    }
    throw e; // an unexpected failure still reaches the ADR-010 rule 7 handlers
  }

  if (outcome.kind === "issued") {
    deps.commitActiveFilter(newFilter);
    deps.resetFitForNewGeneration();
    return { kind: "applied", streamHandle: outcome.streamHandle };
  }
  return { kind: "not-applied" };
}

/**
 * The pan/zoom-driven debounced query body (`App`'s own `[admitted]` effect wires this into
 * `debounce(...)`). Reads `activeFilterRef.current` INSIDE this closure -- i.e. at FIRE time, never
 * captured as an argument when `Debounced.call()` is invoked -- so a filter Apply landing between a
 * pan's `debounced.call()` and its settle-fire is what this closure actually issues, never silently
 * overridden by whatever filter was active when the pan started (design item 1: "the debounced
 * pan/zoom closure reads it INSIDE the debounced body ... kills the stale-arg class"). Exported and
 * parameterized purely so `App.test.ts` can drive it through the real `debounce()` module and assert
 * that ordering property directly, without a DOM.
 */
export function makeDebouncedViewportQuery(
  requestViewport: (bbox: Bbox, bboxCrs: string | null, filter: Filter | null) => Promise<RequestOutcome>,
  activeFilterRef: { current: Filter | null },
  reportOutcome: (promise: Promise<RequestOutcome>) => void
): (bbox: Bbox, bboxCrs: string | null) => void {
  return (bbox, bboxCrs) => {
    reportOutcome(requestViewport(bbox, bboxCrs, activeFilterRef.current));
  };
}

/**
 * Rider 1's persistent ceiling-refusal status ("N of M features rendered — declared ceiling
 * reached (MAX_RESIDENT_VERTICES)"), or `null` while nothing about the current dataset's rendering
 * is truncated.
 */
export interface ResidencyStatus {
  residentFeatureCount: number;
  /** `describe.row_count.value` verbatim (a `DecU64` string) -- never narrowed to `Number`, the
   * same discipline `skp/codec.ts`'s own doc comment states for every wire `DecU64`. */
  datasetRowCount: string;
}

/**
 * Rider 1's status-indicator state machine, kept pure and outside React state updates for the same
 * testability reason `admitAndResetStaleUiState` above is: `App.test.ts` asserts every transition
 * here directly, without a DOM/WebGL harness this package does not carry.
 *
 * - `"ceiling-refusal"`: a batch was refused by `ResidentVertexCeilingExceeded` -- (re)sets the
 *   status to the counts that refusal carried.
 * - `"delivery-complete"`: a stream's own natural `Completed` terminal reached `App` -- the human's
 *   own words, "a later stream completes fully without a ceiling refusal" (a stream this session
 *   itself cancelled for hitting the ceiling never reaches this event: `ViewportStreamManager`
 *   suppresses the terminal of any stream it cancelled itself, whatever that terminal's `kind` --
 *   see its own `selfCancelledHandles` doc comment).
 * - `"dataset-changed"`: a fresh admission -- unconditional clear, wired through
 *   `admitAndResetStaleUiState` above.
 *
 * Dismissing the `.canvas-refusal` banner is deliberately NOT a transition here -- rider 1, the
 * human's words: "dismiss hides the banner, never the status indicator". The banner's Dismiss
 * button only ever calls `setCanvasRefusal(null)`, never touching this state.
 */
export function nextResidencyStatus(
  event:
    | { kind: "ceiling-refusal"; residentFeatureCount: number; datasetRowCount: string }
    | { kind: "delivery-complete" }
    | { kind: "dataset-changed" }
    /** Rider-1 refinement (DECISIONS-PENDING.md entry 1, architect recommendation, approved to
     * proceed): applying a filter supersedes and clears the canvas exactly as a dataset change or a
     * full delivery does -- a stale "N of M features rendered" claim must not survive a query the
     * operator themselves just superseded. Named in DECISIONS-PENDING.md and the PR per the human's
     * own rider being amended here, not silently absorbed. */
    | { kind: "query-issued" }
): ResidencyStatus | null {
  switch (event.kind) {
    case "ceiling-refusal":
      return { residentFeatureCount: event.residentFeatureCount, datasetRowCount: event.datasetRowCount };
    case "delivery-complete":
    case "dataset-changed":
    case "query-issued":
      return null;
  }
}

/**
 * NEXT-CUT.md (filter-panel cut) P4, ADR-021's binding acceptance condition: "before any user-facing
 * filter UI ships, the panel must present liveness and a working cancel affordance during zero-batch
 * filtered scans." This is the pure state machine behind that affordance, kept outside React state
 * updates for the same testability reason `nextResidencyStatus` above is (`App.test.ts` asserts every
 * transition directly, no DOM).
 *
 * `idle -> issuing -> open-no-rows -> delivering(rows) -> {complete | cancelled(rows) | failed}`.
 * Every non-`idle` state carries the `streamHandle` it belongs to. A fresh `issued` event ALWAYS
 * supersedes whatever this machine was previously tracking (mirrors `ViewportStreamManager
 * .requestViewport`'s own supersede-on-issue semantics) -- exactly one scan is tracked at a time,
 * matching P4 item 6's indicator scope ("EVERY in-flight viewport stream", not filter-only). Every
 * OTHER event checks the state it would apply to still carries a matching (or any, for `batch`/
 * `completed`/`failed`/`cancelledByUser`) `streamHandle` before acting, so a late event for a stream
 * this machine is no longer tracking is a no-op -- the concrete form of P4 binding note 6, "a
 * cancelled stream's terminal never reaches App": once `cancelledByUser` has already moved this
 * machine to `cancelled`, nothing (a late `streamOpened`, a late `batch`, an eventual `completed` that
 * `ViewportStreamManager` suppresses anyway) can move it off that state except a fresh `issued`.
 */
export type ScanState =
  | { kind: "idle" }
  | { kind: "issuing"; streamHandle: string }
  | { kind: "open-no-rows"; streamHandle: string }
  | { kind: "delivering"; streamHandle: string; rows: number }
  | { kind: "complete"; streamHandle: string }
  | { kind: "cancelled"; streamHandle: string; rows: number }
  | { kind: "failed"; streamHandle: string };

/**
 * Inputs named by NEXT-CUT.md P4 item 1, verbatim: "issued(handle), streamOpened(handle),
 * batch(rows cumulative), completed, failed, cancelledByUser". `batch`'s `rows` is the CUMULATIVE
 * count for the currently-tracked stream, computed by the caller (`App.tsx`'s own effect-local
 * `scanRowsAccumulator`, below) -- this machine only ever records the running total it is handed, it
 * never sums deltas itself. `reset` is this file's own addition (not one of the six named inputs):
 * dataset change clears this the same way it clears `activeFilter`/`residencyStatus`.
 *
 * `cancelledByUser` carries a `streamHandle` (P6 review, should-fix 1) -- mirrors `streamOpened`'s
 * own shape/guard: the Cancel call site must not be able to mark a FRESHLY-issued stream cancelled
 * while actually killing an old, already-superseded handle (a render-scope staleness risk the fix
 * closes both here, structurally, and at the call site, via `scanStateRef`).
 */
export type ScanEvent =
  | { kind: "issued"; streamHandle: string }
  | { kind: "streamOpened"; streamHandle: string }
  | { kind: "batch"; rows: number }
  | { kind: "completed" }
  | { kind: "failed" }
  | { kind: "cancelledByUser"; streamHandle: string }
  | { kind: "reset" };

export function nextScanState(state: ScanState, event: ScanEvent): ScanState {
  switch (event.kind) {
    case "issued":
      return { kind: "issuing", streamHandle: event.streamHandle };
    case "streamOpened":
      // Mirrors `ViewportStreamManager`'s own late-TAG_OPEN guard: a `streamOpened` for a handle
      // this machine is not currently `issuing` for (superseded, or already moved on) is dropped.
      if (state.kind !== "issuing" || state.streamHandle !== event.streamHandle) {
        return state;
      }
      return { kind: "open-no-rows", streamHandle: state.streamHandle };
    case "batch":
      if (state.kind !== "open-no-rows" && state.kind !== "delivering") {
        return state;
      }
      return { kind: "delivering", streamHandle: state.streamHandle, rows: event.rows };
    case "completed":
      // `!isScanInFlight(state)` (declared below -- hoisted, so callable here) covers exactly
      // {idle, complete, cancelled, failed}, i.e. everything that is NOT {issuing, open-no-rows,
      // delivering}; the complement is also what lets TypeScript narrow `state.streamHandle` below.
      return !isScanInFlight(state) ? state : { kind: "complete", streamHandle: state.streamHandle };
    case "failed":
      return !isScanInFlight(state) ? state : { kind: "failed", streamHandle: state.streamHandle };
    case "cancelledByUser": {
      // "Transitions AT THE CANCEL CALL SITE" (P4 binding note 6) -- this function does not itself
      // know when it is called, only that IF it is called while a scan is tracked, it moves straight
      // to `cancelled` without waiting for any terminal (which, for a self-cancelled stream, never
      // arrives -- `ViewportStreamManager`'s own `selfCancelledHandles`). Guarded on `streamHandle`
      // (P6 review, should-fix 1) exactly like `streamOpened` above: a cancel meant for a handle this
      // machine is no longer tracking (superseded by a fresher `issued` already) is a no-op, never a
      // wrong-stream cancellation.
      if (!isScanInFlight(state) || state.streamHandle !== event.streamHandle) {
        return state;
      }
      const rows = state.kind === "delivering" ? state.rows : 0;
      return { kind: "cancelled", streamHandle: state.streamHandle, rows };
    }
    case "reset":
      return { kind: "idle" };
  }
}

/** The three in-flight sub-states, as a type -- lets `isScanInFlight` below actually narrow
 * `scanState` at its call sites (`App.tsx`'s Cancel handler reads `.streamHandle` right after the
 * guard; a plain `boolean` return would not let TypeScript prove that field exists there). */
type InFlightScanState = Extract<ScanState, { kind: "issuing" | "open-no-rows" | "delivering" }>;

/** Cancel's own visibility -- ZERO delay, never gated by `SCAN_LIVENESS_DELAY_MS` below (P4 items
 * 2 and 7: "Cancel appears with ZERO delay"). */
export function isScanInFlight(state: ScanState): state is InFlightScanState {
  return state.kind === "issuing" || state.kind === "open-no-rows" || state.kind === "delivering";
}

/** Declared, not measured (ADR-010 rule 6 style, matching `VIEWPORT_QUERY_MIN_INTERVAL_MS`'s own
 * framing in `viewportStreamManager.ts`): an anti-flicker guard so a viewport query that resolves
 * well within human perception time never flashes liveness text nobody has time to read. Cancel is
 * NEVER gated by this constant -- see `isScanInFlight`. */
export const SCAN_LIVENESS_DELAY_MS = 200;

/** Pure gating decision over an externally-tracked elapsed time. `FilterPanel` owns the actual timer
 * (a one-shot `setTimeout(SCAN_LIVENESS_DELAY_MS)` reset whenever a NEW stream becomes in-flight,
 * which is the direct realization of this function evaluated at the threshold instant); this
 * function is factored out so the threshold behavior itself -- not in-flight, below the delay, at or
 * above it -- is unit-testable without a DOM/timer harness. */
export function scanLivenessTextShouldShow(state: ScanState, msSinceIssued: number): boolean {
  return isScanInFlight(state) && msSinceIssued >= SCAN_LIVENESS_DELAY_MS;
}

/** The two literal liveness strings NEXT-CUT.md's design section names verbatim -- NO percentage,
 * ETA, or "N of M" (P4 item 2/binding note 4: no figure implying a duration). `null` for `idle` and
 * `issuing` (a ticket was minted but TAG_OPEN has not yet been observed -- Cancel is already visible
 * via `isScanInFlight`, but there is no defined text for this sub-state) and for every terminal state
 * (the persistent `.scan-incomplete` status, or the canvas itself, already speaks for those). */
export function scanLivenessText(state: ScanState): string | null {
  switch (state.kind) {
    case "open-no-rows":
      return "Filtering — scanning, no matching rows yet";
    case "delivering":
      return `Filtering — ${state.rows} rows so far`;
    default:
      return null;
  }
}

/**
 * Rider 3 (the wrong-instance-callback footgun, E2E-STATE.md's "Ledger footgun noted for later"):
 * during a dataset-key remount, React re-points `canvasRef.current` at the *new* `WorkingCanvas`
 * instance in the commit's layout phase -- strictly before the *previous* dataset's passive-effect
 * cleanup runs `manager.stop()`. A callback that reads `canvasRef.current` at CALL TIME (as this
 * file did before this fix) can therefore land the old manager's `clearStream`/`pushBatch` on the
 * new instance's fresh `ResidentSet` -- observed: a clear with `vertexDelta=0, before=0` on the
 * wrong instance. Harmless today only because the old instance is discarded wholesale; deliberately
 * not "the day datasets switch fast" (the human's words) safe.
 *
 * The fix: a `ViewportStreamManager` and the `WorkingCanvas` instance it feeds are 1:1 for the
 * manager's whole lifetime (both are created/torn down by the same `[admitted]` effect run, keyed
 * on the same dataset). This factory takes that instance *once, at construction* -- never a mutable
 * ref read later -- so a batch or supersede arriving after a remount always finds the canvas it was
 * actually meant for, alive or not, rather than whatever `canvasRef.current` happens to name by
 * then. Exported and pure (no React) so `App.test.ts` can assert this directly: build callbacks
 * against one stand-in canvas, repoint a stand-in "ref" to a second one, and confirm the callbacks
 * still hit the first.
 */
export function makeManagerCallbacks(
  canvas: WorkingCanvasHandle | null,
  handlers: {
    /** A stream failed for a reason this session did not itself cause (never called for a
     * `Completed` or `Cancelled` terminal -- see `ViewportStreamManager`'s own `onTerminal` doc
     * comment on why `Cancelled` never actually reaches here from the real SKP cancel path, and is
     * still filtered here defensively). */
    onFailureTerminal: (streamHandle: string, terminal: Terminal) => void;
    /** A stream's own natural `Completed` terminal -- rider 1's `"delivery-complete"` event. */
    onDeliveryCompleted: () => void;
    /** NEXT-CUT.md P4 item 1: the `batch(rows cumulative)` scan-liveness input needs a per-batch row
     * count, which only `WorkingCanvasHandle.pushBatch`'s own return value carries (the count of rows
     * this call actually admitted -- `0` on a declared-ceiling refusal, since nothing was added).
     * Optional so every pre-existing call site of this function (rider 3's own tests) keeps
     * compiling unchanged. Not called at all when `canvas` is `null` (nothing was pushed either). */
    onBatchRows?: (streamHandle: string, rowsInBatch: number) => void;
  }
): Pick<ViewportStreamManagerOptions, "onBatch" | "onSuperseded" | "onTerminal"> {
  return {
    onBatch: (streamHandle, batchSeq, payload) => {
      const rowsInBatch = canvas?.pushBatch(streamHandle, batchSeq, payload) ?? 0;
      handlers.onBatchRows?.(streamHandle, rowsInBatch);
    },
    onSuperseded: (streamHandle) => {
      canvas?.clearStream(streamHandle);
    },
    // Every data-plane terminal used to be dropped on the floor here (docs/01 principle 8
    // violation, found alongside the origin-mismatch bug this cut fixes): a `TransportFailed` from
    // a rejected WebSocket upgrade produced no error banner and no console output, so a stream
    // that could never deliver a single batch looked identical to an idle canvas.
    //
    // `ViewportStreamManager` never forwards a terminal for a stream it cancelled itself (an
    // ordinary supersede-on-pan, or an explicit `cancelStream` refusal) -- see its own
    // `selfCancelledHandles` doc comment. It is the layer that knows "I cancelled this", which
    // CANCELLATION-FACTS.md §1 established cannot be read back off `terminal.kind` alone: the SKP
    // cancel path yields `ProducerFailed`, never `Cancelled`. What reaches here is therefore either
    // a stream's own natural `Completed` (benign, routed to `onDeliveryCompleted`) or a genuine
    // failure this manager did not cause -- which must still banner.
    onTerminal: (streamHandle, terminal) => {
      if (terminal.kind === "Cancelled") {
        return;
      }
      if (terminal.kind === "Completed") {
        handlers.onDeliveryCompleted();
        return;
      }
      handlers.onFailureTerminal(streamHandle, terminal);
    },
  };
}

/**
 * `WorkingCanvas`'s `onCanvasRefusal` handler (NEXT-CUT.md P6 reviewer gate, **B1 -- blocking,
 * "corrupts the very indicator Part E judges"**). A declared-ceiling refusal
 * (`ResidentVertexCeilingExceeded` OR `PickCeilingExceeded` -- both route through this one
 * `WorkingCanvasProps` callback, see `WorkingCanvas.tsx`'s own `pushBatch`) calls `cancelStream`,
 * whose terminal `ViewportStreamManager` then suppresses (`selfCancelledHandles`) -- exactly binding
 * note 6's "a cancelled stream's terminal never reaches App." Without a scan event dispatched HERE,
 * at the cancel call site, the scan machine would stay wherever it was
 * (`issuing`/`open-no-rows`/`delivering`) FOREVER after every over-ceiling stream, showing a live
 * "still scanning" indicator and an enabled Cancel for a scan the app itself already killed -- and
 * the slow fixture's own unfiltered first look (`SLOW'/CANCEL'`,
 * `kernel/tests/manual_walkthrough_fixtures.rs`'s `generate_the_slow_filter_fixture`) IS exactly such
 * a stream, so Part E's operator would be judging a lying indicator.
 *
 * `{kind:"failed"}` chosen over a new dedicated event, as the reviewer's own note allowed: `.residency
 * -status` (rider 1) already names the ceiling right next to this exact moment, so the scan-liveness
 * indicator needs no extra copy of its own -- simply leaving the in-flight family (Cancel and the
 * liveness text both disappear, `isScanInFlight`/`scanLivenessText` already return accordingly for
 * `"failed"`) is the whole fix `nextScanState`'s existing transition already provides.
 *
 * Extracted as a pure function (not inline JSX) so this exact sequencing is unit-testable without a
 * DOM, at the same kind of seam `makeManagerCallbacks` above already establishes for handler logic.
 */
export function handleCanvasCeilingRefusal(
  streamHandle: string,
  message: string,
  deps: {
    setCanvasRefusal: (value: string | null) => void;
    applyScanEvent: (event: ScanEvent) => void;
    cancelStream: (streamHandle: string) => void;
  }
): void {
  deps.setCanvasRefusal(message);
  deps.applyScanEvent({ kind: "failed" });
  deps.cancelStream(streamHandle);
}

/**
 * Cut 1's whole shell: an admission flow, a working canvas, and viewport-driven streaming with
 * supersede-on-pan (`docs/07` Prototype-completion arc). No style panel, no publish affordance --
 * neither exists anywhere in this tree, not even as a disabled control (NEXT-CUT.md's own
 * constraint).
 */
export default function App() {
  const [admitted, setAdmitted] = useState<Admitted | null>(null);
  const [hover, setHover] = useState<PickResult | null>(null);
  const [canvasRefusal, setCanvasRefusal] = useState<string | null>(null);
  const [viewportRefusal, setViewportRefusal] = useState<FormattedRefusal | null>(null);
  // NEXT-CUT.md (style-panel cut) P3: App-owned, ephemeral (ADR-022's consequences -- no
  // persistence, no undo; binding note 4), starting at exactly today's fixed rendering
  // (`DEFAULT_STYLE_STATE`'s own doc comment has the hex/opacity math against `buildLayers.ts`'s
  // pre-P2 constant). `setStyle` has no caller yet -- the panel itself is P4; this piece lands the
  // state and the `WorkingCanvas` wiring (`style` prop) it will drive. `void setStyle;` below is the
  // same `noUnusedLocals` satisfier this file's own `activeFilter` precedent used for the identical
  // situation (filter-panel cut P2, CUT-STATE.md: confirmed by direct experiment that `tsc
  // --noUnusedLocals` DOES flag an unused element of a function-body `useState` destructure).
  const [style, setStyle] = useState<StyleState>(DEFAULT_STYLE_STATE);
  void setStyle;
  // Rider 1 (DECISIONS-PENDING.md entry 0, option (a)): the persistent status indicator, tracked
  // independently of `canvasRefusal` -- see `nextResidencyStatus`'s own doc comment for why
  // dismissing the banner must never touch this.
  const [residencyStatus, setResidencyStatus] = useState<ResidencyStatus | null>(null);
  // NEXT-CUT.md (filter-panel cut) design section: "App owns `activeFilter` (state for render + ref
  // for issue sites)." `activeFilter` is the render-facing value (consumed by P3's panel, not by
  // anything in this piece); `activeFilterRef` is what every issue site actually reads, kept in sync
  // by `commitActiveFilter` below -- the same split `canvasRef`/nothing-else already has no analogue
  // for, but `onHoverRef` et al. in `WorkingCanvas.tsx` establish the identical "ref mirrors state,
  // read inside a callback body" pattern this file borrows.
  const [activeFilter, setActiveFilter] = useState<Filter | null>(null);
  const activeFilterRef = useRef<Filter | null>(null);
  // "a new `lastViewportBboxRef` written by onViewportChanged (null until first settled view)" --
  // Apply's own re-issue target (design section (b)): the current viewport, not just the last one a
  // debounced query happened to fire for.
  const lastViewportBboxRef = useRef<Bbox | null>(null);
  const canvasRef = useRef<WorkingCanvasHandle>(null);
  const managerRef = useRef<ViewportStreamManager | null>(null);
  const viewportDebounceRef = useRef<Debounced<[Bbox, string | null]> | null>(null);
  // NEXT-CUT.md P4: App-owned (not FilterPanel-owned) precisely because indicator scope is "EVERY
  // in-flight viewport stream" (item 6), not filter-only -- an ordinary pan/zoom drives this too.
  const [scanState, setScanState] = useState<ScanState>({ kind: "idle" });
  /** P6 review, should-fix 1: a ref mirror of `scanState`, written SYNCHRONOUSLY by `commitScanState`
   * below -- the same `activeFilter`/`activeFilterRef` split this file already uses, for the same
   * reason. The Cancel JSX handler reads THIS, never the render-scope `scanState` closure, so which
   * stream gets cancelled is decided from the freshest possible state rather than whatever `scanState`
   * happened to be captured as when that particular render's closure was created. */
  const scanStateRef = useRef<ScanState>({ kind: "idle" });
  /** Writes BOTH `scanStateRef.current` (synchronously) and the `scanState` render state -- the one
   * function every `scanState` write in this component goes through (mirrors `commitActiveFilter`'s
   * own role for `activeFilter`). `useCallback([])`-stable for the same reason `commitActiveFilter`
   * is. */
  const commitScanState = useCallback((value: ScanState) => {
    scanStateRef.current = value;
    setScanState(value);
  }, []);
  /** Computes the next state from `scanStateRef.current` (always fresh -- see its own doc comment,
   * not from React's own `scanState` render value) and commits it via `commitScanState`.
   * `useCallback([commitScanState])`: `commitScanState` is itself `useCallback([])`-stable, so this
   * never actually changes identity across renders either. */
  const applyScanEvent = useCallback(
    (event: ScanEvent) => {
      commitScanState(nextScanState(scanStateRef.current, event));
    },
    [commitScanState]
  );
  /** Set inside the `[admitted]` effect below, to that effect's own `issueViewportQuery` closure --
   * `null` before a dataset is admitted (or after this effect's own cleanup runs). Exists so
   * `handleApplyFilter` (component-body level, below) can reach the SAME reporting wrapper the
   * effect's initial load and debounced pan/zoom already issue every query through, without itself
   * needing to be defined inside the effect (which reruns per `admitted`, while `handleApplyFilter`
   * -- passed to `FilterPanel` as a prop -- has no reason to change identity that often). */
  const issueQueryRef = useRef<
    ((bbox: Bbox | null, bboxCrs: string | null, filter: Filter | null) => Promise<RequestOutcome>) | null
  >(null);

  /** Writes BOTH `activeFilterRef.current` (synchronously) and the `activeFilter` render state --
   * the one function every `activeFilter` write in this component goes through, whether that write
   * is a successful Apply's commit or a dataset-change reset (`admitAndResetStaleUiState` below).
   * `useCallback([])`: `setActiveFilter` is React's own identity-stable setter, so this never needs
   * to change either -- see `handleAdmitted`'s own doc comment for why that stability matters. */
  const commitActiveFilter = useCallback((filter: Filter | null) => {
    activeFilterRef.current = filter;
    setActiveFilter(filter);
  }, []);
  // `activeFilter` (the render value) is read below, in the JSX, passed to `FilterPanel` -- P3
  // (this piece) is what finally consumes the value P2 only ever wrote (see that piece's own
  // now-removed placeholder comment in git history).

  /**
   * `FilterPanel`'s own `onApply` prop -- the SAME function the dev-only `queryWithFilter` E2E hook
   * calls (NEXT-CUT.md filter-panel cut, deviation-3 retrofit: "hook and panel drive the identical
   * seam"). `requestViewport` here reaches into `issueQueryRef.current` -- set by the `[admitted]`
   * effect below -- rather than closing over `managerRef.current` directly, so that every query this
   * function issues (including the refusal-recovery re-issue `applyFilter` performs internally) also
   * feeds the scan-liveness machine and the rider-1 `"query-issued"` clear exactly like the initial
   * load and the debounced pan/zoom already do -- one reporting wrapper, one seam, never a second
   * parallel path that would silently miss those two side effects for Apply-issued queries alone.
   * `useCallback([commitActiveFilter])`: stable for the same reason `handleAdmitted` above is.
   */
  const handleApplyFilter = useCallback(
    (filter: Filter | null): Promise<ApplyFilterOutcome> => {
      return applyFilter(filter, {
        requestViewport: (bbox, f) => {
          const issue = issueQueryRef.current;
          if (!issue) {
            return Promise.resolve({ kind: "stopped" });
          }
          return issue(bbox, null, f);
        },
        cancelPendingDebounce: () => viewportDebounceRef.current?.cancel(),
        getLastViewportBbox: () => lastViewportBboxRef.current,
        getActiveFilter: () => activeFilterRef.current,
        commitActiveFilter,
        // Human-approved design revision, 2026-08-15 walkthrough Part E E5 -- see `applyFilter`'s own
        // doc comment and `WorkingCanvasHandle.resetFitForNewGeneration`'s own doc comment.
        resetFitForNewGeneration: () => canvasRef.current?.resetFitForNewGeneration(),
      });
    },
    [commitActiveFilter]
  );

  /**
   * The single admission callback `AdmissionPanel` calls on every successful `open_dataset` --
   * first open and every reopen alike. Clears every piece of UI state a *previous* dataset could
   * have left behind before adopting the new one, so a refusal or hover reading from dataset N
   * never survives into dataset N+1's UI (D4, custodian forensic run: the stale banner from one
   * ceiling refusal read as identical across every later step because nothing here ever reset it).
   * The actual sequencing is `admitAndResetStaleUiState` below, kept as a plain function over
   * explicit setter parameters (no closure over this component's hooks) specifically so
   * `App.test.ts` can assert it without rendering `<App />` -- `WorkingCanvas`'s real `Deck`
   * construction needs a WebGL context jsdom does not provide, so this indirection is what keeps
   * the reset sequencing itself testable without a DOM/WebGL harness this repo does not carry.
   *
   * `useCallback([commitActiveFilter, commitScanState])`: every other setter closed over here is
   * React's own identity-stable `useState` setter, and both `commitActiveFilter` and `commitScanState`
   * are themselves `useCallback([])`-stable (their own doc comments above) -- so in practice this
   * callback still never actually changes across renders, for the same reason it never needed to
   * before this piece added its own dependency: without stability here, a plain function literal gets
   * a new identity every `App` render, which flows into `AdmissionPanel`'s `onAdmitted` prop, its
   * `admitPath` (`useCallback([onAdmitted])`), and the `useEffect([admitPath])` that (un)registers the
   * `openPath` E2E hook -- unregistering and re-registering that hook on every render, for no reason.
   */
  const handleAdmitted = useCallback(
    (next: Admitted): void => {
      admitAndResetStaleUiState(next, {
        setCanvasRefusal,
        setViewportRefusal,
        setHover,
        setResidencyStatus,
        setActiveFilter: commitActiveFilter,
        setLastViewportBbox: (value) => {
          lastViewportBboxRef.current = value;
        },
        setScanState: commitScanState,
        setAdmitted,
      });
    },
    // `commitActiveFilter`/`commitScanState` are each `useCallback([])`-stable (see their own doc
    // comments above), so this dependency never actually changes across renders -- `handleAdmitted`
    // stays as identity-stable as it was before this piece, for the same reason its own doc comment
    // already states (`AdmissionPanel`'s `admitPath`/E2E-hook `useEffect` chain).
    [commitActiveFilter, commitScanState]
  );

  function reportViewportOutcome(promise: Promise<RequestOutcome>) {
    promise.then(
      () => setViewportRefusal(null),
      (e: unknown) => {
        if (e instanceof SkpCallError) {
          setViewportRefusal(formatRefusal(e.skpError));
          return;
        }
        throw e; // an unexpected failure still reaches the ADR-010 rule 7 handlers
      }
    );
  }

  useEffect(() => {
    if (!admitted) {
      managerRef.current = null;
      viewportDebounceRef.current = null;
      issueQueryRef.current = null;
      return;
    }

    // Rider 3: captured once, here, never re-read as `canvasRef.current` inside a callback below --
    // see `makeManagerCallbacks`'s own doc comment for the remount race this closes. This effect's
    // own `[admitted]` dependency means this `canvas` is exactly the `WorkingCanvas` instance the
    // JSX below mounts for *this* `admitted.dataset` (keyed on it), for this manager's whole
    // lifetime -- 1:1, never reassigned later even if `canvasRef.current` is.
    const canvas = canvasRef.current;
    if (canvas === null) {
      // Unreachable today: React's commit order re-points a `ref` at its new instance in the
      // layout phase, strictly before this passive effect runs -- by the time this line executes,
      // the `WorkingCanvas` this effect is keyed to (`admitted.dataset`) has already mounted and
      // `canvasRef.current` already names it. Logged anyway rather than silently assumed (docs/01
      // principle 8): `makeManagerCallbacks(canvas, ...)` closes over whatever `canvas` is *right
      // now*, permanently, for this manager's whole lifetime (that is the whole point of rider 3's
      // fix) -- if this ever did fire, every `onBatch`/`onSuperseded` call for this dataset would
      // silently no-op (`canvas?.pushBatch` on a permanently-null `canvas`) for the manager's
      // entire life, with no error, banner, or crash to say so. A log line here is the only thing
      // that would ever surface it.
      logSessionEvent(
        "canvas-ref-null-at-capture",
        `admitted.dataset=${admitted.dataset}: canvasRef.current was null when this effect captured it -- every batch/supersede for this dataset will silently no-op for this manager's whole lifetime`
      );
    }
    // NEXT-CUT.md P4 item 1: `batch(rows cumulative)` -- the running total for whichever stream this
    // scan machine is currently tracking. Effect-local (not a ref/useState): reset implicitly on
    // every effect rerun (a fresh dataset), and explicitly whenever `issueViewportQuery` below
    // observes a NEW `issued` outcome, exactly the same "one scan tracked at a time" discipline
    // `nextScanState`'s own doc comment states.
    let scanRowsAccumulator: { streamHandle: string | null; rows: number } = { streamHandle: null, rows: 0 };

    const manager = new ViewportStreamManager({
      dataset: admitted.dataset,
      onStreamOpened: (streamHandle) => {
        applyScanEvent({ kind: "streamOpened", streamHandle });
      },
      ...makeManagerCallbacks(canvas, {
        onFailureTerminal: (streamHandle, terminal) => {
          logSessionEvent("stream-terminal-failure", `${streamHandle}: ${terminal.kind} — ${terminal.detail}`);
          setCanvasRefusal(`stream ${terminal.kind}: ${terminal.detail}`);
          applyScanEvent({ kind: "failed" });
        },
        onDeliveryCompleted: () => {
          // Rider 1: "a later stream completes fully without a ceiling refusal" clears the status.
          setResidencyStatus(nextResidencyStatus({ kind: "delivery-complete" }));
          applyScanEvent({ kind: "completed" });
        },
        onBatchRows: (streamHandle, rowsInBatch) => {
          if (scanRowsAccumulator.streamHandle !== streamHandle) {
            scanRowsAccumulator = { streamHandle, rows: 0 };
          }
          scanRowsAccumulator.rows += rowsInBatch;
          applyScanEvent({ kind: "batch", rows: scanRowsAccumulator.rows });
        },
      }),
    });
    managerRef.current = manager;

    /**
     * The ONE choke point every `manager.requestViewport` call in this effect (and, via
     * `issueQueryRef`, `handleApplyFilter`'s Apply/refusal-recovery calls too) goes through --
     * NEXT-CUT.md P4 item 6's "EVERY in-flight viewport stream" indicator scope, and the rider-1
     * `"query-issued"` clear (DECISIONS-PENDING.md entry 1), both live here exactly once rather than
     * at each of the four call sites separately. Dispatches happen inside the promise's own `.then()`
     * so they never delay the `RequestOutcome` any caller of this function still needs to inspect.
     */
    function issueViewportQuery(
      bbox: Bbox | null,
      bboxCrs: string | null,
      filter: Filter | null
    ): Promise<RequestOutcome> {
      const promise = manager.requestViewport(bbox, bboxCrs, undefined, filter);
      promise.then((outcome) => {
        if (outcome.kind === "issued") {
          scanRowsAccumulator = { streamHandle: outcome.streamHandle, rows: 0 };
          applyScanEvent({ kind: "issued", streamHandle: outcome.streamHandle });
          setResidencyStatus(nextResidencyStatus({ kind: "query-issued" }));
        }
      }, /* rejection handled by each call site's own reportViewportOutcome/applyFilter */ () => {});
      return promise;
    }
    issueQueryRef.current = issueViewportQuery;

    // E2E TEST SURFACE (dev builds only, e2e/README.md): drives `applyFilter` -- the SAME helper
    // `handleApplyFilter` above binds for the real FilterPanel's Apply button (NEXT-CUT.md
    // filter-panel cut, deviation-3 retrofit: "the e2e queryWithFilter hook must be routed through
    // applyFilter ... hook and panel drive the identical seam", not a second, parallel path). Only
    // registered here, inside this effect, because `issueViewportQuery` (and therefore anything to
    // query) only exists once a dataset is admitted -- mirrors `capturePixels` only existing once
    // `WorkingCanvas` mounts.
    if (import.meta.env.DEV) {
      registerE2eHook("queryWithFilter", (predicate: string) =>
        applyFilter(
          // P6 review, nit: routed through the SAME `predicateTextToFilter` mapping the real panel's
          // input uses (empty string -> `filter: null`, the one admitted mapping) -- this hook drives
          // the identical seam a real Apply click does end to end, not just at the `applyFilter` call.
          predicateTextToFilter(predicate),
          {
            requestViewport: (bbox, f) => issueViewportQuery(bbox, null, f),
            cancelPendingDebounce: () => viewportDebounceRef.current?.cancel(),
            getLastViewportBbox: () => lastViewportBboxRef.current,
            getActiveFilter: () => activeFilterRef.current,
            commitActiveFilter,
            // Same-seam doctrine (deviation-3 retrofit): this hook drives the IDENTICAL applyFilter
            // seam a real Apply click does, including the new-generation fit reset.
            resetFitForNewGeneration: () => canvasRef.current?.resetFitForNewGeneration(),
          }
        )
      );
    }

    // Pan/zoom-driven queries are debounced to settle (`streaming/debounce.ts`'s own doc comment):
    // deck.gl's `onViewStateChange` fires on every pointer-move frame during a drag, and issuing a
    // query per frame -- even throttled to the manager's own 120 ms window -- let overlapping
    // in-flight `viewport_query` calls pile up kernel-side tickets faster than ordinary dragging
    // should (Custodian walkthrough finding: `skp.too_many_pending_streams` from plain dragging).
    // Debouncing means continuous motion issues nothing; only a settled view issues a query.
    //
    // `makeDebouncedViewportQuery` (this file, above) is what reads `activeFilterRef.current` INSIDE
    // the debounced body -- one of the design section's three ref-reading issue sites, and the one
    // an ordinary pan/zoom drives. Routed through `issueViewportQuery` (not `manager.requestViewport`
    // directly) so an ordinary pan/zoom feeds the scan-liveness machine exactly like Apply does.
    const debounced = debounce(
      makeDebouncedViewportQuery(
        (bbox, bboxCrs, filter) => {
          const p = issueViewportQuery(bbox, bboxCrs, filter);
          reportViewportOutcome(p);
          return p;
        },
        activeFilterRef,
        () => {} // reporting is already handled by the wrapper above; nothing further to do here
      ),
      VIEWPORT_QUERY_MIN_INTERVAL_MS
    );
    viewportDebounceRef.current = debounced;

    // The first look is unfiltered: `describe` establishes no dataset extent to aim a viewport at
    // (SKP-V0.md's C1), so the canvas's own fit-to-bounds-on-open is what puts the camera somewhere
    // the data actually is. Issued immediately, not debounced -- there is nothing yet to coalesce.
    // Reads `activeFilterRef.current` too (design section: "all three issue sites read the REF at
    // issue time") -- always `null` here in practice, since a fresh admission's own
    // `admitAndResetStaleUiState` call already cleared it before this effect re-runs, but reading the
    // ref rather than hardcoding `null` keeps this call uniform with the other two issue sites
    // instead of a special case that would silently stop being true if that ordering ever changed.
    reportViewportOutcome(issueViewportQuery(null, null, activeFilterRef.current));

    return () => {
      debounced.cancel();
      viewportDebounceRef.current = null;
      issueQueryRef.current = null;
      void manager.stop();
      if (import.meta.env.DEV) unregisterE2eHook("queryWithFilter");
      // Every admitted dataset stays open (and its DuckDB pool resident) until explicitly closed;
      // opening a second one must not leak the first (S1, architect review of this cut).
      void closeDataset(admitted.dataset).catch(() => {});
      managerRef.current = null;
    };
    // `reportViewportOutcome`/`applyScanEvent`/`commitActiveFilter` are stable across renders (each
    // only reaches a `useCallback([])` or React `useState` setter) and `manager`/`debounced` are
    // effect-local, so none is a dependency of anything outside.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [admitted]);

  return (
    <div className="app">
      <ErrorBanner />
      <header className="app-header">Spatial IDE</header>
      <main className="app-main">
        <AdmissionPanel onAdmitted={handleAdmitted} />
        {/* NEXT-CUT.md (filter-panel cut) P3 item 5 / binding note 9: in `.app-main`'s flex column,
          * below the admission panel, in normal document flow -- never an absolute overlay. Keyed on
          * `admitted.dataset` for the same reason `WorkingCanvas` below is: a dataset change must
          * discard this panel's own local input text/busy/refusal state rather than reconcile it
          * across two different datasets' filter/column spaces (App-owned state -- `activeFilter`,
          * `scanState` -- is reset independently via `admitAndResetStaleUiState`). */}
        {admitted && (
          <FilterPanel
            key={admitted.dataset}
            appliedFilter={activeFilter}
            onApply={handleApplyFilter}
            scanState={scanState}
            onCancel={() => {
              // P6 review, should-fix 1: reads `scanStateRef.current`, NEVER the render-scope
              // `scanState` this closure could otherwise capture stale -- see the ref's own doc
              // comment. Both the dispatch and the handle handed to `cancelStream` come from the
              // exact same, freshest-possible read.
              const current = scanStateRef.current;
              if (!isScanInFlight(current)) return;
              const handle = current.streamHandle;
              // "Transitions AT THE CANCEL CALL SITE" (P4 binding note 6) -- dispatched synchronously
              // here, in the SAME handler that calls `cancelStream`, never awaiting anything: a
              // self-cancelled stream's terminal is suppressed by the manager and will never arrive
              // to drive this transition otherwise.
              applyScanEvent({ kind: "cancelledByUser", streamHandle: handle });
              void managerRef.current?.cancelStream(handle);
            }}
          />
        )}
        {admitted && (
          <div className="canvas-container">
            {/* Keyed on the dataset handle -- not just re-rendered with new props -- so a reopen
              * (a *new* `open_dataset`, `Admitted` object, even for the same file: SKP-V0.md never
              * promises the same dataset handle back) unmounts and remounts this component,
              * discarding `residentRef`/`residentExtentRef`/`hasAutoFitRef`/`frameRef` entirely
              * rather than reconciling the same instance across two different datasets' CRS/extent/
              * identity spaces. ADR-010 rule 1 ("a frame is a type too" -- `frameRef`'s origin, like
              * `residentRef`'s buffers, is tagged to the dataset that produced it) is why: a *new*
              * dataset is a new frame/identity space, and every canvas ref built against the old one
              * must reset, not survive as an untagged carryover.
              *
              * Correction (2026-08-13): an earlier version of this comment cited "2,012,436 = the
              * old dataset's still-resident 1,961,249 + the new dataset's first batch (51,187)" as
              * the evidence this fix was responding to. Refuted by the run ledger
              * (e2e/out/regression-render-trace-1786582131720.json): both numbers were the *same*
              * stream's own partial sum at its own refusal moment (1,961,249 resident + 51,187
              * attempted, on a stream that was then cancelled), never two different datasets'
              * residency. This remount was never actually resting on that arithmetic -- it is
              * correct on the ADR-010 rule 1 grounds stated above regardless. */}
            <WorkingCanvas
              key={admitted.dataset}
              dataset={admitted.dataset}
              ref={canvasRef}
              geometryColumn={admitted.describe.geometry.column}
              style={style}
              onHover={setHover}
              onCanvasRefusal={(streamHandle, message) => {
                // NEXT-CUT.md P6 review, B1 (blocking): `handleCanvasCeilingRefusal`'s own doc
                // comment above has the full account -- a declared-ceiling refusal must dispatch a
                // scan event AT the cancel call site, or the liveness indicator lies forever after.
                handleCanvasCeilingRefusal(streamHandle, message, {
                  setCanvasRefusal,
                  applyScanEvent,
                  // limits.ts's own declared remedy is "cancel the offending stream", not just "show
                  // a message" -- a batch that already crossed a ceiling must not keep the stream
                  // running to consume more credit and more connection capacity for nothing.
                  cancelStream: (h) => void managerRef.current?.cancelStream(h),
                });
              }}
              onResidentCeilingExceeded={(_streamHandle, residentFeatureCount) => {
                setResidencyStatus(
                  nextResidencyStatus({
                    kind: "ceiling-refusal",
                    residentFeatureCount,
                    datasetRowCount: admitted.describe.row_count.value ?? "unknown",
                  })
                );
              }}
              onViewportChanged={(bbox) => {
                // `lastViewportBboxRef` (design section (b)): written on EVERY viewport change, not
                // only a debounced/settled one -- Apply's own re-issue needs "the current viewport"
                // at click time, which may be mid-drag, not only the last one a debounced query
                // happened to fire for.
                lastViewportBboxRef.current = toWireBbox(bbox);
                // Debounced to settle -- see the effect above's own comment and
                // `streaming/debounce.ts` for why a pan/zoom-driven query is never issued directly
                // from this callback.
                viewportDebounceRef.current?.call(toWireBbox(bbox), null);
              }}
            />
            <button
              type="button"
              className="zoom-to-layer"
              onClick={() => canvasRef.current?.fitToBounds()}
            >
              Zoom to layer
            </button>
            {hover && (
              <div className="hover-readout">
                id {hover.id.toString()}
                {hover.anchor && ` @ (${hover.anchor[0].toFixed(3)}, ${hover.anchor[1].toFixed(3)})`}
              </div>
            )}
            {/* S1 (reviewer round, 2026-08-13): a single top-anchored flex column, not three
              * independently absolute-positioned elements at fixed offsets. `.canvas-refusal` can
              * wrap to 2+ lines (a long stream-failure or refusal message), and a fixed offset for
              * whatever sat below it (the old `.residency-status` rule) assumed a height that a
              * wrapped message violates -- occluding it. Stacking these in normal document flow
              * inside `.canvas-status-stack` (styles.css) means each element's *actual* rendered
              * height, whatever it is, is what the next one respects, not a number guessed in
              * advance -- both stay simultaneously visible regardless of message length, and both
              * stay clear of `.hover-readout` (bottom-left) and `.zoom-to-layer` (top-right) exactly
              * as before. */}
            {(canvasRefusal || viewportRefusal || residencyStatus || scanState.kind === "cancelled") && (
              <div className="canvas-status-stack">
                {canvasRefusal && (
                  <div className="canvas-refusal" role="alert">
                    {canvasRefusal}
                    <button type="button" onClick={() => setCanvasRefusal(null)}>
                      Dismiss
                    </button>
                  </div>
                )}
                {viewportRefusal && (
                  <div className="canvas-refusal" role="alert">
                    <div className="admission-refusal-code">{viewportRefusal.code}</div>
                    {viewportRefusal.message}
                    <button type="button" onClick={() => setViewportRefusal(null)}>
                      Dismiss
                    </button>
                  </div>
                )}
                {/* Rider 1 (DECISIONS-PENDING.md entry 0, option (a)): NOT dismissible -- no close
                  * control, deliberately. Dismissing a `.canvas-refusal` above must never remove
                  * this; it only ever clears via `nextResidencyStatus`'s own "delivery-complete" /
                  * "dataset-changed" transitions. Plain digits, no thousands separators (this
                  * file's own `ResidencyStatus` doc comment: `datasetRowCount` is a wire `DecU64`
                  * string, never narrowed to `Number`). */}
                {residencyStatus && (
                  <div className="residency-status" role="status">
                    {`${residencyStatus.residentFeatureCount} of ${residencyStatus.datasetRowCount} features rendered — declared ceiling reached (MAX_RESIDENT_VERTICES)`}
                  </div>
                )}
                {/* NEXT-CUT.md P4 item 3, verbatim copy: persistent, NOT dismissible -- no close
                  * control (rider-1 pattern). Cleared only by the next issued query (any of the three
                  * issue sites, via `issueViewportQuery`'s own unconditional `"issued"` supersede) or
                  * a dataset change (`admitAndResetStaleUiState`'s `setScanState({kind:"idle"})`) --
                  * derived directly from `scanState.kind === "cancelled"`, no separate boolean to
                  * drift out of sync with the machine that actually governs it. No duration word or
                  * figure beyond the row count itself (binding note 4). */}
                {scanState.kind === "cancelled" && (
                  <div className="scan-incomplete" role="status">
                    {`Filtered view incomplete — scan cancelled at ${scanState.rows} rows`}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
