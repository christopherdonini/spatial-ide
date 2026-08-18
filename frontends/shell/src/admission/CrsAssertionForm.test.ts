// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import type { CrsCatalogEntry } from "../skp/crsCatalog";
import { buildCrsAssertion, definitionValidationMessage, MAX_CRS_DEFINITION_BYTES } from "./crsAssertionState";

/**
 * `CrsAssertionForm.tsx` renders `<form>`/`<textarea>` JSX no harness in this package can mount
 * (`AdmissionPanel.test.ts`'s own top comment) -- P4 item D's actual behavioral contract (an
 * over-bound paste blocks Submit AND says why) is therefore proven two ways, together:
 *
 * 1. The state-function pairing below: for the SAME over-bound `CrsAssertionFormState`,
 *    `buildCrsAssertion` (what gates the Submit button's `disabled` prop) is `null` AND
 *    `definitionValidationMessage` (what P4 item D wires into the JSX right below the paste
 *    textarea) is non-null -- the two can never disagree because the component derives both from
 *    the identical `state`/`catalog` pair every render.
 * 2. A source-text check that the component file actually CALLS `definitionValidationMessage` --
 *    P3c's own dangling-item note is exactly this: the function existed, tested, un-called. A test
 *    that only re-tested `crsAssertionState.ts` again would not have caught that gap.
 */
describe("CrsAssertionForm wiring (P4 item D: P3c's dangling item)", () => {
  it("an over-bound paste: Submit stays blocked (buildCrsAssertion null) AND the reason is sayable " +
    "(definitionValidationMessage non-null) -- the same invariant the component's JSX relies on", () => {
    const state = {
      route: "paste" as const,
      selectedEntryId: null,
      identifier: "EPSG:4326",
      pastedDefinition: "x".repeat(MAX_CRS_DEFINITION_BYTES + 1),
    };
    const catalog: CrsCatalogEntry[] = [];
    expect(buildCrsAssertion(state, catalog)).toBeNull();
    expect(definitionValidationMessage(state, catalog)).toMatch(/over the/);
  });

  it("CrsAssertionForm.tsx actually calls definitionValidationMessage (not left dangling, unlike " +
    "before this piece)", () => {
    const source = fs.readFileSync(path.resolve(__dirname, "CrsAssertionForm.tsx"), "utf-8");
    expect(source).toMatch(/definitionValidationMessage\(/);
    expect(source).toMatch(/crs-assertion-definition-validation/);
  });
});
