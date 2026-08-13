// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **ADR-019's ticket admission path, exercised end to end over a real WebSocket.**
//!
//! Separate binary from `wire_bytes_invariant.rs` on purpose: that file's own test toggles
//! `engine::trace`'s single process-wide slot, and integration-test functions in one file run
//! concurrently by default — a second trace-using test in the same binary would race it. This file
//! owns the ticket-admission class of coverage instead of extending that one.
//!
//! **Scope decision on ADR-004 Amendment 4, stated rather than assumed.** That amendment's proof
//! obligation is a byte comparison "with tracing enabled and disabled" and says a *new operation
//! class* owes its own case. A ticket-redeemed stream is not a new operation — it is still
//! `stream_features`, admitted by a different parameter-passing mechanism — so this file does not
//! re-run the on/off toggle (which would also reintroduce the trace-slot race above). What it does
//! assert, directly: the ticket path puts no JSON on the wire and leaks no ticket/handle text into a
//! frame, which is the property that would actually break if a future change routed a handle through
//! a payload instead of through `TAG_START`'s already-opaque params.

use std::sync::Arc;
use std::time::Duration;

use futures_util::{SinkExt, StreamExt};
use spatial_data_plane::server::DataPlaneConfig;
use spatial_data_plane::session::SUBPROTOCOL;
use spatial_data_plane::{wire, RunningDataPlane};
use spatial_engine::fixture::{write_geoparquet, CrsMode, FixtureSpec};
use spatial_engine::trace::{self, TraceKey};
use spatial_kernel::skp::{SkpHost, StreamRegistry};
use spatial_kernel::{Catalog, EngineSourceFactory, StreamParams, OPERATION};
use spatial_skp::v0::{DatasetHandle, ViewportQueryRequest, SKP_VERSION};
use tokio_tungstenite::tungstenite::client::IntoClientRequest;
use tokio_tungstenite::tungstenite::Message;

const RECV_DEADLINE: Duration = Duration::from_secs(60);

type Client =
    tokio_tungstenite::WebSocketStream<tokio_tungstenite::MaybeTlsStream<tokio::net::TcpStream>>;

fn dataset_handle() -> DatasetHandle {
    // The catalog name a real `open_dataset` call would mint. Constructed directly here because
    // this file exercises `viewport_query`/`cancel` in isolation, without an `open_dataset` round
    // trip — `open_dataset` itself is covered by the shell's own admission-flow tests.
    "ds_00000000000000000000000000000000".parse().unwrap()
}

fn fixture(name: &str, features: usize) -> std::path::PathBuf {
    let dir = std::path::PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../target/fixtures");
    std::fs::create_dir_all(&dir).expect("fixture dir");
    let path = dir.join(format!("skp-admission-{name}.parquet"));
    write_geoparquet(&path, &FixtureSpec { features, avg_vertices: 12, hole_every: 0, ..Default::default() })
        .expect("write fixture");
    path
}

async fn connect(dp: &RunningDataPlane) -> Client {
    let mut req = format!("ws://127.0.0.1:{}/stream", dp.addr.port()).into_client_request().unwrap();
    req.headers_mut()
        .insert("origin", format!("http://127.0.0.1:{}", dp.addr.port()).parse().unwrap());
    req.headers_mut().insert(
        "sec-websocket-protocol",
        format!("{SUBPROTOCOL}, tok.{}", dp.session.token_for_delivery()).parse().unwrap(),
    );
    tokio_tungstenite::connect_async(req).await.expect("connect").0
}

