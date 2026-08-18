// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it, vi } from "vitest";

import { coalesceOncePerFrame } from "./coalesceOncePerFrame";

/** A small, fully controlled fake rAF (per S5's own suggestion, reviewer gate style-panel cut P7
 * fixes) -- not jsdom's own `requestAnimationFrame`, whose scheduling behavior this test has no
 * reason to depend on. `flush()` runs every currently-queued callback, in order, and clears the
 * queue -- exactly one animation frame's worth of work, driven by the test rather than a real
 * display's refresh rate. */
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
  return { requestFrame, cancelFrame, flush, queuedCount: () => queued.size };
}

describe("coalesceOncePerFrame", () => {
  it("does not call fn until the frame fires", () => {
    const fn = vi.fn();
    const { requestFrame, cancelFrame, flush } = fakeFrame();
    const c = coalesceOncePerFrame(fn, requestFrame, cancelFrame);

    c.schedule();
    expect(fn).not.toHaveBeenCalled();
    flush();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("a burst of schedule() calls inside one frame collapses to exactly one requestFrame call and one fn call", () => {
    const fn = vi.fn();
    const { requestFrame, cancelFrame, flush } = fakeFrame();
    const c = coalesceOncePerFrame(fn, requestFrame, cancelFrame);

    // Simulates a continuous slider drag: many onChange-driven schedule() calls before the browser
    // ever gets to paint a frame -- the storm this exists to collapse (S5's own framing: "at most
    // once per frame instead of once per input event").
    for (let i = 0; i < 50; i++) c.schedule();

    expect(requestFrame).toHaveBeenCalledTimes(1);
    expect(fn).not.toHaveBeenCalled();
    flush();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("schedules a fresh frame again after the previous one has fired", () => {
    const fn = vi.fn();
    const { requestFrame, cancelFrame, flush } = fakeFrame();
    const c = coalesceOncePerFrame(fn, requestFrame, cancelFrame);

    c.schedule();
    flush();
    expect(fn).toHaveBeenCalledTimes(1);

    c.schedule();
    expect(requestFrame).toHaveBeenCalledTimes(2);
    flush();
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("cancel() prevents a scheduled frame from firing, and calls the injected cancelFrame", () => {
    const fn = vi.fn();
    const { requestFrame, cancelFrame, flush, queuedCount } = fakeFrame();
    const c = coalesceOncePerFrame(fn, requestFrame, cancelFrame);

    c.schedule();
    c.cancel();
    expect(cancelFrame).toHaveBeenCalledTimes(1);
    expect(queuedCount()).toBe(0);
    flush();
    expect(fn).not.toHaveBeenCalled();
  });

  it("cancel() is idempotent and safe with nothing scheduled", () => {
    const fn = vi.fn();
    const { requestFrame, cancelFrame } = fakeFrame();
    const c = coalesceOncePerFrame(fn, requestFrame, cancelFrame);

    expect(() => c.cancel()).not.toThrow();
    expect(() => c.cancel()).not.toThrow();
    expect(cancelFrame).not.toHaveBeenCalled();
  });

  it("a schedule() after cancel() schedules a genuinely new frame", () => {
    const fn = vi.fn();
    const { requestFrame, cancelFrame, flush } = fakeFrame();
    const c = coalesceOncePerFrame(fn, requestFrame, cancelFrame);

    c.schedule();
    c.cancel();
    c.schedule();
    expect(requestFrame).toHaveBeenCalledTimes(2);
    flush();
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe("coalesceOncePerFrame -- flush() (reviewer gate, style-panel cut P7 fixes)", () => {
  it("calls fn synchronously when a frame is pending, and cancels the now-redundant real frame", () => {
    const fn = vi.fn();
    const { requestFrame, cancelFrame } = fakeFrame();
    const c = coalesceOncePerFrame(fn, requestFrame, cancelFrame);

    c.schedule();
    expect(fn).not.toHaveBeenCalled();
    c.flush();
    expect(fn).toHaveBeenCalledTimes(1); // synchronous -- no frame needed to have "fired"
    expect(cancelFrame).toHaveBeenCalledTimes(1);
  });

  it("is a no-op when nothing is pending -- never calls fn just in case", () => {
    const fn = vi.fn();
    const { requestFrame, cancelFrame } = fakeFrame();
    const c = coalesceOncePerFrame(fn, requestFrame, cancelFrame);

    c.flush();
    expect(fn).not.toHaveBeenCalled();
    expect(cancelFrame).not.toHaveBeenCalled();
  });

  it("a real frame that later fires does not call fn a second time after flush()", () => {
    const fn = vi.fn();
    const { requestFrame, cancelFrame, flush: flushRealFrames } = fakeFrame();
    const c = coalesceOncePerFrame(fn, requestFrame, cancelFrame);

    c.schedule();
    c.flush();
    expect(fn).toHaveBeenCalledTimes(1);
    flushRealFrames(); // the fake queue is already empty (cancelFrame removed it) -- confirms that
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("schedule() after flush() schedules a genuinely new frame", () => {
    const fn = vi.fn();
    const { requestFrame, cancelFrame, flush: flushRealFrames } = fakeFrame();
    const c = coalesceOncePerFrame(fn, requestFrame, cancelFrame);

    c.schedule();
    c.flush();
    c.schedule();
    expect(requestFrame).toHaveBeenCalledTimes(2);
    flushRealFrames();
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
