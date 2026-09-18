// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors
//
// Tests for verify-test-claims.mjs — the claimed-test-exists check (AUTONOMY.md Appendix A3).
//
// RECORDED MUTATION (per the mutation-per-new-test rule this piece also automates): changing the
// backtick-adjacency guard in extractClaimedTests from `prev !== '`' || next !== '`'` to `&&` makes
// `a_one_sided_backtick_is_a_filter_not_a_claim` FAIL — a `cargo test --lib a_foo_bar_baz` filter
// (a backtick only on one side) would then be wrongly recognized as a claimed test — while the other
// tests still pass. That one test pins the "its own complete code span" rule.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import {
  isTestShaped,
  extractClaimedTests,
  testExists,
  runVerifyTestClaims,
  plannedGateFiles,
} from './verify-test-claims.mjs';

test('isTestShaped accepts narrative-prefixed >= 3-word snake_case, rejects field/symbol names', () => {
  assert.equal(isTestShaped('a_residual_admission_lease_exhaustion'), true);
  assert.equal(isTestShaped('the_query_windows_events_telescope_exactly'), true);
  assert.equal(isTestShaped('n_concurrent_admit_calls_all_succeed'), true);
  assert.equal(isTestShaped('crs_axis_directions'), false); // real field, no narrative prefix
  assert.equal(isTestShaped('build_viewport_query'), false); // real symbol
  assert.equal(isTestShaped('no_such_bbox_column'), false); // column name; `no` is not a prefix
  assert.equal(isTestShaped('t_query_start'), false); // event marker; `t` is not a prefix
  assert.equal(isTestShaped('a_b'), false); // only 2 words
});

test('extractClaimedTests captures a name that is its own backticked code span', () => {
  const claims = extractClaimedTests('Verified by test `a_thing_is_checked_here`.');
  assert.deepEqual(claims.map((c) => c.name), ['a_thing_is_checked_here']);
});

test('a_one_sided_backtick_is_a_filter_not_a_claim', () => {
  // A cargo substring filter: the token touches a backtick on ONE side only (it closes a longer
  // span). It is not a claim that a test is literally named `a_foo_bar_baz`.
  const claims = extractClaimedTests('Re-run `cargo test -p x --lib a_foo_bar_baz` to reproduce.');
  assert.deepEqual(claims, []);
});

test('extractClaimedTests survives a line with many nested backticks', () => {
  const line = '`kernel/src/skp.rs`’s `n_concurrent_admit_calls_all_succeed` fails: `"no `x`-class"`';
  const claims = extractClaimedTests(line);
  assert.ok(claims.some((c) => c.name === 'n_concurrent_admit_calls_all_succeed'), JSON.stringify(claims));
});

test('extractClaimedTests captures an explicit test()/it() description string', () => {
  const claims = extractClaimedTests("it('renders the marker on hover', () => {});");
  assert.deepEqual(claims.map((c) => [c.name, c.kind]), [['renders the marker on hover', 'call']]);
});

test('testExists finds a Rust fn, a JS description substring, or a JS function; misses the rest', () => {
  const index = { rustFns: new Set(['a_real_rust_test']), jsDescs: ['covers the hover repick path'], jsFns: new Set(['renderMarker']) };
  assert.equal(testExists('a_real_rust_test', index), true);
  assert.equal(testExists('hover repick', index), true); // substring of a description
  assert.equal(testExists('renderMarker', index), true);
  assert.equal(testExists('a_test_that_was_never_written', index), false);
});

function gitTree(files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'verify-test-claims-'));
  for (const [rel, content] of Object.entries(files)) {
    const abs = path.join(dir, rel);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, content);
  }
  execFileSync('git', ['init', '-q'], { cwd: dir });
  execFileSync('git', ['config', 'user.email', 't@e.com'], { cwd: dir });
  execFileSync('git', ['config', 'user.name', 'T'], { cwd: dir });
  execFileSync('git', ['add', '-A'], { cwd: dir });
  execFileSync('git', ['commit', '-q', '-m', 'init'], { cwd: dir });
  return dir;
}

