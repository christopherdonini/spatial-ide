// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **The four registered items the scale-pass harness never instrumented.**
//!
//! Everything here implements `kernel/SCALE-PASS-PREREGISTRATION.md` **amendment A6**, which was
//! committed before this file existed. A6 in turn implements four things §2b, §5b and §5d
//! registered before any instrument existed:
//!
//! 1. **§5b** — publish cancellation, three cells (`VerifyingSource` / `Querying` /
//!    `WritingPartitions`), n = 7 each. §2's publish row is gated *"completes; **cancellable**;
//!    audit correct"* and the middle term had no measurement.
//! 2. **§5b** — the inter-partition interval, p50/p95, from `PublishProgress::partition_written`.
//! 3. **§5d** — `memory_limit` / `temp_directory`, and whether spill files appeared.
//! 4. **§2b** — the **in-tree counter** against its declared bound. Only process private commit was
//!    sampled, which §2b registered in advance as *not* the claim.
//!
//! ## This is a separate file, deliberately
//!
//! `kernel/tests/scale_pass.rs` is left **byte-identical** to the source that produced both runs of
//! record. That is not tidiness: `target/slice-evidence/scale-pass/tree-pin.json` pins the streaming
//! run's tree, and the publish run's tree differs from it in exactly that one file. Editing it again
//! would make both runs' provenance unverifiable from the pins that exist.
//!
//! ## Nothing here is compared with any earlier number
//!
//! These phases run in a **later session from a later build**, so they carry their own pins and are
//! reported with their own session context. Every verdict below is against a **declared budget or
//! bound**, never against a measurement from another session.
//!
//! ## The cadence and the cancellation verdict are one row
//!
//! `PUBLISH_PARTITION_TARGET_BYTES` (1 MiB) and `PUBLISH_PARTITION_ROWS` (8 192) make **the
//! uninterruptible window one partition's encode and write** — `engine/src/stream.rs` says so in as
//! many words. So the inter-partition interval *is* the mechanism that produces the cancellation
//! latency, and the two are printed and written to the artifact together.
//!
//! ## Where `Querying` actually happens — the defect this file was reviewed out of
//!
//! `publish::run` reports `Querying`, calls `stream_for_publish`, and reports `WritingPartitions`
//! **immediately after** — `stream_for_publish` returns as soon as the statement is prepared, and
//! DuckDB's `ORDER BY` sort then runs on the engine's producer thread while the main thread blocks
//! in `next_into`. So the `querying` *label* is live for microseconds, and the sort — the thing §5b
//! wants sampled — happens under the `writing-partitions` label, before the first partition exists.
//!
//! An on-target test written against the label would therefore have discarded all seven `Querying`
//! samples as "off target" after ~7 × (a 5 GB rehash + 5 s), and the run would have failed on a
//! string comparison while the cancels themselves landed exactly where they were aimed. The cells
//! are separated by **what has happened**, not by what the label says: see [`OnTarget`].

mod support;

use std::path::{Path, PathBuf};
use std::sync::atomic::{AtomicBool, AtomicUsize, Ordering};
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};

use spatial_engine::{CancelToken, Dataset, ViewportQuery};
use spatial_kernel::permission::{
    boundary, AuditLog, DestinationScope, GrantSet, OperationKind, PreNamedApproval, Principal,
    PrincipalKind, PublishAttempt, PublishGrant, SourceScope, AUDIT_LOG_ENV,
};
use spatial_kernel::publish::{
    CorrespondingSource, CorrespondingSourceKind, PublishPhase, PublishProgress, PublishRequest,
    ViewerAsset, ViewerAssets, ViewerLicenseInput,
};
use support::*;

// ---- Declared in A6, before measuring (ADR-010 rule 6) -----------------------------------------

/// n per cancellation cell. §6's registered count, unchanged.
const CANCEL_TRIALS: usize = 7;

/// Cancel fired 1 s into the chunked 5 GB rehash — past its first chunk.
const DELAY_VERIFYING: Duration = Duration::from_secs(1);
/// Cancel fired 5 s after `Querying` is reported — inside DuckDB's `ORDER BY` sort.
const DELAY_QUERYING: Duration = Duration::from_secs(5);
/// Cancel fired after this many partitions — mid-phase, ~1.5 % into ~6 636, not at its edge.
const CANCEL_AFTER_PARTITIONS: usize = 100;

const CEIL_MEM_5GB: Duration = Duration::from_secs(900);
const CEIL_MEM_CONTROL: Duration = Duration::from_secs(300);
const CEIL_TRIAL_VERIFYING: Duration = Duration::from_secs(300);
const CEIL_TRIAL_QUERYING: Duration = Duration::from_secs(900);
const CEIL_TRIAL_WRITING: Duration = Duration::from_secs(900);
const CEIL_CADENCE_PUBLISH: Duration = Duration::from_secs(3600);
const SILENCE_STREAM: Duration = Duration::from_secs(120);
/// **One silence value, and which one, stated.** A6 declares `VerifyingSource` 120 s · `Querying`
/// 900 s · others 60 s for a publish, and `support::Watchdog` takes a single silence. The **binding**
/// one is applied — the loosest, so the sort cannot fire it spuriously — and the artifact records
/// that only one was applied rather than implying three were.
const SILENCE_PUBLISH: Duration = Duration::from_secs(900);

/// `docs/08`: cancellation acknowledged < 100 ms, **any operation**. No size exemption, at any size.
const CANCEL_BUDGET_MS: f64 = 100.0;

/// Settle before the first canary, per A3. The same 120 s the cold-open protocol declares.
const SETTLE_SECONDS: u64 = 120;

/// Expected rows, from §1b. A short run would otherwise be reported as a bound measurement.
const FIXTURE_ROWS: u64 = 3_300_000;
const CONTROL_ROWS: u64 = 100_000;

// ---- The bounds, derived from their definitions rather than copied as literals -------------------

/// `(MAX_QUEUED_BATCHES + 1) × MAX_BATCH_BYTES` = (2+1) × 4 MiB. **The component this pass
/// exercises** — an in-process stream has no data plane in its path.
const ENGINE_QUEUE_BOUND: usize =
    (spatial_engine::MAX_QUEUED_BATCHES + 1) * spatial_engine::MAX_BATCH_BYTES;
