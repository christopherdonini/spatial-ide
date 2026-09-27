// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// The offset-bounds and geometry-shape fixtures for `decodePartition`
// (`PARTITION-OFFSET-BOUNDS-PREREGISTRATION.md`, wave-1 A3 3(b) with 3(a)).
//
// Every fixture is built in memory with the viewer's own `apache-arrow`, at the byte level
// (`makeData`, not the row-oriented Builder API), because several fixtures are deliberately invalid
// Arrow structures — a list level that is not a list, a coordinate leaf of the wrong type, offsets
// that are negative, decreasing, or past the end of the array they index. None of those can be
// produced by appending well-formed rows.
//
// ## Two class-2 deviations from §3 (its own "a fixture cannot be built as declared" clause)
//
// Both come from how `apache-arrow` 18.1.0's own IPC writer and reader behave on a fixture that is
// itself written and read back through this library — neither is true of a real kernel-written
// partition, and neither changes which clause a fixture fires, or where a valid fixture ends exactly
// at a bound; only the exact numeric offsets differ from the ones the preregistration's table
// illustrates. `assertRawGeometry` below asserts every fixture's actual arrays exactly, so both
// deviations are visible in the fixture's own assertion rather than hidden in a comment.
//
// **1. Offsets-buffer padding.** The writer (`visitor/vectorassembler.mjs` `addBuffer`) records a
// List's offsets buffer length in the message metadata **rounded up to an 8-byte boundary**, and the
// reader (`visitor/vectorloader.mjs` `readData`) trusts that recorded length rather than the field
// node's row count when exposing `Data.valueOffsets` — so a round-tripped offsets buffer whose true
// length isn't already a multiple of 8 bytes reads back with one extra trailing `0`. Reading
// `valueOffsets` and computing `features` as `polygonOffsets.length - 1` is `partition.ts`'s own
// existing, unchanged read (outside this piece's scope, §2g), so an unaligned fixture would decode as
// one extra, phantom, empty feature or ring. Every offsets array below is instead kept at an
// already-aligned length (an odd feature or ring count) as built.
//
// **2. A List sliced past its own length, at write time, comes back corrupted, not merely large.**
// The writer also slices a List's *child* to the exact `[valueOffsets[0], valueOffsets[length])`
// range it declares before visiting it (the same function), and where that range exceeds the child
// List's own true length the child reads back truncated (empirically: a fixture built directly with
// `polygonOffsets` ending past the true ring count did not preserve that count — it read back with
// zero coordinate pairs). F3 (polygon end past the rings) is therefore built the same way F5 and F6
// already were for a different reason (§3): a valid structure is written first, and the
// out-of-bounds value is written by patching bytes afterwards, once the writer's own slicing can no
// longer run against it.

import assert from 'node:assert/strict';
import test from 'node:test';

import {
  Field, FixedSizeList, Float64, List, RecordBatch, Schema, Struct, Table, Uint64,
  makeData, tableFromIPC, tableToIPC,
} from 'apache-arrow';

import { importModule } from './bundle-for-test.mjs';

const { decodePartition, BundleFailure } = await importModule('scripts/partition-entry.mjs');

const CRS_SOURCE = 'EPSG:2056';

/** The manifest stub §3 declares: only the two members `decodePartition` reads. */
function manifestStub() {
  return { crsSource: CRS_SOURCE, attributeColumns: [] };
}

/** The partition asset entry: only `path` and `rows` are read by `decodePartition`. */
function assetStub(path, rows) {
  return { path, bytes: 0, contentHash: 'sha256:stub', rows };
}

/** §3's envelope: `frame`, `crs`, `axis_order`, `geometry_encoding`, `attribute_columns`. */
function envelopeMetadata() {
  return new Map([
    ['frame', 'authoritative-project-crs'],
    ['crs', CRS_SOURCE],
    ['axis_order', 'easting,northing'],
    ['geometry_encoding', 'geoarrow.polygon'],
    ['attribute_columns', '[]'],
  ]);
}

const noGroup = () => 0;

/**
 * The well-formed geoarrow.polygon nesting: `List<List<FixedSizeList<Float64>[2]>>`, matching
 * `decodePartition`'s own walk (`polys` -> `rings` -> `coordsFsl` -> `coordValues`).
 *
 * `idValues` may hold more ids than `polygonOffsets.length - 1` features only via the caller passing
 * the exact count; the two are asserted equal here so a fixture-authoring mistake fails at build time
 * rather than inside the test it feeds.
 */
