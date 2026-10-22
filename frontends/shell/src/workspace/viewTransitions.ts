// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md section 2.4 (seam 3): the typed, pure transitions of a view. A
 * transition is an `{action, params}` object, the shape of ADR-036 section 6's `intent` member (Accepted
 * 2026-10-22), applied by the pure `applyViewTransition`. The union is closed and is exactly the section's names:
 * `filter.apply` and `style.set` (phase A), then `tool.set`, `mode.set`, `selection.apply`, `selection.clear`,
 * `selection.end`, `inspect.set` and `inspect.pin`, and, from milestone 3 (SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md section 2.5),
 * `filter.clauses.set`. Keystrokes, hover, navigation and layout are not transitions.
 * There is no log and no undo (ADR-006; plan section 6.5): nothing here records a transition.
 *
 * A view's phase B members are optional (see `ViewState`); the readers below give their section 7 defaults.
 */

import type { AuthoritativeBbox } from "../canvas/viewportBbox";
import type { Filter } from "../skp/types";
import type { StyleState } from "../style/document";
import { clauseNumber, combineClauses, NO_CLAUSES } from "./filterClauses";
import type { ClauseStep, FilterClause } from "./filterClauses";
import { applySelectionMode, NO_MEMBERS } from "./selection";
import type { SelectionEndReason, SelectionMembers, SelectionMode, SelectionNotice } from "./selection";
import { DEFAULT_SELECTION_MODE, DEFAULT_TOOL } from "./selectionConstants";
import type { InspectedFeature, InspectedPick, Tool, ViewState } from "./workspaceState";

export type FilterApplyTransition = { action: "filter.apply"; params: { filter: Filter | null } };

/** The cards after one change. `step` names the clause that changed by its id; the view's `filter` is derived from `clauses`, never carried. */
export type FilterClausesSetTransition = { action: "filter.clauses.set"; params: { clauses: readonly FilterClause[]; step: ClauseStep } };

/** One transition per changed `StyleState` property. The style document carries `outline_width` as a bare number
 * (ADR-017 section 5a) and the shell draws it in pixels (`canvas/buildLayers.ts`), so the width is carried as
 * `{value, unit}`. */
export type StyleSetTransition =
  | { action: "style.set"; params: { property: "fillColor"; value: string } }
  | { action: "style.set"; params: { property: "fillOpacity"; value: number } }
  | { action: "style.set"; params: { property: "outlineColor"; value: string } }
  | { action: "style.set"; params: { property: "outlineWidth"; value: { value: number; unit: "px" } } };

export type ToolSetTransition = { action: "tool.set"; params: { tool: Tool } };
export type ModeSetTransition = { action: "mode.set"; params: { mode: SelectionMode } };
export type SelectionApplyTransition = {
  action: "selection.apply";
  params: { mode: SelectionMode; id: bigint; bounds: AuthoritativeBbox };
};
export type SelectionClearTransition = { action: "selection.clear"; params: Record<string, never> };
export type SelectionEndTransition = {
  action: "selection.end";
  params: { reason: SelectionEndReason; dropped: number };
};
export type InspectSetTransition = {
  action: "inspect.set";
  params: { pick: InspectedPick; bounds: AuthoritativeBbox } | null;
};
/** Pinning needs something inspected: with nothing inspected, `pinned: true` leaves the view unpinned. */
export type InspectPinTransition = { action: "inspect.pin"; params: { pinned: boolean } };

export type ViewTransition =
  | FilterApplyTransition
  | FilterClausesSetTransition
  | StyleSetTransition
  | ToolSetTransition
  | ModeSetTransition
  | SelectionApplyTransition
  | SelectionClearTransition
  | SelectionEndTransition
  | InspectSetTransition
  | InspectPinTransition;

/** The readers of a view's phase B members: an absent member has its section 7 default. */
export const viewTool = (view: ViewState): Tool => view.tool ?? DEFAULT_TOOL;
export const viewSelectionMode = (view: ViewState): SelectionMode => view.selectionMode ?? DEFAULT_SELECTION_MODE;
export const viewSelection = (view: ViewState): SelectionMembers => view.selection ?? NO_MEMBERS;
export const viewSelectionNotice = (view: ViewState): SelectionNotice | null => view.selectionNotice ?? null;
export const viewInspected = (view: ViewState): InspectedFeature | null => view.inspected ?? null;
export const viewPinned = (view: ViewState): boolean => view.pinned ?? false;
/** The cards of a view (milestone 3 section 2.5): an absent member is none. */
export const viewClauses = (view: ViewState): readonly FilterClause[] => view.clauses ?? NO_CLAUSES;
/** The number the next `clause-<n>` of this view takes. */
export const viewNextClauseNumber = (view: ViewState): number => view.clauseCounter ?? 1;

