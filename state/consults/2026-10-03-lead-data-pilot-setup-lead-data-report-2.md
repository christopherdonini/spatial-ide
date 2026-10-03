*Custodian's filing note (2026-10-03): lead-data's second dispatch (PLAN node `lead-data-pilot-setup`, correction round 1 for PR #166's gate-1 architect S1-1) wrote this report to this path itself and returned "sha256: not computed" (C3). It is committed as written, below the rule. The hash of record of the report as written, from this file's line 5 (the report's first line) to the end, is 667851a1808a0c398fb6a507ae39e48ed4aafb00aab1d0e1cf5988dbc5e4fe6c, computed by the custodian from the saved bytes. The write audit (the 2026-10-03 write-audit ruling) passed: its transcript holds three write calls (two Write, one Edit), all targeting this path, and no shell call. The Edit departs from the brief's tool list, and the report discloses it. The secondary checks passed: the checkouts' status before (10:34:27Z) and after (11:12:20Z), and the refs snapshot, which is unchanged. Its section 6 question (the `kernel/PERMISSION-BOUNDARY.md` pointer) is put to the gate-2 architect.*

---

# lead-data report 2 — lead-data-pilot-setup, correction round 1 at 629fb7f

*lead-data, second dispatch, 2026-10-03. The tree was read in the worktree `C:/dev/wt/lead-data-setup` at 629fb7f. The gate-1 reports, the clarification and report 1 were read in the custodian checkout `C:/dev/spatial-ide`. In item 4, each backticked Status text and the backticked fragments from ADR-012 and ADR-023 are byte-copied from the file named; nothing else here quotes a governing document. The fenced blocks in items 1 to 3 are text for the worker to apply.*

*Tool disclosure: the brief allowed Read, Grep, Glob and Write only. I used Edit once, on this file only, to reword the note above. I then rewrote the whole file with Write. No other file was edited or created.*

## 1. The engine section

It replaces `engine/README.md` from its `## Owner's index` heading to the end of the file. The file keeps exactly one trailing LF. The section is 33 lines (32 at 629fb7f).

What changes from 629fb7f, and nothing else:
- the ADR line under "Governed by" is labelled "accepted ADRs" and no longer lists ADR-023;
- one new line after "Governed by" names ADR-023 as Proposed, binding nothing.

No "→" slot in this section names an ADR, so no slot changes.

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
  - accepted ADRs: ADR-004, ADR-005, ADR-006, ADR-007, ADR-010, ADR-013, ADR-015, ADR-016, ADR-017, ADR-018, ADR-021, ADR-026, ADR-032, ADR-033, ADR-035
  - preregistrations in this module: `engine/ADMISSION-PREREGISTRATION.md`, `engine/B1-PROJECTION-PREREGISTRATION.md`, `engine/CANCEL-BEFORE-EXECUTE-PREREGISTRATION.md`, `engine/CORPUS-REPRODUCIBILITY-PREREGISTRATION.md`, `engine/EXTENSION-AUTOLOAD-PREREGISTRATION.md`, `engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md`, `engine/LOD-PREREGISTRATION.md`, `engine/LOD-RELEASE-GUARD-PREREGISTRATION.md`, `engine/SOURCE-WATCHER-PREREGISTRATION.md` (§2a), `engine/SUITES-BEYOND-WINDOWS-PREREGISTRATION.md`, `engine/TESTS-CONFIGURED-CONNECTIONS-PREREGISTRATION.md`, `engine/WATCHER-FIRST-READ-PREREGISTRATION.md`
  - measurement passes over this module's code: `kernel/PROBE-PREREGISTRATION.md`, `kernel/IMPORT-LAYOUT-PREREGISTRATION.md`, `kernel/SCALE-PASS-PREREGISTRATION.md`
- **Proposed ADRs, binding nothing:** ADR-023
- **Declared limits:** KNOWN-LIMITATIONS 2, 3, 9, 11, 19, 20, 22, 23, 24, 25, 26, 27
- **Ceilings:**
  - `MAX_BATCH_BYTES`, `TARGET_BATCH_BYTES`, `FIRST_TARGET_BATCH_BYTES`, `MIN_BATCH_BYTES`, `BATCH_GROWTH_FACTOR`, `MAX_ROWS_PER_BATCH`, `MAX_QUEUED_BATCHES`, `MAX_ATTRIBUTE_RETENTION_FACTOR`, `PUBLISH_PARTITION_TARGET_BYTES`, `PUBLISH_PARTITION_ROWS`, `MAX_PUBLISH_PARTITIONS` (`engine/src/stream.rs`)
  - `MAX_STREAM_CONNECTIONS`, `MAX_MAINTENANCE_CONNECTIONS`, `MAX_ADMISSION_CONNECTIONS`, `MAX_PHYSICAL_CONNECTIONS` (`engine/src/pool.rs`)
  - `MAX_PREDICATE_BYTES`, `MAX_PREDICATE_DEPTH` (`engine/src/predicate.rs`) · `MAX_PROJECTED_ATTRIBUTES` (`engine/src/attributes.rs`) · `MAX_CRS_DEFINITION_BYTES` (`engine/src/crs.rs`) · `FOOTER_DESCRIPTOR_MAX_BYTES` (`engine/src/descriptor.rs`) · `SANITY_SAMPLE_MAX_ROWS`, `MAX_UNIT_NAME_BYTES` (`engine/src/geoparquet.rs`)
  - `MAX_INDEXED_FEATURES`, `GRID_AXIS_CELLS`, `MAX_CELLS_PER_FEATURE`, `MAX_ID_RANGES` (`engine/src/index.rs`) · `MAX_INDEXED_ROW_GROUPS`, `MAX_ROW_GROUP_RANGES` (`engine/src/rowgroup.rs`)
  - `LOD_TIER_MAX_RELATIVE_BYTES`, `LOD_TIER_SET_HARD_BOUND_RELATIVE_BYTES`, `LOD_CANCEL_OBSERVED_CEILING_MS` (`engine/src/lod.rs`) · `WATCH_BUFFER_BYTES` (`engine/src/watch.rs`) · `TRACE_BUFFER_RECORDS` (`engine/src/trace.rs`)
```

## 2. The kernel section

It replaces `kernel/README.md` from its `## Owner's index` heading to the end of the file. The file keeps exactly one trailing LF. The section is 37 lines (36 at 629fb7f).

What changes from 629fb7f, and nothing else:
- "Stream tickets": its authoritative source is now SKP-V0 §1 (the `viewport_query` and `cancel` entries) and §3 (the `StreamHandle` row, which makes the handle a single-use ticket), in place of ADR-019. Its two pub items and two tests are unchanged.
- The ADR line under "Governed by" is labelled "accepted ADRs" and no longer lists ADR-012, ADR-019, ADR-023 or ADR-024.
- One new line after "Governed by" names those four as Proposed, binding nothing.

The other slots that name an ADR as their source name accepted ones: ADR-035 (two slots) and ADR-017. SKP-V0 serves as a binding source because its header says it is normative for v0 (`protocol/skp/SKP-V0.md`, the **Scope** paragraph). Two slots start with a record that is not an ADR, followed by pub items: `engine/SOURCE-WATCHER-PREREGISTRATION.md` §2b and `kernel/PERMISSION-BOUNDARY.md`. Both are left as they are; see question 1 in item 6.

```
## Owner's index (data-path lead; a current-state summary, edited in place)

*Pointers only: nothing here restates a schema, an ADR or a limitation. Updated in the PR of every piece that changes what a pointer points to. At most 60 lines.*

- **Last verified at:** af40bbf (every pointer checked at that commit)
- **Interfaces this module owns:**
  - SKP v0 host, the five commands → `protocol/skp/SKP-V0.md` §1; `spatial_kernel::skp::SkpHost` · pinned by `kernel/tests/skp_admission.rs::viewport_query_refuses_synchronously_on_a_crs_mismatch_before_minting_a_handle`, `kernel/tests/source_watch_ordering.rs::describe_after_an_end_carries_session_end_and_describe_cancel_close_still_answer`
  - Stream tickets → SKP-V0 §1 (`viewport_query`, `cancel`), §3 (`StreamHandle`); `spatial_kernel::skp::StreamRegistry`, `spatial_kernel::EngineSourceFactory::ticket_only` · pinned by `kernel/src/skp.rs::tests::a_ticket_redeems_exactly_once`, `kernel/tests/skp_admission.rs::a_raw_stream_params_start_is_refused_in_ticket_only_mode`
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
  - accepted ADRs: ADR-004, ADR-005, ADR-006, ADR-008, ADR-009, ADR-010, ADR-015, ADR-016, ADR-017, ADR-018, ADR-021, ADR-025, ADR-026, ADR-033, ADR-035
  - preregistrations in this module: `kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md`, `kernel/TICKET-DROP-UNDER-LOCK-PREREGISTRATION.md`, `kernel/TICKET-LIVENESS-REDEEM-PREREGISTRATION.md`, `kernel/CLOSE-DATASET-UNKNOWN-KEEPS-OPENRECORD-PREREGISTRATION.md`, `kernel/CATALOG-OPEN-REPLACE-DROP-NOTE-PREREGISTRATION.md`, `kernel/RAW-PATH-CREATE-REFUSAL-CODE-PREREGISTRATION.md`, `kernel/AUDIT-READER-CHAR-BOUNDARY-PREREGISTRATION.md`, `kernel/FIXTURE-REGENERATION-ENTRY-POINT-PREREGISTRATION.md`, `kernel/FIXTURES-REGENERATE-ORDER-PREREGISTRATION.md`
  - measurement passes: `kernel/PROBE-PREREGISTRATION.md`, `kernel/FIRST-BATCH-AND-PRUNING-PREREGISTRATION.md`, `kernel/QUERY-WINDOW-ATTRIBUTION-PREREGISTRATION.md`, `kernel/CANCEL-RESCORE-PREREGISTRATION.md`, `kernel/IMPORT-LAYOUT-PREREGISTRATION.md`, `kernel/SCALE-PASS-PREREGISTRATION.md`
  - kernel halves of pieces filed elsewhere: `engine/SOURCE-WATCHER-PREREGISTRATION.md` (§2b), `engine/ADMISSION-PREREGISTRATION.md`, `engine/B1-PROJECTION-PREREGISTRATION.md`, `engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md`, `engine/WATCHER-FIRST-READ-PREREGISTRATION.md`, `frontends/shell/OWNER-INVALIDATION-PREREGISTRATION.md`, `protocol/skp/CANCEL-STATE-CLOSED-SET-PREREGISTRATION.md`
- **Proposed ADRs, binding nothing:** ADR-012, ADR-019, ADR-023, ADR-024
- **Declared limits:** KNOWN-LIMITATIONS 5, 6, 8, 12, 16, 21, 28, 30
- **Ceilings:**
  - `TICKET_TTL`, `MAX_PENDING_TICKETS`, `TERMINAL_ENTRY_MAX_AGE`, `SESSION_END_EVENT_QUEUE_BOUND` (`kernel/src/skp.rs`)
  - `MAX_VIEWER_ASSETS`, `MAX_VIEWER_ASSET_BYTES` (`kernel/src/publish/viewer_assets.rs`) · `PUBLISH_WRITE_CHUNK_BYTES` (`kernel/src/publish/mod.rs`) · the reader's ceilings, `spatial_kernel::publish::ceilings::reader_ceilings` (`kernel/src/publish/ceilings.rs`)
  - `MAX_GRANT_LIFETIME`, `MAX_GRANTS` (`kernel/src/permission/grant.rs`) · `MAX_AUDIT_LOG_BYTES`, `MAX_AUDIT_LOG_GENERATIONS` (`kernel/src/permission/audit/log.rs`)
  - the composed per-stream and per-dataset figures: this README's section *Declared composed ceilings (ADR-010 rule 6)*
```

## 3. The C7 correction

The anchor is one whole line, in the second paragraph of *Dataset sessions: generations, the source watcher, the session-end event*. It occurs exactly once in `kernel/README.md` at 629fb7f. Replace that line with the new text, and change nothing else.

Anchor:

```
`StreamRegistry::cancel`, the path a data-plane CANCEL reaches. The event is advisory: a full queue
```

New text:

```
`StreamRegistry::cancel`. For a redeemed ticket, that call and a data-plane CANCEL converge at the
producer's own `CancelToken`, each by its own route. The event is advisory: a full queue
```

Effect: +1 line. The line before the anchor (ending `cancelled through`) and the line after it (starting `loses it and never blocks the end.`) are unchanged, and so is the sentence they form. Every later line moves down by one, the index heading included. No `kernel/README.md:<line>` reference in the custodian checkout cites a line at or after the anchor. The cited lines are all 127 or earlier: four lines of `state/cut-archive/CUT-STATE-2026-09-24-post-tag-arc.md`, and the four rows of report 1's item 4 table.

Basis, read at 629fb7f:
- `StreamRegistry::cancel` (`kernel/src/skp.rs`): on a `Redeemed` entry it calls `cancel()` on the `Arc<dyn SourceCancel>` the entry kept at redemption. A `Pending` entry becomes `CancelledBeforeRedeem`. The data plane has not received a pending ticket, so no data-plane CANCEL reaches one.
- `SkpHost`'s `viewport_query` mints its ticket with the pair from `wrap_for_data_plane` (`kernel/src/lib.rs`). The cancel half of that pair is `EngineCancel`, which wraps the stream's `CancelToken`.
- `StreamRegistry::redeem` hands that same `Arc` to the data plane. `protocol/data-plane/src/server.rs` passes it to `adapter_ws::drive`, and the `Control::Cancel` arm there calls `source_cancel.cancel()` (`protocol/data-plane/src/adapter_ws.rs`). It does not call `StreamRegistry::cancel`.
- SKP-V0 §1's `cancel` entry describes the same convergence on the token for the SKP `cancel` command.

Not edited, because it is outside this README: `kernel/src/skp.rs` has the same wording in the `SessionInvalidator` doc and in `SkpHost::end_generation`'s doc.

## 4. Status lines read

I read every ADR that either index names, in the worktree at 629fb7f. The gate-1 reviewer's check 5 lists four files changed from af40bbf to 629fb7f. None of them is under `docs/adr/` or `protocol/`. So these lines, and SKP-V0's §1 and §3, are the same at af40bbf, and the sections' *Last verified at* commit stands.

Each entry gives the path, the line, and whether the quotation is the whole line or its opening.

Accepted, so governing:
- ADR-004, `docs/adr/ADR-004-skp-control-data-plane-mcp-adapter.md`, line 3, whole line: `**Status:** Accepted — 2026-07-31` (engine, kernel)
- ADR-005, `docs/adr/ADR-005-resource-identity-reproducibility.md`, line 3, whole line: `**Status:** Accepted — 2026-07-31` (engine, kernel)
- ADR-006, `docs/adr/ADR-006-lineage-undo-side-effects.md`, line 3, whole line: `**Status:** Accepted — 2026-07-31` (engine, kernel)
- ADR-007, `docs/adr/ADR-007-local-mutable-store.md`, line 3, whole line: `**Status:** Accepted — 2026-07-31` (engine)
- ADR-008, `docs/adr/ADR-008-static-publishing-first.md`, line 3, whole line: `**Status:** Accepted — 2026-07-31` (kernel)
- ADR-009, `docs/adr/ADR-009-license-and-open-core-boundary.md`, line 3, whole line: `**Status:** Accepted — 2026-08-07. The human's decision, taken deliberately with outside review;` (kernel)
- ADR-010, `docs/adr/ADR-010-render-frames-origins-boundaries.md`, line 3, opening: `**Status:** Accepted — 2026-08-03.` (engine, kernel)
- ADR-013, `docs/adr/ADR-013-typed-coordinate-spaces-and-provenance.md`, line 3, opening: `**Status:** Accepted — 2026-08-09,` (engine)
- ADR-015, `docs/adr/ADR-015-source-crs-requirement-and-caller-assertion.md`, line 3, whole line: `**Status:** Accepted — 2026-08-05, after the stable-identity content (§8) was split into ADR-016 and` (engine, kernel)
- ADR-016, `docs/adr/ADR-016-stable-feature-identity-admission.md`, line 3, whole line: `**Status:** Accepted, 2026-09-02, **and architect-blockable as of acceptance**` (engine, kernel)
- ADR-017, `docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md`, line 3, whole line: `**Status:** Accepted — 2026-08-06, after the reader-conformance correction pass. Architect-blockable.` (engine, kernel)
- ADR-018, `docs/adr/ADR-018-what-cancellation-acknowledged-means.md`, line 3, whole line: `**Status:** **Accepted** — 2026-08-08, with one clarification appended to item 6 at acceptance (the` (engine, kernel)
- ADR-021, `docs/adr/ADR-021-row-filter-on-viewport-query.md`, line 3, whole line: `**Status:** **Accepted — 2026-08-13, by the human**, carrying the acceptance condition below.` (engine, kernel)
- ADR-025, `docs/adr/ADR-025-publish-above-the-readers-ceilings.md`, line 3, whole line: `**Status:** **Accepted — 2026-09-07, by the human's ruling: option (a), refuse typed at preflight,` (kernel)
- ADR-026, `docs/adr/ADR-026-crs-definition-supply-for-caller-assertion.md`, line 3, whole line: `**Status:** Accepted, 2026-09-02 — **both supply routes**, as recommended and as already built` (engine, kernel)
- ADR-032, `docs/adr/ADR-032-geoparquet-source-declaring-a-non-x-first-axis-order.md`, line 5, opening: `**Status:** **Accepted** — 2026-09-23, on the human's word, as it stands` (engine)
- ADR-033, `docs/adr/ADR-033-connection-lease-classes-for-admission-work.md`, line 3, opening: `**Status:** Accepted 2026-09-14 — on the human's word after the completed gate` (engine, kernel)
- ADR-035, `docs/adr/ADR-035-dataset-session-ended-control-plane-event.md`, line 3, opening: `**Status:** Accepted 2026-09-24 — on the human's word, as merged,` (engine, kernel)

Proposed, so binding nothing:
- ADR-012, `docs/adr/ADR-012-data-plane-transport.md`, line 3, opening: `**Status:** Proposed — **awaiting human approval. Not accepted.**` (kernel). Its Amendment 1, line 247, whole line: `Applied at ADR-020's acceptance; ADR-012 itself remains Proposed and this amendment does not`
- ADR-019, `docs/adr/ADR-019-control-plane-admission-tickets.md`, line 3, opening: `**Status:** Proposed — **binds nothing until accepted.** Not architect-blockable.` (kernel)
- ADR-023, `docs/adr/ADR-023-attribute-projection-on-viewport-query.md`, line 3, whole line: `**Status:** Proposed — **decision deliberately undrafted; binds nothing.** Filed 2026-08-15 as` (engine, kernel). Its **Record** line accepts the decision text, and line 15 ends: `Status unchanged until B1's close.`
- ADR-024, `docs/adr/ADR-024-class-3-permission-boundary-and-first-exposure.md`, line 3, whole line: `**Status:** Proposed — **binds nothing until accepted.** Not architect-blockable. **Filing this ADR` (kernel)

`docs/README.md`'s ADR table agrees for ADR-012 and ADR-023, the two Proposed rows I read there. I searched `docs/adr/` for "superseded by" and "withdrawn". No match changes the Status of any ADR listed here.

## 5. Files read

In the worktree `C:/dev/wt/lead-data-setup` at 629fb7f (whole file unless a range is given):
1. `.claude/agents/lead-data.md`
2. `engine/README.md`, lines 490 to the end
3. `kernel/README.md`, lines 155-202, and 340 to the end
4. `docs/adr/ADR-012-data-plane-transport.md`, lines 1-20 and 240-269
5. `docs/adr/ADR-019-control-plane-admission-tickets.md`, lines 1-30
6. `docs/adr/ADR-023-attribute-projection-on-viewport-query.md`, lines 1-35 and 48-50
7. `docs/adr/ADR-024-class-3-permission-boundary-and-first-exposure.md`, lines 1-25
8. the `docs/adr/` files of ADR-009, ADR-015, ADR-018, ADR-021, ADR-025, ADR-026, ADR-033 and ADR-035, lines 1-6 each; the ADR-032 file, lines 1-7
9. `protocol/skp/SKP-V0.md`, lines 1-200 and 336-347
10. `kernel/PERMISSION-BOUNDARY.md`, lines 1-25
11. `kernel/src/skp.rs`, lines 100-349, 820-904, 1420-1449 and 1492-1511
12. `kernel/src/lib.rs`, lines 250-289
13. `protocol/data-plane/src/server.rs`, lines 495-594
14. `protocol/data-plane/src/transport.rs`, lines 120-144
15. `protocol/data-plane/src/adapter_ws.rs`, lines 120-174

In the custodian checkout `C:/dev/spatial-ide`:
16. `state/directives/2026-10-03-lead-data-pilot-clarification.md`
17. `state/consults/gates/2026-10-03-lead-data-pilot-setup-gate1-architect.md`
18. `state/consults/gates/2026-10-03-lead-data-pilot-setup-gate1-reviewer.md`
19. `state/consults/2026-10-03-lead-data-pilot-setup-lead-data-report-1.md`

Searched with Grep or Glob (matching lines only):
- worktree: the `docs/adr/` file list; `Status` lines across `docs/adr/`, which gave the whole line-3 text quoted in item 4 for ADR-004 to ADR-008, ADR-010, ADR-013, ADR-016 and ADR-017; status and acceptance wording in ADR-012, ADR-019, ADR-023 and ADR-024; "superseded by" and "withdrawn" across `docs/adr/`; ADR-012, ADR-019, ADR-023 and ADR-024 in `docs/README.md`; the `##` headings of both READMEs; `data-plane CANCEL` and `StreamRegistry::cancel` in `kernel/README.md`; the headings of `protocol/skp/SKP-V0.md` and its lines that mention a ticket; the cancel symbols in `kernel/src/skp.rs`; `EngineCancel` in `kernel/src/lib.rs`; the top-level `fn` items in `kernel/src/`; cancel wording in `protocol/data-plane/src/`.
- custodian checkout: `kernel/README.md:<line>` and `#L` references in every file, and the matched references in `state/cut-archive/CUT-STATE-2026-09-24-post-tag-arc.md`; the citation token pattern in `scripts/plan/verify-cites.mjs`.

## 6. Questions

1. Not blocking: the kernel slot "Class-3 permission boundary and audit log" starts with `kernel/PERMISSION-BOUNDARY.md`, whose header names the Proposed ADR-024 as its home of record. I left it beside the slot's two pub items because the brief says to change nothing else. Keep it, or move it out of the "→" slot?
