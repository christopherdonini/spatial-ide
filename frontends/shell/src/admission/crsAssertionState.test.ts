// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it } from "vitest";

import type { CrsCatalogEntry } from "../skp/crsCatalog";
import {
  buildCrsAssertion,
  initialCrsAssertionFormState,
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

  it("the pasted text, trimmed, on the paste route -- an equal route to the catalog", () => {
    const state = {
      route: "paste" as const,
      selectedEntryId: null,
      identifier: "EPSG:4326",
      pastedDefinition: '  {"pasted":"definition"}  ',
    };
    expect(buildCrsAssertion(state, [])).toEqual({
      identifier: "EPSG:4326",
      definition_json: '{"pasted":"definition"}',
    });
  });
});

describe("suggestedIdentifierFor", () => {
  it("authority:code, matching ADR-015's own example shape", () => {
    expect(suggestedIdentifierFor(entry({ authority: "EPSG", code: 2056 }))).toBe("EPSG:2056");
  });
});
