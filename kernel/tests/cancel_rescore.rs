// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! The cancellation re-score and the tracing cells, per `kernel/CANCEL-RESCORE-PREREGISTRATION.md`.
//!
//! **A new file, deliberately.** `kernel/tests/scale_pass_a6.rs` stays byte-identical, for the same
//! reason it gave for leaving `scale_pass.rs` alone: an artifact's provenance rests on the source
//! that produced it, and editing a harness after it has produced a run of record breaks the pin that
//! makes the run checkable.
//!
//! ## What is measured
//!
//! Six cells. C1–C4 are cancellation trials at 5 GB through the class-3 boundary; C5 is the tracing
//! overhead A/B at 145 MB; C6 is the consistency demonstration. Every trigger, ceiling, sample count
//! and verdict rule below is quoted from the preregistration, which was committed first.
//!
//! ## Two intervals, always together
//!
//! Per `kernel/CANCELLATION-AND-TRACING.md` §2, every cancellation trial reports **both**:
//!
//! - `observed` — `cancel()` → the operation reports it noticed. **Carries the `docs/08` verdict.**
//! - `acknowledged` — `cancel()` → `boundary::execute` returns. **No budget attached**, because it
//!   contains staging removal and the audit record's fsync.
//!
//! Reporting `observed` alone is forbidden by the preregistration. The artifact therefore carries
//! both for every trial, so a write-up physically cannot quote one without the other being present.

#![allow(clippy::too_many_arguments)]

mod support;

use std::path::{Path, PathBuf};
use std::sync::atomic::{AtomicBool, AtomicUsize, Ordering};
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};

use spatial_engine::trace::{self, TraceKey};
use spatial_engine::{CancelToken, Dataset, ViewportQuery};
use spatial_kernel::permission::{
    boundary, AuditLog, DestinationScope, GrantSet, OperationKind, PreNamedApproval, Principal,
    PrincipalKind, PublishAttempt, PublishGrant, SourceScope,
};
use spatial_kernel::permission::boundary::BoundaryError;
use spatial_kernel::publish::{
    CorrespondingSource, CorrespondingSourceKind, PublishError, PublishPhase, PublishProgress,
    PublishRequest, ViewerAsset, ViewerAssets, ViewerLicenseInput,
};

use support::{
    free_bytes_on_c, hardware_profile, json_f64s, media_type, pct, phase_spreads, refuse_debug,
    sorted, Canary, Watchdog,
};

// ---- Declared constants, all from the preregistration -------------------------------------------

/// §3 C1: fired after `QueryRunning`, which is inside the sort by construction. **Declared before
/// measuring and not re-tuned afterwards** — re-tuning a trigger once you have seen where it landed
/// is the failure the whole preregistration exists to prevent.
const DELAY_INSIDE_SORT: Duration = Duration::from_millis(250);

/// §3 C2/C3: far enough in that the writeback cache is loaded rather than cold.
const PARTITION_FLOOR: usize = 100;

/// §4: a stuck trial is killed and **excluded**, never reported as a sample.
const TRIAL_CEILING: Duration = Duration::from_secs(900);

/// §3: seven usable samples per cancellation cell.
const TRIALS: usize = 7;

/// **Amendment A1: the machine rests before it is asked whether it is still itself.**
///
/// Attempt 3 exceeded the declared 10 % canary bound in five of six phases. The 400 M canary's long
/// minimum climbed 105.7 -> 116.5 -> 134.7 -> 162.6 ms and then fell back to 119.8 as the load
/// lightened: thermal drift under 28 cancelled publishes reading 5 GB each, not a step change and
/// not a competing process. A reading taken straight off a hot phase measures the phase, not the
/// machine's baseline.
///
/// This changes no trigger, no ceiling, no sample count and no verdict rule — only how long the
/// machine rests before each reading.
const CANARY_SETTLE: Duration = Duration::from_secs(60);

/// §3 C5: six pairs per arm, ABBA, after a discarded warm-up.
const OVERHEAD_PAIRS: usize = 3;

const FIXTURE_SHA256: &str =
    "sha256:5ae955c5fb7ee4d3f10436df271e19361d84f0845fbaa69dc60516f1b60c1788";

const FIXED_CLOCK: &str = "2026-08-07T12:00:00Z";

