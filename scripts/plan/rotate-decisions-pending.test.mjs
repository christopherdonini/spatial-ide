// Tests for rotate-decisions-pending.mjs (the form's R1 to R12). Fixtures are temporary git repositories, each with a bare
// repository as origin; their texts hold é (2 bytes) and → (3 bytes) and follow the ledger's grammar (the four block kinds,
// numbered entries with and without a resolution marker, `## Resolved`). No date is typed: the month rule is exercised from
// epoch arithmetic and the archive's name from the machine clock. A run across UTC midnight, or across a month's first, can
// fail the tests that read today's date or the current month (R1, R4, R5, R6).
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { parseUnits, classify, isDue, buildLiveText, obligationRows, ROTATE_BYTES } from './rotate-decisions-pending.mjs';
import { archiveNameFor, noticeLine } from './rotate-cut-state.mjs';
import { verdictCiteExists } from './verify.mjs';
import { runVerifyTestClaims } from './verify-test-claims.mjs';
import { runVerifyQuotes } from './verify-quotes.mjs';
import { runVerifyCites } from './verify-cites.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(here, '..', '..');
const ROTATE = path.join(here, 'rotate-decisions-pending.mjs');
const DP = 'governance/DECISIONS-PENDING.md';
const DAY = 86400000;
const sha = (s) => crypto.createHash('sha256').update(Buffer.from(s, 'utf8')).digest('hex');
const today = () => new Date().toISOString().slice(0, 10);
const dirs = [];

function sh(dir, args, env = {}) {
  return execFileSync('git', args, { cwd: dir, encoding: 'utf8', env: { ...process.env, ...env } }).replace(/\r?\n$/, '');
}
const E9 = ['9. **An open entry é →** the text.', '**Recommendation:** a bold line inside an entry is not a head.', '**Class fix** another.'];
const E5 = ['5. **An open entry with an earlier archive line**', 'more text →'];
const E4 = ['4. **An unmarked entry the human may strike**', 'text é'];
const PENDING = (extra) => [
  '# Decisions pending the human', '', '*A preamble é.*', '', '## Pending', '',
  '**RULED 2026-01-02 — question round 2 (fixture):**', '', '- *Item 1 — entry 8, a fixture ruling:* **"ruled"** n-ready-b is owed.', '',
  '**FELT VERDICTS 2026-01-01 — a fixture sitting (CLOSED):**', 'row é', '',
  '**DIRECTIVE 2026-01-01 — a fixture directive**', 'text', '',
  '**CLOSED 2026-01-01 — a fixture closed block**', '',
  ...E9, '',
  '8. **[RULED 2026-01-03 — question round 2; recorded as filed:]** a marked entry.', '',
  '7. **[RESOLVED 2026-01-03]** marked.', '', '6. **[APPLIED 2026-01-03]** marked.', '',
  ...E5, '', 'Archived copy: line 4 of `state/cut-archive/DECISIONS-PENDING-old.md`.', '',
  ...E4, '',
  ...extra,
  '## Resolved', '', '- a resolved row →', '',
].join('\n');
const ledger = () => PENDING([]);
/** A repository on main with a bare origin; `files` is committed (on `date`), then pushed. */
function mkRepo(files, date = null) {
  const origin = fs.mkdtempSync(path.join(os.tmpdir(), 'rotdp-origin-'));
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rotdp-repo-'));
  dirs.push(origin, dir);
  sh(origin, ['init', '-q', '--bare', '-b', 'main']);
  sh(dir, ['init', '-q', '-b', 'main']);
  for (const [k, v] of [['user.name', 'T'], ['user.email', 't@e.com'], ['core.autocrlf', 'false'], ['commit.gpgsign', 'false']]) sh(dir, ['config', k, v]);
  commit(dir, files, 'init', date);
  sh(dir, ['remote', 'add', 'origin', origin]);
  sh(dir, ['push', '-q', '-u', 'origin', 'main']);
  return dir;
}
function commit(dir, files, msg, date = null) {
  for (const [rel, text] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true });
    fs.writeFileSync(path.join(dir, rel), text, 'utf8');
  }
  if (Object.keys(files).length) sh(dir, ['add', '--', ...Object.keys(files)]);
  sh(dir, ['commit', '-q', '-m', msg], date ? { GIT_COMMITTER_DATE: date, GIT_AUTHOR_DATE: date } : {});
}
const rot = (dir, ...args) => spawnSync(process.execPath, [ROTATE, ...args], { cwd: dir, encoding: 'utf8' });
const staged = (dir) => sh(dir, ['diff', '--cached', '--name-status', '--no-renames']).split('\n').filter(Boolean).sort();
const snapshot = (dir) => JSON.stringify([sh(dir, ['rev-parse', 'HEAD']), sh(dir, ['status', '--porcelain']), fs.readFileSync(path.join(dir, DP), 'utf8'), fs.existsSync(path.join(dir, 'state', 'cut-archive'))]);
/** A due rotation of the fixture ledger; the archive's name, P, the new file's text and the archive's text. */
function rotated(extra = []) {
  const dir = mkRepo({ [DP]: PENDING(extra) });
  const P = sh(dir, ['rev-parse', 'HEAD']);
  const r = rot(dir);
  assert.equal(r.status, 0, r.stderr);
  const name = `DECISIONS-PENDING-${today()}.md`;
  return { dir, P, name, live: fs.readFileSync(path.join(dir, DP), 'utf8'), archive: fs.readFileSync(path.join(dir, 'state', 'cut-archive', name), 'utf8') };
}
const keptBlock = (E, archiveText, name) => ['', ...E, '', `Archived copy: line ${archiveText.split('\n').indexOf(E[0]) + 1} of \`state/cut-archive/${name}\`.`];
after(() => { for (const d of dirs) fs.rmSync(d, { recursive: true, force: true }); });

