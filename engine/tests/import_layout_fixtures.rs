// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! Phase 2 of the import-layout cut — `kernel/IMPORT-LAYOUT-PREREGISTRATION.md` §4's 145 MB
//! matrix: `{C raster, H hilbert, R shuffled} × {8192, 4096, 2048} rows/group`, nine files, **one
//! writer** (DuckDB `COPY` — finding 6 of the `first-batch` cut: mixing writers moves first-batch
//! time by ~40%, more than layout does, and would be attributed to order by mistake).
//!
//! **This is fixture-writing, not measurement.** `NEXT-CUT.md` scores read volume and total query
//! time in its own later phases (kernel/, not here) — nothing in this file is a gate cell and
//! nothing here is `unmeasured` or admissible against the gate. What runs here is:
//!
//! 1. The nine-file matrix, through [`spatial_engine::layout::write_clustered_variant`], which
//!    performs its own F3 written-row-group verification and refuses a mismatch (`layout.rs`'s
//!    `rewrite` — unchanged by this file, and unconditional on `order`).
//! 2. Prediction 2's 145 MB half (`kernel/IMPORT-LAYOUT-PREREGISTRATION.md` §5): two *additional*
//!    rewrites, `H` written from `C`'s 8192-granularity output and `H` written from `R`'s, and a
//!    comparison of the two results — the thing that licenses the single 5 GB Hilbert rewrite later.
//!
//! ## Source
//!
//! **The same 100k-feature Polygons-class generator `kernel/tests/first_batch_factorial.rs::spec_s`
//! uses — not a new shape.** Its parameters are restated here (that harness's constants are
//! private to it), and if `target/slice-evidence/first-batch/parcels-145mb.parquet` is already on
//! disk with the exact hash that generator is known to produce, it is reused **read-only** rather
//! than rewritten — this phase's own writes stay inside `target/slice-evidence/import-layout/`.
//! Absent or mismatched, a fresh copy is generated there instead; the shared `SplitMix64` seed
//! makes that copy byte-identical to the known-good file **by construction**, so which branch runs
//! changes nothing about what gets rewritten.
//!
//! ## `#[ignore]`d, like every generation pass in this family
//!
//! It writes roughly 1.5 GB across eleven files and is not part of the ordinary `cargo test`. Run
//! explicitly, piped to a log rather than left to an interactive terminal:
//!
//! ```text
//! cargo test --release --features fixture -p spatial-engine --test import_layout_fixtures -- \
//!   --ignored --exact generate_the_145mb_fixture_matrix --nocapture
//! ```

use std::path::{Path, PathBuf};
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;
use std::time::{Duration, Instant};

use spatial_engine::fixture::{write_geoparquet, FixtureSpec, LicenseMode};
use spatial_engine::layout::{write_clustered_variant, ClusterOrder, DeclaredExtent, VariantSpec};
use spatial_engine::CancelToken;

// ---- the generator, restated from `kernel/tests/first_batch_factorial.rs`'s `spec_s()` --------
//
// "find it; do not invent a new shape" — these are that function's own constants, copied rather
// than imported because that harness's constants are private to its own crate (`kernel`, not
// `engine`) and this file has no dependency on it.

const FEATURES: usize = 100_000;
const AVG_VERTICES: usize = 100;
const HOLE_EVERY: usize = 7;
const SEED: u64 = 0x5EED_2056_0000_0007;
const CHUNK: usize = 8_192;
/// The **source's own** row-group size, used only if this phase has to regenerate the source. Not
/// to be confused with the three rewrite granularities the matrix sweeps — this value is fixed.
const SOURCE_ROW_GROUP_ROWS: usize = 8_192;
/// The generator's grid pitch, restated from `fixture::parcel`'s private local for the identical
/// reason `first_batch_factorial.rs` restates it.
const CELL_M: f64 = 40.0;

/// The shipped granularity — the value `kernel/tests/first_batch_factorial.rs` used for both the
/// 145 MB and the 5 GB rewrites, and the one prediction 2 is asserted at.
const SHIPPED_GRANULARITY: usize = 8_192;
const GRANULARITIES: [usize; 3] = [8_192, 4_096, 2_048];

const REWRITE_CEILING: Duration = Duration::from_secs(900); // preregistration §7

/// The known-good hash of `target/slice-evidence/first-batch/parcels-145mb.parquet`, recorded in
/// `kernel/RESULTS.md` (`fe61e704fcc01d40…`) and independently re-verified against the file on disk
/// before this phase was written. A defensive check, not an assumption: if the file present under
/// that path is not this exact one, it is not reused.
const FIRST_BATCH_S_SHA256: &str =
    "fe61e704fcc01d40b0e453d81a4987fc23862dcc38d62bd1f9635d124433ac7a";

