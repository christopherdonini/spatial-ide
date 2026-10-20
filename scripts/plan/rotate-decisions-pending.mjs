#!/usr/bin/env node
// scripts/plan/rotate-decisions-pending.mjs — the ledger's monthly rotation (AUTONOMY.md §34). Run by the
// custodian at session start, right after rotate-cut-state.mjs; NO hook runs it.
//
// When due, it STAGES (never commits, pushes or fetches) a whole-file `git mv` of DECISIONS-PENDING.md to
// state/cut-archive/DECISIONS-PENDING-<YYYY-MM-DD>.md (machine clock, UTC; `-2`, `-3`, ... through B's
// archiveNameFor) and writes the new DECISIONS-PENDING.md: the title, the notice, `## Pending`, then each
// open unit copied verbatim with the archive line it came from. A unit is a RULED, DIRECTIVE, FELT VERDICTS
// or CLOSED block (archived) or a numbered entry (archived when its head carries a RULED, RESOLVED or
// APPLIED marker, or when --archive-entries names it; otherwise it stays). The archive blob must equal
// origin/main's DECISIONS-PENDING.md blob. Due: no archive was ever added, the newest one was added before
// this month's first at 00:00Z, or the file is over ROTATE_BYTES. Not due: one line, nothing written.
// Refused (exit 2) or too big for the cap (exit 3): nothing is written. --dry-run writes nothing and lists
// the kept units, the archived units and one obligation row per archived unit.
// Every git call is an argument array with a 64 MiB buffer.

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { LIVE_RULINGS } from './rulingSet.mjs';
import { loadPlan, PlanFileMissingError } from './plan.mjs';
import { archiveNameFor, noticeLine } from './rotate-cut-state.mjs';

export const ROTATE_BYTES = 153600;
const ARCHIVE_DIR = 'state/cut-archive';
const ARCHIVE_GLOB = `:(glob)${ARCHIVE_DIR}/DECISIONS-PENDING-*.md`;
const BLOCK_HEAD_RE = /^\*\*(RULED|DIRECTIVE|FELT VERDICTS|CLOSED) /;
const ENTRY_HEAD_RE = /^(\d+)\.\s*\*\*/;
const MARKED_RE = /^\d+\.\s*\*\*\[(RULED|RESOLVED|APPLIED)\b/;
const OBLIGATION_WORDS = ['owed', 'owes', 'waits', 'pending', 'held', 'until', 'before', 'next', 'follow-up', 'queued', 'later', 'not yet', 'deferred'];
const WORD_RES = OBLIGATION_WORDS.map((w) => [w, new RegExp(`(?<![A-Za-z0-9_-])${w}(?![A-Za-z0-9_-])`, 'i')]);

class Refusal extends Error {}
class Stop extends Error {} // raised once the move began: nothing is rolled back
class TooBig extends Error {}

/**
 * The units of the `## Pending` section (from the line after that heading to the next `## ` line): each
 * { kind: 'block'|'entry', label, number, line (the head's line, from 1), head, text }. Lines before the first
 * head are dropped; a unit's trailing blank lines are dropped, and so is an entry's earlier `Archived copy: ` line.
 */
export function parseUnits(text) {
  const lines = text.split('\n');
  const at = lines.findIndex((l) => l.trim() === '## Pending');
  if (at === -1) throw new Refusal('DECISIONS-PENDING.md has no "## Pending" heading');
  let end = lines.length;
  for (let i = at + 1; i < lines.length; i++) if (/^## /.test(lines[i])) { end = i; break; }
  const units = [];
  for (let i = at + 1; i < end; i++) {
    const block = BLOCK_HEAD_RE.exec(lines[i]);
    const entry = block ? null : ENTRY_HEAD_RE.exec(lines[i]);
    if (block || entry) units.push({ kind: block ? 'block' : 'entry', label: block?.[1] ?? null, number: entry ? Number(entry[1]) : null, line: i + 1, head: lines[i], body: [lines[i]] });
    else if (units.length) units.at(-1).body.push(lines[i]);
  }
  for (const u of units) {
    const body = u.kind === 'entry' ? u.body.filter((l, i) => i === 0 || !l.startsWith('Archived copy: ')) : u.body;
    while (body.length && body[body.length - 1].trim() === '') body.pop();
    u.text = body.join('\n');
    delete u.body;
  }
  return units;
}

/** { archive, why }: a block, a marked entry and an entry in `named` (a Set of numbers) are archived; every other entry stays. */
export function classify(unit, named = new Set()) {
  if (unit.kind === 'block') return { archive: true, why: `block ${unit.label}` };
  if (MARKED_RE.test(unit.head)) return { archive: true, why: 'marked entry' };
  if (named.has(unit.number)) return { archive: true, why: 'named entry' };
  return { archive: false, why: 'open entry' };
}

/** { due, reason, month }: `lastArchiveIso` is the newest archive commit's %cI (or null), `nowIso` anything Date takes. */
export function isDue({ lastArchiveIso, nowIso, sizeBytes }) {
  const d = new Date(nowIso);
  const month = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)).toISOString();
  if (sizeBytes > ROTATE_BYTES) return { due: true, reason: `the file is ${sizeBytes} bytes, over ${ROTATE_BYTES}`, month };
  if (!lastArchiveIso) return { due: true, reason: 'no archive was ever added', month };
  if (Date.parse(lastArchiveIso) < Date.parse(month)) return { due: true, reason: `the newest archive (${lastArchiveIso}) predates this month's first`, month };
  return { due: false, reason: `the newest archive was added ${lastArchiveIso}, this month began ${month}, the file is ${sizeBytes} bytes (rotates above ${ROTATE_BYTES})`, month };
}