// Each mutation below was applied alone to scripts/plan/rotate-decisions-pending.mjs at e8d92a1aa67d, the file run, and the mutation reverted
// with the porcelain clean. The test named is the one it fails by name; a mutation that stops a rotation also fails every test that needs one.
// RECORDED MUTATION (MR1) at e8d92a1aa67d: the archive rewritten from its text with the final newline trimmed -> fails by name: `rotate-decisions-pending: a due rotation stages the archive byte-identical to HEAD's DECISIONS-PENDING.md and the new file's exact text`.
// RECORDED MUTATION (MR2) at e8d92a1aa67d: unmarked entries archived -> fails by name: `rotate-decisions-pending: a numbered entry without a resolution marker stays, and one with RULED, RESOLVED or APPLIED at its head is archived`.
// RECORDED MUTATION (MR3) at e8d92a1aa67d: any line starting with two asterisks taken as a head -> fails by name: `rotate-decisions-pending: RULED, DIRECTIVE, FELT VERDICTS and CLOSED blocks and the Resolved section are archived, and a bold line inside an entry is not a head`.
// RECORDED MUTATION (MR4) at e8d92a1aa67d: the archive line counted from 0 -> fails by name: `rotate-decisions-pending: each kept entry is followed by the archive line it came from, and an earlier archive line is replaced`.
// RECORDED MUTATION (MR5) at e8d92a1aa67d: an absent entry number ignored instead of refused -> fails by name, and only this one: `rotate-decisions-pending: --archive-entries archives only unmarked numbered entries present at HEAD and refuses any other number`.
// RECORDED MUTATION (MR6) at e8d92a1aa67d: the month comparison made <= -> fails by name, and only this one: `rotate-decisions-pending: due when the last archive is before the first of the month at 00:00Z, and not due when it is at that instant`.
// RECORDED MUTATION (MR7) at e8d92a1aa67d: the size comparison made >= -> fails by name, and only this one: `rotate-decisions-pending: a file over 153,600 bytes is due mid-month, and one of exactly 153,600 is not`.
// RECORDED MUTATION (MR8) at e8d92a1aa67d: the size guard removed -> fails by name, and only this one: `rotate-decisions-pending: when the open entries alone make the new file over 153,600 bytes it exits 3, writes nothing and says to tell the human`.
// RECORDED MUTATION (MR9) at e8d92a1aa67d: the blob check removed -> fails by name, and only this one: `rotate-decisions-pending: refuses with exit 2 and writes nothing on a modified tracked file, HEAD not equal to its upstream, or a DECISIONS-PENDING.md blob that differs from origin/main's`.
// RECORDED MUTATION (MR10) at e8d92a1aa67d: --dry-run goes on to stage the move -> fails by name, and only this one: `rotate-decisions-pending: --dry-run writes nothing and lists the kept units, the archived units and one obligation row per archived unit`.
// RECORDED MUTATION (MR11) at e8d92a1aa67d: the archive written under state/archive/ -> fails by name: `rotate-decisions-pending: after a rotation commit the readers find the moved rulings in the archive: a felt-verdict cite, a withdrawn-test ruling and a pinned hash reference`.
// RECORDED MUTATION (MR11b, MT4 re-made) at 904ea7c1a09e, applied alone and reverted (the porcelain clean after), this file run: the archives left out of the hash-scan list in `scripts/plan/verify-quotes.mjs` (only the live file kept) -> fails by name, and only this one of this file's tests: `rotate-decisions-pending: after a rotation commit the readers find the moved rulings in the archive: a felt-verdict cite, a withdrawn-test ruling and a pinned hash reference`. MT4's own record, in `scripts/plan/verify-quotes.test.mjs`, names T4; that file was not run here.
// RECORDED MUTATION (MR12) at e8d92a1aa67d: a SessionStart entry running the script, added to a scratch copy of the settings that the test was pointed at for one run (no .claude/settings.json was edited) -> fails by name, and only this one: `rotate-decisions-pending: no hook in .claude/settings.json runs the rotation script`.

