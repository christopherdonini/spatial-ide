Reviewed: governance/forms/engine/CANCEL-REQUESTED-STAMP-ORDER-PREREGISTRATION.md on main at 03103b12c9b9906709455c204b1ba26751500220, 59409 bytes, sha256 319d18881249b7022994a88f6835686218fedb6e4080a6ac0de76079074ebd2c, read in the read worktree (the custodian's filing note, 2026-11-22: the cancel node's architect gate, attempt 2, on its Amendment 1 alone (ADV-2026-11-22-07 item 4); Read 30, Grep 19, SubagentHandback 1, by unique call ids; none errored; model claude-opus-5-5, from 2026-11-22T06:44:07Z to 2026-11-22T06:53:16Z by its transcript; the report below byte for byte from its hand-back of 22209 bytes, sha256 32a6ab8622a4779212f33cbe93dff288b9d8d2a41222f83122ce685bbf49e115), gate, architect

Verdict: PASS WITH NOTES, main @ 03103b12c9b9906709455c204b1ba26751500220 (cancel node form, Amendment 1, attempt 2)

Reviewed: main @ 03103b12c9b9906709455c204b1ba26751500220, read in the detached worktree C:\dev\wt\gate-read. Every path:line below is at that head. I did not recompute the form blob's sha256 (319d1888…) because I have no shell. Code was read at 03103b12; the brief says engine/, kernel/ and protocol/ do not differ from 16c896558ac9073f132336f4c9cbcff5b31d8514. `scripts/plan/verify-quotes.mjs` is outside that statement, so I read it at 03103b12 only (see D-5). Text inside double quotes is bytes copied from the file named. Everything else is paraphrase. Every proposed word is mine, the architect's. None is the human's or the advisor's.

**Summary.** Attempt 1 stays FAIL. This attempt reads Amendment 1 alone (form :390-537).
- Correctness: nothing open.
- Evidence: nothing open.
- C1 is in my words, byte for byte by eye.
- The ruled texts match my report and the ruling.
- D3's lock order and its no-cycle argument hold against the code.
- D6's kill lists follow, and so do lead-data's additions.
- D7's deadline is allowed as written.
- N4 is correct.
- No STOP.
- Nine Documentation findings, all words or pins. They must be fixed before merge, and should be fixed before dispatch because they are form text. Exact replacement words are below, as Amendment 2. None is the human's wording, so they are applied with no re-gate and no third attempt (ADV-2026-11-22-07 item 4; AUTONOMY §31, item 2 (d)).

## Correctness
None.

## Evidence
None. T1 and T2 are still the deterministic discriminator. Amendment 1 does not move them.

---

## 1. C1 in my words
- **Paragraph.** Form :396 matches my attempt-1 report :26 with its `> ` marker removed. I compared it word by word, including the backticks, the `@ 16c896558…` and the closing clause. I found no difference. I have no shell, so the byte comparison is the reviewer's.
- **Pins line.** Form :398 names exactly the paragraph's five cites: `engine/src/trace.rs:313`, `:150-151`, `engine/src/cancel.rs:251-267`, `:167-174`, `:133-135`. Each is at 16c89655 and each line holds what the paragraph says:
  - trace.rs:313 takes `CURRENT` and holds it through `push`;
  - trace.rs:150 is the clock read and :151 is the buffer lock;
  - cancel.rs:251-267 is `attach` holding the slot across `handle.interrupt()`;
  - cancel.rs:167-174 is the re-interrupter holding the slot across `h.interrupt()`;
  - cancel.rs:133-135 is today's swap then stamp.
- I did not recompute the hashes.

## 2. The ruled texts (Amendment 1 item 2, form :400-411)
- **(a) ADR-018 note.**
  - The heading at form :404 matches the ruling's fence (directive :15).
  - The body reference is my report :100 @ eb1329ed. That line is the architect's ADR note body: it begins "Item 1's row defines" and ends "No line above this note is changed."
  - The placement matches ruling item 1 (a): a blank line, `---`, a blank line, the heading, a blank line, the body, after ADR-018's last line (:149, the file ends at :150).
