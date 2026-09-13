import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { decide, checkHalt, SESSION_CONSECUTIVE_CAP } from './stop-queue.mjs';
import { decidePrecompact, checkFreshness, BLOCK_REASON } from './precompact-flush.mjs';
import { buildOutput, extractSessionContinuityBlock, READING_ORDER } from './session-resume.mjs';
import { buildMessage } from './notify-telegram.mjs';
import { sendTelegram, sendTelegramDeduped } from './telegram.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const fixturesDir = path.join(here, '..', 'plan', 'fixtures');
const twoNodesPlan = path.join(fixturesDir, 'two-nodes.yaml');
const twoNodesHumanOnlyPlan = path.join(fixturesDir, 'two-nodes-human-only.yaml');

// Every test in this file runs against a synthetic (non-real) Telegram config so nothing here
// ever performs real network I/O, regardless of the developer's own environment.
process.env.CUSTODIAN_TELEGRAM_DRY_RUN = '1';
delete process.env.CUSTODIAN_TELEGRAM_BOT_TOKEN;
delete process.env.CUSTODIAN_TELEGRAM_CHAT_ID;

function makeTempDir(prefix) {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

function git(dir, args) {
  return execFileSync('git', args, { cwd: dir, encoding: 'utf8' });
}

function makeGitRepo() {
  const dir = makeTempDir('hooks-test-repo-');
  git(dir, ['init', '-q']);
  git(dir, ['config', 'user.email', 'test@example.com']);
  git(dir, ['config', 'user.name', 'Test']);
  fs.writeFileSync(path.join(dir, 'README.md'), '# test\n');
  git(dir, ['add', '-A']);
  git(dir, ['commit', '-q', '-m', 'init']);
  return dir;
}

function baseStopInput(overrides = {}) {
  return {
    session_id: `s-${Math.random().toString(36).slice(2)}`,
    cwd: process.cwd(),
    hook_event_name: 'Stop',
    stop_hook_active: false,
    last_assistant_message: '',
    background_tasks: [],
    session_crons: [],
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// stop-queue.mjs — the dry run of AUTONOMY.md §3, in script form.
// ---------------------------------------------------------------------------

test('stop-queue: blocks on the two-node fixture (a ready node exists)', async () => {
  const projectRoot = makeTempDir('stop-block-');
  process.env.CUSTODIAN_PLAN_PATH = twoNodesPlan;
  try {
    const result = await decide(baseStopInput(), { projectRoot });
    assert.equal(result.decision, 'block');
    assert.match(result.reason, /^next: two-nodes-ready/);
  } finally {
    delete process.env.CUSTODIAN_PLAN_PATH;
  }
});

test('stop-queue: allows when only the human-blocked node remains', async () => {
  const projectRoot = makeTempDir('stop-allow-human-');
  process.env.CUSTODIAN_PLAN_PATH = twoNodesHumanOnlyPlan;
  try {
    const result = await decide(baseStopInput(), { projectRoot });
    assert.equal(result.decision, 'allow');
    assert.match(result.stderr, /waiting on human/);
  } finally {
    delete process.env.CUSTODIAN_PLAN_PATH;
  }
});

test('stop-queue: allows on non-empty background_tasks, before even reading the plan', async () => {
  const projectRoot = makeTempDir('stop-allow-bg-');
  // No CUSTODIAN_PLAN_PATH set and no PLAN.yaml in projectRoot -- if this reached step 3 it would
  // still allow (missing plan), but we assert the earlier, more specific reason fires first.
  const input = baseStopInput({ background_tasks: [{ id: 'bg-1' }] });
  const result = await decide(input, { projectRoot });
  assert.equal(result.decision, 'allow');
  assert.match(result.stderr, /background_tasks is non-empty/);
});

test('stop-queue: allows via the CUSTODIAN_STOP_HOOK=off override', async () => {
  const projectRoot = makeTempDir('stop-allow-env-');
  process.env.CUSTODIAN_STOP_HOOK = 'off';
  try {
    const result = await decide(baseStopInput(), { projectRoot });
    assert.equal(result.decision, 'allow');
    assert.match(result.stderr, /CUSTODIAN_STOP_HOOK=off/);
  } finally {
    delete process.env.CUSTODIAN_STOP_HOOK;
  }
});

test('stop-queue: allows on a local state/CUSTODIAN-HALT file, with its first line on stderr', async () => {
  const projectRoot = makeTempDir('stop-allow-halt-');
  fs.mkdirSync(path.join(projectRoot, 'state'), { recursive: true });
  fs.writeFileSync(
    path.join(projectRoot, 'state', 'CUSTODIAN-HALT'),
    'reclaiming the build cache for the drill\nsecond line ignored\n',
  );
  const halt = checkHalt(projectRoot);
  assert.equal(halt.halted, true);
  assert.equal(halt.message, 'reclaiming the build cache for the drill');

  const result = await decide(baseStopInput(), { projectRoot });
  assert.equal(result.decision, 'allow');
  assert.match(result.stderr, /^HALT: reclaiming the build cache for the drill/);
});

test('stop-queue: caches a successful origin/main HALT probe for 60s (finding 17)', () => {
  const dir = makeGitRepo();
  const bareDir = makeTempDir('halt-cache-bare-');
  execFileSync('git', ['init', '-q', '--bare', bareDir]);
  git(dir, ['remote', 'add', 'origin', bareDir]);

  fs.mkdirSync(path.join(dir, 'state'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'state', 'CUSTODIAN-HALT'), 'first probe\n');
  git(dir, ['add', '-A']);
  git(dir, ['commit', '-q', '-m', 'halt']);
  git(dir, ['push', '-q', '-u', 'origin', 'HEAD:refs/heads/main']);
  // Remove the LOCAL copy (not yet pushed) so checkHalt must consult origin/main (the cached
  // path) instead of the local file -- origin/main still has the halt file at this point.
  fs.rmSync(path.join(dir, 'state', 'CUSTODIAN-HALT'));
  git(dir, ['add', '-A']);
  git(dir, ['commit', '-q', '-m', 'remove the local copy (not pushed yet)']);

  const now = 1_000_000;
  const first = checkHalt(dir, { now });
  assert.deepEqual(first, { halted: true, message: 'first probe', source: 'origin/main' });

  // Push the halt-free commit now -- origin/main drops the file. Within the 60s window the
  // cached (stale) result must still be returned rather than re-fetched.
  git(dir, ['push', '-q', '-f', 'origin', 'HEAD:refs/heads/main']);

  const second = checkHalt(dir, { now: now + 30_000 }); // 30s later, inside the window
  assert.deepEqual(second, first);

  const third = checkHalt(dir, { now: now + 61_000 }); // past the window -- re-fetches
  assert.equal(third.halted, false);
});

test('stop-queue: allows at the session continuation cap', async () => {
  const projectRoot = makeTempDir('stop-allow-cap-');
  process.env.CUSTODIAN_PLAN_PATH = twoNodesPlan;
  try {
    const sessionId = 'capped-session';
    const statePath = path.join(projectRoot, '.claude', 'state', `stop-hook-${sessionId}.json`);
    fs.mkdirSync(path.dirname(statePath), { recursive: true });
    fs.writeFileSync(
      statePath,
      JSON.stringify({ consecutive: SESSION_CONSECUTIVE_CAP, lastHead: null, lastPlanHash: null }),
    );
    const result = await decide(baseStopInput({ session_id: sessionId }), { projectRoot });
    assert.equal(result.decision, 'allow');
    assert.match(result.stderr, /session continuation cap/);
  } finally {
    delete process.env.CUSTODIAN_PLAN_PATH;
  }
});

test('stop-queue: allows at the daily continuation cap', async () => {
  const projectRoot = makeTempDir('stop-allow-daily-');
  process.env.CUSTODIAN_PLAN_PATH = twoNodesPlan;
  try {
    const today = new Date().toISOString().slice(0, 10);
    const dailyPath = path.join(projectRoot, '.claude', 'state', `stop-hook-daily-${today}.json`);
    fs.mkdirSync(path.dirname(dailyPath), { recursive: true });
    fs.writeFileSync(dailyPath, JSON.stringify({ count: 40 }));
    const result = await decide(baseStopInput(), { projectRoot });
    assert.equal(result.decision, 'allow');
    assert.match(result.stderr, /daily continuation cap/);
  } finally {
    delete process.env.CUSTODIAN_PLAN_PATH;
  }
});

test('stop-queue: block reason names the lane and budget', async () => {
  const projectRoot = makeTempDir('stop-block-reason-');
  process.env.CUSTODIAN_PLAN_PATH = path.join(fixturesDir, 'valid-plan.yaml');
  try {
    const result = await decide(baseStopInput(), { projectRoot });
    assert.equal(result.decision, 'block');
    assert.match(result.reason, /lane shell, budget 50 min/);
    assert.match(result.reason, /Regenerate CUSTODIAN-QUEUE\.md if PLAN\.yaml changed; ledger before ending\./);
  } finally {
    delete process.env.CUSTODIAN_PLAN_PATH;
  }
});

test('stop-queue: notifies on the human-blocked-only allow, deduped on the waiting set', async () => {
  const projectRoot = makeTempDir('stop-notify-dedupe-');
  process.env.CUSTODIAN_PLAN_PATH = twoNodesHumanOnlyPlan;
  try {
    await decide(baseStopInput(), { projectRoot });
    const dedupePath = path.join(projectRoot, '.claude', 'state', 'telegram-sent.json');
    assert.ok(fs.existsSync(dedupePath), 'expected a dedupe record to be written');
    const before = JSON.parse(fs.readFileSync(dedupePath, 'utf8'));
    assert.equal(Object.keys(before).length, 1);

    // A second allow for the same waiting set, moments later, must not add a second key.
    await decide(baseStopInput(), { projectRoot });
    const after = JSON.parse(fs.readFileSync(dedupePath, 'utf8'));
    assert.deepEqual(before, after);
  } finally {
    delete process.env.CUSTODIAN_PLAN_PATH;
  }
});

test('stop-queue CLI: piping stdin JSON blocks on the two-node fixture', () => {
  const projectRoot = makeTempDir('stop-cli-');
  const scriptPath = path.join(here, 'stop-queue.mjs');
  const result = spawnSync(process.execPath, [scriptPath], {
    input: JSON.stringify(baseStopInput()),
    encoding: 'utf8',
    env: { ...process.env, CLAUDE_PROJECT_DIR: projectRoot, CUSTODIAN_PLAN_PATH: twoNodesPlan },
  });
  assert.equal(result.status, 0);
  const parsed = JSON.parse(result.stdout);
  assert.equal(parsed.decision, 'block');
  assert.match(parsed.reason, /^next: two-nodes-ready/);
});

test('stop-queue: never throws to the shell on a missing plan file (allows)', async () => {
  const projectRoot = makeTempDir('stop-missing-plan-');
  process.env.CUSTODIAN_PLAN_PATH = path.join(projectRoot, 'does-not-exist.yaml');
  try {
    const result = await decide(baseStopInput(), { projectRoot });
    assert.equal(result.decision, 'allow');
    assert.match(result.stderr, /no PLAN\.yaml/);
  } finally {
    delete process.env.CUSTODIAN_PLAN_PATH;
  }
});

// ---------------------------------------------------------------------------
// precompact-flush.mjs
// ---------------------------------------------------------------------------

function writeCutState(dir, block) {
  fs.mkdirSync(path.join(dir, 'state'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'state', 'CUT-STATE.md'), block, 'utf8');
}

test('precompact-flush: blocks when there is no SESSION-CONTINUITY block', () => {
  const dir = makeGitRepo();
  writeCutState(dir, '# CUT-STATE\n\nNo continuity block here.\n');
  const result = decidePrecompact({ session_id: 's1', trigger: 'manual', custom_instructions: null }, { projectRoot: dir });
  assert.equal(result.decision, 'block');
  assert.equal(result.reason, BLOCK_REASON);
});

test('precompact-flush: mismatched tip is reported precisely', () => {
  const dir = makeGitRepo();
  writeCutState(
    dir,
    `# CUT-STATE\n\n## SESSION-CONTINUITY\nflushed_at: ${new Date().toISOString()}\ntip: 0000000000000000000000000000000000000000\n`,
  );
  const result = checkFreshness(dir);
  assert.equal(result.fresh, false);
  assert.match(result.reason, /does not match HEAD/);
});

test('precompact-flush: fresh (tip=HEAD, pushed, clean, recent) allows — via an injected git', () => {
  // A commit's own tracked content cannot state that same commit's resulting hash (the hash is
  // computed FROM the content), so the "fresh" branch is exercised with an injected `git`
  // reporting a self-consistent HEAD/status/upstream, rather than via a real self-referencing
  // commit (which is not constructible).
  const dir = makeGitRepo();
  const fakeHead = 'deadbeefdeadbeefdeadbeefdeadbeefdeadbeef';
  writeCutState(
    dir,
    `# CUT-STATE\n\n## SESSION-CONTINUITY\nflushed_at: ${new Date().toISOString()}\ntip: ${fakeHead}\n`,
  );
  const fakeGit = (args) => {
    if (args[0] === 'rev-parse' && args[1] === 'HEAD') return fakeHead;
    if (args[0] === 'status') return '';
    if (args[0] === 'rev-parse' && args[1] === '@{u}') return fakeHead;
    if (args[0] === 'merge-base' && args[1] === '--is-ancestor') return ''; // HEAD is its own ancestor
    return null;
  };
  const fresh = checkFreshness(dir, { git: fakeGit });
  assert.deepEqual(fresh, { fresh: true });

  const result = decidePrecompact({ session_id: 's2' }, { projectRoot: dir, git: fakeGit });
  assert.equal(result.decision, 'allow');
  assert.match(result.stderr, /SESSION-CONTINUITY block is fresh/);
});

test('precompact-flush: HEAD reachable from a newer @{u} still counts as pushed (finding 7)', () => {
  // "Pushed" means reachable from upstream, not literally equal to it -- the remote can have
  // moved further ahead (someone else's later push) while HEAD is still, itself, pushed.
  const dir = makeGitRepo();
  const fakeHead = 'deadbeefdeadbeefdeadbeefdeadbeefdeadbeef';
  const fakeUpstream = 'cafef00dcafef00dcafef00dcafef00dcafef00d';
  writeCutState(
    dir,
    `# CUT-STATE\n\n## SESSION-CONTINUITY\nflushed_at: ${new Date().toISOString()}\ntip: ${fakeHead}\n`,
  );
  const fakeGit = (args) => {
    if (args[0] === 'rev-parse' && args[1] === 'HEAD') return fakeHead;
    if (args[0] === 'status') return '';
    if (args[0] === 'rev-parse' && args[1] === '@{u}') return fakeUpstream;
    if (args[0] === 'merge-base' && args[1] === '--is-ancestor') return ''; // HEAD is an ancestor of @{u}
    return null;
  };
  const fresh = checkFreshness(dir, { git: fakeGit });
  assert.deepEqual(fresh, { fresh: true });
});

test('precompact-flush: HEAD not reachable from @{u} is still "not pushed"', () => {
  const dir = makeGitRepo();
  const fakeHead = 'deadbeefdeadbeefdeadbeefdeadbeefdeadbeef';
  writeCutState(
    dir,
    `# CUT-STATE\n\n## SESSION-CONTINUITY\nflushed_at: ${new Date().toISOString()}\ntip: ${fakeHead}\n`,
  );
  const fakeGit = (args) => {
    if (args[0] === 'rev-parse' && args[1] === 'HEAD') return fakeHead;
    if (args[0] === 'status') return '';
    if (args[0] === 'rev-parse' && args[1] === '@{u}') return 'some-other-hash-entirely';
    if (args[0] === 'merge-base' && args[1] === '--is-ancestor') return null; // diverged, not reachable
    return null;
  };
  const fresh = checkFreshness(dir, { git: fakeGit });
  assert.equal(fresh.fresh, false);
  assert.match(fresh.reason, /not pushed/);
});

test('precompact-flush: a block citing the PARENT of a ledger-only flush commit is fresh', () => {
  // The flush commit cannot cite its own hash, so the block cites the parent; the hook accepts
  // that only when HEAD changes nothing but state/CUT-STATE.md (the human, 2026-09-14).
  const dir = makeGitRepo();
  const fakeParent = '1111111111111111111111111111111111111111';
  const fakeHead = 'deadbeefdeadbeefdeadbeefdeadbeefdeadbeef';
  writeCutState(
    dir,
    `# CUT-STATE\n\n## SESSION-CONTINUITY\nflushed_at: ${new Date().toISOString()}\ntip: ${fakeParent}\n`,
  );
  const fakeGit = (args) => {
    if (args[0] === 'rev-parse' && args[1] === 'HEAD') return fakeHead;
    if (args[0] === 'rev-parse' && args[1] === 'HEAD^') return fakeParent;
    if (args[0] === 'diff' && args[1] === '--name-only') return 'state/CUT-STATE.md';
    if (args[0] === 'status') return '';
    if (args[0] === 'rev-parse' && args[1] === '@{u}') return fakeHead;
    if (args[0] === 'merge-base' && args[1] === '--is-ancestor') return '';
    return null;
  };
  assert.deepEqual(checkFreshness(dir, { git: fakeGit }), { fresh: true });
});

test('precompact-flush: a block citing the parent of a commit that also touches code is stale', () => {
  const dir = makeGitRepo();
  const fakeParent = '1111111111111111111111111111111111111111';
  const fakeHead = 'deadbeefdeadbeefdeadbeefdeadbeefdeadbeef';
  writeCutState(
    dir,
    `# CUT-STATE\n\n## SESSION-CONTINUITY\nflushed_at: ${new Date().toISOString()}\ntip: ${fakeParent}\n`,
  );
  const fakeGit = (args) => {
    if (args[0] === 'rev-parse' && args[1] === 'HEAD') return fakeHead;
    if (args[0] === 'rev-parse' && args[1] === 'HEAD^') return fakeParent;
    if (args[0] === 'diff' && args[1] === '--name-only') return 'state/CUT-STATE.md\nscripts/hooks/precompact-flush.mjs';
    if (args[0] === 'status') return '';
    if (args[0] === 'rev-parse' && args[1] === '@{u}') return fakeHead;
    if (args[0] === 'merge-base' && args[1] === '--is-ancestor') return '';
    return null;
  };
  const fresh = checkFreshness(dir, { git: fakeGit });
  assert.equal(fresh.fresh, false);
  assert.match(fresh.reason, /not the parent of a ledger-only flush commit/);
});

test('precompact-flush: untracked paths (porcelain ??) do not make the tree dirty', () => {
  const dir = makeGitRepo();
  const fakeHead = 'deadbeefdeadbeefdeadbeefdeadbeefdeadbeef';
  writeCutState(
    dir,
    `# CUT-STATE

## SESSION-CONTINUITY
flushed_at: ${new Date().toISOString()}
tip: ${fakeHead}
`,
  );
  const fakeGit = (args) => {
    if (args[0] === 'rev-parse' && args[1] === 'HEAD') return fakeHead;
    if (args[0] === 'status') return '?? RELEASE-DRAFTS-0.1.0/
?? scratch.txt';
    if (args[0] === 'rev-parse' && args[1] === '@{u}') return fakeHead;
    if (args[0] === 'merge-base' && args[1] === '--is-ancestor') return '';
    return null;
  };
  assert.deepEqual(checkFreshness(dir, { git: fakeGit }), { fresh: true });
});

test('precompact-flush: fresh tip/HEAD but a dirty tree is still stale', () => {
  const dir = makeGitRepo();
  const fakeHead = 'deadbeefdeadbeefdeadbeefdeadbeefdeadbeef';
  writeCutState(
    dir,
    `# CUT-STATE\n\n## SESSION-CONTINUITY\nflushed_at: ${new Date().toISOString()}\ntip: ${fakeHead}\n`,
  );
  const fakeGit = (args) => {
    if (args[0] === 'rev-parse' && args[1] === 'HEAD') return fakeHead;
    if (args[0] === 'status') return ' M some/file.rs\n'; // dirty
    if (args[0] === 'rev-parse' && args[1] === '@{u}') return fakeHead;
    return null;
  };
  const fresh = checkFreshness(dir, { git: fakeGit });
  assert.equal(fresh.fresh, false);
  assert.match(fresh.reason, /modified tracked file/);
});

test('precompact-flush: fresh tip/HEAD but no upstream is still stale (not pushed)', () => {
  const dir = makeGitRepo();
  const fakeHead = 'deadbeefdeadbeefdeadbeefdeadbeefdeadbeef';
  writeCutState(
    dir,
    `# CUT-STATE\n\n## SESSION-CONTINUITY\nflushed_at: ${new Date().toISOString()}\ntip: ${fakeHead}\n`,
  );
  const fakeGit = (args) => {
    if (args[0] === 'rev-parse' && args[1] === 'HEAD') return fakeHead;
    if (args[0] === 'status') return '';
    if (args[0] === 'rev-parse' && args[1] === '@{u}') return null; // no upstream
    return null;
  };
  const fresh = checkFreshness(dir, { git: fakeGit });
  assert.equal(fresh.fresh, false);
  assert.match(fresh.reason, /no upstream/);
});

test('precompact-flush: a second PreCompact within 15 minutes is allowed whatever the freshness', () => {
  const dir = makeGitRepo();
  writeCutState(dir, '# CUT-STATE\n\nNo continuity block here.\n');
  const input = { session_id: 's3', trigger: 'auto', custom_instructions: null };
  const first = decidePrecompact(input, { projectRoot: dir });
  assert.equal(first.decision, 'block');

  const second = decidePrecompact(input, { projectRoot: dir, now: new Date(Date.now() + 5 * 60 * 1000) });
  assert.equal(second.decision, 'allow');
  assert.match(second.stderr, /never blocked twice/);
});

test('precompact-flush CLI: exits 2 and prints the reason on stderr when stale', () => {
  const dir = makeGitRepo();
  writeCutState(dir, '# CUT-STATE\n\nNo continuity block.\n');
  const scriptPath = path.join(here, 'precompact-flush.mjs');
  const result = spawnSync(process.execPath, [scriptPath], {
    input: JSON.stringify({ session_id: 'cli-s1', hook_event_name: 'PreCompact', trigger: 'manual', custom_instructions: null, cwd: dir }),
    encoding: 'utf8',
    env: { ...process.env, CLAUDE_PROJECT_DIR: dir },
  });
  assert.equal(result.status, 2);
  assert.match(result.stderr, /PRE-COMPACTION FLUSH REQUIRED/);
});

// ---------------------------------------------------------------------------
// session-resume.mjs
// ---------------------------------------------------------------------------

test('session-resume: extracts the SESSION-CONTINUITY block verbatim', () => {
  const text = [
    '# CUT-STATE',
    '',
    '## SESSION-CONTINUITY',
    'flushed_at: 2026-09-13T12:00:00Z',
    'tip: abc123',
    'position: mid-piece',
    '',
    '## Ledger',
    'older entries...',
  ].join('\n');
  const block = extractSessionContinuityBlock(text);
  assert.match(block, /^## SESSION-CONTINUITY/);
  assert.match(block, /tip: abc123/);
  assert.ok(!block.includes('## Ledger'));
});

test('session-resume: prints the reading order and the block', () => {
  const dir = makeTempDir('resume-');
  writeCutState(
    dir,
    '# CUT-STATE\n\n## SESSION-CONTINUITY\nflushed_at: 2026-09-13T12:00:00Z\ntip: abc123\n',
  );
  const output = buildOutput(dir);
  assert.ok(output.includes(READING_ORDER));
  assert.match(output, /## SESSION-CONTINUITY/);
  assert.match(output, /tip: abc123/);
});

test('session-resume: never throws when state/CUT-STATE.md is missing', () => {
  const dir = makeTempDir('resume-missing-');
  const output = buildOutput(dir);
  assert.ok(output.includes(READING_ORDER));
  assert.match(output, /could not be read|no SESSION-CONTINUITY block/);
});

// ---------------------------------------------------------------------------
// notify-telegram.mjs / telegram.mjs
// ---------------------------------------------------------------------------

test('notify-telegram: builds "<type>: <title/message> (<cwd basename>)"', () => {
  const msg = buildMessage({
    notification_type: 'permission_prompt',
    message: 'Claude needs your permission',
    title: 'Permission needed',
    cwd: '/Users/x/dev/spatial-ide',
  });
  assert.equal(msg, 'permission_prompt: Permission needed — Claude needs your permission (spatial-ide)');
});

test('notify-telegram: falls back to message alone when there is no title', () => {
  const msg = buildMessage({ notification_type: 'idle_prompt', message: 'idle', cwd: '/tmp/spatial-ide' });
  assert.equal(msg, 'idle_prompt: idle (spatial-ide)');
});

test('telegram: dry run writes the message to stderr and never sends', async () => {
  const result = await sendTelegram('hello from a test');
  assert.equal(result.dryRun, true);
  assert.equal(result.ok, true);
});

test('telegram: unset token/chat id is a no-op (when not in dry-run mode)', async () => {
  const prevDry = process.env.CUSTODIAN_TELEGRAM_DRY_RUN;
  delete process.env.CUSTODIAN_TELEGRAM_DRY_RUN;
  try {
    const result = await sendTelegram('should not send');
    assert.equal(result.skipped, true);
  } finally {
    process.env.CUSTODIAN_TELEGRAM_DRY_RUN = prevDry;
  }
});

test('telegram: sendTelegramDeduped suppresses a repeat within the window', async () => {
  const projectRoot = makeTempDir('telegram-dedupe-');
  const first = await sendTelegramDeduped('k1', 'first', { projectRoot, windowMs: 10 * 60 * 1000, now: 1000 });
  assert.equal(first.deduped, false);
  const second = await sendTelegramDeduped('k1', 'second', { projectRoot, windowMs: 10 * 60 * 1000, now: 1000 + 60_000 });
  assert.equal(second.deduped, true);
  const third = await sendTelegramDeduped('k1', 'third', { projectRoot, windowMs: 10 * 60 * 1000, now: 1000 + 11 * 60_000 });
  assert.equal(third.deduped, false);
});

test('telegram: sendTelegramDeduped treats different keys independently', async () => {
  const projectRoot = makeTempDir('telegram-dedupe-keys-');
  const a = await sendTelegramDeduped('key-a', 'a', { projectRoot, now: 1000 });
  const b = await sendTelegramDeduped('key-b', 'b', { projectRoot, now: 1000 });
  assert.equal(a.deduped, false);
  assert.equal(b.deduped, false);
});
