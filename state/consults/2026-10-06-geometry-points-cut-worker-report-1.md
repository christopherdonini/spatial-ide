*Custodian's filing note (2026-10-06): `geometry-points-cut`'s worker report 1, phase A (commits 1 to 3), by worker-high (Sonnet 5.5, by its definition) on the custodian's brief. It arrived as the worker's hand-back message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is dfa3c82ea78701f358f61ef495890f8b9a5a0209624f2680d250fe492729058f. Write audit PASS: 1 Edit and 3 Writes in the worktree `C:/dev/wt/points`, 27 Writes in the session's scratch folder, and no write in the main checkout (its porcelain unchanged) or under the user's Claude folder. Tool calls Read 10, Bash 165, Write 29, Edit 1, SubagentHandback 1. Run window from the transcript: 2026-10-06T19:02:10.973Z to 2026-10-06T20:56:57.679Z. The custodian checked: origin's branch head is edbc0f3c, the worktree is clean, and §7's command at edbc0f3c gives 1,809 lines over 35 files.*

---

**Phase A of `node:geometry-points-cut@g2`: commits 1 to 3 are built, pushed as ordinary updates to `cut/geometry-points-cut`, and the worktree is clean at HEAD = origin.**

I stopped before commits 4 and 5. Three things need your decision (details below): the kernel line group is over its ceiling, `clippy -D warnings` already fails at the base, and one registered mutation (PE-6) cannot fail its test.

**Commits** (base B = d3fe6055, each signed off):
1. `b4a6fd9d8f6f9583e27149b30b149b5a789f6f7d` feat: points cut, engine (E-P1 to E-P9, N-1, T-1): Point admission, row decode, encoding, BF-P, L-P
2. `ffa42b5d13650e9ea9bbbe6dee2adb6c39053316` test: points cut, kernel tests and the walkthrough generators (K-P1, K-P2, four ignored generators)
3. `edbc0f3c1e45adbc7e7c19e3131bba820faaca2e` feat: points cut, wire (W-P1 to W-P3): skp/0.10, the third encoding value, both sides' fixtures in one commit

**§7 count** (`git diff --numstat d3fe6055 HEAD -- . ':!engine/GEOMETRY-POINTS-PREREGISTRATION.md' ':!engine/ADMISSION-RESULTS.md'`): 1,809 lines (1,652 insertions, 157 deletions) over 35 files. The ceiling is 3,220 over 64 files. By group:

| group | lines | ceiling | note |
|---|---|---|---|
| engine product | 573 | 750 | |
| engine tests | 748 | 850 | The BF-P file counts as a file only; phase B's `admission_p4_corpus.rs` edits must fit in about 100 lines. |
| kernel | 260 | 220 | **Over by 40 before phase B adds its `README.md`.** The three listed files are `skp.rs` 78, `publish.rs` 74, `manual_walkthrough_fixtures.rs` 108. This is for the custodian to record as class 8 (§7 not edited). |
| protocol | 209 | 260 | |
| shell product | 7 | 380 | |
| shell tests and seams | 12 | 560 | |
| docs | 0 | 200 | phase B |

**Mutations.** Each was applied by hand, the named test run alone, the failure recorded in the test's comment, and the file restored (checked byte-for-byte). No `verify-mutation` run is used. Engine rows were observed over `d3fe6055` on the uncommitted tree of the engine commit. K-P1 and K-P2 were observed over `b4a6fd9d` on the uncommitted tree of the kernel commit. The version test was observed over `ffa42b5d` on the uncommitted tree of the wire commit. All rows below are reverted: yes.

