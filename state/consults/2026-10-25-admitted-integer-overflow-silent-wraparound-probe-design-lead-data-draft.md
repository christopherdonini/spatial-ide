*Custodian's filing note (2026-10-25): lead-data's read-only design of the O1 probe for `admitted-integer-overflow-silent-wraparound`, read at main fb361420, by the human's ruling (`state/directives/2026-10-25-filler-entry-5-open-1-a-pr-b-open-1-2-3-a-o1-probe-lead-data-designs-tester-high-runs.md`, item 3): lead-data designs, a tester-high runs it under the machine rules with nothing committed, and lead-data reads the results. The custodian's choices on its open items, before dispatch: OPEN-1 (a), OPEN-2 (a), OPEN-3 (a) and OPEN-4 (a), each as recommended; the throwaway checkout C:/dev/wt/o1-probe, detached at fb361420, was made by the custodian. The run 17:26:41Z to 17:40:34Z by its transcript (Grep 18, Read 34, Glob 1; no write tool). Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is cb09fc3857d1ffc445aad478478202fafe1deea61ee97453f10fc7b0e2626d35.*

---

Designed: admitted-integer-overflow-silent-wraparound, the O1 probe, at main fb361420

*About the wording: everything here is my own text, except text in double quotation marks, which is byte-copied from the line cited beside it. Predicates, SQL, file names and commands in code spans are text I designed. Cites are repo-relative `path:line @ fb361420`, read in the main checkout, whose `.git/refs/heads/main` reads fb361420f512d2f631e29d4e2f9fcc5e5d2fd2be. I have no shell, so this report carries no sha256.*

**What is being graded.** The human's sentence is "I grade on the report: S1 if a predicate the engine admits can return the wrong rows with no error." (`state/directives/2026-10-25-255-route-b-o1-lead-data-probe-session-end-lines-s2-context-monday-no-redaction-pr.md:12 @ fb361420`). The runner is a tester-high, and I read the results (`state/directives/2026-10-25-filler-entry-5-open-1-a-pr-b-open-1-2-3-a-o1-probe-lead-data-designs-tester-high-runs.md:12 @ fb361420`).

**The reviewer's two cases** (`state/consults/gates/2026-10-24-stream-evaluation-failure-fixed-detail-gate1-reviewer.md:43-49 @ fb361420`):
- "`v * v < 0` returned exactly the 1,024 rows whose v is ±(4,000,000,000+i). A square is never negative." (line 45)
- "On a 2,048-row file where only the last row has v = 4,000,002,047, `v * v > 0` returned 0 rows instead of 2,046, again with no error." (line 46)
- The operands that did raise were near 3.6e18 (line 16, line 32).

**Reuse index:** both lookups returned "No prior art recorded". The design draws on no reuse record; that is the miss, noted here.

## Background read for the design (pointers)

- **Entry point.** `Dataset::stream_with_cancel` (`engine/src/stream.rs:919-936 @ fb361420`) streams only `id` and the geometry column, unordered, with the index off, through `stream_inner` (`:1153`) and `build_sql` (`:1424`).
- **The SQL it composes.** `SELECT <id> AS "id", <geom> FROM read_parquet(?)` (`:1440-1445`). The predicate goes in verbatim inside one pair of parentheses (`:1451-1452`):
  - with a bbox, it is followed by ` AND ` and the four covering comparisons (`:1704-1711`);
  - with no bbox, it is the whole `WHERE` (`:1712-1717`).
  - The file path is a bound parameter, so DuckDB plans the scan when the statement executes (`:1802-1805`).
- **Where errors are classified** (`classify`, `:2615-2623`):
  - prepare (`:1799-1801`);
  - execute, inside `stream_arrow` (`:1837-1857`);
  - fetch, the `catch_unwind` around `next()` (`:1909-1936`).
  - A message starting with DuckDB's out-of-range label becomes `OUT_OF_RANGE_DETAIL` (`:2602`, `:2608-2610`).
- **Admission.** `AdmittedPredicate::admit` (`engine/src/predicate.rs:115-207 @ fb361420`) runs the structural, namespace and bind stages, then the type walk (`:189`, `:195`).
  - Bind prepares against a zero-row surrogate of `CAST(NULL AS <type>)` columns (`:1347-1351`) and refuses anything not BOOLEAN (`:1377-1381`).
  - In the type walk, integer `*` integer is admitted under rule 3 (`:2078-2079`).
  - `IS [NOT] NULL` takes any typed operand (`:1885-1892`, `:2483-2492`).
