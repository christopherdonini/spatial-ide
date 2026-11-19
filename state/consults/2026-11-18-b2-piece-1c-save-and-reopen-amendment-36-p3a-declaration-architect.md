*Filed by the custodian: the architect's hand-back (claude-opus-5-5), 41934 bytes, sha256 e9d219489a50011dbbd7635cecea3e523b5405d7043e9de21b446e6e430ddd3f, below the rule with one final newline added; calls Read 44, Grep 21, Glob 2, none errored, from 2026-11-18T23:48:13Z to 2026-11-19T00:07:07Z. A draft, read only, at main 1067f753; nothing in it is ruled by its filing, and the advisor rules its packet, P-1 to P-9, before P3a's code. Its item 2's sums were checked by the custodian against item 3 of Amendments 33, 34 and 35, and its protocol figure by git diff --numstat over P1b's range: equal.*

---

main @ 1067f753bd4f4226260575cbd3bbe3ece8fc7180 — **Verdict:** this is a drafting consult, not a gate. I made no gate finding and changed nothing. Two items need action. (1) One clause of ADR-036 Amendment 3 item 1 does not hold for sub-case 2 under main's code; it goes to the advisor (packet P-2). (2) Amendment 34 item 3 states the step's group figures wrongly; the amendment below corrects them (its item 2, class 3).

## 1. The amendment

````markdown
## Amendment 36 — the reopen's P3a, the kernel's open of a saved project, declared before its code as two parts, P3a-1 (the lock at a first save) and P3a-2 (`Projects::open_project`) (ADV-2026-11-16-10 R1 to R4; ADV-2026-11-16-16 item 3; ADV-2026-11-18-18 item 4; ADV-2026-11-18-23 item 2; ADV-2026-11-18-24 items 3 and 5): scope, rules, ceilings, tests, mutations, pre-committed producers, regions, stops and gates; a correction of Amendment 34 item 3's group figures (class 3); `kernel/src/skp.rs` and tests outside §2.11's and §4's lists (class 9)

*Drafted by the architect for the custodian, read only, at main 1067f753bd4f4226260575cbd3bbe3ece8fc7180, and appended by the custodian's script. References only. Nothing below is a quotation. Under ADV-2026-11-16-10 item 5, each choice below is the custodian's declaration; where it is the architect's recommendation, it says so. Rulings are cited by id, or by file, and item. Code is cited by path and symbol.*

1. **Basis.**
   - P3a is ADV-2026-11-16-10 R1 (a): the kernel's open of a saved project, full class (ADV-2026-11-16-06 item 2 (a)). P3b, the wire (`skp/0.14`) and the binding, follows it.
   - Its rules:
     - §2.4, steps 1 to 6;
     - §2.5, with its declared window;
     - §2.7's lock;
     - Amendment 1 item 5 (V3, M1, M2);
     - Annex A items 2, 3 and 5;
     - R3 (a) to (d);
     - OPEN-N4 (a), as ADR-036 Amendment 2 item 4 states it;
     - the second-open form's five carried items (`governance/forms/kernel/SECOND-OPEN-HISTORY-BEFORE-1C-STEP-3-PREREGISTRATION.md`, §2.4).
   - P1a, P1b and P2 have merged (Amendments 33 to 35). P3a consumes their pre-committed producers (Amendment 30 items 5 (d) and 6 (d); Amendment 31 item 6).
   - **Not P3a's:**
     - every wire byte, type, fixture and code. That includes the codes for P3a's new failures and C-6's withdrawal of `project_target_outside_folder` (P3b, R1 (e)).
     - the binding's commands, the pool poll, and freeing the lock at `close_dataset` and at a session end (P3b; O-12, O-13).
     - every shell item, O-14 to O-17, E-REOPEN, E-CHANGED, E-SECOND and E-CRASH-UNLOCK (P4).
     - the record's own `locations.json` writer (step 3's node, Amendment 32 item 3).
   - **Model:** worker-high, on the strongest model, for both parts (ADV-2026-11-18-02 item 2 (a); ADV-2026-11-16-06 item 5 (a)). The grounds: a lock, a path check, a persistence format, concurrency and cancellation.

2. **Correction (class 3).**
   - Amendment 34 item 3 gives the groups after P2 as 1,282 of 1,400 and 1,137 of 1,300. Those figures add P2's counts to Amendment 31 item 4's figures, and those figures are what was left (665 = 925 − 260).
   - Corrected, the counts of Amendments 33, 34 and 35 (each item 3) give step 2's use so far:
     - kernel product 792 of 1,400 (99 + 336 + 357);
     - kernel tests 883 of 1,300 (145 + 341 + 397);
     - protocol 5 of 320.
   - The proof is those three items' numstat figures, summed as shown.

