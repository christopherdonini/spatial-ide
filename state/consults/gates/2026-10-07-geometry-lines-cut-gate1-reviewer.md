# PR #188 gate 1 — reviewer
Reviewed: cut/geometry-lines-cut @ e89bf9bf6c2c90965ff75a7fd892bc7b1bae3d40

**Verdict: PASS.** No Correctness finding and no Evidence finding. Three Documentation findings (D-1 to D-3) are must-fix in this pull request before the merge; under the proportional-gates rule (the product-first direction, section 2) they cause no correction round and no re-gate.

Base B 6f4cc949fe42ff7bd16a8cd74f7c674ba8e10f54 (`git merge-base origin/main e89bf9bf`). Diff read with `origin/main...origin/cut/geometry-lines-cut` (52 files). The governing form is `engine/GEOMETRY-LINES-PREREGISTRATION.md` as on main at a615ec2a, with Amendments 1 to 3 (generation 4), read last amendment first; worker reports 1 to 3 read. Worktree `C:/dev/wt/lines-rev`, left detached at e89bf9bf with an empty porcelain.

## Correctness

None.

What was checked, briefly: the two builders' strict decode (type codes, EWKB flags on header and part, fewer than 2 positions, zero parts, trailing bytes, truncation, no allocation from a count, a refused row appends nothing); the storage types, builders, validators and the `coordinate_values` linestring arm (slice-relative); admission order (E-L2 checks 1 to 8) and the kinds-present detail (kinds replaced before the declared list is inserted, so a declared name cannot be rewritten); the `GeometryBuilder` arms; the unedited `estimate_bytes`; K2 unchanged and reached for both line encodings; the shell decode keyed on the encoding string; one pickable `PathLayer` per batch, `checkPickCeiling(batch.partCount)` before the kind branch, the non-pickable casing whose id never resolves to a batch; the cache under batch identity and origin with `frame.toLocal` in f64 (ADR-010 rule 3); `resolvePick` unchanged. No JSON on a data path (K-L1 reads the shared describe fixture's key set in a test only). No CRS assumption, no new `cfg`, no new `pub` item beyond `GeometryEncoding`'s variants and E-L9's feature-gated helpers (the `fixture` module is `#[cfg(feature = "fixture")]`). No other encoding consumer exists in `kernel/src`, `protocol`, `renderer/src` or `frontends/shell/src-tauri` (grep), and in the shell only `decodeBatch`, `buildLayers`, `pickResolution` and `WorkingCanvas` read the kind.

SH-L4's two wiring sites, read at e89bf9bf: the settle re-pick's `pickCandidateAt` (lines 1186 to 1190 of `frontends/shell/src/canvas/WorkingCanvas.tsx` at e89bf9bf) passes `radius` only when `pickingRadiusFor` returns a value, and its comment no longer says the radius is unchanged; the `Deck` construction (lines 1903 to 1909 of the same file at e89bf9bf) spreads `pickingRadius` only when defined. `geometryKindRef` is fixed per mount because `App` keys `WorkingCanvas` by `admitted.dataset`, and the deck-init effect runs after that ref is set, so a line open's `Deck` is built with the radius. A polygonal or point open sets neither (§8 item 19).

## Evidence

None.

