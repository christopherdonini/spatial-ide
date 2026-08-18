// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import type { SkpError } from "../skp/types";

export interface FormattedRefusal {
  code: string;
  message: string;
  fields: Array<[string, string]>;
  /** True when the remedy is an ADR-002/ADR-016 flow this cut names but does not build (a
   * caller-asserted CRS, or an identity-mapping declaration) -- NEXT-CUT.md requires remediation
   * flows to be named as cut-2 work in the UI copy, not silently absent. */
  remediationIsCut2: boolean;
}

/** Engine refusal codes whose remedy is a cut-2 remediation flow. Kept as an explicit, closed list
 * rather than a prefix check: a future `engine.*` code should not silently inherit this label. */
const CUT2_REMEDIATION_CODES: ReadonlySet<string> = new Set([
  "engine.crs_undeclared",
  "engine.crs_assertion_conflict",
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
