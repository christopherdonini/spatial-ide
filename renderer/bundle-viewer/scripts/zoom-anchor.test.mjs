// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// Pre-committed unit tests for entry 86 / ZOOM-ANCHOR-PREREGISTRATION.md §4 (tests 1-5). Kept as a
// sibling of `render.test.mjs`, which the package.json glob `scripts/**/*.test.mjs` already covers,
// rather than folded into it: this file is about one property — the pointer and the view sharing one
// pixel space — while `render.test.mjs` is about drawing and picking correctness.
//
// `main.ts` itself is not imported here, for the same reason `bundle-for-test.mjs`'s own doc comment
// gives for `dist/app.js`: it touches `document`/`ResizeObserver` at module scope. So `toStore` and
// `sizeCanvasToClientBox` are exercised only through the E2E (`e2e/zoom-anchor.mjs`), and what is
// unit-tested here is the pure arithmetic each of them delegates to — `zoomAt`, `panBy`, and
// `resizeStore` — factored out of `render.ts` for exactly that reason (see each one's own doc
// comment).

import test from 'node:test';
import assert from 'node:assert/strict';

import { importModule } from './bundle-for-test.mjs';

const {
  project,
  unproject,
  fitView,
  pick,
  drawAll,
  panBy,
  resizeStore,
  zoomAt,
  clampStoreSize,
  MAX_BACKING_STORE_DIM,
  MAX_BACKING_STORE_PIXELS,
} = await importModule('src/render.ts');

const LV95 = { xmin: 2_600_000, ymin: 1_200_000, xmax: 2_600_400, ymax: 1_200_400 };

/** One square feature, `[x, x+size] x [y, y+size]`, with a given id — same shape `render.test.mjs`
 * builds by hand, duplicated here rather than imported so this file stays self-contained. */
function square(id, x, y, size) {
  return {
    coords: new Float64Array([x, y, x + size, y, x + size, y + size, x, y + size, x, y]),
    ringOffsets: new Int32Array([0, 5]),
    polygonOffsets: new Int32Array([0, 1]),
    bbox: [x, y, x + size, y + size],
    id: BigInt(id),
  };
}

function partition(path, features) {
  const coords = [];
  const ringOffsets = [0];
  const polygonOffsets = [0];
  const bboxes = new Float64Array(features.length * 4);
  const ids = new BigUint64Array(features.length);

  features.forEach((f, i) => {
    const vertexBase = coords.length / 2;
    for (const c of f.coords) coords.push(c);
    ringOffsets.push(vertexBase + f.coords.length / 2);
    polygonOffsets.push(ringOffsets.length - 1);
    bboxes.set(f.bbox, i * 4);
    ids[i] = f.id;
  });

  return {
    index: 0,
    path,
    ids,
    coords: new Float64Array(coords),
    ringOffsets: new Int32Array(ringOffsets),
    polygonOffsets: new Int32Array(polygonOffsets),
    features: features.length,
    bboxes,
    groups: new Uint8Array(features.length),
    attributes: [],
    bytes: 0,
  };
}

/**
 * A canvas context that records what was painted, in **world** coordinates (via `unproject`) — the
 * same pattern `render.test.mjs`'s own `recordingContext` uses, duplicated here (not imported) so
 * this file stays self-contained, matching this file's existing convention for `square`/`partition`.
 */
function recordingContext(view) {
  const fills = [];
  let current = null;
  const point = (px, py) => {
    if (!current) return;
    const [wx, wy] = unproject(px, py, view);
    current.xmin = Math.min(current.xmin, wx);
    current.ymin = Math.min(current.ymin, wy);
    current.xmax = Math.max(current.xmax, wx);
    current.ymax = Math.max(current.ymax, wy);
  };
  const ctx = {
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 0,
    clearRect() {},
    beginPath() {
      current = { xmin: Infinity, ymin: Infinity, xmax: -Infinity, ymax: -Infinity };
    },
    moveTo: point,
    lineTo: point,
    closePath() {},
    fill() {
      fills.push({ ...current, fillStyle: ctx.fillStyle });
    },
    stroke() {},
  };
  return { ctx, fills };
}

/** The last painted path that covers a world point — what a viewer actually shows there. */
function topmostAt(fills, x, y) {
  for (let i = fills.length - 1; i >= 0; i--) {
    const f = fills[i];
    const pad = 1e-6;
    if (x >= f.xmin - pad && x <= f.xmax + pad && y >= f.ymin - pad && y <= f.ymax + pad) return f;
  }
  return null;
}

/** A style stub: one group, so `drawAll` has a `DrawParameters` to read. */
function styleStub() {
  return {
    matchColumn: null,
    legend: [],
    groups: [{ fillColor: '#000000', fillOpacity: 1, outlineColor: '#000000', outlineWidth: 0 }],
  };
}

// ---- test 1: round-trip at a non-native box size -----------------------------------------------

