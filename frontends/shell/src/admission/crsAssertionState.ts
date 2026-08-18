// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import type { CrsCatalogEntry } from "../skp/crsCatalog";
import type { CrsAssertion } from "../skp/types";

/**
 * `CrsAssertionForm`'s pure state and submission logic, kept separate from the React component
 * (this package's own convention -- see `App.tsx`'s `admitAndResetStaleUiState`/`nextScanState`,
 * and `App.test.ts`'s own top comment on why: no `@testing-library/react`-equivalent harness
 * exists here, so anything worth a unit test is factored out of JSX and tested directly).
 */

export type CrsAssertionRoute = "none" | "catalog" | "paste";

export interface CrsAssertionFormState {
  route: CrsAssertionRoute;
  selectedEntryId: string | null;
  identifier: string;
  pastedDefinition: string;
}

/** Nothing chosen, nothing typed -- ADR-026 decision 1 / this cut's own I2 principle applied to
 * the CRS form as well as the identity one: no catalog entry starts selected, and no route is
 * assumed. */
export function initialCrsAssertionFormState(): CrsAssertionFormState {
  return { route: "none", selectedEntryId: null, identifier: "", pastedDefinition: "" };
}

function definitionFor(state: CrsAssertionFormState, catalog: readonly CrsCatalogEntry[]): string | null {
  if (state.route === "catalog") {
    const entry = catalog.find((e) => e.id === state.selectedEntryId);
    return entry ? entry.definition : null;
  }
  if (state.route === "paste") {
    const text = state.pastedDefinition.trim();
    return text.length > 0 ? text : null;
  }
  return null;
}

/**
 * The exact `CrsAssertion` this form state would submit, or `null` if it is not yet submittable --
 * a non-blank identifier AND a usable definition from whichever route is active (catalog pick, or
 * non-blank pasted text). The same function gates the Submit button and builds the actual payload,
 * so the two can never disagree.
 */
export function buildCrsAssertion(
  state: CrsAssertionFormState,
  catalog: readonly CrsCatalogEntry[]
): CrsAssertion | null {
  const identifier = state.identifier.trim();
  const definitionJson = definitionFor(state, catalog);
  if (identifier.length === 0 || definitionJson === null) return null;
  return { identifier, definition_json: definitionJson };
}

/** The identifier text a catalog-entry pick suggests (`"EPSG:2056"`) -- the operator still
 * supplies/confirms it (NEXT-CUT.md P3 item B); picking an entry only pre-fills the field, it does
 * not lock it, and never overwrites text the operator already typed. */
export function suggestedIdentifierFor(entry: CrsCatalogEntry): string {
  return `${entry.authority}:${entry.code}`;
}
