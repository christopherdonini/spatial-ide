#!/usr/bin/env node
// scripts/plan/rotate-plan-summaries.mjs — the monthly move of done nodes' long summaries out of PLAN.yaml (AUTONOMY.md §35;
// the form is scripts/plan/PLAN-SUMMARIES-ARCHIVE-PREREGISTRATION.md, section 2). Run by the custodian at session start, right
// after rotate-cut-state.mjs and rotate-decisions-pending.mjs; NO hook runs it.
//
// A done node whose parsed summary is over 300 UTF-8 bytes moves (unless --keep names it): its PLAN.yaml summary line is copied
// byte for byte into a new state/cut-archive/PLAN-SUMMARIES-<date>.yaml (machine clock, UTC; `-2`, `-3`, ... never overwritten),
// and the line becomes one generated pointer. The script STAGES both files; it never commits, pushes or fetches. Refused (exit 2):
// nothing is written. Every git call is an argument array with a 64 MiB buffer.

import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { loadPlan, validatePlan, PlanValidationError } from './plan.mjs';
import { parseYamlSubset, YamlSubsetError } from './yamlSubset.mjs';
import { archiveNameFor } from './rotate-cut-state.mjs';
import { isDue, parseUnits, classify } from './rotate-decisions-pending.mjs';

const ARCHIVE_DIR = 'state/cut-archive';
const MARKER = '[archived summary]';
const POINTER_RE = /^\[archived summary\] state\/cut-archive\/PLAN-SUMMARIES-\d{4}-\d\d-\d\d(?:-(?:[2-9]|[1-9]\d))?\.yaml$/;
const SUMMARY_KEY = '    summary: ';
const OBLIGATION_WORDS = ['owed', 'owes', 'owing', 'waits', 'waiting', 'pending', 'held', 'until', 'next', 'follow-up', 'queued', 'later', 'not yet', 'deferred', 'outstanding', 'carried', 'still', 'open', 'todo'];
const WORD_RES = OBLIGATION_WORDS.map((w) => [w, new RegExp(`(?<![A-Za-z0-9_-])${w}(?![A-Za-z0-9_-])`, 'i')]);

class Refusal extends Error {}
class Stop extends Error {} // raised once the move began: nothing is rolled back

export const pointerFor = (name) => `${MARKER} ${ARCHIVE_DIR}/${name}`;
export const isPointer = (s) => typeof s === 'string' && POINTER_RE.test(s);

/**
 * { candidates, kept, pointers } over the parsed nodes: a candidate is a done node whose summary is over 300 UTF-8 bytes and is
 * not a pointer; `keep` (a Set of ids) leaves candidates in place. A summary that begins with the marker but is not exactly a
 * pointer refuses, and so does a pointer for which `holds(name, id)` is false (a missing archive, or one without that id).
 */
export function findCandidates(nodes, { keep = new Set(), holds = null } = {}) {
  const all = [], pointers = [];
  for (const n of nodes) {
    const s = n.summary;
    if (typeof s === 'string' && s.startsWith(MARKER)) {
      if (!isPointer(s)) throw new Refusal(`${n.id}: the summary begins with "${MARKER}" but is not a generated pointer`);
      if (holds && !holds(s.slice(s.lastIndexOf('/') + 1), n.id)) throw new Refusal(`${n.id}: its pointer names an archive that is not tracked at HEAD or does not hold that id`);
      pointers.push(n);
    } else if (n.status === 'done' && typeof s === 'string' && Buffer.byteLength(s, 'utf8') > 300) all.push(n);
  }
  for (const id of keep) if (!all.some((n) => n.id === id)) throw new Refusal(`--keep ${id}: not a candidate`);
  return { candidates: all.filter((n) => !keep.has(n.id)), kept: all.filter((n) => keep.has(n.id)), pointers };
}

