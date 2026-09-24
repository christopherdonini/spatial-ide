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
  REPO_ROOT,
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
// referencing it. The appended row is a real markdown TABLE ROW, byte-ALIKE in shape (not content) to
// the row on MAIN at `frontends/shell/OWNER-INVALIDATION-PREREGISTRATION.md:1191 @ b14993192c8769113ddd630ab0d49d6c8ec2c897 sha256:72456eb51e3018d88b8583268fdd52b0cf4f4f263470839cf353362377836c6c` --
// round 19 item 2's correction (attempt-2 reviewer gate, entry 133): the earlier cite named
// `cut/briefa-p3b-test-names`'s unmerged `46cde2c` at `:1195`, a line only the moving branch tip ever
// carried (that file is 1174 lines at `46cde2c` itself); the reference inside ONE backtick span, in
// its own table cell, with `superseded` in a different cell (attempt-1 architect gate B6).
const SUPERSEDED_DOC = 'X-PREREGISTRATION.md';
const SUPERSEDED_CLAIM_NAME = 'an_old_test_name_here';
const SUPERSEDED_V1 = `# Doc\n\nVerified by test \`${SUPERSEDED_CLAIM_NAME}\`.\n`;
const SUPERSEDED_CLAIM_LINE = 3; // "Verified by test `an_old_test_name_here`." in SUPERSEDED_V1

function lineOfV1(n) {
  return `${SUPERSEDED_V1.split('\n')[n - 1]}\n`;
}

function sha256Hex(s) {
  return crypto.createHash('sha256').update(Buffer.from(s, 'utf8')).digest('hex');
}

function gitRepoAt(dir, seedRel, seedContent) {
  fs.writeFileSync(path.join(dir, seedRel), seedContent);
  execFileSync('git', ['init', '-q'], { cwd: dir });
  execFileSync('git', ['config', 'user.email', 't@e.com'], { cwd: dir });
  execFileSync('git', ['config', 'user.name', 'T'], { cwd: dir });
  execFileSync('git', ['add', '-A'], { cwd: dir });
  execFileSync('git', ['commit', '-q', '-m', 'v1'], { cwd: dir });
  return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: dir, encoding: 'utf8' }).trim();
}

function commitAll(dir, msg) {
  execFileSync('git', ['add', '-A'], { cwd: dir });
  execFileSync('git', ['commit', '-q', '-m', msg], { cwd: dir });
}

/** A real table-row pin: reference in ONE backtick span, `word` in a different cell (attempt-1 B6). */
function pinRow({ relPath, pinnedLine, rev, hash, word }) {
  const refText = rev === undefined ? `${relPath}:${pinnedLine} sha256:${hash}` : `${relPath}:${pinnedLine} @ ${rev} sha256:${hash}`;
  const shortRev = rev === undefined ? 'unknown' : rev.slice(0, 7);
  return `| T3 | quotes the title as of \`${shortRev}\`; ${word} | \`${refText}\` |\n`;
}

/**
 * `pinnedLine` (default: the claim's own line) is the line the appended row pins; `hash` (default:
 * that pinned line's own real hash) lets a test hand in a tampered one; `word` (default: "superseded")
 * lets a test drop the required marker; `omitRev`/`revOverride` let a test drop `@ <rev>` entirely or
 * substitute a non-commit ref (a branch name). Returns { dir, v1Rev, reference }.
 */
function supersededFixture({ pinnedLine = SUPERSEDED_CLAIM_LINE, hash, word = 'superseded', omitRev = false, revOverride } = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'verify-test-claims-superseded-'));
  const v1Rev = gitRepoAt(dir, SUPERSEDED_DOC, SUPERSEDED_V1);
  const usedHash = hash ?? sha256Hex(lineOfV1(pinnedLine));
  const revForRow = omitRev ? undefined : (revOverride ?? v1Rev);
  const row = pinRow({ relPath: SUPERSEDED_DOC, pinnedLine, rev: revForRow, hash: usedHash, word });
  fs.writeFileSync(path.join(dir, SUPERSEDED_DOC), `${SUPERSEDED_V1}\n${row}`);
  commitAll(dir, 'v2');
  // The reference cell is itself a backtick span (`pinRow`'s own shape), and `HASH_REF_RE`'s match
  // (`m[0]`, what `findSupersededSpan` returns as `span.reference`) includes that wrapping backtick.
  const reference =
    revForRow === undefined ? `\`${SUPERSEDED_DOC}:${pinnedLine} sha256:${usedHash}\`` : `\`${SUPERSEDED_DOC}:${pinnedLine} @ ${revForRow} sha256:${usedHash}\``;
  return { dir, v1Rev, reference };
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
  assert.equal(superseded[0].name, SUPERSEDED_CLAIM_NAME);
  assert.equal(superseded[0].relPath, SUPERSEDED_DOC);
  assert.equal(superseded[0].reference, reference);
});

