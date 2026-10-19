// Tests for rulingSet.mjs (the form's H1 and H2). Fixtures are temporary git repositories; their texts hold é (2 bytes) and → (3 bytes).
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

import { rulingSetPaths, trackedPaths, readRulingSet, LIVE_RULINGS, ARCHIVE_RULINGS_RE } from './rulingSet.mjs';

const dirs = [];
const tmp = (prefix) => { const d = fs.mkdtempSync(path.join(os.tmpdir(), prefix)); dirs.push(d); return d; };
const sh = (dir, args) => execFileSync('git', args, { cwd: dir, encoding: 'utf8' });
const put = (dir, rel, text) => { fs.mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true }); fs.writeFileSync(path.join(dir, rel), text, 'utf8'); };
after(() => { for (const d of dirs) fs.rmSync(d, { recursive: true, force: true }); });

// RECORDED MUTATION (MH1) at 2914103800f4, applied alone and reverted: archives listed by reading the folder on disk -> fails by name: `rulingSet: the set is the live file, then every tracked state/cut-archive/DECISIONS-PENDING-*.md in ascending path order; an untracked one is left out`.
// RECORDED MUTATION (MH2) at 2914103800f4, applied alone and reverted: the failure caught and the live file returned alone -> fails by name: `rulingSet: a git failure throws and never narrows the set to the live file`.
test('rulingSet: the set is the live file, then every tracked state/cut-archive/DECISIONS-PENDING-*.md in ascending path order; an untracked one is left out', () => {
  const dir = tmp('ruling-set-');
  sh(dir, ['init', '-q', '-b', 'main']);
  const archive = (n) => `state/cut-archive/DECISIONS-PENDING-${n}.md`;
  const files = { [LIVE_RULINGS]: 'live é →\n', [archive('b')]: 'b é\n', [archive('a')]: 'a →\n', [archive('Z')]: 'B\n',
    'state/cut-archive/sub/DECISIONS-PENDING-deep.md': 'a subfolder\n', 'state/cut-archive/CUT-STATE-x.md': 'a ledger\n', 'DECISIONS-PENDING-root.md': 'the wrong folder\n' };
  for (const [rel, text] of Object.entries(files)) put(dir, rel, text);
  sh(dir, ['add', '--', ...Object.keys(files)]);
  sh(dir, ['-c', 'user.name=T', '-c', 'user.email=t@e.com', '-c', 'commit.gpgsign=false', 'commit', '-q', '-m', 'init']);
  put(dir, archive('untracked'), 'on disk, not tracked\n');
  const want = [LIVE_RULINGS, archive('Z'), archive('a'), archive('b')];
  assert.deepEqual(rulingSetPaths(trackedPaths(dir)), want);
  assert.deepEqual(readRulingSet(dir).map((f) => f.path), want);
  assert.deepEqual(readRulingSet(dir).map((f) => f.text), ['live é →\n', 'B\n', 'a →\n', 'b é\n']);
  assert.deepEqual(rulingSetPaths([archive('z'), archive('y'), archive('z')]), [LIVE_RULINGS, archive('y'), archive('z')], 'pure, ordered, no duplicate');
  assert.equal(ARCHIVE_RULINGS_RE.test('state/cut-archive/DECISIONS-PENDING-.md'), true);
  fs.rmSync(path.join(dir, archive('a'))); // tracked but missing from disk
  assert.throws(() => readRulingSet(dir), /ENOENT/);
});

test('rulingSet: a git failure throws and never narrows the set to the live file', () => {
  const dir = tmp('ruling-set-norepo-');
  put(dir, LIVE_RULINGS, 'live\n');
  const saved = process.env.GIT_CEILING_DIRECTORIES;
  process.env.GIT_CEILING_DIRECTORIES = os.tmpdir(); // git does not climb out of the temporary folder
  try {
    assert.throws(() => trackedPaths(dir));
    assert.throws(() => readRulingSet(dir));
  } finally {
    if (saved === undefined) delete process.env.GIT_CEILING_DIRECTORIES; else process.env.GIT_CEILING_DIRECTORIES = saved;
  }
});
