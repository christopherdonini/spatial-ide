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
// own header/item (carrier), the same pairing PR #108's own rows use. Built INSIDE test 1, not here at
// module top level (reviewer gate attempt 1 S4: a module-level `git show` kills every test in this
// file in a shallow clone) -- see `realLedgerFixture` below. The four lines are selected by CONTENT,
// never by line number (round 12(a); round 14(a')): the round-20 and round-18 RULED headers, then
// each one's own `- *Item 1 —` / `- *Item 4 —` line, matched by their own leading text -- provenance is
// round 20 item 1 and round 18 item 4 at 90de3e9, with no line numbers.
const WITHDRAWN_BASE_COMMIT = '90de3e94924f8d4d7a0307de0092fe5b5fc61095';

/** The header line starting `**RULED ... question round N` plus its own `- *Item M —` line, found by
 * content within `N`'s own block (up to the next `**`/`## ` boundary) -- never by line number. */
function ruledBlockLines(ledgerText, round, item) {
  const lines = ledgerText.split('\n');
  const headerIdx = lines.findIndex((l) => l.startsWith('**RULED') && l.includes(`question round ${round}`));
  if (headerIdx === -1) throw new Error(`fixture ledger: round ${round} header not found`);
  for (let i = headerIdx + 1; i < lines.length; i++) {
    if (lines[i].startsWith('**RULED') || lines[i].startsWith('## ')) break;
    if (lines[i].startsWith(`- *Item ${item} —`)) return `${lines[headerIdx]}\n${lines[i]}\n`;
  }
  throw new Error(`fixture ledger: round ${round} item ${item} not found`);
}

/** Reads DECISIONS-PENDING.md at the base commit and returns round 20 item 1 + round 18 item 4's own
 * header/item lines, byte-copied by this script (not retyped). */
function realLedgerFixture() {
  const text = execFileSync('git', ['show', `${WITHDRAWN_BASE_COMMIT}:DECISIONS-PENDING.md`], { cwd: REPO_ROOT, encoding: 'utf8' });
  return ruledBlockLines(text, 20, 1) + ruledBlockLines(text, 18, 4);
}

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

// Deleting the `if (withdrawnSpans.length) { ... }` branch entirely (the withdrawn-test check, and the
// `invalidRowLines` suppression inside it, both dropped) is NOT isolated to this one test: over the full file it fails 10
// of 35 and 25 pass -- the "also marked superseded" test passes, its fixture being a range row the
// withdrawn-test check never reads; which 10: the attempt-2 reviewer record, `state/gate-log.json`
// index 186.
// RECORDED MUTATION: delete that branch in runVerifyTestClaims -- applied for real against the full
// file, then reverted; this test fails: "no binding finding expected: [{...,\"kind\":\"claim\"}] / 1 !== 0"
// (25 of 35 pass; see above).
test('a_withdrawn_test_row_with_a_resolving_ruling_and_carrier_is_advisory_not_a_failure', () => {
  const { dir } = withdrawnFixture({ ruling: 'round 20, item 1', carrier: 'round 18, item 4', ledger: realLedgerFixture() });
  const { findings, withdrawn } = runVerifyTestClaims({ repoRoot: dir });
  assert.equal(findings.length, 0, `no binding finding expected: ${JSON.stringify(findings)}`);
  assert.equal(withdrawn.length, 1, JSON.stringify(withdrawn));
  assert.equal(withdrawn[0].name, WITHDRAWN_CLAIM_NAME);
  assert.equal(withdrawn[0].ruling, 'round 20, item 1');
  assert.equal(withdrawn[0].carrier, 'round 18, item 4');
});

