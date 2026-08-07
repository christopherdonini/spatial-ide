// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { COORDINATE_SYSTEM, Deck, OrthographicView } from "@deck.gl/core";
import { ScatterplotLayer } from "@deck.gl/layers";
import { invoke } from "@tauri-apps/api/core";
import { loadMarkersRaw } from "./p1-loader";
import { OffsetFrame, offsetPositions, recenterThresholdForBudget } from "./offset-frame";

// M2 — screen-space precision at 1:500 anywhere in the EPSG:2056 extent.
//
// Method: put a marker at an exactly-known f64 coordinate, predict where it
// must land on screen using f64 arithmetic on the CPU, render it, read the
// framebuffer back, locate the drawn marker's intensity centroid, and report
// |predicted - actual| in pixels.
//
// The prediction is computed from first principles (viewport centre + world
// delta * pixels-per-metre) rather than via deck.gl's own `viewport.project()`
// — using deck.gl to predict where deck.gl draws would only prove it is
// self-consistent, not that it is correct.
//
// Three origin policies run through the identical harness, which makes them
// directly comparable. All three are the same one-line operation
// `f32(coord - origin)`; only the choice of origin differs:
//   * naive-absolute  origin (0, 0)          — the control: absolute
//                     EPSG:2056 narrowed straight to f32.
//   * offset-fixed    origin = extent centre — what M1 shipped.
//   * offset-dynamic  origin follows the view — what ADR-003 asks for.

const SCALE_DENOMINATOR = 500;
const CSS_PX_PER_INCH = 96;
const M_PER_PX = (SCALE_DENOMINATOR * 0.0254) / CSS_PX_PER_INCH; // 0.1322916...
const PX_PER_M = 1 / M_PER_PX;
const ZOOM = Math.log2(PX_PER_M);

/** Declared *before* running, per docs/08. Both are hard targets. */
const BUDGET_ERROR_PX = 0.5;
const BUDGET_WOBBLE_PX = 0.5;

/** Fraction of the error budget the offset frame is allowed to spend. */
const RECENTER_BUDGET_PX = 0.1;

const WINDOW_PX = 41;
const JITTER_FRAMES = 100;
const JITTER_STEP_PX = 0.1;
const CAPTURE_TIMEOUT_MS = 5000;

/**
 * Puts the marker at a deliberately awkward spot: off-centre, and at a
 * non-integer pixel offset, so the measurement can't be flattered by landing
 * exactly on the viewport centre or on a pixel boundary.
 */
const TARGET_DELTA_E = -4.937;
const TARGET_DELTA_N = 3.121;

// Mirrors src-tauri/src/markers.rs. Kept textually identical so the
// bit-equality check below means what it claims.
const PATTERN_SPACING_M = 0.1;
const PATTERN_SIDE = 5;
const POINTS_PER_LOCATION = PATTERN_SIDE * PATTERN_SIDE;
const LOCATIONS: Array<{ name: string; e: number; n: number }> = [
  { name: "SW corner", e: 2_485_000.37, n: 1_075_000.23 },
  { name: "SE corner", e: 2_833_999.63, n: 1_075_000.23 },
  { name: "NW corner", e: 2_485_000.37, n: 1_295_999.77 },
  { name: "NE corner", e: 2_833_999.63, n: 1_295_999.77 },
  { name: "centre", e: 2_659_500.19, n: 1_185_500.31 },
];

// M1's fixed origin, reproduced here so offset-fixed reproduces M1's policy.
const EXTENT_E: [number, number] = [2_485_000, 2_834_000];
const EXTENT_N: [number, number] = [1_075_000, 1_296_000];
const FIXED_ORIGIN_E = (EXTENT_E[0] + EXTENT_E[1]) / 2;
const FIXED_ORIGIN_N = (EXTENT_N[0] + EXTENT_N[1]) / 2;

type Mode = "naive-absolute" | "offset-fixed" | "offset-dynamic" | "offset-dynamic-max-drift";
const MODES: Mode[] = [
  "naive-absolute",
  "offset-fixed",
  "offset-dynamic",
  "offset-dynamic-max-drift",
];

interface Capture {
  pixels: Uint8Array;
  x0: number;
  y0: number;
  w: number;
  h: number;
}

interface Centroid {
  x: number;
  y: number;
  weight: number;
  /** Intensity-weighted RMS radius — how spread out the drawn mark is. */
  spreadPx: number;
}

function setStatus(s: string) {
  const el = document.querySelector<HTMLParagraphElement>("#m2-status");
  if (el) el.textContent = s;
}

function appendLog(line: string) {
  const el = document.querySelector<HTMLPreElement>("#m2-log");
  if (el) el.textContent = (el.textContent ? el.textContent + "\n" : "") + line;
  console.log("[M2]", line);
}

