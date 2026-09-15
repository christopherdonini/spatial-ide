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

*Pointer (2026-09-15): the "not explained further by this spike" note on route B's 5 invalid
outputs, and the offline/reproducible-build question raised under Route comparison, are both
answered below — see "Route B divergence explained (2026-09-15, C3 step 3)" and "Route A static
bundling (2026-09-15, C3 step 1)".*

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

## Route B divergence explained (2026-09-15, C3 step 3)

Answers the ruling of 2026-09-14 (DECISIONS-PENDING question set C, item C3): *"route B's
invalid-output divergence is explained before either route is preregistered — including whether
geo's topology-preserving simplification (SimplifyVwPreserve) removes it."* Reported-only. No
number here is a perf claim; no wall time is reported at all, because this is a correctness
explanation. No dependency is proposed, added or approved by this section.

### How it was measured

Two new spike-only modes, both run against `polygons-100k` only (the 5 GB fixture was not touched):

- Route B: `lod-feasibility-spike explain --input <polygons-100k> --tolerance 5.0 --wkt-out
  results/B_100k_5.0_simple_invalid_features.txt` — scans all 100,000 features, keeps every one
  whose `geo::Simplify` output fails validation, and dumps per-feature detail + WKT.
  Results: `results/B_100k_5.0_simple_invalid_features.json` and `...txt`.
- Route A: `scripts/duckdb_explain_invalid.py --ids 37926,40320,61222,70483,74445` — runs
  `ST_Simplify` on exactly those ids at the same tolerance on the same file, **`LOAD spatial`
  only, never `INSTALL`** (offline). Results: `results/A_100k_5.0_simple_invalid_features.json`.

The 5 invalid outputs reproduced exactly: `features_scanned: 100000`, `invalid_simple_outputs: 5`,
same count as the original run.

**API note.** The brief asked for `explain_invalidity()`. `geo` 0.33.1's `Validation` trait
(`src/algorithm/validation/mod.rs:62-101`) has no such method; it exposes `is_valid()`,
`check_validation()` and `validation_errors()`. Every "reason" string below is
`validation_errors()` rendered through `InvalidPolygon`'s `Display` impl — that is this version's
human-readable reason, quoted verbatim from the tool output. DuckDB's build likewise has **no**
`ST_IsValidReason`: the probe recorded the catalog error verbatim rather than inventing a reason —
`"CatalogException: Catalog Error: Scalar Function with name st_isvalidreason does not exist!"`.

### Per-feature evidence (tolerance 5.0, `polygons-100k`)

All five inputs are **valid** by both engines (`geo`: `is_valid() == true`, zero validation errors;
DuckDB: `ST_IsValid == true`). So this is an invalid-*output* case, not an invalid-input case.
All five inputs are a Polygon with exactly one interior ring.

| id | input rings (ext, int0) | route B `simple` rings | route B `simple` valid? | route B reason (verbatim) | route B VW-preserve rings / valid | route A `ST_Simplify` npoints / ext / #int / valid | route A `ST_SimplifyPreserveTopology` npoints / valid |
|---|---|---|---|---|---|---|---|
| 37926 | 142, 47 | 11, 22 | no | `interior ring at index 0 has a self-intersection` | 34, 6 / valid | 10 / 10 / 0 / valid | 14 / valid |
| 40320 | 130, 43 | 15, 20 | no | `interior ring at index 0 has a self-intersection` | 30, 6 / valid | 14 / 14 / 0 / valid | 18 / valid |
| 61222 | 112, 37 | 14, 16 | no | `interior ring at index 0 has a self-intersection` | 40, 6 / valid | 13 / 13 / 0 / valid | 17 / valid |
| 70483 | 141, 47 | 10, 22 | no | `interior ring at index 0 has a self-intersection` | 37, 6 / valid | 10 / 10 / 0 / valid | 15 / valid |
| 74445 | 150, 50 | 7, 22 | no | `interior ring at index 0 has a self-intersection` | 40, 6 / valid | 7 / 7 / 0 / valid | 11 / valid |

All five failures are the **same** failure, in the **same** ring role: the single interior (hole)
ring self-intersects after RDP. No exterior ring in the set is invalid.

**Vertex-count comparison, route A vs route B, same feature, same tolerance** — the brief asked
which way this falls. Route A's output has **FEWER** vertices than route B's in all five cases
(10 vs 33, 14 vs 35, 13 vs 30, 10 vs 32, 7 vs 29 total). The difference decomposes exactly:

| id | B exterior | A exterior | difference | B interior0 | A interior0 |
|---|---|---|---|---|---|
| 37926 | 11 | 10 | −1 (ring start vertex) | 22 | ring absent |
| 40320 | 15 | 14 | −1 (ring start vertex) | 20 | ring absent |
| 61222 | 14 | 13 | −1 (ring start vertex) | 16 | ring absent |
| 70483 | 10 | 10 | 0 | 22 | ring absent |
| 74445 | 7 | 7 | 0 | 22 | ring absent |

So it is neither "the same RDP plus a validity fix-up" (that would keep the vertex count) nor "a
different RDP". The RDP cores agree; the **ring-level post-processing** differs. Two independent
probes pin that down:

**Probe 1 (route B, in-crate).** `geo` 0.33.1 uses two different minimum-vertex constants —
`simplify.rs:5-6`:

```rust
const LINE_STRING_INITIAL_MIN: usize = 2;
const POLYGON_INITIAL_MIN: usize = 4;
```

Re-running RDP on each ring *as a bare `LineString`* (so `INITIAL_MIN = 2` instead of 4) gives:

| id | exterior guarded → unguarded | interior0 guarded → unguarded |
|---|---|---|
| 37926 | 11 → 11 | 22 → **3** |
| 40320 | 15 → 15 | 20 → **3** |
| 61222 | 14 → 14 | 16 → **3** |
| 70483 | 10 → 10 | 22 → **3** |
| 74445 | 7 → 7 | 22 → **3** |

The exterior is untouched by the guard in every case; the hole collapses to **3 vertices** — a
degenerate ring (start, one far vertex, start) — in every case.

**Probe 2 (route A, in-DuckDB).** Simplifying the *same* hole ring on its own:

- `ST_NPoints(ST_Simplify(ST_InteriorRingN(geometry, 1), 5.0))` = **3** for all five ids, e.g. for
  id 37926 `ST_AsText` returns
  `LINESTRING (2608144.4034889988 1204780, 2608135.7382430662 1204781.851142266, 2608144.4034889988 1204780)`
  — the same two distinct vertices `geo` retains as its long chord.
- `ST_AsText(ST_Simplify(ST_MakePolygon(ST_InteriorRingN(geometry, 1)), 5.0))` = **`POLYGON EMPTY`**
  (0 points) for all five ids.

Both engines' RDP therefore reduces the hole to the identical degenerate 3-vertex chord. What they
do next is the entire divergence.

### The mechanism

**Hypothesis as stated in the brief:** *DuckDB spatial's `ST_Simplify` is GEOS's
`DouglasPeuckerSimplifier`, which by default "ensures valid topology" on polygonal output (a
post-simplification fix-up), whereas `geo::Simplify` is plain RDP ring-by-ring with no fix-up — so
the divergence is a post-processing difference, not an RDP difference.*

**Verdict: the shape of the hypothesis is confirmed — it is a post-processing difference, not an
RDP difference — but its detail is corrected in two ways, and the operative post-processing step
for these five features is not the one named.** Specifically: (a) GEOS 3.14.1 has no
`setEnsureValid` toggle; the validity guarantee is unconditional. (b) The fix-up that actually
removes these five invalidities is **degenerate-ring removal**, which happens before and
independently of the `buffer(0.0)` validity correction. Evidence, in chain order, all fetched or
locally quoted:

1. **DuckDB `ST_Simplify` is GEOS.** `src/spatial/modules/geos/geos_module.cpp:2315-2323` calls
   `geom.get_simplified(tolerance)`; `src/spatial/modules/geos/geos_geometry.hpp:483-485`:
   ```cpp
   inline GeosGeometry GeosGeometry::get_simplified(double tolerance) const {
   	return GeosGeometry(handle, GEOSSimplify_r(handle, geom, tolerance));
   }
   ```
2. **`GEOSSimplify_r` is `DouglasPeuckerSimplifier`.** GEOS 3.14.1 `capi/geos_ts_c.cpp:3538-3545`:
   ```cpp
   GEOSSimplify_r(GEOSContextHandle_t extHandle, const Geometry* g1, double tolerance)
   {
       return execute(extHandle, [&]() {
           Geometry::Ptr g3(geos::simplify::DouglasPeuckerSimplifier::simplify(g1, tolerance));
   ```
