// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! Phase 4 of the import-layout cut — `kernel/IMPORT-LAYOUT-PREREGISTRATION.md`'s **scored 145 MB
//! factorial**: `{C raster, H hilbert16, R shuffled} x {8192, 4096, 2048 rows/group} x {whole,
//! near-quarter, far-quarter, 1/64}` — 9 files x 4 viewports, n = 7 -> 252 trials.
//!
//! **The preregistration is the contract and this file implements it.** Where the two disagree the
//! preregistration wins and this file is the defect.
//!
//! ## Prior art, reused rather than reinvented
//!
//! `kernel/tests/first_batch_factorial.rs`'s shape: **one process per trial** (the index/metadata
//! caches this crate keeps are process-wide and path-keyed, so a warm cell would bias a later one in
//! the same process); the trial's result travels through **a file, never stdout** — `NIGHT-STATE.md`'s
//! attempt-1 lesson: libtest's `--nocapture` writes a test's own output on the same line as its
//! progress banner (`test night_trial_child ... @@TRIAL@@{...}`), so a stdout-sentinel `strip_prefix`
//! never matched and 384 trials recorded `unmeasured` with a run that *looked* complete; trial order
//! from a **committed pure interleaving function**; the `settle`/`canary` discipline via
//! `kernel/tests/support`; `GetProcessIoCounters` query-scoped read-byte deltas as the primary
//! instrument.
//!
//! ## What is different here, and why
//!
//! - **No `plan`/`batch` axes.** This cut is about physical row order, not the B2 row-group index or
//!   lever A's time budget — both retired (`NEXT-CUT.md`'s "Framings blocked"). Every trial streams
//!   with `IndexUse::Off` (`Dataset::stream_with_cancel`) — `first_batch_factorial.rs`'s
//!   `ScanOnly, SizeOnly` cell.
//! - **No tracing, no wire fold.** `IMPORT-LAYOUT-PREREGISTRATION.md` §6 defines "time to first
//!   batch" as *"producer wall clock, `stream()` call -> first `next_into` return"* — a plain
//!   `Instant`, not a trace segment, so no `trace::start` guard is needed here. Row-identity
//!   correctness is **phase 3's** job (`engine/tests/import_layout_digest.rs`, already run and
//!   passed for all nine files, gate condition met per `CUT-STATE.md`); this phase never retains or
//!   folds payload bytes, so "payload-retention setting identical on both arms of every pair" (§2)
//!   holds **by construction** — the setting is "never retained", uniformly, on every cell, and is
//!   recorded as such in the artifact rather than computed per cell.
//! - **`total_ms` and `first_batch_ms` share one start point: the `stream_with_cancel` call itself.**
//!   `Dataset::stream`'s own doc says "Returns as soon as the statement is prepared; the first batch
//!   is produced on the first `next_into` call" — so the call already includes statement preparation.
//!   This is a **declared design decision**, not an unchanged inheritance:
//!   `first_batch_factorial.rs`'s own `total_ms` timer starts *after* the stream object already
//!   exists, which excludes statement preparation from "total query time" as a consequence of that
//!   file's control flow rather than a stated choice. This preregistration's §6 defines the
//!   first-batch instrument explicitly as starting at the `stream()` call; starting `total_ms` at the
//!   same point keeps `total_ms >= first_batch_ms` always true and gives "total query time" its plain
//!   meaning — the whole time the query took, prep included.
//!
//! ## Mechanism self-check, before the opening settle
//!
//! Preregistration §8 / this piece's brief, "finding 7 of the night cut": *"a harness that cannot
//! measure must die in seconds, not produce 252 identical `unmeasured` rows."* One throwaway trial
//! runs before any settle or measurement is trusted. Its result file is parsed with a real JSON
//! parser (`serde_json`, already a `kernel` dev-dependency — a stronger check than
//! `first_batch_factorial.rs`'s own `.contains("\"first_batch_ms\"")` substring test) and its
//! `read_bytes_query` field is asserted **present and greater than zero**.
//!
//! ## Warm-cache convention — followed exactly from `kernel/RESULTS.md`'s seventh section
//!
//! *"63.7 GiB RAM, no cache-purge mechanism in either harness. Every open, every scan and every index
//! build here read a warm Windows file cache."* This phase adds **no** active warm-up step of its
//! own, for the identical reason: nothing here purges the OS file cache, the nine fixtures (~1.37 GB
//! combined) were already read repeatedly by phases 2 and 3 in this same tree, and this machine's RAM
//! (recorded via `hardware_profile()` below) is far larger than that. The read-volume instrument
//! counts **logical** bytes the process asked the file system for, which is the quantity at stake
//! regardless of whether the OS serves a request from cache or disk (preregistration §6).
//!
//! ## Scoring
//!
//! This phase is **reported, not gated** — the gate is the 5 GB near-quarter cell, a later phase
//! (preregistration §4: "the 145 MB factorial ... [is] reported but do not gate"). What this file
//! scores, per this piece's own brief: does `H` read <= 70 % of `C` at the near quarter, at every
//! granularity, on all 7 trials; does prediction 1 hold (`R` >= 95 % at every viewport); does
//! prediction 3 hold (the near-quarter crossover does not reverse between 13 and 49 row groups).

