// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it } from "vitest";

import type { Admitted } from "../admission/admitDataset";
import { FILTER_DIALECT_DUCKDB_EXPR_0 } from "../skp/types";
import { checkScope, resolveScope, type ResolvedScope, type ScopeUses } from "./scope";
import type { ViewTransition } from "./viewTransitions";
import { DEFAULT_STYLE_STATE } from "../style/document";
import { initialWorkspaceState, workspaceReducer, type ViewId, type WorkspaceAction, type WorkspaceState } from "./workspaceState";

/** SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md section 4, UB6, and UA3's `resolveScope` clause (phase B): the scope. */
const admittedOf = (n: string): Admitted =>
  ({ dataset: `ds_${n}`, session: `sr_${n}`, describe: { source: { path_display: `C:/data/${n}.parquet` } } }) as unknown as Admitted;
const run = (state: WorkspaceState, ...actions: WorkspaceAction[]): WorkspaceState => actions.reduce(workspaceReducer, state);
const act = (t: ViewTransition, view: ViewId = "view-1"): WorkspaceAction => ({ type: "view.transition", view, transition: t });
const filterOf = (predicate: string) => ({ predicate, dialect: FILTER_DIALECT_DUCKDB_EXPR_0 });
const unit = { xmin: 0, ymin: 0, xmax: 1, ymax: 1 };
const select = (id: bigint): WorkspaceAction => act({ action: "selection.apply", params: { mode: "add", id, bounds: unit } });
const USES: ScopeUses = { selection: true };
const opened = run(initialWorkspaceState, { type: "resource.admitted", admitted: admittedOf("a") });
const scopeOf = (state: WorkspaceState, uses: ScopeUses = USES): ResolvedScope => {
  const scope = resolveScope(state, "view-1", uses);
  if (scope === null) throw new Error("no scope for view-1");
  return scope;
};

// RECORDED MUTATION for "UB6": in `checkScope` (scope.ts) omit the filter comparison (delete its `if (!sameFilter(...)) changed.push("filter");`).
// Expected failure: a changed filter is reported ok.
// OBSERVED AT feaa43d329e6d900b6ae672547569f1b591e3052: FAILED -- "names the view, the resource, the generation (session and end), the filter and the selection, each by itself":
//   AssertionError: expected { ok: true } to deeply equal { ok: false, changed: [ 'filter' ] }. Reverted after observing.
describe("UB6: checkScope names each of the five changes", () => {
  it("names the view, the resource, the generation (session and end), the filter and the selection, each by itself", () => {
    const staged = scopeOf(opened);
    expect(checkScope(staged, scopeOf(opened))).toEqual({ ok: true });
    expect(checkScope(staged, { ...staged, view: "view-2" })).toEqual({ ok: false, changed: ["view"] });
    expect(checkScope(staged, { ...staged, resource: "ds_x" })).toEqual({ ok: false, changed: ["resource"] });
    expect(checkScope(staged, { ...staged, generation: { session: "sr_x", ended: false } })).toEqual({ ok: false, changed: ["generation"] });
    expect(checkScope(staged, { ...staged, generation: { ...staged.generation, ended: true } })).toEqual({ ok: false, changed: ["generation"] });
    expect(checkScope(staged, scopeOf(run(opened, act({ action: "filter.apply", params: { filter: filterOf("a > 1") } }))))).toEqual({
      ok: false,
      changed: ["filter"],
    });
    expect(checkScope(staged, scopeOf(run(opened, select(1n))))).toEqual({ ok: false, changed: ["selection"] });
    const everything = checkScope(staged, {
      view: "view-2",
      resource: "ds_x",
      generation: { session: "sr_x", ended: true },
      filterAsApplied: filterOf("a > 1"),
      selection: new Set([1n]),
    });
    expect(everything).toEqual({ ok: false, changed: ["view", "resource", "generation", "filter", "selection"] });
  });

  // RECORDED MUTATION for "UB6" (the camera): in `resolveScope` (scope.ts) add the camera to the scope
  // (`camera: null,` among the returned members). Expected failure: the scope's members are no longer exactly the five.
  // OBSERVED AT feaa43d329e6d900b6ae672547569f1b591e3052: FAILED -- "a scope is five things and nothing else; a change of style, tool, mode or inspection is not a scope change":
  //   AssertionError: expected [ 'camera', 'filterAsApplied', …(4) ] to deeply equal [ 'filterAsApplied', …(4) ]. Reverted after observing.
  it("a scope is five things and nothing else; a change of style, tool, mode or inspection is not a scope change", () => {
    const staged = scopeOf(opened);
    expect(Object.keys(staged).sort()).toEqual(["filterAsApplied", "generation", "resource", "selection", "view"]);
    const looked = run(
      opened,
      act({ action: "style.set", params: { property: "fillColor", value: "#abcdef" } }),
      act({ action: "tool.set", params: { tool: "select" } }),
      act({ action: "mode.set", params: { mode: "replace" } }),
      act({ action: "inspect.set", params: { pick: { streamHandle: "s", batchSeq: 0, id: 1n, anchor: null }, bounds: unit } })
    );
    expect(checkScope(staged, scopeOf(looked))).toEqual({ ok: true });
  });

  // RECORDED MUTATION for "UB6" (by value): in `sameFilter` (scope.ts) compare by identity only (`a === b`).
  // Expected failure: the same predicate applied again is reported as a change.
  // OBSERVED AT feaa43d329e6d900b6ae672547569f1b591e3052: FAILED -- "applying the same filter again is not a change; clearing one is":
  //   AssertionError: expected { ok: false, changed: [ 'filter' ] } to deeply equal { ok: true }. Reverted after observing.
  it("applying the same filter again is not a change; clearing one is", () => {
    const withFilter = run(opened, act({ action: "filter.apply", params: { filter: filterOf("a > 1") } }));
    const again = run(withFilter, act({ action: "filter.apply", params: { filter: filterOf("a > 1") } }));
    expect(checkScope(scopeOf(withFilter), scopeOf(again))).toEqual({ ok: true });
    const cleared = run(withFilter, act({ action: "filter.apply", params: { filter: null } }));
    expect(checkScope(scopeOf(withFilter), scopeOf(cleared))).toEqual({ ok: false, changed: ["filter"] });
  });

  // RECORDED MUTATION for "UB6" (no current scope): in `checkScope` (scope.ts) answer ok for a null current scope
  // (`if (current === null) return { ok: true };`). Expected failure: a view that is gone is reported ok.
  // OBSERVED AT feaa43d329e6d900b6ae672547569f1b591e3052: FAILED -- "a view that is gone is a changed view":
  //   AssertionError: expected { ok: true } to deeply equal { ok: false, changed: [ 'view' ] }. Reverted after observing.
  it("a view that is gone is a changed view", () => {
    expect(resolveScope(opened, "view-9", USES)).toBeNull();
    expect(checkScope(scopeOf(opened), resolveScope(opened, "view-9", USES))).toEqual({ ok: false, changed: ["view"] });
  });

  // RECORDED MUTATION for "UB6" (an action that does not use the selection): in `resolveScope` (scope.ts) always take the
  // selection (`selection: new Set(viewSelection(bound).keys()),`). Expected failure: the scope is not "none".
  // OBSERVED AT feaa43d329e6d900b6ae672547569f1b591e3052: FAILED -- "an action that does not use the selection stages none, and a selection change does not refuse it":
  //   AssertionError: expected Set{} to be 'none' // Object.is equality. Reverted after observing.
  it("an action that does not use the selection stages none, and a selection change does not refuse it", () => {
    const staged = scopeOf(opened, { selection: false });
    expect(staged.selection).toBe("none");
    expect(checkScope(staged, scopeOf(run(opened, select(1n)), { selection: false }))).toEqual({ ok: true });
  });
});

