// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors
//
// Tests for moved-map.mjs -- governance piece F's move-map tool (the form's sections 2.3 and 4, T10 and T11).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { addCommit, checkMoved } from './moved-map.mjs';
import { movedRepo, commitFiles, git, removeAfter, X_NEW } from './movedFixture.mjs';

const script = path.join(path.dirname(fileURLToPath(import.meta.url)), 'moved-map.mjs');

// RECORDED MUTATION at e91bcf30807a (phase 1's commit, on the branch wip/governance-f-scripts; this branch carries the test from it by patch and does not contain the commit), applied alone and reverted: the row count compared instead of the bytes -> fails by name: `moved-map: --check fails by name on a hand-edited row`.
test('moved-map: --check fails by name on a hand-edited row', (t) => {
  const { dir } = movedRepo();
  removeAfter(t, dir);
  assert.deepEqual(checkMoved(dir), { ok: true, problems: [] });
  const tsv = path.join(dir, 'governance/MOVED.tsv');
  const text = fs.readFileSync(tsv, 'utf8');
  fs.writeFileSync(tsv, text.replace(X_NEW, 'governance/forms/a/Z-PREREGISTRATION.md'));
  const run = spawnSync(process.execPath, [script, '--check', '--root', dir], { encoding: 'utf8' });
  assert.equal(run.status, 1, run.stdout + run.stderr);
  assert.match(run.stderr, /row "a\/X-PREREGISTRATION\.md\tgovernance\/forms\/a\/Z-PREREGISTRATION\.md\t[0-9a-f]{40}" is not what its commit made/);
  assert.match(run.stderr, /row "a\/X-PREREGISTRATION\.md\tgovernance\/forms\/a\/X-PREREGISTRATION\.md\t[0-9a-f]{40}" is missing/);
});

// RECORDED MUTATION at e91bcf30807a (phase 1's commit, on the branch wip/governance-f-scripts; this branch carries the test from it by patch and does not contain the commit), applied alone and reverted: rename detection widened from -M100% to -M and the status test widened from R100 to any R -> fails by name: `moved-map: add refuses a commit with any line other than R100`.
test('moved-map: add refuses a commit with any line other than R100', (t) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'moved-add-'));
  removeAfter(t, dir);
  git(dir, ['init', '-q', '-b', 'main']);
  const body = Array.from({ length: 12 }, (_, i) => `line ${i}`).join('\n') + '\n';
  commitFiles(dir, { 'a/X.md': body, 'a/Y.md': body.replace('line', 'row') }, 'base');
  const mv = (from, to) => {
    fs.mkdirSync(path.dirname(path.join(dir, to)), { recursive: true });
    git(dir, ['mv', from, to]);
  };
  const refuses = (what, pattern) => {
    const commit = git(dir, ['rev-parse', 'HEAD']);
    assert.throws(() => addCommit(dir, commit), pattern, what);
    assert.equal(fs.existsSync(path.join(dir, 'governance/MOVED.tsv')), false, `${what}: nothing is written`);
    git(dir, ['reset', '-q', '--hard', 'HEAD~1']);
  };
  // a rename that also changes a line
  mv('a/X.md', 'governance/X.md');
  fs.appendFileSync(path.join(dir, 'governance/X.md'), 'one more line\n');
  git(dir, ['add', '-A']);
  git(dir, ['commit', '-q', '-m', 'rename and edit']);
  refuses('a rename that changes a line', /is not R100/);
  // an exact rename that also adds a file
  mv('a/Y.md', 'governance/Y.md');
  commitFiles(dir, { 'governance/Z.md': 'new\n' }, 'rename and add');
  refuses('an exact rename that also adds a file', /is not R100/);
  // an edit with no rename
  commitFiles(dir, { 'a/X.md': body + 'more\n' }, 'edit only');
  refuses('an edit with no rename', /is not R100/);
  // an exact rename to a path outside the allow list
  mv('a/X.md', 'elsewhere/X.md');
  git(dir, ['commit', '-q', '-m', 'rename outside']);
  refuses('an exact rename outside governance/', /outside governance\//);
});