fn evidence_dir() -> PathBuf {
    let d = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .parent()
        .unwrap()
        .join("target/slice-evidence/import-layout");
    std::fs::create_dir_all(&d).unwrap();
    d
}

fn first_batch_s_path() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .parent()
        .unwrap()
        .join("target/slice-evidence/first-batch/parcels-145mb.parquet")
}

fn spec_s() -> FixtureSpec {
    FixtureSpec {
        features: FEATURES,
        avg_vertices: AVG_VERTICES,
        hole_every: HOLE_EVERY,
        seed: SEED,
        chunk: CHUNK,
        row_group_rows: SOURCE_ROW_GROUP_ROWS,
        license: LicenseMode::DeclaredBySource,
        ..Default::default()
    }
}

/// The declared extent — the generator's own grid arithmetic, never a measured bbox (`layout.rs`'s
/// own [`DeclaredExtent`] doc: a measured extent would make the ordering depend on the last
/// vertex's jitter).
fn source_extent() -> DeclaredExtent {
    let cols = (FEATURES as f64).sqrt().ceil();
    DeclaredExtent {
        xmin: spatial_engine::fixture::E_LO,
        ymin: spatial_engine::fixture::N_LO,
        xmax: spatial_engine::fixture::E_LO + cols * CELL_M,
        ymax: spatial_engine::fixture::N_LO + cols * CELL_M,
    }
}

// ---- small standalone helpers — this phase's own copies, on the standing precedent
// `kernel/tests/support::file_facts`'s own doc records ("a *new* harness reaching for the identical
// logic a third time is exactly the drift this module's own header warns about" applies to *that*
// module growing a third copy; a `kernel`-crate helper is not reachable from an `engine` integration
// test at all, so this is the first copy this crate has, not a second) ------------------------------

fn free_bytes_on_c() -> Option<u64> {
    let out = std::process::Command::new("powershell")
        .args(["-NoProfile", "-Command", "(Get-PSDrive C).Free"])
        .output()
        .ok()?;
    String::from_utf8_lossy(&out.stdout).trim().parse().ok()
}

/// The same 40 GiB floor this cut's preflight (`CUT-STATE.md` phase 0) declared.
const MIN_FREE_BYTES: u64 = 40 * 1024 * 1024 * 1024;

fn require_disk(phase: &str) -> u64 {
    let free = free_bytes_on_c().unwrap_or(0);
    assert!(
        free >= MIN_FREE_BYTES,
        "phase `{phase}` refuses to start: {:.1} GiB free, declared floor {} GiB. Recorded as an \
         invalidator, not worked around.",
        free as f64 / (1u64 << 30) as f64,
        MIN_FREE_BYTES >> 30
    );
    free
}

fn file_facts(p: &Path) -> (u64, String) {
    let Ok(md) = std::fs::metadata(p) else { return (0, "absent".into()) };
    let hash = spatial_engine::index::content_hash(p, &CancelToken::new())
        .map(|(h, _)| h)
        .unwrap_or_else(|_| "unreadable".into());
    (md.len(), hash)
}

/// `id`, in the physical order `read_parquet` returns with no `ORDER BY` at all (DuckDB's
/// `preserve_insertion_order`, on by default, is what makes this file order rather than whatever a
/// parallel scan's scheduling happened to produce) — the row-order digest prediction 2's fallback
/// clause names.
fn ids_in_file_order(path: &Path) -> Vec<u64> {
    let conn = duckdb::Connection::open_in_memory().expect("conn");
    let mut stmt = conn.prepare("SELECT id FROM read_parquet(?)").expect("prepare");
    let mut rows = stmt.query([path.to_str().unwrap()]).expect("query");
    let mut out = Vec::new();
    while let Some(r) = rows.next().expect("row") {
        out.push(r.get::<_, u64>(0).expect("id"));
    }
    out
}

/// Row groups read back from the file's own footer — [`spatial_engine::layout::row_group_row_counts`]
/// on a fresh connection, for the case a matrix cell is already on disk from an earlier run of this
/// same phase and was not rewritten (so `LayoutFacts` is not available to read it from).
fn row_groups_of(path: &Path) -> u64 {
    let conn = duckdb::Connection::open_in_memory().expect("conn");
    let path_sql = path.to_str().unwrap().replace('\'', "''");
    spatial_engine::layout::row_group_row_counts(&conn, &path_sql).expect("row groups").len() as u64
}