test("rotate-decisions-pending: a due rotation stages the archive byte-identical to HEAD's DECISIONS-PENDING.md and the new file's exact text", () => {
  const { dir, P, name, live, archive } = rotated();
  assert.deepEqual(staged(dir), [`A\tstate/cut-archive/${name}`, `M\t${DP}`].sort());
  assert.equal(sh(dir, ['rev-parse', `:state/cut-archive/${name}`]), sh(dir, ['rev-parse', `${P}:${DP}`]));
  assert.ok(fs.readFileSync(path.join(dir, 'state', 'cut-archive', name)).equals(execFileSync('git', ['show', `${P}:${DP}`], { cwd: dir, maxBuffer: 1 << 28 })), 'the archive is the ledger at P, byte for byte');
  assert.equal(archive, ledger());
  const expected = ['# Decisions pending the human', '', noticeLine(name, P), '', '## Pending', ...keptBlock(E9, archive, name), ...keptBlock(E5, archive, name), ...keptBlock(E4, archive, name), ''].join('\n');
  assert.equal(live, expected);
  assert.equal(sh(dir, ['rev-parse', `:${DP}`]), sh(dir, ['hash-object', DP]));
  assert.equal(Buffer.byteLength(live, 'utf8') > 0 && live.endsWith('\n') && !live.endsWith('\n\n'), true, 'LF, one final newline');
});

test('rotate-decisions-pending: a numbered entry without a resolution marker stays, and one with RULED, RESOLVED or APPLIED at its head is archived', () => {
  const { live } = rotated();
  assert.deepEqual(parseUnits(live).map((u) => u.number), [9, 5, 4]);
  for (const gone of ['8. **[RULED', '7. **[RESOLVED', '6. **[APPLIED']) assert.equal(live.includes(gone), false, gone);
  const units = parseUnits(ledger());
  assert.deepEqual(units.filter((u) => u.kind === 'entry').map((u) => [u.number, classify(u).archive]), [[9, false], [8, true], [7, true], [6, true], [5, false], [4, false]]);
  assert.equal(classify(units.find((u) => u.number === 4), new Set([4])).archive, true, 'a named entry is archived');
});

test('rotate-decisions-pending: RULED, DIRECTIVE, FELT VERDICTS and CLOSED blocks and the Resolved section are archived, and a bold line inside an entry is not a head', () => {
  const { live } = rotated();
  for (const gone of ['**RULED', '**FELT VERDICTS', '**DIRECTIVE', '**CLOSED 2026', '## Resolved', 'a resolved row', 'A preamble']) assert.equal(live.includes(gone), false, gone);
  assert.deepEqual(parseUnits(ledger()).filter((u) => u.kind === 'block').map((u) => u.label), ['RULED', 'FELT VERDICTS', 'DIRECTIVE', 'CLOSED']);
  const units = parseUnits(live);
  assert.equal(units.length, 3, 'the bold lines inside entry 9 are not heads');
  assert.equal(units[0].text, E9.join('\n'), 'entry 9 is whole');
});

test('rotate-decisions-pending: each kept entry is followed by the archive line it came from, and an earlier archive line is replaced', () => {
  const { live, name, archive } = rotated();
  const lines = live.split('\n');
  assert.equal(lines.filter((l) => l.startsWith('Archived copy: ')).length, 3);
  assert.equal(live.includes('DECISIONS-PENDING-old.md'), false, 'the earlier archive line is gone');
  for (const E of [E9, E5, E4]) {
    const head = lines.indexOf(E[0]);
    assert.equal(lines[head + E.length + 1], `Archived copy: line ${archive.split('\n').indexOf(E[0]) + 1} of \`state/cut-archive/${name}\`.`);
    assert.ok(!/:\d/.test(lines[head + E.length + 1]), 'given in words, with no path:line token');
  }
});

