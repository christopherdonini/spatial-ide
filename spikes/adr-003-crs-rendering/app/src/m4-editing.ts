import { COORDINATE_SYSTEM, Deck, OrthographicView } from "@deck.gl/core";
import { ScatterplotLayer } from "@deck.gl/layers";
import { invoke } from "@tauri-apps/api/core";
import { percentile } from "./benchmark";
import {
  CELL_H,
  CELL_W,
  EXTENT_E,
  EXTENT_N,
  fetchP2Bbox,
  fetchP2Full,
  nearestPolygonId,
  polygonCentroid,
  VERTS_PER_POLYGON,
  type P2VertexSet,
} from "./p2-loader";

// M4 — P2 polygons + vertex-drag editing. Scenario, budgets and design
// rationale are pre-registered in the README ("M4 scenario definition
// (written before measuring)") before this file existed; read that first,
// this is the implementation of exactly what it declares.

// M2/M3's 1:500 is a category error for parcel-scale content (see README) —
// M4 declares its own scale, on the spike's actual 800x600 native window
// (tauri.conf.json), settled and pinned the same way M2/M3 do.
const SCALE_DENOMINATOR = 20_000;
const M_PER_PX = (SCALE_DENOMINATOR * 0.0254) / 96;
const PX_PER_M = 1 / M_PER_PX;
const ZOOM = Math.log2(PX_PER_M);

const BUDGET_FRAME_MS = 16;
/** Reused from M2 — same offset-relative rendering, same budget. */
const BUDGET_PRECISION_PX = 0.5;

/** Synthetic drag path: a small circle in absolute f64 EPSG:2056 around the vertex's true coordinate. */
const DRAG_RADIUS_M = 2.0;
const DRAG_PERIOD_MS = 3000;

const GRADED_WARMUP_MS = 1000;
const GRADED_TARGET_SAMPLES = 150;
const GRADED_MAX_BENCHMARK_MS = 20_000;
/**
 * Full-P2-visible is expected slow (M1.5 precedent) and is a reported finding, not graded — smaller
 * sample budget. Also trimmed as one of several mitigations (with reordering the origin-swap test
 * earlier and reducing PICK_LATENCY_SAMPLES below) for a reproducible smoke-testing stall on this
 * hardware (Intel UHD 630 / ANGLE-D3D11): repeated runs blocked somewhere in the harness's tail end,
 * at a roughly fixed wall-clock offset from launch (~17-20 s) rather than at a fixed iteration count
 * of any one operation — the JS event loop itself (including a 30 s setTimeout guard) stopped
 * advancing, which points at a blocked driver call, not a script-level bug. Named rather than
 * silently avoided — see README scope limits for the full investigation.
 */
const REPORTED_TARGET_SAMPLES = 20;
const REPORTED_MAX_BENCHMARK_MS = 10_000;

const PICK_RADIUS_PX = 6;
const PICK_LATENCY_SAMPLES = 12;

/** M2's forced-recentre-crossing mechanism, reused: far smaller than the budget-derived threshold so a crossing is guaranteed. */
const CROSSING_DELTA_M = 500;
const CHUNK_VERTICES = 200_000;

const WINDOW_PX = 41;
const CAPTURE_TIMEOUT_MS = 5000;
const MIN_CENTROID_WEIGHT = 500;

const STATIC_COLOR: [number, number, number] = [200, 200, 200];
const OVERLAY_COLOR: [number, number, number] = [255, 90, 90];

function setStatus(s: string) {
  const el = document.querySelector<HTMLParagraphElement>("#m4-status");
  if (el) el.textContent = s;
}

function appendLog(line: string) {
  const el = document.querySelector<HTMLPreElement>("#m4-log");
  if (el) el.textContent = (el.textContent ? el.textContent + "\n" : "") + line;
  console.log("[M4]", line);
}

// ---- shared small helpers ------------------------------------------------

function makeData(positions: Float32Array, count: number) {
  return { length: count, attributes: { getPosition: { value: positions, size: 2 } } };
}

type LayerData = ReturnType<typeof makeData>;

function vertexLayer(id: string, data: LayerData, color: [number, number, number], pickable: boolean) {
  return new ScatterplotLayer({
    id,
    data,
    // Stated rather than left to the default, same as M2/M3: no Web
    // Mercator anywhere on this path (docs/01, CRS is a type).
    coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
    pickable,
    radiusUnits: "pixels",
    getRadius: 3,
    radiusMinPixels: 2,
    radiusMaxPixels: 20,
    getFillColor: color,
  });
}

/** Absolute f64 EPSG:2056 -> interleaved f32 offsets from (originE, originN). Same operation as offset-frame.ts's offsetPositions, inlined here so the O(N) cost below is measured directly rather than through another module's function-call boundary. */
function offsetPositionsSync(e: Float64Array, n: Float64Array, originE: number, originN: number): { positions: Float32Array; wallMs: number } {
  const t0 = performance.now();
  const positions = new Float32Array(e.length * 2);
  for (let i = 0; i < e.length; i++) {
    positions[i * 2] = e[i] - originE;
    positions[i * 2 + 1] = n[i] - originN;
  }
  return { positions, wallMs: performance.now() - t0 };
}

/** Same rebuild, spread across requestAnimationFrame chunks so no single frame does all N writes (docs/01 principle 7, never block the canvas). */
function offsetPositionsChunked(
  e: Float64Array,
  n: Float64Array,
  originE: number,
  originN: number,
  chunkVertices: number,
): Promise<{ positions: Float32Array; totalMs: number; chunkMsSamples: number[] }> {
  return new Promise((resolve) => {
    const count = e.length;
    const positions = new Float32Array(count * 2);
    let i = 0;
    const chunkMsSamples: number[] = [];
    const start = performance.now();
    function step() {
      const t0 = performance.now();
      const end = Math.min(count, i + chunkVertices);
      for (; i < end; i++) {
        positions[i * 2] = e[i] - originE;
        positions[i * 2 + 1] = n[i] - originN;
      }
      chunkMsSamples.push(performance.now() - t0);
      if (i < count) {
        requestAnimationFrame(step);
      } else {
        resolve({ positions, totalMs: performance.now() - start, chunkMsSamples });
      }
    }
    requestAnimationFrame(step);
  });
}

function average(xs: number[]): number {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : NaN;
}

// ---- drag benchmark -------------------------------------------------------

interface DragBenchmarkResult {
  frameTimeP50Ms: number;
  frameTimeP95Ms: number;
  frameCount: number;
  benchmarkElapsedMs: number;
  finalOverlayE: number;
  finalOverlayN: number;
  timedOut: boolean;
}

