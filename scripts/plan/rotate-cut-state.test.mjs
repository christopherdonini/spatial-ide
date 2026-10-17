// Tests for rotate-cut-state.mjs (the form's R1 to R9). Fixtures are temporary git repositories, each with a
// bare repository as origin; their texts hold é (2 bytes) and → (3 bytes). No date is typed: the weekly rule
// is exercised from epoch arithmetic (epoch day 4 is a Monday) and fixture commit dates are epoch-relative.
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { isDue, archiveNameFor, noticeLine, buildRotatedLedger, ROTATE_BYTES } from './rotate-cut-state.mjs';
import { blockSizes, updateBlockFields, BLOCK_CAP_BYTES, BLOCK_HEADING, SESSION_CONTINUITY_FIELDS } from '../hooks/flush.mjs';
import { decidePrecompact } from '../hooks/precompact-flush.mjs';
import { decide } from '../hooks/stop-queue.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(here, '..', '..');
const ROTATE = path.join(here, 'rotate-cut-state.mjs');
const FLUSH = path.join(REPO_ROOT, 'scripts', 'hooks', 'flush.mjs');
const RESUME = path.join(REPO_ROOT, 'scripts', 'hooks', 'session-resume.mjs');
const DAY = 86400000;
const MON = 4 * DAY; // epoch day 4: a Monday
const OLD = '@86400 +0000'; // a committer date far enough back that the weekly rule is due
const FIELDS = ['branches: main é', 'position: a position →', 'half-made judgments: none', 'intended sequencing (next session): next', 'unreported findings: none', 'in-flight gate states: none'];
const PREV = 'Previous ledger: `state/cut-archive/CUT-STATE-older.md` (an old rotation). Before it: `state/cut-archive/CUT-STATE-oldest.md`.';
const today = () => new Date().toISOString().slice(0, 10);
const dirs = [];

function sh(dir, args, env = {}) {
  return execFileSync('git', args, { cwd: dir, encoding: 'utf8', env: { ...process.env, ...env } }).replace(/\r?\n$/, '');
}
function ledgerText({ flushedAt = 'T0', tip = 'tip0', fields = FIELDS, pad = 0 } = {}) {
  const base = ['## SESSION-CONTINUITY', `flushed_at: ${flushedAt}`, `tip: ${tip}`, ...fields, '', PREV, '', '## Ledger', '', '- an entry with é and →.', ''].join('\n');
  return pad ? `${base}- ${'x'.repeat(pad - Buffer.byteLength(base, 'utf8') - 3)}\n` : base;
}
/** A repository on main with a bare origin; `files` is committed (on `date`), then pushed. */
function mkRepo(files, date = null) {
  const origin = fs.mkdtempSync(path.join(os.tmpdir(), 'rotate-origin-'));
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rotate-repo-'));
  dirs.push(origin, dir);
  sh(origin, ['init', '-q', '--bare', '-b', 'main']);
  sh(dir, ['init', '-q', '-b', 'main']);
  for (const [k, v] of [['user.name', 'T'], ['user.email', 't@e.com'], ['core.autocrlf', 'false'], ['commit.gpgsign', 'false']]) sh(dir, ['config', k, v]);
  commit(dir, files, 'init', date);
  sh(dir, ['remote', 'add', 'origin', origin]);
  sh(dir, ['push', '-q', '-u', 'origin', 'main']);
  return dir;
}
function commit(dir, files, msg, date = null) { // stages only the files given (and whatever is already staged)
  for (const [rel, text] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true });
    fs.writeFileSync(path.join(dir, rel), text, 'utf8');
  }
  if (Object.keys(files).length) sh(dir, ['add', '--', ...Object.keys(files)]);
  sh(dir, ['commit', '-q', '-m', msg], date ? { GIT_COMMITTER_DATE: date, GIT_AUTHOR_DATE: date } : {});
}
const rot = (dir) => spawnSync(process.execPath, [ROTATE], { cwd: dir, encoding: 'utf8' });
const staged = (dir) => sh(dir, ['diff', '--cached', '--name-status', '--no-renames']).split('\n').filter(Boolean).sort();
const bytes = (dir, rev) => execFileSync('git', ['show', rev], { cwd: dir, maxBuffer: 1 << 28 });
const snapshot = (dir) => JSON.stringify([sh(dir, ['rev-parse', 'HEAD']), sh(dir, ['status', '--porcelain']), fs.readFileSync(path.join(dir, 'state', 'CUT-STATE.md'), 'utf8'), fs.existsSync(path.join(dir, 'state', 'cut-archive'))]);
after(() => { for (const d of dirs) fs.rmSync(d, { recursive: true, force: true }); });

