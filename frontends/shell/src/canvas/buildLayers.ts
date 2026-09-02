// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { COORDINATE_SYSTEM, Position } from "@deck.gl/core";
import { PathLayer, SolidPolygonLayer } from "@deck.gl/layers";

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
  /** RGBA, alpha always 255 -- style v0 (ADR-017 §5a) has no separate outline-opacity field, only
   * `fill_opacity`; an outline is drawn fully opaque or not at all (`outlineWidth === 0`). */
  outlineColor: [number, number, number, number];
  /** CSS pixels (`renderer/src/style.rs`'s own `MAX_OUTLINE_WIDTH` doc comment: "Outline width
   * ceiling, in CSS pixels"). `0` means "no outline" -- `buildLayers` below only constructs the
   * outline `PathLayer` (NEXT-CUT.md P5) when this is `> 0`. */
  outlineWidth: number;
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
  const channel = (hex: string | undefined): number => (hex ? parseInt(hex, 16) : 0);
  const fillMatch = HEX_TRIPLET_RE.exec(draw.fillColor.toLowerCase());
  const alpha = Math.round(Math.min(1, Math.max(0, draw.fillOpacity)) * 255);
  const outlineMatch = HEX_TRIPLET_RE.exec(draw.outlineColor.toLowerCase());
  return {
    fillColor: [channel(fillMatch?.[1]), channel(fillMatch?.[2]), channel(fillMatch?.[3]), alpha],
    outlineColor: [channel(outlineMatch?.[1]), channel(outlineMatch?.[2]), channel(outlineMatch?.[3]), 255],
    outlineWidth: draw.outlineWidth,
  };
}

/**
 * Per-batch offset-relative geometry, cached by `ResidentBatch` object identity and the frame
 * origin it was last computed against -- **the viewport-residency cut P9 paint fix (Amendment
 * 23)**.
 *
 * **The diagnosed mechanism, with numbers** (instrumented dev-build candidate smoke/full-trace
 * runs against this piece's own `--fixture .../polygons-100k.parquet --tile-size fine`, this
 * piece's own report has the evidence-file names -- dev-build only, directional, never quoted as
 * a scored result per Amendment 23 point 2): the candidate arm keeps residency tile-keyed
 * (`TileResidentSet`), and at the fine tile size a single pan step leaves on the order of 120-170
 * small resident batches (observed `tilesRequested`: 119, 128, 142, 167 across four separate
 * pan-class steps), versus baseline's ~40 stream-keyed ones (`RESULTS.md` §11's high-water mark:
 * candidate 1,997,834 vertices spread thin across many small tiles vs. baseline's near-identical
 * total in ~40 batches). Every one of those batches went through `buildLayers` on EVERY coalesced
 * render -- including a render fired by a batch arriving for just ONE tile -- and this function
 * used to allocate a brand-new `polygons` array for EVERY batch on EVERY call, unconditionally.
 * The pre-fix cost this produced, sampled directly (per-render `frameTimeMs`, every render during
 * one such pan step, 113 samples): p50 712ms, p95 1042ms, max 1126ms. Per this file's own prior
 * investigation (still accurate for `getFillColor`, below) and confirmed again here by reading the
 * same installed `@deck.gl/core@9.3.9` source directly: `diffDataProps` (`lifecycle/props.js`)
 * compares `data` by REFERENCE ONLY (`props.data !== oldProps.data`, no `dataComparator` supplied
 * here), and `Layer.shouldUpdateState`/`updateState` (`lib/layer.js`) gate the ENTIRE attribute
 * invalidation/GPU-re-tessellation path on that one boolean folded into `propsOrDataChanged`
 * (`updateState`: `if (dataChanged && attributeManager) attributeManager.invalidateAll()`) -- so
 * a fresh array every render meant every layer's full geometry was re-tessellated and
 * re-uploaded on every render, hundreds of times per pan, regardless of whether that tile's own
 * content had changed at all. This is exactly what this file's own pre-existing comment (below)
 * already named as true of `data` without yet fixing it ("`dataChanged` is already true on every
 * `render()`... the fine-grained update-trigger path is bypassed on every render regardless").
 * Post-fix, the same per-render sampling at a comparable tile count (128 tiles, 116 samples):
 * p50 53ms, p95 166ms, max 264ms -- directional, one dev-build run each side, not a scored
 * campaign figure (the re-measure session owns that number), but consistent in direction and
 * rough magnitude with the mechanism above.
 *
 * **The fix**: cache `polygons` (and the outline's flattened positions) per `(batch,
 * frame.originX, frame.originY)` and hand deck.gl the SAME array reference for an unchanged
 * batch at an unchanged origin. Unchanged tiles then read `dataChanged: false` and skip
 * attribute regeneration entirely -- on any render triggered by only a handful of newly-arrived
 * or newly-evicted tiles (the common case for a pan/zoom step), the bulk of the resident set
 * still runs `buildLayers`'s own per-batch construction (a fresh `SolidPolygonLayer` per resident
 * batch, still diffed by deck.gl every render -- the post-fix p50 53ms/p95 166ms above is that
 * residual, not zero), but skips the far more expensive attribute re-tessellation/re-upload path.
 * Invalidated by object identity (a genuinely NEW `ResidentBatch` -- e.g. a real refetch --
 * always misses) or by an origin move (`OffsetFrame.forceRecenter`/`maybeRecenter`: every
 * resident batch's offset-relative coordinates are stale the instant the origin moves, so every
 * cache entry misses on the very next render and is rebuilt once, correctly, never silently
 * stale). `getPolygon`/`getPath` stay fresh closures every call (`(d) => d`) -- deliberately:
 * `compareProps`'s own `accessor`-type `equal` treats any two functions as equal regardless of
 * reference (this file's own prior comment, verified again), so a fresh closure here was never
 * part of the cost this cache addresses.
 *
 * A `WeakMap` keyed by the batch object itself needs no manual eviction: once a tile's batch is
 * dropped from `TileResidentSet`/`ResidentSet` (eviction, supersede, dataset close) and nothing
 * else references it, its cache entry is collected right along with it. **This retention has an
 * unmeasured heap cost** -- see `limits.ts`'s `MAX_RESIDENT_VERTICES` comment for the full
 * disclosure: this cache is a third retained coordinate copy per cached vertex, on top of the two
 * that comment already accounts for, bounded by the same ceiling but not independently measured.
 */
