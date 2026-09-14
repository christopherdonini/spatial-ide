#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// scripts/plan/verify-cites.mjs — AUTONOMY.md Appendix A3 (the human, 2026-09-14): "every path:line
// reference in docs and comments resolved against the tree in CI ... run as pre-gate self-checks so
// gates fail only on semantics."
//
// WHAT THIS SCRIPT DOES: it scans a set of tracked text files for `path:line` and `path:line-line`
// references (e.g. `engine/src/pool.rs:99`, `WorkingCanvas.tsx:805`, `foo.ts:158-167`) and resolves
// EACH against the working tree: the referenced file must exist AND the cited line (or, for a range,
// both endpoints) must be within that file's line count. Every reference that does NOT resolve is
// printed with the citing `file:line` and the bad target; the process exits 1 if any reference is
// unresolved, 0 if all resolve.
//
// DEFAULT FILE SET (override with `--files <glob>`):
//   - every tracked `*.md`               — the WHOLE file is scanned (prose citations count).
//   - every tracked `*.rs *.ts *.tsx *.mjs *.js`  — only text inside a COMMENT is scanned (a
//     `/* */` block or a `//` run), never a string literal or live code, so `foo.ts:158` written as
//     an actual object key or slice in code is not mistaken for a citation.
//
// THE RECOGNIZER (documented here, TESTED in verify-cites.test.mjs against tricky inputs):
//   A reference is a token matching  <path>:<digits>[-<digits>]  where <path> is "path-shaped":
//   it either contains a `/` OR ends in a known source/text extension (see KNOWN_EXTS). This is what
//   separates a real citation from the false positives the human named:
//     - a URL  `http://host:3000` / `https://h/x.rs:12`  — rejected: the path start is preceded by
//       `://` (a scheme), or the token begins `www.`.
//     - a time `12:30`            — rejected: `12` is neither `/`-bearing nor a known extension.
//     - a prose range `sections 3:5`, `line 4:6` — rejected for the same reason.
//     - a Windows drive `C:\dev`  — rejected: the `:` is not followed by a digit.
//   The `:` must be IMMEDIATELY followed by the first digit (no space), matching how every citation
//   in this tree is actually written; `pool.rs: 99` with a space is deliberately not recognized.
//
// TWO TIERS, so the GATE fails only on unambiguous in-tree defects and never on the tree's other,
// legitimate citation conventions (documented, TESTED):
//   - ROOTED (gated, exit 1): the path contains a `/` and its first segment is a real top-level
//     directory of this repo (`engine/`, `kernel/`, `frontends/`, `docs/`, `scripts/`, ...). Such a
//     path names ONE exact tracked file; it is a defect if it does not resolve, or if the cited line
//     exceeds that file's length. This is the class the human's directive is about — a stale cite to
//     `engine/src/pool.rs:99` after pool.rs shrank.
//   - LOOSE (advisory, printed but NOT gated unless `--strict`): a bare basename (`pool.rs:64`) or a
//     partial path (`src/main.ts:307`) or a first segment that is not a repo dir (a vendored crate,
//     `tauri-2.11.5/src/...`, `deck.gl/...`). These are resolved best-effort by suffix-matching the
//     tree; when such a guess lands on a real file whose length is SHORTER than the cited line, that
//     is printed as advice, but it does not fail the gate — the basename is ambiguous (our tree and a
//     vendored crate can both hold a `state.rs`), so failing on the guess would be a false positive.
//     A loose path that matches NOTHING in the tree is silently skipped (an external reference).
//   - Excluded entirely: the repo's documented "cite docs by number" convention `docs/NN:section`
//     (CLAUDE.md) — `docs/02:91` is doc 02 section 91, not file `docs/02` line 91.
//
// WHAT THIS DOES NOT CATCH (disclosed): a cited line that moved but stayed in range (this checks
// existence and bounds, not that line N still says what the citation implies); a citation with the
// right line count but the wrong file among same-basename siblings; and, by the tiering above, a
// stale LOOSE reference (it is surfaced as advice, never gated). Node's standard library only.

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(here, '..', '..');

