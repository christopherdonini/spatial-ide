// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! T6 of `engine/LOD-PREREGISTRATION.md` §4 — the cooperative-cancellation granularity — and its
//! `#[ignore]`d 5 GB row.
//!
//! **Its own test binary, deliberately.** T6 cancels a build of the same fixture
//! `engine/tests/lod_tier_builder.rs` builds its ladder from, so the two own the same tier directory
//! (it is keyed by the source's content hash). Tests inside one binary run in parallel threads;
//! cargo runs test *binaries* one after another, and that is what keeps these two from asserting
//! over each other's files.
//!
//! **Nothing here is a performance claim.** One sample asserted against a declared ceiling is not a
//! p50/p95, and none is reported: `docs/08`'s budget is scored by the tester, on the producer's own
//! clock, with `cancel_quiescent` beside it (ADR-018 §2).

use std::path::PathBuf;
use std::sync::Mutex;
use std::time::{Duration, Instant};

use spatial_engine::cancel::CancelToken;
use spatial_engine::dataset::Dataset;
use spatial_engine::error::EngineError;
use spatial_engine::fixture::{write_geoparquet, FixtureSpec};
use spatial_engine::lod::{
    build_tiers, TierBuildProgress, LOD_BUILD_WORKERS, LOD_CANCEL_OBSERVED_CEILING_MS,
};

const POLYGONS_100K: &str =
    r"C:\dev\spatial-ide\target\fixtures\slice-budgets\polygons-100k.parquet";
const PARCELS_5GB: &str = r"C:\dev\spatial-ide\target\slice-evidence\scale-pass\parcels-5gb.parquet";

/// `LOD-PREREGISTRATION.md` §3's `polygons-100k`, read by absolute path and regenerated from the
/// same seeded spec only if it is absent (`kernel/tests/slice_budgets.rs:472-486`).
fn polygons_100k() -> PathBuf {
    let path = PathBuf::from(POLYGONS_100K);
    if !path.is_file() {
        std::fs::create_dir_all(path.parent().expect("fixture dir")).expect("fixture dir");
        write_geoparquet(
            &path,
            &FixtureSpec { features: 100_000, avg_vertices: 100, hole_every: 7, ..Default::default() },
        )
        .expect("regenerate polygons-100k");
    }
    path
}

fn tier_directory(source: &Dataset) -> PathBuf {
    let (hash, _ms) =
        spatial_engine::index::content_hash(source.path(), &CancelToken::new()).expect("hash");
    PathBuf::from(std::env::var_os("LOCALAPPDATA").expect("LOCALAPPDATA"))
        .join("spatial-ide/tiers")
        .join(hash)
}

fn parquet_files(dir: &PathBuf) -> Vec<PathBuf> {
    std::fs::read_dir(dir)
        .map(|rd| {
            rd.filter_map(|e| e.ok())
                .map(|e| e.path())
                .filter(|p| p.extension().is_some_and(|x| x == "parquet"))
                .collect()
        })
        .unwrap_or_default()
}

/// Stamps the two instants ADR-018 §2 names, **on one clock origin** — the spike's own recorded
/// harness bug was diffing across two `Instant`s, which measured the gap between two
/// `Instant::now()` calls instead of the property.
///
/// `cancel_requested` is stamped by the canceller (the only instant a canceller can stamp);
/// `cancel_observed` is stamped inside the worker, on the thread that stopped advancing.
struct CancelWatcher {
    origin: Instant,
    /// Set the first time a tier reports progress, so the canceller fires **inside the simplify
    /// loop** rather than during the whole-file content hash that precedes it — the two are
    /// different operations with different cancellation points, and T6 is about this one.
    tiering_started: Mutex<bool>,
    requested: Mutex<Option<Duration>>,
    observed: Mutex<Option<Duration>>,
}

impl CancelWatcher {
    fn new(origin: Instant) -> Self {
        Self {
            origin,
            tiering_started: Mutex::new(false),
            requested: Mutex::new(None),
            observed: Mutex::new(None),
        }
    }

    fn has_started(&self) -> bool {
        *self.tiering_started.lock().expect("lock")
    }

    /// Stamp `cancel_requested` and cancel. **The canceller stamps this instant and only this one**
    /// (ADR-018 §2; `cancel.rs:39-46`).
    fn request(&self, token: &CancelToken) {
        let mut requested = self.requested.lock().expect("lock");
        if requested.is_none() {
            *requested = Some(self.origin.elapsed());
            token.cancel();
        }
    }
}

impl TierBuildProgress for CancelWatcher {
    fn tier_progress(&self, _tier: u8, _features_done: u64, _features_total: u64) {
        *self.tiering_started.lock().expect("lock") = true;
    }

    fn cancel_observed(&self, _tier: u8, _features_done: u64) {
        let mut observed = self.observed.lock().expect("lock");
        if observed.is_none() {
            *observed = Some(self.origin.elapsed());
        }
    }
}

