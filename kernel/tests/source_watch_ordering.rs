// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **Tier 1 — injected-signal ordering and emission**, `engine/SOURCE-WATCHER-PREREGISTRATION.md`
//! §4: deterministic, through a test-implemented `SourceWatchArm`/`ArmedWatch`
//! (`injected_watch::InjectedArm`) rather than the real Windows adapter — proves the kernel's own
//! ordering rules (K1–K14) and Amendment 1's invariant, never OS timing.

mod injected_watch;
mod watch_support;

use std::path::PathBuf;
use std::sync::Arc;

use spatial_data_plane::transport::SourceFactory;
use spatial_engine::fixture::{write_geoparquet, FixtureSpec};
use spatial_engine::WatchSignal;
use spatial_kernel::skp::{
    error_of, session_end_channel, SessionEndReason, SkpHost, StreamRegistry,
};
use spatial_kernel::Catalog;
use spatial_skp::v0::{
    ChecksState, CoverageState, DescribeRequest, EndReason, OpenDatasetRequest,
    ViewportQueryRequest, SKP_VERSION,
};

fn dir() -> PathBuf {
    let d = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../target/fixtures/source-watch-ordering");
    std::fs::create_dir_all(&d).expect("fixture dir");
    d
}

fn fixture(name: &str) -> PathBuf {
    let path = dir().join(format!("{name}.parquet"));
    write_geoparquet(&path, &FixtureSpec { features: 40, avg_vertices: 6, hole_every: 0, ..Default::default() })
        .expect("write fixture");
    path
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

fn describe_req(dataset: spatial_skp::v0::DatasetHandle) -> DescribeRequest {
    DescribeRequest { skp: SKP_VERSION.to_string(), dataset }
}

fn viewport_req(dataset: spatial_skp::v0::DatasetHandle) -> ViewportQueryRequest {
    ViewportQueryRequest {
        skp: SKP_VERSION.to_string(),
        dataset,
        bbox: None,
        bbox_crs: None,
        limit: None,
        filter: None,
    }
}

fn host_with(arm: Arc<injected_watch::InjectedArm>) -> SkpHost {
    SkpHost::new(Arc::new(Catalog::new()), StreamRegistry::new(), arm, session_end_channel().0)
}

// -------------------------------------------------------------------------------------------
// K1 — a signal before a query ends the generation before its ticket is minted
// -------------------------------------------------------------------------------------------

/// RECORDED MUTATION: in `SkpHost::open_dataset`'s sink closure, replace the `Admitted` arm's
/// `invalidator.end_generation(..)` call with a bare log line (record but do not end). Expected
/// failure: `viewport_query` below no longer refuses — it mints a ticket over a source this test
/// already told the kernel had changed.
#[test]
fn a_signal_before_a_query_ends_the_generation_before_its_ticket_is_minted() {
    let arm = injected_watch::InjectedArm::new();
    let host = host_with(arm.clone());
    let path = fixture("k1");
    let open = host.open_dataset(open_req(&path, "k1")).expect("open");

    arm.signal(&path, WatchSignal::Change { action: "modified" });

    let refused = host.viewport_query(viewport_req(open.dataset)).expect_err("refused");
    assert_eq!(refused.code, "engine.source_changed", "{}", refused.message);
}

// -------------------------------------------------------------------------------------------
// K2 — a signal during a stream ends the generation before its terminal
// -------------------------------------------------------------------------------------------

/// RECORDED MUTATION: in the same sink closure, replace `invalidator.end_generation(..)` with
/// `self.tickets.cancel_all_for_dataset(&dataset_name)` alone (cancel without invalidating).
/// Expected failure: `ticket_liveness` below still reports `Live` — the ticket was cancelled but
/// its generation never ended, so a redemption arriving after this point would answer
/// `Unknown`/expired rather than the typed `EndedBySourceChange`.
#[test]
fn a_signal_during_a_stream_ends_the_generation_before_its_terminal() {
    let arm = injected_watch::InjectedArm::new();
    let host = host_with(arm.clone());
    let path = fixture("k2");
    let open = host.open_dataset(open_req(&path, "k2")).expect("open");
    let ticket = host.viewport_query(viewport_req(open.dataset.clone())).expect("mints a ticket");

    arm.signal(&path, WatchSignal::Change { action: "modified" });

    // Before this stream ever reaches a terminal frame: the generation registry already answers.
    assert_eq!(
        host.generations().ticket_liveness(ticket.stream.as_str()),
        spatial_kernel::skp::TicketLiveness::EndedBySourceChange
    );
}

// -------------------------------------------------------------------------------------------
// K3 — a signal while idle ends the generation and emits once
// -------------------------------------------------------------------------------------------

/// RECORDED MUTATION: in `SessionInvalidator::end_generation`, move the `try_send` inside
/// `if !report.tickets.is_empty() { .. }` (enqueue only when tickets were cancelled). Expected
/// failure: this test's event-count assertion fails — an idle dataset has no tickets to cancel, so
/// the event this test waits for is never sent.
#[test]
fn a_signal_while_idle_ends_the_generation_and_emits_once() {
    let arm = injected_watch::InjectedArm::new();
    let (tx, rx) = session_end_channel();
    let host = SkpHost::new(Arc::new(Catalog::new()), StreamRegistry::new(), arm.clone(), tx);
    let path = fixture("k3");
    let open = host.open_dataset(open_req(&path, "k3")).expect("open");

    arm.signal(&path, WatchSignal::Change { action: "modified" });

    let event = rx.recv_timeout(std::time::Duration::from_secs(5)).expect("exactly one event");
    assert_eq!(event.session, open.session);
    assert_eq!(event.reason, EndReason::ObservedChange);
    assert!(
        rx.recv_timeout(std::time::Duration::from_millis(100)).is_err(),
        "exactly one event, never a second"
    );

    let d = host.describe(describe_req(open.dataset.clone())).expect("describe still answers");
    assert_eq!(d.session_end, Some(EndReason::ObservedChange));

    let refused = host.viewport_query(viewport_req(open.dataset)).expect_err("refused");
    assert_eq!(refused.code, "engine.source_changed");
}

// -------------------------------------------------------------------------------------------
// K4 — coverage loss refuses with its own code, never source_changed
// -------------------------------------------------------------------------------------------

/// RECORDED MUTATION: in `SkpHost::open_dataset`'s sink closure, map every `WatchSignal` to
/// `SessionEndReason::ObservedChange` regardless of kind (never call `reason_of_signal`). Expected
/// failure: both assertions below fail — `engine.source_changed` where `engine.source_coverage_lost`
/// is expected.
#[test]
fn coverage_loss_refuses_with_its_own_code_never_source_changed() {
    let arm = injected_watch::InjectedArm::new();
    let host = host_with(arm.clone());
    let path = fixture("k4");
    let open = host.open_dataset(open_req(&path, "k4")).expect("open");
    let ticket = host.viewport_query(viewport_req(open.dataset.clone())).expect("mints a ticket");

    arm.signal(&path, WatchSignal::CoverageLost { cause: "overflow".to_string() });

    // The pre-check refusal.
    let refused = host.viewport_query(viewport_req(open.dataset)).expect_err("refused");
    assert_eq!(refused.code, "engine.source_coverage_lost", "{}", refused.message);

    // The dead-ticket terminal, through the real `create_from_ticket` seam.
    let generations = host.generations();
    let factory =
        spatial_kernel::EngineSourceFactory::ticket_only(host.catalog(), host.tickets(), generations);
    let detail = factory
        .create(&spatial_data_plane::transport::OpenRequest {
            operation: spatial_kernel::OPERATION.to_string(),
            params: ticket.stream.as_str().as_bytes().to_vec(),
        })
        .err()
        .expect("a ticket whose generation ended does not redeem");
    assert!(
        detail.starts_with("engine.source_coverage_lost: "),
        "the dead-ticket terminal must carry the coverage-lost code, not source_changed: {detail}"
    );
}

// -------------------------------------------------------------------------------------------
// K5 — a signal-free rearm does not restore an ended generation
// -------------------------------------------------------------------------------------------

/// **Empirical correction, recorded rather than silent.** `SkpHost::open_dataset` mints a fresh,
/// OS-CSPRNG `DatasetHandle` on every call, and that handle is the `GenerationRegistry` key — so a
/// close-then-reopen sequence at this (`SkpHost`) level can *never* share a registry key with the
/// open it replaced, regardless of any mutation to `mint_for_open`'s own `st.invalidated.remove`
/// line: a fresh key was never in `invalidated` to begin with. That line's own discriminating proof
/// is `session_generation.rs`'s pre-existing
/// `a_fresh_open_clears_an_earlier_invalidation_because_that_is_what_reopening_is`, which calls
/// `mint_for_open` with the **same** literal string key twice (the only way to reach that branch at
/// all) and is not this piece's to re-verify (it predates this piece and is unmodified).
///
/// What THIS test adds, novel at the `SkpHost` level: "a reopen watches again" — a real `OpenRecord`
/// is inserted on a *second* `open_dataset` for the same file, not just the first.
///
/// RECORDED MUTATION: in `SkpHost::open_dataset`'s `Watching` success arm, delete the
/// `self.watches.lock()...insert(..)` call. Expected failure: this test's final `describe`
/// assertion fails — `coverage.state` reports `checks-only` (`describe`'s own `None` arm, "no watch
/// was armed") for a dataset that really is being watched.
///
/// **Phase-2 delta 11 (optional, taken):** injects `CoverageLost` rather than `Change`, matching
/// case (c)'s own trigger (`Cases → tests`: "(c) A6, K4, K5") — a small change, since nothing below
/// reads the refusal's specific code.
// Mutation: see the RECORDED MUTATION above (delete the `Watching`-arm `self.watches` insert).
#[test]
fn a_signal_free_rearm_does_not_restore_an_ended_generation() {
    let arm = injected_watch::InjectedArm::new();
    let host = host_with(arm.clone());
    let path = fixture("k5");
    let open = host.open_dataset(open_req(&path, "k5-first")).expect("open");
    arm.signal(&path, WatchSignal::CoverageLost { cause: "overflow".to_string() });
    assert!(host.viewport_query(viewport_req(open.dataset.clone())).is_err(), "ended, refuses");

    host.close_dataset(spatial_skp::v0::CloseDatasetRequest {
        skp: SKP_VERSION.to_string(),
        dataset: open.dataset,
    })
    .expect("close");

    // A fresh open of the SAME file, no signal injected this time — "signal-free".
    let reopened = host.open_dataset(open_req(&path, "k5-second")).expect("reopen");
    let vq = host.viewport_query(viewport_req(reopened.dataset.clone()));
    assert!(vq.is_ok(), "a reopen with no new signal must not stay refused");

    // "and a reopen watches again": the new open's coverage is a real watch, not checks-only.
    let d = host.describe(describe_req(reopened.dataset)).expect("describe");
    assert_eq!(d.coverage.state, CoverageState::Watching);
}

// -------------------------------------------------------------------------------------------
// K6 — a signal between arming and admission refuses the open
// -------------------------------------------------------------------------------------------

/// **Corrected scope, discovered while writing this test.** Reordering step 3 ahead of *only*
/// step 1 (the latch's recorded-signal check) does not break this test: step 2
/// (`watch.resolves_unchanged()`) is deliberate "belt-and-suspenders on the sink's asynchronous
/// callback" (§2b's own words) and independently catches the same injected signal, because a real
/// event flips both the latch and the watch's own `fired` flag together — this test's
/// `InjectedArm::fire_on_next_arm` reproduces that coupling faithfully rather than decoupling it
/// for convenience. The discriminating mutation skips both checks.
///
/// RECORDED MUTATION: in `SkpHost::open_dataset`, mint the `SessionRef` and call
/// `generations.mint_for_open` before checking the latch's recorded signal, skipping both step 1
/// (the recorded signal) and step 2 (`resolves_unchanged()`) as no-ops. Expected/observed failure:
/// `open_dataset` below no longer refuses — it admits a source this test already told the kernel
/// had changed before admission ever ran.
///
/// **Corrected comment (phase 2 delta 7).** The earlier revision of this comment claimed a
/// signal-free retry "would not be true if the first attempt had left anything behind" — false: a
/// refused open returns no handle, and the retry runs under a fresh, OS-CSPRNG `DatasetHandle` key
/// (`k6-clean`'s own mint), so the retry succeeding proves nothing about what the first attempt did
/// or did not leave in the catalog or the generation registry (`state/consults/2026-09-25-source-
/// watcher-between-phases.md`, Amendment 3 item 4). "No catalog entry" is now asserted directly,
/// against the same handle the refused call minted internally but never returned —
/// `Catalog::names()` (already `pub`, an existing accessor with its own product callers) is read
/// before the retry runs at all. "No generation" stays unproven here: an accessor for it would be
/// the test-only `pub` item §5 forbids, so that clause is not asserted (Amendment 3 item 4's own
/// reduction).
// Mutation: see the RECORDED MUTATION above (mint before the latch check, skipping steps 1-2).
#[test]
fn a_signal_between_arming_and_admission_refuses_the_open() {
    let arm = injected_watch::InjectedArm::new();
    let (tx, rx) = session_end_channel();
    let host = SkpHost::new(Arc::new(Catalog::new()), StreamRegistry::new(), arm.clone(), tx);
    let path = fixture("k6");

    arm.fire_on_next_arm(&path, WatchSignal::Change { action: "modified" });
    let refused = host.open_dataset(open_req(&path, "k6")).expect_err("refused before admission");
    assert_eq!(refused.code, "engine.source_changed", "{}", refused.message);

    // No event for an open that never admitted (case (e)): no generation ever existed to end.
    assert!(
        rx.recv_timeout(std::time::Duration::from_millis(100)).is_err(),
        "an open refused before admission must never emit"
    );

    // No catalog entry: asserted directly, before the retry runs (phase 2 delta 7).
    assert!(
        host.catalog().names().is_empty(),
        "a refused-before-admission open must leave no catalog entry behind"
    );

    // A second, signal-free open of the SAME path succeeds cleanly under its own fresh handle.
    let open = host.open_dataset(open_req(&path, "k6-clean")).expect("a clean retry succeeds");
    assert!(host.viewport_query(viewport_req(open.dataset)).is_ok());
}

// -------------------------------------------------------------------------------------------
// K7 — the first reason wins and is the emitted reason
// -------------------------------------------------------------------------------------------

/// RECORDED MUTATION: in `GenerationRegistry::invalidate`, replace
/// `st.invalidated.entry(dataset.to_string()).or_insert(reason)` with an unconditional
/// `st.invalidated.insert(dataset.to_string(), reason)` (overwrite every time). Expected failure:
/// `describe.session_end` below reports `CoverageLost` (the second signal), not the first
/// `ObservedChange`.
#[test]
fn the_first_reason_wins_and_is_the_emitted_reason() {
    let arm = injected_watch::InjectedArm::new();
    let host = host_with(arm.clone());
    let path = fixture("k7");
    let open = host.open_dataset(open_req(&path, "k7")).expect("open");

    arm.signal(&path, WatchSignal::Change { action: "modified" });
    // A second signal on the same (already-ended) generation. The real adapter could never
    // deliver this (one signal per handle), but the kernel's own bookkeeping must be idempotent
    // and defensive regardless of what a future caller does.
    arm.signal(&path, WatchSignal::CoverageLost { cause: "overflow".to_string() });

    let d = host.describe(describe_req(open.dataset)).expect("describe");
    assert_eq!(d.session_end, Some(EndReason::ObservedChange), "the first mark stands");
}

// -------------------------------------------------------------------------------------------
// K8 — an unwatchable source opens checks-only and describe says so
// -------------------------------------------------------------------------------------------

/// RECORDED MUTATION: in `SkpHost::describe`, hardcode `CoverageState::Watching` instead of
/// reading `self.watches`. Expected failure: this test's `assert_eq!` on `coverage.state` fails.
#[test]
fn an_unwatchable_source_opens_checks_only_and_describe_says_so() {
    let arm = injected_watch::InjectedArm::new();
    let host = host_with(arm.clone());
    let path = fixture("k8");
    arm.mark_checks_only(&path, "test: the parent directory could not be opened");

    let open = host.open_dataset(open_req(&path, "k8")).expect("open still succeeds, checks-only");
    let d = host.describe(describe_req(open.dataset.clone())).expect("describe");
    assert_eq!(d.coverage.state, CoverageState::ChecksOnly);
    assert_eq!(
        d.coverage.reason.as_deref(),
        Some("test: the parent directory could not be opened")
    );

    // Case (d): checks-only still admits queries — there is no watch to have detected anything.
    assert!(host.viewport_query(viewport_req(open.dataset)).is_ok());
}

// -------------------------------------------------------------------------------------------
// K9 — a loss after admission ends the generation and describe still says watching
// -------------------------------------------------------------------------------------------

/// RECORDED MUTATION: in `SkpHost::describe`, rewrite `coverage` to `ChecksOnly` whenever
/// `session_end.is_some()`. Expected failure: this test's post-signal `coverage.state` assertion
/// fails — rule 3 says coverage is fixed at admission and never downgraded by a later loss.
#[test]
fn a_loss_after_admission_ends_the_generation_and_describe_still_says_watching() {
    let arm = injected_watch::InjectedArm::new();
    let host = host_with(arm.clone());
    let path = fixture("k9");
    let open = host.open_dataset(open_req(&path, "k9")).expect("open");

    let before = host.describe(describe_req(open.dataset.clone())).expect("describe before");
    assert_eq!(before.coverage.state, CoverageState::Watching);

    arm.signal(&path, WatchSignal::CoverageLost { cause: "overflow".to_string() });

    let after = host.describe(describe_req(open.dataset)).expect("describe after");
    assert_eq!(after.coverage.state, CoverageState::Watching, "rule 3: never downgraded");
    assert_eq!(after.session_end, Some(EndReason::CoverageLost));
}

// -------------------------------------------------------------------------------------------
// K10 — no batch from an ended generation is admitted and nothing reloads
// -------------------------------------------------------------------------------------------

/// RECORDED MUTATION: in `GenerationRegistry::live_or_mint`, mint a fresh generation over an
/// invalidated one instead of returning `Err(reason)` (drop the `invalidated` check). Expected
/// failure: the retry `viewport_query` below succeeds — a "reload" that must never happen.
#[test]
fn no_batch_from_an_ended_generation_is_admitted_and_nothing_reloads() {
    let arm = injected_watch::InjectedArm::new();
    let host = host_with(arm.clone());
    let path = fixture("k10");
    let open = host.open_dataset(open_req(&path, "k10")).expect("open");
    let ticket = host.viewport_query(viewport_req(open.dataset.clone())).expect("mints a ticket");

    arm.signal(&path, WatchSignal::Change { action: "modified" });

    assert_eq!(
        host.generations().ticket_liveness(ticket.stream.as_str()),
        spatial_kernel::skp::TicketLiveness::EndedBySourceChange
    );
    // Retrying does not "reload" a fresh batch from the ended generation.
    let retried = host.viewport_query(viewport_req(open.dataset));
    assert!(retried.is_err(), "no new ticket is ever minted against an ended generation");
}

// -------------------------------------------------------------------------------------------
// K11 — describe reports checks full for an undegraded fixture
// -------------------------------------------------------------------------------------------

/// RECORDED MUTATION: in `SkpHost::describe`, report `ChecksState::Degraded` with an empty
/// `components` list unconditionally. Expected failure: this test's `assert_eq!` fails.
#[test]
fn describe_reports_checks_full_for_an_undegraded_fixture() {
    let arm = injected_watch::InjectedArm::new();
    let host = host_with(arm);
    let path = fixture("k11");
    let open = host.open_dataset(open_req(&path, "k11")).expect("open");
    let d = host.describe(describe_req(open.dataset)).expect("describe");
    assert_eq!(d.checks.state, ChecksState::Full);
    assert!(d.checks.components.is_empty());
}

// -------------------------------------------------------------------------------------------
// K12 — source_coverage_lost maps to its own code and detail
// -------------------------------------------------------------------------------------------

/// RECORDED MUTATION: in `error_of`, route `EngineError::SourceCoverageLost` through the
/// `SourceChanged` arm's code (`"source_changed"`) instead of its own. Expected failure: this
/// test's `assert_eq!` on `code` fails.
#[test]
fn source_coverage_lost_maps_to_its_own_code_and_detail() {
    let e = spatial_engine::EngineError::SourceCoverageLost { detail: "overflow".to_string() };
    let mapped = error_of(&e);
    assert_eq!(mapped.code, "engine.source_coverage_lost");
    assert_eq!(mapped.fields.get("detail").map(String::as_str), Some("overflow"));
}

// -------------------------------------------------------------------------------------------
// K13 — describe after an end carries session_end, and describe/cancel/close still answer
// -------------------------------------------------------------------------------------------

/// RECORDED MUTATION: in `SkpHost::describe`, refuse (return `Err`) when
/// `generations.ended_reason(..)` is `Some`. Expected failure: this test's `describe` call panics
/// on `.expect(..)`.
#[test]
fn describe_after_an_end_carries_session_end_and_describe_cancel_close_still_answer() {
    let arm = injected_watch::InjectedArm::new();
    let host = host_with(arm.clone());
    let path = fixture("k13");
    let open = host.open_dataset(open_req(&path, "k13")).expect("open");

    arm.signal(&path, WatchSignal::Change { action: "modified" });

    let d = host.describe(describe_req(open.dataset.clone())).expect("describe still answers");
    assert_eq!(d.session_end, Some(EndReason::ObservedChange));

    let cancelled = host
        .cancel(spatial_skp::v0::CancelRequest { skp: SKP_VERSION.to_string(), handle: "sh_00000000000000000000000000000000".to_string() })
        .expect("cancel still answers");
    assert_eq!(cancelled.state, "unknown");

    let closed = host
        .close_dataset(spatial_skp::v0::CloseDatasetRequest { skp: SKP_VERSION.to_string(), dataset: open.dataset })
        .expect("close still answers");
    assert_eq!(closed.cancelled_streams, 0);
}

// -------------------------------------------------------------------------------------------
// K14 — two opens of one file return distinct session references
// -------------------------------------------------------------------------------------------

/// RECORDED MUTATION: in `SkpHost::open_dataset`, mint one `SessionRef` at host construction and
/// reuse it for every open instead of calling `SessionRef::mint()` per open. Expected failure:
/// this test's `assert_ne!` fails.
#[test]
fn two_opens_of_one_file_return_distinct_session_references() {
    let arm = injected_watch::InjectedArm::new();
    let host = host_with(arm);
    let path = fixture("k14");
    let open1 = host.open_dataset(open_req(&path, "k14-a")).expect("open 1");
    let open2 = host.open_dataset(open_req(&path, "k14-b")).expect("open 2");
    assert_ne!(open1.session, open2.session);
}

// -------------------------------------------------------------------------------------------
// Amendment 1 — a generation minted by live_or_mint carries an unheld reference and its end emits
// -------------------------------------------------------------------------------------------

/// RECORDED MUTATION: in `GenerationRegistry::live_or_mint`'s minting branch, reuse one shared,
/// process-wide `SessionRef` for every call instead of `SessionRef::mint()` fresh each time.
/// Expected failure: this test's distinctness assertion fails.
#[test]
fn a_generation_minted_by_live_or_mint_carries_an_unheld_reference_and_its_end_emits() {
    let generations = spatial_kernel::skp::GenerationRegistry::new();
    let tickets = StreamRegistry::new();
    let (tx, rx) = session_end_channel();
    let invalidator = spatial_kernel::skp::SessionInvalidator::new(generations.clone(), tickets, tx);

    // Two datasets neither `open_dataset` ever minted for: `live_or_mint` gives each its own
    // generation, carrying a `SessionRef` no client ever held.
    let g1 = generations.live_or_mint("ds_never_opened_1").expect("a session for a stranger dataset");
    let g2 = generations.live_or_mint("ds_never_opened_2").expect("a session for another stranger");
    assert_ne!(g1, g2, "distinct generations, at least");

    let report1 = generations
        .invalidate("ds_never_opened_1", SessionEndReason::ObservedChange)
        .expect("a live generation to end");
    assert!(report1.session.as_str().starts_with("sr_"), "an unheld reference is still a real one");

    // The end still emits — the reference being unheld does not make the enqueue skip.
    invalidator.end_generation("ds_never_opened_2", SessionEndReason::ObservedChange);
    let event = rx.recv_timeout(std::time::Duration::from_secs(5)).expect("the end emits");
    assert!(event.session.as_str().starts_with("sr_"));
    assert_ne!(report1.session, event.session, "distinct unheld references, not one shared value");
}
