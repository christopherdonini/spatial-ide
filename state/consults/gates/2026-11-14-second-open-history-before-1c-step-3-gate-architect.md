Reviewed: PR #318 at 5e6b79bc0d0f423293b312140788044fab1de106 (the custodian's filing note, 2026-11-14: the gate, the architect, attempt 1, one of the two gates from dispatch of the form `governance/forms/kernel/SECOND-OPEN-HISTORY-BEFORE-1C-STEP-3-PREREGISTRATION.md`, its section 9, PLAN node second-open-history-before-1c-step-3, slot 2; its brief by file (6080 bytes, sha256 662794d6291f338ef677b38e72f78179d3bda126f5de1a6a23287c7b4bab16d2), with the packet <S>/packet-318.md (4488 bytes, sha256 dc15c5c183581ea91850ef4f922fc0da96a3d72c2178ecd4a1e78dfd376b89a0) and the diff file (79489 bytes, sha256 57992f8d97cd8b20d2b6eb1f23ccdc8886459a702e081c5865ec0e502b840784); the run 12:57:06Z to 13:09:13Z by its transcript, 43 calls (Read 23, Grep 19, SubagentHandback 1), none errored, no file written, model claude-opus-5-5; it has no shell, and each claim rests on its reads; below, the hand-back byte for byte (with one final newline, 18900 bytes, sha256 8c283a733edabf95102a0fdc4e3b15331586f2a885925bcb444d65edb9bd993c), whose scratch-folder paths the architect itself wrote as <S>. Nothing is changed. The custodian's answer to its O7, by script: none of the 147 Bash calls in the C1b and C2 worker's transcript names git stash.)

Reviewed: PR #318 at 5e6b79bc0d0f423293b312140788044fab1de106, gate architect · cut/second-open-history-before-1c-step-3 @ 5e6b79bc0d0f423293b312140788044fab1de106
Verdict: PASS WITH NOTES

Marker: WORDS-ONLY (directive 2026-11-05, Part 1 item 2). Each blocking finding below is a sentence, and each comes with my replacement words. None of them is the human's wording or red-line text. At H the code's Correctness and Evidence are closed, once the reviewer has re-run the suites and observed M1–M6 (Part 1 item 9). I read every cite at H in `C:/dev/wt/so` unless it is marked "main" (8d22840a). I ran nothing, since I have no shell, so every hash is the reviewer's to recompute. Text in quotation marks is byte-copied. Every "my words" passage is mine.

## Findings

### Correctness (each closed by the words given; WORDS-ONLY)

**K1. A record that calls changed words the human's (§8 "Any wording called the human's"; directive 2026-10-05 §2, a text marked as the human's byte-copied words that does not match its source).**
- Where: `KNOWN-LIMITATIONS.md:437`, the approved comment under item 43. It says: "the item above is byte-copied by script from that form's section 2.10, item L, with the number set to 43".
- The defect: at H, item 43 (`:436`) has a changed ceiling clause and two added sentences, so it no longer matches. Main's `:436` still holds the approved line.
- The fix: this is a record comment, not the human's wording, so under §31 the worker applies the words, with no re-gate, and the PR body lists them. Replace that clause of `:437` with my words: "the item above was byte-copied by script from that form's section 2.10, item L, with the number set to 43; since second-open-history-before-1c-step-3 its clause on the ceiling and the sentences after that clause are not the human's words, as the comment below says".
- At C3 the words become "…are the advisor's wording, under the delegation of 2026-11-13 (ADV-…), as the comment below says" (§2.6).
- Clause check:
  - "was byte-copied": main `:436`–`:437`.
  - "clause on the ceiling and the sentences after it": the diff at `:436`.
  - "the comment below": `:438`, with D1 applied.

### Evidence

None. The packet records 18 CI rows, all passing at H. The worker's runs are in both reports. The reviewer's re-runs at H are still required (§9).

### Documentation (must fix before the merge; the §2.6 words go to the advisor with mine)