// Timing: R1 and R2 read today's UTC date twice, and R4 and R5 commit an archive and then read this week's Monday; a run across UTC midnight, or across Monday 00:00Z, can fail them.
// The tests below are R1 to R9 of the form, in order. Incidentally, MR1, MR5 and MR8 also fail the tests that need the mutated behaviour.
// RECORDED MUTATION (MR1) at bad88d11d131, applied alone and reverted: the archive rewritten from its text without the final newline -> fails by name: `rotate-cut-state: a due rotation stages the archive byte-identical to the ledger at HEAD and the new ledger's exact text`.
// RECORDED MUTATION (MR2) at bad88d11d131, applied alone and reverted: the existing-name check removed -> fails by name: `rotate-cut-state: a same-day collision takes -2, then -3, and no archive is overwritten`.
// RECORDED MUTATION (MR3) at bad88d11d131, applied alone and reverted: the week taken to start on Sunday -> fails by name: `rotate-cut-state: due from Monday 00:00Z after the last archive, not on the Sunday before`.
// RECORDED MUTATION (MR4) at bad88d11d131, applied alone and reverted: `>=` in place of `>` -> fails by name: `rotate-cut-state: a ledger over 153,600 bytes is due mid-week, and one of exactly 153,600 is not`.
// RECORDED MUTATION (MR5) at bad88d11d131, applied alone and reverted: isDue returns true -> fails by name: `rotate-cut-state: not due exits 0 and writes nothing`.
// RECORDED MUTATION (MR6) at bad88d11d131, applied alone and reverted: the upstream check removed -> fails by name: `rotate-cut-state: refuses with exit 2 and writes nothing off main, on a modified tracked file, or with HEAD not equal to its upstream`.
// RECORDED MUTATION (MR7) at bad88d11d131, applied alone and reverted: the cap check moved after the git mv -> fails by name: `rotate-cut-state: a new block over the cap refuses before anything moves`.
// RECORDED MUTATION (MR8) at bad88d11d131, applied alone and reverted: the rotation rewrites flushed_at -> fails by name: `rotate-cut-state: after the rotation commit and a ledger-only flush commit, session-resume prints the block, the precompact hook allows and the stop hook's continuity step passes`.
// RECORDED MUTATION (MR9) at bad88d11d131, applied alone and reverted: a SessionStart entry running the script, in a copy of the settings the test read (the tracked settings file was not edited) -> fails by name: `rotate-cut-state: no hook in .claude/settings.json runs the rotation script`.
// RECORDED MUTATION (MR6, correction round 1) at 143bf5615439, applied alone and reverted: the upstream check removed -> fails by name: `rotate-cut-state: refuses with exit 2 and writes nothing off main, on a modified tracked file, or with HEAD not equal to its upstream`.
// RECORDED MUTATION (MR8, correction round 1) at 143bf5615439, applied alone and reverted: the rotation rewrites flushed_at -> fails by name: `rotate-cut-state: a due rotation stages the archive byte-identical to the ledger at HEAD and the new ledger's exact text` and `rotate-cut-state: after the rotation commit and a ledger-only flush commit, session-resume prints the block, the precompact hook allows and the stop hook's continuity step passes`.
// RECORDED MUTATION (MR8, correction round 2) at 1f4e8d5d4194, applied alone and reverted: the rotation rewrites flushed_at -> fails by name: `rotate-cut-state: a due rotation stages the archive byte-identical to the ledger at HEAD and the new ledger's exact text` and `rotate-cut-state: after the rotation commit and a ledger-only flush commit, session-resume prints the block, the precompact hook allows and the stop hook's continuity step passes`.
// RECORDED MUTATION (MR8b, correction round 2) at 1f4e8d5d4194, applied alone and reverted: the title-line guard restored in place of the heading-found assertion -> fails on the rotated shape, by name: `rotate-cut-state: after the rotation commit and a ledger-only flush commit, session-resume prints the block, the precompact hook allows and the stop hook's continuity step passes`.