function applyStyleSet(style: StyleState, transition: StyleSetTransition): StyleState {
  const params = transition.params;
  switch (params.property) {
    case "fillColor":
      return { ...style, fillColor: params.value };
    case "fillOpacity":
      return { ...style, fillOpacity: params.value };
    case "outlineColor":
      return { ...style, outlineColor: params.value };
    case "outlineWidth":
      return { ...style, outlineWidth: params.value.value };
  }
}

function applySelection(view: ViewState, params: SelectionApplyTransition["params"]): ViewState {
  const members = viewSelection(view);
  const outcome = applySelectionMode(members, params.mode, params.id, params.bounds);
  if (outcome.kind === "refused") return { ...view, selectionNotice: { kind: "refused", refusal: outcome.refusal } };
  if (outcome.members === members && view.selectionNotice === undefined) return view;
  return { ...view, selection: outcome.members, selectionNotice: undefined };
}

/** Pure: returns a new view and never writes to its input (a frozen view is fine). A transition that changes nothing
 * returns the view it was given. */
export function applyViewTransition(view: ViewState, transition: ViewTransition): ViewState {
  switch (transition.action) {
    case "filter.apply": {
      // An Apply replaces every card with one that holds its predicate, or with none (OPEN-2 (A)).
      const filter = transition.params.filter;
      if (filter === null) return { ...view, filter: null, clauses: NO_CLAUSES };
      const number = viewNextClauseNumber(view);
      return { ...view, filter, clauses: [{ id: `clause-${number}`, text: filter.predicate, enabled: true }], clauseCounter: number + 1 };
    }
    case "filter.clauses.set": {
      const { clauses } = transition.params;
      const counter = Math.max(viewNextClauseNumber(view), ...clauses.map((clause) => clauseNumber(clause.id) + 1));
      return { ...view, filter: combineClauses(clauses), clauses, clauseCounter: counter };
    }
    case "style.set":
      return { ...view, style: applyStyleSet(view.style, transition) };
    case "tool.set":
      return viewTool(view) === transition.params.tool ? view : { ...view, tool: transition.params.tool };
    case "mode.set":
      return viewSelectionMode(view) === transition.params.mode
        ? view
        : { ...view, selectionMode: transition.params.mode };
    case "selection.apply":
      return applySelection(view, transition.params);
    case "selection.clear":
      return viewSelection(view).size === 0 && view.selectionNotice === undefined
        ? view
        : { ...view, selection: NO_MEMBERS, selectionNotice: undefined };
    case "selection.end": {
      const { reason, dropped } = transition.params;
      const notice: SelectionNotice | undefined = dropped > 0 ? { kind: "ended", reason, dropped } : undefined;
      return viewSelection(view).size === 0 && view.selectionNotice === undefined && notice === undefined
        ? view
        : { ...view, selection: NO_MEMBERS, selectionNotice: notice };
    }
    case "inspect.set": {
      const params = transition.params;
      if (params === null) {
        return viewInspected(view) === null && !viewPinned(view) ? view : { ...view, inspected: null, pinned: false };
      }
      return { ...view, inspected: { pick: params.pick, bounds: params.bounds } };
    }
    case "inspect.pin": {
      const pinned = transition.params.pinned && viewInspected(view) !== null;
      return viewPinned(view) === pinned ? view : { ...view, pinned };
    }
  }
}

/** The `style.set` transitions that turn `prev` into `next`: one per property that differs, none when equal.
 * `StylePanel` reports the whole next `StyleState`; this is where that becomes one transition per property. */
export function styleTransitions(prev: StyleState, next: StyleState): StyleSetTransition[] {
  const out: StyleSetTransition[] = [];
  if (prev.fillColor !== next.fillColor) {
    out.push({ action: "style.set", params: { property: "fillColor", value: next.fillColor } });
  }
  if (prev.fillOpacity !== next.fillOpacity) {
    out.push({ action: "style.set", params: { property: "fillOpacity", value: next.fillOpacity } });
  }
  if (prev.outlineColor !== next.outlineColor) {
    out.push({ action: "style.set", params: { property: "outlineColor", value: next.outlineColor } });
  }
  if (prev.outlineWidth !== next.outlineWidth) {
    out.push({
      action: "style.set",
      params: { property: "outlineWidth", value: { value: next.outlineWidth, unit: "px" } },
    });
  }
  return out;
}

/** The end of a view's generation (section 2.3): its selection ends, with the count dropped and the reason, and its
 * inspected feature is cleared and unpinned. The workspace reducer calls this on the two events that end a
 * generation for the view, a rebind and the source changing. */
export function endViewGeneration(view: ViewState, reason: SelectionEndReason): ViewState {
  const ended = applyViewTransition(view, {
    action: "selection.end",
    params: { reason, dropped: viewSelection(view).size },
  });
  return applyViewTransition(ended, { action: "inspect.set", params: null });
}