- **(b) Kernel note.**
  - My report :126-130 is the heading "## 10. Amendment — §2's `cancel_requested` row, as of 2026-11-22", a blank line, the "Appended" paragraph, a blank line and the body.
  - It goes at the end of the file as §10, after a blank line, `---` and a blank line, as ruling items 1 (b) and 2 say. §8 and §9 are the file's last sections (kernel/CANCELLATION-AND-TRACING.md:212 and :258), so §10 is the right number.
- **(c) trace.rs sentence.**
  - My report :218-220 is the three-line doc comment, without its fence lines (:217, :221).
  - It replaces engine/src/trace.rs:370-371, the first sentence ending "can stamp.", as ruling item 3 says.
- **Hashes.** All three equal the ruling's hashes (directive :18, :19, :25). I did not recompute them.
- **(d) and (e).** They paraphrase ruling items 1 (c), 1 (d) and 5, and neither is marked as a quote. (d) also puts the trace.rs sentence in the same pull request, which agrees with item 3's C4.

**Draft against form.**
- The amendment is the draft's :7-141 with the three changes the filing line names:
  - item 2's placeholder (draft :15) replaced by form :400-411;
  - the pins line, form :398;
  - the sentence "Attempt 2 reads it with the rest of this amendment (ADV-2026-11-22-07 item 4)."
- I read every other line against the draft and found no other difference.
- The filing line (draft :3) says that sentence is "at the end of item 1's lead". It is the second-to-last sentence (form :394). See D-7.
- Meaning:
  - The placeholder change and the pins line change no meaning.
  - The sentence does change the lead's meaning in one respect. Read without it, "applies with no re-gate" stands alone. With it, attempt 2 reads the paragraph. That is the change ruling item 4 orders.

## 3. D1 to D8, N2 to N5, each against the finding it answers
- **D1 (item 4).**
  - Its first two bullets are correct.
  - Its third bullet is wrong. §1's "see the last section" (form :108) is about trace.rs:370-371, and ruling item 3 decides that. §2.9's (form :192) is about the kernel note's place, which ruling items 1 (b) and 2 decide.
  - The bullet sends both to "item 1". The same error is in item 3's lead, "ADV-2026-11-22-07 item 1, as ruled." (form :413). See D-1 and D-2.
- **D2 (item 5).**
  - verify-quotes.mjs:663-674 (`linesWithLF`) does what the bullet says.
  - :802-806 slices the lines and computes the sha256. The comparison the bullet names is :807. See D-5.
- **D3 (item 6).** It holds against the code.
  - The listed sites hold:
    - stream.rs:1981-1993 is the load at :1981 and the mark at :1992;
    - stream.rs:2652-2658 runs through `classify` at :2636-2639;
    - publish/mod.rs:1042-1070 is `check`, `observe_if_cancelled` and `observe`;
    - stream.rs:3264-3272 and first_batch_factorial.rs:1382-1385 and :1517-1520 read the segment, and trace.rs:216-218 is the backward-pair refusal.
  - The callers hold:
    - skp.rs:353 and :392 run under `tickets`, taken at :323 and :370;
    - skp.rs:963 runs under `inflight`, taken at :958;
    - lib.rs:745 runs before the `notice` lock at :747.
  - The lock order "registry → `transition` → `CURRENT` → buffer" holds. It matches my report :175 by eye.
  - No cycle:
    - Under `transition` only `trace::mark` runs: `mark_cold` takes `CURRENT` (trace.rs:313), and `push` takes the buffer (:151).
    - The other code that takes `CURRENT` takes nothing else and calls no `cancel`: `start` (:329-339) and `TraceGuard::drop` (:353-357).
    - The buffer is also taken alone by `events` (:189-197).
    - The slot is taken after `transition` is released.
    - `attach`, `detach` and the re-interrupter take no other engine lock while they hold the slot (cancel.rs:250-278, :161-175).
  - `BatchStream::drop` (stream.rs:898-908) now takes `transition` through `cancel_for_drop`. It runs under no trace lock.
  - The list of edges is not complete, but the no-cycle claim does not depend on it (Note N-a).
