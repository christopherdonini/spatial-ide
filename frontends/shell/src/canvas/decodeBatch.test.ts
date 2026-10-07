// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import {
  Field,
  FixedSizeList,
  Float64,
  List,
  Table,
  tableToIPC,
  Uint64,
  vectorFromArray,
} from "apache-arrow";
import { describe, expect, it } from "vitest";

import {
  decodeBatch,
  ENCODING_LINESTRING,
  ENCODING_MULTILINESTRING,
  ENCODING_MULTIPOLYGON,
  ENCODING_POINT,
  ENCODING_POLYGON,
  EXPECTED_FRAME,
  geometryKindOf,
  UnexpectedEncodingError,
  UnexpectedFrameError,
} from "./decodeBatch";
import {
  lineL1Positions,
  loadBatchFixture,
  multilinestringMl1Positions,
  pointP1Positions,
} from "../testUtils/batchFixtures";

/** Builds an IPC byte buffer matching `engine::envelope::TaggedBatch`'s wire shape closely enough
 * to exercise this decoder: `id: UInt64 not null`, `geometry: List<List<FixedSizeList<2,f64>>>`,
 * schema metadata carrying `frame` and `geometry_encoding`. */
// `frame` is `string | null`, never `string | undefined`: passing `undefined` explicitly at a call
// site would trigger this parameter's own default rather than mean "omit the tag" -- `null` is the
// only value JS does not treat as "use the default" for a defaulted parameter. The same holds for
// `encoding`.
function buildBatch(
  ids: bigint[],
  polygons: Array<Array<Array<[number, number]>>>,
  frame: string | null = EXPECTED_FRAME,
  encoding: string | null = ENCODING_POLYGON
): Uint8Array {
  const idVec = vectorFromArray(ids, new Uint64());
  const fsl = new FixedSizeList(2, new Field("xy", new Float64(), false));
  const ringType = new List(new Field("vertices", fsl, false));
  const geomType = new List(new Field("rings", ringType, false));
  const geomVec = vectorFromArray(polygons, geomType);
  const table = new Table({ id: idVec, geometry: geomVec });
  if (frame !== null) {
    table.schema.metadata.set("frame", frame);
  }
  if (encoding !== null) {
    table.schema.metadata.set("geometry_encoding", encoding);
  }
  return tableToIPC(table, "stream");
}

const SQUARE = (x: number, y: number, s: number): Array<[number, number]> => [
  [x, y],
  [x + s, y],
  [x + s, y + s],
  [x, y + s],
  [x, y],
];

