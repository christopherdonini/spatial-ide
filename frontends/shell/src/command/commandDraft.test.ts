// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it } from "vitest";

import { ACTIONS } from "../layout/actionRegistry";
import type { ActionEntry } from "../layout/actionRegistry";
import { commandBarKey, completionOf, resolveDraft, typeDraft } from "./commandDraft";
import type { BarKey, BarPos, BarState, Draft } from "./commandDraft";

/**
 * SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md section 4, UC1 and UC2 (PR A): the pure draft resolver and the one key reducer, over the real registry.
 * Each `it` is one row, so each carries the one recorded mutation the table names.
 */

const always = () => true;
const resolve = (text: string, available: (id: ActionEntry["id"]) => boolean = always, caret?: number): Draft => resolveDraft(text, ACTIONS, available, caret);
const idsOf = (draft: Draft): string[] => ("candidates" in draft ? draft.candidates.map((c) => c.entry.id) : []);
const WITH_WORD = ACTIONS.filter((entry) => entry.command !== null);

// RECORDED MUTATION for "UC1" (PR A's half of the row): in `resolveDraft` make the plain search case-sensitive (`contains` compares without `toLowerCase`). Expected failure: ZOOM finds nothing.
// OBSERVED AT fa6715541ccdef4285503a2b9bd59ec9a44943dc: FAILED -- "UC1: an exact /word runs, a prefix lists by word, plain text matches label or word in registry order, ? gives help, and command.focus is out of search":
//   AssertionError: expected [] to deeply equal [ 'layer.zoomToLayer', …(1) ] (at the ZOOM search). Reverted after observing.
describe("UC1: resolveDraft", () => {
  it("UC1: an exact /word runs, a prefix lists by word, plain text matches label or word in registry order, ? gives help, and command.focus is out of search", () => {
    expect(resolve("")).toEqual({ kind: "empty" });
    expect(resolve("  ")).toEqual({ kind: "empty" });
    for (const entry of WITH_WORD.filter((e) => e.takes === "nothing")) expect(resolve(`/${entry.command}`), entry.id).toEqual({ kind: "run", id: entry.id, available: true });
    expect(resolve("/LAYERS")).toEqual({ kind: "run", id: "layout.toggleLayers", available: true });
    expect(resolve("/layers", (id) => id !== "layout.toggleLayers")).toEqual({ kind: "run", id: "layout.toggleLayers", available: false });

    const zoom = resolve("/zoom");
    expect(zoom.kind === "commands" && zoom.word).toBe("zoom");
    expect(idsOf(zoom)).toEqual(["layer.zoomToLayer", "selection.zoomTo"]);
    expect(idsOf(resolve("/"))).toEqual(WITH_WORD.map((entry) => entry.id));
    expect(resolve("/zzz")).toEqual({ kind: "unresolved", reason: "unknown-command" });
    expect(resolve("/layers x")).toEqual({ kind: "unresolved", reason: "unknown-command" });

    expect(idsOf(resolve("ZOOM"))).toEqual(["layer.zoomToLayer", "selection.zoomTo"]);
    expect(idsOf(resolve("inspector"))).toEqual(["layout.toggleInspector"]);
    expect(idsOf(resolve("selection"))).toEqual(["selection.zoomTo", "selection.clear"]);
    expect(idsOf(resolve("m-to")), "a word alone matches").toEqual(["layer.zoomToLayer", "selection.zoomTo"]);
    expect(idsOf(resolve("bar")), "command.focus has no word, so search leaves it out").toEqual([]);

    const help = resolve("?");
    expect(help.kind).toBe("help");
    expect(idsOf(help)).toEqual(ACTIONS.map((entry) => entry.id));
    expect(idsOf(resolve("?zoom"))).toEqual(["layer.zoomToLayer", "selection.zoomTo"]);
    expect(idsOf(resolve("?bar")), "help lists command.focus").toEqual(["command.focus"]);
    expect(completionOf(ACTIONS[0])).toBe("/layers");
    expect(completionOf(ACTIONS.find((entry) => entry.id === "command.focus") as ActionEntry)).toBeNull();

    const marked = resolve("?", (id) => id === "dataset.open");
    expect(marked.kind === "help" && marked.candidates.map((c) => c.available)).toEqual(ACTIONS.map((entry) => entry.id === "dataset.open"));
    const condition: ActionEntry = { ...ACTIONS[0], id: "layout.toggleActivity", command: "later", takes: "condition" };
    expect(resolveDraft("/later", [condition], always).kind, "a word that takes a condition does not run on its own").toBe("commands");
  });
});

