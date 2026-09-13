import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { checkDocsOnly } from './docsOnly.mjs';

function git(repo, args) {
  return execFileSync('git', args, { cwd: repo, encoding: 'utf8' });
}

function makeRepo() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'docsonly-test-'));
  git(dir, ['init', '-q']);
  git(dir, ['config', 'user.email', 'test@example.com']);
  git(dir, ['config', 'user.name', 'Test']);
  return dir;
}

function commitAll(dir, message) {
  git(dir, ['add', '-A']);
  git(dir, ['commit', '-q', '-m', message]);
  return git(dir, ['rev-parse', 'HEAD']).trim();
}

test('checkDocsOnly: a pure markdown change is eligible', () => {
  const dir = makeRepo();
  fs.writeFileSync(path.join(dir, 'README.md'), '# hello\n');
  const base = commitAll(dir, 'init');
  fs.writeFileSync(path.join(dir, 'README.md'), '# hello world\n');
  const head = commitAll(dir, 'docs edit');
  assert.deepEqual(checkDocsOnly(dir, base, head), []);
});

test('checkDocsOnly: a code path change is offending', () => {
  const dir = makeRepo();
  fs.writeFileSync(path.join(dir, 'README.md'), '# hello\n');
  fs.writeFileSync(path.join(dir, 'index.mjs'), 'console.log(1);\n');
  const base = commitAll(dir, 'init');
  fs.writeFileSync(path.join(dir, 'index.mjs'), 'console.log(2);\n');
  const head = commitAll(dir, 'code edit');
  const offending = checkDocsOnly(dir, base, head);
  assert.equal(offending.length, 1);
  assert.match(offending[0], /index\.mjs/);
});

test('checkDocsOnly: an ADR Status line change is offending (excluded outright, plus the specific status-line guard)', () => {
  const dir = makeRepo();
  fs.mkdirSync(path.join(dir, 'docs', 'adr'), { recursive: true });
  const adrPath = path.join(dir, 'docs', 'adr', 'ADR-099-test.md');
  fs.writeFileSync(adrPath, '# ADR-099\n\nStatus: **Proposed**\n\nBody.\n');
  const base = commitAll(dir, 'init');
  fs.writeFileSync(adrPath, '# ADR-099\n\nStatus: **Accepted, 2026-09-13**\n\nBody.\n');
  const head = commitAll(dir, 'accept the ADR');
  const offending = checkDocsOnly(dir, base, head);
  // Two independent findings for the same path: the outright ADR exclusion (finding 2), and the
  // more specific Status-line guard kept alongside it.
  assert.equal(offending.length, 2);
  assert.ok(offending.some((o) => o.includes('never docs-only-eligible')));
  assert.ok(offending.some((o) => o.includes('Status line changed')));
});

test('checkDocsOnly: any ADR touch is offending outright, even with Status untouched (finding 2)', () => {
  const dir = makeRepo();
  fs.mkdirSync(path.join(dir, 'docs', 'adr'), { recursive: true });
  const adrPath = path.join(dir, 'docs', 'adr', 'ADR-099-test.md');
  fs.writeFileSync(adrPath, '# ADR-099\n\nStatus: **Accepted, 2026-09-13**\n\nBody.\n');
  const base = commitAll(dir, 'init');
  fs.writeFileSync(adrPath, '# ADR-099\n\nStatus: **Accepted, 2026-09-13**\n\nAmended body.\n');
  const head = commitAll(dir, 'amend the ADR body');
  const offending = checkDocsOnly(dir, base, head);
  assert.equal(offending.length, 1);
  assert.match(offending[0], /never docs-only-eligible/);
});

test('checkDocsOnly: docs/01_Principles.md is never docs-only-eligible (finding 2)', () => {
  const dir = makeRepo();
  fs.mkdirSync(path.join(dir, 'docs'), { recursive: true });
  const p = path.join(dir, 'docs', '01_Principles.md');
  fs.writeFileSync(p, '# Principles\n\nOriginal.\n');
  const base = commitAll(dir, 'init');
  fs.writeFileSync(p, '# Principles\n\nA one-word typo fix.\n');
  const head = commitAll(dir, 'typo fix');
  const offending = checkDocsOnly(dir, base, head);
  assert.equal(offending.length, 1);
  assert.match(offending[0], /never docs-only-eligible/);
});