interface CachedBatchGeometry {
  originX: number;
  originY: number;
  polygons: Position[][][];
  /** Computed lazily -- most styles carry no outline (`outlineWidth === 0`), so this stays
   * `undefined` for the common case rather than doing work `buildLayers` was never asked for. */
  outlinePositions?: Position[][];
}

const geometryCache = new WeakMap<ResidentBatch, CachedBatchGeometry>();

function geometryForBatch(batch: ResidentBatch, frame: OffsetFrame): CachedBatchGeometry {
  const cached = geometryCache.get(batch);
  if (cached && cached.originX === frame.originX && cached.originY === frame.originY) {
    return cached;
  }
  // Nested `[x,y]` pairs per ring, deliberately not a flat `[x,y,x,y,...]` array: deck.gl's own
  // polygon normalizer (`@deck.gl/layers/solid-polygon-layer/polygon.js`) distinguishes a
  // "complex polygon" (multiple rings, i.e. holes) from a "simple flat" one by checking whether
  // `polygon[0][0]` is itself a finite number -- a flat ring would satisfy that check and get
  // silently misread as one ring's flat vertex list, dropping every hole. Verified against the
  // installed deck.gl 9.3.9 source rather than assumed.
  const polygons: Position[][][] = batch.rings.map((rings) =>
    rings.map((ring) => ring.map(([x, y]) => frame.toLocal(x, y) as Position))
  );
  const fresh: CachedBatchGeometry = { originX: frame.originX, originY: frame.originY, polygons };
  geometryCache.set(batch, fresh);
  return fresh;
}

/** Every ring of every feature in `geometry`'s batch, exterior and holes alike, flattened one
 * level -- the outline `PathLayer`'s own `data` shape (NEXT-CUT.md P5). Cached alongside
 * `polygons` itself so an unchanged batch's outline layer gets the same reference-stability fix
 * as its fill layer, computed at most once per `(batch, origin)` pair regardless of how many
 * renders ask for it. */
function outlinePositionsFor(geometry: CachedBatchGeometry): Position[][] {
  if (geometry.outlinePositions === undefined) {
    geometry.outlinePositions = geometry.polygons.flatMap((rings) => rings);
  }
  return geometry.outlinePositions;
}

