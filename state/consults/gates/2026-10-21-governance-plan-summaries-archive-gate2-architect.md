Reviewed: PR #237 at 510f4bacc1521fb85de84628b8686f334a2970aa (base e824cf89), gate 2, architect
Verdict: PASS WITH NOTES

Branch: cut/plan-summaries-archive @ 510f4bacc1521fb85de84628b8686f334a2970aa. I confirmed the commit from the worktree's gitdir. `C:/dev/spatial-ide/.git/worktrees/psa/HEAD` points to `refs/heads/cut/plan-summaries-archive`, and both the loose head ref and `refs/remotes/origin/cut/plan-summaries-archive` read 510f4bac. I read the code in C:/dev/wt/psa. I read the form, the template and the reports on main.

## Gate-1 findings

**C1: closed.**
- **The archive fix.** `scripts/plan/rotate-plan-summaries.test.mjs:348-350` lists every tracked `state/cut-archive/PLAN-SUMMARIES-*.yaml` at REPO_ROOT, reads each as a Buffer (exact bytes), and adds it to `mkRepo`'s first commit, which is dated PAST (:34, :41).
  - `holds` (`rotate-plan-summaries.mjs:185-187`) then finds each pointer's archive at HEAD.
  - `last` (:191) is PAST, so the run is due (:194).
  - The name step (:204, :207) sees the copied names, so a same-day archive is never written over.
  - `.gitattributes:5` (`* text=auto eol=lf`) keeps the copied archives LF on a Windows checkout, the same as the PLAN.yaml check at :343.
- **The count fix.** :365 is now `gone.length >= 1`, and it still checks the synthetic done and ready nodes. `gone` (:364) is every done summary over 300 bytes in the test's input. R15's run has no `--keep`, so in the S10 shape (99 pointers, 54 kept long summaries) the 54 move in the test and :374's per-node check still holds.
- **Not run by me:** the round's report says R15 passes on a 153-pointer rotated tree and refuses by name with the archive removed (round-1 worker report, "Observations"). I have no shell, so I could not re-run either.

**C2: closed.**
- The `try` now opens at :228 with the first write (`mkdirSync`, :229) and holds every later statement up to the "Next:" line (:237).
- `catch` (:238-239) turns every failure into a `Stop`. The only statement after it is `return 0` (:241).
- Every `Refusal`, `YamlSubsetError` and `PlanValidationError` is thrown before :228. The stack branch of :248 can therefore only be reached before any write.
- Against §8: item 5 is not triggered. The not-due, nothing-to-move, dry-run and refusal paths all return or throw before :228, and the round adds no commit, push or fetch call. Items 8, 10 and 11 are not triggered either: the test reads the archives as bytes, not as YAML, and the round adds no typed date and no line cite.

## The applied words at the head (check 2)

