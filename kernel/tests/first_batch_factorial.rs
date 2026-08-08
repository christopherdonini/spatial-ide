// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! The factorial first-batch/pruning pass — `kernel/FIRST-BATCH-AND-PRUNING-PREREGISTRATION.md`.
//!
//! **The preregistration is the contract and this file implements it.** Where the two disagree the
//! preregistration wins and this file is the defect. Nothing here decides a cell, a ceiling, a
//! sample count or a verdict rule; all of those are in that document, committed at `60d3d57` before
//! this harness existed.
//!
//! ## One process per trial, and why that shape rather than a loop
//!
//! §3: the index and metadata caches are process-wide and path-keyed, so a B2 trial warms a cache a
//! later `ScanOnly` trial cannot un-warm; and `trace::start` refuses a second concurrent trace. A
//! single-process loop would therefore make cell order load-bearing in a way no interleaving can
//! repair. So the driver re-executes **this same test binary** once per trial, with the cell in an
//! environment variable, and the child prints one JSON line.
//!
//! The child is an ordinary `#[test]` that returns immediately unless that variable is set. That is
//! deliberate: it means the child runs the *same binary* the driver was built from, so there is no
//! second build and no way for driver and child to disagree about which code was measured.
//!
//! ## What this harness may not do
//!
//! - **Never amend the preregistration.** This runs unattended. A phase that cannot run as declared
//!   records `unmeasured — <reason>` and the run proceeds (§0's unattended rule).
//! - **Never re-run a phase whose watchdog fired.** The row stays `unmeasured`.
//! - **Never promote an off-declaration trial into a cell's statistics.** A trial whose observed
//!   `filter_plan` or cut policy is not the cell's declaration is an *observation*, not a sample.

mod support;

use std::io::Write;
use std::path::{Path, PathBuf};
use std::process::Command;
use std::time::{Duration, Instant};

use spatial_engine::fixture::{write_geoparquet, FixtureSpec, LicenseMode};
use spatial_engine::layout::{write_clustered_variant, ClusterOrder, DeclaredExtent, VariantSpec};
use spatial_engine::stream::FilterPlan;
use spatial_engine::{Bbox, CancelToken, Dataset, ViewportQuery};
use support::*;

// ---- §2: the fixtures, exactly as preregistered --------------------------------------------------

const FEATURES: usize = 100_000;
const AVG_VERTICES: usize = 100;
const HOLE_EVERY: usize = 7;
const SEED: u64 = 0x5EED_2056_0000_0007;
const CHUNK: usize = 8_192;
/// A multiple of DuckDB's 2 048-row vector size. `write_clustered_variant` refuses anything else,
/// and that refusal stops the B1 phase rather than being worked around (§2).
const ROW_GROUP_ROWS: usize = 8_192;

/// The generator's grid, restated from `fixture::parcel`'s private locals. The row-count assertions
/// below are what catch a generator change; these constants alone would move silently.
const CELL_M: f64 = 40.0;
const E_LO: f64 = 2_600_000.0;
const N_LO: f64 = 1_200_000.0;

// ---- §3: sample counts ---------------------------------------------------------------------------

const N: usize = 7;
/// Traced twins at the two gate viewports.
const N_TRACED_GATE: usize = 7;
/// Traced twins elsewhere — **not verdict-bearing**, and labelled so in the artifact.
const N_TRACED_OTHER: usize = 3;

// ---- §7: declared ceilings, before measuring -----------------------------------------------------

const CEIL_GENERATE: Duration = Duration::from_secs(600);
const CEIL_REWRITE: Duration = Duration::from_secs(900);
const CEIL_TRIAL: Duration = Duration::from_secs(120);
const SILENCE_GENERATE: Duration = Duration::from_secs(120);
const SETTLE_OPENING: u64 = 120;
const SETTLE_CANARY: u64 = 60;

