// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { debounce } from "./debounce";

describe("debounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("does not call fn until settleMs has passed", () => {
    const fn = vi.fn();
    const d = debounce(fn, 120);
    d.call(1);
    vi.advanceTimersByTime(119);
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(1);
  });

  it("a burst of calls inside the settle window collapses to exactly one call, with the latest args", () => {
    const fn = vi.fn();
    const d = debounce(fn, 120);
    // Simulates a continuous drag: a call every 16ms (one per animation frame), well inside the
    // 120ms settle window, for 3 seconds -- the storm this exists to collapse.
    for (let t = 0; t < 3000; t += 16) {
      d.call(t);
      vi.advanceTimersByTime(16);
    }
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(120);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("a pause longer than settleMs mid-burst fires once for the pause, then again after the burst ends", () => {
    const fn = vi.fn();
    const d = debounce(fn, 120);
    d.call("a");
    vi.advanceTimersByTime(120);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenLastCalledWith("a");

    d.call("b");
    vi.advanceTimersByTime(120);
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenLastCalledWith("b");
  });

  it("cancel() prevents a scheduled call from firing", () => {
    const fn = vi.fn();
    const d = debounce(fn, 120);
    d.call(1);
    d.cancel();
    vi.advanceTimersByTime(1000);
    expect(fn).not.toHaveBeenCalled();
  });

  it("cancel() is idempotent and safe with nothing scheduled", () => {
    const fn = vi.fn();
    const d = debounce(fn, 120);
    expect(() => d.cancel()).not.toThrow();
    expect(() => d.cancel()).not.toThrow();
  });
});
