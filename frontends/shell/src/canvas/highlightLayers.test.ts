// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it } from "vitest";

import { batchForLayerId, layerId } from "./buildLayers";
import type { Part, ResidentBatch } from "./decodeBatch";
import {
  buildHighlightLayers,
  createDrawnEmitter,
  HIGHLIGHT_BOTH_OUTER_RING_RADIUS_PX,
  HIGHLIGHT_BOTH_UNDERLAY_WIDTH_PX,
  HIGHLIGHT_OUTLINE_WIDTH_PX,
  HIGHLIGHT_POINT_RING_RADIUS_PX,
  INSPECTED_OUTLINE_RGBA,
  SELECTED_OUTLINE_RGBA,
  type Highlight,
} from "./highlightLayers";
import { OffsetFrame } from "./offsetFrame";
import { partsOfFeatures } from "../testUtils/partsOfPolygons";

/** SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md section 4, UB9 (with Amendment 1 B2, UB9-b): the highlight layers. */
type R = [number, number][];
const ring = (x: number, y: number, size: number): R => [[x, y], [x + size, y], [x + size, y + size], [x, y]];
const O_X = 1000;
const O_Y = 2000;
const frame = (): OffsetFrame => {
  const f = new OffsetFrame(100);
  f.maybeRecenter(O_X, O_Y);
  return f;
};
const set = (...ids: bigint[]): ReadonlySet<bigint> => new Set(ids);
const none: Highlight = { selected: set(), inspected: null };

/** Row 0 (id 1): two parts, the first with a hole. Row 1 (id 2) and row 2 (id 3): one part each. */
const polygons: ResidentBatch = {
  streamHandle: "sh_hl",
  batchSeq: 0,
  ids: BigUint64Array.from([1n, 2n, 3n]),
  ...partsOfFeatures([
    [[ring(1000, 2000, 10), ring(1002, 2002, 2)], [ring(1020, 2020, 5)]],
    [[ring(1100, 2100, 5)]],
    [[ring(1200, 2200, 5)]],
  ]),
  totalVertices: 20,
};
/** A line open: row 0 has two parts (two paths), row 1 one. */
const lines: ResidentBatch = {
  streamHandle: "sh_hl",
  batchSeq: 1,
  ids: BigUint64Array.from([1n, 2n]),
  ...partsOfFeatures([[[ring(1000, 2000, 1)], [ring(1010, 2010, 1)]], [[ring(1100, 2100, 1)]]]),
  totalVertices: 12,
};
/** A point open: each row one part holding one single-position ring. */
const pt = (x: number, y: number): Part[] => [[[[x, y]]]];
const points: ResidentBatch = {
  streamHandle: "sh_pt",
  batchSeq: 0,
  ids: BigUint64Array.from([1n, 2n, 3n]),
  ...partsOfFeatures([pt(1001, 2001), pt(1002, 2002), pt(1003, 2003)]),
  totalVertices: 3,
};
const propsOf = (l: { props: unknown }) => l.props as { id: string; pickable: boolean; data: unknown[]; getWidth?: number; getRadius?: number; getColor?: unknown; getLineColor?: unknown };

