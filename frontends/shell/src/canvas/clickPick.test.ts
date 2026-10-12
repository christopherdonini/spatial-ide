// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it } from "vitest";

import { resolveClickPick, type ClickPickDeps } from "./clickPick";
import type { ResidentBatch } from "./decodeBatch";
import { resolvePick, type PickResult } from "./pick";
import { partsOfFeatures } from "../testUtils/partsOfPolygons";

/** SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md section 4, UB7 and UB8: the click's own pick (OPEN-1 (A)). */
const ring = (x: number, y: number, size: number): [number, number][] => [[x, y], [x + size, y], [x + size, y + size], [x, y]];
/** Row 0 (id 10) has two parts, far apart; row 1 (id 20) has one. Part ordinals 0 and 1 are row 0's, ordinal 2 is row 1's. */
const batch: ResidentBatch = {
  streamHandle: "sh_click",
  batchSeq: 0,
  ids: BigUint64Array.from([10n, 20n]),
  ...partsOfFeatures([[[ring(0, 0, 1)], [ring(10, 10, 2)]], [[ring(100, 100, 1)]]]),
  totalVertices: 12,
};

interface Calls {
  picks: [number, number][];
  resolves: number;
}

function depsFor(
  candidate: { batch: ResidentBatch; gpuOrdinal: number } | null,
  below: boolean,
  calls: Calls = { picks: [], resolves: 0 }
): ClickPickDeps {
  return {
    pickCandidateAt: (x, y) => {
      calls.picks.push([x, y]);
      return candidate;
    },
    belowPickResolutionNow: () => below,
    resolveCandidate: (c) => {
      calls.resolves += 1;
      return resolvePick(c.batch, c.gpuOrdinal);
    },
  };
}