test("rotate-cut-state: a due rotation stages the archive byte-identical to the ledger at HEAD and the new ledger's exact text", () => {
  const dir = mkRepo({ 'state/CUT-STATE.md': ledgerText() });
  const P = sh(dir, ['rev-parse', 'HEAD']);
  const r = rot(dir);
  assert.equal(r.status, 0, r.stderr);
  const list = staged(dir);
  const name = /^A\tstate\/cut-archive\/(CUT-STATE-.+\.md)$/.exec(list.find((l) => l.startsWith('A\t')))[1];
  assert.deepEqual(list, [`A\tstate/cut-archive/${name}`, 'M\tstate/CUT-STATE.md'].sort());
  assert.equal(name, `CUT-STATE-${today()}.md`);
  assert.equal(sh(dir, ['rev-parse', `:state/cut-archive/${name}`]), sh(dir, ['rev-parse', `${P}:state/CUT-STATE.md`]));
  assert.ok(fs.readFileSync(path.join(dir, 'state', 'cut-archive', name)).equals(bytes(dir, `${P}:state/CUT-STATE.md`)), 'the archive file is the ledger at HEAD, byte for byte');
  const head8 = ledgerText().split('\n').slice(0, 9); // heading, flushed_at, tip and the six prose fields
  const expected = [...head8, '',
    `Previous ledger: \`state/cut-archive/${name}\` (archived byte-identical by \`git mv\` from \`state/CUT-STATE.md\` at ${P}). Before it: \`state/cut-archive/CUT-STATE-older.md\`.`,
    '', `Line references written before the rotation point into state/cut-archive/${name} at ${P}.`, '', '## Ledger', ''].join('\n');
  const live = fs.readFileSync(path.join(dir, 'state', 'CUT-STATE.md'), 'utf8');
  assert.equal(live, expected);
  assert.equal(sh(dir, ['rev-parse', ':state/CUT-STATE.md']), sh(dir, ['hash-object', 'state/CUT-STATE.md']));
  assert.ok(blockSizes(live).blockBytes <= BLOCK_CAP_BYTES);
  assert.equal(noticeLine(name, P), expected.split('\n').at(-4));
});

test('rotate-cut-state: a same-day collision takes -2, then -3, and no archive is overwritten', () => {
  const base = `CUT-STATE-${today()}.md`;
  const dir = mkRepo({ 'state/CUT-STATE.md': ledgerText(), [`state/cut-archive/${base}`]: 'an earlier archive é\n' }, OLD);
  const before = sh(dir, ['rev-parse', `HEAD:state/cut-archive/${base}`]);
  const P1 = sh(dir, ['rev-parse', 'HEAD:state/CUT-STATE.md']);
  assert.equal(rot(dir).status, 0);
  assert.deepEqual(staged(dir), ['A\tstate/cut-archive/' + base.replace('.md', '-2.md'), 'M\tstate/CUT-STATE.md'].sort());
  assert.equal(sh(dir, ['rev-parse', `:state/cut-archive/${base.replace('.md', '-2.md')}`]), P1);
  commit(dir, {}, 'rotate', OLD);
  sh(dir, ['push', '-q', 'origin', 'main']);
  fs.writeFileSync(path.join(dir, 'state', 'cut-archive', base.replace('.md', '-3.md')), 'an untracked file on disk\n'); // taken on disk, not in the tree
  const second = rot(dir);
  assert.equal(second.status, 0, second.stderr);
  assert.deepEqual(staged(dir), ['A\tstate/cut-archive/' + base.replace('.md', '-4.md'), 'M\tstate/CUT-STATE.md'].sort());
  assert.equal(sh(dir, ['rev-parse', `HEAD:state/cut-archive/${base}`]), before);
  assert.equal(fs.readFileSync(path.join(dir, 'state', 'cut-archive', base.replace('.md', '-3.md')), 'utf8'), 'an untracked file on disk\n');
  assert.equal(archiveNameFor('D', (n) => n !== 'CUT-STATE-D-99.md'), 'CUT-STATE-D-99.md');
  assert.equal(archiveNameFor('D', () => true), null);
});

