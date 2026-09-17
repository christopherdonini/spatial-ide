#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// scripts/plan/verify-quotes.mjs -- closes the misquote failure class VERIFY-QUOTES-PREREGISTRATION.md
// §0 names: an amendment attributes a sentence to a source "verbatim" (or reads:/says:/states:/quoted
// from/quoting/the human:), but the source does not carry that sentence. `verify-cites.mjs` proves a
// `path:line` reference EXISTS; this proves a claimed-verbatim PASSAGE actually occurs in the tree.
//
// GATED CHECK: a quotation (>= 8 words, straight "..." or curly "..." double quotes, or a `> `
// blockquote run) introduced within the ~200 characters preceding it by one of the eight trigger
// words above. Normalized (blockquote `> ` prefixes stripped, curly quotes/dashes folded to straight,
// whitespace collapsed) and required to occur, as a substring, somewhere in the tracked tree's text
// files, excluding the citing passage's own source line(s) (so a quote never "verifies" against
// itself). A passage introduced by a nearby `path:line` cite is looked up in that file FIRST; missing
// there but found elsewhere is advisory, not gated (the cite itself may be stale -- verify-cites.mjs
// gates that separately).
//
// ADVISORY LISTING (--show-cites, never fails): every path:line cite's first cited line, trimmed, so
// a reader can eyeball whether the line says what the clause claims -- this script does not judge it.
//
// DISCLOSED GAPS: a straight/curly quote spans at most one physical source line (this tree's prose
// keeps a paragraph on one line; a hard-wrapped quote defeats the regex, the same limit
// citationIntegrity.test.mjs accepts); after flattening, a passage that is a substring of unrelated
// adjacent text can false-match (shared by every flatten-then-substring check in this tree); a
// misquote that happens to coincide with a genuine substring elsewhere is not caught -- this proves
// the passage's TEXT exists somewhere, not that the citing document's ATTRIBUTION put it there.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { buildTrackedIndex, extractCitations, resolveRef, classifyPath, topDirsOf, CODE_EXTS } from './verify-cites.mjs';
import { claimFiles } from './verify-test-claims.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(here, '..', '..');

export const TEXT_EXTS = new Set(['md', 'rs', 'ts', 'tsx', 'mjs', 'json', 'toml', 'yaml']);
export const TRIGGERS = ['verbatim', 'reads:', 'reads,', 'says:', 'states:', 'quoted from', 'quoting', 'the human:'];
const INTRO_WINDOW = 200;
const MIN_WORDS = 8;

function lineOf(text, idx) {
  let n = 1;
  for (let i = 0; i < idx; i++) if (text.charCodeAt(i) === 10) n++;
  return n;
}

function extOf(p) {
  const m = /\.([A-Za-z0-9]+)$/.exec(p);
  return m ? m[1].toLowerCase() : null;
}

/** Strip `> ` blockquote prefixes per line, fold curly quotes/dashes to straight, collapse whitespace. */
export function normalizeText(raw) {
  const stripped = raw.split('\n').map((l) => l.replace(/^[ \t]*>[ \t]?/, '')).join('\n');
  const folded = stripped
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, '-');
  return folded.replace(/\s+/g, ' ').trim();
}

function wordCount(s) {
  return s ? s.split(' ').filter(Boolean).length : 0;
}

export function hasTrigger(text, beforeIdx) {
  const windowText = text.slice(Math.max(0, beforeIdx - INTRO_WINDOW), beforeIdx).toLowerCase();
  return TRIGGERS.some((t) => windowText.includes(t));
}

const STRAIGHT_RE = /"([^"\n]+)"/g;
const CURLY_RE = /“([^”\n]+)”/g;
const BLOCKQUOTE_RE = /(?:^[ \t]*>[ \t]?.*\n?)+/gm;

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
  BLOCKQUOTE_RE.lastIndex = 0;
  let m;
  while ((m = BLOCKQUOTE_RE.exec(text))) {
    const normalized = normalizeText(m[0]);
    if (wordCount(normalized) < MIN_WORDS) continue;
    if (!hasTrigger(text, m.index)) continue;
    const startLine = lineOf(text, m.index);
    const numLines = m[0].split('\n').length - (m[0].endsWith('\n') ? 1 : 0);
    out.push({ normalized, startLine, endLine: startLine + numLines - 1, introEnd: m.index, kind: 'blockquote' });
  }
  return out.sort((a, b) => a.introEnd - b.introEnd);
}

