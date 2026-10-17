#!/usr/bin/env node
// scripts/plan/rotate-cut-state.mjs — the ledger's weekly rotation (AUTONOMY.md, the cap-and-rotation
// section). Run by the custodian at session start, from main level with origin; NO hook runs it.
//
// When due, it STAGES (never commits, pushes or fetches) a whole-file `git mv` of state/CUT-STATE.md to
// state/cut-archive/CUT-STATE-<YYYY-MM-DD>.md (machine clock, UTC; `-2`, `-3`, ... against HEAD's tree and
// the disk, nothing overwritten), writes the new state/CUT-STATE.md (the continuity block, a Previous
// ledger line, the notice, `## Ledger`) and checks the archive's blob equals HEAD's ledger blob.
// Due: no archive was ever added, the newest one was added before this week's Monday 00:00Z, or the ledger
// is over ROTATE_BYTES. Not due, or refused (exit 2): it writes nothing. The block's flushed_at and tip are
// carried over unchanged, so the rotation commit reads stale until the custodian's ledger-only flush.
// Every git call is an argument array with a 64 MiB buffer.

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { blockSizes, BLOCK_CAP_BYTES, BLOCK_HEADING } from '../hooks/flush.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(here, '..', '..');
export const ROTATE_BYTES = 153600;
const LEDGER = 'state/CUT-STATE.md';
const ARCHIVE_DIR = 'state/cut-archive';
const ARCHIVE_GLOB = `:(glob)${ARCHIVE_DIR}/CUT-STATE-[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]*.md`;
const NOTICE_START = 'Line references written before the rotation point into ';

class Refusal extends Error {}
class Stop extends Error {} // raised once the move began: nothing is rolled back

/** { due, reason, monday }: `lastArchiveAt` is the newest archive commit's %cI (or null), `now` a Date or ms. */
export function isDue({ lastArchiveAt, now, ledgerBytes }) {
  const d = new Date(now);
  const monday = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - ((d.getUTCDay() + 6) % 7))).toISOString();
  if (ledgerBytes > ROTATE_BYTES) return { due: true, reason: `the ledger is ${ledgerBytes} bytes, over ${ROTATE_BYTES}`, monday };
  if (!lastArchiveAt) return { due: true, reason: 'no archive was ever added', monday };
  if (Date.parse(lastArchiveAt) < Date.parse(monday)) return { due: true, reason: `the newest archive (${lastArchiveAt}) predates this week's Monday`, monday };
  return { due: false, reason: `the newest archive was added ${lastArchiveAt}, this week began ${monday}, the ledger is ${ledgerBytes} bytes (rotates above ${ROTATE_BYTES})`, monday };
}

/** CUT-STATE-<date>.md, then -2, -3, ... -99; `taken(name)` says whether a name is in use. null past -99. */
export function archiveNameFor(date, taken) {
  for (let n = 1; n <= 99; n++) {
    const name = n === 1 ? `CUT-STATE-${date}.md` : `CUT-STATE-${date}-${n}.md`;
    if (!taken(name)) return name;
  }
  return null;
}

/** The one-line notice; `commit` is the last commit at which the live path held the archived bytes. */
export function noticeLine(name, commit) {
  return `${NOTICE_START}${ARCHIVE_DIR}/${name} at ${commit}.`;
}

/** The new ledger's exact text (LF, one final newline), built from the old ledger `oldText` at `commit`. */
export function buildRotatedLedger({ oldText, name, commit }) {
  const lines = oldText.split(/\r\n|\r|\n/);
  const start = lines.findIndex((l) => l.trim() === BLOCK_HEADING);
  if (start === -1 || !lines.some((l) => /^## Ledger\s*$/.test(l))) throw new Refusal('the ledger has no SESSION-CONTINUITY block or no "## Ledger" heading');
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) if (/^#{1,6}\s/.test(lines[i])) { end = i; break; }
  const body = lines.slice(start + 1, end);
  const previous = body.find((l) => /^Previous ledger:/.test(l));
  const kept = body.filter((l) => !/^Previous ledger:/.test(l) && !l.startsWith(NOTICE_START));
  while (kept.length && kept[kept.length - 1].trim() === '') kept.pop();
  const before = previous && /`([^`]+)`/.exec(previous);
  const prev = `Previous ledger: \`${ARCHIVE_DIR}/${name}\` (archived byte-identical by \`git mv\` from \`${LEDGER}\` at ${commit}).` +
    (before ? ` Before it: \`${before[1]}\`.` : '');
  return [BLOCK_HEADING, ...kept, '', prev, '', noticeLine(name, commit), '', '## Ledger', ''].join('\n');
}

