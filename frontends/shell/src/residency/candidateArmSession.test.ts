// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { beforeEach, describe, expect, it, vi } from "vitest";

const viewportQueryMock = vi.hoisted(() => vi.fn());
const cancelMock = vi.hoisted(() => vi.fn());
vi.mock("../skp/client", () => ({ viewportQuery: viewportQueryMock, cancel: cancelMock }));

const dataPlaneAttachMock = vi.hoisted(() => vi.fn());
vi.mock("../streaming/dataPlaneClient", () => ({ dataPlaneAttach: dataPlaneAttachMock }));

const startStreamMock = vi.hoisted(() => vi.fn());
vi.mock("../streaming/adapterWs", () => ({ startStream: startStreamMock }));

// P5f complex-gate should-fix 5: mocked so the "issued once per generation" tests below can assert
// exact call counts directly, rather than trying to infer them from `getResidencyInFlightStreamCount`
// (which clamps at zero and cannot distinguish "never counted" from "counted then correctly ended").
const recordResidencyStreamIssuedMock = vi.hoisted(() => vi.fn());
const recordResidencyTileRequestedMock = vi.hoisted(() => vi.fn());
const recordResidencyStreamEndedMock = vi.hoisted(() => vi.fn());
const recordResidencyBatchArrivedMock = vi.hoisted(() => vi.fn());
vi.mock("../instrument/residencyInstrument", () => ({
  recordResidencyStreamIssued: recordResidencyStreamIssuedMock,
  recordResidencyTileRequested: recordResidencyTileRequestedMock,
  recordResidencyStreamEnded: recordResidencyStreamEndedMock,
  recordResidencyBatchArrived: recordResidencyBatchArrivedMock,
}));

// S-3 (re-reviewer gate, residency-debt cut 1b): mocked directly, the same pattern
// `tileViewportStreamManager.test.ts` already uses for its own two sibling log classes
// (`tile-stream-relinquish-cancelled`/`tile-stream-relinquish-dropped`) -- resolves to the SAME
// absolute module `TileViewportStreamManager` (imported for real, below) itself calls `logSessionEvent`
// through, so this one mock also lets tests below assert on the manager's own relinquish log lines
// this file never asserted before, not only this module's own two new classes
// (`untiled-stream-relinquish-cancelled`/`candidate-untiled-terminal`).
const logSessionEventMock = vi.hoisted(() => vi.fn());
vi.mock("../diagnostics/log", () => ({ logSessionEvent: logSessionEventMock }));

import type { TileBatchIngestOutcome, WorkingCanvasHandle } from "../canvas/WorkingCanvas";
import { MAX_RESIDENT_VERTICES } from "../canvas/limits";
import { DEFAULT_TILE_GRID_LEVEL, UNTILED_FIRST_LOOK_ROW_LIMIT } from "../canvas/tileGridConstants";
import { encodeDecU64 } from "../skp/codec";
import { TileViewportStreamManager } from "../streaming/tileViewportStreamManager";
import type { StreamSink } from "../streaming/transport";
import { VIEWPORT_QUERY_MIN_INTERVAL_MS } from "../streaming/viewportStreamManager";
import { INITIAL_TILE_KEY, startCandidateArmSession } from "./candidateArmSession";
import { nextResidencyStatus, residencyStatusText } from "./residencyStatus";
import type { ResidencyStatus, ResidencyStatusEvent } from "./residencyStatus";

/** P5f complex-gate should-fix 4: the untiled first-look query's own `onTerminal` is now the moment
 * `establishFrameFromExtent` actually runs (`candidateArmSession.ts`'s own doc comment on that
 * function has the full account) -- every test below that needs a real grid frame established must
 * therefore fire the untiled sink's `onTerminal` after its own `onBatch` call(s), not just the batch
 * alone. `UNTILED_FIRST_LOOK_ROW_LIMIT` is what `reissueUnrestricted`'s own `viewportQuery` call now
 * passes as `limit`, replacing the old unbounded `null`. */
const UNTILED_LOOK_LIMIT = encodeDecU64(BigInt(UNTILED_FIRST_LOOK_ROW_LIMIT));
function completeUntiledLook(): void {
  lastSink().onTerminal({ kind: "Completed", detail: "" });
}

const OK_INGEST: TileBatchIngestOutcome = {
  rowsAdmitted: 1,
  duplicatesDropped: 0,
  evictedTileKeys: [],
  overBudget: false,
  fitAnchor: null,
};

function fakeCanvas(overrides: Partial<WorkingCanvasHandle> = {}): WorkingCanvasHandle {
  return {
    pushBatch: vi.fn(),
    clearStream: vi.fn(),
    fitToBounds: vi.fn(() => false),
    resetFitForNewGeneration: vi.fn(),
    getResidentCounts: vi.fn(() => ({ totalResidentVertices: 0, totalResidentFeatures: 0 })),
    armFirstPixelRenderHook: vi.fn(() => true),
    disarmFirstPixelRenderHook: vi.fn(() => true),
    pushTileBatch: vi.fn(() => OK_INGEST),
    clearTile: vi.fn(),
    clearAllTiles: vi.fn(),
    isTileResidentInCandidateSet: vi.fn(() => false),
    // Mirrors `isTileResidentInCandidateSet`'s own default: a tile this fake has never been told
    // about is neither resident nor complete -- a test that needs a covering tile to read as
    // COMPLETE (Defect A's own stronger fact) overrides this explicitly, the same way it would
    // already override `isTileResidentInCandidateSet` for the older, weaker check.
    isTileCompleteInCandidateSet: vi.fn(() => false),
    markTilePartial: vi.fn(),
    markTileComplete: vi.fn(),
    establishTileGridContext: vi.fn(),
    applyTileViewportContext: vi.fn(() => true),
    ...overrides,
  };
}

/** Captures the `StreamSink` `startStream` was called with, for the caller to drive by hand
 * (`sink.onBatch(...)`, `sink.onTerminal(...)`) -- mirrors `tileViewportStreamManager.test.ts`'s own
 * mocking pattern for the identical three transport primitives. */
function lastSink(): StreamSink {
  const call = startStreamMock.mock.calls.at(-1);
  if (!call) throw new Error("startStream was never called");
  return call[0].sink as StreamSink;
}

// S-3 (re-reviewer gate, residency-debt cut 1b): a file-scope `beforeEach`, applied to every test in
// this file regardless of which `describe` block it lives in -- mirrors this file's own many identical
// per-describe `beforeEach` resets for `viewportQueryMock`/`cancelMock`/etc., but as a single reset
// (rather than duplicated into each of those blocks) since `logSessionEventMock` has no per-describe
// return-value configuration to also (re)establish.
beforeEach(() => {
  logSessionEventMock.mockReset();
});

describe("startCandidateArmSession", () => {
  beforeEach(() => {
    viewportQueryMock.mockReset().mockResolvedValue({ stream: "sh_1" });
    cancelMock.mockReset().mockResolvedValue({ state: "requested" });
    dataPlaneAttachMock.mockReset().mockResolvedValue({ url: "ws://127.0.0.1:1/stream", subprotocols: ["spatial-dp.v0", "tok.x"] });
    startStreamMock.mockReset().mockReturnValue({ cancel: vi.fn(), stats: { reassemblyCopies: 0, jsonFramesSeen: 0 } });
  });

  // P7: the tile-size sweep selector's own product-side wire -- `deps.tileGridLevel` reaches
  // `TileViewportStreamManager`'s own `level` constructor option, which drives `establishGridFrame`'s
  // own per-level cell math (`cellSizeForLevel`, `tileGrid.ts`) for this session's whole lifetime.
  it("deps.tileGridLevel reaches the manager's own activeLevel, for each of the three locked levels", () => {
    for (const level of ["coarse", "medium", "fine"] as const) {
      const canvas = fakeCanvas();
      const session = startCandidateArmSession({ dataset: "ds_x", canvas, tileGridLevel: level });
      expect(session.manager.activeLevel).toBe(level);
    }
  });

  // P7: "default = the current implicit level, unchanged behavior when unset" -- omitting
  // `tileGridLevel` entirely (every pre-existing call site) reproduces `DEFAULT_TILE_GRID_LEVEL`
  // exactly, the same as before this piece existed (no `level` option was ever passed).
  it("omitting tileGridLevel reproduces DEFAULT_TILE_GRID_LEVEL -- unset means unchanged behavior", () => {
    const canvas = fakeCanvas();
    const session = startCandidateArmSession({ dataset: "ds_x", canvas });
    expect(session.manager.activeLevel).toBe(DEFAULT_TILE_GRID_LEVEL);
  });

  // P7: the selector's own explicit "unset" value (`null`, `residencyTileSizeLevel.ts`'s own
  // `getResidencyTileSizeLevel()` default) must collapse to the SAME default as omitting the field
  // entirely -- `App.tsx` always passes a `TileGridLevel | null`, never `undefined` itself, so this is
  // the shape this session actually receives at its one real call site.
  it("an explicit null tileGridLevel also reproduces DEFAULT_TILE_GRID_LEVEL", () => {
    const canvas = fakeCanvas();
    const session = startCandidateArmSession({ dataset: "ds_x", canvas, tileGridLevel: null });
    expect(session.manager.activeLevel).toBe(DEFAULT_TILE_GRID_LEVEL);
  });

  it("reissueUnrestricted issues ONE plain, untiled viewport_query (bbox: null) -- the tile grid's own anchor problem", async () => {
    const canvas = fakeCanvas();
    const session = startCandidateArmSession({ dataset: "ds_x", canvas });

    const outcome = await session.reissueUnrestricted(null, null);

    expect(outcome).toEqual({ kind: "issued", streamHandle: "sh_1" });
    // P5f complex-gate should-fix 4: bounded now (`UNTILED_FIRST_LOOK_ROW_LIMIT`), not `limit: null`.
    expect(viewportQueryMock).toHaveBeenCalledWith("ds_x", null, null, UNTILED_LOOK_LIMIT, null);
    expect(session.manager.gridFrame).toBeNull(); // not established until the stream reaches its own terminal
  });

  // P5f complex-gate should-fix 4: the grid frame's anchor is now the untiled first look's FULL
  // union (every batch it ever delivers), established at that stream's own natural terminal -- not
  // its first delivering batch alone (`tileGrid.ts`'s own top doc comment has the full account of
  // the prior contradiction between that doc and the code this fixes).
  it("the untiled first look's own terminal establishes the grid frame from the union of EVERY batch it delivered, exactly once", async () => {
    const canvas = fakeCanvas({
      pushTileBatch: vi
        .fn()
        .mockReturnValueOnce({ ...OK_INGEST, fitAnchor: { xmin: 0, ymin: 0, xmax: 0, ymax: 0 } })
        .mockReturnValue({ ...OK_INGEST, fitAnchor: { xmin: 0, ymin: 0, xmax: 10, ymax: 10 } }),
    });
    const session = startCandidateArmSession({ dataset: "ds_x", canvas });
    await session.reissueUnrestricted(null, null);

    const sink = lastSink();
    sink.onBatch(new Uint8Array([1]), true);
    expect(session.manager.gridFrame).toBeNull(); // not yet -- the stream has not reached its terminal

    // A second batch, with a WIDER fitAnchor -- the running union grows; still not established.
    sink.onBatch(new Uint8Array([2]), true);
    expect(session.manager.gridFrame).toBeNull();

    sink.onTerminal({ kind: "Completed", detail: "" });

    expect(canvas.pushTileBatch).toHaveBeenCalledWith(INITIAL_TILE_KEY, "sh_1", 0, expect.any(Uint8Array));
    expect(session.manager.gridFrame).not.toBeNull();
    expect(canvas.establishTileGridContext).toHaveBeenCalledTimes(1);

    // A later terminal must NOT move the frame again (`establishGridFrame`'s own "no-op past the
    // first call" contract, plus this session's own `frameEstablished` guard).
    const frameAfterFirst = session.manager.gridFrame;
    sink.onTerminal({ kind: "Completed", detail: "" });
    expect(session.manager.gridFrame).toEqual(frameAfterFirst);
    expect(canvas.establishTileGridContext).toHaveBeenCalledTimes(1);
  });

  it("onViewportChanged is debounced by the SAME VIEWPORT_QUERY_MIN_INTERVAL_MS constant baseline uses, and plans tile queries once a frame exists", async () => {
    vi.useFakeTimers();
    try {
      const canvas = fakeCanvas({
        pushTileBatch: vi.fn(() => ({ ...OK_INGEST, fitAnchor: { xmin: 0, ymin: 0, xmax: 0, ymax: 0 } })),
      });
      const session = startCandidateArmSession({ dataset: "ds_x", canvas });
      await session.reissueUnrestricted(null, null);
      lastSink().onBatch(new Uint8Array([1]), true);
      completeUntiledLook(); // P5f should-fix 4: establishment now happens at the stream's own terminal
      expect(session.manager.gridFrame).not.toBeNull();

      viewportQueryMock.mockClear();
      // Never resolves -- inspect planning only, mirroring tileViewportStreamManager.test.ts's own
      // convention for planning-focused assertions.
      viewportQueryMock.mockImplementation(() => new Promise(() => {}));

      const bbox = { xmin: -10, ymin: -10, xmax: 10, ymax: 10 }; // covers the whole small established frame
      session.onViewportChanged(bbox);
      session.onViewportChanged(bbox); // a second call within the window replaces, not adds to, the first
      expect(viewportQueryMock).not.toHaveBeenCalled(); // still debouncing

      await vi.advanceTimersByTimeAsync(VIEWPORT_QUERY_MIN_INTERVAL_MS);
      expect(viewportQueryMock).toHaveBeenCalled(); // tile planning issued at least one per-tile query
      expect(canvas.applyTileViewportContext).toHaveBeenCalled();
    } finally {
      vi.useRealTimers();
    }
  });

  it("reissueUnrestricted performs a full clear (both the manager and the canvas) before re-issuing", async () => {
    const canvas = fakeCanvas({
      pushTileBatch: vi.fn(() => ({ ...OK_INGEST, fitAnchor: { xmin: 0, ymin: 0, xmax: 0, ymax: 0 } })),
    });
    const session = startCandidateArmSession({ dataset: "ds_x", canvas });
    await session.reissueUnrestricted(null, null);
    lastSink().onBatch(new Uint8Array([1]), true);
    completeUntiledLook(); // P5f should-fix 4: establishment now happens at the stream's own terminal
    expect(session.manager.gridFrame).not.toBeNull();

    viewportQueryMock.mockClear();
    viewportQueryMock.mockResolvedValue({ stream: "sh_2" });
    (canvas.clearAllTiles as ReturnType<typeof vi.fn>).mockClear();
    (canvas.resetFitForNewGeneration as ReturnType<typeof vi.fn>).mockClear();

    const outcome = await session.reissueUnrestricted(null, { predicate: "x > 1", dialect: "duckdb_expr_0" } as never);

    expect(canvas.clearAllTiles).toHaveBeenCalledTimes(1);
    expect(canvas.resetFitForNewGeneration).toHaveBeenCalledTimes(1);
    // The frame itself resets to null internally (a fresh session's anchor problem again) -- this
    // new generation's own untiled stream reaching ITS terminal is what re-establishes it, exactly
    // like the dataset's own first open.
    expect(outcome).toEqual({ kind: "issued", streamHandle: "sh_2" });
    expect(viewportQueryMock).toHaveBeenCalledWith("ds_x", null, null, UNTILED_LOOK_LIMIT, {
      predicate: "x > 1",
      dialect: "duckdb_expr_0",
    });
  });

  it("a tile batch reporting overBudget sets the manager's over-budget flag; never throws a baseline-style refusal", async () => {
    const canvas = fakeCanvas({
      pushTileBatch: vi
        .fn()
        .mockReturnValueOnce({ ...OK_INGEST, fitAnchor: { xmin: 0, ymin: 0, xmax: 0, ymax: 0 } })
        .mockReturnValue({ ...OK_INGEST, overBudget: true, fitAnchor: { xmin: 0, ymin: 0, xmax: 0, ymax: 0 } }),
    });
    const session = startCandidateArmSession({ dataset: "ds_x", canvas });
    await session.reissueUnrestricted(null, null);
    // P5f complex-gate should-fix 4: the untiled "first look" stream now runs to its OWN natural
    // terminal (bounded by `UNTILED_FIRST_LOOK_ROW_LIMIT`) before the frame establishes -- so a
    // SECOND batch must arrive via a real TILE stream, not the same untiled sink, exactly as before,
    // just for a different reason (the untiled stream is no longer self-cancelled after one batch).
    lastSink().onBatch(new Uint8Array([1]), true);
    completeUntiledLook();
    expect(session.manager.overBudget).toBe(false);
    expect(session.manager.gridFrame).not.toBeNull();

    viewportQueryMock.mockClear();
    viewportQueryMock.mockResolvedValue({ stream: "sh_tile_1" });
    vi.useFakeTimers();
    try {
      session.onViewportChanged({ xmin: -10, ymin: -10, xmax: 10, ymax: 10 });
      await vi.advanceTimersByTimeAsync(VIEWPORT_QUERY_MIN_INTERVAL_MS);
    } finally {
      vi.useRealTimers();
    }
    const tileSink = lastSink();
    tileSink.onBatch(new Uint8Array([2]), true); // a real tile stream's batch reports over-budget
    expect(session.manager.overBudget).toBe(true);
  });

  it("stop() cancels an in-flight untiled stream and refuses further planning", async () => {
    const canvas = fakeCanvas();
    const session = startCandidateArmSession({ dataset: "ds_x", canvas });
    await session.reissueUnrestricted(null, null);

    await session.stop();

    expect(cancelMock).toHaveBeenCalledWith("sh_1");
    const outcome = await session.reissueUnrestricted(null, null);
    expect(outcome).toEqual({ kind: "stopped" });
  });

  // Nit 2 (re-reviewer gate, residency-debt cut 1b): the missing test for `stop()`'s own suppression
  // path -- mirrors `relinquishFill`'s own identical self-cancel-suppression test below (Piece 1/2(iii)),
  // but for `stop()`'s teardown-time cancel (`cancelUntiledStream`'s own doc comment: BOTH callers add
  // to `selfCancelledUntiledStreams` BEFORE calling `skpCancel`, the same discipline).
  it("stop()'s own cancel of the untiled stream suppresses its eventual terminal -- never logged, never misreported as a failure", async () => {
    const canvas = fakeCanvas();
    const session = startCandidateArmSession({ dataset: "ds_x", canvas });
    await session.reissueUnrestricted(null, null);
    const staleSink = lastSink(); // sh_1's own sink, captured before stop()

    await session.stop();
    logSessionEventMock.mockClear();

    // The real, asynchronous terminal for the cancelled stream, arriving after teardown -- exactly
    // the race `stop()`'s own self-cancel-suppression discipline exists for.
    expect(() => staleSink.onTerminal({ kind: "ProducerFailed", detail: "engine.stream_failed" })).not.toThrow();

    expect(logSessionEventMock).not.toHaveBeenCalledWith("candidate-untiled-terminal", expect.anything());
  });

  // Viewport-residency cut P6a, Defect A (principle 7 -- stop decoding-to-discard): "the manager
  // knows remaining ≈ 0." A real tile's own batch trimmed to the budget boundary must cancel that
  // SAME tile's own in-flight stream -- never left running to decode-and-discard further batches --
  // and the tile's own residency must be KEPT (marked partial), never blanked via `clearTile`.
  it("a real tile batch reporting overBudget cancels that tile's own stream and marks it partial, never clears it", async () => {
    const canvas = fakeCanvas({
      pushTileBatch: vi
        .fn()
        .mockReturnValueOnce({ ...OK_INGEST, fitAnchor: { xmin: 0, ymin: 0, xmax: 0, ymax: 0 } })
        .mockReturnValue({ ...OK_INGEST, overBudget: true, fitAnchor: { xmin: 0, ymin: 0, xmax: 0, ymax: 0 } }),
    });
    const session = startCandidateArmSession({ dataset: "ds_x", canvas });
    await session.reissueUnrestricted(null, null);
    lastSink().onBatch(new Uint8Array([1]), true);
    completeUntiledLook();

    viewportQueryMock.mockClear();
    viewportQueryMock.mockResolvedValue({ stream: "sh_tile_1" });
    cancelMock.mockClear();
    vi.useFakeTimers();
    try {
      session.onViewportChanged({ xmin: -10, ymin: -10, xmax: 10, ymax: 10 });
      await vi.advanceTimersByTimeAsync(VIEWPORT_QUERY_MIN_INTERVAL_MS);
    } finally {
      vi.useRealTimers();
    }
    const tileSink = lastSink();
    tileSink.onBatch(new Uint8Array([2]), true); // reports overBudget -- trimmed at ingest
    await Promise.resolve(); // manager.cancelTile's own synchronous cancel path settles

    expect(cancelMock).toHaveBeenCalledWith("sh_tile_1");
    const [tileKey] = (canvas.pushTileBatch as ReturnType<typeof vi.fn>).mock.calls.at(-1)!;
    expect(canvas.markTilePartial).toHaveBeenCalledWith(tileKey);
    expect(canvas.clearTile).not.toHaveBeenCalledWith(tileKey);
  });

  // The untiled first-look/reissue stream is never tracked by `manager` at all -- an overBudget
  // outcome reported under `INITIAL_TILE_KEY` must never attempt `manager.cancelTile` for it (a
  // silent no-op regardless, but this proves the exclusion, not merely relies on the no-op).
  it("an overBudget outcome under INITIAL_TILE_KEY (the untiled first look) never cancels a real tile stream", async () => {
    const canvas = fakeCanvas({
      pushTileBatch: vi.fn(() => ({ ...OK_INGEST, overBudget: true, fitAnchor: { xmin: 0, ymin: 0, xmax: 0, ymax: 0 } })),
    });
    const session = startCandidateArmSession({ dataset: "ds_x", canvas });
    await session.reissueUnrestricted(null, null);
    cancelMock.mockClear();

    lastSink().onBatch(new Uint8Array([1]), true); // the untiled stream's own batch, over budget
    await Promise.resolve();

    expect(cancelMock).not.toHaveBeenCalled();
    expect(canvas.markTilePartial).not.toHaveBeenCalled();
  });
});

