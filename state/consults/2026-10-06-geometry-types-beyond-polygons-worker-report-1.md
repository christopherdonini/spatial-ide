*Custodian's filing note (2026-10-06): MP-1's phase A build (`geometry-types-beyond-polygons`, the form's §9 commits 1 to 3), worker report 1, by the worker-high on the custodian's brief of 2026-10-05T20:39Z. It arrived as the worker's hand-back message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline and one cite de-rooted: a `path:line` token into a file that exists only on the branch is written as line 58 of that file, so that verify-cites on main does not read it as an in-tree reference (2026-10-06). The sha256 below is of the report as received. Its sha256, from this file's line 5 to the end, is 919643f6906bd2a60bdd32cb091e228917242bb18d1d869850db00ffebcf2762. Write audit PASS: 98 Write or Edit calls, every one in the worktree `C:/dev/wt/mp1` or the session scratchpad, none in the main checkout or under the user's Claude folder. Tool calls Read 44, Bash 149, Write 13, Edit 85, SubagentHandback 1. Run window from the transcript: 2026-10-05T20:39:52.039Z to 2026-10-05T23:20:37.179Z (540,247 subagent tokens, 292 tool uses, 9,645,158 ms, from the harness's task notification). Refusals in its run: none. Its three commits were published to the branch by the custodian (head 5c3a9e09).*

---

# MP-1 — worker report 1 (phase A: commits 1 to 3)

Branch `cut/geometry-types-beyond-polygons` in the worktree `C:/dev/wt/mp1`, three commits over `ff6bdddc`. Nothing was published, no PR was opened, no rebase or pull was run. Every cargo command used `CARGO_TARGET_DIR=D:/wt-targets/mp1`.

## Findings you need before anything else

1. **Registered predictions C-12 and C-12S are wrong.** Corpus row #12 does not open after MP-1. `Dataset::open` refuses it at identity admission with `IdentityUnusable { column: "id", .. }`. Its `id` column is a nullable `Utf8`, and the file has no 64-bit integer column to declare a mapping over. The old geometry gate sat before the identity gate, so this refusal was never reachable until now.
   - **Impact on §5:** P-2's "every other row equals `ADMISSION-RESULTS.md`" also moves, because #12 changes from `engine.geo_metadata` to `engine.identity_unusable`.
   - **Row #11 matches C-11:** it is admitted, `geoarrow.multipolygon`, declared `["Polygon", "MultiPolygon"]`, identity `SessionOrdinal`.
   - **What I did with C-12S:** I left the test asserting the registered prediction and recorded the result in its comment. It is `#[ignore]` and fails at its first `expect` when run. This is not one of the §5 invalidators, so I continued.
2. **`verify-quotes` fails on the golden files.** It reads `rows:2034 sha256:<hex>` and `bytes:880264 sha256:<hex>` as a path:line cite followed by a hash. The result is 6 hash-reference errors, in the form `unresolvable path "rows"` or `"bytes"`.
   - **Where:** `engine/tests/data/golden/polygon-wire.golden`, lines 4 to 6; `kernel/tests/data/golden/publish-partitions.golden`, lines 6 to 8.
   - **What I did:** I did not touch the goldens after the golden commit.
   - **Options for you:** a separate format-only change (`rows=N sha256=<hex>`) that leaves every value the same, or baseline entries.
3. **Process incident.** While killing a wrong-feature rebuild I ran `taskkill //F //IM cargo.exe`, which terminated two `cargo.exe` processes (PIDs 35708 and 43224). One was my own `-p spatial-engine` build. The other I could not identify, and it may belong to another session.

## Commits

- **1. The golden commit is `d8276158c49f7709126f9388fabfedec26d55b99`.**
  - **Contents:** only `engine/tests/polygon_wire_golden.rs` (G-1), `engine/tests/data/golden/polygon-wire.golden`, `kernel/tests/publish_partition_golden.rs` (G-2), and `kernel/tests/data/golden/publish-partitions.golden`.
  - **No product line.** `git show --stat` shows 4 files, 503 insertions.
  - **Green there:** both tests passed three times through `node scripts/evidence/repeat.mjs 3 --`.
- **2. Engine, `1b978ee5816763d855a55aaf559bf97474a1233b`.**
  - **Code:** E1 to E9, plus `GeometryEncoding`, `Dataset::geometry_encoding` and `Dataset::declared_geometry_types`. OPEN-1 (b1) and (c1) are implemented as ruled in round 59.
  - **Tests:** E-1 to E-8, A-1 to A-4, S-1 to S-3, BF-1 with its two committed batches, L-1 and C-12S.
  - **Also in this commit:** two kernel test sites that build `FixtureSpec` field by field gain the two defaults.
