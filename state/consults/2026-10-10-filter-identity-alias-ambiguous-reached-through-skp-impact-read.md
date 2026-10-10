# Impact read — filter-identity-alias-ambiguous-reached-through-skp (lead-data, second pilot, resumed)
Read at: main 82ceae7f

Pointers only, under the second pilot's §1 (state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md:5-15). No draft text, design, recommendation or answer. Every path:line below was read in the main checkout at 82ceae7f. Nothing below is a quotation unless it is marked as one; there are none.

The piece, by pointer: PLAN.yaml:4369-4385 (title :4370, summary :4384); the sweep's finding 2, state/consults/DRIFT-SWEEP-AREA-C-2026-10-10.md:16-21; the custodian's check, state/consults/2026-10-10-drift-sweep-area-c-custodian-check.md:32-45 (finding 2) and :118-129 (the human's item 1); placed in slot 2 at state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:36, forms ahead at :38.

## 1. Interfaces the piece touches

**1a. The declared identity on `open_dataset`.**
- Wire type: `spatial_skp::v0::IdentityDeclaration`, protocol/skp/src/v0/commands.rs:52-59; the request field `OpenDatasetRequest.identity`, protocol/skp/src/v0/commands.rs:35-38.
- Spec: protocol/skp/SKP-V0.md:22-27 (shape), :30-44 (the skp/0.2 field note); §8's skp/0.2 entry, protocol/skp/SKP-V0.md:548-557; §7.2's dated correction on an omitted key, protocol/skp/SKP-V0.md:382-394.
- Host: the identity is host-minted at kernel/src/skp.rs:1119 by `host_minted_identity_declaration`, kernel/src/skp.rs:1656-1668 (the wire has no skip field, so uniqueness is always verified on this route); it is passed to the catalog at kernel/src/skp.rs:1174-1176, then `Catalog::open_cancellable`, kernel/src/lib.rs:202-219, then `Dataset::open_cancellable`, engine/src/dataset.rs:296-310.
- Pinned by: protocol/skp/tests/fixtures.rs::open_dataset_request_with_crs_assertion_and_identity_round_trips (:48); kernel/tests/skp_admission_remediation.rs::declared_identity_on_parcel_key_is_admitted_and_reads_mapped (:185, the mapped assertion at :206); ::declared_identity_naming_a_missing_column_is_refused (:213); ::declared_identity_naming_a_non_unique_column_is_refused (:237).

**1b. The Mapped identity.**
- Source: `IdSource::Mapped`, engine/src/identity.rs:37-41; its envelope value, :85; its source column, :95. Constructed in `admit_identity`, engine/src/dataset.rs:1714-1726; a declared column the file lacks refuses, :1744-1750; the uniqueness scan, :1787-1814. `describe`'s `identity.class` for it, kernel/src/skp.rs:1943-1947.
- Owner's index row: engine/README.md:501 (`spatial_engine::identity`).
- Pinned by: engine/tests/identity.rs::a_file_whose_key_is_not_called_id_is_refused_until_a_mapping_is_declared (:139, the `Mapped` assertion at :176-183); kernel/tests/skp_admission_remediation.rs::declared_identity_on_parcel_key_is_admitted_and_reads_mapped (:185).

**1c. The filter refusal and its fields.**
- Source: `FilterError::IdentityAliasAmbiguous { column, source_column }`, engine/src/predicate.rs:266-271; its `Display`, :338-343; the rule, `identity_alias_ambiguity`, :1106-1129, whose honesty note is :1111-1116; the check runs first in the per-name loop of `namespace_admit`, :1144-1174 (the alias test at :1166-1174, ahead of the geometry and existence checks); the module doc names the rule, :13-16; reached from `AdmittedPredicate::admit`, :113, via :172.
- Fact of the code: the rule tests only that a field named `id` exists in `file_schema()` (engine/src/predicate.rs:1120-1125); it does not read that field's type.
- Owner's index row: engine/README.md:504 (filter admission); neither pinned test there names this variant.
- Pinned by: no test. No engine test makes it fire (see section 2).

**1d. The SKP code.**
- Source: the `filter_error_of` arm, kernel/src/skp.rs:2248-2258; `predicate_admit_error_of`, kernel/src/skp.rs:1711-1718; the call in `build_viewport_query`, kernel/src/skp.rs:1839-1842; the pre-mint placement, kernel/src/skp.rs:1410-1420; the envelope builder `SkpError::protocol_with_fields`, protocol/skp/src/v0/error.rs:35-48.
- Spec: protocol/skp/SKP-V0.md §5, :319-336; §7.5 heading :465, the table row :479, the unreachable note :485-488; §7.6, :495-501.
- Owner's index row: kernel/README.md:359 (wire error codes).
- Pinned by: kernel/src/skp.rs::tests::filter_identity_alias_ambiguous_maps_to_its_code_and_fields (:2799-2810), which constructs the variant and maps it directly; no test reaches it through `SkpHost`. No protocol fixture carries the code: the filter error fixtures under protocol/skp/tests/data/ are v0-error-filter_type_not_admitted.json only (by glob).

**1e. The shell's refusal rendering.**
- Source: `applyFilter` formats the `SkpError`, frontends/shell/src/App.tsx:300-332 (the format at :317); `formatRefusal`, frontends/shell/src/admission/formatRefusal.ts:27-33; `refusalGuidance` has no case for this code and returns null by default, frontends/shell/src/admission/formatRefusal.ts:70-147 (default at :144-145); `FilterPanel` holds and renders the refusal, frontends/shell/src/filter/FilterPanel.tsx:50-56 and :132-134; `RefusalBlock` renders code, message and fields, frontends/shell/src/admission/RefusalBlock.tsx:24-43.
- The shell's identity form opens only for `engine.identity_unusable`, frontends/shell/src/admission/AdmissionPanel.tsx:25-27.
- Pinned by: no test names the code anywhere under frontends/ (repo grep).

## 2. Who consumes them

- **Engine tests naming the variant:** engine/tests/admission_property_campaign.rs:617-632 (`code_of`, line :625) and engine/tests/filter_type_admission.rs:560-575 (`campaign_code_of`, line :568). Both are exhaustive name maps with no wildcard arm; neither builds a dataset that makes the variant fire.
- **Kernel test naming the code:** kernel/src/skp.rs:2799-2810, mapping only (section 1d). It does not fire the rule.
- **Kernel tests that open a Mapped identity through `SkpHost`, with no filter:** kernel/tests/skp_admission_remediation.rs:185-208 (a `ForeignKeyColumn` file, which carries no `id` column, engine/src/fixture.rs:533-535).
- **The one kernel test on main whose dataset has the alias shape:** kernel/tests/skp_projection.rs:1217-1238, the X3 case. A native MultiType file with its own `id`, its identity mapped to `i64`, opened through the catalog route with `skip_uniqueness_check = true`; its comment, :1219-1225, says the wire route would refuse this fixture because `i64` holds negative values. It sends projections only, never a filter.
- **Engine shapes with both an `id` and a mapped column, no filter:** engine/tests/publish_stream.rs:564-576, a test-local writer `write_both_id_columns` (`id` UInt64 and `parcel_key` UInt64), used by `a_mapped_identity_orders_by_the_identity_the_stream_actually_emits`, :361-389; engine/src/attributes.rs:826-839, a unit test whose schema is `id` beside a mapped `i64`, its comment naming the alias shape at :828-830.
- **Through-SKP filter refusal tests, none naming this code:** kernel/tests/skp_admission.rs::a_filtered_viewport_query_with_an_invalid_predicate_refuses_synchronously_and_mints_no_ticket (:564, code at :594); ::a_filtered_viewport_query_comparing_text_with_a_number_refuses_synchronously_typed_and_mints_no_ticket (:612, code at :642); kernel/tests/skp_projection.rs::a_filter_refusal_for_a_still_refused_type_keeps_todays_reason_byte_for_byte (:1034, code at :1059).
- **Shell and e2e:** nothing names the code. The e2e filter refusal steps assert `skp.filter_unknown_column` only: frontends/shell/e2e/filter.mjs:189, frontends/shell/e2e/filter-panel.mjs:227.
- **Does any make it fire:** none. This agrees with the custodian's check at 116deb53 (state/consults/2026-10-10-drift-sweep-area-c-custodian-check.md:125-128).

**The e2e re-aim's fixture variant.**
- It is not on main. `IdentityMode` on main has six variants, engine/src/fixture.rs:530-546, and none carries both `id` and `parcel_key`; the schema match is at engine/src/fixture.rs:621-628.
- It is defined in the re-aim's form: §2.6 (A), frontends/shell/e2e/E2E-STALE-EXPECTATIONS-REAIM-PREREGISTRATION.md:297-303, with `id` Utf8 then `parcel_key` UInt64 (:300). Amendment 1 item 2 binds it, :499-502. Amendment 2 item 5 lists its branch points at branch commit cf2434e6, :626-642. Its fixtures F-B and F-D are in the §2.5 table, :288 and :290, generated in kernel/tests/manual_walkthrough_fixtures.rs (:283).
- The re-aim is in progress, not merged: PLAN.yaml:4554 (status), :4559 (branch evidence).

## 3. What governs them

- **ADR-016**, Status at docs/adr/ADR-016-stable-feature-identity-admission.md:3 (Accepted, 2026-09-02, architect-blockable as of acceptance). Decision §3, the declared mapping, :64-69; §5, uniqueness over mapped values, :81-92; Amendment 1, heading at :180.
- **ADR-021**, Status at docs/adr/ADR-021-row-filter-on-viewport-query.md:3 (Accepted, 2026-08-13, by the human). The Related line ties the alias refusal to ADR-016 §3's `Mapped` identity, :22-24; decision 5, the namespace rule, :71-74; decision 8, the eleven codes including this one, :93-99; the Note 2026-09-29, where decision 8's eleven codes stand, :241.
- **ADR-004**, Status at docs/adr/ADR-004-skp-control-data-plane-mcp-adapter.md:3 (Accepted — 2026-07-31): the control plane this code travels on.
- **Where the code and the rule were introduced:** the sql-filter cut, whose record is state/cut-archive/CUT-STATE-sqlfilter-panels-publish.md: namespace admission and the honesty note, :542-559; the refusal enum, :580-587; the kernel mapping and its unit test, :822-836. **Missing:** neither owner's index lists a module preregistration file for that cut (engine/README.md:519, kernel/README.md:376).
- **Where the identity on `open_dataset` was introduced:** the admission-remediation cut, closed and merged at 16091f9 per state/cut-archive/CUT-STATE-admission-remediation.md:1; SKP-V0 §8's skp/0.2 entry, protocol/skp/SKP-V0.md:548-557.
- **Identity admission's other tiers:** `engine/ADMISSION-PREREGISTRATION.md` (§2d's session tier, as engine/src/identity.rs:42-55 cites it; listed at engine/README.md:519). Stage 3 after namespace admission: `engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md` (listed at engine/README.md:519).
- **SKP-V0.md sections:** §1 `open_dataset`, protocol/skp/SKP-V0.md:20-48; §5, :319-336; §7.2's correction, :382-394; §7.3's namespace, :423-425; §7.5, :465-493; §7.6, :495-519; §8's preamble (§§1–7 are the live description, updated in place where a version note says so; §8 is append-only), :541-546. The literal is `skp/0.11`, protocol/skp/src/v0/mod.rs:109.
- **KNOWN-LIMITATIONS:** no item names the code or the rule (grep). Item 3, the declared mapping, KNOWN-LIMITATIONS.md:60-66, is in the re-aim's scope (its Appendix B, frontends/shell/e2e/E2E-STALE-EXPECTATIONS-REAIM-PREREGISTRATION.md:488). Item 8, filter and publish, KNOWN-LIMITATIONS.md:101-108, is the docs lane's piece (PLAN.yaml:4423-4439).
- **Declared ceilings on the path:** `MAX_PREDICATE_BYTES`, engine/src/predicate.rs:59, and `MAX_PREDICATE_DEPTH`, :70 (both stage 1, ahead of the alias check); `MAX_ADMISSION_CONNECTIONS`, engine/src/pool.rs:132. None is specific to this code.
- **The two texts the node calls false:** protocol/skp/SKP-V0.md:485-488 and engine/src/predicate.rs:1111-1116. Repo grep finds no third text making the same claim in engine/, kernel/, protocol/ or frontends/shell/. The cut record's copy, state/cut-archive/CUT-STATE-sqlfilter-panels-publish.md:550-559, is a record.