test('rotate-decisions-pending: --archive-entries archives only unmarked numbered entries present at HEAD and refuses any other number', () => {
  const dir = mkRepo({ [DP]: ledger() });
  for (const bad of ['99', '8', 'x', '4,99']) {
    const before = snapshot(dir);
    const r = rot(dir, '--archive-entries', bad);
    assert.equal(r.status, 2, `${bad}: ${r.stdout}${r.stderr}`);
    assert.match(r.stderr, /refusing — /);
    assert.equal(snapshot(dir), before, `${bad}: nothing written`);
  }
  const r = rot(dir, '--archive-entries', '4');
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(parseUnits(fs.readFileSync(path.join(dir, DP), 'utf8')).map((u) => u.number), [9, 5]);
});

test('rotate-decisions-pending: due when the last archive is before the first of the month at 00:00Z, and not due when it is at that instant', () => {
  const now = 40 * DAY + 5 * 3600000; // epoch day 40, mid-month
  const first = Date.UTC(new Date(now).getUTCFullYear(), new Date(now).getUTCMonth(), 1);
  const iso = (ms) => new Date(ms).toISOString().replace('Z', '+00:00'); // the shape of git's %cI
  assert.equal(isDue({ lastArchiveIso: iso(first - 1), nowIso: now, sizeBytes: 10 }).due, true, 'a millisecond before');
  assert.equal(isDue({ lastArchiveIso: iso(first), nowIso: now, sizeBytes: 10 }).due, false, 'at that instant');
  assert.equal(isDue({ lastArchiveIso: iso(first + DAY), nowIso: now, sizeBytes: 10 }).due, false);
  assert.equal(isDue({ lastArchiveIso: iso(first), nowIso: first, sizeBytes: 10 }).due, false, 'now is the first itself');
  assert.equal(isDue({ lastArchiveIso: iso(first - 1), nowIso: first, sizeBytes: 10 }).due, true);
  assert.equal(isDue({ lastArchiveIso: `${new Date(first - 3600000).toISOString().slice(0, 19)}-01:00`, nowIso: now, sizeBytes: 10 }).due, false, 'an offset time is compared as an instant');
  assert.equal(isDue({ lastArchiveIso: null, nowIso: now, sizeBytes: 10 }).due, true, 'no archive ever');
  assert.equal(isDue({ lastArchiveIso: iso(first), nowIso: now, sizeBytes: 10 }).month, new Date(first).toISOString());
  const recent = mkRepo({ [DP]: ledger(), [`state/cut-archive/DECISIONS-PENDING-${today()}-recent.md`]: 'an archive added now\n' });
  const before = snapshot(recent);
  const r = rot(recent);
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /^rotate-decisions-pending: not due — /);
  assert.equal(r.stdout.trim().split('\n').length, 1);
  assert.equal(snapshot(recent), before);
  assert.equal(staged(recent).length, 0);
});

test('rotate-decisions-pending: a file over 153,600 bytes is due mid-month, and one of exactly 153,600 is not', () => {
  assert.equal(ROTATE_BYTES, 153600);
  const now = 40 * DAY;
  const recent = new Date(now - DAY / 2).toISOString();
  assert.equal(isDue({ lastArchiveIso: recent, nowIso: now, sizeBytes: 153600 }).due, false);
  const over = isDue({ lastArchiveIso: recent, nowIso: now, sizeBytes: 153601 });
  assert.equal(over.due, true);
  assert.match(over.reason, /the file is 153601 bytes, over 153600/);
  const pad = (n) => `- ${'x'.repeat(n - 3)}\n`;
  const cli = (size) => {
    const base = '# Decisions pending the human\n\n## Pending\n';
    const dir = mkRepo({ [`state/cut-archive/DECISIONS-PENDING-${today()}-recent.md`]: 'an archive added now\n', [DP]: base + pad(size - Buffer.byteLength(base)) });
    assert.equal(sh(dir, ['cat-file', '-s', `HEAD:${DP}`]), String(size));
    return rot(dir);
  };
  assert.match(cli(153600).stdout, /not due/);
  assert.match(cli(153601).stdout, /due — the file is 153601 bytes/);
});

