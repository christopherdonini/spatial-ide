// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * Decoding one partition, and checking that it is what the manifest and the envelope say it is.
 *
 * ## Verification order, which is the part that matters
 *
 * A partition is verified **before it is drawn**, never after: byte count, then content hash, then
 * decode, then the ADR-010 rule 1 envelope, then the geometry shape, then the row count, then the
 * offsets bounded, then the declared projection. Drawing first and checking afterwards would put
 * unverified pixels on the canvas for however long the check takes, and "we removed them again" is
 * not the same as never having shown them.
 *
 * ## The envelope is checked on **every** partition
 *
 * Rule 1 puts frame, CRS and axis order on the batch envelope, and the reason the engine repeats
 * that envelope on every batch rather than once per stream is so a reader that starts anywhere is
 * still told what space the coordinates are in. A reader that checked only the first partition would
 * throw that away.
 */

import { tableFromIPC } from 'apache-arrow';

import { BundleFailure } from './failure.js';
import type { Manifest, PartitionAsset } from './manifest.js';

export const EXPECTED_FRAME = 'authoritative-project-crs';
export const EXPECTED_ENCODING = 'geoarrow.polygon';
export const EXPECTED_AXIS_ORDER = 'easting,northing';

export interface AttributeColumn {
  name: string;
  /** Display strings, one per feature. `null` is a NULL the source carried, not a missing value. */
  values: (string | null)[];
}

