import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadPlan } from './plan.mjs';
import { buildQueue, renderMarkdown } from './queue.mjs';
import { runVerify, verifyStatusAgreement, adrStatusAccepted, verdictCiteExists, commitOnMain } from './verify.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const fixturesDir = path.join(here, 'fixtures');
const repoRoot = path.resolve(here, '..', '..');

function makeTempDir(prefix) {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

test('adrStatusAccepted finds a real Accepted ADR in this repository', () => {
  // ADR-010 is cited as Accepted by CLAUDE.md itself; a stable, real fixture to check against.
  const result = adrStatusAccepted(repoRoot, 'ADR-010');
  assert.equal(result.ok, true, result.reason);
});

test('adrStatusAccepted fails for a nonexistent ADR id', () => {
  const result = adrStatusAccepted(repoRoot, 'ADR-999');
  assert.equal(result.ok, false);
  assert.match(result.reason, /no file for ADR-999/);
});

function makeGitRepo() {
  const dir = makeTempDir('commit-on-main-');
  execFileSync('git', ['init', '-q'], { cwd: dir });
  execFileSync('git', ['config', 'user.email', 'test@example.com'], { cwd: dir });
  execFileSync('git', ['config', 'user.name', 'Test'], { cwd: dir });
  fs.writeFileSync(path.join(dir, 'a.txt'), 'x');
  execFileSync('git', ['add', '-A'], { cwd: dir });
  execFileSync('git', ['commit', '-q', '-m', 'init'], { cwd: dir });
  const sha = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: dir, encoding: 'utf8' }).trim();
  return { dir, sha };
}

test('commitOnMain falls back to a local "main" when origin/main is absent (finding 1)', () => {
  const { dir, sha } = makeGitRepo();
  execFileSync('git', ['branch', 'main'], { cwd: dir }); // no "origin" remote at all
  const result = commitOnMain(dir, sha);
  assert.deepEqual(result, { ok: true, reason: null });
});

test('commitOnMain names the shallow clone when neither origin/main nor main resolves', () => {
  const { dir, sha } = makeGitRepo();
  execFileSync('git', ['branch', '-m', 'totally-not-main'], { cwd: dir }); // neither ref exists
  const result = commitOnMain(dir, sha);
  assert.equal(result.ok, false);
  assert.match(result.reason, /shallow clone: run with fetch-depth 0/);
});

test('verdictCiteExists requires the "DECISIONS-PENDING.md " prefix', () => {
  const result = verdictCiteExists(repoRoot, 'somewhere else RULED 2026-09-13');
  assert.equal(result.ok, false);
  assert.match(result.reason, /does not start with/);
});

test('verdictCiteExists checks the cited text is actually present', () => {
  const dir = makeTempDir('verdict-cite-');
  fs.writeFileSync(path.join(dir, 'DECISIONS-PENDING.md'), '## RULED 2026-09-13\n\nsome ruling text\n');
  const hit = verdictCiteExists(dir, 'DECISIONS-PENDING.md RULED 2026-09-13');
  assert.equal(hit.ok, true);
  const miss = verdictCiteExists(dir, 'DECISIONS-PENDING.md RULED 2099-01-01');
  assert.equal(miss.ok, false);
});

test('verifyStatusAgreement flags a recorded status that disagrees with the derivation', () => {
  const plan = loadPlan(path.join(fixturesDir, 'valid-plan.yaml'));
  // n-ready-b is genuinely ready (no deps, needs_human none); force its recorded status wrong.
  const mutated = { ...plan, nodes: plan.nodes.map((n) => (n.id === 'n-ready-b' ? { ...n, status: 'blocked' } : n)) };
  const failures = verifyStatusAgreement(mutated, { repoRoot, offline: true, slug: null });
  assert.ok(failures.some((f) => f.includes('n-ready-b') && f.includes('does not agree')));
});

test('verifyStatusAgreement passes on the fixture plan as recorded (offline)', () => {
  const plan = loadPlan(path.join(fixturesDir, 'valid-plan.yaml'));
  const failures = verifyStatusAgreement(plan, { repoRoot, offline: true, slug: null });
  assert.deepEqual(failures, []);
});

