*Custodian's filing note (2026-10-03): lead-data's first dispatch (PLAN node `lead-data-pilot-setup`, Part 4) wrote this report to this path itself and returned "sha256: not computed" (the 2026-10-03 lead-data clarification, C3). It is committed as written, below the rule. The hash of record of the text below the rule, from its fifth line to the end, is 160c89e1dc5a8db624c303f27e465757a404768332c50e29df8498a5d4f27e46, computed by the custodian from the saved bytes. C3's check passed: before the dispatch (09:40:08Z) and after it (10:04:24Z), the only difference in the custodian checkout is this file, and the assigned worktree is unchanged at af40bbf. Its two questions in section 6: question 1 (C5) is taken by the custodian, with the recomposition routed to proposed node `kernel-composed-ceiling-projected-stream`; question 2 (C8) is held for the human, as the OPEN 2026-10-03 entry in `DECISIONS-PENDING.md`.*

---

# lead-data report 1 — lead-data-pilot-setup, Part 4 (owner's indexes) at af40bbf

*lead-data, first dispatch, 2026-10-03. Read at main af40bbf (`C:/dev/spatial-ide`), with Read, Grep and Glob only. This file is the only one written. Template: `state/directives/LEAD-DATA-PILOT-2026-10-03.md`, Part 4, lines 55-65; the heading line and the italic rule line below are copied from it byte for byte. Nothing below quotes a governing document; the fenced blocks are text for the worker to insert, and the anchors in item 3 are byte-copies of `kernel/README.md` at af40bbf.*

## 1. (a) The owner's index for `engine/README.md`

