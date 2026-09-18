//! ADR-029 gate G1 (feasibility, first and blocking) probe.
//!
//! Question this binary answers, and nothing else: does a monotone scan-progress reading exist on
//! the `read_parquet` path, reachable through the vendored `duckdb` crate (1.10505.0) as pinned in
//! the workspace `Cargo.lock`? No product code, no dependency, no wire change, no benchmark, no
//! duration is produced by this crate -- see `spikes/adr-029-g1-scan-progress/README.md` for the
//! written conclusion, which is the deliverable.
//!
//! Reachability finding this binary depends on (recorded in the README in full, with file:line
//! citations into the vendored crate, and into the bundled C++ DuckDB it compiles): the *only*
//! progress-*reading* C API surface anywhere in the vendored `libduckdb-sys` bindings is
//! `duckdb_query_progress` / `duckdb_query_progress_type` -- no separate `progress_bar` C function
//! exists, and the high-level `duckdb` crate wraps none of it. `duckdb_pending_prepared`/
//! `duckdb_pending_execute_task` (the C API's own incremental-query, "task" stepping primitive --
//! what the brief called "PendingQuery, task-progress") also exists in the bindings and is
//! unwrapped by the `duckdb` crate; this probe uses it not as a second progress *reading*, but as a
//! deterministic **driver** for the scan so that `duckdb_query_progress` can be sampled once per
//! completed task on the calling thread, synchronously -- this removes this probe's *own* poll-vs-
//! wall-clock race, but the reading's underlying population is still load-dependent (see the
//! README's (c) and (b) sections): `duckdb_query_progress` reads
//! `conn->context->GetQueryProgress()` (`duckdb-c.cpp:130-131`) -- **one `ClientContext` per
//! connection**, so this only works because this probe polls the *same* raw connection it drives
//! the scan on. `duckdb::Connection` never exposes that raw `duckdb_connection` handle (its holder,
//! `InnerConnection`, lives in a private module with no accessor) -- so a *second*, separately-
//! opened raw connection could never observe a scan the crate's `Connection` is running: this is
//! why the README's Conclusion draws a line between "the reading exists on `read_parquet`" and "the
//! reading is reachable from the engine's *current* `Connection`-based scan path", and states only
//! the first as cleared. This probe does not use `duckdb::Connection` at all -- it drives the raw
//! `duckdb::ffi` C API directly (`duckdb_open`/`duckdb_connect`/`duckdb_prepare`/
//! `duckdb_pending_prepared`/`duckdb_pending_execute_task`/`duckdb_query_progress`), which the
//! crate re-exports (`duckdb-1.10505.0/src/lib.rs:58`, `pub use libduckdb_sys as ffi;`) and is
//! therefore reachable by a probe that manages its own connection end to end, at the cost of
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

/// The load-bearing check, over exactly the samples given (no slicing here -- callers choose what
/// window to check; see [`verdict`]). Vacuously `true` for a sequence that never leaves
/// `rows_processed == 0` (review B4): callers must report `max rows_processed reached` alongside
/// this, never this alone, as the evidence that the sequence actually moved.
fn rows_monotone_non_decreasing(samples: &[Sample]) -> bool {
    samples.windows(2).all(|w| w[0].rows_processed <= w[1].rows_processed)
}

fn percentage_monotone_non_decreasing(samples: &[Sample]) -> bool {
    samples.windows(2).all(|w| w[0].percentage <= w[1].percentage)
}

/// A sample carrying no reading at all -- DuckDB's own idle/unavailable shape
/// (`percentage=-1, rows_processed=0, total_rows_to_process=0`) or the transitional shape observed
/// after a query finishes but before this probe's own bookkeeping catches up (a stale `percentage`
/// beside a reset `rows_processed`/`total_rows_to_process`, both `0`) -- named by ADR-029 3(c)'s
/// own vocabulary, "absent", not folded into "zero progress".
fn is_reset(s: &Sample) -> bool {
    s.rows_processed == 0 && s.total_rows_to_process == 0
}

/// Splits `samples` at the **last** sample with `rows_processed > 0` (not merely the last sample of
/// the vector): everything up to and including it is the "active window" monotonicity is checked
/// over; everything after it is "post-active" and reported separately, however many samples that
/// is -- one (the deliberate post-completion sample every driver appends) or several (review B3:
/// one observed config-B run reset to the sentinel *before* this probe's own `done` flag caught up,
/// putting more than one reset sample inside what a naive "drop the last sample" rule would have
/// still called the running phase). `None` in the first field means the reading never populated a
/// nonzero `rows_processed` in this run at all -- itself a finding (see the README's (b)/(c)
/// sections on load-dependent population), not an error.
fn verdict(samples: &[Sample]) -> Verdict {
    match samples.iter().rposition(|s| s.rows_processed > 0) {
        None => Verdict {
            active_len: 0,
            rows_mono: true,
            pct_mono: true,
            max_rows: 0,
            never_populated: true,
            post_active_all_reset: samples.iter().all(is_reset),
            post_active_len: samples.len(),
        },
        Some(last_active) => {
            let active = &samples[..=last_active];
            let post = &samples[last_active + 1..];
            Verdict {
                active_len: active.len(),
                rows_mono: rows_monotone_non_decreasing(active),
                pct_mono: percentage_monotone_non_decreasing(active),
                max_rows: active.iter().map(|s| s.rows_processed).max().unwrap_or(0),
                never_populated: false,
                post_active_all_reset: post.iter().all(is_reset),
                post_active_len: post.len(),
            }
        }
    }
}