/**
 * One deck.gl layer per resident batch. **Never one layer for everything** -- a batch's own
 * feature count is what the 24-bit pick ceiling (ADR-010 rule 6) is checked against, and a batch is
 * bounded by the data plane's frame-size ceiling, so per-layer counts sit orders of magnitude below
 * 16,777,215 by construction.
 *
 * Coordinates cross into `getPolygon` **already offset-relative** (`frame.toLocal`, an f64
 * subtraction, via `geometryForBatch` above): deck.gl's own attribute-buffer construction is what
 * narrows them to f32 afterward, and doing the subtraction here, in f64, before that narrowing, is
 * ADR-010 rule 3 in its entirety. `geometryForBatch` recomputes from `frame.toLocal` whenever the
 * frame's origin no longer matches its cache entry, so a `maybeRecenter`/`forceRecenter` is still
 * picked up automatically (P9: on the very next render after the origin actually moved, not every
 * render regardless) without this function needing to know whether the origin just moved.
 *
 * **`SolidPolygonLayer`, not the composite `PolygonLayer`, and deliberately so.** `PolygonLayer`
 * draws its outline via an internal `PathLayer` sub-layer, and a pick against that sub-layer
 * reports `info.layer.id` as the *sub*-layer's id (composite-id-suffixed), not this batch's own
 * `layerId(batch)` -- `batchForLayerId`'s exact-match lookup would silently fail to resolve it.
 * Fill-only avoids that indirection entirely: the outline below (NEXT-CUT.md P5) is a SEPARATE,
 * standalone, non-pickable `PathLayer` this function constructs itself, never a sub-layer of the
 * `SolidPolygonLayer` -- so the hazard this paragraph describes cannot recur (see the outline's own
 * comment below for why it is structurally, not just incidentally, incapable of it).
 *
 * **`draw.fillColor` is used as-is, never re-derived per batch or per call** (NEXT-CUT.md binding
 * note 7: "give the colour arrays stable identity per style"). The caller (`WorkingCanvas.tsx`)
 * recomputes it once per style *change* (a ref, refreshed only by its own `useEffect([style])`), so
 * every render between two style changes passes the exact same array reference through to every
 * batch's `getFillColor` here.
 *
 * **On whether that stability is actually load-bearing for deck.gl's own prop diff -- read, not
 * assumed (installed `@deck.gl/core@9.3.9` -- `frontends/shell/package-lock.json`, checked directly,
 * not carried over from an earlier reading).** `getFillColor`'s prop type is `accessor`
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
 *
 * **Correction (reviewer gate, style-panel cut P7 fixes, S1): the earlier version of this comment's
 * second half was wrong.** It named `Attribute.setConstantValue` /
 * `_hasConstantBufferValue` as an "O(1)" redundant-upload skip on the render path this canvas
 * actually takes. Read again, directly (`@deck.gl/core/dist/lib/attribute/attribute.js`,
 * `attribute-manager.js`, `data-column.js`): `_hasConstantBufferValue` is reached ONLY from
 * `setConstantBufferValue`, which `setConstantValue` calls ONLY when `this.device.type === 'webgpu'`
 * -- and even there it is NOT O(1), it walks `numInstances * size` elements of the fully-expanded
 * emulated buffer. This canvas is WebGL2 (`WorkingCanvas.tsx`'s own `canvas.getContext("webgl2")`),
 * which never reaches either function: `setConstantValue` on that path calls `DataColumn.setData
 * ({constant: true, value})` directly, whose own internal check (`_areValuesEqual`, `data-column.js`
 * -- a *different* function, element-wise over `this.size`, i.e. 4 iterations for RGBA, genuinely
 * independent of feature/vertex count) is what actually skips a redundant upload. `_areValuesEqual`
 * is also a **value** comparison, exactly like `compareProps`'s own `deepEqual` above it -- so a
 * freshly allocated, value-equal array is judged unchanged there too, identically to a stable
 * reference. Reference stability is therefore not load-bearing at ANY layer this render path
 * actually reaches, not merely "the smaller one": every check between here and the GPU compares
 * VALUES. `attribute-manager.js`'s own `update()` loop (line ~118-120) calls `attribute
 * .setConstantValue(context, props[accessorName])` unconditionally for every string-accessor
 * attribute on every call, too -- there is no upstream reference check gating whether it runs at all,
 * only what the value comparison inside it finds once it does. This function still passes
 * `draw.fillColor`/`draw.outlineColor` through unchanged rather than cloning them, because doing so
 * costs nothing and a caller need not reason about which of these several value-comparisons would
 * otherwise have made a fresh array's cost identical -- not because reference stability itself buys
 * anything measurable on this path.
 *
 * **P9 fix (viewport-residency cut, Amendment 23): the `data` finding two paragraphs up is now the
 * PRE-fix account, not the current behaviour.** This comment's own prior reading was correct at the
 * time -- `data` genuinely was a brand-new array on every call, and `dataChanged` genuinely was true
 * on every render regardless of colour -- but that is exactly what made `data` (never `getFillColor`)
 * the real cost this file's earlier authors diagnosed without yet fixing. `geometryForBatch`
 * (above) is that fix: `data` is now the cached `polygons`/outline-positions reference, reused
 * byte-for-byte across renders for a batch whose object identity and frame origin have not changed,
 * so `dataChanged` reads `false` for the (typically large) majority of a pan or zoom step's resident
 * batches -- unlike `getFillColor`, `data`'s reference stability WAS load-bearing all along; this
 * file simply had not yet supplied it.
 */