test('rotate-decisions-pending: when the open entries alone make the new file over 153,600 bytes it exits 3, writes nothing and says to tell the human', () => {
  const dir = mkRepo({ [DP]: PENDING([`3. **An open entry that is too big →** ${'x'.repeat(ROTATE_BYTES)}`, '']) });
  const before = snapshot(dir);
  const r = rot(dir);
  assert.equal(r.status, 3, r.stdout + r.stderr);
  assert.match(r.stderr, /^rotate-decisions-pending: not rotating — the open entries alone make governance\/DECISIONS-PENDING\.md \d+ bytes, over 153600; tell the human\.$/m);
  assert.equal(snapshot(dir), before);
  assert.equal(staged(dir).length, 0);
  const dry = rot(dir, '--dry-run');
  assert.equal(dry.status, 3, 'the dry run lists, then says the same');
  assert.match(dry.stdout, /^kept \(4\):/m);
  assert.equal(snapshot(dir), before);
});

test("rotate-decisions-pending: refuses with exit 2 and writes nothing on a modified tracked file, HEAD not equal to its upstream, or a DECISIONS-PENDING.md blob that differs from origin/main's", () => {
  const refused = (dir, why, ...args) => {
    const before = snapshot(dir);
    const r = rot(dir, ...args);
    assert.equal(r.status, 2, `${why}: ${r.stdout}${r.stderr}`);
    assert.match(r.stderr, /refusing — /);
    assert.equal(snapshot(dir), before, `${why}: nothing written`);
    assert.equal(staged(dir).length, 0);
    return r.stderr;
  };
  const dirty = mkRepo({ [DP]: ledger(), 'README.md': 'one\n' });
  fs.writeFileSync(path.join(dirty, 'README.md'), 'two\n');
  refused(dirty, 'a modified tracked file');
  const ahead = mkRepo({ [DP]: ledger() });
  commit(ahead, { 'README.md': 'unpushed\n' }, 'local only');
  refused(ahead, 'HEAD ahead of its upstream');
  const differs = mkRepo({ [DP]: ledger() });
  sh(differs, ['checkout', '-q', '-b', 'work']);
  commit(differs, { [DP]: `${ledger()}\n*changed on the branch*\n` }, 'change the ledger');
  sh(differs, ['push', '-q', '-u', 'origin', 'work']);
  assert.match(refused(differs, 'a ledger blob that is not origin/main\'s'), /is not the blob on origin\/main/);
  const noPending = mkRepo({ [DP]: '# Decisions pending the human\n' });
  assert.match(refused(noPending, 'no Pending heading'), /no "## Pending" heading/);
});

test('rotate-decisions-pending: --dry-run writes nothing and lists the kept units, the archived units and one obligation row per archived unit', () => {
  const dir = mkRepo({ [DP]: ledger(), 'governance/PLAN.yaml': fs.readFileSync(path.join(here, 'fixtures', 'valid-plan.yaml'), 'utf8') });
  const before = snapshot(dir);
  const r = rot(dir, '--dry-run');
  assert.equal(r.status, 0, r.stderr);
  assert.equal(snapshot(dir), before);
  assert.equal(staged(dir).length, 0);
  assert.match(r.stdout, /^kept \(3\):$/m);
  assert.equal(r.stdout.split('\n').filter((l) => /^ {2}\d+ {2}/.test(l)).length, 3);
  assert.match(r.stdout, /^archived \(7\): .*block RULED x1.*marked entry x3/m);
  assert.match(r.stdout, /^obligation rows \(7\):$/m);
  const rows = r.stdout.split('\n').filter((l) => l.startsWith('  ['));
  assert.equal(rows.length, 7);
  assert.ok(rows.some((l) => l.startsWith('  [RULED] line 7 ') && l.includes('nodes: n-ready-b (ready)') && l.includes('flags: owed')), rows.join('\n'));
  const blob = /blob ([0-9a-f]{40})$/m.exec(r.stdout)[1];
  assert.equal(rot(dir).status, 0);
  assert.equal(sh(dir, ['rev-parse', `:${DP}`]), blob, 'the dry run named the blob the real run staged');
  const units = parseUnits(ledger()).filter((u) => classify(u).archive);
  assert.deepEqual(obligationRows(units, [{ id: 'n-ready-b', status: 'ready' }]).map((x) => x.nodes.length), [1, 0, 0, 0, 0, 0, 0]);
  assert.equal(buildLiveText({ kept: [], name: 'N.md', commit: 'abc' }), `# Decisions pending the human\n\n${noticeLine('N.md', 'abc')}\n\n## Pending\n`);
  assert.equal(archiveNameFor('D', () => false), 'CUT-STATE-D.md', 'B\'s archiveNameFor is used as merged');
});