test('project and unproject round-trip at a non-native box size (store != 1280x900, ratio != 1)', () => {
  // Deliberately not 1280x900 and not a 1280:900 aspect ratio either — today's round-trip test in
  // `render.test.mjs:157-166` runs only at the native size, so this is the one that would have caught
  // a hidden assumption that `view.width`/`view.height` are always the markup's own 1280/900.
  const view = fitView(LV95, 917, 611);
  for (const [x, y] of [
    [LV95.xmin, LV95.ymin],
    [LV95.xmax, LV95.ymax],
    [view.centerX, view.centerY],
    [2_600_123.456, 1_200_321.789],
  ]) {
    const [px, py] = project(x, y, view);
    const [rx, ry] = unproject(px, py, view);
    assert.ok(Math.abs(rx - x) < 1e-6, `x round-trip drifted by ${rx - x}`);
    assert.ok(Math.abs(ry - y) < 1e-6, `y round-trip drifted by ${ry - y}`);
  }
});

// ---- test 2: zoomAt is the pure anchor -----------------------------------------------------------

test('zoomAt: the world point under the pointer is identical before and after a notch', () => {
  // A non-native store size again, and a pointer point that is not the view centre — the bug this
  // piece fixes only shows up once the store and the CSS box disagree, and the fixed anchor is not
  // always dead centre.
  const view = fitView(LV95, 1600, 1000);
  const storeX = 1180;
  const storeY = 210;
  const [wxBefore, wyBefore] = unproject(storeX, storeY, view);

  zoomAt(view, storeX, storeY, 1.15); // zoom in
  const [wxAfterIn, wyAfterIn] = unproject(storeX, storeY, view);
  assert.ok(Math.abs(wxAfterIn - wxBefore) < 1e-6, `x anchor drifted by ${wxAfterIn - wxBefore}`);
  assert.ok(Math.abs(wyAfterIn - wyBefore) < 1e-6, `y anchor drifted by ${wyAfterIn - wyBefore}`);

  zoomAt(view, storeX, storeY, 1 / 1.15); // zoom back out
  const [wxAfterOut, wyAfterOut] = unproject(storeX, storeY, view);
  assert.ok(Math.abs(wxAfterOut - wxBefore) < 1e-6, `x did not return: drifted by ${wxAfterOut - wxBefore}`);
  assert.ok(Math.abs(wyAfterOut - wyBefore) < 1e-6, `y did not return: drifted by ${wyAfterOut - wyBefore}`);
});

// ---- test 3: panBy's law ---------------------------------------------------------------------

test('panBy: world distance moved = CSS drag distance x ratio / scale', () => {
  const view = fitView(LV95, 1600, 1000);
  const ratio = 1.5; // stands in for `toStore`'s measured store-px-per-CSS-px ratio
  const cssDeltaX = 37;
  const cssDeltaY = -21;
  const storeDeltaX = cssDeltaX * ratio;
  const storeDeltaY = cssDeltaY * ratio;
  const scaleBefore = view.scale;
  const centerXBefore = view.centerX;
  const centerYBefore = view.centerY;

  panBy(view, storeDeltaX, storeDeltaY);

  const expectedWorldDX = (cssDeltaX * ratio) / scaleBefore;
  const expectedWorldDY = (cssDeltaY * ratio) / scaleBefore;
  assert.ok(
    Math.abs(centerXBefore - view.centerX - expectedWorldDX) < 1e-9,
    'x pan distance did not match CSS distance x ratio / scale',
  );
  assert.ok(
    Math.abs(view.centerY - centerYBefore - expectedWorldDY) < 1e-9,
    'y pan distance did not match CSS distance x ratio / scale',
  );
  assert.equal(view.scale, scaleBefore, 'a pan must not change scale');
});

// ---- test 4: hover at a non-native size --------------------------------------------------------