// Viewport-residency cut P4 (decisions 24(a)/(b)): `onResidencyStatusChange` drives the SAME
// `ResidencyStatusEvent`s `App.tsx`'s own `nextResidencyStatus` reduces -- these tests assert the
// events this session actually emits, at the actual call sites, not just the manager/canvas state
// those call sites read.
describe("startCandidateArmSession: onResidencyStatusChange (viewport-residency cut P4)", () => {
  // Sibling to `describe("startCandidateArmSession", ...)` above, not nested inside it -- vitest
  // hooks are NOT inherited across sibling describes, so this block needs its own copy of the exact
  // same per-test mock reset that block's own `beforeEach` performs (mirrored, not shared).
  beforeEach(() => {
    viewportQueryMock.mockReset().mockResolvedValue({ stream: "sh_1" });
    cancelMock.mockReset().mockResolvedValue({ state: "requested" });
    dataPlaneAttachMock.mockReset().mockResolvedValue({ url: "ws://127.0.0.1:1/stream", subprotocols: ["spatial-dp.v0", "tok.x"] });
    startStreamMock.mockReset().mockReturnValue({ cancel: vi.fn(), stats: { reassemblyCopies: 0, jsonFramesSeen: 0 } });
  });

  // Architect re-verification, viewport-residency cut P6b, items 1-2 (the lift condition): before this
  // fix, this test asserted the WRONG behavior as intended -- a bootstrap batch, arriving BEFORE any
  // camera-change plan has ever run, used to emit `candidate-within-budget` ("Showing all N features in
  // view") over `lastCoveringTileKeys`'s own vacuously-empty initial value. The fix (`isFillComplete`'s
  // own `hasPlanned` sentinel) makes that emission impossible; this test now asserts the OPPOSITE.
  it("a bootstrap batch (before any camera-change plan has ever run) never emits candidate-within-budget -- the surviving sibling of Defect A", async () => {
    const canvas = fakeCanvas({
      pushTileBatch: vi.fn(() => ({ ...OK_INGEST, fitAnchor: { xmin: 0, ymin: 0, xmax: 0, ymax: 0 } })),
      getResidentCounts: vi.fn(() => ({ totalResidentVertices: 30, totalResidentFeatures: 3 })),
    });
    const onResidencyStatusChange = vi.fn();
    const session = startCandidateArmSession({ dataset: "ds_x", canvas, onResidencyStatusChange });

    await session.reissueUnrestricted(null, null);
    onResidencyStatusChange.mockClear(); // drop reissueUnrestricted's own query-issued event(s)
    lastSink().onBatch(new Uint8Array([1]), true);

    // No plan has run yet (no `onViewportChanged` call ever happened) -- absence is the honest
    // status here, not a premature "all of it" claim over a merely row-limited bootstrap set.
    expect(onResidencyStatusChange).not.toHaveBeenCalled();
  });

  // The legitimate path the sentinel must NOT block: once a real camera-change plan has run and every
  // covering tile it planned is complete, candidate-within-budget fires exactly as before.
  it("candidate-within-budget fires once a real camera-change plan's own covering tiles are all complete", async () => {
    vi.useFakeTimers();
    try {
      const canvas = fakeCanvas({
        pushTileBatch: vi.fn(() => ({ ...OK_INGEST, fitAnchor: { xmin: 0, ymin: 0, xmax: 0, ymax: 0 } })),
        isTileResidentInCandidateSet: vi.fn(() => true),
        isTileCompleteInCandidateSet: vi.fn(() => true),
        getResidentCounts: vi.fn(() => ({ totalResidentVertices: 30, totalResidentFeatures: 3 })),
      });
      const onResidencyStatusChange = vi.fn();
      const session = startCandidateArmSession({ dataset: "ds_x", canvas, onResidencyStatusChange });
      await session.reissueUnrestricted(null, null);
      lastSink().onBatch(new Uint8Array([1]), true);
      completeUntiledLook();

      onResidencyStatusChange.mockClear();
      session.onViewportChanged({ xmin: -10, ymin: -10, xmax: 10, ymax: 10 });
      await vi.advanceTimersByTimeAsync(VIEWPORT_QUERY_MIN_INTERVAL_MS);

      // Item B (residency-debt cut 1b): this scenario is exactly `settledState`'s own
      // `"settled-complete"` -- a real plan ran (`hasPlanned`), the debounce that fired it has already
      // resolved (`!pendingViewportChange`), and `manager.trackedTileCount === 0` -- so the event now
      // carries `settled: "complete"` too, never a second, competing signal.
      expect(onResidencyStatusChange).toHaveBeenCalledWith({
        kind: "candidate-within-budget",
        residentFeatureCount: 3,
        settled: "complete",
      });
    } finally {
      vi.useRealTimers();
    }
  });

  it("an over-budget batch emits candidate-over-budget with viewportTotal: null -- no honest viewport total is ever known here", async () => {
    const canvas = fakeCanvas({
      pushTileBatch: vi.fn(() => ({
        ...OK_INGEST,
        overBudget: true,
        fitAnchor: { xmin: 0, ymin: 0, xmax: 0, ymax: 0 },
      })),
      getResidentCounts: vi.fn(() => ({ totalResidentVertices: 2_000_000, totalResidentFeatures: 900 })),
    });
    const onResidencyStatusChange = vi.fn();
    const session = startCandidateArmSession({ dataset: "ds_x", canvas, onResidencyStatusChange });

    await session.reissueUnrestricted(null, null);
    onResidencyStatusChange.mockClear();
    lastSink().onBatch(new Uint8Array([1]), true);

    expect(onResidencyStatusChange).toHaveBeenCalledWith({
      kind: "candidate-over-budget",
      residentFeatureCount: 900,
      viewportTotal: null,
    });
  });

  it("reissueUnrestricted (Apply/Clear, or the dataset's own first look) emits query-issued at the clear", async () => {
    const canvas = fakeCanvas();
    const onResidencyStatusChange = vi.fn();
    const session = startCandidateArmSession({ dataset: "ds_x", canvas, onResidencyStatusChange });

    await session.reissueUnrestricted(null, null);

    expect(onResidencyStatusChange).toHaveBeenCalledWith({ kind: "query-issued" });
  });

  it("a pan/zoom (handleViewportChange, via onViewportChanged) re-emits the status even with no new batch arriving -- persists/refreshes across pans while over budget", async () => {
    vi.useFakeTimers();
    try {
      const canvas = fakeCanvas({
        // P5f complex-gate should-fix 1: `overBudget: true` here (not the prior `OK_INGEST` default)
        // -- this test's own name/intent is "persists ... while over budget", but before this fix
        // `manager.overBudget` was never genuinely set true anywhere in this test (a latent gap: it
        // only passed because the OLD `emitResidencyStatus` fired unconditionally regardless of
        // over-budget truth). Now that emission is gated on `manager.overBudget || isFillComplete()`,
        // this test must make the over-budget premise REAL for its own assertion to mean anything.
        pushTileBatch: vi.fn(() => ({ ...OK_INGEST, overBudget: true, fitAnchor: { xmin: 0, ymin: 0, xmax: 0, ymax: 0 } })),
        applyTileViewportContext: vi.fn(() => false), // still over budget after re-checking fit
        getResidentCounts: vi.fn(() => ({ totalResidentVertices: 2_000_000, totalResidentFeatures: 900 })),
      });
      const onResidencyStatusChange = vi.fn();
      const session = startCandidateArmSession({ dataset: "ds_x", canvas, onResidencyStatusChange });
      await session.reissueUnrestricted(null, null);
      lastSink().onBatch(new Uint8Array([1]), true);
      completeUntiledLook(); // P5f should-fix 4: a real pan below needs a real, established frame
      expect(session.manager.overBudget).toBe(true);

      viewportQueryMock.mockClear();
      viewportQueryMock.mockImplementation(() => new Promise(() => {}));
      onResidencyStatusChange.mockClear();

      session.onViewportChanged({ xmin: -10, ymin: -10, xmax: 10, ymax: 10 });
      await vi.advanceTimersByTimeAsync(VIEWPORT_QUERY_MIN_INTERVAL_MS);

      // Item B (residency-debt cut 1b): with resident vertices pinned at the hard ceiling itself
      // (well over the declared 0.9 headroom margin), every new covering-tile candidate this plan
      // considers is skipped by the headroom-gated over-budget exception BEFORE it is ever added to
      // `issued`/`queued` (`TileViewportStreamManager.onCameraChange`'s own `continue` in that loop) --
      // `manager.trackedTileCount` is genuinely `0` after this plan, so the settled predicate
      // (`hasPlanned && !pendingViewportChange && trackedTileCount === 0`) reads `true`, and since
      // `manager.overBudget` stays `true`, the classification is `"settled-partial"`, never
      // `"settled-complete"`.
      expect(onResidencyStatusChange).toHaveBeenCalledWith({
        kind: "candidate-over-budget",
        residentFeatureCount: 900,
        viewportTotal: null,
        settled: "partial",
      });
    } finally {
      vi.useRealTimers();
    }
  });

  // P5f complex-gate should-fix 1: the bug this fixes -- a mid-fill (not-yet-complete, not-over-
  // budget) covering set must never emit "Showing all N features in view" -- N was not actually all.
  it("mid-fill, not over budget: emits NOTHING (absence, not a premature within-budget claim) while tiles are still queued/issuing/in-flight", async () => {
    vi.useFakeTimers();
    try {
      const canvas = fakeCanvas({
        pushTileBatch: vi.fn(() => ({ ...OK_INGEST, fitAnchor: { xmin: 0, ymin: 0, xmax: 0, ymax: 0 } })),
        getResidentCounts: vi.fn(() => ({ totalResidentVertices: 10, totalResidentFeatures: 1 })),
      });
      const onResidencyStatusChange = vi.fn();
      const session = startCandidateArmSession({ dataset: "ds_x", canvas, onResidencyStatusChange });
      await session.reissueUnrestricted(null, null);
      lastSink().onBatch(new Uint8Array([1]), true);
      completeUntiledLook(); // P5f should-fix 4: establishes the frame at the stream's own terminal
      expect(session.manager.gridFrame).not.toBeNull();

      // A real pan plans real tile queries -- never resolved here, so they stay tracked
      // ("issuing"/queued) for the rest of this test: the covering set is genuinely incomplete.
      viewportQueryMock.mockClear();
      viewportQueryMock.mockImplementation(() => new Promise(() => {}));
      onResidencyStatusChange.mockClear();

      session.onViewportChanged({ xmin: -10, ymin: -10, xmax: 10, ymax: 10 });
      await vi.advanceTimersByTimeAsync(VIEWPORT_QUERY_MIN_INTERVAL_MS);

      expect(session.manager.overBudget).toBe(false);
      expect(session.manager.trackedTileCount).toBeGreaterThan(0); // genuinely mid-fill
      expect(onResidencyStatusChange).not.toHaveBeenCalled();
    } finally {
      vi.useRealTimers();
    }
  });

  it("onResidencyStatusChange is optional -- a batch never throws when it is omitted", async () => {
    const canvas = fakeCanvas({
      pushTileBatch: vi.fn(() => ({ ...OK_INGEST, fitAnchor: { xmin: 0, ymin: 0, xmax: 0, ymax: 0 } })),
    });
    const session = startCandidateArmSession({ dataset: "ds_x", canvas });
    await session.reissueUnrestricted(null, null);

    expect(() => lastSink().onBatch(new Uint8Array([1]), true)).not.toThrow();
  });
});

// S5 (reviewer gate, residency-debt cut 1b): `emitResidencyStatus`'s own call site wiring of
// `fillActivity` (`residencyStatus.ts`) -- `fillActivity` itself is already unit-tested directly
// against its four pure inputs (`residencyStatus.test.ts`); this describes the SESSION-level wiring
// that supplies those inputs from real manager/canvas state, using the same fakes every other
// describe block in this file already does.
describe("emitResidencyStatus: the stalled field (S5, session-level wiring of fillActivity)", () => {
  beforeEach(() => {
    viewportQueryMock.mockReset().mockResolvedValue({ stream: "sh_1" });
    cancelMock.mockReset().mockResolvedValue({ state: "requested" });
    dataPlaneAttachMock.mockReset().mockResolvedValue({ url: "ws://127.0.0.1:1/stream", subprotocols: ["spatial-dp.v0", "tok.x"] });
    startStreamMock.mockReset().mockReturnValue({ cancel: vi.fn(), stats: { reassemblyCopies: 0, jsonFramesSeen: 0 } });
  });

  it("over-budget with a queued backlog and no headroom emits stalled: true", async () => {
    vi.useFakeTimers();
    try {
      const canvas = fakeCanvas({
        pushTileBatch: vi
          .fn()
          .mockReturnValueOnce({ ...OK_INGEST, fitAnchor: { xmin: 0, ymin: 0, xmax: 0, ymax: 0 } }) // untiled bootstrap
          .mockReturnValue({ ...OK_INGEST, overBudget: true, fitAnchor: { xmin: 0, ymin: 0, xmax: 0, ymax: 0 } }), // every tile batch after that reports overBudget
        getResidentCounts: vi.fn(() => ({
          totalResidentVertices: Math.ceil(MAX_RESIDENT_VERTICES * 0.9), // at the declared margin -- no headroom
          totalResidentFeatures: 5,
        })),
      });
      const onResidencyStatusChange = vi.fn();
      const session = startCandidateArmSession({ dataset: "ds_x", canvas, onResidencyStatusChange });
      await session.reissueUnrestricted(null, null);
      lastSink().onBatch(new Uint8Array([1]), true);
      completeUntiledLook();

      viewportQueryMock.mockReset();
      viewportQueryMock
        .mockResolvedValueOnce({ stream: "sh_tile_1" })
        .mockResolvedValueOnce({ stream: "sh_tile_2" })
        .mockResolvedValueOnce({ stream: "sh_tile_3" });
      viewportQueryMock.mockImplementation(() => new Promise(() => {})); // the rest stay genuinely queued
      // Covers the WHOLE small established frame -- 3 issued (the in-flight cap), the rest queued.
      session.onViewportChanged({ xmin: -10, ymin: -10, xmax: 10, ymax: 10 });
      await vi.advanceTimersByTimeAsync(VIEWPORT_QUERY_MIN_INTERVAL_MS);
      expect(session.manager.inFlightCount).toBe(3);
      expect(session.manager.queuedCount).toBeGreaterThan(0);

      onResidencyStatusChange.mockClear();
      const tileSink = lastSink(); // one of the 3 issued tiles -- reports overBudget, self-cancels
      tileSink.onBatch(new Uint8Array([2]), true);
      await Promise.resolve(); // manager.cancelTile's own synchronous cancel path settles

      expect(session.manager.overBudget).toBe(true);
      expect(session.manager.queuedCount).toBeGreaterThan(0); // over-budget never drains the queue
      expect(onResidencyStatusChange).toHaveBeenCalledWith({
        kind: "candidate-over-budget",
        residentFeatureCount: 5,
        viewportTotal: null,
        stalled: true,
      });
    } finally {
      vi.useRealTimers();
    }
  });

  it("over-budget with an empty queue emits the stalled field absent (never explicitly false)", async () => {
    const canvas = fakeCanvas({
      pushTileBatch: vi.fn(() => ({ ...OK_INGEST, overBudget: true, fitAnchor: { xmin: 0, ymin: 0, xmax: 0, ymax: 0 } })),
      getResidentCounts: vi.fn(() => ({ totalResidentVertices: 2_000_000, totalResidentFeatures: 900 })),
    });
    const onResidencyStatusChange = vi.fn();
    const session = startCandidateArmSession({ dataset: "ds_x", canvas, onResidencyStatusChange });
    await session.reissueUnrestricted(null, null);
    onResidencyStatusChange.mockClear();
    // The untiled bootstrap's own batch, over budget -- no tile was ever planned, so both
    // queuedCount and inFlightCount are genuinely 0.
    lastSink().onBatch(new Uint8Array([1]), true);

    expect(session.manager.queuedCount).toBe(0);
    expect(onResidencyStatusChange).toHaveBeenCalledWith({
      kind: "candidate-over-budget",
      residentFeatureCount: 900,
      viewportTotal: null,
    });
    const [event] = onResidencyStatusChange.mock.calls.at(-1)!;
    expect(event.stalled).toBeUndefined(); // absent, never an explicit `false`
  });
});

// Viewport-residency cut P4, item B: "assert (test) that under candidate arm no `.canvas-refusal`
// ceiling banner can render (the refusal event is never fired by candidate ingest -- P3w); make the
// impossibility a test, not an assumption." `.canvas-refusal` (App.tsx) renders ONLY from
// `canvasRefusal` state, which is set ONLY by `handleCanvasCeilingRefusal` (App.tsx), reached ONLY via
// `WorkingCanvas`'s `onCanvasRefusal` prop -- itself called ONLY from `WorkingCanvasHandle.pushBatch`'s
// own `ResidentVertexCeilingExceeded`/`PickCeilingExceeded` catch (`WorkingCanvas.tsx`), a method the
// candidate arm never calls (it calls `pushTileBatch` exclusively). `CandidateArmSessionDeps` (this
// module) never even DECLARES an `onCanvasRefusal`-shaped callback -- there is no wired path from here
// to `setCanvasRefusal` for App.tsx's candidate branch to have constructed in the first place, refusal
// or not. This suite proves the ingest side of that chain never throws/refuses even at the most
// extreme over-budget condition, the one case that WOULD have refused on the baseline arm.
describe("banner impossibility under the candidate arm (item B, P4)", () => {
  // See the sibling-describe note above -- this block's own mock reset, mirrored.
  beforeEach(() => {
    viewportQueryMock.mockReset().mockResolvedValue({ stream: "sh_1" });
    cancelMock.mockReset().mockResolvedValue({ state: "requested" });
    dataPlaneAttachMock.mockReset().mockResolvedValue({ url: "ws://127.0.0.1:1/stream", subprotocols: ["spatial-dp.v0", "tok.x"] });
    startStreamMock.mockReset().mockReturnValue({ cancel: vi.fn(), stats: { reassemblyCopies: 0, jsonFramesSeen: 0 } });
  });

  it("an over-budget batch never throws a ceiling-style refusal, and no onCanvasRefusal-shaped callback exists to reach even if it wanted to", async () => {
    const canvas = fakeCanvas({
      pushTileBatch: vi.fn(() => ({
        ...OK_INGEST,
        overBudget: true,
        fitAnchor: { xmin: 0, ymin: 0, xmax: 0, ymax: 0 },
      })),
    });
    // `CandidateArmSessionDeps` (this file's own interface) has exactly three fields:
    // `dataset`/`canvas`/`onResidencyStatusChange` -- no `onCanvasRefusal` field exists for this
    // object literal to populate even deliberately; TypeScript itself would refuse one.
    const session = startCandidateArmSession({ dataset: "ds_x", canvas });

    await expect(session.reissueUnrestricted(null, null)).resolves.toEqual({ kind: "issued", streamHandle: "sh_1" });
    expect(() => lastSink().onBatch(new Uint8Array([1]), true)).not.toThrow();
    expect(session.manager.overBudget).toBe(true);
  });
});

