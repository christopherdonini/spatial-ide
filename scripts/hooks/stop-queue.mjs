#!/usr/bin/env node
// scripts/hooks/stop-queue.mjs — the Stop hook (AUTONOMY.md §3, extended by the human's second
// directive items 16b and 18).
//
// Verified Stop-hook contract, quoted in scripts/hooks/README.md from Appendix B: the hook
// receives `session_id`, `cwd`, `hook_event_name`, `stop_hook_active`, `last_assistant_message`,
// `background_tasks`, `session_crons` on stdin; blocks the stop by printing
// `{"decision":"block","reason":"…"}` on stdout (exit 0); Claude Code itself ends the turn after
// 8 consecutive blocks (CLAUDE_CODE_STOP_HOOK_BLOCK_CAP raises it — never changed here).
//
// Decision, in order (§3, with §18's HALT switch, §24's lease check and the stale-continuity
// step of STOP-HOOK-STALE-CONTINUITY-PREREGISTRATION.md ahead of the background-tasks allow):
//   1. Override: CUSTODIAN_STOP_HOOK=off in the environment, or state/CUSTODIAN-HALT locally or on
//      origin/main -> allow, reason on stderr (the first line of the HALT file for the halt case).
//      The origin/main probe runs on every stop that reaches this step, background-task stops
//      included (at most 5 s, cached 60 s).
//   2. Lease check (§24): read CUSTODIAN-LEASE at projectRoot. Unless its first line is an active
//      lease line whose id equals the stdin session_id, allow; the stderr reason names which case
//      applied (absent, relinquished, another session's lease, or no session_id). A read error is
//      treated as absent.
//   3. Continuity: judged from git alone, never from the working tree. The block is stale when the
//      newest commit on HEAD that touches state/CUT-STATE.md leaves the block's flushed_at as its
//      first parent had it. Stale -> the shared accounting below (HEAD change is its progress
//      signal; at either cap -> allow), otherwise block with the continuity reason. Git unreadable
//      -> one stderr line, and the step passes (fail open).
//   4. background_tasks non-empty -> allow (paused for background work, not done).
//   5. Derive the ready set live from PLAN.yaml (never trust the committed queue file).
//   6. Ready set empty, or only human-blocked nodes remain -> allow; stderr names the
//      waiting-on-human count; (item 16b) sends one Telegram message listing the waiting items,
//      deduped on a hash of the waiting set.
//   7. Continuation accounting, shared with step 3: consecutive resets to 0 when progress is
//      observed (HEAD changed since the last block; on the queue path, or the plan hash); session
//      cap 6 consecutive (under Claude Code's own 8); daily cap 40 across sessions. At either cap
//      -> allow, reason on stderr.
//   8. Otherwise -> block, with the reason text below. Past 75% of the daily cap, the ready set
//      is reordered smallFirst and spikes/measurement-lane nodes are deferred (§10).
//
// Never throws to the shell: any unexpected error is caught and treated as "allow", with a note
// on stderr. Exits 0 with JSON on stdout only when it decides to block.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { isCloudSession } from './cloud.mjs';
import { parseSessionContinuity } from './precompact-flush.mjs';
import { loadPlan, deriveStates, PlanFileMissingError } from '../plan/plan.mjs';
import { sendTelegramDeduped } from './telegram.mjs';

// Declared constants, with their reason clauses (§3, §10, §18).
export const SESSION_CONSECUTIVE_CAP = 6; // "under Claude Code's own 8" -- stays a margin below Code's own override.
export const DAILY_CONTINUATION_CAP = 40; // "daily cap DAILY_CONTINUATION_CAP = 40 across sessions"
export const NEAR_DAILY_CAP_RATIO = 0.75; // "past 75% of the daily cap: prefer small nodes; defer spikes"
export const HALT_FETCH_TIMEOUT_MS = 5000; // "run git fetch --quiet origin main with a 5-second timeout"
export const HALT_CACHE_TTL_MS = 60 * 1000; // reviewer finding 17: cache the origin/main probe so every stop does not fetch
export const TELEGRAM_DEDUPE_WINDOW_MS = 10 * 60 * 1000; // "deduped on a hash of the waiting set" within 10 minutes