test('hover: a store coordinate built the way toStore builds one (css * ratio) hits what drawAll actually painted, at a non-native size', () => {
  // **Not a second call to `project`, which test 1 already covers exhaustively — this test's
  // predecessor built its store coordinate that way and was tautological for exactly that reason
  // (reviewer note).** The view centre is `view.width/2, view.height/2` by `project`'s own
  // definition, so it is known without calling `project` at all; the bounds below put it at world
  // (50, 50), inside feature 42's square.
  const bounds = { xmin: 0, ymin: 0, xmax: 100, ymax: 100 };
  const view = fitView(bounds, 733, 511); // a non-native store size
  const features = [square(42, 40, 40, 20), square(7, 0, 0, 10)];
  const p = partition('data/part-00000.arrows', features);
  const { ctx, fills } = recordingContext(view);
  const stats = drawAll(ctx, [p], styleStub(), view);
  assert.equal(stats.drawn, 2, 'both features must have been drawn for this fixture to mean anything');

  const storeXAtCentre = view.width / 2;
  const storeYAtCentre = view.height / 2;

  // A non-1 ratio, and the store coordinate reconstructed as `css * ratio` — exactly `toStore`'s own
  // arithmetic (`toStore(e) = [e.offsetX * rx, e.offsetY * ry]`, `main.ts`), which is the property
  // this test exists to exercise: a real hover handler never has a store coordinate handed to it
  // directly, only a CSS one and a ratio to multiply by.
  const ratio = 1.37;
  const cssX = storeXAtCentre / ratio;
  const cssY = storeYAtCentre / ratio;
  const storeX = cssX * ratio;
  const storeY = cssY * ratio;

  const [wx, wy] = unproject(storeX, storeY, view);
  const hit = pick([p], wx, wy);
  assert.equal(
    hit?.id,
    42n,
    'the pick from a css*ratio store coordinate missed the feature at a non-native size',
  );

  // Independent oracle: `drawAll`'s own rasterization loop — a different code path from
  // `pick`/`unproject` — agrees that something is actually painted where the pick resolved to. This
  // is what gives the test a pixel-space reason to fail, not only an algebraic one.
  const painted = topmostAt(fills, wx, wy);
  assert.ok(painted, 'nothing was actually painted at the point the pick resolved to');
});

// ---- test 5: resize invariant ------------------------------------------------------------------

test('resizeStore: centre unchanged, scale multiplied by the ratio change', () => {
  const view = fitView(LV95, 1280, 900);
  const centerXBefore = view.centerX;
  const centerYBefore = view.centerY;
  const scaleBefore = view.scale;

  resizeStore(view, 1920, 1200, 1.5);

  assert.equal(view.centerX, centerXBefore, 'a resize is not a zoom: the centre must not move');
  assert.equal(view.centerY, centerYBefore, 'a resize is not a zoom: the centre must not move');
  assert.ok(
    Math.abs(view.scale - scaleBefore * 1.5) < 1e-9,
    `scale should be the old scale x the ratio change, was ${view.scale}`,
  );
  assert.equal(view.width, 1920);
  assert.equal(view.height, 1200);
});

// ---- test 5b: the resize invariant at the declared backing-store ceiling ------------------------

test('clampStoreSize at the ceiling: one shared factor, the store keeps the client box aspect', () => {
  // An elongated client box, chosen so BOTH ceilings do real work: the per-axis ceiling alone would
  // clamp only the wide axis (reviewer B1's counterexample, at the *previous* two-step
  // implementation: 5000x3500 -> 4096x3500, aspect 1.17 against the client box's own 1.43).
  const cssWidth = 5000;
  const cssHeight = 3500;
  const dpr = 1;
  assert.ok(
    cssWidth * dpr > MAX_BACKING_STORE_DIM,
    'fixture check: the width must actually exceed the per-axis ceiling',
  );

  // The shipped function, not a replica of its arithmetic (reviewer item 1): this test exercises the
  // exact code `sizeCanvasToClientBox` (main.ts) calls.
  const { width: storeWidth, height: storeHeight } = clampStoreSize(cssWidth, cssHeight, dpr);

  assert.ok(storeWidth <= MAX_BACKING_STORE_DIM && storeHeight <= MAX_BACKING_STORE_DIM);
  assert.ok(storeWidth * storeHeight <= MAX_BACKING_STORE_PIXELS);
  assert.ok(storeWidth < cssWidth, 'fixture check: the clamped store must be smaller than the client box');

  // **One shared factor means the clamped store keeps the client box's own aspect** (reviewer B1) —
  // not the per-axis-then-uniform-shrink sequence that produced 1.17 against 1.43 before the fix.
  const clientAspect = cssWidth / cssHeight;
  const storeAspect = storeWidth / storeHeight;
  assert.ok(
    Math.abs(storeAspect - clientAspect) / clientAspect < 0.01,
    `store aspect ${storeAspect} drifted more than 1% from the client box's own ${clientAspect}`,
  );

  // The ratio `toStore` would measure from the element post-clamp — not `dpr` (1), which is exactly
  // the "measured, never assumed" property under test here.
  const clampedRatio = storeWidth / cssWidth;
  const priorRatio = 1; // whatever the previous sizing measured, before this (hypothetical) resize

  const view = fitView(LV95, 2000, 1400); // an existing view, before the resize under test
  const centerXBefore = view.centerX;
  const centerYBefore = view.centerY;
  const scaleBefore = view.scale;

  resizeStore(view, storeWidth, storeHeight, clampedRatio / priorRatio);

  assert.equal(view.centerX, centerXBefore, 'clamped or not, a resize must not move the centre');
  assert.equal(view.centerY, centerYBefore, 'clamped or not, a resize must not move the centre');
  assert.ok(
    Math.abs(view.scale - scaleBefore * (clampedRatio / priorRatio)) < 1e-9,
    'clamped or not, scale must still be the old scale x the ratio change',
  );
  assert.equal(view.width, storeWidth);
  assert.equal(view.height, storeHeight);
});
