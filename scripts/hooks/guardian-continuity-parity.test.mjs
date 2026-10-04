// The parity test of Guardian v0 (tools/mods/GUARDIAN-V0-PREREGISTRATION.md section 2.13, T35 and
// T36). N1's staleness check in the mod (tools/mods/spatial-guardian/hooks/continuity.mjs) restates
// the Stop hook's predicate, because a mod cannot import a repository file. This test holds the two
// together: one fixture set, each fixture built once into one fresh os.tmpdir() repository, read by
// both sides.
//
//   - The mod's side is judgeContinuity from the module N1 calls, unchanged, driven by a Node runner
//     shaped to the engine's process-run result.
//   - The Stop hook's side is the shipped `decide` from ./stop-queue.mjs, never a restated copy, with
//     projectRoot set to the fixture, a lease this session holds, and background_tasks non-empty, so
//     a fresh or not-judged block ends at the background-tasks allow and the plan is never read.
//
// A divergence on any fixture fails its subtest, so governance-ci and the reviewer's local run go red.

import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';

import { decide } from './stop-queue.mjs';
import { judgeContinuity } from '../../tools/mods/spatial-guardian/hooks/continuity.mjs';

// ---------------------------------------------------------------------------
// The environment: a synthetic Telegram config, and none of the overrides that would end the Stop
// hook's decision before its continuity step. Restored after. There is no network: HALT's fetch fails
// in a repository with no remote.
// ---------------------------------------------------------------------------

const ENV_DELETED = ['CUSTODIAN_STOP_HOOK', 'CUSTODIAN_TELEGRAM_BOT_TOKEN', 'CUSTODIAN_TELEGRAM_CHAT_ID', 'CLAUDE_CODE_REMOTE'];
const ENV_TOUCHED = ['CUSTODIAN_TELEGRAM_DRY_RUN', ...ENV_DELETED];
const savedEnv = new Map();

before(() => {
  for (const name of ENV_TOUCHED) savedEnv.set(name, process.env[name]);
  process.env.CUSTODIAN_TELEGRAM_DRY_RUN = '1';
  for (const name of ENV_DELETED) delete process.env[name];
});

after(() => {
  for (const [name, value] of savedEnv) {
    if (value === undefined) delete process.env[name];
    else process.env[name] = value;
  }
});

// ---------------------------------------------------------------------------
// The fixture helpers, restated from hooks.test.mjs (importing a test file runs its tests): real git in
// a fresh os.tmpdir() repository, local identity, core.autocrlf false, `* -text` in .git/info/attributes,
// argument arrays, no shell, literal `/` in git paths, and no branch name assumed.
// ---------------------------------------------------------------------------

const FLUSH_A = '2026-10-01T00:00:00Z';
const FLUSH_B = '2026-10-01T01:00:00Z';
const LEDGER_PATHSPEC = 'state/CUT-STATE.md';

function git(dir, args) {
  return execFileSync('git', args, { cwd: dir, encoding: 'utf8' });
}

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

// c0: README plus a ledger holding a block with flushed_at A, then `## Ledger` and one entry.
// `ledger: false` makes the one commit README-only.
function initRepoWithC0(dir, { ledger = true, ledgerOpts = {} } = {}) {
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
}

function currentBranch(dir) {
  return git(dir, ['rev-parse', '--abbrev-ref', 'HEAD']).trim();
}

// ---------------------------------------------------------------------------
// The one fixture set (section 2.13, section 3's parity rows): one { id, build(dir) } per row, here
// and nowhere else. `build` fills a fresh empty directory.
// ---------------------------------------------------------------------------