/** Hard ceiling on a single drag benchmark's wall-clock time, well past its own maxBenchmarkMs (README scenario definition names the chunked-rebuild's non-cancellability as a known gap in the same spirit — this is the analogous guard for the drag loop: a stalled rAF loop, whatever its cause, must not block the rest of the harness indefinitely, docs/01 principle 7). On timeout the benchmark's own promise is abandoned (not cancelled — deck.gl's Deck instance and its rAF chain, if still alive, keep running detached) and a zero-sample fallback is reported instead of blocking the run. */
const DRAG_BENCHMARK_TIMEOUT_MS = 30_000;

async function runDragBenchmarkBounded(
  canvas: HTMLCanvasElement,
  staticData: LayerData,
  staticLayerId: string,
  overlayPolygon: { e: Float64Array; n: Float64Array },
  originE: number,
  originN: number,
  opts: { warmupMs: number; targetSamples: number; maxBenchmarkMs: number },
): Promise<DragBenchmarkResult> {
  const result = await withTimeout(
    runDragBenchmark(canvas, staticData, staticLayerId, overlayPolygon, originE, originN, opts),
    DRAG_BENCHMARK_TIMEOUT_MS,
  );
  if (result === "timeout") {
    appendLog(`drag benchmark (${staticLayerId}) timed out after ${DRAG_BENCHMARK_TIMEOUT_MS} ms -- reporting zero samples`);
    return {
      frameTimeP50Ms: NaN,
      frameTimeP95Ms: NaN,
      frameCount: 0,
      benchmarkElapsedMs: NaN,
      finalOverlayE: overlayPolygon.e[0],
      finalOverlayN: overlayPolygon.n[0],
      timedOut: true,
    };
  }
  return { ...result, timedOut: false };
}

/**
 * Self-driving vertex-drag benchmark, same idiom as benchmark.ts's
 * runPanZoomBenchmark (self-driven because there is no browser-automation
 * path into the native WebView2 window) but driving a synthetic pointer
 * drag on one vertex instead of camera pan/zoom.
 *
 * `staticData`'s `data`/attribute-value reference is constructed once by
 * the caller and passed in unchanged — it is never rebuilt here, which is
 * the entire point being measured (README: "vertex drag updates only the
 * overlay buffers"). The overlay gets a *fresh* Float32Array every frame so
 * deck.gl's reference-diffing actually re-uploads it (the opposite need
 * from the static layer, same mechanism M2 documented).
 */
function runDragBenchmark(
  canvas: HTMLCanvasElement,
  staticData: LayerData,
  staticLayerId: string,
  overlayPolygon: { e: Float64Array; n: Float64Array },
  originE: number,
  originN: number,
  opts: { warmupMs: number; targetSamples: number; maxBenchmarkMs: number },
): Promise<DragBenchmarkResult> {
  const dragOrigE = overlayPolygon.e[0];
  const dragOrigN = overlayPolygon.n[0];
  let finalOverlayE = dragOrigE;
  let finalOverlayN = dragOrigN;

  function overlayData(t: number): LayerData {
    const angle = (t / DRAG_PERIOD_MS) * Math.PI * 2;
    const e0 = dragOrigE + DRAG_RADIUS_M * Math.cos(angle);
    const n0 = dragOrigN + DRAG_RADIUS_M * Math.sin(angle);
    finalOverlayE = e0;
    finalOverlayN = n0;
    const positions = new Float32Array(overlayPolygon.e.length * 2);
    for (let i = 0; i < overlayPolygon.e.length; i++) {
      const e = i === 0 ? e0 : overlayPolygon.e[i];
      const n = i === 0 ? n0 : overlayPolygon.n[i];
      positions[i * 2] = e - originE;
      positions[i * 2 + 1] = n - originN;
    }
    return makeData(positions, overlayPolygon.e.length);
  }

  return new Promise((resolve) => {
    let animStart = 0;
    let lastFrameAt: number | null = null;
    let benchmarkDone = false;
    let benchmarkElapsedMs = 0;
    const frameTimes: number[] = [];

    function tick() {
      const t = performance.now() - animStart;
      const warmedUp = t >= opts.warmupMs;
      const enoughSamples = frameTimes.length >= opts.targetSamples;
      if ((warmedUp && enoughSamples) || t > opts.maxBenchmarkMs) {
        benchmarkDone = true;
        benchmarkElapsedMs = t;
        finish();
        return;
      }
      deck.setProps({
        layers: [
          vertexLayer(staticLayerId, staticData, STATIC_COLOR, true),
          vertexLayer("m4-overlay", overlayData(t), OVERLAY_COLOR, true),
        ],
      });
      requestAnimationFrame(tick);
    }

    function finish() {
      const usable = [...frameTimes].sort((a, b) => a - b);
      deck.finalize();
      resolve({
        frameTimeP50Ms: percentile(usable, 50),
        frameTimeP95Ms: percentile(usable, 95),
        frameCount: usable.length,
        benchmarkElapsedMs,
        finalOverlayE,
        finalOverlayN,
        timedOut: false,
      });
    }

    const deck: Deck<OrthographicView> = new Deck({
      canvas,
      views: new OrthographicView({ id: "ortho", flipY: false }),
      viewState: { target: [0, 0, 0], zoom: ZOOM },
      controller: false,
      useDevicePixels: false,
      _animate: true,
      layers: [
        vertexLayer(staticLayerId, staticData, STATIC_COLOR, true),
        vertexLayer("m4-overlay", overlayData(0), OVERLAY_COLOR, true),
      ],
      onAfterRender: () => {
        const now = performance.now();
        if (animStart === 0) {
          animStart = now;
          requestAnimationFrame(tick);
          return;
        }
        if (!benchmarkDone) {
          const t = now - animStart;
          if (lastFrameAt !== null && t >= opts.warmupMs) frameTimes.push(now - lastFrameAt);
          lastFrameAt = now;
        }
      },
    });
  });
}

// ---- precision check (M2-style, duplicated per this spike's convention) --

interface Capture {
  pixels: Uint8Array;
  x0: number;
  y0: number;
  w: number;
  h: number;
}

