// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! Phase 7 of the import-layout cut — the **5 GB correctness pass**, pointed at `C5`/`H5`/`R5`
//! (phase 5's fixture set) rather than the 145 MB matrix.
//!
//! `kernel/IMPORT-LAYOUT-PREREGISTRATION.md` §2, verbatim: *"the sorted per-feature digest set
//! `{(id, sha256(coords))}` is identical across `C`, `H`, `R`" at every viewport, computed by a
//! dedicated correctness phase, **never substituted by a fold**.* This is that condition at the 5 GB
//! class, n = 1 per file/viewport (the piece's own declared scope — the 145 MB half already ran at
//! phase 3 with the real thing; this file is that same instrument, pointed at a different set of
//! files, not a new one).
//!
//! **Everything about the canonicalization, the instrument, and why it exists rather than the fold
//! `first_batch_factorial.rs`'s A1 amendment used, is identical to
//! `engine/tests/import_layout_digest.rs`'s own header — restated only where the 5 GB class differs
//! (no granularity axis; a different feature count and grid; a wider per-file watchdog ceiling is
//! **not** wider — the preregistration declares the same 1 800 s / 120 s pair at both classes, §7).**
//!
//! ## Cross-file identity is the condition; a mismatch STOPS the cut
//!
//! Per the piece's own instruction and the preregistration's fail condition (§2): a mismatch here is
//! recorded and reported, not debugged. This file's own final `assert!` enforces that by failing the
//! test outright on any mismatch, exactly as the 145 MB pass does.

use std::collections::BTreeSet;
use std::path::PathBuf;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};

use spatial_engine::{Bbox, CancelToken, Dataset, ViewportQuery};

// ---- the three 5 GB files, restated from `kernel/tests/import_layout_factorial.rs::FileId5gb` (not
// reachable from an `engine` integration test — a different crate) ---------------------------------

#[derive(Clone, Copy, PartialEq, Eq, Debug)]
enum FileId5gb {
    C5,
    H5,
    R5,
}

impl FileId5gb {
    const ALL: [FileId5gb; 3] = [Self::C5, Self::H5, Self::R5];
    fn as_str(self) -> &'static str {
        match self {
            Self::C5 => "C5-duckdb-raster-5gb",
            Self::H5 => "H5-duckdb-hilbert16-5gb",
            Self::R5 => "R5-duckdb-shuffled-5gb",
        }
    }
    fn path(self) -> PathBuf {
        let first_batch = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
            .parent()
            .unwrap()
            .join("target/slice-evidence/first-batch");
        match self {
            Self::C5 => first_batch.join("parcels-5gb-duckdb-raster.parquet"),
            Self::H5 => first_batch.join("parcels-5gb-duckdb-hilbert16.parquet"),
            Self::R5 => evidence_dir().join("parcels-5gb-duckdb-shuffled.parquet"),
        }
    }
}

/// The phase-5 pin, independently re-verified against the files on disk before any digest is
/// trusted — a fixture that moved underneath this phase must not be read silently.
const KNOWN_SHA256_5GB: &[(FileId5gb, &str, u64)] = &[
    (
        FileId5gb::C5,
        "9b07b1ebf31f7011bf52c4904e7f991bb24aac59ff9c38d64aaff202cd8a659b",
        4_976_612_784,
    ),
    (
        FileId5gb::H5,
        "eb963539b21a802130796886a00a2c7667be1c16659f748685f4ce7b3f4fabf1",
        5_000_231_051,
    ),
    (
        FileId5gb::R5,
        "43d50bd6a646ff4945f70f2bfcfc1706bfcdaa8fd6c8b7783e9796d5c282d982",
        5_176_967_826,
    ),
];

fn evidence_dir() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .parent()
        .unwrap()
        .join("target/slice-evidence/import-layout")
}
fn logs_dir() -> PathBuf {
    let d = evidence_dir().join("logs");
    std::fs::create_dir_all(&d).unwrap();
    d
}

