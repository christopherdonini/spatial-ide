#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// scripts/plan/moved-map.mjs -- governance piece F's move-map tool (the form
// governance/forms/scripts/GOVERNANCE-F-TIDY-REPOSITORY-IN-PLACE-PREREGISTRATION.md, sections 2.1 to 2.4).
//
//   plan [--all]          print rule R's rows at HEAD, `old<TAB>new`, sorted by old (--all adds the files that stay)
//   add <commit>          append the rows of a moves-only commit to governance/MOVED.tsv
//   --check               regenerate every row from the commits the file names; fail by name on any byte difference
//   rewrite-gates [--plan <file>]   rewrite every PLAN.yaml `gate:` value that is an old path to its new path
//
// `--root <dir>` points any of them at another checkout (the tests build temporary repositories).
// Node's standard library only.

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { MOVED_REL, parseMovedTsv, formatMovedTsv, sortRows, currentPath, buildMovedMap } from './movedMap.mjs';
import { ALLOWED_DOCS_FORMS, trackedForms } from './forms-layout.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(here, '..', '..');

const git = (root, args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 1 << 28 });

// --- rule R (section 2.1) -------------------------------------------------------------------------------

// The root entries that move (12 files), and the one that goes to scripts/ (OPEN-4 A).
export const ROOT_MOVES = new Map([
  ...['AI_DEVELOPMENT.md', 'AUTONOMY.md', 'CUSTODIAN-QUEUE.json', 'CUSTODIAN-QUEUE.md', 'DECISIONS-PENDING.md', 'MACOS-BRINGUP.md', 'PLAN.yaml', 'PRE-PUBLIC-CHECKLIST.md', 'PRECEDENTS.md', 'PUBLIC-AUDIENCE-AUDIT.md', 'RELEASE-0.1.md', 'RELEASE-DAY-CHECKLIST.md'].map((f) => [f, `governance/${f}`]),
  ['run-cold-open.ps1', 'scripts/run-cold-open.ps1'],
]);
// The 31 root entries that stay.
export const ROOT_STAYS = new Set([
  '.cargo', '.claude', '.cut-archive', '.git-blame-ignore-revs', '.gitattributes', '.githooks', '.github', '.gitignore', '.ignore',
  'CLAUDE.md', 'CONTRIBUTING.md', 'Cargo.lock', 'Cargo.toml', 'DCO', 'DEPENDENCY-LICENSES.md', 'KNOWN-LIMITATIONS.md', 'LICENSE', 'LICENSES', 'QUICKSTART.md', 'README.md',
  'docs', 'engine', 'frontends', 'kernel', 'protocol', 'renderer', 'scripts', 'site', 'spikes', 'state', 'tools',
]);
// OPEN-3 (A): a form under one of these code folders goes to governance/forms/<first path segment>/.
export const FORM_FOLDERS = new Set(['engine', 'frontends', 'kernel', 'protocol', 'renderer', 'scripts', 'spikes', 'tools']);

/**
 * Rule R at HEAD of `root`: { rows: [{ old, new }] (those that move), stays: [old], problems }. A root entry
 * or a form that R cannot place is a problem (the move stops and the case goes to the human), and so is a
 * new path two rows share.
 */
