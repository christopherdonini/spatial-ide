#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// scripts/plan/verify-quotes.mjs -- closes the misquote failure class VERIFY-QUOTES-PREREGISTRATION.md
// §0 names: an amendment attributes a sentence to a source "verbatim" (or reads:/says:/states:/quoted
// from/quoting/the human:), but the source does not carry that sentence. `verify-cites.mjs` proves a
// `path:line` reference EXISTS; this proves a claimed-verbatim PASSAGE actually occurs in the tree.
//
// GATED CHECK: a quotation (>= 8 words -- straight "...", curly "...", a backtick `...` span, or one
// or more adjacent `> ` blockquote paragraphs merged into one passage, see mergedBlockquoteRuns)
// introduced by one of the eight trigger words above, anchored at word boundaries and case-folded, in
// the ~200 characters preceding its own first character (a backtick span may instead be introduced in
// the ~200 characters AFTER its own last character -- this tree's own style often reads `` `...`,
// quoted verbatim `` with the trigger trailing, not leading). A passage nested inside a larger one
// (a straight quote that is also the whole content of a `> ` blockquote line) counts once, as the
// larger passage. Normalized (see normalizeText) identically on both sides and required to occur, as a
// substring, somewhere in the tracked tree -- EXCEPT within the citing document's own OTHER extracted
// quote passages: every quote passage's line range is blanked out of its OWN file's haystack copy
// before the search, so a misquote reproduced (even to correct it) later IN THE SAME DOCUMENT can never
// "verify" against that reproduction (the cut/briefa-p3b ADMISSION-PREREGISTRATION.md:1425/:1446 case).
// This is deliberately SAME-FILE only, not tree-wide: DECISIONS-PENDING.md's own rulings are literally
// recorded as `**"...", quoted verbatim` blocks -- excluding every quotation tree-wide would blank out
// the one document most things in this tree legitimately quote FROM, breaking far more true positives
// than the self-verifying-misquote defect it would close (see VERIFY-QUOTES-PREREGISTRATION.md's
// Amendment 5 for the concrete count). A same-document self-verifying misquote is the named defect;
// a cross-document quotation of an authoritative primary source is not the same shape. DISCLOSED
// RESIDUAL (reviewer should-fix 1, Amendment 7): the same-file scope means a misquote reproduced in a
// DIFFERENT tracked file -- a gate log, state/CUT-STATE.md, a DECISIONS-PENDING.md entry recording the
// correction -- still verifies against that reproduction; this tree records corrections in a different
// file as a matter of routine, so the hole is live, not theoretical, and stays open by the same
// false-positive-cost argument as the SAME-FILE choice above.
//
// A passage introduced by a nearby `path:line` cite is GATED against that file alone when the cite
// resolves to exactly one candidate: found there is a PASS, missing there is a FAIL (baseline
// permitting) -- no fallback search of the rest of the tree (the human's round-10 ruling: a path-cited
// quote that isn't where it says it is is exactly the class of defect this check exists to catch, not
// something to soften into a note). A cite that resolves to zero or several candidates cannot be gated
// against "that file" with confidence and is reported advisory instead (unresolved/ambiguous cites are
// verify-cites.mjs's own gate, a different failure class). A passage with no nearby path cite is
// searched across the whole tracked-tree haystack.
//
// scripts/plan/verify-quotes.baseline.json itself is excluded from the haystack (its own recorded
// "words" text must never let a passage "verify" against the very file that records it as unverified)
// and is consulted only AFTER the search above has failed: a match on (file, line, and the entry's
// `words` as a normalized PREFIX of the passage) is a KNOWN failure -- recorded and classified by the
// custodian's worker, pending the human's sight at this PR -- printed as baselined on every run, never
// gated, so the check passes on the tree as found while any NEW mismatch (a different line, or
// different wording at the same line) still fails it. A baseline entry that matches nothing this run is
// reported too (a shifted line, or a corrected quote, leaves a stale entry -- surfaced, not silently
// carried). Missing or unparsable baseline.json is an empty baseline, never fatal.
//
// ROUND 11'S RATCHET (DECISIONS-PENDING.md, "RULED 2026-09-17, round 11"; see
// VERIFY-QUOTES-PREREGISTRATION.md Amendment 6): every baseline entry carries a `disposition`
// (`unfindable-by-construction` / `tool-false-trigger` / `owed-correction`, the owed ones naming the
// correcting piece in `corrected_by`) and a `ruling` naming what authorised it -- an entry missing
// either is a baseline error and FAILS the check by name (`validateBaselineEntries`), never silently
// accepted. Entries leave when corrected; none is added except by a ruling; a new mismatch always
// fails. HEADER GAP CLOSED (round 15, item 3; the architect's attempt-4 should-fix, state/gate-log.json
// record 66): the baseline file is `{ $doc, entries }` ONLY -- the pre-round-11 bare-array shape was
// dropped in the round-12 fix round (no product caller, `loadBaseline`'s own docstring), not "still
// accepted" as this banner previously, falsely, went on saying. A sibling top-level key, `hashEntries`,
// carries the SAME ratchet for a hash-finding baseline (see loadHashBaseline, below).
//
// ADVISORY LISTING (--show-cites, never fails, computed only when passed): every path:line cite's
// first cited line, trimmed, so a reader can eyeball whether the line says what the clause claims --
// this script does not judge it. An ambiguous or unresolved cite is printed as such, never as the
// first same-basename candidate's unrelated text; a cited line past its file's end is printed as such,
// never as an empty string. A cite that also carries a hash-checked reference (see below) gets a
// trailing `[hash: PASS]` / `[hash: FAIL — ...]` mark.
//
// HASH-CHECKED REFERENCES (round 12's "quote by reference" mechanism, docs/PREREGISTRATION-TEMPLATE.md
// §10; the human, 2026-09-17, round 12 item 1): `` `path:a-b` @ <rev> sha256:<hex> `` is GATED --
// recomputed over `git show <rev>:<path>` lines a..b (each line with its LF) and failed by name on a
// mismatch or an unresolvable rev, path or range; `@ <rev>` defaults to HEAD when absent. The reference
// itself may be split across two physical lines by a rustfmt-wrapped `//` comment continuation (see
// GAP); a reference broken across three or more lines is not recognized. A `byte-copied
// from ` prefix additionally requires a reproduction near it -- same line after the marker, the next
// non-blank line, or same line before the marker (see reproducedTextNear) -- to be a byte-exact
// substring of those lines (or, for the same-line-before shape, to CONTAIN those lines byte-exact; see
// reproducedTextNear's own comment), no presentation normalization applied. See
// extractHashRefs/checkHashRef. A hash finding may itself be a recorded, classified `hashEntries`
// baseline entry (round 15, item 3), advisory rather than gated -- the same {disposition, ruling,
// corrected_by} shape and append-never discipline the quote baseline above uses, for a hash reference
// sitting in text this piece's own authority does not own and cannot fix in place (see
// loadHashBaseline/matchHashBaseline).
//
// DISCLOSED GAPS: a straight/curly/backtick quote spans at most one physical source line (this tree's
// prose keeps a paragraph on one line; a hard-wrapped quote defeats the regex, the same limit
// citationIntegrity.test.mjs accepts); after flattening, a passage that is a substring of unrelated
// adjacent text can false-match (shared by every flatten-then-substring check in this tree); a quote
// attributed to an untracked source (a `.gitignore`d evidence log, a third-party crate's source not
// vendored into this repo) can never be found here by construction, not because it is wrong; the
// tree-wide search for a passage with no nearby path cite is a FLOOR (the text exists somewhere), not
// source attribution (it does not prove the citing document's own claimed source is that occurrence);
// this check does not recognize `…` as an elision marker and cannot read across one for a removed
// negation, condition or qualifier -- round 11 item 3's rider is a human-read rule, not yet a mechanical
// one, so an elided quote is either baselined by hand or a false FAIL, never verified by construction
// (the architect gate's N2, round-12 attempt); the `byte-copied from` reproduction check reads only the
// FIRST candidate it finds, in the fixed order same-line-after / next-line / same-line-before -- a
// reproduction split across more than one of those, or sitting more than one blank line down, is not
// found and fails by name for lack of a resolvable reproduction rather than being silently accepted.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { buildTrackedIndex, extractCitations, resolveRef, classifyPath, topDirsOf, CODE_EXTS } from './verify-cites.mjs';
import { claimFiles } from './verify-test-claims.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(here, '..', '..');

