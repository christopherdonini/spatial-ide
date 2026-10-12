// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { COORDINATE_SYSTEM, Position } from "@deck.gl/core";
import { PathLayer, ScatterplotLayer } from "@deck.gl/layers";

import { layerId, POINT_RADIUS_PX } from "./buildLayers";
import type { GeometryKind, ResidentBatch } from "./decodeBatch";
import type { OffsetFrame } from "./offsetFrame";

/**
 * SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md section 2.2, "Highlight drawing" (plan section 6.6; ADR-010 rule 4: a
 * small separate layer drawn last). The selected and the inspected features are drawn as outlines (a ring for a point)
 * in two solid encodings, over the data layers and never inside them: no data layer is rebuilt for a selection.
 *
 * **Declared values (section 7; ADR-010 rule 6).** The two colours are P6 placeholders the human sights at the sitting
 * (Amendment 1 A4, Outlines): solid, since a dashed line needs a dependency (I2).
 */

/** The selected feature's outline colour (RGBA, 0-255). Bounds nothing but the encoding: it must differ from the inspected one. */
export const SELECTED_OUTLINE_RGBA: [number, number, number, number] = [0, 90, 255, 255];
/** The inspected feature's outline colour (RGBA, 0-255). */
export const INSPECTED_OUTLINE_RGBA: [number, number, number, number] = [255, 170, 0, 255];
/** The width of a polygon or line outline, and the stroke of a point ring, in CSS pixels. */
export const HIGHLIGHT_OUTLINE_WIDTH_PX = 3;
/** The radius of a point ring, in CSS pixels: the symbol's radius (`POINT_RADIUS_PX`) plus the 3 px stroke. */
export const HIGHLIGHT_POINT_RING_RADIUS_PX = POINT_RADIUS_PX + 3;
/** A polygon or line that is both selected and inspected draws its selected outline at this width beneath its inspected
 * outline at `HIGHLIGHT_OUTLINE_WIDTH_PX`, which leaves 2 px of the selected colour on each side (Amendment 1 B2). */
export const HIGHLIGHT_BOTH_UNDERLAY_WIDTH_PX = 7;
/** A point that is both draws its selected ring at this radius, outside its inspected ring at `HIGHLIGHT_POINT_RING_RADIUS_PX`. */
export const HIGHLIGHT_BOTH_OUTER_RING_RADIUS_PX = 11;

/** What the canvas highlights: the selected feature ids, and the one inspected id. */
export interface Highlight {
  readonly selected: ReadonlySet<bigint>;
  readonly inspected: bigint | null;
}

export type HighlightLayer = PathLayer<Position[]> | ScatterplotLayer<Position>;

export interface HighlightResult {
  /** Appended after the data layers: the selected layers, then the inspected ones. Never pickable, ids prefixed `highlight:`. */
  readonly layers: HighlightLayer[];
  /** The ids among the selected and the inspected that are resident in `batches`, found in the same pass that builds the layers. */
  readonly drawn: ReadonlySet<bigint>;
}

const NOTHING_DRAWN: ReadonlySet<bigint> = new Set();

/** Three roles, each its own layer per batch so that a layer carries one width: selected only, selected and inspected,
 * and inspected (the last drawn on top). Offset-relative geometry, built in f64 before any narrowing (ADR-010 rule 3). */
interface RoleGeometry {
  selected: Position[][];
  selectedBoth: Position[][];
  inspected: Position[][];
  /** For a point open the same three, one position per feature part. */
  selectedPoints: Position[];
  selectedBothPoints: Position[];
  inspectedPoints: Position[];
}

interface CachedHighlight {
  selectedSet: ReadonlySet<bigint>;
  inspected: bigint | null;
  kind: GeometryKind;
  originX: number;
  originY: number;
  geometry: RoleGeometry;
  drawn: bigint[];
}

/** Keyed by batch identity, like `buildLayers.ts`'s caches: an unchanged batch under an unchanged highlight and origin is
 * not rescanned, so a pan that adds one tile scans only that tile. A new selection set, a new origin or a new batch misses. */
const highlightCache = new WeakMap<ResidentBatch, CachedHighlight>();

function rowGeometry(batch: ResidentBatch, row: number, kind: GeometryKind, frame: OffsetFrame): Position[][] {
  const out: Position[][] = [];
  for (const rings of batch.parts[row]) {
    if (kind === "point") out.push([frame.toLocal(rings[0][0][0], rings[0][0][1]) as Position]);
    else if (kind === "line") out.push(rings[0].map(([x, y]) => frame.toLocal(x, y) as Position));
    else for (const ring of rings) out.push(ring.map(([x, y]) => frame.toLocal(x, y) as Position));
  }
  return out;
}

