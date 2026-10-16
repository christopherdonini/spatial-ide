// scripts/plan/measure-reads.test.mjs - T1 to T7 of SEARCH-IGNORE-HISTORICAL-PREREGISTRATION.md (section 4).
// Each fixture is a temporary git repository built inside the test; non-ASCII text (é, →) is in all of them.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { READING_ORDER } from '../hooks/session-resume.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const SCRIPT = path.join(here, 'measure-reads.mjs');
const HOOK = path.join(here, '..', 'hooks', 'session-resume.mjs');
const REAL_CUT_STATE = path.join(here, '..', '..', 'state', 'CUT-STATE.md');
const FLUSHED = '2026-10-10T12:00:00Z';

function makeRepo(t, files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'measure-reads-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true, maxRetries: 3 }));
  const g = (...a) =>
    execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@example.invalid', '-c', 'commit.gpgsign=false', '-c', 'core.autocrlf=false', ...a], { cwd: dir, stdio: 'pipe' });
  g('init', '-q');
  for (const [name, content] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(dir, name)), { recursive: true });
    fs.writeFileSync(path.join(dir, name), content);
  }
  g('add', '-A');
  g('commit', '-q', '--no-verify', '-m', 'fixture');
  return dir;
}

const run = (cwd, args, input = '') =>
  spawnSync(process.execPath, [SCRIPT, ...args], { cwd, input, maxBuffer: 64 * 1024 * 1024 });

const cutState = (ledger, { flushed = FLUSHED, ledgerHeading = '## Ledger' } = {}) =>
  ['# CUT-STATE é', '', '## SESSION-CONTINUITY', ...(flushed ? [`flushed_at: ${flushed}`] : []), 'tip: abc1234', 'position: é → ok', '', 'Previous ledger: none', '', ...(ledgerHeading ? [ledgerHeading, ''] : []), ...ledger, ''].join('\n');

const PENDING = ['# DECISIONS', '', '## Pending', '', '### RULED a é', 'body →', '', '#### deeper', 'kept', '', '## Resolved', '', 'old'].join('\n');

const figures = (stderr) => Object.fromEntries([...stderr.toString().matchAll(/(\w+)=(\S+)/g)].map((m) => [m[1], m[2]]));

// RECORDED MUTATION: part 1 taken as the raw lines from the SESSION-CONTINUITY heading to the line
// before the ledger heading, untrimmed (M1) -> this test fails, first failing assertion: the figure
// block= against the byte length of the block the hook printed (the raw lines carry the blank line
// before the ledger heading). Observed at M0 fbbffe89 with the S1 files staged on this branch.
test('measure-reads: the routine block is the bytes session-resume.mjs prints for the real ledger', (t) => {
  const real = fs.readFileSync(REAL_CUT_STATE, 'utf8');
  const dir = makeRepo(t, { 'state/CUT-STATE.md': real, 'DECISIONS-PENDING.md': PENDING });
  const env = { ...process.env, CLAUDE_PROJECT_DIR: dir, GIT_CEILING_DIRECTORIES: path.dirname(dir) };
  delete env.CLAUDE_CODE_REMOTE;
  const hook = spawnSync(process.execPath, [HOOK], { input: '{}', env });
  assert.equal(hook.status, 0);
  const printed = hook.stdout;
  const head = Buffer.from(`${READING_ORDER}\n\n`);
  assert.ok(printed.subarray(0, head.length).equals(head));
  const tail = printed.lastIndexOf('\n\nResume facts:');
  assert.ok(tail > head.length);
  const hookBlock = printed.subarray(head.length, tail);

  const r = run(dir, ['routine', 'HEAD']);
  assert.equal(r.status, 0, r.stderr.toString());
  const n = Number(figures(r.stderr).block);
  assert.equal(n, hookBlock.length);
  assert.ok(r.stdout.subarray(0, n).equals(hookBlock));
  assert.equal(r.stdout.subarray(n, n + 2).toString(), '\n\n');
});

