*Custodian's filing note (2026-11-14): the worker's report for slot 2's `second-open-history-before-1c-step-3`: the fix commit C1b on C1, the checks and the records commit C2, under the advisor's ruling ADV-2026-11-14-04 (the form's Amendment 1), from its brief by file (15992 bytes, sha256 000644c2c2b713db36466a8db6e57e1b2db141c2c9c41e0c76c0d5b988e1b49d). Dispatched at 2026-11-14T04:03:17Z by its transcript; handed back at 2026-11-14T06:13:24Z (claude-sonnet-5-5, worker-high; calls Bash 147, Read 7, Edit 3, Write 6 and the hand-back, 164 in all). Five Bash calls exited non-zero, at 04:16:17Z, 04:16:24Z, 04:45:17Z, 06:02:36Z, 06:05:23Z; each read a run's log or return-code file while the run went on. Its Write and Edit calls are scratch files and, in its worktree, `kernel/src/session_history.rs`. Its push was a call of its own, at 2026-11-14T06:10:58Z. At this filing the custodian read the remote branch at 5e6b79bc0d0f423293b312140788044fab1de106, equal to the worktree's head, whose parent is C1b 882450cf5a17ba13ecc4a59f9a22b1e76856c726, with its porcelain empty. The report below was extracted by script from the hand-back in that transcript (28276 bytes, sha256 b96d042180b15ed9aa79b35197e28d049706fb8d676c6d530e4c6d19169795b7). One change, the custodian's: on its line 57 the cite of line 514 of the branch's kernel test file `project_save_skp.rs` is written without its leading folders, since main's copy of that file has fewer lines; the line is the branch's, at 5e6b79bc. The form's Amendment 2 records the result.*

---

Built: second-open-history-before-1c-step-3 at 5e6b79bc0d0f423293b312140788044fab1de106

Pushed. origin's branch equals HEAD, the porcelain is empty, nothing of mine is running, and no PR was opened. I am Sonnet 5.5 (claude-sonnet-5-5), worker-high, with no model override and no context handoff.

## 1. Start state, resources, S0
- The brief sha256 matched. The form sha256 matched a6c25cbc... at main 8a102e66, so no §10 amendment beyond Amendment 1.
- Worktree `C:/dev/wt/so` was at a2fbab2ca5ddda114ca18cd94392198b30dd94c1 on `cut/second-open-history-before-1c-step-3`. Its parent was 695e1303794ed390d305d07fca592694f33f589e. `ls-remote` and the porcelain were both empty. Free space was 44 GB on C: and 169 GB on D:.
- Resources, all present:
  - `renderer/bundle-viewer/dist/` holds `NOTICE.txt` (163998), `app.js` (333011) and `index.html` (6463).
  - `renderer/bundle-viewer/viewer-asset-hashes.json` is 261 bytes.
  - `frontends/shell/src/generated/NOTICE.txt` is 3506979 bytes.
- S0, `git diff --name-only origin/main...<b>`:
  - `origin/cut/b1-shell-half-pr-b`: 16 files, all under `frontends/shell/src/`.
  - `origin/cut/port-2-macos-l1-and-app-dirs`: `.github/workflows/product-ci-rust.yml`, `KNOWN-LIMITATIONS.md`, `engine/src/app_dirs.rs`, `engine/src/lib.rs`, `engine/src/lod.rs`, four `engine/tests/lod_tier_*.rs`, `kernel/PERMISSION-BOUNDARY.md`, `kernel/src/permission/audit/log.rs`, `kernel/tests/app_data_dir_resolution.rs`, `kernel/tests/case_policy_volume.rs`, `scripts/plan/cfg-boundary.mjs`, `scripts/plan/cfg-boundary.test.mjs`.
  - local `cut/pan-anchor-setcam-waits-for-its-own-reset`: `frontends/shell/e2e/pan-anchor.mjs`.
  - `gh pr list --state open --json number,headRefName` returned `[]`.
  - No branch names `protocol/` or a §2.5 path other than `KNOWN-LIMITATIONS.md`.
  - Port-2's `KNOWN-LIMITATIONS.md` hunks (`git diff -U0`) are lines 30 and 32 (item 1) and line 400 (item 43), the expected ones.

## 2. C1b
- Commit 882450cf5a17ba13ecc4a59f9a22b1e76856c726, `fix: the worst-case header test passes the header's project argument`. It touches `kernel/src/session_history.rs` only (5 added, 2 deleted).
- The diff:
```
-        let header =
-            canonical(&header_object(DatasetRef::parse(&entry).unwrap().to_json())).unwrap();
+        let header = canonical(&header_object(
+            DatasetRef::parse(&entry).unwrap().to_json(),
+            None,
+        ))
+        .unwrap();
```
- The workspace run on that tree exited 0, so no second in-lib compile error turned up and there was no repeat. It had 122 result lines, 1077 passed, 0 failed, 66 ignored. The kernel lib line was `188 passed; 0 failed; 1 ignored`. Baseline was 1074, so the difference is N1 to N3.
- The committed blob d7f3a53b equals the blob that run tested.
- U7's two lengths came from a probe test, `soc2_probe_u7_header_lengths`, in the tests module. It was never committed and was reverted. It printed `SOC2PROBE none=443423 some=443403 uri=50 ceiling=1048576`.
  - With `None`, U7's header is 443,423 bytes. With a project URI as the code spells one (`spatial://project/` plus 32 hex, 50 bytes), it is 443,403 bytes.
  - `None` is longer by 20 bytes, so the test still builds the longer header and I did not stop.
  - After the revert, `git diff` showed only C1b's change.

## 3. C1's checks at C1b
All exit 0, except verify-test-claims at C1b (below).
- Three kernel files: 17 passed in `project_save`, 6 in `project_save_skp`, 13 in `session_history`.
- `npm run verify` in `frontends/shell`: Vitest 112 files and 1459 tests passed. The other suites printed `76 passed, 0 failed` and `30 passed, 0 failed`.
- Shell `cargo test`: 76 passed in the lib, 0 in main, 2 in `sole_caller_scan`, 0 in the doc tests.
- `cargo fmt --all -- --check` and `cargo fmt --manifest-path frontends/shell/src-tauri/Cargo.toml -- --check` both 0.
- `node --test` over the three globs: 598 pass, 0 fail. This ran outside a hold; see the departures.
- `verify-cites`: PASS. `verify-quotes` (in a hold): PASS, `156 checked, 125 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors`. `verify.mjs --offline`: PASS.
- `verify-test-claims` at C1b exited 1 with 1 finding, as expected: `B2-1B-RECORDING-PREREGISTRATION.md:533 ... a_reopen_of_the_same_file_continues_its_record_and_another_file_starts_its_own — not found in any test file`. K-S15's old name at `B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:1668` appeared as `planned`, advisory. The whole output is in `<S>/soc2-vtc-c1b.log`, 62 lines.

## 4. Mutations M1 to M6, at C1b
For every mutation the anchor occurred once. The table command exited 101, the revert exited 0, the table command after the revert exited 0, `git diff` was 0 bytes, and the porcelain was empty. Each mutation was killed by the predicted test at the predicted assertion, so nothing survived.

| id | table command, failing assertion byte-copied | every test failing across the three files (`--no-fail-fast`) |
|---|---|---|
| M1 | `kernel/tests/session_history.rs:367` panicked, `left: 1`, `right: 2`: `assert_eq!(` / `records(&store).len(),` / `2,` / `"the unbound reopen starts its own record"` | `an_unbound_reopen_of_the_same_file_starts_its_own_record_and_another_file_its_own` only |
| M2 | `kernel/tests/project_save_skp.rs:449`: `assert_eq!(length(), kept, "A's record, after the second open's step");` (`left: 2657`, `right: 1861`) | K-S15 (`a_second_open_of_one_file_saved_to_another_folder_writes_its_own_mark_and_leaves_the_first_record_unchanged`) and N2 (`a_save_made_before_any_step_binds_the_open_and_a_later_open_saved_elsewhere_keeps_its_own_record`, at `project_save_skp.rs:534`) |
| M3 | `kernel/tests/project_save.rs:590`: `assert_eq!(` / `file_names(&rig.sessions),` / `std::slice::from_ref(&hex),` / `"only the project's record, and no unsaved- one"` | N1 (`a_step_after_a_save_made_before_any_step_goes_to_the_projects_record_under_the_projects_dataset_identity`) and N3 (`the_project_files_dataset_uri_is_the_histories_dataset_uri_whichever_comes_first`, at `project_save.rs:465`) |
| M4 | `project_save_skp.rs:514`: `Withheld` against `Written`, message `the step went to A's record, so the later save marks it` | N2; in `project_save`: N1 (590), `a_save_after_a_recorded_match_marks_only_a_workspace_holding_that_match` (797), `the_first_save_moves_the_record_under_the_project_identity` (549) and N3 (671) |
| M5 | `kernel/tests/project_save.rs:672`: `assert_eq!(seen[0], file, "the header's URI: {name}");`, step-first order | N1 (620) and N3 |
| M6 | `kernel/tests/project_save.rs:618`: `assert_eq!(lines[0]["project"], first.project.as_str());` | N1 and N2 (at `project_save_skp.rs:552`) |

The table commands are the form's §4 commands, with M1 and M2 using the new test names.

## 5. Commits
- **C1b** is 882450cf5a17ba13ecc4a59f9a22b1e76856c726 (above).
- **C2** is 5e6b79bc0d0f423293b312140788044fab1de106, `docs: KNOWN-LIMITATIONS items 63 and 43 as draft text, and a superseded row for each renamed test`. Its committer time is `2026-11-14T07:10:35+01:00`.
  - Files: `KNOWN-LIMITATIONS.md` (5 added, 4 deleted), `governance/forms/kernel/B2-1B-RECORDING-PREREGISTRATION.md` (4 added) and `governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md` (4 added).
  - Both forms' last amendments were 13 and 28 before the append, so the new numbers 14 and 29 were right. Each file ends with one LF.
  - The workspace run on C2's working tree exited 0 before the commit: 122 result lines, 1077 passed, 0 failed, 66 ignored.
  - `verify-test-claims` exits 0 and reports `all 803 claimed test(s) ... (25 planned, 16 superseded, 17 withdrawn, advisory)`. Its superseded list went from 14 to 16 and shows both rows: the 1b `:533` row and the 1c `:1668` row, each `pinned by ... @ 8c693657801fd4168b078a601724bdacd9f479b8 sha256:ab570914...` and `sha256:364f456d...`.
  - `verify-cites` exit 0, PASS. `verify-quotes` exit 0, PASS, same counts as at C1b. `verify.mjs --offline` exit 0.

## 6. The count
`git diff --numstat 695e1303794ed390d305d07fca592694f33f589e HEAD` (added, deleted):
- `KNOWN-LIMITATIONS.md` 5, 4
- `B2-1B-RECORDING-PREREGISTRATION.md` 4, 0
- `B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md` 4, 0
- `kernel/src/project/mod.rs` 20, 21
- `kernel/src/session_history.rs` 165, 97
- `kernel/tests/project_save.rs` 124, 0
- `kernel/tests/project_save_skp.rs` 154, 54
- `kernel/tests/session_history.rs` 31, 34
- `protocol/skp/SKP-V0.md` 10, 2
- `protocol/skp/src/v0/commands.rs` 3, 4
- Total: 520 added, 216 deleted, 736 changed.

The 7 code, test and protocol files make 719 changed lines against §7's estimate of about 530. C1 alone was 712, and C1b adds 7. I did not trim the overrun.

## 7. Words, byte-copied from the committed files
**§8 note** (`protocol/skp/SKP-V0.md:1150-1156`, appended before `## 9.`):
```
### Note: a second open of one file saved to another folder is marked in its own record (2026-11-14; no literal change)

**`skp/0.13` stands; no literal is bumped and no fixture changes.** §11's `save_project` reply for one case changes from `withheld` to `written`, and no key, value or command is added or removed.

- **The case.** A file is opened and a step is recorded; the open is saved to a folder; the dataset is closed and the same file is opened again; a step is recorded on the second open, and the second open is saved to another folder. That save replied `history_mark: "withheld"` before, because the history kept one record for the file and a project already held it. It replies `"written"` now when the second open's recorded steps reach the saved workspace, as for any save: the second open has a record of its own, which the save binds to the new project and marks.
- **What did not change.** The values `written` and `withheld` and the reply shape are as before. `protocol/data-plane/` has an empty diff.
- **Where the sentences are.** §11.2's `history_mark` paragraph and §11.3's "Every save" bullet are brought current in place.
```
`git diff --stat 695e1303 HEAD -- protocol/data-plane` is empty.

**§11.2 `history_mark`**, before then after:
- Before: `- **`history_mark`** says whether the session history took the `saved-here` mark. The project file was written in both cases. `withheld` means the history holds no recorded step for the dataset, the history's record for the dataset's file belongs to another project this run has saved, the recorded steps do not reach the saved workspace, or the history could not take the record move or the line.`
- After: `- **`history_mark`** says whether the session history took the `saved-here` mark. The project file was written in both cases. `withheld` means the history holds no recorded step for this open of the dataset, the recorded steps do not reach the saved workspace, or the history could not take the record move or the line.`

**§11.3 "Every save"**, only its tail changed. Both versions share the opening: `Every save judges which locators ... A refusal leaves the previous file in place.`
- Before, tail: `Only then does the history take its moves: the record move, when the history holds a record for the file and no project holds it yet, and a `saved-here` mark when the recorded steps reach the workspace and no other project holds the record.`
- After, tail: `Only then does the history take its moves: the open is bound to the project, and the record the open already has, if it has one, moves under the project's identity; then a `saved-here` mark is written in the project's record when the recorded steps reach the workspace. Each open of a dataset has a record of its own until a save binds it to a project, so a second open of one file that is saved to another folder is bound to its own project and marked in its own record.`

**`HistoryMarkState` rustdoc** (`protocol/skp/src/v0/commands.rs`):
- Before:
```
/// Whether the session history took the `saved-here` mark. The project file was written in both
/// cases; `withheld` says that the history holds no recorded step for the dataset, that the
/// history's record for the dataset's file belongs to another project this run has saved, that the
/// recorded steps do not reach the saved workspace, or that the history could not take the record
/// move or the line.
```
- After:
```
/// Whether the session history took the `saved-here` mark. The project file was written in both
/// cases; `withheld` says that the history holds no recorded step for this open of the dataset,
/// that the recorded steps do not reach the saved workspace, or that the history could not take the
/// record move or the line.
```

**KNOWN-LIMITATIONS item 43** (`KNOWN-LIMITATIONS.md:436`; the approved comment at line 437 is untouched; the DRAFT comment is the new line 438):
```
**43. A crash leaves the session's filter and style changes on this machine, and nothing offers them back yet.** While the app runs, each filter you apply and each style change you commit is kept in a file in the app's data folder on this machine: on Windows under `%LOCALAPPDATA%\spatial-ide\sessions`, on macOS and Linux under `~/.local/share/spatial-ide/sessions` unless `XDG_DATA_HOME` is set. A normal close removes it. If the app crashes or is ended from outside, the file stays, and this version neither offers to recover it nor removes it. It holds the filter text you typed and your style values, at most 32 MiB in each file the app keeps, and nothing in the app sends it anywhere. The app keeps one file for each open of a dataset that has had a filter or style change, until a save binds that open to a project, and one file for each project from then on; a second open of the same file is another open. This version sets no limit on how many files a run makes, so the disk space they take in one run grows with the number of opens that have had a change.
<!-- DRAFT wording for the advisor's ruling under the delegation of 2026-11-13, not the human's own wording and not yet the advisor's ruled wording (governance/forms/kernel/SECOND-OPEN-HISTORY-BEFORE-1C-STEP-3-PREREGISTRATION.md, section 2.6 (OPEN-N5) and section 7). Only the clause about the ceiling is changed from the item the human approved, which is the comment above this one: the ceiling held for one dataset in one run before the kernel kept a record for each open, and it holds for each record now. Where the code does this, at C1: kernel/src/session_history.rs:48 @ a2fbab2ca5ddda114ca18cd94392198b30dd94c1 sha256:54c24ae910a5744c29761e92bd95812b704774b56373e715579f52e1d31da9c4 (the ceiling, 33,554,432 bytes); kernel/src/session_history.rs:77-90 @ a2fbab2ca5ddda114ca18cd94392198b30dd94c1 sha256:37f50b2940a767a6e7aa66258e083c4bf74c0cc56e3dd2248312b7d975438089 (each history file is given the ceiling) and kernel/src/session_history.rs:94-119 @ a2fbab2ca5ddda114ca18cd94392198b30dd94c1 sha256:666583c88871a71e4f1816bb175221bed5e5bfab3fc538650e8b53f8f8bcd199 (a line that would take the file past it is refused, for that file alone); kernel/src/session_history.rs:151-160 @ a2fbab2ca5ddda114ca18cd94392198b30dd94c1 sha256:98ce0c03a29e0dace5c7dc068ac6edb30611b5e2c6d30b28542f073e96ceab00 (a record is one history file, with the holder it belongs to); kernel/src/session_history.rs:122-128 @ a2fbab2ca5ddda114ca18cd94392198b30dd94c1 sha256:c505e3231bd0da1e3e273074b1732ebe631f9c242e342e9099366ad49db6e7a2 (the holder is an open until a save binds it, then a project); kernel/src/session_history.rs:141-149 @ a2fbab2ca5ddda114ca18cd94392198b30dd94c1 sha256:da9030385015a075110861ce446d786dd443cbfefda12d8d71f885e21106787b (an open's holder); kernel/src/session_history.rs:300-316 @ a2fbab2ca5ddda114ca18cd94392198b30dd94c1 sha256:f6887a551bdaea52ccfe249cfe2d37e1aab0eec2d426130296783d5a89e94eb3 (a step goes to the record its open's holder holds, and the record is created at the holder's first step; the only use of the records' count is the index of the record just made, so no line bounds how many records or opens a run has); kernel/src/session_history.rs:438-451 @ a2fbab2ca5ddda114ca18cd94392198b30dd94c1 sha256:2060267d8559503cfc5257ac854ea7c1fe01c616ef145a137f67066d767029bd (a record held by an open gets a new folder of its own, and one held by a project gets the project's); kernel/src/session_history.rs:343-365 @ a2fbab2ca5ddda114ca18cd94392198b30dd94c1 sha256:2ddcedcfabe09c8d8fd2a547cf638d0d64b3f5b5d032fc7d623439d0c9230645 (a save moves an open's own record under its project, and a save made before any step makes no record); kernel/src/session_history.rs:403-412 @ a2fbab2ca5ddda114ca18cd94392198b30dd94c1 sha256:482d927f1974e8a11d09bc34b56b8143da61b5341739c9203193e14e72dfcdba (a normal close removes every record the run made). Not covered: how many opens a run holds in practice, and the size of a file below the ceiling. -->
```

**KNOWN-LIMITATIONS item 63** (`KNOWN-LIMITATIONS.md:507-509`). It is drafted as a rewording; the comment names withdrawal as the alternative.
```
63. **A file opened again in the same run keeps its steps in a history file of its own, apart from the earlier open's.**
    The session history keeps one file for each open of a dataset, from the first filter or style change recorded on that open. A file opened again in the same run is another open, so it does not continue the earlier open's file, whether or not the earlier open has been saved or closed. A save of an open binds it to the project that save makes: the open's file, if it has one, is moved under that project's identity, and the open's later changes are written there. A save made before the open has any change binds it as well, and its first change is then written in the project's file. A second open that is saved to another folder is therefore bound to its own project and writes its own `saved-here` mark in its own file, and the first project's file is not written to by that save.
    <!-- DRAFT wording for the advisor's ruling under the delegation of 2026-11-13, not the human's own wording and not yet the advisor's ruled wording (governance/forms/kernel/SECOND-OPEN-HISTORY-BEFORE-1C-STEP-3-PREREGISTRATION.md, section 2.6 (OPEN-N5); the number is the one the item had). This draft replaces the item the human did not approve in words, which described a second open that got a project file and no mark: that case no longer occurs. The draft is for rewording; if the advisor withdraws the item instead, the item and this comment are deleted and the number is not reused, and item 43's sentence on the files a run makes carries the one fact that stays true. Where the code does this, at C1: kernel/src/session_history.rs:122-128 @ a2fbab2ca5ddda114ca18cd94392198b30dd94c1 sha256:c505e3231bd0da1e3e273074b1732ebe631f9c242e342e9099366ad49db6e7a2 (the holder of a record is an open until a save binds it, then a project); kernel/src/session_history.rs:141-149 @ a2fbab2ca5ddda114ca18cd94392198b30dd94c1 sha256:da9030385015a075110861ce446d786dd443cbfefda12d8d71f885e21106787b (an open's holder is its project once bound, and the open until then); kernel/src/session_history.rs:300-316 @ a2fbab2ca5ddda114ca18cd94392198b30dd94c1 sha256:f6887a551bdaea52ccfe249cfe2d37e1aab0eec2d426130296783d5a89e94eb3 (a step goes to the record its open's holder holds, and a second open has a different holder from the first); kernel/src/session_history.rs:343-365 @ a2fbab2ca5ddda114ca18cd94392198b30dd94c1 sha256:2ddcedcfabe09c8d8fd2a547cf638d0d64b3f5b5d032fc7d623439d0c9230645 (the save binds the open, moves the open's own record under the project if it has one, and makes no record if it has none; nothing happens for an open already bound); kernel/src/session_history.rs:374-399 @ a2fbab2ca5ddda114ca18cd94392198b30dd94c1 sha256:1e5647d572d90780a63ba19b2451419eda1b6774ff4f823f61313d9a0e29e1ae (the mark is written in the record the saving project holds, and no check refuses a record that another project holds); kernel/src/session_history.rs:438-451 @ a2fbab2ca5ddda114ca18cd94392198b30dd94c1 sha256:2060267d8559503cfc5257ac854ea7c1fe01c616ef145a137f67066d767029bd (a record held by a project gets the project's folder and a header that names the project); kernel/src/project/mod.rs:242-255 @ a2fbab2ca5ddda114ca18cd94392198b30dd94c1 sha256:3ef15aa52f5a2c9e9d581f312430d128648a2e1a8e3db243105c13ba1c9706c7 (a first save gives the project file's dataset the open's one identity) and kernel/src/project/mod.rs:353-374 @ a2fbab2ca5ddda114ca18cd94392198b30dd94c1 sha256:7d170a200c464ce7710b4b9a163555916e21a2f1b4ad716499f0c4052241fc26 (the save calls the bind, then the mark). The test is a_second_open_of_one_file_saved_to_another_folder_writes_its_own_mark_and_leaves_the_first_record_unchanged in kernel/tests/project_save_skp.rs. Not covered: a reopen of a saved project, which is a later step of the work, and a crash between the move and the removal of the old folder. -->
```

**The two rows**, appended at the end of each form:
```
### Amendment 14 — K5 renamed by second-open-history-before-1c-step-3 (class 1, a reference and its hash only)

1. governance/forms/kernel/B2-1B-RECORDING-PREREGISTRATION.md:533 @ 8c693657801fd4168b078a601724bdacd9f479b8 sha256:ab5709148d067caf0e4bad9aadf9c5a39af03bee2cf3ecdb14f508acffd51c81 is superseded: the test it names was renamed by second-open-history-before-1c-step-3 to `an_unbound_reopen_of_the_same_file_starts_its_own_record_and_another_file_its_own`, in kernel/tests/session_history.rs.
```
```
## Amendment 29 — K-S15 renamed by second-open-history-before-1c-step-3 (class 1, a reference and its hash only)

1. governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md:1668 @ 8c693657801fd4168b078a601724bdacd9f479b8 sha256:364f456d2854f45d61bb45f8d9f21dba65d41a8237dfefc83314c9fc78e5d262 is superseded: the test it names was renamed by second-open-history-before-1c-step-3 to `a_second_open_of_one_file_saved_to_another_folder_writes_its_own_mark_and_leaves_the_first_record_unchanged`, in kernel/tests/project_save_skp.rs.
```
I recomputed both hashes with `git show 8c693657801fd4168b078a601724bdacd9f479b8:<form> | sed -n '<line>p' | sha256sum`, and 8c693657 is an ancestor of `origin/main`.

## 8. ADR-036 note, drafted here only (my words; every line cite is the code at C1, unchanged at C1b)
> **Amendment 2 — the session record is kept per open until a save binds the open to a project (second-open-history-before-1c-step-3, 2026-11-14)**
>
> Appended after acceptance. The words are a draft of the worker's, for the advisor's ruling under the delegation of 2026-11-13.
>
> 1. **The key** (§9; Amendment 1, item 5). A session history record belongs to one holder. The holder is an open of a dataset, by the name the catalog gave that open, until a save binds the open to a project, and the project from then on. The name is held in memory and is never written to disk. A second open of the same file is another open and has a record of its own. The earlier rule, that opens of one path admitted under the same claims continue one record, no longer holds. (`kernel/src/session_history.rs:122-128` the holder; `:141-149` an open's holder; `:308-316` the record is found by holder and created at the holder's first step.)
> 2. **A project's record made without a move** (adds to Amendment 1, item 5, `docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:272`). At a first save, an open that has a record of its own has it moved under the project, as item 5 says. An open that has no record at that save is bound to the project without a move. Its first step creates the project's record, named by the project identity's 32 hex characters, with the header's `project` the project's URI, and no `unsaved-` record is made for it. A move that fails leaves the open unbound, and the next save tries again. (`kernel/src/session_history.rs:343-365` the bind with and without a move, and the error before the bind at `:352`; `:438-451` the folder and the header's `project`; `:300-316`.)
> 3. **The dataset reference's identity** (§4's table, `ADR-036...md:72`, "when a dataset first enters a project"). Each open has one dataset reference identity. It is minted the first time either the history or a save asks for it. The history's header and each step's `data.dataset` carry it, and so does the project file's dataset entry at the open's first save, whether the first step comes before that save or after it. A dataset reference identity can therefore exist in a session history before the dataset has entered a project. §4's row stands for a project file's entry; this item says the history may mint the identity earlier. (`kernel/src/session_history.rs:168-181` an open is added with its identity minted once; `:270-277` `dataset_uri`; `kernel/src/project/mod.rs:250-253` a first save asks for it; `:276` the project file's entry is built from it.)
> 4. **A reopened project's record** (the 1c form's Amendment 28, OPEN-N4 (a); step 2's work, not this change's). A reopen of a saved project is bound to the project at the reopen, before any step on the new open, and continues the project's record. Nothing here binds an open at a reopen: `adopt_project` (`kernel/src/session_history.rs:343-365`) has one caller, the save (`kernel/src/project/mod.rs:360`). A save into a project whose record the run already holds is reachable by no command at this node. A first save mints a new identity (`kernel/src/project/mod.rs:250`), a first save refuses a folder that holds a project (`:265-267`), and a later save goes to the open's own project, found by its catalog name (`:243`).

