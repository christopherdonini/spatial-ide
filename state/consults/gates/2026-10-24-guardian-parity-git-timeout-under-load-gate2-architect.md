Reviewed: PR #251 at 7780de9b994e455b6768430b7ca5b5132ad077c8, gate 2 (E1, scoped), architect
Verdict: PASS WITH NOTES
cut/guardian-parity-git-timeout-under-load @ 7780de9b994e455b6768430b7ca5b5132ad077c8

**How I checked:** I have no shell, so I ran no git command, test or hash. I read the following with the Read tool:
- my gate 1 report and the reviewer's gate 1 report;
- the D1 worker report;
- the form on main, whole, including §1, §4, §5, §7, Amendment 1 and Amendment 2;
- the series tester report;
- `scripts/hooks/guardian-continuity-parity.test.mjs` in the worktree `C:/dev/wt/gpt` at the head, lines 355-447;
- `tools/mods/spatial-guardian/hooks/continuity.mjs` in the same worktree, lines 25-64.

The diff count since 7235aa0c (6 added, 0 deleted, that file only) is not my own. It comes from the brief and from the worker's numstat.

**Correctness:** no findings. The scope is E1, D1 and D2 only. Correctness passed at gate 1 and is not re-gated (check 4). The one new commit adds comment lines only.

**Evidence:** no findings. E1 is closed (check 1).

**Documentation:** no findings.

**Notes (not findings, nothing blocks):**
- N1. Amendment 2, item 2 names governance-ci run 40087162109 at 7235aa0c, not at the head. §9 requires governance-ci green. 7780de9b changes comments only, so P4's evidence stands. Still, the custodian should confirm that the head's own checks are green before the click (my gate 1 E2 asked for the run at the final head). I cannot run `gh`.
- N2. Byte equality (check 3) was checked visually from the Read output. Read output cannot show trailing whitespace or CR bytes. The byte proof is the worker's `cmp` (rc 0) of the expected lines against the diff's `+` lines. The reviewer or the custodian may recompute it.

---

**Check 1: E1, the three recorded mutations re-observed**
- **Whether they were run:** the reviewer's gate 1 report gives one table row per mutation at 7235aa0c.
  - Each was applied alone in `C:/dev/wt/gpt`, the file was run, and the change was reverted with `git checkout`, with the porcelain empty after each.
  - O1: rc 1, failing PS4a and T35, plus T37.
  - O2: rc 1, failing PS1, PS2, PS3, PS5, PS6, PS8, PS9, PS10 and T35.
  - O3: rc 1, failing T36 only.
  - The mutation texts it names match the recorded ones: O1's `if (c === null) return { judged: true, stale: false };`, O2's `!==`, and O3's `fx.build(dir)` replaced by PS7's build.
  - Commit: §4 asks for the observation "at the instrument commit". 7235aa0c is 6d76bcdb plus comment-only lines; the reviewer checked that no non-comment `+` or `-` lines exist between them. 7780de9b adds comments only. So the code those runs observed is the head's code. My gate 1 fix allowed "6d76bcdb or later on the branch".
- **O1's extra T37 failure is real, from the code:**
  - `continuity.mjs:50-51` turns a failed `log` read into `{ judged: false }`.
  - T37 (test file, line 425) asserts `assert.equal(outcome, 'not judged');` on a timed-out `log`.
  - Under O1 that read becomes judged fresh, so T37 must fail.
- **Comment lines at the head:**
  - Lines 370-373 record O1's re-observation, with the three failing names and the versions.
  - Line 379 (O2) and line 410 (O3) each read `// Re-observed at 7235aa0c (the git-timeout form, section 4) with the same failures.`
  - Each failure list agrees with the reviewer's table and with the original comments: O2's at lines 375-377, O3's at lines 407-408.
