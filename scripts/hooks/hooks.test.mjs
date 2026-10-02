import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { decide, checkHalt, SESSION_CONSECUTIVE_CAP, DAILY_CONTINUATION_CAP } from './stop-queue.mjs';
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
delete process.env.CLAUDE_CODE_REMOTE; // the cloud marker (cloud.mjs): these tests exercise the hooks' local behaviour

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

// §24: write a CUSTODIAN-LEASE this sessionId holds, so a test can exercise the steps after the
// lease check unchanged.
function writeHeldLease(projectRoot, sessionId) {
  fs.writeFileSync(path.join(projectRoot, 'CUSTODIAN-LEASE'), `lease: ${sessionId} refreshed: ${new Date().toISOString()}\n`);
}

// ---------------------------------------------------------------------------
// Continuity fixtures (STOP-HOOK-STALE-CONTINUITY-PREREGISTRATION.md §3): real git in a fresh
// os.tmpdir() repository, local identity, core.autocrlf false, argument arrays, no shell.
// ---------------------------------------------------------------------------

const FLUSH_A = '2026-10-01T00:00:00Z';
const FLUSH_B = '2026-10-01T01:00:00Z';
const LEDGER_PATHSPEC = 'state/CUT-STATE.md';

function ledgerText({ flushedAt = FLUSH_A, entries = 1, eol = '\n', padLines = 0 } = {}) {
  const lines = [
    '# CUT-STATE',
    '',
    '## SESSION-CONTINUITY',
    `flushed_at: ${flushedAt}`,
    'tip: 0000000000000000000000000000000000000000',
    '',
    '## Ledger',
    '',
  ];
  for (let i = 0; i < padLines; i++) lines.push('x'.repeat(63)); // 64 bytes with its newline
  for (let i = 1; i <= entries; i++) lines.push(`- entry ${i}`);
  return lines.join('\n').replace(/\n/g, eol) + eol;
}

function writeLedger(dir, opts) {
  fs.mkdirSync(path.join(dir, 'state'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'state', 'CUT-STATE.md'), ledgerText(opts));
}

function commitPaths(dir, paths, message) {
  git(dir, ['add', '--', ...paths]);
  git(dir, ['commit', '-q', '-m', message]);
}

function commitLedger(dir, opts, message) {
  writeLedger(dir, opts);
  commitPaths(dir, [LEDGER_PATHSPEC], message);
}

// A repository removed with t.after. `ledger: false` makes the one commit README-only (S4b).
function makeLedgerRepo(t, { ledger = true, ledgerOpts = {} } = {}) {
  const dir = makeTempDir('stop-continuity-');
  t.after(() => fs.rmSync(dir, { recursive: true, force: true, maxRetries: 3 }));
  git(dir, ['init', '-q']);
  git(dir, ['config', 'user.email', 'test@example.com']);
  git(dir, ['config', 'user.name', 'Test']);
  git(dir, ['config', 'core.autocrlf', 'false']);
  git(dir, ['config', 'commit.gpgsign', 'false']);
  // Line endings are the fixture's own: no attributes file at any level may rewrite a blob.
  fs.writeFileSync(path.join(dir, '.git', 'info', 'attributes'), '* -text\n');
  fs.writeFileSync(path.join(dir, 'README.md'), '# test\n');
  const paths = ['README.md'];
  if (ledger) {
    writeLedger(dir, ledgerOpts);
    paths.push(LEDGER_PATHSPEC);
  }
  commitPaths(dir, paths, 'c0');
  return dir;
}

function headOf(dir, rev = 'HEAD') {
  return git(dir, ['rev-parse', rev]).trim();
}

// A stop fixture: the plan is the two-node fixture, and this session holds the lease (untracked).
function stopFixture(t, repoOpts) {
  const dir = makeLedgerRepo(t, repoOpts);
  process.env.CUSTODIAN_PLAN_PATH = twoNodesPlan;
  t.after(() => {
    delete process.env.CUSTODIAN_PLAN_PATH;
  });
  const input = baseStopInput();
  writeHeldLease(dir, input.session_id);
  return { dir, input };
}

// S1: c0, then c1 entry-only.
function stopFixtureS1(t) {
  const fx = stopFixture(t);
  commitLedger(fx.dir, { flushedAt: FLUSH_A, entries: 2 }, 'c1 entry only');
  return fx;
}

