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
  name: "lv95-polygon-batch" | "lv95-multipolygon-batch" | "lv95-point-batch"
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
