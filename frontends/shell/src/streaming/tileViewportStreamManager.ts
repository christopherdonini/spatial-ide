// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import type { TileGridFrame, TileKey } from "../canvas/tileGrid";
import { deriveTileGridFrame, tileBbox, tileDistanceToPoint, tileKeyToString, tilesCoveringBbox } from "../canvas/tileGrid";
import type { TileGridLevel } from "../canvas/tileGridConstants";
import { DEFAULT_TILE_GRID_LEVEL, MAX_IN_FLIGHT_TILE_STREAMS, MAX_QUEUED_TILES } from "../canvas/tileGridConstants";
import type { AuthoritativeBbox } from "../canvas/viewportBbox";
import { traceStreamIssued, traceViewportQuery } from "../diagnostics/renderTrace";
import { logSessionEvent } from "../diagnostics/log";
import { recordResidencyBatchArrived } from "../instrument/residencyInstrument";
import { isInstrumentedBuild } from "../isInstrumentedBuild";
import { encodeHexF64 } from "../skp/codec";
import { cancel as skpCancel, viewportQuery } from "../skp/client";
import type { Bbox, Filter } from "../skp/types";
import { startStream } from "./adapterWs";
import { dataPlaneAttach } from "./dataPlaneClient";
import type { StreamSink, Terminal } from "./transport";

/**
 * Viewport-residency cut P3 item B: tile-keyed request planning, the candidate arm's own SEPARATE
 * sibling to `viewportStreamManager.ts`'s `ViewportStreamManager` -- never imported by that module,
 * so arm="baseline" (the only arm the full vitest/E2E regression suites ever exercise) never
 * references any of this by construction, which is this piece's own bit-identity guarantee (see
 * this module's own file existing at all, plus `App.tsx`'s arm-gated construction site).
 *
 * **What this class owns, and what it deliberately does not.** It owns the tile grid frame/level for
 * a dataset session, per-tile request lifecycle (queued/in-flight, capped at
 * `MAX_IN_FLIGHT_TILE_STREAMS`), and per-tile supersede-on-camera-change (never a wholesale
 * `clearResidency` the way baseline's `supersedeCurrent` is -- item B's own "resident tiles are NOT
 * re-requested and NOT cleared"). It does NOT decode batches (raw `Uint8Array` payloads only, same
 * as `ViewportStreamManager`), does NOT own a `TileResidentSet` (a canvas-side concern, injected here
 * only as the read-only `TileResidencyAccessor` below), and does NOT decide eviction (item D's own
 * `planTileEviction` needs decoded vertex counts and the current view centre, neither of which this
 * class has) -- it only carries the `overBudget` flag a caller sets after making that decision
 * elsewhere, and gates further NEW-tile issuance on it. NEXT-CUT.md P3's own words: "this piece
 * exposes it via a callback/state field only."
 */

/** The minimal read-only view into residency this manager needs for planning -- "have we already
 * finished fetching this cell." A pull dependency (queried on every `onCameraChange`), never a push:
 * this manager tracks its own in-flight/queued bookkeeping separately and never mutates residency
 * itself. */
export interface TileResidencyAccessor {
  /** Viewport-residency cut P6a, Defect A: "already satisfied for planning purposes" -- `false` for
   * a tile that is either genuinely missing OR durably partial (`TileResidentSet.isTileComplete`'s
   * own contract), so `onCameraChange` treats it as a fresh candidate and, subject to
   * `hasHeadroom` below, re-requests it. The real accessor (`candidateArmSession.ts`) wires this to
   * `WorkingCanvasHandle.isTileCompleteInCandidateSet`, not the older, weaker `isTileResidentInCandidateSet`
   * (which stays `true` for a partial tile -- that older meaning is still needed elsewhere, e.g.
   * diagnostic "which covering tiles have no data at all" listings, so it was not repurposed here). */
  isTileResident(tileKey: string): boolean;
  /**
   * Viewport-residency cut P6a, Defect A (the over-budget drain-stop exception): true iff there is
   * currently room to admit more resident vertices -- called ONLY while `overBudget` is set, to decide
   * whether a partial/evicted VIEWPORT tile is still worth re-requesting despite the historical flag.
   * Optional; a caller that omits it gets the pre-existing behaviour (no exception -- `overBudget`
   * blocks every new candidate unconditionally), so every pre-existing `TileResidencyAccessor` in this
   * codebase's own tests keeps compiling and behaving unchanged.
   */
  hasHeadroom?(): boolean;
}

