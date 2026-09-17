// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! Shared test support for the LOD tier-builder suites — `lod_tier_builder.rs`,
//! `lod_tier_cancellation.rs`, `lod_tier_measurements.rs`. `tests/common/mod.rs` is outside cargo's
//! `tests/*.rs` auto-discovery (it lives in a subdirectory), so this file is never itself compiled
//! as a separate test binary.

use std::path::PathBuf;
use std::sync::atomic::{AtomicU64, Ordering};
use std::sync::Mutex;

use spatial_engine::fixture::{write_geoparquet, FixtureSpec};

/// `LOD-PREREGISTRATION.md` §3's `polygons-100k`, by absolute path.
///
/// The shared target directory is not inside a worktree, so this is read where it actually lives
/// rather than resolved against `CARGO_MANIFEST_DIR`.
pub const POLYGONS_100K: &str =
    r"C:\dev\spatial-ide\target\fixtures\slice-budgets\polygons-100k.parquet";

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
/// writes this same absolute path directly, with neither a lock nor a temp-then-rename (an
/// `#[ignore]`d by-hand harness, not run alongside this suite in ordinary `cargo test` practice), so
/// a reader racing *that* writer would still see the partial-write hazard this function's own rename
/// exists to prevent. The lock is what makes "every caller waits for one generation" true rather
/// than merely "every caller eventually gets a complete file" — two callers unguarded by it would
/// still generate to the *same* temporary path (per process) at once, and it is the lock, not the
/// rename, that keeps that generation from happening twice within one process. The per-process name
/// is what keeps two *processes'* generations from sharing one temporary path. See
/// `two_concurrent_callers_of_an_absent_fixture_both_get_the_complete_file` in `lod_tier_builder.rs`
/// for the proof and its `RECORDED MUTATION` for what removing only the lock does.
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
            &FixtureSpec { features: 100_000, avg_vertices: 100, hole_every: 7, ..Default::default() },
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
/// than each racing to generate its own. This module is compiled fresh into each of the three LOD
/// test binaries (`mod common;` per binary, not a shared library), and only
/// `lod_tier_builder.rs`'s copy calls this — `#[allow(dead_code)]` is for the other two.
#[allow(dead_code)]
pub fn generations_performed() -> u64 {
    GENERATIONS.load(Ordering::SeqCst)
}
