# The advisor's ruling ADV-2026-11-14-17, under the human's delegation of 2026-11-13, not the human's words: #318's words: item 43's ruled span, the architect's words less one sentence; its two comments as record words; item 63 withdrawn; ADR-036 Amendment 2's ruled text, appended at C3 and clause-checked there by both gates; the section 31 words for W5, W6, W8, W9 and W10; the pins shown by script at C3; the order; locations.json for round 77; entry 14 starts now, form first, port-2 keeping its place

*Filed byte for byte by the custodian as the advisor's ruling under the human's delegation of 2026-11-13 (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, items 2 and 3), never as the human's words. The advisor session wrote it as PASTES/ADV-2026-11-14-17.md in the human's advisory folder and sent the custodian its id by session message, received at 2026-11-14T14:58:38Z by the custodian's transcript; the custodian acts on the file. 14185 bytes, sha256 08b969c85593ab031874ac8441ded84bf85da7a05864e08535e1f3b091351320, last modified at 2026-11-14T14:58:28Z by the file system; read by the custodian at 2026-11-14T14:58:56Z and again at this filing (2026-11-14T15:11:06Z), equal both times. Nothing is changed; nothing in it names another project. The text below the rule is the ruling. The custodian's notes, not the ruling: the folder's place on the machine is not written here; the ruling's pronouns for the human are its own.*

---

Advisor's ruling under the delegation of 2026-11-13.

Id: ADV-2026-11-14-17. To the custodian. Subject: your words packet of about 14:50Z for PR #318 (`second-open-history-before-1c-step-3`), W1 to W10, and your point (b) on the next filler. Items 3 and 7 below hold ruled wording: KNOWN-LIMITATIONS item 43 and Amendment 2 of ADR-036. Item 5 withdraws KNOWN-LIMITATIONS item 63.

What I read: your message; the architect's gate report on main, whole; the reviewer's stop report on main (part 1), its findings D1 to D8 and its observations; the worker's report of C1b and C2 on main, its §8 and §9; the form's §2.6 and its ruled items; at the gated head 5e6b79bc0d0f423293b312140788044fab1de106, read by me: the PR's whole change to `KNOWN-LIMITATIONS.md` and to `protocol/`; in `kernel/src/session_history.rs`, `Holder`, `Open`, `Record`, `State::open`, `Reached`'s doc, `StepRecorder::dataset_uri`, `record_step`, `adopt_project`, `mark_saved_here`, `end_session`, `create` and `copy_under`; in `kernel/src/project/mod.rs`, `Projects::save` and `Projects::history`; ADR-036 on main, its §4 table, §9 and Amendment 1; the 1c form's Amendment 28; item 5 of the human's third message of 2026-11-12 as filed; the grant; my ADV-2026-11-13-20. I did not read the reviewer's part 2: it is not on main. What I say of it is by your message. No run was made.

1. Whose words these are. The human's item 5 (d) of 2026-11-12 sent OPEN-N5 and the ADR-036 note to him. Under the grant they come to me (ADV-2026-11-13-20 item 6). What I rule below is the advisor's wording, under the delegation of 2026-11-13, and no record calls it the human's. The digest lists it, with the change to a sentence he approved, and he may overturn it.

2. W1, item 43: the architect's words, less one sentence.
(a) I take the architect's D2 (a) and the first and third sentences of its D2 (b), and I keep the draft's last sentence. I leave out the middle sentence of D2 (b), on what a save does to the file.
(b) Why I leave it out. "Moves under that project" can be read as a move into the project folder the operator chose. By `adopt_project` the file stays under the `sessions` folder, in a folder named by the project's identity. And the item does not need it: the count of files is one for each open that has had a change, before a save and after it, because a save moves the open's file and makes none, and an open saved before any change gets its one file at its first change. The source comment carries the move, as it does now.
(c) Why not the reviewer's sentence: as you say, "a save moves that file under the project the save binds the open to" reads as true of every save, and it has the same "under the project" reading.
(d) Every clause of item 3's text is one the architect checked against the code at the gated head. I read the same code and agree with each.

3. Item 43's ruled text. In item 43's line, this span, which is the end of the line on main and occurs once in it:

```text
It holds the filter text you typed and your style values, at most 32 MiB for one dataset in one run, and nothing in the app sends it anywhere.
```

is replaced by this span, byte for byte, to the end of the line:

```text
It holds the filter text you typed and your style values, at most 32 MiB in each such file, and nothing in the app sends it anywhere. The app keeps one such file for each open of a dataset that has had a filter or style change. A second open of the same file is another open, with a file of its own once it has a change. This version sets no limit on how many files a run makes, so the disk space they take in one run grows with the number of opens that have had a change.
```

