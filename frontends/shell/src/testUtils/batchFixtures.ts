// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import fs from "node:fs";
import path from "node:path";

/**
 * The engine's own Arrow IPC batches, committed by `engine/tests/geoarrow_batch_fixtures.rs` (BF-1 of
 * `engine/MULTIPOLYGON-MP1-PREREGISTRATION.md`) from a real `Dataset::open` and stream: the real shape
 * of each encoding for a consumer test, not a hand-built imitation. Shared by `canvas/decodeBatch.test
 * .ts`, `canvas/pick.test.ts` and `canvas/buildLayers.test.ts`; one implementation only.
 */
const BF_DIR = path.resolve(__dirname, "../../../../engine/tests/data/geoarrow");

export function loadBatchFixture(
  name:
    | "lv95-polygon-batch"
    | "lv95-multipolygon-batch"
    | "lv95-point-batch"
    | "lv95-linestring-batch"
    | "lv95-multilinestring-batch"
): Uint8Array {
  return new Uint8Array(fs.readFileSync(path.join(BF_DIR, `${name}.arrows`)));
}

/**
 * The six positions of `lv95-point-batch` (BF-P of `engine/GEOMETRY-POINTS-PREREGISTRATION.md`), the
 * points cut's fixture P-1: `engine::fixture::point_p1([2_600_000, 1_200_000], 10)` evaluated in the
 * same operation order, so each coordinate is the same IEEE-754 double. Each carries a fraction in its
 * low bits that an `f32` narrowing or a swapped axis changes.
 */
export function pointP1Positions(): Array<[number, number]> {
  const [ox, oy, unit] = [2_600_000, 1_200_000, 10];
  return Array.from({ length: 6 }, (_, k): [number, number] => {
    const [i, j] = [k % 3, Math.floor(k / 3)];
    const frac = (k + 1) * 0.123_456_789;
    return [ox + i * unit + frac, oy + j * unit + 1.0 - frac];
  });
}

/** Positions on a lattice, as `engine::fixture`'s `lattice_positions` evaluates them, in the same
 * operation order so each coordinate is the same IEEE-754 double: `first` is the running counter of the
 * whole fixture, and each position carries a fraction in its low bits that an `f32` narrowing or a
 * swapped axis changes. */
function latticePositions(
  lattice: ReadonlyArray<readonly [number, number]>,
  first: number,
  origin: readonly [number, number],
  unit: number
): Array<[number, number]> {
  const [ox, oy] = origin;
  return lattice.map(([i, j], n): [number, number] => {
    const frac = (first + n + 1) * 0.123_456_789;
    return [ox + i * unit + frac, oy + j * unit + 1.0 - frac];
  });
}

/**
 * The positions of `lv95-linestring-batch` (BF-L of `engine/GEOMETRY-LINES-PREREGISTRATION.md`), the
 * lines cut's fixture L-1: `engine::fixture::line_l1([2_600_000, 1_200_000], 10)`, one array per row.
 * Five rows of 2, 3, 5, 2 and 4 positions; rows 1 and 3 cross.
 */
export function lineL1Positions(): Array<Array<[number, number]>> {
  const lattice: ReadonlyArray<ReadonlyArray<readonly [number, number]>> = [
    [[0, 0], [6, 0]],
    [[0, 3], [4, 5], [8, 3]],
    [[10, 0], [12, 3], [14, 0], [16, 3], [18, 0]],
    [[1, 7], [7, 1]],
    [[10, 6], [12, 8], [14, 6], [16, 8]],
  ];
  let first = 0;
  return lattice.map((row) => {
    const run = latticePositions(row, first, [2_600_000, 1_200_000], 10);
    first += row.length;
    return run;
  });
}

/**
 * The positions of `lv95-multilinestring-batch` (BF-ML), the lines cut's fixture ML-1:
 * `engine::fixture::multilinestring_ml1([2_600_000, 1_200_000], 10)`, one array of parts per row. Three
 * rows of 2, 1 and 3 parts, so that the part ordinals 0 to 5 differ from the row indices from the
 * second row on.
 */
export function multilinestringMl1Positions(): Array<Array<Array<[number, number]>>> {
  const lattice: ReadonlyArray<ReadonlyArray<ReadonlyArray<readonly [number, number]>>> = [
    [[[0, 0], [5, 0]], [[0, 2], [3, 4], [6, 2]]],
    [[[8, 0], [8, 6]]],
    [[[10, 0], [12, 2]], [[10, 3], [13, 3]], [[10, 6], [11, 8], [13, 8], [14, 6]]],
  ];
  let first = 0;
  return lattice.map((row) =>
    row.map((part) => {
      const run = latticePositions(part, first, [2_600_000, 1_200_000], 10);
      first += part.length;
      return run;
    })
  );
}