export const KNOWN_EXTS = new Set([
  'rs', 'ts', 'tsx', 'js', 'jsx', 'mjs', 'cjs', 'md', 'json', 'jsonc',
  'yaml', 'yml', 'toml', 'css', 'scss', 'html', 'htm', 'sh', 'py', 'sql',
]);

// Extensions whose files are scanned COMMENTS-ONLY (source code); everything else in the set is
// scanned whole (markdown/config/text).
export const CODE_EXTS = new Set(['rs', 'ts', 'tsx', 'js', 'jsx', 'mjs', 'cjs']);

// path:line[-line]. The path token starts with an identifier char (never `/` or `:`) so a match can
// never begin inside a `://` scheme; it may contain `/ . _ + -` thereafter. The `:` is immediately
// followed by the first digit.
const TOKEN_RE = /([A-Za-z0-9_][A-Za-z0-9_./+-]*):(\d+)(?:-(\d+))?/g;

// A `/* ... */` block, or a run of consecutive `//` lines — same shape citationIntegrity.test.mjs
// uses. Over-inclusive (a `//` inside a string literal reads as a comment) which only ever scans a
// LITTLE extra, never less; a citation is a citation wherever it sits.
const COMMENT_BLOCK_RE = /\/\*[\s\S]*?\*\/|(?:^[ \t]*\/\/[^\n]*\n?)+/gm;

function extOf(p) {
  const m = /\.([A-Za-z0-9]+)$/.exec(p);
  return m ? m[1].toLowerCase() : null;
}

export function isPathShaped(p) {
  if (p.includes('/')) return true;
  const ext = extOf(p);
  return ext !== null && KNOWN_EXTS.has(ext);
}

function commentRanges(text) {
  const ranges = [];
  let m;
  COMMENT_BLOCK_RE.lastIndex = 0;
  while ((m = COMMENT_BLOCK_RE.exec(text))) {
    ranges.push([m.index, m.index + m[0].length]);
  }
  return ranges;
}

function inRanges(idx, ranges) {
  return ranges.some(([a, b]) => idx >= a && idx < b);
}

function lineOf(text, idx) {
  let n = 1;
  for (let i = 0; i < idx; i++) if (text.charCodeAt(i) === 10) n++;
  return n;
}

/**
 * Extract every citation-shaped token from `text`. When `commentsOnly` is true, only tokens whose
 * position falls inside a comment block are kept. Returns [{ pathRaw, startL, endL, citeLine, raw }].
 */
export function extractCitations(text, { commentsOnly } = {}) {
  const ranges = commentsOnly ? commentRanges(text) : null;
  const out = [];
  let m;
  TOKEN_RE.lastIndex = 0;
  while ((m = TOKEN_RE.exec(text))) {
    const idx = m.index;
    if (commentsOnly && !inRanges(idx, ranges)) continue;
    const before = text.slice(Math.max(0, idx - 3), idx);
    if (before.endsWith('://')) continue; // URL scheme: https://host/x.rs:12
    const pathRaw = m[1];
    if (/^www\./.test(pathRaw)) continue; // schemeless URL
    if (!isPathShaped(pathRaw)) continue;
    const startL = parseInt(m[2], 10);
    const endL = m[3] !== undefined ? parseInt(m[3], 10) : startL;
    out.push({ pathRaw, startL, endL, citeLine: lineOf(text, idx), raw: m[0] });
  }
  return out;
}

export function buildTrackedIndex(repoRoot) {
  const out = execFileSync('git', ['ls-files'], { cwd: repoRoot, encoding: 'utf8' });
  const files = out.split('\n').filter(Boolean);
  const set = new Set(files);
  const byBase = new Map();
  for (const f of files) {
    const base = f.slice(f.lastIndexOf('/') + 1);
    if (!byBase.has(base)) byBase.set(base, []);
    byBase.get(base).push(f);
  }
  return { files, set, byBase };
}

const HAS_EXT_RE = /\.[A-Za-z0-9]+$/;