use std::collections::BTreeSet;
use std::io::Write;
use std::path::PathBuf;
use std::process::Command;
use std::time::{Duration, Instant};

use spatial_engine::layout::ClusterOrder;
use spatial_engine::{Bbox, CancelToken, Dataset, ViewportQuery};

mod support;
use support::*;

// ---- the fixture matrix, restated from phase 2/3 (engine/tests/import_layout_fixtures.rs,
// engine/tests/import_layout_digest.rs) --------------------------------------------------------------

const GRANULARITIES: [usize; 3] = [8_192, 4_096, 2_048];
const ORDERS: [ClusterOrder; 3] =
    [ClusterOrder::SourceIdentity, ClusterOrder::Hilbert16, ClusterOrder::Shuffled];

/// The phase-2 pin (`CUT-STATE.md`'s phase-2 addendum table), independently re-verified against the
/// file on disk before any trial reads it — a fixture that moved underneath this phase must not be
/// measured silently. Identical to `engine/tests/import_layout_digest.rs`'s own copy (restated: not
/// reachable from a `kernel` integration test, which is a different crate).
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
    let d = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .parent()
        .unwrap()
        .join("target/slice-evidence/import-layout");
    std::fs::create_dir_all(&d).unwrap();
    d
}

fn logs_dir() -> PathBuf {
    let d = evidence_dir().join("logs");
    std::fs::create_dir_all(&d).unwrap();
    d
}

fn fixture_path(order: ClusterOrder, granularity: usize) -> PathBuf {
    evidence_dir().join(format!("parcels-145mb-duckdb-{}-g{granularity}.parquet", order.as_str()))
}