/// Payload above which the child hashes inside the timed loop instead of after it.
///
/// **Declared, and it changes what a total time means.** Below the ceiling the wire bytes are
/// retained and hashed once the timer has stopped, so the total is the stream's. Above it the hash
/// runs inside the loop and the total includes it — which is fine only because *every* cell above
/// the ceiling does the same thing, so cells above it stay comparable with each other and are never
/// compared with cells below it.
const RETAIN_PAYLOAD_CEILING: usize = 256 * 1024 * 1024;

fn evidence_dir() -> PathBuf {
    let d = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .parent()
        .unwrap()
        .join("target/slice-evidence/first-batch");
    std::fs::create_dir_all(&d).unwrap();
    d
}

fn spec_s() -> FixtureSpec {
    FixtureSpec {
        features: FEATURES,
        avg_vertices: AVG_VERTICES,
        hole_every: HOLE_EVERY,
        seed: SEED,
        chunk: CHUNK,
        row_group_rows: ROW_GROUP_ROWS,
        license: LicenseMode::DeclaredBySource,
        ..Default::default()
    }
}

fn grid_cols() -> f64 {
    (FEATURES as f64).sqrt().ceil()
}

/// An edge on a cell **centre** (`scale_pass.rs::viewport_edge`'s recorded correction), so inclusion
/// is pure arithmetic and cannot depend on per-feature vertex jitter.
fn edge(divisor: usize) -> f64 {
    ((grid_cols() as usize / divisor) as f64) * CELL_M + CELL_M / 2.0
}

// ---- the cell space (§3) -------------------------------------------------------------------------

#[derive(Clone, Copy, PartialEq, Eq, Debug)]
enum FileId {
    /// arrow-rs, raster order — the source fixture.
    S,
    /// DuckDB writer, raster order — **the writer control**.
    C,
    /// DuckDB writer, Hilbert order — the layout candidate.
    H,
}

impl FileId {
    fn as_str(self) -> &'static str {
        match self {
            Self::S => "S-arrow-raster",
            Self::C => "C-duckdb-raster",
            Self::H => "H-duckdb-hilbert16",
        }
    }
    fn path(self) -> PathBuf {
        evidence_dir().join(match self {
            Self::S => "parcels-145mb.parquet",
            Self::C => "parcels-145mb-duckdb-raster.parquet",
            Self::H => "parcels-145mb-duckdb-hilbert16.parquet",
        })
    }
}

#[derive(Clone, Copy, PartialEq, Eq, Debug)]
enum PlanId {
    ScanOnly,
    RowGroups,
}

#[derive(Clone, Copy, PartialEq, Eq, Debug)]
enum BatchId {
    SizeOnly,
    Budgeted,
}

#[derive(Clone, Copy, PartialEq, Eq, Debug)]
enum ViewId {
    Whole,
    NearQuarter,
    FarQuarter,
    Sixty4th,
}

impl ViewId {
    fn as_str(self) -> &'static str {
        match self {
            Self::Whole => "whole",
            Self::NearQuarter => "near-quarter",
            Self::FarQuarter => "far-quarter",
            Self::Sixty4th => "1-64",
        }
    }
    fn bbox(self) -> Option<Bbox> {
        let top = N_LO + (grid_cols() - 1.0) * CELL_M + CELL_M / 2.0;
        match self {
            Self::Whole => None,
            Self::NearQuarter => Some(Bbox {
                xmin: E_LO,
                ymin: N_LO,
                xmax: E_LO + edge(2),
                ymax: N_LO + edge(2),
            }),
            // Same x band, y band at the **top** — the only viewport in which row-group elimination
            // can reach time-to-first-batch on a raster-ordered file (§3).
            Self::FarQuarter => Some(Bbox {
                xmin: E_LO,
                ymin: top - edge(2),
                xmax: E_LO + edge(2),
                ymax: top,
            }),
            Self::Sixty4th => Some(Bbox {
                xmin: E_LO,
                ymin: N_LO,
                xmax: E_LO + edge(8),
                ymax: N_LO + edge(8),
            }),
        }
    }
    /// Whether this viewport is a **gate** viewport, which decides its traced twin's n (§5).
    fn is_gate(self) -> bool {
        matches!(self, Self::NearQuarter | Self::FarQuarter)
    }
}