/**
 * Resolve a written path to tracked repo-relative files. Returns { exact, all } where `exact` are
 * confident resolutions (the exact repo-relative path, or relative to the citing file's own
 * directory, plus a `.md` fallback for an extension-less path such as `docs/README` -> the tree's
 * `docs/README.md`), and `all` also includes best-effort basename suffix matches (a bare `pool.rs`
 * or a partial `scripts/render.test.mjs` resolving to the tracked file whose path ends with it).
 */
export function resolveRef(pathRaw, citingRel, index) {
  const p = pathRaw.replace(/^\.\//, '');
  const exact = new Set();
  const tryExact = (cand) => { if (index.set.has(cand)) exact.add(cand); };
  const withMd = (s) => (HAS_EXT_RE.test(s) ? [s] : [s, s + '.md']);
  // A path CONTAINING a `/` names a specific location, so a repo-root-relative match is confident.
  // A bare basename (`README.md`, `pool.rs`) is inherently ambiguous even when it happens to equal a
  // repo-root file, so it is treated as loose (best-effort suffix), never as a confident match.
  if (p.includes('/')) for (const c of withMd(p)) tryExact(c);
  const slash = citingRel.lastIndexOf('/');
  const citingDir = slash >= 0 ? citingRel.slice(0, slash) : '';
  const rel = path.posix.normalize((citingDir ? citingDir + '/' : '') + p);
  for (const c of withMd(rel)) tryExact(c);

  const all = new Set(exact);
  const base = p.slice(p.lastIndexOf('/') + 1);
  const bases = HAS_EXT_RE.test(p) ? [base] : [base, base + '.md'];
  for (const b of bases) {
    const want = b === base ? p : p + '.md';
    for (const f of index.byBase.get(b) || []) {
      if (f === want || f.endsWith('/' + want)) all.add(f);
    }
  }
  return { exact: [...exact], all: [...all] };
}

export function topDirsOf(index) {
  const dirs = new Set();
  for (const f of index.files) {
    const i = f.indexOf('/');
    if (i > 0) dirs.add(f.slice(0, i));
  }
  return dirs;
}

/** 'doc-number' (the `docs/NN` cite-by-number convention), 'rooted' (in-tree, gated), or 'loose'. */
export function classifyPath(pathRaw, topDirs) {
  if (/^docs\/\d{2}$/.test(pathRaw)) return 'doc-number';
  const i = pathRaw.indexOf('/');
  if (i > 0 && topDirs.has(pathRaw.slice(0, i))) return 'rooted';
  return 'loose';
}

const lineCountCache = new Map();
function lineCount(repoRoot, relPath) {
  const key = repoRoot + '\0' + relPath;
  if (!lineCountCache.has(key)) {
    const text = fs.readFileSync(path.join(repoRoot, relPath), 'utf8');
    // split('\n').length is line count, lenient by 1 for a trailing newline — leniency here can
    // only fail to flag a just-past-the-end cite, never wrongly flag a real one.
    lineCountCache.set(key, text.split('\n').length);
  }
  return lineCountCache.get(key);
}

/**
 * Classify one citation against the tree. Returns { status, reason? } where status is:
 *   'ok'         — resolves and the line is in range.
 *   'no-match'   — no tracked file matches the path at all.
 *   'oob-exact'  — an EXACT (confident) file resolves but the cited line exceeds it (a real defect).
 *   'oob-suffix' — only a best-effort basename guess resolves and its line is out of range (advice).
 */
export function checkCitation(cite, index, repoRoot) {
  const { exact, all } = resolveRef(cite.pathRaw, cite.relPath, index);
  if (all.length === 0) return { status: 'no-match' };
  const maxL = Math.max(cite.startL, cite.endL);
  const validStart = cite.startL >= 1 && cite.endL >= 1;
  const inRange = (cands) => validStart && cands.some((c) => maxL <= lineCount(repoRoot, c));
  if (exact.length) {
    if (inRange(exact)) return { status: 'ok' };
    const lc = Math.max(...exact.map((c) => lineCount(repoRoot, c)));
    return { status: 'oob-exact', reason: `line ${maxL} exceeds "${exact[0]}" (${lc} lines)` };
  }
  if (inRange(all)) return { status: 'ok' };
  const lc = Math.max(...all.map((c) => lineCount(repoRoot, c)));
  const which = all.length === 1 ? all[0] : `${all.length} same-basename candidates`;
  return { status: 'oob-suffix', reason: `line ${maxL} exceeds ${which} (${lc} lines)` };
}

function globToRegExp(glob) {
  // minimal: ** -> any, * -> non-slash, . escaped, everything else literal.
  let re = '';
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === '*') {
      if (glob[i + 1] === '*') { re += '.*'; i++; } else re += '[^/]*';
    } else if ('.+^${}()|[]\\'.includes(c)) re += '\\' + c;
    else re += c;
  }
  return new RegExp('^' + re + '$');
}

