// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it } from "vitest";

import type { Admitted } from "../admission/admitDataset";
import { FILTER_DIALECT_DUCKDB_EXPR_0 } from "../skp/types";
import { DEFAULT_STYLE_STATE } from "../style/document";
import {
  initialWorkspaceState,
  selectAdmitted,
  selectClosable,
  selectDrawnViews,
  workspaceReducer,
  type ViewId,
  type WorkspaceAction,
  type WorkspaceState,
} from "./workspaceState";

/** SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md section 4, UA1 to UA3: the workspace reducer, phase A. */
const admittedOf = (n: string): Admitted =>
  ({ dataset: `ds_${n}`, session: `sr_${n}`, describe: { source: { path_display: `C:/data/${n}.parquet` } } }) as unknown as Admitted;
const run = (state: WorkspaceState, ...actions: WorkspaceAction[]): WorkspaceState => actions.reduce(workspaceReducer, state);
const admit = (n: string): WorkspaceAction => ({ type: "resource.admitted", admitted: admittedOf(n) });
const filterOf = (predicate: string) => ({ predicate, dialect: FILTER_DIALECT_DUCKDB_EXPR_0 });

// RECORDED MUTATION for "UA1": in `admit` (workspaceState.ts) take the mint branch on every admission, not only the first.
// Expected failure: after the second admission there are two views.
describe("UA1: the view is minted once and rebound on a reopen; the filter resets and the style is kept", () => {
  it("one view across three admissions, rebound each time, with the filter reset and the style kept", () => {
    const a = admit("a");
    let state = run(initialWorkspaceState, a);
    expect(state.drawOrder).toEqual(["view-1"]);
    expect(Object.keys(state.views)).toEqual(["view-1"]);
    expect(state.views["view-1"]).toEqual({ id: "view-1", resource: "ds_a", filter: null, style: DEFAULT_STYLE_STATE });
    expect(state.resources.ds_a.consumers).toEqual(["view-1"]);

    state = run(
      state,
      { type: "view.transition", view: "view-1", transition: { action: "filter.apply", params: { filter: filterOf("zone = 'r'") } } },
      { type: "view.transition", view: "view-1", transition: { action: "style.set", params: { property: "fillColor", value: "#112233" } } }
    );
    const b = admittedOf("b");
    state = workspaceReducer(state, { type: "resource.admitted", admitted: b });
    expect(Object.keys(state.views), "the view count after the reopen").toEqual(["view-1"]);
    expect(state.drawOrder).toEqual(["view-1"]);
    expect(state.views["view-1"].resource).toBe("ds_b");
    expect(state.views["view-1"].filter, "the filter is reset").toBeNull();
    expect(state.views["view-1"].style.fillColor, "the style is kept").toBe("#112233");
    expect(state.resources.ds_a.consumers, "the old resource lost its consumer").toEqual([]);
    expect(state.resources.ds_b.consumers).toEqual(["view-1"]);
    expect(state.resources.ds_b.admitted, "the same Admitted object is stored").toBe(b);

    state = run(state, admit("c"));
    expect(Object.keys(state.views)).toEqual(["view-1"]);
    expect(state.nextViewNumber).toBe(2);
  });
});

// RECORDED MUTATION for "UA2": in `selectClosable` (workspaceState.ts) drop the `!entry.closed` guard.
// Expected failure: a resource already closed is closable again, so the second drain closes it a second time.
describe("UA2: a resource is closable only when its consumer set is empty, and is closed once", () => {
  /** What App's close effect does: close each closable resource, then write `resource.closed`. */
  function drain(state: WorkspaceState, closes: string[]): WorkspaceState {
    let next = state;
    for (const key of selectClosable(state)) {
      closes.push(key);
      next = workspaceReducer(next, { type: "resource.closed", resource: key });
    }
    return next;
  }

  it("a live resource is never closable; a replaced one closes once however often the effect runs", () => {
    const closes: string[] = [];
    let state = run(initialWorkspaceState, admit("a"));
    expect(selectClosable(state), "a resource with a consumer").toEqual([]);

    state = run(state, admit("b"));
    expect(selectClosable(state)).toEqual(["ds_a"]);
    state = drain(state, closes);
    state = drain(state, closes);
    expect(closes, "closes after two drains").toEqual(["ds_a"]);
    expect(workspaceReducer(state, { type: "resource.closed", resource: "ds_a" }), "a second close write changes nothing").toBe(state);
    expect(selectClosable(state), "the live resource is still open").toEqual([]);
  });

  it("a consumer released without a rebind makes the resource closable, and releasing twice changes nothing", () => {
    let state = run(initialWorkspaceState, admit("a"));
    state = workspaceReducer(state, { type: "consumer.released", resource: "ds_a", consumer: "view-1" });
    expect(selectClosable(state)).toEqual(["ds_a"]);
    expect(workspaceReducer(state, { type: "consumer.released", resource: "ds_a", consumer: "view-1" })).toBe(state);
    expect(workspaceReducer(state, { type: "resource.generationEnded", resource: "ds_a" }).resources.ds_a.generationEnded).toBe(true);
  });
});

// RECORDED MUTATION for "UA3": in `selectAdmitted` (workspaceState.ts) read the view at `drawOrder[0]` instead of the view id given.
// Expected failure: after the permutation the first view reads the second view's resource. (The form's mutation names
// `resolveScope`, which is phase B's; in phase A the selector that resolves a view's resource is `selectAdmitted`.)
describe("UA3: permuting drawOrder leaves every view's filter and resource binding alone", () => {
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

  it("each view resolves to its own resource and keeps its own filter, in either order", () => {
    for (const id of ["view-1", "view-2"] as const) {
      expect(selectAdmitted(swapped, id)).toBe(selectAdmitted(twoViews, id));
      expect(swapped.views[id]).toEqual(twoViews.views[id]);
    }
    expect(selectAdmitted(swapped, "view-1")).toBe(twoViews.resources.ds_a.admitted);
    expect(selectDrawnViews(swapped).map((v) => v.id)).toEqual(["view-2", "view-1"]);
  });

  it("a transition addresses a view by its id, whatever its place in the draw order", () => {
    const next = workspaceReducer(swapped, {
      type: "view.transition",
      view: "view-1",
      transition: { action: "filter.apply", params: { filter: null } },
    });
    expect(next.views["view-1"].filter).toBeNull();
    expect(next.views["view-2"]).toBe(swapped.views["view-2"]);
  });
});
