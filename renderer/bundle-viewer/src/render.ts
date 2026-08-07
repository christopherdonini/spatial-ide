// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * The projected canvas: the view transform, drawing, and picking.
 *
 * ## ADR-010 rule 3 — `f32(coord − origin)`, never `f32(coord)`
 *
 * JavaScript numbers are f64, so the narrowing happens at the canvas boundary: every value handed to
 * `moveTo`/`lineTo` is consumed as a float by the 2D backend. The subtraction therefore happens
 * **first, in f64**, against a declared render origin, and the canvas only ever sees origin-relative
 * values. At EPSG:2056 magnitudes (~2.6 × 10⁶ m) narrowing an absolute coordinate destroys the
 * sub-metre detail the bundle exists to carry.
 *
 * ## Rule 1 — the render origin is renderer-local and crosses no boundary
 *
 * The origin lives in [`View`] and nothing outside this module receives an origin-relative value.
 * It is not in the manifest and never will be: a manifest carrying a render origin would be
 * persisting an untagged renderer-local coordinate, which is the failure rule 1 is about.
 *
 * ## No cached raster, no level of detail, no tiles
 *
 * Every frame is drawn from the authoritative f64 coordinates. Showing a scaled copy of the previous
 * frame during a drag would be cheaper and would introduce a window in which the pixels disagree
 * with what a hover resolves against — a staleness hazard invented for no reason on a static
 * artifact. **The consequence is stated rather than hidden: drawing cost scales with the number of
 * visible features, and no frame-time figure is claimed, measured or met.**
 *
 * ## Rule 6 — declared ceilings, and what picking here is and is not
 *
 * Picking is **exact point-in-polygon containment on the authoritative f64 coordinates**, in world
 * space. There is therefore no pick radius and no style dependence — the geometry is the target, not
 * a styled symbol. ADR-010 rule 6's **2.27 px discrimination figure does not apply here**: it is a
 * deck.gl measurement of a styled point symbol at 1:500 on one GPU, and carrying it across would be
 * quoting a number about a different mechanism. The 24-bit pick ceiling does not apply either — that
 * is deck.gl's colour-encoded index, and nothing here encodes an index into a colour.
 *
 * The honest consequence of zero tolerance, stated because it is the cost of the choice: **a feature
 * whose on-screen footprint is smaller than a pixel is effectively unhoverable.** Nothing here
 * snaps to the nearest feature; a design that did would need its own decision.
 */

import type { DrawParameters, Style } from './style.js';
import type { Partition } from './partition.js';

/** Declared ceilings (ADR-010 rule 6). Behaviour at each is declared with it, not discovered. */
export const MAX_FEATURES = 2_000_000;
export const MAX_PARTITIONS = 100_000;
export const MAX_RESIDENT_BYTES = 512 * 1024 * 1024;
export const MAX_ATTRIBUTE_COLUMNS = 32;
/** Attribute text is truncated for display at this length. Untrusted input, bounded on the way in. */
export const MAX_ATTRIBUTE_DISPLAY_CHARS = 512;

/**
 * The view. `centerX`/`centerY` are the **render origin**: every drawn value is `coord − centre`,
 * which keeps the magnitudes small enough that the canvas's narrowing is harmless.
 */
export interface View {
  centerX: number;
  centerY: number;
  /** Device pixels per CRS unit. */
  scale: number;
  width: number;
  height: number;
}

export function fitView(
  bounds: { xmin: number; ymin: number; xmax: number; ymax: number },
  width: number,
  height: number,
): View {
  const spanX = Math.max(bounds.xmax - bounds.xmin, 1e-9);
  const spanY = Math.max(bounds.ymax - bounds.ymin, 1e-9);
  return {
    centerX: (bounds.xmin + bounds.xmax) / 2,
    centerY: (bounds.ymin + bounds.ymax) / 2,
    scale: Math.min(width / spanX, height / spanY) * 0.94,
    width,
    height,
  };
}