fn evidence_dir() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../target/slice-evidence/scale-pass")
}
fn out_dir() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../target/slice-evidence/cancel-rescore")
}
fn fixture_path() -> PathBuf {
    evidence_dir().join("parcels-5gb.parquet")
}
fn control_path() -> PathBuf {
    evidence_dir().join("parcels-control-145mb.parquet")
}

fn clock() -> String {
    "2026-08-07T12:00:01Z".into()
}
static CLOCK: fn() -> String = clock;

fn principal() -> Principal {
    Principal { kind: PrincipalKind::OsUser, id: "cancel-rescore-operator".into() }
}

fn viewer() -> ViewerAssets {
    ViewerAssets::new(vec![
        ViewerAsset { path: "index.html".into(), bytes: b"<!doctype html><title>t</title>".to_vec() },
        ViewerAsset { path: "app.js".into(), bytes: b"export const ok = 1;\n".to_vec() },
        ViewerAsset { path: "NOTICE.txt".into(), bytes: b"stub notice\n".to_vec() },
    ])
    .unwrap()
}

fn viewer_license() -> ViewerLicenseInput {
    ViewerLicenseInput {
        program: "Spatial IDE bundle viewer".into(),
        copyright: "Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors".into(),
        license: "AGPL-3.0-or-later".into(),
        notice_path: "NOTICE.txt".into(),
        corresponding_source: CorrespondingSource {
            kind: CorrespondingSourceKind::Url,
            at: "https://example.invalid/spatial-ide".into(),
        },
    }
}

const STYLE: &str = r##"{
  "style_version": 1,
  "layer": {
    "geometry": "polygon",
    "fill_color": {"literal": "#aa3333"},
    "fill_opacity": {"literal": 0.8},
    "outline_color": {"literal": "#202020"},
    "outline_width": {"literal": 1.0}
  }
}"##;

fn request<'a>(
    ds: &'a Dataset,
    v: &'a ViewerAssets,
    destination: PathBuf,
) -> PublishRequest<'a> {
    PublishRequest {
        dataset: ds,
        dataset_name: "parcels",
        query: ViewportQuery::all(),
        // **Empty, because the 5 GB fixture is `AttributeMode::None`** — its columns are `id`,
        // `bbox`, `geometry` and nothing else (preregistration §1a of the scale pass). Attempt 1 of
        // this pass asked for a `zone` attribute copied from a small-fixture helper, and the engine
        // refused every trial before a single partition existed: *"`zone` cannot be published as an
        // attribute — the file has no such column"*. That refusal is the engine being right — it is
        // `docs/01` principle 8 declining a silent conversion — and it invalidated the attempt.
        attributes: Vec::new(),
        style_source: STYLE,
        viewer: v,
        viewer_license: viewer_license(),
        license: None,
        destination,
        started_at: FIXED_CLOCK.into(),
        finished_at: &CLOCK,
    }
}

fn grant_for(ds: &Dataset, destination: &Path) -> GrantSet {
    let pin = ds.content_pin().expect("the source is pinned before the boundary runs");
    let mut set = GrantSet::new();
    set.add(
        PublishGrant::new(
            OperationKind::Publish,
            SourceScope {
                dataset_name: "parcels".into(),
                content_hash: format!("sha256:{}", pin.hash()),
            },
            DestinationScope::exact(destination).expect("the destination resolves"),
            principal(),
            Duration::from_secs(900),
        )
        .expect("the grant is well-formed"),
    )
    .expect("the grant set accepts it");
    set
}

// ---- Cells ---------------------------------------------------------------------------------

/// Which cell a trial belongs to, and therefore when its cancel fires.
#[derive(Clone, Copy, PartialEq, Eq, Debug)]
enum Cell {
    /// C1 — inside the sort. Fires `DELAY_INSIDE_SORT` after `QueryRunning`, off-thread.
    InsideSort,
    /// C2 — inside a partition write, bytes still to go. Fires inline.
    MidWrite,
    /// C3 — immediately before the fsync. Fires inline.
    PreSync,
    /// C4 — A6's own trigger, re-run for continuity. Fires inline from `partition_written`.
    A6Continuity,
}

