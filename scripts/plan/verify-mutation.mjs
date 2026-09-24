#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// scripts/plan/verify-mutation.mjs — AUTONOMY.md Appendix A3 (the human, 2026-09-14): "the
// mutation-per-new-test rule ... automated ... run as a pre-gate self-check."
//
// THE RULE it approximates: a new test earns its keep only if a MUTATION was recorded showing the
// test fails when the behaviour it guards is broken (docs/09 / the preregistration discipline). The
// fully-automatic form — actually re-running each test against a mutated build — is out of scope for
// a stdlib pre-gate check. This delivers the tractable HEURISTIC the human's directive allows.
//
// WHAT THIS DOES (a heuristic, stated exactly): given a base and a head ref (`--base`, `--head`;
// defaults `origin/main` and `HEAD`), it finds every test that is NEW in the diff — a Rust
// `#[test]`-attributed `fn`, or a JavaScript/TypeScript `test('...')` / `it('...')` — whose
// declaration line falls inside an added range of `git diff base...head`. For each new test it looks
// for a recorded MUTATION that NAMES it: the test's name (or description) appearing within 500
// characters of the word "mutation" in EITHER (1) a preregistration changed in the same diff (the
// product-test convention: a "Mutation" line in a Results section), OR (2) the changed test file
// itself (this repo's convention for stdlib scripts: a `RECORDED MUTATION` comment naming a test).
// It prints every new test and whether a mutation names it, and exits non-zero when ANY new test has
// NO such mention.
//
// WHAT THIS DOES NOT GUARANTEE (disclosed, load-bearing): it does NOT run the mutation, so it cannot
// confirm the test actually FAILS under it — only that a mutation is recorded by name. It does not
// understand one-mutation-per-file batching: if a file's mutation names only one of several new
// tests, the others are reported as lacking a mutation (which is the strict reading of "per new
// test"; treat the report as a checklist, not a verdict). It only sees mutations recorded in a
// CHANGED preregistration or the changed test file — a mutation logged elsewhere is invisible. When
// the base ref cannot be resolved (a shallow clone), it reports that and exits 0 rather than failing
// a gate it could not compute. Node's standard library only.

import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(here, '..', '..');

const MUTATION_WINDOW = 500;

// Bounded look-ahead for an unterminated `#[...]` attribute (governance/verify-mutation-multiline-attrs
// Amendment 2, on RULED 2026-09-24 round 17 item 9): this repo's multi-line attributes (an
// `#[ignore = "..."]` reason wrapped once or twice) never run past a handful of lines, so 20 gives
// generous headroom while bounding the worst case to a fixed window instead of the rest of the file.
const MULTILINE_ATTR_LOOKAHEAD = 20;

function git(args, cwd) {
  try {
    return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  } catch {
    return null;
  }
}

function gitShow(cwd, ref, rel) {
  return git(['show', `${ref}:${rel}`], cwd);
}

/** Parse `git diff --unified=0` into Map<file, [[startLine, endLine], ...]> of ADDED new-file ranges. */
export function parseAddedRanges(diff) {
  const map = new Map();
  let cur = null;
  for (const line of diff.split('\n')) {
    const fm = /^\+\+\+ (?:b\/)?(.+)$/.exec(line);
    if (fm) {
      cur = fm[1] === '/dev/null' ? null : fm[1];
      if (cur && !map.has(cur)) map.set(cur, []);
      continue;
    }
    const hm = /^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/.exec(line);
    if (hm && cur) {
      const start = Number(hm[1]);
      const count = hm[2] === undefined ? 1 : Number(hm[2]);
      if (count > 0) map.get(cur).push([start, start + count - 1]);
    }
  }
  return map;
}

