// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { PixelRegion } from "../e2e-test-surface";
import { DEFAULT_STYLE_STATE } from "../style/document";
import type { StyleState } from "../style/document";
import { coalesceOncePerFrame } from "./coalesceOncePerFrame";
import type { ResidentBatch } from "./decodeBatch";
import { fitViewStateForBbox } from "./extent";
import { HOVER_REPICK_ON_PAN, HOVER_REPICK_SETTLE_MS } from "./hoverRepickConstants";
import type { HoverReadout } from "./pick";
import { confirmingReadout } from "./pick";
import { hoverRepickActionForCameraChange } from "./pickResolution";
import type { FramebufferIdentity, HoverPointerCapture } from "./pickResolution";
import { INITIAL_TILE_KEY } from "./tileGridConstants";
import {
  anyPartialInView,
  applyStyleChange,
  createFitCameraWriteSequence,
  createHoverRepickScheduler,
  protectionSetFor,
  shouldScheduleTileRender,
  summarizePixels,
} from "./WorkingCanvas";
import type { ApplyStyleChangeDeps, HoverPickCandidate, TileBatchIngestOutcome } from "./WorkingCanvas";

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
  return {
    rowsAdmitted: 0,
    duplicatesDropped: 0,
    evictedTileKeys: [],
    overBudget: false,
    fitAnchor: null,
    batchExtent: null,
    ...overrides,
  };
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