- **D4 (item 7).** It is correct. `SPANS` is at trace.rs:538-552, and `segment_ms` returns `None` at :209-211.
- **D5 (item 8).** It is correct: engine/README.md:535 holds the rules, :544 the Cancellation row and :557 the preregistration list.
- **D6 (item 9).** Every kill and every survival follows from §2.1, §2.3 and item 12. My trace of each:
  - **M1.** T1 is killed: the publication comes before `on_stamp`. T2 is killed: the count is 0 at `after_publish`. T3, T4 and T5 pass:
    - in T3 and T4 the loser finds the flag set, so the count stays 1;
    - in T5 the drop is held after the publication, and the cancel then finds the flag set, so the count stays 0.
    - T6, T7, T8, I1, I2 and I4 pass.
  - **M2.**
    - T1 and T2 are killed as at C1. The T2 kill follows from placing the hooks where C1 places them.
    - T3, T4 and T5 are killed by the deadline. No `try_lock` exists, so `on_contended` never fires. The loser's `swap` returns at once.
    - T6, T7, T8, I1, I2 and I4 pass: `swap` claims once.
  - **M4** (item 9's definition). This definition is coherent where the registered one was not. In §2.1, `first` gates only the re-interrupter, so "first ignored" could not make every call stamp. Its kills and passes:
    - T3 is killed: B runs step 3 after A, and B's `before_stamp` passes because hooks hold on the first call only, so the count is 2. This addition follows.
    - T5, T6, T7, I1, I2 and I4 are killed.
    - T1, T2 and T4 pass. In T4 the drop runs step 3 with `stamp` false.
    - T8 passes only because the hooks fire on the first call only (item 12). Without that rule the second `cancel()` would panic again at `on_stamp`. Item 9 says this, so the survival is declared.
  - **M5.** T5, T7, I4 and `a_successful_run_stamps_no_cancellation_instant` are killed, because a drop now stamps. "the other tests pass" (form :474) reaches past §4's tests (D-4).
  - **Item 12, first call only.** No C2 prediction depends on a hook firing on a later call. At C2 every later call finds the flag set before step 3.
- **D7 (item 10).** Allowed as written.
  - The human's item 1 forbids making a failing assertion green with an added timeout. It adds "Waiting with a deadline for a real completion signal is not the same as retrying a failed assertion." (directive :20).
  - I3 is a new test. The 60 s bound waits for a real signal, the published flag. It retries nothing, lengthens no wait and fails by name.
  - ADV-2026-11-22-01 item 2 requires that such an addition "says so in a line of its own, and the gate reads that line against the message's item 1" (ADV-01 :20). Form :478 is that line.
  - `TEST_LIVENESS_DEADLINE` is private to `mod tests` (cancel.rs:326-333). The second copy at cancel.rs:303 sits in `test_support` and is also private, so a new constant is needed.
  - Note N-b covers sleeps in the spin.
- **D8 (item 11).** It is correct and matches my attempt-1 D8.
- **N2 (item 12).**
  - The substance is correct. `before_stamp` fires when `stamp` is false, so T5 can hold the drop inside the lock. That is ruling item 5.
  - The phrase "where today's mark would be" (form :488) is wrong: today's mark is after the publication (cancel.rs:133, then :135). See D-3.
- **N3 (item 13).** It is correct: stream.rs:1373-1374 and :799-803 are as stated.
- **N4 (item 14).** It is correct against the code.
  - Step 5's SeqCst load of `in_execute` after step 4's SeqCst store is one half of a Dekker pair. The other half is `execute_guarded`'s store at cancel.rs:194 and its load of `cancelled` at :197.
  - If the load moved before the publication, a canceller could read `in_execute` false while `execute_guarded` read `cancelled` false. The interrupt could then fall into DuckDB's start window with no re-interrupter.
  - No §4 test kills this. `cancel_when_executing` (cancel.rs:307-323) cancels only once `in_execute` is already true. Resting the item on review, like M6, is correct.
- **N5 (item 16).** It is correct. Its lead says it adds to §7, which it does not (D-6).
- **Item 15** (ruling item 6). It matches my section 2 and §5's residual. The untraced claim holds: the `mark` returns early (trace.rs:303-305), and `ENABLED` is false by default (:88).

## 4. The Scope and the count (item 3)
- Nine files, ceiling 800. Item 3 replaces §7's count command's path list.
- In my reading that is not an edit of the line §7 says is never edited:
  - §7's bytes stand, because the form is append-only.
  - Item 3 was made before any code and before any count.
  - Item 3 widens what is counted under the same ceiling, so it can only make an overrun easier to see, never hide one.
- Class 8 forbids editing §7 to match an overrun. That is not what item 3 does.
- Nothing more is needed to close it. The closing amendment gives the figure by item 3's nine-path command, or ten paths if open point (a) is taken, at a named commit.
- Not class 9. The ninth file comes from ADV-2026-11-22-07 item 3, a ruling on this piece made before any code, not from a standing rule.

## 5. Lead-data's open points (my recommendations; the advisor decides)
- **(a) `kernel/README.md` as a tenth Scope file. Recommend yes.**
  - kernel/README.md:392 lists "kernel halves of pieces filed elsewhere". This piece's kernel half is two kernel tests and an appended §10 to the design note that :393 points to.
  - The change is pointers only: this form's path added to :392's list and the last-verified line. The worker writes it, under the 800 ceiling.
  - It must be declared in an amendment before C1, with the count command over ten paths.
  - If the advisor declines, record the reason: by the index's own rule (kernel/README.md:359) no pointer's target changes.
- **(b) The residual in `skp_filter_cancellation`. Not the same risk.**
  - Its binary holds one test, kernel/tests/skp_filter_cancellation.rs:122-123, the only `#[tokio::test]` in the file.
  - Once the wrapper is gone, no other test and no earlier attempt's stream shares its process-wide trace.
  - Recommend that the build's record name it in one clause, so the residual's scope can be checked. Words in D-10.
- **(c) The data-plane callers. None breaks D3's order.**
  - protocol/data-plane/src/adapter_ws.rs:145, :163, :173, :180, :278, :295 and :305 each call `source_cancel.cancel()` as a statement of its own. The file takes no lock.
  - The `observed_at` lock taken by `observe_cancel` (protocol/data-plane/src/transport.rs:198-202) is released at the end of that statement, before `cancel`.
  - So they reach `transition` through `EngineCancel::cancel` (kernel/src/lib.rs:743-754) with no lock held: an empty prefix to D3's order.
  - Their notice closure (adapter_ws.rs:92-94) only calls `send_replace` on a watch channel. That is a leaf.
  - A canceller on a tokio worker can now block on `transition`, but only while another canceller of the same token runs steps 2 to 4. That is §2.2's principle-7 bullet, and no figure is claimed.

## 6. The superseded index (item 17, form :512-533)
- Every entry names a section the amendment changes.
- Missing:
  - §2.9's two proposed texts and their clause table, replaced by item 2;
  - §4's C4 line, which item 3 adds to;
  - §2.8 is listed as "added to", but item 10 replaces one of its sentences.
- One entry needs a matching correction: item 16's lead names §7, the index does not list it, and §7 is not changed (D-6).
- Fixes in D-9.

## 7. Retry, sleep, longer timeout, skip; item 2's pair; budget; 480 minutes
- Only D7's line adds a timeout. Nothing in the amendment adds a retry, a sleep or a skip.
- Item 1's paragraph and the ruled ADR note keep item 2's pair and the 100 ms budget.
- Nothing changes the 480 minutes.
- No STOP.

---

## Documentation (must fix before the merge; fix it before dispatch, as Amendment 2)
- **D-1.** Item 3's lead cites ruling item 1 alone. The item records ruling items 1 (b), 2 and 3.
- **D-2.** Item 4's third bullet sends both pointers to ruling item 1.
- **D-3.** Item 12's "where today's mark would be" (form :488) is wrong.
- **D-4.** Item 9's M5 line, "T3, T4, T6 and the other tests pass." (form :474), predicts passes beyond §4's tests.
- **D-5.** Item 5's second pin, :802-806, leaves out the comparison at verify-quotes.mjs:807. I read it at 03103b12; the reviewer confirms the line at 16c89655, the authoritative pin.
- **D-6.** Item 16's lead says "It adds to §2 and §7." (form :507), but nothing in §7 changes.
- **D-7.** The draft's filing line (draft :3) puts the added sentence "at the end of item 1's lead". It is second to last.
- **D-8.** Items 6 and 14 present byte-copied spans of my report (:175 and :262 @ eb1329ed) with no hash (round 12 (b)). The other line references in items 4 to 16 name a commit with no sha256 (round 14).
- **D-9.** Gaps in the superseded index (section 6 above).
- **D-10.** Conditional on open points (a) and (b).

**Amendment 2, the architect's words, whole** (append after form :537; the hashes come from the custodian's script):