- **Amendment 2, item 1** states the re-observation at 7235aa0c and O1's added T37. It names the comment commit 7780de9b by id with no hash, so round 15 (e) does not apply. It states that Amendment 1, item 1's P5 sentence rested on §4's added mutations.
- **P5:** it now rests on what it should, which is the three mutations of §1 and §4, observed at the head's base. Amendment 1's sentence stays as written (append-only), and Amendment 2, item 1 records the correct basis.
  - P5 holds for each mutation's named tests.
  - O1's extra T37 failure falsifies nothing, because P5 says the mutations "fail their named tests as recorded", and they do. The record now carries the extra failure.
- **Round 25:** no record calls a `verify-mutation` run an observation.

**Check 2: D1 and D2**
- **D1 is closed, truly.** Amendment 2, item 4 records L1's hold at `-Minutes` 60 against §7's 30.
  - The series report's L1 hold line reads: `The -What text was "guardian-parity-git-timeout-under-load: governance-ci node --test suite x10", with -Minutes 60.`
  - Its L0 line gives `-Minutes 30`, so naming L1 alone is exact.
  - §7: `The hold is declared with `-Minutes` 30.`
  - This is not class 8 (line budgets and file counts), as my gate 1 found.
- **D2 is closed, truly.** Amendment 2, item 3 says PS18 has no non-zero exit, and that the exit-128 reads are PS4a's `log`, PS19's `show` and PS7's parent show, with PS7 reading fresh. The series report reads `PS4a at position 0, PS19 at position 1, and PS7 at position 2. PS7 is judged. PS18 has no non-zero exit but is still not judged.` In `continuity.mjs`:
  - position 0 is `log` (`:50`), position 1 is `show` (`:54`), and position 2 is the parent `show` (`:59`);
  - a null parent read returns `{ judged: true, stale: false, ... }` (`:60`), which is fresh;
  - PS18's not judged with no exit fits `:57`.
  - Item 3 also adds PS7, which my gate 1 wording left out of the list. It is correct.

**Check 3: the comment lines**
- **Byte equality:** each line agrees, read character by character, with the reviewer's D1 block.
  - Lines 370-373 match the reviewer's report lines 71-74.
  - Lines 379 and 410 each match its line 78.
  - For the bytes themselves, see N2.
- **Placement:** it matches the reviewer's D1 instruction and the worker's report.
  - Lines 370-373 follow the `continuity.mjs` mutation's closing line (369) and come before `// RECORDED MUTATION: in the working tree only` (374).
  - Line 379 follows the inverted-comparison mutation's last line (378).
  - Line 410 follows the PS7-build mutation's last line (409) and comes before the T36 `test(` (411).
- **No other line changed:** numstat `6 0` (brief; worker) means no line was deleted, so no existing line was edited. The six added lines are exactly these six (4 + 1 + 1). I did not run the diff myself.
- **§7 budget:** against main, 109 + 10 = 119 of 130 (worker's numstat), 1 code file. No class 8.

**Check 4: nothing else is re-gated.** Gate 1's Correctness pass stands. 7780de9b adds comments only and changes no code path, `pub` or export item. No ADR is needed.

**Files read:**
- C:/dev/spatial-ide/state/consults/gates/2026-10-24-guardian-parity-git-timeout-under-load-gate1-architect.md
- C:/dev/spatial-ide/state/consults/gates/2026-10-24-guardian-parity-git-timeout-under-load-gate1-reviewer.md
- C:/dev/spatial-ide/state/consults/2026-10-24-guardian-parity-git-timeout-under-load-gate1-d1-worker-report.md
- C:/dev/spatial-ide/state/consults/2026-10-24-guardian-parity-git-timeout-under-load-series-tester-report.md
- C:/dev/spatial-ide/scripts/hooks/GUARDIAN-PARITY-GIT-TIMEOUT-UNDER-LOAD-PREREGISTRATION.md
- C:/dev/wt/gpt/scripts/hooks/guardian-continuity-parity.test.mjs
- C:/dev/wt/gpt/tools/mods/spatial-guardian/hooks/continuity.mjs