const TEXT_EXTS = new Set(['md', 'rs', 'ts', 'tsx', 'mjs', 'json', 'toml', 'yaml']);
const BASELINE_REL_PATH = 'scripts/plan/verify-quotes.baseline.json';
const INTRO_WINDOW = 200;
const MIN_WORDS = 8;

// Anchored at a word boundary on whichever end abuts a letter/digit, case-folded: `quoting` must not
// match inside `misquoting`; `reads,` must not match inside `threads,`.
const TRIGGERS = ['verbatim', 'reads:', 'reads,', 'says:', 'states:', 'quoted from', 'quoting', 'the human:'];
function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
const TRIGGER_RES = TRIGGERS.map((t) => {
  const startsWord = /^[A-Za-z0-9]/.test(t);
  const endsWord = /[A-Za-z0-9]$/.test(t);
  return new RegExp((startsWord ? '\\b' : '') + escapeRe(t) + (endsWord ? '\\b' : ''), 'i');
});

function hasTrigger(text, beforeIdx) {
  const windowText = text.slice(Math.max(0, beforeIdx - INTRO_WINDOW), beforeIdx);
  return TRIGGER_RES.some((re) => re.test(windowText));
}

function hasTriggerAfter(text, afterIdx) {
  const windowText = text.slice(afterIdx, afterIdx + INTRO_WINDOW);
  return TRIGGER_RES.some((re) => re.test(windowText));
}

function lineOf(text, idx) {
  let n = 1;
  for (let i = 0; i < idx; i++) if (text.charCodeAt(i) === 10) n++;
  return n;
}

function extOf(p) {
  const m = /\.([A-Za-z0-9]+)$/.exec(p);
  return m ? m[1].toLowerCase() : null;
}

// A line-start structural marker: `> ` blockquote, `///`/`//!`/`//` and `/**`/`*/`/`*` comment
// continuations, a heading `#`, or a `-`/`+` bullet -- none carries quoted CONTENT, so none belongs in
// a passage compared against a source that may wrap the same words differently. A NUMBERED list marker
// (`1.`, `2.`) is deliberately NOT here: the number is content (a renumbered item -- `3.` become `5.`
// -- must not verify against its own earlier self), and this substring architecture has no per-line
// pairing to strip a marker only when both sides carry one, so the safe simplification is to never
// fold it.
// The lone-`*` comment-continuation alternative is `(?!\*)`-guarded so it never eats one star of a
// line-leading `**bold**` pair (common in this tree's "**Amendment N —**" style) before
// stripEmphasisPairs gets to see the intact pair. Its trailing `[ \t]` is MANDATORY, not optional
// (round-12 fix round, reviewer B1): a genuine bullet (`* item`) and a doc-comment continuation
// (` * continued`) always carry a space/tab after the `*`; a hard-wrapped `*emphasis*` pair whose
// OPENING `*` lands at a line's own start (no space follows -- `*word` runs straight into content,
// e.g. `state/NEXT-CUT.md:121`'s wrapped `*detected*`) does not, and must survive this pass so
// stripEmphasisPairs (applied next, over the whole flattened text) sees the intact pair and unwraps
// it the same way a same-content single-line citation already does -- an optional `[ \t]?` here
// stripped the opening star regardless, leaving a false orphan `*detected*` mismatch.
const LEADING_MARKER_RE =
  /^[ \t]*(?:>[ \t]?|\/\/\/[ \t]?|\/\/![ \t]?|\/\/[ \t]?|\/\*\*?[ \t]?|\*\/[ \t]?|\*(?!\*)[ \t]|#{1,6}[ \t]+|[-+][ \t]+)/;

function stripLeadingMarkers(line) {
  let prev;
  do {
    prev = line;
    line = line.replace(LEADING_MARKER_RE, '');
  } while (line !== prev);
  return line;
}

// Emphasis PAIRS only -- `**bold**`, `*italic*`, `_italic_` at a word boundary -- never a lone `*`/`_`,
// so `2*3=6`, `Vec<_>` and `scripts/plan/*.test.mjs` survive unchanged (there is no closing partner to
// pair with, so the pair regex never matches them at all).
function stripEmphasisPairs(s) {
  let prev;
  do {
    prev = s;
    s = s
      .replace(/\*\*([^\s*][^*]*?)\*\*/g, '$1')
      .replace(/(?<![A-Za-z0-9*])\*([^\s*][^*]*?)\*(?![A-Za-z0-9*])/g, '$1')
      .replace(/(?<![A-Za-z0-9_])_([^\s_][^_]*?)_(?![A-Za-z0-9_])/g, '$1');
  } while (s !== prev);
  return s;
}

/**
 * Strip line-start structural markers, emphasis PAIRS and backticks, fold curly quotes/dashes to
 * straight, collapse whitespace. Deliberately leaves a numbered list marker, and `′`/`…`/`‐`/`−`
 * (prime, ellipsis, unicode hyphen/minus) unfolded -- each is content, not markup, in this tree's
 * prose. Applied identically to a claimed passage and to every candidate source, so markup a copy
 * legitimately drops (or a source legitimately wraps across comment-continuation lines) never defeats
 * an otherwise-true match, and never quietly erases a real difference.
 */
export function normalizeText(raw) {
  const stripped = raw.split('\n').map(stripLeadingMarkers).join('\n');
  const folded = stripEmphasisPairs(stripped)
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, '-')
    .replace(/`/g, '');
  return folded.replace(/\s+/g, ' ').trim();
}

function wordCount(s) {
  return s ? s.split(' ').filter(Boolean).length : 0;
}

const STRAIGHT_RE = /"([^"\n]+)"/g;
const CURLY_RE = /“([^”\n]+)”/g;
// Each delimiting backtick must be ISOLATED (not itself adjacent to another backtick): markdown's own
// `` `...` `` double-backtick escape (used to show a literal backtick inside inline code -- this very
// file uses it above) would otherwise mispair, chaining an open backtick from one escape sequence to a
// close backtick belonging to a LATER, unrelated inline-code span and sweeping up the ordinary prose
// between them as fabricated "content". Content is matched LAZILY so a genuine pair closes at its own
// nearest backtick, not a farther one.
const BACKTICK_RE = /(?<!`)`(?!`)([^`\n]+?)(?<!`)`(?!`)/g;
const ATOMIC_BLOCKQUOTE_RE = /(?:^[ \t]*>[ \t]?.*\n?)+/gm;

/**
 * Adjacent blockquote paragraph-runs separated only by blank lines merge into ONE passage, so a whole
 * quoted/styled section (an ADR body rendered as consecutive `> ` paragraphs) is one candidate --
 * introduced, if at all, only by whatever precedes its OWN first line, never by a trigger word that
 * merely sits inside a different, blank-line-separated paragraph of the same visual block (the human's
 * round-10 ruling: the ADR-017/ADR-020 false-trigger-bleed case).
 */
function mergedBlockquoteRuns(text) {
  const atomic = [];
  ATOMIC_BLOCKQUOTE_RE.lastIndex = 0;
  let m;
  while ((m = ATOMIC_BLOCKQUOTE_RE.exec(text))) atomic.push({ start: m.index, end: m.index + m[0].length });
  const merged = [];
  for (const run of atomic) {
    const last = merged[merged.length - 1];
    if (last && /^(?:[ \t]*\n)*$/.test(text.slice(last.end, run.start))) last.end = run.end;
    else merged.push({ start: run.start, end: run.end });
  }
  return merged;
}

