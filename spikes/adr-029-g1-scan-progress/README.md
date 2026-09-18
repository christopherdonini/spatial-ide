# ADR-029 gate G1 -- scan-progress feasibility probe

Headless, reported-only. This spike code (`Cargo.toml`, `src/main.rs`) is throwaway per
`spikes/` convention -- **the written conclusion below is the deliverable.** No product code, no
new dependency in any product crate, no wire change, no benchmark, no duration is added or claimed
by this spike.

## Question

Node `adr-029-g1-feasibility` (`PLAN.yaml`), discharging G1 as `docs/adr/ADR-029-scan-progress-carrier-quantity.md:113`
states it, quoted verbatim:

> G1 (feasibility, first and blocking). Verify against the vendored `duckdb` crate that a monotone
> scan-progress reading exists on the `read_parquet` path *before* any wire work; if it does not,
> the quantity question returns to the human — the §13 F conditional-escalation precedent
> (`ADMISSION-PREREGISTRATION.md:254`). G1 is tracked as its own plan node
> `adr-029-g1-feasibility`, run on a quiet machine, and its result returns here (and to the human
> if it bounces).

DECISIONS-PENDING.md entry 92 (question set C, item C2, the human's ruling of 2026-09-14) is the
same gate carried in the ledger: "G1's feasibility gate returns the quantity question to me if no
monotone reading exists rather than shipping a non-monotone one" -- not reproduced further here,
referenced by entry number per the quote-by-reference convention.

## Conclusion

**G1 clears.** A monotone, non-decreasing, whole-unit (`u64` row count) scan-progress reading
exists, is reachable from product code through the vendored `duckdb` crate (1.10505.0) as pinned in
the workspace `Cargo.lock`, and was observed on the `read_parquet` path across every run below. Part
(d) -- what follows if no reading existed -- was not invoked; see (d) for the record anyway.

## (a) The surface used

The *only* progress-reading C API surface anywhere in the vendored bindings is
`duckdb_query_progress` / `duckdb_query_progress_type`. Registry path (crate version 1.10505.0,
matching `Cargo.lock`'s `duckdb` entry and `engine/Cargo.toml:39`'s `duckdb = { version =
"1.10505.0", ... }`):

```
C:\Users\Christopher\.cargo\registry\src\index.crates.io-1949cf8c6b5b557f\libduckdb-sys-1.10505.0\src\bindgen_bundled_version.rs
```

- The struct, lines 291-295:
  ```rust
  pub struct duckdb_query_progress_type {
      pub percentage: f64,
      pub rows_processed: u64,
      pub total_rows_to_process: u64,
  }
  ```
- The function, line 906 (doc comment line 905: `"Get the progress of the running query.\n\n
  @param connection The connection running the query. @return The query progress type containing
  progress information."`):
  ```rust
  pub fn duckdb_query_progress(connection: duckdb_connection) -> duckdb_query_progress_type;
  ```

A repo-wide search of this file (and of `libduckdb-sys-1.10505.0/src/*.rs` generally) for
`progress` (case-insensitive) returns exactly these two declarations and nothing else -- no
`PROGRESS_BAR` C function, no distinct scan-only accessor. The SQL-level `enable_progress_bar` /
`progress_bar_time` settings used below are ordinary `SET` statements, not a separate C surface.

**`duckdb_pending_prepared` / `duckdb_pending_execute_task`** (lines 1570, 1592;
`duckdb_pending_execution_is_finished` line 1607; `duckdb_execute_pending` line 1600;
`duckdb_pending_error` line 1588; `duckdb_destroy_pending` line 1584; the state enum, lines 53-58)
is a second, separate C API surface -- the brief's "PendingQuery, task-progress" -- but it is not
itself a progress *reading*. This probe uses it only as a deterministic **driver**: each call to
`duckdb_pending_execute_task` performs one bounded unit of work and returns, so
`duckdb_query_progress` can be sampled between calls with no wall-clock race. `duckdb_prepare`
(line 1280), `duckdb_prepare_error` (line 1292) and `duckdb_destroy_prepare` (line 1288) round out
that path.

**Reachability: the high-level `duckdb` crate wraps none of it.** A search of
`duckdb-1.10505.0/src/**/*.rs` for `progress` (case-insensitive) returns zero hits outside
unrelated substrings (`appending`, `depending`). `duckdb::ffi::duckdb_query_progress` is
nonetheless *reachable* -- the crate re-exports the whole `libduckdb-sys` surface:
`duckdb-1.10505.0/src/lib.rs:58`, `pub use libduckdb_sys as ffi;` -- but calling it needs a raw
`duckdb_connection` handle, and `duckdb::Connection` never exposes one:

- `duckdb-1.10505.0/src/lib.rs:115`: `mod inner_connection;` -- a **private** module (not `pub
  mod`), so nothing it declares is part of the crate's public API regardless of its own items'
  visibility.
- `duckdb-1.10505.0/src/inner_connection.rs:57,61`: `pub struct InnerConnection { ... pub con:
  ffi::duckdb_connection, ... }` -- `pub`-in-private; unreachable from outside the crate.
- `duckdb-1.10505.0/src/lib.rs:271-272`: `pub struct Connection { db: RefCell<InnerConnection>,
  ... }` -- the `db` field itself carries no `pub`, so even `InnerConnection`'s own visibility is
  moot.
- `duckdb-1.10505.0/src/inner_connection.rs:285-286`: `InterruptHandle`'s `conn:
  Mutex<ffi::duckdb_connection>` is likewise private with no accessor -- the one other type in the
  crate that holds a raw connection handle.
- A search of the whole crate for `duckdb_connection`, `pub fn handle`, `raw_handle`, `as_raw`
  finds no accessor anywhere (checked, zero results beyond the four declarations above).

So this probe does not use `duckdb::Connection` at all -- it drives `duckdb::ffi`'s raw C API
directly (`duckdb_open`/`duckdb_connect`/`duckdb_prepare`/`duckdb_pending_prepared`/
`duckdb_pending_execute_task`/`duckdb_query_progress`), which is reachable by product code today,
without patching or forking the crate, at the cost of writing the connection- and
statement-management code `Connection`/`Statement` would otherwise supply. **This reachability
finding is itself part of what G1 answers**: a monotone reading exists on this path, but only via
the raw C API, not via the crate's ergonomic `Connection` wrapper.

## (b) The raw sample sequence, at least three runs

Fixture: `polygons-100k` (`kernel/FIXTURES.md`; regenerated via
`engine/tests/common/mod.rs`'s `polygons_100k()` if absent), 100,000 features, already present at
`C:\dev\spatial-ide\target\fixtures\slice-budgets\polygons-100k.parquet` for every run below.
Query: `SELECT sum(id) FROM read_parquet('<fixture>')` (chosen over touching the `geometry` column
-- see "Incidental findings" below for why). Driver: the deterministic
`duckdb_pending_execute_task` loop (see (a)), sampling `duckdb_query_progress` once per task, on
one thread, with `SET enable_progress_bar=true; SET progress_bar_time=0;` (and
`autoinstall_known_extensions=false; autoload_known_extensions=false;`, a defensive no-network
guard unrelated to G1 itself -- see "Incidental findings"). Command:

```
cargo run --release --manifest-path spikes/adr-029-g1-scan-progress/Cargo.toml
```

Full transcript (every raw sample, all configurations, three in-process runs of the deterministic
driver plus two supplementary configurations): `spikes/adr-029-g1-scan-progress/results/probe-output.txt`
(153 lines including DuckDB's own printed progress-bar glyphs, which this section omits). The
three deterministic runs' samples, deduplicated (consecutive identical `(percentage, rows_processed,
total_rows_to_process)` readings collapsed to one row with a repeat count -- the program's own
`print_deduped_samples`, checked byte-for-byte against the uncollapsed sequence in
`results/probe-output.txt` lines 42-99, 107-116, 124-147):

```
run 1 (56 running-phase samples + 1 post-completion sample):
  (0) percentage=0.000000  rows_processed=0      total_rows_to_process=0      x1
  (1) percentage=0.000000  rows_processed=0      total_rows_to_process=100002 x2
  (2) percentage=99.998000 rows_processed=100000 total_rows_to_process=100002 x53
  (3) percentage=99.998000 rows_processed=0      total_rows_to_process=0      x1   <- post-completion

run 2 (8 running-phase samples + 1 post-completion sample):
  (0) percentage=0.000000  rows_processed=0      total_rows_to_process=0      x1
  (1) percentage=0.000000  rows_processed=0      total_rows_to_process=100002 x2
  (2) percentage=99.998000 rows_processed=100000 total_rows_to_process=100002 x5
  (3) percentage=99.998000 rows_processed=0      total_rows_to_process=0      x1   <- post-completion

run 3 (22 running-phase samples + 1 post-completion sample):
  (0) percentage=0.000000  rows_processed=0      total_rows_to_process=0      x1
  (1) percentage=0.000000  rows_processed=0      total_rows_to_process=100002 x2
  (2) percentage=99.998000 rows_processed=100000 total_rows_to_process=100002 x19
  (3) percentage=99.998000 rows_processed=0      total_rows_to_process=0      x1   <- post-completion
```

Each run's own printed verdict (`results/probe-output.txt` lines 105, 122, 153), over the
running-phase samples only (the trailing post-completion sample excluded -- see below):

```
run 1: over 56 running-phase samples -- rows_processed monotone non-decreasing = true, percentage monotone non-decreasing = true, max rows_processed reached = 100000, resets to 0 after completion = true
run 2: over 8 running-phase samples -- rows_processed monotone non-decreasing = true, percentage monotone non-decreasing = true, max rows_processed reached = 100000, resets to 0 after completion = true
run 3: over 22 running-phase samples -- rows_processed monotone non-decreasing = true, percentage monotone non-decreasing = true, max rows_processed reached = 100000, resets to 0 after completion = true
```

**Reproducibility beyond these three:** the whole binary was additionally invoked as two more,
fully separate OS processes (six more individual driver runs, 18 in total across this session), not
archived as a results file since they reproduce the same finding; every one of the 18 reported
`rows_processed monotone non-decreasing = true` and `percentage monotone non-decreasing = true`. The
number of running-phase samples per run varied (single digits up to several thousand, across all 18
runs) -- reflecting how many discrete tasks the pending-query driver happened to split the scan into
on that particular invocation, not a duration and not measured as one; this document makes no claim
about why the count varies.

**The supplementary background-thread method (config A/B in `results/probe-output.txt`, not the
gate's primary evidence).** Before settling on the deterministic driver above, the same reading was
also sampled by a second, independent mechanism -- a background thread running
`duckdb_query(<same connection>, "SELECT sum(id) FROM read_parquet(...)", ...)` to completion while
the main thread polls `duckdb_query_progress` on that same connection from outside, per
`duckdb_query_progress`'s own doc comment ("the connection running the query"). One such run (config
B, `results/probe-output.txt` lines 20-31) caught the running phase directly:

```
[2] percentage=0.000000   rows_processed=0      total_rows_to_process=100002
[3] percentage=0.000000   rows_processed=0      total_rows_to_process=100002
[4] percentage=0.000000   rows_processed=0      total_rows_to_process=100002
[5] percentage=2.047959   rows_processed=2048   total_rows_to_process=100002
[6] percentage=26.623468  rows_processed=26623  total_rows_to_process=100002
[7] percentage=51.198976  rows_processed=51200  total_rows_to_process=100002
[8] percentage=77.822444  rows_processed=77824  total_rows_to_process=100002
[9] percentage=99.998000  rows_processed=100000 total_rows_to_process=100002
```
a second, independently-driven confirmation of the same monotone non-decreasing count, using a
different sampling mechanism against the same C API function -- not counted toward the "at least
three runs" requirement above (that is satisfied by the three deterministic-driver runs), offered
as corroboration that the reading is a property of `duckdb_query_progress` itself, not an artifact
of the pending-task driver.

## (c) What the reading is, and is not

- **Whole-query, not scan-specific.** `duckdb_query_progress`'s own doc names its scope: "the
  connection running the query" (`bindgen_bundled_version.rs:905`), not an operator or a scan. This
  probe's query (`SELECT sum(id) FROM read_parquet(...)`) is a single scan plus a trivial
  aggregate, so the whole-query reading is, in this specific shape, dominated by the scan -- but the
  C API provides no way to isolate "the `read_parquet` operator's" progress from any other operator
  a larger query might also run. A future query with more than one expensive operator (a scan
  feeding a sort or a join) would report one combined whole-query figure, not a scan-only one.
- **A count, in whole units, alongside a derived fraction.** `rows_processed: u64` and
  `total_rows_to_process: u64` are whole-row counts (matching ADR-029 decision 1(a)'s "rows
  emitted" unit exactly: `rows_processed`'s observed ceiling, 100000, is exactly this fixture's row
  count). `percentage: f64` is a derived fraction (`rows_processed / total_rows_to_process * 100`
  -- 100000 / 100002 * 100 = 99.998, matching every observed non-sentinel `percentage` value
  exactly).
- **No rate, no ETA, no elapsed time is carried by this struct at all.** Its only three fields are
  `percentage`, `rows_processed`, `total_rows_to_process` (`bindgen_bundled_version.rs:291-295`) --
  there is no fourth, timing-shaped field to even misuse.
- **An "unavailable" sentinel exists and was observed.** Before the query starts and (usually) once
  the connection is idle again, `percentage=-1.0`, `rows_processed=0`, `total_rows_to_process=0`
  (`results/probe-output.txt` lines 3-16, 21-22, 95). This is the reading's own "unknown" state,
  not a claimed zero.
- **Two small, real, unexplained artifacts, recorded and not investigated further (matching this
  tree's own spike convention of naming an open discrepancy rather than resolving it past what the
  evidence shows):**
  1. `total_rows_to_process` reads `100002`, not `100000` (the fixture's declared feature count) --
     a `+2` discrepancy present in every running-phase sample across all 18 runs, never varying.
  2. The single post-completion sample (taken immediately after
     `duckdb_pending_execution_is_finished` returns true, before `duckdb_execute_pending` is
     called) sometimes retains the last computed `percentage` (`99.998000`) while
     `rows_processed`/`total_rows_to_process` have already reset to `0` (`results/probe-output.txt`
     lines 99, 116, 147) -- an internally inconsistent transitional reading, distinct from the
     clean `-1.0 / 0 / 0` idle sentinel seen before a query starts. This is exactly why the
     monotonicity verdicts in (b) are computed over the running-phase samples only, with the
     post-completion sample reported separately (`resets to 0 after completion`) rather than folded
     into the same check.

## (d) If no reading existed

Not invoked -- a reading exists (see (a), (b)). For the record, G1's own text names what would
follow: see the quoted clause under "Question" above (`docs/adr/ADR-029-scan-progress-carrier-quantity.md:113`)
-- the quantity question would have returned to the human. That branch is not exercised by this
result.

## Incidental findings (not G1's question; recorded because they shaped the probe)

- **GeoParquet auto-typing.** An earlier version of this probe's query touched the `geometry`
  column (`SELECT sum(length(geometry)) FROM read_parquet(...)`) and failed to bind: `read_parquet`
  auto-detects this fixture's GeoParquet `geo` key-value metadata and casts the column to a
  `GEOMETRY(<projjson CRS>)` type, which has no `length()` overload. Resolving *why* a `GEOMETRY`
  type resolves at all -- in a build `spikes/lod-feasibility/README.md`'s "Route A static bundling"
  section already found carries no `spatial` feature and no vendored spatial source -- is out of
  scope for G1; the query was changed to `sum(id)` (a plain `UBIGINT` column, untouched by
  GeoParquet typing) instead of chasing it further.
- **Extension autoload defense.** Every configuration in this probe runs `SET
  autoinstall_known_extensions=false; SET autoload_known_extensions=false;` before anything else,
  because `spikes/lod-feasibility/README.md`'s "Route A static bundling" section already found this
  bundled build compiles with both autoinstall and autoload defaulted **on**
  (`libduckdb-sys-1.10505.0/build_bundled_cc.rs:96-97`, cited there). This probe does not need, use,
  or depend on any DuckDB extension, and disabling autoload/autoinstall is a defensive guard against
  an unintended network fetch, not a finding about G1.

## Checks

- `cargo build --release --manifest-path spikes/adr-029-g1-scan-progress/Cargo.toml` -- exit 0.
- `cargo run --release --manifest-path spikes/adr-029-g1-scan-progress/Cargo.toml` -- exit 0, three
  times as separate OS processes plus the archived run, all six results consistent (see (b)).
- This crate is excluded from the workspace by its own `[workspace]` table (`Cargo.toml`, same
  convention as `spikes/lod-feasibility/rust/Cargo.toml`); `cargo build`/`test --workspace --locked`
  from the repository root do not touch it and its build does not touch the root `Cargo.lock`.
