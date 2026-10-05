#!/usr/bin/env node
// scripts/hooks/precompact-flush.mjs — the PreCompact hook (AUTONOMY.md §7).
//
// The hook receives `trigger` and `custom_instructions` on stdin (Appendix B). Exit code 2 blocks
// the compaction; any other exit lets it through. One rule, on every platform:
//   - `trigger` is `manual` (a /compact): a stale ledger blocks once and records
//     .claude/state/precompact-<session_id>.json; a second call within 15 minutes of that record is
//     allowed whatever the freshness. A fresh ledger is allowed.
//   - any other `trigger`, or none (an automatic compaction): judged for freshness, recorded, and
//     always allowed. It never blocks, and it neither reads nor writes the block record above.
// Every call that reaches the decision appends one line to .claude/state/precompact-<session_id>.jsonl
// (at, trigger, decision, reason, flushed_at). A line that cannot be written leaves the decision as is.
//
// PATHS (human's second directive, item 17): the ledger now lives at state/CUT-STATE.md (tracked
// on main since a40ccfe/252585b); nothing here reads the old root-level path.
//
// Fresh (§7, tightened 2026-09-15 on the human's word): state/CUT-STATE.md's SESSION-CONTINUITY
// block carries `flushed_at` within the last 10 minutes AND `flushed_at` at or after the last
// ledger change below the flush commit (hash equality alone is not freshness -- a block whose tip
// lines up but whose timestamp predates the newest ledger change is stale) AND `tip` equal to the
// current HEAD (or to HEAD's parent when HEAD is a ledger-only flush commit -- the one commit that
// cannot cite its own hash) AND `git status --porcelain` shows no modified tracked file AND HEAD is
// pushed (`git rev-parse @{u}` resolves and matches HEAD).
//
// Never throws to the shell: any unexpected error is caught and treated as allow, noted on stderr.

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { isCloudSession } from './cloud.mjs';

export const FLUSH_FRESHNESS_MS = 10 * 60 * 1000; // §7, tightened 2026-09-15: "within the last 10 minutes"
export const SECOND_CHANCE_WINDOW_MS = 15 * 60 * 1000; // §7, paraphrased: a second manual PreCompact within 15 minutes is allowed

export const BLOCK_REASON =
  "PRE-COMPACTION FLUSH REQUIRED — write state/CUT-STATE.md's SESSION-CONTINUITY block (position, " +
  'tip hash, half-made judgments, hypotheses, intended sequencing, unreported findings, in-flight ' +
  'gate states), commit, verify porcelain, push; then compact.';

function resolveProjectRoot(input) {
  return process.env.CLAUDE_PROJECT_DIR || input?.cwd || process.cwd();
}

function cutStatePath(projectRoot) {
  return path.join(projectRoot, 'state', 'CUT-STATE.md'); // item 17: relocated from the repo root
}

function tryGit(args, cwd) {
  try {
    return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return null;
  }
}

/**
 * The block format (item 8's own words): "a fenced section starting with the line
 * `## SESSION-CONTINUITY` followed by `flushed_at: <ISO-8601 UTC>` and `tip: <sha>` lines."
 */
export function parseSessionContinuity(text) {
  const lines = text.split(/\r\n|\r|\n/);
  const idx = lines.findIndex((l) => l.trim() === '## SESSION-CONTINUITY');
  if (idx === -1) return null;
  let end = lines.length;
  let flushedAt = null;
  let tip = null;
  for (let i = idx + 1; i < lines.length; i++) {
    if (/^#{1,6}\s/.test(lines[i])) {
      end = i;
      break;
    }
    const fm = lines[i].match(/^flushed_at:\s*(.+)$/);
    if (fm) flushedAt = fm[1].trim();
    const tm = lines[i].match(/^tip:\s*(.+)$/);
    if (tm) tip = tm[1].trim();
  }
  return { flushedAt, tip, block: lines.slice(idx, end).join('\n').trim() };
}

/**
 * Returns { fresh: true } or { fresh: false, reason }.
 *
 * `git(args)` defaults to running the real git binary against `projectRoot`; tests inject a fake
 * to exercise the "fresh" branch without needing a commit whose own tracked content states its
 * own resulting hash — which no commit can do (its hash is computed FROM that content).
 */