// Round 21 item 2 (entry 136): checked at the ROW level now, independent of any specific claim --
// tests 2-4 assert the per-row finding BY CITATION TEXT (`findings[0].message`), not by the claim's
// own name (a broken row's finding no longer carries a `name` at all; see `runVerifyTestClaims`'s own
// doc comment).
// This mutation fails 4 of 35 over the full file: this test, the carrier-does-not-resolve test, the
// named regression test and the planned-gate test (the attempt-2 reviewer record, `state/gate-log.json`
// index 186).
// RECORDED MUTATION: in resolveCitation, add `return true;` as its first line -- applied for real
// against the full file, then reverted; fails: "an unresolvable ruling must not exempt: [{...,\"ruling\":
// \"round 99, item 1\",\"carrier\":\"round 2, item 5\"}] / 1 !== 0" (the row's own riders now both
// resolve, so the claim is wrongly exempted as withdrawn instead of failing).
test('a_withdrawn_test_row_whose_ruling_does_not_resolve_fails_by_name', () => {
  const { dir } = withdrawnFixture({ ruling: 'round 99, item 1' });
  const { findings, withdrawn } = runVerifyTestClaims({ repoRoot: dir });
  assert.equal(withdrawn.length, 0, `an unresolvable ruling must not exempt: ${JSON.stringify(withdrawn)}`);
  assert.equal(findings.length, 1, JSON.stringify(findings));
  assert.equal(findings[0].kind, 'withdrawn-row', JSON.stringify(findings));
  assert.equal(findings[0].message, 'unresolvable ruling: round 99, item 1', JSON.stringify(findings));
});

// RECORDED MUTATION: in withdrawnRiders, change `if (!carrierMatch) return { ok: false, failure: 'no
// carrier' };` to `if (!carrierMatch) return { ok: true, ruling: rulingText, carrier: undefined };`
// (the stronger mutation: missing carrier is treated as VALID, rather than merely dropping the check
// and crashing on the next line) -- applied for real, run, then reverted; fails at the assertion, not
// a crash: "AssertionError [ERR_ASSERTION]: a row without a carrier must not exempt: [{...,\"ruling\":
// \"round 1, item 1\",\"carrier\":undefined}]" (`withdrawn.length` becomes 1; the test stops at this first
// assertion).
test('a_withdrawn_test_row_without_a_carrier_fails_by_name', () => {
  const { dir } = withdrawnFixture({ omitCarrier: true });
  const { findings, withdrawn } = runVerifyTestClaims({ repoRoot: dir });
  assert.equal(withdrawn.length, 0, `a row without a carrier must not exempt: ${JSON.stringify(withdrawn)}`);
  assert.equal(findings.length, 1, JSON.stringify(findings));
  assert.equal(findings[0].message, 'no carrier', JSON.stringify(findings));
});

// RECORDED MUTATION: in withdrawnRiders, drop the carrier `CITATION_EXACT_RE`/`resolveCitation` check
// (only carrier PRESENCE checked) -- applied for real against the full file, then reverted; fails: "an
// unresolvable carrier must not exempt: [{...,\"ruling\":\"round 1, item 1\",\"carrier\":\"round 2, item
// 99\"}] / 1 !== 0" (the claim is wrongly exempted as withdrawn instead of failing).
test('a_withdrawn_test_row_whose_carrier_does_not_resolve_fails_by_name', () => {
  const { dir } = withdrawnFixture({ carrier: 'round 2, item 99' });
  const { findings, withdrawn } = runVerifyTestClaims({ repoRoot: dir });
  assert.equal(withdrawn.length, 0, `an unresolvable carrier must not exempt: ${JSON.stringify(withdrawn)}`);
  assert.equal(findings.length, 1, JSON.stringify(findings));
  assert.equal(findings[0].message, 'unresolvable carrier: round 2, item 99', JSON.stringify(findings));
});