test('runVerifyTestClaims passes an existing claim and flags a claimed-but-missing one', () => {
  const dir = gitTree({
    'engine/src/lib.rs': '#[test]\nfn a_real_test_that_exists() { assert!(true); }\n',
    'engine/ADMISSION-PREREGISTRATION.md': [
      'The new test, by name: `a_real_test_that_exists`.',
      'Also verified by `a_claimed_test_that_is_missing`.',
    ].join('\n'),
  });
  const { findings, claims } = runVerifyTestClaims({ repoRoot: dir });
  assert.equal(claims, 2);
  assert.equal(findings.length, 1, JSON.stringify(findings));
  assert.equal(findings[0].name, 'a_claimed_test_that_is_missing');
});

// The planned-claims rule (2026-09-16 stop-the-line). A preregistration is committed before any code
// (docs/PREREGISTRATION-TEMPLATE.md's header rule) and names its tests, so before the piece lands its
// named tests do not exist yet; that is planned, not a false claim.

function unlandedPregTree() {
  return gitTree({
    'X-PREREGISTRATION.md': 'The new test, by name: `a_test_that_does_not_exist_yet`.\n',
  });
}

// RECORDED MUTATION: remove the planned exemption in runVerifyTestClaims (push every unmatched claim
// to `findings`, ignoring `plannedGates`) → a_planned_test_in_an_unlanded_preregistration_is_advisory_not_a_failure
// fails: "AssertionError [ERR_ASSERTION]: no binding finding expected ... 1 !== 0" (the other tests pass).
test('a_planned_test_in_an_unlanded_preregistration_is_advisory_not_a_failure', () => {
  const dir = unlandedPregTree();
  const { findings, planned } = runVerifyTestClaims({
    repoRoot: dir,
    plannedGates: new Set(['X-PREREGISTRATION.md']),
  });
  assert.equal(findings.length, 0, `no binding finding expected: ${JSON.stringify(findings)}`);
  assert.equal(planned.length, 1, JSON.stringify(planned));
  assert.equal(planned[0].name, 'a_test_that_does_not_exist_yet');
  assert.equal(planned[0].relPath, 'X-PREREGISTRATION.md');
});

// RECORDED MUTATION: make plannedGateFiles exempt every gate file regardless of status (delete the
// `if (node.status === 'done') continue;` filter in plannedGateNotes) → the done node's gate file
// lands in plannedGates and a_claim_in_a_done_nodes_gate_file_is_binding fails: "AssertionError
// [ERR_ASSERTION]: [] / 0 !== 1" (actual: 0, expected: 1, operator: strictEqual).
test('a_claim_in_a_done_nodes_gate_file_is_binding', () => {
  const dir = unlandedPregTree();
  // The node LANDED, so its gate file is not in plannedGates and the claim is binding again.
  const plannedGates = plannedGateFiles({
    nodes: [{ id: 'landed', status: 'done', gate: 'X-PREREGISTRATION.md' }],
  });
  const { findings, planned } = runVerifyTestClaims({ repoRoot: dir, plannedGates });
  assert.equal(findings.length, 1, JSON.stringify(findings));
  assert.equal(findings[0].name, 'a_test_that_does_not_exist_yet');
  assert.equal(planned.length, 0, JSON.stringify(planned));
});

// RECORDED MUTATION: drop the status filter in plannedGateNotes (delete `if (node.status === 'done')
// continue;` — the same mutation as above, run once) → plannedGateFiles_ignores_done_nodes_and_gate_none
// fails: "AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal ... actual:
// [ 'engine/A-PREREGISTRATION.md', 'engine/B-PREREGISTRATION.md' ], expected:
// [ 'engine/A-PREREGISTRATION.md' ]" (the done node's gate file wrongly exempted) — a PARAPHRASE of
// the runner's strict-deep-equal diff, which prints `+ actual - expected` with the single line
// `+   'engine/B-PREREGISTRATION.md'`; not verbatim.
test('plannedGateFiles_ignores_done_nodes_and_gate_none', () => {
  const plan = {
    nodes: [
      { id: 'in-flight', status: 'in-progress', gate: 'engine/A-PREREGISTRATION.md' },
      { id: 'landed', status: 'done', gate: 'engine/B-PREREGISTRATION.md' },
      { id: 'ungated', status: 'ready', gate: 'none' },
      { id: 'no-gate-key', status: 'proposed' },
    ],
  };
  assert.deepEqual([...plannedGateFiles(plan)], ['engine/A-PREREGISTRATION.md']);
});