export function checkFreshness(projectRoot, { now = new Date(), git = (args) => tryGit(args, projectRoot) } = {}) {
  const p = cutStatePath(projectRoot);
  if (!fs.existsSync(p)) return { fresh: false, reason: `${p} does not exist` };

  let text;
  try {
    text = fs.readFileSync(p, 'utf8');
  } catch (e) {
    return { fresh: false, reason: `could not read ${p} (${e.message})` };
  }

  const parsed = parseSessionContinuity(text);
  if (!parsed || !parsed.flushedAt || !parsed.tip) {
    return { fresh: false, reason: 'no SESSION-CONTINUITY block with both flushed_at and tip' };
  }

  const flushedDate = new Date(parsed.flushedAt);
  if (Number.isNaN(flushedDate.getTime())) {
    return { fresh: false, reason: `flushed_at "${parsed.flushedAt}" is not a valid ISO-8601 timestamp` };
  }
  if (now.getTime() - flushedDate.getTime() > FLUSH_FRESHNESS_MS) {
    return { fresh: false, reason: 'flushed_at is more than 10 minutes old' };
  }

  // Hash equality alone is not freshness (the human, 2026-09-15). The block must also have been
  // WRITTEN at or after the most recent ledger change it is meant to summarize. The flush commit is
  // HEAD (the block cites HEAD, or HEAD^ for the ledger-only convention handled below), so "the last
  // ledger change" is the newest commit BELOW HEAD that touched state/CUT-STATE.md; flushed_at must
  // not predate it. When it cannot be read -- no prior ledger history, a shallow clone -- the
  // sub-check is skipped (an unknown last-change is not grounds to block a real flush).
  const lastLedgerChange = git(['log', '-1', '--format=%cI', 'HEAD~1', '--', 'state/CUT-STATE.md']);
  if (lastLedgerChange) {
    const ledgerDate = new Date(lastLedgerChange);
    if (!Number.isNaN(ledgerDate.getTime()) && flushedDate.getTime() < ledgerDate.getTime()) {
      return {
        fresh: false,
        reason: `flushed_at (${parsed.flushedAt}) predates the last ledger change (${lastLedgerChange}) -- re-flush after the latest state change`,
      };
    }
  }

  const head = git(['rev-parse', 'HEAD']);
  if (head === null) {
    return { fresh: false, reason: 'HEAD is unknown (git rev-parse HEAD failed)' };
  }
  if (head !== parsed.tip) {
    // The flush commit is the one commit that cannot cite its own hash (its content is fixed
    // before the hash exists), so a block may cite the flush commit's PARENT -- accepted only
    // when HEAD changes nothing but the ledger itself. Any other mismatch is stale (the human,
    // 2026-09-14: "the flush's tip field must be the literal HEAD hash, not a description, so
    // the PreCompact comparison is exact").
    const parent = git(['rev-parse', 'HEAD^']);
    const changed = git(['diff', '--name-only', 'HEAD^', 'HEAD']);
    const files = changed === null ? null : changed.split(/\r?\n/).map((f) => f.trim()).filter(Boolean);
    const onlyLedger = files !== null && files.length > 0 && files.every((f) => f === 'state/CUT-STATE.md');
    if (!(parent !== null && parent === parsed.tip && onlyLedger)) {
      return { fresh: false, reason: `tip (${parsed.tip}) does not match HEAD (${head}) and is not the parent of a ledger-only flush commit` };
    }
  }

  const status = git(['status', '--porcelain']);
  if (status === null) return { fresh: false, reason: 'git status --porcelain failed' };
  // Only TRACKED changes make the tree dirty for this purpose: untracked paths (porcelain `??`,
  // e.g. the drafts directory kept out of the repository by design) never block a compaction.
  const dirtyTracked = status.split(/\r?\n/).filter((l) => l.trim() !== '' && !l.startsWith('??'));
  if (dirtyTracked.length > 0) {
    return { fresh: false, reason: 'git status --porcelain shows a modified tracked file' };
  }

  const upstream = git(['rev-parse', '@{u}']);
  if (upstream === null) return { fresh: false, reason: 'HEAD has no upstream (@{u} does not resolve)' };
  // "Pushed" means HEAD is reachable from its upstream -- an ancestor of it, or equal to it --
  // not that the two hashes are literally equal. Equality would wrongly call HEAD "not pushed"
  // whenever the remote branch has moved further ahead from someone else's later push (reviewer
  // finding 7). `--is-ancestor` treats a commit as its own ancestor, so an exact match still passes.
  const reachable = git(['merge-base', '--is-ancestor', 'HEAD', '@{u}']);
  if (reachable === null) return { fresh: false, reason: 'HEAD is not pushed (not reachable from @{u})' };

  return { fresh: true };
}

function statePath(projectRoot, sessionId) {
  return path.join(projectRoot, '.claude', 'state', `precompact-${sessionId}.json`);
}

function readJson(p, fallback) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return fallback;
  }
}

