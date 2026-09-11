// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it } from "vitest";

import {
  COVER_WINDOW_CELLS_PER_AXIS,
  INITIAL_TILE_KEY,
  MAX_COVERING_TILES,
  MAX_QUEUED_TILES,
  TILE_GRID_DIMENSIONS,
} from "./tileGridConstants";
import {
  cellSizeForLevel,
  coverMembershipFor,
  coveringCellCount,
  deriveTileGridFrame,
  tileBbox,
  tileCentre,
  tileCoverForBbox,
  tileDistanceToPoint,
  tileKeyToString,
  tilesCoveringBbox,
} from "./tileGrid";
import type { AuthoritativeBbox } from "./viewportBbox";

const ANCHOR: AuthoritativeBbox = { xmin: 0, ymin: 0, xmax: 100, ymax: 100 };

describe("deriveTileGridFrame", () => {
  it("pads x2 (doubles the anchor's own square span) and centres on the anchor's centre", () => {
    const frame = deriveTileGridFrame(ANCHOR);
    expect(frame.baseSpan).toBe(200); // 2x the 100-unit anchor span
    expect(frame.originX).toBe(-50); // centred: centre 50, half-span 100 -> origin 50-100
    expect(frame.originY).toBe(-50);
  });

  it("uses the larger of the two axis spans for a non-square anchor", () => {
    const frame = deriveTileGridFrame({ xmin: 0, ymin: 0, xmax: 100, ymax: 40 });
    expect(frame.baseSpan).toBe(200); // still the 100-unit X span doubled, not the 40-unit Y span
  });

  it("falls back to a declared minimum span for a degenerate (zero-area) anchor", () => {
    const frame = deriveTileGridFrame({ xmin: 5, ymin: 5, xmax: 5, ymax: 5 });
    expect(frame.baseSpan).toBeGreaterThan(0);
    expect(Number.isFinite(frame.baseSpan)).toBe(true);
  });

  it("is deterministic -- the same anchor always derives the same frame", () => {
    const a = deriveTileGridFrame(ANCHOR);
    const b = deriveTileGridFrame(ANCHOR);
    expect(a).toEqual(b);
  });
});

describe("cellSizeForLevel", () => {
  it("divides the frame's base span by each level's own dimension", () => {
    const frame = deriveTileGridFrame(ANCHOR); // baseSpan = 200
    expect(cellSizeForLevel(frame, "coarse")).toBeCloseTo(200 / 8);
    expect(cellSizeForLevel(frame, "medium")).toBeCloseTo(200 / 16);
    expect(cellSizeForLevel(frame, "fine")).toBeCloseTo(200 / 32);
  });

  it("every level's dimension matches the locked constants", () => {
    expect(TILE_GRID_DIMENSIONS).toEqual({ coarse: 8, medium: 16, fine: 32 });
  });
});

describe("tileKeyToString", () => {
  it("is stable and distinguishes row/col", () => {
    expect(tileKeyToString({ row: 1, col: 2 })).toBe("1:2");
    expect(tileKeyToString({ row: 2, col: 1 })).not.toBe(tileKeyToString({ row: 1, col: 2 }));
  });

  it("supports negative cell coordinates -- the grid has no boundary", () => {
    expect(tileKeyToString({ row: -3, col: -7 })).toBe("-3:-7");
  });
});

describe("tileBbox / round-trip", () => {
  it("round-trips through tilesCoveringBbox: querying exactly one cell's own bbox covers only that cell", () => {
    const frame = deriveTileGridFrame(ANCHOR);
    const key = { row: 3, col: -2 };
    const bbox = tileBbox(frame, "medium", key);
    const covering = tilesCoveringBbox(frame, "medium", bbox);
    expect(covering).toEqual([key]);
  });

  it("adjacent cells share exactly one edge, no gap and no overlap", () => {
    const frame = deriveTileGridFrame(ANCHOR);
    const a = tileBbox(frame, "medium", { row: 0, col: 0 });
    const b = tileBbox(frame, "medium", { row: 0, col: 1 });
    expect(a.xmax).toBeCloseTo(b.xmin);
    expect(a.ymin).toBeCloseTo(b.ymin);
    expect(a.ymax).toBeCloseTo(b.ymax);
  });
});