```
## Owner's index (data-path lead; a current-state summary, edited in place)

*Pointers only: nothing here restates a schema, an ADR or a limitation. Updated in the PR of every piece that changes what a pointer points to. At most 60 lines.*

- **Last verified at:** af40bbf (every pointer checked at that commit)
- **Interfaces this module owns:**
  - Open and admission → `spatial_engine::Dataset::open_cancellable`, `spatial_engine::crs`, `spatial_engine::crs_catalog` (`engine/src/crs-catalog.json`), `spatial_engine::identity`, `spatial_engine::AdmissionRecord`; on the wire through `protocol/skp/SKP-V0.md` §1 (`open_dataset`, `describe`) · pinned by `engine/tests/slice.rs::an_assertion_over_a_file_that_declares_a_crs_is_refused`, `engine/tests/identity.rs::a_duplicate_id_column_is_refused_rather_than_admitted_as_identity`, `engine/tests/admission_format_semantics.rs::f1_an_absent_crs_key_admits_under_the_formats_own_rule_with_that_provenance`
  - Viewport stream, envelope, batch sizing → `spatial_engine::Dataset::stream_with_cancel`, `spatial_engine::BatchStream`, `spatial_engine::TaggedBatch`, `spatial_engine::BatchEnvelope`, `spatial_engine::BatchSizePolicy` · pinned by `engine/tests/slice.rs::every_batch_carries_the_envelope_not_just_the_first`, `engine/tests/slice.rs::a_viewport_in_another_crs_is_refused_because_nothing_here_reprojects`, `engine/tests/batch_sizing.rs::the_policy_stays_inside_its_ceiling_in_every_state_it_can_reach`
  - Live projected stream → `spatial_engine::Dataset::admit_projection`, `spatial_engine::Dataset::stream_projected_with_cancel`, `spatial_engine::AdmittedProjection`, `spatial_engine::ProjectionError`; on the wire through SKP-V0 §9 · pinned by `engine/tests/live_projection.rs::a_live_projected_stream_emits_id_geometry_then_the_declared_columns`
  - Filter admission → `spatial_engine::AdmittedPredicate::admit`, `spatial_engine::FilterError`, `spatial_engine::PredicateAdmitError`, `spatial_engine::TypeRefusalReason`; on the wire through SKP-V0 §7 · pinned by `engine/tests/predicate_admission.rs::the_adversarial_corpus_each_row_refused_with_its_specific_code`, `engine/tests/filter_type_admission.rs::each_corpus_row_is_admitted_or_refused_with_its_code_reason_and_operand_types`
  - Publish stream and content pin → `spatial_engine::Dataset::stream_for_publish`, `spatial_engine::Dataset::pin_content`, `spatial_engine::ContentPin` · pinned by `engine/tests/publish_stream.rs::a_publish_partition_is_one_batch_and_its_boundaries_are_reproducible`, `engine/src/pin.rs::tests::a_pin_verifies_against_unchanged_bytes_and_refuses_changed_ones`
  - Cancellation → `spatial_engine::CancelToken` · pinned by `engine/src/cancel.rs::tests::an_interrupt_on_an_idle_connection_is_not_latched`, `engine/tests/cancel_execute_window.rs::a_cancel_inside_the_producers_execute_window_ends_the_stream_cancelled`
  - Connection pool and lease classes → `spatial_engine::ConnectionPool`, `spatial_engine::PoolConfig`, `spatial_engine::LeaseClass` · pinned by `engine/tests/connection_reuse.rs::capacity_exhaustion_is_a_typed_refusal_rather_than_a_queue`, `engine/tests/predicate_admission.rs::a_residual_admission_lease_exhaustion_surfaces_as_connections_exhausted_never_rejected_by_binder`
  - Source descriptor, pre-check and post-check → `spatial_engine::SourceDescriptor`, `spatial_engine::Dataset::check_source_unchanged`, `spatial_engine::StreamStats` · pinned by `engine/tests/session_identity.rs::the_pre_check_refuses_by_name_when_the_source_is_replaced_under_an_open_dataset`, `engine/tests/session_identity.rs::a_clean_stream_whose_source_changed_terminates_as_source_changed`
  - Source-change watcher adapter → `spatial_engine::watch` (`SourceWatchArm`, `ArmedWatch`, `ArmOutcome`, `PlatformWatch`, `WatchSignal`, `WatchSink`) · pinned by `engine/tests/source_watch_adapter.rs::a_temp_write_renamed_over_the_source_signals_change`, `engine/tests/source_watch_adapter.rs::a_forced_overflow_signals_coverage_lost`
  - Typed refusals → `spatial_engine::EngineError`, given wire codes by `spatial_kernel::skp::error_of` (SKP-V0 §5) · pinned by `kernel/tests/typed_terminal_codes.rs::the_prefix_is_the_convention_for_every_engine_refusal_not_a_special_case`
  - Experimental seams → `spatial_engine::Dataset::build_index`, `spatial_engine::Dataset::stream_indexed_experimental`, `spatial_engine::rowgroup` · pinned by `engine/tests/planner_seam.rs::the_product_planner_never_reaches_the_index_seam`, `engine/tests/row_group_seam.rs::the_product_planner_never_reaches_the_row_group_seam`, `engine/tests/spatial_index.rs::an_indexed_query_returns_exactly_what_the_scan_returns`
  - LOD tier builder → `spatial_engine::lod::build_tiers` · pinned by `engine/tests/lod_tier_preflight.rs::the_preflight_refuses_before_the_first_tier_is_written`, `engine/tests/lod_tier_cancellation.rs::cancel_observed_within_the_declared_ceiling`
  - No transport in this module → pinned by `engine/tests/slice.rs::h6_the_engine_module_names_no_transport`, `kernel/tests/end_to_end.rs::the_engine_does_not_depend_on_the_data_plane_or_the_other_way_round`
  - Test support behind the `fixture` feature → `spatial_engine::fixture`, `spatial_engine::layout`, `engine/examples/make-fixture.rs`
- **Consumed from other modules:** none (`engine/Cargo.toml` declares no path dependency on another module)
- **Governed by:**
  - ADRs: ADR-004, ADR-005, ADR-006, ADR-007, ADR-010, ADR-013, ADR-015, ADR-016, ADR-017, ADR-018, ADR-021, ADR-023, ADR-026, ADR-032, ADR-033, ADR-035
  - preregistrations in this module: `engine/ADMISSION-PREREGISTRATION.md`, `engine/B1-PROJECTION-PREREGISTRATION.md`, `engine/CANCEL-BEFORE-EXECUTE-PREREGISTRATION.md`, `engine/CORPUS-REPRODUCIBILITY-PREREGISTRATION.md`, `engine/EXTENSION-AUTOLOAD-PREREGISTRATION.md`, `engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md`, `engine/LOD-PREREGISTRATION.md`, `engine/LOD-RELEASE-GUARD-PREREGISTRATION.md`, `engine/SOURCE-WATCHER-PREREGISTRATION.md` (§2a), `engine/SUITES-BEYOND-WINDOWS-PREREGISTRATION.md`, `engine/TESTS-CONFIGURED-CONNECTIONS-PREREGISTRATION.md`, `engine/WATCHER-FIRST-READ-PREREGISTRATION.md`
  - measurement passes over this module's code: `kernel/PROBE-PREREGISTRATION.md`, `kernel/IMPORT-LAYOUT-PREREGISTRATION.md`, `kernel/SCALE-PASS-PREREGISTRATION.md`
- **Declared limits:** KNOWN-LIMITATIONS 2, 3, 9, 11, 19, 20, 22, 23, 24, 25, 26, 27
- **Ceilings:**
  - `MAX_BATCH_BYTES`, `TARGET_BATCH_BYTES`, `FIRST_TARGET_BATCH_BYTES`, `MIN_BATCH_BYTES`, `BATCH_GROWTH_FACTOR`, `MAX_ROWS_PER_BATCH`, `MAX_QUEUED_BATCHES`, `MAX_ATTRIBUTE_RETENTION_FACTOR`, `PUBLISH_PARTITION_TARGET_BYTES`, `PUBLISH_PARTITION_ROWS`, `MAX_PUBLISH_PARTITIONS` (`engine/src/stream.rs`)
  - `MAX_STREAM_CONNECTIONS`, `MAX_MAINTENANCE_CONNECTIONS`, `MAX_ADMISSION_CONNECTIONS`, `MAX_PHYSICAL_CONNECTIONS` (`engine/src/pool.rs`)
  - `MAX_PREDICATE_BYTES`, `MAX_PREDICATE_DEPTH` (`engine/src/predicate.rs`) · `MAX_PROJECTED_ATTRIBUTES` (`engine/src/attributes.rs`) · `MAX_CRS_DEFINITION_BYTES` (`engine/src/crs.rs`) · `FOOTER_DESCRIPTOR_MAX_BYTES` (`engine/src/descriptor.rs`) · `SANITY_SAMPLE_MAX_ROWS`, `MAX_UNIT_NAME_BYTES` (`engine/src/geoparquet.rs`)
  - `MAX_INDEXED_FEATURES`, `GRID_AXIS_CELLS`, `MAX_CELLS_PER_FEATURE`, `MAX_ID_RANGES` (`engine/src/index.rs`) · `MAX_INDEXED_ROW_GROUPS`, `MAX_ROW_GROUP_RANGES` (`engine/src/rowgroup.rs`)
  - `LOD_TIER_MAX_RELATIVE_BYTES`, `LOD_TIER_SET_HARD_BOUND_RELATIVE_BYTES`, `LOD_CANCEL_OBSERVED_CEILING_MS` (`engine/src/lod.rs`) · `WATCH_BUFFER_BYTES` (`engine/src/watch.rs`) · `TRACE_BUFFER_RECORDS` (`engine/src/trace.rs`)
```

