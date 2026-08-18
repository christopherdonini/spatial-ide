// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it } from "vitest";

import type { CrsCatalogEntry } from "../skp/crsCatalog";
import {
  buildCrsAssertion,
  definitionValidationMessage,
  initialCrsAssertionFormState,
  MAX_CRS_DEFINITION_BYTES,
  suggestedIdentifierFor,
} from "./crsAssertionState";

function entry(overrides: Partial<CrsCatalogEntry> = {}): CrsCatalogEntry {
  return {
    id: "epsg-2056",
    authority: "EPSG",
    code: 2056,
    name: "CH1903+ / LV95",
    definition: '{"type":"ProjectedCRS"}',
    hash: "abc123",
    ...overrides,
  };
}

describe("initialCrsAssertionFormState (I2 applied to the CRS form, NEXT-CUT.md P3 item B)", () => {
  it("starts with no route and no entry selected", () => {
    const state = initialCrsAssertionFormState();
    expect(state.route).toBe("none");
    expect(state.selectedEntryId).toBeNull();
    expect(state.identifier).toBe("");
    expect(state.pastedDefinition).toBe("");
  });

  it("is not submittable even when the catalog has exactly one entry (no auto-pick of a singleton)", () => {
    const catalog = [entry()];
    expect(buildCrsAssertion(initialCrsAssertionFormState(), catalog)).toBeNull();
  });
});

describe("buildCrsAssertion", () => {
  it("null with route 'none'", () => {
    expect(buildCrsAssertion(initialCrsAssertionFormState(), [])).toBeNull();
  });

  it("null on the catalog route with no entry chosen, even with an identifier typed", () => {
    const state = { route: "catalog" as const, selectedEntryId: null, identifier: "EPSG:2056", pastedDefinition: "" };
    expect(buildCrsAssertion(state, [entry()])).toBeNull();
  });

  it("null on the catalog route with an entry chosen but a blank identifier", () => {
    const state = { route: "catalog" as const, selectedEntryId: "epsg-2056", identifier: "  ", pastedDefinition: "" };
    expect(buildCrsAssertion(state, [entry()])).toBeNull();
  });

  it("the entry's own definition, verbatim, plus the trimmed identifier, on the catalog route", () => {
    const state = {
      route: "catalog" as const,
      selectedEntryId: "epsg-2056",
      identifier: " EPSG:2056 ",
      pastedDefinition: "",
    };
    const result = buildCrsAssertion(state, [entry({ definition: '{"exact":"text"}' })]);
    expect(result).toEqual({ identifier: "EPSG:2056", definition_json: '{"exact":"text"}' });
  });

  it("null on the paste route with blank/whitespace-only text", () => {
    const state = { route: "paste" as const, selectedEntryId: null, identifier: "EPSG:2056", pastedDefinition: "   " };
    expect(buildCrsAssertion(state, [])).toBeNull();
  });

  it("the pasted text, VERBATIM (not trimmed), on the paste route -- an equal route to the catalog " +
    "(SF5, reviewer gate, admission-remediation cut): trimming here would hash a verbatim catalog " +
    "paste differently than the catalog entry itself (host-side, off pasted bytes), reading back as " +
    "`pasted` provenance instead of `catalog:…` for a byte-identical paste that included the " +
    "catalog text's own trailing newline", () => {
    const state = {
      route: "paste" as const,
      selectedEntryId: null,
      identifier: "EPSG:4326",
      pastedDefinition: '  {"pasted":"definition"}  \n',
    };
    expect(buildCrsAssertion(state, [])).toEqual({
      identifier: "EPSG:4326",
      definition_json: '  {"pasted":"definition"}  \n',
    });
  });

  it("still null on the paste route when the text is ONLY whitespace, trim used solely for the " +
    "emptiness test -- never sent as a non-empty payload", () => {
    const state = { route: "paste" as const, selectedEntryId: null, identifier: "EPSG:4326", pastedDefinition: "   \n\t  " };
    expect(buildCrsAssertion(state, [])).toBeNull();
  });
});

describe("suggestedIdentifierFor", () => {
  it("authority:code, matching ADR-015's own example shape", () => {
    expect(suggestedIdentifierFor(entry({ authority: "EPSG", code: 2056 }))).toBe("EPSG:2056");
  });
});

describe("MAX_CRS_DEFINITION_BYTES bound (SF4, reviewer gate, admission-remediation cut)", () => {
  it("a pasted definition at exactly the ceiling is still submittable", () => {
    const state = {
      route: "paste" as const,
      selectedEntryId: null,
      identifier: "EPSG:4326",
      pastedDefinition: "x".repeat(MAX_CRS_DEFINITION_BYTES),
    };
    expect(buildCrsAssertion(state, [])).not.toBeNull();
    expect(definitionValidationMessage(state, [])).toBeNull();
  });

  it("a pasted definition one byte over the ceiling is refused -- null, no request built", () => {
    const state = {
      route: "paste" as const,
      selectedEntryId: null,
      identifier: "EPSG:4326",
      pastedDefinition: "x".repeat(MAX_CRS_DEFINITION_BYTES + 1),
    };
    expect(buildCrsAssertion(state, [])).toBeNull();
    expect(definitionValidationMessage(state, [])).toMatch(/over the/);
  });

  it("byte length, not UTF-16 length -- a multi-byte character pushes bytes over the ceiling well " +
    "before .length would", () => {
    // Each "€" is 1 UTF-16 code unit but 3 UTF-8 bytes -- this text is under the ceiling by
    // `.length` but over it by UTF-8 byte count, which is what the Rust-side bound actually is
    // (`String::len()`).
    const text = "€".repeat(Math.floor(MAX_CRS_DEFINITION_BYTES / 2));
    const state = {
      route: "paste" as const,
      selectedEntryId: null,
      identifier: "EPSG:4326",
      pastedDefinition: text,
    };
    expect(text.length).toBeLessThan(MAX_CRS_DEFINITION_BYTES);
    expect(buildCrsAssertion(state, [])).toBeNull();
    expect(definitionValidationMessage(state, [])).not.toBeNull();
  });

  it("no message while the form is simply not filled in yet -- distinct from an over-bound refusal", () => {
    expect(definitionValidationMessage(initialCrsAssertionFormState(), [])).toBeNull();
  });
});