// Attempt-1 reviewer gate B2: three of the four original RECORDED MUTATION comments here quoted a
// failure no run actually printed -- a fabricated composite (the passing shape's `[]`/`0 !== 1`
// spliced with the failing shape's operands). Each below was RE-CAPTURED by applying the mutation for
// real, running `node --test scripts/plan/verify-test-claims.test.mjs`, copying the printed message,
// then reverting. The temp repo's own commit sha and content hash differ every run (a fresh git init
// per test), so the reference string's variable part is elided `<sha>`/`<hash>`; the message text,
// the array shape, and the final `1 !== 0` comparison are copied as printed.

// RECORDED MUTATION: in findSupersededSpan, skip the `sha256Hex(slice) !== span.hash` comparison
// (`continue` removed) → fails: "AssertionError [ERR_ASSERTION]: wrong-hash pin must not exempt:
// [{"relPath":"X-PREREGISTRATION.md","line":3,"name":"an_old_test_name_here","reference":"`X-PREREGISTRATION.md:3
// @ <sha> sha256:<hash>`"}]" then "1 !== 0" (the claim wrongly lands in `superseded`).
test('a_superseded_pin_with_the_wrong_hash_does_not_exempt', () => {
  const { dir } = supersededFixture({ hash: '0'.repeat(64) });
  const { findings, superseded } = runVerifyTestClaims({ repoRoot: dir });
  assert.equal(superseded.length, 0, `wrong-hash pin must not exempt: ${JSON.stringify(superseded)}`);
  assert.equal(findings.length, 1, JSON.stringify(findings));
  assert.equal(findings[0].name, SUPERSEDED_CLAIM_NAME);
});

// RECORDED MUTATION: in supersededSpans, drop the `containsSupersededOutsideBackticks` guard →
// fails: "AssertionError [ERR_ASSERTION]: unmarked pin must not exempt:
// [{"relPath":"X-PREREGISTRATION.md","line":3,"name":"an_old_test_name_here","reference":"`X-PREREGISTRATION.md:3
// @ <sha> sha256:<hash>`"}]" then "1 !== 0". This same mutation also fails
// `a_pin_with_the_word_superseded_only_in_a_double_backtick_span_does_not_exempt` below (both tests
// exercise this one guard); its own, narrower mutation is recorded separately at that test.
test('a_pin_without_the_word_superseded_does_not_exempt', () => {
  const { dir } = supersededFixture({ word: 'retired' });
  const { findings, superseded } = runVerifyTestClaims({ repoRoot: dir });
  assert.equal(superseded.length, 0, `unmarked pin must not exempt: ${JSON.stringify(superseded)}`);
  assert.equal(findings.length, 1, JSON.stringify(findings));
});

// Line 1 ALSO names the claim (as bare prose, not a backticked second claim), so condition (d) alone
// cannot save this test -- only the range check can. Isolates the range check from condition (d)
// (their first shape, a bare `# Doc` pin, stopped discriminating once condition (d) was added: without
// the claimed name anywhere in line 1, condition (d) alone already refused that pin).
// RECORDED MUTATION: in findSupersededSpan, drop the `line < span.startLine || line > span.endLine`
// check → fails: "AssertionError [ERR_ASSERTION]: pin to a different line must not exempt:
// [{"relPath":"X-PREREGISTRATION.md","line":3,"name":"an_old_test_name_here","reference":"`X-PREREGISTRATION.md:1
// @ <sha> sha256:<hash>`"}]" then "1 !== 0" -- the reference's own `:1` shows the wrong-line span won.
test('a_pin_to_a_different_line_does_not_exempt', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'verify-test-claims-superseded-wrongline-'));
  const v1 = `# Doc mentions ${SUPERSEDED_CLAIM_NAME} in passing.\n\nVerified by test \`${SUPERSEDED_CLAIM_NAME}\`.\n`;
  const v1Rev = gitRepoAt(dir, SUPERSEDED_DOC, v1);
  const line1 = `${v1.split('\n')[0]}\n`; // pinned line 1's own historical bytes
  const row = pinRow({ relPath: SUPERSEDED_DOC, pinnedLine: 1, rev: v1Rev, hash: sha256Hex(line1), word: 'superseded' });
  fs.writeFileSync(path.join(dir, SUPERSEDED_DOC), `${v1}\n${row}`);
  commitAll(dir, 'v2');
  const { findings, superseded } = runVerifyTestClaims({ repoRoot: dir });
  assert.equal(superseded.length, 0, `pin to a different line must not exempt: ${JSON.stringify(superseded)}`);
  assert.equal(findings.length, 1, JSON.stringify(findings));
  assert.equal(findings[0].name, SUPERSEDED_CLAIM_NAME);
});

