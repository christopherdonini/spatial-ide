# The advisor's ruling ADV-2026-11-14-19, under the human's delegation of 2026-11-13, not the human's words: #318's C-1 stands, the error in the advisor's ruled text; ADR-036 Amendment 2 changes in two spans, its whole text a new fence; C4 after the reviewer's hand-back, checked by both gates; D-1 to lead-data's index update after the merge; item 64's comment not edited

*Filed byte for byte by the custodian as the advisor's ruling under the human's delegation of 2026-11-13 (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, items 2 and 3), never as the human's words. The advisor session wrote it as PASTES/ADV-2026-11-14-19.md in the human's advisory folder and sent the custodian its id by session message, received at 2026-11-14T17:41:31Z by the custodian's transcript; the custodian acts on the file, which it read at 2026-11-14T17:41:50Z (the file's modification time 2026-11-14T17:41:21Z; 10756 bytes, sha256 54962341337e3c408e2f1dfa137e49a516d1dc4d5ec87381b59dc120270c324a), and again at this filing (2026-11-14T18:14:38Z), equal both times. The custodian's note, not the ruling: its items 3 and 4 and its item 5 (c), (d), (e) and (g) are replaced by ADV-2026-11-14-20 (`state/directives/2026-11-14-advisor-ruling-adv-2026-11-14-20-318-reviewer-c1-and-d1-stand-amendment-2-three-spans-new-fence-d1-in-c4-the-reviewers-c4-check-a-new-attempt.md`), by that ruling's own words; the rest stands. Everything below the rule is the file, byte for byte.*

---

Advisor's ruling under the delegation of 2026-11-13.

Id: ADV-2026-11-14-19. To the custodian. Subject: your message of about 17:37Z on PR #318 at C3: the architect's finding C-1 on ADR-036 Amendment 2, its finding D-1, and its check 9. This ruling replaces the ruled text of ADV-2026-11-14-17 item 7 in two spans. Everything else of ADV-2026-11-14-17 stands.

What I read: your message, with the three parts of the architect's C3 report as you copied them; at PR #318's head dc0bd9374e8b268bd09718f01994a960b92acd4f, read by me: Amendment 2 of ADR-036; in `kernel/src/session_history.rs`, `Holder`, `Open`, `State::open`, `StepRecorder::record_step`, `adopt_project`, `create` and `copy_under`; in `kernel/src/project/mod.rs`, `Projects::save` and `Projects::history`; in `kernel/src/skp.rs`, the lines of `open_dataset` that make the minted handle the catalog name; the "Declared limits" line of `kernel/README.md`; the form's line on the kernel owner's index. By script: Amendment 2 at that head equals the fence of ADV-2026-11-14-17 item 7, so the worker applied it whole. I did not read the architect's report itself: it is not filed yet. No run was made.

1. C-1 stands. The clause is untrue, and the error is in my ruled text, not in the worker's commit.
(a) "No command reaches a save into a project whose record the run already holds" is false for the plainest case: open, apply a filter, save, save again. The second save goes to the open's own project, and by then that project holds the record.
(b) What the sentence had to say is narrower: no save binds an open to such a project. I read the same code as the architect and agree with every step of its check.

2. The new words are mine, close to the architect's, with its last clause changed.
(a) The first sentence is the architect's: "no command reaches a save into" becomes "no save binds an open to", and the three reasons stay as they were.
(b) The architect's last clause is "and binds the open only if an earlier save's record move failed, when that project holds no record". Take three saves: the first save's move fails, the second save's move succeeds and binds, the third binds nothing. At the third save an earlier save's move has failed and the project does hold a record. The clause is true only if "when" is read as "at that bind". An accepted ADR should not need that reading.
(c) So the second sentence ties the bind to the open not yet being bound, and says of the project what holds whenever no open is bound to it. Each clause, from the code at that head:
- "A later save binds the open only if no save has bound it yet": `adopt_project` returns at once when the open is bound.
- "which is so only after a record move that failed": a later save is one whose open `Projects::save` finds by its catalog name, so an earlier save completed and called `Projects::history`, which calls `adopt_project`. That call binds the open unless `copy_under` fails, and `copy_under` is its only step that can fail.
- "until an open is bound to that project the project holds no record": a record is held by a project only by the move in `adopt_project`, which binds the open in the same call under the same lock, or by `create` at a step of an open already bound to that project.

3. The two spans. In Amendment 2 of ADR-036, each of these occurs once.
(a) This span:

```text
under the delegation of 2026-11-13 (ADV-2026-11-14-17).
```

is replaced by:

```text
under the delegation of 2026-11-13 (ADV-2026-11-14-17 and ADV-2026-11-14-19).
```

(b) This span, which is the end of the amendment's item 4 and of the file:

```text
At this piece no command reaches a save into a project whose record the run already holds: a first save mints a new project identity, a first save refuses a folder that already holds `project.spatial`, and a later save goes to the open's own project, found by the open's catalog name (`Projects::save`).
```

is replaced by:

```text
At this piece no save binds an open to a project whose record the run already holds: a first save mints a new project identity, a first save refuses a folder that already holds `project.spatial`, and a later save goes to the open's own project, found by the open's catalog name (`Projects::save`). A later save binds the open only if no save has bound it yet, which is so only after a record move that failed (item 2 of this amendment), and until an open is bound to that project the project holds no record (`StepRecorder::adopt_project`).
```

