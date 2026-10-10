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
  /** deck.gl `OrthographicView` zoom: one world unit is `2^zoom` **CSS** pixels -- the same units as
   * `clientWidth`/`clientHeight` feed `widthPx`/`heightPx` below, not device (DPR-scaled) pixels.
   * Corrected from "device pixels" per DECISIONS-PENDING entry 95 (PAN-ANCHOR-PREREGISTRATION.md
   * §5.2): the contradiction with `WorkingCanvas.tsx`'s `pixelsPerWorldUnitAtZoom` was resolved in
   * favour of CSS, measured -- at the host's DPR 1.0 the canvas client box, drawing buffer and deck's
   * own logical viewport all coincide (buffer/CSS ratio 1.000), and the bbox math is self-consistent
   * with the CSS reading. */
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

/** The view inputs the canvas last wrote -- everything `ViewportBboxInput` carries except the size. */
export type ViewportCamera = Omit<ViewportBboxInput, "widthPx" | "heightPx">;

/**
 * What a change of the canvas's CSS size asks of the viewport query. `none`: nothing is known to
 * compare against (no camera, no reported view) or the size is unusable. `within`: the new view
 * lies inside the area last asked for, so no query is due -- the caller only learns the box the map
 * now shows. `query`: the new view reaches past the area last asked for.
 */
type ResizeViewport =
  | { kind: "none" }
  | { kind: "within"; bbox: AuthoritativeBbox }
  | { kind: "query"; bbox: AuthoritativeBbox };

/** Closed containment: equal edges count as inside. */
function boxInside(inner: AuthoritativeBbox, outer: AuthoritativeBbox): boolean {
  return inner.xmin >= outer.xmin && inner.ymin >= outer.ymin && inner.xmax <= outer.xmax && inner.ymax <= outer.ymax;
}

export function viewportAfterResize(
  camera: ViewportCamera | null,
  lastQueried: AuthoritativeBbox | null,
  widthPx: number,
  heightPx: number
): ResizeViewport {
  if (camera === null || lastQueried === null) return { kind: "none" };
  if (!(Number.isFinite(widthPx) && widthPx > 0 && Number.isFinite(heightPx) && heightPx > 0)) return { kind: "none" };
  const bbox = computeAuthoritativeViewportBbox({ ...camera, widthPx, heightPx });
  return { kind: boxInside(bbox, lastQueried) ? "within" : "query", bbox };
}