test('rotate-cut-state: due from Monday 00:00Z after the last archive, not on the Sunday before', () => {
  const iso = (ms) => new Date(ms).toISOString().replace('Z', '+00:00'); // the shape of git's %cI
  const archived = iso(MON + 2 * DAY + 3600000); // the Wednesday of week one
  assert.equal(isDue({ lastArchiveAt: archived, now: MON + 6 * DAY + 23 * 3600000, ledgerBytes: 10 }).due, false, 'not on the Sunday before');
  assert.equal(isDue({ lastArchiveAt: archived, now: MON + 7 * DAY - 1, ledgerBytes: 10 }).due, false, 'not a millisecond before');
  const monday = isDue({ lastArchiveAt: archived, now: MON + 7 * DAY, ledgerBytes: 10 });
  assert.equal(monday.due, true);
  assert.equal(monday.monday, new Date(MON + 7 * DAY).toISOString());
  assert.equal(isDue({ lastArchiveAt: `${new Date(MON + 7 * DAY - 5400000 + 2 * 3600000).toISOString().slice(0, 19)}+02:00`, now: MON + 7 * DAY + 3600000, ledgerBytes: 10 }).due, true, 'an offset time is compared as an instant');
  assert.equal(isDue({ lastArchiveAt: null, now: MON, ledgerBytes: 10 }).due, true, 'no archive ever');
});

test('rotate-cut-state: a ledger over 153,600 bytes is due mid-week, and one of exactly 153,600 is not', () => {
  assert.equal(ROTATE_BYTES, 153600);
  const recent = { [`state/cut-archive/CUT-STATE-${today()}-recent.md`]: 'an archive added now\n' };
  const exact = mkRepo({ ...recent, 'state/CUT-STATE.md': ledgerText({ pad: 153600 }) });
  assert.equal(sh(exact, ['cat-file', '-s', 'HEAD:state/CUT-STATE.md']), '153600');
  const a = rot(exact);
  assert.equal(a.status, 0, a.stderr);
  assert.match(a.stdout, /not due/);
  assert.equal(staged(exact).length, 0);
  const over = mkRepo({ ...recent, 'state/CUT-STATE.md': ledgerText({ pad: 153601 }) });
  assert.equal(sh(over, ['cat-file', '-s', 'HEAD:state/CUT-STATE.md']), '153601');
  const b = rot(over);
  assert.equal(b.status, 0, b.stderr);
  assert.match(b.stdout, /due — the ledger is 153601 bytes/);
  assert.equal(staged(over).length, 2);
});

test('rotate-cut-state: not due exits 0 and writes nothing', () => {
  const dir = mkRepo({ [`state/cut-archive/CUT-STATE-${today()}-recent.md`]: 'a recent archive\n', 'state/CUT-STATE.md': ledgerText() });
  const before = snapshot(dir);
  const r = rot(dir);
  assert.equal(r.status, 0, r.stderr);
  assert.equal(r.stdout.trim().split('\n').length, 1);
  assert.match(r.stdout, /^rotate-cut-state: not due — /);
  assert.equal(snapshot(dir), before);
});

test('rotate-cut-state: refuses with exit 2 and writes nothing off main, on a modified tracked file, or with HEAD not equal to its upstream', () => {
  const refused = (dir, why) => {
    const before = snapshot(dir);
    const r = rot(dir);
    assert.equal(r.status, 2, `${why}: ${r.stdout}${r.stderr}`);
    assert.match(r.stderr, /refusing — /);
    assert.equal(snapshot(dir), before, `${why}: nothing written`);
  };
  const off = mkRepo({ 'state/CUT-STATE.md': ledgerText() });
  sh(off, ['checkout', '-q', '-b', 'other']);
  refused(off, 'off main');
  const dirty = mkRepo({ 'state/CUT-STATE.md': ledgerText(), 'README.md': 'one\n' });
  fs.writeFileSync(path.join(dirty, 'README.md'), 'two\n');
  refused(dirty, 'a modified tracked file');
  const ahead = mkRepo({ 'state/CUT-STATE.md': ledgerText() });
  commit(ahead, { 'README.md': 'unpushed\n' }, 'local only');
  refused(ahead, 'HEAD ahead of its upstream');
});

