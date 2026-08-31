// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { beforeEach, describe, expect, it, vi } from "vitest";

const viewportQueryMock = vi.hoisted(() => vi.fn());
const cancelMock = vi.hoisted(() => vi.fn());
vi.mock("../skp/client", () => ({ viewportQuery: viewportQueryMock, cancel: cancelMock }));

const dataPlaneAttachMock = vi.hoisted(() => vi.fn());
vi.mock("./dataPlaneClient", () => ({ dataPlaneAttach: dataPlaneAttachMock }));

const startStreamMock = vi.hoisted(() => vi.fn());
vi.mock("./adapterWs", () => ({ startStream: startStreamMock }));

import type { TileGridLevel } from "../canvas/tileGridConstants";
import { MAX_IN_FLIGHT_TILE_STREAMS } from "../canvas/tileGridConstants";
import type { StreamSink } from "./transport";
import type { TileResidencyAccessor, TileViewportStreamManagerOptions } from "./tileViewportStreamManager";
import { TileViewportStreamManager } from "./tileViewportStreamManager";

const ANCHOR = { xmin: 0, ymin: 0, xmax: 100, ymax: 100 };

function flushMicrotasks(): Promise<void> {
  return new Promise((r) => setTimeout(r, 0));
}

function fakeResidency(residentKeys: string[] = []): TileResidencyAccessor {
  const set = new Set(residentKeys);
  return { isTileResident: (k) => set.has(k) };
}

function makeManager(overrides: Partial<TileViewportStreamManagerOptions> = {}) {
  const onBatch = vi.fn();
  const onTileSuperseded = vi.fn();
  const onTerminal = vi.fn();
  const manager = new TileViewportStreamManager({
    dataset: "ds_x",
    residency: fakeResidency(),
    onBatch,
    onTileSuperseded,
    onTerminal,
    ...overrides,
  });
  return { manager, onBatch, onTileSuperseded, onTerminal };
}

