// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import type { IdentityDeclaration } from "../skp/types";

/**
 * `IdentityDeclarationForm`'s pure state and submission logic -- see `crsAssertionState.ts`'s own
 * top comment for why this lives outside the component.
 */

export type IdentityFormRoute = "none" | "candidate" | "freeText";

export interface IdentityFormState {
  route: IdentityFormRoute;
  selectedColumn: string | null;
  freeTextColumn: string;
}

/**
 * No column selected -- ADR-016 §3-§7 / this cut's own I2: candidates render unranked and
 * unpreselected, and that holds **even when there is exactly one candidate** (the component never
 * passes its candidate list into this function precisely so nothing here could special-case a
 * singleton list into an auto-pick).
 */
export function initialIdentityFormState(): IdentityFormState {
  return { route: "none", selectedColumn: null, freeTextColumn: "" };
}

/**
 * The exact `IdentityDeclaration` this form state would submit, or `null` if not yet submittable.
 * The free-text route is an equal route to picking a candidate (NEXT-CUT.md P3 item C) -- a name
 * that is not one of `candidate_columns` is accepted here and left for the engine to refuse
 * honestly on the next `open_dataset` call, not rejected client-side.
 */
export function buildIdentityDeclaration(state: IdentityFormState): IdentityDeclaration | null {
  if (state.route === "candidate" && state.selectedColumn !== null && state.selectedColumn.length > 0) {
    return { column: state.selectedColumn };
  }
  if (state.route === "freeText") {
    const column = state.freeTextColumn.trim();
    if (column.length > 0) return { column };
  }
  return null;
}
