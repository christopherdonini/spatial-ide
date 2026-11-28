// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * SHELL-MIGRATION-MILESTONE-5-PREREGISTRATION.md section 2.2 and section 4 (C-U1 to C-U8), as Amendments 2, 4 and 6 leave them: the
 * condition store (seam 8), driven as a pure reducer. Every case that raises dispatches `opened(R)` first, except C-U6a's fresh-state case
 * (Amendment 4, D-1). Nothing here is mocked, and no case reads a display text to decide anything: the store never does.
 */

import { describe, expect, it } from "vitest";

import { CONDITION_ROUTES, attentionOf, conditionsReducer, initialConditionsState, ordered, visibleFor } from "./conditions";
import type { Condition, ConditionRoute, ConditionTarget, ConditionsEvent, ConditionsState } from "./conditions";
import { CONDITIONS_MAX } from "./conditionsConstants";

const R = "ds_r";
const R2 = "ds_r2";
const R3 = "ds_r3";
const VIEW_1: ConditionTarget = { kind: "view", view: "view-1" };
const VIEW_2: ConditionTarget = { kind: "view", view: "view-2" };
const RESOURCE: ConditionTarget = { kind: "resource" };

const fold = (events: readonly ConditionsEvent[], from: ConditionsState = initialConditionsState): ConditionsState => events.reduce(conditionsReducer, from);
const opened = (resource: string): ConditionsEvent => ({ type: "opened", resource });
const text = (value: string) => ({ kind: "text", text: value }) as const;

/** The target a route is raised on, as section 2.2's table has it. */
function targetOf(route: ConditionRoute): ConditionTarget {
  return CONDITION_ROUTES.find((entry) => entry.route === route)!.target === "view" ? VIEW_1 : RESOURCE;
}
function raise(route: ConditionRoute, code: string, over: Partial<Extract<ConditionsEvent, { type: "raise" }>> = {}): ConditionsEvent {
  return { type: "raise", route, code, ordinal: null, target: targetOf(route), generation: R, display: text(`${route}: ${code}`), ...over };
}
const sessionEnded = (generation: string = R): ConditionsEvent =>
  raise("session-ended", "engine.source_changed", { generation, display: { kind: "refusal", refusal: { code: "engine.source_changed", message: "m", fields: [] } } });

const all = (state: ConditionsState): Condition[] => Object.values(state.byId);
const shown = (state: ConditionsState, view: `view-${number}` | null = "view-1", resource: string = R): Condition[] => ordered(visibleFor(state, { view, resource }));
const codesOf = (list: readonly Condition[]): string[] => list.map((condition) => condition.reason.code);

describe("conditions: the routes table (C-U1)", () => {
  // RECORDED MUTATION for C-U1: in `conditions.ts`'s routes table give the `stream-terminal` route `replaced-by-owner` among its `ends`.
  // Expected failure: the table is not whole, and an urgency-2 route declares a replacement. Also fails C-U6 (a stream-terminal batch is then accepted, not refused whole).
  // OBSERVED AT a17db128abecd0764977cf0ba5bfc44e48ae898f: FAILED -- "C-U1: the routes table is whole, as section 2.2; no urgency 1 or 2 route declares replaced-by-owner; Condition has no remedy member": AssertionError: expected [ [ 'session-ended', …(4) ], …(6) ] to deeply equal [ [ 'session-ended', …(4) ], …(6) ]. Also failed: C-U6. Reverted after observing.
  // OBSERVED 2026-11-24 at 7c18e29f, the same mutation run again at the head that holds the fix of C-1 (ADV-2026-11-24-06 item 2): FAILED -- this test; also failed: C-U6; C-U3 did not fail. Reverted after observing.
  it("C-U1: the routes table is whole, as section 2.2; no urgency 1 or 2 route declares replaced-by-owner; Condition has no remedy member", () => {
    expect(CONDITION_ROUTES.map((entry) => [entry.route, entry.owner, entry.target, entry.urgency, [...entry.ends]])).toEqual([
      ["session-ended", "session", "resource", 1, ["next-open"]],
      ["canvas-ceiling", "canvas", "view", 2, ["dismissed", "next-open"]],
      ["stream-terminal", "stream", "view", 2, ["dismissed", "next-open"]],
      ["viewport-refusal", "viewport", "view", 2, ["dismissed", "owner-cleared", "next-open"]],
      ["record-notice", "recording", "view", 3, ["replaced-by-owner", "next-open"]],
      ["save-notice", "project", "resource", 3, ["replaced-by-owner", "next-open"]],
      ["reopen-notice", "project", "resource", 3, ["next-open"]],
    ]);
    for (const entry of CONDITION_ROUTES) {
      if (entry.urgency <= 2) expect(entry.ends as readonly string[], entry.route).not.toContain("replaced-by-owner");
    }
    const condition = {} as Condition;
    // @ts-expect-error -- a condition carries no remedy member: no remedy is invented (plan section 9)
    void condition.remedy;
    // @ts-expect-error -- nor an action member
    void condition.action;
  });
});