// A passage whose line range sits inside a larger passage's range counts once -- e.g. a straight quote
// that is also the entire content of one `> ` blockquote line (`> *"...text..."*`): keep the larger, or
// on an exact tie the non-blockquote (its extraction is already the clean inner text, no wrapper left).
function isRedundant(a, b) {
  const bContainsA = b.startLine <= a.startLine && b.endLine >= a.endLine;
  if (!bContainsA) return false;
  const sameRange = a.startLine === b.startLine && a.endLine === b.endLine;
  if (sameRange) return a.kind === 'blockquote' && b.kind !== 'blockquote';
  return b.endLine - b.startLine > a.endLine - a.startLine;
}

function dedupeNested(list) {
  return list.filter((p, i) => !list.some((q, j) => j !== i && isRedundant(p, q)));
}

/** Every quoted passage (>= 8 words, verbatim-introduced) in `text`: [{normalized,startLine,endLine,introEnd,kind}]. */
export function extractQuotePassages(text) {
  const out = [];
  for (const [re, kind] of [[STRAIGHT_RE, 'straight'], [CURLY_RE, 'curly']]) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(text))) {
      if (!hasTrigger(text, m.index)) continue;
      const normalized = normalizeText(m[1]);
      if (wordCount(normalized) < MIN_WORDS) continue;
      const startLine = lineOf(text, m.index);
      out.push({ normalized, startLine, endLine: startLine, introEnd: m.index, kind });
    }
  }
  BACKTICK_RE.lastIndex = 0;
  let bm;
  while ((bm = BACKTICK_RE.exec(text))) {
    const introEnd = bm.index;
    if (!hasTrigger(text, introEnd) && !hasTriggerAfter(text, introEnd + bm[0].length)) continue;
    const normalized = normalizeText(bm[1]);
    if (wordCount(normalized) < MIN_WORDS) continue;
    const startLine = lineOf(text, introEnd);
    out.push({ normalized, startLine, endLine: startLine, introEnd, kind: 'backtick' });
  }
  for (const { start, end } of mergedBlockquoteRuns(text)) {
    const raw = text.slice(start, end);
    let normalized = normalizeText(raw);
    // A blockquote whose whole content is ALSO a redundant straight-quoted span (`> "text..."`) is
    // unwrapped once: the outer pair is not structural content, and unwrapping can expose a line-start
    // marker that sat just inside it (`> "# a TOML comment..."` -- stripLeadingMarkers never reaches the
    // `#` while the `"` still precedes it at the true line start).
    if (normalized.length > 1 && normalized[0] === '"' && normalized[normalized.length - 1] === '"') {
      normalized = stripLeadingMarkers(normalized.slice(1, -1).trim()).trim();
    }
    if (wordCount(normalized) < MIN_WORDS) continue;
    if (!hasTrigger(text, start)) continue;
    const startLine = lineOf(text, start);
    const numLines = raw.split('\n').length - (raw.endsWith('\n') ? 1 : 0);
    out.push({ normalized, startLine, endLine: startLine + numLines - 1, introEnd: start, kind: 'blockquote' });
  }
  return dedupeNested(out).sort((a, b) => a.introEnd - b.introEnd);
}

// Blank every extracted quote passage's own line range with a sentinel token (never whitespace, so the
// collapsed-whitespace haystack can never let text on either side of a removed span join into a false
// match) before normalizing a file for the haystack, so a quotation only ever verifies against prose
// and code -- never against another quotation, including one that reproduces it only to correct it.
function blankPassages(text, passages) {
  if (!passages.length) return text;
  const lines = text.split('\n');
  for (const p of passages) {
    for (let i = p.startLine - 1; i < p.endLine && i < lines.length; i++) lines[i] = '@@EXCLUDED@@';
  }
  return lines.join('\n');
}

