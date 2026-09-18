# ADR-029 gate G1 -- scan-progress feasibility probe

Headless, reported-only. This spike code (`Cargo.toml`, `src/main.rs`) is throwaway per
`spikes/` convention -- **the written conclusion below is the deliverable.** No product code, no
new dependency in any product crate, no wire change, no benchmark, no duration is added or
claimed by this spike.

**This record is the architect's reduction** under the human's ruling of 2026-09-18 (question
round 16, item 2): it keeps the facts the spike's second scoped read verified and drops the
sentences that read found refuted or unsupported. Every claim below names the archived output
line or the source it rests on; nothing here rests on a run that was not archived.

Citation form: repository files by path from the repository root; the vendored Rust bindings by
crate directory (`libduckdb-sys-1.10505.0/`, `duckdb-1.10505.0/`); the DuckDB C++ this build
compiled by file name -- `src/main/capi/duckdb-c.cpp`, `src/main/client_context.cpp`,
`src/common/progress_bar/progress_bar.cpp`, `src/main/settings/custom_settings.cpp` and
`src/include/duckdb/main/settings.hpp`, all under
`target/release/build/libduckdb-sys-634b764a95be3523/out/duckdb/`.

## Question

Plan node `adr-029-g1-feasibility` (`PLAN.yaml`) discharges G1 as stated at
`docs/adr/ADR-029-scan-progress-carrier-quantity.md:113` (that line's sha256
`2962c7107e7b54463c6ab616ea04c6780954ff80d0ed46aecd9a7e3d601f9500`); the gate's own words stay at
that line and are not reproduced here. Summarised, and marked a summary rather than the gate's
words: verify against the vendored `duckdb` crate that a monotone scan-progress reading exists on
the `read_parquet` path before any wire work, and return the quantity question to the human if
none does. `DECISIONS-PENDING.md` entry 92 (question set C, item C2) carries the same gate in the
ledger, referenced by entry number.

## Conclusion

**G1 clears for the reading's existence on the `read_parquet` path. It does not clear for the
engine's current scan path.** No route is recommended here: the human deferred the route decision
to Brief B's B2 (round 16, item 3).

1. **The reading exists.** `duckdb_query_progress` returns a whole-unit (`u64`) `rows_processed`
   count. Across the archived runs it is monotone non-decreasing by observation over each run's
   active window and reaches this fixture's true row count, 100,000, in every one of the six
   config-C runs (`results/probe-output.txt:161`, `:9143`, `:9159`;
   `results/probe-output-2.txt:48`, `:75`, `:102`) and in the one archived config-B run in which
   it populated (`results/probe-output-2.txt:28`); the other archived config-B run never left `0`
   (`results/probe-output.txt:26`).
2. **The engine cannot reach it through the vendored `Connection`.** `duckdb_query_progress`
   reads `conn->context->GetQueryProgress()` (`duckdb-c.cpp:130-131`) -- one `ClientContext` per
   connection object, not a database- or process-wide value -- and `duckdb::Connection` exposes
   no raw `duckdb_connection` handle to call it with (see (a)). The engine's `read_parquet` scans
   run through that safe wrapper end to end (`engine/src/pool.rs:278`,
   `engine/src/stream.rs:1635`, `:1666`), so this probe observes the reading only because it
   polls the same raw connection it drives the scan on.
3. **DuckDB latches only `percentage`.** `progress_bar.cpp:129-130` assigns `percentage` only
   when the new value is strictly greater; `rows_processed` is assigned unlatched at `:120`. The
   count's monotonicity here is by observation over the archived runs, never an API property, so
   an engine that carries it must latch it producer-side -- ADR-029 1(b)
   (`docs/adr/ADR-029-scan-progress-carrier-quantity.md:73`).
