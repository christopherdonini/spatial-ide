// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors
//
// Tests for verify-quotes.mjs -- the verbatim-quote check (VERIFY-QUOTES-PREREGISTRATION.md).
// Each new test's mutation is recorded in its own `// RECORDED MUTATION:` comment immediately above
// it, performed once against scripts/plan/verify-quotes.mjs and reverted (AUTONOMY.md §14).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { normalizeText, extractQuotePassages, runVerifyQuotes, listCiteContents, REPO_ROOT } from './verify-quotes.mjs';

function sha256(s) {
  return crypto.createHash('sha256').update(Buffer.from(s, 'utf8')).digest('hex');
}

function headOf(dir) {
  return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: dir, encoding: 'utf8' }).trim();
}

function gitTree(files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'verify-quotes-'));
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

// These two tests carry no `// RECORDED MUTATION:` comment of their own (Amendment 3; disclosed at
// Amendment 5 point 11 as pure-function unit checks whose branches every test below already covers by
// name). Reviewer should-fix 5, said plainly: `verify-mutation.mjs` nonetheless prints `ok` for both --
// it matches "mutation" occurring anywhere in this FILE (this header comment's own line 5-6), not a
// mutation naming THIS test -- so `node scripts/plan/verify-mutation.mjs`'s confirmation does not
// actually reach these two; the disclosure above is the only proof either one has.
test('normalizeText strips blockquote prefixes, folds curly quotes/dashes, collapses whitespace', () => {
  assert.equal(normalizeText('> a  b\n> c“d”—e'), 'a b c"d"-e');
});

test('extractQuotePassages finds an 8+ word straight quote introduced by a trigger word', () => {
  const text = 'The record reads: "the quick brown fox jumps over the lazy dog daily" and more.';
  const passages = extractQuotePassages(text);
  assert.equal(passages.length, 1);
  assert.equal(passages[0].kind, 'straight');
});

// RECORDED MUTATION: removing 'verbatim' from TRIGGERS (scripts/plan/verify-quotes.mjs) makes
// a_true_straight_quote_verifies_against_the_tracked_tree FAIL: "AssertionError [ERR_ASSERTION]:
// Expected values to be strictly equal: 0 !== 1" on `checked` (the quote is no longer recognized as
// verbatim-introduced at all, so nothing is checked).
test('a_true_straight_quote_verifies_against_the_tracked_tree', () => {
  const dir = gitTree({
    'A.md': 'Verbatim: "the quick brown fox jumps over the lazy dog daily" end.\n',
    'B.md': 'Elsewhere: the quick brown fox jumps over the lazy dog daily.\n',
  });
  const { findings, checked } = runVerifyQuotes({ repoRoot: dir, files: [path.join(dir, 'A.md')] });
  assert.equal(checked, 1);
  assert.equal(findings.length, 0, JSON.stringify(findings));
});

// RECORDED MUTATION: changing ATOMIC_BLOCKQUOTE_RE's `>` to `>>` (scripts/plan/verify-quotes.mjs) makes
// a_blockquote_wrapped_multiline_quote_verifies FAIL: "AssertionError [ERR_ASSERTION]: Expected
// values to be strictly equal: 0 !== 1" on `checked` (no ordinary `> ` line is recognized as a
// blockquote run any more).
test('a_blockquote_wrapped_multiline_quote_verifies', () => {
  const dir = gitTree({
    'A.md': 'The ruling reads:\n\n> the quick brown fox jumps over\n> the lazy dog again today\n',
    'B.md': 'Elsewhere: the quick brown fox jumps over the lazy dog again today.\n',
  });
  const { findings, checked } = runVerifyQuotes({ repoRoot: dir, files: [path.join(dir, 'A.md')] });
  assert.equal(checked, 1);
  assert.equal(findings.length, 0, JSON.stringify(findings));
});

// RECORDED MUTATION: swapping CURLY_RE's opening marker from “ to ‘ (scripts/plan/verify-quotes.mjs)
// makes a_curly_quote_verifies FAIL: "AssertionError [ERR_ASSERTION]: Expected values to be strictly
// equal: 0 !== 1" on `checked` (a real curly double-quote span is no longer matched).
test('a_curly_quote_verifies', () => {
  const dir = gitTree({
    'A.md': 'It states: “the swift zebra runs across golden fields swiftly” done.\n',
    'B.md': 'Elsewhere: the swift zebra runs across golden fields swiftly.\n',
  });
  const { findings, checked } = runVerifyQuotes({ repoRoot: dir, files: [path.join(dir, 'A.md')] });
  assert.equal(checked, 1);
  assert.equal(findings.length, 0, JSON.stringify(findings));
});

// RECORDED MUTATION: forcing the wide-search match in runVerifyQuotes to `true` unconditionally
// (scripts/plan/verify-quotes.mjs) makes a_one_word_misquote_fails FAIL: "AssertionError
// [ERR_ASSERTION]: Expected values to be strictly equal: 0 !== 1" on `findings.length` (a misquote is
// wrongly reported as verified).
test('a_one_word_misquote_fails', () => {
  const dir = gitTree({
    'A.md': 'Verbatim: "the quick brown fox jumps over the sleepy dog daily" end.\n',
    'B.md': 'Elsewhere: the quick brown fox jumps over the lazy dog daily.\n',
  });
  const { findings } = runVerifyQuotes({ repoRoot: dir, files: [path.join(dir, 'A.md')] });
  assert.equal(findings.length, 1, JSON.stringify(findings));
  assert.match(findings[0].snippet, /sleepy/);
});

// RECORDED MUTATION (round 10, item finding 1): reintroducing the old "found elsewhere -> advisory"
// fallback inside the `named.length === 1` miss branch (scripts/plan/verify-quotes.mjs's
// runVerifyQuotes) makes a_path_introduced_quote_not_found_in_its_named_file_fails_even_when_found_elsewhere
// FAIL: "AssertionError [ERR_ASSERTION]: Expected values to be strictly equal: 0 !== 1" on
// `findings.length` (a path-cited quote missing from its own named file wrongly softens to advisory
// instead of failing, the human's round-10 fix-by-construction directive: "GATE it against that file
// (a miss in the named file is a FAIL, not an advisory)").
test('a_path_introduced_quote_not_found_in_its_named_file_fails_even_when_found_elsewhere', () => {
  const dir = gitTree({
    'A.md': 'As `other/file.md:1` reads: "some other passage with eight distinct words present here" end.\n',
    'other/file.md': 'nothing to do with the quote\n',
    'elsewhere.md': 'Found here: some other passage with eight distinct words present here.\n',
  });
  const { findings, advisories } = runVerifyQuotes({ repoRoot: dir, files: [path.join(dir, 'A.md')] });
  assert.equal(advisories.length, 0, JSON.stringify(advisories));
  assert.equal(findings.length, 1, JSON.stringify(findings));
  assert.match(findings[0].reason, /other\/file\.md/);
});

