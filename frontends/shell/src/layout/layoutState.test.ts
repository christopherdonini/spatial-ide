// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it } from "vitest";

import type { ActivityTabId, InspectorTabId } from "./contributions";
import {
  ACTIVITY_HEIGHT_PX,
  INSPECTOR_WIDTH_PX,
  LAYERS_WIDTH_PX,
  MAP_MIN_HEIGHT_PX,
  MAP_MIN_WIDTH_PX,
  VIEWPORT_FLOOR,
} from "./layoutConstants";
import { effectiveSizes, initialLayoutState, layoutReducer, sizeRangeOf } from "./layoutState";
import type { LayoutAction, LayoutState, SideRegion } from "./layoutState";

/**
 * SHELL-MIGRATION-MILESTONE-1-PREREGISTRATION.md §4, U1 to U3: the layout reducer and its fit.
 */

const VIEWPORT_WIDTHS = [VIEWPORT_FLOOR.width, 1280, 1366, 1600, 1920];
const VIEWPORT_HEIGHTS = [VIEWPORT_FLOOR.height, 720, 768, 800, 1080];
const REGIONS: SideRegion[] = ["layers", "inspector", "activity"];
const INSPECTOR_TAB_IDS: InspectorTabId[] = ["layer", "style"];
const ACTIVITY_TAB_IDS: ActivityTabId[] = ["console", "notices"];

/** mulberry32: a seeded generator, so a failing sequence replays. */
function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randomAction(random: () => number): LayoutAction {
  const pick = <T>(items: readonly T[]): T => items[Math.floor(random() * items.length)];
  switch (Math.floor(random() * 4)) {
    case 0:
      return { kind: "toggle", region: pick(REGIONS) };
    case 1:
      return random() < 0.5
        ? { kind: "selectTab", region: "inspector", tab: pick(INSPECTOR_TAB_IDS) }
        : { kind: "selectTab", region: "activity", tab: pick(ACTIVITY_TAB_IDS) };
    case 2:
      return { kind: "toggleSection", section: pick(["source", "filter"] as const) };
    default:
      // Includes values far outside every range: clamping is the reducer's job.
      return { kind: "resize", region: pick(REGIONS), px: Math.round(random() * 2400 - 600) };
  }
}

function mapIsUsable(state: LayoutState, width: number, height: number): string | null {
  const sizes = effectiveSizes(state, { width, height });
  if (sizes.mapWidth >= MAP_MIN_WIDTH_PX && sizes.mapHeight >= MAP_MIN_HEIGHT_PX) return null;
  return `map ${sizes.mapWidth} x ${sizes.mapHeight} at ${width} x ${height} for ${JSON.stringify(state)}`;
}

function extremes(range: { min: number; max: number; default: number }): number[] {
  return [range.min, range.default, range.max];
}

// RECORDED MUTATION for "U1": delete `effectiveSizes`' shrink step (`if (excess > 0) {` becomes
// `if (false && excess > 0) {`). Expected failure: the fit no longer gives width back, so the map falls
// below 480 px wide at 1024 x 640.
// OBSERVED AT 64eb6e7689731eab0dc529cc0632a22d58fc288f: FAILED -- both U1 cases that sweep states fail; the first, "holds over every
// open combination x tab x section x size extreme, at every viewport", prints
//   AssertionError: expected [ ...(3) ] to deeply equal []
// with its first offender a map of 458 x 424 at 1024 x 640 (Layers closed, Inspector open at its 560 maximum).
// Reverted after observing.
describe("U1: no reachable state hides the map (effectiveSizes keeps MAP_MIN at every viewport at or above the floor)", () => {
  it("holds over every open combination x tab x section x size extreme, at every viewport", () => {
    const failures: string[] = [];
    for (const width of VIEWPORT_WIDTHS) {
      for (const height of VIEWPORT_HEIGHTS) {
        for (let openBits = 0; openBits < 8; openBits += 1) {
          for (const inspectorTab of INSPECTOR_TAB_IDS) {
            for (const activityTab of ACTIVITY_TAB_IDS) {
              for (let sectionBits = 0; sectionBits < 4; sectionBits += 1) {
                for (const layersWidth of extremes(LAYERS_WIDTH_PX)) {
                  for (const inspectorWidth of extremes(INSPECTOR_WIDTH_PX)) {
                    for (const activityHeight of extremes(ACTIVITY_HEIGHT_PX)) {
                      const state: LayoutState = {
                        layers: { open: (openBits & 1) !== 0, width: layersWidth },
                        inspector: { open: (openBits & 2) !== 0, width: inspectorWidth, tab: inspectorTab },
                        activity: { open: (openBits & 4) !== 0, height: activityHeight, tab: activityTab },
                        sections: { source: (sectionBits & 1) !== 0, filter: (sectionBits & 2) !== 0 },
                      };
                      const verdict = mapIsUsable(state, width, height);
                      if (verdict !== null) failures.push(verdict);
                    }
                  }
                }
              }
            }
          }
        }
      }
      if (failures.length > 0) break;
    }
    expect(failures.slice(0, 3)).toEqual([]);
  });

  it("holds after every action of 2,000 seeded random sequences of up to 40 actions, at every viewport", () => {
    const random = seededRandom(0x5eed1);
    const failures: string[] = [];
    for (let sequence = 0; sequence < 2000 && failures.length === 0; sequence += 1) {
      let state = initialLayoutState();
      const length = 1 + Math.floor(random() * 40);
      for (let step = 0; step < length && failures.length === 0; step += 1) {
        state = layoutReducer(state, randomAction(random));
        for (const width of VIEWPORT_WIDTHS) {
          for (const height of VIEWPORT_HEIGHTS) {
            const verdict = mapIsUsable(state, width, height);
            if (verdict !== null) failures.push(`sequence ${sequence} step ${step}: ${verdict}`);
          }
        }
      }
    }
    expect(failures.slice(0, 3)).toEqual([]);
  });

  it("the defaults leave the map the size the form predicts at the two reference viewports", () => {
    // Attention strip and status bar at their caps, Activity open: the form's section 5 prediction.
    const withActivity = layoutReducer(initialLayoutState(), { kind: "toggle", region: "activity" });
    const at1280 = effectiveSizes(withActivity, { width: 1280, height: 800 });
    const at1366 = effectiveSizes(withActivity, { width: 1366, height: 768 });
    expect([at1280.mapWidth, at1280.mapHeight]).toEqual([668, 378]);
    expect([at1366.mapWidth, at1366.mapHeight]).toEqual([754, 346]);
  });
});

