# K1 — scan progress, upstream check (Round 1)

Researcher: Claude (advisor session), 2026-10-08. Clone: `~/spatial-ide-archaeology/candidates/duckdb-rs` at `b907911` (2026-10-07), full blob-less history.

## Spatial IDE facts relied on

- The question: `decision-adr-029-scan-progress-route` (PLAN.yaml:1441 @ 4561f3b8) — routes 1 (raw ffi end to end), 2 (crate patch adding an accessor), 3 (upstream). Human, 2026-09-18: "defer -- ADR-029 stays Proposed, G1's facts recorded, the route returns with Brief B's B2".
- G1's facts: `spikes/adr-029-g1-scan-progress/README.md` — `duckdb_query_progress` gives a u64 `rows_processed` on the `read_parquet` path; `duckdb::Connection` exposes no raw handle; DuckDB latches only `percentage`, so the count must be latched engine-side; `total_rows_to_process` is an estimate (100,002 for 100,000 rows), which ADR-029 1(c) forbids forwarding.
- Vendored crate: `duckdb = "1.10505.0"` (engine/Cargo.toml).

## Findings (verified in the clone)

1. **The latest published classic crate adds nothing.** `duckdb` 1.10506.0 (crates.io, 2026-09-30; tag `v1.10506.0`, "Update DuckDB to v1.5.6") — `git grep -i "query_progress\|fn progress" v1.10506.0 -- crates/duckdb/src` returns nothing. `crates/duckdb/src` on main also has no progress accessor (`rg -i progress crates/duckdb/src` empty).
2. **Upstream has built the accessor — in a different, unpublished crate.** `crates/duckdb-neo` ("Ergonomic wrapper for DuckDB's v2 C API (experimental)", `crates/duckdb-neo/Cargo.toml`) carries `QueryProgressTracker` and `QueryProgress` (`crates/duckdb-neo/src/query_progress.rs:17-75`), added in `72e9084` "CAPI-V2-P2 Initial implementation (#861)", 2026-09-24, updated `0d42a28` (#878), 2026-09-30.
   - Shape: `QueryProgressTracker::new(&mut Connection)` sets `enable_progress_bar_print=false` and `enable_progress_bar=true` at local scope, keeps an `Arc<InnerConnection>`, and `snapshot()` can be called from another thread while the connection runs a query (`:11-35`).
   - It reads `ffi::duckdb_v2_connection_progress_get` (bound in `crates/libduckdb-sys/src/bindgen_bundled_version_v2.rs:2482`) and returns `percentage`, `rows_processed` and `total_rows`, documented as "The estimated total number of rows to process" (`:40-47`). It returns `None` when percentage < 0 or both counts are 0 (`:66-68`).
   - It does **not** latch: each snapshot is a raw read. G1's latch requirement still stands for any engine that carries it, and its `total_rows` is the same estimate ADR-029 1(c) refuses.
   - Not on crates.io: `https://crates.io/api/v1/crates/duckdb-neo` returns no crate (checked 2026-10-08). The workspace version on main is `1.20000.0` (`Cargo.toml:11`), i.e. the line after the 1.105xx series the engine vendors.
3. **Licence:** MIT for the whole workspace (`Cargo.toml:18`; `LICENSE`, "Copyright 2021-2026 Stichting DuckDB Foundation"). Green in the AGPL core; a port of the accessor shape keeps the MIT notice.
4. History: `git log -i --grep=progress` on main shows no other progress work in the classic crate. Issue and PR pages could not be read (github.com search is disallowed to this environment's fetcher), so an open PR against the classic crate is **not ruled out**.

## What this means for the pending ruling

- Route 3 ("upstream") is no longer hypothetical, but upstream chose to put progress in the v2-API wrapper, not in `duckdb::Connection`. Taking it means moving the engine's scan path onto an experimental, unpublished crate on a newer DuckDB line — a much larger change than the accessor itself. Treat it as **WATCH**.
- Route 2 (a patch adding an accessor to the classic crate) now has an upstream-authored design to copy: a tracker that clones the connection's inner handle and is read from another thread. **PORT** the shape, MIT notice kept.
- Neither changes G1's two constraints: the engine latches the count, and the estimated total is not forwarded.

Reuse mode: duckdb-neo `query_progress.rs` — **PORT** (shape only) for route 2; **WATCH** the crate's publication for route 3. Avoided work: small. Timing: before B2's preregistration carries the question back.


## Errata from the independent check (2026-10-08)

- VERIFICATION-A row 11: `crates/duckdb-neo/src/query_progress.rs` was first added in `1a2c45f` (2026-09-11); `72e9084` (2026-09-24) reworked it. Everything else confirmed.
