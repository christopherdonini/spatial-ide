# Owner's-index update — skp-drained-stream-helper-post-check-race (lead-data, second pilot, resumed)
Read at: cut/skp-drained-stream-helper-post-check-race be7eecb3

Pointers only (state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md §1, item 2). Every path:line into kernel/, engine/, protocol/, renderer/, docs/adr/ or KNOWN-LIMITATIONS.md below was read at be7eecb3, in the branch's worktree. The form, the impact read, the worker report and the pilot directive were read in the main checkout. Text in fenced blocks marked old is byte-copied from the path:line given; text marked new is this update's replacement text, not a quotation.

What the update covers: the form's §9, its owner's-index bullet and the two sub-bullets under it, with Amendment 1 item 2 making the engine line owed.

## 1. kernel/README.md, Owner's index

### 1.1 Governed by, preregistrations in this module (this form's path added last)

Old, kernel/README.md:375 at be7eecb3:

```text
  - preregistrations in this module: `kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md`, `kernel/GENERATION-CLOSE-RACES-FOLLOWUPS-PREREGISTRATION.md`, `kernel/TICKET-DROP-UNDER-LOCK-PREREGISTRATION.md`, `kernel/TICKET-LIVENESS-REDEEM-PREREGISTRATION.md`, `kernel/CLOSE-DATASET-UNKNOWN-KEEPS-OPENRECORD-PREREGISTRATION.md`, `kernel/CATALOG-OPEN-REPLACE-DROP-NOTE-PREREGISTRATION.md`, `kernel/RAW-PATH-CREATE-REFUSAL-CODE-PREREGISTRATION.md`, `kernel/AUDIT-READER-CHAR-BOUNDARY-PREREGISTRATION.md`, `kernel/FIXTURE-REGENERATION-ENTRY-POINT-PREREGISTRATION.md`, `kernel/FIXTURES-REGENERATE-ORDER-PREREGISTRATION.md`, `kernel/TICKET-DROP-FOLLOWUPS-PREREGISTRATION.md`, `kernel/WATCH-GRANDPARENT-SPAWN-SIGNAL-PREREGISTRATION.md`, `kernel/TIMING-TESTS-PROPERTY-NOT-BUDGET-PREREGISTRATION.md`, `kernel/TIMING-ASSERTIONS-UNDER-CONTENTION-PREREGISTRATION.md`, `kernel/TYPED-TERMINAL-CODES-POST-CHECK-RACE-PREREGISTRATION.md`, `kernel/B2-1A-STEP-RECORD-AND-DATASET-REFERENCE-PREREGISTRATION.md`
```

New:

```text
  - preregistrations in this module: `kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md`, `kernel/GENERATION-CLOSE-RACES-FOLLOWUPS-PREREGISTRATION.md`, `kernel/TICKET-DROP-UNDER-LOCK-PREREGISTRATION.md`, `kernel/TICKET-LIVENESS-REDEEM-PREREGISTRATION.md`, `kernel/CLOSE-DATASET-UNKNOWN-KEEPS-OPENRECORD-PREREGISTRATION.md`, `kernel/CATALOG-OPEN-REPLACE-DROP-NOTE-PREREGISTRATION.md`, `kernel/RAW-PATH-CREATE-REFUSAL-CODE-PREREGISTRATION.md`, `kernel/AUDIT-READER-CHAR-BOUNDARY-PREREGISTRATION.md`, `kernel/FIXTURE-REGENERATION-ENTRY-POINT-PREREGISTRATION.md`, `kernel/FIXTURES-REGENERATE-ORDER-PREREGISTRATION.md`, `kernel/TICKET-DROP-FOLLOWUPS-PREREGISTRATION.md`, `kernel/WATCH-GRANDPARENT-SPAWN-SIGNAL-PREREGISTRATION.md`, `kernel/TIMING-TESTS-PROPERTY-NOT-BUDGET-PREREGISTRATION.md`, `kernel/TIMING-ASSERTIONS-UNDER-CONTENTION-PREREGISTRATION.md`, `kernel/TYPED-TERMINAL-CODES-POST-CHECK-RACE-PREREGISTRATION.md`, `kernel/B2-1A-STEP-RECORD-AND-DATASET-REFERENCE-PREREGISTRATION.md`, `kernel/SKP-DRAINED-STREAM-HELPER-POST-CHECK-RACE-PREREGISTRATION.md`
```

The added pointer resolves: kernel/SKP-DRAINED-STREAM-HELPER-POST-CHECK-RACE-PREREGISTRATION.md is present at be7eecb3.

### 1.2 Last verified at

Old, kernel/README.md:350 at be7eecb3:

```text
- **Last verified at:** a06a746b (every pointer checked at that commit)
```

New:

```text
- **Last verified at:** be7eecb3 (every pointer checked at that commit)
```

Every pointer in the section was checked at be7eecb3 (section 3 below). None fails to resolve.

