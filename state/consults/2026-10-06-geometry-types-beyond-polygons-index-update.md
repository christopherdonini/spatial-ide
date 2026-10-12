# Owner's-index update — geometry-types-beyond-polygons, MP-1 (lead-data, second pilot, piece 4)
Read at: cut/geometry-types-beyond-polygons 3c29bc67

## How to read this

- Each entry gives a README, the line number at 3c29bc67, the current line byte-copied in a fenced block, and the replacement in a second fenced block. Every edit replaces a line in place. No line is added or removed, so both sections keep their length.
- Both README files are unchanged by the branch: phase B's docs commit touched `KNOWN-LIMITATIONS.md` and the walkthrough only. The line numbers below are therefore the same on main at 7ce9dab2 as at 3c29bc67. I checked both headings and both Last-verified lines on main.
- Branch cites are written in words, as line N of a path. The replacement lines use the index's own `path::test` form, which is not a `path:N` token.
- The worker applies each replacement byte for byte. Each fenced block holds exactly one line.

## engine/README.md, Owner's index (section lines 495 to 527, 33 lines; unchanged)

### E-1. Last verified at, line 499

Current (line 499 of `engine/README.md`):
```text
- **Last verified at:** 9c8e7930 (every pointer checked at that commit)
```
Replacement:
```text
- **Last verified at:** 3c29bc67 (every pointer checked at that commit)
```

### E-2. Interfaces → Open and admission, line 501 (gains A-1)

Current (line 501 of `engine/README.md`):
```text
  - Open and admission → `spatial_engine::Dataset::open_cancellable`, `spatial_engine::crs`, `spatial_engine::crs_catalog` (`engine/src/crs-catalog.json`), `spatial_engine::identity`, `spatial_engine::AdmissionRecord`; on the wire through `protocol/skp/SKP-V0.md` §1 (`open_dataset`, `describe`) · pinned by `engine/tests/slice.rs::an_assertion_over_a_file_that_declares_a_crs_is_refused`, `engine/tests/identity.rs::a_duplicate_id_column_is_refused_rather_than_admitted_as_identity`, `engine/tests/admission_format_semantics.rs::f1_an_absent_crs_key_admits_under_the_formats_own_rule_with_that_provenance`
```
Replacement:
```text
  - Open and admission → `spatial_engine::Dataset::open_cancellable`, `spatial_engine::crs`, `spatial_engine::crs_catalog` (`engine/src/crs-catalog.json`), `spatial_engine::identity`, `spatial_engine::AdmissionRecord`, `spatial_engine::GeometryEncoding`, `spatial_engine::Dataset::geometry_encoding`, `spatial_engine::Dataset::declared_geometry_types`; on the wire through `protocol/skp/SKP-V0.md` §1 (`open_dataset`, `describe`) · pinned by `engine/tests/slice.rs::an_assertion_over_a_file_that_declares_a_crs_is_refused`, `engine/tests/identity.rs::a_duplicate_id_column_is_refused_rather_than_admitted_as_identity`, `engine/tests/admission_format_semantics.rs::f1_an_absent_crs_key_admits_under_the_formats_own_rule_with_that_provenance`, `engine/tests/geometry_admission.rs::a_declared_set_selects_the_encoding_or_is_refused_at_open`
```
- The pin is A-1. Its `fn` is at line 91 of `engine/tests/geometry_admission.rs`, a file new on the branch.
- This row also gains the three new `pub` items the branch adds (form §2 E3). They are the re-export `pub use geoarrow::GeometryEncoding` at line 125 of `engine/src/lib.rs`, `Dataset::geometry_encoding` at line 964 of `engine/src/dataset.rs`, and `Dataset::declared_geometry_types` at line 973 of the same file. The form lists only the pin as this row's gain, so this addition goes beyond its list, within the listed row. The final review may strike these three names and keep the pin alone.

### E-3. Interfaces → Viewport stream, envelope, batch sizing, line 502 (gains S-1 and G-1)

