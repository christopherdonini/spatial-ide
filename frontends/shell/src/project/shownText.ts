// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * B2 piece 1c, Amendment 54 item 5 (j): the shell's bound on text read from a project file, for what a reopen shows or logs of it. The kernel's
 * own bound is left as it is; this one is applied after it, in the shell, to the text of item 5 (j)'s list: each reopen refusal's message and
 * fields, `file_name`, `basis` and O-18's column. Its callers are the reopen's run and its places (`project/openProject.ts`).
 *
 * - **Replaced:** every control character (Unicode Cc, U+0000 to U+001F and U+007F to U+009F), every Bidi_Control format character (U+061C,
 *   U+200E, U+200F, U+202A to U+202E, U+2066 to U+2069), U+2028 and U+2029, each by U+FFFD.
 * - **Then cut:** a text over 1,024 UTF-16 code units keeps its first 1,024, one fewer when the last of them would split a surrogate pair, and
 *   takes the kernel's mark, a space and `[cut]`, so that what is shown or logged is at most 1,030 code units. **The figure 1,024 rests on
 *   nothing measured**: it is a bound on what a line shows, chosen so that a path of any length cannot fill the refusal block or a log line.
 *
 * The workspace's own text (the filter, the clauses, the style) is not passed through here: it applies whole, as saved (item 5 (k)).
 */

import type { FormattedRefusal } from "../admission/formatRefusal";

/** Cc and Bidi_Control: what W-TEXT names (Amendment 54 item 5 (k)). */
const HIDDEN = /[\u0000-\u001F\u007F-\u009F\u061C\u200E\u200F\u202A-\u202E\u2066-\u2069]/;
/** What the bound replaces: `HIDDEN`, and the line and paragraph separators. */
const REPLACED = /[\u0000-\u001F\u007F-\u009F\u061C\u200E\u200F\u202A-\u202E\u2066-\u2069\u2028\u2029]/g;
/** UTF-16 code units kept before the mark. Not measured (see the module doc). */
const SHOWN_UNITS = 1024;
/** The kernel's mark (`kernel/src/project/mod.rs`, the bound on an identifier), here after a cut of the shell's. */
const CUT_MARK = " [cut]";

/** `text` as it may be shown or logged: hidden characters replaced, then cut past 1,024 code units on a code-point boundary and marked. */
export function shownText(text: string): string {
  const replaced = text.replace(REPLACED, "\uFFFD");
  if (replaced.length <= SHOWN_UNITS) return replaced;
  const last = replaced.charCodeAt(SHOWN_UNITS - 1);
  const keep = last >= 0xd800 && last <= 0xdbff ? SHOWN_UNITS - 1 : SHOWN_UNITS;
  return replaced.slice(0, keep) + CUT_MARK;
}

/** Whether `text` holds a control or Bidi_Control character, for W-TEXT. The text itself is not changed. */
export function holdsHiddenText(text: string): boolean {
  return HIDDEN.test(text);
}

/** A refusal with its message and each field's value through `shownText`; the code and the field names are the kernel's own words. */
export function shownRefusal(refusal: FormattedRefusal): FormattedRefusal {
  return { code: refusal.code, message: shownText(refusal.message), fields: refusal.fields.map(([key, value]) => [key, shownText(value)]) };
}
