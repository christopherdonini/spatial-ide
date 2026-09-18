# ADR-029 gate G1 -- scan-progress feasibility probe

Headless, reported-only. This spike code (`Cargo.toml`, `src/main.rs`) is throwaway per
`spikes/` convention -- **the written conclusion below is the deliverable.** No product code, no
new dependency in any product crate, no wire change, no benchmark, no duration is added or claimed
by this spike.

**Correction round (this revision).** A scoped review of the first version found the Conclusion
overclaimed reachability, mis-stated the precondition and the idle sentinel, missed a real
monotonicity-adjacent transition, understated two DuckDB-internal facts about latching and
truncation, and carried several loose claims and one non-byte-exact quotation. All are corrected
below, each verified against this build's own bundled C++ under
`target/release/build/libduckdb-sys-634b764a95be3523/out/duckdb/` (cited by path relative to that
root) and, for the engine's own code, against the tracked tree.

## Question

Node `adr-029-g1-feasibility` (`PLAN.yaml`) discharges G1 as
`docs/adr/ADR-029-scan-progress-carrier-quantity.md:113` states it, quoted verbatim -- byte-copied
from that line (sha256 `2962c7107e7b54463c6ab616ea04c6780954ff80d0ed46aecd9a7e3d601f9500`), markdown
list marker and bold retained rather than rewrapped:

> - **G1 (feasibility, first and blocking).** Verify against the vendored `duckdb` crate that a monotone scan-progress reading exists on the `read_parquet` path *before* any wire work; if it does not, the quantity question returns to the human — the §13 F conditional-escalation precedent (`ADMISSION-PREREGISTRATION.md:254`). G1 is tracked as its own plan node `adr-029-g1-feasibility`, run on a quiet machine, and its result returns here (and to the human if it bounces).

DECISIONS-PENDING.md entry 92 (question set C, item C2, the human's ruling of 2026-09-14) is the
same gate carried in the ledger: "G1's feasibility gate returns the quantity question to me if no
monotone reading exists rather than shipping a non-monotone one" -- referenced by entry number, not
reproduced further.

## Conclusion

**G1 clears for the reading's existence on the `read_parquet` path. It does not clear for the
engine's current scan path**, and no recommendation between the three routes below is made here --
the human decides.

The reading exists: `duckdb_query_progress` returns a monotone, non-decreasing, whole-unit (`u64`)
`rows_processed` count, observed reaching this fixture's true row count (100,000) in every one of
six config-C (deterministic driver) runs across two archived probe invocations, and in most config-B
runs when the reading populated at all (see (b), (c)).

**Why it does not reach the engine's current path.** `duckdb_query_progress` reads
`conn->context->GetQueryProgress()` (`src/main/capi/duckdb-c.cpp:130-131`) -- **one `ClientContext`
per connection object**, not a database- or process-wide value. This probe only observes it because
it polls the *same* raw connection it drives the scan on. The engine's actual `read_parquet` scans
run through `duckdb::Connection`'s safe wrapper end to end (`engine/src/pool.rs:278`'s
`Physical { conn: Connection, .. }`; `engine/src/stream.rs:1635` `conn.prepare(sql)`, `:1666`
`stmt.stream_arrow(params.as_slice())`), and cancellation already holds a `duckdb::InterruptHandle`
for that same connection (`engine/src/cancel.rs:19`, `use duckdb::InterruptHandle;`) -- but
`Connection` never exposes the raw `duckdb_connection` handle a *second*, independently-opened raw
connection would need to observe *that* connection's progress, and `InterruptHandle` exposes only
`interrupt()` (`inner_connection.rs:307`), never the handle its own private `conn` field already
holds (`inner_connection.rs:57,61` `InnerConnection.con`; `:285-286` `InterruptHandle.conn`; both
private, in a module the crate declares with plain `mod inner_connection;` -- `lib.rs:115` -- not
`pub mod`). Three routes exist, each with a real cost:

1. **The engine drives the scan through raw `ffi` end to end**, the way this probe does. Cost:
   abandoning `Statement::stream_arrow` and the statement cache for this path, and replacing
   `CancelToken`'s `InterruptHandle`-based cancel (`engine/src/cancel.rs`) with a hand-rolled
   `duckdb_interrupt` call against a connection the engine now manages by raw pointer -- the pooled
   `Connection` (`engine/src/pool.rs`) would need its own raw-handle counterpart for this one path,
   or the whole pool would need to stop using `Connection` at all.
2. **A crate patch or fork** adds an accessor -- `InterruptHandle::query_progress()` is the
   cheapest shape, since `InterruptHandle.conn` (`inner_connection.rs:286`) already holds exactly
   the handle `duckdb_query_progress` needs, right beside the `interrupt()` method that already
   calls a different raw `ffi` function on it (`:307-314`) -- or a `Connection::query_progress()`
   forwarding through `InnerConnection.con`. Cost: a vendored/forked dependency, or an upstream PR's
   review latency, for one accessor.
3. **Upstream**: propose the accessor to `duckdb-rs` directly. Cost: no control over acceptance or
   timing.

## (a) The surface used

The *only* progress-*reading* C API surface anywhere in the vendored bindings is
`duckdb_query_progress` / `duckdb_query_progress_type`. Registry path (crate version 1.10505.0,
matching `Cargo.lock`'s `duckdb` entry and `engine/Cargo.toml:39`'s `duckdb = { version =
"1.10505.0", ... }`; `C:\Users\Christopher\.cargo\registry\src` is itself a junction to
`D:\caches\cargo-registry\src`, confirmed via `fsutil reparsepoint query`):

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
- The function, line 906 (doc comment line 905, newline before `@return` preserved -- the source
  string itself is `"Get the progress of the running query.\n\n @param connection The connection
  running the query.\n @return The query progress type containing progress information."`):
  ```rust
  pub fn duckdb_query_progress(connection: duckdb_connection) -> duckdb_query_progress_type;
  ```
- **What it actually reads, in the bundled C++ this build compiled**
  (`target/release/build/libduckdb-sys-634b764a95be3523/out/duckdb/src/main/capi/duckdb-c.cpp:122-135`):
  ```cpp
  duckdb_query_progress_type duckdb_query_progress(duckdb_connection connection) {
      ...
      Connection *conn = reinterpret_cast<Connection *>(connection);
      auto query_progress = conn->context->GetQueryProgress();
      ...
  }
  ```
  `conn->context` is that `Connection` object's own `ClientContext` -- per-connection state, not a
  database-wide or cross-connection value (see the Conclusion for the consequence).

A search of `libduckdb-sys-1.10505.0/src/*.rs` (both bindings files, `bindgen_bundled_version.rs`
and `bindgen_bundled_version_loadable.rs`) for `progress` (case-insensitive) returns 15 matching
lines: 4 in `bindgen_bundled_version.rs` (the two declarations above, each appearing twice -- once
in a `#[doc]` comment, once in the item itself) and 11 in `bindgen_bundled_version_loadable.rs`, an
**alternate** bindings file this crate's `build.rs` copies in only when the `loadable-extension`
feature is enabled (`libduckdb-sys-1.10505.0/build.rs:76-79`, the vendored crate's own `build.rs`,
not a tracked file in this repository; this crate does not enable it) -- its extra hits are the same
two items reached through that build's different calling convention (a function-pointer table), not
a different progress surface. No separate `PROGRESS_BAR` C function exists in either file.

**`duckdb_pending_prepared` / `duckdb_pending_execute_task`** (lines 1570, 1592;
`duckdb_pending_execution_is_finished` line 1607; `duckdb_execute_pending` line 1600;
`duckdb_pending_error` line 1588; `duckdb_destroy_pending` line 1584; the state enum, lines 53-58)
is a second, separate C API surface -- the brief's "PendingQuery, task-progress" -- but it is not
itself a progress *reading*. This probe uses it only as a deterministic **driver**: each call to
`duckdb_pending_execute_task` performs one bounded unit of work and returns, so
`duckdb_query_progress` can be sampled between calls on the same thread. `duckdb_prepare`
(line 1280), `duckdb_prepare_error` (line 1292) and `duckdb_destroy_prepare` (line 1288) round out
that path.

