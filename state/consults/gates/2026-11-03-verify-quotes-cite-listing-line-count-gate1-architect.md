Reviewed: PR #275 at 077681ed74fe50c4f8f26017978ed0bcc6ca40d2, gate 1, architect (cut/verify-quotes-cite-listing-line-count @ 077681ed74fe50c4f8f26017978ed0bcc6ca40d2)
Verdict: PASS WITH NOTES

I have no shell, so this report has no sha256 and does not recompute the custodian's numstat. I leave no background shell. I read the head files in `C:/dev/wt/vq` and B's copies as main's, which the custodian's git check confirms. Head-file line numbers below are at 077681ed. The form, the PLAN node, verify-cites.mjs and the reports are cited at main f975d609. I could not read the PR body, because I have no `gh`. I ran no suites: the suite results below are the worker's report, and the reviewer runs the suites.

## Findings by class

**Correctness:** none.

**Evidence:** none blocking. See D1 for one record gap. It cannot change the result: by my reading of the code, the two scripts can only differ in classes (i) and (ii), whatever tree they run over.

**Documentation (must be fixed before the merge, no re-gate):**

- **D1. The P3/P4 tree is not named.** §5 P4 says the runs are "over one clean tree at the base". The worker's report (state/consults/2026-11-03-verify-quotes-cite-listing-line-count-worker-report.md, lines 29-30) says "over one tree" and "the same tree". It ran the base script as an untracked copy in the worktree, so the tree was the worktree's checkout, not ab9b52ab, and the report names no commit for it. Round 15 (c) requires the commit to be named. The report is already filed and is append-only, so the fix goes in the PR body. This is not the human's wording. Replacement words, with the commit taken from the worker's transcript:
  > "P3 and P4 ran over the worktree's tracked tree at <commit id from the worker transcript>, not at the base ab9b52ab as §5 P4 words it. That tree differs from the base only in the two Scope files. Over any tree, the base and head listings can differ on a row only in §5's classes (i) and (ii)."

  Clause check against the code:
  - (1) The commit is a fact the custodian reads from the transcript. I do not supply it.
  - (2) "only in the two Scope files": the diff is two files, per the custodian's numstat. The untracked copy does not enter `buildTrackedIndex`, and the scan set is `defaultScanFiles`, which is the tracked claim files.
  - (3) "only (i) and (ii)", from head verify-quotes.mjs:1086-1097 against base :1085-1095. Let pieces = `split('\n').length` and count = pieces − 1 when the file is newline-ended or empty, else pieces. Then:
    - For 1 ≤ startL ≤ count, both versions take the same in-range branch, because count ≤ pieces.
    - For startL = pieces on a newline-ended or empty file, the base takes the in-range branch with `lines[pieces-1] === ''` and lists `(blank line)`. The head lists it out of range. That is (ii).
    - For startL < 1 or startL > pieces, both versions are out of range. The note's figure is one lower at the head only when the file is newline-ended or empty. That is (i).
    - For a file that is not newline-ended and not empty, count = pieces, so the output is identical.

No other finding. There are no ADR, wire, operation-class (ADR-006) or perf (docs/08) points: this is a developer tool's advisory output, it has no app string, and it makes no performance claim.

## Check 1: §2 against the head

- **The count is countOf's formula, written inline and not imported.**
  - main scripts/plan/verify-cites.mjs:278-281 has `return { pieces, lines: pieces - (text === '' || text.endsWith('\n') ? 1 : 0) };`.
  - Head scripts/plan/verify-quotes.mjs:1085-1087 reads the file once into `candText`, splits it, and has `const count = lines.length - (candText === '' || candText.endsWith('\n') ? 1 : 0); // verify-cites' countOf`.
  - The two formulas are the same. The import line (:137) is unchanged and does not import countOf. There is no export or signature change.
  - The one comment is a trailing comment on the count line, which is within "at most one comment line".
  - The form's pin of countOf (verify-cites.mjs:274-277 @ b84a2b26) is a historical pin. The tree is authoritative: countOf is at 278-281 at main, as the worker also records.
- **The guard and the note use the count.** :1088 is `if (c.startL < 1 || c.startL > count) {` and :1090 prints `count`.
- **The in-range branch is unchanged.** Head :1091-1097 is byte-equal to base :1089-1095 as I read them.
- **Nothing else in the file changed.** The listing hunk accounts for exactly +5/-3: base :1085, :1086 and :1088 were replaced by head :1085-1088 and :1090. That equals the custodian's numstat, so nothing else in the file changed.
- **The header and the docstring are true as worded and are unedited.**
  - The header (:65-70) says "a cited line past its file's end is printed as such, never as an empty string". At the head, every startL > count goes to the out-of-range note, including the line just past the end of a newline-ended file and line 1 of an empty file.
  - The docstring (:1047-1054) says "the cited line is past that file's end, a status string instead". This is true for the same reason.
  - Both texts match base :65-70 and :1047-1054.
- **Nothing is claimed about a range's end (§1).** `c.endL` is not read in the listing, and no text was added about it.

## Check 2: the guarantee category

