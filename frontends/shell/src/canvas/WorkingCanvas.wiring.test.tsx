// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md section 2.2 and Amendments 2 and 3: the canvas's phase B wiring, through the REAL
 * `WorkingCanvas` with a stand-in for deck's `Deck` class only. This is RB18's canvas side (Amendment 3 item 3: a call of
 * `onViewShown` issues no query and writes no last-asked area), and the wiring of the click, the highlight, the cursor and
 * `fitToBbox` that `clickPick.test.ts`, `highlightLayers.test.ts` and `pickResolution.test.ts` prove as pure functions.
 *
 * **The seam to deck is written against the interface deck has** (`@deck.gl/core` 9.3.9, `dist/lib/deck.js`, read from node_modules, which is
 * untracked: evidence, not Authority): `onClick(info, event)` is the root handler `_dispatchPickingEvent` calls, and `event.srcEvent` is the tap's native
 * `pointerup` (mjolnir.js 3.0.1 `dist/hammerjs/inputs/pointerevent.js`, passed on by deck's `_onEvent`), whose client coordinates give its pixel (`tapPixel`); `getCursor(cursorState)` is re-run by `_updateCursor` from `_onRenderFrame`; `onResize` is a prop the
 * canvas reads no argument from; `setProps` merges; `pickObject({x, y, radius?})` answers a picking info or null. Real deck is proven
 * by the e2e suites; here only the WebGL boundary is replaced (`Deck`), and the engine's own committed batch is decoded for real.
 */

import { act, createRef } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

interface FakePickingInfo {
  index: number;
  layer: { id: string } | null;
}
interface FakeDeckLike {
  props: Record<string, any>;
  setPropsCalls: Array<Record<string, any>>;
  pickReturn: FakePickingInfo | null;
  pickCalls: Array<{ x: number; y: number; radius?: number }>;
}

const decks = vi.hoisted(() => [] as unknown[]);
vi.mock("@deck.gl/core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@deck.gl/core")>();
  class FakeDeck {
    props: Record<string, unknown>;
    setPropsCalls: Array<Record<string, unknown>> = [];
    pickReturn: unknown = null;
    pickCalls: Array<{ x: number; y: number; radius?: number }> = [];
    constructor(props: Record<string, unknown>) {
      this.props = { ...props };
      decks.push(this);
    }
    setProps(props: Record<string, unknown>): void {
      this.setPropsCalls.push(props);
      Object.assign(this.props, props);
    }
    pickObject(options: { x: number; y: number; radius?: number }): unknown {
      this.pickCalls.push(options);
      return this.pickReturn;
    }
    finalize(): void {}
  }
  return { ...actual, Deck: FakeDeck };
});

import { __resetResidencyArmForTests, setResidencyArm } from "../residency/residencyArm";
import { DEFAULT_STYLE_STATE } from "../style/document";
import { loadBatchFixture } from "../testUtils/batchFixtures";
import { decodeBatch, ENCODING_POLYGON } from "./decodeBatch";
import WorkingCanvas from "./WorkingCanvas";
import type { WorkingCanvasHandle, WorkingCanvasProps } from "./WorkingCanvas";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const theDeck = (): FakeDeckLike => decks[0] as FakeDeckLike;
const layerIdsOfLastRender = (): string[] =>
  (theDeck().setPropsCalls.filter((c) => c.layers).at(-1)?.layers as Array<{ id: string }>).map((l) => l.id);
const frames = async (n: number): Promise<void> => {
  for (let i = 0; i < n; i++) await act(async () => new Promise<void>((r) => requestAnimationFrame(() => r())));
};

let size = { w: 400, h: 300 };
let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  decks.length = 0;
  size = { w: 400, h: 300 };
  Object.defineProperty(HTMLCanvasElement.prototype, "clientWidth", { configurable: true, get: () => size.w });
  Object.defineProperty(HTMLCanvasElement.prototype, "clientHeight", { configurable: true, get: () => size.h });
  __resetResidencyArmForTests();
  setResidencyArm("baseline");
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

