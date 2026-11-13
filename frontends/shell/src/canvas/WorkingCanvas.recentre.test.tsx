// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * U1 and U2 of RECENTRE-CROSSING-VIEW-DISPLACED-FIX-PREREGISTRATION.md section 4: when a pan carries the target past the re-centring bound, the frame's
 * origin moves and the view stays where it was. The REAL `WorkingCanvas` runs; only `Deck` is replaced, by a fake that applies the three rules of deck's
 * own source that decide the outcome (`@deck.gl/core` 9.3.9, read from node_modules, which is untracked: evidence, not Authority). The fake models
 * deck's rules, so it cannot see a change in deck: the operator-run e2e suites are the guard against that.
 *
 * The camera is read the way the app reads it: only from the `view-state` trace line (target plus origin, W = target + origin). A gesture is a run of ticks, each
 * built from the camera the fake's view lookup returns, as deck's controller rebuilds its state from its props on every event.
 *
 * RECORDED MUTATION for U1 (M-U1): in the view-state handler (WorkingCanvas.tsx) restore the in-callback `setProps({ initialViewState })` move and return
 * nothing. Expected failure: at the first crossing W jumps by the change of origin.
 * RECORDED MUTATION for U2 (M-U2): in the same handler remove the guard's transition clauses. Expected failure: at (a) the origin changes.
 */

import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { DeckProps, InteractionState, ViewStateChangeParameters } from "@deck.gl/core";

const decks = vi.hoisted(() => [] as unknown[]);
const rules = vi.hoisted(() => {
  // `@deck.gl/core` 9.3.9, `dist/utils/deep-equal.js`: the whole function, as written (the package's exports map does not expose it).
  const deepEqual = (a: any, b: any, depth: number): boolean => {
    if (a === b) return true;
    if (!depth || !a || !b) return false;
    if (Array.isArray(a)) {
      if (!Array.isArray(b) || a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) if (!deepEqual(a[i], b[i], depth - 1)) return false;
      return true;
    }
    if (Array.isArray(b)) return false;
    if (typeof a === "object" && typeof b === "object") {
      const aKeys = Object.keys(a);
      if (aKeys.length !== Object.keys(b).length) return false;
      for (const key of aKeys) {
        if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
        if (!deepEqual(a[key], b[key], depth - 1)) return false;
      }
      return true;
    }
    return false;
  };
  // `@deck.gl/core` 9.3.9, `dist/controllers/transition-manager.js`, lines 80 to 84: a view state starts a transition when it carries a duration
  // above zero (or "auto") and an interpolator.
  const isTransitionEnabled = (props: { transitionDuration?: number | "auto"; transitionInterpolator?: unknown }): boolean =>
    ((props.transitionDuration as number) > 0 || props.transitionDuration === "auto") && Boolean(props.transitionInterpolator);
  return { deepEqual, isTransitionEnabled };
});

vi.mock("@deck.gl/core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@deck.gl/core")>();
  class FakeDeck {
    props: Partial<DeckProps>;
    viewState: any;
    constructor(props: Partial<DeckProps>) {
      this.props = { ...props };
      // `@deck.gl/core` 9.3.9, `dist/lib/deck.js`, line 251: the constructor takes `initialViewState` as deck's own view state.
      this.viewState = this.props.initialViewState;
      decks.push(this);
    }
    setProps(props: Partial<DeckProps>): void {
      // D1. `@deck.gl/core` 9.3.9, `dist/lib/deck.js`, lines 323 to 328: a new `initialViewState` that is not deep-equal (depth 3) to the last one
      // overwrites deck's own view state.
      if (props.initialViewState && !rules.deepEqual(this.props.initialViewState, props.initialViewState, 3)) this.viewState = props.initialViewState;
      Object.assign(this.props, props);
    }
    /** D5. `@deck.gl/core` 9.3.9, `dist/lib/view-manager.js`, lines 93 to 98: the per-view entry first, the root view state after it. The view's id
     * is the view's own (`dist/views/view.js`, lines 51 to 58). */
    camera(): { target: [number, number, number]; zoom: number } {
      return this.viewState[this.viewId()] || this.viewState;
    }
    /** D3. `@deck.gl/core` 9.3.9, `dist/lib/deck.js`, lines 1044 to 1057: the callback's return value, or the tick's own view state when it returns
     * nothing, is stored under the view's id. */
    tick(viewState: Record<string, unknown>, interactionState: InteractionState): void {
      const params: ViewStateChangeParameters = { viewState, interactionState, viewId: this.viewId() };
      const returned = this.props.onViewStateChange!(params) || params.viewState;
      if (this.viewState) this.viewState = { ...this.viewState, [params.viewId]: returned };
    }
    private viewId(): string {
      return (this.props.views as unknown as { id: string }).id;
    }
    pickObject(): unknown {
      return null;
    }
    finalize(): void {}
  }
  return { ...actual, Deck: FakeDeck };
});

