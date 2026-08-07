// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! Progressive first-batch sizing — a small first batch so pixels can land sooner, growing to the
//! steady-state target afterwards.
//!
//! Two things this file is careful **not** to claim. It does not claim `docs/08`'s "First pixels
//! < 100 ms" is met: `kernel/RESULTS.md` attributes p50 109.7 ms to the producer before any browser
//! is involved, that figure is query start-up *plus* scan-until-full, and this policy attacks only
//! the second. And it quotes no wall-clock improvement at all — the tester owns that, within a
//! session, against a baseline re-measured in the same session.
//!
//! What it does assert is the policy's *structure*: that the ceiling stays a ceiling in every state
//! the policy can reach, that the first batch really is smaller, and that shrinking it did not cost
//! the alignment the whole payload path depends on.

use std::path::PathBuf;

use spatial_engine::fixture::{write_geoparquet, FixtureFacts, FixtureSpec};
use spatial_engine::stream::{
    BatchSizePolicy, BATCH_GROWTH_FACTOR, FIRST_TARGET_BATCH_BYTES, MAX_BATCH_BYTES,
    MIN_BATCH_BYTES, TARGET_BATCH_BYTES,
};
use spatial_engine::{Dataset, ViewportQuery};

fn write(name: &str, spec: &FixtureSpec) -> (PathBuf, FixtureFacts) {
    let dir = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../target/fixtures/sizing");
    std::fs::create_dir_all(&dir).expect("fixture dir");
    let path = dir.join(format!("{name}.parquet"));
    let facts = write_geoparquet(&path, spec).expect("write fixture");
    (path, facts)
}

fn medium() -> FixtureSpec {
    FixtureSpec { features: 20_000, avg_vertices: 24, ..Default::default() }
}

#[test]
fn the_policy_stays_inside_its_ceiling_in_every_state_it_can_reach() {
    // ADR-010 rule 6 asks that a ceiling stay a ceiling. The compile-time asserts in `stream.rs`
    // are what guarantee it; this walks far past any batch count a real stream reaches, including
    // indices where a naive `first * factor^n` would have overflowed.
    let p = BatchSizePolicy::default();
    let mut previous = 0usize;
    for i in 0..1_000u64 {
        let t = p.target_for(i);
        assert!(t >= MIN_BATCH_BYTES, "batch {i} target {t} is below the declared floor");
        assert!(t <= TARGET_BATCH_BYTES, "batch {i} target {t} exceeded the steady-state target");
        assert!(t < MAX_BATCH_BYTES, "batch {i} target {t} reached the hard ceiling");
        assert!(t >= previous, "targets must be monotone non-decreasing; {t} followed {previous}");
        previous = t;
    }
    // And it does settle rather than creeping forever.
    assert_eq!(p.target_for(64), TARGET_BATCH_BYTES);
    assert_eq!(p.target_for(u64::MAX), TARGET_BATCH_BYTES, "saturating, not wrapping");
}

#[test]
fn the_first_target_is_the_declared_first_target_and_growth_is_the_declared_factor() {
    let p = BatchSizePolicy::default();
    assert_eq!(p.target_for(0), FIRST_TARGET_BATCH_BYTES);
    assert_eq!(p.target_for(1), FIRST_TARGET_BATCH_BYTES * BATCH_GROWTH_FACTOR);
    // A degenerate policy — no growth — is still bounded, which is what makes the bound structural
    // rather than a property of the chosen constants.
    let flat = BatchSizePolicy { growth_factor: 1, ..BatchSizePolicy::default() };
    assert_eq!(flat.target_for(50), FIRST_TARGET_BATCH_BYTES);
}

