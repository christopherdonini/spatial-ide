// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it, vi } from "vitest";

import type { PixelRegion } from "../e2e-test-surface";
import { DEFAULT_STYLE_STATE } from "../style/document";
import type { StyleState } from "../style/document";
import { coalesceOncePerFrame } from "./coalesceOncePerFrame";
import { applyStyleChange, shouldScheduleTileRender, summarizePixels } from "./WorkingCanvas";
import type { ApplyStyleChangeDeps, TileBatchIngestOutcome } from "./WorkingCanvas";

// Reviewer gate, style-panel cut P7 fixes, S2: the previous "issues no viewport query" test built a
// `manager`-shaped mock (`requestViewport`/`cancelStream`) and asserted neither was called -- but
// never passed `manager` to `applyStyleChange` at all, so the assertion could not fail regardless of
// what the function actually did (a vacuous test, a false sense of security). Replaced with a
// COMPILE-TIME assertion instead of a second runtime one built from a different object literal a
// human could just as easily forget to wire up: `ApplyStyleChangeDeps` (`WorkingCanvas.tsx`, now
// named and exported for exactly this) is asserted to have EXACTLY the key set `"setDrawParams" |
// "render"` -- if a future change ever widened it to add e.g. `manager`/`requestViewport`, the
// assignment below fails to typecheck (`npm run typecheck`, part of `verify`, catches it on every
// run: `Type 'true' is not assignable to type 'false'`), which a test asserting one particular
// call's own `Object.keys` could not guarantee against a different call site built differently.
//
// `[T] extends [U] ? ([U] extends [T] ? true : false) : false` is standard-library-free mutual
// assignability -- `true` iff `T` and `U` are the exact same union, which for two `keyof` results
// means the exact same key set, neither a subset nor a superset of the other (the `[T]`/`[U]` tuple
// wrapping is the standard trick to stop a union `T` from distributing over the conditional itself,
// which would otherwise check membership per-key rather than set equality).
type AssertExactKeys<T, U> = [T] extends [U] ? ([U] extends [T] ? true : false) : false;
const _applyStyleChangeDepsHasExactlySetDrawParamsAndRender: AssertExactKeys<
  keyof ApplyStyleChangeDeps,
  "setDrawParams" | "render"
> = true;
void _applyStyleChangeDepsHasExactlySetDrawParamsAndRender; // exists only for its own type to be checked

// S6 (reviewer round, 2026-08-13): `summarizePixels`'s `samplePoint` logic (both the frame-wide
// densest-non-background-bin sample and each region's own first-non-background-hit sample) had no
// direct test -- only exercised indirectly through a real WebGL `readPixels` call this package has
// no DOM/WebGL harness to drive in a unit test. `summarizePixels` itself is pure (no DOM, no
// WebGL), so exporting it (`WorkingCanvas.tsx`'s own comment) is what makes it testable directly
// against a small synthetic RGBA buffer instead.

/** width=4, height=2 (row-major, buffer-native indexing -- `i = y*width + x`, the same convention
 * `summarizePixels` itself documents). Two pixels share one non-background color ("colorA",
 * appearing at (1,0) and (0,1)) -- the densest non-background bin -- and one pixel is a different,
 * less-frequent color ("colorB" at (1,1)); every other pixel is the exact background color
 * `0,0,0,0`. */
function syntheticBuffer(): Uint8Array {
  const pixels: Array<[number, number, number, number]> = [
    [0, 0, 0, 0], // (0,0) background
    [10, 20, 30, 255], // (1,0) colorA -- 1st occurrence
    [0, 0, 0, 0], // (2,0) background
    [0, 0, 0, 0], // (3,0) background
    [10, 20, 30, 255], // (0,1) colorA -- 2nd occurrence, makes colorA the densest non-bg bin
    [100, 100, 100, 255], // (1,1) colorB -- only occurrence
    [0, 0, 0, 0], // (2,1) background
    [0, 0, 0, 0], // (3,1) background
  ];
  const buf = new Uint8Array(pixels.length * 4);
  pixels.forEach(([r, g, b, a], i) => buf.set([r, g, b, a], i * 4));
  return buf;
}

function allBackgroundBuffer(width: number, height: number): Uint8Array {
  return new Uint8Array(width * height * 4); // every byte 0 -- exactly the background color
}

