# Impact read — geometry-types-beyond-polygons, MP-1 (lead-data, second pilot, piece 4)
Read at: main 2d4fa886

Pointers only, under `state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md` §1 item 1. Nothing below is draft text, a design, a recommendation or an answer to an open item. Every line cite resolves at main 2d4fa886. Where a pointer does not exist, it is marked missing. No quotation appears below; identifiers in backticks are names, not quotations.

The piece: PLAN node `geometry-types-beyond-polygons` (`PLAN.yaml:1370-1386`; status ready, `gate: none`, depends on `b1-engine-kernel-half`, which is done at `PLAN.yaml:617-622`). Governing decision: ADR-034 (`docs/adr/ADR-034-geometry-type-admission-and-geoarrow-encoding-selection.md`), Status at `:3`, Acceptance at `:190-201`, from `state/directives/2026-10-05-adr-034-acceptance.md:6-13` (O1 and O2 ruled for MP-1 by item 5 at `:11`; O3 to O8 open by item 6 at `:12`). Ruling behind it: `DECISIONS-PENDING.md`, block RULED 2026-09-24 — question round 17, item 7 (entry 126), with its two riders; and the block RULED 2026-10-05 — ADR-034 accepted. Session order: `state/directives/2026-09-27-session-order.md:15` (the MultiPolygon paragraph) and `:18` (holds, including B1's shell half). The assessment: `state/consults/2026-09-24-multipolygon-assessment.md`; its own locators are unpinned and taken at a78d621 (`:7`), and several no longer resolve at 2d4fa886 (see "Stale pointers" below).

## 1. Interfaces the piece touches, engine and kernel

### 1a. Admission in `Dataset::open`
- Source: the WKB-encoding gate at `engine/src/dataset.rs:358-363`; the `geometry_types` gate and its refusal text at `engine/src/dataset.rs:364-374` (`EngineError::GeoMetadata`, variant at `engine/src/error.rs:100`, Display at `engine/src/error.rs:337`).
- Declared list as read: `GeoMeta.geometry_types` at `engine/src/geoparquet.rs:352`; its parse at `engine/src/geoparquet.rs:399-408` (an absent key and non-string members both yield an empty list). The `Dataset` keeps `geo` after open (`engine/src/dataset.rs:954-956`, `:980-982`); there is no `geometry_types` accessor on `Dataset` today (missing, by search).
- Wire code: `kernel/src/skp.rs:2090` maps `GeoMetadata` to `geo_metadata` with no fields; the variant-name rule is `protocol/skp/SKP-V0.md:325-327`.
- Pinning test: only the `#[ignore]`d generator `engine/tests/admission_p4_corpus.rs::the_p4_admission_table_runs_against_the_preregistered_corpus_and_writes_admission_results` (`:796-799`), with the #11 and #12 predictions at `:273` and `:284` and prediction P1's literal list at `:1052`. No non-ignored engine test opens a file whose `geometry_types` names anything but Polygon (missing, by search of `engine/` for `MultiPolygon` and `Point` literals).
- Owner's index row: `engine/README.md:501`.

### 1b. Row decode: `PolygonBuilder::push_wkb` and the stream builder's call
- Source: `engine/src/wkb.rs:19-20` (`WKB_POLYGON`), `:27-40` (builder with two offset levels), `:60-117` (`push_wkb`), `:71-75` (the type-3-only refusal and its text), `:78-80` (zero-ring refusal), `:184-197` (`encode_polygon`, the only test encoder).
- Caller: `engine/src/stream.rs:2026` (`pending.builder.push_wkb(wkb)?`), with the null-geometry refusal at `engine/src/stream.rs:2542`; array assembly at `engine/src/stream.rs:2417`.
- Wire code: `kernel/src/skp.rs:2094` (`Wkb` to `wkb`, no fields).
- Pinning tests: `engine/src/wkb.rs::tests::decodes_a_polygon_with_a_hole_and_keeps_the_ring_structure` (`:208`), `::coordinate_bit_patterns_survive_the_decode_exactly` (`:248`, ADR-013 §6 bit identity), `::refusals_are_typed_and_specific` (`:277`, includes a Point row); `engine/tests/slice.rs::streaming_the_whole_file_returns_every_feature_with_bit_identical_coordinates` (`:442`).

### 1c. Encoding constants and validation, `engine/src/geoarrow.rs`
- Source: `EXT_NAME_POLYGON` `:26`; `polygon_storage_type` `:50-53`; `build_polygon_array` `:56-85`; `geometry_field` `:99-115` (writes the extension name at `:101`); `coordinate_values` `:168-185` (returns `None` on any other nesting); `validate_polygon_encoding` `:193-235`.
- Pinning tests: `engine/src/geoarrow.rs::tests::built_array_has_the_geoarrow_polygon_storage_type_and_row_count` (`:262`), `::a_non_polygon_array_fails_the_encoding_check` (`:288`), `::a_file_declared_crs_travels_as_its_own_definition_not_as_a_name` (`:317`); `engine/tests/slice.rs::the_payload_is_variable_width_geoarrow_with_holes` (`:466`, asserts the extension name at `:517-524`).

### 1d. The envelope's `geometry_encoding`
- Source: `engine/src/envelope.rs:209-217` (written from `EXT_NAME_POLYGON`); the geometry field at `:235`; the check at assembly `:304`; `xy_bounds` over `coordinate_values` at `:350-371` (feeds bundle bounds).
- Pinning tests: `engine/src/envelope.rs::tests::every_batch_carries_frame_crs_and_axis_order` (`:459`), `::two_envelopes_built_separately_serialize_to_identical_bytes` (`:497`), `::the_tag_survives_ipc_serialization` (`:528`), `::a_geometry_array_of_the_wrong_shape_cannot_be_assembled_into_a_batch` (`:574`); `engine/tests/slice.rs::every_batch_carries_the_envelope_not_just_the_first` (`:646`). No test asserts the `geometry_encoding` metadata value itself (missing, by search for `geometry_encoding` under `engine/`).
- Owner's index row: `engine/README.md:502`.

### 1e. `describe_dataset`, `GeometryInfo` and SKP-V0 §1's `describe` block
- Source: `kernel/src/skp.rs:1861` (`describe_dataset`), `:1924-1929` (`GeometryInfo` with `encoding` hard-coded at `:1926`); struct at `protocol/skp/src/v0/commands.rs:165-177` (`deny_unknown_fields` at `:166`, the only-value doc comment at `:169`), embedded in `DescribeResponse` at `:255-260`; wire text at `protocol/skp/SKP-V0.md:71-72`, with the no-new-query rule at `:56-58`.
- Version: `protocol/skp/src/v0/mod.rs:87` (literal `skp/0.8`); TS mirror `frontends/shell/src/skp/types.ts:15`. B1's literal was `skp/0.6` (`protocol/skp/SKP-V0.md:885`); `skp/0.7` (`:923`) and `skp/0.8` (`:950`) have merged since. Schema-evolution rule: `protocol/skp/SKP-V0.md:279-311` (§4 item 13); change log `:539`.
- Shared fixtures: `protocol/skp/tests/data/v0-describe-response.json:19`, `v0-describe-response-caller-asserted.json:19`, `v0-describe-response-session-ordinal.json:19`.
- Pinning tests: `protocol/skp/tests/fixtures.rs::describe_fixtures_round_trip` (`:97`), `::describe_response_with_a_caller_asserted_crs_round_trips` (`:109`), `::describe_response_for_a_session_ordinal_dataset_round_trips_and_carries_no_generation` (`:141`); `kernel/src/skp.rs::...::the_real_describe_crs_shape_matches_the_shared_fixture` (`:2931`) compares the `crs` key set only (`:2977-2997`). No test compares a real open's `geometry` block to a fixture (missing, by search).
- Owner's index row: `kernel/README.md:352`.

### 1f. Publish manifest encoding and the pinless-parts preflight
- Source: `format_declaration` `kernel/src/publish/mod.rs:1196-1208` (`geometry_encoding` at `:1201`); `FormatDeclaration` at `kernel/src/bundle/mod.rs:500-510`, serialized at `:518-521`, test value at `:1195`; `preflight_pinless_parts` `kernel/src/publish/mod.rs:451-545`, with the degrees refusal at `:472-483` (the pattern ADR-034 Decision 10 names) and the bundle-format restriction `admit_bundle_format` at `:414-449`.
- Refusal vocabulary, all exhaustive matches with no wildcard: `PublishError` `kernel/src/publish/error.rs:163-166` (degrees variant), `code()` `:229-257`; `kernel/src/permission/boundary.rs:220-243` (`error_kind`) and `:276-303` (`publish_outcome`; `Engine` classes as failed at `:299`); the no-audit-record preflight list in the boundary's module doc `:51-63`; `kernel/src/permission/audit/reader.rs:271-274`.
- Pinning tests: `kernel/tests/publish.rs::the_emitted_manifest_has_exactly_the_key_sets_adr_017_declares` (`:1193`), `::publishing_twice_from_identical_inputs_gives_a_byte_identical_manifest` (`:284`), `::a_geographic_degrees_dataset_refuses_at_preflight_by_name_and_writes_nothing` (`:1762`), `::the_degrees_refusal_is_in_preflight_itself` (`:1812`), `::a_projected_dataset_is_untouched_by_the_degrees_gate` (`:1831`).
- Owner's index rows: `kernel/README.md:362-364`.

### 1g. LOD's polygon-only refusal
- Source: `engine/src/lod.rs:1549-1562` (reads WKB through the `wkb` crate, not `PolygonBuilder`; non-Polygon refused as `EngineError::Wkb`); `geometry_type_name` `:1656-1669`; the tier's own geo key writes Polygon at `:1722`; entry point `build_tiers` `:1006`.
- No product caller: `kernel/src/skp.rs:2173-2179`; the only kernel caller is the test at `kernel/src/skp.rs:2637`. Caller rule: `engine/LOD-PREREGISTRATION.md:388-392`.
- Pinning tests: none for the non-Polygon refusal (missing, by search). The tier's own Polygon declaration is read back by `engine/tests/lod_tier_builder.rs::engine_opens_its_own_tier` (`:641`).
- Owner's index row: `engine/README.md:512`.

### 1h. Writers of `geometry_types` in the engine tree
All declare exactly Polygon at 2d4fa886:
- `engine/src/fixture.rs:762` (inside `geo_metadata`, `:697`), `:1345`, `:1434`;
- `engine/src/geoparquet.rs:830` (test helper);
- `engine/src/lod.rs:1722`;
- `engine/tests/lod_tier_builder.rs:450`, `engine/tests/lod_tier_preflight.rs:70`, `engine/tests/publish_stream.rs:609`;
- `engine/tests/b1_projection_hostile_names.rs:102`, `engine/tests/b1_projection_hostile_covering.rs:109`, `engine/tests/b1_nul_native_id_scan_once.rs:76` (these three are not in ADR-034's list at `:24`, which was read at 0ada14f).
- No writer outside `engine/` (search of `kernel/`, `protocol/`, `frontends/`, `renderer/`, `spikes/`). The corpus observer is `engine/compat-corpus/of-record/scripts/observe.py`.

### 1i. Batch sizing, which sets partition boundaries
- `estimate_bytes` `engine/src/stream.rs:2214-2217` (counts two offset levels); its use with `wkb.len() / 16` at `:1994-2000`. Boundaries feed partition hashes (comment at `:2219-2224`).
- Pinning tests: `engine/tests/publish_stream.rs::a_publish_partition_is_one_batch_and_its_boundaries_are_reproducible` (`:403`); `engine/tests/batch_sizing.rs::the_policy_stays_inside_its_ceiling_in_every_state_it_can_reach` (from `engine/README.md:502`).

## 2. Consumers in other modules

- Shell decode: `frontends/shell/src/canvas/decodeBatch.ts:46-56` (checks `frame` only; `geometry_encoding` is never read, by search), `ResidentBatch.rings` shape `:29-39`, walk `:82-99`. Tests: `frontends/shell/src/canvas/decodeBatch.test.ts:42`, `:72`.
- Shell describe display: `frontends/shell/src/admission/DescribeSummary.tsx:31-34`; type `frontends/shell/src/skp/types.ts:116-121`; fixtures loaded by `frontends/shell/src/skp/__tests__/fixtures.test.ts:102`; hand-built describe literals at `frontends/shell/src/App.test.ts:87`, `frontends/shell/src/App.lateResult.test.tsx:161`, `frontends/shell/src/admission/admitDataset.test.ts:32`, `frontends/shell/src/admission/AdmissionPanel.test.ts:122`; E2E expectation `frontends/shell/e2e/regression.mjs:372`.
- Shell picking (Decision 6, O5): `frontends/shell/src/canvas/pick.ts:128-136` (ordinal used as row index); `checkPickCeiling` callers `frontends/shell/src/canvas/buildLayers.ts:262` and `frontends/shell/src/canvas/residentSet.ts:73`; ceiling `frontends/shell/src/canvas/limits.ts:20`, `:57-61`. Tests: `frontends/shell/src/canvas/pick.test.ts:34`, `frontends/shell/src/canvas/limits.test.ts:15`. deck.gl version facts for O5: `frontends/shell/package.json:43`, `frontends/shell/src/canvas/limits.ts:13`, `frontends/shell/src/canvas/buildLayers.ts:152`.
- Shell dedupe (Decision 5): `frontends/shell/src/canvas/tileResidentSet.ts:181-187`; test block `frontends/shell/src/canvas/tileResidentSet.test.ts:168`.
- Other `.rings` readers: `frontends/shell/src/canvas/buildLayers.ts:153`, `extent.ts:27`, `pickResolution.ts:94`, `tileIngest.ts:210`, `:221`, `tileResidentSet.ts:234`, `WorkingCanvas.tsx:1419` (all under `frontends/shell/src/canvas/`).
- Shell attribute seam (O6): no shell attribute lookup exists at 2d4fa886 (search of `frontends/shell/src`); `b1-shell-half` is proposed (`PLAN.yaml:2350-2356`) and held (`state/directives/2026-09-27-session-order.md:18`).
- Shell publish-refusal rendering, for any new publish code: `frontends/shell/src/admission/formatRefusal.ts:118`, `frontends/shell/src/publish/formatPublishRefusal.ts:17`, `frontends/shell/src-tauri/src/publish.rs:426`.
- Bundle viewer: `renderer/bundle-viewer/src/partition.ts:29` (`EXPECTED_ENCODING`), `:123-129` (refusal), failure code at `renderer/bundle-viewer/src/failure.ts:52`; fixtures `renderer/bundle-viewer/scripts/partition-bounds.test.mjs:72`, `renderer/bundle-viewer/scripts/manifest.test.mjs:200`. No test triggers `envelope-encoding-mismatch` (missing, by search).
- Bundle verifier: `kernel/examples/verify-bundle.rs:459-464` (prefix check only). Tests: `kernel/tests/verify_bundle.rs::a_real_bundle_verifies` (`:234`), `::every_corruption_class_is_caught_with_its_declared_state` (`:250`); neither names the encoding class (by search).
- Canvas probe (not named in ADR-034): `frontends/canvas-probe/src/geoarrow.ts:67` reads `geometry_encoding`.

## 3. What governs them

ADRs, Status lines as they read on main:
- ADR-034 `:3` Accepted 2026-10-05, architect-blockable.
- ADR-016 `docs/adr/ADR-016-stable-feature-identity-admission.md:3` (Accepted 2026-09-02, architect-blockable); §5 `:81`, §6 `:93`, §7 `:106`.
- ADR-017 `docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:3` (Accepted 2026-08-06, architect-blockable); §3 `:97`, §4 `:111` with its Schema row at `:118`; §14 reader checks `:513`, encoding failure code `:540`.
- ADR-010 `docs/adr/ADR-010-render-frames-origins-boundaries.md:3` (Accepted 2026-08-03); rule 1 `:17`, rule 2 `:31` with its amendment `:143`, rule 6 `:70`.
- ADR-004 `docs/adr/ADR-004-skp-control-data-plane-mcp-adapter.md:3` (Accepted 2026-07-31); data plane `:17`.
- ADR-006 `docs/adr/ADR-006-lineage-undo-side-effects.md:3` (Accepted 2026-07-31); class table `:13-17`.
- ADR-013 `docs/adr/ADR-013-typed-coordinate-spaces-and-provenance.md:3` (Accepted 2026-08-09; bit identity cited at `engine/src/wkb.rs:249-250`).
- ADR-028 `docs/adr/ADR-028-viewport-bounded-residency-over-budget-contract.md:3` (Accepted 2026-09-02; whole-feature trim in `tileIngest.ts`).
- ADR-023 `docs/adr/ADR-023-attribute-projection-on-viewport-query.md:3` (Proposed, binds nothing).
- `docs/01_Principles.md:13` (principle 7) and `:14` (principle 8, O7).

Preregistrations and records:
- `engine/ADMISSION-PREREGISTRATION.md`: append-only `:5`; R-P5 `:45`; corpus rows 2, 4, 5, 11, 12 at `:85-95`; prediction P1 `:142`.
- `engine/ADMISSION-RESULTS.md`: generated header `:1`; rows #2, #4, #5 at `:13`, `:15`, `:16`; #11 and #12 at `:22-23`.
- Corpus manifest `engine/compat-corpus/of-record/MANIFEST.json`: #11 at `:2374` with types `:2406-2409`; #12 at `:2497` with types `:2529-2532`.
- `engine/LOD-PREREGISTRATION.md`: declared unchanged `:218`; caller rule `:388-392`.
- `engine/B1-PROJECTION-PREREGISTRATION.md` (attribute projection, the B1 seam; not line-read here).

KNOWN-LIMITATIONS:
- Item 9, polygons only, `KNOWN-LIMITATIONS.md:110-115`; it becomes untrue under MP-1, as does `README.md:31` and the module doc `engine/src/lib.rs:17`.
- Item 21, degrees not publishable, `:245-253`.
- New rows go under `:189` (On main since v0.1.0); the highest item number is 30 (`:316`). ADR-034 requires rows for the publish refusal including the undeclared Polygon-only loss (acceptance item 1, `state/directives/2026-10-05-adr-034-acceptance.md:7`) and the LOD refusal (ADR-034 `:134-138`).

docs/08: the Polygons row `docs/08_Testing.md:31`; there is no multipart class (ADR-034 `:150-153`).

Declared ceilings:
- `MAX_BATCH_BYTES` `engine/src/stream.rs:44`, `MAX_ROWS_PER_BATCH` `:66`, `PUBLISH_PARTITION_TARGET_BYTES` `:126`, all enforced through `estimate_bytes` `:2214-2217`;
- the composed per-stream figure `kernel/README.md:59-62`;
- `DECKGL_PICK_INDEX_CEILING` `frontends/shell/src/canvas/limits.ts:20` and `MAX_RESIDENT_VERTICES` `:45`.

## 4. Questions the form must answer (gaps only)

1. `GeoMeta::parse` collapses three file states into one empty list (an absent key, an explicit empty list, and non-string members; `engine/src/geoparquet.rs:399-408`), while ADR-034 speaks of an empty list kept empty (`:55`, `:62`). Which of those states does each Decision refer to, and what does `declared_types` carry for each (O3)?
2. ADR-034 `:118-119` asks for proof that Polygon-only stream bytes and partition hashes do not change. The only determinism tests compare two runs at one revision (`kernel/tests/publish.rs:284`, `engine/src/envelope.rs:497`), and partition cuts depend on `estimate_bytes` (`engine/src/stream.rs:2214-2217`), where per-part offsets are to be declared (ADR-034 `:153`). What before/after instrument does the form use, and can that declaration move a `geoarrow.polygon` cut?
3. Prediction P1 of the P4 generator is a literal five-file list (`engine/tests/admission_p4_corpus.rs:1052`; rows `:273`, `:284`), registered in a preregistration that is append-only (`engine/ADMISSION-PREREGISTRATION.md:5`, `:142`). Where are the new #11 and #12 predictions registered before the re-run?
4. Decision 10's refusal goes in `preflight_pinless_parts` (`kernel/src/publish/mod.rs:451`), and every refusal there is named in exhaustive matches: `kernel/src/publish/error.rs:229-257`, `kernel/src/permission/boundary.rs:220-243` and `:276-303` (`Engine` classes as failed), and `kernel/src/permission/audit/reader.rs:271-274`. Which variant carries the refusal, with which code and which outcome class?
5. These changed sites have no pinning test that runs in CI on main:
   - admission (only the `#[ignore]`d generator, `engine/tests/admission_p4_corpus.rs:796-799`);
   - a real open's `describe.geometry` (`kernel/src/skp.rs:1924-1929`);
   - the encoding-mismatch refusal (`renderer/bundle-viewer/src/partition.ts:123-129`, `kernel/examples/verify-bundle.rs:459-464`; aligning the verifier is MP-2's, ADR-034 `:128`);
   - LOD's non-Polygon refusal (`engine/src/lod.rs:1554-1562`).

   Which of these does the form pin?

## Stale pointers found in existing records (recorded, not fixed)
- `KNOWN-LIMITATIONS.md:115` cites `engine/src/dataset.rs:275-281` for the polygon gate, which is now at `engine/src/dataset.rs:364-374`.
- `KNOWN-LIMITATIONS.md:253` cites `kernel/src/publish/mod.rs:435-443` for the degrees check, which is now at `kernel/src/publish/mod.rs:472-483`.
- `engine/ADMISSION-PREREGISTRATION.md:45` cites `dataset.rs:275-282`. That document is append-only, so the cite is historical.
- ADR-034's writer list (`:24`, read at 0ada14f) omits three engine tests that exist on main (section 1h). Its fact that every writer declares Polygon still holds.
- The assessment's locators (`state/consults/2026-09-24-multipolygon-assessment.md:7`, at a78d621) are unpinned by its own statement. For example, it puts the gate at `dataset.rs:326-333` and `kernel/src/skp.rs:1064`; at main these are `engine/src/dataset.rs:364-374` and `kernel/src/skp.rs:1926`.

## Files read
- `state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md` 1-62
- `engine/README.md` 495-528; `kernel/README.md` 52-81, 346-384
- `docs/adr/ADR-034-geometry-type-admission-and-geoarrow-encoding-selection.md` 1-202
- `state/directives/2026-10-05-adr-034-acceptance.md` 1-14; `state/directives/2026-09-27-session-order.md` 1-19
- `state/consults/2026-09-24-multipolygon-assessment.md` 1-211
- `DECISIONS-PENDING.md`: block RULED 2026-09-24 — question round 17 (items 1 to 9), block RULED 2026-09-24 (night), and the RULED 2026-10-05 headings (by heading)
- `PLAN.yaml` 1370-1386, plus search hits for `b1-engine-kernel-half`, `lod-tier-selection`, `briefb-b3-publish-v2`, `geometry-points-cut`, `b1-shell-half`
- `engine/src/dataset.rs` 300-409, 950-994; `engine/src/wkb.rs` 1-314; `engine/src/geoarrow.rs` 1-334; `engine/src/envelope.rs` 150-409, 530-570; `engine/src/stream.rs` 1985-2029, 2200-2229, 2408-2427; `engine/src/geoparquet.rs` 345-411, 815-834; `engine/src/lod.rs` 1540-1574, 1650-1674, 1875-1992
- `engine/tests/slice.rs` 480-539; `engine/tests/admission_p4_corpus.rs` 266-290, 1040-1064
- `engine/ADMISSION-RESULTS.md` 1-60; `engine/ADMISSION-PREREGISTRATION.md` 1-8; `engine/LOD-PREREGISTRATION.md` 1-30, 462-469; `engine/compat-corpus/of-record/MANIFEST.json` 2400-2411, 2525-2534
- `kernel/src/skp.rs` 1855-1944, 2084-2093, 2170-2181, 2918-2997; `kernel/src/publish/mod.rs` 400-584, 1188-1212; `kernel/src/publish/error.rs` 150-259; `kernel/src/permission/boundary.rs` 40-69, 215-309; `kernel/src/permission/audit/reader.rs` 255-284; `kernel/src/bundle/mod.rs` 496-525; `kernel/examples/verify-bundle.rs` 440-474; `kernel/tests/publish.rs` 1755-1843
- `protocol/skp/src/v0/commands.rs` 155-269; `protocol/skp/SKP-V0.md` 40-99, 276-335
- `frontends/shell/src/canvas/decodeBatch.ts` 1-104; `frontends/shell/src/admission/DescribeSummary.tsx` 1-94; `frontends/shell/src/skp/types.ts` 110-124; `frontends/shell/src/canvas/limits.ts` 1-73; `frontends/shell/src/canvas/pick.ts` 120-137; `frontends/shell/src/canvas/residentSet.ts` 64-75; `frontends/shell/src/canvas/tileResidentSet.ts` 178-197; `frontends/shell/e2e/regression.mjs` 364-375; `frontends/canvas-probe/src/geoarrow.ts` 55-74
- `renderer/bundle-viewer/src/partition.ts` 20-34, 115-134
- `KNOWN-LIMITATIONS.md` 1-13, 101-117, 186-195, 245-254, 316-334; `docs/08_Testing.md` 20-44; `docs/adr/ADR-004-skp-control-data-plane-mcp-adapter.md` 1-32; `docs/adr/ADR-006-lineage-undo-side-effects.md` 9-22
- Search results only, with the hit lines cited above:
  - section headings of ADR-010, ADR-016, ADR-017, `docs/01_Principles.md`, `protocol/skp/SKP-V0.md`, `engine/ADMISSION-PREREGISTRATION.md` and `engine/LOD-PREREGISTRATION.md`;
  - the Status lines in `docs/adr/`;
  - test names in `engine/tests/slice.rs`, `engine/tests/publish_stream.rs`, `engine/tests/lod_tier_builder.rs`, `engine/src/envelope.rs`, `kernel/tests/verify_bundle.rs`, `protocol/skp/tests/fixtures.rs` and the `frontends/shell/src/canvas/*.test.ts` files;
  - repository-wide searches for `geometry_types`, `geometry_encoding`, `geoarrow.polygon`, `GeoMetadata`, `envelope-encoding-mismatch`, `checkPickCeiling` and `.rings`, and for publish codes in `frontends/shell`.
