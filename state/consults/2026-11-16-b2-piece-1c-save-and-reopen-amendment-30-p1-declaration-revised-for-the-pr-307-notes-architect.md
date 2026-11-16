# b2-piece-1c-save-and-reopen: Amendment 30, the P1 declaration, revised for the PR 307 review's two notes; the architect's report

*Filed by the custodian from the hand-back: 24296 bytes, sha256 cff1138df22699336066e27a45b0b83092d97a46645730f15b695f250c496d2b, claude-opus-5-5, 12 calls by its transcript since its first report. Byte for byte below the rule. A draft, not appended: the advisor split P1 (`state/directives/2026-11-16-advisor-ruling-adv-2026-11-16-16-the-reopens-p1-split-into-p1a-the-resolver-and-p1b-the-store-and-the-lock-the-pr-307-notes-placed.md`), and the split draft is the one appended.*

---

Drafted: b2-piece-1c-save-and-reopen Amendment 30 (P1), architect, revised for item 5 (b)
What changed from my first draft: both #307 review notes are now named items. The path-length bound goes into P1: the writers are bounded to their readers, `locations_json` moves into the store, and the save builds its machine documents before its first write. That adds T12 to T14 and two `kernel/src/project/mod.rs` regions, and raises the ceilings. The stale temp goes to P3a and P3b, which take the identity's lock at a first save. That adds a consumer row to the lock's producer. Stop 7 is reworded.
Reviewed: main @ f4027cc05f296bb34697cb518ebf896b5c9ef618. The review was read at `state/drafts/2026-11-11-platform-independent-review-pr-307.md`, which the coordinator places on main at 1d68d94527914d371c6c6478bffc235e4df29020. PR B worktree `C:/dev/wt/m4b` @ 6f95993e37255513bf7f5d78b519bc3a71562fb0, read only.

I have no shell, so this report gives no sha256.

---

## Amendment 30 — the reopen's P1 declared before its code (ADV-2026-11-16-10, R1 and R2): the rulings onto the form (class 5); D2's rename (class 1); the O-items and the #307 review's two named items that bear on P1; P1's scope, ceilings, tests, mutations, pre-committed producers, regions, stops and gates; a test file and a reader bound outside §2.11 and §7 (class 9)

*Drafted by the architect for the custodian, read only, at main f4027cc05f296bb34697cb518ebf896b5c9ef618, and appended by the custodian's script. References only. Nothing below is a quotation. Under ADV-2026-11-16-10 item 5, each choice below is the custodian's declaration; where it is the architect's recommendation, it says so. Rulings are cited by file and item. Code is cited by path and symbol.*

1. **The rulings onto the form (class 5, D1).**
   - The human's directive of 2026-10-23 (`state/directives/2026-10-23-clicks-245-246-247-sort-window-fix-before-port-2-covering-case-route-1-244-c1-milestone-4-and-1c-open-items-ruled.md`, its `Piece 1c:` line): OPEN-S2-1 (c), S2-2 (a), S2-3 (a) and S2-4 (a).
   - The human's message of 2026-11-12, 13:07Z (`state/directives/2026-11-12-s1-fix-open-a-c-s6b-now-pr-b-class-9-now-1c-five-308-c1-words-platform-reports-order-no-git-stash.md`): item 3 (a), (d) and (e), and item 5 (b). Item 5 (b) is placed in item 4 below.
   - ADV-2026-11-16-10 (`state/directives/2026-11-16-advisor-ruling-adv-2026-11-16-10-the-reopen-r1-to-r4-five-pieces-p3-split-producers-ahead-pre-committed-a-later-runs-reopen-does-not-bind-adr-036-amendment-3.md`), items 1 to 6.
   - Step 2 is P1, P2, P3a, P3b, P4 and P5 (R1 (a)). This amendment declares P1 alone. Each later piece is declared in its own amendment before its code.

2. **D2 (class 1).** The 2026-10-23 draft's conditional K-S14 (`state/consults/2026-10-23-b2-piece-1c-save-and-reopen-steps-2-and-3-ahead-architect-draft.md`, its conditional row) collides with Amendment 20's K-S14.
   - It is renamed **K-O16** (the architect's recommendation: the next id after the draft's K-O12 to K-O15).
   - It belongs to P3a and is declared there, under R3.

