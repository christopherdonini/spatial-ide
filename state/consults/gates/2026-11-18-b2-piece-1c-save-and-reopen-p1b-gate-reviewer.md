Reviewed: PR #331 at 1ad509ad69f1be832ef92af43c26cb03ada00a56 (the custodian's filing note, 2026-11-18: the reviewer, one of PR 331's two gates under its form's Amendment 30 item 6 (f); Bash 148, Read 6, model claude-opus-5-5, from 2026-11-18T17:15:51Z to 17:39:22Z; its departures from the brief, one network read (gh run list on the branch) and one probe beyond the form's mutations, are in its O5; the report below byte for byte from its hand-back of 23509 bytes, sha256 61f9f2b68aa74befaaeb014ed7d99ef49df69e22551bfcb862476425bd602756, with this note in its first line and one final newline), gate, reviewer
Verdict: PASS WITH NOTES

Branch and commit: `cut/b2-piece-1c-p1b @ 1ad509ad69f1be832ef92af43c26cb03ada00a56` (F). Base B = bdc72f5fc78734d90f2b1979f3cc4cdc399a6a6f. Main was at 6c46d3b294c39d3560ed9e4b0de7bd31ab2bbd7a. The form at origin/main has sha256 2abd1fcaf06b23206d315523111763d23cec79961009610523bb43643faa145f (2216 lines, 285444 bytes). The brief's sha256 matched (9aa5b58e…). Both evidence reports matched their stated sizes and hashes.

## Findings by class

### Correctness
None. Each point below is checked against the code at F:
- **The write order.** In `kernel/src/project/mod.rs:289-314 at F`, both documents are built before the first machine-store write. `locations_to_bytes` runs at :294 and `to_bytes` inside the `first` arm. Only then come `create_dir_all` (:308), the two `write_machine_file` calls (:309, :312) and `replace` (:314). A refusal of either document returns before :308.
- **The mapping.** `MachineRecordRefused` maps to `project_file_refused(r.file, &r.rule)` (`mod.rs:463 at F`). There is no new code and no wire change.
- **D-16.** `Staged::commit` is `self.commit_with(sync_folder)` (`kernel/src/project/store.rs:146-147 at F`). In `commit_with` (:151), once `fs::rename` returns `Ok`, a failed flush only runs `eprintln!("the folder flush after the project file's rename failed: {}", e.kind())` (:158). Then `remove_stale_temps` runs and it returns `Ok`. The line is an engine fact only: no path, no handle, no duration, no consequence.
- **The lock** (`store.rs:231-248 at F`):
  - `create_dir_all(record_dir)`, then `read+write+create+truncate(false)` (:235), with no write.
  - `File::try_lock` (:237): `WouldBlock` maps to `Held`, and any other error to `Io`.
  - `Drop` unlocks. Process exit frees the lock.
  - This matches item 6 (a).
- **The writers' bounds** (item 4 (a)):
  - `stored_path` (`store.rs:303-316 at F`) refuses a path that is not absolute, is not valid Unicode, or has `s.len() > 4096`.
  - The reader's bound counts decoded bytes (`strict_json.rs` `string`: `decoded.len() > max`), so the writer counts the same unit.
  - `to_bytes` refuses `text.len() > FOLDERS_LIMITS.max_bytes` (:339). The reader checks the line without its LF (`from_bytes` strips it first), so the off-by-one is consistent.
  - `locations_to_bytes` (:449) bounds the path only. Its doc says one entry is "far below the document's byte bound". That holds: `DatasetUri` has a fixed spelling, 22 + 32 characters (`dataset_ref.rs:40,83`), and the path is at most 6×4096 escaped bytes.
- **"P1b reads back everything either machine-store writer writes" holds.** I found no rule in either reader (absolute path, string bound, byte bound, depth 4, the 256 count, the spelling check) that its writer can break.
- **Item 6 (e) stop 1: not reached.** The protocol diff has no `+` line:
  - `protocol/skp/SKP-V0.md`: one `-` line, the §11.3 HTML comment (B:1355).
  - `protocol/skp/src/v0/error.rs`: four `-` lines, the `//` comment above `project_file_unwritable` (B:188-191).

