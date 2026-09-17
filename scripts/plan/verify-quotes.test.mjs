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

// RECORDED MUTATION: changing BLOCKQUOTE_RE's `>` to `>>` (scripts/plan/verify-quotes.mjs) makes
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

// RECORDED MUTATION: gating the advisory push on `false && pathCite` (scripts/plan/verify-quotes.mjs)
// makes a_path_introduced_quote_found_only_elsewhere_is_advisory FAIL: "AssertionError
// [ERR_ASSERTION]: Expected values to be strictly equal: 0 !== 1" on `advisories.length` (the
// found-elsewhere case is silently swallowed instead of reported).
test('a_path_introduced_quote_found_only_elsewhere_is_advisory', () => {
  const dir = gitTree({
    'A.md': 'As `other/file.md:1` reads: "some other passage with eight distinct words present here" end.\n',
    'other/file.md': 'nothing to do with the quote\n',
    'elsewhere.md': 'Found here: some other passage with eight distinct words present here.\n',
  });
  const { findings, advisories } = runVerifyQuotes({ repoRoot: dir, files: [path.join(dir, 'A.md')] });
  assert.equal(findings.length, 0, JSON.stringify(findings));
  assert.equal(advisories.length, 1, JSON.stringify(advisories));
  assert.match(advisories[0].reason, /other\/file\.md/);
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

// --- round-10 normalization extensions ------------------------------------------------------------

// RECORDED MUTATION: removing the `//` alternative from LEADING_MARKER_RE (scripts/plan/verify-quotes.mjs)
// makes normalizeText_strips_comment_continuation_prefixes FAIL: "AssertionError [ERR_ASSERTION]:
// Expected values to be strictly equal: + actual - expected + 'doc one doc two bang line // plain
// line block start continued' - 'doc one doc two bang line plain line block start continued'" (the
// `//` line survives with its marker intact while `///`/`//!`/`/**`/`*/`/`*` still strip correctly).
test('normalizeText_strips_comment_continuation_prefixes', () => {
  const raw = '/// doc one\n/// doc two\n//! bang line\n// plain line\n/** block start\n * continued\n */';
  assert.equal(normalizeText(raw), 'doc one doc two bang line plain line block start continued');
});

// RECORDED MUTATION: changing `.replace(/\*/g, '')` to `.replace(/\*\*/g, '')` in normalizeText
// (scripts/plan/verify-quotes.mjs) makes normalizeText_strips_emphasis_and_backticks_but_keeps_snake_case
// FAIL: "AssertionError [ERR_ASSERTION]: Expected values to be strictly equal: + actual - expected +
// 'bold *italic* em code tile_key stays' - 'bold italic em code tile_key stays'" (a single `*` around
// `*italic*` survives where the pair-only regex no longer matches it).
test('normalizeText_strips_emphasis_and_backticks_but_keeps_snake_case', () => {
  assert.equal(normalizeText('**bold** *italic* _em_ `code` tile_key stays'), 'bold italic em code tile_key stays');
});

// RECORDED MUTATION: dropping the `#{1,6}[ \t]+` alternative from LEADING_MARKER_RE
// (scripts/plan/verify-quotes.mjs) makes normalizeText_strips_leading_list_and_heading_markers FAIL:
// "AssertionError [ERR_ASSERTION]: Expected values to be strictly equal: + actual - expected +
// '### Heading item one item two' - 'Heading item one item two'" (the `###` survives).
test('normalizeText_strips_leading_list_and_heading_markers', () => {
  assert.equal(normalizeText('### Heading\n- item one\n1. item two'), 'Heading item one item two');
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

// RECORDED MUTATION: changing the baseline lookup key from `${relPath}:${p.startLine}` to
// `${relPath}#${p.startLine}` in runVerifyQuotes (scripts/plan/verify-quotes.mjs) -- while
// loadBaseline's own map still keys on `:` -- makes
// a_baselined_offender_is_advisory_and_a_new_mismatch_still_fails FAIL: "AssertionError
// [ERR_ASSERTION]: Expected values to be strictly equal: 0 !== 1" on `baselined.length` (the lookup
// never matches, so the known offender becomes a binding finding instead of an advisory one).
test('a_baselined_offender_is_advisory_and_a_new_mismatch_still_fails', () => {
  // The baseline's own "words" excerpt is a strict PREFIX of the passage (12 of its 13 words), so the
  // baseline JSON file (itself a tracked .json haystack member) never supplies a literal match for the
  // full passage -- the fixture would otherwise "verify" via the wide search before ever reaching the
  // baseline lookup this test means to exercise.
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