fn file_facts(p: &std::path::Path) -> (u64, String) {
    let Ok(md) = std::fs::metadata(p) else { return (0, "absent".into()) };
    let hash = spatial_engine::index::content_hash(p, &CancelToken::new())
        .map(|(h, _)| h)
        .unwrap_or_else(|_| "unreadable".into());
    (md.len(), hash)
}

fn free_bytes_on_c() -> Option<u64> {
    let out = std::process::Command::new("powershell")
        .args(["-NoProfile", "-Command", "(Get-PSDrive C).Free"])
        .output()
        .ok()?;
    String::from_utf8_lossy(&out.stdout).trim().parse().ok()
}

/// The same 40 GiB floor this cut's preflight declared (`CUT-STATE.md` phase 0).
const MIN_FREE_BYTES: u64 = 40 * 1024 * 1024 * 1024;

fn require_disk(phase: &str) {
    let free = free_bytes_on_c().unwrap_or(0);
    assert!(
        free >= MIN_FREE_BYTES,
        "phase `{phase}` refuses to start: {:.1} GiB free, declared floor {} GiB.",
        free as f64 / (1u64 << 30) as f64,
        MIN_FREE_BYTES >> 30
    );
}

// ---- the viewport grid, restated from `kernel/tests/import_layout_factorial.rs`'s 5 GB section
// (`FEATURES_5GB = 3_300_000`, `SCALE-PASS-PREREGISTRATION.md` §1a) — private to that crate's test
// binary and not reachable here ------------------------------------------------------------------------

const FEATURES: usize = 3_300_000;
const CELL_M: f64 = 40.0;

fn grid_cols() -> f64 {
    (FEATURES as f64).sqrt().ceil()
}

fn edge(cols: f64, divisor: usize) -> f64 {
    ((cols as usize / divisor) as f64) * CELL_M + CELL_M / 2.0
}

#[derive(Clone, Copy, PartialEq, Eq, Debug)]
enum ViewId {
    Whole,
    NearQuarter,
    FarQuarter,
    Sixty4th,
}

impl ViewId {
    const ALL: [ViewId; 4] = [Self::Whole, Self::NearQuarter, Self::FarQuarter, Self::Sixty4th];

    fn as_str(self) -> &'static str {
        match self {
            Self::Whole => "whole",
            Self::NearQuarter => "near-quarter",
            Self::FarQuarter => "far-quarter",
            Self::Sixty4th => "1-64",
        }
    }

    fn bbox(self, cols: f64, e_lo: f64, n_lo: f64) -> Option<Bbox> {
        let top = n_lo + (cols - 1.0) * CELL_M + CELL_M / 2.0;
        match self {
            Self::Whole => None,
            Self::NearQuarter => Some(Bbox {
                xmin: e_lo,
                ymin: n_lo,
                xmax: e_lo + edge(cols, 2),
                ymax: n_lo + edge(cols, 2),
            }),
            Self::FarQuarter => Some(Bbox {
                xmin: e_lo,
                ymin: top - edge(cols, 2),
                xmax: e_lo + edge(cols, 2),
                ymax: top,
            }),
            Self::Sixty4th => Some(Bbox {
                xmin: e_lo,
                ymin: n_lo,
                xmax: e_lo + edge(cols, 8),
                ymax: n_lo + edge(cols, 8),
            }),
        }
    }
}

/// The exact row count a viewport selects, from the generator's own grid arithmetic — **not
/// observed**. Verified by hand against `kernel/RESULTS.md`'s A1 section before this file was
/// written: whole 3 300 000, near-quarter 826 281, far-quarter 825 700, 1/64 51 984.
fn predicted_rows(v: ViewId) -> u64 {
    let n = FEATURES as u64;
    let cols = grid_cols() as u64;
    let full_rows = n / cols;
    let partial = n % cols;
    let (x_cols, y_lo, y_hi) = match v {
        ViewId::Whole => return n,
        ViewId::NearQuarter => {
            let last = cols / 2;
            (last + 1, 0u64, last)
        }
        ViewId::Sixty4th => {
            let last = cols / 8;
            (last + 1, 0u64, last)
        }
        ViewId::FarQuarter => {
            let last = cols / 2;
            (last + 1, cols - 1 - last, cols - 1)
        }
    };
    let mut rows = 0u64;
    for j in y_lo..=y_hi {
        let in_row = if j < full_rows { cols } else if j == full_rows { partial } else { 0 };
        rows += in_row.min(x_cols);
    }
    rows
}

