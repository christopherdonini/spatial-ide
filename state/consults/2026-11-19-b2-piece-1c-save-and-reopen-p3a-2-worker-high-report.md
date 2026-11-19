*Filed by the custodian: the worker-high's hand-back (claude-opus-5-5), 24852 bytes, sha256 64b668f7a9ef37e25ba2abdcbbb90ebb4c53d1ce67071b2d9c13e1b6c5d07c30, below the rule with two masks applied (the scratch folder's seven paths written <S>, and this project's name, five times in hold lines, written <m>, ADV-2026-11-18-07) and one final newline added if missing; calls Bash 187, Read 68, Edit 21, Write 12, Grep 8, SubagentHandback 1, five errored, from 2026-11-19T06:06:33Z to 07:54:48Z by its transcript, three compactions by its own report. It stopped on the form's Amendment 36 item 12 stop 4: K-O19's mutation does not fail its test at 270d3ac2c17c6551f7783c1feba1bfc5ad140178. The stop went to the advisor at 2026-11-19T08:02:31Z.*

---

Built: b2-piece-1c-save-and-reopen P3a-2, worker-high

**Stop 4, from the mutation table:** K-O19's recorded mutation (`create`'s `create_dir` replaced by `create_dir_all`) does not fail its test at the head. Everything else is done and pushed. No PR was opened.

**Commits** (branch cut/b2-piece-1c-p3a-2, base 18f14b62d222038f29214c53c0f11bf2f9d6a1e4)
1. 35ca57976b44b0c9c4da5f85e597a746e3bd1aa6 test: L5, L6 and L7, the lineage reader as P2 merged it (1c P3a-2)
2. ff31b05c58d27b40e60a98ea000ff85727e1bec4 test: K-R1 to K-R4 and K-O1 to K-O23, the reopen's rows, before its code (1c P3a-2)
3. 0c539ed2a8a6b3a3990e9688d6e808232ea79b63 test: K-O2 and K-O8 name mtime, the descriptor's own word (1c P3a-2)
4. b9fe8dc0c29da1398785a4c5e3f0936cdd5e86af feat: Projects::open_project, the kernel's reopen of a saved project (1c P3a-2)
5. 270d3ac2c17c6551f7783c1feba1bfc5ad140178 docs: ADR-036 Amendment 3, a first save after a reopen whose record another run left, and a move (1c P3a-2)

Pushed head: 270d3ac2c17c6551f7783c1feba1bfc5ad140178. `git rev-parse` gives the same id for HEAD and origin/cut/b2-piece-1c-p3a-2. The push ran in its own call (ff31b05c..270d3ac2). The worktree is clean.

**P-base**
- **Commit 1 (35ca5797):** rc 0. T6 ok; project_reopen 11 passed, L5, L6 and L7 included. Those three are allowed to pass at their base under stop 4.
- **Commit 2 (ff31b05c):** rc 101, a compile failure, so every new row fails at its base.
  - 2× E0432, unresolved imports `spatial_kernel::project::{OpenFailure, Reopen, Answer, Opened, ViewState}`, at project_lock_crash.rs:113 and project_reopen.rs:527;
  - 13× E0599, no method named `open_project` on `Projects`.
  - Log: <S>/1cp3a2-pbase2.log
- **Commits 3, 4 and 5:** no hold of their own at each commit. Two builds ran on the uncommitted product, before commit 3:
  - build1: E0596, a missing `mut`, fixed.
  - build2: project_lock_crash 2 passed (T6, K-O5); project_reopen 37 passed and 2 failed (K-O2 and K-O8, at the component-name assertion only). Commit 3 fixed that.
  - At commits 4 and 5, P-head is the only run.

**P-head at 270d3ac2, one hold, rc 0**
- lib: 193 passed, 1 ignored
- project_lock_crash: 2
- project_reopen: 39
- project_resolver: 4
- project_save: 21
- project_save_crash: 1
- project_save_skp: 6
- project_store: 5
- session_history: 13
- session_history_crash: 1
- skp_admission: 10
- skp_admission_remediation: 7
- skp_cancel_terminal_without_credit: 2
- skp_filter_cancellation: 1
- skp_projection: 14

0 failed in every target. Log: <S>/1cp3a2-phead.log