function buildGeometryTable({ idValues, polygonOffsets, ringOffsets, coordsFlat }) {
  const features = polygonOffsets.length - 1;
  assert.equal(idValues.length, features, 'fixture bug: idValues must have one entry per feature');
  const pairCount = coordsFlat.length / 2;

  const coordType = new Float64();
  const fslType = new FixedSizeList(2, new Field('xy', coordType, false));
  const ringsType = new List(new Field('vertices', fslType, false));
  const polysType = new List(new Field('rings', ringsType, false));

  const coordData = makeData({ type: coordType, data: new Float64Array(coordsFlat) });
  const fslData = makeData({ type: fslType, child: coordData, length: pairCount });
  const ringsData = makeData({
    type: ringsType,
    valueOffsets: new Int32Array(ringOffsets),
    child: fslData,
    length: ringOffsets.length - 1,
  });
  const polysData = makeData({
    type: polysType,
    valueOffsets: new Int32Array(polygonOffsets),
    child: ringsData,
    length: features,
  });
  const idData = makeData({ type: new Uint64(), data: new BigUint64Array(idValues), length: features });

  const idField = new Field('id', new Uint64(), false);
  const geomField = new Field('geometry', polysType, false);
  const schema = new Schema([idField, geomField], envelopeMetadata());
  const structData = makeData({
    type: new Struct([idField, geomField]),
    children: [idData, polysData],
    length: features,
  });
  return new Table(schema, new RecordBatch(schema, structData));
}

/** Re-walk the raw Arrow structure the same way `decodePartition` does, for the self-check. */
function rawGeometry(bytes) {
  const table = tableFromIPC(bytes);
  const geomField = table.schema.fields[1];
  const geomVector = table.getChild(geomField.name);
  const polys = geomVector.data[0];
  const rings = polys.children[0];
  const coordsFsl = rings?.children?.[0];
  const coordValues = coordsFsl?.children?.[0];
  return { polys, rings, coordsFsl, coordValues };
}

/** §3's self-check for a structurally well-formed fixture: exact offsets and coordinate count. */
function assertRawGeometry(bytes, { polygonOffsets, ringOffsets, pairCount }) {
  const { polys, rings, coordValues } = rawGeometry(bytes);
  assert.deepEqual(Array.from(polys.valueOffsets), polygonOffsets, 'fixture self-check: polygon offsets');
  assert.deepEqual(Array.from(rings.valueOffsets), ringOffsets, 'fixture self-check: ring offsets');
  assert.equal(Math.floor(coordValues.values.length / 2), pairCount, 'fixture self-check: coordinate pairs');
}

// ---------------------------------------------------------------------------------------------
// F0-F6: offset-bounds fixtures (A3 3(b)). All well-formed nesting; G1-G3 do not apply.
// ---------------------------------------------------------------------------------------------

/**
 * F0 — valid: feature 0 a square with a square hole, feature 1 a triangle, offsets ending exactly at
 * B2's and B4's bounds. A third, empty, feature is appended only to keep the polygon-offsets array at
 * an 8-byte-aligned length (the class-2 deviation the module doc explains); it contributes no rings
 * and its own bbox is therefore the untouched `[Infinity, Infinity, -Infinity, -Infinity]`.
 */
function fixtureF0() {
  const outerSquare = [0, 0, 10, 0, 10, 10, 0, 10, 0, 0];
  const innerHole = [2, 2, 8, 2, 8, 8, 2, 8, 2, 2];
  const triangle = [20, 0, 30, 0, 25, 10, 20, 0];
  const table = buildGeometryTable({
    idValues: [11n, 22n, 33n],
    polygonOffsets: [0, 2, 3, 3],
    ringOffsets: [0, 5, 10, 14],
    coordsFlat: [...outerSquare, ...innerHole, ...triangle],
  });
  const bytes = tableToIPC(table, 'stream');
  assertRawGeometry(bytes, { polygonOffsets: [0, 2, 3, 3], ringOffsets: [0, 5, 10, 14], pairCount: 14 });
  return { bytes, rows: 3 };
}

