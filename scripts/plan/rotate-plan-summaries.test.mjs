// Tests for rotate-plan-summaries.mjs (the form's R1 to R16, scripts/plan/PLAN-SUMMARIES-ARCHIVE-PREREGISTRATION.md section 4).
// Fixtures are temporary git repositories, each with a bare repository as origin. Their summaries hold é (2 bytes), → (3 bytes),
// a \" escape, a é escape, a ` #` sequence, a `: ` sequence and a trailing comment. No date is typed: the archive's name comes
// from the machine clock, the past from epoch arithmetic. A run across UTC midnight can fail the tests that read today's date.
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { findCandidates, buildMove, verifyMove, pointerFor, isPointer } from './rotate-plan-summaries.mjs';
import { parseYamlSubset } from './yamlSubset.mjs';
import { loadPlan } from './plan.mjs';
import { buildQueue, renderMarkdown, checkQueueDrift } from './queue.mjs';
import { findMetricViolations, renderSite, checkSiteDrift, readVerifyQuotesBaselineCount } from './site.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const ROTATE = path.join(here, 'rotate-plan-summaries.mjs');
const REPO_ROOT = path.resolve(here, '..', '..');
const DAY = 86400000;
const PAST = new Date(Date.now() - 40 * DAY).toISOString(); // before this month's first, whatever today is
const today = () => new Date().toISOString().slice(0, 10);
const dirs = [];
const HEADER = "# Done nodes' summaries moved out of PLAN.yaml by scripts/plan/rotate-plan-summaries.mjs (AUTONOMY.md §35). Never edited.";