### 1.3 Verified, not edited (names from the branch's code, not from the worker report)

- Stream tickets line (kernel/README.md:353): `a_ticket_redeems_exactly_once` at kernel/src/skp.rs:2458, inside `mod tests` (:2374, closing :3346); `a_raw_stream_params_start_is_refused_in_ticket_only_mode` at kernel/tests/skp_admission.rs:214; `an_unwind_through_cancel_drops_its_swept_source_after_releasing_the_guard` at kernel/src/skp.rs:3972 and `an_unwind_through_cancel_all_for_dataset_drops_its_retired_source_after_releasing_the_guard` at kernel/src/skp.rs:4012, both inside `mod ticket_drop_under_lock_regression` (:3399, closing :5018). Each carries `#[test]` on the line above.
- Close ordering line (kernel/README.md:358): `the_close_race_mints_no_generation_so_no_unheld_reference_exists` at kernel/src/skp.rs:4596; `a_close_whose_catalog_entry_is_already_gone_still_drops_its_watch` at kernel/src/skp.rs:4962; `cancel_of_a_pending_ticket_whose_post_check_found_a_change_does_not_hang` at kernel/src/skp.rs:3590. All three inside `mod ticket_drop_under_lock_regression`, each with `#[test]` on the line above.
- The helper, renamed nowhere: `drained_stream_with_a_recorded_change` at kernel/src/skp.rs:3488; the added `drained_stream_fixture` (:3425) and `fixture_with_features` (:3429) are private to the test module and no index line names them.

## 2. engine/README.md, Owner's index

### 2.1 Governed by: a new sub-bullet after the measurement-passes sub-bullet

The shape chosen: a sub-bullet for engine halves of pieces filed elsewhere, mirroring the kernel index's sub-bullet of that kind (kernel/README.md:377 at be7eecb3), placed last under Governed by as it is there. The existing measurement-passes line is unchanged; the new line is inserted after it.

Old, engine/README.md:519 at be7eecb3:

```text
  - measurement passes over this module's code: `kernel/PROBE-PREREGISTRATION.md`, `kernel/IMPORT-LAYOUT-PREREGISTRATION.md`, `kernel/SCALE-PASS-PREREGISTRATION.md`
```

New (two lines, replacing the one above):

```text
  - measurement passes over this module's code: `kernel/PROBE-PREREGISTRATION.md`, `kernel/IMPORT-LAYOUT-PREREGISTRATION.md`, `kernel/SCALE-PASS-PREREGISTRATION.md`
  - engine halves of pieces filed elsewhere: `kernel/SKP-DRAINED-STREAM-HELPER-POST-CHECK-RACE-PREREGISTRATION.md` (§2, Part B)
```

The section anchor resolves: the form's §2 holds Part B, and Amendment 1 item 2 puts it in scope.

### 2.2 Last verified at

Old, engine/README.md:499 at be7eecb3:

```text
- **Last verified at:** a06a746b (every pointer checked at that commit)
```

New:

```text
- **Last verified at:** be7eecb3 (every pointer checked at that commit)
```

Every pointer in the section was checked at be7eecb3 (section 3 below). None fails to resolve.

### 2.3 Verified, not edited

- Source descriptor, pre-check and post-check line (engine/README.md:508): `the_pre_check_refuses_by_name_when_the_source_is_replaced_under_an_open_dataset` at engine/tests/session_identity.rs:331 and `a_clean_stream_whose_source_changed_terminates_as_source_changed` at engine/tests/session_identity.rs:466, each with `#[test]` on the line above; `a_recorded_observation_differs_from_a_rewritten_file_by_the_descriptors_own_rule` at engine/tests/source_observation.rs:122.
- The Part B cancelled test, `a_cancelled_stream_keeps_its_cancelled_terminal_while_the_change_is_still_recorded` (engine/tests/session_identity.rs:524), is pinned by no index line.

## 3. The check behind both Last verified lines

Each pointer was checked to resolve at be7eecb3: test names by their `fn` line with a test attribute (`#[test]`, `#[tokio::test]`, or `#[test]` with a `cfg_attr` ignore on non-Windows) and, for inline tests, the enclosing `mod`; symbols by their `pub` item or `pub use`; files by presence; section anchors by heading; ADRs by their Status line; KNOWN-LIMITATIONS items by item number; ceilings by their `const` in the named file.