test('rotate-decisions-pending: after a rotation commit the readers find the moved rulings in the archive: a felt-verdict cite, a withdrawn-test ruling and a pinned hash reference', () => {
  const FELT = 'FELT VERDICTS 2026-01-01 — a fixture sitting (CLOSED)';
  const T = 'Line one of the target file.\nLine two of the target file.\n';
  const V1 = '# Doc\n\nVerified by test `an_obsolete_test_name_here`.\n';
  const dir = mkRepo({ 'T.md': T, 'X-PREREGISTRATION.md': V1 });
  const v1 = sh(dir, ['rev-parse', 'HEAD']);
  const ok = `\`T.md:1-2\` @ ${v1} sha256:${sha(T)}`;
  const bad = `\`T.md:1-2\` @ ${v1} sha256:${sha('a wrong figure')}`;
  const text = ['# Decisions pending the human', '', '## Pending', '',
    '**RULED 2026-01-02 — question round 2 (fixture):**', '', `- *Item 1 — entry 8, a fixture ruling:* **"ruled"** a figure: ${ok}; a wrong one: ${bad}`, '',
    `**${FELT}:**`, 'row é →', '', '8. **[RULED 2026-01-03 — recorded as filed:]** a marked entry.', '', '9. **An open entry**', 'text', '', '## Resolved', '', '- done', ''].join('\n');
  commit(dir, { [DP]: text }, 'the ledger, with two pinned hash references');
  const row = `- withdrawn-test: \`X-PREREGISTRATION.md:3\` @ ${v1} sha256:${sha(`${V1.split('\n')[2]}\n`)}; ruling: round 2, item 1; carrier: entry 8\n`;
  commit(dir, { 'X-PREREGISTRATION.md': `${V1}\n${row}`, 'NOTES.md': `see ${DP}:900\n` }, 'a withdrawn-test row and an unpinned cite');
  sh(dir, ['push', '-q', 'origin', 'main']);
  assert.equal(verdictCiteExists(dir, `DECISIONS-PENDING.md ${FELT}`).ok, true, 'in the live file before');
  const r = rot(dir);
  assert.equal(r.status, 0, r.stderr);
  commit(dir, {}, 'rotate the ledger');
  sh(dir, ['push', '-q', 'origin', 'main']);
  assert.equal(fs.readFileSync(path.join(dir, DP), 'utf8').includes(FELT), false, 'it moved');
  assert.equal(verdictCiteExists(dir, `DECISIONS-PENDING.md ${FELT}`).ok, true, 'a felt-verdict cite');
  const claims = runVerifyTestClaims({ repoRoot: dir });
  assert.equal(claims.findings.length, 0, JSON.stringify(claims.findings));
  assert.equal(claims.withdrawn.length, 1, 'a withdrawn-test ruling and carrier');
  const quotes = runVerifyQuotes({ repoRoot: dir });
  assert.equal(quotes.hashFindings.length, 1, JSON.stringify(quotes.hashFindings));
  assert.equal(quotes.hashFindings[0].relPath, `state/cut-archive/${fs.readdirSync(path.join(dir, 'state', 'cut-archive'))[0]}`, 'the archive is scanned');
  assert.match(quotes.hashFindings[0].reason, /sha256 mismatch/);
  const cites = runVerifyCites({ repoRoot: dir });
  assert.equal(cites.gated.length, 0, JSON.stringify(cites.gated));
  assert.ok(cites.advisory.some((f) => f.relPath === 'NOTES.md' && f.target === `${DP}:900`), 'the unpinned cite past the new end is advisory');
});

test('rotate-decisions-pending: no hook in .claude/settings.json runs the rotation script', () => {
  const settings = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, '.claude', 'settings.json'), 'utf8'));
  const commands = [];
  const walk = (v) => {
    if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) { if (k === 'command' && typeof x === 'string') commands.push(x); else walk(x); }
  };
  walk(settings.hooks);
  assert.ok(commands.length > 0, 'the hook commands were read');
  assert.deepEqual(commands.filter((c) => c.includes('rotate-decisions-pending')), []);
});