test('runVerify PASS: a freshly generated queue+site agrees (offline)', () => {
  const dir = makeTempDir('verify-pass-');
  const planPath = path.join(dir, 'PLAN.yaml');
  fs.copyFileSync(path.join(fixturesDir, 'valid-plan.yaml'), planPath);

  // Generate the queue and site the same way the CLI scripts would, in-process.
  const plan = loadPlan(planPath);
  const queue = buildQueue(plan);
  fs.writeFileSync(path.join(dir, 'CUSTODIAN-QUEUE.md'), renderMarkdown(queue), 'utf8');
  fs.writeFileSync(path.join(dir, 'CUSTODIAN-QUEUE.json'), `${JSON.stringify(queue, null, 2)}\n`, 'utf8');

  const siteDir = path.join(dir, 'site');
  const result = runVerify({ planPath, repoRoot, siteDir, offline: true });
  // Site was never generated on disk, so its own drift check should fail naming missing files —
  // confirm the failure specifically names the site, not the queue.
  assert.equal(result.ok, false);
  assert.ok(result.failures.every((f) => f.startsWith('site drift:')));
});

test('runVerify FAIL: queue drift is reported when CUSTODIAN-QUEUE.md is stale', () => {
  const dir = makeTempDir('verify-drift-');
  const planPath = path.join(dir, 'PLAN.yaml');
  fs.copyFileSync(path.join(fixturesDir, 'valid-plan.yaml'), planPath);
  fs.writeFileSync(path.join(dir, 'CUSTODIAN-QUEUE.md'), 'stale content\n', 'utf8');
  fs.writeFileSync(path.join(dir, 'CUSTODIAN-QUEUE.json'), '{}', 'utf8');

  const result = runVerify({ planPath, repoRoot, siteDir: path.join(dir, 'site'), offline: true });
  assert.equal(result.ok, false);
  assert.ok(result.failures.some((f) => f.startsWith('queue drift:')));
});

test('verifyStatusAgreement fails by name when a ready node\'s gate names a path that is not tracked', () => {
  const plan = loadPlan(path.join(fixturesDir, 'valid-plan.yaml'));
  // n-ready-b is status "ready" in the fixture; point its gate at a file that does not exist.
  const mutated = {
    ...plan,
    nodes: plan.nodes.map((n) => (n.id === 'n-ready-b' ? { ...n, gate: 'scripts/plan/NO-SUCH-PREREGISTRATION.md' } : n)),
  };
  const failures = verifyStatusAgreement(mutated, { repoRoot, offline: true, slug: null });
  assert.ok(
    failures.some((f) => f.includes('n-ready-b') && f.includes('gate') && f.includes('NO-SUCH-PREREGISTRATION.md')),
    `expected a named gate failure, got: ${JSON.stringify(failures)}`,
  );
});

test('verifyStatusAgreement passes when a ready node\'s gate names a real tracked file', () => {
  const plan = loadPlan(path.join(fixturesDir, 'valid-plan.yaml'));
  // CLAUDE.md is a stable, always-tracked root file (unlike this piece's own preregistration,
  // which is specific to this branch) -- used the same way 'ADR-010' is used above.
  const mutated = {
    ...plan,
    nodes: plan.nodes.map((n) => (n.id === 'n-ready-b' ? { ...n, gate: 'CLAUDE.md' } : n)),
  };
  const failures = verifyStatusAgreement(mutated, { repoRoot, offline: true, slug: null });
  assert.ok(
    !failures.some((f) => f.includes('n-ready-b') && f.includes('gate')),
    `expected no gate failure for n-ready-b, got: ${JSON.stringify(failures)}`,
  );

  // Recorded mutation: break the path (misspell it) -- the check must fail it by name again.
  const broken = {
    ...plan,
    nodes: plan.nodes.map((n) => (n.id === 'n-ready-b' ? { ...n, gate: 'CLAUDE-EXITS.md' } : n)),
  };
  const brokenFailures = verifyStatusAgreement(broken, { repoRoot, offline: true, slug: null });
  assert.ok(
    brokenFailures.some((f) => f.includes('n-ready-b') && f.includes('gate') && f.includes('EXITS')),
    `mutation did not fail by name, got: ${JSON.stringify(brokenFailures)}`,
  );
});

