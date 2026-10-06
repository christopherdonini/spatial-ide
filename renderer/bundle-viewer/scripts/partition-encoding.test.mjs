// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// V-2 of `engine/MULTIPOLYGON-MP1-PREREGISTRATION.md` section 4 (ADR-034 Consequences: "the viewer
// already refuses a foreign encoding"). The viewer's product code is unchanged by this piece; this
// test proves the refusal the Consequences rely on, against the real shape: the engine's own F-1
// batch, committed by `engine/tests/geoarrow_batch_fixtures.rs` (BF-1) from a real `Dataset::open`
// and stream. That batch is a `geoarrow.multipolygon` batch, so fed to the viewer as a partition it
// must be refused at the encoding check (`envelope-encoding-mismatch`), never walked one nesting
// level short and drawn.
//
// The batch's other envelope keys are read from the batch itself, so the frame, CRS and axis-order
// checks that precede the encoding check pass for what they are, and the refusal reached is the
// encoding one and no other.
//
// RECORDED MUTATION: delete the `geometry_encoding` check in `decodePartition`
// (`renderer/bundle-viewer/src/partition.ts`). The multipolygon batch then passes that check and is
// walked as polygon rings, so the `BundleFailure` this test expects is not thrown with that state,
// and this test fails by name.
//
// Observed over `ac538440` on the uncommitted tree of the shell commit: `the engine’s multipolygon batch, offered as a partition, is refused at the encoding check`
// FAILED by name with the mutation applied, then reverted.

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { tableFromIPC } from 'apache-arrow';

import { importModule } from './bundle-for-test.mjs';

const { decodePartition, BundleFailure } = await importModule('scripts/partition-entry.mjs');

const BF_DIR = join(dirname(fileURLToPath(import.meta.url)), '../../../engine/tests/data/geoarrow');

test('the engine’s multipolygon batch, offered as a partition, is refused at the encoding check', () => {
  const bytes = new Uint8Array(readFileSync(join(BF_DIR, 'lv95-multipolygon-batch.arrows')));
  const meta = tableFromIPC(bytes).schema.metadata;
  assert.equal(meta.get('geometry_encoding'), 'geoarrow.multipolygon', 'fixture self-check: the real batch');

  const manifest = { crsSource: meta.get('crs'), attributeColumns: [] };
  // The batch carries no attribute columns, so its own `attribute_columns` key, when present, must
  // already read `[]`; the encoding check comes first in any case.
  assert.throws(
    () =>
      decodePartition(
        { path: 'data/part-00000.arrows', bytes: bytes.length, contentHash: 'sha256:stub', rows: 3 },
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
      assert.ok(e.detail.includes('geoarrow.multipolygon'), `detail "${e.detail}"`);
      return true;
    },
  );
});