## 4. Overlap (rule 00)

**Paths under protocol/ this piece would touch, as named by its node (PLAN.yaml:4384):** protocol/skp/SKP-V0.md, at §7.5's note, :485-488. No other protocol/ path is named by any pointer. No protocol fixture for the code exists (section 1d). Whether the piece adds one is not stated anywhere.

**Overlap on protocol/:**
- `skp-v0-live-sections-current-area-c`, PLAN.yaml:4405-4421, edits protocol/skp/SKP-V0.md's live sections and protocol/skp/src/v0/error.rs and handles.rs. It is placed to start only while no other piece or open PR touches protocol/ (state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:27). It excludes finding 2's two texts (PLAN.yaml:4420).
- `crs-undeclared-message-wording`, PLAN.yaml:4477-4493, may touch protocol/skp/tests/data/v0-error-example.json (:4492). It depends on this piece (:4484).

**Other paths named or implied by the node, and who else holds them:**
- engine/src/predicate.rs (the honesty note). No in-progress piece or listed node names this file.
- engine/README.md and kernel/README.md owner's indexes (the index update). `stream-flush-cancel-exit-marks-producer-cancelled` updates engine/README.md (PLAN.yaml:4510). This piece depends on it (:4376).
- engine/src/fixture.rs and kernel/tests/manual_walkthrough_fixtures.rs, if the re-aim's variant is reused. Both are in slot 1's `e2e-stale-expectations-reaim` (PLAN.yaml:4549-4565; its form §2.5 and §2.6).
- engine/tests/identity.rs, engine/tests/admission_instruments.rs and kernel/tests/skp_filter_cancellation.rs are in the docs lane's `stale-test-names-and-comments` (PLAN.yaml:4474), if a test of this piece lands in one of them.

