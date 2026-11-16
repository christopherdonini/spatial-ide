# b2-piece-1c-save-and-reopen: Amendment 30, the P1 declaration, its first draft; the architect's report

*Filed by the custodian from the hand-back: 20174 bytes, sha256 a2d49ff38b6acbd288b11eb53d11ce14474ca12f142cccc1019dfdd70cc2707e, claude-opus-5-5, 91 calls by its transcript. Byte for byte below the rule. A draft, not appended: its stop 7 (item 5 (b) of the human's message of 2026-11-12) is being placed by its revision.*

---

Drafted: b2-piece-1c-save-and-reopen Amendment 30 (P1), architect
Choices left for the advisor: 0. ADV-2026-11-16-10 item 5 makes D1, D2, D4, D5 and O-6 to O-21 the custodian's. O-9, O-18 and O-19 are P4's and go to the advisor with P4's declaration.
Reviewed: main @ f4027cc05f296bb34697cb518ebf896b5c9ef618; PR B worktree `C:/dev/wt/m4b` @ 6f95993e37255513bf7f5d78b519bc3a71562fb0, read only.

I have no shell, so this report gives no sha256 anywhere.

---

## Amendment 30 — the reopen's P1 declared before its code (ADV-2026-11-16-10, R1 and R2): the rulings onto the form (class 5); D2's rename (class 1); the O-items that bear on P1; P1's scope, ceilings, tests, mutations, pre-committed producers, regions, stops and gates; a test file and a reader bound outside §2.11 and §7 (class 9)

*Drafted by the architect for the custodian, read only, at main f4027cc05f296bb34697cb518ebf896b5c9ef618, and appended by the custodian's script. References only. Nothing below is a quotation. Under ADV-2026-11-16-10 item 5, each choice below is the custodian's declaration; where it is the architect's recommendation, it says so. Rulings are cited by file and item. Code is cited by path and symbol.*

1. **The rulings onto the form (class 5, D1).**
   - The human's directive of 2026-10-23 (`state/directives/2026-10-23-clicks-245-246-247-sort-window-fix-before-port-2-covering-case-route-1-244-c1-milestone-4-and-1c-open-items-ruled.md`, its `Piece 1c:` line): OPEN-S2-1 (c), S2-2 (a), S2-3 (a) and S2-4 (a).
   - The human's message of 2026-11-12, 13:07Z (`state/directives/2026-11-12-s1-fix-open-a-c-s6b-now-pr-b-class-9-now-1c-five-308-c1-words-platform-reports-order-no-git-stash.md`): item 3 (a), (d) and (e), and item 5 (b).
   - ADV-2026-11-16-10 (`state/directives/2026-11-16-advisor-ruling-adv-2026-11-16-10-the-reopen-r1-to-r4-five-pieces-p3-split-producers-ahead-pre-committed-a-later-runs-reopen-does-not-bind-adr-036-amendment-3.md`), items 1 to 6.
   - Step 2 is P1, P2, P3a, P3b, P4 and P5 (R1 (a)). This amendment declares P1 alone. P2 to P5 are each declared in their own amendment before their code.

2. **D2 (class 1).** The 2026-10-23 draft's conditional K-S14 (`state/consults/2026-10-23-b2-piece-1c-save-and-reopen-steps-2-and-3-ahead-architect-draft.md`, its conditional row) collides with Amendment 20's K-S14.
   - It is renamed **K-O16** (the architect's recommendation: the next id after the draft's K-O12 to K-O15).
   - It belongs to P3a and is declared there, under R3.
   - It is not P1's.

3. **The O-items that bear on P1.** Each is the architect's recommendation.
   - **O-7, K-S15's length check stays.** The reason, as item 3 (a) of 2026-11-12 asks: the lock P1 builds is on `open.lock` in the identity's machine folder. It is not on the history. The recorder keeps its own exclusive lock on `history.jsonl` (`kernel/src/session_history.rs`, the `try_lock` calls in its record writers), and Windows refuses a read of a locked file. So the store's lock does not make the record readable while the recorder holds it. The renamed K-S15 (Amendment 29) keeps its metadata length. P1 has no code for this.
   - **O-8, D-16 is built in P1**, the stack's first PR to touch the store (item 3 (d) of 2026-11-12).
     - In `kernel/src/project/store.rs`, `Staged::commit` becomes a call of a private `commit_with(flush)`, with the product's `sync_folder` passed as `flush`.
     - A flush that fails after a successful rename no longer refuses the save. `commit` returns `Ok`.
     - The failure is written to standard error by `eprintln!` as an engine fact only: that the folder flush failed after the rename, and the error kind. It gives no path, no handle and no duration, following the kernel's existing convention in `kernel/src/skp.rs`.
     - The test makes the flush fail through `commit_with`. Its product caller is `commit`, and `commit`'s product caller, `Projects::save` through `replace`, is on main. So no seam exists for the test alone.
   - **O-21.**
     - C-7's resolver unit test is P1's (item 5, T5).
     - C-7's restated K-R3 is P3a's (R1 (g)).
     - **N-10 moves to P3a.** The architect's recommendation, which corrects the architect's own read: N-10's replacement words say containment is checked when the data is opened, and that becomes true only when `Projects::open_project` calls `check_inside`, in P3a. In P1, `in_canonical_form` changes visibility only (item 4). Its doc and `Locator::ProjectRelative`'s doc in `kernel/src/dataset_ref.rs` keep their present words until P3a.
   - **Item 5 (b) of 2026-11-12.** This is the #307 review's notes on the path-length bound and the stale temp file. Both are named items of step 2 (class 5). P1's code waits for the custodian to place them (stop 7, item 8). Whichever lands in P1's files is declared by an appended amendment (class 9) before P1's code.
   - **Not P1's:**
     - O-6 is P3a's.
     - O-9, O-18 and O-19 are P4's, and go to the advisor (item 5 of ADV-2026-11-16-10).
     - O-10 to O-17 and O-20 are P3a's, P3b's or P4's, as the packet lists them.
     - C-6's withdrawal of `project_target_outside_folder` (§2.2), and the code for a non-directory intermediate or a non-regular final, are P3b's (R1 (e)).

4. **Scope: files and regions by symbol** (the architect's recommendation).
   - **`kernel/src/project/resolver.rs`:**
     - a new `pub fn check_inside(folder, at)` (§2.5) and its error type;
     - a new `mod tests`.
     - `check_inside` runs `in_canonical_form` on `at` first. It then walks from the folder one segment at a time, by `symlink_metadata` only, so it opens no file and holds no handle:
       - a link or junction at any segment is refused;
       - a missing segment is refused as unresolvable;
       - an intermediate that is not a directory, or a final that is not a regular file, is refused by name;
       - otherwise it returns the engine path, in the `\\?\` form on Windows (H4).
     - A cloud placeholder is a regular file to `symlink_metadata` and is not refused (§2.5).
     - The function has no wire code. P3a maps its refusals to codes.
     - `judge` and `reached_through_link` are unchanged.
   - **`kernel/src/project/store.rs`:**
     - `pub const OPEN_LOCK` (it returns with the lock, Amendment 18 item 1);
     - `pub struct ProjectLock` and `pub fn ProjectLock::try_lock(root, project)`, with `pub enum LockRefused { Held, Io }`:
       - it creates the identity's folder and `open.lock` if they are absent;
       - it never truncates or writes the file, and takes the operating system's exclusive file lock (`File::try_lock`);
       - drop frees the lock, and the file stays.
     - `pub fn KnownFolders::with_same(&self, folder) -> Result<KnownFolders, KnownFoldersFull>`, with `pub struct KnownFoldersFull { count }`:
       - it is pure;
       - a folder already known returns the list unchanged;
       - when the list already holds `MAX_KNOWN_FOLDERS` with `first` counted, it is refused and nothing is dropped (M2).
     - `pub fn KnownFolders::moved_to(&self, folder) -> KnownFolders`:
       - it is pure;
       - `folder` becomes `first` and is removed from `same` if it was there;
       - `same` is otherwise kept, and the old `first` is forgotten (S2-2 (a)).
     - `pub fn read_locations(bytes) -> Result<Vec<Location>, MachineRecordRefused>`, with `pub struct Location { dataset, path }`:
       - it reads the shape the private `locations_json` writer in `kernel/src/project/mod.rs` writes;
       - it refuses any other shape by name, with `file` set to `LOCATIONS`;
       - its bound is a private `LOCATIONS_LIMITS` declared at its site (class 9, outside §7), with the values of `FOLDERS_LIMITS`.
     - `Staged::commit` gets the private `commit_with` (D-16, item 3).
     - The docs of `Staged::commit` and `sync_folder` change to the built behaviour (D4).
     - A new `mod tests`.
     - No file is written by P1's new code: the `folders.json` and `locations.json` writers stay in `mod.rs`, P3a's file.
   - **`kernel/src/dataset_ref.rs`:** `in_canonical_form` becomes `pub(crate)`. Nothing else.
   - **`protocol/skp/src/v0/error.rs`:** the `//` comment above `project_file_unwritable` that names the POSIX refusal after the rename is removed. The variant's `///` doc is unchanged.
   - **`protocol/skp/SKP-V0.md`:** §11.3's HTML comment with the same text is removed. No other byte of the file changes.
   - **`kernel/tests/project_resolver.rs`** (new, on §2.11's list).
   - **`kernel/tests/project_lock_crash.rs`** (new, on §2.11's list).
   - **`kernel/tests/project_store.rs`** (new; class 9, a test file not on §2.11's list, counted in kernel tests by Amendment 9 item 3).

5. **Ceilings by §2.11's command.** These are step 2's groups split per piece (D5). Neither §2.11 nor §7 is edited, and an overrun is a class 8 row in the closing amendment.

   | File | Ceiling (lines) |
   |---|---|
   | `kernel/src/project/resolver.rs` | 130 |
   | `kernel/src/project/store.rs` | 260 |
   | `kernel/src/dataset_ref.rs` | 20 |
   | `protocol/skp/src/v0/error.rs` and `protocol/skp/SKP-V0.md` | 10 together |
   | `kernel/tests/project_resolver.rs` | 200 |
   | `kernel/tests/project_lock_crash.rs` | 130 |
   | `kernel/tests/project_store.rs` | 130 |

   - By group: kernel product 410 (of 1,400), protocol 10 (of 320), kernel tests 460 (of 1,300).
   - P1: 880 lines and 8 files.
   - **Why P1 is not smaller (R1 (d)):**
     - D-16 must be in the first store PR (item 3 (d) of 2026-11-12).
     - The three producers have one consumer piece, P3a. A further split adds a PR and a gate round and brings no consumer earlier.
     - The product half is about 420 lines. The rest is tests.

6. **Tests, declared before code.** Each fails at main because its symbol does not exist there, which is a compile failure. T7 also fails against main's behaviour.
   - Each mutation is observed by the round-25 rule: applied, the named test run, its failure recorded by name with the commit, then reverted.
   - A `verify-mutation` run is not called an observation.

   | Id | Test | File | Asserts | Mutation |
   |---|---|---|---|---|
   | T1 | `check_inside_refuses_a_link_below_the_folder_naming_its_segment` | `kernel/tests/project_resolver.rs` | a junction on Windows, or a symlink elsewhere, at an intermediate and at the final, is refused as through a link, naming that segment; the target is not opened | the link check skipped |
   | T2 | `check_inside_refuses_a_missing_segment_as_unresolvable` | same | a missing intermediate and a missing final are refused as unresolvable, naming the segment | a missing segment treated as a directory |
   | T3 | `check_inside_refuses_a_final_that_is_not_a_regular_file_or_an_intermediate_that_is_not_a_folder` | same | a directory as the final, and a file as an intermediate, are each refused by name | the kind check skipped |
   | T4 | `check_inside_returns_the_engine_path_for_data_reached_without_a_link` | same | data inside the folder with no link returns a path equal to the canonical folder joined with `at`, in the `\\?\` form on Windows (a run-time check of the platform, with no `cfg` in product code, §2.9) | the folder not canonicalized |
   | T5 | `check_inside_refuses_a_non_canonical_at_before_any_file_is_read` | `resolver.rs`, `mod tests` (C-7) | a device name, a trailing dot and a `..` segment are refused by the text check, with a folder that does not exist, so no metadata read could pass | `in_canonical_form` not called |
   | T6 | `the_project_lock_is_refused_while_held_in_this_process_and_in_another_and_freed_by_a_crash` | `kernel/tests/project_lock_crash.rs` | a second `try_lock` in the same process is `Held`, and succeeds after drop; a child process (the `project_save_crash.rs` pattern) takes the lock, so the parent gets `Held`; the child aborts, and the parent's `try_lock` then succeeds; `open.lock`'s bytes stay empty | (a) no lock taken; (b) a `create_new` marker file in place of the lock (K-O5's mutation) |
   | T7 | `a_folder_flush_failing_after_the_rename_keeps_the_save` | `store.rs`, `mod tests` | with a flush that fails, `commit_with` returns `Ok`, `project.spatial` holds the new bytes, and no temp file is left | the flush error returned, which is main's behaviour |
   | T8 | `a_same_answer_past_256_known_folders_is_refused_and_the_folders_are_unchanged` | `kernel/tests/project_store.rs` | at 255 known folders, `with_same` gives 256; at 256 it is `KnownFoldersFull` with count 256, and `to_bytes` of the list is unchanged | the oldest `same` entry dropped to make room |
   | T9 | `a_move_makes_this_folder_first_and_forgets_the_old_first` | same | after `moved_to`, `first` is the new folder, `same` is kept, the old first is absent, and the new folder is not repeated | the old first kept in `same` |
   | T10 | `a_locations_json_the_reader_refuses_is_named` | same | a wrong format, a wrong version, bytes over the bound, malformed JSON and an entry missing a field are each refused with `file` = `LOCATIONS` and a rule | a refused file read as no entries |
   | T11 | `the_locations_reader_reads_back_what_a_save_writes` | same | after a real `Projects::save`, with the rig of `kernel/tests/project_save.rs` rebuilt here and not imported, `read_locations` of the written `locations.json` gives the saved dataset and path. This is the seam to the writer on main, from its real shape | the reader's field names changed |

   - No existing test is edited (I3).
   - The link tests make a junction on Windows and a symlink elsewhere, with `cfg` in test code only (§2.9).
   - The cloud placeholder case is not tested, since a test cannot make a placeholder without the cloud filter driver. The closing amendment names this gap.

7. **Pre-committed producers (R2).** These are named here, in P1's PR body and in the node's plan summary.

   | Producer (`pub` item) | Consumer | Seam's end-to-end test |
   |---|---|---|
   | `resolver::check_inside` and its error type | `Projects::open_project`'s data step, P3a | K-R1, K-R2, K-R4 (§4); K-R3 as C-7 restates it, working name `a_device_name_or_trailing_dot_target_is_refused_at_read_before_any_open`, asserting `project_file_refused` at the locator's `at`, with nothing opened; then E-REOPEN |
   | `store::OPEN_LOCK`, `ProjectLock`, `ProjectLock::try_lock` and `LockRefused` | `open_project`'s step 3 (P3a); the binding's lock state, dropped at `close_dataset` and by the session-end forwarder (P3b, §2.7) | K-O4 and K-O5; working name `a_reopen_after_a_session_end_in_the_same_process_takes_the_lock`, asserting that once the session end has dropped the lock, a reopen of the identity in the same process is not refused with `project_open_elsewhere`; E-SECOND and E-CRASH-UNLOCK (P4) |
   | `KnownFolders::with_same` and `KnownFoldersFull` | the `same` arm, P3a | K-O11 and K-O6 |
   | `KnownFolders::moved_to` | the move arm, P3a | K-O6 widened, working name `a_move_answer_rewrites_folders_json_with_this_folder_first_and_asks_again_at_the_old_path`, asserting `folders.json`'s bytes after the move and the question at a later open from the old path |
   | `store::read_locations` and `Location` | the machine-location arm, P3a | K-O3; K-O10 widened, working name `a_locations_json_the_reader_refuses_refuses_the_open_by_name_and_is_kept`, asserting `project_machine_record_refused` naming `locations.json`, with the file's bytes unchanged |

   - Each working-named test is declared in full, with its mutation, in P3a's or P3b's amendment before that piece's code (R2 (b)).
   - The node is not done until each seam's test has passed on main (R2 (c)).
   - A `pub` item of P1 that is not in this table is a gate finding (R2 (d)). The precedent is Amendment 16 item 1 (R2 (e)).
   - Each producer's doc names its consumer and this item.
   - `commit_with`, `LOCATIONS_LIMITS` and the visibility of `in_canonical_form` are not `pub`. Each has a product caller in P1.

8. **Regions against the pieces in flight.**
   - **P2:** `kernel/src/session_history.rs` and `kernel/tests/project_reopen.rs`. It shares no file with P1.
   - **PR B @ 6f95993e:** shell files. It touches no file named in item 4.
   - **The stream-refusal form draft** (`state/consults/2026-11-16-shell-tiled-arm-stream-refusal-shown-to-the-user-form-draft-architect.md`): `frontends/shell/src` streaming and residency files, their tests and KNOWN-LIMITATIONS item 56. Its §5 puts the kernel and `protocol/` out of scope.
   - Rule (00): P1 is the only piece on `protocol/` while it is in progress. P2 touches no `protocol/` file.
   - The reviewer recomputes the file lists with git against each branch.
   - P1 and P2 each have their own worktree, build folder and test-data folder, and their heavy runs take turns (R1 (c)).

9. **Stops.** The worker stops and reports alone when any of these happens:
   1. The diff changes a wire byte, a type or a fixture (R1 (f)).
   2. A file not in item 4 is needed. `kernel/src/project/mod.rs`, `kernel/src/skp.rs`, `kernel/src/session_history.rs`, `src-tauri` and the shell are among them.
   3. An existing test needs an edit (I3), or a dependency or a lock file changes (I6).
   4. A `pub` item outside item 7 is needed.
   5. A test passes at its base before its code, or a mutation does not fail its test.
   6. T7 needs a seam other than `commit_with`.
   7. Item 5 (b) of 2026-11-12 is not yet placed (item 3) when the code would start.

10. **Gates: full class, both gates** (ADV-2026-11-16-06 item 2 (a): persistence, concurrency, seams, more than 260 lines).
    - The architect and the reviewer gate P1. §9's suites run once at the final candidate, by THE MACHINE paragraph:
      - the workspace `cargo test --locked` with `spatial-engine/fixture`, fmt and clippy;
      - §2.11's command;
      - empty lock-file diffs;
      - every mutation of item 6 observed.
    - Of the e2e suites, only E-SAVE reaches a changed line (`Staged::commit`), so E-SAVE runs. Where §9 asks for more, §9 governs.

11. **Superseded index.**
    - §8 item 19 is qualified for the move alone. Forgetting the old first folder at a move is S2-2 (a)'s rule, not a defect.
    - §2.11's step-2 lists are added to by `kernel/tests/project_store.rs` and by `LOCATIONS_LIMITS` (class 9).
    - §4's step-2 table is added to by T1 to T11.
    - The O-21 placement of N-10 in the architect's 2026-11-16 read is superseded by item 3.
    - Nothing else is superseded.

Nothing above is edited.

---

**Notes (each one mine):**

1. **N-10 placement.** Putting N-10 in P3a corrects my own read's O-21. N-10's words are true only once `check_inside` has a product caller. Landing them in P1 would put an untrue sentence on main between P1's merge and P3a's.
2. **Item 5 (b) of 2026-11-12, the #307 review's notes.** I could not find that review filed under `state/`. I searched for "path-length", "stale temp" and "307 review". If the path-length note concerns the 4,096-byte string bound, it bears on P1, because `FOLDERS_LIMITS`, and so `LOCATIONS_LIMITS`, could refuse a long folder path that the writer in `mod.rs` writes. A reader that refuses what the writer writes is a seam defect. If the stale-temp note concerns `remove_stale_temps` removing another process's in-flight temp, it also bears on `store.rs`. Stop 7 holds P1 until the custodian places both.
3. **Regions not diffed.** I did not diff PR B's file list. Item 8 rests on my earlier reads in m4b and on the stream draft's §5. The reviewer recomputes it.
4. **Item 6's names are working names.** I checked, by grep, that `check_inside`, `ProjectLock`, `OPEN_LOCK`, `with_same`, `moved_to`, `read_locations` and `commit_with` exist nowhere in `kernel/`, `protocol/` or `src-tauri`. `kernel/tests` holds only `project_save.rs`, `project_save_crash.rs` and `project_save_skp.rs`.
5. **The D-16 log line.** It states the engine fact only (the failed flush and the error kind) and no consequence, per the "engine messages state engine facts" ruling. The save standing is the store's own outcome, so no message from another owner states it.
6. **Who words what.** None of this amendment's words is the human's. The two protocol comment removals change no shipped string.