// RECORDED MUTATION: the window bound made strict (M2, `>` for `>=`) -> this test fails, first
// failing assertion: the boundary entry is missing from stdout. Observed at M0 fbbffe89 with the
// S1 files staged on this branch.
test('measure-reads: the ledger part keeps the entries dated within 168 hours before flushed_at, the boundary included', (t) => {
  const edge = '- 2026-10-03T12:00Z - boundary é';
  const before = '- 2026-10-03T11:59Z - one minute before →';
  const after = '- 2026-10-10T13:00Z - after the flush';
  const dir = makeRepo(t, { 'state/CUT-STATE.md': cutState([before, edge, after]), 'DECISIONS-PENDING.md': PENDING });
  const r = run(dir, ['routine', 'HEAD']);
  assert.equal(r.status, 0, r.stderr.toString());
  const out = r.stdout.toString();
  assert.ok(out.includes(edge));
  assert.ok(out.includes(after));
  assert.ok(!out.includes(before));
  const f = figures(r.stderr);
  assert.equal(f.entries, '2');
  assert.equal(f.outside_window, '1');
  assert.equal(f.window_from, '2026-10-03T12:00:00.000Z');
});

// RECORDED MUTATION: any line starting with a dash starts an entry (M3) -> this test fails, first
// failing assertion: the undated bullet under the kept entry is missing from stdout. Observed at
// M0 fbbffe89 with the S1 files staged on this branch.
test('measure-reads: an undated top-level bullet and indented lines belong to the dated entry above them', (t) => {
  const ledger = [
    '- 2026-09-01T00:00Z - old entry',
    '- undated bullet under the old entry',
    '  indented under the old entry',
    '- 2026-10-09T00:00Z - kept entry é',
    '- undated bullet under the kept entry →',
    '  indented under the kept entry',
  ];
  const dir = makeRepo(t, { 'state/CUT-STATE.md': cutState(ledger), 'DECISIONS-PENDING.md': PENDING });
  const r = run(dir, ['routine', 'HEAD']);
  assert.equal(r.status, 0, r.stderr.toString());
  const out = r.stdout.toString();
  for (const l of ledger.slice(3)) assert.ok(out.includes(l), l);
  for (const l of ledger.slice(0, 3)) assert.ok(!out.includes(l), l);
  assert.equal(figures(r.stderr).outside_window, '1');
});

// RECORDED MUTATION: the pending section also ends at any heading of level 1 to 6 (M4) -> this test
// fails, first failing assertion: stdout does not end with the whole pending section (it stops at the deeper heading). Observed at M0
// fbbffe89 with the S1 files staged on this branch.
test('measure-reads: the pending part runs from ## Pending to the next level-2 heading and keeps deeper headings', (t) => {
  const dir = makeRepo(t, { 'state/CUT-STATE.md': cutState(['- 2026-10-09T00:00Z - e']), 'DECISIONS-PENDING.md': PENDING });
  const r = run(dir, ['routine', 'HEAD']);
  assert.equal(r.status, 0, r.stderr.toString());
  const out = r.stdout.toString();
  assert.ok(out.endsWith('\n\n## Pending\n\n### RULED a é\nbody →\n\n#### deeper\nkept\n'));
  assert.ok(!out.includes('## Resolved'));
  assert.ok(!out.includes('# DECISIONS'));
});