describe("UB7: resolveClickPick", () => {
  // RECORDED MUTATION for "UB7" (below threshold): in `resolveClickPick` (clickPick.ts) resolve before the threshold is checked
  // (move `const pick = deps.resolveCandidate(candidate);` above `if (deps.belowPickResolutionNow())`).
  // Expected failure: the resolution ran, so the call count is 1 where 0 was expected.
  // OBSERVED AT b7bb54dd7df1333b1ce192e397644d150bf304f2: FAILED -- "below the threshold it is the refusal, and no resolution ran":
  //   AssertionError: resolutions run: expected 1 to be +0 // Object.is equality. Reverted after observing.
  it("below the threshold it is the refusal, and no resolution ran", () => {
    const calls: Calls = { picks: [], resolves: 0 };
    expect(resolveClickPick(depsFor({ batch, gpuOrdinal: 0 }, true, calls), 5, 6)).toEqual({ kind: "below-pick-resolution" });
    expect(calls.resolves, "resolutions run").toBe(0);
  });

  // RECORDED MUTATION for "UB7" (the tap's pixel): in `resolveClickPick` (clickPick.ts) swap the pixel
  // (`deps.pickCandidateAt(y, x)`). Expected failure: the lookup received (6, 5) where (5, 6) was expected.
  // OBSERVED AT b7bb54dd7df1333b1ce192e397644d150bf304f2: FAILED -- "the tap's own pixel reaches the candidate lookup, and no candidate is nothing":
  //   AssertionError: expected [ [ 6, 5 ] ] to deeply equal [ [ 5, 6 ] ]. Reverted after observing.
  it("the tap's own pixel reaches the candidate lookup, and no candidate is nothing", () => {
    const calls: Calls = { picks: [], resolves: 0 };
    expect(resolveClickPick(depsFor(null, false, calls), 5, 6)).toEqual({ kind: "nothing" });
    expect(calls.picks).toEqual([[5, 6]]);
    expect(calls.resolves).toBe(0);
  });

  // RECORDED MUTATION for "UB7" (all parts): in `boundsOfRow` (clickPick.ts) compute the bounds from the first part only
  // (`extentOfBatch({ parts: [[batch.parts[row][0]]] })`). Expected failure: the box of the two-part row is part 0's.
  // OBSERVED AT b7bb54dd7df1333b1ce192e397644d150bf304f2: FAILED -- "a candidate gives the pick and the authoritative bounds over every part of its row, whichever part was hit":
  //   AssertionError: expected { kind: 'feature', …(2) } to deeply equal { kind: 'feature', …(2) }. Reverted after observing.
  it("a candidate gives the pick and the authoritative bounds over every part of its row, whichever part was hit", () => {
    for (const gpuOrdinal of [0, 1]) {
      const result = resolveClickPick(depsFor({ batch, gpuOrdinal }, false), 1, 1);
      expect(result).toEqual({
        kind: "feature",
        pick: { streamHandle: "sh_click", batchSeq: 0, id: 10n, anchor: [0, 0] },
        bounds: { xmin: 0, ymin: 0, xmax: 12, ymax: 12 },
      });
    }
    const single = resolveClickPick(depsFor({ batch, gpuOrdinal: 2 }, false), 1, 1);
    expect(single.kind === "feature" && single.pick.id).toBe(20n);
    expect(single.kind === "feature" && single.bounds).toEqual({ xmin: 100, ymin: 100, xmax: 101, ymax: 101 });
  });

  // RECORDED MUTATION for "UB7" (an ordinal that resolves to no row): in `resolveClickPick` (clickPick.ts) answer a feature for a null
  // pick (`if (pick === null) return { kind: "feature", pick: null as never, bounds: { xmin: 0, ymin: 0, xmax: 0, ymax: 0 } };`).
  // Expected failure: a feature with a null pick is returned.
  // OBSERVED AT b7bb54dd7df1333b1ce192e397644d150bf304f2: FAILED -- "a candidate whose ordinal resolves to no feature is nothing":
  //   AssertionError: expected { kind: 'feature', pick: null, …(1) } to deeply equal { kind: 'nothing' }. Reverted after observing.
  it("a candidate whose ordinal resolves to no feature is nothing", () => {
    expect(resolveClickPick(depsFor({ batch, gpuOrdinal: 99 }, false), 1, 1)).toEqual({ kind: "nothing" });
  });

  // RECORDED MUTATION for "UB7" (a row with no vertex): in `resolveClickPick` (clickPick.ts) answer a feature whatever the bounds
  // (`return { kind: "feature", pick, bounds: bounds as never };`). Expected failure: a feature with null bounds.
  // OBSERVED AT b7bb54dd7df1333b1ce192e397644d150bf304f2: FAILED -- "a row with no vertex has no bounds, so it is nothing and never a feature without them":
  //   AssertionError: expected { kind: 'feature', …(2) } to deeply equal { kind: 'nothing' }. Reverted after observing.
  it("a row with no vertex has no bounds, so it is nothing and never a feature without them", () => {
    const empty: ResidentBatch = { ...batch, ...partsOfFeatures([[[[]]]]), ids: BigUint64Array.from([30n]), totalVertices: 0 };
    expect(resolveClickPick(depsFor({ batch: empty, gpuOrdinal: 0 }, false), 1, 1)).toEqual({ kind: "nothing" });
  });
});

describe("UB8: a click never reads the hover readout", () => {
  const standingOnA: PickResult = { streamHandle: "sh_click", batchSeq: 0, id: 10n, anchor: [0, 0] };

  // RECORDED MUTATION for "UB8": give `resolveClickPick`'s deps a `standingReadout?: () => PickResult | null` member and return a feature
  // with that pick when it answers one (`const standing = deps.standingReadout?.(); if (standing) return { kind: "feature", pick: standing, ... };`).
  // Expected failure: the result is A (id 10) where B (id 20) was expected.
  // OBSERVED AT b7bb54dd7df1333b1ce192e397644d150bf304f2: FAILED -- "with a readout standing on A and the candidate on B, the result is B, and the deps have no readout member":
  //   AssertionError: expected 10n to be 20n // Object.is equality. Reverted after observing.
  it("with a readout standing on A and the candidate on B, the result is B, and the deps have no readout member", () => {
    const deps: ClickPickDeps = {
      ...depsFor({ batch, gpuOrdinal: 2 }, false),
      // @ts-expect-error -- ClickPickDeps has no readout member, so a literal naming one does not compile (structural proof).
      standingReadout: () => standingOnA,
    };
    const result = resolveClickPick(deps, 1, 1);
    expect(result.kind === "feature" && result.pick.id).toBe(20n);
    expect(Object.keys(depsFor(null, false)).sort()).toEqual(["belowPickResolutionNow", "pickCandidateAt", "resolveCandidate"]);
  });
});