/** F1 — ring end one past the coordinates: `ringOffsets` ends at 5, `pairCount` is 4. */
function fixtureF1() {
  const table = buildGeometryTable({
    idValues: [1n],
    polygonOffsets: [0, 1],
    ringOffsets: [0, 5],
    coordsFlat: [0, 0, 1, 0, 1, 1, 0, 1],
  });
  const bytes = tableToIPC(table, 'stream');
  assertRawGeometry(bytes, { polygonOffsets: [0, 1], ringOffsets: [0, 5], pairCount: 4 });
  return { bytes, rows: 1 };
}

/** F2 — ring offsets decrease, all within bounds. */
function fixtureF2() {
  const table = buildGeometryTable({
    idValues: [1n],
    polygonOffsets: [0, 3],
    ringOffsets: [0, 4, 2, 6],
    coordsFlat: [0, 0, 1, 0, 1, 1, 0, 1, 2, 2, 3, 3],
  });
  const bytes = tableToIPC(table, 'stream');
  assertRawGeometry(bytes, { polygonOffsets: [0, 3], ringOffsets: [0, 4, 2, 6], pairCount: 6 });
  return { bytes, rows: 1 };
}

/**
 * F3 — polygon end past the rings. Built by the same differential-location technique as F5/F6,
 * rather than directly: `apache-arrow`'s IPC writer slices a List's *child* to the exact
 * `[valueOffsets[0], valueOffsets[length])` range it declares (`visitor/vectorassembler.mjs`
 * `assembleListVector`), and a List-typed child (rings, here) sliced past its own true length comes
 * back corrupted on read (empirically: the coordinate count read back as 0, not 4) rather than
 * preserving the out-of-bounds reference — a second class-2 deviation from §3, distinct from the
 * padding one. Two builds differing only at `polygonOffsets[2]` (an interior entry, so the write-time
 * slice — which only reads index 0 and index `F` — is identical and safe in both) locate
 * `polygonOffsets[3]`'s own four bytes, one *after* the found position this time since index 2 sits
 * immediately *before* the entry being patched. `polygonOffsets[3]` (a valid 3, matching the true ring
 * count) is then overwritten with 4 — after the safe write, so the corruption above cannot occur.
 */
function fixtureF3() {
  const shared = {
    idValues: [1n, 2n, 3n],
    ringOffsets: [0, 4, 8, 12],
    coordsFlat: [0, 0, 1, 0, 1, 1, 0, 1, 2, 2, 3, 2, 3, 3, 2, 3, 4, 4, 5, 4, 5, 5, 4, 5],
  };
  const tableA = buildGeometryTable({ ...shared, polygonOffsets: [0, 1, 2, 3] });
  const tableB = buildGeometryTable({ ...shared, polygonOffsets: [0, 1, 3, 3] });
  const bytesA = tableToIPC(tableA, 'stream');
  const bytesB = tableToIPC(tableB, 'stream');
  const diffPosition = locatePatchPosition(bytesA, bytesB);
  const patched = patchInt32At(bytesA, diffPosition + 4, 4);

  assertRawGeometry(patched, { polygonOffsets: [0, 1, 2, 4], ringOffsets: [0, 4, 8, 12], pairCount: 12 });
  return { bytes: patched, rows: 3 };
}

/** F4 — polygon offsets decrease, all within bounds. */
function fixtureF4() {
  const table = buildGeometryTable({
    idValues: [1n, 2n, 3n],
    polygonOffsets: [0, 2, 1, 3],
    ringOffsets: [0, 4, 8, 12],
    coordsFlat: [0, 0, 1, 0, 1, 1, 0, 1, 2, 2, 3, 2, 3, 3, 2, 3, 4, 4, 5, 4, 5, 5, 4, 5],
  });
  const bytes = tableToIPC(table, 'stream');
  assertRawGeometry(bytes, {
    polygonOffsets: [0, 2, 1, 3],
    ringOffsets: [0, 4, 8, 12],
    pairCount: 12,
  });
  return { bytes, rows: 3 };
}

/**
 * Build two tables identical except at one interior offset entry, so the byte position of the offset
 * immediately before it can be located without a hard-coded byte position — §3's "differential
 * location" technique. `differAt` is the offsets-array index that must differ between the two;
 * `basePatchIndex = differAt - 1` is the index whose written bytes get located this way.
 */
