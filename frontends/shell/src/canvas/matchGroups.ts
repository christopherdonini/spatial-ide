// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import type { Style } from "../../../../renderer/style-ts/src/style";
import { readColumn } from "../attributes/values";
import type { ResidentBatch } from "./decodeBatch";

/** One batch's groups under one style, remembered with the `Style` they were computed for. */
interface CachedGroups {
  readonly style: Style;
  readonly groups: Uint8Array;
}

const groupCache = new WeakMap<ResidentBatch, CachedGroups>();

/**
 * The drawing group of every row of `batch` under `style` (SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md section 2.3 (c)): the index
 * into `style.groups`, which `Style.groupFor` gives for the row's value of the match column. Resolution is the imported resolver's
 * alone; this file reads the key column and asks. A NULL value asks with `null`, so it draws as the style's No value.
 *
 * A batch that does not hold the column as text (no attributes block, a not-held batch, or a block without the column) gives every row
 * `style.unmatchedGroup()`, the Other group (OPEN-3 (a)): the colour is a stated interim, not the row's value.
 *
 * Remembered per batch object and per `Style` object, so a pan or a recenter, which keep both, reads no column again; a new style
 * revision is a new `Style`, and a rebuilt batch (a duplicate drop) is a new batch.
 */
export function rowGroups(batch: ResidentBatch, style: Style): Uint8Array {
  const cached = groupCache.get(batch);
  if (cached !== undefined && cached.style === style) return cached.groups;
  const column = style.matchColumn;
  const values = column === null ? null : readColumn(batch, column);
  const groups = new Uint8Array(batch.ids.length);
  for (let row = 0; row < groups.length; row++) {
    groups[row] = values === null ? style.unmatchedGroup() : style.groupFor(values[row]);
  }
  groupCache.set(batch, { style, groups });
  return groups;
}
