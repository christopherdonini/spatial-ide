// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * NEXT-CUT.md P1: the console's only formatter, and the display-truth half of I3 ("the console
 * owns no command shapes"). This module renders exactly what `console/recorder.ts` captured by
 * reference (I2) -- the request object itself -- and adds nothing: no pretty labels, no relabeled
 * fields, no wire-version literal baked in here. Whatever value the `skp` field carries in a
 * rendered command is whatever the captured request object already carries; this file must never
 * spell out that value itself (`renderTruth.test.ts`'s source-scan assertion enforces the absence
 * of that literal in this file's own text, comments included).
 *
 * The control plane IS JSON over `invoke` (`protocol/skp/SKP-V0.md`), so `JSON.stringify` is not
 * an approximation of the wire format -- it is the wire format. Serializing the captured
 * reference is the entire job. `console/renderTruth.test.ts` proves the round trip -- parse back
 * to the fixture, exact keys, no scalar reshaped -- against every request fixture under
 * `protocol/skp/tests/data/`.
 */

import { MAX_ENTRY_RENDER_BYTES } from "./recorder";

/** One entry's render result. `copyText: null` on the truncated branch makes a silently-short
 * copy structurally impossible (I7): there is no string to hand a clipboard, only a preview and
 * the reason the full text was withheld. */
export type RenderedEntry =
  | { copyText: string; truncated: false }
  | { copyText: null; truncated: true; reason: string; preview: string };

/** Characters of an over-ceiling serialization still shown, un-copyable, so a user can identify
 * which action produced the entry even though its full text is withheld. */
const PREVIEW_CHARS = 2_000;

/** UTF-8 byte length -- the ceiling is a wire-size ceiling, not a UTF-16 string-length ceiling. */
function utf8ByteLength(text: string): number {
  return new TextEncoder().encode(text).length;
}

/**
 * Serializes `request` -- the exact object `console/recorder.ts` captured by reference -- with no
 * transformation beyond `JSON.stringify(request, null, 2)`. Nothing is reordered, relabeled, or
 * prettified (I5): `HexF64`/`DecU64` fields are already wire-format strings on the object (see
 * `skp/codec.ts`), so they pass through exactly as captured -- 16 hex digits, a quoted decimal --
 * because this function performs no scalar-aware logic at all, only generic serialization.
 */
export function renderSkpRequest(request: unknown): RenderedEntry {
  const text = JSON.stringify(request, null, 2);
  const totalBytes = utf8ByteLength(text);

  if (totalBytes <= MAX_ENTRY_RENDER_BYTES) {
    return { copyText: text, truncated: false };
  }

  const previewText = text.slice(0, PREVIEW_CHARS);
  const previewBytes = utf8ByteLength(previewText);

  return {
    copyText: null,
    truncated: true,
    reason:
      `serialized request exceeds MAX_ENTRY_RENDER_BYTES (${MAX_ENTRY_RENDER_BYTES} bytes): ` +
      `actual size ${totalBytes} bytes`,
    preview: `${previewText}… [truncated: ${previewBytes} of ${totalBytes} bytes shown]`,
  };
}
