# The advisor's merge check of PR #318 at c8f8bdca9bd8: HOLD, under the human's delegation of 2026-11-13, not the human's words; not merged; ADV-2026-11-14-21 says what follows

*Filed byte for byte by the custodian as the advisor's merge-check verdict under the human's delegation of 2026-11-13 (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 5 (b)), never as the human's words. The advisor session wrote it as MERGE-CHECKS/PR-318-c8f8bdca9bd8.md in the human's advisory folder and told the custodian by session message, received at 2026-11-14T20:02:48Z by the custodian's transcript; the custodian acts on the file. 5775 bytes, sha256 ccd6db516a52fea9cf5a1b9607ca1362f953bd76287530f00f3e6b28bff11d14, last modified at 2026-11-14T20:01:46Z by the file system; read by the custodian at 2026-11-14T20:04:45Z and again at this filing (2026-11-14T21:12:57Z), equal both times. Nothing is changed. The text below the rule is the verdict. The custodian's notes, not the verdict: the folder's place on the machine is not written here; PR #318 was not merged; the ruling that says what follows is `state/directives/2026-11-14-advisor-ruling-adv-2026-11-14-21-318-hold-main-into-the-branch-both-gates-at-the-merge-head-a-standing-changed-paths-list-before-a-last-gate.md`.*

---

Merge check: PR #318 at c8f8bdca9bd8b43b7ab4be59d9f3078d6dd2f6a6
Verdict: HOLD

Written by the advisor session on 2026-11-14 at 20:02Z, under the human's delegation of 2026-11-13. Not merged.

The hold is on check 7 alone. `KNOWN-LIMITATIONS.md` is a file of this piece, and it changed on main after the branch's base: commit 4e9984fc (item 47's sentence, PR #316, merged at 73bd322b). The branch's merge base with main is 695e1303794ed390d305d07fca592694f33f589e and the branch has never taken main in. My seventh check asks that no path of the piece changed on main since the branch last took main in. It is not met, and I do not read it more loosely than it is written. Every other check passes.

What settles it: the branch takes main in by one merge commit, both gates give a verdict at that head on the merge, CI is green there, and a new merge check is asked at the new head. My ruling ADV-2026-11-14-21 gives the steps. I expect no conflict: a three-way merge of the three copies of the file, made by me outside the repository, comes out clean, and it is main's file with this piece's two changes (item 43 with its comments, item 63 gone) and nothing else.

What I read: the custodian's request of 19:56:21Z; the PR from GitHub (head, draft state, author, branches, mergeable state, the 13 check rows); the branch's six commits and its merge base; the diff from the base to the head by file, and the whole change to `KNOWN-LIMITATIONS.md`; main's commits to each of the eleven files since the base; the form on main at 759995d64a01ffe22d7188698e45d7187deec96c, its §2.5 and its Amendment 3, whole; the gate reports as filed on main: the architect's C3 report from its Evidence section to its end, its second part whole, the reviewer's C3 report through its findings, observations and first checks, the reviewer's report at C4 through its CI section, and the head of the second part of the reviewer's first attempt (verdict, findings, observations, the first mutation). The architect's first report and the reviewer's stop report I read whole on 2026-11-14 for ADV-2026-11-14-17. The code I read myself at 5e6b79bc for ADV-2026-11-14-17 and at dc0bd937 for ADV-2026-11-14-19 and -20; the two commits since then change documents only. The seven report files and the form have the hashes the request names.

1. The PR. Opened from the custodian's account, from the branch `cut/second-open-history-before-1c-step-3` of this repository, based on main, out of draft, open. GitHub reads it MERGEABLE and CLEAN. Met.

2. The head. c8f8bdca is the head the last two gate reports name (the architect's second part and the reviewer's report at C4). No commit follows it. Met.

3. The gates. Five rows in the gate log for this node:
   - at 5e6b79bc, the architect, PASS WITH NOTES; the reviewer, PASS WITH NOTES, one attempt in two parts, with all six mutations applied by the reviewer, killed and reverted, and none surviving;
   - at dc0bd937, the reviewer, FAIL, on one sentence of ADR-036 Amendment 2, which was my ruled text. This is red-line text, so the wording route does not close it;
   - at dc0bd937 and c8f8bdca, the architect, PASS WITH NOTES in two parts. Its finding on the amendment's last sentence is closed by its own check of the new words;
   - at c8f8bdca, the reviewer, PASS, with no finding. This verdict is what closes the FAIL (ADV-2026-11-14-20 item 9).
   The findings: the documentation findings of the first gates were ruled by ADV-2026-11-14-17 and applied in the two words commits, and both gates checked them at dc0bd937. The size finding is recorded as class 8 in the form's Amendment 3. The architect's finding on the kernel README's index line is closed for the merge by Amendment 3 item 6, which names the line and its replacement for the index update after the merge (ADV-2026-11-14-19 item 6). Met.

4. Rulings and ruled wording. Nothing on the piece waits for a ruling. By my own script against my ruling files:
   - ADR-036 at the head is main's ADR, one blank line, then the fence of ADV-2026-11-14-20 item 5, byte for byte;
   - item 43's line at the head is main's line with the span of ADV-2026-11-14-17 item 3 replaced, and main's line equals the base's;
   - item 43's approval comment ends as ADV-2026-11-14-17 item 4 (a) gives it, the second comment is no longer a draft, holds the corrected count sentence, and ends with the span of ADV-2026-11-14-20 item 6 (b);
   - the whole change to the file is: item 43's line and its first comment replaced, the second comment added, and item 63's three lines and one blank line removed. Item 64 and every other line are untouched.
   ADV-2026-11-14-19 and -20 are filed on main, each holding my file whole. Met.

5. The files. Eleven files, each on the form's §2.5 list, and the list has eleven entries. No dependency, lockfile, CI workflow, licence or mod file. Met.

6. What was ruled. The piece gives each open of a dataset its own session history record until a save binds the open to a project (the human's rulings of 2026-11-12, OPEN-N1 to N4), with the tests and the six mutations the form declares. I read the recorder, the save and the binding in the code, and the two gates' clause checks agree with what I read. Item 63 is withdrawn and item 43 reworded as ruled. The size is 710 changed lines against about 530, recorded as class 8. Met.

7. CI and main. `gh pr checks 318`, read by me at 20:00:43Z: 13 rows, all pass. Main since the base changed no Rust, Cargo or CI file. But main changed `KNOWN-LIMITATIONS.md` since the base, as said above, and the branch has not taken main in. Not met.

For the record: neither gate was asked to look at main's change to the file, and I did not raise it when I ruled the piece's words. The custodian's request states the fact plainly.