32 lines.

## 2. (b) The owner's index for `kernel/README.md`

```
## Owner's index (data-path lead; a current-state summary, edited in place)

*Pointers only: nothing here restates a schema, an ADR or a limitation. Updated in the PR of every piece that changes what a pointer points to. At most 60 lines.*

- **Last verified at:** af40bbf (every pointer checked at that commit)
- **Interfaces this module owns:**
  - SKP v0 host, the five commands → `protocol/skp/SKP-V0.md` §1; `spatial_kernel::skp::SkpHost` · pinned by `kernel/tests/skp_admission.rs::viewport_query_refuses_synchronously_on_a_crs_mismatch_before_minting_a_handle`, `kernel/tests/source_watch_ordering.rs::describe_after_an_end_carries_session_end_and_describe_cancel_close_still_answer`
  - Stream tickets → ADR-019; `spatial_kernel::skp::StreamRegistry`, `spatial_kernel::EngineSourceFactory::ticket_only` · pinned by `kernel/src/skp.rs::tests::a_ticket_redeems_exactly_once`, `kernel/tests/skp_admission.rs::a_raw_stream_params_start_is_refused_in_ticket_only_mode`
  - Dataset-session generations and their end → ADR-035; `spatial_kernel::skp::GenerationRegistry`, `spatial_kernel::skp::SessionInvalidator::end_generation`, `spatial_kernel::skp::SessionEndReason` · pinned by `kernel/tests/session_generation.rs::live_generation_never_resurrects_an_invalidated_generation`, `kernel/tests/session_generation.rs::a_ticket_whose_generation_ended_refuses_at_redemption_with_its_typed_code`
  - Session-end event → ADR-035; SKP-V0 §8 (`skp/0.5`); `spatial_kernel::skp::session_end_channel` · pinned by `kernel/tests/session_end_event.rs::a_pre_check_end_emits_once_and_refuses_its_call`, `kernel/tests/session_end_event.rs::a_full_queue_loses_the_event_never_blocks_the_end_and_the_next_call_still_refuses`
  - Watcher arming and admission → `engine/SOURCE-WATCHER-PREREGISTRATION.md` §2b; `spatial_kernel::skp::SkpHost::open_dataset` · pinned by `kernel/tests/source_watch_ordering.rs::a_signal_between_arming_and_admission_refuses_the_open`, `kernel/tests/source_watch_ordering.rs::coverage_loss_refuses_with_its_own_code_never_source_changed`, `kernel/tests/watcher_first_read_windows.rs::the_opener_threads_exit_does_not_end_a_healthy_session`
  - Close ordering → `spatial_kernel::skp::SkpHost::close_dataset` · pinned by `kernel/src/skp.rs::ticket_drop_under_lock_regression::the_close_race_mints_no_generation_so_no_unheld_reference_exists`, `kernel/src/skp.rs::ticket_drop_under_lock_regression::a_close_whose_catalog_entry_is_already_gone_still_drops_its_watch`, `kernel/src/skp.rs::ticket_drop_under_lock_regression::cancel_of_a_pending_ticket_whose_post_check_found_a_change_does_not_hang`
  - Wire error codes → SKP-V0 §5, §7.5, §9.5; `spatial_kernel::skp::error_of`, `spatial_kernel::skp::filter_error_of`, `spatial_kernel::skp::terminal_detail_of` · pinned by `kernel/tests/typed_terminal_codes.rs::the_prefix_is_the_convention_for_every_engine_refusal_not_a_special_case`, `kernel/tests/skp_projection.rs::every_projection_refusal_is_synchronous_typed_and_pre_mint`, `kernel/tests/skp_admission.rs::a_filtered_viewport_query_comparing_text_with_a_number_refuses_synchronously_typed_and_mints_no_ticket`
  - Catalog → `spatial_kernel::Catalog` · pinned by `kernel/tests/catalog_replace.rs::replacing_a_name_through_open_cancellable_serves_the_new_dataset_and_drops_the_old_one_before_it_returns`
  - Raw admission path → `spatial_kernel::EngineSourceFactory`, `spatial_kernel::StreamParams`, `spatial_kernel::OPERATION` · pinned by `kernel/tests/end_to_end.rs::h1_the_payload_that_arrives_is_the_payload_the_file_holds`, `kernel/tests/end_to_end.rs::a_create_time_engine_refusal_on_the_raw_path_carries_its_typed_code`, `kernel/src/params.rs::tests::viewport_edges_cross_as_exact_bit_patterns`
  - Publish and the bundle format → ADR-017; `spatial_kernel::publish::preflight`, `spatial_kernel::publish::publish_unguarded`, `spatial_kernel::bundle` · pinned by `kernel/tests/publish.rs::the_emitted_manifest_has_exactly_the_key_sets_adr_017_declares`, `kernel/tests/publish.rs::an_existing_destination_is_refused_rather_than_replaced`, `kernel/tests/verify_bundle.rs::every_corruption_class_is_caught_with_its_declared_state`
  - Class-3 permission boundary and audit log → `kernel/PERMISSION-BOUNDARY.md`; `spatial_kernel::permission::boundary::execute`, `spatial_kernel::permission::audit` · pinned by `kernel/tests/permission_boundary.rs::the_permission_boundary_is_the_only_caller_of_the_publish_operation_in_this_crate`, `kernel/tests/permission_boundary.rs::an_intent_without_an_outcome_is_a_readable_state_not_a_missing_record`
  - Binaries and the bundle verifier → `slice-host` (`kernel/src/main.rs`), `publish-bundle` (`kernel/src/bin/publish-bundle.rs`), the `verify-bundle` example (`kernel/examples/verify-bundle.rs`) · pinned by `kernel/tests/publish_cli.rs::the_interactive_approval_requires_the_destination_name_and_refuses_everything_else`, `kernel/tests/verify_bundle.rs::a_real_bundle_verifies`
  - No generation or session reference in a persisted artifact → pinned by `kernel/tests/no_generation_in_persisted_artifacts.rs::the_published_bundle_carries_no_session_reference_key_or_value`
- **Consumed from other modules:**
  - `spatial_engine` (`Dataset`, `BatchStream`, `CancelToken`, `EngineError`, and the admission, projection, filter and watch types) ← engine
  - `spatial_data_plane::transport` (`SourceFactory`, `BatchSource`, `SourceCancel`, `OpenRequest`, `BatchMeta`), `spatial_data_plane::serve` ← protocol/data-plane
  - `spatial_skp::v0` (commands, handles, `SkpError`, `DatasetSessionEnded`, `SKP_VERSION`) ← protocol/skp
  - `spatial_renderer::compile`, `spatial_renderer::canonical` ← renderer
  - `renderer/bundle-viewer/ceilings.json` (compiled in by `kernel/src/publish/ceilings.rs`), and the built viewer passed in as `spatial_kernel::publish::ViewerAssets` ← renderer/bundle-viewer
- **Governed by:**
  - ADRs: ADR-004, ADR-005, ADR-006, ADR-008, ADR-009, ADR-010, ADR-012, ADR-015, ADR-016, ADR-017, ADR-018, ADR-019, ADR-021, ADR-023, ADR-024, ADR-025, ADR-026, ADR-033, ADR-035
  - preregistrations in this module: `kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md`, `kernel/TICKET-DROP-UNDER-LOCK-PREREGISTRATION.md`, `kernel/TICKET-LIVENESS-REDEEM-PREREGISTRATION.md`, `kernel/CLOSE-DATASET-UNKNOWN-KEEPS-OPENRECORD-PREREGISTRATION.md`, `kernel/CATALOG-OPEN-REPLACE-DROP-NOTE-PREREGISTRATION.md`, `kernel/RAW-PATH-CREATE-REFUSAL-CODE-PREREGISTRATION.md`, `kernel/AUDIT-READER-CHAR-BOUNDARY-PREREGISTRATION.md`, `kernel/FIXTURE-REGENERATION-ENTRY-POINT-PREREGISTRATION.md`, `kernel/FIXTURES-REGENERATE-ORDER-PREREGISTRATION.md`
  - measurement passes: `kernel/PROBE-PREREGISTRATION.md`, `kernel/FIRST-BATCH-AND-PRUNING-PREREGISTRATION.md`, `kernel/QUERY-WINDOW-ATTRIBUTION-PREREGISTRATION.md`, `kernel/CANCEL-RESCORE-PREREGISTRATION.md`, `kernel/IMPORT-LAYOUT-PREREGISTRATION.md`, `kernel/SCALE-PASS-PREREGISTRATION.md`
  - kernel halves of pieces filed elsewhere: `engine/SOURCE-WATCHER-PREREGISTRATION.md` (§2b), `engine/ADMISSION-PREREGISTRATION.md`, `engine/B1-PROJECTION-PREREGISTRATION.md`, `engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md`, `engine/WATCHER-FIRST-READ-PREREGISTRATION.md`, `frontends/shell/OWNER-INVALIDATION-PREREGISTRATION.md`, `protocol/skp/CANCEL-STATE-CLOSED-SET-PREREGISTRATION.md`
- **Declared limits:** KNOWN-LIMITATIONS 5, 6, 8, 12, 16, 21, 28, 30
- **Ceilings:**
  - `TICKET_TTL`, `MAX_PENDING_TICKETS`, `TERMINAL_ENTRY_MAX_AGE`, `SESSION_END_EVENT_QUEUE_BOUND` (`kernel/src/skp.rs`)
  - `MAX_VIEWER_ASSETS`, `MAX_VIEWER_ASSET_BYTES` (`kernel/src/publish/viewer_assets.rs`) · `PUBLISH_WRITE_CHUNK_BYTES` (`kernel/src/publish/mod.rs`) · the reader's ceilings, `spatial_kernel::publish::ceilings::reader_ceilings` (`kernel/src/publish/ceilings.rs`)
  - `MAX_GRANT_LIFETIME`, `MAX_GRANTS` (`kernel/src/permission/grant.rs`) · `MAX_AUDIT_LOG_BYTES`, `MAX_AUDIT_LOG_GENERATIONS` (`kernel/src/permission/audit/log.rs`)
  - the composed per-stream and per-dataset figures: this README's section *Declared composed ceilings (ADR-010 rule 6)*
```

