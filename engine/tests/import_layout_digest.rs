// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! Phase 3 of the import-layout cut — the **correctness** phase, which gates every later phase.
//!
//! `kernel/IMPORT-LAYOUT-PREREGISTRATION.md` §2, verbatim: *"the sorted per-feature digest set
//! `{(id, sha256(coords))}` is identical across `C`, `H`, `R`" at every viewport, computed by a
//! dedicated correctness phase, **never substituted by a fold**.* §6 names the same instrument
//! ("row order, per file") and marks it "correctness phase only, never a fold, never substituted".
//!
//! ## Why this file exists at all, stated because it is the whole reason this is its own phase
//!
//! The identical condition was **declared twice before this cut and substituted both times** by a
//! 64-bit FNV-1a fold over concatenated wire bytes — `kernel/tests/first_batch_factorial.rs`'s
//! `WireFold`, disclosed rather than hidden in `kernel/RESULTS.md`'s seventh section ("The harness
//! implements the first as a **64-bit FNV-1a fold**, not SHA-256, and **does not compute the
//! per-feature digest set at all**") and again in the A1 amendment ("the harness still records only
//! a 64-bit FNV-1a fold ... The digest-set condition is still not evidenced, and it is a gate
//! condition"). A fold detects *some* difference; it does not establish identity, and a match on a
//! weaker instrument is not evidence for a claim that names a stronger one. This file is the real
//! thing: **SHA-256, per feature**, over **decoded coordinates**, through the **real engine query
//! path** (`Dataset::open` + `Dataset::stream`) rather than a direct parquet read — so the digest is
//! taken over exactly the rows and bytes a viewport query actually hands a caller, not over
//! whatever the file happens to contain on disk.
//!
//! ## Canonicalization, defined once here (binding for this file)
//!
//! For each feature a viewport query's stream returns (one Arrow IPC batch at a time, decoded with
//! `arrow::ipc::reader::StreamReader`), the engine's GeoArrow polygon encoding is
//! `List<rings: List<vertices: FixedSizeList<2, Float64>>>` — rings in file order (outer ring
//! first, then interior rings/holes in the order the writer emitted them; **never sorted**, so a
//! swapped ring changes the digest), vertices in ring order (**never sorted**, so a swapped vertex
//! changes the digest). The per-feature digest is SHA-256 over, for each ring in order:
//!
//! 1. **8 bytes**: the ring's vertex count, as `u64`, **little-endian**.
//! 2. For each vertex in that ring, in order: **8 bytes x** (`f64::to_bits`, little-endian)
//!    followed by **8 bytes y** (`f64::to_bits`, little-endian). `to_bits` rather than the raw IEEE
//!    754 bytes so a canonical NaN payload cannot bite silently — this generator never emits a NaN,
//!    but the digest does not rely on that not happening.
//!
//! The lowercase hex of the resulting 32 bytes is the feature's digest; the entry placed in the set
//! is `(id: u64, digest: String)`, and the id is read from the stream's own `id` column (never
//! assumed to equal file position). `BTreeSet<(u64, String)>` orders its entries by `id` ascending
//! (ids are unique, so the digest never breaks a tie) — that ordering **is** "the sorted set" the
//! gate names; nothing here re-sorts anything.
//!
//! A cell's **set digest** — printed per (file, viewport) row below and compared across files — is
//! one more SHA-256, taken over the set's own ascending iteration order: for each `(id, digest)`
//! entry, 8 bytes of `id` (`u64` little-endian) followed by the 32 raw bytes the digest's hex
//! decodes to. Two files whose per-feature digest **sets** are equal as sets necessarily produce the
//! same set digest, because the concatenation order is a deterministic function of the set's
//! content (ascending `id`) and not of insertion order — so a single string equality is exactly as
//! strong a claim as the `BTreeSet` equality it is taken over.
//!
//! ## What this file is not
//!
//! Not a measurement: no wall clock, no read-volume instrument, nothing here is `unmeasured` or
//! admissible against the gate's scored quantities (§2). It answers exactly one question — are the
//! feature sets these three files' query paths return *identical* at every viewport — and per the
//! preregistration's own rule, a mismatch here is a cut-stopping result, not a debugging invitation.

use std::collections::BTreeSet;
use std::path::PathBuf;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};

use spatial_engine::layout::ClusterOrder;
use spatial_engine::{Bbox, CancelToken, Dataset, ViewportQuery};

// ---- the fixture matrix, restated from `engine/tests/import_layout_fixtures.rs` (phase 2) -------

const GRANULARITIES: [usize; 3] = [8_192, 4_096, 2_048];
const ORDERS: [ClusterOrder; 3] =
    [ClusterOrder::SourceIdentity, ClusterOrder::Hilbert16, ClusterOrder::Shuffled];

