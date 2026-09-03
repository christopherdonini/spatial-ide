// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it } from "vitest";

import type { ResidentBatch } from "./decodeBatch";
import { isPickBelowResolution, resolvePick } from "./pick";

function batch(): ResidentBatch {
  return {
    streamHandle: "sh_test",
    batchSeq: 3,
    ids: BigUint64Array.from([100n, 200n, 18_446_744_073_709_551_615n]),
    rings: [
      [[[0, 0], [1, 0], [1, 1], [0, 0]]],
      [
        [[10, 10], [11, 10], [11, 11], [10, 10]],
        [[10.4, 10.4], [10.6, 10.4], [10.4, 10.4]],
      ],
      [], // a feature with no rings at all -- degenerate but must not crash the lookup
    ],
    totalVertices: 4 + 7,
  };
}

describe("resolvePick (ADR-010 rule 2's indirection)", () => {
  it("resolves the GPU ordinal to the id and anchor built together at the same index", () => {
    const result = resolvePick(batch(), 0);
    expect(result).not.toBeNull();
    expect(result!.id).toBe(100n);
    expect(result!.anchor).toEqual([0, 0]);
    expect(result!.streamHandle).toBe("sh_test");
    expect(result!.batchSeq).toBe(3);
  });

  it("a reversed/shuffled ordinal still resolves via the buffer's own order, not a guess", () => {
    // The spike's own validation: an ordinal is looked up, never assumed to equal an id.
    const result = resolvePick(batch(), 1);
    expect(result!.id).toBe(200n);
    expect(result!.anchor).toEqual([10, 10]); // exterior ring's first vertex, not the hole's
  });

  it("preserves an id above Number.MAX_SAFE_INTEGER exactly (ADR-016 §7)", () => {
    const result = resolvePick(batch(), 2);
    expect(result!.id).toBe(18_446_744_073_709_551_615n);
    expect(result!.anchor).toBeNull(); // no rings for this feature
  });

  it("an out-of-range ordinal resolves to null rather than throwing or wrapping", () => {
    expect(resolvePick(batch(), -1)).toBeNull();
    expect(resolvePick(batch(), 3)).toBeNull();
    expect(resolvePick(batch(), 1.5)).toBeNull();
  });
});

// Viewport-residency cut P6a, decision 24(c): the typed sub-pixel pick refusal's own discriminant.
describe("isPickBelowResolution", () => {
  it("is false for null (nothing under the cursor)", () => {
    expect(isPickBelowResolution(null)).toBe(false);
  });

  it("is false for an ordinary PickResult (no kind field at all)", () => {
    expect(isPickBelowResolution(resolvePick(batch(), 0))).toBe(false);
  });

  it("is true for the refusal shape", () => {
    expect(isPickBelowResolution({ kind: "below-pick-resolution" })).toBe(true);
  });
});
