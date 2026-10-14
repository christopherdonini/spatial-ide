// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it } from "vitest";

import { FILTER_DIALECT_DUCKDB_EXPR_0 } from "../skp/types";
import { DEFAULT_STYLE_STATE, type StyleState } from "../style/document";
import {
  applyViewTransition,
  styleTransitions,
  viewInspected,
  viewPinned,
  viewSelectionMode,
  viewTool,
  type ViewTransition,
} from "./viewTransitions";
import type { ViewState } from "./workspaceState";

/** SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md section 4, UA4: the typed transitions of a view, phase A. */
const view: ViewState = { id: "view-1", resource: "ds_a", filter: null, style: DEFAULT_STYLE_STATE };
const deepFreeze = <T extends object>(value: T): T => {
  for (const inner of Object.values(value)) if (typeof inner === "object" && inner !== null) deepFreeze(inner);
  return Object.freeze(value);
};
const edited: StyleState = { fillColor: "#112233", fillOpacity: 0.5, outlineColor: "#ffffff", outlineWidth: 4 };
const box = (xmin: number, ymin: number, xmax: number, ymax: number) => ({ xmin, ymin, xmax, ymax });
const pickOf = (id: bigint) => ({ streamHandle: "stream-1", batchSeq: 0, id, anchor: [0, 0] as [number, number] });

// RECORDED MUTATION for "UA4": make `styleTransitions` (viewTransitions.ts) return one transition for the whole edit
// (`return out.length > 1 ? out.slice(0, 1) : out;`). Expected failure: the count assertion, 4 transitions expected and 1 received.
// OBSERVED AT deab7dc96d06bf3e329527d3ae95415dcd65152b: FAILED -- "emits one style.set per changed property, none when nothing changed, and the width as {value, unit}":
//   AssertionError: expected [ 'fillColor' ] to deeply equal [ 'fillColor', 'fillOpacity', …(2) ]. Reverted after observing.
describe("UA4: transitions are pure and typed, and a style edit is one transition per changed property", () => {
  it("applies filter.apply and style.set without writing to a frozen view, returning a new one", () => {
    const frozen = deepFreeze(structuredClone(view));
    const filter = { predicate: "zone = 'residential'", dialect: FILTER_DIALECT_DUCKDB_EXPR_0 };
    const withFilter = applyViewTransition(frozen, { action: "filter.apply", params: { filter } });
    expect(withFilter).not.toBe(frozen);
    expect(withFilter.filter).toBe(filter);
    expect(frozen.filter).toBeNull();
    const withWidth = applyViewTransition(frozen, {
      action: "style.set",
      params: { property: "outlineWidth", value: { value: 6, unit: "px" } },
    });
    expect(withWidth.style.outlineWidth).toBe(6);
    expect(frozen.style).toEqual(DEFAULT_STYLE_STATE);
  });

  // RECORDED MUTATION for "UA4 (phase B: the union)": delete the `inspect.pin` case of `applyViewTransition` (viewTransitions.ts).
  // Expected failure: the sample for `inspect.pin` is not applied. (The table's completeness is tsc's.)
  // OBSERVED AT feaa43d329e6d900b6ae672547569f1b591e3052: FAILED -- "the union is exactly section 2.4's nine names, and every one of them is applied":
  //   AssertionError: inspect.pin is applied: expected undefined to be defined. Reverted after observing.
  it("the union is exactly section 2.4's nine names, and every one of them is applied", () => {
    // `satisfies` over the union's own names is what makes this table complete: tsc fails on a missing or an extra name.
    const samples = {
      "filter.apply": { action: "filter.apply", params: { filter: null } },
      "style.set": { action: "style.set", params: { property: "fillOpacity", value: 0.25 } },
      "tool.set": { action: "tool.set", params: { tool: "select" } },
      "mode.set": { action: "mode.set", params: { mode: "replace" } },
      "selection.apply": { action: "selection.apply", params: { mode: "add", id: 1n, bounds: box(0, 0, 1, 1) } },
      "selection.clear": { action: "selection.clear", params: {} },
      "selection.end": { action: "selection.end", params: { reason: "reopened", dropped: 1 } },
      "inspect.set": { action: "inspect.set", params: { pick: pickOf(1n), bounds: box(0, 0, 1, 1) } },
      "inspect.pin": { action: "inspect.pin", params: { pinned: true } },
    } satisfies { [A in ViewTransition["action"]]: Extract<ViewTransition, { action: A }> };
    expect(Object.keys(samples).sort()).toEqual([
      "filter.apply", "inspect.pin", "inspect.set", "mode.set", "selection.apply",
      "selection.clear", "selection.end", "style.set", "tool.set",
    ]);
    for (const transition of Object.values(samples)) {
      const next = applyViewTransition(view, transition);
      expect(next, `${transition.action} is applied`).toBeDefined();
      expect(next.id).toBe("view-1");
    }
  });

  it("emits one style.set per changed property, none when nothing changed, and the width as {value, unit}", () => {
    const changes = styleTransitions(DEFAULT_STYLE_STATE, edited);
    expect(changes.map((t) => t.params.property)).toEqual(["fillColor", "fillOpacity", "outlineColor", "outlineWidth"]);
    expect(changes.every((t) => t.action === "style.set")).toBe(true);
    expect(changes[3].params.value).toEqual({ value: 4, unit: "px" });
    expect(styleTransitions(edited, { ...edited, outlineColor: "#000000" })).toHaveLength(1);
    expect(styleTransitions(edited, edited)).toEqual([]);
  });

  it("applying a style edit's transitions in order yields the next style", () => {
    const result = styleTransitions(DEFAULT_STYLE_STATE, edited).reduce(applyViewTransition, view);
    expect(result.style).toEqual(edited);
  });
});

