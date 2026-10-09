# Owner's-index update — covering-names-missing-column (lead-data, second pilot, resumed)
Read at: cut/covering-names-missing-column a06a746b

Pointers only (`state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md` §1 item 2). The scope is the form's §9 Owner's index bullet (`engine/COVERING-NAMES-MISSING-COLUMN-PREREGISTRATION.md` §9, read in the main checkout). Every path:line pointer into the branch below is as read at a06a746b. Text is quoted only where it is byte-copied, with its path:line. Everything else is paraphrase. The "new" lines are the replacement text this update supplies. They are not quotations.

## 0. How this was read

- **Branch head:** the worktree's HEAD names `refs/heads/cut/covering-names-missing-column`, and that ref holds a06a746b73586765bbeff8cab40ec25cf6cbfd64. Its reflog shows five commits on top of 76a09d5c: 66e3088a, 27f2caca, e49e60b3, 7196452e and a06a746b. I had no shell, so I took no porcelain and relied on the custodian's report that the worktree is clean.
- **The diff:** I could not run `git diff 76a09d5c...a06a746b`, because I had no shell. I took the changed-file set from the five commit subjects in the reflog and from the worker report's commit list (`state/consults/2026-10-09-covering-names-missing-column-worker-report-1.md:13-23`, main checkout). Then I read each of those files on the branch:
  - `engine/src/dataset.rs`;
  - `engine/tests/covering_names_missing_column.rs`;
  - `kernel/tests/skp_projection.rs`;
  - `protocol/skp/SKP-V0.md`;
  - `KNOWN-LIMITATIONS.md`;
  - `engine/ADMISSION-RESULTS.md`.

  A file outside that set would not have been read. The reviewer's diff check (form §9) is the backstop.
- **Names confirmed from the branch's code, not from the report:**
  - C-1 is `engine/tests/covering_names_missing_column.rs:108` (`#[test]` at :107).
  - K-1 is `kernel/tests/skp_projection.rs:915` (`#[test]` at :914).
  - `Dataset::covering` is public. It is `pub fn covering(&self) -> Option<&CoveringBbox>` at `engine/src/dataset.rs:988`, inside `impl Dataset` (opened at :220). `Dataset` is re-exported at the crate root by `engine/src/lib.rs:127`.
  - The new decision items `CoveringFinding` (`engine/src/dataset.rs:1393`) and `judge_covering` (:1421) are private, so the index takes neither.

## 1. engine/README.md, Owner's index

### 1a. Last verified at (`engine/README.md:499`)

Old:
```text
- **Last verified at:** 14acee0b (every pointer checked at that commit)
```
New:
```text
- **Last verified at:** a06a746b (every pointer checked at that commit)
```

I checked every pointer in the section (lines 495 to 527) at a06a746b, with the two pointers added below included. Every one resolves; none fails to resolve.
- **Test names:** all 37 in the section match a function in the file the pointer names.
  - The three under `engine/src` sit inside `mod tests`: `engine/src/stream.rs:2637` (test at :3199), `engine/src/pin.rs:137` (:147) and `engine/src/cancel.rs:281` (:500).
  - The kernel pin `kernel/tests/typed_terminal_codes.rs:380` and `kernel/tests/end_to_end.rs:684` also resolve.
- **Public items:** each resolves by its `pub` definition or its re-export in `engine/src/lib.rs:87-157`.
- **Files:** each named file exists: `engine/src/crs-catalog.json`, `engine/examples/make-fixture.rs` and all 17 listed preregistrations.
- **Path dependencies:** `engine/Cargo.toml:82` is the only path dependency, and it points at the crate itself (`path = "."`).
- **ADRs:** each listed ADR's Status line (line 3, or line 5 for ADR-032) agrees with its accepted or proposed group.
- **KNOWN-LIMITATIONS:** items 2, 3, 9, 11, 19, 20, 22 to 27, 31 and 33 exist.
- **Ceilings:** all 33 named constants are defined in the file named beside them.
- **SKP-V0 sections:** §1, §7 and §9 exist (`protocol/skp/SKP-V0.md:13`, :349, :1084).

### 1b. Interfaces this module owns, Open and admission (`engine/README.md:501`)

