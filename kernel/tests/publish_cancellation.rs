// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! Cancellation reaching **inside** a publish, rather than only between its partitions.
//!
//! ## Why this file exists separately from `publish.rs`
//!
//! `publish.rs` asserts what a bundle *is*. This file asserts when the operation stops, which is a
//! different property with a different failure mode: every test here would still pass if the bundle
//! format were broken, and every test there would still pass if cancellation took a minute.
//!
//! ## What the fifth section measured, and what these tests pin
//!
//! `kernel/RESULTS.md`'s fifth section measured publish cancellation at a `WritingPartitions` p95 of
//! **418.321 ms** and a single sort-window sample of **3,920.251 ms**, against `docs/08`'s
//! "acknowledged < 100 ms, any operation". Two mechanisms were behind it, and each has a test here:
//!
//! 1. **The consumer could not look at its token.** `BatchStream::next_into` blocks with no timeout,
//!    so while DuckDB sorted, the publishing thread was parked and every `check_cancel` was
//!    unreachable. The interrupt had already fired — nobody was awake to notice.
//! 2. **One partition's write was one uninterruptible act**, so a write that stalled was waited out
//!    in full.
//!
//! **These are correctness tests, not measurements.** They assert that the observation *happens* and
//! in what order; they assert no latency and fill no results table. `docs/08` numbers come from the
//! declared harnesses on the declared fixtures, and a number taken on a shared CI runner is not a
//! smaller number, it is not a measurement (`product-ci-rust.yml`). The one timing assertion here is
//! a generous liveness bound whose only job is to fail if the wait became unbounded again.

use std::path::{Path, PathBuf};
use std::sync::atomic::{AtomicBool, AtomicUsize, Ordering};
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};

use spatial_engine::fixture::{
    write_geoparquet, AttributeMode, CrsMode, FixtureSpec, IdentityMode,
};
use spatial_engine::{CancelToken, Dataset, ViewportQuery};
use spatial_kernel::publish::{
    publish_unguarded, CorrespondingSource, CorrespondingSourceKind, PublishError, PublishPhase,
    PublishProgress, PublishRequest, ViewerAsset, ViewerAssets, ViewerLicenseInput,
};

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

/// Large enough that the `ORDER BY` and the partition writes are not instantaneous, small enough to
/// belong in the ordinary suite. **No test here asserts that this is slow** — the sort-window tests
/// all state what they do when the phase does not appear, so a faster machine weakens coverage
/// rather than reddening the build.
const FEATURES: usize = 60_000;

fn workspace(name: &str) -> PathBuf {
    let d = std::env::temp_dir().join("spatial-kernel-publish-cancellation").join(name);
    let _ = std::fs::remove_dir_all(&d);
    std::fs::create_dir_all(&d).unwrap();
    d
}

fn fixture(dir: &Path) -> PathBuf {
    let path = dir.join("parcels.parquet");
    write_geoparquet(
        &path,
        &FixtureSpec {
            features: FEATURES,
            attributes: AttributeMode::CategoricalZone,
            crs_mode: CrsMode::DeclaredLv95,
            identity: IdentityMode::NativeUnique,
            ..Default::default()
        },
    )
    .unwrap();
    path
}

fn pinned(path: &Path) -> Dataset {
    let ds = Dataset::open(path).unwrap();
    ds.pin_content(&CancelToken::new()).unwrap();
    ds
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

fn request<'a>(
    ds: &'a Dataset,
    viewer: &'a ViewerAssets,
    destination: PathBuf,
) -> PublishRequest<'a> {
    PublishRequest {
        dataset: ds,
        dataset_name: "parcels",
        query: ViewportQuery::all(),
        attributes: vec!["zone".into()],
        style_source: STYLE,
        viewer,
        viewer_license: viewer_license(),
        license: None,
        destination,
        started_at: "2026-08-07T09:00:00Z".into(),
        finished_at: &FIXED_FINISH,
    }
}

fn fixed_finish() -> String {
    "2026-08-07T09:00:01Z".into()
}

static FIXED_FINISH: fn() -> String = fixed_finish;

/// Everything an observer saw, in order, so a test asserts a **sequence** rather than a final state.
#[derive(Default)]
struct Recorder {
    phases: Mutex<Vec<PublishPhase>>,
    /// `(partition index, bytes_written, bytes_total)` for every byte-cadence report.
    write_progress: Mutex<Vec<(usize, u64, u64)>>,
    /// Set the first time the operation says it noticed a cancellation.
    acknowledged_at: Mutex<Option<Instant>>,
    partitions_written: AtomicUsize,
}

