// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors
//
// Tests for verify-cites.mjs — the path:line reference resolver (AUTONOMY.md Appendix A3).
//
// RECORDED MUTATION (per the mutation-per-new-test rule this piece also automates): changing the
// bounds test in checkCitation from `maxL <= lineCount(...)` to `maxL < lineCount(...)` makes
// `an_exact_reference_to_the_last_line_of_a_file_is_in_range` FAIL (a cite to the file's final line
// would be wrongly reported out of range) while the other tests still pass — that one test pins the
// inclusive upper bound.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import {
  isPathShaped,
  extractCitations,
  classifyPath,
  resolveRef,
  checkCitation,
  runVerifyCites,
} from './verify-cites.mjs';

function mkIndex(paths) {
  const set = new Set(paths);
  const byBase = new Map();
  for (const p of paths) {
    const b = p.slice(p.lastIndexOf('/') + 1);
    if (!byBase.has(b)) byBase.set(b, []);
    byBase.get(b).push(p);
  }
  return { files: paths, set, byBase };
}

function tmpTree(files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'verify-cites-'));
  for (const [rel, content] of Object.entries(files)) {
    const abs = path.join(dir, rel);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, content);
  }
  return dir;
}

// --- the recognizer -------------------------------------------------------------------------------

test('isPathShaped accepts a path with a slash and a bare known extension, rejects the rest', () => {
  assert.equal(isPathShaped('engine/src/pool.rs'), true); // has slash
  assert.equal(isPathShaped('pool.rs'), true); // known extension
  assert.equal(isPathShaped('WorkingCanvas.tsx'), true);
  assert.equal(isPathShaped('localhost'), false); // no slash, no extension
  assert.equal(isPathShaped('12'), false);
  assert.equal(isPathShaped('a.b'), false); // unknown extension
});

test('extractCitations recognizes real path:line and path:line-line references', () => {
  const cites = extractCitations('see engine/src/pool.rs:99 and foo.ts:158-167 here.');
  assert.equal(cites.length, 2);
  assert.deepEqual(
    cites.map((c) => [c.pathRaw, c.startL, c.endL]),
    [['engine/src/pool.rs', 99, 99], ['foo.ts', 158, 167]],
  );
});

test('extractCitations rejects URLs, times, prose ranges, and Windows drive paths (no false positives)', () => {
  assert.equal(extractCitations('https://example.com/x.rs:12 more text').length, 0, 'URL');
  assert.equal(extractCitations('the meeting at 12:30 today').length, 0, 'time');
  assert.equal(extractCitations('see sections 3:5 and line 4:6').length, 0, 'prose ranges');
  assert.equal(extractCitations('the file lives at C:\\dev\\spatial-ide').length, 0, 'windows drive');
  assert.equal(extractCitations('a ratio of 16:9 pixels').length, 0, 'aspect ratio');
});

test('extractCitations with commentsOnly scans comments but not code / string literals', () => {
  const src = [
    'const target = "foo.ts:1";        // a string literal in live code, not a comment',
    '// a real cite: engine/src/pool.rs:99',
    'callSomething(bar.ts:5);           /* engine/src/dataset.rs:42 in a block comment */',
  ].join('\n');
  const cites = extractCitations(src, { commentsOnly: true });
  const paths = cites.map((c) => `${c.pathRaw}:${c.startL}`).sort();
  // pool.rs (line comment) and dataset.rs (block comment) are kept; the "foo.ts:1" string literal
  // and the bar.ts:5 in live code are not.
  assert.deepEqual(paths, ['engine/src/dataset.rs:42', 'engine/src/pool.rs:99']);
});

test('extractCitations records the citing line number of each reference', () => {
  const cites = extractCitations('line one\nline two engine/src/pool.rs:99\nline three');
  assert.equal(cites.length, 1);
  assert.equal(cites[0].citeLine, 2);
});

// --- classification -------------------------------------------------------------------------------

test('classifyPath distinguishes doc-number, rooted, and loose paths', () => {
  const topDirs = new Set(['engine', 'docs', 'scripts']);
  assert.equal(classifyPath('docs/02', topDirs), 'doc-number'); // the cite-docs-by-number convention
  assert.equal(classifyPath('engine/src/pool.rs', topDirs), 'rooted');
  assert.equal(classifyPath('pool.rs', topDirs), 'loose'); // bare basename
  assert.equal(classifyPath('vendor/x/build.rs', topDirs), 'loose'); // first segment not a repo dir
});

// --- resolution & bounds --------------------------------------------------------------------------