**Reachability from `duckdb::Connection`: none.** A search of `duckdb-1.10505.0/src/**/*.rs` for
`progress` (case-insensitive) returns no matches at all -- the earlier version of this document
claimed two false-trigger substrings ("appending", "depending"); there are none, because there is
nothing to find. `duckdb::ffi::duckdb_query_progress` is nonetheless *reachable* as an item -- the
crate re-exports the whole `libduckdb-sys` surface: `duckdb-1.10505.0/src/lib.rs:58`,
`pub use libduckdb_sys as ffi;` -- but calling it needs a raw `duckdb_connection` handle, and
`duckdb::Connection` never exposes one:

- `duckdb-1.10505.0/src/lib.rs:115`: `mod inner_connection;` -- a **private** module (not `pub
  mod`), so nothing it declares is part of the crate's public API regardless of its own items'
  visibility.
- `duckdb-1.10505.0/src/inner_connection.rs:57,61`: `pub struct InnerConnection { ... pub con:
  ffi::duckdb_connection, ... }` -- `pub`-in-private; unreachable from outside the crate.
- `duckdb-1.10505.0/src/lib.rs:271-272`: `pub struct Connection { db: RefCell<InnerConnection>,
  ... }` -- the `db` field itself carries no `pub`, so even `InnerConnection`'s own visibility is
  moot.