describe("tileCentre / tileDistanceToPoint", () => {
  it("centre sits at the bbox midpoint", () => {
    const frame = deriveTileGridFrame(ANCHOR);
    const key = { row: 0, col: 0 };
    const bbox = tileBbox(frame, "coarse", key);
    const centre = tileCentre(frame, "coarse", key);
    expect(centre.x).toBeCloseTo((bbox.xmin + bbox.xmax) / 2);
    expect(centre.y).toBeCloseTo((bbox.ymin + bbox.ymax) / 2);
  });

  it("distance to the tile's own centre is 0", () => {
    const frame = deriveTileGridFrame(ANCHOR);
    const key = { row: 2, col: 2 };
    const centre = tileCentre(frame, "medium", key);
    expect(tileDistanceToPoint(frame, "medium", key, centre)).toBeCloseTo(0);
  });

  it("a farther tile reports a larger distance", () => {
    const frame = deriveTileGridFrame(ANCHOR);
    const near = tileDistanceToPoint(frame, "medium", { row: 0, col: 0 }, { x: 0, y: 0 });
    const far = tileDistanceToPoint(frame, "medium", { row: 10, col: 10 }, { x: 0, y: 0 });
    expect(far).toBeGreaterThan(near);
  });
});

describe("tilesCoveringBbox: cover", () => {
  it("covers a bbox spanning multiple cells with exactly the intersecting cells", () => {
    const frame = deriveTileGridFrame(ANCHOR); // baseSpan 200, origin (-50,-50)
    const cellSize = cellSizeForLevel(frame, "coarse"); // 25
    // A query bbox spanning cells (0,0)-(1,1) at coarse level, offset from the origin.
    const bbox: AuthoritativeBbox = {
      xmin: frame.originX + 0.5 * cellSize,
      ymin: frame.originY + 0.5 * cellSize,
      xmax: frame.originX + 1.5 * cellSize,
      ymax: frame.originY + 1.5 * cellSize,
    };
    const covering = tilesCoveringBbox(frame, "coarse", bbox);
    expect(covering).toEqual([
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
    ]);
  });

  it("a degenerate (zero-width/height) bbox resolves to exactly one cell", () => {
    const frame = deriveTileGridFrame(ANCHOR);
    const point: AuthoritativeBbox = { xmin: 10, ymin: 10, xmax: 10, ymax: 10 };
    const covering = tilesCoveringBbox(frame, "fine", point);
    expect(covering).toHaveLength(1);
  });

  it("a bbox exactly aligned to cell boundaries does not spill an extra empty cell (misalignment case)", () => {
    const frame = deriveTileGridFrame(ANCHOR);
    const cellSize = cellSizeForLevel(frame, "medium");
    // Exactly two cells wide, boundary-aligned on every edge.
    const bbox: AuthoritativeBbox = {
      xmin: frame.originX,
      ymin: frame.originY,
      xmax: frame.originX + 2 * cellSize,
      ymax: frame.originY + cellSize,
    };
    const covering = tilesCoveringBbox(frame, "medium", bbox);
    expect(covering).toEqual([
      { row: 0, col: 0 },
      { row: 0, col: 1 },
    ]);
  });

  it("a bbox entirely outside the padded anchor square still resolves via plain cell arithmetic (no hard boundary)", () => {
    const frame = deriveTileGridFrame(ANCHOR); // baseSpan 200
    const farAway: AuthoritativeBbox = { xmin: 100_000, ymin: 100_000, xmax: 100_050, ymax: 100_050 };
    const covering = tilesCoveringBbox(frame, "medium", farAway);
    expect(covering.length).toBeGreaterThan(0);
    expect(covering[0].row).toBeGreaterThan(0);
    expect(covering[0].col).toBeGreaterThan(0);
  });
});