Old:
```text
  - Open and admission → `spatial_engine::Dataset::open_cancellable`, `spatial_engine::crs`, `spatial_engine::crs_catalog` (`engine/src/crs-catalog.json`), `spatial_engine::identity`, `spatial_engine::AdmissionRecord`, `spatial_engine::GeometryEncoding`, `spatial_engine::Dataset::geometry_encoding`, `spatial_engine::Dataset::declared_geometry_types`; on the wire through `protocol/skp/SKP-V0.md` §1 (`open_dataset`, `describe`) · pinned by `engine/tests/slice.rs::an_assertion_over_a_file_that_declares_a_crs_is_refused`, `engine/tests/identity.rs::a_duplicate_id_column_is_refused_rather_than_admitted_as_identity`, `engine/tests/admission_format_semantics.rs::f1_an_absent_crs_key_admits_under_the_formats_own_rule_with_that_provenance`, `engine/tests/geometry_admission.rs::a_declared_set_selects_the_encoding_or_is_refused_at_open`, `engine/tests/geometry_admission.rs::a_declared_point_set_selects_the_point_encoding_and_other_sets_are_refused`, `engine/tests/geometry_admission.rs::a_declared_line_set_selects_the_line_encoding_and_other_sets_are_refused`
```
New:
```text
  - Open and admission → `spatial_engine::Dataset::open_cancellable`, `spatial_engine::crs`, `spatial_engine::crs_catalog` (`engine/src/crs-catalog.json`), `spatial_engine::identity`, `spatial_engine::AdmissionRecord`, `spatial_engine::GeometryEncoding`, `spatial_engine::Dataset::geometry_encoding`, `spatial_engine::Dataset::declared_geometry_types`, `spatial_engine::Dataset::covering`; on the wire through `protocol/skp/SKP-V0.md` §1 (`open_dataset`, `describe`) · pinned by `engine/tests/slice.rs::an_assertion_over_a_file_that_declares_a_crs_is_refused`, `engine/tests/identity.rs::a_duplicate_id_column_is_refused_rather_than_admitted_as_identity`, `engine/tests/admission_format_semantics.rs::f1_an_absent_crs_key_admits_under_the_formats_own_rule_with_that_provenance`, `engine/tests/geometry_admission.rs::a_declared_set_selects_the_encoding_or_is_refused_at_open`, `engine/tests/geometry_admission.rs::a_declared_point_set_selects_the_point_encoding_and_other_sets_are_refused`, `engine/tests/geometry_admission.rs::a_declared_line_set_selects_the_line_encoding_and_other_sets_are_refused`, `engine/tests/covering_names_missing_column.rs::a_covering_naming_a_column_the_file_lacks_is_unusable_and_a_bbox_query_refuses_before_any_lease`
```
The new line differs from the old one in two places only. `spatial_engine::Dataset::covering` is inserted after `spatial_engine::Dataset::declared_geometry_types`, and the C-1 pin is appended last.

### 1c. Governed by, preregistrations in this module (`engine/README.md:518`)

Old:
```text
  - preregistrations in this module: `engine/ADMISSION-PREREGISTRATION.md`, `engine/B1-FOLLOWUPS-PREREGISTRATION.md`, `engine/B1-PROJECTION-PREREGISTRATION.md`, `engine/CANCEL-BEFORE-EXECUTE-PREREGISTRATION.md`, `engine/CORPUS-REPRODUCIBILITY-PREREGISTRATION.md`, `engine/EXTENSION-AUTOLOAD-PREREGISTRATION.md`, `engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md`, `engine/GEOMETRY-LINES-PREREGISTRATION.md`, `engine/GEOMETRY-POINTS-PREREGISTRATION.md`, `engine/LOD-PREREGISTRATION.md`, `engine/LOD-RELEASE-GUARD-PREREGISTRATION.md`, `engine/MULTIPOLYGON-MP1-PREREGISTRATION.md`, `engine/SOURCE-WATCHER-PREREGISTRATION.md` (§2a), `engine/SUITES-BEYOND-WINDOWS-PREREGISTRATION.md`, `engine/TESTS-CONFIGURED-CONNECTIONS-PREREGISTRATION.md`, `engine/TYPE-WALK-NULL-LITERAL-ARITHMETIC-PREREGISTRATION.md`, `engine/WATCHER-FIRST-READ-PREREGISTRATION.md`
```
New:
```text
  - preregistrations in this module: `engine/ADMISSION-PREREGISTRATION.md`, `engine/B1-FOLLOWUPS-PREREGISTRATION.md`, `engine/B1-PROJECTION-PREREGISTRATION.md`, `engine/CANCEL-BEFORE-EXECUTE-PREREGISTRATION.md`, `engine/CORPUS-REPRODUCIBILITY-PREREGISTRATION.md`, `engine/COVERING-NAMES-MISSING-COLUMN-PREREGISTRATION.md`, `engine/EXTENSION-AUTOLOAD-PREREGISTRATION.md`, `engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md`, `engine/GEOMETRY-LINES-PREREGISTRATION.md`, `engine/GEOMETRY-POINTS-PREREGISTRATION.md`, `engine/LOD-PREREGISTRATION.md`, `engine/LOD-RELEASE-GUARD-PREREGISTRATION.md`, `engine/MULTIPOLYGON-MP1-PREREGISTRATION.md`, `engine/SOURCE-WATCHER-PREREGISTRATION.md` (§2a), `engine/SUITES-BEYOND-WINDOWS-PREREGISTRATION.md`, `engine/TESTS-CONFIGURED-CONNECTIONS-PREREGISTRATION.md`, `engine/TYPE-WALK-NULL-LITERAL-ARITHMETIC-PREREGISTRATION.md`, `engine/WATCHER-FIRST-READ-PREREGISTRATION.md`
```
The form is inserted in the list's existing alphabetical order, after `engine/CORPUS-REPRODUCIBILITY-PREREGISTRATION.md`. The file exists on the branch at a06a746b.