### Evidence
None blocking.
- **Coverage finding, closed by a probe: T13b.** The recorded mutation, main's `Json::str(at.to_string_lossy())` restored, also removes the string bound. So T13 fails at the 4,097-byte case (`project_store.rs:163:55`, message `over 4,096`) before it reaches the not-Unicode case. This confirms the worker's report, but it is not where (c) and the test's doc put the failure.
  - My extra probe (T13b′, below) restored lossy conversion and kept the bound. T13 then fails with `not Unicode` at the same line. So the not-Unicode case does catch an altering writer.
  - The closing amendment should record T13b's actual failure site and this probe.

### Documentation (each must be fixed before the merge)
- **D1. The T9 test doc is wrong about where it fails.** At `kernel/tests/project_store.rs:50 at F`, the doc says `Expected failure: the first equality.` The mutation fails the second assert (`project_store.rs:59:5`, `it leaves `same`; the old first is gone`); the `first` equality at :58 passes. This is not the human's wording.
  - Replacement: `/// **T9** (S2-2 (a)). Mutation: the old first kept in `same`. Expected failure: the `same` equality.`
  - Clause check: under the mutation, `moved.first == folder(2)` holds and `moved.same` is `[…\1, …\0]` (my T9 run).
- **D2. The T13 test doc names the wrong failure for (b).** At `kernel/tests/project_store.rs:143-145 at F`, (b) says the expected failure is "the path that is not Unicode is written". This is not the human's wording.
  - Replacement for the (b) clause: `(b) `to_string_lossy` restored; expected failure: the 4,097-byte path is written, since that line has no bound either; with the bound kept, the path that is not Unicode is written.`
  - Clause check: the first part is my T13b run (`over 4,096` at :163). The second part is my T13b′ run (`not Unicode` at :163).
- **D3. The `sync_folder` doc is narrower than the code.** At `kernel/src/project/store.rs:183-185 at F`, the doc says the open is refused "Where it does not (Windows)". The code returns `Ok` on any open error (:189), POSIX ones included. This is not the human's wording.
  - Replacement: `/// Flush `folder` where the platform lets a program open a directory to flush it (POSIX). Where the open is refused (always on Windows, and on POSIX when the folder cannot be opened), there is nothing to flush with: that is `Ok`, and nothing is reported. A flush that fails is an `Err`, which [`Staged::commit`] writes to standard error and refuses nothing over.`
  - Clause check: `File::open(folder)` `Err(_) => Ok(())` is :189. `Ok(dir) => dir.sync_all()` returns its error. `commit_with` sends that error to `eprintln!` (:156-161).