export interface Partition {
  index: number;
  path: string;
  /**
   * The stable feature ids, in array order.
   *
   * **ADR-010 rule 2's indirection lives on this array.** Picking resolves `array index → this[i]`;
   * the index is never treated as the identity. `BigUint64Array` because the identity's width is
   * part of the contract (ADR-016 §7) and narrowing to a `Number` would be lossy above 2^53.
   */
  ids: BigUint64Array;
  /** Interleaved `x, y` for every vertex of every ring — authoritative f64, untouched. */
  coords: Float64Array;
  ringOffsets: Int32Array;
  polygonOffsets: Int32Array;
  features: number;
  /** `[xmin, ymin, xmax, ymax]` per feature, for culling and for the pick grid. */
  bboxes: Float64Array;
  /** Which style group each feature draws in. */
  groups: Uint8Array;
  attributes: AttributeColumn[];
  bytes: number;
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

/** Format one attribute cell for display, keeping NULL distinguishable from an empty string. */
function displayValue(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  if (typeof v === 'bigint') return v.toString();
  if (typeof v === 'number') return String(v);
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  return String(v);
}

export function decodePartition(
  asset: PartitionAsset,
  index: number,
  bytes: Uint8Array,
  manifest: Manifest,
  groupFor: (key: string | null) => number,
  matchColumn: string | null,
): Partition {
  let table;
  try {
    table = tableFromIPC(bytes);
  } catch (e) {
    throw new BundleFailure('partition-decode-failed', asset.path, String(e));
  }

  const meta = table.schema.metadata;
  const envelope = (key: string): string => meta.get(key) ?? '';

  if (envelope('frame') !== EXPECTED_FRAME) {
    throw new BundleFailure(
      'envelope-frame-mismatch',
      asset.path,
      `envelope names frame "${envelope('frame')}", expected "${EXPECTED_FRAME}". An untagged ` +
        `bulk buffer is in violation of ADR-010 rule 1 and is not drawn`,
    );
  }
  if (envelope('crs') !== manifest.crsSource) {
    throw new BundleFailure(
      'envelope-crs-mismatch',
      asset.path,
      `partition is in CRS "${envelope('crs')}" but the manifest declares "${manifest.crsSource}". ` +
        `This viewer performs no reprojection`,
    );
  }
  if (envelope('axis_order') !== EXPECTED_AXIS_ORDER) {
    throw new BundleFailure(
      'envelope-axis-order-mismatch',
      asset.path,
      `axis order "${envelope('axis_order')}", expected "${EXPECTED_AXIS_ORDER}"`,
    );
  }
  if (envelope('geometry_encoding') !== EXPECTED_ENCODING) {
    throw new BundleFailure(
      'envelope-encoding-mismatch',
      asset.path,
      `geometry encoding "${envelope('geometry_encoding')}", expected "${EXPECTED_ENCODING}"`,
    );
  }
  const declared = JSON.stringify(manifest.attributeColumns);
  if (envelope('attribute_columns') !== declared) {
    throw new BundleFailure(
      'envelope-attributes-mismatch',
      asset.path,
      `envelope declares attribute columns ${envelope('attribute_columns')}, the manifest declares ` +
        `${declared}`,
    );
  }

  const idVector = table.getChild('id');
  const geomField = table.schema.fields[1];
  const geomVector = geomField ? table.getChild(geomField.name) : null;
  if (!idVector || !geomVector) {
    throw new BundleFailure('partition-decode-failed', asset.path, 'missing id or geometry column');
  }

  // Walk the GeoArrow nesting directly: the coordinates are already one contiguous run of doubles,
  // and materializing per-feature objects would throw that away.
  //
  // G1-G3 (below) are shape preconditions, checked at each lookup site before the next level is
  // read: the walk never indexes into something that turned out not to be what it assumed.
  const polys = geomVector.data[0] as unknown as ArrowListData;
  if (!(polys.valueOffsets instanceof Int32Array) || polys.children[0] === undefined) {
    throw new BundleFailure(
      'partition-decode-failed',
      asset.path,
      'geometry column: the polygon level is not a list',
    );
  }
  const rings = polys.children[0] as ArrowListData;
  if (!(rings.valueOffsets instanceof Int32Array) || rings.children[0] === undefined) {
    throw new BundleFailure(
      'partition-decode-failed',
      asset.path,
      'geometry column: the ring level is not a list',
    );
  }
  const coordsFsl = rings.children[0] as ArrowFixedSizeListData;
  const coordValuesCandidate = coordsFsl.children[0] as ArrowPrimitiveData | undefined;
  if (!(coordValuesCandidate?.values instanceof Float64Array)) {
    throw new BundleFailure(
      'partition-decode-failed',
      asset.path,
      'geometry column: the coordinate values are not float64',
    );
  }
  const coordValues = coordValuesCandidate;

  const coords = coordValues.values as Float64Array;
  const ringOffsets = rings.valueOffsets;
  const polygonOffsets = polys.valueOffsets;
  const ids = (idVector.data[0] as unknown as ArrowPrimitiveData).values as BigUint64Array;
  const features = polygonOffsets.length - 1;

  if (features !== asset.rows) {
    throw new BundleFailure(
      'partition-row-count-mismatch',
      asset.path,
      `the manifest lists ${asset.rows} rows and the partition decodes to ${features}`,
    );
  }

  // B1-B4 (below) bound every offset the geometry walk below reads against the array it indexes,
  // before that walk runs (§2c: each check's own reads are bounded by the ones before it). Every
  // comparison is written fail-closed (`!(a <= b)`, `!(a >= 0)`), never as the inverted `a > b`.
  const ringCount = ringOffsets.length - 1;
  const pairCount = Math.floor(coords.length / 2);

  if (!(polygonOffsets[0] >= 0)) {
    throw new BundleFailure(
      'partition-decode-failed',
      asset.path,
      `polygon offsets start at ${polygonOffsets[0]}, below 0`,
    );
  }
  for (let f = 0; f < features; f++) {
    if (!(polygonOffsets[f] <= polygonOffsets[f + 1])) {
      throw new BundleFailure(
        'partition-decode-failed',
        asset.path,
        `polygon offsets decrease at feature ${f}: ${polygonOffsets[f]} then ${polygonOffsets[f + 1]}`,
      );
    }
  }
  if (!(polygonOffsets[features] <= ringCount)) {
    throw new BundleFailure(
      'partition-decode-failed',
      asset.path,
      `polygon offsets end at ${polygonOffsets[features]}, past the ring count ${ringCount}`,
    );
  }
  const r0 = polygonOffsets[0];
  const r1 = polygonOffsets[features];
  if (!(ringOffsets[r0] >= 0)) {
    throw new BundleFailure(
      'partition-decode-failed',
      asset.path,
      `ring offsets start at ${ringOffsets[r0]}, below 0`,
    );
  }
  for (let r = r0; r < r1; r++) {
    if (!(ringOffsets[r] <= ringOffsets[r + 1])) {
      throw new BundleFailure(
        'partition-decode-failed',
        asset.path,
        `ring offsets decrease at ring ${r}: ${ringOffsets[r]} then ${ringOffsets[r + 1]}`,
      );
    }
  }
  if (!(ringOffsets[r1] <= pairCount)) {
    throw new BundleFailure(
      'partition-decode-failed',
      asset.path,
      `ring offsets end at ${ringOffsets[r1]}, past the coordinate-pair count ${pairCount}`,
    );
  }

  // The declared projection, checked against what the schema actually carries.
  const attributes: AttributeColumn[] = [];
  for (const name of manifest.attributeColumns) {
    const v = table.getChild(name);
    if (!v) {
      throw new BundleFailure(
        'attribute-schema-mismatch',
        asset.path,
        `the manifest declares attribute "${name}" and the partition does not carry it`,
      );
    }
    const values: (string | null)[] = new Array(features);
    for (let i = 0; i < features; i++) values[i] = displayValue(v.get(i));
    attributes.push({ name, values });
  }

  // Per-feature bounds, and the style group each feature draws in. Both are derived state held in
  // the viewer and never written anywhere — ADR-010 rule 5's "a renderer cache is derived from
  // committed authoritative state and is never the system of record".
  const bboxes = new Float64Array(features * 4);
  const groups = new Uint8Array(features);
  const matchValues =
    matchColumn === null ? null : (attributes.find((a) => a.name === matchColumn)?.values ?? null);

  for (let f = 0; f < features; f++) {
    let xmin = Infinity;
    let ymin = Infinity;
    let xmax = -Infinity;
    let ymax = -Infinity;
    for (let r = polygonOffsets[f]; r < polygonOffsets[f + 1]; r++) {
      for (let v = ringOffsets[r]; v < ringOffsets[r + 1]; v++) {
        const x = coords[v * 2];
        const y = coords[v * 2 + 1];
        if (x < xmin) xmin = x;
        if (y < ymin) ymin = y;
        if (x > xmax) xmax = x;
        if (y > ymax) ymax = y;
      }
    }
    bboxes[f * 4] = xmin;
    bboxes[f * 4 + 1] = ymin;
    bboxes[f * 4 + 2] = xmax;
    bboxes[f * 4 + 3] = ymax;
    groups[f] = groupFor(matchValues ? matchValues[f] : null);
  }

  return {
    index,
    path: asset.path,
    ids,
    coords,
    ringOffsets,
    polygonOffsets,
    features,
    bboxes,
    groups,
    attributes,
    bytes: bytes.length,
  };
}
