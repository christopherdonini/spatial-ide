// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * SHELL-MIGRATION-MILESTONE-5-PREREGISTRATION.md section 2.3 and section 4 (C-R1): `ConditionView` renders each owner's markup as
 * `App.tsx` rendered it before it moved (the references below are that markup, written out), and adds nothing the owner did not have:
 * no button but the owner's Dismiss, and S-5 as the one added line. Per place, the element in the strip carries `role="alert"`, and a
 * Problems row never does. The conditions come out of the real reducer; `RefusalBlock` is the real block.
 */

import { act } from "react";
import { createRoot, Root } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { formatRefusal } from "../admission/formatRefusal";
import type { FormattedRefusal } from "../admission/formatRefusal";
import RefusalBlock from "../admission/RefusalBlock";
import { conditionsReducer, initialConditionsState } from "./conditions";
import type { Condition, ConditionDisplay, ConditionRoute, ConditionsEvent } from "./conditions";
import ConditionView from "./ConditionView";
import { raisedTimesText } from "./conditionsConstants";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const R = "ds_r";
const refusal: FormattedRefusal = formatRefusal({ code: "engine.source_changed", message: "the source file changed", fields: { class: "mtime" } });
const viewportRefusal: FormattedRefusal = formatRefusal({ code: "engine.connections_exhausted", message: "no admission lease was available", fields: {} });

/** Each route's display and the markup App rendered for it before the move (`App.tsx`'s attention slots), for a first display `a`. */
const REFERENCE: Record<ConditionRoute, { display: (n: string) => ConditionDisplay; code: string; dismiss: boolean; markup: (n: string, role: boolean) => string }> = {
  "session-ended": {
    code: "engine.source_changed",
    display: () => ({ kind: "refusal", refusal }),
    dismiss: false,
    markup: () => renderToStaticMarkup(<div className="canvas-session-ended"><RefusalBlock refusal={refusal} /></div>),
  },
  "canvas-ceiling": {
    code: "canvas.vertex_ceiling",
    display: (n) => ({ kind: "text", text: `ceiling ${n}` }),
    dismiss: true,
    markup: (n, role) => renderToStaticMarkup(<div className="canvas-refusal" role={role ? "alert" : undefined}>{`ceiling ${n}`}<button type="button">Dismiss</button></div>),
  },
  "stream-terminal": {
    code: "engine.stream_failed",
    display: (n) => ({ kind: "text", text: `stream ProducerFailed: ${n}` }),
    dismiss: true,
    markup: (n, role) => renderToStaticMarkup(<div className="canvas-refusal" role={role ? "alert" : undefined}>{`stream ProducerFailed: ${n}`}<button type="button">Dismiss</button></div>),
  },
  "viewport-refusal": {
    code: "engine.connections_exhausted",
    display: () => ({ kind: "refusal", refusal: viewportRefusal }),
    dismiss: true,
    markup: (_n, role) =>
      renderToStaticMarkup(
        <div className="canvas-refusal" role={role ? "alert" : undefined}>
          <div className="admission-refusal-code">{viewportRefusal.code}</div>
          {viewportRefusal.message}
          <button type="button">Dismiss</button>
        </div>
      ),
  },
  "record-notice": {
    code: "step-record-filter",
    display: (n) => ({ kind: "text", text: `record ${n}` }),
    dismiss: false,
    markup: (n, role) => renderToStaticMarkup(<div className="canvas-refusal record-notice" role={role ? "alert" : undefined}>{`record ${n}`}</div>),
  },
  "save-notice": {
    code: "project.save_notice",
    display: (n) => ({ kind: "text", text: `save ${n}` }),
    dismiss: false,
    markup: (n, role) => renderToStaticMarkup(<div className="canvas-refusal save-notice" role={role ? "alert" : undefined}>{`save ${n}`}</div>),
  },
  "reopen-notice": {
    code: "project.reopen_notice",
    display: (n) => ({ kind: "text", text: `reopen ${n}` }),
    dismiss: false,
    markup: (n, role) => renderToStaticMarkup(<div className="canvas-refusal reopen-notice" role={role ? "alert" : undefined}>{`reopen ${n}`}</div>),
  },
};
const ROUTES = Object.keys(REFERENCE) as ConditionRoute[];