// A row carrying both markers ("superseded" as a word, "withdrawn-test" as the token), as a RANGE
// reference: refused as a withdrawn-test SPAN outright (round 15(d)'s "one row, one line" --
// `withdrawnTestSpans` filters any range via `singleLineOnly`), so the row-level check never even sees
// it and cannot suppress anything for it (round 21 item 2's `invalidRowLines` mechanism only ever fires
// for a reference `withdrawnTestSpans` accepts as a span in the first place). The only thing standing
// between this claim and a wrongful SUPERSEDED exemption (which asks nothing of a ruling or a carrier)
// is `supersededSpans`'s own precedence exclusion of any line ALSO carrying the `withdrawn-test` token.
// RECORDED MUTATION: in supersededSpans, drop the `&& !containsWithdrawnTestOutsideBackticks(lineText)`
// exclusion -- applied for real, run, then reverted; fails at its first assertion (the claim lands in
// `superseded`); the printed finding: the attempt-2 reviewer record, `state/gate-log.json` index 186.
test('a_withdrawn_test_row_also_marked_superseded_does_not_exempt_as_superseded', () => {
  const v1 = `${WITHDRAWN_V1}Second line, not itself a claim.\n`;
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'verify-test-claims-withdrawn-both-'));
  const v1Rev = gitRepoAt(dir, WITHDRAWN_DOC, v1);
  const hash = sha256Hex(nthLineOf(v1, 3) + nthLineOf(v1, 4));
  const row = `- superseded, withdrawn-test: \`${WITHDRAWN_DOC}:3-4\` @ ${v1Rev} sha256:${hash}\n`;
  fs.writeFileSync(path.join(dir, WITHDRAWN_DOC), `${v1}\n${row}`);
  fs.writeFileSync(path.join(dir, 'DECISIONS-PENDING.md'), SYNTH_LEDGER);
  commitAll(dir, 'v2');
  const { findings, superseded, withdrawn } = runVerifyTestClaims({ repoRoot: dir });
  assert.equal(superseded.length, 0, `must not exempt as superseded: ${JSON.stringify(superseded)}`);
  assert.equal(withdrawn.length, 0, JSON.stringify(withdrawn));
  assert.equal(findings.length, 1, JSON.stringify(findings));
});

// One row, one pinned line (round 15(d)): a range reference is refused outright, never exempting.
// RECORDED MUTATION: in markedSpans, drop `if (singleLineOnly && startLine !== endLine) continue;` --
// applied for real, run against the full file, then reverted; fails at its first assertion (the claim
// lands in `withdrawn`); the printed finding: the attempt-2 reviewer record, `state/gate-log.json`
// index 186.
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
// RECORDED MUTATION: in markedSpans, delete `if (m[2] !== relPath) continue;` -- applied for real, run
// against the full file, then reverted; fails at its first assertion (the claim lands in `withdrawn`);
// the printed finding: the attempt-2 reviewer record, `state/gate-log.json` index 186.
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
// that word on lines pinning their own file; a bare-word marker would turn main red). This mutation is
// NOT isolated to this one test: since the negative lookahead `(?![A-Za-z0-9_-])` still refuses a match
// immediately before the `-` of `-test`, the relaxed regex no longer matches a genuine `withdrawn-test`
// token AT ALL, so every test whose fixture relies on one being recognized also fails (the five original
// riders tests, the entry-id test, and the six tests added this round). The
// two tests whose fixture is refused for an UNRELATED reason (the line-range pin, the wrong-path pin)
// are unaffected.
// RECORDED MUTATION: replace `WITHDRAWN_TEST_TOKEN_RE` with
// `/(?<![A-Za-z0-9_-])withdrawn(?![A-Za-z0-9_-])/` -- applied for real against the full file, then
// reverted; fails 13 of 35, including this test at its first assertion (the claim lands in
// `withdrawn`); the printed finding: the attempt-2 reviewer record, `state/gate-log.json` index 186.
test('the_bare_word_withdrawn_on_a_pinned_line_is_not_a_withdrawn_test_row', () => {
  const { dir } = withdrawnFixture({ marker: 'withdrawn' });
  const { findings, withdrawn, superseded } = runVerifyTestClaims({ repoRoot: dir });
  assert.equal(withdrawn.length, 0, `a bare \`withdrawn\` word must not exempt: ${JSON.stringify(withdrawn)}`);
  assert.equal(superseded.length, 0, JSON.stringify(superseded));
  assert.equal(findings.length, 1, JSON.stringify(findings));
});

// Custodian's note 1 (the rider's "or entry id"): a `ruling:` (or `carrier:`) citation may name a
// ledger entry number instead of a round/item pair, resolving against a line `K. **[RULED`.
// RECORDED MUTATION: delete the entry-id branch in resolveCitation -- applied for real against the full
// file, then reverted; fails: "an entry-id ruling must resolve:
// [{...,\"kind\":\"withdrawn-row\",\"message\":\"unresolvable ruling: entry 3\"}]" then "1 !== 0" (the
// other 34 tests pass).
test('a_withdrawn_test_row_citing_an_entry_id_instead_of_round_item_resolves', () => {
  const { dir } = withdrawnFixture({ ruling: 'entry 3' });
  const { findings, withdrawn } = runVerifyTestClaims({ repoRoot: dir });
  assert.equal(findings.length, 0, `an entry-id ruling must resolve: ${JSON.stringify(findings)}`);
  assert.equal(withdrawn.length, 1, JSON.stringify(withdrawn));
  assert.equal(withdrawn[0].ruling, 'entry 3');
});

