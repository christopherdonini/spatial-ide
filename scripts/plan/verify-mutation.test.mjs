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

// RECORDED MUTATION (the union's whole point, round 18 item 4): replacing findTestsInFile's Rust
// branch with `mainStyleRustScan(lines)` alone (i.e. dropping `trackedRustScan`'s contribution from
// the union) makes `finds_a_test_behind_a_multiline_ignore_attribute` FAIL — a genuinely multi-line
// `#[ignore = "..."]` is exactly the case `mainStyleRustScan` alone cannot see.
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

// RECORDED MUTATION (string-stripping inside the gain): reverting `stripStringLiterals` to return
// `l` unchanged (i.e. no string-content stripping before bracket-counting) makes
// `finds_a_test_behind_a_multiline_ignore_attribute_holding_an_unmatched_bracket` FAIL — the
// unmatched `[` inside the attribute's own (still-open) string would be counted as a real bracket,
// so `trackedRustScan` never sees the attribute close and the trailing test is lost from the union.
test('finds_a_test_behind_a_multiline_ignore_attribute_holding_an_unmatched_bracket', () => {
  const rust = [
    '#[test]',
    '#[ignore = "flaky because of an unbalanced [ bracket that continues',
    '    onto the next line"]',
    'fn a_multiline_ignored_test_with_a_bracket_in_its_reason() {}',
  ].join('\n');
  const rustTests = findTestsInFile('engine/src/lib.rs', rust);
  assert.deepEqual(rustTests.map((t) => t.name), ['a_multiline_ignored_test_with_a_bracket_in_its_reason']);
});

// The six reviewer-named fixtures (state/gate-log.json, node governance-verify-mutation-multiline-attrs,
// reviewer attempt 1 @ 28fef8e: "trailing comment, char literal, raw-string body, test inside the
// window, false close, pending carried across"). Under the union design each fixture's expected list
// is asserted directly (fixed names/lines), never by comparison to another build of the tool: on
// every one of these six, `mainStyleRustScan` alone already finds every test a human would expect,
// because each fixture keeps a real single-line `#[test]` immediately before its `fn` — the union
// guarantees these six are found (RULED 2026-09-24 round 18 item 4), whatever `trackedRustScan` does.
test('the_six_reviewer_fixtures_are_found_by_the_union_no_loss_by_construction', () => {
  const trailingComment = [
    '#[allow(clippy::something)] // note: an unmatched [ bracket in a trailing comment',
    ...Array.from({ length: 25 }, (_, k) => `// filler ${k}`),
    '#[test]',
    'fn a_test_after_a_trailing_comment_bracket() {}',
  ].join('\n');
  assert.deepEqual(findTestsInFile('engine/src/lib.rs', trailingComment).map((t) => t.name), [
    'a_test_after_a_trailing_comment_bracket',
  ]);

  const charLiteral = [
    "#[allow(clippy::something)] let c = '['; // a char literal holding a bracket, not a string",
    ...Array.from({ length: 25 }, (_, k) => `// filler ${k}`),
    '#[test]',
    'fn a_test_after_a_char_literal_bracket() {}',
  ].join('\n');
  assert.deepEqual(findTestsInFile('engine/src/lib.rs', charLiteral).map((t) => t.name), [
    'a_test_after_a_char_literal_bracket',
  ]);

  const rawStringBody = [
    '#[test]',
    'fn a_real_test_with_a_raw_string_body() {',
    '    let generated = r#"',
    '    generated fixture source below:',
    '#[ignore = "this looks like a real attribute opening but is raw-string content',
    ...Array.from({ length: 25 }, (_, k) => `    filler line ${k} of the fixture source`),
    '    "#;',
    '    assert!(!generated.is_empty());',
    '}',
    '#[test]',
    'fn a_test_after_the_raw_string_body() {}',
  ].join('\n');
  assert.deepEqual(findTestsInFile('engine/src/lib.rs', rawStringBody).map((t) => t.name), [
    'a_real_test_with_a_raw_string_body',
    'a_test_after_the_raw_string_body',
  ]);

  const testInsideTheWindow = [
    '#[allow(clippy::something)] // unmatched [ bracket opens here',
    '#[test]',
    'fn a_test_inside_the_lookahead_window() {}',
    ...Array.from({ length: 18 }, (_, k) => `// filler ${k}`),
    '#[test]',
    'fn a_test_after_the_window() {}',
  ].join('\n');
  assert.deepEqual(findTestsInFile('engine/src/lib.rs', testInsideTheWindow).map((t) => [t.name, t.line]), [
    ['a_test_inside_the_lookahead_window', 3],
    ['a_test_after_the_window', 23],
  ]);

  const falseClose = [
    '#[allow(clippy::something)] // note: an unmatched [ bracket opens here',
    '#[test]',
    'fn a_test_lost_between_open_and_a_false_close() {}',
    '// closing the false attribute here ]',
    '#[test]',
    'fn a_test_after_the_false_close() {}',
  ].join('\n');
  assert.deepEqual(findTestsInFile('engine/src/lib.rs', falseClose).map((t) => t.name), [
    'a_test_lost_between_open_and_a_false_close',
    'a_test_after_the_false_close',
  ]);

  const pendingCarriedAcross = [
    '#[test]',
    '#[allow(clippy::something)] // unmatched [ opens here, right after a preceding pending attribute',
    ...Array.from({ length: 19 }, (_, k) => `// filler ${k}`),
    'fn a_test_using_pending_carried_through_the_window() {}',
  ].join('\n');
  assert.deepEqual(findTestsInFile('engine/src/lib.rs', pendingCarriedAcross).map((t) => t.name), [
    'a_test_using_pending_carried_through_the_window',
  ]);
});