/// A minimal rewrite watchdog: fires the declared cancel token if `ceiling` is exceeded, so a
/// rewrite that would run past it is interrupted rather than left to run indefinitely. Mirrors
/// `kernel/tests/support::Watchdog`'s shape (that module is private to the `kernel` crate and not
/// reachable from here); simplified to the one ceiling this phase declares (§7's 900 s rewrite
/// bound) — there is no silence sub-ceiling here because a rewrite is one blocking call, not a
/// series of progress-reporting steps.
struct RewriteWatchdog {
    stop: Arc<AtomicBool>,
    fired: Arc<AtomicBool>,
    handle: Option<std::thread::JoinHandle<()>>,
}

impl RewriteWatchdog {
    fn start(ceiling: Duration, cancel: CancelToken) -> Self {
        let stop = Arc::new(AtomicBool::new(false));
        let fired = Arc::new(AtomicBool::new(false));
        let (s, f) = (stop.clone(), fired.clone());
        let started = Instant::now();
        let handle = std::thread::spawn(move || loop {
            if s.load(Ordering::Relaxed) {
                return;
            }
            std::thread::sleep(Duration::from_millis(250));
            if started.elapsed() > ceiling {
                eprintln!(
                    "[watchdog] a rewrite exceeded its declared {ceiling:?} ceiling after {:.1} s \
                     — firing the cancel token. This attempt is recorded as failed and is NOT \
                     retried inside this run (preregistration §7).",
                    started.elapsed().as_secs_f64()
                );
                f.store(true, Ordering::SeqCst);
                cancel.cancel();
                return;
            }
        });
        Self { stop, fired, handle: Some(handle) }
    }

    fn finish(mut self) -> bool {
        self.stop.store(true, Ordering::Relaxed);
        if let Some(h) = self.handle.take() {
            let _ = h.join();
        }
        self.fired.load(Ordering::SeqCst)
    }
}

// ---- the driver ---------------------------------------------------------------------------------

