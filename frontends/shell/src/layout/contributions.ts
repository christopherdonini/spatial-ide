// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import type { ReactNode } from "react";

/**
 * Registered contributions (SHELL-MIGRATION-MILESTONE-1-PREREGISTRATION.md §2.3 (b), plan seam 7):
 * static typed lists, no loader and no plugin mechanism. `SlotId` is derived from them, so
 * `App.tsx`'s `slots: Record<SlotId, ReactNode>` makes a missing slot a `tsc` error.
 *
 * The labels of REGIONS, INSPECTOR_TABS, LAYER_SECTIONS and ACTIVITY_TABS are the eleven headings the
 * human sighted (question round 66, item 4): Layers, Map, Inspector, Layer, Style, Source, Filter,
 * Export, Activity, Console, Notices.
 */

/** The regions the layout names. The map is a region and has a slot, but no toggle (§2.1: it cannot
 * be closed). */
export const REGIONS = [
  { id: "layers", label: "Layers" },
  { id: "map", label: "Map" },
  { id: "inspector", label: "Inspector" },
  { id: "activity", label: "Activity" },
] as const;

export const INSPECTOR_TABS = [
  { id: "layer", label: "Layer" },
  { id: "style", label: "Style" },
] as const;

/** `headingOwner: "layout"` sections get a layout-owned heading button with `aria-expanded`;
 * `"panel"` is Export, whose heading is `PublishPanel`'s own disclosure (§2.1). */
export const LAYER_SECTIONS = [
  { id: "source", label: "Source", headingOwner: "layout" },
  { id: "filter", label: "Filter", headingOwner: "layout" },
  { id: "export", label: "Export", headingOwner: "panel" },
] as const;

export const ACTIVITY_TABS = [
  { id: "console", label: "Console" },
  { id: "notices", label: "Notices" },
] as const;

/** In §2.5 order. */
export const ATTENTION_ITEMS = [{ id: "sessionEnded" }, { id: "canvasRefusal" }, { id: "viewportRefusal" }] as const;

/** In §2.5 order. */
export const STATUS_ITEMS = [
  { id: "residency" },
  { id: "scanLiveness" },
  { id: "scanIncomplete" },
  { id: "sourceWatch" },
] as const;

export type RegionId = (typeof REGIONS)[number]["id"];
export type InspectorTabId = (typeof INSPECTOR_TABS)[number]["id"];
export type LayerSectionId = (typeof LAYER_SECTIONS)[number]["id"];
/** The sections whose heading the layout owns: exactly the keys of `LayoutState["sections"]`. */
export type LayoutOwnedSectionId = Extract<(typeof LAYER_SECTIONS)[number], { headingOwner: "layout" }>["id"];
export type ActivityTabId = (typeof ACTIVITY_TABS)[number]["id"];
export type AttentionItemId = (typeof ATTENTION_ITEMS)[number]["id"];
export type StatusItemId = (typeof STATUS_ITEMS)[number]["id"];

/** Every place the layout accepts content from `App.tsx`. The Layers and Map regions take one node
 * each; the Inspector's Layer tab takes one per section and its Style tab one; the Activity region
 * one per tab; the attention strip and the status bar one per item. */
export type SlotId =
  | `region.${Exclude<RegionId, "inspector" | "activity">}`
  | `section.${LayerSectionId}`
  | `inspector.${Exclude<InspectorTabId, "layer">}`
  | `activity.${ActivityTabId}`
  | `attention.${AttentionItemId}`
  | `status.${StatusItemId}`;

export type Slots = Record<SlotId, ReactNode>;

/** The attention items' slot ids, in order -- the strip is empty exactly when none has content. */
export const ATTENTION_SLOT_IDS: readonly SlotId[] = ATTENTION_ITEMS.map((item) => `attention.${item.id}` as const);
/** The status bar's slot ids, in order. */
export const STATUS_SLOT_IDS: readonly SlotId[] = STATUS_ITEMS.map((item) => `status.${item.id}` as const);