function locatePatchPosition(bytesA, bytesB) {
  assert.equal(bytesA.length, bytesB.length, 'differential fixtures must serialize to the same length');
  let found = -1;
  for (let i = 0; i < bytesA.length; i++) {
    if (bytesA[i] !== bytesB[i]) {
      assert.equal(found, -1, `expected exactly one differing byte, found a second at ${i}`);
      found = i;
    }
  }
  assert.notEqual(found, -1, 'expected exactly one differing byte, found none');
  return found;
}

/** Patch four bytes, starting `patchPosition`, to `value` as an Int32 LE, in a fresh copy of `bytes`. */
function patchInt32At(bytes, patchPosition, value) {
  const patched = bytes.slice();
  new DataView(patched.buffer, patched.byteOffset, patched.byteLength).setInt32(patchPosition, value, true);
  return patched;
}

/**
 * F5 — polygon start negative. Three features (odd, so the offsets array is already 8-byte aligned —
 * §3's padding deviation does not apply here). Two builds differing only in `polygonOffsets[1]` (the
 * entry after the one to patch) locate `polygonOffsets[0]`'s own four bytes, which are then
 * overwritten with -1.
 */
function fixtureF5() {
  const shared = {
    idValues: [1n, 2n, 3n],
    ringOffsets: [0, 4, 8, 12],
    coordsFlat: [0, 0, 1, 0, 1, 1, 0, 1, 2, 2, 3, 2, 3, 3, 2, 3, 4, 4, 5, 4, 5, 5, 4, 5],
  };
  const tableA = buildGeometryTable({ ...shared, polygonOffsets: [0, 1, 2, 3] });
  const tableB = buildGeometryTable({ ...shared, polygonOffsets: [0, 2, 2, 3] });
  const bytesA = tableToIPC(tableA, 'stream');
  const bytesB = tableToIPC(tableB, 'stream');
  const diffPosition = locatePatchPosition(bytesA, bytesB);
  const patched = patchInt32At(bytesB, diffPosition - 4, -1);

  assertRawGeometry(patched, {
    polygonOffsets: [-1, 2, 2, 3],
    ringOffsets: [0, 4, 8, 12],
    pairCount: 12,
  });
  return { bytes: patched, rows: 3 };
}

/**
 * F6 — ring start negative. Same technique, one level down, also with three (odd, aligned) rings:
 * two builds differing only in `ringOffsets[1]` locate `ringOffsets[0]`'s bytes. `polygonOffsets`
 * stays valid (`[0, 1, 2, 3]`) so B1 and B2 pass and B3's start clause is what fires.
 */
function fixtureF6() {
  const shared = {
    idValues: [1n, 2n, 3n],
    polygonOffsets: [0, 1, 2, 3],
    coordsFlat: [0, 0, 1, 0, 1, 1, 0, 1, 2, 2, 3, 2, 3, 3, 2, 3, 4, 4, 5, 4, 5, 5, 4, 5],
  };
  const tableA = buildGeometryTable({ ...shared, ringOffsets: [0, 4, 8, 12] });
  const tableB = buildGeometryTable({ ...shared, ringOffsets: [0, 5, 8, 12] });
  const bytesA = tableToIPC(tableA, 'stream');
  const bytesB = tableToIPC(tableB, 'stream');
  const diffPosition = locatePatchPosition(bytesA, bytesB);
  const patched = patchInt32At(bytesB, diffPosition - 4, -1);

  assertRawGeometry(patched, {
    polygonOffsets: [0, 1, 2, 3],
    ringOffsets: [-1, 5, 8, 12],
    pairCount: 12,
  });
  return { bytes: patched, rows: 3 };
}

// ---------------------------------------------------------------------------------------------
// F7-F10: geometry-shape fixtures (A3 3(a)). G1-G3 apply; offsets are never read.
// ---------------------------------------------------------------------------------------------