describe("conditions: the strip's top, and the count of the others (C-U2)", () => {
  // RECORDED MUTATION for C-U2: in `ordered` sort the seq descending (newest first) within an urgency. Expected failure: the order of the two refusals.
  // OBSERVED AT a17db128abecd0764977cf0ba5bfc44e48ae898f: FAILED -- "C-U2: urgency first, then oldest; others is n - 1; an empty list gives null": AssertionError: expected [ 'engine.source_changed', 'b', …(2) ] to deeply equal [ 'engine.source_changed', 'a', …(2) ]. Also failed: C-U3, C-U7. Reverted after observing.
  it("C-U2: urgency first, then oldest; others is n - 1; an empty list gives null", () => {
    const state = fold([opened(R), raise("reopen-notice", "n1", { ordinal: 0 }), raise("stream-terminal", "a"), raise("stream-terminal", "b"), sessionEnded()]);
    const list = shown(state);
    expect(codesOf(list)).toEqual(["engine.source_changed", "a", "b", "n1"]);
    expect(attentionOf(list)).toEqual({ top: list[0], others: 3 });
    const refusals = shown(fold([opened(R), raise("stream-terminal", "a"), raise("stream-terminal", "b")]));
    expect(attentionOf(refusals)?.top.reason.code).toBe("a");
    expect(attentionOf(refusals)?.others).toBe(1);
    expect(attentionOf([])).toBeNull();
  });

  // RECORDED MUTATION for C-U2b: in `ordered` (conditions.ts) order urgency 3 by `seq` alone, as C-U2 does for every urgency. Expected failure: the reopen notices come first, before the save's two lines. Also fails C-A8.
  // OBSERVED AT 12f326aa0004fc112a0ecfb37c10d710653f2a9c (2026-11-28): FAILED -- "C-U2b: within urgency 3 the route raised most recently comes first, and each route keeps its own raise order; urgency 2 is unchanged": AssertionError: expected [ 'stream-terminal#null', …(4) ] to deeply equal [ 'stream-terminal#null', …(4) ]. Also failed: C-A8 (App.conditions.test.tsx). Reverted after observing.
  // RECORDED MUTATION for C-U2b, the second (Amendment 17 item 5): in `ordered` sort the seq descending (newest first) for every urgency. Expected failure: the order within each route flips. Also fails C-U2.
  // OBSERVED AT 12f326aa0004fc112a0ecfb37c10d710653f2a9c (2026-11-28): FAILED -- "C-U2b: within urgency 3 the route raised most recently comes first, and each route keeps its own raise order; urgency 2 is unchanged": AssertionError: expected [ 'stream-terminal#null', …(4) ] to deeply equal [ 'stream-terminal#null', …(4) ]. Also failed: C-U2, C-U3, C-U7. Reverted after observing.
  it("C-U2b: within urgency 3 the route raised most recently comes first, and each route keeps its own raise order; urgency 2 is unchanged", () => {
    const state = fold([
      opened(R),
      raise("reopen-notice", "project.reopen_notice", { ordinal: 0 }),
      raise("reopen-notice", "project.reopen_notice", { ordinal: 1 }),
      raise("stream-terminal", "a"),
      { type: "replaceBatch", route: "save-notice", code: "project.save_notice", target: RESOURCE, generation: R, displays: [text("save 0"), text("save 1")] },
    ]);
    const place = (condition: Condition): string => `${condition.reason.route}#${condition.reason.ordinal}`;
    expect(shown(state).map(place)).toEqual(["stream-terminal#null", "save-notice#0", "save-notice#1", "reopen-notice#0", "reopen-notice#1"]);
    // A route raised again goes first: a second save's batch replaces the first, and a refused step's notice is raised after it.
    const later = fold([
      { type: "replaceBatch", route: "save-notice", code: "project.save_notice", target: RESOURCE, generation: R, displays: [text("save 0 again")] },
      { type: "replaceBatch", route: "record-notice", code: "step-record-style", target: VIEW_1, generation: R, displays: [text("not recorded")] },
    ], state);
    expect(shown(later).map(place)).toEqual(["stream-terminal#null", "record-notice#null", "save-notice#0", "reopen-notice#0", "reopen-notice#1"]);
    expect(attentionOf(shown(later))?.top.reason.code).toBe("a");
  });
});

