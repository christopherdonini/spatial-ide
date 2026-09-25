// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **Emission, one route per test** (ADR-035 Consequences) —
//! `engine/SOURCE-WATCHER-PREREGISTRATION.md` §4's E1–E4, E6, E9, E10. E5, E7 and E8 are in-crate,
//! in `kernel/src/skp.rs`'s own `ticket_drop_under_lock_regression` module, reusing its helpers.

mod injected_watch;
mod watch_support;

use std::path::PathBuf;
use std::sync::Arc;
use std::time::Duration;

use spatial_data_plane::transport::{OpenRequest, SourceFactory};
use spatial_engine::fixture::{write_geoparquet, FixtureSpec};
use spatial_engine::WatchSignal;
use spatial_kernel::skp::{
    session_end_channel, GenerationRegistry, SessionEndReason, SessionInvalidator, SkpHost,
    StreamRegistry, SESSION_END_EVENT_QUEUE_BOUND,
};
use spatial_kernel::{Catalog, EngineSourceFactory, OPERATION};
use spatial_skp::v0::{DatasetHandle, EndReason, OpenDatasetRequest, SessionRef, ViewportQueryRequest, SKP_VERSION};

fn dir() -> PathBuf {
    let d = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../target/fixtures/session-end-event");
    std::fs::create_dir_all(&d).expect("fixture dir");
    d
}

fn fixture(name: &str) -> PathBuf {
    let path = dir().join(format!("{name}.parquet"));
    write_geoparquet(&path, &FixtureSpec { features: 300, avg_vertices: 10, hole_every: 0, ..Default::default() })
        .expect("write fixture");
    path
}

fn touch_modification_time(path: &std::path::Path) {
    let later = std::time::SystemTime::now() + Duration::from_secs(120);
    std::fs::File::options()
        .write(true)
        .open(path)
        .expect("reopen to touch mtime")
        .set_modified(later)
        .expect("touch mtime");
}

fn open_req(path: &std::path::Path, cancel_key: &str) -> OpenDatasetRequest {
    OpenDatasetRequest {
        skp: SKP_VERSION.to_string(),
        path: path.display().to_string(),
        cancel_key: cancel_key.to_string(),
        crs_assertion: None,
        identity: None,
    }
}

fn viewport_req(dataset: DatasetHandle) -> ViewportQueryRequest {
    ViewportQueryRequest { skp: SKP_VERSION.to_string(), dataset, bbox: None, bbox_crs: None, limit: None, filter: None }
}

// -------------------------------------------------------------------------------------------
// E1 — a pre-check end emits once and refuses its call
// -------------------------------------------------------------------------------------------

/// RECORDED MUTATION: move the `try_send` out of `SessionInvalidator::end_generation` into
/// `SkpHost::end_generation` only (so the post-check/drop routes, which share the same
/// `SessionInvalidator`, would no longer emit). Expected failure: E2/E3/E4/E6 below stop emitting;
/// this test alone stays green, which is the point — it isolates the pre-check's own route.
#[test]
fn a_pre_check_end_emits_once_and_refuses_its_call() {
    let path = fixture("e1");
    let (tx, rx) = session_end_channel();
    let host = SkpHost::new(Arc::new(Catalog::new()), StreamRegistry::new(), watch_support::no_watch_arm(), tx);
    let open = host.open_dataset(open_req(&path, "e1")).expect("open");
    // A real ticket, so the pre-check's own `end_generation` call has something to cancel.
    let _ticket = host.viewport_query(viewport_req(open.dataset.clone())).expect("mint");

    touch_modification_time(&path);

    let refused = host.viewport_query(viewport_req(open.dataset)).expect_err("the pre-check refuses");
    assert_eq!(refused.code, "engine.source_changed", "{}", refused.message);

    let event = rx.recv_timeout(Duration::from_secs(5)).expect("one event");
    assert_eq!(event.reason, EndReason::ObservedChange);
    assert!(rx.recv_timeout(Duration::from_millis(200)).is_err(), "exactly one event");
}

