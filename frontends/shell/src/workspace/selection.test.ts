// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it } from "vitest";

import type { Admitted } from "../admission/admitDataset";
import type { AuthoritativeBbox } from "../canvas/viewportBbox";
import { FILTER_DIALECT_DUCKDB_EXPR_0 } from "../skp/types";
import { DEFAULT_STYLE_STATE } from "../style/document";
import { applySelectionMode, countSelection, NO_MEMBERS, type SelectionMembers } from "./selection";
import { SELECTION_MAX_FEATURES } from "./selectionConstants";
import {
  applyViewTransition,
  viewInspected,
  viewPinned,
  viewSelection,
  viewSelectionNotice,
  type ViewTransition,
} from "./viewTransitions";
import { initialWorkspaceState, workspaceReducer, type ViewState, type WorkspaceAction, type WorkspaceState } from "./workspaceState";

/** SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md section 4, UB1 to UB5: the selection contract (section 2.3). */
const box = (xmin: number, ymin: number, xmax: number, ymax: number): AuthoritativeBbox => ({ xmin, ymin, xmax, ymax });
const members = (...entries: [bigint, AuthoritativeBbox][]): SelectionMembers => new Map(entries);
const ids = (m: SelectionMembers): bigint[] => [...m.keys()].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
const unit = box(0, 0, 1, 1);
const FACTS = { filterApplied: false, viewComplete: false };

// RECORDED MUTATION for "UB1" (the four modes): in `applySelectionMode` (selection.ts) make toggle add only
// (`case "toggle": return present ? { kind: "unchanged", members } : withMember(members, id, bounds);`).
// Expected failure: toggling a present id leaves it selected.
// OBSERVED AT <X>: <pending>
describe("UB1: the four modes", () => {
  it("toggle adds an absent id and removes a present one; replace sets it alone; add only adds; remove only removes", () => {
    const one = members([1n, unit]);
    const toggledOn = applySelectionMode(one, "toggle", 2n, unit);
    expect(toggledOn.kind).toBe("changed");
    expect(ids(toggledOn.members)).toEqual([1n, 2n]);
    expect(ids(applySelectionMode(toggledOn.members, "toggle", 1n, unit).members), "toggle removes a present id").toEqual([2n]);

    expect(ids(applySelectionMode(toggledOn.members, "replace", 3n, unit).members)).toEqual([3n]);
    expect(applySelectionMode(members([3n, unit]), "replace", 3n, unit).kind, "replace with the set already this id").toBe("unchanged");

    expect(ids(applySelectionMode(one, "add", 2n, unit).members)).toEqual([1n, 2n]);
    expect(applySelectionMode(one, "add", 1n, unit).kind, "add of a present id").toBe("unchanged");

    expect(ids(applySelectionMode(toggledOn.members, "remove", 1n, unit).members)).toEqual([2n]);
    expect(applySelectionMode(one, "remove", 9n, unit).kind, "remove of an absent id").toBe("unchanged");
    expect(applySelectionMode(NO_MEMBERS, "remove", 9n, unit).members).toBe(NO_MEMBERS);
  });

  // RECORDED MUTATION for "UB1" (one id per feature): in `applySelectionMode` the `add` case drops its present-id shortcut
  // (`case "add": return withMember(members, id, bounds);`). Expected failure: the second click on another part of the same
  // feature replaces the bounds the first click kept.
  // OBSERVED AT <X>: <pending>
  it("a feature clicked on two of its parts is one member and keeps the bounds it was first selected with", () => {
    const first = applySelectionMode(NO_MEMBERS, "add", 5n, box(0, 0, 4, 4)).members;
    const second = applySelectionMode(first, "add", 5n, box(0, 0, 2, 2));
    expect(second.members.size).toBe(1);
    expect(second.members.get(5n)).toEqual(box(0, 0, 4, 4));
  });

  // RECORDED MUTATION for "UB1" (no write to the input): in `withMember` (selection.ts) add to the given map instead of a copy
  // (`(members as Map<bigint, AuthoritativeBbox>).set(id, bounds); return { kind: "changed", members };`).
  // Expected failure: the map handed in has grown.
  // OBSERVED AT <X>: <pending>
  it("never writes to the members it is given", () => {
    const given = members([1n, unit]);
    applySelectionMode(given, "toggle", 2n, unit);
    applySelectionMode(given, "replace", 3n, unit);
    applySelectionMode(given, "add", 4n, unit);
    applySelectionMode(given, "remove", 1n, unit);
    expect(ids(given)).toEqual([1n]);
  });
});