function writeJson(p, obj) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(obj, null, 2), 'utf8');
}

function recordLogPath(projectRoot, sessionId) {
  return path.join(projectRoot, '.claude', 'state', `precompact-${sessionId}.jsonl`);
}

// The block's flushed_at as the ledger states it, else null (any failure).
function readFlushedAt(projectRoot) {
  try {
    const parsed = parseSessionContinuity(fs.readFileSync(cutStatePath(projectRoot), 'utf8'));
    return parsed?.flushedAt ?? null;
  } catch {
    return null;
  }
}

// Appends one record line (field order fixed). Its own try/catch: a failure is a stderr line, never
// a change of decision.
function appendRecord(projectRoot, sessionId, now, input, decision, reason) {
  try {
    const line = JSON.stringify({
      at: now.toISOString(),
      trigger: typeof input.trigger === 'string' ? input.trigger : null,
      decision,
      reason,
      flushed_at: readFlushedAt(projectRoot),
    });
    const p = recordLogPath(projectRoot, sessionId);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.appendFileSync(p, `${line}\n`, 'utf8');
    return null;
  } catch (e) {
    return `precompact-flush: could not append the record line (${e.message}); the decision stands.`;
  }
}

function withNote(stderr, note) {
  return note ? `${stderr}\n${note}` : stderr;
}

/** The decision core, injectable for tests (see checkFreshness's own `git` parameter). */
export function decidePrecompact(input, { projectRoot, now = new Date(), git } = {}) {
  const sessionId = input.session_id ?? 'unknown-session';

  if (input.trigger !== 'manual') {
    const judged = checkFreshness(projectRoot, { now, ...(git ? { git } : {}) });
    if (judged.fresh) {
      const note = appendRecord(projectRoot, sessionId, now, input, 'allowed-fresh', null);
      return { decision: 'allow', stderr: withNote('allow: state/CUT-STATE.md SESSION-CONTINUITY block is fresh.', note) };
    }
    const note = appendRecord(projectRoot, sessionId, now, input, 'recorded-only', judged.reason);
    return {
      decision: 'allow',
      stderr: withNote(`allow: automatic compaction recorded, never blocked (${judged.reason}).`, note),
    };
  }

  const recordPath = statePath(projectRoot, sessionId);
  const state = readJson(recordPath, { lastBlockedAt: null });

  if (state.lastBlockedAt) {
    const elapsed = now.getTime() - new Date(state.lastBlockedAt).getTime();
    if (elapsed >= 0 && elapsed < SECOND_CHANCE_WINDOW_MS) {
      const note = appendRecord(projectRoot, sessionId, now, input, 'allowed-second-chance', null);
      return {
        decision: 'allow',
        stderr: withNote('allow: second PreCompact within 15 minutes of the last block — never blocked twice.', note),
      };
    }
  }

  const freshness = checkFreshness(projectRoot, { now, ...(git ? { git } : {}) });
  if (freshness.fresh) {
    const note = appendRecord(projectRoot, sessionId, now, input, 'allowed-fresh', null);
    return { decision: 'allow', stderr: withNote('allow: state/CUT-STATE.md SESSION-CONTINUITY block is fresh.', note) };
  }

  writeJson(recordPath, { lastBlockedAt: now.toISOString() });
  const note = appendRecord(projectRoot, sessionId, now, input, 'blocked', freshness.reason);
  return { decision: 'block', reason: BLOCK_REASON, stderr: withNote(`block: ${freshness.reason}`, note) };
}

function readStdin() {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (c) => (data += c));
    process.stdin.on('end', () => resolve(data));
    process.stdin.on('error', () => resolve(data));
  });
}

async function main() {
  let input = {};
  try {
    const raw = await readStdin();
    input = raw.trim() ? JSON.parse(raw) : {};
  } catch (e) {
    console.error(`precompact-flush: could not parse stdin JSON (${e.message}); allowing.`);
    process.exit(0);
    return;
  }

  const projectRoot = resolveProjectRoot(input);
  let result;
  try {
    result = decidePrecompact(input, { projectRoot });
  } catch (e) {
    console.error(`precompact-flush: unexpected error (${e.message}); allowing.`);
    process.exit(0);
    return;
  }

  if (result.stderr) console.error(result.stderr);
  if (result.decision === 'block') {
    // Exit code 2 blocks; for a manual /compact the stderr message is shown to the user.
    console.error(result.reason);
    process.exit(2);
    return;
  }
  process.exit(0);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (isCloudSession()) process.exit(0); // the custodian's hook, inert in a cloud session (cloud.mjs)
  main();
}
