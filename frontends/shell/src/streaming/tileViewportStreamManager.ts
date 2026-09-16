// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import type { TileGridFrame, TileKey, TileKeyMembership } from "../canvas/tileGrid";
import { coverMembershipFor, deriveTileGridFrame, tileBbox, tileCoverForBbox, tileDistanceToPoint, tileKeyToString } from "../canvas/tileGrid";
import type { TileGridLevel } from "../canvas/tileGridConstants";
import { DEFAULT_TILE_GRID_LEVEL, MAX_IN_FLIGHT_TILE_STREAMS, MAX_QUEUED_TILES } from "../canvas/tileGridConstants";
import type { AuthoritativeBbox } from "../canvas/viewportBbox";
import { traceStreamIssued, traceViewportQuery } from "../diagnostics/renderTrace";
import { logSessionEvent } from "../diagnostics/log";
import { recordResidencyBatchArrived } from "../instrument/residencyInstrument";
import { isInstrumentedBuild } from "../isInstrumentedBuild";
import { encodeHexF64 } from "../skp/codec";
import { cancel as skpCancel, SkpCallError, viewportQuery } from "../skp/client";
import type { Bbox, Filter } from "../skp/types";
import { startStream } from "./adapterWs";
import { isSourceChangedTerminal, LiveTicketSet } from "./liveTicketSet";
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
      /** Close-out fix piece F1 (entry 44's second finding, ADR-028's architect-gate clarification 3
       * / Amendment 1 -- NOT the accepted Decision's own item 3, which is cross-tile de-duplication):
       * EVERY key
       * `tileCoverForBbox` produced this round for `bbox` at `this.level` -- the geometric
       * covering set, before this round's own tracked/resident/headroom bookkeeping decides what to
       * do with each one. **Entry 60 (2026-09-08): "every key it produced" is now bounded by
       * `MAX_COVERING_TILES`** -- a cover past that bound arrives here as the declared centred window
       * with `coveringTruncated` set (`tileGrid.ts`'s own `TileCover`), never as the full geometric
       * set and never silently.
       *
       * **What that array is, and what it is NOT, since entry 66 (b): the predicate protects; the
       * array plans.** Past `MAX_COVERING_TILES` this array is the centred
       * `COVER_WINDOW_CELLS_PER_AXIS` (256 x 256) window, not the covering set. What it still
       * decides is planning: which tiles this round issues or queues, `candidateArmSession.ts`'s own
       * `lastCoveringTileKeys` for the `isFillComplete` per-tile check, and the truncation
       * bookkeeping below. What it no longer decides is PROTECTION, in either of the two places it
       * used to:
       *  (i) the eviction-PROTECTED set is now `tileGrid.ts`'s own `coverMembershipFor(frame, level,
       *      bbox)` predicate, built by `candidateArmSession.ts` from this round's own triple and
       *      passed to `WorkingCanvasHandle.applyTileViewportContext`, which threads it to
       *      `protectionSetFor`/`viewportTileKeys` and `tileResidentSet.ts`'s own
       *      protected-membership tests; and
       *  (ii) the supersede KEEP-set in `onCameraChange`'s own loop below is `coveringKeys.has(k) ||
       *      membership.has(k)`, so an in-flight in-view tile outside the window is no longer
       *      superseded and blanked through the caller's `clearTile`.
       * So ADR-028 **Amendment 3**'s rule -- its "What replaces it" paragraph (ADR-028:459-462),
       * whose quoted sentence is "A tile intersecting the viewport is protected whether it is
       * complete or partial, tracked this round or a prior one, or never requested at all"
       * (:461-462) -- holds at every zoom again, for eviction protection and for the keep-set alike.
       * (Amendment 1 is NOT the source of that sentence: it declared the partial-covering eviction
       * exception Amendment 3 then withdrew, ADR-028:451-453.) The keep-set half has one declared
       * consequence of its own -- a retained queued tile is issued by `drainQueueIfRoom` only if it
       * is still in view at mint time, and dropped there otherwise -- stated in full at that loop's
       * own comment and at `drainQueueIfRoom`'s own doc comment below.
       *
       * **The window no longer decides `fits` either (the human's ruling, DECISIONS-PENDING entry
       * 76 item (1)).** `WorkingCanvas.tsx`'s own latch used to ITERATE the covering-only ref, which
       * is why it could not consume a predicate; it now iterates the RESIDENT tile keys and tests the
       * round's own membership (`anyPartialInView`, that file's own exported seam), so past the bound
       * "fits" and over-budget are decided over the true cover. Path (ii) of ADR-028's 2026-09-09
       * appended note (`:512`) is CLOSED on that ruling, together with path (i); the operator-visible
       * consequence is declared there and in `ENTRY-66B-PREREGISTRATION.md` §14 Amendment 4. When the
       * window regime is reached at all, from entry 60's own recorded arithmetic and no new
       * measurement of any kind (~3.63x tiles per wheel notch; ~2 notches past a "Zoom to layer" fit
       * already passes 512, and this bound is 128x that): about six notches past the fit.
       *
       * **What is NOT affected: the completeness claim.** A windowed cover sets `coveringTruncated`
       * below, `candidateArmSession.ts` latches it into `lastCoveringTruncated`, and
       * `isFillComplete` refuses on that flag outright (the reason is in that check's own comment) --
       * so no "Showing all N" claim is ever made over a windowed cover; the operator gets the
       * declared partial-view status instead. Entry 66 (b) changes no completeness field, no
       * constant, and nothing about what is enumerated.
       *
       * **Ruled by the human on 2026-09-09: DECISIONS-PENDING entry 66 = (d).** The narrowing was a
       * DECLARED EXCEPTION, recorded in ADR-028's own appended note, not an open question left at
       * this seam; the redesign that needs no enumeration at all -- protection from the cover's own
       * index ranges rather than from a materialised set -- was preregistered as the first post-tag
       * piece (`RELEASE-0.1.md` Amendment 12, expanded in `frontends/shell/ENTRY-66B-PREREGISTRATION
       * .md`) and is what the paragraphs above describe as landed for path (i). Path (ii), the `fits`
       * latch, was left to the human by that piece and is now closed too, on the ruling of entry 76
       * (the second batch of the same piece): both paths of the exception are discharged, which is
       * why the disclosure above is stated as closed rather than qualified.
       *
       * Unlike `issued`/`queued`/`alreadyResident` (which between them omit (i) a
       * tile already tracked from a PRIOR round, dropped silently by the `this.tileState.has(tileKey)
       * continue` branch above, and (ii) a genuinely new candidate dropped this round for lack of
       * headroom while over budget, `:491` below) this field never omits either -- it is exactly
       * `covering.map(tileKeyToString)`, deduplicated by construction (`tilesCoveringBbox` never
       * repeats a cell) and in the SAME deterministic row-major order. The caller
       * (`candidateArmSession.ts`'s `handleViewportChange`) uses this, not the union of the other
       * three arrays, for its own `lastCoveringTileKeys` (the `isFillComplete()` per-tile check) --
       * so a tile this round could not issue/queue/already-resident-count is still counted against
       * completeness rather than silently falling out of it. Since entry 66 (b) it is NOT what
       * carries eviction protection any more (the predicate is, see above), which is what makes that
       * completeness sentence true for every cover rather than for covers at or under
       * `MAX_COVERING_TILES` only: the geometric rule ADR-028's architect-gate clarification 3 states
       * ("never evict a tile intersecting the current viewport", ADR-028:88-89), and Amendment 3
       * restores to ONE declared exception (the dedupe-owner cascade, ADR-028:451-457, the same
       * sentence quoted at :452), is discharged by the predicate now, not by this array. */
      covering: string[];
      /** P5f complex-gate should-fix 2: `true` when this round's NEW (neither already tracked
       * nor already resident) covering tiles exceeded this manager's own issuing/queueing capacity
       * (`MAX_IN_FLIGHT_TILE_STREAMS`'s free slots plus `MAX_QUEUED_TILES`'s own remaining room) and
       * had to be truncated, farthest-from-view-centre-first, to fit. **Entry 60: also `true` when
       * the cover itself hit `MAX_COVERING_TILES` and was bounded before allocation
       * (`tileGrid.ts`'s own `tileCoverForBbox`) -- the same field, deliberately, because it is the
       * same fact for an operator: this view is showing part of what it covers.** Omitted entirely
       * (never `false`) on the ordinary, untruncated path -- so every pre-existing
       * `toEqual({kind:"planned", ...})` assertion that predates this field keeps matching (`toEqual`
       * treats an absent property and an explicit `undefined` as equivalent). */
      coveringTruncated?: true;
      /** Present iff `coveringTruncated` is -- how many tiles this round dropped: new candidate tiles
       * never queued and never issued by the capacity truncation above, PLUS (entry 60) cells the
       * enumeration bound never materialised at all (`TileCover.omittedCellCount`), summed when both
       * happened. Diagnostic only; nothing branches on the number. */
      truncatedCount?: number;
    }
  /** `onCameraChange` called before `establishGridFrame` ever ran -- nothing to plan against yet. */
  | { kind: "no-frame" }
  | { kind: "stopped" }
  /** Brief A boundary 4: this dataset's session ended because its source was observed to have
   * changed. Distinct from `"stopped"`, which is an ordinary teardown -- this one means the data
   * this manager was serving is gone, and the only way forward is to reopen the dataset. */
  | { kind: "session-ended" };

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