/** The new file's exact text (LF, one final newline): title, notice, `## Pending`, then each kept unit and its archive line. */
export function buildLiveText({ kept, name, commit }) {
  const out = ['# Decisions pending the human', '', noticeLine(name, commit), '', '## Pending'];
  for (const u of kept) out.push('', u.text, '', `Archived copy: line ${u.line} of \`${ARCHIVE_DIR}/${name}\`.`);
  return out.join('\n') + '\n';
}

/** One row per archived unit: its kind, head, archive line, every PLAN node id it names as a whole word (with the status), and the obligation words it holds. */
export function obligationRows(archived, nodes) {
  const status = new Map(nodes.map((n) => [n.id, n.status]));
  return archived.map((u) => {
    const words = new Set(u.text.match(/[A-Za-z0-9_-]+/g) ?? []);
    return {
      kind: u.kind === 'block' ? u.label : `entry ${u.number}`,
      head: u.head.slice(0, 160),
      line: u.line,
      nodes: [...words].filter((w) => status.has(w)).map((w) => `${w} (${status.get(w)})`),
      flags: WORD_RES.filter(([, re]) => re.test(u.text)).map(([w]) => w),
    };
  });
}

function parseArgs(argv) {
  const args = { dryRun: false, named: new Set() };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--dry-run') args.dryRun = true;
    else if (argv[i] === '--archive-entries') {
      for (const n of String(argv[++i] ?? '').split(',')) {
        if (!/^\d+$/.test(n)) throw new Refusal(`--archive-entries takes a comma-separated list of entry numbers, not "${n}"`);
        args.named.add(Number(n));
      }
    } else throw new Refusal(`unknown argument: ${argv[i]}`);
  }
  return args;
}

