*Custodian's filing note (2026-10-09): the architect's draft of `covering-names-missing-column`'s preregistration, on the custodian's brief at main bc357c28, after lead-data's impact read (measured piece 5 of the second pilot). It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 3907474ba9b318be4cd6575589039ac4fb6c4e0633199d1522c65c7813bb37c8. Write audit PASS: zero write calls (Read 63, Grep 21, SubagentHandback 1). Run window from the transcript: 2026-10-09T05:29:15Z to 05:39:46Z. The form as committed, `engine/COVERING-NAMES-MISSING-COLUMN-PREREGISTRATION.md`, is part 2's block with its 34 pins computed at bc357c28, each pinned span's first and last line checked by the custodian (sha256 f64153c209ed6635777e28015f8d22709b102e725b174c0127705348d5f67baa). One mechanical change: in §2b, the pin written as a continuation after an unpinned `engine/src/dataset.rs:734-738` would have resolved to the last pinned file, `kernel/src/skp.rs`, so it is written with its path, `engine/src/dataset.rs:850-853`. Two other continuations resolved to the file they follow and are written with their paths. The five reuse-index lines in §0 match a fresh run of the tool at 89bbac37 byte for byte; the labels before them and their alignment are the architect's layout.*

---

Reviewed: main @ bc357c28

## 1. Form, gating route, and what is the human's

**Form: the full form, with full gating from dispatch** (`AUTONOMY.md` §21a, §25(e)). No five-line form is committed for this piece. The form file is `engine/COVERING-NAMES-MISSING-COLUMN-PREREGISTRATION.md`. The engine owns the decision. The kernel half is filed by reference, the way `kernel/README.md`'s owner's index already lists other kernel halves filed elsewhere.

Why the full form:
- **§21a categories touched.**
  - The wire: a dated note in `protocol/skp/SKP-V0.md` §8, and `describe.covering_bbox` and `viewport_query`'s refusal route both change for a class of files.
  - A stated guarantee: the `viewport_query` entry in SKP-V0 §1 says `NoCoveringBbox` is refused before any handle is minted. R-S3's open-succeeds outcome is a property under test, at `engine/tests/admission_format_semantics.rs:446`.
  - No ADR is touched, and security posture is not touched.
  - So the `Out-of-scope` line would have to name categories as touched, and §25(e) requires the full form from dispatch.
- **§21c, counting tests:** about 490 changed lines of code and tests across 3 to 4 files, against the 150-line bound. The piece also brings new user-visible behaviour, which §21c's fourth bound excludes.

**Q5 (wire):** `describe.covering_bbox` turning false for such a file is not a literal bump.
- No key is added and the value domain is not widened. It stays a bool. Under the entry-30 addendum's versioning disposition (`protocol/skp/SKP-V0.md:641-658`), and following the no-literal-change dated notes at SKP-V0.md:971-979 and :1039-1049, the literal stays.
- It is still a wire touch, so it takes full gating, and it is recorded as a dated note.
- No `v0-error-no_covering_bbox.json` fixture is owed: there is no new code and no bump. The kernel test K-1 asserts the live refusal's real shape (code, a key set of exactly {detail}, and the message as the engine's own Display text).

**The human's decisions:**
- **OPEN-1 (red line):** drop the covering at open, or refuse the open.
- **OPEN-2:** the wording of the new text (P6).

**One choice is mine:** M-4's generated row stays DEVIATION. I keep R-S3's reason placement, which is symmetric with A2-1's U+0000 row. The human may override this at sight.

**One correctness risk the brief did not name:** DuckDB binds identifiers without regard to case. B1 Amendment 12's E5 records the case-dedup renames, and B1 carries the control test `hostile_names_colliding_after_case_folding_bind_one_column_each`. `field_path_exists` compares bytes. If the drop used it unchanged, a covering that differs from its column only by case would be dropped, though its bbox query works today. That would be a regression. The form therefore carries a binder-agreement P0 and a test.

## 2. The draft

````markdown
# A covering that names a column the file lacks — preregistration (PLAN node `covering-names-missing-column`)