test("checkDocsOnly: uses the merge-base, not base's own moved-ahead tip (finding 2)", () => {
  const dir = makeRepo();
  fs.writeFileSync(path.join(dir, 'README.md'), '# hello\n');
  commitAll(dir, 'init'); // the common ancestor both branches share
  const defaultBranch = git(dir, ['rev-parse', '--abbrev-ref', 'HEAD']).trim();

  git(dir, ['checkout', '-q', '-b', 'pr-branch']);
  fs.writeFileSync(path.join(dir, 'README.md'), '# hello world\n');
  const head = commitAll(dir, "the PR's own docs-only commit");

  git(dir, ['checkout', '-q', defaultBranch]);
  fs.writeFileSync(path.join(dir, 'unrelated.mjs'), 'console.log(1);\n');
  // base moves on with a commit the PR branch never saw. A two-dot diff against base's new tip
  // would show unrelated.mjs being "removed" (present in base, absent on the PR branch) and
  // wrongly flag the PR as touching a code path.
  const base = commitAll(dir, "base moves on after the PR's branch point, unrelated to the PR");

  assert.deepEqual(checkDocsOnly(dir, base, head), []);
});

test('checkDocsOnly: PLAN.yaml lane priority change is offending', () => {
  const dir = makeRepo();
  const plan = (priority) =>
    [
      'version: 1',
      'lanes:',
      `  - {id: shell, title: "Shell", priority: ${priority}}`,
      'phases:',
      '  - {id: prototype, title: "Prototype", cite: "docs/07_Roadmap.md ## Prototype"}',
      'nodes: []',
      '',
    ].join('\n');
  fs.writeFileSync(path.join(dir, 'PLAN.yaml'), plan(1));
  const base = commitAll(dir, 'init');
  fs.writeFileSync(path.join(dir, 'PLAN.yaml'), plan(2));
  const head = commitAll(dir, 'reprioritize');
  const offending = checkDocsOnly(dir, base, head);
  assert.equal(offending.length, 1);
  assert.match(offending[0], /priority changed/);
});

test('checkDocsOnly: PLAN.yaml felt_verdict node status change is offending', () => {
  const dir = makeRepo();
  const plan = (status) =>
    [
      'version: 1',
      'lanes:',
      '  - {id: shell, title: "Shell", priority: 1}',
      'phases:',
      '  - {id: prototype, title: "Prototype", cite: "docs/07_Roadmap.md ## Prototype"}',
      'nodes:',
      '  - id: felt-node',
      '    title: "A felt-verdict node"',
      '    kind: task',
      '    lane: shell',
      '    phase: prototype',
      `    status: ${status}`,
      '    order: 1',
      '    depends_on: []',
      '    needs_human: {kind: none, minutes: 0}',
      '    gate: none',
      '    evidence: null',
      '    budget_minutes: 30',
      '    generation: 1',
      '    felt_verdict: true',
      '    entries: []',
      '    summary: "fixture"',
      '    dates: {opened: 2026-09-13, done: null}',
      '',
    ].join('\n');
  fs.writeFileSync(path.join(dir, 'PLAN.yaml'), plan('blocked'));
  const base = commitAll(dir, 'init');
  fs.writeFileSync(path.join(dir, 'PLAN.yaml'), plan('done'));
  const head = commitAll(dir, 'mark done');
  const offending = checkDocsOnly(dir, base, head);
  assert.equal(offending.length, 1);
  assert.match(offending[0], /felt_verdict\) status changed/);
});

test('checkDocsOnly: a non-priority, non-felt-verdict PLAN.yaml edit is eligible', () => {
  const dir = makeRepo();
  const plan = (title) =>
    [
      'version: 1',
      'lanes:',
      '  - {id: shell, title: "Shell", priority: 1}',
      'phases:',
      '  - {id: prototype, title: "Prototype", cite: "docs/07_Roadmap.md ## Prototype"}',
      'nodes:',
      '  - id: a-node',
      `    title: "${title}"`,
      '    kind: task',
      '    lane: shell',
      '    phase: prototype',
      '    status: proposed',
      '    order: 0',
      '    depends_on: []',
      '    needs_human: {kind: none, minutes: 0}',
      '    gate: none',
      '    evidence: null',
      '    budget_minutes: 30',
      '    generation: 1',
      '    felt_verdict: false',
      '    entries: []',
      '    summary: "fixture"',
      '    dates: {opened: 2026-09-13, done: null}',
      '',
    ].join('\n');
  fs.writeFileSync(path.join(dir, 'PLAN.yaml'), plan('Original title'));
  const base = commitAll(dir, 'init');
  fs.writeFileSync(path.join(dir, 'PLAN.yaml'), plan('Retitled'));
  const head = commitAll(dir, 'append a proposed node title edit');
  assert.deepEqual(checkDocsOnly(dir, base, head), []);
});