## 5. Questions the form must answer (gaps only)

1. Through which route does a test reach the code: `open_dataset`'s wire identity, which always verifies uniqueness (kernel/src/skp.rs:1656-1668), or the catalog route the X3 case uses with the check skipped (kernel/tests/skp_projection.rs:1217-1238)? The node says through SKP (PLAN.yaml:4370).
2. Which fixture shape does the test use, and does the piece wait on the re-aim's merge? The re-aim's variant is absent on main (engine/src/fixture.rs:530-546) and defined only in that form (frontends/shell/e2e/E2E-STALE-EXPECTATIONS-REAIM-PREREGISTRATION.md:297-303, :626-642). A test-local both-columns writer exists at engine/tests/publish_stream.rs:564-576.
3. Which layers does the piece prove: kernel through `SkpHost` only, or also the shell's rendering and an e2e step? The node records the shell rendering as by reading, not by a run (PLAN.yaml:4384), and no shell or e2e test names the code (section 2).
4. How is SKP-V0.md §7.5's note corrected: in place, or as a dated note? §8's preamble governs in-place updates (protocol/skp/SKP-V0.md:543-546), and §7.2 carries an appended-correction precedent (:382-394). Does any other §7.5 line, such as the heading's count at :465 against ADR-021 decision 8 (docs/adr/ADR-021-row-filter-on-viewport-query.md:93), fall inside or outside this piece beside `skp-v0-live-sections-current-area-c` (PLAN.yaml:4405-4421)?
5. Does the piece change any string the app shows? `refusalGuidance` has no case for the code (frontends/shell/src/admission/formatRefusal.ts:70-147), user-visible strings are sighted by the human (frontends/shell/src/admission/formatRefusal.ts:60-63), and the engine's message is engine/src/predicate.rs:338-343.

