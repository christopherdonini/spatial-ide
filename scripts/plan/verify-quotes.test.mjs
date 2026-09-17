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
import { execFileSync } from 'node:child_process';
import { normalizeText, extractQuotePassages, runVerifyQuotes, listCiteContents } from './verify-quotes.mjs';

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
    'scripts/plan/verify-quotes.baseline.json': JSON.stringify([
      {
        file: 'A.md',
        line: 1,
        words: 'a lonely wolf howls beneath the pale full moon under starlit skies',
        reason: 'known offender',
      },
    ]),
  });
  const { findings, baselined } = runVerifyQuotes({ repoRoot: dir, files: [path.join(dir, 'A.md')] });
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
    'scripts/plan/verify-quotes.baseline.json': JSON.stringify([
      {
        file: 'A.md',
        line: 1,
        words: 'the crimson banner waved steadily above the ancient stone tower',
        reason: 'known offender, source untracked',
      },
    ]),
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
    'scripts/plan/verify-quotes.baseline.json': JSON.stringify([
      {
        file: 'A.md',
        line: 1,
        words: 'the weary traveler crossed the frozen river before dawn broke',
        reason: 'recorded before the file gained a leading blank line',
      },
    ]),
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
    'scripts/plan/verify-quotes.baseline.json': JSON.stringify([
      {
        file: 'A.md',
        line: 1,
        words: 'a completely different sentence that was once the offender recorded',
        reason: 'a prior, now-corrected offender at this same line',
      },
    ]),
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