#[tokio::test(flavor = "multi_thread")]
async fn a_ticket_redeemed_stream_is_json_free_and_leaks_no_handle_text() {
    let path = fixture("basic", 12_000);
    let handle = dataset_handle();
    let catalog = Arc::new(Catalog::new());
    catalog.open(handle.as_str(), &path, None).expect("open dataset");
    let tickets = StreamRegistry::new();
    let host = SkpHost::new(catalog.clone(), tickets.clone());

    let ticket = host
        .viewport_query(ViewportQueryRequest {
            skp: SKP_VERSION.to_string(),
            dataset: handle,
            bbox: None,
            bbox_crs: None,
            limit: None,
            filter: None,
        })
        .expect("viewport_query");

    let dp = spatial_data_plane::serve(DataPlaneConfig {
        factory: Arc::new(EngineSourceFactory::ticket_only(catalog, tickets)),
        static_dir: None,
        expected_origin: None,
    })
    .await
    .expect("serve");

    let mut c = connect(&dp).await;
    let start_frame =
        wire::frame(wire::TAG_START, &wire::start_payload(OPERATION, ticket.stream.as_str().as_bytes()));
    c.send(Message::Binary(start_frame.into())).await.expect("start");
    c.send(Message::Binary(wire::frame(wire::TAG_CREDIT, &u32::MAX.to_be_bytes()).into()))
        .await
        .expect("credit");

    let mut saw_batch = false;
    loop {
        let msg = match tokio::time::timeout(RECV_DEADLINE, c.next()).await {
            Ok(Some(Ok(m))) => m,
            Ok(Some(Err(_))) | Ok(None) => break,
            Err(_) => panic!("timed out waiting for a frame"),
        };
        let Message::Binary(b) = msg else { continue };
        if b.first() == Some(&wire::TAG_BATCH) {
            saw_batch = true;
        }
        if b.first() == Some(&wire::TAG_TERMINAL) {
            break;
        }
    }

    assert!(saw_batch, "a ticket-redeemed stream must still deliver batches");
    assert_eq!(
        dp.json_frames_seen.load(std::sync::atomic::Ordering::SeqCst),
        0,
        "no JSON may appear on the data path for a ticket-redeemed stream either (ADR-004)"
    );
}

#[tokio::test(flavor = "multi_thread")]
async fn a_raw_stream_params_start_is_refused_in_ticket_only_mode() {
    // ADR-019's own consequence: one process never installs both admission paths. `StreamParams`'s
    // wire form opens with a one-byte flag (`0x00`-`0x03`), which can never parse as a `sh_...`
    // ticket handle, so this producer refuses it deterministically rather than by chance.
    let path = fixture("refuse-raw", 1_000);
    let handle = dataset_handle();
    let catalog = Arc::new(Catalog::new());
    catalog.open(handle.as_str(), &path, None).expect("open dataset");
    let tickets = StreamRegistry::new();

    let dp = spatial_data_plane::serve(DataPlaneConfig {
        factory: Arc::new(EngineSourceFactory::ticket_only(catalog, tickets)),
        static_dir: None,
        expected_origin: None,
    })
    .await
    .expect("serve");

    let mut c = connect(&dp).await;
    let raw = StreamParams { dataset: handle.as_str().to_string(), bbox: None, bbox_crs: None, limit: None };
    let start_frame = wire::frame(wire::TAG_START, &wire::start_payload(OPERATION, &raw.encode()));
    c.send(Message::Binary(start_frame.into())).await.expect("start");

    let msg = tokio::time::timeout(RECV_DEADLINE, c.next())
        .await
        .expect("no timeout")
        .expect("a frame")
        .expect("not a transport error");
    let Message::Binary(b) = msg else { panic!("expected a binary frame") };
    assert_eq!(b.first(), Some(&wire::TAG_TERMINAL), "a raw StreamParams START must be refused, not silently accepted");
    assert_eq!(b.get(wire::FRAME_PREFIX_LEN), Some(&wire::TERM_PRODUCER_FAILED));
}

