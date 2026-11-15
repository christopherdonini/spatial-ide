// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it } from "vitest";

import { FILTER_DIALECT_DUCKDB_EXPR_0 } from "../skp/types";
import { DEFAULT_STYLE_STATE, type StyleState } from "../style/document";
import { combineClauses, proposeClauseChange } from "./filterClauses";
import type { ClauseId, ClauseRequest } from "./filterClauses";
import {
  applyViewTransition,
  styleTransitions,
  viewClauses,
  viewInspected,
  viewNextClauseNumber,
  viewPinned,
  viewSelectionMode,
  viewTool,
  type ViewTransition,
} from "./viewTransitions";
import type { ViewState } from "./workspaceState";

/** SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md section 4, UA4: the typed transitions of a view, phase A. */
const view: ViewState = { id: "view-1", resource: "ds_a", filter: null, style: DEFAULT_STYLE_STATE };
const deepFreeze = <T extends object>(value: T): T => {
  for (const inner of Object.values(value)) if (typeof inner === "object" && inner !== null) deepFreeze(inner);
  return Object.freeze(value);
};
const edited: StyleState = { fillColor: "#112233", fillOpacity: 0.5, outlineColor: "#ffffff", outlineWidth: 4 };
const box = (xmin: number, ymin: number, xmax: number, ymax: number) => ({ xmin, ymin, xmax, ymax });
const pickOf = (id: bigint) => ({ streamHandle: "stream-1", batchSeq: 0, id, anchor: [0, 0] as [number, number] });

// RECORDED MUTATION for "UA4": make `styleTransitions` (viewTransitions.ts) return one transition for the whole edit
// (`return out.length > 1 ? out.slice(0, 1) : out;`). Expected failure: the count assertion, 4 transitions expected and 1 received.
// OBSERVED AT deab7dc96d06bf3e329527d3ae95415dcd65152b: FAILED -- "emits one style.set per changed property, none when nothing changed, and the width as {value, unit}":
//   AssertionError: expected [ 'fillColor' ] to deeply equal [ 'fillColor', 'fillOpacity', …(2) ]. Reverted after observing.
describe("UA4: transitions are pure and typed, and a style edit is one transition per changed property", () => {
  it("applies filter.apply and style.set without writing to a frozen view, returning a new one", () => {
    const frozen = deepFreeze(structuredClone(view));
    const filter = { predicate: "zone = 'residential'", dialect: FILTER_DIALECT_DUCKDB_EXPR_0 };
    const withFilter = applyViewTransition(frozen, { action: "filter.apply", params: { filter } });
    expect(withFilter).not.toBe(frozen);
    expect(withFilter.filter).toBe(filter);
    expect(frozen.filter).toBeNull();
    const withWidth = applyViewTransition(frozen, {
      action: "style.set",
      params: { property: "outlineWidth", value: { value: 6, unit: "px" } },
    });
    expect(withWidth.style.outlineWidth).toBe(6);
    expect(frozen.style).toEqual(DEFAULT_STYLE_STATE);
  });

  // RECORDED MUTATION for "UA4 (phase B: the union)": delete the `inspect.pin` case of `applyViewTransition` (viewTransitions.ts).
  // Expected failure: the sample for `inspect.pin` is not applied. (The table's completeness is tsc's.)
  // OBSERVED AT feaa43d329e6d900b6ae672547569f1b591e3052: FAILED -- "the union is exactly section 2.4's nine names, and every one of them is applied":
  //   AssertionError: inspect.pin is applied: expected undefined to be defined. Reverted after observing.
  // The union gained `filter.clauses.set` (SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md Amendment 3 item 7, UC7's declared edit); the mutation above (delete the `inspect.pin` case) is observed again beside the first:
  // OBSERVED AGAIN AT 9a9d1849f3dead11891642b95fe4a4ff0bffc76c: FAILED -- "the union is exactly section 2.4's nine names and milestone 3's filter.clauses.set, and every one of them is applied":
  //   AssertionError: inspect.pin is applied: expected undefined to be defined. Reverted after observing.
  it("the union is exactly section 2.4's nine names and milestone 3's filter.clauses.set, and every one of them is applied", () => {
    // `satisfies` over the union's own names is what makes this table complete: tsc fails on a missing or an extra name.
    const samples = {
      "filter.apply": { action: "filter.apply", params: { filter: null } },
      "filter.clauses.set": { action: "filter.clauses.set", params: { clauses: [], step: { kind: "remove", clause: "clause-1" } } },
      "style.set": { action: "style.set", params: { property: "fillOpacity", value: 0.25 } },
      "tool.set": { action: "tool.set", params: { tool: "select" } },
      "mode.set": { action: "mode.set", params: { mode: "replace" } },
      "selection.apply": { action: "selection.apply", params: { mode: "add", id: 1n, bounds: box(0, 0, 1, 1), row: null, filter: null } },
      "selection.clear": { action: "selection.clear", params: {} },
      "selection.end": { action: "selection.end", params: { reason: "reopened", dropped: 1 } },
      "inspect.set": { action: "inspect.set", params: { pick: pickOf(1n), bounds: box(0, 0, 1, 1), row: null } },
      "inspect.pin": { action: "inspect.pin", params: { pinned: true } },
    } satisfies { [A in ViewTransition["action"]]: Extract<ViewTransition, { action: A }> };
    expect(Object.keys(samples).sort()).toEqual([
      "filter.apply", "filter.clauses.set", "inspect.pin", "inspect.set", "mode.set", "selection.apply",
      "selection.clear", "selection.end", "style.set", "tool.set",
    ]);
    for (const transition of Object.values(samples)) {
      const next = applyViewTransition(view, transition);
      expect(next, `${transition.action} is applied`).toBeDefined();
      expect(next.id).toBe("view-1");
    }
  });

  it("emits one style.set per changed property, none when nothing changed, and the width as {value, unit}", () => {
    const changes = styleTransitions(DEFAULT_STYLE_STATE, edited);
    expect(changes.map((t) => t.params.property)).toEqual(["fillColor", "fillOpacity", "outlineColor", "outlineWidth"]);
    expect(changes.every((t) => t.action === "style.set")).toBe(true);
    expect(changes[3].params.value).toEqual({ value: 4, unit: "px" });
    expect(styleTransitions(edited, { ...edited, outlineColor: "#000000" })).toHaveLength(1);
    expect(styleTransitions(edited, edited)).toEqual([]);
  });

  it("applying a style edit's transitions in order yields the next style", () => {
    const result = styleTransitions(DEFAULT_STYLE_STATE, edited).reduce(applyViewTransition, view);
    expect(result.style).toEqual(edited);
  });
});

