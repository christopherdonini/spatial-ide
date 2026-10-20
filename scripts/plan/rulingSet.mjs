// scripts/plan/rulingSet.mjs — the ruling set: the live DECISIONS-PENDING.md, then every tracked
// state/cut-archive/DECISIONS-PENDING-*.md (AUTONOMY.md §34). The archives are listed through git, never from
// the folder on disk, in ascending code-unit order; a git failure throws and never narrows the set.
// A reader resolves a record inside ONE file of the set at a time; nothing here joins two files.
// Node's standard library only.

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

export const LIVE_RULINGS = 'DECISIONS-PENDING.md';
// The directive's glob taken literally: the folder itself, no subfolders.
export const ARCHIVE_RULINGS_RE = /^state\/cut-archive\/DECISIONS-PENDING-[^/]*\.md$/;

/** Pure: [LIVE_RULINGS, ...the matching paths of `tracked`], the archives in ascending code-unit order. */
export function rulingSetPaths(tracked) {
  return [LIVE_RULINGS, ...[...new Set(tracked)].filter((p) => ARCHIVE_RULINGS_RE.test(p)).sort()];
}

/** Every tracked path (`git ls-files -z`). Any git failure throws. */
export function trackedPaths(repoRoot) {
  const out = execFileSync('git', ['ls-files', '-z'], { cwd: repoRoot, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] });
  return out.split('\0').filter(Boolean);
}

/**
 * [{ path, text }] for the set, read from the working tree. The live file is skipped when it does not
 * exist (as each reader treated it before); a tracked archive missing from disk throws.
 */
export function readRulingSet(repoRoot, tracked = trackedPaths(repoRoot)) {
  const out = [];
  for (const p of rulingSetPaths(tracked)) {
    const abs = path.join(repoRoot, p);
    if (p === LIVE_RULINGS && !fs.existsSync(abs)) continue;
    out.push({ path: p, text: fs.readFileSync(abs, 'utf8') });
  }
  return out;
}
