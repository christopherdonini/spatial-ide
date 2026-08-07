// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// The TypeScript half of the cross-implementation style contract.
//
// The publisher compiles the style in Rust and this viewer reads the same document again in
// TypeScript. Two implementations of one resolution rule is the shape in which a style silently
// means two things — the publisher's legend saying one thing and the drawn map another, with nothing
// raised, and no test in either language able to see it.
//
// So both read **the same vector**, `renderer/tests/data/style-agreement.json`, and neither
// generates it from its own output. Its Rust counterpart is `renderer/tests/style_agreement.rs`.

import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import test from 'node:test';
import assert from 'node:assert/strict';

import { importModule } from './bundle-for-test.mjs';

const { Style } = await importModule('src/style.ts');

const vector = JSON.parse(readFileSync('../tests/data/style-agreement.json', 'utf8'));

test('the canonical bytes in the vector really do hash to the recorded style hash', () => {
  // This is what the viewer checks at load: the hash of the **stored** bytes. It never
  // re-canonicalizes, because that would test this serializer rather than the bundle's bytes.
  const hash = `sha256:${createHash('sha256').update(vector.expected_canonical_json, 'utf8').digest('hex')}`;
  assert.equal(hash, vector.expected_style_hash);
});

test('typescript resolves every branch exactly as the shared vector says', () => {
  const style = Style.parse(vector.expected_canonical_json, 'style.json');
  assert.equal(style.matchColumn, 'zone');

  // **The non-empty assertion is load-bearing.** Every check below is inside this loop, so an empty
  // `probes` array makes the cross-implementation agreement vacuous while this test still reports
  // green — and the same is true of its Rust counterpart. Demonstrated by emptying the vector:
  // both sides passed, resolving nothing.
  assert.ok(
    vector.probes.length > 0,
    'the shared vector declares no probes, so this test would assert nothing about resolution',
  );
  for (const probe of vector.probes) {
    const d = style.resolve(probe.key);
    const label = JSON.stringify(probe.key);
    assert.equal(d.fillColor, probe.fill_color, `fill_color at ${label}`);
    assert.equal(d.fillOpacity, probe.fill_opacity, `fill_opacity at ${label}`);
    assert.equal(d.outlineColor, probe.outline_color, `outline_color at ${label}`);
    assert.equal(d.outlineWidth, probe.outline_width, `outline_width at ${label}`);
  }
});

test('the legend has one row per declared case plus the two fallbacks, in declaration order', () => {
  const style = Style.parse(vector.expected_canonical_json, 'style.json');
  assert.equal(style.legend.length, vector.expected_legend_rows);
  assert.deepEqual(
    style.legend.map((e) => (e.kind.kind === 'case' ? e.kind.value : e.kind.kind)),
    ['residential', 'industrial', 'null', 'unmatched'],
  );
});

test('a value with no declared case takes on_unmatched, and NULL takes on_null', () => {
  // The two branches a style must declare and a bundle must exercise. `null` here is a NULL the
  // source carried, not an absent probe.
  const style = Style.parse(vector.expected_canonical_json, 'style.json');
  assert.equal(style.resolve('a value nobody declared').fillColor, '#cccccc');
  assert.equal(style.resolve(null).fillColor, '#888888');
  // …and grouping agrees with resolution, or features would be drawn in the wrong batch.
  assert.equal(style.groups[style.groupFor(null)].fillColor, '#888888');
  assert.equal(style.groups[style.groupFor('nope')].fillColor, '#cccccc');
  assert.equal(style.groups[style.groupFor('residential')].fillColor, '#aa3333');
});

test('an unsupported style version is refused rather than read best-effort', () => {
  const doc = JSON.parse(vector.expected_canonical_json);
  doc.style_version = 99;
  assert.throws(() => Style.parse(JSON.stringify(doc), 'style.json'), /style-unsupported-version/);
});

test('an all-literal style carries no legend, which is a declared consequence', () => {
  const src = JSON.stringify({
    style_version: 1,
    layer: {
      geometry: 'polygon',
      fill_color: { literal: '#123456' },
      fill_opacity: { literal: 1 },
      outline_color: { literal: '#000000' },
      outline_width: { literal: 0.5 },
    },
  });
  const style = Style.parse(src, 'style.json');
  assert.equal(style.matchColumn, null);
  assert.equal(style.legend.length, 0);
  assert.equal(style.groups.length, 1);
});