**clippy** (`cargo clippy --locked -p spatial-kernel --all-targets`), rc 0. Warnings by file:
- kernel/src/skp.rs:277: `type_complexity`. This is a changed file, but the line comes from d400a475f (2026-08-09); `git blame` and `git show 18f14b62…:kernel/src/skp.rs` both show it at the base. It is outside the split region 7(a) gives me, so it is not fixed.
- Not changed by this part:
  - kernel/src/lib.rs:415 and :490;
  - kernel/src/permission/boundary.rs:536;
  - kernel/src/publish/mod.rs:839;
  - kernel/src/bin/publish-bundle.rs:149;
  - engine/src/app_dirs.rs:39;
  - renderer/src/canonical.rs:303;
  - renderer/src/style.rs:10.
- None is in a line this part added.
- Log: <S>/1cp3a2-clippy.log

**fmt:** `cargo fmt -p spatial-kernel --check` rc 0, empty output.

**Mutations** (round-25 rule, head 270d3ac2)
- Script: <S>/1cp3a2-mutate.mjs
- How it works: each old text must occur exactly once. The named test runs alone (`--exact`), the original bytes are written back, and `git diff --quiet` is checked. A dry run first applied and reverted all 35 cleanly.
- Summary: <S>/1cp3a2-mutations.txt
- Per-mutation logs: <S>/1cp3a2-mut-<id>.log
- Every row: cargo rc 101 and the test FAILED unless marked otherwise; reverted, with `git diff --quiet` rc 0.