// Condition (d), attempt-1 architect gate B1. v1's line 3 is unrelated historical prose; v2 REPLACES
// that line with the claim and appends a pin whose hash matches v1's own (unrelated) bytes -- valid
// range, valid hash, marked superseded, but the historical text never names the claim.
// RECORDED MUTATION: in findSupersededSpan, drop the `if (!slice.includes(name)) continue;` check →
// fails: "AssertionError [ERR_ASSERTION]: a pin whose span lacks the claimed name must not exempt:
// [{"relPath":"X-PREREGISTRATION.md","line":3,"name":"an_old_test_name_here","reference":"`X-PREREGISTRATION.md:3
// @ <sha> sha256:<hash>`"}]" then "1 !== 0".
test('a_pin_whose_span_lacks_the_claimed_name_does_not_exempt', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'verify-test-claims-superseded-namemismatch-'));
  const v1 = '# Doc\n\nNothing interesting on this historical line.\n';
  const v1Rev = gitRepoAt(dir, SUPERSEDED_DOC, v1);
  const historicalLine = `${v1.split('\n')[2]}\n`; // line 3, as it read at v1Rev
  const row = pinRow({ relPath: SUPERSEDED_DOC, pinnedLine: 3, rev: v1Rev, hash: sha256Hex(historicalLine), word: 'superseded' });
  fs.writeFileSync(path.join(dir, SUPERSEDED_DOC), `${SUPERSEDED_V1}\n${row}`);
  commitAll(dir, 'v2');
  const { findings, superseded } = runVerifyTestClaims({ repoRoot: dir });
  assert.equal(superseded.length, 0, `a pin whose span lacks the claimed name must not exempt: ${JSON.stringify(superseded)}`);
  assert.equal(findings.length, 1, JSON.stringify(findings));
  assert.equal(findings[0].name, SUPERSEDED_CLAIM_NAME);
});

// No HEAD default, and no non-commit rev, attempt-1 architect gate B2 / reviewer gate B1: a pin with
// no `@ <rev>` at all, and a pin whose `<rev>` is a branch name rather than a commit id, must each
// leave the claim binding -- both hit the same `COMMIT_ID_RE` guard in `supersededSpans`.
// RECORDED MUTATION: replace `if (!rev || !COMMIT_ID_RE.test(rev)) continue;` with `const rev = m[5]
// ?? 'HEAD';` (the format guard dropped, the HEAD default reinstated) → fails on the FIRST assertion
// (the test throws before reaching the branch-name case): "AssertionError [ERR_ASSERTION]: a pin with
// no @ rev must not exempt: [{"relPath":"X-PREREGISTRATION.md","line":3,"name":"an_old_test_name_here","reference":"`X-PREREGISTRATION.md:3
// sha256:<hash>`"}]" then "1 !== 0".
test('a_pin_with_no_rev_does_not_exempt', () => {
  const { dir: dirNoRev } = supersededFixture({ omitRev: true });
  const noRev = runVerifyTestClaims({ repoRoot: dirNoRev });
  assert.equal(noRev.superseded.length, 0, `a pin with no @ rev must not exempt: ${JSON.stringify(noRev.superseded)}`);
  assert.equal(noRev.findings.length, 1, JSON.stringify(noRev.findings));

  const { dir: dirBranch } = supersededFixture({ revOverride: 'master' });
  const branch = runVerifyTestClaims({ repoRoot: dirBranch });
  assert.equal(branch.superseded.length, 0, `a pin whose rev is a branch name must not exempt: ${JSON.stringify(branch.superseded)}`);
  assert.equal(branch.findings.length, 1, JSON.stringify(branch.findings));
});

// Double-backtick code span, attempt-1 reviewer gate S1: `` ``superseded`` `` must still count as
// INSIDE a backtick span (the earlier `` /`[^`]*`/g `` stripped only the delimiters' own empty pairs
// and left the word visible).
// RECORDED MUTATION: replace `BACKTICK_SPAN_RE` with the earlier `` /`[^`]*`/g `` →
// fails: "AssertionError [ERR_ASSERTION]: superseded only inside a double-backtick span must not
// exempt: [{"relPath":"X-PREREGISTRATION.md","line":3,"name":"an_old_test_name_here","reference":"`X-PREREGISTRATION.md:3
// @ <sha> sha256:<hash>`"}]" then "1 !== 0" (this run's own only failure -- the other 18 tests pass).
test('a_pin_with_the_word_superseded_only_in_a_double_backtick_span_does_not_exempt', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'verify-test-claims-superseded-dblbacktick-'));
  const v1Rev = gitRepoAt(dir, SUPERSEDED_DOC, SUPERSEDED_V1);
  const refText = `${SUPERSEDED_DOC}:${SUPERSEDED_CLAIM_LINE} @ ${v1Rev} sha256:${sha256Hex(lineOfV1(SUPERSEDED_CLAIM_LINE))}`;
  const row = `| T3 | \`\`superseded\`\` | \`${refText}\` |\n`;
  fs.writeFileSync(path.join(dir, SUPERSEDED_DOC), `${SUPERSEDED_V1}\n${row}`);
  commitAll(dir, 'v2');
  const { findings, superseded } = runVerifyTestClaims({ repoRoot: dir });
  assert.equal(superseded.length, 0, `superseded only inside a double-backtick span must not exempt: ${JSON.stringify(superseded)}`);
  assert.equal(findings.length, 1, JSON.stringify(findings));
});