36 lines.

## 3. (c) The kernel README's body update

Nine edits, C1a, C1b and C2 to C8, in file order. Apply each by replacing its anchor, which occurs exactly once in `kernel/README.md` at af40bbf, with its new text. Every anchor is a whole-line span; the new text replaces those lines and nothing else.

Reading of the brief's four changes: the watcher, the session-end event and the close-race fixes are C4 and C7. B-1 is read as wave-2 B-1, the bind-admission type rules (`engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md`; `skp.filter_type_not_admitted`), and Brief B stage B1's kernel half (the live projection on `viewport_query`), which also postdates 2026-09-14, is covered in the same paragraph of C7 and in C5.

Statements left unedited were checked against the tree where a symbol, constant, file or test could be looked up. Not re-derived: the data plane's release ordering in the cancel-path paragraph, the manifest's ResourceRef contents, and the figures quoted from `kernel/RESULTS.md`. Considered and left: `StreamParams` as the operation's SKP-facing surface (in *Running it*), because the data plane is part of SKP (ADR-004).

### C1a — the scope sentence (+1 line)

Why: the crate orchestrates a streamed query, the SKP v0 host (`kernel/src/skp.rs`) and publishing (`kernel/src/publish/`), and the body's own *What is deliberately absent* section says two operations.

