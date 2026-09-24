// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **Measurement harness — the tester's, not a gate.** `engine/LOD-PREREGISTRATION.md` §6 names four
//! instruments the existing suites do not print: build wall time **per arm** (arm S = 1 worker,
//! arm P = [`LOD_BUILD_WORKERS`]), the per-tier wall marks inside one build, the vertex reductions
//! side by side with them, and `TierSet::max_single_feature_simplify()` — §7's declared cancellation
//! residual. `engine/tests/lod_tier_builder.rs` builds its ladder with arm P only and asserts
//! nothing about time; this file chooses the arm and prints the numbers.
//!
//! **Every test here is `#[ignore]`d** and is run explicitly by the tester. Nothing here asserts a
//! wall time, and nothing here is a performance claim (§1): the figures land in
//! `engine/LOD-RESULTS.md`, with their sample counts declared before the runs.
//!
//! **No product code is changed by this file.** It calls the same `spatial_engine::lod::build_tiers`
//! the shipped path calls, through the same public observer seam.
//!
//! **Disk discipline (§3, binding) is in the code, not in the operator's care**: at 5 GB scale tier
//! N−1 is deleted the moment tier N starts, so two GB-scale outputs are never on disk at once —
//! the [`DiskDiscipline`] shape of `engine/tests/lod_tier_builder.rs:964-992`, here with the
//! O2/O3/O4 verification of tier N−1 taken *before* the deletion, because after it there is nothing
//! left to verify.

use std::collections::BTreeSet;
use std::path::{Path, PathBuf};
use std::sync::Mutex;
use std::time::{Duration, Instant};

use arrow::array::UInt64Array;
use parquet::arrow::arrow_reader::ParquetRecordBatchReaderBuilder;

use spatial_engine::cancel::CancelToken;
use spatial_engine::dataset::Dataset;
use spatial_engine::lod::{
    build_tiers, TierBuildProgress, TierSet, LOD_BUILD_WORKERS, LOD_BUILD_WORKERS_ARM_S,
    LOD_TIER_COUNT,
};

mod common;
use common::polygons_100k;

const PARCELS_5GB: &str = r"C:\dev\spatial-ide\target\slice-evidence\scale-pass\parcels-5gb.parquet";

/// The same 40 GiB floor this crate's other 5 GB phases declare
/// (`engine/tests/import_layout_5gb_fixtures.rs:132`, `engine/tests/lod_tier_builder.rs:947`).
/// Below it this harness refuses to run: §5's I6 is "stop and report", never "measure anyway".
const MIN_FREE_BYTES: u64 = 40 * 1024 * 1024 * 1024;

/// **Declared before the runs**, and recorded in `engine/LOD-RESULTS.md`'s header: five samples per
/// arm on `polygons-100k`, which is what makes a p50/p95 reportable there at all.
const SAMPLES_100K: usize = 5;

// ---------------------------------------------------------------------------------------------
// Small helpers — none of them touches the code under measurement.
// ---------------------------------------------------------------------------------------------

fn free_bytes_on_c() -> Option<u64> {
    let out = std::process::Command::new("powershell")
        .args(["-NoProfile", "-Command", "(Get-PSDrive C).Free"])
        .output()
        .ok()?;
    String::from_utf8_lossy(&out.stdout).trim().parse().ok()
}

fn tier_directory(source: &Dataset) -> PathBuf {
    let (hash, _ms) =
        spatial_engine::index::content_hash(source.path(), &CancelToken::new()).expect("hash");
    PathBuf::from(std::env::var_os("LOCALAPPDATA").expect("LOCALAPPDATA"))
        .join("spatial-ide/tiers")
        .join(hash)
}

/// A build is a build, never a reuse: a previous sample's ladder would be *admitted* by key, and a
/// reuse measures the admission path instead of the builder.
fn clear_tier_directory(directory: &Path) {
    if directory.exists() {
        std::fs::remove_dir_all(directory).expect("clear the tier directory");
    }
}

