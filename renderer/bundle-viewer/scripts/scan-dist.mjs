#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// The last step of `npm run build`: scan `dist/` with the kernel's own redaction scanner, and write
// the build record the shell hands to the publish.
//
// `scan-dist.rs` is `kernel/src/bundle/redaction.rs` compiled standalone with `rustc` (into
// `node_modules/.cache/`, never into `dist/`), run over `dist/` with no identities and no declared
// strings. Each finding is compared by file, class and byte offset with `redaction-reviewed.json`.
// A finding no row equals fails the build with exit 1 and is named by those three and nothing else,
// and no record is written: an old record is removed first, so none survives a failed scan. A row
// that matches nothing is printed as not found and does not fail the build.
//
// The record, `viewer-asset-hashes.json` beside `dist/` (never inside it, on `dist-metafile.json`'s
// rule), is `{"version":1,"assets":{"<dist-relative path>":"<sha256>"}}` over the bytes on disk. The
// publish skips a `viewer/` file only when its staged bytes hash to the entry for that same path.
//
//   node scripts/scan-dist.mjs

import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  mkdirSync, mkdtempSync, readdirSync, readFileSync, realpathSync, rmSync, writeFileSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');

/** A finding is `{file, class, offset}`; a reviewed row is the same three members. */
export function compare(found, rows) {
  const same = (f, r) => f.file === r.file && f.class === r.class && f.offset === r.offset;
  return {
    unreviewed: found.filter((f) => !rows.some((r) => same(f, r))),
    notFound: rows.filter((r) => !found.some((f) => same(f, r))),
  };
}

/** Every file under `dir`, as a sorted `/`-separated path relative to it. */
export function listFiles(dir, prefix = '') {
  const out = [];
  for (const e of readdirSync(join(dir, prefix), { withFileTypes: true })) {
    const rel = prefix ? `${prefix}/${e.name}` : e.name;
    if (e.isDirectory()) out.push(...listFiles(dir, rel));
    else out.push(rel);
  }
  return out.sort();
}

/** The scanner's findings over `dir`, from the compiled `scan-dist.rs`. Throws if it cannot run. */
function scan(dir) {
  const cache = join(root, 'node_modules', '.cache');
  mkdirSync(cache, { recursive: true });
  const out = mkdtempSync(join(cache, 'scan-dist-'));
  try {
    const exe = join(out, process.platform === 'win32' ? 'scan-dist.exe' : 'scan-dist');
    const build = spawnSync('rustc', ['--edition', '2021', '-A', 'warnings', '-o', exe, join(here, 'scan-dist.rs')], { encoding: 'utf8' });
    if (build.error || build.status !== 0) {
      throw new Error(`rustc could not compile scan-dist.rs (${build.error?.message ?? build.stderr})`);
    }
    const run = spawnSync(exe, [dir], { encoding: 'utf8' });
    if (run.error || run.status !== 0) throw new Error(`the scan did not run (${run.error?.message ?? run.stderr})`);
    return run.stdout.split('\n').filter(Boolean).map((line) => {
      const [file, cls, offset] = line.split('\t');
      return { file, class: cls, offset: Number(offset) };
    });
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
}

/** Run the scan and, only if it passes, write the record. Returns the exit code. */
function main() {
  const dist = join(root, 'dist');
  const record = join(root, 'viewer-asset-hashes.json');
  rmSync(record, { force: true });
  let found;
  try {
    found = scan(dist);
  } catch (e) {
    console.error(`scan-dist: ${e.message}`);
    return 1;
  }
  const rows = JSON.parse(readFileSync(join(root, 'redaction-reviewed.json'), 'utf8')).rows;
  const { unreviewed, notFound } = compare(found, rows);
  for (const f of unreviewed) {
    console.error(`scan-dist: finding outside the reviewed record: ${f.file} ${f.class} at byte ${f.offset}`);
  }
  if (unreviewed.length > 0) return 1;
  const assets = {};
  for (const rel of listFiles(dist)) {
    assets[rel] = createHash('sha256').update(readFileSync(join(dist, rel))).digest('hex');
  }
  writeFileSync(record, `${JSON.stringify({ version: 1, assets })}\n`, 'utf8');
  console.log(`scan-dist: ${Object.keys(assets).length} files scanned, ${found.length} findings, all reviewed; record written`);
  for (const r of rows) {
    const state = notFound.includes(r) ? 'not found' : 'matched';
    console.log(`scan-dist: reviewed row ${r.file} ${r.class} ${r.offset}: ${state}`);
  }
  return 0;
}

if (process.argv[1] && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))) {
  process.exit(main());
}