impl Recorder {
    fn phases(&self) -> Vec<PublishPhase> {
        self.phases.lock().unwrap().clone()
    }
    fn saw(&self, p: PublishPhase) -> bool {
        self.phases().contains(&p)
    }
}

impl PublishProgress for Recorder {
    fn phase(&self, phase: PublishPhase) {
        self.phases.lock().unwrap().push(phase);
    }
    fn partition_written(&self, _: usize, _: usize, _: u64) {
        self.partitions_written.fetch_add(1, Ordering::SeqCst);
    }
    fn partition_write_progress(&self, index: usize, written: u64, total: u64) {
        self.write_progress.lock().unwrap().push((index, written, total));
    }
    fn cancellation_observed(&self, at: Instant) {
        let mut slot = self.acknowledged_at.lock().unwrap();
        assert!(slot.is_none(), "the acknowledgement must be reported at most once per operation");
        *slot = Some(at);
    }
}

// ---------------------------------------------------------------------------------------------
// The sort window
// ---------------------------------------------------------------------------------------------

/// **The window the fifth section could only hit 1 time in 7, now reachable on purpose.**
///
/// `QueryRunning` is emitted the first time the consumer waits out a full poll interval with no
/// batch. That is reachable *only* with a batch demanded and none delivered — inside the sort, by
/// construction rather than by wall-clock luck. The fifth section fired on a fixed 5 s delay after
/// `Querying`, which had already carried the operation into partition writing in six of seven
/// trials; the trigger here cannot make that mistake because it is the phase itself.
#[test]
fn a_cancel_inside_the_sort_is_observed_rather_than_waited_out() {
    struct OnQueryRunning {
        rec: Arc<Recorder>,
        token: CancelToken,
    }
    impl PublishProgress for OnQueryRunning {
        fn phase(&self, phase: PublishPhase) {
            self.rec.phase(phase);
            if phase == PublishPhase::QueryRunning {
                self.token.cancel();
            }
        }
        fn partition_written(&self, i: usize, r: usize, b: u64) {
            self.rec.partition_written(i, r, b)
        }
        fn partition_write_progress(&self, i: usize, w: u64, t: u64) {
            self.rec.partition_write_progress(i, w, t)
        }
        fn cancellation_observed(&self, at: Instant) {
            self.rec.cancellation_observed(at)
        }
    }

    let d = workspace("sort-window");
    let ds = pinned(&fixture(&d));
    let v = viewer();
    let dest = d.join("out");
    let cancel = CancelToken::new();
    let rec = Arc::new(Recorder::default());
    let obs = OnQueryRunning { rec: Arc::clone(&rec), token: cancel.clone() };

    let started = Instant::now();
    let outcome = publish_unguarded(&request(&ds, &v, dest.clone()), &cancel, Some(&obs));
    let elapsed = started.elapsed();

    if !rec.saw(PublishPhase::QueryRunning) {
        // The sort finished inside one poll interval. Nothing is asserted about the window, and
        // that is reported rather than passed silently — a green test that checked nothing is the
        // failure mode this whole cut is about.
        eprintln!(
            "note: the sort completed within one poll interval on this machine, so the \
             sort-window cancel was not exercised. Phases seen: {:?}",
            rec.phases()
        );
        return;
    }

    assert!(
        matches!(outcome, Err(PublishError::Cancelled)),
        "a cancel inside the sort must end the operation as Cancelled, got {outcome:?}"
    );
    assert!(
        rec.acknowledged_at.lock().unwrap().is_some(),
        "the operation must report the instant it noticed the cancellation"
    );
    assert_eq!(
        rec.partitions_written.load(Ordering::SeqCst),
        0,
        "cancelling inside the sort must write no partition"
    );
    assert!(!dest.exists(), "a cancelled publish leaves no destination");
    assert!(
        no_staging_beside(&dest),
        "a cancelled publish leaves no staging directory beside its destination"
    );
    // **Liveness, not a budget.** The fifth section's sample was 3,920 ms because the wait was
    // unbounded; this bound exists only to fail if it becomes unbounded again, and it is set far
    // above anything `docs/08` would accept so that a slow CI runner cannot redden it. The real
    // number is taken by the declared harness on the declared fixture.
    assert!(
        elapsed < Duration::from_secs(30),
        "cancellation must not wait for the sort to finish (took {elapsed:?})"
    );
}