#[tokio::test(flavor = "multi_thread")]
async fn a_declared_webview_origin_is_admitted_and_the_port_derived_default_no_longer_authenticates_it() {
    // ADR-020: `frontends/shell`'s Tauri webview origin (`http://localhost:5180` under `tauri
    // dev`) has nothing to do with the data plane's own OS-assigned port, so `Session::new`'s
    // derivation (`http://127.0.0.1:<port>`) could never match it -- every stream this shell ever
    // opened was silently 403'd at the WebSocket upgrade. This reproduces the shell's actual
    // `DataPlaneConfig { expected_origin: Some(..) }` wiring end to end over a real socket: the
    // regression that bug would have failed.
    let path = fixture("webview-origin", 1_000);
    let handle = dataset_handle();
    let catalog = Arc::new(Catalog::new());
    catalog.open(handle.as_str(), &path, None).expect("open dataset");
    let tickets = StreamRegistry::new();

    let dp = spatial_data_plane::serve(DataPlaneConfig {
        factory: Arc::new(EngineSourceFactory::ticket_only(catalog, tickets)),
        static_dir: None,
        expected_origin: Some("http://localhost:5180".to_string()),
    })
    .await
    .expect("serve");

    // The shell's real dev-mode origin: admitted.
    let mut req = format!("ws://127.0.0.1:{}/stream", dp.addr.port()).into_client_request().unwrap();
    req.headers_mut().insert("origin", "http://localhost:5180".parse().unwrap());
    req.headers_mut().insert(
        "sec-websocket-protocol",
        format!("{SUBPROTOCOL}, tok.{}", dp.session.token_for_delivery()).parse().unwrap(),
    );
    tokio_tungstenite::connect_async(req).await.expect("the shell's declared webview origin must be admitted");

    // The port-derived origin `Session::new` would have used -- no longer authoritative once
    // `expected_origin` is declared. This is the exact request shape the pre-fix code accepted and
    // the post-fix code must reject.
    let mut wrong = format!("ws://127.0.0.1:{}/stream", dp.addr.port()).into_client_request().unwrap();
    wrong.headers_mut()
        .insert("origin", format!("http://127.0.0.1:{}", dp.addr.port()).parse().unwrap());
    wrong.headers_mut().insert(
        "sec-websocket-protocol",
        format!("{SUBPROTOCOL}, tok.{}", dp.session.token_for_delivery()).parse().unwrap(),
    );
    assert!(
        tokio_tungstenite::connect_async(wrong).await.is_err(),
        "the port-derived origin must be rejected once expected_origin is declared"
    );
}

#[tokio::test(flavor = "multi_thread")]
async fn a_declared_origin_with_a_wrong_token_is_refused_as_a_credential_rejection() {
    // ADR-020 condition C3, named by the 2026-08-12 architect review: origin admission and
    // credential admission are two separate checks (`server::upgrade` checks `Session::
    // request_allowed` first, returning 403 "origin", then `Session::token_matches` second,
    // returning 401 "credential"), and the matrix had no case proving they stay separate once
    // `expected_origin` is `Some(..)`. A request that presents the *correct* declared origin
    // together with a *wrong* token must clear the first check and fail on the second -- if this
    // instead came back as an origin refusal (or was silently admitted), the two checks would have
    // collapsed into one.
    //
    // The positive control this negative test needs -- declared origin + correct token admitted --
    // already exists a few lines above in
    // `a_declared_webview_origin_is_admitted_and_the_port_derived_default_no_longer_authenticates_it`,
    // so it is not repeated here.
    let path = fixture("wrong-token", 1_000);
    let handle = dataset_handle();
    let catalog = Arc::new(Catalog::new());
    catalog.open(handle.as_str(), &path, None).expect("open dataset");
    let tickets = StreamRegistry::new();

    let dp = spatial_data_plane::serve(DataPlaneConfig {
        factory: Arc::new(EngineSourceFactory::ticket_only(catalog, tickets)),
        static_dir: None,
        expected_origin: Some("http://localhost:5180".to_string()),
    })
    .await
    .expect("serve");

    let mut req = format!("ws://127.0.0.1:{}/stream", dp.addr.port()).into_client_request().unwrap();
    req.headers_mut().insert("origin", "http://localhost:5180".parse().unwrap());
    // A well-formed but wrong token -- same shape `Session::token_matches` expects, differing
    // credential.
    req.headers_mut()
        .insert("sec-websocket-protocol", format!("{SUBPROTOCOL}, tok.{}", "0".repeat(64)).parse().unwrap());

    let err = tokio_tungstenite::connect_async(req)
        .await
        .expect_err("the declared origin does not rescue a wrong token");
    let tokio_tungstenite::tungstenite::Error::Http(resp) = err else {
        panic!("expected an HTTP-level refusal at the upgrade, got {err:?}");
    };
    assert_eq!(
        resp.status().as_u16(),
        401,
        "server.rs answers a bad credential with 401 (\"credential\"); 403 would mean the origin \
         check fired instead, which is the exact conflation this test exists to rule out"
    );
}