describe("countedIssuedTileKeys reset on reissueUnrestricted (P5f complex-gate should-fix 5)", () => {
  beforeEach(() => {
    viewportQueryMock.mockReset().mockResolvedValue({ stream: "sh_1" });
    cancelMock.mockReset().mockResolvedValue({ state: "requested" });
    dataPlaneAttachMock.mockReset().mockResolvedValue({ url: "ws://127.0.0.1:1/stream", subprotocols: ["spatial-dp.v0", "tok.x"] });
    startStreamMock.mockReset().mockReturnValue({ cancel: vi.fn(), stats: { reassemblyCopies: 0, jsonFramesSeen: 0 } });
    recordResidencyStreamIssuedMock.mockReset();
    recordResidencyTileRequestedMock.mockReset();
    recordResidencyStreamEndedMock.mockReset();
    recordResidencyBatchArrivedMock.mockReset();
  });

  // Before this fix, `countedIssuedTileKeys` survived `reissueUnrestricted`'s own full clear
  // untouched -- a tile key counted "issued" in generation 1 stayed in that set forever, so the
  // SAME key issued again in generation 2 was silently treated as already-counted and skipped,
  // undercounting `streamsIssued`/`tilesRequested` for every generation after the first.
  it("a tile key issued in one generation is counted AGAIN when the same key is issued in a later generation", async () => {
    vi.useFakeTimers();
    try {
      const canvas = fakeCanvas({
        pushTileBatch: vi.fn(() => ({ ...OK_INGEST, fitAnchor: { xmin: 0, ymin: 0, xmax: 0, ymax: 0 } })),
      });
      const session = startCandidateArmSession({ dataset: "ds_x", canvas });
      await session.reissueUnrestricted(null, null);
      lastSink().onBatch(new Uint8Array([1]), true);
      completeUntiledLook();
      expect(session.manager.gridFrame).not.toBeNull();

      // Cleared here, AFTER the untiled first look's own (unconditional, undeduped)
      // `recordResidencyStreamIssued` call and BEFORE the pan -- so both generations below measure
      // the SAME thing: the pan's own tile issuance alone, apples to apples.
      recordResidencyStreamIssuedMock.mockClear();
      recordResidencyTileRequestedMock.mockClear();
      viewportQueryMock.mockImplementation(() => new Promise(() => {})); // never resolves -- planning only
      const bbox = { xmin: -10, ymin: -10, xmax: 10, ymax: 10 };
      session.onViewportChanged(bbox);
      await vi.advanceTimersByTimeAsync(VIEWPORT_QUERY_MIN_INTERVAL_MS);
      const firstGenerationCalls = recordResidencyStreamIssuedMock.mock.calls.length;
      expect(firstGenerationCalls).toBeGreaterThan(0); // at least one tile issued this pan

      // Apply/Clear -- a fresh generation. The SAME bbox, against the SAME (frozen) frame, covers
      // the SAME tile key(s) again.
      viewportQueryMock.mockReset().mockResolvedValue({ stream: "sh_2" });
      await session.reissueUnrestricted(null, null);
      lastSink().onBatch(new Uint8Array([1]), true);
      completeUntiledLook();

      recordResidencyStreamIssuedMock.mockClear();
      recordResidencyTileRequestedMock.mockClear();
      viewportQueryMock.mockImplementation(() => new Promise(() => {}));
      session.onViewportChanged(bbox);
      await vi.advanceTimersByTimeAsync(VIEWPORT_QUERY_MIN_INTERVAL_MS);

      // The fix: counted again, exactly like the first generation was -- never silently skipped.
      expect(recordResidencyStreamIssuedMock.mock.calls.length).toBe(firstGenerationCalls);
      expect(recordResidencyTileRequestedMock.mock.calls.length).toBe(firstGenerationCalls);
    } finally {
      vi.useRealTimers();
    }
  });
});

describe("applyScanEvent wiring (P5f complex-gate should-fix 3: the Cancel affordance under candidate)", () => {
  beforeEach(() => {
    viewportQueryMock.mockReset().mockResolvedValue({ stream: "sh_1" });
    cancelMock.mockReset().mockResolvedValue({ state: "requested" });
    dataPlaneAttachMock.mockReset().mockResolvedValue({ url: "ws://127.0.0.1:1/stream", subprotocols: ["spatial-dp.v0", "tok.x"] });
    startStreamMock.mockReset().mockReturnValue({ cancel: vi.fn(), stats: { reassemblyCopies: 0, jsonFramesSeen: 0 } });
  });

  // Before this fix, `App.tsx`'s candidate-arm branch never called `applyScanEvent` at all -- the
  // Cancel button's own visibility (`isScanInFlight(scanState)`) stayed permanently false-shaped for
  // a candidate-arm session's whole life, so Cancel was unreachable regardless of real work in flight.
  it("dispatches issued the moment the untiled stream starts, and reset once everything settles with no further work", async () => {
    const canvas = fakeCanvas({
      pushTileBatch: vi.fn(() => ({ ...OK_INGEST, fitAnchor: { xmin: 0, ymin: 0, xmax: 0, ymax: 0 } })),
    });
    const applyScanEvent = vi.fn();
    const session = startCandidateArmSession({ dataset: "ds_x", canvas, applyScanEvent });

    await session.reissueUnrestricted(null, null);
    expect(applyScanEvent).toHaveBeenCalledWith(expect.objectContaining({ kind: "issued" }));

    applyScanEvent.mockClear();
    lastSink().onBatch(new Uint8Array([1]), true);
    completeUntiledLook(); // the untiled stream's own terminal -- no tile work was ever planned

    expect(applyScanEvent).toHaveBeenCalledWith({ kind: "reset" });
  });

  it("never throws when applyScanEvent is omitted", async () => {
    const canvas = fakeCanvas({
      pushTileBatch: vi.fn(() => ({ ...OK_INGEST, fitAnchor: { xmin: 0, ymin: 0, xmax: 0, ymax: 0 } })),
    });
    const session = startCandidateArmSession({ dataset: "ds_x", canvas });
    await session.reissueUnrestricted(null, null);
    expect(() => {
      lastSink().onBatch(new Uint8Array([1]), true);
      completeUntiledLook();
    }).not.toThrow();
  });
});

// Item A (residency-debt cut 1b, decisions 32a/33b): the session-level seam Cancel now calls instead
// of `manager.stop()` -- stop filling, keep the current partial view, tiling resumes on the next
// camera change (a summary of 32a, not a quotation), the relief cancelling in-flight tile streams
// too (33b).
describe("relinquishFill (Item A, decisions 32a/33b: the scoped relief lever)", () => {
  beforeEach(() => {
    viewportQueryMock.mockReset().mockResolvedValue({ stream: "sh_1" });
    cancelMock.mockReset().mockResolvedValue({ state: "requested" });
    dataPlaneAttachMock.mockReset().mockResolvedValue({ url: "ws://127.0.0.1:1/stream", subprotocols: ["spatial-dp.v0", "tok.x"] });
    startStreamMock.mockReset().mockReturnValue({ cancel: vi.fn(), stats: { reassemblyCopies: 0, jsonFramesSeen: 0 } });
  });

  /** Establishes a real grid frame, then pans over a bbox wide enough to issue the full
   * `MAX_IN_FLIGHT_TILE_STREAMS` cap AND leave more queued -- returns the session and its
   * `applyScanEvent`/`onResidencyStatusChange` spies, with the untiled bootstrap's own dispatches
   * already cleared so every assertion below is about the PAN's own work and `relinquishFill`'s own
   * effect on it alone. */
  async function armSessionWithOutstandingTileWork(canvasOverrides: Partial<WorkingCanvasHandle> = {}) {
    const canvas = fakeCanvas({
      pushTileBatch: vi.fn(() => ({ ...OK_INGEST, fitAnchor: { xmin: 0, ymin: 0, xmax: 0, ymax: 0 } })),
      getResidentCounts: vi.fn(() => ({ totalResidentVertices: 30, totalResidentFeatures: 3 })),
      ...canvasOverrides,
    });
    const applyScanEvent = vi.fn();
    const onResidencyStatusChange = vi.fn();
    const session = startCandidateArmSession({ dataset: "ds_x", canvas, applyScanEvent, onResidencyStatusChange });
    await session.reissueUnrestricted(null, null);
    lastSink().onBatch(new Uint8Array([1]), true);
    completeUntiledLook();
    expect(session.manager.gridFrame).not.toBeNull();

    applyScanEvent.mockClear();
    onResidencyStatusChange.mockClear();
    // `reissueUnrestricted` above (the dataset's own opening call) already invoked BOTH of these once,
    // as part of its own full clear -- cleared here so this helper's own callers only ever observe
    // calls `relinquishFill()` itself makes, never this setup's.
    (canvas.clearAllTiles as ReturnType<typeof vi.fn>).mockClear();
    (canvas.clearTile as ReturnType<typeof vi.fn>).mockClear();
    viewportQueryMock.mockReset();
    viewportQueryMock
      .mockResolvedValueOnce({ stream: "sh_tile_1" })
      .mockResolvedValueOnce({ stream: "sh_tile_2" })
      .mockResolvedValueOnce({ stream: "sh_tile_3" });
    // Never resolves past the third -- the rest of the covering set stays genuinely queued.
    viewportQueryMock.mockImplementation(() => new Promise(() => {}));

    // Covers the WHOLE small established frame ("a bbox spanning a 3x2 block..." pattern this file's
    // sibling tests already rely on for the same degenerate `{xmin:0,ymin:0,xmax:0,ymax:0}` fitAnchor).
    session.onViewportChanged({ xmin: -10, ymin: -10, xmax: 10, ymax: 10 });
    await vi.advanceTimersByTimeAsync(VIEWPORT_QUERY_MIN_INTERVAL_MS);

    expect(session.manager.inFlightCount).toBe(3);
    expect(session.manager.queuedCount).toBeGreaterThan(0);
    return { session, canvas, applyScanEvent, onResidencyStatusChange };
  }

  it("cancels every in-flight and queued tile, but never sets stopped, never resets the frame, and never clears residency wholesale", async () => {
    vi.useFakeTimers();
    try {
      const { session, canvas } = await armSessionWithOutstandingTileWork();
      const frameBefore = session.manager.gridFrame;
      const queuedBefore = session.manager.queuedCount;

      const summary = session.relinquishFill();

      expect(summary.cancelledInFlight).toHaveLength(3);
      expect(summary.droppedQueued).toHaveLength(queuedBefore);
      expect(session.manager.inFlightCount).toBe(0);
      expect(session.manager.queuedCount).toBe(0);
      expect(session.manager.gridFrame).toEqual(frameBefore); // BS8/32a: the frame is never re-derived
      expect(canvas.clearAllTiles).not.toHaveBeenCalled(); // never a wholesale clear (32a's whole point)
      expect(canvas.clearTile).not.toHaveBeenCalled();

      // BS1: the session itself is not stopped -- a fresh pan still plans real work afterward.
      //
      // S4 (reviewer gate, residency-debt cut 1b): asserts actual RE-ISSUANCE, not merely
      // `kind === "planned"` -- every tile the relief just dropped/cancelled is a genuinely NEW
      // candidate again (nothing tracked for any of them), so this round re-issues up to the
      // in-flight cap and queues the remainder, the same shape the original plan had -- "planned
      // something", never "planned nothing but wasn't stopped".
      viewportQueryMock.mockReset().mockImplementation(() => new Promise(() => {}));
      const outcome = session.manager.onCameraChange({ xmin: -10, ymin: -10, xmax: 10 + 1, ymax: 10 });
      if (outcome.kind !== "planned") throw new Error("unreachable");
      expect(outcome.issued).toHaveLength(3);
      expect(outcome.queued.length).toBeGreaterThan(0);

      // A later reissue (Apply/Clear, or a dataset close's own effect) still works -- `stop()` was
      // never called, `stopped` was never set at the session level either.
      viewportQueryMock.mockReset().mockResolvedValue({ stream: "sh_after" });
      const reissueOutcome = await session.reissueUnrestricted(null, null);
      expect(reissueOutcome).toEqual({ kind: "issued", streamHandle: "sh_after" });
    } finally {
      vi.useRealTimers();
    }
  });

  it("marks every relinquish-cancelled tile durably partial (32a's rider: a user-stopped fill never reads as complete) -- never a dropped-queued one, which was never resident", async () => {
    vi.useFakeTimers();
    try {
      const { session, canvas } = await armSessionWithOutstandingTileWork();
      (canvas.markTilePartial as ReturnType<typeof vi.fn>).mockClear();

      const summary = session.relinquishFill();

      for (const tileKey of summary.cancelledInFlight) {
        expect(canvas.markTilePartial).toHaveBeenCalledWith(tileKey);
      }
      // `markTilePartial` is a no-op for a tile that was never resident (`tileResidentSet.ts`'s own
      // contract), so this assertion is meaningful, not merely coincidental: it is called EXACTLY
      // `cancelledInFlight.length` times, never once for a `droppedQueued` key.
      expect(canvas.markTilePartial).toHaveBeenCalledTimes(summary.cancelledInFlight.length);
    } finally {
      vi.useRealTimers();
    }
  });

  it("re-syncs scan liveness to reset once nothing remains outstanding", async () => {
    vi.useFakeTimers();
    try {
      const { session, applyScanEvent } = await armSessionWithOutstandingTileWork();

      session.relinquishFill();

      expect(applyScanEvent).toHaveBeenCalledWith({ kind: "reset" });
    } finally {
      vi.useRealTimers();
    }
  });

  it("emits candidate-relinquished with the current resident feature count -- distinct from within/over-budget, never silent", async () => {
    vi.useFakeTimers();
    try {
      const { session, onResidencyStatusChange } = await armSessionWithOutstandingTileWork({
        getResidentCounts: vi.fn(() => ({ totalResidentVertices: 30, totalResidentFeatures: 7 })),
      });

      session.relinquishFill();

      expect(onResidencyStatusChange).toHaveBeenCalledWith({ kind: "candidate-relinquished", residentFeatureCount: 7 });
      // Never ALSO the ordinary within/over-budget events for this same call -- one status, not two
      // competing ones.
      expect(onResidencyStatusChange).not.toHaveBeenCalledWith(expect.objectContaining({ kind: "candidate-within-budget" }));
    } finally {
      vi.useRealTimers();
    }
  });

  // M1 (reviewer gate, residency-debt cut 1b): the reviewer's own reachable repro -- Cancel clicked
  // while the untiled first-look/reissue stream is still delivering (the bootstrap, or an Apply/Clear
  // reissue) must NEVER claim "Filling stopped": that stream is out of this lever's scope entirely
  // (DECISIONS-PENDING.md entry 35), and it keeps landing batches after this call returns.
  it("relinquishFill while the untiled first-look/reissue stream is still running emits the HONEST untiledStreamStillRunning variant, never the plain 'Filling stopped' claim", async () => {
    const canvas = fakeCanvas({
      getResidentCounts: vi.fn(() => ({ totalResidentVertices: 10, totalResidentFeatures: 1 })),
    });
    const onResidencyStatusChange = vi.fn();
    const session = startCandidateArmSession({ dataset: "ds_x", canvas, onResidencyStatusChange });

    // The dataset's own first look, deliberately left running -- no batch/terminal fired, so no grid
    // frame exists yet and no tile work could possibly be outstanding either (mirrors the reviewer's
    // own repro: Cancel clicked mid-bootstrap/mid-reissue, before the untiled stream's own terminal).
    await session.reissueUnrestricted(null, null);
    onResidencyStatusChange.mockClear();

    const summary = session.relinquishFill();

    // Piece 1 (entry 35, RULED): "no at bootstrap" -- the boundary condition made explicit, not just
    // implied by the resulting status: no grid frame exists yet, so this lever's own widened scope
    // (below) never applies here.
    expect(session.manager.gridFrame).toBeNull();
    expect(summary).toEqual({ cancelledInFlight: [], droppedQueued: [] }); // no tile work existed to touch
    expect(onResidencyStatusChange).toHaveBeenCalledWith({
      kind: "candidate-relinquished",
      residentFeatureCount: 1,
      untiledStreamStillRunning: true,
    });
    // The untiled stream itself was never cancelled by this lever -- it keeps delivering, proving the
    // status's own claim true, not merely asserted.
    expect(cancelMock).not.toHaveBeenCalled();
    expect(() => lastSink().onBatch(new Uint8Array([1]), true)).not.toThrow();
    expect(canvas.pushTileBatch).toHaveBeenCalledWith(INITIAL_TILE_KEY, "sh_1", 0, expect.any(Uint8Array));
  });

  it("returns the tile keys it actually touched, matching manager.relinquishOutstanding's own summary", async () => {
    vi.useFakeTimers();
    try {
      const { session } = await armSessionWithOutstandingTileWork();
      const managerSpy = vi.spyOn(session.manager, "relinquishOutstanding");

      const summary = session.relinquishFill();

      expect(managerSpy).toHaveBeenCalledTimes(1);
      expect(managerSpy).toHaveReturnedWith(summary);
    } finally {
      vi.useRealTimers();
    }
  });
});

// Piece 1 (residency-debt cut 1b, entry 35 -- RULED 2026-09-05: "accept as recommended -- yes with
// grid frame, no at bootstrap"). `relinquishFill`'s widened scope: it now ALSO cancels the untiled
// first-look/reissue stream, but only once `manager.gridFrame` already exists (an Apply/Clear reissue,
// never the bootstrap window covered by the sibling test just above).
describe("relinquishFill (Piece 1, entry 35 -- also cancels the untiled stream once a grid frame exists)", () => {
  beforeEach(() => {
    viewportQueryMock.mockReset().mockResolvedValue({ stream: "sh_1" });
    cancelMock.mockReset().mockResolvedValue({ state: "requested" });
    dataPlaneAttachMock.mockReset().mockResolvedValue({ url: "ws://127.0.0.1:1/stream", subprotocols: ["spatial-dp.v0", "tok.x"] });
    startStreamMock.mockReset().mockReturnValue({ cancel: vi.fn(), stats: { reassemblyCopies: 0, jsonFramesSeen: 0 } });
  });

  /** Establishes a real grid frame via the dataset's own bootstrap, then performs an Apply/Clear
   * reissue whose OWN untiled stream is deliberately left running -- `manager.gridFrame` persists
   * across the reissue (`establishGridFrame`'s own "no-op past the first call" contract; `clearAll`
   * never touches `this.frame` either), so this is exactly the window entry 35 rules IN scope. */
  async function armSessionWithGridFrameAndOpenReissue(canvasOverrides: Partial<WorkingCanvasHandle> = {}) {
    const canvas = fakeCanvas({
      pushTileBatch: vi.fn(() => ({ ...OK_INGEST, fitAnchor: { xmin: 0, ymin: 0, xmax: 0, ymax: 0 } })),
      getResidentCounts: vi.fn(() => ({ totalResidentVertices: 10, totalResidentFeatures: 4 })),
      ...canvasOverrides,
    });
    const applyScanEvent = vi.fn();
    const onResidencyStatusChange = vi.fn();
    const session = startCandidateArmSession({ dataset: "ds_x", canvas, applyScanEvent, onResidencyStatusChange });

    await session.reissueUnrestricted(null, null); // gen1 bootstrap
    lastSink().onBatch(new Uint8Array([1]), true);
    completeUntiledLook();
    expect(session.manager.gridFrame).not.toBeNull();

    viewportQueryMock.mockReset().mockResolvedValueOnce({ stream: "sh_2" });
    await session.reissueUnrestricted(null, null); // gen2 (Apply/Clear) -- sh_2 deliberately left open
    expect(session.manager.gridFrame).not.toBeNull(); // persists across the reissue, never re-derived

    applyScanEvent.mockClear(); // drop gen1/gen2's own {kind:"issued"} dispatches
    onResidencyStatusChange.mockClear(); // drop gen1/gen2's own query-issued dispatches
    cancelMock.mockClear();
    return { session, canvas, applyScanEvent, onResidencyStatusChange };
  }

  it("cancels the untiled stream, clears untiledStreamHandle, and emits the ORDINARY relinquished variant (untiledStreamStillRunning computes false)", async () => {
    const { session, applyScanEvent, onResidencyStatusChange } = await armSessionWithGridFrameAndOpenReissue();

    const summary = session.relinquishFill();

    expect(cancelMock).toHaveBeenCalledWith("sh_2");
    expect(summary).toEqual({ cancelledInFlight: [], droppedQueued: [] }); // no TILE work existed to touch
    // The ORDINARY variant -- no `untiledStreamStillRunning` field at all (`toEqual` treats an absent
    // property and an explicit `undefined` as equivalent, the same idiom this file's own preceding
    // tests already rely on).
    expect(onResidencyStatusChange).toHaveBeenCalledWith({ kind: "candidate-relinquished", residentFeatureCount: 4 });
    expect(onResidencyStatusChange).not.toHaveBeenCalledWith(
      expect.objectContaining({ untiledStreamStillRunning: expect.anything() })
    );
    // Liveness goes idle: no tile work, and now no untiled work either (`hasOutstandingWork()` false)
    // -- Cancel itself would hide (`isScanInFlight` reads false once `{kind:"reset"}` lands).
    expect(applyScanEvent).toHaveBeenCalledWith({ kind: "reset" });
    // S-3 (re-reviewer gate, residency-debt cut 1b): the THIRD distinguishable report class
    // (`relinquishFill`'s own doc comment above `logSessionEvent`, `candidateArmSession.ts`) -- named
    // and shaped, mirroring `tileViewportStreamManager.test.ts`'s own assertions for its two sibling
    // classes (`tile-stream-relinquish-cancelled`/`tile-stream-relinquish-dropped`).
    expect(logSessionEventMock).toHaveBeenCalledWith("untiled-stream-relinquish-cancelled", expect.stringContaining("sh_2"));
    expect(logSessionEventMock).toHaveBeenCalledWith("untiled-stream-relinquish-cancelled", expect.stringContaining(INITIAL_TILE_KEY));
  });

  it("a later batch on the cancelled untiled stream's own (stale) sink is discarded, never reaching pushTileBatch again", async () => {
    const { session, canvas } = await armSessionWithGridFrameAndOpenReissue();
    const staleSink = lastSink(); // sh_2's own sink, captured before the cancel
    (canvas.pushTileBatch as ReturnType<typeof vi.fn>).mockClear();

    session.relinquishFill();
    staleSink.onBatch(new Uint8Array([9]), true);

    expect(canvas.pushTileBatch).not.toHaveBeenCalled();
  });

  // Piece 1/2(iii): the self-cancel-suppression discipline reused from `tileViewportStreamManager.ts`'s
  // own `selfCancelledHandles` -- the eventual, asynchronous terminal this cancel produces must never be
  // misreported as a genuine failure (logged or fed into the typed-partiality accounting).
  it("the eventual terminal for the cancelled untiled stream is never treated as a covering-tile failure -- isFillComplete() reads true once a fresh plan completes cleanly", async () => {
    const { session } = await armSessionWithGridFrameAndOpenReissue({
      isTileResidentInCandidateSet: vi.fn(() => true),
      isTileCompleteInCandidateSet: vi.fn(() => true),
    });
    const staleSink = lastSink(); // sh_2's own sink, captured before the cancel

    session.relinquishFill();
    logSessionEventMock.mockClear();
    // The real, asynchronous cancel acknowledgment, arriving later -- exactly the race this
    // suppression discipline exists for.
    expect(() => staleSink.onTerminal({ kind: "Cancelled", detail: "" })).not.toThrow();

    // S-3 (re-reviewer gate, residency-debt cut 1b): a SELF-cancelled untiled terminal produces NO
    // `candidate-untiled-terminal` line -- `onTerminal`'s own doc comment ("deliberately EXCLUDED from
    // both the log line and the accounting") stated as a positive assertion, not merely relied on.
    expect(logSessionEventMock).not.toHaveBeenCalledWith("candidate-untiled-terminal", expect.anything());

    // A fresh plan whose entire covering set is already complete -- if the cancelled untiled stream's
    // own terminal had been wrongly recorded as a covering-tile failure, `isFillComplete()` would read
    // `false` here despite nothing genuinely being incomplete.
    vi.useFakeTimers();
    try {
      viewportQueryMock.mockReset();
      session.onViewportChanged({ xmin: -10, ymin: -10, xmax: 10, ymax: 10 });
      await vi.advanceTimersByTimeAsync(VIEWPORT_QUERY_MIN_INTERVAL_MS);
    } finally {
      vi.useRealTimers();
    }
    expect(session.isFillComplete()).toBe(true);
  });
});

