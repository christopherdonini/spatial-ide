// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { ScatterplotLayer } from "@deck.gl/layers";
import { invoke } from "@tauri-apps/api/core";
import { runPanZoomBenchmark, DEFAULT_WARMUP_MS, DEFAULT_TARGET_SAMPLES } from "./benchmark";
import { loadP1, EXTENT_E, EXTENT_N } from "./p1-loader";

interface M1Report {
  timestamp: string;
  pointCount: number;
  fetchMs: number;
  parseMs: number;
  timeToFirstPixelsMs: number;
  warmupMs: number;
  targetSamples: number;
  benchmarkElapsedMs: number;
  frameCount: number;
  frameTimeP50Ms: number;
  frameTimeP95Ms: number;
}

export async function runM1(): Promise<void> {
  const statusEl = document.querySelector<HTMLParagraphElement>("#m1-status");
  const statsEl = document.querySelector<HTMLPreElement>("#m1-stats");
  const setStatus = (s: string) => {
    if (statusEl) statusEl.textContent = s;
  };

  const queryStart = performance.now();
  setStatus("M1: fetching P1 (10M pts) over p1:// ...");
  const p1 = await loadP1();
  setStatus(`M1: fetched ${p1.count.toLocaleString()} pts, building layer...`);

  const canvas = document.querySelector<HTMLCanvasElement>("#deck-canvas");
  if (!canvas) throw new Error("missing #deck-canvas");

  // Bounds the synthetic pan sweep so it traverses real data, not empty
  // space beyond P1's extent.
  const halfWidth = (EXTENT_E[1] - EXTENT_E[0]) / 2;
  const halfHeight = (EXTENT_N[1] - EXTENT_N[0]) / 2;

  const result = await runPanZoomBenchmark({
    canvas,
    halfWidth,
    halfHeight,
    warmupMs: DEFAULT_WARMUP_MS,
    targetSamples: DEFAULT_TARGET_SAMPLES,
    onFirstPixels: () => setStatus("M1: rendering, running self-driven pan/zoom benchmark..."),
    buildLayers: () => [
      new ScatterplotLayer({
        id: "p1",
        data: {
          length: p1.count,
          attributes: { getPosition: { value: p1.positions, size: 2 } },
        },
        radiusUnits: "pixels",
        getRadius: 1.5,
        radiusMinPixels: 1,
        getFillColor: [56, 189, 248],
      }),
    ],
  });

  const report: M1Report = {
    timestamp: new Date().toISOString(),
    pointCount: p1.count,
    fetchMs: p1.fetchDoneAt - p1.fetchStart,
    parseMs: p1.parseDoneAt - p1.fetchDoneAt,
    timeToFirstPixelsMs: result.firstPixelsAt - queryStart,
    warmupMs: result.warmupMs,
    targetSamples: result.targetSamples,
    benchmarkElapsedMs: result.benchmarkElapsedMs,
    frameCount: result.frameCount,
    frameTimeP50Ms: result.frameTimeP50Ms,
    frameTimeP95Ms: result.frameTimeP95Ms,
  };

  console.log("[M1 BENCHMARK REPORT]", report);
  if (statsEl) statsEl.textContent = JSON.stringify(report, null, 2);
  setStatus("M1: benchmark complete");
  await invoke("log_m1_report", { reportJson: JSON.stringify(report, null, 2) });
}