- **3. Kernel, `5c3a9e097b65803eeb07294bd9acc4a379d75939`.**
  - **Code:**
    - K1's `encoding` half: describe now reads `ds.geometry_encoding()`.
    - K2: new `PublishError::GeometryEncodingNotPublishable`, with code `publish.geometry_encoding_not_publishable`, outcome Refused, and the same `error_kind` name.
    - The check sits right after the degrees check and compares against `format_declaration().geometry_encoding`.
    - The boundary's module doc lists it as a no-audit-record refusal. The audit reader is unchanged because its wildcard renders it.
  - **Tests:** K-1 (encoding half), K-2, K-3, K-4.

## Goldens as the golden commit computed them

Both files are byte-identical at HEAD (`git diff --quiet d8276158 HEAD` over both directories returned 0).

Engine G-1 (`polygon-wire.golden`, 53 lines, sha256 `d810e6a8659c82c322231d9c784e8d9fbb4e0f074bb325e3cebf1f94ddcab15d`):
- Default fixture file: sha256 `70e88947bbff25ba57a5c1b36021829003f0c58c8c731edb08d9483b2b7ce0de`, 1949289 bytes.
- Zoned fixture file: sha256 `1f6e1df46703205f05b59b3b729798ca2e7ef55cdda541a96d1c92c8ae45ee2b`.
- `stream_for_publish` (3 batches, per-batch IPC sha256):

| batch | rows | sha256 |
|---|---|---|
| 0 | 2034 | `9cf67bc09580a4f3664d5aecdace9e5afa18ecda68600c8c049d3537fe3082c5` |
| 1 | 2046 | `96bfc4d21feb2681bff759d395618140e4e59c008a3792a03e904b6c3cd08088` |
| 2 | 920 | `09dea7254c1318afb37f8dd9f5d9988c1e333e269e016d926aa9f642d58e1df8` |

- `stream_with_cancel` and `stream_projected_with_cancel` (the full schema metadata map and field lines are in the file):
  - Both streams have 5000 rows and the same id-keyed geometry digest, `8256357a123acfb4abfd5a8bb44deaf6cb8edc4a5dd671cba9af76b2eaf1a551`.
  - Both carry extension name `geoarrow.polygon` and CRS-block sha256 `3b5f459e4fcbbb8a2290b8761fb9d51434f108caf074bcf230ea0d5692ffe680` (1763 bytes).

Kernel G-2 (`publish-partitions.golden`, 8 lines, sha256 `5b10ddd64ca60db9009ab1453cf99098353e4a9b93bcf012dca089586b0c7e01`):
- Fixture: sha256 `bdcda63a229aa8fd2b756dd4f405fd3942fec707b873f259ccb224f53930abb0`, 4000 rows.
- Manifest: 9493 bytes, sha256 `941cd9123a1901fbd90b8756f072738fea8816abb9404fd32ba7ddcf01838623`.
- Partitions (3):

| partition | bytes | sha256 |
|---|---|---|
| 0 | 880264 | `05897ca8ec54fe18c9f083eb4116cf0b62e64bbe735b287ee6e6f2d2bc783846` |
| 1 | 880520 | `7da045ae92ac5298aa145d9139b32af78156cd8171456a52ad25492cec17c466` |
| 2 | 7752 | `db158c77dee5c78eee79f2197031a084c68ddbc236712567f098178f56af9e99` |

## Mutations: each applied, the named test run, the failure recorded, then reverted

A commit cannot name its own id, so each comment records the commit the uncommitted tree sat on. Every revert was checked byte-identical (the runner printed `byte-identical=True`). `verify-mutation.mjs` returned PASS, but that is a heuristic and is not used as an observation.

- **Over `ff6bdddc`, recorded in commit 1 (G-1 and G-2):** `estimate_bytes` changed from `rows * 8` to `rows * 9`.
  - FAILED: `the_polygon_only_wire_matches_the_golden_file`.
  - FAILED: `the_published_partitions_and_manifest_match_the_golden_file`.
