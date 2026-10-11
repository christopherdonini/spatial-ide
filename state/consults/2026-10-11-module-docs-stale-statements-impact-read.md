# Impact read — module-docs-stale-statements (lead-data, second pilot, resumed)
Read at: main 4c49401a

Task: an impact read (state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md:7-11) for the placed node at PLAN.yaml:3805-3821, the docs lane's piece d (state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:19, :26). Pointers only. No draft text, design, recommendation or answer. Every file below was read in the main checkout, whose head is 4c49401a; the working tree has no tracked-file change.

## 1. Each stale statement as it stands on main, and 2. the current fact it contradicts

Numbered as the node numbers them (PLAN.yaml:3820). The sweep's commit is 116deb53; its check is state/consults/2026-10-10-drift-sweep-area-d-custodian-check.md. "Holds" means the stale text sits at the sweep's lines on main. Test pins are written path::name.

### (3) kernel README, H2 row (first in the node)
- Stale, holds: kernel/README.md:331.
- Current fact: the budget is no longer asserted (kernel/tests/end_to_end.rs:385). The interval runs from client pre-send to adapter receipt, is printed as a report, and is not ADR-018's producer-clock pair (kernel/tests/end_to_end.rs:421-426, :477-482). What is asserted: ordering, at most one batch after cancel, a 5 s liveness bound (kernel/tests/end_to_end.rs:417-434, :463-476).
- Pinned by: `kernel/tests/end_to_end.rs::h2_cancellation_is_observed_by_the_producer_inside_the_budget` and `kernel/tests/end_to_end.rs::h2_a_cancel_before_the_first_batch_still_stops_the_query` (kernel/tests/end_to_end.rs:386, :445).
- Observed, named by no node: the first test's own name still says inside the budget. Its comment says the name predates the re-aim (kernel/tests/end_to_end.rs:385). A grep of PLAN.yaml for the name finds nothing.

### (4) engine persists nothing (first in the node)
- Stale, holds: engine/README.md:80; engine/src/lib.rs:47-50. Line 49 names the module's own trigger, docs/11's ResourceRef model and kernel/.
- Current fact: the tier builder writes a sidecar directory keyed by the source content hash under the app-local cache (engine/src/lod.rs:9-14, :151). It creates the directory (engine/src/lod.rs:1152), writes one GeoParquet file per tier (engine/src/lod.rs:1399) and writes `tiers.json` (engine/src/lod.rs:1236). Entry point: engine/src/lod.rs:1006. No SKP command calls it (kernel/src/skp.rs:2185-2189).
- Pinned by: `engine/tests/lod_tier_builder.rs::engine_opens_its_own_tier` (:641) and `engine/tests/lod_tier_builder.rs::a_tier_altered_on_disk_is_not_reused_and_the_disclosure_is_the_on_disk_size` (:685).
- Still true and not stale: the README's index paragraph (engine/README.md:240-242). The kernel README discharges the same trigger, for bundles only (kernel/README.md:204-214).

### (1) absent crs key refused; non-x-first source refused
- Stale, holds:
  - engine/README.md:23-29 and :438-441 (absent key);
  - engine/README.md:452-463, the axis-order section (refused at :455-456);
  - engine/src/lib.rs:13-14.
- Current fact:
  - An absent key under a pinned version is admitted as OGC:CRS84 with `crs:format-default` (engine/src/geoparquet.rs:16-23; versions at :37).
  - A declared non-x-first definition reaches the axis check carrying the format's WKB order and is admitted (engine/src/dataset.rs:416-422).
  - What still refuses: a null key, an unpinned version, a caller-asserted non-x-first CRS (engine/src/dataset.rs:398-404, :419-421). So does a format default that the file's own bbox or covering contradicts (PLAN.yaml:4457).
