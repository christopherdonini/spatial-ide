// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * The declared values of the Map Studio frame (frontends/shell/SHELL-MIGRATION-MILESTONE-1-
 * PREREGISTRATION.md §7), each with the quantity it bounds (ADR-010 rule 6). Declared, not measured:
 * nothing here is a performance figure. CSS pixels throughout.
 */

/** Bounds the map region's minimum CSS size at every viewport at or above `VIEWPORT_FLOOR`. */
export const MAP_MIN_WIDTH_PX = 480;
export const MAP_MIN_HEIGHT_PX = 320;

/** Bounds the smallest viewport the map minimum is proved for: its reader is the unit test U1
 * (`layoutState.test.ts`), which checks the minimum at and above it. Below it the map takes what
 * remains and nothing is claimed. */
export const VIEWPORT_FLOOR = { width: 1024, height: 640 } as const;

/** A resizable extent: its first-layout default and the range `resize` clamps to. */
export interface SizeRange {
  readonly default: number;
  readonly min: number;
  readonly max: number;
}

/** Bounds the Layers column's width. */
export const LAYERS_WIDTH_PX: SizeRange = { default: 260, min: 200, max: 480 };
/** Bounds the Inspector column's width. */
export const INSPECTOR_WIDTH_PX: SizeRange = { default: 340, min: 280, max: 560 };
/** Bounds the Activity row's height. */
export const ACTIVITY_HEIGHT_PX: SizeRange = { default: 200, min: 120, max: 480 };

/** Bounds the top bar's height. */
export const TOP_BAR_HEIGHT_PX = 40;
/** Bounds the status bar's height: two lines, then it scrolls inside. */
export const STATUS_BAR_MAX_HEIGHT_PX = 48;
/** Bounds the attention strip's height: then its content scrolls inside. It has no height when empty. */
export const ATTENTION_MAX_HEIGHT_PX = 128;
/** Bounds each splitter's thickness. */
export const SPLITTER_PX = 6;
/** Bounds one arrow-key resize step. */
export const RESIZE_STEP_PX = 16;
