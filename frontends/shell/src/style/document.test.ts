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
  parseStyleState,
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
    expect(doc.layer.fill_color).toEqual({ literal: "#aa3333" });
    expect(doc.layer.outline_color.literal).toBe("#ff00ff");
  });

  it("falls back to #000000 for a colour no control would ever actually supply, rather than emitting a malformed literal", () => {
    const state: StyleState = { ...DEFAULT_STYLE_STATE, fillColor: "rebeccapurple" };
    expect(toStyleDocument(state).layer.fill_color).toEqual({ literal: "#000000" });
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

  it("a style with no fillMatch is exactly the fixed key set -- no match, no extra key", () => {
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

/** The vector's own style as a `StyleState`: what the Colour by apply would hold for the same cases. */
const FILL_MATCH = {
  column: "zone",
  cases: [
    { when: "residential", then: "#aa3333" },
    { when: "industrial", then: "#333388" },
  ],
  onNull: "#888888",
  onUnmatched: "#cccccc",
};

describe("a fill by category (milestone 4 PR B, section 2.3 (a))", () => {
  // RECORDED MUTATION for PB-U1, applied alone: in `fillColorValue` (style/document.ts) drop `on_null` from the emitted match.
  // Expected failure: the written fill_color lacks `on_null`.
  // OBSERVED AT 572bb917d93dd759196be47ddd218762abae1810: FAILED -- "PB-U1: emits section 5a's match, which Style.parse accepts, and no fillMatch gives byte-identical literal output": AssertionError: the fill_color a fillMatch writes: expected { match: { column: 'zone', …(2) } } to deeply equal { match: { column: 'zone', …(3) } }. Reverted after observing.
  // The same mutation also failed, in this file: OBSERVED AT 572bb917d93dd759196be47ddd218762abae1810: FAILED -- "the match is closed at construction: the first of two equal values, at most 64 cases, colours lowercased, and a match with no case is the literal": AssertionError: equal values keep the first: expected { match: { column: 'zone', …(2) } } to deeply equal { match: { column: 'zone', …(3) } }. Reverted after observing.
  // The same mutation also failed, in this file: OBSERVED AT 572bb917d93dd759196be47ddd218762abae1810: FAILED -- "PB-U4: the document equals the vector's style, each probe's key resolves to the probe's colours, and a key keeps its case": AssertionError: the document the shell writes for the vector's style: expected { style_version: 1, layer: { …(5) } } to deeply equal { style_version: 1, layer: { …(5) } }. Reverted after observing.
  it("PB-U1: emits section 5a's match, which Style.parse accepts, and no fillMatch gives byte-identical literal output", () => {
    const state: StyleState = { ...DEFAULT_STYLE_STATE, fillMatch: FILL_MATCH };
    expect(toStyleDocument(state).layer.fill_color, "the fill_color a fillMatch writes").toEqual({
      match: { column: "zone", cases: FILL_MATCH.cases, on_null: "#888888", on_unmatched: "#cccccc" },
    });
    expect(parseStyleState(state).matchColumn, "the column Style.parse reads back").toBe("zone");
    expect(parseStyleState(state).legend.length, "two cases, No value and Other").toBe(4);
    expect(JSON.stringify(toStyleDocument({ ...DEFAULT_STYLE_STATE, fillMatch: null })), "the document with fillMatch null").toBe(
      '{"style_version":1,"layer":{"geometry":"polygon","fill_color":{"literal":"#4285f4"},"fill_opacity":{"literal":0.7058823529411765},"outline_color":{"literal":"#000000"},"outline_width":{"literal":0}}}'
    );
  });

  it("the match is closed at construction: the first of two equal values, at most 64 cases, colours lowercased, and a match with no case is the literal", () => {
    const twice = toStyleDocument({ ...DEFAULT_STYLE_STATE, fillMatch: { ...FILL_MATCH, cases: [{ when: "a", then: "#AA0000" }, { when: "a", then: "#00BB00" }], onNull: "#ABCDEF" } });
    expect(twice.layer.fill_color, "equal values keep the first").toEqual({ match: { column: "zone", cases: [{ when: "a", then: "#aa0000" }], on_null: "#abcdef", on_unmatched: "#cccccc" } });
    const many = Array.from({ length: 70 }, (_, i) => ({ when: `v${i}`, then: "#112233" }));
    const capped = toStyleDocument({ ...DEFAULT_STYLE_STATE, fillMatch: { ...FILL_MATCH, cases: many } }).layer.fill_color;
    expect("match" in capped && capped.match.cases.length, "cases written from 70").toBe(64);
    expect(toStyleDocument({ ...DEFAULT_STYLE_STATE, fillMatch: { ...FILL_MATCH, cases: [] } }).layer.fill_color, "no case").toEqual({ literal: "#4285f4" });
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
// The vector's own style document is categorical (`match` on `zone`), and this shell's producer
// writes a match on the fill since milestone 4 PR B. This file joins the vector two ways. Each
// probe names a RESOLVED draw-parameter set (`fill_color`, `fill_opacity`, `outline_color`,
// `outline_width`) that the SAME resolver this module imports (`renderer/style-ts/src/style.ts`)
// produces for that vector; treating its values as a literal `StyleState` and round-tripping it
// through THIS module's producer and the imported resolver proves they agree with the vector's own
// numbers (the third-reader join binding note 2 asks for). And the vector's match, held as a
// `StyleState` with a `fillMatch`, must produce the vector's document and resolve each probe's key
// to the probe's colours (PB-U4).
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
        fillMatch: null,
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

describe("the vector's match rows through the shell's path (PB-U4)", () => {
  const vector = JSON.parse(readFileSync("../../renderer/tests/data/style-agreement.json", "utf8")) as { style: unknown; probes: AgreementProbe[] };

  // RECORDED MUTATION for PB-U4, applied alone: in `fillColorValue` (style/document.ts) write each case's `when` lowercased.
  // Expected failure: a key no longer keeps its case.
  // OBSERVED AT 572bb917d93dd759196be47ddd218762abae1810: FAILED -- "PB-U4: the document equals the vector's style, each probe's key resolves to the probe's colours, and a key keeps its case": AssertionError: a case keeps its case: expected '#cccccc' to be '#123456' // Object.is equality. Reverted after observing.
  it("PB-U4: the document equals the vector's style, each probe's key resolves to the probe's colours, and a key keeps its case", () => {
    const state: StyleState = { ...DEFAULT_STYLE_STATE, fillOpacity: 0.8, outlineColor: "#202020", outlineWidth: 1, fillMatch: FILL_MATCH };
    expect(toStyleDocument(state), "the document the shell writes for the vector's style").toEqual(vector.style);
    const style = parseStyleState(state);
    for (const probe of vector.probes) {
      const draw = style.resolve(probe.key);
      expect([draw.fillColor, draw.fillOpacity, draw.outlineColor, draw.outlineWidth], `the draw parameters of key ${String(probe.key)}`).toEqual([probe.fill_color, probe.fill_opacity, probe.outline_color, probe.outline_width]);
      expect(style.groups[style.groupFor(probe.key)], `the group of key ${String(probe.key)}`).toEqual(draw);
    }
    const mixed = parseStyleState({ ...state, fillMatch: { ...FILL_MATCH, cases: [{ when: "Zone-A", then: "#123456" }] } });
    expect(mixed.resolve("Zone-A").fillColor, "a case keeps its case").toBe("#123456");
    expect(mixed.resolve("zone-a").fillColor, "the same text in lower case is another value").toBe("#cccccc");
  });
});
