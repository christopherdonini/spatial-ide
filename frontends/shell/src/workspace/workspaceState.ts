// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md section 2.1 (seam 4), phase A: the workspace's state, keyed
 * by view. One reducer, the types and the selectors; no React, no SKP and no canvas in here (the import rule of
 * section 2.1(a), held by `workspaceBoundary.test.ts`).
 *
 * **Three identities, kept apart.**
 * - `ViewId`: minted here as `view-<n>` from a counter in the state, per session, never persisted.
 * - `ResourceKey`: the dataset handle. A resource entry holds that open's `Admitted` (handle, `describe`,
 *   session).
 * - The generation: the open's `session` plus the entry's `generationEnded` flag.
 *
 * **A view or an export run is a consumer of a resource.** A resource may be closed once its consumer set is empty,
 * and only once (`selectClosable`, then `resource.closed`). No action adds a second view or reorders `drawOrder`: no
 * product needs either yet (plan section 2 rule 9).
 *
 * `generationEnded` is written where `endSession` already runs. Its reader is the selection's end (section 2.3):
 * the reducer ends the selection and the inspection of every view bound to the resource, once. A rebind ends them
 * the same way, with the other reason.
 *
 * Hover, refusals, residency, scan state and the session latch stay in `App`. They are not transitions.
 */

import type { Admitted } from "../admission/admitDataset";
import type { AttributeRow } from "../attributes/values";
import type { AuthoritativeBbox } from "../canvas/viewportBbox";
import type { Filter } from "../skp/types";
import { DEFAULT_STYLE_STATE } from "../style/document";
import type { StyleState } from "../style/document";
import type { FilterClause } from "./filterClauses";
import type { SelectionMembers, SelectionMode, SelectionNotice } from "./selection";
import { applyViewTransition, endViewGeneration } from "./viewTransitions";
import type { ViewTransition } from "./viewTransitions";

export type ViewId = `view-${number}`;
/** The dataset handle. */
export type ResourceKey = string;

export type Tool = "navigate" | "select";

/** An export run's consumer of a resource (Amendment 7 item 2(b)): `export-<n>`, minted by App once per run. */
export type ExportConsumerId = `export-${number}`;
/** What holds a resource open: a view, or an export run. */
export type ConsumerId = ViewId | ExportConsumerId;

/** The pick a click resolved, as the workspace holds it. The members mirror `canvas/pick.ts`'s `PickResult`, which is
 * assignable to this (the import rule of section 2.1(a) lets no canvas value or type but `AuthoritativeBbox` in). */
export interface InspectedPick {
  readonly streamHandle: string;
  readonly batchSeq: number;
  readonly id: bigint;
  readonly anchor: [number, number] | null;
}

export interface InspectedFeature {
  readonly pick: InspectedPick;
  readonly bounds: AuthoritativeBbox;
  /** The feature's projected values, copied at the click from the batch that held them (milestone 4 PR A, section 2.2 (e)): kept for the generation (ADR-010 rule 5), so
   * a pinned feature keeps them when its batch is gone. `null` when the open projects no column; `"not-held"` when the batch passed the attribute ceiling. */
  readonly row: AttributeRow | "not-held" | null;
}

/**
 * `id`, `resource`, `filter` and `style` are phase A's. The rest is phase B's (section 2.2) and is optional: a member
 * that is absent has its section 7 default, and is read through `viewTool`, `viewSelectionMode`, `viewSelection`,
 * `viewInspected` and `viewPinned` (`viewTransitions.ts`). So a view minted by phase A's reducer is still exactly the
 * four-member object phase A's tests pin, and "a minted view starts in Navigate, in toggle, with nothing pinned" is
 * the defaults those readers return.
 */
export interface ViewState {
  readonly id: ViewId;
  readonly resource: ResourceKey;
  readonly filter: Filter | null;
  readonly style: StyleState;
  readonly tool?: Tool;
  readonly selectionMode?: SelectionMode;
  /** The members of the view's selection (section 2.3). Bound to the resource and generation the view is bound to. */
  readonly selection?: SelectionMembers;
  /** What the last selection end or ceiling refusal left, until the next selection transition. */
  readonly selectionNotice?: SelectionNotice;
  readonly inspected?: InspectedFeature | null;
  readonly pinned?: boolean;
  /** The filter clauses (SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md section 2.5, Amendment 3 item 7), read through `viewClauses`: an absent member is none.
   * `filter` always equals `combineClauses` of them. */
  readonly clauses?: readonly FilterClause[];
  /** The next `clause-<n>` to mint for this view, read through `viewNextClauseNumber`; an absent member is 1. A rebind keeps it, so an id is never minted twice in a session. */
  readonly clauseCounter?: number;
}

export interface ResourceEntry {
  readonly admitted: Admitted;
  readonly generationEnded: boolean;
  readonly consumers: readonly ConsumerId[];
  readonly closed: boolean;
}

export interface WorkspaceState {
  readonly views: Readonly<Record<ViewId, ViewState>>;
  readonly resources: Readonly<Record<ResourceKey, ResourceEntry>>;
  readonly drawOrder: readonly ViewId[];
  /** The next `view-<n>` to mint. In the state, so the reducer stays pure. */
  readonly nextViewNumber: number;
}