// The continuity step's declared values (the stale-continuity form's section 7). Module-local.
const CONTINUITY_GIT_TIMEOUT_MS = 2000; // per git call; the stale path makes four (the log, two shows, the rev-parse): 4 x 2 s plus HALT's 5 s fetch is 13 s, under the Stop entry's 20 s
const CONTINUITY_GIT_MAX_BUFFER = 64 * 1024 * 1024; // bounds the ledger blob read; guards against the ledger growing past execFileSync's 1 MiB default (the form's I6)
const LEDGER_PATHSPEC = 'state/CUT-STATE.md';

function firstLineOf(text) {
  const line = (text ?? '').split(/\r\n|\r|\n/)[0] ?? '';
  return line.trim();
}

function resolveProjectRoot(input) {
  return process.env.CLAUDE_PROJECT_DIR || input?.cwd || process.cwd();
}

function resolvePlanPath(projectRoot) {
  return process.env.CUSTODIAN_PLAN_PATH || path.join(projectRoot, 'PLAN.yaml');
}

function tryGit(args, cwd, opts = {}) {
  try {
    return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], ...opts }).trim();
  } catch {
    return null;
  }
}

function haltCachePath(projectRoot) {
  return path.join(projectRoot, '.claude', 'state', 'halt-probe-cache.json');
}

function readHaltCache(projectRoot, now) {
  try {
    const raw = JSON.parse(fs.readFileSync(haltCachePath(projectRoot), 'utf8'));
    if (typeof raw.checkedAt !== 'number' || now - raw.checkedAt > HALT_CACHE_TTL_MS) return null;
    return raw.result;
  } catch {
    return null;
  }
}

function writeHaltCache(projectRoot, result, now) {
  try {
    const p = haltCachePath(projectRoot);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, JSON.stringify({ checkedAt: now, result }), 'utf8');
  } catch {
    // best-effort -- a cache-write failure never changes the hook's decision
  }
}

/**
 * §18: state/CUSTODIAN-HALT locally, or on origin/main (fetch with a 5s timeout; a fetch failure
 * means "unknown", not halt). The local check always runs live (it is a single fs.existsSync).
 * The remote (origin/main) probe result is cached for HALT_CACHE_TTL_MS (reviewer finding 17:
 * "so every stop does not fetch") -- only a *successful* probe is cached; a fetch failure is
 * never cached, so a transient network blip is retried next time rather than sticking for 60s.
 */
export function checkHalt(projectRoot, { now = Date.now() } = {}) {
  const localPath = path.join(projectRoot, 'state', 'CUSTODIAN-HALT');
  if (fs.existsSync(localPath)) {
    let message = '';
    try {
      message = firstLineOf(fs.readFileSync(localPath, 'utf8'));
    } catch {
      message = '';
    }
    return { halted: true, message, source: 'local' };
  }

  const cached = readHaltCache(projectRoot, now);
  if (cached) return cached;

  try {
    execFileSync('git', ['fetch', '--quiet', 'origin', 'main'], {
      cwd: projectRoot,
      timeout: HALT_FETCH_TIMEOUT_MS,
      stdio: ['ignore', 'ignore', 'ignore'],
    });
  } catch {
    return { halted: false, unknown: true }; // fetch failure -> "unknown", not halt; not cached
  }

  const exists = tryGit(['cat-file', '-e', 'origin/main:state/CUSTODIAN-HALT'], projectRoot) !== null;
  const result = exists
    ? { halted: true, message: firstLineOf(tryGit(['cat-file', '-p', 'origin/main:state/CUSTODIAN-HALT'], projectRoot) ?? ''), source: 'origin/main' }
    : { halted: false };
  writeHaltCache(projectRoot, result, now);
  return result;
}

/**
 * §24: this session holds the custodian lease only when CUSTODIAN-LEASE's first line is an
 * active `lease: <id> ...` line whose <id> equals input.session_id. A missing session_id never
 * matches. A read error (including a missing file) is treated as absent.
 */
