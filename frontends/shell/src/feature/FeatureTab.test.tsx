// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md section 2.6: the Feature tab as a view. It shows the inspected feature
 * (the id line, the pin, whether it is drawn), the last-click line, the selection summary with its counts, Zoom to
 * selection, Clear selection and the notice -- and never an element with the class `hover-readout` (section 8 item 15).
 * (RB1, RB4, RB5, RB6 and RB11 prove the same surfaces through the real `App`; this file proves the view.)
 */

import { act } from "react";
import { createRoot, Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { HOVER_BELOW_RESOLUTION_TEXT, HOVER_SESSION_ENDED_TEXT, idLine } from "../canvas/HoverReadoutView";
import type { SelectionCounts, SelectionNotice } from "../workspace/selection";
import type { InspectedFeature } from "../workspace/workspaceState";
import { FeatureTab } from "./FeatureTab";
import type { FeatureTabProps, LastClick } from "./FeatureTab";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const PICK_A = { streamHandle: "s1", batchSeq: 0, id: 42n, anchor: [1.5, 2.5] as [number, number] };
const PICK_B = { streamHandle: "s1", batchSeq: 0, id: 77n, anchor: null };
const BOUNDS = { xmin: 0, ymin: 0, xmax: 1, ymax: 1 };
const INSPECTED_A: InspectedFeature = { pick: PICK_A, bounds: BOUNDS };
const COUNTS_NONE: SelectionCounts = { selected: 0, outsideView: null, inViewNotDrawn: null, reason: null };
const COUNTS_FIVE: SelectionCounts = { selected: 5, outsideView: 2, inViewNotDrawn: 1, reason: null };

describe("FeatureTab", () => {
  let container: HTMLDivElement;
  let root: Root;
  const calls: string[] = [];

  beforeEach(() => {
    calls.length = 0;
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  function mount(over: Partial<FeatureTabProps> = {}): void {
    act(() => {
      root.render(
        <FeatureTab
          inspected={null}
          pinned={false}
          inspectedStatus={null}
          lastClick={null}
          counts={COUNTS_NONE}
          notice={null}
          onPin={(pinned) => calls.push(`pin ${pinned}`)}
          onZoomToSelection={() => calls.push("zoom")}
          onClearSelection={() => calls.push("clear")}
          {...over}
        />
      );
    });
  }

  const q = <T extends Element = HTMLElement>(selector: string): T | null => container.querySelector<T>(selector);
  const text = (selector: string) => q(selector)?.textContent ?? null;
  const button = (label: string) => [...container.querySelectorAll<HTMLButtonElement>("button")].find((b) => b.textContent === label)!;

  // RECORDED MUTATION for "the pin": in FeatureTab.tsx hand over the current state (`onPin(pinned)`). Expected failure: a click on an unpinned feature's Pin hands over
  // false.
  it("shows the inspected feature's id line as HoverReadoutView renders it, and Pin toggles through onPin", () => {
    mount({ inspected: INSPECTED_A });
    expect(text(".feature-id")).toBe(idLine(PICK_A));
    expect(text(".feature-id")).toBe("id 42 @ (1.500, 2.500)");
    expect(button("Pin").getAttribute("aria-pressed")).toBe("false");
    act(() => button("Pin").click());
    mount({ inspected: INSPECTED_A, pinned: true });
    expect(button("Pin").getAttribute("aria-pressed")).toBe("true");
    act(() => button("Pin").click());
    expect(calls).toEqual(["pin true", "pin false"]);
  });

  // RECORDED MUTATION for "nothing inspected": in FeatureTab.tsx render the Pin button in the empty branch as well. Expected failure: a Pin button is present with
  // nothing to pin.
  it("with nothing inspected there is no id line and no Pin", () => {
    mount();
    expect(q(".feature-id")).toBeNull();
    expect(q(".feature-pin")).toBeNull();
    expect(text(".feature-empty")).toContain("No feature is inspected");
  });

  // RECORDED MUTATION for "the drawn status": in FeatureTab.tsx show the drawn text when no status is given (`STATUS_TEXT[inspectedStatus ?? "drawn"]`, shown
  // always). Expected failure: a status shows with no current view box.
  it("states whether the inspected feature is drawn from the status App gives, and says nothing without one", () => {
    mount({ inspected: INSPECTED_A, inspectedStatus: "drawn" });
    expect(text(".feature-status")).toContain("Drawn in the view");
    mount({ inspected: INSPECTED_A, inspectedStatus: "outside-view" });
    expect(text(".feature-status")).toContain("outside the view");
    mount({ inspected: INSPECTED_A, inspectedStatus: "in-view-not-drawn" });
    expect(text(".feature-status")).toContain("in the view");
    mount({ inspected: INSPECTED_A, inspectedStatus: null });
    expect(q(".feature-status")).toBeNull();
  });

  // RECORDED MUTATION for "the last-click line": in FeatureTab.tsx render the session-ended text for the below-resolution state. Expected failure: the
  // below-resolution line carries the session-ended text.
  it("the last-click line names the clicked feature, the pinned one it kept, and the two refusals in HoverReadoutView's own texts", () => {
    const line = (lastClick: LastClick | null) => {
      mount({ lastClick });
      return text(".feature-last-click");
    };
    expect(line(null)).toBeNull();
    expect(line({ kind: "feature", pick: PICK_B, keptPinned: null })).toBe("[P6 placeholder] Last click: id 77.");
    expect(line({ kind: "feature", pick: PICK_B, keptPinned: PICK_A })).toBe(
      "[P6 placeholder] Last click: id 77. The pinned feature, id 42, stays inspected."
    );
    expect(line({ kind: "nothing" })).toBe("[P6 placeholder] Last click: no feature there.");
    expect(line({ kind: "below-pick-resolution" })).toBe(HOVER_BELOW_RESOLUTION_TEXT);
    expect(line({ kind: "session-ended" })).toBe(HOVER_SESSION_ENDED_TEXT);
  });

  // RECORDED MUTATION for "no hover-readout": in FeatureTab.tsx give the id line the class `hover-readout`. Expected failure: an element with that class is
  // rendered.
  it("never renders an element with the class hover-readout, in any state", () => {
    const states: Partial<FeatureTabProps>[] = [
      {},
      { inspected: INSPECTED_A, pinned: true, inspectedStatus: "drawn", counts: COUNTS_FIVE },
      { lastClick: { kind: "below-pick-resolution" } },
      { lastClick: { kind: "session-ended" } },
      { notice: { kind: "ended", reason: "reopened", dropped: 3 } },
    ];
    states.forEach((state, index) => {
      mount(state);
      expect(container.querySelectorAll(".hover-readout"), `state ${index}`).toHaveLength(0);
    });
  });

  // RECORDED MUTATION for "the counts": in FeatureTab.tsx test `counts.outsideView !== undefined` instead of `!== null`. Expected failure: a line for a split that is not
  // known is rendered.
  it("shows Selected, ignoring filter always, and each split only when it is known, with no reason", () => {
    mount({ counts: { selected: 3, outsideView: null, inViewNotDrawn: null, reason: null } });
    expect(text(".feature-selected")).toBe("Selected, ignoring filter: 3");
    expect(q(".feature-outside-view")).toBeNull();
    expect(q(".feature-in-view-not-drawn")).toBeNull();
    mount({ counts: COUNTS_FIVE });
    expect(text(".feature-selected")).toBe("Selected, ignoring filter: 5");
    expect(text(".feature-outside-view")).toBe("[P6 placeholder] Outside the view: 2");
    expect(text(".feature-in-view-not-drawn")).toBe("[P6 placeholder] In the view, not drawn: 1");
    expect(container.textContent).not.toMatch(/excluded|filter reason/i);
  });

  // RECORDED MUTATION for "the buttons": in FeatureTab.tsx drop `disabled={nothingSelected}` from Zoom to selection. Expected failure: the button is enabled with an
  // empty selection.
  it("Zoom to selection and Clear selection are disabled while nothing is selected, and call their handler otherwise", () => {
    mount({ counts: COUNTS_NONE });
    expect([button("Zoom to selection").disabled, button("Clear selection").disabled]).toEqual([true, true]);
    mount({ counts: COUNTS_FIVE });
    expect([button("Zoom to selection").disabled, button("Clear selection").disabled]).toEqual([false, false]);
    act(() => button("Zoom to selection").click());
    act(() => button("Clear selection").click());
    expect(calls).toEqual(["zoom", "clear"]);
  });

  // RECORDED MUTATION for "the scope words": in FeatureTab.tsx read the words from the Clear selection entry (`clear.scopeWords`). Expected failure: the scope line
  // reads null where the plan's words were expected.
  it("states Zoom to selection's scope in the plan's words", () => {
    mount({ counts: COUNTS_FIVE });
    expect(text(".feature-scope")).toBe("[P6 placeholder] Zoom to selection acts on: Selected, ignoring filter");
  });

  // RECORDED MUTATION for "the notice": in FeatureTab.tsx swap the two reasons' words in `noticeText`. Expected failure: a source change reads as an open.
  it("the notice names the count dropped and which of the two ended the selection, or the ceiling, and none when there is none", () => {
    const notice = (value: SelectionNotice | null) => {
      mount({ notice: value });
      return text(".feature-notice");
    };
    expect(notice(null)).toBeNull();
    expect(notice({ kind: "ended", reason: "source-changed", dropped: 5 })).toBe(
      "[P6 placeholder] The selection ended: 5 selected features were dropped, because the source file changed."
    );
    expect(notice({ kind: "ended", reason: "reopened", dropped: 1 })).toBe(
      "[P6 placeholder] The selection ended: 1 selected feature was dropped, because a dataset was opened."
    );
    expect(notice({ kind: "refused", refusal: { code: "selection.ceiling", max: 10000, attempted: 10001 } })).toBe(
      "[P6 placeholder] The selection holds at most 10000 features: this one was not added."
    );
    mount({ notice: { kind: "ended", reason: "reopened", dropped: 1 } });
    expect(q(".feature-notice")?.getAttribute("role")).toBe("status");
  });
});