/// This cut's own 40 GiB preflight floor (`CUT-STATE.md` phase 0). **Deliberately shadows**
/// `support::require_disk`'s 20 GiB floor (this file's `use support::*;` brings that name in scope;
/// an explicit local definition takes priority over a glob import, so calls below resolve here)
/// rather than reusing it, on the same precedent `engine/tests/import_layout_fixtures.rs` and
/// `engine/tests/import_layout_digest.rs` set for this cut.
fn require_disk(phase: &str) -> u64 {
    const MIN_FREE_BYTES: u64 = 40 * 1024 * 1024 * 1024;
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

// ---- the viewport grid, restated from engine/tests/import_layout_digest.rs (not reachable from a
// `kernel` integration test) ---------------------------------------------------------------------

const FEATURES: usize = 100_000;
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

    fn bbox(self, cols: f64) -> Option<Bbox> {
        let (e_lo, n_lo) = (spatial_engine::fixture::E_LO, spatial_engine::fixture::N_LO);
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
/// observed**. Restated from `kernel/tests/first_batch_factorial.rs::predicted_rows`, specialised to
/// this fixture matrix's one feature count (a rewrite is the same features in a new order).
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

// ---- the cell space -------------------------------------------------------------------------------

#[derive(Clone, Copy, PartialEq, Eq, Debug)]
struct Cell {
    order: ClusterOrder,
    granularity: usize,
    view: ViewId,
}

impl Cell {
    fn label(&self) -> String {
        format!("{}|g{}|{}", self.order.as_str(), self.granularity, self.view.as_str())
    }
    fn parse(s: &str) -> Option<Self> {
        let p: Vec<&str> = s.split('|').collect();
        if p.len() != 3 {
            return None;
        }
        let order = match p[0] {
            "source-identity" => ClusterOrder::SourceIdentity,
            "hilbert16" => ClusterOrder::Hilbert16,
            "shuffled" => ClusterOrder::Shuffled,
            _ => return None,
        };
        let granularity: usize = p[1].strip_prefix('g')?.parse().ok()?;
        let view = match p[2] {
            "whole" => ViewId::Whole,
            "near-quarter" => ViewId::NearQuarter,
            "far-quarter" => ViewId::FarQuarter,
            "1-64" => ViewId::Sixty4th,
            _ => return None,
        };
        Some(Self { order, granularity, view })
    }
}

/// The cell list — **36 cells, generated by a pure function and committed**: three orders x three
/// granularities x four viewports (9 files x 4 viewports, this piece's own count).
fn cells() -> Vec<Cell> {
    let mut out = Vec::new();
    for &order in &ORDERS {
        for &granularity in &GRANULARITIES {
            for &view in &ViewId::ALL {
                out.push(Cell { order, granularity, view });
            }
        }
    }
    out
}

/// The trial order: repetition `r` runs `cells[(i + 5r) mod len]` for `i` in `0..len`. Restated from
/// `kernel/tests/first_batch_factorial.rs::interleaved`, private to that file's own test binary and
/// therefore not importable here (a separate integration-test crate). `gcd(5, 36) = 1`
/// (`36 = 2^2 x 3^2`, and `5` is prime and does not divide it), so every repetition is a full
/// permutation of the 36 cells rather than a partial cycle.
fn interleaved(len: usize, r: usize) -> Vec<usize> {
    (0..len).map(|i| (i + 5 * r) % len).collect()
}

const N: usize = 7; // preregistration §5, prediction 4: a floor, not a target.
const CEIL_TRIAL: Duration = Duration::from_secs(120); // preregistration §7: one 145 MB trial.
const SETTLE_OPENING: u64 = 120;
const SETTLE_CANARY: u64 = 60;

const CELL_VAR: &str = "SPATIAL_IMPORT_LAYOUT_CELL";
const OUT_VAR: &str = "SPATIAL_IMPORT_LAYOUT_OUT";

// ---- the child: exactly one trial, one JSON file -----------------------------------------------

/// One trial, in a process of its own. Not `#[ignore]`d — the ordinary suite runs this and it does
/// nothing, exactly `first_batch_factorial.rs::night_trial_child`'s own convention.
#[test]
fn import_layout_trial_child() {
    let (Ok(spec), Ok(out)) = (std::env::var(CELL_VAR), std::env::var(OUT_VAR)) else {
        return;
    };
    let cell = Cell::parse(&spec).expect("the driver passed an unparseable cell");
    let v = run_one_trial(&cell);
    let s = serde_json::to_string(&v).expect("serialize the trial result");
    let mut f = std::fs::File::create(&out).expect("create the trial's result file");
    f.write_all(s.as_bytes()).expect("write the trial result");
    f.sync_all().expect("flush the trial result");
    // Still echoed: a console is what an operator reads when something goes wrong.
    println!("trial {} -> {s}", cell.label());
}

fn run_one_trial(cell: &Cell) -> serde_json::Value {
    let path = fixture_path(cell.order, cell.granularity);
    let io_before = io_read_bytes();
    let open_started = Instant::now();
    let ds = match Dataset::open(&path) {
        Ok(d) => d,
        Err(e) => return trial_error(cell, "open", &e.to_string()),
    };
    let open_ms = open_started.elapsed().as_secs_f64() * 1000.0;

    let q = match cell.view.bbox(grid_cols()) {
        None => ViewportQuery::all(),
        Some(b) => ViewportQuery::viewport(b, ds.crs().identifier()),
    };

    // Query-scoped read-volume mark — right before the query, excluding `Dataset::open`'s own read
    // (`first_batch_factorial.rs`'s own precedent for why open and query get separate marks).
    let io_before_query = io_read_bytes();
    let cancel = CancelToken::new();

    // preregistration §6: "producer wall clock, `stream()` call -> first `next_into` return" — the
    // clock starts at the call, matching `Dataset::stream`'s own doc that statement preparation
    // happens inside it, not before the first `next_into`. `total_ms` shares this start point; see
    // this file's header for why.
    let call_started = Instant::now();
    let mut stream = match ds.stream_with_cancel(&q, cancel) {
        Ok(s) => s,
        Err(e) => return trial_error(cell, "stream", &e.to_string()),
    };

    let mut first_batch_ms: Option<f64> = None;
    let mut rows: u64 = 0;
    let mut payload: usize = 0;
    let mut buf: Vec<u8> = Vec::new();
    let mut err: Option<String> = None;
    // The timed loop. Payload is never retained — cleared every batch, uniformly across every cell
    // (this file's header explains why no wire fold is computed here: phase 3 already establishes
    // byte-for-byte row identity across C/H/R through the real query path).
    while let Some(info) = stream.next_into(&mut buf) {
        match info {
            Ok(i) => {
                if first_batch_ms.is_none() {
                    first_batch_ms = Some(call_started.elapsed().as_secs_f64() * 1000.0);
                }
                rows += i.rows as u64;
                payload += i.payload_bytes;
                buf.clear();
            }
            Err(e) => {
                err = Some(e.to_string());
                break;
            }
        }
    }
    let total_ms = call_started.elapsed().as_secs_f64() * 1000.0;
    let io_after = io_read_bytes();

    serde_json::json!({
        "cell": cell.label(),
        "order": cell.order.as_str(),
        "granularity": cell.granularity,
        "viewport": cell.view.as_str(),
        "open_ms": open_ms,
        "first_batch_ms": first_batch_ms,
        "total_ms": total_ms,
        "rows": rows,
        "predicted_rows": predicted_rows(cell.view),
        "payload_bytes": payload,
        "read_bytes_whole_trial": io_after.zip(io_before).map(|(a, b)| a.saturating_sub(b)),
        "read_bytes_query": io_after.zip(io_before_query).map(|(a, b)| a.saturating_sub(b)),
        "error": err,
    })
}

/// A failed trial, carrying its cell and every field a successful trial would carry (as `null`) — so
/// downstream field extraction never has to special-case a missing key.
fn trial_error(cell: &Cell, phase: &str, detail: &str) -> serde_json::Value {
    serde_json::json!({
        "cell": cell.label(),
        "order": cell.order.as_str(),
        "granularity": cell.granularity,
        "viewport": cell.view.as_str(),
        "open_ms": null,
        "first_batch_ms": null,
        "total_ms": null,
        "rows": null,
        "predicted_rows": predicted_rows(cell.view),
        "payload_bytes": null,
        "read_bytes_whole_trial": null,
        "read_bytes_query": null,
        "error": format!("{phase}: {detail}"),
    })
}

// ---- §6: the read-volume instrument — a bare `extern "system"` against kernel32, restated from
// `kernel/tests/first_batch_factorial.rs::io_read_bytes` (private to that file's own binary) --------

#[cfg(windows)]
fn io_read_bytes() -> Option<u64> {
    #[repr(C)]
    #[derive(Default)]
    struct IoCounters {
        read_ops: u64,
        write_ops: u64,
        other_ops: u64,
        read_bytes: u64,
        write_bytes: u64,
        other_bytes: u64,
    }
    extern "system" {
        fn GetCurrentProcess() -> isize;
        fn GetProcessIoCounters(h: isize, c: *mut IoCounters) -> i32;
    }
    let mut c = IoCounters::default();
    let ok = unsafe { GetProcessIoCounters(GetCurrentProcess(), &mut c) };
    (ok != 0).then_some(c.read_bytes)
}

/// **`None`, not zero.** A platform this cannot read is a gap in the instrument; a zero would be a
/// measurement claiming the query read nothing.
#[cfg(not(windows))]
fn io_read_bytes() -> Option<u64> {
    None
}

// ---- the driver -----------------------------------------------------------------------------------

fn spawn_trial(exe: &std::path::Path, cell: &Cell, slot: &std::path::Path) -> Result<String, String> {
    let _ = std::fs::remove_file(slot);
    let started = Instant::now();
    let out = Command::new(exe)
        .args(["import_layout_trial_child", "--exact", "--nocapture", "--test-threads=1"])
        .env(CELL_VAR, cell.label())
        .env(OUT_VAR, slot)
        .output()
        .map_err(|e| format!("spawn: {e}"))?;
    if started.elapsed() > CEIL_TRIAL {
        return Err(format!("exceeded the declared {} s trial ceiling", CEIL_TRIAL.as_secs()));
    }
    if !out.status.success() {
        let tail: String =
            String::from_utf8_lossy(&out.stderr).lines().rev().take(3).collect::<Vec<_>>().join(" / ");
        return Err(format!("child exited {:?}: {tail}", out.status.code()));
    }
    std::fs::read_to_string(slot).map_err(|e| format!("child wrote no result file: {e}"))
}

/// A cell's computed summary — the determinism condition, the read fraction, the total-time
/// distribution and the raw first-batch samples (reported, never gated).
struct CellSummary {
    order: ClusterOrder,
    granularity: usize,
    view: ViewId,
    file_bytes: u64,
    read_bytes_status: String,
    read_bytes: Option<u64>,
    distinct_read_bytes_count: usize,
    read_fraction: Option<f64>,
    total_ms_p50: Option<f64>,
    total_ms_samples: Vec<f64>,
    first_batch_ms_samples: Vec<Option<f64>>,
    rows_match_predicted: bool,
    errors: Vec<String>,
}

#[test]
#[ignore = "measurement pass; run explicitly with --release; kernel/IMPORT-LAYOUT-PREREGISTRATION.md \
            phase 4"]
fn the_145mb_factorial_pass() {
    refuse_debug("import_layout_factorial");
    let free_before = require_disk("import-layout-factorial-145mb");

    let mut log = String::new();
    macro_rules! say {
        ($($a:tt)*) => {{ let s = format!($($a)*); println!("{s}"); log.push_str(&s); log.push('\n'); }};
    }

    say!("kernel/IMPORT-LAYOUT-PREREGISTRATION.md phase 4 — the scored 145 MB factorial");
    say!("hardware: {}", hardware_profile());
    say!("media: {}", media_type());
    say!(
        "free disk before: {:.2} GiB ({free_before} B)",
        free_before as f64 / (1u64 << 30) as f64
    );

    let exe = std::env::current_exe().expect("current exe");
    let (exe_bytes, exe_hash) = file_facts(&exe);
    say!(
        "harness binary at time of use: {exe_bytes} B, sha256 {exe_hash} — logged, never asserted \
         against an earlier pin (CUT-STATE.md phase 3's finding: this workspace's release profile \
         relinks [[bin]] artifacts, moving their hash, on every `cargo build -p spatial-kernel` even \
         with source unchanged)"
    );

    // ---- fixture hashes, verified before the loop ---------------------------------------------
    let mut fixture_facts: Vec<(ClusterOrder, usize, u64, String)> = Vec::new();
    for &(order, g, want_hash) in KNOWN_SHA256 {
        let path = fixture_path(order, g);
        let (bytes, hash) = file_facts(&path);
        assert_eq!(
            hash, want_hash,
            "{}@{g}: fixture hash does not match the phase-2 pin ({want_hash}) — refusing to \
             measure a fixture that moved underneath this phase",
            order.as_str()
        );
        say!("verified {} @ g{g}: {bytes} B, sha256 {hash}", order.as_str());
        fixture_facts.push((order, g, bytes, hash));
    }
    assert_eq!(fixture_facts.len(), 9, "expected the full nine-file matrix");

    let file_bytes_of = |order: ClusterOrder, g: usize| -> u64 {
        fixture_facts
            .iter()
            .find(|(o, gr, _, _)| *o == order && *gr == g)
            .map(|(_, _, b, _)| *b)
            .unwrap_or(0)
    };

    let predicted: Vec<serde_json::Value> = ViewId::ALL
        .iter()
        .map(|&v| serde_json::json!({"viewport": v.as_str(), "rows": predicted_rows(v)}))
        .collect();
    for &v in &ViewId::ALL {
        say!("viewport {} selects {} rows (arithmetic, generator-derived)", v.as_str(), predicted_rows(v));
    }

    // ---- mechanism self-check, before anything is settled or timed ----------------------------
    let probe =
        Cell { order: ClusterOrder::SourceIdentity, granularity: 8_192, view: ViewId::Sixty4th };
    let slot = evidence_dir().join("trial-slot-factorial.json");
    match spawn_trial(&exe, &probe, &slot) {
        Ok(line) => {
            let v: serde_json::Value = serde_json::from_str(&line).unwrap_or_else(|e| {
                panic!(
                    "the trial mechanism produced something this driver's JSON parser cannot read \
                     ({e}); every one of the 252 trials would have recorded `unmeasured` without \
                     saying why. Got: {line}"
                )
            });
            assert!(
                v.get("error").map(|e| e.is_null()).unwrap_or(false),
                "mechanism self-check trial errored: {line}"
            );
            let rb = v.get("read_bytes_query").and_then(|x| x.as_u64());
            assert!(
                rb.is_some_and(|x| x > 0),
                "mechanism self-check produced a zero or missing read_bytes_query — the read-volume \
                 instrument (GetProcessIoCounters) cannot measure on this run. A harness that cannot \
                 measure must die here, in seconds, not after 252 identical `unmeasured` rows. \
                 Got: {line}"
            );
            let tm = v.get("total_ms").and_then(|x| x.as_f64());
            assert!(
                tm.is_some_and(|x| x.is_finite() && x >= 0.0),
                "mechanism self-check produced no usable total_ms: {line}"
            );
            say!(
                "mechanism self-check OK — a child trial round-trips through the file channel, \
                 parses as JSON (serde_json, not a substring check), and read_bytes_query = {} > 0",
                rb.unwrap()
            );
        }
        Err(e) => panic!("the trial mechanism does not work at all: {e}"),
    }

    // ---- the opening settle, then the first canary ---------------------------------------------
    say!("settling {SETTLE_OPENING} s before the first canary");
    std::thread::sleep(Duration::from_secs(SETTLE_OPENING));
    let mut canaries = vec![Canary::take("setup-end")];

    // ---- the trial loop ---------------------------------------------------------------------------
    let all = cells();
    assert_eq!(all.len(), 36, "expected the full 3-order x 3-granularity x 4-viewport matrix");
    say!("{} cells x n={N} = {} trials; interleaving: interleaved(len, r) = (i + 5r) mod len", all.len(), all.len() * N);

    let mut trials: Vec<(usize, Cell, serde_json::Value)> = Vec::new();
    for r in 0..N {
        std::thread::sleep(Duration::from_secs(SETTLE_CANARY));
        canaries.push(Canary::take(&format!("rep-{r}-start")));
        for i in interleaved(all.len(), r) {
            let cell = all[i];
            match spawn_trial(&exe, &cell, &slot) {
                Ok(line) => {
                    let v: serde_json::Value = serde_json::from_str(&line).unwrap_or_else(|e| {
                        serde_json::json!({
                            "cell": cell.label(),
                            "error": format!("driver could not parse child JSON: {e}: {line}"),
                        })
                    });
                    trials.push((r, cell, v));
                }
                Err(e) => {
                    say!("UNMEASURED — trial {} rep {r}: {e}", cell.label());
                    trials.push((r, cell, serde_json::json!({"cell": cell.label(), "error": e})));
                }
            }
        }
    }
    std::thread::sleep(Duration::from_secs(SETTLE_CANARY));
    canaries.push(Canary::take("pass-end"));

    let spreads = phase_spreads(&canaries);
    for (label, spread, ok) in &spreads {
        say!("canary {label}: spread {:.1}% {}", spread * 100.0, if *ok { "OK" } else { "OVER" });
    }

    // ---- re-hash the fixtures after the last trial ---------------------------------------------
    let mut any_fixture_changed = false;
    let mut fixture_json: Vec<serde_json::Value> = Vec::new();
    for (order, g, bytes_before, hash_before) in &fixture_facts {
        let path = fixture_path(*order, *g);
        let (bytes_after, hash_after) = file_facts(&path);
        if hash_after != *hash_before {
            any_fixture_changed = true;
            say!(
                "INVALIDATED — {} @ g{g} changed during the pass: {hash_before} -> {hash_after}",
                order.as_str()
            );
        }
        fixture_json.push(serde_json::json!({
            "order": order.as_str(), "granularity": g, "path": path.display().to_string(),
            "bytes_before": bytes_before, "sha256_before": hash_before,
            "bytes_after": bytes_after, "sha256_after": hash_after,
        }));
    }

    let free_after = free_bytes_on_c().unwrap_or(0);
    say!("free disk after: {:.2} GiB ({free_after} B)", free_after as f64 / (1u64 << 30) as f64);

    // ---- per-cell summaries ----------------------------------------------------------------------
    let field_u64 = |order: ClusterOrder, g: usize, view: ViewId, field: &str| -> Vec<Option<u64>> {
        let mut byrep: Vec<Option<u64>> = vec![None; N];
        for (r, c, v) in &trials {
            if c.order == order && c.granularity == g && c.view == view {
                byrep[*r] = v.get(field).and_then(|x| x.as_u64());
            }
        }
        byrep
    };
    let field_f64 = |order: ClusterOrder, g: usize, view: ViewId, field: &str| -> Vec<Option<f64>> {
        let mut byrep: Vec<Option<f64>> = vec![None; N];
        for (r, c, v) in &trials {
            if c.order == order && c.granularity == g && c.view == view {
                byrep[*r] = v.get(field).and_then(|x| x.as_f64());
            }
        }
        byrep
    };
    let cell_errors = |order: ClusterOrder, g: usize, view: ViewId| -> Vec<String> {
        trials
            .iter()
            .filter(|(_, c, _)| c.order == order && c.granularity == g && c.view == view)
            .filter_map(|(_, _, v)| v.get("error").and_then(|e| e.as_str()).map(|s| s.to_string()))
            .collect()
    };

    let mut cell_summaries: Vec<CellSummary> = Vec::new();
    for &g in &GRANULARITIES {
        for &order in &ORDERS {
            for &view in &ViewId::ALL {
                let rb = field_u64(order, g, view, "read_bytes_query");
                let errs = cell_errors(order, g, view);
                let (status, value, distinct_count) = if !errs.is_empty()
                    || rb.iter().any(|v| v.is_none())
                {
                    (
                        "unmeasured — one or more of the 7 trials errored or returned no read-byte \
                         count"
                            .to_string(),
                        None,
                        0usize,
                    )
                } else {
                    let vals: Vec<u64> = rb.iter().map(|v| v.unwrap()).collect();
                    let distinct: BTreeSet<u64> = vals.iter().copied().collect();
                    if distinct.len() != 1 {
                        (
                            format!(
                                "unmeasured — read counter non-deterministic ({} distinct values: \
                                 {distinct:?})",
                                distinct.len()
                            ),
                            None,
                            distinct.len(),
                        )
                    } else {
                        ("measured".to_string(), Some(vals[0]), 1usize)
                    }
                };
                let file_bytes = file_bytes_of(order, g);
                let read_fraction = value.map(|v| v as f64 / file_bytes as f64);

                let tm = field_f64(order, g, view, "total_ms");
                let tm_ok: Vec<f64> = tm.iter().flatten().copied().collect();
                let total_ms_p50 =
                    if tm_ok.len() == N { Some(pct(&sorted(&tm_ok), 0.5)) } else { None };

                let fb = field_f64(order, g, view, "first_batch_ms");

                let rows = field_u64(order, g, view, "rows");
                let predicted = predicted_rows(view);
                let rows_match_predicted =
                    !rows.is_empty() && rows.iter().all(|r| r.map(|x| x == predicted).unwrap_or(false));

                cell_summaries.push(CellSummary {
                    order,
                    granularity: g,
                    view,
                    file_bytes,
                    read_bytes_status: status,
                    read_bytes: value,
                    distinct_read_bytes_count: distinct_count,
                    read_fraction,
                    total_ms_p50,
                    total_ms_samples: tm_ok,
                    first_batch_ms_samples: fb,
                    rows_match_predicted,
                    errors: errs,
                });
            }
        }
    }
    assert_eq!(cell_summaries.len(), 36, "expected one summary per cell");

    let find_cell = |order: ClusterOrder, g: usize, view: ViewId| -> &CellSummary {
        cell_summaries
            .iter()
            .find(|c| c.order == order && c.granularity == g && c.view == view)
            .expect("every (order, granularity, viewport) cell was summarised above")
    };

    // ---- scoring: does H read <= 70% of C at the near quarter, at every granularity, all 7 trials
    let mut h_le_70pct = Vec::new();
    for &g in &GRANULARITIES {
        let c = find_cell(ClusterOrder::SourceIdentity, g, ViewId::NearQuarter);
        let h = find_cell(ClusterOrder::Hilbert16, g, ViewId::NearQuarter);
        let c_rep = field_u64(ClusterOrder::SourceIdentity, g, ViewId::NearQuarter, "read_bytes_query");
        let h_rep = field_u64(ClusterOrder::Hilbert16, g, ViewId::NearQuarter, "read_bytes_query");
        let per_rep_ratio: Vec<Option<f64>> = c_rep
            .iter()
            .zip(h_rep.iter())
            .map(|(cv, hv)| match (cv, hv) {
                (Some(cv), Some(hv)) if *cv > 0 => Some(*hv as f64 / *cv as f64),
                _ => None,
            })
            .collect();
        let verdict = if per_rep_ratio.iter().any(|r| r.is_none()) {
            "UNMEASURED"
        } else if per_rep_ratio.iter().all(|r| r.unwrap() <= 0.70) {
            "PASS"
        } else {
            "FAIL"
        };
        say!(
            "h_le_70pct g{g}: C={:?} H={:?} per-rep ratios={:?} -> {verdict}",
            c.read_bytes, h.read_bytes, per_rep_ratio
        );
        h_le_70pct.push(serde_json::json!({
            "granularity": g, "c_read_bytes": c.read_bytes, "h_read_bytes": h.read_bytes,
            "per_rep_ratio": per_rep_ratio, "verdict": verdict,
        }));
    }

    // ---- scoring: prediction 1 — R >= 95% at every viewport, 145 MB -----------------------------
    let mut pred1 = Vec::new();
    let mut pred1_all_meet = true;
    let mut pred1_any_unmeasured = false;
    for &g in &GRANULARITIES {
        for &view in &ViewId::ALL {
            let r = find_cell(ClusterOrder::Shuffled, g, view);
            let verdict = match r.read_fraction {
                Some(f) if f >= 0.95 => "MEETS",
                Some(_) => {
                    pred1_all_meet = false;
                    "BELOW"
                }
                None => {
                    pred1_any_unmeasured = true;
                    "UNMEASURED"
                }
            };
            pred1.push(serde_json::json!({
                "granularity": g, "viewport": view.as_str(), "r_read_bytes": r.read_bytes,
                "file_bytes": r.file_bytes, "fraction": r.read_fraction, "verdict": verdict,
            }));
        }
    }
    let pred1_verdict = if pred1_any_unmeasured {
        "UNMEASURED"
    } else if pred1_all_meet {
        "CONFIRMED"
    } else {
        "FAILED"
    };
    say!("prediction 1 (R >= 95% at every viewport, 145 MB): {pred1_verdict}");

    // ---- scoring: prediction 3 — the near-quarter crossover does not reverse 13 -> 49 groups -----
    let c13 = find_cell(ClusterOrder::SourceIdentity, 8192, ViewId::NearQuarter);
    let h13 = find_cell(ClusterOrder::Hilbert16, 8192, ViewId::NearQuarter);
    let c49 = find_cell(ClusterOrder::SourceIdentity, 2048, ViewId::NearQuarter);
    let h49 = find_cell(ClusterOrder::Hilbert16, 2048, ViewId::NearQuarter);
    let sign = |c: &CellSummary, h: &CellSummary| -> Option<i64> {
        match (c.read_bytes, h.read_bytes) {
            (Some(cv), Some(hv)) => Some((hv as i64 - cv as i64).signum()),
            _ => None,
        }
    };
    let s13 = sign(c13, h13);
    let s49 = sign(c49, h49);
    let pred3_verdict = match (s13, s49) {
        (Some(a), Some(b)) if a == b => "CONFIRMED — sign unchanged (13 -> 49 groups)",
        (Some(_), Some(_)) => "FAILED — sign reversed (13 -> 49 groups)",
        _ => "UNMEASURED",
    };
    say!(
        "prediction 3 (quarter crossover, 13 vs 49 groups): g8192 C={:?} H={:?} (sign {s13:?}); \
         g2048 C={:?} H={:?} (sign {s49:?}) -> {pred3_verdict}",
        c13.read_bytes, h13.read_bytes, c49.read_bytes, h49.read_bytes
    );

    // ---- reported, not one of the three required verdicts: whole-file regression, and the
    // total-time pairwise H-vs-C form at the near quarter (the gate's own ≥42/49 shape, at 145 MB) --
    let mut whole_file_check = Vec::new();
    for &g in &GRANULARITIES {
        let c = find_cell(ClusterOrder::SourceIdentity, g, ViewId::Whole);
        let h = find_cell(ClusterOrder::Hilbert16, g, ViewId::Whole);
        let ratio = match (c.read_bytes, h.read_bytes) {
            (Some(cv), Some(hv)) if cv > 0 => Some(hv as f64 / cv as f64),
            _ => None,
        };
        whole_file_check.push(serde_json::json!({
            "granularity": g, "c_whole_read_bytes": c.read_bytes, "h_whole_read_bytes": h.read_bytes,
            "h_over_c_ratio": ratio, "within_100_5pct_ceiling": ratio.map(|r| r <= 1.005),
        }));
    }

    let mut pairwise = Vec::new();
    for &g in &GRANULARITIES {
        let c = find_cell(ClusterOrder::SourceIdentity, g, ViewId::NearQuarter);
        let h = find_cell(ClusterOrder::Hilbert16, g, ViewId::NearQuarter);
        let (wins, of) = if c.total_ms_samples.len() == N && h.total_ms_samples.len() == N {
            let mut w = 0usize;
            let mut o = 0usize;
            for &hv in &h.total_ms_samples {
                for &cv in &c.total_ms_samples {
                    o += 1;
                    if hv < cv {
                        w += 1;
                    }
                }
            }
            (Some(w), Some(o))
        } else {
            (None, None)
        };
        pairwise.push(serde_json::json!({
            "granularity": g, "h_p50_ms": h.total_ms_p50, "c_p50_ms": c.total_ms_p50,
            "p50_lower": match (h.total_ms_p50, c.total_ms_p50) {
                (Some(hp), Some(cp)) => Some(hp < cp), _ => None,
            },
            "pairwise_h_faster_of_49": wins, "pairwise_of": of,
            "meets_gate_form_42_of_49": wins.map(|w| w >= 42),
        }));
    }

    // ---- the artifact -----------------------------------------------------------------------------
    let artifact = serde_json::json!({
        "preregistration": "kernel/IMPORT-LAYOUT-PREREGISTRATION.md",
        "phase": 4,
        "scope": "the 145 MB factorial — reported at this class; the 5 GB class is scored separately \
                  and gates the cut (preregistration §4)",
        "hardware": hardware_profile(),
        "media": media_type(),
        "harness_binary_sha256_at_time_of_use": exe_hash,
        "harness_binary_bytes_at_time_of_use": exe_bytes,
        "interleaving_function": "interleaved(len, r) = (i + 5r) mod len for i in 0..len; committed, \
                                   pure; restated from kernel/tests/first_batch_factorial.rs::interleaved",
        "payload_retention": "never retained on any cell — buf.clear() after every batch, uniformly; \
                               row-identity correctness is phase 3's job, not this phase's",
        "warm_cache_convention": "no active warm-up step; no cache-purge mechanism; the nine fixtures \
                                   were already read repeatedly by phases 2 and 3 in this tree — the \
                                   same passive convention kernel/RESULTS.md's seventh section records",
        "settle_opening_s": SETTLE_OPENING,
        "settle_canary_s": SETTLE_CANARY,
        "trial_ceiling_s": CEIL_TRIAL.as_secs(),
        "n_per_cell": N,
        "free_disk_before_bytes": free_before,
        "free_disk_after_bytes": free_after,
        "fixtures": fixture_json,
        "any_fixture_changed_during_pass": any_fixture_changed,
        "predicted_rows": predicted,
        "canaries": canaries.iter().map(|c| serde_json::from_str::<serde_json::Value>(&c.json())
            .expect("Canary::json() is always valid JSON")).collect::<Vec<_>>(),
        "canary_spreads": spreads.iter().map(|(l, s, ok)| serde_json::json!({
            "phase": l, "spread": s, "within": ok,
        })).collect::<Vec<_>>(),
        "trials": trials.iter().map(|(r, c, v)| serde_json::json!({
            "rep": r, "cell": c.label(), "trial": v,
        })).collect::<Vec<_>>(),
        "cells": cell_summaries.iter().map(|c| serde_json::json!({
            "order": c.order.as_str(), "granularity": c.granularity, "viewport": c.view.as_str(),
            "file_bytes": c.file_bytes, "read_bytes_status": c.read_bytes_status,
            "read_bytes": c.read_bytes, "distinct_read_bytes_count": c.distinct_read_bytes_count,
            "read_fraction_vs_whole_file": c.read_fraction,
            "total_ms_p50": c.total_ms_p50, "total_ms_samples": c.total_ms_samples,
            "first_batch_ms_samples": c.first_batch_ms_samples,
            "rows_match_predicted": c.rows_match_predicted, "errors": c.errors,
        })).collect::<Vec<_>>(),
        "scoring": {
            "h_le_70pct_of_c_at_near_quarter": h_le_70pct,
            "prediction_1_r_ge_95pct_every_viewport_145mb": {"cells": pred1, "verdict": pred1_verdict},
            "prediction_3_quarter_crossover_13_to_49_groups": {
                "g8192_13groups": {"c_read_bytes": c13.read_bytes, "h_read_bytes": h13.read_bytes},
                "g2048_49groups": {"c_read_bytes": c49.read_bytes, "h_read_bytes": h49.read_bytes},
                "verdict": pred3_verdict,
            },
            "whole_file_regression_check_145mb_reported_not_gated": whole_file_check,
            "pairwise_h_vs_c_total_ms_near_quarter_145mb_reported_not_gated": pairwise,
        },
    });

    std::fs::write(
        evidence_dir().join("first-factorial-145mb.json"),
        serde_json::to_string_pretty(&artifact).expect("serialize the artifact"),
    )
    .expect("write artifact");
    std::fs::write(logs_dir().join("factorial-145mb.log"), &log).expect("write log");
    println!("→ {}", evidence_dir().join("first-factorial-145mb.json").display());

    assert!(!any_fixture_changed, "a fixture changed during the pass — see the log above");
}