#[derive(Clone, Copy, Debug)]
struct Cell {
    file: FileId,
    plan: PlanId,
    batch: BatchId,
    view: ViewId,
    traced: bool,
}

impl Cell {
    fn label(&self) -> String {
        format!(
            "{}|{}|{}|{}|{}",
            self.file.as_str(),
            match self.plan {
                PlanId::ScanOnly => "scan-only",
                PlanId::RowGroups => "row-groups",
            },
            match self.batch {
                BatchId::SizeOnly => "size-only",
                BatchId::Budgeted => "budgeted",
            },
            self.view.as_str(),
            if self.traced { "traced" } else { "untraced" }
        )
    }
    fn n(&self) -> usize {
        if !self.traced {
            N
        } else if self.view.is_gate() {
            N_TRACED_GATE
        } else {
            N_TRACED_OTHER
        }
    }
    fn parse(s: &str) -> Option<Self> {
        let p: Vec<&str> = s.split('|').collect();
        if p.len() != 5 {
            return None;
        }
        Some(Self {
            file: match p[0] {
                "S-arrow-raster" => FileId::S,
                "C-duckdb-raster" => FileId::C,
                "H-duckdb-hilbert16" => FileId::H,
                _ => return None,
            },
            plan: match p[1] {
                "scan-only" => PlanId::ScanOnly,
                "row-groups" => PlanId::RowGroups,
                _ => return None,
            },
            batch: match p[2] {
                "size-only" => BatchId::SizeOnly,
                "budgeted" => BatchId::Budgeted,
                _ => return None,
            },
            view: match p[3] {
                "whole" => ViewId::Whole,
                "near-quarter" => ViewId::NearQuarter,
                "far-quarter" => ViewId::FarQuarter,
                "1-64" => ViewId::Sixty4th,
                _ => return None,
            },
            traced: p[4] == "traced",
        })
    }
}

/// The cell list, **generated by a pure function and committed** — §3 forbids a runtime shuffle,
/// which is not reproducible.
fn cells() -> Vec<Cell> {
    let mut out = Vec::new();
    for traced in [false, true] {
        for &batch in &[BatchId::SizeOnly, BatchId::Budgeted] {
            for &view in &[ViewId::Whole, ViewId::NearQuarter, ViewId::FarQuarter, ViewId::Sixty4th]
            {
                // ScanOnly on all three files: S and H are the layout arms, C is the writer control.
                for &file in &[FileId::S, FileId::C, FileId::H] {
                    out.push(Cell { file, plan: PlanId::ScanOnly, batch, view, traced });
                }
                // RowGroups on S only. §3's declared exclusions: H refuses structurally, and C is a
                // writer control rather than a lever.
                out.push(Cell { file: FileId::S, plan: PlanId::RowGroups, batch, view, traced });
            }
        }
    }
    out
}

/// §3's interleave: repetition `r` runs cell `cells[(i + 5r) mod N]`. `gcd(5, len)` is 1 for this
/// list, so every repetition is a full permutation.
fn interleaved(len: usize, r: usize) -> Vec<usize> {
    (0..len).map(|i| (i + 5 * r) % len).collect()
}

// ---- the child: exactly one trial, one JSON line -------------------------------------------------

const CELL_VAR: &str = "SPATIAL_NIGHT_CELL";

#[test]
fn night_trial_child() {
    let Ok(spec) = std::env::var(CELL_VAR) else {
        // The ordinary suite runs this and it does nothing. The driver is `#[ignore]`d.
        return;
    };
    let cell = Cell::parse(&spec).expect("the driver passed an unparseable cell");
    let json = run_one_trial(&cell);
    // One line, on stdout, with a sentinel the driver greps for — so cargo's own noise cannot be
    // mistaken for a measurement.
    println!("@@TRIAL@@{json}");
    std::io::stdout().flush().ok();
}