// RECORDED MUTATION for "UC1 (/filter, PR B's half of the row)": in `resolveDraft` (commandDraft.ts) trim the condition it keeps (`text: split[3].trim()`). Expected failure: the byte-for-byte case.
describe("UC1 (PR B): /filter", () => {
  it("UC1: /filter keeps the condition after its word byte for byte, a whitespace-only condition is filter-empty, a word that takes nothing is not given a condition, and the @ trigger is read at the caret", () => {
    expect(idsOf(resolve("/filter")), "the word alone lists the entry that takes a condition").toEqual(["filter.addClause"]);
    expect(resolve("/fil")).toMatchObject({ kind: "commands", word: "fil" });
    const kept = `"zone"  =   'a  b' \t `;
    expect(resolve(`/filter   ${kept}`), "the first run of whitespace goes; the rest is kept").toEqual({ kind: "filter", id: "filter.addClause", available: true, text: kept, field: null });
    expect(resolve("/FILTER\tx")).toMatchObject({ kind: "filter", text: "x" });
    expect(resolve("/filter a = 1", () => false)).toMatchObject({ kind: "filter", available: false });
    expect(resolve("/filter    ")).toEqual({ kind: "unresolved", reason: "filter-empty" });
    expect(resolve("/filter \t ")).toEqual({ kind: "unresolved", reason: "filter-empty" });
    expect(resolve("/filt x")).toEqual({ kind: "unresolved", reason: "unknown-command" });
    expect(resolve("/layers x"), "a word that takes nothing takes no condition").toEqual({ kind: "unresolved", reason: "unknown-command" });
    expect(resolve("/filter @zo")).toMatchObject({ kind: "filter", text: "@zo", field: { start: 8, end: 11, partial: "zo" } });
    expect(resolve("/filter @zone = 1", always, 11)).toMatchObject({ field: { start: 8, end: 11, partial: "zo" } });
    expect(resolve("/filter a = 1")).toMatchObject({ field: null });
  });
});

const KEYS: BarKey[] =["Tab", "Enter", "Escape", "ArrowDown", "ArrowUp", "a"].flatMap((key) => [false, true].map((shiftKey) => ({ key, shiftKey, isComposing: false })));
const DRAFTS = ["", "/", "/lay", "/layers", "/zoom", "inspector", "?", "/zzz"];

/** Every state the bar can be in: each draft, the list open or closed (a closed list with one candidate among them), and no option active or each option active. */
function allStates(): BarState[] {
  return DRAFTS.flatMap((draft) => {
    const completions = idsOf(resolve(draft)).map((id) => completionOf(ACTIONS.find((entry) => entry.id === id) as ActionEntry));
    const actives = [null, ...completions.map((_, index) => index)];
    return [true, false].flatMap((open) => actives.map((active): BarState => ({ draft, open, active, completed: false, completions })));
  });
}

/** The state after a step: the worst case for the next key, the list still offering the options it offered before. */
const after = (pos: BarPos, state: BarState): BarState => ({ ...pos, completions: state.completions });

