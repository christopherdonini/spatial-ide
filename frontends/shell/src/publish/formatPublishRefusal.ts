// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import type { FormattedRefusal } from "../admission/formatRefusal";

/**
 * Adapts a publish seam's refusal into the SAME `FormattedRefusal` shape `RefusalBlock` already
 * renders for a `SkpError` (`admission/formatRefusal.ts`), so a publish refusal reuses that
 * identical, class-name-pinned markup rather than a second, drifting refusal block (this file's
 * whole reason to exist -- `RefusalBlock.tsx`'s own top comment: "class names preserved
 * byte-exactly").
 *
 * **The shape this parses, and where it comes from.** `frontends/shell/src-tauri/src/publish.rs`
 * sends `PublishError::refusal_detail()` (`kernel/src/publish/error.rs`), which is
 * `"<code>: <Display text>"` -- e.g.
 *
 *     publish.geographic_crs_not_publishable: refused: OGC:CRS84 is a geographic CRS whose ...
 *
 * pinned on the Rust side by `kernel/tests/typed_terminal_codes.rs`'s
 * `a_publish_refusal_detail_begins_with_its_typed_code`, and pinned against that exact output here
 * by this file's own test. Before this parser existed the prefix went straight to the operator as
 * raw text AND the code was thrown away, so `refusalGuidance` could never fire for a publish code
 * -- the regression the P3 attempt-2 reviewer found (B-1).
 *
 * **Two things it must get right.** The `code` must be a real `publish.*` code when one is present,
 * because `RefusalBlock` dispatches `refusalGuidance(refusal.code)` on it; and the `message` must be
 * the display text WITHOUT the prefix, because that string is what the operator reads and a machine
 * code in front of a sentence is not something to show them.
 *
 * **Not every message crossing this seam is prefixed.** `PublishPanel` also builds refusals from
 * strings this kernel never produced -- an IPC rejection (`settlePrepareOutcome`), the
 * unknown-attempt sentence -- so a message with no `publish.*` prefix keeps the pre-existing
 * `"publish-refused"` label and is passed through untouched. That label is deliberately not a
 * `publish.`-namespaced code: it names "this had no typed code", which is a different fact from any
 * refusal the kernel names.
 */
export function formatPublishRefusal(message: string): FormattedRefusal {
  const separator = message.indexOf(": ");
  if (separator > 0) {
    const head = message.slice(0, separator);
    // A code, not merely a colon: `publish.` + at least one character, and no whitespace (a
    // sentence that happens to contain ": " must not be mistaken for a code). `refusal_detail`
    // builds the prefix from `PublishError::code()`, whose every arm is `publish.<snake_case>`.
    if (/^publish\.[a-z0-9_]+$/.test(head)) {
      return { code: head, message: message.slice(separator + 2), fields: [] };
    }
  }
  return { code: "publish-refused", message, fields: [] };
}