struct Verdict {
    active_len: usize,
    rows_mono: bool,
    pct_mono: bool,
    max_rows: u64,
    never_populated: bool,
    post_active_all_reset: bool,
    post_active_len: usize,
}

fn print_verdict(label: &str, v: &Verdict) {
    if v.never_populated {
        println!(
            "  {label}: rows_processed never left 0 in any of this run's samples -- the reading did \
             not populate (load-dependent; see README (b)/(c))."
        );
        return;
    }
    println!(
        "  {label}: over {} active-window samples -- rows_processed monotone non-decreasing = \
         {}, percentage monotone non-decreasing = {}, max rows_processed reached = {} \
         (the load-bearing figure -- monotonicity alone is vacuous at 0), {} post-active sample(s), \
         all reset to the unavailable sentinel = {}",
        v.active_len, v.rows_mono, v.pct_mono, v.max_rows, v.post_active_len, v.post_active_all_reset
    );
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

    // Configuration A: defaults, no progress-bar pragma touched. Every sample below is taken
    // *while the query runs* (the poll loop starts once the query thread is spawned, `main.rs`'s
    // own `while !done_ref.load(...)` -- there is no "before it starts" phase in this loop); the
    // -1/0/0 sentinel on every one of them is because `enable_progress_bar` was never set, and
    // DuckDB only allocates a `ProgressBar` (client_context.cpp:567, `if (config.enable_progress_bar)`)
    // -- and so only ever populates `query_progress` (:653-656) -- when it is.
    match run_one(&no_autoload, Duration::from_micros(500)) {
        Ok(samples) => {
            print_samples("config A: defaults (no progress-bar pragma)", &samples);
            print_deduped_samples("config A: defaults (no progress-bar pragma)", &samples);
        }
        Err(e) => println!("--- config A: defaults (no progress-bar pragma) FAILED: {e} ---"),
    }

    // Configuration B: progress bar enabled, zero wait threshold, default thread count.
    // `enable_progress_bar_print=false` suppresses only the printed ASCII bar/ETA text
    // (`config.print_progress_bar`, checked at client_context.cpp:568, gates the *display*
    // callback only) -- `query_progress` itself is still populated by `enable_progress_bar=true`
    // alone, unconditionally on that display setting.
    // `enable_progress_bar_print=false` set *before* `enable_progress_bar=true`: setting it after
    // left one incidental print -- `default_create_func`/`print_progress_bar` defaults to enabled,
    // so the setup statement that ran between `enable_progress_bar=true` and this one (`SET
    // progress_bar_time=0;` itself, a trivial single-statement query) got its own instant
    // `ProgressBar`, printed once before the print-disable statement that followed it took effect.
    let setup_b = [
        "SET autoinstall_known_extensions=false;",
        "SET autoload_known_extensions=false;",
        "SET enable_progress_bar_print=false;",
        "SET enable_progress_bar=true;",
        "SET progress_bar_time=0;",
    ];
    match run_one(&setup_b, Duration::from_micros(500)) {
        Ok(samples) => {
            print_samples("config B: enable_progress_bar, progress_bar_time=0", &samples);
            print_deduped_samples("config B: enable_progress_bar, progress_bar_time=0", &samples);
            print_verdict("config B", &verdict(&samples));
        }
        Err(e) => println!("--- config B FAILED: {e} ---"),
    }

    // Configuration C: the deterministic pending-task driver (`run_one_pending_task`), same
    // progress-bar pragmas as B, default thread count. This is the gate's primary evidence: run at
    // least three times, per the gate's own evidence requirement. Sampling `duckdb_query_progress`
    // between `duckdb_pending_execute_task` calls removes *this probe's own* poll-vs-wall-clock
    // race -- it does not mean the reading's population is guaranteed; see `verdict`'s
    // `never_populated` arm.
    let setup_c = [
        "SET autoinstall_known_extensions=false;",
        "SET autoload_known_extensions=false;",
        "SET enable_progress_bar_print=false;",
        "SET enable_progress_bar=true;",
        "SET progress_bar_time=0;",
    ];
    for run_idx in 1..=3 {
        match run_one_pending_task(&setup_c) {
            Ok(samples) => {
                let label = format!("config C run {run_idx}: pending-task driver");
                print_samples(&label, &samples);
                print_deduped_samples(&label, &samples);
                print_verdict(&format!("run {run_idx}"), &verdict(&samples));
            }
            Err(e) => println!("--- config C run {run_idx} FAILED: {e} ---"),
        }
    }
}