// -------------------------------------------------------------------------------------------
// E2 — a post-check end on a clean terminal emits once
// -------------------------------------------------------------------------------------------

/// A modification-time-only touch: DuckDB's own scan completes without a read error, and the
/// post-check's own finding is what turns the stream's terminal into the typed refusal
/// (`typed_terminal_codes.rs`'s own precedent) — "clean" in the sense that nothing about the read
/// itself failed.
///
/// RECORDED MUTATION: same as E1.
#[test]
fn a_post_check_end_on_a_clean_terminal_emits_once() {
    let path = fixture("e2");
    let (tx, rx) = session_end_channel();
    let host = SkpHost::new(Arc::new(Catalog::new()), StreamRegistry::new(), watch_support::no_watch_arm(), tx);
    let open = host.open_dataset(open_req(&path, "e2")).expect("open");
    let ticket = host.viewport_query(viewport_req(open.dataset)).expect("mint");

    let factory = EngineSourceFactory::ticket_only(host.catalog(), host.tickets(), host.generations());
    let (mut source, _cancel) = factory
        .create(&OpenRequest { operation: OPERATION.to_string(), params: ticket.stream.as_str().as_bytes().to_vec() })
        .expect("redeem");

    touch_modification_time(&path);

    let mut buf = Vec::new();
    let mut terminal = None;
    while let Some(item) = source.next_into(&mut buf) {
        if let Err(detail) = item {
            terminal = Some(detail);
            break;
        }
        buf.clear();
    }
    let detail = terminal.expect("the changed source ends this stream with a typed refusal");
    assert!(detail.starts_with("engine.source_changed: "), "{detail}");

    let event = rx.recv_timeout(Duration::from_secs(5)).expect("one event");
    assert_eq!(event.reason, EndReason::ObservedChange);
    assert!(rx.recv_timeout(Duration::from_millis(200)).is_err(), "exactly one event");
}

// -------------------------------------------------------------------------------------------
// E3 — a post-check end on an error terminal emits once
// -------------------------------------------------------------------------------------------

/// The stream's own terminal is a **cancellation** — a distinct error from `SourceChanged` — while
/// the post-check's finding still rides along (kernel/src/lib.rs's own comment: "including a
/// cancelled one, which keeps its own `cancelled` terminal while the change still ends the
/// session").
///
/// RECORDED MUTATION: same as E1.
#[test]
fn a_post_check_end_on_an_error_terminal_emits_once() {
    let path = fixture("e3");
    let (tx, rx) = session_end_channel();
    let host = SkpHost::new(Arc::new(Catalog::new()), StreamRegistry::new(), watch_support::no_watch_arm(), tx);
    let open = host.open_dataset(open_req(&path, "e3")).expect("open");
    let ticket = host.viewport_query(viewport_req(open.dataset)).expect("mint");

    let factory = EngineSourceFactory::ticket_only(host.catalog(), host.tickets(), host.generations());
    let (mut source, cancel) = factory
        .create(&OpenRequest { operation: OPERATION.to_string(), params: ticket.stream.as_str().as_bytes().to_vec() })
        .expect("redeem");

    touch_modification_time(&path);
    cancel.cancel();

    let mut buf = Vec::new();
    let mut terminal = None;
    while let Some(item) = source.next_into(&mut buf) {
        if let Err(detail) = item {
            terminal = Some(detail);
            break;
        }
        buf.clear();
    }
    let detail = terminal.expect("a cancelled stream still ends with a terminal");
    assert!(!detail.starts_with("engine.source_changed"), "cancellation keeps its own terminal: {detail}");

    let event = rx.recv_timeout(Duration::from_secs(5)).expect("one event");
    assert_eq!(event.reason, EndReason::ObservedChange);
    assert!(rx.recv_timeout(Duration::from_millis(200)).is_err(), "exactly one event");
}

// -------------------------------------------------------------------------------------------
// E4 — an end on the drop path emits once
// -------------------------------------------------------------------------------------------