```markdown
### Amendment 2 — 2026-11-22 — the architect's attempt 2 on Amendment 1: words and pins only

Made before any code. No outcome has been seen. The words are the architect's, from `state/consults/gates/2026-11-22-cancel-requested-stamp-order-form-gate-architect-attempt-2.md`, applied with no re-gate (ADV-2026-11-22-07 item 4). None is the human's wording.

1. Amendment 1 item 3 records ADV-2026-11-22-07 items 1 (b), 2 and 3, not item 1 alone. Its lead now reads: "ADV-2026-11-22-07 items 1 (b), 2 and 3, as ruled."
2. Amendment 1 item 4's third bullet resolves both pointers to the wrong ruling item. §1's pointer, about the doc comment above `CANCELLATION_REQUESTED`, resolves to ADV-2026-11-22-07 item 3 (Amendment 1 items 2 (c) and 3); §2.9's pointer, about the kernel note's place, resolves to that ruling's items 1 (b) and 2 (Amendment 1 items 2 (b) and 3).
3. Amendment 1 item 12's second sentence misplaces `before_stamp`, because today's mark comes after the publication. It now reads: "That is the point inside `transition`, before the publication, just before a call with `stamp` true makes its mark (§2.1 step 3; §2.3)."
4. Amendment 1 item 9's M5 line predicts passes beyond §4's tests. Its last sentence now reads: "T1 to T4, T6, T8, I1 and I2 pass."
5. Amendment 1 item 5's second pin leaves out the comparison line. It now reads `scripts/plan/verify-quotes.mjs:802-807` @ 16c896558ac9073f132336f4c9cbcff5b31d8514.
6. Amendment 1 item 16 changes nothing in §7. Its lead now reads: "It adds to §2."
7. The draft's filing line places the custodian's added sentence at the end of Amendment 1 item 1's lead; it is the lead's second-to-last sentence. Nothing else differs between the draft and Amendment 1 beyond the three changes that line names (read line by line at the architect's attempt 2; the reviewer's byte comparison is the proof).
8. *The custodian's pins for Amendment 1's line references, at the commits they name, one full path per hash, added below by script.* The spans byte-copied in Amendment 1 items 6 and 14 are sub-line spans of `state/consults/gates/2026-11-22-cancel-requested-stamp-order-form-gate-architect.md` lines 175 and 262 at eb1329edde00318444f589c136b34c550cae159c, and each carries its line's hash.
9. **Superseded index.**
   - §2.8's sentence that no deadline value is added: superseded in part by Amendment 1 item 10 (in place of Amendment 1 item 17's "§2.8: added to by item 10").
   - §2.9's two proposed texts and their clause table: superseded by Amendment 1 item 2.
   - §4's C4 line: added to by Amendment 1 item 3.
   - Amendment 1 items 3, 4, 5, 9, 12, 16 and 17: corrected by items 1 to 6 and this item.
   - Amendment 1's line references: pinned by item 8.

Read the last amendment first.

Nothing above is edited.
```

