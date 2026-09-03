// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import type { ResidentBatch } from "./decodeBatch";

/**
 * Viewport-residency cut P6a, decision 24(c): sub-pixel pick refusal by name (ADR-028 item 4, ADR-010
 * rule 6 discipline -- "declared, not discovered"). At extreme zoom-out a single on-screen pixel can
 * cover many resident features; `resolvePick` (`pick.ts`) always returns SOME feature under a raw GPU
 * pick ordinal, but which one is arbitrary once features are smaller than a pixel -- a
 * plausible-but-arbitrary answer, not an honest one. This module names the threshold and the pure
 * comparison; `WorkingCanvas.tsx`'s shared hover site (the same accessor `render()` uses, Defect B)
 * is the one caller, for both arms alike -- the check needs only the batches already resident and the
 * current zoom, neither of which is arm-specific.
 *
 * **The threshold, declared:** `SUB_PIXEL_PICK_REFUSAL_THRESHOLD_PX` below. Below one CSS pixel a
 * feature's own on-screen footprint is smaller than the thing a pointer can aim at; this module uses
 * twice that (2px) as the declared refusal line so the refusal fires slightly before a feature is
 * *literally* invisible, not only once it already is -- a single round number, not a measured or
 * fitted constant (rule 6: state it as the declared choice it is).
 *
 * **The mechanic, kept simple and honest:** rather than sizing every individual feature under the
 * cursor (expensive, and picking already resolved to exactly one candidate feature by then), this
 * compares the AVERAGE resident feature's own on-screen extent at the current zoom against the
 * threshold -- "average feature's on-screen extent at the current zoom, computed from resident data"
 * is the whole rule. When the average is below the line, individual features are, on the whole, too
 * small for a single pick to mean anything at this zoom; when it is above, an individual pick is
 * treated as meaningful exactly as it always has been. This is a coarser signal than a per-feature
 * check would be (a handful of oversized features could pull the average up even in a genuinely dense
 * area, or vice versa) -- an honest simplification, not a precise one, consistent with "keep the
 * mechanic simple."
 *
 * **Declared limitation (architect re-verification, viewport-residency cut P6b, item 6b).** This
 * threshold is style-independent: `averageFeatureExtent` measures each feature's own GEOMETRIC
 * extent (the rings `decodeBatch` carries), never a style-resolved on-screen symbol size, while
 * ADR-022 (style v0 as the project's single style model) lets a resolved point/symbol radius vary
 * independently of the geometry underneath it -- a tiny point rendered with a large circle symbol
 * can be genuinely pickable well past this threshold, and a large polygon styled with a hairline
 * stroke may not be. Rule 6's own framing applies to the gap itself, not only the number: a
 * style-dependent threshold (folding the resolved symbol/stroke size into the on-screen extent this
 * module compares) is future work, owed once pick discrimination becomes style-aware -- not
 * attempted here.
 */
export const SUB_PIXEL_PICK_REFUSAL_THRESHOLD_PX = 2;

/**
 * The average resident feature's own bounding-box extent (the larger of its width/height, across
 * every ring/hole a feature carries), in the dataset's own CRS units -- `0` when `batches` carries no
 * feature with any real geometry at all (nothing to average). Pure and O(total vertices), the same
 * order of work `buildLayers` already does over the same batches each render -- computed once per
 * render (`WorkingCanvas.tsx`'s own `averageFeatureExtentRef`), never per hover event.
 */
export function averageFeatureExtent(batches: readonly Pick<ResidentBatch, "rings">[]): number {
  let sumExtent = 0;
  let count = 0;
  for (const batch of batches) {
    for (const featureRings of batch.rings) {
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;
      let sawVertex = false;
      for (const ring of featureRings) {
        for (const [x, y] of ring) {
          sawVertex = true;
          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
        }
      }
      if (!sawVertex) continue;
      sumExtent += Math.max(maxX - minX, maxY - minY);
      count++;
    }
  }
  return count > 0 ? sumExtent / count : 0;
}

/**
 * The pure threshold comparison -- `averageFeatureExtentWorldUnits` (`averageFeatureExtent` above)
 * times `pixelsPerWorldUnit` (`WorkingCanvas.tsx`'s own `pixelsPerWorldUnitAtZoom`, evaluated at the
 * CURRENT zoom) is the average feature's own on-screen size in CSS pixels; below the declared
 * threshold, a single pick is refused by name rather than answered.
 */
export function isBelowPickResolution(averageFeatureExtentWorldUnits: number, pixelsPerWorldUnit: number): boolean {
  return averageFeatureExtentWorldUnits * pixelsPerWorldUnit < SUB_PIXEL_PICK_REFUSAL_THRESHOLD_PX;
}