/// The phase exists to make the sort's silence detectable, and it must arrive **before** the label
/// that says partitions are being written — which is the part that was wrong.
#[test]
fn writing_partitions_is_not_announced_before_a_partition_exists() {
    let d = workspace("phase-order");
    let ds = pinned(&fixture(&d));
    let v = viewer();
    let dest = d.join("out");
    let rec = Arc::new(Recorder::default());

    publish_unguarded(&request(&ds, &v, dest), &CancelToken::new(), Some(rec.as_ref()))
        .expect("an uncancelled publish succeeds");

    let phases = rec.phases();
    let writing = phases
        .iter()
        .position(|p| *p == PublishPhase::WritingPartitions)
        .expect("WritingPartitions is always reported, even for an empty result");
    let querying = phases
        .iter()
        .position(|p| *p == PublishPhase::Querying)
        .expect("Querying is always reported");
    assert!(querying < writing, "Querying precedes WritingPartitions");

    if let Some(running) = phases.iter().position(|p| *p == PublishPhase::QueryRunning) {
        assert!(querying < running, "QueryRunning follows Querying");
        assert!(
            running < writing,
            "QueryRunning must precede WritingPartitions — it reports the sort, which happens \
             before any partition is written. Phases: {phases:?}"
        );
    }

    // The phase is reported once, not once per poll: an observer driving a UI would otherwise be
    // redrawing every 10 ms for the length of the sort.
    assert!(
        phases.iter().filter(|p| **p == PublishPhase::QueryRunning).count() <= 1,
        "QueryRunning is reported at most once per operation, got {phases:?}"
    );
    assert_eq!(
        phases.iter().filter(|p| **p == PublishPhase::WritingPartitions).count(),
        1,
        "WritingPartitions is reported exactly once, got {phases:?}"
    );
}

// ---------------------------------------------------------------------------------------------
// Inside one partition's write
// ---------------------------------------------------------------------------------------------

/// The byte-cadence callback is the seam that makes an intra-partition cancel possible at all, and
/// its contract has one clause a test must pin: **the last call for a partition always reports
/// `written == total`**, immediately before the unbounded `sync_all`.
#[test]
fn every_partition_reports_its_final_byte_before_the_sync() {
    let d = workspace("write-cadence");
    let ds = pinned(&fixture(&d));
    let v = viewer();
    let dest = d.join("out");
    let rec = Arc::new(Recorder::default());

    publish_unguarded(&request(&ds, &v, dest), &CancelToken::new(), Some(rec.as_ref()))
        .expect("an uncancelled publish succeeds");

    let progress = rec.write_progress.lock().unwrap().clone();
    assert!(!progress.is_empty(), "partitions report byte-cadence progress");

    let partitions = rec.partitions_written.load(Ordering::SeqCst);
    assert!(partitions > 0, "the fixture produces at least one partition");

    for index in 0..partitions {
        let mine: Vec<_> = progress.iter().filter(|(i, _, _)| *i == index).collect();
        assert!(!mine.is_empty(), "partition {index} reported no write progress");
        let (_, last_written, last_total) = *mine[mine.len() - 1];
        assert_eq!(
            last_written, last_total,
            "partition {index}'s final progress report must be its whole size — that call is the \
             only place an observer can stand before the fsync"
        );
        // Monotonic and bounded: a cadence that could go backwards or overshoot would make the
        // "bytes remaining" any UI derives from it wrong.
        let mut prev = 0u64;
        for (_, w, t) in &mine {
            assert!(*w > prev || (*w == 0 && prev == 0), "write progress must advance: {mine:?}");
            assert!(w <= t, "written never exceeds total: {mine:?}");
            prev = *w;
        }
    }

    // The declared cadence must actually be a cadence for at least one partition, or the constant
    // is decoration. A partition at the 1 MiB ceiling is four 256 KiB chunks.
    let multi_chunk = (0..partitions).any(|index| {
        progress.iter().filter(|(i, _, _)| *i == index).count() > 1
    });
    assert!(
        multi_chunk,
        "at least one partition must exceed one chunk, or PUBLISH_WRITE_CHUNK_BYTES is not \
         bounding anything on this fixture"
    );
}