3. **The header documents an unconditional validity guarantee, and has no `setEnsureValid`.**
   `include/geos/simplify/DouglasPeuckerSimplifier.h:35-46` — the whole public API is
   `simplify`, the constructor, `setDistanceTolerance` and `getResultGeometry` (lines 51-71):
   ```
   /** \brief
    * Simplifies a Geometry using the standard Douglas-Peucker algorithm.
    *
    * Ensures that any polygonal geometries returned are valid.
    * Simple lines are not guaranteed to remain simple after simplification.
    *
    * Note that in general D-P does not preserve topology -
    * e.g. polygons can be split, collapse to lines or disappear
    * holes can be created or disappear,
    * and lines can cross.
    * To simplify geometry while preserving topology use TopologyPreservingSimplifier.
    * (However, using D-P is significantly faster).
    *
    */
   ```
   *Correction to the brief:* there is no `setEnsureValid`/`isEnsureValidTopology` member in GEOS
   3.14.1's `DouglasPeuckerSimplifier`. The brief's "by default" framing implies a toggle that this
   version does not have.
4. **The step that removes these five invalidities: a collapsed polygon ring is dropped.**
   `src/simplify/DouglasPeuckerSimplifier.cpp:120-135`:
   ```cpp
   Geometry::Ptr
   DPTransformer::transformLinearRing(
       const LinearRing* geom,
       const Geometry* parent)
   {
   ...
     	bool removeDegenerateRings = dynamic_cast<const Polygon*>(parent);
     	Geometry::Ptr simpResult( GeometryTransformer::transformLinearRing(geom, parent));
     	if (removeDegenerateRings && ! dynamic_cast<const LinearRing*>(simpResult.get()))
     		return nullptr;
     	return simpResult;
   }
   ```
   and what makes the simplified hole stop being a `LinearRing` — `src/geom/util/GeometryTransformer.cpp:194-202`:
   ```cpp
       std::size_t seqSize = seq ? seq->size() : 0;

       // ensure a valid LinearRing
       if(seqSize > 0 && seqSize < 4 && ! preserveType) {
           return factory->createLineString(std::move(seq));
       }
       else {
           return factory->createLinearRing(std::move(seq));
       }
   ```
   The measured 3-vertex hole is `< 4`, so it becomes a `LineString`, so `transformLinearRing`
   returns `nullptr`, so the hole is gone — which is exactly what
   `ST_NumInteriorRings(ST_Simplify(...)) == 0` and `POLYGON EMPTY` show above.
5. **The separate `buffer(0.0)` fix-up exists but is conditional.**
   `src/simplify/DouglasPeuckerSimplifier.cpp:99-106`:
   ```cpp
   Geometry::Ptr
   DPTransformer::createValidArea(const Geometry* roughAreaGeom)
   {
       bool isValidArea = roughAreaGeom->getDimension() == 2 && roughAreaGeom->isValid();
       if (! isValidArea)
           return Geometry::Ptr(roughAreaGeom->buffer(0.0));
       return Geometry::Ptr(roughAreaGeom->clone());
   }
   ```
   called from `transformPolygon` (lines 147-154). For these five features the rough result is
   already hole-free and valid by step 4, so this branch has nothing to correct. **Unverified:**
   this spike did not instrument GEOS, so "`buffer(0.0)` did not run for these five features" is an
   inference from the quoted control flow, not an observation.
6. **One extra, smaller GEOS/geo difference, also post-processing.** GEOS is allowed to delete a
   ring's start/end vertex; `geo`'s RDP always keeps first and last.
   `src/simplify/DouglasPeuckerSimplifier.cpp:108-118` sets
   `bool preserveRingEndpoint = parent->getGeometryTypeId() != GEOS_LINEARRING;`, and
   `src/simplify/DouglasPeuckerLineSimplifier.cpp:94-105`:
   ```cpp
       // TODO avoid copying entire sequence?
       bool simplifyRing = !preserveEndpoint && pts.isRing();
       if (simplifyRing && coordList->size() > geom::LinearRing::MINIMUM_VALID_SIZE) {
           geom::LineSegment seg(coordList->getAt(coordList->size() - 2), coordList->getAt(1));
           if (seg.distance(coordList->getAt(0)) <= distanceTolerance) {
               auto ret = detail::make_unique<CoordinateSequence>();
               ret->reserve(coordList->size() - 1);
               ret->add(*coordList, 1, coordList->size() - 2);
               ret->closeRing();
               coordList = std::move(ret);
           }
       }
   ```
   This accounts for the `−1` exterior-vertex rows in the table above (ids 37926/40320/61222); for
   70483 and 74445 the condition did not fire and the two engines' exterior vertex counts are equal.