// Round 21, item 2 (entry 136): the reviewer's probe that item names, kept as a regression test that
// must fail by name -- here pinning a line whose claimed test EXISTS in the tree, so
// the per-claim loop never even looks at it (`testExists` short-circuits before any withdrawn-span
// check runs). Only the ROW-level check (independent of any specific claim) can catch this: the row is
// checked whatever the state of the claim on its line (entry 136, option (1)), and must fail by
// name, naming the unresolved `ruling:` citation. Deleting the row-level validation loop is NOT isolated
// to this one test: it also fails the three other riders tests and the four should-fix (a) probes below
// (each keeps one finding, but the un-suppressed ordinary claim kind, not the row-level one asserted on)
// and the planned-gate test after this one (its claim lands in `planned` instead) -- 9 of 35 in all.
// RECORDED MUTATION: delete that loop in runVerifyTestClaims -- applied for real against the full file,
// then reverted; this test gets no finding at all: "a bad row pinning an existing claim must still
// fail: [] / 0 !== 1" (the other 26 tests pass).
test('a_withdrawn_test_row_pinning_a_line_whose_claimed_test_exists_still_fails_by_name', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'verify-test-claims-withdrawn-existing-'));
  const pregV1 = '# Doc\n\nVerified by test `a_real_test_that_exists`.\n';
  const claimLine = 3;
  fs.mkdirSync(path.join(dir, 'engine', 'src'), { recursive: true });
  fs.writeFileSync(path.join(dir, WITHDRAWN_DOC), pregV1);
  fs.writeFileSync(path.join(dir, 'engine/src/lib.rs'), '#[test]\nfn a_real_test_that_exists() { assert!(true); }\n');
  fs.writeFileSync(path.join(dir, 'DECISIONS-PENDING.md'), SYNTH_LEDGER);
  execFileSync('git', ['init', '-q'], { cwd: dir });
  execFileSync('git', ['config', 'user.email', 't@e.com'], { cwd: dir });
  execFileSync('git', ['config', 'user.name', 'T'], { cwd: dir });
  execFileSync('git', ['add', '-A'], { cwd: dir });
  execFileSync('git', ['commit', '-q', '-m', 'v1'], { cwd: dir });
  const v1Rev = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: dir, encoding: 'utf8' }).trim();
  const hash = sha256Hex(nthLineOf(pregV1, claimLine));
  const row = `- withdrawn-test: \`${WITHDRAWN_DOC}:${claimLine}\` @ ${v1Rev} sha256:${hash}; ruling: round 99, item 1; carrier: nonsense\n`;
  fs.writeFileSync(path.join(dir, WITHDRAWN_DOC), `${pregV1}\n${row}`);
  commitAll(dir, 'v2');
  const { findings, withdrawn } = runVerifyTestClaims({ repoRoot: dir });
  assert.equal(withdrawn.length, 0, `a bad row must not exempt anything: ${JSON.stringify(withdrawn)}`);
  assert.equal(findings.length, 1, `a bad row pinning an existing claim must still fail: ${JSON.stringify(findings)}`);
  assert.equal(findings[0].kind, 'withdrawn-row', JSON.stringify(findings));
  assert.equal(findings[0].message, 'unresolvable ruling: round 99, item 1', JSON.stringify(findings));
});

// Round 20, item 1, rider (a), applied by round 21, item 2 -- whatever its node's status, a broken
// withdrawn-test row fails even in a file
// that is itself PLANNED (its node not `done`); it is never merely advisory the way a genuinely
// planned, not-yet-written test claim is.
// RECORDED MUTATION: route the row-level finding through the same planned/binding gate as a claim
// finding -- applied for real against the full file, then reverted; fails only this test: the row's
// finding wrongly lands in `planned` (length 1) instead of `findings`, "1 !== 0" on the `planned.length`
// assertion (the other 34 tests pass).
test('a_withdrawn_test_row_in_a_planned_gate_file_still_fails_by_name', () => {
  const { dir } = withdrawnFixture({ ruling: 'round 99, item 1' });
  const { findings, withdrawn, planned } = runVerifyTestClaims({ repoRoot: dir, plannedGates: new Set([WITHDRAWN_DOC]) });
  assert.equal(withdrawn.length, 0, JSON.stringify(withdrawn));
  assert.equal(planned.length, 0, `a bad withdrawn-test row must not be merely planned: ${JSON.stringify(planned)}`);
  assert.equal(findings.length, 1, `a bad row must still be a binding finding even when its file is planned: ${JSON.stringify(findings)}`);
  assert.equal(findings[0].message, 'unresolvable ruling: round 99, item 1', JSON.stringify(findings));
});