// RECORDED MUTATION: drop the PLANNABLE_RE filter in plannedGateFiles (return every not-done gate) →
// an_adr_named_as_a_gate_is_never_planned fails: "AssertionError [ERR_ASSERTION]: Expected values to
// be strictly deep-equal" — actual carries 'docs/adr/ADR-999-x.md' beside the preregistration.
test('an_adr_named_as_a_gate_is_never_planned', () => {
  const plan = {
    nodes: [
      { id: 'a', status: 'ready', gate: 'docs/adr/ADR-999-x.md' },
      { id: 'b', status: 'ready', gate: 'engine/A-PREREGISTRATION.md' },
    ],
  };
  assert.deepEqual([...plannedGateFiles(plan)], ['engine/A-PREREGISTRATION.md']);
});

// RECORDED MUTATION: drop the `landed` exclusion in plannedGateNotes (plan on status alone) →
// a_gate_file_named_by_any_done_node_is_never_planned fails: "AssertionError [ERR_ASSERTION]:
// Expected values to be strictly deep-equal: + actual - expected … +   'engine/S-PREREGISTRATION.md'"
// (actual: [ 'engine/S-PREREGISTRATION.md', 'engine/T-PREREGISTRATION.md' ], expected:
// [ 'engine/T-PREREGISTRATION.md' ]) — verbatim lines of the runner's diff, elided with …
test('a_gate_file_named_by_any_done_node_is_never_planned', () => {
  const plan = {
    nodes: [
      { id: 'landed', status: 'done', gate: 'engine/S-PREREGISTRATION.md' },
      { id: 'in-flight', status: 'in-progress', gate: 'engine/S-PREREGISTRATION.md' },
      { id: 'other', status: 'ready', gate: 'engine/T-PREREGISTRATION.md' },
    ],
  };
  assert.deepEqual([...plannedGateFiles(plan)], ['engine/T-PREREGISTRATION.md']);
});

// The SUPERSEDED rule (TEST-CLAIMS-SUPERSEDED-PREREGISTRATION.md; the human, round 14 item 2). A
// two-commit history: v1's claim line is fixed and hashed at its own commit, v2 appends a pin
// referencing that exact `path:line @ <v1 sha> sha256:<hex>` with the word "superseded" beside it —
// exactly ADMISSION/OWNER-INVALIDATION's own `path:line @ 46cde2c sha256:<hex>` shape.
const SUPERSEDED_DOC = 'X-PREREGISTRATION.md';
const SUPERSEDED_V1 = '# Doc\n\nVerified by test `an_old_test_name_here`.\n';
const SUPERSEDED_CLAIM_LINE = 3; // "Verified by test `an_old_test_name_here`." in SUPERSEDED_V1

function lineOfV1(n) {
  return `${SUPERSEDED_V1.split('\n')[n - 1]}\n`;
}

function sha256Hex(s) {
  return crypto.createHash('sha256').update(Buffer.from(s, 'utf8')).digest('hex');
}

/**
 * `pinnedLine` (default: the claim's own line) is the line the appended row pins; `hash` (default:
 * that pinned line's own real hash) lets a test hand in a tampered one; `word` (default: "superseded")
 * lets a test drop the required marker. Returns { dir, rev, reference }.
 */
function supersededFixture({ pinnedLine = SUPERSEDED_CLAIM_LINE, hash, word = 'superseded' } = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'verify-test-claims-superseded-'));
  fs.writeFileSync(path.join(dir, SUPERSEDED_DOC), SUPERSEDED_V1);
  execFileSync('git', ['init', '-q'], { cwd: dir });
  execFileSync('git', ['config', 'user.email', 't@e.com'], { cwd: dir });
  execFileSync('git', ['config', 'user.name', 'T'], { cwd: dir });
  execFileSync('git', ['add', '-A'], { cwd: dir });
  execFileSync('git', ['commit', '-q', '-m', 'v1'], { cwd: dir });
  const rev = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: dir, encoding: 'utf8' }).trim();
  const realHash = sha256Hex(lineOfV1(pinnedLine));
  const usedHash = hash ?? realHash;
  const reference = `${SUPERSEDED_DOC}:${pinnedLine} @ ${rev} sha256:${usedHash}`;
  const v2 = `${SUPERSEDED_V1}\nAmendment 1 -- ${reference} (${word}).\n`;
  fs.writeFileSync(path.join(dir, SUPERSEDED_DOC), v2);
  execFileSync('git', ['add', '-A'], { cwd: dir });
  execFileSync('git', ['commit', '-q', '-m', 'v2'], { cwd: dir });
  return { dir, rev, reference };
}