// §7's reason, written out here and not imported: the test pins the declared text.
function staleReason(dir, rev, flushedAt) {
  const [sha, committedAt] = git(dir, ['log', '-1', '--format=%H%x09%cI', rev]).trim().split('\t');
  return (
    `stale SESSION-CONTINUITY: the newest commit touching state/CUT-STATE.md is ${sha} (${committedAt}), ` +
    `and it does not rewrite the block's flushed_at (${flushedAt}). ` +
    'Rewrite the block with scripts/hooks/flush.mjs from git and the ledger, commit it ledger-only, push, then stop.'
  );
}

function stopStatePaths(dir, sessionId, now) {
  const stateDir = path.join(dir, '.claude', 'state');
  return {
    session: path.join(stateDir, `stop-hook-${sessionId}.json`),
    daily: path.join(stateDir, `stop-hook-daily-${now.toISOString().slice(0, 10)}.json`),
  };
}

function readJsonFile(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function writeJsonFile(p, obj) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(obj));
}

// ---------------------------------------------------------------------------
// stop-queue.mjs — the dry run of AUTONOMY.md §3, in script form.
// ---------------------------------------------------------------------------

test('stop-queue: blocks on the two-node fixture (a ready node exists)', async () => {
  const projectRoot = makeTempDir('stop-block-');
  process.env.CUSTODIAN_PLAN_PATH = twoNodesPlan;
  try {
    const input = baseStopInput();
    writeHeldLease(projectRoot, input.session_id);
    const result = await decide(input, { projectRoot });
    assert.equal(result.decision, 'block');
    assert.match(result.reason, /^next: two-nodes-ready/);
  } finally {
    delete process.env.CUSTODIAN_PLAN_PATH;
  }
});

// RECORDED MUTATION: leaseHeldBy's `if (!match) return { held: false, ... }` branch changed to
// `return { held: true }` (a relinquished/malformed/empty first line read as held) ->
// `stop-queue: allows when this session's lease is relinquished` fails: decision 'block' where
// 'allow' is expected.
test("stop-queue: allows when this session's lease is relinquished", async () => {
  const projectRoot = makeTempDir('stop-allow-relinquished-');
  process.env.CUSTODIAN_PLAN_PATH = twoNodesPlan;
  try {
    const input = baseStopInput();
    fs.writeFileSync(path.join(projectRoot, 'CUSTODIAN-LEASE'), `relinquished: ${input.session_id}\n`);
    const result = await decide(input, { projectRoot });
    assert.equal(result.decision, 'allow');
    assert.match(result.stderr, /holds no active lease line/);
  } finally {
    delete process.env.CUSTODIAN_PLAN_PATH;
  }
});