Current (line 502 of `engine/README.md`):
```text
  - Viewport stream, envelope, batch sizing → `spatial_engine::Dataset::stream_with_cancel`, `spatial_engine::BatchStream`, `spatial_engine::TaggedBatch`, `spatial_engine::BatchEnvelope`, `spatial_engine::BatchSizePolicy` · pinned by `engine/tests/slice.rs::every_batch_carries_the_envelope_not_just_the_first`, `engine/tests/slice.rs::a_viewport_in_another_crs_is_refused_because_nothing_here_reprojects`, `engine/tests/batch_sizing.rs::the_policy_stays_inside_its_ceiling_in_every_state_it_can_reach`
```
Replacement:
```text
  - Viewport stream, envelope, batch sizing → `spatial_engine::Dataset::stream_with_cancel`, `spatial_engine::BatchStream`, `spatial_engine::TaggedBatch`, `spatial_engine::BatchEnvelope`, `spatial_engine::BatchSizePolicy` · pinned by `engine/tests/slice.rs::every_batch_carries_the_envelope_not_just_the_first`, `engine/tests/slice.rs::a_viewport_in_another_crs_is_refused_because_nothing_here_reprojects`, `engine/tests/batch_sizing.rs::the_policy_stays_inside_its_ceiling_in_every_state_it_can_reach`, `engine/tests/multipolygon_stream.rs::f1_and_f2_stream_one_row_per_feature_with_bit_identical_parts`, `engine/tests/polygon_wire_golden.rs::the_polygon_only_wire_matches_the_golden_file`
```
- The S-1 pin's `fn` is at line 149 of `engine/tests/multipolygon_stream.rs`, a file new on the branch.
- The G-1 pin's `fn` is at line 247 of `engine/tests/polygon_wire_golden.rs`, a file new on the branch. Its golden file was added in the golden commit d8276158c49f7709126f9388fabfedec26d55b99.

### E-4. Interfaces → LOD tier builder, line 512 (gains L-1)

Current (line 512 of `engine/README.md`):
```text
  - LOD tier builder → `spatial_engine::lod::build_tiers` · pinned by `engine/tests/lod_tier_preflight.rs::the_preflight_refuses_before_the_first_tier_is_written`, `engine/tests/lod_tier_cancellation.rs::cancel_observed_within_the_declared_ceiling`
```
Replacement:
```text
  - LOD tier builder → `spatial_engine::lod::build_tiers` · pinned by `engine/tests/lod_tier_preflight.rs::the_preflight_refuses_before_the_first_tier_is_written`, `engine/tests/lod_tier_cancellation.rs::cancel_observed_within_the_declared_ceiling`, `engine/tests/lod_tier_builder.rs::build_tiers_refuses_a_multipolygon_feature_by_name_and_writes_no_tier`
```
- The L-1 pin's `fn` is at line 1505 of `engine/tests/lod_tier_builder.rs`. The file exists on main, but this test exists only on the branch. It carries the LOD boundary's existing ignore off Windows (form §2 Portability, R6).

### E-5. Governed by → accepted ADRs, line 517 (+ADR-034)

Current (line 517 of `engine/README.md`):
```text
  - accepted ADRs: ADR-004, ADR-005, ADR-006, ADR-007, ADR-010, ADR-013, ADR-015, ADR-016, ADR-017, ADR-018, ADR-021, ADR-026, ADR-032, ADR-033, ADR-035
```
Replacement:
```text
  - accepted ADRs: ADR-004, ADR-005, ADR-006, ADR-007, ADR-010, ADR-013, ADR-015, ADR-016, ADR-017, ADR-018, ADR-021, ADR-026, ADR-032, ADR-033, ADR-034, ADR-035
```
- ADR-034's status line, line 3 of its file at 3c29bc67, begins with the words Accepted 2026-10-05.

### E-6. Governed by → preregistrations in this module, line 518 (+this form)

