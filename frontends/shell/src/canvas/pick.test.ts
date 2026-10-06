// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it } from "vitest";

import { decodeBatch, ENCODING_MULTIPOLYGON } from "./decodeBatch";
import type { ResidentBatch } from "./decodeBatch";
import { loadBatchFixture } from "../testUtils/batchFixtures";
import { partsOfPolygons } from "../testUtils/partsOfPolygons";
import type { HoverReadout } from "./pick";
import {
  confirmingReadout,
  isPickBelowResolution,
  isPickSessionEnded,
  latchedHoverReadout,
  resolvePick,
} from "./pick";

function batch(): ResidentBatch {
  return {
    streamHandle: "sh_test",
    batchSeq: 3,
    ids: BigUint64Array.from([100n, 200n, 18_446_744_073_709_551_615n]),
    ...partsOfPolygons([
      [[[0, 0], [1, 0], [1, 1], [0, 0]]],
      [
        [[10, 10], [11, 10], [11, 11], [10, 10]],
        [[10.4, 10.4], [10.6, 10.4], [10.4, 10.4]],
      ],
      [], // a feature with no rings at all -- degenerate but must not crash the lookup
    ]),
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

  /**
   * SH-4 (`engine/MULTIPOLYGON-MP1-PREREGISTRATION.md` section 4, real shape: the engine's own F-1
   * batch, decoded by the product `decodeBatch`). The ordinal is a PART ordinal: F-1 has three rows
   * and six parts, so ordinal 3 is row 1's only part (its id is 1n, and 3 is not a row index), and
   * the three parts of row 0 resolve to one identical result (one feature, one hover). The bound is
   * `partCount` (6), not the row count (3).
   *
   * RECORDED MUTATION: index `ids` by the ordinal in `resolvePick` (take the row as the ordinal
   * itself). This test then fails by name.
   *
   * Observed over `ac538440` on the uncommitted tree of the shell commit: `an ordinal on row 1's part resolves row 1's id, and two parts of row 0 resolve identically (SH-4)`
   * FAILED by name with the mutation applied, then reverted.
   */
  it("an ordinal on row 1's part resolves row 1's id, and two parts of row 0 resolve identically (SH-4)", () => {
    const f1 = decodeBatch("sh_f1", 5, loadBatchFixture("lv95-multipolygon-batch"), "geometry", ENCODING_MULTIPOLYGON);
    expect(f1.partCount).toBe(6);

    const onRow1 = resolvePick(f1, 3);
    expect(onRow1).not.toBeNull();
    expect(onRow1!.id).toBe(1n);
    expect(onRow1!.anchor).toEqual([2_600_000, 1_200_100]); // row 1's first part, exterior, first vertex
    expect(onRow1!.streamHandle).toBe("sh_f1");
    expect(onRow1!.batchSeq).toBe(5);

    const parts0 = [resolvePick(f1, 0), resolvePick(f1, 1), resolvePick(f1, 2)];
    for (const r of parts0) {
      expect(r).toEqual(parts0[0]);
    }
    expect(parts0[0]!.id).toBe(0n);
    // The anchor is the row's FIRST part's exterior first vertex, even when the pick landed on its
    // third part.
    expect(parts0[0]!.anchor).toEqual([2_600_000, 1_200_000]);

    expect(resolvePick(f1, 4)!.id).toBe(2n);
    expect(resolvePick(f1, 5)).toEqual(resolvePick(f1, 4));
    expect(resolvePick(f1, 6)).toBeNull(); // past partCount, though ids.length is 3
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

/**
 * **T8's first half (P3b §4): the pick latch** -- Brief A boundary 4's "picks refused until reopen",
 * as the pure function `App.tsx`'s one `onHover` site wraps every readout with.
 */
describe("latchedHoverReadout (boundary 4: picks refused until reopen)", () => {
  // RECORDED MUTATION naming its test:
  // "every readout state becomes the refusal while latched, including null and a standing id"
  // -- let `PickConfirming` pass through the latch (`sessionEnded && !isPickConfirming
  // (readout) ? {kind:"session-ended"} : readout`). Expected failure: that test fails on the
  // confirming case -- a standing id would still be rendered after the identities behind it were
  // voided, which is the "never a standing id" property this exists for.
  // OBSERVED: FAILED -- `AssertionError: expected { kind: 'confirming', …(1) } to deeply equal
  // { kind: 'session-ended' }`.
  it("every readout state becomes the refusal while latched, including null and a standing id", () => {
    const pick = resolvePick(batch(), 0)!;
    const states: HoverReadout[] = [
      null,
      pick,
      { kind: "below-pick-resolution" },
      confirmingReadout(pick),
    ];
    for (const state of states) {
      expect(latchedHoverReadout(state, true)).toEqual({ kind: "session-ended" });
    }
    // In particular: nothing carrying an id survives the latch. Asserted structurally rather than
    // by inspecting text, because the type is what makes it true -- `PickSessionEnded` has no `id`
    // and no `standing`, so no render path can reach one.
    for (const state of states) {
      const latched = latchedHoverReadout(state, true);
      expect(JSON.stringify(latched)).not.toContain("100");
      expect(isPickSessionEnded(latched)).toBe(true);
    }
  });

  // RECORDED MUTATION for "passes every readout through untouched while the session is live": make
  // the latch unconditional (`return {kind:"session-ended"}`). Expected failure: that test fails on
  // the first assertion -- an ordinary pick would be refused on a perfectly live session.
  // OBSERVED: FAILED -- `AssertionError: expected { kind: 'session-ended' } to be
  // { streamHandle: 'sh_test', …(3) }`.
  it("passes every readout through untouched while the session is live", () => {
    const pick = resolvePick(batch(), 0)!;
    expect(latchedHoverReadout(pick, false)).toBe(pick);
    expect(latchedHoverReadout(null, false)).toBeNull();
    expect(latchedHoverReadout({ kind: "below-pick-resolution" }, false)).toEqual({
      kind: "below-pick-resolution",
    });
  });

  // RECORDED MUTATION naming its test:
  // "isPickSessionEnded discriminates it from every other readout state"
  // -- relax the guard to `value !== null && "kind" in value`, so every kinded readout reads as the
  // refusal. Expected failure: that test fails on the `below-pick-resolution` case.
  // OBSERVED (performed once on this branch, then reverted): FAILED --
  // `AssertionError: expected true to be false`.
  it("isPickSessionEnded discriminates it from every other readout state", () => {
    expect(isPickSessionEnded(null)).toBe(false);
    expect(isPickSessionEnded(resolvePick(batch(), 0))).toBe(false);
    expect(isPickSessionEnded({ kind: "below-pick-resolution" })).toBe(false);
    expect(isPickSessionEnded(confirmingReadout(resolvePick(batch(), 0)!))).toBe(false);
    expect(isPickSessionEnded({ kind: "session-ended" })).toBe(true);
  });
});