// M2 (reviewer gate, residency-debt cut 1b): the 32a rider ("a user-stopped fill never reads as
// complete") made structural. The finding's
// own exact repro -- a tile (B) carried in-flight across two plans is skipped entirely by
// `onCameraChange`'s own new-candidate loop (`tileViewportStreamManager.ts`'s
// `if (this.tileState.has(tileKey)) continue;`), so it lands in NONE of that plan's
// `issued`/`queued`/`alreadyResident` and is silently absent from `lastCoveringTileKeys` even though
// it is genuinely still covering. If `relinquishFill` then cancels exactly that tile,
// `manager.trackedTileCount` reaches 0 without `lastCoveringTileKeys` ever having named it --
// `isFillComplete()` would iterate only the tile(s) it DOES know about, find them complete, and read
// the whole fill complete over a user-stopped one.
describe("M2: isFillComplete never reads true over a tile skipped-as-tracked across two plans (structural latch via relinquishFill)", () => {
  beforeEach(() => {
    viewportQueryMock.mockReset().mockResolvedValue({ stream: "sh_1" });
    cancelMock.mockReset().mockResolvedValue({ state: "requested" });
    dataPlaneAttachMock.mockReset().mockResolvedValue({ url: "ws://127.0.0.1:1/stream", subprotocols: ["spatial-dp.v0", "tok.x"] });
    startStreamMock.mockReset().mockReturnValue({ cancel: vi.fn(), stats: { reassemblyCopies: 0, jsonFramesSeen: 0 } });
  });

  /** Finds the `StreamSink` `startStream` was called with for a SPECIFIC stream handle -- unlike this
   * file's own `lastSink()` (which only ever returns the MOST RECENT call), this repro needs to drive
   * two concurrently in-flight tile streams independently by their own handles. */
  function sinkForHandle(handle: string): StreamSink {
    const call = startStreamMock.mock.calls.find((c) => c[0].ticketHandle === handle);
    if (!call) throw new Error(`no stream started for handle ${handle}`);
    return call[0].sink as StreamSink;
  }

  it("plan1 issues A+B; A completes untrimmed; plan2 (same covering set) reads A alreadyResident and skips B as already-tracked; relinquish cancels B (trackedTileCount -> 0) -- isFillComplete stays false until a fresh plan runs, then completeness can be earned again", async () => {
    vi.useFakeTimers();
    try {
      const completeTileKeys = new Set<string>();
      const canvas = fakeCanvas({
        pushTileBatch: vi.fn(() => ({ ...OK_INGEST, fitAnchor: { xmin: 0, ymin: 0, xmax: 0, ymax: 0 } })),
        getResidentCounts: vi.fn(() => ({ totalResidentVertices: 20, totalResidentFeatures: 2 })),
        isTileResidentInCandidateSet: vi.fn((tileKey: string) => completeTileKeys.has(tileKey)),
        isTileCompleteInCandidateSet: vi.fn((tileKey: string) => completeTileKeys.has(tileKey)),
        markTileComplete: vi.fn((tileKey: string) => completeTileKeys.add(tileKey)),
        markTilePartial: vi.fn((tileKey: string) => completeTileKeys.delete(tileKey)),
      });
      const onResidencyStatusChange = vi.fn();
      const session = startCandidateArmSession({ dataset: "ds_x", canvas, onResidencyStatusChange });
      await session.reissueUnrestricted(null, null);
      lastSink().onBatch(new Uint8Array([1]), true);
      completeUntiledLook();
      expect(session.manager.gridFrame).not.toBeNull();

      // Plan 1: a bbox covering exactly two tiles -- well under MAX_IN_FLIGHT_TILE_STREAMS (3), so
      // BOTH are issued directly (no queueing, keeping this repro's own bookkeeping traceable).
      viewportQueryMock.mockReset();
      viewportQueryMock.mockResolvedValueOnce({ stream: "sh_a" }).mockResolvedValueOnce({ stream: "sh_b" });
      const bbox = { xmin: -1, ymin: -1, xmax: -0.75, ymax: -0.875 };
      session.onViewportChanged(bbox);
      await vi.advanceTimersByTimeAsync(VIEWPORT_QUERY_MIN_INTERVAL_MS);
      expect(session.manager.inFlightCount).toBe(2);

      const covering1 = (canvas.applyTileViewportContext as ReturnType<typeof vi.fn>).mock.calls.at(-1)![0] as string[];
      expect(covering1).toHaveLength(2); // exactly A and B, both freshly issued this plan
      const [tileA, tileB] = covering1;

      // A completes untrimmed, reaching its own natural terminal -- `markTileComplete(A)` fires, and
      // the manager stops tracking A (removed from `tileState`/`inFlightStreams`).
      sinkForHandle("sh_a").onBatch(new Uint8Array([2]), true);
      sinkForHandle("sh_a").onTerminal({ kind: "Completed", detail: "" });
      expect(completeTileKeys.has(tileA)).toBe(true);
      expect(session.manager.trackedTileCount).toBe(1); // only B remains tracked

      // Plan 2: the SAME covering set. A is genuinely `alreadyResident` (complete); B is still
      // tracked ("in-flight") from plan 1 -- the manager's own new-candidate loop skips it entirely
      // (neither re-issued, re-queued, nor added to `alreadyResident`), so it is silently absent from
      // THIS plan's own covering set -- exactly the finding's own repro.
      viewportQueryMock.mockReset().mockImplementation(() => new Promise(() => {}));
      onResidencyStatusChange.mockClear();
      session.onViewportChanged(bbox);
      await vi.advanceTimersByTimeAsync(VIEWPORT_QUERY_MIN_INTERVAL_MS);

      const covering2 = (canvas.applyTileViewportContext as ReturnType<typeof vi.fn>).mock.calls.at(-1)![0] as string[];
      expect(covering2).toEqual([tileA]); // B silently missing -- the bug's own footprint
      expect(session.manager.trackedTileCount).toBe(1); // B is still genuinely outstanding right now
      // Not settled yet (B still tracked) -- no premature claim at plan 2's own emission either.
      expect(onResidencyStatusChange).not.toHaveBeenCalledWith(expect.objectContaining({ kind: "candidate-within-budget" }));

      // Relinquish: cancels B (the ONE tile the manager still tracks) -- trackedTileCount reaches 0
      // with `lastCoveringTileKeys` never having named B at all.
      const summary = session.relinquishFill();
      expect(summary.cancelledInFlight).toEqual([tileB]);
      expect(session.manager.trackedTileCount).toBe(0);

      // THE FIX: isFillComplete() must stay false -- B was never proven complete, only silently
      // dropped from view by a planning-loop quirk, then cancelled by the user's own relief lever.
      expect(session.isFillComplete()).toBe(false);
      // And the only status this call emits is the honest relinquished one -- never the complete claim.
      expect(onResidencyStatusChange).toHaveBeenCalledWith({ kind: "candidate-relinquished", residentFeatureCount: 2 });
      expect(onResidencyStatusChange).not.toHaveBeenCalledWith(expect.objectContaining({ kind: "candidate-within-budget" }));

      // Completeness can be earned again: a fresh plan re-requests B (no longer tracked, not yet
      // complete -- a genuinely new candidate), it completes untrimmed, and a FOLLOWING plan over the
      // same covering set reads the fill complete again, honestly.
      viewportQueryMock.mockReset().mockResolvedValueOnce({ stream: "sh_b2" });
      session.onViewportChanged(bbox);
      await vi.advanceTimersByTimeAsync(VIEWPORT_QUERY_MIN_INTERVAL_MS);
      expect(session.isFillComplete()).toBe(false); // B is issuing/in-flight again -- genuinely mid-fill

      sinkForHandle("sh_b2").onBatch(new Uint8Array([3]), true);
      sinkForHandle("sh_b2").onTerminal({ kind: "Completed", detail: "" });
      expect(completeTileKeys.has(tileB)).toBe(true);

      onResidencyStatusChange.mockClear();
      viewportQueryMock.mockReset().mockImplementation(() => new Promise(() => {}));
      session.onViewportChanged(bbox);
      await vi.advanceTimersByTimeAsync(VIEWPORT_QUERY_MIN_INTERVAL_MS);

      expect(session.isFillComplete()).toBe(true);
      // Item B: completeness re-earned by a fresh plan, with no viewport change left pending -- settled
      // AND complete.
      expect(onResidencyStatusChange).toHaveBeenCalledWith({
        kind: "candidate-within-budget",
        residentFeatureCount: 2,
        settled: "complete",
      });
    } finally {
      vi.useRealTimers();
    }
  });
});

// B1 (re-reviewer gate, residency-debt cut 1b): the settling-moment sibling of M2's own repro just
// above -- the SAME "tile carried in-flight across two plans, silently absent from
// `lastCoveringTileKeys`" gap (`tileViewportStreamManager.ts`'s own
// `if (this.tileState.has(tileKey)) continue;`), reached here by a GENUINE terminal
// (`ProducerFailed`) rather than by `relinquishFill`'s own cancel. The re-reviewer's own trace:
// nothing marks anything partial, `trackedTileCount` hits 0, and S2's own
// `if (manager.trackedTileCount === 0) emitResidencyStatus();` (`onTerminal`, this module's manager
// construction) would emit `candidate-within-budget`/`settled: "complete"` over a viewport whose
// covering tile A never even finished -- the twice-convicted "Showing all N" class (BS6).
//
// Piece 2(ii) (residency-debt cut 1b, entry 36) REPLACES B1's own mechanism (a blunt, unconditional
// `hasPlanned = false` on any non-`Completed` terminal, which made this emit NOTHING) with typed
// partiality accounting -- the invariant this describe block's own name states ("never reads
// settled-complete") is unchanged and re-proven below; only the mechanism (and the test's own
// assertions of it) moved from silence to an honest `settled: "partial-failure"` emission.
describe("B1: a non-Completed terminal for a tile skipped-as-tracked across two plans never reads settled-complete (structural latch via manager.onTerminal)", () => {
  beforeEach(() => {
    viewportQueryMock.mockReset().mockResolvedValue({ stream: "sh_1" });
    cancelMock.mockReset().mockResolvedValue({ state: "requested" });
    dataPlaneAttachMock.mockReset().mockResolvedValue({ url: "ws://127.0.0.1:1/stream", subprotocols: ["spatial-dp.v0", "tok.x"] });
    startStreamMock.mockReset().mockReturnValue({ cancel: vi.fn(), stats: { reassemblyCopies: 0, jsonFramesSeen: 0 } });
  });

  /** Same helper as M2's own describe block above, redeclared per-describe-block per this file's own
   * existing convention (`tileViewportStreamManager.test.ts`'s identical pattern, this file's own
   * `sinkForHandle` at several other describe blocks). */
  function sinkForHandle(handle: string): StreamSink {
    const call = startStreamMock.mock.calls.find((c) => c[0].ticketHandle === handle);
    if (!call) throw new Error(`no stream started for handle ${handle}`);
    return call[0].sink as StreamSink;
  }

  it("plan1 issues A+B; B completes untrimmed; plan2 (same covering set) reads B alreadyResident and skips A as already-tracked; A then terminates ProducerFailed (trackedTileCount -> 0) -- NO candidate-within-budget emission, no settled field anywhere, isFillComplete() false; a fresh plan re-admits A, it completes -- settled-complete re-earned", async () => {
    vi.useFakeTimers();
    try {
      const completeTileKeys = new Set<string>();
      const canvas = fakeCanvas({
        pushTileBatch: vi.fn(() => ({ ...OK_INGEST, fitAnchor: { xmin: 0, ymin: 0, xmax: 0, ymax: 0 } })),
        getResidentCounts: vi.fn(() => ({ totalResidentVertices: 20, totalResidentFeatures: 2 })),
        isTileResidentInCandidateSet: vi.fn((tileKey: string) => completeTileKeys.has(tileKey)),
        isTileCompleteInCandidateSet: vi.fn((tileKey: string) => completeTileKeys.has(tileKey)),
        markTileComplete: vi.fn((tileKey: string) => completeTileKeys.add(tileKey)),
        markTilePartial: vi.fn((tileKey: string) => completeTileKeys.delete(tileKey)),
      });
      const onResidencyStatusChange = vi.fn();
      const session = startCandidateArmSession({ dataset: "ds_x", canvas, onResidencyStatusChange });
      await session.reissueUnrestricted(null, null);
      lastSink().onBatch(new Uint8Array([1]), true);
      completeUntiledLook();
      expect(session.manager.gridFrame).not.toBeNull();

      // Plan 1: a bbox covering exactly two tiles -- both issued directly (well under
      // MAX_IN_FLIGHT_TILE_STREAMS), the same bbox/shape M2's own repro above uses.
      viewportQueryMock.mockReset();
      viewportQueryMock.mockResolvedValueOnce({ stream: "sh_a" }).mockResolvedValueOnce({ stream: "sh_b" });
      const bbox = { xmin: -1, ymin: -1, xmax: -0.75, ymax: -0.875 };
      session.onViewportChanged(bbox);
      await vi.advanceTimersByTimeAsync(VIEWPORT_QUERY_MIN_INTERVAL_MS);
      expect(session.manager.inFlightCount).toBe(2);

      const covering1 = (canvas.applyTileViewportContext as ReturnType<typeof vi.fn>).mock.calls.at(-1)![0] as string[];
      expect(covering1).toHaveLength(2); // exactly A and B, both freshly issued this plan
      const [tileA, tileB] = covering1;

      // B completes untrimmed, reaching its own natural terminal -- `markTileComplete(B)` fires, and
      // the manager stops tracking B (removed from `tileState`/`inFlightStreams`).
      sinkForHandle("sh_b").onBatch(new Uint8Array([2]), true);
      sinkForHandle("sh_b").onTerminal({ kind: "Completed", detail: "" });
      expect(completeTileKeys.has(tileB)).toBe(true);
      expect(session.manager.trackedTileCount).toBe(1); // only A remains tracked

      // Plan 2: the SAME covering set. B is genuinely `alreadyResident` (complete); A is still
      // tracked ("in-flight") from plan 1 -- the manager's own new-candidate loop skips it entirely
      // (neither re-issued, re-queued, nor added to `alreadyResident`), so it is silently absent from
      // THIS plan's own covering set.
      viewportQueryMock.mockReset().mockImplementation(() => new Promise(() => {}));
      onResidencyStatusChange.mockClear();
      session.onViewportChanged(bbox);
      await vi.advanceTimersByTimeAsync(VIEWPORT_QUERY_MIN_INTERVAL_MS);

      const covering2 = (canvas.applyTileViewportContext as ReturnType<typeof vi.fn>).mock.calls.at(-1)![0] as string[];
      expect(covering2).toEqual([tileB]); // A silently missing -- the same footprint M2's own repro has
      expect(session.manager.trackedTileCount).toBe(1); // A is still genuinely outstanding right now

      // THE TRACE: A terminates for real -- `ProducerFailed`, never a self-cancel (never routed
      // through `selfCancelledHandles`, `tileViewportStreamManager.ts`) -- reaching `manager.onTerminal`
      // genuinely, dropping `trackedTileCount` to 0 with plan 2's own `lastCoveringTileKeys` never
      // having named A at all.
      onResidencyStatusChange.mockClear();
      sinkForHandle("sh_a").onTerminal({ kind: "ProducerFailed", detail: "engine.stream_failed" });
      expect(session.manager.trackedTileCount).toBe(0);

      // THE FIX, Piece 2(ii) (residency-debt cut 1b, entry 36) -- MECHANISM CHANGED, invariant kept.
      // B1's own ORIGINAL fix (`hasPlanned = false` on any non-`Completed` terminal) made this emit
      // NOTHING at all, the honest-but-silent "absence" reading. Entry 36 replaced that blunt latch with
      // typed accounting (`failedCoveringTerminals`, `isFillComplete()`'s own new check) -- `hasPlanned`
      // is no longer touched by a terminal, so `settledState`'s own structural `isSettled` check now
      // reads `true` here (nothing tracked, no pending re-plan, the untiled stream long since
      // terminated), and the typed failure record makes the classification `"settled-partial-failure"`
      // rather than silence: entry 36's own ruling, "silence and staleness never represent state." THE
      // BEHAVIORAL INVARIANT B1 proved is unchanged and re-asserted below: no "Showing all N" (never
      // `settled: "complete"`) after a failed carried-over terminal -- only the MECHANISM (a single,
      // honest, typed emission instead of total silence) differs.
      expect(onResidencyStatusChange).toHaveBeenCalledTimes(1);
      expect(onResidencyStatusChange).toHaveBeenCalledWith({
        kind: "candidate-within-budget",
        residentFeatureCount: 2,
        settled: "partial-failure",
      });
      for (const call of onResidencyStatusChange.mock.calls) {
        const event = call[0] as { kind?: string; settled?: unknown };
        // The twice-convicted false claim B1 exists to prevent: never "complete", regardless of the
        // mechanism that got here.
        expect(event.settled).not.toBe("complete");
      }
      expect(session.isFillComplete()).toBe(false);

      // Completeness can be earned again: a fresh plan re-requests A (no longer tracked -- its failed
      // stream was removed from the manager's own tracking, so it is a genuinely new candidate again),
      // it completes untrimmed, and a FOLLOWING plan over the same covering set reads the fill
      // complete again, honestly -- the same re-earning shape M2's own repro proves for the
      // relinquish path.
      viewportQueryMock.mockReset().mockResolvedValueOnce({ stream: "sh_a2" });
      session.onViewportChanged(bbox);
      await vi.advanceTimersByTimeAsync(VIEWPORT_QUERY_MIN_INTERVAL_MS);
      expect(session.isFillComplete()).toBe(false); // A is issuing/in-flight again -- genuinely mid-fill

      sinkForHandle("sh_a2").onBatch(new Uint8Array([3]), true);
      sinkForHandle("sh_a2").onTerminal({ kind: "Completed", detail: "" });
      expect(completeTileKeys.has(tileA)).toBe(true);

      onResidencyStatusChange.mockClear();
      viewportQueryMock.mockReset().mockImplementation(() => new Promise(() => {}));
      session.onViewportChanged(bbox);
      await vi.advanceTimersByTimeAsync(VIEWPORT_QUERY_MIN_INTERVAL_MS);

      expect(session.isFillComplete()).toBe(true);
      // Item B: completeness re-earned by a fresh plan, with no viewport change left pending -- settled
      // AND complete.
      expect(onResidencyStatusChange).toHaveBeenCalledWith({
        kind: "candidate-within-budget",
        residentFeatureCount: 2,
        settled: "complete",
      });
    } finally {
      vi.useRealTimers();
    }
  });
});

