// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import type { WorkingCanvasHandle } from "../canvas/WorkingCanvas";
import { chooseFitTarget } from "../canvas/extent";
import { MAX_RESIDENT_VERTICES } from "../canvas/limits";
import { INITIAL_TILE_KEY, UNTILED_FIRST_LOOK_ROW_LIMIT } from "../canvas/tileGridConstants";
import type { TileGridLevel } from "../canvas/tileGridConstants";
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
import { fillActivity, settledState } from "./residencyStatus";
import type { ResidencyStatusEvent } from "./residencyStatus";
import { encodeDecU64 } from "../skp/codec";
import { cancel as skpCancel, viewportQuery } from "../skp/client";
import type { Bbox, Filter } from "../skp/types";
import { startStream } from "../streaming/adapterWs";
import { dataPlaneAttach } from "../streaming/dataPlaneClient";
import { debounce } from "../streaming/debounce";
import type { StreamSink, TerminalKind } from "../streaming/transport";
import { TileViewportStreamManager } from "../streaming/tileViewportStreamManager";
import type { TilePlanOutcome } from "../streaming/tileViewportStreamManager";
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
  /**
   * Viewport-residency cut P7: the tile grid level this session's own `TileViewportStreamManager`
   * constructs against -- `App.tsx`'s own dev-gated read of `residencyTileSizeLevel.ts`'s
   * `getResidencyTileSizeLevel()`, passed through as a plain value rather than this module importing
   * that DEV-only selector itself (the same "the caller reads DEV-gated state, this module only
   * consumes a value" separation `App.tsx`'s own arm check/`startCandidateArmSession` boundary already
   * establishes for `getResidencyArm()` -- this module has never imported `residencyArm.ts` either).
   * `undefined` or `null` (the selector's own "unset" value, `residencyTileSizeLevel.ts`'s own top doc
   * comment) both reach `TileViewportStreamManager`'s constructor as `level: undefined`, which resolves
   * to `DEFAULT_TILE_GRID_LEVEL` there -- EXACTLY today's implicit default, unchanged: before this
   * piece, the `TileViewportStreamManager` construction below passed no `level` option at all. Optional
   * so every pre-existing test/call site of this function keeps compiling and behaving unchanged. */
  tileGridLevel?: TileGridLevel | null;
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
   * or running -- teardown-only since the entry-32a repoint: its sole caller is `App.tsx`'s
   * dataset-close/unmount effect cleanup, never the operator's Cancel button. */
  stop: () => Promise<void>;
  /**
   * Item A (residency-debt cut 1b, decisions 32a/33b): the scoped relief the operator's Cancel button
   * now repoints to for a candidate-arm session. Entry 32's own ruling, verbatim (its rider elided
   * here): "32a — Cancel becomes the scoped relief, permanent kill leaves the UI (close/reopen
   * stays the hard reset)…".
   * Concretely: stop filling, keep the current partial view, let tiling resume on the next camera
   * change -- never `stop()`'s permanent kill. Calls `manager.relinquishOutstanding()` (real
   * `skpCancel` for every in-flight tile stream AND the queued/mid-mint backlog dropped, per 33b --
   * no new wire, the existing `cancel` SKP command), marks every relinquish-CANCELLED tile (never the
   * dropped-queued ones, which were never resident in the first place -- `markTilePartial`'s own "a
   * no-op for a tile this set has never heard of" contract (`tileResidentSet.ts`) makes calling it on
   * both harmless, but only the cancelled ones can possibly need it) durably partial so
   * `isFillComplete` can never read this session's fill as complete afterward (32a's own rider), then
   * re-syncs scan liveness and emits the `candidate-relinquished` status.
   *
   * **M1 (reviewer gate), entry 35 -- RULED 2026-09-05.** The human, verbatim: "accept as recommended —
   * yes with grid frame, no at bootstrap; then re-check whether string 3's state is still reachable."
   * The old scope boundary (this lever reaching the TILE fill only,
   * `manager.relinquishOutstanding()` above, never the untiled first-look/reissue stream) is now
   * PARTIAL, not absolute: the implementation below ALSO cancels `untiledStreamHandle` whenever
   * `manager.gridFrame` (the manager's own frame accessor) is already non-`null` -- the anchor hazard
   * (cancelling before the stream's own terminal would freeze the grid on a truncated union,
   * `establishFrameFromExtent`'s own doc comment) lives ONLY in the frameless bootstrap window, which
   * stays uncancellable and documented, exactly as ruled. While that window's own untiled stream is
   * still running at the moment this fires, `emitResidencyRelinquished` below emits the HONEST variant
   * of the status (`untiledStreamStillRunning: true`) rather than the ordinary "Filling stopped"
   * wording, which would be false in that window (the untiled stream keeps delivering batches) -- per
   * the ruling's own follow-on ("then re-check whether string 3's state is still reachable"), this
   * variant is now reachable ONLY from that frameless window (bootstrap, or an Apply/Clear reissue
   * racing the first look's own frame-establishing terminal): once a frame exists, THIS method's own
   * cancel above always fires first, clearing `untiledStreamHandle` before `emitResidencyRelinquished`
   * ever reads it. `residencyStatus.ts`'s own `relinquishedUntiledStillRunningText` is reworded
   * accordingly (no longer "the initial data load" -- a frameless reissue is not initial).
   *
   * Deliberately does NOT stop this session (`stopped` stays `false`), does NOT clear residency
   * (`canvas.clearTile`/`clearAllTiles` are never called -- the whole point is that the resident view
   * is RETAINED), and does NOT reset the grid frame (`manager`'s own `establishGridFrame` is never
   * re-invoked) -- see `TileViewportStreamManager.relinquishOutstanding`'s own doc comment for the
   * identical guarantees at the manager layer this method sits directly on top of.
   *
   * **Synchronous, unlike `stop()` -- and that difference is why this method safely dispatches its
   * OWN scan-liveness transition inline, rather than requiring the call site to pre-empt it (a
   * hazard only for `stop()`, which truly awaits real work and could race a fresher
   * `scanState`).** `manager.relinquishOutstanding()` never awaits anything (its own doc comment), so
   * `syncScanLiveness()` here runs in the SAME tick as the caller's own click handler -- "transitions
   * AT THE CANCEL CALL SITE" (P4 binding note 6) still holds, just one call frame deeper. Dispatching
   * `{kind:"reset"}` a SECOND time at `App.tsx`'s own call site (mirroring the old `stop()` path) would
   * desync this session's own `scanActive` bookkeeping from what `syncScanLiveness` believes, silently
   * swallowing the very next genuine `{kind:"issued"}` transition once tiling resumes -- so this is the
   * ONE place that dispatch happens for this lever, not the call site.
   */
  relinquishFill: () => { cancelledInFlight: string[]; droppedQueued: string[] };
  /** M2 (reviewer gate, residency-debt cut 1b): a pure, read-only view of whether this session's own
   * fill currently reads complete -- exposed for direct assertion (this module's own tests included),
   * the same read-only-getter-for-assertion shape `manager.overBudget`/
   * `manager.trackedTileCount`/`manager.gridFrame` already take. Never a second copy of the predicate --
   * `emitResidencyStatus`'s own within-budget claim reads this SAME function as one of `settledState`'s
   * own inputs (`currentSettledState`, `fillComplete: isFillComplete()`), not merely `isFillComplete()`
   * alone any more since Item B narrowed that gate (residency-debt cut 1b) -- there is still no second
   * copy of this function's own covering-tile loop anywhere else in this module. */
  isFillComplete: () => boolean;
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
   * plan of its own yet either, exactly like every other per-generation flag this function resets.
   *
   * **M2 (reviewer gate, residency-debt cut 1b): also reset by `relinquishFill`.** A tile carried
   * in-flight across two plans is skipped by `onCameraChange`'s own new-candidate loop (already
   * tracked, so neither re-issued nor re-added to `alreadyResident`), so it never lands in
   * `lastCoveringTileKeys` at all -- if THAT tile is the one `relinquishFill` cancels,
   * `manager.trackedTileCount` reaches 0 without `lastCoveringTileKeys` ever having named it, and
   * `isFillComplete` below would read the fill complete over a user-stopped one (the surviving
   * covering-set gap this sentinel does not otherwise catch, since `trackedTileCount === 0` is
   * genuinely true by then). `relinquishFill` resets this flag to `false` for exactly the same reason
   * it is `false` before the first plan ever ran: no plan has run yet SINCE the relief fired, so
   * nothing has had the chance to disagree with whatever `lastCoveringTileKeys` happens to hold. The
   * next real `handleViewportChange` plan sets it `true` again -- a LATCH, not a permanent flip:
   * completeness can be earned again once a fresh plan has actually run.
   *
   * **B1 (re-reviewer gate, residency-debt cut 1b), SUPERSEDED by Piece 2(ii) (entry 36):** B1 used to
   * ALSO reset this flag from `manager`'s own `onTerminal` callback, unconditionally, for ANY
   * non-`Completed` terminal -- a blunt latch that closed the same carried-in-flight-across-two-plans
   * gap `relinquishFill`'s own paragraph above names (a tile invisible to `lastCoveringTileKeys`,
   * failing genuinely rather than by `relinquishFill`'s own cancel), but at the cost of silence: it
   * gave `isFillComplete()` no way to say WHY it was false, so `emitResidencyStatus` fell through to
   * its own "absence is honest" branch and emitted nothing at all over a genuinely failed fill. Entry
   * 36's own ruling ("silence and staleness never represent state") replaces it with TYPED accounting
   * instead: `failedCoveringTerminals` (below) records the failing tile key and terminal kind rather
   * than blindly resetting this flag, and `isFillComplete()` consults that set directly (its own doc
   * comment has the full account) -- `hasPlanned` itself is no longer touched by a terminal at all,
   * only by a fresh plan (`handleViewportChange`) or `relinquishFill`'s own, UNCHANGED, separate reset
   * (a user-stopped fill is a different reason for incompleteness than a genuine stream failure, and
   * keeps its own latch). */
  let hasPlanned = false;
  /** Piece 2(ii) (residency-debt cut 1b, entry 36): the typed-partiality accounting that REPLACES B1's
   * blunt `hasPlanned = false` latch (see that flag's own doc comment, immediately above, for the full
   * account of what this replaces and why). Keyed by tile key (`INITIAL_TILE_KEY` included, Piece
   * 2(iii)), valued by the terminal's own `TerminalKind` -- populated by `manager`'s own `onTerminal`
   * callback for any non-`Completed` terminal, and by the untiled sink's own `onTerminal` (below) for
   * the identical reason. Cleared at the top of every fresh `handleViewportChange` plan (a NEW plan
   * starts a new accounting window -- a failure recorded against a PRIOR covering set no longer bears
   * on this one, the same per-generation reset every other per-plan field here already gets) --
   * NEVER cleared by a terminal itself (a failure stays recorded until a real plan has had the chance
   * to try again, matching `hasPlanned`'s own latch shape -- "a LATCH, not a permanent flip:
   * completeness can be earned again once a fresh plan has actually run.", its own doc comment
   * above). `isFillComplete()`
   * reads `size > 0` as one more reason to read `false`; `currentSettledState()` passes
   * `hasCoveringFailure: size > 0` through as `settledState`'s own dedicated input, so the
   * classification can tell "not complete because of budget/truncation" apart from "not complete
   * because something genuinely failed" (`residencyStatus.ts`'s own doc comments have the full
   * account). */
  const failedCoveringTerminals = new Map<string, TerminalKind>();
  /** Item B (residency-debt cut 1b): `true` from the moment a viewport change is accepted for
   * debouncing (`onViewportChanged` below, at the `debounced.call` call site) until its debounced
   * handler actually runs (`handleViewportChange`'s own first line clears it, before any early return
   * -- "the handler ran" is true the instant its body starts, regardless of what the resulting plan
   * turns out to be) or is cancelled (`cancelViewportDebounce` below, this session's own wrapper around
   * `debounced.cancel()`, used by `cancelPendingViewportChange`/`reissueUnrestricted`/`stop`). Read by
   * `settledState` (`residencyStatus.ts`) via `emitResidencyStatus` below -- BS5's own text: "never
   * declared while `trackedTileCount > 0` or a re-plan is pending." A scheduled-but-not-yet-run
   * re-plan is exactly that pending re-plan; this flag is this session's own honest record of it. */
  let pendingViewportChange = false;
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
  /** Piece 1 (residency-debt cut 1b, entry 35): tile keys of every untiled stream this session has
   * itself cancelled (`relinquishFill`'s own frame-exists cancel, below, and `stop()`'s teardown
   * cancel) -- the untiled-stream analogue of `TileViewportStreamManager`'s own `selfCancelledHandles`
   * set (`tileViewportStreamManager.ts`), reused in SHAPE (not literally shared -- the untiled stream
   * is owned by this session, never by `manager`) so a self-issued cancel's own eventual, asynchronous
   * terminal is never misreported: the untiled sink's `onTerminal` (below) consults this set and, for a
   * self-cancelled handle, skips BOTH the new `logSessionEvent` call and the typed-partiality
   * accounting (Piece 2(iii)) -- an operator cancel or a dataset teardown is not a producer/transport/
   * decode failure, and is already recorded honestly through its own path (`candidate-relinquished`, or
   * simply torn down). */
  const selfCancelledUntiledStreams = new Set<string>();
  /** Piece 1 (residency-debt cut 1b, entry 35, "sticky per entry-1"): `true` from the moment
   * `relinquishFill` fires until the NEXT genuinely fresh camera-change plan consumes it
   * (`handleViewportChange`, below) -- the session-local record of "a `candidate-relinquished` status
   * is standing and has not yet been superseded by real new work." `nextResidencyStatus`
   * (`residencyStatus.ts`) refuses to let a later batch-driven within/over-budget reading silently
   * overwrite that status in place; a genuinely fresh plan is the one event honest enough to supersede
   * it, and this flag is what lets `handleViewportChange` fire the clearing transition
   * (`"candidate-fill-progress"`) at exactly that moment, once, regardless of what the plan's own
   * trailing `emitResidencyStatus()` call goes on to say (or stays silent about). */
  let relinquishClearPending = false;
  /** M-1 (re-reviewer gate, residency-debt cut 1b) / entry 35: `true` exactly when the LAST thing
   * `emitResidencyRelinquished` actually dispatched carried `untiledStreamStillRunning: true` -- i.e.
   * the frameless-bootstrap window, the only one that field can still fire from
   * (`emitResidencyRelinquished`'s own doc comment). The gap this closes: that window's own untiled
   * stream is deliberately left running, so its EVENTUAL, genuine terminal (never a self-cancel -- the
   * frameless window is uncancellable by ruling) is the one honest moment to say the "still running"
   * claim just became false; without tracking that a claim of that SHAPE is standing, the untiled
   * sink's own `onTerminal` (below) would have no way to tell "I should re-emit the ordinary
   * relinquished wording now" apart from "nothing relinquished is standing at all, stay silent" --
   * both look identical from inside `onTerminal` without this flag. Set `true`/`false` at the end of
   * `emitResidencyRelinquished` itself (mirroring the exact condition that field's own value used),
   * and reset `false` wherever `relinquishClearPending` is consumed by a genuinely fresh
   * plan/generation (`handleViewportChange`/`reissueUnrestricted`, below) -- the same "a fresh plan or
   * dataset/filter change supersedes the sticky status honestly" moments, so a LATER terminal for an
   * already-superseded relinquish never mistakenly re-emits a status nothing is standing for any more. */
  let lastEmittedRelinquishedUntiled = false;
  /** Piece 2(i) (residency-debt cut 1b, entry 36 rule (i)): `true` exactly when the LAST thing
   * `emitResidencyStatus` actually dispatched was `candidate-within-budget` with `settled: "complete"`
   * ("Showing all N features in view") -- read by that same function to decide whether a later silent
   * "not settled-complete" hit needs to actively CLEAR that claim (`"candidate-fill-progress"`) rather
   * than simply staying silent, so a stale "Showing all N" is never left standing by inertia once the
   * covering set genuinely stops reading complete (BS6, the twice-convicted class). Set `false` by
   * every OTHER outcome `emitResidencyStatus` can dispatch (over-budget, within-budget-failure, or the
   * clearing dispatch itself) and by a fresh generation (`reissueUnrestricted`) -- always an accurate
   * record of "is a complete-looking claim currently standing," never a stale snapshot. */
  let standingWithinBudgetComplete = false;
  /** S2 (reviewer gate, residency-debt cut 1b): `true` only for the duration of a manager call that can
   * SYNCHRONOUSLY cancel a tracked tile and trigger `onTileSuperseded` (this module's own manager
   * construction, S2's own "the settling moment itself" now-emits addition below) from WITHIN a call site
   * that is ITSELF about to call `emitResidencyStatus()` again right after -- three such sites, each set
   * this flag around the ONE manager call that can recurse into `onTileSuperseded` this way:
   * `ingestAndMaybeEstablishFrame`'s own budget self-cancel (`manager.cancelTile`),
   * `handleViewportChange`'s own re-plan (`manager.onCameraChange`, whose out-of-view loop can cancel
   * tiles before this function's own trailing call runs), and `reissueUnrestricted`'s own full clear
   * (`manager.clearAll`). WITHOUT this guard, a cancellation that happens to leave `trackedTileCount ===
   * 0` would fire `onTileSuperseded`'s own new call FIRST, then the enclosing function's own
   * pre-existing, unconditional trailing `emitResidencyStatus()` call fires a SECOND time right after --
   * both computing the identical content in the same synchronous tick, an avoidable double dispatch to
   * `deps.onResidencyStatusChange` (paraphrasing S2's own finding, not quoting it: verify there is no
   * emission storm here).
   * `onTerminal` (below) never needs this guard: unlike `onTileSuperseded`, it is never invoked
   * SYNCHRONOUSLY from within any of this module's own manager calls -- every real terminal arrives as
   * its own, independent, later event, so its new `emitResidencyStatus()` call is never nested inside
   * another one already about to fire. (Investigated per S2's own instruction: neither `nextResidencyStatus`
   * nor `App.tsx`'s own consumption of it, `setResidencyStatus(nextResidencyStatus(event))` -- a plain
   * `useState` setter -- dedupes on content anywhere in that pipeline; this codebase's own existing
   * precedent for this SHAPE of problem is `syncScanLiveness`'s own `scanActive` last-value compare, a
   * TRANSITION guard, not a content-hash cache -- a persistent content-hash cache was tried first here
   * and reverted: it also suppressed later, GENUINELY new dispatches whose content happened to
   * byte-match an EARLIER, unrelated one, which broke several pre-existing tests that assert a fresh
   * dispatch at a specific call site. This narrower, call-stack-scoped guard targets exactly the three
   * known synchronous-recursion sites instead, never a wider time-based comparison.) */
  let suppressNestedSupersededEmit = false;
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
    // Piece 2(ii) (residency-debt cut 1b, entry 36): a covering-tile (or untiled) terminal that failed
    // since the last plan means the fill did not complete as planned, full stop -- the SAME fact B1's
    // own `hasPlanned = false` latch used to force via a blunter route (`hasPlanned`'s own doc comment
    // above has the full account of the replacement). Checked here, not merely folded into
    // `settledState`'s own classification, so every OTHER reader of `isFillComplete()` (this session's
    // own M2 test seam included) keeps seeing one honest boolean, never two disagreeing sources of
    // "complete."
    if (failedCoveringTerminals.size > 0) return false;
    if (!canvas) return false;
    for (const tileKey of lastCoveringTileKeys) {
      if (!canvas.isTileCompleteInCandidateSet(tileKey)) return false;
    }
    return true;
  }

  /** Item B (residency-debt cut 1b): `settledState`'s own five inputs, read once per call so every
   * branch below shares the SAME reading rather than risking two calls disagreeing mid-function
   * (`manager.trackedTileCount`/`isFillComplete()`/`untiledStreamHandle` are all live reads of mutable
   * state, not frozen values). `isFillComplete()` is the SAME boolean the pre-existing within-budget gate
   * already computed -- never a second copy of its own covering-tile loop; see `settledState`'s own doc
   * comment (`residencyStatus.ts`) for the classification this derives.
   *
   * M1 (reviewer gate, residency-debt cut 1b, the "Item B input-list amendment"): `untiledStreamRunning:
   * untiledStreamHandle !== null` reads this session's own untiled-stream flag AT THIS CALL, read here so
   * it always reflects THIS instant's own truth -- the identical read `emitResidencyRelinquished` already
   * performs, "never a stale snapshot" (that function's own doc comment, which has the fuller account of
   * why the untiled stream needs a separate honest read at all: it is exempt from
   * `manager.trackedTileCount`). */
  function currentSettledState(): ReturnType<typeof settledState> {
    return settledState({
      hasPlanned,
      pendingViewportChange,
      trackedTileCount: manager.trackedTileCount,
      untiledStreamRunning: untiledStreamHandle !== null,
      fillComplete: isFillComplete(),
      // Piece 2(ii) (residency-debt cut 1b, entry 36): read at THIS instant, same "never a stale
      // snapshot" discipline `untiledStreamRunning` right above already follows.
      hasCoveringFailure: failedCoveringTerminals.size > 0,
    });
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
    const settled = currentSettledState();
    if (overBudget) {
      // Item A (residency-debt cut 1b), BS3: `stalled` names the held-queue-is-provably-frozen case
      // ("filling" is everything else about an over-budget state -- the ordinary wording already
      // covers it, unamended; see `residencyStatusText`'s own doc comment). `fillActivity` is pure --
      // this call site is what supplies its four inputs from this session's own state reads.
      const stalled =
        fillActivity({
          queuedCount: manager.queuedCount,
          overBudget,
          hasHeadroom: hasHeadroom(),
          inFlightCount: manager.inFlightCount,
        }) === "stalled";
      // Item B: `settled === "settled-partial"`/`"settled-partial-failure"` here is exactly
      // `isSettled && !isFillComplete()` (`isFillComplete()` reads `false` unconditionally while
      // `overBudget` is `true`, so this branch can never read `"settled-complete"`) -- structurally
      // mutually exclusive with `stalled` above: `stalled` requires `queuedCount > 0`, which requires
      // `manager.trackedTileCount > 0`, which the settled predicate excludes by construction (BS5,
      // ADR-028 Amendment 1). Piece 2(ii): a concurrent covering-tile failure is folded into the SAME
      // `"partial"` field here, never surfaced as its own wording on THIS branch -- the over-budget
      // sentence's own claim ("the render budget is full") stays true regardless of whether a failure
      // ALSO occurred, and `SETTLED_PARTIAL_FAILURE_TEXT`'s own distinct wording is reserved for the
      // within-budget path below, where a failure is the ONLY reason (never budget).
      deps.onResidencyStatusChange?.({
        kind: "candidate-over-budget",
        residentFeatureCount: totalResidentFeatures,
        viewportTotal: null,
        stalled: stalled || undefined,
        settled: settled === "settled-partial" || settled === "settled-partial-failure" ? "partial" : undefined,
      });
      standingWithinBudgetComplete = false; // Piece 2(i): a definite over-budget claim now stands, not "complete"
      return;
    }
    // Item B: the pre-existing within-budget gate (`isFillComplete()` alone) is narrowed to
    // `settled === "settled-complete"` -- strictly stronger, never weaker: `settled-complete` requires
    // `isFillComplete()` to be `true` PLUS `!pendingViewportChange` PLUS (M1) `!untiledStreamRunning`
    // (BS5's own text: "never declared while `trackedTileCount > 0` or a re-plan is pending"). Before
    // this fix, `isFillComplete()` alone never considered a scheduled-but-not-yet-run viewport-change
    // debounce -- a batch arriving on the untiled first-look/reissue stream (exempt from
    // `manager.trackedTileCount` -- see `ingestAndMaybeEstablishFrame`'s own budget-cancel doc comment
    // ("the untiled first-look stream has its own separate lifecycle" ... "never tracked by `manager`
    // at all", two fragments of that comment) and `issueUntiledQuery`'s own `onBatch` doc comment (this session IS the manager for that
    // stream -- no separate `TileViewportStreamManager` object owns it), below -- NOT this module's own
    // top doc comment, which never states this directly) while such a re-plan is
    // pending could reach this point with `isFillComplete()` genuinely `true` and declare "Showing all N
    // features in view" a re-plan was about to revise.
    //
    // Piece 2(ii) (residency-debt cut 1b, entry 36): `"settled-partial-failure"` is no longer folded
    // into the silent "absence is honest" branch below -- a genuine covering-tile (or untiled) failure
    // is honestly surfaced, its OWN wording (`SETTLED_PARTIAL_FAILURE_TEXT`, `residencyStatus.ts`),
    // never `"complete"` (BS6).
    if (settled === "settled-partial-failure") {
      deps.onResidencyStatusChange?.({
        kind: "candidate-within-budget",
        residentFeatureCount: totalResidentFeatures,
        settled: "partial-failure",
      });
      standingWithinBudgetComplete = false;
      return;
    }
    // `settled === "settled-partial"` here (not over budget, but a truncated covering set or a covering
    // tile that never completed, and no failure recorded) is deliberately left silent, same as
    // `isFillComplete() === false` always has been -- see this function's own "absence is honest" doc
    // comment above; this piece adds no new status kind for that specific combination.
    //
    // Piece 2(i) (residency-debt cut 1b, entry 36 rule (i)): if a "Showing all N" claim WAS standing
    // (the last thing this function actually emitted was `settled: "complete"`), it is now stale -- the
    // covering set just stopped reading complete -- and must not survive by inertia (BS6, the
    // twice-convicted class). Cleared through the shared `"candidate-fill-progress"` transition exactly
    // once, right here, never repeated on every subsequent silent call while nothing was ever standing
    // to begin with (`standingWithinBudgetComplete`'s own doc comment has the full account).
    //
    // S-4 (re-reviewer gate, residency-debt cut 1b): THE INVARIANT this dispatch depends on, stated
    // explicitly (previously living nowhere) -- `nextResidencyStatus` (`residencyStatus.ts`) reduces
    // `"candidate-fill-progress"` to `null` UNCONDITIONALLY (unlike the sticky rule's own within/
    // over-budget refusal, which only fires while `current?.kind === "candidate-relinquished"`), so if
    // this dispatch ever fired WHILE a `candidate-relinquished` status were standing, it would clear
    // that status out from under entry 35's own sticky rule -- honest only if a standing-complete
    // reading (`standingWithinBudgetComplete === true`) and a standing-relinquished one can never BOTH
    // be live at the moment this branch runs.
    //
    // The invariant is STRUCTURAL, not argued (S-A, this piece's own re-review): `relinquishFill`
    // clears `standingWithinBudgetComplete = false` in the same synchronous call that opens the
    // relinquished window (beside its `hasPlanned = false` latch), so a complete-looking claim
    // carried INTO the window is recorded as no longer standing the moment the relinquished status
    // replaces it -- this branch can never see a stale `true` beside a standing relinquished
    // status. Re-earning INSIDE the window is separately impossible until a fresh plan:
    // `settled === "settled-complete"` (the ONLY way the flag is set `true`, just below) requires
    // `hasPlanned`, which the same relinquish reset; both re-earn paths
    // (`handleViewportChange`'s fresh plan, `reissueUnrestricted`'s fresh generation) clear the
    // relinquished status honestly first. Closest-to-coexistence state pinned in
    // `candidateArmSession.test.ts`'s "the sticky-relinquished status, end-to-end" describe block.
    if (settled !== "settled-complete") {
      if (standingWithinBudgetComplete) {
        standingWithinBudgetComplete = false;
        deps.onResidencyStatusChange?.({ kind: "candidate-fill-progress" });
      }
      return; // mid-fill or a re-plan is pending -- absence is honest
    }
    standingWithinBudgetComplete = true;
    deps.onResidencyStatusChange?.({
      kind: "candidate-within-budget",
      residentFeatureCount: totalResidentFeatures,
      settled: "complete",
    });
  }

  /** Item A (decisions 32a/33b): the scoped-relief lever's own dedicated status emission -- NEVER
   * routed through `emitResidencyStatus` above, which can either emit nothing at all (the "absence is
   * honest" mid-fill branch) or, in principle, read a coincidentally-complete covering set as
   * `candidate-within-budget` -- both wrong here: 32a's own rider is that a user-stopped fill NEVER
   * reads as complete, stated explicitly, never silently. Called only from `relinquishFill` below.
   *
   * **M1 (reviewer gate, residency-debt cut 1b) / entry 35, RULED 2026-09-05: the `untiledStreamStillRunning`
   * branch.** `relinquishFill` (below) now ALSO cancels the untiled first-look/reissue stream
   * (`untiledStreamHandle`, this module) whenever a grid frame already exists, clearing the handle
   * BEFORE this function ever reads it -- so this field only ever reads `true` in the narrower,
   * frameless bootstrap window that stays uncancellable by ruling (`relinquishFill`'s own doc comment
   * has the full trace). If that stream is STILL running at the moment `relinquishFill` fires, the
   * ordinary `candidate-relinquished` wording ("Filling stopped") would be a FALSE claim -- batches
   * for it keep landing after this call returns. `untiledStreamHandle !== null` is read here, at
   * emission time, so the flag always reflects THIS instant's own truth, never a stale snapshot. */
  function emitResidencyRelinquished(): void {
    if (!canvas) return;
    const { totalResidentFeatures } = canvas.getResidentCounts();
    const untiledStillRunning = untiledStreamHandle !== null;
    deps.onResidencyStatusChange?.({
      kind: "candidate-relinquished",
      residentFeatureCount: totalResidentFeatures,
      untiledStreamStillRunning: untiledStillRunning ? true : undefined,
    });
    // M-1 (re-reviewer gate, residency-debt cut 1b) / entry 35: recorded AFTER dispatch, from the SAME
    // read the dispatched field itself used -- `lastEmittedRelinquishedUntiled`'s own doc comment
    // (above) has the full account of what this lets the untiled sink's own `onTerminal` do later.
    lastEmittedRelinquishedUntiled = untiledStillRunning;
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

  /** Architect re-verification, viewport-residency cut P6b, item 7: extracted to a named function
   * (previously inlined directly in the `residency` accessor below) so Item A's `emitResidencyStatus`
   * can read the SAME declared-margin fact `fillActivity`'s own `hasHeadroom` input needs, without a
   * second, possibly-diverging copy of this arithmetic. See the constant's own doc comment for why
   * `HEADROOM_REFETCH_FRACTION`, not "any room at all", is the declared margin. */
  function hasHeadroom(): boolean {
    return (canvas?.getResidentCounts().totalResidentVertices ?? 0) < HEADROOM_REFETCH_FRACTION * MAX_RESIDENT_VERTICES;
  }

  const manager = new TileViewportStreamManager({
    dataset,
    // P7: `deps.tileGridLevel ?? undefined` collapses BOTH "never passed" (`undefined`) and the
    // selector's own "unset" value (`null`) to the same `undefined` the constructor's own
    // `opts.level ?? DEFAULT_TILE_GRID_LEVEL` fallback already handles -- see `tileGridLevel`'s own
    // doc comment above for why that reproduces this session's pre-P7 behavior exactly when unset.
    level: deps.tileGridLevel ?? undefined,
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
      hasHeadroom,
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
      // S2 (reviewer gate, residency-debt cut 1b, "Item B's own surfacing obligation"): the settling
      // moment itself now emits, rather than the signal waiting for the next batch/camera-change to
      // become visible -- see `suppressNestedSupersededEmit`'s own doc comment (above) for why this call
      // is guarded (an enclosing call site may be about to call `emitResidencyStatus()` again itself).
      //
      // S-b (re-reviewer gate, residency-debt cut 1b): DEFENSIVE, and UNREACHABLE in production today
      // -- stated plainly, not implied otherwise. This module's own manager construction has exactly
      // three call sites that can synchronously recurse into `onTileSuperseded`
      // (`ingestAndMaybeEstablishFrame`'s self-cancel, `handleViewportChange`'s re-plan,
      // `reissueUnrestricted`'s full clear), and every one of them now wraps the one manager call that
      // can do so in `suppressNestedSupersededEmit = true` for its entire duration (S-a, above) --
      // `onTileSuperseded` is never invoked from anywhere else in this module (`manager`'s own
      // `relinquishOutstanding`, `tileViewportStreamManager.ts`, states plainly it "never calls
      // `onTileSuperseded`" at all). So `!suppressNestedSupersededEmit` reads `false` at every call
      // site this callback can actually fire from today, and the emission below never runs. Kept
      // rather than deleted as the honest fallback for a producer this module does not yet have: if a
      // future change ever called `onTileSuperseded` from OUTSIDE those three guarded sites, this line
      // is what keeps the S2 settling-moment obligation from silently going missing for it. TODAY, that
      // obligation is carried entirely by `onTerminal`'s own identical emit, below.
      if (!suppressNestedSupersededEmit && manager.trackedTileCount === 0) emitResidencyStatus();
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
      // Piece 2(ii) (residency-debt cut 1b, entry 36): the typed-partiality record, set here BEFORE the
      // S2 emission check just below -- order matters, so the emission sees the recorded failure, never
      // a stale empty set. REPLACES B1's own `hasPlanned = false` latch (see `hasPlanned`'s own doc
      // comment, above, for the full account of what this replaces and why) -- deliberately
      // UNCONDITIONAL in the identical way B1's own latch was (any non-`Completed` terminal, not only
      // one for a tile absent from `lastCoveringTileKeys`): every terminal reaching HERE is genuine,
      // never self-cancelled (this callback's own doc comment above), so there is no "ordinary, still-
      // named covering tile" case this would be wrong to also record.
      if (terminal.kind !== "Completed") failedCoveringTerminals.set(tileKey, terminal.kind);
      syncScanLiveness(); // P5f should-fix 3: this tile's own stream just reached a terminal state
      // S2 (reviewer gate, residency-debt cut 1b): see `onTileSuperseded`'s own identical addition just
      // above for the full account -- the same "the settling moment itself" now-emits obligation applies
      // to a genuine terminal exactly as it does to a supersede.
      if (manager.trackedTileCount === 0) emitResidencyStatus();
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
        // S2: see `suppressNestedSupersededEmit`'s own doc comment above -- `manager.cancelTile`'s
        // in-flight case resolves SYNCHRONOUSLY (no `await` before `onTileSuperseded` fires), so a
        // self-cancel that leaves `trackedTileCount === 0` would otherwise double-dispatch alongside
        // this function's own trailing `emitResidencyStatus()` call, below.
        //
        // S-a (re-reviewer gate, residency-debt cut 1b): `try`/`finally`, not a bare set/reset pair --
        // if `manager.cancelTile` (or anything it synchronously calls, including a nested
        // `emitResidencyStatus()` this guard itself exists to suppress) ever threw, a bare
        // `suppressNestedSupersededEmit = false;` below it would never run, leaving the guard stuck
        // `true` forever: every LATER, genuinely-unnested `onTileSuperseded` emission would then be
        // silently swallowed for the rest of this session's own lifetime -- a silent, permanent loss of
        // the S2 settling-moment obligation, never surfaced anywhere. `finally` runs regardless.
        suppressNestedSupersededEmit = true;
        try {
          void manager.cancelTile(tileKey);
        } finally {
          suppressNestedSupersededEmit = false;
        }
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

  /** Piece 1/2(iii) (residency-debt cut 1b, entries 35/36): reported, never dropped -- the same
   * "reported, not dropped" discipline `tileViewportStreamManager.ts`'s own `logRejectedCancel`
   * applies to a rejected tile-stream cancel, restated here for the untiled stream (its own,
   * session-owned lifecycle, never routed through that module). Never thrown -- a cancel's own caller
   * here is not awaiting a correctness result from it either. */
  function logRejectedUntiledCancel(streamHandle: string, err: unknown): void {
    logSessionEvent(
      "untiled-stream-cancel-rejected",
      `${streamHandle}: cancel rejected -- ${err instanceof Error ? err.message : String(err)}`
    );
  }

  /** Piece 1 (residency-debt cut 1b, entry 35): the shared machinery `relinquishFill`'s own frame-
   * exists cancel and `stop()`'s teardown cancel both reuse -- study `issueUntiledQuery`'s sink and how
   * `stop()` cancelled this stream BEFORE this piece (a bare `skpCancel(...).catch(() => {})`, no
   * suppression) was the instruction; this is the reused/hardened result: marks the handle
   * self-cancelled BEFORE issuing the real `skpCancel`, so the sink's own `onTerminal` (above) never
   * misreports the resulting terminal as a genuine failure. A no-op when no untiled stream is currently
   * running. Returns the cancelled handle (or `null`), so a caller that needs it for its own reporting
   * (`relinquishFill`'s own BS2 log line) does not have to re-read `untiledStreamHandle` after it has
   * already been cleared here. */
  function cancelUntiledStream(): string | null {
    if (untiledStreamHandle === null) return null;
    const handle = untiledStreamHandle;
    selfCancelledUntiledStreams.add(handle);
    untiledStreamHandle = null;
    void skpCancel(handle).catch((err) => logRejectedUntiledCancel(handle, err));
    return handle;
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
      onTerminal: (terminal) => {
        // S-1 (re-reviewer gate, residency-debt cut 1b): captured BEFORE the handle-clear immediately
        // below -- an ORPHANED previous-generation untiled stream (`reissueUnrestricted` deliberately
        // does not cancel this stream, this function's own top doc comment) can deliver its own late
        // terminal here with `untiledStreamHandle` already pointing at a DIFFERENT, newer generation's
        // stream. `wasCurrent` is what lets the accounting below (and the M-1 re-emit) tell "this
        // generation's own terminal" apart from "a superseded generation's late arrival" -- gated on
        // it, per the reviewer, rather than only on the self-cancel set (which never held this handle
        // in the orphan case either).
        const wasCurrent = untiledStreamHandle === stream;
        if (untiledStreamHandle === stream) untiledStreamHandle = null;
        if (isInstrumentedBuild()) {
          recordResidencyStreamEnded();
        }
        // Piece 2(iii) (residency-debt cut 1b, entry 36): no longer silent -- logged with the terminal
        // kind, and a non-`Completed` terminal feeds the SAME typed-partiality accounting a covering
        // tile's own failure does (`failedCoveringTerminals`'s own doc comment above), so an untiled
        // failure means the view's base load is incomplete and at minimum prevents settled-complete
        // until a new plan/reissue. Piece 1 (entry 35): a SELF-cancelled terminal (`relinquishFill`'s
        // own frame-exists cancel, or `stop()`'s teardown cancel -- both add to
        // `selfCancelledUntiledStreams` BEFORE calling `skpCancel`, the same discipline
        // `tileViewportStreamManager.ts`'s own `selfCancelledHandles` uses for tile streams) is
        // deliberately EXCLUDED from both the log line and the accounting here -- an operator cancel or
        // a dataset teardown is not a producer/transport/decode failure, and misreporting it as one
        // would corrupt the very accounting this piece exists to make honest.
        const wasSelfCancelled = selfCancelledUntiledStreams.delete(stream);
        if (!wasSelfCancelled) {
          // S-1: the log line still fires either way (an orphaned terminal is still worth a
          // session-log record) -- but it now names a superseded terminal by name, and the
          // typed-partiality accounting right below is gated on `wasCurrent` alone, never fired for an
          // orphan (a stale generation's own failure says nothing about the CURRENT generation's view).
          logSessionEvent(
            "candidate-untiled-terminal",
            wasCurrent
              ? `${INITIAL_TILE_KEY} ${stream}: ${terminal.kind} — ${terminal.detail}`
              : `${INITIAL_TILE_KEY} ${stream}: ${terminal.kind} — ${terminal.detail} (superseded -- a later generation is already current, no accounting)`
          );
          if (wasCurrent && terminal.kind !== "Completed") {
            failedCoveringTerminals.set(INITIAL_TILE_KEY, terminal.kind);
          }
        }
        // Nit 1 (re-reviewer gate, residency-debt cut 1b): skipped for a SELF-cancelled stream once the
        // manager's own grid frame already exists -- `establishFrameFromExtent`'s own "no-op past the
        // first call" contract means the underlying frame itself never moves either way, but calling it
        // anyway here would re-freeze this function's LOCAL `frameEstablished` bookkeeping (reset
        // `false` by `reissueUnrestricted` for a fresh generation even though `manager.gridFrame`
        // survives unchanged) against THIS generation's own union, truncated by the very cancellation
        // just recorded above -- re-emitting `candidate-grid-frame-established` with an
        // `observedUnion` that describes a frame that never actually moved. The genuine bootstrap path
        // (no self-cancel, or a self-cancel before any frame ever existed -- `stop()` during bootstrap)
        // is unchanged: P5f complex-gate should-fix 4's own establishment point still runs there.
        if (!(wasSelfCancelled && manager.gridFrame !== null)) {
          establishFrameFromExtent(latestUnionedExtent);
        }
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
        // M-1 (re-reviewer gate, residency-debt cut 1b) / entry 35, RULED 2026-09-05: the stale-status
        // fix. The sticky rule (`nextResidencyStatus`, `residencyStatus.ts`) keeps a standing
        // `candidate-relinquished` status alive until a query-issued-class transition -- which also
        // keeps a STALE `untiledStreamStillRunning: true` reading alive past the exact instant THIS
        // stream's own terminal makes that claim false. `wasCurrent` (S-1, gated the same way as the
        // accounting above -- an orphan's terminal says nothing about whether the CURRENT generation's
        // relinquished status is still honest) and `lastEmittedRelinquishedUntiled` (this module's own
        // doc comment on it, above) together identify exactly the one case that needs a re-emit: THIS
        // generation's own frameless-bootstrap relinquish is standing, and THIS is the stream it was
        // honest about. `emitResidencyRelinquished` reads `untiledStreamHandle` (already cleared above)
        // at emission time, so this re-emission is automatically the honest, field-omitted ordinary
        // variant -- `nextResidencyStatus`'s own switch never gates a `candidate-relinquished` event on
        // the sticky refusal (that refusal names only within/over-budget events), so this reaches the
        // standing status unconditionally, exactly the "relinquish-over-relinquish" case its own doc
        // comment already permits.
        if (wasCurrent && lastEmittedRelinquishedUntiled) {
          lastEmittedRelinquishedUntiled = false;
          emitResidencyRelinquished();
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

  /** Item B: the one place that cancels the viewport-change debounce -- wraps `debounced.cancel()`
   * with clearing `pendingViewportChange` back to `false` (cancelled means no re-plan is pending any
   * more), so every call site that used to call `debounced.cancel()` directly stays honest about this
   * flag without repeating the pairing at each site. */
  function cancelViewportDebounce(): void {
    debounced.cancel();
    pendingViewportChange = false;
  }

  function handleViewportChange(bbox: AuthoritativeBbox): void {
    // Item B: cleared here, first, before any early return below -- "its debounced handler actually
    // runs" (`pendingViewportChange`'s own doc comment, above) is true the instant this
    // body starts, regardless of whether `stopped` short-circuits it or `manager.onCameraChange` comes
    // back `"no-frame"`/`"stopped"` rather than `"planned"`.
    pendingViewportChange = false;
    if (stopped) return;
    // S2: see `suppressNestedSupersededEmit`'s own doc comment above -- `onCameraChange`'s own
    // out-of-view cancellation loop can synchronously cancel a tracked tile (`onTileSuperseded`) before
    // this function's own trailing `emitResidencyStatus()` call (below) runs.
    //
    // S-a (re-reviewer gate, residency-debt cut 1b): `try`/`finally` around the one call that can
    // recurse into `onTileSuperseded` -- see the identical rationale at
    // `ingestAndMaybeEstablishFrame`'s own self-cancel site (above): a bare set/reset pair leaves the
    // guard stuck `true` forever if the wrapped call ever throws.
    suppressNestedSupersededEmit = true;
    let outcome: TilePlanOutcome;
    try {
      outcome = manager.onCameraChange(bbox, currentFilter);
    } finally {
      suppressNestedSupersededEmit = false;
    }
    if (outcome.kind !== "planned") return;
    // Architect re-verification, viewport-residency cut P6b, items 1-2: `isFillComplete`'s own
    // sentinel -- a plan has now genuinely run this generation, whatever its own covering set turns
    // out to be (even legitimately empty). See that function's own doc comment for the vacuous-true
    // bug this closes.
    hasPlanned = true;
    // Piece 2(ii) (residency-debt cut 1b, entry 36): a fresh plan starts a new accounting window --
    // `failedCoveringTerminals`'s own doc comment has the full account of why this is cleared per-plan,
    // never per-terminal.
    failedCoveringTerminals.clear();
    // Piece 1 (residency-debt cut 1b, entry 35, "sticky per entry-1"): a genuinely fresh plan is exactly
    // the moment honest enough to supersede a standing `candidate-relinquished` status --
    // `relinquishClearPending`'s own doc comment (above) has the full account. Fired at most once per
    // relinquish (the flag is consumed here), regardless of what this plan's own trailing
    // `emitResidencyStatus()` call below goes on to say (or stays silent about).
    if (relinquishClearPending) {
      relinquishClearPending = false;
      // M-1 (re-reviewer gate, residency-debt cut 1b) / entry 35: a genuinely fresh plan supersedes
      // whichever relinquished variant was standing -- so a LATER terminal for the now-superseded
      // untiled stream (if any) must never mistake this session's own state for "still the one that
      // relinquish left standing" (`lastEmittedRelinquishedUntiled`'s own doc comment, above).
      lastEmittedRelinquishedUntiled = false;
      deps.onResidencyStatusChange?.({ kind: "candidate-fill-progress" });
    }
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
    onViewportChanged: (bbox) => {
      // Item B: accepted for debouncing -- see `pendingViewportChange`'s own doc comment above for the
      // full lifecycle this flag tracks (paraphrased, not quoted: true from the moment it is accepted
      // here until the handler runs or is cancelled).
      pendingViewportChange = true;
      debounced.call(bbox);
    },
    /** P5f complex-gate must-fix 4 (the double-debounce fix): exposes this session's OWN internal
     * debounce's `cancel()` -- `App.tsx` no longer wraps `onViewportChanged` in a SECOND debounce of
     * its own (that was the bug: two stacked 120 ms trailing-edge debounces = +120 ms systematic
     * candidate-arm handicap on the primary measured quantity), so `viewportDebounceRef.current
     * ?.cancel()` (the `cancelPendingDebounce` seam `applyFilter`'s Apply/Clear flow and the E2E
     * `queryWithFilter` hook both already call) needs somewhere to reach THIS debounce directly --
     * see `App.tsx`'s own `makeCandidateViewportDispatcher`. */
    cancelPendingViewportChange: () => cancelViewportDebounce(),
    reissueUnrestricted: async (bbox, filter) => {
      currentFilter = filter;
      cancelViewportDebounce();
      // S2: see `suppressNestedSupersededEmit`'s own doc comment above -- this guard exists solely so
      // `manager.clearAll()`'s own in-flight cancellations never emit a stale, prior-generation status
      // one line before this function's own `query-issued` clear (below) supersedes it anyway.
      //
      // S-a (re-reviewer gate, residency-debt cut 1b): `try`/`finally` -- see the identical rationale
      // at `ingestAndMaybeEstablishFrame`'s own self-cancel site (above).
      suppressNestedSupersededEmit = true;
      try {
        manager.clearAll();
      } finally {
        suppressNestedSupersededEmit = false;
      }
      canvas?.clearAllTiles();
      canvas?.resetFitForNewGeneration();
      frameEstablished = false;
      lastCoveringTileKeys = new Set();
      lastCoveringTruncated = false; // re-review S4: a fresh generation starts with no truncation history
      hasPlanned = false; // P6b items 1-2: a fresh generation has no plan of its own yet either
      failedCoveringTerminals.clear(); // Piece 2(ii): a fresh generation starts with no failure history either
      standingWithinBudgetComplete = false; // Piece 2(i): nothing "complete" is standing for a fresh generation
      relinquishClearPending = false; // Piece 1: the explicit `query-issued` clear below already supersedes it
      // M-1 (re-reviewer gate, residency-debt cut 1b) / entry 35: swept alongside `relinquishClearPending`
      // above, for the identical reason -- a fresh generation's own `query-issued` dispatch already
      // supersedes whatever relinquished variant was standing (`lastEmittedRelinquishedUntiled`'s own
      // doc comment has the full account of why a stale `true` here would otherwise be misread later).
      lastEmittedRelinquishedUntiled = false;
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
      cancelViewportDebounce();
      await manager.stop();
      // Piece 1 (residency-debt cut 1b, entry 35): reuses the SAME self-cancel-suppression machinery
      // `relinquishFill`'s own frame-exists cancel does (`cancelUntiledStream`'s own doc comment above)
      // -- before this piece this was a bare `skpCancel(...).catch(() => {})`, which let the sink's own
      // `onTerminal` (above) later misreport this teardown-time cancel as a genuine failure once Piece
      // 2(iii) started logging/accounting for it.
      cancelUntiledStream();
      // Deliberately NOT `syncScanLiveness()` here: this method resolves asynchronously, and by the
      // time it does the caller may no longer own the freshest `scanState` -- exactly rider 3's own
      // wrong-instance-callback footgun (`makeManagerCallbacks`'s doc comment) for a different
      // callback.
      //
      // S3 (reviewer gate, residency-debt cut 1b): corrected -- this comment used to say `App.tsx`'s
      // own Cancel handler calls this method and dispatches `applyScanEvent` itself first, "before
      // ever calling into this session." False after the repoint (decisions 32a/33b): Cancel no
      // longer calls `stop()` at all -- it calls `relinquishFill()` above, which owns its OWN
      // synchronous scan-liveness dispatch (that method's own doc comment has the full account).
      // `stop()` today is reached ONLY from `App.tsx`'s dataset-close/remount effect cleanup, which
      // does not read this session's `scanState` at all by the time this promise resolves (the
      // component is tearing down) -- so skipping `syncScanLiveness()` here is simply correct for
      // that caller, not a race being avoided at a Cancel call site that no longer reaches this
      // method.
    },
    // Item A (residency-debt cut 1b, decisions 32a/33b): see this method's own doc comment on the
    // `CandidateArmSession` interface above for the full account -- the scoped relief `App.tsx`'s
    // Cancel handler now calls INSTEAD of `manager.stop()` (32a's own repoint).
    relinquishFill: () => {
      const summary = manager.relinquishOutstanding();
      for (const tileKey of summary.cancelledInFlight) {
        // 32a's own rider: a tile that already delivered SOME data is kept (never blanked -- the
        // resident view is retained), but must never silently read as complete either. Mirrors the
        // budget self-cancel path's own `markTilePartial` call for the identical "stopped this tile's
        // own stream before it finished delivering" situation. A safe no-op for a tile that never
        // delivered a single batch (`markTilePartial`'s own "a no-op for a tile this set has never
        // heard of" contract, `tileResidentSet.ts`) -- never called for `droppedQueued` tiles here
        // since none of them could possibly be resident in the first place (queued/mid-mint tiles
        // never started a stream at all).
        canvas?.markTilePartial(tileKey);
      }
      for (const tileKey of [...summary.cancelledInFlight, ...summary.droppedQueued]) {
        // The same per-tile sweep every other manager-driven termination path in this module already
        // performs (`onTerminal`/`onTileSuperseded` above) -- safe no-ops for a tile this bookkeeping
        // never held an entry for.
        countTileStreamEndedOnce(tileKey);
        tileGenerationUntrimmed.delete(tileKey);
        budgetCancelledTileKeys.delete(tileKey);
      }
      // M2 (reviewer gate, residency-debt cut 1b): the structural latch. A tile carried in-flight
      // across two plans is skipped entirely by `onCameraChange`'s own new-candidate loop
      // (`tileViewportStreamManager.ts`'s own `if (this.tileState.has(tileKey)) continue;`) -- it
      // lands in NONE of that plan's `issued`/`queued`/`alreadyResident`, so it is silently absent
      // from `lastCoveringTileKeys` even though it is genuinely still part of the viewport's covering
      // set. If THAT tile is then the one this lever cancels, `manager.trackedTileCount` drops to 0
      // with `lastCoveringTileKeys` never having named it -- `isFillComplete()` below would iterate
      // only the tiles it DOES know about, find them all complete, and read the fill as complete over
      // a user-stopped one (BS6, 32a's rider: never true). Resetting `hasPlanned` here latches
      // `isFillComplete()` to `false` unconditionally (its own first check, above) until the NEXT real
      // `handleViewportChange` plan sets it `true` again -- the same sentinel P6b's own fix already
      // uses for "no plan has run yet," reused here for "no plan has run yet SINCE the relief fired."
      // Covers BOTH readers named in the finding: `isFillComplete()` itself, and
      // `emitResidencyStatus`'s own within-budget claim, which reads `isFillComplete()` as one of
      // `settledState`'s own inputs (`currentSettledState`'s own doc comment above --
      // `if (settled !== "settled-complete") return;`, this file's own `emitResidencyStatus`) -- there
      // is no second copy of this arithmetic to separately patch.
      hasPlanned = false;
      // S-A (re-review, this piece): a "Showing all N" claim standing at the moment Cancel fires is
      // no longer standing once the relinquished status replaces it -- clearing the flag here keeps
      // `standingWithinBudgetComplete`'s own doc comment ("always an accurate record ... never a
      // stale snapshot") literally true, and closes the carried-into-the-window hole the re-review
      // named: without this line the stale-`true` flag could, via `emitResidencyStatus`'s clearing
      // branch, dispatch a `candidate-fill-progress` that clears the sticky relinquished status out
      // from under entry 35's own rule (unreachable today only by the quiescence argument; made
      // structural here instead of argued).
      standingWithinBudgetComplete = false;
      // Piece 1 (residency-debt cut 1b, entry 35 -- RULED, the human's own words paraphrased: accept
      // as recommended, yes with a grid frame, no at bootstrap). This lever's own scope widens from
      // tile-fill-only to ALSO cancel the
      // untiled first-look/reissue stream, but ONLY while `manager.gridFrame` (the manager's own frame
      // accessor) is already non-`null`. The anchor hazard this boundary exists for -- cancelling the
      // untiled stream before it ever reaches its own terminal means `establishFrameFromExtent` would
      // freeze the grid on a truncated union (this session's own doc comment on that function) -- lives
      // ONLY in the frameless bootstrap window; once a frame already exists, `establishFrameFromExtent`
      // is a no-op regardless (`frameEstablished` is already `true`), so cancelling here carries no such
      // hazard, and 33b's own "Cancel means cancel" rationale applies with full force. NEVER cancelled
      // at bootstrap (`manager.gridFrame === null`): the boundary stays uncancellable and documented, as
      // ruled -- the untiled stream keeps delivering, `emitResidencyRelinquished` below reads that
      // honestly (`untiledStreamStillRunning: true`), and the string-3 wording
      // (`relinquishedUntiledStillRunningText`, `residencyStatus.ts`) is reworded accordingly.
      if (manager.gridFrame !== null && untiledStreamHandle !== null) {
        const cancelledHandle = cancelUntiledStream();
        // BS2 discipline: a THIRD distinguishable report class, distinct from the two tile classes
        // above (`tile-stream-relinquish-cancelled`/`tile-stream-relinquish-dropped`,
        // `tileViewportStreamManager.ts`) -- reported here, not there, since the untiled stream is
        // owned by this session, never by `manager`.
        logSessionEvent(
          "untiled-stream-relinquish-cancelled",
          `${INITIAL_TILE_KEY} ${cancelledHandle}: cancelled by the scoped relief lever -- grid frame already established, no anchor hazard`
        );
      }
      // Piece 1 (entry 35, "sticky per entry-1"): a standing `candidate-relinquished` status (about to
      // be emitted, below) must persist until a query-issued-class transition clears it -- this flag is
      // what lets the NEXT genuinely fresh plan (`handleViewportChange`, above) supersede it honestly,
      // regardless of whether THIS relinquish also reached the untiled stream (both cases set it: the
      // sticky requirement is general, not scoped to which window the relinquish fired in).
      relinquishClearPending = true;
      syncScanLiveness(); // see this method's own interface-level doc comment for why THIS call site
      // S2: no `suppressNestedSupersededEmit` guard needed here -- `manager.relinquishOutstanding()`
      // (above) never calls `onTileSuperseded` at all (that method's own doc comment,
      // `tileViewportStreamManager.ts`: "Never calls `onTileSuperseded`"), so there is no nested
      // `emitResidencyStatus()` call from within it to guard against in the first place.
      emitResidencyRelinquished();
      return summary;
    },
    // M2 (reviewer gate, residency-debt cut 1b): exposed so a caller (this module's own tests
    // included) can observe the exact fact `emitResidencyStatus`'s within-budget claim gates on,
    // directly -- the same read-only-getter-for-assertion shape this session
    // already extends via `manager.overBudget`/`manager.trackedTileCount`/`manager.gridFrame` above.
    // Never mutates anything; a pure read of this closure's own current truth.
    isFillComplete: () => isFillComplete(),
  };
}
