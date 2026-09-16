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

  // I1 (must-fix defect): `engine.crs_assertion_conflict` never gets a remediation control --
  // AdmissionPanel's own `nextFormFamily` (AdmissionPanel.test.ts) is what actually gates that;
  // `formatRefusal` no longer carries a parallel `remediationIsCut2` flag of its own to drift from
  // it (NOTE cleanup, reviewer gate, admission-remediation cut -- see `formatRefusal.ts`'s own
  // comment on why deletion, not a derived field, was the fix).
  it("crsAssertionConflict still formats to a plain FormattedRefusal with no remediation flag on it", () => {
    const f = formatRefusal(crsAssertionConflict());
    expect(f.code).toBe("engine.crs_assertion_conflict");
    expect(f).not.toHaveProperty("remediationIsCut2");
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

/**
 * **Brief A P3's four new user-visible states** — and the fact that their codes reach this function
 * at all, which is what P3 gate attempt 1 got wrong.
 *
 * The publish case was unreachable then: a publish refusal crossed the Tauri boundary as
 * `PrepareOutcome::Refused { message }`, a `Display` string with no code in it. It now crosses as
 * `"<code>: <display>"` (`PublishError::refusal_detail`, pinned on the Rust side by
 * `kernel/tests/typed_terminal_codes.rs`), so `codeOf` below finds a real code in a real message.
 *
 * **No string here is asserted verbatim.** All four are placeholders for the human's P6 sight; what
 * is asserted is that each state has guidance at all and that it says the thing the operator needs
 * (what ended, whether their file is at fault, what to do) — properties a rewording keeps.
 */
describe("refusalGuidance for Brief A P3's new states", () => {
  /** How a client recovers a typed code from a refusal string the kernel prefixed. */
  function codeOf(detail: string): string {
    return detail.slice(0, detail.indexOf(":"));
  }

  // Mutation: return `e.to_string()` instead of `e.refusal_detail()` at the Tauri publish site.
  // Expected failure: "recovers the publish code from the real prefixed refusal shape, and has
  // guidance for it" fails -- which is exactly the unreachable case attempt 1 shipped.
  it("recovers the publish code from the real prefixed refusal shape, and has guidance for it", () => {
    // The shape `PublishError::refusal_detail` produces, spelled out here rather than invented.
    const detail =
      "publish.geographic_crs_not_publishable: refused: OGC:CRS84 is a geographic CRS whose " +
      "coordinates are in degrees (unit:format-rule), and the bundled viewer has no degrees path";
    expect(codeOf(detail)).toBe("publish.geographic_crs_not_publishable");

    const guidance = refusalGuidance(codeOf(detail));
    expect(guidance).not.toBeNull();
    expect(guidance).toMatch(/degrees/i);
    // It says nothing was written — a publish refusal that leaves the operator unsure whether a
    // bundle exists is the thing the preflight ordering exists to make answerable.
    expect(guidance).toMatch(/nothing has been written/i);
  });

  // Mutation: delete the `engine.source_changed` case from `refusalGuidance`. Expected failure:
  // "engine.source_changed: says what ended, what to do, and states the check's limit" fails --
  // the operator would see the raw refusal with no account of what the check cannot do.
  it("engine.source_changed: says what ended, what to do, and states the check's limit", () => {
    const guidance = refusalGuidance("engine.source_changed");
    expect(guidance).not.toBeNull();
    expect(guidance).toMatch(/no longer the one this session opened/i);
    expect(guidance).toMatch(/reopen/i);
    // Boundary 4's limit is carried, and no snapshot is claimed for what came before (A1).
    expect(guidance).toMatch(/cannot see every possible edit/i);
    expect(guidance).not.toMatch(/one snapshot/i);
  });

  // Mutation: drop the "identity column" sentence from that case. Expected failure:
  // "engine.identity_ordinal_partitioned_unsupported: names both real routes forward" fails --
  // an operator would be told only to split their data, never that declaring a column works.
  it("engine.identity_ordinal_partitioned_unsupported: names both real routes forward", () => {
    const guidance = refusalGuidance("engine.identity_ordinal_partitioned_unsupported");
    expect(guidance).not.toBeNull();
    expect(guidance).toMatch(/more than one file/i);
    expect(guidance).toMatch(/single file/i);
    expect(guidance).toMatch(/identity column/i);
  });

  // Mutation: reword that case to blame the file. Expected failure:
  // "engine.internal_inconsistency: says the defect is in the program, not in the operator's
  // file" fails -- which is the whole reason the variant was retyped off `Source`.
  it("engine.internal_inconsistency: says the defect is in the program, not in the operator's file", () => {
    const guidance = refusalGuidance("engine.internal_inconsistency");
    expect(guidance).not.toBeNull();
    expect(guidance).toMatch(/defect in this program/i);
    expect(guidance).toMatch(/not in your file/i);
  });

  // Mutation: add a `publish.row_filter_not_recordable` case. Expected failure: "the guidance
  // count matches the cases: four new states, four non-null" fails on its no-accidental-widening
  // assertion.
  it("the guidance count matches the cases: four new states, four non-null", () => {
    const added = [
      "engine.source_changed",
      "engine.identity_ordinal_partitioned_unsupported",
      "publish.geographic_crs_not_publishable",
      "engine.internal_inconsistency",
    ];
    expect(added.filter((c) => refusalGuidance(c) !== null)).toHaveLength(4);
    // And nothing was widened by accident: a neighbouring publish code still has none.
    expect(refusalGuidance("publish.row_filter_not_recordable")).toBeNull();
  });
});
