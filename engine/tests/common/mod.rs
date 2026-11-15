// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! Shared test support for the LOD tier-builder suites — `lod_tier_builder.rs`,
//! `lod_tier_cancellation.rs`, `lod_tier_measurements.rs`, `lod_tier_preflight.rs`.
//! `tests/common/mod.rs` is outside cargo's `tests/*.rs` auto-discovery (it lives in a subdirectory),
//! so this file is never itself compiled as a separate test binary.

use std::ffi::OsString;
use std::path::{Path, PathBuf};
use std::sync::atomic::{AtomicU64, Ordering};
use std::sync::{Mutex, OnceLock};

use spatial_engine::cancel::CancelToken;
use spatial_engine::dataset::Dataset;
use spatial_engine::error::Result;
use spatial_engine::fixture::{write_geoparquet, FixtureSpec};
use spatial_engine::lod::{TierBuildProgress, TierSet};

/// `LOD-PREREGISTRATION.md` §3's `polygons-100k`, by absolute path.
///
/// The shared target directory is not inside a worktree, so this is read where it actually lives
/// rather than resolved against `CARGO_MANIFEST_DIR`.
#[cfg(windows)]
#[allow(dead_code)]
pub const POLYGONS_100K: &str =
    r"C:\dev\spatial-ide\target\fixtures\slice-budgets\polygons-100k.parquet";

/// Off Windows, the same fixture under this workspace's own target directory, never a file whose
/// name is the Windows path above.
#[cfg(not(windows))]
pub const POLYGONS_100K: &str = concat!(
    env!("CARGO_MANIFEST_DIR"),
    "/../target/fixtures/slice-budgets/polygons-100k.parquet"
);

/// The spec `polygons-100k` was written from (`kernel/tests/slice_budgets.rs:472-486`), restated so
/// an absent fixture is regenerated as the same bytes rather than as a different dataset.
///
/// **Regenerated once, published atomically.** All three LOD suites' tests run their own test
/// functions across several parallel threads inside one process, and every one of the three suites
/// calls this function. On a fresh runner where the fixture is absent, more than one thread reaches
/// it before any of them has finished writing. Before this held a lock, that raced against a reader
/// that opened the file directly: observed on `windows-latest` (CI runs 35170101692 and 35170138013,
/// identical) as `read_ids`'s `ParquetRecordBatchReaderBuilder::try_new` panicking with
/// `reader: EOF("Parquet file too small. Size is 0 but need 8")` — a reader had opened the fixture
/// while a *different* thread's `write_geoparquet` was still writing it, directly, under the final
/// name.
///
/// Three changes close it:
///
/// 1. The `Mutex` below serializes the check-and-generate, so only the first caller through this
///    function ever generates — every other caller blocks on the lock until that generation
///    finishes, then finds the file already there and skips.
/// 2. Generation writes to a temporary path in the same directory, `rename`d into place only once
///    complete, so nothing under the final name is ever a partial write — including for a reader
///    that opens [`POLYGONS_100K`] directly rather than through this function.
/// 3. That temporary path is named with this process's own id, not a fixed name, so two separate
///    `cargo test` processes — two worktrees regenerating the same absent fixture at once is
///    documented practice here — never interleave writes into *one* temporary file and publish
///    whichever bytes landed last. Within a single process the `Mutex` already keeps every thread
///    but the first from writing at all, so this only matters across processes, which share no
///    `Mutex` (`LOD-PREREGISTRATION.md` §10 Amendment 11).
///
/// **All three are load-bearing, for different reasons.** The rename is what makes a *reader that
/// opens the fixture directly* safe: no write this function performs is ever visible partially
/// under the final name. That guarantee is per-helper, not per-path — `kernel/tests/slice_budgets.rs:472-486`
/// writes this same absolute path directly when run from the primary checkout, with neither a lock nor a temp-then-rename (an
/// `#[ignore]`d by-hand harness, not run alongside this suite in ordinary `cargo test` practice), so
/// a reader racing *that* writer would still see the partial-write hazard this function's own rename
/// exists to prevent. The lock is what makes "every caller waits for one generation" true rather
/// than merely "every caller eventually gets a complete file" — two callers unguarded by it would
/// still generate to the *same* temporary path (per process) at once, and it is the lock, not the
/// rename, that keeps that generation from happening twice within one process. The per-process name
/// is what keeps two *processes'* generations from sharing one temporary path. See
/// `two_concurrent_callers_of_an_absent_fixture_both_get_the_complete_file` in `lod_tier_builder.rs`
/// for the proof and its `RECORDED MUTATION` for what removing only the lock does.
#[allow(dead_code)]
pub fn polygons_100k() -> PathBuf {
    static GENERATE: Mutex<()> = Mutex::new(());
    let path = PathBuf::from(POLYGONS_100K);
    // A poisoned lock (a prior caller panicked while holding it) must not bury that first failure
    // behind a second, unrelated `"lock"` panic here — the inner guard is still usable, so take it.
    let _guard = GENERATE.lock().unwrap_or_else(|e| e.into_inner());
    if !path.is_file() {
        std::fs::create_dir_all(path.parent().expect("fixture dir")).expect("fixture dir");
        let tmp = PathBuf::from(format!("{}.{}.tmp", path.display(), std::process::id()));
        write_geoparquet(
            &tmp,
            &FixtureSpec {
                features: 100_000,
                avg_vertices: 100,
                hole_every: 7,
                ..Default::default()
            },
        )
        .expect("regenerate polygons-100k");
        std::fs::rename(&tmp, &path).expect("publish polygons-100k atomically");
        GENERATIONS.fetch_add(1, Ordering::SeqCst);
    }
    path
}