// Architect re-verification, viewport-residency cut P6b, item 2b: the two-terminal distinction --
// `INITIAL_TILE_KEY`'s own ingest must be marked durably partial by construction whenever the untiled
// first look's own terminal was actually the row limit (`UNTILED_FIRST_LOOK_ROW_LIMIT`), and left
// unmarked when the stream genuinely completed under it.
describe("INITIAL_TILE_KEY's own two-terminal bootstrap marking (P6b item 2b)", () => {
  beforeEach(() => {
    viewportQueryMock.mockReset().mockResolvedValue({ stream: "sh_1" });
    cancelMock.mockReset().mockResolvedValue({ state: "requested" });
    dataPlaneAttachMock.mockReset().mockResolvedValue({ url: "ws://127.0.0.1:1/stream", subprotocols: ["spatial-dp.v0", "tok.x"] });
    startStreamMock.mockReset().mockReturnValue({ cancel: vi.fn(), stats: { reassemblyCopies: 0, jsonFramesSeen: 0 } });
  });

  it("marks INITIAL_TILE_KEY durably partial when the untiled first look delivered >= UNTILED_FIRST_LOOK_ROW_LIMIT rows -- the row limit, not a natural end, terminated it", async () => {
    const canvas = fakeCanvas({
      pushTileBatch: vi.fn(() => ({
        ...OK_INGEST,
        rowsAdmitted: UNTILED_FIRST_LOOK_ROW_LIMIT,
        fitAnchor: { xmin: 0, ymin: 0, xmax: 0, ymax: 0 },
      })),
    });
    const session = startCandidateArmSession({ dataset: "ds_x", canvas });
    await session.reissueUnrestricted(null, null);
    lastSink().onBatch(new Uint8Array([1]), true);
    completeUntiledLook();

    expect(canvas.markTilePartial).toHaveBeenCalledWith(INITIAL_TILE_KEY);
  });

  it("leaves INITIAL_TILE_KEY unmarked when the untiled first look completed genuinely, under the limit", async () => {
    const canvas = fakeCanvas({
      pushTileBatch: vi.fn(() => ({
        ...OK_INGEST,
        rowsAdmitted: 1, // well under UNTILED_FIRST_LOOK_ROW_LIMIT -- a genuinely small dataset
        fitAnchor: { xmin: 0, ymin: 0, xmax: 0, ymax: 0 },
      })),
    });
    const session = startCandidateArmSession({ dataset: "ds_x", canvas });
    await session.reissueUnrestricted(null, null);
    lastSink().onBatch(new Uint8Array([1]), true);
    completeUntiledLook();

    expect(canvas.markTilePartial).not.toHaveBeenCalled();
  });
});

// Architect re-verification, viewport-residency cut P6b, item 7: `hasHeadroom` tightened to a
// DECLARED margin (`HEADROOM_REFETCH_FRACTION = 0.9`) below `MAX_RESIDENT_VERTICES`, not merely
// "any room at all" under the hard ceiling -- proven here through the one seam that reads it,
// planning's own drain-stop exception (`TileViewportStreamManager.onCameraChange`'s own
// `headroomDespiteOverBudget`), by driving a real tile into an over-budget self-cancel and then
// re-planning while resident vertices sit on either side of the declared margin.
describe("hasHeadroom tightened to a declared 0.9 margin (P6b item 7)", () => {
  beforeEach(() => {
    viewportQueryMock.mockReset().mockResolvedValue({ stream: "sh_1" });
    cancelMock.mockReset().mockResolvedValue({ state: "requested" });
    dataPlaneAttachMock.mockReset().mockResolvedValue({ url: "ws://127.0.0.1:1/stream", subprotocols: ["spatial-dp.v0", "tok.x"] });
    startStreamMock.mockReset().mockReturnValue({ cancel: vi.fn(), stats: { reassemblyCopies: 0, jsonFramesSeen: 0 } });
  });

  // With this suite's own `{xmin:0,ymin:0,xmax:0,ymax:0}` fitAnchor (a degenerate, zero-span batch),
  // `deriveTileGridFrame` (`tileGrid.ts`) derives origin (-1,-1), `baseSpan` 2 (`MIN_ANCHOR_SPAN` x
  // `PAD_FACTOR`) -- at the default "medium" (16x16) level, one cell is 2/16 = 0.125 wide. This bbox
  // covers EXACTLY the 2x2 = 4 cells starting at cell (0,0), a small, non-truncated covering set
  // (well under `MAX_QUEUED_TILES`) so the test's own tile bookkeeping stays exactly traceable.
  const SMALL_COVERING_BBOX = { xmin: -1, ymin: -1, xmax: -0.75, ymax: -0.75 };

  /** Arms a session into a genuine `manager.overBudget === true` state (a real tile issued, then its
   * own batch reports overBudget, self-cancelling it) with `getResidentCounts` fixed at
   * `residentVertices` for the whole test -- returns `viewportQueryMock`, cleared right before the
   * SECOND (headroom-gated) camera-change plan, so the caller's own assertion measures only that
   * re-plan's own tile issuance. */
  async function armOverBudgetThenReplan(residentVertices: number): Promise<ReturnType<typeof vi.fn>> {
    const canvas = fakeCanvas({
      pushTileBatch: vi
        .fn()
        .mockReturnValueOnce({ ...OK_INGEST, fitAnchor: { xmin: 0, ymin: 0, xmax: 0, ymax: 0 } }) // the untiled bootstrap batch
        .mockReturnValue({ ...OK_INGEST, overBudget: true, fitAnchor: { xmin: 0, ymin: 0, xmax: 0, ymax: 0 } }), // the real tile's own batch
      getResidentCounts: vi.fn(() => ({ totalResidentVertices: residentVertices, totalResidentFeatures: 1 })),
      applyTileViewportContext: vi.fn(() => false), // stays over budget after the re-check
    });
    const session = startCandidateArmSession({ dataset: "ds_x", canvas });
    await session.reissueUnrestricted(null, null);
    lastSink().onBatch(new Uint8Array([1]), true);
    completeUntiledLook();

    viewportQueryMock.mockClear();
    viewportQueryMock.mockResolvedValue({ stream: "sh_tile_1" });
    session.onViewportChanged(SMALL_COVERING_BBOX); // plans the 4-tile covering set -- 3 issued, 1 queued
    await vi.advanceTimersByTimeAsync(VIEWPORT_QUERY_MIN_INTERVAL_MS);
    const tileSink = lastSink();
    tileSink.onBatch(new Uint8Array([2]), true); // one issued tile reports overBudget -- self-cancels, sets manager.overBudget
    await Promise.resolve();
    expect(session.manager.overBudget).toBe(true);

    viewportQueryMock.mockClear();
    viewportQueryMock.mockResolvedValue({ stream: "sh_tile_2" });
    session.onViewportChanged(SMALL_COVERING_BBOX); // re-plan, same covering set -- the cancelled tile is the ONE new candidate
    await vi.advanceTimersByTimeAsync(VIEWPORT_QUERY_MIN_INTERVAL_MS);
    return viewportQueryMock;
  }

  it("re-requests the partial tile when resident vertices sit below the 0.9 margin", async () => {
    vi.useFakeTimers();
    try {
      const q = await armOverBudgetThenReplan(Math.floor(MAX_RESIDENT_VERTICES * 0.9) - 1000);
      expect(q).toHaveBeenCalled();
    } finally {
      vi.useRealTimers();
    }
  });

  it("refuses to re-request once resident vertices reach the 0.9 margin, even though MAX_RESIDENT_VERTICES itself is not yet exceeded", async () => {
    vi.useFakeTimers();
    try {
      const q = await armOverBudgetThenReplan(Math.floor(MAX_RESIDENT_VERTICES * 0.9));
      expect(q).not.toHaveBeenCalled();
    } finally {
      vi.useRealTimers();
    }
  });

  // Viewport-residency cut P6d (the code re-verification's own blocker, the sticky-partial exit).
  // Before this piece, `TileEntry.partial` (`tileResidentSet.ts`) cleared ONLY via evict-and-
  // re-ingest -- but a covering (current-viewport) tile is eviction-protected by absolute rule
  // (`TileResidentSet.evictTile`'s own top-of-function guard), so a trimmed, still-covered tile could
  // never reach that reset: trim -> partial -> headroom opens -> refetch admits every row -> `partial`
  // NEVER CLEARS -> permanently over-budget, `isFillComplete` false forever, the same tile's stream
  // re-issued every camera change and deduped to nothing. This test walks the full lifecycle the fix
  // (per-tile refetch-generation tracking, `candidateArmSession.ts`'s own `tileGenerationUntrimmed`)
  // closes: trim -> partial -> headroom -> refetch (untrimmed, `Completed`) -> complete, IN PLACE,
  // never evicted -- `isFillComplete` reads true again, and the next camera change over the SAME
  // covering set never re-issues the tile.
  it("the sticky-partial exit: trim -> partial -> headroom refetch (untrimmed, Completed) -> complete -> isFillComplete true -> no further re-issue", async () => {
    // A single-cell bbox, entirely inside cell (0,0) at this suite's own established grid (see this
    // describe block's own top doc comment: origin (-1,-1), baseSpan 2, 0.125-wide cells at the
    // default level) -- exactly ONE tile is ever in play, so every assertion below is traceable to
    // that one tile key without any covering-set bookkeeping of its own.
    const ONE_TILE_BBOX = { xmin: -1, ymin: -1, xmax: -0.95, ymax: -0.95 };

    // A minimal stand-in for `TileResidentSet`'s own completeness bookkeeping -- just enough to
    // observe the REAL production wiring under test (`candidateArmSession.ts`'s own per-tile
    // generation tracking, and its calls to `markTilePartial`/`markTileComplete`) actually drive a
    // tile from incomplete to complete, in place, rather than asserting on call arguments alone.
    const completeTileKeys = new Set<string>();
    const canvas = fakeCanvas({
      pushTileBatch: vi
        .fn()
        .mockReturnValueOnce({ ...OK_INGEST, fitAnchor: { xmin: 0, ymin: 0, xmax: 0, ymax: 0 } }) // untiled bootstrap
        .mockReturnValueOnce({ ...OK_INGEST, overBudget: true, fitAnchor: { xmin: 0, ymin: 0, xmax: 0, ymax: 0 } }) // trim
        .mockReturnValue({ ...OK_INGEST, fitAnchor: { xmin: 0, ymin: 0, xmax: 0, ymax: 0 } }), // the refetch -- untrimmed
      // Headroom: comfortably below the declared 0.9 margin (`HEADROOM_REFETCH_FRACTION`) the whole way.
      getResidentCounts: vi.fn(() => ({ totalResidentVertices: 100, totalResidentFeatures: 1 })),
      isTileResidentInCandidateSet: vi.fn((tileKey: string) => completeTileKeys.has(tileKey)),
      isTileCompleteInCandidateSet: vi.fn((tileKey: string) => completeTileKeys.has(tileKey)),
      markTilePartial: vi.fn((tileKey: string) => completeTileKeys.delete(tileKey)),
      markTileComplete: vi.fn((tileKey: string) => completeTileKeys.add(tileKey)),
    });
    const onResidencyStatusChange = vi.fn();
    const session = startCandidateArmSession({ dataset: "ds_x", canvas, onResidencyStatusChange });

    await session.reissueUnrestricted(null, null);
    lastSink().onBatch(new Uint8Array([1]), true);
    completeUntiledLook();
    expect(session.manager.gridFrame).not.toBeNull();

    // 1) First plan: the tile is genuinely new -- issued.
    viewportQueryMock.mockClear();
    viewportQueryMock.mockResolvedValueOnce({ stream: "sh_tile_1" });
    vi.useFakeTimers();
    try {
      session.onViewportChanged(ONE_TILE_BBOX);
      await vi.advanceTimersByTimeAsync(VIEWPORT_QUERY_MIN_INTERVAL_MS);
    } finally {
      vi.useRealTimers();
    }
    expect(viewportQueryMock).toHaveBeenCalledTimes(1);
    const tileSink1 = lastSink();

    // 2) Trim: the batch reports overBudget -- the manager self-cancels this tile's own stream and
    // marks it partial (kept, never blanked).
    cancelMock.mockClear();
    tileSink1.onBatch(new Uint8Array([2]), true);
    await Promise.resolve(); // the self-cancel's own synchronous path settles

    const [tileKey] = (canvas.pushTileBatch as ReturnType<typeof vi.fn>).mock.calls.at(-1)!;
    expect(cancelMock).toHaveBeenCalledWith("sh_tile_1");
    expect(canvas.markTilePartial).toHaveBeenCalledWith(tileKey);
    expect(completeTileKeys.has(tileKey)).toBe(false); // durably partial
    expect(session.manager.overBudget).toBe(true);

    // 3) Headroom: a later camera-change re-plans the SAME covering set. The tile reads
    // `isTileCompleteInCandidateSet === false` (still partial), so it is a fresh candidate again;
    // the over-budget drain-stop exception lets it through because resident vertices sit well under
    // the declared 0.9 margin -- a genuine refetch, a NEW stream handle.
    viewportQueryMock.mockClear();
    viewportQueryMock.mockResolvedValueOnce({ stream: "sh_tile_2" });
    vi.useFakeTimers();
    try {
      session.onViewportChanged(ONE_TILE_BBOX);
      await vi.advanceTimersByTimeAsync(VIEWPORT_QUERY_MIN_INTERVAL_MS);
    } finally {
      vi.useRealTimers();
    }
    expect(viewportQueryMock).toHaveBeenCalledTimes(1); // exactly one refetch, the same one tile
    const tileSink2 = lastSink();

    // 4) Refetch: everything the tile's bbox holds arrives untrimmed this time, and the stream
    // reaches its own natural end -- the caller's own proof that this generation is genuinely whole.
    tileSink2.onBatch(new Uint8Array([3]), true);
    tileSink2.onTerminal({ kind: "Completed", detail: "" });

    expect(canvas.markTileComplete).toHaveBeenCalledWith(tileKey);
    expect(completeTileKeys.has(tileKey)).toBe(true); // complete again, IN PLACE -- never evicted

    // 5) No further re-issue: the next camera-change over the SAME covering set reads the tile as
    // already complete and does not reissue it -- and the status machine agrees the fill is now
    // genuinely complete (`isFillComplete()`'s own internal truth, observed via the event it gates).
    viewportQueryMock.mockClear();
    onResidencyStatusChange.mockClear();
    vi.useFakeTimers();
    try {
      session.onViewportChanged(ONE_TILE_BBOX);
      await vi.advanceTimersByTimeAsync(VIEWPORT_QUERY_MIN_INTERVAL_MS);
    } finally {
      vi.useRealTimers();
    }
    expect(viewportQueryMock).not.toHaveBeenCalled(); // no re-issue -- already complete
    // Item B: settled AND complete -- the covering set is genuinely whole, and no viewport change is
    // pending.
    expect(onResidencyStatusChange).toHaveBeenCalledWith({
      kind: "candidate-within-budget",
      residentFeatureCount: 1,
      settled: "complete",
    });
  });
});