function sh(dir, args, env = {}) {
  return execFileSync('git', args, { cwd: dir, encoding: 'utf8', env: { ...process.env, ...env } }).replace(/\r?\n$/, '');
}
/** A repository on main with a bare origin; `files` is committed (dated `date`), then pushed. */
function mkRepo(files, date = PAST) {
  const origin = fs.mkdtempSync(path.join(os.tmpdir(), 'rotps-origin-'));
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rotps-repo-'));
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
after(() => { for (const d of dirs) fs.rmSync(d, { recursive: true, force: true }); });

// Each mutation below was applied alone to scripts/plan/rotate-plan-summaries.mjs at d93607315ede, this file run, the failure read by name, and the
// mutation reverted with the porcelain clean. These are observations by application, not verify-mutation runs.
// RECORDED MUTATION (MR1) at d93607315ede (S1): the archive line re-serialised from the parsed string -> fails by name (every test that needs a good run of the script also fails): `rotate-plan-summaries: a due run writes a new archive whose summary lines are byte-identical to the PLAN.yaml lines they replace, keyed by node id in PLAN.yaml order`.
// RECORDED MUTATION (MR2) at d93607315ede (S1): the archive line written as an unquoted plain scalar -> fails by name (every test that needs a good run of the script also fails): `rotate-plan-summaries: each archived string, once parsed by yamlSubset, equals the summary it replaced`.
// RECORDED MUTATION (MR3) at d93607315ede (S1): a generated comment line written above each pointer -> fails by name (every test that needs a good run of the script also fails): `rotate-plan-summaries: only the moved summary lines change; every other PLAN.yaml line is byte-identical and the line count is unchanged`.
// RECORDED MUTATION (MR4) at d93607315ede (S1): taken always false -> fails by name, and only this one: `rotate-plan-summaries: the pointer is one generated line under 300 bytes naming the new archive, an earlier archive is never written over, and the pointer matches no site.mjs metric pattern`.
// RECORDED MUTATION (MR5) at d93607315ede (S1): the size counted with .length -> fails by name (every test that needs a good run of the script also fails): `rotate-plan-summaries: a done node's summary of 300 UTF-8 bytes stays, 301 moves, and one under 300 characters but over 300 bytes moves`.
// RECORDED MUTATION (MR6) at d93607315ede (S1): the status filter removed -> fails by name (every test that needs a good run of the script also fails): `rotate-plan-summaries: a node that is in-progress, ready, blocked, proposed or unscheduled is never moved, whatever its summary's size`.
// RECORDED MUTATION (MR8a) at d93607315ede (S1): the parsed-equality assertion removed -> fails by name, and only this one: `rotate-plan-summaries: a round-trip mismatch refuses the whole run and writes nothing`.
// RECORDED MUTATION (MR8b) at d93607315ede (S1): the archive's ids compared as a set -> fails by name, and only this one: `rotate-plan-summaries: a duplicate id refuses the whole run and writes nothing`.
// RECORDED MUTATION (MR8c) at d93607315ede (S1): archive ids not in PLAN.yaml ignored -> fails by name, and only this one: `rotate-plan-summaries: an id missing from PLAN.yaml refuses the whole run and writes nothing`.
// RECORDED MUTATION (MR10) at d93607315ede (S1): the marker matched by prefix and skipped -> fails by name, and only this one: `rotate-plan-summaries: a summary that begins with the marker but is not a generated pointer refuses, and a pointer whose archive does not hold its id refuses`.
// RECORDED MUTATION (MR13) at d93607315ede (S1): --keep ignored -> fails by name, and only this one: `rotate-plan-summaries: --keep leaves the named summaries in place and the rest move`.
// RECORDED MUTATION (MR9) at d93607315ede (S1): a YamlSubsetError caught at both parse sites (loadPlan in main, the parse check in verifyMove) and the run continued; caught at loadPlan alone the run still refuses through verifyMove's own parse, and R9 passes -> fails by name, and only this one: `rotate-plan-summaries: a summary written as a block scalar refuses the run with its line number and writes nothing`.
// RECORDED MUTATION (MR7) at e11f7275a4c0 (S2): an empty archive written when nothing qualifies -> fails by name, and only this one: `rotate-plan-summaries: a second run changes nothing: not due in the same month, and due with nothing to move writes no archive`.
// RECORDED MUTATION (MR11) at e11f7275a4c0 (S2): the blob check removed -> fails by name, and only this one: `rotate-plan-summaries: refuses with exit 2 and writes nothing on a modified tracked file, HEAD not equal to its upstream, a PLAN.yaml blob that differs from origin/main's, or a carriage return in PLAN.yaml`.
// RECORDED MUTATION (MR12) at e11f7275a4c0 (S2): the glob widened to every file in state/cut-archive/ -> fails by name, and only this one: `rotate-plan-summaries: due when no PLAN-SUMMARIES archive was ever added or the newest was added before the month's first at 00:00Z, and a DECISIONS-PENDING archive does not count`.
// RECORDED MUTATION (MR14) at e11f7275a4c0 (S2): --dry-run stages the move -> fails by name, and only this one: `rotate-plan-summaries: --dry-run writes nothing and lists one obligation row per candidate with its markers in both segments and the PLAN nodes, DECISIONS-PENDING entries and KNOWN-LIMITATIONS items it names`.
// RECORDED MUTATION (MR16) at e11f7275a4c0 (S2): the test's path switched to a temporary copy of the settings with one SessionStart entry running the script added (no .claude/settings.json was edited) -> fails by name, and only this one: `rotate-plan-summaries: no hook in .claude/settings.json runs the script`.
// RECORDED MUTATION (MR15) at a73689f3cc62 (S3): the status filter dropped, so an open node's long summary moves -> fails by name (every test that needs a good run of the script also fails): `rotate-plan-summaries: from the real PLAN.yaml, after a run the queue differs only in plan_hash, the site's plan.json only in plan_hash and the moved summaries, and both drift checks pass after regeneration`.

const BASE = 'lead é → \\"q\\" \\u00e9 a #b c: d '; // YAML source between the quotes; the parsed text decodes both escapes
const bytes = (n) => `"${BASE}${'x'.repeat(n - Buffer.byteLength(JSON.parse(`"${BASE}"`), 'utf8'))}"`; // parses to exactly n UTF-8 bytes
const WIDE = `"${'é'.repeat(160)}"`; // 160 characters, 320 bytes
const node = (id, status, summary) => [
  `  - id: ${id}`, `    title: "T ${id}"`, '    kind: task', '    lane: shell', '    phase: prototype', `    status: ${status}`, '    order: 1',
  '    depends_on: []', '    needs_human: {kind: none, minutes: 0}', '    gate: none',
  `    evidence: ${status === 'done' ? '{pr: 1}' : status === 'in-progress' ? '{branch: "b"}' : 'null'}`, '    budget_minutes: 60', '    generation: 1',
  '    felt_verdict: false', '    entries: []', `    summary: ${summary}`, '    dates: {opened: 2026-09-01, done: null}',
];
const planOf = (nodes) => ['version: 1', 'priorities_approved: false', 'lanes:', '  - {id: shell, title: "Shell", priority: 1}', 'phases:',
  '  - {id: prototype, title: "Prototype", cite: "docs/07_Roadmap.md ## Prototype"}', 'nodes:', ...nodes.flat(), ''].join('\n');
const OPEN = ['in-progress', 'ready', 'blocked', 'proposed', 'unscheduled'];
const FIX = [
  node('n-short', 'done', '"short"'), node('n-d300', 'done', bytes(300)), node('n-d301', 'done', bytes(301)), node('n-wide', 'done', WIDE),
  node('n-comment', 'done', `${bytes(400)} # a trailing comment`), ...OPEN.map((s) => node(`n-${s}`, s, bytes(400))),
];
const MOVED = ['n-d301', 'n-wide', 'n-comment'];
const PLAN = planOf(FIX);
const lineOf = (text, id) => { const l = text.split('\n'); return l[l.findIndex((x, i) => i > l.indexOf(`  - id: ${id}`) && x.startsWith('    summary: '))]; };
const rot = (dir, ...args) => spawnSync(process.execPath, [ROTATE, ...args], { cwd: dir, encoding: 'utf8' });
const snapshot = (dir) => JSON.stringify([sh(dir, ['rev-parse', 'HEAD']), sh(dir, ['status', '--porcelain']), fs.readFileSync(path.join(dir, 'PLAN.yaml'), 'utf8'), fs.existsSync(path.join(dir, 'state', 'cut-archive')) && fs.readdirSync(path.join(dir, 'state', 'cut-archive'))]);
const staged = (dir) => sh(dir, ['diff', '--cached', '--name-status', '--no-renames']).split('\n').filter(Boolean).sort();
/** A refused run: exit 2, `re` on stderr, and nothing written. */
function refused(dir, re, ...args) {
  const before = snapshot(dir);
  const r = rot(dir, ...args);
  assert.equal(r.status, 2, r.stdout + r.stderr);
  assert.match(r.stderr, re);
  assert.equal(snapshot(dir), before, 'nothing written');
  assert.equal(staged(dir).length, 0);
}
/** A due run of the fixture plan: P, the archive's name and text, and the new PLAN.yaml's text. */
function ran(plan = PLAN, files = {}) {
  const dir = mkRepo({ 'PLAN.yaml': plan, ...files });
  const P = sh(dir, ['rev-parse', 'origin/main']);
  const r = rot(dir);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const added = staged(dir).filter((l) => l.startsWith('A\t')).map((l) => l.slice(2).replace('state/cut-archive/', ''));
  assert.equal(added.length, 1, 'one archive added');
  return { dir, P, name: added[0], archive: fs.readFileSync(path.join(dir, 'state', 'cut-archive', added[0]), 'utf8'), text: fs.readFileSync(path.join(dir, 'PLAN.yaml'), 'utf8') };
}
const nodesOf = (text) => parseYamlSubset(text).nodes;
const moveOf = (text = PLAN) => { const nodes = nodesOf(text); return { text, move: buildMove({ text, nodes, candidates: nodes.filter((n) => MOVED.includes(n.id)), name: 'PLAN-SUMMARIES-2020-01-01.yaml', commit: 'abc' }) }; };

test('rotate-plan-summaries: a due run writes a new archive whose summary lines are byte-identical to the PLAN.yaml lines they replace, keyed by node id in PLAN.yaml order', () => {
  const { dir, P, name, archive } = ran();
  assert.equal(name, `PLAN-SUMMARIES-${today()}.yaml`);
  assert.equal(archive, [HEADER, `source: {path: PLAN.yaml, commit: "${P}"}`, 'summaries:', ...MOVED.flatMap((id) => [`  - id: ${id}`, lineOf(PLAN, id)]), ''].join('\n'));
  assert.deepEqual(staged(dir), [`A\tstate/cut-archive/${name}`, 'M\tPLAN.yaml']);
  assert.equal(sh(dir, ['rev-parse', `:state/cut-archive/${name}`]), sh(dir, ['hash-object', `state/cut-archive/${name}`]));
  assert.equal(sh(dir, ['rev-parse', ':PLAN.yaml']), sh(dir, ['hash-object', 'PLAN.yaml']));
});

test('rotate-plan-summaries: each archived string, once parsed by yamlSubset, equals the summary it replaced', () => {
  const { archive } = ran();
  const parsed = parseYamlSubset(archive);
  assert.equal(parsed.source.path, 'PLAN.yaml');
  assert.deepEqual(parsed.summaries.map((s) => s.id), MOVED);
  for (const s of parsed.summaries) assert.equal(s.summary, nodesOf(PLAN).find((n) => n.id === s.id).summary, s.id);
  assert.ok(parsed.summaries[0].summary.includes('"q" é a #b c: d'), 'both escapes decoded');
  assert.ok(!parsed.summaries[2].summary.includes('trailing comment'), 'a trailing comment is not part of the string');
});

test('rotate-plan-summaries: only the moved summary lines change; every other PLAN.yaml line is byte-identical and the line count is unchanged', () => {
  const { name, text } = ran();
  const [was, now] = [PLAN.split('\n'), text.split('\n')];
  assert.equal(now.length, was.length);
  const changed = was.flatMap((l, i) => (l !== now[i] ? [i] : []));
  assert.deepEqual(changed.map((i) => was[i]), MOVED.map((id) => lineOf(PLAN, id)));
  for (const i of changed) assert.equal(now[i], `    summary: "[archived summary] state/cut-archive/${name}"`);
  assert.ok(text.endsWith('\n') && !text.includes('\r'));
});

test('rotate-plan-summaries: the pointer is one generated line under 300 bytes naming the new archive, an earlier archive is never written over, and the pointer matches no site.mjs metric pattern', () => {
  const prior = `state/cut-archive/PLAN-SUMMARIES-${today()}.yaml`;
  const { dir, name, text } = ran(PLAN, { [prior]: 'an earlier archive\n' });
  assert.equal(name, `PLAN-SUMMARIES-${today()}-2.yaml`);
  assert.equal(fs.readFileSync(path.join(dir, prior), 'utf8'), 'an earlier archive\n', 'never written over');
  const ptr = text.split('\n').filter((l) => l.includes('[archived summary]'));
  assert.equal(ptr.length, MOVED.length);
  for (const l of ptr) assert.ok(l === `    summary: "${pointerFor(name)}"` && Buffer.byteLength(l) <= 87 + 1, l);
  assert.ok(isPointer(pointerFor(name)) && !isPointer(`${pointerFor(name)} extra`) && !isPointer('[archived summary] by hand'));
  assert.deepEqual(findMetricViolations({ nodes: [{ id: 'x', title: 't', summary: pointerFor(`PLAN-SUMMARIES-${today()}-99.yaml`) }] }), []);
});

test("rotate-plan-summaries: a done node's summary of 300 UTF-8 bytes stays, 301 moves, and one under 300 characters but over 300 bytes moves", () => {
  const nodes = nodesOf(PLAN);
  const size = (id) => Buffer.byteLength(nodes.find((n) => n.id === id).summary, 'utf8');
  assert.deepEqual([size('n-d300'), size('n-d301')], [300, 301]);
  const wide = nodes.find((n) => n.id === 'n-wide').summary;
  assert.ok(wide.length < 300 && Buffer.byteLength(wide, 'utf8') > 300);
  assert.deepEqual(findCandidates(nodes).candidates.map((n) => n.id), MOVED);
  const { archive } = ran();
  assert.deepEqual(parseYamlSubset(archive).summaries.map((s) => s.id), MOVED);
});

test("rotate-plan-summaries: a node that is in-progress, ready, blocked, proposed or unscheduled is never moved, whatever its summary's size", () => {
  const nodes = nodesOf(PLAN);
  assert.ok(OPEN.every((s) => Buffer.byteLength(nodes.find((n) => n.id === `n-${s}`).summary) > 300), 'each open status has a long summary');
  const { archive, text } = ran();
  assert.deepEqual(parseYamlSubset(archive).summaries.map((s) => s.id), MOVED);
  for (const s of OPEN) assert.ok(text.includes(lineOf(PLAN, `n-${s}`)), s);
});

test('rotate-plan-summaries: a round-trip mismatch refuses the whole run and writes nothing', () => {
  const { text, move } = moveOf();
  const check = (archiveText) => verifyMove({ oldText: text, newText: move.text, archiveText, moved: move.moved });
  assert.deepEqual(check(move.archive), []);
  const bad = check(move.archive.replace('\\u00e9', '\\u00e8'));
  assert.ok(bad.some((p) => p.startsWith('parsed: ')), bad.join('\n'));
  // the CLI: a done node written as a bare `-` item (the locator cannot find its id line) refuses the run, whole
  const [head, ...rest] = node('n-bare', 'done', bytes(400));
  const bare = PLAN.replace('nodes:\n', `nodes:\n  -\n${[head.replace('  - ', '    '), ...rest].join('\n')}\n`);
  refused(mkRepo({ 'PLAN.yaml': bare }), /PLAN\.yaml has 10 "  - " items under nodes: but 11 nodes were parsed/);
});

test('rotate-plan-summaries: a duplicate id refuses the whole run and writes nothing', () => {
  const { text, move } = moveOf();
  const twice = move.archive + move.archive.split('\n').slice(3, 5).join('\n') + '\n';
  const bad = verifyMove({ oldText: text, newText: move.text, archiveText: twice, moved: move.moved });
  assert.ok(bad.some((p) => p.startsWith('ids: ')), bad.join('\n'));
  refused(mkRepo({ 'PLAN.yaml': planOf([...FIX, node('n-d301', 'done', '"dup"')]) }), /duplicate node id "n-d301"/);
});

test('rotate-plan-summaries: an id missing from PLAN.yaml refuses the whole run and writes nothing', () => {
  const { text, move } = moveOf();
  const ghost = `${move.archive}  - id: n-ghost\n${move.moved[0].oldLine}\n`;
  const bad = verifyMove({ oldText: text, newText: move.text, archiveText: ghost, moved: move.moved });
  assert.ok(bad.some((p) => p.startsWith('ids outside PLAN.yaml: ')), bad.join('\n'));
  const dir = mkRepo({ 'PLAN.yaml': PLAN });
  for (const id of ['n-ghost', 'n-d300', 'n-ready', 'n-d301,n-ghost']) refused(dir, /--keep n-(ghost|d300|ready): not a candidate/, '--keep', id);
});

test('rotate-plan-summaries: a summary written as a block scalar refuses the run with its line number and writes nothing', () => {
  const plan = PLAN.replace(`    summary: ${bytes(400)} # a trailing comment`, '    summary: |\n      a block scalar\n      over two lines');
  const at = plan.split('\n').findIndex((l) => l === '    summary: |') + 1;
  refused(mkRepo({ 'PLAN.yaml': plan }), new RegExp(`line ${at}: multi-line block scalars`));
});

test('rotate-plan-summaries: a summary that begins with the marker but is not a generated pointer refuses, and a pointer whose archive does not hold its id refuses', () => {
  const dir = mkRepo({ 'PLAN.yaml': planOf([...FIX, node('n-hand', 'done', '"[archived summary] written by hand"')]) });
  refused(dir, /n-hand: the summary begins with "\[archived summary\]" but is not a generated pointer/);
  const ptr = `"${pointerFor('PLAN-SUMMARIES-2020-01-01.yaml')}"`;
  const plan = planOf([...FIX, node('n-ptr', 'done', ptr)]);
  refused(mkRepo({ 'PLAN.yaml': plan }), /n-ptr: its pointer names an archive that is not tracked at HEAD or does not hold that id/);
  const other = 'summaries:\n  - id: n-other\n    summary: "x"\n';
  refused(mkRepo({ 'PLAN.yaml': plan, 'state/cut-archive/PLAN-SUMMARIES-2020-01-01.yaml': other }), /n-ptr: its pointer names an archive/);
  const held = ran(plan, { 'state/cut-archive/PLAN-SUMMARIES-2020-01-01.yaml': `${other}  - id: n-ptr\n    summary: "x"\n` });
  assert.deepEqual(parseYamlSubset(held.archive).summaries.map((s) => s.id), MOVED, 'a pointer is never a candidate; the others move');
});

test('rotate-plan-summaries: --keep leaves the named summaries in place and the rest move', () => {
  const dir = mkRepo({ 'PLAN.yaml': PLAN });
  const r = rot(dir, '--keep', 'n-d301,n-comment');
  assert.equal(r.status, 0, r.stderr);
  const name = staged(dir).find((l) => l.startsWith('A\t')).slice(2);
  assert.deepEqual(parseYamlSubset(fs.readFileSync(path.join(dir, name), 'utf8')).summaries.map((s) => s.id), ['n-wide']);
  const text = fs.readFileSync(path.join(dir, 'PLAN.yaml'), 'utf8');
  for (const id of ['n-d301', 'n-comment']) assert.ok(text.includes(lineOf(PLAN, id)), `${id} stays`);
  assert.ok(!text.includes(lineOf(PLAN, 'n-wide')));
});

test('rotate-plan-summaries: a second run changes nothing: not due in the same month, and due with nothing to move writes no archive', () => {
  const { dir } = ran();
  commit(dir, {}, 'the rotation');
  sh(dir, ['push', '-q', 'origin', 'main']);
  const before = snapshot(dir);
  const again = rot(dir);
  assert.equal(again.status, 0, again.stderr);
  assert.match(again.stdout, /^rotate-plan-summaries: not due — /);
  assert.equal(again.stdout.trim().split('\n').length, 1);
  assert.equal(snapshot(dir), before);
  assert.equal(staged(dir).length, 0);
  const none = mkRepo({ 'PLAN.yaml': planOf([node('n-short', 'done', '"short"'), node('n-in-progress', 'in-progress', bytes(400))]) });
  const was = snapshot(none);
  const r = rot(none);
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /^rotate-plan-summaries: nothing to move — /);
  assert.equal(r.stdout.trim().split('\n').length, 1);
  assert.equal(snapshot(none), was, 'no archive and no change');
  assert.equal(staged(none).length, 0);
});

