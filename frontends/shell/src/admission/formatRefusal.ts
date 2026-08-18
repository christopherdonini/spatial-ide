// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import type { SkpError } from "../skp/types";

export interface FormattedRefusal {
  code: string;
  message: string;
  fields: Array<[string, string]>;
  /** True when `AdmissionPanel` renders an operator remediation form for this code (a
   * caller-asserted CRS, or an identity-mapping declaration -- NEXT-CUT.md P3, `CrsAssertionForm`/
   * `IdentityDeclarationForm`). Field name is a holdover from cut-1, when this named a flow that
   * did not exist yet ("cut-2 work" in the UI copy) -- kept rather than renamed to limit this
   * piece's blast radius into `publish/formatPublishRefusal.ts`, which reuses this same type. */
  remediationIsCut2: boolean;
}

/** Engine refusal codes with an operator remediation form in this build (`AdmissionPanel`'s own
 * `formFamilyForCode`, which actually gates the form). Kept as an explicit, closed list rather
 * than a prefix check: a future `engine.*` code should not silently inherit this label.
 *
 * **`engine.crs_assertion_conflict` is deliberately absent** (NEXT-CUT.md P3 must-fix, I1):
 * ADR-015 §4 refuses an assertion over an already-declaring file *without comparing* the two
 * definitions, and offers no remediation control for it at all -- see `refusalGuidance` below for
 * this code's copy. */
const CUT2_REMEDIATION_CODES: ReadonlySet<string> = new Set([
  "engine.crs_undeclared",
  "engine.identity_unusable",
]);

/**
 * The refusal UX **is** `message` -- `EngineError`'s own `Display` text, carried verbatim from
 * `kernel/src/skp.rs::error_of` with no summarizing, truncating, or rewording. This function adds
 * structure for rendering; it does not touch the words.
 */
export function formatRefusal(error: SkpError): FormattedRefusal {
  return {
    code: error.code,
    message: error.message,
    fields: Object.entries(error.fields).sort(([a], [b]) => a.localeCompare(b)),
    remediationIsCut2: CUT2_REMEDIATION_CODES.has(error.code),
  };
}

/** The value of one named field on a refusal, or `undefined` if the code carries no such field
 * (`SkpError.fields` is a flat string map -- `kernel/src/skp.rs::error_of`, e.g.
 * `candidate_columns` on `engine.identity_unusable`). */
export function fieldValue(refusal: FormattedRefusal, key: string): string | undefined {
  return refusal.fields.find(([k]) => k === key)?.[1];
}

/**
 * Extra, code-specific product copy beyond `message` -- `null` for every code without any (the
 * large majority; `message` alone is the refusal UX for those, unchanged from before this cut).
 *
 * - `engine.crs_assertion_conflict` (I1): states plainly that the file already declares a CRS,
 *   the supplied assertion was not applied, and no comparison was made (ADR-015 §4) -- paired
 *   with `AdmissionPanel` rendering NO remediation control for this code, ever.
 * - `engine.axis_order_unestablished` / `engine.axis_order_unsupported` (ADR-015 §5): states that
 *   the definition does not establish an x-first axis order and the file was refused, not
 *   reinterpreted -- protective behavior, not an error in the operator's file.
 */
export function refusalGuidance(code: string): string | null {
  switch (code) {
    case "engine.crs_assertion_conflict":
      return (
        "This file already declares a coordinate reference system. The assertion you supplied " +
        "was not applied, and no comparison was made between the two definitions (ADR-015 §4). " +
        "There is no remediation control for this refusal -- a declared CRS is not overridden."
      );
    case "engine.axis_order_unestablished":
    case "engine.axis_order_unsupported":
      return (
        "The definition does not establish an x-first axis order. The file was refused, not " +
        "reinterpreted (ADR-015 §5) -- this is protective behavior, not an error in your file."
      );
    default:
      return null;
  }
}