test('verifyStatusAgreement fails by name when a ready node\'s gate names a directory, not a file', () => {
  const plan = loadPlan(path.join(fixturesDir, 'valid-plan.yaml'));
  const mutated = {
    ...plan,
    nodes: plan.nodes.map((n) => (n.id === 'n-ready-b' ? { ...n, gate: 'scripts/plan' } : n)),
  };
  const failures = verifyStatusAgreement(mutated, { repoRoot, offline: true, slug: null });
  assert.ok(
    failures.some((f) => f.includes('n-ready-b') && f.includes('gate') && f.includes('scripts/plan')),
    `expected a named gate failure for a directory gate, got: ${JSON.stringify(failures)}`,
  );

  // Recorded mutation: point the gate at a real file instead -- the failure must clear.
  const fixed = {
    ...plan,
    nodes: plan.nodes.map((n) => (n.id === 'n-ready-b' ? { ...n, gate: 'CLAUDE.md' } : n)),
  };
  const fixedFailures = verifyStatusAgreement(fixed, { repoRoot, offline: true, slug: null });
  assert.ok(!fixedFailures.some((f) => f.includes('n-ready-b') && f.includes('gate')));
});

test('verifyStatusAgreement fails by name when a ready node\'s gate is a glob pathspec, not a file', () => {
  const plan = loadPlan(path.join(fixturesDir, 'valid-plan.yaml'));
  const mutated = {
    ...plan,
    nodes: plan.nodes.map((n) => (n.id === 'n-ready-b' ? { ...n, gate: 'scripts/plan/*.mjs' } : n)),
  };
  const failures = verifyStatusAgreement(mutated, { repoRoot, offline: true, slug: null });
  assert.ok(
    failures.some((f) => f.includes('n-ready-b') && f.includes('gate') && f.includes('*.mjs')),
    `expected a named gate failure for a glob gate, got: ${JSON.stringify(failures)}`,
  );

  // Recorded mutation: point the gate at a real file instead -- the failure must clear.
  const fixed = {
    ...plan,
    nodes: plan.nodes.map((n) => (n.id === 'n-ready-b' ? { ...n, gate: 'CLAUDE.md' } : n)),
  };
  const fixedFailures = verifyStatusAgreement(fixed, { repoRoot, offline: true, slug: null });
  assert.ok(!fixedFailures.some((f) => f.includes('n-ready-b') && f.includes('gate')));
});

test('verifyStatusAgreement fails by name when an in-progress node\'s gate names an untracked path', () => {
  const plan = loadPlan(path.join(fixturesDir, 'valid-plan.yaml'));
  // n-inprogress is status "in-progress" in the fixture with gate: none; point it at a dangling path.
  const mutated = {
    ...plan,
    nodes: plan.nodes.map((n) =>
      n.id === 'n-inprogress' ? { ...n, gate: 'scripts/plan/NO-SUCH-PREREGISTRATION.md' } : n,
    ),
  };
  const failures = verifyStatusAgreement(mutated, { repoRoot, offline: true, slug: null });
  assert.ok(
    failures.some((f) => f.includes('n-inprogress') && f.includes('gate') && f.includes('NO-SUCH-PREREGISTRATION.md')),
    `expected a named gate failure for an in-progress node, got: ${JSON.stringify(failures)}`,
  );

  // Recorded mutation: restore gate: none -- the failure must clear.
  const fixedFailures = verifyStatusAgreement(plan, { repoRoot, offline: true, slug: null });
  assert.ok(!fixedFailures.some((f) => f.includes('n-inprogress') && f.includes('gate')));
});

test('runVerify: --offline note is present and PR/release evidence does not fail solely for being unchecked', () => {
  const dir = makeTempDir('verify-offline-note-');
  const planPath = path.join(dir, 'PLAN.yaml');
  fs.copyFileSync(path.join(fixturesDir, 'valid-plan.yaml'), planPath); // has {pr: 1} and {pr: 2} done evidence
  const result = runVerify({ planPath, repoRoot, siteDir: path.join(dir, 'site'), offline: true });
  assert.ok(result.notes.some((n) => n.includes('--offline')));
  assert.ok(!result.failures.some((f) => f.includes('pr')));
});
