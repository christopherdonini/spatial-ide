// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import fs from "node:fs";
import path from "node:path";

/**
 * The engine's own Arrow IPC batches, committed by `engine/tests/geoarrow_batch_fixtures.rs` (BF-1 of
 * `engine/MULTIPOLYGON-MP1-PREREGISTRATION.md`) from a real `Dataset::open` and stream: the real shape
 * of each encoding for a consumer test, not a hand-built imitation. Shared by `canvas/decodeBatch.test
 * .ts` and `canvas/pick.test.ts`; one implementation only.
 */
const BF_DIR = path.resolve(__dirname, "../../../../engine/tests/data/geoarrow");

export function loadBatchFixture(name: "lv95-polygon-batch" | "lv95-multipolygon-batch"): Uint8Array {
  return new Uint8Array(fs.readFileSync(path.join(BF_DIR, `${name}.arrows`)));
}
