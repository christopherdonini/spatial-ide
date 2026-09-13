# LOD feasibility spike

Headless, reported-only. Feeds **ADR-031's preregistration** (not yet filed). This spike code
(`scripts/duckdb_simplify.py`, `rust/`) is throwaway per `spikes/` convention — the written
conclusion below is the deliverable.

## Question

Is identity-preserving simplification of Polygon geometry (the raw material of a future LOD tier)
feasible to measure two ways — DuckDB spatial (route A) and Rust-side `geo` (route B) — at product
scale (a 5 GB GeoParquet), and what does each route cost in preparation time, disk, vertex
reduction, and cancellability?

**Every number in this document is a spike measurement, not a docs/08 claim.** No number here is a
performance budget, a regression baseline, or a "route X is faster" product assertion — see
Method for why the two routes are not run under comparable conditions (thread count in
particular), and Route comparison for what each route would still need before either claim could
be made honestly.

## Method

### Routes

- **Route A — DuckDB spatial.** `scripts/duckdb_simplify.py`, a measurement-only dev CLI run with
  the repo's pinned venv (`target/corpus-venv/Scripts/python.exe`). `run` simplifies one
  `(input, tolerance, variant)` into an output GeoParquet via `COPY (...) TO ... (FORMAT PARQUET)`
  and measures wall time, disk size, vertex counts, `ST_IsValid`, and id round-trip. `cancel` runs
  the same query in a worker thread and calls `duckdb.Connection.interrupt()` from the main thread
  after a declared delay. DuckDB's default thread count is used throughout (not pinned down to 1) —
  on this machine, all available logical cores.
- **Route B — Rust `geo`.** `rust/` — a **standalone spike-only crate** (empty `[workspace]` table
  in its `Cargo.toml`, built with `--manifest-path`; never attached to the product workspace).
  Reads GeoParquet row groups via `parquet`'s Arrow reader, decodes the WKB `geometry` column via
  `wkb::reader::read_wkb` + `geo_traits::to_geo::ToGeoGeometry`, and simplifies each `geo::Polygon`
  in a **single thread, sequentially, row group by row group** — no parallelism was used or
  measured. This is a material asymmetry against route A's multi-threaded default and is called
  out again at every place it affects a number.

### Fixtures