describe("conditions: a newer raise never ends an older blocker or refusal (C-U3)", () => {
  // RECORDED MUTATION for C-U3: in `raise` end every condition of the same target before minting. Expected failure: refusal A does not stand.
  // OBSERVED AT a17db128abecd0764977cf0ba5bfc44e48ae898f: FAILED -- "C-U3: refusals A and B (stream-terminal, one view and generation, two codes), a notice, then session ended: all four stand, and the top goes from A to session ended": AssertionError: expected [ 'b', 'n' ] to deeply equal [ 'a', 'b', 'n' ]. Also failed: C-U2, C-U5, C-U6, C-U7, C-U7a, C-U7b, C-U7c, C-U8. Reverted after observing.
  it("C-U3: refusals A and B (stream-terminal, one view and generation, two codes), a notice, then session ended: all four stand, and the top goes from A to session ended", () => {
    const before = fold([opened(R), raise("stream-terminal", "a"), raise("stream-terminal", "b"), raise("reopen-notice", "n", { ordinal: 0 })]);
    expect(codesOf(shown(before))).toEqual(["a", "b", "n"]);
    expect(attentionOf(shown(before))?.top.reason.code).toBe("a");

    const after = conditionsReducer(before, sessionEnded());
    expect(codesOf(shown(after))).toEqual(["engine.source_changed", "a", "b", "n"]);
    expect(attentionOf(shown(after))?.top.reason.code).toBe("engine.source_changed");
    expect(all(after)).toHaveLength(4);
  });
});

describe("conditions: a view's condition is absent from another view of the same source (C-U4)", () => {
  // RECORDED MUTATION for C-U4: in `visibleFor` drop the target test, so a condition matches on its generation alone. Expected failure: view-2 lists the view-1 condition.
  // OBSERVED AT a17db128abecd0764977cf0ba5bfc44e48ae898f: FAILED -- "C-U4: view-1's condition is absent from visibleFor({view-2, R}); the resource's is present in both; another generation's is absent": AssertionError: expected [ 'a', 'engine.source_changed' ] to deeply equal [ 'engine.source_changed' ]. Reverted after observing.
  // OBSERVED 2026-11-24 at 7c816dd4, `visibleFor`'s generation clause alone removed (conditions.ts): FAILED -- this test, at its third expect, the R2 line: `expected [ { id: 'condition-1', …(9) }, …(1) ] to deeply equal []`; App.conditions.test.tsx (12 passed) and App.lateResult.test.tsx (22 passed) passed. That expect is the clause's pin (ADV-2026-11-24-09 item 2); the recorded mutation above is unchanged.
  it("C-U4: view-1's condition is absent from visibleFor({view-2, R}); the resource's is present in both; another generation's is absent", () => {
    const state = fold([opened(R), raise("stream-terminal", "a", { target: VIEW_1 }), sessionEnded()]);
    expect(codesOf(visibleFor(state, { view: "view-1", resource: R }))).toEqual(expect.arrayContaining(["a", "engine.source_changed"]));
    expect(codesOf(visibleFor(state, { view: "view-2", resource: R }))).toEqual(["engine.source_changed"]);
    expect(visibleFor(state, { view: "view-1", resource: R2 })).toEqual([]);
    expect(visibleFor(state, { view: "view-1", resource: null })).toEqual([]);
  });
});

