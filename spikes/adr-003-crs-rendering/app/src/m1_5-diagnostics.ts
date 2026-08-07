// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { Deck, OrthographicView } from "@deck.gl/core";
import { ScatterplotLayer } from "@deck.gl/layers";
import { invoke } from "@tauri-apps/api/core";
import { runPanZoomBenchmark } from "./benchmark";
import { EXTENT_E, EXTENT_N, ORIGIN_E, ORIGIN_N, loadP1, loadP1Bbox, loadP1Chunk, type P1Data } from "./p1-loader";

// M1.5 — informal diagnostics, explicitly *not* a milestone: M1 already
// measured (and recorded, unfiltered) that both the 60fps and <100ms
// budgets are missed. This exists only to characterize *why* — GPU
// throughput bound, fixed per-frame framework overhead, or workload
// shaping (visible count / streaming) — before deciding what M2-M5 should
// do about it. None of the four sub-experiments below produce a pass/fail
// verdict; see README's "Diagnostic notes (M1.5)" section for the write-up.
//
// All four reuse M1's exact mechanism: the same fixed-seed EPSG:2056 P1
// dataset (src-tauri/src/p1.rs), the same "p1" protocol (still Arrow IPC,
// still no JSON on the point-data path — ADR-004), the same offset-relative
// f64-before-f32 recentring, the same self-driving pan/zoom benchmark
// (benchmark.ts) since there's still no way to browser-automate the native
// WebView2 window. None of this touches M1's own default (query-param-free)
// code path — it stays byte-for-byte what was measured and committed.

const POINT_COUNT = 10_000_000; // must match src-tauri/src/p1.rs POINT_COUNT
const SUB_BENCHMARK_TARGET_SAMPLES = 60;
const SUB_BENCHMARK_MAX_MS = 10_000;

function setStatus(s: string) {
  const el = document.querySelector<HTMLParagraphElement>("#m15-status");
  if (el) el.textContent = s;
}

function appendLog(line: string) {
  const el = document.querySelector<HTMLPreElement>("#m15-log");
  if (el) el.textContent = (el.textContent ? el.textContent + "\n" : "") + line;
  console.log("[M1.5]", line);
}

// ---------------------------------------------------------------------
// 1. Scaling curve: same sweep at increasing point counts. Linear growth
// in frame time vs. point count means GPU throughput bound; flat means
// fixed per-frame framework overhead dominates instead.
// ---------------------------------------------------------------------

interface ScalingPoint {
  n: number;
  frameCount: number;
  frameTimeP50Ms: number;
  frameTimeP95Ms: number;
}

async function runScalingCurve(
  canvas: HTMLCanvasElement,
  halfWidth: number,
  halfHeight: number,
): Promise<ScalingPoint[]> {
  const sizes = [500_000, 1_000_000, 2_000_000, 5_000_000, 10_000_000];
  const results: ScalingPoint[] = [];
  for (const n of sizes) {
    setStatus(`M1.5 [1/4 scaling curve]: n=${n.toLocaleString()} — fetching...`);
    const p1 = await loadP1(n);
    setStatus(`M1.5 [1/4 scaling curve]: n=${n.toLocaleString()} — benchmarking...`);
    const result = await runPanZoomBenchmark({
      canvas,
      halfWidth,
      halfHeight,
      targetSamples: SUB_BENCHMARK_TARGET_SAMPLES,
      maxBenchmarkMs: SUB_BENCHMARK_MAX_MS,
      buildLayers: () => [
        new ScatterplotLayer({
          id: `p1-scale-${n}`,
          data: { length: p1.count, attributes: { getPosition: { value: p1.positions, size: 2 } } },
          radiusUnits: "pixels",
          getRadius: 1.5,
          radiusMinPixels: 1,
          getFillColor: [56, 189, 248],
        }),
      ],
    });
    const point: ScalingPoint = {
      n: p1.count,
      frameCount: result.frameCount,
      frameTimeP50Ms: result.frameTimeP50Ms,
      frameTimeP95Ms: result.frameTimeP95Ms,
    };
    results.push(point);
    appendLog(
      `scaling n=${point.n.toLocaleString()} p50=${point.frameTimeP50Ms.toFixed(1)}ms ` +
        `p95=${point.frameTimeP95Ms.toFixed(1)}ms (${point.frameCount} samples)`,
    );
  }
  return results;
}