function mount(extra: Partial<WorkingCanvasProps> = {}) {
  const ref = createRef<WorkingCanvasHandle>();
  const base = {
    dataset: "d1",
    geometryColumn: "geometry",
    geometryEncoding: ENCODING_POLYGON,
    crsUnit: "metre",
    onHover: vi.fn(),
    onCanvasRefusal: vi.fn(),
    onResidentCeilingExceeded: vi.fn(),
    onViewportChanged: vi.fn(),
    onViewportWithinLastQuery: vi.fn(),
    style: DEFAULT_STYLE_STATE,
  } as unknown as WorkingCanvasProps;
  const render = (more: Partial<WorkingCanvasProps>): void => {
    act(() => root.render(<WorkingCanvas ref={ref} {...base} {...extra} {...more} />));
  };
  render({});
  const push = (): void => {
    act(() => {
      ref.current!.pushBatch("sh_a", 0, loadBatchFixture("lv95-polygon-batch"));
    });
  };
  return { ref, base, render, push };
}

describe("RB18 (canvas side): onViewShown is called in exactly two places, and neither asks for anything", () => {
  // RECORDED MUTATION for "RB18 (canvas)" (the auto-fit): in `fitToExtent` (WorkingCanvas.tsx) route the unreported write's box into
  // `reportViewport` instead of `onViewShown` (Amendment 3 item 3's mutation). Expected failure: `onViewShown` is not called and a query is.
  // OBSERVED AT 6488360ffa1f58bf392e731f605e5a7255d24260: FAILED -- "the auto-fit's unreported camera write calls onViewShown once with the box it shows, and issues no query":
  //   AssertionError: expected "vi.fn()" to be called 1 times, but got 0 times. Reverted after observing.
  it("the auto-fit's unreported camera write calls onViewShown once with the box it shows, and issues no query", () => {
    const onViewShown = vi.fn();
    const { base, push } = mount({ onViewShown });
    push();
    expect(onViewShown).toHaveBeenCalledTimes(1);
    const shown = onViewShown.mock.calls[0][0];
    expect(shown.xmax).toBeGreaterThan(shown.xmin);
    expect(shown.ymax).toBeGreaterThan(shown.ymin);
    expect(base.onViewportChanged).not.toHaveBeenCalled();
  });

  // RECORDED MUTATION for "RB18 (canvas)" (a size change): in `onResize` (WorkingCanvas.tsx) route the box into `reportViewport` instead of
  // `onViewShown`. Expected failure: `onViewShown` is not called for the size change, and `onViewportChanged` is.
  // OBSERVED AT 6488360ffa1f58bf392e731f605e5a7255d24260: FAILED -- "a change of size while no area is last asked for calls onViewShown with the box now shown, and asks nothing":
  //   AssertionError: expected "vi.fn()" to be called 2 times, but got 1 times. Reverted after observing.
  it("a change of size while no area is last asked for calls onViewShown with the box now shown, and asks nothing", () => {
    const onViewShown = vi.fn();
    const { base, push } = mount({ onViewShown });
    push();
    const before = onViewShown.mock.calls[0][0];
    size = { w: 800, h: 600 };
    theDeck().props.onResize();
    expect(onViewShown).toHaveBeenCalledTimes(2);
    const after = onViewShown.mock.calls[1][0];
    expect(after.xmax - after.xmin).toBeGreaterThan(before.xmax - before.xmin);
    expect(base.onViewportChanged).not.toHaveBeenCalled();
    expect(base.onViewportWithinLastQuery).not.toHaveBeenCalled();
    size = { w: 1600, h: 1200 };
    theDeck().props.onResize();
    expect(onViewShown, "still no area asked for, so shown again").toHaveBeenCalledTimes(3);
    expect(base.onViewportChanged, "and still no query").not.toHaveBeenCalled();
  });

  // RECORDED MUTATION for "RB18 (canvas)" (with an area last asked for): in `onResize` (WorkingCanvas.tsx) also call `onViewShownRef.current?.(decision.bbox)`
  // in the `within` branch. Expected failure: a shrink inside the area last asked for also calls `onViewShown`.
  // (Dropping the `lastQueriedRef.current === null` condition of the new branch is an equivalent mutation, not a failing one: `viewportAfterResize`
  // answers none with a camera and a usable size only when no area was asked for, so that condition is a guard, and no test can tell it apart.)
  // OBSERVED AT 6488360ffa1f58bf392e731f605e5a7255d24260: FAILED -- "once an area is asked for, a size change reports as it did and shows nothing; Reset un-asks it":
  //   AssertionError: expected "vi.fn()" to be called 1 times, but got 2 times. Reverted after observing.
  it("once an area is asked for, a size change reports as it did and shows nothing; Reset un-asks it", () => {
    const onViewShown = vi.fn();
    const { ref, base, push } = mount({ onViewShown });
    push();
    act(() => ref.current!.fitToBbox!({ xmin: 2_600_000, ymin: 1_200_000, xmax: 2_600_100, ymax: 1_200_100 }));
    expect(base.onViewportChanged, "the fit's own report").toHaveBeenCalledTimes(1);
    expect(onViewShown, "only the auto-fit").toHaveBeenCalledTimes(1);
    size = { w: 1600, h: 1200 };
    theDeck().props.onResize();
    expect(base.onViewportChanged, "a growth asks").toHaveBeenCalledTimes(2);
    size = { w: 100, h: 100 };
    theDeck().props.onResize();
    expect(base.onViewportWithinLastQuery, "a shrink inside it reports within").toHaveBeenCalledTimes(1);
    expect(onViewShown).toHaveBeenCalledTimes(1);
    ref.current!.resetFitForNewGeneration();
    size = { w: 300, h: 300 };
    theDeck().props.onResize();
    expect(onViewShown, "after the reset no area is asked for").toHaveBeenCalledTimes(2);
  });

  // RECORDED MUTATION for "RB18 (canvas)" (no camera yet): in `onResize` (WorkingCanvas.tsx) drop the `cameraRef.current !== null` condition.
  // Expected failure: a size change before any camera write calls `onViewShown` (with a box computed from nothing).
  // OBSERVED AT 6488360ffa1f58bf392e731f605e5a7255d24260: FAILED -- "a change of size before any camera write shows nothing":
  //   AssertionError: expected "vi.fn()" to not be called at all, but actually been called 1 times. Reverted after observing.
  it("a change of size before any camera write shows nothing", () => {
    const onViewShown = vi.fn();
    mount({ onViewShown });
    size = { w: 800, h: 600 };
    theDeck().props.onResize();
    expect(onViewShown).not.toHaveBeenCalled();
  });
});

