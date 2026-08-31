// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import type { AuthoritativeBbox } from "./viewportBbox";
import { TILE_GRID_DIMENSIONS, TileGridLevel } from "./tileGridConstants";

/**
 * Viewport-residency cut P3 item A: a declared, fixed grid over a dataset-scoped square, pure math
 * only -- no streaming, no residency, no React. C2 (NEXT-CUT.md): nothing here touches
 * `OffsetFrame` or produces a per-tile GPU origin; every coordinate this module returns or accepts
 * is authoritative-CRS (ADR-010 rule 1), the same space `extent.ts`/`viewportBbox.ts` already work
 * in.
 *
 * **The frame's basis, and why it is not a dataset extent.** `describe`'s own `extent.basis` is
 * `"not-established-at-open"` (SKP-V0.md's C1) -- there is no dataset bounding box to anchor a fixed
 * grid to before the first byte of data ever arrives. This module does not invent one either: a
 * caller derives `anchor` from `extent.ts`'s own `chooseFitTarget` at the moment the FIRST viewport
 * query's own batches have all been unioned (the same anchor `WorkingCanvas.tsx`'s `fitAnchorRef`
 * already accumulates for "zoom to layer") and passes it to `deriveTileGridFrame` exactly once, ever,
 * per dataset session -- the frame this returns is then declared frozen (`TileViewportStreamManager
 * .establishGridFrame`'s own doc comment has the freeze contract).
 *
 * **P5f complex-gate should-fix 4: "all been unioned" means the WHOLE untiled first look, not its
 * first delivering batch alone.** `candidateArmSession.ts`'s own untiled "first look" query is what
 * plays the "caller" role above (`issueUntiledQuery`) -- before this fix, it self-cancelled the
 * instant its FIRST batch carried any geometry, and `anchor` was that one batch's own extent alone,
 * contradicting this doc comment's own "all been unioned" claim (a real gap between the declared
 * contract and the code, caught by review). The fix: the untiled query is now BOUNDED by a declared
 * row limit (`tileGridConstants.ts`'s own `UNTILED_FIRST_LOOK_ROW_LIMIT`, reconciling with the
 * separate "never fetch the whole dataset through one giant stream" fix `issueUntiledQuery`'s own doc
 * comment already names) rather than an unbounded `bbox: null` stream self-cancelled early, and runs
 * to its own natural terminal -- `anchor` is `extentOfBatch`/`unionBbox`'s own running union across
 * EVERY batch that stream ever delivers, read at that terminal, exactly matching this doc's own
 * words. Deterministic per dataset in the sense this piece can actually claim: `bbox: null` and the
 * declared row limit are fixed inputs to the SAME `viewport_query` call baseline's own initial
 * unfiltered load already issues (unbounded there, bounded here) -- this piece introduces no NEW
 * source of run-to-run variance beyond whatever row-order stability that existing call already has or
 * lacks server-side (out of scope here to establish either way; not a new claim this piece makes).
 *
 * **The frame has no boundary.** `TileGridFrame` names cell `(0, 0)`'s own origin and a
 * level-independent base span (`cellSizeForLevel` divides it per level) -- everything else is cell
 * arithmetic. `TileKey.row`/`.col` may be negative or arbitrarily large; a bbox far outside the
 * padded square that seeded the frame still resolves to real, well-defined tile keys the same way a
 * bbox inside it does. There is no separate "outside" case to special-case in code: quantizing a
 * coordinate against a declared origin and cell size is already total over the whole plane.
 */

export interface TileGridFrame {
  /** Authoritative-CRS X of cell (0, 0)'s own min corner. */
  originX: number;
  /** Authoritative-CRS Y of cell (0, 0)'s own min corner. */
  originY: number;
  /** The padded square's side length, authoritative-CRS units, level-INDEPENDENT -- a cell's actual
   * size at a given level is `baseSpan / TILE_GRID_DIMENSIONS[level]` (`cellSizeForLevel`). Coarse,
   * medium, and fine all subdivide this SAME span, per NEXT-CUT.md P3 item A ("Grid levels: coarse
   * 8x8, medium 16x16, fine 32x32 over that frame"). */
  baseSpan: number;
}

/** A quantized cell coordinate -- may be negative; the grid has no boundary (this module's own top
 * doc comment). Two keys are the same cell iff both fields are `===`; `tileKeyToString` is the
 * canonical stable string form for use as a `Map`/`Set` key. */
export interface TileKey {
  row: number;
  col: number;
}

/** Degenerate-anchor fallback (a zero-span anchor: a single point, or every batch's geometry
 * coincident) -- an arbitrary but DECLARED minimum span (ADR-010 rule 6: "declared, not
 * discovered"), so `deriveTileGridFrame` never produces a zero (or negative) cell size. One
 * authoritative-CRS unit (e.g. one metre for a projected CRS) is small enough to never matter for
 * any real dataset and large enough to keep every level's cell size comfortably above zero. */
const MIN_ANCHOR_SPAN = 1;

/** "Padded x2 each side" (NEXT-CUT.md P3 item A): the frame's own padded square is DOUBLE the
 * anchor's own (square) span, centred on the anchor's centre -- i.e. the anchor sits centred inside
 * a frame twice as wide/tall as itself, half of the extra span as margin on every side. */
const PAD_FACTOR = 2;

/**
 * Derives a fixed grid frame from `anchor` (the dataset's first-delivery fit target, this module's
 * own top doc comment) -- pure, deterministic, no I/O. Callers declare the RESULT frozen for a
 * dataset's whole session (`TileViewportStreamManager.establishGridFrame`); this function itself
 * has no notion of "session" and may be called again for a genuinely fresh session (a new dataset).
 */