// RECORDED MUTATION for "UB2": in `withMember` (selection.ts) drop the ceiling check (`if (false) {`).
// Expected failure: the add at the ceiling is not refused.
// OBSERVED AT <X>: <pending>
describe("UB2: the ceiling refuses by name and leaves the set unchanged", () => {
  const full = (): SelectionMembers => {
    const m = new Map<bigint, AuthoritativeBbox>();
    for (let i = 0; i < SELECTION_MAX_FEATURES; i++) m.set(BigInt(i), unit);
    return m;
  };

  it("an add past SELECTION_MAX_FEATURES is refused with its name and the set is returned as it was", () => {
    const atCeiling = full();
    const toggled = applySelectionMode(atCeiling, "toggle", BigInt(SELECTION_MAX_FEATURES), unit);
    expect(toggled).toEqual({
      kind: "refused",
      members: atCeiling,
      refusal: { code: "selection.ceiling", max: SELECTION_MAX_FEATURES, attempted: SELECTION_MAX_FEATURES + 1 },
    });
    expect(toggled.members, "the very set that was given").toBe(atCeiling);
    expect(applySelectionMode(atCeiling, "add", BigInt(SELECTION_MAX_FEATURES), unit).kind).toBe("refused");
    expect(atCeiling.size).toBe(SELECTION_MAX_FEATURES);
  });

  it("at the ceiling a present id, a removal and a replacement still work, and the last free place can be taken", () => {
    const atCeiling = full();
    expect(applySelectionMode(atCeiling, "add", 0n, unit).kind).toBe("unchanged");
    expect(applySelectionMode(atCeiling, "toggle", 0n, unit).members.size).toBe(SELECTION_MAX_FEATURES - 1);
    expect(applySelectionMode(atCeiling, "replace", 99_999n, unit).members.size).toBe(1);
    const oneBelow = applySelectionMode(atCeiling, "remove", 0n, unit).members;
    expect(applySelectionMode(oneBelow, "add", 99_999n, unit).members.size).toBe(SELECTION_MAX_FEATURES);
  });

  // RECORDED MUTATION for "UB2" (the view keeps the refusal): in `applySelection` (viewTransitions.ts) return the view
  // unchanged on a refusal (`if (outcome.kind === "refused") return view;`). Expected failure: no refused notice stands.
  // OBSERVED AT <X>: <pending>
  it("through the transition, the members stay, a refused notice stands, and the next selection transition clears it", () => {
    const base: ViewState = { id: "view-1", resource: "ds_a", filter: null, style: DEFAULT_STYLE_STATE, selection: full() };
    const refused = applyViewTransition(base, {
      action: "selection.apply",
      params: { mode: "add", id: 123_456n, bounds: unit },
    });
    expect(viewSelection(refused)).toBe(base.selection);
    expect(viewSelectionNotice(refused)).toEqual({
      kind: "refused",
      refusal: { code: "selection.ceiling", max: SELECTION_MAX_FEATURES, attempted: SELECTION_MAX_FEATURES + 1 },
    });
    const cleared = applyViewTransition(refused, { action: "selection.apply", params: { mode: "remove", id: 0n, bounds: unit } });
    expect(viewSelectionNotice(cleared)).toBeNull();
  });
});