impl Cell {
    fn label(self) -> &'static str {
        match self {
            Self::InsideSort => "c1-inside-sort",
            Self::MidWrite => "c2-mid-write",
            Self::PreSync => "c3-pre-sync",
            Self::A6Continuity => "c4-a6-continuity",
        }
    }
    /// What the preregistration says this cell does and does not establish. Carried into the
    /// artifact so the caveat cannot be separated from the number.
    fn caveat(self) -> &'static str {
        match self {
            Self::InsideSort => "budget-bearing. Trigger is the QueryRunning phase, reachable only \
                 with a batch demanded and none arrived.",
            Self::MidWrite => "budget-bearing, and THE ONLY cell that establishes anything about \
                 intra-partition polling.",
            Self::PreSync => "budget-bearing. Designed to produce the honest worst case: \
                 acknowledgement must traverse a full sync_all, which has no derivable ceiling.",
            Self::A6Continuity => "NOT a measurement of intra-partition cancellation. A6's trigger \
                 fires inline from partition_written with a cancel check two statements later, so \
                 observation latency is ~0 and this measures post-observation teardown. Re-run only \
                 so the sixth section can state what that trigger measures on this tree.",
        }
    }
}

/// Everything one trial produced.
struct Trial {
    cell: Cell,
    index: usize,
    /// `cancel()` → the operation reported it noticed. The budget-bearing interval.
    observed_ms: Option<f64>,
    /// `cancel()` → `boundary::execute` returned. No budget.
    acknowledged_ms: Option<f64>,
    /// Whether the fire landed where the cell declares it must.
    on_target: bool,
    off_target_why: Option<String>,
    watchdog_fired: bool,
    outcome_is_cancelled: bool,
    /// **What the operation actually returned.** A trial that ended as anything other than a
    /// cancellation is a failed trial, and a harness that records only `cancelled: false` says the
    /// trial failed without saying why — which is exactly the shape of uninformative artifact this
    /// pass exists to argue against.
    outcome_detail: String,
    left_nothing: bool,
    partitions_at_fire: usize,
}

impl Trial {
    /// A sample only if it fired on target, the watchdog stayed quiet, and the operation actually
    /// ended as cancelled. Anything else is an **observation**, reported separately and never pooled.
    fn is_sample(&self) -> bool {
        self.on_target && !self.watchdog_fired && self.outcome_is_cancelled
    }
    fn json(&self) -> String {
        format!(
            r#"{{"cell": {:?}, "index": {}, "on_target": {}, "off_target_why": {}, "watchdog_fired": {}, "cancelled": {}, "outcome": {:?}, "left_nothing": {}, "partitions_at_fire": {}, "observed_ms": {}, "acknowledged_ms": {}, "is_sample": {}}}"#,
            self.cell.label(),
            self.index,
            self.on_target,
            match &self.off_target_why {
                Some(w) => format!("{w:?}"),
                None => "null".into(),
            },
            self.watchdog_fired,
            self.outcome_is_cancelled,
            self.outcome_detail,
            self.left_nothing,
            self.partitions_at_fire,
            f64_or_null(self.observed_ms),
            f64_or_null(self.acknowledged_ms),
            self.is_sample()
        )
    }
}

fn f64_or_null(v: Option<f64>) -> String {
    match v {
        Some(x) if x.is_finite() => format!("{x:.3}"),
        _ => "null".into(),
    }
}

/// Trial state shared with C1's off-thread canceller.
///
/// **`Arc`, not raw pointers.** C1's trigger must sleep, and sleeping inside `phase()` would stall
/// the publishing thread whose latency is being measured — so the sleep goes on its own thread,
/// which means the state outlives the observer's stack frame from that thread's point of view.
/// Shared ownership is the way to say that; a pointer smuggled across as a `usize` would be the way
/// to *assume* it.
struct Shared {
    token: CancelToken,
    fired: AtomicBool,
    /// When `cancel()` was called.
    requested_at: Mutex<Option<Instant>>,
    /// When the operation reported it noticed.
    observed_at: Mutex<Option<Instant>>,
    partitions: AtomicUsize,
    partitions_at_fire: Mutex<Option<usize>>,
    saw_query_running: AtomicBool,
}