describe("conditions: no merge by display text (C-U5)", () => {
  // RECORDED MUTATION for C-U5: in `raise` match an existing condition by its display text instead of by the identity key. Expected failure: equal texts under different codes merge.
  // OBSERVED AT a17db128abecd0764977cf0ba5bfc44e48ae898f: FAILED -- "C-U5: equal text with different keys gives two conditions; the same key with different text gives one, occurrences 2, first kept": AssertionError: expected [ { id: 'condition-1', …(9) } ] to have a length of 2 but got 1. Reverted after observing.
  it("C-U5: equal text with different keys gives two conditions; the same key with different text gives one, occurrences 2, first kept", () => {
    const twoKeys = fold([opened(R), raise("stream-terminal", "a", { display: text("same words") }), raise("stream-terminal", "b", { display: text("same words") })]);
    expect(all(twoKeys)).toHaveLength(2);
    expect(all(twoKeys).map((condition) => condition.occurrences)).toEqual([1, 1]);

    const oneKey = fold([opened(R), raise("stream-terminal", "a", { display: text("first words") }), raise("stream-terminal", "a", { display: text("later words") })]);
    expect(all(oneKey)).toHaveLength(1);
    const [only] = all(oneKey);
    expect(only.occurrences).toBe(2);
    expect(only.first).toEqual(text("first words"));
    expect(only.latest).toEqual(text("later words"));
    expect(only.seq, "the seq is the raise order of first").toBe(0);
  });

  it("C-U5: the key carries the target, the ordinal and the generation too", () => {
    const state = fold([
      opened(R),
      raise("stream-terminal", "a", { target: VIEW_1 }),
      raise("stream-terminal", "a", { target: VIEW_2 }),
      raise("reopen-notice", "n", { ordinal: 0 }),
      raise("reopen-notice", "n", { ordinal: 1 }),
    ]);
    expect(all(state)).toHaveLength(4);
    expect(all(state).every((condition) => condition.occurrences === 1)).toBe(true);
  });
});

describe("conditions: how a condition ends (C-U6)", () => {
  // RECORDED MUTATION for C-U6: in `opened` end nothing (keep every condition). Expected failure: the conditions of the earlier open stand after the next one.
  // OBSERVED AT a17db128abecd0764977cf0ba5bfc44e48ae898f: FAILED -- "C-U6: dismiss ends one; opened(R2) ends all not in R2; owner-clear only on viewport-refusal; replacement only on notice routes": AssertionError: expected [ { id: 'condition-1', …(9) }, …(3) ] to deeply equal []. Also failed: C-U7a. Reverted after observing.
  it("C-U6: dismiss ends one; opened(R2) ends all not in R2; owner-clear only on viewport-refusal; replacement only on notice routes", () => {
    const base = fold([opened(R), raise("stream-terminal", "a"), raise("stream-terminal", "b"), raise("viewport-refusal", "v"), sessionEnded()]);
    const idOf = (state: ConditionsState, code: string) => all(state).find((condition) => condition.reason.code === code)!.id;

    const dismissed = conditionsReducer(base, { type: "dismiss", id: idOf(base, "a") });
    expect(codesOf(all(dismissed))).toEqual(["b", "v", "engine.source_changed"]);
    expect(all(conditionsReducer(base, { type: "dismiss", id: idOf(base, "engine.source_changed") })), "a route that declares no dismissal is not dismissed").toHaveLength(4);
    expect(conditionsReducer(base, { type: "dismiss", id: "condition-999" })).toBe(base);

    const cleared = conditionsReducer(base, { type: "ownerClear", route: "viewport-refusal", target: VIEW_1, generation: R });
    expect(codesOf(all(cleared))).toEqual(["a", "b", "engine.source_changed"]);
    const clearedOther = conditionsReducer(base, { type: "ownerClear", route: "stream-terminal", target: VIEW_1, generation: R });
    expect(all(clearedOther), "stream-terminal declares no owner-clear").toHaveLength(4);
    expect(all(conditionsReducer(base, { type: "ownerClear", route: "viewport-refusal", target: VIEW_2, generation: R })), "another view's clear ends nothing").toHaveLength(4);

    const replaced = conditionsReducer(base, { type: "replaceBatch", route: "stream-terminal", code: "x", target: VIEW_1, generation: R, displays: [text("x")] });
    expect(all(replaced), "stream-terminal declares no replacement: the batch is refused whole").toHaveLength(4);

    const next = conditionsReducer(base, opened(R2));
    expect(all(next)).toEqual([]);
    expect(next.current).toBe(R2);
    const again = conditionsReducer(base, opened(R));
    expect(all(again), "an open of the same generation ends nothing of it").toHaveLength(4);
  });
});