test("rotate-plan-summaries: refuses with exit 2 and writes nothing on a modified tracked file, HEAD not equal to its upstream, a PLAN.yaml blob that differs from origin/main's, or a carriage return in PLAN.yaml", () => {
  const dirty = mkRepo({ 'PLAN.yaml': PLAN, 'README.md': 'one\n' });
  fs.writeFileSync(path.join(dirty, 'README.md'), 'two\n');
  refused(dirty, /git status --porcelain shows a tracked change/);
  const ahead = mkRepo({ 'PLAN.yaml': PLAN });
  commit(ahead, { 'README.md': 'unpushed\n' }, 'local only');
  refused(ahead, /HEAD is not equal to its upstream/);
  const differs = mkRepo({ 'PLAN.yaml': PLAN });
  sh(differs, ['checkout', '-q', '-b', 'work']);
  commit(differs, { 'PLAN.yaml': `${PLAN}# changed on the branch\n` }, 'change the plan');
  sh(differs, ['push', '-q', '-u', 'origin', 'work']);
  refused(differs, /PLAN\.yaml at HEAD is not the blob on origin\/main/);
  refused(mkRepo({ 'PLAN.yaml': PLAN.replaceAll('\n', '\r\n') }), /PLAN\.yaml at HEAD holds a carriage return/);
});