fn run_one_trial(cell: &Cell) -> String {
    let path = cell.file.path();
    let io_before = io_read_bytes();
    let open_started = Instant::now();
    let ds = match Dataset::open(&path) {
        Ok(d) => d,
        // Every early return carries the cell, or a failed trial is unattributable in the artifact.
        Err(e) => return trial_error(cell, "open", &e.to_string()),
    };
    let open_ms = open_started.elapsed().as_secs_f64() * 1000.0;

    // §4: build cost is its own number and is never netted into a query time.
    let mut index_build_ms = 0.0;
    let mut index_admissible = String::from("n/a");
    let mut row_groups = 0usize;
    if cell.plan == PlanId::RowGroups {
        let t = Instant::now();
        match ds.build_row_group_index(&CancelToken::new()) {
            Ok(r) => {
                index_build_ms = t.elapsed().as_secs_f64() * 1000.0;
                row_groups = r.row_groups;
                index_admissible = match r.admissible {
                    Ok(()) => "admissible".to_string(),
                    Err(reason) => reason.as_str().to_string(),
                };
            }
            Err(e) => return trial_error(cell, "index build", &e.to_string()),
        }
    }

    let q = match cell.view.bbox() {
        None => ViewportQuery::all(),
        Some(b) => ViewportQuery::viewport(b, ds.crs().identifier()),
    };

    // **`flatten`, not a nested `Option`.** `trace::start` returns `None` when a trace is already
    // running; one process per trial makes that impossible here, but a nested `Option` would have
    // let "tracing refused" read as "tracing on" at the call site below.
    let _trace_guard = cell
        .traced
        .then(|| {
            spatial_engine::trace::start(spatial_engine::trace::TraceKey {
                label: cell.label(),
                ..Default::default()
            })
        })
        .flatten();

    let cancel = CancelToken::new();
    let stream = match (cell.plan, cell.batch) {
        (PlanId::ScanOnly, BatchId::SizeOnly) => ds.stream_with_cancel(&q, cancel),
        (PlanId::ScanOnly, BatchId::Budgeted) => ds.stream_budgeted_experimental(&q, cancel),
        (PlanId::RowGroups, BatchId::SizeOnly) => {
            ds.stream_rowgroup_pruned_experimental(&q, cancel)
        }
        (PlanId::RowGroups, BatchId::Budgeted) => {
            ds.stream_rowgroup_pruned_budgeted_experimental(&q, cancel)
        }
    };
    let mut stream = match stream {
        Ok(s) => s,
        Err(e) => return trial_error(cell, "stream", &e.to_string()),
    };
    let filter_plan = plan_json(stream.filter_plan());
    let cut_policy = stream.size_policy().cut.as_str().to_string();

    // The timed loop. Nothing but `next_into` and three counters is inside it.
    //
    // **The retain decision is taken from the source file's size, so it is uniform across every
    // cell of one file.** Per-viewport or per-payload retention would put the fold inside the loop
    // for some cells of a file and outside it for others, and those cells could then not be
    // compared with each other — which is the one comparison that matters. See
    // `RETAIN_PAYLOAD_CEILING`.
    let retain = std::fs::metadata(&path)
        .map(|m| (m.len() as usize) <= RETAIN_PAYLOAD_CEILING)
        .unwrap_or(false);
    let started = Instant::now();
    let mut first_batch_ms = f64::NAN;
    let mut rows = 0u64;
    let mut payload = 0usize;
    let mut cuts: Vec<&'static str> = Vec::new();
    let mut buf: Vec<u8> = Vec::new();
    let mut fold = WireFold::new();
    let mut err: Option<String> = None;
    while let Some(info) = stream.next_into(&mut buf) {
        match info {
            Ok(i) => {
                if first_batch_ms.is_nan() {
                    first_batch_ms = started.elapsed().as_secs_f64() * 1000.0;
                }
                rows += i.rows as u64;
                payload += i.payload_bytes;
                cuts.push(i.cut_by.as_str());
                if !retain {
                    fold.update(&buf);
                    buf.clear();
                }
            }
            Err(e) => {
                err = Some(e.to_string());
                break;
            }
        }
    }
    let total_ms = started.elapsed().as_secs_f64() * 1000.0;
    let io_after = io_read_bytes();
    if retain {
        fold.update(&buf);
    }
    let wire_fold = fold.finish();

    let mut counts = std::collections::BTreeMap::<&str, usize>::new();
    for c in &cuts {
        *counts.entry(*c).or_default() += 1;
    }
    let cut_json = counts
        .iter()
        .map(|(k, v)| format!("\"{k}\":{v}"))
        .collect::<Vec<_>>()
        .join(",");

    let trace_json = _trace_guard
        .as_ref()
        .map(|g| {
            let t = g.trace();
            // §5: **exactly** `query` and `source_to_first_batch` are derivable from a trace that
            // dropped anything, and `dropped_records` prints beside every trace-derived number.
            format!(
                "{{\"dropped\":{},\"query_ms\":{},\"source_to_first_batch_ms\":{}}}",
                t.dropped(),
                opt_f64(t.segment_ms(
                    spatial_engine::trace::SQL_PREPARED,
                    spatial_engine::trace::FIRST_SOURCE_ROW
                )),
                opt_f64(t.segment_ms(
                    spatial_engine::trace::FIRST_SOURCE_ROW,
                    spatial_engine::trace::FIRST_BATCH_FULL
                )),
            )
        })
        .unwrap_or_else(|| "null".to_string());

    format!(
        "{{\"cell\":\"{}\",\"open_ms\":{:.3},\"index_build_ms\":{:.3},\"index_admissible\":\"{}\",\
         \"row_groups\":{},\"filter_plan\":{},\"cut_policy\":\"{}\",\"first_batch_ms\":{},\
         \"total_ms\":{:.3},\"rows\":{},\"payload_bytes\":{},\"wire_fold\":\"{}\",\
         \"read_bytes\":{},\"cuts\":{{{}}},\"retained_payload\":{},\"trace\":{},\"error\":{}}}",
        cell.label(),
        open_ms,
        index_build_ms,
        index_admissible,
        row_groups,
        filter_plan,
        cut_policy,
        opt_f64(if first_batch_ms.is_nan() { None } else { Some(first_batch_ms) }),
        total_ms,
        rows,
        payload,
        wire_fold,
        opt_u64(io_after.zip(io_before).map(|(a, b)| a.saturating_sub(b))),
        cut_json,
        retain,
        trace_json,
        err.map(|e| format!("\"{}\"", json_escape(&e))).unwrap_or_else(|| "null".into()),
    )
}