- Pinned by, all in engine/tests/admission_format_semantics.rs:
  - `f1_an_absent_crs_key_admits_under_the_formats_own_rule_with_that_provenance` (:75);
  - `f4_a_declared_lat_first_crs_admits_under_the_wkb_override_with_its_declared_order_retained` (:219);
  - `f2_coordinates_outside_the_domain_convict_the_format_default` (:152);
  - `f3_an_explicit_null_crs_is_unchanged_and_still_needs_an_assertion` (:196);
  - `an_unpinned_spec_version_takes_no_format_rule_and_the_refusal_names_the_version` (:362).
- Observed, same claim, named by no node: engine/src/crs.rs:7, the module doc's refusal sentence.

### (2) no id column refused
- Stale, holds: engine/README.md:442-450.
- Current fact: a single-file source with no native id and no declaration opens on the session tier (engine/src/dataset.rs:1704-1706, :1754-1756; `IdSource::SessionOrdinal` at engine/src/identity.rs:55). A declared mapping to a missing column still refuses (engine/src/dataset.rs:1744-1750).
- Pinned by: `engine/tests/session_identity.rs::a_single_file_keyless_source_admits_on_the_session_tier_and_records_its_basis` (:178) and `engine/tests/session_identity.rs::a_declared_mapping_to_a_missing_column_still_refuses_rather_than_falling_to_the_session_tier` (:241).

### (5) attribute set
- Stale, holds: engine/README.md:366-369.
- Current fact: `Utf8View` (engine/src/attributes.rs:83), `Float32` (:94) and a dictionary over an admitted value type (:101) are admitted. The module says its set no longer matches the bundle restriction (engine/src/attributes.rs:45-48). Only publish preflight refuses `Float32` and dictionaries (kernel/src/publish/mod.rs:414-444).
- Pinned by:
  - `engine/src/attributes.rs::tests::the_live_admissible_set_admits_float32_and_a_dictionary_over_an_admitted_value_type` (:615; `mod tests` at :603-604);
  - `kernel/tests/skp_projection.rs::publish_refuses_float32_and_dictionary_columns_at_preflight_as_a_bundle_format_restriction_with_todays_text` (:1517).

### (6) scope line and summary table
- Stale, holds: engine/README.md:3-5 and :16.
- Current fact: there are five encodings, fixed at open (engine/src/lib.rs:17-28; engine/src/geoarrow.rs:7-16). The live projected path is at engine/src/stream.rs:999.
- Pinned by: `engine/tests/geometry_admission.rs::a_declared_set_selects_the_encoding_or_is_refused_at_open` and `engine/tests/live_projection.rs::a_live_projected_stream_emits_id_geometry_then_the_declared_columns`. These are the engine index's own pins (engine/README.md:501-503).
- Observed, same claim, named by no node: engine/src/lib.rs:6-8, the module doc's scope line.

### (7) spatial index untouched
- Stale, holds: engine/README.md:76; engine/src/lib.rs:15-16.
- Current fact: the index module (engine/src/index.rs:4-5) and the README's own section (engine/README.md:176-179) say the gate is closed for this slice's shape. The node `spatial-indexing-measurement-close` is done (PLAN.yaml:194-199).
- Pinned by: `engine/tests/spatial_index.rs::an_indexed_query_returns_exactly_what_the_scan_returns` and `engine/tests/planner_seam.rs::the_product_planner_never_reaches_the_index_seam` (engine/README.md:511).

### (8) accepted ADRs and amendments called Proposed
Every site holds at the sweep's lines:
- engine/src/identity.rs:5, :43, :66, :119-121;
- engine/src/crs.rs:11-12;
- engine/src/geoparquet.rs:75-76, :152, :236-237, :588, :742, :803;
- engine/src/dataset.rs:1017, :1731;
- engine/src/envelope.rs:146, :179-180;
- kernel/src/bundle/mod.rs:4-5.

Current fact: the Status lines in §3. Pinned by: no test.

Observed, same class, named by no node:
- engine/src/crs.rs:41-42;
- engine/src/geoparquet.rs:248-249;
- engine/src/lib.rs:14 and :42-46 (ADR-013 Proposed, and its OPEN block cited as still open);
- outside the node's files: kernel/src/skp.rs:419-420.

