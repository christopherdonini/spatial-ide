#!/usr/bin/env node
// scripts/hooks/precompact-flush.mjs — the PreCompact hook (AUTONOMY.md §7).
//
// Verified PreCompact contract (Appendix B, quoted in scripts/hooks/README.md): matchers `manual`
// (/compact) and `auto` (the auto-compact window); receives `trigger` and `custom_instructions`
// on stdin; "Exit with code 2 to block compaction. For a manual /compact, the stderr message is
// shown to the user. You can also block by returning JSON with 'decision': 'block'." Blocking a
// proactive automatic compaction skips it (conversation continues uncompacted); blocking one
// recovering from a context-limit error makes the current request fail — hence the second-chance
// window below, so a context-limit recovery is never blocked twice.
//
// PATHS (human's second directive, item 17): the ledger now lives at state/CUT-STATE.md (tracked
// on main since a40ccfe/252585b); nothing here reads the old root-level path.
//
// Fresh (§7): state/CUT-STATE.md's SESSION-CONTINUITY block carries `flushed_at` within the last
// 20 minutes AND `tip` equal to the current HEAD AND `git status --porcelain` shows no modified
// tracked file AND HEAD is pushed (`git rev-parse @{u}` resolves and matches HEAD). Fresh -> allow.
// Stale -> block once, recording .claude/state/precompact-<session_id>.json; a second PreCompact
// within 15 minutes of that record is allowed whatever the freshness.
//
// Never throws to the shell: any unexpected error is caught and treated as allow, noted on stderr.

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export const FLUSH_FRESHNESS_MS = 20 * 60 * 1000; // §7: "flushed_at within the last 20 minutes"
export const SECOND_CHANCE_WINDOW_MS = 15 * 60 * 1000; // §7: "a second PreCompact within 15 minutes is allowed"

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
    return { fresh: false, reason: 'flushed_at is more than 20 minutes old' };
  }

  const head = git(['rev-parse', 'HEAD']);
  if (head === null || head !== parsed.tip) {
    return { fresh: false, reason: `tip (${parsed.tip}) does not match HEAD (${head ?? 'unknown'})` };
  }

  const status = git(['status', '--porcelain']);
  if (status === null) return { fresh: false, reason: 'git status --porcelain failed' };
  if (status.trim() !== '') {
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

/** The decision core, injectable for tests (see checkFreshness's own `git` parameter). */
export function decidePrecompact(input, { projectRoot, now = new Date(), git } = {}) {
  const sessionId = input.session_id ?? 'unknown-session';
  const recordPath = statePath(projectRoot, sessionId);
  const state = readJson(recordPath, { lastBlockedAt: null });

  if (state.lastBlockedAt) {
    const elapsed = now.getTime() - new Date(state.lastBlockedAt).getTime();
    if (elapsed >= 0 && elapsed < SECOND_CHANCE_WINDOW_MS) {
      return {
        decision: 'allow',
        stderr: 'allow: second PreCompact within 15 minutes of the last block — never blocked twice.',
      };
    }
  }

  const freshness = checkFreshness(projectRoot, { now, ...(git ? { git } : {}) });
  if (freshness.fresh) {
    return { decision: 'allow', stderr: 'allow: state/CUT-STATE.md SESSION-CONTINUITY block is fresh.' };
  }

  writeJson(recordPath, { lastBlockedAt: now.toISOString() });
  return { decision: 'block', reason: BLOCK_REASON, stderr: `block: ${freshness.reason}` };
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
    // Appendix B: "Exit with code 2 to block compaction. For a manual /compact, the stderr
    // message is shown to the user." No documented JSON "reason" field for PreCompact.
    console.error(result.reason);
    process.exit(2);
    return;
  }
  process.exit(0);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