// RECORDED MUTATION: flattening the ambiguous/unresolved ternary in runVerifyQuotes's advisory `reason`
// to always read the ambiguous message (scripts/plan/verify-quotes.mjs) makes
// a_path_cite_that_does_not_resolve_to_any_tracked_file_is_advisory_not_gated FAIL: "AssertionError
// [ERR_ASSERTION]" on `assert.match(advisories[0].reason, /does not resolve/)` (an unresolved cite is
// misreported as ambiguous).
test('a_path_cite_that_does_not_resolve_to_any_tracked_file_is_advisory_not_gated', () => {
  const dir = gitTree({
    'A.md': 'As `missing/nowhere.md:1` reads: "a passage that exists nowhere in this tiny fixture tree" end.\n',
  });
  const { findings, advisories } = runVerifyQuotes({ repoRoot: dir, files: [path.join(dir, 'A.md')] });
  assert.equal(findings.length, 0, JSON.stringify(findings));
  assert.equal(advisories.length, 1, JSON.stringify(advisories));
  assert.match(advisories[0].reason, /does not resolve/);
});

// RECORDED MUTATION: changing the firstLine slice bound from 100 to 0 (scripts/plan/verify-quotes.mjs's
// listCiteContents) makes a_cite_listing_reports_the_first_cited_lines_text FAIL: "AssertionError
// [ERR_ASSERTION]: Expected values to be strictly equal: + actual - expected + '' - 'the cited line
// text'" (the target line's text is blanked instead of reported).
test('a_cite_listing_reports_the_first_cited_lines_text', () => {
  const dir = gitTree({
    'A.md': 'See `other/data.rs:2` for the rule.\n',
    'other/data.rs': 'line one\nthe cited line text\nline three\n',
  });
  const cites = listCiteContents({ repoRoot: dir, files: [path.join(dir, 'A.md')] });
  assert.equal(cites.length, 1);
  assert.equal(cites[0].target, 'other/data.rs:2');
  assert.equal(cites[0].firstLine, 'the cited line text');
});

// RECORDED MUTATION (round 10, finding 6): reverting listCiteContents to `(exact.length ? exact :
// all)[0]` and reading its content unconditionally (scripts/plan/verify-quotes.mjs) makes
// a_cite_listing_reports_ambiguous_for_multiple_same_basename_candidates FAIL: "AssertionError
// [ERR_ASSERTION]" (the first same-basename candidate's own line 2 -- "two" or "dos" -- is printed
// instead of the ambiguity being disclosed).
test('a_cite_listing_reports_ambiguous_for_multiple_same_basename_candidates', () => {
  const dir = gitTree({
    'A.md': 'See `data.rs:2` for the rule.\n',
    'x/data.rs': 'one\ntwo\nthree\n',
    'y/data.rs': 'uno\ndos\ntres\n',
  });
  const cites = listCiteContents({ repoRoot: dir, files: [path.join(dir, 'A.md')] });
  assert.equal(cites.length, 1);
  assert.equal(cites[0].firstLine, 'ambiguous (2 candidates)', JSON.stringify(cites));
});

// RECORDED MUTATION (round 10, finding 6): removing the out-of-range guard in listCiteContents so the
// else branch always runs (scripts/plan/verify-quotes.mjs) makes
// a_cite_listing_reports_out_of_range_for_a_line_past_the_files_end FAIL: "AssertionError
// [ERR_ASSERTION]: Expected values to be strictly equal: + actual - expected + '' - 'out of range (file
// has 4 lines)'" (a cite past the file's end silently prints an empty string).
test('a_cite_listing_reports_out_of_range_for_a_line_past_the_files_end', () => {
  const dir = gitTree({
    'A.md': 'See `other/data.rs:99` for the rule.\n',
    'other/data.rs': 'one\ntwo\nthree\n',
  });
  const cites = listCiteContents({ repoRoot: dir, files: [path.join(dir, 'A.md')] });
  assert.equal(cites.length, 1);
  assert.equal(cites[0].firstLine, 'out of range (file has 4 lines)', JSON.stringify(cites));
});

// RECORDED MUTATION (round 10, finding 6): reverting the blank-line branch to
// `firstLine = raw.slice(0, 100)` unconditionally (scripts/plan/verify-quotes.mjs) makes
// a_cite_listing_reports_a_genuinely_blank_target_line_as_such FAIL: "AssertionError [ERR_ASSERTION]:
// Expected values to be strictly equal: + actual - expected + '' - '(blank line)'" (a real, in-range
// blank target line prints an empty string indistinguishable from a classification miss).
test('a_cite_listing_reports_a_genuinely_blank_target_line_as_such', () => {
  const dir = gitTree({
    'A.md': 'See `other/data.rs:2` for the rule.\n',
    'other/data.rs': 'one\n\nthree\n',
  });
  const cites = listCiteContents({ repoRoot: dir, files: [path.join(dir, 'A.md')] });
  assert.equal(cites.length, 1);
  assert.equal(cites[0].firstLine, '(blank line)', JSON.stringify(cites));
});

// --- round-10 normalization extensions (first pass) ------------------------------------------------

// RECORDED MUTATION: removing the `//` alternative from LEADING_MARKER_RE (scripts/plan/verify-quotes.mjs)
// makes normalizeText_strips_comment_continuation_prefixes FAIL: "AssertionError [ERR_ASSERTION]:
// Expected values to be strictly equal: + actual - expected + 'doc one doc two bang line // plain
// line block start continued' - 'doc one doc two bang line plain line block start continued'" (the
// `//` line survives with its marker intact while `///`/`//!`/`/**`/`*/`/`*` still strip correctly).
test('normalizeText_strips_comment_continuation_prefixes', () => {
  const raw = '/// doc one\n/// doc two\n//! bang line\n// plain line\n/** block start\n * continued\n */';
  assert.equal(normalizeText(raw), 'doc one doc two bang line plain line block start continued');
});

// RECORDED MUTATION: changing stripEmphasisPairs to unconditionally `.replace(/\*/g, '')` and
// `.replace(/_/g, '')` (scripts/plan/verify-quotes.mjs) makes
// normalizeText_strips_emphasis_and_backticks_but_keeps_snake_case FAIL: "AssertionError
// [ERR_ASSERTION]: Expected values to be strictly equal: + actual - expected + 'bold italic em code
// tilekey stays' - 'bold italic em code tile_key stays'" (the identifier's internal underscore is
// destroyed along with the real emphasis markers).
test('normalizeText_strips_emphasis_and_backticks_but_keeps_snake_case', () => {
  assert.equal(normalizeText('**bold** *italic* _em_ `code` tile_key stays'), 'bold italic em code tile_key stays');
});