describe("summarizePixels samplePoint logic (S6)", () => {
  it("frame-wide samplePoint names the densest non-background bin's first-seen pixel", () => {
    const summary = summarizePixels(syntheticBuffer(), 4, 2, []);
    // colorA (count 2) outranks colorB (count 1); its bin's stored sample is the FIRST index it
    // was seen at, (1,0), not the second, (0,1).
    expect(summary.samplePoint).toEqual({ x: 1, y: 0 });
    expect(summary.nonBackgroundCount).toBe(3); // (1,0), (0,1), (1,1)
    expect(summary.totalPixels).toBe(8);
  });

  it("frame-wide samplePoint is null when every pixel is exactly the background color", () => {
    const summary = summarizePixels(allBackgroundBuffer(3, 3), 3, 3, []);
    expect(summary.samplePoint).toBeNull();
    expect(summary.nonBackgroundCount).toBe(0);
  });

  it("a region's samplePoint is the first non-background pixel encountered in that region's own row-major scan", () => {
    const regions: PixelRegion[] = [
      // Columns [0,2), both rows -- contains (1,0) [colorA], (0,1) [colorA], (1,1) [colorB].
      // Row-major scan order (y outer, x inner) hits (1,0) before either of the other two.
      { x: 0, y: 0, w: 0.5, h: 1 },
      // Columns [2,4), row 0 only -- both pixels ((2,0), (3,0)) are background.
      { x: 0.5, y: 0, w: 0.5, h: 0.5 },
    ];
    const summary = summarizePixels(syntheticBuffer(), 4, 2, regions);

    expect(summary.regions[0].samplePoint).toEqual({ x: 1, y: 0 });
    expect(summary.regions[0].nonBackgroundCount).toBe(3);

    expect(summary.regions[1].samplePoint).toBeNull();
    expect(summary.regions[1].nonBackgroundCount).toBe(0);
  });
});

// NEXT-CUT.md P3 / binding note 7: "a style change issues NO viewport query ... and triggers exactly
// one re-render path." `applyStyleChange` is the pure seam this drives (see its own doc comment for
// why a real `<WorkingCanvas>` mount is not how this package tests this component at all -- no
// WebGL context, no @testing-library/react-equivalent harness).
describe("applyStyleChange (NEXT-CUT.md P3, binding note 7)", () => {
  it("recomputes draw params and calls render exactly once", () => {
    const render = vi.fn();
    const setDrawParams = vi.fn();

    applyStyleChange(DEFAULT_STYLE_STATE, { setDrawParams, render });

    expect(render).toHaveBeenCalledTimes(1);
    expect(setDrawParams).toHaveBeenCalledTimes(1);
    // `DEFAULT_STYLE_STATE.outlineWidth` is `0` (`document.ts`'s own doc comment: "no outline is
    // drawn today") -- `outlineColor` still resolves and converts (NEXT-CUT.md P5's
    // `toResolvedDrawParams`), it is simply never drawn while the width stays 0.
    expect(setDrawParams).toHaveBeenCalledWith({
      fillColor: [66, 133, 244, 180],
      outlineColor: [0, 0, 0, 255],
      outlineWidth: 0,
    });
  });

  // "Issues no viewport query" (binding note 7) is no longer asserted here as a runtime test -- the
  // module-scope `_applyStyleChangeDepsHasExactlySetDrawParamsAndRender` compile-time assertion
  // above (reviewer gate S2) is what actually pins it now: `ApplyStyleChangeDeps`'s own key set is
  // the guarantee, not one call's own mock.

  it("re-resolves through the SAME imported resolver a real style change would -- not the default's cached value", () => {
    const custom: StyleState = { fillColor: "#00ff00", fillOpacity: 0.5, outlineColor: "#111111", outlineWidth: 3 };
    const setDrawParams = vi.fn();

    applyStyleChange(custom, { setDrawParams, render: vi.fn() });

    expect(setDrawParams).toHaveBeenCalledWith({
      fillColor: [0, 255, 0, 128],
      outlineColor: [17, 17, 17, 255],
      outlineWidth: 3,
    });
  });
});

// Viewport-residency cut P5h (F1 fix): `pushTileBatch`'s own render-scheduling decision, tested at
// the two seams a jsdom test can actually reach without a real `Deck`/WebGL context (this file's own
// S6/`applyStyleChange` note) -- the pure "should a render happen at all" gate (`shouldScheduleTileRender`),
// and the per-frame coalescer (`coalesceOncePerFrame`, already exhaustively unit-tested on its own in
// `coalesceOncePerFrame.test.ts`) driven exactly the way `pushTileBatch`'s own product code drives it:
// `if (shouldScheduleTileRender(outcome)) coalescedRenderRef.current.schedule();` per batch.

/** A small, fully controlled fake rAF -- the identical pattern `coalesceOncePerFrame.test.ts` already
 * uses (not jsdom's own `requestAnimationFrame`, whose scheduling this test has no reason to depend
 * on), duplicated here rather than imported across two `.test.ts` files. */
