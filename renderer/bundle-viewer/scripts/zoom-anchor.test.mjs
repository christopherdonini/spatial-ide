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
  panBy,
  resizeStore,
  zoomAt,
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

test('hover: a pick at a non-native size hits the feature under the pointer', () => {
  const view = fitView({ xmin: 0, ymin: 0, xmax: 100, ymax: 100 }, 733, 511);
  const p = partition('data/part-00000.arrows', [square(42, 10, 10, 20)]);
  // A point inside the square (20, 20), converted the same way a real pointer's toStore output
  // would be: project to store pixels at THIS view's own dimensions, then unproject exactly as
  // `hover()` does.
  const [storeX, storeY] = project(20, 20, view);
  const [wx, wy] = unproject(storeX, storeY, view);
  const hit = pick([p], wx, wy);
  assert.equal(hit?.id, 42n, 'the pick at a non-native box size missed the feature under the point');
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

test('resizeStore at the ceiling: the store clamps, the measured ratio absorbs it, the centre stays put', () => {
  // The same clamp arithmetic `sizeCanvasToClientBox` (main.ts) performs, replicated here so this
  // fixture is tied to the real declared constants rather than an invented pair of numbers. An
  // elongated client box, chosen so BOTH ceilings do real work: the per-axis ceiling clamps the wide
  // axis first, and the total-pixel ceiling then shrinks both axes together (proportionally, so the
  // clamped store keeps the client box's own aspect — §2's "the store clamps ... anchoring stays
  // exact" behaviour, not a distorted one).
  const dpr = 1;
  const cssWidth = 5000;
  const cssHeight = 3500;
  let storeWidth = Math.round(cssWidth * dpr);
  let storeHeight = Math.round(cssHeight * dpr);
  assert.ok(
    storeWidth > MAX_BACKING_STORE_DIM,
    'fixture check: the width must actually exceed the per-axis ceiling',
  );

  storeWidth = Math.min(storeWidth, MAX_BACKING_STORE_DIM);
  storeHeight = Math.min(storeHeight, MAX_BACKING_STORE_DIM);
  assert.ok(
    storeWidth * storeHeight > MAX_BACKING_STORE_PIXELS,
    'fixture check: the area must still exceed the pixel-count ceiling after the per-axis clamp — ' +
      'this is the case MAX_BACKING_STORE_PIXELS < MAX_BACKING_STORE_DIM**2 exists to make reachable',
  );
  const shrink = Math.sqrt(MAX_BACKING_STORE_PIXELS / (storeWidth * storeHeight));
  storeWidth = Math.floor(storeWidth * shrink);
  storeHeight = Math.floor(storeHeight * shrink);
  assert.ok(storeWidth < cssWidth, 'fixture check: the clamped store must be smaller than the client box');

  // The ratio `toStore` would measure from the element post-clamp — not `dpr` (1), which is exactly
  // the "measured, never assumed" property under test here.
  const clampedRatioX = storeWidth / cssWidth;
  const priorRatioX = 1; // whatever the previous sizing measured, before this (hypothetical) resize

  const view = fitView(LV95, 2000, 1400); // an existing view, before the resize under test
  const centerXBefore = view.centerX;
  const centerYBefore = view.centerY;
  const scaleBefore = view.scale;

  resizeStore(view, storeWidth, storeHeight, clampedRatioX / priorRatioX);

  assert.equal(view.centerX, centerXBefore, 'clamped or not, a resize must not move the centre');
  assert.equal(view.centerY, centerYBefore, 'clamped or not, a resize must not move the centre');
  assert.ok(
    Math.abs(view.scale - scaleBefore * (clampedRatioX / priorRatioX)) < 1e-9,
    'clamped or not, scale must still be the old scale x the ratio change',
  );
  assert.equal(view.width, storeWidth);
  assert.equal(view.height, storeHeight);
});
