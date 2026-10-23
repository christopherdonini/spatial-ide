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

// --- Round + item resolution (VERIFY-QUOTES-ROUND-ITEM-CITES-PREREGISTRATION.md §2.3 and §2.6). ---
// Constants, declared at their site (the form's §7). A RULED block header: `**RULED <date>`, an optional parenthetical, ` — `, an
// optional `question `, then `round N` or `rounds N and M`.
const RULED_BLOCK_HEADER_RE = /^\*\*RULED \d{4}-\d{2}-\d{2}(?: \([^)]*\))? — (?:question )?(?:round (\d+)|rounds (\d+) and (\d+))(?![0-9])/;
// An item line inside a block: `- *Item M` (single asterisk) or `- **Item M` (bold).
const RULED_ITEM_LINE_RE = /^- \*{1,2}Item (\d+)(?![0-9])/;
// The next line that closes a block's own span.
const RULED_BLOCK_BOUNDARY_RE = /^(\*\*|## )/;
// An item line of a mirrored question file: `M. `.
const QUESTION_FILE_ITEM_RE = /^(\d+)\. /;

// One parse per distinct text for the life of the process: a run resolves hundreds of cites against the same few texts.
const rulingBlocksCache = new Map();
function rulingBlocks(text) {
  const cached = rulingBlocksCache.get(text);
  if (cached) return cached;
  const blocks = [];
  let cur = null;
  for (const line of text.split('\n')) {
    if (RULED_BLOCK_BOUNDARY_RE.test(line)) {
      const m = RULED_BLOCK_HEADER_RE.exec(line);
      cur = m ? { rounds: m[1] !== undefined ? [Number(m[1])] : [Number(m[2]), Number(m[3])], items: new Set() } : null;
      if (cur) blocks.push(cur);
      continue;
    }
    const im = cur && RULED_ITEM_LINE_RE.exec(line);
    if (im) cur.items.add(Number(im[1]));
  }
  rulingBlocksCache.set(text, blocks);
  return blocks;
}

function questionFileHasItem(text, item) {
  return text.split('\n').some((l) => {
    const m = QUESTION_FILE_ITEM_RE.exec(l);
    return m && Number(m[1]) === item;
  });
}

/**
 * `round N, item M` against the ruling set: `texts` is one text per file of the set, each resolved on its own (nothing is joined across
 * files). A block with item lines decides by them; a block with none decides by `roundFileText`, the tracked `state/questions/round-N.md`
 * text or null. Returns { ok: true } or { ok: false, reason }, the reason stating what this resolver found.
 */
export function resolveRoundItem(texts, round, item, roundFileText) {
  let reason = null;
  for (const text of texts) {
    for (const block of rulingBlocks(text)) {
      if (!block.rounds.includes(round)) continue;
      if (block.items.size > 0) {
        if (block.items.has(item)) return { ok: true };
        reason ??= `question round ${round}'s RULED block has no item ${item}`;
      } else if (roundFileText == null) {
        reason ??= `question round ${round}'s RULED block has no item lines, and state/questions/round-${round}.md is not tracked`;
      } else if (questionFileHasItem(roundFileText, item)) {
        return { ok: true };
      } else {
        reason ??= `question round ${round}'s RULED block has no item lines, and state/questions/round-${round}.md has no item ${item}`;
      }
    }
  }
  return { ok: false, reason: reason ?? `no RULED block for question round ${round} in any file of the ruling set` };
}
