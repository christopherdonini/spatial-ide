import { describe, expect, it } from "vitest";

import {
  checkPickCeiling,
  DECKGL_PICK_INDEX_CEILING,
  MAX_RESIDENT_VERTICES,
  PickCeilingExceeded,
  ResidentVertexCeilingExceeded,
} from "./limits";

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
