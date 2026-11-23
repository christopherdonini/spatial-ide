// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * SHELL-MIGRATION-MILESTONE-5-PREREGISTRATION.md section 2.3 and section 4 (C-R2): the Problems tab lists every visible condition once,
 * in `ordered` order; the top row carries no outer owner class and no alert role and shows S-10; Dismiss dispatches `dismiss(id)`;
 * S-4 shows when nothing is listed and S-6 when a raise was not kept. The conditions come out of the real reducer.
 */

import { act, useReducer } from "react";
import { createRoot, Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { attentionOf, conditionsReducer, initialConditionsState, ordered, visibleFor } from "./conditions";
import type { Condition, ConditionsEvent, ConditionsState } from "./conditions";
import { CONDITIONS_MAX, notKeptText, NO_PROBLEMS_TEXT, SHOWN_IN_STRIP_TEXT } from "./conditionsConstants";
import ProblemsTab from "./ProblemsTab";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const R = "ds_r";
const VIEW = { kind: "view", view: "view-1" } as const;
const RESOURCE = { kind: "resource" } as const;

const raise = (route: "stream-terminal" | "reopen-notice" | "viewport-refusal" | "session-ended", code: string, text: string): ConditionsEvent => ({
  type: "raise",
  route,
  code,
  ordinal: route === "reopen-notice" ? 0 : null,
  target: route === "reopen-notice" || route === "session-ended" ? RESOURCE : VIEW,
  generation: R,
  display: { kind: "text", text },
});
const stateOf = (events: readonly ConditionsEvent[]): ConditionsState => [{ type: "opened", resource: R } as ConditionsEvent, ...events].reduce(conditionsReducer, initialConditionsState);

/** The store behind the tab, with the dispatch the strip's owners use: the tab's Dismiss reaches `dismiss(id)` through it. */
function Harness({ initial }: { initial: ConditionsState }) {
  const [state, dispatch] = useReducer(conditionsReducer, initial);
  const list = visibleFor(state, { view: "view-1", resource: R });
  // The list is handed over in reverse raise order: the tab orders it itself.
  return <ProblemsTab conditions={[...list].reverse()} notKept={state.notKept} onDismiss={(condition: Condition) => dispatch({ type: "dismiss", id: condition.id })} />;
}

describe("ProblemsTab (C-R2)", () => {
  let container: HTMLDivElement;
  let root: Root;
  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });
  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });
  const render = (initial: ConditionsState) => act(() => root.render(<Harness initial={initial} />));
  const rows = () => [...container.querySelectorAll(".problem-row")];

  // RECORDED MUTATION for C-R2: in `ProblemsTab.tsx` list only the top row. Expected failure: the rows after the top are absent.
  it("C-R2: every visible condition once, in order; the top row has no owner class and no alert role and shows S-10", () => {
    const state = stateOf([raise("reopen-notice", "n", "a notice"), raise("stream-terminal", "a", "refusal a"), raise("stream-terminal", "b", "refusal b"), raise("session-ended", "engine.source_changed", "ended")]);
    render(state);
    const list = ordered(visibleFor(state, { view: "view-1", resource: R }));
    expect(rows()).toHaveLength(list.length);
    expect(rows()).toHaveLength(4);
    expect(rows().map((row) => row.textContent)).toEqual([
      SHOWN_IN_STRIP_TEXT,
      expect.stringContaining("refusal a"),
      expect.stringContaining("refusal b"),
      expect.stringContaining("a notice"),
    ]);
    const top = container.querySelectorAll(".problem-row-top");
    expect(top).toHaveLength(1);
    expect(top[0]).toBe(rows()[0]);
    expect(top[0].querySelector(".canvas-refusal, .canvas-session-ended, .record-notice, .save-notice, .reopen-notice")).toBeNull();
    expect(top[0].matches(".canvas-refusal, .canvas-session-ended, .record-notice, .save-notice, .reopen-notice")).toBe(false);
    expect(container.querySelector('[role="alert"]'), "no row of Problems carries the alert role").toBeNull();
    expect(attentionOf(list)?.top.reason.route).toBe("session-ended");
    expect(container.querySelector(".canvas-session-ended"), "the top's owner element is the strip's, not Problems'").toBeNull();
    expect(container.querySelectorAll(".reopen-notice")).toHaveLength(1);
  });

  it("C-R2: Dismiss on a row dispatches dismiss(id): the row goes and the others stand", () => {
    const state = stateOf([raise("stream-terminal", "a", "refusal a"), raise("stream-terminal", "b", "refusal b"), raise("stream-terminal", "c", "refusal c")]);
    render(state);
    expect(rows()).toHaveLength(3);
    const second = rows()[1].querySelector("button")!;
    expect(second.textContent).toBe("Dismiss");
    act(() => second.click());
    expect(rows().map((row) => row.textContent)).toEqual([SHOWN_IN_STRIP_TEXT, expect.stringContaining("refusal c")]);
    expect(rows()[0].querySelector("button"), "the top row has no Dismiss of its own: the strip's element has it").toBeNull();
  });

  it("C-R2: S-4 shows when nothing is listed, and not otherwise", () => {
    render(stateOf([]));
    expect(rows()).toHaveLength(0);
    expect(container.textContent).toContain(NO_PROBLEMS_TEXT);
    render(stateOf([raise("stream-terminal", "a", "refusal a")]));
    expect(container.textContent).not.toContain(NO_PROBLEMS_TEXT);
  });

  it("C-R2: S-6 shows the count of raises not kept, and only when it is above 0", () => {
    const events: ConditionsEvent[] = Array.from({ length: CONDITIONS_MAX + 1 }, (_, index) => raise("stream-terminal", `code-${index}`, `refusal ${index}`));
    const full = stateOf(events);
    expect(full.notKept).toBe(2);
    render(full);
    expect(container.textContent).toContain(notKeptText(2));
    render(stateOf([raise("stream-terminal", "a", "refusal a")]));
    expect(container.textContent).not.toContain(notKeptText(0));
    expect(container.querySelector(".problems-not-kept")).toBeNull();
  });

  it("C-R2: S-6 shows with S-4 when nothing is listed for the view but raises were not kept", () => {
    render({ ...initialConditionsState, current: R, notKept: 3 });
    expect(container.textContent).toContain(NO_PROBLEMS_TEXT);
    expect(container.textContent).toContain(notKeptText(3));
  });
});