### (9) CANCELLATION-AND-TRACING §6
- Stale, holds: kernel/CANCELLATION-AND-TRACING.md:161-167 (items 1 and 2).
- Current fact: ADR-017's Corrigendum 4 applies the §15 correction (docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:1044). ADR-018 is Accepted (docs/adr/ADR-018-what-cancellation-acknowledged-means.md:3). Item 3's pointer exists in docs/10 (docs/10_SKP_Protocol.md:32-39).
- Pinned by: no test.
- The document's own discipline is to append corrections rather than edit in place (kernel/CANCELLATION-AND-TRACING.md:219-221). Its §8 amendment touches §2 only (kernel/CANCELLATION-AND-TRACING.md:212-217).

### (10) publish order of operations
- Stale, holds: kernel/src/publish/mod.rs:46-53 (steps 1 and 3).
- Current fact: `preflight` (kernel/src/publish/mod.rs:578) runs first (:610). Staging is created later (:634). The run says so itself (:696). The boundary module already states the current order (kernel/src/permission/boundary.rs:9-19).
- Pinned by: `kernel/tests/publish.rs::a_row_predicate_is_refused_before_any_staging_directory_exists` (:560) and `kernel/tests/publish.rs::the_refusal_is_in_preflight_itself_not_only_reachable_through_publish_unguarded` (:604).

### Extra files (already tracked, same topic)
- Stale, holds:
  - kernel/src/permission/mod.rs:21-24;
  - kernel/src/permission/boundary.rs:27-28;
  - kernel/src/lib.rs:48 (name map fixed at startup).
- Current fact:
  - The shell's `binding_publish_*` commands (frontends/shell/src-tauri/src/commands.rs:265, :402) reach `boundary::execute` (frontends/shell/src-tauri/src/publish.rs:831).
  - SKP `open_dataset` opens into the catalog at runtime (kernel/src/skp.rs:1174-1176).
- Pinned by:
  - frontends/shell/src-tauri/src/publish.rs's test `a_successful_publish_is_audited_with_the_shell_dialog_route_and_a_fresh_log_per_attempt` (:1802);
  - `kernel/tests/catalog_replace.rs::replacing_a_name_through_open_cancellable_serves_the_new_dataset_and_drops_the_old_one_before_it_returns` (kernel/README.md:360).

### Area E finding 5
- Stale, holds: engine/src/geoparquet.rs:868-869. The test name and comment say the default is not applied.
- Current fact: engine/src/geoparquet.rs:16-23. The test's assertion (:871) is a parse-level fact that stays true.
- Pinned by: the test itself; no form names it (a grep outside state/ finds it only at :868).

### Area E finding 2's reference
- Holds: engine/src/identity.rs:253-254 names `engine/tests/identity.rs::a_file_whose_key_is_not_called_id_is_refused_until_a_mapping_is_declared` (engine/tests/identity.rs:139).
- The test asserts session-tier admission (engine/tests/identity.rs:149-157).
- The rename belongs to `stale-test-names-and-comments` (PLAN.yaml:4475; state/consults/2026-10-10-drift-sweep-area-e-custodian-check.md:119-122).

### Lead-data report 1, §6 (state/consults/2026-10-03-lead-data-pilot-setup-lead-data-report-1.md:406-408)
- README ADR statuses, holds: engine/README.md:29, :77-79, :438, :443, :462.
- kernel/src/lib.rs, holds:
  - scope, kernel/src/lib.rs:7-8;
  - only-place, kernel/src/lib.rs:8-11;
  - exposure, kernel/src/lib.rs:41-43.
- Current fact: the README carries the corrected texts, C1a at kernel/README.md:4-6, C1b at kernel/README.md:8-12 and C8 at kernel/README.md:237-241. The edits themselves are at state/consults/2026-10-03-lead-data-pilot-setup-lead-data-report-1.md:99-133 and :301-323.

### Gate-2 architect N1 (state/consults/gates/2026-10-03-lead-data-pilot-setup-gate2-architect.md:78)
- Holds:
  - kernel/PERMISSION-BOUNDARY.md:15-17;
  - kernel/src/lib.rs:41-43 (as above).
