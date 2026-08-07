// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **The fixture generator as a `docs/01` principle 7 operation**, and the one compatibility
//! property the 5 GB scale pass rests on.
//!
//! The generator grew two properties for that cut — cancellable, progress-reporting — plus a
//! row-group-size field it needs to stay inside a memory bound at 5 GB. All three are asserted here
//! at small sizes, because the properties are not size-dependent and a test that needed 5 GB would
//! never run.
//!
//! **The byte-identity test is the one that matters most.** `kernel/RESULTS.md` pins fixture
//! geometry by exact byte counts across three measurement sections; a generator change that moved
//! those bytes would silently invalidate them, and the failure would surface as a mysterious
//! measurement drift rather than as a test.

use spatial_engine::fixture::{
    write_geoparquet, write_geoparquet_cancellable, FixtureProgress, FixtureSpec,
};
use spatial_engine::{CancelToken, EngineError};
use std::path::PathBuf;
use std::sync::atomic::{AtomicUsize, Ordering};

fn workspace(name: &str) -> PathBuf {
    let d = std::env::temp_dir().join("spatial-engine-fixture-generation").join(name);
    let _ = std::fs::remove_dir_all(&d);
    std::fs::create_dir_all(&d).unwrap();
    d
}

/// Counts chunks and remembers the last report, so both the cadence and the values are checkable.
#[derive(Default)]
struct Recorder {
    chunks: AtomicUsize,
    last_written: AtomicUsize,
    last_bytes: AtomicUsize,
}

impl FixtureProgress for Recorder {
    fn chunk_written(&self, _index: usize, written: usize, _total: usize, bytes: u64) {
        self.chunks.fetch_add(1, Ordering::SeqCst);
        self.last_written.store(written, Ordering::SeqCst);
        self.last_bytes.store(bytes as usize, Ordering::SeqCst);
    }
}

/// Cancels once it has seen `after` chunks.
struct CancelAfter {
    after: usize,
    seen: AtomicUsize,
    cancel: CancelToken,
}

impl FixtureProgress for CancelAfter {
    fn chunk_written(&self, _: usize, _: usize, _: usize, _: u64) {
        if self.seen.fetch_add(1, Ordering::SeqCst) + 1 >= self.after {
            self.cancel.cancel();
        }
    }
}

/// **The compatibility property every existing measurement depends on.**
///
/// `row_group_rows` defaults to the parquet writer's own 1 048 576, so adding the field changes no
/// existing fixture's bytes. Asserted by generating the same spec twice — once through the old
/// entry point, once through the new one — and comparing the files byte for byte.
///
/// If this fails, every byte count in `kernel/RESULTS.md`'s three sections describes a file the
/// generator no longer produces.
#[test]
fn the_default_spec_produces_byte_identical_files_through_both_entry_points() {
    let d = workspace("byte-identity");
    let spec = FixtureSpec { features: 3_000, ..Default::default() };
    assert_eq!(
        spec.row_group_rows, 1_048_576,
        "the default row-group size must remain the writer's own, or existing fixtures move"
    );

    let a = d.join("a.parquet");
    let b = d.join("b.parquet");
    let fa = write_geoparquet(&a, &spec).unwrap();
    let fb = write_geoparquet_cancellable(&b, &spec, &CancelToken::new(), None).unwrap();

    assert_eq!(std::fs::read(&a).unwrap(), std::fs::read(&b).unwrap(), "the two files differ");
    assert_eq!(fa.bytes, fb.bytes);
    assert_eq!(fa.vertices, fb.vertices);
    assert_eq!(fa.coord_bits_xor, fb.coord_bits_xor);
}

/// A smaller row-group size **does** change the bytes — which is why it is a pre-registered spec
/// field rather than something an instrument sets on the way past.
#[test]
fn changing_the_row_group_size_changes_the_file_and_is_therefore_part_of_the_spec() {
    let d = workspace("row-groups");
    let base = FixtureSpec { features: 3_000, chunk: 512, ..Default::default() };
    let small = FixtureSpec { row_group_rows: 512, ..base.clone() };

    let a = d.join("default.parquet");
    let b = d.join("small.parquet");
    write_geoparquet(&a, &base).unwrap();
    write_geoparquet(&b, &small).unwrap();

    assert_ne!(
        std::fs::read(&a).unwrap(),
        std::fs::read(&b).unwrap(),
        "row_group_rows had no effect on the file, so it is not doing what the 5 GB memory bound \
         needs it to do"
    );
    // …and the geometry is unchanged, so the difference is layout rather than content.
    let fa = write_geoparquet(&d.join("fa.parquet"), &base).unwrap();
    let fb = write_geoparquet(&d.join("fb.parquet"), &small).unwrap();
    assert_eq!(fa.coord_bits_xor, fb.coord_bits_xor);
    assert_eq!(fa.vertices, fb.vertices);
}

