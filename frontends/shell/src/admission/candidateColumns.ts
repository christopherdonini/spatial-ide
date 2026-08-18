// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * Splits the `engine.identity_unusable` refusal's `candidate_columns` field back into a
 * schema-order list. `kernel/src/skp.rs::error_of` comma-joins `candidate_columns` onto the wire
 * (`SkpError.fields` has no list shape -- a flat `BTreeMap<String, String>`, SKP-V0.md §5); this
 * is the inverse. Never ranked, never re-sorted here -- the join preserved schema order, and this
 * function must not introduce an order the engine did not declare (ADR-016 §3-§7).
 *
 * An absent or empty field means "the file carries no 64-bit integer column at all" -- that must
 * come back as an empty list, never a one-element list containing `""`.
 */
export function splitCandidateColumns(value: string | undefined): string[] {
  if (value === undefined || value.length === 0) return [];
  return value.split(",");
}
