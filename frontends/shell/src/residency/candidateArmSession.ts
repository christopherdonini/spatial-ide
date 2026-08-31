// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import type { WorkingCanvasHandle } from "../canvas/WorkingCanvas";
import { chooseFitTarget } from "../canvas/extent";
import { MAX_RESIDENT_VERTICES } from "../canvas/limits";
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

/** Architect re-verification, viewport-residency cut P6b, item 7: the declared margin `hasHeadroom`
 * (this session's own `TileResidencyAccessor`, below) tightens to -- a partial tile is let back into
 * planning only while resident vertices sit strictly BELOW this fraction of `MAX_RESIDENT_VERTICES`,
 * not merely below the hard ceiling itself. Named and declared here (ADR-010 rule 6: "declared, not
 * discovered") rather than inlined at its one call site, so its own value and rationale are legible
 * without reading `hasHeadroom`'s own body. `0.9` is a DECLARED choice, not a derived or measured
 * one -- see `hasHeadroom`'s own doc comment for what it prevents and why this number, not a smaller
 * or larger one, was picked (one full tile's own worth of margin against the re-scan/trim/cancel
 * thrash the architect's item 7 names). */
const HEADROOM_REFETCH_FRACTION = 0.9;

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
  /** Re-review S4: the MOST RECENT `TilePlanOutcome.coveringTruncated` (`TileViewportStreamManager
   * .onCameraChange`'s own "more covering tiles existed than this round's capacity allowed" flag) --
   * `isFillComplete` below reads this too, alongside every covering tile's own completeness, so a
   * truncated covering set can never read as "all" even when every tile this round DID attempt is
   * itself fully resident (there is a whole tile it never even tried, by construction). Reset to
   * `false` on `reissueUnrestricted` -- a fresh generation starts with no truncation history of its
   * own, mirroring `lastCoveringTileKeys`'s own reset. */
  let lastCoveringTruncated = false;
  /** Architect re-verification, viewport-residency cut P6b, item 1-2: the sentinel `isFillComplete`
   * below reads FIRST -- `false` until `handleViewportChange`'s own camera-change plan has run at
   * least once THIS generation. Before this fix, `isFillComplete()` read `lastCoveringTileKeys`
   * (initialized empty, above) and found nothing to disagree with an empty covering set -- vacuously
   * `true` -- so the bootstrap untiled first look's own ingest (`ingestAndMaybeEstablishFrame`, called
   * from `issueUntiledQuery`'s `onBatch`, which runs BEFORE any real camera-change plan ever could,
   * since planning needs a real `onViewportChanged` event) could emit `candidate-within-budget`
   * ("Showing all N features in view") over a set that was never planned at all, merely whatever the
   * row-limited bootstrap (`UNTILED_FIRST_LOOK_ROW_LIMIT`) happened to admit so far -- the surviving
   * sibling of Defect A. Set `true` the moment `manager.onCameraChange` returns `{kind: "planned"}`
   * (`handleViewportChange` below) -- a plan that returns "planned" with a genuinely EMPTY covering
   * set (e.g. a viewport outside every tile the grid frame covers) still counts as "a plan ran": this
   * sentinel gates only "has planning ever had a chance to disagree", never re-derives from the
   * covering set's own size. Reset to `false` on `reissueUnrestricted` -- a fresh generation has no
   * plan of its own yet either, exactly like every other per-generation flag this function resets. */
  let hasPlanned = false;
  /** P5f complex-gate should-fix 4: the running union of every batch the CURRENT untiled first-look/
   * reissue stream has delivered so far (`ingestAndMaybeEstablishFrame`'s own `outcome.unionedExtent`,
   * which already accumulates across calls) -- read once, at that stream's own natural terminal
   * (`issueUntiledQuery`'s `onTerminal`), to derive the grid frame's anchor from ALL of that stream's
   * batches, not its first alone (`tileGrid.ts`'s own doc comment has the full account). Reset
   * implicitly by `reissueUnrestricted`'s own full clear (a fresh generation's untiled query starts
   * this accumulation over, the same way `evictedTileCountSession`/`lastCoveringTileKeys` reset). */
  let latestUnionedExtent: AuthoritativeBbox | null = null;
  /** Architect re-verification, viewport-residency cut P6b, item 2b: the running count of rows the
   * CURRENT untiled first-look/reissue stream has delivered so far under `INITIAL_TILE_KEY`
   * (`outcome.rowsAdmitted + outcome.duplicatesDropped` -- every row the server actually sent this
   * batch, before any budget trim; a trim event already marks this tile partial through
   * `tileIngest.ts`'s own `trimmed` path regardless, so the undercount that specific case would
   * introduce here is harmless -- it is already partial by a different, correct route). Compared
   * against `UNTILED_FIRST_LOOK_ROW_LIMIT` at the stream's own terminal (`issueUntiledQuery`'s
   * `onTerminal` below) to tell the two terminals honestly apart: a stream that delivered `>=` the
   * limit was truncated BY it (real rows may exist beyond what this look ever saw), a stream that
   * completed with fewer rows than the limit ran to its own genuine end. Reset on
   * `reissueUnrestricted`, exactly like `latestUnionedExtent` above -- a fresh generation's own
   * untiled query starts this count over. */
  let untiledRowsSeen = 0;
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
   * `query-issued`/`dataset-changed`/`delivery-complete` clears).
   *
   * **Viewport-residency cut P6a, Defect A (architect gate, blocking): "requires all covering tiles
   * COMPLETE (not merely present)."** Before this piece, the per-tile check below read
   * `isTileResidentInCandidateSet` -- `true` for a tile that was trimmed to the budget boundary just
   * as readily as for one that holds everything its bbox covers, so "Showing all N features in view"
   * could fire over a covering set that included a genuinely truncated tile. `isTileCompleteInCandidateSet`
   * (`WorkingCanvasHandle`, backed by `TileResidentSet.isTileComplete`) is the stronger fact: resident
   * AND not durably partial.
   *
   * **Architect re-verification, viewport-residency cut P6b, items 1-2 (the lift condition): "vacuously
   * true before the first camera-change plan."** Before this fix, a bootstrap batch arriving via the
   * untiled first look (`issueUntiledQuery`'s `onBatch`, which runs before `handleViewportChange` ever
   * could -- planning needs a real `onViewportChanged` event) reached this function with
   * `lastCoveringTileKeys` still its own empty initial value: `trackedTileCount === 0` (no real tile
   * has ever been tracked yet), `lastCoveringTruncated === false` (nothing has ever been truncated),
   * and the `for` loop below iterates zero times over an empty set -- every check trivially passes and
   * this function returned `true` with NOTHING ever having been planned. `hasPlanned` (this session's
   * own sentinel, set above) is checked FIRST, before any of the checks that follow: "no plan has ever
   * run" now reads `false` unconditionally, regardless of how vacuously the other checks would agree. A
   * plan that HAS run with a genuinely empty covering set (e.g. the current viewport sits outside every
   * tile the grid frame covers) still reaches the loop below and returns `true` from it exactly as
   * before -- `hasPlanned` gates only whether planning ever had the chance to disagree, never
   * re-derives "complete" from the covering set's own size. */
  function isFillComplete(): boolean {
    if (!hasPlanned) return false;
    if (manager.overBudget) return false;
    if (manager.trackedTileCount > 0) return false;
    // Re-review S4: a truncated covering set (`TilePlanOutcome.coveringTruncated`) means real,
    // never-even-attempted tiles exist beyond this round's own issuing/queueing capacity -- "truncated
    // ⇒ never all," regardless of how complete every ATTEMPTED tile is.
    if (lastCoveringTruncated) return false;
    if (!canvas) return false;
    for (const tileKey of lastCoveringTileKeys) {
      if (!canvas.isTileCompleteInCandidateSet(tileKey)) return false;
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

  // Viewport-residency cut P6a, Defect A: tile keys this session cancelled itself because it already
  // knew the remainder of that tile's own stream could not be admitted (`ingestAndMaybeEstablishFrame`'s
  // own `outcome.overBudget` branch, principle 7 -- stop decoding-to-discard). `onTileSuperseded` reads
  // this to tell "self-cancelled for budget reasons, keep what was admitted, mark partial" apart from
  // an ordinary out-of-view supersede, which drops the tile's residency entirely -- the two are
  // structurally different outcomes for `WorkingCanvasHandle`, not distinguishable from `tileKey`/
  // `streamHandle` alone. `.delete` (not `.has`) below consumes the entry synchronously, in the same
  // call this session's own `manager.cancelTile` triggers `onTileSuperseded` from -- there is no
  // asynchronous window between the two (`TileViewportStreamManager.cancelTileStream` calls it inline).
  const budgetCancelledTileKeys = new Set<string>();

  /** Viewport-residency cut P6d (the sticky-partial exit's own proof). Per-tile: whether EVERY batch
   * the tile's CURRENT stream (`streamHandle`) has delivered so far arrived untrimmed
   * (`!outcome.overBudget`, `ingestAndMaybeEstablishFrame` below). Consumed -- read, then deleted --
   * at that same stream's own `manager.onTerminal` callback: `terminal.kind === "Completed"` AND this
   * flag still `true` is exactly `TileResidentSet.markTileComplete`'s own required proof ("a refetch
   * generation that delivered everything untrimmed and reached its own natural Completed terminal" --
   * see that method's own doc comment, `tileResidentSet.ts`). Keyed by tile key, not stream handle
   * alone: `TileViewportStreamManager` guarantees at most one in-flight stream per tile key at a time,
   * so a batch whose OWN `streamHandle` differs from what this map has on file for that tile names
   * exactly "a new generation has begun" -- the stored `streamHandle` is what lets `onBatch` tell that
   * apart from "another batch of the SAME generation" without a separate counter. An entry whose
   * stream never reaches `Completed` (cancelled, self-cancelled for budget, failed, superseded) is
   * simply abandoned here with no partial-clearing consequence -- exactly `TileEntry.partial`'s own
   * "only a clean re-fetch can prove it" contract. Never populated for `INITIAL_TILE_KEY`: the untiled
   * first look has its own, separate, always-fully-cleared partial mechanism (`untiledRowsSeen`'s own
   * row-limit check below), never the sticky, evict-can-never-reach-it kind this map exists for. */
  const tileGenerationUntrimmed = new Map<string, { streamHandle: string; allUntrimmed: boolean }>();

  const manager = new TileViewportStreamManager({
    dataset,
    residency: {
      // Defect A: "planning treats partial as non-resident" -- `isTileCompleteInCandidateSet`, not
      // the older, weaker `isTileResidentInCandidateSet` (which stays `true` for a partial tile; that
      // meaning is still needed elsewhere, e.g. `ingestAndMaybeEstablishFrame`'s own "genuinely no
      // data at all" diagnostic listing below, so it was not repurposed here).
      isTileResident: (tileKey) => canvas?.isTileCompleteInCandidateSet(tileKey) ?? false,
      // Architect re-verification, viewport-residency cut P6b, item 7: tightened to a DECLARED margin
      // below the hard ceiling, not "any room at all" -- before this fix, `hasHeadroom` read `true` for
      // literally one vertex of headroom under `MAX_RESIDENT_VERTICES`, which let a partial tile back
      // into planning (Defect A's own drain-stop exception), immediately re-mint a stream, receive its
      // first batch, get trimmed to near-zero admitted rows by the SAME budget check it just barely
      // cleared, and cancel again -- a re-scan/trim/cancel thrash for near-zero benefit, exactly what
      // the architect's item 7 names. `HEADROOM_REFETCH_FRACTION` (below) is the fix: headroom now
      // means "genuinely below `HEADROOM_REFETCH_FRACTION` of budget," not "below budget by any
      // amount" -- one full tile's own worth of margin re-pays finding-4's per-tile first-batch cost
      // (kernel finding 4: a tighter viewport is a slower first batch) once per pan, instead of paying
      // it again for a re-fetch admitting next to nothing. The alternative considered (recording a
      // near-zero-admission tile as a "contaminant" and refusing to re-plan it specifically) was
      // superseded by this: tightening the margin fixes the thrash for every tile uniformly, without
      // needing to track a second, tile-specific "was this a wasted re-fetch" history of its own.
      hasHeadroom: () =>
        (canvas?.getResidentCounts().totalResidentVertices ?? 0) < HEADROOM_REFETCH_FRACTION * MAX_RESIDENT_VERTICES,
    },
    onBatch: (tileKey, streamHandle, batchSeq, payload) => {
      countTileStreamIssuedOnce(tileKey); // catches a queued-then-issued tile never seen in `issued`
      ingestAndMaybeEstablishFrame(tileKey, streamHandle, batchSeq, payload);
    },
    onTileSuperseded: (tileKey) => {
      countTileStreamEndedOnce(tileKey);
      // Defect A: a self-cancel for "remaining could not be admitted" keeps whatever was already
      // ingested (already marked partial at ingest -- see `ingestAndMaybeEstablishFrame`) and marks
      // the tile partial again here defensively (idempotent, sticky) rather than blanking it via
      // `clearTile` -- an ordinary out-of-view supersede (this set does NOT contain the key) still
      // clears the tile's residency entirely, unchanged from before this piece.
      if (budgetCancelledTileKeys.delete(tileKey)) {
        canvas?.markTilePartial(tileKey);
      } else {
        canvas?.clearTile(tileKey);
      }
      // P6d: this tile's own generation (if any -- a superseded tile may never have delivered a
      // batch at all) is abandoned, never completed -- no partial-clearing consequence, and no stale
      // entry left behind for a LATER generation's own tracking to be confused by.
      tileGenerationUntrimmed.delete(tileKey);
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
      // Viewport-residency cut P6d (the sticky-partial exit): `manager.onTerminal` is never called
      // for a self-cancel (`TileViewportStreamManager.mintAndStart`'s own `selfCancelledHandles`
      // short-circuit) -- every terminal reaching HERE is a genuine one, never one this session
      // itself triggered. `terminal.kind === "Completed"` combined with this generation's own
      // `allUntrimmed` flag (still bound to THIS `streamHandle` -- a stale, already-superseded
      // generation's tracking entry would have a DIFFERENT stored handle and is correctly ignored)
      // is exactly the proof `TileResidentSet.markTileComplete` needs: every batch this refetch
      // delivered arrived untrimmed, and the stream reached its own natural end, never cut off by
      // this session's own budget-exhaustion cancel (that path keeps the tile partial via
      // `budgetCancelledTileKeys` above, and never reaches a `Completed` terminal here at all).
      const generation = tileGenerationUntrimmed.get(tileKey);
      if (terminal.kind === "Completed" && generation?.streamHandle === streamHandle && generation.allUntrimmed) {
        canvas?.markTileComplete(tileKey);
      }
      tileGenerationUntrimmed.delete(tileKey);
      syncScanLiveness(); // P5f should-fix 3: this tile's own stream just reached a terminal state
    },
  });

  function ingestAndMaybeEstablishFrame(
    tileKey: string,
    streamHandle: string,
    _batchSeq: number,
    payload: Uint8Array
  ): void {
    if (!canvas) return;
    const outcome = canvas.pushTileBatch(tileKey, streamHandle, _batchSeq, payload);
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
    // Architect re-verification, viewport-residency cut P6b, item 2b: only the untiled first
    // look's own rows count toward `UNTILED_FIRST_LOOK_ROW_LIMIT` -- a real tile's own per-tile query
    // (`mintAndStart`'s `limit: null`) is never row-limited, so it has no "terminated by the limit"
    // terminal to distinguish in the first place.
    if (tileKey === INITIAL_TILE_KEY) {
      untiledRowsSeen += outcome.rowsAdmitted + outcome.duplicatesDropped;
    } else {
      // Viewport-residency cut P6d (the sticky-partial exit's own proof): fold this batch's own
      // untrimmed-ness into the tile's CURRENT generation, keyed by `streamHandle` -- a batch whose
      // handle differs from what this map has on file names a fresh generation (a refetch has begun),
      // so `allUntrimmed` resets to `true` before this batch's own outcome is ANDed in, rather than
      // inheriting a PRIOR generation's history. `manager`'s own `onTerminal` (above) reads this at
      // the stream's own `Completed` terminal.
      const existingGeneration = tileGenerationUntrimmed.get(tileKey);
      const carriedOver = existingGeneration?.streamHandle === streamHandle ? existingGeneration.allUntrimmed : true;
      tileGenerationUntrimmed.set(tileKey, { streamHandle, allUntrimmed: carriedOver && !outcome.overBudget });
    }
    if (outcome.overBudget) {
      const unrequested = [...lastCoveringTileKeys].filter((k) => !canvas.isTileResidentInCandidateSet(k));
      manager.setOverBudget(true, unrequested);
      // Viewport-residency cut P6a, Defect A (principle 7 -- stop decoding-to-discard): this tile's
      // own batch was just trimmed to the budget boundary -- evicting everything evictable already
      // could not make room for it (`ingestTileBatch`'s own `overBudget` contract) -- so the manager
      // already knows any further bytes still in flight for THIS tile's own stream cannot be admitted
      // either; "the manager knows remaining ≈ 0." Cancelling now, rather than letting more batches
      // arrive only to be decoded and trimmed to nothing, is that fact acted on. Never for
      // `INITIAL_TILE_KEY`: the untiled first-look stream has its own separate lifecycle
      // (`issueUntiledQuery` below), never tracked by `manager` at all -- `manager.cancelTile` would
      // be a silent no-op for it regardless, but the exclusion is named here to keep the intent
      // explicit rather than relying on that no-op. `budgetCancelledTileKeys` is what lets
      // `onTileSuperseded` (this session's own manager construction) tell this self-cancel apart from
      // an ordinary out-of-view supersede, so the tile's already-admitted (partial) content is KEPT,
      // never blanked.
      if (tileKey !== INITIAL_TILE_KEY) {
        budgetCancelledTileKeys.add(tileKey);
        void manager.cancelTile(tileKey);
      }
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
      // Re-review S5: one always-on session-log line, at the exact moment the frame freezes -- the
      // derived `baseSpan` (`deriveTileGridFrame`'s own `anchorSpan * PAD_FACTOR`, `tileGrid.ts`)
      // beside the observed union extent (`target`, the untiled first look's own COMPLETE union,
      // `chooseFitTarget(extent)`'s input) it was derived FROM. By construction the two agree at this
      // one instant (`baseSpan` is a pure function of `target`'s own span); the point of logging it
      // is the frame-drift hypothesis's own observable -- a LATER point in the same session log (e.g.
      // a full-trace run's own final "zoom to layer" union) can be compared against this one
      // establishment-time record to see whether the anchor the frame froze on ever drifted away from
      // the dataset's own real extent. `logSessionEvent` (not `traceViewportQuery`'s render-trace
      // class): this is a persisted, Rust-side session-log fact meant for a later diagnosis session to
      // read back, not a console-only line a live CDP capture would need to see in the moment.
      logSessionEvent(
        "candidate-grid-frame-established",
        `dataset=${dataset} baseSpan=${frame.baseSpan} originX=${frame.originX} originY=${frame.originY} ` +
          `level=${manager.activeLevel} observedUnion={xmin:${extent.xmin},ymin:${extent.ymin},xmax:${extent.xmax},ymax:${extent.ymax}}`
      );
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
        // Architect re-verification, viewport-residency cut P6b, item 2b: the two-terminal
        // distinction, honestly told apart. `untiledRowsSeen >= UNTILED_FIRST_LOOK_ROW_LIMIT` means
        // this look was truncated BY the row limit -- real rows may exist beyond what it ever saw, so
        // `INITIAL_TILE_KEY` is marked durably partial by construction, the same fact `markTilePartial`
        // already records for a budget-trimmed tile (Defect A's own machinery, reused here rather than
        // reimplemented). Fewer rows than the limit means the stream ran to its own genuine end --
        // left unmarked; `TileEntry.partial` already defaults to `false`, and there is nothing to
        // correct about a tile that is honestly complete.
        if (untiledRowsSeen >= UNTILED_FIRST_LOOK_ROW_LIMIT) {
          canvas?.markTilePartial(INITIAL_TILE_KEY);
        }
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
    // Architect re-verification, viewport-residency cut P6b, items 1-2: `isFillComplete`'s own
    // sentinel -- a plan has now genuinely run this generation, whatever its own covering set turns
    // out to be (even legitimately empty). See that function's own doc comment for the vacuous-true
    // bug this closes.
    hasPlanned = true;
    // The common case: a tile the manager just began minting a real ticket for (`beginIssue`) --
    // counted here, at plan time, rather than waiting for its first batch/terminal to prove it.
    for (const tileKey of outcome.issued) {
      countTileStreamIssuedOnce(tileKey);
    }
    const covering = [...outcome.issued, ...outcome.queued, ...outcome.alreadyResident];
    lastCoveringTileKeys = new Set(covering);
    lastCoveringTruncated = outcome.coveringTruncated === true; // re-review S4
    const viewCentre = { x: (bbox.xmin + bbox.xmax) / 2, y: (bbox.ymin + bbox.ymax) / 2 };
    const fits = canvas?.applyTileViewportContext(covering, viewCentre) ?? true;
    // Viewport-residency cut P6a, Defect A: unconditional now, in BOTH directions -- before this
    // piece, only `if (fits) manager.setOverBudget(false)` ran here, so a camera change that left the
    // flag `true` relied entirely on some earlier ingest call to have set it, and a camera change
    // whose own `applyTileViewportContext` re-check happened to fit (trivially likely the very next
    // call after a trim -- see that method's own doc comment) cleared it regardless of whether the
    // covering set still held a durably partial tile. `fits` is now DERIVED (partial-aware, not a bare
    // vertex-sum check), so recomputing it unconditionally on every camera change is what "kills the
    // one-camera-change transience": the flag is never stale, in either direction, past this call.
    manager.setOverBudget(
      !fits,
      fits ? [] : [...lastCoveringTileKeys].filter((k) => !canvas?.isTileResidentInCandidateSet(k))
    );
    // Viewport-residency cut P4: a pan/zoom re-plan may have changed `manager.overBudget` (recomputed
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
      lastCoveringTruncated = false; // re-review S4: a fresh generation starts with no truncation history
      hasPlanned = false; // P6b items 1-2: a fresh generation has no plan of its own yet either
      latestUnionedExtent = null; // a fresh generation's own untiled query starts its own union over
      untiledRowsSeen = 0; // P6b item 2b: a fresh generation's own untiled query starts this count over
      evictedTileCountSession = 0; // a fresh generation starts a fresh eviction history
      // P5f complex-gate should-fix 5: before this fix, `countedIssuedTileKeys` survived a full clear
      // untouched -- a tile key counted "issued" in a PRIOR generation stayed in this set forever, so
      // if the SAME tile key was ever issued again in a LATER generation, `countTileStreamIssuedOnce`
      // silently treated it as already-counted (`if (countedIssuedTileKeys.has(tileKey)) return;`) and
      // skipped incrementing `streamsIssued`/`tilesRequested` for it a second time -- undercounting
      // every generation after the first. Swept here, alongside every other per-generation counter
      // this function already resets (`evictedTileCountSession` immediately above).
      countedIssuedTileKeys.clear();
      // Viewport-residency cut P6a, Defect A: `manager.clearAll()` above already cancels every
      // in-flight tile stream and reports it superseded (out-of-view style, via `onTileSuperseded`),
      // so any entry this set still held is consumed there -- cleared again here defensively, the
      // same "swept alongside every other per-generation counter" discipline the comment above already
      // states, so a stale key can never survive into a later generation's own budget-exhaustion cancel.
      budgetCancelledTileKeys.clear();
      // P6d: a fresh generation starts with no refetch-untrimmed history of its own either -- swept
      // alongside every other per-generation map/counter this function already resets above.
      tileGenerationUntrimmed.clear();
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
