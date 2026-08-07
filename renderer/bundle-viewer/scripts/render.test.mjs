// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// The viewer's rendering and picking, which were product code with no tests until a review said so.
//
// Three of these exist because a reviewer read `pick` and `drawAll` against each other and found
// they disagreed: `drawAll` batched by style group, so painter's order was group-major, while `pick`
// searched by identity — so where two features in different groups overlapped, the pick returned one
// feature and the pixels showed another. The fixture's polygons tile a grid and never overlap, so
// the acceptance run could not have surfaced it. These are the tests that would have.
//
// They build `Partition` objects by hand rather than decoding Arrow, deliberately: the properties
// under test are arithmetic and ordering, and a decoder in the way would only add a second thing
// that could fail.

import test from 'node:test';
import assert from 'node:assert/strict';

import { importModule } from './bundle-for-test.mjs';

const { project, unproject, fitView, visibleBounds, pick, drawAll } = await importModule(
  'src/render.ts',
);

/**
 * A canvas context that records what was painted, in order.
 *
 * Testing `pick` on its own cannot catch the defect this file exists to prevent. The bug was not
 * that `pick` was wrong — it returned the highest id then as it does now — it was that `drawAll`
 * painted in a *different* order, so the pixels and the hover disagreed. Only a test that observes
 * both can see that, so this records each `fill()` and the world-space extent of the path that
 * produced it.
 */
function recordingContext(view) {
  const fills = [];
  let current = null;

  // Each device point is recorded back in **world** coordinates, so a recorded path can be matched
  // against the feature bboxes the test built — and so the recording exercises the projection
  // rather than assuming it.
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

/** The last painted path that covers a world point — i.e. what a viewer actually shows there. */
function topmostAt(fills, x, y) {
  for (let i = fills.length - 1; i >= 0; i--) {
    const f = fills[i];
    const pad = 1e-6;
    if (x >= f.xmin - pad && x <= f.xmax + pad && y >= f.ymin - pad && y <= f.ymax + pad) return f;
  }
  return null;
}

/** A style stub: one distinct appearance per group, so a recorded fill names its group. */
function styleStub(groupCount) {
  return {
    matchColumn: 'zone',
    legend: [],
    groups: Array.from({ length: groupCount }, (_, g) => ({
      fillColor: `#00000${g}`,
      fillOpacity: 1,
      outlineColor: '#000000',
      outlineWidth: 0,
    })),
  };
}

/** One square feature, `[x, x+size] × [y, y+size]`, with a given id. */
function square(id, x, y, size) {
  return {
    coords: new Float64Array([x, y, x + size, y, x + size, y + size, x, y + size, x, y]),
    ringOffsets: new Int32Array([0, 5]),
    polygonOffsets: new Int32Array([0, 1]),
    bbox: [x, y, x + size, y + size],
    id: BigInt(id),
  };
}

/** Assemble hand-built features into the shape `pick` consumes. */
function partition(path, features, groups = null) {
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
    groups: groups ?? new Uint8Array(features.length),
    attributes: [
      { name: 'zone', values: features.map((f) => (f.id % 2n === 0n ? 'residential' : null)) },
    ],
    bytes: 0,
  };
}

const LV95 = { xmin: 2_600_000, ymin: 1_200_000, xmax: 2_600_400, ymax: 1_200_400 };

test('ADR-010 rule 3: the origin subtraction happens before anything narrows', () => {
  const view = fitView(LV95, 800, 800);
  // The projected value of a point 0.01 m from the view centre must differ from the centre's own.
  // Doing `f32(coord)` first at LV95 magnitudes is exactly what destroys this: 2 600 200.01 and
  // 2 600 200 are the same float32.
  const [cx] = project(view.centerX, view.centerY, view);
  const [ox] = project(view.centerX + 0.01, view.centerY, view);
  assert.notEqual(cx, ox, 'a centimetre offset vanished — the subtraction is not happening in f64');

  // And the arithmetic really is offset-relative: narrowing the *absolute* coordinate loses it,
  // narrowing the *difference* does not. This is the mechanism, as arithmetic, not a benchmark.
  const absolute = Math.fround(view.centerX + 0.01) - Math.fround(view.centerX);
  const relative = Math.fround(view.centerX + 0.01 - view.centerX);
  assert.equal(absolute, 0, 'the control must lose the offset, or this test proves nothing');
  assert.ok(relative > 0, 'the offset-relative path must keep it');
});

