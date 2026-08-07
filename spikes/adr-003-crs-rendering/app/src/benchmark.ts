// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { Deck, Layer, OrthographicView } from "@deck.gl/core";

// There's no browser-automation tool that can drive the native WebView2
// window (only Chrome tabs are reachable that way), so instead of a
// human/driver-scripted pan/zoom this runs a self-driving synthetic
// pan+zoom sweep and measures itself. Frame time is wall-clock delta
// between onAfterRender calls, which folds in compositing gaps as well as
// draw time — a fair proxy for perceived smoothness, though not identical
// to GPU frame time reported by devtools.
//
// Stopping condition is sample-count-based, not duration-based: at low
// frame rates a fixed wall-clock window can render so few frames that a
// fixed warmup *frame count* eats the whole window (an early M1 run: 6s at
// ~5 fps left 4 usable samples after a 30-frame warmup). Warm up by time
// instead, then keep animating until enough post-warmup samples exist for
// a meaningful p50/p95, capped so a stalled renderer can't hang forever.
export const DEFAULT_WARMUP_MS = 1000;
export const DEFAULT_TARGET_SAMPLES = 150;
export const DEFAULT_MAX_BENCHMARK_MS = 20000;

export interface PanZoomBenchmarkConfig {
  canvas: HTMLCanvasElement;
  buildLayers: () => Layer[];
  /** Half-extent of the dataset in world (metres) units, bounds the sweep. */
  halfWidth: number;
  halfHeight: number;
  /** @default true, matches deck.gl's own default */
  useDevicePixels?: boolean;
  warmupMs?: number;
  targetSamples?: number;
  maxBenchmarkMs?: number;
  /** Fires once, on the first onAfterRender — for status/progress UI. */
  onFirstPixels?: () => void;
}

export interface PanZoomBenchmarkResult {
  firstPixelsAt: number;
  warmupMs: number;
  targetSamples: number;
  benchmarkElapsedMs: number;
  frameCount: number;
  frameTimeP50Ms: number;
  frameTimeP95Ms: number;
}

export function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return NaN;
  const idx = Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length));
  return sorted[idx];
}

/** Runs one self-driving pan+zoom sweep and resolves with its frame-time stats. */
export function runPanZoomBenchmark(config: PanZoomBenchmarkConfig): Promise<PanZoomBenchmarkResult> {
  const warmupMs = config.warmupMs ?? DEFAULT_WARMUP_MS;
  const targetSamples = config.targetSamples ?? DEFAULT_TARGET_SAMPLES;
  const maxBenchmarkMs = config.maxBenchmarkMs ?? DEFAULT_MAX_BENCHMARK_MS;

  return new Promise((resolve) => {
    let firstPixelsAt: number | null = null;
    let lastFrameAt: number | null = null;
    let animStart = 0;
    let benchmarkDone = false;
    let benchmarkElapsedMs = 0;
    const frameTimes: number[] = [];

    function tick() {
      const t = performance.now() - animStart;
      const warmedUp = t >= warmupMs;
      const enoughSamples = frameTimes.length >= targetSamples;
      if ((warmedUp && enoughSamples) || t > maxBenchmarkMs) {
        benchmarkDone = true;
        benchmarkElapsedMs = t;
        finish();
        return;
      }
      // Sweep period is independent of the stopping condition so pan/zoom
      // keeps moving smoothly regardless of how long warmup/sampling take.
      const sweepPeriodMs = 4000;
      const angle = (t / sweepPeriodMs) * Math.PI * 2;
      const target: [number, number, number] = [
        Math.cos(angle) * config.halfWidth * 0.5,
        Math.sin(angle) * config.halfHeight * 0.5,
        0,
      ];
      const zoom = -3 + Math.sin((t / sweepPeriodMs) * Math.PI) * 1.5;
      deck.setProps({ viewState: { target, zoom } });
      requestAnimationFrame(tick);
    }

    function finish() {
      const usable = [...frameTimes].sort((a, b) => a - b);
      // Stats are computed from frameTimes above, already collected before
      // this runs — finalize() doesn't touch the measured numbers. It's new
      // versus M1's original inline harness (which left the last frame on
      // screen): M1.5 constructs ~13 more Deck instances on the same
      // canvas in one session, and leaving each WebGL context alive risks
      // hitting the browser's context limit.
      deck.finalize();
      resolve({
        firstPixelsAt: firstPixelsAt ?? 0,
        warmupMs,
        targetSamples,
        benchmarkElapsedMs,
        frameCount: usable.length,
        frameTimeP50Ms: percentile(usable, 50),
        frameTimeP95Ms: percentile(usable, 95),
      });
    }

    const deck: Deck<OrthographicView> = new Deck({
      canvas: config.canvas,
      views: new OrthographicView({ id: "ortho" }),
      initialViewState: { target: [0, 0, 0], zoom: -3 },
      controller: false,
      useDevicePixels: config.useDevicePixels ?? true,
      layers: config.buildLayers(),
      onAfterRender: () => {
        const now = performance.now();
        if (firstPixelsAt === null) {
          firstPixelsAt = now;
          config.onFirstPixels?.();
          animStart = now;
          requestAnimationFrame(tick);
        }
        if (animStart > 0 && !benchmarkDone) {
          const t = now - animStart;
          if (lastFrameAt !== null && t >= warmupMs) {
            frameTimes.push(now - lastFrameAt);
          }
          lastFrameAt = now;
        }
      },
    });
  });
}
