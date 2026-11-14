Reviewed: PR #318 at 5e6b79bc0d0f423293b312140788044fab1de106 (the custodian's filing note, 2026-11-14: the gate, the reviewer, attempt 1, STOPPED at its check 6 with no verdict, one of the two gates from dispatch of the form `governance/forms/kernel/SECOND-OPEN-HISTORY-BEFORE-1C-STEP-3-PREREGISTRATION.md`, its section 9, PLAN node second-open-history-before-1c-step-3, slot 2; its brief by file (11397 bytes, sha256 571ec130855f57bb7cec5f22e46291ff2f4a6c42fbc43b8f07f2ccd5f161a707), which told it to make each mutation with the Edit tool, a tool the reviewer's definition does not give it: the custodian's slip, round 77; the run 12:57:06Z to 13:47:19Z by its transcript, 85 calls (Read 12, Bash 71, Edit 1, SubagentHandback 1), one errored, the Edit call at 13:43:32Z, refused as no such tool, and nothing written; model claude-opus-5-5; below, the hand-back (with one final newline, 20451 bytes, sha256 8e635ef1320565c1a4f94813a9acfbd44ec2899190232daf83d4539ac819f1f6) with one change, the custodian's: the scratch folder's full path, which its last line wrote after <S>, is cut, as a user-profile path is never quoted. No gate-log row: the gate has not concluded; the advisor rules the shape of its rest.)

Reviewed: PR #318 at 5e6b79bc0d0f423293b312140788044fab1de106, gate reviewer (cut/second-open-history-before-1c-step-3 @ 5e6b79bc0d0f423293b312140788044fab1de106)
Verdict: no verdict. I stopped at check 6 because the harness refused the mutation tool. I found no Correctness defect in checks 1 to 5 and 8. M1 to M6, the light runs (check 7) and CI (check 10) were not done by this gate.

## STOP (check 6, M1)
- The brief says "a mutation is made with the Edit tool". My Edit call for M1 returned `Error: No such tool available: Edit. Edit is not among the tools available here.` This gate has no Edit or Write tool, and the brief allows no other way to write the file. That is a harness refusal, so this is a stop and not a departure.
- No change was made. `git -C <W> diff` was empty right after the refused call, and `<S>/g318r-M1-diff.txt` is 0 bytes.
- No hold was taken for M1. The status call right before it (status 4) showed a `project=SpatialIDE` line, so another heavy run of this project was on the machine.
- Still to do: §9 requires the reviewer to apply and observe M1 to M6. They need a gate that has an Edit tool, or a brief that names another way to apply a mutation. Checks 7 and 10 were not run either.

## Findings

### Correctness
None found at H. The clause-by-clause check is under check 3 below.

### Evidence
- **E1 (not yet done; not a defect of the piece).** No mutation was observed by this gate: §9's "The reviewer applies and observes M1-M6" is still open. Until it is done, M1 to M6 rest only on the worker's report, which is evidence and not this gate's own observation (Part 1 item 9: "Mutation observations stay the gates' own"). Fix: dispatch the mutation step again with a working edit path.

### Documentation (each must be fixed before the merge)
For the KNOWN-LIMITATIONS items, §2.6 routes my words to the advisor, and C3 carries the ruled words.

- **D1. Item 43's DRAFT comment says something untrue** (KNOWN-LIMITATIONS.md, the new DRAFT line after the approved comment of item 43). It says "Only the clause about the ceiling is changed from the item the human approved". My script (`<S>/g318r-43-base.txt` against `<S>/g318r-43-h.txt`) shows otherwise. Take the base line and replace the 32 MiB clause: the result is a prefix of H's line, and H's line then adds two sentences ("The app keeps one file for each open … another open." and "This version sets no limit … that have had a change."). This is not the human's wording; it is the worker's comment. Replacement words:
  - "The clause about the ceiling is changed from the item the human approved, which is the comment above this one, and two sentences are added after it on the files a run keeps (section 7, What grows): the ceiling held for one dataset in one run before the kernel kept a record for each open, and it holds for each record now."
  - Check: the changed clause and the two added sentences are shown by the script above. Form §7's "What grows" bullet says the disk-use statement goes in the item 43 draft. The ceiling is per record: `History::new` sets the ceilings for each `History` (kernel/src/session_history.rs:77-90 at H), and each `Record` owns its own `History` (:157).