function intensityCentroid(c: Capture): { x: number; y: number } | null {
  let background = 255;
  for (let i = 0; i < c.w * c.h; i++) {
    const v = c.pixels[i * 4];
    if (v < background) background = v;
  }
  let sumW = 0;
  let sumWX = 0;
  let sumWY = 0;
  for (let j = 0; j < c.h; j++) {
    for (let i = 0; i < c.w; i++) {
      const w = c.pixels[(j * c.w + i) * 4] - background;
      if (w <= 0) continue;
      sumW += w;
      sumWX += w * (c.x0 + i + 0.5);
      sumWY += w * (c.y0 + j + 0.5);
    }
  }
  if (sumW < MIN_CENTROID_WEIGHT) return null;
  return { x: sumWX / sumW, y: sumWY / sumW };
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

interface PrecisionResult {
  samples: number;
  worstErrorPx: number;
  budgetPx: number;
  note: string;
}

/**
 * Isolated on purpose: renders *only* the dragged vertex, alone, at each
 * sampled phase of the real drag circle -- no static ghost, no other
 * overlay vertices in frame. At M4's 1:20,000 scale the drag's own 2m
 * radius is well under a pixel on screen (~0.38 px), so rendering it
 * alongside neighbours would risk the same blob-blending failure mode M2
 * flagged for overlapping sprites; a lone marker's *absolute* screen
 * position is measurable to sub-pixel accuracy regardless of how far it
 * moved from anything else (M2's own calibration probe measured a lone
 * marker at zero drift the same way).
 */
async function runPrecisionCheck(
  canvas: HTMLCanvasElement,
  originE: number,
  originN: number,
  dragOrigE: number,
  dragOrigN: number,
  fbW: number,
  fbH: number,
): Promise<PrecisionResult> {
  const PHASES = [0, 0.25, 0.5, 0.75, 1.0].map((f) => f * Math.PI * 2);
  let pendingCapture: { x0: number; y0: number; w: number; h: number } | null = null;
  let captureResolve: ((c: Capture | null) => void) | null = null;
  let skipFrames = 0;

  const deck: Deck<OrthographicView> = new Deck({
    canvas,
    views: new OrthographicView({ id: "ortho", flipY: false }),
    viewState: { target: [0, 0, 0], zoom: ZOOM },
    controller: false,
    useDevicePixels: false,
    _animate: true,
    layers: [],
    onAfterRender: ({ gl }) => {
      if (!pendingCapture) return;
      if (skipFrames > 0) {
        skipFrames--;
        return;
      }
      const { x0, y0, w, h } = pendingCapture;
      pendingCapture = null;
      const pixels = new Uint8Array(w * h * 4);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.readPixels(x0, y0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
      const resolve = captureResolve;
      captureResolve = null;
      resolve?.({ pixels, x0, y0, w, h });
    },
  });

  function renderAndCapture(props: Record<string, unknown>, ex: number, ey: number): Promise<Capture | null> {
    return new Promise((resolve) => {
      let timer: ReturnType<typeof setTimeout> | undefined;
      let settled = false;
      const finish = (c: Capture | null) => {
        if (settled) return;
        settled = true;
        if (timer !== undefined) clearTimeout(timer);
        resolve(c);
      };
      captureResolve = finish;
      skipFrames = 1;
      pendingCapture = {
        x0: clamp(Math.round(ex) - (WINDOW_PX >> 1), 0, Math.max(0, fbW - WINDOW_PX)),
        y0: clamp(Math.round(ey) - (WINDOW_PX >> 1), 0, Math.max(0, fbH - WINDOW_PX)),
        w: WINDOW_PX,
        h: WINDOW_PX,
      };
      deck.setProps(props);
      timer = setTimeout(() => {
        if (captureResolve === finish) {
          captureResolve = null;
          pendingCapture = null;
        }
        finish(null);
      }, CAPTURE_TIMEOUT_MS);
    });
  }

  let worstErrorPx = 0;
  let samples = 0;
  for (const angle of PHASES) {
    const e = dragOrigE + DRAG_RADIUS_M * Math.cos(angle);
    const n = dragOrigN + DRAG_RADIUS_M * Math.sin(angle);
    const positions = new Float32Array([e - originE, n - originN]);
    const data = makeData(positions, 1);
    const ex = fbW / 2 + PX_PER_M * (e - originE);
    const ey = fbH / 2 + PX_PER_M * (n - originN);
    const layer = vertexLayer(`m4-precision-${angle}`, data, [255, 255, 255], false);
    const cap = await renderAndCapture({ layers: [layer] }, ex, ey);
    const c = cap && intensityCentroid(cap);
    if (c) {
      samples++;
      worstErrorPx = Math.max(worstErrorPx, Math.hypot(c.x - ex, c.y - ey));
    }
  }
  deck.finalize();
  return {
    samples,
    worstErrorPx,
    budgetPx: BUDGET_PRECISION_PX,
    note:
      "M2-style predicted-vs-readPixels-centroid check on the dragged vertex alone (isolated, no " +
      "static/overlay neighbours), at 5 phases of the real drag circle. Duplicated from " +
      "m2-precision.ts's technique rather than imported, per this spike's convention of keeping " +
      "each milestone's committed numbers independent of modules a later milestone might change.",
  };
}

// ---- pick-to-grab latency --------------------------------------------------

interface PickLatencyResult {
  p50Ms: number;
  samples: number;
  timeouts: number;
  lastReturnedId: bigint | null;
  lastLayerId: string | null;
}

/** deck.pickObjectAsync has never been exercised at 10M-feature scale anywhere in this spike (M3 only tested 5-10 feature datasets) — bounded with a timeout so an unexpectedly slow or stuck pick at this scale can't block the whole harness indefinitely (docs/01 principle 7). A timed-out sample is excluded from the p50 and counted separately, not silently dropped. */
const PICK_TIMEOUT_MS = 15_000;

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T | "timeout"> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve("timeout"), ms);
    p.then((v) => {
      clearTimeout(timer);
      resolve(v);
    });
  });
}

/**
 * `PickingInfo.index` is local to whichever layer was hit, not a global
 * ordinal — resolving it against a single flat id array is only correct
 * when exactly one pickable layer is in play. `resolveId` takes the hit
 * layer's id alongside the local index so multi-layer configurations (the
 * visible-subset test below renders both a static and an overlay layer,
 * both pickable) resolve against the *right* array instead of silently
 * misattributing an overlay hit to the static layer's ids.
 */
function arrayIdResolver(layerId: string, ids: BigUint64Array): (hitLayerId: string | null, index: number) => bigint | null {
  return (hitLayerId, index) => (hitLayerId === layerId ? (ids[index] ?? null) : null);
}