7. **`geo`'s side: plain ring-by-ring RDP, no fix-up, plus a min-vertex guard that *creates* the
   self-intersection.** Quoted from the crate source in the local cargo registry (not fetched over
   the network), `geo-0.33.1/src/algorithm/simplify.rs`. The `Simplify` trait doc, lines 145-150:
   ```
   /// Simplifies a geometry.
   ///
   /// The [Ramer–Douglas–Peucker
   /// algorithm](https://en.wikipedia.org/wiki/Ramer–Douglas–Peucker_algorithm) simplifies a
   /// linestring. Polygons are simplified by running the RDP algorithm on all their constituent
   /// rings. This may result in invalid Polygons, and has no guarantee of preserving topology.
   ```
   The `Polygon` impl, lines 284-297, maps `rdp::<_, _, POLYGON_INITIAL_MIN>` over the exterior and
   each interior and reassembles — no validity pass anywhere. Inside `compute_rdp`, lines 82-89:
   ```rust
       let (first, last) = match rdp_indices {
           [] => return vec![],
           &[only] => return vec![only],
           &[first, last] => return vec![first, last],
           &[first, .., last] => (first, last),
       };

       let first_last_line = Line::new(first.coord, last.coord);
   ```
   For a closed ring `first == last`, so the top-level "line" is degenerate and the first split is
   simply "the vertex farthest from the ring's start vertex" — an arbitrary bisection of the ring.
   Then, lines 131-138:
   ```rust
       let number_culled = rdp_indices.len() - 2;
       let new_length = *simplified_len - number_culled;

       // If `simplified_len` is now lower than the minimum number of indices needed, then don't
       // perform the culling and return the original input.
       if new_length < INITIAL_MIN {
           return rdp_indices.to_owned();
       }
   ```
   With `INITIAL_MIN = POLYGON_INITIAL_MIN = 4` and a hole that wants to collapse to 3, the second
   half's cull is refused **wholesale** and that half's *original* vertices are returned. The result
   is one long chord straight across the hole plus the untouched original chain on the other side —
   which cross. That is the measured `SelfIntersection(Interior(0))`, and it matches the vertex
   arithmetic per feature (e.g. id 37926: 47 − 25 culled on the first half = 22 retained, exactly
   the measured `simple_ring_vertex_counts` interior value).

**Mechanism, stated plainly.** Both routes run the same Douglas–Peucker core and both reduce these
five holes to the same degenerate 3-vertex chord. GEOS then *removes* the collapsed ring
(`transformLinearRing` → `nullptr`), yielding a valid hole-free polygon; `geo` instead *refuses the
cull* because of `POLYGON_INITIAL_MIN = 4` and emits a half-simplified ring that crosses itself. The
divergence is entirely in ring-level post-processing, on both sides. **Verification status:
fetched-and-quoted** for every GEOS and duckdb-spatial claim above (URLs, dates and SHA-256 below),
**locally-quoted** for every `geo` claim (cargo-registry paths and line numbers given), with the one
explicitly labelled inference in item 5.

### Does `SimplifyVwPreserve(5.0)` remove the invalidity? — direct answer

**Yes, on all five, per feature:**

| id | `SimplifyVwPreserve(5.0)` valid? | validation errors | ring vertex counts (ext, int0) |
|---|---|---|---|
| 37926 | **yes** | none | 34, 6 |
| 40320 | **yes** | none | 30, 6 |
| 61222 | **yes** | none | 40, 6 |
| 70483 | **yes** | none | 37, 6 |
| 74445 | **yes** | none | 40, 6 |

**Guarded against, or coincidental?** The README's caveat stands — VW-preserve is a different
algorithm family (Visvalingam–Whyatt), so this is not evidence about RDP. But the removal is *not*
coincidental in the relevant sense: (i) every one of the five failures is a `SelfIntersection`, and
guarding against exactly that is `SimplifyVwPreserve`'s stated job —
`geo-0.33.1/src/algorithm/simplify_vw.rs:522`: `/// Simplifies a geometry, attempting to preserve
its topology by removing self-intersections`; and (ii) the interior ring survives at 6 vertices
(5 distinct + closing) in all five cases rather than collapsing to 3, so the collapse-then-guard
interaction that produces the RDP failure cannot arise. The honest limit: this spike observed the
outcome on 5 features and read the trait's stated intent; it did **not** audit
`SimplifyVwPreserve`'s implementation to confirm the guarantee is structural, and `geo`'s doc says
"attempting to preserve", not "guarantees". **Unverified:** that `SimplifyVwPreserve` cannot produce
an invalid Polygon on other inputs.