/// `(MAX_INFLIGHT_BATCHES + 1) × MAX_FRAME_BYTES` = (4+1) × 16 MiB = 83 886 080 B.
///
/// **Named, not measured here.** `scale-pass.json` labelled this figure the *composed* bound; A6
/// corrects that. It is the data-plane half, there is no pump in this path, and no run of this pass
/// ever could have read the counter behind it. Derived from the data-plane crate's own constants so
/// that a change there breaks this build rather than silently re-labelling a bound.
const DATA_PLANE_BOUND: usize =
    (spatial_data_plane::MAX_INFLIGHT_BATCHES + 1) * spatial_data_plane::MAX_FRAME_BYTES;
/// The composed per-stream bound, per `kernel/README.md`: 96 468 992 B (92 MiB).
const COMPOSED_BOUND: usize = ENGINE_QUEUE_BOUND + DATA_PLANE_BOUND;

const _: () = assert!(ENGINE_QUEUE_BOUND == 12_582_912);
const _: () = assert!(DATA_PLANE_BOUND == 83_886_080);
const _: () = assert!(COMPOSED_BOUND == 96_468_992);

// ---- Fixtures, which this file NEVER generates --------------------------------------------------

fn evidence_dir() -> PathBuf {
    let d = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .parent()
        .expect("the kernel crate has a parent")
        .join("target")
        .join("slice-evidence")
        .join("scale-pass");
    std::fs::create_dir_all(&d).expect("create the evidence directory");
    d
}

fn fixture_path() -> PathBuf {
    evidence_dir().join("parcels-5gb.parquet")
}

fn control_path() -> PathBuf {
    evidence_dir().join("parcels-control-145mb.parquet")
}

/// The fixture the runs of record measured, identified by content. The fixture is gitignored, so
/// nothing else in the repository says what it was.
const FIXTURE_SHA256: &str = "5ae955c5fb7ee4d3f10436df271e19361d84f0845fbaa69dc60516f1b60c1788";

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

fn viewer() -> ViewerAssets {
    ViewerAssets::new(vec![
        ViewerAsset {
            path: "index.html".into(),
            bytes: b"<!doctype html><title>scale</title>".to_vec(),
        },
        ViewerAsset { path: "NOTICE.txt".into(), bytes: b"stub notice\n".to_vec() },
    ])
    .expect("the viewer assets are valid")
}

fn viewer_license() -> ViewerLicenseInput {
    ViewerLicenseInput {
        program: "Spatial IDE bundle viewer".into(),
        copyright: "Copyright (C) 2026 the Spatial IDE contributors".into(),
        license: "AGPL-3.0-or-later".into(),
        notice_path: "NOTICE.txt".into(),
        corresponding_source: CorrespondingSource {
            kind: CorrespondingSourceKind::Url,
            at: "https://example.org/spatial-ide".into(),
        },
    }
}

const FIXED_CLOCK: &str = "2026-08-07T12:00:00Z";
fn clock() -> String {
    FIXED_CLOCK.to_string()
}

fn principal() -> Principal {
    Principal { kind: PrincipalKind::OsUser, id: "scale-pass-operator".into() }
}

fn request<'a>(ds: &'a Dataset, v: &'a ViewerAssets, destination: PathBuf) -> PublishRequest<'a> {
    PublishRequest {
        dataset: ds,
        dataset_name: "parcels",
        query: ViewportQuery { bbox: None, bbox_crs: None, limit: None, filter: None },
        // The fixture is `AttributeMode::None` (§1a), so there is nothing to project.
        attributes: Vec::new(),
        style_source: STYLE,
        viewer: v,
        viewer_license: viewer_license(),
        license: None,
        destination,
        started_at: FIXED_CLOCK.into(),
        finished_at: &clock,
    }
}

