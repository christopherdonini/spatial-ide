// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { tableFromIPC } from "apache-arrow";

/** ADR-010 rule 1's envelope tag, as `engine::envelope::BatchEnvelope` writes it. A batch whose
 * schema names a different frame is refused rather than rendered -- a bare buffer's only proof of
 * what space it is in lives here. */
export const EXPECTED_FRAME = "authoritative-project-crs";

export class UnexpectedFrameError extends Error {
  constructor(public readonly frame: string | undefined) {
    super(
      `batch schema names frame ${JSON.stringify(frame)}, expected ${JSON.stringify(EXPECTED_FRAME)} ` +
        "-- refusing rather than rendering an untagged or mistagged buffer (ADR-010 rule 1)"
    );
    this.name = "UnexpectedFrameError";
  }
}

/** The three geometry encodings the engine writes (ADR-034 Decision 2; the third is the points cut's,
 * `skp/0.10`), as the batch schema's `geometry_encoding` key and `describe.geometry.encoding` both
 * carry them. */
export const ENCODING_POLYGON = "geoarrow.polygon";
export const ENCODING_MULTIPOLYGON = "geoarrow.multipolygon";
export const ENCODING_POINT = "geoarrow.point";

/** What an open draws: polygons (the polygon and multipolygon encodings) or points. */
export type GeometryKind = "polygonal" | "point";

/**
 * The kind an open's encoding draws as -- pure, and derived from the encoding string alone. Only
 * `geoarrow.point` is `point`; every other value is `polygonal`, the path that existed before the
 * points cut, so that path is unchanged. A value the shell does not read at all is still refused by
 * `decodeBatch` (`UnexpectedEncodingError`) before any layer is built from it.
 */
export function geometryKindOf(encoding: string): GeometryKind {
  return encoding === ENCODING_POINT ? "point" : "polygonal";
}

/**
 * A batch whose `geometry_encoding` is not the encoding this open fixed (`describe.geometry
 * .encoding`), or is none of the three encodings this shell reads. Refused rather than walked: a
 * multipolygon batch read as polygon rings is walked one nesting level short, misread, with no error
 * raised (ADR-034 Consequences). The text is a P6 placeholder (the human's wording at P6, ADR-034
 * Acceptance item 6) and states the shell's own fact only.
 */
export class UnexpectedEncodingError extends Error {
  constructor(
    public readonly batchEncoding: string | undefined,
    public readonly expectedEncoding: string
  ) {
    super(
      `[P6 placeholder] batch schema names geometry encoding ${JSON.stringify(batchEncoding)}; this open's ` +
        `encoding is ${JSON.stringify(expectedEncoding)}, and the shell reads ${ENCODING_POLYGON}, ` +
        `${ENCODING_MULTIPOLYGON} and ${ENCODING_POINT} -- refusing rather than walking the batch at a ` +
        "guessed nesting depth"
    );
    this.name = "UnexpectedEncodingError";
  }
}

/** One ring: its `[x, y]` vertices in the dataset's own CRS, f64. */
export type Ring = Array<[number, number]>;
/** One part: a polygon's rings. Ring 0 is the exterior; any further rings are holes. */
export type Part = Ring[];

/**
 * One decoded batch, resident until its stream is superseded or closed.
 *
 * `ids`, `parts` and `partToRow` are built together, in one pass, over the same row index -- never
 * reordered, culled, sorted or produced independently. That is rule 2's actual hazard ("any cull,
 * chunk, sort or LOD" desyncing an ordinal from its identity), and building them from one decode pass
 * is what makes desyncing them structurally hard rather than a discipline to remember.
 *
 * **A feature is one row and may have several parts** (ADR-034 Decision 5: parts never become rows).
 * deck.gl draws one datum per part and picks by datum index, so a pick ordinal names a part
 * (`partToRow` turns it back into a row); see `PICKING.md`.
 *
 * **A Point row is one part holding one single-position ring**: `parts[row] = [[[[x, y]]]]` in the
 * `parts[feature][part][ring]` order above, so `partToRow` is the identity, and `partCount` and
 * `totalVertices` both equal the row count. The type is unchanged.
 */
export interface ResidentBatch {
  streamHandle: string;
  batchSeq: number;
  /** Authoritative stable identity (ADR-016 §7) -- never narrowed to `Number`. One per row. */
  ids: BigUint64Array;
  /** Authoritative f64 geometry per feature: `parts[feature][part][ring]` is an array of `[x, y]`
   * pairs in the dataset's own CRS. A Polygon row decodes as one part; a null geometry as none.
   * Never mutated, never sent to the GPU directly -- `offsetFrame.ts` derives a GPU-ready view from
   * this. */
  parts: Part[][];
  /** For each part, in feature-then-part order, the row (index into `ids` and `parts`) it belongs
   * to: the pick ordinal's map back to a feature. Non-decreasing, and `partToRow.length ===
   * partCount`. */
  partToRow: Int32Array;
  /** The number of parts in the batch: the number of deck.gl datums, so the pick-ordinal count that
   * `checkPickCeiling` bounds (ADR-010 rule 6). */
  partCount: number;
  totalVertices: number;
}

