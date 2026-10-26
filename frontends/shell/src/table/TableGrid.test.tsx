// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { TABLE_OVERSCAN_ROWS, TABLE_ROW_HEIGHT_PX } from "./tableConstants";
import TableGrid from "./TableGrid";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

/** SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md section 4, PC-U5: the grid's roles and keys, and its window (section 2.4 (d)). jsdom lays nothing out, so the grid draws as many rows as its fallback height shows (240 px). */
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

const render = (rowCount: number) =>
  act(() => root.render(<TableGrid label="features" columns={["id", "tag"]} rowCount={rowCount} cellAt={(row, column) => `${row}:${column}`} />));
const press = (key: string, ctrlKey = false) => act(() => void document.activeElement!.dispatchEvent(new KeyboardEvent("keydown", { key, ctrlKey, bubbles: true })));
const focused = (): string | null => document.activeElement?.getAttribute("data-cell") ?? null;
const rows = (): Element[] => [...container.querySelectorAll('[role="row"]')];

describe("PC-U5: the grid's roles and keys; a long result renders only the visible rows plus the overscan", () => {
  // RECORDED MUTATION for "PC-U5": in `TableGrid` draw every row (`const last = rowCount - 1;`). Expected failure: 10,001 rows are in the DOM where fewer than 40 were expected.
  it("PC-U5: 10,000 rows render only the visible ones plus the overscan, with the grid's roles and counts", () => {
    render(10_000);
    const grid = container.querySelector('[role="grid"]')!;
    expect(grid.getAttribute("aria-label")).toBe("features");
    expect(grid.getAttribute("aria-rowcount")).toBe("10001");
    expect(grid.getAttribute("aria-colcount")).toBe("2");
    expect([...container.querySelectorAll('[role="columnheader"]')].map((cell) => cell.textContent)).toEqual(["id", "tag"]);
    const visible = Math.ceil(240 / TABLE_ROW_HEIGHT_PX);
    expect(rows().length).toBeGreaterThan(visible); // the header and the visible rows
    expect(rows().length).toBeLessThanOrEqual(1 + visible + TABLE_OVERSCAN_ROWS + 1);
    expect(rows()[0].getAttribute("aria-rowindex")).toBe("1");
    expect(rows()[1].getAttribute("aria-rowindex")).toBe("2");
    expect(container.querySelectorAll('[role="gridcell"]')).toHaveLength((rows().length - 1) * 2);
    expect(container.querySelectorAll('[role="gridcell"][tabindex="0"]')).toHaveLength(1); // one tab stop
    expect(container.querySelector('[role="gridcell"][tabindex="0"]')!.getAttribute("data-cell")).toBe("0:0");
  });

  it("Arrows, Home, End, PageUp and PageDown move the active cell, which holds the one tab stop and the focus", () => {
    render(10_000);
    act(() => container.querySelector<HTMLElement>('[data-cell="0:0"]')!.focus());
    press("ArrowDown");
    press("ArrowRight");
    expect(focused()).toBe("1:1");
    press("Home");
    expect(focused()).toBe("1:0");
    press("End");
    expect(focused()).toBe("1:1");
    press("PageDown");
    expect(focused()).toBe("10:1"); // one page is the rows the fallback height shows below the header row: floor((240 - 24) / 24) = 9
    press("PageUp");
    expect(focused()).toBe("1:1");
    press("End", true);
    expect(focused()).toBe("9999:1");
    expect(container.querySelectorAll('[role="gridcell"][tabindex="0"]')).toHaveLength(1);
    expect(container.querySelector('[role="gridcell"][tabindex="0"]')!.getAttribute("data-cell")).toBe("9999:1");
    press("Home", true);
    expect(focused()).toBe("0:0");
  });

  it("an empty result draws the header and no rows", () => {
    render(0);
    expect(container.querySelector('[role="grid"]')!.getAttribute("aria-rowcount")).toBe("1");
    expect(rows()).toHaveLength(1);
  });
});