/** Item A (residency-debt cut 1b, entries 32/33): `relinquishOutstanding`'s own BS2 report for a
 * tile that WAS in flight -- distinguishable from `onTileSuperseded` (out-of-view supersede, budget
 * self-cancel) by construction: this function is the ONLY caller of this log level, and
 * `relinquishOutstanding` never calls `onTileSuperseded` at all (the resident view is retained, not
 * superseded -- that method's own doc comment has the full account). */
function logRelinquishCancelled(tileKey: string, streamHandle: string): void {
  logSessionEvent(
    "tile-stream-relinquish-cancelled",
    `${tileKey} ${streamHandle}: cancelled by the scoped relief lever -- in-flight stream cancel issued, already-admitted residency retained`
  );
}

/** Item A: the sibling report for a tile that was only ever `"queued"` or mid-ticket-mint
 * (`"issuing"`) -- never started a real stream, so there is nothing to cancel, only to drop. A
 * distinct log level from `logRelinquishCancelled` above -- BS2's own text (RESIDENCY-DEBT-1B.md):
 * "Every lever-dropped tile is reported, distinguishable from supersede and from self-cancel." */
function logRelinquishDropped(tileKey: string): void {
  logSessionEvent(
    "tile-stream-relinquish-dropped",
    `${tileKey}: dropped by the scoped relief lever -- queued/mid-mint tile never started a stream`
  );
}