// RECORDED MUTATIONS for "UC2", each applied alone (the first was first observed at fa671554, against the reducer before correction round 1; all three are observed again here):
// (a) in `commandBarKey`'s Tab case return `open: true` instead of `open: false` (Tab reopens the list after completing). Expected failure: the list is not closed after Tab.
// (b) delete `state.completed || ` from the Tab guard (a second Tab completes again). Expected failure: Tab leaves in at most two.
// (c) put `!state.open` back in the Tab guard in place of `state.completed` (Tab never completes with the list closed). Expected failure: the closed list with one candidate.
// OBSERVED AT 31ae009b565a52357567f01a0eda51ca3658a2b9: FAILED -- "UC2: over every state Shift+Tab leaves in one press, Tab in at most two and never applies, Enter never completes, Escape closes the list and then leaves, and composing keys do nothing":
//   (a) AssertionError: Tab closes the list and sets completed: {"draft":"/","open":true,"active":0,"completed":false}: expected [ true, null, true ] to deeply equal [ false, null, true ];
//   (b) AssertionError: a second Tab leaves: {"draft":"/lay","open":true,"active":null,"completed":false}: expected [ true, 'none' ] to deeply equal [ false, 'none' ];
//   (c) AssertionError: Tab with the list closed completes the only candidate: expected [ Array(3) ] to deeply equal [ { draft: '/layers', …(3) }, …(2) ]. Each reverted after observing.
describe("UC2: commandBarKey", () => {
  it("UC2: over every state Shift+Tab leaves in one press, Tab in at most two and never applies, Enter never completes, Escape closes the list and then leaves, and composing keys do nothing", () => {
    const states = allStates();
    expect(states.length, "the grid is not empty").toBeGreaterThan(30);
    for (const state of states) {
      const label = JSON.stringify({ draft: state.draft, open: state.open, active: state.active, completed: state.completed });
      const shiftTab = commandBarKey(state, { key: "Tab", shiftKey: true, isComposing: false });
      expect([shiftTab.preventDefault, shiftTab.effect.kind, shiftTab.pos.draft], `Shift+Tab leaves in one press: ${label}`).toEqual([false, "none", state.draft]);

      const first = commandBarKey(state, { key: "Tab", shiftKey: false, isComposing: false });
      expect(first.effect.kind, `Tab never applies: ${label}`).toBe("none");
      if (first.preventDefault) {
        expect([first.pos.open, first.pos.active, first.pos.completed], `Tab closes the list and sets completed: ${label}`).toEqual([false, null, true]);
        const second = commandBarKey(after(first.pos, state), { key: "Tab", shiftKey: false, isComposing: false });
        expect([second.preventDefault, second.effect.kind], `a second Tab leaves: ${label}`).toEqual([false, "none"]);
      }

      const enter = commandBarKey(state, { key: "Enter", shiftKey: false, isComposing: false });
      expect(enter.pos.draft, `Enter never completes: ${label}`).toBe(state.draft);
      expect(["apply", "applyDraft"], label).toContain(enter.effect.kind);

      const escape = commandBarKey(state, { key: "Escape", shiftKey: false, isComposing: false });
      if (state.open) {
        expect([escape.pos.open, escape.pos.active, escape.effect.kind], `Escape closes the list first: ${label}`).toEqual([false, null, "none"]);
        expect(commandBarKey(after(escape.pos, state), { key: "Escape", shiftKey: false, isComposing: false }).effect.kind, `then leaves: ${label}`).toBe("leave");
      } else {
        expect(escape.effect.kind, `Escape leaves: ${label}`).toBe("leave");
      }

      for (const key of KEYS) {
        const composing = commandBarKey(state, { ...key, isComposing: true });
        expect([composing.pos, composing.effect.kind, composing.preventDefault], `composing ${key.key}: ${label}`).toEqual([{ draft: state.draft, open: state.open, active: state.active, completed: state.completed }, "none", false]);
      }
    }

    // The closed list with exactly one candidate (the human's OPEN-1 ruling: Tab completes the only candidate): it completes whether or not the list is open, and the next Tab leaves.
    const tab: BarKey = { key: "Tab", shiftKey: false, isComposing: false };
    const closedOne = states.find((state) => state.draft === "/lay" && !state.open && state.active === null)!;
    expect(closedOne.completions, "the grid holds a closed list with one candidate").toEqual(["/layers"]);
    const completed = commandBarKey(closedOne, tab);
    expect([completed.pos, completed.preventDefault, completed.effect.kind], "Tab with the list closed completes the only candidate").toEqual([{ draft: "/layers", open: false, active: null, completed: true }, true, "none"]);
    expect(commandBarKey(after(completed.pos, closedOne), tab).preventDefault, "and the next Tab leaves").toBe(false);
    const closedMany = states.find((state) => state.draft === "/zoom" && !state.open && state.active === null)!;
    expect(commandBarKey(closedMany, tab).preventDefault, "a closed list with several candidates and none active: Tab leaves").toBe(false);
  });
});

// RECORDED MUTATION for "UC2 (ArrowDown after a completion, SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md Amendment 7 item 5)": in `commandBarKey` (commandDraft.ts) delete `|| state.completed` from the ArrowDown case's guard. Expected failure: ArrowDown reopens the list after a completion.
describe("UC2 (PR B): after a completion the list stays closed until the next typed character", () => {
  it("UC2: after a completion ArrowDown and ArrowUp do not reopen the list, and the next typed character lets them open it again", () => {
    const completed = allStates().filter((state) => state.completions.length > 0).map((state): BarState => ({ ...state, open: false, active: null, completed: true }));
    expect(completed.length, "the grid is not empty").toBeGreaterThan(5);
    for (const state of completed) {
      for (const key of ["ArrowDown", "ArrowUp"]) {
        const step = commandBarKey(state, { key, shiftKey: false, isComposing: false });
        expect([step.pos.open, step.pos.active, step.effect.kind, step.preventDefault], `${key} after a completion: ${state.draft}`).toEqual([false, null, "none", false]);
      }
    }
    const typed: BarState = { ...typeDraft("/lay"), completions: ["/layers"] };
    expect(commandBarKey(typed, { key: "ArrowDown", shiftKey: false, isComposing: false }).pos, "typing clears completed, so ArrowDown opens the list").toMatchObject({ open: true, active: 0 });
  });
});