Current (line 518 of `engine/README.md`):
```text
  - preregistrations in this module: `engine/ADMISSION-PREREGISTRATION.md`, `engine/B1-FOLLOWUPS-PREREGISTRATION.md`, `engine/B1-PROJECTION-PREREGISTRATION.md`, `engine/CANCEL-BEFORE-EXECUTE-PREREGISTRATION.md`, `engine/CORPUS-REPRODUCIBILITY-PREREGISTRATION.md`, `engine/EXTENSION-AUTOLOAD-PREREGISTRATION.md`, `engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md`, `engine/LOD-PREREGISTRATION.md`, `engine/LOD-RELEASE-GUARD-PREREGISTRATION.md`, `engine/SOURCE-WATCHER-PREREGISTRATION.md` (§2a), `engine/SUITES-BEYOND-WINDOWS-PREREGISTRATION.md`, `engine/TESTS-CONFIGURED-CONNECTIONS-PREREGISTRATION.md`, `engine/TYPE-WALK-NULL-LITERAL-ARITHMETIC-PREREGISTRATION.md`, `engine/WATCHER-FIRST-READ-PREREGISTRATION.md`
```
Replacement (inserted in the list's alphabetical order):
```text
  - preregistrations in this module: `engine/ADMISSION-PREREGISTRATION.md`, `engine/B1-FOLLOWUPS-PREREGISTRATION.md`, `engine/B1-PROJECTION-PREREGISTRATION.md`, `engine/CANCEL-BEFORE-EXECUTE-PREREGISTRATION.md`, `engine/CORPUS-REPRODUCIBILITY-PREREGISTRATION.md`, `engine/EXTENSION-AUTOLOAD-PREREGISTRATION.md`, `engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md`, `engine/LOD-PREREGISTRATION.md`, `engine/LOD-RELEASE-GUARD-PREREGISTRATION.md`, `engine/MULTIPOLYGON-MP1-PREREGISTRATION.md`, `engine/SOURCE-WATCHER-PREREGISTRATION.md` (§2a), `engine/SUITES-BEYOND-WINDOWS-PREREGISTRATION.md`, `engine/TESTS-CONFIGURED-CONNECTIONS-PREREGISTRATION.md`, `engine/TYPE-WALK-NULL-LITERAL-ARITHMETIC-PREREGISTRATION.md`, `engine/WATCHER-FIRST-READ-PREREGISTRATION.md`
```

### E-7. Declared limits, line 521 (+S-K1, S-K3, S-K4)

Current (line 521 of `engine/README.md`):
```text
- **Declared limits:** KNOWN-LIMITATIONS 2, 3, 9, 11, 19, 20, 22, 23, 24, 25, 26, 27
```
Replacement:
```text
- **Declared limits:** KNOWN-LIMITATIONS 2, 3, 9, 11, 19, 20, 22, 23, 24, 25, 26, 27, 31, 33, 34
```
- At 3c29bc67, `KNOWN-LIMITATIONS.md` has item 31 at line 335 (S-K1, by its source comment on line 337), item 33 at line 343 (S-K3, comment line 345) and item 34 at line 347 (S-K4, comment line 349).
- Item 9 stays in the list. Phase B left its text unchanged as true of the v0.1.0 artifact (form §2 KNOWN-LIMITATIONS, Not edited).

## kernel/README.md, Owner's index (section lines 346 to 383, 38 lines; unchanged)

### K-a. Last verified at, line 350

Current (line 350 of `kernel/README.md`):
```text
- **Last verified at:** d60a0bed (every pointer checked at that commit)
```
Replacement:
```text
- **Last verified at:** 3c29bc67 (every pointer checked at that commit)
```

### K-b. Interfaces → SKP v0 host, line 352 (gains K-1)

Current (line 352 of `kernel/README.md`):
```text
  - SKP v0 host, the five commands → `protocol/skp/SKP-V0.md` §1; `spatial_kernel::skp::SkpHost` · pinned by `kernel/tests/skp_admission.rs::viewport_query_refuses_synchronously_on_a_crs_mismatch_before_minting_a_handle`, `kernel/tests/source_watch_ordering.rs::describe_after_an_end_carries_session_end_and_describe_cancel_close_still_answer`
```
Replacement:
```text
  - SKP v0 host, the five commands → `protocol/skp/SKP-V0.md` §1; `spatial_kernel::skp::SkpHost` · pinned by `kernel/tests/skp_admission.rs::viewport_query_refuses_synchronously_on_a_crs_mismatch_before_minting_a_handle`, `kernel/tests/source_watch_ordering.rs::describe_after_an_end_carries_session_end_and_describe_cancel_close_still_answer`, `kernel/src/skp.rs::tests::the_real_describe_geometry_carries_the_engines_encoding_for_each_open`
```
- The K-1 pin's `fn` is at line 3035 of `kernel/src/skp.rs`, inside the `mod tests` that opens at line 2367 of the same file. The file exists on main, but this test exists only on the branch.
- Amendment 2, item 5.1 moved K-1's `declared_types` half to the wire commit ac5384408b197ced65434d9507bc54519da4c7da. The test name did not change: worker report 2, Mutations, commit 4, names the same test. One pin therefore covers both halves.

### K-c. Interfaces → Publish and the bundle format, line 362 (gains K-2)

Current (line 362 of `kernel/README.md`):
```text
  - Publish and the bundle format → ADR-017; `spatial_kernel::publish::preflight`, `spatial_kernel::publish::publish_unguarded`, `spatial_kernel::bundle` · pinned by `kernel/tests/publish.rs::the_emitted_manifest_has_exactly_the_key_sets_adr_017_declares`, `kernel/tests/publish.rs::an_existing_destination_is_refused_rather_than_replaced`, `kernel/tests/verify_bundle.rs::every_corruption_class_is_caught_with_its_declared_state`
```
Replacement:
```text
  - Publish and the bundle format → ADR-017; `spatial_kernel::publish::preflight`, `spatial_kernel::publish::publish_unguarded`, `spatial_kernel::bundle` · pinned by `kernel/tests/publish.rs::the_emitted_manifest_has_exactly_the_key_sets_adr_017_declares`, `kernel/tests/publish.rs::an_existing_destination_is_refused_rather_than_replaced`, `kernel/tests/verify_bundle.rs::every_corruption_class_is_caught_with_its_declared_state`, `kernel/tests/publish.rs::a_multipolygon_encoded_dataset_refuses_at_preflight_by_name_before_any_pin_or_write`
```
- The K-2 pin's `fn` is at line 1883 of `kernel/tests/publish.rs`. The file exists on main, but this test exists only on the branch.

### K-d. Governed by → accepted ADRs, line 373 (+ADR-034)

Current (line 373 of `kernel/README.md`):
```text
  - accepted ADRs: ADR-004, ADR-005, ADR-006, ADR-008, ADR-009, ADR-010, ADR-015, ADR-016, ADR-017, ADR-018, ADR-021, ADR-025, ADR-026, ADR-033, ADR-035
```
Replacement:
```text
  - accepted ADRs: ADR-004, ADR-005, ADR-006, ADR-008, ADR-009, ADR-010, ADR-015, ADR-016, ADR-017, ADR-018, ADR-021, ADR-025, ADR-026, ADR-033, ADR-034, ADR-035
```

### K-e. Governed by → kernel halves of pieces filed elsewhere, line 376 (+this form)

Current (line 376 of `kernel/README.md`):
```text
  - kernel halves of pieces filed elsewhere: `engine/SOURCE-WATCHER-PREREGISTRATION.md` (§2b), `engine/ADMISSION-PREREGISTRATION.md`, `engine/B1-PROJECTION-PREREGISTRATION.md`, `engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md`, `engine/WATCHER-FIRST-READ-PREREGISTRATION.md`, `frontends/shell/OWNER-INVALIDATION-PREREGISTRATION.md`, `protocol/skp/CANCEL-STATE-CLOSED-SET-PREREGISTRATION.md`, `protocol/data-plane/TERMINAL-WITHOUT-CREDIT-PREREGISTRATION.md`
```
Replacement (appended after the list's last `engine/` entry, following its existing order):
```text
  - kernel halves of pieces filed elsewhere: `engine/SOURCE-WATCHER-PREREGISTRATION.md` (§2b), `engine/ADMISSION-PREREGISTRATION.md`, `engine/B1-PROJECTION-PREREGISTRATION.md`, `engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md`, `engine/WATCHER-FIRST-READ-PREREGISTRATION.md`, `engine/MULTIPOLYGON-MP1-PREREGISTRATION.md`, `frontends/shell/OWNER-INVALIDATION-PREREGISTRATION.md`, `protocol/skp/CANCEL-STATE-CLOSED-SET-PREREGISTRATION.md`, `protocol/data-plane/TERMINAL-WITHOUT-CREDIT-PREREGISTRATION.md`
```

### K-f. Declared limits, line 378 (+S-K2)

Current (line 378 of `kernel/README.md`):
```text
- **Declared limits:** KNOWN-LIMITATIONS 5, 6, 8, 12, 16, 21, 28, 30
```
Replacement:
```text
- **Declared limits:** KNOWN-LIMITATIONS 5, 6, 8, 12, 16, 21, 28, 30, 32
```
- At 3c29bc67, `KNOWN-LIMITATIONS.md` has item 32 at line 339, which is S-K2 by its source comment on line 341. It names both the empty-list case and the absent-key case.

## Pointers checked and left unchanged

- **engine/README.md, every other line of the section (500, 503 to 511, 513 to 516, 519, 520, 522 to 527).**
  - Every named `spatial_engine` item resolves at 3c29bc67: the re-exports at lines 114 to 151 of `engine/src/lib.rs`, the `pub mod` lines at 81 to 112, and the `Dataset` methods in `engine/src/dataset.rs` and `engine/src/stream.rs`.
  - All 28 pinned tests resolve by name, and the three in-source pins sit inside their files' `mod tests`.
  - Every named file exists. `engine/Cargo.toml` names no path dependency on another module; its only `path` entry, line 82, is the crate itself.
  - The ADR files and statuses match: the accepted list is accepted, and ADR-023 is Proposed.
  - All 33 ceiling constants are in the files the index names.
- **kernel/README.md, every other line of the section (351, 353 to 361, 363 to 372, 374, 375, 377, 379 to 383).**
  - Every named `spatial_kernel` item resolves, including the crate-private `EngineCancel` and `CancelNotice` at lines 705 and 711 of `kernel/src/lib.rs`.
  - All 34 pinned tests resolve by name, and each in-source pin sits in its named module.
  - SKP-V0 §1, §3, §5, §7.5, §8's `skp/0.5` entry and §9.5 all exist at 3c29bc67.
  - The consumed-from rows still hold. The kernel reaches the new engine accessors through `Dataset`, which line 367 already names, and it names no new engine type: lines 1928 and 1931 of `kernel/src/skp.rs`, and line 492 of `kernel/src/publish/mod.rs`.
  - Every named file exists, and the README's own section *Declared composed ceilings (ADR-010 rule 6)* is at line 52.
  - The ADR statuses match: ADR-012, ADR-019, ADR-023 and ADR-024 are Proposed.
  - All 14 ceiling constants are in their named files.
- **The literal `skp/0.9`.** No line in either section names the current literal. Line 356 of `kernel/README.md` cites §8's `skp/0.5` entry, which still stands at line 830 of `protocol/skp/SKP-V0.md`, and line 369 names `SKP_VERSION` without a value. No pointer is made wrong.
- **Renames on the branch.** Worker report 2, Deviations, records two renames: a version test in `protocol/skp/tests/fixtures.rs` and the shell's `PickCeilingExceeded` field. Neither section names either one. No engine or kernel pin was renamed or moved out of its file.

## Line count

Each replaced line counts as one insertion and one deletion.
- `engine/README.md`: 7 lines replaced (499, 501, 502, 512, 517, 518, 521), so 7 insertions and 7 deletions, 14 changed lines. The section stays at 33 lines.
- `kernel/README.md`: 6 lines replaced (350, 352, 362, 373, 376, 378), so 6 insertions and 6 deletions, 12 changed lines. The section stays at 38 lines.
- The two files total 26 changed lines, against the 68 left in the docs group. With phase B's 62, the group stands at 88 of its 130.

## Found, not changed

- `kernel/GENERATION-CLOSE-RACES-FOLLOWUPS-PREREGISTRATION.md` exists in `kernel/` at 3c29bc67 but is absent from line 374's list of preregistrations in this module. This is an omission, not a wrong pointer.
- `spatial_kernel::publish::preflight_pinless`, which K-2 calls and where the new refusal is checked, is not named on line 362. It predates this piece. This is an omission, not a wrong pointer.

## Files read

All of the following were read in the worktree of `cut/geometry-types-beyond-polygons` at 3c29bc67, except where marked main. Where a range is marked by search, it was read through targeted search hits rather than in full.
- `engine/README.md`, lines 495 to 528; on main, heading and Last-verified lines by search.
- `kernel/README.md`, lines 346 to 384, plus line 52 by search; on main, heading and Last-verified lines by search.
- `engine/MULTIPOLYGON-MP1-PREREGISTRATION.md` (main), lines 1 to 637.
- `state/consults/2026-10-06-geometry-types-beyond-polygons-worker-report-1.md` (main), lines 1 to 172.
- `state/consults/2026-10-06-geometry-types-beyond-polygons-worker-report-2.md` (main), lines 1 to 136.
- `state/consults/2026-10-05-geometry-types-beyond-polygons-impact-read.md` (main), index-related lines by search.
- `KNOWN-LIMITATIONS.md`, item headings by search, plus lines 328 to 350.
- `protocol/skp/SKP-V0.md`, headings and `skp/0.5` / `skp/0.9` lines by search.
- `kernel/src/skp.rs`, lines 3025 to 3038, plus definitions, module heads and test `fn` lines by search.
- `engine/src/lib.rs`, lines 81 to 151 by search.
- Definitions, constants and test `fn` lines, by search:
  - engine: `engine/src/` (`dataset.rs`, `stream.rs`, `attributes.rs`, `envelope.rs`, `lod.rs`, `predicate.rs`, `pool.rs`, `crs.rs`, `descriptor.rs`, `geoparquet.rs`, `index.rs`, `rowgroup.rs`, `watch.rs`, `trace.rs`, `cancel.rs`, `pin.rs`) and `engine/tests/`;
  - kernel: `kernel/src/` (`lib.rs`, `params.rs`, `publish/`, `permission/`) and `kernel/tests/`.
- Cargo manifests: `engine/Cargo.toml` (the `path` lines) and `kernel/Cargo.toml` (the dependency lines).
- `docs/adr/`, status lines by search.
- Existence only, by file listing: `engine/*PREREGISTRATION.md`, `kernel/*PREREGISTRATION.md`, the named binaries, examples and docs.
- Git metadata, to confirm the checked-out commit: the worktree's `.git` file and HEAD, and the branch ref, which reads 3c29bc67f64634073373a28cd0ea24cc1280ed3e.