import { __resetResidencyArmForTests, setResidencyArm } from "../residency/residencyArm";
import { DEFAULT_STYLE_STATE } from "../style/document";
import { loadBatchFixture } from "../testUtils/batchFixtures";
import { ENCODING_POLYGON } from "./decodeBatch";
import { RECENTER_BUDGET_PX, RECENTER_MAX_DRIFT, recenterThresholdForBudget } from "./offsetFrame";
import WorkingCanvas from "./WorkingCanvas";
import type { WorkingCanvasHandle, WorkingCanvasProps } from "./WorkingCanvas";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

interface FakeDeckLike {
  camera(): { target: [number, number, number]; zoom: number };
  tick(viewState: Record<string, unknown>, interactionState: InteractionState): void;
}
interface ViewLine {
  targetX: number;
  targetY: number;
  zoom: number;
  originX: number;
  originY: number;
}
const DRAGGING = { isDragging: true, inTransition: false };
const SETTLED = { isDragging: false, inTransition: false };
const IN_TRANSITION = { isDragging: false, inTransition: true };

let container: HTMLDivElement;
let root: Root;
let debug: { mock: { calls: any[][] }; mockRestore(): void };

beforeEach(() => {
  decks.length = 0;
  Object.defineProperty(HTMLCanvasElement.prototype, "clientWidth", { configurable: true, get: () => 400 });
  Object.defineProperty(HTMLCanvasElement.prototype, "clientHeight", { configurable: true, get: () => 300 });
  __resetResidencyArmForTests();
  setResidencyArm("baseline");
  debug = vi.spyOn(console, "debug").mockImplementation(() => {});
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});
afterEach(() => {
  act(() => root.unmount());
  container.remove();
  debug.mockRestore();
});

const theDeck = (): FakeDeckLike => decks[0] as FakeDeckLike;
const lines = (): ViewLine[] => debug.mock.calls.filter((c) => c[0] === "[render-trace]" && c[1] === "view-state").map((c) => c[2] as ViewLine);
const lastLine = (): ViewLine => lines().at(-1)!;
const world = (l: ViewLine): [number, number] => [l.targetX + l.originX, l.targetY + l.originY];
const origin = (l: ViewLine): [number, number] => [l.originX, l.originY];

/** Mount the real canvas and reach the one-shot fit by pushing a batch, as the wiring test does. Returns the fit's zoom and the bound there (T). */
function reachTheFit(): { zoom: number; bound: number } {
  const ref = { current: null as WorkingCanvasHandle | null };
  const props = {
    dataset: "d1", geometryColumn: "geometry", geometryEncoding: ENCODING_POLYGON, projection: null, crsUnit: "metre",
    onHover: vi.fn(), onCanvasRefusal: vi.fn(), onResidentCeilingExceeded: vi.fn(), onViewportChanged: vi.fn(), onViewportWithinLastQuery: vi.fn(),
    style: DEFAULT_STYLE_STATE,
  } as unknown as WorkingCanvasProps;
  act(() => root.render(<WorkingCanvas ref={(h) => { ref.current = h; }} {...props} />));
  act(() => {
    ref.current!.pushBatch("sh_a", 0, loadBatchFixture("lv95-polygon-batch"), null);
  });
  const fit = lastLine();
  expect(fit.targetX, "the fit line carries the target (0, 0)").toBe(0);
  return { zoom: fit.zoom, bound: recenterThresholdForBudget(2 ** fit.zoom, RECENTER_BUDGET_PX, RECENTER_MAX_DRIFT.metre) };
}

