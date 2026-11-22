// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! The cancellation request's stamp, through the public API and the real trace.
//!
//! The trace is process-global and an event names no stream, so this file is a binary of its own
//! and every test takes `serial()` first: no other test can stamp into the trace one of these reads.
//! Each test starts its own trace, and the ones that loop start one per iteration.

use std::path::PathBuf;
use std::sync::{Arc, Barrier, Mutex, MutexGuard};
use std::time::{Duration, Instant};

use spatial_engine::fixture::{write_geoparquet, FixtureSpec};
use spatial_engine::trace::{self, Trace, TraceGuard, TraceKey};
use spatial_engine::{CancelToken, Dataset, ViewportQuery};

static SERIAL: Mutex<()> = Mutex::new(());

fn serial() -> MutexGuard<'static, ()> {
    SERIAL.lock().unwrap_or_else(|e| e.into_inner())
}

fn start(label: &str) -> TraceGuard {
    trace::start(TraceKey {
        dataset: "cancel-request-stamp".into(),
        physical_id: 0,
        lease_generation: 0,
        label: label.into(),
    })
    .expect("no other trace is running in this binary")
}

fn requests(trace: &Trace) -> usize {
    trace
        .events()
        .iter()
        .filter(|e| e.name == trace::CANCELLATION_REQUESTED)
        .count()
}

#[test]
fn a_token_cancelled_twice_leaves_one_request_stamp_in_the_trace() {
    let _serial = serial();
    let guard = start("a_token_cancelled_twice_leaves_one_request_stamp_in_the_trace");
    let token = CancelToken::new();
    token.cancel();
    token.cancel();
    token.clone().cancel();
    let trace = guard.trace();
    drop(guard);
    assert_eq!(
        requests(&trace),
        1,
        "a token cancelled three times left a number of request stamps other than 1"
    );
}

#[test]
fn concurrent_cancellers_leave_one_request_stamp_per_token() {
    const K: usize = 8;
    const M: usize = 200;
    let _serial = serial();
    for i in 0..M {
        let guard = start("concurrent_cancellers_leave_one_request_stamp_per_token");
        let token = CancelToken::new();
        let barrier = Arc::new(Barrier::new(K));
        let cancellers: Vec<_> = (0..K)
            .map(|_| {
                let (token, barrier) = (token.clone(), Arc::clone(&barrier));
                std::thread::spawn(move || {
                    barrier.wait();
                    token.cancel();
                })
            })
            .collect();
        for c in cancellers {
            c.join().expect("a canceller");
        }
        let trace = guard.trace();
        drop(guard);
        assert_eq!(
            requests(&trace),
            1,
            "iteration {i}: {K} concurrent cancels of one token left a number of request stamps \
             other than 1"
        );
    }
}

#[test]
fn an_observer_spinning_on_the_flag_never_stamps_before_the_request() {
    const M: usize = 200;
    // Bounds only how long one failing iteration's spin runs; never reported as a latency.
    const I3_SPIN_DEADLINE: Duration = Duration::from_secs(60);
    let _serial = serial();
    let mut inversions = Vec::new();
    for i in 0..M {
        let guard = start("an_observer_spinning_on_the_flag_never_stamps_before_the_request");
        let token = CancelToken::new();
        let barrier = Arc::new(Barrier::new(2));
        let observer = {
            let (token, barrier) = (token.clone(), Arc::clone(&barrier));
            std::thread::spawn(move || {
                barrier.wait();
                let deadline = Instant::now() + I3_SPIN_DEADLINE;
                let mut spins: u32 = 0;
                while !token.is_cancelled() {
                    spins = spins.wrapping_add(1);
                    assert!(
                        !spins.is_multiple_of(1024) || Instant::now() < deadline,
                        "the observer's spin saw no published flag within {I3_SPIN_DEADLINE:?}"
                    );
                }
                trace::mark(trace::PRODUCER_CANCELLED, 0, 0);
            })
        };
        barrier.wait();
        token.cancel();
        observer.join().expect("the observer");
        let trace = guard.trace();
        drop(guard);
        let requested = trace
            .first(trace::CANCELLATION_REQUESTED)
            .expect("cancel_requested was stamped");
        let observed = trace
            .first(trace::PRODUCER_CANCELLED)
            .expect("the observer stamped");
        if observed.offset_nanos < requested.offset_nanos {
            inversions.push((i, requested.offset_nanos, observed.offset_nanos));
        }
    }
    println!(
        "an_observer_spinning_on_the_flag_never_stamps_before_the_request: {} inversions in {M} \
         iterations",
        inversions.len()
    );
    assert!(
        inversions.is_empty(),
        "{} of {M} iterations stamped the observer before the request; (iteration, requested ns, \
         observed ns): {inversions:?}",
        inversions.len()
    );
}

fn fixture_dir() -> PathBuf {
    let d = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../target/fixtures");
    std::fs::create_dir_all(&d).expect("fixture dir");
    d
}

#[test]
fn a_cancel_after_a_drop_of_the_same_token_stamps_no_request() {
    let _serial = serial();
    // This test's own fixture: 2,000 features of about 20 vertices, the default seed.
    let path = fixture_dir().join("cancel-request-stamp-i4.parquet");
    write_geoparquet(
        &path,
        &FixtureSpec {
            features: 2_000,
            avg_vertices: 20,
            ..Default::default()
        },
    )
    .expect("write fixture");
    let ds = Dataset::open(&path).expect("open");

    let guard = start("a_cancel_after_a_drop_of_the_same_token_stamps_no_request");
    let token = CancelToken::new();
    let mut stream = ds
        .stream_with_cancel(&ViewportQuery::all(), token.clone())
        .expect("stream");
    let mut buf = Vec::new();
    while let Some(batch) = stream.next_into(&mut buf) {
        batch.expect("the stream drains with no error");
        buf.clear();
    }
    // The drop runs `cancel_for_drop`, which sets the flag and stamps nothing.
    drop(stream);
    assert!(
        token.is_cancelled(),
        "the stream's drop did not cancel its token"
    );
    token.cancel();

    let trace = guard.trace();
    drop(guard);
    assert_eq!(
        requests(&trace),
        0,
        "a cancel after a drop of the same token stamped a request"
    );
    assert!(
        trace
            .segment_ms(trace::CANCELLATION_REQUESTED, trace::PRODUCER_CANCELLED)
            .is_none(),
        "a segment opening on the request is derivable for a token whose drop came first"
    );
}