describe("conditions: a raise under another generation is dropped (C-U6a)", () => {
  // RECORDED MUTATION for C-U6a: in `raise` delete the generation drop. Expected failure: the stale raise mints. Also fails C-U7b.
  // OBSERVED AT a17db128abecd0764977cf0ba5bfc44e48ae898f: FAILED -- "C-U6a: after opened(R) a raise under R2, and in a fresh state a raise before any opened, leave byId, nextId, nextSeq and notKept unchanged": AssertionError: expected { 'condition-1': { …(10) }, …(1) } to deeply equal { 'condition-1': { …(10) } }. Also failed: C-U7b. Reverted after observing.
  // OBSERVED 2026-11-24 at 7c816dd4: FAILED -- "C-U6a: after opened(R) a raise under R2, and in a fresh state a raise before any opened, leave byId, nextId, nextSeq and notKept unchanged": AssertionError: expected { 'condition-1': { …(10) }, …(1) } to deeply equal { 'condition-1': { …(10) } }. Also failed: C-U7b (AssertionError: expected 1 to be +0). The mutation is the first line of `raise` alone (`if (event.generation !== state.current) return state;`). Reverted after observing.
  it("C-U6a: after opened(R) a raise under R2, and in a fresh state a raise before any opened, leave byId, nextId, nextSeq and notKept unchanged", () => {
    const state = fold([opened(R), raise("stream-terminal", "a")]);
    const stale = conditionsReducer(state, raise("stream-terminal", "b", { generation: R2 }));
    expect(stale.byId).toEqual(state.byId);
    expect([stale.nextId, stale.nextSeq, stale.notKept]).toEqual([state.nextId, state.nextSeq, state.notKept]);
    const staleRepeat = conditionsReducer(state, raise("stream-terminal", "a", { generation: R2 }));
    expect(all(staleRepeat)[0].occurrences, "a stale re-raise does not count").toBe(1);

    const fresh = conditionsReducer(initialConditionsState, raise("stream-terminal", "a"));
    expect(fresh.byId).toEqual({});
    expect([fresh.nextId, fresh.nextSeq, fresh.notKept, fresh.current]).toEqual([initialConditionsState.nextId, initialConditionsState.nextSeq, 0, null]);
    const freshBatch = conditionsReducer(initialConditionsState, { type: "replaceBatch", route: "save-notice", code: "project.save_notice", target: RESOURCE, generation: R, displays: [text("a")] });
    expect(freshBatch.byId).toEqual({});
  });
});

/** `count` raises on the stream-terminal route under `generation`, each with its own key. */
const manyRaises = (count: number, generation: string = R): ConditionsEvent[] =>
  Array.from({ length: count }, (_, index) => raise("stream-terminal", `code-${index}`, { generation }));