export function planRows(root) {
  const rows = [];
  const stays = [];
  const problems = [];
  const forms = new Set(trackedForms(root));
  const entries = git(root, ['ls-tree', '--name-only', 'HEAD']).split('\n').filter(Boolean);
  for (const e of entries) {
    if (ROOT_MOVES.has(e)) rows.push({ old: e, new: ROOT_MOVES.get(e) });
    else if (ROOT_STAYS.has(e)) stays.push(e);
    else if (!forms.has(e)) problems.push(`root entry "${e}" has no row under rule R`);
  }
  for (const f of forms) {
    const base = f.slice(f.lastIndexOf('/') + 1);
    const top = f.includes('/') ? f.slice(0, f.indexOf('/')) : null;
    if (f.startsWith('state/') || f.startsWith('governance/') || ALLOWED_DOCS_FORMS.includes(f)) stays.push(f);
    else if (top === null) rows.push({ old: f, new: `governance/forms/root/${base}` });
    else if (FORM_FOLDERS.has(top)) rows.push({ old: f, new: `governance/forms/${top}/${base}` });
    else problems.push(`form "${f}" is in a folder rule R does not name`);
  }
  const seen = new Map();
  for (const r of rows) {
    if (seen.has(r.new)) problems.push(`"${r.old}" and "${seen.get(r.new)}" would share the new path "${r.new}"`);
    seen.set(r.new, r.old);
  }
  const b = (s) => Buffer.from(s, 'utf8');
  rows.sort((x, y) => Buffer.compare(b(x.old), b(y.old)));
  return { rows, stays: stays.sort((x, y) => Buffer.compare(b(x), b(y))), problems };
}

// --- MOVED.tsv (section 2.3) ----------------------------------------------------------------------------

/** The rows of one moves-only commit. Throws, naming the line, on anything but R100 into the allow list. */
export function rowsFromCommit(root, commit) {
  const full = git(root, ['rev-parse', '--verify', `${commit}^{commit}`]).trim();
  const t = git(root, ['diff', '--name-status', '-z', '-M100%', `${full}^`, full]).split('\0');
  if (t[t.length - 1] === '') t.pop();
  const rows = [];
  for (let i = 0; i < t.length;) {
    const status = t[i++];
    const paths = /^[RC]/.test(status) ? [t[i++], t[i++]] : [t[i++]];
    if (status !== 'R100') throw new Error(`commit ${full.slice(0, 12)}: the line "${status}\t${paths.join('\t')}" is not R100`);
    const [old, nu] = paths;
    if (path.posix.basename(old) !== path.posix.basename(nu)) throw new Error(`commit ${full.slice(0, 12)}: "${old}" to "${nu}" changes the basename`);
    if (!nu.startsWith('governance/') && nu !== 'scripts/run-cold-open.ps1') throw new Error(`commit ${full.slice(0, 12)}: "${nu}" is outside governance/ and the one allowed scripts/ path`);
    rows.push({ old, new: nu, commit: full });
  }
  if (rows.length === 0) throw new Error(`commit ${full.slice(0, 12)} holds no rename`);
  return rows;
}

function readRows(root) {
  const p = path.join(root, MOVED_REL);
  return fs.existsSync(p) ? parseMovedTsv(fs.readFileSync(p, 'utf8')) : null;
}

/** Appends a commit's rows; the whole file is written sorted by old path. Returns the rows added. */
export function addCommit(root, commit) {
  const existing = readRows(root) ?? [];
  const added = rowsFromCommit(root, commit);
  if (existing.some((r) => r.commit === added[0].commit)) throw new Error(`commit ${added[0].commit.slice(0, 12)} is already in ${MOVED_REL}`);
  for (const r of added) {
    if (existing.some((e) => e.old === r.old)) throw new Error(`"${r.old}" is already a row of ${MOVED_REL}`);
  }
  fs.mkdirSync(path.join(root, 'governance'), { recursive: true });
  fs.writeFileSync(path.join(root, MOVED_REL), formatMovedTsv([...existing, ...added]));
  return added;
}

/** Regenerates the file from the commits it names and compares bytes. Returns { ok, problems }. */
export function checkMoved(root) {
  const p = path.join(root, MOVED_REL);
  if (!fs.existsSync(p)) return { ok: false, problems: [`${MOVED_REL} does not exist`] };
  const text = fs.readFileSync(p, 'utf8');
  let rows;
  try {
    rows = parseMovedTsv(text);
  } catch (e) {
    return { ok: false, problems: [e.message] };
  }
  const regenerated = [];
  try {
    for (const c of new Set(rows.map((r) => r.commit))) regenerated.push(...rowsFromCommit(root, c));
  } catch (e) {
    return { ok: false, problems: [`${MOVED_REL} cannot be regenerated: ${e.message}`] };
  }
  const want = formatMovedTsv(regenerated);
  if (want === text) return { ok: true, problems: [] };
  const line = (r) => `${r.old}\t${r.new}\t${r.commit}`;
  const have = new Set(rows.map(line));
  const need = new Set(regenerated.map(line));
  const problems = [
    ...rows.filter((r) => !need.has(line(r))).map((r) => `${MOVED_REL}: row "${line(r)}" is not what its commit made`),
    ...regenerated.filter((r) => !have.has(line(r))).map((r) => `${MOVED_REL}: row "${line(r)}" is missing`),
  ];
  return { ok: false, problems: problems.length ? problems : [`${MOVED_REL}: the rows are right but the bytes differ from their regeneration (order or spacing)`] };
}

