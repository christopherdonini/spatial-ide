*Custodian's filing note (2026-11-11): the worker's report on R3's second commit (R3-2) of piece 1c's step 1, given in its hand-back. Dispatched at 22:17:21Z by its transcript; the hand-back came at 23:05:33Z (claude-sonnet-5-5, a fresh worker; no compaction; unique calls from that dispatch: Read 17, Bash 53, Grep 2, Edit 24, Write 2, the hand-back, 99 in all). Five calls errored, all Edits: four of files not yet read and one whose old text was not found; none was a Guardian refusal. The K-S15 runs, clippy, the workspace tests, the src-tauri tests and the mutation run ran inside shared holds, six in all, each released; cargo fmt ran outside one, as light work. The report below was extracted by script from the hand-back in that transcript (12181 bytes, sha256 5ee51a604d42c0a0de04268a04bbaf94d76270039d839aef83d7327b9adf494e). It is unchanged except in one cite into a file on the branch, written there as a path, a colon and a line: here it names its file and then its lines in words, so that main's cite check does not read it as main's lines. One final newline is added. The custodian checked by script: the commit's parent, 190c6c80; one sign-off, git's own, and the trailers; origin's branch at 9e0d4b08 with the porcelain empty; the 7 files changed since 190c6c80, each named in Amendment 22 item 2; the counting command at B = e3fb4a97 recomputed, 75 files and 7748 lines; the check logs' counts: 1073 passed, 0 failed, 66 ignored; 75 passed in src-tauri; the mutation run failing at B's reply. No process of the worker's was left running, by its report.*

---

Built: b2-piece-1c-save-and-reopen R3-2 at 9e0d4b08f17ef07033af4ea35b4f512fc7c5a4f6

**Start state.** Form sha256 16a37b7e...ead794b4, as given (main 8e09470c). Worktree HEAD, ls-remote and the start porcelain were 190c6c80, 190c6c80 and empty. df at start: C: 20G free, D: 189G free.

**Commit.** 9e0d4b08, `fix: a save whose session record another project holds withholds the mark`. Pushed 190c6c80 -> 9e0d4b08. ls-remote after the push shows 9e0d4b08. Porcelain is empty. Lines gained/lost per file:
- KNOWN-LIMITATIONS.md +4 -0
- kernel/README.md +1 -1
- kernel/src/project/mod.rs +16 -7
- kernel/src/session_history.rs +13 -3
- kernel/tests/project_save_skp.rs +92 -3 (K-S15, the `recover` import, the reflowed `use`)
- protocol/skp/SKP-V0.md +2 -2
- protocol/skp/src/v0/commands.rs +1 -0
- Totals by `--stat`: 129 insertions, 16 deletions. My per-file split is from the stat line and may be off by a line or two.

**Words script.** `<S>/b2c-r32-words.mjs`, output `WORDS-OK`, with the three `ok` lines (commands.rs `///` form, SKP-V0.md 11.2, SKP-V0.md 11.3). It matches the form's three item-2 texts. The option (a) clause was not applied.

**Signatures as they now stand.**
- `SavedHere` gains `HeldByAnotherProject`.
- `Withheld` gains `RecordHeldByAnotherProject`.
- `pub fn mark_saved_here(&self, ds: &Dataset, project: &ProjectUri, differs: impl FnOnce(&Reached) -> Option<&'static str>) -> Result<SavedHere, SkpError>`
- The check sits right after `find`, before the NoStep and Differs checks. It is `rec.project.as_ref().is_some_and(|held| held != project)`, and a record with no project is not treated as held.
- K-S15: `a_second_open_of_one_file_saved_to_another_folder_withholds_its_mark_and_leaves_the_first_record_unchanged`
- Caller grep: `mark_saved_here` is called from `Projects::history` (`kernel/src/project/mod.rs`), which maps `SavedHere::HeldByAnotherProject` to `Withheld::RecordHeldByAnotherProject`. `save_project` replies `withheld` from it.

