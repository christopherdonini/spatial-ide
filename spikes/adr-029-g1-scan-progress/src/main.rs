//! ADR-029 gate G1 (feasibility, first and blocking) probe.
//!
//! Question this binary answers, and nothing else: does a monotone scan-progress reading exist on
//! the `read_parquet` path, reachable through the vendored `duckdb` crate (1.10505.0) as pinned in
//! the workspace `Cargo.lock`? No product code, no dependency, no wire change, no benchmark, no
//! duration is produced by this crate -- see `spikes/adr-029-g1-scan-progress/README.md` for the
//! written conclusion, which is the deliverable.
//!
//! Reachability finding this binary depends on (recorded in the README in full, with file:line
//! citations into the vendored crate): the *only* progress-*reading* C API surface anywhere in the
//! vendored `libduckdb-sys` bindings is `duckdb_query_progress` / `duckdb_query_progress_type` --
//! no separate `progress_bar` C function exists, and the high-level `duckdb` crate wraps none of
//! it. `duckdb_pending_prepared`/`duckdb_pending_execute_task` (the C API's own incremental-query,
//! "task" stepping primitive -- what the brief called "PendingQuery, task-progress") also exists
//! in the bindings and is unwrapped by the `duckdb` crate; this probe uses it not as a second
//! progress *reading*, but as a deterministic **driver** for the scan so that
//! `duckdb_query_progress` can be sampled once per completed task on the calling thread, with no
//! wall-clock race against a background thread. `duckdb::Connection` never exposes the raw
//! `duckdb_connection` handle either interface requires (its holder, `InnerConnection`, lives in a
//! private module with no accessor). So this probe does not use `duckdb::Connection` at all -- it
//! drives the raw `duckdb::ffi` C API directly (`duckdb_open`/`duckdb_connect`/`duckdb_prepare`/
//! `duckdb_pending_prepared`/`duckdb_pending_execute_task`/`duckdb_query_progress`), which the
//! crate re-exports (`duckdb-1.10505.0/src/lib.rs:58`, `pub use libduckdb_sys as ffi;`) and is
//! therefore reachable by product code without patching or forking the crate, at the cost of
//! writing the connection- and statement-management code `Connection`/`Statement` would otherwise
//! supply.

use duckdb::ffi;
use std::ffi::{CStr, CString};
use std::mem;
use std::path::Path;
use std::ptr;
use std::sync::atomic::{AtomicBool, Ordering};
use std::time::Duration;

/// Same absolute path as `engine/tests/common/mod.rs:20`'s `POLYGONS_100K` -- the shared,
/// primary-checkout fixture location (not per-worktree), so this probe reads the exact bytes the
/// engine's own LOD test suites already regenerate and depend on.
const POLYGONS_100K: &str = r"C:\dev\spatial-ide\target\fixtures\slice-budgets\polygons-100k.parquet";

/// Wraps the raw connection pointer so it can be shared with the polling loop while a query runs
/// on it from another thread -- exactly the usage `duckdb_query_progress`'s own doc comment
/// describes ("Get the progress of the running query"; the connection is busy inside
/// `duckdb_query` on a different thread while this is called). Raw pointers are neither `Send` nor
/// `Sync` by default; this asserts DuckDB's own documented contract, not a property Rust checks.
struct RawConn(ffi::duckdb_connection);
unsafe impl Send for RawConn {}
unsafe impl Sync for RawConn {}

#[derive(Debug, Clone, Copy)]
struct Sample {
    percentage: f64,
    rows_processed: u64,
    total_rows_to_process: u64,
}

fn exec(con: ffi::duckdb_connection, sql: &str) -> Result<(), String> {
    unsafe {
        let c_sql = CString::new(sql).expect("sql has no interior NUL");
        let mut result: ffi::duckdb_result = mem::zeroed();
        let state = ffi::duckdb_query(con, c_sql.as_ptr(), &mut result);
        let out = if state == ffi::DuckDBSuccess {
            Ok(())
        } else {
            let msg_ptr = ffi::duckdb_result_error(&mut result);
            let msg = if msg_ptr.is_null() {
                "<no error message>".to_string()
            } else {
                CStr::from_ptr(msg_ptr).to_string_lossy().into_owned()
            };
            Err(msg)
        };
        ffi::duckdb_destroy_result(&mut result);
        out
    }
}