describe("UB3: counts by reason", () => {
  const view = box(0, 0, 10, 10);
  const held = members(
    [1n, box(1, 1, 2, 2)], // inside, drawn
    [2n, box(3, 3, 4, 4)], // inside, not drawn
    [3n, box(10, 10, 12, 12)], // shares a corner with the view: meets it, not drawn
    [4n, box(20, 20, 21, 21)], // outside
    [5n, box(-5, 4, -1, 6)] // outside, though it is drawn
  );
  const drawn = new Set<bigint>([1n, 5n]);

  // RECORDED MUTATION for "UB3": in `countSelection` (selection.ts) produce the filter reason when a filter is applied and
  // the view is reported complete (`reason: _facts.filterApplied && _facts.viewComplete ? "excluded by the filter" : null`).
  // Expected failure: the reason is not null where the facts are the ones that would show it.
  // OBSERVED AT <X>: <pending>
  it("outside the view from the kept bounds, in the view and not drawn, Selected ignoring the filter, and never a reason", () => {
    for (const facts of [FACTS, { filterApplied: true, viewComplete: false }, { filterApplied: true, viewComplete: true }]) {
      expect(countSelection(held, view, drawn, facts)).toEqual({ selected: 5, outsideView: 2, inViewNotDrawn: 2, reason: null });
    }
    expect(countSelection(NO_MEMBERS, view, drawn, FACTS)).toEqual({ selected: 0, outsideView: 0, inViewNotDrawn: 0, reason: null });
  });

  // RECORDED MUTATION for "UB3-b": in `countSelection` (selection.ts) read a null view box as containing every member
  // (`if (viewBox === null) return { selected: members.size, outsideView: 0, inViewNotDrawn: [...members.keys()].filter((i) => !drawn.has(i)).length, reason: null };`).
  // Expected failure: the null box gives a split.
  // OBSERVED AT <X>: <pending>
  it("with no current view box there is no split and no reason: Selected only", () => {
    expect(countSelection(held, null, drawn, { filterApplied: true, viewComplete: true })).toEqual({
      selected: 5,
      outsideView: null,
      inViewNotDrawn: null,
      reason: null,
    });
  });
});

describe("UB4: the end of a generation ends the selection", () => {
  const admittedOf = (n: string): Admitted =>
    ({ dataset: `ds_${n}`, session: `sr_${n}`, describe: { source: { path_display: `C:/data/${n}.parquet` } } }) as unknown as Admitted;
  const run = (state: WorkspaceState, ...actions: WorkspaceAction[]): WorkspaceState => actions.reduce(workspaceReducer, state);
  const act = (t: ViewTransition): WorkspaceAction => ({ type: "view.transition", view: "view-1", transition: t });
  const pick = (id: bigint) => ({ streamHandle: "s", batchSeq: 0, id, anchor: null });
  const standing = (): WorkspaceState =>
    run(
      initialWorkspaceState,
      { type: "resource.admitted", admitted: admittedOf("a") },
      act({ action: "selection.apply", params: { mode: "add", id: 1n, bounds: unit } }),
      act({ action: "selection.apply", params: { mode: "add", id: 2n, bounds: unit } }),
      act({ action: "inspect.set", params: { pick: pick(1n), bounds: unit } }),
      act({ action: "inspect.pin", params: { pinned: true } })
    );

  // RECORDED MUTATION for "UB4" (source change): in `endGeneration` (workspaceState.ts) leave the views as they are
  // (`if (views[id].resource === key) views[id] = views[id];`). Expected failure: the selection is still two members.
  // OBSERVED AT <X>: <pending>
  it("a source change ends the selection with the count dropped and the reason, clears and unpins the inspected feature, once", () => {
    const ended = run(standing(), { type: "resource.generationEnded", resource: "ds_a" });
    const view = ended.views["view-1"];
    expect(viewSelection(view).size).toBe(0);
    expect(viewSelectionNotice(view)).toEqual({ kind: "ended", reason: "source-changed", dropped: 2 });
    expect(viewInspected(view)).toBeNull();
    expect(viewPinned(view)).toBe(false);
    expect(ended.resources.ds_a.generationEnded).toBe(true);
    expect(run(ended, { type: "resource.generationEnded", resource: "ds_a" }), "a second end changes nothing").toBe(ended);
  });

  // RECORDED MUTATION for "UB4" (rebind): in `admit` (workspaceState.ts) carry the members across the rebind
  // (`const bound = view;`). Expected failure: the reopened view still holds its two members.
  // OBSERVED AT <X>: <pending>
  it("a reopen ends the selection with the count dropped and the reason reopened, whatever was open before", () => {
    const reopened = run(standing(), { type: "resource.admitted", admitted: admittedOf("b") });
    const view = reopened.views["view-1"];
    expect(view.resource).toBe("ds_b");
    expect(viewSelection(view).size).toBe(0);
    expect(viewSelectionNotice(view)).toEqual({ kind: "ended", reason: "reopened", dropped: 2 });
    expect(viewInspected(view)).toBeNull();
    expect(viewPinned(view)).toBe(false);
  });

  // RECORDED MUTATION for "UB4" (none when empty): in `applyViewTransition`'s `selection.end` case (viewTransitions.ts)
  // always build the notice (`const notice = { kind: "ended", reason, dropped };`). Expected failure: an empty selection
  // leaves a notice of 0 dropped.
  // OBSERVED AT <X>: <pending>
  it("with nothing selected there is no notice, and a reopen clears the notice a source change left", () => {
    const empty = run(initialWorkspaceState, { type: "resource.admitted", admitted: admittedOf("a") });
    const sourceChanged = run(empty, { type: "resource.generationEnded", resource: "ds_a" });
    expect(viewSelectionNotice(sourceChanged.views["view-1"])).toBeNull();
    expect(sourceChanged.views["view-1"], "nothing to end: the view is the same object").toBe(empty.views["view-1"]);

    const withNotice = run(standing(), { type: "resource.generationEnded", resource: "ds_a" });
    expect(viewSelectionNotice(withNotice.views["view-1"])).not.toBeNull();
    const reopened = run(withNotice, { type: "resource.admitted", admitted: admittedOf("b") });
    expect(viewSelectionNotice(reopened.views["view-1"])).toBeNull();
  });
});