| id | change | failing test (panic site) |
|---|---|---|
| K-R1 | data step joins `at` without `check_inside` | a_link_below_the_folder_is_refused_and_never_opened (784) |
| K-R2 | resolver `symlink_metadata` → `metadata` | on_windows_a_junction_out_of_the_folder_is_refused (784) |
| K-R3 | `in_canonical_form` not called for an at | a_device_name_or_trailing_dot_target_is_refused_at_read_before_any_open (892) |
| K-R4 | an unfound segment read as a folder | an_unresolvable_target_is_refused_by_name (782) |
| K-O1 | claims dropped | a_saved_project_reopens_with_its_data_claims_and_workspace (763) |
| K-O1b | lineage read replaced by Absent | a_saved_project_whose_member_records_a_lineage_reopens_with_its_lineage_named (977) |
| K-O2 | descriptor's mtime comparison removed (engine/src/descriptor.rs) | a_changed_file_is_reopened_with_each_differing_component_named (1001) |
| K-O3 | missing location falls back to the folder | a_missing_file_returns_not_found_and_opens_nothing (1026) |
| K-O4a | lock under a fresh random root | a_second_open_of_an_open_identity_is_refused_in_this_process_and_another (1074) |
| K-O4b | folders.json written before the lock | same test (1106) |
| K-O5 | `create_new` marker in place of the lock | project_lock_crash: the_second_open_refusal_never_outlives_a_crash (249) |
| K-O6 | ask whenever the first folder exists | the_question_is_asked_only_when_the_first_folder_holds_this_identity_or_cannot_be_reached (763) |
| K-O6b | `moved_to` keeps the old first | a_move_answer_rewrites_folders_json_with_this_folder_first_and_asks_again_at_the_old_path (1206) |
| K-O7 | new identity written to the first folder | a_copy_gets_a_new_identity_in_the_new_folder_and_its_own_links (1239) |
| K-O8a | check skipped on re-link | a_relinked_file_is_checked_against_the_observation_and_each_difference_named (1282) |
| K-O8b | no `locations_to_bytes` precheck | same test (1278) |
| K-O9 | identifier-only compare | a_view_saved_in_another_space_is_not_applied_and_the_reopen_names_it (1308) |
| K-O10 | refused folders.json read as absent | a_folders_json_the_reader_refuses_refuses_the_open_by_name_and_is_kept (791) |
| K-O10b | refused locations.json read as empty | a_locations_json_the_reader_refuses_refuses_the_open_by_name_and_is_kept (791) |
| K-O11 | `with_same` drops the oldest | a_same_answer_past_256_known_folders_is_refused_and_none_is_forgotten (1397) |
| K-O12 | unbounded read | a_project_file_over_its_ceiling_is_refused_at_reopen_without_being_read_whole (1415) |
| K-O13 | key registered only by `open_dataset` | a_cancel_before_the_engine_open_ends_the_reopen_with_nothing_opened_and_no_lock_held (1481) |
| K-O14 | lock leaked after it is taken | a_refused_or_cancelled_reopen_leaves_open_lock_free (734) |
| K-O15 | arm given the path without its `\\?\` prefix | on_windows_a_reopened_project_relative_open_is_watched (1563) |
| K-O16 | `copy_under` `create_dir_all` | a_save_after_a_reopen_whose_project_record_another_run_left_replaces_neither_history (1620) |
| K-O18 | 5(g) arm never taken | a_save_after_a_reopen_with_no_step_whose_project_record_another_run_left_leaves_it_and_keeps_the_open_unbound (1655) |
| **K-O19** | create `create_dir` → `create_dir_all` | **SURVIVED: cargo rc 0, the test ok.** Reverted, rc 0. Stop 4. |
| K-O20 | kept-lineage refusal never taken | a_later_save_of_a_reopened_project_whose_member_records_a_lineage_is_refused_and_the_files_are_kept (1702) |
| K-O21a | reopen not entered in the saved list | a_save_after_a_reopen_keeps_the_project_and_dataset_identities_and_the_folder (1726) |
| K-O21b | minted URI kept | same test (1735) |
| K-O22 | no bind at reopen | a_reopen_in_the_run_that_holds_the_projects_record_continues_it_from_the_first_step (1768) |
| K-O23 | compared as written | on_windows_a_folder_spelled_with_another_case_is_the_known_folder (763) |
| L5 | count comparison removed | a_previous_lineage_whose_hash_matches_but_whose_step_count_does_not_is_named_and_not_used (444) |
| L6 | reader goes past the first failure | a_lineage_file_with_two_broken_lines_is_named_by_the_first (470) |
| L7 | `symlink_metadata` → `metadata` | a_link_at_the_lineage_name_beside_a_not_kept_member_is_named_and_never_followed (496) |

- **Why K-O19 survives:** under P-2 option (i), the 5(g) arm keeps the open unbound. Its first step therefore reaches `StepRecorder::create` with `Holder::Open`, whose folder is a fresh `unsaved-<hex32>` folder (kernel/src/session_history.rs, `create`'s `folder` match). `create` never meets the leftover `<project hex>` folder, and `create_dir` and `create_dir_all` act the same on a folder that does not exist. Under option (i) this test cannot tell the mutation apart. Nothing was changed for it.
- **Not observed here:** K-R1's off-Windows symlink cases (they run only off Windows).
- **K-O19 departure:** its mutation text for 7(b) was mine as written in the table; no other mutation was substituted for it.
- **Mutations outside my files:** K-O2's (engine/src/descriptor.rs) and the store.rs and resolver.rs ones were applied and reverted only.

**Counts** (§2.11's command, B=18f14b62d222038f29214c53c0f11bf2f9d6a1e4, H=270d3ac2; added/removed)

| file | added | removed | ceiling | result |
|---|---|---|---|---|
| kernel/src/project/mod.rs | 483 | 3 | 520 | within |
| kernel/src/skp.rs | 26 | 4 | 60 | within |
| kernel/src/session_history.rs | 30 | 0 | 50 | within |
| kernel/src/dataset_ref.rs | 4 | 2 | 10 | within |
| kernel/tests/project_reopen.rs | 1393 | 0 | 520 | **class 8 overrun** |
| kernel/tests/project_lock_crash.rs | 151 | 0 | 70 | **class 8 overrun** |

- Groups: product 543/9; tests 1544/0.
- The two test-file overruns are recorded only; nothing was changed for them.

ADR-036: +8 / 0.

Lock files: `git diff --quiet 18f14b62…...HEAD -- Cargo.lock frontends/shell/src-tauri/Cargo.lock` rc 0.

**`pub` items added**
- All are in kernel/src/project/mod.rs: `Projects::open_project`, `Answer`, `Reopen`, `Opened` (with its seven pub fields) and `ViewState`, `OpenFailure`. These are item 8's list.
- Crate-private only:
  - `SkpHost::begin_open`, `SkpHost::open_under` and `OpenGuard` are pub(crate) in skp.rs;
  - `StepRecorder::reopened` is pub(crate) in session_history.rs.
- Caller grep over kernel/src, protocol, frontends/shell/src, frontends/shell/src-tauri/src, engine/src and renderer, excluding mod.rs: no product caller. The only hits are docs naming `open_project` as their consumer (resolver.rs:162; store.rs:226, 365, 384, 437; session_history.rs:1630-1663), plus "Opened" as an English word in publish-bundle.rs:653.
- Test callers: kernel/tests/project_reopen.rs and project_lock_crash.rs.
- The consumer is P3b. This is disclosed against §8 item 9: a `pub` item with no product caller at this part's head, pre-committed by item 8.

**Doc sentences written, byte-copied from the diff, with the code each rests on**

dataset_ref.rs, N-10 (`in_canonical_form`'s doc; rests on `resolver::check_inside`):
"Containment is not checked here. Piece 1c's resolver judges it at save and checks it when the data is opened: it walks from the project folder one segment at a time and refuses a link, a missing segment, or a final object that is not a regular file. A change another program makes after that check is not prevented (ADR-036 §5). No path type is used, nothing is joined and no file is touched."

mod.rs module doc (rests on `SavedProject._lock`, pushed by `save` and `open_project`):
"Nothing in this module holds a handle in a project folder. [`Projects`] holds one on `open.lock` in the machine store for each identity it saved first or reopened ([`Projects::open_project`]), until it is dropped. The only files this module writes in a project folder are `project.spatial` and the temporary file that [`store`]'s atomic replace renames over it."

mod.rs reopen region, constants and types:
- "A machine store document's read bound (the form's Amendment 36, item 5 (a))." / "The folder's lineage file, `.spatial/lineage.jsonl` (ADR-036 §1), by its two segments." / "The previous lineage file, kept in the identity's machine folder (ADR-036 Amendment 1, item 2)." (the three constants)
- Answer: "The answer to the question a reopen asked: given with the next call for the same folder." / "The folder is a copy: it gets a new identity, written into its `project.spatial`, and machine store files of its own." / "The folder holds the same project: it is remembered in the identity's `folders.json`."
- Reopen: "What a reopen replies when it is not refused." / "The folder is not known for the identity, and the first folder still holds this identity or cannot be read: nothing was written, and the caller asks and calls again with an answer." / "No file was found for the dataset through the machine store, and the caller may re-link it. `file_name` is the last name of the recorded path that is missing; `None` when no location is recorded for the dataset." (`data_at`)
- Opened: "A reopened project." / "The identity it is open under: a new one after the answer `copy`." / "The workspace as the project file holds it, its view included; [`Opened::view`] says whether the view applies." / "The project file's reference against the reopened dataset ([`DatasetRef::check`])."
- ViewState (`view_state`): "Whether the saved view applies to the reopened dataset (V3)." / "The saved view's space equals the space the dataset was admitted in, in all three members." / "It does not: `basis` names both spaces."
- OpenFailure: "Why a reopen was refused. Each variant states a fact about what was found. After any of them the reopen holds no lock, and the catalog holds no dataset the reopen opened." Its variant docs, in order:
  - "The host refused the cancel key, or the engine refused the open: the host's error."
  - "The cancel key was cancelled before the reopen ended."
  - "The folder's `project.spatial` could not be read."
  - "`project.spatial` breaks a rule the reader holds, or the copy's file would."
  - "`folders.json` or `locations.json` was refused by its reader, or a document by its writer; the file named is not rewritten."
  - "The answer `same` would take the identity past [`store::MAX_KNOWN_FOLDERS`] folders; `count` is how many it remembers."
  - "The identity's open lock is held, in this process or in another."
  - "A machine store file could not be read, written or locked."
  - "The project folder could not be resolved at the data step."
  - "The `project-relative` locator's target was refused by [`resolver::check_inside`]; `locator` is the locator's JSON path in the project file."
  - "The copy's `project.spatial` could not be written."
  - "The checked path is not valid Unicode, so it cannot be given to the engine."
- Place and Data: "Where step 2 leaves the identity and `folders.json`." / "The folder is known: nothing is written." / "`folders.json` is replaced by this list: after a move, the answer `same`, or none there." / "The answer `copy`: this new identity." / "What the data step found."

mod.rs, `open_project`'s doc (rests on its body):
"`open_project` (§2.4): reopen the project saved in `folder`, under `cancel_key`. In order:
1. `cancel_key` is registered with the host's opens, so that `cancel` reaches this call from here until it returns; the token is checked after each step that reads. `project.spatial` is read up to its ceiling and one byte, and parsed by the strict reader.
2. The identity and the folder, with nothing written. The folder is known when its canonical form equals that of an entry of `folders.json`; an entry that does not resolve is compared as written with the folder's absolute form. Otherwise the first folder is looked at: gone, not a folder, holding no `project.spatial` or holding another project's is a move; holding this identity, or a file or folder that cannot be read or a file the reader refuses, asks. With no `answer` the question is the reply. With no `folders.json` the folder is remembered as `first`. `answer` is read only when the question is asked.
3. The identity's open lock, the new identity's after the answer `copy`; then this step's writes: `folders.json`, and for a copy its `project.spatial` with the new identity.
4. The lineage (step 6 of §2.4, run here): [`read_lineage`] of the folder's `.spatial/lineage.jsonl` and of `previous-lineage.jsonl` in the machine folder of the identity the project file names.
5. The data. A `relink` is used first, refused by name when `locations.json`'s writer would refuse it. Otherwise a `project-relative` locator goes through [`resolver::check_inside`], and the engine is given the path it returns. Otherwise the machine store's location for the dataset is used; none recorded, or a recorded path that is missing, replies `not_found`. The open is the host's, under the token of step 1 and with the claims the project file recorded.
6. The check and the view's state; after a `relink` or a copy, `locations.json` with the path opened (a write refused or failed closes the dataset); the open given the project file's dataset identity in the history ([`StepRecorder`]); and the open entered with its lock in this [`Projects`], so that its next save keeps both identities and its folder.
Every refusal after step 3 frees the lock before it is returned. The resolver's check is claimed, not what the engine reads after it (§2.5's window)."

mod.rs, private functions:
- "Whether `here`, an absolute folder, is one `known` holds (the form's Amendment 36, item 5 (d)): canonical forms are compared, and an entry, or `here`, that does not resolve is compared as written." (`is_known`)
- "Whether the first folder `first` asks the question for `project` (§2.4 step 2): it holds a `project.spatial` of this identity, or one the reader refuses, or it or that file cannot be read. Gone, not a folder, no `project.spatial` there, or another project's: a move." (`asks`)
- "The data step's path, when no re-link is given: a `project-relative` locator's target as [`resolver::check_inside`] returns it, else the machine store's location for the dataset." (`data_at`)
- "Whether the saved view's space `saved` is the space `ds` was admitted in (V3)." (`view_state`)
- "A machine store document in `dir`, read up to its bound and one byte; `None` when it is absent." (`machine_document`)
- "Up to `max` bytes and one more of the file at `path`, so that a reader refuses a longer file by its size without the rest being read." (`read_bounded`)

session_history.rs:
- `adopt_project` (rests on its `held`/`left` arm): "An open with no record of its own is not bound when this recorder holds no record for the project and `<store root>/<project hex>` is there, or cannot be looked at: another run left that folder, and `create` would refuse it at the open's first step. The open stays unbound, the error is returned, and the open's steps go to a record of its own (the form's Amendment 36, item 5 (g), as ADV-2026-11-19-04 ruled it)."
- `reopened`: "A reopen's call, before any step of the open the catalog names `open` (the form's Amendment 36, item 5 (f)): the open takes `uri`, the project file's dataset identity, in place of one minted for it, so that its steps and its saves carry the file's. It is bound to `project` only when this recorder holds the project's record, so that its first step continues that record; otherwise it stays unbound until a save binds it."

skp.rs:
- `begin_open`: "The first half of [`Self::open_dataset`]: `cancel_key` is checked and registered, so that `cancel(cancel_key)` reaches the returned token, until the returned guard is dropped. A project reopen (`crate::project`) registers its key here at its start, and hands the token to [`Self::open_under`] when it reaches its data step."
- `open_under`: "The second half of [`Self::open_dataset`], under a token [`Self::begin_open`] registered: the open, its watch and its admission. `req.skp` and `req.cancel_key` are not read here."

**ADR append** (<S>/1cp3a2-adr.mjs)
- The script's checks:
  - the fence is the ruling's lines 38-46, with 7 lines inside;
  - item 1 equals draft line 360 after "> ": true;
  - item 2 equals draft line 376 after "> ": true;
  - date 2026-11-19;
  - the ADR's earlier bytes unchanged: true;
  - the file ends in exactly one LF: true.
- Appended 1645 bytes, sha256 c0949549be399febe1958d2319826a534b5015ed0bdec4fb0802563fcb406891 (re-checked with tail and sha256sum). The file went from 40980 to 42625 bytes.
- The ADR index is not edited.

**Item 9 "not covered" rows, all still holding at 270d3ac2** (no test reaches them):
- FolderUnresolvable through the data step (mapped to `OpenFailure::FolderUnresolvable`);
- NotCanonical, unreachable after the read;
- `with_same` when folder == first;
- D-16's eprintln;
- the write_machine_file temp file;
- the not-kept metadata error;
- two live opens bound;
- a kept member's link followed;
- the cloud placeholder.

New untested arms, in the same class:
- `PathNotUnicode`;
- `ProjectFileUnwritable` for a copy's replace;
- a copy's or re-link's locations.json write failing with its close;
- `MachineStore` errors;
- the unknown-dataset arm after the open.

**Holds' lines, masked**
- P-base 1: MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:80296 also=<m> … / MACHINE_RELEASED project=<m> shell=bash.exe:80296 affinity=FF (cores 0-7)
- P-base 2: shell=bash.exe:39796, the same shape, also=<m>; released.
- P-head: waited in the queue (MACHINE_WAITING shared: turn of <m> held by another <m> pid), then MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:32948 also=<m> / MACHINE_RELEASED … bash.exe:32948 affinity=FF (cores 0-7)
- clippy: bash.exe:18844, the same shape; released.
- mutations 1/2/3: bash.exe:75484, 51592 and 23336, the same shape; each released.
- build1 and build2 ran under holds of the same shape; their lines are in their task outputs and not restated here.
- No exit code 96-99 in any hold.

**Not done, departures, stop**
- **Stop 4:** K-O19's mutation survives, as above.
- **Departure, a test changed after its base:** commit 0c539ed2 changed K-O2's and K-O8's expected component from `modified_ns` to `mtime`, and K-O2's doc line. The engine descriptor names the component `mtime`.
- **Wrong symbol in 0c539ed2's message:** it says `Descriptor::components_differing_from`. The symbol is `SourceDescriptor::components_differing_from`, whose body is the private `differing_components` in engine/src/descriptor.rs. No amend is allowed.
- **Class 8 overruns:** project_reopen.rs (1393 against 520) and project_lock_crash.rs (151 against 70).
- **Docs outside my region now incomplete, not edited:**
  - `SavedProject._lock`'s doc says the lock is taken by the first save; a reopen takes it too.
  - `save`'s doc says it goes to the folder the first one used.
- **Pre-existing clippy warning** at skp.rs:277, not fixed (outside the split).
- **Readings disclosed:**
  - an absent folders.json is read as remember-here-first;
  - previous-lineage.jsonl is read under the file's original identity, a copy included;
  - `NotFound.file_name` is an Option;
  - 5(i)'s lineage file is read as `.spatial/lineage.jsonl` per ADR-036 §1;
  - the region's `use` lines sit inside the region;
  - K-O12 adds a 4 MiB case; K-O13 removes the data file.
- **Reuse index:** "No prior art recorded for "reopen a saved project folder: a known-folders question, a cross-process lock, a contained path walk and a lineage read under one cancel key". Research it before planning an implementation." No prior art was used.
- **Background processes:** none of mine is running. All background shells completed; no cargo.exe or rustc.exe is running. The node.exe processes listed are not mine; my scripts exited.

**Self-check, four classes**
- **Scope:** files only within 7(a). Other files had a mutation applied and reverted only.
- **Seams:** `pub` items limited to item 8; cites by symbol in docs; file:line in the feat message.
- **Quotes:** the ADR items were byte-checked by script; N-10's words come from the draft's line 155, re-wrapped.
- **Claims:** each one above rests on a call in this transcript.

Observed model: Opus 5.5 (claude-opus-5-5). Overrides: none. Context handoffs: three compactions.