/// Runs one `read_parquet` scan (`SELECT sum(id) FROM read_parquet(<fixture>)` -- see the query
/// string built below for why `id`, not `geometry`) on its own fresh in-memory database +
/// connection, applying `setup_sql` first, and polls `duckdb_query_progress` on the same
/// connection from the calling thread while the scan runs on a spawned thread. Returns the raw
/// sample sequence in poll order, plus one final sample taken immediately after the query thread
/// reports done.
fn run_one(setup_sql: &[&str], poll_interval: Duration) -> Result<Vec<Sample>, String> {
    unsafe {
        let mut db: ffi::duckdb_database = ptr::null_mut();
        if ffi::duckdb_open(ptr::null(), &mut db) != ffi::DuckDBSuccess {
            return Err("duckdb_open failed".into());
        }
        let mut con: ffi::duckdb_connection = ptr::null_mut();
        if ffi::duckdb_connect(db, &mut con) != ffi::DuckDBSuccess {
            ffi::duckdb_close(&mut db);
            return Err("duckdb_connect failed".into());
        }

        for sql in setup_sql {
            if let Err(msg) = exec(con, sql) {
                ffi::duckdb_disconnect(&mut con);
                ffi::duckdb_close(&mut db);
                return Err(format!("setup statement {sql:?} failed: {msg}"));
            }
        }

        let raw = RawConn(con);
        let done = AtomicBool::new(false);
        let query_error: std::sync::Mutex<Option<String>> = std::sync::Mutex::new(None);

        // `sum(id)` rather than touching `geometry`: this fixture's `geometry` column carries
        // GeoParquet `geo` key-value metadata, and `read_parquet` auto-detects it and binds the
        // column to a `GEOMETRY(<projjson CRS>)` type -- a real finding, but an orthogonal one to
        // G1's own question, and pulling on it further would risk depending on whatever made that
        // type resolve (an extension autoload is DuckDB's bundled-build default per
        // `spikes/lod-feasibility/README.md`'s "Route A static bundling" section). Summing `id`
        // (UBIGINT, untouched by GeoParquet typing) still forces a real per-row scan of
        // `read_parquet`'s output -- unlike a bare `count(*)`, which Parquet row-group metadata can
        // answer without reading any row.
        let query_sql = format!(
            "SELECT sum(id) FROM read_parquet('{}')",
            POLYGONS_100K.replace('\'', "''")
        );

        let samples = std::thread::scope(|scope| {
            let raw_ref = &raw;
            let done_ref = &done;
            let error_ref = &query_error;
            let sql_owned = query_sql.clone();
            scope.spawn(move || {
                let c_sql = CString::new(sql_owned).unwrap();
                let mut result: ffi::duckdb_result = mem::zeroed();
                let state = ffi::duckdb_query(raw_ref.0, c_sql.as_ptr(), &mut result);
                if state != ffi::DuckDBSuccess {
                    let msg_ptr = ffi::duckdb_result_error(&mut result);
                    let msg = if msg_ptr.is_null() {
                        "<no error message>".to_string()
                    } else {
                        CStr::from_ptr(msg_ptr).to_string_lossy().into_owned()
                    };
                    *error_ref.lock().unwrap() = Some(msg);
                }
                ffi::duckdb_destroy_result(&mut result);
                done_ref.store(true, Ordering::SeqCst);
            });

            let mut samples = Vec::new();
            while !done_ref.load(Ordering::SeqCst) {
                let p = ffi::duckdb_query_progress(raw_ref.0);
                samples.push(Sample {
                    percentage: p.percentage,
                    rows_processed: p.rows_processed,
                    total_rows_to_process: p.total_rows_to_process,
                });
                std::thread::sleep(poll_interval);
            }
            // One more sample immediately after `done` is observed: the last in-loop sample may
            // have been taken just before completion and this catches the terminal reading.
            let p_final = ffi::duckdb_query_progress(raw_ref.0);
            samples.push(Sample {
                percentage: p_final.percentage,
                rows_processed: p_final.rows_processed,
                total_rows_to_process: p_final.total_rows_to_process,
            });
            samples
        });

        ffi::duckdb_disconnect(&mut con);
        ffi::duckdb_close(&mut db);

        if let Some(msg) = query_error.into_inner().unwrap() {
            return Err(format!("scan query failed: {msg}"));
        }
        Ok(samples)
    }
}