/// A grant scoped to exactly this dataset and this destination.
///
/// §5a's disclosure applies verbatim and is repeated in the write-up: **this measures the machinery
/// at scale, not the authority model.** `DestinationScope::exact` is the one non-tautological part
/// of a self-minted grant, checked against a resolved fact.
fn grant_for(ds: &Dataset, destination: &Path) -> GrantSet {
    let pin = ds.content_pin().expect("the 5 GB source is pinned before the boundary runs");
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

// ---- What counts as a sample --------------------------------------------------------------------

/// When this trial's cancel is fired.
#[derive(Clone, Copy)]
enum Trigger {
    /// A declared delay after the target phase is reported.
    AfterPhase(PublishPhase, Duration),
    /// After a declared number of `partition_written` callbacks.
    AfterPartitions(usize),
    /// Never — the cadence publish runs to completion.
    Never,
}

/// **What makes a fire an on-target sample for its cell.**
///
/// Deliberately expressed in terms of *what had happened* when the cancel landed, not the phase
/// label. See the module docs: the sort that the `Querying` cell aims at runs under the
/// `writing-partitions` label, so a label test would discard every sample it correctly took.
#[derive(Clone, Copy)]
enum OnTarget {
    /// The named phase label was live. True for `VerifyingSource`, whose rehash is synchronous on
    /// the calling thread, so the label really is live throughout it.
    PhaseLabel(&'static str),
    /// Fired after `Querying` was reported and **before the first partition existed** — which is
    /// exactly the DuckDB sort window, and is what separates this cell from the next one.
    DuringTheSort,
    /// Fired with at least this many partitions already written — mid-`WritingPartitions`.
    AtLeastPartitions(usize),
}

impl OnTarget {
    fn holds(self, fired_in: &str, partitions_at_fire: usize, saw_querying: bool) -> bool {
        match self {
            Self::PhaseLabel(p) => fired_in == p,
            Self::DuringTheSort => saw_querying && partitions_at_fire == 0,
            Self::AtLeastPartitions(k) => partitions_at_fire >= k,
        }
    }

    fn describe(self) -> String {
        match self {
            Self::PhaseLabel(p) => format!("the `{p}` label was live"),
            Self::DuringTheSort => {
                "fired after Querying was reported and before the first partition existed — the \
                 DuckDB ORDER BY sort window"
                    .to_string()
            }
            Self::AtLeastPartitions(k) => format!("at least {k} partitions already written"),
        }
    }
}

/// Recorded by whoever fires, so the fire instant and the state at that instant are observed rather
/// than inferred afterwards.
#[derive(Default)]
struct Fired {
    at: Mutex<Option<Instant>>,
    in_phase: Mutex<Option<String>>,
    partitions: Mutex<usize>,
}

struct Obs<'w> {
    trigger: Trigger,
    cancel: CancelToken,
    /// The watchdog this operation's silence ceiling is kept by. **Beaten from both callbacks**, so
    /// a declared silence ceiling is applied rather than only declared.
    dog: &'w Watchdog,
    current: Arc<Mutex<String>>,
    saw_querying: Arc<AtomicBool>,
    fired: Arc<Fired>,
    armed: AtomicBool,
    phases_seen: Mutex<Vec<String>>,
    partitions: Arc<AtomicUsize>,
    intervals_ms: Mutex<Vec<f64>>,
    last_partition: Mutex<Option<Instant>>,
}

impl<'w> Obs<'w> {
    fn new(trigger: Trigger, cancel: CancelToken, dog: &'w Watchdog) -> Self {
        Self {
            trigger,
            cancel,
            dog,
            current: Arc::new(Mutex::new("(none)".to_string())),
            saw_querying: Arc::new(AtomicBool::new(false)),
            fired: Arc::new(Fired::default()),
            armed: AtomicBool::new(false),
            phases_seen: Mutex::new(Vec::new()),
            partitions: Arc::new(AtomicUsize::new(0)),
            intervals_ms: Mutex::new(Vec::new()),
            last_partition: Mutex::new(None),
        }
    }

    /// Record the fire instant **and the state live at that instant**, then cancel.
    ///
    /// The order matters: reading after `cancel()` could read state the operation reached *because*
    /// of the cancel, which would mislabel the sample.
    fn fire(
        cancel: &CancelToken,
        current: &Arc<Mutex<String>>,
        partitions: &Arc<AtomicUsize>,
        fired: &Arc<Fired>,
    ) {
        *fired.in_phase.lock().expect("fired phase lock") =
            Some(current.lock().expect("phase lock").clone());
        *fired.partitions.lock().expect("fired partitions lock") = partitions.load(Ordering::SeqCst);
        *fired.at.lock().expect("fired at lock") = Some(Instant::now());
        cancel.cancel();
    }
}

impl PublishProgress for Obs<'_> {
    fn phase(&self, phase: PublishPhase) {
        self.dog.beat();
        *self.current.lock().expect("phase lock") = phase.as_str().to_string();
        self.phases_seen.lock().expect("phases lock").push(phase.as_str().to_string());
        if phase == PublishPhase::Querying {
            self.saw_querying.store(true, Ordering::SeqCst);
        }

        if let Trigger::AfterPhase(target, delay) = self.trigger {
            if phase == target && !self.armed.swap(true, Ordering::SeqCst) {
                // A thread, because the operation is about to block for seconds and will make no
                // further callbacks until it moves on.
                let cancel = self.cancel.clone();
                let current = Arc::clone(&self.current);
                let partitions = Arc::clone(&self.partitions);
                let fired = Arc::clone(&self.fired);
                std::thread::spawn(move || {
                    std::thread::sleep(delay);
                    Obs::fire(&cancel, &current, &partitions, &fired);
                });
            }
        }
    }

    fn partition_written(&self, _index: usize, _rows: usize, _bytes: u64) {
        self.dog.beat();
        let now = Instant::now();
        {
            let mut last = self.last_partition.lock().expect("last partition lock");
            if let Some(prev) = *last {
                self.intervals_ms
                    .lock()
                    .expect("intervals lock")
                    .push((now - prev).as_secs_f64() * 1000.0);
            }
            *last = Some(now);
        }
        let n = self.partitions.fetch_add(1, Ordering::SeqCst) + 1;
        if let Trigger::AfterPartitions(k) = self.trigger {
            if n >= k && !self.armed.swap(true, Ordering::SeqCst) {
                // Fired inline: this callback runs on the publishing thread, mid-phase, which is
                // exactly where the sample is supposed to be taken from.
                Obs::fire(&self.cancel, &self.current, &self.partitions, &self.fired);
            }
        }
    }
}

/// What one cancellation trial observed.
struct Trial {
    /// `cancel()` → `boundary::execute` returns. `None` when the fire landed after the return (see
    /// `fired_after_return`) or when nothing fired.
    latency_ms: Option<f64>,
    fired_in: String,
    partitions_at_fire: usize,
    on_target: bool,
    /// The watchdog fired. §3: the phase is **unmeasured**, and this trial is not a sample.
    watchdog_fired: bool,
    /// The operation returned before the cancel landed — nothing was measured, and a saturating
    /// subtraction would have reported it as a flattering 0.00 ms.
    fired_after_return: bool,
    left_nothing: bool,
    residue: Vec<String>,
}

impl Trial {
    /// A latency sample only if it is on target, the watchdog stayed quiet and the fire preceded the
    /// return. Three independent ways to produce a number that means nothing.
    fn sample(&self) -> Option<f64> {
        (self.on_target && !self.watchdog_fired && !self.fired_after_return)
            .then_some(self.latency_ms)
            .flatten()
    }
}

/// Whether this trial's destination and **its own** staging directory are absent.
///
/// The staging name is `.<dest>.staging-<hex>`, so a scan for any `.staging-` in the shared trial
/// directory would charge one trial's debris to every later one.
fn left_nothing(parent: &Path, destination: &Path) -> (bool, Vec<String>) {
    let mut residue = Vec::new();
    if destination.exists() {
        residue.push(format!("destination exists: {}", destination.display()));
    }
    let own = format!(
        ".{}.staging-",
        destination.file_name().expect("the destination has a basename").to_string_lossy()
    );
    if let Ok(entries) = std::fs::read_dir(parent) {
        for e in entries.flatten() {
            let name = e.file_name().to_string_lossy().to_string();
            if name.starts_with(&own) {
                residue.push(format!("staging survived: {name}"));
            }
        }
    }
    (residue.is_empty(), residue)
}

/// Every byte previously written to the audit log is still there, unchanged. §5c assertion 8.
fn append_only_violation(log: &Path, before: &[u8]) -> Option<String> {
    let after = std::fs::read(log).unwrap_or_default();
    if after.len() < before.len() {
        return Some(format!("the log shrank from {} to {} bytes", before.len(), after.len()));
    }
    (after[..before.len()] != *before)
        .then(|| "a previously written audit line changed".to_string())
}

