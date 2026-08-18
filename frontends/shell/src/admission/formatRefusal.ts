// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import type { SkpError } from "../skp/types";

export interface FormattedRefusal {
  code: string;
  message: string;
  fields: Array<[string, string]>;
}

/**
 * The refusal UX **is** `message` -- `EngineError`'s own `Display` text, carried verbatim from
 * `kernel/src/skp.rs::error_of` with no summarizing, truncating, or rewording. This function adds
 * structure for rendering; it does not touch the words.
 *
 * NOTE (reviewer gate, admission-remediation cut): a `remediationIsCut2` boolean field used to
 * live here (cut-1 holdover naming a flow that did not exist yet). It was already unread by every
 * renderer -- `RefusalBlock.tsx`'s own top comment records that the remediation forms are gated by
 * `AdmissionPanel`'s `formFamilyForCode`/`nextFormFamily` instead, not by this field, and
 * `refusalGuidance` below is what replaced the blanket note the field used to gate. Deleted rather
 * than kept "derived" from `formFamilyForCode`: a single boolean cannot express WHICH form family
 * a code opens (`"crs"` vs `"identity"`), so making it track `formFamilyForCode` would have meant
 * keeping a second, narrower copy of the same closed code list next to it -- the exact drift risk
 * this cleanup exists to remove, not relocate.
 */
export function formatRefusal(error: SkpError): FormattedRefusal {
  return {
    code: error.code,
    message: error.message,
    fields: Object.entries(error.fields).sort(([a], [b]) => a.localeCompare(b)),
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