// RECORDED MUTATION for "UA3" (resolveScope clause): in `resolveScope` (scope.ts) read the view at `drawOrder[0]` instead of the
// id given (`const bound = state.views[state.drawOrder[0]];`). Expected failure: after the permutation the first view resolves
// to the second view's scope.
// OBSERVED AT feaa43d329e6d900b6ae672547569f1b591e3052: FAILED -- "each view's scope is deep-equal in either order, and is its own":
//   AssertionError: expected { view: 'view-1', …(4) } to deeply equal { view: 'view-1', …(4) }. Reverted after observing.
describe("UA3 (phase B clause): permuting drawOrder leaves every view's resolveScope alone", () => {
  const view = (id: ViewId, n: string, predicate: string | null) => ({
    id,
    resource: `ds_${n}`,
    filter: predicate === null ? null : filterOf(predicate),
    style: DEFAULT_STYLE_STATE,
  });
  const entry = (n: string, id: ViewId) => ({ admitted: admittedOf(n), generationEnded: false, consumers: [id], closed: false });
  const twoViews: WorkspaceState = {
    views: { "view-1": view("view-1", "a", "id > 1"), "view-2": view("view-2", "b", null) },
    resources: { ds_a: entry("a", "view-1"), ds_b: entry("b", "view-2") },
    drawOrder: ["view-1", "view-2"],
    nextViewNumber: 3,
  };
  const swapped: WorkspaceState = { ...twoViews, drawOrder: ["view-2", "view-1"] };

  it("each view's scope is deep-equal in either order, and is its own", () => {
    for (const id of ["view-1", "view-2"] as const) {
      expect(resolveScope(swapped, id, USES)).toEqual(resolveScope(twoViews, id, USES));
    }
    expect(resolveScope(swapped, "view-1", USES)).toEqual({
      view: "view-1",
      resource: "ds_a",
      generation: { session: "sr_a", ended: false },
      filterAsApplied: filterOf("id > 1"),
      selection: new Set(),
    });
    expect(resolveScope(swapped, "view-2", USES)?.resource).toBe("ds_b");
  });
});
