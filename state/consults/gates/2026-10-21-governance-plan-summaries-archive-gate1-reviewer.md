Reviewed: PR #237 at 2d60ac164e7a65e29e5e55a27eaa202062d31b83 (base b5c1c841), gate 1, reviewer
Verdict: FAIL
Branch and commit reviewed: cut/plan-summaries-archive @ 2d60ac164e7a65e29e5e55a27eaa202062d31b83. The cites below are read at that commit.

The gate fails on one Correctness finding, C1. Every other check this brief names reproduced.

**Disclosure.** Main moved while I worked, from b5c1c841 to 12807513, through the custodian's own filings. I ran `git fetch origin` twice. That updates the shared repository's remote-tracking refs and nothing else. After finishing my own pass I read the architect's gate-1 report, which was filed on main at 12807513. I had found C2 on my own, but I had missed C1. I then reproduced C1 myself, and the evidence is under C1 below.

## Correctness

**C1 (blocks). R15 fails as soon as PLAN.yaml holds pointers, that is at S10 and on main after the click.**
- **Where:** `scripts/plan/rotate-plan-summaries.test.mjs:342`. The temporary repository gets the real PLAN.yaml and nothing from `state/cut-archive/`.
- **Why:** `findCandidates` runs with `holds` (`scripts/plan/rotate-plan-summaries.mjs:185-188`). The run therefore refuses on the first pointer, whose archive is not in that repository.
- **A second fault:** `gone.length >= 2` at :357 fails after any later rotation that leaves no unkept real candidate.
- **Reproduced:**
  - In a throwaway clone, I staged the script's own move at M0, which is S10's shape.
  - R15 alone then exits 1, with `rotate-plan-summaries: refusing — self-check-false-readings: its pointer names an archive that is not tracked at HEAD or does not hold that id. Nothing was written.`
  - The full CI globs inside a shared hold: tests 527, pass 526, fail 1. The one failure is R15; every other test passes on the moved tree.
- **Consequences:**
  - D1-b's "`node --test` counts equal" fails, which is I2.
  - Governance CI goes red at S10 and on main.
- **Fix, before S9:**
  - R15 commits every tracked `state/cut-archive/PLAN-SUMMARIES-*.yaml` from REPO_ROOT into the temporary repository, in its first commit, dated PAST.
  - :357 becomes `gone.length >= 1`, keeping the synthetic-node checks.
  - MR15 is re-recorded at the fixing commit.
  - R15 is shown passing against a rotated tree before S10.

**C2 (low; not reachable in ordinary use; fix in the same round, since C1 reopens the code). After the write and `git add`, a failed git call says that nothing was written.**
- **Where:** the git calls at `scripts/plan/rotate-plan-summaries.mjs:233-237` sit outside the `Stop` try at :226-232.
- **Why:** `run` turns every failure into a `Refusal` (:170), and the top-level handler then prints `Nothing was written.` (:246). By then both files are written and staged.
- **Reachability:** this needs a git process to fail after a successful `git add`.
- **Fix:** make every failure after line 225 a STOP.

## Evidence

Nothing blocks. R8a's CLI half shows a locator refusal instead of a round-trip mismatch. That is disclosed (Amendment 2 item 4), and I accept it.

## Documentation (must be fixed before the merge; no re-gate)

None of these sentences is the human's wording, so the worker or custodian applies the words and the PR body lists them.

