// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it } from "vitest";

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
    return decodeBatch(handle, 0, ipc, "geometry", encoding, ["tag"]);
  };

  // RECORDED MUTATION for "PA-U6": in `withinAttributeCeiling` leave the new batch out of the sum (`heldBytes <= RESIDENT_ATTRIBUTE_MAX_BYTES`). Expected failure:
  // the batch that would pass the ceiling is kept with its attributes.
  it("PA-U6: a batch that would pass the ceiling keeps its geometry and is marked not-held, and clearing releases the bytes", () => {
    const batch = decoded("sh_a", [1n, 2n]);
    const bytes = (batch.attributes as BatchAttributes).bytes;
    expect(bytes).toBeGreaterThan(0);
    expect(withinAttributeCeiling(batch, RESIDENT_ATTRIBUTE_MAX_BYTES - bytes)).toBe(batch); // exactly at the ceiling is within it
    const over = withinAttributeCeiling(batch, RESIDENT_ATTRIBUTE_MAX_BYTES - bytes + 1);
    expect(over.attributes).toBe("not-held");
    expect([over.ids, over.parts, over.partToRow]).toEqual([batch.ids, batch.parts, batch.partToRow]);
    expect(over.ids).toBe(batch.ids); // the geometry is the same objects, not a copy
    expect(withinAttributeCeiling(over, RESIDENT_ATTRIBUTE_MAX_BYTES)).toBe(over); // a not-held batch adds nothing

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
});
