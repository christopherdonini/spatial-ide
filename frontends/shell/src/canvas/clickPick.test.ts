// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it } from "vitest";

import { createTapHandler, resolveClickPick, tapPixel, type ClickPick, type ClickPickDeps } from "./clickPick";
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
  attributes: null,
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

/** A canvas for `tapPixel`: its rect, its whole layout size (`offsetWidth` x `offsetHeight`, the rect's by default) and no border. */
const box = (left: number, top: number, width: number, height: number, offsetWidth = width, offsetHeight = height) => ({
  getBoundingClientRect: () => ({ left, top, width, height }), offsetWidth, offsetHeight, clientLeft: 0, clientTop: 0,
});

describe("UB7 (tap pixel): the tap's pixel is the hover's (OPEN-15)", () => {
  // RECORDED MUTATION for "UB7 (tap pixel)" (the recorded case): in `tapPixel` (clickPick.ts) `Math.round` in place of both `Math.trunc` calls. Expected failure: (66, 494) where (65, 493) was expected.
  // OBSERVED AT 635646e294a38dd4815ad8a68c36d448547f06f3: FAILED -- "the recorded case: client (331.5, 533.5) on a canvas at (266, 40) is pixel (65, 493), where rounding gives (66, 494)":
  //   AssertionError: expected { x: 66, y: 494 } to deeply equal { x: 65, y: 493 }. Four of the file's 11 tests failed; the three pixel cases and the tap at (5, 6). Reverted after observing.
  it("the recorded case: client (331.5, 533.5) on a canvas at (266, 40) is pixel (65, 493), where rounding gives (66, 494)", () => {
    expect(tapPixel({ clientX: 331.5, clientY: 533.5 }, box(266, 40, 1000, 700))).toEqual({ x: 65, y: 493 });
  });

  // RECORDED MUTATION for "UB7 (tap pixel)" (the order): in `tapPixel` (clickPick.ts) subtract before truncating (`Math.trunc(src.clientX - r.left - canvas.clientLeft) / scaleX`, and the same for y). Expected failure: (65, 493) where (64.4, 492.4) was expected.
  // OBSERVED AT 635646e294a38dd4815ad8a68c36d448547f06f3: FAILED -- "a fractional canvas left and top: the client coordinates are truncated before the rect is subtracted":
  //   AssertionError: expected [ 65, 493 ] to deeply equal [ NumberCloseTo 64.4 (9 digits), …(1) ]. Only this test failed. Reverted after observing.
  it("a fractional canvas left and top: the client coordinates are truncated before the rect is subtracted", () => {
    const p = tapPixel({ clientX: 331.9, clientY: 533.9 }, box(266.6, 40.6, 1000, 700));
    expect([p.x, p.y]).toEqual([expect.closeTo(64.4, 9), expect.closeTo(492.4, 9)]);
  });

  // RECORDED MUTATION for "UB7 (tap pixel)" (the scale): in `tapPixel` (clickPick.ts) drop the division by `scaleX` and `scaleY` in the return line. Expected failure: (65, 493) where (64.967516, 492.687763) was expected.
  // OBSERVED AT 635646e294a38dd4815ad8a68c36d448547f06f3: FAILED -- "a fractional drawn size against a whole layout size: the offset is divided by drawn over layout, as the hover's is":
  //   AssertionError: expected [ 65, 493 ] to deeply equal [ …(2) ]. Only this test failed. Reverted after observing.
  it("a fractional drawn size against a whole layout size: the offset is divided by drawn over layout, as the hover's is", () => {
    const p = tapPixel({ clientX: 331.5, clientY: 533.5 }, box(266, 40, 1000.5, 715.453125, 1000, 715));
    expect([p.x, p.y]).toEqual([expect.closeTo(64.967516, 6), expect.closeTo(492.687763, 6)]);
  });
});

describe("UB7 (tap): Deck's onClick resolves the tap's own pixel and emits what it resolves to", () => {
  const canvas = box(0, 0, 100, 100);
  // RECORDED MUTATION for "UB7 (tap)" (the pixel): in `createTapHandler` (clickPick.ts) resolve at the swapped pixel
  // (`resolveClickPick(deps, pos.y, pos.x)`). Expected failure: the candidate lookup received (6, 5) where (5, 6) was expected.
  // OBSERVED AT 635646e294a38dd4815ad8a68c36d448547f06f3: FAILED -- "a tap at (5, 6) looks the candidate up at (5, 6) and emits the one result":
  //   AssertionError: expected [ [ 6, 5 ] ] to deeply equal [ [ 5, 6 ] ]. Reverted after observing.
  it("a tap at (5, 6) looks the candidate up at (5, 6) and emits the one result", () => {
    const calls: Calls = { picks: [], resolves: 0 };
    const emitted: ClickPick[] = [];
    createTapHandler(depsFor({ batch, gpuOrdinal: 2 }, false, calls), (r) => emitted.push(r), canvas)({ srcEvent: { clientX: 5.9, clientY: 6.9 } });
    expect(calls.picks).toEqual([[5, 6]]);
    expect(emitted).toHaveLength(1);
    expect(emitted[0].kind === "feature" && emitted[0].pick.id).toBe(20n);
  });

  // RECORDED MUTATION for "UB7 (tap)" (a tap without a pixel): in `createTapHandler` (clickPick.ts) invent one in place of the guard and the line below it
  // (`const pos = tap.srcEvent ? tapPixel(tap.srcEvent, canvas) : { x: 0, y: 0 };`). Expected failure: a pick ran at (0, 0) and a result was emitted.
  // OBSERVED AT 635646e294a38dd4815ad8a68c36d448547f06f3: FAILED -- "a tap that carries no pixel runs no pick and emits nothing":
  //   AssertionError: expected [ [ +0, +0 ] ] to deeply equal []. Reverted after observing.
  it("a tap that carries no pixel runs no pick and emits nothing", () => {
    const calls: Calls = { picks: [], resolves: 0 };
    const emitted: ClickPick[] = [];
    createTapHandler(depsFor({ batch, gpuOrdinal: 2 }, false, calls), (r) => emitted.push(r), canvas)({});
    expect(calls.picks).toEqual([]);
    expect(emitted).toEqual([]);
  });
});