/** DECISIONS-PENDING entry 87 §2.3(i), UNCONDITIONAL (docs/01 principle 8): every refusal
 * `mintAndStart`'s own `viewportQuery` catch can receive is now named, never silently deleted
 * again. `SkpCallError` carries the typed `code` and `fields` `protocol/skp/SKP-V0.md` §5 declares
 * (`skp/client.ts:24-31`); a non-SKP throw (a genuine transport/network failure, never a typed
 * refusal) logs under the exact same line shape with the declared code `"unknown"` -- this is
 * always one log line per refusal, never a second shape to keep in sync with this one. Fired
 * BEFORE the epoch check below it in `mintAndStart` -- an epoch-superseded refusal (the tile left
 * the view before its own mint even resolved) is still a refusal that happened and is still named,
 * exactly as `logRejectedCancel` above already names a rejected cancel regardless of what the
 * caller goes on to do with that fact. */
function logMintRefused(tileKey: string, err: unknown): void {
  const code = err instanceof SkpCallError ? err.skpError.code : "unknown";
  const fields = err instanceof SkpCallError ? err.skpError.fields : {};
  // Fire-and-forget, same as every other `logSessionEvent` call in this module -- a binding-local
  // diagnostic (ADR-010 rule 7), never an SKP field, so this is not an ADR-004 data-hot-path
  // concern. Its own volume is bounded by tiles-in-cover x zoom-out notches, the same bound every
  // other per-tile trace/log line in this module already carries; no new unbounded source.
  logSessionEvent("tile-stream-mint-refused", `${tileKey}: ${code} ${JSON.stringify(fields)}`);
}

/** Entry 87 §2.3(i)'s other unconditional site: the two epoch-abandon branches in `mintAndStart`
 * (a ticket minted successfully, but the tile is no longer wanted -- the dataset stopped, or a
 * later camera change already moved this tile's own epoch on). Distinct from `logMintRefused`
 * above (that is a REFUSAL; this ticket was granted and is simply no longer needed) and distinct
 * from `logRejectedCancel` (that logs only if the cancel THIS function issues itself then fails) --
 * this one names the abandonment itself, which previously had no trace at all. */
function logMintAbandoned(context: string, tileKey: string, streamHandle: string): void {
  logSessionEvent("tile-stream-mint-abandoned", `${context} ${tileKey} ${streamHandle}: ticket minted but no longer wanted -- cancel issued`);
}

/** Reviewer fix (entry 87, §2.4 (4)): the ONLY positive per-tile "this tile did go on to mint"
 * signal available to a harness reading the session log -- fired ONLY for a tile that had spent
 * its bounded retry (`requeuedTiles.has(tileKey)`, checked at the "in-flight" transition in
 * `mintAndStart`), never for an ordinary first-attempt success. Narrow and bounded by the SAME
 * tiles-refused population `logMintRefused` already logs -- the common case (never refused) stays
 * exactly as quiet as it always was; no volume added to it. `e2e/regression.mjs`'s
 * `tileMintOutcomesSince` reads this line (alongside `tile-stream-mint-refused`) to tell a
 * tile that was refused-then-recovered apart from one that was refused and never minted at all --
 * a distinction the render trace's own tile-key-less `viewport_query`/`stream-issued` lines cannot
 * make (this module's own long-standing constraint, restated at that function's own doc comment). */
function logMintRecovered(tileKey: string, streamHandle: string): void {
  logSessionEvent("tile-stream-mint-recovered", `${tileKey}: ${streamHandle}`);
}

/** Entry 87 §2.3(iii)'s declared retryable set -- `engine.connections_exhausted` ALONE, since
 * ADR-033's engine half landed (entry 91 (a)): `AdmittedPredicate::admit` now leases its own
 * `LeaseClass::Admission` (`engine/src/predicate.rs`) and a residual capacity failure surfaces as
 * that typed code, never as `skp.filter_rejected_by_binder` (`engine/src/pool.rs`'s
 * `MAX_ADMISSION_CONNECTIONS`, sized to this module's own `MAX_IN_FLIGHT_TILE_STREAMS` plus the
 * baseline query, so this class is composition-unreachable for this shell in ordinary operation).
 * `skp.filter_rejected_by_binder` is therefore never retried here any more -- it now means what its
 * name says, a genuine DuckDB binder refusal, and retrying a genuinely invalid predicate would just
 * spin on a refusal that will never change. */
const RETRYABLE_ENGINE_CODE = "engine.connections_exhausted";

/** Entry 87 §2.3(iii): is this refusal one the bounded requeue may retry at all -- checked BEFORE
 * the per-candidacy "already used its one retry" (`requeuedTiles`) and "still in view"
 * (`latestMembership`) bounds, both enforced at the call site in `mintAndStart`'s own catch. Any
 * code outside the declared set (including `skp.filter_rejected_by_binder`, `filter_too_long`,
 * `filter_unparsable`, every other `skp.filter_*` code, and a non-SKP transport error) keeps
 * today's drop, now logged by `logMintRefused` above. */
function isRetryableRefusal(err: unknown): boolean {
  if (!(err instanceof SkpCallError)) return false;
  return err.skpError.code === RETRYABLE_ENGINE_CODE;
}