fn read_ids(path: &Path, id_column: &str) -> Vec<u64> {
    let file = std::fs::File::open(path).expect("open for ids");
    let reader = ParquetRecordBatchReaderBuilder::try_new(file)
        .expect("reader")
        .with_batch_size(8192)
        .build()
        .expect("build reader");
    let mut out = Vec::new();
    for batch in reader {
        let batch = batch.expect("batch");
        let idx = batch.schema().index_of(id_column).expect("id column");
        let a = batch
            .column(idx)
            .as_any()
            .downcast_ref::<UInt64Array>()
            .expect("id column is UInt64");
        out.extend((0..a.len()).map(|i| a.value(i)));
    }
    out
}

fn millis(d: Duration) -> f64 {
    d.as_secs_f64() * 1_000.0
}

/// Stamps the first progress callback of each tier on **one clock origin**, so a per-tier wall mark
/// is a difference on that clock and never a difference between two `Instant::now()` calls.
///
/// What a mark means, stated so the results file can say it: `tier_progress(N, ..)` fires when
/// tier N's first row group has been written, so `start(N+1) − start(N)` covers tier N's simplify
/// **and** its write; `start(1)` covers everything before the first tier — the CRS unit read, the
/// whole-file content hash (`index.rs:575-585`, the dominant cost of an open ladder), the preflight
/// and the manifest read.
struct ArmClock {
    origin: Instant,
    first_progress: Mutex<Vec<(u8, Duration)>>,
}

impl ArmClock {
    fn new() -> Self {
        Self { origin: Instant::now(), first_progress: Mutex::new(Vec::new()) }
    }

    fn marks(&self) -> Vec<(u8, Duration)> {
        self.first_progress.lock().expect("lock").clone()
    }
}

impl TierBuildProgress for ArmClock {
    fn tier_progress(&self, tier: u8, _done: u64, _total: u64) {
        let mut marks = self.first_progress.lock().expect("lock");
        if !marks.iter().any(|(t, _)| *t == tier) {
            marks.push((tier, self.origin.elapsed()));
        }
    }

    fn cancel_observed(&self, _tier: u8, _done: u64) {}
}

/// Print one built ladder's facts: the per-tier reduction (O5), bytes and sha256 (O8's disclosure),
/// and §6's residual. Nothing here asserts a time.
fn report(set: &TierSet, label: &str, total: Duration, marks: &[(u8, Duration)]) {
    println!("--- {label}: total {:.3} ms ({:.3} s)", millis(total), total.as_secs_f64());
    for (i, outcome) in set.tiers().iter().enumerate() {
        let r = outcome.record();
        let start = marks.iter().find(|(t, _)| *t == r.tier()).map(|(_, d)| *d);
        let span = match (start, marks.get(i + 1)) {
            (Some(s), Some((_, next))) => Some(*next - s),
            (Some(s), None) => Some(total - s),
            _ => None,
        };
        let reduction = if r.vertices_before() == 0 {
            0.0
        } else {
            1.0 - (r.vertices_after() as f64 / r.vertices_before() as f64)
        };
        println!(
            "{label} tier {} area {} m2 ({} source units) features {} vertices {} -> {} reduction {:.4} \
             bytes {} sha256 {} first-progress-at {:.3} ms span {} rebuilt {}",
            r.tier(),
            r.key().min_triangle_area_square_metres,
            r.min_triangle_area_source_units(),
            r.features(),
            r.vertices_before(),
            r.vertices_after(),
            reduction,
            r.bytes(),
            r.sha256(),
            start.map(millis).unwrap_or(f64::NAN),
            span.map(|d| format!("{:.3} ms", millis(d))).unwrap_or_else(|| "n/a".into()),
            outcome.was_rebuilt(),
        );
    }
    let cost = set.disk_cost();
    println!(
        "{label} set total {} B, hard bound {} B ({}x source of {} B), free before build {:?}",
        cost.total_bytes, cost.hard_bound_bytes, 3, cost.source_bytes, cost.free_bytes_before_build
    );
    match set.max_single_feature_simplify() {
        Some(d) => println!("{label} max_single_feature_simplify {:.6} ms", millis(d)),
        None => println!("{label} max_single_feature_simplify none (nothing was simplified)"),
    }
}