// RECORDED MUTATION: dropping the `#{1,6}[ \t]+` alternative from LEADING_MARKER_RE
// (scripts/plan/verify-quotes.mjs) makes normalizeText_strips_leading_list_and_heading_markers FAIL:
// "AssertionError [ERR_ASSERTION]: Expected values to be strictly equal: + actual - expected +
// '### Heading item one item two' - 'Heading item one item two'" (the `###` survives).
test('normalizeText_strips_leading_list_and_heading_markers', () => {
  assert.equal(normalizeText('### Heading\n- item one\n+ item two'), 'Heading item one item two');
});

// RECORDED MUTATION: making mergedBlockquoteRuns return `atomic` unmerged (scripts/plan/verify-quotes.mjs)
// makes a_merged_blockquote_section_verifies_as_one_passage FAIL: "AssertionError [ERR_ASSERTION]:
// Expected values to be strictly equal: 0 !== 1" on `checked` (each 6-word paragraph alone misses the
// 8-word minimum; only the merged, 12-word passage clears it).
test('a_merged_blockquote_section_verifies_as_one_passage', () => {
  const dir = gitTree({
    'A.md': 'It reads:\n\n> a lion roams the savanna freely\n\n> and returns home every evening calmly\n',
    'B.md': 'Elsewhere: a lion roams the savanna freely and returns home every evening calmly.\n',
  });
  const { findings, checked } = runVerifyQuotes({ repoRoot: dir, files: [path.join(dir, 'A.md')] });
  assert.equal(checked, 1);
  assert.equal(findings.length, 0, JSON.stringify(findings));
});

// RECORDED MUTATION: same mutation as above (mergedBlockquoteRuns returning `atomic` unmerged) makes
// a_trigger_word_inside_the_first_merged_paragraph_does_not_introduce_the_whole_section FAIL:
// "AssertionError [ERR_ASSERTION]: Expected values to be strictly equal: 1 !== 0" on `checked` (the
// second, now-standalone paragraph's own 200-char window reaches back into the first paragraph's
// unrelated "verbatim" and is wrongly treated as introduced -- the ADR-017/ADR-020 false-trigger-bleed
// case the round-10 ruling names).
test('a_trigger_word_inside_the_first_merged_paragraph_does_not_introduce_the_whole_section', () => {
  const dir = gitTree({
    'A.md':
      'No trigger precedes this section at all.\n\n' +
      '> the desert stretches wide and reads verbatim like nothing else at all\n\n' +
      '> the mountains rise up tall and proud against the pale morning sky\n',
  });
  const { checked } = runVerifyQuotes({ repoRoot: dir, files: [path.join(dir, 'A.md')] });
  assert.equal(checked, 0);
});

// RECORDED MUTATION: inverting the prefix check to `wordsNorm.startsWith(p.normalized)`
// (scripts/plan/verify-quotes.mjs's matchBaseline) makes
// a_baselined_offender_is_advisory_and_a_new_mismatch_still_fails FAIL: "AssertionError
// [ERR_ASSERTION]: Expected values to be strictly equal: 0 !== 1" on `baselined.length` (a shorter
// recorded prefix can never contain a longer real passage, so the known offender is never matched and
// becomes a binding finding instead of a baselined one).
test('a_baselined_offender_is_advisory_and_a_new_mismatch_still_fails', () => {
  // The baseline's own "words" excerpt is a strict PREFIX of the passage (12 of its 13 words), so the
  // baseline JSON file (itself excluded from the haystack, round-10 finding 2) never supplies a literal
  // match for the full passage -- the fixture means to exercise the baseline lookup itself, not the
  // tree-wide search.
  const dir = gitTree({
    'A.md':
      'Verbatim: "a lonely wolf howls beneath the pale full moon under starlit skies tonight" end.\n' +
      'Verbatim: "a different wolf howls beneath the pale full moon under starlit skies tonight" end.\n',
    // Reviewer should-fix 4 (VERIFY-QUOTES-PREREGISTRATION.md Amendment 7): the shipped baseline file
    // is `{ $doc, entries }` (round 11's ratchet); this fixture uses that same shape, with the
    // disposition/ruling fields round 11 requires, so at least one matching test exercises the shape
    // the product actually has, not only the pre-round-11 bare array (still accepted, see loadBaseline).
    'scripts/plan/verify-quotes.baseline.json': JSON.stringify({
      $doc: 'entries leave when corrected; none is added except by a ruling; a new mismatch always fails.',
      entries: [
        {
          file: 'A.md',
          line: 1,
          words: 'a lonely wolf howls beneath the pale full moon under starlit skies',
          reason: 'known offender',
          disposition: 'unfindable-by-construction',
          ruling: 'round 11, 2026-09-17',
        },
      ],
    }),
  });
  const { findings, baselined, baselineErrors } = runVerifyQuotes({ repoRoot: dir, files: [path.join(dir, 'A.md')] });
  assert.equal(baselineErrors.length, 0, JSON.stringify(baselineErrors));
  assert.equal(baselined.length, 1, JSON.stringify(baselined));
  assert.equal(baselined[0].line, 1);
  assert.equal(findings.length, 1, JSON.stringify(findings));
  assert.equal(findings[0].line, 2);
});

// --- round-10 normalization extensions (gate-fix round: self-verifying misquotes, baseline hygiene,
// triggers/nested-counting, and the *`_ pairing/ordinal fixes) ----------------------------------------

// RECORDED MUTATION (finding 1): removing the blankPassages() call from both the self-quote-free text
// and readNorm's per-file caching in runVerifyQuotes, so every file's full raw text (quotations
// included) re-enters the haystack unblanked (scripts/plan/verify-quotes.mjs) makes
// a_misquote_quoted_inside_a_correction_does_not_verify_against_that_correction FAIL: "AssertionError
// [ERR_ASSERTION]: Expected values to be strictly equal: 0 !== 2" on `findings.length` (each of the two
// identically-worded quotations finds the OTHER's literal reproduction and wrongly "verifies" against
// it -- the cut/briefa-p3b ADMISSION-PREREGISTRATION.md:1425/:1446 self-verifying-misquote defect).
test('a_misquote_quoted_inside_a_correction_does_not_verify_against_that_correction', () => {
  const dir = gitTree({
    'A.md':
      'Amendment 6 says, verbatim: "the falcon reached the summit before the storm arrived this morning" and nothing more.\n' +
      'Amendment 7 corrects Amendment 6 by quoting: "the falcon reached the summit before the storm arrived this morning" -- that is wrong; the source says eagle, not falcon.\n',
  });
  const { findings, checked } = runVerifyQuotes({ repoRoot: dir, files: [path.join(dir, 'A.md')] });
  assert.equal(checked, 2);
  assert.equal(findings.length, 2, JSON.stringify(findings));
});

