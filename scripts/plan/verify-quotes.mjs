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
// a cross-document quotation of an authoritative primary source is not the same shape.
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
// fails. The baseline file itself may be a bare array (the pre-round-11 shape, still accepted) or
// `{ $doc, entries }` (the current shape -- `$doc` documents this same ratchet at the file's own head).
//
// ADVISORY LISTING (--show-cites, never fails, computed only when passed): every path:line cite's
// first cited line, trimmed, so a reader can eyeball whether the line says what the clause claims --
// this script does not judge it. An ambiguous or unresolved cite is printed as such, never as the
// first same-basename candidate's unrelated text; a cited line past its file's end is printed as such,
// never as an empty string.
//
// DISCLOSED GAPS: a straight/curly/backtick quote spans at most one physical source line (this tree's
// prose keeps a paragraph on one line; a hard-wrapped quote defeats the regex, the same limit
// citationIntegrity.test.mjs accepts); after flattening, a passage that is a substring of unrelated
// adjacent text can false-match (shared by every flatten-then-substring check in this tree); a quote
// attributed to an untracked source (a `.gitignore`d evidence log, a third-party crate's source not
// vendored into this repo) can never be found here by construction, not because it is wrong; the
// tree-wide search for a passage with no nearby path cite is a FLOOR (the text exists somewhere), not
// source attribution (it does not prove the citing document's own claimed source is that occurrence).

import fs from 'node:fs';
import path from 'node:path';
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
// stripEmphasisPairs gets to see the intact pair.
const LEADING_MARKER_RE =
  /^[ \t]*(?:>[ \t]?|\/\/\/[ \t]?|\/\/![ \t]?|\/\/[ \t]?|\/\*\*?[ \t]?|\*\/[ \t]?|\*(?!\*)[ \t]?|#{1,6}[ \t]+|[-+][ \t]+)/;

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

function firstWords(s, n) {
  return s.split(' ').slice(0, n).join(' ');
}

function defaultScanFiles(root, index) {
  return claimFiles(index.files).map((f) => path.join(root, f));
}

/**
 * The pre-existing offenders at `scripts/plan/verify-quotes.baseline.json`: `[{file, line, words,
 * reason, disposition, ruling, corrected_by?}]` -- recorded and classified by the custodian's worker,
 * pending the human's sight at this PR, never described as "human-reviewed" until it is. The file may
 * be a bare array (the pre-round-11 shape) or `{ $doc, entries }` (round 11's ratchet, `$doc`
 * documenting the same append-never rule the banner comment above states); both are read the same way.
 * Missing or unparsable is an empty baseline, never fatal.
 */
function loadBaseline(root) {
  const p = path.join(root, BASELINE_REL_PATH);
  if (!fs.existsSync(p)) return [];
  try {
    const parsed = JSON.parse(fs.readFileSync(p, 'utf8'));
    if (Array.isArray(parsed)) return parsed;
    if (parsed && Array.isArray(parsed.entries)) return parsed.entries;
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

/**
 * Scans `files` (default: every tracked `*PREREGISTRATION*.md` and `docs/adr/*.md`; explicit paths
 * need not be tracked -- a scratch copy of another branch's file is scannable) for verbatim-introduced
 * quotes and checks each against the tracked tree, excluding every extracted quotation (including the
 * baseline file itself) from the searchable text. Returns
 * { findings, advisories, baselined, checked, scanned, unmatchedBaseline, baselineErrors }.
 */
export function runVerifyQuotes({ repoRoot, files } = {}) {
  const root = repoRoot ?? REPO_ROOT;
  const index = buildTrackedIndex(root);
  const topDirs = topDirsOf(index);
  const scanAbs = (files && files.length ? files : defaultScanFiles(root, index)).map((f) => path.resolve(f));
  const baselineEntries = loadBaseline(root);
  const baselineErrors = validateBaselineEntries(baselineEntries);
  const usedBaseline = new Set();
  const baselineAbs = path.join(root, BASELINE_REL_PATH);

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
  let checked = 0;

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
  return { findings, advisories, baselined, checked, scanned: scanAbs.length, unmatchedBaseline, baselineErrors };
}

/**
 * Every `path:line[-line]` cite (whose path is not the `docs/NN` doc-number convention) with its first
 * cited line's text, trimmed to 100 chars -- or, when the cite cannot be attributed to exactly one
 * tracked file, or the cited line is past that file's end, a status string instead (never the first
 * same-basename candidate's unrelated content, never an empty string).
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
      out.push({ relPath, citeLine: c.citeLine, target, firstLine });
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
  const { findings, advisories, baselined, checked, scanned, unmatchedBaseline, baselineErrors } = runVerifyQuotes(opts);

  console.log(`verify:quotes — scanned ${scanned} file(s) for verbatim-marked quotations (--show-cites for the path:line cite listing).`);
  if (showCites) {
    const cites = listCiteContents(opts);
    console.log(`  ${cites.length} path:line cite(s):`);
    for (const c of cites) console.log(`  - ${c.relPath}:${c.citeLine} -> ${c.target} — "${c.firstLine}"`);
  }

  if (advisories.length) {
    console.error(`verify:quotes — ${advisories.length} advisory (path cite unresolved/ambiguous, not gated -- see verify:cites):`);
    for (const a of advisories) console.error(`  - ${a.relPath}:${a.line} — "${a.snippet}…" — ${a.reason}`);
  }
  if (baselined.length) {
    console.error(`verify:quotes — ${baselined.length} baselined (pre-existing, ${BASELINE_REL_PATH}, still failing):`);
    for (const b of baselined) console.error(`  - ${b.relPath}:${b.line} — "${b.snippet}…" — ${b.reason}`);
  }
  console.error(`verify:quotes — ${pluralBaselineEntries(unmatchedBaseline.length)} matched nothing this run (stale ${BASELINE_REL_PATH} entries).`);
  for (const e of unmatchedBaseline) console.error(`  - ${e.file}:${e.line} — "${String(e.words ?? '').slice(0, 60)}…"`);

  if (baselineErrors.length) {
    console.error(
      `verify:quotes — ${baselineErrors.length} baseline entry error(s) (round 11's ratchet: every entry needs a valid "disposition" and a "ruling"):`,
    );
    for (const e of baselineErrors) console.error(`  - ${e.file}:${e.line} — ${e.reason}`);
  }

  const verified = checked - baselined.length - advisories.length - findings.length;
  if (findings.length === 0 && baselineErrors.length === 0) {
    console.log(
      `verify:quotes PASS — ${checked} checked, ${verified} verified, ${baselined.length} baselined, ${advisories.length} advisory, 0 baseline entry errors.`,
    );
    return;
  }
  console.error(`verify:quotes FAIL — ${findings.length} not found, ${baselineErrors.length} baseline entry error(s):`);
  for (const f of findings) console.error(`  FAIL — quote not found: ${f.relPath}:${f.line} "${f.snippet}…"`);
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