**Item 1's six doc sentences.**
1. `mod.rs` module doc, the `Projects::save` bullet. Old: "...and last the history's two moves (the first save's record move and the `saved-here` mark)." New: that sentence plus ", neither of which touches a record that another project of this run holds".
2. `Projects::save` doc, last bullet. Old: "...the first save's record move, and a `saved-here` mark when the steps reach the workspace." New: "...the first save's record move, unless another project of this run holds the record, and a `saved-here` mark when the steps reach the workspace and no other project holds the record."
3. `Withheld`'s doc: its type-level sentence ("Why no `saved-here` mark was written. The project file was written in each case.") is still true, so I left it unchanged. The change is in the new variant's doc: "The history's record for the dataset's file belongs to another project this run has saved, so none of this project's saves of this open writes a mark there."
4. `SavedHere`'s doc: the enum sentence ("What `mark_saved_here` did") is still true and unchanged. The new variant's doc: "The record of this file belongs to another project than the one saving; nothing was written to it."
5. `mark_saved_here`'s doc. Old: "...for the file `ds` was opened over. `differs` is given what the steps reach..." New: "...over, for the project `project` that is saving. When the record `ds` finds is held by a project other than `project`, nothing is written to it, at this save and at every later one of the same open ([`SavedHere::HeldByAnotherProject`]). `differs` is given what the steps reach...".
6. SKP-V0.md 11.3, the "Every save" bullet. Old: "...the first save's record move, and a `saved-here` mark when the recorded steps reach the workspace." New: item 2's text, byte for byte.
- Item 2's two other texts landed too: `HistoryMarkState`'s doc in `commands.rs`, and SKP-V0.md 11.2 `history_mark`.

**KNOWN-LIMITATIONS item 63, with the DRAFT comment.** The text below is byte-copied.
```
63. **A file the app has saved, opened again and saved to another folder, gets a project file and no `saved-here` mark in the session history.**
    The first save of an open dataset moves the session history's record for that file under the new project. If that dataset is closed and the same file is opened again in the same run (the same path, admitted under the same claims), and the second open is saved to a folder, the save makes another project and writes its `project.spatial`. The history's record for the file still belongs to the first project, so the save does not move it and writes no mark in it, and the reply says the mark was withheld. Every later save of that second open in the same run does the same, not the first only. The first project's record is not written to by any of these saves, and the session history holds no record under the second project's identity. Not covered: what the steps recorded on the second open do to the first project's record.
    <!-- DRAFT wording for the human's sight, not the human's own wording (governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md, Amendment 21 item 4 and Amendment 24 item 2; the number is the next free after item 62 at R3's base; the words are pending the human's approval, item 2e of state/directives/2026-10-11-direction-after-status-review.md). Where the code does this, at R3-2's commit on the piece's unmerged branch, so named by path and in words with no hash: StepRecorder::mark_saved_here in kernel/src/session_history.rs (its check that the record is held by a project other than the saving one, which returns SavedHere::HeldByAnotherProject before anything is written); StepRecorder::adopt_project in the same file (it does nothing when a project holds the record); Projects::history in kernel/src/project/mod.rs (it passes the saving project's identity and maps that variant to Withheld::RecordHeldByAnotherProject); Projects::save_project in the same file (the reply's history_mark is withheld). The test is a_second_open_of_one_file_saved_to_another_folder_withholds_its_mark_and_leaves_the_first_record_unchanged in kernel/tests/project_save_skp.rs, which saves the second open twice. The pins follow on main after the merge. -->
```
`kernel/README.md` line 395 now reads: `- **Declared limits:** KNOWN-LIMITATIONS 5, 6, 8, 12, 16, 21, 28, 30, 32, 43, 47, 62, 63`