**D-10, conditional** (add as Amendment 2 items before item 9, and list them in the index, only if the advisor takes open points (a) and (b)):
- (a) "`kernel/README.md` joins the Scope as its tenth file, the owner's index only, pointers only: this form's path in the list of kernel halves of pieces filed elsewhere, and the last-verified line. The worker writes it. The line count is taken by `git diff --numstat origin/main...HEAD` over the ten paths at a named commit; the ceiling stays at 800 and an overrun is class 8. §8 item 11 reads the tenth file as in Scope."
- (b) Append to Amendment 1 item 15's residual: "`kernel/tests/skp_filter_cancellation.rs` does not carry this risk: its binary holds one test, so once its wrapper is gone no other stream shares its trace."

Clause check of the words:
- Item 1: the ruling's items 1 (b), 2 and 3 are form :414, :415 and :416-427.
- Item 2: §1's pointer is at form :108 and §2.9's at :192, against ruling items 3, 1 (b) and 2.
- Item 3:
  - `transition` is held through step 4 (§2.1 steps 1 to 4);
  - step 3 comes before step 4;
  - `before_stamp` comes just before the mark (§2.3, form :160);
  - today's mark comes after the publication (cancel.rs:133, then :135).
- Item 4: under M5, T1, T2, T3, T4, T6, T8, I1 and I2 each stamp at most once, from a `cancel` (section 3, D6).
- Item 5: verify-quotes.mjs:807 is `if (actual !== ref.hash)` at 03103b12.
- Item 6: item 16 names only cancel.rs comments, and cancel.rs is already in Scope.
- Item 7: draft :11 against form :394.
- (b): skp_filter_cancellation.rs:122-123 is the only test attribute in the file.

