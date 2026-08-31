// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import type { WorkingCanvasHandle } from "../canvas/WorkingCanvas";
import { chooseFitTarget } from "../canvas/extent";
import { INITIAL_TILE_KEY, UNTILED_FIRST_LOOK_ROW_LIMIT } from "../canvas/tileGridConstants";
import type { AuthoritativeBbox } from "../canvas/viewportBbox";
import { traceCandidateResidencyStatus, traceStreamIssued, traceViewportQuery } from "../diagnostics/renderTrace";
import { logSessionEvent } from "../diagnostics/log";
import {
  recordResidencyBatchArrived,
  recordResidencyStreamEnded,
  recordResidencyStreamIssued,
  recordResidencyTileRequested,
} from "../instrument/residencyInstrument";
import { isInstrumentedBuild } from "../isInstrumentedBuild";
import type { ResidencyStatusEvent } from "./residencyStatus";
import { encodeDecU64 } from "../skp/codec";
import { cancel as skpCancel, viewportQuery } from "../skp/client";
import type { Bbox, Filter } from "../skp/types";
import { startStream } from "../streaming/adapterWs";
import { dataPlaneAttach } from "../streaming/dataPlaneClient";
import { debounce } from "../streaming/debounce";
import type { StreamSink } from "../streaming/transport";
import { TileViewportStreamManager } from "../streaming/tileViewportStreamManager";
import { VIEWPORT_QUERY_MIN_INTERVAL_MS } from "../streaming/viewportStreamManager";
import type { RequestOutcome } from "../streaming/viewportStreamManager";

/**
 * Viewport-residency cut P3w: the candidate arm's own `App.tsx` construction -- everything P3's
 * machinery (`TileViewportStreamManager`, `TileResidentSet`/`tileIngest.ts` via `WorkingCanvas.tsx`'s
 * own `pushTileBatch`) needed to become a real, end-to-end data path. `App.tsx`'s `[admitted]` effect
 * selects BETWEEN this and the baseline `ViewportStreamManager` construction (a single `if`, entered
 * only when `getResidencyArm() === "candidate"`, that returns before a single line of the baseline
 * construction ever runs) -- the piece's own bit-identity requirement is structural: nothing here is
 * reachable unless that check passes, and this whole module's own top-level import in `App.tsx` is
 * dead code once `import.meta.env.DEV` is `false` (Vite's own literal-`false` replacement), same as
 * `residencyArm.ts`'s own DEV-only symbols (`check:dist-clean`'s own extended identifier list covers
 * this module's own entry point, `startCandidateArmSession`).
 *
 * **The tile grid's own anchor problem, and how this module resolves it.** `tileGrid.ts`'s own top
 * doc comment: there is no dataset extent to anchor a fixed grid to before the first byte of data
 * ever arrives, and a caller derives one from the FIRST viewport query's own batches, once. This
 * module's own dataset-open sequence therefore issues ONE plain, UNTILED `viewport_query` first --
 * `bbox: null`, the exact same "unrestricted first look" shape baseline's own initial load already
 * uses (`App.tsx`'s `[admitted]` effect, `issueViewportQuery(null, null, ...)`) -- via
 * `issueUntiledQuery` below, built from the same three transport primitives
 * `TileViewportStreamManager.mintAndStart` already uses internally for each per-tile issue
 * (`viewportQuery`/`dataPlaneAttach`/`startStream`), reused here rather than reimplemented. Its
 * batches are ingested through the SAME `WorkingCanvas.pushTileBatch` seam every tile stream's
 * batches are (tagged under the reserved `INITIAL_TILE_KEY`, never a real tile the grid could ever
 * produce -- `tileKeyToString`'s own `"row:col"` shape never collides with a bare word). The FIRST
 * batch that carries any geometry gives `pushTileBatch` a non-null `fitAnchor`
 * (`WorkingCanvas.tsx`'s own `fitAnchorRef`, shared with the baseline arm's identical one-shot
 * auto-fit) -- exactly mirroring baseline's own auto-fit timing (`pushBatch`'s
 * `!hasAutoFitRef.current && residentExtentRef.current` check) -- at which point this module calls
 * `establishGridFrame` exactly once, ever, for this session.
 *
 * **Why tile-keyed planning does not start immediately after that.** `establishGridFrame` alone
 * gives `TileViewportStreamManager.onCameraChange` a frame to plan against, but planning ALSO needs a
 * real "current viewport" bbox -- and at the moment the initial untiled stream first delivers,
 * `lastViewportBboxRef`/deck's own `onViewStateChange` has not necessarily fired at all (baseline's
 * own auto-fit is `notifyViewport: false`, precisely so it does not race the very stream that is
 * still delivering). Tile-keyed planning therefore begins the same way baseline's own FIRST real
 * `viewport_query` beyond the initial load does: the next genuine `onViewportChanged` event -- a real
 * pan/zoom, or the "fit" trace step's `.zoom-to-layer` click (`WorkingCanvas.fitToBounds`, which
 * fits `fitAnchorRef` and DOES notify, `notifyViewport: true`). At fit-to-extent the viewport IS the
 * dataset (NEXT-CUT.md's own restated target for this whole cut) -- the covering tile set at THAT
 * moment is typically many tiles, which is why the fit step is expected to show `>1` tile stream
 * issued, not the open-drain step (this module's own report has the full account).
 */

