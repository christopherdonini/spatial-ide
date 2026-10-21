Reviewed: PR #237 at 510f4bacc1521fb85de84628b8686f334a2970aa (base e824cf89), gate 2, reviewer
Verdict: PASS WITH NOTES

Branch and commit reviewed: cut/plan-summaries-archive @ 510f4bacc1521fb85de84628b8686f334a2970aa. The cites below are read at that commit.

The verdict is PASS WITH NOTES. Both Correctness findings from gate 1 are closed, and I reproduced every check the brief names. Nothing blocks. Two Documentation items must be fixed in the PR body before the merge.

**Disclosure.** Main moved from e824cf89 to f23610aa while I worked. I read the form on main at e824cf89. When I read `state/gate-log.json` to check the gate-log numbers 567 and 568, I also saw the head of the gate-log row for the architect's gate-2 entry. I did not read the architect's gate-2 report.

## Gate-1 findings (mine)

- **C1: closed.**
  - The fix is at `scripts/plan/rotate-plan-summaries.test.mjs:346-350`. It takes every archive that `git ls-files` lists for `:(glob)state/cut-archive/PLAN-SUMMARIES-*.yaml` at REPO_ROOT and commits it into the first commit of `mkRepo`. The bytes are read as Buffers, and that commit is dated PAST (:34, :41).
  - :365 now asserts `gone.length >= 1`, and the checks on `synthetic-long-done` and `synthetic-long-ready` are kept.
  - Reproduced in check 3 below. I also ran the S10 shape, which the worker did not run: R15 passes with 99 summaries moved and the 54 `stays` rows kept.
- **C2: closed.**
  - At `scripts/plan/rotate-plan-summaries.mjs:228-240`, the `try` now holds the first write, the staged-blob check and the three output lines.
  - The catch is `throw e instanceof Stop ? e : new Stop(e.message)`. After the try there is only `return 0` (:241).
  - Reproduced in check 3 below.
- **Doc-1 to Doc-5: closed.** All five pairs are applied byte for byte (check 2).
- **Doc-6: closed in the form, not in the PR body.** Amendment 4 item 5 carries the prediction. The PR body's "Predicted at S10" still says "No exception is named." and was not given the line Doc-6 asked for. This is new finding Doc-A below.
- **Doc-7: closed.** Amendment 4 item 4 carries the revs:
  - b2df233db725d947c02c001b7d3f0f2db3d9bde6 is the commit that adds `state/drafts/2026-10-20-plan-summaries-d-obligations-g0.md` (`git log --diff-filter=A`). At that commit the file's sha256 is f2f17760ce35134b71ce720ced20789d6ac94a24b6717614ddd8243a08a89af1.
  - b5c1c8418ea6fbfbff98135539e63f57af47abea adds `state/drafts/2026-10-21-plan-summaries-d-obligations-g0-resolved.md`. Its sha256 there is 202ad248e60756a90ba831dfc601601359b9cca99a0e1710faac83f74ba20b57.
  - Both files have LF line endings (0 CR bytes), and both commits are on main.

## New findings

**Correctness:** none.

**Evidence:** none.

**Documentation (must be fixed before the merge; no re-gate).** The PR body is the custodian's wording, not the human's. The custodian applies the words below, and the PR body records that.

**Doc-A. The PR body's "Predicted at S10" section has no line for D1-b's exception.**
- The bullet is marked "byte-copied" from §5 and ends "No exception is named." Amendment 4 item 5 now predicts an exception before S9.
- Fix: keep the byte-copied bullet as it is, and add this bullet right after it:
  > - **D1-b's exception, predicted before S9 (the form's Amendment 4 item 5):** the S10 commit adds the sheet at `state/drafts/plan-summaries-d-obligations.md`, so verify-cites' stdout file count rises by one at S10, a difference §5 does not name; by I2 it goes to you before S9.
- Clause check: every clause is Amendment 4 item 5, read on main at e824cf89. My gate-1 probe showed a staged `.md` under `state/drafts/` raising verify-cites' count by one (2116 to 2117).