// RECORDED MUTATION: leaseHeldBy's absent-file catch changed to `return { held: true }` (an
// absent file read as held) -> `stop-queue: allows when this session holds no lease (file absent,
// or another session's lease)` fails: decision 'block' where 'allow' is expected.
test('stop-queue: allows when this session holds no lease (file absent, or another session\'s lease)', async () => {
  const absentRoot = makeTempDir('stop-allow-nolease-absent-');
  const otherRoot = makeTempDir('stop-allow-nolease-other-');
  process.env.CUSTODIAN_PLAN_PATH = twoNodesPlan;
  try {
    const input = baseStopInput();
    const absentResult = await decide(input, { projectRoot: absentRoot });
    assert.equal(absentResult.decision, 'allow');
    assert.match(absentResult.stderr, /CUSTODIAN-LEASE absent/);

    fs.writeFileSync(path.join(otherRoot, 'CUSTODIAN-LEASE'), `lease: some-other-session refreshed: ${new Date().toISOString()}\n`);
    const otherResult = await decide(input, { projectRoot: otherRoot });
    assert.equal(otherResult.decision, 'allow');
    assert.match(otherResult.stderr, /another session's lease/);
  } finally {
    delete process.env.CUSTODIAN_PLAN_PATH;
  }
});

// RECORDED MUTATION: leaseHeldBy's `match[1] !== sessionId` operator flipped to `===` (the id
// comparison inverted) -> `stop-queue: blocks as before when CUSTODIAN-LEASE holds this session's
// own lease` fails: decision 'allow' where 'block' is expected.
test('stop-queue: blocks as before when CUSTODIAN-LEASE holds this session\'s own lease', async () => {
  const projectRoot = makeTempDir('stop-block-own-lease-');
  process.env.CUSTODIAN_PLAN_PATH = twoNodesPlan;
  try {
    const input = baseStopInput();
    writeHeldLease(projectRoot, input.session_id);
    const result = await decide(input, { projectRoot });
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
    const input = baseStopInput();
    writeHeldLease(projectRoot, input.session_id);
    const result = await decide(input, { projectRoot });
    assert.equal(result.decision, 'allow');
    assert.match(result.stderr, /waiting on human/);
  } finally {
    delete process.env.CUSTODIAN_PLAN_PATH;
  }
});

test('stop-queue: allows on non-empty background_tasks, before even reading the plan', async () => {
  const projectRoot = makeTempDir('stop-allow-bg-');
  // No CUSTODIAN_PLAN_PATH set and no PLAN.yaml in projectRoot -- if this reached step 5 it would
  // still allow (missing plan), but we assert the earlier, more specific reason fires first. The
  // session holds the lease, so the lease check (step 2) passes; projectRoot is not a repository,
  // so the continuity step (step 3) is not judged and passes.
  const input = baseStopInput({ background_tasks: [{ id: 'bg-1' }] });
  writeHeldLease(projectRoot, input.session_id);
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
    writeHeldLease(projectRoot, sessionId);
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
    const input = baseStopInput();
    writeHeldLease(projectRoot, input.session_id);
    const result = await decide(input, { projectRoot });
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
    const input = baseStopInput();
    writeHeldLease(projectRoot, input.session_id);
    const result = await decide(input, { projectRoot });
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
    const input = baseStopInput();
    writeHeldLease(projectRoot, input.session_id);
    await decide(input, { projectRoot });
    const dedupePath = path.join(projectRoot, '.claude', 'state', 'telegram-sent.json');
    assert.ok(fs.existsSync(dedupePath), 'expected a dedupe record to be written');
    const before = JSON.parse(fs.readFileSync(dedupePath, 'utf8'));
    assert.equal(Object.keys(before).length, 1);

    // A second allow for the same waiting set, moments later, from a DIFFERENT session (its own
    // held lease) -- the dedupe key is on the waiting set, not the session, so this must still
    // not add a second key.
    const secondInput = baseStopInput();
    writeHeldLease(projectRoot, secondInput.session_id);
    await decide(secondInput, { projectRoot });
    const after = JSON.parse(fs.readFileSync(dedupePath, 'utf8'));
    assert.deepEqual(before, after);
  } finally {
    delete process.env.CUSTODIAN_PLAN_PATH;
  }
});