// ---- the digest, identical to `engine/tests/import_layout_digest.rs`'s own (restated: that file's
// helpers are private to its own test binary) -----------------------------------------------------

fn per_feature_digest_set(
    mut stream: spatial_engine::BatchStream,
    dog: &DigestWatchdog,
) -> BTreeSet<(u64, String)> {
    use arrow::array::Array;
    let mut out = BTreeSet::new();
    let mut buf = Vec::new();
    while let Some(info) = stream.next_into(&mut buf) {
        info.expect("batch");
        dog.beat();
        let reader = arrow::ipc::reader::StreamReader::try_new(std::io::Cursor::new(&buf), None)
            .expect("ipc reader");
        for batch in reader {
            let batch = batch.expect("record batch");
            let ids = batch
                .column_by_name(spatial_engine::ID_COLUMN)
                .expect("id column")
                .as_any()
                .downcast_ref::<arrow::array::UInt64Array>()
                .expect("u64 ids")
                .clone();
            let geom = batch.column_by_name("geometry").expect("geometry column");
            for r in 0..batch.num_rows() {
                out.insert((ids.value(r), coordinate_digest(geom, r)));
            }
        }
        buf.clear();
    }
    out
}

fn coordinate_digest(col: &arrow::array::ArrayRef, row: usize) -> String {
    use arrow::array::Array;
    use sha2::{Digest, Sha256};
    let list = col.as_any().downcast_ref::<arrow::array::ListArray>().expect("List<rings>");
    let rings = list.value(row);
    let rings = rings.as_any().downcast_ref::<arrow::array::ListArray>().expect("List<vertices>");
    let mut h = Sha256::new();
    for r in 0..rings.len() {
        let verts = rings.value(r);
        let verts = verts
            .as_any()
            .downcast_ref::<arrow::array::FixedSizeListArray>()
            .expect("FixedSizeList<xy>");
        let xy = verts.values();
        let xy = xy.as_any().downcast_ref::<arrow::array::Float64Array>().expect("f64 xy");
        h.update((xy.len() as u64).to_le_bytes());
        for v in xy.values() {
            h.update(v.to_bits().to_le_bytes());
        }
    }
    format!("{:x}", h.finalize())
}

fn set_digest(set: &BTreeSet<(u64, String)>) -> String {
    use sha2::{Digest, Sha256};
    let mut h = Sha256::new();
    for (id, digest_hex) in set {
        h.update(id.to_le_bytes());
        h.update(hex_decode(digest_hex));
    }
    format!("{:x}", h.finalize())
}

fn hex_decode(s: &str) -> Vec<u8> {
    (0..s.len())
        .step_by(2)
        .map(|i| u8::from_str_radix(&s[i..i + 2], 16).expect("even-length lowercase hex"))
        .collect()
}

// ---- the watchdog, restated from `import_layout_digest.rs::DigestWatchdog` (private to that test
// binary) ------------------------------------------------------------------------------------------

struct DigestWatchdog {
    fired: Arc<AtomicBool>,
    stop: Arc<AtomicBool>,
    beat: Arc<Mutex<Instant>>,
    handle: Option<std::thread::JoinHandle<()>>,
}

const WATCHDOG_GRACE: Duration = Duration::from_secs(60);

