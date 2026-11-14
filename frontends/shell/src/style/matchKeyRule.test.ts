// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { admitsMatchKeyType } from "../../../../renderer/style-ts/src/style";

// The TypeScript side of the match-key rule's agreement with Rust (PB-U7). `renderer/tests/style_agreement.rs` reads the same rows and
// compiles a match over a column of each type through `compiled.rs::admit_match_type`; neither implementation writes the rows.
interface MatchKeyRow {
  arrow_type: string;
  admitted: boolean;
}

describe("the match-key type rule, joined to the shared vector (renderer/tests/data/style-agreement.json)", () => {
  const rows = (JSON.parse(readFileSync("../../renderer/tests/data/style-agreement.json", "utf8")) as { match_key_rows: MatchKeyRow[] }).match_key_rows;

  // RECORDED MUTATION for PB-U7 (the TypeScript side), applied alone: in `admitsMatchKeyType` (renderer/style-ts/src/style.ts) also admit a type that starts with 'Dictionary'.
  // Expected failure: at the Dictionary row.
  // OBSERVED AT 572bb917d93dd759196be47ddd218762abae1810: FAILED -- "PB-U7: admitsMatchKeyType equals the vector's admitted flag for every typed row": AssertionError: admitsMatchKeyType(Dictionary(Int32, Utf8)): expected true to be false // Object.is equality. Reverted after observing.
  it("PB-U7: admitsMatchKeyType equals the vector's admitted flag for every typed row", () => {
    expect(rows.length, "rows in the vector, so that the loop below is not vacuous").toBeGreaterThan(5);
    for (const row of rows) {
      expect(admitsMatchKeyType(row.arrow_type), `admitsMatchKeyType(${row.arrow_type})`).toBe(row.admitted);
    }
    expect(rows.some((r) => r.admitted) && rows.some((r) => !r.admitted), "the vector holds both outcomes").toBe(true);
    expect(rows.map((r) => r.arrow_type).filter((t) => t.startsWith("Dictionary")), "a dictionary-encoded text column is among the refused rows").not.toEqual([]);
  });
});
