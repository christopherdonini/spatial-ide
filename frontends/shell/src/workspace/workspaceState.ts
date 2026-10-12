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
 * **A view is a consumer of a resource.** A resource may be closed once its consumer set is empty, and only
 * once (`selectClosable`, then `resource.closed`). Phase A has one view and one kind of consumer. No action adds a
 * second view or reorders `drawOrder`: no product needs either yet (plan section 2 rule 9).
 *
 * `generationEnded` is written where `endSession` already runs; its reader is phase B's selection, which ends
 * with the generation (section 2.3), so the flag lands ahead of that consumer by the form's own naming of it.
 *
 * Hover, refusals, residency, scan state and the session latch stay in `App`. They are not transitions.
 */

import type { Admitted } from "../admission/admitDataset";
import type { Filter } from "../skp/types";
import { DEFAULT_STYLE_STATE } from "../style/document";
import type { StyleState } from "../style/document";
import { applyViewTransition } from "./viewTransitions";
import type { ViewTransition } from "./viewTransitions";

export type ViewId = `view-${number}`;
/** The dataset handle. */
export type ResourceKey = string;

export interface ViewState {
  readonly id: ViewId;
  readonly resource: ResourceKey;
  readonly filter: Filter | null;
  readonly style: StyleState;
}

export interface ResourceEntry {
  readonly admitted: Admitted;
  readonly generationEnded: boolean;
  readonly consumers: readonly ViewId[];
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
  | { type: "consumer.released"; resource: ResourceKey; consumer: ViewId }
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
  return {
    ...state,
    views: { ...state.views, [viewId]: { ...view, resource: key, filter: null } },
    resources,
  };
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
      return withResource(state, action.resource, (e) => (e.generationEnded ? e : { ...e, generationEnded: true }));
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
