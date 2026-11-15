// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import type { Filter } from "../skp/types";
import type { SelectionMembers } from "../workspace/selection";
import { resultIsComplete } from "./tableSource";
import type { TableSnapshot } from "./tableSource";

/**
 * The table's other two scopes (SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md section 2.4 (c)), pure. The labels are plan section 3's, byte for byte; the first is the default.
 * The third scope lists every selected feature. The second lists a member that passes the view's filter, and counts the rest.
 */
export type TableScope = "filtered" | "selected" | "selected-ignoring-filter";

export const TABLE_SCOPES: readonly { readonly id: TableScope; readonly label: string }[] = [
  { id: "filtered", label: "Filtered" },
  { id: "selected", label: "Selected" },
  { id: "selected-ignoring-filter", label: "Selected, ignoring filter" },
];

/** Whether two filters are the same predicate in the same dialect (`null` is no filter). */
export function sameFilter(a: Filter | null, b: Filter | null): boolean {
  return a === b || (a !== null && b !== null && a.predicate === b.predicate && a.dialect === b.dialect);
}

export interface SecondScope {
  /** The members that pass the view's filter, in selection order. */
  readonly listed: readonly bigint[];
  /** The members the first scope's complete result for the view's filter lacks: they do not pass. */
  readonly failed: number;
  /** The members whose filter result no source establishes (P6): neither listed nor failed. */
  readonly notEstablished: number;
}

/**
 * A member passes the view's filter if one of these holds: it was captured under that filter; its id is in a resident batch streamed under it (`residentUnderView`);
 * its id is in the first scope's result for it. It fails if that result is complete and lacks it. Every other member is counted as not established.
 * With no filter in force every member passes. A first-scope result issued under another filter says nothing about this one, and a stopped, cancelled, refused or limit-sized result is not complete.
 */
export function secondScope(members: SelectionMembers, viewFilter: Filter | null, first: TableSnapshot, residentUnderView: ReadonlySet<bigint>): SecondScope {
  const firstForView = sameFilter(first.filter, viewFilter);
  const complete = firstForView && resultIsComplete(first);
  const listed: bigint[] = [];
  let failed = 0;
  let notEstablished = 0;
  for (const [id, member] of members) {
    if (viewFilter === null || sameFilter(member.filter, viewFilter) || residentUnderView.has(id) || (firstForView && first.ids.has(id))) listed.push(id);
    else if (complete) failed += 1;
    else notEstablished += 1;
  }
  return { listed, failed, notEstablished };
}

/** The third scope: every member, in selection order. */
export function thirdScope(members: SelectionMembers): readonly bigint[] {
  return [...members.keys()];
}

/** The line a selection scope ends with (a P6 placeholder), stating only what `secondScope` or `thirdScope` established. */
export function selectionLine(scope: "selected" | "selected-ignoring-filter", selected: number, second: SecondScope): string {
  if (scope === "selected-ignoring-filter") return `[P6 placeholder] Showing all ${selected} selected features, ignoring the filter.`;
  const rest = [second.failed > 0 ? `${second.failed} do not pass it` : null, second.notEstablished > 0 ? `${second.notEstablished} could not be checked against it` : null].filter((part) => part !== null);
  return `[P6 placeholder] Showing ${second.listed.length} of ${selected} selected features that pass the filter${rest.length > 0 ? `; ${rest.join("; ")}` : ""}.`;
}