## 2. kernel/README.md, Owner's index

### 2a. Last verified at (`kernel/README.md:350`)

Old:
```text
- **Last verified at:** 14acee0b (every pointer checked at that commit)
```
New:
```text
- **Last verified at:** a06a746b (every pointer checked at that commit)
```

I checked every pointer in the section (lines 346 to 384) at a06a746b, with the two pointers added below included. Every one resolves; none fails to resolve.
- **Test names:** all 45 in the section match a function in the file the pointer names.
  - Those under `kernel/src/skp.rs` sit in `mod tests` (opened at :2374; tests at :2458, :3042, :3184, :3263) or in `mod ticket_drop_under_lock_regression` (opened at :3399; tests at :3541, :3923, :3963, :4547, :4913).
  - `cancel_notice_tests` is opened at `kernel/src/lib.rs:756` (test at :764).
  - The `tests` module in `kernel/src/params.rs` is opened at :128 (test at :151).
- **Public items:** every `spatial_kernel` item resolves, and so do the crate-private `EngineCancel` and `CancelNotice` (`kernel/src/lib.rs:706`, :712).
- **Consumed items:**
  - `spatial_data_plane::transport` (`SourceFactory`, `BatchSource`, `SourceCancel` with `cancel` and `on_cancel`, `OpenRequest`, `BatchMeta`) resolves, and `spatial_data_plane::serve` is re-exported at `protocol/data-plane/src/lib.rs:50-51`.
  - `spatial_skp::v0` (`SkpError`, `DatasetSessionEnded`, `SKP_VERSION`) resolves.
  - `spatial_renderer::compile` (re-exported at `renderer/src/lib.rs:51`) and `spatial_renderer::canonical` resolve.
  - `renderer/bundle-viewer/ceilings.json` is compiled in at `kernel/src/publish/ceilings.rs:36`.
- **Files:** every named file exists, including the 16 module preregistrations, the 6 measurement passes, the 12 kernel-half forms, `kernel/PERMISSION-BOUNDARY.md` and the three binaries' sources.
- **ADRs:** each listed ADR's Status line agrees with its accepted or proposed group.
- **KNOWN-LIMITATIONS:** items 5, 6, 8, 12, 16, 21, 28, 30 and 32 exist.
- **Ceilings:** each named constant is defined in the file named beside it, and the README section *Declared composed ceilings (ADR-010 rule 6)* exists at `kernel/README.md:52`.
- **SKP-V0 sections:** §1, §3 (`StreamHandle` at `protocol/skp/SKP-V0.md:170`), §5, §7.5, §8 `skp/0.5` (:831) and §9.5 (:1148) exist.

### 2b. Interfaces this module owns, SKP v0 host (`kernel/README.md:352`)

