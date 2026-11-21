*Filed by the custodian: the extraction for the five figures of the advisor's ruling ADV-2026-11-21-20 item 5 (from 2026-11-16 to that ruling), part 2 of 2, rows 787 to 812 of the gate log at ad2088a8, report extraction only, the hand-back of the evidence reader (claude-sonnet-5-5), 34705 bytes, sha256 19e54b2230f907250b0812c01dff866e83701804a720beeec1f6b701246cb979, below the rule, nothing masked by the custodian. Its calls in the transcript, by unique call ids: Read 26, SubagentHandback 1; errored: 0, from 2026-11-21T14:30:20Z to 2026-11-21T14:33:34Z. The figures are computed by the custodian from both parts and go to the advisor in the next daily batch.*

---

Status: complete. All 26 reports were read whole and each ended at its own final line. No turn-limit stop.

Reading the table:
- Verdict is copied as the report writes it. In 805, 808 and 811 the report's verdict line carries a trailing clause, which I cut after the first clause.
- Weight is as written. "not stated" means the report gives the finding no weight of its own. Where the report puts a weight only on the section heading, I copy the heading's words in quotes.
- "Observation" or "Note" findings carry the heading they sit under.
- The last column is filled only for blocking or must-fix findings. "n/a" means the finding is not marked blocking or must-fix. "not said" means the report does not say words alone close it.
- Findings the report itself marks "None" in Correctness or Evidence get no line. If every class in a report is none, the report gets one `none` line.
- Titles are copied and cut with … where long.