const PARA_BREAK_RE = /\n[ \t]*\n/g;
const LIST_OR_HEADING_START_RE = /^[ \t]*(?:[-+][ \t]|\d+\.[ \t]|#{1,6}[ \t]|>[ \t]?)/;

// A blank-line paragraph break fully separates unrelated prose (a heading is always preceded by one, so
// this subsumes crossing a heading too): a path cite in an earlier, blank-line-separated paragraph or
// list item never "introduces" a quote in a later one -- it is merely nearby in the 200-char window, not
// the thing the quote's own trigger clause names. A TIGHT list (bullets on consecutive lines, no blank
// line between them, this tree's common style) has no paragraph break to catch, so the window is
// separately clamped to the START of the quote's own line when that line itself opens a fresh
// bullet/numbered/heading/blockquote item -- a cite sitting in the PRIOR bullet is a different item's
// own citation, not this one's. The round-10 fix-by-construction gate now FAILS a passage outright when
// its named file misses, so mistaking an unrelated nearby cite for the real introducer is no longer a
// soft advisory-only mistake (docs/adr/ADR-023-attribute-projection-on-viewport-query.md line 144's
// stray "stream.rs:2189", engine/LOD-PREREGISTRATION.md line 303's stray "DECISIONS-PENDING.md:48" from
// the preceding blank-line-separated item, and frontends/shell/ENTRY-66B-PREREGISTRATION.md line 19's
// stray "limits.ts:45" from the preceding TIGHT-list bullet, are the three concrete regressions this
// closes).
function nearestPathIntro(text, introEnd, topDirs) {
  let windowStart = Math.max(0, introEnd - INTRO_WINDOW);
  PARA_BREAK_RE.lastIndex = windowStart;
  let m;
  while ((m = PARA_BREAK_RE.exec(text)) && m.index < introEnd) {
    const breakEnd = m.index + m[0].length;
    if (breakEnd <= introEnd) windowStart = breakEnd;
  }
  const lineStart = text.lastIndexOf('\n', introEnd - 1) + 1;
  if (lineStart > windowStart && LIST_OR_HEADING_START_RE.test(text.slice(lineStart, introEnd))) {
    windowStart = lineStart;
  }
  const cites = extractCitations(text.slice(windowStart, introEnd), { commentsOnly: false }).filter(
    (c) => classifyPath(c.pathRaw, topDirs) !== 'doc-number',
  );
  return cites.length ? cites[cites.length - 1] : null;
}

// A bare hash-checked reference (`` `:a[-b]` @ <rev> sha256:<hex> ``, no path of its own) binds to the
// nearest preceding path:line CITATION in the same paragraph -- unlike nearestPathIntro's 200-char
// window (tuned for a quote's own trigger-proximity rule), a hash reference's binding has no such cap:
// the whole paragraph, back to the nearest blank-line break (or the file start), is searched, since the
// real records this binds against (frontends/shell/OWNER-INVALIDATION-PREREGISTRATION.md at line 1072
// on origin/cut/briefa-p3b, engine/LOD-PREREGISTRATION.md at line 531 on origin/engine/lod-tier-builder
// -- cited this way, not as a `path:line` token, so this comment itself does not read as a stale
// same-branch cite to verify-cites.mjs) sit the bare ref and its owning path cite in the same sentence
// or bullet, sometimes past 200 characters once a sha256 hex digest sits between them.
function paragraphStart(text, pos) {
  PARA_BREAK_RE.lastIndex = 0;
  let start = 0;
  let m;
  while ((m = PARA_BREAK_RE.exec(text)) && m.index < pos) {
    start = m.index + m[0].length;
  }
  return start;
}

function nearestPathInParagraph(text, pos, topDirs) {
  const start = paragraphStart(text, pos);
  const cites = extractCitations(text.slice(start, pos), { commentsOnly: false }).filter(
    (c) => classifyPath(c.pathRaw, topDirs) !== 'doc-number',
  );
  return cites.length ? cites[cites.length - 1] : null;
}

function firstWords(s, n) {
  return s.split(' ').slice(0, n).join(' ');
}

function defaultScanFiles(root, index) {
  return claimFiles(index.files).map((f) => path.join(root, f));
}

// Round 12's own hash-checked references live wider than the quote-scan set (they cite branch-to-branch
// record corrections, and the ledger/mechanic docs carry the round's own dogfooded self-citation) --
// the preregistration/ADR set PLUS these four named files/globs, PLUS every `.claude/agents/*.md`
// (the custodian's dispatch brief, 2026-09-17, this round's item (d)). Hash references are checked here ONLY -- no quote
// passage in any of these extra files is extracted or verified; they never join the quote haystack.
const EXTRA_HASH_SCAN_FILES = ['DECISIONS-PENDING.md', 'AI_DEVELOPMENT.md', 'docs/PREREGISTRATION-TEMPLATE.md'];

function defaultHashScanFiles(root, index) {
  const files = new Set(defaultScanFiles(root, index));
  for (const rel of EXTRA_HASH_SCAN_FILES) {
    if (index.set.has(rel)) files.add(path.join(root, rel));
  }
  for (const rel of index.files) {
    if (rel.startsWith('.claude/agents/') && rel.endsWith('.md')) files.add(path.join(root, rel));
  }
  return [...files];
}

/**
 * The pre-existing offenders at `scripts/plan/verify-quotes.baseline.json`: `{ $doc, entries: [{file,
 * line, words, reason, disposition, ruling, corrected_by?}] }` (round 11's ratchet, `$doc` documenting
 * the same append-never rule the banner comment above states) -- recorded and classified by the
 * custodian's worker, pending the human's sight at this PR, never described as "human-reviewed" until
 * it is. The pre-round-11 bare-array shape never shipped on `main` and had no product caller (round-12
 * fix round, reviewer should-fix 5); dropped, not carried as a fallback nobody reaches. Missing or
 * unparsable is an empty baseline, never fatal.
 */
function loadBaseline(root) {
  const p = path.join(root, BASELINE_REL_PATH);
  if (!fs.existsSync(p)) return [];
  try {
    const parsed = JSON.parse(fs.readFileSync(p, 'utf8'));
    if (parsed && Array.isArray(parsed.entries)) return parsed.entries;
    return [];
  } catch {
    return [];
  }
}

/**
 * Round 15, item 3's hash-finding baseline route (round 15, item 3; state/gate-log.json records 66 and
 * 68): the SAME file, a SIBLING top-level key, `hashEntries: [{file, line,
 * reason, disposition, ruling, corrected_by?}]` -- for a hash reference this mechanism can never bind
 * or reproduce, sitting in text this piece's own authority does not own (an already-landed, append-only
 * amendment in a DIFFERENT piece's record, e.g. engine/LOD-PREREGISTRATION.md's Amendment 12, closed
 * under the record cap). Absent `hashEntries` (every baseline.json before this round, and any file
 * missing/unparsable) is an empty hash baseline, never fatal -- the same convention `loadBaseline`
 * above uses for `entries`.
 */
function loadHashBaseline(root) {
  const p = path.join(root, BASELINE_REL_PATH);
  if (!fs.existsSync(p)) return [];
  try {
    const parsed = JSON.parse(fs.readFileSync(p, 'utf8'));
    if (parsed && Array.isArray(parsed.hashEntries)) return parsed.hashEntries;
    return [];
  } catch {
    return [];
  }
}

const VALID_DISPOSITIONS = new Set(['unfindable-by-construction', 'tool-false-trigger', 'owed-correction']);

/**
 * Round 11's ratchet, conditions (a) and (b) (DECISIONS-PENDING.md, "RULED 2026-09-17, round 11"; see
 * VERIFY-QUOTES-PREREGISTRATION.md Amendment 6): every baseline entry carries exactly one of the three
 * valid `disposition`s and a non-empty `ruling` naming what authorised it -- so nothing is added except
 * by a ruling. An entry lacking either is a baseline error, returned (not thrown) so every offending
 * entry is reported in one run rather than stopping at the first.
 */
function validateBaselineEntries(entries) {
  const errors = [];
  for (const e of entries) {
    if (!VALID_DISPOSITIONS.has(e.disposition)) {
      errors.push({ file: e.file, line: e.line, reason: `missing or invalid "disposition" (${JSON.stringify(e.disposition ?? null)})` });
    }
    if (typeof e.ruling !== 'string' || !e.ruling.trim()) {
      errors.push({ file: e.file, line: e.line, reason: 'missing "ruling"' });
    }
  }
  return errors;
}

// (file, line, words-as-a-normalized-PREFIX-of-the-passage): a stale entry whose line shifted, or whose
// recorded words no longer prefix what is actually there today, matches nothing -- it does not silently
// waive a different bad quote that happens to land on the same line.
function matchBaseline(entries, used, relPath, line, normalizedPassage) {
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    if (used.has(i) || e.file !== relPath || e.line !== line) continue;
    const wordsNorm = normalizeText(e.words ?? '');
    if (wordsNorm && normalizedPassage.startsWith(wordsNorm)) {
      used.add(i);
      return e;
    }
  }
  return null;
}

// (file, line, the entry's own `reason` as a PREFIX of the finding's actual reason) -- the same
// stale-entry-matches-nothing discipline as matchBaseline above, adapted for a hash finding's `reason`
// (a fixed diagnostic string `checkHashRef`/`findUnboundHashTokens` produce, not quoted prose): a
// finding whose reason no longer starts with what the entry recorded -- the reference moved to a
// DIFFERENT failure at the same line -- does not silently waive it.
function matchHashBaseline(entries, used, relPath, line, reason) {
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    if (used.has(i) || e.file !== relPath || e.line !== line) continue;
    if (typeof e.reason === 'string' && e.reason && reason.startsWith(e.reason)) {
      used.add(i);
      return e;
    }
  }
  return null;
}