/// Runs the same `read_parquet` scan as [`run_one`], but drives it through
/// `duckdb_prepare` -> `duckdb_pending_prepared` -> repeated `duckdb_pending_execute_task`
/// instead of a single blocking `duckdb_query` polled from a second thread. Each call to
/// `duckdb_pending_execute_task` performs one bounded unit of work and returns; this samples
/// `duckdb_query_progress` on the *same* connection *between* task calls, synchronously, on one
/// thread -- no race against wall-clock timing the way [`run_one`]'s background-thread polling
/// loop has (see the README's "(b) The raw sample sequence" section for why this is the gate's
/// primary evidence and [`run_one`]'s samples are kept only as supplementary corroboration).
fn run_one_pending_task(setup_sql: &[&str]) -> Result<Vec<Sample>, String> {
    unsafe {
        let mut db: ffi::duckdb_database = ptr::null_mut();
        if ffi::duckdb_open(ptr::null(), &mut db) != ffi::DuckDBSuccess {
            return Err("duckdb_open failed".into());
        }
        let mut con: ffi::duckdb_connection = ptr::null_mut();
        if ffi::duckdb_connect(db, &mut con) != ffi::DuckDBSuccess {
            ffi::duckdb_close(&mut db);
            return Err("duckdb_connect failed".into());
        }

        for sql in setup_sql {
            if let Err(msg) = exec(con, sql) {
                ffi::duckdb_disconnect(&mut con);
                ffi::duckdb_close(&mut db);
                return Err(format!("setup statement {sql:?} failed: {msg}"));
            }
        }

        let query_sql = format!(
            "SELECT sum(id) FROM read_parquet('{}')",
            POLYGONS_100K.replace('\'', "''")
        );
        let c_sql = CString::new(query_sql).unwrap();

        let mut stmt: ffi::duckdb_prepared_statement = ptr::null_mut();
        if ffi::duckdb_prepare(con, c_sql.as_ptr(), &mut stmt) != ffi::DuckDBSuccess {
            let msg_ptr = ffi::duckdb_prepare_error(stmt);
            let msg = if msg_ptr.is_null() {
                "<no error message>".to_string()
            } else {
                CStr::from_ptr(msg_ptr).to_string_lossy().into_owned()
            };
            ffi::duckdb_destroy_prepare(&mut stmt);
            ffi::duckdb_disconnect(&mut con);
            ffi::duckdb_close(&mut db);
            return Err(format!("duckdb_prepare failed: {msg}"));
        }

        let mut pending: ffi::duckdb_pending_result = ptr::null_mut();
        if ffi::duckdb_pending_prepared(stmt, &mut pending) != ffi::DuckDBSuccess {
            let msg_ptr = ffi::duckdb_pending_error(pending);
            let msg = if msg_ptr.is_null() {
                "<no error message>".to_string()
            } else {
                CStr::from_ptr(msg_ptr).to_string_lossy().into_owned()
            };
            ffi::duckdb_destroy_pending(&mut pending);
            ffi::duckdb_destroy_prepare(&mut stmt);
            ffi::duckdb_disconnect(&mut con);
            ffi::duckdb_close(&mut db);
            return Err(format!("duckdb_pending_prepared failed: {msg}"));
        }

        let mut samples = Vec::new();
        let mut task_err: Option<String> = None;
        loop {
            let p = ffi::duckdb_query_progress(con);
            samples.push(Sample {
                percentage: p.percentage,
                rows_processed: p.rows_processed,
                total_rows_to_process: p.total_rows_to_process,
            });

            let task_state = ffi::duckdb_pending_execute_task(pending);
            if task_state == ffi::duckdb_pending_state_DUCKDB_PENDING_ERROR {
                let msg_ptr = ffi::duckdb_pending_error(pending);
                task_err = Some(if msg_ptr.is_null() {
                    "<no error message>".to_string()
                } else {
                    CStr::from_ptr(msg_ptr).to_string_lossy().into_owned()
                });
                break;
            }
            if ffi::duckdb_pending_execution_is_finished(task_state) {
                break;
            }
        }
        let p_final = ffi::duckdb_query_progress(con);
        samples.push(Sample {
            percentage: p_final.percentage,
            rows_processed: p_final.rows_processed,
            total_rows_to_process: p_final.total_rows_to_process,
        });

        let mut result: ffi::duckdb_result = mem::zeroed();
        let exec_err = if task_err.is_none() {
            let exec_state = ffi::duckdb_execute_pending(pending, &mut result);
            if exec_state != ffi::DuckDBSuccess {
                let msg_ptr = ffi::duckdb_result_error(&mut result);
                Some(if msg_ptr.is_null() {
                    "<no error message>".to_string()
                } else {
                    CStr::from_ptr(msg_ptr).to_string_lossy().into_owned()
                })
            } else {
                None
            }
        } else {
            None
        };
        ffi::duckdb_destroy_result(&mut result);
        ffi::duckdb_destroy_pending(&mut pending);
        ffi::duckdb_destroy_prepare(&mut stmt);
        ffi::duckdb_disconnect(&mut con);
        ffi::duckdb_close(&mut db);

        if let Some(msg) = task_err {
            return Err(format!("duckdb_pending_execute_task failed: {msg}"));
        }
        if let Some(msg) = exec_err {
            return Err(format!("duckdb_execute_pending failed: {msg}"));
        }
        Ok(samples)
    }
}