impl Shared {
    /// Fire once, stamping the request instant and the partition count at that moment.
    ///
    /// The partition count is read **before** `cancel()`, so it describes the state the operation
    /// was in when the trigger fired rather than whatever it reached while unwinding.
    fn fire(&self) {
        if self.fired.swap(true, Ordering::SeqCst) {
            return;
        }
        *self.partitions_at_fire.lock().unwrap() = Some(self.partitions.load(Ordering::SeqCst));
        *self.requested_at.lock().unwrap() = Some(Instant::now());
        self.token.cancel();
    }
}

/// The observer that fires each cell's trigger and records the instants.
struct Obs {
    cell: Cell,
    s: Arc<Shared>,
    /// Held so C1's canceller is joined before the trial reports.
    canceller: Mutex<Option<std::thread::JoinHandle<()>>>,
}

impl Obs {
    fn new(cell: Cell, token: CancelToken) -> Self {
        Self {
            cell,
            s: Arc::new(Shared {
                token,
                fired: AtomicBool::new(false),
                requested_at: Mutex::new(None),
                observed_at: Mutex::new(None),
                partitions: AtomicUsize::new(0),
                partitions_at_fire: Mutex::new(None),
                saw_query_running: AtomicBool::new(false),
            }),
            canceller: Mutex::new(None),
        }
    }
}

impl PublishProgress for Obs {
    fn phase(&self, phase: PublishPhase) {
        if phase == PublishPhase::QueryRunning {
            self.s.saw_query_running.store(true, Ordering::SeqCst);
            if self.cell == Cell::InsideSort && !self.s.fired.load(Ordering::SeqCst) {
                // **Off-thread, because `phase` runs on the publishing thread** — sleeping here
                // would stall the very operation whose cancellation latency is being measured, and
                // the number would describe this observer rather than publish.
                let s = Arc::clone(&self.s);
                let h = std::thread::spawn(move || {
                    std::thread::sleep(DELAY_INSIDE_SORT);
                    s.fire();
                });
                *self.canceller.lock().unwrap() = Some(h);
            }
        }
    }

    fn partition_written(&self, index: usize, _rows: usize, _bytes: u64) {
        self.s.partitions.store(index + 1, Ordering::SeqCst);
        if self.cell == Cell::A6Continuity && index >= PARTITION_FLOOR {
            self.s.fire();
        }
    }

    fn partition_write_progress(&self, index: usize, written: u64, total: u64) {
        if index < PARTITION_FLOOR {
            return;
        }
        match self.cell {
            Cell::MidWrite if written < total => self.s.fire(),
            Cell::PreSync if written == total => self.s.fire(),
            _ => {}
        }
    }

    fn cancellation_observed(&self, at: Instant) {
        let mut slot = self.s.observed_at.lock().unwrap();
        if slot.is_none() {
            *slot = Some(at);
        }
    }
}

