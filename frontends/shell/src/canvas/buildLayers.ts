import { COORDINATE_SYSTEM, Position } from "@deck.gl/core";
import { SolidPolygonLayer } from "@deck.gl/layers";

import type { ResidentBatch } from "./decodeBatch";
import { checkPickCeiling } from "./limits";
import type { OffsetFrame } from "./offsetFrame";

/** `layerId -> batch`, never index-range arithmetic -- the other half of the declared sharding
 * strategy (ADR-010 rule 6): reassembling a pick across layers looks up the batch a layer id names. */
export function layerId(batch: Pick<ResidentBatch, "streamHandle" | "batchSeq">): string {
  return `${batch.streamHandle}:${batch.batchSeq}`;
}

export function batchForLayerId(
  batches: readonly ResidentBatch[],
  id: string
): ResidentBatch | undefined {
  return batches.find((b) => layerId(b) === id);
}

/**
 * One deck.gl layer per resident batch. **Never one layer for everything** -- a batch's own
 * feature count is what the 24-bit pick ceiling (ADR-010 rule 6) is checked against, and a batch is
 * bounded by the data plane's frame-size ceiling, so per-layer counts sit orders of magnitude below
 * 16,777,215 by construction.
 *
 * Coordinates cross into `getPolygon` **already offset-relative** (`frame.toLocal`, an f64
 * subtraction): deck.gl's own attribute-buffer construction is what narrows them to f32 afterward,
 * and doing the subtraction here, in f64, before that narrowing, is ADR-010 rule 3 in its entirety.
 * `frame.toLocal` is called fresh for every render, so a `maybeRecenter` is picked up automatically
 * without this function needing to know whether the origin just moved.
 *
 * **`SolidPolygonLayer`, not the composite `PolygonLayer`, and deliberately so.** `PolygonLayer`
 * draws its outline via an internal `PathLayer` sub-layer, and a pick against that sub-layer
 * reports `info.layer.id` as the *sub*-layer's id (composite-id-suffixed), not this batch's own
 * `layerId(batch)` -- `batchForLayerId`'s exact-match lookup would silently fail to resolve it.
 * Fill-only avoids that indirection entirely; cut 1 declares one fixed default style and an outline
 * is not required by it.
 */
export function buildLayers(batches: readonly ResidentBatch[], frame: OffsetFrame): SolidPolygonLayer[] {
  return batches.map((batch) => {
    checkPickCeiling(batch.ids.length);
    // Nested `[x,y]` pairs per ring, deliberately not a flat `[x,y,x,y,...]` array: deck.gl's own
    // polygon normalizer (`@deck.gl/layers/solid-polygon-layer/polygon.js`) distinguishes a
    // "complex polygon" (multiple rings, i.e. holes) from a "simple flat" one by checking whether
    // `polygon[0][0]` is itself a finite number -- a flat ring would satisfy that check and get
    // silently misread as one ring's flat vertex list, dropping every hole. Verified against the
    // installed deck.gl 9.3.7 source rather than assumed.
    const polygons: Position[][][] = batch.rings.map((rings) =>
      rings.map((ring) => ring.map(([x, y]) => frame.toLocal(x, y) as Position))
    );
    return new SolidPolygonLayer<Position[][]>({
      id: layerId(batch),
      data: polygons,
      getPolygon: (d) => d,
      coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
      pickable: true,
      filled: true,
      getFillColor: [66, 133, 244, 180],
    });
  });
}