describe("UB9: buildHighlightLayers", () => {
  // RECORDED MUTATION for "UB9" (an empty highlight): in `buildHighlightLayers` (highlightLayers.ts) delete the early return
  // (`if (highlight.selected.size === 0 && highlight.inspected === null) return ...`). Expected failure: the batch's `ids` is read.
  // OBSERVED AT b7bb54dd7df1333b1ce192e397644d150bf304f2: FAILED -- "an empty highlight builds nothing and does not look at a batch":
  //   Error: the batch was read for an empty highlight. Reverted after observing.
  it("an empty highlight builds nothing and does not look at a batch", () => {
    const trap = { ...polygons } as ResidentBatch;
    Object.defineProperty(trap, "ids", {
      get() {
        throw new Error("the batch was read for an empty highlight");
      },
    });
    const result = buildHighlightLayers([trap], frame(), none, "polygonal");
    expect(result.layers).toEqual([]);
    expect(result.drawn.size).toBe(0);
  });

  // RECORDED MUTATION for "UB9" (non-pickable): in `pathLayer` (highlightLayers.ts) set `pickable: true`.
  // Expected failure: a highlight layer is pickable.
  // OBSERVED AT b7bb54dd7df1333b1ce192e397644d150bf304f2: FAILED -- "the layers are non-pickable, prefixed, resolve to no batch, and the selected ones come before the inspected":
  //   AssertionError: highlight:selected:sh_hl:0: expected true to be false // Object.is equality. Reverted after observing.
  it("the layers are non-pickable, prefixed, resolve to no batch, and the selected ones come before the inspected", () => {
    const { layers } = buildHighlightLayers([polygons], frame(), { selected: set(1n, 2n), inspected: 3n }, "polygonal");
    expect(layers.map((l) => l.id)).toEqual(["highlight:selected:sh_hl:0", "highlight:inspected:sh_hl:0"]);
    for (const layer of layers) {
      expect(propsOf(layer).pickable, layer.id).toBe(false);
      expect(layer.id.startsWith("highlight:")).toBe(true);
      expect(batchForLayerId([polygons], layer.id)).toBeUndefined();
    }
    expect(layerId(polygons)).toBe("sh_hl:0");
    expect(propsOf(layers[0]).getColor).toEqual(SELECTED_OUTLINE_RGBA);
    expect(propsOf(layers[1]).getColor).toEqual(INSPECTED_OUTLINE_RGBA);
  });

  // RECORDED MUTATION for "UB9" (every part): in `rowGeometry` (highlightLayers.ts) iterate only the row's first part
  // (`for (const rings of batch.parts[row].slice(0, 1)) {`). Expected failure: the two-part row draws one part's paths.
  // OBSERVED AT b7bb54dd7df1333b1ce192e397644d150bf304f2: FAILED -- "every part of a highlighted row is drawn: a polygon's exterior and hole, each part, and each line part":
  //   AssertionError: expected [ …(2) ] to have a length of 3 but got 2. Reverted after observing.
  it("every part of a highlighted row is drawn: a polygon's exterior and hole, each part, and each line part", () => {
    const polygonal = buildHighlightLayers([polygons], frame(), { selected: set(1n), inspected: null }, "polygonal").layers;
    // Row 0: part 0 has an exterior and a hole, part 1 an exterior: three paths.
    expect(propsOf(polygonal[0]).data).toHaveLength(3);
    const line = buildHighlightLayers([lines], frame(), { selected: set(1n), inspected: null }, "line").layers;
    expect(propsOf(line[0]).data, "one path per line part").toHaveLength(2);
  });

  // RECORDED MUTATION for "UB9" (offset-relative): in `rowGeometry` (highlightLayers.ts) the polygonal branch pushes absolute
  // coordinates (`out.push(ring.map(([x, y]) => [x, y] as Position))`). Expected failure: the positions are not minus the origin.
  // OBSERVED AT b7bb54dd7df1333b1ce192e397644d150bf304f2: FAILED -- "positions are offset-relative, computed in f64 against the frame's origin (ADR-010 rule 3)":
  //   AssertionError: expected [ Array(4) ] to deeply equal [ [ 100, 100 ], [ 105, 100 ], …(2) ]. Reverted after observing.
  it("positions are offset-relative, computed in f64 against the frame's origin (ADR-010 rule 3)", () => {
    const f = frame();
    const { layers } = buildHighlightLayers([polygons], f, { selected: set(2n), inspected: null }, "polygonal");
    expect(propsOf(layers[0]).data[0]).toEqual(ring(1100, 2100, 5).map(([x, y]) => [x - O_X, y - O_Y]));
  });

  // RECORDED MUTATION for "UB9" (the drawn set): in `buildHighlightLayers` (highlightLayers.ts) add every selected id to the drawn
  // set (`for (const id of highlight.selected) drawn.add(id);` after the scan). Expected failure: the id 99, which is not resident, is drawn.
  // OBSERVED AT b7bb54dd7df1333b1ce192e397644d150bf304f2: FAILED -- "the drawn set is the highlighted ids that are resident, found in the same pass":
  //   AssertionError: expected [ 1n, 3n, 99n ] to deeply equal [ 1n, 3n ]. Reverted after observing.
  it("the drawn set is the highlighted ids that are resident, found in the same pass", () => {
    const { drawn } = buildHighlightLayers([polygons, lines], frame(), { selected: set(1n, 99n), inspected: 3n }, "polygonal");
    expect([...drawn].sort()).toEqual([1n, 3n]);
    expect(buildHighlightLayers([polygons], frame(), { selected: set(99n), inspected: null }, "polygonal").drawn.size).toBe(0);
  });

  // RECORDED MUTATION for "UB9" (the cache): in `scanBatch` (highlightLayers.ts) make the cache never hit (`false &&` among the conditions of `if (cached && ...) return cached;`).
  // Expected failure: a second call hands the layer a rebuilt data array.
  // OBSERVED AT b7bb54dd7df1333b1ce192e397644d150bf304f2: FAILED -- "an unchanged batch under the same highlight and origin is not rescanned; a new selection set is":
  //   AssertionError: expected [ …(3) ] to be [ …(3) ] // Object.is equality. Reverted after observing.
  it("an unchanged batch under the same highlight and origin is not rescanned; a new selection set is", () => {
    const f = frame();
    const selected = set(1n);
    const first = propsOf(buildHighlightLayers([polygons], f, { selected, inspected: null }, "polygonal").layers[0]).data;
    const again = propsOf(buildHighlightLayers([polygons], f, { selected, inspected: null }, "polygonal").layers[0]).data;
    expect(again).toBe(first);
    const another = propsOf(buildHighlightLayers([polygons], f, { selected: set(1n), inspected: null }, "polygonal").layers[0]).data;
    expect(another).not.toBe(first);
    expect(another).toEqual(first);
  });
});