| row | verdict (copied) | finding id | class (as written) | weight (as written) | title (copied) | words alone close it |
|---|---|---|---|---|---|---|
| 787 | Verdict: PASS WITH NOTES | D1 | Documentation | "must fix before the merge" | The `watchConsole` doc comment, `frontends/shell/e2e/command-bar.mjs:396 at H2`. | "to fix before the merge with no re-gate" |
| 787 | same | D2 | Documentation | "must fix before the merge" | The C1 worker's second report (`<S>`/flc1r-rep-1.md, not yet filed) prints this project's own `project=` value in its unmasked hold and release lines. | "to fix before the merge with no re-gate" |
| 787 | same | O1 | Observation | not stated | O1, (b): a reading clicks closed groups only when its sum check passes (`:392-393`). A discarded reading clicks nothing. | n/a |
| 787 | same | O2 | Observation | not stated | O2, (b): a reading also returns null when the label cannot be parsed (`:384`). | n/a |
| 787 | same | O3 | Observation | not stated | O3, (d): F2 is set at the reading (`:407`) but thrown only at the wait after the map checks (`:488`). | n/a |
| 787 | same | O4 | Observation | not stated | O4, (e): the verdict comes from the first reading handled after `checked` (`:408`). | n/a |
| 787 | same | O5 | Observation | not stated | O5, (a): `consoleLabel` waits two animation frames, or 500 ms, before it reads the label (`:379`). | n/a |
| 787 | same | O6 | Observation | not stated | O6, item 67 (the advisor's words): "other than by the app's own cancel" is true on the reading that it covers the cancels the manager makes… | n/a |
| 788 | Verdict: FAIL | E1 | Evidence | not stated ("The FAIL rests on one Evidence finding, E1") | K-O19 has no observed mutation of its own claim. | not said ("It needs no product change") |
| 788 | same | D1 | Documentation | "each must be fixed before the merge, with no re-gate" | `SavedProject._lock`'s doc, `kernel/src/project/mod.rs:131-132 at H`. Draft 1. | "each must be fixed before the merge, with no re-gate; none of these sentences is the human's wording" |
| 788 | same | D2 | Documentation | same | `Projects::save`'s later-save bullet, `kernel/src/project/mod.rs:232-234 at H`. Draft 2. | same phrase |
| 788 | same | D3 | Documentation | same | Two sentences in `kernel/src/project/mod.rs` that this part made untrue for a reopen: (the report adds that the advisor decides whether they join the words commit) | same phrase |
| 788 | same | D4 | Documentation | same | `kernel/src/session_history.rs` docs that still say only a save binds an open. `reopened` now binds too (`:393-395 at H`): | same phrase |
| 788 | same | D5 | Documentation | same | The K-O19 comment carries a bare `:1673` into the file its own commit edits (`kernel/tests/project_reopen.rs:1666 at H`). | same phrase |
| 788 | same | D6 | Documentation | same | `governance/PLAN.yaml`'s node summary does not name P3a-2's pre-committed producers: `Projects::open_project`, `Answer`, `Reopen`, `Opened`, `ViewState` and `OpenFail…` | same phrase |
| 788 | same | O1 | Observation | "(none blocks)" | A re-link refusal after step 3's writes. | n/a |
| 788 | same | O2 | Observation | "(none blocks)" | `mtime` against the form's F4 row. | n/a |
| 788 | same | O3 | Observation | "(none blocks)" | Cancel just before the return. | n/a |
| 788 | same | O4 | Observation | "(none blocks)" | For P3b: | n/a |
| 788 | same | O5 | Observation | "(none blocks)" | A copy followed by `not_found`. | n/a |
| 789 | Verdict: PASS | Finding 1 (attempt 1's id) | Evidence ("None open") | "blocking Evidence" (as attempt 1's weight) | Finding 1 (attempt 1, blocking Evidence) is answered. | n/a (reported answered) |
| 789 | same | Findings 2, 3 and 4 (attempt 1's ids) | Documentation ("None open") | not stated | Findings 2, 3 and 4 are applied byte for byte (check 3) | n/a |
| 790 | Verdict: PASS WITH NOTES | D1–D7 (one heading) | Documentation | "must fix before the merge" | the architect's Drafts 1–7 (its report at b5c35156), adopted word for word. | "the worker applies the words with no re-gate, and the PR body lists them" |
| 790 | same | D8 | Documentation | same | the comment above K-O19 (supersedes architect Draft 8). | same phrase |
| 790 | same | D9 | Documentation | same | `kernel/src/session_history.rs:135-136 at H` (Open::uri's doc). | same phrase |
| 790 | same | D10 | Documentation | same | the closing amendment must name K-O25. | same phrase |
| 790 | same | D11 | Documentation | same | the closing amendment records class 8. | same phrase |
| 790 | same | A1 | "To the advisor (Observations; none blocks)" | not stated | Two reorderings that come with Amendment 41 item 3(a) but are not declared by it. | n/a |
| 790 | same | A2 | same | not stated | ADR-036 Amendment 2 item 3 (`docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:291 at H`). It is pre-existing, and the PR does not edit it. | n/a |
| 790 | same | A3 | same | not stated | Differences between the mutation table script and the item 7(b) table rows. | n/a |
| 790 | same | A4 | same | not stated | K-O25 has no catalog assertion. | n/a |
| 791 | Verdict: PASS WITH NOTES | N1 | Documentation | "Each item must be fixed before the merge, in the closing amendment" | Two reply orderings follow from Amendment 41 item 3 (a), and item 3 (b) does not declare them. | "No re-gate is needed." |
| 791 | same | N2 | Documentation | same | K-O25 has no catalog assertion. | same |
| 791 | same | N3 | Documentation | same | The E1 sentence in the closing says no more than Amendment 40 item 5 allows. | same |
| 792 | Verdict: PASS WITH NOTES | D1 | Documentation | "must-fix before the merge where marked" (D1 has no mark of its own; "for Amendment 2, which is not yet written") | Amendment 1, item 8, says PR 335's commits 5c913c14 and e1fd8495 "touch the E-FL entry, not the selection entry". | n/a (no own mark) |
| 792 | same | D2 | Documentation | same heading; no mark of its own | At M, the selection entry's line is README.md:760, not 756. | n/a (no own mark) |
| 793 | Verdict: PASS WITH NOTES | C-1 | Correctness | "Not blocking. `to the advisor`." | Item 68's S3 is untrue when the map has no grid frame yet: an Apply or Clear made while the open's own first look is still running. | n/a |
| 793 | same | D-1 | Documentation | "(must be fixed before the merge)"; `to the advisor` | "item 64's comment lists them" is untrue. | not said ("The words are the advisor's.") |
| 793 | same | D-2 | Documentation | same | Loose pin `frontends/shell/src/table/tableSource.ts:119-126 @ 203ceef1…`, in L480 and L488. | "These are the worker's pins, so the worker applies the correction." |
| 793 | same | D-3 | Documentation | same | Loose pin `frontends/shell/src/workspace/filterClauses.ts:84-108`, L448 "proposeClauseChange's refusal". | not said ("The worker's pin.") |
| 793 | same | O-1 | Observations (not findings) | not stated | Item 68's S1 names an Apply or a Clear. Two other callers reach the same `reissueUnrestricted` window: | n/a |
| 793 | same | O-2 | Observations (not findings) | not stated | L467's sentence on `setResidencyArm("baseline")` says its file and line are left to the gates. | n/a |
| 793 | same | O-3 | Observations (not findings) | not stated | L467's `attributesNotHeld` pin (App.tsx:861) is the declaration. | n/a |
| 794 | Verdict: PASS WITH NOTES | N-1 | Notes | "`to the advisor`, not blocking." | The comment's clause "an Apply or a Clear made while the open's own first load is still running is of that kind" is not always true. | n/a |
| 794 | same | N-2 | Notes | "information only" | The comment's "the effect that asks again when Colour by changes its column" leaves out the effect's `attributesNotHeld === dataset` condition (App.tsx:2061). | n/a |
| 795 | Verdict: PASS WITH NOTES | D-1 | D. "Must-fix before the merge (documentation and record)" | "to the advisor" | Text: ADV-2026-11-19-28 item 2 (d), carried by Amendment 46 item 2 (d): "P4's suites are the first to run it". | not said |
| 795 | same | D-2 | same | "to the advisor" | Text: ADV-2026-11-19-28 item 4, carried by Amendment 46 item 4: "Reaching it needs a release between the command's own checks and the mutex". | not said |
| 795 | same | D-3 | same | "to the advisor" | Text: fence 4 at commands.rs:15: "`close_dataset` alone starts a second call". | not said |
| 795 | same | D-4 | same | "to the advisor" | Text: the last sentence of `release_ended`'s doc, mod.rs:242-244 (the worker's words). It names "before the session ended" only. | not said |
| 795 | same | D-5 | same | "to the advisor" | Text: `close_dataset`'s doc, commands.rs:118: "is started on a thread of its own". | not said |
| 795 | same | D-6 | same | "record" | Under Amendment 46 item 6, src-tauri stands at 27 against a ceiling of 25: an overrun of 2. | not said |
| 795 | same | E-1 | E. "Evidence for the closing amendment, before the merge (not failures at this gate)" | "must be in the record before the merge" (summary) | One E-SAVE run at the final candidate (Amendment 43 item 16). It is not among the facts given. Per D-1, it also runs the hand-off. | not said |
| 795 | same | E-2 | same | same | ADV-2026-11-19-28 item 7 asks for K-O26's two mutations to be rerun at the head. The facts give the second only. | not said |
| 795 | same | E-3 | same | same | CI on three platforms, L9 off Windows included. Its mutation off Windows was not observed (stop report 2). Stop 6 applies on any red. | not said |
| 795 | same | E-4 | same | same | The seam close_dataset → `release_ended` has no end-to-end test before P4, which Amendment 46 item 2 (d) rules. | not said |
| 795 | same | N-1 | Notes | not stated | The lock-order comment could name the saved → recorder `state` edge. It is true as written. | n/a |
| 795 | same | N-2 | Notes | not stated | `release_ended` frees `ProjectLock`s and may drop the last `Arc<Dataset>` clone under `saved`. | n/a |
| 795 | same | N-3 | Notes | not stated | `std::thread::spawn` panics on the main thread if the OS refuses a thread. | n/a |
| 795 | same | N-4 | Notes | "for P4's form" | E-SECOND must not assume the lock is free at the close's reply: it should poll, bounded. | n/a |
| 795 | same | N-5 | Notes | not stated | L9's test covers the final name only, as the form says. | n/a |
| 796 | Verdict: PASS WITH NOTES | D1 | Documentation | "(must-fix before the merge)" | Amendment 43 item 17 and R2 ask the PR body and the node's plan summary to name item 12's P3b-1 producers and consumers. | not said |
| 796 | same | D2 | Documentation | same | Amendment 46 item 2 (d) and the PR body say "P4's suites are the first to run it". | not said |
| 796 | same | D3 | Documentation | same | The closing amendment carries the src-tauri class 8 row, 27 of 25, in both columns. | not said |
| 796 | same | N1 | Notes | "to the advisor (ruled code, not reworded)" | `std::thread::spawn` panics if the OS cannot create a thread, and here that panic would be on the main thread inside a sync command. | n/a |
| 796 | same | N2 | Notes | "to the advisor, unreworded, not blocking" | The `close_dataset` doc says "for as long as that save takes", and the `release_ended` doc says "until then". | n/a |
| 796 | same | N3 | Notes | not stated | K-O28's declared mutation fails at the `closed` case and never reaches `ended`. | n/a |
| 796 | same | N4 | Notes | "for P3b-2's form" | `open_project` pushes its entry (:816) after `open_under`. | n/a |
| 797 | Verdict: PASS WITH NOTES | N1 | Notes | "to the advisor, unreworded" ("none blocking") | "the error is logged" means `eprintln!` only. It is not the shell's `SessionLog`. | n/a |
| 797 | same | N2 | Notes | "none blocking" | `eprintln!` panics if the stderr write fails with an error other than an invalid handle, for example a closed pipe. | n/a |
| 797 | same | N3 | Notes | "none blocking" | Another call of `release_ended` can run before this one and free the lock first. | n/a |
| 797 | same | N4 | Notes | "none blocking" | `release_ended` also takes the catalog's read lock and the generations mutex, each inside its own method. | n/a |
| 798 | Verdict: FAIL | E-1 | Blocking (Evidence) | "Blocking" | Amendment 45 item 2 (c) predicted all three of W-4's bounded cases red under the helper mutation. Only `number` was seen red. | not said |
| 798 | same | D-1 | Must-fix before merge (Documentation) | "to the advisor" | The docs of `ReopenAnswer` (protocol commands.rs:796) and `ReopenQuestion` (:922) say that the project "is open elsewhere on this machine under another folder". | not said |
| 798 | same | D-2 | same | "to the advisor" | The `skp/0.14` paragraph in mod.rs (line 130) says "The other seven commands are unchanged". | not said |
| 798 | same | D-3 | same | "to the advisor" | §12.3's `question` clause, "the folder it remembers first still holds the project or cannot be read", leaves out a file the reader refuses, which also asks. | not said |
| 798 | same | D-4 | same | "to the advisor" | W-7's doc (project_reopen_skp.rs:622), "APFS likewise", reads as APFS forbidding characters below U+0020. | not said |
| 798 | same | D-5 | same | not stated beyond heading | Remove the duplicate block of W-7's case (a) at project_reopen_skp.rs:643-652. | not said |
| 798 | same | D-6 | same | not stated beyond heading | SKP-V0.md §4 item 5's progress sentence (line 249) names only `open_dataset`. | not said |
| 798 | same | D-7 | same | not stated beyond heading | Wrap commands.rs's module-doc line 8 at the file's width. | not said |
| 798 | same | N-1 | Notes | "(to the advisor)" | `Open(e)` passes the host's whole error, fields included, as Amendment 43 item 5 (c)'s table has it: "as the host built them". | n/a |
| 798 | same | N-2 | Notes | "(to the advisor; red-line, not reworded)" | ADR-036 Amendment 4's slot holds 2026-11-19, the worker's commit date by `date -u`. | n/a |
| 798 | same | N-3 | Notes | not stated | §12.3 says "A cancel before the engine's open returned refuses the call as `engine.cancelled`". | n/a |
| 798 | same | N-4 | Notes | not stated | §12.3's data clause gives `not_found` when the lookup says not found. | n/a |
| 798 | same | N-5 | Notes | not stated | `bounded` uses `char::is_control` (Unicode Cc). Format characters such as U+202E pass through it. | n/a |
| 798 | same | N-6 | Notes | not stated | A `JoinError` for cancellation at runtime shutdown also maps to `open_project_panicked`, by the binding's pattern. | n/a |
| 798 | same | N-7 | Notes | not stated | W-7's (b2) path holds a raw U+0085 in its source line (project_reopen_skp.rs:674). | n/a |
| 798 | same | N-8 | Notes | not stated | ADR-006: P3b-2 does not change the reopen's operation class. | n/a |
| 799 | Verdict: FAIL | C-1 | Correctness | "blocking; wording only; not the human's wording; `to the advisor`" | `protocol/skp/SKP-V0.md:1433`, §12.3: "A project is open once at a time on this machine". This is a limit claim the code does not support. | "The fail is on wording only." (replacement words given) |
| 799 | same | C-2 | Correctness | same | `protocol/skp/src/v0/commands.rs:796-798` (ReopenAnswer) and `:922` (ReopenQuestion): "the project is open elsewhere on this machine under another folder", and "the `s…` | same phrase |
| 799 | same | D-1 | Documentation | "must-fix before the merge (worker wording…)"; `to the advisor` | `SKP-V0.md:1160`, "no change to the other seven commands", and `protocol/skp/src/v0/mod.rs:130`, "The other seven commands are unchanged". | "the worker applies these with no re-gate, and the PR body lists them" |
| 799 | same | D-2 | Documentation | same | `SKP-V0.md:1449`, the §12.4 row for `skp.project_machine_store_failed`: "`detail` is a file's fixed name, a colon and the error's text". | same phrase |
| 799 | same | D-3 | Documentation | same (the report calls it "a harmless duplicate") | W-7 holds case (a) twice: `kernel/tests/project_reopen_skp.rs:632-641` and `643-652`, re-added by 63950d36. | same phrase |
| 800 | Verdict: PASS WITH NOTES | N-A | Notes | "to the advisor, unreworded" | In pair (e)'s New, "the folder is not one the machine remembers for the project" (SKP-V0.md:1430) carries over the Old's "the machine". | n/a |
| 800 | same | N-B | Notes | not stated | SKP-V0.md:54 still names only `open_dataset` as "cancellable but not progress-reporting". | n/a |
| 801 | Verdict: PASS WITH NOTES | N-a | Notes | not stated | (a) reads as the answer's meaning on success. | n/a |
| 801 | same | N-b | Notes | not stated | §4 item 5's line (`SKP-V0.md:249`) is now longer. | n/a |
| 801 | same | N-c | Notes | not stated | Script defect, disclosed. | n/a |
| 802 | Verdict: FAIL, on the words of one doc sentence only (governance/AUTONOMY.md §31). | F-1 | Blocking (wording only, §31) | "Blocking (wording only, §31, not the human's wording…; to the advisor)" | frontends/shell/src/admission/formatRefusal.ts:17–21. This is untrue in ordinary use. Every reopen refusal also appears in the Console's row, unbounded… | "the worker applies my words below with no re-gate" |
| 802 | same | D-1 | Must-fix before the merge (Documentation) | "apply with no re-gate" | frontends/shell/src/App.tsx:696–697 cites `formatRefusal.ts:70-83` and `RefusalBlock.tsx:25`. P4a's own edits made both stale… | "apply with no re-gate" |
| 802 | same | N-1 | Notes | "(to the advisor; the form's words, not reworded)" | Amendment 58 item 5's first point covers filter and clauses that disagree. | n/a |
| 802 | same | N-2 | Notes | not stated | if `describe` fails after `opened`, `admitProject` never closes the handle, so the project lock stays held. | n/a |
| 802 | same | N-3 | Notes | "(to the advisor)" | an export consumer can keep P open after a switch. | n/a |
| 802 | same | N-4 | Notes | not stated | the DEV hooks skip the busy check. | n/a |
| 802 | same | N-5 | Notes | not stated | `OpenProjectRequest` has no caller, the same as on main for `SaveProjectRequest` and `RecordStepRequest`. | n/a |
| 802 | same | N-6 | Notes | not stated | `cancelledKeys` is never cleared (see Q2). This is harmless. | n/a |
| 802 | same | N-7 | Notes | "outside scope" | publish/formatPublishRefusal.test.ts:50 also cites `RefusalBlock.tsx:25`, which is now stale. | n/a |
| 803 | Verdict: PASS WITH NOTES | D1 | Documentation | "(must fix before the merge)" | Step 2's overruns. | "the worker applies the words given with no re-gate, and the PR body lists them" |
| 803 | same | D2 | Documentation | same | frontends/shell/src/admission/formatRefusal.ts, the exception paragraph. | same phrase |
| 803 | same | D3 | Documentation | same | frontends/shell/src/App.tsx:2022 to 2029, the baseline first-look comment. | same phrase |
| 803 | same | D4 | Documentation | same | frontends/shell/e2e/reopen.mjs:15 to 17. | same phrase |
| 803 | same | D5 | Documentation | same | frontends/shell/e2e/README.md:894, the R3 and R8 entries. | same phrase |
| 803 | same | D6 | Documentation | same | Amendment 54 item 9 versus R8. | same phrase |
| 803 | same | N1 | Notes | not stated | `reopenRefusalPlace` and `lineagePlaces` are exported for the tests and called inside their module. | n/a |
| 803 | same | N2 | Notes | not stated | `OpenProjectRequest` has no caller, the same as `SaveProjectRequest` and `RecordStepRequest` on main. | n/a |
| 803 | same | N3 | Notes | not stated | `cancelledKeys` is never cleared. | n/a |
| 803 | same | N4 | Notes | not stated | A `describe` failure after `opened` loses the handle, the same as `admitDataset`'s existing pattern. | n/a |
| 803 | same | N5 | Notes | not stated | T-12's row says "each notice". | n/a |
| 803 | same | N6 | Notes | not stated | S9's own-window choice compares the bounded `project` field with the held identity (openProject.ts:88). | n/a |
| 804 | Verdict: PASS WITH NOTES | D1 | Must-fix before the merge (Documentation) | "to the advisor, unreworded" | Two untrue clauses, neither the human's wording: | not said |
| 804 | same | D2 | same | "record" | Amendment 66 item 5's last sentence carries ADV-2026-11-20-19 item 6's premise. | not said |
| 804 | same | D3 | same | "wording, not the human's" | In `lib.mjs:316 @ 0c74eeab`, replace "with a WebView2 data folder of its own (`dataFolder`) and A's environment otherwise,"… | "The worker applies it with no re-gate, and the PR body lists it." |
| 804 | same | D4 | same | "record" | In the closing, name E-CRASH-UNLOCK's control as what the code did: `a.browser.close()`, a CDP disconnect, with A's process and its open kept. | not said |
| 804 | same | N1 | Notes | not stated | If `connectOverCDP` or `findAppPage` throws inside `attachSecondApp` after the checks (lines 351-352), B's process is not killed… | n/a |
| 804 | same | N2 | Notes | "to the advisor" | ADV-2026-11-20-21 item 1 (b)'s own words, "the log is empty", are what line 111 prints whenever this run's part of the log is 0 bytes. | n/a |
| 804 | same | N3 | Notes | not stated | Each try's period is 250 ms plus the try's own round trip, and the poll sleeps once more after the 40th refusal. | n/a |
| 804 | same | N4 | Notes | not stated | After the first try, a refused try reads the refusal block from the DOM, and a block left from the previous try would read the same. | n/a |
| 804 | same | N5 | Notes | not stated | The header line "RECORDED MUTATIONS: entries are added by the commit that observes them." (`second-open.mjs:17 @ 0c74eeab`) has no entries… | n/a |
| 805 | Verdict: FAIL, on one sentence of wording only (Evidence class, finding E-1). | E-1 | Evidence | "(blocking, wording; the worker's README sentence, not the human's wording)" | `e2e/README.md`, Second-open section, last paragraph, reads "B's dev-server page depends on A's dev server only for its first load." | "land with no re-gate (AUTONOMY §31)" |
| 805 | same | D-1 | Documentation must-fix (the same PR, before merge) | "must-fix" | README Second-open paragraph and the header comment of `second-open.mjs` (lines 10 to 11) say the step "says whether the release thread's failure line is in … `app.log`…" | "Neither is the human's wording; the worker applies them." |
| 805 | same | D-2 | same | "must-fix" | the header says "every 250 ms for at most 40 tries (10 s)". | not said ("Not the human's wording.") |
| 805 | same | D-3 | same | "must-fix" | `e2eOpenProjectFolder` and `e2eSaveProjectToFolder` in `src/e2e-test-surface.ts` say "Only caller: `e2e/reopen.mjs`" and "`e2e/project.mjs`". | not said ("Send the comment fix to the docs lane") |
| 805 | same | N-1 | Notes | not stated | if `connectOverCDP` or `findAppPage` throws after check (b) passes, the already-spawned B is not killed (`b` is still null in `main`). | n/a |
| 805 | same | N-2 | Notes | not stated | on a zero-byte slice the line says "the log is empty". That is untrue if the file held earlier content and this run added none. | n/a |
| 806 | Verdict: PASS WITH NOTES | D1 | "Must-fix wording (Documentation, before the merge; not the human's wording)" | "Must-fix wording" | The clause in K-4's doc, commands.rs:815-816 at 0cc509fe, byte-copied: "As in the precedent, only `//` lines are skipped as comments, so a commented-out c…" | not said ("to the advisor, unreworded") |
| 806 | same | N1 | Notes | not stated | The seam rule's end-to-end test from the real shape is replaced for this seam by the gate's reading (ADV-2026-11-20-22 item 3; ADV-2026-11-20-27 item 2). | n/a |
| 806 | same | N2 | Notes | not stated | K-3 exercises 5 of the replaced set. | n/a |
| 806 | same | N3 | Notes | "to the advisor with D1" | K-4's limits list omits a call in path form: `SessionLog::append(&log, …)` has no `.append(` and passes the absence scan. | n/a |
| 806 | same | N4 | Notes | not stated | Every test cleans a fixed folder under `std::env::temp_dir()` (:723-726). | n/a |
| 806 | same | N5 | Notes | not stated | The evidence still owed is not read here: §9.3's e2e runs at H (the tester), §7's commands and the Cargo diffs at H, the mutations made again, fmt and clippy… | n/a |
| 806 | same | N6 | Notes | not stated | The protocol-side field doc session.rs:55-56 says the token is "never logged". | n/a |
| 807 | Verdict: PASS WITH NOTES | D-1 | Documentation | "(must be settled before the merge)"; "to the advisor, unreworded" | The new lines in K-4's doc are true of the absence scan. | not said |
| 807 | same | D-2 | Documentation | same; the report calls it "a record item, not a finding" | The count at H (256 against 230) is recorded as class 8 in the closing, with the 0005d0d3 and 0cc509fe counts (Amendment 3 item 7). | not said |
| 807 | same | N1 | Notes | not stated | The (c) doc's bytes break a line early ("…The host's own / lines are composed in this crate and take / no token…"). | n/a |
| 807 | same | N2 | Notes | not stated | The tests do not remove their folders at the end. | n/a |
| 807 | same | N3 | Notes | not stated | At 0cc509fe the advisor's read of K-4 (ADV-2026-11-21-02 items 1-2) agrees with mine. | n/a |
| 808 | Verdict: FAIL | F1 | Words found untrue (Correctness) | "each blocks; for the advisor, unreworded" | KNOWN-LIMITATIONS item 62 (ruling item 9), the clause "the line that says the project was not saved then shows a message that begins `open.lock:` and the operat…" | not said ("they go to the advisor unreworded") |
| 808 | same | F2 | same | same | Item 75 (ruling item 15), the clause "it reaches the engine's own queries during the open". | not said |
| 808 | same | F3 | same | same | Item 74 (ruling item 14), the clause "each character that does not show, or that changes the direction of text, replaced by … U+FFFD". | not said |
| 808 | same | F4 | same | "Partly true; it does not block on its own" | Item 74, the clause "The session log takes the same text". | n/a |
| 808 | same | D1 | Documentation | "each must be fixed in this PR before the merge; none blocks" | Item 4's added comment clause says "The last sentence of the paragraph above is the advisor's wording". | not said |
| 808 | same | D2 | Documentation | same | Item 10's added comment clause says "The last sentence of the On-main paragraph". | not said |
| 808 | same | D3 | Documentation | same | Item 75's comment: the `cancellable` overclaim. See F2; fix it with F2. | not said |
| 808 | same | D4 | Documentation | same | Item 74's comment: the `REPLACED` description. See F3; fix it with F3. | not said |
| 808 | same | D5 | Documentation | same | Item 62's comment says "the refusal built with what set to store::OPEN_LOCK in Projects::save and Projects::open_project (the folder or the lock could not b…" | not said |
| 808 | same | D6 | Documentation | same | Form Amendment 70, Tests+mutation line: "again by the reviewer" did not happen. | not said |
| 808 | same | D7 | Documentation | same | Item 69's comment: its description of `judge` gives two of the three conditions. | not said |
| 809 | Verdict: PASS WITH NOTES | N1 | Documentation | "each must be fixed before the merge; none blocks" (summary: "Two Documentation findings (N1, N2) must be fixed before the merge") | KNOWN-LIMITATIONS.md, item 75's comment, the clause "the sentence on where a Cancel is looked at is replaced by the advisor's wording in ADV-2026-11-21-07 (item…" | not said ("I wrote no replacement words") |
| 809 | same | N2 | Documentation | same | KNOWN-LIMITATIONS.md, item 74's comment, the clause "the clause on which characters are replaced and the clause on what the session log takes are replaced by …" | not said |
| 809 | same | D1, D2, D3, D4, D5, D7 (attempt 1's ids, each reported fixed) | no class in this report (listed under check 4) | not stated | e.g. "D1, item 4's comment (line 81): fixed." | n/a |
| 810 | Verdict: PASS WITH NOTES | D1 | Documentation | "Not blocking." Heading: "must-fix before merge" | File: `frontends/shell/e2e/regression.mjs`. Symbols: the `K7_STEP_TIMEOUT_MS` comment and K7's `runStep` comment. | "the worker applies these words with no re-gate and the PR body lists them" |
| 810 | same | D2 | Documentation | "Not blocking." | File: `frontends/shell/e2e/regression.mjs`. Symbols: the comment above `K7_STATUS_SETTLE_TIMEOUT_MS`, the doc of `settledUnmintedTilesSince` and the doc of `settle…` | same phrase |
| 810 | same | R1 | "Record findings in the tester's hand-back" | not stated ("fixed in the filing note when the custodian files it") | "not to the outer 240 s timeout": the outer timeout at H is `K7_STEP_TIMEOUT_MS`, 345 s. | n/a |
| 810 | same | R2 | same | not stated | The port checks claim "127.0.0.1 and IPv6 loopback" and a `[::1]:5180` listener. | n/a |
| 810 | same | R3 | same | not stated | Departure 2's first clause, "redirected only the shell's `npm ci` and `npm run build`", contradicts `k7t-fe.sh`. | n/a |
| 810 | same | R4 | same | not stated | The report's K7 (a) line is cut short of the log's final " non-bg pixels". | n/a |
| 810 | same | N1 | Note ("not a finding") | "outside this piece's Scope" | `main`'s `DEADLINE_MS` (900 s) is armed before `attachOrLaunch`, so the launch counts against it. | n/a |
| 811 | Verdict: FAIL, cut/stop-failure-alarm @ 1d944d84528962ac1550ec6992918a1de646316a. | F1 | Correctness | "(blocking; words only, code otherwise closed)" | `scripts/hooks/README.md:195-196`. After the merge this limit is untrue: settings.json:80 names three types. | "Both are fixed by words alone: the replacement words are in F1 and F2, the worker can apply them with no re-gate" |
| 811 | same | F2 | Correctness | same | `governance/AUTONOMY.md:735`, Part B (vii). The heading `**(vii) Nothing else is sent.**` is untrue once StopFailure sends (x). | same phrase |
| 811 | same | N1 | Documentation | "(must-fix before the merge)"; "does not block" | `scripts/hooks/README.md:59` of the diff (README :333). `Added by the human's approval of ADV-2026-11-18-06 …` is undated and does not cite the approval's file. | not said |
| 811 | same | N2 | Documentation | same | `scripts/hooks/hooks.test.mjs:1431`. The current comment reads `// The stop alarm (the human's approval of ADV-2026-11-18-25): the hook keys gain StopFail…` | not said |
| 811 | same | N3 | Documentation | same | Check (d)'s evidence file. `sfa-suite-c.txt` does not record the command or the exit code. | not said |
| 811 | same | N4 | Documentation | same; "goes to the advisor" | `scripts/hooks/notify-telegram.mjs:12-13`. The comment "the two quota types only" becomes untrue at merge. | not said |
| 811 | same | N5 | Documentation | same; "It does not block." | Input without an `error` field. | not said |
| 812 | Verdict: PASS. | N1 | Documentation | "all must-fix before the merge" (summary: "three Documentation findings (N1 to N3), all source comments") | frontends/shell/src/layout/actionRegistry.ts:89 at H. The comment names ADV-2026-11-21-14 item 2 as the source of O-19b's label. | "all source comments, all must-fix before the merge, with replacement words below"; no re-gate stated |
| 812 | same | N2 | Documentation | same | frontends/shell/src/project/saveProject.ts:15-16 at H. The comment says every string in the file is "the words the worker of step 1 wrote". | same phrase |
| 812 | same | N3 | Documentation | same | frontends/shell/src/project/reopenNotices.ts:7-8 at H. "S8 is the human's approval of ADV-2026-11-21-12, filed at …" is not a true sentence. | same phrase |
| 812 | same | N4 | Documentation | listed under the same heading; the report calls it a possible "class 6 budget deviation" | Amendment 74 item 3, the size reading. | not said |
| 812 | same | N5 | Documentation | "For the advisor… no rewording." | on the ruling's item 6. Item 6 calls the eleven strings "step 1 built". | not said |
| 812 | same | N6 | Documentation | "Neither blocks." | Non-ordinary cases, named for the strings' source comments. | not said |

**Contradictions between a report's stated verdict and the log column:** none. All 26 stated verdicts match the log's verdict column, row by row.

**Internal inconsistencies I noticed (not counted or compared):**
- 793: the verdict paragraph says "Five findings go with the PR". The report gives ids to four findings: C-1, D-1, D-2, D-3.
- 792: the Documentation heading says "must-fix before the merge where marked". Neither D1 nor D2 carries its own mark.
- 808: the report says it wrote no replacement words for F1 to F4, on the ruling's item 22. It says its own definition's wording-blocks rule would have had it write them. That is a statement in the report, not an instruction to me.

**Text inside inputs asking me to do something:** none. Several reports address others, for example 787 D2 ("when filing, write that value as `<m>`") and 788 D6 ("The custodian adds them and confirms the PR body"). None addresses the reader of the report or asks for a command, wider access or a particular result.

**Coverage:** rows 787 to 812 were read whole, under `C:/dev/wt/sit/state/consults/gates/`. That is 26 of 26. No offset reads were needed, and the reads were done in four parallel batches of up to six. I opened no other file. The table is a locator and I did not read it as evidence.

**Unresolved:**
- Where a report puts the weight only on the section heading, for example "Documentation (must-fix before the merge)", I copied the heading. I did not judge which individual finding in the section is blocking.
- Whether "no re-gate" or "the worker applies" amounts to "words alone close it" is left to the custodian where I quoted a phrase. I marked "not said" only where no such phrase appears.
- Rows 787 and 789 to 790 give an id to some items inside a section headed "None". Those are references to earlier attempts' findings (789) or the architect's drafts (790).
- The inputs cannot show whether the fixes the reports ask for were applied afterwards.