export function buildLayers(
  batches: readonly ResidentBatch[],
  frame: OffsetFrame,
  draw: ResolvedDrawParams
): (SolidPolygonLayer<Position[][]> | PathLayer<Position[]>)[] {
  const layers: (SolidPolygonLayer<Position[][]> | PathLayer<Position[]>)[] = [];
  for (const batch of batches) {
    checkPickCeiling(batch.ids.length);
    // P9 fix: `geometryForBatch` (above) returns the SAME `polygons` array reference across
    // renders for a batch whose object identity and frame origin have not changed -- the whole
    // point being that `data: geometry.polygons` below then reads as reference-unchanged to
    // deck.gl's own `diffDataProps`, which is what actually skips attribute regeneration for an
    // unchanged tile (see this function's own doc comment above for the full mechanism).
    const geometry = geometryForBatch(batch, frame);
    layers.push(
      new SolidPolygonLayer<Position[][]>({
        id: layerId(batch),
        data: geometry.polygons,
        getPolygon: (d) => d,
        coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
        pickable: true,
        filled: true,
        getFillColor: draw.fillColor,
      })
    );

    // NEXT-CUT.md P5: a separate, standalone layer for the outline -- never a sub-layer of the
    // `SolidPolygonLayer` above (see that layer's own doc comment for the `PolygonLayer` composite-id
    // pick hazard this avoids). Built only when there is an outline to actually draw
    // (`outlineWidth > 0`) -- never an invisible zero-width layer sitting in deck.gl's own layer list
    // for nothing. Reuses `geometry`'s own cached, already frame-offset positions
    // (`outlinePositionsFor`, above) flattened one level: every ring of every feature in this batch,
    // exterior and holes alike, becomes its own path -- a ring's own vertex list is already a closed
    // loop (GeoArrow/WKB-derived rings repeat their first vertex as their last), so `PathLayer` draws
    // it closed with no `_pathType`/`closeLoop` prop needed. Same P9 reference-stability fix as the
    // fill layer above: an unchanged batch's outline `data` is also reference-identical across
    // renders.
    //
    // **Structurally incapable of producing a pick, not merely unlikely to.** `pickable: false`
    // removes this layer from deck.gl's pick-index space entirely -- there is no code path from a GPU
    // pick ordinal back to this layer at all, which is the actual structural guarantee (the fact that
    // its id also never collides with `batchForLayerId`'s exact-match lookup, `${layerId(batch)}
    // -outline` vs. `layerId(batch)`, is redundant insurance on top of that, not what does the work --
    // see `buildLayers.test.ts`).
    //
    // **Declared cost, never a VRAM figure (ADR-010 rule 6 style).** The layer count for this batch
    // doubles when outlined (one fill layer, one outline layer), and every ring vertex crosses to the
    // GPU a SECOND time (once triangulated for the fill polygon's interior, once again as line
    // geometry for the outline path) -- pure per-batch construction cost, nothing shared between the
    // two layers. `checkPickCeiling` above and `MAX_RESIDENT_VERTICES` (decode-time resident-vertex
    // admission, `ResidentSet.addBatch` -- this function runs strictly after that decision) are BOTH
    // unaffected: the pick ceiling never sees this layer at all (`pickable: false`), and residency
    // admission has already happened by the time `buildLayers` runs on whatever is resident.
    if (draw.outlineWidth > 0) {
      layers.push(
        new PathLayer<Position[]>({
          id: `${layerId(batch)}-outline`,
          data: outlinePositionsFor(geometry),
          getPath: (d) => d,
          coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
          pickable: false,
          widthUnits: "pixels", // outline_width is declared in CSS pixels (renderer/src/style.rs)
          getColor: draw.outlineColor,
          getWidth: draw.outlineWidth,
        })
      );
    }
  }
  return layers;
}