- **D2. Item 43's new sentence says more than the code does.** The words "and one file for each project from then on" are not true for an open saved before any change: no project file exists until that open's first change. N1 asserts exactly this (`file_names(&rig.sessions)` holds only `<P hex>` after the first step, and nothing before it). An operator reaches this in ordinary use by saving before any change and then looking in the sessions folder. Item 43's line is the human's approved wording (B2-1B Amendment 1 item 1); this sentence is the worker's DRAFT rewording, which goes to the advisor. Replacement words for the sentence:
  - "The app keeps one file for each open of a dataset, from that open's first filter or style change, and a save moves that file under the project the save binds the open to; an open saved before any change gets the project's file at its first change. A second open of the same file is another open."
  - Check: one file per open from its first step is `State::open`, keyed by catalog name (:170-183), with the record created at the holder's first step (:308-316). A save moves the open's file under the project: `adopt_project` copies it into `root/<P hex>` and sets the holder to Project (:349-358). An open saved before any change is bound without a move (:363), and its first step makes `<P hex>/` with the project header (:438-448); N1 asserts this. A second open is another open because the handle is minted per open (kernel/src/skp.rs:1120, 128 random bits in protocol/skp/src/v0/handles.rs:19-23).
  - Case to name in the source comment: a record move that fails (an I/O error) leaves the open unbound until a later save. That is an error path, not ordinary use.

- **D3. Item 63 says more than the code does.** The words "writes its own `saved-here` mark in its own file" have no condition. In fact, a second open saved to another folder with no change, or with changes the saved workspace does not hold, replies `withheld` (`mark_saved_here` returns NoStep at :382-386 and Differs at :387-389), and the shell then shows S5 (frontends/shell/src/project/saveProject.ts:112). Ordinary use reaches this. Item 63 is not the human's wording: it is the worker's DRAFT, and the human never approved the item. Replacement words for the sentence:
  - "A second open that is saved to another folder is therefore bound to its own project, any `saved-here` mark that save writes goes in its own file, and the first project's file is not written to by that save."
  - Check: a first save mints its own identity (kernel/src/project/mod.rs:250), and FolderHoldsProject refuses A's folder (:265-266). The mark goes to the record that `Project(project)` holds (session_history.rs:380-381). A's record is untouched: K-S15 asserts A's length unchanged after B's step, after B's save and after B's second save.

- **D4. SKP-V0.md §11.3, the "Every save" bullet's last sentence, has the same gap as D3.** It ends "is bound to its own project and marked in its own record". These are the worker's words, listed for the advisor's sight. Replacement for that clause: "is bound to its own project, and any mark that save writes is in its own record." The check is the same as D3.

- **D5. The doc bullet on `Projects::save`** (kernel/src/project/mod.rs, in the "Every save" bullet at :230-234 at H) says "A second open of the same file is another open, with its own record until its own first save." After its first save the open still has its own record, now moved under its own project, so "until" is wrong. These are the worker's words. Replacement:
  - "A second open of the same file is another open: its steps never go to the first open's record, and its own first save binds it to a project of its own."
  - Check: the lookup is by holder (session_history.rs:309), and the holder is `Open(name)` per catalog name (:141-149, :170-183). A reopen gets a new handle (skp.rs:1120), so its first save is a first save (`known` by name at mod.rs:243) and mints an identity (:250).
  - Case to name in the source comment: two opens bound to one project is reachable only through step 2's reopen (§2.4).

- **D6. The `Reached` rustdoc** (session_history.rs:186) still says "What the steps recorded for one opened file reach", but records are now per holder. These are the worker's words (§2.1 item 10). Replacement: "What the steps recorded in one record reach: the last value each one set." Check: `Reached` is a field of `Record` (:159), and it is updated for the record the step went to (:330).

- **D7. The P6 sight line** (not in the PR). This is the custodian's line, added after the merge, in lead-data's draft words (form, Ruled items, OPEN-S5). It says "no longer shown when a second open of one file is saved to another folder". That fails on the same facts as D3: S5 is still shown when that save has no step, or has steps the saved workspace does not hold. For the advisor or the custodian, replacement words: "S5 (frontends/shell/src/project/saveProject.ts:27-28): no longer shown when a second open of one file, whose recorded changes the saved workspace holds, is saved to another folder, which now replies written (second-open-history-before-1c-step-3; ADV-2026-11-13-20 item 2); the string is unchanged." Check: saveProject.ts:112, and session_history.rs:382-389.