describe("TileViewportStreamManager", () => {
  beforeEach(() => {
    // Default: never resolves, unless a specific test queues its own `mockResolvedValueOnce`s
    // (consumed first, in order) -- several planning-focused tests below issue a mint for a tile
    // they never intend to actually complete (e.g. a NEW tile a superseding camera change also
    // happens to cover), and letting that hang harmlessly avoids an unhandled-rejection crash from
    // `ticket.stream` on a `mockReset()`-cleared implementation's default `undefined` return.
    viewportQueryMock.mockReset().mockImplementation(() => new Promise(() => {}));
    cancelMock.mockReset().mockResolvedValue({ state: "requested" });
    dataPlaneAttachMock.mockReset().mockResolvedValue({ url: "ws://127.0.0.1:1/stream", subprotocols: ["spatial-dp.v0", "tok.x"] });
    startStreamMock.mockReset().mockReturnValue({ cancel: vi.fn(), stats: { reassemblyCopies: 0, jsonFramesSeen: 0 } });
  });

  describe("grid frame establishment", () => {
    it("onCameraChange before establishGridFrame reports no-frame and issues nothing", () => {
      const { manager } = makeManager();
      const outcome = manager.onCameraChange(ANCHOR);
      expect(outcome).toEqual({ kind: "no-frame" });
      expect(viewportQueryMock).not.toHaveBeenCalled();
    });

    it("establishGridFrame is idempotent -- a second call does not move the frame", () => {
      const { manager } = makeManager();
      manager.establishGridFrame(ANCHOR);
      const frame1 = manager.gridFrame;
      manager.establishGridFrame({ xmin: 500, ymin: 500, xmax: 600, ymax: 600 });
      expect(manager.gridFrame).toEqual(frame1);
    });

    it("defaults to the medium level when none is supplied", () => {
      const { manager } = makeManager();
      expect(manager.activeLevel).toBe("medium");
    });

    it("honours a caller-supplied level", () => {
      const { manager } = makeManager({ level: "fine" as TileGridLevel });
      expect(manager.activeLevel).toBe("fine");
    });
  });

  describe("planning: camera change issues exactly the non-resident covering tiles, capped", () => {
    it("issues one viewport_query per covering tile up to MAX_IN_FLIGHT_TILE_STREAMS, queues the rest", () => {
      const { manager } = makeManager();
      manager.establishGridFrame(ANCHOR); // baseSpan 200, cellSize at medium = 12.5
      viewportQueryMock.mockReturnValue(new Promise(() => {})); // never resolves -- inspect planning only

      // A bbox spanning a 3x2 block of medium cells -> 6 covering tiles, more than the cap of 3.
      const frame = manager.gridFrame!;
      const cellSize = frame.baseSpan / 16;
      const bbox = {
        xmin: frame.originX,
        ymin: frame.originY,
        xmax: frame.originX + 3 * cellSize,
        ymax: frame.originY + 2 * cellSize,
      };
      const outcome = manager.onCameraChange(bbox);
      expect(outcome.kind).toBe("planned");
      if (outcome.kind !== "planned") throw new Error("unreachable");
      expect(outcome.issued).toHaveLength(MAX_IN_FLIGHT_TILE_STREAMS);
      expect(outcome.queued).toHaveLength(3); // 6 total - 3 issued
      expect(manager.inFlightCount).toBe(0); // tickets not yet minted (still queued at "queued" state pre-resolve)
      expect(viewportQueryMock).toHaveBeenCalledTimes(MAX_IN_FLIGHT_TILE_STREAMS);
    });

    it("does not re-request an already-resident tile", () => {
      const residentKey = "0:0";
      const { manager } = makeManager({ residency: fakeResidency([residentKey]) });
      manager.establishGridFrame(ANCHOR);
      viewportQueryMock.mockReturnValue(new Promise(() => {}));

      const frame = manager.gridFrame!;
      const cellSize = frame.baseSpan / 16;
      const bbox = { xmin: frame.originX, ymin: frame.originY, xmax: frame.originX + cellSize, ymax: frame.originY + cellSize };
      const outcome = manager.onCameraChange(bbox);
      if (outcome.kind !== "planned") throw new Error("unreachable");
      expect(outcome.alreadyResident).toEqual([residentKey]);
      expect(outcome.issued).toEqual([]);
      expect(viewportQueryMock).not.toHaveBeenCalled();
    });

    it("does not re-request a tile already in flight from a prior camera change", async () => {
      const { manager } = makeManager();
      manager.establishGridFrame(ANCHOR);
      viewportQueryMock.mockResolvedValueOnce({ stream: "sh_1", expires_in_ms: 30_000 });

      const frame = manager.gridFrame!;
      const cellSize = frame.baseSpan / 16;
      const bbox = { xmin: frame.originX, ymin: frame.originY, xmax: frame.originX + cellSize, ymax: frame.originY + cellSize };
      manager.onCameraChange(bbox);
      await flushMicrotasks();
      expect(manager.inFlightCount).toBe(1);

      viewportQueryMock.mockClear();
      const outcome2 = manager.onCameraChange(bbox); // identical viewport, same covering tile
      if (outcome2.kind !== "planned") throw new Error("unreachable");
      expect(outcome2.issued).toEqual([]);
      expect(outcome2.queued).toEqual([]);
      expect(viewportQueryMock).not.toHaveBeenCalled();
    });

    it("queued tiles drain as in-flight streams end", async () => {
      const { manager } = makeManager();
      manager.establishGridFrame(ANCHOR);

      const frame = manager.gridFrame!;
      const cellSize = frame.baseSpan / 16;
      const bbox = {
        xmin: frame.originX,
        ymin: frame.originY,
        xmax: frame.originX + 4 * cellSize, // 4 columns, 1 row -> 4 covering tiles
        ymax: frame.originY + cellSize,
      };

      viewportQueryMock
        .mockResolvedValueOnce({ stream: "sh_1", expires_in_ms: 30_000 })
        .mockResolvedValueOnce({ stream: "sh_2", expires_in_ms: 30_000 })
        .mockResolvedValueOnce({ stream: "sh_3", expires_in_ms: 30_000 });

      const outcome = manager.onCameraChange(bbox);
      if (outcome.kind !== "planned") throw new Error("unreachable");
      expect(outcome.issued).toHaveLength(3);
      expect(outcome.queued).toHaveLength(1);
      await flushMicrotasks();
      expect(manager.inFlightCount).toBe(3);
      expect(manager.queuedCount).toBe(1);

      viewportQueryMock.mockResolvedValueOnce({ stream: "sh_4", expires_in_ms: 30_000 });
      // End the first in-flight stream naturally.
      const sink = startStreamMock.mock.calls[0][0].sink as StreamSink;
      sink.onTerminal({ kind: "Completed", detail: "" });
      await flushMicrotasks();

      expect(manager.queuedCount).toBe(0);
      expect(startStreamMock).toHaveBeenCalledTimes(4); // the 4th tile's stream now started
    });

    it("a superseding camera change drops queued-not-issued tiles silently (no cancel call for them)", () => {
      const { manager } = makeManager();
      manager.establishGridFrame(ANCHOR);
      viewportQueryMock.mockReturnValue(new Promise(() => {}));

      const frame = manager.gridFrame!;
      const cellSize = frame.baseSpan / 16;
      const wideBbox = {
        xmin: frame.originX,
        ymin: frame.originY,
        xmax: frame.originX + 4 * cellSize,
        ymax: frame.originY + cellSize,
      };
      manager.onCameraChange(wideBbox);
      expect(manager.queuedCount).toBe(1);

      cancelMock.mockClear();
      // A new camera change covering only the FIRST tile -- the queued 4th tile is dropped silently.
      const narrowBbox = { xmin: frame.originX, ymin: frame.originY, xmax: frame.originX + cellSize, ymax: frame.originY + cellSize };
      manager.onCameraChange(narrowBbox);
      expect(manager.queuedCount).toBe(0);
      // No SKP cancel is issued for a queued-but-never-minted tile -- there is no ticket to cancel.
      expect(cancelMock).not.toHaveBeenCalled();
    });
  });

  describe("tile bbox rides as an ordinary bbox param (C3)", () => {
    it("issues viewport_query with the tile's own bbox, no extra parameter", () => {
      const { manager } = makeManager();
      manager.establishGridFrame(ANCHOR);
      viewportQueryMock.mockReturnValue(new Promise(() => {}));
      const frame = manager.gridFrame!;
      const cellSize = frame.baseSpan / 16;
      const bbox = { xmin: frame.originX, ymin: frame.originY, xmax: frame.originX + cellSize, ymax: frame.originY + cellSize };

      manager.onCameraChange(bbox);

      expect(viewportQueryMock).toHaveBeenCalledTimes(1);
      const args = viewportQueryMock.mock.calls[0];
      expect(args[0]).toBe("ds_x");
      expect(args[1]).toHaveProperty("xmin");
      expect(args[1]).toHaveProperty("xmax");
      expect(args[2]).toBeNull(); // bbox_crs
      expect(args[3]).toBeNull(); // limit
    });
  });

  describe("batch delivery and per-tile supersede discipline (D3.7, per-tile)", () => {
    it("a batch for the active tile stream is admitted with an ascending per-stream sequence", async () => {
      const { manager, onBatch } = makeManager();
      manager.establishGridFrame(ANCHOR);
      viewportQueryMock.mockResolvedValueOnce({ stream: "sh_1", expires_in_ms: 30_000 });
      const frame = manager.gridFrame!;
      const cellSize = frame.baseSpan / 16;
      const bbox = { xmin: frame.originX, ymin: frame.originY, xmax: frame.originX + cellSize, ymax: frame.originY + cellSize };
      manager.onCameraChange(bbox);
      await flushMicrotasks();

      const sink = startStreamMock.mock.calls[0][0].sink as StreamSink;
      const p1 = new Uint8Array([1]);
      const p2 = new Uint8Array([2]);
      sink.onBatch(p1, true);
      sink.onBatch(p2, true);

      expect(onBatch).toHaveBeenNthCalledWith(1, "0:0", "sh_1", 0, p1);
      expect(onBatch).toHaveBeenNthCalledWith(2, "0:0", "sh_1", 1, p2);
    });

    it("a tile no longer covered by a new camera change is cancelled and reported superseded; resident tiles are untouched", async () => {
      const { manager, onTileSuperseded } = makeManager();
      manager.establishGridFrame(ANCHOR);
      viewportQueryMock.mockResolvedValueOnce({ stream: "sh_1", expires_in_ms: 30_000 });
      const frame = manager.gridFrame!;
      const cellSize = frame.baseSpan / 16;
      const tileABbox = { xmin: frame.originX, ymin: frame.originY, xmax: frame.originX + cellSize, ymax: frame.originY + cellSize };
      manager.onCameraChange(tileABbox);
      await flushMicrotasks();
      expect(manager.inFlightCount).toBe(1);

      // Pan far away -- tile "0:0" is no longer covered.
      const farBbox = { xmin: 10_000, ymin: 10_000, xmax: 10_000 + cellSize, ymax: 10_000 + cellSize };
      manager.onCameraChange(farBbox);

      expect(cancelMock).toHaveBeenCalledWith("sh_1");
      expect(onTileSuperseded).toHaveBeenCalledWith("0:0", "sh_1");
    });

    it("a batch arriving late from a tile stream this manager already superseded is dropped, never rendered", async () => {
      const { manager, onBatch } = makeManager();
      manager.establishGridFrame(ANCHOR);
      viewportQueryMock.mockResolvedValueOnce({ stream: "sh_1", expires_in_ms: 30_000 });
      const frame = manager.gridFrame!;
      const cellSize = frame.baseSpan / 16;
      const tileABbox = { xmin: frame.originX, ymin: frame.originY, xmax: frame.originX + cellSize, ymax: frame.originY + cellSize };
      manager.onCameraChange(tileABbox);
      await flushMicrotasks();
      const staleSink = startStreamMock.mock.calls[0][0].sink as StreamSink;

      const farBbox = { xmin: 10_000, ymin: 10_000, xmax: 10_000 + cellSize, ymax: 10_000 + cellSize };
      manager.onCameraChange(farBbox);

      staleSink.onBatch(new Uint8Array([9, 9, 9]), true);
      expect(onBatch).not.toHaveBeenCalled();
    });

    it("a terminal for a self-superseded tile stream is suppressed -- never reaches onTerminal", async () => {
      const { manager, onTerminal } = makeManager();
      manager.establishGridFrame(ANCHOR);
      viewportQueryMock.mockResolvedValueOnce({ stream: "sh_1", expires_in_ms: 30_000 });
      const frame = manager.gridFrame!;
      const cellSize = frame.baseSpan / 16;
      const tileABbox = { xmin: frame.originX, ymin: frame.originY, xmax: frame.originX + cellSize, ymax: frame.originY + cellSize };
      manager.onCameraChange(tileABbox);
      await flushMicrotasks();
      const staleSink = startStreamMock.mock.calls[0][0].sink as StreamSink;

      const farBbox = { xmin: 10_000, ymin: 10_000, xmax: 10_000 + cellSize, ymax: 10_000 + cellSize };
      manager.onCameraChange(farBbox);
      staleSink.onTerminal({ kind: "ProducerFailed", detail: "cancelled" });

      expect(onTerminal).not.toHaveBeenCalled();
    });

    it("a genuine failure terminal (not self-cancelled) still reaches onTerminal", async () => {
      const { manager, onTerminal } = makeManager();
      manager.establishGridFrame(ANCHOR);
      viewportQueryMock.mockResolvedValueOnce({ stream: "sh_1", expires_in_ms: 30_000 });
      const frame = manager.gridFrame!;
      const cellSize = frame.baseSpan / 16;
      const bbox = { xmin: frame.originX, ymin: frame.originY, xmax: frame.originX + cellSize, ymax: frame.originY + cellSize };
      manager.onCameraChange(bbox);
      await flushMicrotasks();
      const sink = startStreamMock.mock.calls[0][0].sink as StreamSink;

      sink.onTerminal({ kind: "ProducerFailed", detail: "engine.crs_undeclared" });

      expect(onTerminal).toHaveBeenCalledWith("0:0", "sh_1", { kind: "ProducerFailed", detail: "engine.crs_undeclared" });
    });
  });

  describe("filter/dataset change: wholesale clear (item B's own carve-out)", () => {
    it("clearAll cancels every in-flight tile and reports every resident tile hint as superseded with a null handle", async () => {
      const { manager, onTileSuperseded } = makeManager();
      manager.establishGridFrame(ANCHOR);
      viewportQueryMock.mockResolvedValueOnce({ stream: "sh_1", expires_in_ms: 30_000 });
      const frame = manager.gridFrame!;
      const cellSize = frame.baseSpan / 16;
      const bbox = { xmin: frame.originX, ymin: frame.originY, xmax: frame.originX + cellSize, ymax: frame.originY + cellSize };
      manager.onCameraChange(bbox);
      await flushMicrotasks();

      manager.clearAll(["3:3", "4:4"]);

      expect(cancelMock).toHaveBeenCalledWith("sh_1");
      expect(onTileSuperseded).toHaveBeenCalledWith("0:0", "sh_1");
      expect(onTileSuperseded).toHaveBeenCalledWith("3:3", null);
      expect(onTileSuperseded).toHaveBeenCalledWith("4:4", null);
      expect(manager.inFlightCount).toBe(0);
    });

    it("clearAll also drops the queue and resets overBudget", () => {
      const { manager } = makeManager();
      manager.establishGridFrame(ANCHOR);
      viewportQueryMock.mockReturnValue(new Promise(() => {}));
      const frame = manager.gridFrame!;
      const cellSize = frame.baseSpan / 16;
      const wideBbox = {
        xmin: frame.originX,
        ymin: frame.originY,
        xmax: frame.originX + 4 * cellSize,
        ymax: frame.originY + cellSize,
      };
      manager.onCameraChange(wideBbox);
      expect(manager.queuedCount).toBe(1);
      manager.setOverBudget(true, ["9:9"]);

      manager.clearAll();

      expect(manager.queuedCount).toBe(0);
      expect(manager.overBudget).toBe(false);
      expect(manager.unrequestedTilesOverBudget).toEqual([]);
    });
  });

  describe("overBudget (item D's own callback/state field seam)", () => {
    it("stops issuing NEW tile requests while overBudget is set, but does not disturb resident/in-flight tiles", async () => {
      const { manager } = makeManager();
      manager.establishGridFrame(ANCHOR);
      manager.setOverBudget(true, ["0:0"]);

      const frame = manager.gridFrame!;
      const cellSize = frame.baseSpan / 16;
      const bbox = { xmin: frame.originX, ymin: frame.originY, xmax: frame.originX + cellSize, ymax: frame.originY + cellSize };
      const outcome = manager.onCameraChange(bbox);

      expect(outcome).toEqual({ kind: "planned", issued: [], queued: [], alreadyResident: [] });
      expect(viewportQueryMock).not.toHaveBeenCalled();
      expect(manager.overBudget).toBe(true);
      expect(manager.unrequestedTilesOverBudget).toEqual(["0:0"]);
    });

    it("clearing overBudget resumes issuance on the next camera change", () => {
      const { manager } = makeManager();
      manager.establishGridFrame(ANCHOR);
      manager.setOverBudget(true);
      viewportQueryMock.mockReturnValue(new Promise(() => {}));

      const frame = manager.gridFrame!;
      const cellSize = frame.baseSpan / 16;
      const bbox = { xmin: frame.originX, ymin: frame.originY, xmax: frame.originX + cellSize, ymax: frame.originY + cellSize };
      manager.setOverBudget(false);
      const outcome = manager.onCameraChange(bbox);
      if (outcome.kind !== "planned") throw new Error("unreachable");
      expect(outcome.issued).toEqual(["0:0"]);
    });
  });

  describe("stop()", () => {
    it("cancels every in-flight tile stream and refuses future onCameraChange calls", async () => {
      const { manager } = makeManager();
      manager.establishGridFrame(ANCHOR);
      viewportQueryMock.mockResolvedValueOnce({ stream: "sh_1", expires_in_ms: 30_000 });
      const frame = manager.gridFrame!;
      const cellSize = frame.baseSpan / 16;
      const bbox = { xmin: frame.originX, ymin: frame.originY, xmax: frame.originX + cellSize, ymax: frame.originY + cellSize };
      manager.onCameraChange(bbox);
      await flushMicrotasks();

      await manager.stop();

      expect(cancelMock).toHaveBeenCalledWith("sh_1");
      expect(manager.onCameraChange(bbox)).toEqual({ kind: "stopped" });
    });
  });
});
