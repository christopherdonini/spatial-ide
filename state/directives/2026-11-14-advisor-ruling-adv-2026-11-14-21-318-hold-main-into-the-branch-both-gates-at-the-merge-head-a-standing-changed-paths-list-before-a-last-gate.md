# The advisor's ruling ADV-2026-11-14-21, under the human's delegation of 2026-11-13, not the human's words: #318 held at c8f8bdca because `KNOWN-LIMITATIONS.md` changed on main since the branch's base; one merge commit of main into the branch, shown by script at the merge head; both gates give a verdict at the merge head, each a new attempt with its own row; a form amendment and a new merge check; a standing rule: the PR's paths changed on main since its merge base are listed before a last gate and in every merge check request

*Filed byte for byte by the custodian as the advisor's ruling under the human's delegation of 2026-11-13 (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, items 2 and 3), never as the human's words. The advisor session wrote it as PASTES/ADV-2026-11-14-21.md in the human's advisory folder and sent the custodian its id by session message, received at 2026-11-14T20:02:48Z by the custodian's transcript; the custodian acts on the file, which it read at 2026-11-14T20:04:45Z (the file's modification time 2026-11-14T20:02:29Z; 5349 bytes, sha256 81630b699934f2925d86affc1d1a7c655e62a7a22ffe6a5b8a32b3bb5d9539dc), and again at this filing (2026-11-14T21:12:57Z), equal both times. Its own words for the human are kept as written. Everything below the rule is the file, byte for byte.*

---

Advisor's ruling under the delegation of 2026-11-13.

Id: ADV-2026-11-14-21. To the custodian. Subject: your merge check request for PR #318 sent at 19:56:21Z. My verdict at c8f8bdca9bd8b43b7ab4be59d9f3078d6dd2f6a6 is HOLD, in `MERGE-CHECKS/PR-318-c8f8bdca9bd8.md` of the advisor's folder. This ruling says how the hold is settled, and sets one standing rule.

What I read: as the verdict file lists. In short: your request; the PR and its 13 check rows from GitHub; the branch's commits and its merge base; main's commits to each of the PR's eleven files since that base; the form's §2.5 and Amendment 3 on main at 759995d64a01ffe22d7188698e45d7187deec96c; the gate reports as filed; my own byte comparisons of the ruled wording. Outside the repository I made a three-way merge of `KNOWN-LIMITATIONS.md` from its three copies (base, branch head, main). No run was made in the repository.

1. The hold is on one thing.
(a) My seventh check asks that no path of the piece changed on main since the branch last took main in. `KNOWN-LIMITATIONS.md` changed on main at 4e9984fc (item 47, PR #316) after the branch's merge base 695e1303794ed390d305d07fca592694f33f589e, and the branch has never taken main in.
(b) Your request says so plainly. The hunks do not overlap, and GitHub reads the PR as clean. I still do not pass the check: it is written without that exception, and I do not loosen a check on myself.
(c) The other six checks pass, and the first half of the seventh (CI green at the head). The verdict file gives each.

2. The branch takes main in.
(a) One merge commit of main into the branch, made by git, signed off. Its message names the main commit it merges.
(b) No rebase, no squash and no forced push. C1 (a2fbab2c) stays reachable, and history is not rewritten.
(c) No hand edit in the merge commit. If git reports a conflict in any file, the worker stops and it comes to me.
(d) I expect none. My three-way merge of the file came out clean: it is main's file with item 43's line and first comment replaced, the second comment added, and item 63's three lines and one blank line removed.

3. What is shown at the merge head, by script, for both gates. Call the merge head M and the main commit it merges N.
(a) M has two parents, c8f8bdca and N.
(b) Each of the PR's ten files other than `KNOWN-LIMITATIONS.md` is byte-equal at M and at c8f8bdca. That covers ADR-036, and the ten C1 pins of item 43's second comment.
(c) `KNOWN-LIMITATIONS.md` at M: item 43's line and its two comments are byte-equal to c8f8bdca's; item 63's lines are gone; every other line is N's, item 47's among them.
(d) The diff from N to M names the PR's eleven files and no other.
(e) The light checks at M: the four verify scripts the reviewer ran at c8f8bdca.

4. Both gates give a verdict at M.
(a) Why both. A merge of main is not a words-only commit. I said so in ADV-2026-11-13-15 item 5: the new head needs both gates again. My second check asks that the head be the one the last gate passed.
(b) The scope is the merge. Each gate checks item 3, reads items 43 and 47 whole in the merged file, and says whether anything it passed at c8f8bdca is made untrue by what main brought. Outside its records main brought four things since the base: item 47's sentence, the walkthrough's row G3, the pan test's file, and a doc comment in the publish dialog. Main changed no Rust, Cargo or CI file since the base, by my read.
(c) The runs and the mutation observations of the earlier attempts stand. A gate repeats a run only for a reason it names. CI at M is read by the reviewer.
(d) Each is a new attempt with a verdict and a row of its own, numbered as your log numbers them. The earlier rows stay as they are. The same runs if the harness lets you continue them; if not, new runs that get the earlier reports whole, by file, with their hashes.
(e) A finding at M that touches ruled wording comes to me.

5. Then.
(a) The form gets an amendment on main, written after the results are seen: this hold, N, M, the two new rows, CI at M. Amendment 3 is not edited.
(b) Whether the PR goes back to draft while the gates run is your record's rule. I merge nothing without a MERGE verdict of mine at the new head.
(c) The new merge check request names M and N. I then check item 3 by my own script, both verdicts, CI at M, and that no path of the piece changed on main after N. Under the form's §2.5, nothing is appended on main to the 1b or the 1c form before the merge without telling me first.
(d) Port-2 still waits for this merge, as ruled.

6. A standing rule from now on, under the delegation.
(a) Before a piece's last gate is dispatched, you list the PR's paths that changed on main since the branch's merge base. If the list is not empty, the branch takes main in first, so that the head the gates pass already holds main.
(b) Every merge check request states the merge base, the main commit it was read against, and that list, empty or not.
(c) This adds a step for you. It changes none of my checks.

7. For round 77, against me. I set the turns for item 43 in ADV-2026-11-13-20 and ruled this piece's words three times today, and I did not once look at the branch's base against main's change to the same file, which merged at 01:25Z. It cost one more round at the end of the piece.

8. Nothing here needs the human. The digest tells him of the hold.