- The same gate calls the PERMISSION-BOUNDARY paragraph a dated record (state/consults/gates/2026-10-03-lead-data-pilot-setup-gate2-architect.md:46). The file says it is not rewritten and is superseded as home of record by ADR-024 (kernel/PERMISSION-BOUNDARY.md:3-7). Its body is dated 2026-08-07 (kernel/PERMISSION-BOUNDARY.md:9).

### Gate-3 architect N2 (state/consults/gates/2026-10-03-lead-data-pilot-setup-gate3-architect.md:78)
- Holds: kernel/README.md:239-240 points at publish.rs.
- The commands are defined at frontends/shell/src-tauri/src/commands.rs:265 and :402, and reach the boundary through frontends/shell/src-tauri/src/publish.rs:831.

### Node 9, §3 (state/consults/2026-10-03-kernel-ticket-drop-followups-lead-data-index.md:94-101)
- Moved: the Close ordering bullet is kernel/README.md:358 on main (357 at 4d487d51). It still lists `cancel_of_a_pending_ticket_whose_post_check_found_a_change_does_not_hang`.
- That test calls only `StreamRegistry::cancel` (kernel/src/skp.rs:3590-3597). The Stream tickets bullet is kernel/README.md:353.
- This is an owner's-index line, under the section's own rules (kernel/README.md:348).

### Node 9, §4 (state/consults/2026-10-03-kernel-ticket-drop-followups-lead-data-index.md:106-115)
- Moved: the body sentence is kernel/README.md:176-178 on main (177-179 at 4d487d51). It has no qualifier.
- The field's doc comment carries the not-covered qualifier at kernel/src/skp.rs:172-176. Pinned by: no test of the qualifier.

## 3. What governs them

- **ADR Status lines:**
  - ADR-013 Accepted (docs/adr/ADR-013-typed-coordinate-spaces-and-provenance.md:3); its Amendment 1, appended and Accepted (:265).
  - ADR-015 Accepted (docs/adr/ADR-015-source-crs-requirement-and-caller-assertion.md:3); its Amendment 1, appended and Accepted (:155).
  - ADR-016 Accepted (docs/adr/ADR-016-stable-feature-identity-admission.md:3); its Amendment 1, appended and Accepted (:180).
  - ADR-017 Accepted (docs/adr/ADR-017-static-bundle-format-and-publish-semantics.md:3). Corrigendum 4 is at :1044, and the exposure review completion is at :1134-1142: discharged for the shell UI surface only, with publish-bundle still developer/test tooling.
  - ADR-018 Accepted (docs/adr/ADR-018-what-cancellation-acknowledged-means.md:3).
  - ADR-032 Accepted (docs/adr/ADR-032-geoparquet-source-declaring-a-non-x-first-axis-order.md:5).
  - ADR-034 Accepted (docs/adr/ADR-034-geometry-type-admission-and-geoarrow-encoding-selection.md:3).
  - ADR-005 Accepted (docs/adr/ADR-005-resource-identity-reproducibility.md:3); derived outputs are graded by their weakest input (:20).
  - Proposed, binding nothing: ADR-023 (docs/adr/ADR-023-attribute-projection-on-viewport-query.md:3) and ADR-024 (docs/adr/ADR-024-class-3-permission-boundary-and-first-exposure.md:3).
- **Finding (3):** docs/08's cancellation row, docs/08_Testing.md:8.
- **Finding (4):**
  - the human's ruling, state/directives/2026-10-10-tier-obligation-open-item-and-adr-029.md:7: the restatement says what is owed and where it is tracked;
  - the restatement the ruling refers to, state/consults/2026-10-10-drift-sweep-area-d-custodian-check.md:130;
  - where it is tracked: the named open item on `lod-tier-selection`, PLAN.yaml:850;
  - docs/11's ResourceRef members, docs/11_Project_and_Resource_Model.md:21-31, and its lifecycle, :45;
  - the LOD form: ADR-005 is cited only for the ladder (engine/LOD-PREREGISTRATION.md:79), the tiers.json hashes are at :259, and the cache lifecycle is owed (:394, :398).
