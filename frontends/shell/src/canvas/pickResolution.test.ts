// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it } from "vitest";

import type { ResidentBatch } from "./decodeBatch";
import {
  averageFeatureExtent,
  isBelowPickResolution,
  reevaluateStandingHoverOnCameraChange,
  SUB_PIXEL_PICK_REFUSAL_THRESHOLD_PX,
} from "./pickResolution";

function batchOf(features: Array<Array<[number, number]>>): Pick<ResidentBatch, "rings"> {
  // One exterior ring per feature, no holes -- `features[i]` is that feature's own ring vertex list.
  return { rings: features.map((ring) => [ring]) };
}

describe("averageFeatureExtent", () => {
  it("is 0 for no batches at all", () => {
    expect(averageFeatureExtent([])).toBe(0);
  });

  it("is 0 when every batch carries no real vertex (empty rings)", () => {
    const b = batchOf([[]]);
    expect(averageFeatureExtent([b])).toBe(0);
  });

  it("a single feature's own extent is the larger of its width/height", () => {
    // A 10-wide, 4-tall box -- extent is max(10, 4) = 10.
    const b = batchOf([[[0, 0], [10, 0], [10, 4], [0, 4]]]);
    expect(averageFeatureExtent([b])).toBe(10);
  });

  it("averages across every feature in every batch", () => {
    const b1 = batchOf([[[0, 0], [2, 0]]]); // extent 2
    const b2 = batchOf([[[0, 0], [6, 0]]]); // extent 6
    expect(averageFeatureExtent([b1, b2])).toBe(4); // (2 + 6) / 2
  });

  it("a feature with no vertex at all (e.g. a null geometry) is excluded from the average, not counted as 0", () => {
    const withNull = batchOf([[[0, 0], [10, 0]], []]); // one real (extent 10), one empty
    expect(averageFeatureExtent([withNull])).toBe(10); // not (10 + 0) / 2
  });
});

describe("isBelowPickResolution", () => {
  it("above the declared threshold: not below -- an ordinary pick behaves as today", () => {
    // 5 world units * 1 px/unit = 5px, above the 2px threshold.
    expect(isBelowPickResolution(5, 1)).toBe(false);
  });

  it("below the declared threshold: refused", () => {
    // 1 world unit * 1 px/unit = 1px, below the 2px threshold.
    expect(isBelowPickResolution(1, 1)).toBe(true);
  });

  it("exactly at the threshold is NOT below it -- a strict less-than comparison", () => {
    expect(isBelowPickResolution(SUB_PIXEL_PICK_REFUSAL_THRESHOLD_PX, 1)).toBe(false);
  });

  it("zero average extent (nothing real resident yet) computes as below resolution -- the pure comparison alone, never reached in practice without a real pick first (WorkingCanvas.tsx's own onHover gates on a valid GPU pick index before ever calling this)", () => {
    expect(isBelowPickResolution(0, 1)).toBe(true);
  });
});

// Residency-debt cut 1b, Item C (DECISIONS-PENDING entry 29, "K6"): the standing hover re-evaluated
// on a camera change, no GPU re-pick. Test cases are the ones pre-committed in
// `RESIDENCY-DEBT-1B.md`'s Item C.
describe("reevaluateStandingHoverOnCameraChange", () => {
  const standingFeatureId = { streamHandle: "sh_test", batchSeq: 1, id: 42n, anchor: [0, 0] as [number, number] };
  const standingRefusal = { kind: "below-pick-resolution" as const };

  it("(a) standing feature id + zoom-out crosses below the threshold -> refuse by name", () => {
    // extent 1 * 1 px/unit = 1px, below the 2px threshold.
    const result = reevaluateStandingHoverOnCameraChange(standingFeatureId, 1, 1);
    expect(result).toEqual({ kind: "below-pick-resolution" });
  });

  it("(b) standing feature id + zoom stays above the threshold -> clear to null, never re-assert the id", () => {
    // extent 5 * 1 px/unit = 5px, above the 2px threshold.
    const result = reevaluateStandingHoverOnCameraChange(standingFeatureId, 5, 1);
    expect(result).toBeNull();
  });

  it("(c) standing refusal + zoom-in crosses above the threshold -> clear to null", () => {
    const result = reevaluateStandingHoverOnCameraChange(standingRefusal, 5, 1);
    expect(result).toBeNull();
  });

  it("(d) standing refusal + still below the threshold -> unchanged, no redundant re-emit", () => {
    const result = reevaluateStandingHoverOnCameraChange(standingRefusal, 1, 1);
    expect(result).toBeUndefined();
  });

  it("(e) null standing (nothing shown) -> no-op regardless of the new zoom", () => {
    expect(reevaluateStandingHoverOnCameraChange(null, 1, 1)).toBeUndefined();
    expect(reevaluateStandingHoverOnCameraChange(null, 5, 1)).toBeUndefined();
  });
});
