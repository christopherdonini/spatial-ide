import { beforeEach, describe, expect, it, vi } from "vitest";

const viewportQueryMock = vi.hoisted(() => vi.fn());
const cancelMock = vi.hoisted(() => vi.fn());
vi.mock("../skp/client", () => ({ viewportQuery: viewportQueryMock, cancel: cancelMock }));

const dataPlaneAttachMock = vi.hoisted(() => vi.fn());
vi.mock("./dataPlaneClient", () => ({ dataPlaneAttach: dataPlaneAttachMock }));

const startStreamMock = vi.hoisted(() => vi.fn());
vi.mock("./adapterWs", () => ({ startStream: startStreamMock }));

import type { StreamSink } from "./transport";
import { VIEWPORT_QUERY_MIN_INTERVAL_MS, ViewportStreamManager } from "./viewportStreamManager";

function mockStream(handle: string) {
  viewportQueryMock.mockResolvedValueOnce({ stream: handle, expires_in_ms: 30_000 });
}

function sinkFor(callIndex: number): StreamSink {
  return startStreamMock.mock.calls[callIndex][0].sink as StreamSink;
}

describe("ViewportStreamManager (supersede-on-pan, D3.7)", () => {
  beforeEach(() => {
    viewportQueryMock.mockReset();
    cancelMock.mockReset().mockResolvedValue({ state: "requested" });
    dataPlaneAttachMock.mockReset().mockResolvedValue({ url: "ws://127.0.0.1:1/stream", subprotocols: ["spatial-dp.v0", "tok.x"] });
    startStreamMock.mockReset().mockReturnValue({ cancel: vi.fn(), stats: { reassemblyCopies: 0, jsonFramesSeen: 0 } });
  });

  it("the first request mints a ticket and starts a stream without cancelling anything", async () => {
    mockStream("sh_a");
    const onBatch = vi.fn();
    const onSuperseded = vi.fn();
    const manager = new ViewportStreamManager({ dataset: "ds_x", onBatch, onSuperseded });

    await manager.requestViewport(null, null, 1_000);

    expect(cancelMock).not.toHaveBeenCalled();
    expect(viewportQueryMock).toHaveBeenCalledWith("ds_x", null, null, null);
    expect(startStreamMock).toHaveBeenCalledTimes(1);
    expect(startStreamMock.mock.calls[0][0].ticketHandle).toBe("sh_a");
    expect(manager.activeStreamHandle).toBe("sh_a");
  });

  it("a batch for the active stream is admitted with an ascending sequence number", async () => {
    mockStream("sh_a");
    const onBatch = vi.fn();
    const manager = new ViewportStreamManager({ dataset: "ds_x", onBatch, onSuperseded: vi.fn() });
    await manager.requestViewport(null, null, 1_000);

    const sink = sinkFor(0);
    const p1 = new Uint8Array([1]);
    const p2 = new Uint8Array([2]);
    sink.onBatch(p1, true);
    sink.onBatch(p2, true);

    expect(onBatch).toHaveBeenNthCalledWith(1, "sh_a", 0, p1);
    expect(onBatch).toHaveBeenNthCalledWith(2, "sh_a", 1, p2);
  });

  it("supersede: cancels the previous stream before minting the next ticket, in that order", async () => {
    mockStream("sh_a");
    const onSuperseded = vi.fn();
    const manager = new ViewportStreamManager({ dataset: "ds_x", onBatch: vi.fn(), onSuperseded });
    await manager.requestViewport(null, null, 1_000);

    mockStream("sh_b");
    await manager.requestViewport(null, null, 1_000 + VIEWPORT_QUERY_MIN_INTERVAL_MS + 1);

    expect(cancelMock).toHaveBeenCalledWith("sh_a");
    expect(onSuperseded).toHaveBeenCalledWith("sh_a");
    expect(manager.activeStreamHandle).toBe("sh_b");

    const cancelOrder = cancelMock.mock.invocationCallOrder[0];
    const secondQueryOrder = viewportQueryMock.mock.invocationCallOrder[1];
    expect(cancelOrder).toBeLessThan(secondQueryOrder);
  });

  it("a batch arriving late from a superseded stream is dropped, never rendered (D3.7)", async () => {
    mockStream("sh_a");
    const onBatch = vi.fn();
    const manager = new ViewportStreamManager({ dataset: "ds_x", onBatch, onSuperseded: vi.fn() });
    await manager.requestViewport(null, null, 1_000);
    const staleSink = sinkFor(0);

    mockStream("sh_b");
    await manager.requestViewport(null, null, 1_000 + VIEWPORT_QUERY_MIN_INTERVAL_MS + 1);

    // The old connection's socket delivers one more frame after supersession -- a real race this
    // manager must resolve by checking the active handle, not by assuming the old socket is closed
    // instantly.
    staleSink.onBatch(new Uint8Array([9, 9, 9]), true);

    expect(onBatch).not.toHaveBeenCalled();
  });

  it("throttles: a second call inside VIEWPORT_QUERY_MIN_INTERVAL_MS is a silent no-op", async () => {
    mockStream("sh_a");
    const manager = new ViewportStreamManager({ dataset: "ds_x", onBatch: vi.fn(), onSuperseded: vi.fn() });
    await manager.requestViewport(null, null, 1_000);
    await manager.requestViewport(null, null, 1_000 + VIEWPORT_QUERY_MIN_INTERVAL_MS - 1);

    expect(viewportQueryMock).toHaveBeenCalledTimes(1);
    expect(manager.activeStreamHandle).toBe("sh_a");
  });

  it("a terminal outcome clears the active stream handle", async () => {
    mockStream("sh_a");
    const manager = new ViewportStreamManager({ dataset: "ds_x", onBatch: vi.fn(), onSuperseded: vi.fn() });
    await manager.requestViewport(null, null, 1_000);
    const sink = sinkFor(0);

    sink.onTerminal({ kind: "Completed", detail: "" });

    expect(manager.activeStreamHandle).toBeNull();
  });

  it("stop() cancels the active stream and clears it", async () => {
    mockStream("sh_a");
    const onSuperseded = vi.fn();
    const manager = new ViewportStreamManager({ dataset: "ds_x", onBatch: vi.fn(), onSuperseded });
    await manager.requestViewport(null, null, 1_000);

    await manager.stop();

    expect(cancelMock).toHaveBeenCalledWith("sh_a");
    expect(onSuperseded).toHaveBeenCalledWith("sh_a");
    expect(manager.activeStreamHandle).toBeNull();
  });

  it("a rejected cancel call does not prevent superseding client-side", async () => {
    mockStream("sh_a");
    const onSuperseded = vi.fn();
    const manager = new ViewportStreamManager({ dataset: "ds_x", onBatch: vi.fn(), onSuperseded });
    await manager.requestViewport(null, null, 1_000);

    cancelMock.mockRejectedValueOnce(new Error("transport hiccup"));
    mockStream("sh_b");
    await manager.requestViewport(null, null, 1_000 + VIEWPORT_QUERY_MIN_INTERVAL_MS + 1);

    expect(manager.activeStreamHandle).toBe("sh_b");
    expect(onSuperseded).toHaveBeenCalledWith("sh_a");
  });
});
