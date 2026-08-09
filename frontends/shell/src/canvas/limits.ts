/**
 * Declared capacity ceilings (ADR-010 rule 6: "declared, not discovered"). A ceiling with no number
 * is not declared, so the values live here and are asserted at the point they could be exceeded --
 * never merely stated in prose.
 */

/**
 * deck.gl's pick index is 24-bit: 16,777,215 features per layer, and past it
 * `encodePickingColor`/`decodePickingColor` truncate to a **wrong-but-plausible index with nothing
 * raised** (ADR-010 rule 6, read from deck.gl 9.3.7 source).
 *
 * **Sharding strategy, declared before it is approached:** one deck.gl layer per resident batch
 * (`ResidentBatch`). A batch is bounded by the data plane's `MAX_FRAME_BYTES` (16 MiB), so per-layer
 * feature counts sit orders of magnitude below this ceiling by construction. A batch that would
 * exceed it anyway is refused and not rendered -- see `checkPickCeiling`.
 */
export const DECKGL_PICK_INDEX_CEILING = 16_777_215;

/**
 * Bounds the cost of rule 2's own requirement: keeping the authoritative f64 lookup table resident
 * doubles coordinate memory against f32-only rendering. This is the resident-vertex ceiling across
 * every batch of every live stream in the shell, not per-batch -- past it the shell stops accepting
 * further batches for that stream, cancels it, and shows a visible typed refusal naming this
 * constant. It does not evict silently (a partial view presented as complete) and it does not
 * start tiling (ADR-011 binds nothing and is not implemented here).
 */
export const MAX_RESIDENT_VERTICES = 2_000_000;

export class PickCeilingExceeded extends Error {
  constructor(public readonly featureCount: number) {
    super(
      `batch has ${featureCount} features, above the declared 24-bit picking ceiling of ` +
        `${DECKGL_PICK_INDEX_CEILING} (ADR-010 rule 6) -- refused, not rendered`
    );
    this.name = "PickCeilingExceeded";
  }
}

export function checkPickCeiling(featureCount: number): void {
  if (featureCount > DECKGL_PICK_INDEX_CEILING) {
    throw new PickCeilingExceeded(featureCount);
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
