// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { act } from "react";
import { createRoot, Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { DEFAULT_STYLE_STATE, parseStyleState } from "./document";
import type { StyleState } from "./document";
import Legend, { LEGEND_NULL_LABEL, LEGEND_OTHER_LABEL } from "./Legend";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

/** The text a swatch's colour reads back as in the DOM (the browser's own normal form of a hex colour). */
function asDom(hex: string): string {
  const probe = document.createElement("span");
  probe.style.backgroundColor = hex;
  return probe.style.backgroundColor;
}

describe("the legend of a fill by category (section 2.3 (f))", () => {
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

  const render = (style: StyleState) => act(() => root.render(<Legend style={style} />));
  const entries = () => [...container.querySelectorAll<HTMLElement>(".style-legend-entry")].map((li) => ({
    label: li.querySelector(".style-legend-label")!.textContent,
    swatch: (li.querySelector(".style-legend-swatch") as HTMLElement).style.backgroundColor,
  }));

  it("PB-R1: lists the style's cases in declared order, then No value, then Other, each with the swatch the resolver drew", () => {
    const style: StyleState = { ...DEFAULT_STYLE_STATE, fillMatch: { column: "zone", cases: [{ when: "park", then: "#00aa00" }, { when: "civic", then: "#ff0000" }, { when: "", then: "#0000ff" }], onNull: "#cccccc", onUnmatched: "#999999" } };
    render(style);
    const parsed = parseStyleState(style);
    expect(entries().map((e) => e.label), "labels in the resolver's legend order").toEqual(["park", "civic", "[P6 placeholder] (empty text)", LEGEND_NULL_LABEL, LEGEND_OTHER_LABEL]);
    expect(entries().map((e) => e.swatch), "swatches the resolver's draw parameters name").toEqual(parsed.legend.map((entry) => asDom(entry.draw.fillColor)));
    expect(entries().map((e) => e.swatch), "the swatches are the cases' colours, then No value and Other").toEqual(["#00aa00", "#ff0000", "#0000ff", "#cccccc", "#999999"].map(asDom));
  });

  it("draws nothing for a one-colour style", () => {
    render(DEFAULT_STYLE_STATE);
    expect(container.querySelector(".style-legend"), "a legend for a literal fill").toBeNull();
  });
});