// Item B (residency-debt cut 1b, RESIDENCY-DEBT-1B.md): the settled-partial signal's own session-level
// wiring (`emitResidencyStatus`'s own `settledState(...)` call, `candidateArmSession.ts`) -- the pure
// predicate itself is unit-tested directly against its four inputs in `residencyStatus.test.ts`; this
// describe block drives the REAL session+manager through the preregistration's own pre-committed
// scenarios using this file's existing test fakes, per this piece's own BUILD instructions.
describe("Item B: the settled-partial signal (RESIDENCY-DEBT-1B.md, BS5/BS6)", () => {
  beforeEach(() => {
    viewportQueryMock.mockReset().mockResolvedValue({ stream: "sh_1" });
    cancelMock.mockReset().mockResolvedValue({ state: "requested" });
    dataPlaneAttachMock.mockReset().mockResolvedValue({ url: "ws://127.0.0.1:1/stream", subprotocols: ["spatial-dp.v0", "tok.x"] });
    startStreamMock.mockReset().mockReturnValue({ cancel: vi.fn(), stats: { reassemblyCopies: 0, jsonFramesSeen: 0 } });
  });

  /** Finds the `StreamSink` `startStream` was called with for a SPECIFIC stream handle -- the same
   * helper the M2 describe block above already defines for its own two-concurrent-streams repro
   * (duplicated here rather than hoisted, to keep this describe block self-contained). */
  function sinkForHandle(handle: string): StreamSink {
    const call = startStreamMock.mock.calls.find((c) => c[0].ticketHandle === handle);
    if (!call) throw new Error(`no stream started for handle ${handle}`);
    return call[0].sink as StreamSink;
  }

  // The SAME small, deterministic 2x2 covering set (4 tiles) this file's own "hasHeadroom tightened..."
  // describe block already establishes against the SAME `{xmin:0,...}` bootstrap fitAnchor: origin
  // (-1,-1), baseSpan 2, 0.125-wide cells at the default "medium" level -- 3 of the 4 covering tiles
  // issue directly (`MAX_IN_FLIGHT_TILE_STREAMS`), the 4th queues.
  const SMALL_COVERING_BBOX = { xmin: -1, ymin: -1, xmax: -0.75, ymax: -0.75 };

  // The preregistration's own pre-committed test case, paraphrased (not quoted) here: over-budget with
  // a durably-partial covering tile plus queued work is not settled; the Amendment-1 reopening chain
  // (a durably-partial, currently-untracked covering tile becomes a fresh candidate again and is
  // re-admitted through the headroom-gated exception) is STILL not settled while that tile is tracked
  // again; only once every covering tile has reached a terminal state does the session read settled,
  // classified settled-partial because the viewport is still over budget. Amendment 1's own vertex-
  // freeing eviction mechanism itself lives in canvas-side code (`tileResidentSet.ts`/
  // `WorkingCanvas.tsx`), out of this session-level test's own scope -- headroom is modeled as already
  // available throughout (a constant, comfortably-low `totalResidentVertices`), the same seam the
  // "hasHeadroom tightened..." describe block's own tests already exercise directly.
  it("the reopening case: not settled while over-budget with a partial covering tile + queued work; still not settled through the headroom-gated reopen; settled and classified settled-partial only once everything terminates", async () => {
    vi.useFakeTimers();
    try {
      const completeTileKeys = new Set<string>();
      const canvas = fakeCanvas({
        getResidentCounts: vi.fn(() => ({ totalResidentVertices: 10, totalResidentFeatures: 5 })),
        applyTileViewportContext: vi.fn(() => false), // stays over budget after every re-check, until noted otherwise
        isTileResidentInCandidateSet: vi.fn((tileKey: string) => completeTileKeys.has(tileKey)),
        isTileCompleteInCandidateSet: vi.fn((tileKey: string) => completeTileKeys.has(tileKey)),
        markTileComplete: vi.fn((tileKey: string) => completeTileKeys.add(tileKey)),
        markTilePartial: vi.fn((tileKey: string) => completeTileKeys.delete(tileKey)),
      });
      const onResidencyStatusChange = vi.fn();
      const session = startCandidateArmSession({ dataset: "ds_x", canvas, onResidencyStatusChange });

      // Bootstrap: establishes the frame. Untrimmed -- never affects `manager.overBudget`.
      const pushTileBatch = canvas.pushTileBatch as ReturnType<typeof vi.fn>;
      pushTileBatch.mockReturnValueOnce({ ...OK_INGEST, fitAnchor: { xmin: 0, ymin: 0, xmax: 0, ymax: 0 } }); // bootstrap
      await session.reissueUnrestricted(null, null);
      lastSink().onBatch(new Uint8Array([1]), true);
      completeUntiledLook();
      expect(session.manager.gridFrame).not.toBeNull();

      // Plan 1: 4 covering tiles -- 3 issued (A, B, C), 1 queued (D).
      viewportQueryMock.mockReset();
      viewportQueryMock
        .mockResolvedValueOnce({ stream: "sh_a" })
        .mockResolvedValueOnce({ stream: "sh_b" })
        .mockResolvedValueOnce({ stream: "sh_c" });
      session.onViewportChanged(SMALL_COVERING_BBOX);
      await vi.advanceTimersByTimeAsync(VIEWPORT_QUERY_MIN_INTERVAL_MS);
      expect(session.manager.inFlightCount).toBe(3);
      expect(session.manager.queuedCount).toBe(1);
      const covering1 = (canvas.applyTileViewportContext as ReturnType<typeof vi.fn>).mock.calls.at(-1)![0] as string[];
      expect(covering1).toHaveLength(4);
      const [tileA] = covering1;

      // A's own batch trims (overBudget) -- self-cancels, marked durably partial, untracked.
      onResidencyStatusChange.mockClear();
      pushTileBatch.mockReturnValueOnce({ ...OK_INGEST, overBudget: true, fitAnchor: { xmin: 0, ymin: 0, xmax: 0, ymax: 0 } }); // A trims
      sinkForHandle("sh_a").onBatch(new Uint8Array([2]), true);
      await Promise.resolve(); // the self-cancel's own synchronous path settles
      expect(session.manager.overBudget).toBe(true);
      expect(completeTileKeys.has(tileA)).toBe(false);

      // CHECKPOINT 1 (the preregistration's own first clause): over-budget, a durably-partial covering
      // tile (A, now untracked), AND queued work (D) still outstanding -- `trackedTileCount > 0`, so
      // this is never settled: the emitted event carries no `settled` field at all (BS5: "never
      // declared while `trackedTileCount > 0` or a re-plan is pending").
      expect(session.manager.trackedTileCount).toBeGreaterThan(0); // B, C in flight; D still queued
      const afterTrim = onResidencyStatusChange.mock.calls.at(-1)![0] as { kind: string; settled?: unknown };
      expect(afterTrim.kind).toBe("candidate-over-budget");
      expect(afterTrim.settled).toBeUndefined();

      // The reopening case itself: A (untracked, durably partial) becomes a genuinely NEW candidate on
      // the next plan and is re-admitted through the headroom-gated exception (`onCameraChange`'s own
      // `headroomDespiteOverBudget`) while `overBudgetFlag` is STILL `true`.
      onResidencyStatusChange.mockClear();
      viewportQueryMock.mockReset().mockResolvedValueOnce({ stream: "sh_a2" });
      session.onViewportChanged(SMALL_COVERING_BBOX);
      await vi.advanceTimersByTimeAsync(VIEWPORT_QUERY_MIN_INTERVAL_MS);

      // CHECKPOINT 2 (BS5's own Amendment-1 clause): the reopening exception re-admitted A while D is
      // STILL queued (draining stays refused while `overBudgetFlag` holds) -- `trackedTileCount` is
      // STILL `> 0` (B, C, A-reissued in flight; D queued): still never settled. No event recorded
      // during this reopening carries a `settled` field.
      expect(session.manager.trackedTileCount).toBeGreaterThan(0);
      expect(session.manager.queuedCount).toBeGreaterThan(0); // D untouched -- the queue never drains while over budget
      expect(onResidencyStatusChange.mock.calls.length).toBeGreaterThan(0);
      for (const call of onResidencyStatusChange.mock.calls) {
        expect((call[0] as { settled?: unknown }).settled).toBeUndefined();
      }

      // A's reissued stream, B, and C all complete cleanly (untrimmed, `Completed`) -- each becomes
      // resident/complete, removed from `manager.trackedTileCount`.
      pushTileBatch.mockReturnValueOnce({ ...OK_INGEST, fitAnchor: { xmin: 0, ymin: 0, xmax: 0, ymax: 0 } }); // A's reopened batch, untrimmed
      sinkForHandle("sh_a2").onBatch(new Uint8Array([3]), true);
      sinkForHandle("sh_a2").onTerminal({ kind: "Completed", detail: "" });
      expect(completeTileKeys.has(tileA)).toBe(true);
      pushTileBatch.mockReturnValueOnce({ ...OK_INGEST, fitAnchor: { xmin: 0, ymin: 0, xmax: 0, ymax: 0 } }); // B, untrimmed
      sinkForHandle("sh_b").onBatch(new Uint8Array([4]), true);
      sinkForHandle("sh_b").onTerminal({ kind: "Completed", detail: "" });
      pushTileBatch.mockReturnValueOnce({ ...OK_INGEST, fitAnchor: { xmin: 0, ymin: 0, xmax: 0, ymax: 0 } }); // C, untrimmed
      sinkForHandle("sh_c").onBatch(new Uint8Array([5]), true);
      sinkForHandle("sh_c").onTerminal({ kind: "Completed", detail: "" });
      expect(session.manager.trackedTileCount).toBe(session.manager.queuedCount); // only D remains, still queued
      expect(session.manager.queuedCount).toBeGreaterThan(0);
      expect(session.manager.overBudget).toBe(true); // never cleared by ingest alone -- only a fit re-check clears it

      // A third plan finally reports fit (A, B, C are all `alreadyResident` now -- no new candidates) --
      // clears `overBudgetFlag`, which drains D into flight for the first time.
      (canvas.applyTileViewportContext as ReturnType<typeof vi.fn>).mockReturnValueOnce(true);
      viewportQueryMock.mockReset().mockResolvedValueOnce({ stream: "sh_d" });
      session.onViewportChanged(SMALL_COVERING_BBOX);
      await vi.advanceTimersByTimeAsync(VIEWPORT_QUERY_MIN_INTERVAL_MS);
      expect(session.manager.overBudget).toBe(false);
      expect(session.manager.trackedTileCount).toBe(1); // D now in flight -- still tracked, never settled here either

      // D's own batch ALSO reports overBudget (the terminal state: still cannot fit) -- self-cancels,
      // durably partial, untracked. `trackedTileCount` finally reaches 0.
      onResidencyStatusChange.mockClear();
      pushTileBatch.mockReturnValueOnce({ ...OK_INGEST, overBudget: true, fitAnchor: { xmin: 0, ymin: 0, xmax: 0, ymax: 0 } }); // D trims
      sinkForHandle("sh_d").onBatch(new Uint8Array([6]), true);
      await Promise.resolve();

      // CHECKPOINT 3 (the settled reading): everything has terminated (nothing tracked), no viewport
      // change is pending, a real plan has run -- settled, and classified settled-partial (BS6: the
      // viewport is still over budget -- no completeness claim over this partial set; `viewportTotal`
      // stays `null`).
      expect(session.manager.trackedTileCount).toBe(0);
      expect(session.manager.overBudget).toBe(true);
      expect(onResidencyStatusChange).toHaveBeenCalledWith({
        kind: "candidate-over-budget",
        residentFeatureCount: 5,
        viewportTotal: null,
        settled: "partial",
      });
    } finally {
      vi.useRealTimers();
    }
  });

  // BUILD test 2: the Amendment-1 clause, driven directly (not merely as a side effect of the larger
  // reopening test above) -- a settled reading is never taken from a state where the partial-covering
  // eviction exception could still fire (that exception only ever runs from WITHIN a live
  // `onCameraChange` admission, which requires the tile to be freshly tracked again --
  // `trackedTileCount > 0` -- before it can complete or trim again). Drives the manager directly
  // (no session/canvas involved) through exactly the reopening admission -- a tile freed by the
  // eviction exception becomes untracked, then a `hasHeadroom`-gated re-plan re-admits it while
  // `overBudgetFlag` still holds -- and asserts `manager.trackedTileCount > 0` throughout that whole
  // admission, the one fact `settledState` (`residencyStatus.ts`) excludes settled on unconditionally.
  it("the Amendment-1 reopening admission itself never reaches trackedTileCount === 0 while in flight", () => {
    const residency = { isTileResident: () => false, hasHeadroom: () => true };
    const onTileSuperseded = vi.fn();
    const manager = new TileViewportStreamManager({
      dataset: "ds_x",
      residency,
      onBatch: vi.fn(),
      onTileSuperseded,
    });
    manager.establishGridFrame({ xmin: 0, ymin: 0, xmax: 0, ymax: 0 });
    const bbox = { xmin: -1, ymin: -1, xmax: -0.95, ymax: -0.95 }; // a single-tile bbox at this frame
    manager.setOverBudget(true, []);

    // The re-plan that performs the reopening admission: a genuinely new (untracked) candidate,
    // over budget, but headroom is available -- `headroomDespiteOverBudget` lets it through.
    const outcome = manager.onCameraChange(bbox, null);
    expect(outcome.kind).toBe("planned");
    if (outcome.kind !== "planned") throw new Error("unreachable");
    // The re-admitted tile is tracked (issuing/in-flight) the INSTANT this call returns -- synchronous,
    // never a later microtask -- which is exactly why `settledState` reading `trackedTileCount` at any
    // point during or immediately after this admission can never see `0` for this tile.
    expect(outcome.issued.length + outcome.queued.length).toBeGreaterThan(0);
    expect(manager.trackedTileCount).toBeGreaterThan(0);
  });

  // BUILD test 3, M1-corrected (reviewer gate, residency-debt cut 1b): `pendingViewportChange` gates
  // the settled-complete reading, even with `trackedTileCount === 0`. `manager.frame` is never reset by
  // `reissueUnrestricted` (its own interface doc, `candidateArmSession.ts:187-189`: "The tile grid
  // FRAME itself is never re-derived") or by `clearAll` (a plain code fact -- `clearAll`'s own doc
  // comment never mentions the frame at all; it simply never touches `this.frame`), so a SECOND generation's real
  // camera-change plan can run against the already-established frame BEFORE that generation's own
  // untiled first-look stream reaches its terminal -- the one production-reachable window where a batch
  // (on that still-open untiled stream, exempt from `manager.trackedTileCount` -- see
  // `ingestAndMaybeEstablishFrame`'s own budget-cancel doc comment and `issueUntiledQuery`'s own
  // `onBatch` doc comment) can trigger `emitResidencyStatus` while `trackedTileCount === 0` AND a
  // debounced re-plan is scheduled but has not yet run.
  //
  // **M1 (reviewer gate, residency-debt cut 1b): this test originally PINNED the false behavior it now
  // proves impossible.** Before M1, gen2's own real plan (below) asserted `settled: "complete"` while
  // `sh_2` (gen2's own untiled first-look/reissue stream) was still open, its own terminal deliberately
  // never fired -- exactly the false-claim class ("filling has stopped"/"Showing all N" while a stream
  // keeps delivering) Item A's own M1 finding convicted. Reworked here: every plan run while `sh_2` is
  // still open now asserts NOT-settled (no `settled` field, no `candidate-within-budget` dispatch at
  // all); only once `sh_2` reaches its own terminal (`completeUntiledLook()`, below) does a subsequent
  // plan honestly read settled again.
  it("a debounced-but-not-yet-run viewport change is never settled, even with trackedTileCount === 0; and NEITHER is a plan run while the untiled stream is still open (M1) -- settled again only once BOTH the debounce fires and the untiled stream reaches its own terminal", async () => {
    vi.useFakeTimers();
    try {
      // Every covering tile always reads resident/complete -- so any real plan's own covering set
      // lands entirely in `alreadyResident`, and `manager.trackedTileCount` is `0` the instant any
      // plan runs, regardless of the bbox.
      const canvas = fakeCanvas({
        pushTileBatch: vi.fn(() => ({ ...OK_INGEST, fitAnchor: { xmin: 0, ymin: 0, xmax: 0, ymax: 0 } })),
        isTileResidentInCandidateSet: vi.fn(() => true),
        isTileCompleteInCandidateSet: vi.fn(() => true),
        getResidentCounts: vi.fn(() => ({ totalResidentVertices: 10, totalResidentFeatures: 9 })),
      });
      const onResidencyStatusChange = vi.fn();
      const session = startCandidateArmSession({ dataset: "ds_x", canvas, onResidencyStatusChange });
      const bbox = { xmin: -10, ymin: -10, xmax: 10, ymax: 10 };

      // Generation 1: bootstrap, then a real plan -- settled-complete, the ordinary case (gen1's own
      // untiled stream is completed via `completeUntiledLook()` below, so M1's own gate never applies
      // here).
      await session.reissueUnrestricted(null, null);
      lastSink().onBatch(new Uint8Array([1]), true);
      completeUntiledLook();
      session.onViewportChanged(bbox);
      await vi.advanceTimersByTimeAsync(VIEWPORT_QUERY_MIN_INTERVAL_MS);
      expect(onResidencyStatusChange).toHaveBeenCalledWith(
        expect.objectContaining({ kind: "candidate-within-budget", settled: "complete" })
      );

      // Generation 2 (Apply/Clear): a NEW untiled first-look stream starts (`sh_2`), deliberately left
      // OPEN (its own terminal is never fired here) -- `manager.frame` is untouched by `clearAll`, so a
      // real camera-change plan can still run against it before this generation's own untiled stream
      // ever reaches its own terminal.
      viewportQueryMock.mockReset().mockResolvedValueOnce({ stream: "sh_2" });
      await session.reissueUnrestricted(null, null);

      // Gen2's own real plan runs (against the already-established frame) -- M1: NOT settled here.
      // `sh_2` is still open, so the ordinary "Showing all N" claim would be false while it keeps
      // delivering batches into this same view (this event's own within-budget gate,
      // `settled !== "settled-complete"`, returns without dispatching anything at all -- "absence is
      // honest," this function's own pre-existing doc comment).
      onResidencyStatusChange.mockClear();
      session.onViewportChanged(bbox);
      await vi.advanceTimersByTimeAsync(VIEWPORT_QUERY_MIN_INTERVAL_MS);
      // Nit (reviewer gate, residency-debt cut 1b): `not.toHaveBeenCalled()` alone already subsumes the
      // narrower `not.toHaveBeenCalledWith(objectContaining({kind:"candidate-within-budget"}))` this
      // used to also assert -- if the mock was never called AT ALL, it was trivially never called with
      // that shape either.
      expect(onResidencyStatusChange).not.toHaveBeenCalled();

      // A NEW viewport change is accepted for debouncing -- `pendingViewportChange` is now `true` --
      // but its debounce has NOT yet fired. DOUBLY not-settled now (`pendingViewportChange` AND M1's
      // own `untiledStreamRunning`, independently).
      session.onViewportChanged({ xmin: -20, ymin: -20, xmax: 20, ymax: 20 });

      // Gen2's own untiled first-look stream, still open, delivers another batch -- WITHOUT the
      // ORIGINAL (pre-M1) fix, `isFillComplete()` alone (never considering `pendingViewportChange`)
      // would let this reach `candidate-within-budget` again, a claim the still-pending re-plan is
      // about to revise. With the fix, `settledState` reads `"not-settled"` here regardless (both
      // `pendingViewportChange` AND `untiledStreamRunning` force it), so this emits NOTHING.
      lastSink().onBatch(new Uint8Array([2]), true);
      expect(onResidencyStatusChange).not.toHaveBeenCalled(); // subsumes the narrower kind-shaped check too

      // M1: complete the untiled look now -- `sh_2` reaches its own terminal, clearing
      // `untiledStreamRunning`. This alone does not itself emit (no `emitResidencyStatus()` call at the
      // untiled stream's own terminal -- S2's own surfacing obligation is scoped to the TILE manager's
      // `onTileSuperseded`/`onTerminal`, not this session-owned stream); `pendingViewportChange` is
      // ALSO still `true` at this exact instant (the debounce has not fired yet either), so even if it
      // did emit, it would still read not-settled. The already-scheduled debounce firing next is the
      // first genuinely honest opportunity to settle.
      completeUntiledLook();
      expect(onResidencyStatusChange).not.toHaveBeenCalled();

      // The debounce fires, the plan completes -- NOW genuinely settled: no re-plan pending, nothing
      // tracked, AND (M1) the untiled stream has also reached its own terminal.
      onResidencyStatusChange.mockClear();
      await vi.advanceTimersByTimeAsync(VIEWPORT_QUERY_MIN_INTERVAL_MS);
      expect(onResidencyStatusChange).toHaveBeenCalledWith(
        expect.objectContaining({ kind: "candidate-within-budget", settled: "complete" })
      );
    } finally {
      vi.useRealTimers();
    }
  });

  // BUILD test 4: a relinquished fill is never settled -- `relinquishFill` resets `hasPlanned` to
  // `false` (Item A's own M2 latch), so the settled predicate's own `isSettled` check reads `false`
  // unconditionally the instant `candidate-relinquished` fires, and stays that way until a NEW
  // camera-change plan runs.
  it("relinquished is never settled: the status stays candidate-relinquished, never settled-partial, until a fresh plan re-earns completeness", async () => {
    vi.useFakeTimers();
    try {
      const completeTileKeys = new Set<string>();
      const canvas = fakeCanvas({
        pushTileBatch: vi.fn(() => ({ ...OK_INGEST, fitAnchor: { xmin: 0, ymin: 0, xmax: 0, ymax: 0 } })),
        getResidentCounts: vi.fn(() => ({ totalResidentVertices: 20, totalResidentFeatures: 2 })),
        isTileResidentInCandidateSet: vi.fn((tileKey: string) => completeTileKeys.has(tileKey)),
        isTileCompleteInCandidateSet: vi.fn((tileKey: string) => completeTileKeys.has(tileKey)),
        markTileComplete: vi.fn((tileKey: string) => completeTileKeys.add(tileKey)),
        markTilePartial: vi.fn((tileKey: string) => completeTileKeys.delete(tileKey)),
      });
      const onResidencyStatusChange = vi.fn();
      const session = startCandidateArmSession({ dataset: "ds_x", canvas, onResidencyStatusChange });
      await session.reissueUnrestricted(null, null);
      lastSink().onBatch(new Uint8Array([1]), true);
      completeUntiledLook();

      // A single-tile bbox -- exactly one tile is ever in play.
      const bbox = { xmin: -1, ymin: -1, xmax: -0.95, ymax: -0.95 };
      viewportQueryMock.mockReset().mockResolvedValueOnce({ stream: "sh_tile_1" });
      session.onViewportChanged(bbox);
      await vi.advanceTimersByTimeAsync(VIEWPORT_QUERY_MIN_INTERVAL_MS);
      expect(session.manager.inFlightCount).toBe(1);

      onResidencyStatusChange.mockClear();
      const summary = session.relinquishFill();
      expect(summary.cancelledInFlight).toHaveLength(1);
      expect(session.manager.trackedTileCount).toBe(0); // the ONLY tracked tile was just relinquished

      // The status stays candidate-relinquished -- never settled-partial, even though
      // `trackedTileCount === 0` right now (`relinquishFill`'s own `hasPlanned = false` latch is what
      // keeps this predicate honest here, not `trackedTileCount`).
      expect(onResidencyStatusChange).toHaveBeenCalledWith({ kind: "candidate-relinquished", residentFeatureCount: 2 });
      expect(onResidencyStatusChange).not.toHaveBeenCalledWith(expect.objectContaining({ kind: "candidate-within-budget" }));
      expect(onResidencyStatusChange).not.toHaveBeenCalledWith(expect.objectContaining({ kind: "candidate-over-budget" }));

      // No NEW plan has run yet -- a further pan/zoom is what would be needed for completeness to be
      // earned again (verified below); nothing further to assert until then.

      // A fresh plan re-requests the relinquished tile (untracked, durably partial -- a genuinely new
      // candidate) and completes it untrimmed -- never settled-partial, and never emitted while
      // relinquished.
      viewportQueryMock.mockReset().mockResolvedValueOnce({ stream: "sh_tile_2" });
      onResidencyStatusChange.mockClear();
      session.onViewportChanged(bbox);
      await vi.advanceTimersByTimeAsync(VIEWPORT_QUERY_MIN_INTERVAL_MS);
      expect(session.manager.inFlightCount).toBe(1); // the relinquished tile, genuinely re-tracked
      const [tileKey] = (canvas.applyTileViewportContext as ReturnType<typeof vi.fn>).mock.calls.at(-1)![0] as string[];
      sinkForHandle("sh_tile_2").onBatch(new Uint8Array([2]), true);

      // S2 (reviewer gate, residency-debt cut 1b): rework -- this used to require a FOLLOWING plan over
      // the same covering set to observe the settled-complete reading (the signal waited for the next
      // batch/camera-change to become visible). It no longer does: this tile's own terminal is the LAST
      // in-flight one (nothing else queued, no untiled stream running), so its own `onTerminal` callback
      // (this module's own manager construction, S2's "the settling moment itself" now-emits addition) fires
      // the settled-complete transition directly, with NO following plan anywhere in this test.
      onResidencyStatusChange.mockClear();
      sinkForHandle("sh_tile_2").onTerminal({ kind: "Completed", detail: "" });
      expect(completeTileKeys.has(tileKey)).toBe(true);
      expect(onResidencyStatusChange).toHaveBeenCalledWith({
        kind: "candidate-within-budget",
        residentFeatureCount: 2,
        settled: "complete",
      });
    } finally {
      vi.useRealTimers();
    }
  });

  // BUILD test 5: stalled and settled are mutually exclusive, at the session level -- reusing this
  // file's own pre-existing "stalled" scenario (Item A) unmodified in shape, adding only the `settled`
  // assertion Item B introduces. `stalled` requires `queuedCount > 0`, which requires
  // `manager.trackedTileCount > 0`, which the settled predicate excludes by construction.
  it("stalled and settled never co-occur on the same event: the over-budget-with-a-frozen-queue scenario never carries a settled field", async () => {
    vi.useFakeTimers();
    try {
      const canvas = fakeCanvas({
        pushTileBatch: vi
          .fn()
          .mockReturnValueOnce({ ...OK_INGEST, fitAnchor: { xmin: 0, ymin: 0, xmax: 0, ymax: 0 } }) // untiled bootstrap
          .mockReturnValue({ ...OK_INGEST, overBudget: true, fitAnchor: { xmin: 0, ymin: 0, xmax: 0, ymax: 0 } }),
        getResidentCounts: vi.fn(() => ({
          totalResidentVertices: Math.ceil(MAX_RESIDENT_VERTICES * 0.9), // at the declared margin -- no headroom
          totalResidentFeatures: 5,
        })),
      });
      const onResidencyStatusChange = vi.fn();
      const session = startCandidateArmSession({ dataset: "ds_x", canvas, onResidencyStatusChange });
      await session.reissueUnrestricted(null, null);
      lastSink().onBatch(new Uint8Array([1]), true);
      completeUntiledLook();

      viewportQueryMock.mockReset();
      viewportQueryMock
        .mockResolvedValueOnce({ stream: "sh_tile_1" })
        .mockResolvedValueOnce({ stream: "sh_tile_2" })
        .mockResolvedValueOnce({ stream: "sh_tile_3" });
      viewportQueryMock.mockImplementation(() => new Promise(() => {})); // the rest stay genuinely queued
      session.onViewportChanged({ xmin: -10, ymin: -10, xmax: 10, ymax: 10 });
      await vi.advanceTimersByTimeAsync(VIEWPORT_QUERY_MIN_INTERVAL_MS);
      expect(session.manager.inFlightCount).toBe(3);
      expect(session.manager.queuedCount).toBeGreaterThan(0);

      onResidencyStatusChange.mockClear();
      const tileSink = lastSink();
      tileSink.onBatch(new Uint8Array([2]), true);
      await Promise.resolve();

      expect(session.manager.overBudget).toBe(true);
      expect(session.manager.queuedCount).toBeGreaterThan(0); // stalled precondition: a frozen, non-empty queue
      const [event] = onResidencyStatusChange.mock.calls.at(-1)! as [{ stalled?: unknown; settled?: unknown }];
      expect(event.stalled).toBe(true);
      expect(event.settled).toBeUndefined(); // never both -- queuedCount > 0 forces trackedTileCount > 0
    } finally {
      vi.useRealTimers();
    }
  });

  // M1 (reviewer gate, residency-debt cut 1b, "Item B input-list amendment"): the dedicated reachability
  // regression -- a gen-2 reissue leaves `manager.frame` established (`reissueUnrestricted`'s own
  // interface doc, `candidateArmSession.ts:187-189`: "The tile grid FRAME itself is never re-derived"
  // ... "only residency and the fit anchor reset" -- not `clearAll`'s own doc comment, which never
  // mentions the frame at all), so a real plan can run against it while the SAME generation's own
  // untiled first-look/reissue stream still delivers. Drives the OTHER admission path the M1-corrected
  // "debounced-but-not-yet-run" test above does not: over-budget with NO headroom skips a genuinely
  // new candidate ENTIRELY
  // (`TileViewportStreamManager.onCameraChange`'s own `continue`, never issued/queued), so
  // `trackedTileCount` reaches (stays) 0 without that tile ever being tracked in the first place --
  // `pendingViewportChange` plays no part here at all, isolating `untiledStreamRunning` as the ONLY
  // thing keeping this reading honest.
  it("M1: over-budget + no-headroom skip reaches trackedTileCount 0 while the untiled stream still delivers -- not settled, the suffix absent; settles honestly once the untiled stream reaches its own terminal", async () => {
    vi.useFakeTimers();
    try {
      const canvas = fakeCanvas({
        pushTileBatch: vi.fn(() => ({ ...OK_INGEST, fitAnchor: { xmin: 0, ymin: 0, xmax: 0, ymax: 0 } })),
        applyTileViewportContext: vi.fn(() => false), // stays over budget after every re-check
        getResidentCounts: vi.fn(() => ({
          totalResidentVertices: Math.ceil(MAX_RESIDENT_VERTICES * 0.95), // above the declared 0.9 margin -- no headroom, ever
          totalResidentFeatures: 7,
        })),
      });
      const onResidencyStatusChange = vi.fn();
      const session = startCandidateArmSession({ dataset: "ds_x", canvas, onResidencyStatusChange });

      // Gen1: an ordinary bootstrap, its own untiled stream completed -- establishes the frame.
      await session.reissueUnrestricted(null, null);
      lastSink().onBatch(new Uint8Array([1]), true);
      completeUntiledLook();
      expect(session.manager.gridFrame).not.toBeNull();

      // Gen2 (Apply/Clear): a NEW untiled stream starts (`sh_2`), deliberately left OPEN throughout --
      // `manager.clearAll()` resets `manager.overBudget` to `false` (`clearAll`'s own doc comment:
      // "Also clears `overBudget`") and never touches `manager.frame`; `reissueUnrestricted` itself
      // (this session's own code, not `clearAll`) separately resets its own `hasPlanned` to `false`
      // right alongside that call.
      viewportQueryMock.mockReset().mockResolvedValueOnce({ stream: "sh_2" });
      await session.reissueUnrestricted(null, null);

      // `sh_2` (the untiled stream) delivers a batch that reports `overBudget` -- `manager.overBudget`
      // becomes `true` even though this is the UNTILED stream's own batch (never self-cancelled --
      // `ingestAndMaybeEstablishFrame`'s own `tileKey !== INITIAL_TILE_KEY` guard on the self-cancel
      // branch, `candidateArmSession.ts`), so `sh_2` itself stays open.
      const pushTileBatch = canvas.pushTileBatch as ReturnType<typeof vi.fn>;
      pushTileBatch.mockReturnValueOnce({ ...OK_INGEST, overBudget: true, fitAnchor: { xmin: 0, ymin: 0, xmax: 0, ymax: 0 } });
      lastSink().onBatch(new Uint8Array([2]), true);
      expect(session.manager.overBudget).toBe(true);

      // Plan against the established frame (a genuinely new, never-before-resident tile) WHILE `sh_2`
      // still delivers -- over-budget + no headroom skips this candidate ENTIRELY (never issued, never
      // queued): `trackedTileCount` reaches (stays) 0 without this tile ever being tracked at all.
      const oneTileBbox = { xmin: -1, ymin: -1, xmax: -0.95, ymax: -0.95 };
      onResidencyStatusChange.mockClear();
      viewportQueryMock.mockClear();
      session.onViewportChanged(oneTileBbox);
      await vi.advanceTimersByTimeAsync(VIEWPORT_QUERY_MIN_INTERVAL_MS);
      expect(session.manager.trackedTileCount).toBe(0);
      expect(viewportQueryMock).not.toHaveBeenCalled(); // skipped, never even issued a ticket

      // M1's own reachability finding: WITHOUT `untiledStreamRunning`, `settledState`'s own
      // `isSettled = hasPlanned && !pendingViewportChange && trackedTileCount === 0` reads `true` here
      // (all three hold), classifying `settled-partial` even though `sh_2` keeps delivering into this
      // SAME view -- the exact false-claim class Item A's own M1 finding convicted. WITH the fix, the
      // emitted event carries NO `settled` field at all, and (by construction, `residencyStatusText`'s
      // own mapping) never appends the settled-partial suffix either.
      expect(onResidencyStatusChange).toHaveBeenCalledTimes(1);
      const [event] = onResidencyStatusChange.mock.calls[0] as [ResidencyStatus];
      expect(event.kind).toBe("candidate-over-budget");
      expect((event as { settled?: unknown }).settled).toBeUndefined();
      expect(residencyStatusText(event)).not.toContain("Filling has stopped for this view");

      // M1: complete the untiled look now -- `sh_2` reaches its own terminal, clearing
      // `untiledStreamRunning`. This alone does not itself emit (S2's own surfacing obligation is
      // scoped to the TILE manager's `onTileSuperseded`/`onTerminal`, never this session-owned untiled
      // stream) -- no NEW call beyond the one already asserted above.
      completeUntiledLook();
      expect(onResidencyStatusChange).toHaveBeenCalledTimes(1);

      // The next emission (another plan; the SAME candidate is still skipped, still over budget) now
      // settles honestly, classified settled-partial -- never a completeness/total claim over this
      // partial set (BS6: `viewportTotal` stays `null`).
      onResidencyStatusChange.mockClear();
      session.onViewportChanged(oneTileBbox);
      await vi.advanceTimersByTimeAsync(VIEWPORT_QUERY_MIN_INTERVAL_MS);
      expect(onResidencyStatusChange).toHaveBeenCalledWith({
        kind: "candidate-over-budget",
        residentFeatureCount: 7,
        viewportTotal: null,
        settled: "partial",
      });
    } finally {
      vi.useRealTimers();
    }
  });

  // S4 (reviewer gate, residency-debt cut 1b): `cancelPendingViewportChange` must genuinely clear
  // `pendingViewportChange`, not merely cancel the debounce timer -- dropping that clear from the
  // wrapper (`cancelViewportDebounce`, `candidateArmSession.ts`) would leave the flag stuck `true`
  // forever (nothing else ever clears it once the debounce that would have is cancelled), so every
  // later settled reading would silently, permanently read not-settled. The probe below deliberately
  // does NOT use a second `onViewportChanged`/debounce firing to observe the result -- `handleViewportChange`
  // clears `pendingViewportChange` itself, unconditionally, as its own first line, so a second debounced
  // plan would pass even if `cancelPendingViewportChange` were a complete no-op, never distinguishing a
  // working wrapper from a broken one. Instead it uses a TILE batch/terminal -- `ingestAndMaybeEstablishFrame`'s
  // own trailing `emitResidencyStatus()` call and `onTerminal`'s own new one (S2) -- an ingest path that
  // never touches `pendingViewportChange` at all, so ONLY `cancelPendingViewportChange`'s own clear can
  // make the settled reading return here.
  it("cancelPendingViewportChange genuinely clears pendingViewportChange -- a subsequent ingest event (never handleViewportChange, which would clear it regardless) sees the settled reading return", async () => {
    vi.useFakeTimers();
    try {
      const completeTileKeys = new Set<string>();
      const canvas = fakeCanvas({
        pushTileBatch: vi.fn(() => ({ ...OK_INGEST, fitAnchor: { xmin: 0, ymin: 0, xmax: 0, ymax: 0 } })),
        getResidentCounts: vi.fn(() => ({ totalResidentVertices: 10, totalResidentFeatures: 2 })),
        isTileResidentInCandidateSet: vi.fn((tileKey: string) => completeTileKeys.has(tileKey)),
        isTileCompleteInCandidateSet: vi.fn((tileKey: string) => completeTileKeys.has(tileKey)),
        markTileComplete: vi.fn((tileKey: string) => completeTileKeys.add(tileKey)),
        markTilePartial: vi.fn((tileKey: string) => completeTileKeys.delete(tileKey)),
      });
      const onResidencyStatusChange = vi.fn();
      const session = startCandidateArmSession({ dataset: "ds_x", canvas, onResidencyStatusChange });
      await session.reissueUnrestricted(null, null);
      lastSink().onBatch(new Uint8Array([1]), true);
      // The untiled stream reaches its OWN terminal here, and never again in this test --
      // `untiledStreamRunning` (M1) stays `false` throughout what follows, so the ONLY variable this
      // test exercises is `pendingViewportChange`, never conflated with M1's own independent gate.
      completeUntiledLook();

      // A single-tile bbox, deliberately left UNRESOLVED past its own first plan -- still genuinely
      // "in flight" when this test needs a second, independent ingest event later.
      const bbox = { xmin: -1, ymin: -1, xmax: -0.95, ymax: -0.95 };
      viewportQueryMock.mockReset().mockResolvedValueOnce({ stream: "sh_tile_1" });
      session.onViewportChanged(bbox);
      await vi.advanceTimersByTimeAsync(VIEWPORT_QUERY_MIN_INTERVAL_MS);
      expect(session.manager.inFlightCount).toBe(1);

      // A SECOND pan is accepted for debouncing (`pendingViewportChange` -> `true`) but cancelled
      // immediately instead of ever firing -- exactly the Apply/Clear `cancelPendingDebounce` seam this
      // method exists for (`CandidateArmSession.cancelPendingViewportChange`'s own doc comment).
      session.onViewportChanged({ xmin: -20, ymin: -20, xmax: 20, ymax: 20 });
      session.cancelPendingViewportChange();

      // The probe: the still-in-flight tile's own batch arrives and completes it --
      // `ingestAndMaybeEstablishFrame`'s own trailing call, then `onTerminal`'s own new one (S2) --
      // NEVER `handleViewportChange`. If `cancelPendingViewportChange` had dropped its own clear, this
      // assertion would fail: `settledState` would still read `"not-settled"` (`pendingViewportChange`
      // stuck `true`), and `emitResidencyStatus`'s within-budget branch would emit nothing at all.
      onResidencyStatusChange.mockClear();
      sinkForHandle("sh_tile_1").onBatch(new Uint8Array([2]), true);
      sinkForHandle("sh_tile_1").onTerminal({ kind: "Completed", detail: "" });
      expect(onResidencyStatusChange).toHaveBeenCalledWith({
        kind: "candidate-within-budget",
        residentFeatureCount: 2,
        settled: "complete",
      });
    } finally {
      vi.useRealTimers();
    }
  });
});