function scanBatch(batch: ResidentBatch, frame: OffsetFrame, highlight: Highlight, kind: GeometryKind): CachedHighlight {
  const cached = highlightCache.get(batch);
  if (
    cached &&
    cached.selectedSet === highlight.selected &&
    cached.inspected === highlight.inspected &&
    cached.kind === kind &&
    cached.originX === frame.originX &&
    cached.originY === frame.originY
  ) {
    return cached;
  }
  const geometry: RoleGeometry = {
    selected: [], selectedBoth: [], inspected: [], selectedPoints: [], selectedBothPoints: [], inspectedPoints: [],
  };
  const drawn: bigint[] = [];
  for (let row = 0; row < batch.ids.length; row++) {
    const id = batch.ids[row];
    const isSelected = highlight.selected.has(id);
    const isInspected = highlight.inspected === id;
    if (!isSelected && !isInspected) continue;
    drawn.push(id);
    const items = rowGeometry(batch, row, kind, frame);
    const into = (paths: Position[][], points: Position[]): void => {
      if (kind === "point") for (const item of items) points.push(item[0]);
      else paths.push(...items);
    };
    if (isSelected && isInspected) into(geometry.selectedBoth, geometry.selectedBothPoints);
    else if (isSelected) into(geometry.selected, geometry.selectedPoints);
    if (isInspected) into(geometry.inspected, geometry.inspectedPoints);
  }
  const fresh: CachedHighlight = {
    selectedSet: highlight.selected, inspected: highlight.inspected, kind, originX: frame.originX, originY: frame.originY, geometry, drawn,
  };
  highlightCache.set(batch, fresh);
  return fresh;
}

function pathLayer(id: string, data: Position[][], color: [number, number, number, number], width: number): PathLayer<Position[]> {
  return new PathLayer<Position[]>({
    id, data, getPath: (d) => d, coordinateSystem: COORDINATE_SYSTEM.CARTESIAN, pickable: false,
    widthUnits: "pixels", getColor: color, getWidth: width, jointRounded: true, capRounded: true,
  });
}

function ringLayer(id: string, data: Position[], color: [number, number, number, number], radius: number): ScatterplotLayer<Position> {
  return new ScatterplotLayer<Position>({
    id, data, getPosition: (d) => d, coordinateSystem: COORDINATE_SYSTEM.CARTESIAN, pickable: false,
    filled: false, stroked: true, radiusUnits: "pixels", getRadius: radius,
    lineWidthUnits: "pixels", getLineWidth: HIGHLIGHT_OUTLINE_WIDTH_PX, getLineColor: color,
  });
}

/**
 * The highlight layers for `batches`, and the ids among the highlighted ones that are resident. With nothing highlighted it
 * returns nothing without looking at a batch. Every part of a highlighted row is drawn (a feature is one id however many
 * parts it has). The ids are prefixed `highlight:` and the layers are not pickable, so `batchForLayerId` can never resolve
 * one: a pick can only ever land on a data layer.
 */
export function buildHighlightLayers(
  batches: readonly ResidentBatch[],
  frame: OffsetFrame,
  highlight: Highlight,
  kind: GeometryKind
): HighlightResult {
  if (highlight.selected.size === 0 && highlight.inspected === null) return { layers: [], drawn: NOTHING_DRAWN };
  const drawn = new Set<bigint>();
  const scans = batches.map((batch) => ({ batch, scan: scanBatch(batch, frame, highlight, kind) }));
  for (const { scan } of scans) for (const id of scan.drawn) drawn.add(id);
  const layers: HighlightLayer[] = [];
  const point = kind === "point";
  for (const { batch, scan } of scans) {
    const g = scan.geometry;
    const id = layerId(batch);
    if (point ? g.selectedPoints.length > 0 : g.selected.length > 0) {
      layers.push(point
        ? ringLayer(`highlight:selected:${id}`, g.selectedPoints, SELECTED_OUTLINE_RGBA, HIGHLIGHT_POINT_RING_RADIUS_PX)
        : pathLayer(`highlight:selected:${id}`, g.selected, SELECTED_OUTLINE_RGBA, HIGHLIGHT_OUTLINE_WIDTH_PX));
    }
    if (point ? g.selectedBothPoints.length > 0 : g.selectedBoth.length > 0) {
      layers.push(point
        ? ringLayer(`highlight:selected-both:${id}`, g.selectedBothPoints, SELECTED_OUTLINE_RGBA, HIGHLIGHT_BOTH_OUTER_RING_RADIUS_PX)
        : pathLayer(`highlight:selected-both:${id}`, g.selectedBoth, SELECTED_OUTLINE_RGBA, HIGHLIGHT_BOTH_UNDERLAY_WIDTH_PX));
    }
  }
  for (const { batch, scan } of scans) {
    const g = scan.geometry;
    if (point ? g.inspectedPoints.length === 0 : g.inspected.length === 0) continue;
    layers.push(point
      ? ringLayer(`highlight:inspected:${layerId(batch)}`, g.inspectedPoints, INSPECTED_OUTLINE_RGBA, HIGHLIGHT_POINT_RING_RADIUS_PX)
      : pathLayer(`highlight:inspected:${layerId(batch)}`, g.inspected, INSPECTED_OUTLINE_RGBA, HIGHLIGHT_OUTLINE_WIDTH_PX));
  }
  return { layers, drawn };
}

/** Whether two id sets hold the same ids, whatever their identity or order. */
function sameIds(a: ReadonlySet<bigint>, b: ReadonlySet<bigint>): boolean {
  if (a.size !== b.size) return false;
  for (const id of a) if (!b.has(id)) return false;
  return true;
}

/**
 * The canvas's `onSelectionDrawnChange` (section 2.2): `render()` hands over each pass's drawn set, and only a set that differs
 * from the one last emitted goes out. The first set is compared with the empty one, so an empty first pass emits nothing, and a
 * clear to empty after a non-empty set does. An emitted set is never changed afterwards.
 */
export function createDrawnEmitter(emit: (drawn: ReadonlySet<bigint>) => void): (drawn: ReadonlySet<bigint>) => void {
  let last: ReadonlySet<bigint> = NOTHING_DRAWN;
  return (drawn) => {
    if (sameIds(last, drawn)) return;
    last = drawn;
    emit(drawn);
  };
}
