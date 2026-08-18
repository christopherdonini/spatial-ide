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

/**
 * One decoded batch, resident until its stream is superseded or closed.
 *
 * `ids` and `rings` are built together, in one pass, over the same row index -- never reordered,
 * culled, sorted or produced independently. That is rule 2's actual hazard ("any cull, chunk, sort
 * or LOD" desyncing an ordinal from its identity), and building both from one decode pass is what
 * makes desyncing them structurally hard rather than a discipline to remember.
 */
export interface ResidentBatch {
  streamHandle: string;
  batchSeq: number;
  /** Authoritative stable identity (ADR-016 §7) -- never narrowed to `Number`. */
  ids: BigUint64Array;
  /** Authoritative f64 polygon rings per feature: `rings[feature][ring]` is an array of `[x, y]`
   * pairs in the dataset's own CRS. Ring 0 is the exterior; any further rings are holes. Never
   * mutated, never sent to the GPU directly -- `offsetFrame.ts` derives a GPU-ready view from this. */
  rings: Array<Array<[number, number]>>[];
  totalVertices: number;
}

/**
 * Decode one self-contained Arrow IPC batch (`engine::envelope::TaggedBatch`'s wire form) into a
 * `ResidentBatch`. Throws `UnexpectedFrameError` if the schema's `frame` metadata is not what rule
 * 1 requires, and propagates a decode error rather than returning a partial batch.
 */
export function decodeBatch(
  streamHandle: string,
  batchSeq: number,
  ipcBytes: Uint8Array,
  geometryColumn: string
): ResidentBatch {
  const table = tableFromIPC(ipcBytes);
  const frame = table.schema.metadata.get("frame");
  if (frame !== EXPECTED_FRAME) {
    throw new UnexpectedFrameError(frame);
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
  const rings: Array<Array<[number, number]>>[] = new Array(n);
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

    const featureRings: Array<Array<[number, number]>> = [];
    const polygon = geomVector.get(i);
    if (polygon !== null) {
      for (const ring of polygon as Iterable<Iterable<Iterable<number>>>) {
        // `ring` is a List<FixedSizeList<2>> slice; iterating it yields one length-2 leaf Vector
        // per vertex. `.toJSON()` on the ring only shallow-converts the outer container -- each
        // vertex stays a Vector unless flattened here explicitly, which is why this reads each
        // leaf Float64 pair via `Array.from` rather than trusting a single `.toJSON()` call.
        const points: Array<[number, number]> = [];
        for (const vertex of ring) {
          const [x, y] = Array.from(vertex);
          points.push([x, y]);
        }
        featureRings.push(points);
        totalVertices += points.length;
      }
    }
    rings[i] = featureRings;
  }

  return { streamHandle, batchSeq, ids, rings, totalVertices };
}