// Blank the citing passage's own source lines with a sentinel token (never whitespace, so the
// collapsed-whitespace haystack can never let text on either side of the removed span join into a
// false match) before normalizing, so a quote never "verifies" by finding its own words at its own site.
function excludeLines(text, startLine, endLine) {
  const lines = text.split('\n');
  for (let i = startLine - 1; i < endLine && i < lines.length; i++) lines[i] = '@@EXCLUDED@@';
  return lines.join('\n');
}

function nearestPathIntro(text, introEnd, topDirs) {
  const windowStart = Math.max(0, introEnd - INTRO_WINDOW);
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
 * Scans `files` (default: every tracked `*PREREGISTRATION*.md` and `docs/adr/*.md`; explicit paths
 * need not be tracked -- a scratch copy of another branch's file is scannable) for verbatim-
 * introduced quotes and checks each against the tracked tree. Returns { findings, advisories, checked, scanned }.
 */
export function runVerifyQuotes({ repoRoot, files } = {}) {
  const root = repoRoot ?? REPO_ROOT;
  const index = buildTrackedIndex(root);
  const topDirs = topDirsOf(index);
  const scanAbs = (files && files.length ? files : defaultScanFiles(root, index)).map((f) => path.resolve(f));

  const haystack = new Set(scanAbs);
  for (const rel of index.files) if (TEXT_EXTS.has(extOf(rel))) haystack.add(path.join(root, rel));

  const normCache = new Map();
  const readNorm = (abs) => {
    if (!normCache.has(abs)) normCache.set(abs, normalizeText(fs.readFileSync(abs, 'utf8')));
    return normCache.get(abs);
  };

  const findings = [];
  const advisories = [];
  let checked = 0;

  for (const absPath of scanAbs) {
    const relPath = path.relative(root, absPath).split(path.sep).join('/');
    const text = fs.readFileSync(absPath, 'utf8');
    for (const p of extractQuotePassages(text)) {
      checked++;
      const selfExcluded = normalizeText(excludeLines(text, p.startLine, p.endLine));
      const norm = (abs) => (abs === absPath ? selfExcluded : readNorm(abs));

      const pathCite = nearestPathIntro(text, p.introEnd, topDirs);
      if (pathCite) {
        const { exact, all } = resolveRef(pathCite.pathRaw, relPath, index);
        const named = (exact.length ? exact : all).map((f) => path.join(root, f));
        if (named.some((abs) => norm(abs).includes(p.normalized))) continue; // PASS: found in the named file
      }

      let elsewhere = null;
      for (const abs of haystack) {
        if (norm(abs).includes(p.normalized)) {
          elsewhere = abs;
          break;
        }
      }
      const snippet = firstWords(p.normalized, 12);
      if (elsewhere) {
        if (pathCite) {
          advisories.push({
            relPath,
            line: p.startLine,
            snippet,
            reason: `not found in named "${pathCite.pathRaw}"; found in ${path.relative(root, elsewhere).split(path.sep).join('/')}`,
          });
        }
        continue;
      }
      findings.push({ relPath, line: p.startLine, snippet });
    }
  }
  return { findings, advisories, checked, scanned: scanAbs.length };
}

/** Every `path:line[-line]` cite (whose path resolves) with its first cited line's text, trimmed to 100 chars. */
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
      const cand = (exact.length ? exact : all)[0];
      if (!cand) continue;
      const lines = fs.readFileSync(path.join(root, cand), 'utf8').split('\n');
      const firstLine = (lines[c.startL - 1] ?? '').trim().slice(0, 100);
      out.push({ relPath, citeLine: c.citeLine, target: `${cand}:${c.startL}`, firstLine });
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

function main() {
  const { showCites, files } = parseArgs(process.argv.slice(2));
  const opts = { repoRoot: REPO_ROOT, files: files.length ? files : undefined };
  const { findings, advisories, checked, scanned } = runVerifyQuotes(opts);
  const cites = listCiteContents(opts);

  console.log(`verify:quotes — ${cites.length} path:line cite(s) across ${scanned} file(s) (--show-cites for the listing).`);
  if (showCites) for (const c of cites) console.log(`  - ${c.relPath}:${c.citeLine} -> ${c.target} — "${c.firstLine}"`);

  if (advisories.length) {
    console.error(`verify:quotes — ${advisories.length} advisory (path-introduced, not in the named file):`);
    for (const a of advisories) console.error(`  - ${a.relPath}:${a.line} — "${a.snippet}…" — ${a.reason}`);
  }

  if (findings.length === 0) {
    console.log(
      `verify:quotes PASS — ${checked} quote(s) verified across ${scanned} file(s).` +
        (advisories.length ? ` (${advisories.length} advisory.)` : ''),
    );
    return;
  }
  console.error(`verify:quotes FAIL — ${findings.length} not found:`);
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