- **§6 at the base (6f4cc949) and at the head (e89bf9bf).** G-1 `the_polygon_only_wire_matches_the_golden_file`, G-2 `the_published_partitions_and_manifest_match_the_golden_file`, BF-1 `the_committed_batches_equal_the_engines_output_from_a_real_open_and_stream` and BF-P `the_committed_point_batch_equals_the_engines_output_from_a_real_open_and_stream`: each run alone at the base, all ok; all ok inside the head workspace run. The five files of the points form's Amendment 5, item 4 have equal sha256 at base and head (d810e6a8…, 5b10ddd6…, d0afe93e…, 831eb540…, 10c17431…, each equal to the value that amendment records). The default fixture's sha256 70e88947bbff25ba57a5c1b36021829003f0c58c8c731edb08d9483b2b7ce0de is the golden's first line, and G-1 asserts it at both commits. BF-L 6b4f03b16b3cf18592b33e883d0fe75dd821c50f8f0d980a647d05d368c24120 and BF-ML 31f10a83c62623bac4c7a18fc5b7844939a529823ca5b094e253b86fd980b1f5 equal the engine's output (BF-L's test ok at the head).
- **PL-2 holds.** The P4 generator (`admission_p4_corpus`, ignored test, run at e89bf9bf: 17 rows opened, 0 unrun, 2 DEVIATION rows) rewrote `engine/ADMISSION-RESULTS.md`; its diff against the committed file is lines 2 and 8 only, and replacing e89bf9bf6c2c90965ff75a7fd892bc7b1bae3d40 with 0a6324e09e64baa3cf6bc3c38ee9ee1b721dbee3 in the re-run makes it byte-identical (`diff` rc 0). The generated-date line is the same date. Not committed; the file was restored with `git checkout`.
- **PL-5 holds, by name** (from `cargo test --workspace … -- --list` at both commits, `-- --list --ignored` at the base, and the head run's own statuses). Run set: base 885, head 903. Added: the 9 LE unit tests, `a_declared_line_set_selects_the_line_encoding_and_other_sets_are_refused`, `a_set_that_mixes_kinds_names_the_kinds_present_in_the_ruled_order`, the three `line_stream` tests, `the_committed_line_batches_equal_the_engines_output_from_a_real_open_and_stream`, `build_tiers_refuses_a_linestring_feature_by_name_and_writes_no_tier` (runs on Windows), `the_real_describe_of_a_line_open_is_its_line_encoding_with_the_shared_key_set`, `a_line_encoded_dataset_refuses_at_preflight_by_name_before_any_pin_or_write`, and `skp_version_is_skp_0_11`; removed: `skp_version_is_skp_0_10` only. Ignored set: base 50, head 54; added exactly `generate_the_line_l1_fixture`, `generate_the_multilinestring_ml1_fixture`, `generate_the_declared_geometrycollection_fixture`, `generate_the_declared_polygon_and_linestring_fixture`; none removed.
- **§7 by its command** (`git diff --numstat 6f4cc949 e89bf9bf -- . ':!engine/GEOMETRY-LINES-PREREGISTRATION.md'`): 3,561 lines (3,326 insertions, 235 deletions) over 52 files, against 3,750 over 66. Groups: engine product 1,220 over 6 files (ceiling 950, over by 270); engine tests 960 over 6 files, two binary (ceiling 900, over by 60); kernel 307 over 4 (420); protocol 221 over 17 (260); shell product 242 over 7 (400); shell tests and seams 521 over 9, `admission/admitDataset.test.ts` counted as a TS literal test (600); docs 90 over 3 (220). The two engine overruns are those Amendments 2 (item 6) and 3 (item 7) record. §7 is unedited (the branch does not touch the form). See D-2.
- **Every hash recomputed.** The form on main at a615ec2a carries 78 distinct `path:line @ rev sha256:hex` pins (at 0053ced0, and one at 6030dfd2814b); each recomputed over the cited whole lines with `git show <rev>:<path> | sed -n '<a>,<b>p' | sha256sum`: 78 match, 0 mismatch. Amendment 1's five directive hashes (lines 6, 7, 8 to 10, 11 and 12 of `state/directives/2026-10-07-round-63-and-64-rulings.md` at 6f4cc949, the commit that adds it) match. Amendment 2's worker report 1 hash (line 5 to the end, at 6079bca4, the commit that adds it) matches, and so do reports 2 (at 5924956c) and 3 (at 7dd0315d) against their filing notes; all four commits are on main.
- **V-L against the lock.** `frontends/shell/package-lock.json` resolves `@deck.gl/layers` and `@deck.gl/core` 9.3.9; `npm ci` in this worktree installed 9.3.9 of both. Read in the installed sources: `instancePickingColors` encodes the datum index (`path-layer.ts`); `normalizePath` flattens nested pairs, and with no grid resolution one datum is one path (`path.ts`, `path-tesselator.ts`); `widthUnits` (default meters), `jointRounded` and `capRounded` exist; `Deck`'s `pickingRadius` (default 0) feeds the hover pick request; `pickObject` takes `radius`, default 0. V-L holds (I-2 does not apply).
- **The owner's indexes against the diff.** `engine/README.md`: Last verified at, Open and admission (+ A-L1), Viewport stream (+ S-L1), LOD tier builder (+ L-L), Governed by (+ this form), Declared limits (item 34 removed), as §2 lists; section 33 lines. `kernel/README.md`: Last verified at, SKP v0 host (+ K-L1), Publish (+ K-L2), kernel halves (+ this form); section 38 lines. Every pointer added names a test that exists at e89bf9bf. Both within 60 lines (§8 item 18).
- **Mutations: all 32 re-made at the head, each test run alone by name, each failed at its recorded assertion, each reverted** (table below). No `verify-mutation` run was used.
- **Suites and CI: all green** (commands below).

## Documentation (each must-fix in this pull request before the merge)

- **D-1. The branch does not merge cleanly with main.** `git merge-tree --write-tree origin/main e89bf9bf` (origin/main a615ec2a) exits 1 with content conflicts in `protocol/skp/SKP-V0.md` (§8's end: main's dated note for `kernel-close-races-followups` against this branch's `skp/0.11` entry) and `kernel/README.md` (the Governed-by preregistration lines, which main also edited); `kernel/src/skp.rs` auto-merges. The resolution must leave the `skp/0.11` entry last before §9 (§2 W-L3; §8 item 12) and keep both sides' index additions. The resolved head is not the reviewed head, so the merge commit's suites and CI are read before the merge (round 68). No pull_request-event workflow (DCO, exposure scan) has run on #188: the four checks it shows are branch-update runs at e89bf9bf.
- **D-2. The class 8 record is not yet made.** Amendment 2, item 6 and Amendment 3, item 7 defer it to the gated head; e89bf9bf is that head. Record engine product 1,220 against 950 and engine tests 960 against 900 as class 8 (round 25; §8 item 16), by reference, before the merge. §7 stays unedited.
- **D-3. Two hash references carry no explicit rev.** Amendment 1 (the directive's lines 6 to 12) and Amendment 2 (worker report 1) pin their hashes at the commit that adds the file, with no `@ <rev>`; round 15, item (e) asks for an explicit rev at a commit on main. Both resolve (6f4cc949 and 6079bca4, on main) and every hash matches; the closing record names the two revs.

## Noted, no change asked

- KNOWN-LIMITATIONS item 31's new mixed-kinds sentence is correct as a list of three kinds (polygonal, point, line), but can be read as refusing Polygon with MultiPolygon, which the engine admits. It is draft wording for the human's P6 sight.
- `estimate_bytes`' new doc sentence for a multilinestring holds for every batch of two or more rows; a single-row batch of one 2- or 3-vertex part carries two offset entries more than the term covers (8 B). S-L3 asserts the share for every batch of its fixture and passes. Same shape as the existing polygon sentence.

## Mutations (each at e89bf9bf on the uncommitted tree, test run alone by name, then reverted with `git checkout` and the porcelain checked empty)

| row | test | mutation | failing assertion (run output) | reverted |
|---|---|---|---|---|
| LE-1 | `a_linestring_row_is_its_positions_in_order_with_bits_unchanged` | in `read_line`, narrow x through `f32` | `x then y, in order, bits unchanged` (line 1128 of `engine/src/wkb.rs` at e89bf9bf) | yes |
| LE-2 | `each_unreadable_linestring_row_is_a_typed_refusal_naming_what_was_met` | the type-2 check made `false && …` | `expected a typed Wkb refusal, got Ok(())` (line 1089, `line_refusal`) | yes |
| LE-3 | `a_big_endian_linestring_decodes_to_the_same_values` | `r.little = true` after `Reader::new` | first `unwrap`, Err naming WKB geometry type 33554432 (line 1215) | yes |
| LE-4 | `a_linestring_of_fewer_than_two_positions_is_refused_and_two_is_admitted` | `n_pts < 2` to `n_pts < 1` | `expected a typed Wkb refusal, got Ok(())` (line 1089) | yes |
| LE-5 | `a_multilinestring_row_keeps_its_parts_and_a_linestring_row_is_one_part` | the part step also appends a geometry offset | `one offset per row, in parts: rows of 2, 1, 3 and 1 parts`, left [0,1,2,2,3,3,4,5,6,6,7,7], right [0,2,3,6,7] (line 1280) | yes |
| LE-6 | `each_unreadable_multilinestring_row_is_a_typed_refusal_and_mixed_byte_orders_decode` | the part-type check made `false && …` | `expected a typed Wkb refusal, got Ok(())` (line 1104, `multiline_refusal`) | yes |
| LE-7 | `the_line_storage_types_are_one_and_two_lists_deep_and_each_validator_refuses_the_others_array` | the linestring validator also accepts a second list level | `matches!(validate_linestring_encoding(not_lines), Err(EngineError::EncodingMismatch { .. }))` (line 1078 of `engine/src/geoarrow.rs` at e89bf9bf) | yes |
| LE-8 | `coordinate_values_over_a_sliced_line_array_returns_the_slices_run_only` | linestring arm reads `0..hi * 2` | `one line of three positions`, left 10, right 6 (line 1132) | yes |
| LE-9 | `a_line_envelopes_geometry_encoding_equals_the_fields_extension_name` | the envelope writes `EXT_NAME_POLYGON` as the key | `the envelope key and the field's extension name are one value`, left geoarrow.polygon, right geoarrow.linestring (line 803 of `engine/src/envelope.rs` at e89bf9bf) | yes |
| A-L1 | `a_declared_line_set_selects_the_line_encoding_and_other_sets_are_refused` | E-L2 check 6 deleted | L-1's encoding, left MultiLineString, right LineString (line 461 of `engine/tests/geometry_admission.rs` at e89bf9bf) | yes |
| A-L2 | `a_set_that_mixes_kinds_names_the_kinds_present_in_the_ruled_order` | the span replaced by `MIXED_KINDS_SPAN` unconditionally | the `["Polygon","LineString"]` case: names polygonal and point, expected polygonal and line (line 605); A-P2 `a_set_that_mixes_kinds_is_refused_with_the_rulings_placeholder_detail` run alone under the same mutation: ok | yes |
| A-1 (changed) | `a_declared_set_selects_the_encoding_or_is_refused_at_open` | the all-Polygon branch returns MultiPolygon | F-8's encoding, left MultiPolygon, right Polygon (line 169) | yes |
| A-2 (changed) | `the_refusal_detail_is_the_sighted_wording_with_the_declared_list_rendered` | `join_phrase` joins the last item with a comma | first detail `assert_eq`, ending `LineString, MultiLineString` against `LineString and MultiLineString` (line 216) | yes |
| A-3 (changed) | `the_refusal_names_exactly_the_types_the_gate_admits_in_order` | `readable_set_phrase` returns a fixed `Polygon` | `the phrase rule's last member` (line 272) | yes |
| A-P1 (changed) | `a_declared_point_set_selects_the_point_encoding_and_other_sets_are_refused` | the all-Point branch deleted | P-1's open `unwrap` on the mixed-kinds GeoMetadata refusal (line 361) | yes |
| S-L1 | `l1_and_ml1_stream_one_row_per_feature_with_bit_identical_positions_and_parts` | `read_line` appends y before x | `assert_eq!(got, want)` of L-1, every pair swapped (line 219 of `engine/tests/line_stream.rs` at e89bf9bf) | yes |
| S-L2 | `a_row_of_an_unread_type_stops_a_line_stream_at_that_row_by_name` | the producer loop skips a refused row | `the stream ended cleanly; the unreadable row was skipped or accepted` (line 309) | yes |
| S-L3 | `every_line_batch_fits_its_target_under_the_unedited_estimate` | `vertices * 16` to `vertices * 4` in `estimate_bytes` | s-l3-lines batch 0: 126968 B of geometry and ids exceed its 65536 B target (335 rows) (line 497) | yes |
| BF-L | `the_committed_line_batches_equal_the_engines_output_from_a_real_open_and_stream` | `linestring_batch` layout step 10.0 to 10.5 | `lv95-linestring-batch.arrows no longer equals the engine's linestring batch` (line 207 of `engine/tests/geoarrow_batch_fixtures.rs` at e89bf9bf) | yes |
| BF regenerator (changed) | `regenerate_the_committed_batches` (ignored), then BF-1 alone | the polygon batch written to the multipolygon file name | BF-1: `lv95-multipolygon-batch.arrows no longer equals the engine's multipolygon batch` (line 164); source reverted, regenerator re-run, all five files byte-identical (porcelain empty) | yes |
| L-L | `build_tiers_refuses_a_linestring_feature_by_name_and_writes_no_tier` | the LineString arm of `geometry_type_name` names Polygon | `the refusal names the type met: feature 0: expected a Polygon, found Polygon` (line 1665 of `engine/tests/lod_tier_builder.rs` at e89bf9bf) | yes |
| K-L1 | `the_real_describe_of_a_line_open_is_its_line_encoding_with_the_shared_key_set` | `as_str` gives `EXT_NAME_POLYGON` for LineString | `l1: describe.encoding`, left geoarrow.polygon, right geoarrow.linestring (line 3323 of `kernel/src/skp.rs` at e89bf9bf) | yes |
| K-L2 | `a_line_encoded_dataset_refuses_at_preflight_by_name_before_any_pin_or_write` | K2 refuses only `geoarrow.multipolygon` | `l1: expected GeometryEncodingNotPublishable`, fell through to the `zone`-attribute refusal (line 2115 of `kernel/tests/publish.rs` at e89bf9bf) | yes |
| W-L2 | `skp_version_is_skp_0_11` | the literal back to `skp/0.10` | `assert_eq!`, left skp/0.10, right skp/0.11 (line 470 of `protocol/skp/tests/fixtures.rs` at e89bf9bf) | yes |
| SH-2 (changed) | `a mismatched, unknown or missing geometry_encoding throws UnexpectedEncodingError (SH-2)` | the throw replaced by `void 0` | first assertion, the multipolygon batch under a polygon expectation: `expected function to throw an error, but it didn't` (line 198 of `frontends/shell/src/canvas/decodeBatch.test.ts` at e89bf9bf) | yes |
| SH-L0 | `geometryKindOf maps both line encodings to line and the others as before (SH-L0)` | multilinestring maps to polygonal | `expected 'polygonal' to be 'line'` (line 325) | yes |
| SH-L1 | `the engine's line batches decode to one path per part, partToRow, partCount and totalVertices, bits unchanged (SH-L1)` | the line branch disabled | `expected [ …(2) ] to have a length of 1 but got 2` (line 354) | yes |
| SH-L2 | `a line batch gives one pickable PathLayer … (SH-L2)` | the line branch of `buildLayers` not taken | `expected SolidPolygonLayer{ …(6) } to be an instance of PathLayer` (line 368 of `frontends/shell/src/canvas/buildLayers.test.ts` at e89bf9bf) | yes |
| SH-L2c | `a line batch's data is reference-stable at an unchanged origin and recomputed after a recenter (SH-L2c, the cache rule)` | the cache hit in `pathsForBatch` deleted | `expect(second).toBe(first)`, Object.is equality (line 446) | yes |
| SH-L3 | `an ordinal on a line part resolves that part's row, and two parts of one feature resolve identically (SH-L3)` | `resolvePick` indexes `ids` by the ordinal | `expected 2n to be 1n` (line 155 of `frontends/shell/src/canvas/pick.test.ts` at e89bf9bf) | yes |
| SH-L4 | `selects the average feature extent for a line open and gives the radius for a line open only` | `pickingRadiusFor` returns the radius for any kind but point | `expected 4 to be undefined` (line 515 of `frontends/shell/src/canvas/pickResolution.test.ts` at e89bf9bf) | yes |
| V-T-L | the linestring and the multilinestring test, each run alone | the `geometry_encoding` check in `decodePartition` made `if (false)` | linestring: `e.state` actual `partition-decode-failed`, expected `envelope-encoding-mismatch`; multilinestring: `Missing expected exception` | yes |

Every failure matches the assertion the test's own comment and the worker reports record.

## Commands (at e89bf9bf unless named; held means inside `hold shared -Project SpatialIDE`; every hold was granted and no exit code 96 to 99 appeared)

| command | held | rc | result |
|---|---|---|---|
| `cargo test --workspace --locked --features spatial-engine/fixture` | yes | 0 | 903 passed, 0 failed, 54 ignored, 99 binaries |
| `cargo test --workspace --locked --features spatial-engine/fixture -- --list` | yes | 0 | 957 tests |
| `cargo fmt --all --check` | no (light) | 0 | clean |
| `cargo clippy --workspace --all-targets --locked --features spatial-engine/fixture` | yes | 0 | 44 distinct warning sites; none on a line that `git diff -U0 6f4cc949 e89bf9bf` adds to a Rust file (2,428 added lines intersected) |
| `cargo test --workspace … --test admission_p4_corpus -- --ignored --nocapture` (PL-2) | yes | 0 | see Evidence |
| 26 single-test cargo runs under the Rust mutations (`-p spatial-engine`, `-p spatial-kernel`, `-p spatial-skp`, with `--features spatial-engine/fixture` where the crate takes it) | yes, one hold each | 101 for each mutated test; 0 for A-P2 and both regenerator runs | table above |
| at 6f4cc949: `cargo test --workspace … -- --list`, then `-- --list --ignored`, then G-1, G-2, BF-1 and BF-P each alone | yes, one hold each | 0 each | 935 tests, 50 ignored; four instruments ok |
| `npm ci` in `renderer/bundle-viewer`, then in `frontends/shell` | yes | 0, 0 | installed |
| `npm test` in `frontends/shell` | yes | 0 | 73 files, 1,125 tests passed |
| `npx tsc --noEmit` in `frontends/shell` | no (light) | 0 | clean |
| `node --test` over the viewer scripts glob in `renderer/bundle-viewer` | yes | 0 | 84 passed, both V-T-L tests among them |
| `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs` | yes | 0 | 450 passed |
| `node scripts/plan/verify.mjs` | no | 0 | PASS |
| `node scripts/plan/queue.mjs --check` | no | 0 | current |
| `node scripts/plan/site.mjs --check` | no | 0 | current |
| `node scripts/plan/verify-cites.mjs` | no | 0 | PASS, 1,464 files, 34 loose advisories |
| `node scripts/plan/verify-quotes.mjs` | no | 0 | PASS, 121 checked, 90 verified, 30 baselined, 0 hash-reference errors |
| `node scripts/plan/verify-test-claims.mjs` | no | 0 | PASS, 502 claimed tests |
| `npx vitest run <file> -t <name>` and `node --test --test-name-pattern=<name> <file>` under the 8 shell and viewer mutations | no (seconds each) | 1 each | table above |
| `gh pr checks 188` | no | 0 | below |

`gh pr checks 188`, every line, the URL column omitted:

- L1 portable correctness · cargo test --workspace (ubuntu-24.04) | pass | 4m53s
- cargo test --workspace (windows-latest) | pass | 12m53s
- tauri build (NSIS, build-only, no signing) / tauri build (NSIS, build-only, no signing) | pass | 4m33s
- typecheck · build · vitest · cargo test | pass | 7m14s

The two runs behind them (Product CI — Rust workspace, Product CI — shell) ran on the branch-update event at e89bf9bf6c2c90965ff75a7fd892bc7b1bae3d40. The shell job runs `cargo test --manifest-path frontends/shell/src-tauri/Cargo.toml --locked`, which covers §9's `src-tauri` tests; I did not run them locally (not in the brief's list). Governance CI last ran at 26d4ccc0 and the bundle-viewer CI at ba648a9a, both success.

## Disclosures

- One held call had a shape slip: a scratch-log `echo` ran before the hold step in the same Bash call (the A-2 mutation run). The held command itself was one command.
- The machine script's `status` action ran once at the start; its log was never read.
- Temporary files were written only in my scratch folder. `engine/ADMISSION-RESULTS.md` and the batch files were rewritten by the P4 generator and the regenerator mutation, and each was restored; the porcelain is empty at the end.