describe("UB9 with Amendment 1 B2: a feature that is both selected and inspected shows both", () => {
  // RECORDED MUTATION for "UB9-b": in `buildHighlightLayers` (highlightLayers.ts) draw a both feature's selected outline at the
  // ordinary width (the `selected-both` path layer is built with `HIGHLIGHT_OUTLINE_WIDTH_PX`). Expected failure: the width is 3 where 7 is expected.
  // OBSERVED AT b7bb54dd7df1333b1ce192e397644d150bf304f2: FAILED -- "a polygon that is both: the selected outline at 7 px beneath the inspected one at 3 px, later in the list; only selected is 3 px":
  //   AssertionError: selected, and inspected: expected 3 to be 7 // Object.is equality. Reverted after observing.
  it("a polygon that is both: the selected outline at 7 px beneath the inspected one at 3 px, later in the list; only selected is 3 px", () => {
    const { layers } = buildHighlightLayers([polygons], frame(), { selected: set(1n, 2n), inspected: 2n }, "polygonal");
    const byId = new Map(layers.map((l) => [l.id, propsOf(l)]));
    expect(byId.get("highlight:selected:sh_hl:0")?.getWidth, "selected only").toBe(HIGHLIGHT_OUTLINE_WIDTH_PX);
    expect(byId.get("highlight:selected-both:sh_hl:0")?.getWidth, "selected, and inspected").toBe(HIGHLIGHT_BOTH_UNDERLAY_WIDTH_PX);
    expect(byId.get("highlight:inspected:sh_hl:0")?.getWidth).toBe(HIGHLIGHT_OUTLINE_WIDTH_PX);
    const order = layers.map((l) => l.id);
    expect(order.indexOf("highlight:inspected:sh_hl:0")).toBeGreaterThan(order.indexOf("highlight:selected-both:sh_hl:0"));
    expect([HIGHLIGHT_BOTH_UNDERLAY_WIDTH_PX, HIGHLIGHT_OUTLINE_WIDTH_PX]).toEqual([7, 3]);
  });

  // RECORDED MUTATION for "UB9-b" (a point): in `buildHighlightLayers` (highlightLayers.ts) draw a both point's selected ring at the
  // ordinary radius (`HIGHLIGHT_POINT_RING_RADIUS_PX` for `selected-both`). Expected failure: the radius is 7 where 11 is expected.
  // OBSERVED AT b7bb54dd7df1333b1ce192e397644d150bf304f2: FAILED -- "a point that is both: the selected ring at 11 px outside the inspected ring at 7 px; only selected is 7 px":
  //   AssertionError: expected 7 to be 11 // Object.is equality. Reverted after observing.
  it("a point that is both: the selected ring at 11 px outside the inspected ring at 7 px; only selected is 7 px", () => {
    const { layers } = buildHighlightLayers([points], frame(), { selected: set(1n, 2n), inspected: 2n }, "point");
    const byId = new Map(layers.map((l) => [l.id, propsOf(l)]));
    expect(byId.get("highlight:selected:sh_pt:0")?.getRadius, "selected only").toBe(HIGHLIGHT_POINT_RING_RADIUS_PX);
    expect(byId.get("highlight:selected-both:sh_pt:0")?.getRadius).toBe(HIGHLIGHT_BOTH_OUTER_RING_RADIUS_PX);
    expect(byId.get("highlight:inspected:sh_pt:0")?.getRadius).toBe(HIGHLIGHT_POINT_RING_RADIUS_PX);
    expect([HIGHLIGHT_BOTH_OUTER_RING_RADIUS_PX, HIGHLIGHT_POINT_RING_RADIUS_PX]).toEqual([11, 7]);
    expect(byId.get("highlight:selected-both:sh_pt:0")?.data).toEqual([[1002 - O_X, 2002 - O_Y]]);
  });
});