/// A failed trial, carrying its cell — so an error in the artifact names which cell produced it
/// rather than being an anonymous row a reader has to place by position.
fn trial_error(cell: &Cell, phase: &str, detail: &str) -> String {
    format!(
        "{{\"cell\":\"{}\",\"error\":\"{}: {}\"}}",
        cell.label(),
        phase,
        json_escape(detail)
    )
}

fn plan_json(p: FilterPlan) -> String {
    let extra = match p {
        FilterPlan::RowGroupsPruned { total, kept, ranges } => {
            format!(",\"total\":{total},\"kept\":{kept},\"ranges\":{ranges}")
        }
        FilterPlan::RowGroupsKeptAll { total } | FilterPlan::RowGroupsExcludeAll { total } => {
            format!(",\"total\":{total}")
        }
        FilterPlan::RowGroupsNotPrunable { total, reason } => {
            format!(",\"total\":{total},\"reason\":\"{}\"", reason.as_str())
        }
        FilterPlan::RowGroupsTooFragmented { total, kept } => {
            format!(",\"total\":{total},\"kept\":{kept}")
        }
        _ => String::new(),
    };
    format!(
        "{{\"name\":\"{}\",\"claims_io_exclusion\":{}{}}}",
        p.as_str(),
        p.claims_io_exclusion(),
        extra
    )
}

