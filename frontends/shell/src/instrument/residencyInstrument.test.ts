// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  beginResidencyStep,
  disableResidencyInstrument,
  enableResidencyInstrument,
  endResidencyStep,
  isResidencyInstrumentEnabled,
  recordResidencyAfterRender,
  recordResidencyBatch,
  recordResidencyInput,
  recordResidencyStreamIssued,
  ResidencyInstrumentCore,
} from "./residencyInstrument";

describe("ResidencyInstrumentCore -- pure state machine, synthetic clock", () => {
  it("has no active step, and every mutator no-ops, before beginStep", () => {
    const core = new ResidencyInstrumentCore();
    expect(core.isStepActive).toBe(false);
    core.recordStreamIssued();
    core.recordBatch(10, 100);
    core.recordAfterRender(5);
    core.recordFrame(5);
    core.recordInput(5);
    expect(core.endStep()).toBeNull();
  });

  it("accumulates counters correctly from synthetic events", () => {
    const core = new ResidencyInstrumentCore();
    core.beginStep("pan-north", 1000);
    core.recordStreamIssued();
    core.recordStreamIssued();
    core.recordBatch(37, 4096);
    core.recordBatch(63, 8192);
    const result = core.endStep();
    expect(result).not.toBeNull();
    expect(result!.stepId).toBe("pan-north");
    expect(result!.counters).toEqual({
      streamsIssued: 2,
      batchesReceived: 2,
      featuresDecoded: 100,
      bytesDecoded: 12288,
      tilesRequested: 0,
    });
  });

  it("stamps firstPixelMs once, from the FIRST recordAfterRender after beginStep, never a later one", () => {
    const core = new ResidencyInstrumentCore();
    core.beginStep("fit", 1000);
    core.recordAfterRender(1042);
    core.recordAfterRender(1200); // must not overwrite the first stamp
    const result = core.endStep();
    expect(result!.firstPixelMs).toBe(42);
  });

  it("firstPixelMs is null if no render was observed before endStep", () => {
    const core = new ResidencyInstrumentCore();
    core.beginStep("fit", 1000);
    const result = core.endStep();
    expect(result!.firstPixelMs).toBeNull();
  });

  it("collects one frameTimestamps entry per recordFrame call, in order", () => {
    const core = new ResidencyInstrumentCore();
    core.beginStep("zoom-in-1", 0);
    core.recordFrame(16);
    core.recordFrame(33);
    core.recordFrame(50);
    const result = core.endStep();
    expect(result!.frameTimestamps).toEqual([16, 33, 50]);
  });

  it("resolves an input-to-present proxy from the NEXT frame after recordInput", () => {
    const core = new ResidencyInstrumentCore();
    core.beginStep("pan-east", 0);
    core.recordInput(100);
    core.recordFrame(116); // resolves the pending input: 116 - 100 = 16
    core.recordFrame(133); // no pending input -- not a second proxy entry
    const result = core.endStep();
    expect(result!.inputToPresentProxiesMs).toEqual([16]);
  });

  it("a second input before the first resolves overwrites the pending one, never doubles it", () => {
    const core = new ResidencyInstrumentCore();
    core.beginStep("pan-west", 0);
    core.recordInput(100);
    core.recordInput(105); // overwrites -- the 100 input's proxy is never reported
    core.recordFrame(120); // resolves against 105: 120 - 105 = 15
    const result = core.endStep();
    expect(result!.inputToPresentProxiesMs).toEqual([15]);
  });

  it("endStep is idempotent -- a second call before the next beginStep returns null, not a stale snapshot", () => {
    const core = new ResidencyInstrumentCore();
    core.beginStep("fit", 0);
    core.recordStreamIssued();
    const first = core.endStep();
    const second = core.endStep();
    expect(first).not.toBeNull();
    expect(second).toBeNull();
  });

  it("a fresh beginStep resets counters/timings -- nothing from the prior step leaks forward", () => {
    const core = new ResidencyInstrumentCore();
    core.beginStep("pan-north", 0);
    core.recordStreamIssued();
    core.recordBatch(50, 500);
    core.endStep();

    core.beginStep("pan-east", 1000);
    const result = core.endStep();
    expect(result!.counters).toEqual({
      streamsIssued: 0,
      batchesReceived: 0,
      featuresDecoded: 0,
      bytesDecoded: 0,
      tilesRequested: 0,
    });
    expect(result!.frameTimestamps).toEqual([]);
    expect(result!.inputToPresentProxiesMs).toEqual([]);
  });
});

describe("DEV-only singleton wiring -- instrument-off registers nothing", () => {
  let rafSpy: ReturnType<typeof vi.fn>;
  let cancelSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    rafSpy = vi.fn((_cb: FrameRequestCallback) => {
      // Never actually invokes _cb -- these tests assert whether requestAnimationFrame was CALLED
      // AT ALL (the "no listener registered" claim), not what happens when a frame fires.
      return 1 as unknown as number;
    });
    cancelSpy = vi.fn();
    vi.stubGlobal("requestAnimationFrame", rafSpy);
    vi.stubGlobal("cancelAnimationFrame", cancelSpy);
  });

  afterEach(() => {
    disableResidencyInstrument();
    vi.unstubAllGlobals();
  });

  it("is disabled by default", () => {
    expect(isResidencyInstrumentEnabled()).toBe(false);
  });

  it("beginResidencyStep registers no requestAnimationFrame listener while disabled", () => {
    beginResidencyStep("fit");
    expect(rafSpy).not.toHaveBeenCalled();
  });

  it("every recorder is a no-op while disabled -- endResidencyStep returns null", () => {
    beginResidencyStep("fit");
    recordResidencyStreamIssued();
    recordResidencyBatch(10, 100);
    recordResidencyAfterRender();
    recordResidencyInput();
    expect(endResidencyStep()).toBeNull();
    expect(rafSpy).not.toHaveBeenCalled();
  });

  it("enableResidencyInstrument + beginResidencyStep DOES register a requestAnimationFrame loop", () => {
    enableResidencyInstrument();
    expect(isResidencyInstrumentEnabled()).toBe(true);
    beginResidencyStep("fit");
    expect(rafSpy).toHaveBeenCalledTimes(1);
  });

  it("disableResidencyInstrument stops a running loop and discards the active step", () => {
    enableResidencyInstrument();
    beginResidencyStep("fit");
    expect(rafSpy).toHaveBeenCalledTimes(1);
    disableResidencyInstrument();
    expect(cancelSpy).toHaveBeenCalledTimes(1);
    expect(isResidencyInstrumentEnabled()).toBe(false);
  });

  it("counters accumulate correctly through the enabled singleton wiring, end to end", () => {
    enableResidencyInstrument();
    beginResidencyStep("pan-north");
    recordResidencyStreamIssued();
    recordResidencyBatch(37, 4096);
    recordResidencyBatch(63, 8192);
    const result = endResidencyStep();
    expect(result).not.toBeNull();
    expect(result!.stepId).toBe("pan-north");
    expect(result!.counters.streamsIssued).toBe(1);
    expect(result!.counters.batchesReceived).toBe(2);
    expect(result!.counters.featuresDecoded).toBe(100);
    expect(result!.counters.bytesDecoded).toBe(12288);
  });
});