export function leaseHeldBy(projectRoot, sessionId) {
  if (!sessionId) return { held: false, reason: 'no session_id on the stdin input' };
  let first;
  try {
    first = firstLineOf(fs.readFileSync(path.join(projectRoot, 'CUSTODIAN-LEASE'), 'utf8'));
  } catch {
    return { held: false, reason: 'CUSTODIAN-LEASE absent (or unreadable)' };
  }
  const match = /^lease:\s*(\S+)/.exec(first);
  if (!match) return { held: false, reason: 'CUSTODIAN-LEASE holds no active lease line (relinquished, malformed or empty)' };
  if (match[1] !== sessionId) return { held: false, reason: "CUSTODIAN-LEASE holds another session's lease" };
  return { held: true };
}

function waitingSummary(waitingOnHuman) {
  const total = waitingOnHuman.reduce((sum, n) => sum + (n.needs_human.minutes ?? 0), 0);
  const lines = waitingOnHuman.map(
    (n) => `${n.id} (${n.needs_human.kind}, ${n.needs_human.minutes} min)`,
  );
  return { total, lines };
}

function waitingSetKey(waitingOnHuman) {
  const canonical = waitingOnHuman
    .map((n) => `${n.id}:${n.needs_human.kind}:${n.needs_human.minutes}`)
    .sort()
    .join('|');
  return crypto.createHash('sha256').update(canonical).digest('hex');
}

async function notifyWaiting(projectRoot, waitingOnHuman, headline) {
  if (waitingOnHuman.length === 0) return;
  const { total, lines } = waitingSummary(waitingOnHuman);
  const text = `${headline}\nWaiting on you (${waitingOnHuman.length} item(s), ${total} min total):\n${lines.join('\n')}`;
  const key = `waiting:${waitingSetKey(waitingOnHuman)}`;
  try {
    await sendTelegramDeduped(key, text, { projectRoot, windowMs: TELEGRAM_DEDUPE_WINDOW_MS });
  } catch (e) {
    console.error(`stop-queue: telegram notify failed (${e.message}); the hook's decision is unaffected.`);
  }
}

function sessionStatePath(projectRoot, sessionId) {
  return path.join(projectRoot, '.claude', 'state', `stop-hook-${sessionId}.json`);
}