// --- PLAN.yaml gates (section 2.4) -----------------------------------------------------------------------

const GATE_LINE_RE = /^(\s+gate:\s+)(["']?)([^"'\s]+)\2(\s*)$/;

/** Rewrites every `gate:` value that is an old path; touches no other byte. Returns { text, gates, rewritten }. */
export function rewriteGateLines(text, map) {
  let gates = 0;
  let rewritten = 0;
  const out = text.split('\n').map((l) => {
    const m = GATE_LINE_RE.exec(l);
    if (!m || m[3] === 'none') return l;
    gates++;
    const now = currentPath(map, m[3]);
    if (now === m[3]) return l;
    rewritten++;
    return m[1] + m[2] + now + m[2] + m[4];
  });
  return { text: out.join('\n'), gates, rewritten };
}

// --- command line ----------------------------------------------------------------------------------------

function main(argv) {
  let root = REPO_ROOT;
  let planFile = null;
  let all = false;
  const rest = [];
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--root') root = path.resolve(argv[++i]);
    else if (argv[i] === '--plan') planFile = argv[++i];
    else if (argv[i] === '--all') all = true;
    else rest.push(argv[i]);
  }
  const [cmd, arg] = rest;
  if (cmd === 'plan') {
    const { rows, stays, problems } = planRows(root);
    if (problems.length) {
      console.error(`moved-map plan FAIL -- ${problems.length} case(s) rule R cannot place (the move stops; the human decides):`);
      for (const p of problems) console.error(`  - ${p}`);
      process.exitCode = 1;
      return;
    }
    for (const r of rows) console.log(`${r.old}\t${r.new}`);
    if (all) for (const s of stays) console.log(`${s}\tstays`);
    console.error(`moved-map plan: ${rows.length} rows move, ${stays.length} stay.`);
  } else if (cmd === 'add') {
    if (!arg) throw new Error('usage: moved-map.mjs add <commit>');
    const added = addCommit(root, arg);
    console.log(`moved-map add: ${added.length} row(s) from ${added[0].commit} appended to ${MOVED_REL}.`);
  } else if (cmd === '--check' || argv.includes('--check')) {
    const { ok, problems } = checkMoved(root);
    if (!ok) {
      console.error(`moved-map --check FAIL:`);
      for (const p of problems) console.error(`  - ${p}`);
      process.exitCode = 1;
      return;
    }
    console.log(`moved-map --check PASS -- ${MOVED_REL} equals its regeneration.`);
  } else if (cmd === 'rewrite-gates') {
    const map = buildMovedMap(readRows(root) ?? []);
    const file = planFile ? path.resolve(planFile) : path.join(root, currentPath(map, 'PLAN.yaml'));
    const { text, gates, rewritten } = rewriteGateLines(fs.readFileSync(file, 'utf8'), map);
    if (rewritten) fs.writeFileSync(file, text);
    console.log(`moved-map rewrite-gates: ${gates} gate lines that are not none, ${rewritten} named an old path and were rewritten.`);
  } else {
    throw new Error('usage: moved-map.mjs plan [--all] | add <commit> | --check | rewrite-gates [--plan <file>]  (all take --root <dir>)');
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    main(process.argv.slice(2));
  } catch (e) {
    console.error(e.message);
    process.exitCode = 1;
  }
}