describe("conditions: the cap (C-U7, C-U7a, C-U7b, C-U7c)", () => {
  // RECORDED MUTATION for C-U7: in `raise` at the cap drop the oldest kept condition and keep the new raise. Expected failure: the top is not the first raise.
  // OBSERVED AT a17db128abecd0764977cf0ba5bfc44e48ae898f: FAILED -- "C-U7: after opened(R), CONDITIONS_MAX raises, each with its own key: the oldest CONDITIONS_MAX - 1 are kept, notKept is 1, and the top is the first raise": AssertionError: expected +0 to be 1 // Object.is equality. Also failed: C-U7a, C-U7c. Reverted after observing.
  it("C-U7: after opened(R), CONDITIONS_MAX raises, each with its own key: the oldest CONDITIONS_MAX - 1 are kept, notKept is 1, and the top is the first raise", () => {
    const state = fold([opened(R), ...manyRaises(CONDITIONS_MAX)]);
    expect(all(state)).toHaveLength(CONDITIONS_MAX - 1);
    expect(state.notKept).toBe(1);
    expect(attentionOf(shown(state))?.top.reason.code).toBe("code-0");
    expect(codesOf(shown(state)).at(-1)).toBe(`code-${CONDITIONS_MAX - 2}`);
  });

  // RECORDED MUTATION for C-U7a: in `opened` leave `notKept` as it was. Expected failure: notKept is 1 after the next open.
  // OBSERVED AT a17db128abecd0764977cf0ba5bfc44e48ae898f: FAILED -- "C-U7a: opened resets notKept: CONDITIONS_MAX raises give notKept 1; opened(R2) then gives notKept 0 and no condition": AssertionError: expected 1 to be +0 // Object.is equality. Reverted after observing.
  it("C-U7a: opened resets notKept: CONDITIONS_MAX raises give notKept 1; opened(R2) then gives notKept 0 and no condition", () => {
    const full = fold([opened(R), ...manyRaises(CONDITIONS_MAX)]);
    expect(full.notKept).toBe(1);
    const next = conditionsReducer(full, opened(R2));
    expect(next.notKept).toBe(0);
    expect(all(next)).toEqual([]);
  });

  // RECORDED MUTATION for C-U7b: in `raise` apply the generation drop after the cap check. Expected failure: the stale raise is counted in notKept.
  // OBSERVED AT a17db128abecd0764977cf0ba5bfc44e48ae898f: FAILED -- "C-U7b: a stale raise takes no cap room: with CONDITIONS_MAX - 1 kept, one stream-terminal raise under R3 leaves notKept 0 and the kept unchanged": AssertionError: expected 1 to be +0 // Object.is equality. Reverted after observing.
  it("C-U7b: a stale raise takes no cap room: with CONDITIONS_MAX - 1 kept, one stream-terminal raise under R3 leaves notKept 0 and the kept unchanged", () => {
    const full = fold([opened(R), ...manyRaises(CONDITIONS_MAX - 1)]);
    expect(all(full)).toHaveLength(CONDITIONS_MAX - 1);
    const stale = conditionsReducer(full, raise("stream-terminal", "stale", { generation: R3 }));
    expect(stale.notKept).toBe(0);
    expect(stale.byId).toEqual(full.byId);
  });

  // RECORDED MUTATION for C-U7c: in `raise` keep an urgency-1 raise only while fewer than CONDITIONS_MAX - 1 conditions are kept, as urgency 2 and 3 are. Expected failure: the session-ended raise at the cap is not kept.
  // OBSERVED AT a17db128abecd0764977cf0ba5bfc44e48ae898f: FAILED -- "C-U7c: urgency 1 is always kept in the held place: after CONDITIONS_MAX stream-terminal raises, a session-ended raise is kept, the kept count is CONDITIONS_MAX, notKept stays 1, and it is the top": AssertionError: expected [ { id: 'condition-1', …(9) }, …(62) ] to have a length of 64 but got 63. Reverted after observing.
  it("C-U7c: urgency 1 is always kept in the held place: after CONDITIONS_MAX stream-terminal raises, a session-ended raise is kept, the kept count is CONDITIONS_MAX, notKept stays 1, and it is the top", () => {
    const full = fold([opened(R), ...manyRaises(CONDITIONS_MAX)]);
    const state = conditionsReducer(full, sessionEnded());
    expect(all(state)).toHaveLength(CONDITIONS_MAX);
    expect(state.notKept).toBe(1);
    const attention = attentionOf(shown(state));
    expect(attention?.top.reason.route).toBe("session-ended");
    expect(attention?.others).toBe(CONDITIONS_MAX - 1);
  });

  it("C-U7: a re-raise of a kept condition at the cap counts as an occurrence and not as a raise that is not kept", () => {
    const full = fold([opened(R), ...manyRaises(CONDITIONS_MAX - 1)]);
    const again = conditionsReducer(full, raise("stream-terminal", "code-0"));
    expect(again.notKept).toBe(0);
    expect(all(again).find((condition) => condition.reason.code === "code-0")?.occurrences).toBe(2);
  });
});