3. **Size and split (R1 (d)).** The architect's recommendation.
   - **The read's figure.** The step-2 read puts P3 at about 2,210 lines and P3b at about 810, so P3a at about 1,400 (`state/consults/2026-11-16-b2-piece-1c-save-and-reopen-step-2-declaration-read-architect.md`, §3, P3: 750 product + 650 tests).
   - **This declaration's ceilings** come to 1,440 lines (item 4).
   - **P3a splits in two.**
     - P3a-1 is the lock at a first save, with its documentation items: 210 lines, 3 files.
     - P3a-2 is `Projects::open_project`: 1,230 lines, 6 files.
     - P3a-1 has a product caller now: the shipped `save_project` command calls `Projects::save`.
     - P3a-2 is cut from main after P3a-1 merges. Both edit `kernel/src/project/mod.rs`, and P3a-2 registers its open in the `SavedProject` field that P3a-1 adds.
   - **P3a-2 does not split again by the arms of the open.** It stays over 800 lines for three reasons.
     - (a) The six steps run in one call, under one cancel key and one lock. Every arm's test either ends in `opened`, which needs step 4, or asserts that a refusal after the lock leaves `open.lock` free (K-O14). A part cut inside step 2 would land an `open_project` whose missing arms answer in a way §2.4 does not define. A part made of crate-private helpers without their caller would land dead code, which clippy reports in a changed file (ADV-2026-11-18-24 item 5 (b)).
     - (b) About a third of P3a-2's test lines are one rig in one file: hand-built folders, `folders.json`, `locations.json` and lineage files. A split would duplicate that rig or share a helper across parts, either of which would first go to the advisor (ADV-2026-11-16-16 item 1 (e)).
     - (c) The largest arm, `copy`, is about a fifth of the part. Cut out, it would leave an interim `copy` answer that §2.4 does not have.
   - The advisor rules the split with the packet (P-1).

4. **Ceilings, both numstat columns, by §2.11's groups.** Neither §2.11 nor §7 is edited. An overrun is class 8, recorded in the part's closing amendment.

   | Part | File | Group | Ceiling |
   |---|---|---|---|
   | P3a-1 | `kernel/src/project/mod.rs` | kernel product | 60 |
   | P3a-1 | `kernel/src/project/store.rs` | kernel product | 20 |
   | P3a-1 | `kernel/tests/project_save.rs` (class 9 by Amendment 30) | kernel tests | 130 |
   | P3a-2 | `kernel/src/project/mod.rs` | kernel product | 520 |
   | P3a-2 | `kernel/src/skp.rs` (class 9, O-10) | kernel product | 60 |
   | P3a-2 | `kernel/src/session_history.rs` (class 9 by Amendment 31) | kernel product | 50 |
   | P3a-2 | `kernel/src/dataset_ref.rs` | kernel product | 10 |
   | P3a-2 | `kernel/tests/project_reopen.rs` | kernel tests | 520 |
   | P3a-2 | `kernel/tests/project_lock_crash.rs` | kernel tests | 70 |

   - **Group totals.** P3a-1 is 80 product and 130 tests. P3a-2 is 640 product and 590 tests.
   - **The forecast** (item 2's figures).
     - Kernel product has 608 left. P3a takes it to 112 over.
     - Kernel tests have 417 left. P3a takes them to 303 over.
     - Protocol stays at 5 of 320.
     - Both kernel overruns are class 8 at the closings. The advisor reads the forecast now (P-7).
   - **Contingent.** If the advisor rules packet P-6 option (ii), `kernel/src/project/resolver.rs` joins P3a-2 with a ceiling of 15. Its test case falls within `project_reopen.rs`'s ceiling.
   - The reviewer recounts §2.11's command with its excludes set to this form's present path.

5. **The open's rules** (P3a-2, the architect's recommendation).
   - **(a) The cancel key.**
     - The key is registered at the entry of `open_project`, before `project.spatial` is read. It goes in the host's open registry, reached through `StepRecorder::host`.
     - A new crate-private split of `SkpHost::open_dataset` in `kernel/src/skp.rs` does this (O-10; the 2026-10-23 draft's point (a)). The split has two halves: one registers a key and returns its guard and token, and one opens under a token already registered.
     - `open_dataset` becomes the two halves in sequence. Its behaviour does not change.
     - A key already in use is refused as `cancel_key_in_use`.
     - The token is checked between steps and after each blocking read, and the engine open takes the same token.
     - The longest stretch with no cancel check is one bounded read: at most 1 MiB for `project.spatial`, 2 MiB for each machine document, and 32 MiB for each of the two lineage files.
   - **(b) The order** (class 1, disclosed).
     - Step 2 decides with nothing written. The `question` arm returns from there.
     - Step 3 takes the lock before any write to the machine store or to the folder. Step 2's writes (`same`, the move, `copy`'s new identity) come after the lock. For `copy`, the lock is the new identity's.
     - Step 6, the lineage read, runs after step 3 and before step 4's engine open. A cancel during the read therefore opens nothing (ADV-2026-11-18-23 item 2 (b)). The reply's content is unchanged.
     - Every refusal or cancel after step 3 frees the lock before the reply (K-O14).
   - **(c) The machine documents.**
     - `folders.json` and `locations.json` are read under their bounds.
     - A refused file gives a failure that names the file and leaves it byte for byte (M1, K-O10).
     - `same` goes through `KnownFolders::with_same`, and over 256 it is refused with nothing dropped (M2, K-O11).
     - A move goes through `KnownFolders::moved_to` (K-O6 (b)).
     - Every write goes through `KnownFolders::to_bytes` or `store::locations_to_bytes`, then `write_machine_file`. A refusal by a writer names its file and writes nothing (Amendment 30 item 4 (a)).
   - **(d) The folder's case** (Amendment 33 item 9; the architect's O-7).
     - The known check compares canonical forms. It canonicalizes this folder and each remembered entry that resolves; an entry that does not resolve is compared as written.
     - What is written stays the absolute form, as at the save.
     - `with_same` is called only for a folder the known check did not find (K-O23).
   - **(e) The data step.**
     - A `project-relative` locator goes through `resolver::check_inside`, and the engine gets the returned path (H4). The engine path is armed for watching with the same string (K-O15).
     - Each refusal names the locator's own JSON path, `$.datasets[0].resource.locators[i].at`, and the segment. It never forwards the `$` that `NotCanonical` carries (ADV-2026-11-18-24 item 3 (a)).
     - `NotCanonical` cannot be reached through the data step. `DatasetRef::parse` refuses a non-canonical `at` at step 1, through `in_canonical_form` in its locator loop in `kernel/src/dataset_ref.rs` (K-R3). Only parsed `at`s are passed, which bounds the segments (Amendment 35 item 10).
     - Otherwise the machine location from `locations.json` is used. A location that is absent, or a file that is missing, gives `not_found`.
     - A re-link is checked against `observed` (K-O8). After the open succeeds, the re-link is written to `locations.json`. A re-link path that the writer refuses, a relative one included, is refused by name with nothing written.
     - The race between the check and the open is §2.5's declared window.
   - **(f) The open's identity in the recorder** (O-6 items 1 and 2; O-11).
     - A new crate-private `StepRecorder` call runs before any step. It gives the reopened open the project file's dataset identity, and binds the open at the reopen only when this run holds the project's record (OPEN-N4 (a); ADR-036 Amendment 2 item 4).
     - A later run's reopen does not bind (R3 (a)).
     - The open is registered in `Projects`'s saved list, with its lock, so that its next save keeps both identities and its folder (K-O21).
   - **(g) Sub-case 2** (R3 (b)): a later run's reopen with no step before its first save, where another run left the project's record folder.
     - At main, `StepRecorder::adopt_project` binds without a move. Each later step is then refused, at `create`'s `create_dir` on the leftover folder.
     - Recommended, and contingent on the advisor (packet P-2): `adopt_project` does not bind an open with no record of its own when `<sessions root>/<project hex>` exists and this run holds no record for the project. The open stays unbound, the save replies withheld as `HistoryUnwritable`, and the open's steps keep a record of their own.
   - **(h) Told at the reopen.**
     - The reply carries no history fact (R3 (c)). The first save's withheld mark is the existing `HistoryMark::Withheld`, which P4 shows as S5.
     - A later save of a reopened file whose member records a lineage is refused by `Projects::save`'s existing check (R3 (d), K-O20).
   - **(i) The lineage paths** (Amendment 31 item 1): `lineage.jsonl` in the folder, and `previous-lineage.jsonl` in the identity's machine folder. Both are private constants in `mod.rs`, passed to `session_history::read_lineage`.
   - **(j) A lock freed late after a crash on Windows** (Amendment 33 item 9; the architect's O-1, the reviewer's O2). No retry is declared. K-O5 tries the lock only after it has waited for the child to exit. A failure of K-O5 or T6 on Windows is stop 6.

