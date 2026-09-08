// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import type { AuthoritativeBbox } from "./viewportBbox";
import {
  COVER_WINDOW_CELLS_PER_AXIS,
  MAX_COVERING_TILES,
  TILE_GRID_DIMENSIONS,
  TileGridLevel,
} from "./tileGridConstants";

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

/** The two index ranges (`coveringIndexRange` per axis) a cover spans, plus the cell size they were
 * computed against -- the shared arithmetic behind `coveringCellCount` and `tileCoverForBbox`,
 * allocating nothing but the two pairs themselves however large the cover turns out to be. */
function coveringIndexRanges(
  frame: TileGridFrame,
  level: TileGridLevel,
  bbox: AuthoritativeBbox
): { cellSize: number; cols: [number, number]; rows: [number, number] } {
  const cellSize = cellSizeForLevel(frame, level);
  return {
    cellSize,
    cols: coveringIndexRange(bbox.xmin, bbox.xmax, frame.originX, cellSize),
    rows: coveringIndexRange(bbox.ymin, bbox.ymax, frame.originY, cellSize),
  };
}

/**
 * The cover's own cell count, computed from the SPAN alone -- rows x cols, no allocation, no loop.
 * This is the pre-check `tileCoverForBbox` runs before it materialises anything: the human's
 * 2026-09-08 ruling on DECISIONS-PENDING entry 60 is a "bound-before-allocate fix in this cut".
 *
 * The result may be astronomically large (a camera at zoom -64 makes the viewport's own
 * authoritative-CRS bbox ~2^64 times wider than at zoom 0, `WorkingCanvas.tsx`'s own
 * `pixelsPerWorldUnitAtZoom(zoom) === 2 ** zoom`) or non-finite (a non-finite bbox coordinate) --
 * both are ordinary inputs to this function and neither costs more than this arithmetic. Callers
 * treat any non-finite result as "over the bound"; `Number.isFinite` is the check, never a bare
 * `>` comparison, because `NaN > anything` is `false`.
 */
export function coveringCellCount(frame: TileGridFrame, level: TileGridLevel, bbox: AuthoritativeBbox): number {
  const { cols, rows } = coveringIndexRanges(frame, level, bbox);
  return (cols[1] - cols[0] + 1) * (rows[1] - rows[0] + 1);
}

/**
 * `tileCoverForBbox`'s own result: the covering cells, and whether the declared enumeration bound
 * (`MAX_COVERING_TILES`) stopped this cover short of the full geometric set.
 *
 * `"truncated"` is the SAME outcome `TileViewportStreamManager.onCameraChange` already produces when
 * a covering set outruns its own issuing/queueing capacity (`TilePlanOutcome.coveringTruncated`/
 * `truncatedCount`, and the settled-partial status line the candidate arm shows for it) -- this
 * module reaching it earlier, from the span, does not add a new product state.
 */
export type TileCover =
  | {
      kind: "complete";
      /** Every cell of the cover, row-major (`tilesCoveringBbox`'s own ordering contract). */
      keys: TileKey[];
      /** `coveringCellCount`'s own result; equals `keys.length` on this branch. */
      cellCount: number;
    }
  | {
      kind: "truncated";
      /** The kept cells: a square window of at most `COVER_WINDOW_CELLS_PER_AXIS` per axis centred
       * on `bbox`'s own centre cell, intersected with the real cover, row-major. Empty only when
       * that window is not a walkable index range at all (`isEnumerableRange`: a non-finite bbox,
       * or one so far from the frame origin that its cell indices exceed the safe-integer range). */
      keys: TileKey[];
      /** `coveringCellCount`'s own result -- the size of the cover that WOULD have been
       * materialised. May be non-finite when the bbox is (see `coveringCellCount`); no finite
       * substitute is invented for it here. */
      cellCount: number;
      /** `cellCount - keys.length` -- how many cells this cover omits. Carries `cellCount`'s own
       * non-finiteness when it has any, for the same reason. */
      omittedCellCount: number;
    };

/** Whether `[start, end]` is a cell-index range a plain `for (i = start; i <= end; i++)` loop can
 * actually walk: both ends safe integers (`Number.isSafeInteger`), `end` at or after `start`. Past
 * 2^53 an increment is a no-op in double arithmetic, so a loop over such a range never terminates --
 * the same never-returns failure this module's own count bound exists to close, reached by cell-index
 * MAGNITUDE (a bbox absurdly far from the frame origin) rather than by cell COUNT. A range that
 * fails this is reported truncated with nothing kept, never enumerated. */
function isEnumerableRange(start: number, end: number): boolean {
  return Number.isSafeInteger(start) && Number.isSafeInteger(end) && end >= start;
}

/** Materialises the cells of one index rectangle, row-major (ascending row outer, ascending col
 * inner). Every caller has already bounded `rowEnd - rowStart` and `colEnd - colStart` AND checked
 * both ranges with `isEnumerableRange`; this function never checks a bound of its own, which is
 * exactly why nothing else may call it. */
function materialiseCells(rowStart: number, rowEnd: number, colStart: number, colEnd: number): TileKey[] {
  const keys: TileKey[] = [];
  for (let row = rowStart; row <= rowEnd; row++) {
    for (let col = colStart; col <= colEnd; col++) {
      keys.push({ row, col });
    }
  }
  return keys;
}