export function selectFiles(index, filesGlob) {
  if (filesGlob) {
    const re = globToRegExp(filesGlob);
    return index.files.filter((f) => re.test(f));
  }
  return index.files.filter((f) => {
    const ext = extOf(f);
    return ext === 'md' || CODE_EXTS.has(ext);
  });
}

/**
 * Runs the scan. Returns { gated, advisory, scanned }. Each finding is
 * { relPath, citeLine, target, reason }. `gated` findings drive the exit code; `advisory` findings
 * are printed for information only (see the two-tier note at the top of this file).
 */
export function runVerifyCites({ repoRoot, filesGlob } = {}) {
  const root = repoRoot ?? REPO_ROOT;
  const index = buildTrackedIndex(root);
  const topDirs = topDirsOf(index);
  const files = selectFiles(index, filesGlob);
  const gated = [];
  const advisory = [];
  for (const relPath of files) {
    const ext = extOf(relPath);
    const text = fs.readFileSync(path.join(root, relPath), 'utf8');
    const cites = extractCitations(text, { commentsOnly: CODE_EXTS.has(ext) });
    for (const cite of cites) {
      cite.relPath = relPath;
      const cls = classifyPath(cite.pathRaw, topDirs);
      if (cls === 'doc-number') continue;
      const at = { relPath, citeLine: cite.citeLine, target: cite.raw };
      const res = checkCitation(cite, index, root);
      if (res.status === 'ok') continue;
      if (res.status === 'no-match') {
        // A rooted path (first segment is a real top-level repo dir) that matches nothing is a
        // broken in-tree reference and is gated; a loose/external path that matches nothing is a
        // reference we cannot confirm is even meant to be in-tree, so it is skipped.
        if (cls === 'rooted') gated.push({ ...at, reason: `no tracked file matches "${cite.pathRaw}"` });
      } else if (res.status === 'oob-exact') {
        gated.push({ ...at, reason: res.reason });
      } else {
        advisory.push({ ...at, reason: res.reason });
      }
    }
  }
  return { gated, advisory, scanned: files.length };
}

function parseArgs(argv) {
  const args = { files: null, quiet: false, strict: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--files') args.files = argv[++i];
    else if (a === '--quiet') args.quiet = true;
    else if (a === '--strict') args.strict = true;
    else throw new Error(`unknown argument: ${a}`);
  }
  return args;
}

function line(f) {
  return `  - ${f.relPath}:${f.citeLine} — cites "${f.target}" — ${f.reason}`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const { gated, advisory, scanned } = runVerifyCites({ repoRoot: REPO_ROOT, filesGlob: args.files });
  const failing = args.strict ? [...gated, ...advisory] : gated;

  if (!args.quiet && advisory.length && !args.strict) {
    console.error(`verify:cites — ${advisory.length} advisory (loose/ambiguous, not gated):`);
    for (const f of advisory) console.error(line(f));
  }
  if (failing.length === 0) {
    console.log(
      `verify:cites PASS — every rooted (in-tree) path:line reference across ${scanned} file(s) resolves.` +
        (advisory.length ? ` (${advisory.length} loose reference(s) advised above.)` : ''),
    );
    return;
  }
  if (!args.quiet) {
    console.error(`verify:cites FAIL — ${failing.length} unresolved in-tree reference(s):`);
    for (const f of failing) console.error(line(f));
  } else {
    console.error(`verify:cites FAIL — ${failing.length} unresolved in-tree reference(s) across ${scanned} file(s).`);
  }
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
