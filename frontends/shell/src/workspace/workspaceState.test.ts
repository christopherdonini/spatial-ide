// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it } from "vitest";

import type { Admitted } from "../admission/admitDataset";
import { FILTER_DIALECT_DUCKDB_EXPR_0 } from "../skp/types";
import { DEFAULT_STYLE_STATE } from "../style/document";
import {
  viewInspected,
  viewPinned,
  viewSelection,
  viewSelectionMode,
  viewSelectionNotice,
  viewTool,
} from "./viewTransitions";
import {
  initialWorkspaceState,
  selectAdmitted,
  selectClosable,
  selectDrawnViews,
  workspaceReducer,
  type ConsumerId,
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
// OBSERVED AT deab7dc96d06bf3e329527d3ae95415dcd65152b: FAILED -- "one view across three admissions, rebound each time, with the filter reset and the style kept":
//   AssertionError: the view count after the reopen: expected [ 'view-1', 'view-2' ] to deeply equal [ 'view-1' ]. Reverted after observing.
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
// OBSERVED AT deab7dc96d06bf3e329527d3ae95415dcd65152b: FAILED -- "a live resource is never closable; a replaced one closes once however often the effect runs":
//   AssertionError: closes after two drains: expected [ 'ds_a', 'ds_a' ] to deeply equal [ 'ds_a' ]. Reverted after observing.
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
// OBSERVED AT deab7dc96d06bf3e329527d3ae95415dcd65152b: FAILED -- "each view resolves to its own resource and keeps its own filter, in either order":
//   AssertionError: expected { dataset: 'ds_b', …(2) } to be { dataset: 'ds_a', …(2) } // Object.is equality. Reverted after observing.
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

// RECORDED MUTATION for "UB12": make the default mode replace (selectionConstants.ts: `DEFAULT_SELECTION_MODE: SelectionMode = "replace"`).
// Expected failure: a minted view reads replace.
// OBSERVED AT feaa43d329e6d900b6ae672547569f1b591e3052: FAILED -- "reads its section 7 defaults, and the view minted is still the four-member object phase A's UA1 pins":
//   AssertionError: expected 'replace' to be 'toggle' // Object.is equality. Reverted after observing.
describe("UB12 (Amendment 1 B6): a minted view starts in Navigate, in toggle, with nothing selected, inspected or pinned", () => {
  it("reads its section 7 defaults, and the view minted is still the four-member object phase A's UA1 pins", () => {
    const view = run(initialWorkspaceState, admit("a")).views["view-1"];
    expect(viewTool(view)).toBe("navigate");
    expect(viewSelectionMode(view)).toBe("toggle");
    expect(viewSelection(view).size).toBe(0);
    expect(viewSelectionNotice(view)).toBeNull();
    expect(viewInspected(view)).toBeNull();
    expect(viewPinned(view)).toBe(false);
    expect(Object.keys(view).sort()).toEqual(["filter", "id", "resource", "style"]);
  });
});

// RECORDED MUTATION for "UB14": in the reducer's `consumer.acquired` case (workspaceState.ts) append without the presence check
// (`withResource(state, action.resource, (e) => ({ ...e, consumers: [...e.consumers, action.consumer] }))`).
// Expected failure: acquired twice, one release leaves a consumer behind, so the resource is not closable.
// OBSERVED AT feaa43d329e6d900b6ae672547569f1b591e3052: FAILED -- "acquired twice and released once leaves the resource closable exactly once":
//   AssertionError: expected [ 'view-1', 'export-1', 'export-1' ] to deeply equal [ 'view-1', 'export-1' ]. Reverted after observing.
describe("UB14 (Amendment 7 item 6): consumer.acquired is idempotent, and an export consumer holds a resource open", () => {
  const acquire = (consumer: ConsumerId): WorkspaceAction => ({ type: "consumer.acquired", resource: "ds_a", consumer });
  const release = (consumer: ConsumerId): WorkspaceAction => ({ type: "consumer.released", resource: "ds_a", consumer });

  it("acquired twice and released once leaves the resource closable exactly once", () => {
    let state = run(initialWorkspaceState, admit("a"), acquire("export-1"), acquire("export-1"));
    expect(state.resources.ds_a.consumers).toEqual(["view-1", "export-1"]);
    expect(workspaceReducer(state, acquire("export-1")), "an acquire of a present consumer changes nothing").toBe(state);
    state = run(state, release("export-1"), release("view-1"));
    expect(selectClosable(state)).toEqual(["ds_a"]);
    state = workspaceReducer(state, { type: "resource.closed", resource: "ds_a" });
    expect(selectClosable(state)).toEqual([]);
  });

  // RECORDED MUTATION for "UB14": in `admit` (workspaceState.ts) the rebind empties the old resource's consumers (`resources[view.resource] = { ...old, consumers: [] };`).
  // Expected failure: the export consumer is gone with the view.
  // OBSERVED AT feaa43d329e6d900b6ae672547569f1b591e3052: FAILED -- "an export consumer keeps a resource the view has left out of selectClosable until it is released":
  //   AssertionError: the view left; the export stayed: expected [] to deeply equal [ 'export-1' ]. Reverted after observing.
  it("an export consumer keeps a resource the view has left out of selectClosable until it is released", () => {
    const state = run(initialWorkspaceState, admit("a"), acquire("export-1"), admit("b"));
    expect(state.resources.ds_a.consumers, "the view left; the export stayed").toEqual(["export-1"]);
    expect(selectClosable(state)).toEqual([]);
    expect(selectClosable(workspaceReducer(state, release("export-1")))).toEqual(["ds_a"]);
  });

  // RECORDED MUTATION for "UB14": in the reducer's `consumer.acquired` case (workspaceState.ts) acquire nothing (the updater returns `e`).
  // Expected failure: the re-acquired view does not hold the resource, so it stays closable.
  // OBSERVED AT feaa43d329e6d900b6ae672547569f1b591e3052: FAILED -- "re-acquiring the view after its release keeps a live resource out of selectClosable":
  //   AssertionError: expected [ 'ds_a' ] to deeply equal []. Reverted after observing.
  it("re-acquiring the view after its release keeps a live resource out of selectClosable", () => {
    const released = run(initialWorkspaceState, admit("a"), release("view-1"));
    expect(selectClosable(released)).toEqual(["ds_a"]);
    expect(selectClosable(workspaceReducer(released, acquire("view-1")))).toEqual([]);
  });
});