4. **The denominator is an estimate.** `total_rows_to_process` reads 100,002 for this
   100,000-feature fixture (`results/probe-output-2.txt:15-21`; fixture provenance
   `engine/LOD-PREREGISTRATION.md:146`), and `percentage` tops out at `99.998000` at true
   completion (`results/probe-output-2.txt:21`). ADR-029 1(c)
   (`docs/adr/ADR-029-scan-progress-carrier-quantity.md:74`) carries the total only when the
   footer or plan declares one, absent otherwise, never estimated; this pair's denominator is not
   a total that clause admits.

**The three routes G1 establishes** (listed, not ranked):

1. **The engine drives the scan through raw `ffi` end to end**, as this probe does. Cost: the
   path gives up `Statement::stream_arrow` (`engine/src/stream.rs:1666`) and the crate's
   statement preparation (`:1634-1635`, plain `conn.prepare(sql)`); cancellation, which holds a
   `duckdb::InterruptHandle` today (`engine/src/cancel.rs:19`), becomes a raw `duckdb_interrupt`
   call against a connection the engine manages by raw pointer; and the pooled `Connection`
   (`engine/src/pool.rs:278`) needs a raw-handle counterpart for this one path.
2. **A crate patch or fork adds an accessor.** `InterruptHandle.conn`
   (`duckdb-1.10505.0/src/inner_connection.rs:286`) already holds the handle
   `duckdb_query_progress` needs, beside `interrupt()` (`:307-315`), which calls a different raw
   `ffi` function on it; a `Connection::query_progress()` forwarding through `InnerConnection.con`
   (`:61`) is the other shape. Cost: a vendored or forked dependency.
3. **Upstream**: propose the accessor to `duckdb-rs`. Cost: acceptance is not this project's to
   decide.

## (a) The surface used

The only progress-*reading* C API surface in the vendored bindings is `duckdb_query_progress` /
`duckdb_query_progress_type`, declared in
`libduckdb-sys-1.10505.0/src/bindgen_bundled_version.rs` (crate version 1.10505.0 -- the version
`engine/Cargo.toml:39` pins for the engine, pinned exactly for this probe by `Cargo.toml:25`):

- the struct at `:291-295` -- `percentage: f64`, `rows_processed: u64`,
  `total_rows_to_process: u64` -- with its doc comment at `:288`;
- the function at `:906`, with its doc comment at `:905`;
- what it reads, in the bundled C++ this build compiled: `conn->context->GetQueryProgress()`
  (`duckdb-c.cpp:130-131`, the function at `:122-135`), where `conn->context` is that
  `Connection` object's own `ClientContext` -- per-connection state, not a database-wide or
  cross-connection value.

A case-insensitive search for `progress` across both bindings files returns 15 lines: 4 in
`bindgen_bundled_version.rs` (the doc comment and the item of each of the two declarations above)
and 11 in `bindgen_bundled_version_loadable.rs`, the alternate bindings file, which reaches the
same two items through a function-pointer table. No separate `PROGRESS_BAR` C function exists in
either.

**`duckdb_pending_*` is a second, separate surface, and not a progress reading.**
`duckdb_pending_prepared` (`:1570`), `duckdb_pending_execute_task` (`:1592`),
`duckdb_pending_execution_is_finished` (`:1607`), `duckdb_execute_pending` (`:1600`),
`duckdb_pending_error` (`:1588`), `duckdb_destroy_pending` (`:1584`) and the state enum
(`:53-58`), with `duckdb_prepare` (`:1280`), `duckdb_prepare_error` (`:1292`) and
`duckdb_destroy_prepare` (`:1288`). This probe uses it as a deterministic driver: each
`duckdb_pending_execute_task` call performs one bounded unit of work and returns, so
`duckdb_query_progress` is sampled between calls on the same thread.

**Reachability from `duckdb::Connection`: none.** A case-insensitive search of
`duckdb-1.10505.0/src` for `progress` returns no matches. `duckdb::ffi::duckdb_query_progress` is
reachable as an item -- the crate re-exports the bindings (`duckdb-1.10505.0/src/lib.rs:58`,
`pub use libduckdb_sys as ffi;`) -- but calling it needs a raw `duckdb_connection` handle, and the
crate hands one out nowhere:

- `lib.rs:115`: `mod inner_connection;` -- a private module, so nothing it declares is part of the
  public API regardless of its own items' visibility.
- `inner_connection.rs:57,61`: `InnerConnection`'s `pub con: ffi::duckdb_connection` is
  `pub`-in-private.
- `lib.rs:271-272`: `Connection`'s `db: RefCell<InnerConnection>` field carries no `pub`.
- `inner_connection.rs:285-286`: `InterruptHandle`'s `conn: Mutex<ffi::duckdb_connection>` is
  private; its only public method is `interrupt()` (`:307-315`), which calls
  `ffi::duckdb_interrupt` and never returns the handle.
- a case-sensitive search of the crate for `duckdb_connection` finds exactly six occurrences:
  `inner_connection.rs:61,69,286,293` and `vscalar/function.rs:30,58` -- the latter two are
  scalar-function registration, DuckDB calling into Rust with a raw connection, the opposite
  direction from reading progress.

So this probe does not use `duckdb::Connection` at all: it drives `duckdb::ffi`'s raw C API
directly (`duckdb_open` / `duckdb_connect` / `duckdb_prepare` / `duckdb_pending_prepared` /
`duckdb_pending_execute_task` / `duckdb_query_progress`) and manages its own connection end to
end.

## (b) The archived runs

Fixture `polygons-100k` -- 100,000 features, provenance `engine/LOD-PREREGISTRATION.md:146`,
regenerated by `engine/tests/common/mod.rs`'s `polygons_100k()` if absent; its path is
`POLYGONS_100K` in `src/main.rs`, printed in each archive's first line
(`results/probe-output.txt:1`, `results/probe-output-2.txt:1`). Query:
`SELECT sum(id) FROM read_parquet('<fixture>')` (`src/main.rs:125-128`; see "Incidental findings"
for why `id`). Command:

```
cargo run --release --manifest-path spikes/adr-029-g1-scan-progress/Cargo.toml
```

Re-running precondition: `engine/tests/lod_tier_builder.rs:101-117` moves this exact fixture path
aside while that `#[ignore]`d fixture-regeneration-race test runs, so this probe and that test
must not be run together.

Two probe invocations are archived and only these two are counted -- count only what is archived.
Neither archived file carries DuckDB-printed progress-bar or ETA text.

- `results/probe-output.txt`: config A sentinel on every sample (`:3-8`); config B never populated
  (`:26`); config C runs 1-3 each reached 100,000 (`:161`, `:9143`, `:9159`).
- `results/probe-output-2.txt`: config A sentinel on every sample (`:3-9`); config B populated,
  reached 100,000 and then reset (`:28`, its samples at `:13-22`); config C runs 1-3 each reached
  100,000 (`:48`, `:75`, `:102`).

**Config C, the deterministic pending-task driver, is the gate's primary evidence: six runs,
three per archived file, each monotone non-decreasing over its active window and each reaching
max `rows_processed` = 100,000.** Each run's printed verdict line reports the active-window sample
count, `rows_processed monotone non-decreasing`, `percentage monotone non-decreasing`,
`max rows_processed reached`, the post-active sample count and whether every post-active sample
reset. "Active window" is the prefix ending at the *last* sample with `rows_processed > 0`, not
the run's last sample: `verdict()` splits at `rposition(|s| s.rows_processed > 0)`
(`src/main.rs:380-405`). `max rows_processed reached` is reported beside the monotonicity verdict
because `rows_monotone_non_decreasing` is vacuously `true` for a sequence that never leaves `0`
(`src/main.rs:350-353`).

