// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it } from "vitest";

import { formFamilyForCode, nextFormFamily } from "./AdmissionPanel";

// `AdmissionPanel.tsx` renders `<WorkingCanvas>`-adjacent JSX no harness in this package can
// mount (App.test.ts's own top comment); `formFamilyForCode`/`nextFormFamily` are exported
// specifically so the actual decision -- which remediation form (if any) stays reachable for a
// given refusal -- is testable on its own terms, the same pattern as `App.tsx`'s `nextScanState`.

describe("formFamilyForCode", () => {
  it("engine.crs_undeclared starts the CRS family", () => {
    expect(formFamilyForCode("engine.crs_undeclared")).toBe("crs");
  });

  it("engine.identity_unusable starts the identity family", () => {
    expect(formFamilyForCode("engine.identity_unusable")).toBe("identity");
  });

  it("every other code starts no family on its own", () => {
    expect(formFamilyForCode("engine.axis_order_unestablished")).toBeNull();
    expect(formFamilyForCode("engine.axis_order_unsupported")).toBeNull();
    expect(formFamilyForCode("engine.crs_assertion_conflict")).toBeNull();
    expect(formFamilyForCode("engine.ceiling_exceeded")).toBeNull();
  });
});

describe("nextFormFamily (NEXT-CUT.md P3 item D: 're-refusal ... form still reachable')", () => {
  it("a fresh crs_undeclared refusal opens the CRS form regardless of what came before", () => {
    expect(nextFormFamily(null, "engine.crs_undeclared")).toBe("crs");
    expect(nextFormFamily("identity", "engine.crs_undeclared")).toBe("crs");
  });

  it("a fresh identity_unusable refusal opens the identity form regardless of what came before", () => {
    expect(nextFormFamily(null, "engine.identity_unusable")).toBe("identity");
    expect(nextFormFamily("crs", "engine.identity_unusable")).toBe("identity");
  });

  it("a re-refusal with the SAME code keeps that code's own form reachable", () => {
    expect(nextFormFamily("identity", "engine.identity_unusable")).toBe("identity");
  });

  it("an axis-order re-refusal after an active CRS-assertion attempt keeps the CRS form reachable", () => {
    // ADR-015 §5: an axis-order refusal following a CRS assertion can only be a property of the
    // definition just asserted -- the operator has to be able to try a different one without the
    // panel dead-ending.
    expect(nextFormFamily("crs", "engine.axis_order_unestablished")).toBe("crs");
    expect(nextFormFamily("crs", "engine.axis_order_unsupported")).toBe("crs");
  });

  it("a FRESH axis-order refusal, with no prior remediation attempt, renders no form", () => {
    // Reached by opening a file whose FILE-DECLARED CRS itself has an axis-order problem --
    // asserting a CRS is not even applicable there (ADR-015 §4: assertion only over a file
    // declaring nothing), so there is no form to show, only `refusalGuidance`'s copy.
    expect(nextFormFamily(null, "engine.axis_order_unestablished")).toBeNull();
    expect(nextFormFamily(null, "engine.axis_order_unsupported")).toBeNull();
  });

  it("I1: engine.crs_assertion_conflict NEVER carries a form forward, no matter the prior family", () => {
    expect(nextFormFamily("crs", "engine.crs_assertion_conflict")).toBeNull();
    expect(nextFormFamily("identity", "engine.crs_assertion_conflict")).toBeNull();
    expect(nextFormFamily(null, "engine.crs_assertion_conflict")).toBeNull();
  });

  it("an unrelated code (e.g. ceiling_exceeded) clears no active family but starts none either", () => {
    expect(nextFormFamily(null, "engine.ceiling_exceeded")).toBeNull();
    expect(nextFormFamily("crs", "engine.ceiling_exceeded")).toBe("crs");
  });
});
