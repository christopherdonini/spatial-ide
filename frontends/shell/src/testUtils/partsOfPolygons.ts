// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import type { Part, ResidentBatch } from "../canvas/decodeBatch";

/**
 * Hand-built `ResidentBatch` geometry for the canvas tests. `partsOfFeatures(features)` takes
 * `features[row][part]` as that row's parts, and derives `partToRow` and `partCount` from the same
 * pass, the way `decodeBatch` builds them, so a test cannot desync them by hand.
 *
 * `partsOfPolygons(polygons)` is the Polygon case: `polygons[row]` is that row's rings, read as ONE
 * part (how `decodeBatch` reads a Polygon row), and a `null` is a null geometry, which has no part
 * at all.
 */
export function partsOfFeatures(
  features: Array<Part[]>
): Pick<ResidentBatch, "parts" | "partToRow" | "partCount"> {
  const partRows: number[] = [];
  features.forEach((featureParts, row) => {
    for (let p = 0; p < featureParts.length; p++) {
      partRows.push(row);
    }
  });
  return { parts: features, partToRow: Int32Array.from(partRows), partCount: partRows.length };
}

export function partsOfPolygons(
  polygons: Array<Part | null>
): Pick<ResidentBatch, "parts" | "partToRow" | "partCount"> {
  return partsOfFeatures(polygons.map((rings) => (rings === null ? [] : [rings])));
}
