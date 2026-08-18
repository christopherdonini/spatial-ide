// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import type { FormattedRefusal } from "../admission/formatRefusal";

/**
 * Adapts a publish seam's plain-text refusal (`{message: string}` -- `PrepareOutcome`/
 * `ExecuteOutcome`'s own `Refused` variant, `publish.rs`) into the SAME `FormattedRefusal` shape
 * `RefusalBlock` already renders for a `SkpError` (`admission/formatRefusal.ts`), so a publish
 * refusal reuses that identical, class-name-pinned markup rather than a second, drifting refusal
 * block (this file's whole reason to exist -- `RefusalBlock.tsx`'s own top comment: "class names
 * preserved byte-exactly").
 *
 * The publish seam's refusal is `Display` text only (`publish.rs`'s own doc comment on
 * `PrepareOutcome::Refused`: "Structure (RefusalBlock) is P2's" -- this IS that structure, added
 * here) -- there is no `code`/`fields` on the wire the way an `SkpError` carries them, so `code` is
 * a fixed label (never confused with a real `skp.*`/`engine.*` typed code) and `fields`/
 * `remediationIsCut2` are always empty/false: publish refusals have no cut-2 remediation flow named
 * anywhere in `NEXT-CUT.md`.
 */
export function formatPublishRefusal(message: string): FormattedRefusal {
  return {
    code: "publish-refused",
    message,
    fields: [],
    remediationIsCut2: false,
  };
}