describe("decodeBatch", () => {
  it("decodes ids and parts together, one feature per row, a Polygon as one part, exterior + holes in order", () => {
    const ids = [7n, 9n];
    const polygons = [
      [[[0, 0], [1, 0], [1, 1], [0, 0]] as Array<[number, number]>], // one ring
      [
        [[10, 10], [11, 10], [11, 11], [10, 10]] as Array<[number, number]>, // exterior
        [[10.4, 10.4], [10.6, 10.4], [10.6, 10.6], [10.4, 10.4]] as Array<[number, number]>, // hole
      ],
    ];
    const ipc = buildBatch(ids, polygons);

    const batch = decodeBatch("sh_test", 0, ipc, "geometry", ENCODING_POLYGON);
    expect(Array.from(batch.ids)).toEqual([7n, 9n]);
    expect(batch.parts).toHaveLength(2);
    expect(batch.parts[0]).toHaveLength(1); // a Polygon is one part
    expect(batch.parts[0][0]).toHaveLength(1); // ... of one ring
    expect(batch.parts[0][0][0]).toEqual([[0, 0], [1, 0], [1, 1], [0, 0]]);
    expect(batch.parts[1]).toHaveLength(1);
    expect(batch.parts[1][0]).toHaveLength(2); // exterior + hole
    expect(batch.parts[1][0][1]).toEqual([[10.4, 10.4], [10.6, 10.4], [10.6, 10.6], [10.4, 10.4]]);
    expect(Array.from(batch.partToRow)).toEqual([0, 1]);
    expect(batch.partCount).toBe(2);
    expect(batch.totalVertices).toBe(4 + 4 + 4);
    expect(batch.streamHandle).toBe("sh_test");
    expect(batch.batchSeq).toBe(0);
  });

  it("preserves ids exactly for values above Number.MAX_SAFE_INTEGER (ADR-016 §7)", () => {
    const huge = 18_446_744_073_709_551_615n; // u64::MAX
    const ipc = buildBatch([huge], [[[[0, 0], [1, 0], [0, 1], [0, 0]]]]);
    const batch = decodeBatch("sh_test", 0, ipc, "geometry", ENCODING_POLYGON);
    expect(batch.ids[0]).toBe(huge);
  });

  it("refuses a batch whose schema does not carry the expected frame tag (ADR-010 rule 1)", () => {
    const ipc = buildBatch([1n], [[[[0, 0], [1, 0], [0, 1], [0, 0]]]], "some-other-frame");
    expect(() => decodeBatch("sh_test", 0, ipc, "geometry", ENCODING_POLYGON)).toThrow(UnexpectedFrameError);
  });

  it("refuses a batch with no frame tag at all -- untagged is not tolerated as a default", () => {
    const ipc = buildBatch([1n], [[[[0, 0], [1, 0], [0, 1], [0, 0]]]], null);
    expect(() => decodeBatch("sh_test", 0, ipc, "geometry", ENCODING_POLYGON)).toThrow(UnexpectedFrameError);
  });

  it("refuses a batch missing the named geometry column", () => {
    const ipc = buildBatch([1n], [[[[0, 0], [1, 0], [0, 1], [0, 0]]]]);
    expect(() => decodeBatch("sh_test", 0, ipc, "the_wrong_column", ENCODING_POLYGON)).toThrow(
      /no `the_wrong_column`/
    );
  });

  it("refuses a null id rather than silently coercing it to 0n", () => {
    // The engine's schema declares `id: UInt64 not null`; a null here is a batch that violates its
    // own envelope, and `BigInt(null)` would otherwise silently become `0n` -- a value
    // indistinguishable from a real id.
    const idVec = vectorFromArray([1n, null], new Uint64());
    const fsl = new FixedSizeList(2, new Field("xy", new Float64(), false));
    const ringType = new List(new Field("vertices", fsl, false));
    const geomType = new List(new Field("rings", ringType, false));
    const geomVec = vectorFromArray(
      [[[[0, 0], [1, 0], [0, 1], [0, 0]]], [[[2, 2], [3, 2], [2, 3], [2, 2]]]],
      geomType
    );
    const table = new Table({ id: idVec, geometry: geomVec });
    table.schema.metadata.set("frame", EXPECTED_FRAME);
    table.schema.metadata.set("geometry_encoding", ENCODING_POLYGON);
    const ipc = tableToIPC(table, "stream");

    expect(() => decodeBatch("sh_test", 0, ipc, "geometry", ENCODING_POLYGON)).toThrow(/null id/);
  });

  /**
   * SH-1 (`engine/MULTIPOLYGON-MP1-PREREGISTRATION.md` §4, real shape: the engine's own F-1 batch).
   * F-1 is three MultiPolygon rows of 3, 1 and 2 parts, the second part of row 0 with a hole, so the
   * part ordinals 0 to 5 differ from the row indices 0 to 2 from the second row on. The decode keeps
   * every part, ring and vertex, maps each part to its row, and counts the vertices.
   *
   * RECORDED MUTATION: walk the multipolygon one level short in `decodeBatch` (treat the batch's
   * geometry as a list of rings, as the polygon encoding is). This test then fails by name.
   *
   * Observed over `ac538440` on the uncommitted tree of the shell commit: `the engine's F-1 batch decodes to its parts, partToRow, partCount and totalVertices (SH-1)`
   * FAILED by name with the mutation applied, then reverted.
   */
  it("the engine's F-1 batch decodes to its parts, partToRow, partCount and totalVertices (SH-1)", () => {
    const batch = decodeBatch("sh_f1", 0, loadBatchFixture("lv95-multipolygon-batch"), "geometry", ENCODING_MULTIPOLYGON);
    const [ox, oy, u] = [2_600_000, 1_200_000, 10];
    const at = (x: number, y: number, s: number) => SQUARE(ox + x * u, oy + y * u, s * u);

    expect(Array.from(batch.ids)).toEqual([0n, 1n, 2n]);
    expect(batch.parts.map((f) => f.length)).toEqual([3, 1, 2]);
    expect(batch.parts[0]).toEqual([
      [at(0, 0, 2)],
      [at(4, 0, 4), at(5, 1, 2)], // the second part carries a hole
      [at(10, 0, 2)],
    ]);
    expect(batch.parts[1]).toEqual([[at(0, 10, 3)]]);
    expect(batch.parts[2]).toEqual([[at(6, 10, 2)], [at(10, 10, 2)]]);
    expect(Array.from(batch.partToRow)).toEqual([0, 0, 0, 1, 2, 2]);
    expect(batch.partCount).toBe(6);
    expect(batch.totalVertices).toBe(5 * 4 + 5 + 5 * 2);
  });

  /**
   * SH-2. A batch whose `geometry_encoding` is not the open's expected encoding, or is none of the
   * five values the shell reads, throws `UnexpectedEncodingError`; the check reads the batch's own
   * metadata, never the data. A missing key is refused as well. The points cut changed this test: the
   * unknown-value case is `geoarrow.linestring` (`geoarrow.point` is now read), and a point batch under
   * a polygon expectation, and the reverse, throw. The lines cut changed it again: the unknown-value
   * case is `geoarrow.geometrycollection` (both line encodings are now read, and the message names
   * five), and a line batch under a polygon expectation, and the reverse, throw.
   *
   * RECORDED MUTATION: delete the encoding check in `decodeBatch`. This test then fails by name (the
   * multipolygon batch is walked as polygon rings, or the unknown value passes).
   *
   * Observed over `ac538440` on the uncommitted tree of the shell commit: `a mismatched, unknown or missing geometry_encoding throws UnexpectedEncodingError (SH-2)`
   * FAILED by name with the mutation applied, then reverted.
   *
   * Re-observed over `edbc0f3c` on the uncommitted tree of the shell commit, with the test as the points cut changed it: `a mismatched, unknown or missing geometry_encoding throws UnexpectedEncodingError (SH-2)`
   * FAILED by name with the mutation applied, at its first assertion (the multipolygon batch under a polygon expectation: `expected function to throw an error, but it didn't`), then reverted.
   *
   * Re-observed over `26d4ccc0` on the uncommitted tree of the shell commit, with the test as the lines cut changed it: `a mismatched, unknown or missing geometry_encoding throws UnexpectedEncodingError (SH-2)`
   * FAILED by name with the mutation applied, at its first assertion (the multipolygon batch under a polygon expectation: `expected function to throw an error, but it didn't`), then reverted.
   */
  it("a mismatched, unknown or missing geometry_encoding throws UnexpectedEncodingError (SH-2)", () => {
    const polygon = loadBatchFixture("lv95-polygon-batch");
    const multipolygon = loadBatchFixture("lv95-multipolygon-batch");
    expect(() => decodeBatch("sh", 0, multipolygon, "geometry", ENCODING_POLYGON)).toThrow(UnexpectedEncodingError);
    expect(() => decodeBatch("sh", 0, polygon, "geometry", ENCODING_MULTIPOLYGON)).toThrow(UnexpectedEncodingError);
    // None of the five values the shell reads, even when the open's expectation names the same string.
    const unknown = buildBatch([1n], [[[[0, 0], [1, 0], [0, 1], [0, 0]]]], EXPECTED_FRAME, "geoarrow.geometrycollection");
    expect(() => decodeBatch("sh", 0, unknown, "geometry", "geoarrow.geometrycollection")).toThrow(
      UnexpectedEncodingError
    );
    // A line batch under a polygon expectation is refused, and a polygon batch under a line one, and a
    // linestring batch under a multilinestring one.
    const linestring = loadBatchFixture("lv95-linestring-batch");
    const multilinestring = loadBatchFixture("lv95-multilinestring-batch");
    expect(() => decodeBatch("sh", 0, linestring, "geometry", ENCODING_POLYGON)).toThrow(UnexpectedEncodingError);
    expect(() => decodeBatch("sh", 0, multilinestring, "geometry", ENCODING_POLYGON)).toThrow(UnexpectedEncodingError);
    expect(() => decodeBatch("sh", 0, polygon, "geometry", ENCODING_LINESTRING)).toThrow(UnexpectedEncodingError);
    expect(() => decodeBatch("sh", 0, linestring, "geometry", ENCODING_MULTILINESTRING)).toThrow(
      UnexpectedEncodingError
    );
    // A point batch under a polygon expectation is refused, and a polygon batch under a point one.
    const point = loadBatchFixture("lv95-point-batch");
    expect(() => decodeBatch("sh", 0, point, "geometry", ENCODING_POLYGON)).toThrow(UnexpectedEncodingError);
    expect(() => decodeBatch("sh", 0, polygon, "geometry", ENCODING_POINT)).toThrow(UnexpectedEncodingError);
    const untagged = buildBatch([1n], [[[[0, 0], [1, 0], [0, 1], [0, 0]]]], EXPECTED_FRAME, null);
    expect(() => decodeBatch("sh", 0, untagged, "geometry", ENCODING_POLYGON)).toThrow(UnexpectedEncodingError);

    let thrown: unknown;
    try {
      decodeBatch("sh", 0, multipolygon, "geometry", ENCODING_POLYGON);
    } catch (e) {
      thrown = e;
    }
    expect(thrown).toBeInstanceOf(UnexpectedEncodingError);
    expect((thrown as UnexpectedEncodingError).message).toMatch(/^\[P6 placeholder\]/);
    for (const read of [
      ENCODING_POLYGON,
      ENCODING_MULTIPOLYGON,
      ENCODING_POINT,
      ENCODING_LINESTRING,
      ENCODING_MULTILINESTRING,
    ]) {
      expect((thrown as UnexpectedEncodingError).message).toContain(read); // names all five
    }
    expect((thrown as UnexpectedEncodingError).batchEncoding).toBe(ENCODING_MULTIPOLYGON);
    expect((thrown as UnexpectedEncodingError).expectedEncoding).toBe(ENCODING_POLYGON);
  });

  /**
   * SH-3 (real shape: the engine's own LV95 polygon batch). A `geoarrow.polygon` batch gives one part
   * per feature, with no part level read from the data: three rows, three parts, `partToRow` the
   * identity, the first row's two rings (exterior and hole) kept in one part, and the f64 coordinates
   * at LV95 magnitude untouched.
   *
   * RECORDED MUTATION: read a part level under `geoarrow.polygon` in `decodeBatch` (walk polygon rows
   * as a list of parts). This test then fails by name.
   *
   * Observed over `ac538440` on the uncommitted tree of the shell commit: `the engine's polygon batch gives one part per feature (SH-3)`
   * FAILED by name with the mutation applied (the hand-built polygon decode test failed with it), then reverted.
   */
  it("the engine's polygon batch gives one part per feature (SH-3)", () => {
    const batch = decodeBatch("sh_poly", 0, loadBatchFixture("lv95-polygon-batch"), "geometry", ENCODING_POLYGON);
    expect(Array.from(batch.ids)).toEqual([0n, 1n, 2n]);
    expect(batch.parts.map((f) => f.length)).toEqual([1, 1, 1]);
    expect(Array.from(batch.partToRow)).toEqual([0, 1, 2]);
    expect(batch.partCount).toBe(3);
    expect(batch.parts[0][0].map((r) => r.length)).toEqual([30, 10]); // exterior, then a hole
    for (const feature of batch.parts) {
      for (const [x, y] of feature[0][0]) {
        expect(x).toBeGreaterThan(2_500_000); // LV95 easting, in f64
        expect(y).toBeGreaterThan(1_100_000);
      }
    }
    let vertices = 0;
    for (const feature of batch.parts) {
      for (const ring of feature[0]) vertices += ring.length;
    }
    expect(batch.totalVertices).toBe(vertices);
  });

  /**
   * SH-P1 (real shape: the engine's own `lv95-point-batch`, BF-P, decoded by the product `decodeBatch`).
   * Six point rows decode to one part each, the part holding one single-position ring: `partToRow` is
   * the identity, `partCount` and `totalVertices` equal the row count, and each coordinate carries
   * the bits the engine wrote (compared with `Object.is`, and each is not representable in `f32`, so a
   * narrowing shows). `geometryKindOf` maps the three encodings to their kind.
   *
   * RECORDED MUTATION: walk a point row as a ring list in `decodeBatch` (delete its point branch, so
   * the row falls into the polygon ring walk). This test then fails by name.
   *
   * Observed over `edbc0f3c` on the uncommitted tree of the shell commit: `the engine's point batch decodes to one single-position part per row, partToRow the identity, bits unchanged (SH-P1)`
   * FAILED by name with the mutation applied (`TypeError: ring is not iterable`, thrown in the ring walk at this test's decode call, before any assertion), then reverted.
   */
  it("the engine's point batch decodes to one single-position part per row, partToRow the identity, bits unchanged (SH-P1)", () => {
    const batch = decodeBatch("sh_p1", 0, loadBatchFixture("lv95-point-batch"), "geometry", ENCODING_POINT);
    const positions = pointP1Positions();

    expect(Array.from(batch.ids)).toEqual([0n, 1n, 2n, 3n, 4n, 5n]);
    expect(batch.parts).toHaveLength(6);
    positions.forEach(([x, y], k) => {
      expect(batch.parts[k]).toHaveLength(1); // one part
      expect(batch.parts[k][0]).toHaveLength(1); // holding one ring
      expect(batch.parts[k][0][0]).toHaveLength(1); // of one position
      const [bx, by] = batch.parts[k][0][0][0];
      expect(Math.fround(x)).not.toBe(x); // the fixture is bit-sensitive
      expect(Object.is(bx, x)).toBe(true);
      expect(Object.is(by, y)).toBe(true);
    });
    expect(Array.from(batch.partToRow)).toEqual([0, 1, 2, 3, 4, 5]);
    expect(batch.partCount).toBe(6);
    expect(batch.totalVertices).toBe(6);

    expect(geometryKindOf(ENCODING_POINT)).toBe("point");
    expect(geometryKindOf(ENCODING_POLYGON)).toBe("polygonal");
    expect(geometryKindOf(ENCODING_MULTIPOLYGON)).toBe("polygonal");
  });

  /**
   * SH-L0. `geometryKindOf` maps both line encodings to `line`, the point encoding to `point`, and the
   * polygon and multipolygon encodings, and any other string, to `polygonal` as before. It is a pure
   * function of the encoding string.
   *
   * RECORDED MUTATION: map `geoarrow.multilinestring` to `polygonal` in `geometryKindOf` (return
   * `line` for the linestring encoding only). This test then fails by name.
   *
   * Observed over `26d4ccc0` on the uncommitted tree of the shell commit: `geometryKindOf maps both line encodings to line and the others as before (SH-L0)`
   * FAILED by name with the mutation applied, at `expect(geometryKindOf(ENCODING_MULTILINESTRING)).toBe("line")` (`expected 'polygonal' to be 'line'`), then reverted.
   */
  it("geometryKindOf maps both line encodings to line and the others as before (SH-L0)", () => {
    expect(geometryKindOf(ENCODING_LINESTRING)).toBe("line");
    expect(geometryKindOf(ENCODING_MULTILINESTRING)).toBe("line");
    expect(geometryKindOf(ENCODING_POINT)).toBe("point");
    expect(geometryKindOf(ENCODING_POLYGON)).toBe("polygonal");
    expect(geometryKindOf(ENCODING_MULTIPOLYGON)).toBe("polygonal");
    expect(geometryKindOf("geoarrow.geometrycollection")).toBe("polygonal");
  });

  /**
   * SH-L1 (real shape: the engine's own `lv95-linestring-batch` and `lv95-multilinestring-batch`, BF-L
   * and BF-ML, decoded by the product `decodeBatch`). L-1 is five LineString rows of 2, 3, 5, 2 and 4
   * positions: one part per row, the part holding one path, `partToRow` the identity, `partCount` the
   * row count, and `totalVertices` 16. ML-1 is three MultiLineString rows of 2, 1 and 3 parts, so the
   * six part ordinals differ from the row indices from the second row on: `partToRow` is
   * `[0, 0, 1, 2, 2, 2]`, `partCount` 6, `totalVertices` 15, and each part is its linestring's
   * positions in order. Each coordinate carries the bits the engine wrote (compared with `Object.is`,
   * and each is not representable in `f32`, so a narrowing shows).
   *
   * RECORDED MUTATION: walk a linestring row as a ring list in `decodeBatch` (disable the line branch,
   * so the row falls into the polygon ring walk). This test then fails by name.
   *
   * Observed over `26d4ccc0` on the uncommitted tree of the shell commit: `the engine's line batches decode to one path per part, partToRow, partCount and totalVertices, bits unchanged (SH-L1)`
   * FAILED by name with the mutation applied, at `expect(l1.parts[k][0]).toHaveLength(1)` (`expected [ …(2) ] to have a length of 1 but got 2`), then reverted.
   */
  it("the engine's line batches decode to one path per part, partToRow, partCount and totalVertices, bits unchanged (SH-L1)", () => {
    const l1 = decodeBatch("sh_l1", 0, loadBatchFixture("lv95-linestring-batch"), "geometry", ENCODING_LINESTRING);
    expect(Array.from(l1.ids)).toEqual([0n, 1n, 2n, 3n, 4n]);
    expect(l1.parts).toHaveLength(5);
    lineL1Positions().forEach((positions, k) => {
      expect(l1.parts[k]).toHaveLength(1); // one part
      expect(l1.parts[k][0]).toHaveLength(1); // holding one path
      const path = l1.parts[k][0][0];
      expect(path).toHaveLength(positions.length);
      positions.forEach(([x, y], v) => {
        expect(Math.fround(x)).not.toBe(x); // the fixture is bit-sensitive
        expect(Object.is(path[v][0], x)).toBe(true);
        expect(Object.is(path[v][1], y)).toBe(true);
      });
    });
    expect(Array.from(l1.partToRow)).toEqual([0, 1, 2, 3, 4]);
    expect(l1.partCount).toBe(5);
    expect(l1.totalVertices).toBe(2 + 3 + 5 + 2 + 4);

    const ml1 = decodeBatch(
      "sh_ml1",
      0,
      loadBatchFixture("lv95-multilinestring-batch"),
      "geometry",
      ENCODING_MULTILINESTRING
    );
    expect(Array.from(ml1.ids)).toEqual([0n, 1n, 2n]);
    expect(ml1.parts.map((f) => f.length)).toEqual([2, 1, 3]);
    multilinestringMl1Positions().forEach((parts, row) => {
      parts.forEach((positions, p) => {
        expect(ml1.parts[row][p]).toHaveLength(1); // each part holds one path
        const path = ml1.parts[row][p][0];
        expect(path).toHaveLength(positions.length);
        positions.forEach(([x, y], v) => {
          expect(Object.is(path[v][0], x)).toBe(true);
          expect(Object.is(path[v][1], y)).toBe(true);
        });
      });
    });
    expect(Array.from(ml1.partToRow)).toEqual([0, 0, 1, 2, 2, 2]);
    expect(ml1.partCount).toBe(6);
    expect(ml1.totalVertices).toBe(2 + 3 + 2 + 2 + 2 + 4);
  });
});