/**
 * Decode one self-contained Arrow IPC batch (`engine::envelope::TaggedBatch`'s wire form) into a
 * `ResidentBatch`. Throws `UnexpectedFrameError` if the schema's `frame` metadata is not what rule
 * 1 requires, `UnexpectedEncodingError` if its `geometry_encoding` is not `expectedEncoding` (the
 * open's own, from `describe`) or is none of the three encodings the shell reads, and propagates a decode error
 * rather than returning a partial batch.
 */
export function decodeBatch(
  streamHandle: string,
  batchSeq: number,
  ipcBytes: Uint8Array,
  geometryColumn: string,
  expectedEncoding: string
): ResidentBatch {
  const table = tableFromIPC(ipcBytes);
  const frame = table.schema.metadata.get("frame");
  if (frame !== EXPECTED_FRAME) {
    throw new UnexpectedFrameError(frame);
  }
  const encoding = table.schema.metadata.get("geometry_encoding");
  if (
    (encoding !== ENCODING_POLYGON && encoding !== ENCODING_MULTIPOLYGON && encoding !== ENCODING_POINT) ||
    encoding !== expectedEncoding
  ) {
    throw new UnexpectedEncodingError(encoding, expectedEncoding);
  }

  const idVector = table.getChild("id");
  if (!idVector) {
    throw new Error("batch carries no `id` column");
  }
  const geomVector = table.getChild(geometryColumn);
  if (!geomVector) {
    throw new Error(`batch carries no \`${geometryColumn}\` column`);
  }

  const n = table.numRows;
  const ids = new BigUint64Array(n);
  const parts: Part[][] = new Array(n);
  const partRows: number[] = [];
  let totalVertices = 0;

  for (let i = 0; i < n; i++) {
    const rawId = idVector.get(i);
    // The engine's schema declares `id: UInt64 not null` -- a null here is a batch that violates
    // its own envelope, and `BigInt(null)` would silently become `0n`, a value indistinguishable
    // from a real id ADR-016 §7's uniqueness guarantee is supposed to rule out.
    if (rawId === null) {
      throw new Error(`batch row ${i} carries a null id, violating the declared \`id: UInt64 not null\` schema`);
    }
    ids[i] = typeof rawId === "bigint" ? rawId : BigInt(rawId as number);

    const featureParts: Part[] = [];
    const geometry = geomVector.get(i);
    if (geometry !== null && encoding === ENCODING_POINT) {
      // `geoarrow.point` rows are one `FixedSizeList<2, f64>` slot: `Array.from` reads its x and y
      // with their bits as stored, no arithmetic. One part holding one single-position ring.
      const [x, y] = Array.from(geometry as Iterable<number>);
      featureParts.push([[[x, y]]]);
      partRows.push(i);
      totalVertices += 1;
    } else if (geometry !== null) {
      // `geoarrow.polygon` rows are a list of rings (one part); `geoarrow.multipolygon` rows are a
      // list of parts, each a list of rings. The level count is the batch's own encoding, checked
      // above, never guessed from the data.
      const sourceParts: Iterable<Iterable<Iterable<Iterable<number>>>> =
        encoding === ENCODING_MULTIPOLYGON
          ? (geometry as Iterable<Iterable<Iterable<Iterable<number>>>>)
          : [geometry as Iterable<Iterable<Iterable<number>>>];
      for (const sourcePart of sourceParts) {
        const rings: Part = [];
        for (const ring of sourcePart) {
          // `ring` is a List<FixedSizeList<2>> slice; iterating it yields one length-2 leaf Vector
          // per vertex. `.toJSON()` on the ring only shallow-converts the outer container -- each
          // vertex stays a Vector unless flattened here explicitly, which is why this reads each
          // leaf Float64 pair via `Array.from` rather than trusting a single `.toJSON()` call.
          const points: Ring = [];
          for (const vertex of ring) {
            const [x, y] = Array.from(vertex);
            points.push([x, y]);
          }
          rings.push(points);
          totalVertices += points.length;
        }
        featureParts.push(rings);
        partRows.push(i);
      }
    }
    parts[i] = featureParts;
  }

  return {
    streamHandle,
    batchSeq,
    ids,
    parts,
    partToRow: Int32Array.from(partRows),
    partCount: partRows.length,
    totalVertices,
  };
}
