// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it } from "vitest";

import { DEFAULT_STYLE_STATE, parseStyleState } from "../style/document";
import type { StyleState } from "../style/document";
import { attributeBatchIpc } from "../testUtils/attributeBatchIpc";
import { decodeBatch } from "./decodeBatch";
import { RESIDENT_ATTRIBUTE_MAX_BYTES, withinAttributeCeiling } from "./limits";
import { rowGroups } from "./matchGroups";

const state = (column: string): StyleState => ({
  ...DEFAULT_STYLE_STATE,
  fillMatch: { column, cases: [{ when: "a", then: "#aa0000" }, { when: "b", then: "#0000bb" }], onNull: "#888888", onUnmatched: "#cccccc" },
});

/** Five rows decoded for real: a text column `tag` and an integer column `n`, as the open would project them. */
function decoded() {
  const { ipc, encoding } = attributeBatchIpc([1n, 2n, 3n, 4n, 5n], [
    { name: "tag", kind: "utf8", values: ["a", null, "zzz", "b", "a"] },
    { name: "n", kind: "int64", values: [1n, 2n, 3n, 4n, 5n] },
  ]);
  return decodeBatch("sh_g", 0, ipc, "geometry", encoding, ["tag", "n"], null);
}

describe("the per-row groups of a fill by category (section 2.3 (c), OPEN-3 (a))", () => {
  // The legend order is the cases, then No value, then Other: groups 0 and 1 are a and b, 2 is No value and 3 is Other.
  // RECORDED MUTATION for PB-U10b, applied alone: in `readColumn` (attributes/values.ts) read only a block whose `kept` is "projection".
  // Expected failure: a match block reads as no column, and every row draws as Other.
  // OBSERVED AT 572bb917d93dd759196be47ddd218762abae1810: FAILED -- "PB-U10b: a match block gives the same groups as the full block of the same decode, and a block without the column, not-held and no block give every row Other": AssertionError: the groups of the match block: expected [ 3, 3, 3, 3, 3 ] to deeply equal [ +0, 2, 3, 1, +0 ]. Reverted after observing.
  it("PB-U10b: a match block gives the same groups as the full block of the same decode, and a block without the column, not-held and no block give every row Other", () => {
    const style = parseStyleState(state("tag"));
    const full = decoded();
    expect([...rowGroups(full, style)], "the groups of the full block").toEqual([0, 2, 3, 1, 0]);

    const kept = withinAttributeCeiling(full, RESIDENT_ATTRIBUTE_MAX_BYTES - 1, "tag");
    expect((kept.attributes as { kept: string }).kept, "the batch kept only its match column").toBe("match");
    expect([...rowGroups(kept, style)], "the groups of the match block").toEqual([...rowGroups(full, style)]);

    const other = style.unmatchedGroup();
    expect(other, "the group of a row with no value to ask about").toBe(3);
    const noColumn = parseStyleState(state("absent"));
    expect([...rowGroups(full, noColumn)], "a block without the column").toEqual(new Array(5).fill(noColumn.unmatchedGroup()));
    expect([...rowGroups({ ...full, attributes: "not-held" }, style)], "a not-held batch").toEqual(new Array(5).fill(other));
    expect([...rowGroups({ ...full, attributes: null }, style)], "a batch with no block").toEqual(new Array(5).fill(other));
  });

  it("remembers a batch's groups for one Style object and reads them again for another", () => {
    const batch = decoded();
    const style = parseStyleState(state("tag"));
    expect(rowGroups(batch, style), "the same batch and style").toBe(rowGroups(batch, style));
    expect(rowGroups(batch, parseStyleState(state("tag"))), "a style resolved again").not.toBe(rowGroups(batch, style));
  });
});
