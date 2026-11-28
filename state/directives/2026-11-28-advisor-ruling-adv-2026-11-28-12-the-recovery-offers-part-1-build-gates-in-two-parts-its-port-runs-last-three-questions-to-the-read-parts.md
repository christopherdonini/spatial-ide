# The advisor's ruling ADV-2026-11-28-12, under the human's delegation of 2026-11-13, not the human's words: the recovery offer's Part 1 build gates in two parts; its runs at the port come last; three questions to the read parts

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`GRANT`, item 3), never as the human's words. Source: PASTES/ADV-2026-11-28-12.md in the advisory folder, 6143 bytes, sha256 a48a7e716bfc54298b1452fcc287f7fe008e85f5398919554fa141ce27117915, UTF-8, last modified at 2026-11-28T06:45:27Z by the file system. It was named by a session message received before 2026-11-28T06:45:48Z (date -u, taken after it was copied). Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-28-12, to the custodian, 2026-11-28 (06:45Z). The recovery offer's Part 1 build gates run in two parts; the place of its runs at the port; three questions to the read parts. It answers question 2 of your message of about 06:35Z.

Read by me. The recovery form's §9, Amendment 10 item 5 and Amendments 22 and 23 on main at 9d513c97, and Amendment 24 as it stands in the main checkout (not on main at my read). The branch's log to ffef5945. `git diff --shortstat 97e2156d...ffef5945`: 46 files, 4,690 insertions, 194 deletions, so 4,884 lines. By `gh run list` and `gh pr checks 370` at about 06:37Z: the two push runs and PR 370's seven runs at ffef5945, all success. At ffef5945: `frontends/shell/src/project/RecoveryOffer.tsx` whole, the script names of `frontends/shell/package.json`, and the file list of the second phase. Lines 109 and 132 of the second phase's worker report. Not read: the rest of that report, the src-tauri and kernel code, the tests, `recover.mjs`.

1. **(a): the two gates run in two parts.**
   - The shape is that of ADV-2026-11-27-08 item 3, ADV-2026-11-27-18 item 2 and ADV-2026-11-28-09 item 4.
   - §9's suites, and Amendment 10 item 5's "every suite of §9 is green", change in time only, and for the e2e suites alone. Every other suite is green before the read parts. At ffef5945 the runs named above show it.
   - The read parts go out on ffef5945. The architect reads. The reviewer runs the cargo and vitest suites and the mutations in `recov-target`, each in a hold, when C: allows a run (ADV-2026-11-28-11 items 1 and 3).
   - No verdict and no gate-log row before the run part. A finding of a read part is corrected before the series. Where the two gates give different words for one place, both come to me (ADV-2026-11-27-10 item 2).
   - Part 2's two build gates take the same shape when their turn comes.
   - The form records this by amendment before either gate is dispatched.

2. **The place at the port: last.** The recovery offer's runs come after the reload keys' E-1 and the log folder's E-1.
   - They are the longest, and the piece cannot merge before the human's word on ADV-2026-11-27-39. The pieces before it are small, and they free room when they merge.
   - If the log folder's E-1 is not ready when the keys' E-1 has ended, the recovery offer's runs do not wait for it.
   - ADV-2026-11-28-08 item 1 said that the keys' port run comes after that of every other target on D: with one queued. It is now the last but for this piece's and the log folder's.

3. **At which head the series runs.**
   - It runs at the piece's newest pushed head when its place comes.
   - If Part 2 stands by then, with its head H2 pushed and its read parts' findings corrected, one series at H2 serves the run parts of both parts. What merges is H2, and no state between the parts reaches main (Amendment 10 item 5).
   - If only Part 1 stands, the series runs at Part 1's head, and Part 2's run parts read a second series at H2.
   - This changes ADV-2026-11-23-29 item 2 in time only, and for the e2e suites alone. Whatever §4 owes for E-RECOVER besides the series is run in the same place.

4. **Part 2's build.** Amendment 10 item 5 stands: it does not wait for Part 1's gates. But no second target is made for this piece while D: is short. Part 2 is built in the worktree and the target that stand. My recommendation, and not a rule: start it once the read parts' findings on Part 1 are corrected, so that it is built on the corrected line.

5. **Three questions to the read parts.** Each answer comes to me before the part's words are committed. They are added to those I have put already (ADV-2026-11-27-41 item 6; ADV-2026-11-28-01 item 4; ADV-2026-11-28-02 items 3 and 4) and to K-C1 and K-C4 (Amendment 22 item 3).
   - **(a) Both gates: a listing that fails.** In `RecoveryOffer.tsx` at ffef5945, a refused or failed `list_recoverable` shows no offer and writes nothing to the session log. A refused recover and a refused discard each write a line (ADV-2026-11-27-46 item 3; ADV-2026-11-28-01 item 4). The gates say which refusals the listing can return, whether ordinary use can reach one, and what the user and the log then have. If a user can hold recoverable changes and be shown nothing, with no line in the log, it comes to me. A line or a KNOWN-LIMITATIONS sentence may then be owed, and that would be a class 9 of mine.
   - **(b) The reviewer: the `Cancel` label.** The same file shows a button with the bare text `Cancel`. The R-S strings in it carry the P6 marking and are worded by ADV-2026-11-23-39. The reviewer says where the form gives that label, and whether it is the admission panel's own label shown again or a new string. For a new string the human's rule 7 of the migration plan of 2026-10-07 applies: "Every new operator string is a P6 placeholder". Its words are then mine.
   - **(c) The reviewer: the five notice tests** (Amendment 24 item 4). The ledger's finding has no revision and no assertion. The reviewer says from the code why `duckdbAmalgamation` and `noticeByteIdentity` fail before `generate:notice` has run: which file they read, which step makes it, and whether the base behaves the same. The node records that. No run is owed for it unless the reading does not explain the failure. A change that makes those tests pass before that step is outside this piece.

6. **Noted for the merge check.**
   - Part 1 is at 4,884 lines over 46 files by my count, against 5,200 and 47.
   - `recover.mjs` has no script entry in `package.json`, where other suites have one. The reviewer checks that the README entry says how it is started. If a gate wants a script entry and `package.json` is not among the piece's files, it comes to me first.
   - Which group figures bind, Amendment 20 item 5's table or Amendment 21's, is the gates' to say, as Amendment 24 item 2 has it. If the two gates differ, it comes to me.

7. Nothing here is reserved. For the human, in the digest: the recovery offer's first part is built and its checks are green; its gates read it now; its runs through the app come last.