/** F7 — a flat `Float64` geometry column: no list at all. */
function fixtureF7() {
  const coordType = new Float64();
  const idField = new Field('id', new Uint64(), false);
  const geomField = new Field('geometry', coordType, false);
  const schema = new Schema([idField, geomField], envelopeMetadata());
  const idData = makeData({ type: new Uint64(), data: new BigUint64Array([1n]), length: 1 });
  const geomData = makeData({ type: coordType, data: new Float64Array([0, 0]), length: 1 });
  const structData = makeData({
    type: new Struct([idField, geomField]),
    children: [idData, geomData],
    length: 1,
  });
  const bytes = tableToIPC(new Table(schema, new RecordBatch(schema, structData)), 'stream');
  const { polys } = rawGeometry(bytes);
  assert.equal(polys.valueOffsets, undefined, 'fixture self-check: F7 must have no polygon-level offsets');
  return { bytes, rows: 1 };
}

/** F8 — `List<FixedSizeList<Float64>[2]>` (the ring level is missing). */
function fixtureF8() {
  const coordType = new Float64();
  const fslType = new FixedSizeList(2, new Field('xy', coordType, false));
  const polysType = new List(new Field('point', fslType, false));
  const idField = new Field('id', new Uint64(), false);
  const geomField = new Field('geometry', polysType, false);
  const schema = new Schema([idField, geomField], envelopeMetadata());

  const idData = makeData({ type: new Uint64(), data: new BigUint64Array([1n]), length: 1 });
  const coordData = makeData({ type: coordType, data: new Float64Array([0, 0, 1, 1]) });
  const fslData = makeData({ type: fslType, child: coordData, length: 2 });
  const polysData = makeData({ type: polysType, valueOffsets: new Int32Array([0, 2]), child: fslData, length: 1 });
  const structData = makeData({
    type: new Struct([idField, geomField]),
    children: [idData, polysData],
    length: 1,
  });
  const bytes = tableToIPC(new Table(schema, new RecordBatch(schema, structData)), 'stream');
  const { polys, rings } = rawGeometry(bytes);
  assert.ok(polys.valueOffsets instanceof Int32Array, 'fixture self-check: F8 polygon level must be a list');
  assert.equal(rings.valueOffsets, undefined, 'fixture self-check: F8 must have no ring-level offsets');
  return { bytes, rows: 1 };
}

/** F9 — `List<List<FixedSizeList<Uint64>[2]>>`: the coordinate leaf is a 64-bit integer. */
function fixtureF9() {
  const leafType = new Uint64();
  const fslType = new FixedSizeList(2, new Field('xy', leafType, false));
  const ringsType = new List(new Field('vertices', fslType, false));
  const polysType = new List(new Field('rings', ringsType, false));
  const idField = new Field('id', new Uint64(), false);
  const geomField = new Field('geometry', polysType, false);
  const schema = new Schema([idField, geomField], envelopeMetadata());

  const idData = makeData({ type: new Uint64(), data: new BigUint64Array([1n]), length: 1 });
  const leafData = makeData({ type: leafType, data: new BigUint64Array([0n, 0n, 1n, 0n, 1n, 1n, 0n, 1n]) });
  const fslData = makeData({ type: fslType, child: leafData, length: 4 });
  const ringsData = makeData({ type: ringsType, valueOffsets: new Int32Array([0, 4]), child: fslData, length: 1 });
  const polysData = makeData({
    type: polysType,
    valueOffsets: new Int32Array([0, 1]),
    child: ringsData,
    length: 1,
  });
  const structData = makeData({
    type: new Struct([idField, geomField]),
    children: [idData, polysData],
    length: 1,
  });
  const bytes = tableToIPC(new Table(schema, new RecordBatch(schema, structData)), 'stream');
  const { coordValues } = rawGeometry(bytes);
  assert.ok(coordValues.values instanceof BigUint64Array, 'fixture self-check: F9 coordinate leaf must be Uint64');
  return { bytes, rows: 1 };
}

