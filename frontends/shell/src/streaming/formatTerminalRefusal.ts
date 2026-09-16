// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import type { FormattedRefusal } from "../admission/formatRefusal";

/**
 * Splits a data-plane terminal's `detail` into its typed code and the text an operator reads.
 *
 * **Why this exists.** P3a made every engine terminal's `detail` `"<code>: <display>"`
 * (`kernel/src/skp.rs::terminal_detail_of`, applied at `kernel/src/lib.rs`'s
 * `EngineSource::next_into`), so that the shell can act on a code rather than on prose whose
 * wording is the human's at P6. The baseline owner interpolates the detail whole onto the streaming
 * banner (`App.tsx`'s `onFailureTerminal`), so without this the operator would read
 * `stream ProducerFailed: engine.source_changed: refused: …` — a machine code in front of a
 * sentence. That is the same operator-visible regression the publish seam had, on the other
 * surface, and the ruling's "no operator-visible regression on main" covers both.
 *
 * **Deliberately the same shape as `publish/formatPublishRefusal.ts`**, so the two refusal seams are
 * parsed one way and not two.
 *
 * **What P3a uses, and what it does not.** The caller reads `message` — the whole of this piece's
 * job is that no machine prefix reaches an operator's eye. `code` is returned because this is the
 * shell's shared `FormattedRefusal` shape and because a client that must *act* on a terminal needs
 * it; **acting on it is P3b's** (`state/NEXT-CUT.md`'s split row: residency cleared and picks
 * refused in both owners). Nothing here clears residency, refuses a pick, or renders a session
 * status.
 *
 * **Not every detail is prefixed.** The data plane's own terminals (`adapterWs.ts`, transport-level
 * failures) and any refusal that never passed through `terminal_detail_of` arrive unprefixed; those
 * keep the fixed label and are passed through whole, exactly as the publish parser does.
 */
export function formatTerminalRefusal(detail: string): FormattedRefusal {
  const separator = detail.indexOf(": ");
  if (separator > 0) {
    const head = detail.slice(0, separator);
    // A code, not merely a colon: `engine.` + a snake_case name and no whitespace, so a sentence
    // that happens to contain ": " is never mistaken for one. `terminal_detail_of` builds the
    // prefix from `error_of`'s table, whose every arm is `engine.<snake_case>`.
    if (/^engine\.[a-z0-9_]+$/.test(head)) {
      return { code: head, message: detail.slice(separator + 2), fields: [] };
    }
  }
  return { code: "stream-failed", message: detail, fields: [] };
}