## Files read

- state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md: 1-62
- engine/README.md: 495-530
- kernel/README.md: 346-387
- state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md: 1-41
- PLAN.yaml: 3372-3383, 4360-4389, 4405-4514, 4549-4565 (plus grep hits at 3805-3821)
- state/consults/DRIFT-SWEEP-AREA-C-2026-10-10.md: 1-83
- state/consults/2026-10-10-drift-sweep-area-c-custodian-check.md: 1-134
- engine/src/predicate.rs: 1-40, 220-359, 1080-1199 (plus grep for the ceilings and `admit`)
- engine/src/dataset.rs: 225-334, 1660-1829
- engine/src/identity.rs: 1-130
- engine/src/fixture.rs: 170-219, 525-554, 612-675
- engine/src/attributes.rs: 815-839
- engine/tests/identity.rs: 138-222 (plus the test-name grep)
- engine/tests/admission_property_campaign.rs: 605-639
- engine/tests/filter_type_admission.rs: 550-584
- engine/tests/publish_stream.rs: 300-389, 564-576
- engine/tests/spatial_index.rs: 320-374
- kernel/src/skp.rs: 1105-1184, 1400-1429, 1650-1674, 1695-1719, 1790-1859, 1930-1959, 2195-2284, 2780-2819
- kernel/src/lib.rs: 185-224
- kernel/tests/skp_admission_remediation.rs: 150-229 (plus the fn-name grep)
- kernel/tests/skp_projection.rs: 1030-1064, 1170-1269
- kernel/tests/skp_admission.rs: the test-name grep only
- protocol/skp/SKP-V0.md: 15-59, 319-338, 370-509, 540-569 (plus the heading and identity greps)
- protocol/skp/src/v0/commands.rs: 15-74
- protocol/skp/src/v0/error.rs: 1-60
- protocol/skp/src/v0/mod.rs: grep for `SKP_VERSION` (109)
- protocol/skp/tests: grep only (fixtures.rs, conformance/fixtures, data/)
- frontends/shell/src/admission/RefusalBlock.tsx: 1-44
- frontends/shell/src/admission/formatRefusal.ts: 20-148
- frontends/shell/src/App.tsx: 300-339 (plus a filter grep)
- frontends/shell/src/filter/FilterPanel.tsx: grep (7-8, 50, 56, 132-134)
- frontends/shell/src/admission/AdmissionPanel.tsx: grep (25-27)
- frontends/shell/src/admission/admitDataset.ts: grep only
- frontends/shell/e2e/E2E-STALE-EXPECTATIONS-REAIM-PREREGISTRATION.md: 283-307, 494-643 (plus a heading grep)
- docs/adr/ADR-016-stable-feature-identity-admission.md: 3-5, 56-115 (plus a heading grep)
- docs/adr/ADR-021-row-filter-on-viewport-query.md: 3-5, 20-27, 69-109 (plus a namespace grep)
- docs/adr/ADR-004-skp-control-data-plane-mcp-adapter.md: 3
- state/cut-archive/CUT-STATE-sqlfilter-panels-publish.md: 542-594, 822-836 (plus a heading grep)
- state/cut-archive/CUT-STATE-admission-remediation.md: grep only (line 1)
- KNOWN-LIMITATIONS.md: 58-67, 101-109 (plus a heading grep)
- state/consults/DRIFT-SWEEP-AREA-D-2026-10-10.md and state/consults/2026-10-10-drift-sweep-area-d-custodian-check.md: grep only (no hit for the honesty note)
- Repo-wide greps: `identity_alias_ambiguous|IdentityAliasAmbiguous`, `skp\.filter_` (kernel/tests, frontends/shell), `open_with_declared_identity|IdentityDeclaration::new|identity: Some`, `alias` (engine, kernel), the unreachable-claim phrasing (engine, kernel, protocol, frontends/shell)