| row | test | mutation | failing assertion |
|---|---|---|---|
| PE-1 | `a_point_row_is_one_coordinate_pair_with_its_bits_unchanged` | x narrowed through `f32` | `x then y, bits unchanged` |
| PE-2 | `each_unreadable_point_row_is_a_typed_refusal_naming_what_was_met` | type-1 check disabled (`if false && …`) | `expected a typed Wkb refusal, got Ok(())` (the drafted failure point differed; the comment states what was observed) |
| PE-3 | `a_big_endian_point_decodes_to_the_same_values` | byte-order byte ignored (`r.little = true`) | first `unwrap`, `geometry type 16777216 met` |
| PE-4 | `a_point_with_a_nan_in_either_coordinate_is_refused` | NaN check disabled | `expected a typed Wkb refusal, got Ok(())` |
| PE-5 | `the_point_storage_type_is_a_flat_pair_and_each_validator_refuses_the_others_array` | validator also accepts one list level | first refusal assertion (polygon array admitted) |
| PE-6 | `coordinate_values_over_a_sliced_point_array_returns_the_slices_run_only` | **registered mutation (return the whole child) passes, rc 0.** Applied instead: read `..2`. | left 2, right 8, at the first assertion |
| PE-7 | `a_point_envelopes_geometry_encoding_equals_the_fields_extension_name` | `EXT_NAME_POLYGON` written as the key | `the envelope key and the field's extension name are one value` (left `geoarrow.polygon`, right `geoarrow.point`) |
| A-P1 | `a_declared_point_set_selects_the_point_encoding_and_other_sets_are_refused` | Point branch dropped (E-P2 check 3) | P-1's open `unwrap` (the mixed-kinds refusal) |
| A-P2 | `a_set_that_mixes_kinds_is_refused_with_the_rulings_placeholder_detail` | mixed set gives MultiPolygon | `expected a refusal at open, the file was admitted` |
| A-1 (changed) | `a_declared_set_selects_the_encoding_or_is_refused_at_open` | `{Polygon}` mapped to MultiPolygon | F-8 encoding (left MultiPolygon, right Polygon) |
| A-2 (changed) | `the_refusal_detail_is_the_sighted_wording_with_the_declared_list_rendered` | clause joined with `, ` | first detail `assert_eq` |
| A-3 (changed) | `the_refusal_names_exactly_the_types_the_gate_admits_in_order` | clause hard-coded to `Polygon` | `the phrase rule's last member` (the clause has no ` and `, so it stops before the member list; the comment says so) |
| S-P1 | `p1_streams_one_row_per_feature_with_bit_identical_coordinates` | y pushed before x | streamed points against P-1's positions |
| S-P2 | `a_row_of_an_unread_type_stops_a_point_stream_at_that_row_by_name` | refused row skipped (`continue`) | `the stream ended cleanly; the unreadable row was skipped or accepted` |
| S-P3 | `every_point_batch_fits_its_target_under_the_unedited_estimate` | `vertices * 16` to `vertices * 4` | batch 0: 78,624 B against a 65,536 B target, 3,276 rows |
| BF-P | `the_committed_point_batch_equals_the_engines_output_from_a_real_open_and_stream` | writer step 10.0 to 10.5 | `lv95-point-batch.arrows no longer equals the engine's point batch` |
| L-P | `build_tiers_refuses_a_point_feature_by_name_and_writes_no_tier` | `lod.rs` Point arm returns `"Polygon"` | `feature 0: expected a Polygon, found Polygon` |
| L-1 (T-1, re-observed) | `build_tiers_refuses_a_multipolygon_feature_by_name_and_writes_no_tier` | first part taken as the Polygon | `Err(other)` arm: `engine.lod_tier_larger_than_source exceeded: limit 3518, saw 4300` |
| C-5S | `streaming_corpus_row_5_whole_file_yields_one_point_per_feature_inside_its_bbox` (ignored) | x and y swapped | `coordinates outside the bbox member` |
| C-4A | `streaming_corpus_row_4_with_the_catalog_assertion_yields_300_points_inside_its_bbox` (ignored) | x and y swapped | `coordinates outside the bbox member` |
| BF regenerator (re-observed) | `regenerate_the_committed_batches` | polygon batch written to the multipolygon file's name | BF-1 fails at `lv95-multipolygon-batch.arrows no longer equals…`; files restored |
| K-P1 | `the_real_describe_of_a_point_open_is_geoarrow_point_with_the_shared_key_set` | `as_str` returns polygon for Point | `describe.encoding` (left `geoarrow.polygon`, right `geoarrow.point`) |
| K-P2 | `a_point_encoded_dataset_refuses_at_preflight_by_name_before_any_pin_or_write` | K2 compares against multipolygon only | `expected GeometryEncodingNotPublishable` (it fell through to a `zone` attribute refusal) |
| W-P2 version | `skp_version_is_skp_0_10` | literal back to `skp/0.9` | left `skp/0.9`, right `skp/0.10` |