Anchor:

```
This slice implements **orchestration for exactly one operation** and deliberately implements none of
the rest.
```

New text:

```
This slice implements **orchestration** — of a streamed query, of the SKP v0 control plane in front
of it, and of publishing a bundle — and of the rest only a name → dataset map and a subset of
`docs/09`'s permission model, both described below.
```

### C1b — the only-place sentence (+1 line)

Why: `frontends/shell/src-tauri/Cargo.toml` depends on both `spatial-engine` and `spatial-data-plane`; the one product `impl SourceFactory` over engine streams is `kernel/src/lib.rs`'s `EngineSourceFactory`.

Anchor:

```
It is the only place that knows both `engine/` and `protocol/data-plane`. Keeping that knowledge here
```

New text:

```
It is the only crate that turns an engine stream into a data-plane source: `EngineSourceFactory` is
the one `SourceFactory` over engine streams. Keeping that knowledge here
```

### C2 — `Catalog` (+2 lines)

Why: `Catalog`'s doc in `kernel/src/lib.rs` (opened and closed at runtime through SKP); `SkpHost::open_dataset` mints a `DatasetHandle` and uses it as the catalog name.

Anchor:

```
- **`Catalog`** — datasets opened at startup and addressable by **name**. Never by path: a
  client-supplied filesystem path on a listening socket is an arbitrary-file-read primitive
  (`docs/09`). Opening at startup also means the CRS admission decision (ADR-015) happens in front of
  an operator, not on a consumer's first request.
```

New text:

```
- **`Catalog`** — datasets opened at startup (`slice-host --data`) or at runtime through SKP's
  `open_dataset`/`close_dataset` (`SkpHost`), and afterwards addressable by **name**. Never by path:
  a client-supplied filesystem path on a listening socket is an arbitrary-file-read primitive
  (`docs/09`). Under SKP the name is a `DatasetHandle` the host mints per open, never caller text.
  Opening before any query also means the CRS admission decision (ADR-015) happens at open, in front
  of an operator, not on a consumer's first request.
```

### C3 — `EngineSourceFactory` (+3 lines)

Why: `AdmissionMode` and `EngineSourceFactory::ticket_only` in `kernel/src/lib.rs`; `slice-host` builds the factory with `with_connection_reports` (`kernel/src/main.rs`).

Anchor:

```
- **`EngineSourceFactory`** — turns one operation request into one engine stream. That is the whole
  composition.
```

New text:

```
- **`EngineSourceFactory`** — turns one operation request into one engine stream. That is the whole
  engine-to-data-plane composition. A process installs one of two admission paths, never both: raw
  `StreamParams` in the START frame (`slice-host`), or a single-use ticket minted by
  `SkpHost::viewport_query` and redeemed once (`EngineSourceFactory::ticket_only`, ADR-019), which
  `frontends/shell` installs.
```

### C4 — `SkpHost` added to *What is here* (+3 lines)

Why: `SkpHost` (`kernel/src/skp.rs`) is not listed; it carries the watcher, the generations and the session-end event that C7 describes.

Anchor:

```
- **`slice-host`** — the binary that runs it end to end.
```

New text:

```
- **`SkpHost`** (`src/skp.rs`) — the five SKP v0 commands (`protocol/skp/SKP-V0.md` §1) over the
  catalog. It mints `viewport_query` tickets, keeps one dataset-session generation per open, and
  arms the advisory source watcher at open; see the dataset-sessions section below.
- **`slice-host`** — the binary that runs it end to end.
```