/** The line index of each node's own `    summary: ` line: the k-th `  - ` item under `nodes:` is nodes[k], its id line must match. */
function locate(lines, nodes, k) {
  const starts = [];
  let inNodes = false, end = lines.length;
  lines.forEach((l, i) => {
    if (/^nodes:\s*$/.test(l)) inNodes = true;
    else if (inNodes && /^\S/.test(l) && !l.startsWith('#')) { inNodes = false; end = Math.min(end, i); }
    if (inNodes && l.startsWith('  - ')) starts.push(i);
  });
  if (starts.length !== nodes.length) throw new Refusal(`PLAN.yaml has ${starts.length} "  - " items under nodes: but ${nodes.length} nodes were parsed`);
  const from = starts[k], to = k + 1 < starts.length ? starts[k + 1] : end;
  if (!new RegExp(`^  - id: ${nodes[k].id}\\s*(#.*)?$`).test(lines[from])) throw new Refusal(`${nodes[k].id}: item ${k + 1} does not open with its id line`);
  const hits = [];
  for (let i = from; i < to; i++) if (lines[i].startsWith(SUMMARY_KEY)) hits.push(i);
  if (hits.length !== 1) throw new Refusal(`${nodes[k].id}: ${hits.length} summary lines at four spaces, not one`);
  return hits[0];
}

/** { archive, text, moved, movedBytes } from P's PLAN.yaml `text`: the archive and the new PLAN.yaml, both LF with one final newline. */
export function buildMove({ text, nodes, candidates, name, commit }) {
  const lines = text.split('\n');
  const pointer = `${SUMMARY_KEY}"${pointerFor(name)}"`;
  const moved = candidates.map((n) => {
    const idx = locate(lines, nodes, nodes.indexOf(n));
    return { id: n.id, idx, oldLine: lines[idx], newLine: pointer };
  });
  const next = [...lines];
  for (const m of moved) next[m.idx] = m.newLine;
  const head = ["# Done nodes' summaries moved out of PLAN.yaml by scripts/plan/rotate-plan-summaries.mjs (AUTONOMY.md §35). Never edited.", `source: {path: PLAN.yaml, commit: "${commit}"}`, 'summaries:'];
  const archive = [...head, ...moved.flatMap((m) => [`  - id: ${m.id}`, m.oldLine])].join('\n') + '\n';
  const movedBytes = moved.reduce((sum, m) => sum + Buffer.byteLength(m.oldLine, 'utf8') - Buffer.byteLength(m.newLine, 'utf8'), 0);
  return { archive, text: next.join('\n'), moved, movedBytes };
}

/**
 * The problems found by checking a move in memory (an empty list: the move holds). Every assertion runs; none stops the others.
 * Needs P's text, the new PLAN.yaml text, the archive text and the `moved` list of buildMove.
 */
