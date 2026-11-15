# The advisor's merge check of PR #322 at 4533983a1aed: MERGE, under the human's delegation of 2026-11-13, not the human's words; the advisor merged the PR by a merge commit, 87fb4a37

*Filed byte for byte by the custodian as the advisor's merge-check verdict under the human's delegation of 2026-11-13 (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 5 (b)), never as the human's words. The advisor session wrote it as MERGE-CHECKS/PR-322-4533983a1aed.md in the human's advisory folder and told the custodian by session message, received at 2026-11-15T01:32:03Z by the custodian's transcript; the custodian acts on the file. 4578 bytes, sha256 2c89965c2d63c62a69f90e270e8271356010bb9d1273e996aa948a48d8deaf4e, last modified at 2026-11-15T01:31:40Z by the file system; read by the custodian at 2026-11-15T01:32:30Z and again at this filing (2026-11-15T01:35:57Z), equal both times. Nothing is changed. The text below the rule is the verdict. The custodian's notes, not the verdict: the folder's place on the machine is not written here; by GitHub, PR #322 merged at 2026-11-15T01:31:49Z with the merge commit 87fb4a37d8afe17c3ad4b8792da33687d433f193; main's CI at that commit: still running when this record was written; its result goes in the next ledger entry.*

---

Merge check: PR #322 at 4533983a1aeddf78ba98d2841cc56f1ada80a10a
Verdict: MERGE

The advisor's merge check under the delegation of 2026-11-13. The piece is the closing step of the node second-open-history-before-1c-step-3: the kernel README's "Declared limits" line drops 63, the KNOWN-LIMITATIONS item that PR #318 withdrew. It runs under ADV-2026-11-15-01 (a one-line PR with no new form, the reviewer alone) and ADV-2026-11-15-02 (a worker makes the change by script).

What I read, all on 2026-11-15: the PR on GitHub at 01:30:16Z and again at 01:31:17Z; the commit, the diff and the merge base in the repository; the form's Amendment 3 item 6, the reviewer's gate report, the worker's report, the gate log, KNOWN-LIMITATIONS.md and the two filed rulings, each at main 925203430d1fe0f7dd7b761165e04e679f5458aa.

1. The PR. Opened by the custodian's account from the branch cut/kernel-readme-declared-limits-drop-63 of this repository, based on main, out of draft, open, not from a fork. Head 4533983a1aeddf78ba98d2841cc56f1ada80a10a at both reads.

2. The head and the gate. The reviewer's report names 4533983a as the commit it reviewed. The PR's head is that commit. It is the only commit, its one parent is bd5bcd09da885661266b3b7b46b707b3b46cb5fc, and it is signed off. Nothing was added after the gate.

3. The gate. ADV-2026-11-15-01 item 3 rules one gate, the reviewer's. Its report (state/consults/gates/2026-11-15-second-open-history-before-1c-step-3-kernel-readme-line-gate-reviewer.md) ends PASS WITH NOTES with no Correctness and no Evidence finding. The gate log holds one row naming 4533983a: the node second-open-history-before-1c-step-3, the reviewer, PASS WITH NOTES, 2026-11-15.
   (a) N1, to be fixed before the merge: the worker's report says it made no departure, but it ran `gh pr list` a second time after the first call failed. The gate asked that the PR body or the node's closing record name it, and say that rule (00) rests on the gate's own check 4. I read both: the PR body names the departure and says so, and the filing note above the worker's report does the same. N1 is closed.
   (b) N2 and N3 are notes on the custodian's briefs (the range form of the profile-path scan; the worker's first check could not cover two branches that are not open PRs). Neither asks for a change in this PR.

4. Nothing waits for a ruling, and the wording equals what was ruled. By my own script:
   (a) the form on main has exactly one line starting "6. **D-1**" and that line holds exactly one backticked "Declared limits" span;
   (b) the README at the head and at the merge base have the same number of lines and differ in exactly one, line 395;
   (c) the head's line equals the amendment's span byte for byte, and the base's line is that span followed by ", 63";
   (d) the head's file has one "Declared limits" line and no carriage return.
   The line is true on main: each of items 5, 6, 8, 12, 16, 21, 28, 30, 32, 43, 47 and 62 starts exactly one line of KNOWN-LIMITATIONS.md, and no line starts item 63.
   ADV-2026-11-15-01 and ADV-2026-11-15-02 are filed under state/directives/, each holding my file whole as its tail.

5. The files. One file, kernel/README.md, one line added and one removed: the file and the line Amendment 3 item 6 names. No dependency, lockfile, CI workflow, licence or mod file.

6. The piece does what was ruled. ADV-2026-11-15-01 item 1 allows this route only where a gated form's amendment gives the text word for word and the diff is that text alone. Both hold here (check 4). The reviewer read the change against the four categories of section 21a of the autonomy rules and found it in none; I agree: it is a list of item numbers in a module's index, and no script or test reads it. A worker made the change by script, as ADV-2026-11-15-02 rules.

7. CI and main. `gh pr checks` at 01:30:16Z: 12 of 12 passing, exit 0. The merge base is bd5bcd09. Main at 92520343 has two commits since it, both records commits, and neither changes kernel/README.md (the diff of that path from the merge base to main is empty). GitHub reports the PR mergeable and clean.
   Rule (00), ADV-2026-11-15-01 item 4: against their merge bases with main, the branches of port-2 (83d2ecef), PR B (31cf0e22) and the notifications piece (917f66c8) do not change kernel/README.md, read by me from the repository's copies of those branches.

After the merge the custodian reads main's CI and names the merge commit in the node's closing record, with the sentence that a worker made the change under ADV-2026-11-15-02 because lead-data has no shell.
