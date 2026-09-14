// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it } from "vitest";

import type { ResidentBatch } from "./decodeBatch";
import {
  averageFeatureExtent,
  cursorForPointerState,
  decideHoverReadoutAtSettle,
  hoverRepickActionForCameraChange,
  isBelowPickResolution,
  isFramebufferIdentical,
  isPointerOnCanvas,
  mayRepickAtSettle,
  reevaluateStandingHoverOnCameraChange,
  shouldArmHoverRepick,
  SUB_PIXEL_PICK_REFUSAL_THRESHOLD_PX,
} from "./pickResolution";
import type { HoverPointerCapture } from "./pickResolution";
import { confirmingReadout } from "./pick";

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

// DECISIONS-PENDING entry 89 §4.4 (1), second clause: every case below is re-derived from
// `SUB_PIXEL_PICK_REFUSAL_THRESHOLD_PX` itself, never from the literal `2` -- the constant's
// declared value stays `2` on this branch (entry 91 (c) is the human's to rule on), but these
// cases hold unchanged the moment it is re-sighted to a new value, with no test edit owed.
describe("isBelowPickResolution", () => {
  it("above the declared threshold: not below -- an ordinary pick behaves as today", () => {
    // worldUnits * 1 px/unit clearly above the threshold, whatever its declared value is.
    expect(isBelowPickResolution(SUB_PIXEL_PICK_REFUSAL_THRESHOLD_PX + 3, 1)).toBe(false);
  });

  it("below the declared threshold: refused", () => {
    // worldUnits * 1 px/unit clearly below the threshold, whatever its declared value is.
    expect(isBelowPickResolution(SUB_PIXEL_PICK_REFUSAL_THRESHOLD_PX - 1, 1)).toBe(true);
  });

  it("exactly at the threshold is NOT below it -- a strict less-than comparison", () => {
    expect(isBelowPickResolution(SUB_PIXEL_PICK_REFUSAL_THRESHOLD_PX, 1)).toBe(false);
  });

  it("just above the threshold: not below", () => {
    expect(isBelowPickResolution(SUB_PIXEL_PICK_REFUSAL_THRESHOLD_PX + 0.01, 1)).toBe(false);
  });

  it("just below the threshold: refused", () => {
    expect(isBelowPickResolution(SUB_PIXEL_PICK_REFUSAL_THRESHOLD_PX - 0.01, 1)).toBe(true);
  });

  it("zero average extent (nothing real resident yet) computes as below resolution -- the pure comparison alone, never reached in practice without a real pick first (WorkingCanvas.tsx's own onHover gates on a valid GPU pick index before ever calling this)", () => {
    expect(isBelowPickResolution(0, 1)).toBe(true);
  });
});