// HASH-CHECKED REFERENCES ("quote by reference", docs/PREREGISTRATION-TEMPLATE.md §10; the human,
// 2026-09-17, round 12 item 1, applying entry 104's rider on (b)). Three shapes, all in the real record
// corpus written under this same ruling (round-12 fix round, architect B1) -- each cited here by branch
// and line NUMBER, not as a `path:line` token, so this comment does not itself read as a stale
// same-branch cite to verify-cites.mjs: `` `path:a[-b]` @ <rev> sha256:<hex> `` (rev/hash OUTSIDE the
// backticks -- engine/LOD-PREREGISTRATION.md, lines 531-534, on origin/engine/lod-tier-builder);
// `` `path:a[-b] @ <rev> sha256:<hex>` `` (all INSIDE one backtick span --
// engine/ADMISSION-PREREGISTRATION.md line 1540 and frontends/shell/OWNER-INVALIDATION-PREREGISTRATION.md
// line 1072, both on origin/cut/briefa-p3b); and a bare `` `:a[-b]` `` (no path of its own, either
// placement, with or without backticks) bound to the nearest preceding path:line CITATION in the same
// paragraph (nearestPathInParagraph, above --
// the shell and LOD lines above both use this shape too, for a second/third reference to a path already
// named earlier in the same sentence or bullet). The grammar below treats the leading and trailing
// backtick as INDEPENDENTLY optional rather than modelling the two placements as separate alternatives:
// a lone `` ` `` opportunistically consumed wherever one sits (right after the line range for the
// OUTSIDE shape, right after the hash for the INSIDE shape, absent for a fully bare reference) covers
// every real shape above plus the bare-with-no-backticks-at-all case named in the dispatch, with no
// duplicated capture groups. `<rev>` is any run of non-whitespace, non-backtick characters (not
// restricted to 7-40 hex at the GRAMMAR level): the dispatch's "7 to 40 hex; anything else ... goes to
// checkHashRef's unresolvable-rev path and fails by name" means the reference must still be RECOGNIZED
// (never silently unbound) even when what follows `@` is not hex-shaped -- checkHashRef's own `git show
// <rev>:<path>` call is what actually resolves or rejects it, by name, never the regex. Absent `@ <rev>`
// defaults to HEAD of the checked tree. Recomputed over the bytes of `git show <rev>:<path>` lines a..b,
// each line WITH its own LF -- FAILS BY NAME on a mismatch or on an unresolvable rev, path or line range
// (an unavailable rev never passes silently, per the dispatch). A `byte-copied from ` prefix additionally
// requires the text that follows -- a `> ` blockquote run or an inline `` `code span` `` starting on the
// next non-blank line -- to be byte-identical to a contiguous substring of those same lines, with NONE of
// normalizeText's presentation normalization applied (the rider: what is reproduced must be exact, not
// merely equivalent after folding).
//
// THE `//` CONTINUATION GRAMMAR (round 15, item 3; state/gate-log.json records 66 and 68): round 15's
// own item 1, clause (d) states the rule a reference is written under going forward -- "a `path:line @
// <rev> sha256:<hex>` reference is written contiguous on one line, even past 100 columns (rustfmt does
// not reflow comments)" -- but one real, already-committed reference predates that rule and is recorded
// as owed, not fixed in place (engine/LOD-PREREGISTRATION.md's Amendment 14, the row on
// `engine/tests/lod_tier_builder.rs:190-191`): `` `engine/tests/common/mod.rs:55` @ 43a3039a3a4d ``,
// rustfmt-wrapped, continues onto the NEXT `//`-commented line before `sha256:...` -- the two lines,
// stripped of their own individual `// ` comment markers, form one contiguous reference. `GAP` (below)
// matches ordinary horizontal whitespace OR exactly one such continuation (a newline, then a `//`
// comment marker with its own optional leading/trailing horizontal whitespace) wherever the grammar
// would otherwise only accept `\s*` -- deliberately not `\s` generally (which already matches `\n` on
// its own, but not the literal `//` a Rust line comment repeats on every physical line) and deliberately
// only ONE continuation, not several (the real case splits at exactly one point; a reference broken
// across three or more physical lines is not a shape this grammar was built against and is left
// unrecognized rather than guessed at).
const GAP = '[ \\t]*(?:\\n[ \\t]*//[ \\t]?)?[ \\t]*';
const HASH_REF_RE = new RegExp(
  '(byte-copied from\\s+)?`?(?:([A-Za-z0-9_][A-Za-z0-9_./+-]*))?:(\\d+)(?:-(\\d+))?`?' +
    `(?:${GAP}@${GAP}([^\\s\`]+))?${GAP}sha256:([0-9a-f]{64})\`?`,
  'g',
);

// Every raw `sha256:<64 hex>` token, regardless of what (if anything) precedes it -- used to find one
// the grammar above did NOT bind into any reference at all (round-12 fix round item (b): "never
// silent"), by comparing each token's position against every successfully extracted reference's own
// matched span.
const RAW_SHA_RE = /sha256:([0-9a-f]{64})/g;

/** Every hash-checked reference in `text`: [{reproduction,pathRaw,startLine,endLine,rev,hash,line,start,end}]. */
export function extractHashRefs(text) {
  const out = [];
  HASH_REF_RE.lastIndex = 0;
  let m;
  while ((m = HASH_REF_RE.exec(text))) {
    out.push({
      reproduction: Boolean(m[1]),
      pathRaw: m[2],
      startLine: Number(m[3]),
      endLine: m[4] !== undefined ? Number(m[4]) : Number(m[3]),
      rev: m[5] ?? 'HEAD',
      hash: m[6].toLowerCase(),
      line: lineOf(text, m.index),
      start: m.index,
      end: m.index + m[0].length,
    });
  }
  return out;
}

// A malformed reference attempt still carries SOME `:digit(-digit)?` immediately before its `sha256:`
// token (every real shape does -- see HASH_REF_RE's own comment); a data-integrity checksum recorded
// for its own sake (a fixture's file hash, unrelated to this mechanism entirely -- e.g.
// kernel/CANCEL-RESCORE-PREREGISTRATION.md:49, kernel/SCALE-PASS-PREREGISTRATION.md:521,:571, each
// recording `sha256:<hex>` for a 5 GB parquet fixture with no `:line` anywhere near it) does not.
// DISCLOSED NARROWING (round-12 fix round item (b)): "a cite" this item's own wording names is read as
// an ATTEMPTED one -- a `:digit` sequence within reach -- not literally every `sha256:` substring
// anywhere in the scanned tree; the alternative (flagging every fixture checksum this tree already
// records under an unrelated convention) would be a wide new false-positive class this piece's scope
// does not own fixing (those documents are out of scope here), not a defect this mechanism exists for.
const UNBOUND_LOOKBACK = 120;
const COLON_DIGIT_NEARBY_RE = /:\d+(?:-\d+)?/;

/**
 * Every `sha256:<64 hex>` token in `text` that sits near an ATTEMPTED `:line` reference (a `:digit`
 * sequence within `UNBOUND_LOOKBACK` characters before it) whose position the grammar above did not
 * bind into any `refs` entry -- a malformed or orphaned reference attempt, reported by name rather
 * than silently ignored (round-12 fix round item (b)). Returns `[{line}]`.
 */
function findUnboundHashTokens(text, refs) {
  const spans = refs.map((r) => [r.start, r.end]);
  const out = [];
  RAW_SHA_RE.lastIndex = 0;
  let m;
  while ((m = RAW_SHA_RE.exec(text))) {
    const idx = m.index;
    if (spans.some(([a, b]) => idx >= a && idx < b)) continue;
    const windowStart = Math.max(0, idx - UNBOUND_LOOKBACK);
    if (!COLON_DIGIT_NEARBY_RE.test(text.slice(windowStart, idx))) continue;
    out.push({ line: lineOf(text, idx) });
  }
  return out;
}

function gitShowFile(root, rev, relPath) {
  try {
    return execFileSync('git', ['show', `${rev}:${relPath}`], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  } catch {
    return null;
  }
}

// Lines a..b (1-indexed, inclusive), each carrying its own trailing LF -- except the file's very last
// line when the file itself has no trailing newline, which then carries none (a real fact about the
// file's bytes, not something this slices around).
function linesWithLF(content, a, b) {
  const starts = [0];
  for (let i = 0; i < content.length; i++) if (content.charCodeAt(i) === 10) starts.push(i + 1);
  const totalLines = content.endsWith('\n') ? starts.length - 1 : starts.length;
  if (!Number.isInteger(a) || !Number.isInteger(b) || a < 1 || b < a || b > totalLines) return null;
  const startOffset = starts[a - 1];
  const endOffset = b < starts.length ? starts[b] : content.length;
  return content.slice(startOffset, endOffset);
}

function sha256Hex(s) {
  return crypto.createHash('sha256').update(Buffer.from(s, 'utf8')).digest('hex');
}

// A straight- or curly-quoted span, whichever starts earliest in `s` -- used for the same-line search
// below. Deliberately NOT also a backtick code span here: the rest of a marker's own line routinely
// carries a SECOND `` `path:line` `` citation (a bare reference bound to the same paragraph, or a
// second reference the same "byte-copied from" covers, as `` `path:206` @ rev sha256:hex and
// `path:208` @ rev sha256:hex: "..." "..." `` does) -- a naive earliest-of-code-span-or-quote search
// would find that citation's own backticks before ever reaching the actual quoted reproduction. The
// next-line search below (shape 2) is unaffected: a code span there is never itself another reference,
// by construction (a hash reference's own grammar requires a `:digit` before `sha256:`, and this
// candidate is read starting fresh on its own line).
function firstQuotedSpan(s) {
  const straight = /"([^"\n]+)"/.exec(s);
  const curly = /“([^”\n]+)”/.exec(s);
  const candidates = [straight, curly].filter(Boolean);
  if (!candidates.length) return null;
  candidates.sort((a, b) => a.index - b.index);
  return candidates[0][1];
}