describe("UB9 (drawn set): onSelectionDrawnChange fires only when the drawn set changes (section 2.2)", () => {
  const emitterWithLog = (): { log: ReadonlySet<bigint>[]; pass: (drawn: ReadonlySet<bigint>) => void } => {
    const log: ReadonlySet<bigint>[] = [];
    return { log, pass: createDrawnEmitter((drawn) => log.push(drawn)) };
  };

  // RECORDED MUTATION for "UB9 (drawn set)" (a pass that changed nothing): in `createDrawnEmitter` (highlightLayers.ts) emit on every pass
  // (delete the `if (sameIds(last, drawn)) return;` line). Expected failure: an empty first pass and an equal set are emitted too.
  // OBSERVED AT 6488360ffa1f58bf392e731f605e5a7255d24260: FAILED -- "an empty first pass and a pass with the same ids emit nothing; a new set, and a clear to empty, emit":
  //   AssertionError: the empty first pass: expected [ Set{} ] to have a length of +0 but got 1. Reverted after observing.
  it("an empty first pass and a pass with the same ids emit nothing; a new set, and a clear to empty, emit", () => {
    const { log, pass } = emitterWithLog();
    pass(set());
    expect(log, "the empty first pass").toHaveLength(0);
    pass(set(1n, 2n));
    expect(log).toHaveLength(1);
    pass(set(2n, 1n));
    expect(log, "the same ids, another identity and order").toHaveLength(1);
    pass(set(1n));
    expect(log).toHaveLength(2);
    pass(set());
    expect(log, "a clear to empty").toHaveLength(3);
    pass(set());
    expect(log.map((s) => [...s])).toEqual([[1n, 2n], [1n], []]);
  });

  // RECORDED MUTATION for "UB9 (drawn set)" (same size, other ids): in `sameIds` (highlightLayers.ts) compare the sizes only (return
  // `a.size === b.size`). Expected failure: {1, 2} followed by {3, 4} is not emitted.
  // OBSERVED AT 6488360ffa1f58bf392e731f605e5a7255d24260: FAILED -- "a set of the same size with other ids is a change":
  //   AssertionError: expected [ [ 1n, 2n ] ] to deeply equal [ [ 1n, 2n ], [ 3n, 4n ] ]. Reverted after observing.
  it("a set of the same size with other ids is a change", () => {
    const { log, pass } = emitterWithLog();
    pass(set(1n, 2n));
    pass(set(3n, 4n));
    expect(log.map((s) => [...s])).toEqual([[1n, 2n], [3n, 4n]]);
  });
});
