// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md section 2.2 and Amendment 1 A4: the tool switch as a view. It shows the
 * active tool (`aria-pressed`), states in one line what a click does in each tool, and shows the mode picker only while
 * Select is active. (RB9 and RB16 prove the same properties through the real `App`; this file proves the view.)
 */

import { act } from "react";
import { createRoot, Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import type { SelectionMode } from "../workspace/selection";
import type { Tool } from "../workspace/workspaceState";
import { ToolSwitch } from "./ToolSwitch";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

describe("ToolSwitch", () => {
  let container: HTMLDivElement;
  let root: Root;
  const tools: Tool[] = [];
  const modes: SelectionMode[] = [];

  beforeEach(() => {
    tools.length = 0;
    modes.length = 0;
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

  function mount(tool: Tool, mode: SelectionMode = "toggle"): void {
    act(() => {
      root.render(<ToolSwitch tool={tool} mode={mode} onSelectTool={(t) => tools.push(t)} onSelectMode={(m) => modes.push(m)} />);
    });
  }

  const buttons = (selector: string) => [...container.querySelectorAll<HTMLButtonElement>(selector)];

  // RECORDED MUTATION for "the active tool": in ToolSwitch.tsx invert the pressed state (`aria-pressed={tool !== candidate}`). Expected failure:
  // Select reads pressed while Navigate is the active tool.
  // OBSERVED AT f49599353db52445c07e941e326c73f0c44a8925: FAILED -- "shows the active tool as pressed, labelled from the registry, with the key it is chosen by":
  //   AssertionError: expected [ 'false', 'true' ] to deeply equal [ 'true', 'false' ]. Reverted after observing.
  it("shows the active tool as pressed, labelled from the registry, with the key it is chosen by", () => {
    mount("navigate");
    const tool = buttons(".tool-switch-button");
    expect(tool.map((button) => button.textContent)).toEqual(["Navigate", "Select"]);
    expect(tool.map((button) => button.getAttribute("aria-pressed"))).toEqual(["true", "false"]);
    expect(tool.map((button) => button.getAttribute("aria-keyshortcuts"))).toEqual(["N", "S"]);
    mount("select");
    expect(buttons(".tool-switch-button").map((button) => button.getAttribute("aria-pressed"))).toEqual(["false", "true"]);
  });

  // RECORDED MUTATION for "the one line per tool": in ToolSwitch.tsx's TOOLS give Navigate Select's statement (`click: "a click changes the selection, by the
  // mode."`). Expected failure: the Navigate line says a click changes the selection.
  // OBSERVED AT f49599353db52445c07e941e326c73f0c44a8925: FAILED -- "states in one line what a click does in each tool, and each button points at its own line":
  //   AssertionError: expected '[P6 placeholder] Navigate (N): a clic…' to contain 'Navigate (N): a click inspects the fe…'. Reverted after observing.
  it("states in one line what a click does in each tool, and each button points at its own line", () => {
    mount("navigate");
    const hints = buttons(".tool-switch-button").map((button) => container.querySelector(`#${button.getAttribute("aria-describedby")}`)?.textContent);
    expect(hints[0]).toContain("Navigate (N): a click inspects the feature.");
    expect(hints[1]).toContain("Select (S): a click changes the selection, by the mode.");
    expect(container.querySelectorAll(".tool-switch-hint")).toHaveLength(2);
  });

  // RECORDED MUTATION for "choosing a tool": in ToolSwitch.tsx call `onSelectTool` with the other tool. Expected failure: a click on Select hands over navigate.
  // OBSERVED AT f49599353db52445c07e941e326c73f0c44a8925: FAILED -- "a click on a tool button hands that tool to onSelectTool":
  //   AssertionError: expected [ 'navigate', 'select' ] to deeply equal [ 'select', 'navigate' ]. Reverted after observing.
  it("a click on a tool button hands that tool to onSelectTool", () => {
    mount("navigate");
    const [navigate, select] = buttons(".tool-switch-button");
    act(() => select.click());
    act(() => navigate.click());
    expect(tools).toEqual(["select", "navigate"]);
  });

  // RECORDED MUTATION for "the mode picker": in ToolSwitch.tsx render the picker in both tools (drop the `tool === "select" &&` test). Expected failure: the
  // picker is present in Navigate.
  // OBSERVED AT f49599353db52445c07e941e326c73f0c44a8925: FAILED -- "shows the mode picker only while Select is active, with the four approved labels":
  //   AssertionError: expected <div …(3)>…(4)</div> to be null. Reverted after observing.
  it("shows the mode picker only while Select is active, with the four approved labels", () => {
    mount("navigate");
    expect(container.querySelector(".tool-switch-modes")).toBeNull();
    mount("select");
    expect(buttons(".tool-switch-mode").map((button) => button.textContent)).toEqual(["Add / remove", "Replace", "Add only", "Remove only"]);
  });

  // RECORDED MUTATION for "choosing a mode": in ToolSwitch.tsx hand over the pressed mode instead of the clicked one (`onSelectMode(mode)`). Expected failure: a click on
  // Replace hands over toggle.
  // OBSERVED AT f49599353db52445c07e941e326c73f0c44a8925: FAILED -- "the pressed mode follows the mode, and a click on a mode hands that mode to onSelectMode":
  //   AssertionError: expected [ 'add', 'add' ] to deeply equal [ 'replace', 'remove' ]. Reverted after observing.
  it("the pressed mode follows the mode, and a click on a mode hands that mode to onSelectMode", () => {
    mount("select", "add");
    expect(buttons(".tool-switch-mode").map((button) => button.getAttribute("aria-pressed"))).toEqual(["false", "false", "true", "false"]);
    act(() => buttons(".tool-switch-mode")[1].click());
    act(() => buttons(".tool-switch-mode")[3].click());
    expect(modes).toEqual(["replace", "remove"]);
  });
});