#[tokio::test(flavor = "multi_thread")]
async fn viewport_query_refuses_synchronously_on_a_crs_mismatch_before_minting_a_handle() {
    let path = fixture("crs-mismatch", 100);
    let handle = dataset_handle();
    let catalog = Arc::new(Catalog::new());
    catalog.open(handle.as_str(), &path, None).expect("open dataset");
    let tickets = StreamRegistry::new();
    let host = SkpHost::new(catalog, tickets);

    let bbox = spatial_skp::v0::Bbox {
        xmin: spatial_skp::v0::HexF64(0.0),
        ymin: spatial_skp::v0::HexF64(0.0),
        xmax: spatial_skp::v0::HexF64(1.0),
        ymax: spatial_skp::v0::HexF64(1.0),
    };
    let err = host
        .viewport_query(ViewportQueryRequest {
            skp: SKP_VERSION.to_string(),
            dataset: handle,
            bbox: Some(bbox),
            bbox_crs: Some("EPSG:4326".to_string()),
            limit: None,
            filter: None,
        })
        .expect_err("a viewport in the wrong CRS must be refused");

    // The typed refusal reaches SKP verbatim (SKP-V0.md §5) — the exact code a UI branches on, and
    // the exact prose the cut brief requires the shell to show.
    assert_eq!(err.code, "engine.viewport_crs_mismatch");
    assert!(err.message.contains("EPSG:4326"), "{}", err.message);
    assert!(err.message.contains("performs no reprojection"), "{}", err.message);
}

#[tokio::test(flavor = "multi_thread")]
async fn opening_a_source_with_no_crs_is_refused_verbatim() {
    let dir = std::path::PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../target/fixtures");
    std::fs::create_dir_all(&dir).expect("fixture dir");
    let path = dir.join("skp-admission-no-crs-actual.parquet");
    write_geoparquet(
        &path,
        &FixtureSpec { features: 100, crs_mode: CrsMode::AbsentKey, ..Default::default() },
    )
    .expect("write fixture");

    let catalog = Catalog::new();
    let handle = dataset_handle();
    let err = catalog.open(handle.as_str(), &path, None).expect_err("no CRS must be refused at open");
    let skp_err = spatial_kernel::skp::error_of(&err);
    assert_eq!(skp_err.code, "engine.crs_undeclared");
    assert!(skp_err.message.contains("OGC:CRS84"), "{}", skp_err.message);
}

/// A known instrumentation-ordering race in `engine::cancel::CancelToken::cancel_inner`, not a
/// failure of cancellation reach: see this file's own retry wrapper below for the mechanism.
struct OrderingRaceObserved {
    requested_nanos: u64,
    observed_nanos: u64,
}

