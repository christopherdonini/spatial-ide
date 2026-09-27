#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors
//
// Refuses a profile path (this machine's or any other real account's) from landing in a commit's
// staged content, staged path names, or commit message. See
// scripts/hooks/EXPOSURE-PROFILE-PATHS-PREREGISTRATION.md §2c for the full specification this
// file implements. Node standard library only.
//
// It never returns or prints a matched segment (§1, "may not claim" / §8 item 4).

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// ---------------------------------------------------------------------------
// §2c core matcher
// ---------------------------------------------------------------------------

const INVENTED_NAMES = ['someone', 'someone2', 'x', 'josé', 'someuser'];
const MACHINE_ACCOUNTS = ['runner', 'user', 'root'];

const EIGHT_DOT_THREE = /^[A-Za-z0-9]{1,6}~[0-9]+$/;

// A "segment" run: stops at a separator, whitespace, or common closing/quoting punctuation.
const SEGMENT_CHARS = /^[^\s\\/'"`)\]},;<>]*/;

function isListed(list, segment) {
  const lower = segment.toLowerCase();
  return list.some((n) => n.toLowerCase() === lower);
}

function extractSegment(text, start) {
  if (start >= text.length) return { segment: '', end: start };
  const ch = text[start];
  if (ch === '\n' || ch === '\r') return { segment: '', end: start };
  if (ch === '<') {
    const lineEnd = text.indexOf('\n', start);
    const searchEnd = lineEnd === -1 ? text.length : lineEnd;
    const close = text.indexOf('>', start);
    if (close !== -1 && close < searchEnd) {
      return { segment: text.slice(start, close + 1), end: close + 1 };
    }
  }
  const m = SEGMENT_CHARS.exec(text.slice(start));
  const segment = m ? m[0] : '';
  return { segment, end: start + segment.length };
}

function classifySegment(segment, localName) {
  if (EIGHT_DOT_THREE.test(segment)) {
    return { refused: true, formClass: '8.3' };
  }
  if (localName && segment.toLowerCase() === localName.toLowerCase()) {
    if (isListed(MACHINE_ACCOUNTS, segment)) {
      return { refused: false, formClass: null };
    }
    return { refused: true, formClass: 'local-profile' };
  }
  if (
    segment === '' ||
    segment === '...' ||
    segment === '…' ||
    /^public$/i.test(segment) ||
    segment.startsWith('$') ||
    segment.startsWith('%') ||
    (segment.startsWith('<') && segment.endsWith('>'))
  ) {
    return { refused: false, formClass: null };
  }
  if (isListed(INVENTED_NAMES, segment) || isListed(MACHINE_ACCOUNTS, segment)) {
    return { refused: false, formClass: null };
  }
  return { refused: true, formClass: 'unlisted-segment' };
}

// Windows drive form: (drive letter or /c/) + separator run + "Users" + optional separator run,
// then a segment. Requires a boundary before the drive letter so "aC:\Users\x" doesn't parse the
// trailing "C:" as a drive.
const WINDOWS_ROOT = /(?<![A-Za-z0-9])(?:[A-Za-z]:|\/c)(?:\\{1,2}|\/)+users(?:\\{1,2}|\/)*/gi;

// POSIX form: a POSIX root of 2c (iv). The root (leading slash included) counts only at a path
// start: start of text, or after a character outside [A-Za-z0-9._~-].
const POSIX_ROOT = /(?<![A-Za-z0-9._~-])\/(?:users|home)\//gi;

// 2c (ii), read to its letter (4.1(g)): an 8.3 segment after "Users" is refused with or without a
// drive -- either at a path start ((iv)'s boundary) or after a separator, then zero or more
// separators, then the 8.3 grammar. WINDOWS_ROOT (drive-anchored) and POSIX_ROOT (leading "/")
// already cover the drive/POSIX-anchored cases; this is the drive-less remainder. The lookbehind
// is (iv)'s own boundary, which already covers "after a separator" since a separator character is
// itself outside [A-Za-z0-9._~-].
const USERS_EIGHT_DOT_THREE_ROOT = /(?<![A-Za-z0-9._~-])users(?:\\{1,2}|\/)*/gi;

function lineNumberAt(text, index) {
  let line = 1;
  for (let i = 0; i < index; i++) {
    if (text[i] === '\n') line++;
  }
  return line;
}

/**
 * Returns every match (refused or not) with absolute offsets, for use by both the scanner and
 * the redact modes. Does not print or return the segment text to any external caller of scanText;
 * callers that need the segment (--redact-segment) use this internal function directly.
 */
function findMatches(text, localName) {
  const matches = [];
  for (const root of [WINDOWS_ROOT, POSIX_ROOT]) {
    root.lastIndex = 0;
    let m;
    while ((m = root.exec(text)) !== null) {
      const rootStart = m.index;
      const rootEnd = m.index + m[0].length;
      const { segment, end } = extractSegment(text, rootEnd);
      const { refused, formClass } = classifySegment(segment, localName);
      matches.push({
        rootStart,
        rootEnd,
        segmentStart: rootEnd,
        segmentEnd: end,
        segment,
        refused,
        formClass,
        line: lineNumberAt(text, rootStart),
      });
    }
  }
  // 2c (ii)'s drive-less remainder (4.1(g)): an 8.3 segment right after "Users", with no drive.
  {
    USERS_EIGHT_DOT_THREE_ROOT.lastIndex = 0;
    let m;
    while ((m = USERS_EIGHT_DOT_THREE_ROOT.exec(text)) !== null) {
      const rootStart = m.index;
      const rootEnd = m.index + m[0].length;
      const { segment, end } = extractSegment(text, rootEnd);
      if (!EIGHT_DOT_THREE.test(segment)) continue;
      matches.push({
        rootStart,
        rootEnd,
        segmentStart: rootEnd,
        segmentEnd: end,
        segment,
        refused: true,
        formClass: '8.3',
        line: lineNumberAt(text, rootStart),
      });
    }
  }
  // 2c (iii), including the flattened form of 4.1(f): "Users" or "home", then a run of zero or
  // more of \, / and -, then localName (case-insensitive), then the end of the text or a
  // character that is not a letter or digit. A cross-cutting rule, independent of the path-start
  // boundary (i)/(iv) carry -- it exists to catch the local profile's own name landing next to
  // "Users" or "home" in any form, flattened included.
  if (localName) {
    const escapedLocalName = localName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const localNameRoot = new RegExp(`(?:users|home)(?:[\\\\/-])*(${escapedLocalName})(?![A-Za-z0-9])`, 'gi');
    let m;
    while ((m = localNameRoot.exec(text)) !== null) {
      const rootStart = m.index;
      const segment = m[1];
      const segmentEnd = m.index + m[0].length;
      const segmentStart = segmentEnd - segment.length;
      if (isListed(MACHINE_ACCOUNTS, segment)) continue; // S7: spared even under the local name
      matches.push({
        rootStart,
        rootEnd: segmentStart,
        segmentStart,
        segmentEnd,
        segment,
        refused: true,
        formClass: 'local-profile',
        line: lineNumberAt(text, rootStart),
      });
    }
  }
  matches.sort((a, b) => a.rootStart - b.rootStart);
  // Dedupe overlapping matches (the Windows and POSIX patterns can both fire on the same span,
  // e.g. "C:/Users/someone" is both a drive form and a boundary-valid "/Users/" form).
  const deduped = [];
  for (const m of matches) {
    const dup = deduped.some((d) => d.segmentStart === m.segmentStart && d.segmentEnd === m.segmentEnd);
    if (!dup) deduped.push(m);
  }
  return deduped;
}

/**
 * scanText(text, { localName }) -> [{ line, class }]
 * Never returns or prints the matched segment (§1, §8 item 4).
 */
export function scanText(text, { localName } = {}) {
  return findMatches(text, localName)
    .filter((m) => m.refused)
    .map((m) => ({ line: m.line, class: m.formClass }));
}

// ---------------------------------------------------------------------------
// §2c canary
// ---------------------------------------------------------------------------

function buildCanaryStrings() {
  const usersWord = ['U', 's', 'e', 'r', 's'].join('');
  const homeWord = ['h', 'o', 'm', 'e'].join('');
  const canarySeg = ['c', 'a', 'n', 'a', 'r', 'y', 'Z', 'z'].join('');
  const shortSeg = ['C', 'A', 'N', 'A'].join('') + '~1';
  const windowsForm = `C:\\${usersWord}\\${canarySeg}\\rest`;
  const eightDotThreeForm = `C:\\${usersWord}\\${shortSeg}\\rest`;
  const homeForm = `/${homeWord}/${canarySeg}/rest`;
  return { windowsForm, eightDotThreeForm, homeForm };
}

/**
 * checkCanary(scan) runs the given scan function against three invented, run-time-built profile
 * paths and returns true only if all three are found. Must run before any result of `scan` counts.
 */
export function checkCanary(scan) {
  const { windowsForm, eightDotThreeForm, homeForm } = buildCanaryStrings();
  const localName = ['n', 'o', 'b', 'o', 'd', 'y', 'Q'].join('');
  const a = scan(windowsForm, { localName });
  const b = scan(eightDotThreeForm, { localName });
  const c = scan(homeForm, { localName });
  return a.length > 0 && b.length > 0 && c.length > 0;
}

// ---------------------------------------------------------------------------
// §2c redact / redact-segment
// ---------------------------------------------------------------------------

const WINDOWS_TOKEN = '%USERPROFILE%';
const POSIX_TOKEN = '$HOME';

/**
 * Replaces each profile root (drive/Users/segment, or the POSIX root/segment) with its token
 * (§7). Every byte after the segment is kept. Returns { output, count }.
 */
export function redactRoots(text, localName) {
  const matches = findMatches(text, localName).filter((m) => m.refused);
  let output = '';
  let cursor = 0;
  let count = 0;
  for (const m of matches) {
    const isWindows = /^[A-Za-z]:|^\/c\//.test(text.slice(m.rootStart, m.rootStart + 4));
    output += text.slice(cursor, m.rootStart);
    output += isWindows ? WINDOWS_TOKEN : POSIX_TOKEN;
    cursor = m.segmentEnd;
    count++;
  }
  output += text.slice(cursor);
  return { output, count };
}

/**
 * Replaces each refused segment alone with `<redacted:profile>`, keeping every other byte
 * (the root text and everything after the segment). Returns { output, count, ok }. ok is false if
 * a finding cannot be reduced to a segment (should not occur given the matcher's own structure,
 * but guarded per §2c).
 */
export function redactSegments(text, localName) {
  const matches = findMatches(text, localName).filter((m) => m.refused);
  let output = '';
  let cursor = 0;
  let count = 0;
  let ok = true;
  for (const m of matches) {
    if (m.segmentStart >= m.segmentEnd && m.segment === '') {
      ok = false;
      continue;
    }
    output += text.slice(cursor, m.segmentStart);
    output += '<redacted:profile>';
    cursor = m.segmentEnd;
    count++;
  }
  output += text.slice(cursor);
  return { output, count, ok };
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function runGit(args, cwd) {
  try {
    return execFileSync('git', args, { cwd, encoding: 'utf8', maxBuffer: 1024 * 1024 * 64 });
  } catch {
    return null;
  }
}

function parseAddedLines(diffText) {
  // Parses unified diff (-U0) output into { file, line, text }[] for added lines only.
  //
  // 4.1(d): stateful. A `+++ ` or `--- ` line counts as a header only between a `diff --git` line
  // and that file's first `@@`; once a hunk has started, every `+`-prefixed line is added content,
  // even one that (after stripping its leading diff `+`) itself begins with `++` or `--` and so
  // renders as a line starting `+++ ` or `--- ` in the raw diff text (F1: an added line beginning
  // `++` was never scanned under the old, unconditional check).
  const out = [];
  let currentFile = null;
  let newLine = null;
  let inFileHeader = false;
  const lines = diffText.split('\n');
  for (const raw of lines) {
    if (raw.startsWith('diff --git ')) {
      inFileHeader = true;
      currentFile = null;
      newLine = null;
      continue;
    }
    if (inFileHeader && raw.startsWith('@@') === false) {
      if (raw.startsWith('+++ ')) {
        const p = raw.slice(4).trim();
        currentFile = p === '/dev/null' ? null : p.replace(/^b\//, '');
        continue;
      }
      if (raw.startsWith('--- ')) {
        continue;
      }
      // Other header lines (index, mode changes, rename/copy, "Binary files ... differ") carry no
      // added content and are simply skipped while still inside the file header.
      continue;
    }
    if (raw.startsWith('@@')) {
      const m = /@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/.exec(raw);
      newLine = m ? parseInt(m[1], 10) : null;
      inFileHeader = false;
      continue;
    }
    if (raw.startsWith('+')) {
      if (currentFile && newLine != null) {
        out.push({ file: currentFile, line: newLine, text: raw.slice(1) });
        newLine++;
      }
      continue;
    }
    if (raw.startsWith('-')) {
      continue; // removed lines don't advance newLine
    }
  }
  return out;
}

function scanAddedLines(addedLines, localName) {
  const findings = [];
  for (const { file, line, text } of addedLines) {
    const r = scanText(text, { localName });
    for (const f of r) {
      findings.push({ file, line, class: f.class });
    }
  }
  return findings;
}

function isMergeInProgress(cwd) {
  const r = runGit(['rev-parse', '-q', '--verify', 'MERGE_HEAD'], cwd);
  return r !== null && r.trim().length > 0;
}

function getMergeParents(cwd) {
  const parents = ['HEAD'];
  if (isMergeInProgress(cwd)) parents.push('MERGE_HEAD');
  return parents;
}

function stagedAddedLinesAgainst(parent, cwd) {
  // Omit the explicit parent for plain HEAD: on the repository's very first commit HEAD does not
  // resolve yet, and `git diff --cached` alone already compares the index to the empty tree in
  // that case. An explicit MERGE_HEAD is always passed (it only exists mid-merge, when HEAD
  // itself always resolves).
  const args = ['diff', '--cached', '--no-color', '--no-ext-diff', '--text', '-U0', '--diff-filter=ACMR'];
  if (parent !== 'HEAD') args.push(parent);
  const diff = runGit(args, cwd);
  if (diff === null) return null;
  return parseAddedLines(diff);
}

function cmdStaged(localName) {
  const cwd = process.cwd();
  const parents = getMergeParents(cwd);

  const perParentAdded = [];
  for (const parent of parents) {
    const added = stagedAddedLinesAgainst(parent, cwd);
    if (added === null) {
      console.error('aborted');
      process.exit(2);
    }
    perParentAdded.push(added);
  }

  // A line is refused only if it is new relative to every parent: keep only lines whose
  // (file, text) pair appears in every parent's added set.
  let candidateLines = perParentAdded[0];
  for (let i = 1; i < perParentAdded.length; i++) {
    const set = new Set(perParentAdded[i].map((l) => `${l.file}\u0000${l.text}`));
    candidateLines = candidateLines.filter((l) => set.has(`${l.file}\u0000${l.text}`));
  }

  const findings = scanAddedLines(candidateLines, localName);

  const nameZ = runGit(['diff', '--cached', '--name-only', '-z', '--diff-filter=ACMR'], cwd);
  if (nameZ === null) {
    console.error('aborted');
    process.exit(2);
  }
  const names = nameZ.split('\u0000').filter((s) => s.length > 0);
  for (const name of names) {
    const r = scanText(name, { localName });
    for (const f of r) {
      findings.push({ file: name, line: 0, class: f.class });
    }
  }

  return findings;
}

function cmdMessage(file, localName) {
  // 4.1(a): scans the whole message file. The hook receives only the message-file path, so it
  // cannot know whether git will cut the message at a scissors line under `-F` -- at git 2.49.0,
  // `-F` keeps the lines below it. Declared limit: a verbose diff below a scissors line that
  // carries a profile path still refuses the commit.
  let content;
  try {
    content = fs.readFileSync(file, 'utf8');
  } catch {
    console.error('aborted');
    process.exit(2);
  }
  const r = scanText(content, { localName });
  return r.map((f) => ({ file, line: f.line, class: f.class }));
}

// 4.1(e): nothing the CLI prints carries a refused segment. Every path it prints goes through
// redactSegments(path, localName). Where a finding in the path itself cannot be reduced to a
// segment (ok === false, a declared guard case per redactSegments' own doc comment), the path is
// printed as `#<n>`, its argument index -- a declared value; for --redact/--redact-segment that is
// the file's 1-based position among the CLI's file arguments, and for a finding it is the finding's
// 1-based position in the list being printed.
function safePrintablePath(rawPath, localName, argIndex) {
  const { output, ok } = redactSegments(rawPath, localName);
  return ok ? output : `#${argIndex}`;
}

function cmdRedact(files, localName) {
  files.forEach((file, i) => {
    const text = fs.readFileSync(file, 'utf8');
    const { output, count } = redactRoots(text, localName);
    fs.writeFileSync(file, output);
    console.log(`${safePrintablePath(file, localName, i + 1)}: ${count}`);
  });
}

function cmdRedactSegment(files, localName) {
  let anyFail = false;
  files.forEach((file, i) => {
    const text = fs.readFileSync(file, 'utf8');
    const { output, count, ok } = redactSegments(text, localName);
    fs.writeFileSync(file, output);
    console.log(`${safePrintablePath(file, localName, i + 1)}: ${count}`);
    if (!ok) anyFail = true;
  });
  if (anyFail) process.exit(1);
}

function printFindings(findings, localName) {
  findings.forEach((f, i) => {
    console.error(`${safePrintablePath(f.file, localName, i + 1)}:${f.line} ${f.class}`);
  });
}

// 4.1(c): on a clean scan, --staged and --message print exactly one stdout line, this declared
// value. The hooks fail closed on this exact line, not on exit status alone.
const CLEAN_LINE = 'profile-path-scan: clean';

function main() {
  const args = process.argv.slice(2);
  const localName = path.basename(os.homedir());

  if (!checkCanary(scanText)) {
    console.error('canary not found');
    process.exit(3);
  }

  try {
    if (args[0] === '--staged') {
      const findings = cmdStaged(localName);
      if (findings.length > 0) {
        printFindings(findings, localName);
        process.exit(1);
      }
      console.log(CLEAN_LINE);
      process.exit(0);
    }
    if (args[0] === '--message') {
      const file = args[1];
      const findings = cmdMessage(file, localName);
      if (findings.length > 0) {
        printFindings(findings, localName);
        process.exit(1);
      }
      console.log(CLEAN_LINE);
      process.exit(0);
    }
    if (args[0] === '--redact') {
      cmdRedact(args.slice(1), localName);
      process.exit(0);
    }
    if (args[0] === '--redact-segment') {
      cmdRedactSegment(args.slice(1), localName);
      return;
    }
    console.error('aborted');
    process.exit(2);
  } catch (e) {
    console.error('aborted');
    process.exit(2);
  }
}

// 4.1(b): compares realpaths (through any symlink/junction), case-folded on win32, so the CLI
// entry does not fail open when invoked through a link or a path containing a space.
function resolveRealpathNative(p) {
  try {
    return fs.realpathSync.native(p);
  } catch {
    return null;
  }
}

function computeIsMain() {
  if (!process.argv[1]) return false;
  const argvReal = resolveRealpathNative(process.argv[1]);
  const moduleReal = resolveRealpathNative(fileURLToPath(import.meta.url));
  if (argvReal === null || moduleReal === null) return false;
  if (process.platform === 'win32') {
    return argvReal.toLowerCase() === moduleReal.toLowerCase();
  }
  return argvReal === moduleReal;
}

const isMain = computeIsMain();

if (isMain) {
  main();
}