/** Tool, mode and inspection transitions (section 2.2, 2.4; Amendment 1 A5). Rows UB-TI1 and UB-TI2 are not in the form's
 * table: they cover the state the form's ViewState gains, each with its own mutation. */
describe("UB-TI1: tool.set and mode.set set their own member, and an equal setting returns the same view", () => {
  // RECORDED MUTATION for "UB-TI1": in `applyViewTransition`'s `tool.set` case (viewTransitions.ts) ignore the param (`return { ...view, tool: "navigate" };`).
  // Expected failure: the tool stays navigate.
  // OBSERVED AT feaa43d329e6d900b6ae672547569f1b591e3052: FAILED -- "sets the tool and the mode, each leaving the other alone":
  //   AssertionError: expected 'navigate' to be 'select' // Object.is equality. Reverted after observing.
  it("sets the tool and the mode, each leaving the other alone", () => {
    const selecting = applyViewTransition(view, { action: "tool.set", params: { tool: "select" } });
    expect(viewTool(selecting)).toBe("select");
    expect(viewSelectionMode(selecting)).toBe("toggle");
    const replacing = applyViewTransition(selecting, { action: "mode.set", params: { mode: "replace" } });
    expect(viewSelectionMode(replacing)).toBe("replace");
    expect(viewTool(replacing)).toBe("select");
    expect(applyViewTransition(replacing, { action: "mode.set", params: { mode: "replace" } })).toBe(replacing);
    expect(applyViewTransition(view, { action: "tool.set", params: { tool: "navigate" } }), "the default again").toBe(view);
  });
});

describe("UB-TI2: inspection and its pin", () => {
  // RECORDED MUTATION for "UB-TI2": in `applyViewTransition`'s `inspect.pin` case (viewTransitions.ts) pin without a standing feature (`const pinned = transition.params.pinned;`).
  // Expected failure: a view with nothing inspected is pinned.
  // OBSERVED AT feaa43d329e6d900b6ae672547569f1b591e3052: FAILED -- "stores the pick and its bounds, pins only a standing feature, and null clears and unpins":
  //   AssertionError: nothing to pin: expected true to be false // Object.is equality. Reverted after observing.
  it("stores the pick and its bounds, pins only a standing feature, and null clears and unpins", () => {
    const a = pickOf(7n);
    const inspected = applyViewTransition(view, { action: "inspect.set", params: { pick: a, bounds: box(0, 0, 2, 2), row: null } });
    expect(viewInspected(inspected)).toEqual({ pick: a, bounds: box(0, 0, 2, 2), row: null });
    expect(viewPinned(applyViewTransition(view, { action: "inspect.pin", params: { pinned: true } })), "nothing to pin").toBe(false);
    const pinned = applyViewTransition(inspected, { action: "inspect.pin", params: { pinned: true } });
    expect(viewPinned(pinned)).toBe(true);
    const unpinned = applyViewTransition(pinned, { action: "inspect.pin", params: { pinned: false } });
    expect(viewPinned(unpinned)).toBe(false);
    expect(viewInspected(unpinned), "unpinning leaves the inspected feature").toEqual(viewInspected(pinned));
    const cleared = applyViewTransition(pinned, { action: "inspect.set", params: null });
    expect(viewInspected(cleared)).toBeNull();
    expect(viewPinned(cleared)).toBe(false);
    expect(applyViewTransition(cleared, { action: "inspect.set", params: null }), "clearing nothing").toBe(cleared);
  });
});