test('rotate-cut-state: a new block over the cap refuses before anything moves', () => {
  let n = 1;
  const make = () => ledgerText({ fields: FIELDS.map((f) => (f.startsWith('position') ? `position: ${'x'.repeat(n)}` : f)) });
  while (blockSizes(make()).blockBytes < BLOCK_CAP_BYTES) n++;
  assert.equal(blockSizes(make()).blockBytes, BLOCK_CAP_BYTES, 'the old block sits exactly at the cap');
  const dir = mkRepo({ 'state/CUT-STATE.md': make() });
  const before = snapshot(dir);
  const r = rot(dir);
  assert.equal(r.status, 2, r.stdout);
  assert.match(r.stderr, /would be \d+ bytes \(UTF-8\), over the cap of 6144/);
  assert.equal(snapshot(dir), before);
  assert.equal(staged(dir).length, 0);
});

const r8 = async (rotatedShape) => {
  const SID = 'obs-b-sid';
  const ago = (s) => new Date(Date.now() - s * 1000);
  const dir = mkRepo({ 'README.md': 'a\n' }, `@${Math.floor(ago(300).getTime() / 1000)} +0000`);
  const A0 = sh(dir, ['rev-parse', 'HEAD']);
  const flushedAt = ago(120).toISOString().replace(/\.\d{3}Z$/, 'Z');
  const live = fs.readFileSync(path.join(REPO_ROOT, 'state', 'CUT-STATE.md'), 'utf8');
  const real = rotatedShape ? buildRotatedLedger({ oldText: live, name: 'cut-state-r8.md', commit: A0 }) : live; // the real ledger as main holds it (before the first rotation: a title line and a two-path Previous ledger line; after it, the rotated shape)
  const seeded = updateBlockFields(real, { ...Object.fromEntries(SESSION_CONTINUITY_FIELDS.map((f) => [f, 'SENTINEL'])), flushed_at: flushedAt, tip: A0 });
  commit(dir, { 'state/CUT-STATE.md': seeded }, 'ledger flush', `@${Math.floor(ago(180).getTime() / 1000)} +0000`);
  sh(dir, ['push', '-q', 'origin', 'main']);
  fs.writeFileSync(path.join(dir, 'CUSTODIAN-LEASE'), `lease: ${SID} since the test began\n`);
  const resume = () => spawnSync(process.execPath, [RESUME], { input: '{}', encoding: 'utf8', env: { ...process.env, CLAUDE_PROJECT_DIR: dir } });
  const saved = { off: process.env.CUSTODIAN_STOP_HOOK, plan: process.env.CUSTODIAN_PLAN_PATH };
  delete process.env.CUSTODIAN_STOP_HOOK;
  delete process.env.CUSTODIAN_PLAN_PATH;
  const notified = [];
  const notify = async (...a) => { notified.push(a); };
  try {
    const r = rot(dir);
    assert.equal(r.status, 0, r.stderr);
    commit(dir, {}, 'rotate the ledger');
    const seededLines = seeded.split('\n');
    const h = seededLines.indexOf(BLOCK_HEADING);
    const rotatedText = fs.readFileSync(path.join(dir, 'state', 'CUT-STATE.md'), 'utf8');
    assert.ok(h >= 0, 'the block heading is found in the seeded ledger');
    assert.ok(rotatedText.startsWith(`${BLOCK_HEADING}\n`), 'the new file starts with the heading and has no line before it');
    assert.equal(seededLines.slice(h + 1, h + 9).length, 8);
    assert.deepEqual(rotatedText.split('\n').slice(1, 9), seededLines.slice(h + 1, h + 9), 'its fields are the eight seeded lines');
    const oldPrev = seededLines.find((l) => l.startsWith('Previous ledger:'));
    assert.ok((oldPrev.match(/`state\/[^`]+`/g) ?? []).length >= 1, 'the seeded Previous ledger line names at least one state/ path');
    assert.ok(rotatedText.includes(` Before it: \`${/`([^`]+)`/.exec(oldPrev)[1]}\`.`), 'its Before it path is the first backticked path of the seeded line');
    assert.ok(/\n\nLine references written before the rotation point into [^\n]+\n\n## Ledger\n$/.test(rotatedText), 'it ends with the notice, a blank line, ## Ledger and one newline');
    sh(dir, ['push', '-q', 'origin', 'main']);
    const R = sh(dir, ['rev-parse', 'HEAD']);
    // At R: the precompact hook blocks (R changes two paths, so its tip cannot be a ledger-only commit's parent) and the stop hook's predicate is stale at R.
    const pre = decidePrecompact({ trigger: 'manual', session_id: 'obs-b-r' }, { projectRoot: dir });
    assert.equal(pre.decision, 'block');
    assert.match(pre.stderr, /does not match HEAD .* not the parent of a ledger-only flush commit/);
    const stopR = await decide({ session_id: SID }, { projectRoot: dir, notify });
    assert.equal(stopR.decision, 'block');
    assert.ok(stopR.reason.includes(R) && stopR.reason.startsWith('stale SESSION-CONTINUITY'), stopR.reason);
    const resumeR = resume();
    assert.equal(resumeR.status, 0, resumeR.stderr);
    assert.ok(resumeR.stdout.includes('## SESSION-CONTINUITY') && resumeR.stdout.includes('Previous ledger: `state/cut-archive/'));
    // At F, the ledger-only flush commit: fresh, and the continuity step passes (reaching the no-PLAN allow).
    const f = spawnSync(process.execPath, [FLUSH, '--file', path.join(dir, 'state', 'CUT-STATE.md'), '--field', `tip=${R}`, '--field', 'position=after the rotation'], { encoding: 'utf8' });
    assert.equal(f.status, 0, f.stderr);
    sh(dir, ['add', '--', 'state/CUT-STATE.md']);
    commit(dir, {}, 'flush after the rotation');
    sh(dir, ['push', '-q', 'origin', 'main']);
    assert.equal(sh(dir, ['diff', '--name-only', 'HEAD^', 'HEAD']), 'state/CUT-STATE.md', 'F is ledger-only');
    const preF = decidePrecompact({ trigger: 'manual', session_id: 'obs-b-f' }, { projectRoot: dir });
    assert.equal(preF.decision, 'allow');
    assert.match(preF.stderr, /is fresh/);
    const stopF = await decide({ session_id: SID }, { projectRoot: dir, notify });
    assert.equal(stopF.decision, 'allow');
    assert.match(stopF.stderr, /no PLAN\.yaml/);
    assert.deepEqual(notified, []);
    const resumeF = resume();
    assert.equal(resumeF.status, 0, resumeF.stderr);
    assert.ok(resumeF.stdout.includes('position: after the rotation'));
  } finally {
    for (const [k, v] of [['CUSTODIAN_STOP_HOOK', saved.off], ['CUSTODIAN_PLAN_PATH', saved.plan]]) if (v === undefined) delete process.env[k]; else process.env[k] = v;
  }
};

test("rotate-cut-state: after the rotation commit and a ledger-only flush commit, session-resume prints the block, the precompact hook allows and the stop hook's continuity step passes", async () => {
  await r8(false);
  await r8(true);
});

test('rotate-cut-state: no hook in .claude/settings.json runs the rotation script', () => {
  const settings = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, '.claude', 'settings.json'), 'utf8'));
  const commands = [];
  const walk = (v) => {
    if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) { if (k === 'command' && typeof x === 'string') commands.push(x); else walk(x); }
  };
  walk(settings.hooks);
  assert.ok(commands.length > 0, 'the hook commands were read');
  assert.deepEqual(commands.filter((c) => c.includes('rotate-cut-state')), []);
});