export interface TileViewportStreamManagerOptions {
  dataset: string;
  /** Fixed for this manager's whole lifetime -- NEXT-CUT.md P3 item A: a session picks one level,
   * P6's own sweep is across SEPARATE sessions, never a mid-session change. Defaults to
   * `DEFAULT_TILE_GRID_LEVEL`. */
  level?: TileGridLevel;
  residency: TileResidencyAccessor;
  /** A batch arrived for `tileKey`'s currently active stream -- raw wire bytes, exactly like
   * `ViewportStreamManager.onBatch`'s own payload; decoding and residency bookkeeping are the
   * caller's job (item C). Never called for a tile whose stream has since been superseded (the same
   * D3.7 criterion `ViewportStreamManager` already enforces, checked per-tile here). */
  onBatch: (tileKey: string, streamHandle: string, batchSeq: number, payload: Uint8Array) => void;
  /** `tileKey`'s stream was superseded (no longer covered by the current viewport, or a filter/
   * dataset-change wholesale clear) -- the caller should drop whatever residency it holds for this
   * tile. `streamHandle` is the in-flight stream's own handle, or `null` when this fires for an
   * already-RESIDENT tile during a wholesale `clearAll` (there is no live stream to name; the
   * residency itself is what needs clearing). */
  onTileSuperseded: (tileKey: string, streamHandle: string | null) => void;
  onTerminal?: (tileKey: string, streamHandle: string, terminal: Terminal) => void;
}

export type TilePlanOutcome =
  | {
      kind: "planned";
      issued: string[];
      queued: string[];
      alreadyResident: string[];
      /** P5f complex-gate should-fix 2: `true` only when this round's NEW (neither already tracked
       * nor already resident) covering tiles exceeded this manager's own issuing/queueing capacity
       * (`MAX_IN_FLIGHT_TILE_STREAMS`'s free slots plus `MAX_QUEUED_TILES`'s own remaining room) and
       * had to be truncated, farthest-from-view-centre-first, to fit. Omitted entirely (never `false`)
       * on the ordinary, untruncated path -- so every pre-existing `toEqual({kind:"planned", ...})`
       * assertion that predates this field keeps matching (`toEqual` treats an absent property and an
       * explicit `undefined` as equivalent). */
      coveringTruncated?: true;
      /** Present iff `coveringTruncated` is -- how many of this round's new candidate tiles were
       * dropped (never queued, never issued) by the truncation above. */
      truncatedCount?: number;
    }
  /** `onCameraChange` called before `establishGridFrame` ever ran -- nothing to plan against yet. */
  | { kind: "no-frame" }
  | { kind: "stopped" };

function toWireBbox(bbox: AuthoritativeBbox): Bbox {
  return {
    xmin: encodeHexF64(bbox.xmin),
    ymin: encodeHexF64(bbox.ymin),
    xmax: encodeHexF64(bbox.xmax),
    ymax: encodeHexF64(bbox.ymax),
  };
}

/** Architect re-verification, viewport-residency cut P6b, item 4: every `skpCancel(...).catch(...)`
 * site in this module used to swallow a rejected cancel silently (`.catch(() => {})`) -- a genuinely
 * rejected cancel (as opposed to the ordinary "already terminal"/"unknown" SKP response, which
 * resolves rather than rejects) is a real fact this module is the only thing that knows, and rule 7
 * ("reported, not dropped") applies to it exactly as it does to any other handler-side failure. Never
 * thrown (a cancel's own caller is not awaiting a correctness result from it, only firing-and-
 * forgetting the request) and never silent -- routed through the SAME always-on session-log sink
 * `candidateArmSession.ts`'s own `onTerminal`/`covering-truncated` lines already use. */
function logRejectedCancel(context: string, streamHandle: string, err: unknown): void {
  logSessionEvent(
    "tile-stream-cancel-rejected",
    `${context} ${streamHandle}: cancel rejected -- ${err instanceof Error ? err.message : String(err)}`
  );
}