**Doc-B. The PR body does not record correction round 1.**
- It still reads "Both gates at S5 now". Its only count is S5's 653.
- It does not list the five worker-applied word pairs. The wording-block rule (`state/directives/2026-10-11-direction-after-status-review.md`, item 2) says the PR body lists them.
- Fix: replace the bullet "Both gates at S5 now." with "Gate 2, both gates, at 510f4bac (the form's Amendment 5 item 4)." Then add this section before "### Ahead":
  > ### Correction round 1 (the form's Amendments 4 and 5)
  >
  > - Gate 1 at S5: both gates FAIL on C1 (R15 refused once PLAN.yaml holds pointers, because its temporary repository held no archive) and C2 (a failure after the first write was reported as a refusal that wrote nothing).
  > - Fix commit c8c0a294: R15's temporary repository holds every tracked `state/cut-archive/PLAN-SUMMARIES-*.yaml` in its first commit and asserts `gone.length >= 1`; every failure from the first write on is a STOP.
  > - Words applied, none of them yours (AUTONOMY §31): the README's exit-code sentence and its staging sentence, the test file's header comment and its mutation-commit comment, and the due call's comment in the script.
  > - Record commit 510f4bac, comment lines only: MR15 recorded at c8c0a294, and R15 shown on a rotated tree in a throwaway clone.
  > - §7's count at the head: 663 lines over 4 files, against 800 over 6; the script is 251 lines against its 230 (class 8, §7 not edited; Amendment 5 item 3).
- Clause check:
  - C1 and C2 as described: the round's diff (check 1).
  - "From the first write on": the comment at :228 and the try at :228-240.
  - The five words and their places: check 2.
  - "Comment lines only": check 4.
  - 663/4 and 251: check 6.
  - Gate 2 at 510f4bac: Amendment 5 item 4.

## What I checked (each command's output went to a file; its exit code was printed right after)

1. **The round's diff against Amendment 4** (`git diff 2d60ac16 510f4bac`, rc 0; 3 files, 28+/18-).
   - I applied the five word pairs to the 2d60ac16 files by script (rc 0). The README then equals c8c0a294's byte for byte.
   - What remains in the script and the test file (`git diff --no-index`, rc 1 = differ) is exactly:
     - C2's moved block, its new catch and one comment (:228);
     - C1's `ls-files`/`held` lines, the `...held` spread and the `>= 1`, with a two-line comment (:346-347).
   - There is no other code change.
   - Clause check on the C2 comment: mkdirSync is "the first write". It fails only if `state/cut-archive` cannot be a directory, and that directory is tracked, so ordinary use cannot reach that case. The README's "after the first write" therefore holds as written. Recorded here, not raised as a finding.
2. **The word pairs.**
   - The words file's sha256 recomputes to 7dd8947fa08f6885db813d0d902955860e4ea43143d088cbeda931522355b7c9 (rc 0).
   - My pair checker (rc 0, `bad 0`) gives, for all five pairs: `new` occurs once at 510f4bac, `old` occurs 0 times there, `old` occurred once at 2d60ac16, and `old` is not a substring of `new`.
3. **R15 on a rotated tree, made again.**
   - Setup: a throwaway clone at c8c0a294 with a local bare origin whose `main` and `cut/plan-summaries-archive` are both c8c0a294 (push to that bare repo rc 0). HEAD, `@{u}` and origin/main were all c8c0a294, and the porcelain was empty.
   - The script without `--dry-run`: rc 0. It moved 153 summaries and 405897 bytes; numstat 153/153 for PLAN.yaml and +309 for the archive. I committed that in the clone (rc 0). A parser count then shows 153 pointers and 0 long done summaries left, so in R15 `gone` is the synthetic node alone.
   - R15 alone: rc 0, 1/1. The whole file on that tree: rc 0, 18/18.
   - Archive removed (`git rm` and commit, rc 0, 0 archives tracked). R15 then fails: rc 1, failing by name with `rotate-plan-summaries: refusing — self-check-false-readings: its pointer names an archive that is not tracked at HEAD or does not hold that id. Nothing was written.`
   - The S10 shape, beyond the brief: after a reset to c8c0a294, the run with `--keep` set to the PR body's 54 `stays` ids moved 99 summaries and 284775 bytes (rc 0). After the commit, R15 passes (rc 0, 1/1).
   - C2: two untracked copies of the script in that clone, each with `--bogus-flag` added once to the post-`git add` `git diff --cached` call.
     - The c8c0a294 copy: rc 2, stderr `rotate-plan-summaries: STOP — git diff --cached --name-status --no-renames --bogus-flag failed (usage: git diff [<options>] [<commit>] [--] [<path>...]). Nothing was rolled back.`, both files staged.
     - The 2d60ac16 copy, after `reset --hard`: rc 2, stderr `rotate-plan-summaries: refusing — git diff --cached --name-status --no-renames --bogus-flag failed (usage: git diff [<options>] [<commit>] [--] [<path>...]). Nothing was written.`, both files staged.
   - Nothing was pushed except into my own bare origin. My clone-commit ids differ from the record's 62b1e3110a4e and fc5a4924afcd, which no longer exist anywhere (their clone was removed). The record line says so, so I do not raise it as a finding.