**The reset transition.** In `results/probe-output-2.txt`'s config-B run, sample `[8]` (`:21`) is
the last with a nonzero count -- `rows_processed=100000`, `total_rows_to_process=100002`,
`percentage=99.998000` -- and sample `[9]` (`:22`), taken next, reads `percentage=-1.000000`,
`rows_processed=0`, `total_rows_to_process=0`. That is not a monotonicity violation (the active
window ends at `[8]`), and it is a real transition to the unavailable reading: a raw
`duckdb_query_progress` reading cannot be forwarded to a client as-is. An engine carrying it would
latch the count producer-side (ADR-029 1(b),
`docs/adr/ADR-029-scan-progress-carrier-quantity.md:73`) and treat `-1`/`0`/`0` as ADR-029 3(c)'s
named-absent state (`:86` in the same file), never as "zero rows processed".

**Population is not guaranteed.** Of the two archived config-B runs, one populated and one did
not (`results/probe-output-2.txt:28`; `results/probe-output.txt:26`); all six archived config-C
runs populated. Config C samples between `duckdb_pending_execute_task` calls on one thread, so its
sampling points do not depend on the background query thread config B polls (`src/main.rs:153`).
No recommendation about which sampling shape an engine implementation should use is made here.

## (c) What the reading is, and is not

- **Whole-query, not scan-specific.** The function's doc comment names its scope as the connection
  running the query (`bindgen_bundled_version.rs:905`), and the C++ it calls reads
  `conn->context->GetQueryProgress()` (`duckdb-c.cpp:130-131`) -- a per-`ClientContext` value, not
  a per-operator one. This probe's query is one `read_parquet` scan plus an aggregate, so in this
  shape the whole-query reading is that scan's; the C API offers no way to isolate one operator's
  progress inside a larger query.
- **With no progress-bar pragma set, there is no reading.** Config A sets none and shows the
  unavailable sentinel on every sample, taken *while the query runs* -- the poll loop is entered
  immediately after the query thread is spawned (`src/main.rs:153`, the `scope.spawn` at `:135`),
  so this design has no "before the query starts" phase: `results/probe-output.txt:3-8`
  (6 samples) and `results/probe-output-2.txt:3-9` (7). The bundled C++ agrees: a `ProgressBar` is
  allocated only `if (config.enable_progress_bar)` (`client_context.cpp:567`, the allocation at
  `:574-576`), and `query_progress` is assigned in the per-task update under the same condition
  (`:653-656`). The engine sets no progress-bar pragma today -- `engine/src/pool.rs:185-187`'s
  `CONFIGURE_SQL` sets `autoinstall_known_extensions`, `autoload_known_extensions` and
  `enable_geoparquet_conversion`, and nothing else.
- **What the archives establish about the pragmas.** Configs B and C each set three, in this
  order: `enable_progress_bar_print=false`, `enable_progress_bar=true`, `progress_bar_time=0`
  (`src/main.rs:479-485`, `:501-507`). The archived evidence separates "no pragma set" (config A,
  no reading) from "all three set" (configs B and C, the reading populates); it does not separate
  the three from one another, and no archived configuration ran with the default `wait_time`. Two
  source facts bound them: `wait_time` is read inside `ProgressBar` only by `ShouldPrint`
  (`progress_bar.cpp:95-99`), a print gate; and `enable_progress_bar_print` sets only
  `config.print_progress_bar` (`settings.hpp:817-819`, `custom_settings.cpp:1091-1094`), checked
  at `client_context.cpp:569` to decide whether to attach a display callback, never gating whether
  `query_progress` is computed. The probe sets it so that no ETA text is printed; ADR-029 1(d)
  (`docs/adr/ADR-029-scan-progress-carrier-quantity.md:75`) forbids producing or deriving an ETA
  from the pair on either side of the wire.
