# PR #185 gate 1 — reviewer
Reviewed: cut/geometry-points-cut @ 2e481e743e48a73b402acdf51c02ade172cce0dc

Tag `node:geometry-points-cut@g5`. Base B d3fe60558568d2db8ffdc09220134442acff8144. Form `engine/GEOMETRY-POINTS-PREREGISTRATION.md` read whole at origin/main b05b8b16f6490e66b5209e2431a1561830e7b1b3 (Amendments 1 to 4; the branch carries the form only to Amendment 1, unchanged from B). Worktree `C:/dev/wt/points-rev`, target `D:/wt-targets/points-rev`. Finished 2026-10-07T00:33Z.

## Verdict: PASS

No Correctness finding. No Evidence finding. Five Documentation findings (D-1 to D-5), each must-fix before the merge; none fails the gate or opens a correction round (the product-first direction, section 2).

## Correctness

None. Read against the consuming side at every seam:
- engine to kernel: `describe_dataset` takes `as_str()`; K2 compares against `format_declaration()`; K-P1 and K-P2 start from a real open of P-1.
- engine to shell: `decodeBatch` reads the engine's own BF-P bytes; the point branch keys on the batch's own `geometry_encoding`; one part holding one single-position ring per row; `partToRow` the identity (SH-P1, SH-P3 on BF-P).
- shell to deck.gl: one `ScatterplotLayer` per batch, id `layerId(batch)`, `checkPickCeiling(batch.partCount)` before the kind branch, positions through `frame.toLocal` in f64 and cached per batch object and origin (ADR-010 rule 3; the ADR-003 float rule holds: deck uses fp64 for CARTESIAN, and the values are offset-relative in any case).
- engine to viewer: the viewer refuses `geoarrow.point` at its unchanged encoding check (V-T on BF-P).
- No JSON on a data path (the one `serde_json` use is K-P1's test-side fixture read). No new synchronous work on the canvas path beyond one O(resident points) pass per render, the same shape as `averageFeatureExtent`. No `unwrap` on a fallible product path. No new `pub` item outside `GeometryEncoding::Point` and the `fixture`-gated helpers E-P9 names; N-1 done (both items `pub(crate)`, both workspaces build, CI tauri build green).
- Amendment 1 item 3: the diff adds no path that saves a point layer's style document. `frontends/shell/src/style`, `src-tauri`, `renderer/style-ts`, `renderer/src`, `protocol/data-plane`, `engine/src/lod.rs`, every ADR, MP-1's form and `engine/ADMISSION-PREREGISTRATION.md` have an empty diff. The only existing consumer of `toStyleDocument` beyond the panel is Publish, which K2 refuses for a point dataset before any destination exists (K-P2).

## Evidence

None failing. Checked:

**§6 at base and head.** G-1, G-2 and BF-1 passed at d3fe6055 (held run, 3 passed) and at 2e481e74 (in the held workspace run). The four files are byte-identical by sha256 at base and head: `polygon-wire.golden` d810e6a8659c82c322231d9c784e8d9fbb4e0f074bb325e3cebf1f94ddcab15d; `publish-partitions.golden` 5b10ddd64ca60db9009ab1453cf99098353e4a9b93bcf012dca089586b0c7e01; `lv95-polygon-batch.arrows` d0afe93e143c0e2de16f7fad6eb9272a687195dfec6f68999e7dc7b24ba78197; `lv95-multipolygon-batch.arrows` 831eb54076cf565eac33b673749f8fa3a6a2f481ff3c831a371f740abf6673fa. The golden's `fixture.default.sha256` is 70e88947bbff25ba57a5c1b36021829003f0c58c8c731edb08d9483b2b7ce0de at both. BF-P is 10c17431583bc49d772ddffe92e59a8644397103f140b055fb38ffd1d65f267f, and the regenerator re-wrote all three batch files byte-identically on this machine; CI's ubuntu-24.04 run passed BF-P at 2e481e74 (I-4 not met).

**§7 by its command** (`git diff --numstat` d3fe6055 to 2e481e74, the two exclusions): 2,660 lines over 53 files. By group: engine product 573 over 6; engine tests 806 over 7; kernel 306 over 4; protocol 209 over 17; shell product 245 over 7; shell tests and seams 425 over 9; docs 96 over 3. Equal to Amendment 4 item 3 in every group. The kernel overrun is recorded as class 8 (Amendment 4), and §7 is not edited: the form's diff from 8ab5a06c to b05b8b16 is 104 insertions and 0 deletions. The intermediate heads also recount as recorded: edbc0f3c 1,809 over 35 (kernel 260), 7620550a 2,621 over 53.

**Hashes recomputed.** All 68 path, line, rev and sha256 pins in the form (LF bytes from `git show`): 68 match, 0 mismatch. Amendment 1's four ruling-line hashes (round 62 rulings file, lines 6 to 9): all match. The three worker reports' hashes from line 5 to the end: all match (dfa3c82e…, 42d59115…, bf97e536…). Worker report 1's OPEN-2 span hash ed429602c9e3243975a03e59fe8c69e89e60a099d549ce19a8599acbddb36b85: matches. Reports 1 and 2's four §6 file hashes and report 1's BF-P and default-fixture hashes: all match. The three corpus sha256 values in the new Part P table match the files on disk and `MANIFEST.json` at 2e481e74.

**OPEN-2's placeholder** (Amendment 2 item 5): the bytes of `MIXED_KINDS_DRAFT` in `engine/src/geoarrow.rs` and of A-P2's `RULED` constant in `engine/tests/geometry_admission.rs` at 2e481e74 each hash to ed429602…, the same as the span of line 7 of `state/directives/2026-10-06-round-62-rulings.md` without the final period. The detail renders as the `[P6 placeholder] ` tag plus the span with the declared list substituted as `{:?}` renders it (A-P2 asserts it; the A-P1 mutation's output shows it).

**V-P against the lock.** `frontends/shell/package-lock.json` resolves `@deck.gl/layers` and `@deck.gl/core` 9.3.9; `npm ci` installed 9.3.9. In the installed sources: the scatterplot layer adds `instancePositions` through `addInstanced`, so one datum is one instance; its vertex shader assigns `geometry.pickingColor` from `instancePickingColors`; core's `calculateInstancePickingColors` fills entry i with `encodePickingColor(i)`; core's `UNIT` has `pixels`. PP-4 holds. deck's `use64bitPositions()` includes `cartesian`.

**`engine/ADMISSION-RESULTS.md`.** Checked out ac54f4d3 detached and re-ran the generator (held): the output differs from the committed file (7620550a, equal at 2e481e74) only in the two generated-date fields (2026-10-06 against 2026-10-07). Restored. Against B, only rows #2, #4 and #5, their summaries, the totals, prediction rows 1, 2 and 6 and the boundary-8 row change (PP-2 holds: P1 none, P2 #4 and #6).

**Index lines.** Every added pointer names a test that exists at 2e481e74; the edits are in §2's listed sections only; the engine and kernel index blocks are 31 and 36 lines.

**P-5 by name** (`cargo test --workspace … -- --list` and `--list --ignored`, base and head). Run set: base 869, head 885. Removed: `skp_version_is_skp_0_9`. Added: `skp_version_is_skp_0_10` and §4's sixteen Rust tests (PE-1 to PE-7, A-P1, A-P2, S-P1 to S-P3, BF-P, L-P, K-P1, K-P2). Ignored set: base 43, head 50; added C-5S, C-4A, the four §2 generators (F-1c under C-1) and `generate_the_point_pile_fixture` (Amendment 3 item 7, class 9); none removed. L-P runs on Windows. P-5 holds with Amendment 3's addition.

**Unmutated C-5S and C-4A** (ignored; they read the corpus under the main checkout's `target/fixtures/compat-corpus`, read-only): both pass at 2e481e74, so §3's C-5S and C-4A predictions are borne out here.

**Pile fixture** (Amendment 3 item 7; Amendment 4 item 5). `averagePointSpacing` at 2e481e74 is sqrt(w·h/n) when w·h > 0; `pixelsPerWorldUnitAtZoom` in `WorkingCanvas.tsx` is 2^zoom CSS pixels per unit; the threshold is 9 px. P-1's extent is 20.617283945 m by 9.876543207 m (from `point_p1`), the pile lies inside it, and n = 11: spacing sqrt(203.63/11) = 4.3025 m; refusal below 9/4.3025 = 2.092 px per metre, zoom 1.065; the pile's spread is 0.05·√2 = 0.0707 m, under 8 px (two 4 px radii) below 2^z = 113.1, zoom 6.82; at z = 2, 3 and 5 the spacing is 17.2, 34.4 and 137.7 px and the spread 0.28, 0.57 and 2.26 px. Worker report 3's figures and Amendment 4 item 5's are correct.

**Suites, on Windows, each at 2e481e74 unless named** (exit code; hold):
- `cargo test --workspace --locked --features spatial-engine/fixture`: 0; held; 885 passed, 0 failed, 50 ignored (98 result lines). Matches Amendment 4 item 5.
- `cargo fmt --all --check`: 0; unheld (light).
- `cargo clippy --workspace --all-targets --locked --features spatial-engine/fixture --message-format=short`: 0; held; 43 distinct warning lines, 0 on a line the diff adds (intersected with the zero-context diff from d3fe6055 to the head, Rust files only, 1,609 added lines; the intersection was checked with a positive and a negative control). This is Amendment 2 item 7's reading.
- `cargo test --manifest-path frontends/shell/src-tauri/Cargo.toml --locked`: 0; held; 68 passed, 0 failed.
- shell `npm test`: 0; held; 73 files, 1,119 tests passed. `src/notices/noticeDeterminism.test.ts` passed in this run, with nothing else of this project running.
- shell `npx tsc --noEmit`: 0; unheld.
- viewer `node --test "scripts/**/*.test.mjs"`: 0; unheld; 82 pass.
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`: 0; 450 pass; unheld, see process note 1.
- the plan tools at 2e481e74: `verify.mjs` 0; `verify-cites.mjs` 0; `verify-quotes.mjs` 0 (121 checked, 90 verified, 30 baselined, 1 advisory); `verify-test-claims.mjs` 0 (502 claims across 132 files); `queue.mjs --check` 0; `site.mjs --check` 0. Unheld (light).
- at the base d3fe6055: `cargo test --workspace --locked --features spatial-engine/fixture -- --exact` with the three §6 test names: 0; held; 3 passed. The two `--list` runs: 0; unheld (no build).
- at ac54f4d3: the P4 generator, `cargo test -p spatial-engine --locked --features spatial-engine/fixture --test admission_p4_corpus` with its name and `--ignored`: 0; held.
- CI, `gh pr checks 185`: exit 0; all 17 lines pass, every line read: L1 portable correctness ubuntu-24.04 (2), cargo fmt (2), cargo test windows-latest (2; 18m52s and 18m53s), cfg boundary (2), sign-off, no profile path, tauri build (2), test with verify:plan and queue/site drift (2), the viewer's typecheck, build and test, and the shell's typecheck, build, vitest and cargo test (2). The runs' head is 2e481e74 (runs 37542171185, on the branch event, and 37542829638, pull_request, among others).

## Mutations, re-made by me at 2e481e74

Each was applied to the worktree at 2e481e74, the named test run alone, the failure read off its output, and the file restored with `git checkout`, the porcelain checked empty after each. Rust runs were held; shell and viewer runs were single-file and unheld. No `verify-mutation` run was used, and none is an observation. Line numbers are of the named path at 2e481e74; the failing text is test output.

| row | test | mutation | failing assertion | reverted |
|---|---|---|---|---|
| PE-1 | `a_point_row_is_one_coordinate_pair_with_its_bits_unchanged` | x narrowed through f32 | `engine/src/wkb.rs`, line 774: `x then y, bits unchanged` (elements 0 and 2 differ) | yes |
| PE-2 | `each_unreadable_point_row_is_a_typed_refusal_naming_what_was_met` | type-1 check disabled (`if false && …`) | `engine/src/wkb.rs`, line 754: `expected a typed Wkb refusal, got Ok(())` | yes |
| PE-3 | `a_big_endian_point_decodes_to_the_same_values` | `r.little = true` after `Reader::new` | `engine/src/wkb.rs`, line 839: the first `unwrap`, on a Wkb error naming geometry type 16777216 | yes |
| PE-4 | `a_point_with_a_nan_in_either_coordinate_is_refused` | NaN check disabled | `engine/src/wkb.rs`, line 754: `expected a typed Wkb refusal, got Ok(())` | yes |
| PE-5 | `the_point_storage_type_is_a_flat_pair_and_each_validator_refuses_the_others_array` | point validator also accepts a List type | `engine/src/geoarrow.rs`, line 745: the first refusal assertion (the polygon array admitted) | yes |
| PE-6, registered | `coordinate_values_over_a_sliced_point_array_returns_the_slices_run_only` | return the whole child | **passed, exit 0**: Amendment 2 item 2's claim reproduces at the head | yes |
| PE-6, substituted | same | read `..2` | `engine/src/geoarrow.rs`, line 805: left 2, right 8 | yes |
| PE-7 | `a_point_envelopes_geometry_encoding_equals_the_fields_extension_name` | key written as `EXT_NAME_POLYGON` | `engine/src/envelope.rs`, line 693: the key-and-field comparison (left geoarrow.polygon, right geoarrow.point) | yes |
| A-P1 | `a_declared_point_set_selects_the_point_encoding_and_other_sets_are_refused` | all-Point branch deleted | `engine/tests/geometry_admission.rs`, line 293: P-1's `unwrap`, on the mixed-kinds GeoMetadata refusal | yes |
| A-P2 | `a_set_that_mixes_kinds_is_refused_with_the_rulings_placeholder_detail` | a mixed set gives MultiPolygon | `engine/tests/geometry_admission.rs`, line 78: `expected a refusal at open, the file was admitted` | yes |
| A-1 (changed) | `a_declared_set_selects_the_encoding_or_is_refused_at_open` | `{Polygon}` gives MultiPolygon | `engine/tests/geometry_admission.rs`, line 143: F-8's encoding (left MultiPolygon, right Polygon) | yes |
| A-2 (changed) | `the_refusal_detail_is_the_sighted_wording_with_the_declared_list_rendered` | the phrase joined with a comma | `engine/tests/geometry_admission.rs`, line 177: the first detail `assert_eq` | yes |
| A-3 (changed) | `the_refusal_names_exactly_the_types_the_gate_admits_in_order` | the phrase hard-coded `Polygon` | `engine/tests/geometry_admission.rs`, line 223: `the phrase rule's last member` | yes |
| S-P1 | `p1_streams_one_row_per_feature_with_bit_identical_coordinates` | y appended before x | `engine/tests/point_stream.rs`, line 118: streamed points against P-1's (axes swapped) | yes |
| S-P2 | `a_row_of_an_unread_type_stops_a_point_stream_at_that_row_by_name` | a refused row skipped (`continue`) | `engine/tests/point_stream.rs`, line 170: `the stream ended cleanly; the unreadable row was skipped or accepted` | yes |
| S-P3 | `every_point_batch_fits_its_target_under_the_unedited_estimate` | `vertices * 16` to `vertices * 4` | `engine/tests/point_stream.rs`, line 289: batch 0, 78624 B against its 65536 B target, 3276 rows | yes |
| BF-P | `the_committed_point_batch_equals_the_engines_output_from_a_real_open_and_stream` | writer step 10.0 to 10.5 | `engine/tests/geoarrow_batch_fixtures.rs`, line 146: `lv95-point-batch.arrows no longer equals the engine's point batch` | yes |
| BF regenerator (Amendment 2 item 4) | `regenerate_the_committed_batches`, then BF-1 | the polygon batch written to the multipolygon file's name | BF-1 at `engine/tests/geoarrow_batch_fixtures.rs`, line 126: `lv95-multipolygon-batch.arrows no longer equals the engine's multipolygon batch`; after the revert the regenerator restored all three files to their committed sha256 | yes |
| L-P | `build_tiers_refuses_a_point_feature_by_name_and_writes_no_tier` | the Point arm of `geometry_type_name` in `lod.rs` gives `Polygon` | `engine/tests/lod_tier_builder.rs`, line 1600: `the refusal names the type met: feature 0: expected a Polygon, found Polygon` | yes |
| L-1 (T-1) | `build_tiers_refuses_a_multipolygon_feature_by_name_and_writes_no_tier` | a MultiPolygon read as its first part | `engine/tests/lod_tier_builder.rs`, line 1532, the `Err(other)` arm: `expected engine.wkb, got declared ceiling engine.lod_tier_larger_than_source exceeded: limit 3518, saw 4300` | yes |
| C-5S (ignored) | `streaming_corpus_row_5_whole_file_yields_one_point_per_feature_inside_its_bbox` | x and y swapped in `PointBuilder` | `engine/tests/point_corpus.rs`, line 100: `coordinates outside the bbox member` | yes |
| C-4A (ignored) | `streaming_corpus_row_4_with_the_catalog_assertion_yields_300_points_inside_its_bbox` | same | `engine/tests/point_corpus.rs`, line 139: `coordinates outside the bbox member` | yes |
| K-P1 | `the_real_describe_of_a_point_open_is_geoarrow_point_with_the_shared_key_set` | `as_str` gives polygon for Point | `kernel/src/skp.rs`, line 3218: left geoarrow.polygon, right geoarrow.point | yes |
| K-P2 | `a_point_encoded_dataset_refuses_at_preflight_by_name_before_any_pin_or_write` | K2 compares against multipolygon only | `kernel/tests/publish.rs`, line 2025: `expected GeometryEncodingNotPublishable`, having fallen through to the `zone` attribute refusal | yes |
| W-P2 | `skp_version_is_skp_0_10` | the literal back to `skp/0.9` | `protocol/skp/tests/fixtures.rs`, line 468: left skp/0.9, right skp/0.10 | yes |
| SH-2 (changed) | `a mismatched, unknown or missing geometry_encoding throws UnexpectedEncodingError (SH-2)` | the encoding check's throw deleted | `src/canvas/decodeBatch.test.ts`, line 186 (the first assertion): `expected function to throw an error, but it didn't` | yes |
| SH-P1 | `the engine's point batch decodes to one single-position part per row, partToRow the identity, bits unchanged (SH-P1)` | point branch disabled | `src/canvas/decodeBatch.test.ts`, line 257: `TypeError: ring is not iterable`, at the decode call | yes |
| SH-P2 | `a point batch gives one pickable ScatterplotLayer … (SH-P2)` | `kind` ignored | `src/canvas/buildLayers.test.ts`, line 268: `expected SolidPolygonLayer{ …(6) } to be an instance of ScatterplotLayer` | yes |
| SH-P2 cache rule (Amendment 3 item 3) | `a point batch's data is reference-stable at an unchanged origin and recomputed after a recenter (SH-P2, the cache rule)` | the cache hit in `pointsForBatch` deleted | `src/canvas/buildLayers.test.ts`, line 317: `expect(second).toBe(first)` | yes |
| SH-P3 | `an ordinal on a point resolves that row's id, anchored at the point (SH-P3)` | a point row decodes to no part | `src/canvas/pick.test.ts`, line 119: `expected null not to be null` | yes |
| SH-P4 spacing (Amendment 3 item 3) | `the spacing branches: grid, coincident, collinear, one point and none` | `Math.sqrt(w * h)` | `src/canvas/pickResolution.test.ts`, line 453: `expected 90 to be 9` | yes |
| SH-P4 selector (Amendment 3 item 3) | `selects the average feature extent for a polygonal open and the average point spacing for a point open` | `averageFeatureExtent` for points | `src/canvas/pickResolution.test.ts`, line 488: `expected 10 to be close to 36.666666666666664` | yes |
| V-T | `the engine’s point batch, offered as a partition, is refused at the encoding check` | the viewer's `geometry_encoding` check deleted | the `e.state` assertion: actual partition-decode-failed, expected envelope-encoding-mismatch | yes |

The shell rows' paths are under `frontends/shell`. Rows whose comments record another commit (the worker's observations over d3fe6055, b4a6fd9d, ffa42b5d and edbc0f3c; A-1 and A-2 also over d8276158; T-1's observation of record at c4c251d46e55): every one reproduces at the head with the failure point its comment records. PE-6: the registered mutation passes at the head, and the substituted one fails as recorded. The P4 generator test's own recorded mutation was not re-made (worker report 2 says so; that test was edited, not added).

## Documentation (must-fix before the merge; none fails the gate)

- **D-1.** The doc comment of `generate_the_multipolygon_f1_with_covering_fixture` in `kernel/tests/manual_walkthrough_fixtures.rs` at 2e481e74 says F-1c is the file for the shell E2E step MP', but `stepMultiPolygon` in `frontends/shell/e2e/regression.mjs` still opens F-1 (`multipolygon-f1.parquet`). Reword the comment to what is wired (Part S's S2 note), or route MP' to F-1c by a new step under entry 80's rule.
- **D-2.** The generated P3 row of `engine/ADMISSION-RESULTS.md` names only #8 as excluded by the primary-provenance precedence. At ac54f4d3, row #5 is also `crs:format-default` with `axis:format-override` (the same file's #5 row), so it is excluded on the same precedence. The text is a literal in `admission_p4_corpus.rs` (`p3_status`). Name #5 there and regenerate at a committed tree (class 3 test text; Amendment 3 item 8, second bullet).
- **D-3.** Part P's row P2, step (d), in `frontends/shell/MANUAL-WALKTHROUGH.md` says five symbols overlap at P-1's second point. The pile generator writes five points beside that point, so six symbols overlap there.
- **D-4.** Two KNOWN-LIMITATIONS drafts for P6 misdescribe the code. Item 36 says the spacing is taken over the points in view, but `pickResolutionExtentFor` runs over `activeBatches()`, the resident points (the ruling's own word). Item 35 says 4 screen pixels, where the code's unit is the CSS pixel (`radiusUnits` pixels, the ruling's unit). Correct both drafts before the human sights them.
- **D-5.** Amendments 2, 3 and 4 give each worker report's sha256 with no rev (round 15 (e)). Each report was added in the same commit as its amendment (ff6d05a5, 4ea0c6c0 and 0723892b), and the hashes recompute at b05b8b16. The closing record's item 3 can carry the three reports pinned at those commits.

## Amendment 3 item 8, the noticed items

1. MP' opens F-1, which has no covering. This is not a finding against this diff: the step is MP-1's and is unedited here, under entry 80's rule. It is a follow-up before the sitting. As wired, MP' is expected to report FAIL there; `runStep` records the failure and continues, so PT' still runs. The stale comment it exposes is D-1.
2. The P3 line names only #8: D-2, Documentation.
3. The engine index's Declared-limits line omits items 35 and 36: not a finding. Both limits are the shell's (`buildLayers.ts`, `pickResolution.ts`), the engine index rightly omits them, and no shell index carries a Declared-limits line.
4. No KNOWN-LIMITATIONS line names a Point file with no covering: not a finding. Item 9's covering sentence is type-agnostic, and item 31 replaces only item 9's polygon-only half.

## Observations (not findings)

- S-P3's first assertion compares `16 * vertices` with `16 * vertices + 4 * (rows + vertices)`, both computed in the test, so it cannot fail. The row's bound is carried by the target assertion, which the mutation kills. The first assertion could be dropped, or made to read the IPC geometry buffer.
- A point open whose resident points all coincide gives a spacing of 0, so every hover is refused at every zoom. The doc of `averagePointSpacing` says so; item 36 does not. This is for the human's P6 sight.

## Process notes

1. The scripts `node --test` suite (450 tests) ran unheld for about 417 s while my held cargo build ran. `node --test` runs files in parallel, so this may have exceeded the machine paragraph's light bound. It is disclosed here; no result depends on it.
2. The first `-p spatial-engine` mutation run rebuilt `libduckdb-sys` inside its hold, because the `-p` feature resolution differs from the workspace's. The later kernel and protocol mutation runs used `--workspace` with a target filter to avoid a further rebuild.
3. Several unheld light runs were filtered through `grep` for the log: single test binaries with no rebuild, vitest single files, and the viewer single file. No held command step carried a pipe, a chain or a script. No hold was refused, and no exit code 96 to 99 occurred.
4. The worktree was checked out at d3fe6055 and at ac54f4d3, detached, and returned to 2e481e74. Its porcelain is empty. Nothing was committed or published, and nothing outside the worktree, the target and the scratch folder was written except this report.