export type WorkspaceAction =
  /** Mints the one view on the first admission and rebinds it on every later one: the view's filter is
   * reset and its style kept, the view joins the new resource's consumers and leaves the old one's. */
  | { type: "resource.admitted"; admitted: Admitted }
  | { type: "resource.generationEnded"; resource: ResourceKey }
  /** Idempotent (Amendment 7 item 4): a consumer already present leaves the state unchanged. */
  | { type: "consumer.acquired"; resource: ResourceKey; consumer: ConsumerId }
  | { type: "consumer.released"; resource: ResourceKey; consumer: ConsumerId }
  /** Written once, when the close has been issued. */
  | { type: "resource.closed"; resource: ResourceKey }
  | { type: "view.transition"; view: ViewId; transition: ViewTransition };

export const initialWorkspaceState: WorkspaceState = {
  views: {},
  resources: {},
  drawOrder: [],
  nextViewNumber: 1,
};

function admit(state: WorkspaceState, admitted: Admitted): WorkspaceState {
  const key = admitted.dataset;
  const known = state.resources[key];
  const target: ResourceEntry = known ?? { admitted, generationEnded: false, consumers: [], closed: false };
  const viewId = state.drawOrder[0];
  if (viewId === undefined) {
    const id: ViewId = `view-${state.nextViewNumber}`;
    const view: ViewState = { id, resource: key, filter: null, style: DEFAULT_STYLE_STATE };
    return {
      views: { ...state.views, [id]: view },
      resources: { ...state.resources, [key]: { ...target, consumers: [...target.consumers, id] } },
      drawOrder: [...state.drawOrder, id],
      nextViewNumber: state.nextViewNumber + 1,
    };
  }
  const view = state.views[viewId];
  const resources: Record<ResourceKey, ResourceEntry> = { ...state.resources };
  const old = resources[view.resource];
  if (old !== undefined && view.resource !== key) {
    resources[view.resource] = { ...old, consumers: old.consumers.filter((c) => c !== viewId) };
  }
  resources[key] = target.consumers.includes(viewId)
    ? target
    : { ...target, consumers: [...target.consumers, viewId] };
  // A rebind ends the old generation: the selection and the inspected feature name nothing in the new one (section 2.3).
  const bound = view.resource === key ? view : endViewGeneration(view, "reopened");
  // The filter resets and with it the clauses (milestone 3 section 2.5).
  const { clauses: _clauses, ...rebound } = bound;
  return {
    ...state,
    views: { ...state.views, [viewId]: { ...rebound, resource: key, filter: null } },
    resources,
  };
}

/** The source changed under `key`: the generation ends once, and with it every selection and inspection bound to it. */
function endGeneration(state: WorkspaceState, key: ResourceKey): WorkspaceState {
  const entry = state.resources[key];
  if (entry === undefined || entry.generationEnded) return state;
  const views: Record<ViewId, ViewState> = { ...state.views };
  for (const id of Object.keys(views) as ViewId[]) {
    if (views[id].resource === key) views[id] = endViewGeneration(views[id], "source-changed");
  }
  return { ...state, views, resources: { ...state.resources, [key]: { ...entry, generationEnded: true } } };
}

function withResource(
  state: WorkspaceState,
  key: ResourceKey,
  change: (entry: ResourceEntry) => ResourceEntry
): WorkspaceState {
  const entry = state.resources[key];
  if (entry === undefined) return state;
  const next = change(entry);
  return next === entry ? state : { ...state, resources: { ...state.resources, [key]: next } };
}

export function workspaceReducer(state: WorkspaceState, action: WorkspaceAction): WorkspaceState {
  switch (action.type) {
    case "resource.admitted":
      return admit(state, action.admitted);
    case "resource.generationEnded":
      return endGeneration(state, action.resource);
    case "consumer.acquired":
      return withResource(state, action.resource, (e) =>
        e.consumers.includes(action.consumer) ? e : { ...e, consumers: [...e.consumers, action.consumer] }
      );
    case "consumer.released":
      return withResource(state, action.resource, (e) =>
        e.consumers.includes(action.consumer) ? { ...e, consumers: e.consumers.filter((c) => c !== action.consumer) } : e
      );
    case "resource.closed":
      return withResource(state, action.resource, (e) => (e.closed ? e : { ...e, closed: true }));
    case "view.transition": {
      const view = state.views[action.view];
      if (view === undefined) return state;
      return { ...state, views: { ...state.views, [action.view]: applyViewTransition(view, action.transition) } };
    }
  }
}

/** The views in draw order. The map slot renders these. */
export function selectDrawnViews(state: WorkspaceState): readonly ViewState[] {
  return state.drawOrder.map((id) => state.views[id]);
}

/** The `Admitted` of the resource a view is bound to, by the view's own id and never by its place in `drawOrder`. */
export function selectAdmitted(state: WorkspaceState, view: ViewId): Admitted | null {
  const bound = state.views[view];
  return bound === undefined ? null : (state.resources[bound.resource]?.admitted ?? null);
}

/** The resources to close now: no consumer left and not yet closed. Each is returned until `resource.closed`
 * is written for it, which is what makes the close happen once. */
export function selectClosable(state: WorkspaceState): readonly ResourceKey[] {
  return Object.keys(state.resources).filter((key) => {
    const entry = state.resources[key];
    return entry.consumers.length === 0 && !entry.closed;
  });
}