**D1. Item 43's DRAFT comment (`KNOWN-LIMITATIONS.md:438`).**
- "Only the clause about the ceiling is changed from the item the human approved, which is the comment above this one" is untrue on two counts: two sentences were added, and the comment above is the approval record, not the item.
- My words: "The clause about the ceiling is changed, and the two sentences after it are added, to the item the human approved, whose approval the comment above this one records".
- Add to its "Not covered" (my words): "a record move that fails, after which the open keeps its own file and its next save tries again; and a crash between the move and the removal of the old folder, after which both folders stay". The first rests on `session_history.rs:349-352` and `:363`, with `project/mod.rs:360-362`. The second rests on `:352-361`. Neither is reachable in ordinary use (an I/O failure; a crash inside one save), so both are named here under §31.

**D2. Item 43's DRAFT words at `:436`** (for the advisor, ADV-2026-11-13-20 item 5 (d); not the human's wording). Two clauses fail.
- (a) "at most 32 MiB in each file the app keeps" can be read as a limit on every file the app keeps, which includes `locations.json` and the projects store. The ceiling belongs to the history file (`:48`, `:77-90`, `:94-119`).
  - My words: "at most 32 MiB in each such file".
- (b) "and one file for each project from then on" is untrue for a project whose open had no change: `adopt_project` binds only (`:349`, `:363`), and only a step creates a record (`:310-315`). Ordinary use reaches this: save, then close.
  - My words, replacing the sentence that begins "The app keeps one file": "The app keeps one such file for each open of a dataset that has had a filter or style change. The first save of an open binds it to the project that save makes: the open's file, if it has one, moves under that project, and the open's later changes are written there. A second open of the same file is another open, with a file of its own once it has a change."
  - Clause check:
    - One file per open with a change: holder per open (`:141-149`), lookup and create per holder (`:308-315`), and one open per project at this node (`mod.rs:243`, `:250`, `:265-267`; a handle per open at `skp.rs:1120`).
    - "binds": `:343-365`, through `mod.rs:360`, after the replace at `:304`.
    - "moves… later changes there": `:349-362`, then `:302` and `:309`.
    - "another open": `Holder::Open(name)` at `:146`.
    - "once it has a change": `create` is called only at `:313`.
- The draft's last sentence ("This version sets no limit…") holds: the only pushes are at `:174` and `:313`, and nothing bounds either.

**D3. Item 63's DRAFT at `:507-509`** (worker's words, for the advisor).
- (a) "A save of an open binds it to the project that save makes": a later save makes no project (`mod.rs:246`; `:345-347` does nothing).
  - My words: "The first save of an open binds it to the project that save makes".
- (b) "is therefore bound to its own project and writes its own `saved-here` mark in its own file": the mark is conditional (`:384-389`).
  - My words: "A second open that is saved to another folder is therefore bound to its own project; the save's `saved-here` mark, when it writes one, goes in the second open's own file, and the first project's file is not written to by that save."
  - Check: the mark looks up only `Project(B)` (`:380-381`). K-S15 holds A's length unchanged.
- (c) Its "Not covered" gains the failed move, as in D1.
- For the advisor, my view: as reworded, item 63 states no limitation beyond the per-open file count that item 43 carries. The comment's withdrawal route is the smaller record.