function stripBlockquotePrefix(s) {
  const lines = s.split('\n').map((l) => l.replace(/^[ \t]*>[ \t]?/, ''));
  if (lines[lines.length - 1] === '') lines.pop();
  return lines.join('\n');
}

// The reproduced text a `byte-copied from` marker requires, and the direction to check it in. Three
// shapes, all seen in the real record corpus this mechanism was built against (round 15, item 3; the
// checker attempt-4 architect and reviewer reports, state/gate-log.json records 66 and 68): (1) SAME
// LINE, AFTER the marker -- a straight/curly-quoted span later on the marker's
// own line (`byte-copied from \`path:206\` @ rev sha256:hex and \`path:208\` @ rev sha256:hex: "..." "..."`,
// docs/PREREGISTRATION-TEMPLATE.md:140's Clause (a') paragraph and its four siblings -- a SECOND
// reference on the same line, with no "byte-copied from" of its own, binds to whichever quoted span
// the first reference's own reproduction search does not consume, by simply being the FIRST one found
// after each reference's own end). (2) the NEXT non-blank line -- a `> ` blockquote run or an inline
// code span, the original, pre-round-15 shape (the shell/ADMISSION/LOD fixtures below). (3) SAME LINE,
// BEFORE the marker -- the marker's own sentence describes the paragraph it closes as byte-copied FROM
// its cited source, with no delimiting quote/code-span markup around the reproduced prose at all
// (docs/PREREGISTRATION-TEMPLATE.md:132's class-7 definition). Checked in this order; the first shape
// found wins -- a document is not expected to use more than one for the same reference. Returns
// `{ text, reverse }` (`reverse: true` for shape 3, meaning the CANDIDATE must contain the SOURCE, not
// the other way around -- shape 3's candidate is "everything on the line before the marker", which
// necessarily also carries the marker's own framing prose the source itself never contains) or `null`.
function reproducedTextNear(text, ref) {
  const lineStart = text.lastIndexOf('\n', ref.start - 1) + 1;
  let lineEnd = text.indexOf('\n', ref.end);
  if (lineEnd === -1) lineEnd = text.length;

  // Shape 1: same line, after the marker.
  const sameLineAfter = firstQuotedSpan(text.slice(ref.end, lineEnd));
  if (sameLineAfter !== null) return { text: sameLineAfter, reverse: false };

  // Shape 2: the next non-blank line -- DISCLOSED GAP unchanged from the original mechanism: only ONE
  // such following element is read (the first blockquote run or the first code span, whichever the
  // text actually uses); a reproduction split across both, or appearing more than one blank line down,
  // is not found and the marker fails by name for lack of a resolvable reproduction, not silently
  // accepted.
  const nl = text.indexOf('\n', ref.end);
  let rest = nl === -1 ? '' : text.slice(nl + 1);
  rest = rest.replace(/^(?:[ \t]*\n)*/, '');
  const bqRun = /^(?:[ \t]*>[ \t]?.*\n?)+/.exec(rest);
  if (bqRun) return { text: stripBlockquotePrefix(bqRun[0]), reverse: false };
  const codeSpan = /^[ \t]*`([^`\n]+)`/.exec(rest);
  if (codeSpan) return { text: codeSpan[1], reverse: false };

  // Shape 3: same line, before the marker -- reversed containment (see the comment above).
  const beforeMarker = text.slice(lineStart, ref.start);
  if (beforeMarker.trim()) return { text: beforeMarker, reverse: true };

  return null;
}

/**
 * Resolves and hash-checks one reference against the tracked tree. Returns { ok, reason?, resolvedPath?,
 * slice? }. A path that does not resolve to exactly one tracked file, a rev `git show` cannot resolve,
 * an out-of-range line span, a hash mismatch, or (for a `byte-copied from` marker) a reproduction that
 * is missing or not a byte-exact substring of the cited lines -- each fails by name, never silently.
 *
 * `topDirs` (from `topDirsOf(index)`) is required to resolve a BARE reference (`ref.pathRaw` undefined):
 * bound to the nearest preceding path:line citation in the same paragraph (nearestPathInParagraph); a
 * bare reference with no such citation to bind to fails by name rather than silently doing nothing.
 *
 * Path resolution prefers the CURRENT tree's tracked index (`resolveRef`, disambiguating a bare
 * basename or partial path); when that finds nothing for a fully-written path, it falls back to asking
 * `git show <rev>:<path>` directly. This is not a weakening: `@ <rev>` exists precisely to pin content
 * that may not be in the CURRENT tree at all -- the real corpus this grammar was built against cites a
 * sibling branch's own file (e.g. engine/LOD-PREREGISTRATION.md line 531's `engine/tests/common/mod.rs`,
 * tracked on `engine/lod-tier-builder` but not on this branch) from the branch actually doing the
 * citing. A path neither in the current index nor resolvable at the cited rev still fails by name.
 */
function checkHashRef(root, index, relPath, text, ref, topDirs) {
  let pathRaw = ref.pathRaw;
  if (!pathRaw) {
    const bound = nearestPathInParagraph(text, ref.start, topDirs);
    if (!bound) {
      return { ok: false, reason: 'bare hash reference has no preceding path:line cite to bind to in the same paragraph' };
    }
    pathRaw = bound.pathRaw;
  }
  const { exact, all } = resolveRef(pathRaw, relPath, index);
  const named = exact.length ? exact : all;
  let resolvedPath;
  let content;
  if (named.length === 1) {
    resolvedPath = named[0];
    content = gitShowFile(root, ref.rev, resolvedPath);
    if (content === null) {
      return { ok: false, reason: `unresolvable rev "${ref.rev}" for "${resolvedPath}" -- git show failed` };
    }
  } else if (named.length === 0) {
    content = gitShowFile(root, ref.rev, pathRaw);
    if (content === null) {
      return {
        ok: false,
        reason: `unresolvable path "${pathRaw}" -- no tracked file matches, and "git show ${ref.rev}:${pathRaw}" failed`,
      };
    }
    resolvedPath = pathRaw;
  } else {
    return { ok: false, reason: `ambiguous path "${pathRaw}" (${named.length} candidates)` };
  }
  const slice = linesWithLF(content, ref.startLine, ref.endLine);
  if (slice === null) {
    return { ok: false, reason: `line range ${ref.startLine}-${ref.endLine} out of range for "${resolvedPath}" @ ${ref.rev}` };
  }
  const actual = sha256Hex(slice);
  if (actual !== ref.hash) {
    return {
      ok: false,
      reason: `sha256 mismatch for "${resolvedPath}:${ref.startLine}-${ref.endLine}" @ ${ref.rev}: claimed ${ref.hash}, actual ${actual}`,
    };
  }
  if (ref.reproduction) {
    const repro = reproducedTextNear(text, ref);
    if (repro === null) {
      return {
        ok: false,
        reason: `"byte-copied from" marker has no reproduced blockquote, code span or quoted text near it`,
      };
    }
    // Shape 1/2 (repro.reverse === false): the cited SOURCE lines must contain the candidate, byte-exact.
    // Shape 3 (repro.reverse === true): the candidate is "everything on the marker's own line before it",
    // which also carries the marker's own framing prose -- so the check runs the other way: the candidate
    // must contain the (blockquote-prefix-stripped) SOURCE lines, byte-exact.
    const ok = repro.reverse ? repro.text.includes(stripBlockquotePrefix(slice)) : slice.includes(repro.text);
    if (!ok) {
      return {
        ok: false,
        reason: `reproduced text is not a byte-exact substring of "${resolvedPath}:${ref.startLine}-${ref.endLine}" @ ${ref.rev}`,
      };
    }
  }
  return { ok: true, resolvedPath, slice };
}

/**
 * Scans `files` (default: every tracked `*PREREGISTRATION*.md` and `docs/adr/*.md`; explicit paths
 * need not be tracked -- a scratch copy of another branch's file is scannable) for verbatim-introduced
 * quotes and checks each against the tracked tree, excluding every extracted quotation (including the
 * baseline file itself) from the searchable text. Returns
 * { findings, advisories, baselined, checked, scanned, unmatchedBaseline, baselineErrors, hashFindings,
 * hashBaselined, unmatchedHashBaseline, hashBaselineErrors }.
 */
