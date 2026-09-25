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
// standard library only. SUPERSEDED (below) adds one more, disclosed rather than mechanized (adopted
// from the architect gate report, attempt 1, 2026-09-18, PROPOSED item 2, itself item 1's own closing
// sentence): that the obligation moved rather than vanished is proven by the record's own rows and
// read by the gate, not by this tool; a claim marked superseded with no replacement anywhere in the
// file is a defect this check does not catch, disclosed here.
//
// SUPERSEDED (TEST-CLAIMS-SUPERSEDED-PREREGISTRATION.md; the human, round 14 item 2 -- a pinned
// `path:line @ <rev> sha256:<hex>` reference is a historical pin, never silently read as current; the
// ruling continues past that to name which is authoritative, the pin or the tree, when they disagree):
// a claim at line L of file F that does NOT exist in the current tree is nonetheless not a binding
// finding when F itself carries a hash-pinned, `superseded`-marked reference to that very line whose
// historical text also names the claim, and whose commit is shown to be on main -- an append-only
// record's own later row PROVING, not merely asserting, "this line is old, and a rename happened".
// Five conditions, all required: (a) the reference's line range covers L; (b) the word `superseded`
// or `Superseded` -- exactly those two castings, refused in ALL CAPS and refused when the whole word
// immediately before it is `not`/`never`, in either capitalization (§2.6,
// TEST-CLAIMS-FOLLOWUPS-PREREGISTRATION.md) -- sits on the reference's own line, outside any backtick
// span; (c) the hash recomputes against `git show <rev>:F`'s own historical bytes; (d) the claim's OWN
// historical LINE -- not the whole pinned span (§2.3, TEST-CLAIMS-FOLLOWUPS-PREREGISTRATION.md's wide-
// span residual; a single-line pin is unaffected) -- contains the claimed name (a pin that hashes a
// line it already has, without ever naming the claim, exempts nothing it was not written to explain --
// architect gate, attempt 1, B1); (e) `<rev>` is shown to be an ancestor of `origin/main` -- REFUSED,
// not merely unproven, when it is not (a rev not yet on main is not something main's own record can
// rely on surviving a squash/rebase merge -- reviewer gate, attempt 1, S3), SKIPPED rather than failed
// when `origin/main` does not resolve in the scanned tree at all (true of most unit-test fixtures
// here; `supersededFixtureWithRemote`/`withdrawnFixtureWithRemote` are the two that now carry a real
// bare `origin` remote, testing the REFUSED branch instead). A `<rev>` that merely LOOKS like a commit
// id (`COMMIT_ID_RE`) but does not RESOLVE to one -- a hex-named branch or tag -- is refused the same
// way as a non-commit `<rev>` (§2.4, TEST-CLAIMS-FOLLOWUPS-PREREGISTRATION.md; see
// `revResolvesToCommit`). Recognized by `HASH_REF_RE`, DERIVED FROM `verify-quotes.mjs`'s
// own reference grammar (round 12, item 1's quote-by-reference mechanism) as it stands on
// `governance/verify-quotes` @ 1254cddd4c3b47c9431375874ad327754ef038e9 (round 15(c): a record
// statement about a tool's behaviour names the tool's commit) -- see that constant's own comment for
// the one grammar-level divergence this tool keeps (the path group is REQUIRED) and the policy layer
// this tool adds on top of a grammar it otherwise matches exactly: the refused HEAD default, the
// refused non-commit `<rev>`, and condition (e)'s ancestor-of-main requirement. See
// `supersededSpans`/`findSupersededSpan`.

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

// `HASH_REF_RE`, DERIVED FROM `verify-quotes.mjs`'s own `HASH_REF_RE` as it stands on
// `governance/verify-quotes` @ 1254cddd4c3b47c9431375874ad327754ef038e9 (its `GAP`/`HASH_REF_RE`
// constants, lines 554 and 555 at that commit -- round 19 item 2's correction (attempt-2 reviewer
// gate, `state/gate-log.json` index 87): the earlier text read 553/554, one line short of each
// constant's own opening line -- not written as a `path:line` token here: that file is tracked as of
// 6191a7c, but `verify-cites.mjs` (as it stands on `main` @ 7104cd3a2f961e6e1fa0073c1df77f9d3dea2f7f,
// round 15(c): a tool claim names the tool's commit) resolves every such token against the CURRENT
// tree, not the pinned historical commit, gate S4/N4's own disclosed limit). `GAP` is that source's own
// name and definition, standing in for a plain `\s*` so a reference rustfmt (or, here, a table cell)
// has wrapped across exactly one `//`-comment continuation still binds, exactly as the source binds
// it. ONE necessary grammar-level divergence, and the only one kept: group 2 (path) is REQUIRED --
// the source leaves it optional to support a bare `:line` bound to the nearest preceding path:line
// citation (`nearestPathInParagraph`), which this tool does not implement; the round-14 root-cause
// rule already requires a real self-referencing pin to spell the file's own path in full, so nothing
// this tool needs to recognize is lost by requiring it. `<rev>` (group 5) is matched at the GRAMMAR
// level exactly as the source matches it (any non-whitespace, non-backtick run, optional) -- this
// tool's stricter POLICY (no HEAD default, no non-commit `<rev>`) is enforced in `supersededSpans`
// below, not in the shared pattern, because that policy is this tool's own exemption to refuse, not a
// property of the reference shape itself (round 15(e); architect/reviewer gate, attempt 1, B1/B2).
const GAP = '[ \\t]*(?:\\n[ \\t]*//[ \\t]?)?[ \\t]*';
const HASH_REF_RE = new RegExp(
  '(byte-copied from\\s+)?`?([A-Za-z0-9_][A-Za-z0-9_./+-]*):(\\d+)(?:-(\\d+))?`?' +
    `(?:${GAP}@${GAP}([^\\s\`]+))?${GAP}sha256:([0-9a-f]{64})\`?`,
  'g',
);

