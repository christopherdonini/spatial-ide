# The recovery offer's Part 1, first phase (wire and kernel): the worker's report at 96c3821a (node:b2-piece-1c-step-3-recovery-offer@part-1-phase-1)

*Filed by the custodian. The worker (Sonnet) worked in D:/wt/recov from the base 97e2156d and pushed 96c3821aad29e08e45d9e9d3905704ea0aca6201 to `cut/b2-piece-1c-step-3-recovery-offer`. By the facts script its records run from 2026-11-28T02:19:07Z to 2026-11-28T03:58:48Z, and 389 of its calls ran with the main checkout as its working folder, the shell's start folder. By its completion notice it took 5981572 ms and 515 tool uses. Its hand-back is below as received, with the harness indent removed: 12112 bytes, sha256 e3be69d0da2404f33fbc205627f1b6e02c86018c22a3fe357640ed76bf0c4f40.*

---

96c3821aad29e08e45d9e9d3905704ea0aca6201 pushed to origin/cut/b2-piece-1c-step-3-recovery-offer. Every step of Part 1 phase 1 completed: tests red, then code green, then the mutations. The kernel product group is about 365 lines over its budget (below). Phase 2 is not started.

BASE (97e2156d): cargo test -p spatial-kernel -p spatial-skp gave 602 passed, 0 failed, 49 ignored, exit 0.