/** `"queued"`: waiting in `queue` for a concurrency slot. `"issuing"`: a slot was claimed and
 * `viewportQuery`/`dataPlaneAttach` are in flight (no stream handle yet -- ticket minting itself
 * crosses real awaits, see `issueEpoch`'s own doc comment). `"in-flight"`: a real stream is
 * running. Both `"issuing"` and `"in-flight"` occupy a `MAX_IN_FLIGHT_TILE_STREAMS` slot -- counting
 * only `"in-flight"` would let more tiles start minting than the cap allows, since minting is async
 * and several tiles can be mid-mint before any of them resolves to an actual stream. */
type TileRequestState = "queued" | "issuing" | "in-flight";

export class TileViewportStreamManager {
  private frame: TileGridFrame | null = null;
  private readonly level: TileGridLevel;
  private stopped = false;
  private overBudgetFlag = false;
  private unrequestedTileKeysOverBudget: string[] = [];

  private tileState = new Map<string, TileRequestState>();
  private inFlightStreams = new Map<string, { streamHandle: string }>();
  private queue: TileKey[] = [];
  /** Bumped every time a tile's own issuance is (re)started or the tile is dropped while its ticket
   * is still minting -- the per-tile analogue of `ViewportStreamManager`'s single `generation`
   * counter, needed because `viewportQuery`/`dataPlaneAttach` cross real awaits a camera change can
   * race ahead of. */
  private issueEpoch = new Map<string, number>();
  private nextBatchSeqByStream = new Map<string, number>();
  private readonly selfCancelledHandles = new Set<string>();
  private currentFilter: Filter | null = null;

  constructor(private readonly opts: TileViewportStreamManagerOptions) {
    this.level = opts.level ?? DEFAULT_TILE_GRID_LEVEL;
  }

  get gridFrame(): TileGridFrame | null {
    return this.frame;
  }

  get activeLevel(): TileGridLevel {
    return this.level;
  }

  get overBudget(): boolean {
    return this.overBudgetFlag;
  }

  get unrequestedTilesOverBudget(): readonly string[] {
    return this.unrequestedTileKeysOverBudget;
  }

  get inFlightCount(): number {
    return this.inFlightStreams.size;
  }

  get queuedCount(): number {
    return this.queue.length;
  }

  /** P5f complex-gate should-fix 1: every tile this manager is currently tracking in ANY of the
   * three `TileRequestState`s -- `"queued"` PLUS `"issuing"` PLUS `"in-flight"` -- i.e.
   * `queuedCount + inFlightCount` PLUS the `"issuing"` (mid-mint, no stream handle yet) tiles neither
   * of those two getters counts on its own. A caller that needs "is there ANY outstanding tile work
   * right now" (the candidate arm's own within-budget fill-completeness check, `candidateArmSession
   * .ts`'s `emitResidencyStatus`) needs exactly this, not `inFlightCount`/`queuedCount` individually --
   * `inFlightCount === 0 && queuedCount === 0` can still be true with tiles genuinely `"issuing"`. */
  get trackedTileCount(): number {
    return this.tileState.size;
  }

  /** Tiles currently occupying a `MAX_IN_FLIGHT_TILE_STREAMS` slot -- `"issuing"` (mid-mint) plus
   * `"in-flight"` (a real stream running); `"queued"` tiles do not count, they are exactly what is
   * waiting for a slot to free. */
  private activeSlotCount(): number {
    let n = 0;
    for (const state of this.tileState.values()) {
      if (state !== "queued") n++;
    }
    return n;
  }

  /** Declares the frame frozen for this dataset's session (item A) -- a no-op past the first call,
   * by design: the frame does not move mid-session (`tileGrid.ts`'s own top doc comment has the full
   * "no dataset extent at open" account). */
  establishGridFrame(anchor: AuthoritativeBbox): void {
    if (this.frame !== null) return;
    this.frame = deriveTileGridFrame(anchor);
  }

