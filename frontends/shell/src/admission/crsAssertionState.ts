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

/**
 * SF4 (reviewer gate, admission-remediation cut): mirrors `engine::crs::MAX_CRS_DEFINITION_BYTES`
 * (`engine/src/crs.rs`) client-side, in bytes. Refusing only host-side still pays the cost the
 * reviewer named: a multi-MB paste's `invoke` serialization runs on the webview UI thread before
 * the host ever sees it, so this bound is checked here too, before any request is sent -- see
 * `buildCrsAssertion`/`definitionValidationMessage` below.
 */
export const MAX_CRS_DEFINITION_BYTES = 65_536;

/** UTF-8 byte length -- `.length` on a JS string counts UTF-16 code units, not bytes, and the
 * Rust-side bound is a byte count (`String::len()`), so this is the only correct comparison. */
function utf8ByteLength(text: string): number {
  return new TextEncoder().encode(text).length;
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
    // SF5 (reviewer gate, admission-remediation cut): `.trim()` is used ONLY to test for
    // emptiness -- the raw text is what becomes `definition_json`. Trimming it before sending
    // meant pasting the catalog's own bytes (which end in a trailing newline) hashed differently
    // host-side than the catalog entry itself, so a verbatim catalog paste read back as `pasted`
    // provenance instead of `catalog:…`.
    return state.pastedDefinition.trim().length > 0 ? state.pastedDefinition : null;
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
  // SF4: refused here, client-side, before `onSubmit` (and so `invoke`) is ever reached -- the
  // same bound `engine::crs::MAX_CRS_DEFINITION_BYTES` enforces host-side, checked a second time
  // and earlier, so the multi-MB serialization the reviewer named never runs at all.
  if (utf8ByteLength(definitionJson) > MAX_CRS_DEFINITION_BYTES) return null;
  return { identifier, definition_json: definitionJson };
}

/**
 * The inline validation message for the current form state, or `null` when there is nothing to
 * say (SF4). Kept separate from `buildCrsAssertion`'s `null` (which only ever means "not yet
 * submittable" -- a form that has not been filled in is not an error) so a consumer can
 * distinguish "nothing typed yet" from "what you typed is refused, and here is why", without
 * re-deriving the byte-length check itself.
 */
export function definitionValidationMessage(
  state: CrsAssertionFormState,
  catalog: readonly CrsCatalogEntry[]
): string | null {
  const definitionJson = definitionFor(state, catalog);
  if (definitionJson === null) return null;
  const bytes = utf8ByteLength(definitionJson);
  if (bytes <= MAX_CRS_DEFINITION_BYTES) return null;
  return (
    `This definition is ${bytes} bytes, over the ${MAX_CRS_DEFINITION_BYTES}-byte limit. ` +
    "PROJJSON definitions are single-digit KB; paste the pinned catalog entry or a definition " +
    "of comparable size."
  );
}

/** The identifier text a catalog-entry pick suggests (`"EPSG:2056"`) -- the operator still
 * supplies/confirms it (NEXT-CUT.md P3 item B); picking an entry only pre-fills the field, it does
 * not lock it, and never overwrites text the operator already typed. */
export function suggestedIdentifierFor(entry: CrsCatalogEntry): string {
  return `${entry.authority}:${entry.code}`;
}