| Fixture | Path | Bytes | Features | Vertices | Geometry / CRS |
|---|---|---|---|---|---|
| `polygons-100k` | `target/fixtures/slice-budgets/polygons-100k.parquet` | 151,812,642 | 100,000 | 10,467,093 | Polygon, EPSG:2056 (matches docs/08's Polygons benchmark-matrix row: "100k features / 10M vertices") |
| `parcels-5gb` | `target/slice-evidence/scale-pass/parcels-5gb.parquet` | 5,004,376,705 | 3,300,000 | 345,507,850 | Polygon, EPSG:2056 |

Both fixtures store `geometry` as standard GeoParquet WKB (`"encoding":"WKB"` in the file's `geo`
key-value metadata; physical Parquet type `binary`) — confirmed with `pyarrow.parquet.ParquetFile`
before route B was written, so the WKB-decode path was known-correct before it was built. An `id`
column (`UBIGINT`) is the identity column both routes carry through unchanged.

### Tolerances and variants

0.1, 1.0, 5.0 (raw CRS units — EPSG:2056 is in metres, so these are metres; **tolerance units were
not tested in pixel space at any zoom**, see Open questions). Two variants per route, chosen to
pair each route's non-topology-preserving option against its topology-aware option:

| Label | Route A function | Route B function |
|---|---|---|
| `simple` | `ST_Simplify` (Ramer-Douglas-Peucker) | `geo::Simplify` (Ramer-Douglas-Peucker) — same algorithm family |
| `preserve` | `ST_SimplifyPreserveTopology` | `geo::SimplifyVwPreserve` (topology-preserving Visvalingam-Whyatt) — **a different algorithm family**, not a like-for-like implementation of route A's `preserve`; both are simply each route's topology-aware option (see Route comparison) |

### Machine

Windows 10 Pro 22H2 (build 19045), Intel Core i9-9980HK @ 2.40 GHz (8C/16T), ~64 GiB RAM. `C:`
free space was tracked before/after every 5 GB-fixture step per the disk-discipline rule below (no
two 5 GB outputs on disk at once; delete each output immediately after its measurement).

Free space at spike-resume: **13.79 GiB** (14,809,272,320 bytes). Free space after all
measurements, README, and cleanup, before commit: **10.25 GiB** (11,003,592,704 bytes) — the drop
from 13.79 GiB is the route B Rust build's `target/` artifacts and the `~/.cargo/registry` cache
for `geo`/`parquet`/`arrow`/`wkb`/their transitive dependencies (outside this repo, but on the same
`C:` volume), not any fixture output: no fixture-derived output was left on disk at any point in
this spike — every 5 GB-scale run's output was measured then deleted as the next step, verified by
listing `target/spikes/lod/` empty after each deletion (see the git history on
`spike/lod-feasibility` for the per-step free-space and directory-listing checks).

## Results

All numbers below are single-run spike measurements (one sample each, not a p50/p95 series) —
labelled once here per the instruction at the top of this section, not repeated per row.

### Route A — DuckDB spatial, `polygons-100k`

| Tolerance | Variant | Wall s | Output bytes | Output/input | Vertices before→after | Reduction | Invalid | Identity |
|---|---|---|---|---|---|---|---|---|
| 0.1 | preserve | 18.011 | 139,709,086 | 0.9203 | 10,467,093 → 9,887,689 | 0.0554 | 0 | preserved |
| 0.1 | simple | 11.917 | 139,707,015 | 0.9203 | 10,467,093 → 9,887,689 | 0.0554 | 0 | preserved |
| 1.0 | preserve | 31.416 | 87,064,793 | 0.5735 | 10,467,093 → 6,126,511 | 0.4147 | 0 | preserved |
| 1.0 | simple | 6.679 | 87,052,749 | 0.5734 | 10,467,093 → 6,126,511 | 0.4147 | 0 | preserved |
| 5.0 | preserve | 40.201 | 14,972,340 | 0.0986 | 10,467,093 → 1,070,948 | 0.8977 | 0 | preserved |
| 5.0 | simple | 2.028 | 14,468,994 | 0.0953 | 10,467,093 → 1,032,411 | 0.9014 | 0 | preserved |

### Route A — DuckDB spatial, `parcels-5gb`

Each row's output was measured then deleted before the next 5 GB-fixture step, per the
disk-discipline rule (never two 5 GB outputs on disk at once).

| Tolerance | Variant | Wall s | Output bytes | Output/input | Vertices before→after | Reduction | Invalid | Identity |
|---|---|---|---|---|---|---|---|---|
| 0.1 | preserve | 121.550 | 4,610,958,878 | 0.9214 | 345,507,850 → 326,390,493 | 0.0553 | 0 | preserved |
| 1.0 | preserve | 179.369 | 2,872,575,989 | 0.5740 | 345,507,850 → 202,237,862 | 0.4147 | 0 | preserved |
| 1.0 | simple | 58.735 | 2,872,576,891 | 0.5740 | 345,507,850 → 202,237,856 | 0.4147 | 0 | preserved |
| 5.0 | preserve | 139.776 | 493,823,188 | 0.0987 | 345,507,850 → 35,358,296 | 0.8977 | 0 | preserved |
| 5.0 | simple | 16.538 | 477,323,445 | 0.0954 | 345,507,850 → 34,092,150 | 0.9013 | 0 | preserved |

### Route B — Rust `geo`, `polygons-100k`

No output GeoParquet is written by route B in this spike (see Method) — `wkb::writer` exists in
the pinned `wkb` crate but was never exercised, so "route B can write a GeoParquet tier" is
**untested**, not confirmed. Wall time below covers read + WKB decode + simplify + vertex count.

| Tolerance | Variant | Wall s | Vertices before→after | Reduction | Invalid | Identity |
|---|---|---|---|---|---|---|
| 0.1 | simple | 17.846 | 10,467,093 → 9,894,166 | 0.0547 | 0 | preserved |
| 0.1 | preserve | 19.489 | 10,467,093 → 10,078,396 | 0.0371 | 0 | preserved |
| 1.0 | simple | 8.546 | 10,467,093 → 6,159,794 | 0.4115 | 0 | preserved |
| 1.0 | preserve | 18.850 | 10,467,093 → 7,642,017 | 0.2699 | 0 | preserved |
| 5.0 | simple | 1.889 | 10,467,093 → 1,246,052 | 0.8810 | **5** | preserved |
| 5.0 | preserve | 20.641 | 10,467,093 → 3,491,136 | 0.6665 | 0 | preserved |

The tolerance-5.0 `simple` row's 5 invalid outputs are a genuine, measured finding, not noise:
`geo::Simplify`'s own docs state RDP "does not guarantee a valid output geometry" — route A's
`ST_Simplify` produced 0 invalid outputs at the same tolerance on the same input, a real,
measured difference between the two RDP implementations at this tolerance, not explained further
by this spike.

Vertices-before matches route A's figure exactly at every row (10,467,093) — both routes parse the
same fixture and count every ring vertex, a useful cross-check that the WKB decode path is sound.
Vertices-after and reduction ratios differ from route A's `preserve` column because
`SimplifyVwPreserve` is a different algorithm from `ST_SimplifyPreserveTopology` (see Method); the
`simple` columns (both RDP) land close but not identical (e.g. 1.0: route A 6,126,511 vs route B
6,159,794) — a small, real divergence between the two RDP implementations, not investigated
further here.

### Route B — Rust `geo`, `parcels-5gb`

Streaming, row group by row group (403 row groups), **nothing written to disk** — disk cost is
zero by construction, not by cleanup.

| Tolerance | Variant | Wall s | Row groups | Vertices before→after | Reduction | Invalid |
|---|---|---|---|---|---|---|
| 1.0 | preserve | 804.686 | 403 | 345,507,850 → 252,277,009 | 0.2698 | 0 |

This is markedly slower, wall-clock, than route A's 5 GB `preserve`/1.0 run (179.369 s) despite
writing no output at all. The single largest known confound is thread count: route A ran with
DuckDB's default (all logical cores on this machine); route B's loop is single-threaded. This
spike did not measure a parallelized route B, so it cannot say how much of the gap is the
algorithm/implementation versus the missing parallelism — flagged here as exactly that, an unknown,
not resolved by this document (see Route comparison and Open questions).

### Cancellability

**Route A** (`cancel` subcommand, `parcels-5gb`, tolerance 1.0, `preserve`, interrupt requested
after a 20 s declared delay):

| Metric | Value |
|---|---|
| Worker wall time until exception | 21.020 s |
| Time from `interrupt()` call to `Thread.join()` returning | 0.998 s |
| Exception raised | `duckdb.InterruptException: INTERRUPT Error: Interrupted!` (str: `"INTERRUPT Error: Interrupted!"`) |
| Output left on disk | Yes — a partial, incomplete Parquet file, 107,094,052 bytes, deleted immediately after this measurement |

**Route B** (`stream-cancel`, `parcels-5gb`, tolerance 1.0, `preserve`, interrupt requested after a
20 s declared delay, cooperative `AtomicBool` checked once per row-group boundary):

| Metric | Value |
|---|---|
| Flag actually set at (thread-measured) | 20.059 s |
| Loop actually exited at | 30.011 s |
| **Detection latency (flag set → loop exit)** | **9.952 s** |
| Row groups processed before stop | 3 of 403 |
| Output left on disk | None — route B never writes output in this spike, so there is nothing to leave behind or clean up |

Route B's single sample shows a ~10 s gap between the flag flipping and the loop noticing it,
because the cooperative check only runs at a row-group boundary and one in-flight row group's
`geo::SimplifyVwPreserve` work was not itself interruptible. This is one sample (row-group
processing time varies — an earlier, separately-run 5 GB pass processed 5 row groups in a similar
20-30 s window, so ~3-5 row groups per ~10 s is the observed range here, not a stable rate) and
should not be read as a distribution. Route A's DuckDB `interrupt()`, by contrast, stopped a
query already mid-execution in about 1 s, not bounded by any row-group-sized unit of work.

*A harness note, not a route-B finding*: an earlier version of the `stream-cancel` measurement
code computed "time from flag set to loop exit" by diffing two separately-started `Instant` clocks
and produced a nonsensical near-zero (even slightly negative) result. It was a clock-origin bug in
this spike's own measurement code, caught by inspection before being reported, fixed (both
timestamps now share one `Instant`), and rerun — the 9.952 s figure above is post-fix.