/** Reserved tile key for the initial, untiled "first look" query's own batches -- never a real
 * tile key `tileGrid.ts`'s own `"row:col"` string form could ever produce (no digit, no colon
 * flanked by two numbers). Ingested through the exact same `WorkingCanvas.pushTileBatch` seam every
 * real tile stream's batches are, so item C's cross-tile dedupe and item D's budget/eviction apply to
 * it identically -- it is not a second, parallel ingest path.
 *
 * P5f complex-gate must-fix 3: the constant itself now lives in `tileGridConstants.ts` (imported
 * above, re-exported here unchanged, so every existing `import { INITIAL_TILE_KEY } from
 * "./candidateArmSession"` call site keeps working) -- `tileIngest.ts`/`WorkingCanvas.tsx` need it too
 * (to exclude it from distance-ordered eviction planning), and importing it from HERE would cycle
 * back through this module's own `WorkingCanvasHandle` type import. */
export { INITIAL_TILE_KEY };

export interface CandidateArmSessionDeps {
  dataset: string;
  /** Rider 3 discipline (`App.tsx`'s own `makeManagerCallbacks` doc comment): captured ONCE, at
   * construction, never re-read from a mutable ref later -- the same reason that fix exists for the
   * baseline manager applies here identically. `null` is handled (every call below is optional-
   * chained) rather than assumed unreachable, mirroring `makeManagerCallbacks`'s own defensive
   * stance. */
  canvas: WorkingCanvasHandle | null;
  /** Viewport-residency cut P4 (decisions 24(a)/(b)): fired every time this session's own
   * over-budget/resident-count state may have changed (a batch ingested, a pan/zoom re-evaluates
   * fit, a filter/dataset-open reissue clears everything) -- ALWAYS one of the
   * `ResidencyStatusEvent` shapes `App.tsx`'s own `nextResidencyStatus` already reduces, so this
   * session drives the SAME state machine baseline's ceiling-refusal status does, arm-aware, rather
   * than a second parallel one (see `emitResidencyStatus`'s own doc comment below for exactly when
   * each event fires). Optional so every pre-existing test/call site of this function keeps
   * compiling unchanged. */
  onResidencyStatusChange?: (event: ResidencyStatusEvent) => void;
  /**
   * P5f complex-gate should-fix 3: before this piece, `App.tsx`'s candidate-arm construction branch
   * never called `applyScanEvent` at all -- `App.tsx`'s Cancel button is wired to `isScanInFlight
   * (scanState)`/`scanStateRef.current`, both of which stayed permanently `{kind:"idle"}` for the
   * whole candidate-arm session, so Cancel was never even VISIBLE while candidate-arm tile/untiled
   * work was genuinely in flight (Principle 7: every operation cancellable -- an invisible,
   * unreachable Cancel affordance is not one).
   *
   * The type accepted here is a NARROWER union than `App.tsx`'s own `ScanEvent` (only the two shapes
   * this session ever actually constructs) rather than importing `ScanEvent` itself -- importing it
   * would cycle back into `App.tsx`, which this module's own top doc comment (and `residencyStatus
   * .ts`'s identical `ResidencyStatusEvent` precedent) already avoids on purpose. `App.tsx`'s real
   * `applyScanEvent` (typed to accept the FULL `ScanEvent` union) is directly assignable here --
   * function-parameter contravariance: a function that can handle every `ScanEvent` can always stand
   * in for one that only ever receives two of its members.
   *
   * This session collapses its own much busier per-tile/untiled-stream lifecycle into exactly two
   * transitions for Cancel's own benefit: `{kind:"issued", streamHandle: CANDIDATE_SCAN_HANDLE}` the
   * moment ANY work becomes outstanding (untiled stream OR any tracked tile) after none was, and
   * `{kind:"reset"}` the moment everything settles back to nothing outstanding -- `syncScanLiveness`
   * below is the one place that computes and dispatches this. Never `"streamOpened"`/`"batch"`/
   * `"completed"`/`"failed"`: those sub-states exist for `scanLivenessText`'s own per-row wording,
   * which has no honest per-viewport-total analogue for the candidate arm any more than
   * `residencyStatusText`'s own `viewportTotal: null` degradation does (`emitResidencyStatus`'s own
   * doc comment above) -- `isScanInFlight({kind:"issuing", ...})` is already `true`, which is all
   * Cancel's own visibility needs. Optional, defaulted to a no-op, so every pre-existing test/call
   * site of this function keeps compiling and behaving unchanged. */
  applyScanEvent?: (event: { kind: "issued"; streamHandle: string } | { kind: "reset" }) => void;
}