// ---- §4: the read-volume instrument --------------------------------------------------------------

/// Process read bytes, or `None` where the instrument does not exist.
///
/// **A bare `extern "system"` against kernel32, which `std` already links** — zero new dependencies,
/// which is what `NIGHT-CUT.md`'s metered-safe constraint asked for. Its three declared limits are
/// in the preregistration §4: Windows-only, *logical* rather than physical IO, and whole-process
/// (which is why the harness runs one query per process).
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

// ---- the within-cell wire fold -------------------------------------------------------------------

/// A running fold over a stream's wire bytes.
///
/// **FNV-1a/64, and it is named for what it is rather than for what a reader might assume.** It is
/// **not** a cryptographic hash and no property of one is claimed for it. Its only job is the one
/// §6 gives it: detect that two trials of the same cell produced *different* wire bytes, where the
/// alternative is retaining and comparing hundreds of megabytes per trial. For that job a 64-bit
/// non-cryptographic fold is sufficient — the inputs are not adversarial, they are two runs of the
/// same query on the same file — and it costs the harness no dependency the kernel does not have,
/// which is what this cut's metered-safe constraint asked for.
///
/// A **match** is therefore strong evidence the bytes agree; it is not a proof. A **mismatch** is
/// conclusive, and a mismatch is what the check exists to catch.
struct WireFold(u64);

impl WireFold {
    fn new() -> Self {
        Self(0xcbf2_9ce4_8422_2325)
    }
    /// Folds each chunk immediately, so the harness never holds a second copy of the payload.
    fn update(&mut self, bytes: &[u8]) {
        let mut h = self.0;
        for b in bytes {
            h ^= *b as u64;
            h = h.wrapping_mul(0x100_0000_01b3);
        }
        self.0 = h;
    }
    fn finish(&self) -> String {
        format!("fnv1a64:{:016x}", self.0)
    }
}

fn opt_f64(v: Option<f64>) -> String {
    v.map(|x| format!("{x:.3}")).unwrap_or_else(|| "null".into())
}
fn opt_u64(v: Option<u64>) -> String {
    v.map(|x| x.to_string()).unwrap_or_else(|| "null".into())
}

// ---- the driver ---------------------------------------------------------------------------------