/// One sample: clear, build, report, delete. The ladder is removed after every sample so no sample
/// leaves a GB-scale artifact behind and no later sample can reuse one.
fn one_sample(source: &Dataset, directory: &Path, workers: usize, label: &str) -> Duration {
    clear_tier_directory(directory);
    let cancel = CancelToken::new();
    let clock = ArmClock::new();
    let started = Instant::now();
    let set = build_tiers(source, workers, &cancel, Some(&clock)).expect("build the ladder");
    let total = started.elapsed();

    assert_eq!(set.tiers().len(), LOD_TIER_COUNT, "the ladder is the declared three tiers");
    // **The reuse guard.** A sample that reused a tier is not a build-time sample at all.
    for outcome in set.tiers() {
        assert!(
            outcome.was_rebuilt(),
            "{label}: tier {} was reused, not built — this sample measures admission, not the \
             builder",
            outcome.record().tier()
        );
    }
    assert!(
        set.max_single_feature_simplify().is_some(),
        "{label}: a build that simplified features reports §7's residual"
    );
    report(&set, label, total, &clock.marks());

    for outcome in set.tiers() {
        let _ = std::fs::remove_file(outcome.record().path());
    }
    total
}

// ---------------------------------------------------------------------------------------------
// Row 3 of `engine/LOD-RESULTS.md` — O6 on `polygons-100k`, arm S and arm P, five samples each.
// ---------------------------------------------------------------------------------------------

// RECORDED MUTATION: stop removing the previous sample's ladder — delete **both** the
// `clear_tier_directory(directory)` call at the top of `one_sample` and the trailing
// `for outcome in set.tiers() { remove_file(..) }` loop at its end → every sample after the first
// is admitted by key instead of built, and the test fails by name on the reuse guard.
// **Observed** (2026-09-16T23:58Z, this file, `SAMPLES_100K` temporarily 2):
//   `arm S sample 2/2: tier 1 was reused, not built — this sample measures admission, not the builder`
// The mutation matters because a reused sample would otherwise report a wall time two orders of
// magnitude below the build it claims to measure.
//
// RECORDED MUTATION, FIRST ATTEMPT — DID NOT FIRE, kept because a mutation that was claimed and not
// observed is a finding: deleting *only* the `clear_tier_directory` call leaves the trailing
// per-sample deletion in place, the manifest's tier files are then absent, admission reports
// `TierMiss::Absent`, and every sample still rebuilds. Run observed to **pass**, with all five
// reduction and byte columns identical across samples. Both halves of the removal are needed, which
// is why the mutation above names both.
#[test]
#[ignore = "measurement harness, the tester's: cargo test --release -p spatial-engine --test \
            lod_tier_measurements -- --ignored --exact \
            wall_time_arm_s_and_arm_p_over_polygons_100k --nocapture"]
fn wall_time_arm_s_and_arm_p_over_polygons_100k() {
    assert!(
        !cfg!(debug_assertions),
        "this file's tests are wall-time measurements; a debug build's numbers are not \
         measurements. Run with --release."
    );
    let path = polygons_100k();
    let source = Dataset::open(&path).expect("open polygons-100k");
    let directory = tier_directory(&source);
    println!(
        "fixture {} ({} B); tier directory {}; free before {:?}",
        path.display(),
        std::fs::metadata(&path).expect("stat").len(),
        directory.display(),
        free_bytes_on_c()
    );

    // Arms in a fixed order, both arms' samples interleaved in neither direction: arm S first, then
    // arm P, each cleared before every sample. The order is stated because it is the only thing a
    // reader can check about a drift the session might have had.
    for (arm, workers) in [("arm S", LOD_BUILD_WORKERS_ARM_S), ("arm P", LOD_BUILD_WORKERS)] {
        for sample in 1..=SAMPLES_100K {
            let label = format!("{arm} sample {sample}/{SAMPLES_100K}");
            let total = one_sample(&source, &directory, workers, &label);
            println!("SAMPLE {arm} workers {workers} total_ms {:.3}", millis(total));
        }
    }
    clear_tier_directory(&directory);
    println!("free after {:?}", free_bytes_on_c());
}

// ---------------------------------------------------------------------------------------------
// Row 4 of `engine/LOD-RESULTS.md` — O6 at 5 GB, arm S. One sample, under §3's disk discipline.
// ---------------------------------------------------------------------------------------------

/// Deletes tier N−1 the moment tier N starts, so the 5 GB ladder is never two completed GB-scale
/// outputs on disk at once (§3), and stamps the same per-tier marks [`ArmClock`] does.
struct DiskDiscipline {
    directory: PathBuf,
    clock: ArmClock,
    deleted: Mutex<Vec<u8>>,
}