- **T3, the one changed assertion.** `a_cite_listing_reports_out_of_range_for_a_line_past_the_files_end` changed only its figure: base test :190 `'out of range (file has 4 lines)'` became head :187 `'out of range (file has 3 lines)'`. Its fixture and its other lines are unchanged. Its 5-line RECORDED MUTATION comment (base :178-182) became 2 lines (head :178-179), which Scope permits ("rewritten and re-observed at the head"). This is exactly the defect: the three-line, newline-ended file was counted 4.
- **New tests.** They match §3:
  - T1 (head :191-199): `one\ntwo\nthree\n`, cited at line 4, expects `out of range (file has 3 lines)`.
  - T2 (:202-210): an empty tracked file, cited at line 1, expects `out of range (file has 0 lines)`.
- **No other test text changed.** I account for the test file's +25/-6 entirely in this region:
  - -6 is T3's 5 comment lines and 1 assertion.
  - +25 is 2 comment lines, 1 assertion, and T1 and T2 at 11 lines each with their spacer.
  - The other listing tests are unchanged, compared base against head: the first-line test (:147-160), the ambiguous test (:162-176) and the blank-line test (head :212-225, base :193-206).

## Check 3: §8 item by item, and §5's invalidators

1. **No file outside Scope.** Two files, per the custodian's git check. verify-cites.mjs is unedited.
2. **Only T3's text changed, and no test was removed.** See check 2.
3. **No in-range cite is listed differently.** For 1 ≤ startL ≤ count the branch is identical (see D1, clause 3). My reading: a startL < 1 cite is out of range at both commits, and its note figure falls under (i), not under this item. That is the item's evident intent, and the code matches it.
4. **No record calls a verify-mutation run an observation of a mutation.** The report's line 27 says no verify-mutation run is called an observation, and line 40 calls verify-mutation "(a floor)". I did not read the PR body.
5. **T3's RECORDED MUTATION comment.** It names the full id 0f6800fc0c86066f775c60b8bec113c9403e254f, which is commit 2 on the branch. The comment carries no hash pin, so the round 25 item 2 rule on hash pins at branch commits does not apply. My traces at the head agree with what it records:
   - M3: T3 prints 4, which fails, and so do T1 (4) and T2 (1).
   - Guard removed: `lines[98]` is undefined, so the line lists as `(blank line)`. This matches the report's line 26, which says the old comment's `''` was stale, as the draft predicted.
   - M1 (T1 and T2 fail, T3 passes) and M2 (T2 alone fails) also match §4's table.

   The observation itself is the worker's. I cannot re-run it.
6. **The P4 counts give no invalidator.** Per the report's line 30: 8808 rows in each run, the same keys, 8 in class (i), 0 in class (ii), 8800 identical, 0 other. There is no row-count change. P3 gave identical 38-line output with exit 0 for both. No stop is met. The only gap is the tree's commit, covered in D1.

**Round 25 item 2 checks:**
- §7: 39 lines against the declared 70, no overrun, so class 8 is not engaged.
- There is no scope addition on a standing rule, so class 9 is not engaged.
- No verify-mutation run is called an observation.
- No test-text span is pinned by hash.
- The piece runs on the full form, so the five-line-form dispatch rule does not apply.

**Seams and callers:** there is no cross-module seam and no new `pub` item or export. `listCiteContents`' product caller is main() under `--show-cites` (head :1144-1151).

## Check 4: the record

- **OPEN-1 to OPEN-3.** Amendment 1 records OPEN-1 (A) as taken "by the human's direction of 2026-10-31 (…, item 4), for the human's review on return". It records OPEN-2 (A) and OPEN-3 (A) as "taken the same way".
- **The direction allows this.** Item 4 of the direction lets a non-red-line OPEN item take the drafting agent's recommendation, recorded with its date. None of the three is on its red-line list: none touches a dependency, CI, an ADR or a ruled scope.
- **depends_on.** Amendment 1 records the node's `depends_on: [verify-cites-reversed-range]` as "the custodian's reading, for the human's review on return". PLAN.yaml at main matches: :6139 has that depends_on, :6141 names this form as the gate, and verify-cites-reversed-range is `status: done` (:6281). The node's move to in-progress is the custodian's dispatch commit, not this PR.
- **Nothing goes beyond the record.** The diff is the §2 change and the §3/§4 tests, in the two Scope files. Nothing goes beyond Amendment 1.
- **For the human.** OPEN-1 to OPEN-3 and the depends_on reading wait for the human's review on return under item 4. I give no words on them.

Files read:
- C:/dev/wt/vq/scripts/plan/verify-quotes.mjs
- C:/dev/wt/vq/scripts/plan/verify-quotes.test.mjs
- C:/dev/spatial-ide/scripts/plan/verify-quotes.mjs
- C:/dev/spatial-ide/scripts/plan/verify-quotes.test.mjs
- C:/dev/spatial-ide/scripts/plan/verify-cites.mjs
- C:/dev/spatial-ide/governance/forms/scripts/VERIFY-QUOTES-CITE-LISTING-LINE-COUNT-PREREGISTRATION.md
- C:/dev/spatial-ide/state/consults/2026-11-01-verify-quotes-cite-listing-line-count-five-line-form-architect-draft.md
- C:/dev/spatial-ide/state/consults/2026-11-03-verify-quotes-cite-listing-line-count-worker-report.md
- C:/dev/spatial-ide/state/directives/2026-10-31-away-until-11-04-clicks-from-the-app-270-size-o0-file-open-items-take-recommendation.md
- C:/dev/spatial-ide/governance/PLAN.yaml