// RECORDED MUTATION: drop the superseded check in runVerifyTestClaims (route every claim straight to
// `findings`/`planned`, ignoring `supersededSpans`/`findSupersededSpan`) →
// a_superseded_claim_with_a_valid_pin_is_advisory_not_a_failure fails: "AssertionError
// [ERR_ASSERTION]: no binding finding expected ... 1 !== 0" (the claim lands in `findings` instead).
test('a_superseded_claim_with_a_valid_pin_is_advisory_not_a_failure', () => {
  const { dir, reference } = supersededFixture();
  const { findings, superseded } = runVerifyTestClaims({ repoRoot: dir });
  assert.equal(findings.length, 0, `no binding finding expected: ${JSON.stringify(findings)}`);
  assert.equal(superseded.length, 1, JSON.stringify(superseded));
  assert.equal(superseded[0].name, 'an_old_test_name_here');
  assert.equal(superseded[0].relPath, SUPERSEDED_DOC);
  assert.equal(superseded[0].reference, reference);
});

// RECORDED MUTATION: in findSupersededSpan, skip the `sha256Hex(slice) === span.hash` comparison
// (return the span unconditionally once it covers `line`) →
// a_superseded_pin_with_the_wrong_hash_does_not_exempt fails: "AssertionError [ERR_ASSERTION]:
// wrong-hash pin must not exempt: [] ... 0 !== 1" (the claim wrongly lands in `superseded`).
test('a_superseded_pin_with_the_wrong_hash_does_not_exempt', () => {
  const { dir } = supersededFixture({ hash: '0'.repeat(64) });
  const { findings, superseded } = runVerifyTestClaims({ repoRoot: dir });
  assert.equal(superseded.length, 0, `wrong-hash pin must not exempt: ${JSON.stringify(superseded)}`);
  assert.equal(findings.length, 1, JSON.stringify(findings));
  assert.equal(findings[0].name, 'an_old_test_name_here');
});

// RECORDED MUTATION: drop the `containsSupersededOutsideBackticks` guard in supersededSpans (accept
// any hash-pinned self-reference, marked superseded or not) →
// a_pin_without_the_word_superseded_does_not_exempt fails: "AssertionError [ERR_ASSERTION]:
// unmarked pin must not exempt: [] ... 0 !== 1".
test('a_pin_without_the_word_superseded_does_not_exempt', () => {
  const { dir } = supersededFixture({ word: 'retired' });
  const { findings, superseded } = runVerifyTestClaims({ repoRoot: dir });
  assert.equal(superseded.length, 0, `unmarked pin must not exempt: ${JSON.stringify(superseded)}`);
  assert.equal(findings.length, 1, JSON.stringify(findings));
});

// RECORDED MUTATION: in findSupersededSpan, drop the `line < span.startLine || line > span.endLine`
// range check (match the first span whose OWN hash verifies, regardless of the claim's line) →
// a_pin_to_a_different_line_does_not_exempt fails: "AssertionError [ERR_ASSERTION]: pin to a
// different line must not exempt: [] ... 0 !== 1" — the line-1 pin (a real, correctly-hashed
// self-reference, just to the WRONG line) would wrongly exempt line 3's claim.
test('a_pin_to_a_different_line_does_not_exempt', () => {
  const { dir } = supersededFixture({ pinnedLine: 1 }); // pins line 1 ("# Doc"), not the claim's line 3
  const { findings, superseded } = runVerifyTestClaims({ repoRoot: dir });
  assert.equal(superseded.length, 0, `pin to a different line must not exempt: ${JSON.stringify(superseded)}`);
  assert.equal(findings.length, 1, JSON.stringify(findings));
});