const FIXTURES = [
  {
    id: 'PS1', // S1: c0, then c1 entry-only
    build(dir) {
      initRepoWithC0(dir);
      commitLedger(dir, { flushedAt: FLUSH_A, entries: 2 }, 'c1 entry only');
    },
  },
  {
    id: 'PS2', // S2: PS1, then c2 flush-only (B)
    build(dir) {
      initRepoWithC0(dir);
      commitLedger(dir, { flushedAt: FLUSH_A, entries: 2 }, 'c1 entry only');
      commitLedger(dir, { flushedAt: FLUSH_B, entries: 2 }, 'c2 flush only');
    },
  },
  {
    id: 'PS3', // S3: c0, then c1 entry plus flush (B)
    build(dir) {
      initRepoWithC0(dir);
      commitLedger(dir, { flushedAt: FLUSH_B, entries: 2 }, 'c1 entry plus flush');
    },
  },
  {
    id: 'PS4a', // S4a: a non-repository directory holding the ledger file
    build(dir) {
      writeLedger(dir, {});
    },
  },
  {
    id: 'PS4b', // S4b: one commit, README only
    build(dir) {
      initRepoWithC0(dir, { ledger: false });
    },
  },
  {
    id: 'PS5', // S5: c0; side s1 entry-only; main m1 flush-only (B); merge --no-ff differs from both
    build(dir) {
      initRepoWithC0(dir);
      const main = currentBranch(dir);
      git(dir, ['checkout', '-q', '-b', 'side']);
      commitLedger(dir, { flushedAt: FLUSH_A, entries: 2 }, 's1 entry only');
      git(dir, ['checkout', '-q', main]);
      commitLedger(dir, { flushedAt: FLUSH_B, entries: 1 }, 'm1 flush only');
      git(dir, ['merge', '-q', '--no-ff', '-m', 'merge side', 'side']);
    },
  },
  {
    id: 'PS6', // S6: c0; side s1 flush (B), s2 entry-only; main m1 README-only; merge M matches s2
    build(dir) {
      initRepoWithC0(dir);
      const main = currentBranch(dir);
      git(dir, ['checkout', '-q', '-b', 'side']);
      commitLedger(dir, { flushedAt: FLUSH_B, entries: 1 }, 's1 flush only');
      commitLedger(dir, { flushedAt: FLUSH_B, entries: 2 }, 's2 entry only');
      git(dir, ['checkout', '-q', main]);
      fs.appendFileSync(path.join(dir, 'README.md'), 'more\n');
      commitPaths(dir, ['README.md'], 'm1 README only');
      git(dir, ['merge', '-q', '--no-ff', '-m', 'merge side', 'side']);
    },
  },
  {
    id: 'PS7', // S7: c0 only
    build(dir) {
      initRepoWithC0(dir);
    },
  },
  {
    id: 'PS8', // S8: PS1, plus the working-tree block rewritten to B, uncommitted
    build(dir) {
      initRepoWithC0(dir);
      commitLedger(dir, { flushedAt: FLUSH_A, entries: 2 }, 'c1 entry only');
      writeLedger(dir, { flushedAt: FLUSH_B, entries: 2 });
    },
  },
  {
    id: 'PS9', // S9: c0 (LF), then c1 whole-file CRLF plus an entry, flushed_at A
    build(dir) {
      initRepoWithC0(dir);
      commitLedger(dir, { flushedAt: FLUSH_A, entries: 2, eol: '\r\n' }, 'c1 CRLF plus an entry');
    },
  },
  {
    id: 'PS10', // S10: c0 padded to 2 MiB, then c1 entry-only
    build(dir) {
      initRepoWithC0(dir, { ledgerOpts: { padLines: 32768 } });
      commitLedger(dir, { flushedAt: FLUSH_A, entries: 2, padLines: 32768 }, 'c1 entry only');
    },
  },
  {
    id: 'PS18', // Amendment 2, item 2 (T18): c1 commits a block with no flushed_at line
    build(dir) {
      initRepoWithC0(dir);
      const noFlushedAt = '# CUT-STATE\n\n## SESSION-CONTINUITY\ntip: 0000000000000000000000000000000000000000\n\n## Ledger\n\n- entry 1\n';
      fs.writeFileSync(path.join(dir, 'state', 'CUT-STATE.md'), noFlushedAt);
      commitPaths(dir, [LEDGER_PATHSPEC], 'c1 a block with no flushed_at');
    },
  },
  {
    id: 'PS19', // Amendment 2, item 2 (T19): c1 removes state/CUT-STATE.md
    build(dir) {
      initRepoWithC0(dir);
      git(dir, ['rm', '-q', '--', LEDGER_PATHSPEC]);
      git(dir, ['commit', '-q', '-m', 'c1 removes the ledger']);
    },
  },
];

// ---------------------------------------------------------------------------
// The two sides. Outcomes are one of: stale, fresh, not judged.
// ---------------------------------------------------------------------------

const STOP_RUN_OPTS = { timeout: 2000, maxBuffer: 64 * 1024 * 1024 };
const ENGINE_STDOUT_BOUND = 4194304;

// The two openings are the stale-continuity form's section 7 texts, written out here as hooks.test.mjs
// writes out its reason, and not imported.
const STALE_OPENING = 'stale SESSION-CONTINUITY: the newest commit touching state/CUT-STATE.md is ';
const NOT_JUDGED_OPENING = 'stop-queue: continuity not judged (';

// The mod's side. `run` is shaped to the engine's process-run result: it rejects when the child
// cannot start or outruns its timeout, and otherwise resolves { exitCode, stdout, stderr,
// isStdoutTruncated, isStderrTruncated }. It never models a truncation, so it records any stdout at or
// over the engine's bound, and the fixture then fails.
async function modOutcome(dir, oversize) {
  const run = async (args) => {
    const r = spawnSync('git', args, { cwd: dir, encoding: 'utf8', ...STOP_RUN_OPTS });
    if (r.error) throw r.error;
    if (Buffer.byteLength(r.stdout, 'utf8') >= ENGINE_STDOUT_BOUND) oversize.push(args.join(' '));
    return { exitCode: r.status ?? 1, stdout: r.stdout, stderr: r.stderr, isStdoutTruncated: false, isStderrTruncated: false };
  };
  const verdict = await judgeContinuity(run);
  if (!verdict.judged) return 'not judged';
  return verdict.stale ? 'stale' : 'fresh';
}