impl DigestWatchdog {
    fn start(total: Duration, silence: Duration) -> Self {
        let fired = Arc::new(AtomicBool::new(false));
        let stop = Arc::new(AtomicBool::new(false));
        let beat = Arc::new(Mutex::new(Instant::now()));
        let (f, s, b) = (fired.clone(), stop.clone(), beat.clone());
        let started = Instant::now();
        let handle = std::thread::spawn(move || loop {
            if s.load(Ordering::Relaxed) {
                return;
            }
            std::thread::sleep(Duration::from_millis(250));
            let over_total = started.elapsed() > total;
            let over_silence = b.lock().map(|t| t.elapsed() > silence).unwrap_or(false);
            if !(over_total || over_silence) {
                continue;
            }
            let why = if over_total { "total" } else { "silence" };
            eprintln!(
                "[watchdog] 5 GB digest phase exceeded its declared {why} ceiling after {:.1} s; \
                 this file's cells are `unmeasured — watchdog at N s` and are NOT re-run within this \
                 cut (preregistration §7).",
                started.elapsed().as_secs_f64()
            );
            f.store(true, Ordering::SeqCst);
            let grace_start = Instant::now();
            while grace_start.elapsed() < WATCHDOG_GRACE {
                if s.load(Ordering::Relaxed) {
                    return;
                }
                std::thread::sleep(Duration::from_millis(100));
            }
            eprintln!("[watchdog] did not return inside the grace; aborting");
            std::process::abort();
        });
        Self { fired, stop, beat, handle: Some(handle) }
    }

    fn beat(&self) {
        if let Ok(mut t) = self.beat.lock() {
            *t = Instant::now();
        }
    }

    fn finish(mut self) -> bool {
        self.stop.store(true, Ordering::Relaxed);
        if let Some(h) = self.handle.take() {
            let _ = h.join();
        }
        self.fired.load(Ordering::SeqCst)
    }
}

/// Preregistration §7 — the same pair at both classes.
const CEIL_DIGEST_PER_FILE: Duration = Duration::from_secs(1_800);
const CEIL_STREAM_SILENCE: Duration = Duration::from_secs(120);

// ---- the driver -------------------------------------------------------------------------------------

#[test]
#[ignore = "correctness pass; run explicitly with --release, --features fixture; \
            kernel/IMPORT-LAYOUT-PREREGISTRATION.md phase 7"]