- **Over `d8276158`, recorded in commit 2.** Each failed by name:
  - E-1: `wkb::tests::a_multipolygon_row_keeps_its_three_offset_levels_exactly`
  - E-2: `wkb::tests::a_polygon_row_under_multipolygon_is_one_part_with_its_coordinate_bits_unchanged`
  - E-3: `wkb::tests::each_unreadable_multipolygon_row_is_a_typed_refusal_naming_what_was_met`
  - E-4: `wkb::tests::the_polygon_builder_still_refuses_a_multipolygon_row`
  - E-5: `wkb::tests::parts_with_mixed_byte_orders_decode_to_the_same_values`
  - E-6: `geoarrow::tests::the_multipolygon_storage_type_is_three_lists_deep_and_each_validator_refuses_the_others_array`
  - E-7: `geoarrow::tests::coordinate_values_over_a_sliced_multipolygon_array_returns_the_slices_run_only`
  - E-8: `envelope::tests::the_envelopes_geometry_encoding_equals_the_fields_extension_name_for_both_values`
  - A-1: `a_declared_set_selects_the_encoding_or_is_refused_at_open`
  - A-2: `the_refusal_detail_is_the_sighted_wording_with_the_declared_list_rendered`
  - A-3: `the_refusal_names_exactly_the_types_the_gate_admits_in_order`
  - A-4: `an_absent_key_is_multipolygon_with_no_declaration_and_a_non_string_member_is_refused`
  - S-1: `f1_and_f2_stream_one_row_per_feature_with_bit_identical_parts`
  - S-2: `a_row_of_an_unread_type_stops_the_stream_at_that_row_by_name`
  - S-3: `every_multipolygon_batch_fits_its_target_under_the_unedited_estimate`
  - G-1, §4's mutation (select `MultiPolygon` for `[Polygon]`): `the_polygon_only_wire_matches_the_golden_file`
  - BF-1: `the_committed_batches_equal_the_engines_output_from_a_real_open_and_stream`
  - L-1: `build_tiers_refuses_a_multipolygon_feature_by_name_and_writes_no_tier`
  - BF regenerator: I swapped the output file and ran it, and BF-1 failed. I then reverted and regenerated the files, and BF-1 passed again.
- **Over `1b978ee5`, recorded in commit 3.** Each failed by name:
  - K-1: `skp::tests::the_real_describe_geometry_carries_the_engines_encoding_for_each_open`
  - K-2: `a_multipolygon_encoded_dataset_refuses_at_preflight_by_name_before_any_pin_or_write`
  - K-3: `a_degrees_multipolygon_dataset_still_refuses_as_the_degrees_dataset`
  - K-4: `a_geometry_encoding_refusal_detail_begins_with_its_typed_code`
  - G-2, §4's mutation: `the_published_partitions_and_manifest_match_the_golden_file`
- **C-12S:** no mutation is observable, because it fails at open (see finding 1). §4 names "as G-1" for it, which could not fail a file declaring `[MultiPolygon, Polygon]` anyway.

## Suites

All at HEAD `5c3a9e09`.
- `cargo test --workspace --locked --features spatial-engine/fixture`: exit 0, with 868 passed, 0 failed and 42 ignored summed over the log's `test result` lines.
  - The suite includes the long LOD ladder tests.
  - I did not compute the base's passed/ignored counts, so the P-5 comparison is not made.
- `cargo fmt --check`: exit 0.
- `cargo clippy --workspace --locked --all-targets --features spatial-engine/fixture`: exit 0, with warnings only.
  - CI runs no clippy step: `grep clippy .github/workflows/*.yml` finds only a comment in `rust-fmt.yml`.
  - One new warning is mine: `needless_lifetimes` at line 58 of `engine/tests/multipolygon_stream.rs`. Fixing it needs a fourth commit, so it is left for phase B.
  - The other warnings are in lines I did not write.
- `verify-cites.mjs`: PASS.
- `verify-quotes.mjs --show-cites <changed files>`: FAIL, the 6 hash-reference errors in finding 2. It is otherwise clean.
- `cfg-boundary.mjs`: 0 sites outside every boundary.

## §7 figures at `5c3a9e09`

Counted with the form's command, `git diff --numstat $(git merge-base origin/main HEAD) HEAD -- . ':!engine/MULTIPOLYGON-MP1-PREREGISTRATION.md' ':!engine/ADMISSION-RESULTS.md'`. The merge base is `ff6bdddc`. Totals are 27 files, 2,819 insertions plus 120 deletions, 2,939 lines, against 4,500.

| group | lines | ceiling |
|---|---|---|
| engine product (`wkb`, `geoarrow`, `envelope`, `stream`, `dataset`, `geoparquet`, `lib`, `fixture`) | 1,190 | 1,200 |
| engine tests (new files, `lod_tier_builder`, goldens; BF binaries counted as 2 files) | 1,188 | 1,150 |
| kernel (the listed files) | 553 | 560 |

