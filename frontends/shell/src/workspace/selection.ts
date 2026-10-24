// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md section 2.3 (seam 5), phase B: the selection contract. Pure: no
 * React, no SKP, no canvas value in here (the import rule of section 2.1(a)).
 *
 * **What a selection is.** The members of one view's selection are feature ids (ADR-016 section 7, `bigint`s, so a
 * multi-part feature is one id however many parts it has), each with the authoritative f64 bbox the click kept
 * (`canvas/clickPick.ts`'s `bounds`, ADR-010 rule 2: looked up, never unprojected). The form's `{resource,
 * generation, members}` is composed where it is read: the view carries the members, and the resource and
 * generation are the ones the view is bound to (`scope.ts`'s `resolveScope`). They cannot disagree, because the
 * workspace reducer ends a view's selection on the two events that change either (`workspaceState.ts`).
 *
 * **What survives what.** None of `filter.apply`, `style.set`, a pan, a zoom, a resize or a layout action touches
 * the members (`viewTransitions.ts` has no such case). A feature that is no longer drawn stays selected.
 *
 * **The counts** (`countSelection`) are pure arithmetic over the kept bounds, a view box and the drawn set. No scan,
 * no query, and no reason without its fact (plan section 6.3).
 */

import type { AttributeCell, AttributeRow } from "../attributes/values";
import type { AuthoritativeBbox } from "../canvas/viewportBbox";
import type { Filter } from "../skp/types";
import { CAPTURED_ROW_MAX_BYTES } from "../table/tableConstants";
import { SELECTION_MAX_FEATURES } from "./selectionConstants";

export type SelectionMode = "toggle" | "replace" | "add" | "remove";

/** What a member kept of its row (milestone 4 PR C, section 2.4 (c)): the click's row as `resolveClickPick` read it, or, for a row past `CAPTURED_ROW_MAX_BYTES`, its leading cells and the number cut. */
export type CapturedRow = AttributeRow | "not-held" | null | { readonly cut: AttributeRow; readonly omitted: number };

/** One member of a selection: the authoritative bbox the click kept, its row, and the filter of the stream its batch came from (`ResidentBatch.filter`). */
export interface SelectionMember {
  readonly bounds: AuthoritativeBbox;
  readonly row: CapturedRow;
  readonly filter: Filter | null;
}

/** What one click offers a selection: the member before its row is cut. */
export interface SelectionInput {
  readonly bounds: AuthoritativeBbox;
  readonly row: AttributeRow | "not-held" | null;
  readonly filter: Filter | null;
}

/** The members of one selection: id -> what the click kept. Never mutated in place. */
export type SelectionMembers = ReadonlyMap<bigint, SelectionMember>;

export const NO_MEMBERS: SelectionMembers = new Map<bigint, SelectionMember>();

/** The counted bytes of one cell: its name and, for text, its text, each at 3 per UTF-16 unit (an upper bound on UTF-8); an integer its decimal digits, a float 8, a boolean 1, a NULL 0. A declared count, not a measurement. */
function cellBytes(cell: AttributeCell): number {
  const v = cell.value;
  const own = v.kind === "text" ? v.text.length * 3 : v.kind === "integer" ? v.integer.toString().length : v.kind === "float32" || v.kind === "float64" ? 8 : v.kind === "boolean" ? 1 : 0;
  return cell.name.length * 3 + own;
}

/** The row a member keeps: as given while its cells' counted bytes stay within `CAPTURED_ROW_MAX_BYTES`; else its cells before the first that would pass it, with the number cut (pure; the cut is a marker, never a silent drop). */
function capturedRow(row: AttributeRow | "not-held" | null): CapturedRow {
  if (row === null || row === "not-held") return row;
  let total = 0;
  for (let i = 0; i < row.length; i++) {
    total += cellBytes(row[i]);
    if (total > CAPTURED_ROW_MAX_BYTES) return { cut: row.slice(0, i), omitted: row.length - i };
  }
  return row;
}

const memberOf = (input: SelectionInput): SelectionMember => ({ bounds: input.bounds, row: capturedRow(input.row), filter: input.filter });

/** The refusal an add past SELECTION_MAX_FEATURES gets. `code` is its name; the operator-facing words are the
 * Feature tab's (the owner states the consequence). */
export interface SelectionRefusal {
  readonly code: "selection.ceiling";
  readonly max: number;
  /** The size the set would have reached. */
  readonly attempted: number;
}

export type SelectionOutcome =
  | { readonly kind: "changed"; readonly members: SelectionMembers }
  | { readonly kind: "unchanged"; readonly members: SelectionMembers }
  | { readonly kind: "refused"; readonly members: SelectionMembers; readonly refusal: SelectionRefusal };

/** What ended a selection: the source changed under the open dataset, or the dataset was reopened or another opened. */
export type SelectionEndReason = "source-changed" | "reopened";

/** The notice a view's selection leaves behind. It stands until the next selection transition and has no timer
 * (ADR-018). `ended` is section 2.3's end-of-generation notice; `refused` is the ceiling's. */
export type SelectionNotice =
  | { readonly kind: "ended"; readonly reason: SelectionEndReason; readonly dropped: number }
  | { readonly kind: "refused"; readonly refusal: SelectionRefusal };

function withMember(members: SelectionMembers, id: bigint, input: SelectionInput): SelectionOutcome {
  if (members.size + 1 > SELECTION_MAX_FEATURES) {
    return { kind: "refused", members, refusal: { code: "selection.ceiling", max: SELECTION_MAX_FEATURES, attempted: members.size + 1 } };
  }
  const next = new Map(members);
  next.set(id, memberOf(input));
  return { kind: "changed", members: next };
}

function withoutMember(members: SelectionMembers, id: bigint): SelectionOutcome {
  const next = new Map(members);
  next.delete(id);
  return { kind: "changed", members: next };
}

/**
 * One click's change to a selection, by the mode (section 2.3): toggle adds an absent id and removes a present one;
 * replace makes the set this id alone; add only adds; remove only removes. Returns a new map and never writes to
 * `members`. A change that would take the set past SELECTION_MAX_FEATURES is refused and the set is returned as it
 * was. A present member keeps what it was first selected with: its bounds, its row and its filter.
 */
export function applySelectionMode(
  members: SelectionMembers,
  mode: SelectionMode,
  id: bigint,
  input: SelectionInput
): SelectionOutcome {
  const present = members.has(id);
  switch (mode) {
    case "toggle":
      return present ? withoutMember(members, id) : withMember(members, id, input);
    case "replace":
      return present && members.size === 1
        ? { kind: "unchanged", members }
        : { kind: "changed", members: new Map([[id, memberOf(input)]]) };
    case "add":
      return present ? { kind: "unchanged", members } : withMember(members, id, input);
    case "remove":
      return present ? withoutMember(members, id) : { kind: "unchanged", members };
  }
}

/** Closed intersection: boxes that share only an edge meet. */
export function bboxesMeet(a: AuthoritativeBbox, b: AuthoritativeBbox): boolean {
  return a.xmin <= b.xmax && a.xmax >= b.xmin && a.ymin <= b.ymax && a.ymax >= b.ymin;
}

/** The smallest box over every member's kept bounds (Zoom to selection's fit, section 2.5), or null for no members. */
export function unionOfBounds(members: SelectionMembers): AuthoritativeBbox | null {
  let union: AuthoritativeBbox | null = null;
  for (const { bounds: b } of members.values()) {
    union =
      union === null
        ? { ...b }
        : {
            xmin: Math.min(union.xmin, b.xmin),
            ymin: Math.min(union.ymin, b.ymin),
            xmax: Math.max(union.xmax, b.xmax),
            ymax: Math.max(union.ymax, b.ymax),
          };
  }
  return union;
}

/** The facts the filter reason would need (section 2.3: only when H5 holds, the view is reported complete and a
 * filter is applied). H5 is not established (Amendment 2 item 9), so no reason is ever produced in this milestone,
 * whatever these say; the caller states the facts it holds and the count stays honest if H5 is later established. */
export interface HiddenFacts {
  readonly filterApplied: boolean;
  readonly viewComplete: boolean;
}

export interface SelectionCounts {
  /** The member count: Selected, ignoring the filter (Amendment 1 A9). */
  readonly selected: number;
  /** Members whose kept bounds do not meet the view box; `null` when no current box is held (Amendment 2 item 2). */
  readonly outsideView: number | null;
  /** Members whose bounds meet the view box and whose id is not in the drawn set; `null` with no current box. */
  readonly inViewNotDrawn: number | null;
  /** Always `null` in this milestone: the filter reason needs H5, which is not established. */
  readonly reason: null;
}

/**
 * The counts of section 2.3, from the members, the box the canvas last reported for the current view (`null` when
 * none is current) and the ids of the selection the canvas has drawn. With no box there is no split and no reason: the
 * summary shows Selected only.
 */
export function countSelection(
  members: SelectionMembers,
  viewBox: AuthoritativeBbox | null,
  drawn: ReadonlySet<bigint>,
  _facts: HiddenFacts
): SelectionCounts {
  if (viewBox === null) return { selected: members.size, outsideView: null, inViewNotDrawn: null, reason: null };
  let outsideView = 0;
  let inViewNotDrawn = 0;
  for (const [id, { bounds }] of members) {
    if (!bboxesMeet(bounds, viewBox)) outsideView += 1;
    else if (!drawn.has(id)) inViewNotDrawn += 1;
  }
  return { selected: members.size, outsideView, inViewNotDrawn, reason: null };
}