// Condition (e), round 19 item 2 (entry 133; attempt-2 reviewer gate finding, gate-log.json this
// node's attempt-2 reviewer record): every fixture above lacks a remote entirely, so `origin/main`
// never resolves in `originMainSha` and only `isAncestorOfMain`'s SKIPPED branch (`checked: false`)
// ever ran in this suite -- the fail-closed REFUSED branch (`checked: true, ok: false`) was untested.
// This fixture is the first to give the scanned tree a real bare `origin` remote, so both branches run
// for real: a rev that origin/main's own history actually contains exempts; a rev reachable locally
// (`git show` still finds it) but NOT an ancestor of origin/main does not.
function supersededFixtureWithRemote({ ancestorOfMain }) {
  const bareDir = fs.mkdtempSync(path.join(os.tmpdir(), 'verify-test-claims-origin-'));
  execFileSync('git', ['init', '-q', '--bare', bareDir]);

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'verify-test-claims-superseded-remote-'));
  const v1Rev = gitRepoAt(dir, SUPERSEDED_DOC, SUPERSEDED_V1); // the claim's own historical commit
  execFileSync('git', ['branch', '-M', 'main'], { cwd: dir });
  execFileSync('git', ['remote', 'add', 'origin', bareDir], { cwd: dir });

  if (ancestorOfMain) {
    // v1Rev becomes origin/main's own commit -- trivially its own ancestor.
    execFileSync('git', ['push', '-q', 'origin', 'main'], { cwd: dir });
  } else {
    // origin/main is seeded from an UNRELATED history that never contains v1Rev, pushed from a
    // second, disconnected working copy -- v1Rev stays resolvable locally (this repo's own object
    // store has it) but is not reachable from origin/main at all.
    const seedDir = fs.mkdtempSync(path.join(os.tmpdir(), 'verify-test-claims-origin-seed-'));
    gitRepoAt(seedDir, 'README.md', 'unrelated origin/main history; never contains v1Rev\n');
    execFileSync('git', ['branch', '-M', 'main'], { cwd: seedDir });
    execFileSync('git', ['remote', 'add', 'origin', bareDir], { cwd: seedDir });
    execFileSync('git', ['push', '-q', 'origin', 'main'], { cwd: seedDir });
  }
  execFileSync('git', ['fetch', '-q', 'origin'], { cwd: dir });

  const row = pinRow({
    relPath: SUPERSEDED_DOC,
    pinnedLine: SUPERSEDED_CLAIM_LINE,
    rev: v1Rev,
    hash: sha256Hex(lineOfV1(SUPERSEDED_CLAIM_LINE)),
    word: 'superseded',
  });
  fs.writeFileSync(path.join(dir, SUPERSEDED_DOC), `${SUPERSEDED_V1}\n${row}`);
  commitAll(dir, 'v2');
  return { dir };
}

// RECORDED MUTATION: in isAncestorOfMain, replace the whole body with `return { checked: true, ok:
// true };` unconditionally (condition (e) always satisfied once origin/main merely resolves, the
// ancestor check itself dropped, `mainSha`/the try/catch removed) → applied for real, run via
// `node --test scripts/plan/verify-test-claims.test.mjs`, then reverted; fails: "AssertionError
// [ERR_ASSERTION]: a rev off origin/main must not exempt:
// [{"relPath":"X-PREREGISTRATION.md","line":3,"name":"an_old_test_name_here","reference":"`X-PREREGISTRATION.md:3
// @ <sha> sha256:<hash>`"}]" then "1 !== 0" (this run's own only failure -- the other 19 tests pass;
// `<sha>`/`<hash>` elided, the temp repo's own commit and content hash differing every run).
test('a_pin_whose_rev_is_not_an_ancestor_of_origin_main_does_not_exempt', () => {
  const { dir: dirOnMain } = supersededFixtureWithRemote({ ancestorOfMain: true });
  const onMain = runVerifyTestClaims({ repoRoot: dirOnMain });
  assert.equal(onMain.findings.length, 0, `an ancestor-of-main rev must exempt: ${JSON.stringify(onMain.findings)}`);
  assert.equal(onMain.superseded.length, 1, JSON.stringify(onMain.superseded));
  assert.equal(onMain.supersededMainUnchecked, false);

  const { dir: dirOffMain } = supersededFixtureWithRemote({ ancestorOfMain: false });
  const offMain = runVerifyTestClaims({ repoRoot: dirOffMain });
  assert.equal(offMain.superseded.length, 0, `a rev off origin/main must not exempt: ${JSON.stringify(offMain.superseded)}`);
  assert.equal(offMain.findings.length, 1, JSON.stringify(offMain.findings));
});

