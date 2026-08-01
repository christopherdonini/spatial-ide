import { Deck, OrthographicView } from "@deck.gl/core";
import { ScatterplotLayer } from "@deck.gl/layers";
import { invoke } from "@tauri-apps/api/core";
import { loadP1, EXTENT_E, EXTENT_N } from "./p1-loader";

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
// fixed warmup *frame count* eats the whole window (seen in an early run:
// 6s at ~5 fps left 4 usable samples after a 30-frame warmup). Warm up by
// time instead, then keep animating until enough post-warmup samples exist
// for a meaningful p50/p95, capped so a truly stalled renderer can't hang
// the benchmark forever.
const WARMUP_MS = 1000;
const TARGET_SAMPLES = 150;
const MAX_BENCHMARK_MS = 20000;

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

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return NaN;
  const idx = Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length));
  return sorted[idx];
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

  let firstPixelsAt: number | null = null;
  let lastFrameAt: number | null = null;
  let animStart = 0;
  let benchmarkDone = false;
  let benchmarkElapsedMs = 0;
  const frameTimes: number[] = [];
  let resolveBenchmark: (() => void) | null = null;
  const benchmarkFinished = new Promise<void>((resolve) => {
    resolveBenchmark = resolve;
  });

  function tick() {
    const t = performance.now() - animStart;
    const warmedUp = t >= WARMUP_MS;
    const enoughSamples = frameTimes.length >= TARGET_SAMPLES;
    if ((warmedUp && enoughSamples) || t > MAX_BENCHMARK_MS) {
      benchmarkDone = true;
      benchmarkElapsedMs = t;
      resolveBenchmark?.();
      return;
    }
    // Sweep period is independent of the stopping condition so pan/zoom
    // keeps moving smoothly regardless of how long warmup/sampling take.
    const sweepPeriodMs = 4000;
    const angle = (t / sweepPeriodMs) * Math.PI * 2;
    const target: [number, number, number] = [
      Math.cos(angle) * halfWidth * 0.5,
      Math.sin(angle) * halfHeight * 0.5,
      0,
    ];
    const zoom = -3 + Math.sin((t / sweepPeriodMs) * Math.PI) * 1.5;
    deck.setProps({ viewState: { target, zoom } });
    requestAnimationFrame(tick);
  }

  const deck: Deck<OrthographicView> = new Deck({
    canvas,
    views: new OrthographicView({ id: "ortho" }),
    initialViewState: { target: [0, 0, 0], zoom: -3 },
    controller: false,
    layers: [
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
    onAfterRender: () => {
      const now = performance.now();
      if (firstPixelsAt === null) {
        firstPixelsAt = now;
        setStatus("M1: rendering, running self-driven pan/zoom benchmark...");
        animStart = now;
        requestAnimationFrame(tick);
      }
      if (animStart > 0 && !benchmarkDone) {
        const t = now - animStart;
        if (lastFrameAt !== null && t >= WARMUP_MS) {
          frameTimes.push(now - lastFrameAt);
        }
        lastFrameAt = now;
      }
    },
  });

  await benchmarkFinished;

  const usable = [...frameTimes].sort((a, b) => a - b);
  const report: M1Report = {
    timestamp: new Date().toISOString(),
    pointCount: p1.count,
    fetchMs: p1.fetchDoneAt - p1.fetchStart,
    parseMs: p1.parseDoneAt - p1.fetchDoneAt,
    timeToFirstPixelsMs: (firstPixelsAt ?? 0) - queryStart,
    warmupMs: WARMUP_MS,
    targetSamples: TARGET_SAMPLES,
    benchmarkElapsedMs,
    frameCount: usable.length,
    frameTimeP50Ms: percentile(usable, 50),
    frameTimeP95Ms: percentile(usable, 95),
  };

  console.log("[M1 BENCHMARK REPORT]", report);
  if (statsEl) statsEl.textContent = JSON.stringify(report, null, 2);
  setStatus("M1: benchmark complete");
  await invoke("log_m1_report", { reportJson: JSON.stringify(report, null, 2) });
}