- **Budget:** 120 minutes, agreed at state/directives/2026-10-10-tier-obligation-open-item-and-adr-029.md:6.
- **The docs lane's terms:** documents, comments and test names only; no code logic, no test assertion, no string the app shows (state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:19).
- **KNOWN-LIMITATIONS items on the same facts** (the v0.1.0 file; none is in the node):
  - item 2 (KNOWN-LIMITATIONS.md:34);
  - item 3 (:60);
  - item 9 (:107);
  - item 31 (:335);
  - item 33 (:343).
- **Preregistrations:** none in engine/ or kernel/ names these statements. engine/ADMISSION-PREREGISTRATION.md carries the R-C and R-I rules the code comments cite.

## 4. Overlap (rule 00)

The piece would touch these paths, by the node: engine/README.md, engine/src/lib.rs, engine/src/identity.rs, engine/src/crs.rs, engine/src/geoparquet.rs, engine/src/dataset.rs, engine/src/envelope.rs, kernel/README.md, kernel/src/lib.rs, kernel/src/bundle/mod.rs, kernel/CANCELLATION-AND-TRACING.md, kernel/src/publish/mod.rs, kernel/src/permission/mod.rs, kernel/src/permission/boundary.rs and kernel/PERMISSION-BOUNDARY.md.

- **engine/README.md is shared with `crs-undeclared-message-wording`.**
  - That piece replaces three Owner's-index lines: engine/README.md:499, :510 and :519. It replaces each only on an exact byte match (state/consults/2026-10-11-crs-undeclared-message-wording-owners-index-update.md:10).
  - This piece's named items sit in the body, engine/README.md:3-463, and touch none of those three lines. Whether its own index update touches :499 or :519 is open (§6, Q3).
- **Facts pinned by the crs form:** it pins facts in engine/src/geoparquet.rs, engine/src/dataset.rs, engine/src/crs.rs and kernel/src/skp.rs at fixed commits (engine/CRS-UNDECLARED-MESSAGE-WORDING-PREREGISTRATION.md:331). Its file list is at :225-235. engine/src/error.rs is not on this piece's list; it is only a fact pointer here.
- **PR #205 (KNOWN-LIMITATIONS.md):** no shared path. This node depends on that node (PLAN.yaml:3812). Its gate-1 FAIL concerns the same admission facts as finding (1) (PLAN.yaml:4457).
- **`shell-map-refill-after-resize` (frontends/shell; KNOWN-LIMITATIONS item 39, KNOWN-LIMITATIONS.md:367):** no shared path. Finding N2's correction names frontends/shell/src-tauri/src/commands.rs only as text inside kernel/README.md.
- **`stale-test-names-and-comments`:** no shared path.
  - Its rename targets engine/tests/identity.rs:139. engine/src/identity.rs:254, in this piece, names that test.
  - That node is ordered after this one: it depends on `skp-v0-live-sections-current-area-c` (PLAN.yaml:4467), which depends on this node (PLAN.yaml:4413).
  - Area E finding 5's test (engine/src/geoparquet.rs:868) is in this piece, not in that node.
