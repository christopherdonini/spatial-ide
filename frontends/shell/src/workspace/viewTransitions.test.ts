// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it } from "vitest";

import { FILTER_DIALECT_DUCKDB_EXPR_0 } from "../skp/types";
import { DEFAULT_STYLE_STATE, type StyleState } from "../style/document";
import { applyViewTransition, styleTransitions, type ViewTransition } from "./viewTransitions";
import type { ViewState } from "./workspaceState";

/** SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md section 4, UA4: the typed transitions of a view, phase A. */
const view: ViewState = { id: "view-1", resource: "ds_a", filter: null, style: DEFAULT_STYLE_STATE };
const deepFreeze = <T extends object>(value: T): T => {
  for (const inner of Object.values(value)) if (typeof inner === "object" && inner !== null) deepFreeze(inner);
  return Object.freeze(value);
};
const edited: StyleState = { fillColor: "#112233", fillOpacity: 0.5, outlineColor: "#ffffff", outlineWidth: 4 };

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

  it("the union is exactly the two phase A names (phase B adds the rest of the section's names with their state)", () => {
    const names: Record<ViewTransition["action"], true> = { "filter.apply": true, "style.set": true };
    expect(Object.keys(names).sort()).toEqual(["filter.apply", "style.set"]);
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