4. **MR15 made again** in my own throwaway worktree, detached at c8c0a294.
   - Before the mutation: rc 0, 18/18.
   - I removed `n.status === 'done' && ` at :47 by script; the change is that one line.
   - After: rc 1, 11 fail of 18. Among them is R15 by name: `rotate-plan-summaries: from the real PLAN.yaml, after a run the queue differs only in plan_hash, the site's plan.json only in plan_hash and the moved summaries, and both drift checks pass after regeneration`.
   - Reverted with `git checkout` (rc 0); the porcelain was 0 bytes.
   - The record commit: `git diff c8c0a294 510f4bac` has numstat 2/1 on the test file only, and every changed line begins `// ` (the non-comment line count is 0).
5. **At the head**, in a throwaway worktree at 510f4bac:
   - `node --test scripts/plan/rotate-plan-summaries.test.mjs`: rc 0, 18/18.
   - The CI globs (`"scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`), inside a granted shared hold that was released: rc 0, tests 527, pass 527, fail 0.
   - `verify.mjs --offline`: rc 0, `verify:plan PASS`.
   - `verify-cites.mjs`: rc 0, PASS across 2116 files.
   - `verify-quotes.mjs`: rc 0, PASS, 129 checked, 98 verified, 30 baselined, 1 advisory.
   - `verify-test-claims.mjs`: rc 0, PASS, all 574.
   - `verify-mutation.mjs`: rc 0, PASS, all 18 new tests.
   - The PR's CI checks at 510f4bac are all SUCCESS (`gh pr view 237`, rc 0).
6. **§7 and §8 item 7.**
   - The merge base is 81c34c8b28ac030f15ac4ecacdb72ff48aa66483. The counting command (numstat rc 0, awk rc 0) prints `663 4`: AUTONOMY.md 19, README 12, script 251, test 381. This equals Amendment 5 item 3.
   - `cmp -n` against M0: AUTONOMY.md n=104852 rc 0; `scripts/plan/README.md` n=28112 rc 0.
   - AUTONOMY §35 (ii)'s "writes nothing when it refuses" is now true, because every Refusal is thrown before :228.
7. **The hashes in Amendments 4 and 5.**
   - Every commit id resolves. 2d60ac16 is f4a520c0's child, c8c0a294 is 2d60ac16's child, and 510f4bac is c8c0a294's child. These three are branch commits naming what was built, not span pins.
   - b2df233d and b5c1c841 are on main, and the sheet hashes recompute at them (Doc-7 above).
   - Gate-log entries 567 and 568 (1-based) are this node's gate-1 architect and reviewer FAIL rows.
   - Neither amendment carries a span sha256 of its own.

Cleanup: both throwaway worktrees were removed (rc 0), and so were the clone and its bare origin (rc 0). No `g2r-*` path remains under `C:/dev/wt/`. `C:/dev/wt/psa` is untouched: HEAD 510f4bac, porcelain empty.

Files: C:/dev/wt/psa/scripts/plan/rotate-plan-summaries.mjs, C:/dev/wt/psa/scripts/plan/rotate-plan-summaries.test.mjs, C:/dev/wt/psa/scripts/plan/README.md, C:/dev/spatial-ide/scripts/plan/PLAN-SUMMARIES-ARCHIVE-PREREGISTRATION.md