// RECORDED MUTATION (finding 2): removing the `abs !== baselineAbs` guard from the haystack-building
// loop in runVerifyQuotes, so scripts/plan/verify-quotes.baseline.json rejoins its own haystack
// (scripts/plan/verify-quotes.mjs) makes
// a_baselined_offender_whose_words_covers_the_whole_passage_is_reported_baselined_not_silently_verified
// FAIL: "AssertionError [ERR_ASSERTION]: Expected values to be strictly equal: 0 !== 1" on
// `baselined.length` (the passage "verifies" against the baseline file's own recorded copy of itself
// and vanishes -- reported neither as baselined nor as a finding -- the reviewer's B3 demonstration).
test('a_baselined_offender_whose_words_covers_the_whole_passage_is_reported_baselined_not_silently_verified', () => {
  const dir = gitTree({
    'A.md': 'Verbatim: "the crimson banner waved steadily above the ancient stone tower" end.\n',
    // The shipped baseline shape is `{ $doc, entries }` (round 11's ratchet) -- the pre-round-11 bare
    // array is dropped, not carried as a fallback (round-12 fix round item (e)); every fixture here uses
    // the real shape, with the fields loadBaseline's own validation now requires.
    'scripts/plan/verify-quotes.baseline.json': JSON.stringify({
      $doc: 'entries leave when corrected; none is added except by a ruling; a new mismatch always fails.',
      entries: [
        {
          file: 'A.md',
          line: 1,
          words: 'the crimson banner waved steadily above the ancient stone tower',
          reason: 'known offender, source untracked',
          disposition: 'unfindable-by-construction',
          ruling: 'round 11, 2026-09-17',
        },
      ],
    }),
  });
  const { findings, baselined, checked } = runVerifyQuotes({ repoRoot: dir, files: [path.join(dir, 'A.md')] });
  assert.equal(checked, 1);
  assert.equal(baselined.length, 1, JSON.stringify(baselined));
  assert.equal(findings.length, 0, JSON.stringify(findings));
});

// RECORDED MUTATION (finding 3): dropping the `e.line !== line` check from matchBaseline
// (scripts/plan/verify-quotes.mjs) makes
// a_baseline_entry_whose_line_has_shifted_does_not_waive_the_offender_and_is_reported_unmatched FAIL:
// "AssertionError [ERR_ASSERTION]: Expected values to be strictly equal: 0 !== 1" on `baselined.length`
// (an entry recorded at the wrong line now waives the real offender at its shifted line instead of
// being reported unmatched).
test('a_baseline_entry_whose_line_has_shifted_does_not_waive_the_offender_and_is_reported_unmatched', () => {
  const dir = gitTree({
    'A.md': '\nVerbatim: "the weary traveler crossed the frozen river before dawn broke" end.\n',
    'scripts/plan/verify-quotes.baseline.json': JSON.stringify({
      $doc: 'entries leave when corrected; none is added except by a ruling; a new mismatch always fails.',
      entries: [
        {
          file: 'A.md',
          line: 1,
          words: 'the weary traveler crossed the frozen river before dawn broke',
          reason: 'recorded before the file gained a leading blank line',
          disposition: 'unfindable-by-construction',
          ruling: 'round 11, 2026-09-17',
        },
      ],
    }),
  });
  const { findings, baselined, unmatchedBaseline } = runVerifyQuotes({ repoRoot: dir, files: [path.join(dir, 'A.md')] });
  assert.equal(baselined.length, 0, JSON.stringify(baselined));
  assert.equal(findings.length, 1, JSON.stringify(findings));
  assert.equal(findings[0].line, 2);
  assert.equal(unmatchedBaseline.length, 1, JSON.stringify(unmatchedBaseline));
  assert.equal(unmatchedBaseline[0].line, 1);
});

// RECORDED MUTATION (finding 3): dropping the `.startsWith(wordsNorm)` check from matchBaseline so it
// matches on (file, line) alone (scripts/plan/verify-quotes.mjs) makes
// a_baseline_entry_does_not_waive_a_different_bad_quote_recorded_at_the_same_line FAIL: "AssertionError
// [ERR_ASSERTION]: Expected values to be strictly equal: 0 !== 1" on `baselined.length` (a stale entry
// silently waives an unrelated new offender that happens to land on the same line).
test('a_baseline_entry_does_not_waive_a_different_bad_quote_recorded_at_the_same_line', () => {
  const dir = gitTree({
    'A.md': 'Verbatim: "the golden hawk circled twice above the quiet valley floor" end.\n',
    'scripts/plan/verify-quotes.baseline.json': JSON.stringify({
      $doc: 'entries leave when corrected; none is added except by a ruling; a new mismatch always fails.',
      entries: [
        {
          file: 'A.md',
          line: 1,
          words: 'a completely different sentence that was once the offender recorded',
          reason: 'a prior, now-corrected offender at this same line',
          disposition: 'unfindable-by-construction',
          ruling: 'round 11, 2026-09-17',
        },
      ],
    }),
  });
  const { findings, baselined, unmatchedBaseline } = runVerifyQuotes({ repoRoot: dir, files: [path.join(dir, 'A.md')] });
  assert.equal(baselined.length, 0, JSON.stringify(baselined));
  assert.equal(findings.length, 1, JSON.stringify(findings));
  assert.equal(unmatchedBaseline.length, 1, JSON.stringify(unmatchedBaseline));
});

// RECORDED MUTATION (finding 7): reverting stripEmphasisPairs to unconditional `.replace(/\*/g, '')`
// (scripts/plan/verify-quotes.mjs) makes
// normalizeText_keeps_a_lone_asterisk_or_underscore_that_is_not_an_emphasis_pair FAIL: "AssertionError
// [ERR_ASSERTION]: Expected values to be strictly equal: + actual - expected + '23=6, Vec<_>, and
// scripts/plan/.test.mjs all stay' - '2*3=6, Vec<_>, and scripts/plan/*.test.mjs all stay'" (a lone,
// unpaired `*` that is real content -- multiplication, a glob -- is destroyed).
test('normalizeText_keeps_a_lone_asterisk_or_underscore_that_is_not_an_emphasis_pair', () => {
  assert.equal(
    normalizeText('2*3=6, Vec<_>, and scripts/plan/*.test.mjs all stay'),
    '2*3=6, Vec<_>, and scripts/plan/*.test.mjs all stay',
  );
});

// RECORDED MUTATION (finding 7): re-adding `\d+\.[ \t]+` to LEADING_MARKER_RE
// (scripts/plan/verify-quotes.mjs) makes normalizeText_does_not_strip_a_leading_numbered_list_marker
// FAIL: "AssertionError [ERR_ASSERTION]: Expected values to be strictly equal: + actual - expected +
// 'the exact same conclusion reached here today' - '3. the exact same conclusion reached here today'"
// (the ordinal, which is content, is folded away).
test('normalizeText_does_not_strip_a_leading_numbered_list_marker', () => {
  assert.equal(normalizeText('3. the exact same conclusion reached here today'), '3. the exact same conclusion reached here today');
});

