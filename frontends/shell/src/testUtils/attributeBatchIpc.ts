// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { Bool, Field, FixedSizeList, Float32, Float64, Int64, List, Table, tableToIPC, Uint64, Utf8, vectorFromArray } from "apache-arrow";

import { ENCODING_MULTIPOLYGON, ENCODING_POLYGON, EXPECTED_FRAME } from "../canvas/decodeBatch";

/** One projected column: its name, its Arrow type and its values, NULLs as `null`. */
export type AttributeColumn =
  | { name: string; kind: "utf8"; values: Array<string | null> }
  | { name: string; kind: "int64" | "uint64"; values: Array<bigint | null> }
  | { name: string; kind: "float32" | "float64"; values: Array<number | null> }
  | { name: string; kind: "bool"; values: Array<boolean | null> };

const fsl = new FixedSizeList(2, new Field("xy", new Float64(), false));
const polygonType = new List(new Field("rings", new List(new Field("vertices", fsl, false)), false));
const multipolygonType = new List(new Field("polygons", polygonType, false));
const ring = (x: number): Array<[number, number]> => [[x, 0], [x + 1, 0], [x + 1, 1], [x, 0]];

const vectorOf = (column: AttributeColumn) => {
  switch (column.kind) {
    case "utf8": return vectorFromArray(column.values, new Utf8());
    case "int64": return vectorFromArray(column.values, new Int64());
    case "uint64": return vectorFromArray(column.values, new Uint64());
    case "float32": return vectorFromArray(column.values, new Float32());
    case "float64": return vectorFromArray(column.values, new Float64());
    case "bool": return vectorFromArray(column.values, new Bool());
  }
};

/**
 * The one builder of an IPC batch with attribute columns for the milestone 4 PR A tests. It writes the engine's envelope shape
 * (`engine/src/envelope.rs`): `id` (UInt64), the geometry column, then the attribute columns in declared order, and the schema metadata
 * `frame`, `geometry_encoding` and `attribute_columns` (a JSON array of the names). Feature `i` has `partsPerFeature[i]` parts (one by
 * default); any feature with more than one makes the batch a multipolygon, else it is a polygon batch. Returns the bytes and the encoding
 * to pass `decodeBatch` as the open's own.
 */
export function attributeBatchIpc(
  ids: bigint[],
  columns: AttributeColumn[],
  partsPerFeature: number[] = ids.map(() => 1)
): { ipc: Uint8Array; encoding: string } {
  const multi = partsPerFeature.some((count) => count !== 1);
  const features = ids.map((_, i) => Array.from({ length: partsPerFeature[i] }, (__, p) => [ring(i * 10 + p * 2)]));
  const geometry = multi ? vectorFromArray(features, multipolygonType) : vectorFromArray(features.map((parts) => parts[0]), polygonType);
  const table = new Table({
    id: vectorFromArray(ids, new Uint64()),
    geometry,
    ...Object.fromEntries(columns.map((column) => [column.name, vectorOf(column)])),
  });
  const encoding = multi ? ENCODING_MULTIPOLYGON : ENCODING_POLYGON;
  table.schema.metadata.set("frame", EXPECTED_FRAME);
  table.schema.metadata.set("geometry_encoding", encoding);
  table.schema.metadata.set("attribute_columns", JSON.stringify(columns.map((column) => column.name)));
  return { ipc: tableToIPC(table, "stream"), encoding };
}