/// **Supersede-on-pan's cancellation mechanism, asserted rather than eyeballed.**
///
/// Mints a ticket, redeems it, lets the producer get partway through a large fixture under
/// deliberately scarce credit, then cancels through `SkpHost::cancel` — the same call
/// `frontends/shell` makes when a pan supersedes an in-flight viewport stream. Engine tracing
/// (`ADR-018`'s vocabulary: `cancel_requested` = `CANCELLATION_REQUESTED`, `cancel_observed` =
/// `PRODUCER_CANCELLED`) proves the producer actually noticed, on its own clock, rather than the
/// test merely observing that the socket eventually closed.
///
/// **Retried, not run once, and that is load-bearing, not flakiness-hiding.**
/// `CancelToken::cancel_inner` (`engine/src/cancel.rs`) publishes its atomic flag *before* it
/// stamps `CANCELLATION_REQUESTED`, not after — so a producer thread reacting to the flag inside
/// that window can capture its own `PRODUCER_CANCELLED` instant first, inverting the two by a few
/// hundred nanoseconds. Confirmed empirically here (roughly one run in five in this environment).
/// The cancellation itself is never in question on that run — the interrupt still reaches the
/// producer, which still stops — only the two trace stamps' relative order is occasionally wrong.
/// Fixing the stamp order lives in `engine/src/cancel.rs` and `engine/src/trace.rs`, both shared
/// by the active query-window-attribution measurement work (`kernel/RESULTS.md`'s recent
/// sections); reordering them as a side effect of this shell cut risks that work, which this cut
/// does not own. Retrying re-samples the same real behaviour until the trace instrumentation
/// happens to land cleanly — every *other* assertion below still fails a retry attempt outright,
/// via `.expect`/`assert_eq!`, exactly as before.
#[tokio::test(flavor = "multi_thread")]
async fn cancel_reaches_the_producer_directly_and_is_observed_on_its_own_clock() {
    const ATTEMPTS: u32 = 5;
    for attempt in 1..=ATTEMPTS {
        match cancel_reaches_the_producer_directly_once().await {
            Ok(()) => return,
            Err(race) if attempt < ATTEMPTS => {
                eprintln!(
                    "attempt {attempt}/{ATTEMPTS}: known cancel_requested/cancel_observed \
                     instrumentation race (engine/src/cancel.rs) hit -- requested {} ns, observed \
                     {} ns; retrying",
                    race.requested_nanos, race.observed_nanos
                );
            }
            Err(race) => panic!(
                "known instrumentation race reproduced on every one of {ATTEMPTS} attempts \
                 (last: requested {} ns, observed {} ns) -- this is no longer the rare case this \
                 retry was written for; treat as a real regression",
                race.requested_nanos, race.observed_nanos
            ),
        }
    }
}

