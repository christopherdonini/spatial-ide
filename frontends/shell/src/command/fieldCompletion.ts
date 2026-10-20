// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { FIELD_COMPLETION_MAX_OPTIONS } from "./commandConstants";

/**
 * Field completion inside `/filter` (SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md section 2.4, OPEN-4 (a), PR B). Pure. The only thing the shell reads inside a typed condition
 * is the `@` trigger: an `@` at the condition's start, or after whitespace or `(`, followed by name characters up to the caret. The candidates are the names of
 * `describe.schema` except the geometry column, in schema order, each shown with its `arrow_type` verbatim and nothing else: no count, no value list, no range.
 * The shell does not narrow the list by type; that is the kernel's policy (SKP-V0 section 7.3), and a name the kernel does not admit is refused by name when the
 * condition is applied. A completion always double-quotes the name, with each `"` in it doubled.
 */

/** The slice of a `describe.schema` entry the options read. */
export interface SchemaField {
  readonly name: string;
  readonly arrow_type: string;
}

/** The slice of `describe` field completion reads: the schema, and the name of the geometry column that is left out. */
export interface FieldSource {
  readonly schema: readonly SchemaField[];
  readonly geometryColumn: string;
}

export interface FieldOption {
  readonly name: string;
  readonly arrowType: string;
}

/** An `@` trigger in a draft: the indexes of the `@` and of the caret in the whole draft, and the letters between them. */
export interface FieldTrigger {
  readonly start: number;
  readonly end: number;
  readonly partial: string;
}

/** The `@` trigger at `caret` in `text`, whose condition begins at `conditionStart`, or `null`. Name characters are letters, digits and the underscore. */
export function fieldTrigger(text: string, conditionStart: number, caret: number): FieldTrigger | null {
  const end = Math.max(conditionStart, Math.min(caret, text.length));
  const found = /(^|[\s(])@([\p{L}\p{N}_]*)$/u.exec(text.slice(conditionStart, end));
  return found === null ? null : { start: conditionStart + found.index + found[1].length, end, partial: found[2] };
}

/** The options for the text after the `@`: names that contain it, case-insensitively, at most `FIELD_COMPLETION_MAX_OPTIONS`; `more` says that more matched than are listed. */
export function fieldOptions(source: FieldSource, partial: string): { readonly options: readonly FieldOption[]; readonly more: boolean } {
  const wanted = partial.toLowerCase();
  const matching = source.schema.filter((field) => field.name !== source.geometryColumn && field.name.toLowerCase().includes(wanted));
  return { options: matching.slice(0, FIELD_COMPLETION_MAX_OPTIONS).map((field) => ({ name: field.name, arrowType: field.arrow_type })), more: matching.length > FIELD_COMPLETION_MAX_OPTIONS };
}

/** A name as a condition writes it: double-quoted, each `"` doubled. */
export const quoteName = (name: string): string => `"${name.replace(/"/g, '""')}"`;

/** `text` with the `@` and the letters after it replaced by the quoted `name`. */
export const completeField = (text: string, trigger: FieldTrigger, name: string): string => text.slice(0, trigger.start) + quoteName(name) + text.slice(trigger.end);
