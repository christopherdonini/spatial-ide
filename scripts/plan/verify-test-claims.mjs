#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// scripts/plan/verify-test-claims.mjs — AUTONOMY.md Appendix A3 (the human, 2026-09-14): "a
// claimed-test-exists check ... run as a pre-gate self-check so gates fail only on semantics."
//
// WHAT THIS DOES: a preregistration or an ADR routinely says "verified by test `some_snake_case_name`"
// or "the new test, by name: `a_residual_admission_lease_exhaustion_...`". This scans every tracked
// preregistration (`*PREREGISTRATION*.md`) and every ADR (`docs/adr/*.md`) for such CLAIMS and
// confirms a test of that name actually exists in a test file. A claim with no matching test is
// printed (`file:line — claims test `name` — no test of that name found`); the process exits 1 if any
// claim is unmatched, 0 otherwise.
//
// THE RECOGNIZER (conservative, TESTED in verify-test-claims.test.mjs): a claimed test name is
//   (a) a backticked snake_case token of >= 3 words (`^[a-z][a-z0-9]*(_[a-z0-9]+){2,}$`) that opens
//       with a narrative prefix this repo uses for test names (`a_`, `an_`, `it_`, `the_`, `test_`,
//       `n_`, `each_`, `when_`); OR
//   (b) an explicit `test('...')` / `it('...')` description string quoted in the document.
//   The prefix requirement is deliberately strict: field/symbol names (`crs_axis_directions`,
//   `build_viewport_query`, `no_such_bbox_column`, `dataset_session_generation`, `t_query_start`)
//   carry none of these narrative openers, so they are not mistaken for test claims. An earlier
//   "within N chars of the word test" proximity rule was dropped: it flagged exactly those symbols
//   (a symbol named beside "grep test" or "unit test") — false alarms this gate must not raise.
//
// EXISTENCE is judged leniently (to avoid a false "missing"): a name exists if it is declared as a
// Rust `fn <name>` in any tracked `*.rs`, or appears inside a `test(...)`/`it(...)` description or as
// a `function <name>` in any tracked `*.mjs`/`*.ts`/`*.tsx`. Collecting ALL `fn` names (not only
// `#[test]`-annotated ones) is deliberate: it can only make a claim MORE likely to be found, never
// wrongly reported missing.
//
// PLANNED vs BINDING (2026-09-16, stop-the-line: `main` was red on this check since 2a939d3): a
// preregistration is required to be committed BEFORE any code (docs/PREREGISTRATION-TEMPLATE.md's
// header rule) and to name its tests in §4 — so between that commit and the piece landing it
// necessarily names tests that do not exist yet. A claim is therefore PLANNED, not binding, when the
// claiming file is the `gate` of a `PLAN.yaml` node whose `status` is not `done`. Planned claims are
// printed as advisory (`planned — node <id> is <status>`) and do not fail the run; once the node is
// `done` the same claim is binding again, so a piece that lands without its named test still fails
// the check (the Appendix A3 intent). `plannedGateFiles(plan)` computes the exempt set; if PLAN.yaml
// cannot be loaded the load error is printed and NOTHING is treated as planned.
//
// WHAT THIS DOES NOT CATCH (disclosed): a claim whose name is real but points at a test that does not
// actually assert what the prose says (this checks the name exists, not its body); a fabricated claim
// that reuses an existing test's name; and, by the conservative recognizer, a test claim phrased
// without a narrative prefix AND far from the word "test" (a recall gap, not a false alarm). Node's
// standard library only.
//
// SUPERSEDED (TEST-CLAIMS-SUPERSEDED-PREREGISTRATION.md; the human, round 14 item 2 -- a pinned
// `path:line @ <rev> sha256:<hex>` reference is a historical pin, never silently read as current): a
// claim at line L of file F that does NOT exist in the current tree is nonetheless not a binding
// finding when F itself carries a hash-pinned, `superseded`-marked reference to that very line -- an
// append-only record's own later row saying "this line is old, and here is the proof". Recognized by
// `HASH_REF_RE`, the same reference grammar `verify-quotes.mjs` (round 12's "quote by reference"
// mechanism) uses for `` `path:a[-b]` @ <rev> sha256:<hex> ``: a trimmed local copy, since that script
// is not yet on `main` (`governance/verify-quotes`) to import from. This rule only recognizes an
// EXPLICIT path equal to the citing file's own repo-relative path -- a bare `:line` self-reference is
// already forbidden by the round-14 root-cause rule, so a real self-referencing pin always spells the
// file's own path in full; a bare-reference / nearest-preceding-cite binding (verify-quotes.mjs's own
// `nearestPathInParagraph`) is out of this piece's scope. See `supersededSpans`/`findSupersededSpan`.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { loadPlan } from './plan.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(here, '..', '..');