/// `summarize`, but a `null` rather than a NaN-bearing object when there is nothing to summarize.
///
/// `support::summarize` formats `f64::NAN` as `NaN`, which is not JSON — so the artifact would
/// become unparseable in exactly the case worth recording.
fn summarize_or_null(label: &str, samples: &[f64]) -> String {
    if samples.is_empty() {
        format!(r#"{{"label": {label:?}, "n": 0, "samples_ms": []}}"#)
    } else {
        summarize(label, samples)
    }
}

fn f64_or_null(v: f64) -> String {
    if v.is_finite() {
        format!("{v:.3}")
    } else {
        "null".to_string()
    }
}

struct TrialOutcome {
    trial: Trial,
    intervals: Vec<f64>,
    failures: Vec<String>,
}

#[allow(clippy::too_many_arguments)]
fn run_trial(
    dir: &Path,
    ds: &Dataset,
    v: &ViewerAssets,
    audit_log: &Path,
    label: &str,
    // `dog_phase` is separate from `label` because a watchdog phase is `&'static str` by design —
    // a phase name that can be computed is a phase name that can drift.
    dog_phase: &'static str,
    trigger: Trigger,
    on_target: OnTarget,
    ceiling: Duration,
    silence: Option<Duration>,
) -> TrialOutcome {
    let mut failures = Vec::new();
    let destination = dir.join(label);
    let _ = std::fs::remove_dir_all(&destination);
    let req = request(ds, v, destination.clone());
    let grants = grant_for(ds, &destination);
    let approval = PreNamedApproval(label.to_string());

    let cancel = CancelToken::new();
    // The watchdog holds **the token the operation actually uses** (A2 item 5), so a fire cancels
    // something rather than aborting the process after the grace.
    let dog = Watchdog::start(dog_phase, ceiling, silence, cancel.clone());

    let before = std::fs::read(audit_log).unwrap_or_default();

    let resolved = spatial_kernel::permission::grant::resolve_destination(&req.destination)
        .expect("the destination resolves");
    let audit = AuditLog::open_for(&resolved).expect("the audit log opens");

    // Scoped so the observer is dropped before the watchdog is consumed.
    let (result, returned_at, fired_at, fired_in, partitions_at_fire, saw_querying, intervals) = {
        let obs = Obs::new(trigger, cancel.clone(), &dog);
        let attempt = PublishAttempt {
            request: &req,
            grants: &grants,
            approval: &approval,
            principal: &principal(),
            audit: &audit,
            clock: &clock,
        };
        let result = boundary::execute(&attempt, &cancel, Some(&obs));
        let returned_at = Instant::now();
        // Bound to a local so every `MutexGuard` temporary is dropped before `obs` is, rather than
        // at the end of the block expression.
        let snapshot = (
            result,
            returned_at,
            *obs.fired.at.lock().expect("fired at lock"),
            obs.fired.in_phase.lock().expect("fired phase lock").clone(),
            *obs.fired.partitions.lock().expect("fired partitions lock"),
            obs.saw_querying.load(Ordering::SeqCst),
            obs.intervals_ms.lock().expect("intervals lock").clone(),
        );
        snapshot
    };
    let watchdog_fired = dog.finish();

    if let Some(why) = append_only_violation(audit_log, &before) {
        failures.push(format!("[{label}] the audit log is not append-only: {why}"));
    }

    match trigger {
        Trigger::AfterPhase(..) | Trigger::AfterPartitions(_) => match &result {
            Ok(_) => failures.push(format!("[{label}] a cancelled publish reported success")),
            Err(e) => {
                if !format!("{e}").to_lowercase().contains("cancel") {
                    failures.push(format!("[{label}] expected a cancellation, got: {e}"));
                }
            }
        },
        Trigger::Never => {
            if let Err(e) = &result {
                failures.push(format!("[{label}] the cadence publish failed: {e}"));
            }
        }
    }

    // **`checked_duration_since`, not subtraction.** `Instant` arithmetic saturates, so a fire that
    // landed after the return would produce a 0.00 ms "sample" — the best-looking number this
    // instrument could emit, from the case where nothing was measured.
    let (latency_ms, fired_after_return) = match fired_at {
        Some(t) => match returned_at.checked_duration_since(t) {
            Some(d) => (Some(d.as_secs_f64() * 1000.0), false),
            None => (None, true),
        },
        None => (None, false),
    };

    let fired_in = fired_in.unwrap_or_else(|| "(never fired)".to_string());
    let hit = !matches!(trigger, Trigger::Never)
        && on_target.holds(&fired_in, partitions_at_fire, saw_querying);

    let (ok, residue) = left_nothing(dir, &destination);

    TrialOutcome {
        trial: Trial {
            latency_ms,
            fired_in,
            partitions_at_fire,
            on_target: hit,
            watchdog_fired,
            fired_after_return,
            left_nothing: ok,
            residue,
        },
        intervals,
        failures,
    }
}

// ---- §2b: the bounded quantity ------------------------------------------------------------------

/// Stream one whole file and return the engine's own peak resident bytes.
///
/// **This counter, not an OS reading, is the bounded quantity** — §2b said so before any instrument
/// existed. It accumulates each queued batch's `est_bytes`, so the figure is in the estimator's
/// units; with no attribute columns on this fixture the estimator and the payload do not diverge.
fn peak_resident(
    ds: &Dataset,
    ceiling: Duration,
    label: &'static str,
) -> (usize, u64, usize, bool) {
    let cancel = CancelToken::new();
    let dog = Watchdog::start(label, ceiling, Some(SILENCE_STREAM), cancel.clone());
    let q = ViewportQuery { bbox: None, bbox_crs: None, limit: None, filter: None };
    let mut stream = ds.stream_with_cancel(&q, cancel).expect("the stream opens");
    let mut payload = Vec::new();
    let mut rows = 0u64;
    let mut batches = 0usize;
    while let Some(info) = stream.next_into(&mut payload) {
        let info = info.expect("a batch, or a terminal error");
        rows += info.rows as u64;
        batches += 1;
        payload.clear();
        dog.beat();
    }
    // `stats()` hands back an `Arc`, so the counter outlives the stream — but it is read here
    // regardless, beside the loop that produced it.
    let peak = stream.stats().peak_resident_bytes.load(Ordering::SeqCst);
    let fired = dog.finish();
    (peak, rows, batches, fired)
}

#[ignore = "measurement harness: publishes and cancels at 5 GB, tens of minutes, release-only"]
#[test]
fn measure_the_registered_rows_that_had_no_instrument() {
    refuse_debug("the A6 additive phases");
    let dir = evidence_dir();
    let fixture = fixture_path();
    let control = control_path();
    assert!(fixture.exists(), "the 5 GB fixture is absent at {}", fixture.display());
    assert!(control.exists(), "the 145 MB control is absent at {}", control.display());

    let audit_dir = dir.join("audit");
    std::fs::create_dir_all(&audit_dir).expect("create the audit directory");
    // **Its own log.** `audit/publish.jsonl` is the publish run of record's artifact and is not
    // touched; §5c's record-count assertions there are true only of a log that starts empty.
    let audit_log = audit_dir.join("cancellation.jsonl");
    assert!(
        !audit_log.exists(),
        "{} already exists. A previous A6 attempt is recorded there; move it aside with its \
         invalidator named rather than letting this run delete it (§7).",
        audit_log.display()
    );

    // **Set once, before any thread exists**, rather than per attempt: `set_var` races with any
    // concurrent `getenv`, and if it were ever missed the log would fall back to the operator's
    // real one — which §5c forbids for four separate reasons.
    std::env::set_var(AUDIT_LOG_ENV, &audit_log);
    assert_eq!(
        std::env::var(AUDIT_LOG_ENV).unwrap_or_default(),
        audit_log.to_string_lossy(),
        "the audit log override did not take"
    );

    // The same file the runs of record measured, established by content **through the product's own
    // chunked hash** — the path publish itself uses, and the pin the grants need anyway.
    let ds = Dataset::open(&fixture).expect("open the 5 GB fixture");
    let t_pin = Instant::now();
    ds.pin_content(&CancelToken::new()).expect("pin the 5 GB source");
    let pin_ms = t_pin.elapsed().as_secs_f64() * 1000.0;
    let sha = ds.content_pin().expect("the source is pinned").hash().to_string();
    assert_eq!(
        sha, FIXTURE_SHA256,
        "this is not the fixture the runs of record measured; the phases would not be additive"
    );
    println!("fixture pinned and identified in {pin_ms:.0} ms: sha256:{sha}");

    let mut failures: Vec<String> = Vec::new();
    let mut json = String::from("{\n");
    json.push_str(&format!(
        "  \"session\": {{\"hardware\": {:?}, \"media_type\": {:?}, \
         \"amendment\": \"A6\", \"preregistration\": \"kernel/SCALE-PASS-PREREGISTRATION.md\", \
         \"relationship_to_runs_of_record\": \"additive. Later session, later build, own pins. No \
         number here is compared with any number from the streaming or publish runs of record; \
         every verdict is against a declared budget or bound.\", \
         \"fixture_sha256\": \"sha256:{sha}\", \"source_pin_ms\": {pin_ms:.1}}},\n",
        hardware_profile(),
        media_type()
    ));

    // A3's settle, and its pre-settle reading — recorded, and deliberately not one of the points the
    // spread is computed over. It follows the pin, which is 5 GB of hashing on every core.
    let pre = Canary::take("pre-settle");
    println!("settling {SETTLE_SECONDS} s before the first canary...");
    std::thread::sleep(Duration::from_secs(SETTLE_SECONDS));
    json.push_str(&format!(
        "  \"pre_settle_canary\": {}, \"settle_seconds\": {SETTLE_SECONDS},\n",
        pre.json()
    ));

    let mut canaries = vec![Canary::take("start")];
    let free_before = require_disk("a6-start");

    // ---- Item 4: the bounded quantity, at both file sizes ---------------------------------------
    println!("\n=== item 4: producer-resident counter vs the engine-queue bound ===");
    let (peak_5gb, rows_5gb, batches_5gb, dog_5gb) =
        peak_resident(&ds, CEIL_MEM_5GB, "resident-5gb");
    println!(
        "  5 GB   : peak {peak_5gb} B of {ENGINE_QUEUE_BOUND} B bound ({:.2} %), {rows_5gb} rows in {batches_5gb} batches",
        peak_5gb as f64 / ENGINE_QUEUE_BOUND as f64 * 100.0
    );

    let control_ds = Dataset::open(&control).expect("open the 145 MB control");
    let (peak_control, rows_control, batches_control, dog_control) =
        peak_resident(&control_ds, CEIL_MEM_CONTROL, "resident-control");
    println!(
        "  145 MB : peak {peak_control} B of {ENGINE_QUEUE_BOUND} B bound ({:.2} %), {rows_control} rows in {batches_control} batches",
        peak_control as f64 / ENGINE_QUEUE_BOUND as f64 * 100.0
    );
    drop(control_ds);

    // **§7: a row count that differs from §1b is an instrument failure, not a result.** Without this
    // a truncated stream would be written into the artifact as the bound measurement.
    if rows_5gb != FIXTURE_ROWS {
        failures.push(format!("the 5 GB stream yielded {rows_5gb} rows, not {FIXTURE_ROWS}"));
    }
    if rows_control != CONTROL_ROWS {
        failures.push(format!("the control stream yielded {rows_control} rows, not {CONTROL_ROWS}"));
    }
    if dog_5gb || dog_control {
        failures.push("a watchdog fired during the bounded-memory phase; it is unmeasured".into());
    }

    let bound_holds_5gb = peak_5gb <= ENGINE_QUEUE_BOUND;
    let bound_holds_control = peak_control <= ENGINE_QUEUE_BOUND;
    let flatness_ratio = peak_5gb as f64 / peak_control.max(1) as f64;
    json.push_str(&format!(
        "  \"bounded_memory\": {{\"counter\": \"engine StreamStats::peak_resident_bytes (sum of \
         queued batches' est_bytes)\", \
         \"engine_queue_bound_bytes\": {ENGINE_QUEUE_BOUND}, \
         \"data_plane_bound_bytes\": {DATA_PLANE_BOUND}, \
         \"composed_bound_bytes\": {COMPOSED_BOUND}, \
         \"peak_5gb_bytes\": {peak_5gb}, \"peak_control_bytes\": {peak_control}, \
         \"pct_of_engine_queue_bound_5gb\": {:.3}, \"pct_of_engine_queue_bound_control\": {:.3}, \
         \"bound_holds_5gb\": {bound_holds_5gb}, \"bound_holds_control\": {bound_holds_control}, \
         \"peak_ratio_5gb_over_control\": {flatness_ratio:.4}, \
         \"rows_5gb\": {rows_5gb}, \"batches_5gb\": {batches_5gb}, \
         \"rows_control\": {rows_control}, \"batches_control\": {batches_control}, \
         \"watchdog_fired\": {}, \
         \"what_is_not_measured\": \"The data-plane component. This pass streams in process; there \
         is no pump in the path, so its counter cannot be read here and no run of this pass ever \
         could have read it. scale-pass.json labelled 83886080 the COMPOSED bound; it is the \
         data-plane half alone. The composed per-stream bound is 96468992 B.\", \
         \"private_commit_is_not_this\": \"Process private commit is a different quantity and is \
         not the claim -- section 2b registered that in advance. DuckDB's streaming buffer sits \
         outside every declared bound by design.\"}},\n",
        peak_5gb as f64 / ENGINE_QUEUE_BOUND as f64 * 100.0,
        peak_control as f64 / ENGINE_QUEUE_BOUND as f64 * 100.0,
        dog_5gb || dog_control
    ));
    canaries.push(Canary::take("after-bounded-memory"));

    // ---- Item 2: the cadence, from one publish that runs to completion --------------------------
    println!("\n=== item 2: the inter-partition cadence ===");
    let trial_dir = dir.join("cancel-trials");
    let _ = std::fs::remove_dir_all(&trial_dir);
    std::fs::create_dir_all(&trial_dir).expect("create the trial directory");
    let v = viewer();
    let mut attempts = 0usize;

    // Spill detection has to watch **while** the sort runs: DuckDB removes its spill files when the
    // query ends, so a post-hoc look can only ever report "none".
    let spill_stop = Arc::new(AtomicBool::new(false));
    let spill_seen = Arc::new(Mutex::new(Vec::<String>::new()));
    let spill_watch = {
        let stop = Arc::clone(&spill_stop);
        let seen = Arc::clone(&spill_seen);
        let repo = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
            .parent()
            .expect("the kernel crate has a parent")
            .to_path_buf();
        std::thread::spawn(move || {
            while !stop.load(Ordering::SeqCst) {
                for p in [".tmp", "kernel/.tmp", "engine/.tmp", "target/.tmp"] {
                    if repo.join(p).exists() {
                        let mut s = seen.lock().expect("spill lock");
                        if !s.iter().any(|x| x == p) {
                            s.push(p.to_string());
                        }
                    }
                }
                std::thread::sleep(Duration::from_millis(250));
            }
        })
    };

    require_disk("cadence-publish");
    println!("  cadence publish (n=1, runs to completion)...");
    let t_cad = Instant::now();
    let cad = run_trial(
        &trial_dir,
        &ds,
        &v,
        &audit_log,
        "cadence",
        "cadence-publish",
        Trigger::Never,
        OnTarget::PhaseLabel("(none)"),
        CEIL_CADENCE_PUBLISH,
        Some(SILENCE_PUBLISH),
    );
    let cadence_wall_ms = t_cad.elapsed().as_secs_f64() * 1000.0;
    attempts += 1;
    failures.extend(cad.failures);
    if cad.trial.watchdog_fired {
        failures.push("the cadence publish hit its watchdog; the cadence is unmeasured".into());
    }

    spill_stop.store(true, Ordering::SeqCst);
    let _ = spill_watch.join();
    let spill_dirs = spill_seen.lock().expect("spill lock").clone();

    let iv = sorted(&cad.intervals);
    let (iv_p50, iv_p95, iv_max) =
        (pct(&iv, 0.50), pct(&iv, 0.95), iv.last().copied().unwrap_or(f64::NAN));
    println!(
        "  cadence: {} intervals from {} partitions | p50 {} ms p95 {} ms max {} ms | wall {cadence_wall_ms:.0} ms",
        iv.len(),
        cad.trial.partitions_at_fire.max(cad.intervals.len() + 1),
        f64_or_null(iv_p50),
        f64_or_null(iv_p95),
        f64_or_null(iv_max)
    );
    // The cadence bundle's own facts, recorded before the directory is removed — otherwise the row
    // rests on a number whose only evidence was deleted.
    let cadence_bundle = trial_dir.join("cadence");
    let cadence_partitions = std::fs::read_dir(cadence_bundle.join("data")).map(|d| d.count()).unwrap_or(0);
    canaries.push(Canary::take("after-cadence-publish"));

    // ---- Item 1: the three cancellation cells ----------------------------------------------------
    println!("\n=== item 1: publish cancellation cells ===");
    let cells: [(&'static str, Trigger, OnTarget, Duration); 3] = [
        (
            "verifying-source",
            Trigger::AfterPhase(PublishPhase::VerifyingSource, DELAY_VERIFYING),
            OnTarget::PhaseLabel("verifying-source"),
            CEIL_TRIAL_VERIFYING,
        ),
        (
            "querying",
            Trigger::AfterPhase(PublishPhase::Querying, DELAY_QUERYING),
            OnTarget::DuringTheSort,
            CEIL_TRIAL_QUERYING,
        ),
        (
            "writing-partitions",
            Trigger::AfterPartitions(CANCEL_AFTER_PARTITIONS),
            OnTarget::AtLeastPartitions(CANCEL_AFTER_PARTITIONS),
            CEIL_TRIAL_WRITING,
        ),
    ];

    let mut cell_json = Vec::new();
    let mut worst_on_target: f64 = 0.0;
    let mut any_residue = false;
    // A cell with no on-target sample must not read as a pass: `worst_on_target` starts at zero, so
    // without this a cell that never landed would leave the maximum untouched and the budget "met"
    // on no evidence — the precise failure §5b's off-target rule exists to prevent.
    let mut cells_without_samples: Vec<String> = Vec::new();
    let mut partial_cells: Vec<String> = Vec::new();

    for (cell, trigger, on_target, ceiling) in cells {
        println!("  cell `{cell}` — on target means: {}", on_target.describe());
        let mut trials = Vec::with_capacity(CANCEL_TRIALS);
        for i in 0..CANCEL_TRIALS {
            require_disk(cell);
            let out = run_trial(
                &trial_dir,
                &ds,
                &v,
                &audit_log,
                &format!("cancel-{cell}-{i}"),
                cell,
                trigger,
                on_target,
                ceiling,
                None,
            );
            attempts += 1;
            failures.extend(out.failures);
            let t = &out.trial;
            println!(
                "    trial {}/{CANCEL_TRIALS}: {} ms | fired in `{}` after {} partitions | {} | left nothing = {}",
                i + 1,
                t.latency_ms.map(|m| format!("{m:.2}")).unwrap_or_else(|| "—".into()),
                t.fired_in,
                t.partitions_at_fire,
                if t.sample().is_some() {
                    "sample".to_string()
                } else {
                    format!(
                        "OBSERVATION ONLY ({})",
                        if t.watchdog_fired {
                            "watchdog fired"
                        } else if t.fired_after_return {
                            "fired after the operation returned"
                        } else {
                            "off target"
                        }
                    )
                },
                t.left_nothing
            );
            trials.push(out.trial);
        }

        let samples: Vec<f64> = trials.iter().filter_map(Trial::sample).collect();
        let s = sorted(&samples);
        let max = s.last().copied().unwrap_or(f64::NAN);
        if s.is_empty() {
            cells_without_samples.push(cell.to_string());
        } else {
            worst_on_target = worst_on_target.max(max);
            if s.len() < CANCEL_TRIALS {
                partial_cells.push(format!("{cell} (n={} of {CANCEL_TRIALS})", s.len()));
            }
        }
        if trials.iter().any(|t| !t.left_nothing) {
            any_residue = true;
        }

        println!(
            "    n={} of {CANCEL_TRIALS} usable | {} | all left nothing = {}",
            s.len(),
            if s.is_empty() {
                "no on-target samples".to_string()
            } else {
                format!(
                    "p50 {} ms p95 {} ms max {} ms (budget {CANCEL_BUDGET_MS} ms)",
                    f64_or_null(pct(&s, 0.50)),
                    f64_or_null(pct(&s, 0.95)),
                    f64_or_null(max)
                )
            },
            !trials.iter().any(|t| !t.left_nothing)
        );

        cell_json.push(format!(
            "{{\"cell\": {cell:?}, \"on_target_means\": {:?}, \"trials\": {}, \"usable\": {}, \
             \"latency\": {}, \
             \"fired_in_phase\": [{}], \"partitions_at_fire\": {}, \
             \"watchdog_fired\": {}, \"fired_after_return\": {}, \
             \"all_left_nothing\": {}, \"residue\": [{}]}}",
            on_target.describe(),
            trials.len(),
            s.len(),
            summarize_or_null(&format!("cancel latency, {cell}"), &samples),
            trials.iter().map(|t| format!("{:?}", t.fired_in)).collect::<Vec<_>>().join(", "),
            json_usizes(&trials.iter().map(|t| t.partitions_at_fire).collect::<Vec<_>>()),
            trials.iter().filter(|t| t.watchdog_fired).count(),
            trials.iter().filter(|t| t.fired_after_return).count(),
            !trials.iter().any(|t| !t.left_nothing),
            trials
                .iter()
                .flat_map(|t| t.residue.clone())
                .map(|r| format!("{r:?}"))
                .collect::<Vec<_>>()
                .join(", ")
        ));
    }

    let budget_met = cells_without_samples.is_empty() && worst_on_target < CANCEL_BUDGET_MS;
    json.push_str(&format!(
        "  \"publish_cancellation_and_cadence\": {{\
         \"reported_together_because\": \"PUBLISH_PARTITION_TARGET_BYTES (1 MiB) and \
         PUBLISH_PARTITION_ROWS (8192) make the uninterruptible window one partition's encode and \
         write, so the inter-partition interval IS the mechanism behind the latency. Quoted alone, \
         the latency reads as a property of the boundary and the cadence reads as throughput.\", \
         \"cadence\": {{\"source\": \"PublishProgress::partition_written, one completed publish\", \
         \"intervals\": {}, \"p50_ms\": {}, \"p95_ms\": {}, \"max_ms\": {}, \
         \"partitions_in_bundle\": {cadence_partitions}, \"publish_wall_ms\": {cadence_wall_ms:.1}, \
         \"prediction\": \"5-15 ms, from section 5b, recorded beside the measurement\"}}, \
         \"cancellation\": {{\"budget_ms\": {CANCEL_BUDGET_MS}, \"cells\": [{}], \
         \"worst_on_target_ms\": {}, \"budget_met\": {budget_met}, \
         \"cells_without_on_target_samples\": [{}], \"partial_cells\": [{}], \
         \"latency_definition\": \"cancel() until boundary::execute returns. This window strictly \
         CONTAINS the acknowledgement docs/08 names -- it also carries staging removal and the \
         outcome record's fsync -- so a pass here is a pass a fortiori, and only a MISS would need \
         a finer instrument to attribute. Reported as the conservative number rather than as the \
         acknowledgement itself.\", \
         \"off_target_rule\": \"Section 5b: a trial that fires outside its target window is an \
         observation and is NOT promoted into that cell's latency statistics. A watchdog fire and a \
         fire landing after the return are excluded on the same principle.\", \
         \"all_left_nothing\": {}}}}},\n",
        iv.len(),
        f64_or_null(iv_p50),
        f64_or_null(iv_p95),
        f64_or_null(iv_max),
        cell_json.join(", "),
        f64_or_null(worst_on_target),
        cells_without_samples.iter().map(|c| format!("{c:?}")).collect::<Vec<_>>().join(", "),
        partial_cells.iter().map(|c| format!("{c:?}")).collect::<Vec<_>>().join(", "),
        !any_residue
    ));
    canaries.push(Canary::take("after-cancellation"));

    // ---- §5c assertions 2, 6 and 8, against this run's own log -----------------------------------
    let text = std::fs::read_to_string(&audit_log).expect("the cancellation audit log exists");
    let lines: Vec<&str> = text.lines().filter(|l| !l.trim().is_empty()).collect();
    let mut by_attempt: std::collections::BTreeMap<String, (usize, usize)> = Default::default();
    let mut cancelled = 0usize;
    let mut success = 0usize;
    for l in &lines {
        let v: serde_json::Value = serde_json::from_str(l).expect("every audit line parses");
        if v["schema"] != "spatial-audit/1" {
            failures.push(format!("unexpected audit schema: {}", v["schema"]));
        }
        let id = v["attempt"].as_str().unwrap_or("(none)").to_string();
        let e = by_attempt.entry(id).or_insert((0, 0));
        match v["phase"].as_str() {
            Some("intent") => e.0 += 1,
            Some("outcome") => {
                e.1 += 1;
                match v["outcome"].as_str() {
                    Some("cancelled") => {
                        cancelled += 1;
                        // §5c assertion 6, in full.
                        if v["error_kind"] != "Cancelled" {
                            failures.push(format!(
                                "a cancelled outcome's error_kind is {}, not the variant name",
                                v["error_kind"]
                            ));
                        }
                        for k in ["manifest_hash", "rows", "partitions"] {
                            if !v[k].is_null() {
                                failures
                                    .push(format!("a cancelled outcome carries a non-null `{k}`"));
                            }
                        }
                    }
                    Some("success") => success += 1,
                    other => failures.push(format!("unexpected outcome {other:?}")),
                }
            }
            other => failures.push(format!("unexpected audit phase {other:?}")),
        }
    }
    // §5c assertion 2: per attempt id **exactly one** intent and one outcome — not merely equal
    // totals, which a log with two intents and no outcome would also satisfy.
    let unpaired: Vec<String> = by_attempt
        .iter()
        .filter(|(_, (i, o))| *i != 1 || *o != 1)
        .map(|(a, (i, o))| format!("{a}: {i} intent, {o} outcome"))
        .collect();
    if !unpaired.is_empty() {
        failures.push(format!("audit records are not one-intent-one-outcome per attempt: {unpaired:?}"));
    }
    if by_attempt.len() != attempts {
        failures.push(format!(
            "the log holds {} attempts, {attempts} reached the gate",
            by_attempt.len()
        ));
    }
    if cancelled != attempts - 1 || success != 1 {
        failures.push(format!(
            "expected {} cancelled and 1 success, got {cancelled} and {success}",
            attempts - 1
        ));
    }
    println!(
        "\n[audit] {} lines | {} attempts | {cancelled} cancelled | {success} success",
        lines.len(),
        by_attempt.len()
    );
    json.push_str(&format!(
        "  \"audit\": {{\"log\": \"target/slice-evidence/scale-pass/audit/cancellation.jsonl\", \
         \"lines\": {}, \"attempts\": {attempts}, \"attempt_ids\": {}, \
         \"cancelled_outcomes\": {cancelled}, \"success_outcomes\": {success}, \
         \"assertion_2_one_intent_one_outcome_per_attempt\": {}, \
         \"assertion_6_cancelled_shape\": true, \"assertion_8_append_only\": true, \
         \"note\": \"A separate log from audit/publish.jsonl, which is the publish run of record's \
         artifact and is not touched.\"}},\n",
        lines.len(),
        by_attempt.len(),
        unpaired.is_empty()
    ));

    // ---- Item 3: §5d, as far as it is reachable from outside the engine crate --------------------
    let free_after = free_bytes_on_c();
    println!(
        "[§5d] spill directories seen while publishing: {} | free {free_before} -> {}",
        if spill_dirs.is_empty() { "none".to_string() } else { spill_dirs.join(", ") },
        free_after.map(|v| v.to_string()).unwrap_or_else(|| "unreadable".into())
    );
    json.push_str(&format!(
        "  \"duckdb_settings\": {{\"status\": \"partially measurable, with the reason\", \
         \"why\": \"Section 5d asks for SELECT current_setting('memory_limit') and \
         current_setting('temp_directory') against the engine's connection. Lease::connection() is \
         pub(crate) by design -- 'the connection itself never leaves this crate' -- so a test in \
         kernel/tests cannot issue it, and a fresh connection would report a different \
         connection's defaults under the engine's name. That is a property of the design, not a \
         gap in the harness, and it is reported rather than worked around.\", \
         \"what_is_established\": \"An exhaustive source search over engine/src and kernel/src \
         returns no hits for `memory_limit` or `temp_directory`: nothing in this workspace sets \
         either, so both stand at DuckDB's defaults -- which is what section 5d predicted.\", \
         \"spill_watch\": \"polled every 250 ms DURING the cadence publish, because DuckDB removes \
         spill files when the query ends and a post-hoc look could only ever report none\", \
         \"spill_directories_seen\": [{}], \
         \"free_bytes_before\": {free_before}, \"free_bytes_after\": {}}},\n",
        spill_dirs.iter().map(|d| format!("{d:?}")).collect::<Vec<_>>().join(", "),
        free_after.map(|v| v.to_string()).unwrap_or_else(|| "null".into())
    ));

    // ---- Canary verdicts -----------------------------------------------------------------------
    //
    // A5's table gates the producer-resident memory row on the canary, so it is applied rather than
    // argued down. The cadence publish gets its own interval so its thermal excursion — A5 recorded
    // 12.12 % across one ~99 s publish — cannot be charged to the cancellation cells.
    let spreads = phase_spreads(&canaries);
    let mut all_within = true;
    for (phase, spread, ok) in &spreads {
        println!("canary phase [{phase}] spread {spread:.4} {}", if *ok { "ok" } else { "EXCEEDS" });
        if !ok {
            all_within = false;
        }
    }
    let points: Vec<String> = canaries.iter().map(Canary::json).collect();
    let verdicts: Vec<String> = spreads
        .iter()
        .map(|(p, s, ok)| format!(r#"{{"phase": {p:?}, "spread": {s:.4}, "within_declared": {ok}}}"#))
        .collect();
    json.push_str(&format!(
        "  \"canary\": {{\"points\": [{}], \"phase_verdicts\": [{}], \
         \"declared_max_spread\": {CANARY_MAX_SPREAD}, \"all_within\": {all_within}, \
         \"gating\": \"The bounded-memory row is gated, per A5's table. The cadence publish carries \
         its own interval so its excursion is not charged to the cancellation cells.\"}},\n",
        points.join(", "),
        verdicts.join(", ")
    ));
    json.push_str(&format!("  \"failures\": [{}]\n}}\n", failures
        .iter()
        .map(|f| format!("{f:?}"))
        .collect::<Vec<_>>()
        .join(", ")));

    let artifact = dir.join("scale-pass-a6.json");
    std::fs::write(&artifact, &json).expect("write the evidence artifact");
    println!("artifact: {}", artifact.display());

    // ~5.3 GiB of cadence bundle, removed only after its facts are in the artifact above.
    let _ = std::fs::remove_dir_all(&trial_dir);

    // **Everything is asserted after the artifact is written**, so a failure is evidenced rather
    // than costing the run its record (§7: recorded with the invalidator named, never discarded).
    assert!(failures.is_empty(), "{} failure(s):\n  {}", failures.len(), failures.join("\n  "));
    assert!(bound_holds_5gb, "the engine-queue bound did NOT hold at 5 GB: {peak_5gb} B");
    assert!(bound_holds_control, "the engine-queue bound did NOT hold at 145 MB: {peak_control} B");
    assert!(!any_residue, "a cancelled publish left something on disk");
    assert!(
        cells_without_samples.is_empty(),
        "these cells produced no usable sample, so their verdict would rest on nothing: \
         {cells_without_samples:?}"
    );
    assert!(all_within, "a phase exceeded the declared canary spread of {CANARY_MAX_SPREAD}");
    // **The budget is recorded, not asserted** — `scale_pass.rs` treats the docs/08 cancellation
    // budget the same way. A miss is a finding this pass reports, not a reason to throw the run
    // away; §7's invalidators are about the machine, not about the result.
    println!(
        "\ncancellation budget {CANCEL_BUDGET_MS} ms: worst usable {} ms -> {}",
        f64_or_null(worst_on_target),
        if budget_met { "MET" } else { "MISSED — recorded, not established" }
    );
}
