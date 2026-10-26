// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { beforeEach, describe, expect, it, vi } from "vitest";

// Only the transport is mocked (SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md section 4, Amendment 8 item 5): the client's `viewportQuery` and `cancel` (with the REAL `SkpCallError`, which the source and `liveTicketSet`
// branch on), the data-plane attach, `startStream`, and the session log. The source decodes through the real `decodeBatch`, and the batches are the helper's IPC.
const viewportQueryMock = vi.hoisted(() => vi.fn());
const cancelMock = vi.hoisted(() => vi.fn());
vi.mock("../skp/client", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../skp/client")>();
  return { ...actual, viewportQuery: viewportQueryMock, cancel: cancelMock };
});
const dataPlaneAttachMock = vi.hoisted(() => vi.fn());
vi.mock("../streaming/dataPlaneClient", () => ({ dataPlaneAttach: dataPlaneAttachMock }));
const startStreamMock = vi.hoisted(() => vi.fn());
vi.mock("../streaming/adapterWs", () => ({ startStream: startStreamMock }));
const logSessionEventMock = vi.hoisted(() => vi.fn());
vi.mock("../diagnostics/log", () => ({ logSessionEvent: logSessionEventMock }));

import { ENCODING_POLYGON, decodeBatch } from "../canvas/decodeBatch";
import type { BatchAttributes } from "../canvas/decodeBatch";
import { SkpCallError } from "../skp/client";
import { FILTER_DIALECT_DUCKDB_EXPR_0 } from "../skp/types";
import type { Filter } from "../skp/types";
import { TileViewportStreamManager } from "../streaming/tileViewportStreamManager";
import type { StreamSink } from "../streaming/transport";
import { attributeBatchIpc } from "../testUtils/attributeBatchIpc";
import { REAL_SOURCE_CHANGED_TERMINAL_DETAIL, REAL_SOURCE_COVERAGE_LOST_TERMINAL_DETAIL } from "../testUtils/terminalShapes";
import { TABLE_MAX_ATTRIBUTE_BYTES, TABLE_MAX_ROWS } from "./tableConstants";
import { resultIsComplete, TableSource, tableLine } from "./tableSource";

const filterOf = (predicate: string): Filter => ({ predicate, dialect: FILTER_DIALECT_DUCKDB_EXPR_0 });
const flush = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 0));
const sinkOf = (handle: string): StreamSink => startStreamMock.mock.calls.find((call) => call[0].ticketHandle === handle)![0].sink as StreamSink;
const tagBatch = (ids: bigint[], tags: Array<string | null> = ids.map((id) => `t${id}`)) => attributeBatchIpc(ids, [{ name: "tag", kind: "utf8", values: tags }]).ipc;
const newSource = (onSessionEnded = vi.fn()) => new TableSource({ dataset: "ds_x", geometryColumn: "geometry", geometryEncoding: ENCODING_POLYGON, projection: ["tag"], onSessionEnded });

beforeEach(() => {
  let minted = 0;
  viewportQueryMock.mockReset().mockImplementation(async () => ({ stream: `sh_${++minted}`, expires_in_ms: 30_000 }));
  cancelMock.mockReset().mockResolvedValue({ state: "requested" });
  dataPlaneAttachMock.mockReset().mockResolvedValue({ url: "ws://127.0.0.1:1/stream", subprotocols: ["spatial-dp.v0", "tok.x"] });
  startStreamMock.mockReset().mockReturnValue({ cancel: vi.fn(), stats: { reassemblyCopies: 0, jsonFramesSeen: 0 } });
  logSessionEventMock.mockReset();
});

