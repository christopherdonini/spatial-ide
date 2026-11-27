*Filed byte for byte by the custodian under the grant (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`), item 5 (b): the advisor's merge-check verdict on PR #360, MERGE-CHECKS/PR-360-2d0c6d36feda.md in the advisory folder, 5776 bytes, sha256 f0bb982b99fa513b90478b5659b8ae224340ef7d34333205f834724a3fc8d112, modified at 2026-11-27T02:16:35Z, read again at this filing, equal. It is written ahead of the merge (ADV-2026-11-27-05 item 1), and no merge has run. The advisor's message naming it (ADV-2026-11-27-05) was received before 2026-11-27T02:17:14Z (date -u, taken after it was copied). Below the rule, the advisor's words, not the human's.*

---

Merge check: PR #360 at 2d0c6d36fedaf49fba1a638c690bd9a0d6499f29
Verdict: MERGE

Written by the advisor on 2026-11-27 at about 02:17Z, under the human's delegation of 2026-11-13. The piece: when `describe` fails after `open_dataset` or a reopen has returned a handle, the shell first sends `close_dataset` for that handle, and the failure goes on when the close settles or once a declared time has passed (the form `governance/forms/frontends/DESCRIBE-FAILS-AFTER-OPENED-CLOSES-THE-HANDLE-PREREGISTRATION.md`, full form, both gates). The verdict is written ahead of the merge, as ADV-2026-11-26-15 item 4 and ADV-2026-11-27-02 item 5 have it. What I read again before I run the merge is at the end.

**What I read.** The pull request's head, state, author, base, title, body and checks from GitHub. On main: the form's §7, §8 and §9 and its closing Amendment 2; the four gate reports' verdict lines; the architect's build gate report, whole; the reviewer's build gate by its findings and its replacement words; the report of the KM1 run, whole; the narrow read of the merge-in, whole; my rulings ADV-2026-11-22-38 and -39. In the diff against main: both product files, whole; the commit 8d1f2f4e, whole. I did not read the three test files line by line; they rest on the two build gates.

1. **The pull request.** The custodian's own, from the branch `cut/describe-failed-close` of this repository, based on `main`, out of draft.

2. **The head and the gates.** The reviewer read 3755df81 and the architect read 8d1f2f4e. The head 2d0c6d36 is the merge of main 4b9fd558, read narrowly: PASS (gate-log row 925), no hunk in the merge, the piece's own diff unchanged by patch-id.

3. **Both build gates ended FAIL, on words only.** The human's message of 2026-11-13 lets such a FAIL close without another attempt when three things hold. I read them myself.
   - **The reviewer's FAIL (row 851).** Its one blocking finding, C-1, is four doc comments that claimed a ceiling on the wait and an order the code does not give. The commit 8d1f2f4e applies the gate's R1 to R4 and nothing else: 17 changed lines, all comment lines in the two product files, each equal to the report's words where I compared them. The architect, reading that head, found all four true. The form's Amendment 2 item 2 records the closing.
   - **The architect's FAIL (row 852).** It finds the code and the tests sound. Its two blocking findings are the subjects of two pushed commits: C2's says "waiting at most 2000 ms", a limit the code does not give, and C1's claims reds for S4 and K1, which were green as predicted. A pushed commit is not reworded: history is never rewritten. The gate's words for both stand in the pull request's body, and the form's Amendment 2 item 3 names the two commits by id as superseded.
   - **Its D-1** asked for a KM1 run that records its commit and the applied change. That run is filed (`state/consults/2026-11-27-describe-fails-after-opened-closes-the-handle-km1-run-worker-report.md`): HEAD 8d1f2f4e, the one removed line, and K1 failing at step 6 with step 6's own message, as the form predicts.
   - The reviewer's D-1 and D-2 are recorded in Amendment 2 item 5. The form's own gate ended FAIL on attempt 1 and PASS WITH NOTES on attempt 2.

4. **The title.** At my first read the pull request's title repeated C2's superseded subject. GitHub writes the title into the merge commit's message, so the merge would have put the untrue limit onto main. I asked for the architect's words (ADV-2026-11-27-04 item 2). The title now reads, checked by me against that ruling's fence: "fix: shell: a describe that fails after the handle is returned sends close_dataset for it, and the failure goes on when the close settles or once DESCRIBE_FAILED_CLOSE_WAIT_MS (2000 ms) has passed, whichever is first". The head did not change.

5. **Ruled wording.** No string the app shows changes, and `KNOWN-LIMITATIONS.md` is not touched. My rulings fix what the piece means (ADV-2026-11-22-38 item 2) and that it claims no "no later than" (ADV-2026-11-22-39 item 2). The doc comments at the head say "when the close settles or once the declared time has passed, whichever is first", and the constant's doc says that a timer can run late.

6. **The files.** Five, the form's Scope: two product files and two test files of the shell, and `kernel/tests/project_reopen_skp.rs`. 247 changed lines against the ceiling of 270 that the form's Amendment 1 declared before any code. No manifest, lockfile, workflow, licence or mod file. Nothing under `protocol/`, `engine/` or `kernel/src/`.

7. **The piece does what was ruled.** `describeOpened` catches any rejection of `describe`, sends `close_dataset` for the handle, waits for the close or for a 2000 ms timer, whichever is first, clears the timer and throws the same error. The close's reply and its rejection are dropped. Both callers, the open and the reopen, go through it. No new string, no log line, no retry.

8. **CI and main.** All 14 checks pass at the head (read by me at about 02:16Z). Main's changes since 4b9fd558 are records only; none of the five paths.

**The form's words on the tag.** The form's §8 item 9 names "a merge before the tag without the human's word". The human's message of 2026-11-26 is that word, and the form's Amendment 2 item 7 records it: the piece does not go into `release/v0.2`.

**Before I run the merge, I read again:** that the tester's start in the sitting's checkout is filed and the human's app is closed (ADV-2026-11-26-15 item 4, ADV-2026-11-26-19 item 4); that the pull requests before it in the order are merged (the human's message of 2026-11-26: oldest first); that the head is still 2d0c6d36, the title is unchanged and CI is green; and that main has changed none of the five paths.
