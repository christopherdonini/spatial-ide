*Custodian's filing note (2026-11-10): the O1 worker's two reports, from its two hand-backs, each byte for byte below its rule: the first attempt's stop report (sha256 6a54525f767573dccec74755d8bfe8e16721c66777183d21b78425f3d97d3f29, 5082 bytes, 2026-11-10T17:41:54Z) and the final report (sha256 5b271fdffd450725ed385c645259ca0bdd5b82efed69ffe92983f528d6e0e14d, 13743 bytes, 2026-11-10T19:35:35Z). Its brief, brief-o1.md (10287 bytes, sha256 ddd60715d2b7542a05c13b63578615fdb868d09a901972683012a17a5556009f), and Addendum 1, brief-o1-add1.md (1734 bytes, sha256 4b32a2c7021f7d05cd9b0cfca86df20c8370c629b21bc1fd4517bdefcbe093ba), delivered 2026-11-10T17:49:00Z. The run 2026-11-10T17:39:48Z to 2026-11-10T19:35:35Z by its transcript, 162 calls, model claude-sonnet-5-5; the transcript holds a context continuation at 2026-11-10T18:03:43Z. Checked by the custodian: the branch at 4761ded8 on origin, its two commits' parents, and the test totals in the worker's logs (979, 0, 57 and 993, 0, 57). Its scratch paths are written as `<S>` by the worker itself.*

---

Stopped: b2-piece-1c-save-and-reopen O1, the saved-here mark and the first-save record move can only be written inside `kernel/src/session_history.rs`, which is not in O1's list. Nothing was edited, built, committed or pushed.

**Start state (shown by calls before any edit)**
- `C:/dev/wt/b2c`: `git rev-parse HEAD` printed 7109aeb2431d9ca9379cb15b0d027dba78a20217.
- `git ls-remote origin refs/heads/cut/b2-piece-1c-save-and-reopen` printed the same id.
- `git status --porcelain` was empty. I ran it again just before this report and it was still empty.
- The form in the main checkout, `C:/dev/spatial-ide`, hashed to eb1f3cd5faf1faa3105f0de09f557be8a1ea2f17450fa177ad70d7c392891250 (1,158 lines), with main at 1cc69e447493e7f01340435b0d033ab41b853a02.
- I read everything the brief names: the form's sections and amendments, the N1 to N7 worker report, O0's run record, and Part 1 items 1 to 9. I also read the current `kernel/src/project/{mod,store,file}.rs` and `kernel/tests/project_save.rs`, and `kernel/src/session_history.rs` lines 1 to 520.