/** F10 — `List<List<Float64>>`: the coordinate level is flat, with no `FixedSizeList` pairing. */
function fixtureF10() {
  const coordType = new Float64();
  const ringsType = new List(new Field('coords', coordType, false));
  const polysType = new List(new Field('rings', ringsType, false));
  const idField = new Field('id', new Uint64(), false);
  const geomField = new Field('geometry', polysType, false);
  const schema = new Schema([idField, geomField], envelopeMetadata());

  const idData = makeData({ type: new Uint64(), data: new BigUint64Array([1n]), length: 1 });
  const coordData = makeData({ type: coordType, data: new Float64Array([0, 0, 1, 0, 1, 1, 0, 1]) });
  const ringsData = makeData({
    type: ringsType,
    valueOffsets: new Int32Array([0, 8]),
    child: coordData,
    length: 1,
  });
  const polysData = makeData({
    type: polysType,
    valueOffsets: new Int32Array([0, 1]),
    child: ringsData,
    length: 1,
  });
  const structData = makeData({
    type: new Struct([idField, geomField]),
    children: [idData, polysData],
    length: 1,
  });
  const bytes = tableToIPC(new Table(schema, new RecordBatch(schema, structData)), 'stream');
  const { rings, coordsFsl } = rawGeometry(bytes);
  assert.ok(rings.valueOffsets instanceof Int32Array, 'fixture self-check: F10 ring level must be a list');
  assert.equal(coordsFsl.children[0], undefined, 'fixture self-check: F10 must have no FixedSizeList wrapper');
  return { bytes, rows: 1 };
}

// ---------------------------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------------------------

/** Decode a fixture, asserting the refusal §2e declares. No timing, no timeout, anywhere. */
function assertRefused(fixture, expectedWords) {
  assert.throws(
    () =>
      decodePartition(
        assetStub('data/part-00000.arrows', fixture.rows),
        0,
        fixture.bytes,
        manifestStub(),
        noGroup,
        null,
      ),
    (e) => {
      assert.ok(e instanceof BundleFailure, `expected a BundleFailure, got ${e}`);
      assert.equal(e.state, 'partition-decode-failed');
      assert.equal(e.asset, 'data/part-00000.arrows');
      for (const word of expectedWords) {
        assert.ok(e.detail.includes(word), `detail "${e.detail}" does not include "${word}"`);
      }
      return true;
    },
  );
}

/**
 * Mutation M0 (B4 written with `<` instead of `<=`) fails this test by name, at commit
 * a411fc4f55a3f29f36f51a6f8e97a12860cc49cc (node v24.18.1, npm 11.16.0). Printed failure (the
 * thrown BundleFailure, excerpted — the stack trace and object dump are elided): `BundleFailure:
 * partition-decode-failed (data/part-00000.arrows): ring offsets end at 14, past the
 * coordinate-pair count 14`.
 */
test('decodes a well-formed partition, with offsets ending exactly at their bounds', () => {
  const fixture = fixtureF0();
  const p = decodePartition(
    assetStub('data/part-00000.arrows', fixture.rows),
    0,
    fixture.bytes,
    manifestStub(),
    noGroup,
    null,
  );
  assert.equal(p.features, 3);
  assert.deepEqual(Array.from(p.ids), [11n, 22n, 33n]);
  assert.deepEqual(Array.from(p.polygonOffsets), [0, 2, 3, 3]);
  assert.deepEqual(Array.from(p.ringOffsets), [0, 5, 10, 14]);
  assert.deepEqual(
    Array.from(p.bboxes),
    [0, 0, 10, 10, 20, 0, 30, 10, Infinity, Infinity, -Infinity, -Infinity],
  );
});

/**
 * Mutation M1 (delete B4) fails this test by name, at commit a411fc4f55a3f29f36f51a6f8e97a12860cc49cc (node
 * v24.18.1, npm 11.16.0). Printed failure: `AssertionError [ERR_ASSERTION]: Missing expected
 * exception.` — decodePartition returns normally instead of throwing.
 */
test('refuses ring offsets that end past the coordinate pairs', () => {
  assertRefused(fixtureF1(), ['ring offsets', 'past']);
});

/**
 * Mutation M2 (delete B3's monotone loop) fails this test by name, at commit
 * a411fc4f55a3f29f36f51a6f8e97a12860cc49cc (node v24.18.1, npm 11.16.0). Printed failure:
 * `AssertionError [ERR_ASSERTION]: Missing expected exception.` — decodePartition returns normally
 * instead of throwing.
 */
test('refuses ring offsets that decrease', () => {
  assertRefused(fixtureF2(), ['ring offsets', 'decrease']);
});