- **D8. §7 overrun class, for the advisor.** `docs/PREREGISTRATION-TEMPLATE.md` Round 25 additions, class 8, covers a full-form piece that "exceeded a line budget or a file count its §7 declares". This piece's §7 declares "About 530 changed lines". The overrun is 719 lines, recorded as class 1 in Amendment 1 item 3 and Amendment 2 item 3. ADV-2026-11-14-04 item 4 (c) calls §7 an estimate. That ruling stands, so this is a finding for the advisor: is §7's "Size (estimate)" a line budget under class 8? If it is, the next amendment adds a class 8 row with the words "budget overrun, §7 not edited". §7 itself is not edited: the form is not in the diff.

### Observations
- The worker's C1b/C2 report, §9, says "The 32 MiB clause is the only changed clause in the item line". That is untrue for the same reason as D1. The report is evidence and is not edited.
- Item 63 says "binds it to the project that save makes". After a failed move, a later save binds the open to the project an earlier save made. That is an error path, to be named in the source comment.
- In item 43's DRAFT comment, the note on :300-316 says "no line bounds how many records or opens". The opens count is used at :179, outside that pinned span. The claim is true of the file (the only uses are :179 and :314, shown by grep), but the pin proves only the records half. Optionally add a pin of :168-184 at C1.

## Checks

1. **Start.** HEAD is 5e6b79bc0d0f423293b312140788044fab1de106 and the branch is `cut/second-open-history-before-1c-step-3`. The porcelain was empty, and `ls-remote` gave H. Every call exited 0. `df`: C: 51G free, D: 352G free. The brief is 11397 bytes, sha256 571ec130855f57bb7cec5f22e46291ff2f4a6c42fbc43b8f07f2ccd5f161a707, as stated. The packet is 4488 bytes, sha256 dc15c5c1…a0, as stated. The fetch exited 0, and origin/main = 8d22840a3356980aeaccb01dc5b25ade67750f1a. The form at origin/main has sha256 b74e1e9b98d517f2e5767d3afce706c76a59c90e6848ecbe2e529753e256fe24 (415 lines, 40970 bytes). The merge base of H and main is 695e1303…, which is B′.

2. **The diff** (`--numstat`, `--name-only` and the whole diff, each rc 0). It has 10 files and 520 insertions and 216 deletions, the same as the packet. All 10 are among §2.5's eleven; ADR-036 is untouched, as §2.6 expects before C3. No other file is changed: no frontends/, engine/, Cargo or PLAN file. `git diff --stat B′ origin/main` over those files shows only KNOWN-LIMITATIONS.md (2 insertions, 1 deletion), which is item 47's commit. An old-mode `git merge-tree B′ origin/main H` (which writes nothing) shows "changed in both" for KNOWN-LIMITATIONS.md and no conflict markers.