/** `"queued"`: waiting in `queue` for a concurrency slot. `"issuing"`: a slot was claimed and
 * `viewportQuery`/`dataPlaneAttach` are in flight (no stream handle yet -- ticket minting itself
 * crosses real awaits, see `issueEpoch`'s own doc comment). `"in-flight"`: a real stream is
 * running. Both `"issuing"` and `"in-flight"` occupy a `MAX_IN_FLIGHT_TILE_STREAMS` slot -- counting
 * only `"in-flight"` would let more tiles start minting than the cap allows, since minting is async
 * and several tiles can be mid-mint before any of them resolves to an actual stream. */
type TileRequestState = "queued" | "issuing" | "in-flight";

export class TileViewportStreamManager {
  /**
   * **The dataset-session generation, mirrored by live-ticket set** (Brief A boundary 4; §13 D) --
   * the tiled arm's own instance of `ViewportStreamManager`'s, holding every tile's ticket rather
   * than one. Invalidation clears all of them at once, which is what the generation being *per
   * dataset-session* means: a change to the source does not end one tile, it ends the session.
   *
   * Deliberately not named `generation`: `issueEpoch` beside it is this manager's own per-tile
   * supersede counter and an unrelated fact.
   */
  private readonly liveTickets = new LiveTicketSet();
  private frame: TileGridFrame | null = null;
  private readonly level: TileGridLevel;
  private stopped = false;
  /** Brief A boundary 4: latched the moment a terminal carries `engine.source_changed`. Permanent
   * for this manager -- reopening the dataset builds a new one. */
  private sessionEnded = false;
  private overBudgetFlag = false;
  // S2 (reviewer gate, close-out fix piece): a THUNK, not an eagerly-computed array -- see
  // `setOverBudget`'s own doc comment for why. Defaults to a constant empty-array thunk so this
  // field is never literally `undefined`.
  private unrequestedTileKeysOverBudgetThunk: () => string[] = () => [];

