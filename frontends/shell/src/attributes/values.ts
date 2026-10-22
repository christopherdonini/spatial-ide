// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { DataType, Precision, tableFromIPC } from "apache-arrow";
import type { Table, Vector } from "apache-arrow";

import type { ResidentBatch } from "../canvas/decodeBatch";

/**
 * SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md section 2.2 (c): one projected value, typed. An integer of any width is a
 * `bigint` (a 64-bit value is never narrowed to `Number`, section 8 item 5); a NULL is its own kind, never an empty string
 * (section 8 item 9). `float32` and `float64` are kept apart because their display rules differ.
 */
export type AttributeValue =
  | { readonly kind: "text"; readonly text: string }
  | { readonly kind: "integer"; readonly integer: bigint }
  | { readonly kind: "float32"; readonly number: number }
  | { readonly kind: "float64"; readonly number: number }
  | { readonly kind: "boolean"; readonly boolean: boolean }
  | { readonly kind: "null" };

export interface AttributeCell {
  readonly name: string;
  readonly value: AttributeValue;
}

/** One feature's projected values, in the open's declared column order. A copy: it holds nothing of the batch it was read from. */
export type AttributeRow = readonly AttributeCell[];

/** The marker a NULL shows (a P6 placeholder). */
export const ATTRIBUTE_NULL_MARKER = "[P6 placeholder] NULL";

/** Whether `type` is one the engine emits for a projected column (utf8, boolean, the integers, float32, float64) and this reader reads. */
export function isReadableAttributeType(type: DataType): boolean {
  return DataType.isUtf8(type) || DataType.isBool(type) || DataType.isInt(type) || (DataType.isFloat(type) && type.precision !== Precision.HALF);
}

function readCell(vector: Vector, index: number): AttributeValue {
  const type = vector.type;
  const raw: unknown = vector.get(index);
  if (raw === null || raw === undefined) return { kind: "null" };
  if (DataType.isUtf8(type)) return { kind: "text", text: raw as string };
  if (DataType.isBool(type)) return { kind: "boolean", boolean: raw as boolean };
  if (DataType.isInt(type)) return { kind: "integer", integer: BigInt(raw as bigint | number) };
  if (DataType.isFloat(type) && type.precision !== Precision.HALF) {
    return { kind: type.precision === Precision.SINGLE ? "float32" : "float64", number: raw as number };
  }
  throw new Error(`attribute column of type ${String(type)} is not readable`);
}

/** The Arrow table over a block's copied bytes, parsed once per block (a view over the copy, never over the IPC message). */
const tables = new WeakMap<Uint8Array, Table>();

/**
 * The projected values of one row of `batch`, read at the decode pass's own row index: `data` is indexed here and nowhere else
 * (section 8 item 4). `rows` is the row map a duplicate drop leaves (`canvas/tileResidentSet.ts`): a kept row reads the source row
 * it was copied from. `null` when the open projects no column; `"not-held"` when the batch passed the resident attribute ceiling.
 */
export function readRow(batch: Pick<ResidentBatch, "attributes">, row: number): AttributeRow | "not-held" | null {
  const block = batch.attributes;
  if (block === null || block === "not-held") return block;
  let table = tables.get(block.data);
  if (table === undefined) {
    table = tableFromIPC(block.data);
    tables.set(block.data, table);
  }
  const index = block.rows === null ? row : block.rows[row];
  return block.names.map((name) => ({ name, value: readCell(table.getChild(name)!, index) }));
}

/** The shortest decimal text that reads back as `n` through `Math.fround`: the display of a `float32` value. */
function float32Text(n: number): string {
  if (!Number.isFinite(n)) return String(n);
  if (Object.is(n, -0)) return "-0";
  for (let precision = 1; precision <= 9; precision++) {
    const candidate = Number(n.toPrecision(precision));
    if (Math.fround(candidate) === n) return String(candidate);
  }
  return String(n);
}

/** The text a cell shows: an integer's exact decimal, a `float64`'s shortest round-trip text, a `float32`'s shortest text through `Math.fround`, and the marker for a NULL. */
export function displayValue(value: AttributeValue): string {
  switch (value.kind) {
    case "text":
      return value.text;
    case "integer":
      return value.integer.toString();
    case "float32":
      return float32Text(value.number);
    case "float64":
      return Object.is(value.number, -0) ? "-0" : String(value.number);
    case "boolean":
      return value.boolean ? "true" : "false";
    case "null":
      return ATTRIBUTE_NULL_MARKER;
  }
}