fn the_5gb_cross_file_digest_correctness_pass() {
    assert!(
        !cfg!(debug_assertions),
        "this phase's digests are compared for exact equality across files. Run with --release."
    );
    require_disk("import-layout-5gb-digest");

    let out_dir = logs_dir();
    let mut log = String::new();
    macro_rules! say {
        ($($a:tt)*) => {{ let s = format!($($a)*); println!("{s}"); log.push_str(&s); log.push('\n'); }};
    }

    say!("kernel/IMPORT-LAYOUT-PREREGISTRATION.md phase 7 — 5 GB cross-file digest correctness pass");
    say!(
        "canonicalization: identical to phase 3's (engine/tests/import_layout_digest.rs's header): \
         sha256 over each ring's vertex count (u64 LE) then each vertex's x,y (f64::to_bits, LE), \
         rings and vertices in file order, never sorted; set digest is sha256 over the BTreeSet's own \
         ascending (id, digest) order."
    );

    // ---- verify the three fixtures' hashes before trusting any of them --------------------------
    for &(order, want_hash, want_bytes) in KNOWN_SHA256_5GB {
        let path = order.path();
        let (bytes, hash) = file_facts(&path);
        assert_eq!(
            hash, want_hash,
            "{}: fixture hash does not match the phase-5 pin ({want_hash}) — the fixture moved \
             underneath this phase; refusing to read it",
            order.as_str()
        );
        assert_eq!(bytes, want_bytes, "{}: fixture size does not match the phase-5 pin", order.as_str());
        say!("verified {}: {bytes} B, sha256:{hash}", order.as_str());
    }

    // ---- per (file, viewport): the digest set, n = 1, one watchdog per file ----------------------
    let cols = grid_cols();
    struct Cell {
        order: FileId5gb,
        view: ViewId,
        set: BTreeSet<(u64, String)>,
        digest: String,
        rows: usize,
    }
    let mut cells: Vec<Cell> = Vec::new();

    for &order in &FileId5gb::ALL {
        let path = order.path();
        let ds = Dataset::open(&path).expect("open dataset");
        let (e_lo, n_lo) = (spatial_engine::fixture::E_LO, spatial_engine::fixture::N_LO);
        let dog = DigestWatchdog::start(CEIL_DIGEST_PER_FILE, CEIL_STREAM_SILENCE);
        let file_started = Instant::now();
        for view in ViewId::ALL {
            let q = match view.bbox(cols, e_lo, n_lo) {
                Some(b) => ViewportQuery::viewport(b, ds.crs().identifier()),
                None => ViewportQuery::all(),
            };
            let stream = ds.stream(&q).expect("stream");
            let set = per_feature_digest_set(stream, &dog);
            let rows = set.len();
            let digest = set_digest(&set);
            say!(
                "{{\"file\":\"{}\",\"viewport\":\"{}\",\"rows\":{rows},\"set_digest\":\"sha256:{digest}\"}}",
                order.as_str(),
                view.as_str()
            );
            cells.push(Cell { order, view, set, digest, rows });
        }
        let fired = dog.finish();
        say!(
            "{}: all four viewports in {:.1} s{}",
            order.as_str(),
            file_started.elapsed().as_secs_f64(),
            if fired { " (WATCHDOG FIRED)" } else { "" }
        );
        assert!(!fired, "the digest watchdog fired for {}", order.as_str());
    }
    assert_eq!(cells.len(), 3 * 4, "expected the full 3-file x 4-viewport matrix");

    // ---- cross-file comparison at every viewport ---------------------------------------------------
    let find = |order: FileId5gb, view: ViewId| -> &Cell {
        cells.iter().find(|c| c.order == order && c.view == view).expect("every cell was computed above")
    };

    let mut matrix = String::new();
    matrix.push_str("viewport      verdict  rows(C5/H5/R5/predicted)      set_digest equal?\n");
    let mut any_fail = false;
    for view in ViewId::ALL {
        let c = find(FileId5gb::C5, view);
        let h = find(FileId5gb::H5, view);
        let r = find(FileId5gb::R5, view);
        let predicted = predicted_rows(view);
        let rows_ok = c.rows as u64 == predicted
            && h.rows as u64 == predicted
            && r.rows as u64 == predicted;
        let sets_ok = c.set == h.set && h.set == r.set;
        let pass = rows_ok && sets_ok;
        any_fail |= !pass;
        matrix.push_str(&format!(
            "{:<13} {:<7}  C5={} H5={} R5={} predicted={}  {}\n",
            view.as_str(),
            if pass { "PASS" } else { "FAIL" },
            c.rows,
            h.rows,
            r.rows,
            predicted,
            if sets_ok { "yes" } else { "NO" }
        ));
        if !pass {
            say!(
                "MISMATCH {}: rows C5={} H5={} R5={} (predicted {predicted}, rows_ok={rows_ok}); \
                 set_digest C5=sha256:{} H5=sha256:{} R5=sha256:{} (sets_ok={sets_ok})",
                view.as_str(),
                c.rows,
                h.rows,
                r.rows,
                c.digest,
                h.digest,
                r.digest
            );
        }
    }

    println!("\n{matrix}");
    log.push('\n');
    log.push_str(&matrix);
    std::fs::write(out_dir.join("digest-correctness-5gb.log"), &log).expect("write the phase log");
    std::fs::write(out_dir.join("digest-correctness-5gb-matrix.txt"), &matrix)
        .expect("write the pass/fail matrix");

    assert!(
        !any_fail,
        "cross-file digest mismatch at one or more 5 GB (order, viewport) cells — per the \
         preregistration this STOPS the cut. See \
         target/slice-evidence/import-layout/logs/digest-correctness-5gb-matrix.txt and CUT-STATE.md."
    );
}
