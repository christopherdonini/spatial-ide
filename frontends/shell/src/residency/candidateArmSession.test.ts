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

import type { TileBatchIngestOutcome, WorkingCanvasHandle } from "../canvas/WorkingCanvas";
import { MAX_RESIDENT_VERTICES } from "../canvas/limits";
import { DEFAULT_TILE_GRID_LEVEL, UNTILED_FIRST_LOOK_ROW_LIMIT } from "../canvas/tileGridConstants";
import { encodeDecU64 } from "../skp/codec";
import type { StreamSink } from "../streaming/transport";
import { VIEWPORT_QUERY_MIN_INTERVAL_MS } from "../streaming/viewportStreamManager";
import { INITIAL_TILE_KEY, startCandidateArmSession } from "./candidateArmSession";

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

      expect(onResidencyStatusChange).toHaveBeenCalledWith({ kind: "candidate-within-budget", residentFeatureCount: 3 });
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

      expect(onResidencyStatusChange).toHaveBeenCalledWith({
        kind: "candidate-over-budget",
        residentFeatureCount: 900,
        viewportTotal: null,
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
    expect(onResidencyStatusChange).toHaveBeenCalledWith({
      kind: "candidate-within-budget",
      residentFeatureCount: 1,
    });
  });
});