static GENERATIONS: AtomicU64 = AtomicU64::new(0);

/// How many times [`polygons_100k`] has actually invoked the generator in this process.
///
/// **Test instrument only.** Its only caller is
/// `two_concurrent_callers_of_an_absent_fixture_both_get_the_complete_file`
/// (`lod_tier_builder.rs`), which reads it to prove that two concurrent callers of an absent fixture
/// cause exactly one generation — the property the lock in [`polygons_100k`] exists for — rather
/// than each racing to generate its own. This module is compiled fresh into each of the four LOD
/// test binaries (`mod common;` per binary, not a shared library), and only
/// `lod_tier_builder.rs`'s copy calls this — `#[allow(dead_code)]` is for the other three.
#[allow(dead_code)]
pub fn generations_performed() -> u64 {
    GENERATIONS.load(Ordering::SeqCst)
}

/// What the first call of [`tier_run_root`] decided for this process.
struct TierRun {
    root: PathBuf,
    inherited_local_app_data: Option<OsString>,
    /// Held open with no sharing for as long as the process lives (Windows closes it when the
    /// process exits, however it exits), so another run's sweep can tell this run is live.
    #[cfg(windows)]
    _lock: std::fs::File,
}

fn tier_run() -> &'static TierRun {
    static RUN: OnceLock<TierRun> = OnceLock::new();
    RUN.get_or_init(|| {
        let inherited_local_app_data = std::env::var_os("LOCALAPPDATA");
        let runs = Path::new(env!("CARGO_TARGET_TMPDIR")).join("lod-tier-runs");
        let id = std::process::id();
        let root = runs.join(id.to_string());
        #[cfg(windows)]
        let lock = take_folder_and_sweep(&runs, &root, id);
        if cfg!(windows) {
            std::env::set_var("LOCALAPPDATA", &root);
        }
        TierRun {
            root,
            inherited_local_app_data,
            #[cfg(windows)]
            _lock: lock,
        }
    })
}

/// Takes this run's lock file, removes the folder of every run whose lock can be opened, and
/// creates this run's folder empty.
///
/// A live run holds its `<pid>.lock` open with no sharing, so opening it fails and its folder is
/// skipped; a run that has exited has released it, so its folder and lock file are removed. No age,
/// clock or process-liveness test is involved.
#[cfg(windows)]
fn take_folder_and_sweep(runs: &Path, root: &Path, id: u32) -> std::fs::File {
    use std::os::windows::fs::OpenOptionsExt;
    std::fs::create_dir_all(runs).expect("create the tier runs folder");
    let own = std::fs::OpenOptions::new()
        .write(true)
        .create(true)
        .truncate(false)
        .share_mode(0)
        .open(runs.join(format!("{id}.lock")))
        .expect("take this run's lock");
    for entry in std::fs::read_dir(runs)
        .expect("list the tier runs")
        .flatten()
    {
        let lock = entry.path();
        if lock.extension().and_then(|x| x.to_str()) != Some("lock") {
            continue;
        }
        let Ok(finished) = std::fs::OpenOptions::new()
            .read(true)
            .share_mode(0)
            .open(&lock)
        else {
            continue;
        };
        let _ = std::fs::remove_dir_all(lock.with_extension(""));
        drop(finished);
        let _ = std::fs::remove_file(&lock);
    }
    let _ = std::fs::remove_dir_all(root);
    std::fs::create_dir_all(root).expect("create this run's tier folder");
    own
}

/// The folder this test process builds its LOD tiers under. On Windows the first call creates it,
/// removes the folders of runs that have finished, and points `LOCALAPPDATA` at it for the rest of
/// the process (a test that injects another value puts this one back, as `lod_tier_preflight.rs`
/// does), once and before any build there, so a build made through [`build_tiers`] below lands in
/// `<this folder>/spatial-ide/tiers/<content hash>`. Call it before reading `LOCALAPPDATA` for a
/// tier path. Off Windows it creates nothing and sets nothing: no tier root is declared there.
pub fn tier_run_root() -> &'static Path {
    &tier_run().root
}

/// `LOCALAPPDATA` as this process inherited it, read before [`tier_run_root`] sets its own (on
/// Windows only). For a run that cargo starts it is the machine-wide root a test run must not build
/// under; in T-B's second process it is the first process's own folder.
#[allow(dead_code)]
pub fn inherited_local_app_data() -> Option<&'static OsString> {
    tier_run().inherited_local_app_data.as_ref()
}

/// The engine's `build_tiers`, called after [`tier_run_root`], so that on Windows this process's
/// tier folder exists and `LOCALAPPDATA` points at it unless a test has set another value for an
/// injection (`lod_tier_preflight.rs`). The four LOD suites build through this and not through
/// `spatial_engine::lod::build_tiers` itself; `lod_tier_root.rs` keeps the engine's.
pub fn build_tiers(
    source: &Dataset,
    workers: usize,
    cancel: &CancelToken,
    progress: Option<&dyn TierBuildProgress>,
) -> Result<TierSet> {
    tier_run_root();
    spatial_engine::lod::build_tiers(source, workers, cancel, progress)
}