- **Tests already in place.**
  - T1 admits `i64 * i64 > 0` and expects the fixed detail (`engine/tests/admission_property_campaign.rs:1468-1486 @ fb361420`), on the viewport shape `ViewportQuery::viewport(...).with_limit(...).with_filter(p)` (`:1320-1352`).
  - The same comment says a comparison of `i64 * C` with a constant was seen completing (`:1455-1456`). This probe does not cover that.
  - The campaign's exclusion is at `:1031-1040`, and filter_type_admission's at `engine/tests/filter_type_admission.rs:1002-1005 @ fb361420`.
- **ADR-021.** "An integer overflow in `+`, `-`, `*` or unary `-` involves no conversion and is not decided here." (`docs/adr/ADR-021-row-filter-on-viewport-query.md:265 @ fb361420`). FILTER-BIND §2.5(d) is at `engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md:97 @ fb361420`.
- **Locked versions.** `duckdb` 1.10505.0 (`Cargo.lock:541-542 @ fb361420`), `libduckdb-sys` 1.10505.0 (`:1185-1186`), `parquet` 58.4.0 (`:1372-1373`), `arrow` 58.4.0 (`:68-69`). The engine's own comments call this DuckDB v1.5.5 (`engine/src/predicate.rs:1976 @ fb361420`). DuckDB is built from bundled sources (`engine/Cargo.toml:39 @ fb361420`).
- **Fixture writers.**
  - The arrow-rs writer is `spatial_engine::fixture::write_geoparquet` (`engine/src/fixture.rs:860 @ fb361420`). It sets the row-group size (`:984`) and statistics on or off (`:987-991`, `StatisticsMode` at `:108-113`). Ids run 0..N-1 (`:1055`).
  - The DuckDB writer is `COPY ... (FORMAT PARQUET, COMPRESSION SNAPPY, ROW_GROUP_SIZE n, KV_METADATA {...})` (`engine/src/layout.rs:343-348 @ fb361420`). That writer only honours row groups in multiples of 2,048 (`engine/src/layout.rs:359-364 @ fb361420`).
  - `configured_connection` (`engine/src/fixture.rs:58-64 @ fb361420`) applies exactly the product's settings (`engine/src/pool.rs:185-187 @ fb361420`, none of which touch the optimizer).
  - An untracked file in `engine/tests/` can use `duckdb`, `parquet`, `arrow` and the `fixture` feature without any manifest change (`engine/Cargo.toml:39`, `:44`, `:80-82 @ fb361420`).

## Step 1: the fixtures

**Where everything runs.**
- Worktree: `C:/dev/wt/o1-probe`, detached at fb361420f512d2f631e29d4e2f9fcc5e5d2fd2be.
- Probe code: the one untracked file `engine/tests/o1_probe.rs`. It holds a single `#[test] fn o1_probe()` that runs every step in order.
- Data: every file under `O1_OUT_DIR` (`D:/wt-targets/o1-probe/o1-data/run<N>/`). Never `std::env::temp_dir()`, which sits under the user profile.

**Base files** (arrow-rs, the existing fixture writer). `write_geoparquet` with `FixtureSpec { features: N, row_group_rows: 2_048, statistics: StatisticsMode::WriterDefault, ..Default::default() }`, which gives polygons in LV95 with a covering bbox and a native `id`. N is 2,048 (for A and B), 4,096 (for B3), 6 (for S) and 3 (for R). Keep each `FixtureFacts.extent` for the viewport shape.

**Adding column `v`** (Int64, non-null), two ways for each family:
- **arrow-rs** (`-ar-s` with statistics, `-ar-n` without).
  - Read the base with `ParquetRecordBatchReaderBuilder` and append `v = v_of(id)`.
  - Write with `ArrowWriter` using `WriterProperties`: SNAPPY, `set_max_row_group_row_count(Some(2048))`, and `key_value_metadata` set to the base file's `geo` key only, byte-copied. Leave out `ARROW:schema`; the writer writes its own.
  - Statistics: the writer's default for `-ar-s`, `set_statistics_enabled(EnabledStatistics::None)` for `-ar-n`.
