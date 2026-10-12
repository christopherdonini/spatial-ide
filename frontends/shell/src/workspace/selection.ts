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

import type { AuthoritativeBbox } from "../canvas/viewportBbox";
import { SELECTION_MAX_FEATURES } from "./selectionConstants";

export type SelectionMode = "toggle" | "replace" | "add" | "remove";

/** The members of one selection: id -> the authoritative bbox the click kept. Never mutated in place. */
export type SelectionMembers = ReadonlyMap<bigint, AuthoritativeBbox>;

export const NO_MEMBERS: SelectionMembers = new Map<bigint, AuthoritativeBbox>();

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

function withMember(members: SelectionMembers, id: bigint, bounds: AuthoritativeBbox): SelectionOutcome {
  if (members.size + 1 > SELECTION_MAX_FEATURES) {
    return { kind: "refused", members, refusal: { code: "selection.ceiling", max: SELECTION_MAX_FEATURES, attempted: members.size + 1 } };
  }
  const next = new Map(members);
  next.set(id, bounds);
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
 * was. A present member keeps the bounds it was first selected with.
 */
export function applySelectionMode(
  members: SelectionMembers,
  mode: SelectionMode,
  id: bigint,
  bounds: AuthoritativeBbox
): SelectionOutcome {
  const present = members.has(id);
  switch (mode) {
    case "toggle":
      return present ? withoutMember(members, id) : withMember(members, id, bounds);
    case "replace":
      return present && members.size === 1
        ? { kind: "unchanged", members }
        : { kind: "changed", members: new Map([[id, bounds]]) };
    case "add":
      return present ? { kind: "unchanged", members } : withMember(members, id, bounds);
    case "remove":
      return present ? withoutMember(members, id) : { kind: "unchanged", members };
  }
}

/** Closed intersection: boxes that share only an edge meet. */
export function bboxesMeet(a: AuthoritativeBbox, b: AuthoritativeBbox): boolean {
  return a.xmin <= b.xmax && a.xmax >= b.xmin && a.ymin <= b.ymax && a.ymax >= b.ymin;
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
  for (const [id, bounds] of members) {
    if (!bboxesMeet(bounds, viewBox)) outsideView += 1;
    else if (!drawn.has(id)) inViewNotDrawn += 1;
  }
  return { selected: members.size, outsideView, inViewNotDrawn, reason: null };
}
