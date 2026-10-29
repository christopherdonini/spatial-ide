// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// Test support for governance piece F's move-map tests (verify-cites, verify-quotes, moved-map, verify): a
// temporary git repository in the OS temp folder with a file at a/X-PREREGISTRATION.md, a moves-only commit
// that renames it to governance/forms/a/, and governance/MOVED.tsv made by the product's own `add` -- the
// shape the form's section 3 describes. The tests remove the repository themselves.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { addCommit } from './moved-map.mjs';

export const X_OLD = 'a/X-PREREGISTRATION.md';
export const X_NEW = 'governance/forms/a/X-PREREGISTRATION.md';

export function git(dir, args, env = {}) {
  return execFileSync('git', ['-c', 'user.email=t@example.com', '-c', 'user.name=T', '-c', 'commit.gpgsign=false', '-c', 'core.autocrlf=false', ...args], {
    cwd: dir,
    encoding: 'utf8',
    env: { ...process.env, ...env },
  }).trimEnd();
}

export function dated(date) {
  return date ? { GIT_AUTHOR_DATE: date, GIT_COMMITTER_DATE: date } : {};
}

/** Writes `files`, commits exactly them, returns the new commit id. */
export function commitFiles(dir, files, message, date) {
  for (const [rel, text] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true });
    fs.writeFileSync(path.join(dir, rel), text);
  }
  git(dir, ['add', '--', ...Object.keys(files)]);
  git(dir, ['commit', '-q', '-m', message], dated(date));
  return git(dir, ['rev-parse', 'HEAD']);
}

/**
 * before: X holds `xText` (three lines), a/src/lib.rs keeps a/ a tracked folder, plus `files`; move: the
 * moves-only commit; map: MOVED.tsv added by `add`. HEAD is the map commit. The caller registers the
 * removal: t.after(() => fs.rmSync(dir, ...)).
 */
export function movedRepo(files = {}, xText = 'one\ntwo\nthree\n') {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'moved-fixture-'));
  git(dir, ['init', '-q', '-b', 'main']);
  const before = commitFiles(dir, { [X_OLD]: xText, 'a/src/lib.rs': 'fn a() {}\nfn b() {}\nfn c() {}\n', ...files }, 'before the move', '2026-01-01T00:00:00Z');
  fs.mkdirSync(path.join(dir, 'governance/forms/a'), { recursive: true });
  git(dir, ['mv', '--', X_OLD, X_NEW]);
  git(dir, ['commit', '-q', '-m', 'moves only'], dated('2026-02-01T00:00:00Z'));
  const move = git(dir, ['rev-parse', 'HEAD']);
  addCommit(dir, move);
  const map = commitFiles(dir, { 'governance/MOVED.tsv': fs.readFileSync(path.join(dir, 'governance/MOVED.tsv'), 'utf8') }, 'moved map', '2026-02-02T00:00:00Z');
  return { dir, before, move, map };
}

export function removeAfter(t, dir) {
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
}