- **Same files, nodes not in progress (not in the brief's list):**
  - `kernel-composed-ceiling-projected-stream`: the kernel README composed table (PLAN.yaml:3788);
  - `engine-cancel-before-execute-siblings`: the engine README item 3 (PLAN.yaml:2679);
  - `skp-v0-live-sections-current-area-c`: kernel/src/skp.rs (PLAN.yaml:4421). This piece names kernel/src/skp.rs only as a fact pointer.
- **Unpinned line cites into the piece's files from live code:** frontends/shell/src-tauri/src/pool_poll.rs:12 cites kernel/src/lib.rs:181. It already misses: `Catalog::get` is at kernel/src/lib.rs:221.
- **protocol/:** no path under protocol/.

## 5. Size facts (counts of what is there)

Files the node names: 15, plus the form and PLAN.yaml. Stale lines per file, as listed in §1. Lines the node does not name are counted separately.

| File | Named stale lines (sites) | Same class, not named |
|---|---|---|
| engine/README.md | 45 (9 ranges: 3-5, 16, 23-29, 76, 77-79, 80, 366-369, 438-450, 452-463) | 0 |
| engine/src/lib.rs | 8 (13-14, 15-16, 47-50) | 8 (6-8, 42-46) |
| engine/src/identity.rs | 7 (5 sites) | 0 |
| engine/src/crs.rs | 2 (1 site) | 3 (7, 41-42) |
| engine/src/geoparquet.rs | 10 (6 status sites; 1 test name and comment) | 2 (248-249) |
| engine/src/dataset.rs | 2 (2 sites) | 0 |
| engine/src/envelope.rs | 3 (2 sites) | 0 |
| kernel/README.md | 7 (331; 176-178; 239-240; 358, an index line) | 0 |
| kernel/src/lib.rs | 9 (7-11, 41-43, 48) | 0 |
| kernel/src/bundle/mod.rs | 1 | 0 |
| kernel/CANCELLATION-AND-TRACING.md | 7 (2 items) | 0 |
| kernel/src/publish/mod.rs | 8 (steps 1-3) | 0 |
| kernel/src/permission/mod.rs | 4 | 0 |
| kernel/src/permission/boundary.rs | 2 | 0 |
| kernel/PERMISSION-BOUNDARY.md | 3 | 0 |

Outside the 15 files: kernel/src/skp.rs:419-420 (status) and kernel/tests/end_to_end.rs:386 (test name).

## 6. Questions the form must answer

1. kernel/PERMISSION-BOUNDARY.md says it is not rewritten (kernel/PERMISSION-BOUNDARY.md:4), and CANCELLATION-AND-TRACING appends its corrections (kernel/CANCELLATION-AND-TRACING.md:219-221). Is N1 or finding (9) an in-place edit or an appended correction? (Raised by: PLAN.yaml:3820.)
2. engine/src/identity.rs:254 is to follow a rename that lands in a later node (PLAN.yaml:4413, :4467). What does this piece do with that reference at its own base? (Raised by: state/consults/2026-10-10-drift-sweep-area-e-custodian-check.md:122.)
3. Where is the form filed, and does the owner's-index update touch engine/README.md:499 or :519? crs's update replaces those lines only on an exact byte match (state/consults/2026-10-11-crs-undeclared-message-wording-owners-index-update.md:10).
4. Finding (1)'s restatement of what still refuses: from which source does it take that case list? Candidates are the code at the piece's base (including the format-default contradiction, engine/tests/admission_format_semantics.rs:152) or PR #205's paragraph, which waits on the human (PLAN.yaml:4457).
5. Are the same-class lines the node does not name in Scope? They are engine/src/lib.rs:6-8 and :42-46, engine/src/crs.rs:7 and :41-42, engine/src/geoparquet.rs:248-249, and, outside the node's files, kernel/src/skp.rs:419-420 and kernel/tests/end_to_end.rs:386. (Raised by: the node's list, PLAN.yaml:3820.)

## Files read