export function verifyMove({ oldText, newText, archiveText, moved }) {
  const bad = [];
  const check = (what, fn) => { try { fn(); } catch (e) { bad.push(`${what}: ${String(e.message).split('\n')[0]}`); } };
  let oldPlan, newPlan, arch;
  check('parse', () => {
    oldPlan = parseYamlSubset(oldText, 'PLAN.yaml at P');
    newPlan = parseYamlSubset(newText, 'the new PLAN.yaml');
    arch = parseYamlSubset(archiveText, 'the archive');
    const errors = validatePlan(newPlan);
    assert.deepEqual(errors, [], `the new PLAN.yaml does not validate (${errors[0]})`);
    assert.ok(Array.isArray(arch.summaries), 'the archive has no summaries list');
  });
  if (!oldPlan || !newPlan || !arch?.summaries) return bad;
  const oldLines = oldText.split('\n'), newLines = newText.split('\n'), rawArchive = archiveText.split('\n');
  check('line count', () => assert.equal(newLines.length, oldLines.length, 'the line counts differ'));
  check('changed lines', () => {
    const at = new Set(moved.map((m) => m.idx));
    const stray = oldLines.flatMap((l, i) => (l !== newLines[i] && !at.has(i) ? [i] : []));
    assert.deepEqual(stray, [], `lines ${stray.map((i) => i + 1)} differ and are not moved summary lines`);
  });
  check('archive bytes', () => {
    const byId = new Map();
    for (let i = 3; i + 1 < rawArchive.length; i += 2) byId.set(rawArchive[i].replace(/^ {2}- id: /, ''), rawArchive[i + 1]);
    for (const m of moved) assert.equal(byId.get(m.id), oldLines[m.idx], `${m.id}: the archived line is not P's line byte for byte`);
  });
  const nodeIds = new Set(oldPlan.nodes.map((n) => n.id));
  const ids = arch.summaries.map((s) => s.id);
  check('ids outside PLAN.yaml', () => assert.deepEqual(ids.filter((id) => !nodeIds.has(id)), [], 'the archive holds an id that PLAN.yaml lacks'));
  check('ids', () => assert.deepEqual(ids, moved.map((m) => m.id), 'the archive ids are not exactly the moved ids, in order, once each'));
  check('parsed', () => {
    for (const s of arch.summaries) assert.equal(s.summary, oldPlan.nodes.find((n) => n.id === s.id)?.summary, `${s.id}: the archived string, parsed, is not the summary it replaced`);
  });
  check('nodes', () => {
    const to = new Map(moved.map((m) => [m.id, JSON.parse(m.newLine.slice(SUMMARY_KEY.length))]));
    assert.deepEqual(newPlan.nodes, oldPlan.nodes.map((n) => (to.has(n.id) ? { ...n, summary: to.get(n.id) } : n)), 'the new nodes differ from P\'s beyond the moved summaries');
  });
  return bad;
}

/**
 * One row per candidate: its bytes; the obligation markers found before the first ` Before: ` and after it; every PLAN node id
 * named as a whole word with its status; every DECISIONS-PENDING entry named, open when classify keeps it under `## Pending`; every
 * KNOWN-LIMITATIONS item named, present when a line `<n>. **` exists. `ctx` is { nodes, pending, limitations } as read at HEAD.
 */
export function obligationRows(candidates, { nodes, pending, limitations }) {
  const status = new Map(nodes.map((n) => [n.id, n.status]));
  const open = new Set(parseUnits(pending).filter((u) => u.kind === 'entry' && !classify(u).archive).map((u) => u.number));
  const nums = (s, re) => [...s.matchAll(re)].flatMap((m) => m[1].match(/\d+/g).map(Number));
  return candidates.map((n) => {
    const s = n.summary, cut = s.indexOf(' Before: ');
    const marks = (t) => WORD_RES.filter(([, re]) => re.test(t)).map(([w]) => w);
    return {
      id: n.id,
      bytes: Buffer.byteLength(s, 'utf8'),
      current: marks(cut === -1 ? s : s.slice(0, cut)),
      rest: cut === -1 ? [] : marks(s.slice(cut)),
      nodes: [...new Set(s.match(/[A-Za-z0-9_-]+/g) ?? [])].filter((w) => status.has(w)).map((w) => ({ id: w, status: status.get(w) })),
      entries: [...new Set(nums(s, /\bentr(?:y|ies)\s+(\d+(?:(?:\s*,\s*|\s+and\s+)\d+)*)/gi))].map((e) => ({ n: e, open: open.has(e) })),
      items: [...new Set(nums(s, /KNOWN-LIMITATIONS(?:\.md)?\s+items?\s+(\d+(?:(?:\s*,\s*|\s+and\s+)\d+)*)/gi))].map((i) => ({ n: i, present: new RegExp(`^${i}\\. \\*\\*`, 'm').test(limitations) })),
    };
  });
}

function parseArgs(argv) {
  const args = { keep: new Set(), dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--dry-run') args.dryRun = true;
    else if (argv[i] === '--keep') for (const id of String(argv[++i] ?? '').split(',')) args.keep.add(id);
    else throw new Refusal(`unknown argument: ${argv[i]}`);
  }
  return args;
}