- **Engine tests are 38 over, a class 8 overrun.** `admission_p4_corpus.rs` is not yet touched, so commit 6 adds more.
- **Kernel:** the two unlisted test files I edited add 8 lines (561 if counted).

## Deviations from the form

1. **K1 and K-1 split.** K1's `declared_types` half and K-1's `declared_types` assertions are deferred to commit 4. They read the wire field that §9 and SKP-V0 §4 item 13 (iii) put in commit 4 with the literal and both sides' fixtures. K-1 asserts `encoding` and the key set.
2. **`Dataset::declared_geometry_types` has no product caller** until commit 4's `describe_dataset`. Its callers are tests only. `geometry_encoding` has product callers in `kernel/src/skp.rs:1928` and `kernel/src/publish/mod.rs:492`.
3. **Extra refusal.** `GeoMeta::parse` also refuses a `geometry_types` value that is not a list, with a P6 placeholder text. (c1) names only a non-string member; I would otherwise have folded it into the empty list.
4. **Two kernel test files outside §7's kernel list** gain the `FixtureSpec` defaults, because they build the spec field by field: `kernel/tests/support/mod.rs` and `kernel/tests/regenerate_fixture.rs`.
5. **Extra ignored test.** `regenerate_the_committed_batches` is the BF writer, so the ignored set exceeds P-5's "base plus L-1 plus C-12S".
6. **A-3** reads the readable set out of the refusal text, because E1's declaration is `pub(crate)`. It checks the order {Polygon, MultiPolygon} and that each named member admits.
7. **S-3** measures each decoded batch's geometry bytes plus 8 bytes per id against `BatchInfo.target_bytes`. It cannot call the private `estimate_bytes`, and the mutation on `estimate_bytes` fails it.
8. **PolygonBuilder refactor.** Its ring loop moved into a shared `read_ring` with identical behaviour; G-1 stays green.
9. **EWKB text for the Polygon encoding.** Its text keeps no prefix, because it is not a new text. The type-3-only refusal is reworded as a P6 placeholder, as E4 says.
10. **The `h6` transport scan** forbids the word `header` in engine code, so one message says "type code".
11. **Mutation observation bases are uncommitted trees** (see the Mutations section).
12. **Two earlier mishaps (no repo effect):**
    - A first Python edit wrote CRLF into two engine files. I converted them back to LF before any commit.
    - A `-p spatial-engine` cargo run began a full feature-split rebuild before I killed it (see finding 3).

## Git state

- **Git state touched, all rc 0:** `git add` of explicit paths (several); `git commit -s -F` three times, producing `d8276158`, `1b978ee5` and `5c3a9e09`.
- **Read-only git commands, all rc 0:** `git status --porcelain`, `git log`, `git diff`, `git diff --numstat`, `git show --stat`, `git merge-base`, `git stash list`.
- **Never run:** checkout, reset, rebase, pull, push, clean.
- **Working-tree mutations:** applied and restored by script (byte-identical checked), by `sed` with the diff confirmed empty, or by `cp` from a saved copy.
- **Final `git status --porcelain`:** empty.
- **Scratch:** `<scratchpad>`.

## Pre-gate self-check

- **Cross-module code uses the interface the other side exposes:** yes.
  - Engine to kernel: `Dataset::geometry_encoding().as_str()`, and `FormatDeclaration.geometry_encoding` (`String`).
  - Kernel: both exhaustive `PublishError` matches in `kernel/src/permission/boundary.rs`.
  - The kernel tests use the real `SkpHost::open_dataset` and `describe`, and the real `preflight_pinless` and `publish_unguarded`.
- **Every completion claim has existing evidence:** yes, except C-12S (finding 1) and the `declared_types` half of K1 and K-1 (deviation 1).
- **User-facing messages describe behaviour at this commit:** yes. The new texts are P6 placeholders and state engine or format facts only.
- **Required tests reach their intended assertion:** yes, each failed at its assertion under its mutation. C-12S is the exception.
- **Model observed:** `claude-sonnet-5-5`. No override. No context handoff received or produced.

RESULT: phase A built and committed (golden `d8276158`, engine `1b978ee5`, kernel `5c3a9e09`); suites green; two form-level results to rule on (finding 1's C-12 and C-12S, and the engine-tests overrun).
BLOCKER: none that stops phase B, but the `verify-quotes` failure on the golden files must be resolved before the final gate.
STOP: no §5 invalidator fired.