/// Progress is reported once per chunk, and its counts are the real ones.
#[test]
fn generation_reports_progress_once_per_chunk_with_monotonic_counts() {
    let d = workspace("progress");
    let spec = FixtureSpec { features: 2_048, chunk: 256, ..Default::default() };
    let rec = Recorder::default();
    let facts = write_geoparquet_cancellable(
        &d.join("f.parquet"),
        &spec,
        &CancelToken::new(),
        Some(&rec),
    )
    .unwrap();

    assert_eq!(rec.chunks.load(Ordering::SeqCst), 8, "2048 features / 256 per chunk");
    assert_eq!(
        rec.last_written.load(Ordering::SeqCst),
        2_048,
        "the final report must account for every feature"
    );
    assert_eq!(facts.features, 2_048);
    // The writer's own byte count is non-zero and below the finished file, since the footer is
    // written by `close` after the last chunk report.
    let reported = rec.last_bytes.load(Ordering::SeqCst) as u64;
    assert!(reported > 0, "no bytes were reported");
    assert!(
        reported <= facts.bytes,
        "reported {reported} B exceeds the finished file's {} B",
        facts.bytes
    );
}

/// **Cancellation mid-generation returns `Cancelled` and leaves no file behind.**
///
/// The orphan is the point. At the 5 GB class an interrupted generation that left its partial file
/// would cost gigabytes of disk and could be mistaken for a complete fixture.
#[test]
fn a_cancelled_generation_returns_cancelled_and_removes_the_partial_file() {
    let d = workspace("cancel-mid");
    let path = d.join("f.parquet");
    let cancel = CancelToken::new();
    let obs = CancelAfter { after: 2, seen: AtomicUsize::new(0), cancel: cancel.clone() };

    let spec = FixtureSpec { features: 8_192, chunk: 256, ..Default::default() };
    let e = write_geoparquet_cancellable(&path, &spec, &cancel, Some(&obs)).unwrap_err();

    assert!(matches!(e, EngineError::Cancelled), "expected Cancelled, got {e:?}");
    assert!(!path.exists(), "a partial fixture survived cancellation: {}", path.display());
}

/// Cancelled **before the first chunk** — the case a flag polled only between chunks would miss,
/// and the one where the file has just been created and is still empty.
#[test]
fn a_generation_cancelled_before_it_starts_writes_nothing_and_leaves_nothing() {
    let d = workspace("cancel-early");
    let path = d.join("f.parquet");
    let cancel = CancelToken::new();
    cancel.cancel();

    let spec = FixtureSpec { features: 8_192, chunk: 256, ..Default::default() };
    let e = write_geoparquet_cancellable(&path, &spec, &cancel, None).unwrap_err();

    assert!(matches!(e, EngineError::Cancelled), "expected Cancelled, got {e:?}");
    assert!(!path.exists(), "an empty partial file survived: {}", path.display());
}

/// **A cancel arriving during the last chunk must not produce a complete, valid file.**
///
/// This is the unconditional check before `close`. Without it the loop would exit normally, the
/// footer would be written, and the caller would receive a perfectly good fixture from a run it had
/// cancelled — an interrupted build returning `Ok`, which is the failure the engine's own index
/// build already learned once.
#[test]
fn a_cancel_during_the_final_chunk_still_refuses_rather_than_closing_a_valid_file() {
    let d = workspace("cancel-last");
    let path = d.join("f.parquet");
    let cancel = CancelToken::new();
    // 4 chunks of 256; cancel on the last one, so the loop is about to exit anyway.
    let obs = CancelAfter { after: 4, seen: AtomicUsize::new(0), cancel: cancel.clone() };

    let spec = FixtureSpec { features: 1_024, chunk: 256, ..Default::default() };
    let e = write_geoparquet_cancellable(&path, &spec, &cancel, Some(&obs)).unwrap_err();

    assert!(matches!(e, EngineError::Cancelled), "expected Cancelled, got {e:?}");
    assert!(!path.exists(), "a cancelled run produced a closed file: {}", path.display());
}
