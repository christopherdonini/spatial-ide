// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it } from "vitest";

import { TILE_GRID_DIMENSIONS } from "./tileGridConstants";
import {
  cellSizeForLevel,
  deriveTileGridFrame,
  tileBbox,
  tileCentre,
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