/** One tick: the camera deck holds, moved by (dx, dy) local units, plus any fields the tick itself carries. Only target and zoom come from the camera:
 * a transition's fields belong to the event that started it. */
function tick(dx: number, dy: number, interactionState: InteractionState, extra: Record<string, unknown> = {}): void {
  const cam = theDeck().camera();
  act(() => theDeck().tick({ target: [cam.target[0] + dx, cam.target[1] + dy, 0], zoom: cam.zoom, ...extra }, interactionState));
}
/** Drag ticks that take the target past the bound (1.5 T away), none of them settled. */
function dragPastTheBound(bound: number): void {
  for (let i = 0; i < 3; i++) tick(0.4 * bound, 0.3 * bound, DRAGGING);
  expect(Math.hypot(lastLine().targetX, lastLine().targetY), "the drag took the target past the bound").toBeGreaterThan(bound);
}
function expectViewKept(before: ViewLine, next: ViewLine, label: string): void {
  expect(origin(next), `${label}: the origin changed`).not.toEqual(origin(before));
  expect(next.zoom, `${label}: the zoom is unchanged`).toBe(before.zoom);
  const [wb, wn] = [world(before), world(next)];
  expect(Math.abs(wn[0] - wb[0]), `${label}: W.x moved by ${wn[0] - wb[0]} world units`).toBeLessThanOrEqual(1e-6);
  expect(Math.abs(wn[1] - wb[1]), `${label}: W.y moved by ${wn[1] - wb[1]} world units`).toBeLessThanOrEqual(1e-6);
}

describe("the re-centre keeps the view where it was", () => {
  it("U1: a drag past the bound and its settled tick change the origin and not W, at the first crossing and at a second one at the same zoom", () => {
    const { bound } = reachTheFit();
    for (const crossing of [1, 2]) {
      dragPastTheBound(bound);
      tick(0, 0, SETTLED); // the gesture's settled tick: the re-centre lands here
      const before = lastLine(); // written before the re-centre, with the old origin
      tick(0, 0, DRAGGING); // the next event, built from the camera deck holds now
      expectViewKept(before, lastLine(), `crossing ${crossing}`);
    }
  });

  it("U2: no origin change on a settled tick in a transition or on one that starts a transition; the next tick with none re-centres and W is continuous", () => {
    const { bound } = reachTheFit();
    dragPastTheBound(bound);
    const start = lines().length;
    const oldOrigin = origin(lastLine());
    const originsSince = (): Array<[number, number]> => lines().slice(start).map(origin);
    const stillOldFrame = (label: string): void =>
      expect(originsSince(), label).toEqual(Array(originsSince().length).fill(oldOrigin));

    // (a) settled ticks of a transition in progress (interactionState.inTransition)
    tick(0, 0, IN_TRANSITION);
    tick(0, 0, IN_TRANSITION);
    stillOldFrame("(a) a settled tick with inTransition true: the origin stays");

    // (b) a settled tick whose view state carries a transition (duration 300 and an interpolator), then its first frame
    const startsATransition = { transitionDuration: 300, transitionInterpolator: {} };
    expect(rules.isTransitionEnabled(startsATransition), "(b) deck's own test calls this view state a transition").toBe(true);
    tick(0, 0, SETTLED, startsATransition);
    tick(0, 0, IN_TRANSITION);
    stillOldFrame("(b) a settled tick that starts a transition: the origin stays");

    // (c) the transition has ended: a tick with none re-centres
    expect(rules.isTransitionEnabled({ transitionDuration: 300 }), "(c) a duration with no interpolator is no transition").toBe(false);
    tick(0, 0, SETTLED);
    const before = lastLine();
    expect(origin(before), "(c) the tick's own line still has the old origin").toEqual(oldOrigin);
    tick(0, 0, DRAGGING);
    expectViewKept(before, lastLine(), "(c)");
  });
});
