// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * Decoding one Arrow IPC batch into what the canvas draws, and checking what the wire promised.
 *
 * Two things happen here that are not "just decoding":
 *
 * 1. **The envelope is verified before anything is drawn.** ADR-010 rule 1 puts the frame, CRS and
 *    axis order on the batch envelope; a consumer that draws a batch without reading them is the
 *    reason the rule exists. An untagged batch is a fault, not a warning.
 * 2. **Buffer sharing is measured on this payload shape.** The bake-off measured it on fixed-width
 *    columns and scoped its result to that shape. Variable-width GeoArrow is a different question,
 *    so it is asked again here, per batch, and reported as a number — never as a zero-copy claim
 *    (ADR-004: copies are measured and minimized, not assumed absent).
 */

import { tableFromIPC } from 'apache-arrow';

export interface Envelope {
  frame: string;
  crs: string;
  crsSource: string;
  axisOrder: string;
  axisNormalization: string;
  geometryEncoding: string;
  crsAssertedBy?: string;
  crsAssertedAt?: string;
}

export interface DecodedBatch {
  envelope: Envelope;
  ids: BigUint64Array | Uint32Array | Float64Array;
  /** Interleaved x,y for every vertex of every ring of every feature. */
  coords: Float64Array;
  /** Start vertex index of each ring, length rings+1. */
  ringOffsets: Int32Array;
  /** Start ring index of each feature, length features+1. */
  polygonOffsets: Int32Array;
  features: number;
  vertices: number;
  /** True when Arrow handed out a view into the delivered bytes instead of copying to realign. */
  sharesWireBuffer: boolean;
  /** Byte offset of the coordinate buffer, for the alignment record. */
  coordByteOffset: number;
}

export const EXPECTED_FRAME = 'authoritative-project-crs';
export const EXPECTED_ENCODING = 'geoarrow.polygon';

/**
 * @param expectedCrs the CRS this consumer's viewport is expressed in. Every batch's envelope must
 *   name it. Passing it is not optional decoration: without it a dataset in a different projected
 *   CRS is fitted into this viewport's extent and drawn silently, which is the frame error ADR-010
 *   rule 1 records at 3 116 272 m arriving through the display path instead of the query path.
 */
export function decodeBatch(payload: Uint8Array, expectedCrs: string): DecodedBatch {
  const table = tableFromIPC(payload);
  const meta = table.schema.metadata;

  const envelope: Envelope = {
    frame: meta.get('frame') ?? '',
    crs: meta.get('crs') ?? '',
    crsSource: meta.get('crs_source') ?? '',
    axisOrder: meta.get('axis_order') ?? '',
    axisNormalization: meta.get('axis_normalization') ?? '',
    geometryEncoding: meta.get('geometry_encoding') ?? '',
    crsAssertedBy: meta.get('crs_asserted_by') ?? undefined,
    crsAssertedAt: meta.get('crs_asserted_at') ?? undefined,
  };

  // ADR-010 rule 1, enforced on the receiving side too: a bulk buffer whose envelope does not name
  // its frame is in violation, and this consumer refuses it rather than drawing it.
  if (envelope.frame !== EXPECTED_FRAME) {
    throw new Error(`batch envelope names frame "${envelope.frame}", expected "${EXPECTED_FRAME}"`);
  }
  if (!envelope.crs) throw new Error('batch envelope carries no CRS');
  if (envelope.crs !== expectedCrs) {
    throw new Error(
      `batch is in CRS "${envelope.crs}" but this viewport is expressed in "${expectedCrs}"; ` +
        'this consumer performs no reprojection',
    );
  }
  // A definition-only CRS names nothing — every such dataset carries the same placeholder, and the
  // actual definition lives in the geometry field's extension metadata, which this consumer does
  // not read. Matching the placeholder against itself would be a comparison of two non-names.
  if (envelope.crs === '(definition-only)') {
    throw new Error('batch envelope carries a definition-only CRS, which this consumer cannot match');
  }
  if (envelope.axisOrder !== 'easting,northing') {
    throw new Error(`unexpected axis order "${envelope.axisOrder}"`);
  }
  if (envelope.geometryEncoding !== EXPECTED_ENCODING) {
    throw new Error(`unexpected geometry encoding "${envelope.geometryEncoding}"`);
  }

  const idVector = table.getChild('id');
  const geomName = table.schema.fields[1].name;
  const geomVector = table.getChild(geomName);
  if (!idVector || !geomVector) throw new Error('batch is missing its id or geometry column');

  // Walk the nested Data directly rather than materializing JS objects per feature: the whole point
  // of the GeoArrow layout is that the coordinates are already one contiguous run of doubles.
  const polys = geomVector.data[0] as unknown as ArrowListData;
  const rings = polys.children[0] as ArrowListData;
  const coordsFsl = rings.children[0] as ArrowFixedSizeListData;
  const coordValues = coordsFsl.children[0] as ArrowPrimitiveData;

  const coords = coordValues.values as Float64Array;
  const ringOffsets = rings.valueOffsets as Int32Array;
  const polygonOffsets = polys.valueOffsets as Int32Array;

  return {
    envelope,
    ids: (idVector.data[0] as unknown as ArrowPrimitiveData).values as BigUint64Array,
    coords,
    ringOffsets,
    polygonOffsets,
    features: polygonOffsets.length - 1,
    vertices: coords.length / 2,
    sharesWireBuffer: coords.buffer === payload.buffer,
    coordByteOffset: coords.byteOffset,
  };
}

interface ArrowListData {
  valueOffsets: Int32Array;
  children: unknown[];
}
interface ArrowFixedSizeListData {
  children: unknown[];
}
interface ArrowPrimitiveData {
  values: ArrayBufferView;
}