/// The known-good hashes phase 2 recorded (`CUT-STATE.md`'s phase-2 addendum table), independently
/// re-verified against the file on disk before any digest is trusted — a fixture that moved
/// underneath this phase must not be read silently.
const KNOWN_SHA256: &[(ClusterOrder, usize, &str)] = &[
    (
        ClusterOrder::SourceIdentity,
        8192,
        "ffc76db3c8e9bed23f070efb8f4d4cf102b0e2f81865da3d9926cfb9159e4202",
    ),
    (
        ClusterOrder::Hilbert16,
        8192,
        "ced7c1ac070a1bbc973273a2f35563223d68bff17124c4a1d581cdbe155359e5",
    ),
    (
        ClusterOrder::Shuffled,
        8192,
        "7bfb15ee55e6a3b011e63a935d98ac9e63472f12890eebd39b17df3e2343772d",
    ),
    (
        ClusterOrder::SourceIdentity,
        4096,
        "c02d4139398c4ddbc8c387001971ef11beecd2e9e8a0d6d51d370317aa9dd893",
    ),
    (
        ClusterOrder::Hilbert16,
        4096,
        "0c3e146d4c1b755c174c2303528b6a5948b5d7fcd3bf984aeeca7440923f9213",
    ),
    (
        ClusterOrder::Shuffled,
        4096,
        "6afe3b2b228f02301c32eaa3c479f74d3b222454fa3a7c0e26fc63388c59be34",
    ),
    (
        ClusterOrder::SourceIdentity,
        2048,
        "3efc419cdfe6159c9fcd54314e6704258cf5606174febc79c5e83febc14b196c",
    ),
    (
        ClusterOrder::Hilbert16,
        2048,
        "3abbb595876fab1b18146e90cfc19f514596f9f67424b7ae532dbac86ac87e2a",
    ),
    (
        ClusterOrder::Shuffled,
        2048,
        "ae56362b42988e33ce0a8ed7738df6643aceabaa05a9413ca34ae53dd82f6f78",
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

fn fixture_path(order: ClusterOrder, granularity: usize) -> PathBuf {
    evidence_dir().join(format!("parcels-145mb-duckdb-{}-g{granularity}.parquet", order.as_str()))
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

// ---- the viewport grid, restated from `kernel/tests/first_batch_factorial.rs`'s `ViewId` --------
//
// **The exact bboxes that harness's own preregistered gate uses**, at this fixture's own feature
// count (100 000 — every one of the nine files, since a rewrite changes row order and never feature
// count). Restated rather than imported: `first_batch_factorial.rs`'s constants are private to the
// `kernel` crate's own test binary and are not reachable from an `engine` integration test at all.

const FEATURES: usize = 100_000;
const CELL_M: f64 = 40.0;

fn grid_cols() -> f64 {
    (FEATURES as f64).sqrt().ceil()
}

/// An edge on a cell **centre**, so inclusion is pure arithmetic and cannot depend on per-feature
/// vertex jitter (`kernel/tests/scale_pass.rs::viewport_edge`'s recorded correction).
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
/// observed** — restated from `kernel/tests/first_batch_factorial.rs::predicted_rows`, specialised
/// to this file's one feature count.
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

// ---- the digest, as specified in this file's own header ------------------------------------------

/// `{(id, sha256(coords))}` for a stream, through the real query path — the comparison this file's
/// header defines.
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

/// One feature's coordinate digest, exactly as this file's header canonicalization defines it.
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

/// The **set digest** for one (file, viewport) cell — one SHA-256 over the set's own ascending
/// `(id, digest)` iteration order, as this file's header specifies.
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

// ---- a minimal per-file watchdog: preregistration §7's 1 800 s digest ceiling and 120 s stream --
// silence ceiling ------------------------------------------------------------------------------------
//
// Mirrors `kernel/tests/support::Watchdog`'s two-ceiling shape; a self-contained copy for the same
// reason `import_layout_fixtures.rs`'s own `RewriteWatchdog` is one — that module is private to the
// `kernel` crate and unreachable from an `engine` integration test.

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
                "[watchdog] digest phase exceeded its declared {why} ceiling after {:.1} s; this \
                 file's cells are `unmeasured — watchdog at N s` and are NOT re-run within this cut \
                 (preregistration §7).",
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

/// Preregistration §7.
const CEIL_DIGEST_PER_FILE: Duration = Duration::from_secs(1_800);
const CEIL_STREAM_SILENCE: Duration = Duration::from_secs(120);

// ---- the driver ------------------------------------------------------------------------------------

#[test]
#[ignore = "correctness pass; run explicitly with --release, --features fixture; \
            kernel/IMPORT-LAYOUT-PREREGISTRATION.md phase 3"]
fn the_cross_file_digest_correctness_pass() {
    assert!(
        !cfg!(debug_assertions),
        "this phase's digests are compared for exact equality across files; nothing here is a \
         timing, but every other pass in this family refuses a debug build on principle. Run with \
         --release."
    );
    require_disk("import-layout-digest");

    let out_dir = logs_dir();
    let mut log = String::new();
    macro_rules! say {
        ($($a:tt)*) => {{ let s = format!($($a)*); println!("{s}"); log.push_str(&s); log.push('\n'); }};
    }

    say!("kernel/IMPORT-LAYOUT-PREREGISTRATION.md phase 3 — cross-file digest correctness pass");
    say!(
        "canonicalization: sha256 over each ring's vertex count (u64 LE) then each vertex's x,y \
         (f64::to_bits, LE), rings and vertices in file order, never sorted; set digest is sha256 \
         over the BTreeSet's own ascending (id, digest) order. See this file's header for the full \
         specification."
    );

    // ---- verify the nine fixtures' hashes before trusting any of them --------------------------
    for &(order, g, want_hash) in KNOWN_SHA256 {
        let path = fixture_path(order, g);
        let (bytes, hash) = file_facts(&path);
        assert_eq!(
            hash, want_hash,
            "{}@{g}: fixture hash does not match the phase-2 pin ({want_hash}) — the fixture moved \
             underneath this phase; refusing to read it",
            order.as_str()
        );
        say!("verified {} @ g{g}: {bytes} B, sha256:{hash}", order.as_str());
    }

    // ---- per (file, viewport): the digest set, n = 1, one watchdog per file --------------------
    let cols = grid_cols();
    struct Cell {
        order: ClusterOrder,
        granularity: usize,
        view: ViewId,
        set: BTreeSet<(u64, String)>,
        digest: String,
        rows: usize,
    }
    let mut cells: Vec<Cell> = Vec::new();

    for &g in &GRANULARITIES {
        for &order in &ORDERS {
            let path = fixture_path(order, g);
            let ds = Dataset::open(&path).expect("open dataset");
            let (e_lo, n_lo) = (spatial_engine::fixture::E_LO, spatial_engine::fixture::N_LO);
            let dog = DigestWatchdog::start(CEIL_DIGEST_PER_FILE, CEIL_STREAM_SILENCE);
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
                    "{{\"file\":\"{}\",\"granularity\":{g},\"viewport\":\"{}\",\"rows\":{rows},\
                     \"set_digest\":\"sha256:{digest}\"}}",
                    order.as_str(),
                    view.as_str()
                );
                cells.push(Cell { order, granularity: g, view, set, digest, rows });
            }
            let fired = dog.finish();
            assert!(!fired, "the digest watchdog fired for {} @ g{g}", order.as_str());
        }
    }
    assert_eq!(cells.len(), 9 * 4, "expected the full 9-file x 4-viewport matrix");

    // ---- cross-file comparison at fixed granularity, every viewport ----------------------------
    let find = |order: ClusterOrder, g: usize, view: ViewId| -> &Cell {
        cells
            .iter()
            .find(|c| c.order == order && c.granularity == g && c.view == view)
            .expect("every (order, granularity, viewport) cell was computed above")
    };

    let mut matrix = String::new();
    matrix.push_str("granularity  viewport      verdict  rows(C/H/R/predicted)      set_digest equal?\n");
    let mut any_fail = false;
    for &g in &GRANULARITIES {
        for view in ViewId::ALL {
            let c = find(ClusterOrder::SourceIdentity, g, view);
            let h = find(ClusterOrder::Hilbert16, g, view);
            let r = find(ClusterOrder::Shuffled, g, view);
            let predicted = predicted_rows(view);
            let rows_ok = c.rows as u64 == predicted
                && h.rows as u64 == predicted
                && r.rows as u64 == predicted;
            let sets_ok = c.set == h.set && h.set == r.set;
            let pass = rows_ok && sets_ok;
            any_fail |= !pass;
            matrix.push_str(&format!(
                "g{:<11} {:<13} {:<7}  C={} H={} R={} predicted={}  {}\n",
                g,
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
                    "MISMATCH g{g} / {}: rows C={} H={} R={} (predicted {predicted}, rows_ok={rows_ok}); \
                     set_digest C=sha256:{} H=sha256:{} R=sha256:{} (sets_ok={sets_ok})",
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
    }

    println!("\n{matrix}");
    log.push('\n');
    log.push_str(&matrix);
    std::fs::write(out_dir.join("digest-correctness.log"), &log).expect("write the phase log");
    std::fs::write(out_dir.join("digest-correctness-matrix.txt"), &matrix)
        .expect("write the pass/fail matrix");

    assert!(
        !any_fail,
        "cross-file digest mismatch at one or more (granularity, viewport) cells — per the \
         preregistration this STOPS the cut. See \
         target/slice-evidence/import-layout/logs/digest-correctness-matrix.txt and CUT-STATE.md."
    );
}