/** The single, session-lifetime sentinel `streamHandle` this session's own `{kind:"issued"}` dispatch
 * uses -- there is no ONE real stream handle to name (this session's own work is many concurrent
 * per-tile streams plus one untiled stream), and `App.tsx`'s own `ScanEvent.issued` shape requires
 * SOME `streamHandle`. Never a real SKP stream handle -- `skp/client.ts` mints those server-side; this
 * is deliberately shaped so it could never collide with one. */
const CANDIDATE_SCAN_HANDLE = "candidate-session-scan";

export interface CandidateArmSession {
  manager: TileViewportStreamManager;
  /** Wired directly into the SAME `debounce(fn, VIEWPORT_QUERY_MIN_INTERVAL_MS)` call baseline's own
   * pan/zoom debounce already uses (`App.tsx`'s `[admitted]` effect) -- this function is the debounced
   * body, never re-declaring the constant or the `debounce()` call itself. */
  onViewportChanged: (bbox: AuthoritativeBbox) => void;
  /** P5f complex-gate must-fix 4: cancels a scheduled-but-not-yet-fired `onViewportChanged` call --
   * exposes this session's own internal debounce's `cancel()`, so `App.tsx`'s `viewportDebounceRef
   * .current?.cancel()` seam (Apply/Clear's own `cancelPendingDebounce`, the E2E `queryWithFilter`
   * hook) can reach it now that `App.tsx` no longer wraps `onViewportChanged` in a second debounce of
   * its own (the double-debounce this piece fixes -- see `App.tsx`'s own
   * `makeCandidateViewportDispatcher`). */
  cancelPendingViewportChange: () => void;
  /** `App.tsx`'s `issueQueryRef`-compatible seam (item A: "Filter changes ... still clear
   * everything"): cancels nothing of its own (the caller already calls
   * `viewportDebounceRef.current?.cancel()` first, `applyFilter`'s own `cancelPendingDebounce`),
   * performs a full candidate-arm clear (`manager.clearAll()` + `canvas.clearAllTiles()` +
   * `canvas.resetFitForNewGeneration()`), and re-issues a fresh untiled "first look" under `filter`
   * -- symmetric with `App.tsx`'s own dataset-open call to this same function, and with baseline's
   * "Apply = supersede immediately, an unrestricted first look" design (`App.tsx`'s `applyFilter` doc
   * comment). The tile grid FRAME itself is never re-derived (`establishGridFrame`'s own "no-op past
   * the first call" contract) -- only residency and the fit anchor reset, matching the module's own
   * fresh-anchor bookkeeping for a NEW generation.
   */
  reissueUnrestricted: (bbox: Bbox | null, filter: Filter | null) => Promise<RequestOutcome>;
  /** Cancels the current stream a session's own initial/reissued untiled query may still be minting
   * or running -- used by `App.tsx`'s `handleApplyFilter`-equivalent `cancelPendingDebounce`. */
  stop: () => Promise<void>;
}

/**
 * Constructs the candidate arm's own `TileViewportStreamManager` and wires it to `canvas` -- called
 * exactly once per dataset session, from `App.tsx`'s candidate-only construction branch. Never throws
 * for a refused initial query -- `reissueUnrestricted`'s own promise rejects with the real
 * `SkpCallError`, exactly as baseline's `issueViewportQuery` does, so `applyFilter`'s existing
 * refusal-formatting logic (arm-agnostic, `App.tsx`) keeps working unchanged.
 */
