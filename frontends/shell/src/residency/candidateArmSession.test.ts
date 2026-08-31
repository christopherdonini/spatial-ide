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

import type { TileBatchIngestOutcome, WorkingCanvasHandle } from "../canvas/WorkingCanvas";
import type { StreamSink } from "../streaming/transport";
import { VIEWPORT_QUERY_MIN_INTERVAL_MS } from "../streaming/viewportStreamManager";
import { INITIAL_TILE_KEY, startCandidateArmSession } from "./candidateArmSession";

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
    expect(viewportQueryMock).toHaveBeenCalledWith("ds_x", null, null, null, null);
    expect(session.manager.gridFrame).toBeNull(); // not established until a batch actually delivers
  });

  it("a batch carrying a fitAnchor establishes the grid frame exactly once, and feeds it to the canvas", async () => {
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

    expect(canvas.pushTileBatch).toHaveBeenCalledWith(INITIAL_TILE_KEY, "sh_1", 0, expect.any(Uint8Array));
    expect(session.manager.gridFrame).not.toBeNull();
    expect(canvas.establishTileGridContext).toHaveBeenCalledTimes(1);

    // A SECOND batch, with a wider fitAnchor, must NOT move the frame again (establishGridFrame's
    // own "no-op past the first call" contract).
    const frameAfterFirst = session.manager.gridFrame;
    sink.onBatch(new Uint8Array([2]), true);
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
    expect(session.manager.gridFrame).not.toBeNull();

    viewportQueryMock.mockClear();
    viewportQueryMock.mockResolvedValue({ stream: "sh_2" });
    (canvas.clearAllTiles as ReturnType<typeof vi.fn>).mockClear();
    (canvas.resetFitForNewGeneration as ReturnType<typeof vi.fn>).mockClear();

    const outcome = await session.reissueUnrestricted(null, { predicate: "x > 1", dialect: "duckdb_expr_0" } as never);

    expect(canvas.clearAllTiles).toHaveBeenCalledTimes(1);
    expect(canvas.resetFitForNewGeneration).toHaveBeenCalledTimes(1);
    // The frame itself resets to null internally (a fresh session's anchor problem again) -- the
    // very next batch is what re-establishes it, exactly like the dataset's own first open.
    expect(outcome).toEqual({ kind: "issued", streamHandle: "sh_2" });
    expect(viewportQueryMock).toHaveBeenCalledWith("ds_x", null, null, null, { predicate: "x > 1", dialect: "duckdb_expr_0" });
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
    // The untiled "first look" stream's own FIRST batch establishes the frame and is then
    // self-cancelled (its only purpose served -- this module's own doc comment on `issueUntiledQuery`'s
    // `onBatch`) -- so a SECOND batch must arrive via a real TILE stream, not the same untiled sink.
    lastSink().onBatch(new Uint8Array([1]), true);
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
});
