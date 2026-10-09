# A covering that names a column the file lacks — preregistration (PLAN node `covering-names-missing-column`)

**Authority:** PLAN node `covering-names-missing-column` (`PLAN.yaml`, the node's block, @ bc357c28), placed and graded S1 by the human's direction of 2026-10-09 (`state/directives/2026-10-09-slot-orders-pilot-and-reuse-standing-step.md`, items 3a and 4); filed on the 2026-09-29 sightings (`state/directives/2026-09-29-a2-1-and-b-1-sightings.md`, A2-1 paragraph, item (c)). Measured piece 5 of the lead-data second pilot (`state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md`, §2 and §4).
**Drafted by** the architect agent on the custodian's brief, read at main bc357c28, after lead-data's impact read (`state/consults/2026-10-09-covering-names-missing-column-impact-read.md`).
**Committed before any code.** No code lands before (i) the human's typed ruling on OPEN-1 and (ii) Amendment 1 recording the P0 (§3a). **Append-only once committed;** an amendment made after any outcome has been seen says so in its first line.

## §0. Disclosure

- **Evidence (evidence, not Authority):** `state/drafts/a2-1-p0/covering-output.txt:19-23 @ bc357c28 sha256:9202b1e6a6bce743c0c7385adedcdff08d8d4b1c4a9ec15abc41a7c15ab0305f` (k3: the open succeeds with the covering present; the bbox stream fails at item 0 with an `execute:` binder error naming `nobbox`; the no-bbox stream is OK). Writer: `state/drafts/a2-1-p0/covering-probe.rs.txt:51-58 @ bc357c28 sha256:37e351439cece4aff7aee825b4caba83271f3d63eb2756c8e52bd1dd810372b0` (k3 declares an LV95 PROJJSON CRS), case row `state/drafts/a2-1-p0/covering-probe.rs.txt:94 @ bc357c28 sha256:cbd97d45b4509ce4156dae92db934db5bc1aa7db9dfdf099707759ce0275b234`.
- **Root cause, confirmed in code:**
  - The stored covering drops only a U+0000 path (`engine/src/dataset.rs:567-581 @ bc357c28 sha256:e979ec8e290846073f3e7f6045186f2b36d04d2484deb177fcf7c0da93712da1`).
  - The absent-column fact is computed only inside `sanity_check`'s R-S3 branch (`engine/src/dataset.rs:1247-1266 @ bc357c28 sha256:7d0dee8dbbfd32b4e22f6857353b01e7b3dae36eeebc289d474f1e811bcccd24`), which is reached only by a format-rule file with no geo `bbox` member. Two earlier returns skip it:
    - the no-format-rule return (`engine/src/dataset.rs:1198-1209 @ bc357c28 sha256:25ac3ef7f607f5a1d9d042dd04bceab81ba83906f63556b0e2d1b02c0940e8c2`), taken by k3 and M-4, which declare their own CRS;
    - the geo `bbox` member return (`engine/src/dataset.rs:1217-1226 @ bc357c28 sha256:eeea5dbdc796eb4f59c527e8485715f35ef531a79730c63902322295195ab7a6`).
  - Nothing reaches `Dataset::covering()` (`engine/src/dataset.rs:977-983 @ bc357c28 sha256:0cecc91a6fbe352222d5bdc4e3bc01a598f3f94dd3fa5d0a7e2766ce09c45c02`). `build_sql`'s gate (`engine/src/stream.rs:1477-1480 @ bc357c28 sha256:5e3007ff5eae597e41ad295213489e974d30ca6c4cd66bf0ffc151c23f83fad9`) therefore passes, the lease is taken (`engine/src/stream.rs:1221 @ bc357c28 sha256:a72b40cf8a252bfef37db627745ed14fdae66a827076d553c889df940a26dba6`) and the kernel mints (`kernel/src/skp.rs:1465-1488 @ bc357c28 sha256:a36fcc22484cfa7f0e7f470ae88552daaed4af7cbd0fafd6649c5634367a8daf`) before the binder fails.
- **Sibling rule:** `engine/B1-PROJECTION-PREREGISTRATION.md`, Amendment 12: 12.1(d)'s covering row, 12.1(f)'s covering_bbox line, 12.3's declared-unchanged R-S3-for-k3 line, 12.4 items 25 to 27 and 29. OPEN A12-c is ruled by the 2026-09-29 sightings, item (c): k3 stays out of A2-1 as its own node. B1's form is closed to additions, so nothing is appended to it.
- **R-S3's open choice** is on `engine/ADMISSION-PREREGISTRATION.md` §12d's list and is `DECISIONS-PENDING.md` entry 73, item (c), which is unruled. It is OPEN-1 below.
- **Reuse index (the human's standing step, item 5 of the 2026-10-09 direction).** `node tools/reuse.mjs <words>` in `christopherdonini/spatial-ide-reuse` at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c printed, as the custodian's brief relays it (the custodian byte-checks against the run before commit):
  ```
  covering:            capability: geoparquet-conformance-files → GeoParquet spec repo [ADOPT], geoarrow-data [ADOPT], gpq [CONCEPTUAL]   (do-not-reinvent, P0)
  geoparquet metadata: capability: malformed-input-files → parquet-testing [ADOPT], GeoParquet spec repo [PORT], gpq [PORT], gdal [CONCEPTUAL], arrow-testing [REJECT]   (do-not-reinvent, P1)
                       capability: duckdb-native-geometry-decoding → DuckDB [WATCH]   (open, P0)
  bbox:                No prior art recorded for "bbox". Research it before planning an implementation.
  covering bbox:       No prior art recorded for "covering bbox". Research it before planning an implementation.
  ```
  - The rows behind the two capabilities are at `REUSE-ROUND-1.md` lines 158-160 and 257-261 of that repository at that commit: spec test data at opengeospatial/geoparquet @ 4c9f87e, gpq validator test data at planetlabs/gpq @ a5a6b20.
  - None names a covering-path-absent case, and none is needed: the in-tree writer `engine::fixture::write_hostile_covering` (`engine/src/fixture.rs:1665-1676 @ bc357c28 sha256:6959c6cb333421281879076b8cf4a5ad588729f2c145edffe6cc5d625af829e7`) builds every row here.
  - No ADOPT and no PORT is taken. `bbox` and `covering bbox` are misses, noted here; they do not block.
- **P0 (§3a)** runs before any code, against unmodified main, as an untracked scratch test. Its outputs are kept as text under `state/drafts/covering-names-missing-column-p0/`, and its result is recorded as Amendment 1 (class 1).

## §1. What this may and may not claim

- May claim: for a dataset whose declared covering names a path the binder cannot resolve, the bbox route behaves as OPEN-1 rules, proven by the tests in §4.
- May not claim:
  - any docs/08 figure;
  - that an open is faster or slower;
  - that a file is non-conformant to GeoParquet (no spec text is pinned here for that);
  - any ADR change.
- No new `EngineError` variant, no new wire code, no literal bump, and an empty `protocol/data-plane/` diff.
- Every operator-visible string is the human's (OPEN-2). The engine states engine facts only.

## §2. The rule

**2a. One decision at open, common to both branches.** `open_inner` calls one private function, once, after `check_geometry_column` (`engine/src/dataset.rs:427-428 @ bc357c28 sha256:785f4c32f9c5f38a9e183f132b32e6362ff40b54ee5c14581ec3b9a376abfcb7`) and before `sanity_check` (`engine/src/dataset.rs:516-524 @ bc357c28 sha256:824292d92a04b82b998a70ed04f5a94cf9e0f21470d303fea07709885b57cefc`).
- **Inputs:** the declared covering and the resident `file_schema`, which already carries DESCRIBE's bound names (`engine/src/dataset.rs:1100-1156 @ bc357c28 sha256:d0fd27f451d90ddaa797d3fae8e5ddedadf788fe6ae8fa567ed67190c79c9f03`).
- **No `Connection` parameter.** It issues no SQL statement.
- **Result:** a private enum.
  - `NotAddressable { reason }`: the existing U+0000 check, `covering_not_addressable_reason` (`engine/src/dataset.rs:1362-1386 @ bc357c28 sha256:fe8fc12af76b1fc529be1748a972ada8abdb7fb2fd1325537b2169063f5b8cf0`), checked first and unchanged.
  - Otherwise `Absent { path }`: the first of xmin, ymin, xmax, ymax, in that order, that the schema walk does not resolve.
  - Otherwise none.
- **The walk** is `field_path_exists` (`engine/src/dataset.rs:1388-1408 @ bc357c28 sha256:04f275b75e3a2675377936325fa54ddca22f75d5427fed846ee414bcf5801d7f`), with the segment comparison the P0 selects (§3a): byte equality, or the case rule the binder showed. The rule is DuckDB's binder rule, never a filesystem's or an OS's.
- **One decision site.** `sanity_check` takes this result as a parameter and stops calling either check itself; its two reason texts (`engine/src/dataset.rs:1239-1245` and `engine/src/dataset.rs:1247-1266 @ bc357c28 sha256:7d0dee8dbbfd32b4e22f6857353b01e7b3dae36eeebc289d474f1e811bcccd24`) stay byte-identical, at the same position in its order. No other function decides absence. `engine/src/addressability.rs`'s single not-addressable classifier is untouched; absence is a different fact.

**2b. Branch A (conditional: applies only if OPEN-1 rules A, drop at open).**
- `Absent` stores the same as `NotAddressable`: `covering = None`, and the absence is kept in the existing `covering_unusable_reason` field (`engine/src/dataset.rs:148-154 @ bc357c28 sha256:e31957a5686fc87b4a66da4d99fac50e7476521b63e488d776739ad318a3ffe5`).
- `no_covering_bbox_detail` (`engine/src/dataset.rs:985-997 @ bc357c28 sha256:faa9eeb8e654669e6a822c2175e6b6eb65b307a7f3411a4380964e9d90475cab`) names the absent path. The wording is the P6 placeholder of OPEN-2, in the kernel's braced form (`kernel/src/skp.rs:1447-1449 @ bc357c28 sha256:18e53ee47550819c41aec594a7b948339267ab5db7567c2902f746880fc7bf73`). The path is rendered through `render_visible_escape`.
- The detail never says the file declares no covering, and never names U+0000 for an absent column.
- **Consumers, none edited:**
  - `build_sql`'s gate refuses `NoCoveringBbox` before any lease.
  - `build_index_observed` and `build_row_group_index_observed` (`engine/src/dataset.rs:734-738`, `engine/src/dataset.rs:850-853 @ bc357c28 sha256:204655c99b824219565a04ca5c8c6416c68793ca2d2e02ab1b7900a02d69ae6c`) refuse with the same detail, before the content hash.
  - The kernel's pre-mint route (`kernel/src/skp.rs:1455-1471 @ bc357c28 sha256:03ff144892cdccc986714638196e3557b15ca4e651e806f3dbd7d3511e18b959`) and `error_of`'s arm (`kernel/src/skp.rs:2103-2104 @ bc357c28 sha256:ab47f12e327ace1f6cae271e573cb0e07b3e4d000de16716b1abbe758989d602`) return `engine.no_covering_bbox` synchronously.
  - `describe.covering_bbox` (`kernel/src/skp.rs:1975 @ bc357c28 sha256:cb9d8c9ac4283a41528aaa1b0d89f32c526e2a566358d037e849d18b5c6a29ee`) reads false.
  - The slice-host banner (`kernel/src/main.rs:119-127 @ bc357c28 sha256:609a7affa8304edcc2c44bd5cb8dfbaacf76e48876d20de3300fda51d5a8f9ca`) prints its existing no-covering line, which becomes true for such a file.
  - Publish with a bbox (`kernel/src/publish/mod.rs:731 @ bc357c28 sha256:98cf480b15f48b5e0e2f6ca7c54897a045e0a010b88b6e1784c4905454467a62`) gets `NoCoveringBbox` instead of a mid-stream `Query` failure, at the same point in its sequence, before any partition is written.
  - The shell's existing synchronous refusal path (`frontends/shell/src/App.tsx:1236-1273 @ bc357c28 sha256:c6dcae9ecabed7eb571970696c6464a22ef46dea5d492acaf3934926428ded81`) shows the code; the shell has no code change.
- The sanity level and reason are unchanged for every file.

**2c. Branch B (conditional: applies only if OPEN-1 rules B, refuse the open).**
- `Absent` refuses the open with the existing `EngineError::GeoMetadata` (`engine.geo_metadata`), after the schema probe and before `sanity_check`, the identity scan and the descriptor. The wording is the P6 placeholder of OPEN-2.
- `NotAddressable` keeps A2-1's behaviour (open succeeds, covering unusable).
- `engine/ADMISSION-PREREGISTRATION.md` gains one appended amendment citing the human's ruling by round and item, because R-S3's open-succeeds outcome is overridden.
- `engine/tests/admission_format_semantics.rs:446` is changed to assert the refusal, a declared change of an existing test.

**2d. Wire.**
- Under either branch: no new key, no new code, no literal change, no fixture change. `protocol/skp/SKP-V0.md` §8 gains one dated note marked no literal change. It states:
  - `covering_bbox` is true only for a covering this engine can address and whose path the file's schema resolves;
  - under A, a bbox `viewport_query` on such a dataset refuses `engine.no_covering_bbox` before the mint;
  - under B, `open_dataset` refuses `engine.geo_metadata`;
  - `protocol/data-plane/` has an empty diff.
- Basis: the entry-30 addendum's disposition (`protocol/skp/SKP-V0.md:641-658 @ bc357c28 sha256:b19bf2048abad559ee87b147b777889e61f60852a9ec5e2b5c4af63b3722088f`).

**2e. Documents.**
- `KNOWN-LIMITATIONS.md` item 9 gains one sentence, at the human's wording (OPEN-2). Under A, a declared covering that names a column the file does not contain is treated as no covering for a bbox query. Under B, such a file is refused at open.
- Item 22 is unchanged: its level-`none` sentence already covers a covering that is not usable.
- Item 9's stale Polygons-only sentence (item 31 supersedes it) is outside this piece and is not edited.

**2f. Messages.** Engine messages state engine facts only: the declared path, and that the schema does not resolve it. No engine message states a consequence for another module.

**2g. Portability (`state/directives/PORTABILITY-2026-09-30.md` §2).**
- R1: the decision is a pure function of the declared paths and the resident schema, the same on every platform.
- R2: no OS mechanism is used, so no boundary is needed.
- R3: not owed, because the piece is not OS-dependent.
- R4: no `cfg`, and no OS-keyed or filesystem-keyed case rule.
- R5: no level is claimed. The tests run as portable correctness tests in each CI job.
- R6: no platform ignore. The corpus test C-5 is `#[ignore]`d on every platform, for the corpus's own reason, as its generator is.

**2h. The impact read's five questions.**
1. Where the fact is established: 2a, at open, outside `sanity_check` and ahead of both of its early returns.
2. Which outcome: OPEN-1, the human's.
3. Detail and reason: 2b and 2c.
   - The detail is new, and its wording is OPEN-2.
   - The sanity reasons are byte-unchanged.
   - Amendment 12, item 27's two forbidden texts are applied by analogy (§8 item 5).
4. Changed or unchanged: §5.
5. Wire: 2d. No bump, and no error fixture owed.

## §3. Fixtures and predicted outcomes

Every fixture is generated in-test with `write_hostile_covering` (LV95, declared CRS) or `FixtureSpec` (format default), and hash-verified before and after each run.

**3a. P0 (before code, on unmodified main bc357c28).**
- **Run per row:** open, `covering().is_some()`, the bbox stream outcome, and an oracle on a fresh in-memory DuckDB connection: prepare `SELECT` of the four declared paths' `FieldPath::to_sql()` text `FROM read_parquet(?) LIMIT 0`.

| row | written struct / children | declared | predicted binder (oracle and stream agree) |
|---|---|---|---|
| a | `bbox` / xmin… | `bbox` / xmin… | binds |
| b (k3) | `bbox` / xmin… | `nobbox` / xmin… | binder error (as covering-output.txt:22) |
| c | `bbox` / xmin… | `bbox` / xmin, ymin, xmax, `nomax` | binder error |
| d | `bbox` / xmin… | `BBOX` / xmin… | binds (hypothesis: DuckDB binds identifiers without regard to case; this row discriminates) |
| e | `bbox` / xmin… | `bbox` / `XMIN`, ymin, xmax, ymax | binds (hypothesis; this row discriminates) |
| f | `bbox` / xmin… | `id` / xmin… | binder error |
| g | `bböx` / xmin… | `BBÖX` / xmin… | not derivable statically; recorded at P0 |

- **Selection rule:**
  - d and e both error: the comparison is byte equality.
  - Both bind: the comparison is case-insensitive at both levels. Row g decides the kind: Unicode lowercase equality if g binds, ASCII-only if it errors.
  - d and e differ: each level takes the rule its own row shows.
  - Amendment 1 records the rows and the selected rule.
- **Invalidator:** a, b, c or f differ from their prediction; the oracle and the stream disagree on any row; or no comparison over the resident schema reproduces the rows.

**3b. Piece fixtures, predicted under A [under B].**

| fixture | predicted outcome |
|---|---|
| k3, as row b | open OK [refused `engine.geo_metadata`]; `covering()` None; bbox stream `NoCoveringBbox` with `leases_issued` unchanged; no-bbox stream ≥1 batch; sanity `none` with the no-format-rule reason, byte-unchanged |
| child-absent, as row c | as k3 |
| format default + covering absent (`FixtureSpec`, as at `engine/tests/admission_format_semantics.rs:445-464 @ bc357c28 sha256:b2541cf988f3dc06c2c40105b4c67fcd183b834430706b45ac9924c1cc269aa6`) | sanity `none` with R-S3's reason, byte-unchanged; `covering()` None; bbox `NoCoveringBbox` before any lease [refused at open] |
| the same with `with_geo_bbox` | sanity level `metadata`, unchanged; `covering()` None [refused at open] |
| M-4 (`mutations/ogr2ogr-epsg2056-default-covering-absent-columns.parquet`, verified against MANIFEST and DERIVATIONS) | open OK; `covering()` None; bbox `NoCoveringBbox` before any lease, detail naming `no_such_bbox_column` [refused `engine.geo_metadata`] |

**3c. The generated `engine/ADMISSION-RESULTS.md`, regenerated by its generator at the branch head, never hand-edited.**
- The generator's M-4 expectation (`engine/tests/admission_p4_corpus.rs:325-335 @ bc357c28 sha256:005b7ce4a06f0a4accb078e8191ea4c01ea60ed54a05ead40ecef4d468eb443b`) is unchanged.
- **Under A:**
  - Every row's observed and verdict cells, every Notes line and the Totals are byte-identical. Only the header's commit and date lines move.
  - M-4 stays DEVIATION. Its note (`engine/ADMISSION-RESULTS.md:46 @ bc357c28 sha256:7840e2ebac6a85f2517fd06b23f754899a822f8ab5c45aa9576cd4df784f9cbb`) is unchanged, because R-S3's reason placement is unchanged.
- **Under B:**
  - M-4's observed cell reads refused-by-name `engine.geo_metadata`, with verdict DEVIATION against the registered admitted prediction. The prediction is never edited.
  - Totals: admitted-as-declared 8→7, refused-by-name 6→7.
  - Every other row is unchanged.

## §4. Tests, one mutation each

Each mutation is observed by applying it, running the named test, recording its failure by name with the commit, and reverting it (round 25, item 2 (c)). A `verify-mutation` run is not an observation.

Engine, new file `engine/tests/covering_names_missing_column.rs`:
- **C-1** `a_covering_naming_a_column_the_file_lacks_is_unusable_and_a_bbox_query_refuses_before_any_lease` (k3).
  - Asserts §3b's k3 row.
  - The detail contains `nobbox.xmin`, contains neither the no-covering text nor `U+0000`, and is never `Query`.
  - `build_index` and `build_row_group_index` return `NoCoveringBbox`.
  - Mutation: the decision's `Absent` arm returns none.
- **C-2** `a_covering_naming_an_absent_child_under_an_existing_struct_is_unusable` (row c). Mutation: the walk checks only the first segment.
- **C-3** `the_covering_decision_agrees_with_the_binder_on_every_p0_row` (rows a to g).
  - For each row, `covering().is_some()` equals the oracle's bind outcome.
  - Where the covering is kept, a bbox stream drains with no item error.
  - Mutation: the segment comparison is swapped for the rule the P0 did not select.
- **C-4** `a_format_rule_file_whose_covering_names_an_absent_column_keeps_its_sanity_record_and_refuses_a_bbox_query_pre_lease` (both format-default rows).
  - Mutation: `sanity_check` ignores the decision passed in, treating it as none.
- **C-5** `m4_the_corpus_mutation_opens_with_its_covering_unusable_and_refuses_a_bbox_query_pre_lease`.
  - `#[ignore]`, run explicitly by the tester.
  - Mutation: as C-1.

Kernel, appended to `kernel/tests/skp_projection.rs` after N-13, on its harness (`kernel/tests/skp_projection.rs:834-835 @ bc357c28 sha256:7c2d0f322924e4c22af450dd3f56204857ae14356389bd6b37e0180d805970f6`):
- **K-1** `a_covering_naming_a_column_the_file_lacks_refuses_a_bbox_viewport_query_before_the_mint_and_describe_reports_no_covering` (k3).
  - `describe.covering_bbox` is false.
  - `viewport_query` returns code `engine.no_covering_bbox` with a `fields` key set of exactly {detail}, and the message is the engine's Display text.
  - `cancel_all_for_dataset` returns 0 and `leases_issued` is unchanged.
  - A no-bbox `viewport_query` still mints.
  - Mutation: as C-1.

Under B, C-1 and K-1 are replaced:
- **C-1B** `a_covering_naming_a_column_the_file_lacks_refuses_the_open_by_name`. Mutation: the refusal arm is removed.
- **K-1B** `open_dataset_refuses_a_covering_naming_a_column_the_file_lacks_with_its_typed_code`. Mutation: as C-1B.
- `admission_format_semantics.rs:446` is changed as 2c says.

**Unchanged and green without edit:**
- `admission_format_semantics.rs:446` (under A);
- N-13 and N-14 (`engine/tests/b1_projection_hostile_covering.rs:140`, `:235`) and N-13's kernel half;
- `kernel/tests/typed_terminal_codes.rs::the_prefix_is_the_convention_for_every_engine_refusal_not_a_special_case`;
- every shell test.

## §5. Predictions, declared unchanged, invalidators, falsification

- **Predictions:** §3a's hypotheses (rows d, e) and §3b and §3c. A wrong prediction is a result, recorded as class 2.
- **Declared unchanged:**
  - every sanity level and reason for every existing fixture and corpus row;
  - the U+0000 reasons and details;
  - the no-covering detail text;
  - `describe` for every file whose covering is usable or absent-by-declaration;
  - `build_sql` for every usable covering;
  - `EngineError`'s variants and Display texts; `error_of`;
  - the shared describe fixtures (`covering_bbox: true`);
  - `engine/src/layout.rs`'s own `covering_of` (`engine/src/layout.rs:642-657 @ bc357c28 sha256:2faca6e99b90ba26886008329f601e77d0b8beb230bc64e0089e6cc3c4e4c4b5`), a test-support rewrite path that reads the `geo` key itself. Its exposure to such a file is a named residual, not fixed here;
  - B1's form; ADR-015, ADR-019 and ADR-023;
  - `protocol/data-plane/`, `protocol/skp/src`, `protocol/skp/tests` and `frontends/`, with empty diffs.
- **Declared changed:** 2b or 2c, according to OPEN-1. If the P0 selects a case rule, one more change follows: a format-rule file whose covering differs from its columns by case alone no longer records R-S3's reason, and reaches the statistics or sample level. This is expected and not asserted, and is recorded unrun in §6.
- **Invalidators** (stop and return to the architect):
  - §3a's invalidator;
  - any item declared unchanged moves;
  - the decision needs SQL at open;
  - a refusal cannot be made before the lease;
  - a new variant or code is needed.
- **Falsification:** at the pinned DuckDB, the binder resolves a covering path differently in a `WHERE` clause than in the oracle's select list.

## §6. Instruments

- Every outcome here is an assertion: typed outcomes, `leases_issued`, ticket counts, key sets and byte equality. There is no measurement.
- The no-statement-at-open property is structural: the decision function takes no `Connection`. The reviewer checks this in the diff.
- Unrun: the case-variant sanity consequence (§5), and publish's changed engine variant (2b), which is shown by code reading only.

## §7. Declared values and budget

- No constant is added or changed.
- Budget: at most 520 changed lines (insertions plus deletions) across at most 4 code and test files, by `git diff --numstat <merge-base>...HEAD -- engine/src engine/tests kernel/src kernel/tests protocol/skp/src protocol/skp/tests frontends/shell/src`.
- Outside the count:
  - this form;
  - `protocol/skp/SKP-V0.md`, `KNOWN-LIMITATIONS.md`, `engine/README.md`, `kernel/README.md`;
  - under B, `engine/ADMISSION-PREREGISTRATION.md`;
  - the generated `engine/ADMISSION-RESULTS.md`, `PLAN.yaml` and its generated set.
- An overrun is class 8, and this line is never edited.

## §8. Block-on-sight

1. Under A: a bbox query on such a dataset reaches a lease, a mint or a data-plane terminal.
2. Any P0 row on which the decision and the binder disagree. Row g's residual direction is decided only as Amendment 1 records it.
3. A second site deciding absence, or `sanity_check` calling either check itself.
4. Any byte change to an item declared unchanged.
5. A detail or reason that says the file declares no covering, for a covering the file declares; `U+0000` for an absent column; or `engine.query` from the bbox path for such a file.
6. A new variant, code, key or literal; a non-empty `protocol/data-plane/` diff.
7. An engine message stating another module's consequence.
8. A registered prediction edited, or `ADMISSION-RESULTS.md` edited by hand.
9. A `Connection` or a statement in the decision function.
10. Operator-visible wording other than the OPEN-2 placeholder or the human's sighted text.
11. Code before the OPEN-1 ruling and before Amendment 1.
12. OS-conditional code or an OS-keyed case rule (R4).
13. A new `pub` item.

## §9. Gates

- Full gating under the proportional rule (`state/directives/2026-10-05-product-first-direction.md`, section 2): a verdict fails only on Correctness or Evidence. Documentation findings are fixed in the same pull request before the merge.
- **Architect:**
  - §8 item by item;
  - the seams. Engine to kernel goes through `Dataset::covering()` and `NoCoveringBbox`, read on the branch and proved by K-1. Kernel to shell goes through the existing code. The consumer `reportViewportOutcome` is read and is unchanged.
  - the caller rule: the decision's only product caller is `open_inner`.
- **Reviewer:**
  - the full diff, with the diff stat over `protocol/data-plane/ protocol/skp/src protocol/skp/tests frontends/` shown empty;
  - each mutation observed;
  - discharge claims resolved;
  - the owner's-index lines checked against the diff.
- **Suites:**
  - `cargo test --workspace`;
  - the tester runs C-5 and the P4 generator explicitly;
  - the `node --test` scripts suite; `verify:plan`, `verify:cites`, `verify:quotes`.
- **Heavy runs** follow the machine paragraph the worker's and tester's briefs carry (`state/directives/2026-10-06-machine-script-adopted.md`, lines 12 to 22). This form names no other rule for them.
- **Operator:** none. The strings are the human's under OPEN-2.
- **Owner's index** (the pilot's §1 item 2). lead-data supplies the update before the final gate; the worker applies it in this pull request.
  - `engine/README.md`, Owner's index:
    - Last verified at;
    - Interfaces this module owns, the Open and admission line: add `Dataset::covering` to the interfaces, and C-1 to the pins;
    - Governed by, preregistrations: add this form.
  - `kernel/README.md`, Owner's index:
    - Last verified at;
    - Interfaces this module owns, the SKP v0 host line: add K-1 to the pins;
    - Governed by, kernel halves of pieces filed elsewhere: add this form.
- **Record:** the gate reports are filed under `state/consults/gates/`. The closing amendment is references and hashes only.

## §10. Amendments

*(none; this section opens empty and is append-only from the first commit. Amendment 1 is the P0's result, class 1.)*

### OPEN items (the human's; ruled by typed word)

- **OPEN-1 (red line):** drop the covering at open (A, recommended), or refuse the open (B). Keeping today's behaviour is not offered: the human graded this S1.
- **OPEN-2 (P6):** the wording of the new detail (A) or the refusal (B), and the sentence for KNOWN-LIMITATIONS item 9.

### Amendment 1 — the P0's result (class 1), written after the P0 was seen and before any code

*Written by the custodian after the outcome was seen of the P0, which ran at e73a594c7011707b03271f5921c4dc3b1e58e214, and before any code. References and hashes only.*

1. **The record:**
   - the run's output: `state/drafts/covering-names-missing-column-p0/p0-output.txt`, sha256 4b2a623b24a58e07d9f29ee637dbbfa86b925c512947c26c99087c446bd3465c;
   - the scratch test, untracked and deleted after the run: `state/drafts/covering-names-missing-column-p0/p0-test.rs.txt`, sha256 c785ec17d52cae1545b38b795106d0f713431022aadc2697111c9b61da178bff;
   - the worker's report: `state/consults/2026-10-09-covering-names-missing-column-p0-worker-report.md`, sha256 8955c419fd88de94844a63aec983450497859938124cd2be27794f975617715e from its line 5.
2. **The rows against §3a:**
   - a binds; b, c and f fail to bind. All four match their predictions.
   - d and e both bind.
   - g fails to bind.
   - The oracle and the bbox stream agree on every row. The open succeeds on every row, with the covering kept, as the root cause in §0 says.
3. **The invalidator** in §3a did not fire.
4. **The selected rule (§3a's selection rule):** d and e both bind, so the comparison is case-insensitive at both levels. g fails to bind, so the folding is ASCII-only. The walk in §2a compares each segment with ASCII case-insensitive equality.
5. **Not covered by the P0:** a non-ASCII child name, and a schema holding two names that differ only by case.
6. **Code waits only for** the human's typed ruling on OPEN-1.

### Amendment 2 — the human's rulings on OPEN-1 and OPEN-2, and two cases added to may-not-claim (class 5)

*Written by the custodian after the human's typed rulings were received (08:37:12Z by the transcript) and before any code. It records the human's rulings on this form's open items. It is this form's Amendment 2, because Amendment 1 is the P0's record. References only; nothing below is a quotation.*

1. **The ruling:** state/directives/2026-10-09-rulings-on-the-eight-forms.md:15-20 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:de4805206b7dee15864a1ded0f209bcc786b774d5721f08700f10b48faa9b65d.
2. **OPEN-1 is (A): the file opens and the covering is dropped at open.** Branch A (§2b) applies. Branch B (§2c), its tests C-1B and K-1B, and the bracketed predictions in §3b and §3c are void.
3. **OPEN-2 is (a): the human's wording, now, so no placeholder ships.**
   - The `NoCoveringBbox` detail is the text at line 18 of the ruling file, with `<path>` rendered through `render_visible_escape` as §2b says.
   - KNOWN-LIMITATIONS item 9 gains the sentence at line 19 of the ruling file, appended.
   - §8 item 10 reads against these two texts.
4. **§1's may-not-claim gains two items:** how a covering with a non-ASCII child name binds; and a schema holding two names that differ only by case. PLAN gained the proposed node `covering-case-collision-binds-other-column` for the second, which the human grades and places later. It does not block this piece.
5. **Code waits on nothing further:** Amendment 1, item 6's condition is met by item 2.
6. **Superseded index:** the OPEN items list → items 2 and 3; §2b's placeholder wording → item 3; §1's may-not-claim → item 4. Nothing above is edited.

### Amendment 3 — the §7 budget overrun (class 8), written after the build was seen

*Written by the custodian after the worker's build was seen, and before the gates. It records a budget overrun. §7 is not edited. References and hashes only.*

1. **The record:**
   - the worker's report: `state/consults/2026-10-09-covering-names-missing-column-worker-report-1.md`, sha256 1e62707a0cefdffe38c2c4fbc22fb11c271625ec2e62bc97fd3dafdbb93ec503 from its line 5;
   - the branch `cut/covering-names-missing-column`, head a06a746b73586765bbeff8cab40ec25cf6cbfd64, merge base 76a09d5ce2ebe252034bccde5cb447163c6b8118.
2. **The count, by §7's own command at that head, recomputed by the custodian:** 636 changed lines in 3 files, against at most 520 lines in at most 4 files. The overrun is 116 lines; the file count is within its cap.

   | File | Insertions | Deletions |
   |---|---|---|
   | `engine/src/dataset.rs` | 114 | 51 |
   | `engine/tests/covering_names_missing_column.rs` | 366 | 0 |
   | `kernel/tests/skp_projection.rs` | 105 | 0 |

3. **Where it went,** by the report: the new engine test file (C-1 to C-5), with the seven-row C-3 table, two format-default fixtures, C-5's manifest reads and the helpers. Nothing was trimmed and no test was dropped.
4. **One line outside the count, in a file §7 names:** an HTML comment under KNOWN-LIMITATIONS item 9's new sentence. It says that the sentence describes the tree after this piece lands, not the v0.1.0 artifact that the next comment pins. It is kept, because without it the next comment would read as covering the new sentence. It is not operator wording. The rendered item shows only the sentence, which is byte-identical to line 19 of `state/directives/2026-10-09-rulings-on-the-eight-forms.md` after that line's lead-in.
5. **Still owed before the final gate:** lead-data's owner's-index update (§9), which a worker applies in this piece's pull request.

### Amendment 4 — Amendment 3's two references made exact (class 3), after PR #197's architect gate 1

*Written by the custodian after that gate's documentation finding D1 (`state/consults/gates/2026-10-09-covering-names-missing-column-gate1-architect.md`). References only.*

Amendment 3, item 1's sha256 is of `state/consults/2026-10-09-covering-names-missing-column-worker-report-1.md` as added to main by d007a50bbc01e599229a48c70ca726eddec3a4d8. Amendment 3, item 4's ruling sentence is the fifth line of the span that Amendment 2, item 1 pins, read after that line's lead-in. Nothing above is edited.

### Amendment 5 — the close (class 1; class 8 for one line), after both gates

*Written by the custodian after both gates passed, before the human's merge click. References and hashes only.*

1. **The gates.** Correction round 1 of 2 was used.
   - Architect gate 1: FAIL, on E1 only. `state/consults/gates/2026-10-09-covering-names-missing-column-gate1-architect.md`, gate-log 452.
   - Architect gate 1, attempt 2: PASS. `state/consults/gates/2026-10-09-covering-names-missing-column-gate1-architect-attempt-2.md`, gate-log 453.
   - Reviewer gate 1: PASS. `state/consults/gates/2026-10-09-covering-names-missing-column-gate1-reviewer.md`, gate-log 455.
2. **The head:** 4e77715c7531e35d8fb3ee82c836ead307e794bd. It is a06a746b plus two commits:
   - 9340c5f8: the owner's-index update, README lines only (`state/consults/2026-10-09-covering-names-missing-column-worker-report-2.md`);
   - 4e77715c: the E1 fix, doc-comment lines only.
3. **The count, class 8, by §7's command at the head:** 637 changed lines in 3 files, against 520 lines in 4. The breakdown:
   - `engine/src/dataset.rs`: 115 insertions, 51 deletions;
   - `engine/tests/covering_names_missing_column.rs`: 366 insertions, 0 deletions;
   - `kernel/tests/skp_projection.rs`: 105 insertions, 0 deletions.

   The one line over Amendment 3's 636 is the E1 comment. §7 is not edited.
4. **The suites:**
   - tester report 1, `state/consults/2026-10-09-covering-names-missing-column-tester-report-1.md`, sha256 cbff60af5614df3890288dd6b5cf13727ab64d7edd285659cade8d2504a2ba5a from its line 5, as added to main by a58b255a610fb18c2a46de54cce4f78d23ef1a4e;
   - the reviewer's re-runs at the head, in its report.
5. **Corrections, by reference:**
   - Amendment 1, item 1's three hashes are of the files as added to main by c7bc58979240d842eb02ccf41428e1b974e5053c.
   - Tester report 1 gives the second test that its K-1 filter ran a name that no function has. The reviewer gate's DOC-3 gives the right name. The result, 2 passed, stands.
6. **Superseded index:**
   - Amendment 1, item 1's hash references → item 5;
   - Amendment 3, item 1's hash reference and item 4's line cite → Amendment 4;
   - Amendment 3, item 2's count → item 3;
   - Amendment 3, item 5's owed update → item 2, as done at 9340c5f8.

   Nothing above is edited.
