// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md section 2.5 (seam 6), phase B: the scope an action runs against.
 * `resolveScope` builds a `ResolvedScope` from the workspace; `checkScope` compares a staged one with the current one
 * and names what changed. Pure; no React, no SKP, no canvas (the import rule of section 2.1(a)).
 *
 * **A scope is five things:** the view, its resource, the generation, the filter as applied, and the selection (when
 * the action uses it). The camera is not one of them, so a pan never refuses an action. Style, tool, mode and
 * inspection are not part of a scope either: an action's scope is what it acts on, not how the view looks.
 *
 * The view is addressed by its own id, never by its place in `drawOrder` (UA3): permuting the draw order leaves
 * every view's scope as it was.
 */

import type { Filter } from "../skp/types";
import { viewSelection } from "./viewTransitions";
import type { ResourceKey, ViewId, WorkspaceState } from "./workspaceState";

/** The generation (section 2.1(a)): the open's session, and whether it has ended. */
export interface GenerationId {
  readonly session: string;
  readonly ended: boolean;
}

export interface ResolvedScope {
  readonly view: ViewId;
  readonly resource: ResourceKey;
  readonly generation: GenerationId;
  readonly filterAsApplied: Filter | null;
  /** The selected ids when the action uses the selection; `"none"` when it does not. */
  readonly selection: ReadonlySet<bigint> | "none";
}

/** What the action reads beyond the view, its resource, its generation and its filter. */
export interface ScopeUses {
  readonly selection: boolean;
}

export type ScopeChange = "view" | "resource" | "generation" | "filter" | "selection";

export type ScopeCheck = { readonly ok: true } | { readonly ok: false; readonly changed: readonly ScopeChange[] };

/** The scope `view` has now, or `null` when the view or its resource is not in the workspace. */
export function resolveScope(state: WorkspaceState, view: ViewId, uses: ScopeUses): ResolvedScope | null {
  const bound = state.views[view];
  const entry = bound === undefined ? undefined : state.resources[bound.resource];
  if (bound === undefined || entry === undefined) return null;
  return {
    view,
    resource: bound.resource,
    generation: { session: entry.admitted.session, ended: entry.generationEnded },
    filterAsApplied: bound.filter,
    selection: uses.selection ? new Set(viewSelection(bound).keys()) : "none",
  };
}

const sameFilter = (a: Filter | null, b: Filter | null): boolean =>
  a === b || (a !== null && b !== null && a.predicate === b.predicate && a.dialect === b.dialect);

function sameSelection(a: ReadonlySet<bigint> | "none", b: ReadonlySet<bigint> | "none"): boolean {
  if (a === "none" || b === "none") return a === b;
  if (a.size !== b.size) return false;
  for (const id of a) if (!b.has(id)) return false;
  return true;
}

/**
 * Compares the scope staged when an action was prepared with the one it would run against now. Ok, or the list of what
 * changed. With no current scope the view itself is gone. The filter is compared by value, so applying the same
 * predicate again is not a change.
 */
export function checkScope(staged: ResolvedScope, current: ResolvedScope | null): ScopeCheck {
  if (current === null) return { ok: false, changed: ["view"] };
  const changed: ScopeChange[] = [];
  if (staged.view !== current.view) changed.push("view");
  if (staged.resource !== current.resource) changed.push("resource");
  if (staged.generation.session !== current.generation.session || staged.generation.ended !== current.generation.ended) {
    changed.push("generation");
  }
  if (!sameFilter(staged.filterAsApplied, current.filterAsApplied)) changed.push("filter");
  if (!sameSelection(staged.selection, current.selection)) changed.push("selection");
  return changed.length === 0 ? { ok: true } : { ok: false, changed };
}