// Should-fix (a): `ruling:`/`carrier:` are matched as WHOLE keys, never a substring of a longer
// identifier -- `overruling:` must not be read as carrying a `ruling:` key.
// RECORDED MUTATION: in withdrawnRiders, drop the `(?<![A-Za-z0-9_-])` lookbehind from
// WITHDRAWN_RULING_RE/WITHDRAWN_CARRIER_RE (both regexes read `ruling:\s*([^;]*)` / `carrier:\s*(.*)$`
// with no word-boundary guard) -- applied for real, run, then reverted; fails: "AssertionError
// [ERR_ASSERTION]: overruling: must not be read as a ruling: key: [{...,\"ruling\":\"round 1, item
// 1\",\"carrier\":\"round 2, item 5\"}] / 1 !== 0" (`overruling: round 1, item 1` is wrongly recognized
// and the claim wrongly exempted as withdrawn; `a_row_key_miscarrier_is_not_recognized_as_a_carrier_key`
// below also fails under this same mutation).
test('a_row_key_overruling_is_not_recognized_as_a_ruling_key', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'verify-test-claims-withdrawn-overruling-'));
  const v1Rev = gitRepoAt(dir, WITHDRAWN_DOC, WITHDRAWN_V1);
  const hash = sha256Hex(nthLineOf(WITHDRAWN_V1, WITHDRAWN_CLAIM_LINE));
  const row = `- withdrawn-test: \`${WITHDRAWN_DOC}:${WITHDRAWN_CLAIM_LINE}\` @ ${v1Rev} sha256:${hash}; overruling: round 1, item 1; carrier: round 2, item 5\n`;
  fs.writeFileSync(path.join(dir, WITHDRAWN_DOC), `${WITHDRAWN_V1}\n${row}`);
  fs.writeFileSync(path.join(dir, 'DECISIONS-PENDING.md'), SYNTH_LEDGER);
  commitAll(dir, 'v2');
  const { findings, withdrawn } = runVerifyTestClaims({ repoRoot: dir });
  assert.equal(withdrawn.length, 0, `overruling: must not be read as a ruling: key: ${JSON.stringify(withdrawn)}`);
  assert.equal(findings.length, 1, JSON.stringify(findings));
  assert.equal(findings[0].message, 'no ruling', JSON.stringify(findings));
});

// Should-fix (a), the carrier half of the same guard: `miscarrier:` must not be read as a `carrier:` key.
// RECORDED MUTATION: the same lookbehind drop as the test above (one guard, shared by both regexes) --
// applied for real, run, then reverted; fails: "AssertionError [ERR_ASSERTION]: miscarrier: must not be
// read as a carrier: key: [{...,\"ruling\":\"round 1, item 1\",\"carrier\":\"round 2, item 5\"}] / 1 !== 0"
// (`miscarrier: round 2, item 5` is wrongly recognized and the claim wrongly exempted as withdrawn).
test('a_row_key_miscarrier_is_not_recognized_as_a_carrier_key', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'verify-test-claims-withdrawn-miscarrier-'));
  const v1Rev = gitRepoAt(dir, WITHDRAWN_DOC, WITHDRAWN_V1);
  const hash = sha256Hex(nthLineOf(WITHDRAWN_V1, WITHDRAWN_CLAIM_LINE));
  const row = `- withdrawn-test: \`${WITHDRAWN_DOC}:${WITHDRAWN_CLAIM_LINE}\` @ ${v1Rev} sha256:${hash}; ruling: round 1, item 1; miscarrier: round 2, item 5\n`;
  fs.writeFileSync(path.join(dir, WITHDRAWN_DOC), `${WITHDRAWN_V1}\n${row}`);
  fs.writeFileSync(path.join(dir, 'DECISIONS-PENDING.md'), SYNTH_LEDGER);
  commitAll(dir, 'v2');
  const { findings, withdrawn } = runVerifyTestClaims({ repoRoot: dir });
  assert.equal(withdrawn.length, 0, `miscarrier: must not be read as a carrier: key: ${JSON.stringify(withdrawn)}`);
  assert.equal(findings.length, 1, JSON.stringify(findings));
  assert.equal(findings[0].message, 'no carrier', JSON.stringify(findings));
});