// ---------------------------------------------------------------------
// 2. Cheap toggles at 10M, measured individually against a fixed reference
// config. Reference deliberately turns ON the expensive options (pickable,
// antialiasing, no radius clamp, depth test) so each named "cheap" state
// below is a real single-variable toggle, not a no-op against an
// already-cheap M1 baseline (M1's own ScatterplotLayer already sets
// radiusMinPixels:1 and leaves pickable at its default-false).
// ---------------------------------------------------------------------

interface ToggleVariant {
  name: string;
  layerProps: Record<string, unknown>;
  useDevicePixels?: boolean;
}

const TOGGLE_REFERENCE_PROPS: Record<string, unknown> = {
  pickable: true,
  antialiasing: true,
  radiusMinPixels: 0,
  parameters: { depthCompare: "less-equal", depthWriteEnabled: true },
};

const TOGGLE_VARIANTS: ToggleVariant[] = [
  { name: "reference (pickable+antialiasing+depthTest on, radiusMinPixels 0)", layerProps: {} },
  { name: "pickable:false", layerProps: { pickable: false } },
  { name: "antialiasing:false", layerProps: { antialiasing: false } },
  { name: "useDevicePixels:false", layerProps: {}, useDevicePixels: false },
  { name: "radiusMinPixels:1", layerProps: { radiusMinPixels: 1 } },
  { name: "depthTest:false", layerProps: { parameters: { depthCompare: "always", depthWriteEnabled: false } } },
];

interface ToggleResult {
  name: string;
  frameCount: number;
  frameTimeP50Ms: number;
  frameTimeP95Ms: number;
  deltaFromReferenceP50Ms: number;
}

async function runToggleExperiments(
  canvas: HTMLCanvasElement,
  halfWidth: number,
  halfHeight: number,
  p1: P1Data,
): Promise<ToggleResult[]> {
  const results: ToggleResult[] = [];
  let referenceP50: number | null = null;
  for (const variant of TOGGLE_VARIANTS) {
    setStatus(`M1.5 [2/4 toggles]: ${variant.name} — benchmarking...`);
    const result = await runPanZoomBenchmark({
      canvas,
      halfWidth,
      halfHeight,
      targetSamples: SUB_BENCHMARK_TARGET_SAMPLES,
      maxBenchmarkMs: SUB_BENCHMARK_MAX_MS,
      useDevicePixels: variant.useDevicePixels,
      buildLayers: () => [
        new ScatterplotLayer({
          id: `p1-toggle-${variant.name}`,
          data: { length: p1.count, attributes: { getPosition: { value: p1.positions, size: 2 } } },
          radiusUnits: "pixels",
          getRadius: 1.5,
          getFillColor: [56, 189, 248],
          ...TOGGLE_REFERENCE_PROPS,
          ...variant.layerProps,
        } as ConstructorParameters<typeof ScatterplotLayer>[0]),
      ],
    });
    if (referenceP50 === null) referenceP50 = result.frameTimeP50Ms;
    const point: ToggleResult = {
      name: variant.name,
      frameCount: result.frameCount,
      frameTimeP50Ms: result.frameTimeP50Ms,
      frameTimeP95Ms: result.frameTimeP95Ms,
      deltaFromReferenceP50Ms: result.frameTimeP50Ms - referenceP50,
    };
    results.push(point);
    const sign = point.deltaFromReferenceP50Ms >= 0 ? "+" : "";
    appendLog(
      `toggle "${point.name}" p50=${point.frameTimeP50Ms.toFixed(1)}ms ` +
        `(Δ${sign}${point.deltaFromReferenceP50Ms.toFixed(1)}ms) p95=${point.frameTimeP95Ms.toFixed(1)}ms`,
    );
  }
  return results;
}

// ---------------------------------------------------------------------
// 3. Visible-count scenario (docs/08's Points target: "10M total, defined
// visible count" — never pinned to a number). Crude server-side bbox
// filter (unindexed linear scan, p1.rs) selects roughly targetFraction of
// the 10M points via a sub-rectangle sized so uniform density gives that
// fraction. The scan cost is itself a confound on this experiment's own
// numbers — it answers "does a smaller visible set help render cost," not
// "is server-side viewport filtering cheap."
// ---------------------------------------------------------------------