**Checks at 9e0d4b08, with exit codes.** Outputs are under `<S>` in files named `b2c-r32-*`.
- `git diff --check 190c6c80..HEAD`: rc 0.
- `cargo fmt --check`: rc 0.
- `cargo clippy --all-targets --locked`: rc 0, 8 distinct warnings, the same as R3's 8, none in a file or line R3-2 writes.
- `cargo test --locked --features spatial-engine/fixture`: rc 0, 1073 passed, 0 failed, 66 ignored. R3's was 1072/0/66, so +1 for K-S15.
- `cargo test --locked` in `src-tauri`: rc 0, 75 passed, 0 failed (R3's was 75).
- `node --test` over the plan, hooks and evidence suites: rc 0, 598 pass, 0 fail.
- `profile-path-scan --staged`: rc 0, "clean".
- `verify-cites`: rc 0, PASS.
- `verify-test-claims`: rc 0, PASS.
- No lockfile changed and nothing is silenced with `allow(dead_code)`.

**Mutation (K-S15), observed at 9e0d4b08.** I replaced the project check with `let _ = project;`, ran K-S15 alone, got rc 101, then ran `git checkout -- kernel/src/session_history.rs`. The porcelain was empty after the revert. The failing line, byte-copied from `<S>/b2c-r32-mut.out`:
```
panicked at kernel\tests\project_save_skp.rs:427:5:
assertion `left == right` failed: B's reply
  left: Written
 right: Withheld
```
It fails at B's reply, which reads `written`, as predicted.

**Size.** Command: `git diff --numstat e3fb4a97...HEAD -- . <§2.11 exclusions>`. Result: 75 files, 7,748 lines (7,503 added, 245 deleted), against Amendment 23's 7,635, so +113. The 75 files are within the 77 ceiling and there is no new file. My grouping of the paths is a reading of the form's tables, not the form's own. Groups against Amendment 23, with ceilings:

| Group | Lines | Amendment 23 | Ceiling |
|---|---|---|---|
| protocol product | 479 | 478 | 320 |
| fixtures, protocol tests and literal | 541 | 541 | 390 |
| kernel product | 3,241 | 3,222 | 1,350 |
| kernel tests | 1,739 | 1,650 | 1,000 |
| shell tests | 458 | 458 | 380 |
| e2e | 505 | 505 | 320 |
| shell product | 346 | not given | 380 |
| records | 55 | not given | 120 |
| src-tauri | 66 | not given | 100 |
| renderer | 123 | not given | 200 |
| ADR text | 51 | not given | 80 |
| spike | 144 | not given | 150 |

The groups that were over their ceilings were already over at 190c6c80. This commit adds to protocol product, kernel product and kernel tests. Class 8, for the custodian to record; I trimmed nothing.

**Reading on item 5 (a reading, not an observation; no assertion was added for it).**
- `record_step` finds its record by path and admission claims only (`kernel/src/session_history.rs`, lines 244-246 on the branch: `r.path == ds.path() && same_claims(...)`). It does not look at the project.
- `kernel/src/skp.rs` has no reference to the recorder or `StepRecorder` (grep found none), so `close_dataset` (`skp.rs:1590`) never reaches it.
- Together, a second open's recorded step continues A's record before any save.
- K-S15 does not assert this. I removed the line-count and last-line assertions I first wrote, so the test does not pin an answer the gate or the S3 node has not settled.

**Departures and additions beyond Amendments 21 and 24.**
1. **K-S15 reads lengths, not bytes.** K-S15's "A's record bytes equal" could not be done as bytes while A's record is live. On Windows `std::fs::read` of the locked file failed with os error 33 (my first run). So K-S15 compares the record's length from `metadata` before B's save, after it and after B's second save. After dropping the recorder it reads the record with `recover` and asserts the chain is valid and exactly one `mark` line is present. This is weaker than byte equality. Under the mutation B's reply fails first.
2. **`Projects::history`'s private doc brought current.** Its old text said the mark is written if the steps reach the workspace. I changed it to also say the move happens only if no project holds the record, and the mark only if no other project holds it. It is not one of the six sentences. I count it as a sentence the change made untrue, and I am disclosing it.
3. **`use` line in the test file.** I changed the `spatial_skp::v0` import to add `CloseDatasetRequest` and `HistoryMarkState`, and the `session_history` import to add `recover`. `cargo fmt` reflowed the `use` block.
4. **Reading limits.** Per the brief I read the whole of each file I edited only in the ranges I changed. `project/mod.rs` and `session_history.rs` I read in the ranges the change touches plus the module headers; `commands.rs`, SKP-V0.md and `project_save_skp.rs` only around the edits.
5. **Commit file lists.** The commit message file carries no sign-off line; git added it. I did not touch the main checkout.

**Hold lines (`also=` elided).** Six shared holds, each released: `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:<pid>`. They covered the K-S15 first run, K-S15 second run, clippy, the workspace tests, the src-tauri tests and the mutation run. No refusal (no exit 96-99).

**Background shells.** None left. Three poll loops I started finished or were stopped, and `tasklist` shows no cargo process.

**Model.** The harness reports Sonnet 5.5 (claude-sonnet-5-5). No model override. No context handoff received or produced.

**Pre-gate self-check.**
1. Cross-module code uses the other side's real interface. I read `Projects::history`, `adopt_project`, `record_step`, `find` and `close_dataset` before writing, and K-S15 goes through `SkpHost::open_dataset`, `close_dataset`, `record_step` and `Projects::save_project`.
2. Completion claims point to evidence that exists: the files under `<S>` and the mutation output above.
3. User-facing messages describe built behaviour: `history_mark: "withheld"` and the item 63 text were written from the built code.
4. K-S15 reaches its assertions. The first run failed at the metadata read, which I fixed. The mutation run fails at the reply assertion.