impl TierBuildProgress for DiskDiscipline {
    fn tier_progress(&self, tier: u8, done: u64, total: u64) {
        self.clock.tier_progress(tier, done, total);
        if tier < 2 {
            return;
        }
        let mut deleted = self.deleted.lock().expect("lock");
        let previous = tier - 1;
        if deleted.contains(&previous) {
            return;
        }
        let path = self.directory.join(format!("tier-{previous}.parquet"));
        match std::fs::remove_file(&path) {
            Ok(()) => println!(
                "disk discipline: removed tier {previous} before tier {tier} grew; free {:?} B",
                free_bytes_on_c()
            ),
            Err(e) => println!("disk discipline: tier {previous} not removed ({e})"),
        }
        deleted.push(previous);
    }

    fn cancel_observed(&self, _tier: u8, _done: u64) {}
}

// RECORDED MUTATION: the same one, one scale up — delete the
// `let _ = std::fs::remove_dir_all(&directory);` before the build **and** the trailing `remove_file`
// loop after it → a second run reuses the ladder the first left behind and fails by name on the
// reuse guard ("arm S 5gb: tier 1 was reused, not built — this sample measures admission, not the
// builder"). **Observed at 100k scale** on the same reuse-guard assertion (see
// `wall_time_arm_s_and_arm_p_over_polygons_100k` above, observed 2026-09-16T23:58Z); **not
// re-observed at 5 GB**, because doing so costs two more 5 GB ladders and would also break §3's
// disk discipline by leaving a GB-scale ladder on disk on purpose.
#[test]
#[ignore = "reads the 5 GB fixture and writes GB-scale tiers; the tester's: cargo test --release -p \
            spatial-engine --test lod_tier_measurements -- --ignored --exact \
            wall_time_arm_s_over_parcels_5gb --nocapture"]
fn wall_time_arm_s_over_parcels_5gb() {
    five_gb_build(LOD_BUILD_WORKERS_ARM_S, "arm S 5gb", false);
}

// RECORDED MUTATION: as above. This arm exists so `engine/LOD-RESULTS.md` row 4 can carry arm P from
// this same harness (the same clock, the same phases) rather than from a differently instrumented
// binary, if the night allows both.
#[test]
#[ignore = "reads the 5 GB fixture and writes GB-scale tiers; the tester's: cargo test --release -p \
            spatial-engine --test lod_tier_measurements -- --ignored --exact \
            wall_time_arm_p_over_parcels_5gb --nocapture"]
fn wall_time_arm_p_over_parcels_5gb() {
    five_gb_build(LOD_BUILD_WORKERS, "arm P 5gb", false);
}

// RECORDED MUTATION: the reuse guard, as for the two arms above — **observed at 100k scale**,
// 2026-09-16T23:58Z.
//
// **The O2/O3/O4 assertions this test makes coin no new mutation**, and saying so is the honest
// record rather than inventing one: they are `tier_preserves_identity_for_every_row`,
// `engine_opens_its_own_tier` and `tier_writer_does_not_reorder_rows` from
// `engine/tests/lod_tier_builder.rs`, whose mutations §4 declares and whose observed failures are
// recorded there. What this test adds is the *scale* they run at — `parcels-5gb`, which those three
// never touch — and the ordering that makes it possible at all: tier N−1 is verified before disk
// discipline removes it. The positional half of O4 has its own cheap mechanical check below,
// `the_row_order_check_fires_on_a_permutation`, so "the row-order check can fail" is a fact about
// this file and not an assumption in it.
#[test]
#[ignore = "reads the 5 GB fixture and writes GB-scale tiers; the tester's: cargo test --release -p \
            spatial-engine --test lod_tier_measurements -- --ignored --exact \
            the_5gb_ladder_outcomes_o1_to_o4 --nocapture"]
fn the_5gb_ladder_outcomes_o1_to_o4() {
    five_gb_build(LOD_BUILD_WORKERS, "arm P 5gb verified", true);
}