describe("tilesCoveringBbox: determinism and row-major order", () => {
  it("returns the same tiles in the same order across repeated calls", () => {
    const frame = deriveTileGridFrame(ANCHOR);
    const bbox: AuthoritativeBbox = { xmin: -10, ymin: -10, xmax: 60, ymax: 60 };
    const a = tilesCoveringBbox(frame, "fine", bbox);
    const b = tilesCoveringBbox(frame, "fine", bbox);
    expect(a).toEqual(b);
  });

  it("is row-major: ascending row outer, ascending col inner", () => {
    const frame = deriveTileGridFrame(ANCHOR);
    const cellSize = cellSizeForLevel(frame, "coarse");
    const bbox: AuthoritativeBbox = {
      xmin: frame.originX,
      ymin: frame.originY,
      xmax: frame.originX + 2 * cellSize,
      ymax: frame.originY + 2 * cellSize,
    };
    const covering = tilesCoveringBbox(frame, "coarse", bbox);
    expect(covering).toEqual([
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
    ]);
  });
});

// ---------------------------------------------------------------------------------------
// DECISIONS-PENDING entry 60, ruled (a) by the human on 2026-09-08 ("bound-before-allocate fix in
// this cut, unit test + 15-notch E2E step"); RELEASE-0.1.md Amendment 10's own preregistration.
// The defect these pin: `tilesCoveringBbox` materialised the whole cover with a plain nested loop
// on every debounced camera settle, and `MAX_QUEUED_TILES` truncated only afterwards -- so an
// ordinary wheel zoom-out far enough past a "Zoom to layer" fit put the canvas's single JS thread
// in a loop whose iteration count the camera alone decided (docs/01 principle 7).
// ---------------------------------------------------------------------------------------

/** Runs `run` with `Array.prototype.push` instrumented, returning how many elements were pushed
 * anywhere during it -- the "the loop never ran past the bound" evidence the preregistration asks
 * for, independent of what the returned list happens to look like (a hypothetical implementation
 * that materialised everything and then sliced would fail this even though its own result length
 * passed). Counts EVERY push in the call, not only this module's own, which can only over-count;
 * the assertions below are all upper bounds. */
