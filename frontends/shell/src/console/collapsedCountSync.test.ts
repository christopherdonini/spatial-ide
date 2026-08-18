// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it, vi } from "vitest";

import { attachCollapsedCountSync, type CountableRecorder } from "./collapsedCountSync";
import type { ConsoleEntry } from "./recorder";

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

/** A minimal fake recorder -- entries()/droppedCount() are plain accessors over mutable local
 * state, subscribe() a plain listener set, matching `ConsoleRecorder`'s real shape closely enough
 * to exercise this module without pulling in the real singleton. */
function fakeRecorder(): CountableRecorder & { push(): void; setDropped(n: number): void } {
  const entries: ConsoleEntry[] = [];
  let dropped = 0;
  const listeners = new Set<() => void>();
  return {
    entries: () => entries,
    droppedCount: () => dropped,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    push: () => {
      entries.push({ seq: entries.length, kind: "gui-action", action: "test.push" });
      for (const l of listeners) l();
    },
    setDropped: (n: number) => {
      dropped = n;
      for (const l of listeners) l();
    },
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
    expect(onCount).toHaveBeenCalledWith({ count: 2, dropped: 0 });
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
    // The ONLY argument shape onCount can ever receive is {count, dropped} -- two numbers. There is
    // no ConsoleEntry-shaped value it could have been called with; this is the structural guarantee
    // I9 asks for, not merely an assertion that nothing else happened to run in this test.
    const [snapshot] = onCount.mock.calls[0]!;
    expect(Object.keys(snapshot).sort()).toEqual(["count", "dropped"]);
    expect(typeof snapshot.count).toBe("number");
    expect(typeof snapshot.dropped).toBe("number");
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
    expect(onCount).toHaveBeenCalledWith({ count: 20, dropped: 0 });
  });

  it("reflects droppedCount() in the snapshot", () => {
    const recorder = fakeRecorder();
    const onCount = vi.fn();
    const { requestFrame, cancelFrame, flush } = fakeFrame();

    attachCollapsedCountSync(recorder, onCount, requestFrame, cancelFrame);
    onCount.mockClear();

    recorder.setDropped(3);
    flush();

    expect(onCount).toHaveBeenCalledWith({ count: 0, dropped: 3 });
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
