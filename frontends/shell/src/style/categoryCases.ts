// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import type { Filter } from "../skp/types";
import { sameFilter } from "../table/tableScope";
import type { TableSnapshot, TableSource } from "../table/tableSource";
import { CATEGORY_MAX_CASES, CATEGORY_PALETTE } from "./styleConstants";

/**
 * The Colour by apply's cases (SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md section 2.3 (d); OPEN-16 (b)): the distinct non-null text values
 * of one column among the first scope's rows, in code-point order. The source is the table's one stream, never the canvas's resident batches.
 */

/** The members of `TableSource` the wait uses, so a test hands over the real class. */
export type FirstScopeSource = Pick<TableSource, "getSnapshot" | "subscribe" | "start" | "cancel">;

export type FirstScopeOutcome =
  | { readonly kind: "rows"; readonly snapshot: TableSnapshot }
  | { readonly kind: "not-applied"; readonly reason: "cancelled" | "refused" | "ended" | "abandoned" };

export interface FirstScopeWait {
  readonly result: Promise<FirstScopeOutcome>;
  /** Cancel: ends the stream when this wait issued it, and only then (OPEN-C (b)); on a stream it joined, only the wait is abandoned. */
  readonly abandon: () => void;
}

/**
 * The first scope for `filter`, waited for (Amendment 12 item 4). A completed or stopped result under the same filter is reused; a loading
 * stream under the same filter is joined; in any other state `start(filter)` is called once. It resolves with the snapshot at a terminal phase,
 * or as not applied when that phase is cancelled, refused or ended. It reads the source through its public members alone.
 */
export function waitForFirstScope(source: FirstScopeSource, filter: Filter | null): FirstScopeWait {
  let settle: (outcome: FirstScopeOutcome) => void = () => {};
  const result = new Promise<FirstScopeOutcome>((resolve) => {
    settle = resolve;
  });
  let unsubscribe: () => void = () => {};
  const finish = (outcome: FirstScopeOutcome): void => {
    unsubscribe();
    settle(outcome);
  };
  const check = (): boolean => {
    const snapshot = source.getSnapshot();
    switch (snapshot.phase) {
      case "completed":
      case "stopped":
        finish({ kind: "rows", snapshot });
        return true;
      case "cancelled":
      case "refused":
      case "ended":
        finish({ kind: "not-applied", reason: snapshot.phase });
        return true;
      default:
        return false;
    }
  };
  const before = source.getSnapshot();
  const reusable = sameFilter(before.filter, filter) && (before.phase === "completed" || before.phase === "stopped");
  const joinable = sameFilter(before.filter, filter) && before.phase === "loading";
  const issuedHere = !reusable && !joinable;
  if (issuedHere) void source.start(filter);
  if (!check()) unsubscribe = source.subscribe(check);
  return {
    result,
    abandon: () => {
      finish({ kind: "not-applied", reason: "abandoned" }); // first, so that the cancel below is not read as the source's own
      if (issuedHere) source.cancel();
    },
  };
}

/** Code-point order: the comparison of two texts by their code points, which is not UTF-16 order and not a locale's. */
function compareCodePoints(a: string, b: string): number {
  const left = Array.from(a);
  const right = Array.from(b);
  for (let i = 0; i < Math.min(left.length, right.length); i++) {
    const difference = left[i].codePointAt(0)! - right[i].codePointAt(0)!;
    if (difference !== 0) return difference;
  }
  return left.length - right.length;
}

export interface CategoryCases {
  /** The cases written: the first `CATEGORY_MAX_CASES` distinct values in code-point order, each with its palette colour. */
  readonly cases: { readonly when: string; readonly then: string }[];
  /** How many distinct non-null values the rows held, including those past the cap. */
  readonly found: number;
  /** How many of those draw as Other, which is `found` less the cases. */
  readonly other: number;
}

/** The cases for `column` over the rows of `snapshot`. A row the source holds as null, and a NULL value, are skipped. */
export function buildCategoryCases(snapshot: TableSnapshot, column: string): CategoryCases {
  const values = new Set<string>();
  for (let index = 0; index < snapshot.count; index++) {
    const row = snapshot.rowAt(index).row;
    const cell = row?.find((c) => c.name === column);
    if (cell !== undefined && cell.value.kind === "text") values.add(cell.value.text);
  }
  const sorted = [...values].sort(compareCodePoints);
  const cases = sorted.slice(0, CATEGORY_MAX_CASES).map((when, i) => ({ when, then: CATEGORY_PALETTE[i] }));
  return { cases, found: sorted.length, other: sorted.length - cases.length };
}
