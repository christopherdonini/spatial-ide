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
 * `"<code>: <display>"` (`PublishError::refusal_detail`), and **the product parses it** --
 * `publish/formatPublishRefusal.ts`, whose own test drives that parser from the kernel's real
 * output. A test-local parser used to stand in for it here; it is gone, because a test that
 * re-implements the interface it is meant to be checking proves nothing about the product.
 *
 * **One string here IS asserted verbatim — `engine.source_changed`, in "says only what is true at
 * this commit" below, because the human ruled its exact words (round 5 item 1).** The header used
 * to say "no string here is asserted verbatim. All four are placeholders", twelve lines above that
 * assertion; it was true when written and stopped being true when the ruling landed. The other
 * three are placeholders for the P6 sight, and
 * for those what is asserted is that each state has guidance at all and that it says the thing the
 * operator needs (what ended, whether their file is at fault, what to do) — properties a rewording
 * keeps.
 */
describe("refusalGuidance for Brief A P3's new states", () => {
  // Mutation: revert to P3a's interim sentence ("The source file changed while it was open; reopen
  // the dataset to continue."). Expected failure: "engine.source_changed: says only what is true at
  // this commit" fails on the exact-equality assertion and on the cleared/identified assertions --
  // which is the point of pinning it: the interim sentence is now an UNDER-claim, and an operator
  // would not be told their canvas was emptied when it was.
  // OBSERVED (performed once on this branch, then reverted): FAILED --
  // `AssertionError: expected 'The source file changed while it was …' to be 'The source file
  // changed while it was …'`.
  it("engine.source_changed: says only what is true at this commit", () => {
    // **Asserted verbatim, unlike its three siblings below** -- the human ruled that this sentence's
    // wording is a decision (2026-09-16, round 5 item 1) precisely because an earlier one described
    // behaviour the shell did not have. A rewording is a decision, not a refactor, so it must break
    // this test. **P3b's sentence**, replacing the interim one on the second half of that same
    // ruling ("P3b restores the stronger sentence when it becomes true, wording at P6").
    expect(refusalGuidance("engine.source_changed")).toBe(
      "The source file changed while it was open. What this canvas had read from it has been " +
        "cleared, and features here can no longer be identified; reopen the dataset to continue."
    );
    // The two consequences it claims are the two P3b performs, and no more: residency cleared
    // (both arms) and picks refused until reopen. Asserted as properties rather than only as bytes,
    // so a P6 rewording that dropped one of them is caught by name.
    expect(refusalGuidance("engine.source_changed")).toMatch(/cleared/i);
    expect(refusalGuidance("engine.source_changed")).toMatch(/no longer be identified/i);
    expect(refusalGuidance("engine.source_changed")).toMatch(/reopen the dataset/i);
    // And no snapshot is claimed for what came before (A1): what was cleared is stated, never that
    // what was cleared was consistent.
    expect(refusalGuidance("engine.source_changed")).not.toMatch(/snapshot/i);
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

/**
 * `engine/SOURCE-WATCHER-PREREGISTRATION.md` §4, SH3/SH4: the coverage-lost guidance, marked
 * `[P6 placeholder]` (§7) -- unlike `engine.source_changed` immediately above, its wording is not
 * settled and no test asserts it verbatim.
 */
describe("refusalGuidance for engine.source_coverage_lost (SH3/SH4)", () => {
  // Mutation: remove the `engine.source_coverage_lost` case (falls through to `default: null`).
  // Expected failure: the first assertion below fails (`null` where a string was expected).
  it("is a marked placeholder, distinct from engine.source_changed's wording", () => {
    const guidance = refusalGuidance("engine.source_coverage_lost");
    expect(guidance).not.toBeNull();
    expect(guidance).toMatch(/^\[P6 placeholder\]/);
    expect(guidance).not.toBe(refusalGuidance("engine.source_changed"));
  });
});