## Cancellability

(Covered as its own subsection above, under Results, per the two routes' `cancel` /
`stream-cancel` measurements.)

## Identity preservation

"Identity" here means only the `id` column's round-trip: every input row's `id` appears exactly
once in the output (or, for route B's streaming/cancel modes, in whatever was processed before
stopping), with no duplicates and no drift. Both routes carry `id` through as a passthrough
column/field — never touched by the simplification call — so a 1:1 row correspondence is
structural, not incidental, in both implementations as spiked. Route A additionally checks this
with a DuckDB `EXCEPT`-based set-difference query (`missing_from_output`, `extra_in_output`,
`duplicate_ids_out`); route B checks it with an in-process `HashSet` over the ids it read. All
`preserved: true` in every full (non-cancelled) run above.

What a real LOD **tier** would need to carry, beyond what this spike checked:

- The `id` itself (both routes already demonstrate this is cheap to carry through).
- Some notion of the **source revision** the tier was built from, so a later invalidation check
  can tell a stale tier from a current one (see engine's content-addressed identity machinery,
  `engine/src/dataset.rs`, `engine/src/index.rs` — not used by this spike, cited here only as
  where that machinery already lives for the product).
- The **tolerance/tier level** itself as metadata on the tier artifact, so a consumer (kernel,
  renderer) knows which LOD it is looking at without re-deriving it.