test('project and unproject round-trip at LV95 magnitudes', () => {
  const view = fitView(LV95, 1280, 900);
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

test('the visible rectangle is the one the projection actually maps to the canvas', () => {
  const view = fitView(LV95, 800, 600);
  const [vxmin, vymin, vxmax, vymax] = visibleBounds(view);
  const [left, bottom] = project(vxmin, vymin, view);
  const [right, top] = project(vxmax, vymax, view);
  assert.ok(Math.abs(left) < 1e-6 && Math.abs(right - view.width) < 1e-6);
  assert.ok(Math.abs(bottom - view.height) < 1e-6 && Math.abs(top) < 1e-6);
});

test('ADR-010 rule 2: picking returns ids[i], never i', () => {
  // The ids are deliberately neither `0..n` nor ascending, so an implementation returning the array
  // index — or the feature's position in any other order — gives a different answer than the lookup.
  const features = [
    square(7000, 0, 0, 10),
    square(11, 20, 0, 10),
    square(999, 40, 0, 10),
  ];
  const p = partition('data/part-00000.arrows', features);

  assert.equal(pick([p], 5, 5).id, 7000n);
  assert.equal(pick([p], 25, 5).id, 11n);
  assert.equal(pick([p], 45, 5).id, 999n);
  // …and the pick carries the id, not the index: index 0 would be `0n`, index 1 `1n`.
  assert.notEqual(pick([p], 5, 5).id, 0n);
  assert.notEqual(pick([p], 25, 5).id, 1n);
});

test('a pick carries the partition it came from and that feature’s own attributes', () => {
  const p = partition('data/part-00003.arrows', [square(4, 0, 0, 10), square(5, 20, 0, 10)]);
  const even = pick([p], 5, 5);
  assert.equal(even.partitionPath, 'data/part-00003.arrows');
  assert.deepEqual(even.attributes, [{ name: 'zone', value: 'residential' }]);
  // A NULL the source carried stays a NULL — never an empty string, which the panel would render
  // as a value the feature does not have.
  const odd = pick([p], 25, 5);
  assert.deepEqual(odd.attributes, [{ name: 'zone', value: null }]);
});

test('nothing is picked outside every feature', () => {
  const p = partition('data/part-00000.arrows', [square(1, 0, 0, 10)]);
  assert.equal(pick([p], 50, 50), null);
  // Zero tolerance is the declared behaviour: a point just outside the geometry is a miss, not a
  // near-enough hit. Nothing snaps to the nearest feature.
  assert.equal(pick([p], 10.0001, 5), null);
});

test('overlap resolves to the highest id, which is what the painter draws last', () => {
  // `drawAll` paints partitions in manifest order and features in array order, and the publish path
  // orders rows by ascending identity — so the last drawn, and therefore the visible one, is the
  // highest id. `pick` searches backwards through the identical order.
  const p = partition('data/part-00000.arrows', [square(10, 0, 0, 30), square(20, 10, 10, 30)]);
  assert.equal(pick([p], 15, 15).id, 20n, 'the overlapped region must resolve to the higher id');
  assert.equal(pick([p], 5, 5).id, 10n);
  assert.equal(pick([p], 35, 35).id, 20n);
});

test('what is drawn on top is what is picked — across style groups', () => {
  // **The regression test for the defect a reviewer found, and it has to observe both functions.**
  // The bug was not that `pick` was wrong: it returned the higher id before the fix exactly as it
  // does after. It was that `drawAll` batched by style group, making painter's order group-major,
  // so a feature in a later group covered an earlier one regardless of identity — pixels showing
  // one feature while hover named another. A test of `pick` alone passes on the broken code.
  //
  // The two squares overlap, and the *lower* id sits in the *later* style group, which is precisely
  // the arrangement a group-major painter gets backwards.
  const features = [square(10, 0, 0, 30), square(20, 10, 10, 30)];
  const p = partition('data/part-00000.arrows', features, new Uint8Array([1, 0]));
  const view = fitView({ xmin: -10, ymin: -10, xmax: 50, ymax: 50 }, 600, 600);
  const { ctx, fills } = recordingContext(view);

  const stats = drawAll(ctx, [p], styleStub(2), view);
  assert.equal(stats.drawn, 2, 'both features should have been drawn');
  assert.equal(fills.length, 2, 'each feature is filled on its own path');

  // In the overlap, the topmost painted path and the picked feature must be the same feature.
  const painted = topmostAt(fills, 15, 15);
  const picked = pick([p], 15, 15);
  assert.equal(picked.id, 20n, 'pick did not follow draw order');
  // id 20 is the second feature drawn, so its fill is the later one and its group is 0.
  assert.equal(painted.fillStyle, 'rgba(0,0,0,1)', 'the visible fill is not the picked feature’s');
  // The last fill is the id-20 square, whose lower-left corner is (10, 10). Compared with a
  // tolerance because the recorded points made a round trip through the projection.
  assert.ok(Math.abs(fills[1].xmin - 10) < 1e-9, `the last fill starts at ${fills[1].xmin}, not 10`);
  assert.ok(Math.abs(fills[0].xmin - 0) < 1e-9, `the first fill starts at ${fills[0].xmin}, not 0`);
});

test('drawn and culled counts describe every feature, not one style group', () => {
  // These are printed to the reader as "N features drawn". With group-major batching they counted
  // only group 0, so the acceptance style would have shown the residential count as the total.
  const features = [square(1, 0, 0, 10), square(2, 20, 0, 10), square(3, 400, 400, 10)];
  const p = partition('data/part-00000.arrows', features, new Uint8Array([0, 1, 1]));
  const view = fitView({ xmin: 0, ymin: 0, xmax: 40, ymax: 40 }, 400, 400);
  const { ctx, fills } = recordingContext(view);

  const stats = drawAll(ctx, [p], styleStub(2), view);
  assert.equal(stats.drawn, 2, 'both visible features must be counted, across groups');
  assert.equal(stats.culled, 1, 'the off-screen feature must be counted as culled');
  assert.equal(fills.length, 2);
});

test('overlap across partitions resolves to the later partition', () => {
  const a = partition('data/part-00000.arrows', [square(1, 0, 0, 30)]);
  const b = partition('data/part-00001.arrows', [square(2, 10, 10, 30)]);
  const hit = pick([a, b], 15, 15);
  assert.equal(hit.id, 2n);
  assert.equal(hit.partitionPath, 'data/part-00001.arrows');
});

test('a point inside an interior ring is a miss, because fill and hit test share even-odd', () => {
  // The engine repairs nothing and guarantees no winding order, so even-odd is what makes a hole a
  // hole. `drawAll` fills each feature with `evenodd`; if the hit test used non-zero, a click in a
  // hole would identify the enclosing polygon while the pixels showed nothing there.
  const outer = [0, 0, 40, 0, 40, 40, 0, 40, 0, 0];
  const inner = [10, 10, 30, 10, 30, 30, 10, 30, 10, 10];
  const p = {
    index: 0,
    path: 'data/part-00000.arrows',
    ids: new BigUint64Array([42n]),
    coords: new Float64Array([...outer, ...inner]),
    ringOffsets: new Int32Array([0, 5, 10]),
    polygonOffsets: new Int32Array([0, 2]),
    features: 1,
    bboxes: new Float64Array([0, 0, 40, 40]),
    groups: new Uint8Array([0]),
    attributes: [],
    bytes: 0,
  };
  assert.equal(pick([p], 5, 5).id, 42n, 'a point in the ring wall must hit');
  assert.equal(pick([p], 20, 20), null, 'a point inside the hole must miss');
});