### Fetched sources (all retrieved 2026-09-15, read-only, SHA-256 of the fetched bytes)

`duckdb-spatial` at the exact commit the loaded extension reports (`extension_version = 'eb1e57c'`;
full sha `eb1e57c9d92c0f3f76eb03eaa52c315090f328cc`, commit date 2026-07-10, resolved via
`https://api.github.com/repos/duckdb/duckdb-spatial/commits/eb1e57c`). GEOS at `3.14.1`, the version
duckdb-spatial's own vcpkg overlay port pins (see the next section).

| URL | bytes | SHA-256 |
|---|---|---|
| `https://raw.githubusercontent.com/duckdb/duckdb-spatial/eb1e57c9d92c0f3f76eb03eaa52c315090f328cc/src/spatial/modules/geos/geos_module.cpp` | 128,715 | `df3a43bc244cd895b6597a578d3d1daef09ff0da777f397f24c4401308afcbd3` |
| `https://raw.githubusercontent.com/duckdb/duckdb-spatial/eb1e57c9d92c0f3f76eb03eaa52c315090f328cc/src/spatial/modules/geos/geos_geometry.hpp` | 20,783 | `0cbe7b94277c297507fc7138c1f7ff9dfe5d77559bfcbb31aa928ea44f03acda` |
| `https://raw.githubusercontent.com/duckdb/duckdb-spatial/eb1e57c9d92c0f3f76eb03eaa52c315090f328cc/src/spatial/modules/main/spatial_functions_scalar.cpp` | 369,095 | `465572741a3d2de7a16c2dc0f929dffe01e5a45446755038100c51fd8433dc64` |
| `https://raw.githubusercontent.com/duckdb/duckdb-spatial/eb1e57c9d92c0f3f76eb03eaa52c315090f328cc/CMakeLists.txt` | 3,551 | `e8f6922036fa2eda9b18d0f712ad30ed203590cf82a924061240fc205fe8c02e` |
| `https://raw.githubusercontent.com/duckdb/duckdb-spatial/eb1e57c9d92c0f3f76eb03eaa52c315090f328cc/vcpkg.json` | 967 | `fb0b9cfc3120bf8ae1b45ba3796a191a46224ce0b68a3f77bfa09f3f9f296164` |
| `https://raw.githubusercontent.com/duckdb/duckdb-spatial/eb1e57c9d92c0f3f76eb03eaa52c315090f328cc/vcpkg_ports/geos/vcpkg.json` | 313 | `fd761b1421d779225284553777f0a3e4e2f9d82de87944381135f335d2a6e1b2` |
| `https://raw.githubusercontent.com/duckdb/duckdb-spatial/eb1e57c9d92c0f3f76eb03eaa52c315090f328cc/vcpkg_ports/gdal/vcpkg.json` | 1,209 | `79ffc44fc001da4e2b7ef668e56403e1ecc193f8f7080b0371509aa1bb21cf63` |
| `https://raw.githubusercontent.com/duckdb/duckdb-spatial/eb1e57c9d92c0f3f76eb03eaa52c315090f328cc/vcpkg_ports/proj/vcpkg.json` | 1,020 | `59d151befb0bbee24d0270fa77cbbf42e5735a031e3be575d257a27c1d849aa7` |
| `https://raw.githubusercontent.com/duckdb/duckdb-spatial/eb1e57c9d92c0f3f76eb03eaa52c315090f328cc/vcpkg_ports/sqlite3/vcpkg.json` | 2,081 | `ce33e92dd7378ecb75948b29472d124551fe92d581164419e120f8cc248d31cd` |
| `https://raw.githubusercontent.com/libgeos/geos/3.14.1/include/geos/simplify/DouglasPeuckerSimplifier.h` | 2,230 | `442d2fe517d4f9120cd7fcbed0358a5302b7898246b09b9a3f5ea2b9d9943bd7` |
| `https://raw.githubusercontent.com/libgeos/geos/3.14.1/src/simplify/DouglasPeuckerSimplifier.cpp` | 5,806 | `a7705e3a0cfab1347e6c185954bee72641a82cd6635ec4345ba6839b87be1be2` |
| `https://raw.githubusercontent.com/libgeos/geos/3.14.1/src/simplify/DouglasPeuckerLineSimplifier.cpp` | 3,824 | `6d8506c32c967a5b429148ac4d635a490704775847a085bb3a6a1337d279b563` |
| `https://raw.githubusercontent.com/libgeos/geos/3.14.1/src/geom/util/GeometryTransformer.cpp` | 11,369 | `dd63478d0bd077cc4dedaa717be750cf3c467baead897194e5fac4019a9cd434` |
| `https://raw.githubusercontent.com/libgeos/geos/3.14.1/capi/geos_ts_c.cpp` | 153,317 | `2a94dd81cad69f0535636e35d17dbfeefcb78b959c8721f0743e7b91afce1d2b` |