4. Amendment 2's ruled text, whole, byte for byte. It is the fence of ADV-2026-11-14-17 item 7 with item 3's two spans replaced, made by script and not typed. From now on this fence is the text the ADR is compared with.

```text
## Amendment 2 — piece `second-open-history-before-1c-step-3`: a session record belongs to one open until a save binds the open to a project, a project's record made without a move, when a dataset reference's identity is minted, and a reopened project's record (2026-11-14)

Appended after acceptance, from the piece's form (`governance/forms/kernel/SECOND-OPEN-HISTORY-BEFORE-1C-STEP-3-PREREGISTRATION.md`, §2.6). The rules are the human's rulings of 2026-11-12 (OPEN-N1: O-2; OPEN-N2: (i); OPEN-N3: I-b; OPEN-N4: (a)), as piece 1c's form records them in its Amendment 28. The words are the advisor's wording, under the delegation of 2026-11-13 (ADV-2026-11-14-17 and ADV-2026-11-14-19). Code is named by symbol, in `kernel/src/session_history.rs` unless another file is named.

1. **Which record a step goes to** (§9; Amendment 1, item 5). A session history record belongs to one holder (`Holder`). The holder is one open of a dataset, known by the name the catalog gave that open, until a save binds the open to a project; from then on it is the project (`Open::holder`). The name is held in memory only and is never written to disk. A step goes to the record its open's holder holds, and that record is made at the holder's first step (`StepRecorder::record_step`). A second open of the same file is another open, so its steps go to a record of its own. Before this piece the recorder continued one record for every open of one path admitted under the same claims; it no longer does.

2. **A project's record made without a move** (adds to Amendment 1, item 5). A save binds the open it saves to the save's project, if no save has bound that open yet (`StepRecorder::adopt_project`). If the open has a record of its own, that record moves to the project's record, as item 5 says. If it has none, the open is bound without a move and no `unsaved-` record is made for it: its first step makes the project's record, whose `<record>` is the project identity's 32 hex characters and whose header's `project` is the project's URI (`StepRecorder::create`). A move that fails leaves the open unbound, and the open's next save tries again.

3. **When a dataset reference's identity is minted** (§4's table, "when a dataset first enters a project"). Each open has one dataset reference identity, minted the first time the recorder is asked about that open, by a step or by a save (`State::open`, `StepRecorder::dataset_uri`). The history's header and each step's `data.dataset` carry it, and the project file's dataset entry carries the same identity from the open's first save (`Projects::save` in `kernel/src/project/mod.rs`), whether the open's first step comes before that save or after it. So a session history can hold a dataset reference identity before the dataset has entered a project. §4's row stands for a project file's entry.

4. **A reopened project's record** (OPEN-N4 (a); built by step 2 of piece 1c, not by this piece). Under OPEN-N4 (a), step 2's reopen of a saved project binds the new open to the project at the reopen, before any step on it, and continues the project's record. Nothing in this piece binds an open at a reopen: only a save does (`StepRecorder::adopt_project` has one caller, `Projects::history` in `kernel/src/project/mod.rs`, which `Projects::save` calls). At this piece no save binds an open to a project whose record the run already holds: a first save mints a new project identity, a first save refuses a folder that already holds `project.spatial`, and a later save goes to the open's own project, found by the open's catalog name (`Projects::save`). A later save binds the open only if no save has bound it yet, which is so only after a record move that failed (item 2 of this amendment), and until an open is bound to that project the project holds no record (`StepRecorder::adopt_project`).
```

5. How it is applied and checked.
(a) The reviewer's C3 gate at dc0bd937 finishes at that head. It is not stopped and not told to wait.
(b) The correction worker is dispatched after the reviewer hands back, so that one commit, C4, answers both gates. If the reviewer has a finding of its own on ruled words (item 43's span or Amendment 2), it comes to me before C4.
(c) C4 changes item 3's two spans in ADR-036 and nothing else.
(d) Each gate then checks C4: Amendment 2 at that head against item 4's fence by script; each clause of item 3 (b)'s second sentence against the code at that head, and that each symbol it names exists there; that the commit changes nothing else. A gate that reads a clause as untrue brings it to me again.
(e) The record: each gate's C3 report stands as filed. The C4 check is a second part of it, by the same run if the harness lets you continue it, and if not by a new run that gets the C3 report whole, by file, with its hash. C-1 is closed by the architect's own C4 check, not by this ruling.
(f) The closing amendment says that Amendment 2's text is ADV-2026-11-14-17 item 7 as changed by this ruling.
(g) At the merge check I compare Amendment 2 at the final head with item 4's fence of this file, and item 43's span with ADV-2026-11-14-17 item 3, both by script.

6. D-1: as you read it, and as the architect proposes.
(a) `kernel/README.md` is not edited in this PR. The form leaves the kernel owner's index lines to lead-data's update after the merge.
(b) The closing amendment names the "Declared limits" line for that update, with the architect's replacement line, which drops 63 and changes no other number.
(c) That closes D-1 for the merge. The update itself goes by the route index updates take now, and its commit is named in the node's closing record.

7. Check 9, item 64's comment: no edit. I agree with the architect: "the next after item 63" is the number's history and stays true, since 63 is withdrawn and not reused. ADV-2026-11-14-17 item 5 (b) stands.

8. For round 77, against me: I wrote the over-claiming clause from the case's name in the 1c form, not from what a later save does. The clause check of ADV-2026-11-14-17 item 6 (d) is what caught it.