interface VisibleCountResult {
  requestedFraction: number;
  bbox: [number, number, number, number];
  actualCount: number;
  fetchMs: number;
  parseMs: number;
  frameCount: number;
  frameTimeP50Ms: number;
  frameTimeP95Ms: number;
}

async function runVisibleCountScenario(
  canvas: HTMLCanvasElement,
  fullHalfWidth: number,
  fullHalfHeight: number,
): Promise<VisibleCountResult> {
  const targetFraction = 0.1; // ~1M of 10M
  const widthFrac = Math.sqrt(targetFraction);
  const halfBboxWidth = fullHalfWidth * widthFrac;
  const halfBboxHeight = fullHalfHeight * widthFrac;
  const eMin = ORIGIN_E - halfBboxWidth;
  const eMax = ORIGIN_E + halfBboxWidth;
  const nMin = ORIGIN_N - halfBboxHeight;
  const nMax = ORIGIN_N + halfBboxHeight;

  setStatus("M1.5 [3/4 visible-count]: fetching bbox-filtered subset...");
  const p1 = await loadP1Bbox(eMin, nMin, eMax, nMax);
  setStatus(`M1.5 [3/4 visible-count]: ${p1.count.toLocaleString()} pts in bbox — benchmarking...`);
  const result = await runPanZoomBenchmark({
    canvas,
    halfWidth: halfBboxWidth,
    halfHeight: halfBboxHeight,
    targetSamples: SUB_BENCHMARK_TARGET_SAMPLES * 2, // comparable sample size to M1 itself
    buildLayers: () => [
      new ScatterplotLayer({
        id: "p1-visible",
        data: { length: p1.count, attributes: { getPosition: { value: p1.positions, size: 2 } } },
        radiusUnits: "pixels",
        getRadius: 1.5,
        radiusMinPixels: 1,
        getFillColor: [56, 189, 248],
      }),
    ],
  });

  const point: VisibleCountResult = {
    requestedFraction: targetFraction,
    bbox: [eMin, nMin, eMax, nMax],
    actualCount: p1.count,
    fetchMs: p1.fetchDoneAt - p1.fetchStart,
    parseMs: p1.parseDoneAt - p1.fetchDoneAt,
    frameCount: result.frameCount,
    frameTimeP50Ms: result.frameTimeP50Ms,
    frameTimeP95Ms: result.frameTimeP95Ms,
  };
  appendLog(
    `visible-count: ${point.actualCount.toLocaleString()} pts, fetch=${point.fetchMs.toFixed(0)}ms ` +
      `p50=${point.frameTimeP50Ms.toFixed(1)}ms p95=${point.frameTimeP95Ms.toFixed(1)}ms`,
  );
  return point;
}

// ---------------------------------------------------------------------
// 4. Streaming first-pixels. Tauri 2.11.5's register_uri_scheme_protocol
// only resolves one complete response per request (see lib.rs) — no
// streamed-body API. This simulates chunked delivery via N sequential
// requests to disjoint slices instead, each its own self-contained Arrow
// IPC message (own schema message, unlike real IPC streaming's
// schema-once framing) — an approximation of "does splitting the payload
// help first-pixels," not a measurement of the real backpressured
// transport M5 is meant to build and audit (ADR-004).
// ---------------------------------------------------------------------

interface StreamingResult {
  totalPoints: number;
  chunkCount: number;
  chunkSize: number;
  timeToFirstBatchRenderedMs: number;
  timeToStableViewMs: number;
}