**Why I stopped (your rule: a need to edit a file outside O1's list)**
1. **The mark and the move need the live record, and its internals are private.**
   - Amendment 1 item 2 lists the saved-here mark and the first-save record move as parts of the orchestration. Item 5's K-S8 and K-S9 need both, and so does K-S1's mark and OPEN-9 (A)'s withhold-when-different check.
   - The form's §2.3 writes the mark "through 1b's append path, with one write and one flush". It also copies the kept lines under a new header, syncs, renames and locks the copy, then removes the `unsaved-` record.
   - The append path is `History<File>`, a private field of the private `Record`. The records sit in `StepRecorder.records`, a private `Mutex<Vec<Record>>` (`session_history.rs:122-137`).
   - `StepRecorder` has no public method besides `new`, `record_step` and `end_session`. The grep I ran shows `new` (146), `record_step` (158) and `end_session` (204). The module's only other public items are `default_root`, `recover` and the `Recovered`, `Header` and `Failure` types.
   - No code outside `session_history.rs` uses `StepRecorder` (that grep printed nothing).
   - `project/mod.rs` is a sibling module and cannot reach those fields. The record's history file is also held under `try_lock` (`session_history.rs:269`), so a second handle cannot be relied on to append or copy. That second point is my reading of the code, not something I ran.
   - Files §2.11 lists for step 1's kernel product include `session_history.rs`, but the brief's O1 list does not name it. N6 edited only `read_line` and the Status line.
2. **What I would add, if you widen the brief to `session_history.rs`:** a small `impl StepRecorder` surface, in that file, with these three jobs.
   - Append one `saved-here` mark to the record of a given opened dataset, if the record has a last step. It returns whether a mark was written, so `history_mark` can be `written` or `withheld`.
   - Report the last filter and style values that the record's steps reach, for the OPEN-9 (A) comparison.
   - Do the first-save move (copy under the project header, sync, rename, lock, then remove the `unsaved-` record).
   - Each of these is a `pub` item whose product caller is the P3 handler. That is the same intermediate-commit pattern as N5 and N7.
   - This edit counts toward the kernel product group, which is already over (class 8).
3. **A second gap that does not block.** `DatasetRef` has no way to add a `project-relative` locator: its fields are private, and `DatasetRef::linked` builds `[machine-recorded]` only (`dataset_ref.rs:216-232`). `Locator::ProjectRelative(String)` is a public variant. Without touching `dataset_ref.rs`, the orchestration could build the entry by `to_json`, inserting the locator, and `DatasetRef::parse`. That parse also applies N4's canonical-form check. A `pub(crate)` constructor in `dataset_ref.rs` would be simpler but is also outside the list. Tell me which you want.

I did not do the part of O1 that does not need `session_history.rs` (`judge` in `resolver.rs`, the carrying rule, OPEN-16, the kept-lineage refusal, `folders.json`'s `first`, and K-S3 to K-S5 and K-S10 to K-S13). The brief allows a push only when everything passes. A partial `save_project` without the mark and the move would also fix an orchestration shape that your decision might change.

**Other checks**
- None of §5's invalidators I1, I2, I3, I6 or I7 was triggered, and nothing under `protocol/`, `frontends/`, `renderer/`, `engine/` or `docs/` was touched.
- The brief's size counts and the 979 / 0 / 57 test baseline were not re-run, because no cargo call was made.
- No mutation was observed and no commit made.

**Hold lines:** none. No hold was requested, because no cargo call was made.
**Push:** none. Origin's branch is still at 7109aeb2431d9ca9379cb15b0d027dba78a20217, equal to HEAD.
**Background shells left:** none; I started none.
**Model:** Sonnet 5.5, id claude-sonnet-5-5, as the harness reports it. No override and no context handoff.

---

Built: b2-piece-1c-save-and-reopen O1 at 4761ded8df7fd3206cec84b21ceaec4fc8ce9338

**First attempt (as I reported it).** I stopped before any edit. O1 needs the `StepRecorder` surface in `kernel/src/session_history.rs`, which was not in O1's file list: the saved-here mark written or withheld, the filter and style values the record's steps reach (for OPEN-9 (A)), and the first-save record move. Your addendum confirmed the stop and widened the list to `kernel/src/session_history.rs` and `kernel/src/dataset_ref.rs`, the latter for a `pub(crate)` project-relative constructor only. The stop condition inside the widening was: if the line format, the reader, the lock or `recover` would need to change, STOP. None did. This run then built O1 under both briefs.

**Start state.** The worktree `C:/dev/wt/b2c` was on `cut/b2-piece-1c-save-and-reopen` at 7109aeb2431d9ca9379cb15b0d027dba78a20217 (N7). The porcelain was empty. The first push updated origin from 7109aeb2 to 4761ded8, which shows that origin was at N7 before it. The form was read from the main checkout, which I did not write. I did not merge main.

**Commits** (both signed off with `-s`, no `@` outside the first trailer line; the sign-off is the one `-s` adds):

1. e36e951167fcad90e8ee07f1a4bfd3be12cd0e56, `feat: save a project from an open dataset (judge, orchestration, history moves)`. Files: `kernel/src/dataset_ref.rs`, `kernel/src/project/mod.rs`, `kernel/src/project/resolver.rs` (new), `kernel/src/session_history.rs`.
   - Checked on its own, with the two test files restored to N7 while it ran.
   - `cargo fmt --all --check`: exit 0.
   - `cargo clippy --all-targets --locked` (no `-D`): exit 0, 45 warnings, none in a touched file.
   - `cargo test --locked --features spatial-engine/fixture`: exit 0, 979 passed, 0 failed, 57 ignored (equal to N7's 979 / 0 / 57).
2. 4761ded8df7fd3206cec84b21ceaec4fc8ce9338, `test: save project tests and the project file's no-generation scan`. Files: `kernel/tests/project_save.rs`, `kernel/tests/no_generation_in_persisted_artifacts.rs`.
   - fmt: exit 0.
   - clippy: exit 0, 45 warnings, none in a touched file. An earlier full-tree clippy run, with `--features spatial-engine/fixture`, showed 46: one `cloned_ref_to_slice_refs` in my `project_save.rs`. I fixed it before this commit.
   - test: exit 0, 993 passed, 0 failed, 57 ignored. That is 979 plus 13 new tests in `project_save.rs` and 1 for G3. K-S6 and K-S7 are unchanged.

**What the code does.**
- `judge` follows §2.5.
  - It canonicalizes the data and the folder, then checks containment.
  - It runs the ADR text check through `DatasetRef::with_project_relative`.
  - It then walks the path as the dataset was opened, from the folder down, with `symlink_metadata().is_symlink()`. Walking the canonical path could never meet a link.
  - A data path with no canonical spelling is saved as `machine-recorded` only, per OPEN-4 (A), and the save is not refused.
- `Projects::save` does the following.
  - It mints the identity at the first save.
  - It refuses a first save into a folder that holds `project.spatial` (OPEN-16).
  - It refuses a later save over a file that records a kept lineage.
  - It writes `locations.json`, and `folders.json` with `first` at the first save.
  - It replaces `project.spatial` through N7's store, whole or not at all. The writer self-check is N5's.
  - After that the history takes its two moves, and a history failure does not undo the save; the result says so.
- The mark is withheld when the workspace differs from what the steps reach (OPEN-9 (A)). The filter is always compared, and a style property only if a step set it.
- Reopen, protocol, shell and records are untouched.

**New tests** (all in `kernel/tests/project_save.rs` unless noted). Each is a real `open_dataset` → `Projects::save` → read back through the shipped readers. K-S9 passes on this machine's Windows, so the lock-before-rename departure below works here.
- K-S1 `a_saved_project_reads_back_in_the_line_oriented_form_from_a_real_open`
- K-S2 `the_identity_is_minted_at_the_first_save_and_kept_after`
- K-S3 `inside_data_reached_without_a_link_carries_project_relative_and_machine_recorded`
- K-S4 `data_reached_through_a_link_below_the_folder_carries_machine_recorded_only` (a junction made with `cmd /C mklink /J`; on non-Windows a symlink)
- K-S5 `outside_data_carries_machine_recorded_only_and_no_absolute_path`
- K-S8 `a_save_appends_one_saved_here_mark_that_recover_chains`
- K-S9 `the_first_save_moves_the_record_under_the_project_identity`
- K-S10 `a_first_save_into_a_folder_holding_a_project_is_refused`
- K-S11 `inside_data_with_no_canonical_spelling_is_saved_with_machine_recorded_only`
- K-S12 `saving_over_a_kept_lineage_is_refused_by_name`
- K-S13 `the_first_save_records_its_folder_as_first_in_folders_json`
- two the form does not name:
  - `a_workspace_the_steps_do_not_reach_is_saved_and_the_mark_is_withheld`
  - `a_first_save_without_a_folder_is_refused_and_writes_nothing`
- G3 `a_project_file_carries_no_generation_handle_session_reference_absolute_path_or_user_name`, in `kernel/tests/no_generation_in_persisted_artifacts.rs`.
- The Status line in that file's module doc item 5 now reads `Accepted 2026-10-22`, with the writers named. The sentence "a fifth (5.) that has no writer yet" was rewritten to match.

**Mutations.** Each was applied at 4761ded8df7fd3206cec84b21ceaec4fc8ce9338, the named test was run alone, and the file was reverted with `git checkout -- <file>`. The porcelain was empty after each. No `verify-mutation` run was used. Failure lines, byte-copied:
- K-S1, mutation: `save` writes `to_canonical_string(&file.to_json())` after the self-check. Failure: `thread 'a_saved_project_reads_back_in_the_line_oriented_form_from_a_real_open' (82776) panicked at kernel\tests\project_save.rs:271:5:` / `the layout's first lines: {"format":"spatial-project","version":1,"project":"spatial://project/81b749e0e309226581df2839cb4dffdc","datasets":[{"res`
- K-S2, mutation: a later save mints an identity again. Failure: `project_save.rs:327:5: assertion `left == right` failed: kept after the first save`
- K-S3, mutation: `judge` never uses the project-relative reference. Failure: `project_save.rs:361:5: assertion `left == right` failed` / `left: [MachineRecorded]` / `right: [MachineRecorded, ProjectRelative("data/parcels.parquet")]`
- K-S4, mutation: `if false && reached_through_link(..)`. Failure: `project_save.rs:411:5: assertion `left == right` failed` / `left: ProjectRelative("data/real/parcels.parquet")` / `right: MachineRecordedOnly(ThroughLink)`
- K-S5, mutation: `save` adds a disabled clause holding `ds.path()` to the workspace it writes. Failure: `project_save.rs:447:5: the file names the data's path`
- K-S8, mutation: the mark's `after` is a well-formed id that is not the last step's. Failure: `project_save.rs:465:5: the history chains: Some(Failure { line: 4, rule: "Malformed { path: \"$.mark.after\", detail: \"`after` is the last step before the mark\" }" })`
- K-S9, mutation: the `unsaved-` record is not removed. Failure: `project_save.rs:536:5: assertion `left == right` failed: only the project's record remains` / `left: ["6faed26b9dd853c44a1600942405c4fc", "unsaved-c38658fd2455d654cd9dcefb7e960535"]`
- K-S10, mutation: `if false && symlink_metadata(&target).is_ok()`. Failure: `project_save.rs:626:10: the folder holds a project: Saved { project: ProjectUri("spatial://project/40d10b43df9456a7e41a0c8a27bff861"), history_mark: Withheld(NoStepRecorded), carried: ProjectRelative("data/parcels.parquet") }`
- K-S11, mutation: `save` returns an error for `NoCanonicalSpelling`. The error variant used was `LineageNotKept`, as a stand-in. Failure: `project_save.rs:681:10: the save is not refused: LineageNotKept`
- K-S12, mutation: the `LineageNotKept` arm is guarded by `false`. Failure: `project_save.rs:717:10: a kept lineage is not replaced: Saved { project: ProjectUri("spatial://project/83a22b172451114a1ff906c55c603a94"), history_mark: Withheld(NoStepRecorded), carried: ProjectRelative("data/parcels.parquet") }`
- K-S13, mutation: the `folders.json` write is skipped. Failure: `project_save.rs:742:60: folders.json: Os { code: 2, kind: NotFound, message: "The system cannot find the file specified." }`
- withheld test, mutation: `differs` returns `None` first. Failure: `project_save.rs:575:5: assertion `left == right` failed` / `left: Written` / `right: Withheld(WorkspaceDiffers("style"))`
- no-folder test, mutation: the folder defaults to the data's own folder. Failure: `project_save.rs:653:10: no folder: Saved { project: ProjectUri("spatial://project/97e4b5eb3b42ba1c45acf69f89701daf"), history_mark: Withheld(NoStepRecorded), carried: ProjectRelative("parcels.parquet") }`
- G3, same clause mutation as K-S5. Failure: `no_generation_in_persisted_artifacts.rs:1005:9: the project file names the data's path`

**Where a mutation differs from the form's wording (departures):**
- K-S5 and G3: the form says "the absolute path written as `at`" or "the open's path written". That cannot be applied, because the canonical-form check and the writer's self-check refuse an absolute path as a project-relative `at`. I used the clause mutation above. 1b's G2 note has the same shape.
- K-S4: the form says "the walk follows links". I used "the walk never reports a link".
- K-S8: a first attempt with a malformed `after` failed earlier, at the `history_mark` assertion (`project_save.rs:497`), because the writer refuses the line. The recorded one has a well-formed id.

**What I added that the form does not name, each disclosed.**
- In `kernel/src/dataset_ref.rs`: `DatasetRef::with_project_relative`. It is `pub(crate)`, reuses the private `in_canonical_form`, and takes the length bound and the same error type as `over`.
- In `kernel/src/session_history.rs`: `Reached`, `SavedHere`, `StepRecorder::adopt_project`, `StepRecorder::mark_saved_here`, the free functions `find`, `copy_under`, `with_project` and `mark_accepted`, and the `Record` fields `project` and `reached`.
  - The line format, the reader, the lock and `recover` are unchanged.
- In `kernel/src/project/mod.rs`: `Projects`, `Saved` (with a `carried` field), `HistoryMark`, `Withheld`, `SaveFailure`, `differs`, `read_existing`, `locations_json` and `write_machine_file`.
  - `locations_json` and `write_machine_file` are not in the form.
  - `write_machine_file` writes a temp file, syncs it, and renames it over the name.
- In `kernel/src/project/resolver.rs`: `Carried`, `Why` and `Judged`.
- Behaviours the form does not state:
  - A later save ignores its `folder` argument and uses the first save's.
  - An existing project file the reader refuses is a refusal (`FileRefused`) on a later save.
  - The machine store files are written before `project.spatial`.
  - A first save with no folder is refused (`FolderRequired`).
- Unlisted tests: the withheld test and the no-folder test.
- Not done, and not in O1's list: the kernel does not check that `view.crs` equals the dataset's space, nor the filter against the dataset.

**Departures from the brief and the form:**
- §2.3's literal order for the first-save move is to write the new history, sync, rename, then open and lock it. I lock the new file before it is renamed into place, so it is never visible unlocked. On Windows a locked file cannot be read by another handle, so the copy reads through the record's own handle. Locking before the rename works here: K-S9 passed, and the fallback to the literal order was not needed.
- The `pub` items above (`Reached`, `SavedHere`, `adopt_project`, `mark_saved_here`, and `Projects` with its types) have no product caller in this tree until P3's handler. That is the caller rule's intermediate-commit case. Nothing is silenced with `allow(dead_code)`.

**Counts.** The §2.11 command over `43a39222ebe6fbe1352c2268ef54521921028b66...HEAD` gives 17 files and (added + deleted):
```
145 10 kernel/src/dataset_ref.rs
3 2 kernel/src/lib.rs
830 0 kernel/src/project/file.rs
411 0 kernel/src/project/mod.rs
119 0 kernel/src/project/resolver.rs
282 0 kernel/src/project/store.rs
460 0 kernel/src/project/strict_json.rs
449 47 kernel/src/session_history.rs
118 4 kernel/tests/no_generation_in_persisted_artifacts.rs
768 0 kernel/tests/project_save.rs
93 0 kernel/tests/project_save_crash.rs
```
- Kernel product group: 2,758 against a ceiling of 1,350. The overrun is 1,408; N7 stood at 2,099. It was over before O1, and I did not trim.
- Kernel tests group: 983 against 1,000.
- The other groups in the range are untouched by O1.

**Hold lines** (also= elided). About 25 shared holds, every one granted at the first request. None was refused (no exit code 96 to 99). Every cargo call set `CARGO_TARGET_DIR=D:/wt-targets/b2c`, `CARGO_BUILD_JOBS=8` and `RUST_TEST_THREADS=8`. Examples:
- `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:57076 ... (commands started from now on inherit it; release when done)`
- `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:57076 affinity=FF (cores 0-7)`

**Push.** `git push origin cut/b2-piece-1c-save-and-reopen` ran in its own call and printed `7109aeb2..4761ded8`. `git ls-remote` shows 4761ded8df7fd3206cec84b21ceaec4fc8ce9338, equal to `git rev-parse HEAD`. The porcelain is empty. No PR was opened, and I did not wait for CI.

**Background shells.** None left. The four background commands I started (two full test runs and two waiting loops) all completed with exit 0.

**Model.** Sonnet 5.5, id claude-sonnet-5-5, as the harness reports it.

**Logs.** In `<S>`, under the prefix `b2c-o1-`: `b2c-o1-c1-test.log`, `b2c-o1-c2-test.log`, `b2c-o1-c1-clippy.log`, `b2c-o1-c2-clippy.log`, `b2c-o1-mut-*.log`, `b2c-o1-numstat.txt`.
