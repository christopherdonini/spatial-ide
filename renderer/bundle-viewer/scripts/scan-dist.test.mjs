// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// The viewer build's scan of `dist/` and the record it writes (the redaction form's Amendment 3,
// V1 to V3). The driver is the real one: `kernel/src/bundle/redaction.rs` compiled by `rustc`, so
// these tests need a Rust toolchain and a built `dist/` (`npm run verify` builds first).

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { compare, listFiles } from './scan-dist.mjs';

/** Run the real script over a copy of `dist/`, with its record in the same scratch directory. */
function runOnCopy(plant) {
  const scratch = mkdtempSync(join(tmpdir(), 'scan-dist-test-'));
  const dist = join(scratch, 'dist');
  const record = join(scratch, 'viewer-asset-hashes.json');
  cpSync('dist', dist, { recursive: true });
  plant?.(dist);
  const run = spawnSync(process.execPath, ['scripts/scan-dist.mjs', dist, record], { encoding: 'utf8' });
  return { run, dist, record, done: () => rmSync(scratch, { recursive: true, force: true }) };
}

test('a finding outside the reviewed record fails the viewer build and writes no hash record', () => {
  const clean = runOnCopy();
  try {
    assert.equal(clean.run.status, 0, `an unmodified dist/ passes: ${clean.run.stderr}`);
    assert.ok(existsSync(clean.record), 'the record is written on a pass');
  } finally {
    clean.done();
  }
  const planted = runOnCopy((dist) => writeFileSync(join(dist, 'planted.txt'), 'see C:\\planted\\leak-path-value'));
  try {
    assert.equal(planted.run.status, 1);
    const out = planted.run.stdout + planted.run.stderr;
    assert.match(out, /planted\.txt local-filesystem-path at byte 4/);
    assert.ok(!out.includes('leak-path-value'), 'the planted text is not in the output');
    assert.ok(!existsSync(planted.record), 'no record is written for a failed scan');
  } finally {
    planted.done();
  }
});

test('a reviewed row passes only at its own file, class and offset', () => {
  const row = { file: 'NOTICE.txt', class: 'credential', offset: 19092 };
  const refused = (found) => compare([found], [row]).unreviewed.length === 1;
  assert.deepEqual(compare([{ ...row }], [row]), { unreviewed: [], notFound: [] });
  assert.ok(refused({ ...row, offset: row.offset + 1 }), 'offset + 1');
  assert.ok(refused({ ...row, class: 'local-filesystem-path' }), 'another class');
  assert.ok(refused({ ...row, file: 'app.js' }), 'another file');
  assert.deepEqual(compare([], [row]).notFound, [row], 'a row that matches nothing is only not found');
});

test("the built app.js carries no comment from the viewer's sources", () => {
  const source = readFileSync('src/manifest.ts', 'utf8');
  const app = readFileSync('dist/app.js', 'utf8');
  // The comment that carried an example drive path into every published bundle.
  for (const text of ['Any URI scheme, not just a drive letter', 'C:/evil']) {
    assert.ok(source.includes(text), `present in the source: ${text}`);
    assert.ok(!app.includes(text), `absent from dist/app.js: ${text}`);
  }
});

test('the hash record names each dist file with the sha256 of its bytes', () => {
  const { run, dist, record, done } = runOnCopy();
  try {
    assert.equal(run.status, 0, run.stderr);
    const parsed = JSON.parse(readFileSync(record, 'utf8'));
    assert.deepEqual(Object.keys(parsed).sort(), ['assets', 'version']);
    assert.equal(parsed.version, 1);
    assert.deepEqual(Object.keys(parsed.assets), listFiles(dist));
    for (const [rel, hash] of Object.entries(parsed.assets)) {
      assert.equal(hash, createHash('sha256').update(readFileSync(join(dist, rel))).digest('hex'), rel);
    }
  } finally {
    done();
  }
});