- **D4. The node's plan summary does not name the seam tests.** ADV-2026-11-16-10 R2 (a) and Amendment 30 item 6 (d) ask the summary to name, for each producer, its consumer and the seam's end-to-end test. The summary on main (`governance/PLAN.yaml`, the 1c node's summary) names the producers and their consumer pieces ("for P3a and P3b"), but no seam test. A count of K-O4, K-O11, K-O3 and E-SECOND in it gave 0. This is the custodian's record, not the human's wording.
  - Replacement for the P1b sentence, with names taken from item 6 (d)'s table: `its pre-committed producers are OPEN_LOCK, ProjectLock, try_lock and LockRefused, for open_project's step 3 and Projects::save at a first save (P3a) and the binding's lock state (P3b), seam tests K-O4, K-O5, a_reopen_after_a_session_end_in_the_same_process_takes_the_lock, a_project_saved_first_in_this_process_is_refused_to_another_process_until_its_dataset_closes, E-SECOND and E-CRASH-UNLOCK; with_same with KnownFoldersFull, for the same arm (P3a), seam tests K-O11 and K-O6; moved_to, for the move arm (P3a), seam test a_move_answer_rewrites_folders_json_with_this_folder_first_and_asks_again_at_the_old_path; read_locations with Location, for the machine-location arm (P3a), seam tests K-O3 and a_locations_json_the_reader_refuses_refuses_the_open_by_name_and_is_kept.`
  - I did not read the PR body: `gh pr view` is outside the brief's network list.
- **D5. Class 8 goes in the closing amendment (§2.11 / item 6 (b)).** Two files are over their ceilings: `project_store.rs` (166 of 140) and `mod.rs` (42 of 40). Details are under check 3.
- **D6. `mod.rs` has a third region (item 6 (e) stop 2), disclosed by the worker (report §8 (a)).** The import at `mod.rs:36 at F` was cut to `sha256_hex`. Without that cut, the build gives unused-import warnings, not an error. The closing amendment should record it. Whether it counts as part of the `locations_json` region is the advisor's call (drafts, A2).

### Observation (not blocking)
- **O1. The lock and T14, for P3a.** `ProjectLock::try_lock` creates the identity's folder (`store.rs:233 at F`). If P3a takes it "in `Projects::save` at a first save, before staging" (item 4 (b)) ahead of the document build, T14's "no identity folder" assert (`project_save.rs:1042 at F`) fails. P3a must take the lock after the build, or declare a T14 edit (I3).
- **O2. T6 may depend on timing on Windows.** T6 retakes the lock as soon as `try_wait` sees the child exit (`project_lock_crash.rs:99 at F`). Windows documents the unlock after a process ends as "eventually". It passed on CI windows twice (runs 43832063021 and 44349669441), in the worker's h1 and h2, and up to the mutated point in my T6b run. If it ever flakes, a bounded retry is the fix.
- **O3. Rustdoc nit.** The pub `Staged::commit` doc links the private `sync_folder` (`store.rs:143`). That is a `rustdoc::private_intra_doc_links` warning under `cargo doc`, which no CI job runs.
- **O4. A stale sentence outside the regions.** The `Projects::save` doc's "Every save writes `locations.json`, judges the locators…" lists an order the code does not follow. It is outside item 6 (a)'s regions, so it is not P1b's to change.
- **O5. My departures from the brief:**
  - I ran `gh run list --branch cut/b2-piece-1c-p1b` (network outside the brief's list) to answer check 9's "every red or cancelled run on the branch".
  - I added one probe, T13b′, beyond (c)'s mutations, to settle the T13b coverage question.
  - The string-bound mutation, the same text for T12a, T13a and T14a, was applied once and run on two targets (project_store, then project_save) before one revert.

## Checks

1. **Start.**
   - fetch rc 0.
   - `<W>` HEAD is F, and the porcelain is 0 bytes.
   - `ls-remote` gives F.
   - `df`: C: 49G free, D: 370G free.
2. **The diff** (`diff --numstat B...F`, rc 0):
   - Seven files, equal to item 7's P1b list: mod.rs 15/27, store.rs 277/16, project_lock_crash.rs 102/0, project_save.rs 71/0, project_store.rs 166/0, SKP-V0.md 0/1, error.rs 0/4.
   - No `Cargo.toml` and no lockfile: `git diff --quiet` over the three lockfiles and `**/Cargo.toml` gave rc 0.
   - `git diff --name-only B origin/main -- kernel protocol engine` gave rc 0 and empty output.
   - Three commits: a374590c, 1284ccda, 1ad509ad.
3. **§2.11's command, verbatim, over B...F** (rc 0): 631 added and 48 deleted, 679 lines in 7 files, against 710 and 7.
   - The worker's group sums (335 = 293 + 42) count both columns, so both columns count.
   - Kernel product: 335 of 340. Inside it, store.rs is 293 of 300 and **mod.rs is 42 of 40, over**.
   - Protocol: 5 of 10.
   - Kernel tests: 339 of 360. Inside it, project_lock_crash.rs is 102 of 130, project_save.rs is 71 of 90, and **project_store.rs is 166 of 140, over**.
   - Both of the worker's figures are confirmed. The groups and the piece hold.
4. **The change.**
   - **Regions.** store.rs stays inside item 6 (a)'s items. mod.rs has its two regions plus the import (D6). The protocol files hold only the two comment removals.
   - **`pub` items added** (grep over the source diff, rc 0): OPEN_LOCK, ProjectLock, try_lock, LockRefused, KnownFoldersFull (and `count`), with_same, moved_to, Location (and `dataset`, `path`), locations_to_bytes, read_locations. All are in item 6 (a) and (d), and each doc names item 6 (d) and its consumer.
   - **Caller grep** (kernel/src, src-tauri/src, engine/src, protocol). The only product callers are `mod.rs:294` (`locations_to_bytes`) and `store.rs:147` (`commit_with`). The rest have no product caller yet, as item 6 (d) pre-commits. No other `pub` item was added.
   - **Item 4 (a), clause by clause.** The writer's 4,096-byte bound and the refusal of a path that is not valid Unicode: see Correctness.
   - **What the user is told.** The shell shows `notSavedNotice(failure.message)`, "[P6 placeholder] The project was not saved: " followed by the kernel's message (`frontends/shell/src/project/saveProject.ts:39,103,118`). The kernel's message is "the project file would break a rule its reader holds: {path}: {rule}" (`error.rs:205`).
     - The shell strings do not change.
     - New `rule` texts do reach the user: "a path of {n} bytes, over the ceiling of 4096" and "the document is {n} bytes, over the ceiling of 2097152".
     - "{path} is not an absolute UTF-8 path" can now also name `locations.json`.
     - The prefix "the project file would break a rule" is not accurate when the file is `folders.json` or `locations.json` (drafts, A1).
   - **The lock and the write order:** see Correctness, with lines.
5. **The tests and the predictions.**
   - T6 to T14 stand at F in the files item 6 (c) names, and each asserts what (c) says. T14 is Windows-only by a run-time check (`project_save.rs` T14 body).
   - **P-base** rests on the worker's logs: `p1b-pbase-rc.txt` names a374590c22466f5c1f4ddc4e0312da4efa5076e0, and all four runs give rc 101.
     - lib: E0599 `commit_with`.
     - project_lock_crash: E0432 `LockRefused`, `ProjectLock`, `OPEN_LOCK`.
     - project_save: E0432 `read_locations`, `Location`.
     - project_store: E0432 and E0599 on `locations_to_bytes`, `read_locations`, `KnownFoldersFull`, `Location`, `with_same`, `moved_to`.
     - The logs predate the 1284ccda commit, and the reported line numbers (store.rs:303 for T7) fit a tree with no product code.
     - I had no doubt, so I did not reproduce it, and I did not create `C:/dev/wt/1c-p1b-g331r`.
   - **T7, T12 and T14 against main's behaviour.** The report shows this only through mutations that restore main's behaviour: T7's (the flush error returned), T12a and T12b (the bounds main lacked), T14a and T14b (main's missing bound, and main's order). There is no run at main, where the tests cannot compile.
6. **Mutations.** 13 of (c) plus one probe; details below. All but T13b fail where (c) says. The list matches (c) and the worker's script `p1b-mutate.mjs`. T13b is the one the report holds differently, and it is confirmed as reported.
7. **The runs.**
   - **Reused:**
     - The worker's h2 at 1ad509ad (`p1b-phead-h2-*.log`): project_lock_crash 1 passed, project_save 19 passed, project_store 5 passed, lib `project::store` 1 passed with 192 filtered, rc 0 for both.
     - `cargo fmt --check` rc 0. This rests on `p1b-fmt7.log`, empty and written after 1ad509ad, though the report does not name the log. CI's Rust fmt also passed at F (runs 43832063007 and 44349669815).
     - The tester's E-SAVE at F's tree (`p1be-e-save.log`): its first line names head F, it has 12 `PASS (` lines, and it ends with `rc=0 end 2026-11-18T17:14:17Z`.
   - **Reproduced:** none. I had no stated doubt.
   - Every mutation run of mine was at F with one mutation applied. None was timing-sensitive.
8. **Light runs** in `<W>`:
   - `verify-test-claims.mjs`: rc 0, "verify:test-claims PASS — all 826 claimed test(s) across 271 file(s) …".
   - `verify.mjs --offline`: rc 0, "verify:plan PASS".
9. **CI**, read at 2026-11-18T17:23:08Z. `gh pr checks 331`: rc 0, all 20 rows pass.
   - **Push runs at F:** 43832063021 (Rust workspace), 43832063007 (fmt), 43832063047 (governance), 43832063078 (ported notices), 43832063189 (shell).
   - **pull_request runs at F:** 44349669441, 44349669815, 44349670313, 44349669467 (DCO), 44349669480 (exposure), 44349669476, 44349669509.
   - `gh run view` headSha is 1ad509ad… for all twelve.
   - **Red on the branch:** 43821156061, Product CI Rust workspace at a374590c, failed on all three platforms (windows, ubuntu, macos). This is expected: the tests were committed before the product code (the P-base commit).
   - No cancelled run. All of 1284ccda's five runs are green.
10. **End.**
    - `<W>` HEAD is F, and the porcelain is 0 bytes.
    - store.rs sha256 ab70da4ac70697f38aa38531bb4892ffefeae4bbabaaf3cce3914a3d9e5df63b and mod.rs 1c50b3f3d3d3b2fb1729527bbc6f14d47d6409b94e6d220af15df2a84b3f7949, each equal to `git show F:<file>`.
    - `C:/dev/wt/1c-p1b-g331r` was not created.
    - `df`: C: 49G free, D: 370G free.

## Mutations

Each was applied in `<W>` by one anchored `node -e` command, which refused unless its anchor occurred exactly once; every apply gave rc 0. Each was run as `cargo test -p spatial-kernel --test <target>` (or `--lib project::store`) in its own hold. Each was reverted by `git checkout -- <file>`: rc 0, `git diff` 0 bytes, and the file's sha256 equal to F's (the values above). Every run exited 101. In the project_store and project_save runs, only the named test failed.

- **T6a**, store.rs: `match file.try_lock() {` becomes `match Ok::<(), TryLockError>(()) {`. Target project_lock_crash.
  - Failed: `the_project_lock_is_refused_while_held_in_this_process_and_in_another_and_freed_by_a_crash`.
  - `panicked at kernel\tests\project_lock_crash.rs:57:5:` / `a second take in this process`.
- **T6b**, store.rs: from `pub struct ProjectLock {` to the end of `impl Drop`, replaced by a `create_new` marker on `OPEN_LOCK`, with Drop removing it (the worker's text). Target project_lock_crash.
  - Failed: the same test.
  - `panicked at kernel\tests\project_lock_crash.rs:99:56:` / `taken after the child's crash: Held`.
- **T7**, store.rs: the `if let Err(e) = flush(&self.folder) { eprintln!(…) }` block becomes `flush(&self.folder).map_err(unwritable("the project folder"))?;`. Target `--lib project::store`.
  - Failed: `project::store::tests::a_folder_flush_failing_after_the_rename_keeps_the_save`.
  - `panicked at kernel\src\project\store.rs:529:37:` / `the save is kept: Unwritable { what: "the project folder", source: Custom { kind: Other, error: "the flush failed" } }`.
- **T8**, store.rs: in `with_same`, the refusal becomes `next.same.remove(0);`. Target project_store.
  - Failed: `a_same_answer_past_256_known_folders_is_refused_and_the_folders_are_unchanged`.
  - `panicked at kernel\tests\project_store.rs:46:5:` / `assertion `left == right` failed`, with right `Err(KnownFoldersFull { count: 256 })`.
- **T9**, store.rs: `same: same.cloned().collect(),` becomes `same: same.cloned().chain([self.first.clone()]).collect(),`. Target project_store.
  - Failed: `a_move_makes_this_folder_first_and_forgets_the_old_first`.
  - `panicked at kernel\tests\project_store.rs:59:5:` / `assertion `left == right` failed: it leaves `same`; the old first is gone`.
- **T10**, store.rs: `read_locations` becomes `Ok(read_locations_strict(bytes).unwrap_or_default())` over the renamed strict body. Target project_store.
  - Failed: `a_locations_json_the_reader_refuses_is_named`.
  - `panicked at kernel\tests\project_store.rs:96:55:` / `a wrong format: []`.
- **T12a / T13a / T14a**, store.rs `stored_path`: `Some(s) if p.is_absolute() && s.len() <= max => return Ok(s),` becomes `Some(s) if p.is_absolute() => return Ok(s),`.
  - **project_store:** two tests failed.
    - `the_locations_writer_refuses_what_its_reader_refuses_and_reads_back_the_rest`: `panicked at kernel\tests\project_store.rs:163:55:` / `over 4,096: […]`.
    - `a_folder_path_the_folders_reader_would_refuse_is_refused_when_written`: `panicked at kernel\tests\project_store.rs:121:37:` / `over 4,096: […]`.
  - **project_save:** `a_save_whose_folder_path_folders_json_cannot_hold_is_refused_by_name_and_writes_nothing` failed. `panicked at kernel\tests\project_save.rs:1035:10:` / `refused: Saved { project: ProjectUri("spatial://project/725a15abb5a7abce5ad7a78d8c8493ff"), history_mark: Withheld(NoStepRecorded), carried: MachineRecordedOnly(Outside) }`.
- **T12b**, store.rs: `if text.len() > FOLDERS_LIMITS.max_bytes {` becomes `if false {`. Target project_store.
  - Failed: `a_folder_path_the_folders_reader_would_refuse_is_refused_when_written`.
  - `panicked at kernel\tests\project_store.rs:129:38:` / `over the byte bound: […]`.
- **T13b**, store.rs: `("path", Json::str(stored_path(at, LOCATIONS, max)?)),` becomes `("path", Json::str(at.to_string_lossy())),`. Target project_store.
  - Failed: `the_locations_writer_refuses_what_its_reader_refuses_and_reads_back_the_rest`.
  - `panicked at kernel\tests\project_store.rs:163:55:` / `over 4,096: […]`.
  - This is the 4,097-byte case, not the not-Unicode case (Evidence above).
- **T13b′ (my probe)**, store.rs: the same anchor becomes `("path", Json::str(stored_path(Path::new(&*at.to_string_lossy()), LOCATIONS, max)?)),`. Target project_store.
  - Failed: the same test.
  - `panicked at kernel\tests\project_store.rs:163:55:` / `not Unicode: […]`.
- **T11**, store.rs: `&["dataset", "path"]` becomes `&["dataset", "location"]`. Target project_save.
  - Failed: `the_locations_reader_reads_back_what_a_save_writes`.
  - `panicked at kernel\tests\project_save.rs:1002:39:` / `the reader accepts what the save wrote: MachineRecordRefused { file: "locations.json", rule: "$.entries[0].path: an unknown member" }`.
- **T14b**, mod.rs: the `create_dir_all(&dir)` line is moved to just after `let machine = …`, before the build. Target project_save.
  - Failed: `a_save_whose_folder_path_folders_json_cannot_hold_is_refused_by_name_and_writes_nothing`.
  - `panicked at kernel\tests\project_save.rs:1042:5:` / `no identity folder`.

## Holds

There were 13 shared holds, each one Bash call in background mode. Each printed `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:<pid> also=<m> …` and then `MACHINE_RELEASED project=<m> …`. There were no MACHINE_WAITING or MACHINE_ERROR lines, no exit codes from 96 to 99, and no WAIT_TIMEOUT.

The times are `date -u` stamps: the first is taken just after launch, the second when the notification was read. Each hold lies inside its pair.

| Hold | Run | Start | End |
|---|---|---|---|
| 1 | T6a | after 17:22:46 | ≤17:24:12 |
| 2 | T6b | ≤17:24:37 | ≤17:25:20 |
| 3 | T7 | ≤17:25:38 | ≤17:26:18 |
| 4 | T8 | ≤17:26:32 | ≤17:27:18 |
| 5 | T9 | ≤17:27:33 | ≤17:28:12 |
| 6 | T10 | ≤17:28:30 | ≤17:29:05 |
| 7 | T12a/T13a | ≤17:29:24 | ≤17:29:57 |
| 8 | T14a | ≤17:30:10 | ≤17:30:38 |
| 9 | T12b | ≤17:30:52 | ≤17:31:32 |
| 10 | T13b | ≤17:31:49 | ≤17:32:33 |
| 11 | T13b′ | ≤17:32:53 | ≤17:33:44 |
| 12 | T11 | ≤17:33:59 | ≤17:34:38 |
| 13 | T14b | ≤17:35:07 | ≤17:35:44 |

All times are UTC on 2026-11-18.

## Drafts for the advisor

- **A1. Words the user sees (ADV-2026-11-16-16 item 2 (a); P6).** P1b adds no shell string, but the kernel's message, shown inside the not-saved notice, now carries new `rule` texts. Changing them is not P1b's: the prefix is a protocol line beyond item 6 (a)'s two comments (stop 1). Drafts for P3b or P5, the advisor to place:
  - (i) `error.rs:205`'s message: "a file of the save would break a rule its reader holds: {path}: {rule}". Clause check: `path` is a project-file member (`mod.rs:458-459`) or a machine-store file name (`mod.rs:463`); "a file of the save" covers both.
  - (ii) `stored_path`'s refusal (`store.rs:313`) split in two: `Some(_)` gives "{path} is not an absolute path", and `None` gives "{path} is not valid Unicode". Clause check: the `_` arm is reached by `to_str()` being `None` or by `!is_absolute()`.
  - P5's drafter also says whether the limitations owe a line for the new refusals (item 4 (a)).
- **A2.** Is the `mod.rs:36` import cut (D6) part of the `locations_json` region, or a third region recorded under item 6 (e) stop 2?
- **A3.** O1, the lock and T14, should be declared in P3a's amendment.

## Background shells
None left. All 13 background hold calls completed, each with exit 101 from cargo. I killed nothing.

## Model
Opus 5.5 (claude-opus-5-5), as the harness reports.

Paths: the worktree is `C:/dev/wt/1c-p1b`, and my scratch logs are in `<S>` under `g331r-*` (`g331r-mut-<id>.log`, `g331r-count.txt`, `g331r-runs.txt`, `g331r-runlist.txt`).
