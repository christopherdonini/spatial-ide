// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/** Authoritative f64 bounding box in the dataset's own CRS. */
export interface AuthoritativeBbox {
  xmin: number;
  ymin: number;
  xmax: number;
  ymax: number;
}

export interface ViewportBboxInput {
  /** The view target, in the *local* offset frame (deck.gl's own `viewState.target`). */
  targetX: number;
  targetY: number;
  /** deck.gl `OrthographicView` zoom: one world unit is `2^zoom` device pixels. */
  zoom: number;
  widthPx: number;
  heightPx: number;
  /** The current frame origin -- adding it back is what turns a local target into an authoritative
   * coordinate (ADR-010 rule 1: a local-frame value never crosses a boundary untagged). */
  originX: number;
  originY: number;
}

/**
 * The authoritative-CRS bounding box the current view actually shows. Used to drive
 * `viewport_query` on pan/zoom (NEXT-CUT.md item 3) -- computed independently of deck.gl's own
 * viewport object so this stays a plain, testable function.
 */
export function computeAuthoritativeViewportBbox(input: ViewportBboxInput): AuthoritativeBbox {
  const pixelsPerMetre = Math.pow(2, input.zoom);
  const halfWidthM = input.widthPx / 2 / pixelsPerMetre;
  const halfHeightM = input.heightPx / 2 / pixelsPerMetre;
  const worldX = input.targetX + input.originX;
  const worldY = input.targetY + input.originY;
  return {
    xmin: worldX - halfWidthM,
    ymin: worldY - halfHeightM,
    xmax: worldX + halfWidthM,
    ymax: worldY + halfHeightM,
  };
}