// Residency-debt cut 1b sub-amendment (entry 48 (a)), S2 (reviewer gate, fix batch): `protectionSetFor`
// extracted out of `applyTileViewportContext`'s own `currentViewportTileKeysRef.current =` assignment
// -- pinned directly here, the same pure-seam-in-a-jsdom-test reason `shouldScheduleTileRender` just
// above already is. `coveringTileKeysRef` (`WorkingCanvas.tsx`'s own field) is the covering-ONLY
// consumer -- `anyPartialAmongCovering` reads it alone, never the union this function returns.
describe("protectionSetFor (entry 48 (a), S2)", () => {
  it("(a) extra undefined -> equals covering", () => {
    expect(protectionSetFor(["1:1", "1:2"], undefined)).toEqual(new Set(["1:1", "1:2"]));
  });

  it("(b) extra present -> the union of covering and extra", () => {
    expect(protectionSetFor(["1:1"], new Set(["initial-untiled-look"]))).toEqual(
      new Set(["1:1", "initial-untiled-look"])
    );
  });

  it("(c) the covering-only consumer (coveringTileKeysRef) must never include extra", () => {
    // `coveringTileKeysRef.current` (`WorkingCanvas.tsx`) is built from `coveringTileKeys` ALONE,
    // never through this function -- `new Set(covering)` stands in for that covering-only read here.
    const covering = ["1:1"];
    const extra = new Set(["initial-untiled-look"]);
    const protection = protectionSetFor(covering, extra);
    const coveringOnly = new Set(covering); // the covering-only consumer's own value
    expect(coveringOnly.has("initial-untiled-look")).toBe(false);
    expect(protection).not.toEqual(coveringOnly);
  });

  it("an empty (but present) extra set behaves exactly like undefined", () => {
    expect(protectionSetFor(["1:1"], new Set())).toEqual(new Set(["1:1"]));
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

// Entry 66 (b) (`frontends/shell/ENTRY-66B-PREREGISTRATION.md`, pre-committed test 7):
// `protectionSetFor` widened to the union SHAPE -- the four cases the widening declares. The
// membership stands in for `tileGrid.ts`'s own `coverMembershipFor(frame, level, bbox)` predicate
// (built by `candidateArmSession.ts` from the round's own triple); this file's own jsdom reach is
// the pure seam, not the canvas.
describe("protectionSetFor with a membership (entry 66 (b))", () => {
  /** A stand-in for the cover predicate: every "row:col" key whose row and col are both under 10. */
  const membership = { has: (k: string) => /^[0-9]:[0-9]$/.test(k) };

  it("(a) a membership alone IS the protection set -- and covers keys the array never named", () => {
    const protection = protectionSetFor(["1:1"], undefined, membership);
    expect(protection.has("1:1")).toBe(true);
    expect(protection.has("9:9")).toBe(true); // covered by the predicate, absent from `covering`
    expect(protection.has("50:50")).toBe(false);
    expect(protection.has(INITIAL_TILE_KEY)).toBe(false); // no `extra` supplied
  });

  it("(b) a membership WITH extra is the union of the two, and nothing else", () => {
    const protection = protectionSetFor(["1:1"], new Set([INITIAL_TILE_KEY]), membership);
    expect(protection.has("1:1")).toBe(true);
    expect(protection.has("9:9")).toBe(true);
    expect(protection.has(INITIAL_TILE_KEY)).toBe(true);
    expect(protection.has("50:50")).toBe(false);
  });

  it("(c) NO membership supplied -- today's `Set` behaviour, unchanged, in both of its branches", () => {
    expect(protectionSetFor(["1:1", "1:2"], undefined)).toEqual(new Set(["1:1", "1:2"]));
    expect(protectionSetFor(["1:1"], new Set([INITIAL_TILE_KEY]))).toEqual(new Set(["1:1", INITIAL_TILE_KEY]));
    // Still a real `Set`, so a caller reading `.size`/iterating it is unaffected.
    const protection = protectionSetFor(["1:1", "1:2"], undefined);
    expect(protection).toBeInstanceOf(Set);
    expect([...(protection as Set<string>)]).toEqual(["1:1", "1:2"]);
  });

  it("(d) the covering-only consumer still never sees `extra` -- nor the membership", () => {
    // `coveringTileKeysRef.current` (`WorkingCanvas.tsx`) is built from `coveringTileKeys` ALONE,
    // never through this function -- `new Set(covering)` stands in for that covering-only read here.
    // It is what the `fits` latch reads when no membership is supplied; with one, the latch tests the
    // membership instead (entry 66 (b), second batch -- `anyPartialInView`'s own tests below), which
    // is how path (ii) of ADR-028's 2026-09-09 appended note (`:512`) closed.
    const covering = ["1:1"];
    const coveringOnly = new Set(covering);
    const protection = protectionSetFor(covering, new Set([INITIAL_TILE_KEY]), membership);
    expect(coveringOnly.has(INITIAL_TILE_KEY)).toBe(false);
    expect(coveringOnly.has("9:9")).toBe(false);
    expect(protection.has(INITIAL_TILE_KEY)).toBe(true);
    expect(protection.has("9:9")).toBe(true);
  });
});

// Entry 66 (b), SECOND batch -- the human's ruling of DECISIONS-PENDING entry 76 item (1)
// (`ENTRY-66B-PREREGISTRATION.md` §14 Amendment 4): the `fits`/over-budget latch INVERTED. It
// iterates the resident tile keys and counts `membership.has(key) && isTilePartial(key)` over the
// round's OWN membership, instead of iterating the enumerated covering window. The membership here
// stands in for `tileGrid.ts`'s own `coverMembershipFor(frame, level, bbox)` predicate, as the
// `protectionSetFor` cases above do -- this file's reach is the pure seam, not the canvas.
describe("anyPartialInView -- the fits latch past the enumeration bound (entry 66 (b), entry 76 (1))", () => {
  /** The round's own cover: every "row:col" key with row and col in 0..299 -- a 300 x 300 cover,
   * past `MAX_COVERING_TILES`, which is exactly the regime where the enumerated window and the true
   * cover differ. */
  const membership = {
    has: (k: string) => {
      const parts = k.split(":");
      if (parts.length !== 2) return false;
      const row = Number(parts[0]);
      const col = Number(parts[1]);
      return Number.isFinite(row) && Number.isFinite(col) && row >= 0 && row < 300 && col >= 0 && col < 300;
    },
  };
  /** The centred window that round actually enumerated -- it does NOT name "0:0". */
  const window = new Set(["150:150", "150:151", "151:150"]);

  it("past the bound, a resident partial tile the window excludes but the membership covers makes `fits` false", () => {
    const resident = ["0:0", "150:150"];
    const isTilePartial = (k: string) => k === "0:0"; // the tile outside the enumerated window
    // Inverted: the latch tests the membership, which covers (0, 0) -- so the view is partial.
    expect(anyPartialInView(resident, isTilePartial, window, membership)).toBe(true);
    // And the pre-inversion read is pinned right beside it: over the window alone the same view
    // answered "nothing partial in view", which is what the ruling changed.
    expect(anyPartialInView(resident, isTilePartial, window)).toBe(false);
  });

  it("a resident partial tile that is genuinely out of view does NOT latch -- the inversion is not `any partial anywhere`", () => {
    const resident = ["900:900", "150:150"];
    expect(anyPartialInView(resident, (k) => k === "900:900", window, membership)).toBe(false);
  });

  it("with no membership supplied the answer is exactly today's covering-only read, in both directions", () => {
    expect(anyPartialInView(["150:150"], (k) => k === "150:150", window)).toBe(true);
    expect(anyPartialInView(["150:150"], () => false, window)).toBe(false);
    // `isTilePartial` is `false` for a key the resident set never ingested, so "some covering key is
    // partial" and "some resident key is covered and partial" name the same tiles here.
    expect(anyPartialInView([], (k) => k === "150:150", window)).toBe(false);
  });

  it("`INITIAL_TILE_KEY` still never latches the view partial (entry 48 (a), channel 2)", () => {
    // The untiled first look is durably partial and resident, and neither the window nor the
    // membership names it -- the membership's own parse answers `false` for a non-"row:col" key.
    expect(membership.has(INITIAL_TILE_KEY)).toBe(false);
    expect(anyPartialInView([INITIAL_TILE_KEY], () => true, window, membership)).toBe(false);
    expect(anyPartialInView([INITIAL_TILE_KEY], () => true, window)).toBe(false);
  });
});

// ---------------------------------------------------------------------------------------
// Entry 47 (`HOVER-REPICK-PREREGISTRATION.md` D1/D4/D6/D7): the settle seam
// (`createHoverRepickScheduler`), driven on fake timers. Same reason every other seam in this file
// is tested through an exported function rather than a mounted component: a real `Deck` needs a
// WebGL context jsdom does not provide (this file's own S6/`applyStyleChange` notes). The cases
// below are the ones pre-committed in that document's section 5.
//
// The only quantity these tests advance by is `HOVER_REPICK_SETTLE_MS` itself, imported from the
// constants module -- never a private copy of it, so a change to the declared cadence cannot leave
// these passing against a value the product no longer uses.
// ---------------------------------------------------------------------------------------

const HALF_GAP = Math.floor(HOVER_REPICK_SETTLE_MS / 2);

const ID_A = { streamHandle: "sh_test", batchSeq: 1, id: 42n, anchor: [0, 0] as [number, number] };
const ID_B = { streamHandle: "sh_test", batchSeq: 1, id: 99n, anchor: [5, 5] as [number, number] };
const ON_CANVAS: HoverPointerCapture = { x: 120, y: 340, clientWidth: 800, clientHeight: 600, devicePixelRatio: 1 };
const OFF_CANVAS: HoverPointerCapture = { ...ON_CANVAS, x: -1, y: -1 };
const CANDIDATE: HoverPickCandidate = { batch: {} as ResidentBatch, gpuOrdinal: 3 };

function repickHarness(
  init: Partial<{
    capture: HoverPointerCapture | null;
    framebuffer: FramebufferIdentity | null;
    armed: boolean;
    below: boolean;
    candidate: HoverPickCandidate | null;
    resolved: HoverReadout;
    standing: HoverReadout;
  }> = {}
) {
  const state = {
    capture: ON_CANVAS as HoverPointerCapture | null,
    framebuffer: { clientWidth: 800, clientHeight: 600, devicePixelRatio: 1 } as FramebufferIdentity | null,
    armed: true,
    below: false,
    candidate: CANDIDATE as HoverPickCandidate | null,
    resolved: ID_A as HoverReadout,
    // What the operator currently sees (`lastHoverReadoutRef`). Read at settle for M4's decision
    // only (`HOVER-CONFIRMING-MARKER-PREREGISTRATION.md`): `null` here, so every pre-existing case
    // below keeps exactly its original meaning.
    standing: null as HoverReadout,
    ...init,
  };
  const pickCandidateAt = vi.fn(() => state.candidate);
  const resolveCandidate = vi.fn(() => (state.resolved === null || !("id" in state.resolved) ? null : state.resolved));
  const emit = vi.fn();
  const trace = vi.fn();
  const disarm = vi.fn(() => {
    state.armed = false;
  });
  const scheduler = createHoverRepickScheduler({
    capturedPointer: () => state.capture,
    framebufferNow: () => state.framebuffer,
    isArmed: () => state.armed,
    disarm,
    belowPickResolutionNow: () => state.below,
    pickCandidateAt,
    resolveCandidate,
    standingReadout: () => state.standing,
    emit,
    trace,
    settleMs: HOVER_REPICK_SETTLE_MS,
  });
  return { state, scheduler, pickCandidateAt, resolveCandidate, emit, trace, disarm };
}

// DECISIONS-PENDING entry 89 §4.3/§4.4 (3): `cursorForPointerState` itself is unit-tested in
// `pickResolution.test.ts` (the pure decision). Its WIRING into `Deck`'s `getCursor` prop
// (`WorkingCanvas.tsx`'s Deck construction) is not a seam this file can reach -- this file never
// constructs a real `Deck` (no WebGL in jsdom; this file's own "two seams a jsdom test can
// actually reach without a real `Deck`/WebGL context" note, above) -- so the assertion that the
// CANVAS ELEMENT's own CSS cursor is `"crosshair"`/`"grabbing"` is an E2E assertion instead
// (`e2e/regression.mjs`'s `stepCursor`, added beside K6/K7). Not run by this piece -- the
// regression harness is held by another worker; `node --check e2e/regression.mjs` is the only
// verification this piece performs on it.
describe("createHoverRepickScheduler (entry 47: the settle seam)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("N camera changes inside one gap collapse to EXACTLY one pick, and one settle answers exactly one burst", () => {
    const h = repickHarness();
    for (let i = 0; i < 5; i++) h.scheduler.schedule();
    expect(h.pickCandidateAt).not.toHaveBeenCalled();

    vi.advanceTimersByTime(HOVER_REPICK_SETTLE_MS);
    expect(h.pickCandidateAt).toHaveBeenCalledTimes(1);
    expect(h.pickCandidateAt).toHaveBeenCalledWith(ON_CANVAS.x, ON_CANVAS.y);
    expect(h.emit).toHaveBeenCalledTimes(1);
    expect(h.emit).toHaveBeenCalledWith(ID_A);
    expect(h.disarm).toHaveBeenCalledTimes(1);

    // A later settle with nothing newly armed picks nothing at all -- arming never carries over.
    h.scheduler.schedule();
    vi.advanceTimersByTime(HOVER_REPICK_SETTLE_MS);
    expect(h.pickCandidateAt).toHaveBeenCalledTimes(1);
    expect(h.emit).toHaveBeenCalledTimes(1);
  });

  it("a camera change inside the gap RESTARTS it -- a gesture that never pauses runs no pick at all", () => {
    const h = repickHarness();
    h.scheduler.schedule();
    vi.advanceTimersByTime(HALF_GAP);
    h.scheduler.schedule(); // still moving: the pending settle is replaced, not queued behind
    vi.advanceTimersByTime(HALF_GAP);
    expect(h.pickCandidateAt).not.toHaveBeenCalled();

    vi.advanceTimersByTime(HOVER_REPICK_SETTLE_MS); // now it actually pauses
    expect(h.pickCandidateAt).toHaveBeenCalledTimes(1);
  });

  it("the pointer off canvas (deck.gl's pointerleave sentinel): NO pick runs and nothing is emitted", () => {
    const h = repickHarness({ capture: OFF_CANVAS });
    h.scheduler.schedule();
    vi.advanceTimersByTime(HOVER_REPICK_SETTLE_MS);
    expect(h.pickCandidateAt).not.toHaveBeenCalled();
    expect(h.emit).not.toHaveBeenCalled();
    expect(h.trace).not.toHaveBeenCalled();
  });

  it("a real onHover between the camera change and the settle cancels the pending pick", () => {
    const h = repickHarness();
    h.scheduler.schedule();
    vi.advanceTimersByTime(HALF_GAP);
    h.scheduler.cancel(); // what `onHover` does: the pointer path owns the readout again
    vi.advanceTimersByTime(HOVER_REPICK_SETTLE_MS);
    expect(h.pickCandidateAt).not.toHaveBeenCalled();
    expect(h.emit).not.toHaveBeenCalled();
  });

  it("unmount cancels: no pick fires after the instance is gone, and cancelling twice is harmless", () => {
    const h = repickHarness();
    h.scheduler.schedule();
    h.scheduler.cancel(); // what the unmount cleanup does, beside coalescedRenderRef.current.cancel()
    h.scheduler.cancel();
    vi.advanceTimersByTime(HOVER_REPICK_SETTLE_MS);
    expect(h.pickCandidateAt).not.toHaveBeenCalled();
    expect(h.emit).not.toHaveBeenCalled();
  });

  it("a RESIZE between capture and settle: NO pick runs and nothing is emitted (D4 disarms)", () => {
    const h = repickHarness();
    h.scheduler.schedule();
    h.state.framebuffer = { clientWidth: 640, clientHeight: 600, devicePixelRatio: 1 };
    vi.advanceTimersByTime(HOVER_REPICK_SETTLE_MS);
    expect(h.pickCandidateAt).not.toHaveBeenCalled();
    expect(h.emit).not.toHaveBeenCalled();
  });

  it("a DEVICE PIXEL RATIO change between capture and settle: NO pick runs and nothing is emitted (D4 disarms)", () => {
    const h = repickHarness();
    h.scheduler.schedule();
    h.state.framebuffer = { clientWidth: 800, clientHeight: 600, devicePixelRatio: 2 };
    vi.advanceTimersByTime(HOVER_REPICK_SETTLE_MS);
    expect(h.pickCandidateAt).not.toHaveBeenCalled();
    expect(h.emit).not.toHaveBeenCalled();
  });

  // DECISIONS-PENDING entry 88 / 75 (3), RULED 2026-09-14 (B1), and entry 75 (2) as ruled in B3
  // ("Keep: a resize or DPR change disarms the pending re-pick"):
  // `HOVER-CONFIRMING-MARKER-PREREGISTRATION.md` §6 (9)/M4. The disarm keeps its exact shape -- no
  // pick runs -- and the labelled state that was standing when the burst began is cleared through
  // the same choke point, because no re-pick result will ever arrive to remove its marker.
  it("a resize or DPR change between capture and settle clears the standing labelled state and still runs no pick", () => {
    for (const changed of [
      { clientWidth: 640, clientHeight: 600, devicePixelRatio: 1 }, // a resize
      { clientWidth: 800, clientHeight: 600, devicePixelRatio: 2 }, // a DPR change
    ]) {
      const h = repickHarness({ standing: confirmingReadout(ID_A) });
      h.scheduler.schedule();
      h.state.framebuffer = changed;
      vi.advanceTimersByTime(HOVER_REPICK_SETTLE_MS);

      // Unchanged by this piece: a stale frame is never picked at.
      expect(h.pickCandidateAt).not.toHaveBeenCalled();
      // New: the marker does not outlive the settle -- the readout clears.
      expect(h.emit.mock.calls).toEqual([[null]]);
      // Not traced: D9's line names a readout a re-pick PRODUCED, and no re-pick ran.
      expect(h.trace).not.toHaveBeenCalled();
    }

    // ...and with no labelled state standing, the same disarm emits nothing at all, exactly as it
    // did before this piece (a standing confirmed id is left untouched by M4).
    const untouched = repickHarness({ standing: ID_A });
    untouched.scheduler.schedule();
    untouched.state.framebuffer = { clientWidth: 640, clientHeight: 600, devicePixelRatio: 1 };
    vi.advanceTimersByTime(HOVER_REPICK_SETTLE_MS);
    expect(untouched.pickCandidateAt).not.toHaveBeenCalled();
    expect(untouched.emit).not.toHaveBeenCalled();
  });

  it("every readout a settle produces reaches the operator through the ONE emission choke point", () => {
    // A different id, the named refusal, and a clear -- three different outcomes, each emitted
    // exactly once through `emit` and named exactly once to the trace, with no other route out.
    const fresh = repickHarness({ resolved: ID_B });
    fresh.scheduler.schedule();
    vi.advanceTimersByTime(HOVER_REPICK_SETTLE_MS);
    expect(fresh.emit.mock.calls).toEqual([[ID_B]]);
    expect(fresh.trace).toHaveBeenCalledTimes(1);
    expect(fresh.trace).toHaveBeenCalledWith(ID_B);

    const refused = repickHarness({ below: true });
    refused.scheduler.schedule();
    vi.advanceTimersByTime(HOVER_REPICK_SETTLE_MS);
    expect(refused.emit.mock.calls).toEqual([[{ kind: "below-pick-resolution" }]]);
    // The threshold decides before anything is resolved: the refusal wins over any id, and no
    // ordinal-to-id resolution is done for an answer that would only be discarded.
    expect(refused.resolveCandidate).not.toHaveBeenCalled();

    const cleared = repickHarness({ candidate: null });
    cleared.scheduler.schedule();
    vi.advanceTimersByTime(HOVER_REPICK_SETTLE_MS);
    expect(cleared.emit.mock.calls).toEqual([[null]]);
    expect(cleared.resolveCandidate).not.toHaveBeenCalled();
  });
});

// D11 (preregistration section 12 Amendments 2 and 3, each recorded before its own fix): the
// button-down guard and the release edge that invalidates the pointer capture,
// driven exactly the way `WorkingCanvas.tsx`'s own `scheduleHoverRepick` drives it -- the pure
// decision, then the seam -- the same "drive the product's own gating pattern" shape this file
// already uses for `shouldScheduleTileRender` gating `coalesceOncePerFrame`.
function driveCameraChange(
  h: ReturnType<typeof repickHarness>,
  { readoutWasStanding = true, zoomChanged = true, pointerButtonDown = false } = {}
): void {
  const action = hoverRepickActionForCameraChange(
    readoutWasStanding,
    zoomChanged,
    HOVER_REPICK_ON_PAN,
    pointerButtonDown
  );
  if (action === "cancel") {
    h.state.armed = false;
    h.scheduler.cancel();
    return;
  }
  if (action === "arm") h.state.armed = true;
  h.scheduler.schedule();
}

describe("the button-down guard and the release edge (entry 47, D11 as extended)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("a camera burst under a HELD pointer button emits nothing at settle; the same burst after release emits exactly one pick", () => {
    // deck.gl delivers no `onHover` while a button is down, so the stored pixel is the PRE-DRAG one
    // for the whole gesture -- a settle here would confirm an id for a feature not under the pointer.
    const h = repickHarness({ armed: false });
    for (let i = 0; i < 4; i++) driveCameraChange(h, { pointerButtonDown: true });
    vi.advanceTimersByTime(HOVER_REPICK_SETTLE_MS);
    expect(h.pickCandidateAt).not.toHaveBeenCalled();
    expect(h.emit).not.toHaveBeenCalled();
    expect(h.trace).not.toHaveBeenCalled();

    // The button comes up. The FIRST camera change after the release arms exactly as D1/D3 say.
    for (let i = 0; i < 4; i++) driveCameraChange(h, { pointerButtonDown: false });
    vi.advanceTimersByTime(HOVER_REPICK_SETTLE_MS);
    expect(h.pickCandidateAt).toHaveBeenCalledTimes(1);
    expect(h.emit).toHaveBeenCalledTimes(1);
    expect(h.emit).toHaveBeenCalledWith(ID_A);
  });

  it("a camera burst AFTER release, with no onHover since the button went down, emits nothing at settle; a real onHover re-captures and the next burst emits exactly one pick", () => {
    // D11 as EXTENDED (section 12 Amendment 3): the guard above closes arming WHILE a button is
    // held, but the stored pixel would otherwise survive the release -- deck.gl delivers no
    // `onHover` during a drag, and a standing below-pick-resolution refusal is the one readout the
    // mid-gesture rule leaves standing across one, so the first camera change after release could
    // arm and settle at the PRE-DRAG pixel. The release edge therefore invalidates the capture.
    const h = repickHarness({ armed: false });
    for (let i = 0; i < 3; i++) driveCameraChange(h, { pointerButtonDown: true }); // the drag itself

    // The release, exactly as `WorkingCanvas.tsx`'s own `onPointerRelease` performs it (the button
    // flag drops -- the `pointerButtonDown: false` below -- and the pointer capture is dropped with
    // it, since nothing has answered "where is the pointer" since the button went down).
    //
    // **What this case does and does not exercise, stated as what it is** (reviewer gate 3): this
    // suite cannot mount the component, so the line below MIRRORS the listener rather than running
    // it -- what is under test here is the scheduler's own null-capture return at the seam
    // (`createHoverRepickScheduler`, `capture === null`), NOT `onPointerRelease` itself
    // (`WorkingCanvas.tsx:1597`, in the listener whose release-edge paragraph is `:1573-1579`).
    // Deleting that product line fails nothing in this file; the E2E case (v) in `e2e/regression.mjs`
    // `stepK6` -- a real drag, then a settle -- is the one that pins it (preregistration section 12
    // Amendments 4 and 5; the binding construction is Amendment 5's).
    h.state.capture = null;

    // The camera keeps moving after the release (a wheel notch, a keyboard pan, the tail of a
    // gesture): the first change after the release ARMS exactly as D1/D3 say, and its settle picks
    // nothing at all -- refusal to act, the same answer D4 gives a changed framebuffer.
    for (let i = 0; i < 3; i++) driveCameraChange(h, { pointerButtonDown: false });
    vi.advanceTimersByTime(HOVER_REPICK_SETTLE_MS);
    expect(h.pickCandidateAt).not.toHaveBeenCalled();
    expect(h.emit).not.toHaveBeenCalled();
    expect(h.trace).not.toHaveBeenCalled();

    // A real `onHover` after the release re-answers where the pointer is (and disowns any pending
    // settle, exactly as the hover site does). Only now may a settle pick again.
    h.state.capture = ON_CANVAS;
    h.state.armed = false;
    h.scheduler.cancel();

    for (let i = 0; i < 3; i++) driveCameraChange(h, { pointerButtonDown: false });
    vi.advanceTimersByTime(HOVER_REPICK_SETTLE_MS);
    expect(h.pickCandidateAt).toHaveBeenCalledTimes(1);
    expect(h.pickCandidateAt).toHaveBeenCalledWith(ON_CANVAS.x, ON_CANVAS.y);
    expect(h.emit.mock.calls).toEqual([[ID_A]]);
  });

  it("a button pressed mid-burst cancels the settle that was already pending", () => {
    const h = repickHarness({ armed: false });
    driveCameraChange(h); // pointer up: armed and pending
    vi.advanceTimersByTime(HALF_GAP);
    driveCameraChange(h, { pointerButtonDown: true }); // the drag begins
    vi.advanceTimersByTime(HOVER_REPICK_SETTLE_MS);
    expect(h.pickCandidateAt).not.toHaveBeenCalled();
    expect(h.emit).not.toHaveBeenCalled();
  });
});

