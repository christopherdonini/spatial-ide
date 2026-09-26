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
 * - `engine.source_changed` (Brief A boundary 4): states what happened and what to do, and nothing
 *   that is not true at this commit -- see its own case below for the human's round-5 ruling.
 * - `engine.identity_ordinal_partitioned_unsupported` (boundary 7, P3): states that a partitioned
 *   source has no single-file row position, and names the two real routes forward.
 * - `publish.geographic_crs_not_publishable` (boundary 8, held at P2 and closed at P3).
 * - `engine.internal_inconsistency` (the retyped provenance arm): a defect in this program, not in
 *   the operator's file, and the guidance says so rather than sending them to look at their data.
 *
 * **All four of the strings added here are the human's at P6** (`ADMISSION-PREREGISTRATION.md`
 * §12d's "the four new user-visible states whose strings are sighted at P6"). Three are
 * placeholders written so the states exist and can be read end to end; **their wording is not
 * settled** and no test asserts them verbatim.
 *
 * **`engine.source_changed` is the exception, and is asserted verbatim by its test.** The human
 * ruled its exact sentence on 2026-09-16 (round 5, item 1) because the placeholder described
 * behaviour P3a does not have. P6 still sights it; until then a rewording is a decision rather
 * than a refactor, and the test is what makes that so.
 */
export function refusalGuidance(code: string): string | null {
  switch (code) {
    case "engine.source_coverage_lost":
      // Per `engine/SOURCE-WATCHER-PREREGISTRATION.md` §1, user-visible wording is the human's at
      // P6 (addition 2), and every new string is a marked placeholder (§7). This is one of those --
      // written so the state exists and can be read end to end; its wording is not settled and no
      // test asserts it verbatim (the `engine.source_changed` precedent immediately below is the
      // one exception, for the round-5 reason its own comment states).
      return (
        "[P6 placeholder] The advisory watch on this source lost coverage of it while it was open " +
        "-- this is not a statement that the file changed, only that this session can no longer " +
        "tell. Reopen the dataset to continue."
      );
    case "engine.source_changed":
      // **The human's ruling of 2026-09-16 (round 5, item 1), verbatim**: "a false status string
      // does not sit on main between P3a and P3b. Replace P3a's 'Everything read so far has been
      // discarded' now, in one docs-class commit, with a sentence true at that commit -- 'The
      // source file changed while it was open; reopen the dataset to continue.' -- and P3b restores
      // the stronger sentence when it becomes true, wording at P6."
      //
      // **This is P3b's half of that ruling: the stronger sentence, now that it is true.** What it
      // claims, and the only thing it claims, is §2e's declared scope -- on a detected change this
      // client clears the resident geometry it holds for that dataset and refuses picks until the
      // dataset is reopened. Both are performed by the code that lands with this string:
      // `ViewportStreamManager`'s source-changed branch clears through `onSuperseded`→`clearStream`,
      // `candidateArmSession`'s `endCandidateSession` clears through `clearAllTiles`, and
      // `App.tsx`'s one `latchedHoverReadout` site refuses every pick until the dataset is reopened.
      //
      // **It states the OWNER's consequence and no engine fact** (the human, 2026-09-16, round 7).
      // What differed, and what the check does not establish, are the engine's own words and arrive
      // in `message` beside this; repeating or qualifying them here would be the shell speaking for
      // the engine. In particular it makes **no snapshot claim** about what came before the
      // detection (A1) -- it says what was cleared, not that what was cleared was consistent.
      //
      // **Wording sighted by the human at P6** (`ADMISSION-PREREGISTRATION.md` §12e Amendment 5 (i),
      // which put this sentence on the sight list precisely because P3b replaces it). Asserted
      // verbatim by `formatRefusal.test.ts` for the round-5 reason: a rewording is a decision, not a
      // refactor, and must break a test.
      return (
        "The source file changed while it was open. What this canvas had read from it has been " +
        "cleared, and features here can no longer be identified; reopen the dataset to continue."
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
    case "engine.internal_inconsistency":
      return (
        "This is a defect in this program, not in your file: two facts it recorded about the same " +
        "dataset contradict each other, and it stopped rather than pick one. Nothing was changed. " +
        "Reporting it with the detail below is the most useful thing you can do with it."
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
