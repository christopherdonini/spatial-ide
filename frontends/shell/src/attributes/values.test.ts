// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it } from "vitest";

import { decodeBatch } from "../canvas/decodeBatch";
import { attributeBatchIpc } from "../testUtils/attributeBatchIpc";
import type { AttributeColumn } from "../testUtils/attributeBatchIpc";
import { ATTRIBUTE_NULL_MARKER, displayValue, readRow } from "./values";

/** The cells of row `row` as the text the Feature tab shows, read through the real decode and `readRow`. */
function shown(columns: AttributeColumn[], rows: number): string[][] {
  const ids = Array.from({ length: rows }, (_, i) => BigInt(i));
  const { ipc, encoding } = attributeBatchIpc(ids, columns);
  const batch = decodeBatch("sh_v", 0, ipc, "geometry", encoding, columns.map((c) => c.name), null);
  return ids.map((_, row) => (readRow(batch, row) as Exclude<ReturnType<typeof readRow>, string | null>).map((cell) => displayValue(cell.value)));
}

describe("readRow and displayValue (SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md section 2.2 (c))", () => {
  // RECORDED MUTATION for "PA-U4": in `readCell`, read an integer as `BigInt(Number(raw))`. Expected failure: 2^53 + 1 shows as 9007199254740992.
  it("PA-U4: shows 64-bit integers exactly, NULL as the marker, float32 and float64 by their own rules, and a boolean", () => {
    const [low, high] = shown(
      [
        { name: "i", kind: "int64", values: [2n ** 63n - 1n, 2n ** 53n + 1n, -(2n ** 63n)] },
        { name: "u", kind: "uint64", values: [2n ** 64n - 1n, null, 0n] },
      ],
      3
    ).reduce<[string[], string[]]>(([a, b], [i, u]) => [[...a, i], [...b, u]], [[], []]);
    expect(low).toEqual(["9223372036854775807", "9007199254740993", "-9223372036854775808"]);
    expect(high).toEqual(["18446744073709551615", ATTRIBUTE_NULL_MARKER, "0"]);

    const rows = shown(
      [
        { name: "f32", kind: "float32", values: [0.1, 16777216, 3.4028234663852886e38, null] },
        { name: "f64", kind: "float64", values: [0.1, 8267.067509130165, 0.1 + 0.2, -0] },
        { name: "b", kind: "bool", values: [true, false, null, true] },
        { name: "t", kind: "utf8", values: ["", "x", null, "é"] },
      ],
      4
    );
    // A float32 shows the shortest text that reads back through Math.fround (Math.fround(0.1) is 0.10000000149011612); a float64 the shortest round trip.
    expect(rows.map((r) => r[0])).toEqual(["0.1", "16777216", "3.4028235e+38", ATTRIBUTE_NULL_MARKER]);
    expect(rows.map((r) => r[1])).toEqual(["0.1", "8267.067509130165", "0.30000000000000004", "-0"]);
    expect(rows.map((r) => r[2])).toEqual(["true", "false", ATTRIBUTE_NULL_MARKER, "true"]);
    expect(rows.map((r) => r[3])).toEqual(["", "x", ATTRIBUTE_NULL_MARKER, "é"]); // an empty string is not a NULL
  });

  it("reads null for a batch decoded with no projection, and a not-held batch as not-held", () => {
    const { ipc, encoding } = attributeBatchIpc([1n], []);
    const batch = decodeBatch("sh_v", 0, ipc, "geometry", encoding, null, null);
    expect(readRow(batch, 0)).toBeNull();
    expect(readRow({ attributes: "not-held" }, 0)).toBe("not-held");
  });
});