/**
 * Every tile key whose cell intersects `bbox`, in DETERMINISTIC row-major order (ascending row
 * outer, ascending col inner) -- NEXT-CUT.md P3 item A's own ordering requirement, so a caller's
 * planning (which non-resident tile to issue first when queueing) is reproducible run to run, not an
 * artifact of `Map`/`Set` iteration order over some other structure -- BOUNDED by
 * `MAX_COVERING_TILES` (DECISIONS-PENDING entry 60, ruled (a) 2026-09-08; RELEASE-0.1.md Amendment
 * 10's preregistration).
 *
 * **What the bound fixes.** `tilesCoveringBbox` (this function, then unbounded) was called on every
 * debounced camera settle (`TileViewportStreamManager.onCameraChange`, then
 * `streaming/tileViewportStreamManager.ts:314`, now `:328` and through `tileCoverForBbox`), and
 * `MAX_QUEUED_TILES` truncated only AFTERWARDS (then `:361-379` there, now `:386-398`) -- so an
 * ordinary wheel gesture far enough out made this nested loop's own
 * iteration count a function of the camera alone, with nothing in front of it: the canvas's single
 * JS thread sat in this loop, which is docs/01's "Never block the canvas." (principle 7) broken on
 * the camera path. The pre-check below is `coveringCellCount` -- rows x cols from the span, before the
 * first `TileKey` exists.
 *
 * **What it does when the bound is exceeded, and what it deliberately does NOT do.** It keeps a
 * square window of `COVER_WINDOW_CELLS_PER_AXIS` cells per axis centred on `bbox`'s own centre cell
 * (intersected with the real cover, so a cover overrunning the bound on one axis only keeps the
 * other axis whole) and reports `"truncated"`. Nearest-to-the-view-centre-kept /
 * farthest-dropped is the policy `onCameraChange` itself already applies to its own candidate list
 * (`tileViewportStreamManager.ts:386-398`); this is that same policy, moved in front of the
 * allocation. It does NOT introduce a
 * zoom floor, a `minZoom` clamp, or any new operator-visible state -- entry 60 records the clamp as
 * an optional follow-up (`NEXT-CUT.md`), and the partial-view disclosure stays exactly the settled-
 * partial status line the candidate arm shows today.
 */
export function tilesCoveringBbox(frame: TileGridFrame, level: TileGridLevel, bbox: AuthoritativeBbox): TileKey[] {
  return tileCoverForBbox(frame, level, bbox).keys;
}

/**
 * The bounded cover, with the truncation fact the caller needs to report it (`tilesCoveringBbox`
 * above is this function's own keys-only projection, kept for the callers -- and the tests --
 * that never needed the fact).
 *
 * Pure and total: every branch below allocates at most `MAX_COVERING_TILES` `TileKey`s, whatever
 * `bbox` says, including a non-finite one.
 */
export function tileCoverForBbox(frame: TileGridFrame, level: TileGridLevel, bbox: AuthoritativeBbox): TileCover {
  const { cellSize, cols, rows } = coveringIndexRanges(frame, level, bbox);
  const [colStart, colEnd] = cols;
  const [rowStart, rowEnd] = rows;
  // The pre-check: the count comes from the span, so this comparison happens with nothing yet
  // allocated. A non-finite count (a non-finite bbox) is over the bound by definition -- tested
  // first, since `NaN <= MAX_COVERING_TILES` is `false` but so is `NaN > MAX_COVERING_TILES`.
  const cellCount = (colEnd - colStart + 1) * (rowEnd - rowStart + 1);
  const enumerable = isEnumerableRange(rowStart, rowEnd) && isEnumerableRange(colStart, colEnd);
  if (enumerable && Number.isFinite(cellCount) && cellCount <= MAX_COVERING_TILES) {
    return { kind: "complete", keys: materialiseCells(rowStart, rowEnd, colStart, colEnd), cellCount };
  }

  // Over the bound: the centred window. `min + (max - min) / 2` rather than `(min + max) / 2` --
  // the halves of an already-astronomical bbox must not sum their way to `Infinity` here.
  const centreCol = Math.floor((bbox.xmin + (bbox.xmax - bbox.xmin) / 2 - frame.originX) / cellSize);
  const centreRow = Math.floor((bbox.ymin + (bbox.ymax - bbox.ymin) / 2 - frame.originY) / cellSize);
  const half = COVER_WINDOW_CELLS_PER_AXIS / 2;
  const winColStart = Math.max(colStart, centreCol - half);
  const winColEnd = Math.min(colEnd, centreCol - half + COVER_WINDOW_CELLS_PER_AXIS - 1);
  const winRowStart = Math.max(rowStart, centreRow - half);
  const winRowEnd = Math.min(rowEnd, centreRow - half + COVER_WINDOW_CELLS_PER_AXIS - 1);
  if (!isEnumerableRange(winRowStart, winRowEnd) || !isEnumerableRange(winColStart, winColEnd)) {
    // A bbox with a non-finite coordinate has no finite centre cell to keep a window around, and one
    // absurdly far from the frame origin has no walkable one (`isEnumerableRange`) -- the cover is
    // reported truncated with nothing kept rather than guessed at.
    return { kind: "truncated", keys: [], cellCount, omittedCellCount: cellCount };
  }
  const keys = materialiseCells(winRowStart, winRowEnd, winColStart, winColEnd);
  return { kind: "truncated", keys, cellCount, omittedCellCount: cellCount - keys.length };
}
