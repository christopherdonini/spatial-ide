// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it, vi } from "vitest";

import { attachCollapsedCountSync, type CountableRecorder } from "./collapsedCountSync";
import { ConsoleRecorder, MAX_CONSOLE_ENTRIES } from "./recorder";

/** Same fully-controlled fake rAF `coalesceOncePerFrame.test.ts` already establishes -- driven by
 * the test, not a real display's refresh rate. */
function fakeFrame() {
  let nextHandle = 1;
  const queued = new Map<number, FrameRequestCallback>();
  const requestFrame = vi.fn((cb: FrameRequestCallback) => {
    const handle = nextHandle++;
    queued.set(handle, cb);
    return handle;
  });
  const cancelFrame = vi.fn((handle: number) => {
    queued.delete(handle);
  });
  function flush(): void {
    const callbacks = [...queued.values()];
    queued.clear();
    for (const cb of callbacks) cb(0);
  }
  return { requestFrame, cancelFrame, flush };
}

/**
 * A minimal fake recorder -- count()/droppedCount() are plain accessors over mutable local state,
 * subscribe() a plain listener set, matching `ConsoleRecorder`'s real shape closely enough to
 * exercise this module without pulling in the real singleton.
 *
 * `entries` (the internal array) has NO public `entries()` accessor on the object this function
 * returns -- reviewer gate S6 (action-console P7 fixes): `CountableRecorder` itself dropped that
 * member (`collapsedCountSync.ts`'s own header comment has the reason), so a fake that still
 * exposed `entries()` would let `attachCollapsedCountSync` compile against a shape more permissive
 * than the real recorder's own I9 fence, silently defeating the point of narrowing the interface.
 * `entriesLengthReads` counts how many times `count()` itself is called -- the honesty check this
 * module's own S6 fix is FOR: if a future regression called something O(n) per frame instead of
 * this O(1) accessor, this fake could not express that difference by cost alone (a fake has no
 * real allocation cost to measure), so the call-count assertion below is the closest a fake CAN
 * prove -- `count()` is called at most once per `onCount`, never once per entry.
 */
function fakeRecorder(): CountableRecorder & {
  push(): void;
  setDropped(lane: "stream" | "other", n: number): void;
  countCalls(): number;
} {
  const entries: { seq: number }[] = [];
  const dropped = { stream: 0, other: 0 };
  let countReadCount = 0;
  const listeners = new Set<() => void>();
  return {
    count: () => {
      countReadCount++;
      return entries.length;
    },
    droppedCount: (lane) => dropped[lane],
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    push: () => {
      entries.push({ seq: entries.length });
      for (const l of listeners) l();
    },
    setDropped: (lane: "stream" | "other", n: number) => {
      dropped[lane] = n;
      for (const l of listeners) l();
    },
    countCalls: () => countReadCount,
  };
}