fn print_samples(label: &str, samples: &[Sample]) {
    println!("--- {label} ({} samples) ---", samples.len());
    for (i, s) in samples.iter().enumerate() {
        println!(
            "  [{i}] percentage={:.6} rows_processed={} total_rows_to_process={}",
            s.percentage, s.rows_processed, s.total_rows_to_process
        );
    }
}

/// Prints the same sequence [`print_samples`] does, collapsed: consecutive samples with identical
/// `(percentage, rows_processed, total_rows_to_process)` are merged into one row carrying a repeat
/// count. Fine task granularity means most adjacent samples repeat the same reading (see the
/// README); this is the compact, still-complete-in-order view quoted there. `print_samples`'s full,
/// uncollapsed output is the one written to `results/*.txt` and is what this is checked against.
fn print_deduped_samples(label: &str, samples: &[Sample]) {
    println!("--- {label}, deduplicated ---");
    let mut i = 0;
    let mut row = 0;
    while i < samples.len() {
        let s = samples[i];
        let mut j = i + 1;
        while j < samples.len()
            && samples[j].percentage == s.percentage
            && samples[j].rows_processed == s.rows_processed
            && samples[j].total_rows_to_process == s.total_rows_to_process
        {
            j += 1;
        }
        println!(
            "  ({row}) percentage={:.6} rows_processed={} total_rows_to_process={} x{}",
            s.percentage,
            s.rows_processed,
            s.total_rows_to_process,
            j - i
        );
        row += 1;
        i = j;
    }
}

fn rows_monotone_non_decreasing(samples: &[Sample]) -> bool {
    samples.windows(2).all(|w| w[0].rows_processed <= w[1].rows_processed)
}

fn percentage_monotone_non_decreasing(samples: &[Sample]) -> bool {
    samples.windows(2).all(|w| w[0].percentage <= w[1].percentage)
}

