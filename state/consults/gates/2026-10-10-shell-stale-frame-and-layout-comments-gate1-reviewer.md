# PR #203 gate 1 — reviewer
Reviewed: cut/shell-stale-frame-and-layout-comments @ dc28956433983592f291ab1a249bdf6074fd3981

**Verdict: FAIL, on Evidence only (E1, the gate route). Correctness: PASS. Documentation: 6 findings (D1 to D6), each to be fixed in this PR before the merge.**

I worked at the head in D:/wt/docb, and it was clean before and after (`git status --porcelain` printed nothing, stash list 0). I made no commit, no tracked edit and no remote write. Temporary files went to my scratch folder; I also deleted two stray files I had written to /tmp. The diff was `origin/main...HEAD`, merge-base 78fc2c7e0503e38d969cf2a9191f72253546f15d (the form's commit on main).

## 1. The Out-of-scope line (read first)
The line holds. No ADR file, nothing under `protocol/` or `scripts/plan`, and no wire item is touched.

On the guarantee category:
- `layoutBoundary.test.ts`'s header is narrowed, by the human's ruling, to what the unchanged scan proves.
- No property under test changes: the scan, its assertions and the test names are byte-identical (see check 3).

No §21a category is touched, so the line is not a block-on-sight. The size trigger is a separate matter (E1).

## Evidence (blocking)

**E1. The single gate is closed by §21c's file bound, so an architect gate is owed.**
- `AUTONOMY.md:350` sets the bound at "≤ 150 changed lines of non-generated code across ≤ 8 files".
- `AUTONOMY.md:353` says "a diff that crosses any one of the four bounds takes full gating (§21a) regardless of its category".
- §21b (`AUTONOMY.md:336`) allows the single gate only for changes that "stay under §21c's threshold".
- The form's Scope line declares "12 files".
- The diff touches 11 files. Nine of them are `.ts`, `.tsx` or `.mjs` files, so even counting code files alone the bound is crossed (9 > 8).
- The exempt set (question round 5, item 2) is only the piece's own form and obliged governing-doc sentences.
- The human's placement says the docs lane's "form and gates follow the usual rules for its size" (`state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:20`). No ruling exempts the file count.
- Of the seven five-line forms on main, this is the only one that declares more than 8 files.
- Precedent: PR #192 gate 1, E1 (`state/consults/gates/2026-10-08-reuse-round-1-bundle-gate1-reviewer.md:20`), and the #167 gate-1 S1-1 it cites. In both, a five-line form over §21c closed the single gate and an architect gate was owed.
- The line budget alone is within bounds: 134 of 140.
- **Fix, either:**
  - open the architect gate. This report's Correctness verdict and checks can stand as the reviewer half.
  - or put the file-count question to the human. Exempting it is the human's call, not the custodian's.

## Correctness: PASS
- **Scope.** Every changed file is on the Scope line. PLAN.yaml is not touched yet.
  - Row S1: only its one sentence changes. The result log is untouched (still blank at the head).
  - MP-1 form: one appended section (`### Amendment 7`), nothing above it edited. The hunk is 11 added lines at the end of the file, 0 deleted.
  - `layoutBoundary.test.ts`: only its header doc comment changes.
- **§21c count** (`git diff --numstat origin/main...HEAD`): 81 insertions + 53 deletions = 134, within 140. This matches the PR body.
- **Code and strings byte-identical, by my own script** (`codeident.cjs`, in my scratch folder):
  - Method: the TypeScript parser (`typescript` from the worktree's `node_modules`) reads the base and head copies of each file. Every leading and trailing comment range is masked. The script compares (a) every remaining non-blank line in order and (b) every string literal, template part and JSX text node.
  - Result: IDENTICAL for all 9 files, rc 0, with zero parse diagnostics. Code lines, base/head: residency-harness.mjs 1577/1577, style.mjs 460/460, WorkingCanvas.tsx 954/954, hoverRepickConstants.ts 3/3, ConsolePanel.tsx 158/158, layoutBoundary.test.ts 34/34, PublishPanel.tsx 396/396, residencyStatus.ts 109/109, StylePanel.tsx 126/126. String counts are equal too.
  - Controls:
    - a one-character change in `STALLED_SUFFIX` gave DIFFERENT, rc 1;
    - a comment-only change gave IDENTICAL, rc 0;
    - one extra space in a ConsolePanel code line gave DIFFERENT, rc 1.
- **Row S1, by script:**
  - Line 24 of the docs-lane directive at 78fc2c7e holds exactly 2 double-quoted texts.
  - The old text occurs once in the base walkthrough. The new text occurs 0 times in the base and once in the head.
  - The head equals the base with that one replacement (`true`). Only line 1579, the `| S1 |` row, changes. rc 0.
- **Amendment 7 and the form's Authority pins.** Every hash recomputes, by `git show <rev>:<path> | sed -n '<a>,<b>p' | sha256sum`:
  - Amendment 7's three pins at 78fc2c7e: directive:24 `1dfec7f8…`, MANUAL-WALKTHROUGH.md:1579 `121c10ef…`, four-findings:9 `50bb3189…`.
  - The form's six pins at 25e21225: lines 24, 17-21 and 6, the string-6 directive 6-11, sweep E:23, slot-orders:44 and four-findings 6-10.
  - All 9 match. Both 78fc2c7e and 25e21225 are ancestors of origin/main (round 15 (e)).
  - Item 2's pinned span is the old S1 row, the one the diff replaces. Item 3 names its branch commit 4190e428 by id, not by hash (round 25, item 2).
  - Item 4 ("result log is unfilled") is true at the head.
- **Comments checked against what they claim** (code and rulings at 78fc2c7e). These hold:
  - residencyStatus.ts's frame comment: `App.tsx:1910` has the `"status.residency"` slot, and no `.canvas-status-stack` selector remains in `src/`, only CSS comments.
  - String 1: the 2026-09-05 block ("1 approved") and the 2026-09-06 block ("1/2/4 confirmed").
  - String 2: 'not fetched'→'not loaded'.
  - String 3: the 2026-09-06 trim. The constant contains "first data load".
  - String 4: confirmed 2026-09-06.
  - String 5: "part of this view failed to load".
  - String 6: entry 45's RULED block, (1) String 6 = A (see D3 on the "byte-copied" label).
  - `HOVER_REPICK_ON_PAN`: the RULED 2026-09-14 question set B, item B3 (entry 75 (1)). The constant is still `true`, matching "Default stays pan+zoom". The paraphrase carries no quotation marks.
  - deck.gl:
    - `package.json:43` reads `"@deck.gl/core": "^9.3.7"`;
    - the lockfile's `node_modules/@deck.gl/core` is `"version": "9.3.9"`, which is also what is installed;
    - 9.3.7 stays at WorkingCanvas.tsx:93 and :1926, both observation sites.
  - StylePanel:
    - Style is an `INSPECTOR_TABS` entry, and `App.tsx:1957` has the `"inspector.style"` slot;
    - `.canvas-container` is `height: 100%` with no min-height;
    - `layoutConstants.ts` has `MAP_MIN_WIDTH_PX`/`MAP_MIN_HEIGHT_PX`;
    - styles.css's `.style-panel` and `.publish-panel` comments each open with a HISTORY line.
  - ConsolePanel's slot: `App.tsx:1986` mounts `<ConsolePanel />` unconditionally in `"activity.console"`.
  - layoutBoundary header: `regionParts.tsx:7-8` and `statusItems.ts:4-5` import `../App`, and the scan resolves direct relative specifiers only.
  - style.mjs: later `setExpanded(page, true)` calls are no-ops by its own guard, and there is no `setExpanded(page, false)`.
  - residency-harness.mjs: `App.tsx:1869` has `"attention.canvasRefusal"`.
  - The comments that do not hold are listed as D1, D2 and D4.

## Documentation (must be fixed in this PR before the merge; no re-gate)

- **D1. PublishPanel.tsx names the wrong region, and the PR body repeats it.**
  - `frontends/shell/src/publish/PublishPanel.tsx:309` (head) now reads "Placed in the Layers region's Export section".
  - At the base, the `section.*` slots, Export among them, render inside the Inspector's Layer tab:
    - `frontends/shell/src/layout/contributions.ts:64` @ 78fc2c7e reads "the Inspector's Layer tab takes one per section";
    - `StudioLayout.tsx:256-262` @ 78fc2c7e maps `LAYER_SECTIONS` inside `inspector-panel-layer`;
    - `INSPECTOR_SLOT_IDS` includes them.
  - The old text ("the Inspector's Export section") was the right one, so this change makes a correct comment wrong.
  - The PR body's sentence "the Export section's region is also corrected from the Inspector to the Layers region", and item 6 of the worker report, state the same false fact.
- **D2. residencyStatus.ts still quotes string 2's draft wording as if it shipped.**
  - The corrected marker at `frontends/shell/src/residency/residencyStatus.ts:354` (head) says string 2 was ruled to "not loaded".
  - The bullet below it, at `:358-359`, still quotes the relinquished string ending "the rest of this view was not fetched."
  - The shipped template at `:436` ends "was not loaded."
  - The paragraph has lost its "still draft-marked" framing, so the quoted bullet now reads as the shipped string.
- **D3. String 6 is labelled "byte-copied" but is a whitespace-collapsed copy** (`residencyStatus.ts:399` and `:423`, head).
  - Entry 45's RULED block wraps "direction-free as" and "shipped" across a line break with indentation. The span is therefore not byte-for-byte; the worker report discloses the collapse.
  - Why this is Documentation and not Correctness:
    - every word matches;
    - the comment uses no quotation marks;
    - the span is byte-identical to the human's own instruction at `state/directives/2026-10-10-string-6-doc-comment-in-shell-stale-frame-comments.md:8`;
    - `scripts/plan/verify-quotes.mjs:199` @ dc28956433983592f291ab1a249bdf6074fd3981 normalises with "collapse whitespace".
  - The label still overstates. It should not claim byte identity with entry 45.
- **D4. ConsolePanel.tsx's rewritten line keeps an unsupported attribution** (`frontends/shell/src/console/ConsolePanel.tsx:21`, head).
  - The line says `docs/07`'s "Current focus" text "asked for a" bottom drawer.
  - docs/07 has no "Current focus" text and no drawer: `git log -G "[Dd]rawer" -- docs/ CLAUDE.md NEXT-CUT.md state/NEXT-CUT.md` finds no commit. The console item, at docs/07 lines 31-37 in the base, says nothing of a drawer.
  - The attribution came in with 1d30926e and was carried into a changed line. It should be named as unsupported or dropped.
- **D5. Three changed lines were never re-wrapped:**
  - `frontends/shell/e2e/style.mjs:248` (151 columns);
  - `frontends/shell/src/canvas/WorkingCanvas.tsx:2072` (142);
  - `frontends/shell/src/residency/residencyStatus.ts:399` (128).
  - Neighbouring lines wrap at about 100 columns.
- **D6. Amendment 7, item 5 plans a PLAN.yaml edit outside the form's Scope.**
  - Item 5 promises to raise `geometry-types-beyond-polygons` from generation 7 to 8 in the done commit. `AUTONOMY.md:47` makes that bump obligatory on any amendment.
  - The form's Scope admits only "PLAN.yaml (the two nodes' records)".
  - The closing record should say the third node's bump is the obligatory amendment bump, not a Scope addition.

## Checks run (all at the head)

| Check | Hold | rc | Result |
|---|---|---|---|
| `npm run typecheck` (frontends/shell) | shared, granted on cores 0-7, released | 0 | `tsc --noEmit` clean; its pretypecheck built the viewer and NOTICE |
| `npm test` (frontends/shell) | shared, granted, released | 1 | 77 of 78 files, 1183 of 1184 tests passed |
| `node scripts/plan/verify-cites.mjs` | none | 0 | PASS, 53 loose references advised, none in this diff's files |
| `node scripts/plan/verify-quotes.mjs` | none | 0 | PASS: 121 checked, 90 verified, 30 baselined, 1 advisory, 0 hash-reference errors |
| `node scripts/plan/verify-test-claims.mjs` | none | 0 | PASS, 533 claims |
| `node scripts/plan/verify.mjs` | none | 0 | PASS |
| `node scripts/plan/queue.mjs --check` | none | 0 | current |
| `node scripts/plan/site.mjs --check` | none | 0 | current |
| `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs` | none (96 s) | 0 | 457 pass, 0 fail |

**The one vitest failure looks timing-sensitive, so I have not recorded it as a failure.**
- The test is `src/notices/noticeDeterminism.test.ts` › "produces byte-identical output across two independent runs, including two real cargo calls".
- It hit vitest's 30000 ms timeout. The log shows cargo repeatedly "Blocking waiting for file lock on package cache" while other builds were running under their own holds.
- The diff changes no code. CI's "typecheck · build · vitest · cargo test" passed at this head.
- Per the machine rule, I am reporting it to the custodian for a solo re-run. I did not re-run it.

My first call of verify-test-claims used the path `scripts/evidence/verify-test-claims.mjs`, which does not exist, and failed with MODULE_NOT_FOUND (rc 1). The real script is under `scripts/plan/`, and its result is the row above.

## CI (`gh pr checks 203`, rc 0, all 14 lines, none pending)
L1 portable cargo test (ubuntu-24.04) ×2 pass; cargo test --workspace (windows-latest) ×2 pass; cfg boundary ×2 pass; every commit is signed off pass; no profile path in the range pass; tauri build (NSIS) ×2 pass; test · verify:plan · queue/site drift ×2 pass; typecheck · build · vitest · cargo test ×2 pass.

Both sets of runs (push and pull_request) are at dc28956433983592f291ab1a249bdf6074fd3981. I checked this with `gh run view` on runs 38081629239, 38082318928, 38082318907 and 38082318964.

## PR body against the head
- The base (78fc2c7e), head (dc289564), size (134 of 140) and file list match the diff.
- The byte-identity claim agrees with my own script.
- The body's false statement is D1. Its description of `geometry-types-beyond-polygons` reaching generation 8 is D6.
- Low-profile direction (`state/directives/2026-10-08-low-profile-on-github.md`):
  - the title, the body and all six commit messages carry no outside issue or PR reference and no outside @mention;
  - the only links are the attribution lines.
- The worker report's six-commit list matches `git log origin/main..HEAD`.
