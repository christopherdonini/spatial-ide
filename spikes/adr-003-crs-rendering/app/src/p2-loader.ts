// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { tableFromIPC } from "apache-arrow";

// M4: P2 "parcel" polygon dataset. Grid layout, vertex count and extent
// below must mirror src-tauri/src/p2.rs exactly — the M4 scenario's
// visible-subset size (README "M4 scenario definition") is derived from
// this geometry, so a mismatch here would silently mis-predict it.
export const GRID_COLS = 400;
export const GRID_ROWS = 250;
export const POLYGON_COUNT = GRID_COLS * GRID_ROWS; // 100,000
export const VERTS_PER_POLYGON = 100;
export const VERTEX_COUNT = POLYGON_COUNT * VERTS_PER_POLYGON; // 10,000,000

export const EXTENT_E: [number, number] = [2_485_000, 2_834_000];
export const EXTENT_N: [number, number] = [1_075_000, 1_296_000];
export const CELL_W = (EXTENT_E[1] - EXTENT_E[0]) / GRID_COLS;
export const CELL_H = (EXTENT_N[1] - EXTENT_N[0]) / GRID_ROWS;

/** Analytic centroid of grid cell holding `polygonId` — mirrors p2.rs::polygon_centroid. */
export function polygonCentroid(polygonId: number): [number, number] {
  const col = polygonId % GRID_COLS;
  const row = Math.floor(polygonId / GRID_COLS);
  return [EXTENT_E[0] + (col + 0.5) * CELL_W, EXTENT_N[0] + (row + 0.5) * CELL_H];
}

/** Nearest polygon to an arbitrary EPSG:2056 point — used to pick "the edit target" from a view centre. */
export function nearestPolygonId(e: number, n: number): number {
  const col = Math.min(GRID_COLS - 1, Math.max(0, Math.round((e - EXTENT_E[0]) / CELL_W - 0.5)));
  const row = Math.min(GRID_ROWS - 1, Math.max(0, Math.round((n - EXTENT_N[0]) / CELL_H - 0.5)));
  return row * GRID_COLS + col;
}

export interface P2VertexSet {
  /** Absolute EPSG:2056 metres, exactly as they left Rust. */
  e: Float64Array;
  n: Float64Array;
  /** True global storage index (polygon_id*100 + local_index) — NOT the buffer ordinal. */
  ids: BigUint64Array;
  fetchStart: number;
  fetchDoneAt: number;
}

async function fetchP2Set(url: string): Promise<P2VertexSet> {
  const fetchStart = performance.now();
  const res = await fetch(url);
  if (!res.ok) throw new Error(`P2 fetch failed: ${res.status} ${res.statusText} (${url})`);
  const buf = await res.arrayBuffer();
  const fetchDoneAt = performance.now();
  const table = tableFromIPC(new Uint8Array(buf));
  const eCol = table.getChild("e");
  const nCol = table.getChild("n");
  const idCol = table.getChild("id");
  if (!eCol || !nCol || !idCol) throw new Error(`P2 Arrow table missing e/n/id columns (${url})`);
  return {
    e: eCol.toArray() as Float64Array,
    n: nCol.toArray() as Float64Array,
    ids: idCol.toArray() as BigUint64Array,
    fetchStart,
    fetchDoneAt,
  };
}

/** Full P2 (10,000,000 vertices) — no server-side filtering. */
export async function fetchP2Full(): Promise<P2VertexSet> {
  return fetchP2Set("http://p1.localhost/p2");
}

/** Viewport-culled subset: whole polygons whose centroid falls in the bbox (p2.rs::arrow_ipc_bbox). */
export async function fetchP2Bbox(
  eMin: number,
  nMin: number,
  eMax: number,
  nMax: number,
): Promise<P2VertexSet> {
  return fetchP2Set(`http://p1.localhost/p2?bbox=${eMin},${nMin},${eMax},${nMax}`);
}
