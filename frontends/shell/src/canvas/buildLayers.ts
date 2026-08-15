import { COORDINATE_SYSTEM, Position } from "@deck.gl/core";
import { SolidPolygonLayer } from "@deck.gl/layers";

import type { DrawParameters } from "../../../../renderer/style-ts/src/style";
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
 * The subset of a resolved style's draw parameters this fill-only layer actually consumes, already
 * mapped onto deck.gl's own accessor convention (NEXT-CUT.md P2; ADR-022 point 4: "frontends supply
 * rendering plumbing only ... mapping resolved draw parameters onto deck.gl layer props is client
 * work"). `fillColor` is 0-255 RGBA -- `@deck.gl/layers/solid-polygon-layer`'s own `DEFAULT_COLOR`
 * convention for `getFillColor` -- never the style document's own units (`#rrggbb` + a separate
 * `0..1` opacity). Style v0 is literal-only (ADR-023: `viewport_query` carries no attributes, so
 * there is no per-feature value to accessor over), so this is exactly ONE colour for a whole style,
 * not a per-feature table -- a plain array, deck.gl's own "constant attribute" shape, is what this
 * type carries and what `buildLayers` below passes straight through unchanged. */
export interface ResolvedDrawParams {
  fillColor: [number, number, number, number];
}

const HEX_TRIPLET_RE = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/;

/**
 * `renderer/style-ts/src/style.ts`'s resolved `DrawParameters` (a `#rrggbb` literal plus a separate
 * `0..1` opacity -- the style document's own units) -> `ResolvedDrawParams` (deck.gl's 0-255 RGBA
 * accessor convention). This is the ONE conversion function in this tree that performs that mapping
 * -- "rendering plumbing," per ADR-022 point 4, not a second implementation of style semantics (it
 * never parses or resolves a style document; it only reshapes an already-resolved value for one
 * particular renderer's prop convention). The hex triplet is trusted well-formed on entry
 * (`frontends/shell/src/style/document.ts`'s producer is structurally incapable of a malformed one,
 * and this function is the shell's own bridge, never fed a bundle-viewer-sourced string) -- a
 * defensive `0` fallback per channel guards a match failure rather than throwing mid-render, since a
 * render path's own declared recovery policy (ADR-010 rule 7) is never "throw from inside a style
 * conversion nobody asked to validate."
 */
export function toResolvedDrawParams(draw: DrawParameters): ResolvedDrawParams {
  const m = HEX_TRIPLET_RE.exec(draw.fillColor.toLowerCase());
  const channel = (hex: string | undefined): number => (hex ? parseInt(hex, 16) : 0);
  const alpha = Math.round(Math.min(1, Math.max(0, draw.fillOpacity)) * 255);
  return { fillColor: [channel(m?.[1]), channel(m?.[2]), channel(m?.[3]), alpha] };
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
 * Fill-only avoids that indirection entirely; the style panel's outline controls are P5 (droppable,
 * NEXT-CUT.md), a separate non-pickable `PathLayer` for exactly this reason -- not this layer.
 *
 * **`draw.fillColor` is used as-is, never re-derived per batch or per call** (NEXT-CUT.md binding
 * note 7: "give the colour arrays stable identity per style"). The caller (`WorkingCanvas.tsx`)
 * recomputes it once per style *change* (a ref, refreshed only by its own `useEffect([style])`), so
 * every render between two style changes passes the exact same array reference through to every
 * batch's `getFillColor` here.
 *
 * **On whether that stability is actually load-bearing for deck.gl's own prop diff -- read, not
 * assumed (installed `@deck.gl/core@9.3.7`).** `getFillColor`'s prop type is `accessor`
 * (`@deck.gl/layers/solid-polygon-layer/solid-polygon-layer.js`: `getFillColor: { type: 'accessor',
 * value: DEFAULT_COLOR }`), and the `accessor` type's `equal` (`@deck.gl/core/dist/lifecycle/
 * prop-types.js`) is `typeof value2 === 'function' ? true : deepEqual(value1, value2, 1)` for a
 * constant (non-function) value -- a **value** comparison, not a reference one, so a *freshly
 * allocated* array with the same four numbers would already read as unchanged at `compareProps`
 * (`@deck.gl/core/dist/lifecycle/props.js`). Reference stability is therefore not what prevents this
 * one prop from being flagged "changed". It is, however, still what this module relies on for a
 * different reason: `data` (the polygon coordinates below) is a brand-new array on **every** call to
 * this function already (nothing here caches `polygons` by batch identity), and `diffDataProps`
 * (same file) compares `data` by reference alone -- so `dataChanged` is already true on every
 * `render()`, style change or not, which per that file's own comment ("if data has changed, all
 * attributes will need regeneration, so skip [update-trigger] step") means the fine-grained
 * update-trigger path is bypassed on every render regardless of what this function does with colour.
 * What "regenerating" a *constant* colour attribute costs, even then, is `Attribute.setConstantValue`
 * (`@deck.gl/core/dist/lib/attribute/attribute.js`) -- an O(1) value comparison
 * (`_hasConstantBufferValue`) that skips the redundant upload when the constant already matches, not
 * a per-vertex walk. So the measured floor here is: passing a value-equal fresh array would already
 * cost nothing extra per feature; keeping ONE stable reference per style additionally skips even
 * that O(1) constant re-check on every one of the (already data-changed) renders between style
 * changes, and costs nothing to provide. Both are true; this function takes the second, strictly
 * cheaper property because `WorkingCanvas.tsx` can provide it for free, not because the first
 * property would have been insufficient.
 */
export function buildLayers(
  batches: readonly ResidentBatch[],
  frame: OffsetFrame,
  draw: ResolvedDrawParams
): SolidPolygonLayer[] {
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
      getFillColor: draw.fillColor,
    });
  });
}