#[test]
#[ignore = "writes ~1.5 GB of 145 MB-class fixtures; run explicitly with --release, --features fixture"]
fn generate_the_145mb_fixture_matrix() {
    assert!(
        !cfg!(debug_assertions),
        "this phase writes fixtures other phases hash and time; a debug build's numbers (even the \
         elapsed-time-only ones reported here) are not measurements. Run with --release."
    );

    let dir = evidence_dir();
    let mut log = String::new();
    macro_rules! say {
        ($($a:tt)*) => {{ let s = format!($($a)*); println!("{s}"); log.push_str(&s); log.push('\n'); }};
    }

    let free_before = require_disk("import-layout-fixtures-start");
    say!("free disk before: {:.2} GiB ({free_before} B)", free_before as f64 / (1u64 << 30) as f64);

    // ---- the source, reused read-only if it is exactly the file this generator would produce ---
    let first_batch_s = first_batch_s_path();
    let src_path = if first_batch_s.exists() {
        let (bytes, hash) = file_facts(&first_batch_s);
        if hash == FIRST_BATCH_S_SHA256 {
            say!(
                "source: reusing `first-batch`'s S fixture read-only — {bytes} B, sha256 {hash} \
                 (verified against the known-good hash)"
            );
            first_batch_s
        } else {
            say!(
                "source: `first-batch`'s S fixture is present but its hash is {hash}, not the \
                 known-good {FIRST_BATCH_S_SHA256} — regenerating under this phase's own directory \
                 instead of trusting it"
            );
            let p = dir.join("parcels-145mb-source.parquet");
            let facts = write_geoparquet(&p, &spec_s()).expect("generate source");
            say!("generated source: {} features, {} bytes", facts.features, facts.bytes);
            p
        }
    } else {
        say!("source: `first-batch`'s S fixture is absent; generating one under this phase's own directory");
        let p = dir.join("parcels-145mb-source.parquet");
        let facts = write_geoparquet(&p, &spec_s()).expect("generate source");
        say!("generated source: {} features, {} bytes", facts.features, facts.bytes);
        p
    };
    let (src_bytes, src_hash) = file_facts(&src_path);
    say!("source S — {src_bytes} B, sha256 {src_hash}");

    let extent = source_extent();

    // ---- the nine-file matrix: {C, H, R} x {8192, 4096, 2048} ------------------------------------
    struct Written {
        order: ClusterOrder,
        granularity: usize,
        path: PathBuf,
        bytes: u64,
        sha256: String,
        row_groups: u64,
    }
    let mut written: Vec<Written> = Vec::new();
    let mut attempts_failed = 0u32;

    for &granularity in &GRANULARITIES {
        for &order in &[ClusterOrder::SourceIdentity, ClusterOrder::Hilbert16, ClusterOrder::Shuffled]
        {
            let dst = dir.join(format!(
                "parcels-145mb-duckdb-{}-g{}.parquet",
                order.as_str(),
                granularity
            ));
            if dst.exists() {
                let (bytes, sha256) = file_facts(&dst);
                let row_groups = row_groups_of(&dst);
                say!(
                    "{} @ {granularity}: already present, not rewritten — {bytes} B, {row_groups} \
                     row groups, sha256 {sha256}",
                    order.as_str()
                );
                written.push(Written { order, granularity, path: dst, bytes, sha256, row_groups });
                continue;
            }
            require_disk("import-layout-rewrite");
            let cancel = CancelToken::new();
            let dog = RewriteWatchdog::start(REWRITE_CEILING, cancel.clone());
            let spec =
                VariantSpec { order, extent, row_group_rows: granularity, id_column: "id".into() };
            let started = Instant::now();
            let result = write_clustered_variant(&src_path, &dst, &spec, &cancel);
            let elapsed = started.elapsed();
            let fired = dog.finish();

            match result {
                Ok(facts) if !fired && elapsed <= REWRITE_CEILING => {
                    let (bytes, sha256) = file_facts(&dst);
                    say!(
                        "wrote {} @ {granularity}: {} features, {} bytes, {} row groups, {} \
                         clamped, {:.0} ms, sha256 {}",
                        order.as_str(),
                        facts.features,
                        facts.bytes,
                        facts.row_groups,
                        facts.clamped_features,
                        elapsed.as_secs_f64() * 1000.0,
                        sha256
                    );
                    assert_eq!(bytes, facts.bytes, "reported bytes and stat'd bytes disagree");
                    written.push(Written {
                        order,
                        granularity,
                        path: dst,
                        bytes,
                        sha256,
                        row_groups: facts.row_groups,
                    });
                }
                Ok(_) => {
                    // The rewrite returned `Ok` but the watchdog fired or the elapsed time is over
                    // the declared ceiling anyway (a race between the interrupt and the final
                    // write) — its numbers are not clean, and per §7 this attempt is not re-run.
                    attempts_failed += 1;
                    say!(
                        "UNMEASURED — {} @ {granularity}: watchdog at {:?} (fired={fired}), not \
                         retried within this run",
                        order.as_str(),
                        REWRITE_CEILING
                    );
                }
                Err(e) => {
                    // A `write_clustered_variant` refusal — F3 (row-group-size mismatch) or any
                    // other typed error — stops the phase. It is recorded and this run does not
                    // work around it, per this phase's own scope and the preregistration's
                    // unattended rule. (`attempts_failed` is not incremented here: the `panic!`
                    // below ends the test before anything would read it.)
                    say!("REFUSED — {} @ {granularity}: {e}", order.as_str());
                    std::fs::write(dir.join("import-layout-fixtures.log"), &log).ok();
                    panic!(
                        "rewrite {} @ {granularity} refused or failed: {e}. A refusal stops this \
                         phase rather than being worked around (F3).",
                        order.as_str()
                    );
                }
            }
        }
    }
    assert_eq!(written.len(), 9, "expected exactly the nine-file matrix, got {}", written.len());

    // ---- prediction 2's 145 MB half: H-from-C and H-from-R -------------------------------------
    //
    // `kernel/IMPORT-LAYOUT-PREREGISTRATION.md` §5, prediction 2: "H-from-R and H-from-C have
    // identical row order — asserted at 145 MB by digest and file comparison; licenses the single
    // 5 GB Hilbert rewrite." At the shipped granularity (8192, the value `first_batch_factorial.rs`
    // used for both its 145 MB and 5 GB rewrites).
    let c = written
        .iter()
        .find(|w| w.order == ClusterOrder::SourceIdentity && w.granularity == SHIPPED_GRANULARITY)
        .expect("C at the shipped granularity is one of the nine files");
    let r = written
        .iter()
        .find(|w| w.order == ClusterOrder::Shuffled && w.granularity == SHIPPED_GRANULARITY)
        .expect("R at the shipped granularity is one of the nine files");

    let h_from_c_path = dir.join("parcels-145mb-duckdb-hilbert16-from-raster-g8192.parquet");
    let h_from_r_path = dir.join("parcels-145mb-duckdb-hilbert16-from-shuffled-g8192.parquet");

    for (src, dst, label) in
        [(&c.path, &h_from_c_path, "H-from-C"), (&r.path, &h_from_r_path, "H-from-R")]
    {
        if dst.exists() {
            say!("{label} already present; not rewritten");
            continue;
        }
        require_disk("import-layout-prediction-2-rewrite");
        let cancel = CancelToken::new();
        let dog = RewriteWatchdog::start(REWRITE_CEILING, cancel.clone());
        let spec = VariantSpec {
            order: ClusterOrder::Hilbert16,
            extent,
            row_group_rows: SHIPPED_GRANULARITY,
            id_column: "id".into(),
        };
        let started = Instant::now();
        let result = write_clustered_variant(src, dst, &spec, &cancel);
        let elapsed = started.elapsed();
        let fired = dog.finish();
        match result {
            Ok(facts) if !fired && elapsed <= REWRITE_CEILING => {
                let (bytes, sha256) = file_facts(dst);
                say!(
                    "wrote {label}: {} features, {} bytes, {:.0} ms, sha256 {}",
                    facts.features,
                    bytes,
                    elapsed.as_secs_f64() * 1000.0,
                    sha256
                );
            }
            Ok(_) => {
                std::fs::write(dir.join("import-layout-fixtures.log"), &log).ok();
                panic!("{label}: watchdog at {REWRITE_CEILING:?} (fired={fired}), not retried");
            }
            Err(e) => {
                std::fs::write(dir.join("import-layout-fixtures.log"), &log).ok();
                panic!("{label} rewrite refused or failed: {e}");
            }
        }
    }

    let (hc_bytes, hc_hash) = file_facts(&h_from_c_path);
    let (hr_bytes, hr_hash) = file_facts(&h_from_r_path);
    say!("H-from-C — {hc_bytes} B, sha256 {hc_hash}");
    say!("H-from-R — {hr_bytes} B, sha256 {hr_hash}");

    if hc_bytes == hr_bytes && hc_hash == hr_hash {
        say!(
            "PREDICTION 2 (145 MB half): CONFIRMED, by file comparison — H-from-C and H-from-R are \
             byte-identical ({hc_bytes} B, sha256 {hc_hash})"
        );
    } else {
        // The files differ in bytes. Falling back to the row-order digest the preregistration's own
        // wording names, in case the difference is writer-embedded metadata rather than row order —
        // stated as a method, not assumed.
        say!(
            "files differ (H-from-C {hc_bytes} B / sha256 {hc_hash} vs H-from-R {hr_bytes} B / \
             sha256 {hr_hash}) — falling back to a row-order digest over the two files' `id` \
             sequences, since `(hilbert_key, id)` being a total order independent of input is a \
             claim about row order, and a byte difference could in principle come from something \
             the writer embeds per run (e.g. a footer timestamp) rather than from the rows"
        );
        let order_c = ids_in_file_order(&h_from_c_path);
        let order_r = ids_in_file_order(&h_from_r_path);
        assert_eq!(order_c.len(), order_r.len(), "H-from-C and H-from-R do not even have the same row count");
        if order_c == order_r {
            say!(
                "PREDICTION 2 (145 MB half): CONFIRMED, by row-order digest only — the `id` \
                 sequence read back from both files is identical across all {} rows, so the byte \
                 difference above is writer-embedded metadata, not row order",
                order_c.len()
            );
        } else {
            let first_diff = order_c.iter().zip(order_r.iter()).position(|(a, b)| a != b);
            say!(
                "PREDICTION 2 (145 MB half): FAILED — H-from-C and H-from-R diverge in row order \
                 at index {first_diff:?}; `(hilbert_key, id)` is not independent of input order as \
                 predicted"
            );
            std::fs::write(dir.join("import-layout-fixtures.log"), &log).ok();
            panic!(
                "prediction 2's 145 MB half failed: H-from-C and H-from-R have different row \
                 orders (first divergence at index {first_diff:?})"
            );
        }
    }

    // ---- the file table, and disk after ---------------------------------------------------------
    say!("\nthe nine-file matrix:");
    for w in &written {
        say!(
            "  {:<15} g{:<5} {:>11} B  {:>2} row groups  sha256 {}",
            w.order.as_str(),
            w.granularity,
            w.bytes,
            w.row_groups,
            w.sha256
        );
    }

    let free_after = free_bytes_on_c().unwrap_or(0);
    say!(
        "\nfree disk after: {:.2} GiB ({free_after} B) — delta {:.3} GiB",
        free_after as f64 / (1u64 << 30) as f64,
        (free_before as i64 - free_after as i64) as f64 / (1u64 << 30) as f64
    );
    say!("attempts failed (watchdog or refusal): {attempts_failed}");

    std::fs::write(dir.join("import-layout-fixtures.log"), &log).expect("write the phase log");
    assert_eq!(attempts_failed, 0, "at least one rewrite failed; see the log above");
}
