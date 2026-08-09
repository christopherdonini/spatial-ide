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

import { decodeBatch, EXPECTED_FRAME, UnexpectedFrameError } from "./decodeBatch";

/** Builds an IPC byte buffer matching `engine::envelope::TaggedBatch`'s wire shape closely enough
 * to exercise this decoder: `id: UInt64 not null`, `geometry: List<List<FixedSizeList<2,f64>>>`,
 * schema metadata carrying `frame`. */
// `frame` is `string | null`, never `string | undefined`: passing `undefined` explicitly at a call
// site would trigger this parameter's own default rather than mean "omit the tag" -- `null` is the
// only value JS does not treat as "use the default" for a defaulted parameter.
function buildBatch(
  ids: bigint[],
  polygons: Array<Array<Array<[number, number]>>>,
  frame: string | null = EXPECTED_FRAME
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
  return tableToIPC(table, "stream");
}

describe("decodeBatch", () => {
  it("decodes ids and rings together, one feature per row, exterior + holes in order", () => {
    const ids = [7n, 9n];
    const polygons = [
      [[[0, 0], [1, 0], [1, 1], [0, 0]] as Array<[number, number]>], // one ring
      [
        [[10, 10], [11, 10], [11, 11], [10, 10]] as Array<[number, number]>, // exterior
        [[10.4, 10.4], [10.6, 10.4], [10.6, 10.6], [10.4, 10.4]] as Array<[number, number]>, // hole
      ],
    ];
    const ipc = buildBatch(ids, polygons);

    const batch = decodeBatch("sh_test", 0, ipc, "geometry");
    expect(Array.from(batch.ids)).toEqual([7n, 9n]);
    expect(batch.rings).toHaveLength(2);
    expect(batch.rings[0]).toHaveLength(1);
    expect(batch.rings[0][0]).toEqual([[0, 0], [1, 0], [1, 1], [0, 0]]);
    expect(batch.rings[1]).toHaveLength(2); // exterior + hole
    expect(batch.rings[1][1]).toEqual([[10.4, 10.4], [10.6, 10.4], [10.6, 10.6], [10.4, 10.4]]);
    expect(batch.totalVertices).toBe(4 + 4 + 4);
    expect(batch.streamHandle).toBe("sh_test");
    expect(batch.batchSeq).toBe(0);
  });

  it("preserves ids exactly for values above Number.MAX_SAFE_INTEGER (ADR-016 §7)", () => {
    const huge = 18_446_744_073_709_551_615n; // u64::MAX
    const ipc = buildBatch([huge], [[[[0, 0], [1, 0], [0, 1], [0, 0]]]]);
    const batch = decodeBatch("sh_test", 0, ipc, "geometry");
    expect(batch.ids[0]).toBe(huge);
  });

  it("refuses a batch whose schema does not carry the expected frame tag (ADR-010 rule 1)", () => {
    const ipc = buildBatch([1n], [[[[0, 0], [1, 0], [0, 1], [0, 0]]]], "some-other-frame");
    expect(() => decodeBatch("sh_test", 0, ipc, "geometry")).toThrow(UnexpectedFrameError);
  });

  it("refuses a batch with no frame tag at all -- untagged is not tolerated as a default", () => {
    const ipc = buildBatch([1n], [[[[0, 0], [1, 0], [0, 1], [0, 0]]]], null);
    expect(() => decodeBatch("sh_test", 0, ipc, "geometry")).toThrow(UnexpectedFrameError);
  });

  it("refuses a batch missing the named geometry column", () => {
    const ipc = buildBatch([1n], [[[[0, 0], [1, 0], [0, 1], [0, 0]]]]);
    expect(() => decodeBatch("sh_test", 0, ipc, "the_wrong_column")).toThrow(/no `the_wrong_column`/);
  });
});