/** World → device. The subtraction is in f64 and happens first. */
export function project(x: number, y: number, view: View): [number, number] {
  return [
    (x - view.centerX) * view.scale + view.width / 2,
    view.height / 2 - (y - view.centerY) * view.scale,
  ];
}

/**
 * Device → world.
 *
 * **Permitted by ADR-010 rule 2 for hover feedback, and used for nothing else.** The result selects
 * a candidate feature and is then discarded: it is never displayed, never stored, and never written
 * anywhere. The hover panel shows no coordinate at all, which is stronger than rule 2's requirement
 * that a cursor-derived readout be visibly marked as one.
 */
export function unproject(px: number, py: number, view: View): [number, number] {
  return [
    view.centerX + (px - view.width / 2) / view.scale,
    view.centerY - (py - view.height / 2) / view.scale,
  ];
}

/** The world rectangle currently visible, for culling. */
export function visibleBounds(view: View): [number, number, number, number] {
  const halfW = view.width / 2 / view.scale;
  const halfH = view.height / 2 / view.scale;
  return [
    view.centerX - halfW,
    view.centerY - halfH,
    view.centerX + halfW,
    view.centerY + halfH,
  ];
}

function rgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${opacity})`;
}

/**
 * Draw every loaded partition.
 *
 * **Painter's order is identity order**: partitions in manifest order, features in array order
 * within a partition, and since the publish path orders rows by ascending identity that means the
 * highest id is drawn last and wins where footprints overlap. `pick` searches backwards through
 * exactly this order, so what is picked is what is visible.
 *
 * **Each feature is filled on its own path**, and that is a correctness decision rather than an
 * oversight. Batching every feature of one style group into a single path and filling it once is
 * cheaper — six fills instead of one per feature — but even-odd over a merged path **cancels the
 * intersection of two overlapping features**, so two same-coloured neighbours that overlap would
 * render a hole between them that no feature has. It would also make painter's order group-major,
 * so a feature in a later style group would cover an earlier one regardless of identity, and `pick`
 * would then return a feature the pixels do not show. Both are wrong-but-plausible results of
 * exactly the kind ADR-010 rule 2's indirection exists to prevent, one level up.
 *
 * *(An earlier version of this function did batch by group, and both defects were live. The
 * fixture's polygons tile a grid and never overlap, so nothing in the acceptance run would have
 * surfaced either.)*
 *
 * The cost is stated rather than defended: one `fill` and one `stroke` per visible feature, on top
 * of a path walk that is O(vertices) either way. **No frame-time figure is claimed, measured or
 * met.**
 */
export function drawAll(
  ctx: CanvasRenderingContext2D,
  partitions: Partition[],
  style: Style,
  view: View,
): { drawn: number; culled: number } {
  ctx.clearRect(0, 0, view.width, view.height);
  const [vxmin, vymin, vxmax, vymax] = visibleBounds(view);
  let drawn = 0;
  let culled = 0;
  let currentGroup = -1;
  let params: DrawParameters = style.groups[0];

  for (const p of partitions) {
    const { coords, ringOffsets, polygonOffsets, bboxes, groups } = p;
    for (let f = 0; f < p.features; f++) {
      const b = f * 4;
      if (bboxes[b] > vxmax || bboxes[b + 2] < vxmin || bboxes[b + 1] > vymax || bboxes[b + 3] < vymin) {
        culled++;
        continue;
      }
      drawn++;

      // Style state changes only when the group does. That is the whole of the batching that
      // survives, and it changes no pixel.
      if (groups[f] !== currentGroup) {
        currentGroup = groups[f];
        params = style.groups[currentGroup];
        ctx.fillStyle = rgba(params.fillColor, params.fillOpacity);
        ctx.strokeStyle = params.outlineColor;
        ctx.lineWidth = params.outlineWidth;
      }

      ctx.beginPath();
      for (let r = polygonOffsets[f]; r < polygonOffsets[f + 1]; r++) {
        const start = ringOffsets[r];
        const end = ringOffsets[r + 1];
        if (end - start < 2) continue;
        for (let v = start; v < end; v++) {
          // ---- ADR-010 rule 3: subtract in f64 first, then let the canvas narrow --------------
          const px = (coords[v * 2] - view.centerX) * view.scale + view.width / 2;
          const py = view.height / 2 - (coords[v * 2 + 1] - view.centerY) * view.scale;
          if (v === start) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
      }
      // Even-odd **per feature**, which is what makes an interior ring a hole regardless of its
      // winding — the engine repairs nothing and guarantees no winding order. `containsEvenOdd`
      // applies the identical rule to the identical rings, so what is drawn and what is picked
      // cannot disagree.
      ctx.fill('evenodd');
      if (params.outlineWidth > 0) ctx.stroke();
    }
  }

  return { drawn, culled };
}

/** What a hover resolved to. Carries the **id**, never the array index. */
export interface Pick {
  /** The stable feature id, looked up from the partition's own id array. */
  id: bigint;
  partitionPath: string;
  attributes: { name: string; value: string | null }[];
}

/**
 * Resolve a world point to a feature.
 *
 * **The indirection ADR-010 rule 2 requires.** The hit test produces a `(partition, feature index)`
 * pair; the identity is then **looked up** as `partition.ids[index]`. The index is never treated as
 * the identity — it equals it only by accident of array order, and any future culling, chunking or
 * reordering would end that accident silently. The pair is also never flattened into a global
 * cross-partition ordinal, which would be the same hazard one level up.
 *
 * **Draw order decides overlaps, declared rather than discovered:** partitions in manifest order,
 * features in array order within a partition, last drawn winning. Since the publish path orders rows
 * by ascending identity, that means the **highest id wins** where footprints overlap. This search
 * runs backwards through the identical order for exactly that reason, so what is picked is what is
 * visible — and `drawAll` is written to keep that true, which is why it does not batch by style
 * group.
 */
export function pick(partitions: Partition[], x: number, y: number): Pick | null {
  for (let pi = partitions.length - 1; pi >= 0; pi--) {
    const p = partitions[pi];
    for (let f = p.features - 1; f >= 0; f--) {
      const b = f * 4;
      if (x < p.bboxes[b] || x > p.bboxes[b + 2] || y < p.bboxes[b + 1] || y > p.bboxes[b + 3]) {
        continue;
      }
      if (!containsEvenOdd(p, f, x, y)) continue;
      return {
        // The lookup. Never `f`.
        id: p.ids[f],
        partitionPath: p.path,
        attributes: p.attributes.map((a) => ({
          name: a.name,
          value:
            a.values[f] === null
              ? null
              : a.values[f]!.slice(0, MAX_ATTRIBUTE_DISPLAY_CHARS),
        })),
      };
    }
  }
  return null;
}

/**
 * Even-odd containment over every ring of one feature.
 *
 * The same rule `drawAll` fills with. Using a different one here — non-zero, say — would make a
 * point inside a hole pick the enclosing polygon while the pixels showed a hole, which is a
 * wrong-but-plausible answer of exactly the kind rule 2 is written against.
 */
function containsEvenOdd(p: Partition, feature: number, x: number, y: number): boolean {
  let inside = false;
  for (let r = p.polygonOffsets[feature]; r < p.polygonOffsets[feature + 1]; r++) {
    const start = p.ringOffsets[r];
    const end = p.ringOffsets[r + 1];
    for (let i = start, j = end - 1; i < end; j = i++) {
      const xi = p.coords[i * 2];
      const yi = p.coords[i * 2 + 1];
      const xj = p.coords[j * 2];
      const yj = p.coords[j * 2 + 1];
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
        inside = !inside;
      }
    }
  }
  return inside;
}