function fakeFrame() {
  let nextHandle = 1;
  const queued = new Map<number, FrameRequestCallback>();
  const requestFrame = vi.fn((cb: FrameRequestCallback) => {
    const handle = nextHandle++;
    queued.set(handle, cb);
    return handle;
  });
  const cancelFrame = vi.fn((handle: number) => {
    queued.delete(handle);
  });
  function flush(): void {
    const callbacks = [...queued.values()];
    queued.clear();
    for (const cb of callbacks) cb(0);
  }
  return { requestFrame, cancelFrame, flush };
}

function ingestOutcome(overrides: Partial<TileBatchIngestOutcome> = {}): TileBatchIngestOutcome {
  return { rowsAdmitted: 0, duplicatesDropped: 0, evictedTileKeys: [], overBudget: false, fitAnchor: null, ...overrides };
}

describe("shouldScheduleTileRender (P5h, F1)", () => {
  it("true when rows were admitted", () => {
    expect(shouldScheduleTileRender(ingestOutcome({ rowsAdmitted: 3 }))).toBe(true);
  });

  it("true when a tile was evicted, even with zero rows admitted", () => {
    expect(shouldScheduleTileRender(ingestOutcome({ rowsAdmitted: 0, evictedTileKeys: ["1:1"] }))).toBe(true);
  });

  it("false for a fully-refused batch -- nothing admitted, nothing evicted", () => {
    expect(shouldScheduleTileRender(ingestOutcome({ rowsAdmitted: 0, evictedTileKeys: [], duplicatesDropped: 5 }))).toBe(false);
  });

  it("false for a genuinely empty batch (no rows, no dupes, no eviction)", () => {
    expect(shouldScheduleTileRender(ingestOutcome())).toBe(false);
  });
});

describe("pushTileBatch's own render-scheduling pattern (P5h, F1) -- shouldScheduleTileRender gating coalesceOncePerFrame", () => {
  it("N admitting batches arriving within one frame collapse to exactly one render", () => {
    const render = vi.fn();
    const { requestFrame, cancelFrame, flush } = fakeFrame();
    const coalesced = coalesceOncePerFrame(render, requestFrame, cancelFrame);

    // Mirrors up to `MAX_IN_FLIGHT_TILE_STREAMS` concurrently fanned-out tile streams each delivering
    // a batch before the browser gets to paint -- the exact churn P5g convicted.
    const outcomes = [
      ingestOutcome({ rowsAdmitted: 4 }),
      ingestOutcome({ rowsAdmitted: 0, evictedTileKeys: ["2:2"] }),
      ingestOutcome({ rowsAdmitted: 7 }),
    ];
    for (const outcome of outcomes) {
      if (shouldScheduleTileRender(outcome)) coalesced.schedule();
    }

    expect(requestFrame).toHaveBeenCalledTimes(1);
    expect(render).not.toHaveBeenCalled();
    flush();
    expect(render).toHaveBeenCalledTimes(1);
  });

  it("a batch of entirely zero-admission outcomes schedules NO render at all", () => {
    const render = vi.fn();
    const { requestFrame, cancelFrame, flush } = fakeFrame();
    const coalesced = coalesceOncePerFrame(render, requestFrame, cancelFrame);

    const outcomes = [
      ingestOutcome({ duplicatesDropped: 2 }),
      ingestOutcome({ duplicatesDropped: 1 }),
      ingestOutcome(),
    ];
    for (const outcome of outcomes) {
      if (shouldScheduleTileRender(outcome)) coalesced.schedule();
    }

    expect(requestFrame).not.toHaveBeenCalled();
    flush();
    expect(render).not.toHaveBeenCalled();
  });

  it("a mix across two frames: zero-admission batches in frame 1 render nothing; an admitting batch in frame 2 renders once", () => {
    const render = vi.fn();
    const { requestFrame, cancelFrame, flush } = fakeFrame();
    const coalesced = coalesceOncePerFrame(render, requestFrame, cancelFrame);

    if (shouldScheduleTileRender(ingestOutcome())) coalesced.schedule();
    if (shouldScheduleTileRender(ingestOutcome({ duplicatesDropped: 9 }))) coalesced.schedule();
    flush();
    expect(render).not.toHaveBeenCalled();

    if (shouldScheduleTileRender(ingestOutcome({ rowsAdmitted: 1 }))) coalesced.schedule();
    flush();
    expect(render).toHaveBeenCalledTimes(1);
    expect(requestFrame).toHaveBeenCalledTimes(1); // only the admitting batch ever called schedule()
  });
});