const SNAKE_RE = /^[a-z][a-z0-9]*(?:_[a-z0-9]+){2,}$/;
export const TEST_PREFIXES = new Set(['a', 'an', 'it', 'the', 'test', 'n', 'each', 'when']);

export function isTestShaped(name) {
  return SNAKE_RE.test(name) && TEST_PREFIXES.has(name.split('_')[0]);
}

function lineOf(text, idx) {
  let n = 1;
  for (let i = 0; i < idx; i++) if (text.charCodeAt(i) === 10) n++;
  return n;
}

/** Returns [{ name, line, kind }] for every claimed test name in a document's text. */
export function extractClaimedTests(text) {
  const out = [];
  const seen = new Set();
  const push = (name, idx, kind) => {
    const line = lineOf(text, idx);
    const key = `${name}@${line}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push({ name, line, kind });
  };

  // Find every snake_case >= 3-word token directly (NOT by pairing backticks: a prose line with
  // nested code spans can carry an odd count of backticks, which desynchronizes any pairing regex).
  // A token counts as "in backticks" when a backtick sits immediately on either side of it, which is
  // robust to however many other code spans share the line.
  const TOKEN_RE = /[a-z][a-z0-9]*(?:_[a-z0-9]+){2,}/g;
  let m;
  while ((m = TOKEN_RE.exec(text))) {
    const name = m[0];
    const idx = m.index;
    const end = idx + name.length;
    const prev = idx > 0 ? text[idx - 1] : '';
    const next = end < text.length ? text[end] : '';
    if (/[A-Za-z0-9_]/.test(prev) || /[A-Za-z0-9_]/.test(next)) continue; // mid-identifier, skip
    if (!isTestShaped(name)) continue;
    // Require the token to be its OWN complete code span (backtick on BOTH sides). A token that is
    // only ONE side against a backtick is part of a longer span — e.g. `cargo test --lib a_foo_bar`,
    // a substring test FILTER, not a claim that a test is literally named `a_foo_bar`.
    if (prev !== '`' || next !== '`') continue;
    push(name, idx, 'backtick');
  }

  const call = /\b(?:test|it)\(\s*(['"])([^'"]+)\1/g;
  while ((m = call.exec(text))) {
    push(m[2], m.index, 'call');
  }
  return out;
}

// Reused, trimmed from `verify-quotes.mjs`'s `HASH_REF_RE` (round 12's "quote by reference" grammar;
// `path:a[-b]` @ <rev> sha256:<hex>`, backticks and `@ <rev>` each optional, `<rev>` any non-whitespace
// non-backtick run). Group 1 (path) is REQUIRED here, unlike the source grammar: a bare `:line` self
// reference is out of scope (see the module doc above).
const HASH_REF_RE = /`?([A-Za-z0-9_][A-Za-z0-9_./+-]*):(\d+)(?:-(\d+))?`?(?:\s*@\s*([^\s`]+))?\s*sha256:([0-9a-f]{64})`?/g;

function lineTextOf(text, lineNo) {
  return text.split('\n')[lineNo - 1] ?? '';
}

/** Condition (b): the word `superseded` appears on the reference's own line, outside any backtick span. */
export function containsSupersededOutsideBackticks(lineText) {
  return /\bsuperseded\b/i.test(lineText.replace(/`[^`]*`/g, ''));
}

/**
 * Every hash-pinned, `superseded`-marked reference in `text` whose path is `relPath` itself (F's own
 * path) -- conditions (a) and (b) of the rule, NOT (c) (the hash is checked lazily, per-claim, in
 * `findSupersededSpan`, so a file with no matching claim never pays for a `git show`).
 * Returns [{ startLine, endLine, rev, hash, reference }].
 */
export function supersededSpans(relPath, text) {
  const out = [];
  HASH_REF_RE.lastIndex = 0;
  let m;
  while ((m = HASH_REF_RE.exec(text))) {
    if (m[1] !== relPath) continue;
    const refLine = lineOf(text, m.index);
    if (!containsSupersededOutsideBackticks(lineTextOf(text, refLine))) continue;
    out.push({
      startLine: Number(m[2]),
      endLine: m[3] !== undefined ? Number(m[3]) : Number(m[2]),
      rev: m[4] ?? 'HEAD',
      hash: m[5].toLowerCase(),
      reference: m[0],
    });
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

// Lines a..b (1-indexed, inclusive), each with its own trailing LF, except a fileless-final-newline's
// own last line -- the same slicing `verify-quotes.mjs`'s `linesWithLF` performs.
function linesWithLF(content, a, b) {
  const starts = [0];
  for (let i = 0; i < content.length; i++) if (content.charCodeAt(i) === 10) starts.push(i + 1);
  const totalLines = content.endsWith('\n') ? starts.length - 1 : starts.length;
  if (!Number.isInteger(a) || !Number.isInteger(b) || a < 1 || b > totalLines) return null;
  const startOffset = starts[a - 1];
  const endOffset = b < starts.length ? starts[b] : content.length;
  return content.slice(startOffset, endOffset);
}

function sha256Hex(s) {
  return crypto.createHash('sha256').update(Buffer.from(s, 'utf8')).digest('hex');
}

/**
 * Condition (c), checked against `spans` in order: the first span whose range contains `line` AND
 * whose hash recomputes against `git show <rev>:relPath`'s own lines wins. A span that does not cover
 * `line`, or whose rev/path is unresolvable, or whose hash does not match, is not a match -- the claim
 * stays a binding finding (or planned), exactly as if no pin existed. Returns the winning span or null.
 */
export function findSupersededSpan(root, relPath, line, spans) {
  for (const span of spans) {
    if (line < span.startLine || line > span.endLine) continue;
    const content = gitShowFile(root, span.rev, relPath);
    if (content === null) continue;
    const slice = linesWithLF(content, span.startLine, span.endLine);
    if (slice === null) continue;
    if (sha256Hex(slice) === span.hash) return span;
  }
  return null;
}

const RUST_FN_RE = /\bfn\s+([a-z_][A-Za-z0-9_]*)/g;
const JS_DESC_RE = /\b(?:test|it)\(\s*(['"`])([^'"`]+)\1/g;
const JS_FN_RE = /\bfunction\s+([A-Za-z0-9_]+)/g;

/** Collects test-declaration names across the tree: { rustFns:Set, jsDescs:string[], jsFns:Set }. */
export function buildTestNameIndex(repoRoot) {
  const files = gitList(repoRoot);
  const rustFns = new Set();
  const jsDescs = [];
  const jsFns = new Set();
  for (const rel of files) {
    if (rel.endsWith('.rs')) {
      const text = fs.readFileSync(path.join(repoRoot, rel), 'utf8');
      let m;
      RUST_FN_RE.lastIndex = 0;
      while ((m = RUST_FN_RE.exec(text))) rustFns.add(m[1]);
    } else if (/\.(mjs|cjs|js|ts|tsx|jsx)$/.test(rel)) {
      const text = fs.readFileSync(path.join(repoRoot, rel), 'utf8');
      let m;
      JS_DESC_RE.lastIndex = 0;
      while ((m = JS_DESC_RE.exec(text))) jsDescs.push(m[2]);
      JS_FN_RE.lastIndex = 0;
      while ((m = JS_FN_RE.exec(text))) jsFns.add(m[1]);
    }
  }
  return { rustFns, jsDescs, jsFns };
}

export function testExists(name, index) {
  if (index.rustFns.has(name) || index.jsFns.has(name)) return true;
  return index.jsDescs.some((d) => d === name || d.includes(name));
}

function gitList(repoRoot) {
  const out = execFileSync('git', ['ls-files'], { cwd: repoRoot, encoding: 'utf8' });
  return out.split('\n').filter(Boolean);
}

export function claimFiles(files) {
  return files.filter((f) => /PREREGISTRATION.*\.md$/.test(f) || (f.startsWith('docs/adr/') && f.endsWith('.md')));
}

/**
 * Map<gatePath, note> for every node whose piece has NOT landed (`status !== 'done'`), where the
 * note reads `node <id> is <status>` (joined with ", " when several such nodes share a gate file).
 * `gate: none` and a missing `gate` are not gate files and are ignored.
 */
export function plannedGateNotes(plan) {
  const nodes = (plan?.nodes ?? []).filter((n) => n && typeof n === 'object');
  // Binding is sticky: a gate file named by ANY `done` node has landed work behind it, so its claims
  // bind even while another node still names it (the architect gate's finding 5, 2026-09-16 — a
  // union over nodes would let a later piece keep a landed piece's claims advisory).
  const landed = new Set(
    nodes.filter((n) => n.status === 'done').map((n) => n.gate).filter((g) => g && g !== 'none'),
  );
  const notes = new Map();
  for (const node of nodes) {
    if (node.status === 'done') continue;
    const gate = node.gate;
    if (!gate || gate === 'none' || landed.has(gate)) continue;
    const note = `node ${node.id} is ${node.status}`;
    notes.set(gate, notes.has(gate) ? `${notes.get(gate)}, ${note}` : note);
  }
  return notes;
}

/**
 * The Set of gate paths whose claims are PLANNED (their node is not `done`). Pure. Only a
 * preregistration can be planned: the before-code rule is a preregistration rule, so an ADR named
 * as a node's `gate` is never exempted — its claims stay binding whatever the node's status.
 */
export const PLANNABLE_RE = /PREREGISTRATION.*\.md$/;
export function plannedGateFiles(plan) {
  return new Set([...plannedGateNotes(plan).keys()].filter((g) => PLANNABLE_RE.test(g)));
}

/**
 * Returns { findings, planned, superseded, scanned, claims }. Each entry: { relPath, line, name }
 * (`superseded` entries additionally carry `reference`, the matched pin text).
 * `plannedGates` is a Set of repo-relative paths whose unmatched claims are advisory, not binding
 * (see PLANNED vs BINDING above); anything not in it is binding. A claim that does not exist is
 * SUPERSEDED, and reported under that heading instead of `planned`/`findings`, when the claiming
 * file's own text pins that exact line as historical (see `supersededSpans`/`findSupersededSpan`
 * above) — checked whether or not the file is also planned, since a superseded claim "never fails the
 * run and is never counted as existing" regardless of its node's status.
 */
export function runVerifyTestClaims({ repoRoot, plannedGates } = {}) {
  const root = repoRoot ?? REPO_ROOT;
  const exempt = plannedGates ?? new Set();
  const files = gitList(root);
  const index = buildTestNameIndex(root);
  const targets = claimFiles(files);
  const findings = [];
  const planned = [];
  const superseded = [];
  let claims = 0;
  for (const rel of targets) {
    const text = fs.readFileSync(path.join(root, rel), 'utf8');
    const isPlanned = exempt.has(rel);
    const spans = supersededSpans(rel, text);
    for (const c of extractClaimedTests(text)) {
      claims++;
      if (testExists(c.name, index)) continue;
      const span = spans.length ? findSupersededSpan(root, rel, c.line, spans) : null;
      if (span) {
        superseded.push({ relPath: rel, line: c.line, name: c.name, reference: span.reference });
        continue;
      }
      (isPlanned ? planned : findings).push({ relPath: rel, line: c.line, name: c.name });
    }
  }
  return { findings, planned, superseded, scanned: targets.length, claims };
}

function main() {
  const quiet = process.argv.includes('--quiet');
  let plannedGates = new Set();
  let notes = new Map();
  try {
    const plan = loadPlan(path.join(REPO_ROOT, 'PLAN.yaml'));
    notes = plannedGateNotes(plan);
    plannedGates = plannedGateFiles(plan);
  } catch (e) {
    // Never silently exempt: a PLAN.yaml we could not read means nothing is planned, said out loud.
    console.error(`verify:test-claims — PLAN.yaml did not load (${e.message}); no claim treated as planned.`);
  }
  const { findings, planned, superseded, scanned, claims } = runVerifyTestClaims({ repoRoot: REPO_ROOT, plannedGates });
  if (planned.length > 0 && !quiet) {
    console.error(`verify:test-claims planned (advisory) — ${planned.length} claimed test(s) in a gate file whose node is not done:`);
    for (const p of planned) {
      console.error(`  - ${p.relPath}:${p.line} — claims test \`${p.name}\` — planned — ${notes.get(p.relPath) ?? 'node not done'}`);
    }
  }
  if (superseded.length > 0 && !quiet) {
    console.error(`verify:test-claims superseded (advisory) — ${superseded.length} claimed test(s) pinned historical by a hash-checked reference:`);
    for (const s of superseded) {
      console.error(`  - ${s.relPath}:${s.line} — claims test \`${s.name}\` — superseded — pinned by ${s.reference}`);
    }
  }
  if (findings.length === 0) {
    console.log(`verify:test-claims PASS — all ${claims} claimed test(s) across ${scanned} file(s) exist or are planned or superseded (${planned.length} planned, ${superseded.length} superseded, advisory).`);
    return;
  }
  if (!quiet) {
    console.error(`verify:test-claims FAIL — ${findings.length} claimed test(s) with no matching test:`);
    for (const f of findings) console.error(`  - ${f.relPath}:${f.line} — claims test \`${f.name}\` — not found in any test file`);
  } else {
    console.error(`verify:test-claims FAIL — ${findings.length} unmatched claim(s) across ${scanned} file(s).`);
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