// RECORDED MUTATION (finding 7): same LEADING_MARKER_RE regression as above
// (scripts/plan/verify-quotes.mjs) makes a_renumbered_list_item_does_not_verify_against_its_earlier_self
// FAIL: "AssertionError [ERR_ASSERTION]: Expected values to be strictly equal: 1 !== 0" on
// `findings.length` (with both ordinals folded away, the renumbered item's text collapses to the same
// string as the original and wrongly "verifies").
test('a_renumbered_list_item_does_not_verify_against_its_earlier_self', () => {
  const dir = gitTree({
    'A.md': 'Verbatim: "3. the committee reached the exact same conclusion after review" end.\n',
    'B.md': '5. the committee reached the exact same conclusion after review\n',
  });
  const { findings } = runVerifyQuotes({ repoRoot: dir, files: [path.join(dir, 'A.md')] });
  assert.equal(findings.length, 1, JSON.stringify(findings));
});

// RECORDED MUTATION (finding 7): adding `.replace(/…/g, '...')` to normalizeText's fold chain
// (scripts/plan/verify-quotes.mjs) makes
// normalizeText_does_not_fold_prime_ellipsis_or_unicode_hyphen_minus FAIL: "AssertionError
// [ERR_ASSERTION]: Expected values to be strictly equal: + actual - expected + '5′ tall ... a‐b − c' -
// '5′ tall … a‐b − c'" (an ellipsis that is content is silently rewritten).
test('normalizeText_does_not_fold_prime_ellipsis_or_unicode_hyphen_minus', () => {
  assert.equal(normalizeText('5′ tall … a‐b − c'), '5′ tall … a‐b − c');
});

// RECORDED MUTATION (finding 10): removing the `\b` boundary construction from TRIGGER_RES (using the
// bare trigger word as the regex source instead) (scripts/plan/verify-quotes.mjs) makes
// trigger_words_are_anchored_at_word_boundaries_and_do_not_match_inside_a_longer_word FAIL:
// "AssertionError [ERR_ASSERTION]: Expected values to be strictly equal: 1 !== 0" (misquoting's
// "quoting" substring, and threads,'s "reads," substring, wrongly count as triggers).
test('trigger_words_are_anchored_at_word_boundaries_and_do_not_match_inside_a_longer_word', () => {
  const misquotingText = 'This is misquoting nothing: "some passage with plenty of distinct words right here" end.';
  const threadsText = 'Many threads, "some other passage with plenty of distinct words right here" end.';
  assert.equal(extractQuotePassages(misquotingText).length, 0, 'misquoting must not trigger on "quoting"');
  assert.equal(extractQuotePassages(threadsText).length, 0, 'threads, must not trigger on "reads,"');
});

// RECORDED MUTATION (finding 10): removing the `hasTriggerAfter` check from backtick-passage extraction
// (checking only `hasTrigger` before) (scripts/plan/verify-quotes.mjs) makes
// a_backtick_quote_introduced_by_a_trailing_quoted_verbatim_phrase_is_recognized FAIL: "AssertionError
// [ERR_ASSERTION]: Expected values to be strictly equal: 0 !== 1" (this tree's own trailing-trigger
// style -- `` `...`, quoted verbatim `` -- is never recognized as a quote at all, the exact shape
// VERIFY-QUOTES-PREREGISTRATION.md:54 itself uses).
test('a_backtick_quote_introduced_by_a_trailing_quoted_verbatim_phrase_is_recognized', () => {
  const text = 'The record (`the mission concluded successfully with no incidents reported at all`, quoted verbatim as received).';
  const passages = extractQuotePassages(text);
  assert.equal(passages.length, 1, JSON.stringify(passages));
  assert.equal(passages[0].kind, 'backtick');
});

// RECORDED MUTATION (finding 10): making dedupeNested a no-op (returning `list` unfiltered)
// (scripts/plan/verify-quotes.mjs) makes
// a_straight_quote_that_is_also_a_whole_blockquote_line_counts_once FAIL: "AssertionError
// [ERR_ASSERTION]: Expected values to be strictly equal: 2 !== 1" on `passages.length` (the same line's
// content is checked twice, once as a straight quote and once as a one-line blockquote run).
test('a_straight_quote_that_is_also_a_whole_blockquote_line_counts_once', () => {
  const text = 'It reads verbatim:\n\n> "the harbor lights flickered steadily through the misty night air"\n';
  const passages = extractQuotePassages(text);
  assert.equal(passages.length, 1, JSON.stringify(passages));
});

// --- round 11's ratchet (DECISIONS-PENDING.md, "RULED 2026-09-17, round 11"; see
// VERIFY-QUOTES-PREREGISTRATION.md Amendment 6): every baseline entry needs a valid `disposition` and
// a `ruling`, or the check fails by name ------------------------------------------------------------

// RECORDED MUTATION (round 11's ratchet, condition (a)): removing the
// `VALID_DISPOSITIONS.has(e.disposition)` check from validateBaselineEntries
// (scripts/plan/verify-quotes.mjs) makes
// a_baseline_entry_without_a_valid_disposition_fails_the_check_by_name FAIL: "AssertionError
// [ERR_ASSERTION]: Expected values to be strictly equal: 0 !== 1" on `baselineErrors.length` (an entry
// with no `disposition` field, or an invalid one, is silently accepted instead of failing the check).
test('a_baseline_entry_without_a_valid_disposition_fails_the_check_by_name', () => {
  const dir = gitTree({
    'A.md': 'Verbatim: "a distant bell tolled twice across the quiet misty harbor tonight" end.\n',
    'scripts/plan/verify-quotes.baseline.json': JSON.stringify({
      $doc: 'entries leave when corrected; none is added except by a ruling; a new mismatch always fails.',
      entries: [
        {
          file: 'A.md',
          line: 1,
          words: 'a distant bell tolled twice across the quiet misty harbor',
          reason: 'known offender, source untracked',
          disposition: 'not-a-real-disposition',
          ruling: 'round 11, 2026-09-17',
        },
      ],
    }),
  });
  const { baselineErrors } = runVerifyQuotes({ repoRoot: dir, files: [path.join(dir, 'A.md')] });
  assert.equal(baselineErrors.length, 1, JSON.stringify(baselineErrors));
  assert.match(baselineErrors[0].reason, /disposition/);
});

