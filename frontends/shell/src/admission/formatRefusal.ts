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
 * - `engine.source_changed` (Brief A boundary 4, P3): states what ended and what to do, and
 *   states the limit -- it never says the session up to that point was a snapshot.
 * - `engine.identity_ordinal_partitioned_unsupported` (boundary 7, P3): states that a partitioned
 *   source has no single-file row position, and names the two real routes forward.
 * - `publish.geographic_crs_not_publishable` (boundary 8, held at P2 and closed at P3).
 *
 * **These four strings are the ones the human sights at P6** (`ADMISSION-PREREGISTRATION.md`
 * §12d's "the four new user-visible states whose strings are sighted at P6"). They are written
 * here so the states exist and can be read; their wording is not settled.
 */
export function refusalGuidance(code: string): string | null {
  switch (code) {
    case "engine.source_changed":
      return (
        "The file on disk is no longer the one this session opened. Everything read so far has " +
        "been discarded, and the feature identities handed out during it no longer refer to " +
        "anything -- reopen the file to continue. What this check can and cannot do: it detects " +
        "that the file differs, it does not establish that everything read before now came from " +
        "one unchanging file, it cannot see every possible edit, and it may notice a change only " +
        "after a query has finished reading."
      );
    case "engine.identity_ordinal_partitioned_unsupported":
      return (
        "This source is spread across more than one file. Without an identity column carried in " +
        "the data, a feature's identity here would have to be its position -- and a position is " +
        "only meaningful within one file. Open a single file, or declare an identity column."
      );
    case "publish.geographic_crs_not_publishable":
      return (
        "This dataset's coordinates are in degrees, and the bundled viewer has no degrees path: " +
        "it renders in the dataset's own coordinate reference system, while the degrees view you " +
        "see here is a display convention applied at view time, which a published bundle does " +
        "not carry. Nothing has been written. Reproject the source to a projected CRS and open " +
        "that."
      );
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