- **D1, `scripts/plan/README.md:375`.**
  - True: the exit-0 cases (:195-198, :199-202, :214-225, :241); "refused … before writing anything"; "failed on an unexpected error, before writing anything" (true only because C2's fix is in).
  - One gap: see D5 below.
- **D2, README :377.** Still true. Its conditions are checked at :195, :199 and :214. The two files are at :227 and staged at :231. No commit, push or fetch is passed to git; they appear only in the printed text at :237. After C2, a STOP following `git add` still leaves both files staged.
- **D3, test :2-6.** True.
  - The escapes are in BASE (:79) and the trailing comment is at :93.
  - PAST comes from epoch arithmetic (:25) and `today()` from the clock (:26).
  - No assertion compares a typed fixture date with the clock. The new R15 archive names come from the real tree and no assertion compares them with the clock.
- **Doc-4, test :56-58.** True. MR16's line (:75) is a change to the test file. MR15's line (:76) now names c8c0a2949c84. The new line :77 is an observation, not a mutation, so "Each mutation below" does not cover it.
- **Doc-5, script :192-193.** True.
  - `sizeBytes: 0` is at :194. `isDue` fires its size branch only above ROTATE_BYTES (`rotate-decisions-pending.mjs:77`).
  - `.due` is read at :195, `.month` at :196 and `.reason` at :216.

## The record commit's two lines (check 3)

- **:76 (MR15)** agrees with the report: the status filter was dropped at c8c0a294, R15 failed by name, the other failures are the good-run tests, and the change was reverted with the porcelain clean.
- **:77 (R15 on a rotated tree)** agrees with the report: a clone with a local bare origin at c8c0a294, 153 moved, 62b1e3110a4e, R15 passes; fc5a4924afcd, R15 fails by name; nothing pushed; clone and origin removed. "Refusing at the first pointer" is how :45 behaves, since it throws on the first pointer it meets.
- **Template:** the line names its commit id and no hash, so round 25 item 2's rule on test-text spans pinned by hash at a branch commit does not apply.

## Amendments 4 and 5 (check 4)

- **Amendment 4** has the class-1 first line ("written after both gate reports were seen").
  - Item 4 carries my D4 words byte for byte, with the placeholder filled. Two fixed-string Greps each match once: sentence 1 through the "read @ " that opens sentence 2, and ", the commits adding each sheet." through the end of sentence 3.
  - The revs map in the order the reviewer's Doc-7 gives: f2f17760 @ b2df233d, 202ad248 @ b5c1c841.
  - The item is three sentences, within round 12 (d)'s ceiling, and restates no earlier claim. Each corrected passage is named by amendment and item, so the item serves as its own superseded index.
  - Item 3's account of whose words were applied matches both gate-1 reports.
  - Item 5 says "before S9" where the reviewer's Doc-6 said "before F0". It does not present the reviewer's words as a quote, and "before S9" is the stricter of the two. Not a finding.
- **Amendment 5** carries class 8's words, `budget overrun, §7 not edited`. Its "written after the results were seen" makes items 1, 2 and 4 class 1, read the same way as Amendment 4 item 4.
  - Item 3's arithmetic holds: 251 + 381 + 12 + 19 = 663.
  - It lacks two things class 8 requires; see D6 below.

## Correctness
None.

## Evidence
None blocking. The R15 rotated-tree runs, the MR15 run and the C2 check (done with patched copies of the script, not a test; the brief allowed that) are the worker's. I could not re-run them.

## Documentation (must be fixed before the merge; no re-gate)

None of these is the human's wording, so the worker applies the words and the PR body lists them.

**D5. `scripts/plan/README.md:375`: the first write's own failure.**
- **What is wrong:** a failure of `mkdirSync` or `writeFileSync` (:229-230) is reported as STOP (:228-239). The sentence covers neither "before writing anything" nor "after the first write" for that case. This is my gate-1 wording.
- **Reachable?** Rarely, in ordinary use: for example a file locked on Windows, or a full disk.
- **Words:**

> Exit codes: 0 (it staged the move, was not due, had nothing to move, or printed a dry run) and 2 (it refused, or failed on an unexpected error, before writing anything; or STOP, when anything failed from the first write on, with nothing rolled back).

- **Clause check:**
  - The 0 cases are :195-198, :199-202, :214-225 and :241.
  - Refusals are thrown before :228, and the stack branch of :248 is reached only before :228.
  - "From the first write on": the `try` opens at :228 and `mkdirSync` is at :229. The catch at :238-239 makes every failure a `Stop`. :248 prints `STOP — … Nothing was rolled back.` and :249 sets exit 2.

**D6. Amendment 5 item 3 (class 8) lacks the named commit and the reason** (template, Round 25 additions, class 8: "at a named commit … and the reason").
- **Words, appended as a row of the next amendment (references only):**

> Amendment 5 item 3's figures are §7's counting command at 510f4bacc1521fb85de84628b8686f334a2970aa (the round's report, its §7 table); the script's two added lines are the fix commit's, its C2 STOP path (`scripts/plan/rotate-plan-summaries.mjs` lines 228-240 at that commit) and the due call's comment, now two lines (lines 192-193 at that commit).

- **Clause check:**
  - The report's §7 table sits under "Checks at 510f4bac".
  - The script was 249 at S5 (Amendment 2 item 5) and is 251 at the head.
  - The record commit touched only the test file (the report: numstat 2/1 on the test file), so both added lines are in c8c0a294.
  - The due comment was one line at gate 1 (the reviewer's Doc-5 quotes it) and is two at :192-193.
  - The remaining +1 in C2's restructure rests on the report's account. The reviewer confirms it by diff.
- **Form:** the cite is written in the words form, with no `path:line` token and no hash, because 510f4bac is a branch commit (round 15 (e); round 25 item 2 (d)).
- **Out of round, not raised:** Amendment 2 item 5 also gives no reason. It is outside the round and is Documentation only.

**D7. `scripts/plan/rotate-plan-summaries.test.mjs:346-347`: the R15 comment overstates.**
- **What is wrong:** "every archive the real tree tracks" is untrue. Only `PLAN-SUMMARIES-*.yaml` is copied (:348), not the CUT-STATE or DECISIONS-PENDING archives. And "-2" holds only when no `-2` is already taken.
- **Words (two comment lines; no budget change):**

> // every PLAN-SUMMARIES archive the real tree tracks goes into the first commit, byte for byte (that commit is dated PAST, so the run is still due,
> // and a real archive named for today makes the run take the next free suffix): once PLAN.yaml holds pointers, the script refuses a pointer whose archive is not tracked at HEAD

- **Clause check:**
  - The glob is at :348 and the Buffer read at :349. The first commit is dated PAST (:34, :41, :350).
  - Due: the last-added `%cI` (:191) is checked against the month (:194).
  - The next free suffix comes from `inTree` (:204) and `archiveNameFor` (:207).
  - The refusal is at :45.

## What I checked, with evidence
- Read at the head: the script in full, the test file in full, README :365-377, `rotate-decisions-pending.mjs` `isDue` (Grep), and `.gitattributes` (Grep).
- Read on main: the form's Amendments 1-5 and §8, the template's classes 1-9 and its round 12 and round 15 sections, both gate-1 reports, and the round's report.
- Byte-checked the D4 spans by fixed-string Grep (two hits, count 1 each).
- §8 items 1-4, 6 and 14 are not reached at this head, because S10 is not built. Items 5, 8, 10, 11 and 12 are not triggered. Item 13: Amendment 5 item 3's line count carries no rev, which is D6.

**Not run (no shell):**
- `git diff 2d60ac16 510f4bac`. I read the head in full and compared it with the line content the gate-1 reports cite.
- `gh pr view 237`: whether the PR body lists the applied words, carries the Doc-6 "Predicted at S10" line, and asks for a merge that keeps c8c0a294 reachable (its MR15 line names it).
- The `cmp -n` of §8 item 7 and §7's counting command.
- Every test, mutation and CI glob.
- Whether b2df233d and b5c1c841 are on main and add each sheet.

These are the reviewer's.

Files:
- C:/dev/wt/psa/scripts/plan/rotate-plan-summaries.mjs
- C:/dev/wt/psa/scripts/plan/rotate-plan-summaries.test.mjs
- C:/dev/wt/psa/scripts/plan/README.md
- C:/dev/spatial-ide/scripts/plan/PLAN-SUMMARIES-ARCHIVE-PREREGISTRATION.md
- C:/dev/spatial-ide/docs/PREREGISTRATION-TEMPLATE.md
- C:/dev/spatial-ide/state/consults/2026-10-21-governance-plan-summaries-archive-round-1-worker-report.md