export function deriveTileGridFrame(anchor: AuthoritativeBbox): TileGridFrame {
  const spanX = anchor.xmax - anchor.xmin;
  const spanY = anchor.ymax - anchor.ymin;
  const anchorSpan = Math.max(spanX, spanY, MIN_ANCHOR_SPAN);
  const baseSpan = anchorSpan * PAD_FACTOR;
  const centerX = (anchor.xmin + anchor.xmax) / 2;
  const centerY = (anchor.ymin + anchor.ymax) / 2;
  return {
    originX: centerX - baseSpan / 2,
    originY: centerY - baseSpan / 2,
    baseSpan,
  };
}

/** A cell's own side length at `level` -- `frame.baseSpan` divided by that level's own dimension
 * (`TILE_GRID_DIMENSIONS`). Coarse cells are the largest (8x8 over the same span), fine the
 * smallest (32x32). */
export function cellSizeForLevel(frame: TileGridFrame, level: TileGridLevel): number {
  return frame.baseSpan / TILE_GRID_DIMENSIONS[level];
}

/** The canonical stable string form of a `TileKey`, for `Map`/`Set` keys and wire-free logging --
 * two keys with the same `row`/`col` always produce the same string, and the string round-trips
 * nowhere else (there is no `tileKeyFromString`; nothing needs to parse this back). */
export function tileKeyToString(key: TileKey): string {
  return `${key.row}:${key.col}`;
}

/** The authoritative-CRS bbox of one cell -- half-open in this module's own covering convention
 * (`[xmin, xmax)` x `[ymin, ymax)`; see `tilesCoveringBbox`'s own doc comment), but returned here as
 * an ordinary closed `AuthoritativeBbox` since that is the wire shape `viewport_query`'s own `bbox`
 * parameter needs (C3: the tile bbox rides as an ordinary bbox query, no new parameter). */
export function tileBbox(frame: TileGridFrame, level: TileGridLevel, key: TileKey): AuthoritativeBbox {
  const cellSize = cellSizeForLevel(frame, level);
  const xmin = frame.originX + key.col * cellSize;
  const ymin = frame.originY + key.row * cellSize;
  return { xmin, ymin, xmax: xmin + cellSize, ymax: ymin + cellSize };
}

/** The authoritative-CRS centre point of one cell -- what `tileDistanceToPoint` measures distance
 * from (NEXT-CUT.md P3 item D's own eviction ordering). */
export function tileCentre(frame: TileGridFrame, level: TileGridLevel, key: TileKey): { x: number; y: number } {
  const b = tileBbox(frame, level, key);
  return { x: (b.xmin + b.xmax) / 2, y: (b.ymin + b.ymax) / 2 };
}

/** Euclidean distance from one cell's own centre to `point` (typically the current view centre) --
 * the ordering key distance-ordered eviction (item D) evicts by, farthest first. */
export function tileDistanceToPoint(
  frame: TileGridFrame,
  level: TileGridLevel,
  key: TileKey,
  point: { x: number; y: number }
): number {
  const c = tileCentre(frame, level, key);
  return Math.hypot(c.x - point.x, c.y - point.y);
}

/** The half-open `[start, end]` (both inclusive, `end` may equal `start`) range of cell indices
 * along one axis whose cells intersect `[minCoord, maxCoord]` -- shared by both the row and column
 * computation in `tilesCoveringBbox` below. Cells are half-open (`[cellMin, cellMax)`): a bbox edge
 * landing EXACTLY on a cell boundary belongs to the cell whose MIN edge it is, never spilling an
 * extra, zero-overlap cell beyond it -- the misalignment case this function is written to get right
 * on purpose (a grid deliberately misaligned with a fixture's own parcel grid, per
 * `RESIDENCY-PREREGISTRATION.md`, must not silently double-cover a boundary-aligned query). A
 * zero-width input (`maxCoord <= minCoord`, e.g. a degenerate point query) still resolves to exactly
 * one cell -- the one containing `minCoord`. */
function coveringIndexRange(minCoord: number, maxCoord: number, origin: number, cellSize: number): [number, number] {
  const start = Math.floor((minCoord - origin) / cellSize);
  if (maxCoord <= minCoord) {
    return [start, start];
  }
  const rawEnd = (maxCoord - origin) / cellSize;
  const flooredEnd = Math.floor(rawEnd);
  const end = Number.isInteger(rawEnd) ? flooredEnd - 1 : flooredEnd;
  return [start, Math.max(end, start)];
}

/**
 * Every tile key whose cell intersects `bbox`, in DETERMINISTIC row-major order (ascending row
 * outer, ascending col inner) -- NEXT-CUT.md P3 item A's own ordering requirement, so a caller's
 * planning (which non-resident tile to issue first when queueing) is reproducible run to run, not an
 * artifact of `Map`/`Set` iteration order over some other structure.
 */
export function tilesCoveringBbox(frame: TileGridFrame, level: TileGridLevel, bbox: AuthoritativeBbox): TileKey[] {
  const cellSize = cellSizeForLevel(frame, level);
  const [colStart, colEnd] = coveringIndexRange(bbox.xmin, bbox.xmax, frame.originX, cellSize);
  const [rowStart, rowEnd] = coveringIndexRange(bbox.ymin, bbox.ymax, frame.originY, cellSize);
  const keys: TileKey[] = [];
  for (let row = rowStart; row <= rowEnd; row++) {
    for (let col = colStart; col <= colEnd; col++) {
      keys.push({ row, col });
    }
  }
  return keys;
}