/** A seeded generator (mulberry32), so a failing sequence replays. */
function seeded(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const TEXTS = ["a = 1", "\"zone\" = 'r'", " b IS NULL ", "c IN (1, 2)", "a = 1 OR b = 2", "d LIKE '%)%'", "x"];
const filterOfText = (predicate: string) => ({ predicate, dialect: FILTER_DIALECT_DUCKDB_EXPR_0 });

// RECORDED MUTATION for "UC7": in `applyViewTransition`'s `filter.clauses.set` case (viewTransitions.ts) leave `filter` unchanged for a `setEnabled` step (`filter: transition.params.step.kind === "setEnabled" ? view.filter : combineClauses(clauses)`). Expected failure: the invariant.
// OBSERVED AT 9a9d1849f3dead11891642b95fe4a4ff0bffc76c: FAILED -- "UC7: filter.apply sets one clause or none, filter.clauses.set carries the step, and view.filter equals combineClauses(clauses) after every transition of 2,000 seeded sequences":
//   AssertionError: seed 1, step 1: filter is the combination of the clauses: expected { predicate: 'a = 1', …(1) } to deeply equal null. Reverted after observing.
describe("UC7: clause transitions are pure, and the view's filter is the combination of its clauses after every transition", () => {
  it("UC7: filter.apply sets one clause or none, filter.clauses.set carries the step, and view.filter equals combineClauses(clauses) after every transition of 2,000 seeded sequences", () => {
    const frozen = deepFreeze(structuredClone(view));
    const one = applyViewTransition(frozen, { action: "filter.apply", params: { filter: filterOfText(" a = 1 ") } });
    expect(viewClauses(one), "an Apply holds its predicate as one new enabled card").toEqual([{ id: "clause-1", text: " a = 1 ", enabled: true }]);
    expect(viewClauses(frozen), "the input is not written").toEqual([]);
    expect(viewClauses(applyViewTransition(one, { action: "filter.apply", params: { filter: null } })), "a Clear leaves none").toEqual([]);
    const second = applyViewTransition(one, { action: "filter.apply", params: { filter: filterOfText("b = 2") } });
    expect(viewClauses(second).map((c) => c.id), "an Apply replaces the cards with one, under a new id").toEqual(["clause-2"]);
    const set = applyViewTransition(second, { action: "filter.clauses.set", params: { clauses: [{ id: "clause-7", text: "c = 3", enabled: true }], step: { kind: "add", clause: "clause-7" } } });
    expect([set.filter?.predicate, viewNextClauseNumber(set)], "the counter passes the highest id held").toEqual(["c = 3", 8]);

    let sequences = 0;
    for (let seed = 1; seed <= 2000; seed += 1) {
      const next = seeded(seed);
      const pick = <T,>(items: readonly T[]): T => items[Math.floor(next() * items.length)];
      let current: ViewState = deepFreeze(structuredClone(view));
      for (let step = 0; step < 8; step += 1) {
        const roll = next();
        let transition: ViewTransition | null = null;
        if (roll < 0.15) transition = { action: "filter.apply", params: { filter: next() < 0.3 ? null : filterOfText(pick(TEXTS)) } };
        else {
          const held = viewClauses(current);
          let n = viewNextClauseNumber(current);
          const mintId = (): ClauseId => `clause-${n++}`;
          const request: ClauseRequest =
            held.length === 0 || roll < 0.45
              ? { kind: "add", text: pick(TEXTS) }
              : roll < 0.8
                ? { kind: "setEnabled", clause: pick(held).id, enabled: next() < 0.5 }
                : { kind: "remove", clause: pick(held).id };
          const proposal = proposeClauseChange(held, request, mintId);
          if (proposal.kind === "propose") transition = { action: "filter.clauses.set", params: { clauses: proposal.clauses, step: proposal.step } };
        }
        if (transition === null) continue;
        current = deepFreeze(applyViewTransition(current, transition));
        expect(current.filter, `seed ${seed}, step ${step}: filter is the combination of the clauses`).toEqual(combineClauses(viewClauses(current)));
        expect(new Set(viewClauses(current).map((c) => c.id)).size, `seed ${seed}, step ${step}: ids are unique`).toBe(viewClauses(current).length);
      }
      sequences += 1;
    }
    expect(sequences).toBe(2000);
  });
});