/// **Best-effort, by the product's own declared limitation** (`kernel/src/lib.rs`'s own doc on
/// `end_session_if_source_changed`: "`Drop` is a best-effort attempt and not a guarantee ... A
/// consumer that walks away without draining can therefore reach this line before the producer has
/// finished its post-check, in which case the flag is still empty and nothing is ended here"). This
/// test never calls `next_into` — the consumer walks away without pulling a single batch, and only
/// `Drop` can end the session — but `end_session_if_source_changed` is a **one-shot check made
/// exactly once, at the moment `Drop::drop` runs**, not a retry loop: if this test called `drop`
/// immediately after `create`, it would race the producer thread's own spawn-and-run and, per the
/// doc above, reliably lose (confirmed empirically: `create` returns before the producer thread has
/// even been scheduled, so an immediate `drop` finds nothing, every time, on this hardware). So this
/// test gives the producer — a 300-feature fixture, one batch, no consumer backpressure since
/// `MAX_QUEUED_BATCHES` (2) is never approached — a bounded, generous head start to run to its own
/// completion (post-check included) *before* `drop` is ever called; still zero calls to `next_into`.
/// The wait is not a timing claim (ADR-018): it names only that the producer is given room to finish
/// on its own clock, not how long that takes.
///
/// RECORDED MUTATION: same as E1.
#[test]
fn an_end_on_the_drop_path_emits_once() {
    let path = fixture("e4");
    let (tx, rx) = session_end_channel();
    let host = SkpHost::new(Arc::new(Catalog::new()), StreamRegistry::new(), watch_support::no_watch_arm(), tx);
    let open = host.open_dataset(open_req(&path, "e4")).expect("open");
    let ticket = host.viewport_query(viewport_req(open.dataset)).expect("mint");

    let factory = EngineSourceFactory::ticket_only(host.catalog(), host.tickets(), host.generations());
    let (source, _cancel) = factory
        .create(&OpenRequest { operation: OPERATION.to_string(), params: ticket.stream.as_str().as_bytes().to_vec() })
        .expect("redeem");

    touch_modification_time(&path);
    // Give the producer room to run to its own completion — post-check included — with zero calls
    // to `next_into` on this side. See the test's own doc above for why an immediate `drop` here
    // would race the producer's spawn and reliably lose, which is not what E4 is testing.
    std::thread::sleep(Duration::from_millis(500));
    // Walk away without ever draining: only `Drop for EngineSource` can end this session now.
    drop(source);

    let event = rx.recv_timeout(Duration::from_secs(10)).expect("one event, via the drop path");
    assert_eq!(event.reason, EndReason::ObservedChange);
    assert!(rx.recv_timeout(Duration::from_millis(200)).is_err(), "exactly one event");
}

// -------------------------------------------------------------------------------------------
// E6 — a watcher signal after admission emits once
// -------------------------------------------------------------------------------------------

/// RECORDED MUTATION: in `SkpHost::open_dataset`'s sink closure, replace the `Admitted` arm's
/// `invalidator.end_generation(..)` call with `self.generations.invalidate(&dataset_name,
/// reason_of_signal(&signal));` directly (the sink calls `invalidate` itself, bypassing
/// `SessionInvalidator`'s enqueue). Expected failure: this test's event wait times out — nothing
/// is ever sent on the channel.
#[test]
fn a_watcher_signal_after_admission_emits_once() {
    let arm = injected_watch::InjectedArm::new();
    let path = fixture("e6");
    let (tx, rx) = session_end_channel();
    let host = SkpHost::new(Arc::new(Catalog::new()), StreamRegistry::new(), arm.clone(), tx);
    let open = host.open_dataset(open_req(&path, "e6")).expect("open");

    arm.signal(&path, WatchSignal::Change { action: "modified" });

    let event = rx.recv_timeout(Duration::from_secs(5)).expect("one event");
    assert_eq!(event.session, open.session);
    assert_eq!(event.reason, EndReason::ObservedChange);
    assert!(rx.recv_timeout(Duration::from_millis(200)).is_err(), "exactly one event");
}