3. **The O-items that bear on P1.** Each is the architect's recommendation.
   - **O-7, K-S15's length check stays.** P1's lock is on `open.lock` in the identity's machine folder. It is not on the history. The recorder keeps its own exclusive lock on `history.jsonl` (`kernel/src/session_history.rs`, the `try_lock` calls in its record writers), and Windows refuses a read of a locked file. So the record still cannot be read while the recorder holds it (item 3 (a) of 2026-11-12). P1 has no code for this.
   - **O-8, D-16 is built in P1**, the stack's first PR to touch the store (item 3 (d) of 2026-11-12).
     - In `kernel/src/project/store.rs`, `Staged::commit` becomes a call of a private `commit_with(flush)`, with `sync_folder` passed as `flush`.
     - A flush that fails after a successful rename no longer refuses the save.
     - The failure is written to standard error by `eprintln!` as an engine fact only: that the folder flush failed after the rename, and the error kind. It gives no path, no handle and no duration, as in `kernel/src/skp.rs`.
     - `commit_with`'s product caller is `commit`, which `Projects::save` reaches through `replace` on main.
   - **O-21.**
     - C-7's resolver unit test is P1's (T5).
     - C-7's restated K-R3 is P3a's (R1 (g)).
     - **N-10 lands in P3a**, where `check_inside` gets its product caller: N-10's words say containment is checked when the data is opened. In P1, `in_canonical_form` changes visibility only.
   - **Not P1's:**
     - O-6 is P3a's.
     - O-9, O-18 and O-19 are P4's, and go to the advisor.
     - O-10 to O-17 and O-20 are P3a's, P3b's or P4's, as the packet lists them.
     - C-6's withdrawal of `project_target_outside_folder` (§2.2), and the code for a non-directory intermediate or a non-regular final, are P3b's (R1 (e)).

4. **The #307 review's two notes: named items of step 2 (class 5, item 5 (b) of 2026-11-12).** The source is `state/drafts/2026-11-11-platform-independent-review-pr-307.md`, its final report's Notes, which repeat the earlier pass's two notes. It is a reading, cited as evidence.
   - **(a) The path-length bound: P1's.**
     - **The defect at main.** `KnownFolders::to_bytes` in `kernel/src/project/store.rs` checks that a path is absolute UTF-8 and checks the folder count. It does not check a path's length or the document's size. `locations_json` in `kernel/src/project/mod.rs` bounds nothing, and it writes the path by `to_string_lossy`. `KnownFolders::from_bytes` reads under `FOLDERS_LIMITS`, which allows 4,096 bytes per string after decoding (`kernel/src/project/strict_json.rs`, the reader's `string`) and 2,097,152 bytes per document. So a save can write a machine-store file that step 2's reader refuses. A path that is not valid Unicode is written to `locations.json` altered, and would read back as a different path.
     - **Answer to the coordinator's question.** With T10, T11 and `LOCATIONS_LIMITS` at `FOLDERS_LIMITS`'s values alone, P1 would not read back everything a save writes. A path over 4,096 bytes would be written and then refused at read, in both files. A path that is not valid Unicode would read back altered.
     - **P1 closes this, with no wire change.** Each writer refuses, by name, what its reader refuses:
       - `KnownFolders::to_bytes` refuses a path over `FOLDERS_LIMITS`'s string bound and a document over its byte bound.
       - `locations_json` moves from `mod.rs` to the store as `pub fn locations_to_bytes(uri, at)`, beside `read_locations`, under `LOCATIONS_LIMITS`. It refuses a path that is not valid Unicode instead of writing it altered, and refuses one over the string bound.
       - `Projects::save` builds both documents before its first machine-store write. A refusal then writes nothing: no identity folder and no project file.
     - **The refusal's route already exists.** It is `SaveFailure::MachineRecordRefused`, which `skp_error_of` maps to `skp.project_file_refused` with the file's name as `path`. SKP-V0 §11.4's row for that code already covers a machine-store file that breaks a rule its reader holds, and `project_file_refused`'s doc in `protocol/skp/src/v0/error.rs` already covers a file the save keeps. So no code, type, fixture or protocol doc changes, and the shell's string is unchanged.
     - With these writer bounds, every document either writer emits is within its reader's limits. T12 and T13 prove this at the bound; T11 and T14 prove it on the save path.
     - **Left outside P1, and named.**
       - The record's own `locations.json`, written in `kernel/src/session_history.rs` (`create`, P2's file), has the same unbounded, altering writer. Its reader is step 3's (§2.6). The piece that builds that reader bounds that writer to it, or uses `locations_to_bytes`, declared before its code.
       - At the reopen, P3a writes `folders.json` through `to_bytes`, so a same or move answer whose folder path is over the bound is refused there. P3a maps that refusal to a code, and P3b's declaration names it (R1 (e)).
   - **(b) The stale temp: P3a's and P3b's, not P1's.**
     - **The defect at main.** `remove_stale_temps` in `kernel/src/project/store.rs` removes every `project.spatial.tmp-<16 hex>` in the folder after a rename. That includes a temp another process has staged and not yet renamed. That process's rename then fails five times, and its save is refused as `RenameKeepsFailing`. The previous file is left in place, so nothing is corrupted, but the save is lost.
     - **Why P1 cannot close it alone.** The store has no rule for telling a crash's temp from a live one. Only the identity's lock can tell them apart. §2.4 step 3 takes the lock at a reopen, but the form's machine-store item (§2.2's `open.lock`) holds it while the project is open, and a project is open from its first save. So P3a takes `ProjectLock::try_lock` in `Projects::save` at a first save, after minting and before staging, and P3b holds that lock in the binding until `close_dataset`, as §2.7 does for a reopen. A second process's open of that identity is then refused with `project_open_elsewhere`, and only the lock's holder saves into the folder. P3a's amendment declares this before its code, as class 9 if it is read as beyond §2.4 step 3.
     - **Residual, named.** Two processes making a first save into one empty folder, between the save's folder check and its rename, are not excluded: their identities differ, so no lock is shared. This is a window inside one save request, not reachable in ordinary use. `remove_stale_temps`'s doc names it in P3a.
     - P1 does not change `remove_stale_temps`.