// RECORDED MUTATION (round 11's ratchet, condition (b)): removing the `!e.ruling.trim()` check from
// validateBaselineEntries (scripts/plan/verify-quotes.mjs) makes
// a_baseline_entry_without_a_ruling_fails_the_check_by_name FAIL: "AssertionError [ERR_ASSERTION]:
// Expected values to be strictly equal: 0 !== 1" on `baselineErrors.length` (an entry with no `ruling`
// field is silently accepted, so a baseline addition with no authorising ruling would never be caught).
test('a_baseline_entry_without_a_ruling_fails_the_check_by_name', () => {
  const dir = gitTree({
    'A.md': 'Verbatim: "a lantern swung gently beside the old wooden dock at dusk" end.\n',
    'scripts/plan/verify-quotes.baseline.json': JSON.stringify({
      $doc: 'entries leave when corrected; none is added except by a ruling; a new mismatch always fails.',
      entries: [
        {
          file: 'A.md',
          line: 1,
          words: 'a lantern swung gently beside the old wooden dock',
          reason: 'known offender, source untracked',
          disposition: 'unfindable-by-construction',
        },
      ],
    }),
  });
  const { baselineErrors } = runVerifyQuotes({ repoRoot: dir, files: [path.join(dir, 'A.md')] });
  assert.equal(baselineErrors.length, 1, JSON.stringify(baselineErrors));
  assert.match(baselineErrors[0].reason, /ruling/);
});

// --- round 12's hash check ("quote by reference", docs/PREREGISTRATION-TEMPLATE.md §10; the human,
// 2026-09-17, round 12 item 1): `path:a-b` @ <rev> sha256:<hex> recomputed against `git show
// <rev>:<path>`, and a `byte-copied from` marker's reproduction checked byte-exact --------------------

// RECORDED MUTATION: changing checkHashRef's `if (actual !== ref.hash)` to `if (actual === ref.hash)`
// (scripts/plan/verify-quotes.mjs) makes
// a_hash_checked_reference_with_an_explicit_rev_and_correct_hash_verifies FAIL: "AssertionError
// [ERR_ASSERTION]: Expected values to be strictly equal: 1 !== 0" on `hashFindings.length` (a genuinely
// correct hash is now reported as a mismatch).
test('a_hash_checked_reference_with_an_explicit_rev_and_correct_hash_verifies', () => {
  const dir = gitTree({
    'T.md': 'Line one of the target file.\nLine two of the target file.\nLine three of the target file.\n',
  });
  const rev = headOf(dir);
  const hash = sha256('Line one of the target file.\nLine two of the target file.\n');
  fs.writeFileSync(path.join(dir, 'A.md'), `A trusted figure: \`T.md:1-2\` @ ${rev} sha256:${hash}\n`);
  const { hashFindings } = runVerifyQuotes({ repoRoot: dir, files: [path.join(dir, 'A.md')] });
  assert.equal(hashFindings.length, 0, JSON.stringify(hashFindings));
});

// RECORDED MUTATION: removing the `if (actual !== ref.hash)` block entirely (returning `{ ok: true, ... }`
// unconditionally) (scripts/plan/verify-quotes.mjs) makes
// a_hash_checked_reference_with_a_wrong_hash_fails_by_name FAIL: "AssertionError [ERR_ASSERTION]:
// Expected values to be strictly equal: 0 !== 1" on `hashFindings.length` (a wrong claimed hash is no
// longer caught).
test('a_hash_checked_reference_with_a_wrong_hash_fails_by_name', () => {
  const dir = gitTree({
    'T.md': 'Line one of the target file.\nLine two of the target file.\nLine three of the target file.\n',
  });
  const wrongHash = sha256('this is not the cited content at all, on purpose, for this test');
  fs.writeFileSync(path.join(dir, 'A.md'), `A trusted figure: \`T.md:1-2\` sha256:${wrongHash}\n`);
  const { hashFindings } = runVerifyQuotes({ repoRoot: dir, files: [path.join(dir, 'A.md')] });
  assert.equal(hashFindings.length, 1, JSON.stringify(hashFindings));
  assert.match(hashFindings[0].reason, /sha256 mismatch/);
});

// RECORDED MUTATION: changing gitShowFile's `catch { return null; }` to `catch { return ''; }`
// (scripts/plan/verify-quotes.mjs) makes a_hash_checked_reference_to_an_unresolvable_rev_fails_by_name
// FAIL on the reason assertion: "AssertionError [ERR_ASSERTION]: The input did not match the regular
// expression /unresolvable rev/" -- the reported reason becomes "sha256 mismatch ... actual
// e3b0c442...852b855" (sha256 of the empty string an unresolvable `git show` now silently returns)
// instead of naming the rev itself as unresolvable, so an unavailable rev would be reported under the
// wrong name instead of failing by its own name (observed, not the range-based guess first written here).
test('a_hash_checked_reference_to_an_unresolvable_rev_fails_by_name', () => {
  const dir = gitTree({
    'T.md': 'Line one of the target file.\nLine two of the target file.\n',
  });
  const hash = sha256('Line one of the target file.\n');
  fs.writeFileSync(path.join(dir, 'A.md'), `A trusted figure: \`T.md:1\` @ 0123456789ab sha256:${hash}\n`);
  const { hashFindings } = runVerifyQuotes({ repoRoot: dir, files: [path.join(dir, 'A.md')] });
  assert.equal(hashFindings.length, 1, JSON.stringify(hashFindings));
  assert.match(hashFindings[0].reason, /unresolvable rev/);
});

// RECORDED MUTATION: changing linesWithLF's out-of-range guard from `b > totalLines` to
// `b > totalLines + 100` (scripts/plan/verify-quotes.mjs) makes
// a_hash_checked_reference_to_an_out_of_range_line_span_fails_by_name FAIL on the reason assertion: the
// slice silently clamps to the file's actual end instead of being rejected, so the reported reason
// becomes a "sha256 mismatch" (the wrong lines were hashed) rather than naming the range as out of range.
test('a_hash_checked_reference_to_an_out_of_range_line_span_fails_by_name', () => {
  const dir = gitTree({
    'T.md': 'Only one line here.\n',
  });
  const hash = sha256('irrelevant, the range itself is the defect');
  fs.writeFileSync(path.join(dir, 'A.md'), `A trusted figure: \`T.md:5-6\` sha256:${hash}\n`);
  const { hashFindings } = runVerifyQuotes({ repoRoot: dir, files: [path.join(dir, 'A.md')] });
  assert.equal(hashFindings.length, 1, JSON.stringify(hashFindings));
  assert.match(hashFindings[0].reason, /out of range/);
});