/// Run one trial and return what it produced.
fn run_trial(
    ds: &Dataset,
    v: &ViewerAssets,
    dir: &Path,
    cell: Cell,
    index: usize,
) -> Trial {
    let label = format!("{}-{index}", cell.label());
    let destination = dir.join(&label);
    let _ = std::fs::remove_dir_all(&destination);
    let req = request(ds, v, destination.clone());
    let grants = grant_for(ds, &destination);
    let approval = PreNamedApproval(label.clone());

    let cancel = CancelToken::new();
    let dog = Watchdog::start("cancel-rescore", TRIAL_CEILING, None, cancel.clone());

    let resolved = spatial_kernel::permission::grant::resolve_destination(&req.destination)
        .expect("the destination resolves");
    let audit = AuditLog::open_for(&resolved).expect("the audit log opens");

    let (result, returned_at, requested_at, observed_at, partitions_at_fire, saw_qr) = {
        let obs = Obs::new(cell, cancel.clone());
        let attempt = PublishAttempt {
            request: &req,
            grants: &grants,
            approval: &approval,
            principal: &principal(),
            audit: &audit,
            clock: &CLOCK,
        };
        let result = boundary::execute(&attempt, &cancel, Some(&obs));
        let returned_at = Instant::now();
        // Join C1's canceller before reading its stamps, so a fire that was still in flight when
        // the operation returned is recorded rather than missed.
        if let Some(h) = obs.canceller.lock().unwrap().take() {
            let _ = h.join();
        }
        // Bound to a local so every `MutexGuard` temporary is dropped before `obs` is, rather than
        // at the end of the block expression.
        let snapshot = (
            result,
            returned_at,
            *obs.s.requested_at.lock().unwrap(),
            *obs.s.observed_at.lock().unwrap(),
            obs.s.partitions_at_fire.lock().unwrap().unwrap_or(0),
            obs.s.saw_query_running.load(Ordering::SeqCst),
        );
        snapshot
    };
    let watchdog_fired = dog.finish();

    // **`checked_duration_since`, not subtraction.** `Instant` arithmetic saturates, so a fire that
    // landed after the return would silently produce 0.000 ms — a fabricated perfect score.
    let observed_ms = match (requested_at, observed_at) {
        (Some(a), Some(b)) => b.checked_duration_since(a).map(|d| d.as_secs_f64() * 1000.0),
        _ => None,
    };
    let acknowledged_ms = requested_at
        .and_then(|a| returned_at.checked_duration_since(a))
        .map(|d| d.as_secs_f64() * 1000.0);

    // On-target, per the cell's declared trigger.
    let (on_target, off_target_why) = match cell {
        Cell::InsideSort => {
            if !saw_qr {
                (false, Some("QueryRunning never fired: the sort finished inside one poll interval".into()))
            } else if partitions_at_fire != 0 {
                (
                    false,
                    Some(format!(
                        "the 250 ms delay overshot the sort: {partitions_at_fire} partitions had \
                         been written when the cancel fired"
                    )),
                )
            } else {
                (true, None)
            }
        }
        _ => {
            if requested_at.is_none() {
                (false, Some("the trigger never fired".into()))
            } else {
                (true, None)
            }
        }
    };

    // `boundary::execute` wraps the publish error, so a cancellation arrives as
    // `BoundaryError::Publish(PublishError::Cancelled)`. Matching the outer variant alone would
    // also accept a permission or audit failure as "cancelled", which is a different outcome.
    let outcome_is_cancelled =
        matches!(result, Err(BoundaryError::Publish(PublishError::Cancelled)));
    let outcome_detail = match &result {
        Ok(o) => format!("published {} partitions, {} rows", o.partitions, o.rows),
        Err(e) => format!("{e}"),
    };
    let left_nothing = !destination.exists() && no_staging_beside(&destination);

    Trial {
        cell,
        index,
        observed_ms,
        acknowledged_ms,
        on_target,
        off_target_why,
        watchdog_fired,
        outcome_is_cancelled,
        outcome_detail,
        left_nothing,
        partitions_at_fire,
    }
}

fn no_staging_beside(dest: &Path) -> bool {
    let parent = match dest.parent() {
        Some(p) if p.exists() => p,
        _ => return true,
    };
    !std::fs::read_dir(parent)
        .unwrap()
        .filter_map(|e| e.ok())
        .any(|e| e.file_name().to_string_lossy().contains(".staging-"))
}

