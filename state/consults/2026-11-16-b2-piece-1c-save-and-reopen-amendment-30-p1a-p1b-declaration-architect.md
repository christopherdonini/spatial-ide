# b2-piece-1c-save-and-reopen: Amendment 30, P1a and P1b declared, after the advisor's split; the architect's report

*Filed by the custodian from the hand-back: 25455 bytes, sha256 713e65f885caf904abf2668d4de6662736cabbf7bf8893e0e7514c07ee124f8d, claude-opus-5-5, 11 calls by its transcript since its revised report. Byte for byte below the rule. Its amendment, from its heading to its last line, is appended to the form.*

---

Drafted: b2-piece-1c-save-and-reopen Amendment 30 (P1a and P1b), architect, revised for ADV-2026-11-16-16
Choices left for the advisor: 0. One matter goes to the advisor before code, under ADV-2026-11-16-16 item 1 (e): the `make_link` copy in note 1. The amendment stays as it is either way.
What changed from the item 5 (b) draft: P1 is declared as two parts, P1a and P1b, along my split line, each with its own files, ceilings, tests, mutations, producers, stops and gates. T11 and T14 move into `kernel/tests/project_save.rs` so that no test rig is copied. Item 2 (a) and (b) and item 3 of ADV-2026-11-16-16 are placed.
Reviewed: main @ 2a8907b8786dd0dc714213fa21fdb41cd6ada52c. The coordinator says the form is unchanged since f4027cc05f296bb34697cb518ebf896b5c9ef618; my own grep finds no Amendment 30 or later on it. The code was read in the main checkout. ADV-2026-11-16-16 was read from the coordinator's scratch copy (2589 bytes), which is not on main.

I have no shell, so this report gives no sha256.

---

## Amendment 30 — the reopen's P1 declared before its code, as two parts, P1a and P1b (ADV-2026-11-16-10, R1 and R2; ADV-2026-11-16-16): the rulings onto the form (class 5); D2's rename (class 1); the O-items and the #307 review's two named items; for each part, its scope, ceilings, tests, mutations, pre-committed producers, stops and gates; test files and a reader bound outside §2.11 and §7 (class 9)

*Drafted by the architect for the custodian, read only, at main 2a8907b8786dd0dc714213fa21fdb41cd6ada52c, and appended by the custodian's script. References only. Nothing below is a quotation. Under ADV-2026-11-16-10 item 5, each choice below is the custodian's declaration; where it is the architect's recommendation, it says so. Rulings are cited by id, or by file, and item. Code is cited by path and symbol.*

1. **The rulings onto the form (class 5, D1).**
   - The human's directive of 2026-10-23 (`state/directives/2026-10-23-clicks-245-246-247-sort-window-fix-before-port-2-covering-case-route-1-244-c1-milestone-4-and-1c-open-items-ruled.md`, its `Piece 1c:` line): OPEN-S2-1 (c), S2-2 (a), S2-3 (a) and S2-4 (a).
   - The human's message of 2026-11-12, 13:07Z (`state/directives/2026-11-12-s1-fix-open-a-c-s6b-now-pr-b-class-9-now-1c-five-308-c1-words-platform-reports-order-no-git-stash.md`): item 3 (a), (d) and (e), and item 5 (b).
   - ADV-2026-11-16-10 (`state/directives/2026-11-16-advisor-ruling-adv-2026-11-16-10-the-reopen-r1-to-r4-five-pieces-p3-split-producers-ahead-pre-committed-a-later-runs-reopen-does-not-bind-adr-036-amendment-3.md`), items 1 to 6.
   - ADV-2026-11-16-16, items 1 to 4. It is filed in `state/directives/` by the custodian no later than this amendment's commit.
   - Step 2 is P1a, P1b, P2, P3a, P3b, P4 and P5 (ADV-2026-11-16-10 R1 (a); ADV-2026-11-16-16 item 1). This amendment declares P1a and P1b. Each later piece is declared in its own amendment before its code.

2. **D2 (class 1).** The 2026-10-23 draft's conditional K-S14 (`state/consults/2026-10-23-b2-piece-1c-save-and-reopen-steps-2-and-3-ahead-architect-draft.md`, its conditional row) collides with Amendment 20's K-S14.
   - It is renamed **K-O16**, the next id after the draft's K-O12 to K-O15.
   - It is P3a's, declared there under R3.