COMMITS (oldest first, all `git commit -s`, trailers per the brief):
- f1a21112 test: K-C8 (unit test in kernel/src/session_history.rs) and the skp/0.18 literal tests/fixtures, red before the writer and the literal.
- 9ddd85ab test: P-1 (the three commands' wire types and codes), red before the types.
- 253442ba test: P-1's list entry built outside the json! macro. The first P-1 red failed on a macro syntax error, not on the missing types, so I fixed it.
- d8fc3237 test: kernel/tests/recovery.rs (862 lines), kernel/tests/recovery_crash.rs (320), the K-C27 and K-C42 unit tests in a skeleton kernel/src/recovery.rs, `pub mod recovery;` in lib.rs. This is the red commit for all kernel rows.
- e55f277b feat: protocol code (commands.rs types, error.rs constructors, mod.rs literal skp/0.18, SKP-V0.md, conformance README).
- 3638a51f fix: the four new messages carry the "[P6 placeholder] " mark.
- b5161d1b test: three tests (K-C18, K-C3, K-C19) read a history through the held run's lock no longer. On Windows a held lock stops a read through another handle. The runs now end before the read. Assertions are the same, except K-C3's cut check, which now reads the kept bytes and requires one whole line after them.
- cc435283 feat: kernel (kernel/src/recovery.rs product, session_history.rs plumbing and the K-C8 writer swap, project/store.rs `pub(crate) LOCATIONS_LIMITS`).
- 96c3821a test: recovery_crash.rs:158 `&dir.join(..)` becomes by-value, a clippy warning on a line I wrote.

RED: the red runs were at d8fc3237 (kernel; failures by name) and 9ddd85ab/253442ba (P-1). Logs are in D:/wt/recov-target/logs (red1/red2/red2b/red3). The first red run bundled two cargo commands in one hold and ended with `exit 0`. That is a departure from the one-command hold shape. Nothing else was bundled.

GREEN:
- spatial-skp green after e55f277b: exit 0.
- Kernel green after cc435283: the two new files (recovery 26 passed, recovery_crash 3 passed) and the whole suite.
- Final both crates (-p spatial-kernel -p spatial-skp --no-fail-fast, run at cc435283): 635 passed, 0 failed, 49 ignored, exit 0. The 96c3821a change is one test line. recovery_crash was rerun after it (3 passed, exit 0) and clippy was clean on it.
- `cargo fmt --all -- --check`: OK.

MUTATIONS. Each was applied by node mutate.js, run under the hold, recorded, then reverted with `git checkout -- <file>`; `git status` was clean after every revert. All ran with HEAD = cc435283 (full hash cc4352834ba7725e7cb6d0b576cb6c799a35a43c), before the final clippy-line commit. Each was a verify-mutation run, not an observation. Failing set per mutation:
- K-C1: the single-edit form was NOT caught (recovery 26 and recovery_crash 3 all passed). Mutation: drop `held.contains(&name)` in the walk. The mutation was mis-aimed: the held-name filter has a second guard, the lock probe, which catches a record this run holds. I added K-C1b (also drop the lock probe's `Busy` guard). K-C1b failed `a_crashed_unsaved_record_is_listed_with_its_dataset_and_time` (the named test), `a_locked_record_is_never_offered` and `recovering_an_unsaved_record_whose_twin_a_live_run_holds_is_refused_as_locked`. Report K-C1 as K-C1b.
- K-C2: `declining_removes_the_record`.
- K-C3: crash tests `accepting_truncates_to_the_kept_prefix_and_later_steps_chain` and `recovering_at_a_projects_open_binds_the_open_and_its_next_step_continues_that_record`.
- K-C4: the single-edit form did NOT fail the named test. It failed only `unsaved_records_are_listed_beside_more_than_64_project_records`, because the dedupe treats the project's own record as its twin and drops it. Two-edit K-C4b (the walk also takes project folders, and the dedupe says Offer for them) failed `a_projects_record_is_offered_at_its_open_not_at_start` (named), `an_unsaved_record_moved_to_a_project_record_is_not_offered_twice` and `unsaved_records_are_listed_beside_more_than_64_project_records`. Report K-C4 as K-C4b.
- K-C5: `the_offer_states_found_or_not_found_data` and `a_refused_open_at_accept_leaves_the_record_byte_for_byte_and_listed`.
- K-C6: `a_locked_record_is_never_offered` and `recovering_an_unsaved_record_whose_twin_a_live_run_holds_is_refused_as_locked`.
- K-C7: `an_unsaved_record_moved_to_a_project_record_is_not_offered_twice` and `an_unsaved_record_whose_twin_a_live_run_holds_is_withheld_alone_and_more_is_set`.
- K-C8: lib unit test `session_history::tests::the_records_locations_writer_refuses_a_path_the_store_cannot_hold`.
- K-C9: `a_project_record_with_nothing_after_its_saved_mark_is_not_offered`.
- K-C10: `a_record_that_cannot_be_offered_is_left_in_place`, `a_record_holding_a_restored_mark_is_listed_with_discard_only` and `a_record_that_cannot_be_offered_is_listed_with_discard_only_and_refused_at_recover`.
- K-C11: `a_record_name_outside_the_two_shapes_is_refused`.
- K-C12: `recovering_into_an_open_that_has_a_step_is_refused`.
- K-C13: `a_normal_end_after_recovery_clears_the_record`, `a_second_recover_of_a_record_this_run_holds_is_refused_as_unknown` and both crash tests (the K-C3 and K-C19 ones).
- K-C14: `accepting_runs_the_full_check_and_returns_its_differences`.
- K-C15: `a_record_that_cannot_be_offered_is_listed_with_discard_only_and_refused_at_recover` (named), `a_record_that_cannot_be_offered_is_left_in_place` and `a_record_holding_a_restored_mark_is_listed_with_discard_only`.
- K-C16: `unsaved_records_are_listed_beside_more_than_64_project_records` (named) and `past_the_dedupe_bound_no_unsaved_record_is_listed_and_more_is_set`.
- K-C17: `the_listing_states_found_from_metadata_alone`.
- K-C18: `a_step_after_recovery_carries_the_headers_dataset_identity`.
- K-C19: crash test `recovering_at_a_projects_open_binds_the_open_and_its_next_step_continues_that_record`.
- K-C20: `recovering_a_projects_record_into_an_open_of_another_project_is_refused`.
- K-C21: `a_second_recover_of_a_record_this_run_holds_is_refused_as_unknown`.
- K-C22: `a_refused_open_at_accept_leaves_the_record_byte_for_byte_and_listed`.
- K-C23: `past_the_dedupe_bound_no_unsaved_record_is_listed_and_more_is_set`.
- K-C24 and K-C41 (one edit, one run, so report both from it): `a_folder_with_no_or_an_empty_history_is_not_listed` and `a_projects_folder_with_an_empty_history_is_left_unlocked_at_its_open`.
- K-C25: `a_project_record_another_run_holds_for_other_data_withholds_no_unsaved_offer` (named) and `an_unsaved_record_whose_twin_a_live_run_holds_is_withheld_alone_and_more_is_set`.
- K-C26: `an_unsaved_record_whose_twin_a_live_run_holds_is_withheld_alone_and_more_is_set` (named) and `recovering_an_unsaved_record_whose_twin_a_live_run_holds_is_refused_as_locked`.
- K-C27: lib unit `recovery::tests::the_project_side_is_read_after_the_unsaved_locks_not_from_the_first_names`.
- K-C36: `a_record_holding_a_restored_mark_is_listed_with_discard_only`.
- K-C37: `recovering_an_unsaved_record_whose_twin_a_live_run_holds_is_refused_as_locked`.
- K-C38: `an_unsaved_record_whose_projects_folder_holds_no_history_is_listed`.
- K-C42: lib unit `recovery::tests::a_refused_cut_after_the_open_closes_the_open_and_leaves_the_record`.
- P-1 (spatial-skp, removing `deny_unknown_fields` from RecoverSessionRequest): fixtures test `recovery_commands_round_trip_and_refuse_unknown_or_missing_members` (31 passed, 1 failed).
- The K-C1 and K-C4 single edits are mutation-script anchors in D:/wt/recov-target/drafts/mutate.js, not code in the branch. The form's mutation wording for these two does not reach the named test as written: the unsaved walk's lock probe and the dedupe each hide the edit.

WORD-COPYING: the §10.3 sentence was copied into SKP-V0.md by a node script (D:/wt/recov-target/drafts/apply_protocol.js from sentence-from-form.txt). Byte comparison: 83 bytes, sha256 prefix 308ad9cf93025a54, appears once in SKP-V0.md. No other ruling words were copied.

CHECKS:
- Suites: skp base/green exit 0; kernel final exit 0; both crates 635 passed, 0 failed, 49 ignored; fmt OK.
- Clippy (`cargo clippy -p spatial-kernel -p spatial-skp --all-targets`, exit 0): one warning on a line I wrote, fixed in 96c3821a (needless_borrows_for_generic_args at kernel/tests/recovery_crash.rs:158). The rest are on lines I did not write and I fixed none: kernel lib (kernel/src/permission/boundary.rs:536, publish/mod.rs:839, skp.rs:277, lib.rs:439, lib.rs:514), publish-bundle.rs:149, tests/partitioned_refusal_offers_no_declaration.rs:53, spatial-engine app_dirs.rs:39 and spatial-renderer (style.rs:10, canonical.rs:303). Clippy also compiled the full dependency set, so those warnings come from there.
- §2.11 count, `git diff --numstat 97e2156d...HEAD`, both columns summed, excluding the form, PLAN.yaml, CUSTODIAN-QUEUE.md/json, site, docs/README.md and lock files:
  - protocol 324 (budget 330), within.
  - conformance and fixtures 146 (budget 220), within.
  - literal (skp tests/data and fixtures.rs) 232 (budget 260), within.
  - kernel product 1,405 (budget 1,040), OVER by 365 (files: kernel/src/lib.rs, project/store.rs, recovery.rs, session_history.rs). recovery.rs alone carries about 978 product lines above its unit tests. This overrun is not mine to record.
  - kernel tests 1,188 (budget 1,510), within.
  - Part 1 total 3,295 lines and 27 files, against at most 5,200 lines and 47 files.

NEW `pub` ITEMS AND CALLERS:
- Types in protocol/skp/src/v0/commands.rs (ListRecoverableRequest, RecoverableRecord, RecoverableData, CannotBeOfferedReason, ListRecoverableResponse, RecoverSessionRequest, RecoveredOpen, RecoverSessionResponse, DiscardRecoverableRequest, DiscardRecoverableResponse): all used by kernel/src/recovery.rs.
- The four constructors `SkpError::recoverable_record_{locked,unknown,refused,not_for_this_open}`: all called from kernel/src/recovery.rs (locked 3 sites, not_for_this_open 2, unknown 1, refused 1).
- `StepRecorder::{list_recoverable, discard_recoverable, recover_session}`: called only from kernel/tests/recovery.rs and kernel/tests/recovery_crash.rs, 5 sites (no product caller in this phase; src-tauri in phase 2 is the product caller).
- `pub mod recovery;` in lib.rs and the `SKP_VERSION = "skp/0.18"` literal change: used by the above.

DEPARTURES AND STOPS (none is a stop):
1. First red run bundled two cargo commands in one hold (above).
2. Mutation K-C1 and K-C4 single-edit forms did not fail their named tests (above).
3. Kernel product group overrun (above).
4. Phase-1 kernel tests had to end the run before reading a held history (b5161d1b).
5. Reads of a held record are done through its own handle (`read_through`/`recover_head` in session_history.rs), the Windows H1 rule.
6. No file outside the form's Part 1 list was touched. I did not touch kernel/src/project/mod.rs, kernel/Cargo.toml, Cargo.lock, AdmissionPanel.tsx, frontends/ or kernel/src/skp.rs:2262.
7. No reply carries a path.

PRE-GATE SELF-CHECK (four classes):
- Wire: skp/0.18 literal, the version-refusal fixture row at skp/0.19, deny_unknown_fields, key_present on required-null members, all in the P-1 and fixtures runs.
- Kernel behaviour: all 33 K rows and the three unit tests are covered by named mutations above (K-C1 and K-C4 via the two-edit forms).
- Seam: cites are to real interfaces (file:line from the base). Several `pub(crate)` widenings in session_history.rs serve recovery.rs; none is `pub`.
- Records: the four P6-marked messages are placeholders and the SKP-V0.md §10.3 sentence is byte-copied. I made no record edits (KNOWN-LIMITATIONS, walkthrough, ADR).

MODEL: Sonnet 5.5. No override. Context handoff: one compaction mid-run, resumed from the summary and git state.

Hold exit codes: none of 96 to 99 occurred. Every hold ran in one Bash call under the exact shape. Every background wait used a foreground until-loop or completion notices.