function dailyStatePath(projectRoot, date) {
  return path.join(projectRoot, '.claude', 'state', `stop-hook-daily-${date}.json`);
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

function todayUtc(now = new Date()) {
  return now.toISOString().slice(0, 10);
}

/**
 * Continuity (the stale-continuity form, section 2 item 2). Reads git only, never the working tree.
 * The newest commit c on HEAD touching the ledger (default history simplification, no
 * --first-parent) is stale when the block's flushed_at in c equals the one in c^1. A commit with no
 * first-parent copy of the block introduced it, so it reads fresh. An unreadable input is not
 * judged. Returns { judged: false, cause } or { judged: true, stale, commit, committedAt, flushedAt }.
 */
function judgeContinuity(projectRoot) {
  const opts = { timeout: CONTINUITY_GIT_TIMEOUT_MS, maxBuffer: CONTINUITY_GIT_MAX_BUFFER };
  const log = tryGit(['log', '-1', '--format=%H%x09%cI', 'HEAD', '--', LEDGER_PATHSPEC], projectRoot, opts);
  if (log === null) return { judged: false, cause: 'git log failed' };
  if (log === '') return { judged: true, stale: false };
  const [commit, committedAt] = log.split('\t');

  const blob = tryGit(['show', `${commit}:${LEDGER_PATHSPEC}`], projectRoot, opts);
  if (blob === null) return { judged: false, cause: `${LEDGER_PATHSPEC} unreadable at ${commit}` };
  const current = parseSessionContinuity(blob);
  if (!current?.flushedAt) return { judged: false, cause: `no flushed_at in the block at ${commit}` };

  const parentBlob = tryGit(['show', `${commit}^1:${LEDGER_PATHSPEC}`], projectRoot, opts);
  const parent = parentBlob === null ? null : parseSessionContinuity(parentBlob);
  if (!parent?.flushedAt) return { judged: true, stale: false };
  return { judged: true, stale: current.flushedAt === parent.flushedAt, commit, committedAt, flushedAt: current.flushedAt };
}

/**
 * The continuation accounting shared by the stale-continuity block and the queue block. Returns
 * { capReason } when a cap ends the turn (nothing is written), else records the block in the
 * session and daily files and returns { newDailyCount }. `planHash` is the plan's hash on the
 * queue path; null on the stale path, where the plan is not read, HEAD alone is the progress
 * signal and the stored plan hash is written back unchanged.
 */
function accountContinuation(projectRoot, input, now, { planHash, gitOpts = {} }) {
  const sessionId = input.session_id ?? 'unknown-session';
  const sessionPath = sessionStatePath(projectRoot, sessionId);
  const sessionState = readJson(sessionPath, { consecutive: 0, lastHead: null, lastPlanHash: null });

  const currentHead = tryGit(['rev-parse', 'HEAD'], projectRoot, gitOpts);
  let consecutive = sessionState.consecutive ?? 0;
  const hadPriorBlock = sessionState.lastHead !== null || sessionState.lastPlanHash !== null;
  const progressObserved =
    hadPriorBlock &&
    ((currentHead !== null && currentHead !== sessionState.lastHead) ||
      (planHash !== null && planHash !== sessionState.lastPlanHash));
  if (progressObserved) consecutive = 0;

  const date = todayUtc(now);
  const dailyPath = dailyStatePath(projectRoot, date);
  const dailyState = readJson(dailyPath, { count: 0 });
  const dailyCount = dailyState.count ?? 0;

  if (consecutive >= SESSION_CONSECUTIVE_CAP) {
    return { capReason: `allow: session continuation cap (${SESSION_CONSECUTIVE_CAP}) reached.` };
  }
  if (dailyCount >= DAILY_CONTINUATION_CAP) {
    return { capReason: `allow: daily continuation cap (${DAILY_CONTINUATION_CAP}) reached.` };
  }

  const newDailyCount = dailyCount + 1;
  writeJson(sessionPath, {
    consecutive: consecutive + 1,
    lastHead: currentHead,
    lastPlanHash: planHash ?? sessionState.lastPlanHash ?? null,
  });
  writeJson(dailyPath, { count: newDailyCount });
  return { newDailyCount };
}

/**
 * The decision core, injectable for tests. `deps` lets tests substitute git/telegram/clock
 * without touching the real environment.
 */
export async function decide(input, { projectRoot, now = new Date(), notify = notifyWaiting } = {}) {
  const stderrLines = [];
  const allow = (reason) => {
    if (reason) stderrLines.push(reason);
    return { decision: 'allow', stderr: stderrLines.join('\n') };
  };
  const block = (reason) => ({ decision: 'block', reason, stderr: stderrLines.join('\n') });

  // 1. Overrides: env var, or HALT (local or origin/main).
  if (process.env.CUSTODIAN_STOP_HOOK === 'off') {
    return allow('allow: CUSTODIAN_STOP_HOOK=off override is set.');
  }
  const halt = checkHalt(projectRoot, { now: now.getTime() });
  if (halt.halted) {
    stderrLines.push(`HALT: ${halt.message || '(state/CUSTODIAN-HALT present, no message)'}`);
    // Best-effort: still tell the human what is waiting, if the plan loads.
    try {
      const plan = loadPlan(resolvePlanPath(projectRoot));
      const { waitingOnHuman } = deriveStates(plan);
      await notify(projectRoot, waitingOnHuman, `HALT: ${halt.message || 'stop-hook halted'}`);
    } catch {
      // plan unavailable — halt still allows the stop.
    }
    // The HALT line is already on stderrLines (pushed above) -- allow() with no argument avoids
    // pushing (and printing) the same joined text a second time (reviewer finding 6).
    return allow();
  }

  // 2. Lease check (§24): a session without this session's own held lease allows.
  const lease = leaseHeldBy(projectRoot, input.session_id);
  if (!lease.held) {
    return allow(`allow: ${lease.reason} -- not this session's turn to hold the queue.`);
  }

  // 3. Continuity: a stale SESSION-CONTINUITY block blocks inside the shared continuation accounting.
  const continuity = judgeContinuity(projectRoot);
  if (!continuity.judged) {
    stderrLines.push(`stop-queue: continuity not judged (${continuity.cause}); the stop continues to the next step.`);
  } else if (continuity.stale) {
    const accounted = accountContinuation(projectRoot, input, now, {
      planHash: null,
      gitOpts: { timeout: CONTINUITY_GIT_TIMEOUT_MS, maxBuffer: CONTINUITY_GIT_MAX_BUFFER },
    });
    if (accounted.capReason) return allow(accounted.capReason);
    return block(
      `stale SESSION-CONTINUITY: the newest commit touching ${LEDGER_PATHSPEC} is ${continuity.commit} (${continuity.committedAt}), ` +
        `and it does not rewrite the block's flushed_at (${continuity.flushedAt}). ` +
        'Rewrite the block with scripts/hooks/flush.mjs from git and the ledger, commit it ledger-only, push, then stop.',
    );
  }

  // 4. background_tasks non-empty -> allow.
  if (Array.isArray(input.background_tasks) && input.background_tasks.length > 0) {
    return allow('allow: background_tasks is non-empty — the session is paused, not done.');
  }

  // 5. Derive the ready set live from PLAN.yaml.
  let plan;
  try {
    plan = loadPlan(resolvePlanPath(projectRoot));
  } catch (e) {
    if (e instanceof PlanFileMissingError) {
      return allow(`allow: no PLAN.yaml at ${resolvePlanPath(projectRoot)} — nothing to queue.`);
    }
    return allow(`allow: PLAN.yaml did not load (${e.message}) — never block on a broken plan.`);
  }
  const { ready, waitingOnHuman } = deriveStates(plan);

  // 6. Ready set empty, or only human-blocked nodes remain -> allow.
  if (ready.length === 0) {
    stderrLines.push(`allow: no unblocked node is ready; ${waitingOnHuman.length} waiting on human.`);
    await notify(projectRoot, waitingOnHuman, 'Only human-blocked nodes remain.');
    // Already pushed above -- see the HALT branch's own note (reviewer finding 6).
    return allow();
  }

  // 7. Continuation accounting, shared with the stale-continuity step.
  const accounted = accountContinuation(projectRoot, input, now, { planHash: plan._meta.hash });
  if (accounted.capReason) return allow(accounted.capReason);

  // 8. Block.
  const nearCap = accounted.newDailyCount / DAILY_CONTINUATION_CAP > NEAR_DAILY_CAP_RATIO;
  let orderedReady = ready;
  if (nearCap) {
    const { ready: smallFirstReady } = deriveStates(plan, { smallFirst: true });
    const isSpike = (n) => n.lane === 'measurement' || n.id.includes('spike');
    orderedReady = [...smallFirstReady.filter((n) => !isSpike(n)), ...smallFirstReady.filter(isSpike)];
  }
  const next = orderedReady[0];
  let reason =
    `next: ${next.id} — ${next.title} (lane ${next.lane}, budget ${next.budget_minutes} min). ` +
    `Regenerate CUSTODIAN-QUEUE.md if PLAN.yaml changed; ledger before ending.`;
  if (nearCap) {
    reason += ' near the daily cap: prefer small nodes; defer spikes';
  }
  return block(reason);
}

function readStdin() {
  return new Promise((resolve, reject) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => (data += chunk));
    process.stdin.on('end', () => resolve(data));
    process.stdin.on('error', reject);
  });
}

async function main() {
  let input = {};
  try {
    const raw = await readStdin();
    input = raw.trim() ? JSON.parse(raw) : {};
  } catch (e) {
    console.error(`stop-queue: could not parse stdin JSON (${e.message}); allowing.`);
    process.exit(0);
    return;
  }

  const projectRoot = resolveProjectRoot(input);
  let result;
  try {
    result = await decide(input, { projectRoot });
  } catch (e) {
    console.error(`stop-queue: unexpected error (${e.message}); allowing (never blocks the shell).`);
    process.exit(0);
    return;
  }

  if (result.stderr) console.error(result.stderr);
  if (result.decision === 'block') {
    process.stdout.write(JSON.stringify({ decision: 'block', reason: result.reason }));
  }
  process.exit(0);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (isCloudSession()) process.exit(0); // the custodian's hook, inert in a cloud session (cloud.mjs)
  main();
}
