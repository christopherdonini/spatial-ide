// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import type { WorkingCanvasHandle } from "../canvas/WorkingCanvas";
import { chooseFitTarget } from "../canvas/extent";
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
 * it identically -- it is not a second, parallel ingest path. */
export const INITIAL_TILE_KEY = "initial-untiled-look";

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
}

export interface CandidateArmSession {
  manager: TileViewportStreamManager;
  /** Wired directly into the SAME `debounce(fn, VIEWPORT_QUERY_MIN_INTERVAL_MS)` call baseline's own
   * pan/zoom debounce already uses (`App.tsx`'s `[admitted]` effect) -- this function is the debounced
   * body, never re-declaring the constant or the `debounce()` call itself. */
  onViewportChanged: (bbox: AuthoritativeBbox) => void;
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
   * and no session UI is mounted to show a status to). */
  function emitResidencyStatus(): void {
    if (!canvas) return;
    const { totalResidentFeatures } = canvas.getResidentCounts();
    const overBudget = manager.overBudget;
    traceCandidateResidencyStatus(dataset, overBudget, totalResidentFeatures, evictedTileCountSession);
    deps.onResidencyStatusChange?.(
      overBudget
        ? { kind: "candidate-over-budget", residentFeatureCount: totalResidentFeatures, viewportTotal: null }
        : { kind: "candidate-within-budget", residentFeatureCount: totalResidentFeatures }
    );
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
    },
    onTerminal: (tileKey, streamHandle, terminal) => {
      countTileStreamIssuedOnce(tileKey); // a stream that terminated without ever delivering a batch
      countTileStreamEndedOnce(tileKey);
      // Item B's own scope: the candidate arm's over-budget state is maintained elsewhere in this
      // module; a genuine stream FAILURE (as opposed to a declared-ceiling condition, which this arm
      // never raises) has no dedicated UI wiring yet -- P4's own job ("P4 renders the state"), not
      // this piece's. Logged so it is at least visible, not silently dropped (ADR-010 rule 8).
      logSessionEvent("candidate-tile-terminal", `${tileKey} ${streamHandle}: ${terminal.kind} — ${terminal.detail}`);
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
    if (!frameEstablished && outcome.fitAnchor) {
      const target = chooseFitTarget(outcome.fitAnchor);
      if (target) {
        manager.establishGridFrame(target);
        const frame = manager.gridFrame;
        if (frame) {
          canvas.establishTileGridContext(frame, manager.activeLevel);
          frameEstablished = true;
        }
      }
    }
    if (outcome.overBudget) {
      const unrequested = [...lastCoveringTileKeys].filter((k) => !canvas.isTileResidentInCandidateSet(k));
      manager.setOverBudget(true, unrequested);
    }
    evictedTileCountSession += outcome.evictedTileKeys.length;
    // Viewport-residency cut P4: every ingest may have moved `manager.overBudget` or the resident
    // feature count -- recompute and forward the declared-partial-view status after each one.
    emitResidencyStatus();
  }

  async function issueUntiledQuery(bbox: Bbox | null, filter: Filter | null): Promise<RequestOutcome> {
    if (stopped) return { kind: "stopped" };
    // Viewport-residency cut P3i-c (gap G-B): mirrors `ViewportStreamManager.requestViewport`'s own
    // `traceViewportQuery` call -- always-on render-trace (never instrument-gated), fired on this
    // session's own untiled "first look"/reissue attempt, the candidate arm's own analogue of
    // baseline's initial unfiltered query.
    traceViewportQuery(dataset, bbox, null);
    // Propagates a refusal (`SkpCallError`) unchanged -- see this module's own doc comment.
    const { stream } = await viewportQuery(dataset, bbox, null, null, filter);
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
        ingestAndMaybeEstablishFrame(INITIAL_TILE_KEY, stream, seq, batchPayload);
        // The untiled "first look" exists ONLY to establish the tile grid's own anchor
        // (this module's own doc comment) -- once that has happened, continuing to drain the REST
        // of an unbounded, unrestricted (`bbox: null`) stream serves no further purpose and would
        // otherwise fetch the WHOLE dataset through one giant stream (found live: a ~10M-vertex
        // fixture's own untiled first look ran past 60s without completing, unlike baseline's own
        // equivalent load, which self-truncates via `ResidentVertexCeilingExceeded`'s cancel -- this
        // arm's own ingest never cancels a stream, item B's own "never raises the baseline ceiling
        // refusal" contract). Cancelled here, exactly once, the moment the frame is established --
        // real tile-keyed queries take over from the next genuine viewport change.
        if (frameEstablished && untiledStreamHandle === stream) {
          untiledStreamHandle = null;
          void skpCancel(stream).catch(() => {});
        }
      },
      onProgress: () => {},
      onTerminal: () => {
        if (untiledStreamHandle === stream) untiledStreamHandle = null;
        if (isInstrumentedBuild()) {
          recordResidencyStreamEnded();
        }
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
  }

  return {
    manager,
    onViewportChanged: (bbox) => debounced.call(bbox),
    reissueUnrestricted: async (bbox, filter) => {
      currentFilter = filter;
      debounced.cancel();
      manager.clearAll();
      canvas?.clearAllTiles();
      canvas?.resetFitForNewGeneration();
      frameEstablished = false;
      lastCoveringTileKeys = new Set();
      evictedTileCountSession = 0; // a fresh generation starts a fresh eviction history
      // Viewport-residency cut P4 (decisions 24(a)/(b)): "clears on ... query-issued" -- the SAME
      // event baseline's own `issueViewportQuery` feeds `nextResidencyStatus` for an Apply/Clear
      // (App.tsx). Fired here, at the clear itself (residency truly is empty at this instant), not
      // only in App.tsx's dataset-open call to this function -- Apply/Clear reach this same seam.
      deps.onResidencyStatusChange?.({ kind: "query-issued" });
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
    },
  };
}