#[test]
#[ignore = "measurement pass; run explicitly with --release"]
fn the_factorial_first_batch_pass() {
    refuse_debug("first_batch_factorial");
    require_disk("first-batch-setup");

    let out_dir = evidence_dir();
    let mut log = String::new();
    macro_rules! say {
        ($($a:tt)*) => {{ let s = format!($($a)*); println!("{s}"); log.push_str(&s); log.push('\n'); }};
    }

    say!("hardware: {}", hardware_profile());
    say!("media: {}", media_type());

    // ---- §2: the three fixtures -------------------------------------------------------------
    let mut fixture_json = Vec::new();
    let s_path = FileId::S.path();
    if !s_path.exists() {
        let cancel = CancelToken::new();
        let dog = Watchdog::start("generate-S", CEIL_GENERATE, Some(SILENCE_GENERATE), cancel.clone());
        let facts = write_geoparquet(&s_path, &spec_s()).expect("generate S");
        dog.finish();
        say!("generated S: {} features, {} bytes", facts.features, facts.bytes);
    }
    let extent = DeclaredExtent {
        xmin: E_LO,
        ymin: N_LO,
        xmax: E_LO + grid_cols() * CELL_M,
        ymax: N_LO + grid_cols() * CELL_M,
    };
    for (id, order) in [(FileId::C, ClusterOrder::SourceIdentity), (FileId::H, ClusterOrder::Hilbert16)]
    {
        let p = id.path();
        if p.exists() {
            continue;
        }
        let cancel = CancelToken::new();
        let dog = Watchdog::start("rewrite", CEIL_REWRITE, None, cancel.clone());
        let spec = VariantSpec {
            order,
            extent,
            row_group_rows: ROW_GROUP_ROWS,
            id_column: "id".into(),
        };
        match write_clustered_variant(&s_path, &p, &spec, &cancel) {
            Ok(f) => {
                dog.finish();
                say!(
                    "wrote {}: {} features, {} bytes, {} row groups, {} clamped, {:.0} ms",
                    id.as_str(),
                    f.features,
                    f.bytes,
                    f.row_groups,
                    f.clamped_features,
                    f.elapsed_millis
                );
            }
            Err(e) => {
                dog.finish();
                // §0: record and proceed. A layout refusal stops the B1 arm; it is not worked around.
                say!("UNMEASURED — rewrite {} refused: {e}", id.as_str());
            }
        }
    }
    for id in [FileId::S, FileId::C, FileId::H] {
        let p = id.path();
        let (bytes, hash) = file_facts(&p);
        // Row groups and B2-admissibility come from the engine's own index build rather than from a
        // second DuckDB connection opened here: the kernel has no `duckdb` dependency and acquiring
        // one to count row groups would breach this cut's metered-safe constraint for a fact the
        // engine already reports.
        let (row_groups, admissible) = match Dataset::open(&p) {
            Ok(ds) => match ds.build_row_group_index(&CancelToken::new()) {
                Ok(r) => (
                    r.row_groups,
                    match r.admissible {
                        Ok(()) => "admissible".to_string(),
                        Err(reason) => reason.as_str().to_string(),
                    },
                ),
                Err(e) => (0, format!("build failed: {e}")),
            },
            Err(e) => (0, format!("open failed: {e}")),
        };
        fixture_json.push(format!(
            "{{\"id\":\"{}\",\"path\":\"{}\",\"bytes\":{},\"sha256\":\"{}\",\"row_groups\":{},\
             \"b2_admissible\":\"{}\"}}",
            id.as_str(),
            json_escape(&p.display().to_string()),
            bytes,
            hash,
            row_groups,
            json_escape(&admissible),
        ));
        say!(
            "fixture {} — {} bytes, {} row groups, B2 {}, sha256 {}",
            id.as_str(),
            bytes,
            row_groups,
            admissible,
            hash
        );
    }

    // ---- the predicted row counts, asserted (§3) --------------------------------------------
    let mut predicted = Vec::new();
    for v in [ViewId::Whole, ViewId::NearQuarter, ViewId::FarQuarter, ViewId::Sixty4th] {
        let n = reference_rows(&s_path, v);
        predicted.push(format!("{{\"viewport\":\"{}\",\"rows\":{}}}", v.as_str(), n));
        say!("viewport {} selects {} rows", v.as_str(), n);
    }

    // ---- §7: the opening settle, then the first canary ---------------------------------------
    say!("settling {SETTLE_OPENING} s before the first canary");
    std::thread::sleep(Duration::from_secs(SETTLE_OPENING));
    let mut canaries = vec![Canary::take("setup-end")];

    // ---- the trial loop -----------------------------------------------------------------------
    let all = cells();
    say!("{} cells; n = 7 untraced, 7 traced at the gate viewports, 3 elsewhere", all.len());
    let exe = std::env::current_exe().expect("current exe");
    let mut trials: Vec<String> = Vec::new();
    let max_r = all.iter().map(Cell::n).max().unwrap_or(N);

    for r in 0..max_r {
        // A canary per repetition, with the declared 60 s settle before every reading (A1).
        std::thread::sleep(Duration::from_secs(SETTLE_CANARY));
        canaries.push(Canary::take(&format!("rep-{r}-start")));
        for i in interleaved(all.len(), r) {
            let cell = all[i];
            if r >= cell.n() {
                continue;
            }
            match spawn_trial(&exe, &cell) {
                Ok(line) => {
                    trials.push(format!("{{\"rep\":{r},\"trial\":{line}}}"));
                }
                Err(e) => {
                    // Record and proceed — never retry, never wait.
                    say!("UNMEASURED — trial {} rep {r}: {e}", cell.label());
                    trials.push(format!(
                        "{{\"rep\":{r},\"trial\":{{\"cell\":\"{}\",\"error\":\"{}\"}}}}",
                        cell.label(),
                        json_escape(&e)
                    ));
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

    let artifact = format!(
        "{{\"preregistration\":\"kernel/FIRST-BATCH-AND-PRUNING-PREREGISTRATION.md\",\
         \"hardware\":\"{}\",\"media\":\"{}\",\"fixtures\":[{}],\"predicted_rows\":[{}],\
         \"canaries\":[{}],\"canary_spreads\":[{}],\"trials\":[{}]}}",
        json_escape(&hardware_profile()),
        json_escape(&media_type()),
        fixture_json.join(","),
        predicted.join(","),
        canaries.iter().map(|c| c.json()).collect::<Vec<_>>().join(","),
        spreads
            .iter()
            .map(|(l, s, ok)| format!(
                "{{\"phase\":\"{}\",\"spread\":{s:.4},\"within\":{ok}}}",
                json_escape(l)
            ))
            .collect::<Vec<_>>()
            .join(","),
        trials.join(","),
    );
    std::fs::write(out_dir.join("first-batch.json"), artifact).expect("write artifact");
    std::fs::write(out_dir.join("first-batch.log"), log).expect("write log");
    println!("→ {}", out_dir.join("first-batch.json").display());
}

/// One trial, in its own process. Returns the child's JSON line.
fn spawn_trial(exe: &Path, cell: &Cell) -> std::result::Result<String, String> {
    let started = Instant::now();
    let out = Command::new(exe)
        .args(["night_trial_child", "--exact", "--nocapture", "--test-threads=1"])
        .env(CELL_VAR, cell.label())
        .output()
        .map_err(|e| format!("spawn: {e}"))?;
    if started.elapsed() > CEIL_TRIAL {
        return Err(format!("exceeded the declared {} s trial ceiling", CEIL_TRIAL.as_secs()));
    }
    if !out.status.success() {
        return Err(format!("child exited {:?}", out.status.code()));
    }
    String::from_utf8_lossy(&out.stdout)
        .lines()
        .find_map(|l| l.strip_prefix("@@TRIAL@@").map(str::to_string))
        .ok_or_else(|| "child printed no trial line".to_string())
}

/// Rows a viewport selects, taken from the **unindexed scan** rather than from arithmetic — so a
/// generator change is caught by a disagreement rather than propagating silently.
fn reference_rows(path: &Path, v: ViewId) -> u64 {
    let ds = Dataset::open(path).expect("open for reference count");
    let q = match v.bbox() {
        None => ViewportQuery::all(),
        Some(b) => ViewportQuery::viewport(b, ds.crs().identifier()),
    };
    let mut s = ds.stream(&q).expect("reference stream");
    let mut buf = Vec::new();
    let mut rows = 0u64;
    while let Some(i) = s.next_into(&mut buf) {
        rows += i.expect("reference batch").rows as u64;
        buf.clear();
    }
    rows
}

fn file_facts(p: &Path) -> (u64, String) {
    let Ok(md) = std::fs::metadata(p) else { return (0, "absent".into()) };
    let hash = spatial_engine::index::content_hash(p, &CancelToken::new())
        .map(|(h, _)| h)
        .unwrap_or_else(|_| "unreadable".into());
    (md.len(), hash)
}