// RECORDED MUTATION for "U2": `toggle` of Layers also closes Activity (the v7 defect, walkthrough step
// 10). Expected failure: Activity's open flag differs from the untouched expectation.
// OBSERVED AT d19c84a6c455029a7ec4bdca077ac1e9295f8b8a: FAILED -- "toggle(layers) flips that region's open and leaves everything else
// deep-equal": AssertionError: expected { layers: { open: false, ...(1) }, ...(3) } to deeply equal
// { layers: ... }; the diff is activity.open (expected true, received false). Reverted after observing.
describe("U2: each toggle changes only its own region's open flag", () => {
  const starts: LayoutState[] = [initialLayoutState()];
  const random = seededRandom(0x7091e);
  for (let i = 0; i < 25; i += 1) {
    let state = initialLayoutState();
    for (let step = 0; step < 12; step += 1) state = layoutReducer(state, randomAction(random));
    starts.push(state);
  }

  it.each(REGIONS)("toggle(%s) flips that region's open and leaves everything else deep-equal", (region) => {
    for (const before of starts) {
      const after = layoutReducer(before, { kind: "toggle", region });
      expect(after).toEqual({ ...before, [region]: { ...before[region], open: !before[region].open } });
    }
  });

  it("selecting a tab or toggling a section changes no region's open flag", () => {
    for (const before of starts) {
      const tabbed = layoutReducer(before, { kind: "selectTab", region: "inspector", tab: "style" });
      const sectioned = layoutReducer(before, { kind: "toggleSection", section: "filter" });
      for (const after of [tabbed, sectioned]) {
        expect([after.layers.open, after.inspector.open, after.activity.open]).toEqual([
          before.layers.open,
          before.inspector.open,
          before.activity.open,
        ]);
      }
    }
  });
});

/** Every key at every depth of a plain value. */
function allKeys(value: unknown, out: string[] = []): string[] {
  if (typeof value === "object" && value !== null) {
    for (const [key, child] of Object.entries(value)) {
      out.push(key);
      allKeys(child, out);
    }
  }
  return out;
}

// RECORDED MUTATION for "U3": remove the maximum clamp (`Math.min(range.max, ...)` dropped from
// `clampTo`). Expected failure: a resize far above the range is stored as asked.
// OBSERVED AT d19c84a6c455029a7ec4bdca077ac1e9295f8b8a: FAILED -- "resize(layers) clamps below the minimum, above the maximum, and keeps an
// in-range value" and its inspector and activity twins: AssertionError: expected 980 to be 480 (layers;
// 1060 to be 560 for the inspector) // Object.is equality. Reverted after observing.
describe("U3: resize clamps to the declared range, and the state has no map key", () => {
  it.each(REGIONS)("resize(%s) clamps below the minimum, above the maximum, and keeps an in-range value", (region) => {
    const range = sizeRangeOf(region);
    const extent = (state: LayoutState): number =>
      region === "activity" ? state.activity.height : state[region].width;
    const start = initialLayoutState();
    expect(extent(layoutReducer(start, { kind: "resize", region, px: range.min - 500 }))).toBe(range.min);
    expect(extent(layoutReducer(start, { kind: "resize", region, px: range.max + 500 }))).toBe(range.max);
    expect(extent(layoutReducer(start, { kind: "resize", region, px: range.max + 1 }))).toBe(range.max);
    const inside = Math.round((range.min + range.max) / 2);
    expect(extent(layoutReducer(start, { kind: "resize", region, px: inside }))).toBe(inside);
  });

  it("a non-finite extent changes nothing", () => {
    const start = initialLayoutState();
    for (const px of [Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(layoutReducer(start, { kind: "resize", region: "layers", px })).toBe(start);
    }
  });

  it("no key at any depth of any reachable state names the map", () => {
    const random = seededRandom(0xabc);
    let state = initialLayoutState();
    const keys = new Set(allKeys(state));
    for (let step = 0; step < 200; step += 1) {
      state = layoutReducer(state, randomAction(random));
      for (const key of allKeys(state)) keys.add(key);
    }
    expect([...keys].filter((key) => /map/i.test(key))).toEqual([]);
  });
});