The unmutated C-5S and C-4A runs match the registered predictions (300 rows, unique ids, inside the `bbox` member), as do the four ignored walkthrough generators.

**Checks** (each run through the Bash tool):

| check | exit code | detail |
|---|---|---|
| `cargo test --workspace --locked --features spatial-engine/fixture` | 0 | 885 passed, 0 failed, 49 ignored. That is the 43 ignored at MP-1's merge plus C-5S, C-4A and the four generators (L-P is not ignored on Windows). |
| `cargo fmt --all --check` | 0 | |
| `cargo clippy --workspace --all-targets --locked -- -D warnings` | **101** | Pre-existing, in code this diff does not touch: `engine/src/rowgroup.rs` `build` and `engine/src/stream.rs` `flush` (too many arguments), `stream.rs` `attr_row_bytes` (identical `if` blocks), `renderer/src/canonical.rs` and `renderer/src/style.rs`, and `engine/tests/import_layout_fixtures.rs` (constant assertion). |
| clippy without `-D warnings` | 0 | 43 warnings in the workspace, none on a line this diff adds (checked by a diff-hunk intersection). |
| `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs` | 0 | 450 pass |
| `verify.mjs` | 0 | |
| `verify-cites.mjs` | 0 | |
| `verify-quotes.mjs` | 0 | 121 checked, 90 verified |
| `verify-test-claims.mjs` | 0 | 502 claims |

Beyond the brief, the shell's `vitest` on `src/skp` and `src/admission/admitDataset.test.ts` passes (52 tests) and `tsc --noEmit` is clean. This needed `npm ci` in `frontends/shell` inside the worktree (git-ignored).

**§6 instruments.** G-1 (`the_polygon_only_wire_matches_the_golden_file`), G-2 (`the_published_partitions_and_manifest_match_the_golden_file`) and BF-1 (`the_committed_batches_equal_the_engines_output_from_a_real_open_and_stream`) are green at HEAD. The base-versus-head hashes (base by `git show d3fe6055:<path>`) are identical for all four files:

| file | sha256 at base and head |
|---|---|
| `engine/tests/data/golden/polygon-wire.golden` | d810e6a8659c82c322231d9c784e8d9fbb4e0f074bb325e3cebf1f94ddcab15d |
| `kernel/tests/data/golden/publish-partitions.golden` | 5b10ddd64ca60db9009ab1453cf99098353e4a9b93bcf012dca089586b0c7e01 |
| `engine/tests/data/geoarrow/lv95-polygon-batch.arrows` | d0afe93e143c0e2de16f7fad6eb9272a687195dfec6f68999e7dc7b24ba78197 |
| `engine/tests/data/geoarrow/lv95-multipolygon-batch.arrows` | 831eb54076cf565eac33b673749f8fa3a6a2f481ff3c831a371f740abf6673fa |

The default fixture's hash is unchanged: the golden's `fixture.default.sha256` is 70e88947bbff25ba57a5c1b36021829003f0c58c8c731edb08d9483b2b7ce0de, and G-1 is green. The new BF-P file `lv95-point-batch.arrows` has sha256 10c17431583bc49d772ddffe92e59a8644397103f140b055fb38ffd1d65f267f.