// The MID-GESTURE decision (entry 47's `HOVER-REPICK-PREREGISTRATION.md` D2; originally
// residency-debt cut 1b, Item C, DECISIONS-PENDING entry 29, "K6"): the standing hover re-evaluated
// while camera changes are still arriving, no GPU re-pick. Cases (a)-(e) are the ones pre-committed
// in `RESIDENCY-DEBT-1B.md`'s Item C, unchanged in meaning by entry 47 -- only relabelled, because a
// second decision (`decideHoverReadoutAtSettle`, below) now stands beside this one for the instant
// the burst stops.
describe("reevaluateStandingHoverOnCameraChange (the MID-GESTURE decision)", () => {
  const standingFeatureId = { streamHandle: "sh_test", batchSeq: 1, id: 42n, anchor: [0, 0] as [number, number] };
  const standingRefusal = { kind: "below-pick-resolution" as const };
  // DECISIONS-PENDING entry 89 §4.4 (1), second clause: every case below is re-derived from the
  // declared constant, never from a literal -- at 1 px per world unit these are "clearly above" and
  // "clearly below" the declared line whatever its sighted value is.
  const ABOVE_THRESHOLD_EXTENT = SUB_PIXEL_PICK_REFUSAL_THRESHOLD_PX + 3;
  const BELOW_THRESHOLD_EXTENT = SUB_PIXEL_PICK_REFUSAL_THRESHOLD_PX / 2;

  // Mirrors `e2e/regression.mjs`'s `stepK6` assertion (i), the CONTINUOUS case (DECISIONS-PENDING
  // entries 56/47, the K6 re-aim): a single camera change that itself crosses the threshold ->
  // the named refusal, not a clear.
  it("(a) standing feature id + zoom-out crosses below the threshold -> refuse by name", () => {
    const result = reevaluateStandingHoverOnCameraChange(standingFeatureId, BELOW_THRESHOLD_EXTENT, 1);
    expect(result).toEqual({ kind: "below-pick-resolution" });
  });

  // Mirrors `e2e/regression.mjs`'s `stepK6` assertion (ii), the DISCRETE case's own FIRST notch
  // (DECISIONS-PENDING entries 56/47): a camera change that itself stays above the threshold clears
  // the standing id rather than re-asserting it -- entry 56's diagnosed mechanism for why every
  // LATER discrete notch is then a no-op (test (e) below: `standing === null` -> `undefined`),
  // never a stale id.
  // RE-AIMED by DECISIONS-PENDING entry 88 / 75 (3), RULED 2026-09-14 (B1): this case asserted a
  // CLEAR until that ruling -- the blink the sitting felt. The ruling replaces the clear with the
  // labelled state, and nothing else about the case moves: the id is still never re-asserted bare.
  it("(b) standing feature id + zoom stays above the threshold -> the LABELLED state, never a bare id and never a clear", () => {
    const result = reevaluateStandingHoverOnCameraChange(standingFeatureId, ABOVE_THRESHOLD_EXTENT, 1);
    expect(result).toEqual(confirmingReadout(standingFeatureId));
  });

  it("(c) standing refusal + zoom-in crosses above the threshold -> clear to null", () => {
    const result = reevaluateStandingHoverOnCameraChange(standingRefusal, ABOVE_THRESHOLD_EXTENT, 1);
    expect(result).toBeNull();
  });

  it("(d) standing refusal + still below the threshold -> unchanged, no redundant re-emit", () => {
    const result = reevaluateStandingHoverOnCameraChange(standingRefusal, BELOW_THRESHOLD_EXTENT, 1);
    expect(result).toBeUndefined();
  });

  it("(e) null standing (nothing shown) -> no-op regardless of the new zoom", () => {
    expect(reevaluateStandingHoverOnCameraChange(null, BELOW_THRESHOLD_EXTENT, 1)).toBeUndefined();
    expect(reevaluateStandingHoverOnCameraChange(null, ABOVE_THRESHOLD_EXTENT, 1)).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------------------
// Entry 47 (`HOVER-REPICK-PREREGISTRATION.md`), the AT-SETTLE decision and the two pure predicates
// that gate it. Every case below is one of the ones pre-committed in that document's section 5.
// ---------------------------------------------------------------------------------------

const captureAt = (x: number, y: number): HoverPointerCapture => ({
  x,
  y,
  clientWidth: 800,
  clientHeight: 600,
  devicePixelRatio: 1,
});
const SAME_FRAMEBUFFER = { clientWidth: 800, clientHeight: 600, devicePixelRatio: 1 };

const idA = { streamHandle: "sh_test", batchSeq: 1, id: 42n, anchor: [0, 0] as [number, number] };
const idB = { streamHandle: "sh_test", batchSeq: 1, id: 99n, anchor: [5, 5] as [number, number] };

describe("isPointerOnCanvas (D5)", () => {
  it("an ordinary pixel is on canvas", () => {
    expect(isPointerOnCanvas(captureAt(120, 340))).toBe(true);
  });

  it("the origin pixel is on canvas -- the sentinel is strictly negative, never zero", () => {
    expect(isPointerOnCanvas(captureAt(0, 0))).toBe(true);
  });

  it("deck.gl's pointerleave sentinel (a negative x/y) is off canvas", () => {
    expect(isPointerOnCanvas(captureAt(-1, -1))).toBe(false);
    expect(isPointerOnCanvas(captureAt(-1, 340))).toBe(false);
    expect(isPointerOnCanvas(captureAt(120, -1))).toBe(false);
  });
});

describe("isFramebufferIdentical (D4)", () => {
  it("the same width, height and device pixel ratio: identical", () => {
    expect(isFramebufferIdentical(captureAt(10, 10), SAME_FRAMEBUFFER)).toBe(true);
  });

  it("a resize in either axis is NOT identical", () => {
    expect(isFramebufferIdentical(captureAt(10, 10), { ...SAME_FRAMEBUFFER, clientWidth: 801 })).toBe(false);
    expect(isFramebufferIdentical(captureAt(10, 10), { ...SAME_FRAMEBUFFER, clientHeight: 599 })).toBe(false);
  });

  it("a device-pixel-ratio change alone is NOT identical -- the same CSS size can mean a different framebuffer", () => {
    expect(isFramebufferIdentical(captureAt(10, 10), { ...SAME_FRAMEBUFFER, devicePixelRatio: 2 })).toBe(false);
  });
});

// D3 -- the declared switch, both values exercised. `HOVER_REPICK_ON_PAN`'s shipped value is
// PROPOSED PENDING THE HUMAN'S SIGHT (DECISIONS-PENDING entry 75); the pure rule takes it as a
// parameter so neither value is a dormant branch.
describe("shouldArmHoverRepick (D3/D6(a))", () => {
  it("pan-and-zoom-alike (the ruling's words): a pure pan with a readout standing DOES arm", () => {
    expect(shouldArmHoverRepick(true, false, true)).toBe(true);
  });

  it("zoom-only (the alternative): a pure pan arms NOTHING", () => {
    expect(shouldArmHoverRepick(true, false, false)).toBe(false);
  });

  it("zoom-only: a zoom change with a readout standing still arms", () => {
    expect(shouldArmHoverRepick(true, true, false)).toBe(true);
  });

  it("nothing standing arms nothing, under either value of the switch", () => {
    expect(shouldArmHoverRepick(false, true, true)).toBe(false);
    expect(shouldArmHoverRepick(false, true, false)).toBe(false);
    expect(shouldArmHoverRepick(false, false, true)).toBe(false);
    expect(shouldArmHoverRepick(false, false, false)).toBe(false);
  });
});

describe("mayRepickAtSettle (D6: all three conditions, or no pick at all)", () => {
  it("armed, on canvas, framebuffer unchanged -> a pick may run", () => {
    expect(mayRepickAtSettle(true, true, true)).toBe(true);
  });

  it("any one of the three failing refuses the pick", () => {
    expect(mayRepickAtSettle(false, true, true)).toBe(false);
    expect(mayRepickAtSettle(true, false, true)).toBe(false);
    expect(mayRepickAtSettle(true, true, false)).toBe(false);
  });
});

// The sixth argument is the STANDING readout (what the operator currently sees), read for exactly
// one decision -- M4's, in `HOVER-CONFIRMING-MARKER-PREREGISTRATION.md`. The cases below keep their
// original meaning: a re-pick RESULT never consults it, and the no-re-pick cases pass a standing
// CONFIRMED id, for which M4 changes nothing (still: emit nothing at all).
describe("decideHoverReadoutAtSettle (the AT-SETTLE decision)", () => {
  it("the re-pick returns the SAME id -> that id is emitted, confirmed at this camera", () => {
    expect(decideHoverReadoutAtSettle(true, true, true, false, idA, null)).toEqual(idA);
  });

  it("the re-pick returns a DIFFERENT id -> the new id, never the retained one", () => {
    const result = decideHoverReadoutAtSettle(true, true, true, false, idB, null);
    expect(result).toEqual(idB);
    expect(result).not.toEqual(idA);
  });

  it("the re-pick returns nothing (including over a tile that is not resident, D8) -> clear", () => {
    expect(decideHoverReadoutAtSettle(true, true, true, false, null, null)).toBeNull();
  });

  it("below the threshold at the new camera -> the named refusal, WHATEVER the pick returned", () => {
    // ADR-028 Decision item 4 / 24(c): the refusal always wins over any id. The threshold is read
    // first; a pick outcome present here (the caller does not even resolve one in that state) must
    // not displace it.
    expect(decideHoverReadoutAtSettle(true, true, true, true, idA, null)).toEqual({ kind: "below-pick-resolution" });
    expect(decideHoverReadoutAtSettle(true, true, true, true, null, null)).toEqual({ kind: "below-pick-resolution" });
  });

  it("the framebuffer changed between capture and settle -> NOTHING is emitted (D4 disarms)", () => {
    expect(decideHoverReadoutAtSettle(true, true, false, false, idB, idA)).toBeUndefined();
    // ...including where the threshold alone would otherwise have produced the refusal.
    expect(decideHoverReadoutAtSettle(true, true, false, true, null, idA)).toBeUndefined();
  });

  it("not armed (no readout was standing when the burst began) -> nothing is emitted", () => {
    expect(decideHoverReadoutAtSettle(false, true, true, false, idB, idA)).toBeUndefined();
  });

  it("the pointer is off canvas -> nothing is emitted", () => {
    expect(decideHoverReadoutAtSettle(true, false, true, false, idB, idA)).toBeUndefined();
  });
});

// D11 (preregistration section 12 Amendment 2): the button-down guard, as a pure decision. The
// falsifier it closes is deck.gl's own documented behaviour -- no `onHover` while a button is down --
// which leaves the stored pixel frozen at its pre-drag value for a whole drag pan.
describe("hoverRepickActionForCameraChange (D11)", () => {
  it("a button held down: CANCEL, whatever the rest says -- the burst is dropped, nothing is armed", () => {
    expect(hoverRepickActionForCameraChange(true, true, true, true)).toBe("cancel");
    expect(hoverRepickActionForCameraChange(true, false, true, true)).toBe("cancel");
    expect(hoverRepickActionForCameraChange(false, true, false, true)).toBe("cancel");
  });

  it("no button down, a readout standing, the axis counts: ARM", () => {
    expect(hoverRepickActionForCameraChange(true, true, true, false)).toBe("arm");
    expect(hoverRepickActionForCameraChange(true, false, true, false)).toBe("arm"); // pan, under the words' reading
    expect(hoverRepickActionForCameraChange(true, true, false, false)).toBe("arm"); // zoom, under zoom-only
  });

  it("no button down but nothing to arm: SCHEDULE only -- the timer stays honest, the settle emits nothing", () => {
    expect(hoverRepickActionForCameraChange(false, true, true, false)).toBe("schedule");
    expect(hoverRepickActionForCameraChange(true, false, false, false)).toBe("schedule"); // pure pan, zoom-only
  });

  it("the release edge: the SAME camera change that cancelled while held arms once the button is up", () => {
    expect(hoverRepickActionForCameraChange(true, true, true, true)).toBe("cancel");
    expect(hoverRepickActionForCameraChange(true, true, true, false)).toBe("arm");
  });
});

// DECISIONS-PENDING entry 89 §4.3/§4.4 (2): the two values `getCursor`'s wiring in
// `WorkingCanvas.tsx` can ever receive, both exercised -- neither is a dormant branch.
describe("cursorForPointerState (entry 89 §4.3)", () => {
  it("no button down / not dragging: crosshair", () => {
    expect(cursorForPointerState(false)).toBe("crosshair");
  });

  it("dragging: grabbing", () => {
    expect(cursorForPointerState(true)).toBe("grabbing");
  });
});
