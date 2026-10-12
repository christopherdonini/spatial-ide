// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md section 2.2 and 2.6: what `StudioLayout` gains for milestone 2 -- the
 * `topBar.tools` slot, the Inspector's third tab with its `inspector.feature` slot, and the bare tool keys -- rendered
 * through the REAL `StudioLayout` with plain nodes in the slots. (The frame as a whole is `App.layout.test.tsx`'s,
 * through the real `App`; this file needs no `App` and mocks nothing.)
 */

import { act } from "react";
import { createRoot, Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { consoleRecorder, isGuiActionEntry } from "../console/recorder";
import type { Tool } from "../workspace/workspaceState";
import type { Slots } from "./contributions";
import StudioLayout from "./StudioLayout";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const NO_SLOTS: Slots = {
  "topBar.tools": null,
  "region.layers": null,
  "region.map": null,
  "section.source": null,
  "section.filter": null,
  "section.export": null,
  "inspector.style": null,
  "inspector.feature": null,
  "activity.console": null,
  "activity.notices": null,
  "attention.sessionEnded": null,
  "attention.canvasRefusal": null,
  "attention.viewportRefusal": null,
  "status.residency": null,
  "status.scanLiveness": null,
  "status.scanIncomplete": null,
  "status.sourceWatch": null,
};

describe("StudioLayout: what milestone 2 adds to the frame", () => {
  let container: HTMLDivElement;
  let root: Root;
  const tools: Tool[] = [];

  beforeEach(() => {
    tools.length = 0;
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

  function mount(slots: Partial<Slots>, withHandler = true): void {
    act(() => {
      root.render(
        <StudioLayout
          overlays={null}
          slots={{ ...NO_SLOTS, ...slots }}
          layersRow={null}
          onZoomToLayer={() => {}}
          onSelectTool={withHandler ? (tool) => tools.push(tool) : undefined}
        />
      );
    });
  }

  /** A bare key, dispatched where a real one lands: on `target`, bubbling to the window listener. Returns whether the
   * listener consumed it. */
  function pressBare(key: string, target: EventTarget = window): boolean {
    const event = new KeyboardEvent("keydown", { key, code: `Key${key.toUpperCase()}`, bubbles: true, cancelable: true });
    act(() => {
      target.dispatchEvent(event);
    });
    return event.defaultPrevented;
  }

  const q = <T extends Element = HTMLElement>(selector: string): T | null => container.querySelector<T>(selector);
  const isHidden = (element: Element | null) => element?.hasAttribute("hidden") === true;

  // RECORDED MUTATION for "the top bar's tools slot": in StudioLayout.tsx move the `topBar.tools` line out of the `<header>` and into the
  // map region (`<main>`). Expected failure: the content is not inside the top bar.
  // OBSERVED AT f49599353db52445c07e941e326c73f0c44a8925: FAILED -- "the topBar.tools slot renders inside the top bar, before the toggles, and nothing is rendered for an empty slot":
  //   AssertionError: expected false to be true // Object.is equality. Reverted after observing.
  it("the topBar.tools slot renders inside the top bar, before the toggles, and nothing is rendered for an empty slot", () => {
    mount({});
    expect(q(".top-bar-tools")).toBeNull();

    mount({ "topBar.tools": <span data-testid="tools">the tool switch</span> });
    const header = q("header.top-bar")!;
    const switchNode = q('[data-testid="tools"]')!;
    expect(header.contains(switchNode)).toBe(true);
    expect(q("main")!.contains(switchNode)).toBe(false);
    expect(q(".top-bar-tools")!.compareDocumentPosition(q(".top-bar-toggles")!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  // RECORDED MUTATION for "the Feature tab": in StudioLayout.tsx render `slots["inspector.style"]` in every slot tab's panel (replace
  // `slots[`inspector.${tab.id}`]` by `slots["inspector.style"]`). Expected failure: the Feature panel does not hold the Feature slot.
  // OBSERVED AT f49599353db52445c07e941e326c73f0c44a8925: FAILED -- "the Feature tab is the Inspector's third tab; its panel holds the inspector.feature slot and is hidden until the tab is selected":
  //   AssertionError: expected 'the style panel' to contain 'the feature panel'. Reverted after observing.
  it("the Feature tab is the Inspector's third tab; its panel holds the inspector.feature slot and is hidden until the tab is selected", () => {
    mount({ "inspector.style": <span>the style panel</span>, "inspector.feature": <span>the feature panel</span> });
    const tabs = [...container.querySelectorAll('#region-inspector [role="tab"]')];
    expect(tabs.map((tab) => tab.id)).toEqual(["inspector-tab-layer", "inspector-tab-style", "inspector-tab-feature"]);
    const panel = q("#inspector-panel-feature")!;
    expect(panel.getAttribute("aria-labelledby")).toBe("inspector-tab-feature");
    expect(panel.textContent).toContain("the feature panel");
    expect(q("#inspector-panel-style")!.textContent).not.toContain("the feature panel");
    expect(isHidden(panel)).toBe(true);

    const before = consoleRecorder.entries().length;
    act(() => {
      q("#inspector-tab-feature")!.click();
    });
    expect([isHidden(q("#inspector-panel-layer")), isHidden(q("#inspector-panel-style")), isHidden(panel)]).toEqual([true, true, false]);
    const rows = consoleRecorder.entries().slice(before).filter(isGuiActionEntry).map((entry) => entry.action);
    expect(rows).toEqual(["layout.selectInspectorTab"]);
  });

  // RECORDED MUTATION for "the empty-Inspector text": in contributions.ts leave `inspector.feature` out of `INSPECTOR_SLOT_IDS` (filter
  // `INSPECTOR_SLOT_TABS` to the Style tab there). Expected failure: the text still shows with the Feature slot filled.
  // OBSERVED AT f49599353db52445c07e941e326c73f0c44a8925: FAILED -- "the empty-Inspector text shows in every Inspector panel until any Inspector slot, the Feature slot included, has content":
  //   AssertionError: expected <p class="inspector-empty"></p> …(2) to have a length of +0 but got 3. Reverted after observing.
  it("the empty-Inspector text shows in every Inspector panel until any Inspector slot, the Feature slot included, has content", () => {
    mount({});
    expect([...container.querySelectorAll(".inspector-empty")]).toHaveLength(3);
    mount({ "inspector.feature": <span>the feature panel</span> });
    expect(container.querySelectorAll(".inspector-empty")).toHaveLength(0);
  });

  // RECORDED MUTATION for "the tool keys": in StudioLayout.tsx swap `TOOL_OF_ACTION`'s values (`"tool.navigate": "select"`, `"tool.select": "navigate"`).
  // Expected failure: a bare N hands over select where navigate was expected.
  // OBSERVED AT f49599353db52445c07e941e326c73f0c44a8925: FAILED -- "a bare N or S hands the tool to onSelectTool and the key is consumed":
  //   AssertionError: expected [ 'select', 'navigate' ] to deeply equal [ 'navigate', 'select' ]. Reverted after observing.
  it("a bare N or S hands the tool to onSelectTool and the key is consumed", () => {
    mount({});
    expect(pressBare("n")).toBe(true);
    expect(pressBare("s")).toBe(true);
    expect(tools).toEqual(["navigate", "select"]);
  });

  // RECORDED MUTATION for "the text-field guard": in StudioLayout.tsx's listener pass no element to the matcher (`matchToolKey(event, null)`). Expected
  // failure: a key typed in the input hands over a tool.
  // OBSERVED AT f49599353db52445c07e941e326c73f0c44a8925: FAILED -- "a bare key typed in an input does nothing, whether the event lands on it or the window while it has the focus":
  //   AssertionError: expected true to be false // Object.is equality. Reverted after observing.
  it("a bare key typed in an input does nothing, whether the event lands on it or the window while it has the focus", () => {
    mount({ "section.filter": <input data-testid="field" /> });
    const field = q<HTMLInputElement>('[data-testid="field"]')!;
    expect(pressBare("n", field)).toBe(false);
    act(() => {
      field.focus();
    });
    expect(pressBare("s", window)).toBe(false);
    expect(tools).toEqual([]);
    act(() => {
      field.blur();
    });
    expect(pressBare("s", window)).toBe(true);
    expect(tools).toEqual(["select"]);
  });

  // RECORDED MUTATION for "a bare key with no handler": in StudioLayout.tsx's listener call `event.preventDefault()` before the `selectTool === undefined`
  // check. Expected failure: the key is consumed although nothing handles it.
  // OBSERVED AT f49599353db52445c07e941e326c73f0c44a8925: FAILED -- "with no onSelectTool, a bare tool key is left alone":
  //   AssertionError: expected true to be false // Object.is equality. Reverted after observing.
  it("with no onSelectTool, a bare tool key is left alone", () => {
    mount({}, false);
    expect(pressBare("n")).toBe(false);
    expect(tools).toEqual([]);
  });
});