/// p50/p95/max over the samples of one cell, for one of the two intervals.
fn summarize(label: &str, v: &[f64]) -> String {
    if v.is_empty() {
        return format!(r#""{label}": {{"n": 0, "p50_ms": null, "p95_ms": null, "max_ms": null}}"#);
    }
    let s = sorted(v);
    format!(
        r#""{label}": {{"n": {}, "p50_ms": {:.3}, "p95_ms": {:.3}, "max_ms": {:.3}, "all_ms": {}}}"#,
        s.len(),
        pct(&s, 0.50),
        pct(&s, 0.95),
        s[s.len() - 1],
        json_f64s(&s)
    )
}

// ---- The pass -----------------------------------------------------------------------------

#[test]
#[ignore = "measurement: reads the 5 GB fixture and runs 28 cancelled publishes"]
fn measure_the_cancellation_rescore() {
    refuse_debug("cancel_rescore");
    std::fs::create_dir_all(out_dir()).expect("evidence dir");

    // §2 — the fixture is verified, never generated.
    let fixture = fixture_path();
    assert!(
        fixture.exists(),
        "the 5 GB fixture is missing. This harness REFUSES to generate one: a pass that could \
         create its own input could measure a different file from the one it names."
    );
    let control = control_path();
    assert!(control.exists(), "the 145 MB control is missing and is not generated here either");

    println!("verifying the fixture against its recorded hash (this reads 5 GB)…");
    let ds = Dataset::open(&fixture).expect("open the 5 GB fixture");
    let (pin, hash_millis) = ds.pin_content(&CancelToken::new()).expect("pin the fixture");
    let observed_hash = format!("sha256:{}", pin.hash());
    println!("whole-file rehash took {hash_millis:.1} ms");
    assert_eq!(
        observed_hash, FIXTURE_SHA256,
        "the fixture does not match the hash the preregistration names; this pass refuses to run"
    );
    println!("fixture verified: {observed_hash}");

    let free_before = free_bytes_on_c();
    let v = viewer();
    let dir = out_dir().join("trials");
    let _ = std::fs::remove_dir_all(&dir);
    std::fs::create_dir_all(&dir).expect("trial dir");

    // §5 — settle before the first canary, so attempt 1 is not invalidated by its own instrument.
    println!("settling 120 s before the first canary…");
    std::thread::sleep(Duration::from_secs(120));
    let mut canaries = vec![Canary::take("start")];

    // Every later reading is preceded by `CANARY_SETTLE` (amendment A1).
    fn settled_canary(label: &str) -> Canary {
        println!("settling {}s before the [{label}] canary…", CANARY_SETTLE.as_secs());
        std::thread::sleep(CANARY_SETTLE);
        Canary::take(label)
    }

    // ---- C1–C4 ------------------------------------------------------------------------------
    let mut trials: Vec<Trial> = Vec::new();
    for cell in [Cell::InsideSort, Cell::MidWrite, Cell::PreSync, Cell::A6Continuity] {
        println!("\n=== {} ===", cell.label());
        for i in 0..TRIALS {
            let t = run_trial(&ds, &v, &dir, cell, i);
            println!(
                "  [{}] {i}: on_target={} observed={} acknowledged={} partitions={} -> {}",
                cell.label(),
                t.on_target,
                f64_or_null(t.observed_ms),
                f64_or_null(t.acknowledged_ms),
                t.partitions_at_fire,
                t.outcome_detail
            );
            assert!(
                t.left_nothing,
                "a cancelled publish must leave nothing: destination and staging both absent"
            );
            trials.push(t);
        }
        canaries.push(settled_canary(&format!("after-{}", cell.label())));
    }

    // ---- C5: tracing overhead at 145 MB, ABBA after a discarded warm-up ----------------------
    println!("\n=== c5-tracing-overhead ===");
    let ctl = Dataset::open(&control).expect("open the control");
    let _warmup = stream_all(&ctl); // discarded: DuckDB's first-instance cost lands in neither arm
    let mut off_ms = Vec::new();
    let mut on_ms = Vec::new();
    let mut off_first = Vec::new();
    let mut on_first = Vec::new();
    for pair in 0..OVERHEAD_PAIRS {
        // A B B A, so an ordering effect shows up rather than averaging away.
        let a1 = stream_all(&ctl);
        let b1 = stream_traced(&ctl, &format!("overhead-b1-{pair}"));
        let b2 = stream_traced(&ctl, &format!("overhead-b2-{pair}"));
        let a2 = stream_all(&ctl);
        off_first.push(a1);
        on_first.push(b1);
        on_ms.extend([b1, b2]);
        off_ms.extend([a1, a2]);
    }
    canaries.push(settled_canary("after-overhead"));

    // ---- C6: consistency --------------------------------------------------------------------
    println!("\n=== c6-consistency ===");
    let consistency = consistency_cell(&ctl);
    canaries.push(settled_canary("after-consistency"));

    // ---- Verdicts ---------------------------------------------------------------------------
    let spreads = phase_spreads(&canaries);
    for (phase, spread, ok) in &spreads {
        println!("canary [{phase}]: spread {:.2}% {}", spread * 100.0, if *ok { "OK" } else { "EXCEEDED" });
    }

    let mut cells_json = Vec::new();
    for cell in [Cell::InsideSort, Cell::MidWrite, Cell::PreSync, Cell::A6Continuity] {
        let mine: Vec<&Trial> = trials.iter().filter(|t| t.cell == cell).collect();
        let samples: Vec<&&Trial> = mine.iter().filter(|t| t.is_sample()).collect();
        let obs: Vec<f64> = samples.iter().filter_map(|t| t.observed_ms).collect();
        let ack: Vec<f64> = samples.iter().filter_map(|t| t.acknowledged_ms).collect();
        // §3: the budget is scored on `observed`, and only on samples.
        let verdict = if obs.is_empty() {
            "no usable sample".to_string()
        } else if sorted(&obs)[obs.len() - 1] < 100.0 {
            "MET".to_string()
        } else {
            "MISSED".to_string()
        };
        cells_json.push(format!(
            r#"{{"cell": {:?}, "caveat": {:?}, "trials": {}, "usable_samples": {}, {}, {}, "verdict_on_observed_vs_100ms": {:?}}}"#,
            cell.label(),
            cell.caveat(),
            mine.len(),
            samples.len(),
            summarize("observed", &obs),
            summarize("acknowledged", &ack),
            verdict
        ));
    }

    let free_after = free_bytes_on_c();
    let artifact = format!(
        r#"{{
  "kind": "cancellation re-score and tracing cells",
  "preregistration": "kernel/CANCEL-RESCORE-PREREGISTRATION.md",
  "semantics": "kernel/CANCELLATION-AND-TRACING.md",
  "reading_rule": "observed carries the docs/08 verdict; acknowledged carries none. Neither may be quoted without the other. No number here may be differenced against RESULTS.md's fifth section — different tree, different session, and the fifth section's figures are acknowledged-class.",
  "hardware": {:?},
  "media": {:?},
  "fixture_sha256": {:?},
  "declared": {{"delay_inside_sort_ms": {}, "partition_floor": {}, "trials_per_cell": {}, "trial_ceiling_s": {}}},
  "cells": [{}],
  "tracing_overhead": {{
    "note": "145 MB control, ABBA after a discarded warm-up. Both order estimates reported and deliberately not averaged.",
    {},
    {},
    "off_first_ms": {}, "on_first_ms": {}
  }},
  "consistency": {},
  "canaries": [{}],
  "canary_spreads": [{}],
  "free_bytes_before": {}, "free_bytes_after": {},
  "trials": [{}]
}}
"#,
        hardware_profile(),
        media_type(),
        observed_hash,
        DELAY_INSIDE_SORT.as_millis(),
        PARTITION_FLOOR,
        TRIALS,
        TRIAL_CEILING.as_secs(),
        cells_json.join(",\n    "),
        summarize("tracing_off", &off_ms),
        summarize("tracing_on", &on_ms),
        json_f64s(&off_first),
        json_f64s(&on_first),
        consistency,
        canaries.iter().map(Canary::json).collect::<Vec<_>>().join(",\n    "),
        spreads
            .iter()
            .map(|(p, s, ok)| format!(r#"{{"phase": {p:?}, "spread": {s:.4}, "within_declared": {ok}}}"#))
            .collect::<Vec<_>>()
            .join(",\n    "),
        free_before.map(|b| b.to_string()).unwrap_or("null".into()),
        free_after.map(|b| b.to_string()).unwrap_or("null".into()),
        trials.iter().map(Trial::json).collect::<Vec<_>>().join(",\n    ")
    );

    let path = out_dir().join("cancel-rescore.json");
    std::fs::write(&path, &artifact).expect("write the artifact");
    println!("\nartifact: {}", path.display());
    println!("{artifact}");

    // Clean up the trial destinations; the artifact is the deliverable.
    let _ = std::fs::remove_dir_all(&dir);
}

/// Stream the whole control file, untraced, returning wall milliseconds.
fn stream_all(ds: &Dataset) -> f64 {
    let start = Instant::now();
    let mut s = ds.stream(&ViewportQuery::all()).expect("stream opens");
    let mut buf = Vec::new();
    while let Some(b) = s.next_into(&mut buf) {
        b.expect("no terminal error");
        buf.clear();
    }
    drop(s);
    quiesce(ds);
    start.elapsed().as_secs_f64() * 1000.0
}

/// The same stream with tracing on, returning wall milliseconds.
fn stream_traced(ds: &Dataset, label: &str) -> f64 {
    let guard = trace::start(TraceKey {
        dataset: "control-145mb".into(),
        physical_id: 0,
        lease_generation: 0,
        label: label.into(),
    })
    .expect("no other trace is running");
    let start = Instant::now();
    let mut s = ds.stream(&ViewportQuery::all()).expect("stream opens");
    let mut buf = Vec::new();
    while let Some(b) = s.next_into(&mut buf) {
        b.expect("no terminal error");
        buf.clear();
    }
    drop(s);
    quiesce(ds);
    let ms = start.elapsed().as_secs_f64() * 1000.0;
    drop(guard);
    ms
}

/// Wait for producer threads to finish before the trace slot is handed on. Without this a straggler
/// stamps into the next run's trace and the exact counts below become wrong for an invisible reason.
fn quiesce(ds: &Dataset) {
    let deadline = Instant::now() + Duration::from_secs(30);
    while ds.connections().active_leases() != 0 && Instant::now() < deadline {
        std::thread::sleep(Duration::from_millis(5));
    }
}

/// C6 — trace-derived numbers against the instruments that already measure the same thing.
fn consistency_cell(ds: &Dataset) -> String {
    let guard = trace::start(TraceKey {
        dataset: "control-145mb".into(),
        physical_id: 0,
        lease_generation: 0,
        label: "consistency".into(),
    })
    .expect("no other trace is running");

    let outer = Instant::now();
    let mut s = ds.stream(&ViewportQuery::all()).expect("stream opens");
    let stats = s.stats();
    let mut buf = Vec::new();
    let mut first_batch_wall = None;
    let mut batches = 0u64;
    let mut rows = 0u64;
    while let Some(info) = s.next_into(&mut buf) {
        let info = info.expect("no terminal error");
        if first_batch_wall.is_none() {
            first_batch_wall = Some(outer.elapsed().as_secs_f64() * 1000.0);
        }
        batches += 1;
        rows += info.rows as u64;
        buf.clear();
    }
    drop(s);
    quiesce(ds);

    let t = guard.trace();
    let events = t.events();
    let dropped = t.dropped();
    let traced_batches = events.iter().filter(|e| e.name == trace::BATCH_FULL).count() as u64;
    let traced_rows: u64 =
        events.iter().filter(|e| e.name == trace::BATCH_FULL).map(|e| e.rows).sum();
    let traced_ttfb = t.segment_ms(trace::LEASE_ACQUIRED, trace::FIRST_BATCH_FULL);
    let sql_to_exec = t.segment_ms(trace::SQL_PREPARED, trace::EXECUTE_RETURNED);
    let exec_to_row = t.segment_ms(trace::EXECUTE_RETURNED, trace::FIRST_SOURCE_ROW);
    drop(guard);

    // §3 C6: exact claims are valid only on a trace that dropped nothing. Reported either way, and
    // the agreement flags are explicitly null when the precondition does not hold.
    let exact_valid = dropped == 0;
    format!(
        r#"{{
    "dropped_records": {dropped},
    "exact_comparisons_valid": {exact_valid},
    "traced_batches": {traced_batches}, "stats_batches": {}, "consumer_batches": {batches},
    "traced_rows": {traced_rows}, "stats_rows": {}, "consumer_rows": {rows},
    "batches_agree": {}, "rows_agree": {},
    "traced_ttfb_ms": {}, "wall_ttfb_ms": {}, "traced_is_contained": {},
    "sql_prepared_to_execute_returned_ms": {},
    "execute_returned_to_first_source_row_ms": {},
    "which_call_holds_the_sort": "the larger of the two segments above. Nothing in this repository established this before; see CANCELLATION-AND-TRACING.md §2."
  }}"#,
        stats.batches_generated.load(Ordering::SeqCst),
        stats.rows_generated.load(Ordering::SeqCst),
        if exact_valid {
            (traced_batches == stats.batches_generated.load(Ordering::SeqCst)).to_string()
        } else {
            "null".into()
        },
        if exact_valid {
            (traced_rows == stats.rows_generated.load(Ordering::SeqCst)).to_string()
        } else {
            "null".into()
        },
        f64_or_null(traced_ttfb),
        f64_or_null(first_batch_wall),
        match (traced_ttfb, first_batch_wall) {
            (Some(t), Some(w)) => (t <= w + 1.0).to_string(),
            _ => "null".into(),
        },
        f64_or_null(sql_to_exec),
        f64_or_null(exec_to_row),
    )
}