6. **P3a-1: the lock at a first save.** Branch `cut/b2-piece-1c-p3a-1`, worktree `C:/dev/wt/1c-p3a-1`, build folder `D:/wt-targets/1c-p3a-1`, cut from main.
   - **(a) Files and regions.**
     - **`kernel/src/project/mod.rs`, the lock.**
       - `SavedProject` gains a private field holding the `ProjectLock`.
       - At a first save, `Projects::save` takes `ProjectLock::try_lock` after both machine documents are built and before `create_dir_all` (Amendment 30 item 4 (b); Amendment 33 item 9, the reviewer's O1). A refusal before that point therefore writes nothing, and T14 holds unedited.
       - `LockRefused` maps to the existing `SaveFailure::MachineStore`, naming the lock file, so no `pub` item and no wire change are added. `Held` at a first save needs a freshly minted identity to be held already, which ordinary use cannot reach.
       - The lock is kept with the saved entry. It is freed when `Projects` is dropped, and from P3b also at `close_dataset`.
     - **`kernel/src/project/mod.rs`, two doc comments.**
       - `Projects::save`'s doc: the sentence that lists the order of a save is corrected to the order the code follows (ADV-2026-11-18-18 item 4 (a)).
       - `write_machine_file`'s doc names its residual: a crash between the temp's creation and the rename leaves `<name>.tmp-<hex>` in the identity folder, which nothing removes (ADV-2026-11-18-18 item 4 (c), the architect's O-4).
     - **`kernel/src/project/store.rs`, docs only.**
       - `remove_stale_temps`'s doc names its residual: two first saves of different identities into one empty folder, between the folder check and the rename (Amendment 30 item 4 (b)).
       - `Staged::commit`'s doc stops linking the private `sync_folder` (ADV-2026-11-18-18 item 4 (b)).
     - **`kernel/tests/project_save.rs`:** K-O17 and K-O24, appended, using its rig. One line naming them is added to its module doc. No existing line changes.
   - **(b) Tests and mutations** (round-25 rule: apply, run the named test, record its failure by name with the commit, revert; a `verify-mutation` run is not called an observation).

     | Id | Test | Asserts | Mutation |
     |---|---|---|---|
     | K-O17 | `a_project_saved_first_in_this_process_is_refused_to_another_process` (the first half of Amendment 30 item 6 (d)'s working name; its second half, until its dataset closes, is P3b's) | after a real first save, a child process (re-exec, the `project_save_crash.rs` pattern) gets `LockRefused::Held` on the identity; `open.lock` stays empty | no lock taken at a first save |
     | K-O24 | `a_first_save_refused_after_the_lock_leaves_it_free` (off Windows, by a run-time check; the folder made read only in test code) | the save is refused; `ProjectLock::try_lock` on the identity then succeeds | the lock kept with the saved entry on a failed save |

     - K-O24 passes at main by design (main takes no lock), so it is exempt by name from stop 4. Its mutation is the observation.
     - T14 is re-run unedited at P3a-1's candidate, with its mutation (b) observed again. That shows the lock sits after the documents are built.
   - **(c)** P3a-1 adds no `pub` item.

7. **P3a-2: `Projects::open_project`.** Branch `cut/b2-piece-1c-p3a-2`, worktree `C:/dev/wt/1c-p3a-2`, build folder `D:/wt-targets/1c-p3a-2`, cut from main after P3a-1 merges.
   - **(a) Files and regions.**
     - **`kernel/src/project/mod.rs`:** a new region after `save`.
       - `pub fn Projects::open_project(folder, cancel_key, answer, relink)`, with item 5's steps.
       - Its `pub` result types, in kernel terms that mirror §2.2 field for field: `Answer` (`Copy`, `Same`), `Reopen` (`Opened`, `Question`, `NotFound { file_name }`), `Opened`, the view's state (V3), and `OpenFailure`.
       - Private helpers.
       - `skp_error_of` is unchanged: mapping `OpenFailure` to wire codes is P3b's.
     - **`kernel/src/skp.rs`:** item 5 (a)'s split of `open_dataset`. Crate-private only.
     - **`kernel/src/session_history.rs`:**
       - item 5 (f)'s crate-private call;
       - item 5 (g)'s arm of `adopt_project`, if the advisor rules it.
       - The reader items of P2 do not change.
     - **`kernel/src/dataset_ref.rs`:** N-10. The containment sentence in `in_canonical_form`'s doc takes the 2026-10-23 draft's words, point (l) (`state/consults/2026-10-23-b2-piece-1c-save-and-reopen-steps-2-and-3-ahead-architect-draft.md`), applied by script (R1 (g)).
     - **`kernel/tests/project_reopen.rs`:** item (b)'s rows, appended. No existing test changes (I3).
     - **`kernel/tests/project_lock_crash.rs`:** K-O5, appended, using its child pattern.
   - **(b) Tests and mutations** (round-25 rule as in item 6 (b)).
     - Each test fails at main by a missing symbol, which is a compile failure. L5, L6 and L7 are the exceptions, by name: they assert P2's reader as merged, and they are exempt from stop 4.
     - Every case asserts its arm's result and that `open.lock` is free after a refusal.
     - Every case that opens nothing also asserts that the catalog holds no entry for it.

     | Id | Test | Asserts | Mutation |
     |---|---|---|---|
     | K-R1 | `a_link_below_the_folder_is_refused_and_never_opened` | a junction as an intermediate (Windows); a symlink as an intermediate, and a symlink to a regular file as the final segment (off Windows, where it needs no privilege; ADV-2026-11-18-24 item 3 (b)): each refused as through a link, naming the locator's JSON path and the segment | the data step skips `check_inside` |
     | K-R2 | `on_windows_a_junction_out_of_the_folder_is_refused` | as §4 states | the walk follows reparse points |
     | K-R3 | `a_device_name_or_trailing_dot_target_is_refused_at_read_before_any_open` (C-7) | `project_file_refused` at `$.datasets[0].resource.locators[i].at` (built through `SkpError::project_file_refused`, which exists) | `in_canonical_form` not called for a project-relative `at` |
     | K-R4 | `an_unresolvable_target_is_refused_by_name` | a missing intermediate and a missing final, each naming the segment | a missing segment opened as the folder |
     | K-O1 | `a_saved_project_reopens_with_its_data_claims_and_workspace` | after a real save, the reopen's claims, workspace and check | the claims dropped |
     | K-O1 (b) | `a_saved_project_whose_member_records_a_lineage_reopens_with_its_lineage_named` (Amendment 31 item 6) | a hand-built project and lineage file: `Recorded` with its lines for a match; `NotTheRecordedOne` for a file from a different save | step 6 not run |
     | K-O2 | `a_changed_file_is_reopened_with_each_differing_component_named` | as §4 states | only `byte_size` compared |
     | K-O3 | `a_missing_file_returns_not_found_and_opens_nothing` | as §4 states | the machine location falls back to the folder |
     | K-O4 | `a_second_open_of_an_open_identity_is_refused_in_this_process_and_another` | as §4 states, and `folders.json` and `locations.json` byte for byte unchanged | (a) no lock; (b) step 2's writes made before the lock |
     | K-O5 | `the_second_open_refusal_never_outlives_a_crash` (`project_lock_crash.rs`) | a child opens and aborts; after the child's exit has been waited for, the parent's open succeeds | a `create_new` marker in place of the lock |
     | K-O6 | `the_question_is_asked_only_when_the_first_folder_holds_this_identity_or_cannot_be_reached` (five cases, §4; a refused `project.spatial` in the first folder asks) | as §4 states | asked whenever the first folder exists |
     | K-O6 (b) | `a_move_answer_rewrites_folders_json_with_this_folder_first_and_asks_again_at_the_old_path` (Amendment 30 item 6 (d)) | after a move, this folder is `first`; a copy placed back at the old path is asked | the old first kept in `same` |
     | K-O7 | `a_copy_gets_a_new_identity_in_the_new_folder_and_its_own_links` | as §4 states, the first folder's files and the old identity's machine files unchanged | the new identity written to the first folder |
     | K-O8 | `a_relinked_file_is_checked_against_the_observation_and_each_difference_named` | as §4 states; a relative re-link is refused, naming `locations.json`, with nothing written | (a) the check skipped on re-link; (b) the re-link written without `locations_to_bytes` |
     | K-O9 | `a_view_saved_in_another_space_is_not_applied_and_the_reopen_names_it` (V3) | the view's named state with its basis | the spaces compared by identifier only |
     | K-O10 | `a_folders_json_the_reader_refuses_refuses_the_open_by_name_and_is_kept` (M1; cases: a duplicate key, 257 folders as hand-built bytes) | refused, naming the file; its bytes unchanged | a refused file replaced by a fresh one |
     | K-O10 (b) | `a_locations_json_the_reader_refuses_refuses_the_open_by_name_and_is_kept` (Amendment 30 item 6 (d); cases: a relative `path`, a bad dataset URI, a wrong format; ADV-2026-11-18-18 item 4 (c)) | the same | the same |
     | K-O11 | `a_same_answer_past_256_known_folders_is_refused_and_none_is_forgotten` (M2) | as Amendment 1 item 5 states | the oldest `same` entry dropped |
     | K-O12 | `a_project_file_over_its_ceiling_is_refused_at_reopen_without_being_read_whole` (class 9) | `set_len` to 1,048,577: refused by name | the read unbounded |
     | K-O13 | `a_cancel_before_the_engine_open_ends_the_reopen_with_nothing_opened_and_no_lock_held` (class 9; the rig widens step 6 with a valid lineage file near its bound, and a thread cancels the key as soon as the registry holds it) | cancelled; nothing opened; lock free | the key registered only by `open_dataset` |
     | K-O14 | `a_refused_or_cancelled_reopen_leaves_open_lock_free` (class 9; cases: not found, through a link, an engine refusal after the lock) | the lock can be taken after each | the error arm keeps the guard |
     | K-O15 | `on_windows_a_reopened_project_relative_open_is_watched` (class 9) | the arm reports watching for the `\\?\` path | the arm given another spelling than the engine's |
     | K-O16 | `a_save_after_a_reopen_whose_project_record_another_run_left_replaces_neither_history` (sub-case 1; R3 (b)) | a later run (a new recorder and `Projects` over the same roots, with no `end_session`): the save replies withheld as `HistoryUnwritable`; the earlier record byte for byte; the open's own record keeps its steps; no mark in either | `copy_under` writes into an existing folder |
     | K-O18 | `a_save_after_a_reopen_with_no_step_whose_project_record_another_run_left_leaves_it_and_keeps_the_open_unbound` (sub-case 2; contingent on P-2) | withheld as `HistoryUnwritable`; the earlier record unchanged | the open bound without a move over another run's folder |
     | K-O19 | `the_first_step_after_that_save_meets_no_leftover_folder_and_has_a_record_of_its_own` (the leftover folder meeting the first step's create; R3 (b)) | under P-2 option (i): the step is recorded under its own record and the leftover is unchanged; under option (ii): the step is refused and the leftover is unchanged | `create`'s `create_dir` replaced by `create_dir_all` |
     | K-O20 | `a_later_save_of_a_reopened_project_whose_member_records_a_lineage_is_refused_and_the_files_are_kept` (R3 (d)) | `LineageNotKept`; `project.spatial` unchanged | the kept-lineage refusal removed |
     | K-O21 | `a_save_after_a_reopen_keeps_the_project_and_dataset_identities_and_the_folder` (O-11; O-6 item 2) | the next save writes the same project URI and dataset URI into the same folder, and a step's `data.dataset` is the file's dataset URI | (a) not registered in the saved list; (b) the recorder's minted dataset URI kept |
     | K-O22 | `a_reopen_in_the_run_that_holds_the_projects_record_continues_it_from_the_first_step` (OPEN-N4 (a); O-6 item 1; the first `Projects` is dropped to free the lock, standing in for P3b's close) | the first step after the reopen has the record's last step as its parent | no bind at the reopen |
     | K-O23 | `on_windows_a_folder_spelled_with_another_case_is_the_known_folder` | opened with no question; `folders.json` unchanged | compared as written |
     | L5 | `a_previous_lineage_whose_hash_matches_but_whose_step_count_does_not_is_named_and_not_used` (ADV-2026-11-18-23 item 2 (a)) | `previous_file` is `NotTheRecordedOne` and `lineage` is `None` | the count comparison in `read_lineage`'s arm 2 removed |
     | L6 | `a_lineage_file_with_two_broken_lines_is_named_by_the_first` (Amendment 34 item 9) | `Damaged` at the first line in file order | the reader goes past the first failure |
     | L7 | `a_link_at_the_lineage_name_beside_a_not_kept_member_is_named_and_never_followed` (ADV-2026-11-18-23 item 2 (c); a dangling symlink off Windows, a junction on Windows) | `NotRead` | `symlink_metadata` replaced by `metadata` |

     - No existing test is edited (I3).
   - **(c) Pre-committed producers** (R2): see item 8.

8. **Producers and their consumers.**

   | Producer | Consumer | Seam's end-to-end test |
   |---|---|---|
   | `resolver::check_inside`, `CheckRefused` (P1a) | P3a-2's data step | K-R1 to K-R4; E-REOPEN (P4) |
   | `ProjectLock`, `LockRefused`, `OPEN_LOCK` (P1b) | `Projects::save` at a first save (P3a-1); step 3 (P3a-2); the binding (P3b) | K-O17, K-O24, K-O4, K-O5, K-O14; P3b: `a_reopen_after_a_session_end_in_the_same_process_takes_the_lock` and the second half of `a_project_saved_first_in_this_process_is_refused_to_another_process_until_its_dataset_closes`; E-SECOND, E-CRASH-UNLOCK (P4) |
   | `KnownFolders::with_same`, `KnownFoldersFull` (P1b) | the `same` arm | K-O11, K-O6 |
   | `KnownFolders::moved_to` (P1b) | the move arm | K-O6 (b) |
   | `store::read_locations`, `Location` (P1b) | the machine-location arm | K-O3, K-O10 (b) |
   | `session_history::read_lineage` and its types (P2) | step 6 | K-O1 (b), L5 to L7; P3b's `v0-open_project-opened-lineage`; P4's shell test |
   | `Projects::open_project`, `Answer`, `Reopen`, `Opened`, the view's state, `OpenFailure` (P3a-2) | P3b's binding command and its wire mapping | P3b's `v0-open_project-*` fixtures; E-REOPEN (P4) |

   - Each working-named test of P3b and P4 is declared in full, with its mutation, in that piece's amendment before its code (R2 (b)).
   - The node is not done until each seam's test has passed on main (R2 (c)).
   - Any other `pub` item is a gate finding (R2 (d)).
   - All of these are named in each part's PR body and in the node's plan summary.

9. **Not covered, by name, with the reason.**
   - `CheckRefused::FolderUnresolvable` through the data step (ADV-2026-11-18-24 item 3 (c)). Step 1 has just read `project.spatial` from the folder, so `canonicalize` fails at step 4 only if the folder changes between the two steps, which no test can build without a seam. The arm maps to an `OpenFailure` that names the folder. Its code is P3b's (packet P-6).
   - `NotCanonical` through the data step: it cannot be reached (item 5 (e)).
   - `KnownFolders::with_same` with the folder equal to `first`: the known check returns first (ADV-2026-11-18-18 item 4 (c)).
   - D-16's `eprintln!` line (ADV-2026-11-18-18 item 4 (c)). T7 reaches the branch, but no test reads standard error.
   - The temp that `write_machine_file` leaves after a crash (the architect's O-4). It is named in its doc by P3a-1; nothing removes it.
   - For a not-kept member, a metadata error other than not-found (ADV-2026-11-18-23 item 2 (c)). It is read as `NotRead`, which is the reader's code as merged. No test can make the folder readable while that one name's metadata fails.
   - Two live opens bound to one record (O-6 item 3). K-O4 refuses a second live open of one identity in this process, and `StepRecorder::record_step` refuses a name the catalog no longer holds.
   - For a kept member, a link at the lineage name is followed by `File::open` (packet P-9).
   - The cloud placeholder (Amendment 35 item 6).

10. **ADR-036 Amendment 3** (R4).
    - It lands in P3a-2's pull request, copied by script (R4 (d)).
    - Its item 1 is OPEN-S2-1 (c)'s body, the body of line 360 of `state/consults/2026-10-23-b2-piece-1c-save-and-reopen-steps-2-and-3-ahead-architect-draft.md`, byte for byte as the packet's first fence. Its item 2 is OPEN-S2-2 (a)'s body, line 376 of the same file, as the second fence.
    - The heading and the lead-in are the architect's draft, in the packet (P-3). Nothing is reworded.
    - The clause check against ADR-036 Amendment 2 items 1, 2 and 4 goes to the advisor before either part's code (R4 (c); packet P-2 and P-3). One clause does not hold at main for sub-case 2 (item 5 (g)). It goes to the advisor, and on to the human if the advisor so rules.

11. **Regions against the pieces in flight.**
    - P3a touches nothing in `protocol/`. Rule (00) leaves it free for P3b.
    - The first look and the stop alarm touch no kernel file.
    - P3a-2 takes main in before its gate (ADV-2026-11-16-06 item 4).
    - The reviewer recomputes each file list with git against its branch.

12. **Stops.** The worker stops and reports alone when any of these happens:
    1. A file or region outside item 6 (a) or 7 (a) is needed. `protocol/`, `frontends/` and `resolver.rs` (unless P-6 (ii) is ruled) are among them.
    2. A `pub` item outside item 8 is needed.
    3. An existing test needs an edit (I3), or a dependency or a lock file changes (I6).
    4. A test other than K-O24, L5, L6 and L7 passes at its base before its code, or a mutation does not fail its test.
    5. `open_dataset`'s split changes a test of `open_dataset`, or its behaviour.
    6. K-O5, K-O13 or T6 fails on any platform, or cannot be made deterministic.
    7. A case a test cannot build. That is a stop, not a skip.
    8. P3a-2's code is begun before the advisor's ruling on packet P-1 to P-3.

13. **Class and gates.**
    - **Full class, both gates, for each part** (ADV-2026-11-16-06 item 2 (a)). The grounds:
      - a lock;
      - a path check;
      - a persistence format;
      - concurrency and cancellation;
      - seams;
      - and, for P3a-2, more than 260 lines.
    - **Clippy** (ADV-2026-11-18-24 item 5 (b)). The reviewer runs `cargo clippy --locked -p spatial-kernel --all-targets` at the gated head, in a hold. A warning in a file the part changes is a finding.
    - **On the laptop,** by THE MACHINE paragraph, each part keeps at its final candidate:
      - the focused test targets (`project_save`, `project_lock_crash`, `project_reopen`, `project_resolver`, `project_store`, `session_history` and the skp targets);
      - every mutation of item 6 (b) or 7 (b), observed;
      - §2.11's command;
      - empty lock-file diffs.
    - **One E-SAVE run per part,** an app-window run. P3a-1 changes every first save the shipped app makes, and P3a-2 changes the shipped `open_dataset` path.
    - **CI:** the workspace on three platforms, fmt, and the governance workflows.

14. **Where each ruling item is met.**
    - ADV-2026-11-16-10:
      - R1 (d): item 3;
      - R1 (g): K-R1 to K-R4, and N-10 in item 7 (a);
      - R2: item 8;
      - R3 (a) to (d): items 5 (f) to (h), with K-O16 to K-O22;
      - R4: item 10;
      - item 5: the lead-in.
    - ADV-2026-11-16-16 item 3: item 6 (a).
    - ADV-2026-11-18-18 item 4 (a) and (b): item 6 (a). Item 4 (c): K-O8, K-O10 (b) and item 9.
    - ADV-2026-11-18-23 item 2 (a): L5. Item 2 (b): item 5 (a) and (b), with K-O13. Item 2 (c): L7 and item 9.
    - ADV-2026-11-18-24 item 3 (a): item 5 (e). Item 3 (b): K-R1. Item 3 (c): item 9. Item 5: item 13.
    - Amendment 33 item 9: items 5 (d) and (j), and 6 (a).
    - Amendment 34 item 9 (P3a): L5, item 5 (b), L6 and L7.
    - Amendment 35 item 10 (P3a): items 5 (e) and 9, with K-R1 and K-O1.
    - Amendment 30 item 3's O-items for P3a:
      - O-5: R3;
      - O-6 items 1 to 5: K-O22, K-O21, item 9, K-O19, and K-O16 with K-O18;
      - O-10: item 5 (a);
      - O-11: K-O21;
      - O-21: K-R3 and N-10.

15. **Superseded index.**
    - §2.4 step 3's lock is widened to a first save (Amendment 30 items 4 (b) and 8; class 5, ADV-2026-11-16-16 item 3).
    - §2.4's order is qualified by item 5 (b): step 2's writes come after the lock, and step 6 comes before step 4's engine open (class 1).
    - §2.11's step-2 kernel product list gains `kernel/src/skp.rs` (class 9).
    - §4's step-2 table gains K-O17 to K-O24 and L5 to L7, with K-O12 to K-O16 declared (class 9).
    - Amendment 34 item 3's group figures are superseded by item 2.
    - Nothing else is superseded.

Read the last amendment first.

Nothing above is edited.
````

## 2. The packet for the advisor (before P3a-1's code)

**P-1. The split.**
- (i) P3a-1 and P3a-2, as item 3 declares.
- (ii) P3a whole, at about 1,440 lines.
- (iii) Three parts, with `copy` cut out of P3a-2 behind an interim answer.
- I recommend (i). P3a-1 lands with its product caller, and (iii) would land an answer §2.4 does not define.

**P-2. Sub-case 2** (item 5 (g)). Clause 5 of Amendment 3 item 1, the session's history staying under its own record, does not hold at main. There, `adopt_project` binds an open with no record of its own without a move (ADR-036 Amendment 2 item 2), and every later step is then refused at `create`'s `create_dir` on the leftover folder.
- (i) `adopt_project` does not bind in that case. The clause then holds, and Amendment 3 item 1 qualifies Amendment 2 item 2 for a record another run left.
- (ii) Keep main's code. The approved words then need a qualifier, which is a rewording and the human's.
- I recommend (i). The words are the human's approved text, and (i) makes the code match them.

**P-3. ADR-036 Amendment 3: the clause check, heading and lead-in** (R4 (b) and (c)). I read Amendment 2 at ADR-036 lines 283 to 293 at 1067f753.
- Item 1, clause by clause:
  1. The referent: Amendment 1 item 5's carry-over, given by the lead-in. It holds.
  2. A first save after a reopen from the folder. It holds: under R3 (a) only the save binds, through `Projects::history` and `adopt_project`.
  3. Neither history replaced. It holds: `copy_under`'s and `create`'s `create_dir` refuse an existing folder.
  4. No mark. It holds: when the move fails, `Projects::history` returns before `mark_saved_here`, and with no record `mark_saved_here` gives `NoStep`.
  5. The session's history stays under its own record. It holds for sub-case 1 and fails for sub-case 2 (P-2).
- Item 1 against Amendment 2 item 4: a same-run reopen binds and continues this run's own record (K-O22), so item 1 does not apply to it. There is no conflict.
- Item 2 against `KnownFolders::moved_to` and T9: it holds. It shares no subject with Amendment 2 items 1, 2 and 4.
- Draft heading (the architect's): `## Amendment 3 — piece 1c: a first save after a reopen whose project record another run left, and what a move writes to folders.json (b2-piece-1c-save-and-reopen, <date of landing>)`
- Draft lead-in (the architect's):
  - It says the amendment is appended after acceptance from piece 1c's form, Amendment 36.
  - It says the two items are the human's approved words of 2026-10-23 (OPEN-S2-1 (c) and OPEN-S2-2 (a); `state/directives/2026-10-23-clicks-245-246-247-sort-window-fix-before-port-2-covering-case-route-1-244-c1-milestone-4-and-1c-open-items-ruled.md`, its `Piece 1c:` line). They were drafted then as this ADR's Amendment 2, before the piece `second-open-history-before-1c-step-3` took that number, and are copied byte for byte.
  - It gives item 1's opening words, `The same holds` (byte-copied from line 360 of the 2026-10-23 draft), their referent: Amendment 1 item 5's rule for the session record at the first save.

**P-4. R1 (e), P3b's choices.**
- (a) **`opened.lineage`.**
  - (i) Two closed members that mirror the kernel's `FolderLineage` and `PreviousLineage`.
  - (ii) The 2026-10-23 draft's flat set of eight (its point (f)).
  - I recommend (i): it loses no fact the kernel has.
- (b) **`check.observed` and `check.admission`.** Their fields follow `RefCheck` one for one, with each differing component's recorded and present values. I did not read `RefCheck`, so P3b's amendment names the fields from it.
- (c) **A non-directory intermediate or a non-regular final.**
  - (i) One new code naming the segment, with a closed detail saying whether a folder or a file was expected.
  - (ii) Two codes.
  - I recommend (i).
- (d) **C-6:** withdraw `project_target_outside_folder`. A walk from the folder with no link and a canonical `at` cannot leave it. I recommend withdrawing it.

**P-5. ADV-2026-11-18-23 item 3.**
- (a) **An unreadable lineage file.** Today it is `Damaged` with line 0 (`session_history::lineage_file`'s `unreadable`).
  - (i) Keep it, and P3b maps line 0 to a fact of its own.
  - (ii) Add a kernel variant.
  - I recommend (ii), in P3b: a magic line number is a hidden rule.
- (b) **No raw rule text on the wire.** I recommend sending the line number only; the rule's text stays in the kernel's `Display`.
- (c) **Two broken lines.** The first in file order is named (L6). I recommend stating that on the wire.
- (d) **ADR §8's properties** (`kinds_not_recorded` empty or duplicated; the `withheld` count not checked). I did not read §8. I recommend that P3b's amendment reads it and that the reader refuses a duplicated entry. An empty set and the count follow what §8 states.

**P-6. ADV-2026-11-18-24 item 4: the codes, and missing against cannot be reached.**
- (i) One code, `project_target_unresolvable`, for `Unresolvable`, with `FolderUnresolvable` under the same code naming the folder. A project-relative file that is missing is then refused, with no re-link.
- (ii) P3a-2 splits `Unresolvable` by not-found. This is a variant of the pre-committed `CheckRefused`, in `resolver.rs` (about 15 lines, class 1). The missing arm answers `not_found` with re-link, as the machine location does, and the rest stays `project_target_unresolvable`.
- I recommend (ii). Ordinary use reaches it: data moved or deleted inside the project folder.

**P-7. The ceilings forecast.**
- Item 4 forecasts the kernel product group 112 over and the kernel tests group 303 over.
- The step total of 5,170 is at risk: 1,680 used plus P3a's 1,440 leaves 2,050, against the read's P3b at about 810 and P4 at about 1,420 (the read's §3), before P5.
- I recommend that the advisor notes the forecast now, that each closing records class 8, and that §2.11 is not edited.

**P-8. ADV-2026-11-18-18 item 3, the A1 drafts sent with P3's packet.** They are in the P1b gate reports, by item:
- the architect's A1 (`state/consults/gates/2026-11-18-b2-piece-1c-save-and-reopen-p1b-gate-architect.md`): the noun in the path-length rule text, the dataset's path against a folder's path;
- the reviewer's A1 (i) and (ii) (`state/consults/gates/2026-11-18-b2-piece-1c-save-and-reopen-p1b-gate-reviewer.md`): the head of the message for a save file that breaks a reader rule, and `stored_path`'s refusal split into not absolute and not Unicode.
- Under P6 these are strings the app shows. I recommend landing them in P3b, beside its codes.

**P-9. My open items.**
- (a) **Where the lock lives.**
  - (i) In `Projects`'s saved entry, with P3b adding one kernel call that `close_dataset` and the session-end forwarder make.
  - (ii) In the binding's own state, keyed by dataset (O-12's letter).
  - I recommend (i): one owner for both the first-save lock and the reopen lock, and §2.7 still holds, since the binding holds `Projects`.
- (b) **K-O22's rig.** Dropping the first `Projects` stands in for P3b's close. I recommend keeping it, with P3b's seam test as the end-to-end proof.
- (c) **A kept member's lineage file reached through a link** is followed.
  - (i) Name the gap.
  - (ii) Refuse a link at the lineage name (a reader change).
  - I recommend (i) now and (ii) as a P3b item.
- (d) **Duplicated test rigs** (ADV-2026-11-16-16 item 1 (e)). The re-exec child pattern is duplicated in `project_save.rs` (K-O17) and `project_lock_crash.rs` (K-O5), about 20 lines. I recommend allowing it rather than a shared helper across test files.
- (e) **Order** (item 5 (b)): step 2's writes after the lock, and step 6 before the engine open. I recommend confirming them as class 1.

## For the custodian

**The line count and the split.**
- The read gives P3a about 1,400 lines (the step-2 read, §3, P3: 2,210 − 810).
- Declared here: P3a-1 is 210 lines in 3 files, and P3a-2 is 1,230 lines in 6 files, 1,440 in all.
- P3a-2 stays over 800 lines for the reasons in item 3.
- The split waits on the advisor (P-1), and stop 8 holds P3a-2's code until P-1 to P-3 are ruled.

**Amendment 34 item 3.** Its group figures are misstated. Item 2 corrects them in three sentences; check the sums before appending.

**What I could not settle by reading.** I did not read:
- the test files' rigs (`project_save.rs`, `project_lock_crash.rs`, `project_reopen.rs`);
- `DatasetRef::check` and `RefCheck`;
- `Workspace`'s view and how V3 compares spaces;
- `ArmOutcome` for a `\\?\` path;
- ADR-036 §8, and Amendment 1 item 5's exact text;
- `lineage.jsonl` and `previous-lineage.jsonl` themselves (I took both names from Amendment 31 item 1);
- the 2026-10-23 draft's point (l) text, which is N-10's source (reference it by path; do not retype it).

**K-O13's determinism.** It is unproven. Stop 6 covers it.

**§2.11's counting command.** Its excludes still name the form's old path (the P1a reviewer's O5). The reviewer should recount with the present path.

**Prior art.** None is recorded for this topic.
