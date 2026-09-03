// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import type { ResidentBatch } from "./decodeBatch";

export interface PickResult {
  streamHandle: string;
  batchSeq: number;
  /** Authoritative stable identity (ADR-016 §7) -- a `bigint`, never narrowed to `Number`. */
  id: bigint;
  /** Authoritative f64 anchor coordinate for display: the exterior ring's first vertex. **Never**
   * derived from deck.gl's own unprojected pick coordinate, which is a renderer-local value with no
   * CRS tag (ADR-010 rule 1) -- see `PICKING.md` in this directory. */
  anchor: [number, number] | null;
}

/**
 * Viewport-residency cut P6a, decision 24(c) (ADR-028 item 4): the typed refusal a hover shows when
 * the cursor resolves to a real GPU pick ordinal but the resident data's own average feature size at
 * the current zoom is below `pickResolution.ts`'s declared threshold -- a distinct hover-readout
 * state, never null-silence (a plausible-but-arbitrary single feature would otherwise be shown, or
 * the hover would say nothing at all, both dishonest here). `kind` is the only field: there is no
 * feature identity to report, by construction -- naming one would be exactly the arbitrary answer
 * this state exists to refuse.
 */
export interface PickBelowResolution {
  kind: "below-pick-resolution";
}

/** `WorkingCanvasProps.onHover`'s own full result type -- `null` (nothing under the cursor),
 * `PickResult` (an ordinary, above-threshold pick), or `PickBelowResolution` (24(c)'s refusal).
 * Discriminate with `isPickBelowResolution` below, never a bare `"kind" in value` at a call site. */
export type HoverReadout = PickResult | PickBelowResolution | null;

export function isPickBelowResolution(value: HoverReadout): value is PickBelowResolution {
  return value !== null && "kind" in value && value.kind === "below-pick-resolution";
}

/**
 * Resolve a GPU pick ordinal against the resident batch its layer was built from -- ADR-010 rule
 * 2's whole indirection, restated as code: **GPU ordinal → stable feature ID → authoritative f64**.
 *
 * `gpuOrdinal` is `info.index`, used for exactly one thing: indexing into the *same* `ids`/`rings`
 * arrays the picked layer was built from (`buildLayers.ts`). It never leaves this function as a
 * bare number, and the caller must pass the batch `info.layer.id` actually names — see
 * `batchForLayerId` in `buildLayers.ts` — never any other batch, since an ordinal is only meaningful
 * relative to the buffer it indexes.
 */
export function resolvePick(batch: ResidentBatch, gpuOrdinal: number): PickResult | null {
  if (!Number.isInteger(gpuOrdinal) || gpuOrdinal < 0 || gpuOrdinal >= batch.ids.length) {
    return null;
  }
  const id = batch.ids[gpuOrdinal];
  const rings = batch.rings[gpuOrdinal];
  const anchor = rings.length > 0 && rings[0].length > 0 ? rings[0][0] : null;
  return { streamHandle: batch.streamHandle, batchSeq: batch.batchSeq, id, anchor };
}