3. **The code at H against §2.1 to §2.4 and C-1 to C-5.**
   - **§2.1, items 1-3.** `Holder` (:122-128), `Open` with `name`, `uri` and `bound` (:130-149), and `State` with `opens` and `records` under one mutex (:162-184, :243). `Record` has lost `path`, `admission`, `uri` and `project` and gained `holder` (:154-160). `find` and `same_claims` are gone, and so is the `Admission` import (a grep count of 0).
   - **Item 4.** The reference is built under the lock from the open's URI (:300-306), the lookup is by holder (:309), and `data.dataset` is `reference.uri()` (:320).
   - **Item 5.** `create` picks the folder and header from the holder (:438-448). `create_dir` refuses a folder that exists (:449-451), and `remove_dir_all` runs only after this call made the folder (:454-455).
   - **Item 6.** `pub(crate) fn dataset_uri` (:274). Its product caller is mod.rs:252.
   - **Item 7.** `adopt_project(open, project)`: a bound open is a no-op (:345-347), the move runs only when the open has its own record (:348-362), the bind comes after it (:363), and an `Err` from `copy_under` returns before the bind (:352).
   - **Item 8.** `mark_saved_here(project, …)` looks up `Project(project)` (:380-381). NoStep is :382-386, `HeldByAnotherProject` is gone (count 0 across *.rs), and Differs and Written are unchanged.
   - **Item 9.** `end_session` takes `state.records` only (:404-405).
   - **§2.2.** mod.rs:252 calls `dataset_uri(name)`. `history(name, …)` is at :353-375, the `RecordHeldByAnotherProject` arm and variant are removed (count 0), and the signature of `save`, the `known` lookup (:243), FolderHoldsProject (:265-266) and `replace` are unchanged.
   - **The seam.** `record_step` and `save_project` both key on `req.dataset.as_str()`, the catalog name, which is the handle minted per open (skp.rs:1120). K-S15 and N2 start from the real shape (`SkpHost::open_dataset`, `record_step`, `Projects::save_project`).
   - **Locks.** `save` holds `saved`, then the recorder's lock in `dataset_uri` and `history`. No recorder path takes `saved`, so the order cannot invert.
   - **§2.3.** The three protocol texts and the §8 note are below `### Note …` (2026-10-26) and above `## 9.`, in the note shape. Each was clause-checked under check 8; only §11.3's last clause has a gap (D4).
   - **§2.4.** It is a description only, with no test and no `pub` item added, as the form says.
   - **C-1.** K5 and N2. **C-2.** N1 and N2. **C-3.** N3 in both orders, and N1's last assertion. **C-4.** K-S15.
   - **C-5.** The name is never written to disk: the folder is `unsaved-<hex32>` or `<P hex>` (:444-447), and no_generation_in_persisted_artifacts.rs is not in the diff (and the workspace run passed).
   - **Anchors at H** (`<S>/g318r-anchors.txt`). Each of these occurs once: `r.holder == holder` (M1 and M2; line 309), `state.open(open).bound = Some(project.clone());` (M3), `Some(project) => Holder::Project(project.clone()),` (M4), `self.recorder.dataset_uri(name)` (M5, in mod.rs), `Holder::Project(project) => Some(project),` (M6; line 439), `pub(crate) fn dataset_uri(&self, open: &str) -> DatasetUri`, `enum Holder {`, and `pub fn adopt_project(&self, open: &str, project: &ProjectUri)`. Removed items count 0. Nothing differs.

4. **The superseded rows** (`<S>/g318r-pins.txt`, rc 0).
   - 1b form :533 @ 8c693657: ab5709148d067caf0e4bad9aadf9c5a39af03bee2cf3ecdb14f508acffd51c81, equal to the pin.
   - 1c form :1668 @ 8c693657: 364f456d2854f45d61bb45f8d9f21dba65d41a8237dfefc83314c9fc78e5d262, equal to the pin.
   - (a) Each pin is a single line, which covers the claim.
   - (b) "is superseded" is on the row's own line, outside backticks, and preceded by "is".
   - (c) Both hashes recompute.
   - (d) The historical lines name `a_reopen_of_the_same_file_continues_its_record_and_another_file_starts_its_own` and `a_second_open_of_one_file_saved_to_another_folder_withholds_its_mark_and_leaves_the_first_record_unchanged`.
   - (e) `merge-base --is-ancestor 8c693657 origin/main` gives rc 0, and both forms are unchanged from 8c693657 to origin/main (empty diffstat, and the same hash at main).
   - Each row names only the new test, in backticks. The tool's rule text (scripts/plan/verify-test-claims.mjs:52-90 @ 8c693657) is unchanged to H (empty diffstat). Both files end in LF. The heading levels match each file's own earlier amendments.

5. **Heavy runs at H.** Each ran in its own shared hold with CARGO_TARGET_DIR=D:/wt-targets/so, CARGO_BUILD_JOBS=8 and RUST_TEST_THREADS=8.
   - Three targeted files: rc 0. project_save 17 passed, project_save_skp 6, session_history 13; 0 failed, 0 ignored. K5, K-S15, N1, N2 and N3 each showed `ok`.
   - `cargo test --workspace --locked`: rc 0. 122 result lines, 1077 passed, 0 failed, 66 ignored. The kernel lib: 188 passed, 0 failed, 1 ignored.
   - Shell `cargo test`: rc 0. lib 76 passed, main 0, sole_caller_scan 2, doc-tests 0; 0 failed, 0 ignored.
   - Hold lines, masked. Run 1: `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:59056 also=<m> …` and `MACHINE_RELEASED project=<m> shell=bash.exe:59056 affinity=FF (cores 0-7)`. Runs 2 and 3 have the same shape with shell 43300 and shell 80296. There was no MACHINE_WAITING or MACHINE_ERROR line.

