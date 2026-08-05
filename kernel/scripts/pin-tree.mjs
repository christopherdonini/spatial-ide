#!/usr/bin/env node
/**
 * Records a content hash of every source file a measurement depends on — **and, with
 * `--binaries`, of the binaries that were actually built from them.**
 *
 * Why this exists: a measurement is a claim about a *tree*, not about a wall-clock moment. This
 * repository is worked on by more than one agent at a time, and during the first pass of the
 * `docs/08` slice measurement the hot path (`engine/src/stream.rs`), the adapter and the data-plane
 * server were all edited while numbers were being taken. Numbers that cannot be attributed to a
 * specific tree are not measurements.
 *
 * ## Why the source pin alone turned out not to be enough
 *
 * On 2026-08-05 a run of `kernel/tests/indexed_budgets.rs` was invalidated after the fact: the
 * source pin verified clean before and after, and the harness binary nonetheless contained
 * `"identity min: "` — a string that exists only in *another checkout's uncommitted*
 * `engine/src/dataset.rs` and nowhere in the pinned tree. The two checkouts shared one
 * `CARGO_TARGET_DIR`, so a cached compilation unit built elsewhere was linked into a binary built
 * here.
 *
 * **A source pin does not pin a build, and a shared target directory defeats it.** Hence
 * `--binaries`: the pin now records the SHA-256 of each named artifact, so a run can state which
 * bytes produced its numbers and can prove they did not change underneath it. Two disciplines go
 * with it and neither is optional:
 *
 *   1. **Pin before the build, compare after it.** A pin taken after the build brackets nothing —
 *      a source edit during the build is invisible to it. That was the second half of the same
 *      failure.
 *   2. **Build the workspace crates from clean into a directory nothing else writes to**, or accept
 *      that the binary hash proves only "unchanged since I hashed it", not "built from these
 *      sources".
 *
 * Usage:
 *   node kernel/scripts/pin-tree.mjs > target/slice-evidence/tree-pin-before.json
 *   ... build ...
 *   node kernel/scripts/pin-tree.mjs --compare target/slice-evidence/tree-pin-before.json
 *   node kernel/scripts/pin-tree.mjs --binaries target/release/slice-host.exe,... > pin-binaries.json
 *
 * `--compare` exits non-zero and names every file that moved, so a run that raced an edit fails
 * loudly instead of being written up as if it had not. With `--binaries` it compares those too.
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

/**
 * The built artifacts this pin also covers, as a comma-separated list of repo-relative paths.
 *
 * Hashed **in full**, not sampled: the point is to be able to say which bytes produced a number.
 */
const binariesIdx = process.argv.indexOf('--binaries');
const binaries = {};
if (binariesIdx >= 0) {
  for (const rel of (process.argv[binariesIdx + 1] ?? '').split(',').filter(Boolean)) {
    const abs = join(repoRoot, rel.trim());
    binaries[rel.trim().replaceAll('\\', '/')] = existsSync(abs)
      ? createHash('sha256').update(readFileSync(abs)).digest('hex')
      : '(absent)';
  }
}

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
  binaries,
  binaries_note:
    'a source pin does not pin a build. These are the SHA-256s of the artifacts that produced the ' +
    'numbers, recorded because a shared CARGO_TARGET_DIR once linked another checkout\'s cached ' +
    'compilation unit into a binary built here while the source pin verified clean.',
};

const compareIdx = process.argv.indexOf('--compare');
if (compareIdx >= 0) {
  const other = JSON.parse(readFileSync(process.argv[compareIdx + 1], 'utf8'));
  // **A comparison must re-measure what the earlier pin measured.** Without this, `--compare`
  // without `--binaries` hashed nothing and then reported every recorded binary as changed to
  // "(not hashed this time)" — a false alarm that is worse than no check, because a reader who has
  // seen the checker cry wolf stops reading it. Re-hash exactly what the earlier pin named.
  for (const rel of Object.keys(other.binaries ?? {})) {
    if (binaries[rel] !== undefined) continue;
    const abs = join(repoRoot, rel);
    binaries[rel] = existsSync(abs)
      ? createHash('sha256').update(readFileSync(abs)).digest('hex')
      : '(absent)';
  }
  const moved = [];
  const keys = new Set([...Object.keys(other.files), ...Object.keys(files)]);
  for (const k of keys) {
    if (other.files[k] !== files[k]) {
      moved.push(`${k}: ${other.files[k] ?? '(absent)'} -> ${files[k] ?? '(absent)'}`);
    }
  }
  // Binaries are compared only when the earlier pin recorded some. A pin that recorded none says
  // nothing about them, and reporting "unchanged" for something never observed would be worse than
  // reporting nothing.
  const binKeys = new Set([...Object.keys(other.binaries ?? {}), ...Object.keys(binaries)]);
  for (const k of binKeys) {
    const before = (other.binaries ?? {})[k];
    if (before !== undefined && before !== binaries[k]) {
      moved.push(`BINARY ${k}: ${before} -> ${binaries[k] ?? '(not hashed this time)'}`);
    }
  }
  if (moved.length) {
    console.error(`TREE MOVED during the measurement — ${moved.length} item(s):`);
    for (const m of moved) console.error(`  ${m}`);
    console.error(
      '\nThe numbers taken across this window are not attributable to a single tree. Re-run.',
    );
    process.exit(1);
  }
  console.log(
    `tree unchanged: ${pin.file_count} files, combined ${pin.combined}` +
      (binKeys.size ? `, ${binKeys.size} binary/binaries unchanged` : ''),
  );
  process.exit(0);
}

console.log(JSON.stringify(pin, null, 2));