function countingPushes<T>(run: () => T): { result: T; pushes: number } {
  const originalPush = Array.prototype.push;
  let pushes = 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Array.prototype.push = function (this: any[], ...items: any[]): number {
    pushes += items.length;
    return originalPush.apply(this, items);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any;
  try {
    const result = run();
    return { result, pushes };
  } finally {
    Array.prototype.push = originalPush;
  }
}

/** `WorkingCanvas.tsx:409-417`'s own `pixelsPerWorldUnitAtZoom(zoom) === 2 ** zoom`, restated here
 * rather than imported (that module needs a real `Deck`/WebGL context this test has no business
 * constructing). Zoom -64 is the exact value the K6 re-aim worker's own `e2eSetViewState(0, 0, -64)`
 * wedge used -- the run that hung the page and produced entry 60. */
function pixelsPerWorldUnitAtZoom(zoom: number): number {
  return 2 ** zoom;
}

/** A bbox spanning EXACTLY `cols` x `rows` cells at the medium level, anchored at the frame origin
 * and boundary-aligned on every edge -- `coveringIndexRange`'s own half-open rule puts an edge that
 * lands exactly on a cell boundary in the cell whose MIN edge it is, so the cover is `cols * rows`
 * cells, never one row/column more. Every span used below is exact in binary floating point (the
 * medium cell size here is 12.5), so these counts are equalities, not approximations. */
function bboxOfCells(frame: ReturnType<typeof deriveTileGridFrame>, cols: number, rows: number): AuthoritativeBbox {
  const cellSize = cellSizeForLevel(frame, "medium");
  return {
    xmin: frame.originX,
    ymin: frame.originY,
    xmax: frame.originX + cols * cellSize,
    ymax: frame.originY + rows * cellSize,
  };
}

/** The authoritative-CRS bbox a 1280x800 viewport (`src-tauri/tauri.conf.json`'s own window size)
 * covers at `zoom`, centred on `centre`. */
function viewportBboxAtZoom(zoom: number, centre: { x: number; y: number }): AuthoritativeBbox {
  const perUnit = pixelsPerWorldUnitAtZoom(zoom);
  const halfX = 1280 / perUnit / 2;
  const halfY = 800 / perUnit / 2;
  return { xmin: centre.x - halfX, ymin: centre.y - halfY, xmax: centre.x + halfX, ymax: centre.y + halfY };
}

describe("the declared enumeration bound (DECISIONS-PENDING entry 60): the cover is bounded BEFORE allocation", () => {
  it("the bound and its window are the declared multiple/square they claim to be", () => {
    // Declared, not discovered (ADR-010 rule 6) -- `tileGridConstants.ts` states both the multiple
    // and the reason; this pins the arithmetic those sentences rest on.
    expect(MAX_COVERING_TILES).toBe(MAX_QUEUED_TILES * 128);
    expect(COVER_WINDOW_CELLS_PER_AXIS ** 2).toBe(MAX_COVERING_TILES);
  });

  it("the zoom -64 viewport (the wedge that produced entry 60): counts the cover from the span, then allocates nothing beyond the bound", () => {
    const frame = deriveTileGridFrame(ANCHOR); // baseSpan 200, origin (-50,-50); medium cell 12.5
    const bbox = viewportBboxAtZoom(-64, { x: 0, y: 0 });

    // (a) The pre-check itself: rows x cols from the span, no allocation, no loop. The number is
    // astronomical -- which is precisely why nothing may be materialised from it.
    const cellCount = coveringCellCount(frame, "medium", bbox);
    expect(cellCount).toBeGreaterThan(1e40);

    // (b) The typed truncated outcome, and the allocation actually performed to produce it.
    const { result: cover, pushes } = countingPushes(() => tileCoverForBbox(frame, "medium", bbox));
    expect(cover.kind).toBe("truncated");
    expect(cover.keys.length).toBeLessThanOrEqual(MAX_COVERING_TILES);
    expect(pushes).toBeLessThanOrEqual(MAX_COVERING_TILES);
    expect(pushes).toBe(cover.keys.length); // nothing materialised and then thrown away either
    expect(cover.cellCount).toBe(cellCount);
    if (cover.kind !== "truncated") throw new Error("unreachable");
    expect(cover.omittedCellCount).toBeGreaterThan(1e40);

    // (c) What it kept: the centred window, so the cells nearest the view centre are the ones a
    // caller can still request (the same nearest-first keep the stream manager's own truncation
    // applies, `tileViewportStreamManager.ts:468-480`).
    expect(cover.keys.length).toBe(COVER_WINDOW_CELLS_PER_AXIS ** 2);
    const centreCell = tilesCoveringBbox(frame, "medium", { xmin: 0, ymin: 0, xmax: 0, ymax: 0 })[0];
    expect(cover.keys.map(tileKeyToString)).toContain(tileKeyToString(centreCell));

    // (d) The keys-only projection every other caller uses is bounded by the same call.
    expect(tilesCoveringBbox(frame, "medium", bbox).length).toBeLessThanOrEqual(MAX_COVERING_TILES);
  });

  it("a cover just past the bound is truncated to the window and says by how much", () => {
    const frame = deriveTileGridFrame(ANCHOR);
    const cellSize = cellSizeForLevel(frame, "medium"); // 12.5
    const n = 300; // 300 x 300 = 90,000 cells > MAX_COVERING_TILES (65,536)
    const bbox: AuthoritativeBbox = {
      xmin: frame.originX,
      ymin: frame.originY,
      xmax: frame.originX + n * cellSize,
      ymax: frame.originY + n * cellSize,
    };
    expect(coveringCellCount(frame, "medium", bbox)).toBe(n * n);

    const { result: cover, pushes } = countingPushes(() => tileCoverForBbox(frame, "medium", bbox));
    expect(cover.kind).toBe("truncated");
    if (cover.kind !== "truncated") throw new Error("unreachable");
    expect(cover.keys.length).toBe(COVER_WINDOW_CELLS_PER_AXIS ** 2);
    expect(cover.keys.length).toBeLessThanOrEqual(MAX_COVERING_TILES);
    expect(pushes).toBeLessThanOrEqual(MAX_COVERING_TILES);
    expect(cover.omittedCellCount).toBe(n * n - COVER_WINDOW_CELLS_PER_AXIS ** 2);
    // Row-major within the window, and deterministic across calls -- the ordering contract this
    // module has always had is not weakened by being bounded.
    expect(tileCoverForBbox(frame, "medium", bbox).keys).toEqual(cover.keys);
    for (let i = 1; i < cover.keys.length; i++) {
      const prev = cover.keys[i - 1];
      const next = cover.keys[i];
      expect(next.row > prev.row || (next.row === prev.row && next.col > prev.col)).toBe(true);
    }
  });

  it("a cover AT or under the bound is complete and identical to what it always was", () => {
    const frame = deriveTileGridFrame(ANCHOR);
    const cellSize = cellSizeForLevel(frame, "medium");
    const n = 100; // 10,000 cells, under the 65,536 bound (`MAX_COVERING_TILES`)
    const bbox: AuthoritativeBbox = {
      xmin: frame.originX,
      ymin: frame.originY,
      xmax: frame.originX + n * cellSize,
      ymax: frame.originY + n * cellSize,
    };
    const cover = tileCoverForBbox(frame, "medium", bbox);
    expect(cover.kind).toBe("complete");
    expect(cover.keys.length).toBe(n * n);
    expect(cover.cellCount).toBe(n * n);
    expect(cover.keys[0]).toEqual({ row: 0, col: 0 });
    expect(tilesCoveringBbox(frame, "medium", bbox)).toEqual(cover.keys);
  });

  it("AT the bound exactly (65,536 cells) the cover is COMPLETE and enumerated in full", () => {
    // Reviewer gate should-fix 2: the `<=` in `tileCoverForBbox`'s own pre-check, pinned from below.
    // Nothing else in this file exercises the boundary itself -- the cases either side of it are
    // 10,000 and 90,000 cells.
    const frame = deriveTileGridFrame(ANCHOR);
    const bbox = bboxOfCells(frame, COVER_WINDOW_CELLS_PER_AXIS, COVER_WINDOW_CELLS_PER_AXIS); // 256 x 256
    expect(coveringCellCount(frame, "medium", bbox)).toBe(MAX_COVERING_TILES);

    const { result: cover, pushes } = countingPushes(() => tileCoverForBbox(frame, "medium", bbox));
    expect(cover.kind).toBe("complete");
    expect(cover.cellCount).toBe(MAX_COVERING_TILES);
    expect(cover.keys.length).toBe(MAX_COVERING_TILES); // every cell, not a window that happens to match
    expect(pushes).toBe(MAX_COVERING_TILES);
    expect(cover.keys[0]).toEqual({ row: 0, col: 0 });
    expect(cover.keys[cover.keys.length - 1]).toEqual({
      row: COVER_WINDOW_CELLS_PER_AXIS - 1,
      col: COVER_WINDOW_CELLS_PER_AXIS - 1,
    });
  });

  it("ONE cell past the bound (65,537) is truncated -- so the comparison is `<=`, not `<`", () => {
    // The same boundary from above. 65,537 is prime, so the only cell rectangle with exactly
    // MAX_COVERING_TILES + 1 cells is 65,537 x 1 -- which is what this builds.
    const frame = deriveTileGridFrame(ANCHOR);
    const bbox = bboxOfCells(frame, MAX_COVERING_TILES + 1, 1);
    expect(coveringCellCount(frame, "medium", bbox)).toBe(MAX_COVERING_TILES + 1);

    const { result: cover, pushes } = countingPushes(() => tileCoverForBbox(frame, "medium", bbox));
    expect(cover.kind).toBe("truncated");
    if (cover.kind !== "truncated") throw new Error("unreachable");
    expect(cover.cellCount).toBe(MAX_COVERING_TILES + 1);
    expect(cover.keys.length).toBe(COVER_WINDOW_CELLS_PER_AXIS); // 256 columns of the single row
    expect(cover.omittedCellCount).toBe(MAX_COVERING_TILES + 1 - COVER_WINDOW_CELLS_PER_AXIS);
    expect(pushes).toBe(cover.keys.length);
  });

  it("a cover overrunning the bound on ONE axis keeps the OTHER axis whole", () => {
    // Reviewer gate should-fix 3: `tileGrid.ts:286-287` claims exactly this ("intersected with the
    // real cover, so a cover overrunning the bound on one axis only keeps the other axis whole") and
    // nothing pinned it.
    const frame = deriveTileGridFrame(ANCHOR);
    const flat = tileCoverForBbox(frame, "medium", bboxOfCells(frame, 100_000, 1));
    expect(flat.kind).toBe("truncated");
    expect(flat.keys.length).toBe(COVER_WINDOW_CELLS_PER_AXIS); // the column axis alone is windowed
    expect(new Set(flat.keys.map((k) => k.row)).size).toBe(1);

    // Three rows deep, so "kept whole" is not vacuously true of a single row: all three rows survive
    // (3 < 256, so the row window never binds), and only the column axis is clipped.
    const deeper = tileCoverForBbox(frame, "medium", bboxOfCells(frame, 100_000, 3));
    expect(deeper.kind).toBe("truncated");
    expect(deeper.keys.length).toBe(COVER_WINDOW_CELLS_PER_AXIS * 3);
    expect([...new Set(deeper.keys.map((k) => k.row))].sort((a, b) => a - b)).toEqual([0, 1, 2]);
    expect(new Set(deeper.keys.map((k) => k.col)).size).toBe(COVER_WINDOW_CELLS_PER_AXIS);
  });

  it("a non-finite bbox is truncated with nothing kept -- and, above all, RETURNS", () => {
    const frame = deriveTileGridFrame(ANCHOR);
    const cover = tileCoverForBbox(frame, "medium", {
      xmin: Number.NEGATIVE_INFINITY,
      ymin: Number.NEGATIVE_INFINITY,
      xmax: Number.POSITIVE_INFINITY,
      ymax: Number.POSITIVE_INFINITY,
    });
    expect(cover.kind).toBe("truncated");
    expect(cover.keys).toEqual([]);
  });

  it("a bbox whose cell indices exceed the safe-integer range is truncated with nothing kept -- and RETURNS", () => {
    // Past 2^53 an index increment is a no-op in double arithmetic, so a `for (i = start; i <= end;
    // i++)` loop over such a range never terminates however few cells it nominally spans
    // (`isEnumerableRange`). One cell, 1e30 units from the frame origin: bounded by COUNT alone this
    // would still have hung.
    const frame = deriveTileGridFrame(ANCHOR);
    const cover = tileCoverForBbox(frame, "medium", { xmin: 1e30, ymin: 1e30, xmax: 1e30 + 1, ymax: 1e30 + 1 });
    expect(cover.kind).toBe("truncated");
    expect(cover.keys).toEqual([]);
  });
});

describe("misaligned grid (RESIDENCY-PREREGISTRATION.md's own deliberate-misalignment fixture case)", () => {
  it("a grid frame derived from an anchor NOT aligned to a round number still covers deterministically", () => {
    const oddAnchor: AuthoritativeBbox = { xmin: 17.3, ymin: -4.9, xmax: 233.1, ymax: 88.6 };
    const frame = deriveTileGridFrame(oddAnchor);
    const bbox: AuthoritativeBbox = { xmin: 50, ymin: 10, xmax: 90, ymax: 40 };
    const a = tilesCoveringBbox(frame, "fine", bbox);
    const b = tilesCoveringBbox(frame, "fine", bbox);
    expect(a).toEqual(b);
    expect(a.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------------------
// Entry 66 (b) (`frontends/shell/ENTRY-66B-PREREGISTRATION.md`, pre-committed tests 3 and 6):
// protection is a PREDICATE over the cover's own index ranges, so it no longer depends on what the
// enumeration bound materialised. These tests are that predicate's own contract: it agrees with
// `tileCoverForBbox`'s key set for every cover at or under `MAX_COVERING_TILES` (test 3, including
// the boundary-exact and degenerate-point cases the half-open convention exists for), and it is
// TOTAL over any string whatsoever (test 6).
// ---------------------------------------------------------------------------------------

describe("coverMembershipFor (entry 66 (b)): agreement with the cover at or under the bound", () => {
  /** The index rectangle enclosing `keys` -- the agreement below is compared over that rectangle
   * plus a RING of cells outside it, so a predicate that admits one extra column (a closed-bbox
   * intersection at a boundary-exact edge) fails here as loudly as one that drops an edge. */
  function enclosingRect(keys: { row: number; col: number }[]): {
    rowMin: number;
    rowMax: number;
    colMin: number;
    colMax: number;
  } {
    let rowMin = Infinity;
    let rowMax = -Infinity;
    let colMin = Infinity;
    let colMax = -Infinity;
    for (const k of keys) {
      if (k.row < rowMin) rowMin = k.row;
      if (k.row > rowMax) rowMax = k.row;
      if (k.col < colMin) colMin = k.col;
      if (k.col > colMax) colMax = k.col;
    }
    return { rowMin, rowMax, colMin, colMax };
  }

  it("the predicate's key set EQUALS tilesCoveringBbox's, over a sweep of bboxes at or under the bound", () => {
    const frame = deriveTileGridFrame(ANCHOR); // baseSpan 200, origin (-50,-50); medium cell 12.5
    const cellSize = cellSizeForLevel(frame, "medium");
    const cases: { name: string; bbox: AuthoritativeBbox }[] = [
      {
        name: "an offset multi-cell bbox (both edges mid-cell)",
        bbox: {
          xmin: frame.originX + 0.5 * cellSize,
          ymin: frame.originY + 0.5 * cellSize,
          xmax: frame.originX + 3.5 * cellSize,
          ymax: frame.originY + 2.5 * cellSize,
        },
      },
      {
        name: "boundary-exact on BOTH axes (xmax and ymax land exactly on cell boundaries)",
        bbox: {
          xmin: frame.originX,
          ymin: frame.originY,
          xmax: frame.originX + 2 * cellSize,
          ymax: frame.originY + cellSize,
        },
      },
      { name: "a degenerate point", bbox: { xmin: 10, ymin: 10, xmax: 10, ymax: 10 } },
      {
        name: "a region at negative cell indices (the grid has no boundary)",
        bbox: { xmin: -1000, ymin: -1000, xmax: -1000 + 3 * cellSize, ymax: -1000 + 3 * cellSize },
      },
      { name: "a large cover still under the bound (100 x 100 cells)", bbox: bboxOfCells(frame, 100, 100) },
    ];

    const mismatches: string[] = [];
    for (const c of cases) {
      const cover = tileCoverForBbox(frame, "medium", c.bbox);
      // Agreement is claimed for covers AT OR UNDER the bound and no others (past it the predicate is
      // a declared SUPERSET) -- so every sweep case must genuinely be in that regime.
      expect(cover.kind).toBe("complete");
      const coverKeys = new Set(cover.keys.map(tileKeyToString));
      const membership = coverMembershipFor(frame, "medium", c.bbox);
      const { rowMin, rowMax, colMin, colMax } = enclosingRect(cover.keys);
      for (let row = rowMin - 2; row <= rowMax + 2; row++) {
        for (let col = colMin - 2; col <= colMax + 2; col++) {
          const key = tileKeyToString({ row, col });
          const inCover = coverKeys.has(key);
          const inMembership = membership.has(key);
          if (inCover !== inMembership) {
            mismatches.push(`${c.name}: ${key} -- cover ${inCover}, predicate ${inMembership}`);
          }
        }
      }
    }
    expect(mismatches).toEqual([]);
  });

  it("the boundary-exact case: the column whose MIN edge equals xmax is in NEITHER the cover nor the predicate", () => {
    // Half-open in coordinate space: a bbox edge landing exactly on a cell boundary belongs to the
    // cell whose MIN edge it is (`coveringIndexRange`'s own doc comment). A closed-bbox intersection
    // (`tileBbox(key)` overlapping the query with `<=`/`>=`) would admit the next column -- one extra
    // ring the cover never names, so a tile the eviction rule keeps and no round ever refreshes.
    const frame = deriveTileGridFrame(ANCHOR);
    const cellSize = cellSizeForLevel(frame, "medium");
    const bbox: AuthoritativeBbox = {
      xmin: frame.originX,
      ymin: frame.originY,
      xmax: frame.originX + 2 * cellSize,
      ymax: frame.originY + cellSize,
    };
    const coverKeys = new Set(tilesCoveringBbox(frame, "medium", bbox).map(tileKeyToString));
    const membership = coverMembershipFor(frame, "medium", bbox);
    expect(coverKeys).toEqual(new Set(["0:0", "0:1"]));
    // The xmax column (col 2) and the ymax row (row 1): in neither.
    expect(coverKeys.has("0:2")).toBe(false);
    expect(membership.has("0:2")).toBe(false);
    expect(coverKeys.has("1:0")).toBe(false);
    expect(membership.has("1:0")).toBe(false);
    // ...while every cell the cover DOES name is a member.
    expect(membership.has("0:0")).toBe(true);
    expect(membership.has("0:1")).toBe(true);
  });

  it("past the bound the predicate answers for the WHOLE cover, where the enumerated window does not", () => {
    // The declared-superset half of the same contract, and the case entry 66 (b) exists for:
    // `tileCoverForBbox` reports `"truncated"` and keeps the centred window, while the predicate
    // still answers `true` for a covered cell that window omits.
    const frame = deriveTileGridFrame(ANCHOR);
    const bbox = bboxOfCells(frame, 300, 300); // 90,000 cells > MAX_COVERING_TILES (65,536)
    const cover = tileCoverForBbox(frame, "medium", bbox);
    expect(cover.kind).toBe("truncated");
    const windowKeys = new Set(cover.keys.map(tileKeyToString));
    const membership = coverMembershipFor(frame, "medium", bbox);
    expect(windowKeys.has("0:0")).toBe(false); // the corner cell: covered, but outside the window
    expect(membership.has("0:0")).toBe(true);
    expect(membership.has("299:299")).toBe(true);
    expect(membership.has("300:0")).toBe(false); // one row past the cover: still not a member
  });
});

describe("coverMembershipFor: totality (entry 66 (b), block-on-sight 7)", () => {
  it("answers false -- and never throws -- for any string that is not a row:col cell", () => {
    const frame = deriveTileGridFrame(ANCHOR);
    const membership = coverMembershipFor(frame, "medium", { xmin: -50, ymin: -50, xmax: 50, ymax: 50 });
    // `INITIAL_TILE_KEY` genuinely reaches this predicate in the product (`planTileEviction`'s own
    // filter and `evictTile`'s own guard both test the protection set with it), and the two
    // `parseTileKey` helpers this module deliberately does NOT reuse (`tileIngest.ts`,
    // `WorkingCanvas.tsx`) THROW on exactly these inputs.
    for (const key of [INITIAL_TILE_KEY, "garbage", "", "1:2:3"]) {
      expect(() => membership.has(key)).not.toThrow();
      expect(membership.has(key)).toBe(false);
    }
  });

  it("a non-finite bbox protects nothing", () => {
    const frame = deriveTileGridFrame(ANCHOR);
    const nonFinite: AuthoritativeBbox = {
      xmin: Number.NEGATIVE_INFINITY,
      ymin: Number.NEGATIVE_INFINITY,
      xmax: Number.POSITIVE_INFINITY,
      ymax: Number.POSITIVE_INFINITY,
    };
    const membership = coverMembershipFor(frame, "medium", nonFinite);
    expect(membership.has("0:0")).toBe(false);
    expect(membership.has("-5:12")).toBe(false);
    // Matching `tileCoverForBbox`'s own empty-keys outcome for the same bbox.
    expect(tileCoverForBbox(frame, "medium", nonFinite).keys).toEqual([]);
  });
});