// The WITHDRAWN rule (round 20 item 1; `state/consults/2026-09-24-withdrawn-marker.md`). Same
// hash-pinned-reference mechanism as SUPERSEDED above, marked `withdrawn-test` (never a bare
// `withdrawn`, which round-15(g) withdrawal rows already use for something else) and restricted to
// ONE pinned line, plus two riders resolved against DECISIONS-PENDING.md: `ruling:` and `carrier:`
// citations on the same line, each `round N, item M` or `entry K`.
const WITHDRAWN_DOC = 'X-PREREGISTRATION.md';
const WITHDRAWN_CLAIM_NAME = 'an_obsolete_test_name_here';
const WITHDRAWN_V1 = `# Doc\n\nVerified by test \`${WITHDRAWN_CLAIM_NAME}\`.\n`;
const WITHDRAWN_CLAIM_LINE = 3;

function nthLineOf(content, n) {
  return `${content.split('\n')[n - 1]}\n`;
}

// Test 1's own fixture ledger is the REAL RULED header and item lines from DECISIONS-PENDING.md,
// byte-copied by script (not retyped) from this piece's own base commit, `git merge-base HEAD
// origin/main` at authoring time -- round 20 item 1's own header/item (ruling) and round 18 item 4's
// own header/item (carrier), the same pairing PR #108's own rows use.
const WITHDRAWN_BASE_COMMIT = '90de3e94924f8d4d7a0307de0092fe5b5fc61095';
function ledgerLineAtBase(lineNo) {
  const text = execFileSync('git', ['show', `${WITHDRAWN_BASE_COMMIT}:DECISIONS-PENDING.md`], { cwd: REPO_ROOT, encoding: 'utf8' });
  return `${text.split('\n')[lineNo - 1]}\n`;
}
// byte-copied from DECISIONS-PENDING.md:32, :34 (round 20 item 1) and :58, :76 (round 18 item 4) at
// 90de3e94924f8d4d7a0307de0092fe5b5fc61095, via `ledgerLineAtBase` above (a script, not retyping).
const REAL_LEDGER = ledgerLineAtBase(32) + ledgerLineAtBase(34) + ledgerLineAtBase(58) + ledgerLineAtBase(76);

// A small synthetic ledger fixture for the remaining tests below (they do not need to be Authority,
// only well-formed).
const SYNTH_LEDGER = [
  '# Decisions pending the human',
  '',
  '**RULED 2026-01-01 — question round 1 (fixture):**',
  '',
  '- *Item 1 — entry 1, a fixture ruling:* **"ruled"** Applied: nothing.',
  '',
  '**RULED 2026-01-02 — question round 2 (fixture):**',
  '',
  '- *Item 5 — entry 2, a fixture carrier:* **"ruled"** Applied: nothing.',
  '',
  '3. **[RULED 2026-01-03 — an entry-only fixture ruling:]** nothing.',
  '',
].join('\n');

/**
 * `pinnedLine`/`hash` as `supersededFixture` above. `ruling`/`carrier` are the citation strings after
 * `ruling:`/`carrier:`; `omitCarrier` drops the `carrier:` clause entirely. Returns { dir, v1Rev }.
 */
function withdrawnFixture({
  pinnedLine = WITHDRAWN_CLAIM_LINE,
  hash,
  marker = 'withdrawn-test',
  ruling = 'round 1, item 1',
  carrier = 'round 2, item 5',
  omitCarrier = false,
  ledger = SYNTH_LEDGER,
} = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'verify-test-claims-withdrawn-'));
  const v1Rev = gitRepoAt(dir, WITHDRAWN_DOC, WITHDRAWN_V1);
  const usedHash = hash ?? sha256Hex(nthLineOf(WITHDRAWN_V1, pinnedLine));
  const tail = omitCarrier ? `ruling: ${ruling}` : `ruling: ${ruling}; carrier: ${carrier}`;
  const row = `- ${marker}: \`${WITHDRAWN_DOC}:${pinnedLine}\` @ ${v1Rev} sha256:${usedHash}; ${tail}\n`;
  fs.writeFileSync(path.join(dir, WITHDRAWN_DOC), `${WITHDRAWN_V1}\n${row}`);
  fs.writeFileSync(path.join(dir, 'DECISIONS-PENDING.md'), ledger);
  commitAll(dir, 'v2');
  return { dir, v1Rev };
}