const RUST_TEST_ATTR = /#\[[^\]]*\btest\b[^\]]*\]/;
const RUST_FN = /^\s*(?:pub\s+)?(?:async\s+)?(?:unsafe\s+)?fn\s+([a-z_][A-Za-z0-9_]*)/;
const JS_TEST = /^\s*(?:await\s+)?(?:test|it)\s*\(\s*(['"`])(.+?)\1/;

/**
 * Drop the contents of string literals before bracket-counting — a `"…"` (with `\` escapes) or a
 * raw `r"…"`/`r#"…"#` — so a bracket inside an attribute's string value (e.g. `#[ignore = "a [b"]`)
 * is never mistaken for the attribute's own delimiter. `state` (`{inString, rawHashes}`) is CARRIED
 * across calls so a string that opens on one line and closes on a later one is still tracked.
 */
function stripStringLiterals(l, state) {
  let out = '';
  let i = 0;
  while (i < l.length) {
    if (state.rawHashes !== null) {
      const close = l.indexOf(`"${'#'.repeat(state.rawHashes)}`, i);
      if (close === -1) return out;
      i = close + state.rawHashes + 1;
      state.rawHashes = null;
      continue;
    }
    if (state.inString) {
      if (l[i] === '\\') { i += 2; continue; }
      if (l[i] === '"') state.inString = false;
      i++;
      continue;
    }
    const raw = /^r(#*)"/.exec(l.slice(i));
    if (raw) { i += raw[0].length; state.rawHashes = raw[1].length; continue; }
    if (l[i] === '"') { state.inString = true; i++; continue; }
    out += l[i];
    i++;
  }
  return out;
}

function netBracketDelta(l, state) {
  let d = 0;
  for (const ch of stripStringLiterals(l, state)) {
    if (ch === '[') d++;
    else if (ch === ']') d--;
  }
  return d;
}

/**
 * Re-read `lines[fromIdx..toIdx]` (inclusive) under `origin/main`'s own single-line rules — no
 * attribute-depth tracking at all — starting from `startPending`. Pushes any test this window
 * contains into `tests`. Returns the resulting `pending` state for the caller to resume with.
 * This is the REWIND used when the bounded look-ahead gives up on an unterminated attribute: the
 * window is re-read, not skipped, so a test that fell inside it is not lost.
 */
function rewindWindowUnderMainRules(rel, lines, fromIdx, toIdx, startPending, tests) {
  let p = startPending;
  for (let j = fromIdx; j <= toIdx; j++) {
    const lj = lines[j];
    const fn = RUST_FN.exec(lj);
    if (fn) {
      if (p) tests.push({ name: fn[1], line: j + 1, kind: 'rust' });
      p = false;
      continue;
    }
    if (RUST_TEST_ATTR.test(lj)) { p = true; continue; }
    if (/^\s*#!?\[/.test(lj) || /^\s*\/\//.test(lj) || lj.trim() === '') continue;
    p = false;
  }
  return p;
}

/** Every declared test in a file's text: Rust `#[test] fn name`, or JS `test('...')`/`it('...')`. */
export function findTestsInFile(rel, content) {
  // survive a CRLF checkout (AI_DEVELOPMENT.md eol class): normalise before line-splitting.
  const lines = String(content).replace(/\r\n/g, '\n').split('\n');
  const tests = [];
  if (rel.endsWith('.rs')) {
    let pending = false;
    let attrDepth = 0; // > 0 while inside a `#[...]` attribute left unclosed on its opening line
    let attrStartLine = 0;
    let attrStartIdx = 0;
    let pendingBeforeAttr = false; // `pending` as it stood right before this attribute opened
    let strState = { inString: false, rawHashes: null };
    for (let i = 0; i < lines.length; i++) {
      const l = lines[i];
      if (attrDepth > 0) {
        // a continuation line of an unterminated attribute (e.g. a multi-line `#[ignore = "..."]`
        // string) is part of that attribute, not "any other code line" — it never clears `pending` —
        // for at most MULTILINE_ATTR_LOOKAHEAD continuation lines. If it is still open after that
        // many lines, the scanner does not simply resume after the window (that would still lose any
        // test the window itself contains): it REWINDS to the attribute's own opening line and
        // re-reads the whole window under `origin/main`'s single-line rules, starting from the
        // `pending` value that held before the attribute opened, printing a finding naming the
        // opening line either way.
        attrDepth += netBracketDelta(l, strState);
        if (attrDepth <= 0) {
          attrDepth = 0;
          console.error(
            `verify:mutation note — ${rel}:${attrStartLine} multi-line attribute closed at line ${i + 1}; kept pending test state across it`,
          );
        } else if (i + 1 - attrStartLine >= MULTILINE_ATTR_LOOKAHEAD) {
          console.error(
            `verify:mutation finding — ${rel}:${attrStartLine} attribute did not close within ${MULTILINE_ATTR_LOOKAHEAD} line(s); rewinding to re-read the window under single-line rules`,
          );
          pending = rewindWindowUnderMainRules(rel, lines, attrStartIdx, i, pendingBeforeAttr, tests);
          attrDepth = 0;
        }
        continue;
      }
      const fn = RUST_FN.exec(l);
      if (fn) {
        if (pending) tests.push({ name: fn[1], line: i + 1, kind: 'rust' });
        pending = false;
        continue;
      }
      if (RUST_TEST_ATTR.test(l)) { pending = true; continue; }
      if (/^\s*#!?\[/.test(l)) {
        strState = { inString: false, rawHashes: null };
        const delta = netBracketDelta(l, strState);
        if (delta > 0) {
          attrDepth = delta;
          attrStartLine = i + 1;
          attrStartIdx = i;
          pendingBeforeAttr = pending;
        }
        // stay "pending" across this attribute line whether it closed on this line or not.
        continue;
      }
      // stay "pending" across doc/line comments and blank lines between the `#[test]` and its
      // `fn`; any other code line clears it.
      if (/^\s*\/\//.test(l) || l.trim() === '') continue;
      pending = false;
    }
    if (attrDepth > 0) {
      // end of file reached inside the window: the same rewind, over the window that remains
      // (attrStartIdx..last line), not a note — this is a finding, the same as the bound case.
      console.error(
        `verify:mutation finding — ${rel}:${attrStartLine} attribute did not close by end of file; rewinding to re-read the window under single-line rules`,
      );
      rewindWindowUnderMainRules(rel, lines, attrStartIdx, lines.length - 1, pendingBeforeAttr, tests);
    }
  } else if (/\.(mjs|cjs|js|ts|tsx|jsx)$/.test(rel)) {
    for (let i = 0; i < lines.length; i++) {
      const m = JS_TEST.exec(lines[i]);
      if (m) tests.push({ name: m[2], line: i + 1, kind: 'js' });
    }
  }
  return tests;
}

/** True if `name` occurs within MUTATION_WINDOW chars of the word "mutation" in any source text. */
export function hasMutationMention(name, texts) {
  for (const text of texts) {
    let from = 0;
    let idx;
    while ((idx = text.indexOf(name, from)) !== -1) {
      const lo = Math.max(0, idx - MUTATION_WINDOW);
      const hi = Math.min(text.length, idx + name.length + MUTATION_WINDOW);
      if (/mutation/i.test(text.slice(lo, hi))) return true;
      from = idx + name.length;
    }
  }
  return false;
}

const TEST_GLOBS = ['*.rs', '*.test.mjs', '*.test.ts', '*.test.tsx', '*.test.js', '*.test.jsx'];

export function runVerifyMutation({ repoRoot, base, head } = {}) {
  const root = repoRoot ?? REPO_ROOT;
  const b = base ?? 'origin/main';
  const h = head ?? 'HEAD';
  if (git(['rev-parse', '--verify', b], root) === null) {
    return { error: `base ref "${b}" does not resolve (shallow clone? run with fetch-depth 0)`, tests: [], findings: [] };
  }

  const diff = git(['diff', '--unified=0', `${b}...${h}`, '--', ...TEST_GLOBS], root);
  if (diff === null) return { error: `git diff ${b}...${h} failed`, tests: [], findings: [] };
  const ranges = parseAddedRanges(diff);

  const changedNames = git(['diff', '--name-only', `${b}...${h}`], root) ?? '';
  const changedPregs = changedNames.split('\n').filter((f) => /PREREGISTRATION.*\.md$/.test(f));
  const pregTexts = changedPregs.map((f) => gitShow(root, h, f)).filter((t) => t !== null);

  const tests = [];
  const findings = [];
  for (const [rel, rs] of ranges) {
    const content = gitShow(root, h, rel);
    if (content === null) continue;
    const fileTests = findTestsInFile(rel, content);
    for (const t of fileTests) {
      if (!rs.some(([a, e]) => t.line >= a && t.line <= e)) continue;
      const has = hasMutationMention(t.name, [content, ...pregTexts]);
      const entry = { relPath: rel, name: t.name, line: t.line, kind: t.kind, hasMutation: has };
      tests.push(entry);
      if (!has) findings.push(entry);
    }
  }
  return { error: null, tests, findings, base: b, head: h };
}

function parseArgs(argv) {
  const args = { base: null, head: null, quiet: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--base') args.base = argv[++i];
    else if (a === '--head') args.head = argv[++i];
    else if (a === '--quiet') args.quiet = true;
    else throw new Error(`unknown argument: ${a}`);
  }
  return args;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const { error, tests, findings } = runVerifyMutation({ repoRoot: REPO_ROOT, base: args.base, head: args.head });
  if (error) {
    console.error(`verify:mutation SKIPPED — ${error}`);
    return; // exit 0: could not compute, so nothing to gate.
  }
  if (!args.quiet) {
    for (const t of tests) {
      const mark = t.hasMutation ? 'ok  ' : 'MISS';
      console.error(`  ${mark} ${t.relPath}:${t.line} — ${t.kind} test ${JSON.stringify(t.name)}`);
    }
  }
  if (findings.length === 0) {
    console.log(`verify:mutation PASS — all ${tests.length} new test(s) have a recorded mutation naming them.`);
    return;
  }
  console.error(`verify:mutation FAIL — ${findings.length} of ${tests.length} new test(s) have no recorded mutation naming them.`);
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