## 9. Departures and notes (each with my call)
- **Stray hold.** In one foreground call I ran `machine.ps1 hold shared ... >/dev/null 2>&1` by mistake, as a probe before M4. No command ran under it. I called `release` right after, and it answered `MACHINE_NOT_HELD ... no live hold of this shell, nothing done`, so I took no further action.
- **Greps ahead of two holds.** Two of my background hold calls had my own `grep` and `git status` commands in front of the hold, so their output went to the task output instead of the transcript. I re-ran the greps and read the logs afterwards.
- **`node --test` outside a hold.** It ran about 141 s as one process. §9 lists it as light, so I did not hold it.
- **Waits.** I waited with bounded `Wait-Process` calls on PIDs found by command-line pattern. I did not kill or touch any process. One pattern match may have been a process of another project; it was only waited on.
- **Mutation reverts.** My `soc2-mut.mjs` reverts by replacing the mutated text with the old text and refuses a count other than 1. It does not use `git checkout`.
- **C2 comment placement.** Item 43's DRAFT comment is a new line after the existing approved comment, which stays. The 32 MiB clause is the only changed clause in the item line.
- **Pins.** The pins are `@ a2fbab2c...`, a commit on the unmerged branch, as the brief asked. `verify-cites` and `verify-quotes` accepted them on the branch, but the pins will not resolve against `origin/main` until C1 reaches main. The old item-63 DRAFT named its lines in words with no hash for this reason, so the gates may want to confirm which form they accept.
- **Item 43 turn rule.** C2 is this piece's point under the turn rule. Port-2's branch changes line 400 of the same item (its hunk is the data-folder sentence), and it had no PR at S0.
- **Prior-run departures not repeated.** There was no `--no-run` pre-build, and no commit before a workspace run.
- The one fully clean build was C1b's workspace run. C1 alone still does not build under the workspace test, as Amendment 1 records.

## 10. State left
- HEAD 5e6b79bc0d0f423293b312140788044fab1de106 = `origin/cut/second-open-history-before-1c-step-3`. The push was its own call, `git -C C:/dev/wt/so push -u origin cut/second-open-history-before-1c-step-3`. The porcelain is empty. No PR was opened and I did not wait for CI.
- Nothing of mine is running. All background shells completed, every hold was released, and I killed no process.
- Scratch is in `<S>` under `soc2-*`: the logs `soc2-ws1.log`, `soc2-ws2.log`, `soc2-three.log`, `soc2-M1..M6-{a,b,c}.log` and `soc2-vtc-c1b.log`; the scripts `soc2-mut.mjs`, `soc2-mutrun.sh`, `soc2-kl.mjs` and `soc2-append-rows.mjs`; and the message files `soc2-c1b-msg.txt` and `soc2-c2-msg.txt`.