function main(argv) {
  const args = parseArgs(argv);
  const run = (cmd, a, opts = {}) => {
    try {
      return execFileSync(cmd, a, { cwd: opts.cwd, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, input: opts.input, stdio: ['pipe', 'pipe', 'pipe'] }).replace(/\r?\n$/, '');
    } catch (e) {
      throw new Refusal(`git ${a.join(' ')} failed (${String(e.stderr ?? e.message).trim().split('\n')[0]})`);
    }
  };
  const root = run('git', ['rev-parse', '--show-toplevel'], { cwd: process.cwd() });
  const git = (a, input) => run('git', a, { cwd: root, input });

  if (git(['status', '--porcelain']).split('\n').some((l) => l.trim() !== '' && !l.startsWith('??') && !l.startsWith('!!'))) throw new Refusal('git status --porcelain shows a tracked change');
  const head = git(['rev-parse', 'HEAD']);
  if (head !== git(['rev-parse', '@{u}'])) throw new Refusal('HEAD is not equal to its upstream (@{u})');
  const blob = git(['rev-parse', `HEAD:${LIVE_RULINGS}`]);
  const P = git(['rev-parse', 'origin/main']);
  if (blob !== git(['rev-parse', `origin/main:${LIVE_RULINGS}`])) throw new Refusal(`${LIVE_RULINGS} at HEAD (${blob}) is not the blob on origin/main`);
  const oldText = git(['show', `HEAD:${LIVE_RULINGS}`]) + '\n';
  const units = parseUnits(oldText);
  for (const n of args.named) {
    if (!units.some((u) => u.kind === 'entry' && u.number === n && !classify(u).archive)) throw new Refusal(`--archive-entries ${n}: not an unmarked numbered entry at HEAD`);
  }

  const now = new Date();
  const due = isDue({ lastArchiveIso: git(['log', '-1', '--diff-filter=A', '--format=%cI', '--', ARCHIVE_GLOB]) || null, nowIso: now, sizeBytes: Number(git(['cat-file', '-s', `HEAD:${LIVE_RULINGS}`])) });
  if (!due.due) {
    console.log(`rotate-decisions-pending: not due — ${due.reason}.`);
    return 0;
  }

  const inTree = new Set(git(['ls-tree', '--name-only', 'HEAD', '--', `${ARCHIVE_DIR}/`]).split('\n'));
  // B's archiveNameFor names CUT-STATE-<date>[-n].md; this ledger's name is the same with the stem swapped.
  const stem = (n) => n.replace(/^CUT-STATE-/, 'DECISIONS-PENDING-');
  const name = archiveNameFor(now.toISOString().slice(0, 10), (n) => inTree.has(`${ARCHIVE_DIR}/${stem(n)}`) || fs.existsSync(path.join(root, ARCHIVE_DIR, stem(n))));
  if (name === null) throw new Refusal('every archive name for today up to -99 is taken');
  const archiveName = stem(name);
  const verdicts = units.map((u) => ({ u, ...classify(u, args.named) }));
  const kept = verdicts.filter((v) => !v.archive).map((v) => v.u);
  const archived = verdicts.filter((v) => v.archive);
  const next = buildLiveText({ kept, name: archiveName, commit: P });
  const bytes = Buffer.byteLength(next, 'utf8');

  if (args.dryRun) {
    let nodes = [];
    try { nodes = loadPlan(path.join(root, 'PLAN.yaml')).nodes; } catch (e) { if (!(e instanceof PlanFileMissingError)) throw new Refusal(`PLAN.yaml could not be loaded (${String(e.message).split('\n')[0]})`); }
    console.log(`rotate-decisions-pending: dry run — due: ${due.reason}. The archive would be ${ARCHIVE_DIR}/${archiveName}; P is ${P}.`);
    console.log(`kept (${kept.length}):`);
    for (const u of kept) console.log(`  ${u.number}  ${u.head.slice(0, 160)}  | Archived copy: line ${u.line}`);
    const byKind = {};
    for (const v of archived) byKind[v.why] = (byKind[v.why] ?? 0) + 1;
    console.log(`archived (${archived.length}): ${Object.entries(byKind).map(([k, n]) => `${k} x${n}`).join(', ')}`);
    console.log(`the new ${LIVE_RULINGS}: ${bytes} bytes, blob ${git(['hash-object', '--stdin'], next)}`);
    console.log(`obligation rows (${archived.length}):`);
    for (const r of obligationRows(archived.map((v) => v.u), nodes)) console.log(`  [${r.kind}] line ${r.line} | ${r.head} | nodes: ${r.nodes.join(', ') || 'none'} | flags: ${r.flags.join(', ') || 'none'}`);
  }
  if (bytes > ROTATE_BYTES) throw new TooBig(`rotate-decisions-pending: not rotating — the open entries alone make ${LIVE_RULINGS} ${bytes} bytes, over ${ROTATE_BYTES}; tell the human.`);
  if (args.dryRun) return 0;

  fs.mkdirSync(path.join(root, ARCHIVE_DIR), { recursive: true });
  let archivedBlob;
  try {
    git(['mv', LIVE_RULINGS, `${ARCHIVE_DIR}/${archiveName}`]);
    fs.writeFileSync(path.join(root, LIVE_RULINGS), next, 'utf8');
    git(['add', LIVE_RULINGS]);
    archivedBlob = git(['rev-parse', `:${ARCHIVE_DIR}/${archiveName}`]);
  } catch (e) {
    throw new Stop(e.message);
  }
  const original = git(['rev-parse', `${P}:${LIVE_RULINGS}`]);
  if (archivedBlob !== original) throw new Stop(`the staged archive blob ${archivedBlob} differs from ${LIVE_RULINGS} at ${P} (${original})`);
  console.log(`rotate-decisions-pending: due — ${due.reason}. Staged:\n${git(['diff', '--cached', '--name-status', '--no-renames'])}`);
  console.log(`archive blob ${archivedBlob} equals ${LIVE_RULINGS} at ${P} (${original}); the new file is ${bytes} bytes, ${kept.length} kept, ${archived.length} archived.`);
  console.log(`Next: run verify-cites, verify-quotes, verify-test-claims and verify --offline on this staged tree and on HEAD and compare; when equal, git commit -s -m "chore: rotate DECISIONS-PENDING.md to ${ARCHIVE_DIR}/${archiveName}" and push; when they differ, restore the index and both paths from HEAD, commit nothing, and tell the human.`);
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    process.exitCode = main(process.argv.slice(2));
  } catch (e) {
    if (e instanceof TooBig) { console.error(e.message); process.exitCode = 3; }
    else {
      console.error(`rotate-decisions-pending: ${e instanceof Refusal ? `refusing — ${e.message}. Nothing was written.` : e instanceof Stop ? `STOP — ${e.message}. Nothing was rolled back.` : e.stack}`);
      process.exitCode = 2;
    }
  }
}