  /**
   * Caller-driven over-budget declaration (item D): the viewport's own covering tiles already
   * exceed `MAX_RESIDENT_VERTICES` even after evicting every evictable tile -- there is nothing
   * further tiling can do for this camera position. Planning stops issuing requests for tiles not
   * already resident/in-flight/queued until the next `onCameraChange` re-evaluates (e.g. a pan that
   * shrinks the covering set). This manager never decides WHEN to call this itself -- that decision
   * needs decoded vertex counts (`planTileEviction`), which only the canvas-side residency owner
   * has; this is the "callback/state field only" seam NEXT-CUT.md P3 hands to P4.
   */
  setOverBudget(overBudget: boolean, unrequestedTileKeys: string[] = []): void {
    this.overBudgetFlag = overBudget;
    this.unrequestedTileKeysOverBudget = unrequestedTileKeys;
    // P5f complex-gate should-fix 2 ("drain ignores over-budget", the resume half): a tile already
    // sitting in `queue` from BEFORE this flag was set stays there until a slot frees AND this flag
    // clears -- `drainQueueIfRoom` itself now refuses to mint while `overBudgetFlag` is set (see its
    // own doc comment), so nothing resumes it automatically the moment the flag clears unless this
    // call does. A no-op when the queue is already empty or the flag is still set.
    if (!overBudget) this.drainQueueIfRoom();
  }

  /**
   * Camera-change entry point (item B) -- called through the SAME debounce/throttle seam
   * `ViewportStreamManager.requestViewport` already is (untouched); this class has no debounce/
   * throttle of its own. Computes `bbox`'s covering tiles at the active level (deterministic
   * row-major order, `tilesCoveringBbox`) and:
   *  - drops any tracked (queued or in-flight) tile no longer covered -- queued: silently, from the
   *    queue; in-flight: cancelled, `onTileSuperseded` fires (per-tile supersede, never wholesale);
   *  - issues one `viewport_query` per covering tile that is NEITHER already tracked NOR already
   *    resident (per `TileResidencyAccessor`), up to `MAX_IN_FLIGHT_TILE_STREAMS` concurrent, the
   *    rest queued;
   *  - while `overBudget` is set, issues nothing new (already-tracked/resident tiles are unaffected).
   */
  onCameraChange(bbox: AuthoritativeBbox, filter: Filter | null = null): TilePlanOutcome {
    if (this.stopped) return { kind: "stopped" };
    const frame = this.frame;
    if (frame === null) return { kind: "no-frame" };
    this.currentFilter = filter;

    const covering = tilesCoveringBbox(frame, this.level, bbox);
    const coveringKeys = new Set(covering.map(tileKeyToString));

    for (const [tileKey, state] of [...this.tileState.entries()]) {
      if (coveringKeys.has(tileKey)) continue;
      if (state === "queued") {
        this.queue = this.queue.filter((k) => tileKeyToString(k) !== tileKey);
        this.tileState.delete(tileKey);
        this.issueEpoch.set(tileKey, (this.issueEpoch.get(tileKey) ?? 0) + 1);
        continue;
      }
      if (state === "issuing") {
        // A ticket is still minting for a tile no longer covered -- bump the epoch so the eventual
        // resolve abandons its ticket (`mintAndStart`'s own epoch check), and free the slot NOW
        // rather than waiting on that mint, so a still-covered queued tile can use it immediately
        // (`drainQueueIfRoom` below). No stream ever started, so nothing was ever resident -- dropped
        // silently, same as a never-issued "queued" tile, never `onTileSuperseded`.
        this.tileState.delete(tileKey);
        this.issueEpoch.set(tileKey, (this.issueEpoch.get(tileKey) ?? 0) + 1);
        continue;
      }
      const inFlight = this.inFlightStreams.get(tileKey);
      if (inFlight) {
        this.cancelTileStream(tileKey, inFlight.streamHandle, true);
      }
    }
    this.drainQueueIfRoom(); // slots freed above may let a still-covered queued tile start now

    const issued: string[] = [];
    const queuedNow: string[] = [];
    const alreadyResident: string[] = [];

    // P5f complex-gate should-fix 2 (the "undeclared fan-out" half): split "which covering tiles are
    // genuinely NEW candidates this round" from "how many of those can this manager actually take on"
    // -- already-tracked/already-resident tiles are NEVER part of either the candidate list or the
    // truncation below; only tiles that would otherwise start fresh minting/queueing are bounded.
    const newCandidates: TileKey[] = [];
    for (const key of covering) {
      const tileKey = tileKeyToString(key);
      if (this.tileState.has(tileKey)) continue;
      if (this.opts.residency.isTileResident(tileKey)) {
        alreadyResident.push(tileKey);
        continue;
      }
      newCandidates.push(key);
    }

    let toConsider = newCandidates;
    let coveringTruncated: true | undefined;
    let truncatedCount: number | undefined;
    const freeSlots = Math.max(0, MAX_IN_FLIGHT_TILE_STREAMS - this.activeSlotCount());
    const availableQueueRoom = Math.max(0, MAX_QUEUED_TILES - this.queue.length);
    const capacity = freeSlots + availableQueueRoom;
    if (newCandidates.length > capacity) {
      const centre = { x: (bbox.xmin + bbox.xmax) / 2, y: (bbox.ymin + bbox.ymax) / 2 };
      const withDistance = newCandidates.map((key) => ({
        key,
        distance: tileDistanceToPoint(frame, this.level, key, centre),
      }));
      // Nearest-first keep, farthest-first drop -- `Array.prototype.sort` is stable (ties, e.g. two
      // cells equidistant from centre, keep `tilesCoveringBbox`'s own deterministic row-major order).
      withDistance.sort((a, b) => a.distance - b.distance);
      toConsider = withDistance.slice(0, capacity).map((e) => e.key);
      coveringTruncated = true;
      truncatedCount = newCandidates.length - capacity;
    }

    // Viewport-residency cut P6a, Defect A: the drain-stop exception -- while `overBudgetFlag` is
    // set, a candidate is still let through if the residency accessor reports current headroom
    // (`hasHeadroom`, optional -- absent means "no exception," the pre-existing behaviour). Computed
    // ONCE per plan, not per candidate: headroom is a fact about the resident set as a whole at this
    // moment, not about any one tile.
    const headroomDespiteOverBudget = this.overBudgetFlag ? (this.opts.residency.hasHeadroom?.() ?? false) : true;

    for (const key of toConsider) {
      const tileKey = tileKeyToString(key);
      if (this.overBudgetFlag && !headroomDespiteOverBudget) continue;

      if (this.activeSlotCount() < MAX_IN_FLIGHT_TILE_STREAMS) {
        this.beginIssue(key, tileKey);
        issued.push(tileKey);
      } else {
        this.tileState.set(tileKey, "queued");
        this.queue.push(key);
        queuedNow.push(tileKey);
      }
    }

    return { kind: "planned", issued, queued: queuedNow, alreadyResident, coveringTruncated, truncatedCount };
  }

