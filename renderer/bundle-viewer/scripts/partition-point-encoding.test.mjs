// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// V-T of `engine/GEOMETRY-POINTS-PREREGISTRATION.md` section 4 (ADR-034 Consequences: "The viewer
// already refuses a foreign encoding"; the form's Viewer section: no product change). The viewer's
// product code is unchanged by the points cut; this test proves the refusal for points, against the
// real shape: the engine's own `lv95-point-batch` (BF-P), committed by
// `engine/tests/geoarrow_batch_fixtures.rs` from a real `Dataset::open` and stream. That batch is a
// `geoarrow.point` batch, so fed to the viewer as a partition it must be refused at the encoding
// check (`envelope-encoding-mismatch`), never walked as polygon rings and drawn.
//
// The batch's other envelope keys are read from the batch itself, so the frame, CRS and axis-order
// checks that precede the encoding check pass for what they are, and the refusal reached is the
// encoding one and no other. Same shape as `partition-encoding.test.mjs` (MP-1's V-2).
//
// RECORDED MUTATION: delete the `geometry_encoding` check in `decodePartition`
// (`renderer/bundle-viewer/src/partition.ts`). The point batch then passes that check, so the
// `BundleFailure` this test expects is not thrown at the encoding check, and this test fails by name.
//
// Observed over `edbc0f3c` on the uncommitted tree of the shell commit: `the engine’s point batch, offered as a partition, is refused at the encoding check`
// FAILED by name with the mutation applied (the batch is then no longer refused at the encoding check and fails later as `partition-decode-failed`, so the `e.state` assertion fails, expected `envelope-encoding-mismatch`), then reverted.

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { tableFromIPC } from 'apache-arrow';

import { importModule } from './bundle-for-test.mjs';

const { decodePartition, BundleFailure } = await importModule('scripts/partition-entry.mjs');

const BF_DIR = join(dirname(fileURLToPath(import.meta.url)), '../../../engine/tests/data/geoarrow');

test('the engine’s point batch, offered as a partition, is refused at the encoding check', () => {
  const bytes = new Uint8Array(readFileSync(join(BF_DIR, 'lv95-point-batch.arrows')));
  const meta = tableFromIPC(bytes).schema.metadata;
  assert.equal(meta.get('geometry_encoding'), 'geoarrow.point', 'fixture self-check: the real batch');

  const manifest = { crsSource: meta.get('crs'), attributeColumns: [] };
  assert.throws(
    () =>
      decodePartition(
        { path: 'data/part-00000.arrows', bytes: bytes.length, contentHash: 'sha256:stub', rows: 6 },
        0,
        bytes,
        manifest,
        () => 0,
        null,
      ),
    (e) => {
      assert.ok(e instanceof BundleFailure, `expected a BundleFailure, got ${e}`);
      assert.equal(e.state, 'envelope-encoding-mismatch');
      assert.equal(e.asset, 'data/part-00000.arrows');
      assert.ok(e.detail.includes('geoarrow.point'), `detail "${e.detail}"`);
      return true;
    },
  );
});