Locally-quoted (not fetched; cargo registry copies on this machine, quoted with file paths and line
numbers above): `C:\Users\Christopher\.cargo\registry\src\index.crates.io-1949cf8c6b5b557f\geo-0.33.1\src\algorithm\simplify.rs`,
`...\geo-0.33.1\src\algorithm\simplify_vw.rs`, `...\geo-0.33.1\src\algorithm\validation\mod.rs`,
`...\geo-0.33.1\src\algorithm\validation\polygon.rs`.

**Unverified statements in this section, listed:** (a) that GEOS's `buffer(0.0)` path did not
execute for these five features (inferred from the quoted control flow, not instrumented);
(b) that the extension binary in `~/.duckdb/extensions/v1.5.5/windows_amd64/` was in fact built
from commit `eb1e57c9d92...` and linked against GEOS 3.14.1 — this rests on the extension's own
reported `extension_version` and on that commit's vcpkg port pin, not on inspecting the binary;
(c) that `SimplifyVwPreserve` cannot produce an invalid Polygon on inputs outside these five.

## Route A static bundling (2026-09-15, C3 step 1)

Answers the ruling of 2026-09-14 (question set C, item C3): *"Route A is admissible only if DuckDB's
spatial extension can be statically bundled with no runtime fetch — the ADR-021 security property."*
This section reports facts only. **Applying them to admissibility is the human's ruling, not this
document's.** ADR-021's Consequences section — the "Security property (human-directed record)"
bullet in `docs/adr/ADR-021-row-filter-on-viewport-query.md` — is the property's source; nothing
here amends it, and no dependency is proposed or approved.

### 1. The crate offers no `spatial` feature, and its bundled build enumerates a closed set

`C:\Users\Christopher\.cargo\registry\src\index.crates.io-1949cf8c6b5b557f\libduckdb-sys-1.10505.0\Cargo.toml`,
`[features]` table verbatim, lines 44-76:

```toml
44	[features]
45	autocomplete = ["bundled-cmake"]
46	buildtime_bindgen = [
47	    "bindgen",
48	    "pkg-config",
49	    "vcpkg",
50	]
51	bundled = ["cc"]
52	bundled-cmake = [
53	    "bundled",
54	    "dep:cmake",
55	    "dep:which",
56	    "parquet",
57	]
58	default = [
59	    "vcpkg",
60	    "pkg-config",
61	]
62	extensions-full = [
63	    "json",
64	    "parquet",
65	]
66	icu = ["bundled-cmake"]
67	json = ["bundled"]
68	loadable-extension = [
69	    "prettyplease",
70	    "quote",
71	    "syn",
72	]
73	parquet = ["bundled"]
74	tpcds = ["bundled-cmake"]
75	tpch = ["bundled-cmake"]
76	winduckdb = []
```

No `spatial`. The facade crate `duckdb-1.10505.0\Cargo.toml` `[features]` (lines 56-126) likewise
has no `spatial`; its extension-bearing entries are `json = ["libduckdb-sys/json", "bundled"]`
(79-82), `parquet = ["libduckdb-sys/parquet", "bundled"]` (97-100), `icu` (75-78), `tpcds`
(106-109), `tpch` (110-113), and `extensions-full = ["json", "parquet", "vtab-full"]` (70-74).

**How the bundled build enumerates extensions.** Two backends, both hard-coded.
`libduckdb-sys-1.10505.0\build_bundled_cc.rs:37-43`:

```rust
fn extension_enabled(extension: &str) -> bool {
    // Review build_bundled_cmake::enabled_extensions when changing this gate;
    // the backend mechanisms and supported extension sets intentionally differ.
    extension == "core_functions"
        || (extension == "parquet" && cfg!(feature = "parquet"))
        || (extension == "json" && cfg!(feature = "json"))
}
```

and `build_bundled_cmake.rs:444-466`:

```rust
fn enabled_extensions() -> Vec<&'static str> {
    // Match DuckDB's upstream CMake defaults for quasi-core extensions rather
    // than trying to reproduce the cc backend's finer-grained selection.
    // Review build_bundled_cc::extension_enabled when changing this list; the
    // backend mechanisms and supported extension sets intentionally differ.
    let mut extensions = vec!["parquet"];
    if cfg!(feature = "json") {
        extensions.push("json");
    }
    if cfg!(feature = "autocomplete") {
        extensions.push("autocomplete");
    }
    if cfg!(feature = "icu") {
        extensions.push("icu");
    }
    if cfg!(feature = "tpcds") {
        extensions.push("tpcds");
    }
    if cfg!(feature = "tpch") {
        extensions.push("tpch");
    }
    extensions
}
```

The selected names become link-time definitions — `build_bundled_cc.rs:89-95` emits
`DUCKDB_EXTENSION_{NAME}_LINKED`, and `build_bundled_cmake.rs:103-106` passes
`config.define("BUILD_EXTENSIONS", enabled_extensions.join(";"))`. **The out-of-tree escape hatch is
explicitly refused** — `build_bundled_cmake.rs:46-52`:

```rust
    if let Some(configs) = env_var("DUCKDB_EXTENSION_CONFIGS") {
        if !configs.trim().is_empty() {
            panic!(
                "DUCKDB_EXTENSION_CONFIGS is not yet supported by bundled-cmake because additional static extension libraries are not auto-linked"
            );
        }
    }
```

Two further lines are worth recording against ADR-021's property, because they are the *opposite*
default — `build_bundled_cc.rs:96-97`:

```rust
    cfg.define("DUCKDB_EXTENSION_AUTOINSTALL_DEFAULT", "1");
    cfg.define("DUCKDB_EXTENSION_AUTOLOAD_DEFAULT", "1");
```

i.e. the `bundled` (cc) build compiles DuckDB with extension autoinstall and autoload enabled by
default. (The cmake backend exposes a `DISABLE_EXTENSION_LOAD` env flag, `build_bundled_cmake.rs:93-94`.)

**Vendored source archive: no spatial code at all.** The crate directory contains
`duckdb.tar.gz` (6,117,462 bytes) alongside `build.rs`, `build_bundled_cc.rs`,
`build_bundled_cmake.rs`, `Cargo.toml`, `Cargo.lock`, `LICENSE`, `README.md`, `src/`, `wrapper.h`,
`wrapper_ext.h`, `update_sources.py`, `upgrade.sh`. Scanning every one of its 3,596 regular file
members — `scripts/scan_bundled_duckdb_sources.py`, streaming and read-only, never extracted to
disk; full output in `results/libduckdb_sys_vendored_spatial_scan.json`:

- file paths containing `spatial` (case-insensitive): **0**
- members containing the bytes `ST_Simplify`: **0**; `spatial_extension`: **0**;
  `SpatialExtension`: **0**; `GEOSSimplify`: **0**; `ST_NPoints`: **0**
- the archive's `manifest.json` `extensions` keys: **`['core_functions', 'json', 'parquet']`**

As expected — duckdb-spatial is an out-of-tree repository, so the crate's vendored DuckDB source
cannot contain it.

**Fact, not a verdict:** `duckdb-rs` 1.10505.0 as published offers no way to statically link the
spatial extension; the feature does not exist, the vendored source does not contain it, and the
`DUCKDB_EXTENSION_CONFIGS` path that would point a bundled build at an out-of-tree extension panics.

### 2. What static bundling would therefore require

A custom build of the out-of-tree `duckdb/duckdb-spatial` repository against the same DuckDB
version, with its third-party dependencies linked statically, plus a linking path into the Rust
build that `libduckdb-sys` does not currently provide.

