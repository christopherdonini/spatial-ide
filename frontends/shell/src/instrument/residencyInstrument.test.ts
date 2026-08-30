// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { afterEach, describe, expect, it } from "vitest";

import {
  beginResidencyStep,
  disableResidencyInstrument,
  enableResidencyInstrument,
  endResidencyStep,
  getResidencyInFlightStreamCount,
  isResidencyInstrumentEnabled,
  recordResidencyBatch,
  recordResidencyInput,
  recordResidencyRenderTick,
  recordResidencyStreamEnded,
  recordResidencyStreamIssued,
  ResidencyInstrumentCore,
} from "./residencyInstrument";

describe("ResidencyInstrumentCore -- pure state machine, synthetic clock", () => {
  it("has no active step, and every mutator no-ops, before beginStep", () => {
    const core = new ResidencyInstrumentCore();
    expect(core.isStepActive).toBe(false);
    core.recordStreamIssued(5);
    core.recordStreamEnded();
    core.recordBatch(10, 100, false);
    core.recordFrame(5);
    core.recordInput(5);
    expect(core.endStep()).toBeNull();
  });

  it("accumulates accepted-batch counters correctly (M2: separate from refused)", () => {
    const core = new ResidencyInstrumentCore();
    core.beginStep("pan-north", 1000);
    core.recordStreamIssued(1000);
    core.recordStreamIssued(1010);
    core.recordBatch(37, 4096, false);
    core.recordBatch(63, 8192, false);
    const result = core.endStep();
    expect(result).not.toBeNull();
    expect(result!.stepId).toBe("pan-north");
    expect(result!.counters).toEqual({
      streamsIssued: 2,
      streamsEnded: 0,
      batchesReceived: 2,
      featuresDecoded: 100,
      bytesDecoded: 12288,
      batchesRefused: 0,
      featuresRefused: 0,
      bytesRefused: 0,
      tilesRequested: 0,
    });
  });

  it("M2: a refused batch is counted separately, never folded into the accepted totals", () => {
    const core = new ResidencyInstrumentCore();
    core.beginStep("zoom-in-1", 0);
    core.recordStreamIssued(0);
    core.recordBatch(37, 4096, false); // accepted
    core.recordBatch(999, 99999, true); // refused
    const result = core.endStep();
    expect(result!.counters).toEqual({
      streamsIssued: 1,
      streamsEnded: 0,
      batchesReceived: 1,
      featuresDecoded: 37,
      bytesDecoded: 4096,
      batchesRefused: 1,
      featuresRefused: 999,
      bytesRefused: 99999,
      tilesRequested: 0,
    });
  });

  it("M6: recordStreamEnded pairs with recordStreamIssued in the counters", () => {
    const core = new ResidencyInstrumentCore();
    core.beginStep("pan-east", 0);
    core.recordStreamIssued(0);
    core.recordStreamEnded();
    const result = core.endStep();
    expect(result!.counters.streamsIssued).toBe(1);
    expect(result!.counters.streamsEnded).toBe(1);
  });

  describe("M1: firstPixelMs -- clock starts at first recordStreamIssued, stamp fires on first render AFTER the first ACCEPTED batch", () => {
    it("stamps firstPixelMs from (first render after the first accepted batch) minus (first stream issued)", () => {
      const core = new ResidencyInstrumentCore();
      core.beginStep("fit", 1000); // beginStep's own nowMs no longer the clock origin (M1)
      core.recordStreamIssued(1100); // clock origin
      core.recordFrame(1150); // a render BEFORE any batch arrived -- a gesture repaint, must NOT stamp
      core.recordBatch(50, 500, false); // first accepted batch arrives
      core.recordFrame(1250); // the batch's own first paint -- THIS stamps
      core.recordFrame(1400); // must not overwrite the first stamp
      const result = core.endStep();
      expect(result!.firstPixelMs).toBe(150); // 1250 - 1100, never 1150 - 1100 and never vs beginStep's 1000
      expect(result!.firstPixelReason).toBeUndefined();
    });

    it('a step with zero streams issued reports firstPixelMs: null, reason "no-query"', () => {
      const core = new ResidencyInstrumentCore();
      core.beginStep("fit", 0);
      core.recordFrame(50); // renders can still happen with no query issued this step
      const result = core.endStep();
      expect(result!.firstPixelMs).toBeNull();
      expect(result!.firstPixelReason).toBe("no-query");
    });

    it('a step with a stream issued but zero accepted batches reports firstPixelMs: null, reason "no-batch"', () => {
      const core = new ResidencyInstrumentCore();
      core.beginStep("fit", 0);
      core.recordStreamIssued(10);
      core.recordFrame(50); // renders, but no batch ever arrived -- gesture-repaint only
      const result = core.endStep();
      expect(result!.firstPixelMs).toBeNull();
      expect(result!.firstPixelReason).toBe("no-batch");
    });

    it('a REFUSED-only batch does not satisfy the first-pixel condition -- reason stays "no-batch"', () => {
      const core = new ResidencyInstrumentCore();
      core.beginStep("fit", 0);
      core.recordStreamIssued(10);
      core.recordBatch(10, 100, true); // refused -- never renders anything new
      core.recordFrame(50);
      const result = core.endStep();
      expect(result!.firstPixelMs).toBeNull();
      expect(result!.firstPixelReason).toBe("no-batch");
    });

    it('a stream issued and a batch accepted, but no render observed before endStep, reports reason "no-paint"', () => {
      const core = new ResidencyInstrumentCore();
      core.beginStep("fit", 0);
      core.recordStreamIssued(10);
      core.recordBatch(10, 100, false);
      const result = core.endStep();
      expect(result!.firstPixelMs).toBeNull();
      expect(result!.firstPixelReason).toBe("no-paint");
    });

    it("the clock origin is the FIRST recordStreamIssued this step, not a later one", () => {
      const core = new ResidencyInstrumentCore();
      core.beginStep("fit", 0);
      core.recordStreamIssued(100);
      core.recordStreamIssued(300); // must not move the origin
      core.recordBatch(1, 1, false);
      core.recordFrame(400);
      const result = core.endStep();
      expect(result!.firstPixelMs).toBe(300); // 400 - 100
    });
  });

  it("M3: collects one frameTimestamps entry per recordFrame call, in order -- a real render series", () => {
    const core = new ResidencyInstrumentCore();
    core.beginStep("zoom-in-1", 0);
    core.recordFrame(16);
    core.recordFrame(33);
    core.recordFrame(50);
    const result = core.endStep();
    expect(result!.frameTimestamps).toEqual([16, 33, 50]);
    expect(result!.frameTimestampsTruncated).toBe(false);
  });

  it("S9: caps frameTimestamps and sets frameTimestampsTruncated rather than growing unbounded", () => {
    const core = new ResidencyInstrumentCore();
    core.beginStep("pan-north", 0);
    for (let i = 0; i < 5010; i++) core.recordFrame(i);
    const result = core.endStep();
    expect(result!.frameTimestamps.length).toBe(5000);
    expect(result!.frameTimestampsTruncated).toBe(true);
  });

  it("resolves an input-to-present proxy from the NEXT recordFrame after recordInput", () => {
    const core = new ResidencyInstrumentCore();
    core.beginStep("pan-east", 0);
    core.recordInput(100);
    core.recordFrame(116); // resolves the pending input: 116 - 100 = 16
    core.recordFrame(133); // no pending input -- not a second proxy entry
    const result = core.endStep();
    expect(result!.inputToPresentProxiesMs).toEqual([16]);
    expect(result!.inputToPresentProxiesTruncated).toBe(false);
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
    core.recordStreamIssued(0);
    const first = core.endStep();
    const second = core.endStep();
    expect(first).not.toBeNull();
    expect(second).toBeNull();
  });

  it("a fresh beginStep resets counters/timings -- nothing from the prior step leaks forward", () => {
    const core = new ResidencyInstrumentCore();
    core.beginStep("pan-north", 0);
    core.recordStreamIssued(0);
    core.recordBatch(50, 500, false);
    core.endStep();

    core.beginStep("pan-east", 1000);
    const result = core.endStep();
    expect(result!.counters).toEqual({
      streamsIssued: 0,
      streamsEnded: 0,
      batchesReceived: 0,
      featuresDecoded: 0,
      bytesDecoded: 0,
      batchesRefused: 0,
      featuresRefused: 0,
      bytesRefused: 0,
      tilesRequested: 0,
    });
    expect(result!.frameTimestamps).toEqual([]);
    expect(result!.inputToPresentProxiesMs).toEqual([]);
  });
});

