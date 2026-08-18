// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it } from "vitest";

import type { SkpError } from "../skp/types";
import { fieldValue, formatRefusal, refusalGuidance } from "./formatRefusal";

// Mirrors kernel/src/skp.rs::error_of's exact shape for each family, so this test would fail if
// the Rust and TypeScript sides of the refusal contract ever drifted apart in what they assume
// about it -- not a substitute for the shared-fixture test, which covers the wire shape; this one
// covers the *presentation* rule (verbatim message, sorted fields, per-code guidance).

function crsAssertionConflict(): SkpError {
  return {
    code: "engine.crs_assertion_conflict",
    message:
      "refused: this file already declares a CRS; the asserted CRS was not applied and no " +
      "comparison was made (ADR-015 §4)",
    fields: { declared: "EPSG:2056", asserted: "EPSG:4326" },
  };
}

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

  it("flags a remediation form for CRS-undeclared and identity-unusable refusals only", () => {
    expect(formatRefusal(crsUndeclared()).remediationIsCut2).toBe(true);
    expect(formatRefusal(identityUnusable()).remediationIsCut2).toBe(true);
    expect(formatRefusal(axisOrderUnsupported()).remediationIsCut2).toBe(false);
    expect(formatRefusal(ceilingExceeded()).remediationIsCut2).toBe(false);
  });

  // I1 (must-fix defect): `engine.crs_assertion_conflict` is NOT in the remediation-form set --
  // AdmissionPanel's own `nextFormFamily` (AdmissionPanel.test.ts) is what actually gates the
  // control not rendering; this asserts the formatting-layer half of that guarantee.
  it("does not flag a remediation form for engine.crs_assertion_conflict (I1)", () => {
    expect(formatRefusal(crsAssertionConflict()).remediationIsCut2).toBe(false);
  });

  it("an error with no fields formats to an empty (not undefined) field list", () => {
    const f = formatRefusal({ code: "engine.cancelled", message: "cancelled", fields: {} });
    expect(f.fields).toEqual([]);
  });
});

describe("fieldValue", () => {
  it("finds a named field's value on a formatted refusal", () => {
    const f = formatRefusal(identityUnusable());
    expect(fieldValue(f, "column")).toBe("id");
  });

  it("is undefined for a field the code does not carry", () => {
    const f = formatRefusal(crsUndeclared());
    expect(fieldValue(f, "candidate_columns")).toBeUndefined();
  });
});

describe("refusalGuidance", () => {
  it("engine.crs_assertion_conflict: states the file already declares a CRS, the assertion was not applied, and no comparison was made (I1)", () => {
    const guidance = refusalGuidance("engine.crs_assertion_conflict");
    expect(guidance).not.toBeNull();
    expect(guidance).toMatch(/already declares/i);
    expect(guidance).toMatch(/not applied/i);
    expect(guidance).toMatch(/no comparison/i);
  });

  it("axis-order codes: state the file was refused, not reinterpreted, and that this is protective (D)", () => {
    for (const code of ["engine.axis_order_unestablished", "engine.axis_order_unsupported"]) {
      const guidance = refusalGuidance(code);
      expect(guidance).not.toBeNull();
      expect(guidance).toMatch(/x-first axis order/i);
      expect(guidance).toMatch(/refused, not/i);
      expect(guidance).toMatch(/protective/i);
    }
  });

  it("every other code (including crs_undeclared/identity_unusable, whose own form carries the extra copy) has no extra guidance", () => {
    expect(refusalGuidance("engine.crs_undeclared")).toBeNull();
    expect(refusalGuidance("engine.identity_unusable")).toBeNull();
    expect(refusalGuidance("engine.ceiling_exceeded")).toBeNull();
  });
});