/// O2 (identity), O3 (the engine opens its own tier) and O4 (row order) over one written tier,
/// against the source's own ids. Called **before** disk discipline removes the tier, because after
/// that there is nothing to open.
///
/// O1 is not re-derived here: the builder validates **every** simplified Polygon before it is
/// written (`engine/src/lod.rs:1530`, `geo::Validation::is_valid()`, §6's declared instrument) and
/// refuses the whole build with `engine.lod_invalid_output` on the first failure, so a build that
/// returned `Ok` *is* the zero-invalid result for every feature it wrote. Re-decoding 250 M+
/// vertices per tier would measure the same property a second time and nothing else.
fn verify_tier(tier_path: &Path, source: &Dataset, source_ids: &[u64], label: &str) {
    let opened = Dataset::open(tier_path).expect("O3: open the tier this engine wrote");
    assert_eq!(opened.crs().identifier(), source.crs().identifier(), "O3: the tier is in the source's CRS");
    assert_eq!(opened.geometry_column(), source.geometry_column(), "O3: geometry column");
    assert_eq!(opened.geoparquet_version(), source.geoparquet_version(), "O3: GeoParquet version");
    assert!(opened.covering().is_some(), "O3: the tier declares its own covering bbox columns");
    assert_eq!(
        opened.identity().source().source_column(),
        source.identity().source().source_column(),
        "O3: the tier carries the source's identity column, by name"
    );

    let emitted = read_ids(tier_path, source.identity().source().source_column());
    let unique: BTreeSet<u64> = emitted.iter().copied().collect();
    assert_eq!(unique.len(), emitted.len(), "O2: {label} emitted duplicate ids");
    let expected: BTreeSet<u64> = source_ids.iter().copied().collect();
    let missing: Vec<u64> = expected.difference(&unique).copied().take(4).collect();
    assert!(missing.is_empty(), "O2: {label} is missing source id(s), first {missing:?}");
    let extra: Vec<u64> = unique.difference(&expected).copied().take(4).collect();
    assert!(extra.is_empty(), "O2: {label} emitted id(s) the source has not: {extra:?}");

    assert_eq!(emitted.len(), source_ids.len(), "O4: {label} row count");
    if let Some(i) = first_out_of_order(&emitted, source_ids) {
        panic!("O4: {label} row {i}: source id {}, tier id {}", source_ids[i], emitted[i]);
    }
    println!("{label}: O2 identity ok ({} ids, unique, complete) · O3 open ok · O4 row order ok", emitted.len());
}

/// O4's positional half, factored out so it can be checked without a 5 GB build: the index of the
/// first row whose emitted id is not the source's id at the same position, or `None`.
fn first_out_of_order(emitted: &[u64], expected: &[u64]) -> Option<usize> {
    (0..emitted.len().min(expected.len())).find(|&i| emitted[i] != expected[i])
}

// RECORDED MUTATION: make `first_out_of_order` always return `None` (the "compare the ids as a set
// only" weakening, which is what §2d's row-order rule exists to prevent) →
// the_row_order_check_fires_on_a_permutation fails by name on "a swapped pair is out of order at
// the first swapped index". **Observed** 2026-09-17T00:07Z:
// `assertion left == right failed: a swapped pair is out of order at the first swapped index;
//  left: None; right: Some(1)`.
//
// Cheap on purpose: this is the one assertion in `verify_tier` that a 5 GB run can never exercise,
// because a correct writer never produces the input that would exercise it.
#[test]
fn the_row_order_check_fires_on_a_permutation() {
    let source: Vec<u64> = (0..8).collect();
    assert_eq!(first_out_of_order(&source, &source), None, "an unpermuted tier is in order");
    let mut swapped = source.clone();
    swapped.swap(1, 2);
    assert_eq!(
        first_out_of_order(&swapped, &source),
        Some(1),
        "a swapped pair is out of order at the first swapped index"
    );
    let rotated: Vec<u64> = source.iter().copied().cycle().skip(1).take(source.len()).collect();
    assert_eq!(first_out_of_order(&rotated, &source), Some(0), "a rotation is out of order at row 0");
}

