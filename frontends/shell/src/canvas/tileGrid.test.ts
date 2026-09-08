// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it } from "vitest";

import { COVER_WINDOW_CELLS_PER_AXIS, MAX_COVERING_TILES, MAX_QUEUED_TILES, TILE_GRID_DIMENSIONS } from "./tileGridConstants";
import {
  cellSizeForLevel,
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

/** `WorkingCanvas.tsx:384-390`'s own `pixelsPerWorldUnitAtZoom(zoom) === 2 ** zoom`, restated here
 * rather than imported (that module needs a real `Deck`/WebGL context this test has no business
 * constructing). Zoom -64 is the exact value the K6 re-aim worker's own `e2eSetViewState(0, 0, -64)`
 * wedge used -- the run that hung the page and produced entry 60. */
function pixelsPerWorldUnitAtZoom(zoom: number): number {
  return 2 ** zoom;
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
    // applies, `tileViewportStreamManager.ts:367-379`).
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
    const n = 100; // 10,000 cells, under the 16,384 bound
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
