// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * 2D canvas drawing for the probe.
 *
 * **This is not the renderer module.** `docs/02` scopes `renderer/` to GPU map rendering, labels and
 * style compilation, and `docs/06`'s pipeline is deck.gl + MapLibre. This file has no style
 * compilation, no label placement, no picking, no scene graph and no cache — it strokes polygons so
 * a human can see that the stream works. The moment it grows any of those, it is renderer work and
 * belongs there.
 *
 * ## ADR-010 rule 3, which binds here regardless of where this file lives
 *
 * `f32(coord − origin)`, never `f32(coord)`. JavaScript numbers are f64, so the narrowing happens at
 * the canvas boundary — every value handed to `moveTo`/`lineTo` is consumed as a float by the 2D
 * backend. So the subtraction happens **first, in f64**, against a declared render origin, and the
 * canvas only ever sees origin-relative values. At EPSG:2056 magnitudes (~2.6 × 10⁶ m) narrowing an
 * absolute coordinate loses the sub-metre detail the whole slice exists to carry: the spike measured
 * 0.9494 px of error at 1:500 against a 0.5 px budget doing exactly that.
 *
 * The render origin is **renderer-local state and never crosses a boundary** (rule 1): nothing
 * outside this file receives an origin-relative value, and no origin-relative value is ever written
 * back anywhere.
 */

import type { DecodedBatch } from './geoarrow.js';

export interface Viewport {
  /** Declared render origin, in the dataset's CRS. Subtracted in f64 before anything narrows. */
  originX: number;
  originY: number;
  /** Pixels per CRS unit. */
  scale: number;
  width: number;
  height: number;
}

export interface LayerStyle {
  stroke: string;
  fill: string;
  lineWidth: number;
}

/** Fits a viewport around a bounding box in the dataset's CRS. */
export function fitViewport(
  bbox: [number, number, number, number],
  width: number,
  height: number,
): Viewport {
  const [xmin, ymin, xmax, ymax] = bbox;
  const spanX = Math.max(xmax - xmin, 1e-9);
  const spanY = Math.max(ymax - ymin, 1e-9);
  const scale = Math.min(width / spanX, height / spanY) * 0.92;
  return {
    // The origin is the box's own corner, so every drawn value is a small offset — which is the
    // point: small numbers survive the narrowing that large ones do not.
    originX: xmin,
    originY: ymin,
    scale,
    width,
    height,
  };
}

/**
 * Draw one decoded batch.
 *
 * Walks the GeoArrow offsets directly — the coordinates are already one contiguous run of doubles,
 * and materializing per-feature JS objects would throw that away.
 */
export function drawBatch(
  ctx: CanvasRenderingContext2D,
  batch: DecodedBatch,
  view: Viewport,
  style: LayerStyle,
): void {
  const { coords, ringOffsets, polygonOffsets } = batch;
  ctx.strokeStyle = style.stroke;
  ctx.fillStyle = style.fill;
  ctx.lineWidth = style.lineWidth;

  ctx.beginPath();
  for (let f = 0; f < polygonOffsets.length - 1; f++) {
    for (let r = polygonOffsets[f]; r < polygonOffsets[f + 1]; r++) {
      const start = ringOffsets[r];
      const end = ringOffsets[r + 1];
      if (end - start < 2) continue;
      for (let v = start; v < end; v++) {
        // ---- ADR-010 rule 3: subtract in f64 first, then let the canvas narrow -------------
        const px = (coords[v * 2] - view.originX) * view.scale;
        const py = view.height - (coords[v * 2 + 1] - view.originY) * view.scale;
        if (v === start) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
    }
  }
  ctx.fill();
  ctx.stroke();
}

/**
 * The projection, exported so it can be tested without a canvas.
 *
 * Returns the origin-relative device position. A caller that passes an absolute coordinate as the
 * origin gets zero back — which is the failure the rule prevents, and is what the test asserts.
 */
export function project(x: number, y: number, view: Viewport): [number, number] {
  return [(x - view.originX) * view.scale, view.height - (y - view.originY) * view.scale];
}

/**
 * The precision claim, as an assertable function: what a *naive absolute* narrowing costs at LV95
 * magnitudes, in metres, versus the offset-relative path.
 *
 * Not a benchmark and not a px figure — px is a function of scale and the spike's numbers are
 * 1:500 on one GPU. This is the mechanism, arithmetic only.
 */
export function narrowingErrorMetres(x: number, originX: number): { naive: number; relative: number } {
  const naive = Math.abs(Math.fround(x) - x);
  const relative = Math.abs(Math.fround(x - originX) - (x - originX));
  return { naive, relative };
}

/**
 * Draw the staleness banner ADR-010 rule 5 and H7 require.
 *
 * "Any window in which the renderer can return … a visibly rendered geometry from state it knows to
 * be behind the committed state is a named hazard requiring a visible signal." A cancelled or failed
 * stream leaves exactly that: a partial layer. It is labelled on the canvas, not silently kept.
 */
export function drawIncompleteBanner(
  ctx: CanvasRenderingContext2D,
  lines: string[],
  view: Viewport,
): void {
  if (lines.length === 0) return;
  ctx.save();
  ctx.fillStyle = 'rgba(120, 20, 20, 0.85)';
  ctx.fillRect(0, 0, view.width, 12 + 16 * lines.length);
  ctx.fillStyle = '#fff';
  ctx.font = '12px ui-monospace, monospace';
  lines.forEach((l, i) => ctx.fillText(l, 8, 20 + 16 * i));
  ctx.restore();
}
