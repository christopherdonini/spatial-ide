// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import {
  DEFAULT_STYLE_STATE,
  MAX_OPACITY,
  MAX_OUTLINE_WIDTH,
  MIN_OPACITY,
  MIN_OUTLINE_WIDTH,
  resolveDrawParameters,
  toStyleDocument,
} from "./document";
import type { StyleState } from "./document";

describe("toStyleDocument (NEXT-CUT.md binding note 5 -- structurally incapable of a refused document)", () => {
  it("produces the exact §5a literal-only shape for the default style", () => {
    expect(toStyleDocument(DEFAULT_STYLE_STATE)).toEqual({
      style_version: 1,
      layer: {
        geometry: "polygon",
        fill_color: { literal: "#4285f4" },
        fill_opacity: { literal: 180 / 255 },
        outline_color: { literal: "#000000" },
        outline_width: { literal: 0 },
      },
    });
  });

  it("lowercases a colour literal -- renderer/src/style.rs's canonical spelling is lowercase only", () => {
    const state: StyleState = { ...DEFAULT_STYLE_STATE, fillColor: "#AA3333", outlineColor: "#FF00FF" };
    const doc = toStyleDocument(state);
    expect(doc.layer.fill_color.literal).toBe("#aa3333");
    expect(doc.layer.outline_color.literal).toBe("#ff00ff");
  });

  it("falls back to #000000 for a colour no control would ever actually supply, rather than emitting a malformed literal", () => {
    const state: StyleState = { ...DEFAULT_STYLE_STATE, fillColor: "rebeccapurple" };
    expect(toStyleDocument(state).layer.fill_color.literal).toBe("#000000");
  });

  it("clamps fill_opacity to [0,1] at construction, never rejects", () => {
    expect(toStyleDocument({ ...DEFAULT_STYLE_STATE, fillOpacity: 1.5 }).layer.fill_opacity.literal).toBe(
      MAX_OPACITY
    );
    expect(toStyleDocument({ ...DEFAULT_STYLE_STATE, fillOpacity: -0.2 }).layer.fill_opacity.literal).toBe(
      MIN_OPACITY
    );
    expect(
      toStyleDocument({ ...DEFAULT_STYLE_STATE, fillOpacity: Number.NaN }).layer.fill_opacity.literal
    ).toBe(MIN_OPACITY);
  });

  it("clamps outline_width to [0,64] at construction, never rejects", () => {
    expect(
      toStyleDocument({ ...DEFAULT_STYLE_STATE, outlineWidth: 1000 }).layer.outline_width.literal
    ).toBe(MAX_OUTLINE_WIDTH);
    expect(
      toStyleDocument({ ...DEFAULT_STYLE_STATE, outlineWidth: -5 }).layer.outline_width.literal
    ).toBe(MIN_OUTLINE_WIDTH);
  });

  it("every produced document is exactly the fixed key set -- never a match, never an extra key", () => {
    const json = JSON.stringify(toStyleDocument(DEFAULT_STYLE_STATE));
    expect(json).not.toContain("match");
    expect(Object.keys(toStyleDocument(DEFAULT_STYLE_STATE))).toEqual(["style_version", "layer"]);
    expect(Object.keys(toStyleDocument(DEFAULT_STYLE_STATE).layer)).toEqual([
      "geometry",
      "fill_color",
      "fill_opacity",
      "outline_color",
      "outline_width",
    ]);
  });
});

describe("resolveDrawParameters (the parse direction, via the imported resolver)", () => {
  it("round-trips the default style through Style.parse without throwing, and returns its own literals back", () => {
    expect(resolveDrawParameters(DEFAULT_STYLE_STATE)).toEqual({
      fillColor: "#4285f4",
      fillOpacity: 180 / 255,
      outlineColor: "#000000",
      outlineWidth: 0,
    });
  });
});

// ---------------------------------------------------------------------------------------------
// The shared cross-implementation vector (NEXT-CUT.md binding note 2 / P1 item 3): the shell joins
// as a THIRD READER of `renderer/tests/data/style-agreement.json` -- the same file
// `renderer/bundle-viewer/scripts/style-agreement.test.mjs` and `renderer/tests/style_agreement.rs`
// already read, and this file does not modify it.
//
// The vector's own style document is categorical (`match` on `zone`) -- unreachable from this
// shell's producer, which is literal-only by construction (ADR-023: `match` styling is not live).
// What this test instead joins is the vector's `probes`: each names a RESOLVED draw-parameter set
// (`fill_color`, `fill_opacity`, `outline_color`, `outline_width`) that the SAME resolver this
// module imports (`renderer/style-ts/src/style.ts`) already produces for that vector, independent
// of whether a `match` or a `literal` produced it. Treating each probe's resolved values as a
// hypothetical literal `StyleState` and round-tripping it through THIS module's own producer +
// the imported resolver is what proves the shell's producer and the imported resolver agree with
// the vector's own numbers -- the third-reader join binding note 2 asks for, without this module
// ever needing to express a `match` itself.
// ---------------------------------------------------------------------------------------------

interface AgreementProbe {
  key: string | null;
  fill_color: string;
  fill_opacity: number;
  outline_color: string;
  outline_width: number;
}

describe("the shared style-agreement vector, joined as a third reader (renderer/tests/data/style-agreement.json)", () => {
  const vector = JSON.parse(
    readFileSync("../../renderer/tests/data/style-agreement.json", "utf8")
  ) as { probes: AgreementProbe[] };

  it("declares at least one probe -- load-bearing, or every assertion below would pass vacuously", () => {
    expect(vector.probes.length).toBeGreaterThan(0);
  });

  it("every probe's resolved values round-trip through this module's producer + the imported resolver unchanged", () => {
    for (const probe of vector.probes) {
      const state: StyleState = {
        fillColor: probe.fill_color,
        fillOpacity: probe.fill_opacity,
        outlineColor: probe.outline_color,
        outlineWidth: probe.outline_width,
      };
      expect(resolveDrawParameters(state)).toEqual({
        fillColor: probe.fill_color,
        fillOpacity: probe.fill_opacity,
        outlineColor: probe.outline_color,
        outlineWidth: probe.outline_width,
      });
    }
  });
});
