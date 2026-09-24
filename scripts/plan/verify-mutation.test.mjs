// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors
//
// Tests for verify-mutation.mjs — the mutation-per-new-test heuristic (AUTONOMY.md Appendix A3).
//
// RECORDED MUTATION (per the mutation-per-new-test rule this piece also automates): replacing the
// `/mutation/i` proximity match in hasMutationMention with a pattern that never matches (e.g.
// `/__never__/i`) makes `a_name_next_to_the_word_mutation_is_counted` FAIL — every name would then
// read as un-mutated — while the other tests still pass. That one test pins the proximity match.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import {
  parseAddedRanges,
  findTestsInFile,
  hasMutationMention,
  runVerifyMutation,
} from './verify-mutation.mjs';

test('parseAddedRanges extracts added new-file ranges from a unified=0 diff', () => {
  const diff = [
    'diff --git a/x.rs b/x.rs',
    '--- a/x.rs',
    '+++ b/x.rs',
    '@@ -0,0 +1,3 @@',
    '+a',
    '+b',
    '+c',
    '@@ -10,0 +20 @@',
    '+one line',
  ].join('\n');
  const ranges = parseAddedRanges(diff);
  assert.deepEqual(ranges.get('x.rs'), [[1, 3], [20, 20]]);
});

test('findTestsInFile finds a Rust #[test] fn (through intervening attributes) and JS test()/it()', () => {
  const rust = [
    'fn not_a_test() {}',
    '#[test]',
    '#[should_panic]',
    'fn a_rust_test_here() {}',
  ].join('\n');
  const rustTests = findTestsInFile('engine/src/lib.rs', rust);
  assert.deepEqual(rustTests.map((t) => [t.name, t.line]), [['a_rust_test_here', 4]]);

  const js = ["it('does a thing', () => {});", "test('does another', () => {});"].join('\n');
  const jsTests = findTestsInFile('a.test.mjs', js);
  assert.deepEqual(jsTests.map((t) => t.name), ['does a thing', 'does another']);
});

// RECORDED MUTATION (multi-line attribute fix): reverting the `attrDepth > 0` branch in
// findTestsInFile back to "any other code line clears pending" (i.e. deleting that branch so a
// continuation line of an unterminated attribute falls through to the final `pending = false;`)
// makes `finds_a_test_behind_a_multiline_ignore_attribute` FAIL — the test would no longer be
// listed at all.
test('finds_a_test_behind_a_multiline_ignore_attribute', () => {
  const rust = [
    '#[test]',
    '#[ignore = "flaky because of reason \\',
    '    that continues onto the next line"]',
    'fn a_multiline_ignored_test() {}',
  ].join('\n');
  const rustTests = findTestsInFile('engine/src/lib.rs', rust);
  assert.deepEqual(rustTests.map((t) => [t.name, t.line]), [['a_multiline_ignored_test', 4]]);
});

test('a_name_next_to_the_word_mutation_is_counted', () => {
  const near = 'Results: the mutation reverts admit; `a_rust_test_here` fails by name.';
  const far = 'a_rust_test_here is described here. '.padEnd(1200, 'x') + ' mutation happened elsewhere.';
  assert.equal(hasMutationMention('a_rust_test_here', [near]), true);
  assert.equal(hasMutationMention('a_rust_test_here', [far]), false);
  assert.equal(hasMutationMention('a_rust_test_here', ['no such word nearby']), false);
});

function gitInit(dir) {
  execFileSync('git', ['init', '-q'], { cwd: dir });
  execFileSync('git', ['config', 'user.email', 't@e.com'], { cwd: dir });
  execFileSync('git', ['config', 'user.name', 'T'], { cwd: dir });
}
function write(dir, rel, content) {
  const abs = path.join(dir, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, content);
}
function commit(dir, msg) {
  execFileSync('git', ['add', '-A'], { cwd: dir });
  execFileSync('git', ['commit', '-q', '-m', msg], { cwd: dir });
  return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: dir, encoding: 'utf8' }).trim();
}

test('runVerifyMutation flags a new test with no named mutation and passes one that has it', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'verify-mutation-'));
  gitInit(dir);
  write(dir, 'README.md', 'base\n');
  const base = commit(dir, 'base');

  write(dir, 'engine/src/lib.rs', ['#[test]', 'fn a_first_new_test() {}', '#[test]', 'fn a_second_new_test() {}', ''].join('\n'));
  write(dir, 'engine/FOO-PREREGISTRATION.md', 'Results. The mutation reverts admit; `a_first_new_test` fails by name.\n');
  commit(dir, 'add tests + prereg');

  const { error, tests, findings } = runVerifyMutation({ repoRoot: dir, base, head: 'HEAD' });
  assert.equal(error, null);
  assert.equal(tests.length, 2, JSON.stringify(tests));
  assert.equal(findings.length, 1, JSON.stringify(findings));
  assert.equal(findings[0].name, 'a_second_new_test');
});

test('runVerifyMutation skips (no gate) when the base ref does not resolve', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'verify-mutation-noref-'));
  gitInit(dir);
  write(dir, 'README.md', 'x\n');
  commit(dir, 'only');
  const res = runVerifyMutation({ repoRoot: dir, base: 'origin/does-not-exist', head: 'HEAD' });
  assert.match(res.error, /does not resolve/);
  assert.deepEqual(res.findings, []);
});