export function runVerifyQuotes({ repoRoot, files } = {}) {
  const root = repoRoot ?? REPO_ROOT;
  const index = buildTrackedIndex(root);
  const topDirs = topDirsOf(index);
  const scanAbs = (files && files.length ? files : defaultScanFiles(root, index)).map((f) => path.resolve(f));
  // Hash references are scanned wider than quote passages, for hash checking only, with no quote
  // haystack (round-12 fix round item (d)): an explicit `files` override scans exactly those files for
  // both; the default run additionally hash-checks DECISIONS-PENDING.md, AI_DEVELOPMENT.md,
  // docs/PREREGISTRATION-TEMPLATE.md and every .claude/agents/*.md, none of which ever enters quote
  // extraction or the quote-verification haystack.
  const hashScanAbs = files && files.length ? scanAbs : defaultHashScanFiles(root, index).map((f) => path.resolve(f));
  const baselineEntries = loadBaseline(root);
  const baselineErrors = validateBaselineEntries(baselineEntries);
  const usedBaseline = new Set();
  const baselineAbs = path.join(root, BASELINE_REL_PATH);
  const hashBaselineEntries = loadHashBaseline(root);
  const hashBaselineErrors = validateBaselineEntries(hashBaselineEntries);
  const usedHashBaseline = new Set();

  const haystack = new Set(scanAbs);
  for (const rel of index.files) {
    if (!TEXT_EXTS.has(extOf(rel))) continue;
    const abs = path.join(root, rel);
    if (abs !== baselineAbs) haystack.add(abs);
  }
  haystack.delete(baselineAbs);

  // Plain normalize (no blanking) -- used for every OTHER file a passage is searched against. Deliberately
  // NOT the quote-free text: a source document's own authoritative content is routinely recorded AS a
  // quotation (DECISIONS-PENDING.md's `**"...", quoted verbatim` rulings) and must stay searchable.
  const normCache = new Map();
  const readNorm = (abs) => {
    if (!normCache.has(abs)) normCache.set(abs, normalizeText(fs.readFileSync(abs, 'utf8')));
    return normCache.get(abs);
  };

  const findings = [];
  const advisories = [];
  const baselined = [];
  const hashFindings = [];
  const hashBaselined = [];
  let checked = 0;

  // Hash-ref scanning: its own pass, its own (wider) file set, no quote-passage extraction on any file
  // here that scanAbs does not also carry. A finding the hash baseline below already carries (round 15,
  // item 3; state/gate-log.json records 66 and 68) is reported as baselined, not gated -- the same
  // append-never, new-mismatch-still-fails discipline the quote baseline uses (see matchHashBaseline).
  const hashScanSet = new Set(hashScanAbs);
  for (const abs of scanAbs) hashScanSet.add(abs);
  for (const absPath of hashScanSet) {
    const relPath = path.relative(root, absPath).split(path.sep).join('/');
    const text = fs.readFileSync(absPath, 'utf8');
    const refs = extractHashRefs(text);
    const recordHashResult = (line, reason) => {
      const known = matchHashBaseline(hashBaselineEntries, usedHashBaseline, relPath, line, reason);
      if (known) {
        hashBaselined.push({ relPath, line, reason });
        return;
      }
      hashFindings.push({ relPath, line, reason });
    };
    for (const tok of findUnboundHashTokens(text, refs)) {
      recordHashResult(
        tok.line,
        'unbound hash reference -- a sha256:<hex> token not recognized as part of a `path:line @ rev sha256:hex` reference',
      );
    }
    for (const ref of refs) {
      const res = checkHashRef(root, index, relPath, text, ref, topDirs);
      if (!res.ok) recordHashResult(ref.line, res.reason);
    }
  }

  for (const absPath of scanAbs) {
    const relPath = path.relative(root, absPath).split(path.sep).join('/');
    const text = fs.readFileSync(absPath, 'utf8');
    const passages = extractQuotePassages(text);
    // Every OTHER passage in THIS SAME document is blanked before a passage from it searches its own
    // file -- same-document self-verification only (see the header comment for why not tree-wide).
    const selfQuoteFree = normalizeText(blankPassages(text, passages));
    const norm = (abs) => (abs === absPath ? selfQuoteFree : readNorm(abs));

    for (const p of passages) {
      checked++;
      const snippet = firstWords(p.normalized, 12);
      const pathCite = nearestPathIntro(text, p.introEnd, topDirs);

      if (pathCite) {
        const { exact, all } = resolveRef(pathCite.pathRaw, relPath, index);
        const named = (exact.length ? exact : all).map((f) => path.join(root, f));
        if (named.length === 1) {
          if (norm(named[0]).includes(p.normalized)) continue; // PASS: found in the one named file
          const known = matchBaseline(baselineEntries, usedBaseline, relPath, p.startLine, p.normalized);
          if (known) {
            baselined.push({ relPath, line: p.startLine, snippet, reason: known.reason });
            continue;
          }
          findings.push({ relPath, line: p.startLine, snippet, reason: `not found in named "${pathCite.pathRaw}"` });
          continue;
        }
        advisories.push({
          relPath,
          line: p.startLine,
          snippet,
          reason:
            named.length > 1
              ? `named "${pathCite.pathRaw}" is ambiguous (${named.length} candidates) -- not gated, see verify:cites`
              : `named "${pathCite.pathRaw}" does not resolve to a tracked file -- not gated, see verify:cites`,
        });
        continue;
      }

      let found = false;
      for (const abs of haystack) {
        if (norm(abs).includes(p.normalized)) {
          found = true;
          break;
        }
      }
      if (found) continue;

      const known = matchBaseline(baselineEntries, usedBaseline, relPath, p.startLine, p.normalized);
      if (known) {
        baselined.push({ relPath, line: p.startLine, snippet, reason: known.reason });
        continue;
      }
      findings.push({ relPath, line: p.startLine, snippet });
    }
  }
  const unmatchedBaseline = baselineEntries.filter((_, i) => !usedBaseline.has(i));
  const unmatchedHashBaseline = hashBaselineEntries.filter((_, i) => !usedHashBaseline.has(i));
  return {
    findings,
    advisories,
    baselined,
    checked,
    scanned: scanAbs.length,
    unmatchedBaseline,
    baselineErrors,
    hashFindings,
    hashBaselined,
    unmatchedHashBaseline,
    hashBaselineErrors,
  };
}

/**
 * Every `path:line[-line]` cite (whose path is not the `docs/NN` doc-number convention) with its first
 * cited line's text, trimmed to 100 chars -- or, when the cite cannot be attributed to exactly one
 * tracked file, or the cited line is past that file's end, a status string instead (never the first
 * same-basename candidate's unrelated content, never an empty string). A cite that is also a
 * hash-checked reference (extractHashRefs) gains a trailing hash-status mark, `[hash: PASS]` or
 * `[hash: FAIL — <reason>]`, so the two checks are readable together at a glance.
 */