**D4. The §8 note of `protocol/skp/SKP-V0.md`** (`:1150-1156`; worker's words, ADV-…-20 item 3 (d)). I do not ask the advisor to rule it. Under §31 the worker applies my words, and the PR body lists them.
- Defects:
  - The heading's "is marked in its own record" states the mark unconditionally.
  - "for one case changes from `withheld` to `written`" names one case, but more than one changed. Under the old key (path plus claims, the form §2.1's byte-copied lookup and `find`; items 7–8), every save of the second open replied withheld. Where the first open was unsaved, the second open's save moved the shared record.
  - "the dataset is closed" is a condition the old rule did not need.
- My words:
  - Heading: "### Note: each open of one file keeps its own session record (2026-11-14; no literal change)".
  - Bold line: "**`skp/0.13` stands; no literal is bumped and no fixture changes.** §11's `save_project` reply now follows the record of the open saved, and no key, value or command is added or removed."
  - Bullet "The case." becomes: "- **The change.** Each open of a dataset has a session record of its own, from its first recorded step, until a save binds it to a project; before, opens of one path admitted under the same claims shared one record. So, in one run, when a file is opened, a step is recorded and the open is saved, and the same file is opened again under the same claims and the second open is saved to another folder: every save of the second open replied `history_mark: "withheld"` before, because the first project held the shared record, and now replies `"written"` when the second open's recorded steps reach the saved workspace, as for any save, and `"withheld"` while the second open has no recorded step. Where the first open was not saved, the second open's save moved and could mark the shared record before; it now binds and marks only the second open's own record."
  - The other two bullets hold and stay.
- Clause check:
  - Per-open record: `:141-149`, `:308-315`.
  - "before… shared", "withheld before": the form §2.1 (byte-copied lookup and `find`; item 8's removed check; item 7's no-op).
  - "written when…": `:380-389`, `mod.rs:367`.
  - "withheld while no step": `:381-386`, `mod.rs:368`.
  - "only its own record": `:349` matches only `Holder::Open(own)`.

**D5. §11.3's "Every save" bullet, last sentence.**
- "so a second open of one file that is saved to another folder is bound to its own project and marked in its own record." states the mark unconditionally, and gives the open a record before any step.
- My words: "Each open of a dataset has a record of its own, from its first recorded step, until a save binds it to a project, so a second open of one file that is saved to another folder is bound to its own project, and the mark, when one is written, goes in that project's record."
- Check: `:308-315`, `:343-365`, `:380-389`. I do not ask the advisor to rule it.

**D6. The ADR-036 note draft** (C1b/C2 report §8). All four topics hold against the code (see check 5). Two fixes:
- (a) Bare `path:line` cites (`session_history.rs:122-128`, `:141-149`, `:308-316`, `:343-365`, `:352`, `:438-451`, `:300-316`, `:168-181`, `:270-277`; `mod.rs:250-253`, `:276`, `:360`, `:250`, `:265-267`, `:243`) do not belong in an accepted, append-only ADR. Bare lines drift (round 14), and a pin there must be at a commit on main (round 15 (e)), which C1 is not.
  - Fix: cite by symbol: `Holder`, `Open::holder`, `State::open`, `StepRecorder::dataset_uri`, `record_step`, `adopt_project` and `create` (kernel/src/session_history.rs); `Projects::save` and `Projects::history` (kernel/src/project/mod.rs).
- (b) Topic 4's "A reopen of a saved project is bound to the project at the reopen, before any step on the new open, and continues the project's record." states unbuilt behaviour in the present tense.
  - My words: "Step 2's reopen of a saved project binds the new open to the project at the reopen, before any step on it, and continues the project's record (OPEN-N4 (a)); nothing in this change binds an open at a reopen."

### Observations

- **O1. The M3, M4 and M6 anchors are not in the report.** §0 asks the worker to record each anchor's exact text. Both reports say each anchor "occurred once" but byte-copy only some of them, and the full set exists only in `<S>/soc2-mut.mjs` (untracked). I record them here, each found once at H:
  - M1 and M2: `r.holder == holder`, `session_history.rs:309`.
  - M3: `:361-363`.
  - M4: `:144-147`.
  - M5: `self.recorder.dataset_uri(name)`, `project/mod.rs:252`.
  - M6: `header_object(reference.to_json(), project)`, `session_history.rs:442`.
  - These match the script's `old` strings (its lines 13, 18, 23, 28, 33, 38). This report closes the gap.
- **O2.** `Reached`'s doc at `:186` ("one opened file") reads true per open. It is unchanged.
- **O3.** SKP §10.3, check (7), "the history's record for the open file, created at its first step", stays true per open. It is outside §2.5 and needs no change.
- **O4.** `State.opens` is never pruned at close (`:170-183`). It grows in memory per open, as §7 says.
- **O5.** C-5 on the C-2 path: `no_generation_in_persisted_artifacts.rs:814` scans an unbound record only (`:840-862`). By reading, the record created under a project carries no handle (`:438-447`).
- **O6.** K5's rewrite and mtime setup were removed. This is recorded in K5's doc (`kernel/tests/session_history.rs:342-343`), not in the report as §4 asks.
- **O7.** git stash: C1's filing note records no stash call. C1b and C2's report and note are silent, so the custodian should confirm from the transcript.

## Checks

1. **§1 holds clause by clause.**
   - C-1: `:122-149`, `:300-316`; one handle per open (`skp.rs:1120`, `handles.rs:19-23`); proved by K5.
   - C-2: `:345-363`, `:432-451`; proved by N1.
   - C-3: `:170-183`, `:274-277`, `:302-320`; `mod.rs:246`, `:252`, `:276`; proved by N3.
   - C-4: `:380-381`, with no held-by-another check; proved by K-S15.
   - C-5: holds by reading; `:814` and `:927` are untouched.
   - The limit holds. No comment or draft states an outcome for either sub-case of item 5 (c). The ADR draft states only that the case is unreachable (ADV-…-20 item 1 (a)), which holds: `mod.rs:243`, `:250`, `:265-267`; `skp.rs:1120`.
2. **§2.1–§2.4 match their anchors.**
   - §2.1 items 1–10: `:122-184`, `:240-244`, `:154-160`; the import at `:35-38` is gone, and so are `find` and `same_claims`; `:300-316`, `:432-498`, `:274-277` (product caller `mod.rs:252`), `:343-365`, `:374-399`; `:403-412` has unchanged behaviour.
   - §2.2: `mod.rs:249-253`, `:356-374`, `:146-155`; docs at `:14-17` and `:228-234`; the `save` signature at `:235-241` is unchanged.
   - §2.4 is described and not built.
   - The anchors are in O1.
3. **§2.3 holds.**
   - The `commands.rs` change is rustdoc only. `SKP_VERSION` is "skp/0.13" (`protocol/skp/src/v0/mod.rs:123`). `protocol/data-plane/` has no diff. The note's shape matches `:1108`, `:1117` and `:1146`.
   - §11.2 and the `HistoryMarkState` rustdoc hold (`:381-386`, `:384-389`; `mod.rs:357-373`).
   - §11.3: D5. The §8 note: D4.
   - I ask the advisor to rule none of the four.
4. **§2.5 holds.**
   - The diff has 10 files, all within the eleven; ADR-036 is C3's. Nothing on the "Nothing else" line is touched.
   - The rows meet the rule:
     - (a) a single-line pin at `:533` and at `:1668`;
     - (b) `superseded` is on the row's own line, outside backticks, after "is";
     - (c) the hash is the reviewer's to recompute;
     - (d) main's `:533` and `:1668` name the old tests;
     - (e) 8c693657 is on main, by the worker's report.
   - Neither row adds a claim of a test that no longer exists: each names only the new test, which exists. Each heading level matches its file.
5. **§2.6 words: D1–D3 and D6.**
   - The clauses not listed there hold. In item 63, "keeps one file for each open… from the first… change" and "whether or not the earlier open has been saved or closed" hold (`:141-149`, `:308-315`).
   - The ADR-036 topics:
     - 1 holds: `:122-149`, `:308-315`; the name is never serialized (`:438-447`, `:467-470`).
     - 2 holds: `:345-363`; `:352` returns before `:363`; `:438-451`.
     - 3 holds: `:170-183`, `:274-277`; `mod.rs:246`, `:252`, `:276`.
     - 4 holds: the only caller is `mod.rs:360` (my search of the worktree); `mod.rs:250`, `:265-267`, `:243`.
6. **Item 43's turn.**
   - C2 was committed at 2026-11-14T06:10:35Z (Amendment 2 item 1). Main's `state/gate-log.json` has no port-2 row (my search). So this piece reached its point first and holds item 43 until it merges.
   - Main's `:436` equals B′'s, so no gated head carries a different item 43.
   - Left to port-2: once this piece merges, it takes main in, re-applies only its data-folder sentence, records that in an amendment, and its gates read item 43 whole (ADV-…-20 item 5 (f)). Its item-1 hunks are not shared (item 5 (i)). D2 leaves the data-folder sentence untouched.
7. **§4: each changed and new test fails if its claim is false.**
   - K5: the record counts 2 and 3, one step each, and differing URIs.
   - K-S15: A's length is checked at three points, A holds 1 mark, and B holds 1 step and 2 marks.
   - N1: the folder names, the header's `project`, and the mark.
   - N2: the bind before a step, and the second open apart.
   - N3: equality in both orders.
   - M1–M6 each falsify one §1 claim: C-1, C-4, the C-2 bind, the C-1 bound holder, C-3, and the C-2 header.
   - The renames equal ADV-…-20 item 4. The M1 and M2 commands carry the new names.
8. **§5 holds against the reports.**
   - Predictions:
     - every §9 command exited 0, at C1b and at C2;
     - verify-test-claims exited 1 at C1b, as predicted before the rows, and 0 at C2 with both rows accepted;
     - M1–M6 each exited 101, then 0, with an empty diff after each revert.
   - Unchanged items hold:
     - `project_save.rs` only adds;
     - `project_save_skp.rs` changes K-S15 and adds helpers;
     - `session_history.rs`'s test file changes K5 and its imports;
     - the lib changes the U7 call site only (ADV-…-04 item 2 (a));
     - the wire, the shell and the HEADER shape are outside the hunks.
   - No invalidator was hit.
   - §8, item by item:
     - A handle written to disk: none (C-5).
     - A record another run left touched: none. `create_dir` refuses an existing folder (`:449-451`, `:515`) before any removal, and removals are only of folders this call made (`:455`, `:533`) or of `state.records` (`:403-412`).
     - A `pub` item with no product caller: none new. `dataset_uri` is called at `mod.rs:252`, `adopt_project` at `:360`, `mark_saved_here` at `:365`.
     - A renamed test without a superseded row: both rows are present.
     - A file outside §2.5: none.
     - Wording called the human's: K1.
     - DRAFT or unruled wording reaching main: not at H. C3 replaces the DRAFTs, and the protocol sentences land as checked worker words (item 3 (d)).
     - git stash: O7.
9. **ADRs.** Nothing in the diff makes an accepted ADR untrue.
   - ADR-036 §4 (`:72`) already did not hold literally for the history: at B′ a history minted its URI at its first step (the diff's removed `DatasetUri::mint()` at create).
   - §9 (`:207`), §6 (`:125`) and Amendment 1 item 5 (`:272`) hold.
   - ADR-006 class 2 is unchanged, with no data-plane or MCP reach.
   - The note appends as Amendment 2, after the only amendment (`:241`). It leaves §4's row standing and adds to item 5. Apply D6 first.
10. **The packet's flags.**
    - 1: see check 6.
    - 2: I accept the pins at C1.
      - Why: `KNOWN-LIMITATIONS.md` is not append-only, so round 15 (e) does not bind it. C2 does not create C1 (round 14). The merge is a merge commit (Amendment 1 item 2). The pinned ranges equal H's, since C1b touched only U7 and C2 no code.
      - Conditions: any later commit to `kernel/src/session_history.rs` or `kernel/src/project/mod.rs` before the merge means re-pinning, and a squash or rebase merge voids the pins.
      - The ADR note is a different case (D6).
    - 3: 719 lines against about 530. Nothing in `session_history.rs` falls outside §2.1 and U7. The PR is under the 1,500-line trial.
    - 4: the departures are for round 77. None touches the evidence.
    - 5: my words go with the drafts to the advisor. C3 is not in this round.
    - 6: I read the packet again, and nothing in it is relied on unconfirmed.

No ADR skeleton is needed.

Files: `C:/dev/wt/so/kernel/src/session_history.rs`, `C:/dev/wt/so/kernel/src/project/mod.rs`, `C:/dev/wt/so/KNOWN-LIMITATIONS.md`, `C:/dev/wt/so/protocol/skp/SKP-V0.md`, `C:/dev/spatial-ide/docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md`, `<S>/soc2-mut.mjs`.
