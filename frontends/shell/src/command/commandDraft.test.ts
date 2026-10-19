// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it } from "vitest";

import { ACTIONS } from "../layout/actionRegistry";
import type { ActionEntry } from "../layout/actionRegistry";
import { commandBarKey, completionOf, resolveDraft } from "./commandDraft";
import type { BarKey, BarPos, BarState, Draft } from "./commandDraft";

/**
 * SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md section 4, UC1 and UC2 (PR A): the pure draft resolver and the one key reducer, over the real registry.
 * Each `it` is one row, so each carries the one recorded mutation the table names.
 */

const always = () => true;
const resolve = (text: string, available: (id: ActionEntry["id"]) => boolean = always): Draft => resolveDraft(text, ACTIONS, available);
const idsOf = (draft: Draft): string[] => ("candidates" in draft ? draft.candidates.map((c) => c.entry.id) : []);
const WITH_WORD = ACTIONS.filter((entry) => entry.command !== null);

// RECORDED MUTATION for "UC1" (PR A's half of the row): in `resolveDraft` make the plain search case-sensitive (`contains` compares without `toLowerCase`). Expected failure: ZOOM finds nothing.
// OBSERVED AT fa6715541ccdef4285503a2b9bd59ec9a44943dc: FAILED -- "UC1: an exact /word runs, a prefix lists by word, plain text matches label or word in registry order, ? gives help, and command.focus is out of search":
//   AssertionError: expected [] to deeply equal [ 'layer.zoomToLayer', …(1) ] (at the ZOOM search). Reverted after observing.
describe("UC1: resolveDraft", () => {
  it("UC1: an exact /word runs, a prefix lists by word, plain text matches label or word in registry order, ? gives help, and command.focus is out of search", () => {
    expect(resolve("")).toEqual({ kind: "empty" });
    expect(resolve("  ")).toEqual({ kind: "empty" });
    for (const entry of WITH_WORD) expect(resolve(`/${entry.command}`), entry.id).toEqual({ kind: "run", id: entry.id, available: true });
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

const KEYS: BarKey[] = ["Tab", "Enter", "Escape", "ArrowDown", "ArrowUp", "a"].flatMap((key) => [false, true].map((shiftKey) => ({ key, shiftKey, isComposing: false })));
const DRAFTS = ["", "/", "/lay", "/layers", "/zoom", "inspector", "?", "/zzz"];

/** Every state the bar can be in: each draft, the list open or closed, and no option active or each option active. */
function allStates(): BarState[] {
  return DRAFTS.flatMap((draft) => {
    const completions = idsOf(resolve(draft)).map((id) => completionOf(ACTIONS.find((entry) => entry.id === id) as ActionEntry));
    const actives = [null, ...completions.map((_, index) => index)];
    return [true, false].flatMap((open) => actives.map((active): BarState => ({ draft, open, active, completions })));
  });
}

/** The state after a step: the worst case for the next key, the list still offering the options it offered before. */
const after = (pos: BarPos, state: BarState): BarState => ({ ...pos, completions: state.completions });

// RECORDED MUTATION for "UC2": in `commandBarKey`'s Tab case return `open: true` instead of `open: false` (Tab reopens the list after completing). Expected failure: Tab leaves in at most two.
// OBSERVED AT fa6715541ccdef4285503a2b9bd59ec9a44943dc: FAILED -- "UC2: over every state Shift+Tab leaves in one press, Tab in at most two and never applies, Enter never completes, Escape closes the list and then leaves, and composing keys do nothing":
//   AssertionError: a second Tab leaves: {"draft":"/lay","open":true,"active":null}: expected [ true, 'none' ] to deeply equal [ false, 'none' ]. Reverted after observing.
describe("UC2: commandBarKey", () => {
  it("UC2: over every state Shift+Tab leaves in one press, Tab in at most two and never applies, Enter never completes, Escape closes the list and then leaves, and composing keys do nothing", () => {
    const states = allStates();
    expect(states.length, "the grid is not empty").toBeGreaterThan(30);
    for (const state of states) {
      const label = JSON.stringify({ draft: state.draft, open: state.open, active: state.active });
      const shiftTab = commandBarKey(state, { key: "Tab", shiftKey: true, isComposing: false });
      expect([shiftTab.preventDefault, shiftTab.effect.kind, shiftTab.pos.draft], `Shift+Tab leaves in one press: ${label}`).toEqual([false, "none", state.draft]);

      const first = commandBarKey(state, { key: "Tab", shiftKey: false, isComposing: false });
      expect(first.effect.kind, `Tab never applies: ${label}`).toBe("none");
      if (first.preventDefault) {
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
        expect([composing.pos, composing.effect.kind, composing.preventDefault], `composing ${key.key}: ${label}`).toEqual([{ draft: state.draft, open: state.open, active: state.active }, "none", false]);
      }
    }
  });
});