**Authority:** PLAN node `covering-names-missing-column` (`PLAN.yaml`, the node's block, @ bc357c28), placed and graded S1 by the human's direction of 2026-10-09 (`state/directives/2026-10-09-slot-orders-pilot-and-reuse-standing-step.md`, items 3a and 4); filed on the 2026-09-29 sightings (`state/directives/2026-09-29-a2-1-and-b-1-sightings.md`, A2-1 paragraph, item (c)). Measured piece 5 of the lead-data second pilot (`state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md`, §2 and §4).
**Drafted by** the architect agent on the custodian's brief, read at main bc357c28, after lead-data's impact read (`state/consults/2026-10-09-covering-names-missing-column-impact-read.md`).
**Committed before any code.** No code lands before (i) the human's typed ruling on OPEN-1 and (ii) Amendment 1 recording the P0 (§3a). **Append-only once committed;** an amendment made after any outcome has been seen says so in its first line.

## §0. Disclosure

- **Evidence (evidence, not Authority):** `state/drafts/a2-1-p0/covering-output.txt:19-23 @ bc357c28 sha256:HASH-TBD` (k3: the open succeeds with the covering present; the bbox stream fails at item 0 with an `execute:` binder error naming `nobbox`; the no-bbox stream is OK). Writer: `state/drafts/a2-1-p0/covering-probe.rs.txt:51-58 @ bc357c28 sha256:HASH-TBD` (k3 declares an LV95 PROJJSON CRS), case row `:94 @ bc357c28 sha256:HASH-TBD`.
- **Root cause, confirmed in code:**
  - The stored covering drops only a U+0000 path (`engine/src/dataset.rs:567-581 @ bc357c28 sha256:HASH-TBD`).
  - The absent-column fact is computed only inside `sanity_check`'s R-S3 branch (`engine/src/dataset.rs:1247-1266 @ bc357c28 sha256:HASH-TBD`), which is reached only by a format-rule file with no geo `bbox` member. Two earlier returns skip it:
    - the no-format-rule return (`engine/src/dataset.rs:1198-1209 @ bc357c28 sha256:HASH-TBD`), taken by k3 and M-4, which declare their own CRS;
    - the geo `bbox` member return (`engine/src/dataset.rs:1217-1226 @ bc357c28 sha256:HASH-TBD`).
  - Nothing reaches `Dataset::covering()` (`engine/src/dataset.rs:977-983 @ bc357c28 sha256:HASH-TBD`). `build_sql`'s gate (`engine/src/stream.rs:1477-1480 @ bc357c28 sha256:HASH-TBD`) therefore passes, the lease is taken (`engine/src/stream.rs:1221 @ bc357c28 sha256:HASH-TBD`) and the kernel mints (`kernel/src/skp.rs:1465-1488 @ bc357c28 sha256:HASH-TBD`) before the binder fails.
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
  - None names a covering-path-absent case, and none is needed: the in-tree writer `engine::fixture::write_hostile_covering` (`engine/src/fixture.rs:1665-1676 @ bc357c28 sha256:HASH-TBD`) builds every row here.
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

**2a. One decision at open, common to both branches.** `open_inner` calls one private function, once, after `check_geometry_column` (`engine/src/dataset.rs:427-428 @ bc357c28 sha256:HASH-TBD`) and before `sanity_check` (`engine/src/dataset.rs:516-524 @ bc357c28 sha256:HASH-TBD`).
- **Inputs:** the declared covering and the resident `file_schema`, which already carries DESCRIBE's bound names (`engine/src/dataset.rs:1100-1156 @ bc357c28 sha256:HASH-TBD`).
- **No `Connection` parameter.** It issues no SQL statement.
- **Result:** a private enum.
  - `NotAddressable { reason }`: the existing U+0000 check, `covering_not_addressable_reason` (`engine/src/dataset.rs:1362-1386 @ bc357c28 sha256:HASH-TBD`), checked first and unchanged.
  - Otherwise `Absent { path }`: the first of xmin, ymin, xmax, ymax, in that order, that the schema walk does not resolve.
  - Otherwise none.
- **The walk** is `field_path_exists` (`engine/src/dataset.rs:1388-1408 @ bc357c28 sha256:HASH-TBD`), with the segment comparison the P0 selects (§3a): byte equality, or the case rule the binder showed. The rule is DuckDB's binder rule, never a filesystem's or an OS's.
- **One decision site.** `sanity_check` takes this result as a parameter and stops calling either check itself; its two reason texts (`engine/src/dataset.rs:1239-1245` and `:1247-1266 @ bc357c28 sha256:HASH-TBD`) stay byte-identical, at the same position in its order. No other function decides absence. `engine/src/addressability.rs`'s single not-addressable classifier is untouched; absence is a different fact.

**2b. Branch A (conditional: applies only if OPEN-1 rules A, drop at open).**
- `Absent` stores the same as `NotAddressable`: `covering = None`, and the absence is kept in the existing `covering_unusable_reason` field (`engine/src/dataset.rs:148-154 @ bc357c28 sha256:HASH-TBD`).
- `no_covering_bbox_detail` (`engine/src/dataset.rs:985-997 @ bc357c28 sha256:HASH-TBD`) names the absent path. The wording is the P6 placeholder of OPEN-2, in the kernel's braced form (`kernel/src/skp.rs:1447-1449 @ bc357c28 sha256:HASH-TBD`). The path is rendered through `render_visible_escape`.
- The detail never says the file declares no covering, and never names U+0000 for an absent column.
- **Consumers, none edited:**
  - `build_sql`'s gate refuses `NoCoveringBbox` before any lease.
  - `build_index_observed` and `build_row_group_index_observed` (`engine/src/dataset.rs:734-738`, `:850-853 @ bc357c28 sha256:HASH-TBD`) refuse with the same detail, before the content hash.
  - The kernel's pre-mint route (`kernel/src/skp.rs:1455-1471 @ bc357c28 sha256:HASH-TBD`) and `error_of`'s arm (`kernel/src/skp.rs:2103-2104 @ bc357c28 sha256:HASH-TBD`) return `engine.no_covering_bbox` synchronously.
  - `describe.covering_bbox` (`kernel/src/skp.rs:1975 @ bc357c28 sha256:HASH-TBD`) reads false.
  - The slice-host banner (`kernel/src/main.rs:119-127 @ bc357c28 sha256:HASH-TBD`) prints its existing no-covering line, which becomes true for such a file.
  - Publish with a bbox (`kernel/src/publish/mod.rs:731 @ bc357c28 sha256:HASH-TBD`) gets `NoCoveringBbox` instead of a mid-stream `Query` failure, at the same point in its sequence, before any partition is written.
  - The shell's existing synchronous refusal path (`frontends/shell/src/App.tsx:1236-1273 @ bc357c28 sha256:HASH-TBD`) shows the code; the shell has no code change.
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
- Basis: the entry-30 addendum's disposition (`protocol/skp/SKP-V0.md:641-658 @ bc357c28 sha256:HASH-TBD`).

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
| format default + covering absent (`FixtureSpec`, as at `engine/tests/admission_format_semantics.rs:445-464 @ bc357c28 sha256:HASH-TBD`) | sanity `none` with R-S3's reason, byte-unchanged; `covering()` None; bbox `NoCoveringBbox` before any lease [refused at open] |
| the same with `with_geo_bbox` | sanity level `metadata`, unchanged; `covering()` None [refused at open] |
| M-4 (`mutations/ogr2ogr-epsg2056-default-covering-absent-columns.parquet`, verified against MANIFEST and DERIVATIONS) | open OK; `covering()` None; bbox `NoCoveringBbox` before any lease, detail naming `no_such_bbox_column` [refused `engine.geo_metadata`] |

**3c. The generated `engine/ADMISSION-RESULTS.md`, regenerated by its generator at the branch head, never hand-edited.**
- The generator's M-4 expectation (`engine/tests/admission_p4_corpus.rs:325-335 @ bc357c28 sha256:HASH-TBD`) is unchanged.
- **Under A:**
  - Every row's observed and verdict cells, every Notes line and the Totals are byte-identical. Only the header's commit and date lines move.
  - M-4 stays DEVIATION. Its note (`engine/ADMISSION-RESULTS.md:46 @ bc357c28 sha256:HASH-TBD`) is unchanged, because R-S3's reason placement is unchanged.
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

Kernel, appended to `kernel/tests/skp_projection.rs` after N-13, on its harness (`kernel/tests/skp_projection.rs:834-835 @ bc357c28 sha256:HASH-TBD`):
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
  - `engine/src/layout.rs`'s own `covering_of` (`engine/src/layout.rs:642-657 @ bc357c28 sha256:HASH-TBD`), a test-support rewrite path that reads the `geo` key itself. Its exposure to such a file is a named residual, not fixed here;
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
````

## 3. OPEN items

**OPEN-1: what a declared covering naming a column the file lacks does** (R-S3's open choice; §12d; entry 73 (c), unruled).
- **Options:**
  - **(A) Open, and drop the covering.** This keeps R-S3's open-succeeds outcome and has the same shape as the sightings' ruling (c) for U+0000. Bbox queries refuse `engine.no_covering_bbox` before the mint. No-bbox streams and publish without a bbox keep working.
  - **(B) Refuse the open** with `engine.geo_metadata`. This overrides R-S3 as registered and changes the test at `admission_format_semantics.rs:446`. M-4 becomes a refusal row, and a file whose geometry streams fine becomes unopenable.
  - **(C) Keep today's behaviour:** rejected. It breaks the SKP-V0 §1 clause the human graded S1, and it fails the won't-fix bar (section 3 of the 2026-10-05 product-first direction), because it breaks a stated guarantee.
- **Recommendation: A.** It is the least destructive, it is consistent with A2-1, and it makes no registered rule move.
- **Red line: yes.** It is an OPEN-block resolution under `AI_DEVELOPMENT.md`'s red-line list, and option B is also a preregistration override. The custodian holds it and the ruling is typed.
- **What waits:** all code, and the choice between C-1 and K-1 or C-1B and K-1B. The P0 does not wait.

**OPEN-2: the operator-visible text** (§12d; the template's §1).
- **What is needed:**
  - under A, the `NoCoveringBbox` detail naming the absent path, shown inside the existing Display text;
  - under B, the `GeoMetadata` refusal text;
  - in either case, one sentence for KNOWN-LIMITATIONS item 9.
- **Architect's proposals for sight. These are not the human's words.**
  - The detail: the covering names `<path>`, which the file's schema does not contain.
  - Item 9 under A: such a covering is treated as no covering for a bbox query.
- **Options:**
  - (a) The human gives the wording with the OPEN-1 ruling. Recommended: one string and one sentence, and no braced placeholder ships.
  - (b) Code lands with the braced placeholder, and the text is sighted at the next P6 sitting.
- **Red line:** no. The wording is reserved to the human, but it is not on the red-line list.
- **What waits:** under (a), the merge; under (b), nothing.

**Not OPEN (recorded).** No reuse-index ADOPT or PORT is proposed; the in-tree writer covers every row. M-4's DEVIATION is kept by the architect's choice: moving R-S3's reason ahead of the no-format-rule return would turn M-4 to as-predicted, but would change declared-CRS sanity reasons and break symmetry with A2-1's U+0000 row. The human may override this at sight.

## 4. Files read, and the impact read's pointers

**Read (at bc357c28, working tree clean for tracked files):**
- The impact read, whole.
- `PLAN.yaml` 3330-3359.
- The 2026-10-09 direction, whole.
- The 2026-09-29 sightings, whole.
- `covering-output.txt` and `covering-probe.rs.txt`, whole.
- `engine/src/dataset.rs` 130-179, 300-619, 715-744, 840-859, 965-1004, 1095-1419, 1830-1862.
- `engine/src/geoparquet.rs` 300-359, 600-659.
- `engine/src/stream.rs` 1140-1274, 1405-1494, 1585-1619, 1685-1699.
- `engine/src/error.rs` 95-119, 330-345.
- `engine/src/layout.rs` 630-664.
- `engine/src/fixture.rs` 478-491, 770-791, 1640-1719.
- `engine/tests/admission_format_semantics.rs` 425-486.
- `engine/tests/b1_projection_hostile_covering.rs`, whole.
- `engine/tests/admission_p4_corpus.rs` 280-359, plus a grep.
- `engine/ADMISSION-RESULTS.md` 1-60.
- `engine/ADMISSION-PREREGISTRATION.md` 50-139, 225-239.
- `engine/B1-PROJECTION-PREREGISTRATION.md` 778-1011.
- `protocol/skp/SKP-V0.md`: headings; 60-119, 319-338, 495-504, 541-550, 641-660, 745-756, 925-1054.
- `kernel/src/skp.rs` 1370-1494, 1965-1979, plus a grep.
- `kernel/src/main.rs` 110-134.
- `kernel/src/publish/mod.rs` 715-744.
- `kernel/tests/skp_projection.rs` 780-904.
- `frontends/shell/src/App.tsx` 1236-1275.
- `frontends/shell/src/streaming/viewportStreamManager.ts` 175-222.
- `frontends/shell/src/App.layout.test.tsx` 450-457, plus shell greps for `no_covering_bbox`.
- `KNOWN-LIMITATIONS.md` 106-119, 252-266, plus a grep of item headings.
- `DECISIONS-PENDING.md`, entry 73 and its RULED mention (by grep).
- `AI_DEVELOPMENT.md` 39-51.
- `AUTONOMY.md` §21 to §22 (306-391), §23 to §25 (468-482).
- `docs/PREREGISTRATION-TEMPLATE.md`, whole.
- `docs/08_Testing.md`, whole.
- The pilot V2 directive, whole.
- The 2026-10-05 product-first direction, whole.
- The machine directive, whole.
- `PORTABILITY-2026-09-30.md`, whole.
- `engine/README.md` 490-528; `kernel/README.md` 340-385.
- `C:/dev/spatial-ide-reuse/REUSE-ROUND-1.md`, grep rows 152-267, read-only.

**Pointers used:** nearly all of the read's §0 to §3.
- dataset.rs: :148-154, :516-524, :567-581, :977-997, :1198-1209, :1239-1266, :1362-1408, :734, :850.
- stream.rs: :1209, :1221, :1477-1480.
- error.rs: :102-106, :338-342.
- skp.rs: :1455-1488, :1975, :2103-2104.
- main.rs: :119-127.
- publish: :731.
- layout.rs: :642-657.
- fixture.rs: :775-786, :1665-1671.
- Tests: N-13 and N-14, :446, the generator :325-335, ADMISSION-RESULTS :26 and :46.
- B1 Amendment 12 items; SKP-V0 :80, :107-111, :945-950; KNOWN-LIMITATIONS items 9 and 22; App.tsx :1236-1273; owner's-index lines.
- Its five questions shaped §2h.

**Found wrong:** none. Each pointer checked resolved at bc357c28.

**Missing:**
1. A second early return before R-S3: the geo `bbox` member branch (`engine/src/dataset.rs:1217-1226`). Question 1 names only the no-format-rule return.
2. DuckDB binding identifiers without regard to case, against `field_path_exists`'s byte comparison. B1 Amendment 12, 12.0 E5 records the case-dedup renames, and B1's control test `hostile_names_colliding_after_case_folding_bind_one_column_each` shows that case matters. This drives the P0 and C-3.
3. The versioning texts Q5 needs: SKP-V0's entry-30 addendum (:641-658) and the no-literal-change dated notes (:971-979, :1039-1049).
4. `engine/src/addressability.rs:23`, the single not-addressable classifier rule, which bounds where the new decision may live.
5. The shell's mocked `engine.no_covering_bbox` refusals use `fields: {}`, while the real shape carries `{detail}`. This is a pre-existing imagined shape in tests. The shell reads only the code, so it is not this piece's seam; noted for the custodian.
6. The red-line list (`AI_DEVELOPMENT.md:39-51`), which OPEN-1's classification needs. It is arguably outside an impact read's remit.