// RECORDED MUTATION: a missing part becomes an empty string with exit 0 (M5, `must` returns the
// value or an empty string) -> this test fails, first failing assertion: the exit status of the
// run with no ledger heading is 0, not 2. Observed at M0 fbbffe89 with the S1 files staged on this branch.
test('measure-reads: a missing part refuses with exit 2 and an empty stdout', (t) => {
  const ledger = ['- 2026-10-09T00:00Z - e'];
  const good = { 'DECISIONS-PENDING.md': PENDING };
  const cases = [
    ['no ledger heading', { ...good, 'state/CUT-STATE.md': cutState(ledger, { ledgerHeading: '' }) }, 'HEAD'],
    ['no pending heading', { 'DECISIONS-PENDING.md': '# DECISIONS\n\n## Resolved\n', 'state/CUT-STATE.md': cutState(ledger) }, 'HEAD'],
    ['no flushed_at', { ...good, 'state/CUT-STATE.md': cutState(ledger, { flushed: '' }) }, 'HEAD'],
    ['unparseable flushed_at', { ...good, 'state/CUT-STATE.md': cutState(ledger, { flushed: 'not a time' }) }, 'HEAD'],
    ['no block', { ...good, 'state/CUT-STATE.md': '# CUT-STATE\n\n## Ledger\n\n- 2026-10-09T00:00Z - e\n' }, 'HEAD'],
    ['unknown rev', { ...good, 'state/CUT-STATE.md': cutState(ledger) }, 'no-such-rev'],
  ];
  for (const [name, files, rev] of cases) {
    const r = run(makeRepo(t, files), ['routine', rev]);
    assert.equal(r.status, 2, `${name}: ${r.stderr}`);
    assert.equal(r.stdout.length, 0, name);
    assert.match(r.stderr.toString(), /^measure-reads: refused: /, name);
  }
});

// RECORDED MUTATION: the total counted as string length (M6, `bytes` returns s.length) -> this test
// fails, first failing assertion: the total figure against the byte length of stdout. Observed at
// M0 fbbffe89 with the S1 files staged on this branch.
test('measure-reads: the routine total is UTF-8 bytes, not characters', (t) => {
  const dir = makeRepo(t, { 'state/CUT-STATE.md': cutState(['- 2026-10-09T00:00Z - é → é']), 'DECISIONS-PENDING.md': PENDING });
  const r = run(dir, ['routine', 'HEAD']);
  assert.equal(r.status, 0, r.stderr.toString());
  const f = figures(r.stderr);
  assert.ok(r.stdout.toString().length < r.stdout.length, 'the fixture holds multi-byte text');
  assert.equal(Number(f.total), r.stdout.length);
  assert.equal(Number(f.ledger), Buffer.byteLength('- 2026-10-09T00:00Z - é → é'));
});

// RECORDED MUTATION: a path not in the tree is skipped (M7) -> this test fails, first failing
// assertion: the run with an unlisted path exits 0, not 2. Observed at M0 fbbffe89 with the S1
// files staged on this branch.
test('measure-reads: the corpus sums committed sizes of the listed files and refuses a path not in the tree', (t) => {
  const files = { 'a.txt': 'é→\n', 'sub/dir/b.txt': 'plain\n', 'sub/c.txt': 'ccc', 'unlisted.txt': 'zzzz' };
  const dir = makeRepo(t, files);
  const list = 'a.txt\r\nsub\\dir\\b.txt\r\nsub\\c.txt\r\n';
  const r = run(dir, ['corpus', 'HEAD'], list);
  assert.equal(r.status, 0, r.stderr.toString());
  const sum = Buffer.byteLength(files['a.txt']) + Buffer.byteLength(files['sub/dir/b.txt']) + Buffer.byteLength(files['sub/c.txt']);
  assert.match(r.stdout.toString(), new RegExp(`^measure-reads: corpus HEAD files=3 bytes=${sum}\\n$`));
  assert.equal(r.stderr.toString(), 'tracked_not_listed=1\n');

  const bad = run(dir, ['corpus', 'HEAD'], 'a.txt\nmissing\\file.txt\n');
  assert.equal(bad.status, 2);
  assert.equal(bad.stdout.length, 0);
  assert.ok(bad.stderr.toString().includes('missing/file.txt'));
  assert.equal(run(dir, ['corpus', 'HEAD'], '\n').status, 2);
});