// Entry 85 (`FILTER-84-85-PREREGISTRATION.md` §2.4 item 2): the fit's own camera write, at the seam.
// A real `Deck` needs a WebGL context this suite cannot produce (this file's own S6 comment), so the
// subject here is `createFitCameraWriteSequence` -- the exact value `fitToExtent` hands
// `setProps({initialViewState})` -- driven against a fake that applies deck.gl's OWN acceptance rule.
//
// **The rule, restated here because the fake has to apply it** (`@deck.gl/core@9.3.9`'s
// `lib/deck.js`, `setProps`: `if (props.initialViewState && !deepEqual(this.props.initialViewState,
// props.initialViewState, 3)) { this.viewState = props.initialViewState; }`): the new value is
// compared against the value the PROPS already hold -- not against whatever gestures have since
// moved the live camera to -- and the camera is re-synced only when the two differ. `deepEqual` at
// depth 3 over these flat `{target: [x, y, z], zoom, ...}` objects is structural equality of every
// key and every array element, which is what `JSON.stringify` equality means for them too; the fake
// uses that rather than reaching into deck.gl's own `dist/utils/deep-equal.js`, which the package's
// `exports` map does not expose (a deep import would resolve today and break on any repackaging).
describe("createFitCameraWriteSequence (entry 85: the fit's own camera write)", () => {
  /** deck.gl's uncontrolled camera, reduced to the one behaviour under test: it accepts a new
   * `initialViewState` only when that value is not deep-equal to the one the props already hold, and
   * it records every acceptance. `cameraWrites` is therefore "how many times the camera was actually
   * re-synced", which is the fact entry 85 is about -- not "how many times setProps was called". */
  function fakeDeck() {
    let propsViewState: unknown = null;
    const cameraWrites: Array<{ target: [number, number, number]; zoom: number }> = [];
    return {
      cameraWrites,
      setProps(props: { initialViewState: { target: [number, number, number]; zoom: number } }) {
        const next = props.initialViewState;
        if (JSON.stringify(next) !== JSON.stringify(propsViewState)) {
          cameraWrites.push({ target: next.target, zoom: next.zoom });
        }
        propsViewState = next;
      },
    };
  }

  /** The same bbox fitted twice, through the real fit arithmetic -- exactly what two "Zoom to layer"
   * clicks compute for one filter generation, whose anchor stops growing after the filtered first
   * look (`WorkingCanvas.tsx`'s `fitAnchorRef` / `resetFitForNewGeneration`). */
  const BBOX = { xmin: 2_600_000, ymin: 1_200_000, xmax: 2_600_400, ymax: 1_200_300 };

  it("two consecutive fits to the same extent each write the camera -- the write is observed twice, not once", () => {
    const nextFitCameraViewState = createFitCameraWriteSequence();
    const deck = fakeDeck();

    const first = fitViewStateForBbox(BBOX, 800, 600);
    const second = fitViewStateForBbox(BBOX, 800, 600);
    // The premise, asserted rather than assumed: the two fits ARE identical -- this piece changes
    // neither the fit target nor the zoom arithmetic (§2.2), so the second click really does compute
    // the same camera the first one did, and a deep-equal-gated write really would be dropped.
    expect(second).toEqual(first);

    deck.setProps({ initialViewState: nextFitCameraViewState(first) });
    deck.setProps({ initialViewState: nextFitCameraViewState(second) });

    expect(deck.cameraWrites).toHaveLength(2);
    // Both writes are the SAME camera: the identity field is what deck.gl's deep-equal sees, and it
    // is never a camera value (`FitCameraViewState.fitCameraWriteId`).
    expect(deck.cameraWrites[1]).toEqual(deck.cameraWrites[0]);
    expect(deck.cameraWrites[0]).toEqual({ target: [first.target[0], first.target[1], 0], zoom: first.zoom });
  });

  it("the fit's camera fields are exactly the fit's, and the write id is the only thing that moves", () => {
    const nextFitCameraViewState = createFitCameraWriteSequence();
    const fit = fitViewStateForBbox(BBOX, 800, 600);

    const a = nextFitCameraViewState(fit);
    const b = nextFitCameraViewState(fit);

    expect(a.target).toEqual([fit.target[0], fit.target[1], 0]);
    expect(a.zoom).toBe(fit.zoom);
    expect(b.target).toEqual(a.target);
    expect(b.zoom).toBe(a.zoom);
    expect(b.fitCameraWriteId).not.toBe(a.fitCameraWriteId);
  });

  it("each canvas instance has its own sequence -- a second canvas never continues the first one's", () => {
    // Why a factory rather than a module-level counter: two mounted canvases must not share one
    // sequence (`createFitCameraWriteSequence`'s own doc comment). Both sequences still satisfy the
    // only property that matters -- consecutive values from the SAME sequence differ.
    const first = createFitCameraWriteSequence();
    const second = createFitCameraWriteSequence();
    const fit = fitViewStateForBbox(BBOX, 800, 600);

    const firstWrite = first(fit);
    const secondCanvasFirstWrite = second(fit);
    expect(secondCanvasFirstWrite.fitCameraWriteId).toBe(firstWrite.fitCameraWriteId); // each begins at its own beginning
    expect(first(fit).fitCameraWriteId).not.toBe(firstWrite.fitCameraWriteId); // and each advances on its own
  });
});