async function measurePickLatency(
  deck: Deck<OrthographicView>,
  resolveId: (hitLayerId: string | null, index: number) => bigint | null,
  x: number,
  y: number,
  radius: number,
  samples: number,
): Promise<PickLatencyResult> {
  const times: number[] = [];
  let timeouts = 0;
  let lastReturnedId: bigint | null = null;
  let lastLayerId: string | null = null;
  for (let i = 0; i < samples; i++) {
    const t0 = performance.now();
    const result = await withTimeout(deck.pickObjectAsync({ x, y, radius }), PICK_TIMEOUT_MS);
    if (result === "timeout") {
      timeouts++;
      appendLog(`pick timed out after ${PICK_TIMEOUT_MS} ms (sample ${i + 1}/${samples})`);
      continue;
    }
    times.push(performance.now() - t0);
    if (result && result.index >= 0) {
      lastLayerId = result.layer?.id ?? null;
      lastReturnedId = resolveId(lastLayerId, result.index);
    } else {
      lastReturnedId = null;
      lastLayerId = null;
    }
  }
  const sorted = [...times].sort((a, b) => a - b);
  return { p50Ms: percentile(sorted, 50), samples: times.length, timeouts, lastReturnedId, lastLayerId };
}

// ---- report shape -----------------------------------------------------

interface M4Report {
  timestamp: string;
  valid: boolean;
  invalidReasons: string[];
  scale: { denominator: number; metresPerPixel: number; pixelsPerMetre: number };
  framebuffer: { width: number; height: number };
  budgetFrameMs: number;
  p2: { polygonCount: number; vertexCount: number; vertsPerPolygon: number };
  editTarget: { polygonId: number; centroidE: number; centroidN: number; draggedVertexId: number };
  visibleSubset: {
    polygonCount: number;
    vertexCount: number;
    bbox: [number, number, number, number];
    ordinalDivergedFromId: boolean;
  };
  dragBenchmark: {
    visibleSubset: DragBenchmarkResult;
    fullP2Visible: DragBenchmarkResult;
    note: string;
  };
  precision: PrecisionResult;
  commitRoundTrip: {
    sentE: number;
    sentN: number;
    resolvedE: number;
    resolvedN: number;
    bitExact: boolean;
  };
  pickToGrab: {
    fullSet: PickLatencyResult;
    overlay: PickLatencyResult;
    visibleSubset: PickLatencyResult;
    overlayWinsCollision: boolean;
    note: string;
  };
  originSwap: {
    idleFrameMsAvg: number;
    unmitigated: { rebuildWallMs: number; setPropsToNextRafMs: number };
    chunked: { chunkVertices: number; chunkCount: number; chunkMsP50: number; chunkMsMax: number; totalRebuildMs: number; finalUploadFrameMs: number } | null;
    chunkedTimedOut: boolean;
    note: string;
  };
  fullScaleCommit: {
    patchAndReuploadMs: number;
    timedOut: boolean;
    note: string;
  };
  pickingCeiling: {
    ceiling: number;
    fullSetFeatures: number;
    fractionOfCeiling: number;
    note: string;
  };
}

// ---- orchestration ----------------------------------------------------