- kernel/README.md:350-384: 51 test pointers; the symbols on the interface and consumed lines, including `spatial_data_plane::serve` (re-exported, protocol/data-plane/src/lib.rs:50-51) and `spatial_renderer::compile` (re-exported, renderer/src/lib.rs:51); SKP-V0 §1, §3, §5, §7.5, §8 (`skp/0.5` entry at protocol/skp/SKP-V0.md:831), §9.5; engine/SOURCE-WATCHER-PREREGISTRATION.md §2b (:115); the README's own composed-ceilings section (kernel/README.md:52); 16 accepted and 5 proposed ADRs, each Status line matching its list; KNOWN-LIMITATIONS 5, 6, 8, 12, 16, 21, 28, 30, 32; every preregistration path; every ceiling.
- engine/README.md:499-527: 39 test pointers; every `spatial_engine` symbol (engine/src/lib.rs:86-157 and the method sites in engine/src); engine/src/crs-catalog.json and engine/examples/make-fixture.rs; SKP-V0 §1, §5, §7, §9; engine/Cargo.toml's only path dependency is itself (engine/Cargo.toml:82); 16 accepted and 2 proposed ADRs, Status lines matching; KNOWN-LIMITATIONS 2, 3, 9, 11, 19, 20, 22, 23, 24, 25, 26, 27, 31, 33; every preregistration path; every ceiling, `WATCH_BUFFER_BYTES` among them (engine/src/watch.rs:73, `pub(crate)`).

Pointers that do not resolve: none.

## 4. Other lines the diff makes stale

None. The diff renames no pinned test, adds no public item, constant or ceiling, and no index line cites a line number in either changed file. The test module's new import of `spatial_engine::MAX_QUEUED_BATCHES` (kernel/src/skp.rs:3406) does not stale the Consumed from other modules line (kernel/README.md:368): kernel tests already imported it before this piece (kernel/tests/typed_terminal_codes.rs:29, kernel/tests/session_end_event.rs:17).

Observed outside this diff, not filled: kernel/WIRE-BYTES-INVARIANT-TRACE-FLAG-RACE-PREREGISTRATION.md is present at be7eecb3 and is not on the kernel Governed by line. This piece's diff did not cause that, and this update does not add it.

## 5. The 60-line cap, after the update

Counted from the section heading to its last line, blank lines included.
- kernel/README.md: 39 lines before (:346-384), 39 after (one line replaced by one).
- engine/README.md: 33 lines before (:495-527), 34 after (one line inserted).

## Files read

Main checkout:
- state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md: 1-61
- kernel/SKP-DRAINED-STREAM-HELPER-POST-CHECK-RACE-PREREGISTRATION.md: 1-265
- state/consults/2026-10-09-skp-drained-stream-helper-post-check-race-impact-read.md: 1-138
- state/consults/2026-10-09-skp-drained-stream-helper-post-check-race-worker-report-1.md: 1-94

Branch worktree at be7eecb3:
- kernel/README.md: 340-384; grep hits :52, :59, :73
- engine/README.md: 490-527
- kernel/src/skp.rs: 3399-3523; grep hits for module boundaries, the pinned test names with their attribute lines, and the public items and constants the index names
- kernel/src/lib.rs: grep hits for public items, `ticket_only`, `EngineCancel`, `CancelNotice`, `cancel_notice_tests` and its test
- kernel/src/params.rs: grep hits :127-128, :150-151
- kernel/src/publish/mod.rs, kernel/src/publish/ceilings.rs, kernel/src/publish/viewer_assets.rs, kernel/src/permission/mod.rs, kernel/src/permission/boundary.rs, kernel/src/permission/grant.rs, kernel/src/permission/audit/log.rs, kernel/src/dataset_ref.rs: grep hits for the named items and constants
- kernel/Cargo.toml: grep hits :2, :11-16
- kernel/tests/*.rs: grep hits for the pinned test names with their attribute lines, and for `MAX_QUEUED_BATCHES`
- engine/src/lib.rs: 60-158
- engine/src/*.rs: grep hits for the named methods, `SourceObservation`, the ceilings, and the inline test modules in stream.rs, pin.rs and cancel.rs
- engine/tests/*.rs: grep hits for the pinned test names with their attribute lines; engine/tests/session_identity.rs function and constant lines
- engine/Cargo.toml: grep hit :82
- protocol/data-plane/src/lib.rs, protocol/data-plane/src/transport.rs, protocol/skp/src/lib.rs, protocol/skp/src/v0/mod.rs, protocol/skp/src/v0/error.rs, protocol/skp/src/v0/events.rs, protocol/data-plane/Cargo.toml, protocol/skp/Cargo.toml: grep hits for the consumed items
- renderer/src/lib.rs, renderer/Cargo.toml: grep hits
- protocol/skp/SKP-V0.md: section headings by grep
- engine/SOURCE-WATCHER-PREREGISTRATION.md: section headings by grep (:66, :115)
- docs/adr/ADR-004 to ADR-036 (the numbers both indexes list): Status lines by grep
- KNOWN-LIMITATIONS.md: item numbers by grep
- presence by glob: kernel/*PREREGISTRATION.md, engine/*PREREGISTRATION.md, the other preregistration and doc paths both indexes name, kernel/src/main.rs, kernel/src/bin/publish-bundle.rs, kernel/examples/verify-bundle.rs, renderer/bundle-viewer/ceilings.json, engine/src/crs-catalog.json, engine/examples/make-fixture.rs
