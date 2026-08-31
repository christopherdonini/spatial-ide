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
import { UNTILED_FIRST_LOOK_ROW_LIMIT } from "../canvas/tileGridConstants";
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

  it("a within-budget batch emits candidate-within-budget with the resident feature count read off canvas.getResidentCounts()", async () => {
    const canvas = fakeCanvas({
      pushTileBatch: vi.fn(() => ({ ...OK_INGEST, fitAnchor: { xmin: 0, ymin: 0, xmax: 0, ymax: 0 } })),
      getResidentCounts: vi.fn(() => ({ totalResidentVertices: 30, totalResidentFeatures: 3 })),
    });
    const onResidencyStatusChange = vi.fn();
    const session = startCandidateArmSession({ dataset: "ds_x", canvas, onResidencyStatusChange });

    await session.reissueUnrestricted(null, null);
    onResidencyStatusChange.mockClear(); // drop reissueUnrestricted's own query-issued event(s)
    lastSink().onBatch(new Uint8Array([1]), true);

    expect(onResidencyStatusChange).toHaveBeenCalledWith({ kind: "candidate-within-budget", residentFeatureCount: 3 });
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