#[test]
fn the_first_batch_is_smaller_than_the_steady_state_and_the_stream_grows_into_it() {
    let (path, facts) = write("progressive", &medium());
    let ds = Dataset::open(&path).expect("open");
    let mut s = ds.stream(&ViewportQuery::all()).expect("stream");

    let policy = s.size_policy();
    assert_eq!(policy.first_target_bytes, FIRST_TARGET_BATCH_BYTES);

    let mut sizes = Vec::new();
    let mut targets = Vec::new();
    let mut rows = 0usize;
    let mut buf = Vec::new();
    while let Some(info) = s.next_into(&mut buf) {
        let info = info.expect("batch");
        assert_eq!(info.batch_index as usize, sizes.len(), "batch_index counts the stream");
        assert_eq!(info.target_bytes, policy.target_for(info.batch_index));
        sizes.push(info.payload_bytes);
        targets.push(info.target_bytes);
        rows += info.rows;
        buf.clear();
    }

    assert_eq!(rows, facts.features, "sizing must not change what is delivered");
    assert!(sizes.len() > 3, "the fixture must produce enough batches to see growth");
    // The property, stated as a comparison rather than as an absolute size: the first batch is
    // smaller than the steady state it grows into.
    assert!(
        sizes[0] < *sizes.last().unwrap(),
        "first batch {} should be smaller than the last {}",
        sizes[0],
        sizes.last().unwrap()
    );
    assert!(targets[0] < *targets.last().unwrap(), "targets must grow");
    // Every batch honours the hard ceiling regardless of where in the ramp it sits.
    for (i, b) in sizes.iter().enumerate() {
        assert!(*b <= MAX_BATCH_BYTES, "batch {i} of {b} B exceeded MAX_BATCH_BYTES");
    }
}

#[test]
fn shrinking_the_first_batch_does_not_cost_the_eight_byte_alignment() {
    // **The regression this policy could plausibly cause.** ADR-012's Consequences make frame
    // alignment a documented constraint, and the bake-off found Arrow JS yields a buffer *view*
    // only at an 8-byte-aligned offset — otherwise it copies the whole payload. A differently
    // shaped first batch produces different interior offsets, so the first batch is checked
    // specifically rather than trusting the aggregate.
    let (path, _) = write("alignment", &medium());
    let ds = Dataset::open(&path).expect("open");
    let mut s = ds.stream(&ViewportQuery::all()).expect("stream");

    let mut buf = Vec::new();
    let mut checked = 0;
    while let Some(info) = s.next_into(&mut buf) {
        info.expect("batch");
        let reader =
            arrow::ipc::reader::StreamReader::try_new(std::io::Cursor::new(&buf), None).unwrap();
        for batch in reader {
            let batch = batch.unwrap();
            for col in 0..batch.num_columns() {
                for buffer in batch.column(col).to_data().buffers() {
                    assert_eq!(
                        buffer.as_ptr() as usize % 8,
                        0,
                        "batch {checked}, column {col}: buffer is not 8-byte aligned"
                    );
                }
            }
        }
        checked += 1;
        if checked == 3 {
            break; // the first three cover the ramp's small end, which is where risk lives
        }
        buf.clear();
    }
    assert!(checked >= 1, "nothing was checked");
}

#[test]
fn the_floor_is_above_the_per_batch_envelope_so_a_small_batch_is_not_mostly_metadata() {
    // Every batch is a complete self-contained Arrow IPC stream — schema, metadata, batch, EOS —
    // because that is what puts the ADR-010 rule 1 tag on *every* batch. The cost is that the whole
    // envelope repeats per batch, so the floor has to sit above it or the extra round trip buys
    // nothing. Measured against a real envelope rather than assumed.
    let (path, _) = write("floor", &FixtureSpec { features: 1, ..medium() });
    let ds = Dataset::open(&path).expect("open");
    let mut s = ds.stream(&ViewportQuery::all()).expect("stream");
    let mut buf = Vec::new();
    let info = s.next_into(&mut buf).expect("one batch").expect("ok");
    let one_feature_batch = info.payload_bytes;

    assert!(
        MIN_BATCH_BYTES > one_feature_batch,
        "the declared floor ({MIN_BATCH_BYTES} B) must exceed a one-feature batch \
         ({one_feature_batch} B), or a floor-sized batch is mostly envelope"
    );
}