### C5 — the composed table and the live projected stream (+6 lines; held on question 1 in item 6)

Why: `build_viewport_query` (`kernel/src/skp.rs`) sends a `columns` request to `Dataset::stream_projected_with_cancel`, and `engine/src/stream.rs` declares that stream's producer-resident bound separately, in the docs of `MAX_QUEUED_BATCHES` and `MAX_ATTRIBUTE_RETENTION_FACTOR`. The table composes only `(MAX_QUEUED_BATCHES + 1) × MAX_BATCH_BYTES`.

Anchor:

```
figure therefore describes the batch shape it was taken under and may not be carried across a
sizing-policy change.
```

New text:

```
figure therefore describes the batch shape it was taken under and may not be carried across a
sizing-policy change.

**The `engine` row is the bound of a stream that carries no projected attributes.** A live
projected stream (`viewport_query` with `columns`, ADR-023) holds attribute buffers that
`engine/src/stream.rs` bounds separately, in the docs of `MAX_QUEUED_BATCHES` and
`MAX_ATTRIBUTE_RETENTION_FACTOR`. The rows above do not compose that bound, and no figure here
claims to cover it.
```

### C6 — whose `MAX_CONCURRENT_STREAMS` (0 lines)

Why: `MAX_CONCURRENT_STREAMS` is declared in `protocol/data-plane/src/server.rs`; no `kernel/` file declares it.

Anchor:

```
**The engine's stream ceiling and this crate's `MAX_CONCURRENT_STREAMS` are both 4, and this file is
```

New text:

```
**The engine's stream ceiling and `protocol/data-plane`'s `MAX_CONCURRENT_STREAMS` are both 4, and this file is
```

### C7 — the dataset-sessions section, before *Publishing* (+46 lines)

Why, by pointer: `GenerationRegistry`, `SessionInvalidator`, `session_end_channel`, `SkpHost::{open_dataset, viewport_query, close_dataset, describe}` and `StreamRegistry`'s `tickets` invariant (`kernel/src/skp.rs`); `EngineSource` and `EngineSourceFactory::create_from_raw_params` (`kernel/src/lib.rs`); `engine/SOURCE-WATCHER-PREREGISTRATION.md` §2b; `kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md` §1 and §2c-§2d; `kernel/TICKET-DROP-UNDER-LOCK-PREREGISTRATION.md`; `kernel/CLOSE-DATASET-UNKNOWN-KEEPS-OPENRECORD-PREREGISTRATION.md`; `build_viewport_query`, `projection_error_of` and `filter_error_of` (`kernel/src/skp.rs`); `engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md` §1; the shell's `PlatformWatch` construction in `frontends/shell/src-tauri/src/lib.rs`'s `run`.

Anchor:

```
## Publishing, and the trigger this file named in advance
```

New text:

```
## Dataset sessions: generations, the source watcher, the session-end event

`SkpHost` keeps one **dataset-session generation** per successful `open_dataset`, in
`GenerationRegistry`, paired with the `SessionRef` that `open_dataset` mints and returns (ADR-035).
A generation is a counter in this process's memory: never persisted, never published, never on the
wire. Every ticket `viewport_query` hands out is attributed to the live generation it was minted
under, or is cancelled and refused. `slice-host`'s raw path has no `SkpHost` and no generations: a
post-check finding there still ends its stream with its typed code, and ends nothing else.

**A generation ends in one place, `SessionInvalidator::end_generation`, whichever route reaches
it:** the engine's descriptor pre-check refusing a `viewport_query`, a stream's post-check read at
its terminal (or, best-effort, on its drop), or the source watcher's signal. The reason is
`ObservedChange` or `CoverageLost`, and the first one recorded stands. The order is fixed: the end
is recorded; then, once per ended generation, one `DatasetSessionEnded` is offered to a bounded
channel (`session_end_channel`, `SESSION_END_EVENT_QUEUE_BOUND`) that the shell drains into the
`dataset_session_ended` event; then the generation's tickets are cancelled through
`StreamRegistry::cancel`, the path a data-plane CANCEL reaches. The event is advisory: a full queue
loses it and never blocks the end. The refusal is the authority: until the dataset is closed, every
later `viewport_query` on it refuses with the end's own code (`engine.source_changed` or
`engine.source_coverage_lost`), and so does the redemption of one of its tickets while the
dead-ticket record lasts. An ended dataset stays in the catalog: `describe` reports `session_end`,
and `cancel` and `close_dataset` still answer. No ticket state is dropped while `StreamRegistry`'s
lock is held, because dropping a pending ticket's source can itself end a generation and cancel
through that registry.

**The source watcher** is armed by `open_dataset`, through the `SourceWatchArm` the host was built
with, before the engine reads the file's descriptor; the shell builds the host with
`spatial_engine::PlatformWatch`, which watches on Windows only. A signal before admission refuses the
open with its own code; a signal after it ends the generation. When no watch can be armed the open
proceeds checks-only, with the reason in `describe`'s `coverage`. `coverage` is fixed at admission,
and a watch is never re-armed: a reopen is a new open, with a new handle and a new generation.

**`close_dataset`** drops the dataset's watch first, on every outcome after the version check, and
then refuses a name the catalog does not hold. Otherwise it marks the name closing, cancels every
ticket minted for it, forgets its generation and every record of it, and removes the catalog entry
last. The close takes effect at the closing mark: a racing `viewport_query` answers as it would
wholly before or wholly after the close, no ticket minted after the mark stays redeemable, and an
end that reaches the registry after the close writes no mark and emits nothing.

**`viewport_query`'s projection and filter refusals are synchronous and typed, before the stream's
connection lease and before any ticket.** A projection (`columns`, ADR-023) is admitted before a
filter (ADR-021), and each refusal carries its own `skp.projection_*` or `skp.filter_*` code
(`protocol/skp/SKP-V0.md` §7.5, §9.5 and §8). Bind admission refuses an implicit conversion outside
its admitted class as `skp.filter_type_not_admitted`
(`engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md` §2).

## Publishing, and the trigger this file named in advance
```