- state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md: 1-62
- engine/README.md: 1-530
- kernel/README.md: 1-387
- PLAN.yaml: 3795-3834, 4400-4498; greps for node ids at 194, 816, 835-851, 2679, 3788, and for ResourceRef (850)
- state/consults/DRIFT-SWEEP-AREA-D-2026-10-10.md: 1-95
- state/consults/2026-10-10-drift-sweep-area-d-custodian-check.md: 1-133
- state/consults/2026-10-10-drift-sweep-area-e-custodian-check.md: 1-171
- state/directives/2026-10-10-drift-sweep-area-e-instructions.md: 1-24
- state/directives/2026-10-10-tier-obligation-open-item-and-adr-029.md: 1-9
- state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md: 1-41
- state/consults/2026-10-03-lead-data-pilot-setup-lead-data-report-1.md: 90-134, 298-327, 395-409; grep for C1a, C1b, C8
- state/consults/gates/2026-10-03-lead-data-pilot-setup-gate1-architect.md, gate2-architect.md, gate3-architect.md: grep for N1 and N2 (gate2 46, 78-79; gate3 62, 77-78)
- state/consults/2026-10-03-kernel-ticket-drop-followups-lead-data-index.md: 1-185
- state/consults/2026-10-11-crs-undeclared-message-wording-owners-index-update.md: 1-146
- engine/CRS-UNDECLARED-MESSAGE-WORDING-PREREGISTRATION.md: 200-244; grep for file lists (26, 142, 146, 232-234, 323-331)
- engine/src/lib.rs: 1-158
- engine/src/identity.rs: 1-130, 240-264
- engine/src/crs.rs: 1-50
- engine/src/geoparquet.rs: 1-90, 145-254, 583-592, 736-807, 855-894; grep for Proposed
- engine/src/dataset.rs: 395-429, 1012-1021, 1700-1759
- engine/src/envelope.rs: 142-183
- engine/src/attributes.rs: 30-109; greps for tests and mod tests
- engine/src/geoarrow.rs: 1-20
- engine/src/index.rs: 1-8
- engine/src/lod.rs: 1-30, 1228-1239; grep for writes and paths
- engine/src/stream.rs: grep for stream_projected_with_cancel and stream_for_publish
- engine/src: grep for Proposed
- engine/tests/identity.rs: 130-159
- engine/tests/admission_format_semantics.rs, engine/tests/session_identity.rs, engine/tests/lod_tier_builder.rs: fn-name greps
- engine/LOD-PREREGISTRATION.md: greps for ADR-005, tiers.json, ADR-031, eviction, hard precondition
- kernel/src/lib.rs: 1-120; grep for pub fn get
- kernel/src/skp.rs: 160-184, 415-422, 1165-1184, 2183-2192, 3575-3634; greps for build_tiers, catalog calls, test and module names, Not covered
- kernel/src: grep for Proposed
- kernel/src/bundle/mod.rs: grep for Proposed (3-5)
- kernel/src/publish/mod.rs: 38-67, 410-444, 570-704; grep for preflight, staging, Float32, Dictionary
- kernel/src/permission/mod.rs: 1-35
- kernel/src/permission/boundary.rs: 1-35
- kernel/PERMISSION-BOUNDARY.md: 1-40; grep for exposure
- kernel/CANCELLATION-AND-TRACING.md: 150-229; greps for headings and Proposed
- kernel/tests/end_to_end.rs: 370-489
- kernel: grep for preflight and staging test names
- frontends/shell/src-tauri/src: greps for binding_publish and boundary::execute; publish.rs 1796-1803; pool_poll.rs grep (12)
- docs/adr: Status-line greps for ADR-005, 013, 015, 016, 017, 018, 023, 024, 032, 034, 036; Amendment 1 headings of ADR-013, 015, 016; ADR-017 headings and 1108-1143; ADR-005 1-25
- docs/08_Testing.md: 1-20
- docs/10_SKP_Protocol.md: 28-39
- docs/11_Project_and_Resource_Model.md: 20-46
- KNOWN-LIMITATIONS.md: item-heading grep; grep for LOD
- scripts/plan/verify-mutation.test.mjs: 215-229
- repository greps (state/ excluded) for line cites into engine/README.md, kernel/README.md, engine/src/lib.rs, kernel/src/lib.rs and CANCELLATION-AND-TRACING.md; for the two area E test names; for inside_the_budget in PLAN.yaml, KNOWN-LIMITATIONS.md and kernel/README.md

*Custodian's filing note (2026-10-11): written by lead-data to this path (run 00:28:36Z to 00:36:27Z by its transcript; write audit PASS, one Write, to this path only: Grep 53, Read 59, Glob 2, Write 1, SubagentHandback 1). As written, its sha256 was c43ad4458cada8a463055db47adbe7c030d1559f17e5bc96cb5fec592b48ccb7. Nothing is changed by the custodian except this note, appended; every cite resolved at main by verify-cites before filing.*