// RECORDED MUTATION: in runVerifyTestClaims, delete the `if (withdrawnSpans.length) { ... }` branch
// entirely (the withdrawn-test check dropped, every claim falls straight to superseded/planned/
// findings) -- applied for real, run via `node --test scripts/plan/verify-test-claims.test.mjs`, then
// reverted; fails: "AssertionError [ERR_ASSERTION]: no binding finding expected:
// [{\"relPath\":\"X-PREREGISTRATION.md\",\"line\":3,\"name\":\"an_obsolete_test_name_here\"}]" then
// "1 !== 0" (the claim lands in `findings` instead of `withdrawn`; the other 27 tests pass).
test('a_withdrawn_test_row_with_a_resolving_ruling_and_carrier_is_advisory_not_a_failure', () => {
  const { dir } = withdrawnFixture({ ruling: 'round 20, item 1', carrier: 'round 18, item 4', ledger: REAL_LEDGER });
  const { findings, withdrawn } = runVerifyTestClaims({ repoRoot: dir });
  assert.equal(findings.length, 0, `no binding finding expected: ${JSON.stringify(findings)}`);
  assert.equal(withdrawn.length, 1, JSON.stringify(withdrawn));
  assert.equal(withdrawn[0].name, WITHDRAWN_CLAIM_NAME);
  assert.equal(withdrawn[0].ruling, 'round 20, item 1');
  assert.equal(withdrawn[0].carrier, 'round 18, item 4');
});

// RECORDED MUTATION: in resolveCitation, add `return true;` as the function's first line (every
// citation resolves) -- applied for real, run via `node --test --test-name-pattern=... scripts/plan/
// verify-test-claims.test.mjs`, then reverted; fails: "AssertionError [ERR_ASSERTION]: an unresolvable
// ruling must not exempt: [{\"relPath\":\"X-PREREGISTRATION.md\",\"line\":3,\"name\":\"an_obsolete_test_name_here\",\"reference\":\"`X-PREREGISTRATION.md:3`
// @ <sha> sha256:<hash>\",\"ruling\":\"round 99, item 1\",\"carrier\":\"round 2, item 5\"}]" then
// "1 !== 0" (`<sha>`/`<hash>` elided, the temp repo's own commit and content hash differing every run).
test('a_withdrawn_test_row_whose_ruling_does_not_resolve_fails_by_name', () => {
  const { dir } = withdrawnFixture({ ruling: 'round 99, item 1' });
  const { findings, withdrawn } = runVerifyTestClaims({ repoRoot: dir });
  assert.equal(withdrawn.length, 0, `an unresolvable ruling must not exempt: ${JSON.stringify(withdrawn)}`);
  assert.equal(findings.length, 1, JSON.stringify(findings));
  assert.equal(findings[0].name, WITHDRAWN_CLAIM_NAME);
});

// RECORDED MUTATION: in withdrawnRiders, delete `if (!carrierMatch) return { ok: false };` (the
// carrier-presence check) -- applied for real, run, then reverted; fails: "TypeError: Cannot read
// properties of null (reading '1')" at the `resolveCitation(loadDecisionsPending(root),
// carrierMatch[1])` line (carrierMatch is null; the other 27 tests pass).
test('a_withdrawn_test_row_without_a_carrier_fails_by_name', () => {
  const { dir } = withdrawnFixture({ omitCarrier: true });
  const { findings, withdrawn } = runVerifyTestClaims({ repoRoot: dir });
  assert.equal(withdrawn.length, 0, `a row without a carrier must not exempt: ${JSON.stringify(withdrawn)}`);
  assert.equal(findings.length, 1, JSON.stringify(findings));
  assert.equal(findings[0].name, WITHDRAWN_CLAIM_NAME);
});