  /** Entry 66 (b), the human's ruling of DECISIONS-PENDING entry 76 item (2): the membership this
   * manager built at its MOST RECENT `onCameraChange` -- `tileGrid.ts`'s own
   * `coverMembershipFor(frame, level, bbox)` over that round's own triple, the SAME object the
   * supersede keep-test below used, never a second predicate and never a second triple
   * (`ENTRY-66B-PREREGISTRATION.md` §14 Amendment 4, block-on-sight 8). `drainQueueIfRoom` re-tests
   * every queued tile against it at mint time, so the declared behaviour is: *retained across the
   * supersede prune, and issued only if still in view at drain; otherwise dropped at drain.* `null`
   * until the first plan ever runs -- with no membership yet there is nothing to test against and
   * the drain issues exactly as it did before (the queue is empty at that point in any case).
   * Not reset by `clearAll`/`stop`, and that cannot go stale for any queued tile: `clearAll` empties
   * the queue, and the queue refills only inside `onCameraChange`, which reassigns this field before
   * its prune loop -- so every tile the drain ever tests was enqueued under the membership it holds
   * (Amendment 5 (e)). */
  private latestMembership: TileKeyMembership | null = null;

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
  /** Entry 87 §2.3(iii): which tiles have already spent their one bounded requeue. **The bound is
   * per CANDIDACY, tighter than "per drain"**: a candidacy begins the moment a tileKey becomes a
   * genuinely NEW candidate in `onCameraChange` (this set is cleared there, right below) and lasts
   * until it is dropped or resolved -- it can survive several `drainQueueIfRoom` calls (the retry's
   * own reissue is itself drained), but grants exactly one retry across all of them, not one per
   * call. `isRetryableRefusal`'s own doc has the full account of why a per-epoch key cannot express
   * this (a requeue's own reissue always claims a fresh epoch). Cleared on an ordinary
   * (non-retried) drop too, and in `clearAll`/`stop` (a wholesale invalidation is a fresh start for
   * every tile, the same as `latestMembership` above is NOT reset by them -- this set is), so a
   * stale entry never outlives the attempt it was spent on. */
  private readonly requeuedTiles = new Set<string>();

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
    // S2 (reviewer gate, close-out fix piece): computed HERE, on read, not at `setOverBudget` call
    // time -- see that method's own doc comment.
    return this.unrequestedTileKeysOverBudgetThunk();
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
   *
   * **S2 (reviewer gate, close-out fix piece): `unrequestedTileKeys` accepts a plain array OR a
   * thunk (`() => string[]`).** The array's own sole reader anywhere in `src/` is the
   * `unrequestedTilesOverBudget` getter's own unit test (`tileViewportStreamManager.test.ts`) --
   * nothing in product code ever consumes it. F1 made the caller's own input the full geometric
   * covering set (`TilePlanOutcome.covering`, unbounded by `coveringIndexRange`, `tileGrid.ts:164-
   * 173`), so computing the `!isTileResidentInCandidateSet` filter EAGERLY, on every over-budget
   * batch ingest and every camera change, did that filtering work for a value this codebase never
   * reads back. A thunk lets the caller (`candidateArmSession.ts`) defer that filter to this getter's
   * own read instead -- the getter's own tested contract (a `readonly string[]`) is unchanged; only
   * WHEN the underlying computation runs moves, from call time to read time. No perf claim: this is
   * about not doing unconsumed work, not a measured cost.
   */
  setOverBudget(overBudget: boolean, unrequestedTileKeys: string[] | (() => string[]) = []): void {
    this.overBudgetFlag = overBudget;
    this.unrequestedTileKeysOverBudgetThunk =
      typeof unrequestedTileKeys === "function" ? unrequestedTileKeys : () => unrequestedTileKeys;
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
   * row-major order, `tileCoverForBbox`, bounded by `MAX_COVERING_TILES` per entry 60) and:
   *  - drops any tracked (queued or in-flight) tile no longer covered -- queued: silently, from the
   *    queue; in-flight: cancelled, `onTileSuperseded` fires (per-tile supersede, never wholesale);
   *  - issues one `viewport_query` per covering tile that is NEITHER already tracked NOR already
   *    resident (per `TileResidencyAccessor`), up to `MAX_IN_FLIGHT_TILE_STREAMS` concurrent, the
   *    rest queued;
   *  - while `overBudget` is set, issues nothing new (already-tracked/resident tiles are unaffected).
   */
  onCameraChange(bbox: AuthoritativeBbox, filter: Filter | null = null): TilePlanOutcome {
    if (this.stopped) return { kind: "stopped" };
    // Latched by `endSession`: nothing is re-requested after the source was observed to have
    // changed. Checked before `frame`, because a session that ended is a stronger fact than a
    // manager that has not been given a frame yet.
    if (this.sessionEnded) return { kind: "session-ended" };
    const frame = this.frame;
    if (frame === null) return { kind: "no-frame" };
    this.currentFilter = filter;

    // DECISIONS-PENDING entry 60 (ruled (a) 2026-09-08), RELEASE-0.1.md Amendment 10: the cover is
    // BOUNDED before it is allocated (`tileCoverForBbox`, `canvas/tileGrid.ts`) -- this call used to
    // be `tilesCoveringBbox`, whose nested loop ran over the whole span before `MAX_QUEUED_TILES`
    // (below) ever truncated anything. The only new fact reaching this method is `cover.kind`; the
    // truncation state it feeds (`coveringTruncated`/`truncatedCount`, and the settled-partial status
    // the candidate arm derives from them) is the one this method already had.
    const cover = tileCoverForBbox(frame, this.level, bbox);
    const covering = cover.keys;
    const coveringKeys = new Set(covering.map(tileKeyToString));
    // Entry 66 (b): the supersede KEEP-set is geometric, from the SAME `(frame, level, bbox)` triple
    // the cover above was built from -- `coverMembershipFor`'s own declared invariant. Nothing else
    // may build it here.
    const membership = coverMembershipFor(frame, this.level, bbox);
    // ...and it is RETAINED as this manager's latest membership (entry 76 item (2)) BEFORE the prune
    // loop below runs, not after: `cancelTileStream` calls `drainQueueIfRoom` inline, from inside that
    // very loop, so a drain can fire before the loop has reached every tracked tile. Assigning here
    // is what makes such a nested drain test the round's OWN membership rather than the previous
    // round's -- the one path by which a queued tile can reach the drain already out of view.
    // Entry 87 §2.3(iii): also the bounded requeue's own "still in the current cover" test, at
    // `mintAndStart`'s catch (a tile outside the enumerated `coveringKeys` window but still
    // geometrically in view, past `MAX_COVERING_TILES`, is exactly the case `latestMembership`
    // exists to answer honestly -- the window would wrongly refuse a retry for it).
    this.latestMembership = membership;

    // Entry 66 (b): keep a tracked tile that the materialised cover names OR that the predicate says
    // the viewport covers. Past `MAX_COVERING_TILES` those differ: `coveringKeys` is the centred
    // window, the predicate is the whole cover. A queued, issuing or in-flight tile that is
    // geometrically in view is therefore no longer dropped, epoch-bumped, cancelled, or routed to
    // the caller's own `clearTile` -- ADR-028 Amendment 3's rule, *"A tile intersecting the viewport
    // is protected whether it is complete or partial, tracked this round or a prior one, or never
    // requested at all"* (ADR-028:461-462), again holds here at every zoom.
    //
    // **The named consequence, declared as this piece's own behaviour, not discovered -- as amended
    // by the human's ruling of DECISIONS-PENDING entry 76 (`ENTRY-66B-PREREGISTRATION.md` §14
    // Amendment 4 item (2)).** A queued tile kept here is RETAINED ACROSS THE PRUNE; it is ISSUED
    // ONLY IF STILL IN VIEW AT DRAIN, and OTHERWISE DROPPED AT DRAIN. `drainQueueIfRoom` (below)
    // re-tests each queued tile at mint time against `latestMembership` -- the same predicate over
    // the same triple, never a second one -- and a tile no longer in view is dropped there exactly as
    // an out-of-view tracked tile is dropped here (epoch bumped, `onTileSuperseded`/`clearTile`),
    // never issued. A tile still in view IS issued, as an ordinary `viewport_query` for a cell this
    // round never enumerated: the retention's whole point. Bounds are the ones every other tile
    // request already has and no new ones: at most `MAX_IN_FLIGHT_TILE_STREAMS` concurrent, at most
    // `MAX_QUEUED_TILES` waiting (the `freeSlots`/`availableQueueRoom`/`capacity` computation in
    // `onCameraChange`, and `drainQueueIfRoom`'s own `while`), and the drain
    // stays gated by the over-budget flag. No new status, no new wire or protocol change; tile keys
    // still never cross a module or protocol boundary (ADR-028:478-479). The one new piece of state
    // is `latestMembership` (this class's own field, ADR-006 class 1, derived from the round's plan).
    //
    // `coveringKeys` itself is UNCHANGED for the new-candidate loop below, which must only issue
    // tiles this round actually enumerated: the predicate protects, the array plans.
    for (const [tileKey, state] of [...this.tileState.entries()]) {
      if (coveringKeys.has(tileKey) || membership.has(tileKey)) continue;
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
      // Entry 87 §2.3(iii): a genuinely NEW candidate owes a fresh one-shot retry budget -- see
      // `requeuedTiles`'s own doc comment.
      this.requeuedTiles.delete(tileKey);
      newCandidates.push(key);
    }

    let toConsider = newCandidates;
    // Entry 60: the enumeration bound's own truncation is reported through the SAME two fields the
    // capacity truncation below already uses -- and when both fire, `truncatedCount` is their sum
    // (cells never enumerated PLUS candidates dropped for lack of capacity), never one silently
    // replacing the other.
    let coveringTruncated: true | undefined = cover.kind === "truncated" ? true : undefined;
    let truncatedCount: number | undefined = cover.kind === "truncated" ? cover.omittedCellCount : undefined;
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
      truncatedCount = (truncatedCount ?? 0) + (newCandidates.length - capacity);
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

    // F1: the geometric covering set -- every key `tilesCoveringBbox` produced this round, in the
    // same deterministic order `coveringKeys` (above) was built from, regardless of what this round's
    // own tracked/resident/headroom bookkeeping went on to do with each one. See this field's own
    // doc comment (`TilePlanOutcome`, above) for why this is not `[...issued, ...queued,
    // ...alreadyResident]`.
    return { kind: "planned", issued, queued: queuedNow, alreadyResident, covering: [...coveringKeys], coveringTruncated, truncatedCount };
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
    this.unrequestedTileKeysOverBudgetThunk = () => [];
    // Entry 87 §2.3(iii): a wholesale invalidation is a fresh start for every tile's own retry
    // budget too -- `requeuedTiles`'s own doc comment.
    this.requeuedTiles.clear();
  }

