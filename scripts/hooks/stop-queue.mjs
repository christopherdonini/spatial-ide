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
// Decision, in order (§3, with §18's HALT switch inserted as step 2):
//   1. background_tasks non-empty -> allow (paused for background work, not done).
//   2. Override: CUSTODIAN_STOP_HOOK=off in the environment, OR state/CUSTODIAN-HALT exists
//      locally or on origin/main -> allow, reason on stderr ("HALT: " + the file's first line
//      for the halt case). This replaces the old .claude/state/stop-hook.pause file override;
//      the environment-variable override is kept.
//   3. Derive the ready set live from PLAN.yaml (never trust the committed queue file).
//   4. Ready set empty, or only human-blocked nodes remain -> allow; stderr names the
//      waiting-on-human count; (item 16b) sends one Telegram message listing the waiting items,
//      deduped on a hash of the waiting set.
//   5. Continuation accounting: consecutive resets to 0 when progress is observed (HEAD or the
//      plan hash changed since the last block); session cap 6 consecutive (under Claude Code's
//      own 8); daily cap 40 across sessions. At either cap -> allow, reason on stderr.
//   6. Otherwise -> block, with the reason text below. Past 75% of the daily cap, the ready set
//      is reordered smallFirst and spikes/measurement-lane nodes are deferred (§10).
//
// Never throws to the shell: any unexpected error is caught and treated as "allow", with a note
// on stderr. Exits 0 with JSON on stdout only when it decides to block.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { loadPlan, deriveStates, PlanFileMissingError } from '../plan/plan.mjs';
import { sendTelegramDeduped } from './telegram.mjs';

// Declared constants, with their reason clauses (§3, §10, §18).
export const SESSION_CONSECUTIVE_CAP = 6; // "under Claude Code's own 8" -- stays a margin below Code's own override.
export const DAILY_CONTINUATION_CAP = 40; // "daily cap DAILY_CONTINUATION_CAP = 40 across sessions"
export const NEAR_DAILY_CAP_RATIO = 0.75; // "past 75% of the daily cap: prefer small nodes; defer spikes"
export const HALT_FETCH_TIMEOUT_MS = 5000; // "run git fetch --quiet origin main with a 5-second timeout"
export const HALT_CACHE_TTL_MS = 60 * 1000; // reviewer finding 17: cache the origin/main probe so every stop does not fetch
export const TELEGRAM_DEDUPE_WINDOW_MS = 10 * 60 * 1000; // "deduped on a hash of the waiting set" within 10 minutes

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

  // 1. background_tasks non-empty -> allow.
  if (Array.isArray(input.background_tasks) && input.background_tasks.length > 0) {
    return allow('allow: background_tasks is non-empty — the session is paused, not done.');
  }

  // 2. Overrides: env var, or HALT (local or origin/main).
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

  // 3. Derive the ready set live from PLAN.yaml.
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

  // 4. Ready set empty, or only human-blocked nodes remain -> allow.
  if (ready.length === 0) {
    stderrLines.push(`allow: no unblocked node is ready; ${waitingOnHuman.length} waiting on human.`);
    await notify(projectRoot, waitingOnHuman, 'Only human-blocked nodes remain.');
    // Already pushed above -- see the HALT branch's own note (reviewer finding 6).
    return allow();
  }

  // 5. Continuation accounting.
  const sessionId = input.session_id ?? 'unknown-session';
  const sessionPath = sessionStatePath(projectRoot, sessionId);
  const sessionState = readJson(sessionPath, { consecutive: 0, lastHead: null, lastPlanHash: null });

  const currentHead = tryGit(['rev-parse', 'HEAD'], projectRoot);
  const currentPlanHash = plan._meta.hash;
  let consecutive = sessionState.consecutive ?? 0;
  const hadPriorBlock = sessionState.lastHead !== null || sessionState.lastPlanHash !== null;
  const progressObserved =
    hadPriorBlock &&
    ((currentHead !== null && currentHead !== sessionState.lastHead) ||
      currentPlanHash !== sessionState.lastPlanHash);
  if (progressObserved) consecutive = 0;

  const date = todayUtc(now);
  const dailyPath = dailyStatePath(projectRoot, date);
  const dailyState = readJson(dailyPath, { count: 0 });
  const dailyCount = dailyState.count ?? 0;

  if (consecutive >= SESSION_CONSECUTIVE_CAP) {
    return allow(`allow: session continuation cap (${SESSION_CONSECUTIVE_CAP}) reached.`);
  }
  if (dailyCount >= DAILY_CONTINUATION_CAP) {
    return allow(`allow: daily continuation cap (${DAILY_CONTINUATION_CAP}) reached.`);
  }

  // 6. Block.
  const newConsecutive = consecutive + 1;
  const newDailyCount = dailyCount + 1;
  writeJson(sessionPath, { consecutive: newConsecutive, lastHead: currentHead, lastPlanHash: currentPlanHash });
  writeJson(dailyPath, { count: newDailyCount });

  const nearCap = newDailyCount / DAILY_CONTINUATION_CAP > NEAR_DAILY_CAP_RATIO;
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
  main();
}