5. **Scope: files and regions by symbol** (the architect's recommendation).
   - **`kernel/src/project/resolver.rs`:** a new `pub fn check_inside(folder, at)` (§2.5), its error type, and a new `mod tests`.
     - It runs `in_canonical_form` on `at` first. It then walks from the folder one segment at a time, by `symlink_metadata` only, and opens no file:
       - a link or junction is refused;
       - a missing segment is refused as unresolvable;
       - a non-directory intermediate or a non-regular final is refused by name;
       - otherwise it returns the engine path, in the `\\?\` form on Windows (H4).
     - A cloud placeholder is a regular file to `symlink_metadata` and opens (§2.5).
     - It has no wire code. `judge` is unchanged.
   - **`kernel/src/project/store.rs`:**
     - `pub const OPEN_LOCK` (Amendment 18 item 1).
     - `pub struct ProjectLock` and `pub fn ProjectLock::try_lock(root, project)`, with `pub enum LockRefused { Held, Io }`: it creates the identity's folder and `open.lock` if they are absent, never truncates or writes the file, and takes `File::try_lock`; drop frees the lock.
     - `pub fn KnownFolders::with_same`, with `pub struct KnownFoldersFull { count }`: pure; a folder already known returns the list unchanged; at `MAX_KNOWN_FOLDERS`, with `first` counted, it is refused and nothing is dropped (M2).
     - `pub fn KnownFolders::moved_to`: pure; the new folder becomes `first` and leaves `same` if it was there; the old `first` is forgotten (S2-2 (a)).
     - `KnownFolders::to_bytes`: the bounds of item 4 (a).
     - `pub fn locations_to_bytes(uri, at)`, moved from `mod.rs` (item 4 (a)).
     - `pub fn read_locations(bytes)` and `pub struct Location { dataset, path }`, refusing any other shape by name with `file` set to `LOCATIONS`.
     - A private `LOCATIONS_LIMITS` at its site (class 9, outside §7), with `FOLDERS_LIMITS`'s values.
     - `Staged::commit` and `commit_with` (D-16), with the docs of `Staged::commit` and `sync_folder` brought to the built behaviour (D4).
     - A new `mod tests`.
   - **`kernel/src/project/mod.rs`**, two regions:
     - `locations_json` is removed;
     - in `Projects::save`, the machine-store block (from `record_dir` to the `folders.json` write) builds both documents before `create_dir_all` and calls `locations_to_bytes`.
     - Nothing else in the file changes.
   - **`kernel/src/dataset_ref.rs`:** `in_canonical_form` becomes `pub(crate)`. Nothing else.
   - **`protocol/skp/src/v0/error.rs`:** the `//` comment above `project_file_unwritable` that names the POSIX refusal after the rename is removed.
   - **`protocol/skp/SKP-V0.md`:** §11.3's HTML comment with the same text is removed.
   - **Tests:**
     - `kernel/tests/project_resolver.rs` (new, on §2.11's list);
     - `kernel/tests/project_lock_crash.rs` (new, on §2.11's list);
     - `kernel/tests/project_store.rs` (new; class 9, counted in kernel tests by Amendment 9 item 3).

6. **Ceilings by §2.11's command.** These are step 2's groups split per piece (D5). Neither §2.11 nor §7 is edited, and an overrun is class 8 in the closing amendment.

   | File | Ceiling (lines) |
   |---|---|
   | `kernel/src/project/resolver.rs` | 130 |
   | `kernel/src/project/store.rs` | 300 |
   | `kernel/src/project/mod.rs` | 40 |
   | `kernel/src/dataset_ref.rs` | 5 |
   | `protocol/skp/src/v0/error.rs` and `protocol/skp/SKP-V0.md` | 10 together |
   | `kernel/tests/project_resolver.rs` | 200 |
   | `kernel/tests/project_lock_crash.rs` | 130 |
   | `kernel/tests/project_store.rs` | 220 |

   - By group: kernel product 475 (of 1,400), protocol 10 (of 320), kernel tests 550 (of 1,300).
   - P1: 1,035 lines and 9 files.
   - **Why P1 is not smaller (R1 (d)):**
     - D-16 and the writer bounds must be in the first store PR (item 3 (d) of 2026-11-12; item 4 (a)).
     - Every producer here has the one consumer piece, P3a, so a split brings no consumer earlier.
     - Product code is under half the lines.
     - If the custodian splits anyway, the line is by file: P1a is `resolver.rs`, `dataset_ref.rs` and `kernel/tests/project_resolver.rs`, about 335 lines; P1b is the rest, about 700. Both land before P3a.

7. **Tests, declared before code.** Each fails at main because its symbol does not exist, which is a compile failure. T7, T12 and T14 also fail against main's behaviour.
   - Each mutation is observed by the round-25 rule: applied, the named test run, its failure recorded by name with the commit, then reverted.
   - A `verify-mutation` run is not called an observation.

   | Id | Test | File | Asserts | Mutation |
   |---|---|---|---|---|
   | T1 | `check_inside_refuses_a_link_below_the_folder_naming_its_segment` | `kernel/tests/project_resolver.rs` | a junction on Windows, or a symlink elsewhere, at an intermediate and at the final, is refused as through a link, naming the segment | the link check skipped |
   | T2 | `check_inside_refuses_a_missing_segment_as_unresolvable` | same | a missing intermediate and a missing final are each refused as unresolvable, naming the segment | a missing segment treated as a directory |
   | T3 | `check_inside_refuses_a_final_that_is_not_a_regular_file_or_an_intermediate_that_is_not_a_folder` | same | a directory as the final, and a file as an intermediate, are each refused by name | the kind check skipped |
   | T4 | `check_inside_returns_the_engine_path_for_data_reached_without_a_link` | same | the canonical folder joined with `at`, in the `\\?\` form on Windows (checked at run time, with no `cfg` in product code, §2.9) | the folder not canonicalized |
   | T5 | `check_inside_refuses_a_non_canonical_at_before_any_file_is_read` | `resolver.rs`, `mod tests` (C-7) | a device name, a trailing dot and a `..` segment are refused, with a folder that does not exist | `in_canonical_form` not called |
   | T6 | `the_project_lock_is_refused_while_held_in_this_process_and_in_another_and_freed_by_a_crash` | `kernel/tests/project_lock_crash.rs` | `Held` in the same process, and taken after drop; `Held` while a child process (the `project_save_crash.rs` pattern) holds it; taken after the child aborts; `open.lock` stays empty | (a) no lock taken; (b) a `create_new` marker file in place of the lock |
   | T7 | `a_folder_flush_failing_after_the_rename_keeps_the_save` | `store.rs`, `mod tests` | with a failing flush, `commit_with` is `Ok`, `project.spatial` holds the new bytes, and no temp is left | the flush error returned, which is main's behaviour |
   | T8 | `a_same_answer_past_256_known_folders_is_refused_and_the_folders_are_unchanged` | `kernel/tests/project_store.rs` | 255 known folders plus one gives 256; at 256 the result is `KnownFoldersFull` with count 256, and `to_bytes` of the list is unchanged | the oldest `same` entry dropped |
   | T9 | `a_move_makes_this_folder_first_and_forgets_the_old_first` | same | `first` is the new folder, `same` is kept, the old first is gone, and the new folder is not repeated | the old first kept in `same` |
   | T10 | `a_locations_json_the_reader_refuses_is_named` | same | a wrong format, a wrong version, bytes over the bound, malformed JSON and an entry missing a field are each refused with `file` = `LOCATIONS` | a refused file read as no entries |
   | T11 | `the_locations_reader_reads_back_what_a_save_writes` | same | a real `Projects::save` (the rig rebuilt in this file), then `read_locations` of the `locations.json` it wrote, gives the dataset and the path | the reader's field names changed |
   | T12 | `a_folder_path_the_folders_reader_would_refuse_is_refused_when_written` | same | a `first` path of exactly 4,096 bytes is written, and `from_bytes` gives it back; a `first` and a `same` path of 4,097 bytes are each refused, naming `folders.json`; a list whose document passes the byte bound is refused (escaped control characters, built without touching disk) | (a) the string bound removed; (b) the byte bound removed |
   | T13 | `the_locations_writer_refuses_what_its_reader_refuses_and_reads_back_the_rest` | same | a path of 4,096 bytes is written and read back equal; one of 4,097 bytes is refused, naming `locations.json`; a path that is not valid Unicode is refused, not written altered (`cfg` in the test only) | (a) the string bound removed; (b) `to_string_lossy` restored |
   | T14 | `a_save_whose_folder_path_folders_json_cannot_hold_is_refused_by_name_and_writes_nothing` | same, Windows only, by a run-time check as for K-R2 (a POSIX absolute path over 4,096 bytes fails the folder check first) | `save_project` into an existing folder whose absolute path is over 4,096 bytes is refused with `skp.project_file_refused`, `path` = `folders.json`; the folder has no `project.spatial`; the machine root has no identity folder | (a) the bound removed (the save succeeds); (b) the documents built after the first write, which is main's order |

   - No existing test is edited (I3).
   - The cloud placeholder case is not tested, since a test cannot make one. The closing amendment names this gap.

8. **Pre-committed producers (R2).** These are named here, in P1's PR body and in the node's plan summary.

   | Producer (`pub` item) | Consumer | Seam's end-to-end test |
   |---|---|---|
   | `resolver::check_inside` and its error type | `Projects::open_project`'s data step, P3a | K-R1, K-R2, K-R4 (§4); K-R3 as C-7 restates it, working name `a_device_name_or_trailing_dot_target_is_refused_at_read_before_any_open` (`project_file_refused` at the locator's `at`, with nothing opened); then E-REOPEN |
   | `store::OPEN_LOCK`, `ProjectLock`, `ProjectLock::try_lock` and `LockRefused` | `open_project`'s step 3 and `Projects::save` at a first save (P3a, item 4 (b)); the binding's lock state, dropped at `close_dataset` and by the session-end forwarder (P3b, §2.7) | K-O4 and K-O5; working name `a_reopen_after_a_session_end_in_the_same_process_takes_the_lock`; working name `a_project_saved_first_in_this_process_is_refused_to_another_process_until_its_dataset_closes` (`project_open_elsewhere` for a second process's open of an identity this process first saved, and nothing staged by it); E-SECOND and E-CRASH-UNLOCK (P4) |
   | `KnownFolders::with_same` and `KnownFoldersFull` | the `same` arm, P3a | K-O11 and K-O6 |
   | `KnownFolders::moved_to` | the move arm, P3a | K-O6 widened, working name `a_move_answer_rewrites_folders_json_with_this_folder_first_and_asks_again_at_the_old_path` |
   | `store::read_locations` and `Location` | the machine-location arm, P3a | K-O3; K-O10 widened, working name `a_locations_json_the_reader_refuses_refuses_the_open_by_name_and_is_kept` |

   - `store::locations_to_bytes` is not ahead of its consumer. Its product caller, `Projects::save`, changes in P1 itself.
   - Each working-named test is declared in full, with its mutation, in P3a's or P3b's amendment before that piece's code (R2 (b)).
   - The node is not done until each seam's test has passed on main (R2 (c)).
   - A `pub` item of P1 that is in neither this table nor the line above is a gate finding (R2 (d)). The precedent is Amendment 16 item 1 (R2 (e)).
   - Each producer's doc names its consumer and this item.

9. **Regions against the pieces in flight.**
   - **P2:** `kernel/src/session_history.rs` and `kernel/tests/project_reopen.rs`. It shares no file with P1.
   - **P3a:** follows P1 and P2. It takes `mod.rs` after P1's merge, taking main in before its gate (ADV-2026-11-16-06 item 4).
   - **PR B @ 6f95993e:** shell files. It touches no file named in item 5.
   - **The stream-refusal form draft** (`state/consults/2026-11-16-shell-tiled-arm-stream-refusal-shown-to-the-user-form-draft-architect.md`): its §5 puts the kernel and `protocol/` out of scope.
   - Rule (00): P1 is the only piece on `protocol/` while it is in progress.
   - The reviewer recomputes the file lists with git against each branch.
   - P1 and P2 each have their own worktree, build folder and test-data folder, and their heavy runs take turns (R1 (c)).

10. **Stops.** The worker stops and reports alone when any of these happens:
    1. The diff changes a wire byte, a type, a fixture or a protocol doc beyond item 5's two comments (R1 (f)).
    2. A file not in item 5 is needed, or a region of `mod.rs` other than item 5's two.
    3. An existing test needs an edit (I3), or a dependency or a lock file changes (I6).
    4. A `pub` item outside item 8 is needed.
    5. A test passes at its base before its code, or a mutation does not fail its test.
    6. T7 needs a seam other than `commit_with`, or T14 cannot build its folder. A case the test cannot build is a stop, not a skip.
    7. A change to `remove_stale_temps`, or to where the lock is taken, is needed. Both are P3a's (item 4 (b)).

11. **Gates: full class, both gates** (ADV-2026-11-16-06 item 2 (a): persistence, concurrency, seams, more than 260 lines).
    - The architect and the reviewer gate P1. §9's suites run once at the final candidate, by THE MACHINE paragraph:
      - the workspace `cargo test --locked` with `spatial-engine/fixture`, fmt and clippy;
      - §2.11's command;
      - empty lock-file diffs;
      - every mutation of item 7 observed.
    - Of the e2e suites, only E-SAVE reaches a changed line (`Projects::save`, `Staged::commit`), so E-SAVE runs. Where §9 asks for more, §9 governs.

12. **Superseded index.**
    - §8 item 19 is qualified for the move alone, by S2-2 (a).
    - §2.11's step-2 lists are added to by `kernel/tests/project_store.rs` and by `LOCATIONS_LIMITS` (class 9).
    - §4's step-2 table is added to by T1 to T14.
    - §2.4 step 3's lock placement is to be widened to a first save by P3a's amendment (item 4 (b)). It is not superseded here.
    - The O-21 placement of N-10 in the architect's 2026-11-16 read is superseded by item 3.
    - Nothing else is superseded.

Nothing above is edited.

---

**Notes (each one mine):**

1. **Long Windows paths in T14.** I am assuming Rust std on Windows passes paths over MAX_PATH in the `\\?\` form, so T14 can create its deep folder with `create_dir_all`. If that does not hold on this machine, T14 hits stop 6 and the worker reports it.
2. **Unicode paths from the shell.** I am assuming the shell's paths reach the kernel as JSON strings that `serde_json` has already checked as valid Unicode. If so, T13's not-valid-Unicode case is not reachable in the shipped app. The writer refuses it anyway, so that the reader and the writer agree.
3. **The review's other notes.** The review has other notes, for example `mod.rs`'s "only file written" doc sentence. They are not item 5 (b)'s and are not placed here.