Which libraries that pulls in, from the fetched top-level manifests (URLs/hashes in the previous
section's table). `vcpkg.json` `dependencies` verbatim: `vcpkg-cmake`, `openssl`, `zlib`, `geos`,
`expat`, `sqlite3` (feature `rtree`, no default features), `proj` (`version>=` `9.1.1`), `curl`
(non-wasm/ios/android), `gdal` (`version>=` `3.8.5`, features `network`, `geos`). `CMakeLists.txt`
lines 47-84 show how they are linked:

```cmake
add_library(${EXTENSION_NAME} STATIC ${EXTENSION_SOURCES})

# annoyingly for expat on windows
set(CMAKE_FIND_LIBRARY_SUFFIXES ${CMAKE_FIND_LIBRARY_SUFFIXES} MD.lib)
set(ZLIB_USE_STATIC_LIBS ON)
set(OPENSSL_USE_STATIC_LIBS ON)
find_package(ZLIB REQUIRED)
find_package(PROJ CONFIG REQUIRED)
find_package(GDAL CONFIG REQUIRED)
find_package(EXPAT REQUIRED)
find_package(unofficial-sqlite3 CONFIG REQUIRED)

# Important: The link order matters, its the reverse order of dependency
set(EXTENSION_DEPENDENCIES GDAL::GDAL PROJ::proj EXPAT::EXPAT
                           unofficial::sqlite3::sqlite3 ZLIB::ZLIB)

if(SPATIAL_USE_GEOS)
  message(STATUS "Building with GEOS functionality")
  find_package(GEOS REQUIRED)
  set(EXTENSION_DEPENDENCIES ${EXTENSION_DEPENDENCIES} GEOS::geos_c)
  add_definitions(-DSPATIAL_USE_GEOS=1)
endif()
```

with `option(SPATIAL_USE_GEOS "Enable GEOS support" ON)` and
`option(SPATIAL_USE_NETWORK "Enable network functionality" ON)` at lines 30-33, and network mode
appending `CURL::libcurl OpenSSL::SSL OpenSSL::Crypto`. Three more are vendored in-tree and built
from the repo's own subdirectories (`CMakeLists.txt` lines 38-46): `src/third_party/yyjson`,
`src/third_party/protozero`, `src/third_party/shapelib`.

So the transitive set a static route-A build would have to carry is at least: **GDAL, PROJ, GEOS,
EXPAT, SQLite3, zlib, OpenSSL, libcurl** (the last two only if `SPATIAL_USE_NETWORK` stays ON),
plus vendored **yyjson, protozero, shapelib** — and GDAL's and PROJ's own transitive ports
(`vcpkg_ports/gdal/vcpkg.json` lists `json-c`, `libgeotiff`, `proj`, `tiff`, `zlib` among others).

**Licences — only those actually fetched are stated.** From duckdb-spatial's own overlay port
manifests at the pinned commit:

| Library | version in the fetched manifest | `license` field, verbatim | Source |
|---|---|---|---|
| GEOS | `3.14.1` | `"LGPL-2.1-only"` | `vcpkg_ports/geos/vcpkg.json` |
| PROJ | `9.1.1` | `"MIT"` | `vcpkg_ports/proj/vcpkg.json` |
| SQLite3 | `3.49.1` | `"blessing"` | `vcpkg_ports/sqlite3/vcpkg.json` |
| GDAL | `3.8.5` (`version-semver`) | `null` — the manifest states no licence | `vcpkg_ports/gdal/vcpkg.json` |

**Licences not verified here** for: zlib, OpenSSL, libcurl, EXPAT, yyjson, protozero, shapelib,
json-c, libgeotiff, tiff — these come from upstream vcpkg ports or in-tree vendored copies that this
spike did not fetch. GDAL's licence is likewise not verified here (its overlay manifest carries
`"license": null`). The duckdb-spatial repository's own `LICENSE` file was not fetched either.

**Unverified in this subsection:** that such a custom static build actually succeeds on this
platform, and what link-time work would be needed to join it to `libduckdb-sys` — no build was
attempted. Also unverified: whether some newer or unpublished `duckdb-rs` offers a spatial feature;
only the pinned 1.10505.0 registry copy on this machine was read.

### 3. The runtime-fetch fact, for route A as this spike actually ran it

`scripts/duckdb_simplify.py`'s `_connect()` (line 30) issues `INSTALL spatial; LOAD spatial;` — an
install, i.e. a repository fetch on any machine where the extension is not already cached. The
extension present on this machine is a repository install. Query and output verbatim, from the
pinned venv (`target/corpus-venv/Scripts/python.exe`, duckdb 1.5.5, engine `v1.5.5`):

```sql
SELECT extension_name, loaded, installed, install_path, extension_version, install_mode
FROM duckdb_extensions() WHERE extension_name='spatial'
```

```
('spatial', True, True, 'C:\\Users\\Christopher\\.duckdb\\extensions\\v1.5.5\\windows_amd64\\spatial.duckdb_extension', 'eb1e57c', 'REPOSITORY')
```

`install_mode = 'REPOSITORY'` — not `STATICALLY_LINKED`. This spike's new route-A script
(`scripts/duckdb_explain_invalid.py`) deliberately issues `LOAD spatial` only and never `INSTALL`,
and it ran successfully offline against that cached copy; that demonstrates only that an
already-installed extension loads without a fetch, not that it could be acquired without one.