describe("UB5: nothing but a selection transition or a generation end touches the members", () => {
  const view: ViewState = {
    id: "view-1",
    resource: "ds_a",
    filter: null,
    style: DEFAULT_STYLE_STATE,
    selection: members([1n, unit], [2n, box(5, 5, 6, 6)]),
  };
  const filter = { predicate: "zone = 'residential'", dialect: FILTER_DIALECT_DUCKDB_EXPR_0 };

  // RECORDED MUTATION for "UB5": in `applyViewTransition`'s `filter.apply` case (viewTransitions.ts) clear the selection
  // (`return { ...view, filter: transition.params.filter, selection: NO_MEMBERS };`). Expected failure: the members are gone
  // after the filter is applied.
  // OBSERVED AT <X>: <pending>
  it("filter.apply, style.set, tool.set, mode.set and the inspection leave the members as they were", () => {
    const transitions: ViewTransition[] = [
      { action: "filter.apply", params: { filter } },
      { action: "filter.apply", params: { filter: null } },
      { action: "style.set", params: { property: "fillColor", value: "#010203" } },
      { action: "tool.set", params: { tool: "select" } },
      { action: "mode.set", params: { mode: "remove" } },
      { action: "inspect.set", params: { pick: { streamHandle: "s", batchSeq: 0, id: 1n, anchor: null }, bounds: unit } },
      { action: "inspect.pin", params: { pinned: true } },
      { action: "inspect.set", params: null },
    ];
    let current = view;
    for (const t of transitions) {
      current = applyViewTransition(current, t);
      expect(viewSelection(current), t.action).toBe(view.selection);
    }
  });

  // RECORDED MUTATION for "UB5" (a view-box change): in `countSelection` (selection.ts) delete the outside members from the
  // map it was given (`for (const id of [...members.keys()]) if (!bboxesMeet(members.get(id)!, viewBox)) (members as Map<bigint, AuthoritativeBbox>).delete(id);`
  // before counting). Expected failure: a panned-away box leaves the selection smaller.
  // OBSERVED AT <X>: <pending>
  it("counting against another view box, and back, leaves the members and their count unchanged", () => {
    const held = view.selection as SelectionMembers;
    const near = countSelection(held, box(0, 0, 2, 2), new Set(), FACTS);
    const away = countSelection(held, box(100, 100, 200, 200), new Set(), FACTS);
    const back = countSelection(held, box(0, 0, 2, 2), new Set(), FACTS);
    expect(away).toEqual({ selected: 2, outsideView: 2, inViewNotDrawn: 0, reason: null });
    expect(back).toEqual(near);
    expect(ids(held)).toEqual([1n, 2n]);
  });
});
