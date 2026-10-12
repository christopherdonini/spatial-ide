// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import type { ActivityTabId, InspectorTabId, LayoutOwnedSectionId } from "./contributions";
import {
  ACTIVITY_HEIGHT_PX,
  ATTENTION_MAX_HEIGHT_PX,
  INSPECTOR_WIDTH_PX,
  LAYERS_WIDTH_PX,
  MAP_MIN_HEIGHT_PX,
  MAP_MIN_WIDTH_PX,
  SPLITTER_PX,
  STATUS_BAR_MAX_HEIGHT_PX,
  TOP_BAR_HEIGHT_PX,
} from "./layoutConstants";
import type { SizeRange } from "./layoutConstants";

/**
 * The layout reducer (SHELL-MIGRATION-MILESTONE-1-PREREGISTRATION.md §2.3 (a), plan seam 9). Pure view
 * state for this session: it makes no SKP call, adds no history step and marks nothing unsaved (plan
 * §2 rule 10; the layout is not the workspace). It lives in a `useReducer` inside `StudioLayout`.
 *
 * **No field and no action names the map.** The map region cannot be closed, hidden, resized by an
 * action or keyed on anything here; `effectiveSizes` below is the one place the map's size is
 * derived, and only as what remains.
 */

/** The regions an action can toggle or resize. */
export type SideRegion = "layers" | "inspector" | "activity";

export interface LayoutState {
  readonly layers: { readonly open: boolean; readonly width: number };
  readonly inspector: { readonly open: boolean; readonly width: number; readonly tab: InspectorTabId };
  readonly activity: { readonly open: boolean; readonly height: number; readonly tab: ActivityTabId };
  readonly sections: Readonly<Record<LayoutOwnedSectionId, boolean>>;
}

export type LayoutAction =
  | { readonly kind: "toggle"; readonly region: SideRegion }
  | { readonly kind: "selectTab"; readonly region: "inspector"; readonly tab: InspectorTabId }
  | { readonly kind: "selectTab"; readonly region: "activity"; readonly tab: ActivityTabId }
  | { readonly kind: "toggleSection"; readonly section: LayoutOwnedSectionId }
  | { readonly kind: "resize"; readonly region: SideRegion; readonly px: number };

/** The first layout of a session (§7 "Defaults"): Layers open; Inspector open on Layer with Source and
 * Filter open (Export is closed by its own panel); Activity closed on Console. */
export function initialLayoutState(): LayoutState {
  return {
    layers: { open: true, width: LAYERS_WIDTH_PX.default },
    inspector: { open: true, width: INSPECTOR_WIDTH_PX.default, tab: "layer" },
    activity: { open: false, height: ACTIVITY_HEIGHT_PX.default, tab: "console" },
    sections: { source: true, filter: true },
  };
}

/** The declared range a region's extent is clamped to: width for Layers and Inspector, height for
 * Activity. */
export function sizeRangeOf(region: SideRegion): SizeRange {
  if (region === "layers") return LAYERS_WIDTH_PX;
  if (region === "inspector") return INSPECTOR_WIDTH_PX;
  return ACTIVITY_HEIGHT_PX;
}

function clampTo(range: SizeRange, px: number): number {
  return Math.min(range.max, Math.max(range.min, Math.round(px)));
}

export function layoutReducer(state: LayoutState, action: LayoutAction): LayoutState {
  switch (action.kind) {
    case "toggle":
      if (action.region === "layers") return { ...state, layers: { ...state.layers, open: !state.layers.open } };
      if (action.region === "inspector") {
        return { ...state, inspector: { ...state.inspector, open: !state.inspector.open } };
      }
      return { ...state, activity: { ...state.activity, open: !state.activity.open } };
    case "selectTab":
      if (action.region === "inspector") return { ...state, inspector: { ...state.inspector, tab: action.tab } };
      return { ...state, activity: { ...state.activity, tab: action.tab } };
    case "toggleSection":
      return { ...state, sections: { ...state.sections, [action.section]: !state.sections[action.section] } };
    case "resize": {
      // A non-finite extent (a pointer event with no coordinates) changes nothing.
      if (!Number.isFinite(action.px)) return state;
      const px = clampTo(sizeRangeOf(action.region), action.px);
      if (action.region === "layers") return { ...state, layers: { ...state.layers, width: px } };
      if (action.region === "inspector") return { ...state, inspector: { ...state.inspector, width: px } };
      return { ...state, activity: { ...state.activity, height: px } };
    }
  }
}

export interface Viewport {
  readonly width: number;
  readonly height: number;
}

/** What the grid is given: the side regions' extents after fitting (0 for a closed region), and the
 * map's size as what remains in the worst case (attention strip and status bar at their caps). */
export interface EffectiveSizes {
  readonly layersWidth: number;
  readonly inspectorWidth: number;
  readonly activityHeight: number;
  readonly mapWidth: number;
  readonly mapHeight: number;
}

/**
 * The fit function. At every viewport at or above `VIEWPORT_FLOOR` the map keeps `MAP_MIN_WIDTH_PX` x
 * `MAP_MIN_HEIGHT_PX`, however the state was reached and with the attention strip and status bar at
 * their caps:
 * - the open side columns give up width in proportion to the slack each has above its own minimum, so
 *   a region already at its minimum gives up nothing until the other has none left; each cut is
 *   rounded up, so the fit never under-shrinks;
 * - Activity then takes only the height left above the map's minimum height (it may end up below its
 *   own declared minimum: the declared range bounds what a user can ask for, not what fits).
 *
 * Below the floor the map takes what remains and nothing is claimed.
 */
export function effectiveSizes(state: LayoutState, viewport: Viewport): EffectiveSizes {
  const layersOpen = state.layers.open;
  const inspectorOpen = state.inspector.open;
  const splitters = (layersOpen ? SPLITTER_PX : 0) + (inspectorOpen ? SPLITTER_PX : 0);
  let layersWidth = layersOpen ? state.layers.width : 0;
  let inspectorWidth = inspectorOpen ? state.inspector.width : 0;

  const excess = layersWidth + inspectorWidth - (viewport.width - MAP_MIN_WIDTH_PX - splitters);
  if (excess > 0) {
    const layersSlack = layersOpen ? layersWidth - LAYERS_WIDTH_PX.min : 0;
    const inspectorSlack = inspectorOpen ? inspectorWidth - INSPECTOR_WIDTH_PX.min : 0;
    const slack = layersSlack + inspectorSlack;
    if (slack > 0) {
      const take = Math.min(excess, slack);
      layersWidth -= Math.min(layersSlack, Math.ceil((take * layersSlack) / slack));
      inspectorWidth -= Math.min(inspectorSlack, Math.ceil((take * inspectorSlack) / slack));
    }
  }

  const chrome = TOP_BAR_HEIGHT_PX + STATUS_BAR_MAX_HEIGHT_PX + ATTENTION_MAX_HEIGHT_PX;
  const activityOpen = state.activity.open;
  const room = viewport.height - chrome - MAP_MIN_HEIGHT_PX - SPLITTER_PX;
  const activityHeight = activityOpen ? Math.max(0, Math.min(state.activity.height, room)) : 0;

  return {
    layersWidth,
    inspectorWidth,
    activityHeight,
    mapWidth: viewport.width - layersWidth - inspectorWidth - splitters,
    mapHeight: viewport.height - chrome - (activityOpen ? activityHeight + SPLITTER_PX : 0),
  };
}