function main(argv) {
  let root = REPO_ROOT;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--root' && argv[i + 1]) root = path.resolve(argv[++i]);
    else throw new Refusal(`unknown argument: ${argv[i]}`);
  }
  const git = (args) => {
    try {
      return execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] }).replace(/\r?\n$/, '');
    } catch (e) {
      throw new Refusal(`git ${args.join(' ')} failed (${String(e.stderr ?? e.message).trim().split('\n')[0]})`);
    }
  };

  const branch = git(['rev-parse', '--abbrev-ref', 'HEAD']);
  if (branch !== 'main') throw new Refusal(`the current branch is "${branch}", not main`);
  if (git(['status', '--porcelain']).split('\n').some((l) => l.trim() !== '' && !l.startsWith('??') && !l.startsWith('!!'))) throw new Refusal('git status --porcelain shows a tracked change');
  const head = git(['rev-parse', 'HEAD']);
  if (head !== git(['rev-parse', '@{u}'])) throw new Refusal('HEAD is not equal to its upstream (@{u})');

  const now = new Date();
  const due = isDue({
    lastArchiveAt: git(['log', '-1', '--diff-filter=A', '--format=%cI', '--', ARCHIVE_GLOB]) || null,
    now,
    ledgerBytes: Number(git(['cat-file', '-s', `HEAD:${LEDGER}`])),
  });
  if (!due.due) {
    console.log(`rotate-cut-state: not due — ${due.reason}.`);
    return;
  }

  const oldText = git(['show', `HEAD:${LEDGER}`]) + '\n';
  const inTree = new Set(git(['ls-tree', '--name-only', 'HEAD', '--', `${ARCHIVE_DIR}/`]).split('\n'));
  const name = archiveNameFor(now.toISOString().slice(0, 10), (n) => inTree.has(`${ARCHIVE_DIR}/${n}`) || fs.existsSync(path.join(root, ARCHIVE_DIR, n)));
  if (name === null) throw new Refusal('every archive name for today up to -99 is taken');
  const next = buildRotatedLedger({ oldText, name, commit: head });
  const sizes = blockSizes(next);
  if (sizes.blockBytes > BLOCK_CAP_BYTES) throw new Refusal(`the new SESSION-CONTINUITY block would be ${sizes.blockBytes} bytes (UTF-8), over the cap of ${BLOCK_CAP_BYTES}; shrink the block with a flush first`);

  fs.mkdirSync(path.join(root, ARCHIVE_DIR), { recursive: true });
  let archived;
  const original = git(['rev-parse', `${head}:${LEDGER}`]);
  try {
    git(['mv', LEDGER, `${ARCHIVE_DIR}/${name}`]);
    fs.writeFileSync(path.join(root, LEDGER), next, 'utf8');
    git(['add', LEDGER]);
    archived = git(['rev-parse', `:${ARCHIVE_DIR}/${name}`]);
  } catch (e) {
    throw new Stop(e.message);
  }
  if (archived !== original) throw new Stop(`the staged archive blob ${archived} differs from ${LEDGER} at ${head} (${original})`);

  console.log(`rotate-cut-state: due — ${due.reason}. Staged:\n${git(['diff', '--cached', '--name-status', '--no-renames'])}`);
  console.log(`archive blob ${archived} equals ${LEDGER} at ${head} (${original}); the new block is ${sizes.blockBytes} bytes.`);
  console.log(`Next: git commit -s -m "chore: rotate the ledger to ${ARCHIVE_DIR}/${name}", push, then a ledger-only flush commit with scripts/hooks/flush.mjs, push.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    main(process.argv.slice(2));
  } catch (e) {
    const text = e instanceof Refusal ? `refusing — ${e.message}. Nothing was written.` : e instanceof Stop ? `STOP — ${e.message}. Nothing was rolled back.` : e.stack;
    console.error(`rotate-cut-state: ${text}`);
    process.exitCode = 2;
  }
}