describe("the first scope's source (section 2.4 (b))", () => {
  // RECORDED MUTATION for "PC-U1": in `start` (tableSource.ts) send `null` as the query's `limit`. Expected failure: the fourth argument is null where "1000" was expected.
  it("PC-U1: one stream with bbox null, TABLE_MAX_ROWS, the filter and the projection; a supersede cancels the held handle before it issues; the count lines", async () => {
    const source = newSource();
    const a = filterOf("zone = 'a'");
    await source.start(a);
    await flush();
    expect(viewportQueryMock).toHaveBeenCalledTimes(1);
    expect(viewportQueryMock).toHaveBeenCalledWith("ds_x", null, null, String(TABLE_MAX_ROWS), a, ["tag"]);
    expect(startStreamMock).toHaveBeenCalledTimes(1);

    sinkOf("sh_1").onBatch(tagBatch([1n, 2n]), true);
    expect(source.getSnapshot().count).toBe(2);
    sinkOf("sh_1").onTerminal({ kind: "Completed", detail: "" });
    expect(source.getSnapshot().phase).toBe("completed");
    expect(tableLine(source.getSnapshot())).toBe("[P6 placeholder] Showing all 2 features that pass the filter.");
    expect(resultIsComplete(source.getSnapshot())).toBe(true);

    // A supersede while the stream runs: cancel first (the call order is the proof of the one-handle bound), then the next query; the old stream's late batch is not added.
    const b = filterOf("zone = 'b'");
    await source.start(a);
    await flush();
    await source.start(b);
    await flush();
    expect(cancelMock).toHaveBeenCalledWith("sh_2");
    expect(cancelMock.mock.invocationCallOrder[0]).toBeLessThan(viewportQueryMock.mock.invocationCallOrder[2]);
    expect(viewportQueryMock).toHaveBeenLastCalledWith("ds_x", null, null, String(TABLE_MAX_ROWS), b, ["tag"]);
    sinkOf("sh_2").onBatch(tagBatch([9n]), true);
    expect(source.getSnapshot().count).toBe(0);
    expect(source.getSnapshot().filter).toBe(b);

    // At the limit the line says more may pass; a result at the limit is not complete.
    const ids = Array.from({ length: TABLE_MAX_ROWS }, (_, i) => BigInt(i));
    sinkOf("sh_3").onBatch(tagBatch(ids), true);
    sinkOf("sh_3").onTerminal({ kind: "Completed", detail: "" });
    expect(tableLine(source.getSnapshot())).toBe(`[P6 placeholder] Showing the first ${TABLE_MAX_ROWS} features returned, in no declared order; more may pass the filter.`);
    expect(resultIsComplete(source.getSnapshot())).toBe(false);
  });

  it("a refusal, a failed terminal and source_changed end the result as section 2.4 (b) says; a cancelled stream keeps its rows and is not complete", async () => {
    const refused = newSource();
    viewportQueryMock.mockRejectedValueOnce(new SkpCallError({ code: "skp.filter_too_long", message: "predicate too long", fields: { limit: "1024" } }));
    await refused.start(filterOf("x"));
    await flush();
    expect(refused.getSnapshot().phase).toBe("refused");
    expect(refused.getSnapshot().refusal).toEqual({ code: "skp.filter_too_long", message: "predicate too long", fields: [["limit", "1024"]] });
    expect(startStreamMock).not.toHaveBeenCalled();

    const failed = newSource();
    await failed.start(null);
    await flush();
    sinkOf("sh_1").onTerminal({ kind: "ProducerFailed", detail: "engine.connections_exhausted: no connection was free" });
    expect(failed.getSnapshot().refusal).toEqual({ code: "engine.connections_exhausted", message: "no connection was free", fields: [] });

    const onSessionEnded = vi.fn();
    const changed = newSource(onSessionEnded);
    await changed.start(null);
    await flush();
    sinkOf("sh_2").onBatch(tagBatch([1n]), true);
    sinkOf("sh_2").onTerminal({ kind: "ProducerFailed", detail: REAL_SOURCE_CHANGED_TERMINAL_DETAIL });
    expect(onSessionEnded).toHaveBeenCalledWith(REAL_SOURCE_CHANGED_TERMINAL_DETAIL);
    expect(changed.getSnapshot()).toMatchObject({ phase: "ended", count: 0 });
    await changed.start(null);
    expect(viewportQueryMock).toHaveBeenCalledTimes(3); // nothing is issued again after the session ended

    const cancelled = newSource();
    await cancelled.start(null);
    await flush();
    sinkOf("sh_3").onBatch(tagBatch([1n, 2n]), true);
    cancelled.cancel();
    sinkOf("sh_3").onBatch(tagBatch([3n]), true);
    sinkOf("sh_3").onTerminal({ kind: "ProducerFailed", detail: "cancelled" }); // the SKP cancel path's own terminal: expected, not a refusal
    expect(cancelMock).toHaveBeenCalledWith("sh_3");
    expect(cancelled.getSnapshot()).toMatchObject({ phase: "cancelled", count: 2, refusal: null });
    expect(resultIsComplete(cancelled.getSnapshot())).toBe(false);
  });

  // RECORDED MUTATION for "PC-U13": in `add` (tableSource.ts) check each batch alone (`if (bytes > TABLE_MAX_ATTRIBUTE_BYTES) {`). Expected failure: the fourth batch is added, so the result holds four batches where three were expected.
  it("PC-U13: batches are decoded for real, the first k within the ceiling are added in order, the next one stops the result: one cancel, no later batch, the stopped line and no count line", async () => {
    const batches = [0, 1, 2, 3].map((i) => attributeBatchIpc([BigInt(100 + i)], [{ name: "tag", kind: "utf8", values: [String(i).padEnd(20_000_000, "x")] }]));
    const bytes = (decodeBatch("probe", 0, batches[0].ipc, "geometry", ENCODING_POLYGON, ["tag"], null).attributes as BatchAttributes).bytes;
    const k = Math.floor(TABLE_MAX_ATTRIBUTE_BYTES / bytes);
    expect(k).toBe(3);
    expect(bytes * (k + 1)).toBeGreaterThan(TABLE_MAX_ATTRIBUTE_BYTES); // the batches pass 67,108,864 bytes in all, from real decodes

    const source = newSource();
    await source.start(null);
    await flush();
    for (const batch of batches) sinkOf("sh_1").onBatch(batch.ipc, true);
    sinkOf("sh_1").onBatch(batches[0].ipc, true); // delivered after the stop: not added
    const snapshot = source.getSnapshot();
    expect(snapshot.phase).toBe("stopped");
    expect(snapshot.count).toBe(k);
    expect([0, 1, 2].map((i) => snapshot.rowAt(i).id)).toEqual([100n, 101n, 102n]);
    expect([0, 1, 2].map((i) => (snapshot.rowAt(i).row![0].value as { text: string }).text.slice(0, 1))).toEqual(["0", "1", "2"]);
    expect(snapshot.ids).toEqual(new Set([100n, 101n, 102n]));
    expect(cancelMock).toHaveBeenCalledTimes(1);
    expect(cancelMock).toHaveBeenCalledWith("sh_1");
    expect(tableLine(snapshot)).toBe(
      `[P6 placeholder] The table stopped adding features: the next ones returned would have taken its attribute data past 64 MiB. Showing the first ${k} features returned, in no declared order; more may pass the filter.`
    );
    expect(resultIsComplete(snapshot)).toBe(false);
    expect(TABLE_MAX_ATTRIBUTE_BYTES).toBe(64 * 1024 * 1024); // the figure the stopped line names
  }, 60_000);

  // RECORDED MUTATION for "PC-U6": in `isRetryableRefusal` (tileViewportStreamManager.ts) return `false`. Expected failure: the tile's query is issued once, not twice.
  it("PC-U6: while the table's stream is open, a tile refused with engine.connections_exhausted is issued again exactly once; the table's handle is not cancelled and a batch after the retry is added", async () => {
    const source = newSource();
    await source.start(null);
    await flush();
    const manager = new TileViewportStreamManager({
      dataset: "ds_x",
      columns: null,
      residency: { isTileResident: () => false },
      onBatch: vi.fn(),
      onTileSuperseded: vi.fn(),
      onTerminal: vi.fn(),
    });
    manager.establishGridFrame({ xmin: 0, ymin: 0, xmax: 100, ymax: 100 }, "metre");
    const frame = manager.gridFrame!;
    const cell = frame.baseSpan / 16;
    const bbox = { xmin: frame.originX, ymin: frame.originY, xmax: frame.originX + cell, ymax: frame.originY + cell };
    viewportQueryMock
      .mockRejectedValueOnce(new SkpCallError({ code: "engine.connections_exhausted", message: "no admission lease was available", fields: { class: "admission", capacity: "4" } }))
      .mockResolvedValueOnce({ stream: "sh_tile", expires_in_ms: 30_000 });

    manager.onCameraChange(bbox);
    await flush();

    const tileCalls = viewportQueryMock.mock.calls.filter((call) => call[1] !== null);
    expect(tileCalls).toHaveLength(2);
    expect(tileCalls[1][1]).toEqual(tileCalls[0][1]);
    expect(logSessionEventMock).toHaveBeenCalledWith("tile-stream-mint-recovered", expect.stringContaining("sh_tile"));
    expect(cancelMock).not.toHaveBeenCalledWith("sh_1");
    sinkOf("sh_1").onBatch(tagBatch([5n]), true);
    expect(source.getSnapshot().count).toBe(1);
  });

  // RECORDED MUTATION for "PC-U16": in `isSessionEndedTerminal` (streaming/liveTicketSet.ts) match only `engine.source_changed`. Expected failure: PC-U16 (the session-ended callback is not called).
  it("PC-U16: a coverage-lost terminal ends the table with the same ended line as a source change", async () => {
    const onSessionEnded = vi.fn();
    const source = newSource(onSessionEnded);
    await source.start(null);
    await flush();
    sinkOf("sh_1").onBatch(tagBatch([1n]), true);
    sinkOf("sh_1").onTerminal({ kind: "ProducerFailed", detail: REAL_SOURCE_COVERAGE_LOST_TERMINAL_DETAIL });
    expect(onSessionEnded).toHaveBeenCalledWith(REAL_SOURCE_COVERAGE_LOST_TERMINAL_DETAIL);
    expect(source.getSnapshot()).toMatchObject({ phase: "ended", count: 0 });
    expect(tableLine(source.getSnapshot())).toBe("[P6 placeholder] The dataset's session ended, so the table was cleared; open the file again to load it.");
  });
});
