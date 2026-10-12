# PR #182 gate 1 — reviewer
Reviewed: main @ c4c251d46e55f2c7de557e88f48ec60c6eb453ad

**Verdict: PASS.** No Correctness or Evidence finding fails the gate. Five Documentation-and-record findings (DR-1 to DR-5) and two non-failing Evidence notes follow; the PR has merged, so the custodian routes each.

Scope: the merge commit c4c251d4 (first parent 55cd5884, second parent f13c7136, branch cut from ff6bdddc), reviewed in the worktree `C:/dev/wt/mp1`, detached. The form is `engine/MULTIPOLYGON-MP1-PREREGISTRATION.md` with Amendments 1 to 5, read whole. The human merged at 2026-10-06T10:11:06Z before this gate; that is recorded as a fact, not a finding. Every cargo command set `CARGO_TARGET_DIR=D:/wt-targets/mp1`, `CARGO_BUILD_JOBS=8` and `RUST_TEST_THREADS=8`; the two shared-machine checks passed before each heavy command (no busy marker, 0 exclusive holds). The worktree ends at c4c251d4 with an empty `git status --porcelain`.

## Correctness

None.

## Evidence

No failure. Two notes, no action owed beyond the closing record:

- **EV-n1 (the architect's E-n1, confirmed).** The E2E step MP' and Part S are unrun (worker report 2, deviation 4; worker report 3, step 7 generated F-1 only). KNOWN-LIMITATIONS item 33's "can be opened and drawn" rests on the real open (A-1, K-1), the decode of the engine's own F-1 batch (SH-1) and the per-part layer build (SH-8), not on a run of the app. The closing record lists MP' and Part S as unrun.
- **EV-n2.** At c4c251d4, §4's own mutation for G-1 and G-2 (select MultiPolygon for `[Polygon]`) still fails both tests by name, but before their golden comparison: G-1 at the instrument's row walk (`polygon_wire_golden.rs:75`, `expect("vertices")`), G-2 at the publish call, which K2 now refuses (`publish_partition_golden.rs:145`). The comparison itself was shown live at c4c251d4 by the golden commit's own recorded mutation (estimate `rows * 8` to `rows * 9`): G-1 failed at `polygon_wire_golden.rs:250` and G-2 at `publish_partition_golden.rs:190`, both the golden `assert_eq!`.

## Documentation and record (each to be routed; the PR has merged)

- **DR-1. C-n1 stands, unrecorded.** Two new `pub` items exceed §2 E3, whose binding line `engine/MULTIPOLYGON-MP1-PREREGISTRATION.md:81` reads `- No other new `pub` item. New builders and validators are `pub(crate)`.`:
  - `engine/src/geoarrow.rs:31` at c4c251d4: `pub const EXT_NAME_MULTIPOLYGON: &str = "geoarrow.multipolygon";`
  - `engine/src/envelope.rs:292` at c4c251d4: `    pub fn geometry_encoding(&self) -> GeometryEncoding {`
  - Both have product callers inside the crate only (`GeometryEncoding::as_str`, the wkb refusal text, `Dataset::geometry_encoding`, `TaggedBatch::assemble`, the stream's `Pending`); a grep of `kernel`, `protocol`, `renderer` and the shell's Rust finds no caller outside the engine. So §8 item 11 and the caller rule hold; the deviation from E3 is not recorded in any amendment. Remedy: a follow-up narrowing both to `pub(crate)`, or a deviation row in the closing record.
- **DR-2. P-5, by name, has a third unrecorded miss.** Against the base's set listed at d8276158 (ff6bdddc plus G-1 and G-2), the head's run set loses `skp_version_is_skp_0_8` and gains `skp_version_is_skp_0_9` (the W2 rename, disclosed in worker report 2's commit 4 item). Amendment 2 item 5.5 and Amendment 5 item 2 record the two extra ignored tests only. The rest of P-5 holds by name (section P-5 below). The closing record states the rename.
- **DR-3. L-1's recorded mutation names a failure point that does not reproduce.** Its comment (lines 1494 to 1495 of `engine/tests/lod_tier_builder.rs` at c4c251d4) says the build then succeeds on F-1 and the test fails at `expected a refusal`. Re-made at c4c251d4, the build is refused by the tier-size ceiling and the test fails at the `Err(other)` arm (line 1527): `expected engine.wkb, got declared ceiling engine.lod_tier_larger_than_source exceeded: limit 3518, saw 4300`. The test still fails by name, so the row's guard holds; the comment's description is wrong at the head.
- **DR-4. `engine/ADMISSION-RESULTS.md` names the wrong tree.** Its header says it was generated from the tree at fc346a8a, but the generator's #11, #12 and P1 edits were committed in 3c29bc67, so the run was on an uncommitted tree over fc346a8a. The re-run at c4c251d4 reproduces the file byte for byte except its two commit-id lines (header and Generator line), so the content is the generator's own output. Closing record item 7 should say which tree it was.
- **DR-5. §7's command is empty after the merge.** At c4c251d4, `git merge-base origin/main HEAD` is c4c251d4 itself, so the form's command counts 0 files. Closing record item 9 must name its range: `55cd5884..c4c251d4`, which equals `ff6bdddc..f13c7136` file by file, gives 4,654 lines (4,270 insertions, 384 deletions) over 88 files. That matches Amendment 4.

## The merged diff against the PR's diff

- `git diff 55cd5884 c4c251d4` and `git diff ff6bdddc f13c7136` (the PR's three-dot diff) touch the same 89 files, and each file's patch is byte-identical (per-file sha256 of both patches; 0 mismatches). Main's drift (ff6bdddc..55cd5884, 37 commits) shares no file with the PR and touches no Rust file. Exit 0.
- The PR is the eight commits named in the brief, in that order over ff6bdddc.
- **f13c7136 against D-4 and D-5** (3 files, 1 line each):
  - D-4: line 4 of `renderer/bundle-viewer/scripts/partition-encoding.test.mjs` now opens the quote with `"The viewer`, and its two retained spans match `docs/adr/ADR-034-geometry-type-admission-and-geoarrow-encoding-selection.md:128` byte for byte. Fixed.
  - D-5: `frontends/shell/MANUAL-WALKTHROUGH.md:1568` drops the amendment number; `protocol/skp/tests/conformance/AMBIGUITIES.md:17` now reads `minted at the merge of`. Fixed.
- **C-n1:** not fixed; DR-1.

## G-1 and G-2

- d8276158 contains only the four files the golden commit names (503 insertions, no product line).
- `git diff --quiet d8276158 c4c251d4 -- engine/tests/data/golden kernel/tests/data/golden`: exit 0. Tree ids identical at both commits (engine 301853d5bab0f2220b957dd2bc52561b5a0a0424, kernel 4934f79a8bfc772f3779ac0ceb0f97ba641b8df3). sha256: `polygon-wire.golden` d810e6a8659c82c322231d9c784e8d9fbb4e0f074bb325e3cebf1f94ddcab15d, `publish-partitions.golden` 5b10ddd64ca60db9009ab1453cf99098353e4a9b93bcf012dca089586b0c7e01, at both.
- The two test files changed after d8276158 in comments only (two recorded-mutation paragraphs, in 1b978ee5 and 5c3a9e09); the instrument code is unchanged.
- At d8276158, detached: `cargo test --workspace --locked --features spatial-engine/fixture --test polygon_wire_golden --test publish_partition_golden -- --exact the_polygon_only_wire_matches_the_golden_file the_published_partitions_and_manifest_match_the_golden_file`: exit 0, both ok.
- At c4c251d4: both ok inside the workspace run below.
- Every golden value in worker report 1's goldens section is present in the golden files.

## Mutations, each re-made at c4c251d4

Each was applied by script (each edit site asserted unique), the named test was run alone, and the tree was restored with `git checkout -- .` and checked empty by `git status --porcelain`. No `verify-mutation` run was made or used.

| row | mutation | test | failing assertion at c4c251d4 | recorded at | reproduces | reverted |
|---|---|---|---|---|---|---|
| E-1 | the part offset appended before the part's rings | `wkb::tests::a_multipolygon_row_keeps_its_three_offset_levels_exactly` | `wkb.rs:510`, "parts span one, two and one rings": left `[0, 0, 1, 3]`, right `[0, 1, 3, 4]` | d8276158 | yes | yes |
| E-2 | `read_ring` narrows each coordinate through `f32` | `wkb::tests::a_polygon_row_under_multipolygon_is_one_part_with_its_coordinate_bits_unchanged` | `wkb.rs:549`, the bit comparison | d8276158 | yes | yes |
| E-3 | the per-part type check disabled | `wkb::tests::each_unreadable_multipolygon_row_is_a_typed_refusal_naming_what_was_met` | `wkb.rs:485`, the refusal's placeholder-prefix assert, on `truncated: wanted 8 bytes at 94` | d8276158 | yes | yes |
| E-4 | `PolygonBuilder` accepts type 6 | `wkb::tests::the_polygon_builder_still_refuses_a_multipolygon_row` | `wkb.rs:630`, the placeholder-prefix assert, on `truncated: wanted 8 bytes at 101` | d8276158 | yes | yes |
| E-5 | each part's byte-order byte read and ignored | `wkb::tests::parts_with_mixed_byte_orders_decode_to_the_same_values` | `wkb.rs:673`, the first `unwrap`: part 1 read as type 50331648 | d8276158 | yes | yes |
| E-6 | the multipolygon validator accepts two list levels | `geoarrow::tests::the_multipolygon_storage_type_is_three_lists_deep_and_each_validator_refuses_the_others_array` | `geoarrow.rs:571`, the multipolygon validator's refusal of the polygon array | d8276158 | yes | yes |
| E-7 | `coordinate_values` returns the whole child buffer | `geoarrow::tests::coordinate_values_over_a_sliced_multipolygon_array_returns_the_slices_run_only` | `geoarrow.rs:608`, "one part of five vertices": left 50, right 10 | d8276158 | yes | yes |
| E-8 | the envelope key written as `EXT_NAME_POLYGON` | `envelope::tests::the_envelopes_geometry_encoding_equals_the_fields_extension_name_for_both_values` | `envelope.rs:621`, "the envelope key and the field's extension name are one value" | d8276158 | yes | yes |
| A-1 | the all-Polygon branch returns MultiPolygon | `a_declared_set_selects_the_encoding_or_is_refused_at_open` | `geometry_admission.rs:131` (F-8): left MultiPolygon, right Polygon | d8276158 | yes | yes |
| A-2 | the readable set joined with `, ` | `the_refusal_detail_is_the_sighted_wording_with_the_declared_list_rendered` | `geometry_admission.rs:159`, the byte-equal detail | d8276158 | yes | yes |
| A-3 | the phrase hard-coded to `Polygon` | `the_refusal_names_exactly_the_types_the_gate_admits_in_order` | `geometry_admission.rs:199`, "Decision 1: the readable set, in that order": left `["Polygon"]` | d8276158 | yes | yes |
| A-4 | an absent key read as `["Polygon"]` | `an_absent_key_is_multipolygon_with_no_declaration_and_a_non_string_member_is_refused` | `geometry_admission.rs:232`: left Polygon, right MultiPolygon | d8276158 | yes | yes |
| S-1 | the geometry offset appended once per part | `f1_and_f2_stream_one_row_per_feature_with_bit_identical_parts` | `multipolygon_stream.rs:123`, "a batch, not a refusal" (columns of unequal length) | d8276158 | yes | yes |
| S-2 | a refused row skipped (`continue` in place of `?`) | `a_row_of_an_unread_type_stops_the_stream_at_that_row_by_name` | `multipolygon_stream.rs:221`, "the stream ended cleanly; the unreadable row was skipped or accepted" | d8276158 | yes | yes |
| S-3 | estimate `(rows + vertices) * 4` to `rows * 4` | `every_multipolygon_batch_fits_its_target_under_the_unedited_estimate` | `multipolygon_stream.rs:384`, the target assertion: batch 0, 70836 B against 65536 B | d8276158 | yes | yes |
| S-3, per-batch | `read_ring`'s minimum 4 to 1, and the test's `square` one vertex | same | `multipolygon_stream.rs:371`, the per-batch assertion: batch 0, 65460 B against a share of 56724 B | fc346a8a | yes, same figures as worker report 2 | yes |
| G-1 | as A-1 (§4) | `the_polygon_only_wire_matches_the_golden_file` | `polygon_wire_golden.rs:75`, `expect("vertices")` (EV-n2) | d8276158 | fails by name; point not recorded | yes |
| G-1, G-2 extra | estimate `rows * 8` to `rows * 9` | both golden tests | `polygon_wire_golden.rs:250` and `publish_partition_golden.rs:190`, the golden `assert_eq!` | over ff6bdddc | yes | yes |
| BF-1 | F-1's first part side 2.0 to 2.5 | `the_committed_batches_equal_the_engines_output_from_a_real_open_and_stream` | `geoarrow_batch_fixtures.rs:105`, the multipolygon comparison | d8276158 | yes | yes |
| L-1 | `lod.rs` takes a MultiPolygon's first part | `build_tiers_refuses_a_multipolygon_feature_by_name_and_writes_no_tier` | `lod_tier_builder.rs:1527`, the `Err(other)` arm (DR-3) | d8276158 | fails by name; recorded point no | yes |
| C-12S | none applies (Amendment 2, item 1) | `streaming_corpus_row_12_whole_file_yields_one_row_per_feature_with_unique_ids`, run once unmutated | `multipolygon_corpus.rs:38`, "row #12 opens (§3's C-12)": `IdentityUnusable { column: "id", .. }`, as recorded | — | — | — |
| K-1, encoding | `describe_dataset` hard-codes `geoarrow.polygon` | `skp::tests::the_real_describe_geometry_carries_the_engines_encoding_for_each_open` | `skp.rs:3142`, "f1: describe.encoding" | 1b978ee5 | yes | yes |
| K-1, declared | `declared_types: None` | same | `skp.rs:3146`, F-1's `declared_types`: left None | 5c3a9e09 | yes | yes |
| K-2 | the check disabled | `a_multipolygon_encoded_dataset_refuses_at_preflight_by_name_before_any_pin_or_write` | `publish.rs:1925`, "f1: expected GeometryEncodingNotPublishable", got a later attribute refusal | 1b978ee5 | yes | yes |
| K-3 | the check moved above the degrees check | `a_degrees_multipolygon_dataset_still_refuses_as_the_degrees_dataset` | `publish.rs:1979`, "F-13 must refuse as the degrees dataset" | 1b978ee5 | yes | yes |
| K-4 | the code string changed | `a_geometry_encoding_refusal_detail_begins_with_its_typed_code` | `typed_terminal_codes.rs:434`, the code `assert_eq!` | 1b978ee5 | yes | yes |
| G-2 | as A-1 (§4) | `the_published_partitions_and_manifest_match_the_golden_file` | `publish_partition_golden.rs:145`, `unwrap` on `GeometryEncodingNotPublishable` (EV-n2) | 1b978ee5 | fails by name, at a different point (K2 now precedes it) | yes |
| K-5 | the check moved into `preflight` after `content_pin` | `publish::tests::a_multipolygon_encoded_dataset_reaches_prepare_refused_with_its_typed_code_before_any_pin_is_taken` (src-tauri) | `src-tauri/src/publish.rs:2770`, "a pin-free refusal must never take a pin as a side effect" | ac538440 | yes | yes |
| P-2, Rust | `skip_serializing_if` on an empty list | `declared_types_keeps_a_populated_list_and_round_trips_empty_as_empty_and_absent_as_null` | `fixtures.rs:506`, "an empty list: the key is present on the wire with its own value" | 5c3a9e09 | yes | yes |
| P-2, TS | the caller-asserted fixture's `declared_types` line removed | `describe fixtures carry declared_types, and an empty list and an absent key stay distinct (skp/0.9)` | `fixtures.test.ts:211`, the geometry key set | 5c3a9e09 | yes | yes |
| SH-1 | the multipolygon walked one level short | `the engine's F-1 batch decodes to its parts, partToRow, partCount and totalVertices (SH-1)` | `decodeBatch.test.ts:152`, part counts `[1, 1, 1]` against `[3, 1, 2]` | ac538440 | yes | yes |
| SH-2 | the encoding check deleted | `a mismatched, unknown or missing geometry_encoding throws UnexpectedEncodingError (SH-2)` | `decodeBatch.test.ts:179`, expected a throw | ac538440 | yes | yes |
| SH-3 | a part level read under `geoarrow.polygon` | `the engine's polygon batch gives one part per feature (SH-3)` | `decodeBatch.test.ts:214`, `[2, 1, 1]` against `[1, 1, 1]` (the hand-built polygon test failed with it) | ac538440 | yes | yes |
| SH-4 | the row taken as the ordinal | `an ordinal on row 1's part resolves row 1's id, and two parts of row 0 resolve identically (SH-4)` | `pick.test.ts:82`, a TypeError inside `resolvePick` | ac538440 | yes | yes |
| SH-5, buildLayers | `ids.length` to `checkPickCeiling` | `counts the pick ceiling in parts, not features, at this site (SH-5)` | `buildLayers.test.ts:131`, expected a throw (the ceiling test above failed with it) | ac538440 | yes | yes |
| SH-5, ResidentSet | `ids.length` to `checkPickCeiling` | same name, `residentSet.test.ts` | `residentSet.test.ts:42`, expected a throw | ac538440 | yes | yes |
| SH-6, extent | part 0 only | `a feature with two distant parts has one extent spanning both (SH-6)` | `extent.test.ts:49`, the extent | ac538440 | yes | yes |
| SH-6, average | part 0 only | `a feature with two distant parts has one extent spanning both parts, counted once (SH-6)` | `pickResolution.test.ts:76`, 1 against 100 | ac538440 | yes | yes |
| SH-7, trim | `partToRow` and `partCount` cut by feature count | `keeps features whole with all their parts, and partToRow, partCount and totalVertices agree` | `tileIngest.test.ts:425` | ac538440 | yes | yes |
| SH-7, dedupe | the source row kept in `partToRow` | `drops a duplicate whole and carries every part of the kept features` | `tileResidentSet.test.ts:59`, `[1, 1, 1, 2]` against `[0, 0, 0, 1]` | ac538440 | yes | yes |
| SH-8 | one datum per feature | `builds one datum per part with the style's fill, and an outline holding every ring of every part` | `buildLayers.test.ts:183`, 2 datums against 3 | ac538440 | yes | yes |
| SH-9 | `null` rendered as `[]` | `an empty list and an absent key render distinctly, each as a labelled placeholder` | `DescribeSummary.test.tsx:66`, the distinctness assert | ac538440 | yes | yes |
| V-2 | the viewer's encoding check disabled | `the engine’s multipolygon batch, offered as a partition, is refused at the encoding check` | the state assert: actual `partition-decode-failed` | ac538440 | yes | yes |
| E2E | operator-run, no mutation | — | unrun (EV-n1) | — | — | — |

Three runs were aborted by host memory exhaustion before any test ran or completed (the first E-7 build, os error 1455; the first A-4 link, LNK1102; the first G-1 mutation run, an allocation failure, exit 0xc0000409). None is an observation; each was re-run once and the table gives the re-run.

## §7

- The form's command at c4c251d4: 0 files (DR-5).
- `55cd5884..c4c251d4` and `ff6bdddc..f13c7136`, with the form's two exclusions: 88 files, 4,270 insertions, 384 deletions, 4,654 lines. 228bd997 gives the same; f13c7136's three one-line edits fall on lines the branch added.
- By group, recounted per file: engine product 1,190 over 8; engine tests 1,258 over 10; kernel 620 over 11 (588 for the 8 listed); protocol 271 over 20; shell product 369 over 15; shell tests and seams 858 over 20; docs 88 over 4. All match Amendment 4.
- Class 8 is Amendment 4. The form's §0 to §9 hash the same at 1bf49b25 and c4c251d4, and every later form commit has 0 deleted lines.
- Amendment 5 item 3's figures recompute: 25/13 and 33/1 (5c3a9e09..228bd997); 403 and 250 lines; 74 + 65 = 139 comment lines.

## Hashes

- 93 `path:line @ rev sha256` pins in the form, every one recomputed over LF bytes: 93 match, 0 mismatch. With the reports, the amendment-2 draft and `KNOWN-LIMITATIONS.md` (its three b391e436 pins included): 98 match, 0 mismatch.
- Unpinned hashes in the amendments:
  - round 59's line 9 at ff6bdddc: 45dd049f…, match;
  - round 61's line 6 at 7ce9dab2: 5c3e3090…, match;
  - the governance workflow's lines 149 to 150 at e286a5c3: 1175f493…, match;
  - the impact read: 6e4faa93…, match at 15bf4441 (the file is not tracked at 2d4fa886, where the header says it was read).
- Worker reports, from line 5 to the end:
  - reports 2, 3 and 4 match their filing notes (2087b714…, e7bf4bbd…, f38b57cb…);
  - report 1's 919643f6… matches the version at e286a5c3, before its de-root, as its note says.
- The goldens: as above. The F-1 file: 93f572358e5ecdf0cac05b1620bec4ce53ed9ba6b6bdc32c8c0c9a02d415ceaf, 3518 bytes, matching worker report 3.

## V-1, against the lock

- `frontends/shell/package-lock.json:476-477` pins `@deck.gl/layers` 9.3.9, unchanged since 15bf4441. The installed package reads 9.3.9.
- `dist/solid-polygon-layer/solid-polygon-layer.js` encodes the datum index (or `__source.index`) as the picking colour. `dist/solid-polygon-layer/polygon.js` `normalize` takes one datum as one polygon, ring 0 outer, the rest holes.
- P-4 holds; I-3 does not fire.

## `engine/ADMISSION-RESULTS.md`

- Re-run: `cargo test --workspace --locked --features spatial-engine/fixture --test admission_p4_corpus -- --ignored --exact the_p4_admission_table_runs_against_the_preregistered_corpus_and_writes_admission_results`, exit 0.
- The output differs from the committed file in its two commit-id lines only (DR-4). The file was restored.
- Row #12 is the recorded deviation (Amendment 2, item 1). P1 is #2, #4 and #5, borne out. #11 is admitted-as-declared, session-ordinal, sanity none (C-11).
- Against 55cd5884, the only changes are #2, #4 and #5's refusal text, #11, #12, the counts and the boundary-8 line.

## The index lines

- All 13 replacement lines in lead-data's update are present byte for byte. The numstat is 7/7 (engine) and 6/6 (kernel); nothing else changed. The sections are 33 and 38 lines, within 60.
- Every new pointer resolves at c4c251d4: A-1 at `engine/tests/geometry_admission.rs:91`; S-1 at `engine/tests/multipolygon_stream.rs:149`; G-1 at `engine/tests/polygon_wire_golden.rs:247`; L-1 at `engine/tests/lod_tier_builder.rs:1505`; K-1 at `kernel/src/skp.rs:3035`; K-2 at `kernel/tests/publish.rs:1883`.
- The three engine Open-and-admission items beyond the form's list resolve as `pub` items with product callers: `spatial_engine::GeometryEncoding` (re-exported at `engine/src/lib.rs:125`), `Dataset::geometry_encoding` (`engine/src/dataset.rs:964`) and `Dataset::declared_geometry_types` (`engine/src/dataset.rs:973`). They sit inside a listed row (§8 item 18 holds) and are accurate; I see no reason to strike them.
- `Last verified at: 3c29bc67` remains true: no later commit changed an engine or kernel pointer.

## The F-1 generator

- `cargo test --workspace --locked --features spatial-engine/fixture --test manual_walkthrough_fixtures -- --ignored --exact generate_the_multipolygon_f1_fixture --nocapture`: exit 0, 1 passed, 3 features.
- `git check-ignore` gives `.gitignore:2`. The porcelain stayed empty.

## §8, item by item

1. Pass. The golden commit has no product line. The goldens are byte-identical. G-1 and G-2 are green at d8276158 and c4c251d4.
2. Pass. The encoding is chosen once (`engine/src/dataset.rs:368`). The envelope writes the key and the field from it, `describe` reads it, and `TaggedBatch::assemble` validates against it. E-8, K-1 and A-1 are live.
3. Pass. S-1 is live.
4. Pass. SH-5 is live at both sites.
5. Pass. Both `<dt>`s are labelled P6 placeholders, and no text calls the encoding the file's type. SH-9 is live.
6. Pass. S-2 is live.
7. Pass. The detail matches `state/consults/2026-09-24-multipolygon-assessment.md:206` across its `[...]`. A-2 and A-3 are live.
8. Pass. Every new string carries `[P6 placeholder]`, except deviation 9's existing EWKB text and the sighted wording. No message states another module's consequence.
9. Pass. K-2, K-3 and K-5 are live.
10. Pass. The diff has no file under `docs/adr/`, no `engine/src/lod.rs`, no `protocol/data-plane/` and no `engine/ADMISSION-PREREGISTRATION.md`. `estimate_bytes`' body is unchanged (doc only). `format_declaration`'s values are unchanged.
11. Pass on the caller rule; DR-1 for E3.
12. Pass. Only ac538440 changes `SKP_VERSION`, with both sides' fixtures in it. The `skp/0.9` entry is last in §8, before §9.
13. Not applicable (ruled).
14. Pass. No zero-copy, number or timing assertion.
15. Pass. L-1 takes the LOD `cfg_attr(not(windows), ignore = …)` precedent. C-12S, the BF writer and the F-1 generator are plain ignores.
16. Pass: the overrun is class 8 (Amendment 4) and §7 is unedited; no scope addition is uncleared; no `verify-mutation` run is called an observation; branch spans are named in words with commit ids, and every pin is at a main commit; no five-line form exists.
17. Pass. D-4 is fixed. "LOD stays out" matches ADR-034's line 135. There is no line cite into the ledger and no bare self-line.
18. Pass.

## P-5, by name

- Listed with `cargo test --workspace --locked --features spatial-engine/fixture -- --list` (and `--ignored`) at d8276158 and c4c251d4, exit 0 each.
- **Run set.** Base 847, head 869. The head adds 21 of §4's tests plus the renamed version test, and drops `skp_version_is_skp_0_8` (DR-2).
- **Ignored set.** Base 40, head 43. The three added are `streaming_corpus_row_12_whole_file_yields_one_row_per_feature_with_unique_ids` (C-12S), `regenerate_the_committed_batches` and `generate_the_multipolygon_f1_fixture`, as Amendments 2 and 5 record. None was removed. L-1 runs on Windows.

## Suites and CI, with exit codes

All suite runs are at c4c251d4 on Windows, unless marked.

| command | exit | result |
|---|---|---|
| `cargo test --workspace --locked --features spatial-engine/fixture` | 0 | 869 passed, 0 failed, 43 ignored |
| `cargo fmt --all --check` | 0 | |
| `cargo fmt --manifest-path frontends/shell/src-tauri/Cargo.toml --all --check` | 0 | |
| `cargo clippy --workspace --locked --all-targets --features spatial-engine/fixture` | 0 | 73 warning lines; by `git blame`, none on a line from the PR's eight commits |
| `cargo test --manifest-path frontends/shell/src-tauri/Cargo.toml --locked` | 0 | 66 + 2 passed |
| shell `npm test` (vitest) | 0 | 1113 passed |
| shell `npx tsc --noEmit` | 0 | |
| viewer `node --test "scripts/**/*.test.mjs"` | 0 | 81 pass |
| `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"` | 0 | 450 pass |
| `node scripts/plan/verify.mjs` | 0 | PASS |
| `node scripts/plan/verify-cites.mjs` | 0 | PASS, 1424 files |
| `node scripts/plan/verify-quotes.mjs` (default mode) | 0 | PASS: 121 checked, 90 verified, 30 baselined, 1 advisory |
| `node scripts/plan/verify-test-claims.mjs` | 0 | PASS |
| `node scripts/plan/queue.mjs --check`, `node scripts/plan/site.mjs --check` | 0, 0 | current |
| G-1 and G-2 at d8276158 (command above) | 0 | both ok |
| C-12S, run once unmutated | 101 | as recorded (Amendment 2, item 1) |
| `gh pr checks 182` | 0 | 15 checks pass, all on f13c7136 (runs 37425068926 and 37425073231 read back `headSha` f13c7136) |
| `gh run list --commit c4c251d46e55f2c7de557e88f48ec60c6eb453ad` | 0 | 7 runs, all success: Product CI (Rust workspace, shell, bundle viewer), Governance CI, Rust fmt, Exposure scan, Pages |

Every suite run left the porcelain empty. No command was a repeated evidence run, so `scripts/evidence/repeat.mjs` was not used.
