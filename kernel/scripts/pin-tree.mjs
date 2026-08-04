#!/usr/bin/env node
/**
 * Records a content hash of every source file a measurement depends on.
 *
 * Why this exists: a measurement is a claim about a *tree*, not about a wall-clock moment. This
 * repository is worked on by more than one agent at a time, and during the first pass of the
 * `docs/08` slice measurement the hot path (`engine/src/stream.rs`), the adapter and the data-plane
 * server were all edited while numbers were being taken. Numbers that cannot be attributed to a
 * specific tree are not measurements.
 *
 * Usage:
 *   node kernel/scripts/pin-tree.mjs > target/slice-evidence/tree-pin-before.json
 *   ... measure ...
 *   node kernel/scripts/pin-tree.mjs > target/slice-evidence/tree-pin-after.json
 *   node kernel/scripts/pin-tree.mjs --compare target/slice-evidence/tree-pin-before.json
 *
 * `--compare` exits non-zero and names every file that moved, so a run that raced an edit fails
 * loudly instead of being written up as if it had not.
 */

import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

const repoRoot = resolve(
  dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')),
  '..',
  '..',
);

const ROOTS = [
  'engine/src',
  'engine/tests',
  'engine/examples',
  'engine/Cargo.toml',
  'kernel/src',
  'kernel/tests',
  'kernel/scripts',
  'kernel/Cargo.toml',
  'protocol/data-plane/src',
  'protocol/data-plane/tests',
  'protocol/data-plane/Cargo.toml',
  'frontends/canvas-probe/src',
  'frontends/canvas-probe/scripts',
  'frontends/canvas-probe/build.mjs',
  'frontends/canvas-probe/index.html',
  'Cargo.toml',
  'Cargo.lock',
];

function walk(p, out) {
  const abs = join(repoRoot, p);
  if (!existsSync(abs)) return;
  const st = statSync(abs);
  if (st.isDirectory()) {
    for (const e of readdirSync(abs)) walk(join(p, e), out);
  } else {
    const rel = relative(repoRoot, abs).replaceAll('\\', '/');
    out[rel] = createHash('sha256').update(readFileSync(abs)).digest('hex').slice(0, 16);
  }
}

const files = {};
for (const r of ROOTS) walk(r, files);

const pin = {
  kind: 'source tree pin',
  taken_at: new Date().toISOString(),
  file_count: Object.keys(files).length,
  combined:
    createHash('sha256')
      .update(
        Object.keys(files)
          .sort()
          .map((k) => `${k}:${files[k]}`)
          .join('\n'),
      )
      .digest('hex')
      .slice(0, 32),
  files,
};

const compareIdx = process.argv.indexOf('--compare');
if (compareIdx >= 0) {
  const other = JSON.parse(readFileSync(process.argv[compareIdx + 1], 'utf8'));
  const moved = [];
  const keys = new Set([...Object.keys(other.files), ...Object.keys(files)]);
  for (const k of keys) {
    if (other.files[k] !== files[k]) {
      moved.push(`${k}: ${other.files[k] ?? '(absent)'} -> ${files[k] ?? '(absent)'}`);
    }
  }
  if (moved.length) {
    console.error(`TREE MOVED during the measurement — ${moved.length} file(s):`);
    for (const m of moved) console.error(`  ${m}`);
    console.error(
      '\nThe numbers taken across this window are not attributable to a single tree. Re-run.',
    );
    process.exit(1);
  }
  console.log(`tree unchanged: ${pin.file_count} files, combined ${pin.combined}`);
  process.exit(0);
}

console.log(JSON.stringify(pin, null, 2));