function main(argv) {
  const args = parseArgs(argv);
  const run = (cmd, a, opts = {}) => {
    try {
      return execFileSync(cmd, a, { cwd: opts.cwd, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, input: opts.input, stdio: ['pipe', 'pipe', 'pipe'] });
    } catch (e) {
      throw new Refusal(`git ${a.join(' ')} failed (${String(e.stderr ?? e.message).trim().split('\n')[0]})`);
    }
  };
  const root = run('git', ['rev-parse', '--show-toplevel'], { cwd: process.cwd() }).trim();
  const raw = (a, input) => run('git', a, { cwd: root, input });
  const git = (a, input) => raw(a, input).replace(/\r?\n$/, '');

  if (git(['status', '--porcelain']).split('\n').some((l) => l.trim() !== '' && !l.startsWith('??') && !l.startsWith('!!'))) throw new Refusal('git status --porcelain shows a tracked change');
  if (git(['rev-parse', 'HEAD']) !== git(['rev-parse', '@{u}'])) throw new Refusal('HEAD is not equal to its upstream (@{u})');
  const P = git(['rev-parse', 'origin/main']);
  if (git(['rev-parse', 'HEAD:PLAN.yaml']) !== git(['rev-parse', 'origin/main:PLAN.yaml'])) throw new Refusal('PLAN.yaml at HEAD is not the blob on origin/main');
  const text = raw(['show', 'HEAD:PLAN.yaml']);
  if (text.includes('\r')) throw new Refusal('PLAN.yaml at HEAD holds a carriage return');
  const plan = loadPlan(path.join(root, 'PLAN.yaml'));
  if (plan._meta.text !== text) throw new Refusal('the PLAN.yaml on disk is not the one at HEAD');
  const holds = (name, id) => {
    try { return (parseYamlSubset(raw(['show', `HEAD:${ARCHIVE_DIR}/${name}`])).summaries ?? []).some((s) => s?.id === id); } catch { return false; }
  };
  const { candidates, kept, pointers } = findCandidates(plan.nodes, { keep: args.keep, holds });

  const now = new Date();
  const last = git(['log', '-1', '--diff-filter=A', '--format=%cI', '--', `:(glob)${ARCHIVE_DIR}/PLAN-SUMMARIES-*.yaml`]) || null;
  const due = isDue({ lastArchiveIso: last, nowIso: now, sizeBytes: 0 }); // the human named no size trigger: only .due and .month are used
  if (!due.due) {
    console.log(`rotate-plan-summaries: not due — the newest archive was added ${last}; this month began ${due.month}.`);
    return 0;
  }
  if (!candidates.length) {
    console.log(`rotate-plan-summaries: nothing to move — no done node has a summary over 300 UTF-8 bytes that is not kept${kept.length ? ` (kept: ${kept.map((n) => n.id).join(', ')})` : ''}.`);
    return 0;
  }

  const inTree = new Set(git(['ls-tree', '--name-only', 'HEAD', '--', `${ARCHIVE_DIR}/`]).split('\n'));
  // B's archiveNameFor names CUT-STATE-<date>[-n].md; this archive's name is the same with the stem and extension swapped.
  const nameOf = (n) => n.replace(/^CUT-STATE-/, 'PLAN-SUMMARIES-').replace(/\.md$/, '.yaml');
  const name = archiveNameFor(now.toISOString().slice(0, 10), (n) => inTree.has(`${ARCHIVE_DIR}/${nameOf(n)}`) || fs.existsSync(path.join(root, ARCHIVE_DIR, nameOf(n))));
  if (name === null) throw new Refusal('every archive name for today up to -99 is taken');
  const archiveName = nameOf(name);
  const move = buildMove({ text, nodes: plan.nodes, candidates, name: archiveName, commit: P });
  const problems = verifyMove({ oldText: text, newText: move.text, archiveText: move.archive, moved: move.moved });
  if (problems.length) throw new Refusal(`verifyMove failed: ${problems.join('; ')}`);

  if (args.dryRun) {
    const ctx = { nodes: plan.nodes, pending: raw(['show', 'HEAD:DECISIONS-PENDING.md']), limitations: raw(['show', 'HEAD:KNOWN-LIMITATIONS.md']) };
    console.log(`rotate-plan-summaries: dry run — due: ${due.reason}. The archive would be ${ARCHIVE_DIR}/${archiveName}; P is ${P}.`);
    console.log(`candidates (${candidates.length}); pointers found (${pointers.length}): ${pointers.map((n) => n.id).join(', ') || 'none'}; kept by --keep (${kept.length}): ${kept.map((n) => n.id).join(', ') || 'none'}`);
    console.log(`moved bytes: ${move.movedBytes}; the new PLAN.yaml: blob ${git(['hash-object', '--stdin'], move.text)}`);
    console.log(`obligation rows (${candidates.length}):`);
    const list = (xs, f) => xs.map(f).join(', ') || 'none';
    for (const r of obligationRows(candidates, ctx)) {
      console.log(`  [${r.id}] ${r.bytes} bytes | current: ${list(r.current, (w) => w)} | rest: ${list(r.rest, (w) => w)} | nodes: ${list(r.nodes, (n) => `${n.id} (${n.status})`)} | entries: ${list(r.entries, (e) => `${e.n} (${e.open ? 'open' : 'not open'})`)} | items: ${list(r.items, (i) => `${i.n} (${i.present ? 'present' : 'absent'})`)}`);
    }
    return 0;
  }

  const files = { [`${ARCHIVE_DIR}/${archiveName}`]: move.archive, 'PLAN.yaml': move.text };
  try {
    fs.mkdirSync(path.join(root, ARCHIVE_DIR), { recursive: true });
    for (const [rel, body] of Object.entries(files)) fs.writeFileSync(path.join(root, rel), body, 'utf8');
    git(['add', '--', ...Object.keys(files)]);
  } catch (e) {
    throw new Stop(e.message);
  }
  for (const [rel, body] of Object.entries(files)) {
    if (git(['rev-parse', `:${rel}`]) !== git(['hash-object', '--stdin'], body)) throw new Stop(`the staged blob of ${rel} differs from the in-memory text`);
  }
  console.log(`rotate-plan-summaries: staged:\n${git(['diff', '--cached', '--name-status', '--no-renames'])}`);
  console.log(`blobs: ${archiveName} ${git(['rev-parse', `:${ARCHIVE_DIR}/${archiveName}`])}, PLAN.yaml ${git(['rev-parse', ':PLAN.yaml'])}; P is ${P}; moved ${move.moved.length} summaries, ${move.movedBytes} bytes.`);
  console.log(`Next: node scripts/plan/queue.mjs and node scripts/plan/site.mjs (no site/data/build-health.json present), git add CUSTODIAN-QUEUE.md CUSTODIAN-QUEUE.json site/index.html site/data/plan.json and the sheet; run verify-cites, verify-quotes, verify-test-claims and verify --offline on this staged tree and on HEAD and compare; when equal, git commit -s -m "chore: move done nodes' summaries from PLAN.yaml to ${ARCHIVE_DIR}/${archiveName}" and push; when they differ, restore the index and every path from HEAD, commit nothing, and tell the human.`);
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    process.exitCode = main(process.argv.slice(2));
  } catch (e) {
    console.error(`rotate-plan-summaries: ${e instanceof Refusal || e instanceof YamlSubsetError || e instanceof PlanValidationError ? `refusing — ${e.message}. Nothing was written.` : e instanceof Stop ? `STOP — ${e.message}. Nothing was rolled back.` : e.stack}`);
    process.exitCode = 2;
  }
}
