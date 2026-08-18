// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it } from "vitest";

import { buildIdentityDeclaration, initialIdentityFormState } from "./identityDeclarationState";

describe("initialIdentityFormState (I2: unranked, unpreselected -- even a single candidate)", () => {
  it("starts with no route and no column selected", () => {
    const state = initialIdentityFormState();
    expect(state.route).toBe("none");
    expect(state.selectedColumn).toBeNull();
    expect(state.freeTextColumn).toBe("");
  });

  it("is not submittable on its own -- true regardless of how many candidates the caller has, since this function never sees the candidate list at all", () => {
    expect(buildIdentityDeclaration(initialIdentityFormState())).toBeNull();
  });
});

describe("buildIdentityDeclaration", () => {
  it("null with route 'none'", () => {
    expect(buildIdentityDeclaration(initialIdentityFormState())).toBeNull();
  });

  it("the selected column, on the candidate route", () => {
    const state = { route: "candidate" as const, selectedColumn: "parcel_key", freeTextColumn: "" };
    expect(buildIdentityDeclaration(state)).toEqual({ column: "parcel_key" });
  });

  it("null on the candidate route with no column actually selected (defensive)", () => {
    const state = { route: "candidate" as const, selectedColumn: null, freeTextColumn: "" };
    expect(buildIdentityDeclaration(state)).toBeNull();
  });

  it("the trimmed free-text column, on the freeText route -- an equal route to a candidate pick, even naming a column the engine will go on to refuse", () => {
    const state = { route: "freeText" as const, selectedColumn: null, freeTextColumn: "  not_a_real_column  " };
    expect(buildIdentityDeclaration(state)).toEqual({ column: "not_a_real_column" });
  });

  it("null on the freeText route with blank/whitespace-only text", () => {
    const state = { route: "freeText" as const, selectedColumn: null, freeTextColumn: "   " };
    expect(buildIdentityDeclaration(state)).toBeNull();
  });
});