  /**
   * Full invalidation (item B's own carve-out: "Filter changes and dataset changes still clear
   * everything," the honest reading of Apply-as-first-look -- a filter changes row membership).
   * Cancels every in-flight/queued tile and reports every currently-resident tile key (supplied by
   * the caller, which owns the actual residency) via `onTileSuperseded` with a `null` stream handle,
   * mirroring `ViewportStreamManager.supersedeCurrent`'s wholesale `clearResidency`, enumerated per
   * tile since there is no single stream handle to name here. Also clears `overBudget` -- a fresh
   * generation starts unconstrained.
   *
   * **P5f complex-gate must-fix 1.** A tile mid-ticket-mint (`"issuing"` -- a slot claimed,
   * `viewportQuery`/`dataPlaneAttach` awaits in flight, no stream handle exists yet) is tracked in
   * `tileState` but NOT in `inFlightStreams` (no stream to cancel) and NOT in `queue` (already
   * dequeued by `beginIssue`) -- before this fix, neither loop above ever reached it, so its
   * `tileState`/`issueEpoch` entries survived this call untouched. Its ticket then resolved AFTER
   * this clear, `mintAndStart`'s own epoch check found nothing had bumped its epoch, and it started a
   * real stream into the NEW generation carrying a filter/residency state from the OLD one -- and
   * because `tileState` still (wrongly) named it tracked, planning never re-requested it either.
   * Swept here exactly like `onCameraChange`'s own `"issuing"` branch does (`:199-207` above): epoch
   * bumped (so `mintAndStart`'s eventual resolve abandons its ticket) and the `tileState` entry
   * dropped (so the tile is `NOT tracked` and therefore genuinely re-queryable on the very next
   * `onCameraChange`). Runs AFTER the two loops above, which already emptied `tileState` of every
   * `"queued"`/`"in-flight"` entry -- what remains is exactly the `"issuing"` set.
   */
  clearAll(residentTileKeysHint: readonly string[] = []): void {
    for (const [tileKey, entry] of [...this.inFlightStreams.entries()]) {
      this.cancelTileStream(tileKey, entry.streamHandle, true);
    }
    for (const key of this.queue) {
      const tileKey = tileKeyToString(key);
      this.tileState.delete(tileKey);
      this.issueEpoch.set(tileKey, (this.issueEpoch.get(tileKey) ?? 0) + 1);
    }
    this.queue = [];
    for (const [tileKey, state] of [...this.tileState.entries()]) {
      // The two loops above already emptied `tileState` of every `"queued"`/`"in-flight"` entry, so
      // this `state !== "issuing"` guard should never actually skip anything -- kept explicit
      // (rather than assuming the invariant) so a future change to either loop above fails loudly
      // here instead of silently leaving a non-`"issuing"` entry behind uncleared.
      if (state !== "issuing") continue;
      this.tileState.delete(tileKey);
      this.issueEpoch.set(tileKey, (this.issueEpoch.get(tileKey) ?? 0) + 1);
    }
    for (const tileKey of residentTileKeysHint) {
      this.opts.onTileSuperseded(tileKey, null);
    }
    this.overBudgetFlag = false;
    this.unrequestedTileKeysOverBudget = [];
  }