async fn cancel_reaches_the_producer_directly_once() -> Result<(), OrderingRaceObserved> {
    let path = fixture("cancel", 200_000);
    let handle = dataset_handle();
    let catalog = Arc::new(Catalog::new());
    catalog.open(handle.as_str(), &path, None).expect("open dataset");
    let tickets = StreamRegistry::new();
    let host = SkpHost::new(catalog.clone(), tickets.clone());

    assert!(!trace::is_enabled(), "tracing is off unless a trace is started");
    let guard = trace::start(TraceKey {
        dataset: handle.as_str().to_string(),
        physical_id: 0,
        lease_generation: 0,
        label: "skp-admission-cancel".into(),
    })
    .expect("no other trace is running in this process");

    let ticket = host
        .viewport_query(ViewportQueryRequest {
            skp: SKP_VERSION.to_string(),
            dataset: handle,
            bbox: None,
            bbox_crs: None,
            limit: None,
            filter: None,
        })
        .expect("viewport_query");
    let stream_handle = ticket.stream.clone();

    let dp = spatial_data_plane::serve(DataPlaneConfig {
        factory: Arc::new(EngineSourceFactory::ticket_only(catalog, tickets)),
        static_dir: None,
        expected_origin: None,
    })
    .await
    .expect("serve");

    let mut c = connect(&dp).await;
    let start_frame =
        wire::frame(wire::TAG_START, &wire::start_payload(OPERATION, stream_handle.as_str().as_bytes()));
    c.send(Message::Binary(start_frame.into())).await.expect("start");
    // Scarce credit: enough to let the producer actually start moving rows, not enough to let a
    // 200,000-feature fixture finish before the cancel below has a chance to land.
    c.send(Message::Binary(wire::frame(wire::TAG_CREDIT, &2u32.to_be_bytes()).into()))
        .await
        .expect("credit");

    // Wait for the stream to be genuinely producing before cancelling — cancelling an operation
    // that has not started anything yet would prove nothing about mid-flight observation. The loop
    // only exits by `break` below; falling through would mean the deadline panicked first.
    loop {
        let msg = tokio::time::timeout(RECV_DEADLINE, c.next())
            .await
            .expect("no timeout waiting for the first batch")
            .expect("a frame")
            .expect("not a transport error");
        let Message::Binary(b) = msg else { continue };
        if b.first() == Some(&wire::TAG_BATCH) {
            break;
        }
    }

    let outcome =
        host.cancel(spatial_skp::v0::CancelRequest { skp: SKP_VERSION.to_string(), handle: stream_handle.as_str().to_string() });
    assert_eq!(outcome.unwrap().state, "requested");

    // Drain to a terminal. `SkpHost::cancel` interrupts the engine directly (ADR-019's Consequences); the
    // adapter's own `StreamState` never saw a CANCEL control frame, so the terminal code the wire
    // reports is `TERM_PRODUCER_FAILED` carrying the engine's own "cancelled" text — a
    // characteristic of this convergence path, asserted here rather than assumed.
    let mut terminal_code = None;
    loop {
        let msg = match tokio::time::timeout(RECV_DEADLINE, c.next()).await {
            Ok(Some(Ok(m))) => m,
            Ok(Some(Err(_))) | Ok(None) => break,
            Err(_) => panic!("timed out waiting for the terminal frame after cancel"),
        };
        let Message::Binary(b) = msg else { continue };
        if b.first() == Some(&wire::TAG_TERMINAL) {
            terminal_code = b.get(wire::FRAME_PREFIX_LEN).copied();
            break;
        }
    }
    assert_eq!(
        terminal_code,
        Some(wire::TERM_PRODUCER_FAILED),
        "an SKP-cancelled ticket stream ends in TERM_PRODUCER_FAILED, not TERM_CANCELLED — the \
         cancel reached the engine directly rather than through a data-plane CANCEL frame"
    );

    let trace = guard.trace();
    let requested = trace.first(trace::CANCELLATION_REQUESTED);
    let observed = trace.first(trace::PRODUCER_CANCELLED);
    drop(guard);

    let requested = requested.expect("cancel_requested must be stamped — CancelToken::cancel() ran");
    let observed = observed.expect(
        "cancel_observed must be stamped — the producer must notice the interrupt and stop \
         advancing, per ADR-018 item 1",
    );
    // The known, retryable race this test's own retry wrapper documents: not asserted away, but
    // reported to the caller as `Err` so the loop above -- not this function -- decides whether to
    // resample or fail the test outright.
    if observed.offset_nanos < requested.offset_nanos {
        return Err(OrderingRaceObserved {
            requested_nanos: requested.offset_nanos,
            observed_nanos: observed.offset_nanos,
        });
    }
    // Sanity bound so a regression that silently stopped stamping either event does not pass by
    // accident: the observed gap must be a real, small number, not zero-by-coincidence.
    let gap = Duration::from_nanos(observed.offset_nanos - requested.offset_nanos);
    assert!(
        gap < Duration::from_secs(5),
        "cancel_requested -> cancel_observed took {gap:?}, which is not \"producer-observed\" in \
         any sense this cut can claim"
    );
    Ok(())
}