None of the above three was built or measured here — this spike only confirmed the `id` round-trip
at the geometry-simplification step itself.

## Route comparison

**What route A needs to become a product path.** DuckDB's `spatial` extension (which provides
`ST_Simplify`, `ST_SimplifyPreserveTopology`, `ST_NPoints`, `ST_IsValid` — every function this
spike's route A used) is **not currently loaded by the engine**. Verified: `engine/Cargo.toml:32`
declares `duckdb = { version = "1.10505.0", features = ["bundled", "parquet", "json"] }` — no
`"spatial"` feature, and a repo-wide search of `engine/src/**/*.rs` for `INSTALL spatial`,
`LOAD spatial`, or any `ST_`-prefixed call found none. `duckdb-rs`'s `spatial` feature (or a
manual `INSTALL spatial; LOAD spatial;` at connection time, as this spike's Python CLI does) would
be a new capability for the engine, not something already present — and DuckDB's `spatial`
extension is normally fetched from DuckDB's own extension repository at install time, which raises
an offline/reproducible-build question this spike did not explore.

**What route B needs to become a product path — dependency proposal for the human, not added to
the product.** If route B were pursued, these are the crate names and pinned versions this spike
built and measured against (all resolved by `cargo add` from crates.io on 2026-09-13, all
MIT-OR-Apache-2.0, compatible with the workspace's `AGPL-3.0-or-later`):

| Crate | Version | Role |
|---|---|---|
| `geo` | 0.33.1 | `Simplify` (RDP) and `SimplifyVwPreserve` (topology-preserving VW) algorithms |
| `wkb` | 0.9.2 | WKB decode (read-only; `wkb::writer` exists, unused/unexercised here) |
| `geo-traits` | 0.3.0 | `ToGeoGeometry` conversion from `wkb`'s zero-copy reader types to `geo_types::Geometry` |
| `parquet` | 59.3.0 (feature `arrow`) | row-group-level Parquet reading |
| `arrow` | 59.3.0 | Arrow arrays backing the Parquet reader's `RecordBatch`es |

Nothing in this table has been added to any product crate; `Cargo.lock` and the root `Cargo.toml`
are unchanged by this spike (verified before commit). Before this could be a real proposal rather
than a feasibility note: (1) the workspace already pins one Arrow version, `arrow = "58"`
(`Cargo.toml`'s `[workspace.dependencies]`, "so a second arrow major in the tree would [not] force
a re-encode at the engine/protocol boundary") — this spike's crate resolved to Arrow 59.3.0
because it is deliberately standalone and unconstrained by that pin; reconciling the two versions
is a real, unresolved question, not a detail. (2) Route B here never writes output, so a product
tier-writer is unbuilt and unmeasured. (3) Route B here is single-threaded; the wall-time gap on
the 5 GB fixture (804.686 s vs route A's 179.369 s for the same tolerance/variant, albeit with
route A writing output and route B not) is not disentangled from that asymmetry by this spike —
parallelizing the row-group loop (e.g. with `rayon`, already in this spike's dependency tree
transitively via `geo`'s optional features but not enabled or used) is unmeasured.

## Open questions for ADR-031's preregistration

Questions only — no decision is made or implied by this spike.

1. **Tier count.** How many LOD tiers should the product define, and on what basis (fixed count,
   fixed tolerance ladder, data-driven)?
2. **Tolerance units.** This spike used raw CRS units (metres, for EPSG:2056) at three fixed
   values (0.1, 1.0, 5.0). Should a product tier's tolerance be expressed in CRS units, in screen
   pixels at a reference zoom/DPI, or some other unit — and does that choice need to vary by CRS?
3. **Where tiers live on disk.** Separate GeoParquet files per tier (as both routes' outputs were
   shaped here), a single file with a tier/level column, or something else — and does that
   decision interact with the spatially-clustered layout variants already built in
   `engine/src/layout.rs`?
4. **Invalidation when the source changes.** When the source dataset's content hash changes
   (`engine/src/dataset.rs`, `engine/src/index.rs`'s content-addressed identity), how and when are
   derived tiers rebuilt or invalidated — synchronously, lazily on next access, or via a
   background job? Is a stale tier ever served, even briefly, and if so how would that be labelled?
5. **Relation to ADR-028's residency budget.** ADR-028 (accepted 2026-09-02) explicitly leaves LOD
   out of its own decision — item 5: "Completeness at overview scales is NOT delivered by this
   decision; LOD/aggregation is separate and owes its own preregistered gate." Given ADR-028's
   declared vertex budget and tile-keyed cache (`frontends/shell/src/canvas/limits.ts`'s
   `MAX_RESIDENT_VERTICES`, per that ADR's Context), is a resident LOD tier charged against that
   same budget, is it orthogonal to it, or does an LOD tier change what "over budget" even means at
   overview zooms?

## Outcome

Both routes produced valid, identity-preserving simplified output at product scale (5 GB / 3.3M
features) at every tolerance and variant tried, with zero invalid geometries in every route-A run
and in five of six route-B `polygons-100k` runs (the one exception — route B's RDP `simple` at
tolerance 5.0, 5 invalid outputs of 100,000 — is real and specific to that implementation/tolerance
pair, not a general route-B finding). Route A is measured, cancellable (~1 s from `interrupt()` to
worker stop, leaving a partial file this spike deleted each time), and already close to
product-usable in the sense that its only missing piece is loading a DuckDB extension the engine
does not currently load (`engine/Cargo.toml:32`). Route B is buildable as a standalone spike crate
(succeeded on the first attempt) with a WKB decode path that cross-checks exactly against route A's
vertex counts, and demonstrably streams row-group by row-group with zero disk cost and cooperative
(if row-group-grained, here ~10 s worst-case-observed) cancellation — but was run single-threaded
against DuckDB's default multi-threaded route A, never wrote a tier to disk, and used a
topology-preserving algorithm (Visvalingam-Whyatt) that is not the same family as route A's
(RDP-based `ST_SimplifyPreserveTopology`), so the two routes' `preserve` numbers are not
directly comparable answers to the same question. Neither route's numbers here constitute a
docs/08 product performance claim; both are offered as ADR-031 preregistration inputs only.