/// A cancel raised *during* a partition's write must end the operation, not be waited out until the
/// partition finishes. This is the half of the fifth section's finding that chunking addresses.
#[test]
fn a_cancel_mid_partition_write_ends_the_operation() {
    struct OnPartialWrite {
        rec: Arc<Recorder>,
        token: CancelToken,
        fired: AtomicBool,
    }
    impl PublishProgress for OnPartialWrite {
        fn phase(&self, phase: PublishPhase) {
            self.rec.phase(phase)
        }
        fn partition_written(&self, i: usize, r: usize, b: u64) {
            self.rec.partition_written(i, r, b)
        }
        fn partition_write_progress(&self, index: usize, written: u64, total: u64) {
            self.rec.partition_write_progress(index, written, total);
            // Strictly *inside* the file: some bytes down, more to come. Firing on the final
            // callback would test the between-partition path that already worked.
            if written < total && !self.fired.swap(true, Ordering::SeqCst) {
                self.token.cancel();
            }
        }
        fn cancellation_observed(&self, at: Instant) {
            self.rec.cancellation_observed(at)
        }
    }

    let d = workspace("mid-write");
    let ds = pinned(&fixture(&d));
    let v = viewer();
    let dest = d.join("out");
    let cancel = CancelToken::new();
    let rec = Arc::new(Recorder::default());
    let obs =
        OnPartialWrite { rec: Arc::clone(&rec), token: cancel.clone(), fired: AtomicBool::new(false) };

    let outcome = publish_unguarded(&request(&ds, &v, dest.clone()), &cancel, Some(&obs));

    assert!(
        obs.fired.load(Ordering::SeqCst),
        "no partition was large enough to report a partial write, so this test exercised nothing"
    );
    assert!(
        matches!(outcome, Err(PublishError::Cancelled)),
        "a cancel inside a partition write must end the operation as Cancelled, got {outcome:?}"
    );
    assert!(
        rec.acknowledged_at.lock().unwrap().is_some(),
        "the operation must report the instant it noticed"
    );
    assert!(!dest.exists(), "a cancelled publish leaves no destination");
    assert!(no_staging_beside(&dest), "a cancelled publish leaves no staging directory");
}

// ---------------------------------------------------------------------------------------------
// The properties the brief requires to hold unchanged
// ---------------------------------------------------------------------------------------------

/// The brief's clause: *lease released, interrupt detached*. Both are now observable from outside,
/// which matters more than before — with the wait bounded, `publish` can return while the producer
/// thread is still unwinding, so "the work stopped" is no longer implied by "the call returned".
#[test]
fn a_cancelled_publish_releases_the_lease_and_detaches_the_interrupt() {
    struct OnFirstPartition {
        token: CancelToken,
    }
    impl PublishProgress for OnFirstPartition {
        fn phase(&self, _: PublishPhase) {}
        fn partition_written(&self, _: usize, _: usize, _: u64) {
            self.token.cancel();
        }
    }

    let d = workspace("lease-released");
    let ds = pinned(&fixture(&d));
    let v = viewer();
    let dest = d.join("out");
    let cancel = CancelToken::new();

    let outcome =
        publish_unguarded(&request(&ds, &v, dest), &cancel, Some(&OnFirstPartition { token: cancel.clone() }));
    assert!(matches!(outcome, Err(PublishError::Cancelled)));

    // The producer may still be unwinding when the call returns; both properties are settled by a
    // bounded wait rather than by an instant assertion, and the window is declared here rather than
    // discovered by whoever first sees a flake.
    const JOIN_WINDOW: Duration = Duration::from_secs(5);
    let deadline = Instant::now() + JOIN_WINDOW;
    while (ds.connections().active_leases() != 0 || cancel.is_bound()) && Instant::now() < deadline {
        std::thread::sleep(Duration::from_millis(10));
    }
    assert_eq!(
        ds.connections().active_leases(),
        0,
        "the stream's lease must be returned to the pool within {JOIN_WINDOW:?} of a cancel"
    );
    assert!(
        !cancel.is_bound(),
        "the token must not stay attached to a connection that has been handed back"
    );
}

/// Whatever else changed, an uncancelled publish is unchanged: same partitions, same manifest, a
/// real bundle at the destination.
#[test]
fn an_uncancelled_publish_is_unaffected_by_the_new_polling() {
    let d = workspace("unaffected");
    let ds = pinned(&fixture(&d));
    let v = viewer();
    let dest = d.join("out");

    let outcome = publish_unguarded(&request(&ds, &v, dest.clone()), &CancelToken::new(), None)
        .expect("an uncancelled publish succeeds");

    assert!(dest.join("manifest.json").exists(), "the bundle has a manifest");
    assert!(outcome.partitions > 0, "the bundle has partitions");
    assert_eq!(outcome.rows, FEATURES as u64, "every row reaches the bundle");
    assert!(no_staging_beside(&dest), "the staging directory is gone after a success");
}

/// No staging directory survives beside `dest`. Staging is named `.<name>.staging-<hex>`.
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