## Notes
- **N-a.** D3's two further edges are not every edge. Registry → DuckDB's interrupt-handle internals and registry → the watch channel inside `notify` (lib.rs:751-753 under `tickets`) are also edges. Both are leaves, so the no-cycle claim stands.
- **N-b.** For D7, the build's gate checks that I3's spin does not sleep. A sleep there would need a line of its own (§8 item 1). A tight spin is also what gives I3 its detection power. It should be stated whether the 60 s deadline applies per iteration or to the whole run.
- **N-c.** The ADR-018 note is an amendment to an accepted ADR. It was ruled under the delegation and goes into the human's digest (ruling item 7). This is carried forward and not reopened.
- **N-d.** I recomputed no hashes. The reviewer recomputes the pins line at form :398, item 2's three hashes and Amendment 2's pins.

No ADR skeleton is needed: no decision is missing.

Relevant paths:
- C:\dev\wt\gate-read\governance\forms\engine\CANCEL-REQUESTED-STAMP-ORDER-PREREGISTRATION.md
- C:\dev\wt\gate-read\state\consults\gates\2026-11-22-cancel-requested-stamp-order-form-gate-architect.md
- C:\dev\wt\gate-read\state\directives\2026-11-22-advisor-ruling-adv-2026-11-22-07-the-cancel-forms-notes-in-the-architects-words-the-ninth-file-attempt-2-on-amendment-1.md
- C:\dev\wt\gate-read\state\drafts\2026-11-22-cancel-requested-stamp-order-form-amendment-1-lead-data-draft.md
- C:\dev\wt\gate-read\engine\src\cancel.rs
- C:\dev\wt\gate-read\engine\src\trace.rs
- C:\dev\wt\gate-read\kernel\src\lib.rs
- C:\dev\wt\gate-read\kernel\src\skp.rs
- C:\dev\wt\gate-read\protocol\data-plane\src\adapter_ws.rs
- C:\dev\wt\gate-read\kernel\tests\skp_filter_cancellation.rs
- C:\dev\wt\gate-read\kernel\README.md
- C:\dev\wt\gate-read\scripts\plan\verify-quotes.mjs