### C8 — the publish exposure bullet (+2 lines; held on question 2 in item 6)

Why: the shell's `binding_publish_prepare` and `binding_publish_execute` commands (`frontends/shell/src-tauri/src/commands.rs`, seam in `src/publish.rs`) drive one gated operation through `permission::boundary::execute`, in-process, as `kernel/src/bin/publish-bundle.rs` does; KNOWN-LIMITATIONS item 5 describes that publish in the shipped app. No SKP message for publish exists.

Anchor:

```
- **Nothing is exposed.** No SKP message is defined, nothing in `protocol/` is touched, and no
  served surface reaches the operation. Whether ADR-017's "developer/test tooling until then" has
  lapsed now that the machinery exists is a question flagged for the custodian, not one this cut
  answers.
```

New text:

```
- **No SKP message reaches it.** No SKP message is defined and nothing in `protocol/` is touched.
  Two product callers reach the operation, both through `permission/boundary.rs`: this crate's
  `publish-bundle` binary, and the shell's binding-local `binding_publish_*` commands
  (`frontends/shell/src-tauri/src/publish.rs`). Whether ADR-017's "developer/test tooling until
  then" has lapsed now that the machinery exists is a question flagged for the custodian, not one
  this cut answers.
```

The quoted phrase inside C8 is the README's existing text, carried unchanged.

Net: +64 lines in the body (280 → 344 lines), before the index section is appended.

## 4. (d) Placement, and the line references these edits move

**Placement.**
- `engine/README.md`: after its last line (the line ending `places on ADR-003.`), append one empty line, then item 1's block. The engine body is not edited, so no line above the index moves.
- `kernel/README.md`: apply C1a to C8 first, then after the file's last line (the line ending `§22.1).`), append one empty line, then item 2's block. No line above the index moves when it is appended.
- Each file keeps exactly one trailing LF.

**References of the form `kernel/README.md:<line>` in tracked files.** All are in `state/cut-archive/CUT-STATE-2026-09-24-post-tag-arc.md`, and all are moved:

| Citing line | Reference | Effect of item 3 |
|---|---|---|
| line 90 | `kernel/README.md:126-127`, twice | moves: C1a, C1b, C2, C3, C4 and C5 add 16 lines above it; the text now at 126-127 lands at 142-143 |
| line 93 | `kernel\README.md:127` (backslash form) | moves to 143, as above |
| line 94 | `kernel/README.md:126-127` | moves to 142-143, as above |
| line 104 | `kernel/README.md:86` | moves to 102 (same 16 lines) |