/** Reduces a raw event sequence through `nextResidencyStatus` exactly the way `App.tsx`'s own
 * `onResidencyStatusChange: (event) => setResidencyStatus((current) => nextResidencyStatus(event,
 * current))` wiring does (Piece 1, entry 35) -- this session's own tests assert the RAW events it
 * dispatches (every other describe block in this file); this helper additionally proves what the
 * shared reducer does with them in sequence, the same two-layer verification the sticky rule needs. */
function reduceEvents(events: ResidencyStatusEvent[]): ResidencyStatus | null {
  let current: ResidencyStatus | null = null;
  for (const event of events) current = nextResidencyStatus(event, current);
  return current;
}

// Piece 1 (residency-debt cut 1b, entry 35, "sticky per entry-1"): the session's own event sequence,
// reduced through the SAME pipeline `App.tsx` uses, proves the sticky rule end-to-end -- not merely
// that `nextResidencyStatus` refuses an overwrite in isolation (`residencyStatus.test.ts`'s own unit
// tests), but that THIS session dispatches exactly the raw events the rule needs to behave correctly.
describe("the sticky-relinquished status, end-to-end (Piece 1, entry 35)", () => {
  beforeEach(() => {
    viewportQueryMock.mockReset().mockResolvedValue({ stream: "sh_1" });
    cancelMock.mockReset().mockResolvedValue({ state: "requested" });
    dataPlaneAttachMock.mockReset().mockResolvedValue({ url: "ws://127.0.0.1:1/stream", subprotocols: ["spatial-dp.v0", "tok.x"] });
    startStreamMock.mockReset().mockReturnValue({ cancel: vi.fn(), stats: { reassemblyCopies: 0, jsonFramesSeen: 0 } });
  });

  // The concrete, reachable case `residencyStatus.ts`'s own doc comment on `nextResidencyStatus` names:
  // a frameless-bootstrap relinquish, followed by the STILL-RUNNING untiled stream's own LATER batch
  // reporting over-budget -- `emitResidencyStatus`'s over-budget branch fires unconditionally
  // (`manager.overBudget` is a "definite current fact", never gated on `hasPlanned`), so WITHOUT the
  // sticky rule this would silently overwrite the standing relinquished status in place.
  it("a frameless-bootstrap relinquish survives a later untiled batch reporting over-budget -- the raw event fires, but the REDUCED status stays relinquished", async () => {
    const canvas = fakeCanvas({
      pushTileBatch: vi.fn(() => ({ ...OK_INGEST, fitAnchor: { xmin: 0, ymin: 0, xmax: 0, ymax: 0 } })),
      getResidentCounts: vi.fn(() => ({ totalResidentVertices: 5, totalResidentFeatures: 2 })),
    });
    const onResidencyStatusChange = vi.fn();
    const session = startCandidateArmSession({ dataset: "ds_x", canvas, onResidencyStatusChange });

    // Bootstrap, deliberately left running -- no frame exists yet.
    await session.reissueUnrestricted(null, null);
    expect(session.manager.gridFrame).toBeNull();
    onResidencyStatusChange.mockClear();

    session.relinquishFill(); // frameless -- the untiled stream is NOT cancelled, per entry 35
    expect(onResidencyStatusChange).toHaveBeenCalledWith(
      expect.objectContaining({ kind: "candidate-relinquished", untiledStreamStillRunning: true })
    );

    // The still-running untiled stream's own LATER batch reports over-budget -- the raw event this
    // session dispatches for it fires (asserted directly: this session's own honesty, over-budget is a
    // definite current fact), but the REDUCED status must stay relinquished.
    (canvas.pushTileBatch as ReturnType<typeof vi.fn>).mockReturnValueOnce({
      ...OK_INGEST,
      overBudget: true,
      fitAnchor: { xmin: 0, ymin: 0, xmax: 0, ymax: 0 },
    });
    lastSink().onBatch(new Uint8Array([2]), true);
    expect(onResidencyStatusChange).toHaveBeenCalledWith(
      expect.objectContaining({ kind: "candidate-over-budget" })
    );

    const events = onResidencyStatusChange.mock.calls.map((call) => call[0] as ResidencyStatusEvent);
    const reduced = reduceEvents(events);
    expect(reduced?.kind).toBe("candidate-relinquished"); // never silently overwritten by the over-budget batch
  });

  // M-1 (re-reviewer gate, residency-debt cut 1b) / entry 35: the stale-status fix. Before this fix, a
  // frameless-bootstrap relinquish's own `untiledStreamStillRunning: true` reading survived (via the
  // sticky rule) past the exact instant that stream's own terminal made the claim false -- no status
  // ever told the operator the tile-fill-relinquished-but-the-base-load-kept-running state had itself
  // ended. This test drives that stream to its own natural terminal and asserts the re-emit.
  it("a frameless-bootstrap relinquish's own untiledStreamStillRunning reading clears itself honestly at that stream's own terminal (M-1)", async () => {
    const canvas = fakeCanvas({
      pushTileBatch: vi.fn(() => ({ ...OK_INGEST, fitAnchor: { xmin: 0, ymin: 0, xmax: 0, ymax: 0 } })),
      getResidentCounts: vi.fn(() => ({ totalResidentVertices: 5, totalResidentFeatures: 2 })),
    });
    const onResidencyStatusChange = vi.fn();
    const session = startCandidateArmSession({ dataset: "ds_x", canvas, onResidencyStatusChange });

    // Bootstrap, deliberately left running -- no frame exists yet.
    await session.reissueUnrestricted(null, null);
    expect(session.manager.gridFrame).toBeNull();
    onResidencyStatusChange.mockClear();

    session.relinquishFill(); // frameless -- the untiled stream is NOT cancelled, per entry 35
    expect(onResidencyStatusChange).toHaveBeenCalledWith(
      expect.objectContaining({ kind: "candidate-relinquished", untiledStreamStillRunning: true })
    );
    {
      const events = onResidencyStatusChange.mock.calls.map((call) => call[0] as ResidencyStatusEvent);
      const reduced = reduceEvents(events);
      expect(reduced).toEqual<ResidencyStatus>({ kind: "candidate-relinquished", residentFeatureCount: 2, untiledStreamStillRunning: true });
      expect(residencyStatusText(reduced!)).toContain("Cancel does not stop it");
    }

    onResidencyStatusChange.mockClear();
    // Re-review nit (freshness): the count CHANGES between the relinquish and the terminal, so the
    // assertion below proves the re-emit reads `getResidentCounts()` at emission time -- a snapshot
    // taken at relinquish time would still carry 2 and fail here.
    canvas.getResidentCounts = vi.fn(() => ({ totalResidentVertices: 9, totalResidentFeatures: 3 }));
    // The still-running untiled stream now reaches its own natural terminal -- fire the frameless
    // window's own uncancellable stream's terminal directly.
    lastSink().onTerminal({ kind: "Completed", detail: "" });

    // The ORDINARY relinquished variant re-emits -- no `untiledStreamStillRunning` field at all
    // (`toEqual` treats an absent property and an explicit `undefined` as equivalent, the same idiom
    // this file's own preceding tests already rely on) -- and with the CURRENT count (3), never a
    // relinquish-time snapshot (2).
    expect(onResidencyStatusChange).toHaveBeenCalledWith({ kind: "candidate-relinquished", residentFeatureCount: 3 });
    expect(onResidencyStatusChange).not.toHaveBeenCalledWith(
      expect.objectContaining({ untiledStreamStillRunning: expect.anything() })
    );

    const events = onResidencyStatusChange.mock.calls.map((call) => call[0] as ResidencyStatusEvent);
    const reduced = reduceEvents([{ kind: "candidate-relinquished", residentFeatureCount: 2, untiledStreamStillRunning: true }, ...events]);
    expect(reduced).toEqual<ResidencyStatus>({ kind: "candidate-relinquished", residentFeatureCount: 3 });
    // No stale "still running" text survives -- the reduced status renders the ordinary wording.
    expect(residencyStatusText(reduced!)).not.toContain("still running");
    expect(residencyStatusText(reduced!)).not.toContain("Cancel does not stop it");
  });

  // M-2 (re-reviewer gate, residency-debt cut 1b): paraphrasing, not quoting -- `residencyStatus.ts`'s
  // own doc comment on `nextResidencyStatus` (the byte-exact source): "A NEW plan or dataset/filter
  // change clears the sticky status honestly". This test exercises exactly that case: a frame-exists
  // relinquish, followed by a genuinely fresh camera-change plan, supersedes the standing relinquished
  // status honestly (through the `candidate-fill-progress` clearing event `handleViewportChange` fires
  // for exactly this case).
  it("a frame-exists relinquish is superseded by the NEXT genuine plan -- candidate-fill-progress clears it, then the fresh reading applies", async () => {
    vi.useFakeTimers();
    try {
      const canvas = fakeCanvas({
        pushTileBatch: vi.fn(() => ({ ...OK_INGEST, fitAnchor: { xmin: 0, ymin: 0, xmax: 0, ymax: 0 } })),
        getResidentCounts: vi.fn(() => ({ totalResidentVertices: 5, totalResidentFeatures: 2 })),
        isTileResidentInCandidateSet: vi.fn(() => true),
        isTileCompleteInCandidateSet: vi.fn(() => true),
      });
      const onResidencyStatusChange = vi.fn();
      const session = startCandidateArmSession({ dataset: "ds_x", canvas, onResidencyStatusChange });

      await session.reissueUnrestricted(null, null);
      lastSink().onBatch(new Uint8Array([1]), true);
      completeUntiledLook();
      expect(session.manager.gridFrame).not.toBeNull();

      onResidencyStatusChange.mockClear();
      session.relinquishFill(); // no tile/untiled work outstanding -- relinquishes trivially
      expect(onResidencyStatusChange).toHaveBeenCalledWith({ kind: "candidate-relinquished", residentFeatureCount: 2 });

      viewportQueryMock.mockReset(); // every covering tile below reads alreadyResident -- nothing to mint
      session.onViewportChanged({ xmin: -10, ymin: -10, xmax: 10, ymax: 10 });
      await vi.advanceTimersByTimeAsync(VIEWPORT_QUERY_MIN_INTERVAL_MS);

      expect(onResidencyStatusChange).toHaveBeenCalledWith({ kind: "candidate-fill-progress" });
      expect(onResidencyStatusChange).toHaveBeenCalledWith({
        kind: "candidate-within-budget",
        residentFeatureCount: 2,
        settled: "complete",
      });

      const events = onResidencyStatusChange.mock.calls.map((call) => call[0] as ResidencyStatusEvent);
      const reduced = reduceEvents(events);
      // The fresh plan's own reading wins -- never stuck on the superseded relinquished status.
      expect(reduced).toEqual<ResidencyStatus>({ kind: "candidate-within-budget", residentFeatureCount: 2, settled: "complete" });
    } finally {
      vi.useRealTimers();
    }
  });

  // S-4 (re-reviewer gate, residency-debt cut 1b): the closest-to-coexistence state this module's own
  // invariant (`emitResidencyStatus`'s own comment at its `candidate-fill-progress` dispatch site) rests
  // on -- a genuine settled-complete reading stands (`standingWithinBudgetComplete === true`)
  // immediately BEFORE `relinquishFill` fires with nothing left outstanding to actually cancel.
  // `relinquishFill`'s own dispatch path (`emitResidencyRelinquished`) never touches
  // `standingWithinBudgetComplete` at all, so the flag survives, stale, alongside the NOW-standing
  // `candidate-relinquished` status. Proves `relinquishFill` itself never spuriously fires
  // `candidate-fill-progress` in this window (it dispatches ONLY `candidate-relinquished`) -- which
  // would otherwise clear the sticky status this SAME call just established, out from under entry 35's
  // own rule.
  it("the closest-to-coexistence state: a settled-complete reading stands, then relinquishFill fires trivially -- only candidate-relinquished dispatches, never a spurious candidate-fill-progress (S-4)", async () => {
    vi.useFakeTimers();
    try {
      const canvas = fakeCanvas({
        pushTileBatch: vi.fn(() => ({ ...OK_INGEST, fitAnchor: { xmin: 0, ymin: 0, xmax: 0, ymax: 0 } })),
        getResidentCounts: vi.fn(() => ({ totalResidentVertices: 5, totalResidentFeatures: 2 })),
        isTileResidentInCandidateSet: vi.fn(() => true),
        isTileCompleteInCandidateSet: vi.fn(() => true),
      });
      const onResidencyStatusChange = vi.fn();
      const session = startCandidateArmSession({ dataset: "ds_x", canvas, onResidencyStatusChange });

      await session.reissueUnrestricted(null, null);
      lastSink().onBatch(new Uint8Array([1]), true);
      completeUntiledLook();
      expect(session.manager.gridFrame).not.toBeNull();

      // A genuine plan whose entire covering set is already resident/complete -- settled-complete,
      // `standingWithinBudgetComplete` now `true`.
      viewportQueryMock.mockReset(); // every covering tile reads alreadyResident -- nothing new to mint
      session.onViewportChanged({ xmin: -1, ymin: -1, xmax: 1, ymax: 1 });
      await vi.advanceTimersByTimeAsync(VIEWPORT_QUERY_MIN_INTERVAL_MS);
      expect(onResidencyStatusChange).toHaveBeenCalledWith({
        kind: "candidate-within-budget",
        residentFeatureCount: 2,
        settled: "complete",
      });

      // The closest-to-coexistence instant: nothing is outstanding (the fill already settled complete),
      // yet `relinquishFill` fires anyway -- `standingWithinBudgetComplete` stays stale-`true`
      // internally (`relinquishFill` never touches it), while the CURRENT status becomes
      // `candidate-relinquished`.
      onResidencyStatusChange.mockClear();
      const summary = session.relinquishFill();
      expect(summary).toEqual({ cancelledInFlight: [], droppedQueued: [] }); // genuinely nothing to cancel

      // The invariant: ONLY `candidate-relinquished` dispatches here -- never a spurious
      // `candidate-fill-progress` alongside it.
      const events = onResidencyStatusChange.mock.calls.map((call) => call[0] as ResidencyStatusEvent);
      expect(events).toEqual([{ kind: "candidate-relinquished", residentFeatureCount: 2 }]);
      expect(events).not.toContainEqual({ kind: "candidate-fill-progress" });
      const reduced = reduceEvents(events);
      expect(reduced).toEqual<ResidencyStatus>({ kind: "candidate-relinquished", residentFeatureCount: 2 });
    } finally {
      vi.useRealTimers();
    }
  });
});