export async function runM4(): Promise<void> {
  setStatus("M4: settling framebuffer...");
  const canvas = document.querySelector<HTMLCanvasElement>("#deck-canvas");
  if (!canvas) throw new Error("missing #deck-canvas");

  // Settle-and-pin, same method as M2/M3's warm-up render (the first frame
  // can land before CSS has stretched the canvas to the window).
  let fbW = 0;
  let fbH = 0;
  await new Promise<void>((resolve) => {
    const start = performance.now();
    const settleDeck: Deck<OrthographicView> = new Deck({
      canvas,
      views: new OrthographicView({ id: "ortho" }),
      viewState: { target: [0, 0, 0], zoom: 0 },
      controller: false,
      useDevicePixels: false,
      // Without continuous redraw, an empty-layers scene may render once at
      // mount (possibly before CSS has stretched the canvas to the window,
      // per M2's own warning) and never again -- fbW/fbH would then latch a
      // stale value forever instead of catching up once CSS settles.
      _animate: true,
      layers: [],
      onAfterRender: ({ gl }) => {
        fbW = gl.drawingBufferWidth;
        fbH = gl.drawingBufferHeight;
      },
    });
    const poll = () => {
      const settled = fbW > 0 && fbH > 0 && fbW === canvas.clientWidth && fbH === canvas.clientHeight;
      if (settled || performance.now() - start > CAPTURE_TIMEOUT_MS) {
        settleDeck.finalize();
        resolve();
      } else {
        requestAnimationFrame(poll);
      }
    };
    requestAnimationFrame(poll);
  });
  if (!fbW || !fbH) throw new Error(`M4: framebuffer never settled (${fbW}x${fbH})`);
  appendLog(`framebuffer ${fbW}x${fbH}, ${M_PER_PX.toFixed(6)} m/px, 1:${SCALE_DENOMINATOR}`);

  // ---- edit target: the polygon nearest the extent centroid, resolved
  // from grid indices at runtime rather than hardcoded.
  const editCenterE = (EXTENT_E[0] + EXTENT_E[1]) / 2;
  const editCenterN = (EXTENT_N[0] + EXTENT_N[1]) / 2;
  const editPolygonId = nearestPolygonId(editCenterE, editCenterN);
  const [originE, originN] = polygonCentroid(editPolygonId);
  const draggedVertexId = editPolygonId * VERTS_PER_POLYGON;
  appendLog(`edit target: polygon ${editPolygonId} at (${originE.toFixed(2)}, ${originN.toFixed(2)}), cell ${CELL_W.toFixed(1)}x${CELL_H.toFixed(1)} m`);

  // ---- visible subset: derived from the settled framebuffer, not assumed.
  const halfWidthM = (fbW / 2) * M_PER_PX;
  const halfHeightM = (fbH / 2) * M_PER_PX;
  const bbox: [number, number, number, number] = [
    originE - halfWidthM,
    originN - halfHeightM,
    originE + halfWidthM,
    originN + halfHeightM,
  ];
  setStatus("M4: fetching visible-subset P2...");
  const visible = await fetchP2Bbox(...bbox);
  const visiblePolygonCount = visible.e.length / VERTS_PER_POLYGON;
  appendLog(`visible subset: ${visiblePolygonCount} polygons, ${visible.e.length} vertices (bbox ${bbox.map((v) => v.toFixed(1)).join(",")})`);

  let ordinalDivergedFromId = false;
  for (let i = 0; i < visible.ids.length; i++) {
    if (Number(visible.ids[i]) !== i) {
      ordinalDivergedFromId = true;
      break;
    }
  }

  // Locate the edit-target polygon's 100 vertices inside the visible-subset
  // buffer (present since the bbox is centred on it) and inside the id
  // array, by id rather than by assumed position -- exactly the
  // id-indirection this milestone exists to exercise.
  function extractPolygon(set: P2VertexSet, polygonId: number): { e: Float64Array; n: Float64Array } {
    const wantIds = new Set<bigint>();
    for (let local = 0; local < VERTS_PER_POLYGON; local++) wantIds.add(BigInt(polygonId * VERTS_PER_POLYGON + local));
    const e = new Float64Array(VERTS_PER_POLYGON);
    const n = new Float64Array(VERTS_PER_POLYGON);
    let found = 0;
    for (let i = 0; i < set.ids.length; i++) {
      const id = set.ids[i];
      if (wantIds.has(id)) {
        const local = Number(id) - polygonId * VERTS_PER_POLYGON;
        e[local] = set.e[i];
        n[local] = set.n[i];
        found++;
      }
    }
    if (found !== VERTS_PER_POLYGON) {
      throw new Error(`M4: edit-target polygon ${polygonId} not fully present (found ${found}/${VERTS_PER_POLYGON})`);
    }
    return { e, n };
  }

  const overlayPolygonVisible = extractPolygon(visible, editPolygonId);

  // ---- static buffer for the visible-subset scenario, built once. Its
  // data/attribute-value reference is what runDragBenchmark reuses
  // unchanged for the whole drag -- the literal meaning of "vertex drag
  // updates only the overlay buffers".
  const { positions: visibleStaticPositions } = offsetPositionsSync(visible.e, visible.n, originE, originN);
  const visibleStaticData = makeData(visibleStaticPositions, visible.e.length);

  // ---- drag benchmark 1: visible subset (graded, ≤16ms) ------------------
  setStatus("M4: drag benchmark (visible subset)...");
  const visibleDrag = await runDragBenchmarkBounded(
    canvas,
    visibleStaticData,
    "m4-static-visible",
    overlayPolygonVisible,
    originE,
    originN,
    { warmupMs: GRADED_WARMUP_MS, targetSamples: GRADED_TARGET_SAMPLES, maxBenchmarkMs: GRADED_MAX_BENCHMARK_MS },
  );
  appendLog(`drag [visible subset]: p50 ${visibleDrag.frameTimeP50Ms.toFixed(2)} ms, p95 ${visibleDrag.frameTimeP95Ms.toFixed(2)} ms, ${visibleDrag.frameCount} samples`);

  // ---- commit: visible-subset scenario -----------------------------------
  setStatus("M4: committing visible-subset edit...");
  await invoke("commit_vertex_edit", {
    id: draggedVertexId,
    e: visibleDrag.finalOverlayE,
    n: visibleDrag.finalOverlayN,
    crs: "EPSG:2056",
  });
  const resolvedAfterVisible = await invoke<{ crs: string; e: number; n: number }>("resolve_p2_vertex", {
    id: draggedVertexId,
  });
  const commitBitExact =
    resolvedAfterVisible.e === visibleDrag.finalOverlayE && resolvedAfterVisible.n === visibleDrag.finalOverlayN;
  appendLog(`commit round trip: sent (${visibleDrag.finalOverlayE.toFixed(6)}, ${visibleDrag.finalOverlayN.toFixed(6)}), resolved (${resolvedAfterVisible.e.toFixed(6)}, ${resolvedAfterVisible.n.toFixed(6)}), bit-exact ${commitBitExact}`);

  // Client-side static-buffer patch for the visible-subset scenario: cheap
  // at this scale (README), so measured directly rather than assumed.
  const patchT0 = performance.now();
  const patchIdx = visible.ids.findIndex((id) => id === BigInt(draggedVertexId));
  if (patchIdx < 0) throw new Error("M4: dragged vertex missing from visible-subset id array");
  visibleStaticPositions[patchIdx * 2] = resolvedAfterVisible.e - originE;
  visibleStaticPositions[patchIdx * 2 + 1] = resolvedAfterVisible.n - originN;
  const visibleSubsetPatchMs = performance.now() - patchT0;

  // ---- precision check ----------------------------------------------------
  setStatus("M4: precision check...");
  const precision = await runPrecisionCheck(canvas, originE, originN, overlayPolygonVisible.e[0], overlayPolygonVisible.n[0], fbW, fbH);
  appendLog(`precision: worst error ${precision.worstErrorPx.toFixed(4)} px over ${precision.samples} samples (budget ${precision.budgetPx} px)`);

  // ---- pick-to-grab latency, three configurations -------------------------
  setStatus("M4: pick-to-grab latency...");
  const predictExGrab = fbW / 2 + PX_PER_M * (overlayPolygonVisible.e[0] - originE);
  const predictEyGrab = fbH / 2 + PX_PER_M * (overlayPolygonVisible.n[0] - originN);
  const pickX = Math.floor(predictExGrab);
  const pickY = Math.floor(fbH - predictEyGrab);

  const overlayData0 = makeData(new Float32Array([overlayPolygonVisible.e[0] - originE, overlayPolygonVisible.n[0] - originN]), 1);

  // onAfterRender set once at construction (not swapped via setProps later,
  // which deck.gl callback props don't handle cleanly) — the same
  // renderResolve idiom m3-picking.ts uses for "wait for a render that
  // reflects the props just set".
  let pickRenderResolve: (() => void) | null = null;
  const pickDeck: Deck<OrthographicView> = new Deck({
    canvas,
    views: new OrthographicView({ id: "ortho", flipY: false }),
    viewState: { target: [0, 0, 0], zoom: ZOOM },
    controller: false,
    useDevicePixels: false,
    _animate: true,
    layers: [],
    onAfterRender: () => {
      const r = pickRenderResolve;
      pickRenderResolve = null;
      r?.();
    },
  });
  /** Resolves true if a real render was observed, false if the capture timeout fired instead. */
  function renderPickLayers(layers: ReturnType<typeof vertexLayer>[]): Promise<boolean> {
    return new Promise((resolve) => {
      let settled = false;
      const finish = (renderedInTime: boolean) => {
        if (settled) return;
        settled = true;
        resolve(renderedInTime);
      };
      pickRenderResolve = () => finish(true);
      pickDeck.setProps({ layers });
      setTimeout(() => finish(false), CAPTURE_TIMEOUT_MS);
    });
  }

  // (1) overlay only (~100 vertices) — fast path.
  await renderPickLayers([vertexLayer("m4-pick-overlay", overlayData0, OVERLAY_COLOR, true)]);
  const pickOverlay = await measurePickLatency(
    pickDeck,
    arrayIdResolver("m4-pick-overlay", new BigUint64Array([BigInt(draggedVertexId)])),
    pickX,
    pickY,
    PICK_RADIUS_PX,
    PICK_LATENCY_SAMPLES,
  );

  // (2) full 100k-polygon / 10M-vertex set — worst case.
  setStatus("M4: fetching full P2 for pick/origin-swap tests...");
  const full = await fetchP2Full();
  appendLog(`full P2 fetched: ${full.e.length} vertices`);
  const { positions: fullStaticPositions } = offsetPositionsSync(full.e, full.n, originE, originN);
  const fullStaticData = makeData(fullStaticPositions, full.e.length);

  // ---- origin-swap cost ----------------------------------------------------
  // Deliberately measured here, right after the full P2 buffer is loaded and
  // before the slower pick-latency/drag-benchmark-2 phases below -- not
  // where it conceptually "belongs" in the report's own ordering, but this
  // spike's smoke-testing repeatedly hit a reproducible stall at a roughly
  // fixed wall-clock offset from launch (~17-18 s), and running the
  // wall-clock-sensitive part of the harness earlier avoids landing on it
  // (see README scope limits for the investigation into why).
  setStatus("M4: origin-swap cost (full P2 loaded)...");
  let idleFrameMsAvg = NaN;
  {
    const idleDeltas: number[] = [];
    let lastAt: number | null = null;
    const idleDeck: Deck<OrthographicView> = new Deck({
      canvas,
      views: new OrthographicView({ id: "ortho", flipY: false }),
      viewState: { target: [0, 0, 0], zoom: ZOOM },
      controller: false,
      useDevicePixels: false,
      _animate: true,
      layers: [vertexLayer("m4-swap-idle", fullStaticData, STATIC_COLOR, false)],
      onAfterRender: () => {
        const now = performance.now();
        if (lastAt !== null) idleDeltas.push(now - lastAt);
        lastAt = now;
      },
    });
    await new Promise<void>((resolve) => {
      const check = () => (idleDeltas.length >= 10 ? resolve() : requestAnimationFrame(check));
      requestAnimationFrame(check);
    });
    idleFrameMsAvg = average(idleDeltas.slice(-5));
    idleDeck.finalize();
  }

  const swapOriginE = originE + CROSSING_DELTA_M;
  const swapOriginN = originN;
  const { positions: swapPositionsSync, wallMs: rebuildWallMs } = offsetPositionsSync(full.e, full.n, swapOriginE, swapOriginN);
  const swapData = makeData(swapPositionsSync, full.e.length);
  const swapDeck: Deck<OrthographicView> = new Deck({
    canvas,
    views: new OrthographicView({ id: "ortho", flipY: false }),
    viewState: { target: [0, 0, 0], zoom: ZOOM },
    controller: false,
    useDevicePixels: false,
    layers: [vertexLayer("m4-swap-before", fullStaticData, STATIC_COLOR, false)],
  });
  const setPropsToNextRafMs = await new Promise<number>((resolve) => {
    requestAnimationFrame(() => {
      const t0 = performance.now();
      swapDeck.setProps({
        layers: [vertexLayer("m4-swap-after", swapData, STATIC_COLOR, false)],
        viewState: { target: [originE - swapOriginE, originN - swapOriginN, 0], zoom: ZOOM },
      });
      requestAnimationFrame(() => {
        requestAnimationFrame(() => resolve(performance.now() - t0));
      });
    });
  });
  swapDeck.finalize();
  appendLog(`origin swap [unmitigated]: rebuild ${rebuildWallMs.toFixed(2)} ms, setProps-to-next-frame ${setPropsToNextRafMs.toFixed(2)} ms (idle baseline ${idleFrameMsAvg.toFixed(2)} ms)`);

  let chunkedResult: M4Report["originSwap"]["chunked"] = null;
  let chunkedTimedOut = false;
  if (Math.max(rebuildWallMs, setPropsToNextRafMs) > BUDGET_FRAME_MS) {
    setStatus("M4: origin-swap mitigation (chunked rebuild)...");
    // Bounded the same way as the drag benchmarks (README scope limits): a
    // ~50-iteration rAF loop over real per-chunk work hit the same
    // reproducible hardware/driver stall observed there. Timing out here
    // degrades to a null chunked result rather than blocking the harness.
    const chunkedOrTimeout = await withTimeout(
      offsetPositionsChunked(full.e, full.n, swapOriginE, swapOriginN, CHUNK_VERTICES),
      DRAG_BENCHMARK_TIMEOUT_MS,
    );
    if (chunkedOrTimeout === "timeout") {
      chunkedTimedOut = true;
      appendLog(`origin swap [chunked mitigation] timed out after ${DRAG_BENCHMARK_TIMEOUT_MS} ms -- reporting no chunked result`);
    } else {
      const chunked = chunkedOrTimeout;
      const chunkedData = makeData(chunked.positions, full.e.length);
      const finalUploadDeck: Deck<OrthographicView> = new Deck({
        canvas,
        views: new OrthographicView({ id: "ortho", flipY: false }),
        viewState: { target: [originE - swapOriginE, originN - swapOriginN, 0], zoom: ZOOM },
        controller: false,
        useDevicePixels: false,
        layers: [],
      });
      const finalUploadFrameMs = await new Promise<number>((resolve) => {
        requestAnimationFrame(() => {
          const t0 = performance.now();
          finalUploadDeck.setProps({ layers: [vertexLayer("m4-swap-chunked-final", chunkedData, STATIC_COLOR, false)] });
          requestAnimationFrame(() => {
            requestAnimationFrame(() => resolve(performance.now() - t0));
          });
        });
      });
      finalUploadDeck.finalize();
      const sortedChunks = [...chunked.chunkMsSamples].sort((a, b) => a - b);
      chunkedResult = {
        chunkVertices: CHUNK_VERTICES,
        chunkCount: chunked.chunkMsSamples.length,
        chunkMsP50: percentile(sortedChunks, 50),
        chunkMsMax: sortedChunks[sortedChunks.length - 1] ?? NaN,
        totalRebuildMs: chunked.totalMs,
        finalUploadFrameMs,
      };
      appendLog(
        `origin swap [chunked mitigation]: ${chunkedResult.chunkCount} chunks of ${CHUNK_VERTICES}, ` +
          `chunk p50 ${chunkedResult.chunkMsP50.toFixed(2)} ms / max ${chunkedResult.chunkMsMax.toFixed(2)} ms, ` +
          `total ${chunkedResult.totalRebuildMs.toFixed(1)} ms, final upload frame ${finalUploadFrameMs.toFixed(2)} ms`,
      );
    }
  } else {
    appendLog("origin swap: unmitigated cost already within budget, mitigation not triggered");
  }

  await renderPickLayers([vertexLayer("m4-pick-full", fullStaticData, STATIC_COLOR, true)]);
  const pickFullSet = await measurePickLatency(
    pickDeck,
    arrayIdResolver("m4-pick-full", full.ids),
    pickX,
    pickY,
    PICK_RADIUS_PX,
    PICK_LATENCY_SAMPLES,
  );

  // (3) visible subset (~1.5-2k vertices) — the scenario's own number, plus
  // a check that the overlay wins the last-writer-wins collision (README).
  // Two pickable layers are in play here, so the id resolver has to check
  // *which* layer was hit before indexing — see arrayIdResolver's doc
  // comment for why a single flat array would silently misattribute an
  // overlay hit to the static layer's ids.
  const { positions: visibleStaticPositionsForPick } = offsetPositionsSync(visible.e, visible.n, originE, originN);
  const visibleStaticDataForPick = makeData(visibleStaticPositionsForPick, visible.e.length);
  await renderPickLayers([
    vertexLayer("m4-pick-visible-static", visibleStaticDataForPick, STATIC_COLOR, true),
    vertexLayer("m4-pick-visible-overlay", overlayData0, OVERLAY_COLOR, true),
  ]);
  const resolveVisibleId = (hitLayerId: string | null, index: number): bigint | null => {
    if (hitLayerId === "m4-pick-visible-overlay") return BigInt(draggedVertexId);
    if (hitLayerId === "m4-pick-visible-static") return visible.ids[index] ?? null;
    return null;
  };
  const pickVisible = await measurePickLatency(pickDeck, resolveVisibleId, pickX, pickY, PICK_RADIUS_PX, PICK_LATENCY_SAMPLES);
  const overlayWinsCollision = pickVisible.lastLayerId === "m4-pick-visible-overlay";

  // pickDeck stays alive (finalized after the commit-reupload step below,
  // which reuses it) -- one fewer Deck instance across the session, a
  // further mitigation for the hardware/driver stall in the README scope
  // limits, on top of not being needed for anything else in the meantime.
  appendLog(
    `pick-to-grab: full-set p50 ${pickFullSet.p50Ms.toFixed(3)} ms, overlay p50 ${pickOverlay.p50Ms.toFixed(3)} ms, ` +
      `visible-subset p50 ${pickVisible.p50Ms.toFixed(3)} ms, overlay wins collision: ${overlayWinsCollision}`,
  );

  // ---- drag benchmark 2: full-P2-visible (reported finding, not graded) --
  setStatus("M4: drag benchmark (full-P2-visible)...");
  const overlayPolygonFull = extractPolygon(full, editPolygonId);
  const fullDrag = await runDragBenchmarkBounded(
    canvas,
    fullStaticData,
    "m4-static-full",
    overlayPolygonFull,
    originE,
    originN,
    { warmupMs: GRADED_WARMUP_MS, targetSamples: REPORTED_TARGET_SAMPLES, maxBenchmarkMs: REPORTED_MAX_BENCHMARK_MS },
  );
  appendLog(`drag [full-P2-visible, NOT graded]: p50 ${fullDrag.frameTimeP50Ms.toFixed(2)} ms, p95 ${fullDrag.frameTimeP95Ms.toFixed(2)} ms, ${fullDrag.frameCount} samples`);

  // Commit the full-P2 drag too, so fullScaleCommit below patches real data.
  await invoke("commit_vertex_edit", {
    id: draggedVertexId,
    e: fullDrag.finalOverlayE,
    n: fullDrag.finalOverlayN,
    crs: "EPSG:2056",
  });

  // ---- full-scale commit: O(1) CPU patch + O(N) GPU reupload -------------
  // Deliberately distinguished from the origin-swap rebuild below (README):
  // only one vertex's world coordinate changed, so the CPU side is a single
  // write, not a full recompute. What's shared with origin-swap is the part
  // chunking can't help — deck.gl has no partial-attribute-update API, so
  // *any* change reuploads the whole buffer.
  setStatus("M4: full-scale commit patch + reupload...");
  // fullPatchIdx = draggedVertexId directly, not a findIndex scan: `full` is
  // the unfiltered fetch, and p2.rs::full_arrow_ipc assigns id = storage
  // index = buffer ordinal for that response by construction (id/ordinal
  // only diverge for *filtered* responses like the visible-subset bbox
  // fetch). An O(10M) findIndex here would have been an unbounded,
  // unmeasured, un-timeout-guarded blocking scan hidden ahead of
  // reuploadT0 below -- exactly what this measurement claims not to pay.
  const fullPatchIdx = draggedVertexId;
  fullStaticPositions[fullPatchIdx * 2] = fullDrag.finalOverlayE - originE;
  fullStaticPositions[fullPatchIdx * 2 + 1] = fullDrag.finalOverlayN - originN;
  // Reuses pickDeck (still alive, finalized right after this) rather than
  // constructing yet another fresh Deck instance — cutting Deck-instance
  // churn is a further mitigation for the hardware/driver stall documented
  // in the README scope limits, on top of not needing a new one here.
  const reuploadT0 = performance.now();
  // "m4-commit-reupload" is a layer id pickDeck has never rendered before,
  // so deck.gl has no prior instance to diff against and uploads
  // unconditionally -- this is a first-time upload of the (in-place
  // mutated) buffer, not a forced re-diff of an already-rendered layer
  // under a stable id. deck.gl has no partial-attribute-update API either
  // way, so the measured cost is still a reasonable proxy for "reupload
  // the whole buffer after a one-vertex edit" -- but the specific scenario
  // of a stable-id layer silently keeping a stale GPU buffer after its
  // backing array is mutated without a prop change (the risk the
  // reference-identity discipline elsewhere in this file exists to avoid)
  // is not exercised by this measurement.
  const reuploadRenderedInTime = await renderPickLayers([
    vertexLayer("m4-commit-reupload", fullStaticData, STATIC_COLOR, false),
  ]);
  const patchAndReuploadMs = performance.now() - reuploadT0;
  pickDeck.finalize();
  const patchAndReuploadTimedOut = !reuploadRenderedInTime;
  appendLog(
    patchAndReuploadTimedOut
      ? `full-scale commit patch+reupload timed out after ${CAPTURE_TIMEOUT_MS} ms`
      : `full-scale commit patch+reupload: ${patchAndReuploadMs.toFixed(2)} ms`,
  );

  // ---- validity gate --------------------------------------------------------
  const invalidReasons: string[] = [];
  if (visiblePolygonCount < 1) invalidReasons.push("visible subset was empty");
  if (!ordinalDivergedFromId) {
    invalidReasons.push(
      "visible-subset buffer ordinal never diverged from vertex id -- the bbox filter's id " +
        "indirection did not take effect, so the id-carrying wire format proved nothing here",
    );
  }
  if (!commitBitExact) invalidReasons.push("commit round trip was not bit-exact");
  // 5 phases of the drag circle, per runPrecisionCheck -- a partial capture
  // (some readPixels windows timing out) must not silently pass with
  // worstErrorPx computed from fewer samples than intended, the same
  // "missing capture lowers the reported worst case" failure mode M2's own
  // validity gate exists to catch (README: M2's gate rationale).
  const PRECISION_EXPECTED_SAMPLES = 5;
  if (precision.samples < PRECISION_EXPECTED_SAMPLES) {
    invalidReasons.push(`precision check captured ${precision.samples}/${PRECISION_EXPECTED_SAMPLES} samples`);
  }
  if (precision.worstErrorPx > precision.budgetPx) {
    invalidReasons.push(`precision check exceeded budget: ${precision.worstErrorPx} px > ${precision.budgetPx} px`);
  }
  if (!overlayWinsCollision) {
    invalidReasons.push("overlay did not win the last-writer-wins pick collision against the static ghost");
  }
  // A p50 computed from zero non-timeout samples is NaN -- seeding from a
  // partial/empty run must not silently pass as "reported: NaN ms" (same
  // class of failure M2's validity gate was added to catch: a broken
  // capture must not read as a value at all, let alone a good one).
  for (const [label, pick] of [
    ["full-set", pickFullSet],
    ["overlay", pickOverlay],
    ["visible-subset", pickVisible],
  ] as const) {
    if (pick.timeouts >= PICK_LATENCY_SAMPLES) {
      invalidReasons.push(`pick-to-grab (${label}) timed out on all ${PICK_LATENCY_SAMPLES} samples`);
    } else if (!Number.isFinite(pick.p50Ms)) {
      invalidReasons.push(`pick-to-grab (${label}) p50 is not finite (${pick.p50Ms})`);
    }
  }
  if (visibleDrag.timedOut) {
    invalidReasons.push(`visible-subset drag benchmark timed out after ${DRAG_BENCHMARK_TIMEOUT_MS} ms -- this is the graded scenario, so its budget verdict is unavailable`);
  } else if (visibleDrag.frameCount === 0) {
    invalidReasons.push("visible-subset drag benchmark collected zero samples");
  }
  if (fullDrag.timedOut) {
    appendLog(`full-P2-visible drag benchmark timed out -- reported as a finding (an unbounded stall), consistent with "reported, not graded"`);
  } else if (fullDrag.frameCount === 0) {
    appendLog("full-P2-visible drag benchmark collected zero samples");
  }

  const report: M4Report = {
    timestamp: new Date().toISOString(),
    valid: invalidReasons.length === 0,
    invalidReasons,
    scale: { denominator: SCALE_DENOMINATOR, metresPerPixel: M_PER_PX, pixelsPerMetre: PX_PER_M },
    framebuffer: { width: fbW, height: fbH },
    budgetFrameMs: BUDGET_FRAME_MS,
    p2: { polygonCount: full.e.length / VERTS_PER_POLYGON, vertexCount: full.e.length, vertsPerPolygon: VERTS_PER_POLYGON },
    editTarget: { polygonId: editPolygonId, centroidE: originE, centroidN: originN, draggedVertexId },
    visibleSubset: { polygonCount: visiblePolygonCount, vertexCount: visible.e.length, bbox, ordinalDivergedFromId },
    dragBenchmark: {
      visibleSubset: visibleDrag,
      fullP2Visible: fullDrag,
      note:
        "visibleSubset is graded against budgetFrameMs (README scenario definition); fullP2Visible " +
        `is a reported finding only, same framing M1 used for its own full-10M-point miss. Each ` +
        `is bounded at ${DRAG_BENCHMARK_TIMEOUT_MS} ms wall-clock (timedOut flag on each result) so ` +
        "a stalled rAF loop, whatever its cause, can't block the rest of the harness -- docs/01 " +
        "principle 7. A timedOut result reports zero samples rather than a fabricated number.",
    },
    precision,
    commitRoundTrip: {
      sentE: visibleDrag.finalOverlayE,
      sentN: visibleDrag.finalOverlayN,
      resolvedE: resolvedAfterVisible.e,
      resolvedN: resolvedAfterVisible.n,
      bitExact: commitBitExact,
    },
    pickToGrab: {
      fullSet: pickFullSet,
      overlay: pickOverlay,
      visibleSubset: pickVisible,
      overlayWinsCollision,
      note:
        "All three measured at the same predicted screen pixel (the dragged vertex's pre-drag " +
        "position). visibleSubsetPatchMs (client-side static-buffer patch after commit) = " +
        `${visibleSubsetPatchMs.toFixed(3)} ms.`,
    },
    originSwap: {
      idleFrameMsAvg,
      unmitigated: { rebuildWallMs, setPropsToNextRafMs },
      chunked: chunkedResult,
      chunkedTimedOut,
      note:
        "Forced re-centre crossing (CROSSING_DELTA_M, far past the budget-derived threshold), full " +
        "P2 loaded and idle. rebuildWallMs is the CPU-only offsetPositionsSync loop; " +
        "setPropsToNextRafMs is a coarser 2-rAF proxy for setProps-to-rendered-frame latency (not " +
        "M2's exact skip-frame technique -- adequate here since the effect measured is tens of ms, " +
        "not the sub-pixel scale M2 needed precision for).",
    },
    fullScaleCommit: {
      patchAndReuploadMs,
      timedOut: patchAndReuploadTimedOut,
      note:
        "Deliberately distinct from originSwap: only one vertex's world coordinate changed, so the " +
        "CPU side is an O(1) patch (already applied to fullStaticPositions above), not an O(N) " +
        "rebuild. patchAndReuploadMs measures only the GPU reupload of the whole (mostly-unchanged) " +
        "buffer that deck.gl's lack of a partial-attribute-update API forces regardless.",
    },
    pickingCeiling: {
      ceiling: 16_777_215,
      fullSetFeatures: full.e.length,
      fractionOfCeiling: full.e.length / 16_777_215,
      note:
        "M3 diagnostic note 2: encodePickingColor silently truncates past index 16,777,214. Only " +
        "the vertex-handle ScatterplotLayers are pickable:true; outline/fill rendering was dropped " +
        "from this milestone's layer design specifically so nothing else consumes picking-index " +
        "budget (README scenario definition).",
    },
  };

  console.log("[M4 EDITING REPORT]", report);
  const statsEl = document.querySelector<HTMLPreElement>("#m4-stats");
  if (statsEl) statsEl.textContent = JSON.stringify(report, null, 2);
  if (invalidReasons.length) {
    appendLog(`RUN INVALID — do not transcribe:\n  - ${invalidReasons.join("\n  - ")}`);
  }
  setStatus("M4: editing measurement complete");
  await invoke("log_m4_report", { reportJson: JSON.stringify(report, null, 2) });
}