fn main() {
    if !Path::new(POLYGONS_100K).is_file() {
        eprintln!(
            "fixture missing at {POLYGONS_100K}\n\
             Regenerate it via the engine's own LOD test suites, which call \
             `engine/tests/common/mod.rs`'s `polygons_100k()` on first use, e.g.:\n\
             \n  cargo test -p spatial-engine --test lod_tier_builder --features fixture\n\
             \nrun from the primary checkout (not this worktree) so the shared path is written."
        );
        std::process::exit(1);
    }

    println!("ADR-029 G1 probe -- duckdb 1.10505.0, fixture: {POLYGONS_100K}");

    // Every configuration below disables extension autoinstall/autoload first -- a defensive
    // no-network-fetch guard for this probe specifically (unrelated to G1's own question), since
    // `spikes/lod-feasibility/README.md`'s "Route A static bundling" section already found this
    // bundled build compiles with both defaulted ON (`DUCKDB_EXTENSION_AUTOINSTALL_DEFAULT`,
    // `DUCKDB_EXTENSION_AUTOLOAD_DEFAULT`, `libduckdb-sys-1.10505.0/build_bundled_cc.rs:96-97`).
    let no_autoload = ["SET autoinstall_known_extensions=false;", "SET autoload_known_extensions=false;"];

    // Configuration A: defaults, no progress-bar pragma touched.
    match run_one(&no_autoload, Duration::from_micros(500)) {
        Ok(samples) => {
            print_samples("config A: defaults (no progress-bar pragma)", &samples);
            print_deduped_samples("config A: defaults (no progress-bar pragma)", &samples);
        }
        Err(e) => println!("--- config A: defaults (no progress-bar pragma) FAILED: {e} ---"),
    }

    // Configuration B: progress bar enabled, zero wait threshold, default thread count.
    let setup_b = [
        "SET autoinstall_known_extensions=false;",
        "SET autoload_known_extensions=false;",
        "SET enable_progress_bar=true;",
        "SET progress_bar_time=0;",
    ];
    match run_one(&setup_b, Duration::from_micros(500)) {
        Ok(samples) => {
            print_samples("config B: enable_progress_bar, progress_bar_time=0", &samples);
            print_deduped_samples("config B: enable_progress_bar, progress_bar_time=0", &samples);
        }
        Err(e) => println!("--- config B FAILED: {e} ---"),
    }

    // Configuration C: the deterministic pending-task driver (`run_one_pending_task`), same
    // progress-bar pragmas as B, default thread count. This is the gate's primary evidence: run at
    // least three times, per the gate's own evidence requirement, and does not depend on OS
    // page-cache warmth or wall-clock poll timing the way `run_one`'s background-thread race does.
    let setup_c = [
        "SET autoinstall_known_extensions=false;",
        "SET autoload_known_extensions=false;",
        "SET enable_progress_bar=true;",
        "SET progress_bar_time=0;",
    ];
    for run_idx in 1..=3 {
        match run_one_pending_task(&setup_c) {
            Ok(samples) => {
                let label = format!("config C run {run_idx}: pending-task driver");
                print_samples(&label, &samples);
                print_deduped_samples(&label, &samples);
                // The last element is the deliberate post-completion sample taken after
                // `duckdb_pending_execution_is_finished` -- the connection is idle again by then,
                // and its own reading resets to the same sentinel (-1 / 0 / 0, or 0 / 0 / 0) as an
                // untouched connection, which is a real, separate, and expected reset, not a
                // monotonicity violation of the *running* sequence. Monotonicity is checked only
                // over the running-phase samples, `samples[..len-1]`; the reset is reported next.
                let running = &samples[..samples.len().saturating_sub(1)];
                let mono_rows = rows_monotone_non_decreasing(running);
                let mono_pct = percentage_monotone_non_decreasing(running);
                let reset_after_completion = samples.last().is_some_and(|s| s.rows_processed == 0);
                println!(
                    "  run {run_idx}: over {} running-phase samples -- rows_processed monotone \
                     non-decreasing = {mono_rows}, percentage monotone non-decreasing = {mono_pct}, \
                     max rows_processed reached = {}, resets to 0 after completion = {reset_after_completion}",
                    running.len(),
                    running.iter().map(|s| s.rows_processed).max().unwrap_or(0)
                );
            }
            Err(e) => println!("--- config C run {run_idx} FAILED: {e} ---"),
        }
    }
}
