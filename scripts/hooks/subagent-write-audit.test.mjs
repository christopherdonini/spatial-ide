// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors
//
// Tests for scripts/hooks/subagent-write-audit.mjs, per
// scripts/hooks/SUBAGENT-WRITE-AUDIT-PREREGISTRATION.md (Tests+mutation line, T1-T7). Each test
// builds a synthetic transcript JSONL in a temp directory and removes it. Fixture paths are
// invented.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const script = path.join(here, 'subagent-write-audit.mjs');

const use = (name, input) => ({ message: { content: [{ type: 'tool_use', name, input }] } });
const jsonl = (objs) => objs.map((o) => JSON.stringify(o)).join('\n') + '\n';

function withFixture(text, fn) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'swa-'));
  try {
    const file = path.join(dir, 'agent.jsonl');
    fs.writeFileSync(file, text);
    return fn(file);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function run(...args) {
  const r = spawnSync(process.execPath, [script, ...args], { encoding: 'utf8' });
  let report = null;
  try {
    report = JSON.parse(r.stdout);
  } catch {
    // usage errors print no JSON
  }
  return { status: r.status, report };
}

const ALLOWED = 'C:/repo/state/consults/x.md';

test('T1: PASS when the only write calls target the allowed path', () => {
  const text = jsonl([
    use('Read', { file_path: 'C:/repo/a.md' }),
    use('Write', { file_path: ALLOWED }),
    use('Edit', { file_path: ALLOWED }),
  ]);
  withFixture(text, (f) => {
    const { status, report } = run(f, ALLOWED);
    assert.equal(status, 0);
    assert.equal(report.verdict, 'PASS');
    assert.equal(report.writeCalls.length, 2);
    assert.deepEqual(report.voids, []);
  });
});

test('T2: VOID on a Write to another path', () => {
  withFixture(jsonl([use('Write', { file_path: 'C:/repo/state/consults/y.md' })]), (f) => {
    const { status, report } = run(f, ALLOWED);
    assert.equal(status, 1);
    assert.equal(report.verdict, 'VOID');
    assert.equal(report.voids.length, 1);
  });
});

test('T3: VOID on any Bash call', () => {
  withFixture(jsonl([use('Write', { file_path: ALLOWED }), use('Bash', { command: 'ls' })]), (f) => {
    const { status, report } = run(f, ALLOWED);
    assert.equal(status, 1);
    assert.equal(report.verdict, 'VOID');
    assert.match(report.voids.join(' '), /Bash/);
  });
});

test('T4: VOID under NONE with one Edit', () => {
  withFixture(jsonl([use('Edit', { file_path: ALLOWED })]), (f) => {
    const { status, report } = run(f, 'NONE');
    assert.equal(status, 1);
    assert.equal(report.verdict, 'VOID');
    assert.equal(report.allowed, 'NONE');
  });
});

// RECORDED MUTATION: removing the zero-tool-calls check from subagent-write-audit.mjs made T5 fail by
// name ("T5: VOID on an empty file and on a transcript with zero tool calls"), observed at commit
// 8715ad1b by applying the edit, running T5 alone, and reverting it.
test('T5: VOID on an empty file and on a transcript with zero tool calls', () => {
  withFixture('', (f) => {
    const { status, report } = run(f, ALLOWED);
    assert.equal(status, 1);
    assert.equal(report.verdict, 'VOID');
  });
  withFixture(jsonl([{ message: { content: [{ type: 'text', text: 'hello' }] } }]), (f) => {
    const { status, report } = run(f, ALLOWED);
    assert.equal(status, 1);
    assert.equal(report.verdict, 'VOID');
    assert.match(report.voids.join(' '), /zero tool calls/);
  });
});

test('T6: PASS across slash and drive-letter case differences', () => {
  withFixture(jsonl([use('Write', { file_path: 'c:\\REPO\\state\\consults\\X.md' })]), (f) => {
    const { status, report } = run(f, ALLOWED);
    assert.equal(status, 0);
    assert.equal(report.verdict, 'PASS');
  });
});

test('T7: exit 2 on a missing argument', () => {
  assert.equal(run('a0123456789abcdef').status, 2);
  assert.equal(run().status, 2);
});