test("rotate-plan-summaries: due when no PLAN-SUMMARIES archive was ever added or the newest was added before the month's first at 00:00Z, and a DECISIONS-PENDING archive does not count", () => {
  const month = Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1);
  const wasDue = (files, date) => {
    const r = rot(mkRepo({ 'PLAN.yaml': PLAN, ...files }, date));
    assert.equal(r.status, 0, r.stderr);
    return !/not due/.test(r.stdout);
  };
  const ps = { 'state/cut-archive/PLAN-SUMMARIES-2020-01-01.yaml': 'summaries:\n' };
  assert.equal(wasDue({}, PAST), true, 'no archive ever');
  assert.equal(wasDue({ 'state/cut-archive/DECISIONS-PENDING-2020-01-01.md': 'x\n' }, new Date().toISOString()), true, 'a DECISIONS-PENDING archive added now does not count');
  assert.equal(wasDue(ps, new Date().toISOString()), false, 'added now');
  assert.equal(wasDue(ps, PAST), true, 'added in an earlier month');
  assert.equal(wasDue(ps, new Date(month).toISOString()), false, 'added at the first, 00:00:00Z');
  assert.equal(wasDue(ps, new Date(month - 1000).toISOString()), true, 'added a second before');
});

test('rotate-plan-summaries: --dry-run writes nothing and lists one obligation row per candidate with its markers in both segments and the PLAN nodes, DECISIONS-PENDING entries and KNOWN-LIMITATIONS items it names', () => {
  const pad = 'z'.repeat(300);
  const a = `Landed. Still waiting on n-in-progress until the next run; n-ready is owed (entries 3 and 7, KNOWN-LIMITATIONS items 2 and 5). ${pad} Before: this was held and queued.`;
  const files = {
    'PLAN.yaml': planOf([node('n-a', 'done', JSON.stringify(a)), node('n-b', 'done', JSON.stringify(`Landed cleanly. ${pad}`)), node('n-in-progress', 'in-progress', '"x"'), node('n-ready', 'ready', '"y"')]),
    'DECISIONS-PENDING.md': '# Decisions pending the human\n\n## Pending\n\n7. **An open entry**\ntext\n\n3. **[RESOLVED 2026-01-01]** a marked entry.\n',
    'KNOWN-LIMITATIONS.md': '# Known limitations\n\n1. **First** text\n\n2. **Second** text\n',
  };
  const dir = mkRepo(files);
  const before = snapshot(dir);
  const r = rot(dir, '--dry-run');
  assert.equal(r.status, 0, r.stderr);
  assert.equal(snapshot(dir), before);
  assert.equal(staged(dir).length, 0);
  assert.match(r.stdout, /^candidates \(2\); pointers found \(0\): none; kept by --keep \(0\): none$/m);
  const rows = r.stdout.split('\n').filter((l) => l.startsWith('  ['));
  assert.deepEqual(rows.map((l) => l.replace(/\d+ bytes/, 'N bytes')), [
    '  [n-a] N bytes | current: owed, waiting, until, next, still | rest: held, queued | nodes: n-in-progress (in-progress), n-ready (ready) | entries: 3 (not open), 7 (open) | items: 2 (present), 5 (absent)',
    '  [n-b] N bytes | current: none | rest: none | nodes: none | entries: none | items: none',
  ]);
  const blob = /blob ([0-9a-f]{40})$/m.exec(r.stdout)[1];
  const bytesOf = /moved bytes: (\d+);/.exec(r.stdout)[1];
  const real = rot(dir);
  assert.equal(real.status, 0, real.stderr);
  assert.equal(sh(dir, ['rev-parse', ':PLAN.yaml']), blob, 'the dry run named the blob the real run staged');
  assert.match(real.stdout, new RegExp(`moved 2 summaries, ${bytesOf} bytes`));
});

