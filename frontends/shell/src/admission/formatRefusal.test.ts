import { describe, expect, it } from "vitest";

import type { SkpError } from "../skp/types";
import { formatRefusal } from "./formatRefusal";

// Mirrors kernel/src/skp.rs::error_of's exact shape for each family, so this test would fail if
// the Rust and TypeScript sides of the refusal contract ever drifted apart in what they assume
// about it -- not a substitute for the shared-fixture test, which covers the wire shape; this one
// covers the *presentation* rule (verbatim message, sorted fields, the cut-2 remediation note).

function crsUndeclared(): SkpError {
  return {
    code: "engine.crs_undeclared",
    message:
      "refused: the file declares no CRS and none was asserted by the caller (no `crs` key). " +
      "This engine does not apply GeoParquet's OGC:CRS84 default (docs/05, no silent conversion)",
    fields: { detail: "no `crs` key" },
  };
}

function axisOrderUnsupported(): SkpError {
  return {
    code: "engine.axis_order_unsupported",
    message:
      "refused: established axis order is northing,easting; this slice performs no axis " +
      "normalization and emits (easting, northing) only",
    fields: { established: "northing,easting" },
  };
}

function identityUnusable(): SkpError {
  return {
    code: "engine.identity_unusable",
    message: "refused: `id` cannot serve as stable feature identity — column not found",
    fields: { column: "id", detail: "column not found" },
  };
}

function ceilingExceeded(): SkpError {
  return {
    code: "engine.ceiling_exceeded",
    message: "declared ceiling max_partitions exceeded: limit 100000, saw 100001",
    fields: { ceiling: "max_partitions", limit: "100000", saw: "100001" },
  };
}

describe("formatRefusal", () => {
  it("carries the message verbatim -- the refusal UX IS this text", () => {
    const f = formatRefusal(crsUndeclared());
    expect(f.message).toBe(crsUndeclared().message);
    expect(f.code).toBe("engine.crs_undeclared");
  });

  it("sorts fields by key so the same error always renders the same order", () => {
    const f = formatRefusal(ceilingExceeded());
    expect(f.fields).toEqual([
      ["ceiling", "max_partitions"],
      ["limit", "100000"],
      ["saw", "100001"],
    ]);
  });

  it("flags the cut-2 remediation note for CRS and identity refusals only", () => {
    expect(formatRefusal(crsUndeclared()).remediationIsCut2).toBe(true);
    expect(formatRefusal(identityUnusable()).remediationIsCut2).toBe(true);
    expect(formatRefusal(axisOrderUnsupported()).remediationIsCut2).toBe(false);
    expect(formatRefusal(ceilingExceeded()).remediationIsCut2).toBe(false);
  });

  it("an error with no fields formats to an empty (not undefined) field list", () => {
    const f = formatRefusal({ code: "engine.cancelled", message: "cancelled", fields: {} });
    expect(f.fields).toEqual([]);
  });
});
