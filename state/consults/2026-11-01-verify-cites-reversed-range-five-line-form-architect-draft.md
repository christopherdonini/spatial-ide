*Custodian's filing note (2026-11-01): the governance lane's form for `verify-cites-reversed-range`, drafted by the architect, read only at main ae71bd8a. The run 00:20:40Z to 00:32:02Z by its transcript (Glob 4, Grep 28, Read 14; no Write, Edit or Bash). Its scan was run by the custodian at main 57ba3f46 (the count is in the form's settlement). Its OPEN-1 to OPEN-3 are not red lines and take its recommendation under the human's direction of 2026-10-31, item 4. Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 09c73b808c65e5a35c779838471974744d565cfb962d4a41f762f0eb28fa4ac8.*

---

Drafted: verify-cites-reversed-range, five-line form, architect

I read main only, in the main checkout at ae71bd8a. The brief names that commit; I have no shell, so I could not confirm HEAD myself. I computed no sha256 anywhere. Every `path:line @ ae71bd8a` below is unhashed, and the custodian pins it by script. Everything below is my own words unless it is marked otherwise. The reason string and replacement words W1 to W3 are new text, not quotations.

---

## The five lines (my draft)

```
Authority: PLAN node `verify-cites-reversed-range` (governance/PLAN.yaml:6276-6292 @ ae71bd8a), graded S3 and placed in the governance lane by the human's directive state/directives/2026-10-23-weekend-open-items-ruled-verify-cites-pin-covering-case-port-2-session-log-test-feature-v0-2-findings-graded.md, item 7; proposed by state/consults/2026-10-23-verify-cites-pin-resolution-and-line-zero-architect-draft.md, OPEN-4; after verify-cites-out-of-range-line-count (#257) and governance-f-tidy-repository-in-place (#270); this form's drafting consult's OPEN-1 (A), OPEN-2 (A) and OPEN-3 (A) taken on the drafting agent's recommendation under state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md, item 4, on <date>; the custodian's scan found <N> reversed ranges at <commit>; the reuse index found no prior art on either search (reversed line range; citation range check), a miss noted here.
Scope: 2 files: scripts/plan/verify-cites.mjs, scripts/plan/verify-cites.test.mjs; declared line budget 100 (insertions plus deletions, tests and comments counted, governance/AUTONOMY.md:357 @ ae71bd8a); this form exempt; no existing test is changed or removed.
Change: verify-cites fails a cite whose range runs backwards (its end below its start, neither end at line 0) whether or not its lines exist, in the tree once a tracked file matches its path and at its pin before the pinned commit is looked up, with the reason `range <start>-<end> of "<path as written>" runs backwards (its end is below its start)`, routed as every other out-of-range finding is; a range with a line 0 in it keeps the line-0 reason, verify-quotes is unchanged, and the header and the two checkers' doc comments are rewritten to say so.
Tests+mutation: a_reversed_rooted_range_in_a_document_is_gated_by_name (new; fails at the base); M1: the backward return's status in checkResolved made `oob-suffix` whatever the tier, and the test fails by name (with a_pinned_reversed_range_fails_even_where_its_lines_exist_at_the_pin). a_reversed_bare_basename_range_is_advice_by_name (new; fails at the base); M2: that status made `oob-exact` whatever the tier, and the test fails by name (alone). a_pinned_reversed_range_fails_even_where_its_lines_exist_at_the_pin (new; fails at the base); M3: checkPinned's backward return removed, and the test fails by name (alone). a_range_ending_at_line_0_keeps_the_line_0_reason (new; passes at the base); M4: the backward helper's end-at-line-0 exclusion dropped, and the test fails by name (alone). Each mutation is observed by applying it, running the named test, recording its failure by name with the commit in a `RECORDED MUTATION` comment, and reverting it.
Out-of-scope: ADR: no status line or amendment; security: nothing ADR-020, ADR-009 or ADR-021 governs (Node's standard library and git only, no dependency, no workflow change); wire: no SKP, data-plane or MCP surface, nothing under protocol/; guarantee: none touched, since no existing test's text or outcome changes, no property under test changes, and no cite on main changes outcome or reason (the custodian's scan, zero reversed ranges); the header gains a sentence for a case it did not state and loses none.
```

Form path: `governance/forms/scripts/VERIFY-CITES-REVERSED-RANGE-PREREGISTRATION.md`. The custodian adds the reuse-index block from the brief as it stands, as the sibling forms do.

**Before committing:** this form, and any comment in the two files, must hold no `path:a-b` token whose end is below its start. Note 1 explains why. In prose, write such a range in words, for example "a range from line 3 to line 2".

---

## Notes (mine)

### 1. The change

**Today.**
- The range is parsed at scripts/plan/verify-cites.mjs:181-182 @ ae71bd8a. The end defaults to the start, and nothing compares the two.
- `checkResolved` (scripts/plan/verify-cites.mjs:298-315 @ ae71bd8a) bounds by `Math.max(startL, endL)`, and `validStart` checks only that both ends are at least 1.
- `checkPinned` does the same (scripts/plan/verify-cites.mjs:328 @ ae71bd8a, and the branch at 339-343).
- So a range from line 20 to line 5 passes wherever line 20 exists. This is OPEN-4's defect (state/consults/2026-10-23-verify-cites-pin-resolution-and-line-zero-architect-draft.md:206-209 @ ae71bd8a).
- The other checker already refuses it. verify-quotes' `linesWithLF` returns null when the end is below the start (scripts/plan/verify-quotes.mjs:670 @ ae71bd8a, a tool claim about that commit), so a hashed reversed range already fails there as out of range.

**Design (OPEN-1 (A), OPEN-2 (A)).**
- One unexported helper. It returns null unless the start is above the end and the end is not 0; otherwise it returns the reason with the path as written (the leading `./` stripped). A reversed range is a fault in the cite's text, so no file, tree or pin can resolve it.
- `checkResolved`: one line after the no-match return. If the helper gives a reason, return `oob-exact` when the exact set is non-empty, else `oob-suffix`, before `inRange` runs. Because the line sits after no-match:
  - a loose path that matches nothing is still skipped;
  - a rooted one still reports that no tracked file matches.
- `checkPinned`: one line before the commit check (scripts/plan/verify-cites.mjs:327 @ ae71bd8a) returns `{ ok: false, reason }`. It is not `missingFile`, so the pin branch (scripts/plan/verify-cites.mjs:436-442 @ ae71bd8a) takes it as the reason, with the same text.
- Routing (scripts/plan/verify-cites.mjs:443-452 @ ae71bd8a) is unchanged:
  - exact is gated, or advisory under the archived prefixes;
  - suffix is advisory;
  - an unpinned rotating ledger stays advisory.
- The move map's written-after check (scripts/plan/verify-cites.mjs:423-427 @ ae71bd8a) still runs first, as it does for any cite.
- `extractCitations` is untouched. verify-quotes imports it, and imports neither checker (scripts/plan/verify-quotes.mjs:137 @ ae71bd8a), so verify-quotes does not change.
- Line 0 comes first because the helper excludes an end of 0. A start of 0 cannot be above a non-negative end. The line-0 sentence at scripts/plan/verify-cites.mjs:14-15 @ ae71bd8a therefore stays true.
- The file-top RECORDED MUTATION in the test file (scripts/plan/verify-cites.test.mjs:6-10 @ ae71bd8a) stays true. The new returns come before `inRange`, so the `<` mutation does not reach T1 to T4.

**Replacement words (mine; not the human's wording; doc comments, so the worker applies them with no re-gate and the PR body lists them).** Each clause is checked against the design above.
- **W1**, inserted after the line-0 sentence (scripts/plan/verify-cites.mjs:14-15 @ ae71bd8a): *A range whose end is below its start, neither end at line 0, never resolves, in the tree or at a pin: once a tracked file matches its path, and wherever its pin is read (before the pinned commit is looked up), its reason says the range runs backwards (the move map's check below still comes first). A range with a line 0 in it keeps the line-0 reason.*
  - "never resolves in the tree": when no file matches, the result is no-match; otherwise the helper's return comes before `inRange`. Holds.
  - "or at a pin": `checkPinned` returns `ok: false` before git is read. Holds.
  - "once a tracked file matches its path ... its reason says": `res.reason` is the helper's text. Unpinned, it is pushed as written, ledger case included. Pinned, `pinReason` is the same text, because it is not `missingFile`. Holds.
  - "wherever its pin is read": a rooted cite with no match that carries a pin gets the helper's text from `checkPinned`. A loose cite with no match is not read at its pin, as today. Holds.
  - "the move map's check below still comes first": it runs at lines 423-427 before the status check. Holds.
  - "keeps the line-0 reason": the helper is null when the end is 0, so the existing line-0 returns apply. Holds.
- **W2**, the status list in checkCitation's doc comment (scripts/plan/verify-cites.mjs:289-290 @ ae71bd8a): add ", or the range runs backwards" before the closing parenthetical on both the `oob-exact` and the `oob-suffix` lines. Holds by the tier choice above.
- **W3**, checkPinned's doc comment (scripts/plan/verify-cites.mjs:317-323 @ ae71bd8a): add *A range whose end is below its start fails before the commit is read.* Holds by the top return.

**References this changes on main, found by reading (a floor).** Grep cannot compare numbers, so I covered these classes and checked each pattern against a positive control:
- **P1, the end has fewer digits than the start.** The pattern is `[A-Za-z0-9_][A-Za-z0-9_./+-]*:(\d{2,}-\d|\d{3,}-\d{2}|\d{4,}-\d{3}|\d{5,}-\d{4})(\D|$)`.
  - Searched: the root over *.{md,rs,ts,tsx,mjs,js,jsx,cjs}, and separately state/consults/gates, state/drafts, state/cut-archive and site, which `.ignore` hides from Grep.
  - Result: no match anywhere.
  - Control: the forward shape `:(\d-\d{2}|\d{2}-\d{3})` matched 395 times across 206 files at the root, and 71 across 45 files in gates.
- **P2, equal length with a lower first digit.** The lengths covered were 1 to 5 at the root, 1 to 4 in gates, drafts and cut-archive, and 1 to 3 in site.
  - Result: one hit, at state/consults/gates/2026-10-11-crs-undeclared-message-wording-gate1-reviewer.md:105 @ ae71bd8a. It is a clock-time span after a space, not path-shaped, so `isPathShaped` rejects it. It is not a cite.
  - Control: the forward variant matched 490 times across 248 files.
- **P3, equal first digit with a lower second digit.** I covered lengths 2 and 3 at the root and in gates, and length 4 at the root.
  - Result: no match.
- **Not covered by reading:**
  - equal leading two or more digits with a lower later digit, for example a three-digit range that differs only in its last digit;
  - length 5 beyond the first digit;
  - drafts, cut-archive and site under P3.
- **The finding by reading:** no reference on main changes. The proof is the custodian's scan.

**The custodian's scan, before the form is committed** (my script; run from the repository root at the commit the form will land on):

```js
// <scratch>/reversed-range-scan.mjs: node <scratch>/reversed-range-scan.mjs [--forward] [--all]
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const root = process.cwd();
const vc = await import(pathToFileURL(path.join(root, 'scripts/plan/verify-cites.mjs')).href);
const index = vc.buildTrackedIndex(root);
const topDirs = vc.topDirsOf(index);
const forward = process.argv.includes('--forward'); // positive control: must print a non-zero count
const files = process.argv.includes('--all') ? index.files : vc.selectFiles(index, null);
let n = 0;
for (const rel of files) {
  const ext = (/\.([A-Za-z0-9]+)$/.exec(rel)?.[1] ?? '').toLowerCase();
  let text;
  try { text = fs.readFileSync(path.join(root, rel), 'utf8'); } catch { continue; }
  for (const c of vc.extractCitations(text, { commentsOnly: vc.CODE_EXTS.has(ext) })) {
    if (forward ? !(c.endL > c.startL) : !(c.endL < c.startL)) continue;
    n++;
    if (!forward) console.log([rel, c.citeLine, c.pathRaw, c.startL, c.endL, c.pin ?? '-', vc.classifyPath(c.pathRaw, topDirs)].join('\t'));
  }
}
console.log(`${forward ? 'forward' : 'reversed'} ranges: ${n} across ${files.length} file(s)`);
process.exitCode = forward ? (n > 0 ? 0 : 1) : (n === 0 ? 0 : 1);
```

- **The pattern** is the checker's own recognizer: TOKEN_RE at scripts/plan/verify-cites.mjs:125 @ ae71bd8a, reached through `extractCitations` over CI's default file set, plus the test `endL < startL`.
- **The positive control:** run `--forward` first and confirm its exit code is 0. Then run the default scan.
- **The stop rule:** exit code 0 with a count of 0 means commit the form. Anything else is OPEN-3: do not commit.
- **What to file:** the count only. The listing prints the start and end as separate columns, but a pasted row could still carry a reversed token into a tracked file.

**Predicted run** (the worker files it in the hand-back):
- the worker runs main's checker and the head's checker over main's tree;
- both give the same scanned count, the same gated and advisory sets, the same keys, tiers and reasons, and gated 0;
- any difference is a STOP.

### 2. The size (my estimate, against §21c, governance/AUTONOMY.md:347-357 @ ae71bd8a)

| Part | Lines (insertions plus deletions) |
|---|---|
| verify-cites.mjs: the helper and its comment, one return in each checker, W1, W2 (two lines replaced), W3 | about 15 |
| T1 to T4, a run-time cite builder, four RECORDED MUTATION comments | about 40 |
| **Total** | **about 55, across 2 files** |

- It fits the declared 100, and §21c's 150 lines and 8 files.
- It adds no exposure surface and no dependency.
- It has no app or operator surface. The new behaviour is a new finding in governance CI, as with the past-end bound (governance/forms/scripts/VERIFY-CITES-PAST-END-BOUND-PREREGISTRATION.md:8 @ ae71bd8a).

### 3. Tests and mutations (all in scripts/plan/verify-cites.test.mjs)

**Build every reversed cite at run time** (`` const BACK = (p) => `${p}:${3}-${2}` ``, as AT0 does at scripts/plan/verify-cites.test.mjs:342-343 @ ae71bd8a). After the change, a literal reversed token in a comment of this file would itself be gated, because the file is not archived. No RECORDED MUTATION comment may write one either.

- **T1, `a_reversed_rooted_range_in_a_document_is_gated_by_name`.**
  - Fixture: `gitTree` with a 3-line `engine/src/pool.rs` ending in a newline, and `docs/notes.md` citing `BACK('engine/src/pool.rs')`. Then `runVerifyCites`.
  - Asserts: gated length 1, advisory 0, and the reason is exactly `range 3-2 of "engine/src/pool.rs" runs backwards (its end is below its start)`.
  - At the base, gated is 0, because line 3 exists.
  - This is the seam test from the real shape: text, then `extractCitations`, then `checkCitation`, then routing.
  - M1: the backward status made `oob-suffix`. The finding goes advisory and T1 fails, along with T3 (the same routing).
- **T2, `a_reversed_bare_basename_range_is_advice_by_name`.**
  - Fixture: `checkCitation` with path `pool.rs`, start 3, end 2, against `tmpTree` holding the same file.
  - Asserts `oob-suffix`, with the reason starting `range 3-2 of "pool.rs" runs backwards`.
  - At the base the status is `ok`.
  - M2: the status made `oob-exact`. T2 fails, alone.
- **T3, `a_pinned_reversed_range_fails_even_where_its_lines_exist_at_the_pin`.**
  - Fixture: `pinnedRun` (scripts/plan/verify-cites.test.mjs:303-306 @ ae71bd8a) with `BACK('engine/src/pool.rs')` pinned at `rev`, where the file has 5 lines at the pin and 2 in the tree. The key is `gated`.
  - Asserts one entry with T1's reason.
  - At the base the pin passes (3 is at most 5), so gated is empty.
  - M3: checkPinned's return removed. The pin passes again and T3 fails, alone.
- **T4, `a_range_ending_at_line_0_keeps_the_line_0_reason`.**
  - Fixture: `checkCitation` with start 5, end 0, against a 3-line file.
  - Asserts `oob-exact`, with the reason exactly `line 0 does not exist in "engine/src/pool.rs" (lines count from 1)`.
  - It passes at the base, as a regression guard.
  - M4: the helper's end-0 exclusion dropped. The reason turns into the backward text and T4 fails, alone.

**No existing test is touched.** Every existing range runs forward: verify-cites.test.mjs lines 62, 149, 158 and 254, and rotate-decisions-pending.test.mjs lines 269-270, all @ ae71bd8a, by Grep.

### 4. The gate

The reviewer alone (§21b, governance/AUTONOMY.md:334-345 @ ae71bd8a). Reasons:
- 2 files and about 55 lines;
- no §21a category;
- no existing test or property changes;
- the scan predicts no outcome change on main.

The direct precedent is the past-end bound. It newly failed cites, and it took the single gate on a five-line form (governance/forms/scripts/VERIFY-CITES-PAST-END-BOUND-PREREGISTRATION.md:10 @ ae71bd8a).

### 5. Out-of-scope readings

- **ADR, security, wire:** none. There is no product file and no workflow edit.
- **Guarantee** (§21a's fourth bullet, governance/AUTONOMY.md:325-327 @ ae71bd8a):
  - No test asserts reversed-range behaviour, and none changes.
  - The header's "both endpoints" sentence (scripts/plan/verify-cites.mjs:11-12 @ ae71bd8a) stays true.
  - The disclosure list (scripts/plan/verify-cites.mjs:74-86 @ ae71bd8a) does not name reversed ranges, so no disclosed limit is replaced.
  - This differs from the pin-resolution precedent, which took the full form because a fixture changed and a header limit was replaced (governance/forms/scripts/VERIFY-CITES-PIN-RESOLUTION-AND-LINE-ZERO-PREREGISTRATION.md:11-16 @ ae71bd8a). The reviewer checks this line first.
- **Round 25, item 2 (e)** (docs/PREREGISTRATION-TEMPLATE.md:176 @ ae71bd8a): the line asserts that none of the four is touched, so the five-line form is open.
- **What governance CI runs.** .github/workflows/governance-ci.yml at ae71bd8a matches `scripts/plan/**` (lines 87 and 105) and the form through `**/*PREREGISTRATION*.md` (lines 96 and 114). It runs:
  - `node --test` over plan, hooks and evidence (line 150);
  - verify:cites (155), verify:quotes (158), verify:test-claims (161) and verify:plan (166);
  - the buildHealth smoke (171);
  - the queue, site and moved-map checks (174, 177, 180);
  - forms-layout (183);
  - the cfg-boundary job (185-199).
- **The form itself:**
  - verify-cites scans it whole, so it must hold no reversed token;
  - verify-quotes scans it, so the reason string must sit away from its trigger words, and there must be no line cite into DECISIONS-PENDING.md;
  - verify-test-claims reads T1 to T4 as planned once the node's `gate:` names the form.

### 6. Rule (00), path by path

This piece's paths: scripts/plan/verify-cites.mjs and scripts/plan/verify-cites.test.mjs, plus the form on main.

| Branch | Overlap |
|---|---|
| `cut/b2-piece-1c-save-and-reopen` | nothing under scripts/; disjoint |
| `cut/port-2-macos-l1-and-app-dirs` | scripts/plan/cfg-boundary.mjs and its test; disjoint files. On main, cfg-boundary imports only node:child_process and node:fs (scripts/plan/cfg-boundary.mjs:24-25 @ ae71bd8a), and CI runs it as a separate job. |
| `cut/b1-shell-half-pr-c` | 0 files; disjoint |
| open PRs | none |

- Nothing touches protocol/.
- The branch path lists are the brief's; I cannot read branches.
- With the scan at zero, no branch's CI changes from this piece, unless a branch adds a reversed range. The custodian can run the same scan on each branch before it merges.

---

## OPEN items

None of these is a red line. The human's directive of 2026-10-23, item 7, ruled the grade and the placement, not the design. So each takes my recommendation under the 2026-10-31 directive, item 4.

- **OPEN-1, what a reversed range does.**
  - (A) It fails by name with its own reason (drafted).
  - (B) Keep today's outcome and disclose it in the header's list of what the check does not catch, as a documentation-only change.
  - (C) Read it as the span between its two lines, passing when both exist. The outcome is the same as today.
  - (D) Fail it with the existing "exceeds" reason. That would print a false statement.
  - **Recommend A.**
    - A reversed range names no span, so it is a defect of the text.
    - verify-quotes already refuses one (scripts/plan/verify-quotes.mjs:670 @ ae71bd8a), so the two checkers agree.
    - The scan predicts no outcome change on main.
- **OPEN-2, where the check sits.**
  - (A) After no-match in the tree, and first in checkPinned, naming the path as written (drafted).
  - (B) Inside checkPinned's per-path loop beside the line-0 branch, naming each path at the pin. This keeps the missing-file and directory reasons ahead of it, but it adds cases, and the final reason then depends on path order.
  - (C) One check in runVerifyCites before resolution. This would gate a loose basename cite that is advice today, and an external reference that is skipped today.
  - **Recommend A.** It is the smallest change, it keeps every existing tier, and it gives one reason text.
- **OPEN-3, if the scan finds any reversed range.**
  - (A) Do not commit the form, and return it for a re-draft (drafted as the stop).
  - (B) Add a legacy list inside this piece, as the past-end bound did. That adds a third file and a design.
  - (C) Edit the citing files. That goes outside Scope, and may reach filed records, which cannot be edited.
  - **Recommend A.**

---

## What I could not settle

- HEAD = ae71bd8a, all hashes, and the branches' contents: I have no shell.
- The scan classes my reading did not cover (note 1). The custodian's script is the proof.
- The line estimates are reasoned, not counted.
- The node's `budget_minutes` is 30. The sibling's was raised to 60 at its settlement. That is the custodian's call.
