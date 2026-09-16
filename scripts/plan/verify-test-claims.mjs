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

import fs from 'node:fs';
import path from 'node:path';
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
 * Returns { findings, planned, scanned, claims }. Each entry: { relPath, line, name }.
 * `plannedGates` is a Set of repo-relative paths whose unmatched claims are advisory, not binding
 * (see PLANNED vs BINDING above); anything not in it is binding.
 */
export function runVerifyTestClaims({ repoRoot, plannedGates } = {}) {
  const root = repoRoot ?? REPO_ROOT;
  const exempt = plannedGates ?? new Set();
  const files = gitList(root);
  const index = buildTestNameIndex(root);
  const targets = claimFiles(files);
  const findings = [];
  const planned = [];
  let claims = 0;
  for (const rel of targets) {
    const text = fs.readFileSync(path.join(root, rel), 'utf8');
    const isPlanned = exempt.has(rel);
    for (const c of extractClaimedTests(text)) {
      claims++;
      if (testExists(c.name, index)) continue;
      (isPlanned ? planned : findings).push({ relPath: rel, line: c.line, name: c.name });
    }
  }
  return { findings, planned, scanned: targets.length, claims };
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
  const { findings, planned, scanned, claims } = runVerifyTestClaims({ repoRoot: REPO_ROOT, plannedGates });
  if (planned.length > 0 && !quiet) {
    console.error(`verify:test-claims planned (advisory) — ${planned.length} claimed test(s) in a gate file whose node is not done:`);
    for (const p of planned) {
      console.error(`  - ${p.relPath}:${p.line} — claims test \`${p.name}\` — planned — ${notes.get(p.relPath) ?? 'node not done'}`);
    }
  }
  if (findings.length === 0) {
    console.log(`verify:test-claims PASS — all ${claims} claimed test(s) across ${scanned} file(s) exist or are planned (${planned.length} planned, advisory).`);
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
