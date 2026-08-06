// Reading the manifest — the bundle's contract, and the first thing a viewer trusts.
//
// A manifest arrives from wherever the bundle was served from, so it is untrusted input in the
// `docs/09` sense. These check that it is treated as one: an unimplemented version is refused rather
// than read best-effort, a malformed shape fails with a named state instead of surfacing later as an
// undefined property, and a path that would escape the bundle is refused before it is fetched.

import test from 'node:test';
import assert from 'node:assert/strict';

import { importModule } from './bundle-for-test.mjs';

const { parseManifest, SUPPORTED_BUNDLE_VERSION } = await importModule('src/manifest.ts');

/** A minimal manifest of the shape the publisher emits. */
function manifest(overrides = {}) {
  const base = {
    bundle_version: SUPPORTED_BUNDLE_VERSION,
    bundle: {},
    source: {},
    source_verification: 'x',
    style: {
      resource: {
        logical_uri: 'spatial://dataset/parcels/style',
        content_hash: 'sha256:aaaa',
        source_revision: { state: 'none-pinned', basis: 'x' },
        locators: [{ kind: 'bundle-local', at: 'style.json' }],
        cache_status: 'materialized-in-bundle',
        portability_policy: 'self-contained',
      },
      style_version: 1,
      match_column: 'zone',
    },
    software: {},
    operation: {},
    crs: {
      source: 'EPSG:2056',
      source_definition: null,
      display: 'EPSG:2056',
      transform: 'none — rendered in source CRS',
      crs_source: 'file',
      axis_order: 'easting,northing',
      axis_normalization: 'none-performed',
    },
    identity: {
      id_source: 'file:id',
      id_uniqueness: 'verified-at-open-full-file',
      id_verified_rows: 3,
      id_js_exact: true,
      caveat: 'stability across reopen is not established',
    },
    schema: [
      { name: 'id', arrow_type: 'UInt64', nullable: false },
      { name: 'geometry', arrow_type: 'List<...>', nullable: false },
      { name: 'zone', arrow_type: 'Utf8', nullable: true },
    ],
    bounds: { xmin: 1, ymin: 2, xmax: 3, ymax: 4, crs: 'EPSG:2056', basis: 'computed-over-published-rows' },
    data: {
      rows: 3,
      format: { geometry_encoding: 'geoarrow.polygon', compression: 'none' },
      partitions: [
        { path: 'data/part-00000.arrows', bytes: 10, content_hash: 'sha256:bbbb', rows: 3 },
      ],
    },
    viewer: [{ path: 'viewer/app.js', bytes: 5, content_hash: 'sha256:cccc' }],
    license: { state: 'not-declared' },
    reproducibility: { grade: 'Snapshot' },
    derived_caches: [],
    query_surface: { available: false },
    sidecar: { path: 'build-info.json', hashed: false, verified: false },
  };
  return JSON.stringify({ ...base, ...overrides });
}

test('a well-formed manifest parses into what the viewer actually uses', () => {
  const m = parseManifest(manifest());
  assert.equal(m.crsSource, 'EPSG:2056');
  assert.equal(m.crsTransform, 'none — rendered in source CRS');
  assert.equal(m.rows, 3);
  assert.equal(m.partitions.length, 1);
  assert.equal(m.partitions[0].rows, 3);
  // Everything after `id` and `geometry` is the declared projection, in declared order.
  assert.deepEqual(m.attributeColumns, ['zone']);
  assert.equal(m.style.matchColumn, 'zone');
  // The style's path is its **locator**, not its logical URI — the URI is not a fetchable path.
  assert.equal(m.style.path, 'style.json');
  // The manifest lists no byte count for the style, and `null` says so rather than `0` pretending
  // to be a length assertion.
  assert.equal(m.style.bytes, null);
  assert.equal(m.reproducibilityGrade, 'Snapshot');
});

test('a bundle_version this build does not implement is refused, not read best-effort', () => {
  // Guessing at a future version's meaning is the silent-conversion failure one level up.
  assert.throws(
    () => parseManifest(manifest({ bundle_version: SUPPORTED_BUNDLE_VERSION + 1 })),
    /manifest-unsupported-version/,
  );
  assert.throws(() => parseManifest(manifest({ bundle_version: 'one' })), /manifest-schema-invalid/);
});

test('bytes that are not JSON produce the named state, not a stray SyntaxError', () => {
  assert.throws(() => parseManifest('not json at all'), /manifest-unparseable/);
  assert.throws(() => parseManifest('[]'), /manifest-schema-invalid/);
});

test('a malformed shape fails here rather than three layers down', () => {
  const cases = [
    ['crs', { crs: 'EPSG:2056' }],
    ['schema', { schema: 'zone' }],
    ['data.rows', { data: { rows: 'three', format: {}, partitions: [] } }],
    ['bounds', { bounds: { xmin: 'a', ymin: 2, xmax: 3, ymax: 4, basis: 'x' } }],
    ['identity', { identity: {} }],
  ];
  for (const [what, override] of cases) {
    assert.throws(
      () => parseManifest(manifest(override)),
      /manifest-schema-invalid/,
      `a malformed ${what} was accepted`,
    );
  }
});

test('an asset path that would escape the bundle is refused before it is fetched', () => {
  // The publisher validates on the way out. A reader that trusted the manifest for this would be
  // trusting a file it was handed — and every one of these, joined onto the bundle base, requests
  // something outside it.
  for (const bad of [
    '../../etc/passwd',
    '/etc/passwd',
    'C:/windows/system32',
    'data\\part-00000.arrows',
    '',
  ]) {
    assert.throws(
      () =>
        parseManifest(
          manifest({
            data: {
              rows: 0,
              format: {},
              partitions: [{ path: bad, bytes: 1, content_hash: 'sha256:x' }],
            },
          }),
        ),
      /manifest-schema-invalid/,
      `path ${JSON.stringify(bad)} was accepted`,
    );
  }
});

test('a bundle with no bounds parses, because a filter can select nothing', () => {
  const m = parseManifest(manifest({ bounds: null }));
  assert.equal(m.bounds, null);
});