export function startCandidateArmSession(deps: CandidateArmSessionDeps): CandidateArmSession {
  const { dataset, canvas } = deps;
  let frameEstablished = false;
  let stopped = false;
  let currentFilter: Filter | null = null;
  let lastCoveringTileKeys: ReadonlySet<string> = new Set();
  /** P5f complex-gate should-fix 4: the running union of every batch the CURRENT untiled first-look/
   * reissue stream has delivered so far (`ingestAndMaybeEstablishFrame`'s own `outcome.unionedExtent`,
   * which already accumulates across calls) -- read once, at that stream's own natural terminal
   * (`issueUntiledQuery`'s `onTerminal`), to derive the grid frame's anchor from ALL of that stream's
   * batches, not its first alone (`tileGrid.ts`'s own doc comment has the full account). Reset
   * implicitly by `reissueUnrestricted`'s own full clear (a fresh generation's untiled query starts
   * this accumulation over, the same way `evictedTileCountSession`/`lastCoveringTileKeys` reset). */
  let latestUnionedExtent: AuthoritativeBbox | null = null;
  /** The initial/reissued untiled stream's own handle, if one is currently running -- so `stop()`
   * can cancel it (mirrors `ViewportStreamManager.stop`'s own `supersedeCurrent`, simplified: this
   * session issues at most one untiled stream at a time, never superseding a still-running one with
   * another -- `reissueUnrestricted` is only ever called after a full clear, which does not itself
   * need to race a still-in-flight untiled stream in practice). */
  let untiledStreamHandle: string | null = null;
  /** Tile keys this session has already counted as an "issued stream" against
   * `residencyInstrument.ts`'s own `streamsIssued` counter -- deduped by key so a tile counted once
   * at PLANNING time (`onCameraChange`'s own `issued` array, the common case) is never counted a
   * second time when its `onBatch`/`onTerminal` later fires too, and so a tile that was only ever
   * QUEUED at planning time (capped by `MAX_IN_FLIGHT_TILE_STREAMS`) still gets counted once its
   * `onBatch`/`onTerminal` eventually proves a real stream was minted for it. P3w's own version of
   * this comment disclosed that `tilesRequested` was out of scope for that piece, reserved for a
   * later one -- P3i (this piece) is that later piece: the SAME dedupe now also feeds
   * `recordResidencyTileRequested` below, a tile-specific count under its own name rather than only
   * the general `streamsIssued`/`streamsEnded` counters baseline already shares. */
  const countedIssuedTileKeys = new Set<string>();

  function countTileStreamIssuedOnce(tileKey: string): void {
    if (countedIssuedTileKeys.has(tileKey)) return;
    countedIssuedTileKeys.add(tileKey);
    if (isInstrumentedBuild()) {
      recordResidencyStreamIssued();
      recordResidencyTileRequested();
    }
  }

  function countTileStreamEndedOnce(tileKey: string): void {
    if (!countedIssuedTileKeys.delete(tileKey)) return; // never counted as issued -- nothing to end
    if (isInstrumentedBuild()) {
      recordResidencyStreamEnded();
    }
  }

  /** P5f complex-gate should-fix 3: whether this session most recently told `deps.applyScanEvent`
   * "work is outstanding" -- compared against `hasOutstandingWork()`'s own current truth by
   * `syncScanLiveness` below so `{kind:"issued"}`/`{kind:"reset"}` fire exactly on the TRANSITION,
   * never redundantly on every call site that might have changed nothing. */
  let scanActive = false;

  /** True while EITHER the untiled first-look/reissue stream is still running OR
   * `manager.trackedTileCount` names any queued/issuing/in-flight tile -- "any candidate-arm work
   * this session itself started that has not yet reached a terminal state." */
  function hasOutstandingWork(): boolean {
    return untiledStreamHandle !== null || manager.trackedTileCount > 0;
  }

  /** P5f complex-gate should-fix 3: the one place that computes and dispatches this session's own
   * two-state scan-liveness signal (see `CandidateArmSessionDeps.applyScanEvent`'s own doc comment
   * for the full design) -- called from every point in this module where outstanding work could have
   * started or every last piece of it could have just settled. Idempotent: a call that finds no
   * change in `hasOutstandingWork()` since the last call is a no-op, so calling this defensively at
   * several points never double-dispatches. */
  function syncScanLiveness(): void {
    const active = hasOutstandingWork();
    if (active === scanActive) return;
    scanActive = active;
    if (active) {
      deps.applyScanEvent?.({ kind: "issued", streamHandle: CANDIDATE_SCAN_HANDLE });
    } else {
      deps.applyScanEvent?.({ kind: "reset" });
    }
  }

  /** Viewport-residency cut P4, item C (24(d)'s own recommendation): "the status line IS the
   * visibility -- no tile readout," so this is never surfaced in `.residency-status` itself, only in
   * the always-on `[render-trace]` console class (`traceCandidateResidencyStatus` below) --
   * cumulative across this WHOLE session (not one batch's own `evictedTileKeys.length`, which
   * `traceTileIngest`/`WorkingCanvas.tsx` already logs per call), so a diagnosis session can read
   * "how many tiles has this session evicted so far" off ONE line rather than summing every
   * `tile-ingest` line itself. Reset on `reissueUnrestricted` (a fresh generation starts a fresh
   * eviction history, mirroring `manager.clearAll()`'s own "a fresh generation starts unconstrained"
   * doc comment). */
  let evictedTileCountSession = 0;

  /** Viewport-residency cut P4 (decisions 24(a)/(b)): recomputes the declared-partial-view status
   * from this session's own current truth -- `manager.overBudget` (item D's own "callback/state
   * field only" seam, set exclusively by `ingestAndMaybeEstablishFrame`'s over-budget batch outcome
   * and cleared by `handleViewportChange`'s own fit re-check) and `canvas.getResidentCounts()`'s
   * `totalResidentFeatures` -- and forwards ONE `ResidencyStatusEvent` to `deps.onResidencyStatusChange`
   * so `App.tsx` reduces it through the exact same `nextResidencyStatus` machine baseline's own
   * ceiling-refusal status already goes through.
   *
   * `viewportTotal` is always `null` here: no wire mechanism in this cut reports an undelivered
   * tile's own feature count (`ResidencyStatus`'s own doc comment, `residencyStatus.ts`), so an
   * honest per-viewport total never exists to report -- `residencyStatusText` degrades to the
   * no-total wording accordingly. Never called when `canvas` is `null` (nothing to read counts off,
   * and no session UI is mounted to show a status to).
   *
   * **P5f complex-gate should-fix 1, the mid-fill "Showing all N" bug.** Before this fix, ANY call
   * here with `overBudget === false` emitted `candidate-within-budget` -- "Showing all N features in
   * view" -- even while the covering set for the CURRENT viewport still had tiles queued, mid-mint, or
   * in flight: `N` was only "all of what has arrived SO FAR," not "all of what the viewport needs,"
   * and a user reading "Showing all 40,000 features in view" while a dozen more tiles were still
   * streaming in was reading a claim that was not yet true. Fixed by gating the within-budget event on
   * `isFillComplete()` below -- over-budget is UNCHANGED (still emitted unconditionally the moment
   * `manager.overBudget` is `true`: that is a definite current fact, never a "not finished yet"
   * ambiguity the way within-budget's "N is everything" claim is). While not over budget but not yet
   * complete, this function emits NOTHING (docs/01: absence is honest; a wrong "all" is not) -- the
   * prior status, if any, is left exactly as it was until this session next has something true to say
   * (the next `emitResidencyStatus` call once the fill actually completes, or one of the shared
   * `query-issued`/`dataset-changed`/`delivery-complete` clears). */
  function isFillComplete(): boolean {
    if (manager.overBudget) return false;
    if (manager.trackedTileCount > 0) return false;
    if (!canvas) return false;
    for (const tileKey of lastCoveringTileKeys) {
      if (!canvas.isTileResidentInCandidateSet(tileKey)) return false;
    }
    return true;
  }

  function emitResidencyStatus(): void {
    if (!canvas) return;
    const { totalResidentFeatures } = canvas.getResidentCounts();
    const overBudget = manager.overBudget;
    if (isInstrumentedBuild()) {
      // P5f complex-gate should-fix 6: gated behind the instrument's own enable, unlike this file's
      // OTHER always-on render-trace calls (`traceViewportQuery`/`traceStreamIssued`) -- see
      // `traceCandidateResidencyStatus`'s own doc comment (`diagnostics/renderTrace.ts`) for why this
      // is safe with respect to the dual-arm identity guard's own `FIELD_SEQUENCE_EVENTS`.
      traceCandidateResidencyStatus(dataset, overBudget, totalResidentFeatures, evictedTileCountSession);
    }
    if (overBudget) {
      deps.onResidencyStatusChange?.({ kind: "candidate-over-budget", residentFeatureCount: totalResidentFeatures, viewportTotal: null });
      return;
    }
    if (!isFillComplete()) return; // mid-fill -- see this function's own doc comment above
    deps.onResidencyStatusChange?.({ kind: "candidate-within-budget", residentFeatureCount: totalResidentFeatures });
  }

  const manager = new TileViewportStreamManager({
    dataset,
    residency: { isTileResident: (tileKey) => canvas?.isTileResidentInCandidateSet(tileKey) ?? false },
    onBatch: (tileKey, streamHandle, batchSeq, payload) => {
      countTileStreamIssuedOnce(tileKey); // catches a queued-then-issued tile never seen in `issued`
      ingestAndMaybeEstablishFrame(tileKey, streamHandle, batchSeq, payload);
    },
    onTileSuperseded: (tileKey) => {
      countTileStreamEndedOnce(tileKey);
      canvas?.clearTile(tileKey);
      syncScanLiveness(); // P5f should-fix 3: a tile just left this manager's tracked set
    },
    onTerminal: (tileKey, streamHandle, terminal) => {
      countTileStreamIssuedOnce(tileKey); // a stream that terminated without ever delivering a batch
      countTileStreamEndedOnce(tileKey);
      // Item B's own scope: the candidate arm's over-budget state is maintained elsewhere in this
      // module; a genuine stream FAILURE (as opposed to a declared-ceiling condition, which this arm
      // never raises) has no dedicated UI wiring yet -- P4's own job ("P4 renders the state"), not
      // this piece's. Logged so it is at least visible, not silently dropped (ADR-010 rule 8).
      logSessionEvent("candidate-tile-terminal", `${tileKey} ${streamHandle}: ${terminal.kind} — ${terminal.detail}`);
      syncScanLiveness(); // P5f should-fix 3: this tile's own stream just reached a terminal state
    },
  });

  function ingestAndMaybeEstablishFrame(
    tileKey: string,
    _streamHandle: string,
    _batchSeq: number,
    payload: Uint8Array
  ): void {
    if (!canvas) return;
    const outcome = canvas.pushTileBatch(tileKey, _streamHandle, _batchSeq, payload);
    // Item C/D evidence (this piece's own smoke-validation criterion): dedupe/eviction counters are
    // console-visible via `WorkingCanvas.tsx`'s own `traceTileIngest` call, right where `pushTileBatch`
    // computes `outcome` -- `diagnostics/renderTrace.ts` is this codebase's own "console-only
    // diagnostic instrumentation" sink (its own top doc comment), unlike `logSessionEvent`
    // (`diagnostics/log.ts`), which persists to a Rust-side session log a CDP-driven harness's own
    // console capture never observes -- the wrong sink for evidence a smoke run needs to SEE.
    //
    // P5f complex-gate should-fix 4: this function no longer establishes the grid frame itself --
    // `tileGrid.ts`'s own doc comment declares the anchor as the untiled first look's batches "all
    // ... unioned", not its first delivering batch alone. `latestUnionedExtent` tracks the running
    // union `outcome.fitAnchor` here (fed by every batch, tile-keyed or `INITIAL_TILE_KEY`;
    // `TileBatchIngestOutcome.fitAnchor`'s own doc comment names it "the dataset-lifetime union of
    // every batch extent this instance has ever admitted"); the untiled query's own `onTerminal`
    // (`issueUntiledQuery` below) is the one place that actually calls `establishFrameFromExtent`,
    // once, at that stream's own natural end.
    latestUnionedExtent = outcome.fitAnchor;
    if (outcome.overBudget) {
      const unrequested = [...lastCoveringTileKeys].filter((k) => !canvas.isTileResidentInCandidateSet(k));
      manager.setOverBudget(true, unrequested);
    }
    evictedTileCountSession += outcome.evictedTileKeys.length;
    // Viewport-residency cut P4: every ingest may have moved `manager.overBudget` or the resident
    // feature count -- recompute and forward the declared-partial-view status after each one.
    emitResidencyStatus();
    syncScanLiveness(); // P5f should-fix 3: establishing the frame can start tile planning downstream
  }

  /** P5f complex-gate should-fix 4: derives the tile grid frame's own anchor from `extent` (the
   * untiled first look's own FULL running union, `latestUnionedExtent`) and establishes it --
   * `establishGridFrame`'s own "no-op past the first call" contract makes this safe to call again on
   * a later generation's own reissue (the underlying frame never actually moves after the first real
   * dataset session's own establishment; only this function's local `frameEstablished` bookkeeping
   * updates). A no-op if `extent` is `null` (every batch this stream ever delivered carried no
   * geometry -- nothing to anchor a frame to; `mintAndStart`'s own "unreachable in practice" caveat
   * for a similar case applies here for the same reason: the untiled query establishing the very
   * frame everything else depends on is not expected to ever see this branch in a real session with
   * real data). */
  function establishFrameFromExtent(extent: AuthoritativeBbox | null): void {
    if (frameEstablished || !extent) return;
    const target = chooseFitTarget(extent);
    if (!target) return;
    manager.establishGridFrame(target);
    const frame = manager.gridFrame;
    if (frame) {
      canvas?.establishTileGridContext(frame, manager.activeLevel);
      frameEstablished = true;
    }
  }

  async function issueUntiledQuery(bbox: Bbox | null, filter: Filter | null): Promise<RequestOutcome> {
    if (stopped) return { kind: "stopped" };
    // Viewport-residency cut P3i-c (gap G-B): mirrors `ViewportStreamManager.requestViewport`'s own
    // `traceViewportQuery` call -- always-on render-trace (never instrument-gated), fired on this
    // session's own untiled "first look"/reissue attempt, the candidate arm's own analogue of
    // baseline's initial unfiltered query.
    traceViewportQuery(dataset, bbox, null);
    // P5f complex-gate should-fix 4: BOUNDED now (`UNTILED_FIRST_LOOK_ROW_LIMIT`), where this call
    // used to pass `limit: null` (unbounded) and rely on an early self-cancel once the frame was
    // established from the first batch alone -- see `establishFrameFromExtent`'s own doc comment and
    // `tileGrid.ts`'s top doc comment for the full account of why this changed. Propagates a refusal
    // (`SkpCallError`) unchanged -- see this module's own doc comment.
    const { stream } = await viewportQuery(dataset, bbox, null, encodeDecU64(BigInt(UNTILED_FIRST_LOOK_ROW_LIMIT)), filter);
    if (stopped) {
      await skpCancel(stream).catch(() => {});
      return { kind: "stopped" };
    }
    const attach = await dataPlaneAttach();
    if (stopped) {
      await skpCancel(stream).catch(() => {});
      return { kind: "stopped" };
    }
    untiledStreamHandle = stream;
    syncScanLiveness(); // P5f should-fix 3: the untiled first-look/reissue stream just became outstanding
    let nextSeq = 0;
    if (isInstrumentedBuild()) {
      recordResidencyStreamIssued();
    }
    const sink: StreamSink = {
      onOpen: () => {},
      onBatch: (batchPayload) => {
        if (untiledStreamHandle !== stream) return; // superseded by a later reissue
        // Viewport-residency cut P3i (RESIDENCY-PREREGISTRATION.md §12 Amendment 15): DEV-only --
        // this session IS the manager for the untiled "first look" stream (no separate
        // `TileViewportStreamManager` object owns it), so this is the earliest client-observable
        // moment for its own data-plane bytes, mirroring `viewportStreamManager.ts`'s own hook.
        if (isInstrumentedBuild()) {
          recordResidencyBatchArrived();
        }
        const seq = nextSeq++;
        // P5f complex-gate should-fix 4: no longer self-cancels here on the first delivering batch --
        // the untiled "first look" now runs to its own natural terminal (bounded by
        // `UNTILED_FIRST_LOOK_ROW_LIMIT`, `issueUntiledQuery`'s own doc comment) so
        // `establishFrameFromExtent` can anchor the grid frame on the WHOLE stream's own union, not
        // this one batch alone -- see `onTerminal` below, and `tileGrid.ts`'s top doc comment for the
        // full account of why the anchor must be the complete union.
        ingestAndMaybeEstablishFrame(INITIAL_TILE_KEY, stream, seq, batchPayload);
      },
      onProgress: () => {},
      onTerminal: () => {
        if (untiledStreamHandle === stream) untiledStreamHandle = null;
        if (isInstrumentedBuild()) {
          recordResidencyStreamEnded();
        }
        // P5f complex-gate should-fix 4: THE establishment point -- this stream (bounded, run to its
        // own natural end) has now delivered everything it ever will; `latestUnionedExtent` is its
        // own complete, final union.
        establishFrameFromExtent(latestUnionedExtent);
        syncScanLiveness(); // P5f should-fix 3: covers a genuine terminal (failure/complete/cancel)
      },
    };
    startStream({ url: attach.url, subprotocols: attach.subprotocols, ticketHandle: stream, sink });
    // Viewport-residency cut P3i-c (gap G-B): mirrors `ViewportStreamManager.requestViewport`'s own
    // `traceStreamIssued` call, fired at the same moment -- right after the real mint, never before.
    traceStreamIssued(dataset, stream);
    return { kind: "issued", streamHandle: stream };
  }

  // Item A: "same debounce/throttle constants" -- the identical `debounce(fn, VIEWPORT_QUERY_MIN_
  // INTERVAL_MS)` call baseline's own pan/zoom debounce (`App.tsx`'s `[admitted]` effect) already
  // uses, not a value or mechanism of this module's own.
  const debounced = debounce((bbox: AuthoritativeBbox) => handleViewportChange(bbox), VIEWPORT_QUERY_MIN_INTERVAL_MS);

  function handleViewportChange(bbox: AuthoritativeBbox): void {
    if (stopped) return;
    const outcome = manager.onCameraChange(bbox, currentFilter);
    if (outcome.kind !== "planned") return;
    // The common case: a tile the manager just began minting a real ticket for (`beginIssue`) --
    // counted here, at plan time, rather than waiting for its first batch/terminal to prove it.
    for (const tileKey of outcome.issued) {
      countTileStreamIssuedOnce(tileKey);
    }
    const covering = [...outcome.issued, ...outcome.queued, ...outcome.alreadyResident];
    lastCoveringTileKeys = new Set(covering);
    const viewCentre = { x: (bbox.xmin + bbox.xmax) / 2, y: (bbox.ymin + bbox.ymax) / 2 };
    const fits = canvas?.applyTileViewportContext(covering, viewCentre) ?? true;
    if (fits) manager.setOverBudget(false);
    // Viewport-residency cut P4: a pan/zoom re-plan may have changed `manager.overBudget` (cleared
    // above) or the resident feature count (eviction inside `applyTileViewportContext`) even with no
    // new batch arriving -- recompute and forward the status here too, so it stays current across a
    // pan while over budget (D's own transition requirement), not only on the next batch.
    emitResidencyStatus();
    syncScanLiveness(); // P5f should-fix 3: a plan may have issued/queued/settled tile work
    // P5f complex-gate should-fix 2 (the "undeclared fan-out" half): never silent -- recorded via the
    // same session-event log sink `onTerminal` above already uses for other diagnostic-only facts.
    if (outcome.coveringTruncated) {
      logSessionEvent(
        "candidate-covering-truncated",
        `${dataset}: covering set truncated by ${outcome.truncatedCount} tile(s) beyond MAX_QUEUED_TILES`
      );
    }
  }

  return {
    manager,
    onViewportChanged: (bbox) => debounced.call(bbox),
    /** P5f complex-gate must-fix 4 (the double-debounce fix): exposes this session's OWN internal
     * debounce's `cancel()` -- `App.tsx` no longer wraps `onViewportChanged` in a SECOND debounce of
     * its own (that was the bug: two stacked 120 ms trailing-edge debounces = +120 ms systematic
     * candidate-arm handicap on the primary measured quantity), so `viewportDebounceRef.current
     * ?.cancel()` (the `cancelPendingDebounce` seam `applyFilter`'s Apply/Clear flow and the E2E
     * `queryWithFilter` hook both already call) needs somewhere to reach THIS debounce directly --
     * see `App.tsx`'s own `makeCandidateViewportDispatcher`. */
    cancelPendingViewportChange: () => debounced.cancel(),
    reissueUnrestricted: async (bbox, filter) => {
      currentFilter = filter;
      debounced.cancel();
      manager.clearAll();
      canvas?.clearAllTiles();
      canvas?.resetFitForNewGeneration();
      frameEstablished = false;
      lastCoveringTileKeys = new Set();
      latestUnionedExtent = null; // a fresh generation's own untiled query starts its own union over
      evictedTileCountSession = 0; // a fresh generation starts a fresh eviction history
      // P5f complex-gate should-fix 5: before this fix, `countedIssuedTileKeys` survived a full clear
      // untouched -- a tile key counted "issued" in a PRIOR generation stayed in this set forever, so
      // if the SAME tile key was ever issued again in a LATER generation, `countTileStreamIssuedOnce`
      // silently treated it as already-counted (`if (countedIssuedTileKeys.has(tileKey)) return;`) and
      // skipped incrementing `streamsIssued`/`tilesRequested` for it a second time -- undercounting
      // every generation after the first. Swept here, alongside every other per-generation counter
      // this function already resets (`evictedTileCountSession` immediately above).
      countedIssuedTileKeys.clear();
      // Viewport-residency cut P4 (decisions 24(a)/(b)): "clears on ... query-issued" -- the SAME
      // event baseline's own `issueViewportQuery` feeds `nextResidencyStatus` for an Apply/Clear
      // (App.tsx). Fired here, at the clear itself (residency truly is empty at this instant), not
      // only in App.tsx's dataset-open call to this function -- Apply/Clear reach this same seam.
      deps.onResidencyStatusChange?.({ kind: "query-issued" });
      syncScanLiveness(); // P5f should-fix 3: the clear may have ended every tracked tile's own work
      return issueUntiledQuery(bbox, filter);
    },
    stop: async () => {
      stopped = true;
      debounced.cancel();
      await manager.stop();
      if (untiledStreamHandle) {
        await skpCancel(untiledStreamHandle).catch(() => {});
        untiledStreamHandle = null;
      }
      // Deliberately NOT `syncScanLiveness()` here: this method resolves asynchronously, and by the
      // time it does the caller (a dataset close, or `App.tsx`'s own effect cleanup on a REMOUNT) may
      // no longer own the freshest `scanState` -- exactly rider 3's own wrong-instance-callback
      // footgun (`makeManagerCallbacks`'s doc comment) for a different callback. Cancel's own scan
      // transition happens SYNCHRONOUSLY at the cancel call site instead (`App.tsx`'s own Cancel
      // handler dispatches `applyScanEvent` itself, before ever calling into this session) --
      // "transitions AT THE CANCEL CALL SITE", the same discipline `nextScanState`'s own
      // `cancelledByUser` case documents for baseline.
    },
  };
}