// Should-fix (a): `ruling:`/`carrier:` are matched OUTSIDE any backtick span -- a row that wraps the
// whole `ruling: ...; carrier: ...` clause in its own backtick span (quoting it, not directing it) must
// not resolve. The un-stripped backtick still lets the keys match, and `carrier:`'s greedy `(.*)$` also
// swallows the closing backtick, so `CITATION_EXACT_RE` refuses it -- the row still gets a finding, but
// the WRONG one ("unresolvable carrier: ...", not the expected "no ruling").
// RECORDED MUTATION: drop the `.replace(BACKTICK_SPAN_RE, '')` in withdrawnRiders -- applied for real
// against the full file, then reverted; fails only this test: "+ 'unresolvable carrier: round 2, item
// 5\`' - 'no ruling'" (the other 34 tests pass).
test('a_withdrawn_test_row_with_ruling_and_carrier_only_inside_a_backtick_span_is_not_recognized', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'verify-test-claims-withdrawn-backtick-'));
  const v1Rev = gitRepoAt(dir, WITHDRAWN_DOC, WITHDRAWN_V1);
  const hash = sha256Hex(nthLineOf(WITHDRAWN_V1, WITHDRAWN_CLAIM_LINE));
  const row = `- withdrawn-test: \`${WITHDRAWN_DOC}:${WITHDRAWN_CLAIM_LINE}\` @ ${v1Rev} sha256:${hash}; \`ruling: round 1, item 1; carrier: round 2, item 5\`\n`;
  fs.writeFileSync(path.join(dir, WITHDRAWN_DOC), `${WITHDRAWN_V1}\n${row}`);
  fs.writeFileSync(path.join(dir, 'DECISIONS-PENDING.md'), SYNTH_LEDGER);
  commitAll(dir, 'v2');
  const { findings, withdrawn } = runVerifyTestClaims({ repoRoot: dir });
  assert.equal(withdrawn.length, 0, `a backticked ruling/carrier clause must not resolve: ${JSON.stringify(withdrawn)}`);
  assert.equal(findings.length, 1, JSON.stringify(findings));
  assert.equal(findings[0].message, 'no ruling', JSON.stringify(findings));
});

// Should-fix (a): the citation text must be EXACTLY `round N, item M` or `entry K`, nothing on either
// side -- `not round 20, item 1` must not resolve even though it CONTAINS a real, resolvable citation.
// Dropping the exact-grammar check leaves only `resolveCitation`, whose own unanchored `CITATION_RE`
// finds "round 20, item 1" embedded inside "not round 20, item 1".
// RECORDED MUTATION: drop the `CITATION_EXACT_RE.test(rulingText) ||` half of the ruling check in
// withdrawnRiders -- applied for real against the full file, then reverted; fails only this test: the
// claim wrongly lands in `withdrawn` ("1 !== 0"; the other 34 tests pass).
test('a_ruling_citation_with_a_leading_not_does_not_resolve', () => {
  const ledgerWithRound20 = `${SYNTH_LEDGER}\n**RULED 2026-01-04 — question round 20 (fixture):**\n\n- *Item 1 — entry 4, a fixture ruling:* **"ruled"** Applied: nothing.\n`;
  const { dir } = withdrawnFixture({ ruling: 'not round 20, item 1', ledger: ledgerWithRound20 });
  const { findings, withdrawn } = runVerifyTestClaims({ repoRoot: dir });
  assert.equal(withdrawn.length, 0, `"not round 20, item 1" must not resolve: ${JSON.stringify(withdrawn)}`);
  assert.equal(findings.length, 1, JSON.stringify(findings));
  assert.equal(findings[0].message, 'unresolvable ruling: not round 20, item 1', JSON.stringify(findings));
});
