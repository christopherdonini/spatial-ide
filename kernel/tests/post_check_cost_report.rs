// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **The R-D2 post-check's cost, reported per cancellation on a channel the shipped build has.**
//!
//! The human's ruling of 2026-09-16 (round 5, item 3): *"the post-check's cost is reported per
//! cancellation (session log or the terminal's timing fields, never silent, its ≤ 8 MiB bound
//! named)"*.
//!
//! **Why this test exists rather than the trace marks.** `engine::trace`'s `POST_CHECK_BEGIN` /
//! `POST_CHECK_END` pair records the same figure, but `trace::ENABLED` is `false` by default
//! (`engine/src/trace.rs:88`) and `trace::start` has no product caller, so in a shipped run those
//! marks record nothing — the cost was silent, while Amendment 4 (ix) said the obligation was
//! discharged. The carrier that exists in the shipped build is `StreamConnectionRecord`, sent by
//! `impl Drop for EngineSource` (`kernel/src/lib.rs`) on EVERY stream end — cancelled, failed or
//! completed — and consumed by `kernel/src/main.rs`'s connection reporter, which prints it.
//!
//! **From the real product wiring, not an imagined one** (the seam rule, 2026-09-16 round 4). The
//! factory is built with `EngineSourceFactory::with_connection_reports`, which is what
//! `kernel/src/main.rs:157-161` constructs; the stream is created through `SourceFactory::create`
//! over an `OpenRequest`, which is what the data plane calls; and the cancel is the product's own
//! `SourceCancel::cancel`, which is what the binding calls the instant it observes a client abort
//! (`protocol/data-plane/src/transport.rs:128-135`).
//!
//! **No duration anywhere.** What is asserted is a byte count and its declared bound. Nothing here
//! times anything (ADR-018).

use std::sync::Arc;

use spatial_data_plane::transport::{OpenRequest, SourceFactory};
use spatial_engine::fixture::{write_geoparquet, FixtureSpec};
use spatial_engine::FOOTER_DESCRIPTOR_MAX_BYTES;
use spatial_kernel::{Catalog, EngineSourceFactory, StreamConnectionRecord, StreamParams, OPERATION};

const DATASET: &str = "parcels";

fn fixture() -> std::path::PathBuf {
    let dir = std::path::PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../target/fixtures");
    std::fs::create_dir_all(&dir).expect("fixture dir");
    let path = dir.join("post-check-cost-report.parquet");
    write_geoparquet(
        &path,
        &FixtureSpec { features: 20_000, avg_vertices: 24, hole_every: 7, ..Default::default() },
    )
    .expect("write fixture");
    path
}

/// RECORDED MUTATION: drop the `post_check_bytes_read: self.stats.post_check_bytes_read()` line
/// from `StreamConnectionRecord`'s construction in `impl Drop for EngineSource`
/// (`kernel/src/lib.rs`) and leave the field `0`. Expected failure:
/// `a_cancelled_stream_s_connection_record_carries_the_post_check_s_cost` fails on its non-zero
/// assertion — which is the state the branch was actually in before this fix: the cost recorded in
/// the engine and reaching no channel a shipped run reads.
#[test]
fn a_cancelled_stream_s_connection_record_carries_the_post_check_s_cost() {
    let path = fixture();
    let catalog = Catalog::new();
    catalog.open(DATASET, &path, None).expect("open dataset");

    // The product wiring: an unbounded channel whose consumer in the kernel binary prints each
    // record (`kernel/src/main.rs`'s `connection-reporter` thread).
    let (reports, incoming) = std::sync::mpsc::channel::<StreamConnectionRecord>();
    let factory = EngineSourceFactory::with_connection_reports(Arc::new(catalog), reports);

    let params = StreamParams {
        dataset: DATASET.to_string(),
        bbox: None,
        bbox_crs: None,
        limit: None,
    };
    let request = OpenRequest { operation: OPERATION.to_string(), params: params.encode() };
    let (mut source, cancel) = factory.create(&request).expect("the factory creates the stream");

    // One batch, then the product's own cancel — the call the data-plane binding makes.
    let mut buf = Vec::new();
    source.next_into(&mut buf).expect("a first batch").expect("the first batch is not an error");
    buf.clear();
    cancel.cancel();

    // Drain to the terminal. A cancelled stream keeps its `cancelled` terminal; the post-check runs
    // anyway (§13 C rule (ii)) and records its byte count before any terminal is sent.
    let mut terminal = None;
    while let Some(item) = source.next_into(&mut buf) {
        buf.clear();
        if let Err(detail) = item {
            terminal = Some(detail);
            break;
        }
    }
    let terminal = terminal.expect("a cancelled stream terminates with a typed error");
    assert!(terminal.starts_with("engine.cancelled: "), "{terminal}");

    // The record is sent from `Drop`, after the stream is over.
    drop(source);
    drop(factory);

    let record = incoming.recv().expect("the connection record arrives on the product's channel");
    assert_eq!(record.dataset, DATASET);
    assert!(
        record.post_check_bytes_read > 0,
        "the post-check read a footer on the cancelled path and the record must say how much of \
         one — a silent cost is the thing the ruling forbids"
    );
    assert!(
        record.post_check_bytes_read <= FOOTER_DESCRIPTOR_MAX_BYTES,
        "the read is bounded by the declared ceiling: {} > {FOOTER_DESCRIPTOR_MAX_BYTES}",
        record.post_check_bytes_read
    );
}