/// Cancel from **another thread, at a wall-clock delay after the tiering starts** — the spike's own
/// shape, and the only honest one: a cancel raised from inside the progress callback would land
/// immediately before a cooperative check and measure nothing. Where this one lands is wherever the
/// build happens to be.
fn cancel_from_another_thread<'a>(
    watcher: &'a CancelWatcher,
    token: &'a CancelToken,
    scope: &'a std::thread::Scope<'a, '_>,
) {
    scope.spawn(move || {
        while !watcher.has_started() {
            std::thread::sleep(Duration::from_millis(5));
        }
        std::thread::sleep(Duration::from_millis(250));
        watcher.request(token);
    });
}

// RECORDED MUTATION: move the cooperative check from per-feature back to the row-group boundary —
// delete the `cancel.is_cancelled()` block at the top of `engine/src/lod.rs::simplify_slice`'s loop,
// leaving only the per-batch check in `write_tier` (the spike's own shape) →
// cancel_observed_within_the_declared_ceiling fails: `cancel_observed` is then stamped no earlier
// than the end of the row group already in flight, and the assertion reports an interval outside
// LOD_CANCEL_OBSERVED_CEILING_MS.
#[test]
fn cancel_observed_within_the_declared_ceiling() {
    let path = polygons_100k();
    let source = Dataset::open(&path).expect("open polygons-100k");
    let directory = tier_directory(&source);
    // A tier admitted from a previous run would be reused, and then this test would cancel nothing.
    let _ = std::fs::remove_dir_all(&directory);

    let cancel = CancelToken::new();
    let watcher = CancelWatcher::new(Instant::now());
    let outcome = std::thread::scope(|scope| {
        cancel_from_another_thread(&watcher, &cancel, scope);
        build_tiers(&source, LOD_BUILD_WORKERS, &cancel, Some(&watcher))
    });
    assert!(
        matches!(outcome, Err(EngineError::Cancelled)),
        "a cancelled build is a typed refusal, not a partial ladder: {outcome:?}"
    );

    let requested = watcher.requested.lock().expect("lock").expect("cancel_requested was stamped");
    let observed = watcher.observed.lock().expect("lock").expect("cancel_observed was stamped");
    assert!(observed >= requested, "cancel_observed cannot precede cancel_requested");
    let interval = observed - requested;
    assert!(
        interval <= Duration::from_millis(LOD_CANCEL_OBSERVED_CEILING_MS),
        "cancel_requested → cancel_observed was {interval:?}, outside the declared ceiling of \
         {LOD_CANCEL_OBSERVED_CEILING_MS} ms (docs/08's existing budget, ADR-018 §2). One sample \
         asserted against the ceiling — the distribution is the tester's"
    );

    // Nothing partial is left behind: the tier that was being written when the cancel landed is
    // removed, and the removal's outcome is the build's to report.
    let leftovers = parquet_files(&directory);
    assert!(leftovers.is_empty(), "a cancelled build left a partial tier on disk: {leftovers:?}");
    let _ = std::fs::remove_dir_all(&directory);
}

/// §3's O7 fixture — the same declared ceiling, on `parcels-5gb`. `#[ignore]`d and fixture-gated,
/// the tester's to run.
#[test]
#[ignore = "reads the 5 GB fixture; run explicitly with --release: cargo test --release -p \
            spatial-engine --test lod_tier_cancellation -- --ignored --exact \
            cancel_observed_within_the_declared_ceiling_at_5gb --nocapture"]
fn cancel_observed_within_the_declared_ceiling_at_5gb() {
    let path = PathBuf::from(PARCELS_5GB);
    assert!(
        path.is_file(),
        "the 5 GB fixture is absent at {} — this phase refuses to run rather than measure \
         something else",
        path.display()
    );
    let source = Dataset::open(&path).expect("open parcels-5gb");
    let directory = tier_directory(&source);
    let _ = std::fs::remove_dir_all(&directory);

    let cancel = CancelToken::new();
    let watcher = CancelWatcher::new(Instant::now());
    let outcome = std::thread::scope(|scope| {
        cancel_from_another_thread(&watcher, &cancel, scope);
        build_tiers(&source, LOD_BUILD_WORKERS, &cancel, Some(&watcher))
    });
    assert!(matches!(outcome, Err(EngineError::Cancelled)), "{outcome:?}");

    let requested = watcher.requested.lock().expect("lock").expect("cancel_requested");
    let observed = watcher.observed.lock().expect("lock").expect("cancel_observed");
    let interval = observed - requested;
    println!("cancel_requested -> cancel_observed: {interval:?} (one sample, not a p50/p95)");
    assert!(
        interval <= Duration::from_millis(LOD_CANCEL_OBSERVED_CEILING_MS),
        "outside the declared ceiling: {interval:?}"
    );
    let leftovers = parquet_files(&directory);
    assert!(leftovers.is_empty(), "a cancelled build left a partial tier on disk: {leftovers:?}");
    let _ = std::fs::remove_dir_all(&directory);
}