**Deviations from the form** (the class is my reading; the custodian decides):
- **PE-6, class 2.** The registered mutation "return the whole child" cannot fail the test, because Arrow's `slice` already windows a fixed-size list's child. Applied as `Some(flat.values())`, the test passed. The comment records this and the `..2` mutation that does fail it.
- **PE-2, PE-4, PE-5 and A-3.** The observed failure points differ from the drafted ones. The comments state what was observed.
- **Kernel group over its ceiling:** 260 against 220 (class 8, see the table above).
- **Mixed-kind detail (OPEN-2).** The code holds the ruling's draft as a constant, byte-copied by script from line 7 of `state/directives/2026-10-06-round-62-rulings.md`. The span is "geometry_types [<declared list>] … one kind per geometry column", with sha256 ed429602c9e3243975a03e59fe8c69e89e60a099d549ce19a8599acbddb36b85; the whole line's sha256 is a9f46581… as the amendment records. I took the span without the ruling's sentence-final period. The detail is `[P6 placeholder] ` plus that span with `{:?}` of the declared list substituted. A-P2 asserts equality against its own script-copied literal. The form says "naming the kinds from E-P1's mapping"; I read that as the mapping deciding the refusal while the text stays the ruled bytes. The kind labels are not derived from the mapping at runtime.
- **BF regenerator edit.** The form's file list covers `geoarrow_batch_fixtures.rs`, but the regenerator's one added line writing the point file also changes an existing ignored test. I re-observed its mutation.
- **Test rename.** S-P2's test is named `a_row_of_an_unread_type_stops_a_point_stream_at_that_row_by_name` to avoid duplicating MP-1's test name.
- **A-1 and A-2 mutation text.** Each carries both observations: the original at d8276158 and the re-observation.
- **Observations on uncommitted trees.** Per MP-1 Amendment 2 item 5.11, these are the worker's record, and the reviewer's re-made mutations are the observations of record.

**Process notes:**
- I started the cold `cargo check` (duckdb build) once without a hold, about 9 minutes at 8 jobs. I noticed, killed it by its own PIDs (50296 and children) and restarted it under a shared hold. Every later heavy run was under a hold.
- In four held runs, the command step was a script (or two `cargo` commands joined by `&&`) rather than a single command.
- C-5S and C-4A (and their mutation runs) read the on-disk corpus at `C:\dev\spatial-ide\target\fixtures\compat-corpus` read-only, the same absolute-path pattern `admission_p4_corpus.rs` uses. Nothing in the main checkout was written.
- The four ignored generators wrote files under the worktree's own `target/fixtures/manual-walkthrough`.

**Pre-gate self-check:**
1. Cross-module code uses the other side's real interface: I read `kernel/src/publish/mod.rs` K2 (the encoding compare after the degrees check) and `describe_dataset` before writing K-P1 and K-P2. Both are real opens through `SkpHost` and `Dataset`, with no imagined interface.
2. Every completion claim above points to a test run, a log or a hash.
3. Every new operator string carries `[P6 placeholder]`: the PointBuilder refusals and the mixed-kinds detail. The sighted template is unchanged apart from its readable-set clause.
4. Every required test reached its intended assertion, except where PE-2, PE-4 and A-3 differ as stated above.

New `pub` items are only the feature-gated fixture support (`encode_point`, `point_p1`, `point_p1_rows`, `point_p1_rows_with_bounds`, `GeometryMode::RowsWithBounds`) and `GeometryEncoding::Point`. Their callers are the engine tests, the kernel generators and the `Point` arm in the gate and stream. `GeometryKind`, `kind_of`, `point_storage_type`, `build_point_array`, `validate_point_encoding` and `PointBuilder` are `pub(crate)`. N-1 is done: `EXT_NAME_MULTIPOLYGON` and `BatchEnvelope::geometry_encoding` are `pub(crate)`, with no callers outside the crate in kernel, protocol, renderer, frontends or src-tauri.

**Noticed and not done:**
- The pre-existing clippy failures listed above.
- Phase B's items: the shell, V-P, `admission_p4_corpus.rs`, the docs and indexes, Part P, and the P4 re-run.
- `engine/ADMISSION-RESULTS.md` is untouched.

Final git state: HEAD `edbc0f3c1e45adbc7e7c19e3131bba820faaca2e` equals `origin/cut/geometry-points-cut`, and `git status --porcelain` is empty.

**Model, as the harness reports it:** Sonnet 5.5 (`claude-sonnet-5-5`). No model override, no context handoff received or produced.