**Doc-1. `scripts/plan/README.md:375`, the exit-code sentence.**
- **Problem:** its exit 2 names STOP only for a blob mismatch. A failed write or `git add` (:226-232) is also a STOP, and an unexpected error prints a stack (:246).
- **Words (they assume C2's fix):** "Exit codes: 0 (it staged the move, was not due, had nothing to move, or printed a dry run) and 2 (it refused, or failed on an unexpected error, before writing anything; or STOP, when anything failed after the first write, with nothing rolled back)."
- **Clause check:**
  - The exit-0 cases are :193-196, :197-200, :212-222 and :239.
  - Every `Refusal`, `YamlSubsetError` and `PlanValidationError` is thrown before :225.
  - The stack branch is at :246.
  - STOP covers :226-237 once C2 is fixed.

**Doc-2. `scripts/plan/README.md:377`, the opening sentence `When due it stages two files and nothing else:`.**
- **Problem:** it is untrue for a due run with nothing to move (:197-200) and for a dry run (:212-222).
- **Words:** "When it is due, has something to move and is not a dry run, it stages two files and nothing else: `PLAN.yaml` with each moved summary line replaced by one generated pointer, and a new `state/cut-archive/PLAN-SUMMARIES-<date>.yaml` holding each moved node's id and its summary line byte for byte."
- **Clause check:**
  - The run's conditions are checked at :193, :197 and :212.
  - The staging is at :225-229.
  - The pointer is built at :74-80 and the archive at :81-82.

**Doc-3. `scripts/plan/rotate-plan-summaries.test.mjs:2-4`, the header comment.**
- **Problems:**
  - "a é escape" names the wrong thing: the fixture holds a `\u00e9` escape (:75).
  - "No date is typed" is untrue: the fixtures type 2020-01-01 archive names, a 2026-01-01 RESOLVED date and opened dates.
- **Words, from "a \" escape" to the end of the comment:** "a \" escape, a \u00e9 escape, a ` #` sequence, a `: ` sequence and a trailing comment. The dates the assertions read are not typed: the archive's name comes from the machine clock, the past from epoch arithmetic; the fixture dates (the 2020-01-01 archive names, the nodes' opened date, the RESOLVED marker's date) are data no assertion compares with the clock. A run across UTC midnight can fail the tests that read today's date."
- **Clause check:**
  - PAST comes from epoch arithmetic (:23), and `today()` reads the clock (:24).
  - R12's due result comes from `%cI` of the commit date, not from the name.
  - `classify` reads only `[RESOLVED`.

**Doc-4 (mine). `scripts/plan/rotate-plan-summaries.test.mjs:54-55`.**
- **Problem:** it reads `// Each mutation below was applied alone to scripts/plan/rotate-plan-summaries.mjs at d93607315ede, this file run, the failure read by name, and the`. That is untrue for:
  - MR7, MR11, MR12 and MR14, made at e11f7275;
  - MR16, made at e11f7275 and applied to this test file;
  - MR15, made at a73689f3.
- **Words:** "// Each mutation below was applied alone at the commit its line names — to scripts/plan/rotate-plan-summaries.mjs, except MR16, which was applied to this file's R16 — this file run, the failure read by name, and the mutation reverted with the porcelain clean. These are observations by application, not verify-mutation runs."
- **Clause check:**
  - :56-67 name d93607315ede, :68-72 name e11f7275a4c0, and :73 names a73689f3cc62.
  - MR16 (:72) switches R16's path inside this file.

**Doc-5 (mine). `scripts/plan/rotate-plan-summaries.mjs:192`, the comment.**
- **Problem:** it reads `// the human named no size trigger: only .due and .month are used`, but the dry run prints `.reason` (:214).
- **Words:** "// the human named no size trigger, so sizeBytes is 0 and the size branch never fires; .due and .month gate and word the run, and the dry run prints .reason"
- **Clause check:**
  - The size branch needs more than 153600 bytes (`scripts/plan/rotate-decisions-pending.mjs:74-81`).
  - `.due` is read at :193, `.month` at :194 and `.reason` at :214.

**Doc-6 (mine). The S10 predictions contradict each other.**
- **The two sides:**
  - §2 item 4 step 3, §2 item 5 ("the sheet is `state/drafts/plan-summaries-d-obligations.md` on the branch") and E-P's name list put a sheet `.md` on the branch at S10.
  - D1-b declares verify-cites' stdout unchanged from S9 to S10, with no exception named.
- **Probe:** I staged a `.md` under `state/drafts/` in a throwaway clone. verify-cites' count went from 2116 to 2117 files, with stderr identical. The `.yaml` archive is not counted: 2114 before and after S0's hand move.
- **A second gap:** Amendment 3 files the G0 sheets on main, under other names, and does not say whether S10 adds a branch sheet.
- **Words, for the next amendment before S9 (references only), plus the same line in the PR body's "Predicted at S10":** "D1-b, predicted before S9: the S10 commit adds the sheet at `state/drafts/plan-summaries-d-obligations.md` (§2 item 5); verify-cites' stdout file count rises by one at S10, a difference §5 does not name, and by I2 it goes to the human before F0." If no sheet lands at S10, the alternative is: "E-P's name list is read without the sheet."
- **Clause check:**
  - The probe above.
  - The precedent is C's form, Amendment 5 item 5 and Amendment 7 item 5.

**Doc-7. The record.**
- **Problem:** the sheet sha256s in Amendment 2 item 3 and Amendment 3 item 3 carry no `@ <rev>` (round 15 (e)). On this point I agree with the architect's D4.
- **The revs, by `git log --diff-filter=A`:**
  - f2f17760… @ b2df233db725d947c02c001b7d3f0f2db3d9bde6
  - 202ad248… @ b5c1c8418ea6fbfbff98135539e63f57af47abea

**Suggestions:**
- R4 asserts a pointer line of at most `87 + 1` bytes (:155), where the form says at most 87. The real maximum is 85.
- MR15 is the same mutation as MR6, so no mutation is specific to R15's seam.
- `holds` runs one `git show` and one parse per pointer on every run; caching by archive name would bound the cost.

## Block-on-sight (§8)

1. Not triggered (S10 not built).
   - `verifyMove` checks the line count and stray lines (:105-110).
   - The script's real staged output at M0 is byte-identical to my independent hand move: `cmp` exits 0 for PLAN.yaml and for the archive, and the numstat is 153/153 and +309.
2. Not triggered: :111-115, R1, and the same byte-identity.
3. Not triggered: the done and size test at :47; the pointer regex at :23 is §2 item 3's.
4. Not reached.
5. Not triggered.
   - R16 passes against the real settings.
   - The script makes no fetch, commit or push call.
   - A second run on a staged tree exits 2 with the porcelain unchanged.
   - The C2 message is noted under C2.
6. Not reached. No generated file is in the diff.
7. `cmp -n` exits 0 for `AUTONOMY.md` (n=104852) and for `scripts/plan/README.md` (n=28112).
8. Not triggered.
   - The diff touches 4 files, none of them `measure-reads.mjs`, `yamlSubset.mjs` or `plan.mjs`.
   - YAML is read only through `parseYamlSubset` and `loadPlan`.
   - `JSON.parse` at :124 decodes the script's own generated pointer.
9. Not triggered.
10. Not triggered for the script. The test file's wrong claim is Doc-3.
11. Not triggered.
   - No `PLAN.yaml:<n>` or `DECISIONS-PENDING.md:<n>` cite appears in the three-dot diff or in the form.
   - The grep pattern was checked against a positive control.
12. Not triggered: :54-55, the report and the PR body.
13. Not triggered: the M figures reproduce (below).
14. Not triggered.

## What I checked

1. **The diff.**
   - `git diff origin/main...HEAD`: 4 files, 653 lines added.
   - §2 holds item by item, with the disclosed differences: the extra imports and the on-disk refusal.
   - AUTONOMY §35 equals the form's §2 item 7 template with every placeholder resolved: 18 lines, equal by script.
   - Part A in both homes byte-equals the human's item 6 words in the directive's line 23 at M0, whose hash 2df8ce38… recomputes.
   - The README section holds what §2 item 7 lists.
2. **The mutations.** I made every mutation again in my own worktrees.
   - At d9360731 (12/12 before): MR1, MR2, MR3, MR4, MR5, MR6, MR8a, MR8b, MR8c, MR9 (at both parse sites), MR10 and MR13. Each fails its named test, with the same extra failures as the report.
   - MR9 at loadPlan alone leaves 12/12 passing, which confirms the recorded comment.
   - At e11f7275 (17/17 before): MR7, MR11, MR12, MR14 and MR16 (a test-file mutation). Each fails only its own test.
   - At a73689f3 (18/18 before): MR15 fails R15 by name.
   - Each test run exited 1. After each, `git checkout` and an empty porcelain.
   - No `verify-mutation` run is counted as an observation.
3. **S0 at M0.**
   - The seven checks before and after my own hand move all exit 0, and their stdout and stderr are byte-identical (`cmp` exits 0 for all 14 files).
   - The parser's counts: 312 nodes, 195 done, 153 candidates, 405897 moved bytes, 695917 to 290020 bytes, an archive of 309 lines.
   - The staged numstat equals the report's.
   - `profile-path-scan.mjs --staged` exits 0 and prints `profile-path-scan: clean`.
   - **D1-a, M0 against S5 at one worktree path:** every check exits 0.
     - verify-cites' stdout differs only in its file count (2114 to 2116).
     - verify-mutation's stdout and stderr differ, by the 18 new tests.
     - Everything else is identical.
     - `node --test` inside a shared hold: M0 509/509 and S5 527/527, each exiting 0.
4. **The dry run.**
   - **The CLI:** `--dry-run` in a clone whose origin main is M0 and whose branch is S5 exits 0 with empty stderr.
     - It reports 153 candidates, 0 pointers, 0 kept and 405897 moved bytes.
     - With the date and the date-dependent blob substituted, its stdout sha256 equals the report's 03d6637d….
     - For the 2026-10-20 name, the new PLAN.yaml blob is 08beb67d….
   - **The exports**, run at 9831bb21, b5c1c841 and 12807513, give the same result at each: 153 of 195, 405897 moved bytes, 309 lines, no problems.
     - The sizes are 697279→291382, 697601→291704 and 697932→292035.
     - b5c1c841 itself edited PLAN.yaml. Amendment 3's "unchanged to ead5b66a" is true as written.
   - The candidate ids are identical, in order, at M0, at every main rev, from the CLI and from S0, and equal the sheet's 153.
5. **The sheet, checked mechanically by script at b5c1c841.** No problem was found.
   - It has 153 rows, 153 unique, in the same order as the candidates.
   - Each row's markers equal `obligationRows`' current-state markers.
   - The 8 `home: plan` rows name nodes that are proposed, unscheduled or blocked, never done.
   - Entry 115 is kept by `classify` under `## Pending`.
   - The 3 `not owed` rows rest on PR #103: MERGED 2026-09-24T00:36:11Z, with merge commit b0032c80… on main.
   - The 87 `no obligation` rows have no current-state marker.
   - The stays list equals the 54 `stays` rows, in order.
   - The counts are 87, 9, 3 and 54, which add to 153.
   - The worker's 38 unresolved rows are all `stays`.
6. **§7's counting command at the head prints `653 4`.**
   - The script is 249 lines against 230 (class 8, Amendment 2 item 5; §7 is not edited).
   - The test file is 373 against 420, the README 12 against 30 and AUTONOMY 19 against 42.
7. **The checks at 2d60ac16**, every one exiting 0:
   - verify.mjs --offline;
   - verify-cites, 2116 files;
   - verify-quotes: "PASS — 129 checked, 98 verified, 30 baselined, 1 advisory";
   - verify-test-claims;
   - verify-mutation, 18 new tests;
   - queue and site `--check`.
   - PR CI is all pass.
8. **Hashes, recomputed (LF).**
   - The form's 62 pins and all 22 pins in AUTONOMY.md and the README at the head match.
   - The sheets f2f17760 and 202ad248 match.
   - M-1 reproduces twice at M0: out a6bbf369, err 28b5ba5c, 81398 bytes.
   - M-2 reproduces twice: out 3025b309, err 62206f56, 1986 files and 36290933 bytes.
   - M-3 reproduces twice: 695917, 3cd6f1bf.
   - The `measure-reads.mjs` digest is 7b2d33db, and `info/exclude` is 321dffcb at 541 bytes.
   - ripgrep reports 14.1.1 (rev 575938147b).
   - The S0 stdout prefixes match the report for all seven. verify's stdout embeds the worktree path: with the report's paths substituted it gives 53aec55c and 723b1b98.
   - verify-cites' stderr is 0ee477fe, and M0's PLAN.yaml blob is e97957cc.
   - Every commit id in Amendment 2 exists on the branch, and each record commit adds comments only.

I removed all five throwaway worktrees, the clone and its bare origin. C:/dev/wt/psa is untouched: its porcelain is empty at 2d60ac16.
