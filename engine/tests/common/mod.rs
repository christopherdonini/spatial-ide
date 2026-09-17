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
/// Two changes close it:
///
/// 1. The `Mutex` below serializes the check-and-generate, so only the first caller through this
///    function ever generates — every other caller blocks on the lock until that generation
///    finishes, then finds the file already there and skips.
/// 2. Generation writes to a temporary path in the same directory, `rename`d into place only once
///    complete, so nothing under the final name is ever a partial write — including for a reader
///    that opens [`POLYGONS_100K`] directly rather than through this function.
///
/// **Both are load-bearing, for different reasons.** The rename is what makes a *reader that opens
/// the fixture directly* safe: nothing under the final name is ever less than complete, whoever
/// opens it. The lock is what makes "every caller waits for one generation" true rather than merely
/// "every caller eventually gets a complete file" — two unguarded callers would still generate to
/// the *same* fixed temporary path at once, and it is the lock, not the rename, that keeps that
/// generation from happening twice. See
/// `two_concurrent_callers_of_an_absent_fixture_both_get_the_complete_file` in `lod_tier_builder.rs`
/// for the proof and its `RECORDED MUTATION` for what removing only the lock does.
pub fn polygons_100k() -> PathBuf {
    static GENERATE: Mutex<()> = Mutex::new(());
    let path = PathBuf::from(POLYGONS_100K);
    let _guard = GENERATE.lock().expect("lock");
    if !path.is_file() {
        std::fs::create_dir_all(path.parent().expect("fixture dir")).expect("fixture dir");
        let tmp = path.with_extension("parquet.tmp");
        write_geoparquet(
            &tmp,
            &FixtureSpec { features: 100_000, avg_vertices: 100, hole_every: 7, ..Default::default() },
        )
        .expect("regenerate polygons-100k");
        GENERATIONS.fetch_add(1, Ordering::SeqCst);
        std::fs::rename(&tmp, &path).expect("publish polygons-100k atomically");
    }
    path
}

/// How many times [`polygons_100k`] has actually invoked the generator in this process.
///
/// **Test instrument only.** Its only caller is
/// `two_concurrent_callers_of_an_absent_fixture_both_get_the_complete_file`
/// (`lod_tier_builder.rs`), which reads it to prove that two concurrent callers of an absent fixture
/// cause exactly one generation — the property the lock in [`polygons_100k`] exists for — rather
/// than each racing to generate its own. This module is compiled fresh into each of the three LOD
/// test binaries (`mod common;` per binary, not a shared library), and only
/// `lod_tier_builder.rs`'s copy calls this — `#[allow(dead_code)]` is for the other two.
static GENERATIONS: AtomicU64 = AtomicU64::new(0);

#[allow(dead_code)]
pub fn generations_performed() -> u64 {
    GENERATIONS.load(Ordering::SeqCst)
}