/** A condition on `route`, as the real reducer mints it, raised `times` times through the same key, with first display `a` and later displays `b`. */
function conditionOn(route: ConditionRoute, times = 1): Condition {
  const reference = REFERENCE[route];
  const target = route === "session-ended" || route === "save-notice" || route === "reopen-notice" ? ({ kind: "resource" } as const) : ({ kind: "view", view: "view-1" } as const);
  const base = { type: "raise", route, code: reference.code, ordinal: null, target, generation: R } as const;
  const events: ConditionsEvent[] = [{ type: "opened", resource: R }];
  for (let i = 0; i < times; i += 1) events.push({ ...base, display: reference.display(i === 0 ? "a" : "b") });
  const state = events.reduce(conditionsReducer, initialConditionsState);
  return Object.values(state.byId).find((condition) => condition.reason.route === route)!;
}

describe("ConditionView: App's markup, moved whole (C-R1)", () => {
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
  const render = (condition: Condition, place: "strip" | "problems", onDismiss: (c: Condition) => void = () => {}) =>
    act(() => root.render(<ConditionView condition={condition} place={place} onDismiss={onDismiss} />));

  // RECORDED MUTATION for C-R1: in `ConditionView.tsx` add a `<button>Reopen</button>` to the session-ended element. Expected failure: the markup of the session-ended route and its list of buttons.
  // OBSERVED AT a17db128abecd0764977cf0ba5bfc44e48ae898f: FAILED -- "C-R1: session-ended renders App's moved markup exactly, and its buttons are exactly the owner's Dismiss": AssertionError: expected '<div class="canvas-session-ended"><di…' to be '<div class="canvas-session-ended"><di…' // Object.is equality. Reverted after observing.
  it.each(ROUTES)("C-R1: %s renders App's moved markup exactly, and its buttons are exactly the owner's Dismiss", (route) => {
    const condition = conditionOn(route);
    render(condition, "strip");
    expect(container.innerHTML).toBe(REFERENCE[route].markup("a", true));
    const buttons = [...container.querySelectorAll("button")].map((button) => button.textContent);
    expect(buttons).toEqual(REFERENCE[route].dismiss ? ["Dismiss"] : []);
  });

  it.each(ROUTES.filter((route) => REFERENCE[route].dismiss))("C-R1: the Dismiss of %s hands the condition to onDismiss", (route) => {
    const condition = conditionOn(route);
    const seen: Condition[] = [];
    render(condition, "strip", (c) => seen.push(c));
    act(() => container.querySelector("button")!.click());
    expect(seen).toEqual([condition]);
  });

  it.each(ROUTES.filter((route) => route !== "session-ended"))("C-R1: per place, %s carries role alert in the strip, and no Problems row does", (route) => {
    const condition = conditionOn(route);
    render(condition, "strip");
    expect(container.firstElementChild!.getAttribute("role")).toBe("alert");
    render(condition, "problems");
    expect(container.innerHTML).toBe(REFERENCE[route].markup("a", false));
    expect(container.querySelector('[role="alert"]')).toBeNull();
  });

  // RECORDED MUTATION for "C-R1: the session-ended element in the strip carries role alert through the owner's block": in `ConditionView.tsx` render the session-ended refusal as a bare `<div>` of its message in place of the owner's `RefusalBlock`.
  // Expected failure: the owner's block, which carries role alert, is absent.
  // OBSERVED AT b9594a2f78b6dfdcdca4bf9345fee1c6acfb955e: FAILED -- "C-R1: the session-ended element in the strip carries role alert through the owner's block": AssertionError: expected null not to be null. Reverted after observing.
  it("C-R1: the session-ended element in the strip carries role alert through the owner's block", () => {
    render(conditionOn("session-ended"), "strip");
    expect(container.querySelector(".canvas-session-ended")).not.toBeNull();
    expect(container.querySelector('.canvas-session-ended [role="alert"]')).not.toBeNull();
  });

  // RECORDED MUTATION for "C-R1: S-5 is the only added text: with occurrences above 1 one line is added between the first display and the latest": in `Body` (ConditionView.tsx) show S-5 with `occurrences - 1`.
  // Expected failure: the S-5 line's number is 2, not 3.
  // OBSERVED AT b9594a2f78b6dfdcdca4bf9345fee1c6acfb955e: FAILED -- "C-R1: S-5 is the only added text: with occurrences above 1 one line is added between the first display and the latest": AssertionError: expected 'Raised 2 times in all. The latest:' to be 'Raised 3 times in all. The latest:' // Object.is equality. Reverted after observing.
  it("C-R1: S-5 is the only added text: with occurrences above 1 one line is added between the first display and the latest", () => {
    const condition = conditionOn("stream-terminal", 3);
    expect(condition.occurrences).toBe(3);
    render(condition, "strip");
    const lines = container.querySelectorAll(".condition-occurrences");
    expect(lines).toHaveLength(1);
    expect(lines[0].textContent).toBe(raisedTimesText(3));
    const owner = container.querySelector(".canvas-refusal")!;
    expect([...owner.childNodes].map((node) => node.textContent)).toEqual(["stream ProducerFailed: a", raisedTimesText(3), "stream ProducerFailed: b", "Dismiss"]);
    expect(container.querySelectorAll(".canvas-refusal"), "the owner element is in the DOM once").toHaveLength(1);
  });

  // RECORDED MUTATION for "C-R1: with occurrences 1 the line is absent": in `Body` (ConditionView.tsx) show the S-5 line from `occurrences > 0`.
  // Expected failure: the line is present with occurrences 1.
  // OBSERVED AT b9594a2f78b6dfdcdca4bf9345fee1c6acfb955e: FAILED -- "C-R1: with occurrences 1 the line is absent": AssertionError: expected <div class="condition-occurrences"></div> to be null. Reverted after observing.
  it("C-R1: with occurrences 1 the line is absent", () => {
    render(conditionOn("stream-terminal"), "strip");
    expect(container.querySelector(".condition-occurrences")).toBeNull();
  });

  // RECORDED MUTATION for "C-R1: a condition's owner element is in the DOM once, with its outer owner class": in `ConditionView.tsx` leave the owner's outer class out (`NOTICE_CLASS` is not applied).
  // Expected failure: no .record-notice, .save-notice or .reopen-notice element is found.
  // OBSERVED AT b9594a2f78b6dfdcdca4bf9345fee1c6acfb955e: FAILED -- "C-R1: a condition's owner element is in the DOM once, with its outer owner class": AssertionError: record-notice: expected  to have a length of 1 but got +0. Reverted after observing.
  it("C-R1: a condition's owner element is in the DOM once, with its outer owner class", () => {
    for (const [route, selector] of [["canvas-ceiling", ".canvas-refusal"], ["session-ended", ".canvas-session-ended"], ["record-notice", ".record-notice"], ["save-notice", ".save-notice"], ["reopen-notice", ".reopen-notice"]] as const) {
      render(conditionOn(route), "strip");
      expect(container.querySelectorAll(selector), route).toHaveLength(1);
    }
  });

  it("CV-K1: in the strip, a condition with a new id and the same display is a new element; the same id raised again keeps its element", () => {
    // The kept-element half runs first: a guard, green before the other half fails. The same id raised again is the same element, and S-5 shows.
    render(conditionOn("stream-terminal", 1), "strip");
    const kept = container.firstElementChild!;
    render(conditionOn("stream-terminal", 2), "strip");
    expect(container.firstElementChild, "the same id raised again keeps its element").toBe(kept);
    expect(container.querySelector(".condition-occurrences")?.textContent, "and S-5 shows").toBe(raisedTimesText(2));

    // The new-element half: two `replaceBatch` events on the save-notice route with equal displays, through the real reducer, give two ids.
    // (`conditionOn` mints `condition-1` from a fresh state every time, so it cannot give a second id.)
    const batch: ConditionsEvent = {
      type: "replaceBatch",
      route: "save-notice",
      code: "project.save_notice",
      target: { kind: "resource" },
      generation: R,
      displays: [{ kind: "text", text: "save a" }],
    };
    const afterFirst = ([{ type: "opened", resource: R }, batch] as ConditionsEvent[]).reduce(conditionsReducer, initialConditionsState);
    const afterSecond = conditionsReducer(afterFirst, batch);
    const first = Object.values(afterFirst.byId)[0];
    const second = Object.values(afterSecond.byId)[0];
    expect(second.id, "the second batch's condition has a new id").not.toBe(first.id);
    expect(second.first, "with the same display").toEqual(first.first);

    render(first, "strip");
    const held = container.firstElementChild!;
    render(second, "strip");
    expect(held.isConnected, "the held element is gone from the document").toBe(false);
    const fresh = container.firstElementChild!;
    expect(fresh, "the strip holds another element").not.toBe(held);
    expect(fresh.getAttribute("role"), "which carries the alert role").toBe("alert");
  });
});