function hooksRunningTheScript(settingsPath) {
  const found = [];
  const walk = (v) => {
    if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) { if (k === 'command' && typeof x === 'string') { if (x.includes('rotate-plan-summaries.mjs')) found.push(x); } else walk(x); }
  };
  walk(JSON.parse(fs.readFileSync(settingsPath, 'utf8')).hooks);
  return found;
}
test('rotate-plan-summaries: no hook in .claude/settings.json runs the script', () => {
  const real = path.join(REPO_ROOT, '.claude', 'settings.json');
  const copy = JSON.parse(fs.readFileSync(real, 'utf8'));
  copy.hooks.SessionStart.push({ matcher: 'startup', hooks: [{ type: 'command', command: 'node "$CLAUDE_PROJECT_DIR/scripts/plan/rotate-plan-summaries.mjs"' }] });
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'rotps-settings-'));
  dirs.push(tmp);
  fs.writeFileSync(path.join(tmp, 'settings.json'), JSON.stringify(copy));
  assert.equal(hooksRunningTheScript(path.join(tmp, 'settings.json')).length, 1, 'the reader finds a hook that runs the script');
  assert.deepEqual(hooksRunningTheScript(real), []);
});

test("rotate-plan-summaries: from the real PLAN.yaml, after a run the queue differs only in plan_hash, the site's plan.json only in plan_hash and the moved summaries, and both drift checks pass after regeneration", () => {
  const real = fs.readFileSync(path.join(REPO_ROOT, 'PLAN.yaml'), 'utf8');
  assert.ok(!real.includes('\r'), 'LF, as CI checks out');
  const head = parseYamlSubset(real);
  const fit = (lines) => lines.map((l) => l.replace('lane: shell', `lane: ${head.lanes[0].id}`).replace('phase: prototype', `phase: ${head.phases[0].id}`));
  const dir = mkRepo({ 'PLAN.yaml': `${real}${[...fit(node('synthetic-long-done', 'done', bytes(400))), ...fit(node('synthetic-long-ready', 'ready', bytes(400)))].join('\n')}\n` });
  const planPath = path.join(dir, 'PLAN.yaml');
  const GEN = new Date(0).toISOString();
  const gen = () => {
    const plan = loadPlan(planPath);
    const queue = buildQueue(plan, { generatedAt: GEN });
    const site = renderSite(plan, null, { repoSlug: 'o/r', generatedAt: GEN, buildHealth: null, governanceBaselineCount: readVerifyQuotesBaselineCount(REPO_ROOT) });
    return { plan, queue, md: renderMarkdown(queue), site };
  };
  const before = gen();
  const run = rot(dir);
  assert.equal(run.status, 0, run.stdout + run.stderr);
  const after = gen();
  const name = staged(dir).find((l) => l.startsWith('A\t')).slice('A\tstate/cut-archive/'.length);
  const gone = before.plan.nodes.filter((n) => n.status === 'done' && Buffer.byteLength(n.summary, 'utf8') > 300).map((n) => n.id);
  assert.ok(gone.length >= 2 && gone.includes('synthetic-long-done') && !gone.includes('synthetic-long-ready'));
  const strip = ({ plan_hash, generated_at, ...rest }) => rest;
  assert.deepEqual(strip(after.queue), strip(before.queue), 'the queue differs only in plan_hash');
  assert.notEqual(after.queue.plan_hash, before.queue.plan_hash);
  const [mdBefore, mdAfter] = [before.md.split('\n'), after.md.split('\n')];
  assert.deepEqual(mdAfter.flatMap((l, i) => (l !== mdBefore[i] ? [l.slice(0, 26)] : [])), ['Generated from `PLAN.yaml`'], 'the markdown differs on its Generated line only');
  const [sb, sa] = [JSON.parse(before.site.planJson), JSON.parse(after.site.planJson)];
  assert.deepEqual({ ...sa, nodes: null, plan_hash: null }, { ...sb, nodes: null, plan_hash: null });
  assert.deepEqual(sa.nodes.map((n) => n.id), sb.nodes.map((n) => n.id));
  sb.nodes.forEach((n, i) => assert.deepEqual(sa.nodes[i], gone.includes(n.id) ? { ...n, summary: pointerFor(name) } : n, n.id));
  assert.equal(after.site.html.replaceAll(after.plan._meta.hash, '#'), before.site.html.replaceAll(before.plan._meta.hash, '#'), 'index.html differs only in plan_hash');
  const out = path.join(dir, 'site');
  fs.mkdirSync(path.join(out, 'data'), { recursive: true });
  for (const [rel, body] of [['CUSTODIAN-QUEUE.md', after.md], ['CUSTODIAN-QUEUE.json', `${JSON.stringify(after.queue, null, 2)}\n`], ['site/index.html', after.site.html], ['site/data/plan.json', after.site.planJson], ['site/.nojekyll', '']]) fs.writeFileSync(path.join(dir, rel), body, 'utf8');
  assert.deepEqual(checkQueueDrift({ planPath, outDir: dir }), { ok: true, problems: [] });
  assert.deepEqual(checkSiteDrift({ planPath, outDir: out, repoSlug: 'o/r' }), { ok: true, problems: [] });
});