test('resolveRef treats a slash-bearing path as exact but a bare basename as loose-only', () => {
  const index = mkIndex(['engine/src/pool.rs', 'README.md']);
  const bare = resolveRef('README.md', 'state/CUT-STATE.md', index);
  assert.deepEqual(bare.exact, [], 'a bare basename is never a confident/exact match');
  assert.deepEqual(bare.all, ['README.md']);
  const rooted = resolveRef('engine/src/pool.rs', 'docs/x.md', index);
  assert.deepEqual(rooted.exact, ['engine/src/pool.rs']);
});

test('resolveRef applies a .md fallback for an extension-less path (docs/README -> docs/README.md)', () => {
  const index = mkIndex(['docs/README.md']);
  const r = resolveRef('docs/README', 'RELEASE-0.1.md', index);
  assert.deepEqual(r.exact, ['docs/README.md']);
});

test('resolveRef resolves a citing-directory-relative path (scripts/x.mjs beside the citing file)', () => {
  const index = mkIndex(['renderer/bundle-viewer/scripts/render.test.mjs']);
  const r = resolveRef('scripts/render.test.mjs', 'renderer/bundle-viewer/ZOOM.md', index);
  assert.deepEqual(r.exact, ['renderer/bundle-viewer/scripts/render.test.mjs']);
});

test('an_exact_reference_to_the_last_line_of_a_file_is_in_range', () => {
  // three lines, no trailing newline: split('\n').length === 3.
  const dir = tmpTree({ 'engine/src/pool.rs': 'a\nb\nc' });
  const index = mkIndex(['engine/src/pool.rs']);
  const res = checkCitation({ pathRaw: 'engine/src/pool.rs', startL: 3, endL: 3, relPath: 'docs/x.md' }, index, dir);
  assert.equal(res.status, 'ok');
});

test('checkCitation flags an exact in-tree reference whose line exceeds the file (oob-exact)', () => {
  const dir = tmpTree({ 'engine/src/pool.rs': 'a\nb\nc' });
  const index = mkIndex(['engine/src/pool.rs']);
  const res = checkCitation({ pathRaw: 'engine/src/pool.rs', startL: 9, endL: 9, relPath: 'docs/x.md' }, index, dir);
  assert.equal(res.status, 'oob-exact');
  assert.match(res.reason, /line 9 exceeds/);
});

test('checkCitation reports a range endpoint past EOF, and a no-match, correctly', () => {
  const dir = tmpTree({ 'engine/src/pool.rs': 'a\nb\nc' });
  const index = mkIndex(['engine/src/pool.rs']);
  const range = checkCitation({ pathRaw: 'engine/src/pool.rs', startL: 2, endL: 8, relPath: 'x.md' }, index, dir);
  assert.equal(range.status, 'oob-exact');
  const missing = checkCitation({ pathRaw: 'protocol/SKP-V0.md', startL: 1, endL: 1, relPath: 'x.md' }, index, dir);
  assert.equal(missing.status, 'no-match');
});

test('checkCitation only advises (oob-suffix) for an ambiguous bare-basename match', () => {
  const dir = tmpTree({ 'frontends/shell/src-tauri/src/state.rs': 'a\nb' });
  const index = mkIndex(['frontends/shell/src-tauri/src/state.rs']);
  const res = checkCitation({ pathRaw: 'state.rs', startL: 60, endL: 69, relPath: 'RELEASE-0.1.md' }, index, dir);
  assert.equal(res.status, 'oob-suffix');
});

// --- end to end over a temp git tree --------------------------------------------------------------

function gitTree(files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'verify-cites-git-'));
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

test('runVerifyCites gates a broken rooted reference, ignores doc-number, advises a loose one', () => {
  const dir = gitTree({
    'engine/src/pool.rs': 'a\nb\nc\n',
    // a doc citing: a broken rooted path (gated), a doc-number (ignored), a valid rooted cite (ok),
    // and a bare-basename overshoot (advisory).
    'docs/notes.md': [
      'broken: engine/src/missing.rs:5',
      'convention: docs/02:91 is a doc-number cite',
      'good: engine/src/pool.rs:2',
      'loose: pool.rs:999',
    ].join('\n'),
  });
  const { gated, advisory } = runVerifyCites({ repoRoot: dir });
  assert.equal(gated.length, 1, JSON.stringify(gated));
  assert.match(gated[0].target, /engine\/src\/missing\.rs:5/);
  assert.equal(advisory.length, 1, JSON.stringify(advisory));
  assert.match(advisory[0].target, /pool\.rs:999/);
});
