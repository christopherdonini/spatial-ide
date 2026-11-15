// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it } from "vitest";

import { FILTER_DIALECT_DUCKDB_EXPR_0 } from "../skp/types";
import type { Filter } from "../skp/types";
import type { SelectionMember, SelectionMembers } from "../workspace/selection";
import { sameFilter, secondScope, selectionLine, TABLE_SCOPES, thirdScope } from "./tableScope";
import { EMPTY_TABLE } from "./tableSource";
import type { TablePhase, TableSnapshot } from "./tableSource";

/** SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md section 4, PC-U2 and PC-U14: the table's other two scopes (section 2.4 (c)). */
const filterOf = (predicate: string): Filter => ({ predicate, dialect: FILTER_DIALECT_DUCKDB_EXPR_0 });
const F = filterOf("zone = 'a'");
const G = filterOf("zone = 'b'");
const unit = { xmin: 0, ymin: 0, xmax: 1, ymax: 1 };
const member = (filter: Filter | null): SelectionMember => ({ bounds: unit, row: null, filter });
const held = (...entries: Array<[bigint, Filter | null]>): SelectionMembers => new Map(entries.map(([id, filter]) => [id, member(filter)]));
/** A first-scope result for `filter` holding `ids`, ended in `phase`. */
const result = (phase: TablePhase, filter: Filter | null, ...ids: bigint[]): TableSnapshot => ({ ...EMPTY_TABLE, phase, filter, count: ids.length, ids: new Set(ids) });
const NONE: ReadonlySet<bigint> = new Set();

describe("PC-U2: the second scope lists a member that passes the view's filter, fails one a complete result lacks, and counts the rest", () => {
  it("the labels are plan section 3's, the first is the default", () => {
    expect(TABLE_SCOPES.map((scope) => scope.label)).toEqual(["Filtered", "Selected", "Selected, ignoring filter"]);
  });

  // RECORDED MUTATION for "PC-U2": make `sameFilter` answer true for any two filters (`return true;` as its first statement). Expected failure: the member captured under another filter is listed.
  it("PC-U2: a member passes if captured under the filter, if its id is in a resident batch streamed under it, or if it is in the first scope's result for it", () => {
    const members = held([1n, F], [2n, G], [3n, G], [4n, G], [5n, G]);
    const outcome = secondScope(members, F, result("completed", F, 3n), new Set([2n]));
    expect(outcome.listed).toEqual([1n, 2n, 3n]);
    expect(outcome).toMatchObject({ failed: 2, notEstablished: 0 }); // 4 and 5: the complete result for F lacks them
    expect(sameFilter(F, filterOf("zone = 'a'"))).toBe(true);
    expect(sameFilter(F, G)).toBe(false);
    expect(sameFilter(null, null)).toBe(true);
    expect(sameFilter(F, null)).toBe(false);
  });

  it("every other member is counted as not established: no result, a result for another filter, or a result that is not complete", () => {
    const members = held([1n, G], [2n, G]);
    expect(secondScope(members, F, EMPTY_TABLE, NONE)).toMatchObject({ listed: [], failed: 0, notEstablished: 2 });
    expect(secondScope(members, F, result("completed", G, 1n), NONE)).toMatchObject({ listed: [], failed: 0, notEstablished: 2 }); // says nothing about F
    expect(secondScope(members, F, result("cancelled", F, 1n), NONE)).toMatchObject({ listed: [1n], failed: 0, notEstablished: 1 });
    const atLimit = { ...result("completed", F, 1n), count: 1_000 };
    expect(secondScope(members, F, atLimit, NONE)).toMatchObject({ listed: [1n], failed: 0, notEstablished: 1 }); // more may pass
  });

  it("with no filter in force every member passes; the third scope lists every member whatever its filter", () => {
    const members = held([1n, G], [2n, F]);
    expect(secondScope(members, null, EMPTY_TABLE, NONE).listed).toEqual([1n, 2n]);
    expect(thirdScope(members)).toEqual([1n, 2n]);
    expect(selectionLine("selected-ignoring-filter", 2, secondScope(members, F, EMPTY_TABLE, NONE))).toBe("[P6 placeholder] Showing all 2 selected features, ignoring the filter.");
    expect(selectionLine("selected", 2, { listed: [1n], failed: 0, notEstablished: 1 })).toBe("[P6 placeholder] Showing 1 of 2 selected features that pass the filter; 1 could not be checked against it.");
  });
});

describe("PC-U14: a stopped first-scope result is not complete", () => {
  // RECORDED MUTATION for "PC-U14": in `resultIsComplete` (tableSource.ts) read a stopped result as complete (`snapshot.phase === "completed" || snapshot.phase === "stopped"`). Expected failure: the member the stop cut off is failed, not counted as not established.
  it("PC-U14: a member its ids lack is counted not established, never failed, and a member whose id it holds passes", () => {
    const members = held([1n, G], [2n, G]);
    expect(secondScope(members, F, result("stopped", F, 1n), NONE)).toEqual({ listed: [1n], failed: 0, notEstablished: 1 });
    expect(secondScope(members, F, result("completed", F, 1n), NONE)).toEqual({ listed: [1n], failed: 1, notEstablished: 0 }); // the same result, ended Completed below the limit
  });
});