async function runStreamingScenario(canvas: HTMLCanvasElement): Promise<StreamingResult> {
  const chunkSize = 256_000;
  const totalPoints = POINT_COUNT;
  const nChunks = Math.ceil(totalPoints / chunkSize);
  const positions = new Float32Array(totalPoints * 2);
  let received = 0;
  let pendingResolve: (() => void) | null = null;
  let firstBatchRenderedAt: number | null = null;

  setStatus(`M1.5 [4/4 streaming]: chunk 0/${nChunks}...`);
  const queryStart = performance.now();

  const deck: Deck<OrthographicView> = new Deck({
    canvas,
    views: new OrthographicView({ id: "ortho" }),
    initialViewState: { target: [0, 0, 0], zoom: -3 },
    controller: false,
    layers: [],
    onAfterRender: () => {
      if (firstBatchRenderedAt === null && received > 0) firstBatchRenderedAt = performance.now();
      pendingResolve?.();
      pendingResolve = null;
    },
  });

  // Guards against a hang, not just a slow case: this assumes every
  // setProps({layers}) call below produces exactly one subsequent
  // onAfterRender. That holds today (chunkSize doesn't evenly divide
  // POINT_COUNT, so no chunk is ever zero-length), but a future chunkSize
  // change could produce a props diff deck.gl decides not to redraw for,
  // and this loop has no other cancellation path (docs/01: every operation
  // cancellable) — so time out and proceed rather than hang forever.
  const RENDER_TIMEOUT_MS = 5000;
  function waitForRender(): Promise<void> {
    return new Promise((resolve) => {
      pendingResolve = resolve;
      setTimeout(() => {
        if (pendingResolve === resolve) {
          console.warn("[M1.5] streaming: onAfterRender did not fire within timeout, proceeding anyway");
          pendingResolve = null;
          resolve();
        }
      }, RENDER_TIMEOUT_MS);
    });
  }

  for (let i = 0; i < nChunks; i++) {
    const chunk = await loadP1Chunk(i, chunkSize);
    positions.set(chunk.positions, received * 2);
    received += chunk.count;
    setStatus(`M1.5 [4/4 streaming]: chunk ${i + 1}/${nChunks} (${received.toLocaleString()} pts so far)...`);
    const rendered = waitForRender();
    deck.setProps({
      layers: [
        new ScatterplotLayer({
          id: "p1-stream",
          data: { length: received, attributes: { getPosition: { value: positions, size: 2 } } },
          radiusUnits: "pixels",
          getRadius: 1.5,
          radiusMinPixels: 1,
          getFillColor: [56, 189, 248],
        }),
      ],
    });
    await rendered;
  }

  const stableViewAt = performance.now();
  deck.finalize();

  const point: StreamingResult = {
    totalPoints: received,
    chunkCount: nChunks,
    chunkSize,
    timeToFirstBatchRenderedMs: (firstBatchRenderedAt ?? 0) - queryStart,
    timeToStableViewMs: stableViewAt - queryStart,
  };
  appendLog(
    `streaming: ${point.chunkCount} chunks x ${point.chunkSize.toLocaleString()} — ` +
      `first batch=${point.timeToFirstBatchRenderedMs.toFixed(0)}ms, stable view=${point.timeToStableViewMs.toFixed(0)}ms`,
  );
  return point;
}

// ---------------------------------------------------------------------
// Orchestration
// ---------------------------------------------------------------------

interface M15Report {
  timestamp: string;
  scalingCurve: ScalingPoint[];
  toggles: ToggleResult[];
  visibleCount: VisibleCountResult;
  streaming: StreamingResult;
}

export async function runM15(): Promise<void> {
  const canvas = document.querySelector<HTMLCanvasElement>("#deck-canvas");
  if (!canvas) throw new Error("missing #deck-canvas");
  const halfWidth = (EXTENT_E[1] - EXTENT_E[0]) / 2;
  const halfHeight = (EXTENT_N[1] - EXTENT_N[0]) / 2;

  appendLog("M1.5 diagnostics starting (informal — no pass/fail conclusions)");

  const scalingCurve = await runScalingCurve(canvas, halfWidth, halfHeight);

  setStatus("M1.5 [2/4 toggles]: fetching 10M pts once for reuse...");
  const p1Full = await loadP1();
  const toggles = await runToggleExperiments(canvas, halfWidth, halfHeight, p1Full);

  const visibleCount = await runVisibleCountScenario(canvas, halfWidth, halfHeight);
  const streaming = await runStreamingScenario(canvas);

  const report: M15Report = {
    timestamp: new Date().toISOString(),
    scalingCurve,
    toggles,
    visibleCount,
    streaming,
  };

  console.log("[M1.5 DIAGNOSTIC REPORT]", report);
  setStatus("M1.5: diagnostics complete");
  await invoke("log_m1_5_report", { reportJson: JSON.stringify(report, null, 2) });
}