export function listCiteContents({ repoRoot, files } = {}) {
  const root = repoRoot ?? REPO_ROOT;
  const index = buildTrackedIndex(root);
  const topDirs = topDirsOf(index);
  const scanAbs = (files && files.length ? files : defaultScanFiles(root, index)).map((f) => path.resolve(f));
  const out = [];
  for (const absPath of scanAbs) {
    const relPath = path.relative(root, absPath).split(path.sep).join('/');
    const ext = extOf(absPath);
    const text = fs.readFileSync(absPath, 'utf8');
    const hashByKey = new Map();
    for (const ref of extractHashRefs(text)) {
      const res = checkHashRef(root, index, relPath, text, ref, topDirs);
      const key = `${ref.line}:${ref.pathRaw}:${ref.startLine}`;
      hashByKey.set(key, res.ok ? 'hash: PASS' : `hash: FAIL — ${res.reason}`);
    }
    for (const c of extractCitations(text, { commentsOnly: CODE_EXTS.has(ext) })) {
      if (classifyPath(c.pathRaw, topDirs) === 'doc-number') continue;
      const { exact, all } = resolveRef(c.pathRaw, relPath, index);
      const cands = exact.length ? exact : all;
      let target, firstLine;
      if (cands.length === 0) {
        target = `${c.pathRaw}:${c.startL}`;
        firstLine = 'unresolved';
      } else if (cands.length > 1) {
        target = `${c.pathRaw}:${c.startL}`;
        firstLine = `ambiguous (${cands.length} candidates)`;
      } else {
        const cand = cands[0];
        const lines = fs.readFileSync(path.join(root, cand), 'utf8').split('\n');
        if (c.startL < 1 || c.startL > lines.length) {
          target = `${cand}:${c.startL}`;
          firstLine = `out of range (file has ${lines.length} lines)`;
        } else {
          target = `${cand}:${c.startL}`;
          const raw = (lines[c.startL - 1] ?? '').trim();
          // A genuinely blank target line is real (a spacer between a brace and a doc comment, say) --
          // reported as such, not as an empty string a reader could mistake for a classification miss.
          firstLine = raw ? raw.slice(0, 100) : '(blank line)';
        }
      }
      // The hash-status mark is a SEPARATE field, not folded into `firstLine`: `firstLine` is the
      // quoted target line's own text, and the mark belongs outside that quotation (round-12 fix round
      // item (e); main() below prints it after the closing quote, never inside it).
      const hashMark = hashByKey.get(`${c.citeLine}:${c.pathRaw}:${c.startL}`) ?? null;
      out.push({ relPath, citeLine: c.citeLine, target, firstLine, hashMark });
    }
  }
  return out;
}

function parseArgs(argv) {
  const args = { showCites: false, files: [] };
  for (const a of argv) {
    if (a === '--show-cites') args.showCites = true;
    else args.files.push(a);
  }
  return args;
}

function pluralBaselineEntries(n) {
  return `${n} baseline ${n === 1 ? 'entry' : 'entries'}`;
}

function main() {
  const { showCites, files } = parseArgs(process.argv.slice(2));
  const opts = { repoRoot: REPO_ROOT, files: files.length ? files : undefined };
  const {
    findings,
    advisories,
    baselined,
    checked,
    scanned,
    unmatchedBaseline,
    baselineErrors,
    hashFindings,
    hashBaselined,
    unmatchedHashBaseline,
    hashBaselineErrors,
  } = runVerifyQuotes(opts);

  console.log(
    `verify:quotes — scanned ${scanned} file(s) for verbatim-marked quotations and hash-checked references (--show-cites for the path:line cite listing).`,
  );
  if (showCites) {
    const cites = listCiteContents(opts);
    console.log(`  ${cites.length} path:line cite(s):`);
    // The hash-status mark sits OUTSIDE the quoted line (round-12 fix round item (e)) -- it is not
    // part of what the citing document's own target line says.
    for (const c of cites) {
      console.log(`  - ${c.relPath}:${c.citeLine} -> ${c.target} — "${c.firstLine}"${c.hashMark ? ` [${c.hashMark}]` : ''}`);
    }
  }

  if (advisories.length) {
    console.error(`verify:quotes — ${advisories.length} advisory (path cite unresolved/ambiguous, not gated -- see verify:cites):`);
    for (const a of advisories) console.error(`  - ${a.relPath}:${a.line} — "${a.snippet}…" — ${a.reason}`);
  }
  if (baselined.length) {
    console.error(`verify:quotes — ${baselined.length} baselined (pre-existing, ${BASELINE_REL_PATH}, still failing):`);
    for (const b of baselined) console.error(`  - ${b.relPath}:${b.line} — "${b.snippet}…" — ${b.reason}`);
  }
  // Printed only when non-zero (round-12 fix round item (e)): "0 baseline entries matched nothing"
  // on every clean run was noise, not a finding.
  if (unmatchedBaseline.length) {
    console.error(`verify:quotes — ${pluralBaselineEntries(unmatchedBaseline.length)} matched nothing this run (stale ${BASELINE_REL_PATH} entries).`);
    for (const e of unmatchedBaseline) console.error(`  - ${e.file}:${e.line} — "${String(e.words ?? '').slice(0, 60)}…"`);
  }

  if (baselineErrors.length) {
    console.error(
      `verify:quotes — ${baselineErrors.length} baseline entry error(s) (round 11's ratchet: every entry needs a valid "disposition" and a "ruling"):`,
    );
    for (const e of baselineErrors) console.error(`  - ${e.file}:${e.line} — ${e.reason}`);
  }

  // Round 15, item 3's hash-finding baseline route (state/gate-log.json records 66 and 68) -- reported
  // the same way the quote baseline is, above: baselined findings and errors listed but not gated,
  // stale entries surfaced rather than silently carried.
  if (hashBaselined.length) {
    console.error(`verify:quotes — ${hashBaselined.length} hash-baselined (pre-existing, ${BASELINE_REL_PATH}, still failing):`);
    for (const b of hashBaselined) console.error(`  - ${b.relPath}:${b.line} — ${b.reason}`);
  }
  if (unmatchedHashBaseline.length) {
    console.error(
      `verify:quotes — ${pluralBaselineEntries(unmatchedHashBaseline.length)} matched nothing this run (stale ${BASELINE_REL_PATH} hashEntries).`,
    );
    for (const e of unmatchedHashBaseline) console.error(`  - ${e.file}:${e.line} — ${String(e.reason ?? '').slice(0, 80)}`);
  }
  if (hashBaselineErrors.length) {
    console.error(
      `verify:quotes — ${hashBaselineErrors.length} hash-baseline entry error(s) (round 11's ratchet applies to hashEntries too: every entry needs a valid "disposition" and a "ruling"):`,
    );
    for (const e of hashBaselineErrors) console.error(`  - ${e.file}:${e.line} — ${e.reason}`);
  }

  const verified = checked - baselined.length - advisories.length - findings.length;
  const noHashErrors = hashFindings.length === 0 && hashBaselineErrors.length === 0;
  if (findings.length === 0 && baselineErrors.length === 0 && noHashErrors) {
    console.log(
      `verify:quotes PASS — ${checked} checked, ${verified} verified, ${baselined.length} baselined, ${advisories.length} advisory, 0 baseline entry errors, 0 hash-reference errors (${hashBaselined.length} hash-baselined), 0 hash-baseline entry errors.`,
    );
    return;
  }
  console.error(
    `verify:quotes FAIL — ${findings.length} not found, ${baselineErrors.length} baseline entry error(s), ${hashFindings.length} hash-reference error(s), ${hashBaselineErrors.length} hash-baseline entry error(s):`,
  );
  for (const f of findings) console.error(`  FAIL — quote not found: ${f.relPath}:${f.line} "${f.snippet}…"`);
  for (const h of hashFindings) console.error(`  FAIL — hash reference: ${h.relPath}:${h.line} — ${h.reason}`);
  process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    main();
  } catch (e) {
    console.error(e.stack ?? e.message);
    process.exitCode = 1;
  }
}