test('stop-queue CLI: piping stdin JSON blocks on the two-node fixture', () => {
  const projectRoot = makeTempDir('stop-cli-');
  const scriptPath = path.join(here, 'stop-queue.mjs');
  const input = baseStopInput();
  writeHeldLease(projectRoot, input.session_id);
  const result = spawnSync(process.execPath, [scriptPath], {
    input: JSON.stringify(input),
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
    const input = baseStopInput();
    writeHeldLease(projectRoot, input.session_id);
    const result = await decide(input, { projectRoot });
    assert.equal(result.decision, 'allow');
    assert.match(result.stderr, /no PLAN\.yaml/);
  } finally {
    delete process.env.CUSTODIAN_PLAN_PATH;
  }
});

// ---------------------------------------------------------------------------
// stop-queue.mjs — the continuity step (STOP-HOOK-STALE-CONTINUITY-PREREGISTRATION.md §4).
// ---------------------------------------------------------------------------

// RECORDED MUTATION: judgeContinuity's `===` between the two flushed_at values inverted to `!==` ->
// `stop-queue: blocks on a stale continuity block after an entry-only ledger commit`
// fails, first failing assertion: the queue reason is returned where the stale reason is expected
// (the reason equality assertion). Observed at merge commit 4b1f641 with this change.
test('stop-queue: blocks on a stale continuity block after an entry-only ledger commit', async (t) => {
  const { dir, input } = stopFixtureS1(t);
  const result = await decide(input, { projectRoot: dir });
  assert.equal(result.decision, 'block');
  assert.equal(result.reason, staleReason(dir, 'HEAD', FLUSH_A));
});

// RECORDED MUTATION: the flushed_at comparison replaced by `stale: true`, so any ledger commit reads
// stale -> `stop-queue: a flush-only ledger commit reads fresh` fails, first failing
// assertion: the reason matches the stale text where /^next: two-nodes-ready/ is expected. Observed
// at merge commit 4b1f641 with this change.
test('stop-queue: a flush-only ledger commit reads fresh', async (t) => {
  const { dir, input } = stopFixtureS1(t);
  commitLedger(dir, { flushedAt: FLUSH_B, entries: 2 }, 'c2 flush only');
  const result = await decide(input, { projectRoot: dir });
  assert.equal(result.decision, 'block');
  assert.match(result.reason, /^next: two-nodes-ready/);
});

// RECORDED MUTATION: fresh required a commit that changes only the block (stale also when the text
// outside the block differs) ->
// `stop-queue: an entry and a flush in one ledger commit read fresh` fails, first failing
// assertion: the reason matches the stale text where /^next: two-nodes-ready/ is expected. Observed
// at merge commit 4b1f641 with this change.
test('stop-queue: an entry and a flush in one ledger commit read fresh', async (t) => {
  const { dir, input } = stopFixture(t);
  commitLedger(dir, { flushedAt: FLUSH_B, entries: 2 }, 'c1 entry plus flush');
  const result = await decide(input, { projectRoot: dir });
  assert.equal(result.decision, 'block');
  assert.match(result.reason, /^next: two-nodes-ready/);
});

// RECORDED MUTATION: the background_tasks allow moved back to the first step of decide ->
// `stop-queue: the continuity check runs before the background-tasks allow` fails, first
// failing assertion: decision 'allow' where 'block' is expected. Observed at merge commit 4b1f641
// with this change.
test('stop-queue: the continuity check runs before the background-tasks allow', async (t) => {
  const { dir, input } = stopFixtureS1(t);
  const result = await decide({ ...input, background_tasks: [{ id: 'bg-1' }] }, { projectRoot: dir });
  assert.equal(result.decision, 'block');
  assert.equal(result.reason, staleReason(dir, 'HEAD', FLUSH_A));
});

// RECORDED MUTATION: the continuity step moved ahead of the override and HALT step ->
// `stop-queue: the override and HALT still allow over a stale block` fails, first failing
// assertion: decision 'block' where 'allow' is expected (the override case). Observed at merge
// commit 4b1f641 with this change.
test('stop-queue: the override and HALT still allow over a stale block', async (t) => {
  const { dir, input } = stopFixtureS1(t);
  process.env.CUSTODIAN_STOP_HOOK = 'off';
  try {
    const overridden = await decide(input, { projectRoot: dir });
    assert.equal(overridden.decision, 'allow');
    assert.match(overridden.stderr, /CUSTODIAN_STOP_HOOK=off/);
  } finally {
    delete process.env.CUSTODIAN_STOP_HOOK;
  }
  fs.writeFileSync(path.join(dir, 'state', 'CUSTODIAN-HALT'), 'halted for the drill\n'); // untracked
  const halted = await decide(input, { projectRoot: dir });
  assert.equal(halted.decision, 'allow');
  assert.match(halted.stderr, /^HALT: halted for the drill/);
});

// RECORDED MUTATION: the continuity step moved ahead of the lease check ->
// `stop-queue: a session without the lease allows over a stale block` fails, first failing
// assertion: decision 'block' where 'allow' is expected (the absent-lease case). Observed at merge
// commit 4b1f641 with this change.
test('stop-queue: a session without the lease allows over a stale block', async (t) => {
  const { dir, input } = stopFixtureS1(t);
  fs.rmSync(path.join(dir, 'CUSTODIAN-LEASE'));
  const absent = await decide(input, { projectRoot: dir });
  assert.equal(absent.decision, 'allow');
  assert.match(absent.stderr, /CUSTODIAN-LEASE absent/);

  writeHeldLease(dir, 'some-other-session');
  const other = await decide(input, { projectRoot: dir });
  assert.equal(other.decision, 'allow');
  assert.match(other.stderr, /another session's lease/);
});

// RECORDED MUTATION: the cap result ignored in the stale branch, which blocks without reading the
// caps -> `stop-queue: the caps end the turn on a stale block` fails, first failing
// assertion: decision 'block' where 'allow' is expected (the session-cap phase). Observed at merge
// commit 4b1f641 with this change.
test('stop-queue: the caps end the turn on a stale block', async (t) => {
  const { dir, input } = stopFixtureS1(t);
  const now = new Date();
  const files = stopStatePaths(dir, input.session_id, now);
  const below = { consecutive: SESSION_CONSECUTIVE_CAP - 1, lastHead: null, lastPlanHash: null };

  writeJsonFile(files.session, below);
  const underCap = await decide(input, { projectRoot: dir, now });
  assert.equal(underCap.decision, 'block');
  assert.equal(underCap.reason, staleReason(dir, 'HEAD', FLUSH_A));
  assert.equal(readJsonFile(files.session).consecutive, SESSION_CONSECUTIVE_CAP);

  fs.rmSync(files.daily);
  const atSession = await decide(input, { projectRoot: dir, now });
  assert.equal(atSession.decision, 'allow');
  assert.match(atSession.stderr, /session continuation cap/);
  assert.equal(fs.existsSync(files.daily), false, 'a capped stop records nothing');

  writeJsonFile(files.session, below);
  writeJsonFile(files.daily, { count: DAILY_CONTINUATION_CAP });
  const atDaily = await decide(input, { projectRoot: dir, now });
  assert.equal(atDaily.decision, 'allow');
  assert.match(atDaily.stderr, /daily continuation cap/);
  assert.deepEqual(readJsonFile(files.daily), { count: DAILY_CONTINUATION_CAP });
});

// RECORDED MUTATION: the accounting routine writes no state when it is called for a stale block ->
// `stop-queue: a stale block counts as a continuation and a new HEAD resets the count`
// fails, first failing assertion: 'a stale block records its continuation' (the session state file
// does not exist). Observed at merge commit 4b1f641 with this change.
test('stop-queue: a stale block counts as a continuation and a new HEAD resets the count', async (t) => {
  const { dir, input } = stopFixtureS1(t);
  const now = new Date();
  const files = stopStatePaths(dir, input.session_id, now);
  const expectStale = async () => {
    const r = await decide(input, { projectRoot: dir, now });
    assert.equal(r.decision, 'block');
    assert.equal(r.reason, staleReason(dir, 'HEAD', FLUSH_A));
  };

  await expectStale();
  assert.ok(fs.existsSync(files.session), 'a stale block records its continuation');
  await expectStale();
  const head1 = headOf(dir);
  assert.deepEqual(readJsonFile(files.session), { consecutive: 2, lastHead: head1, lastPlanHash: null });
  assert.deepEqual(readJsonFile(files.daily), { count: 2 });

  commitLedger(dir, { flushedAt: FLUSH_B, entries: 2 }, 'c2 flush only');
  const queued = await decide(input, { projectRoot: dir, now });
  assert.match(queued.reason, /^next: two-nodes-ready/);
  const afterQueue = readJsonFile(files.session);
  assert.equal(afterQueue.consecutive, 1);
  assert.equal(afterQueue.lastHead, headOf(dir));
  assert.equal(typeof afterQueue.lastPlanHash, 'string');
  assert.deepEqual(readJsonFile(files.daily), { count: 3 });

  // A stale block again: the new HEAD resets the count, and the stored plan hash is written back.
  commitLedger(dir, { flushedAt: FLUSH_B, entries: 3 }, 'c3 entry only');
  const again = await decide(input, { projectRoot: dir, now });
  assert.equal(again.reason, staleReason(dir, 'HEAD', FLUSH_B));
  assert.deepEqual(readJsonFile(files.session), { consecutive: 1, lastHead: headOf(dir), lastPlanHash: afterQueue.lastPlanHash });
  assert.deepEqual(readJsonFile(files.daily), { count: 4 });
});

// RECORDED MUTATION: a null `git log` result read as stale ->
// `stop-queue: the continuity check fails open when git cannot read the ledger history`
// fails, first failing assertion: the reason matches the stale text where /^next: two-nodes-ready/
// is expected (S4a). Observed at merge commit 4b1f641 with this change.
test('stop-queue: the continuity check fails open when git cannot read the ledger history', async (t) => {
  // S4a: a directory that is not a repository, holding the ledger file.
  const bare = makeTempDir('stop-continuity-norepo-');
  t.after(() => fs.rmSync(bare, { recursive: true, force: true, maxRetries: 3 }));
  writeLedger(bare, {});
  process.env.CUSTODIAN_PLAN_PATH = twoNodesPlan;
  t.after(() => {
    delete process.env.CUSTODIAN_PLAN_PATH;
  });
  const input = baseStopInput();
  writeHeldLease(bare, input.session_id);
  const prevCeiling = process.env.GIT_CEILING_DIRECTORIES;
  process.env.GIT_CEILING_DIRECTORIES = path.dirname(bare); // no enclosing repository is discovered
  try {
    const notRepo = await decide(input, { projectRoot: bare });
    assert.equal(notRepo.decision, 'block');
    assert.match(notRepo.reason, /^next: two-nodes-ready/);
    assert.match(notRepo.stderr, /stop-queue: continuity not judged \(git log failed\); the stop continues to the next step\./);
  } finally {
    if (prevCeiling === undefined) delete process.env.GIT_CEILING_DIRECTORIES;
    else process.env.GIT_CEILING_DIRECTORIES = prevCeiling;
  }

  // S4b: a repository whose only commit lacks the ledger -- no ledger commit, nothing to judge, no line.
  const { dir, input: input2 } = stopFixture(t, { ledger: false });
  const noLedger = await decide(input2, { projectRoot: dir });
  assert.equal(noLedger.decision, 'block');
  assert.match(noLedger.reason, /^next: two-nodes-ready/);
  assert.doesNotMatch(noLedger.stderr, /continuity not judged/);
});

// RECORDED MUTATION: the parent copy read at `<c>^2` instead of `<c>^1` ->
// `stop-queue: a merge is judged against its first parent` fails, first failing assertion:
// the queue reason is returned where the stale reason is expected (the reason equality assertion).
// Observed at merge commit 4b1f641 with this change.
test('stop-queue: a merge is judged against its first parent', async (t) => {
  // S5: the merge differs from both parents, so it is the newest ledger commit; its first parent
  // already carries flushed_at B.
  const { dir, input } = stopFixture(t);
  const mainBranch = git(dir, ['rev-parse', '--abbrev-ref', 'HEAD']).trim();
  git(dir, ['checkout', '-q', '-b', 'side']);
  commitLedger(dir, { flushedAt: FLUSH_A, entries: 2 }, 's1 entry only');
  git(dir, ['checkout', '-q', mainBranch]);
  commitLedger(dir, { flushedAt: FLUSH_B, entries: 1 }, 'm1 flush only');
  git(dir, ['merge', '-q', '--no-ff', '-m', 'merge side', 'side']);
  const result = await decide(input, { projectRoot: dir });
  assert.equal(result.decision, 'block');
  assert.equal(result.reason, staleReason(dir, 'HEAD', FLUSH_B));
});

// RECORDED MUTATION: `--first-parent` added to the `git log` walk ->
// `stop-queue: a merge that takes the side's ledger is judged at the side's newest ledger commit`
// fails, first failing assertion: the queue reason is returned where the stale reason is expected
// (the reason equality assertion). Observed at merge commit 4b1f641 with this change.
test("stop-queue: a merge that takes the side's ledger is judged at the side's newest ledger commit", async (t) => {
  // S6: the merge's ledger equals its second parent's, so the walk follows that side to s2.
  const { dir, input } = stopFixture(t);
  const mainBranch = git(dir, ['rev-parse', '--abbrev-ref', 'HEAD']).trim();
  git(dir, ['checkout', '-q', '-b', 'side']);
  commitLedger(dir, { flushedAt: FLUSH_B, entries: 1 }, 's1 flush only');
  commitLedger(dir, { flushedAt: FLUSH_B, entries: 2 }, 's2 entry only');
  git(dir, ['checkout', '-q', mainBranch]);
  fs.appendFileSync(path.join(dir, 'README.md'), 'more\n');
  commitPaths(dir, ['README.md'], 'm1 README only');
  git(dir, ['merge', '-q', '--no-ff', '-m', 'merge side', 'side']);
  const result = await decide(input, { projectRoot: dir });
  assert.equal(result.decision, 'block');
  assert.equal(result.reason, staleReason(dir, headOf(dir, 'side'), FLUSH_B));
});

// RECORDED MUTATION: a missing parent copy read as stale ->
// `stop-queue: a ledger commit with no first-parent copy reads fresh` fails, first failing
// assertion: the reason matches the stale text where /^next: two-nodes-ready/ is expected. Observed
// at merge commit 4b1f641 with this change.
test('stop-queue: a ledger commit with no first-parent copy reads fresh', async (t) => {
  const { dir, input } = stopFixture(t); // S7: c0 only, a root commit
  const result = await decide(input, { projectRoot: dir });
  assert.equal(result.decision, 'block');
  assert.match(result.reason, /^next: two-nodes-ready/);
});

// RECORDED MUTATION: the block read from the working tree instead of the commit's blob ->
// `stop-queue: an uncommitted flush does not clear a stale block` fails, first failing
// assertion: the queue reason is returned where the stale reason is expected (the reason equality
// assertion). Observed at merge commit 4b1f641 with this change.
test('stop-queue: an uncommitted flush does not clear a stale block', async (t) => {
  const { dir, input } = stopFixtureS1(t);
  writeLedger(dir, { flushedAt: FLUSH_B, entries: 2 }); // S8: rewritten in the working tree, never committed
  const result = await decide(input, { projectRoot: dir });
  assert.equal(result.decision, 'block');
  assert.equal(result.reason, staleReason(dir, 'HEAD', FLUSH_A));
});

// RECORDED MUTATION: flushed_at read by a raw `\n` split that keeps the `\r` ->
// `stop-queue: a CRLF ledger blob with an unchanged flushed_at reads stale` fails, first
// failing assertion: the queue reason is returned where the stale reason is expected (the reason
// equality assertion). Observed at merge commit 4b1f641 with this change.
test('stop-queue: a CRLF ledger blob with an unchanged flushed_at reads stale', async (t) => {
  const { dir, input } = stopFixture(t);
  commitLedger(dir, { flushedAt: FLUSH_A, entries: 2, eol: '\r\n' }, 'c1 CRLF plus an entry');
  assert.ok(git(dir, ['show', `HEAD:${LEDGER_PATHSPEC}`]).includes('\r\n'), 'the fixture blob keeps its CRLF');
  const result = await decide(input, { projectRoot: dir });
  assert.equal(result.decision, 'block');
  assert.equal(result.reason, staleReason(dir, 'HEAD', FLUSH_A));
});

// RECORDED MUTATION: the `maxBuffer` option dropped from the continuity git calls ->
// `stop-queue: a ledger over 1 MiB is still judged` fails, first failing assertion: the
// queue reason is returned where the stale reason is expected (the reason equality assertion).
// Observed at merge commit 4b1f641 with this change.
test('stop-queue: a ledger over 1 MiB is still judged', async (t) => {
  const { dir, input } = stopFixture(t, { ledgerOpts: { padLines: 32768 } }); // 2 MiB
  commitLedger(dir, { flushedAt: FLUSH_A, entries: 2, padLines: 32768 }, 'c1 entry only');
  assert.ok(Number(git(dir, ['cat-file', '-s', `HEAD:${LEDGER_PATHSPEC}`])) > 1024 * 1024, 'the fixture blob is over 1 MiB');
  const result = await decide(input, { projectRoot: dir });
  assert.equal(result.decision, 'block');
  assert.equal(result.reason, staleReason(dir, 'HEAD', FLUSH_A));
});

// RECORDED MUTATION: the continuity step removed from decide (judged as fresh) ->
// `stop-queue CLI: a stale ledger blocks with the continuity reason through the shipped entry`
// fails, first failing assertion: the CLI's reason is the queue reason where the stale reason is
// expected. Observed at merge commit 4b1f641 with this change.
test('stop-queue CLI: a stale ledger blocks with the continuity reason through the shipped entry', (t) => {
  const { dir, input } = stopFixtureS1(t);
  const scriptPath = path.join(here, 'stop-queue.mjs');
  const result = spawnSync(process.execPath, [scriptPath], {
    input: JSON.stringify(input),
    encoding: 'utf8',
    env: { ...process.env, CLAUDE_PROJECT_DIR: dir, CUSTODIAN_PLAN_PATH: twoNodesPlan },
  });
  assert.equal(result.status, 0);
  const parsed = JSON.parse(result.stdout);
  assert.equal(parsed.decision, 'block');
  assert.equal(parsed.reason, staleReason(dir, 'HEAD', FLUSH_A));
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

test('precompact-flush: flushed_at predating the last ledger change is stale (hash equality is not freshness)', () => {
  // The block's tip lines up with HEAD, the tree is clean and pushed -- yet a ledger change below
  // HEAD is NEWER than flushed_at, so the block does not reflect the latest state. Stale.
  const dir = makeGitRepo();
  const fakeHead = 'deadbeefdeadbeefdeadbeefdeadbeefdeadbeef';
  const flushedAt = new Date('2026-09-15T12:00:00Z').toISOString();
  const laterLedgerChange = '2026-09-15T12:03:00Z'; // 3 minutes AFTER the flush
  writeCutState(dir, `# CUT-STATE\n\n## SESSION-CONTINUITY\nflushed_at: ${flushedAt}\ntip: ${fakeHead}\n`);
  const fakeGit = (args) => {
    if (args[0] === 'log') return laterLedgerChange;
    if (args[0] === 'rev-parse' && args[1] === 'HEAD') return fakeHead;
    if (args[0] === 'status') return '';
    if (args[0] === 'rev-parse' && args[1] === '@{u}') return fakeHead;
    if (args[0] === 'merge-base' && args[1] === '--is-ancestor') return '';
    return null;
  };
  // now = just after the later ledger change, so the 10-minute window is not what fails it.
  const fresh = checkFreshness(dir, { now: new Date('2026-09-15T12:04:00Z'), git: fakeGit });
  assert.equal(fresh.fresh, false);
  assert.match(fresh.reason, /predates the last ledger change/);
});

test('precompact-flush: flushed_at at/after the last ledger change is fresh', () => {
  const dir = makeGitRepo();
  const fakeHead = 'deadbeefdeadbeefdeadbeefdeadbeefdeadbeef';
  const flushedAt = new Date('2026-09-15T12:05:00Z').toISOString();
  const earlierLedgerChange = '2026-09-15T12:00:00Z'; // BEFORE the flush
  writeCutState(dir, `# CUT-STATE\n\n## SESSION-CONTINUITY\nflushed_at: ${flushedAt}\ntip: ${fakeHead}\n`);
  const fakeGit = (args) => {
    if (args[0] === 'log') return earlierLedgerChange;
    if (args[0] === 'rev-parse' && args[1] === 'HEAD') return fakeHead;
    if (args[0] === 'status') return '';
    if (args[0] === 'rev-parse' && args[1] === '@{u}') return fakeHead;
    if (args[0] === 'merge-base' && args[1] === '--is-ancestor') return '';
    return null;
  };
  assert.deepEqual(checkFreshness(dir, { now: new Date('2026-09-15T12:06:00Z'), git: fakeGit }), { fresh: true });
});

test('precompact-flush: flushed_at more than 10 minutes old is stale (window tightened 2026-09-15)', () => {
  const dir = makeGitRepo();
  const fakeHead = 'deadbeefdeadbeefdeadbeefdeadbeefdeadbeef';
  const flushedAt = new Date('2026-09-15T12:00:00Z').toISOString();
  writeCutState(dir, `# CUT-STATE\n\n## SESSION-CONTINUITY\nflushed_at: ${flushedAt}\ntip: ${fakeHead}\n`);
  const fakeGit = () => ''; // never reached: the window check runs before any git
  // 11 minutes after the flush -- inside the old 20-minute window, outside the new 10-minute one.
  const fresh = checkFreshness(dir, { now: new Date('2026-09-15T12:11:00Z'), git: fakeGit });
  assert.equal(fresh.fresh, false);
  assert.match(fresh.reason, /more than 10 minutes old/);
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
    if (args[0] === 'status') return '?? state/drafts/\n?? scratch.txt';
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

// RECORDED MUTATION: the state/directives/ line placed after the PRECEDENTS.md line in READING_ORDER
// ->
// `session-resume: the reading order names state/directives/ after DECISIONS-PENDING.md and before PRECEDENTS.md (AUTONOMY.md §26)`
// fails, first failing assertion: 'directly after DECISIONS-PENDING.md' (actual index 5, expected
// 4). Observed at merge commit 4b1f641 with this change.
test('session-resume: the reading order names state/directives/ after DECISIONS-PENDING.md and before PRECEDENTS.md (AUTONOMY.md §26)', () => {
  const lines = READING_ORDER.split('\n');
  const at = (needle) => lines.findIndex((l) => l.includes(needle));
  const pending = at('DECISIONS-PENDING.md');
  const directives = at('state/directives/');
  const precedents = at('PRECEDENTS.md');
  assert.ok(pending >= 0 && precedents >= 0, 'the neighbouring steps exist');
  assert.equal(directives, pending + 1, 'directly after DECISIONS-PENDING.md');
  assert.equal(precedents, directives + 1, 'directly before PRECEDENTS.md');
  assert.equal(lines[directives], "4. state/directives/ — the human's instructions, recorded verbatim, newest first.");
  assert.match(lines[precedents], /^5\. PRECEDENTS\.md/);
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
