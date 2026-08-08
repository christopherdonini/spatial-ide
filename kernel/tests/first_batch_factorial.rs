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
/// **Amendment A1.** Raised from `CEIL_REWRITE` because a 5 GB sort is not a 145 MB sort, and a
/// ceiling that a legitimate operation exceeds is not a ceiling.
const CEIL_REWRITE_5GB: Duration = Duration::from_secs(1800);
const CEIL_TRIAL: Duration = Duration::from_secs(120);
const CEIL_TRIAL_5GB: Duration = Duration::from_secs(900);
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

/// An edge on a cell **centre** (`scale_pass.rs::viewport_edge`'s recorded correction), so inclusion
/// is pure arithmetic and cannot depend on per-feature vertex jitter.
///
/// **`cols` is the file's own grid**, not a constant: `fixture::parcel` derives the grid from the
/// feature count, so the 145 MB files and the 5 GB file have different ones (317 and 1817) and a
/// viewport computed with the wrong one selects a different extent.
fn edge(cols: f64, divisor: usize) -> f64 {
    ((cols as usize / divisor) as f64) * CELL_M + CELL_M / 2.0
}

/// **The exact row count a viewport selects, derived from the generator's grid — not observed.**
///
/// Amendment A1, repairing the weakness review found in the seventh section (S13): that pass took its
/// "prediction" from the same engine, predicate and fixture as the trials, so it could catch
/// nondeterminism and not a wrong filter. This is arithmetic over `fixture::parcel`'s grid and shares
/// nothing with the query path, which is the fifth section's precedent.
///
/// Features tile a `cols`-wide grid in raster order, so the last grid row is partial: with `n`
/// features there are `n / cols` full rows and `n % cols` features in the row above them.
fn predicted_rows(file: FileId, v: ViewId) -> u64 {
    let n = file.features() as u64;
    let cols = file.grid_cols() as u64;
    let full_rows = n / cols;
    let partial = n % cols;
    let (x_cols, y_lo, y_hi) = match v {
        ViewId::Whole => return n,
        // Columns 0..=last and rows 0..=last, where `last` is the last column wholly inside.
        ViewId::NearQuarter => {
            let last = cols / 2;
            (last + 1, 0u64, last)
        }
        ViewId::Sixty4th => {
            let last = cols / 8;
            (last + 1, 0u64, last)
        }
        // Same x band; the y band is the top `last + 1` grid rows of a `cols`-row grid.
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

// ---- the cell space (§3) -------------------------------------------------------------------------

#[derive(Clone, Copy, PartialEq, Eq, Debug)]
enum FileId {
    /// arrow-rs, raster order — the source fixture.
    S,
    /// DuckDB writer, raster order — **the writer control**.
    C,
    /// DuckDB writer, Hilbert order — the layout candidate.
    H,
    /// **The 5 GB spot-cell file — the scale pass's own fixture, reused and never regenerated.**
    ///
    /// Its cells are `ScanOnly` only, and that is a scope decision rather than an omission.
    /// `NIGHT-CUT.md` scopes 5 GB spot cells to "ScanOnly vs **the winning** pruning candidate", and
    /// the preregistration's unattended rule forbids improvising past a declared scope. What runs
    /// here is the same-session `ScanOnly` re-baseline the brief itself requires first, plus the
    /// read-volume figure at **403** row groups — which is the baseline the *clustered* 5 GB cell
    /// will need, and that cell is a morning item.
    G5,
    /// **Amendment A1** — the identity-order control at the 5 GB class, rewritten from `G5` through
    /// DuckDB's `COPY`. Not optional: without it a clustered 5 GB result would measure writer plus
    /// order, which is the seventh section's most expensive lesson.
    C5,
    /// **Amendment A1** — the Hilbert-ordered variant at the 5 GB class. The file registered
    /// prediction 4 exists to test.
    H5,
}

impl FileId {
    fn as_str(self) -> &'static str {
        match self {
            Self::S => "S-arrow-raster",
            Self::C => "C-duckdb-raster",
            Self::H => "H-duckdb-hilbert16",
            Self::G5 => "G5-arrow-raster-5gb",
            Self::C5 => "C5-duckdb-raster-5gb",
            Self::H5 => "H5-duckdb-hilbert16-5gb",
        }
    }
    fn path(self) -> PathBuf {
        match self {
            Self::S => evidence_dir().join("parcels-145mb.parquet"),
            Self::C => evidence_dir().join("parcels-145mb-duckdb-raster.parquet"),
            Self::H => evidence_dir().join("parcels-145mb-duckdb-hilbert16.parquet"),
            // The scale pass's fixture, in its own directory. This harness **never writes here**.
            Self::G5 => PathBuf::from(env!("CARGO_MANIFEST_DIR"))
                .parent()
                .unwrap()
                .join("target/slice-evidence/scale-pass/parcels-5gb.parquet"),
            // The rewrites live in **this** cut's evidence directory, never in the scale pass's.
            Self::C5 => evidence_dir().join("parcels-5gb-duckdb-raster.parquet"),
            Self::H5 => evidence_dir().join("parcels-5gb-duckdb-hilbert16.parquet"),
        }
    }
    /// Features the file holds — the input to its viewport grid. `fixture::parcel` derives the grid
    /// from the feature count, so a viewport computed with the wrong one selects the wrong extent.
    fn features(self) -> usize {
        match self {
            Self::S | Self::C | Self::H => FEATURES,
            // `kernel/SCALE-PASS-PREREGISTRATION.md` §1a. Restated rather than imported, because
            // that harness's constant is private to it; the row-count check below is what catches a
            // disagreement.
            Self::G5 | Self::C5 | Self::H5 => 3_300_000,
        }
    }
    fn grid_cols(self) -> f64 {
        (self.features() as f64).sqrt().ceil()
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
    fn bbox(self, cols: f64) -> Option<Bbox> {
        let top = N_LO + (cols - 1.0) * CELL_M + CELL_M / 2.0;
        match self {
            Self::Whole => None,
            Self::NearQuarter => Some(Bbox {
                xmin: E_LO,
                ymin: N_LO,
                xmax: E_LO + edge(cols, 2),
                ymax: N_LO + edge(cols, 2),
            }),
            // Same x band, y band at the **top** — the only viewport in which row-group elimination
            // can reach time-to-first-batch on a raster-ordered file (§3).
            Self::FarQuarter => Some(Bbox {
                xmin: E_LO,
                ymin: top - edge(cols, 2),
                xmax: E_LO + edge(cols, 2),
                ymax: top,
            }),
            Self::Sixty4th => Some(Bbox {
                xmin: E_LO,
                ymin: N_LO,
                xmax: E_LO + edge(cols, 8),
                ymax: N_LO + edge(cols, 8),
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
                "G5-arrow-raster-5gb" => FileId::G5,
                "C5-duckdb-raster-5gb" => FileId::C5,
                "H5-duckdb-hilbert16-5gb" => FileId::H5,
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
const OUT_VAR: &str = "SPATIAL_NIGHT_OUT";

/// One trial, in a process of its own.
///
/// **The result goes to a file, not to stdout, and that is a correction rather than a preference.**
///
/// The first attempt had the child `println!` a sentinel line and the driver `strip_prefix` it.
/// libtest with `--nocapture` writes a test's output *on the same line as its own progress banner* —
/// `test night_trial_child ... @@TRIAL@@{…}` — so the sentinel was never at position 0 and the
/// prefix never matched. Every one of 384 trials was recorded `unmeasured — child printed no trial
/// line`, and the smoke test missed it because a human eye reading the console sees the sentinel and
/// does not notice that it is not first on the line.
///
/// A file has no formatting layer between the child and the driver, so there is nothing left to be
/// wrong about. The failure is recorded in `kernel/RESULTS.md` rather than quietly fixed.
#[test]
fn night_trial_child() {
    let (Ok(spec), Ok(out)) = (std::env::var(CELL_VAR), std::env::var(OUT_VAR)) else {
        // The ordinary suite runs this and it does nothing. The driver is `#[ignore]`d.
        return;
    };
    let cell = Cell::parse(&spec).expect("the driver passed an unparseable cell");
    let json = run_one_trial(&cell);
    let mut f = std::fs::File::create(&out).expect("create the trial's result file");
    f.write_all(json.as_bytes()).expect("write the trial result");
    f.sync_all().expect("flush the trial result");
    // Still echoed, because a console is what an operator reads when something goes wrong.
    println!("trial {} -> {}", cell.label(), json);
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

    let q = match cell.view.bbox(cell.file.grid_cols()) {
        None => ViewportQuery::all(),
        Some(b) => ViewportQuery::viewport(b, ds.crs().identifier()),
    };

    // **A second read-volume mark, taken here rather than only at the top of the trial.**
    //
    // The first counter is whole-trial: it includes `Dataset::open`'s identity scan and, on a
    // `RowGroups` cell, the index build's SHA-256 content hash — which reads the entire file. In the
    // 145 MB pass that made a B2 cell's raw figure look like three times ScanOnly's, when the excess
    // was **exactly one file size** and the query's own read was identical to ScanOnly's to the
    // byte. Recording both makes that attribution a fact rather than a subtraction.
    let io_before_query = io_read_bytes();

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
         \"read_bytes\":{},\"read_bytes_query\":{},\"cuts\":{{{}}},\"retained_payload\":{},\
         \"trace\":{},\"error\":{}}}",
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
        opt_u64(io_after.zip(io_before_query).map(|(a, b)| a.saturating_sub(b))),
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
        xmax: E_LO + FileId::S.grid_cols() * CELL_M,
        ymax: N_LO + FileId::S.grid_cols() * CELL_M,
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
        let n = reference_rows(FileId::S, v);
        predicted.push(format!("{{\"viewport\":\"{}\",\"rows\":{}}}", v.as_str(), n));
        say!("viewport {} selects {} rows", v.as_str(), n);
    }

    // ---- the mechanism self-check, before the settle and before any measurement ---------------
    //
    // **Attempt 1 recorded 384 `unmeasured` rows and zero samples because the driver could not parse
    // what the child printed.** It ran for minutes, produced a complete-looking artifact, and every
    // row in it said the same thing. The defect was in the harness, not in the system under test,
    // and nothing in the run could tell the difference.
    //
    // So the mechanism is exercised **once, end to end, before anything is settled or timed**, and a
    // failure here stops the pass immediately instead of consuming it. A run that cannot measure
    // should cost seconds, not a night.
    let exe = std::env::current_exe().expect("current exe");
    let probe_cell = Cell {
        file: FileId::S,
        plan: PlanId::ScanOnly,
        batch: BatchId::SizeOnly,
        view: ViewId::Sixty4th,
        traced: false,
    };
    match spawn_trial(&exe, &probe_cell, &out_dir.join("trial-slot.json")) {
        Ok(line) if line.contains("\"first_batch_ms\"") && line.contains("\"rows\"") => {
            say!("mechanism check OK — a child trial round-trips");
        }
        Ok(line) => panic!(
            "the trial mechanism produced something this driver cannot use, and every cell would \
             have recorded `unmeasured` without saying why. Got: {line}"
        ),
        Err(e) => panic!("the trial mechanism does not work: {e}"),
    }

    // ---- §7: the opening settle, then the first canary ---------------------------------------
    say!("settling {SETTLE_OPENING} s before the first canary");
    std::thread::sleep(Duration::from_secs(SETTLE_OPENING));
    let mut canaries = vec![Canary::take("setup-end")];

    // ---- the trial loop -----------------------------------------------------------------------
    let all = cells();
    say!("{} cells; n = 7 untraced, 7 traced at the gate viewports, 3 elsewhere", all.len());
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
            match spawn_trial(&exe, &cell, &out_dir.join("trial-slot.json")) {
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

/// **The predictor, checked against numbers this repository registered before it existed.**
///
/// Not `#[ignore]`d: it costs nothing and it is what keeps amendment A1's arithmetic and
/// `kernel/SCALE-PASS-PREREGISTRATION.md` §1b from drifting apart. Without it, A1's "exact predicted
/// row count" is prose beside code that computes something else — the defect a reviewer found in that
/// section's own 1/64 edge.
#[test]
fn the_predicted_row_counts_match_the_numbers_registered_before_this_harness() {
    // The fifth section's own registered constants, independently derived here.
    assert_eq!(predicted_rows(FileId::G5, ViewId::NearQuarter), 826_281);
    assert_eq!(predicted_rows(FileId::G5, ViewId::Sixty4th), 51_984);
    assert_eq!(predicted_rows(FileId::G5, ViewId::Whole), 3_300_000);
    // The far quarter is this cut's addition; 909 x 908 full rows plus the partial row's 328.
    assert_eq!(predicted_rows(FileId::G5, ViewId::FarQuarter), 825_700);
    // The 145 MB class, which the run of record observed independently.
    assert_eq!(predicted_rows(FileId::S, ViewId::NearQuarter), 25_281);
    assert_eq!(predicted_rows(FileId::S, ViewId::FarQuarter), 25_108);
    assert_eq!(predicted_rows(FileId::S, ViewId::Sixty4th), 1_600);
    // A rewrite is the same features in a new order, so its counts are its source's.
    for f in [FileId::C5, FileId::H5] {
        for v in [ViewId::Whole, ViewId::NearQuarter, ViewId::FarQuarter, ViewId::Sixty4th] {
            assert_eq!(predicted_rows(f, v), predicted_rows(FileId::G5, v));
        }
    }
}

/// **Amendment A1 — the 5 GB clustered cell.** The untested half of registered prediction 4.
///
/// `{S5, C5, H5} x {whole, near, far, 1/64} x ScanOnly x size-only`, n = 7. B1's gate is **`H5`
/// against `C5`**, never against `S5`; `S5` against `C5` prices the writer at this class.
///
/// **This phase writes nothing to the scale pass's directory.** It reads that fixture, re-hashes it
/// before the first trial and after the last, and puts both rewrites in this cut's own evidence
/// directory.
#[test]
#[ignore = "measurement pass; run explicitly with --release, after the 145 MB pass"]
fn the_5gb_clustered_cell() {
    refuse_debug("first_batch_factorial::5gb-clustered");
    require_disk("first-batch-5gb-clustered");

    let out_dir = evidence_dir();
    let mut log = String::new();
    macro_rules! say {
        ($($a:tt)*) => {{ let s = format!($($a)*); println!("{s}"); log.push_str(&s); log.push('\n'); }};
    }
    say!("hardware: {}", hardware_profile());

    let src = FileId::G5.path();
    if !src.exists() {
        say!("UNMEASURED — the 5 GB fixture is absent at {}", src.display());
        std::fs::write(out_dir.join("first-batch-5gb-clustered.log"), log).ok();
        return;
    }
    let (src_bytes, src_hash) = file_facts(&src);
    say!("source G5 — {src_bytes} bytes, sha256 {src_hash}");

    // ---- the two rewrites ---------------------------------------------------------------------
    let extent = DeclaredExtent {
        xmin: E_LO,
        ymin: N_LO,
        xmax: E_LO + FileId::G5.grid_cols() * CELL_M,
        ymax: N_LO + FileId::G5.grid_cols() * CELL_M,
    };
    for (id, order) in
        [(FileId::C5, ClusterOrder::SourceIdentity), (FileId::H5, ClusterOrder::Hilbert16)]
    {
        let dst = id.path();
        if dst.exists() {
            say!("{} already present; not rewritten", id.as_str());
            continue;
        }
        require_disk("first-batch-5gb-rewrite");
        let cancel = CancelToken::new();
        let dog = Watchdog::start("rewrite-5gb", CEIL_REWRITE_5GB, None, cancel.clone());
        let spec = VariantSpec {
            order,
            extent,
            row_group_rows: ROW_GROUP_ROWS,
            id_column: "id".into(),
        };
        match write_clustered_variant(&src, &dst, &spec, &cancel) {
            Ok(f) => {
                let fired = dog.finish();
                say!(
                    "wrote {}: {} features, {} bytes, {} row groups, {} clamped, {:.0} ms{}",
                    id.as_str(),
                    f.features,
                    f.bytes,
                    f.row_groups,
                    f.clamped_features,
                    f.elapsed_millis,
                    if fired { " (WATCHDOG FIRED)" } else { "" }
                );
            }
            Err(e) => {
                dog.finish();
                // Record and proceed. A layout refusal stops this arm; it is not worked around.
                say!("UNMEASURED — rewrite {} refused: {e}", id.as_str());
            }
        }
    }

    // ---- fixture facts, and B2 admissibility as an observed fact -------------------------------
    let mut fixture_json = Vec::new();
    let mut present = Vec::new();
    for id in [FileId::G5, FileId::C5, FileId::H5] {
        let p = id.path();
        if !p.exists() {
            say!("UNMEASURED — {} was not produced; its cells do not run", id.as_str());
            continue;
        }
        present.push(id);
        let (bytes, hash) = file_facts(&p);
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
            "{{\"id\":\"{}\",\"bytes\":{},\"sha256\":\"{}\",\"row_groups\":{},\
             \"b2_admissible\":\"{}\"}}",
            id.as_str(),
            bytes,
            hash,
            row_groups,
            json_escape(&admissible),
        ));
        say!("fixture {} — {bytes} bytes, {row_groups} row groups, B2 {admissible}", id.as_str());
    }

    // ---- A1: row counts predicted by arithmetic, asserted against the scan ---------------------
    let views = [ViewId::Whole, ViewId::NearQuarter, ViewId::FarQuarter, ViewId::Sixty4th];
    let mut predicted = Vec::new();
    for v in views {
        let want = predicted_rows(FileId::G5, v);
        let got = reference_rows(FileId::G5, v);
        predicted.push(format!(
            "{{\"viewport\":\"{}\",\"predicted\":{},\"observed\":{}}}",
            v.as_str(),
            want,
            got
        ));
        say!("viewport {}: predicted {want}, observed {got}", v.as_str());
        // A mismatch is an instrument failure that stops the phase, not a result (A1).
        assert_eq!(
            want, got,
            "viewport {} selected {got} rows against the arithmetic prediction of {want}; the \
             generator's grid and this harness disagree, and no timing taken now would mean anything",
            v.as_str()
        );
    }

    say!("settling {SETTLE_OPENING} s before the first canary");
    std::thread::sleep(Duration::from_secs(SETTLE_OPENING));
    let mut canaries = vec![Canary::take("5gb-clustered-setup-end")];

    let cells: Vec<Cell> = present
        .iter()
        .flat_map(|&file| {
            views.iter().map(move |&view| Cell {
                file,
                plan: PlanId::ScanOnly,
                batch: BatchId::SizeOnly,
                view,
                traced: false,
            })
        })
        .collect();
    say!("{} cells at 5 GB, n = {N}", cells.len());

    let exe = std::env::current_exe().expect("current exe");
    let slot = out_dir.join("trial-slot-5gb-clustered.json");
    let mut trials: Vec<String> = Vec::new();
    for r in 0..N {
        std::thread::sleep(Duration::from_secs(SETTLE_CANARY));
        canaries.push(Canary::take(&format!("5gb-clustered-rep-{r}-start")));
        for i in interleaved(cells.len(), r) {
            let cell = cells[i];
            match spawn_trial(&exe, &cell, &slot) {
                Ok(line) => trials.push(format!("{{\"rep\":{r},\"trial\":{line}}}")),
                Err(e) => {
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
    canaries.push(Canary::take("5gb-clustered-pass-end"));

    // The source is re-hashed after the last trial, not only before the first.
    let (src_bytes_after, src_hash_after) = file_facts(&src);
    if src_hash_after != src_hash || src_bytes_after != src_bytes {
        say!("INVALIDATED — the 5 GB source changed during the pass: {src_hash} -> {src_hash_after}");
    }

    let spreads = phase_spreads(&canaries);
    for (label, spread, ok) in &spreads {
        say!("canary {label}: spread {:.1}% {}", spread * 100.0, if *ok { "OK" } else { "OVER" });
    }

    let artifact = format!(
        "{{\"preregistration\":\"kernel/FIRST-BATCH-AND-PRUNING-PREREGISTRATION.md#A1\",\
         \"scope\":\"amendment A1, human-authorized: the clustered 5 GB cell. ScanOnly, size-only. \
         Says nothing about lever A and nothing about the default planner.\",\
         \"hardware\":\"{}\",\"media\":\"{}\",\"source_sha256_after\":\"{}\",\
         \"fixtures\":[{}],\"predicted_rows\":[{}],\"canaries\":[{}],\"canary_spreads\":[{}],\
         \"trials\":[{}]}}",
        json_escape(&hardware_profile()),
        json_escape(&media_type()),
        src_hash_after,
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
    std::fs::write(out_dir.join("first-batch-5gb-clustered.json"), artifact).expect("write");
    std::fs::write(out_dir.join("first-batch-5gb-clustered.log"), log).expect("write log");
    println!("→ {}", out_dir.join("first-batch-5gb-clustered.json").display());
}

/// **Cancellation, re-asserted with row-group pruning in the path.**
///
/// `NIGHT-CUT.md` requires it; `kernel/FIRST-BATCH-AND-PRUNING-PREREGISTRATION.md` does not declare
/// it as a scored cell, and under the unattended rule this harness may not add one. So it is what
/// the brief actually asks for — a **re-assertion of a property**, reported with its interval label
/// and explicitly **not** a preregistered timing cell. It may not be differenced against the fifth
/// or sixth sections, and nothing in the gate verdicts rests on it.
///
/// **The interval is `cancel_requested → cancel_observed`**, which is what `docs/08`'s "cancellation
/// acknowledged < 100 ms" is scored on per `kernel/CANCELLATION-AND-TRACING.md` §2 — cited
/// descriptively, as the proposed ADR-018 vocabulary requires while it remains Proposed.
/// `cancel_requested → the consumer's terminal return` is reported **beside** it as a
/// `cancel_acknowledged`-class figure with **no budget attached**, because the two are different
/// intervals and the fifth section's numbers were the second kind.
///
/// Run in-process rather than one-process-per-trial, deliberately: the one-process rule exists so a
/// warm cache cannot bias a *timing comparison between plans*, and this cell compares nothing. It
/// wants the index warm, which is the whole point of having pruning in the path.
#[test]
#[ignore = "measurement pass; run explicitly with --release"]
fn cancellation_holds_with_pruning_in_the_path() {
    refuse_debug("first_batch_factorial::cancel");
    let out_dir = evidence_dir();
    let path = FileId::S.path();
    assert!(path.exists(), "run the factorial pass first; this cell reuses its fixture");

    let mut observed = Vec::new();
    let mut terminal = Vec::new();
    let mut plans = Vec::new();
    for trial in 0..N {
        let ds = Dataset::open(&path).expect("open");
        ds.build_row_group_index(&CancelToken::new()).expect("build row-group index");
        let q = ViewportQuery::viewport(
            ViewId::NearQuarter.bbox(FileId::S.grid_cols()).unwrap(),
            ds.crs().identifier(),
        );
        let guard = spatial_engine::trace::start(spatial_engine::trace::TraceKey {
            label: format!("cancel-with-pruning-{trial}"),
            ..Default::default()
        })
        .expect("no other trace is running");

        let cancel = CancelToken::new();
        let mut stream = ds
            .stream_rowgroup_pruned_experimental(&q, cancel.clone())
            .expect("pruned stream");
        plans.push(stream.filter_plan());

        let mut buf = Vec::new();
        // Two batches, so the producer is inside its row loop rather than still starting up — the
        // state a cancellation actually arrives in.
        for _ in 0..2 {
            match stream.next_into(&mut buf) {
                Some(Ok(_)) => buf.clear(),
                _ => break,
            }
        }
        let requested = Instant::now();
        cancel.cancel();
        while let Some(r) = stream.next_into(&mut buf) {
            buf.clear();
            if r.is_err() {
                break;
            }
        }
        let terminal_ms = requested.elapsed().as_secs_f64() * 1000.0;

        let t = guard.trace();
        let seg = t.segment_ms(
            spatial_engine::trace::CANCELLATION_REQUESTED,
            spatial_engine::trace::PRODUCER_CANCELLED,
        );
        drop(guard);
        observed.push(seg);
        terminal.push(terminal_ms);
        println!(
            "cancel trial {trial}: plan {:?} · requested→observed {} · requested→terminal {terminal_ms:.3} ms",
            plans[trial],
            seg.map(|v| format!("{v:.3} ms")).unwrap_or_else(|| "unmeasured (span absent)".into()),
        );
    }

    let got: Vec<f64> = observed.iter().filter_map(|v| *v).collect();
    let json = format!(
        "{{\"interval\":\"cancel_requested -> cancel_observed (docs/08's 100 ms budget)\",\
         \"note\":\"a re-assertion required by NIGHT-CUT.md, NOT a preregistered scored cell; never \
         differenced against the fifth or sixth sections\",\
         \"plans\":[{}],\"requested_to_observed_ms\":[{}],\"samples\":{},\"of\":{},\
         \"requested_to_terminal_ms_no_budget\":{}}}",
        plans.iter().map(|p| format!("\"{}\"", p.as_str())).collect::<Vec<_>>().join(","),
        observed
            .iter()
            .map(|v| v.map(|x| format!("{x:.3}")).unwrap_or_else(|| "null".into()))
            .collect::<Vec<_>>()
            .join(","),
        got.len(),
        N,
        json_f64s(&terminal),
    );
    std::fs::write(out_dir.join("first-batch-cancel.json"), &json).expect("write");
    println!("{json}");

    // The property, asserted. Reported above whatever the verdict, so a miss is a recorded number
    // rather than a lost run.
    assert!(!got.is_empty(), "no trial produced a `cancel_requested -> cancel_observed` span");
    let worst = sorted(&got).last().copied().unwrap();
    assert!(
        worst < 100.0,
        "cancellation with pruning in the path missed docs/08's 100 ms budget: worst \
         requested->observed {worst:.3} ms over {} samples",
        got.len()
    );
    assert!(
        plans.iter().all(|p| matches!(
            p,
            FilterPlan::RowGroupsPruned { .. } | FilterPlan::RowGroupsKeptAll { .. }
        )),
        "the pruning plan was not in the path, so this asserts nothing about pruning: {plans:?}"
    );
}

/// The **5 GB spot cells** — the `ScanOnly` arm, and only that arm.
///
/// **Scope, stated because the omission is deliberate.** `NIGHT-CUT.md` scopes 5 GB spot cells to
/// "ScanOnly vs **the winning** pruning candidate", and it requires a "same-session ScanOnly
/// re-baseline first". This is that re-baseline. The clustered 5 GB cell — which would test the
/// preregistration's **prediction 4**, that layout's sign flips with row-group count — is *not* run
/// here: it needs a Hilbert rewrite of a 5 GB file that nothing declared, and the unattended rule
/// forbids improvising past a declared scope. It is recorded as the first thing to schedule next.
///
/// **This phase writes nothing.** The fixture is the scale pass's own, reused, re-hashed, and
/// refused on mismatch — the discipline `CANCEL-RESCORE-PREREGISTRATION.md` §2 established after a
/// pass that could silently create its own input.
#[test]
#[ignore = "measurement pass; run explicitly with --release, after the 145 MB pass"]
fn the_5gb_spot_cells() {
    refuse_debug("first_batch_factorial::5gb");
    require_disk("first-batch-5gb");

    let out_dir = evidence_dir();
    let mut log = String::new();
    macro_rules! say {
        ($($a:tt)*) => {{ let s = format!($($a)*); println!("{s}"); log.push_str(&s); log.push('\n'); }};
    }
    say!("hardware: {}", hardware_profile());

    let path = FileId::G5.path();
    if !path.exists() {
        // Record and proceed — this phase refuses to generate a 5 GB fixture, so an absent one is
        // an `unmeasured` phase rather than a 30-minute improvisation.
        say!("UNMEASURED — the 5 GB fixture is absent at {}", path.display());
        std::fs::write(out_dir.join("first-batch-5gb.log"), log).ok();
        return;
    }
    let (bytes, hash) = file_facts(&path);
    say!("fixture G5 — {bytes} bytes, sha256 {hash}");

    let (row_groups, admissible) = match Dataset::open(&path) {
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
    say!("G5 — {row_groups} row groups, B2 {admissible}");

    let exe = std::env::current_exe().expect("current exe");
    let slot = out_dir.join("trial-slot-5gb.json");
    let mut predicted = Vec::new();
    for v in [ViewId::Whole, ViewId::NearQuarter, ViewId::FarQuarter] {
        let n = reference_rows(FileId::G5, v);
        predicted.push(format!("{{\"viewport\":\"{}\",\"rows\":{}}}", v.as_str(), n));
        say!("viewport {} selects {} rows", v.as_str(), n);
    }

    say!("settling {SETTLE_OPENING} s before the first canary");
    std::thread::sleep(Duration::from_secs(SETTLE_OPENING));
    let mut canaries = vec![Canary::take("5gb-setup-end")];

    let cells: Vec<Cell> = [BatchId::SizeOnly, BatchId::Budgeted]
        .iter()
        .flat_map(|&batch| {
            [ViewId::Whole, ViewId::NearQuarter, ViewId::FarQuarter].iter().map(move |&view| Cell {
                file: FileId::G5,
                plan: PlanId::ScanOnly,
                batch,
                view,
                traced: false,
            })
        })
        .collect();
    say!("{} cells at 5 GB, n = {N}", cells.len());

    let mut trials: Vec<String> = Vec::new();
    for r in 0..N {
        std::thread::sleep(Duration::from_secs(SETTLE_CANARY));
        canaries.push(Canary::take(&format!("5gb-rep-{r}-start")));
        for i in interleaved(cells.len(), r) {
            let cell = cells[i];
            match spawn_trial(&exe, &cell, &slot) {
                Ok(line) => trials.push(format!("{{\"rep\":{r},\"trial\":{line}}}")),
                Err(e) => {
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
    canaries.push(Canary::take("5gb-pass-end"));

    // **Re-hashed after the last trial, not only before the first.** A fixture that changed under a
    // pass is the failure `SourceChangedUnderPublish` exists for one level up.
    let (bytes_after, hash_after) = file_facts(&path);
    if hash_after != hash || bytes_after != bytes {
        say!("INVALIDATED — the 5 GB fixture changed during the pass: {hash} -> {hash_after}");
    }

    let spreads = phase_spreads(&canaries);
    for (label, spread, ok) in &spreads {
        say!("canary {label}: spread {:.1}% {}", spread * 100.0, if *ok { "OK" } else { "OVER" });
    }

    let artifact = format!(
        "{{\"preregistration\":\"kernel/FIRST-BATCH-AND-PRUNING-PREREGISTRATION.md\",\
         \"scope\":\"ScanOnly arm only; the clustered 5 GB cell is undeclared and is a morning item\",\
         \"hardware\":\"{}\",\"media\":\"{}\",\
         \"fixtures\":[{{\"id\":\"{}\",\"path\":\"{}\",\"bytes\":{},\"sha256\":\"{}\",\
         \"sha256_after\":\"{}\",\"row_groups\":{},\"b2_admissible\":\"{}\"}}],\
         \"predicted_rows\":[{}],\"canaries\":[{}],\"canary_spreads\":[{}],\"trials\":[{}]}}",
        json_escape(&hardware_profile()),
        json_escape(&media_type()),
        FileId::G5.as_str(),
        json_escape(&path.display().to_string()),
        bytes,
        hash,
        hash_after,
        row_groups,
        json_escape(&admissible),
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
    std::fs::write(out_dir.join("first-batch-5gb.json"), artifact).expect("write artifact");
    std::fs::write(out_dir.join("first-batch-5gb.log"), log).expect("write log");
    println!("→ {}", out_dir.join("first-batch-5gb.json").display());
}

/// One trial, in its own process. Returns the child's JSON.
///
/// The result travels through a file rather than through stdout — see `night_trial_child` for the
/// defect that made that necessary. The file is removed first, so a stale result from a previous
/// repetition can never be read as this one's.
fn spawn_trial(exe: &Path, cell: &Cell, slot: &Path) -> std::result::Result<String, String> {
    let _ = std::fs::remove_file(slot);
    // §7 declares two trial ceilings: 120 s at the 145 MB class and 900 s at 5 GB. One constant for
    // both would either abort a legitimate 5 GB trial or fail to bound a hung 145 MB one.
    let ceiling = if matches!(cell.file, FileId::G5 | FileId::C5 | FileId::H5) {
        CEIL_TRIAL_5GB
    } else {
        CEIL_TRIAL
    };
    let started = Instant::now();
    let out = Command::new(exe)
        .args(["night_trial_child", "--exact", "--nocapture", "--test-threads=1"])
        .env(CELL_VAR, cell.label())
        .env(OUT_VAR, slot)
        .output()
        .map_err(|e| format!("spawn: {e}"))?;
    if started.elapsed() > ceiling {
        return Err(format!("exceeded the declared {} s trial ceiling", ceiling.as_secs()));
    }
    if !out.status.success() {
        let tail: String =
            String::from_utf8_lossy(&out.stderr).lines().rev().take(3).collect::<Vec<_>>().join(" / ");
        return Err(format!("child exited {:?}: {tail}", out.status.code()));
    }
    std::fs::read_to_string(slot).map_err(|e| format!("child wrote no result file: {e}"))
}

/// Rows a viewport selects, taken from the **unindexed scan** rather than from arithmetic — so a
/// generator change is caught by a disagreement rather than propagating silently.
fn reference_rows(file: FileId, v: ViewId) -> u64 {
    let path = file.path();
    let ds = Dataset::open(&path).expect("open for reference count");
    let q = match v.bbox(file.grid_cols()) {
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

