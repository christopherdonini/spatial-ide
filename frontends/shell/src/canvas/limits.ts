// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * Declared capacity ceilings (ADR-010 rule 6: "declared, not discovered"). A ceiling with no number
 * is not declared, so the values live here and are asserted at the point they could be exceeded --
 * never merely stated in prose.
 */

/**
 * deck.gl's pick index is 24-bit: 16,777,215 picking indices per layer, and past it
 * `encodePickingColor`/`decodePickingColor` truncate to a **wrong-but-plausible index with nothing
 * raised** (ADR-010 rule 6, read from deck.gl 9.3.7 source).
 *
 * **The ceiling is counted in parts, not features** (ADR-034 Decision 6): one deck.gl datum is one
 * polygon part and the pick index is the datum index, so a multi-part feature uses one index per
 * part. `checkPickCeiling` is called with a batch's `partCount` at both product sites
 * (`buildLayers.ts`, `residentSet.ts`).
 *
 * **Sharding strategy, declared before it is approached:** one deck.gl layer per resident batch
 * (`ResidentBatch`). A batch is bounded by the data plane's `MAX_FRAME_BYTES` (16 MiB), so per-layer
 * part counts sit orders of magnitude below this ceiling by construction. A batch that would
 * exceed it anyway is refused and not rendered -- see `checkPickCeiling`.
 */
export const DECKGL_PICK_INDEX_CEILING = 16_777_215;

/**
 * Bounds the cost of rule 2's own requirement: keeping the authoritative f64 lookup table resident
 * doubles coordinate memory against f32-only rendering. This is the resident-vertex ceiling across
 * every batch of every live stream in the shell, not per-batch. **Candidate arm** (the default, as
 * of RELEASE-0.1 item 7, 2026-09-07, DECISIONS-PENDING entry 52 = (a) applying ADR-028, Accepted
 * 2026-09-02 -- `DEFAULT_RESIDENCY_ARM` is `"candidate"`; only a dev-gated `setResidencyArm`
 * call can select baseline instead, see `residency/residencyArm.ts`): past it, distance-ordered
 * eviction keeps the resident set under this same ceiling and the shell shows a declared
 * partial-view status instead of a refusal (`residencyStatus.ts`). **Baseline arm** (selectable in
 * dev only; the discharged interim, ADR-011 gate 8, met 2026-09-02, discharged by ADR-028): past
 * it the shell stops accepting further batches
 * for that stream, cancels it, and shows a visible typed refusal naming this constant -- no silent
 * eviction, no partial view presented as complete. The ceiling value itself is unchanged, only what
 * happens at it differs by arm.
 *
 * **Open, unmeasured cost (2026-09-02 reviewer finding, viewport-residency P9):** the candidate
 * arm's per-tile render-layer cache (`buildLayers.ts`'s `geometryCache`) retains a THIRD `[x, y]`
 * copy per cached resident vertex -- the authoritative f64 array above, this file's own f32-render
 * doubling, and now the cache's own retained local-coordinate copy -- for as long as each batch
 * stays resident. Bounded by this same ceiling via the cache's `WeakMap` keying (it cannot grow
 * past the resident set independently), but the actual heap delta this adds at the ceiling is not
 * measured anywhere in this cut. Named debt, not silently folded into "doubles" above.
 *
 * **Open, unmeasured cost (MP-1, ADR-034 Decision 6):** `ResidentBatch.parts` adds one array level
 * per feature (a Polygon is one part), and `partToRow` is one `Int32Array` entry per part, resident
 * with the batch. Their heap cost at this ceiling is not measured anywhere in this cut. The
 * vertex ceiling itself counts vertices and is unchanged.
 */
export const MAX_RESIDENT_VERTICES = 2_000_000;

export class PickCeilingExceeded extends Error {
  constructor(public readonly pickOrdinalCount: number) {
    super(
      `[P6 placeholder] batch has ${pickOrdinalCount} pick ordinals (polygon parts), above the declared ` +
        `24-bit picking ceiling of ${DECKGL_PICK_INDEX_CEILING} (ADR-010 rule 6) -- refused, not rendered`
    );
    this.name = "PickCeilingExceeded";
  }
}

/** `pickOrdinalCount` is a batch's `partCount`: one pick ordinal per polygon part, never the
 * feature count (a multi-part feature uses several). */
export function checkPickCeiling(pickOrdinalCount: number): void {
  if (pickOrdinalCount > DECKGL_PICK_INDEX_CEILING) {
    throw new PickCeilingExceeded(pickOrdinalCount);
  }
}

export class ResidentVertexCeilingExceeded extends Error {
  constructor(public readonly attemptedTotal: number) {
    super(
      `accepting this batch would carry ${attemptedTotal} resident vertices, above the declared ` +
        `ceiling of ${MAX_RESIDENT_VERTICES} (MAX_RESIDENT_VERTICES) -- the stream is cancelled ` +
        `rather than silently evicting or tiling`
    );
    this.name = "ResidentVertexCeilingExceeded";
  }
}