- `duckdb-1.10505.0/src/inner_connection.rs:285-286`: `InterruptHandle`'s `conn:
  Mutex<ffi::duckdb_connection>` is likewise private; its only public method is `interrupt()`
  (`:307-315`), which calls `ffi::duckdb_interrupt` internally but never returns the handle itself.
- A search of the whole crate for `duckdb_connection` (case-sensitive, the raw type name) finds
  exactly six occurrences: the four declarations above (`inner_connection.rs:61,69,286,293`) plus
  two more, unrelated to obtaining a handle for reading -- `vscalar/function.rs:30`'s
  `register_with_connection(&self, con: duckdb_connection)` and `:58`'s corresponding `use`, part of
  scalar-function registration (DuckDB calling *into* Rust with a raw connection, the opposite
  direction from what reading progress would need).

So this probe does not use `duckdb::Connection` at all -- it drives `duckdb::ffi`'s raw C API
directly (`duckdb_open`/`duckdb_connect`/`duckdb_prepare`/`duckdb_pending_prepared`/
`duckdb_pending_execute_task`/`duckdb_query_progress`), reachable by a probe that manages its own
connection end to end, at the cost of writing the connection- and statement-management code
`Connection`/`Statement` would otherwise supply -- and, per the Conclusion, at the cost of never
being the engine's *actual* connection.

## (b) The raw sample sequence

Fixture: `polygons-100k`, provenance `engine/LOD-PREREGISTRATION.md:146` (100,000 features, path
`C:\dev\spatial-ide\target\fixtures\slice-budgets\polygons-100k.parquet`, regenerated via
`engine/tests/common/mod.rs`'s `polygons_100k()` if absent). **Exclusion, named rather than worked
around:** `engine/tests/lod_tier_builder.rs`'s own `#[ignore]`d fixture-regeneration-race test moves
this exact path aside for the duration of its run (`lod_tier_builder.rs:101-117`); this probe reads
the same shared path and must not be run while that one test is running by hand. It was not, for
either archived run below. Query: `SELECT sum(id) FROM read_parquet('<fixture>')` (see "Incidental
findings" for why `id`, not `geometry`). Command:

```
cargo run --release --manifest-path spikes/adr-029-g1-scan-progress/Cargo.toml
```

**Two full probe invocations are archived, and only these two are counted as evidence** (the
discipline this revision adopts throughout: archive what is counted, count only what is archived).
Both post-date the `enable_progress_bar_print=false`-ordering fix this round makes (see "Incidental
findings"); neither carries any DuckDB-printed ETA text.

- `results/probe-output.txt` -- config B's reading never populated at all this run
  (`rows_processed` stayed `0` throughout); all three config-C runs still reached the true maximum,
  100,000, and one of its samples shows the `percentage` vs. `rows_processed`/`total_rows_to_process`
  discrepancy (c) documents.
- `results/probe-output-2.txt` -- config B populated and reached the true maximum before resetting
  (see below); all three config-C runs reached 100,000.

**Config C (the deterministic pending-task driver), the gate's primary evidence -- six runs total,
three per archived file, every one monotone non-decreasing and reaching max `rows_processed` =
100,000:**

```
probe-output.txt   run 1: 100000  (line 161)
probe-output.txt   run 2: 100000  (line 9143)
probe-output.txt   run 3: 100000  (line 9159)
probe-output-2.txt run 1: 100000  (line 48)
probe-output-2.txt run 2: 100000  (line 75)
probe-output-2.txt run 3: 100000  (line 102)
```

Each printed verdict line states, verbatim (`probe-output-2.txt:48`, representative of all six):
`run 1: over 12 active-window samples -- rows_processed monotone non-decreasing = true, percentage
monotone non-decreasing = true, max rows_processed reached = 100000 (the load-bearing figure --
monotonicity alone is vacuous at 0), 1 post-active sample(s), all reset to the unavailable sentinel
= true`. "Active window" is the prefix ending at the *last* sample with `rows_processed > 0`, not
merely the last sample of the run -- `src/main.rs`'s `verdict()` function; see the note on config B
below for why the two are not the same thing, and why `max rows_processed reached` is reported
beside the monotonicity verdict rather than the verdict alone (`rows_monotone_non_decreasing` is
vacuously `true` for a sequence that never leaves `0`, `src/main.rs:342-347`'s doc comment). One
`probe-output.txt` config-C run (line 162, 8,927 samples -- machine load widened its own sampling
window far past the other five runs') shows how large this can get; it is still one run, still
`true`, still capped by the same active-window definition.

**Config B (the background-thread method) -- not counted toward the six runs above, kept as
corroboration that the reading is a property of `duckdb_query_progress` itself, not an artifact of
the pending-task driver, and as the source of the findings below.**

`probe-output-2.txt` lines 13-22 (the full config-B sample sequence for that run):
```
[0] percentage=-1.000000 rows_processed=0      total_rows_to_process=0
[1] percentage=-1.000000 rows_processed=0      total_rows_to_process=0
[2] percentage=0.000000  rows_processed=0      total_rows_to_process=100002
[3] percentage=0.000000  rows_processed=0      total_rows_to_process=100002
[4] percentage=0.000000  rows_processed=0      total_rows_to_process=100002
[5] percentage=0.000000  rows_processed=0      total_rows_to_process=100002
[6] percentage=0.000000  rows_processed=0      total_rows_to_process=100002
[7] percentage=0.000000  rows_processed=0      total_rows_to_process=100002
[8] percentage=99.998000 rows_processed=100000 total_rows_to_process=100002
[9] percentage=-1.000000 rows_processed=0      total_rows_to_process=0
```
Sample `[8]` (line 21) is the last one with a nonzero count -- the true completion, 100,000 -- and
sample `[9]` (line 22), taken immediately after, is already the full idle sentinel. This is **not**
a monotonicity violation (`rows_monotone_non_decreasing` over the active window, samples
`[0]..=[8]`, is `true` -- the reset sample is excluded from that window by construction, not by
dropping "the last sample" as a rule; see `src/main.rs`'s `verdict()`, written specifically because
an earlier version of this probe's exclusion logic *did* only drop the last sample, which a reset
landing earlier than the last sample -- as a separately observed, unarchived config-B run did,
falling to the sentinel from a nonzero count *before* the run's own final sample -- would have
mis-handled). It **is** a real transition to the unavailable sentinel, and its consequence for the
engine is direct: a raw `duckdb_query_progress` reading, if it ever reached the engine (via route
(i)/(ii)/(iii) above), cannot be forwarded as-is to a client -- the engine would need to latch the
count producer-side (never let a wire-visible reading regress) and treat `-1`/`0`/`0` as ADR-029
3(c)'s named-absent state, not as "zero rows processed".

**The reading's population is load-dependent, independent of which sampling method is used.**
`probe-output.txt` lines 12-21 show a complete config-B run where `rows_processed` never left `0` at
all (verdict line 26: `rows_processed never left 0 in any of this run's samples -- the reading did
not populate`) -- observed repeatedly in this session (roughly two-thirds of a larger, unarchived
batch of repeated invocations run while diagnosing this and preparing this revision, not itself
counted as evidence per the archived-only rule above; this machine had two other, unrelated `cargo
run` processes active throughout that batch, per `tasklist`). Sampling `duckdb_query_progress`
between `duckdb_pending_execute_task` calls (config C) removes this probe's *own* poll-vs-wall-clock
race against a background thread -- it does not guarantee the reading populates at all. Both
archived config-C files populated on every one of their six sub-runs; config B did not, in
`probe-output.txt`. No recommendation about which sampling shape an engine implementation should use
is made from this observation -- it is reported, not resolved.

## (c) What the reading is, and is not

- **Whole-query, not scan-specific.** `duckdb_query_progress`'s own doc names its scope: "the
  connection running the query" (`bindgen_bundled_version.rs:905`) -- confirmed against the C++ it
  calls, `conn->context->GetQueryProgress()` (`duckdb-c.cpp:130-131`), a per-`ClientContext` value,
  not per-operator. This probe's query (`SELECT sum(id) FROM read_parquet(...)`) is a single scan
  plus a trivial aggregate, so the whole-query reading is, in this specific shape, dominated by the
  scan -- but the C API provides no way to isolate "the `read_parquet` operator's" progress from any
  other operator a larger query might also run.
- **The precondition: with defaults, no reading at all.** Config A (no `enable_progress_bar`) shows
  the idle sentinel on every sample, taken *while the query runs* -- the poll loop starts once the
  query thread is spawned (`src/main.rs:145`'s `while !done_ref.load(...)`, entered immediately
  after `scope.spawn`), so there is no "before the query starts" phase in this design; the idle
  reading is not from before the query, it is from *during* a query DuckDB was never asked to track.
  Confirmed in the bundled C++: a `ProgressBar` is allocated, and `query_progress` is ever assigned,
  only `if (config.enable_progress_bar)` (`client_context.cpp:567`, gating the allocation at
  `:574-576`, and `:653-656`, gating the per-task update that assigns `query_progress`). The engine
  does not set this today: `engine/src/pool.rs:185-187`'s `CONFIGURE_SQL` sets
  `autoinstall_known_extensions`, `autoload_known_extensions` and `enable_geoparquet_conversion`,
  never `enable_progress_bar`. The reading also requires `SET progress_bar_time=0` in practice (the
  default `wait_time` otherwise delays `ProgressBar` construction) and, to avoid printing DuckDB's
  own ETA text to match ADR-029 1(d)'s "no ETA" rule, `SET enable_progress_bar_print=false`
  (`settings.hpp:817-819`'s `EnableProgressBarPrintSetting`; `custom_settings.cpp:1091-1094`'s
  `SetLocal`, which only sets `config.print_progress_bar` -- checked at `client_context.cpp:568`
  purely to decide whether to attach a *display* callback, never gating whether `query_progress`
  itself is computed). This probe sets all three for configs B and C (`src/main.rs`'s `setup_b`/
  `setup_c`); the idle sentinel itself is at `probe-output.txt:3-8` (all six of config A's samples,
  no `enable_progress_bar` set) and again at `:12,13,20,21` (config B's own samples in that
  particular run -- one where the reading never populated at all, see (b)) -- an earlier version of
  this document mis-cited a 99.998%-reading line as the sentinel.
- **A count, in whole units, alongside a derived fraction -- computed differently, not identical.**
  `rows_processed: u64` and `total_rows_to_process: u64` are whole-row counts; `percentage: f64` is
  a *separately* derived fraction. In the bundled C++ (`progress_bar.cpp`, inside
  `ProgressBar::Update`, `:107-136`):
  ```cpp
  query_progress.rows_processed = idx_t(progress.done);           // line 120 -- truncates a double
  query_progress.total_rows_to_process = idx_t(progress.total);   // line 121
  new_percentage = progress.ProgressDone() * 100;                 // line 122 -- from the untruncated double
  ...
  if (new_percentage > query_progress.percentage) {                // line 129 -- LATCH
      query_progress.percentage = new_percentage;                  // line 130
  }
  ```
  `percentage` is monotone by construction (only ever assigned when strictly greater than its
  current value); `rows_processed`/`total_rows_to_process` are assigned unconditionally every call,
  with **no** latch -- every monotone reading this document reports for `rows_processed` is
  monotone *by observation*, on the runs archived, not guaranteed by DuckDB's own code the way
  `percentage` is. Because `rows_processed` is a truncated `idx_t(double)` while `percentage` comes
  from the *untruncated* double, the two can disagree: `probe-output.txt:4908`'s sample
  (`percentage=14.335713 rows_processed=14335 total_rows_to_process=100002`) does not satisfy
  `percentage == rows_processed / total_rows_to_process * 100` -- that formula gives `14.334713`,
  not `14.335713` -- a real, small, truncation-vs-untruncated-source discrepancy (not every sample
  shows it measurably at six decimal places; this one does). An earlier version of this document
  claimed the two always matched exactly; they do not.
- **No rate, no ETA, no elapsed time is carried by this struct at all.** Its only three fields are
  `percentage`, `rows_processed`, `total_rows_to_process` (`bindgen_bundled_version.rs:291-295`).
  The printed ETA text this probe's earlier archived output carried (DuckDB's own progress-bar
  display) is a *separate* code path (`ProgressBar::PrintProgress`, gated by `print_progress_bar`)
  and is suppressed in this round's archived runs by `enable_progress_bar_print=false` -- neither
  archived file contains it.

## (d) If no reading existed

Not invoked -- a reading exists (see (a), (b)). For the record, G1's own text names what would
follow: see the quoted clause under "Question" above
(`docs/adr/ADR-029-scan-progress-carrier-quantity.md:113`) -- the quantity question would have
returned to the human. That branch is not exercised by this result.

## Incidental findings (not G1's question; recorded because they shaped the probe)

- **GeoParquet auto-typing.** An earlier version of this probe's query touched the `geometry`
  column (`SELECT sum(length(geometry)) FROM read_parquet(...)`) and failed to bind: `read_parquet`
  auto-detects this fixture's GeoParquet `geo` key-value metadata and casts the column to a
  `GEOMETRY(<projjson CRS>)` type, which has no `length()` overload. The engine itself disables this
  conversion (`engine/src/pool.rs:187`'s `enable_geoparquet_conversion=false`, part of
  `CONFIGURE_SQL`) -- this probe does not set that pragma, so it took the simpler route of summing
  `id` (a plain `UBIGINT` column, untouched by GeoParquet typing) instead.
- **Extension autoload defense.** Every configuration in this probe runs `SET
  autoinstall_known_extensions=false; SET autoload_known_extensions=false;` before anything else,
  matching what the engine's own `CONFIGURE_SQL` sets (`engine/src/pool.rs:185-186`), because
  `spikes/lod-feasibility/README.md`'s "Route A static bundling" section already found this bundled
  build compiles with both defaulted **on**
  (`libduckdb-sys-1.10505.0/build_bundled_cc.rs:96-97`). This probe does not need, use, or depend on
  any DuckDB extension.

## Checks

`exit 0` alone is not evidence of anything this document claims (`main()` prints a `FAILED` line and
still returns normally on an error, `src/main.rs`'s `Err(e) => println!(...)` arms) -- the claims
above rest on the printed verdict lines cited by exact `results/*.txt` line number, not on process
exit status.

- `cargo build --release --manifest-path spikes/adr-029-g1-scan-progress/Cargo.toml` -- exit 0,
  warning-free.
- `cargo run --release --manifest-path spikes/adr-029-g1-scan-progress/Cargo.toml` -- run twice and
  archived (`results/probe-output.txt`, `results/probe-output-2.txt`); each archived run's own
  printed verdict lines are what (b) and (c) cite, not the process exit code.
- This crate is excluded from the workspace by its own `[workspace]` table (`Cargo.toml`, same
  convention as `spikes/lod-feasibility/rust/Cargo.toml`); `cargo build`/`test --workspace --locked`
  from the repository root do not touch it and its build does not touch the root `Cargo.lock`
  (`git diff --stat origin/main -- Cargo.toml Cargo.lock` empty).
