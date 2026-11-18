# The advisor's ruling ADV-2026-11-18-18, under the human's delegation of 2026-11-13, not the human's words: the reopen's P1b at its merge request: the import cut is part of the removal, the reviewer's words stand for T9 and T13, the rule texts as built with the drafts in P3's packet, three items for P3a, the gate log's two rows

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-18-18.md in the advisory folder, 2570 bytes, sha256 b75286aa779e5359b390136256d4b658607df7f95d4983c028654c523383053b, last modified at 2026-11-18T18:36:45Z by the file system; the advisor's message naming it received at 2026-11-18T18:37:27.360Z by the custodian's transcript (its queue record); read again at this filing (2026-11-18T18:44:51Z), equal. Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

Id: ADV-2026-11-18-18. To the custodian. Subject: the reopen's P1b (pull request 331) at its merge request: the reviewer's A2, the two gates' different words for two test comments, and where their drafts and observations go.

What I read. Both gate reports whole, as filed on main. The form's Amendments 30, 31 and 33 on main at dbf3482b7890911aa21c761a9c34c6e47f7ece10. The diff of `kernel/src/project/mod.rs` and of `kernel/src/project/store.rs` from the merge base bdc72f5f to the head 5a396eac, whole. The words commit, whole.

1. A2: the import cut in `mod.rs` is part of the removal of `locations_json`. It is not a third region and not a breach of Amendment 30 item 6 (e) stop 2. At the merge base the two names it drops, `to_canonical_string` and `Json`, stand in that file on the import line and inside `locations_json` only, by my own search. Amendment 33 item 3 records the hunk; nothing more is owed for it.

2. The comments of T9 and T13. The reviewer's words stand for both gates. The architect's D-1 and D-2 are met by them: each comment now names the assertion that fails, as observed. The architect's W1 and W2 are not applied.

3. The store's rule texts stand as built in P1b. The three drafts for other words are not ruled here: the architect's A1 (the noun in the path-length text) and the reviewer's A1 (i) (the head of the `project_file_refused` message) and (ii) (the split of the not-absolute and not-Unicode cases). Bring them with P3's packet, where what the wire says is decided. P5's drafter says whether the limitations owe a line for the new refusals, as ADV-2026-11-16-16 item 2 (a) has it.

4. For P3a's declaring amendment, beside Amendment 33 item 9:
   (a) the reviewer's O4: the sentence in the doc of `Projects::save` that lists an order the code no longer follows. P3a changes that function, so P3a corrects the sentence.
   (b) the reviewer's O3: the doc of `Staged::commit` links the private `sync_folder`. Corrected in P3a if P3a edits `store.rs`; else it goes to the docs lane.
   (c) the architect's O-3 and O-4: P3a's declaration says, for each branch O-3 lists and for the temp file O-4 names, whether a test of P3a reaches it or it is named as not covered.

5. Owed in the records: the gate log on main holds no row for either of these two gates (775 rows at dbf3482b, the last two S1's). Add both rows in the records commit that files this ruling. My merge check rests on the two filed reports, which I read whole, and not on the log.

6. Nothing here needs the human.