3. **The O-items** (the architect's recommendations).
   - **O-7, K-S15's length check stays.** P1b's lock is on `open.lock` in the identity's machine folder, not on the history. The recorder keeps its own exclusive lock on `history.jsonl` (`kernel/src/session_history.rs`, the `try_lock` calls in its record writers), and Windows refuses a read of a locked file. So the record still cannot be read while the recorder holds it (item 3 (a) of 2026-11-12). This needs no code.
   - **O-8, D-16 is in P1b**, the first pull request to touch the store (ADV-2026-11-16-16 item 1 (c); item 3 (d) of 2026-11-12).
     - `Staged::commit` in `kernel/src/project/store.rs` becomes a call of a private `commit_with(flush)`, with `sync_folder` passed as `flush`.
     - A flush that fails after a successful rename no longer refuses the save.
     - The failure is written to standard error by `eprintln!` as an engine fact only: that the folder flush failed after the rename, and the error kind. It gives no path, no handle and no duration, as in `kernel/src/skp.rs`.
   - **O-21.**
     - C-7's resolver unit test is P1a's (T5).
     - C-7's restated K-R3 is P3a's (R1 (g)).
     - N-10 lands in P3a, where `check_inside` gets its product caller.
   - **Not P1a's or P1b's:**
     - O-6 is P3a's.
     - O-9, O-18 and O-19 are P4's, and go to the advisor.
     - O-10 to O-17 and O-20 are P3a's, P3b's or P4's, as the packet lists them.
     - C-6's withdrawal of `project_target_outside_folder` (§2.2), and the code for a non-directory intermediate or a non-regular final, are P3b's (R1 (e)).

4. **The #307 review's two notes: named items of step 2 (class 5, item 5 (b) of 2026-11-12).** The source is `state/drafts/2026-11-11-platform-independent-review-pr-307.md`, its final report's Notes. It is a reading, cited as evidence. ADV-2026-11-16-16 items 2 and 3 place both notes.
   - **(a) The path-length bound: P1b's** (ADV-2026-11-16-16 item 2).
     - **The defect at main.** `KnownFolders::to_bytes` and `locations_json` (in `kernel/src/project/mod.rs`) write path strings that their readers can refuse. The readers allow 4,096 decoded bytes per string under `FOLDERS_LIMITS` (`kernel/src/project/strict_json.rs`, the reader's `string`) and 2,097,152 bytes per document. `locations_json` also writes a path that is not valid Unicode, altered, by `to_string_lossy`.
     - **What P1b changes.** Each writer refuses what its reader refuses:
       - `to_bytes` refuses a path over the string bound and a document over the byte bound;
       - `locations_json` moves to the store as `locations_to_bytes` under `LOCATIONS_LIMITS`, refusing a path that is not valid Unicode or is over the string bound;
       - `Projects::save` builds both documents before its first machine-store write, so a refusal writes nothing.
     - The refusal is the existing `SaveFailure::MachineRecordRefused`, mapped by `skp_error_of` to `skp.project_file_refused` with the file's name as `path`, a case SKP-V0 §11.4's row already covers. Nothing changes on the wire.
     - **With these bounds, P1b reads back everything either machine-store writer writes.** T12 and T13 prove it at the bound; T11 and T14 prove it on the save path.
     - **What the user is told changes (ADV-2026-11-16-16 item 2 (a)).** A save that would have written a path that is not valid Unicode, altered, is now refused. So is a save whose folder path or data path is over 4,096 bytes; at main that save was written and its machine file would later be refused. Both now show the shell's existing message for `project_file_refused`; no string changes. Both gates of P1b read this change. P5's drafter says whether the limitations owe a line for it.
     - **The record's own `locations.json` writer** (`kernel/src/session_history.rs`, `create`) has the same unbounded, altering writer. It is a declared item of step 3, which builds its reader (§2.6). It is to be carried onto step 3's node, by name, when step 3 is split off (ADV-2026-11-16-16 item 2 (b)). It is not P1a's, P1b's or P2's.
     - At the reopen, P3a writes `folders.json` through `to_bytes`, maps a refusal there to a code, and P3b names that code (R1 (e)).
   - **(b) The stale temp: P3a's and P3b's** (ADV-2026-11-16-16 item 3).
     - **The defect at main.** `remove_stale_temps` in `kernel/src/project/store.rs` removes another process's staged temp, and that process's save is then refused as `RenameKeepsFailing`.
     - **The fix.** P3a takes `ProjectLock::try_lock` in `Projects::save` at a first save, before staging. P3b holds that lock in the binding until `close_dataset` (§2.7; §2.2's `open.lock`, held while the project is open). P3a's amendment declares this before its code.
     - **Residual, named.** Two first saves of different identities into one empty folder, between the folder check and the rename, are not excluded. `remove_stale_temps`'s doc names this in P3a.
     - If this reads as beyond the form's step 3, it is class 9 and goes to the advisor with P3's packet.
     - P1a and P1b do not change `remove_stale_temps`.

5. **P1a: the resolver.** Branch `cut/b2-piece-1c-p1a`, worktree `C:/dev/wt/1c-p1a`, build folder `D:/wt-targets/1c-p1a`, cut from main.
   - **(a) Files and regions.**
     - **`kernel/src/project/resolver.rs`:** a new `pub fn check_inside(folder, at)` (§2.5), its error type, and a new `mod tests`.
       - It runs `in_canonical_form` on `at` first. It then walks from the folder one segment at a time, by `symlink_metadata` only, and opens no file:
         - a link or junction is refused;
         - a missing segment is refused as unresolvable;
         - a non-directory intermediate or a non-regular final is refused by name;
         - otherwise it returns the engine path, in the `\\?\` form on Windows (H4).
       - A cloud placeholder opens (§2.5).
       - It has no wire code. `judge` is unchanged.
     - **`kernel/src/dataset_ref.rs`:** `in_canonical_form` becomes `pub(crate)`. Nothing else.
     - **`kernel/tests/project_resolver.rs`:** new, on §2.11's list. It holds its own link maker, a junction on Windows or a symlink elsewhere, with `cfg` in test code only (§2.9).
   - **(b) Ceilings by §2.11's groups.**
     - Kernel product 135: `resolver.rs` 130, `dataset_ref.rs` 5.
     - Kernel tests 200: `project_resolver.rs`.
     - P1a: 335 lines and 3 files.
     - An overrun is class 8 in P1a's closing amendment. Neither §2.11 nor §7 is edited.
   - **(c) Tests and mutations.** Each fails at main because `check_inside` does not exist there, which is a compile failure. Each mutation is observed by the round-25 rule; a `verify-mutation` run is not called an observation.

     | Id | Test | File | Asserts | Mutation |
     |---|---|---|---|---|
     | T1 | `check_inside_refuses_a_link_below_the_folder_naming_its_segment` | `kernel/tests/project_resolver.rs` | a junction on Windows, or a symlink elsewhere, as an intermediate and as the final, is refused as through a link, naming the segment | the link check skipped |
     | T2 | `check_inside_refuses_a_missing_segment_as_unresolvable` | same | a missing intermediate and a missing final are each refused as unresolvable, naming the segment | a missing segment treated as a directory |
     | T3 | `check_inside_refuses_a_final_that_is_not_a_regular_file_or_an_intermediate_that_is_not_a_folder` | same | each is refused by name | the kind check skipped |
     | T4 | `check_inside_returns_the_engine_path_for_data_reached_without_a_link` | same | the canonical folder joined with `at`, in the `\\?\` form on Windows (checked at run time, with no `cfg` in product code) | the folder not canonicalized |
     | T5 | `check_inside_refuses_a_non_canonical_at_before_any_file_is_read` | `resolver.rs`, `mod tests` (C-7) | a device name, a trailing dot and a `..` segment are refused, with a folder that does not exist | `in_canonical_form` not called |

     - The cloud placeholder case is not tested, since a test cannot make one. The closing amendment names this gap.
   - **(d) Pre-committed producer (R2; ADV-2026-11-16-16 item 1 (d)).**
     - `resolver::check_inside` and its error type. Consumer: `Projects::open_project`'s data step, in P3a.
     - The seam's end-to-end tests:
       - K-R1, K-R2 and K-R4 (§4);
       - K-R3 as C-7 restates it, working name `a_device_name_or_trailing_dot_target_is_refused_at_read_before_any_open`, asserting `project_file_refused` at the locator's `at` with nothing opened;
       - then E-REOPEN.
     - They are named in P1a's PR body and in the node's plan summary.
     - Any other `pub` item in P1a is a gate finding (R2 (d)).
   - **(e) Stops.** The worker stops and reports alone when any of these happens:
     1. A file outside 5 (a) is needed. `protocol/` is among them: P1a changes nothing there.
     2. A `pub` item other than 5 (d)'s is needed.
     3. An existing test needs an edit (I3), or a dependency or a lock file changes (I6).
     4. A test passes at its base before its code, or a mutation does not fail its test.
     5. A case a test cannot build. That is a stop, not a skip.
   - **(f) Gates.**
     - Full class, both gates, the architect and the reviewer (ADV-2026-11-16-16 item 1 (a)).
     - The full suites are CI's: the workspace on Windows, Ubuntu and macOS, plus fmt and clippy. CI runs the junction case on Windows and the symlink case elsewhere.
     - On the laptop, in turns with P1b and P2 by THE MACHINE paragraph, P1a keeps at its final candidate:
       - the focused `project_resolver` test target and the resolver's unit tests;
       - every mutation of 5 (c) observed;
       - §2.11's command;
       - empty lock-file diffs.
     - No e2e and no app-window run: no shipped path reaches `check_inside` until P3a.

6. **P1b: the store and the lock, with D-16 and the writers' bounds.** Branch `cut/b2-piece-1c-p1b`, worktree `C:/dev/wt/1c-p1b`, build folder `D:/wt-targets/1c-p1b`, cut from main.
   - **(a) Files and regions.**
     - **`kernel/src/project/store.rs`:**
       - `pub const OPEN_LOCK` (Amendment 18 item 1).
       - `pub struct ProjectLock`, `pub fn ProjectLock::try_lock(root, project)` and `pub enum LockRefused { Held, Io }`. It creates the identity's folder and `open.lock` if they are absent, never truncates or writes the file, and takes `File::try_lock`. Drop frees the lock.
       - `pub fn KnownFolders::with_same` and `pub struct KnownFoldersFull { count }`. It is pure; a folder already known returns the list unchanged; at `MAX_KNOWN_FOLDERS`, with `first` counted, it is refused and nothing is dropped (M2).
       - `pub fn KnownFolders::moved_to`. It is pure; the new folder becomes `first` and leaves `same`; the old `first` is forgotten (S2-2 (a)).
       - `KnownFolders::to_bytes`: the bounds of item 4 (a).
       - `pub fn locations_to_bytes(uri, at)`: item 4 (a).
       - `pub fn read_locations(bytes)` and `pub struct Location { dataset, path }`. Any other shape is refused by name, with `file` = `LOCATIONS`.
       - A private `LOCATIONS_LIMITS` (class 9, outside §7), with `FOLDERS_LIMITS`'s values.
       - `Staged::commit` and `commit_with` (D-16), with the docs of `Staged::commit` and `sync_folder` brought to the built behaviour (D4).
       - A new `mod tests`.
     - **`kernel/src/project/mod.rs`,** two regions: `locations_json` is removed; in `Projects::save`, the machine-store block builds both documents before `create_dir_all` and calls `locations_to_bytes`.
     - **`protocol/skp/src/v0/error.rs`:** the `//` comment above `project_file_unwritable` that names the POSIX refusal after the rename is removed.
     - **`protocol/skp/SKP-V0.md`:** §11.3's HTML comment with the same text is removed.
     - **`kernel/tests/project_lock_crash.rs`:** new, on §2.11's list.
     - **`kernel/tests/project_store.rs`:** new. Class 9, counted in kernel tests by Amendment 9 item 3.
     - **`kernel/tests/project_save.rs`:** class 9, by the same rule. T11 and T14 are appended, using its rig, and one bullet naming them is appended to its module doc. No existing test or line of it changes.
   - **(b) Ceilings by §2.11's groups.**
     - Kernel product 340: `store.rs` 300, `mod.rs` 40.
     - Protocol 10: the two comments.
     - Kernel tests 360: `project_lock_crash.rs` 130, `project_store.rs` 140, `project_save.rs` 90.
     - P1b: 710 lines and 7 files.
     - An overrun is class 8 in P1b's closing amendment. Neither §2.11 nor §7 is edited.
   - **(c) Tests and mutations.** Each fails at main by a missing symbol, which is a compile failure. T7, T12 and T14 also fail against main's behaviour. Mutations are observed by the round-25 rule.

     | Id | Test | File | Asserts | Mutation |
     |---|---|---|---|---|
     | T6 | `the_project_lock_is_refused_while_held_in_this_process_and_in_another_and_freed_by_a_crash` | `kernel/tests/project_lock_crash.rs` | `Held` in the same process, and taken after drop; `Held` while a child process (the `project_save_crash.rs` pattern) holds it; taken after the child aborts; `open.lock` stays empty | (a) no lock taken; (b) a `create_new` marker file in place of the lock |
     | T7 | `a_folder_flush_failing_after_the_rename_keeps_the_save` | `store.rs`, `mod tests` | with a failing flush, `commit_with` is `Ok`, `project.spatial` holds the new bytes, and no temp is left | the flush error returned |
     | T8 | `a_same_answer_past_256_known_folders_is_refused_and_the_folders_are_unchanged` | `kernel/tests/project_store.rs` | 255 known folders plus one gives 256; at 256 the result is `KnownFoldersFull` with count 256, and `to_bytes` of the list is unchanged | the oldest `same` entry dropped |
     | T9 | `a_move_makes_this_folder_first_and_forgets_the_old_first` | same | as 6 (a) states for `moved_to` | the old first kept in `same` |
     | T10 | `a_locations_json_the_reader_refuses_is_named` | same | a wrong format, a wrong version, bytes over the bound, malformed JSON and an entry missing a field are each refused with `file` = `LOCATIONS` | a refused file read as no entries |
     | T12 | `a_folder_path_the_folders_reader_would_refuse_is_refused_when_written` | same | a 4,096-byte `first` is written and read back; a 4,097-byte `first` and a 4,097-byte `same` entry are each refused, naming `folders.json`; a document over the byte bound (escaped control characters, built without touching disk) is refused | (a) the string bound removed; (b) the byte bound removed |
     | T13 | `the_locations_writer_refuses_what_its_reader_refuses_and_reads_back_the_rest` | same | a 4,096-byte path is written and read back equal; a 4,097-byte path is refused, naming `locations.json`; a path that is not valid Unicode is refused, not written altered (`cfg` in the test only) | (a) the string bound removed; (b) `to_string_lossy` restored |
     | T11 | `the_locations_reader_reads_back_what_a_save_writes` | `kernel/tests/project_save.rs` | after a real `Projects::save`, `read_locations` of the `locations.json` it wrote gives the dataset and the path | the reader's field names changed |
     | T14 | `a_save_whose_folder_path_folders_json_cannot_hold_is_refused_by_name_and_writes_nothing` | same; Windows only, by a run-time check as for K-R2 | `Projects::save` into an existing folder whose absolute path is over 4,096 bytes is refused as `MachineRecordRefused` naming `folders.json`; the folder has no `project.spatial`; the machine root has no identity folder | (a) the bound removed; (b) the documents built after the first write, which is main's order |

   - **(d) Pre-committed producers (R2; ADV-2026-11-16-16 item 1 (d)).**

     | Producer (`pub` item) | Consumer | Seam's end-to-end test |
     |---|---|---|
     | `store::OPEN_LOCK`, `ProjectLock`, `ProjectLock::try_lock` and `LockRefused` | `open_project`'s step 3 and `Projects::save` at a first save (P3a, item 4 (b)); the binding's lock state, dropped at `close_dataset` and by the session-end forwarder (P3b) | K-O4 and K-O5; working name `a_reopen_after_a_session_end_in_the_same_process_takes_the_lock`; working name `a_project_saved_first_in_this_process_is_refused_to_another_process_until_its_dataset_closes`; E-SECOND and E-CRASH-UNLOCK (P4) |
     | `KnownFolders::with_same` and `KnownFoldersFull` | the `same` arm, P3a | K-O11 and K-O6 |
     | `KnownFolders::moved_to` | the move arm, P3a | K-O6 widened, working name `a_move_answer_rewrites_folders_json_with_this_folder_first_and_asks_again_at_the_old_path` |
     | `store::read_locations` and `Location` | the machine-location arm, P3a | K-O3; K-O10 widened, working name `a_locations_json_the_reader_refuses_refuses_the_open_by_name_and_is_kept` |

     - `store::locations_to_bytes` is not ahead of its consumer: its product caller, `Projects::save`, changes in P1b.
     - Each working-named test is declared in full, with its mutation, in the consuming piece's amendment before its code (R2 (b)).
     - The node is not done until each seam's test has passed on main (R2 (c)).
     - Any other `pub` item in P1b is a gate finding (R2 (d)).
     - All of these are named in P1b's PR body and in the node's plan summary.
   - **(e) Stops.** The worker stops and reports alone when any of these happens:
     1. The diff changes a wire byte, a type, a fixture, or a protocol line beyond 6 (a)'s two comments (R1 (f)).
     2. A file outside 6 (a) is needed, or a region of `mod.rs` other than its two.
     3. An existing test, or a line of one, needs an edit (I3), or a dependency or a lock file changes (I6).
     4. A `pub` item outside 6 (d) is needed.
     5. A test passes at its base before its code, or a mutation does not fail its test.
     6. T7 needs a seam other than `commit_with`, or T14 cannot build its folder. A case a test cannot build is a stop, not a skip.
     7. A change to `remove_stale_temps`, or to where the lock is taken, is needed. Both are P3a's (item 4 (b)).
   - **(f) Gates.**
     - Full class, both gates, the architect and the reviewer (ADV-2026-11-16-16 item 1 (a)). Both read item 4 (a)'s change in what the user is told.
     - The full suites are CI's: the workspace on three platforms, fmt, clippy and the shell job.
     - On the laptop, in turns with P1a and P2 by THE MACHINE paragraph, P1b keeps at its final candidate:
       - the focused `project_lock_crash`, `project_store` and `project_save` test targets and the store's unit tests;
       - every mutation of 6 (c) observed;
       - §2.11's command;
       - empty lock-file diffs;
       - one E-SAVE run, an app-window run: every save the shipped app makes now goes through the changed write order and writers, and E-SAVE is the only run of the shipped app through them.

7. **The two parts against each other and the pieces in flight.**
   - **P1a and P1b share no file.**
     - P1a: `kernel/src/project/resolver.rs`, `kernel/src/dataset_ref.rs`, `kernel/tests/project_resolver.rs`.
     - P1b: `kernel/src/project/store.rs`, `kernel/src/project/mod.rs`, `protocol/skp/src/v0/error.rs`, `protocol/skp/SKP-V0.md`, `kernel/tests/project_lock_crash.rs`, `kernel/tests/project_store.rs`, `kernel/tests/project_save.rs`.
     - No test needs both parts' code. No helper is shared between them.
   - **P2** (`kernel/src/session_history.rs`, `kernel/tests/project_reopen.rs`) shares no file with either part.
   - P1a, P1b and P2 run beside each other, each in its own worktree and build folder (ADV-2026-11-16-16 item 1 (b)).
   - Rule (00): P1b is the only piece on `protocol/` while it is in progress. P1a and P2 touch nothing there.
   - **P3a** follows P1a, P1b and P2, and takes main in before its gate (ADV-2026-11-16-06 item 4).
   - **PR B @ 6f95993e** and the stream-refusal form draft (`state/consults/2026-11-16-shell-tiled-arm-stream-refusal-shown-to-the-user-form-draft-architect.md`, its §5) touch no kernel and no `protocol/` file.
   - The reviewer recomputes each file list with git against its branch.

8. **Superseded index.**
   - §8 item 19 is qualified for the move alone, by S2-2 (a).
   - §2.11's step-2 lists are added to by `kernel/tests/project_store.rs`, `kernel/tests/project_save.rs` and `LOCATIONS_LIMITS` (class 9).
   - §4's step-2 table is added to by T1 to T14.
   - §2.4 step 3's lock placement is to be widened to a first save by P3a's amendment (item 4 (b)). It is not superseded here.
   - The O-21 placement of N-10 in the architect's 2026-11-16 read is superseded by item 3.
   - Nothing else is superseded.

Nothing above is edited.

---

**Notes (each one mine):**

1. **Item 1 (e), for the advisor before code.** The split does not cost a shared helper, and no test has to sit in both parts. One test helper is copied: `make_link`, from `kernel/tests/project_save.rs` into P1a's `kernel/tests/project_resolver.rs`. The split did not cause the copy. §2.11 already plans `project_resolver.rs` as its own test target, and P3a's K-R1 and K-R2 need a link maker there too. Each file under `kernel/tests` is its own crate, so sharing the helper would mean moving it into a shared module, which edits `project_save.rs`. P1b avoids the matching copy of the save rig by appending T11 and T14 to `project_save.rs`. The amendment stays as it is either way.
2. **Two assumptions behind T14 and T13.** T14 assumes Rust std on Windows passes paths over MAX_PATH in the `\\?\` form, so the test can create its folder. If not, stop 6 holds. T13's case of a path that is not valid Unicode is, by my reading, not reachable from the shell, whose paths arrive as JSON strings that are checked as valid Unicode. The writer refuses it anyway.
3. **T14's scope.** T14 asserts the refusal at `Projects::save`. Its wire code comes from `skp_error_of`'s existing, unchanged mapping, so T14 does not assert the wire code again.
4. **The directive's cite.** ADV-2026-11-16-16 is cited by id. The custodian files it in `state/directives/` before or with this amendment, so nothing tracked cites an untracked file.
5. **Code read after the move of main.** Main moved from f4027cc0 to 2a8907b8. I re-read only the form's amendment headings at 2a8907b8. The coordinator says the form did not change; I did not diff the kernel between the two commits.