  /** Cancels the active stream (if any) for a specific tile, wherever it is in this manager's own
   * lifecycle -- mirrors `ViewportStreamManager.cancelStream`'s "regardless of whether it is
   * currently active" contract, restated per-tile. */
  async cancelTile(tileKey: string): Promise<void> {
    const inFlight = this.inFlightStreams.get(tileKey);
    if (inFlight) {
      this.cancelTileStream(tileKey, inFlight.streamHandle, true);
      return;
    }
    if (this.tileState.get(tileKey) === "queued") {
      this.queue = this.queue.filter((k) => tileKeyToString(k) !== tileKey);
      this.tileState.delete(tileKey);
      this.issueEpoch.set(tileKey, (this.issueEpoch.get(tileKey) ?? 0) + 1);
    }
  }

  /** Cancels every in-flight tile stream and refuses every future `onCameraChange` call -- dataset
   * close, mirrors `ViewportStreamManager.stop()`. */
  async stop(): Promise<void> {
    this.stopped = true;
    for (const entry of this.inFlightStreams.values()) {
      this.selfCancelledHandles.add(entry.streamHandle);
      void skpCancel(entry.streamHandle).catch((err) => logRejectedCancel("stop", entry.streamHandle, err));
    }
    this.inFlightStreams.clear();
    for (const key of this.queue) {
      this.issueEpoch.set(tileKeyToString(key), (this.issueEpoch.get(tileKeyToString(key)) ?? 0) + 1);
    }
    this.queue = [];
    this.tileState.clear();
  }

  /** Claims a concurrency slot for `tileKey` (`"issuing"`) and starts minting its ticket. Called
   * both directly from `onCameraChange` (a slot was free at plan time) and from
   * `drainQueueIfRoom` (a slot just freed up) -- the state transition lives here, once, so neither
   * caller can forget it. */
  private beginIssue(key: TileKey, tileKey: string): void {
    this.tileState.set(tileKey, "issuing");
    const epoch = (this.issueEpoch.get(tileKey) ?? 0) + 1;
    this.issueEpoch.set(tileKey, epoch);
    void this.mintAndStart(key, tileKey, epoch);
  }

  /**
   * P5f complex-gate should-fix 2 (the "drain ignores over-budget" half): before this fix, a tile
   * already sitting in `queue` from BEFORE `setOverBudget(true, ...)` was called would still mint the
   * moment an unrelated in-flight stream ended and freed a slot -- `onCameraChange`'s own `overBudget
   * Flag` check (`:227` above) only ever gated NEW tiles at plan time, never this queue drain, which
   * runs independently from several call sites (a terminal, a supersede, `clearAll`). Guarded here
   * instead so every call site is covered at once: while over budget, queued tiles simply wait,
   * however many slots free up, until `setOverBudget(false, ...)` resumes draining (that method's own
   * doc comment has the resume half).
   */
  private drainQueueIfRoom(): void {
    if (this.overBudgetFlag) return;
    while (this.queue.length > 0 && this.activeSlotCount() < MAX_IN_FLIGHT_TILE_STREAMS) {
      const key = this.queue.shift()!;
      const tileKey = tileKeyToString(key);
      if (this.tileState.get(tileKey) !== "queued") continue; // dropped while queued -- skip
      this.beginIssue(key, tileKey);
    }
  }