  /**
   * **End the dataset session: the source was observed to have changed** (boundary 4).
   *
   * Idempotent -- several tiles' terminals can carry the same code, and a session ends once.
   *
   * **What it does**: every ticket leaves the live set, so a batch still on the wire for any of them
   * is refused by `onBatch`'s live check; every in-flight and queued tile is dropped through the
   * existing `clearAll`; and this manager latches closed, so `onCameraChange` returns
   * `"session-ended"` and plans nothing further until the dataset is reopened (which builds a new
   * manager). `detail` is the terminal's own text, logged and not otherwise acted on here.
   *
   * **What it does NOT do, and what P3a therefore does not claim.** It does not clear residency and
   * it does not refuse picks. Both live with the owner (`candidateArmSession.ts` /
   * `App.tsx`) -- `TileResidencyAccessor` can answer about one tile but cannot enumerate the
   * resident set, and this manager has no pick surface at all. Wiring the owner is **P3b**'s, by
   * the human's ruling of 2026-09-16 (round 4). What an operator sees today is that this manager
   * stops filling and that stale batches are dropped; the view it already holds stays.
   */
  private endSession(detail: string): void {
    if (this.sessionEnded) return;
    this.sessionEnded = true;
    this.liveTickets.invalidate();
    // No resident-key hint: this manager does not hold the resident set. Clearing what the owner
    // holds is P3b's; `clearAll` here drops only this manager's own queued and in-flight work.
    this.clearAll();
    logSessionEvent("warn", `tile-session-ended-source-changed: ${detail}`);
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

  /**
   * Item A (residency-debt cut 1b, decisions 32a/33b): the scoped relief lever the operator's Cancel
   * button repoints to -- stop filling, keep the current partial view, tiling resumes on the next
   * camera change (this file's own summary of the 32a ruling, not a quotation of it), as opposed to
   * `stop()`'s permanent kill. Modeled on `clearAll` above (drop every
   * queued/mid-mint tile, cancel every in-flight one via the SAME real `skpCancel` + self-cancelled-
   * handle suppression `clearAll`/`stop` already use, so a stream's eventual terminal is suppressed
   * rather than misreported), **NOT** on `stop`: `stopped` is never set (BS1 -- a subsequent
   * `onCameraChange` plans exactly as before, unaffected), `this.frame` is never touched, and
   * `overBudgetFlag`/`unrequestedTileKeysOverBudgetThunk` are left exactly as they were (relinquishing
   * outstanding work is not itself a verdict on whether the viewport still fits its budget -- the
   * next real camera change re-derives that honestly, the same way it always has).
   *
   * **Never calls `onTileSuperseded`** -- the resident view this session already holds is retained
   * untouched; superseding it is precisely what this lever is not. The already-admitted content of an
   * in-flight tile stays; only the REQUEST for the rest of it stops.
   * `drainQueueIfRoom` is never called either: every queued/issuing tile is being dropped in the same
   * pass a slot might free from cancelling an in-flight one, and re-minting anything here would defeat
   * the whole point of a full relinquish.
   *
   * BS2: every affected tile is reported through the SAME always-on session-log sink
   * (`logSessionEvent`) `logRejectedCancel` above already uses, in one of two distinguishable classes
   * -- `logRelinquishCancelled` (was in flight, a real cancel was issued) or `logRelinquishDropped`
   * (was queued or mid-mint, never started a stream) -- structurally distinct from an out-of-view
   * supersede or a budget self-cancel, both of which report EXCLUSIVELY through `onTileSuperseded`,
   * never through either of these two log levels.
   */
  relinquishOutstanding(): { cancelledInFlight: string[]; droppedQueued: string[] } {
    const cancelledInFlight: string[] = [];
    for (const [tileKey, entry] of [...this.inFlightStreams.entries()]) {
      this.inFlightStreams.delete(tileKey);
      this.tileState.delete(tileKey);
      this.issueEpoch.set(tileKey, (this.issueEpoch.get(tileKey) ?? 0) + 1);
      this.selfCancelledHandles.add(entry.streamHandle);
      void skpCancel(entry.streamHandle).catch((err) => logRejectedCancel("relinquishOutstanding", entry.streamHandle, err));
      logRelinquishCancelled(tileKey, entry.streamHandle);
      cancelledInFlight.push(tileKey);
    }

    const droppedQueued: string[] = [];
    for (const key of this.queue) {
      const tileKey = tileKeyToString(key);
      this.tileState.delete(tileKey);
      this.issueEpoch.set(tileKey, (this.issueEpoch.get(tileKey) ?? 0) + 1);
      logRelinquishDropped(tileKey);
      droppedQueued.push(tileKey);
    }
    this.queue = [];

    // A tile mid-ticket-mint ("issuing" -- a slot claimed, viewportQuery/dataPlaneAttach in flight, no
    // stream handle yet) has no stream to cancel and was never in `queue` either (`beginIssue` already
    // dequeued it) -- swept exactly like `clearAll`'s own third loop, same "dropped, never started"
    // class as an ordinary queued tile.
    for (const [tileKey, state] of [...this.tileState.entries()]) {
      if (state !== "issuing") continue;
      this.tileState.delete(tileKey);
      this.issueEpoch.set(tileKey, (this.issueEpoch.get(tileKey) ?? 0) + 1);
      logRelinquishDropped(tileKey);
      droppedQueued.push(tileKey);
    }

    return { cancelledInFlight, droppedQueued };
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
    // Entry 87 §2.3(iii): nothing outstanding survives `stop()` either -- see `requeuedTiles`'s own
    // doc comment.
    this.requeuedTiles.clear();
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
   *
   * **Entry 66 (b), the human's ruling of DECISIONS-PENDING entry 76 item (2): the drop-at-drain
   * re-check.** Retaining an in-view tile across the supersede prune (`onCameraChange`'s keep-test)
   * is only half the rule; the other half is here. Every queued tile is re-tested at MINT time
   * against `latestMembership` -- the SAME `coverMembershipFor` predicate over the manager's most
   * recent `(frame, level, bbox)` triple, never a second predicate and never a closed-bbox test
   * (`ENTRY-66B-PREREGISTRATION.md` §14 Amendment 4, block-on-sight 8). Still in view: issued exactly
   * as before. No longer in view: DROPPED here -- epoch bumped and routed as the supersede path
   * routes an out-of-view tile (`onTileSuperseded`, whose candidate-arm handler clears the tile) --
   * and never issued, so no `viewport_query` is minted for a cell the viewport has already left.
   *
   * The one path by which a queued tile actually reaches this point out of view is a drain nested
   * INSIDE the prune: `cancelTileStream` calls this method inline while `onCameraChange`'s loop is
   * still walking its snapshot of `tileState`, so a tile the loop has not reached yet can be shifted
   * off the queue after `latestMembership` has already been replaced. Without the re-check that tile
   * mints a query for a cell that is no longer in view (the loop then abandons the mint one iteration
   * later, after the request has gone out). The prune's own later visit to that key is harmless: it
   * finds nothing left in `tileState`/`queue` and bumps the epoch a second time, which is idempotent.
   */
  private drainQueueIfRoom(): void {
    // Brief A boundary 4: once the session has ended, nothing is issued — including from this
    // path, which `cancelTileStream` reaches on its way out and which would otherwise refill the
    // slots `endSession`'s own `clearAll` was in the middle of emptying.
    if (this.sessionEnded) return;
    if (this.overBudgetFlag) return;
    while (this.queue.length > 0 && this.activeSlotCount() < MAX_IN_FLIGHT_TILE_STREAMS) {
      const key = this.queue.shift()!;
      const tileKey = tileKeyToString(key);
      if (this.tileState.get(tileKey) !== "queued") continue; // dropped while queued -- skip
      const membership = this.latestMembership;
      if (membership !== null && !membership.has(tileKey)) {
        this.tileState.delete(tileKey);
        this.issueEpoch.set(tileKey, (this.issueEpoch.get(tileKey) ?? 0) + 1);
        // `null` stream handle: nothing was ever minted for this tile, exactly as `clearAll` reports
        // a tile it drops without a stream of its own.
        this.opts.onTileSuperseded(tileKey, null);
        continue;
      }
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
    } catch (err) {
      // Entry 87 §2.3(i), unconditional: named before anything below decides what to do about it.
      logMintRefused(tileKey, err);
      if (this.issueEpoch.get(tileKey) === epoch) {
        // Entry 87 §2.3(iii): the bounded requeue. Five conditions, all required: not stopped, a
        // declared-retryable code (`isRetryableRefusal`), this tile has not already spent its one
        // retry this candidacy (`requeuedTiles`), the tile is still in view by `latestMembership` --
        // the SAME geometric `coverMembershipFor` predicate entry 66 (b)'s supersede keep-test and
        // `drainQueueIfRoom`'s own re-check use, never the enumerated `coveringKeys` window: past
        // `MAX_COVERING_TILES` a tile can be geometrically in view while sitting outside that
        // window, and the window would wrongly refuse its retry -- and `MAX_QUEUED_TILES` still has
        // room: the requeue is an ordinary `queue` entry, not a bypass of the declared queue
        // ceiling, so a queue already at capacity keeps today's drop for this tile too (logged
        // above either way). In practice `onCameraChange`'s own cover-drop loop would already have
        // bumped this tile's epoch and routed it away from this branch entirely once
        // `latestMembership` no longer covers it either, so that particular check is normally
        // redundant with the epoch guard above; kept explicit rather than assumed, the same
        // discipline `clearAll`'s own "should never actually skip anything" guard above uses.
        const membership = this.latestMembership;
        if (
          !this.stopped &&
          isRetryableRefusal(err) &&
          !this.requeuedTiles.has(tileKey) &&
          (membership === null || membership.has(tileKey)) &&
          this.queue.length < MAX_QUEUED_TILES
        ) {
          this.requeuedTiles.add(tileKey);
          this.tileState.set(tileKey, "queued");
          this.queue.push(key);
          this.drainQueueIfRoom();
          return;
        }
        this.requeuedTiles.delete(tileKey);
        this.tileState.delete(tileKey);
        this.drainQueueIfRoom();
      }
      return;
    }

    if (this.stopped || this.issueEpoch.get(tileKey) !== epoch) {
      logMintAbandoned("mintAndStart(abandoned-pre-attach)", tileKey, ticket.stream);
      await skpCancel(ticket.stream).catch((err) => logRejectedCancel("mintAndStart(abandoned-pre-attach)", ticket.stream, err));
      return;
    }

    let attach: { url: string; subprotocols: [string, string] };
    try {
      attach = await dataPlaneAttach();
    } catch (err) {
      // Reviewer fix (entry 87): `dataPlaneAttach` sits between a granted ticket and a live stream
      // -- a rejection here used to leave the tile `"issuing"` forever (an unhandled rejection out
      // of this async function, no cleanup, the minted ticket never released). Named exactly like
      // any other refusal (`logMintRefused` -- this binding command never throws an `SkpCallError`,
      // so this always logs the declared `"unknown"` code, same line shape), the already-minted
      // ticket is cancelled (best-effort; a genuinely rejected cancel is itself logged, same as
      // every other cancel site here), and the tile is dropped and the queue re-drained exactly
      // like an ordinary non-retryable refusal -- this failure is never in `isRetryableRefusal`'s
      // declared set (it never even reaches an `SkpCallError` to check).
      logMintRefused(tileKey, err);
      if (this.issueEpoch.get(tileKey) === epoch) {
        this.requeuedTiles.delete(tileKey);
        this.tileState.delete(tileKey);
        this.drainQueueIfRoom();
      }
      await skpCancel(ticket.stream).catch((cancelErr) =>
        logRejectedCancel("mintAndStart(dataPlaneAttach-failed)", ticket.stream, cancelErr)
      );
      return;
    }
    if (this.stopped || this.issueEpoch.get(tileKey) !== epoch) {
      logMintAbandoned("mintAndStart(abandoned-post-attach)", tileKey, ticket.stream);
      await skpCancel(ticket.stream).catch((err) => logRejectedCancel("mintAndStart(abandoned-post-attach)", ticket.stream, err));
      return;
    }

    this.tileState.set(tileKey, "in-flight");
    this.inFlightStreams.set(tileKey, { streamHandle: ticket.stream });
    // Minted under the dataset's live generation (the kernel refuses otherwise), so admitted to the
    // client's mirror at the mint site -- the same place and the same rule as the untiled arm.
    this.liveTickets.admit(ticket.stream);
    this.nextBatchSeqByStream.set(ticket.stream, 0);
    const streamHandleAtStart = ticket.stream;
    // Entry 87 §2.4(4) reviewer fix: named ONLY when this mint spent its bounded retry -- see
    // `logMintRecovered`'s own doc comment.
    if (this.requeuedTiles.has(tileKey)) {
      logMintRecovered(tileKey, ticket.stream);
    }

    const sink: StreamSink = {
      onOpen: () => {},
      onBatch: (payload) => {
        // **Brief A P3, boundary 4**: the live-ticket check, before the supersede check and for a
        // different reason -- this one says the ticket no longer belongs to a live dataset-session
        // generation. A batch dropped here must never repopulate a tile. No generation value is
        // consulted, because this client is never told one (§13 D, A2).
        if (!this.liveTickets.isLive(streamHandleAtStart)) return;
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
        this.liveTickets.retire(streamHandleAtStart);
        // **The client half of the invalidation path, with its consequences** (boundary 4;
        // `state/NEXT-CUT.md:103`: "residency cleared, picks refused, typed status"). One tile's
        // terminal naming `engine.source_changed` ends the whole session, because the generation is
        // per dataset-session and not per tile.
        if (isSourceChangedTerminal(terminal)) {
          this.endSession(terminal.detail);
        }
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