// RECORDED MUTATION: replacing reproducedTextAfter's `codeSpan` match-and-return with an unconditional
// `return null;` (scripts/plan/verify-quotes.mjs) makes
// a_byte_copied_marker_whose_reproduction_matches_verifies FAIL: "AssertionError [ERR_ASSERTION]:
// Expected values to be strictly equal: 1 !== 0" on `hashFindings.length`, reason `"\"byte-copied from\"
// marker has no reproduced blockquote or code span following it"` (a genuine, byte-exact reproduction is
// no longer found, so the marker fails for lack of one).
test('a_byte_copied_marker_whose_reproduction_matches_verifies', () => {
  const dir = gitTree({
    'T.md': 'PrecisionWord appears here.\nA second line follows.\n',
  });
  const hash = sha256('PrecisionWord appears here.\n');
  fs.writeFileSync(
    path.join(dir, 'A.md'),
    `Evidence, byte-copied from \`T.md:1\` sha256:${hash}\n\`PrecisionWord appears here.\`\n`,
  );
  const { hashFindings } = runVerifyQuotes({ repoRoot: dir, files: [path.join(dir, 'A.md')] });
  assert.equal(hashFindings.length, 0, JSON.stringify(hashFindings));
});

// RECORDED MUTATION: removing the `if (!slice.includes(repro))` block entirely (falling through to
// `return { ok: true, ... }` unconditionally once a reproduction is found)
// (scripts/plan/verify-quotes.mjs) makes
// a_byte_copied_marker_whose_reproduction_does_not_match_fails_by_name FAIL: "AssertionError
// [ERR_ASSERTION]: Expected values to be strictly equal: 0 !== 1" on `hashFindings.length` (a reproduction
// that does not match the cited bytes is no longer caught -- exactly the defect this marker exists to
// close, since the sha256 above it only proves the CITED lines are correct, not that what a reader sees
// below the marker is what those lines actually say).
test('a_byte_copied_marker_whose_reproduction_does_not_match_fails_by_name', () => {
  const dir = gitTree({
    'T.md': 'PrecisionWord appears here.\nA second line follows.\n',
  });
  const hash = sha256('PrecisionWord appears here.\n');
  fs.writeFileSync(
    path.join(dir, 'A.md'),
    // The hash is correct for T.md:1, but the reproduced code span silently drifts from it.
    `Evidence, byte-copied from \`T.md:1\` sha256:${hash}\n\`PrecisionWord appears THERE.\`\n`,
  );
  const { hashFindings } = runVerifyQuotes({ repoRoot: dir, files: [path.join(dir, 'A.md')] });
  assert.equal(hashFindings.length, 1, JSON.stringify(hashFindings));
  assert.match(hashFindings[0].reason, /not a byte-exact substring/);
});

// RECORDED MUTATION: in listCiteContents, changing `hashByKey.get(...) ?? null` to always `null`
// (scripts/plan/verify-quotes.mjs) makes a_hash_status_mark_appears_in_the_cite_listing FAIL:
// "AssertionError [ERR_ASSERTION]" on the `c.hashMark === 'hash: PASS'` assertion (the hash-checked
// reference's own status is silently dropped from --show-cites' output, leaving a reader no way to see
// it without re-running the gate separately). The mark is its own field, OUTSIDE the quoted `firstLine`
// (round-12 fix round item (e)) -- main() appends it after the closing quote, not asserted here.
test('a_hash_status_mark_appears_in_the_cite_listing', () => {
  const dir = gitTree({
    'T.md': 'Line one of the target file.\n',
  });
  const hash = sha256('Line one of the target file.\n');
  fs.writeFileSync(path.join(dir, 'A.md'), `A trusted figure: \`T.md:1\` sha256:${hash}\n`);
  const cites = listCiteContents({ repoRoot: dir, files: [path.join(dir, 'A.md')] });
  const c = cites.find((x) => x.target === 'T.md:1');
  assert.ok(c, JSON.stringify(cites));
  assert.equal(c.hashMark, 'hash: PASS');
  assert.equal(c.firstLine, 'Line one of the target file.');
});

// --- round-12 fix round: the grammar accepts every shape the real record corpus carries today
// (architect B1, reviewer B3) -- three end-to-end tests, each fixture line byte-copied BY SCRIPT (at
// test-run time, via `git show`, never pasted) from the real branch and line the dispatch names, run
// against THIS repository's own REPO_ROOT (not a throwaway gitTree()) so the named revs -- a955bee,
// 0db7e57, 60ece22, a3f5f2e, all fetched onto this local object store -- are the real commits. -------

function byteCopiedLine(rev, relPath, lineNum) {
  const content = execFileSync('git', ['show', `${rev}:${relPath}`], { cwd: REPO_ROOT, encoding: 'utf8' });
  return content.split('\n')[lineNum - 1];
}

function byteCopiedLines(rev, relPath, startLine, endLine) {
  const content = execFileSync('git', ['show', `${rev}:${relPath}`], { cwd: REPO_ROOT, encoding: 'utf8' });
  return content.split('\n').slice(startLine - 1, endLine).join('\n');
}

function fixtureFile(content) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'verify-quotes-realref-'));
  const p = path.join(dir, 'FIXTURE.md');
  fs.writeFileSync(p, content.endsWith('\n') ? content : content + '\n');
  return p;
}

// RECORDED MUTATION: reverting HASH_REF_RE's rev group back to `[0-9a-f]{12,40}` (its pre-round-12-fix
// shape) (scripts/plan/verify-quotes.mjs) makes
// a_shell_owner_invalidation_hash_reference_byte_copied_from_the_real_record_verifies FAIL:
// "AssertionError [ERR_ASSERTION]: Expected values to be strictly equal: 2 !== 0" on
// `hashFindings.length` -- both references use a 7-character rev (a955bee, 0db7e57); with only 12-40
// hex accepted, `:(\d+)` still matches but the `@ rev` clause cannot, so `\s*sha256:` never finds itself
// immediately after the digits (the literal "@ a955bee" sits in between) and the whole match fails at
// that position -- both become unbound-hash-token findings instead of hash-checked ones, `hashFindings`
// still non-empty either way, this test catches the regression by name regardless of which shape it
// takes.
test('a_shell_owner_invalidation_hash_reference_byte_copied_from_the_real_record_verifies', () => {
  // Shape: `path:line @ <7-char rev> sha256:<hex>` all INSIDE one backtick span (twice on this real
  // line -- the second a BARE `:900`, bound to the first reference's own path in the same sentence).
  const line = byteCopiedLine('origin/cut/briefa-p3b', 'frontends/shell/OWNER-INVALIDATION-PREREGISTRATION.md', 1072);
  const { hashFindings } = runVerifyQuotes({ repoRoot: REPO_ROOT, files: [fixtureFile(line)] });
  assert.equal(hashFindings.length, 0, JSON.stringify(hashFindings));
});