  private async mintAndStart(key: TileKey, tileKey: string, epoch: number): Promise<void> {
    const frame = this.frame;
    if (frame === null) return; // unreachable in practice: onCameraChange never issues before a frame exists
    const bbox = tileBbox(frame, this.level, key);
    const wireBbox = toWireBbox(bbox);

    // Viewport-residency cut P3i-c (gap G-B): mirrors `ViewportStreamManager.requestViewport`'s own
    // `traceViewportQuery` call -- always-on render-trace (never instrument-gated), one line per
    // per-tile query attempt, the tiled analogue of baseline's per-viewport-change attempt.
    traceViewportQuery(this.opts.dataset, wireBbox, null);

    let ticket: { stream: string };
    try {
      ticket = await viewportQuery(this.opts.dataset, wireBbox, null, null, this.currentFilter);
    } catch {
      if (this.issueEpoch.get(tileKey) === epoch) {
        this.tileState.delete(tileKey);
        this.drainQueueIfRoom();
      }
      return;
    }

    if (this.stopped || this.issueEpoch.get(tileKey) !== epoch) {
      await skpCancel(ticket.stream).catch((err) => logRejectedCancel("mintAndStart(abandoned-pre-attach)", ticket.stream, err));
      return;
    }

    const attach = await dataPlaneAttach();
    if (this.stopped || this.issueEpoch.get(tileKey) !== epoch) {
      await skpCancel(ticket.stream).catch((err) => logRejectedCancel("mintAndStart(abandoned-post-attach)", ticket.stream, err));
      return;
    }

    this.tileState.set(tileKey, "in-flight");
    this.inFlightStreams.set(tileKey, { streamHandle: ticket.stream });
    this.nextBatchSeqByStream.set(ticket.stream, 0);
    const streamHandleAtStart = ticket.stream;

    const sink: StreamSink = {
      onOpen: () => {},
      onBatch: (payload) => {
        if (this.inFlightStreams.get(tileKey)?.streamHandle !== streamHandleAtStart) return;
        // Viewport-residency cut P3i (RESIDENCY-PREREGISTRATION.md §12 Amendment 15): DEV-only, the
        // candidate arm's own analogue of `viewportStreamManager.ts`'s identical hook -- the earliest
        // client-observable moment for this batch's own data-plane bytes, before decode.
        if (isInstrumentedBuild()) {
          recordResidencyBatchArrived();
        }
        const seq = this.nextBatchSeqByStream.get(streamHandleAtStart) ?? 0;
        this.nextBatchSeqByStream.set(streamHandleAtStart, seq + 1);
        this.opts.onBatch(tileKey, streamHandleAtStart, seq, payload);
      },
      onProgress: () => {},
      onTerminal: (terminal) => {
        const stillActive = this.inFlightStreams.get(tileKey)?.streamHandle === streamHandleAtStart;
        if (stillActive) {
          this.inFlightStreams.delete(tileKey);
          this.tileState.delete(tileKey);
        }
        this.nextBatchSeqByStream.delete(streamHandleAtStart);
        if (this.selfCancelledHandles.delete(streamHandleAtStart)) {
          this.drainQueueIfRoom();
          return;
        }
        this.opts.onTerminal?.(tileKey, streamHandleAtStart, terminal);
        this.drainQueueIfRoom();
      },
    };

    startStream({ url: attach.url, subprotocols: attach.subprotocols, ticketHandle: ticket.stream, sink });
    // Viewport-residency cut P3i-c (gap G-B): mirrors `ViewportStreamManager.requestViewport`'s own
    // `traceStreamIssued` call, fired at the same moment -- right after the real mint, never before.
    traceStreamIssued(this.opts.dataset, ticket.stream);
  }

  private cancelTileStream(tileKey: string, streamHandle: string, reportSuperseded: boolean): void {
    this.inFlightStreams.delete(tileKey);
    this.tileState.delete(tileKey);
    this.issueEpoch.set(tileKey, (this.issueEpoch.get(tileKey) ?? 0) + 1);
    this.selfCancelledHandles.add(streamHandle);
    void skpCancel(streamHandle).catch((err) => logRejectedCancel("cancelTileStream", streamHandle, err));
    if (reportSuperseded) {
      this.opts.onTileSuperseded(tileKey, streamHandle);
    }
    this.drainQueueIfRoom();
  }
}
