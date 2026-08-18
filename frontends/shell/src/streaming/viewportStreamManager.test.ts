// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const viewportQueryMock = vi.hoisted(() => vi.fn());
const cancelMock = vi.hoisted(() => vi.fn());
vi.mock("../skp/client", () => ({ viewportQuery: viewportQueryMock, cancel: cancelMock }));

const dataPlaneAttachMock = vi.hoisted(() => vi.fn());
vi.mock("./dataPlaneClient", () => ({ dataPlaneAttach: dataPlaneAttachMock }));

const startStreamMock = vi.hoisted(() => vi.fn());
vi.mock("./adapterWs", () => ({ startStream: startStreamMock }));

import { debounce } from "./debounce";
import type { StreamSink } from "./transport";
import { VIEWPORT_QUERY_MIN_INTERVAL_MS, ViewportStreamManager } from "./viewportStreamManager";

function mockStream(handle: string) {
  viewportQueryMock.mockResolvedValueOnce({ stream: handle, expires_in_ms: 30_000 });
}

function sinkFor(callIndex: number): StreamSink {
  return startStreamMock.mock.calls[callIndex][0].sink as StreamSink;
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((r) => {
    resolve = r;
  });
  return { promise, resolve };
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
    expect(viewportQueryMock).toHaveBeenCalledWith("ds_x", null, null, null, null);
    expect(startStreamMock).toHaveBeenCalledTimes(1);
    expect(startStreamMock.mock.calls[0][0].ticketHandle).toBe("sh_a");
    expect(manager.activeStreamHandle).toBe("sh_a");
  });

  it("a filter passed to requestViewport rides through to viewportQuery verbatim (P5)", async () => {
    mockStream("sh_a");
    const manager = new ViewportStreamManager({ dataset: "ds_x", onBatch: vi.fn(), onSuperseded: vi.fn() });
    const filter = { predicate: "zone = 'residential'", dialect: "duckdb-expr/0" };

    await manager.requestViewport(null, null, 1_000, filter);

    expect(viewportQueryMock).toHaveBeenCalledWith("ds_x", null, null, null, filter);
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

  it("a call whose viewportQuery resolves after a newer call has already won abandons its own ticket (re-entrancy)", async () => {
    // The throttle bounds issue *rate*; it is not a mutex. A real viewport_query crosses Tauri IPC
    // + spawn_blocking + DuckDB statement prep, routinely slower than the 120 ms window, so two
    // calls can have their awaits interleaved -- this reproduces exactly that.
    const first = deferred<{ stream: string; expires_in_ms: number }>();
    viewportQueryMock.mockReturnValueOnce(first.promise);
    const onSuperseded = vi.fn();
    const manager = new ViewportStreamManager({ dataset: "ds_x", onBatch: vi.fn(), onSuperseded });

    const call1 = manager.requestViewport(null, null, 1_000);
    // Let call1 run past its own `supersedeCurrent()` await and reach `viewportQuery`, where it
    // then pauses on `first.promise` -- a real macrotask flush rather than a guessed microtask
    // count, so this does not depend on how many `await`s `supersedeCurrent` happens to have.
    await new Promise((r) => setTimeout(r, 0));
    expect(viewportQueryMock).toHaveBeenCalledTimes(1);

    mockStream("sh_b");
    const call2 = manager.requestViewport(null, null, 1_000 + VIEWPORT_QUERY_MIN_INTERVAL_MS + 1);
    await call2;
    expect(manager.activeStreamHandle).toBe("sh_b");

    // call1's ticket now arrives, "late".
    first.resolve({ stream: "sh_a", expires_in_ms: 30_000 });
    await call1;

    expect(manager.activeStreamHandle).toBe("sh_b");
    expect(cancelMock).toHaveBeenCalledWith("sh_a");
    // sh_a was never active, so its cancellation is not a "supersede" in D3.7's sense -- only a
    // stream that was actually serving batches counts as superseded.
    expect(onSuperseded).not.toHaveBeenCalledWith("sh_a");
    expect(startStreamMock).toHaveBeenCalledTimes(1);
  });

  it("stop() invalidates an in-flight requestViewport call, which abandons its ticket instead of becoming active", async () => {
    const pending = deferred<{ stream: string; expires_in_ms: number }>();
    viewportQueryMock.mockReturnValueOnce(pending.promise);
    const manager = new ViewportStreamManager({ dataset: "ds_x", onBatch: vi.fn(), onSuperseded: vi.fn() });

    const call = manager.requestViewport(null, null, 1_000);
    await new Promise((r) => setTimeout(r, 0));
    expect(viewportQueryMock).toHaveBeenCalledTimes(1);

    await manager.stop();
    pending.resolve({ stream: "sh_a", expires_in_ms: 30_000 });
    await call;

    expect(manager.activeStreamHandle).toBeNull();
    expect(cancelMock).toHaveBeenCalledWith("sh_a");
    expect(startStreamMock).not.toHaveBeenCalled();

    // And the manager stays refused afterward.
    mockStream("sh_b");
    await manager.requestViewport(null, null, 2_000);
    expect(manager.activeStreamHandle).toBeNull();
    expect(startStreamMock).not.toHaveBeenCalled();
  });

  it("cancelStream cancels a named stream even when a newer one is now active", async () => {
    mockStream("sh_a");
    const manager = new ViewportStreamManager({ dataset: "ds_x", onBatch: vi.fn(), onSuperseded: vi.fn() });
    await manager.requestViewport(null, null, 1_000);

    mockStream("sh_b");
    await manager.requestViewport(null, null, 1_000 + VIEWPORT_QUERY_MIN_INTERVAL_MS + 1);
    expect(manager.activeStreamHandle).toBe("sh_b");

    // sh_a is long superseded; a declared-ceiling refusal naming it must still be able to cancel it
    // without disturbing the stream that is actually active now.
    await manager.cancelStream("sh_a");
    expect(cancelMock).toHaveBeenCalledWith("sh_a");
    expect(manager.activeStreamHandle).toBe("sh_b");
  });

  it("cancelStream on the active stream clears it", async () => {
    mockStream("sh_a");
    const manager = new ViewportStreamManager({ dataset: "ds_x", onBatch: vi.fn(), onSuperseded: vi.fn() });
    await manager.requestViewport(null, null, 1_000);

    await manager.cancelStream("sh_a");

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

  describe("terminal suppression for self-cancelled streams (D1: the SKP cancel path yields ProducerFailed, not Cancelled -- CANCELLATION-FACTS.md §1)", () => {
    it("a terminal for a stream this manager superseded is suppressed -- never reaches onTerminal, whatever its kind", async () => {
      mockStream("sh_a");
      const onTerminal = vi.fn();
      const manager = new ViewportStreamManager({ dataset: "ds_x", onBatch: vi.fn(), onSuperseded: vi.fn(), onTerminal });
      await manager.requestViewport(null, null, 1_000);
      const staleSink = sinkFor(0);

      mockStream("sh_b");
      await manager.requestViewport(null, null, 1_000 + VIEWPORT_QUERY_MIN_INTERVAL_MS + 1);

      // The old connection's own terminal frame arrives late, reporting the SKP cancel path's real
      // kind -- exactly the ".canvas-refusal: stream ProducerFailed: cancelled" banner this fix
      // removes for an ordinary pan.
      staleSink.onTerminal({ kind: "ProducerFailed", detail: "cancelled" });

      expect(onTerminal).not.toHaveBeenCalled();
    });

    it("a terminal for a stream this manager explicitly cancelled (cancelStream) is suppressed too", async () => {
      mockStream("sh_a");
      const onTerminal = vi.fn();
      const manager = new ViewportStreamManager({ dataset: "ds_x", onBatch: vi.fn(), onSuperseded: vi.fn(), onTerminal });
      await manager.requestViewport(null, null, 1_000);
      const sink = sinkFor(0);

      await manager.cancelStream("sh_a");
      sink.onTerminal({ kind: "ProducerFailed", detail: "cancelled" });

      expect(onTerminal).not.toHaveBeenCalled();
    });

    it("a ProducerFailed on a stream this manager did NOT cancel still reaches onTerminal as a failure", async () => {
      mockStream("sh_a");
      const onTerminal = vi.fn();
      const manager = new ViewportStreamManager({ dataset: "ds_x", onBatch: vi.fn(), onSuperseded: vi.fn(), onTerminal });
      await manager.requestViewport(null, null, 1_000);
      const sink = sinkFor(0);

      // A genuine producer-side failure -- nothing here ever called supersedeCurrent/cancelStream
      // on "sh_a", so this must still be reported and still banner in App.tsx.
      sink.onTerminal({ kind: "ProducerFailed", detail: "engine.crs_undeclared" });

      expect(onTerminal).toHaveBeenCalledWith("sh_a", { kind: "ProducerFailed", detail: "engine.crs_undeclared" });
    });

    it("a stream's own natural Completed still reaches onTerminal (App.tsx's own whitelist treats it as benign)", async () => {
      mockStream("sh_a");
      const onTerminal = vi.fn();
      const manager = new ViewportStreamManager({ dataset: "ds_x", onBatch: vi.fn(), onSuperseded: vi.fn(), onTerminal });
      await manager.requestViewport(null, null, 1_000);
      const sink = sinkFor(0);

      sink.onTerminal({ kind: "Completed", detail: "" });

      expect(onTerminal).toHaveBeenCalledWith("sh_a", { kind: "Completed", detail: "" });
    });
  });

  describe("residency across supersession (D2: a stream's residency must be cleared synchronously at supersede time, not deferred to a terminal)", () => {
    // A minimal stand-in for App.tsx's real wiring (onBatch -> WorkingCanvas.pushBatch,
    // onSuperseded -> WorkingCanvas.clearStream), tracking just enough (bytes per stream handle) to
    // assert ordering without pulling ResidentSet/WorkingCanvas into this suite.
    function fakeResidentTracker() {
      const resident = new Map<string, number>();
      const onBatch = vi.fn((streamHandle: string, _seq: number, payload: Uint8Array) => {
        resident.set(streamHandle, (resident.get(streamHandle) ?? 0) + payload.length);
      });
      const onSuperseded = vi.fn((streamHandle: string) => {
        resident.delete(streamHandle);
      });
      return { resident, onBatch, onSuperseded };
    }

    it("a stream that completes naturally before the next requestViewport is still cleared before the new stream's first batch (the actual root cause: a natural terminal nulls currentStreamHandle, not residency)", async () => {
      mockStream("sh_a");
      const { resident, onBatch, onSuperseded } = fakeResidentTracker();
      const manager = new ViewportStreamManager({ dataset: "ds_x", onBatch, onSuperseded });
      await manager.requestViewport(null, null, 1_000);
      const sinkA = sinkFor(0);

      sinkA.onBatch(new Uint8Array(500), true);
      expect(resident.get("sh_a")).toBe(500);

      // sh_a completes entirely on its own -- nobody cancelled it, no supersede has happened yet.
      // This is the empirically-observed sequence: the full unfiltered fixture load settles
      // (Completed) well before the first ordinary pan.
      sinkA.onTerminal({ kind: "Completed", detail: "" });
      expect(manager.activeStreamHandle).toBeNull();
      expect(resident.has("sh_a")).toBe(true); // still resident: completing is not the same as clearing

      mockStream("sh_b");
      await manager.requestViewport(null, null, 1_000 + VIEWPORT_QUERY_MIN_INTERVAL_MS + 1);

      // Cleared synchronously as part of the supersede step -- before sh_b's own first pushBatch,
      // never deferred to any terminal.
      expect(onSuperseded).toHaveBeenCalledWith("sh_a");
      expect(resident.has("sh_a")).toBe(false);

      const sinkB = sinkFor(1);
      sinkB.onBatch(new Uint8Array(300), true);
      expect([...resident.entries()]).toEqual([["sh_b", 300]]);

      // A late batch for the long-gone sh_a handle must be dropped, not pushed -- the call count
      // must not grow past the two legitimate pushes above (sh_a's original batch, sh_b's first).
      const callsBeforeLateBatch = onBatch.mock.calls.length;
      sinkA.onBatch(new Uint8Array(999), true);
      expect(onBatch.mock.calls.length).toBe(callsBeforeLateBatch);
      expect(resident.has("sh_a")).toBe(false);
    });

    it("a stream still actively streaming when superseded is also cleared before the new stream's first batch", async () => {
      mockStream("sh_a");
      const { resident, onBatch, onSuperseded } = fakeResidentTracker();
      const manager = new ViewportStreamManager({ dataset: "ds_x", onBatch, onSuperseded });
      await manager.requestViewport(null, null, 1_000);
      const sinkA = sinkFor(0);
      sinkA.onBatch(new Uint8Array(500), true);
      expect(resident.get("sh_a")).toBe(500);

      mockStream("sh_b");
      await manager.requestViewport(null, null, 1_000 + VIEWPORT_QUERY_MIN_INTERVAL_MS + 1);

      expect(resident.has("sh_a")).toBe(false);

      const sinkB = sinkFor(1);
      sinkB.onBatch(new Uint8Array(300), true);
      expect([...resident.entries()]).toEqual([["sh_b", 300]]);

      sinkA.onBatch(new Uint8Array(999), true);
      expect(resident.has("sh_a")).toBe(false);
    });
  });

  describe("supersede storm (Custodian walkthrough finding: ordinary dragging surfaced skp.too_many_pending_streams)", () => {
    // App.tsx's actual production wiring: onViewportChanged -> debounce -> manager.requestViewport.
    // Driven here with fake timers so a several-second drag storm runs in test time, not wall time.
    const ROUND_TRIP_MS = 150; // "routinely longer than the throttle window" -- viewportStreamManager.ts's own doc comment

    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    function trackedViewportQueryMock() {
      let inFlight = 0;
      let maxConcurrent = 0;
      let totalMints = 0;
      viewportQueryMock.mockImplementation(
        () =>
          new Promise((resolve) => {
            inFlight++;
            totalMints++;
            maxConcurrent = Math.max(maxConcurrent, inFlight);
            const mine = totalMints;
            setTimeout(() => {
              inFlight--;
              resolve({ stream: `sh_${mine}`, expires_in_ms: 30_000 });
            }, ROUND_TRIP_MS);
          })
      );
      return {
        totalMints: () => totalMints,
        maxConcurrent: () => maxConcurrent,
      };
    }

    it("a continuous multi-second drag with no pauses (walkthrough A7) issues at most one query, not one per throttle tick", async () => {
      const counts = trackedViewportQueryMock();
      const manager = new ViewportStreamManager({ dataset: "ds_x", onBatch: vi.fn(), onSuperseded: vi.fn() });
      const debounced = debounce((bbox: null, bboxCrs: null) => {
        void manager.requestViewport(bbox, bboxCrs);
      }, VIEWPORT_QUERY_MIN_INTERVAL_MS);

      // 3s of continuous pointer-move events, 16ms apart (one per animation frame), no pause ever
      // longer than the debounce settle window -- deck.gl's onViewStateChange firing throughout one
      // uninterrupted drag. Without debounce (App.tsx calling requestViewport directly, throttled
      // only to VIEWPORT_QUERY_MIN_INTERVAL_MS), this exact event stream mints ~24 tickets over the
      // same 3s with some overlap (proven by this suite's own instrumentation during development --
      // not asserted here since this test exercises the fixed, debounced path).
      for (let t = 0; t < 3000; t += 16) {
        debounced.call(null, null);
        await vi.advanceTimersByTimeAsync(16);
      }
      expect(counts.totalMints()).toBe(0); // nothing ever settled -- the drag never paused

      // The drag ends: let the final debounce window elapse with no further events.
      await vi.advanceTimersByTimeAsync(VIEWPORT_QUERY_MIN_INTERVAL_MS + 10);

      expect(counts.totalMints()).toBe(1);
      expect(counts.maxConcurrent()).toBe(1);
    });

    it("a drag with brief pauses (settle, resume, settle again) keeps concurrently in-flight queries far under MAX_PENDING_TICKETS", async () => {
      const counts = trackedViewportQueryMock();
      const manager = new ViewportStreamManager({ dataset: "ds_x", onBatch: vi.fn(), onSuperseded: vi.fn() });
      const debounced = debounce((bbox: null, bboxCrs: null) => {
        void manager.requestViewport(bbox, bboxCrs);
      }, VIEWPORT_QUERY_MIN_INTERVAL_MS);

      // Ten pause-and-resume cycles: a burst of continuous movement (128ms, no query) followed by a
      // pause just past the settle window (fires exactly one query). Each round trip (150ms) is
      // longer than the settle window, so this also exercises overlap between a still-in-flight
      // query and the next pause's -- the kernel-ticket-pileup shape this fix targets, driven for
      // longer than any single round trip could ever cover on its own.
      for (let burst = 0; burst < 10; burst++) {
        for (let i = 0; i < 8; i++) {
          debounced.call(null, null);
          await vi.advanceTimersByTimeAsync(16);
        }
        await vi.advanceTimersByTimeAsync(VIEWPORT_QUERY_MIN_INTERVAL_MS + 10);
      }

      // At most one query per pause (ten pauses), never one per pointer-move frame (80 of those).
      expect(counts.totalMints()).toBeLessThanOrEqual(10);
      // The kernel's own ceiling (MAX_PENDING_TICKETS, kernel/src/skp.rs) is 8; staying in the low
      // single digits here leaves an order of magnitude of headroom under ordinary interaction.
      expect(counts.maxConcurrent()).toBeLessThanOrEqual(2);
    });
  });

  // NEXT-CUT.md (filter-panel cut) P1: `requestViewport` reports what actually happened instead of a
  // uniform `Promise<void>` -- reporting only, no behavior change to any existing path above (every
  // test in this describe block up to here still passes unmodified but for its own return-type use,
  // which is exactly the claim this section proves one outcome kind at a time).
  describe("requestViewport's returned RequestOutcome (P1: reporting seam, no behavior change)", () => {
    it("a successful mint resolves {kind:'issued', streamHandle} with the real handle", async () => {
      mockStream("sh_a");
      const manager = new ViewportStreamManager({ dataset: "ds_x", onBatch: vi.fn(), onSuperseded: vi.fn() });

      const outcome = await manager.requestViewport(null, null, 1_000);

      expect(outcome).toEqual({ kind: "issued", streamHandle: "sh_a" });
    });

    it("a call inside the throttle window resolves {kind:'throttled'} -- the existing silent no-op, now reported", async () => {
      mockStream("sh_a");
      const manager = new ViewportStreamManager({ dataset: "ds_x", onBatch: vi.fn(), onSuperseded: vi.fn() });
      await manager.requestViewport(null, null, 1_000);

      const outcome = await manager.requestViewport(null, null, 1_000 + VIEWPORT_QUERY_MIN_INTERVAL_MS - 1);

      expect(outcome).toEqual({ kind: "throttled" });
      expect(viewportQueryMock).toHaveBeenCalledTimes(1); // still a no-op -- unchanged
    });

    it("a call after stop() resolves {kind:'stopped'} -- the existing refused-forever behavior, now reported", async () => {
      const manager = new ViewportStreamManager({ dataset: "ds_x", onBatch: vi.fn(), onSuperseded: vi.fn() });
      await manager.stop();

      const outcome = await manager.requestViewport(null, null, 1_000);

      expect(outcome).toEqual({ kind: "stopped" });
      expect(startStreamMock).not.toHaveBeenCalled();
    });

    it("a call that loses the generation race (re-entrancy, mirrors the suite's own re-entrancy test above) resolves {kind:'superseded'}", async () => {
      const first = deferred<{ stream: string; expires_in_ms: number }>();
      viewportQueryMock.mockReturnValueOnce(first.promise);
      const manager = new ViewportStreamManager({ dataset: "ds_x", onBatch: vi.fn(), onSuperseded: vi.fn() });

      const call1 = manager.requestViewport(null, null, 1_000);
      await new Promise((r) => setTimeout(r, 0));
      expect(viewportQueryMock).toHaveBeenCalledTimes(1);

      mockStream("sh_b");
      const call2 = manager.requestViewport(null, null, 1_000 + VIEWPORT_QUERY_MIN_INTERVAL_MS + 1);
      const outcome2 = await call2;
      expect(outcome2).toEqual({ kind: "issued", streamHandle: "sh_b" });

      // call1's ticket now arrives, "late" -- past the point call2 already won the generation race.
      first.resolve({ stream: "sh_a", expires_in_ms: 30_000 });
      const outcome1 = await call1;

      expect(outcome1).toEqual({ kind: "superseded" });
      expect(cancelMock).toHaveBeenCalledWith("sh_a"); // the abandoned ticket is still cancelled, unchanged
    });
  });

  // NEXT-CUT.md P1 item 2: TAG_OPEN wired to `onStreamOpened`, the only batch-independent liveness
  // signal (no protocol change) -- and P1 item 3's own instruction to check whether the guard
  // `onBatch` already has for a superseded stream's late frame applies here too. It does: the same
  // race (the old socket keeps delivering after supersession, since neither `supersedeCurrent` nor
  // `cancelStream` ever closes the socket directly -- only an SKP cancel that the producer must still
  // act on) can deliver a late TAG_OPEN exactly as it can deliver a late batch.
  describe("onStreamOpened (P1 item 2: wired from sink.onOpen)", () => {
    it("fires with the stream handle when TAG_OPEN arrives for the currently active stream", async () => {
      mockStream("sh_a");
      const onStreamOpened = vi.fn();
      const manager = new ViewportStreamManager({
        dataset: "ds_x",
        onBatch: vi.fn(),
        onSuperseded: vi.fn(),
        onStreamOpened,
      });
      await manager.requestViewport(null, null, 1_000);
      const sink = sinkFor(0);

      sink.onOpen({ operationId: "op_1", streamId: "st_1" });

      expect(onStreamOpened).toHaveBeenCalledTimes(1);
      expect(onStreamOpened).toHaveBeenCalledWith("sh_a");
    });

    it("does NOT fire for a superseded stream's late TAG_OPEN (mirrors onBatch's own guard, made explicit)", async () => {
      mockStream("sh_a");
      const onStreamOpened = vi.fn();
      const manager = new ViewportStreamManager({
        dataset: "ds_x",
        onBatch: vi.fn(),
        onSuperseded: vi.fn(),
        onStreamOpened,
      });
      await manager.requestViewport(null, null, 1_000);
      const staleSink = sinkFor(0);

      mockStream("sh_b");
      await manager.requestViewport(null, null, 1_000 + VIEWPORT_QUERY_MIN_INTERVAL_MS + 1);

      // The old connection's socket delivers its own TAG_OPEN after supersession -- the same class
      // of race the suite's own "a batch arriving late from a superseded stream is dropped" test
      // exercises for onBatch, above.
      staleSink.onOpen({ operationId: "op_1", streamId: "st_1" });

      expect(onStreamOpened).not.toHaveBeenCalled();
    });

    it("the newly active stream's own TAG_OPEN still fires normally after a supersede", async () => {
      mockStream("sh_a");
      const onStreamOpened = vi.fn();
      const manager = new ViewportStreamManager({
        dataset: "ds_x",
        onBatch: vi.fn(),
        onSuperseded: vi.fn(),
        onStreamOpened,
      });
      await manager.requestViewport(null, null, 1_000);

      mockStream("sh_b");
      await manager.requestViewport(null, null, 1_000 + VIEWPORT_QUERY_MIN_INTERVAL_MS + 1);
      const sinkB = sinkFor(1);

      sinkB.onOpen({ operationId: "op_2", streamId: "st_2" });

      expect(onStreamOpened).toHaveBeenCalledWith("sh_b");
    });
  });
});