fn five_gb_build(workers: usize, label: &str, verify: bool) {
    assert!(
        !cfg!(debug_assertions),
        "this helper is called by both wall-time measurements and an O1-O4 outcomes pass at 5 GB \
         scale; neither a timing nor a correctness result from a debug build is trustworthy at this \
         scale. Run with --release."
    );
    let path = PathBuf::from(PARCELS_5GB);
    assert!(
        path.is_file(),
        "the 5 GB fixture is absent at {} — this phase refuses to run rather than measure something \
         else, and never regenerates a fixture other cuts' records depend on",
        path.display()
    );
    let free_before = free_bytes_on_c().unwrap_or(0);
    println!("{label}: free disk before {free_before} B (floor {MIN_FREE_BYTES} B)");
    assert!(
        free_before >= MIN_FREE_BYTES,
        "{label}: refusing to start below the declared floor: {free_before} B free (§5, I6)"
    );

    let source = Dataset::open(&path).expect("open parcels-5gb");
    let directory = tier_directory(&source);
    let _ = std::fs::remove_dir_all(&directory);

    // Read once, before the build, so the verification costs the build nothing it did not already
    // pay: the id column only, never the geometry.
    let source_ids = if verify {
        let ids = read_ids(&path, source.identity().source().source_column());
        println!("{label}: source ids read: {}", ids.len());
        ids
    } else {
        Vec::new()
    };

    /// Disk discipline plus the O2/O3/O4 verification of tier N−1, taken **before** the deletion.
    /// Borrowed, not owned: the source and its ids outlive the build, and no raw pointer is needed
    /// to say so.
    struct VerifyingDiscipline<'a> {
        inner: DiskDiscipline,
        verify: bool,
        source: &'a Dataset,
        source_ids: &'a [u64],
        label: &'a str,
    }

    impl TierBuildProgress for VerifyingDiscipline<'_> {
        fn tier_progress(&self, tier: u8, done: u64, total: u64) {
            if self.verify && tier >= 2 {
                let previous = tier - 1;
                let already = self.inner.deleted.lock().expect("lock").contains(&previous);
                if !already {
                    let p = self.inner.directory.join(format!("tier-{previous}.parquet"));
                    if p.is_file() {
                        verify_tier(
                            &p,
                            self.source,
                            self.source_ids,
                            &format!("{} tier {previous}", self.label),
                        );
                    }
                }
            }
            self.inner.tier_progress(tier, done, total);
        }

        fn cancel_observed(&self, _tier: u8, _done: u64) {}
    }

    let observer = VerifyingDiscipline {
        inner: DiskDiscipline {
            directory: directory.clone(),
            clock: ArmClock::new(),
            deleted: Mutex::new(Vec::new()),
        },
        verify,
        source: &source,
        source_ids: &source_ids,
        label,
    };

    let cancel = CancelToken::new();
    let started = Instant::now();
    let set = build_tiers(&source, workers, &cancel, Some(&observer)).expect("build the 5 GB ladder");
    let total = started.elapsed();

    assert_eq!(set.tiers().len(), LOD_TIER_COUNT, "the ladder is the declared three tiers");
    for outcome in set.tiers() {
        assert!(
            outcome.was_rebuilt(),
            "{label}: tier {} was reused, not built — this sample measures admission, not the builder",
            outcome.record().tier()
        );
    }
    assert!(set.max_single_feature_simplify().is_some(), "{label}: §7's residual is reported");
    report(&set, label, total, &observer.inner.clock.marks());
    println!("SAMPLE {label} workers {workers} total_ms {:.3}", millis(total));

    // The last tier is still on disk (disk discipline removed the two before it as they were
    // superseded), so it is the one verification can still reach after the build.
    if verify {
        let last = set.tiers().last().expect("three tiers").record().path().to_path_buf();
        verify_tier(&last, &source, &source_ids, &format!("{label} tier {LOD_TIER_COUNT}"));
    }

    for outcome in set.tiers() {
        let _ = std::fs::remove_file(outcome.record().path());
    }
    let left: Vec<PathBuf> = std::fs::read_dir(&directory)
        .map(|rd| {
            rd.filter_map(|e| e.ok())
                .map(|e| e.path())
                .filter(|p| p.extension().is_some_and(|x| x == "parquet"))
                .collect()
        })
        .unwrap_or_default();
    assert!(left.is_empty(), "{label}: the tier directory still holds a parquet file: {left:?}");
    println!("{label}: free disk after {:?} B; directory listed empty of parquet files", free_bytes_on_c());
}
