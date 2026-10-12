// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md section 2.4 (seam 3), phase A: the typed, pure
 * transitions of a view. A transition is an `{action, params}` object, the shape of ADR-036 section 6's
 * `intent` member (Proposed, so it binds nothing), applied by the pure `applyViewTransition`.
 *
 * Phase A carries the two transitions a view has state for, `filter.apply` and `style.set`. Phase B adds
 * the rest of the section's names (`tool.set`, `mode.set`, the `selection.*` and `inspect.*` ones) with the
 * state they act on. Keystrokes, hover, navigation and layout are not transitions. There is no log and no
 * undo (ADR-006; plan section 6.5): nothing here records a transition.
 */

import type { Filter } from "../skp/types";
import type { StyleState } from "../style/document";
import type { ViewState } from "./workspaceState";

export type FilterApplyTransition = { action: "filter.apply"; params: { filter: Filter | null } };

/** One transition per changed `StyleState` property. The style document carries `outline_width` as a bare number
 * (ADR-017 section 5a) and the shell draws it in pixels (`canvas/buildLayers.ts`), so the width is carried as
 * `{value, unit}`. */
export type StyleSetTransition =
  | { action: "style.set"; params: { property: "fillColor"; value: string } }
  | { action: "style.set"; params: { property: "fillOpacity"; value: number } }
  | { action: "style.set"; params: { property: "outlineColor"; value: string } }
  | { action: "style.set"; params: { property: "outlineWidth"; value: { value: number; unit: "px" } } };

export type ViewTransition = FilterApplyTransition | StyleSetTransition;

function applyStyleSet(style: StyleState, transition: StyleSetTransition): StyleState {
  const params = transition.params;
  switch (params.property) {
    case "fillColor":
      return { ...style, fillColor: params.value };
    case "fillOpacity":
      return { ...style, fillOpacity: params.value };
    case "outlineColor":
      return { ...style, outlineColor: params.value };
    case "outlineWidth":
      return { ...style, outlineWidth: params.value.value };
  }
}

/** Pure: returns a new view and never writes to its input (a frozen view is fine). */
export function applyViewTransition(view: ViewState, transition: ViewTransition): ViewState {
  switch (transition.action) {
    case "filter.apply":
      return { ...view, filter: transition.params.filter };
    case "style.set":
      return { ...view, style: applyStyleSet(view.style, transition) };
  }
}

/** The `style.set` transitions that turn `prev` into `next`: one per property that differs, none when equal.
 * `StylePanel` reports the whole next `StyleState`; this is where that becomes one transition per property. */
export function styleTransitions(prev: StyleState, next: StyleState): StyleSetTransition[] {
  const out: StyleSetTransition[] = [];
  if (prev.fillColor !== next.fillColor) {
    out.push({ action: "style.set", params: { property: "fillColor", value: next.fillColor } });
  }
  if (prev.fillOpacity !== next.fillOpacity) {
    out.push({ action: "style.set", params: { property: "fillOpacity", value: next.fillOpacity } });
  }
  if (prev.outlineColor !== next.outlineColor) {
    out.push({ action: "style.set", params: { property: "outlineColor", value: next.outlineColor } });
  }
  if (prev.outlineWidth !== next.outlineWidth) {
    out.push({
      action: "style.set",
      params: { property: "outlineWidth", value: { value: next.outlineWidth, unit: "px" } },
    });
  }
  return out;
}