// Piece 2(i) (residency-debt cut 1b, entry 36 rule (i)): "the stale all-N clears on the invalidating
// gesture" -- a standing "Showing all N features in view" status must never survive a later pan whose
// own covering set reads incomplete again.
describe("stale within-budget clears on the invalidating gesture (Piece 2(i), entry 36)", () => {
  beforeEach(() => {
    viewportQueryMock.mockReset().mockResolvedValue({ stream: "sh_1" });
    cancelMock.mockReset().mockResolvedValue({ state: "requested" });
    dataPlaneAttachMock.mockReset().mockResolvedValue({ url: "ws://127.0.0.1:1/stream", subprotocols: ["spatial-dp.v0", "tok.x"] });
    startStreamMock.mockReset().mockReturnValue({ cancel: vi.fn(), stats: { reassemblyCopies: 0, jsonFramesSeen: 0 } });
  });

  it("pan -> covering set now incomplete: the standing 'Showing all N' is GONE (candidate-fill-progress fires), never surviving by inertia", async () => {
    vi.useFakeTimers();
    try {
      const completeTileKeys = new Set<string>();
      const canvas = fakeCanvas({
        pushTileBatch: vi.fn(() => ({ ...OK_INGEST, fitAnchor: { xmin: 0, ymin: 0, xmax: 0, ymax: 0 } })),
        getResidentCounts: vi.fn(() => ({ totalResidentVertices: 20, totalResidentFeatures: 2 })),
        isTileResidentInCandidateSet: vi.fn((tileKey: string) => completeTileKeys.has(tileKey)),
        isTileCompleteInCandidateSet: vi.fn((tileKey: string) => completeTileKeys.has(tileKey)),
      });
      const onResidencyStatusChange = vi.fn();
      const session = startCandidateArmSession({ dataset: "ds_x", canvas, onResidencyStatusChange });
      await session.reissueUnrestricted(null, null);
      lastSink().onBatch(new Uint8Array([1]), true);
      completeUntiledLook();

      // Plan 1: a small covering tile, resolved untrimmed and complete -- "Showing all N" now stands.
      viewportQueryMock.mockReset().mockResolvedValueOnce({ stream: "sh_a" });
      const smallBbox = { xmin: -1, ymin: -1, xmax: -0.95, ymax: -0.95 };
      session.onViewportChanged(smallBbox);
      await vi.advanceTimersByTimeAsync(VIEWPORT_QUERY_MIN_INTERVAL_MS);
      const [tileA] = (canvas.applyTileViewportContext as ReturnType<typeof vi.fn>).mock.calls.at(-1)![0] as string[];
      completeTileKeys.add(tileA);
      const sinkA = lastSink();
      sinkA.onBatch(new Uint8Array([2]), true);
      sinkA.onTerminal({ kind: "Completed", detail: "" });

      onResidencyStatusChange.mockClear();
      // The SAME covering tile re-planned -- alreadyResident/complete, nothing new -- earns the
      // standing "Showing all N" reading.
      session.onViewportChanged(smallBbox);
      await vi.advanceTimersByTimeAsync(VIEWPORT_QUERY_MIN_INTERVAL_MS);
      expect(onResidencyStatusChange).toHaveBeenCalledWith({
        kind: "candidate-within-budget",
        residentFeatureCount: 2,
        settled: "complete",
      });

      // Pan -- a WIDER bbox whose own covering set now includes a genuinely new, never-resolved tile:
      // truncated/incomplete again. Never resolved, so it stays mid-fill.
      onResidencyStatusChange.mockClear();
      viewportQueryMock.mockReset().mockImplementation(() => new Promise(() => {}));
      const widerBbox = { xmin: -10, ymin: -10, xmax: 10, ymax: 10 };
      session.onViewportChanged(widerBbox);
      await vi.advanceTimersByTimeAsync(VIEWPORT_QUERY_MIN_INTERVAL_MS);

      expect(session.manager.trackedTileCount).toBeGreaterThan(0); // genuinely mid-fill now
      // THE FIX: the stale "Showing all N" claim is actively cleared, never left standing by inertia.
      expect(onResidencyStatusChange).toHaveBeenCalledWith({ kind: "candidate-fill-progress" });
      expect(onResidencyStatusChange).not.toHaveBeenCalledWith(expect.objectContaining({ kind: "candidate-within-budget" }));

      const events = onResidencyStatusChange.mock.calls.map((call) => call[0] as ResidencyStatusEvent);
      const reduced = reduceEvents(events);
      expect(reduced).toBeNull(); // gone, not silently replaced by a false claim either
    } finally {
      vi.useRealTimers();
    }
  });

  it("a pan that never reached settled-complete in the first place stays silent -- candidate-fill-progress fires only to clear a REAL prior claim (mirrors the pre-existing 'mid-fill, not over budget: emits NOTHING' behavior)", async () => {
    vi.useFakeTimers();
    try {
      const canvas = fakeCanvas({
        pushTileBatch: vi.fn(() => ({ ...OK_INGEST, fitAnchor: { xmin: 0, ymin: 0, xmax: 0, ymax: 0 } })),
        getResidentCounts: vi.fn(() => ({ totalResidentVertices: 10, totalResidentFeatures: 1 })),
      });
      const onResidencyStatusChange = vi.fn();
      const session = startCandidateArmSession({ dataset: "ds_x", canvas, onResidencyStatusChange });
      await session.reissueUnrestricted(null, null);
      lastSink().onBatch(new Uint8Array([1]), true);
      completeUntiledLook();

      viewportQueryMock.mockReset().mockImplementation(() => new Promise(() => {}));
      onResidencyStatusChange.mockClear();
      session.onViewportChanged({ xmin: -10, ymin: -10, xmax: 10, ymax: 10 });
      await vi.advanceTimersByTimeAsync(VIEWPORT_QUERY_MIN_INTERVAL_MS);

      expect(onResidencyStatusChange).not.toHaveBeenCalled(); // nothing was ever standing to clear
    } finally {
      vi.useRealTimers();
    }
  });
});

// Piece 2(iii) (residency-debt cut 1b, entry 36): the untiled sink's own failed terminal, no longer
// silent -- feeds the SAME typed-partiality accounting a covering-tile failure does.
describe("the untiled sink's failed terminal feeds the typed-partiality accounting (Piece 2(iii), entry 36)", () => {
  beforeEach(() => {
    viewportQueryMock.mockReset().mockResolvedValue({ stream: "sh_1" });
    cancelMock.mockReset().mockResolvedValue({ state: "requested" });
    dataPlaneAttachMock.mockReset().mockResolvedValue({ url: "ws://127.0.0.1:1/stream", subprotocols: ["spatial-dp.v0", "tok.x"] });
    startStreamMock.mockReset().mockReturnValue({ cancel: vi.fn(), stats: { reassemblyCopies: 0, jsonFramesSeen: 0 } });
  });

  // A genuine untiled failure can only be OBSERVED via `isFillComplete()` if it happens AFTER the last
  // real plan of its generation ran (the untiled stream's own terminal always precedes the FIRST
  // possible plan of a generation -- `establishFrameFromExtent` runs there, and no plan can succeed
  // before a frame exists -- so a failure recorded BEFORE any plan is immediately wiped by that very
  // plan's own per-generation clear, `handleViewportChange`'s own doc comment). The reachable shape is
  // therefore the SAME one M1's own "over-budget + no-headroom skip" test uses: an Apply/Clear reissue
  // (gen2) whose own new untiled stream is deliberately left open WHILE a real plan already runs
  // against the frame gen1 established (`manager.gridFrame` persists across the reissue).
  it("a GENUINE untiled failure (never self-cancelled), recorded after the last plan, prevents settled-complete until the next plan/reissue", async () => {
    vi.useFakeTimers();
    try {
      const canvas = fakeCanvas({
        pushTileBatch: vi.fn(() => ({ ...OK_INGEST, fitAnchor: { xmin: 0, ymin: 0, xmax: 0, ymax: 0 } })),
        getResidentCounts: vi.fn(() => ({ totalResidentVertices: 5, totalResidentFeatures: 1 })),
        isTileResidentInCandidateSet: vi.fn(() => true),
        isTileCompleteInCandidateSet: vi.fn(() => true),
      });
      const session = startCandidateArmSession({ dataset: "ds_x", canvas });

      // Gen1 bootstrap: establishes the frame via a genuine Completed terminal.
      await session.reissueUnrestricted(null, null);
      lastSink().onBatch(new Uint8Array([1]), true);
      completeUntiledLook();
      expect(session.manager.gridFrame).not.toBeNull();

      // Gen2 (Apply/Clear): a NEW untiled stream (`sh_2`) starts, deliberately left open --
      // `manager.gridFrame` persists across the reissue, so a real plan can still run against it.
      viewportQueryMock.mockReset().mockResolvedValueOnce({ stream: "sh_2" });
      await session.reissueUnrestricted(null, null);

      // A plan whose entire (tile) covering set is trivially complete (every tile alreadyResident) --
      // `isFillComplete()` reads `true` here (its own scope excludes the untiled stream entirely, M1's
      // own design), proving the LATER `false` reading below is caused by the failure, not by anything
      // this plan itself left incomplete.
      session.onViewportChanged({ xmin: -10, ymin: -10, xmax: 10, ymax: 10 });
      await vi.advanceTimersByTimeAsync(VIEWPORT_QUERY_MIN_INTERVAL_MS);
      expect(session.isFillComplete()).toBe(true);

      // `sh_2` (gen2's own untiled stream) NOW reaches its own terminal with a GENUINE failure -- never
      // routed through this session's own self-cancel suppression (`stop()`/`relinquishFill` were never
      // called), so the sink's own `onTerminal` records it. No plan has run SINCE this failure.
      logSessionEventMock.mockClear();
      expect(() => lastSink().onTerminal({ kind: "ProducerFailed", detail: "engine.stream_failed" })).not.toThrow();

      // S-3 (re-reviewer gate, residency-debt cut 1b): the log class fires, with the terminal kind and
      // detail in its own message -- mirroring `tileViewportStreamManager.test.ts`'s own assertions for
      // its two sibling classes.
      expect(logSessionEventMock).toHaveBeenCalledWith(
        "candidate-untiled-terminal",
        expect.stringContaining("ProducerFailed")
      );
      expect(logSessionEventMock).toHaveBeenCalledWith(
        "candidate-untiled-terminal",
        expect.stringContaining("engine.stream_failed")
      );

      expect(session.isFillComplete()).toBe(false); // the untiled failure alone prevents completeness

      // M-2 (re-reviewer gate, residency-debt cut 1b): a new plan/reissue clears the accounting window --
      // `candidateArmSession.ts`'s own `onTerminal` doc comment (the byte-exact source, not entry 36):
      // "prevents settled-complete until a new plan/reissue".
      viewportQueryMock.mockReset();
      session.onViewportChanged({ xmin: -9, ymin: -9, xmax: 9, ymax: 9 });
      await vi.advanceTimersByTimeAsync(VIEWPORT_QUERY_MIN_INTERVAL_MS);
      expect(session.isFillComplete()).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });

  // S-1 (re-reviewer gate, residency-debt cut 1b): the untiled failure accounting must be
  // GENERATION-gated, not merely self-cancel-gated -- an ORPHANED previous-generation untiled stream
  // (`reissueUnrestricted` deliberately never cancels this stream, `issueUntiledQuery`'s own top doc
  // comment) can deliver its own late terminal after `untiledStreamHandle` has already moved on to a
  // NEWER generation's own stream. Reachable shape: TWO Apply/Clear reissues in a row, the first one's
  // own untiled stream left open through the second.
  it("an orphaned previous-generation untiled stream's late failed terminal is superseded -- no failure accounting lands in the CURRENT generation, log line present labelled superseded (S-1)", async () => {
    vi.useFakeTimers();
    try {
      const canvas = fakeCanvas({
        pushTileBatch: vi.fn(() => ({ ...OK_INGEST, fitAnchor: { xmin: 0, ymin: 0, xmax: 0, ymax: 0 } })),
        getResidentCounts: vi.fn(() => ({ totalResidentVertices: 5, totalResidentFeatures: 1 })),
        isTileResidentInCandidateSet: vi.fn(() => true),
        isTileCompleteInCandidateSet: vi.fn(() => true),
      });
      const session = startCandidateArmSession({ dataset: "ds_x", canvas });

      // Gen1 bootstrap: establishes the frame via a genuine Completed terminal.
      await session.reissueUnrestricted(null, null);
      lastSink().onBatch(new Uint8Array([1]), true);
      completeUntiledLook();
      expect(session.manager.gridFrame).not.toBeNull();

      // Gen2 (Apply/Clear): its own untiled stream ("sh_orphan"), deliberately left open --
      // `manager.gridFrame` persists across the reissue.
      viewportQueryMock.mockReset().mockResolvedValueOnce({ stream: "sh_orphan" });
      await session.reissueUnrestricted(null, null);
      const orphanSink = lastSink(); // captured before gen3 supersedes gen2, below

      // Gen3 (a SECOND Apply/Clear, racing gen2's own still-open untiled stream): gen2's "sh_orphan" is
      // now the ORPHAN -- `untiledStreamHandle` moves on to gen3's own stream ("sh_2").
      viewportQueryMock.mockReset().mockResolvedValueOnce({ stream: "sh_2" });
      await session.reissueUnrestricted(null, null);
      expect(session.manager.gridFrame).not.toBeNull(); // persists across both reissues

      // A plan runs against gen3's own current frame -- trivially complete (every tile alreadyResident).
      session.onViewportChanged({ xmin: -10, ymin: -10, xmax: 10, ymax: 10 });
      await vi.advanceTimersByTimeAsync(VIEWPORT_QUERY_MIN_INTERVAL_MS);
      expect(session.isFillComplete()).toBe(true);

      logSessionEventMock.mockClear();
      // The ORPHAN's own late terminal arrives NOW, reporting a genuine failure -- but it belongs to a
      // SUPERSEDED generation (`untiledStreamHandle` is "sh_2", not "sh_orphan").
      expect(() => orphanSink.onTerminal({ kind: "ProducerFailed", detail: "engine.stream_failed" })).not.toThrow();

      // S-1: no false failure accounting lands in the CURRENT (gen3) generation.
      expect(session.isFillComplete()).toBe(true);
      // The log line still fires, but labelled superseded rather than reading identically to a
      // current-generation terminal's own line.
      expect(logSessionEventMock).toHaveBeenCalledWith("candidate-untiled-terminal", expect.stringContaining("superseded"));
    } finally {
      vi.useRealTimers();
    }
  });

  it("an orphaned previous-generation untiled terminal never triggers the M-1 re-emit -- a standing untiledStreamStillRunning claim about the CURRENT stream is not retracted by an orphan (S-C)", async () => {
    const canvas = fakeCanvas({
      pushTileBatch: vi.fn(() => ({ ...OK_INGEST, fitAnchor: { xmin: 0, ymin: 0, xmax: 0, ymax: 0 } })),
      getResidentCounts: vi.fn(() => ({ totalResidentVertices: 5, totalResidentFeatures: 2 })),
    });
    const onResidencyStatusChange = vi.fn();
    const session = startCandidateArmSession({ dataset: "ds_x", canvas, onResidencyStatusChange });

    // Gen1 bootstrap: deliberately left open, no batch, no terminal -- STILL FRAMELESS.
    await session.reissueUnrestricted(null, null);
    const gen1OrphanSink = lastSink(); // captured before gen2 supersedes it
    expect(session.manager.gridFrame).toBeNull();

    // Gen2 (Apply/Clear racing gen1's still-open first look): also frameless, also left open.
    viewportQueryMock.mockReset().mockResolvedValueOnce({ stream: "sh_gen2" });
    await session.reissueUnrestricted(null, null);
    expect(session.manager.gridFrame).toBeNull();

    onResidencyStatusChange.mockClear();
    // Frameless relinquish: gen2's untiled stream is NOT cancelled (entry 35's boundary); the
    // standing status truthfully says gen2's stream is still running.
    session.relinquishFill();
    expect(onResidencyStatusChange).toHaveBeenCalledWith(
      expect.objectContaining({ kind: "candidate-relinquished", untiledStreamStillRunning: true })
    );

    onResidencyStatusChange.mockClear();
    // Gen1's ORPHAN terminal fires. The standing claim is about gen2's stream, which IS still
    // running -- an orphan-triggered re-emit would silently retract a TRUE claim. Deleting the
    // `wasCurrent` gate on the re-emit makes this dispatch fire and this test fail.
    gen1OrphanSink.onTerminal({ kind: "Completed", detail: "" });
    expect(onResidencyStatusChange).not.toHaveBeenCalled();

    onResidencyStatusChange.mockClear();
    // Gen2's OWN terminal, later: now the re-emit is correct -- the ordinary variant applies.
    lastSink().onTerminal({ kind: "Completed", detail: "" });
    expect(onResidencyStatusChange).toHaveBeenCalledWith({ kind: "candidate-relinquished", residentFeatureCount: 2 });
    expect(onResidencyStatusChange).not.toHaveBeenCalledWith(
      expect.objectContaining({ untiledStreamStillRunning: expect.anything() })
    );
  });
});