// RECORDED MUTATION: in withdrawnRiders, delete the carrier `resolveCitation` check (keep only the
// carrier-presence check) -- applied for real, run, then reverted; fails: "AssertionError
// [ERR_ASSERTION]: an unresolvable carrier must not exempt: [{\"relPath\":\"X-PREREGISTRATION.md\",\"line\":3,\"name\":\"an_obsolete_test_name_here\",\"reference\":\"`X-PREREGISTRATION.md:3`
// @ <sha> sha256:<hash>\",\"ruling\":\"round 1, item 1\",\"carrier\":\"round 2, item 99\"}]" then
// "1 !== 0" (`<sha>`/`<hash>` elided, the temp repo's own commit and content hash differing every run).
test('a_withdrawn_test_row_whose_carrier_does_not_resolve_fails_by_name', () => {
  const { dir } = withdrawnFixture({ carrier: 'round 2, item 99' });
  const { findings, withdrawn } = runVerifyTestClaims({ repoRoot: dir });
  assert.equal(withdrawn.length, 0, `an unresolvable carrier must not exempt: ${JSON.stringify(withdrawn)}`);
  assert.equal(findings.length, 1, JSON.stringify(findings));
  assert.equal(findings[0].name, WITHDRAWN_CLAIM_NAME);
});

// A row carrying both markers ("superseded" as a word, "withdrawn-test" as the token) with an
// unresolvable ruling: the withdrawn-test riders fail, and the precedence rule (supersededSpans skips
// a withdrawn-test-marked line) must stop it falling back to SUPERSEDED, which asks nothing of a
// ruling or a carrier.
// RECORDED MUTATION: in supersededSpans, drop the `&& !containsWithdrawnTestOutsideBackticks(lineText)`
// exclusion -- applied for real, run, then reverted; fails: "AssertionError [ERR_ASSERTION]: must not
// exempt as superseded: [{\"relPath\":\"X-PREREGISTRATION.md\",\"line\":3,\"name\":\"an_obsolete_test_name_here\",\"reference\":\"`X-PREREGISTRATION.md:3
// @ <sha> sha256:<hash>`\"}]" then "1 !== 0" (the other 27 tests pass).
test('a_withdrawn_test_row_also_marked_superseded_does_not_exempt_as_superseded', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'verify-test-claims-withdrawn-both-'));
  const v1Rev = gitRepoAt(dir, WITHDRAWN_DOC, WITHDRAWN_V1);
  const hash = sha256Hex(nthLineOf(WITHDRAWN_V1, WITHDRAWN_CLAIM_LINE));
  const row = `- superseded, withdrawn-test: \`${WITHDRAWN_DOC}:${WITHDRAWN_CLAIM_LINE}\` @ ${v1Rev} sha256:${hash}; ruling: round 99, item 1; carrier: round 2, item 5\n`;
  fs.writeFileSync(path.join(dir, WITHDRAWN_DOC), `${WITHDRAWN_V1}\n${row}`);
  fs.writeFileSync(path.join(dir, 'DECISIONS-PENDING.md'), SYNTH_LEDGER);
  commitAll(dir, 'v2');
  const { findings, superseded, withdrawn } = runVerifyTestClaims({ repoRoot: dir });
  assert.equal(superseded.length, 0, `must not exempt as superseded: ${JSON.stringify(superseded)}`);
  assert.equal(withdrawn.length, 0, JSON.stringify(withdrawn));
  assert.equal(findings.length, 1, JSON.stringify(findings));
});

// One row, one pinned line (round 15(d)): a range reference is refused outright, never exempting.
// RECORDED MUTATION: in markedSpans, drop `if (singleLineOnly && startLine !== endLine) continue;` --
// applied for real, run, then reverted; fails: "AssertionError [ERR_ASSERTION]: a line-range pin must
// not exempt: [{\"relPath\":\"X-PREREGISTRATION.md\",\"line\":3,\"name\":\"an_obsolete_test_name_here\",\"reference\":\"`X-PREREGISTRATION.md:3-4
// @ <sha> sha256:<hash>`\"}]" then "1 !== 0" (the other 27 tests pass).
test('a_withdrawn_test_row_pinning_a_line_range_does_not_exempt', () => {
  const v1 = `${WITHDRAWN_V1}Second line, not itself a claim.\n`;
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'verify-test-claims-withdrawn-range-'));
  const v1Rev = gitRepoAt(dir, WITHDRAWN_DOC, v1);
  const hash = sha256Hex(nthLineOf(v1, 3) + nthLineOf(v1, 4));
  const row = `- withdrawn-test: \`${WITHDRAWN_DOC}:3-4\` @ ${v1Rev} sha256:${hash}; ruling: round 1, item 1; carrier: round 2, item 5\n`;
  fs.writeFileSync(path.join(dir, WITHDRAWN_DOC), `${v1}\n${row}`);
  fs.writeFileSync(path.join(dir, 'DECISIONS-PENDING.md'), SYNTH_LEDGER);
  commitAll(dir, 'v2');
  const { findings, withdrawn } = runVerifyTestClaims({ repoRoot: dir });
  assert.equal(withdrawn.length, 0, `a line-range pin must not exempt: ${JSON.stringify(withdrawn)}`);
  assert.equal(findings.length, 1, JSON.stringify(findings));
});