describe("DEV-only singleton wiring -- instrument-off registers/tracks nothing", () => {
  afterEach(() => {
    disableResidencyInstrument();
  });

  it("is disabled by default", () => {
    expect(isResidencyInstrumentEnabled()).toBe(false);
  });

  it("every recorder is a no-op while disabled -- endResidencyStep returns null, in-flight stays 0", () => {
    beginResidencyStep("fit");
    recordResidencyStreamIssued();
    recordResidencyBatch(10, 100, false);
    recordResidencyRenderTick();
    recordResidencyInput();
    expect(endResidencyStep()).toBeNull();
    expect(getResidencyInFlightStreamCount()).toBe(0);
  });

  it("counters accumulate correctly through the enabled singleton wiring, end to end", () => {
    enableResidencyInstrument();
    beginResidencyStep("pan-north");
    recordResidencyStreamIssued();
    recordResidencyBatch(37, 4096, false);
    recordResidencyBatch(63, 8192, false);
    const result = endResidencyStep();
    expect(result).not.toBeNull();
    expect(result!.stepId).toBe("pan-north");
    expect(result!.counters.streamsIssued).toBe(1);
    expect(result!.counters.batchesReceived).toBe(2);
    expect(result!.counters.featuresDecoded).toBe(100);
    expect(result!.counters.bytesDecoded).toBe(12288);
  });

  it("M6: recordResidencyStreamIssued/Ended maintain a driver-visible in-flight count", () => {
    enableResidencyInstrument();
    expect(getResidencyInFlightStreamCount()).toBe(0);
    recordResidencyStreamIssued();
    expect(getResidencyInFlightStreamCount()).toBe(1);
    recordResidencyStreamIssued();
    expect(getResidencyInFlightStreamCount()).toBe(2);
    recordResidencyStreamEnded();
    expect(getResidencyInFlightStreamCount()).toBe(1);
    recordResidencyStreamEnded();
    expect(getResidencyInFlightStreamCount()).toBe(0);
  });

  it("S3: the in-flight count never moves while disabled -- issued/ended both no-op", () => {
    recordResidencyStreamIssued();
    recordResidencyStreamIssued();
    recordResidencyStreamEnded();
    expect(getResidencyInFlightStreamCount()).toBe(0);
  });

  it("disableResidencyInstrument resets in-flight to 0 and discards the active step", () => {
    enableResidencyInstrument();
    recordResidencyStreamIssued();
    beginResidencyStep("fit");
    expect(getResidencyInFlightStreamCount()).toBe(1);
    disableResidencyInstrument();
    expect(isResidencyInstrumentEnabled()).toBe(false);
    expect(getResidencyInFlightStreamCount()).toBe(0);
  });

  it("M1/M3 end to end through the singleton: gesture-only render does not stamp; the batch's own render does", () => {
    enableResidencyInstrument();
    beginResidencyStep("fit");
    recordResidencyStreamIssued();
    recordResidencyRenderTick(); // gesture repaint, no batch yet
    recordResidencyBatch(10, 100, false);
    recordResidencyRenderTick(); // the batch's own paint
    const result = endResidencyStep();
    expect(result!.firstPixelMs).not.toBeNull();
    expect(result!.firstPixelMs).toBeGreaterThanOrEqual(0);
  });
});
