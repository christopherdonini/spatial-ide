// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * WAVE1 A2 reproducer (evidence only; asserts the CURRENT baseline behaviour, bb98f71).
 *
 * `ViewportStreamManager.requestViewport` re-checks only `myGeneration !== this.generation` after
 * each await. The source-changed branch in `onTerminal` sets `sessionEnded` and calls
 * `liveTickets.invalidate()` but does not bump `generation`. So a `viewportQuery` that was already
 * in flight when another stream's `engine.source_changed` terminal arrived resolves AFTER the
 * invalidation and:
 *   - admits its ticket into the just-cleared `LiveTicketSet` (`liveTickets.admit(stream)`),
 *   - sets `currentStreamHandle`/`residentStreamHandle` again,
 *   - calls `startStream`, and returns `{ kind: "issued" }` instead of `"session-ended"`,
 *   - and forwards that ticket's batches to `opts.onBatch` (the canvas), because the client-side
 *     live-ticket check now says the ticket is live.
 *
 * The kernel still refuses the redemption (the ticket is in `dead_tickets`), so end to end no
 * batch arrives today; what this shows is that the client mirror does not fail closed on its own,
 * contrary to `liveTicketSet.ts`'s "Both sides fail closed independently".
 */
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
import { REAL_SOURCE_CHANGED_TERMINAL_DETAIL } from "../testUtils/terminalShapes";

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((r) => {
    resolve = r;
  });
  return { promise, resolve };
}

describe("WAVE1 A2: a viewportQuery resolving after the session ended (untiled arm)", () => {
  beforeEach(() => {
    viewportQueryMock.mockReset();
    cancelMock.mockReset().mockResolvedValue({ state: "requested" });
    dataPlaneAttachMock
      .mockReset()
      .mockResolvedValue({ url: "ws://127.0.0.1:1/stream", subprotocols: ["spatial-dp.v0", "tok.x"] });
    startStreamMock
      .mockReset()
      .mockReturnValue({ cancel: vi.fn(), stats: { reassemblyCopies: 0, jsonFramesSeen: 0 } });
  });

  it("re-admits the late ticket into the cleared live set and forwards its batches", async () => {
    const onBatch = vi.fn();
    const onSessionEnded = vi.fn();
    const manager = new ViewportStreamManager({ dataset: "ds_x", onBatch, onSuperseded: vi.fn(), onSessionEnded });

    // Stream A is live.
    viewportQueryMock.mockResolvedValueOnce({ stream: "sh_a", expires_in_ms: 30_000 });
    await manager.requestViewport(null, null, 1_000);
    const sinkA = startStreamMock.mock.calls[0][0].sink as StreamSink;

    // Request B: its viewport_query is in flight (minted kernel-side under the still-live generation).
    const pendingB = deferred<{ stream: string; expires_in_ms: number }>();
    viewportQueryMock.mockReturnValueOnce(pendingB.promise);
    const outcomeB = manager.requestViewport(null, null, 1_000 + VIEWPORT_QUERY_MIN_INTERVAL_MS + 1);
    // Let requestViewport get past supersedeCurrent() and park on viewportQuery.
    for (let i = 0; i < 5; i++) await Promise.resolve();
    expect(viewportQueryMock).toHaveBeenCalledTimes(2);

    // Stream A's post-check found the source changed: the session ends, the live set is cleared.
    sinkA.onTerminal({ kind: "ProducerFailed", detail: REAL_SOURCE_CHANGED_TERMINAL_DETAIL });
    expect(onSessionEnded).toHaveBeenCalledTimes(1);

    // B's response (IPC) arrives after A's terminal (WebSocket) -- two channels, no ordering.
    pendingB.resolve({ stream: "sh_b", expires_in_ms: 30_000 });
    const outcome = await outcomeB;

    // Observed at baseline: the late request is issued, not refused as session-ended.
    expect(outcome).toEqual({ kind: "issued", streamHandle: "sh_b" });
    expect(startStreamMock).toHaveBeenCalledTimes(2);
    expect(startStreamMock.mock.calls[1][0].ticketHandle).toBe("sh_b");
    expect(manager.activeStreamHandle).toBe("sh_b");
    // No cancel was issued for the late ticket.
    expect(cancelMock).not.toHaveBeenCalledWith("sh_b");

    // And the client mirror admits its batches to the canvas callback after the session ended.
    const sinkB = startStreamMock.mock.calls[1][0].sink as StreamSink;
    onBatch.mockClear();
    sinkB.onBatch(new Uint8Array([9, 9, 9]), true);
    expect(onBatch).toHaveBeenCalledTimes(1);
    expect(onBatch.mock.calls[0][0]).toBe("sh_b");

    // A fresh request, by contrast, IS refused -- the latch holds only for calls that start after it.
    const fresh = await manager.requestViewport(null, null, 10_000);
    expect(fresh).toEqual({ kind: "session-ended" });
  });
});