// Pins match the file's own path only (consult §3): a row's own path field naming a DIFFERENT file
// must not exempt a claim in the file that actually carries the row, even when the row's rev/hash
// happen to check out against that file's own history (isolates the path-match check alone: every
// other condition here would otherwise pass).
// RECORDED MUTATION: in markedSpans, delete `if (m[2] !== relPath) continue;` -- applied for real, run,
// then reverted; fails: "AssertionError [ERR_ASSERTION]: a row naming a different path must not exempt
// this file's claim: [{\"relPath\":\"X-PREREGISTRATION.md\",\"line\":3,\"name\":\"an_obsolete_test_name_here\",\"reference\":\"`Y-PREREGISTRATION.md:3
// @ <sha> sha256:<hash>`\"}]" then "1 !== 0" (the other 27 tests pass).
test('a_withdrawn_name_claimed_in_another_file_stays_a_finding', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'verify-test-claims-withdrawn-otherpath-'));
  const v1Rev = gitRepoAt(dir, WITHDRAWN_DOC, WITHDRAWN_V1);
  const hash = sha256Hex(nthLineOf(WITHDRAWN_V1, WITHDRAWN_CLAIM_LINE));
  // Same rev/hash as a valid row over THIS file's own history -- only the path field is wrong.
  const row = `- withdrawn-test: \`Y-PREREGISTRATION.md:${WITHDRAWN_CLAIM_LINE}\` @ ${v1Rev} sha256:${hash}; ruling: round 1, item 1; carrier: round 2, item 5\n`;
  fs.writeFileSync(path.join(dir, WITHDRAWN_DOC), `${WITHDRAWN_V1}\n${row}`);
  fs.writeFileSync(path.join(dir, 'DECISIONS-PENDING.md'), SYNTH_LEDGER);
  commitAll(dir, 'v2');
  const { findings, withdrawn } = runVerifyTestClaims({ repoRoot: dir });
  assert.equal(withdrawn.length, 0, `a row naming a different path must not exempt this file's claim: ${JSON.stringify(withdrawn)}`);
  assert.equal(findings.length, 1, JSON.stringify(findings));
});

// The marker is `withdrawn-test`, never a bare `withdrawn` (round-15(g) withdrawal rows already carry
// that word on lines pinning their own file; a bare-word marker would turn main red).
// RECORDED MUTATION: replace `WITHDRAWN_TEST_TOKEN_RE` with
// `/(?<![A-Za-z0-9_-])withdrawn(?![A-Za-z0-9_-])/` (the token relaxed to the bare word) -- applied for
// real, run, then reverted; fails: "AssertionError [ERR_ASSERTION]: a bare `withdrawn` word must not
// exempt: [{\"relPath\":\"X-PREREGISTRATION.md\",\"line\":3,\"name\":\"an_obsolete_test_name_here\",\"reference\":\"`X-PREREGISTRATION.md:3
// @ <sha> sha256:<hash>`\"}]" then "1 !== 0" (the other 27 tests pass).
test('the_bare_word_withdrawn_on_a_pinned_line_is_not_a_withdrawn_test_row', () => {
  const { dir } = withdrawnFixture({ marker: 'withdrawn' });
  const { findings, withdrawn, superseded } = runVerifyTestClaims({ repoRoot: dir });
  assert.equal(withdrawn.length, 0, `a bare \`withdrawn\` word must not exempt: ${JSON.stringify(withdrawn)}`);
  assert.equal(superseded.length, 0, JSON.stringify(superseded));
  assert.equal(findings.length, 1, JSON.stringify(findings));
});

// Custodian's note 1 (the rider's "or entry id"): a `ruling:` (or `carrier:`) citation may name a
// ledger entry number instead of a round/item pair, resolving against a line `K. **[RULED`.
// RECORDED MUTATION: in resolveCitation, delete the `if (m[3] !== undefined) return
// ledgerEntryResolves(...)` branch (the entry-id form no longer resolves) -- applied for real, run,
// then reverted; fails: "AssertionError [ERR_ASSERTION]: an entry-id ruling must resolve: [] / 0 !== 1"
// (the claim wrongly lands in `findings`; the other 27 tests pass).
test('a_withdrawn_test_row_citing_an_entry_id_instead_of_round_item_resolves', () => {
  const { dir } = withdrawnFixture({ ruling: 'entry 3' });
  const { findings, withdrawn } = runVerifyTestClaims({ repoRoot: dir });
  assert.equal(findings.length, 0, `an entry-id ruling must resolve: ${JSON.stringify(findings)}`);
  assert.equal(withdrawn.length, 1, JSON.stringify(withdrawn));
  assert.equal(withdrawn[0].ruling, 'entry 3');
});