/**
 * Intensity-weighted centroid, in continuous framebuffer coordinates
 * (y up from the bottom-left, matching readPixels; integers are pixel
 * *edges*, so pixel i's centre is i + 0.5).
 *
 * The background level is taken as the window minimum and subtracted, so the
 * estimator doesn't depend on what the renderer happens to clear to. Values
 * are the raw 8-bit channel WebGL wrote — no gamma decoding is applied
 * because the default drawing buffer is not sRGB-encoded on write, so
 * intensity is already linear in fragment coverage.
 */
/**
 * Minimum total intensity before a window counts as containing the mark.
 * A radius-6 disc carries ~28000; this rejects a stray lit pixel, which
 * would otherwise satisfy the retry loop and yield a wildly biased centroid
 * that still looks like a number.
 */
const MIN_CENTROID_WEIGHT = 500;

function intensityCentroid(c: Capture): Centroid | null {
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

  const x = sumWX / sumW;
  const y = sumWY / sumW;

  let sumW2 = 0;
  for (let j = 0; j < c.h; j++) {
    for (let i = 0; i < c.w; i++) {
      const w = c.pixels[(j * c.w + i) * 4] - background;
      if (w <= 0) continue;
      const dx = c.x0 + i + 0.5 - x;
      const dy = c.y0 + j + 0.5 - y;
      sumW2 += w * (dx * dx + dy * dy);
    }
  }

  return { x, y, weight: sumW, spreadPx: Math.sqrt(sumW2 / sumW) };
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

interface LocationResult {
  location: string;
  worldE: number;
  worldN: number;
  staticErrorPx: number;
  jitterFrames: number;
  meanErrorPx: number;
  maxErrorPx: number;
  wobblePx: number;
  patternSpreadPx: number;
  markerFound: boolean;
}

interface ModeResult {
  mode: Mode;
  perLocation: LocationResult[];
  worstErrorPx: number;
  worstWobblePx: number;
  recenterCount: number;
  /** Every origin change, so the transform is observable (docs/01 pr. 8). */
  recenterEvents: Array<{ driftM: number; toE: number; toN: number }>;
}

interface M2Report {
  timestamp: string;
  /**
   * False if anything happened that makes the numbers below untranscribable:
   * unverified ground truth, an unknown estimator floor, or any missing
   * capture. That last one matters most — a missing measurement silently
   * *lowers* a mode's worst-case, so a broken run scores better than a
   * working one. Nothing here should reach the README unless this is true.
   */
  valid: boolean;
  invalidReasons: string[];
  scale: {
    denominator: number;
    metresPerPixel: number;
    pixelsPerMetre: number;
    deckZoom: number;
  };
  framebuffer: { width: number; height: number; useDevicePixels: boolean };
  /** Empty-window captures that needed a retry. Nonzero is worth explaining. */
  captureRetries: number;
  markers: {
    totalPoints: number;
    locations: number;
    patternSide: number;
    patternSpacingM: number;
    patternSpacingPx: number;
    roundTripBitExact: boolean;
  };
  budgets: { errorPx: number; wobblePx: number };
  calibration: {
    errorPx: number;
    diagnostic: string;
    note: string;
  };
  offsetDynamic: {
    recenterThresholdM: number;
    recenterBudgetPx: number;
  };
  predictedNaiveBound: {
    eastingUlpM: number;
    northingUlpM: number;
    boundPx: number;
    note: string;
  };
  recenterCrossing: {
    thresholdM: number;
    frames: number;
    recenterFrameIndices: number[];
    maxErrorAtRecenterPx: number;
    maxErrorAwayFromRecenterPx: number;
    maxErrorFirstFramePx: number;
    framesMarkerMissing: number;
    missingOnSwapFrames: number;
    note: string;
  };
  modes: ModeResult[];
}

export async function runM2(): Promise<void> {
  setStatus("M2: loading precision markers over p1://markers ...");
  const markers = await loadMarkersRaw();

  // Independent recomputation of the same f64 values. This verifies the
  // Arrow IPC transport carried f64 bit-exactly (a real ADR-004 check); the
  // ground truth itself is the literal coordinate, asserted rather than
  // discovered.
  const half = (PATTERN_SIDE - 1) / 2;
  let roundTripBitExact = markers.e.length === LOCATIONS.length * POINTS_PER_LOCATION;
  if (roundTripBitExact) {
    let k = 0;
    outer: for (const loc of LOCATIONS) {
      for (let row = 0; row < PATTERN_SIDE; row++) {
        for (let col = 0; col < PATTERN_SIDE; col++) {
          if (
            markers.e[k] !== loc.e + (col - half) * PATTERN_SPACING_M ||
            markers.n[k] !== loc.n + (row - half) * PATTERN_SPACING_M
          ) {
            roundTripBitExact = false;
            break outer;
          }
          k++;
        }
      }
    }
  }
  appendLog(`markers: ${markers.e.length} pts, f64 round-trip bit-exact: ${roundTripBitExact}`);

  // The centre point of each 5x5 block sits exactly on its location (offset
  // (2-2)*0.1 == 0). One well-separated point per probe is what the position
  // measurement uses: 25 overlapping sprites 0.76 px apart would blend into a
  // single saturated blob, and a saturated blob has no sub-pixel signal left
  // to measure. The full 25-point grid is rendered separately, once per
  // probe, purely to check the decimetre structure survives.
  const centreIdx = LOCATIONS.map((_, li) => li * POINTS_PER_LOCATION + Math.floor(POINTS_PER_LOCATION / 2));
  const centresE = new Float64Array(centreIdx.map((i) => markers.e[i]));
  const centresN = new Float64Array(centreIdx.map((i) => markers.n[i]));

  const canvas = document.querySelector<HTMLCanvasElement>("#deck-canvas");
  if (!canvas) throw new Error("missing #deck-canvas");

  let fbW = 0;
  let fbH = 0;
  let pendingCapture: { x0: number; y0: number; w: number; h: number } | null = null;
  let captureResolve: ((c: Capture | null) => void) | null = null;
  /**
   * Frames to let pass before reading back. A render can already be in
   * flight when setProps is called, so the very next onAfterRender may still
   * show the *previous* frame's content — which reads back as an empty
   * window and silently scores as "marker not found" rather than as an
   * error. Skipping one frame makes the capture deterministic.
   */
  let skipFrames = 0;
  /**
   * Pinned once the framebuffer settles; every prediction afterwards assumes
   * these. A resize mid-run would silently invalidate earlier measurements,
   * so it is detected and reported rather than absorbed.
   */
  let pinnedW = 0;
  let pinnedH = 0;
  let framebufferChanged = false;
  /** Captures that came back empty and had to be retried (see measureAt). */
  let captureRetries = 0;

  const deck: Deck<OrthographicView> = new Deck({
    canvas,
    // flipY:false so northing increases up the screen, which makes the
    // predicted framebuffer position a straight `H/2 + scale*dN`.
    views: new OrthographicView({ id: "ortho", flipY: false }),
    viewState: { target: [0, 0, 0], zoom: ZOOM },
    controller: false,
    // 1 CSS px == 1 device px, so "pixel" is unambiguous in the results.
    useDevicePixels: false,
    // Redraw every animation frame rather than only on prop changes, so
    // "wait for the next frame" is always a bounded wait. Without it, a
    // setProps that deck.gl considers a no-op (e.g. re-issuing an identical
    // viewState) produces no render at all and the capture just times out.
    _animate: true,
    layers: [],
    onAfterRender: ({ gl }) => {
      fbW = gl.drawingBufferWidth;
      fbH = gl.drawingBufferHeight;
      if (pinnedW && (fbW !== pinnedW || fbH !== pinnedH)) framebufferChanged = true;
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

  function renderAndCaptureRect(
    props: Record<string, unknown>,
    rect: { x0: number; y0: number; w: number; h: number },
    skip = 1,
  ): Promise<Capture | null> {
    return new Promise<Capture | null>((resolve) => {
      let timer: ReturnType<typeof setTimeout> | undefined;
      let settled = false;
      // Clears the timer on the normal path so a run doesn't accumulate
      // ~1800 pending timeouts.
      const finish = (c: Capture | null) => {
        if (settled) return;
        settled = true;
        if (timer !== undefined) clearTimeout(timer);
        resolve(c);
      };
      captureResolve = finish;
      skipFrames = skip;
      pendingCapture = rect;
      deck.setProps(props);
      timer = setTimeout(() => {
        if (captureResolve === finish) {
          captureResolve = null;
          pendingCapture = null;
          console.warn("[M2] capture timed out waiting for onAfterRender");
        }
        finish(null);
      }, CAPTURE_TIMEOUT_MS);
    });
  }

  function renderAndCapture(
    props: Record<string, unknown>,
    expectedX: number,
    expectedY: number,
  ): Promise<Capture | null> {
    return renderAndCaptureRect(props, {
      x0: clamp(Math.round(expectedX) - (WINDOW_PX >> 1), 0, Math.max(0, fbW - WINDOW_PX)),
      y0: clamp(Math.round(expectedY) - (WINDOW_PX >> 1), 0, Math.max(0, fbH - WINDOW_PX)),
      w: WINDOW_PX,
      h: WINDOW_PX,
    });
  }

  /**
   * Capture, and verify the frame actually contains the mark.
   *
   * A viewport change can take an extra frame to land, so a capture taken
   * too early reads an empty window — which scores as "marker not found"
   * rather than as an error, silently turning a timing artefact into a
   * missing measurement. Retrying until there is signal removes that failure
   * mode. `props` is rebuilt per attempt because deck.gl layer instances are
   * single-use.
   *
   * `attempts = 1` disables the retry: the re-center crossing test needs a
   * null to stay null, because there a missing mark means the geometry
   * really did snap away from where it was predicted, which is the whole
   * thing that test is looking for.
   */
  async function measureAt(
    makeProps: () => Record<string, unknown>,
    ex: number,
    ey: number,
    attempts = 4,
  ): Promise<Centroid | null> {
    for (let a = 0; a < attempts; a++) {
      const cap = await renderAndCapture(makeProps(), ex, ey);
      const c = cap && intensityCentroid(cap);
      if (c) return c;
      // Counted, not swallowed: a retry replaces an empty window with a
      // settled frame, and an empty window during the jitter sweep would
      // mean a >20 px displacement — the single most interesting thing that
      // could happen. A nonzero count here is itself a finding.
      captureRetries++;
    }
    return null;
  }

  /**
   * Predicted framebuffer position of an absolute f64 coordinate, in f64.
   *
   * Derived from first principles rather than from deck.gl's own
   * `viewport.project()` — predicting deck.gl's output with deck.gl would
   * only demonstrate self-consistency. Framebuffer coordinates are y-up from
   * the bottom-left, matching readPixels, and integer values are pixel
   * *edges*, so the centroid estimator adds the matching +0.5.
   */
  function predict(worldE: number, worldN: number, targetE: number, targetN: number): [number, number] {
    return [
      measureW / 2 + PX_PER_M * (worldE - targetE),
      measureH / 2 + PX_PER_M * (worldN - targetN),
    ];
  }

  /**
   * deck.gl layer instances are single-use descriptors: once an instance has
   * been passed to setProps and then swapped out, re-passing that same object
   * does not bring it back. So every setProps that carries layers builds
   * fresh instances. The `data` object is created separately and reused by
   * reference, because deck.gl diffs `data` by identity — a stable reference
   * is what stops the attribute buffer being re-uploaded on every frame.
   */
  function makeData(positions: Float32Array, count: number) {
    return { length: count, attributes: { getPosition: { value: positions, size: 2 } } };
  }

  function pointLayer(id: string, data: ReturnType<typeof makeData>, radiusPx: number) {
    return new ScatterplotLayer({
      id,
      data,
      // Stated rather than inferred. deck.gl resolves DEFAULT to CARTESIAN
      // for a non-geospatial viewport, so this is what happens anyway — but
      // "no Web Mercator anywhere on this path" is a hard constraint of the
      // spike (docs/01, CRS is a type), and it should be visible in the code
      // rather than depend on a library default staying put.
      coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
      radiusUnits: "pixels",
      getRadius: radiusPx,
      radiusMinPixels: 0,
      radiusMaxPixels: 1000,
      getFillColor: [255, 255, 255],
    });
  }

  // Warm-up render, to learn the framebuffer size before the first capture
  // has to decide where to read.
  //
  // Waiting for a *settled* size, not merely a non-zero one: the first frame
  // can land while the canvas is still at the HTML default 300x150, before
  // CSS layout has stretched it to the window. Latching that stale size makes
  // every predicted position wrong by half the difference — which is exactly
  // the failure the calibration probe below caught during development.
  await new Promise<void>((resolve) => {
    const start = performance.now();
    const poll = () => {
      const settled =
        fbW > 0 && fbH > 0 && fbW === canvas.clientWidth && fbH === canvas.clientHeight;
      if (settled || performance.now() - start > CAPTURE_TIMEOUT_MS) resolve();
      else requestAnimationFrame(poll);
    };
    deck.setProps({ layers: [pointLayer("m2-warmup", makeData(new Float32Array([0, 0]), 1), 6)] });
    requestAnimationFrame(poll);
  });
  if (fbW !== canvas.clientWidth || fbH !== canvas.clientHeight || fbW === 0) {
    throw new Error(
      `M2: framebuffer never settled (${fbW}x${fbH} vs canvas ${canvas.clientWidth}x${canvas.clientHeight})`,
    );
  }
  // Every prediction from here on assumes these dimensions. A resize mid-run
  // would silently invalidate earlier measurements, so pin them and check.
  const measureW = fbW;
  const measureH = fbH;
  pinnedW = measureW;
  pinnedH = measureH;
  appendLog(`framebuffer ${fbW}x${fbH}, ${M_PER_PX.toFixed(6)} m/px, deck zoom ${ZOOM.toFixed(6)}`);

  // ---- Calibration -------------------------------------------------------
  // Same measurement at coordinates so small that f32 is exact, so precision
  // cannot be in play. Anything here beyond the estimator's noise floor is a
  // convention bug (half-pixel centre, y-flip, stray devicePixelRatio) that
  // would otherwise masquerade as a ~0.5 px precision result — right on the
  // budget — in every mode at once.
  let calibrationErrorPx = NaN;
  let calibrationDiagnostic = "";
  {
    const data = makeData(new Float32Array([0, 0]), 1);
    const [ex, ey] = predict(0, 0, TARGET_DELTA_E, TARGET_DELTA_N);
    const c = await measureAt(
      () => ({
        layers: [pointLayer("m2-calibration", data, 6)],
        viewState: { target: [TARGET_DELTA_E, TARGET_DELTA_N, 0], zoom: ZOOM },
      }),
      ex,
      ey,
    );
    if (c) {
      calibrationErrorPx = Math.hypot(c.x - ex, c.y - ey);
      appendLog(
        `calibration (f32-exact coords): error ${calibrationErrorPx.toFixed(4)} px` +
          (calibrationErrorPx > 0.1 ? "  <-- SUSPECT: convention bug, not precision" : ""),
      );
    } else {
      // Nothing in the predicted window. Sweep the whole framebuffer so the
      // failure reports *where the mark actually is* — a constant offset here
      // is a pixel-centre or y-flip convention bug, and saying so beats
      // reporting a bare NaN.
      const full = await renderAndCaptureRect(
        {
          layers: [pointLayer("m2-calibration", data, 6)],
          viewState: { target: [TARGET_DELTA_E, TARGET_DELTA_N, 0], zoom: ZOOM },
        },
        { x0: 0, y0: 0, w: measureW, h: measureH },
      );
      const found = full && intensityCentroid(full);
      calibrationDiagnostic = found
        ? `predicted (${ex.toFixed(1)}, ${ey.toFixed(1)}) but drawn at (${found.x.toFixed(1)}, ${found.y.toFixed(1)}); ` +
          `delta (${(found.x - ex).toFixed(1)}, ${(found.y - ey).toFixed(1)}) px`
        : "no mark anywhere in the framebuffer";
      appendLog(`calibration FAILED: ${calibrationDiagnostic}`);
    }
  }

  // ---- Per-mode measurement ---------------------------------------------
  const recenterThresholdM = recenterThresholdForBudget(PX_PER_M, RECENTER_BUDGET_PX);
  const modeResults: ModeResult[] = [];

  for (const mode of MODES) {
    const frame = new OffsetFrame(recenterThresholdM);
    const perLocation: LocationResult[] = [];

    for (let li = 0; li < LOCATIONS.length; li++) {
      const loc = LOCATIONS[li];
      const worldE = centresE[li];
      const worldN = centresN[li];
      const baseTargetE = worldE + TARGET_DELTA_E;
      const baseTargetN = worldN + TARGET_DELTA_N;

      const originFor = (tE: number, tN: number): [number, number] => {
        switch (mode) {
          case "naive-absolute":
            return [0, 0];
          case "offset-fixed":
            return [FIXED_ORIGIN_E, FIXED_ORIGIN_N];
          case "offset-dynamic":
            frame.maybeRecenter(tE, tN);
            return [frame.originE, frame.originN];
          case "offset-dynamic-max-drift": {
            // The dynamic policy re-centres *on* the view, so its measured
            // error is always at ~zero drift — which is the easy case, and
            // makes the five locations algebraically identical rather than
            // an empirical result. This mode places the origin exactly at
            // the re-centre threshold instead, measuring the worst state the
            // policy actually permits before it would rebuild.
            const leg = recenterThresholdM / Math.SQRT2;
            return [tE - leg, tN - leg];
          }
        }
      };

      const [originE, originN] = originFor(baseTargetE, baseTargetN);
      const positions = offsetPositions(centresE, centresN, originE, originN);
      const layerId = `m2-${mode}-${li}`;
      const centreData = makeData(positions, centresE.length);
      const centreLayers = () => [pointLayer(layerId, centreData, 6)];

      const localTarget = (tE: number, tN: number): [number, number] => [tE - originE, tN - originN];

      setStatus(`M2 [${mode}] ${loc.name}: static measurement...`);
      const [sx, sy] = predict(worldE, worldN, baseTargetE, baseTargetN);
      const [ltE, ltN] = localTarget(baseTargetE, baseTargetN);
      const staticCentroid = await measureAt(
        () => ({ layers: centreLayers(), viewState: { target: [ltE, ltN, 0], zoom: ZOOM } }),
        sx,
        sy,
      );
      const staticErrorPx = staticCentroid ? Math.hypot(staticCentroid.x - sx, staticCentroid.y - sy) : NaN;

      // Decimetre-structure check: the full 25-point grid for this probe.
      // Measured as intensity spread, not position — at 0.1 m spacing the
      // grid is ~3 px across, so a collapse under f32 quantisation shows up
      // as a smaller spread.
      const gridPositions = offsetPositions(markers.e, markers.n, originE, originN);
      const gridData = makeData(gridPositions, markers.e.length);
      const gridCentroid = await measureAt(
        () => ({
          layers: [pointLayer(`${layerId}-grid`, gridData, 1.2)],
          viewState: { target: [ltE, ltN, 0], zoom: ZOOM },
        }),
        sx,
        sy,
      );
      const patternSpreadPx = gridCentroid ? gridCentroid.spreadPx : NaN;

      // Sub-pixel pan sweep. Only viewState changes frame to frame, so the
      // attribute buffer is untouched and any wobble is projection-side.
      setStatus(`M2 [${mode}] ${loc.name}: ${JITTER_FRAMES}-frame sub-pixel pan...`);
      const stepM = (JITTER_STEP_PX * M_PER_PX) / Math.SQRT2;
      const errsX: number[] = [];
      const errsY: number[] = [];
      for (let f = 0; f < JITTER_FRAMES; f++) {
        const tE = baseTargetE + f * stepM;
        const tN = baseTargetN + f * stepM;
        const [px, py] = predict(worldE, worldN, tE, tN);
        const [jx, jy] = localTarget(tE, tN);
        // Fresh layer instance each frame (same `centreData` reference, so no
        // attribute re-upload) — the grid capture above swapped this layer
        // out, and a swapped-out instance cannot simply be re-passed.
        const c = await measureAt(
          () => ({ layers: centreLayers(), viewState: { target: [jx, jy, 0], zoom: ZOOM } }),
          px,
          py,
        );
        if (!c) continue;
        errsX.push(c.x - px);
        errsY.push(c.y - py);
      }

      const n = errsX.length;
      const meanX = n ? errsX.reduce((a, b) => a + b, 0) / n : NaN;
      const meanY = n ? errsY.reduce((a, b) => a + b, 0) / n : NaN;
      // NaN, not 0, when the static capture failed: seeding from 0 would let
      // a missing measurement quietly lower the mode's worst case.
      let maxErrorPx = staticErrorPx;
      let wobblePx = 0;
      for (let i = 0; i < n; i++) {
        maxErrorPx = Math.max(maxErrorPx, Math.hypot(errsX[i], errsY[i]));
        wobblePx = Math.max(wobblePx, Math.hypot(errsX[i] - meanX, errsY[i] - meanY));
      }

      const result: LocationResult = {
        location: loc.name,
        worldE,
        worldN,
        staticErrorPx,
        jitterFrames: n,
        meanErrorPx: Math.hypot(meanX, meanY),
        maxErrorPx,
        wobblePx,
        patternSpreadPx,
        markerFound: !!staticCentroid && n > 0,
      };
      perLocation.push(result);
      appendLog(
        `${mode} @ ${loc.name}: static ${staticErrorPx.toFixed(3)} px, ` +
          `max ${maxErrorPx.toFixed(3)} px, wobble ${wobblePx.toFixed(3)} px, ` +
          `grid spread ${patternSpreadPx.toFixed(2)} px`,
      );
    }

    modeResults.push({
      mode,
      perLocation,
      worstErrorPx: Math.max(...perLocation.map((r) => r.maxErrorPx)),
      worstWobblePx: Math.max(...perLocation.map((r) => r.wobblePx)),
      recenterCount: frame.recenterCount,
      recenterEvents: frame.events.map((e) => ({
        driftM: e.driftM,
        toE: e.toE,
        toN: e.toN,
      })),
    });
  }

  // ---- Forced re-center crossing ----------------------------------------
  // The dynamic frame's genuine risk is the swap frame: when the origin moves
  // the f32 buffer and the view target must be rebased *in the same frame*,
  // or geometry snaps by the full origin delta — which is exactly the vertex
  // jitter M2 exists to rule out. The budget-derived threshold is far too
  // large to cross during a sub-pixel sweep, so this uses a deliberately tiny
  // threshold to force crossings and measures the swap frames specifically.
  setStatus("M2: forced re-center crossing...");
  const crossingThresholdM = 3;
  const crossFrame = new OffsetFrame(crossingThresholdM);
  const crossLoc = LOCATIONS[4];
  const crossWorldE = centresE[4];
  const crossWorldN = centresN[4];
  const crossFrames = 120;
  const crossStepM = 0.5 * M_PER_PX; // 0.5 px per frame
  const recenterFrameIndices: number[] = [];
  let maxErrorAtRecenterPx = 0;
  let maxErrorAwayFromRecenterPx = 0;
  let framesMarkerMissing = 0;
  let missingOnSwapFrames = 0;
  /** Worst error seen on the *first* frame after setProps (skipFrames=0). */
  let maxErrorFirstFramePx = 0;
  {
    let originE = 0;
    let originN = 0;
    // Replaced by reference only when the origin moves; deck.gl diffs `data`
    // by identity, so a new object here is exactly what forces the f32
    // buffer to be re-uploaded on the swap frame and nowhere else.
    let crossData = makeData(new Float32Array(centresE.length * 2), centresE.length);
    for (let f = 0; f < crossFrames; f++) {
      const tE = crossWorldE + TARGET_DELTA_E + f * crossStepM;
      const tN = crossWorldN + TARGET_DELTA_N;
      const moved = crossFrame.maybeRecenter(tE, tN);
      if (moved) {
        originE = crossFrame.originE;
        originN = crossFrame.originN;
        crossData = makeData(offsetPositions(centresE, centresN, originE, originN), centresE.length);
        recenterFrameIndices.push(f);
      }
      const [px, py] = predict(crossWorldE, crossWorldN, tE, tN);
      // Buffer swap and target rebase go out in a single setProps — if these
      // were split across frames, this is where the snap would appear.
      //
      // Captured at skipFrames=0, i.e. the *first* onAfterRender after
      // setProps, with no retry: skipping a frame or retrying would read a
      // settled frame and step straight past a single-frame transient, which
      // is the only thing this test exists to catch.
      //
      // The cost of skip=0 is that a render already in flight yields a stale
      // frame. That is distinguishable rather than confounding: the sweep
      // pans 0.5 px per frame, so a stale read is ~0.5 px off, whereas a real
      // snap is the full 3 m origin delta — 22.7 px, two orders of magnitude
      // larger. Both are recorded.
      const makeCrossProps = () => ({
        layers: [pointLayer("m2-cross", crossData, 6)],
        viewState: { target: [tE - originE, tN - originN, 0], zoom: ZOOM },
      });
      const firstFrame = await renderAndCaptureRect(
        makeCrossProps(),
        {
          x0: clamp(Math.round(px) - (WINDOW_PX >> 1), 0, Math.max(0, measureW - WINDOW_PX)),
          y0: clamp(Math.round(py) - (WINDOW_PX >> 1), 0, Math.max(0, measureH - WINDOW_PX)),
          w: WINDOW_PX,
          h: WINDOW_PX,
        },
        0,
      );
      const cFirst = firstFrame && intensityCentroid(firstFrame);
      if (cFirst) {
        maxErrorFirstFramePx = Math.max(maxErrorFirstFramePx, Math.hypot(cFirst.x - px, cFirst.y - py));
      }
      const c = await measureAt(makeCrossProps, px, py, 1);
      if (!c) {
        // Mark absent from the predicted window entirely — a snap larger
        // than the search window, which is a failure, not a missing sample.
        framesMarkerMissing++;
        if (moved) missingOnSwapFrames++;
        continue;
      }
      const err = Math.hypot(c.x - px, c.y - py);
      if (moved) maxErrorAtRecenterPx = Math.max(maxErrorAtRecenterPx, err);
      else maxErrorAwayFromRecenterPx = Math.max(maxErrorAwayFromRecenterPx, err);
    }
  }
  appendLog(
    `re-center crossing: ${recenterFrameIndices.length} swaps over ${crossFrames} frames @ ${crossLoc.name}; ` +
      `max error on swap frames ${maxErrorAtRecenterPx.toFixed(3)} px, off-swap ${maxErrorAwayFromRecenterPx.toFixed(3)} px, ` +
      `marker missing on ${framesMarkerMissing} frames (${missingOnSwapFrames} of them swap frames)`,
  );

  // Analytic bound for the control, so the naive number reads as "arithmetic
  // predicted this and measurement confirmed it" rather than "we picked
  // coordinates that embarrass it".
  const ulp = (v: number) => Math.pow(2, Math.floor(Math.log2(Math.abs(v))) - 23);
  const eastingUlpM = ulp(EXTENT_E[1]);
  const northingUlpM = ulp(EXTENT_N[1]);
  const naiveBoundPx = Math.hypot((eastingUlpM / 2) * PX_PER_M, (northingUlpM / 2) * PX_PER_M);

  const invalidReasons: string[] = [];
  if (!roundTripBitExact) invalidReasons.push("marker f64 round-trip was not bit-exact");
  if (framebufferChanged) {
    invalidReasons.push("framebuffer resized mid-run — earlier predictions used stale dimensions");
  }
  if (!Number.isFinite(calibrationErrorPx)) {
    invalidReasons.push(`calibration produced no measurement (${calibrationDiagnostic})`);
  } else if (calibrationErrorPx > 0.1) {
    invalidReasons.push(
      `calibration ${calibrationErrorPx.toFixed(3)} px is too large to be estimator noise — likely a convention bug`,
    );
  }
  for (const m of modeResults) {
    for (const r of m.perLocation) {
      if (!r.markerFound || !Number.isFinite(r.staticErrorPx)) {
        invalidReasons.push(`${m.mode} @ ${r.location}: capture failed`);
      }
      if (r.jitterFrames !== JITTER_FRAMES) {
        invalidReasons.push(
          `${m.mode} @ ${r.location}: ${r.jitterFrames}/${JITTER_FRAMES} jitter frames measured`,
        );
      }
    }
  }
  if (invalidReasons.length) {
    appendLog(`RUN INVALID — do not transcribe:\n  - ${invalidReasons.join("\n  - ")}`);
  }

  const report: M2Report = {
    timestamp: new Date().toISOString(),
    valid: invalidReasons.length === 0,
    invalidReasons,
    scale: {
      denominator: SCALE_DENOMINATOR,
      metresPerPixel: M_PER_PX,
      pixelsPerMetre: PX_PER_M,
      deckZoom: ZOOM,
    },
    framebuffer: { width: measureW, height: measureH, useDevicePixels: false },
    captureRetries,
    markers: {
      totalPoints: markers.e.length,
      locations: LOCATIONS.length,
      patternSide: PATTERN_SIDE,
      patternSpacingM: PATTERN_SPACING_M,
      patternSpacingPx: PATTERN_SPACING_M * PX_PER_M,
      roundTripBitExact,
    },
    budgets: { errorPx: BUDGET_ERROR_PX, wobblePx: BUDGET_WOBBLE_PX },
    calibration: {
      errorPx: calibrationErrorPx,
      diagnostic: calibrationDiagnostic,
      note:
        "Same estimator at f32-exact coordinates, where precision cannot be in play. " +
        "Bounds the systematic floor (pixel-centre convention, y-flip, DPR) plus estimator noise; " +
        "offset-mode results cannot be claimed below it.",
    },
    offsetDynamic: {
      recenterThresholdM,
      recenterBudgetPx: RECENTER_BUDGET_PX,
    },
    predictedNaiveBound: {
      eastingUlpM,
      northingUlpM,
      boundPx: naiveBoundPx,
      note:
        "f32 ULP at the extent's far corner (easting 2^21 -> 0.25 m, northing 2^20 -> 0.125 m). " +
        "The bound is half an ULP per axis, from narrowing the absolute coordinate to f32 in the " +
        "attribute buffer. Note what this term is NOT: deck.gl's own auto-offset subtracts " +
        "Math.fround(target) in the shader, but it recomputes the compensating projection centre in " +
        "f64 each frame, so the origin term cancels exactly and contributes neither a constant " +
        "error nor wobble. That is why the naive control shows a large *static* error but small " +
        "wobble — the precision was destroyed at upload time, and no amount of shader-side " +
        "offsetting recovers it. It has to be subtracted in f64 before the narrowing, which is " +
        "precisely what ADR-003 asks for and what the offset modes here do.",
    },
    recenterCrossing: {
      thresholdM: crossingThresholdM,
      frames: crossFrames,
      recenterFrameIndices,
      maxErrorAtRecenterPx,
      maxErrorAwayFromRecenterPx,
      maxErrorFirstFramePx,
      framesMarkerMissing,
      missingOnSwapFrames,
      note:
        "Deliberately tiny threshold to force origin swaps; the budget-derived threshold is far too " +
        "large to cross during a sub-pixel sweep. Tests that the f32 rebuild and the view-target " +
        "rebase land in the same frame.",
    },
    modes: modeResults,
  };

  console.log("[M2 PRECISION REPORT]", report);
  const statsEl = document.querySelector<HTMLPreElement>("#m2-stats");
  if (statsEl) statsEl.textContent = JSON.stringify(report, null, 2);
  setStatus("M2: precision measurement complete");
  await invoke("log_m2_report", { reportJson: JSON.stringify(report, null, 2) });
}
