// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it } from "vitest";

import { readColumn, readRow } from "../attributes/values";
import { attributeBatchIpc } from "../testUtils/attributeBatchIpc";
import { decodeBatch } from "./decodeBatch";
import type { BatchAttributes } from "./decodeBatch";
import {
  checkPickCeiling,
  DECKGL_PICK_INDEX_CEILING,
  MAX_RESIDENT_VERTICES,
  PickCeilingExceeded,
  RESIDENT_ATTRIBUTE_MAX_BYTES,
  residentAttributeBytes,
  ResidentVertexCeilingExceeded,
  withinAttributeCeiling,
} from "./limits";
import { ResidentSet } from "./residentSet";
import { TileResidentSet } from "./tileResidentSet";

describe("declared ceilings (ADR-010 rule 6)", () => {
  it("checkPickCeiling accepts exactly at the ceiling and refuses one past it", () => {
    expect(() => checkPickCeiling(DECKGL_PICK_INDEX_CEILING)).not.toThrow();
    expect(() => checkPickCeiling(DECKGL_PICK_INDEX_CEILING + 1)).toThrow(PickCeilingExceeded);
  });

  it("PickCeilingExceeded names the ceiling in its message", () => {
    try {
      checkPickCeiling(DECKGL_PICK_INDEX_CEILING + 5);
      expect.unreachable();
    } catch (e) {
      expect(e).toBeInstanceOf(PickCeilingExceeded);
      expect((e as Error).message).toContain(String(DECKGL_PICK_INDEX_CEILING));
    }
  });

  it("ResidentVertexCeilingExceeded names the declared constant", () => {
    const e = new ResidentVertexCeilingExceeded(MAX_RESIDENT_VERTICES + 1);
    expect(e.message).toContain("MAX_RESIDENT_VERTICES");
    expect(e.message).toContain(String(MAX_RESIDENT_VERTICES));
  });
});

describe("the resident attribute ceiling (SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md section 2.2 (d))", () => {
  const decoded = (handle: string, ids: bigint[]) => {
    const { ipc, encoding } = attributeBatchIpc(ids, [{ name: "tag", kind: "utf8", values: ids.map((id) => `v${id}`) }]);
    return decodeBatch(handle, 0, ipc, "geometry", encoding, ["tag"], null);
  };

  // RECORDED MUTATION for "PA-U6": in `withinAttributeCeiling` leave the new batch out of the sum (`heldBytes <= RESIDENT_ATTRIBUTE_MAX_BYTES`). Expected failure:
  // the batch that would pass the ceiling is kept with its attributes.
  it("PA-U6: a batch that would pass the ceiling keeps its geometry and is marked not-held, and clearing releases the bytes", () => {
    const batch = decoded("sh_a", [1n, 2n]);
    const bytes = (batch.attributes as BatchAttributes).bytes;
    expect(bytes).toBeGreaterThan(0);
    expect(withinAttributeCeiling(batch, RESIDENT_ATTRIBUTE_MAX_BYTES - bytes, null)).toBe(batch); // exactly at the ceiling is within it
    const over = withinAttributeCeiling(batch, RESIDENT_ATTRIBUTE_MAX_BYTES - bytes + 1, null);
    expect(over.attributes).toBe("not-held");
    expect([over.ids, over.parts, over.partToRow]).toEqual([batch.ids, batch.parts, batch.partToRow]);
    expect(over.ids).toBe(batch.ids); // the geometry is the same objects, not a copy
    expect(withinAttributeCeiling(over, RESIDENT_ATTRIBUTE_MAX_BYTES, null)).toBe(over); // a not-held batch adds nothing

    const baseline = new ResidentSet();
    baseline.addBatch(batch);
    baseline.addBatch({ ...over, batchSeq: 1 });
    expect(residentAttributeBytes(baseline.getBatches())).toBe(bytes);
    baseline.clearStream("sh_a");
    expect(residentAttributeBytes(baseline.getBatches())).toBe(0);

    const tiles = new TileResidentSet();
    tiles.addBatch("0:0", decoded("sh_b", [3n]));
    expect(residentAttributeBytes(tiles.getBatches())).toBeGreaterThan(0);
    tiles.clear();
    expect(residentAttributeBytes(tiles.getBatches())).toBe(0);
  });

  /** `ids` decoded with a `tag` text column (`v<id>`, or `tags`) and an integer column `n`, the open's own projection. */
  const twoColumns = (handle: string, ids: bigint[], tags: Array<string | null> = ids.map((id) => `v${id}`)) => {
    const { ipc, encoding } = attributeBatchIpc(ids, [
      { name: "tag", kind: "utf8", values: tags },
      { name: "n", kind: "int64", values: ids },
    ]);
    return decodeBatch(handle, 0, ipc, "geometry", encoding, ["tag", "n"], null);
  };

  // The match column's block (section 2.2 (d), OPEN-20 (a)): what a batch past the ceiling keeps while the style colours by `tag`.
  it("PB-U10a: past the ceiling a batch keeps the match column alone, which the sum counts, readRow calls not-held and the column reader reads, also after a duplicate drop", () => {
    const decoded = twoColumns("sh_a", [1n, 2n, 3n]);
    const full = (decoded.attributes as BatchAttributes).bytes;
    const kept = withinAttributeCeiling(decoded, RESIDENT_ATTRIBUTE_MAX_BYTES - 1, "tag");
    const block = kept.attributes as BatchAttributes;
    expect([block.names, block.kept, block.rows], "the kept block").toEqual([["tag"], "match", null]);
    expect(block.bytes, "a one-column copy is smaller than the two columns").toBeLessThan(full);
    expect(residentAttributeBytes([kept]), "the sum counts the kept block's bytes").toBe(block.bytes);
    expect(readRow(kept, 0), "a row of a match block").toBe("not-held");
    expect(readColumn(kept, "tag"), "the column reader on the kept block").toEqual(["v1", "v2", "v3"]);
    expect(readColumn(kept, "n"), "a column the block does not keep").toBeNull();
    expect(withinAttributeCeiling(kept, RESIDENT_ATTRIBUTE_MAX_BYTES - 1, "tag"), "a match block is kept as it is").toBe(kept);
    expect(withinAttributeCeiling(decoded, RESIDENT_ATTRIBUTE_MAX_BYTES - 1, null).attributes, "no match column").toBe("not-held");
    expect(withinAttributeCeiling(decoded, RESIDENT_ATTRIBUTE_MAX_BYTES - 1, "absent").attributes, "a match column the batch lacks").toBe("not-held");
    expect(readColumn({ attributes: "not-held" }, "tag"), "a not-held batch").toBeNull();

    // A real tile set drops the duplicate (id 3, already resident via tile 0:0) and maps the kept rows: each reads its own value.
    const tiles = new TileResidentSet();
    tiles.addBatch("0:0", kept);
    const second = withinAttributeCeiling(twoColumns("sh_b", [3n, 4n, 5n], ["dup", "four", null]), RESIDENT_ATTRIBUTE_MAX_BYTES - 1, "tag");
    tiles.addBatch("0:1", second);
    const resident = tiles.getBatches();
    expect(resident.map((b) => [...b.ids]), "the second tile's batch lost the duplicate").toEqual([[1n, 2n, 3n], [4n, 5n]]);
    expect(resident.map((b) => readColumn(b, "tag")), "each kept row's own value").toEqual([["v1", "v2", "v3"], ["four", null]]);
  });
});