- **DuckDB** (`-dk`), on a `configured_connection()`:
  - `SET threads = 1`.
  - `CREATE TABLE __v (id UBIGINT, v BIGINT)`, filled from Rust through the Appender with `v_of(id)`, so no SQL arithmetic produces the values.
  - Then `COPY (SELECT s.*, t.v FROM read_parquet('<base>') s JOIN __v t ON s.id = t.id ORDER BY s.id) TO '<dst>' (FORMAT PARQUET, COMPRESSION SNAPPY, ROW_GROUP_SIZE 2048, KV_METADATA {geo: '<geo value, quotes doubled>'})`.
  - Statistics: the DuckDB writer's default. I know of no COPY option that disables them, so the no-statistics arm is arrow-rs only.

**The values, `v_of(id)`:**
- **A**, 2,048 rows, one row group (the reviewer's first case, rebuilt by me):
  - id 0..=1023: `v = id`;
  - id 1024..=2047: with `k = id − 1024`, `v = 4,000,000,000 + k` for even k and `−(4,000,000,000 + k)` for odd k.
- **B**, 2,048 rows, one row group (the reviewer's second case): `v = id` for id 0..=2046, and `v = 4,000,002,047` for id 2047.
- **B3**, 4,096 rows, two row groups of 2,048 (my mechanism fixture):
  - group 0: `v = id` for id 0..=2047;
  - group 1: `v = 0` for id 2048, `v = id` for id 2049..=4094, `v = 4,000,004,095` for id 4095.
- **S**, 6 rows, arrow-rs without statistics only (`S-ar-n`): id 0..=5 → `2, 3_037_000_499, 3_037_000_500, −3_037_000_500, 4_000_000_000, 4_294_967_295`.
- **R**, 3 rows, arrow-rs without statistics only (`R-ar-n`): id 0..=2 → `2, 4_294_967_296, 3_600_000_000_003_999_000`.

That makes eleven files: A, B and B3 in `-ar-s`, `-ar-n` and `-dk`, plus `S-ar-n` and `R-ar-n`.

**Checks on every file before any query uses it.** If a check fails, stop that file's arm; see step 5.
1. On an independent connection, `parquet_metadata(?)` for `path_in_schema = 'v'`: row groups, rows per group, and `stats_min_value`, `stats_max_value`, `stats_null_count` per group. If a column name is refused, run `DESCRIBE` and use the names it gives. The layout and the presence or absence of statistics must be as declared.
2. `SELECT id, v FROM read_parquet(?)`: every `(id, v)` must equal `v_of(id)`, with 0 mismatches.
3. `Dataset::open` returns Ok, and `file_schema()` holds `v: Int64`.

**Exact counts, without DuckDB.** In Rust, for every row:
- `x = (v as i128) * (v as i128)`, the exact product, which cannot overflow i128;
- `w = (v as i64).wrapping_mul(v as i64)`, the two's-complement model.

The probe prints its computed counts and id sets next to my hand table below. Any disagreement is reported as my arithmetic error, not as a result.

**My hand table, with each model's prediction** (all mine):
- **X:** the exact answer.
- **W:** each row wraps, and no statistics are used.
- **F:** the planner folds the filter using file-level statistics computed with wrapping, then evaluates rows without the overflow check.
- **G:** row groups are pruned on group statistics computed with wrapping, with no planner fold.
- **E:** an error, which is the declared direction.

| file / predicate | X | W | F | G |
|---|---|---|---|---|
| A `v * v > 0` | 2,047 (ids 1..2047) | 1,023 (ids 1..1023) | 1,023 | 1,023 |
| A `v * v < 0` | 0 | 1,024 (ids 1024..2047) | 1,024 | 1,024 |
| A `(v * v) IS NOT NULL` | 2,048 | 2,048 | 2,048 | 2,048 |
| B `v * v > 0` | 2,047 (ids 1..2047) | 2,046 (ids 1..2046) | 0 | 0 |
| B `v * v < 0` | 0 | 1 (id 2047) | 1 | 1 |
| B `(v * v) IS NOT NULL` | 2,048 | 2,048 | 2,048 | 2,048 |
| B3 `v * v > 0` | 4,094 | 4,093 | 0 | 2,047 (group 0 only) |
| B3 `v * v < 0` | 0 | 1 (id 4095) | 1 | 1 |
| S `v * v > 0` | 6 | 2 (ids 0, 1) | n/a (no statistics) | n/a |
| S `v * v < 0` | 0 | 4 (ids 2..5) | n/a | n/a |
| R either | X: 3 or 0 | — | — | — |

- E is an error in every row except S's control rows.
- The overflowing products, exact and then wrapped:
  - 3,037,000,500² = 9,223,372,037,000,250,000, wrapping to −9,223,372,036,709,301,616;
  - 4,000,000,000² = 16,000,000,000,000,000,000, wrapping to −2,446,744,073,709,551,616;
  - 4,294,967,295² = 18,446,744,065,119,617,025, wrapping to −8,589,934,591;
  - 4,000,002,047² = 16,000,016,376,004,190,209, wrapping to −2,446,727,697,705,361,407;
  - 4,000,004,095² = 16,000,032,760,016,769,025, wrapping to a negative value.
- 3,037,000,499² = 9,223,372,030,926,249,001 fits in i64. That is S's control row next to the overflow boundary.

## Step 2: the engine runs (`Dataset::stream_with_cancel`)

For each of the eleven files, a `Dataset::open`, then for each predicate below:

**(a) Admission.** Call `AdmittedPredicate::admit(text, &ds)`.
- On Ok, record `referenced_columns()`.
- On Err, record the code (the campaign's `code_of` mapping, `engine/tests/admission_property_campaign.rs:624-639 @ fb361420`) and Display.

**(b) The stream.** Run it in two shapes, on a fresh `CancelToken`:
- **all:** `ViewportQuery::all().with_filter(p)`;
- **view:** `ViewportQuery::viewport(Bbox from FixtureFacts.extent, ds.crs().identifier()).with_limit(rows + 1).with_filter(p)`. This is T1's shape.

Drain with `next_into` and record:
- every batch's `batch_index`, `rows`, `payload_bytes` and `cut_by`;
- the ids, decoded as in `completed_ids` (`:1335-1347`);
- the terminal: either ended with no error, or `Some(Err(e))` with its Display and Debug;
- `filter_plan()`.

**(c) Repeat.** Run every engine run twice in the process: rep 1, then rep 2.

**Predicates:**
- **Expected admitted:**
  - P1 `v * v > 0`
  - P2 `v * v < 0`
  - P3 `(v * v) IS NOT NULL`, the admitted predicate that evaluates the product with no ordering comparison
  - On S and R, P1 and P2 only.
- **Controls, expected refused** (run on `A-ar-s` and `B-ar-s` only, admission only). Together they show the refusal path is live, so the admissions above are shown rather than assumed:
  - C1 `v * v`, the projected product alone, expected `skp.filter_not_boolean`;
  - C2 `v * 1.5 > 0`, expected `skp.filter_type_not_admitted` (decimal literal beside an integer, ADR-021:263).

## Step 3: the independent counts

**Connection.** A fresh `configured_connection()` per cell. It is independent of the engine's pool, admission, `build_sql` and producer, but not of DuckDB's build; the i128 computation is the arithmetic oracle.

**Queries.** Run for each of A, B and B3 in all three writers, for P1 to P3, in cell D (default settings):
- **I-count:** `SELECT count(*) FROM read_parquet(?) WHERE (P)`, with the path bound. For P1, run it a second time with the path as a literal.
- **I-stream:** the engine's no-bbox text, `SELECT "id" AS "id", "<ds.geometry_column()>" FROM read_parquet(?) WHERE (P)`. Prepare it, call `stream_arrow([path])`, and wrap each `next()` in `catch_unwind`. Record the chunks, the ids, and any error or panic text in full.
- **I-product** (the product without the comparison, once per file): `SELECT id, v, v * v AS p FROM read_parquet(?)`. Record either the error text in full, or for every row whose x does not fit i64: id, v, p as returned, x and w. Also record the count of rows where p ≠ x.
- **Versions:** `SELECT library_version, source_id FROM pragma_version()`.

**The comparison table.** For each file and predicate: engine (all), engine (view), I-count, I-stream, X and W. Whenever a row's figures are not all equal, also record the size of the symmetric difference of the engine's id set against X's, with its first 8 ids.

## Step 4: the mechanism, row-group statistics first

**4.1 Statistics as written.** The per-group v statistics from step 1, check 1, for every file. They are the input to every model in the table.

**4.2 The planner-statistics switch.** I-count for P1 to P3, I-product, and `EXPLAIN` of the P1 I-count, run on A, B and B3 in every writer, in three more cells, each on a fresh connection:
- **SP:** `SET disabled_optimizers = 'statistics_propagation'`;
- **FP:** `SET disabled_optimizers = 'filter_pushdown'`;
- **SPFP:** both names, comma-separated.

Before each EXPLAIN run `SET explain_output = 'all'`, use a literal path, and record the plan text whole. If `SET` refuses a name, record the error; that cell is not run, which is not a stop.

What each outcome would show (my reading):
- **B or B3 P1 at 0 in D but not in SP:** the planner folds the filter on wrapped file statistics (model F). EXPLAIN in D should then show no filtered scan, or an empty result. That is my expectation; I do not know the exact output format.
- **B3 P1 at 2,047 in SP:** row-group pruning on group statistics (model G). If FP removes it, the pruning sits in the pushed-down scan filter.
- **SP equal to W, on the files with statistics:** the operator itself wraps.
- **SP raises:** the operator checks correctly, and the silence comes from the statistics path only.

**4.3 Statistics absent, through the engine itself.** The step-2 runs on the `-ar-n` files are this arm; no setting is needed. With no statistics, F and G are impossible, so the result is W (the operator wraps) or E (the operator raises).

**4.4 The pushdown switch** is FP and SPFP in 4.2. Read it only against B3.

**4.5 The operator by magnitude** (S and R, which have no statistics).
- Through the engine: step 2's P1 and P2 on S and R.
- Independently: `SELECT v * v AS p FROM read_parquet(?) WHERE id = <k>`, for S's k 0..5 and R's k 0..2, in cells D and SP. Record the value or the error per k.

My hypothesis, H-MSVC. It is my recollection of DuckDB's source, not checked at 1.5.5.
- DuckDB's checked int64 multiply uses a compiler builtin under GCC or Clang. Otherwise it falls back to a split into 32-bit halves, and that fallback skips the check when both magnitudes are below 2^32.
- The bundled build here compiles with MSVC. Under this hypothesis, products whose operands both have magnitude below 2^32 but whose result passes i64::MAX would wrap silently: S's ids 2 to 5. Operands at or above 2^32 would still raise: R's ids 1 and 2, the reviewer's 3.6e18.
- The statistics code would then compute ranges with the same defective check. That would produce the reviewer's 0 rows (F) and their 1,024 rows (W, after the planner drops the check).

The alternative, H-STATS: the operator is correct, the statistics code wraps, and S raises when statistics are absent. The reviewer's 4e9-silent, 3.6e18-raising pair already leans toward H-MSVC, but that is my inference.

**4.6 The vendored source.** This is a light step, done with the Grep and Read tools.
- In `D:/wt-targets/o1-probe/debug/build/libduckdb-sys-*/`, find:
  - the int64 specialisation of `TryMultiplyOperator::Operation` with its surrounding `#if`, `#else` and `#endif` lines;
  - `MultiplyPropagateStatistics`;
  - the lines in `PropagateNumericStats` that swap in the unchecked function.
- If the sources are not extracted there, look in the package's own source folder in cargo's cache.
- Report each one byte-copied, with a path relative to the extraction or package root and its line range.
- Also report the build target triple (the host line of `rustc -vV`), and any line in the libduckdb-sys build-script output that names the compiler.

**4.7 Literal-only constant folding** (last, on `B-ar-s`):
- Engine: L1 `4000000000 * 4000000000 > 0` (X: all 2,048 rows), L2 `4000000000 * 4000000000 < 0` (X: 0 rows), and the control L3 `4294967296 * 4294967296 > 0`. Each goes through admission and both shapes. A refusal here is a recorded result: the fold raised during bind's prepare.
- Independently: `SELECT 4000000000 * 4000000000 AS p`, `SELECT 3037000500 * 3037000500 AS p` and `SELECT 4294967296 * 4294967296 AS p`, in cells D, SP and ER (`SET disabled_optimizers = 'expression_rewriter'`).

**What answers the grading question:**
- **It answers "yes"** if any engine run meets all three conditions: admission returned Ok, the stream ended with no `Some(Err)`, and the delivered id set differs from X's set. The predicted cases are B P1 delivering 0 or 2,046, A P2 delivering 1,024, S P2 delivering 4, and L1 or L2 inverted. Either engine shape counts; view is T1's shape.
- **It does not answer "yes":**
  - independent-connection results alone;
  - an engine stream that ends in error, with the fixed detail or not (that is the declared class, or the fetch node);
  - a refusal;
  - a completed engine stream equal to X. For example, P3 at 2,048 with no error is not wrong rows, though it departs from the B-1 point 4 direction. I would report that as a separate fact.
- **"No" within this probe** means every admitted engine run either errors or equals X. That says nothing beyond these fixtures.
- The mechanism decides only which resolutions exist, not the grade.

## Step 5: the run's shape

**THE MACHINE.** Follow the paragraph at `state/directives/2026-10-06-machine-script-adopted.md:12-22 @ fb361420` exactly, with `<M>` as the custodian gives it.
- `CARGO_TARGET_DIR=D:/wt-targets/o1-probe` (a new folder), `CARGO_BUILD_JOBS=8`, `RUST_TEST_THREADS=8`.
- A call longer than the Bash timeout uses `run_in_background`, with `-MaxWaitMinutes` below that timeout.

| # | step | hold | est. min |
|---|---|---|---|
| 0 | `git -C C:/dev/spatial-ide worktree add --detach C:/dev/wt/o1-probe fb361420f512d2f631e29d4e2f9fcc5e5d2fd2be`; then `rev-parse HEAD` must equal that hash and porcelain must be empty | none (light) | 1 |
| 1 | Write `C:/dev/wt/o1-probe/engine/tests/o1_probe.rs` (untracked); `mkdir -p D:/wt-targets/o1-probe/o1-data` | none | 20–30 (authoring) |
| 2 | `cd C:/dev/wt/o1-probe && <hold shared -Project SpatialIDE -What "o1-probe: cargo test --no-run" -Minutes 40 -MaxWaitMinutes 20> && CARGO_TARGET_DIR=D:/wt-targets/o1-probe CARGO_BUILD_JOBS=8 RUST_TEST_THREADS=8 cargo test -p spatial-engine --locked --test o1_probe --no-run ; rc=$? ; <release> ; exit $rc` | shared | 25–35 (bundled DuckDB from scratch; the reviewer measured about 18) |
| 3 | The same shape, `-What "o1-probe: run 1" -Minutes 10 -MaxWaitMinutes 8`, command `CARGO_TARGET_DIR=D:/wt-targets/o1-probe CARGO_BUILD_JOBS=8 RUST_TEST_THREADS=8 O1_OUT_DIR=D:/wt-targets/o1-probe/o1-data/run1 cargo test -p spatial-engine --locked --test o1_probe -- --nocapture --test-threads=1 > D:/wt-targets/o1-probe/o1-data/run1.log 2>&1` | shared | ≤5 |
| 4 | As step 3 with `run2`, a second process, to check repeatability; then `sha256sum` each fixture of run1 and run2 | shared, then light | ≤5 |
| 5 | Step 4.6's source read, and `rustc -vV` | none | 5 |

Probe-only rebuilds after a fix to the untracked file are small builds and run without a hold.

**Stop rules:**
1. A predicate the engine refuses among P1 to P3 on any file: stop there, and report the refusal and everything before it. Under OPEN-2 (a), an admitted control C1 or C2 also stops the run, and step 4.7's outcomes are results.
2. Anything needing a tracked file changed (a manifest, a private API, a dependency): stop and name what was needed.
3. A failed fixture check (layout, statistics, readback, or `Dataset::open`): stop that file's arm and record the facts; the rest continues. If a DuckDB-written layout is wrong even under `threads = 1`, the arm stays stopped.
4. An engine error, or an error on the independent connection, is a result to record, not a stop.
5. Exit codes 96 to 99: report them and do not run the command another way.
6. At most two fix-and-rerun cycles for faults in the probe's own code, each reported with its cause. After that, stop.
7. If total compute exceeds 75 minutes, stop and report. No timing figure is claimed anywhere.

**What the tester-high reports, for me to read:**
1. The worktree HEAD (full hash) and porcelain output; the probe file whole as an appendix, with its line count; `rustc -vV`; the DuckDB library version and source id.
2. Per file: writer, rows, row groups and rows per group, the v statistics per group (or "absent"), bytes, the run1 and run2 sha256 values, the readback mismatch count, and the `Dataset::open` outcome.
3. Per engine run (file × shape × predicate × rep): the admission outcome; every batch (`batch_index`, `rows`, `payload_bytes`, `cut_by`); the terminal (no error, or Display and Debug); the id count, minimum and maximum; whether the id set equals X's, equals W's, or is empty; the first 8 ids of the difference from X; `filter_plan`.
4. The step-3 comparison table, and every independent query's SQL byte for byte, with its cell and its outcome (count, ids, or the error or panic text in full).
5. I-product rows for every overflowing row.
6. The EXPLAIN texts whole.
7. Step 4.5 per k, and step 4.7 per query.
8. Step 4.6's source text with relative paths and line ranges.
9. Every hold line and release line, with exit codes; any rerun and why.
10. The probe's own i128 counts beside my hand table.

The tester-high's report names no user-profile path and no other project, and grades nothing.

## OPEN items (the custodian's choice before dispatch)

- **OPEN-1: the "without the comparison" arm through the engine.** `stream_with_cancel` cannot stream an expression. `stream_projected_with_cancel` projects file columns only (`engine/src/stream.rs:1012-1039 @ fb361420`).
  - (a) Use C1 (the bare product, refused as not BOOLEAN) plus P3 `(v * v) IS NOT NULL` through the engine, with the projected product alone measured on the independent connection (I-product).
  - (b) Independent connection only.
  - (c) A path that projects an expression through the engine. That needs a tracked change, so it is excluded.
  - I recommend (a).
- **OPEN-2: the stop rule against the designed refusals.**
  - (a) C1 and C2 are expected refusals, not stops, and an admitted control stops the run. Step 4.7 runs last, and either of its outcomes is recorded.
  - (b) Drop C1, C2 and step 4.7, so the rule applies as written.
  - I recommend (a).
- **OPEN-3: a second DuckDB build as a further reader.** For example, the compatibility corpus's Python DuckDB 1.5.5, which is untracked in the main checkout's build folder. It would test whether the behaviour is specific to the bundled MSVC build.
  - (a) Not in this probe: the source read and the sweep go far enough for the grade.
  - (b) Include it.
  - I recommend (a).
- **OPEN-4: teardown.** The worktree and `D:/wt-targets/o1-probe` hold roughly 10 to 16 GB.
  - (a) Keep them until my reading is filed, so a targeted rerun costs no rebuild.
  - (b) Remove them at hand-back.
  - I recommend (a); disk is the custodian's call.

**Red lines, named and not designed.** Every possible resolution goes to the custodian as a question, because each is a red line or a contract change:
- changing what admission admits, which is an ADR-021 Note;
- changing the `duckdb` or `libduckdb-sys` version, or how the bundled DuckDB is compiled, which is a dependency change;
- rewriting the predicate before it reaches DuckDB, which goes against ADR-021 item 4's verbatim composition;
- recording the class as a declared limitation, which alters a guarantee.

The probe loosens nothing in the campaign and runs none of it.

## What I could not settle

- **The reviewer's exact first-case file.** The gate report doesn't record its other rows, signs or row groups, so A is my reconstruction. Their probe crate was in their scratch folder (gate report line 110), and I did not read it.
- **H-MSVC and the statistics-propagation behaviour** are my recollection of DuckDB's source, unchecked at 1.5.5. Step 4.6 checks the source, and 4.5 checks the behaviour.
- **Unconfirmed names and options at 1.5.5:**
  - whether `disabled_optimizers` accepts `statistics_propagation`, `filter_pushdown` and `expression_rewriter`;
  - the `parquet_metadata` column names;
  - whether any COPY option disables statistics.
- **Whether 1.5.5 prunes row groups on an expression filter at scan level.** B3 with SP and FP is built to show this.
- **Out of scope:**
  - the `i64 * C` completion noted at `engine/tests/admission_property_campaign.rs:1455-1456 @ fb361420`;
  - the C1 fetch-site case of 4,000,000 rows.
- **Owner's index:** no change, since nothing is committed.

---
Blocking questions: none block the design itself. OPEN-1 and OPEN-2 need the custodian's choice before the tester-high is dispatched.
Report path: C:/dev/spatial-ide/state/consults/2026-10-25-admitted-integer-overflow-silent-wraparound-probe-design-lead-data-draft.md
sha256: not computed (I have no shell).