// RECORDED MUTATION: reverting HASH_REF_RE's rev group back to `[0-9a-f]{12,40}` (its pre-round-12-fix
// shape) (scripts/plan/verify-quotes.mjs) makes
// an_engine_admission_hash_reference_byte_copied_from_the_real_record_verifies FAIL: "AssertionError
// [ERR_ASSERTION]: Expected values to be strictly equal: 1 !== 0" on `hashFindings.length` (rev
// `60ece22` is 7 characters; the whole match fails and the token becomes an unbound-hash-token finding
// instead of a hash-checked one). The path-resolution fallback (checkHashRef's `named.length === 0`
// branch, `git show <rev>:<path>` when the current tree's index misses) is NOT what this test exercises
// -- `engine/ADMISSION-PREREGISTRATION.md` is tracked on this branch; the LOD test below is the one that
// depends on, and is mutated against, that fallback.
test('an_engine_admission_hash_reference_byte_copied_from_the_real_record_verifies', () => {
  // Shape: `path:line @ <7-char rev> sha256:<hex>` all INSIDE one backtick span, with a path.
  const line = byteCopiedLine('origin/cut/briefa-p3b', 'engine/ADMISSION-PREREGISTRATION.md', 1540);
  const { hashFindings } = runVerifyQuotes({ repoRoot: REPO_ROOT, files: [fixtureFile(line)] });
  assert.equal(hashFindings.length, 0, JSON.stringify(hashFindings));
});

// RECORDED MUTATION: reverting checkHashRef's path-resolution fallback to unconditionally return the
// "unresolvable path" finding on a `named.length === 0` current-index miss (scripts/plan/verify-quotes.mjs)
// makes a_lod_tier_builder_hash_references_byte_copied_from_the_real_record_verify FAIL: "AssertionError
// [ERR_ASSERTION]: Expected values to be strictly equal: 5 !== 0" on `hashFindings.length` --
// `engine/tests/common/mod.rs` is tracked on `engine/lod-tier-builder` (where this line lives) but not
// on THIS branch's own tree, so every one of this fixture's five references depends on the fallback
// actually asking `git show a3f5f2e:engine/tests/common/mod.rs` directly rather than requiring the path
// to already be in the current tree's own index.
test('a_lod_tier_builder_hash_references_byte_copied_from_the_real_record_verify', () => {
  // Shape: `path:line` (plain citation) then, in the same paragraph, bare `:line` @ <7-char rev>
  // sha256:<hex> references OUTSIDE the backticks, bound to that path -- plus two more explicit-path
  // OUTSIDE-shape references on the following lines. `engine/tests/common/mod.rs` is tracked on
  // `engine/lod-tier-builder`, not on this branch -- checkHashRef's rev-aware path fallback (this
  // round's own addition, justified in its own doc comment) is what makes this resolve at all.
  const lines = byteCopiedLines('origin/engine/lod-tier-builder', 'engine/LOD-PREREGISTRATION.md', 531, 534);
  const { hashFindings } = runVerifyQuotes({ repoRoot: REPO_ROOT, files: [fixtureFile(lines)] });
  assert.equal(hashFindings.length, 0, JSON.stringify(hashFindings));
});

// RECORDED MUTATION: changing checkHashRef's `if (actual !== ref.hash)` to `if (actual === ref.hash)`
// (scripts/plan/verify-quotes.mjs) makes a_seven_character_rev_with_a_wrong_hash_fails_by_name FAIL:
// "AssertionError [ERR_ASSERTION]: Expected values to be strictly equal: 0 !== 1" on
// `hashFindings.length` (a genuinely wrong hash against a real, resolvable 7-character rev is reported
// as verified).
test('a_seven_character_rev_with_a_wrong_hash_fails_by_name', () => {
  const dir = gitTree({
    'T.md': 'Line one of the target file.\nLine two of the target file.\n',
  });
  const rev7 = headOf(dir).slice(0, 7);
  const wrongHash = sha256('not the real content of T.md:1, deliberately wrong for this test');
  fs.writeFileSync(path.join(dir, 'A.md'), `A trusted figure: \`T.md:1\` @ ${rev7} sha256:${wrongHash}\n`);
  const { hashFindings } = runVerifyQuotes({ repoRoot: dir, files: [path.join(dir, 'A.md')] });
  assert.equal(hashFindings.length, 1, JSON.stringify(hashFindings));
  assert.match(hashFindings[0].reason, /sha256 mismatch/);
});

// RECORDED MUTATION: adding an unconditional `continue;` as findUnboundHashTokens' first loop
// statement (scripts/plan/verify-quotes.mjs) makes
// an_unbound_hash_token_near_an_attempted_reference_fails_by_name FAIL: "AssertionError
// [ERR_ASSERTION]: Expected values to be strictly equal: 0 !== 1" on `hashFindings.length` (the
// malformed, unbound reference attempt is silently dropped instead of reported by name).
test('an_unbound_hash_token_near_an_attempted_reference_fails_by_name', () => {
  const dir = gitTree({
    'T.md': 'Line one of the target file.\n',
  });
  const hash = sha256('Line one of the target file.\n');
  // `T.md:1` is cited, but prose (not whitespace/backtick) sits between it and the hash token, so the
  // grammar cannot bind them into one reference -- an attempted, malformed reference, not an unrelated
  // checksum (the kernel/*-PREREGISTRATION.md fixture-hash tables this guard is disclosed to exclude).
  fs.writeFileSync(path.join(dir, 'A.md'), `See \`T.md:1\` and note its hash is sha256:${hash}\n`);
  const { hashFindings } = runVerifyQuotes({ repoRoot: dir, files: [path.join(dir, 'A.md')] });
  assert.equal(hashFindings.length, 1, JSON.stringify(hashFindings));
  assert.match(hashFindings[0].reason, /unbound hash reference/);
});

// RECORDED MUTATION: removing the `COLON_DIGIT_NEARBY_RE.test(...)` guard from findUnboundHashTokens,
// making it flag every un-bound `sha256:<hex>` token unconditionally (scripts/plan/verify-quotes.mjs)
// makes an_unrelated_data_hash_with_no_nearby_line_reference_is_not_flagged_unbound FAIL: "AssertionError
// [ERR_ASSERTION]: Expected values to be strictly equal: 1 !== 0" on `hashFindings.length` (a fixture's
// own file-integrity checksum, recorded under a convention this mechanism does not own, is wrongly
// reported as a malformed governance reference).
test('an_unrelated_data_hash_with_no_nearby_line_reference_is_not_flagged_unbound', () => {
  const dir = gitTree({
    'A.md': `| fixture | bytes | recorded SHA-256 |\n| --- | --- | --- |\n| 5 GB | \`data/parcels.parquet\` | 5004376705 | \`sha256:${sha256('unrelated fixture content')}\` |\n`,
  });
  const { hashFindings } = runVerifyQuotes({ repoRoot: dir, files: [path.join(dir, 'A.md')] });
  assert.equal(hashFindings.length, 0, JSON.stringify(hashFindings));
});
