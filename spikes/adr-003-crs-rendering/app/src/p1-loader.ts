import { tableFromIPC } from "apache-arrow";

// Must match src-tauri/src/p1.rs — the ground-truth EPSG:2056 extent and the
// fixed origin M1 recenters around before the f32 GPU upload. M2 will need
// dynamic re-centering on the *current* view; this fixed centroid is
// intentionally out of scope until then (M1 only proves the render path and
// frame rate at the dataset's default view).
export const EXTENT_E: [number, number] = [2_485_000, 2_834_000];
export const EXTENT_N: [number, number] = [1_075_000, 1_296_000];
export const ORIGIN_E = (EXTENT_E[0] + EXTENT_E[1]) / 2;
export const ORIGIN_N = (EXTENT_N[0] + EXTENT_N[1]) / 2;

export interface P1Data {
  count: number;
  /** Interleaved [x0,y0,x1,y1,...], EPSG:2056 metres minus (ORIGIN_E, ORIGIN_N). */
  positions: Float32Array;
  fetchStart: number;
  fetchDoneAt: number;
  parseDoneAt: number;
}

/**
 * Fetches P1 over the "p1" custom protocol (Arrow IPC, no JSON — ADR-004)
 * and prepares it for GPU upload.
 *
 * Copy chain from here on (see p1.rs for the Rust-side half): fetch() gives
 * an ArrayBuffer (one OS-level copy already paid crossing the protocol
 * boundary) -> apache-arrow wraps it in typed-array *views*, no further copy
 * -> the f64->f32 recenter below allocates one new Float32Array, the last
 * unavoidable copy before the GPU upload. Never zero-copy end to end, and
 * this module doesn't pretend otherwise.
 */
export async function loadP1(): Promise<P1Data> {
  const fetchStart = performance.now();
  const res = await fetch("http://p1.localhost/points");
  if (!res.ok) {
    throw new Error(`P1 fetch failed: ${res.status} ${res.statusText}`);
  }
  const buf = await res.arrayBuffer();
  const fetchDoneAt = performance.now();

  const table = tableFromIPC(new Uint8Array(buf));
  const eCol = table.getChild("e");
  const nCol = table.getChild("n");
  if (!eCol || !nCol) {
    throw new Error("P1 Arrow table is missing the 'e'/'n' columns");
  }
  const e = eCol.toArray() as Float64Array;
  const n = nCol.toArray() as Float64Array;
  const count = e.length;

  // Offset-relative rendering (ADR-003 technical approach): subtract the
  // origin in f64 (plain JS numbers are f64) before narrowing to f32, so
  // EPSG:2056's ~2.6e6 m eastings don't exhaust float32's ~7-digit budget.
  const positions = new Float32Array(count * 2);
  for (let i = 0; i < count; i++) {
    positions[i * 2] = e[i] - ORIGIN_E;
    positions[i * 2 + 1] = n[i] - ORIGIN_N;
  }
  const parseDoneAt = performance.now();

  return { count, positions, fetchStart, fetchDoneAt, parseDoneAt };
}