/**
 * Mutation M3 (delete B2) fails this test by name, at commit a411fc4f55a3f29f36f51a6f8e97a12860cc49cc (node
 * v24.18.1, npm 11.16.0). Printed failure: `AssertionError [ERR_ASSERTION]: detail "ring offsets
 * decrease at ring 3: 12 then undefined" does not include "polygon offsets"` — B3's loop reads one
 * past r1 and throws under the wrong clause, which this test's wording assertion catches.
 */
test('refuses polygon offsets that end past the rings', () => {
  assertRefused(fixtureF3(), ['polygon offsets', 'past']);
});

/**
 * Mutation M4 (delete B1's monotone loop) fails this test by name, at commit
 * a411fc4f55a3f29f36f51a6f8e97a12860cc49cc (node v24.18.1, npm 11.16.0). Printed failure:
 * `AssertionError [ERR_ASSERTION]: Missing expected exception.` — decodePartition returns normally
 * instead of throwing.
 */
test('refuses polygon offsets that decrease', () => {
  assertRefused(fixtureF4(), ['polygon offsets', 'decrease']);
});

/**
 * Mutation M5 (delete B1's start clause) fails this test by name, at commit
 * a411fc4f55a3f29f36f51a6f8e97a12860cc49cc (node v24.18.1, npm 11.16.0). Printed failure:
 * `AssertionError [ERR_ASSERTION]: detail "ring offsets start at undefined, below 0" does not
 * include "polygon offsets"` — B3's own start check reads ringOffsets[-1] and throws under the
 * wrong clause, which this test's wording assertion catches.
 */
test('refuses polygon offsets that start below 0', () => {
  assertRefused(fixtureF5(), ['polygon offsets', 'below 0']);
});

/**
 * Mutation M6 (delete B3's start clause) fails this test by name, at commit
 * a411fc4f55a3f29f36f51a6f8e97a12860cc49cc (node v24.18.1, npm 11.16.0). Printed failure:
 * `AssertionError [ERR_ASSERTION]: Missing expected exception.` — decodePartition returns normally
 * instead of throwing (a negative first ring offset is still "monotone" relative to what follows
 * it).
 */
test('refuses ring offsets that start below 0', () => {
  assertRefused(fixtureF6(), ['ring offsets', 'below 0']);
});

/**
 * Mutation M7 (delete G1) fails this test by name, at commit a411fc4f55a3f29f36f51a6f8e97a12860cc49cc (node
 * v24.18.1, npm 11.16.0). Printed failure: `AssertionError [ERR_ASSERTION]: expected a
 * BundleFailure, got TypeError: Cannot read properties of undefined (reading 'valueOffsets')`.
 */
test('refuses a flat geometry column as partition-decode-failed, not a raw TypeError', () => {
  assertRefused(fixtureF7(), ['polygon level']);
});

/**
 * Mutation M8 (delete G2) fails this test by name, at commit a411fc4f55a3f29f36f51a6f8e97a12860cc49cc (node
 * v24.18.1, npm 11.16.0). Printed failure: `AssertionError [ERR_ASSERTION]: detail "geometry
 * column: the coordinate values are not float64" does not include "ring level"` — G3 happens to
 * catch this shape too, under the wrong clause, which this test's wording assertion catches.
 */
test('refuses a geometry column one list level short', () => {
  assertRefused(fixtureF8(), ['ring level']);
});

/**
 * Mutation M9 (G3 reduced to a presence check) fails this test by name, at commit
 * a411fc4f55a3f29f36f51a6f8e97a12860cc49cc (node v24.18.1, npm 11.16.0). Printed failure:
 * `AssertionError [ERR_ASSERTION]: expected a BundleFailure, got TypeError: Cannot convert a
 * BigInt value to a number`.
 */
test('refuses coordinate values that are not float64', () => {
  assertRefused(fixtureF9(), ['coordinate values']);
});

/**
 * Mutation M10 (G3's `?.` replaced by `.`) fails this test by name, at commit
 * a411fc4f55a3f29f36f51a6f8e97a12860cc49cc (node v24.18.1, npm 11.16.0). Printed failure:
 * `AssertionError [ERR_ASSERTION]: expected a BundleFailure, got TypeError: Cannot read properties
 * of undefined (reading 'values')`.
 */
test('refuses a geometry column whose coordinate level carries no values', () => {
  assertRefused(fixtureF10(), ['coordinate values']);
});