describe("conditions: a notice batch is replaced whole (C-U8)", () => {
  // RECORDED MUTATION for C-U8: in `replaceBatch` end the route's conditions before each display, not once per batch. Expected failure: a two-display batch keeps one.
  // OBSERVED AT a17db128abecd0764977cf0ba5bfc44e48ae898f: FAILED -- "C-U8: replaceBatch(save-notice, [a, b]) gives two conditions with ordinals 0 and 1; replaceBatch([]) ends both and mints none; the viewport-refusal stands throughout": AssertionError: expected [ [ 1, { kind: 'text', text: 'b' } ] ] to deeply equal [ [ +0, …(1) ], …(1) ]. Reverted after observing.
  it("C-U8: replaceBatch(save-notice, [a, b]) gives two conditions with ordinals 0 and 1; replaceBatch([]) ends both and mints none; the viewport-refusal stands throughout", () => {
    const batch = (displays: readonly string[]): ConditionsEvent => ({
      type: "replaceBatch",
      route: "save-notice",
      code: "project.save_notice",
      target: RESOURCE,
      generation: R,
      displays: displays.map(text),
    });
    const base = fold([opened(R), raise("viewport-refusal", "v")]);
    const two = conditionsReducer(base, batch(["a", "b"]));
    const notices = all(two).filter((condition) => condition.reason.route === "save-notice");
    expect(notices.map((condition) => [condition.reason.ordinal, condition.first])).toEqual([[0, text("a")], [1, text("b")]]);
    expect(all(two).some((condition) => condition.reason.route === "viewport-refusal")).toBe(true);

    const replaced = conditionsReducer(two, batch(["c"]));
    expect(all(replaced).filter((condition) => condition.reason.route === "save-notice").map((condition) => condition.first)).toEqual([text("c")]);

    const empty = conditionsReducer(two, batch([]));
    expect(all(empty).filter((condition) => condition.reason.route === "save-notice")).toEqual([]);
    expect(codesOf(all(empty))).toEqual(["v"]);
  });

  // RECORDED MUTATION for "C-U8: a record-notice batch replaces the last, whatever its code, and carries no ordinal": in `replaceBatch` (conditions.ts) give every route the position as its ordinal, not only the save-notice route.
  // Expected failure: the record-notice conditions carry an ordinal.
  // OBSERVED AT b9594a2f78b6dfdcdca4bf9345fee1c6acfb955e: FAILED -- "C-U8: a record-notice batch replaces the last, whatever its code, and carries no ordinal": AssertionError: expected [ [ 'step-record-style', +0, …(1) ] ] to deeply equal [ [ 'step-record-style', null, …(1) ] ]. Reverted after observing.
  it("C-U8: a record-notice batch replaces the last, whatever its code, and carries no ordinal", () => {
    const batch = (code: string, display: string): ConditionsEvent => ({ type: "replaceBatch", route: "record-notice", code, target: VIEW_1, generation: R, displays: [text(display)] });
    const state = fold([opened(R), batch("step-record-filter", "one"), batch("step-record-style", "two")]);
    expect(all(state).map((condition) => [condition.reason.code, condition.reason.ordinal, condition.first])).toEqual([["step-record-style", null, text("two")]]);
  });
});

describe("conditions: a dismissed condition raised again is a new one (C-U6b)", () => {
  // RECORDED MUTATION for C-U6b (M12-1): in `dismiss`, return `{ ...without(state, (c) => c.id === event.id), nextId: state.nextId - 1 }`, so the next mint reuses the dismissed id. Expected failure: this test, at its new-id assertion.
  // RECORDED MUTATION for C-U6b (M12-4): in `dismiss`, end nothing when the condition was raised more than once. Expected failure: this test, at its dismissal assertion.
  // OBSERVED 2026-11-27 at d3876534 (M12-1, the `nextId: state.nextId - 1` return in `dismiss` alone): FAILED -- this test, at its new-id assertion: AssertionError: a condition's id is never reused in a session: expected 'condition-1' not to be 'condition-1'. Reverted after observing.
  // OBSERVED 2026-11-27 at d3876534 (M12-4, `dismiss` ending nothing when `condition.occurrences > 1`, alone): FAILED -- this test, at its dismissal assertion (line of the expect after the first dismiss): AssertionError: the dismissal ends the twice-raised condition: expected [ { id: 'condition-1', …(9) } ] to deeply equal []. Reverted after observing.
  it("C-U6b: a condition raised twice, dismissed, then raised again: a new id, one occurrence, and no count carried over", () => {
    const route = "canvas-ceiling";
    const key = { code: "canvas.vertex_ceiling", target: VIEW_1, generation: R };
    const twice = fold([opened(R), raise(route, key.code, { display: text("one") }), raise(route, key.code, { display: text("two") })]);
    expect(all(twice)).toHaveLength(1);
    const dismissedOne = all(twice)[0];
    expect(dismissedOne.occurrences).toBe(2);

    const dismissed = conditionsReducer(twice, { type: "dismiss", id: dismissedOne.id });
    expect(all(dismissed), "the dismissal ends the twice-raised condition").toEqual([]);

    const third = conditionsReducer(dismissed, raise(route, key.code, { display: text("three") }));
    expect(all(third)).toHaveLength(1);
    const raisedAgain = all(third)[0];
    expect(raisedAgain.id, "a condition's id is never reused in a session").not.toBe(dismissedOne.id);
    expect(raisedAgain.occurrences, "no count is carried over").toBe(1);
    expect(raisedAgain.first).toEqual(text("three"));
    expect(raisedAgain.latest).toEqual(text("three"));
  });
});
