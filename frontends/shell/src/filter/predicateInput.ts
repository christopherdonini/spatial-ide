// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { FILTER_DIALECT_DUCKDB_EXPR_0 } from "../skp/types";
import type { Filter } from "../skp/types";

/**
 * `FilterPanel`'s own pure seam (NEXT-CUT.md filter-panel cut, P3 item 1, binding note 1): the ONE
 * admitted mapping from the raw text a caller typed into `input.filter-predicate` to what rides the
 * wire. **Empty input -> `filter: null`** -- the only client-side interpretation this cut permits.
 * Anything else -- including whitespace-only text -- goes on the wire VERBATIM: no `trim()`, no
 * case-folding, no client-side ceiling, no validation of any kind. The kernel is the only admission
 * authority (`engine/src/predicate.rs`'s own `admit`); this function does not, and must never, do any
 * part of that job.
 */
export function predicateTextToFilter(text: string): Filter | null {
  if (text.length === 0) {
    return null;
  }
  return { predicate: text, dialect: FILTER_DIALECT_DUCKDB_EXPR_0 };
}