// The Stop hook's side: the shipped `decide`, with a lease this session holds written untracked.
async function stopOutcome(dir) {
  const sessionId = `parity-${Math.random().toString(36).slice(2)}`;
  fs.writeFileSync(path.join(dir, 'CUSTODIAN-LEASE'), `lease: ${sessionId} refreshed: ${new Date().toISOString()}\n`);
  const input = {
    session_id: sessionId,
    cwd: dir,
    hook_event_name: 'Stop',
    stop_hook_active: false,
    last_assistant_message: '',
    background_tasks: [{ id: 'bg-1' }],
    session_crons: [],
  };
  const result = await decide(input, { projectRoot: dir });
  if (result.decision === 'block' && result.reason.startsWith(STALE_OPENING)) return 'stale';
  if (result.stderr.includes(NOT_JUDGED_OPENING)) return 'not judged';
  return 'fresh';
}

// Builds every fixture once and reads it with both sides. Memoised: T35 and T36 share the result.
const dirs = [];
let computing;

function computeAll() {
  computing ??= (async () => {
    const results = new Map();
    for (const fx of FIXTURES) {
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'guardian-parity-'));
      dirs.push(dir);
      const previousCeiling = process.env.GIT_CEILING_DIRECTORIES;
      process.env.GIT_CEILING_DIRECTORIES = path.dirname(dir); // no enclosing repository is discovered
      try {
        fx.build(dir);
        const oversize = [];
        const mod = await modOutcome(dir, oversize);
        const stop = await stopOutcome(dir);
        results.set(fx.id, { mod, stop, oversize });
      } catch (error) {
        results.set(fx.id, { error });
      } finally {
        if (previousCeiling === undefined) delete process.env.GIT_CEILING_DIRECTORIES;
        else process.env.GIT_CEILING_DIRECTORIES = previousCeiling;
      }
    }
    return results;
  })();
  return computing;
}

after(() => {
  for (const dir of dirs) fs.rmSync(dir, { recursive: true, force: true, maxRetries: 3 });
});

// RECORDED MUTATION: continuity.mjs reading a failed `git log` as judged fresh (`if (c === null)
// return { judged: true, stale: false }`) -> fails: `PS4a`, `guardian parity: the mod's stale-block
// check and the Stop hook's stale-continuity check agree on every fixture`. Observed at 54eba872 with
// this change, node --version v24.18.1 and git --version 2.49.0.windows.1.
// RECORDED MUTATION: in the working tree only and reverted, never committed: stop-queue.mjs's
// judgeContinuity comparison inverted (`stale: current.flushedAt !== parent.flushedAt`) -> fails:
// `PS1`, `PS2`, `PS3`, `PS5`, `PS6`, `PS8`, `PS9`, `PS10`, `guardian parity: the mod's stale-block
// check and the Stop hook's stale-continuity check agree on every fixture`. Observed at 54eba872 with
// this change, node --version v24.18.1 and git --version 2.49.0.windows.1.
test("guardian parity: the mod's stale-block check and the Stop hook's stale-continuity check agree on every fixture", async (t) => {
  assert.deepEqual(
    FIXTURES.map((fx) => fx.id),
    ['PS1', 'PS2', 'PS3', 'PS4a', 'PS4b', 'PS5', 'PS6', 'PS7', 'PS8', 'PS9', 'PS10', 'PS18', 'PS19'],
    'the fixture set is exactly the thirteen declared ids',
  );
  const results = await computeAll();
  for (const fx of FIXTURES) {
    await t.test(fx.id, () => {
      const r = results.get(fx.id);
      assert.equal(r.error, undefined, `building or reading the fixture failed: ${r.error?.stack}`);
      assert.deepEqual(r.oversize, [], 'a stdout reached the engine bound the runner does not model');
      t.diagnostic(`${fx.id}: mod ${r.mod}, Stop hook ${r.stop}`);
      assert.equal(r.mod, r.stop, `${fx.id}: the mod reads ${r.mod} and the Stop hook reads ${r.stop}`);
    });
  }
});

// RECORDED MUTATION: every fixture's build replaced by PS7's (`fx.build(dir)` replaced by
// `FIXTURES.find((f) => f.id === 'PS7').build(dir)`) -> fails: `guardian parity: the fixture set
// reaches stale, fresh and not judged on the Stop hook`. Observed at 54eba872 with this change, node
// --version v24.18.1 and git --version 2.49.0.windows.1.
test('guardian parity: the fixture set reaches stale, fresh and not judged on the Stop hook', async () => {
  const results = await computeAll();
  const reached = new Set([...results.values()].map((r) => r.stop));
  for (const outcome of ['stale', 'fresh', 'not judged']) {
    assert.ok(reached.has(outcome), `no fixture reaches ${outcome} on the Stop hook (reached: ${[...reached].join(', ')})`);
  }
});