// A commit id this tool will act on: 7-40 lowercase hex digits (a full or abbreviated SHA), never a
// ref name -- round 15(e)'s "never a branch commit" read literally: a rev spelled as a branch or tag
// name resolves to whatever that ref currently points at, exactly the "read as current" the round-14
// root-cause rule forbids. Also closes reviewer gate attempt-1 nit N1 (a rev this fails is never
// passed to `execFileSync`).
const COMMIT_ID_RE = /^[0-9a-f]{7,40}$/;

// §2.4's rev resolution (TEST-CLAIMS-FOLLOWUPS-PREREGISTRATION.md; index 87; index 171 S4): a `<rev>`
// that merely LOOKS like a commit id (passes `COMMIT_ID_RE`, a grammar-level, format-only check)
// exempts only when it also RESOLVES to one -- `git rev-parse --verify --quiet <rev>^{commit}`
// succeeds and the resolved id begins with the literal `<rev>` typed. This refuses a HEX-NAMED branch
// or tag: a ref whose own NAME happens to be a run of hex digits resolves to whatever commit that ref
// currently points at, not to a commit BY that id -- exactly the "read as current" round 14's
// root-cause rule forbids. Memoized by (root, rev).
const revResolvesCache = new Map();
function revResolvesToCommit(root, rev) {
  const key = `${root}\u0000${rev}`;
  if (revResolvesCache.has(key)) return revResolvesCache.get(key);
  let ok = false;
  try {
    const resolved = execFileSync('git', ['rev-parse', '--verify', '--quiet', `${rev}^{commit}`], {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
    ok = resolved.startsWith(rev);
  } catch {
    ok = false;
  }
  revResolvesCache.set(key, ok);
  return ok;
}

function lineTextOf(text, lineNo) {
  return text.split('\n')[lineNo - 1] ?? '';
}

// A code span delimited by a matching run of 1 or 2 backticks (markdown's own double-backtick escape
// for a literal backtick inside a span). The `(?!\1)` per-character guard is this module's own
// "adjacency, not naive pairing" discipline (see `extractClaimedTests` above) applied to a variable-
// length delimiter: a run that finds no matching CLOSE of its own captured length simply does not
// match, rather than pairing across it. Fixes architect/reviewer gate attempt-1 S1: the earlier
// `` /`[^`]*`/g `` stripped only the two EMPTY single-backtick pairs a double-backtick span's own
// delimiters form, leaving the word between them (`` ``superseded`` ``) wrongly read as outside.
const BACKTICK_SPAN_RE = /(`{1,2})(?:(?!\1)[\s\S])*?\1/g;

// Condition (b)'s word (§2.6, TEST-CLAIMS-FOLLOWUPS-PREREGISTRATION.md; index 87; round 23 item 4, O6
// as recommended): `superseded` or `Superseded` as a WHOLE word -- exactly those two castings; ALL
// CAPS (`SUPERSEDED`) and any other casing are refused -- and refused, whichever casing, when the
// whole word immediately before it (case-insensitive) is `not` or `never`.
const SUPERSEDED_WORD_RE = /\b[Ss]uperseded\b/g;

/** Condition (b): the word `superseded`/`Superseded` appears on the reference's own line, outside any
 * backtick span, and is not negated by an immediately preceding `not`/`never` (§2.6). */
function containsSupersededOutsideBackticks(lineText) {
  const stripped = lineText.replace(BACKTICK_SPAN_RE, '');
  SUPERSEDED_WORD_RE.lastIndex = 0;
  let m;
  while ((m = SUPERSEDED_WORD_RE.exec(stripped))) {
    const prevWord = /([A-Za-z]+)\s*$/.exec(stripped.slice(0, m.index))?.[1]?.toLowerCase();
    if (prevWord !== 'not' && prevWord !== 'never') return true;
  }
  return false;
}

// The withdrawn-test marker (round 20 item 1; `state/consults/2026-09-24-withdrawn-marker.md` §1):
// NOT a bare `withdrawn` -- landed records already carry that word on lines that pin their own file
// (round 15(g) withdrawal rows), so a bare-word marker would turn main red. Matched case-sensitively,
// outside any backtick span, with no word or hyphen character adjacent on either side (so
// `non-withdrawn-test` or `withdrawn-testing` do not match).
const WITHDRAWN_TEST_TOKEN_RE = /(?<![A-Za-z0-9_-])withdrawn-test(?![A-Za-z0-9_-])/;
function containsWithdrawnTestOutsideBackticks(lineText) {
  return WITHDRAWN_TEST_TOKEN_RE.test(lineText.replace(BACKTICK_SPAN_RE, ''));
}

/**
 * Every hash-pinned, EXPLICIT-commit-rev reference in `text` whose path is `relPath` itself (F's own
 * path) and whose own line satisfies `containsMarker` -- conditions (a) and (b) of the SUPERSEDED rule
 * (or the withdrawn-test analogue), NOT (c)/(d)/(e) (checked lazily, per claim, in `findMarkedSpan`, so
 * a file with no matching claim never pays for a `git show`). A reference with no `@ <rev>`, or whose
 * `<rev>` is not a bare commit id, is never a span at all: the HEAD default the shared grammar would
 * otherwise apply is this tool's own exemption to refuse (round 15(e); attempt-1 B1/B2), not a
 * property to inherit from the source. `singleLineOnly`, when true, refuses a range reference
 * (`startLine !== endLine`) outright -- the withdrawn-test row grammar's own "one row, one line" rule
 * (a range reference is not read as spanning multiple withdrawn claims). Returns
 * `[{ startLine, endLine, rev, hash, reference, lineText }]`.
 */
function markedSpans(relPath, text, containsMarker, { singleLineOnly = false } = {}) {
  const out = [];
  HASH_REF_RE.lastIndex = 0;
  let m;
  while ((m = HASH_REF_RE.exec(text))) {
    if (m[2] !== relPath) continue;
    const rev = m[5];
    if (!rev || !COMMIT_ID_RE.test(rev)) continue;
    const refLine = lineOf(text, m.index);
    const lineText = lineTextOf(text, refLine);
    if (!containsMarker(lineText)) continue;
    const startLine = Number(m[3]);
    const endLine = m[4] !== undefined ? Number(m[4]) : Number(m[3]);
    if (singleLineOnly && startLine !== endLine) continue;
    // `refLine`: the ROW's own line (where the reference itself sits), not the pinned target line --
    // round 21 item 2 (entry 136)'s row-level check reports a bad withdrawn-test row at the row's own
    // file:line, which for an appended-at-the-end row (the common case) differs from `startLine`/
    // `endLine` (the historical line elsewhere that the row pins).
    out.push({ startLine, endLine, rev, hash: m[6].toLowerCase(), reference: m[0], lineText, refLine });
  }
  return out;
}

/** SUPERSEDED's own spans (round 14 item 2). Excludes any line also marked `withdrawn-test`
 * (the consult's Row-grammar precedence: a withdrawn row that fails its own riders must not fall
 * back to exempting as superseded). */
function supersededSpans(relPath, text) {
  return markedSpans(
    relPath,
    text,
    (lineText) => containsSupersededOutsideBackticks(lineText) && !containsWithdrawnTestOutsideBackticks(lineText),
  );
}

// Memoized by (root, rev, relPath): the motivating record alone carries ten spans over one file, and
// `findSupersededSpan` below may re-ask the same (rev, path) pair once per span per claim -- attempt-1
// reviewer S5, measured at ~21 ms/spawn on that box.
const gitShowCache = new Map();
function gitShowFile(root, rev, relPath) {
  const key = `${root}\u0000${rev}\u0000${relPath}`;
  if (gitShowCache.has(key)) return gitShowCache.get(key);
  let out;
  try {
    out = execFileSync('git', ['show', `${rev}:${relPath}`], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  } catch {
    out = null;
  }
  gitShowCache.set(key, out);
  return out;
}

// Lines a..b (1-indexed, inclusive), each with its own trailing LF, except a fileless-final-newline's
// own last line -- the same slicing `verify-quotes.mjs`'s own `linesWithLF` performs, including its
// `b < a` rejection (attempt-1 reviewer S2: the earlier copy omitted it; unreachable today because the
// range check above already rejects an inverted span first, but the omission made the comment untrue).
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

// Condition (e): memoized per `root`, `origin/main`'s own commit id, or `null` when that ref does not
// resolve in the scanned tree at all (true of most unit-test fixtures below;
// `supersededFixtureWithRemote`/`withdrawnFixtureWithRemote` are the two that carry one).
const originMainCache = new Map();
function originMainSha(root) {
  if (originMainCache.has(root)) return originMainCache.get(root);
  let sha = null;
  try {
    sha = execFileSync('git', ['rev-parse', 'origin/main'], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  } catch {
    sha = null;
  }
  originMainCache.set(root, sha);
  return sha;
}

/**
 * Condition (e): `rev` is shown to be an ancestor of `origin/main` -- REFUSED, not merely unproven,
 * when `origin/main` resolves and `rev` is not its ancestor (a commit only on an unmerged branch can
 * become unreachable from every fetched ref after a squash/rebase merge, silently evaporating the
 * exemption and turning main red on a landed piece -- attempt-1 reviewer/architect S3; refusing here
 * is the fail-closed direction). Returns `{ checked, ok }`; `checked: false` when `origin/main` does
 * not resolve at all -- the caller SKIPS the condition rather than failing it, and is responsible for
 * surfacing that once (see `runVerifyTestClaims`'s `supersededMainUnchecked`). Memoized by (root, rev)
 * (§2.5, TEST-CLAIMS-FOLLOWUPS-PREREGISTRATION.md; index 87; index 171 S4).
 */
const ancestorOfMainCache = new Map();
function isAncestorOfMain(root, rev) {
  const mainSha = originMainSha(root);
  if (!mainSha) return { checked: false, ok: false };
  const key = `${root}\u0000${rev}`;
  if (ancestorOfMainCache.has(key)) return ancestorOfMainCache.get(key);
  let result;
  try {
    execFileSync('git', ['merge-base', '--is-ancestor', rev, mainSha], { cwd: root, stdio: 'ignore' });
    result = { checked: true, ok: true };
  } catch {
    result = { checked: true, ok: false };
  }
  ancestorOfMainCache.set(key, result);
  return result;
}

/**
 * Conditions (r), (c)-(e), checked against `spans` in order; the first span satisfying all wins.
 * (r) `revResolvesToCommit` (§2.4). (c) the hash recomputes against `git show <rev>:relPath`'s own
 * historical bytes. (d) the claim's OWN historical LINE -- `line`, not the whole `[startLine,endLine]`
 * span (§2.3's wide-span residual, TEST-CLAIMS-FOLLOWUPS-PREREGISTRATION.md; a single-line pin, where
 * `line === startLine === endLine`, is unaffected) -- CONTAINS the claimed `name` -- attempt-1
 * architect B1: a pin that merely hashes a line it already has, without the claimed name ever
 * appearing in it, exempts nothing it was written to explain. (e) `isAncestorOfMain` above. A span
 * outside `line`'s range, an unresolvable rev/path, a hash mismatch, a claim line missing the claimed
 * name, or a rev shown NOT to be on main is not a match -- the claim stays a binding finding (or
 * planned), exactly as if no pin existed.
 * Returns `{ span, mainUnchecked }` (`span: null` when nothing matched); `mainUnchecked` is true when
 * condition (e) could not run (no `origin/main` in this tree) for the span that otherwise won.
 */
function findMarkedSpan(root, relPath, line, name, spans, extra) {
  for (const span of spans) {
    if (line < span.startLine || line > span.endLine) continue;
    if (!revResolvesToCommit(root, span.rev)) continue;
    const content = gitShowFile(root, span.rev, relPath);
    if (content === null) continue;
    const slice = linesWithLF(content, span.startLine, span.endLine);
    if (slice === null) continue;
    if (sha256Hex(slice) !== span.hash) continue;
    const claimLine = linesWithLF(content, line, line);
    if (claimLine === null || !claimLine.includes(name)) continue;
    const anc = isAncestorOfMain(root, span.rev);
    if (anc.checked && !anc.ok) continue;
    if (extra && !extra(span)) continue;
    return { span, mainUnchecked: !anc.checked };
  }
  return { span: null, mainUnchecked: false };
}

function findSupersededSpan(root, relPath, line, name, spans) {
  return findMarkedSpan(root, relPath, line, name, spans);
}

// Rider (a)/(b), mechanically (round 20 item 1; consult §2/§3): resolved once against the CURRENT
// tree's DECISIONS-PENDING.md -- never pinned by hash, because the ledger is never cited by line or
// pinned (round 12(a), round 14(a')). "Names the removal" is read by the gate, not checked here (the
// README's boundary paragraph discloses this, as SUPERSEDED's replacement half is disclosed).
const decisionsPendingCache = new Map();
function loadDecisionsPending(root) {
  if (decisionsPendingCache.has(root)) return decisionsPendingCache.get(root);
  let text = null;
  try {
    text = fs.readFileSync(path.join(root, 'DECISIONS-PENDING.md'), 'utf8');
  } catch {
    text = null;
  }
  decisionsPendingCache.set(root, text);
  return text;
}

// A line starting `**RULED <date>[ (...)] — question round N` -- the RULED block header.
const RULED_HEADER_RE = /^\*\*RULED \d{4}-\d{2}-\d{2}(?: \([^)]*\))? — question round (\d+)/;
// A line `- *Item M —` at column 0, inside a RULED block.
const RULED_ITEM_RE = /^- \*Item (\d+) —/;
// The next block/heading boundary that closes a RULED block's own span.
const BLOCK_BOUNDARY_RE = /^(\*\*|## )/;

/** `round N, item M` resolves when N's own RULED header exists and item M sits inside its block. */
function ledgerRoundItemResolves(ledgerText, round, item) {
  const lines = ledgerText.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const hm = RULED_HEADER_RE.exec(lines[i]);
    if (!hm || Number(hm[1]) !== round) continue;
    for (let j = i + 1; j < lines.length; j++) {
      if (BLOCK_BOUNDARY_RE.test(lines[j])) break;
      const im = RULED_ITEM_RE.exec(lines[j]);
      if (im && Number(im[1]) === item) return true;
    }
  }
  return false;
}

/** `entry K` resolves when a line starting `K. **[RULED` exists (the custodian's reading of rider (a)'s
 * "or entry id" form -- `state/consults/2026-09-24-withdrawn-marker.md`, Custodian's notes, item 1). */
function ledgerEntryResolves(ledgerText, entry) {
  const re = new RegExp('^' + entry + '\\.\\s*\\*\\*\\[RULED');
  return ledgerText.split('\n').some((l) => re.test(l));
}

const CITATION_RE = /round\s+(\d+)\s*,\s*item\s+(\d+)|entry\s+(\d+)/i;

/** Resolves a `round N, item M` or `entry K` citation string against the ledger text. */
function resolveCitation(ledgerText, citationText) {
  if (ledgerText === null) return false;
  const m = CITATION_RE.exec(citationText ?? '');
  if (!m) return false;
  if (m[3] !== undefined) return ledgerEntryResolves(ledgerText, Number(m[3]));
  return ledgerRoundItemResolves(ledgerText, Number(m[1]), Number(m[2]));
}

// Round 21 item 2 (entry 136), should-fix (a): `ruling:`/`carrier:` are matched as WHOLE keys --
// `(?<![A-Za-z0-9_-])` refuses a match starting mid-word (`overruling:`, `miscarrier:`) -- outside any
// backtick span (`withdrawnRiders` strips `BACKTICK_SPAN_RE` before matching, the same discipline
// `containsSupersededOutsideBackticks` uses), and the citation text after the key must be EXACTLY
// `round N, item M` or `entry K` with nothing else on either side (`CITATION_EXACT_RE`, anchored with
// `^`/`$`): a leading `not `, or trailing prose, is refused rather than read as containing a valid
// citation -- anchored to the consult's own row grammar (`state/consults/2026-09-24-withdrawn-marker.md`
// §1: "ruling: round N, item M; carrier: round N, item M").
const CITATION_TEXT_SRC = '(?:round\\s+\\d+\\s*,\\s*item\\s+\\d+|entry\\s+\\d+)';
const CITATION_EXACT_RE = new RegExp(`^${CITATION_TEXT_SRC}$`, 'i');
const KEY_NOT_MIDWORD = '(?<![A-Za-z0-9_-])';
const WITHDRAWN_RULING_RE = new RegExp(`${KEY_NOT_MIDWORD}ruling:\\s*([^;]*)`, 'i');
const WITHDRAWN_CARRIER_RE = new RegExp(`${KEY_NOT_MIDWORD}carrier:\\s*(.*)$`, 'i');

/**
 * Riders (a) and (b) (round 20 item 1; anchoring per round 21 item 2): the withdrawn-test row's own
 * line must carry a whole `ruling:` key outside any backtick span, whose citation text is EXACTLY
 * `round N, item M` or `entry K` and resolves against the current tree's `DECISIONS-PENDING.md`; the
 * same for `carrier:`. Returns `{ ok: true, ruling, carrier }` when both hold, or `{ ok: false,
 * failure }` naming exactly what's wrong -- `no ruling` / `unresolvable ruling: <text>` / `no carrier`
 * / `unresolvable carrier: <text>` -- so a caller can name the row's own file:line and the unresolved
 * citation text (or "no carrier") in a finding, per round 20, item 1, riders (a) and (b).
 */
function withdrawnRiders(root, lineText) {
  const outside = lineText.replace(BACKTICK_SPAN_RE, '');
  const rulingMatch = WITHDRAWN_RULING_RE.exec(outside);
  if (!rulingMatch) return { ok: false, failure: 'no ruling' };
  const rulingText = rulingMatch[1].trim();
  if (!CITATION_EXACT_RE.test(rulingText) || !resolveCitation(loadDecisionsPending(root), rulingText)) {
    return { ok: false, failure: `unresolvable ruling: ${rulingText}` };
  }
  const carrierMatch = WITHDRAWN_CARRIER_RE.exec(outside);
  if (!carrierMatch) return { ok: false, failure: 'no carrier' };
  const carrierText = carrierMatch[1].trim();
  if (!CITATION_EXACT_RE.test(carrierText) || !resolveCitation(loadDecisionsPending(root), carrierText)) {
    return { ok: false, failure: `unresolvable carrier: ${carrierText}` };
  }
  return { ok: true, ruling: rulingText, carrier: carrierText };
}

/** withdrawn-test's own (c)-(e) plus riders (a)/(b); attaches `ruling`/`carrier` onto the winning span. */
function findWithdrawnTestSpan(root, relPath, line, name, spans) {
  return findMarkedSpan(root, relPath, line, name, spans, (span) => {
    const riders = withdrawnRiders(root, span.lineText);
    if (!riders.ok) return false;
    span.ruling = riders.ruling;
    span.carrier = riders.carrier;
    return true;
  });
}

// Row position (round 22 item 3; round 23 item 4's O1 line; §2.1(a), the only copy of this predicate
// -- TEST-CLAIMS-FOLLOWUPS-PREREGISTRATION.md §7): a withdrawn-test ROW is a line whose first two
// bytes are `- `, the marker token following immediately, followed by a byte outside
// `[A-Za-z0-9_-]` or the line's end. The colon after the marker is NOT part of this predicate. Only a
// line in row position is a withdrawal ATTEMPT; a line carrying the token anywhere else (a heading, a
// prose mention, a bullet whose first word is not the marker) is a MENTION -- neither accepted nor
// refused (§2.1(b)).
const ROW_POSITION_RE = /^- withdrawn-test(?![A-Za-z0-9_-])/;

/** Every hash-pinned reference in `text`, keyed by the line its match STARTS on (first-seen wins,
 * i.e. the leftmost/first reference on that line, per §7) -- unfiltered by path/rev shape, so a row's
 * own grammar refusal reason (§7) can be read from whatever reference it actually carries. */
function firstHashRefsByLine(text) {
  const byLine = new Map();
  HASH_REF_RE.lastIndex = 0;
  let m;
  while ((m = HASH_REF_RE.exec(text))) {
    const line = lineOf(text, m.index);
    if (byLine.has(line)) continue;
    byLine.set(line, {
      path: m[2],
      startLine: Number(m[3]),
      endLine: m[4] !== undefined ? Number(m[4]) : Number(m[3]),
      rev: m[5],
      hash: m[6] ? m[6].toLowerCase() : undefined,
      full: m[0],
    });
  }
  return byLine;
}

/**
 * §2.2's pin conditions (r), (c), (d), (e), checked in that order against ONE candidate reference on
 * an already grammar-accepted withdrawn-test row (own path, single line, commit-id-shaped rev).
 * (r) `revResolvesToCommit` (§2.4). (c) the pinned line's hash recomputes. (d) that same historical
 * line, read by `extractClaimedTests`, names at least one test -- the row-level analogue of
 * `findMarkedSpan`'s per-claim condition (d), generic rather than name-specific because a row is
 * checked on its own, independent of any one claim (§2.2). (e) `isAncestorOfMain`, SKIPPED (not
 * failed) when `origin/main` does not resolve. Returns `{ ok: true }` or `{ ok: false, reason }` using
 * §7's exact pin-refusal text.
 */
function withdrawnRowPinCondition(root, relPath, ref) {
  if (!revResolvesToCommit(root, ref.rev)) return { ok: false, reason: 'refused: rev is not a commit' };
  const content = gitShowFile(root, ref.rev, relPath);
  const slice = content === null ? null : linesWithLF(content, ref.startLine, ref.endLine);
  if (slice === null || sha256Hex(slice) !== ref.hash) return { ok: false, reason: 'refused: hash does not recompute' };
  if (extractClaimedTests(slice).length === 0) return { ok: false, reason: 'refused: pinned line names no test' };
  const anc = isAncestorOfMain(root, ref.rev);
  if (anc.checked && !anc.ok) return { ok: false, reason: 'refused: rev not on main' };
  return { ok: true };
}

/**
 * Round 22 item 3 / round 23 item 4 (§2.1, §2.2, TEST-CLAIMS-FOLLOWUPS-PREREGISTRATION.md): every
 * withdrawn-test ROW -- a line in ROW POSITION (`ROW_POSITION_RE`), whatever it otherwise reads like
 * -- is resolved on its own, independent of any claim, whatever the state of any claim on its pinned
 * line and whatever its node's status. A row that fails its own grammar (no pinned reference, another
 * file's path, no commit-id rev, a line range -- §7, checked in that order on the first reference that
 * starts on the row's own line) or its own pin conditions (`withdrawnRowPinCondition`) yields a
 * `withdrawn-row` finding at the row's own line, the grammar/pin reason first, any rider failure
 * appended after `; ` (§7); both riders are always read on the row's own line, in one call (§2.1(d)).
 * A row whose grammar and pin conditions both hold but whose riders fail yields the rider-failure text
 * alone, unchanged from round 21 item 2's own shape. A row that fully holds (grammar, pin conditions
 * AND riders) is never a finding and becomes a candidate for per-claim exemption
 * (`findWithdrawnTestSpan`). Returns `{ findings, validSpans, invalidRowLines }` -- `invalidRowLines`
 * is the Set of PINNED target lines (`ref.startLine`) for a row that passed grammar (own path, single
 * line, commit-id-shaped rev) but then failed its pin conditions or its riders, so the per-claim loop
 * does not also report that row's own defect as an ordinary "not found" claim (round 21 item 2); a row
 * refused at the grammar level never joins it -- a reference naming another file's path, or a range,
 * was never capable of exempting anything in the first place, so nothing needs suppressing for it
 * (§2's invalidator: P2(b) differs recorded, not stopped -- a mention is not an attempt, and the same
 * reasoning keeps a grammar-refused row from swallowing an unrelated claim's own finding).
 */
function computeWithdrawnRows(root, relPath, text) {
  const findings = [];
  const validSpans = [];
  const invalidRowLines = new Set();
  const refsByLine = firstHashRefsByLine(text);
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const lineText = lines[i];
    if (!ROW_POSITION_RE.test(lineText)) continue;
    const lineNo = i + 1;
    const ref = refsByLine.get(lineNo);
    let reason;
    let grammarAccepted = false;
    if (!ref) {
      reason = 'refused: no pinned reference';
    } else if (ref.path !== relPath) {
      reason = "refused: another file's path";
    } else if (!ref.rev || !COMMIT_ID_RE.test(ref.rev)) {
      reason = 'refused: no commit-id rev';
    } else if (ref.startLine !== ref.endLine) {
      reason = 'refused: a line range';
    } else {
      grammarAccepted = true;
      const pin = withdrawnRowPinCondition(root, relPath, ref);
      if (!pin.ok) reason = pin.reason;
    }
    const riders = withdrawnRiders(root, lineText);
    const ok = reason === undefined && riders.ok;
    if (grammarAccepted && !ok) invalidRowLines.add(ref.startLine);
    if (ok) {
      validSpans.push({
        startLine: ref.startLine,
        endLine: ref.endLine,
        rev: ref.rev,
        hash: ref.hash,
        reference: ref.full,
        lineText,
        refLine: lineNo,
        ruling: riders.ruling,
        carrier: riders.carrier,
      });
      continue;
    }
    const message = reason === undefined ? riders.failure : riders.ok ? reason : `${reason}; ${riders.failure}`;
    findings.push({ relPath, line: lineNo, kind: 'withdrawn-row', message });
  }
  return { findings, validSpans, invalidRowLines };
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
 * Returns { findings, planned, superseded, withdrawn, scanned, claims, supersededMainUnchecked,
 * withdrawnMainUnchecked }. A claim entry is { relPath, line, name, kind: 'claim' } (`superseded`/
 * `withdrawn` entries additionally carry `reference`, the matched pin text; `withdrawn` entries also
 * carry `ruling` and `carrier`, the two resolved citations). `plannedGates` is a Set of repo-relative
 * paths whose unmatched claims are advisory, not binding (see PLANNED vs BINDING above); anything not
 * in it is binding. A claim that does not exist is SUPERSEDED, and reported under that heading instead
 * of `planned`/`findings`, when the claiming file's own text pins that exact line as historical and
 * proves it (see the module's own SUPERSEDED disclosure above and `supersededSpans`/
 * `findSupersededSpan`) — checked whether or not the file is also planned. A claim pinned by a
 * `withdrawn-test` reference is WITHDRAWN instead, when its own line's `ruling:`/`carrier:` citations
 * both resolve against `DECISIONS-PENDING.md` (round 20 item 1; see
 * `computeWithdrawnRows`/`findWithdrawnTestSpan`); a withdrawn-test line is never also read as
 * superseded. `supersededMainUnchecked` is true when at least one superseded claim's condition (e)
 * could not run (no `origin/main` in the scanned tree) — the caller surfaces that once, not per claim;
 * `withdrawnMainUnchecked` is the same surfacing for a withdrawn claim's own condition (e).
 *
 * Round 21 item 2 (entry 136); round 22 item 3 and round 23 item 4 (§2.1, §2.2,
 * TEST-CLAIMS-FOLLOWUPS-PREREGISTRATION.md): every line in ROW POSITION (`ROW_POSITION_RE`) is ALSO
 * checked ON ITS OWN by `computeWithdrawnRows`, independent of the per-claim loop below (which only
 * ever runs for a claim that does not already exist, and only ever asks whether THIS ONE claim is
 * exempted) — whatever the state of the claim on its pinned line (even a claim that still exists, or
 * no claim at all) and whatever its node's status (planned claims are never exempt from this). A row
 * that fails its own grammar (no pinned reference, another file's path, no commit-id rev, a line
 * range) or its own pin conditions is a `kind: 'withdrawn-row'` finding naming the ROW's own file:line
 * and, per §7, the grammar/pin reason with any rider failure appended — always pushed to `findings`
 * (never `planned`), one per invalid row, since a row "covers every claim on its pinned line" (consult
 * §1) rather than being reported once per claim: a name on an invalid, but grammar-accepted, row's own
 * pinned line is therefore never ALSO reported as an ordinary "not found" finding by the per-claim loop
 * below (it would be the same defect reported twice) — a row refused at the grammar level carries no
 * such suppression, since it was never capable of exempting anything to begin with (§2.1(b): a mention,
 * or a reference to another path or a range, is not a withdrawal attempt).
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
  const withdrawn = [];
  let claims = 0;
  let supersededMainUnchecked = false;
  let withdrawnMainUnchecked = false;
  for (const rel of targets) {
    const text = fs.readFileSync(path.join(root, rel), 'utf8');
    const isPlanned = exempt.has(rel);
    const { findings: rowFindings, validSpans: withdrawnSpans, invalidRowLines } = computeWithdrawnRows(root, rel, text);
    findings.push(...rowFindings);
    const spans = supersededSpans(rel, text);

    for (const c of extractClaimedTests(text)) {
      claims++;
      if (testExists(c.name, index)) continue;
      if (invalidRowLines.has(c.line)) continue; // reported once, at row level (round 21 item 2)
      if (withdrawnSpans.length) {
        const { span, mainUnchecked } = findWithdrawnTestSpan(root, rel, c.line, c.name, withdrawnSpans);
        if (span) {
          if (mainUnchecked) withdrawnMainUnchecked = true;
          withdrawn.push({ relPath: rel, line: c.line, name: c.name, reference: span.reference, ruling: span.ruling, carrier: span.carrier });
          continue;
        }
      }
      const { span, mainUnchecked } = spans.length
        ? findSupersededSpan(root, rel, c.line, c.name, spans)
        : { span: null, mainUnchecked: false };
      if (span) {
        if (mainUnchecked) supersededMainUnchecked = true;
        superseded.push({ relPath: rel, line: c.line, name: c.name, reference: span.reference });
        continue;
      }
      (isPlanned ? planned : findings).push({ relPath: rel, line: c.line, name: c.name, kind: 'claim' });
    }
  }
  return { findings, planned, superseded, withdrawn, scanned: targets.length, claims, supersededMainUnchecked, withdrawnMainUnchecked };
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
  const { findings, planned, superseded, withdrawn, scanned, claims, supersededMainUnchecked, withdrawnMainUnchecked } = runVerifyTestClaims({
    repoRoot: REPO_ROOT,
    plannedGates,
  });
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
    if (supersededMainUnchecked) {
      console.error('  note: origin/main did not resolve in this tree — condition (e) (the pinned rev must be shown to be an ancestor of main) was SKIPPED, not verified, for at least one claim above.');
    }
  }
  if (withdrawn.length > 0 && !quiet) {
    console.error(`verify:test-claims withdrawn (advisory) — ${withdrawn.length} claimed test(s) pinned withdrawn by a ruling and a carrier:`);
    for (const w of withdrawn) {
      console.error(`  - ${w.relPath}:${w.line} — claims test \`${w.name}\` — withdrawn — pinned by ${w.reference} — ruling: ${w.ruling}; carrier: ${w.carrier}`);
    }
    if (withdrawnMainUnchecked) {
      console.error('  note: origin/main did not resolve in this tree — condition (e) (the pinned rev must be shown to be an ancestor of main) was SKIPPED, not verified, for at least one withdrawn claim above.');
    }
  }
  if (findings.length === 0) {
    console.log(`verify:test-claims PASS — all ${claims} claimed test(s) across ${scanned} file(s) exist or are planned, superseded or withdrawn (${planned.length} planned, ${superseded.length} superseded, ${withdrawn.length} withdrawn, advisory).`);
    return;
  }
  if (!quiet) {
    console.error(`verify:test-claims FAIL — ${findings.length} finding(s):`);
    for (const f of findings) {
      if (f.kind === 'withdrawn-row') {
        console.error(`  - ${f.relPath}:${f.line} — withdrawn-test row invalid — ${f.message}`);
      } else {
        console.error(`  - ${f.relPath}:${f.line} — claims test \`${f.name}\` — not found in any test file`);
      }
    }
  } else {
    console.error(`verify:test-claims FAIL — ${findings.length} finding(s) across ${scanned} file(s).`);
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