Old:
```text
  - SKP v0 host, the five commands → `protocol/skp/SKP-V0.md` §1; `spatial_kernel::skp::SkpHost` · pinned by `kernel/tests/skp_admission.rs::viewport_query_refuses_synchronously_on_a_crs_mismatch_before_minting_a_handle`, `kernel/tests/source_watch_ordering.rs::describe_after_an_end_carries_session_end_and_describe_cancel_close_still_answer`, `kernel/src/skp.rs::tests::the_real_describe_geometry_carries_the_engines_encoding_for_each_open`, `kernel/src/skp.rs::tests::the_real_describe_of_a_point_open_is_geoarrow_point_with_the_shared_key_set`, `kernel/src/skp.rs::tests::the_real_describe_of_a_line_open_is_its_line_encoding_with_the_shared_key_set`
```
New:
```text
  - SKP v0 host, the five commands → `protocol/skp/SKP-V0.md` §1; `spatial_kernel::skp::SkpHost` · pinned by `kernel/tests/skp_admission.rs::viewport_query_refuses_synchronously_on_a_crs_mismatch_before_minting_a_handle`, `kernel/tests/source_watch_ordering.rs::describe_after_an_end_carries_session_end_and_describe_cancel_close_still_answer`, `kernel/src/skp.rs::tests::the_real_describe_geometry_carries_the_engines_encoding_for_each_open`, `kernel/src/skp.rs::tests::the_real_describe_of_a_point_open_is_geoarrow_point_with_the_shared_key_set`, `kernel/src/skp.rs::tests::the_real_describe_of_a_line_open_is_its_line_encoding_with_the_shared_key_set`, `kernel/tests/skp_projection.rs::a_covering_naming_a_column_the_file_lacks_refuses_a_bbox_viewport_query_before_the_mint_and_describe_reports_no_covering`
```
The new line differs from the old one only in the K-1 pin, which is appended last.

### 2c. Governed by, kernel halves of pieces filed elsewhere (`kernel/README.md:377`)

Old:
```text
  - kernel halves of pieces filed elsewhere: `engine/SOURCE-WATCHER-PREREGISTRATION.md` (§2b), `engine/ADMISSION-PREREGISTRATION.md`, `engine/B1-PROJECTION-PREREGISTRATION.md`, `engine/B1-FOLLOWUPS-PREREGISTRATION.md`, `engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md`, `engine/GEOMETRY-LINES-PREREGISTRATION.md`, `engine/GEOMETRY-POINTS-PREREGISTRATION.md`, `engine/WATCHER-FIRST-READ-PREREGISTRATION.md`, `engine/MULTIPOLYGON-MP1-PREREGISTRATION.md`, `frontends/shell/OWNER-INVALIDATION-PREREGISTRATION.md`, `protocol/skp/CANCEL-STATE-CLOSED-SET-PREREGISTRATION.md`, `protocol/data-plane/TERMINAL-WITHOUT-CREDIT-PREREGISTRATION.md`
```
New:
```text
  - kernel halves of pieces filed elsewhere: `engine/SOURCE-WATCHER-PREREGISTRATION.md` (§2b), `engine/ADMISSION-PREREGISTRATION.md`, `engine/B1-PROJECTION-PREREGISTRATION.md`, `engine/B1-FOLLOWUPS-PREREGISTRATION.md`, `engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md`, `engine/GEOMETRY-LINES-PREREGISTRATION.md`, `engine/GEOMETRY-POINTS-PREREGISTRATION.md`, `engine/WATCHER-FIRST-READ-PREREGISTRATION.md`, `engine/MULTIPOLYGON-MP1-PREREGISTRATION.md`, `engine/COVERING-NAMES-MISSING-COLUMN-PREREGISTRATION.md`, `frontends/shell/OWNER-INVALIDATION-PREREGISTRATION.md`, `protocol/skp/CANCEL-STATE-CLOSED-SET-PREREGISTRATION.md`, `protocol/data-plane/TERMINAL-WITHOUT-CREDIT-PREREGISTRATION.md`
```
This list is grouped by module and is not alphabetical, so the form goes at the end of the `engine/` group, after `engine/MULTIPOLYGON-MP1-PREREGISTRATION.md`.

## 3. Other lines in the two sections made stale by the diff

None. I checked each changed file against the two sections:
- `engine/src/dataset.rs`:
  - `sanity_check`'s parameter list changed (`engine/src/dataset.rs:1193-1201`), and the private `CoveringFinding` and `judge_covering` were added. None of them is an index pointer.
  - `build_index` now also refuses `NoCoveringBbox` for a covering naming an absent column. The Experimental seams line's pointer and pins still resolve, and §9 of the form names no change to that line.
  - No `EngineError` variant was added, so the Typed refusals line is unchanged.
  - No ceiling constant was added or changed.