// RECORDED MUTATION (deleting the per-line half of the union): replacing findTestsInFile's Rust
// branch with `trackedRustScan(rel, lines)` alone (dropping `mainStyleRustScan` from the union) makes
// `deleting_the_per_line_half_of_the_union_loses_a_test_main_finds` FAIL — on this exact fixture
// `trackedRustScan` alone never sees the attribute close (it is swallowed to end of file), so it finds
// neither test, while `mainStyleRustScan` (and hence today's `origin/main`) finds both.
test('deleting_the_per_line_half_of_the_union_loses_a_test_main_finds', () => {
  const rust = [
    '#[allow(clippy::something)] // note: an unmatched [ bracket opens here',
    '#[test]',
    'fn a_test_lost_between_open_and_a_false_close() {}',
    '// closing the false attribute here ]',
    '#[test]',
    'fn a_test_after_the_false_close() {}',
  ].join('\n');
  const rustTests = findTestsInFile('engine/src/lib.rs', rust);
  // Both tests are present only because mainStyleRustScan (the per-line half) finds them; pinned here
  // as the union's own no-loss guarantee, not the tracked scan's.
  assert.deepEqual(rustTests.map((t) => t.name), [
    'a_test_lost_between_open_and_a_false_close',
    'a_test_after_the_false_close',
  ]);
});

// The false-entry risk this design discloses (Amendment 5): a stray bracket the tracker mistakes for
// part of an already-open attribute can keep `pending` true across a real, unrelated `fn` in between,
// so a later `fn` gets falsely listed as a test though no `#[test]` directly precedes it. The union
// still lists it (this is a known limit of the heuristic, not silently hidden) but flags it in stderr.
//
// RECORDED MUTATION (the false-entry flag): removing the `!mainKeys.has(key)` diagnostic block in
// findTestsInFile makes `a_false_entry_from_a_misjudged_attribute_close_is_flagged_and_still_listed`
// FAIL — the false entry would still be listed, but no note would name it.
test('a_false_entry_from_a_misjudged_attribute_close_is_flagged_and_still_listed', () => {
  const rust = [
    '#[test]',
    '#[allow(clippy::something)] // begins with a stray [ in this comment',
    'fn setup_helper() {}',
    '// closes here ]',
    'fn not_actually_a_test() {}',
  ].join('\n');
  const orig = console.error;
  const seen = [];
  console.error = (msg) => seen.push(msg);
  let rustTests;
  try {
    rustTests = findTestsInFile('engine/src/lib.rs', rust);
  } finally {
    console.error = orig;
  }
  assert.deepEqual(rustTests.map((t) => t.name), ['setup_helper', 'not_actually_a_test']);
  assert.ok(
    seen.some(
      (m) =>
        m.startsWith('verify:mutation note — engine/src/lib.rs:5 ') &&
        m.includes('"not_actually_a_test"') &&
        m.includes('found only by the multi-line-attribute-tracked scan'),
    ),
    JSON.stringify(seen),
  );
});

// The string-parity case from the attempt-2 record ("the false-close class ... reached also by a
// string-parity flip"): an odd, unescaped `"` on a continuation line flips `stripStringLiterals`'s
// `inString` state, which can swallow a real closing `]` (or, as here, run to end of file). This is a
// LOST GAIN (the multi-line test is not found), never a lost main-coverage test: the fixture's other
// test, preceded by its own real `#[test]`, is still found by `mainStyleRustScan`.
test('a_string_parity_flip_can_lose_the_gain_but_never_loses_what_main_finds', () => {
  const rust = [
    '#[test]',
    '#[allow(clippy::something)] // note [ this one',
    "it's a comment with \" a quote that flips parity, and here is a real closer ]",
    'fn a_test_lost_to_a_string_parity_flip() {}',
    '#[test]',
    'fn a_test_after_the_string_parity_flip() {}',
  ].join('\n');
  const rustTests = findTestsInFile('engine/src/lib.rs', rust);
  assert.deepEqual(rustTests.map((t) => t.name), ['a_test_after_the_string_parity_flip']);
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