/** Tool, mode and inspection transitions (section 2.2, 2.4; Amendment 1 A5). Rows UB-TI1 and UB-TI2 are not in the form's
 * table: they cover the state the form's ViewState gains, each with its own mutation. */
describe("UB-TI1: tool.set and mode.set set their own member, and an equal setting returns the same view", () => {
  // RECORDED MUTATION for "UB-TI1": in `applyViewTransition`'s `tool.set` case (viewTransitions.ts) ignore the param (`return { ...view, tool: "navigate" };`).
  // Expected failure: the tool stays navigate.
  // OBSERVED AT feaa43d329e6d900b6ae672547569f1b591e3052: FAILED -- "sets the tool and the mode, each leaving the other alone":
  //   AssertionError: expected 'navigate' to be 'select' // Object.is equality. Reverted after observing.
  it("sets the tool and the mode, each leaving the other alone", () => {
    const selecting = applyViewTransition(view, { action: "tool.set", params: { tool: "select" } });
    expect(viewTool(selecting)).toBe("select");
    expect(viewSelectionMode(selecting)).toBe("toggle");
    const replacing = applyViewTransition(selecting, { action: "mode.set", params: { mode: "replace" } });
    expect(viewSelectionMode(replacing)).toBe("replace");
    expect(viewTool(replacing)).toBe("select");
    expect(applyViewTransition(replacing, { action: "mode.set", params: { mode: "replace" } })).toBe(replacing);
    expect(applyViewTransition(view, { action: "tool.set", params: { tool: "navigate" } }), "the default again").toBe(view);
  });
});

describe("UB-TI2: inspection and its pin", () => {
  // RECORDED MUTATION for "UB-TI2": in `applyViewTransition`'s `inspect.pin` case (viewTransitions.ts) pin without a standing feature (`const pinned = transition.params.pinned;`).
  // Expected failure: a view with nothing inspected is pinned.
  // OBSERVED AT feaa43d329e6d900b6ae672547569f1b591e3052: FAILED -- "stores the pick and its bounds, pins only a standing feature, and null clears and unpins":
  //   AssertionError: nothing to pin: expected true to be false // Object.is equality. Reverted after observing.
  it("stores the pick and its bounds, pins only a standing feature, and null clears and unpins", () => {
    const a = pickOf(7n);
    const inspected = applyViewTransition(view, { action: "inspect.set", params: { pick: a, bounds: box(0, 0, 2, 2) } });
    expect(viewInspected(inspected)).toEqual({ pick: a, bounds: box(0, 0, 2, 2) });
    expect(viewPinned(applyViewTransition(view, { action: "inspect.pin", params: { pinned: true } })), "nothing to pin").toBe(false);
    const pinned = applyViewTransition(inspected, { action: "inspect.pin", params: { pinned: true } });
    expect(viewPinned(pinned)).toBe(true);
    const unpinned = applyViewTransition(pinned, { action: "inspect.pin", params: { pinned: false } });
    expect(viewPinned(unpinned)).toBe(false);
    expect(viewInspected(unpinned), "unpinning leaves the inspected feature").toEqual(viewInspected(pinned));
    const cleared = applyViewTransition(pinned, { action: "inspect.set", params: null });
    expect(viewInspected(cleared)).toBeNull();
    expect(viewPinned(cleared)).toBe(false);
    expect(applyViewTransition(cleared, { action: "inspect.set", params: null }), "clearing nothing").toBe(cleared);
  });
});