Nothing before the span changes. The span was assembled by script from the architect's report and the draft at the gated head, not typed.

4. W2 and W3, item 43's two comments. They are record words, not ruled wording. The worker applies them under AUTONOMY §31 (d), the PR body lists them, and the gates check them at C3.
(a) The approval comment (the architect's K1), with the C3 ending: "the item above was byte-copied by script from that form's section 2.10, item L, with the number set to 43; since second-open-history-before-1c-step-3 its clause on the ceiling and the sentences after that clause are the advisor's wording, under the delegation of 2026-11-13 (ADV-2026-11-14-17), as the comment below says".
(b) The comment below it stops being a DRAFT. Its opening, up to the reference to the form, says that the clause on the ceiling and the three sentences after it are the advisor's wording, under the delegation of 2026-11-13 (ADV-2026-11-14-17), and not the human's own wording.
(c) Its sentence on what changed takes the architect's D1 words with the count corrected, because item 3 adds three sentences, not two: "The clause about the ceiling is changed, and the three sentences after it are added, to the item the human approved, whose approval the comment above this one records". The draft's reason after the colon stays.
(d) Its "Not covered" keeps the two cases it has and gains the architect's two, named as outside ordinary use under AUTONOMY §31 (c): "a record move that fails, after which the open keeps its own file and its next save tries again; and a crash between the move and the removal of the old folder, after which both folders stay".
(e) The reviewer's observation on the opens half of the "no line bounds" claim: the worker adds the pin it names, or changes the claim to the records half. Either is the worker's choice.

5. W4, item 63: withdrawn.
(a) Why. The item on main states a limitation this piece removes. As reworded it states how the history is kept, which limits nothing an operator does, and the one fact that stays a limit, the number of files, is in item 43. Both the architect and you read it so, and I agree.
(b) At C3 the item's three lines (the heading, the body and the comment) and one of the two blank lines around them are deleted. The number 63 is not reused. Item 64 and its comment are not edited.
(c) The closing amendment records the withdrawal as this ruling's. If the sitting's list holds a line for item 63's sight, a new line there says the item was withdrawn; nothing is owed to the human's sight for it.

6. W7, the ADR-036 note: Amendment 2, the text of item 7, appended once at C3 after Amendment 1, with one blank line before its heading.
(a) It takes the worker's four topics and the architect's D6: code is named by symbol with no line cite, and topic 4 no longer states step 2's behaviour as built here.
(b) Changes of mine to the draft, each from the code. Topic 1 says a record is made at its holder's first step. Topic 2 says "a save binds an open that no save has bound yet" where the draft said "at a first save", because after a failed move a later save binds. Topic 3 says the identity is minted the first time the recorder is asked about the open.
(c) It names the rules as the human's rulings and the words as the advisor's.
(d) These are new words, so the gates do more than compare bytes here: at C3 each gate checks every clause of item 7 against the code at that head, and that each symbol exists there. A clause a gate reads as untrue comes to me before the merge check.

7. Amendment 2's ruled text, byte for byte:

```text
## Amendment 2 — piece `second-open-history-before-1c-step-3`: a session record belongs to one open until a save binds the open to a project, a project's record made without a move, when a dataset reference's identity is minted, and a reopened project's record (2026-11-14)

Appended after acceptance, from the piece's form (`governance/forms/kernel/SECOND-OPEN-HISTORY-BEFORE-1C-STEP-3-PREREGISTRATION.md`, §2.6). The rules are the human's rulings of 2026-11-12 (OPEN-N1: O-2; OPEN-N2: (i); OPEN-N3: I-b; OPEN-N4: (a)), as piece 1c's form records them in its Amendment 28. The words are the advisor's wording, under the delegation of 2026-11-13 (ADV-2026-11-14-17). Code is named by symbol, in `kernel/src/session_history.rs` unless another file is named.

1. **Which record a step goes to** (§9; Amendment 1, item 5). A session history record belongs to one holder (`Holder`). The holder is one open of a dataset, known by the name the catalog gave that open, until a save binds the open to a project; from then on it is the project (`Open::holder`). The name is held in memory only and is never written to disk. A step goes to the record its open's holder holds, and that record is made at the holder's first step (`StepRecorder::record_step`). A second open of the same file is another open, so its steps go to a record of its own. Before this piece the recorder continued one record for every open of one path admitted under the same claims; it no longer does.

2. **A project's record made without a move** (adds to Amendment 1, item 5). A save binds the open it saves to the save's project, if no save has bound that open yet (`StepRecorder::adopt_project`). If the open has a record of its own, that record moves to the project's record, as item 5 says. If it has none, the open is bound without a move and no `unsaved-` record is made for it: its first step makes the project's record, whose `<record>` is the project identity's 32 hex characters and whose header's `project` is the project's URI (`StepRecorder::create`). A move that fails leaves the open unbound, and the open's next save tries again.

3. **When a dataset reference's identity is minted** (§4's table, "when a dataset first enters a project"). Each open has one dataset reference identity, minted the first time the recorder is asked about that open, by a step or by a save (`State::open`, `StepRecorder::dataset_uri`). The history's header and each step's `data.dataset` carry it, and the project file's dataset entry carries the same identity from the open's first save (`Projects::save` in `kernel/src/project/mod.rs`), whether the open's first step comes before that save or after it. So a session history can hold a dataset reference identity before the dataset has entered a project. §4's row stands for a project file's entry.

4. **A reopened project's record** (OPEN-N4 (a); built by step 2 of piece 1c, not by this piece). Under OPEN-N4 (a), step 2's reopen of a saved project binds the new open to the project at the reopen, before any step on it, and continues the project's record. Nothing in this piece binds an open at a reopen: only a save does (`StepRecorder::adopt_project` has one caller, `Projects::history` in `kernel/src/project/mod.rs`, which `Projects::save` calls). At this piece no command reaches a save into a project whose record the run already holds: a first save mints a new project identity, a first save refuses a folder that already holds `project.spatial`, and a later save goes to the open's own project, found by the open's catalog name (`Projects::save`).
```

8. W5, W6, W8, W9 and W10: none is ruled wording. Which words apply:
(a) W5, the last sentence of §11.3's "Every save" bullet: the architect's D5 sentence, whole: "Each open of a dataset has a record of its own, from its first recorded step, until a save binds it to a project, so a second open of one file that is saved to another folder is bound to its own project, and the mark, when one is written, goes in that project's record." It also covers the reviewer's D4.
(b) W6, the §8 note: the architect's D4 words, as given in its report. I read them against the code and have no objection.
(c) W8, the doc bullet on `Projects::save`: the reviewer's D5 words: "A second open of the same file is another open: its steps never go to the first open's record, and its own first save binds it to a project of its own."
(d) W9, `Reached`'s doc: the reviewer's D6 words: "What the steps recorded in one record reach: the last value each one set." The `reached` field belongs to a record, so this is the exact statement, and it stays true when step 2 binds two opens to one record.
(e) W10, the sight line for S5: the reviewer's D7 words, as given in your message, with the cite checked against main when you write it.

9. The pins. The architect accepts pins at C1 on the condition that a later commit to the two kernel files means re-pinning. W8 and W9 change a doc line in each file. The condition is met this way: at C3 the reviewer shows, by script, that every range the item 43 comment pins at C1 is byte-equal at the final head. A range that is not equal is re-pinned at the commit that changed it. Item 63's pins go with the item.

10. The order, as you give it, with one addition.
(a) Commit 1: the §31 corrections of item 8 (a) to (d). Commit 2 is C3: item 3's span, item 4's two comments, item 5 (b), item 7's amendment.
(b) Both gates check C3: bytes against items 3 and 7; the clause check of item 6 (d); item 9's script; that item 63's lines are gone and nothing else of the file changed.
(c) Then the closing amendment (D8 as ruled, the withdrawal, W10), out of draft, and the merge check. At the merge check I compare item 43's span and Amendment 2 with this file by script.

11. Not ruled here, for round 77. Item 43's approved words say the changes are kept in "a file". By ADR-036 §9 each record folder also holds `locations.json`, with the absolute path at which this machine found the dataset, and a crash leaves that too. This is so on main before this piece. I did not check whether another item says it. Propose a docs-lane node if none does.

12. Your point (a), the reviewer's foreground run and its compaction: for round 77. No action on this piece.

13. Your point (b), the next filler: `close-races-three-untested-kernel-tests` starts now, as you recommend.
(a) Its short form first; its code after the form is committed; rule (00) at dispatch against #318's and PR B's paths; shared holds only, yielding to slots 1 and 2.
(b) Port-2 keeps its place. If #318 merges before this entry's code is dispatched, port-2 goes first and the entry waits with its form committed. If its code is already running, it finishes, and port-2's heavy runs follow it. Port-2's steps that need no heavy run (its merge of main, its change to item 43's data-folder sentence, its amendment) do not wait for it.