describe("attachCollapsedCountSync (NEXT-CUT.md I9: closed console = zero per-entry DOM work)", () => {
  it("fires once immediately on attach with the current snapshot", () => {
    const recorder = fakeRecorder();
    recorder.push();
    recorder.push();
    const onCount = vi.fn();
    const { requestFrame, cancelFrame } = fakeFrame();

    attachCollapsedCountSync(recorder, onCount, requestFrame, cancelFrame);

    expect(onCount).toHaveBeenCalledTimes(1);
    expect(onCount).toHaveBeenCalledWith({ count: 2, droppedStream: 0, droppedOther: 0 });
  });

  it("onCount is the ONLY function this module ever calls in response to recorder activity -- never anything entry-shaped", () => {
    const recorder = fakeRecorder();
    const onCount = vi.fn();
    const { requestFrame, cancelFrame, flush } = fakeFrame();

    attachCollapsedCountSync(recorder, onCount, requestFrame, cancelFrame);
    onCount.mockClear();

    recorder.push();
    flush();

    expect(onCount).toHaveBeenCalledTimes(1);
    // The ONLY argument shape onCount can ever receive is {count, droppedStream, droppedOther} -- three numbers. There is
    // no ConsoleEntry-shaped value it could have been called with; this is the structural guarantee
    // I9 asks for, not merely an assertion that nothing else happened to run in this test.
    const [snapshot] = onCount.mock.calls[0]!;
    expect(Object.keys(snapshot).sort()).toEqual(["count", "droppedOther", "droppedStream"]);
    expect(typeof snapshot.count).toBe("number");
    expect(typeof snapshot.droppedStream).toBe("number");
    expect(typeof snapshot.droppedOther).toBe("number");
  });

  it("a burst of recorder notifications within one frame collapses to exactly one onCount call (coalesced, I9)", () => {
    const recorder = fakeRecorder();
    const onCount = vi.fn();
    const { requestFrame, cancelFrame, flush } = fakeFrame();

    attachCollapsedCountSync(recorder, onCount, requestFrame, cancelFrame);
    onCount.mockClear();

    for (let i = 0; i < 20; i++) recorder.push();
    expect(onCount).not.toHaveBeenCalled();

    flush();
    expect(onCount).toHaveBeenCalledTimes(1);
    expect(onCount).toHaveBeenCalledWith({ count: 20, droppedStream: 0, droppedOther: 0 });
  });

  it("count() is read at most once per onCount call, never once per entry (S6: no full-ring copy per frame while collapsed)", () => {
    const recorder = fakeRecorder();
    const onCount = vi.fn();
    const { requestFrame, cancelFrame, flush } = fakeFrame();

    // attachCollapsedCountSync's own immediate fire (attach time) reads count() once.
    attachCollapsedCountSync(recorder, onCount, requestFrame, cancelFrame);
    const callsAfterAttach = recorder.countCalls();
    expect(callsAfterAttach).toBe(1);

    for (let i = 0; i < 50; i++) recorder.push();
    flush();

    // Exactly one MORE read for the whole 50-entry burst, coalesced to one frame (I9) -- never 50.
    expect(recorder.countCalls()).toBe(callsAfterAttach + 1);
    expect(onCount).toHaveBeenLastCalledWith({ count: 50, droppedStream: 0, droppedOther: 0 });
  });

  it("reflects droppedCount() in the snapshot", () => {
    const recorder = fakeRecorder();
    const onCount = vi.fn();
    const { requestFrame, cancelFrame, flush } = fakeFrame();

    attachCollapsedCountSync(recorder, onCount, requestFrame, cancelFrame);
    onCount.mockClear();

    recorder.setDropped("other", 3);
    flush();

    expect(onCount).toHaveBeenCalledWith({ count: 0, droppedStream: 0, droppedOther: 3 });
  });

  it("CC1: a fake with 3 dropped of the stream kind and 2 of the other reads as {0, 3, 2}", () => {
    const recorder = fakeRecorder();
    const onCount = vi.fn();
    const { requestFrame, cancelFrame, flush } = fakeFrame();

    attachCollapsedCountSync(recorder, onCount, requestFrame, cancelFrame);
    onCount.mockClear();

    recorder.setDropped("stream", 3);
    recorder.setDropped("other", 2);
    flush();

    expect(onCount).toHaveBeenCalledWith({ count: 0, droppedStream: 3, droppedOther: 2 });
  });

  it("CC2: against a real recorder, one record_step and a burst of stream entries read as one held lane and the stream's drops", () => {
    const recorder = new ConsoleRecorder();
    const onCount = vi.fn();
    const { requestFrame, cancelFrame, flush } = fakeFrame();

    attachCollapsedCountSync(recorder, onCount, requestFrame, cancelFrame);
    onCount.mockClear();

    recorder.record({ step: 1 }, "record_step");
    for (let i = 0; i < 300; i++) recorder.record({ i }, "viewport_query");
    flush();

    expect(onCount).toHaveBeenLastCalledWith({
      count: MAX_CONSOLE_ENTRIES + 1,
      droppedStream: 300 - MAX_CONSOLE_ENTRIES,
      droppedOther: 0,
    });
  });

  it("the returned detach function unsubscribes and cancels a still-pending coalesced frame", () => {
    const recorder = fakeRecorder();
    const onCount = vi.fn();
    const { requestFrame, cancelFrame, flush } = fakeFrame();

    const detach = attachCollapsedCountSync(recorder, onCount, requestFrame, cancelFrame);
    onCount.mockClear();

    recorder.push(); // schedules a coalesced frame
    detach();
    flush(); // the scheduled frame, if not cancelled, would fire here

    expect(onCount).not.toHaveBeenCalled();

    onCount.mockClear();
    recorder.push(); // detached: no listener left to react
    expect(onCount).not.toHaveBeenCalled();
  });
});