- **A count in whole units, beside a separately derived fraction.** `rows_processed` and
  `total_rows_to_process` are whole-row `u64` counts; `percentage` is an `f64` derived separately.
  In the bundled C++, inside `ProgressBar::Update` (`progress_bar.cpp:107-136`): `:120` assigns
  `query_progress.rows_processed = idx_t(progress.done)`, truncating a double; `:121` assigns the
  total the same way; `:122` computes `new_percentage` from the untruncated
  `progress.ProgressDone() * 100`; `:129-130` assign `query_progress.percentage` only when the new
  value is strictly greater. `percentage` is therefore monotone by construction, while
  `rows_processed` and `total_rows_to_process` are assigned every call with no latch -- every
  monotone `rows_processed` reading reported here is monotone by observation over the archived
  runs, not by DuckDB's own code.
- **The count and the fraction can disagree.** `results/probe-output.txt:4908` reads
  `percentage=14.335713 rows_processed=14335 total_rows_to_process=100002`, and
  `14335 / 100002 * 100` is `14.334713...`, not `14.335713` -- the truncated count against the
  untruncated source of the fraction (`:120` against `:122`). Not every sample shows the
  difference at six decimal places; this one does.
- **The denominator is an estimate, and the ADR does not admit one.** `total_rows_to_process`
  reads 100,002 for this 100,000-feature fixture (`results/probe-output-2.txt:15-21`;
  `engine/LOD-PREREGISTRATION.md:146`), which is why `percentage` tops out at `99.998000` at true
  completion (`results/probe-output-2.txt:21`). ADR-029 1(c)
  (`docs/adr/ADR-029-scan-progress-carrier-quantity.md:74`) carries the total only when the footer
  or plan declares one, absent otherwise, never estimated.
- **Three fields, and no others.** `percentage`, `rows_processed`, `total_rows_to_process`
  (`bindgen_bundled_version.rs:291-295`): the struct carries no rate, no ETA and no elapsed-time
  field.

## (d) If no reading existed

Not invoked: a reading exists (see (a), (b)). G1's own text at
`docs/adr/ADR-029-scan-progress-carrier-quantity.md:113` states what would have followed -- the
quantity question returning to the human. That branch is not exercised by this result.

## Incidental findings (not G1's question; recorded because they shaped the probe)

- **The query sums `id`, not `geometry`.** Summing `id`, a plain `UBIGINT` column, forces a
  per-row scan of `read_parquet`'s output while avoiding the `geometry` column, for the reason
  recorded at `src/main.rs:116-128` (this fixture's GeoParquet metadata on that column). The
  engine disables that conversion on its own connections (`engine/src/pool.rs:187`,
  `enable_geoparquet_conversion=false`); this probe does not set that pragma.
- **Extension autoload defence.** Every configuration sets `autoinstall_known_extensions=false`
  and `autoload_known_extensions=false` first (`src/main.rs:453`, `:479-485`, `:501-507`),
  matching `engine/src/pool.rs:185-186`, because `spikes/lod-feasibility/README.md`'s "Route A
  static bundling" section found this bundled build compiles with both defaulted on
  (`libduckdb-sys-1.10505.0/build_bundled_cc.rs:96-97`). This probe needs no DuckDB extension.

## Checks

`exit 0` is not evidence of anything claimed here: `main()` prints a `FAILED` line and returns
normally on an error (`src/main.rs:466`, `:492`, `:516`). Every claim above rests on an archived
output line cited by number, or on a source file cited by line.

- `cargo build --release --manifest-path spikes/adr-029-g1-scan-progress/Cargo.toml`
- `cargo run --release --manifest-path spikes/adr-029-g1-scan-progress/Cargo.toml` -- run twice,
  both archived as `results/probe-output.txt` and `results/probe-output-2.txt`.
- This crate is excluded from the product workspace by its own empty `[workspace]` table
  (`Cargo.toml:12`), the convention `spikes/lod-feasibility/rust/Cargo.toml` uses; the check that
  the root manifest is untouched is `git diff --stat origin/main -- Cargo.toml Cargo.lock`, empty
  at both scoped reads (gate-log records 80 and 86).