// -------------------------------------------------------------------------------------------
// E9 — a repeat, a nested, and a post-close end emit nothing
// -------------------------------------------------------------------------------------------

/// RECORDED MUTATION: in `GenerationRegistry::invalidate`, key the emission on whether `ended`
/// (the collected ticket list) is non-empty rather than on `st.live.remove` actually finding a
/// live entry — i.e. `Self::prune_locked`'s own idempotency guard is bypassed and every repeated
/// call re-enqueues. Expected failure: this test's "exactly one event total" assertion fails.
#[test]
fn a_repeat_a_nested_and_a_post_close_end_emit_nothing() {
    let arm = injected_watch::InjectedArm::new();
    let path = fixture("e9");
    let (tx, rx) = session_end_channel();
    let host = SkpHost::new(Arc::new(Catalog::new()), StreamRegistry::new(), arm.clone(), tx);
    let open = host.open_dataset(open_req(&path, "e9")).expect("open");

    // The one real end.
    arm.signal(&path, WatchSignal::Change { action: "modified" });
    let event = rx.recv_timeout(Duration::from_secs(5)).expect("the one real event");
    assert_eq!(event.session, open.session);

    // A repeat: idempotent, per the same watch's own `fired` flag AND the registry's own guard.
    // (The real adapter could never re-signal; this exercises the registry's own idempotency.)
    arm.signal(&path, WatchSignal::Change { action: "modified" });

    // A nested end: the pre-check-style call, on the same already-ended dataset.
    host.end_generation(open.dataset.as_str());

    // A post-close end: close, then try to end the same (now-forgotten) name again.
    host.close_dataset(spatial_skp::v0::CloseDatasetRequest { skp: SKP_VERSION.to_string(), dataset: open.dataset })
        .expect("close");
    host.end_generation("a-name-nothing-still-knows");

    assert!(rx.recv_timeout(Duration::from_millis(300)).is_err(), "exactly one event, ever");
}

// -------------------------------------------------------------------------------------------
// E10 — a full queue loses the event, never blocks the end, and the next call still refuses
// -------------------------------------------------------------------------------------------

/// RECORDED MUTATION: in `SessionInvalidator::end_generation`, replace `try_send` with a blocking
/// `send` (via an unbounded or manually-drained channel semantics). Expected failure: this test
/// either hangs (a `send` on a full bounded `sync_channel` blocks) or the "returns quickly"
/// assertion fails, depending on the channel's exact capacity semantics under the change.
#[test]
fn a_full_queue_loses_the_event_never_blocks_the_end_and_the_next_call_still_refuses() {
    let generations = GenerationRegistry::new();
    let tickets = StreamRegistry::new();
    let (tx, rx) = session_end_channel();
    let invalidator = SessionInvalidator::new(generations.clone(), tickets, tx);

    // Fill the bounded queue completely — one ended generation per slot, never drained.
    for i in 0..SESSION_END_EVENT_QUEUE_BOUND {
        let name = format!("ds_{i}");
        generations.mint_for_open(&name, SessionRef::mint());
        invalidator.end_generation(&name, SessionEndReason::ObservedChange);
    }

    // One more: the queue is now full. This must return promptly (never block) even though its
    // own event is lost.
    let overflow_name = "ds_overflow";
    generations.mint_for_open(overflow_name, SessionRef::mint());
    let started = std::time::Instant::now();
    invalidator.end_generation(overflow_name, SessionEndReason::ObservedChange);
    assert!(started.elapsed() < Duration::from_secs(2), "the end must never block on a full queue");

    // The end itself still took effect, event or no event: the next call refuses by name.
    assert!(
        generations.live_or_mint(overflow_name).is_err(),
        "the generation still ended even though its event was dropped"
    );

    // Drain what DID arrive — bounded by the declared capacity, never more.
    let mut received = 0usize;
    while rx.recv_timeout(Duration::from_millis(50)).is_ok() {
        received += 1;
    }
    assert!(received <= SESSION_END_EVENT_QUEUE_BOUND, "never more than the declared bound");
}
