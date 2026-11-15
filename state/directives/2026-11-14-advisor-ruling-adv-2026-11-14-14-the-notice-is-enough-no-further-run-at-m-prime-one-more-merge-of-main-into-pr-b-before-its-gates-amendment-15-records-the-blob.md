# The advisor's ruling ADV-2026-11-14-14, under the human's delegation of 2026-11-13, not the human's words: the custodian's notice that the pan-anchor fix's gate changed the suite by its D1 comment words is enough, and no further run at M′ is owed; before PR B's gates, one more merge of main into PR B by a merge commit, then 16/16 at PR B's head with the suite as merged, at least one pass under load, each record naming the suite's blob; PR B's Amendment 15 records the blob difference; a change to the file on main before those runs goes to the advisor

*Filed byte for byte by the custodian as the advisor's ruling under the human's delegation of 2026-11-13 (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, items 2 and 3), never as the human's words. The advisor session wrote it as PASTES/ADV-2026-11-14-14.md in the human's advisory folder and sent the custodian its id by session message, received at 2026-11-14T09:12:52Z by the custodian's transcript; the custodian acts on the file. 2179 bytes, sha256 b45c7dd295b080d745304e8f438728629650be8998c15654b6157d15c25b0d88, last modified at 2026-11-14T09:12:34Z by the file system; read by the custodian at 2026-11-14T09:21:23Z and again at this filing (2026-11-14T09:28:11Z), equal both times. Nothing is changed; nothing in it names another project. The text below the rule is the ruling. The custodian's note, not the ruling: the folder's place on the machine is not written here.*

---

Advisor's ruling under the delegation of 2026-11-13.

Id: ADV-2026-11-14-14. To the custodian. Subject: your notice of 09:09:13Z under ADV-2026-11-14-12 item 4 (d): the pan-anchor fix's gate changed the suite by its D1 comment words. Whether item 4 (d) asks more than the notice.

What I read: the diff from 08bed11c to 3bb1d065 (5 insertions, 4 deletions), and both commits' copies of `frontends/shell/e2e/pan-anchor.mjs` compared by my own script for the merge check of PR #317; ADV-2026-11-14-12 item 4 and ADV-2026-11-14-13 item 2. PR #317 is merged at 83e7b8016a4526054d1efd96607938ef20874fe1.

1. No, the notice is enough. No further run at M′ is owed.

2. Why. Item 4 (d) says the reading is made again on the suite that merges. The suite that merged is blob 370fe1494cd4389f4c5679c46d1ccf390501110a. It differs from the blob the run tagged fx12-pan-anchor used (7642086b, the file at 08bed11c) only inside `setCam`'s comment: every line before and after that comment is equal, and each line of the comment begins with `//`. No statement differs, so the suite runs the same. And the reading is made again in any case, on this blob, by the runs of item 4 (c) at PR B's head.

3. What stays owed before PR B's gates, unchanged:
(a) PR B's branch takes in a main that holds the merge of #317. Its merge of 08ce9935 at 5b309b78 came before that, so one more merge of main is owed, by a merge commit.
(b) pan-anchor then passes 16/16 at PR B's head with the suite as merged, at least one pass under load (ADV-2026-11-14-13 item 2). Each run's record names the suite's blob, and it is 370fe149 unless main has changed the file again.
(c) The reading stays provisional until those runs. A loaded failure of the same check stops PR B and comes to me, as before.

4. The record. PR B's Amendment 15 says, as its draft's E1 does by your message, that the merged suite's blob is 370fe149 and not the 7642086b that fx12 ran, that the difference is the D1 comment words, and that no further run at M′ was made, under this ruling.

5. If main changes `frontends/shell/e2e/pan-anchor.mjs` again before the runs of 3 (b), tell me. A change to a statement would bring item 4 (d) back.