6. **M1 to M6: STOPPED** (above).

7. **Light runs:** not run (stop).

8. **§2.6's words at C2.**
   - **Item 43.** The ceiling clause holds: 33,554,432 bytes per `History` (:48, :77-90, :94-119). "A normal close removes it" holds: `end_session` clears every record the run made. "No limit on how many files" holds: the only uses of the records and opens counts are at :179 and :314. Failing: "one file for each project from then on" (D2), and the comment's "Only the clause…" (D1).
   - **Item 63.** These hold: the title; "one file for each open … from the first … change"; "does not continue the earlier open's file, whether or not … saved or closed" (K5, K-S15); "moved under that project's identity … later changes written there" (:349-358); "A save made before … binds it as well …" (N1); "the first project's file is not written to by that save" (K-S15). Failing: the unconditional mark (D3).
   - **The ADR-036 note draft** in the report holds clause by clause at H. Item 1: :122-128, :141-149, :308-316. Item 2: :343-365, :352, :438-451. Item 3: :168-181, :270-277, mod.rs:250-253 and :276. Item 4: one caller of `adopt_project` at mod.rs:360; :250, :265-267 and :243 each check out. "Amendment 2" is the right number, since ADR-036 has only Amendment 1.
   - **§8 note, §11.2 and the `HistoryMarkState` rustdoc** hold. The §8 note's "one case" is correct: I compared the other second-open orders before and after the change and found the reply value unchanged in each.
   - **The DRAFT pins at C1** (`<S>/g318r-klpins-check.txt`): all 18 recompute at C1 (match), and each pinned span is byte-identical at H, because C1b changed only the U7 hunk at about line 1838. Authoritative: the pins at C1, which equal the tree at H.

9. **The packet's flags.**
   1. Item 43's turn holds. `state/gate-log.json` on main has 0 rows naming port-2, and C2 is this piece's point.
   2. I accept the pins at C1. They resolve on main only after a merge commit (Amendment 1 item 2). If the PR is squashed or rebased they must be re-pinned. Round 15 (e) is written for append-only records, and C3 rewrites these comments anyway.
   3. Size: 719 lines in the code, test and protocol files, against about 530, with nothing trimmed. Reading session_history.rs with the overrun in mind, I found nothing outside §2.1. Whether this is class 8 is D8.
   4. The worker's departures are for round 77. None affects the code at H.
   5. The words go to the advisor after these gates. D1 to D6 are my words for that step.
   6. I read the packet again myself: its base, heads, numstat and record paths are confirmed. Its CI line was not re-read (check 10 was not done).

10. **CI:** not read (stop).

11. **End** (2026-11-14T13:45:09Z). HEAD is 5e6b79bc0d0f423293b312140788044fab1de106, the porcelain is empty, and `git diff --stat` is empty. `df`: C: 50G free, D: 352G free.

## Status readings
- Status 1: no `project=SpatialIDE` line; quiet=False, average=81.0%, peaks-over-25=60.
- Status 2: none; quiet=False, average=41.2%, peaks-over-25=60.
- Status 3: none; quiet=False, average=31.3%, peaks-over-25=60.
- Status 4 (before M1): a `project=SpatialIDE` line was present; quiet=False, average=52.5%, peaks-over-25=60. No hold was taken.

## Background shells
Five were started: the three heavy runs and two of my bounded wait loops. All five completed. Nothing I started is still running, and nothing was killed.

## Model
Opus 5.5 (claude-opus-5-5), as the harness reports it.

Scratch files, all directly in `<S>`: g318r-start.txt, g318r-df1.txt, g318r-df2.txt, g318r-form.md, g318r-numstat.txt, g318r-names.txt, g318r-diff.txt, g318r-mainstat.txt, g318r-mt.txt, g318r-anchors.txt, g318r-pins.txt, g318r-klpins.txt, g318r-klpins-check.txt, g318r-43-base.txt, g318r-43-h.txt, g318r-three.txt, g318r-ws.txt, g318r-shell.txt, g318r-M1-diff.txt (0 bytes), g318r-end.txt, g318r-status-1.txt to g318r-status-4.txt.