These are dated records of the file as it stood on 2026-09-14 (line 90's cite already describes a figure the file has since corrected). C6 (line 81) is line-neutral, and C7 and C8 come after line 127, so neither moves these four. The file only grows, so a check that compares a cited line with the file's length (`scripts/plan/verify-cites.mjs`, `lineCount`) cannot fail on them.

**References of the form `engine/README.md:<line>`, none moved** (item 3 does not edit `engine/README.md`, and item 1 is appended after line 493):
- `state/consults/gates/2026-09-30-cancel-before-execute-gate2-reviewer.md` line 86: `engine/README.md:46`
- `state/consults/gates/2026-09-30-cancel-before-execute-gate1-reviewer.md` line 85: `engine/README.md:46`
- `state/consults/gates/2026-09-30-cancel-before-execute-gate1-architect.md` line 53: `engine/README.md:43-47`
- `state/consults/gates/2026-09-27-b1-engine-kernel-half-gate2-architect.md` line 58: `engine/README.md:414-422`
- `state/cut-archive/CUT-STATE-2026-09-24-post-tag-arc.md` line 90 (`engine/README.md:263-264`, twice), line 93 (`engine\README.md:263`; `engine\README.md:316`, twice), line 94 (`engine/README.md:316`, twice; `engine/README.md:263-264`)

Searched: every non-ignored file in the repository, in forward- and backslash forms, plus `.claude/agents/` and `.github/` explicitly; no relative `README.md:<line>` inside `engine/` or `kernel/` points at either README.

## 5. (e) Files read for this task

Read (whole file unless a range is given):
1. `state/directives/LEAD-DATA-PILOT-2026-10-03.md`
2. `LEAD-DATA-PILOT-SETUP-PREREGISTRATION.md`
3. `engine/README.md`
4. `kernel/README.md`
5. `engine/src/lib.rs`
6. `kernel/src/lib.rs`
7. `kernel/src/skp.rs`, lines 1-170 and 400-2326
8. `kernel/src/main.rs`
9. `kernel/src/params.rs`, lines 1-60
10. `engine/Cargo.toml`
11. `kernel/Cargo.toml`
12. `engine/src/stream.rs`, lines 40-119 and 2300-2449
13. `engine/src/watch.rs`, lines 1-75
14. `engine/src/index.rs`, lines 5-24
15. `kernel/src/publish/ceilings.rs`, lines 1-60
16. `kernel/src/publish/viewer_assets.rs`, lines 1-40
17. `kernel/src/publish/mod.rs`, lines 128-147
18. `frontends/shell/src-tauri/src/publish.rs`, lines 1-48
19. `KNOWN-LIMITATIONS.md`
20. `docs/adr/ADR-035-dataset-session-ended-control-plane-event.md`, lines 1-40
21. `engine/SOURCE-WATCHER-PREREGISTRATION.md`, lines 1-190
22. `kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md`, lines 1-185
23. `engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md`, lines 1-60 and 430-448
24. `engine/WATCHER-FIRST-READ-PREREGISTRATION.md`
25. `kernel/TICKET-DROP-UNDER-LOCK-PREREGISTRATION.md`, lines 1-12
26. `state/cut-archive/CUT-STATE-2026-09-24-post-tag-arc.md`, lines 86-105
27. `engine/tests/lod_tier_preflight.rs`, lines 136-147
28. `engine/tests/lod_tier_cancellation.rs`, lines 126-137

Searched with Grep or Glob (matching lines only):
- the repository: `kernel/README.md:<line>` and `engine/README.md:<line>` in both slash forms, `kernel/README`, `B-1`, `MAX_ATTRIBUTE_RETENTION_FACTOR`, `MAX_CONCURRENT_STREAMS`, `impl SourceFactory for`, `*PREREGISTRATION*.md` and `KNOWN-LIMITATIONS*` paths; `.claude/agents/` and `.github/` for README cites
- `engine/src/` and `kernel/src/`: ADR and preregistration citations, `pub const`, `pub fn`, `pub mod`/`pub use`, `mod tests`; `engine/src/{pin,cancel,dataset,lod}.rs`, `engine/src/stream.rs` (`est_bytes`), `kernel/src/bin/publish-bundle.rs`, `kernel/src/permission/{mod,audit/mod,audit/reader}.rs`
- `engine/tests/`: test names in `slice`, `identity`, `admission_format_semantics`, `batch_sizing`, `live_projection`, `predicate_admission`, `filter_type_admission`, `publish_stream`, `cancel_execute_window`, `connection_reuse`, `session_identity`, `source_watch_adapter`, `planner_seam`, `row_group_seam`, `spatial_index`, `lod_tier_builder`, `lod_tier_preflight`, `lod_tier_cancellation`
- `kernel/tests/`: test names in `skp_admission`, `typed_terminal_codes`, `session_generation`, `session_end_event`, `source_watch_ordering`, `watcher_first_read_windows`, `catalog_replace`, `skp_projection`, `end_to_end`, `publish`, `publish_cli`, `permission_boundary`, `verify_bundle`, `no_generation_in_persisted_artifacts`, `wire_bytes_invariant`, `concurrency_in_situ`
- `docs/adr/*.md` Status lines; `protocol/skp/SKP-V0.md` headings; `protocol/skp/src/v0/error.rs` and `mod.rs`; `protocol/data-plane/src/server.rs` constants; `protocol/skp/CANCEL-STATE-CLOSED-SET-PREREGISTRATION.md`
- `kernel/*PREREGISTRATION*.md` and `engine/*PREREGISTRATION*.md` titles and Scope lines; `PLAN.yaml` (the B-1 node titles)
- `frontends/shell/src-tauri/Cargo.toml` and `src/*.rs` (crate imports, `binding_publish_*`); `frontends/shell/src/canvas/tileGridConstants.ts`
- `renderer/src/lib.rs` (pub items); `renderer/bundle-viewer/ceilings.json` and `frontends/canvas-probe/package.json` (existence)
- `scripts/plan/verify-cites.mjs` (its line-range check)

Not read: `docs/PREREGISTRATION-TEMPLATE.md` and `.claude/agents/architect.md`, because this task drafts no preregistration.

## 6. (f) Questions for the custodian

1. Guarantee, blocks C5 only: C5 narrows the README's composed per-stream ceilings to streams that carry no projected attributes rather than recomposing them for the live projected stream, whose bound `engine/src/stream.rs` declares separately; a recomposed figure is a declared-ceiling decision — take C5, hold it, or replace it with a recomposition?
2. Security posture, blocks C8 only: C8 restates publish's exposure in the README (two product callers, `publish-bundle` and the shell's `binding_publish_*` commands, both through the permission boundary), next to ADR-017's exposure condition and ADR-024 (Proposed) — take C8 as written, or hold it for the human?

Noted, not questions (outside this piece's Scope):
- `engine/README.md`'s body calls ADR-013, ADR-015 and ADR-016 Proposed in several places, while their Status lines read Accepted.
- `kernel/src/lib.rs`'s module doc carries the same scope, only-place and exposure statements that C1a, C1b and C8 correct in the README.
