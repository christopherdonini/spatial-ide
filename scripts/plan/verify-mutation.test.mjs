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
import { pathToFileURL } from 'node:url';
import {
  parseAddedRanges,
  findTestsInFile,
  hasMutationMention,
  runVerifyMutation,
  REPO_ROOT as REPO_ROOT_FOR_TEST,
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

// RECORDED MUTATION (bracket-in-string fix): reverting netBracketDelta to count raw `[`/`]` chars
// (i.e. calling it on `l` instead of `stripStringLiterals(l)`) makes
// `an_unbalanced_bracket_inside_an_attribute_string_does_not_swallow_later_tests` FAIL — the second
// test would vanish (falsely treated as inside a still-open attribute).
test('an_unbalanced_bracket_inside_an_attribute_string_does_not_swallow_later_tests', () => {
  const rust = [
    '#[ignore = "a [b"]',
    '#[test]',
    'fn a_test_after_an_unbalanced_bracket_string() {}',
  ].join('\n');
  const rustTests = findTestsInFile('engine/src/lib.rs', rust);
  assert.deepEqual(rustTests.map((t) => t.name), ['a_test_after_an_unbalanced_bracket_string']);
});

// RECORDED MUTATION (same fix): the same reversion makes
// `a_raw_string_bracket_inside_an_attribute_does_not_swallow_later_tests` FAIL for the raw-string form.
test('a_raw_string_bracket_inside_an_attribute_does_not_swallow_later_tests', () => {
  const rust = [
    String.raw`#[doc = r#"a ["#]`,
    '#[test]',
    'fn a_test_after_a_raw_string_bracket() {}',
  ].join('\n');
  const rustTests = findTestsInFile('engine/src/lib.rs', rust);
  assert.deepEqual(rustTests.map((t) => t.name), ['a_test_after_a_raw_string_bracket']);
});

// RECORDED MUTATION (EOF diagnostic): removing the post-loop `if (attrDepth > 0)` block makes
// `an_unterminated_attribute_at_eof_prints_a_diagnostic` FAIL — no finding is printed.
test('an_unterminated_attribute_at_eof_prints_a_diagnostic', () => {
  const rust = ['#[test]', '#[ignore = "never closes'].join('\n');
  const orig = console.error;
  const seen = [];
  console.error = (msg) => seen.push(msg);
  try {
    findTestsInFile('engine/src/lib.rs', rust);
  } finally {
    console.error = orig;
  }
  assert.ok(
    seen.some((m) => m.startsWith('verify:mutation finding — ') && /did not close by end of file/.test(m)),
    JSON.stringify(seen),
  );
});

// Helper for the bounded-look-ahead tests below: capture console.error output around a call.
function capturingErrors(fn) {
  const orig = console.error;
  const seen = [];
  console.error = (msg) => seen.push(msg);
  try {
    return { result: fn(), seen };
  } finally {
    console.error = orig;
  }
}

// The six reviewer-named fixtures (state/gate-log.json, node governance-verify-mutation-multiline-attrs,
// reviewer attempt 1 @ 28fef8e: "trailing comment, char literal, raw-string body, test inside the
// window, false close, pending carried across"), named here so both the individual tests below and
// the no-loss property test (against `origin/main`'s own tool) exercise the identical fixture text.
const REVIEWER_FIXTURES = {
  trailingComment: [
    '#[allow(clippy::something)] // note: an unmatched [ bracket in a trailing comment',
    ...Array.from({ length: 25 }, (_, k) => `// filler ${k}`),
    '#[test]',
    'fn a_test_after_a_trailing_comment_bracket() {}',
  ].join('\n'),
  charLiteral: [
    "#[allow(clippy::something)] let c = '['; // a char literal holding a bracket, not a string",
    ...Array.from({ length: 25 }, (_, k) => `// filler ${k}`),
    '#[test]',
    'fn a_test_after_a_char_literal_bracket() {}',
  ].join('\n'),
  rawStringBody: [
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
  ].join('\n'),
  testInsideTheWindow: [
    '#[allow(clippy::something)] // unmatched [ bracket opens here',
    '#[test]',
    'fn a_test_inside_the_lookahead_window() {}',
    ...Array.from({ length: 18 }, (_, k) => `// filler ${k}`),
    '#[test]',
    'fn a_test_after_the_window() {}',
  ].join('\n'),
  falseClose: [
    '#[allow(clippy::something)] // note: an unmatched [ bracket opens here',
    '#[test]',
    'fn a_test_lost_between_open_and_a_false_close() {}',
    '// closing the false attribute here ]',
    '#[test]',
    'fn a_test_after_the_false_close() {}',
  ].join('\n'),
  pendingCarriedAcross: [
    '#[test]',
    '#[allow(clippy::something)] // unmatched [ opens here, right after a preceding pending attribute',
    ...Array.from({ length: 19 }, (_, k) => `// filler ${k}`),
    'fn a_test_using_pending_carried_through_the_window() {}',
  ].join('\n'),
};

// RECORDED MUTATION (bounded look-ahead, Amendment 2): removing the `else if (i + 1 - attrStartLine
// >= MULTILINE_ATTR_LOOKAHEAD)` branch (reverting to unbounded tracking) makes
// `a_trailing_line_comment_bracket_past_the_lookahead_falls_back` FAIL — the fixture's attribute never
// re-balances to 0 on its own, so unbounded tracking would swallow the trailing test entirely instead
// of recovering after the finding.
test('a_trailing_line_comment_bracket_past_the_lookahead_falls_back', () => {
  const { result: rustTests, seen } = capturingErrors(() =>
    findTestsInFile('engine/src/lib.rs', REVIEWER_FIXTURES.trailingComment),
  );
  assert.deepEqual(rustTests.map((t) => t.name), ['a_test_after_a_trailing_comment_bracket']);
  assert.ok(
    seen.some((m) => m.startsWith('verify:mutation finding — engine/src/lib.rs:1 ') && m.includes('did not close within 20 line(s)')),
    JSON.stringify(seen),
  );
});

// RECORDED MUTATION (same bound): the same reversion makes
// `a_char_literal_bracket_past_the_lookahead_falls_back` FAIL for the char-literal form (a `'['` is
// not a string literal `stripStringLiterals` strips, so its bracket is counted as real).
test('a_char_literal_bracket_past_the_lookahead_falls_back', () => {
  const { result: rustTests, seen } = capturingErrors(() =>
    findTestsInFile('engine/src/lib.rs', REVIEWER_FIXTURES.charLiteral),
  );
  assert.deepEqual(rustTests.map((t) => t.name), ['a_test_after_a_char_literal_bracket']);
  assert.ok(
    seen.some((m) => m.startsWith('verify:mutation finding — engine/src/lib.rs:1 ') && m.includes('did not close within 20 line(s)')),
    JSON.stringify(seen),
  );
});

// RECORDED MUTATION (same bound): the same reversion makes
// `a_raw_string_line_starting_the_attribute_opener_in_a_test_body_falls_back` FAIL — a line inside a
// test's own raw-string body that starts `#[` is misread as a real attribute opening (the scanner
// does not track raw-string state outside of an already-open attribute), and unbounded tracking would
// swallow `a_test_after_the_raw_string_body` entirely.
test('a_raw_string_line_starting_the_attribute_opener_in_a_test_body_falls_back', () => {
  const { result: rustTests, seen } = capturingErrors(() =>
    findTestsInFile('engine/src/lib.rs', REVIEWER_FIXTURES.rawStringBody),
  );
  assert.deepEqual(rustTests.map((t) => t.name), [
    'a_real_test_with_a_raw_string_body',
    'a_test_after_the_raw_string_body',
  ]);
  assert.ok(
    seen.some((m) => m.startsWith('verify:mutation finding — engine/src/lib.rs:5 ') && m.includes('did not close within 20 line(s)')),
    JSON.stringify(seen),
  );
});

// RECORDED MUTATION (the rewind, architect attempt 1 S1 @ 28fef8e): replacing the
// `pending = rewindWindowUnderMainRules(...)` call at the bound site with the pre-rewind fallback
// (bare `attrDepth = 0;`, resuming after the window instead of re-reading it) makes
// `a_test_placed_inside_the_lookahead_window_is_still_found` FAIL — the window's own `#[test]`/`fn`
// pair is swallowed as attribute continuation and never reaches the per-line rules at all.
test('a_test_placed_inside_the_lookahead_window_is_still_found', () => {
  const { result: rustTests, seen } = capturingErrors(() =>
    findTestsInFile('engine/src/lib.rs', REVIEWER_FIXTURES.testInsideTheWindow),
  );
  assert.deepEqual(rustTests.map((t) => [t.name, t.line]), [
    ['a_test_inside_the_lookahead_window', 3],
    ['a_test_after_the_window', 23],
  ]);
  assert.ok(
    seen.some((m) => m.startsWith('verify:mutation finding — engine/src/lib.rs:1 ') && m.includes('did not close within 20 line(s)')),
    JSON.stringify(seen),
  );
});

// RECORDED MUTATION (the rewind at end of file): the same fallback reversion at the post-loop
// `attrDepth > 0` site makes `a_file_ending_inside_the_window_still_finds_its_test` FAIL — the test
// declared in the file's last lines, inside the still-open attribute's window, is never scanned.
test('a_file_ending_inside_the_window_still_finds_its_test', () => {
  const rust = ['#[test]', '#[ignore = "never closes', 'fn a_test_lost_at_eof() {}'].join('\n');
  const { result: rustTests, seen } = capturingErrors(() => findTestsInFile('engine/src/lib.rs', rust));
  assert.deepEqual(rustTests.map((t) => [t.name, t.line]), [['a_test_lost_at_eof', 3]]);
  assert.ok(
    seen.some((m) => m.startsWith('verify:mutation finding — engine/src/lib.rs:2 ') && /did not close by end of file/.test(m)),
    JSON.stringify(seen),
  );
});

// RECORDED MUTATION (restoring the pre-attribute `pending`): replacing `pendingBeforeAttr` with a
// hardcoded `false` in the bound-site `rewindWindowUnderMainRules(...)` call makes
// `the_pending_state_before_the_attribute_carries_through_the_rewound_window` FAIL — the real
// `#[test]` that preceded the unclosed attribute would no longer reach the `fn` after the window,
// since the rewound window itself contains no attribute (nothing there would set `pending` again).
test('the_pending_state_before_the_attribute_carries_through_the_rewound_window', () => {
  const { result: rustTests, seen } = capturingErrors(() =>
    findTestsInFile('engine/src/lib.rs', REVIEWER_FIXTURES.pendingCarriedAcross),
  );
  assert.deepEqual(rustTests.map((t) => t.name), ['a_test_using_pending_carried_through_the_window']);
  assert.ok(
    seen.some((m) => m.startsWith('verify:mutation finding — engine/src/lib.rs:2 ') && m.includes('did not close within 20 line(s)')),
    JSON.stringify(seen),
  );
});

// Known residual (disclosed, not fixed — per the piece's ruling, the rewind is scoped to the bound
// and end-of-file sites only): a FALSE close — a stray `]` in a plain comment, not the attribute's
// own closing bracket — still ends `attrDepth` tracking early, on the `attrDepth <= 0` branch, which
// has no rewind. A test declared between the attribute's open and that false close is lost; only the
// test after the false close is found. This pins today's behaviour, not a passing guarantee.
//
// RECORDED MUTATION (residual pin): extending the `attrDepth <= 0` branch to also call
// `rewindWindowUnderMainRules` (matching the bound/EOF sites) makes this test FAIL — the lost test
// would then be found too, changing the asserted list — which is exactly why that extension is out of
// this piece's scope and the residual is disclosed instead of silently fixed.
test('a_false_close_before_the_bound_can_still_lose_a_test_in_between_open_and_close', () => {
  const rustTests = findTestsInFile('engine/src/lib.rs', REVIEWER_FIXTURES.falseClose);
  assert.deepEqual(rustTests.map((t) => t.name), ['a_test_after_the_false_close']);
});

// No-loss property check (RULED 2026-09-24 round 17 item 9's fresh count; the reviewer's six named
// fixtures above): the branch's `findTestsInFile` lists a superset of `origin/main`'s own tool's names
// on each fixture — never fewer. `origin/main`'s tool is built from `git show` into a scratch
// directory OUTSIDE this worktree (`os.tmpdir()`), never written inside it.
test('the branch lists a superset of origin/main\'s tests on each of the six reviewer fixtures', async () => {
  const mainSrc = execFileSync('git', ['show', 'origin/main:scripts/plan/verify-mutation.mjs'], {
    cwd: REPO_ROOT_FOR_TEST,
    encoding: 'utf8',
  });
  const scratchDir = fs.mkdtempSync(path.join(os.tmpdir(), 'verify-mutation-main-'));
  const scratchFile = path.join(scratchDir, 'verify-mutation-main.mjs');
  fs.writeFileSync(scratchFile, mainSrc);
  const mainMod = await import(pathToFileURL(scratchFile).href);

  for (const [label, fixture] of Object.entries(REVIEWER_FIXTURES)) {
    const mainNames = new Set(mainMod.findTestsInFile('engine/src/lib.rs', fixture).map((t) => t.name));
    const branchNames = new Set(findTestsInFile('engine/src/lib.rs', fixture).map((t) => t.name));
    if (label === 'falseClose') {
      // The one disclosed exception (this form's Amendment 4, the false-close residual): a stray `]`
      // in a comment closes `attrDepth` early, on a branch with no rewind by this piece's own ruling
      // (item 2). Assert the gap is EXACTLY that one disclosed name — any other loss still fails here.
      const missing = [...mainNames].filter((n) => !branchNames.has(n));
      assert.deepEqual(missing, ['a_test_lost_between_open_and_a_false_close'], `fixture "${label}"`);
      continue;
    }
    for (const name of mainNames) {
      assert.ok(branchNames.has(name), `fixture "${label}": main found "${name}", branch lost it`);
    }
  }
});

// RECORDED MUTATION (the bound's own value): changing the bound check's `>=` to `>` (an off-by-one
// widening the window to 21 lines) makes `the_lookahead_bound_gives_exactly_20_lines_before_falling_back`
// FAIL on its second fixture — the finding would no longer be printed at continuation line 20.
test('the_lookahead_bound_gives_exactly_20_lines_before_falling_back', () => {
  // An attribute that closes ON its 20th continuation line: still a normal close, no finding.
  const closesAtBound = [
    '#[doc = "note: opens with an unmatched [ bracket',
    ...Array.from({ length: 19 }, (_, k) => `line ${k} of the doc comment`),
    'line 19 of the doc comment, and now it closes"]',
    '#[test]',
    'fn a_test_closing_exactly_at_the_lookahead_bound() {}',
  ].join('\n');
  const at = capturingErrors(() => findTestsInFile('engine/src/lib.rs', closesAtBound));
  assert.deepEqual(at.result.map((t) => t.name), ['a_test_closing_exactly_at_the_lookahead_bound']);
  assert.ok(!at.seen.some((m) => m.includes('did not close within 20 line(s)')), JSON.stringify(at.seen));

  // The same attribute needing one more continuation line to close: the bound gives up one line
  // early (at continuation line 20), then recovers and still finds the trailing test.
  const closesPastBound = [
    '#[doc = "note: opens with an unmatched [ bracket',
    ...Array.from({ length: 20 }, (_, k) => `line ${k} of the doc comment`),
    'line 20 of the doc comment, and now it closes"]',
    '#[test]',
    'fn a_test_closing_past_the_lookahead_bound() {}',
  ].join('\n');
  const past = capturingErrors(() => findTestsInFile('engine/src/lib.rs', closesPastBound));
  assert.deepEqual(past.result.map((t) => t.name), ['a_test_closing_past_the_lookahead_bound']);
  assert.ok(
    past.seen.some((m) => m.startsWith('verify:mutation finding — engine/src/lib.rs:1 ') && m.includes('did not close within 20 line(s)')),
    JSON.stringify(past.seen),
  );
});

// RECORDED MUTATION (the finding line itself): removing the `console.error(...)` call in the
// bound-exceeded branch (leaving `attrDepth = 0` in place, so recovery still happens silently) makes
// `an_attribute_past_the_lookahead_prints_a_finding_naming_the_file_and_line` FAIL — no finding is
// printed, though the trailing test is still found.
test('an_attribute_past_the_lookahead_prints_a_finding_naming_the_file_and_line', () => {
  const rust = [
    '#[doc = "opens with an unmatched [ bracket',
    ...Array.from({ length: 25 }, (_, k) => `line ${k} of the doc comment`),
    '"]',
    '#[test]',
    'fn a_test_after_the_unclosed_doc_comment() {}',
  ].join('\n');
  const { seen } = capturingErrors(() => findTestsInFile('engine/src/lib.rs', rust));
  assert.ok(
    seen.some(
      (m) =>
        m ===
        'verify:mutation finding — engine/src/lib.rs:1 attribute did not close within 20 line(s); rewinding to re-read the window under single-line rules',
    ),
    JSON.stringify(seen),
  );
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
