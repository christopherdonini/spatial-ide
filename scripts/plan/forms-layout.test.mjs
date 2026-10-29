// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors
//
// Tests for forms-layout.mjs -- governance piece F's layout check (the form's sections 2.5 and 4, T12 and T12b).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { commitFiles, git, removeAfter } from './movedFixture.mjs';

const script = path.join(path.dirname(fileURLToPath(import.meta.url)), 'forms-layout.mjs');

function layoutRepo(t, paths) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'forms-layout-'));
  removeAfter(t, dir);
  git(dir, ['init', '-q', '-b', 'main']);
  commitFiles(dir, Object.fromEntries(paths.map((p) => [p, 'x\n'])), 'forms');
  return dir;
}

const ALLOWED = [
  'governance/forms/a/OK-PREREGISTRATION.md',
  'state/drafts/d/D-PREREGISTRATION.draft.md',
  'docs/PREREGISTRATION-TEMPLATE.md',
  'docs/experiments/NATIVE-WGPU-RENDERER-BAKEOFF-PREREGISTRATION.md',
];

// RECORDED MUTATION at e91bcf30807a (phase 1's commit, on the branch wip/governance-f-scripts; this branch carries the test from it by patch and does not contain the commit), applied alone and reverted: every path under docs/ allowed -> fails by name: `forms-layout: a preregistration outside governance/forms/ and state/ fails by name`.
test('forms-layout: a preregistration outside governance/forms/ and state/ fails by name', (t) => {
  const dir = layoutRepo(t, [...ALLOWED, 'docs/x/NEW-PREREGISTRATION.md', 'engine/OLD-PREREGISTRATION.md']);
  const run = spawnSync(process.execPath, [script, '--root', dir], { encoding: 'utf8' });
  assert.equal(run.status, 1, run.stdout + run.stderr);
  assert.match(run.stderr, /docs\/x\/NEW-PREREGISTRATION\.md: a preregistration outside governance\/forms\/ and state\//);
  assert.match(run.stderr, /engine\/OLD-PREREGISTRATION\.md: a preregistration outside governance\/forms\/ and state\//);
  assert.equal((run.stderr.match(/^ {2}- /gm) ?? []).length, 2, run.stderr);
});

// RECORDED MUTATION at e91bcf30807a (phase 1's commit, on the branch wip/governance-f-scripts; this branch carries the test from it by patch and does not contain the commit), applied alone and reverted: the state/ allowance dropped -> fails by name: `forms-layout: state/ and the two exact docs/ paths are allowed`.
test('forms-layout: state/ and the two exact docs/ paths are allowed', (t) => {
  const dir = layoutRepo(t, ALLOWED);
  const run = spawnSync(process.execPath, [script, '--root', dir], { encoding: 'utf8' });
  assert.equal(run.status, 0, run.stdout + run.stderr);
  assert.match(run.stdout, /^forms-layout PASS -- 4 preregistration file\(s\)/);
});