describe("fitToBbox (Amendment 2 item 3)", () => {
  // RECORDED MUTATION for "fitToBbox": in `fitToBbox` (WorkingCanvas.tsx) call `fitToExtent(bbox, false)`. Expected failure: no view is reported.
  // OBSERVED AT 6488360ffa1f58bf392e731f605e5a7255d24260: FAILED -- "reuses the fit with notification: the fitted view is reported as a query, and it is not onViewShown's":
  //   AssertionError: expected "vi.fn()" to be called 1 times, but got 0 times. Reverted after observing.
  it("reuses the fit with notification: the fitted view is reported as a query, and it is not onViewShown's", () => {
    const onViewShown = vi.fn();
    const { ref, base } = mount({ onViewShown });
    act(() => ref.current!.fitToBbox!({ xmin: 2_600_000, ymin: 1_200_000, xmax: 2_600_100, ymax: 1_200_100 }));
    expect(base.onViewportChanged).toHaveBeenCalledTimes(1);
    const box = (base.onViewportChanged as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(box.xmin).toBeLessThan(2_600_000);
    expect(box.xmax).toBeGreaterThan(2_600_100);
    expect(onViewShown).not.toHaveBeenCalled();
  });
});

describe("the cursor per tool (Amendment 2 item 6)", () => {
  // RECORDED MUTATION for "the cursor": in the Deck's `getCursor` (WorkingCanvas.tsx) call `cursorForPointerState(isDragging)` without the tool.
  // Expected failure: the cursor in Select is crosshair where default was expected.
  // OBSERVED AT 6488360ffa1f58bf392e731f605e5a7255d24260: FAILED -- "deck's getCursor answers the tool the prop has now, and grabbing while dragging in both":
  //   AssertionError: expected 'crosshair' to be 'default' // Object.is equality. Reverted after observing.
  it("deck's getCursor answers the tool the prop has now, and grabbing while dragging in both", () => {
    const { render } = mount({ tool: "navigate" });
    expect(theDeck().props.getCursor({ isDragging: false })).toBe("crosshair");
    render({ tool: "select" });
    expect(theDeck().props.getCursor({ isDragging: false })).toBe("default");
    expect(theDeck().props.getCursor({ isDragging: true })).toBe("grabbing");
    render({ tool: "navigate" });
    expect(theDeck().props.getCursor({ isDragging: false })).toBe("crosshair");
  });

  // RECORDED MUTATION for "the cursor" (no prop): in the component's parameters (WorkingCanvas.tsx) default `tool` to `"select"`.
  // Expected failure: a canvas given no tool answers default where crosshair was expected.
  // OBSERVED AT 6488360ffa1f58bf392e731f605e5a7255d24260: FAILED -- "a canvas given no tool is in Navigate, as it was before the prop existed":
  //   AssertionError: expected 'default' to be 'crosshair' // Object.is equality. Reverted after observing.
  it("a canvas given no tool is in Navigate, as it was before the prop existed", () => {
    mount();
    expect(theDeck().props.getCursor({ isDragging: false })).toBe("crosshair");
  });
});

describe("the tap (UB7's wiring, OPEN-1 (A))", () => {
  // RECORDED MUTATION for "the tap" (deck's info): in the Deck's `onClick` (WorkingCanvas.tsx) return early when deck's picking info has no
  // feature (`if (info.index < 0) return;`). Expected failure: no pick runs at the tap's pixel, because the info given is the pointer-down one.
  // OBSERVED AT 6488360ffa1f58bf392e731f605e5a7255d24260: FAILED -- "picks afresh at the tap's own pixel and emits the feature with its bounds, whatever deck's own info says":
  //   AssertionError: expected undefined to match object { x: 12, y: 34 }. Reverted after observing.
  it("picks afresh at the tap's own pixel and emits the feature with its bounds, whatever deck's own info says", () => {
    const onClickPick = vi.fn();
    const { push } = mount({ onClickPick });
    push();
    theDeck().pickReturn = { index: 0, layer: { id: layerIdsOfLastRender()[0] } };
    theDeck().props.onClick({ index: -1, layer: null }, { type: "click", srcEvent: { clientX: 12, clientY: 34 } });
    expect(theDeck().pickCalls.at(-1)).toMatchObject({ x: 12, y: 34 });
    expect(onClickPick).toHaveBeenCalledTimes(1);
    const result = onClickPick.mock.calls[0][0];
    expect(result.kind).toBe("feature");
    expect(result.bounds.xmax).toBeGreaterThan(result.bounds.xmin);
  });

  // RECORDED MUTATION for "the tap" (a double-click, OPEN-14): in the Deck's `onClick` (WorkingCanvas.tsx) remove the early return on `event.type === "dblclick"`.
  // Expected failure: the double-click picks and emits a result, where nothing was expected.
  // OBSERVED AT 41f270b4896642e3c6a05dd61397cb0b48409481: FAILED -- "a double-click event neither picks nor emits, and a click event at the same pixel still does":
  //   AssertionError: no inspection and no selection change: nothing is emitted: expected "vi.fn()" to not be called at all, but actually been called 1 times. The file's other 13 tests passed. Reverted after observing.
  it("a double-click event neither picks nor emits, and a click event at the same pixel still does", () => {
    const onClickPick = vi.fn();
    const { push } = mount({ onClickPick });
    push();
    theDeck().pickReturn = { index: 0, layer: { id: layerIdsOfLastRender()[0] } };
    const picksBefore = theDeck().pickCalls.length;
    theDeck().props.onClick({ index: -1, layer: null }, { type: "dblclick", srcEvent: { clientX: 12, clientY: 34 } });
    expect(onClickPick, "no inspection and no selection change: nothing is emitted").not.toHaveBeenCalled();
    expect(theDeck().pickCalls.length, "no pick").toBe(picksBefore);
    theDeck().props.onClick({ index: -1, layer: null }, { type: "click", srcEvent: { clientX: 12, clientY: 34 } });
    expect(onClickPick, "a click still emits").toHaveBeenCalledTimes(1);
    expect(onClickPick.mock.calls[0][0].kind).toBe("feature");
  });

  // RECORDED MUTATION for "the tap" (nothing under it): in the Deck's `onClick` (WorkingCanvas.tsx) never call `onTap` (delete the call).
  // Expected failure: no result is emitted for a tap on nothing.
  // OBSERVED AT 6488360ffa1f58bf392e731f605e5a7255d24260: FAILED -- "a tap on nothing emits nothing-kind, and a tap without a pixel emits no result":
  //   AssertionError: expected [] to deeply equal [ [ { kind: 'nothing' } ] ]. Reverted after observing.
  it("a tap on nothing emits nothing-kind, and a tap without a pixel emits no result", () => {
    const onClickPick = vi.fn();
    const { push } = mount({ onClickPick });
    push();
    theDeck().pickReturn = null;
    theDeck().props.onClick({}, { type: "click", srcEvent: { clientX: 1, clientY: 2 } });
    expect(onClickPick.mock.calls).toEqual([[{ kind: "nothing" }]]);
    theDeck().props.onClick({}, { type: "click" });
    expect(onClickPick).toHaveBeenCalledTimes(1);
  });

  // RECORDED MUTATION for "the tap" (the shared pick): in `pickCandidateAt` (WorkingCanvas.tsx) call `deck.pickObject({ x, y })` without the line
  // open's radius. Expected failure: the pick at the tap's pixel carries no radius.
  // OBSERVED AT 6488360ffa1f58bf392e731f605e5a7255d24260: FAILED -- "on a line open the tap's pick carries the line open's radius, as the settle re-pick's does":
  //   TypeError: actual value must be number or bigint, received "undefined". Reverted after observing.
  it("on a line open the tap's pick carries the line open's radius, as the settle re-pick's does", () => {
    const onClickPick = vi.fn();
    const { ref } = mount({ onClickPick, geometryEncoding: "geoarrow.linestring" });
    act(() => {
      ref.current!.pushBatch("sh_l", 0, loadBatchFixture("lv95-linestring-batch"));
    });
    theDeck().props.onClick({}, { type: "click", srcEvent: { clientX: 3, clientY: 4 } });
    expect(theDeck().pickCalls.at(-1)).toMatchObject({ x: 3, y: 4 });
    expect(theDeck().pickCalls.at(-1)?.radius).toBeGreaterThan(0);
  });
});

describe("the highlight prop (section 2.2)", () => {
  const firstId = (): bigint =>
    decodeBatch("sh_a", 0, loadBatchFixture("lv95-polygon-batch"), "geometry", ENCODING_POLYGON).ids[0];

  // RECORDED MUTATION for "the highlight" (order): in `render()` (WorkingCanvas.tsx) put the highlight layers before the data layers
  // (`[...highlightResult.layers, ...layers]`). Expected failure: the last layer is the data layer.
  // OBSERVED AT 6488360ffa1f58bf392e731f605e5a7255d24260: FAILED -- "the highlight layers come after the data layers, and nothing highlighted adds none":
  //   AssertionError: expected 'highlight:selected:sh_a:0' to be 'sh_a:0' // Object.is equality. Reverted after observing.
  it("the highlight layers come after the data layers, and nothing highlighted adds none", async () => {
    const { render, push } = mount();
    push();
    expect(layerIdsOfLastRender().some((id) => id.startsWith("highlight:"))).toBe(false);
    render({ highlight: { selected: new Set([firstId()]), inspected: null } });
    await frames(2);
    const ids = layerIdsOfLastRender();
    expect(ids[0]).toBe("sh_a:0");
    expect(ids.at(-1)).toBe("highlight:selected:sh_a:0");
  });

  // RECORDED MUTATION for "the highlight" (a prop change): in the highlight effect (WorkingCanvas.tsx) schedule nothing (empty effect body).
  // Expected failure: a new highlight draws nothing.
  // OBSERVED AT 6488360ffa1f58bf392e731f605e5a7255d24260: FAILED -- "a highlight change schedules the coalesced render, and a clear removes the layers":
  //   AssertionError: expected 3 to be greater than 3. Reverted after observing.
  it("a highlight change schedules the coalesced render, and a clear removes the layers", async () => {
    const { render, push } = mount();
    push();
    await frames(2); // the render the mount scheduled is flushed first, so that it cannot stand in for the highlight's own
    const calls = (): number => theDeck().setPropsCalls.filter((c) => c.layers).length;
    const before = calls();
    render({ highlight: { selected: new Set([firstId()]), inspected: null } });
    await frames(2);
    expect(calls()).toBeGreaterThan(before);
    render({ highlight: { selected: new Set(), inspected: null } });
    await frames(2);
    expect(layerIdsOfLastRender()).toEqual(["sh_a:0"]);
  });

  // RECORDED MUTATION for "the highlight" (emission): in `render()` (WorkingCanvas.tsx) call `onSelectionDrawnChangeRef.current?.(drawn)` on every pass
  // instead of the change-only emitter. Expected failure: the pass that drew the data (nothing highlighted) already emitted.
  // OBSERVED AT 6488360ffa1f58bf392e731f605e5a7255d24260: FAILED -- "onSelectionDrawnChange gets the drawn set once when it changes, and the empty set when it clears":
  //   AssertionError: nothing highlighted, nothing drawn: expected "vi.fn()" to not be called at all, but actually been called 2 times. Reverted after observing.
  it("onSelectionDrawnChange gets the drawn set once when it changes, and the empty set when it clears", async () => {
    const onSelectionDrawnChange = vi.fn();
    const { render, push } = mount({ onSelectionDrawnChange });
    push();
    expect(onSelectionDrawnChange, "nothing highlighted, nothing drawn").not.toHaveBeenCalled();
    const selected = new Set([firstId()]);
    render({ highlight: { selected, inspected: null } });
    await frames(2);
    expect(onSelectionDrawnChange).toHaveBeenCalledTimes(1);
    expect([...onSelectionDrawnChange.mock.calls[0][0]]).toEqual([firstId()]);
    render({ highlight: { selected, inspected: null } });
    await frames(2);
    expect(onSelectionDrawnChange, "a new wrapper with the same members").toHaveBeenCalledTimes(1);
    render({ highlight: { selected: new Set(), inspected: null } });
    await frames(2);
    expect(onSelectionDrawnChange).toHaveBeenCalledTimes(2);
    expect(onSelectionDrawnChange.mock.calls[1][0].size).toBe(0);
  });
});
