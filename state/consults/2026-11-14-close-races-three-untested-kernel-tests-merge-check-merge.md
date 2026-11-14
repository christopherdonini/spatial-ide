# The advisor's merge check of PR #320 at fd101297612b: MERGE, under the human's delegation of 2026-11-13, not the human's words; the advisor merged the PR by a merge commit, faa348a3

*Filed byte for byte by the custodian as the advisor's merge-check verdict under the human's delegation of 2026-11-13 (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 5 (b)), never as the human's words. The advisor session wrote it as MERGE-CHECKS/PR-320-fd101297612b.md in the human's advisory folder and told the custodian by session message, received at 2026-11-14T20:39:33Z by the custodian's transcript; the custodian acts on the file. 4525 bytes, sha256 9117754737ee96a7e7f084223ba7e10512ae99195f35dc90335ae9ded76ea6d9, last modified at 2026-11-14T20:39:10Z by the file system; read by the custodian at 2026-11-14T20:41:40Z and again at this filing (2026-11-14T21:12:57Z), equal both times. Nothing is changed. The text below the rule is the verdict. The custodian's notes, not the verdict: the folder's place on the machine is not written here; by GitHub, PR #320 merged at 2026-11-14T20:39:24Z with the merge commit faa348a3de3d5157da47a082c15ba2d668b279d1 (parents 711d0854 and fd101297). Main's CI there was red on its first attempt and green on the one re-run that `state/directives/2026-11-14-advisor-ruling-adv-2026-11-14-22-main-red-at-320s-merge-one-re-run-only-321-not-merged-while-it-runs-on-a-pass-320-stands.md` allows.*

---

Merge check: PR #320 at fd101297612bbafbd15a1819f44b47335240b425
Verdict: MERGE

Written by the advisor session on 2026-11-14 at 20:39Z, under the human's delegation of 2026-11-13.

What I read: the custodian's request of 20:37:30Z; the PR from GitHub (head, draft state, author, branches, mergeable state, its two commits, the 18 check rows); the whole diff from the merge base a9c884bac1e9f675784bdc31f285d1e7a981051a to the head; the form `governance/forms/kernel/CLOSE-RACES-THREE-UNTESTED-KERNEL-TESTS-PREREGISTRATION.md` on main at 711d0854aacd45b63f6cfaa1c5fa3d69c8504724, whole, with its Amendments 1 and 2; both gate reports as filed on main, whole; the gate log's two rows for the node; AUTONOMY's size rule for a five-line form and its clause on an overrun found mid-piece; main's commits to the PR's two files since the merge base. The form and both reports have the hashes the request names. I made no run.

1. The PR. Opened from the custodian's account, from the branch `cut/close-races-three-untested-kernel-tests` of this repository, based on main, out of draft, open. GitHub reads it MERGEABLE and CLEAN. Met.

2. The head. Both gates reviewed fd101297, from dispatch, and no commit follows it. Met.

3. The gates. The architect: PASS WITH NOTES, no Correctness or Evidence finding. The reviewer: PASS WITH NOTES, no Correctness, Evidence or Documentation finding; it ran the module's tests and the whole kernel crate at the head (exit 0), and applied each of the three mutations itself, saw the predicted tests fail by name at the predicted assertion, reverted and re-ran clean. No mutation survived. The one finding to fix, the architect's D1, is on the form's Amendment 1 on main, not in the diff: its reason bullet compared two different counts. The form's Amendment 2 appends the architect's correction, and by my script it holds the architect's words byte for byte. The other notes are observations that ask no change, and the optional rewordings were not taken, so the head stays the gated head. Met.

4. Rulings and wording. Nothing on the piece waits for a ruling. No ruled wording is in the diff: the three doc comments and the two README lines are the worker's wording, and both gates read each clause as true. The form's four OPEN items, none a red line, were taken as recommended before the code. Met.

5. The files. Two files, both on the form's Scope line: `kernel/src/skp.rs`, 150 added lines in one hunk inside the test module `ticket_drop_under_lock_regression`, and `kernel/README.md`, two changed lines (this form added to the list of preregistrations, and one clause in the last-verified line). No product line, no new public item, no dependency, lockfile, CI workflow, licence or mod file. Met.

6. What was placed. The human placed one kernel test node for the three places the gates of #308 found untested. The diff adds exactly three tests, each in step order on the test's own thread with no sleep, thread or timeout: a ticket minted after the close is cancelled by its failed attribution; an observed change between mint and attribution refuses with the arm's own detail; a query that resolved while the dataset was ended and checks after the close is refused as an unknown dataset. Two things differ from the form's lines, and both are on record:
   - The size is 154 changed lines against the declared 150. The form's Amendment 1 records it as class 6, the five-line form is kept, and both gates ran, as AUTONOMY's clause on an overrun found mid-piece asks.
   - The third test stops at the mint step, where the form's line has it continue through the attribute step. The mint step's live check refuses first, so the product never reaches the attribute step on this path. Amendment 1 discloses it, and both gates read the test as driving the place the node names, with a check at least as strict.
   Met.

7. CI and main. `gh pr checks 320`, read by me at 20:38:49Z: 18 rows, all pass. Main at 711d0854 has no commit to either of the PR's two files since the merge base, so the branch did not need to take main in. Main's own runs at 711d0854 are green by the custodian's message (four runs, read 20:37:16Z); I did not read them myself, and the custodian reads main again after the merge. Met.

Not part of the verdict: PR #318 is on hold until it takes main in. Neither of this PR's two files is among that piece's eleven. If that branch merges main after this merge, main brings these three tests and two README lines with it, and its gates and CI at the merge head see them.