- `protocol/skp/SKP-V0.md`: the new note is a `###` heading at the end of §8 (`protocol/skp/SKP-V0.md:1075`). It renumbers no section, and every SKP-V0 section either index cites still resolves.
- `KNOWN-LIMITATIONS.md`: item 9 gained one sentence and one comment (`KNOWN-LIMITATIONS.md:115-116`). No item was added or renumbered. The engine index lists item 9 already, and the kernel's limits list is not moved by this diff.
- `engine/ADMISSION-RESULTS.md`: only header lines moved (`engine/ADMISSION-RESULTS.md:2`, :4, :8). Neither index points to the file.
- `engine/tests/covering_names_missing_column.rs` and `kernel/tests/skp_projection.rs`: tests were added only, and no existing pin was renamed. `kernel/tests/skp_projection.rs::every_projection_refusal_is_synchronous_typed_and_pre_mint` is still at :387.

Seen while checking, and not a stale line: `kernel/SKP-DRAINED-STREAM-HELPER-POST-CHECK-RACE-PREREGISTRATION.md` and `kernel/WIRE-BYTES-INVARIANT-TRACE-FLAG-RACE-PREREGISTRATION.md` exist on the branch and are absent from the kernel index. They are the gate files of nodes whose status is `ready` (`PLAN.yaml:4249-4253` and :4609-4613 at a06a746b), so they are not built pieces. Neither is in this piece's commit list, and this update adds neither.

## 4. The 60-line cap, after the update

Each change replaces one line with one line, so the counts do not change.
- `engine/README.md`, Owner's index: 33 lines, from the heading at :495 to the last bullet at :527. This is within 60.
- `kernel/README.md`, Owner's index: 39 lines, from the heading at :346 to the last bullet at :384. This is within 60.

## Files read

- `state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md` 1-62 (main checkout)
- `engine/COVERING-NAMES-MISSING-COLUMN-PREREGISTRATION.md` 1-316 (main checkout)
- `state/consults/2026-10-09-covering-names-missing-column-worker-report-1.md` 1-113 (main checkout)
- `state/consults/2026-10-09-covering-names-missing-column-impact-read.md` 1-109 (main checkout)
- `engine/README.md` 490-528 (branch, and the main checkout's Owner's index heading and Last verified at lines by grep)
- `kernel/README.md` 340-385, and :52 by grep (branch; main checkout's Owner's index heading and Last verified at lines by grep)
- the worktree's git metadata: HEAD, logs/HEAD 1-7, and the branch ref (read-only)
- `engine/src/dataset.rs` 425-599, 975-1014, 1185-1484; grep lines 145, 199, 220, 296, 630, 675, 723, 970, 979, 1401 (branch)
- `engine/src/lib.rs` 85-158 (branch)
- `engine/tests/covering_names_missing_column.rs` 1-367 (branch)
- `kernel/tests/skp_projection.rs` 825-1024, and :385-387 by grep (branch)
- `protocol/skp/SKP-V0.md` 1070-1085; section headings and `StreamHandle` by grep (branch)
- `KNOWN-LIMITATIONS.md` 108-119; item numbers by grep (branch)
- `engine/ADMISSION-RESULTS.md` 1-12 (branch)
- `engine/Cargo.toml` (grep `path =`, branch)
- `engine/src` and `engine/tests` (grep for the section's test names, public items and ceiling constants; `mod` lines in `cancel.rs`, `pin.rs`, `stream.rs`; branch)
- `kernel/src` and `kernel/tests` (grep for the section's test names, public items and ceiling constants; `mod` lines in `skp.rs`, `lib.rs`, `params.rs`; `pub mod`/`pub use` in `lib.rs`, `publish/mod.rs`, `permission/mod.rs`, `permission/audit/mod.rs`; branch)
- `protocol/data-plane/src/lib.rs`, `protocol/data-plane/src/transport.rs`, `protocol/skp/src` (grep, branch)
- `renderer/src/lib.rs`, `renderer/src/compiled.rs` (grep, branch)
- `kernel/src/publish/ceilings.rs` (grep, branch)
- `engine/SOURCE-WATCHER-PREREGISTRATION.md` (grep for §2a, §2b headings, branch)
- `docs/adr/` Status lines (grep, branch)
- `PLAN.yaml` (grep for the two kernel gate paths and for `status:` lines, branch)
- the existence of files by glob: the `engine/` and `kernel/` preregistrations, the kernel half forms, the binaries, `kernel/PERMISSION-BOUNDARY.md`, `renderer/bundle-viewer/ceilings.json`, `engine/src/crs-catalog.json`, `engine/examples/make-fixture.rs` (branch); the two kernel gate files (main checkout)
