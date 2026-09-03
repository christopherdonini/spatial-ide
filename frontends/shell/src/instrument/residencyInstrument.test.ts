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
  recordResidencyBatchArrived,
  recordResidencyBatchDecoded,
  recordResidencyDuplicatesDropped,
  recordResidencyEvictionsApplied,
  recordResidencyInput,
  recordResidencyRenderTick,
  recordResidencyStreamEnded,
  recordResidencyStreamIssued,
  recordResidencyTileRequested,
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
    core.recordBatchArrived(5); // P3i
    core.recordBatchDecoded(5); // P3i
    core.recordTileRequested(); // P3i
    core.recordDuplicatesDropped(3); // P3i
    core.recordEvictionsApplied(2); // P3i
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
      duplicatesDropped: 0,
      evictionsApplied: 0,
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
      duplicatesDropped: 0,
      evictionsApplied: 0,
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

  describe("P3i (RESIDENCY-PREREGISTRATION.md's own §12 Amendment 15): the three per-step segment sub-spans", () => {
    it("computes all three spans, and they sum to exactly firstPixelMs, in the common (first-batch-accepted) case", () => {
      const core = new ResidencyInstrumentCore();
      core.beginStep("fit", 0);
      core.recordStreamIssued(1000); // clock origin
      core.recordBatchArrived(1020); // query -> first-byte: 20
      core.recordBatchDecoded(1035); // first-byte -> decoded: 15
      core.recordBatch(50, 500, false); // accepted -- arms firstBatchArrived
      core.recordFrame(1070); // decoded -> painted: 35; firstPixelMs: 70
      const result = core.endStep();
      expect(result!.queryToFirstByteMs).toBe(20);
      expect(result!.queryToFirstByteReason).toBeUndefined();
      expect(result!.firstByteToDecodedMs).toBe(15);
      expect(result!.firstByteToDecodedReason).toBeUndefined();
      expect(result!.decodedToPaintedMs).toBe(35);
      expect(result!.decodedToPaintedReason).toBeUndefined();
      expect(result!.firstPixelMs).toBe(70);
      expect(
        result!.queryToFirstByteMs! + result!.firstByteToDecodedMs! + result!.decodedToPaintedMs!
      ).toBe(result!.firstPixelMs);
    });

    it('a second recordBatchArrived/recordBatchDecoded this step (out-of-order re-arrival) does not move the already-set one-shot timestamps', () => {
      const core = new ResidencyInstrumentCore();
      core.beginStep("pan-north", 0);
      core.recordStreamIssued(1000);
      core.recordBatchArrived(1010);
      core.recordBatchArrived(1500); // later batch's own arrival -- must not move the marker
      core.recordBatchDecoded(1020);
      core.recordBatchDecoded(1600); // later batch's own decode -- must not move the marker
      core.recordBatch(1, 1, false);
      core.recordFrame(1030);
      const result = core.endStep();
      expect(result!.queryToFirstByteMs).toBe(10); // 1010 - 1000, never 1500 - 1000
      expect(result!.firstByteToDecodedMs).toBe(10); // 1020 - 1010, never 1600 - 1010
    });

    it('zero streams issued this step -- all three spans null, reason "no-query" (matching firstPixelReason)', () => {
      const core = new ResidencyInstrumentCore();
      core.beginStep("fit", 0);
      core.recordFrame(50);
      const result = core.endStep();
      expect(result!.queryToFirstByteMs).toBeNull();
      expect(result!.queryToFirstByteReason).toBe("no-query");
      expect(result!.firstByteToDecodedMs).toBeNull();
      expect(result!.firstByteToDecodedReason).toBe("no-query");
      expect(result!.decodedToPaintedMs).toBeNull();
      expect(result!.decodedToPaintedReason).toBe("no-query");
    });

    it('a stream issued but no batch ever arrives -- all three spans null, reason "no-batch"', () => {
      const core = new ResidencyInstrumentCore();
      core.beginStep("fit", 0);
      core.recordStreamIssued(10);
      core.recordFrame(50);
      const result = core.endStep();
      expect(result!.queryToFirstByteMs).toBeNull();
      expect(result!.queryToFirstByteReason).toBe("no-batch");
      expect(result!.firstByteToDecodedMs).toBeNull();
      expect(result!.firstByteToDecodedReason).toBe("no-batch");
      expect(result!.decodedToPaintedMs).toBeNull();
      expect(result!.decodedToPaintedReason).toBe("no-batch");
    });

    it("the disclosed divergence: a REFUSED first batch that genuinely arrived+decoded reports real byte/decode spans beside a null decodedToPaintedMs (reason no-batch, mirroring firstPixelReason)", () => {
      const core = new ResidencyInstrumentCore();
      core.beginStep("fit", 0);
      core.recordStreamIssued(1000);
      core.recordBatchArrived(1020); // the first batch really did arrive
      core.recordBatchDecoded(1035); // and really did decode
      core.recordBatch(10, 100, true); // but was REFUSED -- never arms firstBatchArrived
      core.recordFrame(1200); // a render happens, but there is still no accepted batch
      const result = core.endStep();
      expect(result!.queryToFirstByteMs).toBe(20); // real: the batch genuinely arrived
      expect(result!.queryToFirstByteReason).toBeUndefined();
      expect(result!.firstByteToDecodedMs).toBe(15); // real: the batch genuinely decoded
      expect(result!.firstByteToDecodedReason).toBeUndefined();
      expect(result!.decodedToPaintedMs).toBeNull(); // no ACCEPTED batch ever arrived
      expect(result!.decodedToPaintedReason).toBe("no-batch");
      expect(result!.firstPixelMs).toBeNull();
      expect(result!.firstPixelReason).toBe("no-batch");
    });

    it('a batch arrives, decodes, and is accepted, but no render is observed before endStep -- byte/decode spans measured, decodedToPaintedMs null, reason "no-paint"', () => {
      const core = new ResidencyInstrumentCore();
      core.beginStep("fit", 0);
      core.recordStreamIssued(1000);
      core.recordBatchArrived(1020);
      core.recordBatchDecoded(1035);
      core.recordBatch(10, 100, false); // accepted
      const result = core.endStep(); // no recordFrame at all
      expect(result!.queryToFirstByteMs).toBe(20);
      expect(result!.firstByteToDecodedMs).toBe(15);
      expect(result!.decodedToPaintedMs).toBeNull();
      expect(result!.decodedToPaintedReason).toBe("no-paint");
      expect(result!.firstPixelMs).toBeNull();
      expect(result!.firstPixelReason).toBe("no-paint");
    });
  });

  describe("P3i-b (instrument mini-review): B2 mixed-batch mislabeling + S5 null-without-reason holes / negative-span clamp", () => {
    it("B2: a REFUSED batch #1 followed by an ACCEPTED batch #2 -- segmentsSpanSingleBatch is false, but the three spans still sum to exactly firstPixelMs (B1's algebra, mislabeled, never inconsistent)", () => {
      const core = new ResidencyInstrumentCore();
      core.beginStep("fit", 0);
      core.recordStreamIssued(1000); // clock origin
      core.recordBatchArrived(1020); // batch #1's own arrival -- the one-shot marker
      core.recordBatchDecoded(1035); // batch #1's own decode -- the one-shot marker
      core.recordBatch(10, 100, true); // batch #1 REFUSED
      core.recordBatchArrived(1060); // batch #2's own arrival -- one-shot already set, this is a no-op on the marker
      core.recordBatchDecoded(1080); // batch #2's own decode -- one-shot already set, this is a no-op on the marker
      core.recordBatch(20, 200, false); // batch #2 ACCEPTED -- arms firstBatchArrived; NOT the step's first batch overall
      core.recordFrame(1200); // batch #2's own paint
      const result = core.endStep();
      expect(result!.segmentsSpanSingleBatch).toBe(false);
      // The labels are wrong (decodedToPaintedMs below is really "batch #1's own decode to batch #2's
      // own paint", not "batch #2's own decode to paint"), but the raw markers never moved off batch
      // #1's own arrival/decode (one-shot), so the numbers themselves are exactly what this file's own
      // top doc comment (B2) describes:
      expect(result!.queryToFirstByteMs).toBe(20); // 1020 - 1000 (batch #1's own arrival)
      expect(result!.firstByteToDecodedMs).toBe(15); // 1035 - 1020 (batch #1's own decode)
      expect(result!.decodedToPaintedMs).toBe(165); // 1200 - 1035 (batch #2's own eventual paint)
      expect(result!.firstPixelMs).toBe(200); // 1200 - 1000
      expect(
        result!.queryToFirstByteMs! + result!.firstByteToDecodedMs! + result!.decodedToPaintedMs!
      ).toBe(result!.firstPixelMs); // B1: always sums, exactly, real integers here -- no tolerance needed
    });

    it('S5 hole 1 (closed): a batch arrives but its own decode is never observed before endStep -- firstByteToDecodedMs is null WITH a reason, never undefined', () => {
      const core = new ResidencyInstrumentCore();
      core.beginStep("fit", 0);
      core.recordStreamIssued(1000);
      core.recordBatchArrived(1020); // arrival observed
      // recordBatchDecoded is deliberately never called -- believed unreachable (synchronous decode),
      // guarded anyway per S7's own qualification.
      const result = core.endStep();
      expect(result!.queryToFirstByteMs).toBe(20); // arrival alone is enough for this span
      expect(result!.firstByteToDecodedMs).toBeNull();
      expect(result!.firstByteToDecodedReason).toBe("no-batch"); // defined, never left undefined
    });

    it("S5 hole 2 (closed): a batch arrival observed with no recordStreamIssued this step at all (an ordering violation this pure state machine does not itself prevent) -- both byte spans null WITH a reason", () => {
      const core = new ResidencyInstrumentCore();
      core.beginStep("fit", 0);
      // recordStreamIssued deliberately never called this step.
      core.recordBatchArrived(1020);
      const result = core.endStep();
      expect(result!.queryToFirstByteMs).toBeNull();
      expect(result!.queryToFirstByteReason).toBe("no-query"); // defined, never left undefined
      expect(result!.firstByteToDecodedMs).toBeNull();
      expect(result!.firstByteToDecodedReason).toBe("no-query");
    });

    it("S5: a negative queryToFirstByteMs (a batch arrival timestamp predating the step's own clock origin) clamps to null with reason cross-step-stream, never a negative duration", () => {
      const core = new ResidencyInstrumentCore();
      core.beginStep("fit", 0);
      core.recordStreamIssued(2000);
      core.recordBatchArrived(1000); // predates the clock origin -- would be -1000 unclamped
      const result = core.endStep();
      expect(result!.queryToFirstByteMs).toBeNull();
      expect(result!.queryToFirstByteReason).toBe("cross-step-stream");
    });

    it("S5: a negative firstByteToDecodedMs clamps to null with reason cross-step-stream, independent of queryToFirstByteMs staying positive", () => {
      const core = new ResidencyInstrumentCore();
      core.beginStep("fit", 0);
      core.recordStreamIssued(1000);
      core.recordBatchArrived(2000);
      core.recordBatchDecoded(1500); // predates its own arrival -- would be -500 unclamped
      const result = core.endStep();
      expect(result!.queryToFirstByteMs).toBe(1000); // unaffected -- still positive, no clamp
      expect(result!.firstByteToDecodedMs).toBeNull();
      expect(result!.firstByteToDecodedReason).toBe("cross-step-stream");
    });

    it("S5: a negative decodedToPaintedMs clamps to null with reason cross-step-stream -- firstPixelMs itself is a separate, unclamped stamp", () => {
      const core = new ResidencyInstrumentCore();
      core.beginStep("fit", 0);
      core.recordStreamIssued(1000);
      core.recordBatchArrived(1010);
      core.recordBatchDecoded(1020);
      core.recordBatch(10, 100, false); // accepted -- arms firstBatchArrived
      core.recordFrame(1015); // predates the decode marker -- would be -5 unclamped
      const result = core.endStep();
      expect(result!.decodedToPaintedMs).toBeNull();
      expect(result!.decodedToPaintedReason).toBe("cross-step-stream");
      expect(result!.firstPixelMs).toBe(15); // 1015 - 1000 -- this stamp is not itself clamped by S5
    });

    it("entry-31 fix (1): queryToFirstByteMs of exactly 0 (arrival and issuance in one clock quantum -- P12's two impostor rows) clamps to null with the DISTINCT reason cross-step-stream-zero", () => {
      const core = new ResidencyInstrumentCore();
      core.beginStep("fit", 0);
      core.recordStreamIssued(1000);
      core.recordBatchArrived(1000); // same quantum -- the arrival-before-issue chain's degenerate case
      const result = core.endStep();
      expect(result!.queryToFirstByteMs).toBeNull();
      expect(result!.queryToFirstByteReason).toBe("cross-step-stream-zero"); // distinguishable from the negative case post hoc
      expect(result!.firstPixelCrossStepSuspect).toBe(true); // should-fix 5: the gated headline is flagged too
    });

    it("entry-31 fix (2), the mechanism-true corrupt shape (P12's zoom-in-3: issue POSTDATES decode by seconds): decodedToPaintedMs nulled, firstByteToDecodedMs kept, firstPixel flagged suspect", () => {
      const core = new ResidencyInstrumentCore();
      core.beginStep("fit", 0);
      // P12 zoom-in-3's true ordering: a cross-step batch arrives and decodes long before this
      // step records ANY issue; the paint stamp cannot arm until the late issue record lands.
      core.recordBatchArrived(1000);
      core.recordBatchDecoded(1005);
      core.recordBatch(10, 100, false); // accepted -- arms firstBatchArrived
      core.recordStreamIssued(14431); // 13.4s later -- the "waiting for any issue record" wait
      core.recordFrame(14622);
      const result = core.endStep();
      expect(result!.queryToFirstByteMs).toBeNull(); // raw -13431
      expect(result!.queryToFirstByteReason).toBe("cross-step-stream");
      expect(result!.decodedToPaintedMs).toBeNull(); // would be 13617 unfixed -- decode->issue-wait->frame, not paint
      expect(result!.decodedToPaintedReason).toBe("cross-step-stream");
      expect(result!.firstByteToDecodedMs).toBe(5); // decode of that same batch -- real, kept
      expect(result!.firstPixelMs).toBe(191); // P12's own recorded value for this shape
      expect(result!.firstPixelCrossStepSuspect).toBe(true); // flagged: arrival->paint, not query->paint
    });

    it("entry-31 fix (2), the in-chain quantum shape (P12's pan-east: issue PRECEDES decode): decodedToPaintedMs SURVIVES as a genuine paint measurement -- the reviewer's must-fix 2 case", () => {
      const core = new ResidencyInstrumentCore();
      core.beginStep("fit", 0);
      // Pan-east's true ordering: arrival, then issue 1 quantum later IN the same delivery chain,
      // then decode, then paint. The paint stamp was armable at decode time -- the 15ms below is
      // real paint, and nulling it would have destroyed the attribution pass's own evidence.
      core.recordBatchArrived(1000);
      core.recordStreamIssued(1001); // raw q2b = -1: cross-step SIGN fires...
      core.recordBatchDecoded(1013);
      core.recordBatch(10, 100, false);
      core.recordFrame(1028);
      const result = core.endStep();
      expect(result!.queryToFirstByteMs).toBeNull();
      expect(result!.queryToFirstByteReason).toBe("cross-step-stream");
      expect(result!.decodedToPaintedMs).toBe(15); // ...but issue(1001) < decode(1013): genuine paint, KEPT
      expect(result!.decodedToPaintedReason).toBeUndefined();
      expect(result!.firstPixelCrossStepSuspect).toBe(true);
    });

    it("entry-31 fix boundary: firstByteToDecodedMs of exactly 0 SURVIVES (decode is synchronous with arrival -- same quantum is legitimate, the zero-clamp is queryToFirstByteMs-only)", () => {
      const core = new ResidencyInstrumentCore();
      core.beginStep("fit", 0);
      core.recordStreamIssued(1000);
      core.recordBatchArrived(1200);
      core.recordBatchDecoded(1200); // same quantum -- expected for synchronous decode
      const result = core.endStep();
      expect(result!.queryToFirstByteMs).toBe(200); // a positive span is untouched
      expect(result!.firstByteToDecodedMs).toBe(0); // legitimate, not clamped
      expect(result!.firstByteToDecodedReason).toBeUndefined();
    });

    it("entry-31 fix boundary: a positive queryToFirstByteMs leaves decodedToPaintedMs alone -- the propagation fires only on the cross-step signature", () => {
      const core = new ResidencyInstrumentCore();
      core.beginStep("fit", 0);
      core.recordStreamIssued(1000);
      core.recordBatchArrived(1200);
      core.recordBatchDecoded(1210);
      core.recordBatch(10, 100, false);
      core.recordFrame(1250);
      const result = core.endStep();
      expect(result!.queryToFirstByteMs).toBe(200);
      expect(result!.decodedToPaintedMs).toBe(40);
      expect(result!.decodedToPaintedReason).toBeUndefined();
    });
  });

  describe("P3i: tilesRequested/duplicatesDropped/evictionsApplied counters", () => {
    it("recordTileRequested increments tilesRequested once per call", () => {
      const core = new ResidencyInstrumentCore();
      core.beginStep("fit", 0);
      core.recordTileRequested();
      core.recordTileRequested();
      const result = core.endStep();
      expect(result!.counters.tilesRequested).toBe(2);
    });

    it("recordDuplicatesDropped/recordEvictionsApplied sum their own pre-aggregated counts across the step", () => {
      const core = new ResidencyInstrumentCore();
      core.beginStep("pan-north", 0);
      core.recordDuplicatesDropped(3);
      core.recordDuplicatesDropped(2);
      core.recordEvictionsApplied(1);
      core.recordEvictionsApplied(4);
      const result = core.endStep();
      expect(result!.counters.duplicatesDropped).toBe(5);
      expect(result!.counters.evictionsApplied).toBe(5);
    });

    it("a step that never calls any of the three reports honest zeros, not null (baseline's own shape)", () => {
      const core = new ResidencyInstrumentCore();
      core.beginStep("fit", 0);
      const result = core.endStep();
      expect(result!.counters.tilesRequested).toBe(0);
      expect(result!.counters.duplicatesDropped).toBe(0);
      expect(result!.counters.evictionsApplied).toBe(0);
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
      duplicatesDropped: 0,
      evictionsApplied: 0,
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
    recordResidencyBatchArrived(); // P3i
    recordResidencyBatchDecoded(); // P3i
    recordResidencyTileRequested(); // P3i
    recordResidencyDuplicatesDropped(3); // P3i
    recordResidencyEvictionsApplied(2); // P3i
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

  it("P3i end to end through the singleton: segments + tile counters flow through endResidencyStep", () => {
    enableResidencyInstrument();
    beginResidencyStep("fit");
    recordResidencyStreamIssued();
    recordResidencyBatchArrived();
    recordResidencyBatchDecoded();
    recordResidencyBatch(10, 100, false);
    recordResidencyRenderTick(); // the batch's own paint -- stamps firstPixelMs/decodedToPaintedMs
    recordResidencyTileRequested();
    recordResidencyTileRequested();
    recordResidencyDuplicatesDropped(4);
    recordResidencyEvictionsApplied(1);
    const result = endResidencyStep();
    expect(result!.queryToFirstByteMs).not.toBeNull();
    expect(result!.firstByteToDecodedMs).not.toBeNull();
    expect(result!.decodedToPaintedMs).not.toBeNull();
    // P3i-b N13: this run is driven by the REAL singleton wiring (`performance.now()`, not a
    // synthetic integer clock like every `ResidencyInstrumentCore` test above) -- a bit-exact `toBe`
    // on a sum of three independently-derived floating-point subtractions is not something IEEE 754
    // addition/subtraction guarantees bit-for-bit even though the underlying real-number arithmetic
    // telescopes exactly (residencyInstrument.ts's own B1 doc comment has the algebra). `toBeCloseTo`
    // with a generous (sub-microsecond) precision keeps this assertion meaningful -- it still fails
    // if the three spans do not actually sum to `firstPixelMs` -- without depending on float
    // rounding happening to land on the identical bit pattern this specific run's own real timings
    // produced.
    expect(
      result!.queryToFirstByteMs! + result!.firstByteToDecodedMs! + result!.decodedToPaintedMs!
    ).toBeCloseTo(result!.firstPixelMs!, 6);
    // P3i-b B2: a single accepted batch this step, with nothing refused first -- the honest,
    // non-mixed case.
    expect(result!.segmentsSpanSingleBatch).toBe(true);
    expect(result!.counters.tilesRequested).toBe(2);
    expect(result!.counters.duplicatesDropped).toBe(4);
    expect(result!.counters.evictionsApplied).toBe(1);
  });
});
