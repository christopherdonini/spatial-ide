// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **With tracing on and with tracing off, the same deterministic operation puts the same bytes on
//! the wire.**
//!
//! `kernel/CANCELLATION-AND-TRACING.md` §5 requires this as a regression test rather than a
//! conclusion drawn from reading the code, and the distinction is the point. "No span identifier
//! crosses the wire" is easy to assert in a comment and easy to break later with one well-meaning
//! field; a byte comparison over every emitted frame is a claim that keeps being checked.
//!
//! This is the strongest form of the zero-wire-change rule available. The weaker forms — that no
//! wire *type* names a span, that `progress_payload` is still 24 bytes — are already asserted in
//! `protocol/data-plane/src/wire.rs` and are about the schema. This one is about what actually got
//! serialized on a real run.
//!
//! ## What is compared, and the one exclusion
//!
//! Every frame the producer emits, in order, prefix and payload, byte for byte — **except
//! `TAG_OPEN`**, whose payload carries the `OperationId` and `StreamId`. Those are minted per
//! process from a counter and the pid (`protocol/data-plane/src/transport.rs`), so **two runs differ
//! there with tracing untouched**; comparing them would fail for a reason that has nothing to do
//! with tracing. Its *length* is compared instead, which is what would change if an identifier were
//! ever widened or a field appended.
//!
//! ## Why the inputs are pinned
//!
//! A comparison is only evidence if the two runs were asked for the same thing. Same fixture, same
//! `StreamParams` (`bbox: None`, `limit: None`, so no viewport-dependent row set), and credit
//! granted **up front in one lump** rather than in response to arrivals — a credit schedule that
//! depends on consumer timing would let the two runs differ in framing for scheduling reasons and
//! the test would be measuring the scheduler.

use std::sync::Arc;
use std::time::Duration;

use futures_util::{SinkExt, StreamExt};
use spatial_data_plane::server::DataPlaneConfig;
use spatial_data_plane::session::SUBPROTOCOL;
use spatial_data_plane::{wire, RunningDataPlane};
use spatial_engine::fixture::{write_geoparquet, AttributeMode, FixtureSpec};
use spatial_engine::trace::{self, TraceKey};
use spatial_kernel::skp::{session_end_channel, SkpHost, StreamRegistry};
use spatial_kernel::{Catalog, EngineSourceFactory, StreamParams, OPERATION};
use spatial_skp::v0::{ViewportQueryRequest, SKP_VERSION};
use tokio_tungstenite::tungstenite::client::IntoClientRequest;
use tokio_tungstenite::tungstenite::Message;

mod watch_support;

const DATASET: &str = "parcels";
const RECV_DEADLINE: Duration = Duration::from_secs(60);
/// Small enough to keep the test quick, large enough to produce several batches — one batch would
/// make "every frame matches" a much weaker statement than it looks.
const FEATURES: usize = 12_000;

type Client =
    tokio_tungstenite::WebSocketStream<tokio_tungstenite::MaybeTlsStream<tokio::net::TcpStream>>;

fn fixture() -> std::path::PathBuf {
    let dir = std::path::PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../target/fixtures");
    std::fs::create_dir_all(&dir).expect("fixture dir");
    let path = dir.join("wire-bytes-invariant.parquet");
    write_geoparquet(
        &path,
        &FixtureSpec { features: FEATURES, avg_vertices: 24, hole_every: 7, ..Default::default() },
    )
    .expect("write fixture");
    path
}

async fn host(path: &std::path::Path) -> RunningDataPlane {
    let catalog = Catalog::new();
    catalog.open(DATASET, path, None).expect("open dataset");
    spatial_data_plane::serve(DataPlaneConfig {
        factory: Arc::new(EngineSourceFactory::new(Arc::new(catalog))),
        static_dir: None,
        expected_origin: None,
    })
    .await
    .expect("serve")
}

async fn connect(dp: &RunningDataPlane) -> Client {
    let mut req = format!("ws://127.0.0.1:{}/stream", dp.addr.port())
        .into_client_request()
        .unwrap();
    req.headers_mut()
        .insert("origin", format!("http://127.0.0.1:{}", dp.addr.port()).parse().unwrap());
    req.headers_mut().insert(
        "sec-websocket-protocol",
        format!("{SUBPROTOCOL}, tok.{}", dp.session.token_for_delivery()).parse().unwrap(),
    );
    tokio_tungstenite::connect_async(req).await.expect("connect").0
}

/// One emitted frame, kept whole so the comparison is over bytes rather than over a summary.
#[derive(PartialEq, Eq)]
struct Frame {
    tag: u8,
    bytes: Vec<u8>,
}

/// Run the stream to its terminal and collect every frame the producer emitted.
async fn collect_frames(path: &std::path::Path) -> Vec<Frame> {
    let dp = host(path).await;
    let mut c = connect(&dp).await;

    let params =
        StreamParams { dataset: DATASET.into(), bbox: None, bbox_crs: None, limit: None };
    let start = wire::frame(wire::TAG_START, &wire::start_payload(OPERATION, &params.encode()));
    c.send(Message::Binary(start.into())).await.expect("start");
    // **One lump of credit, granted before anything arrives.** A schedule that reacts to arrivals
    // would couple the framing to consumer timing, and the two runs could then differ for a reason
    // that is not tracing.
    let credit = wire::frame(wire::TAG_CREDIT, &u32::MAX.to_be_bytes());
    c.send(Message::Binary(credit.into())).await.expect("credit");

    let mut frames = Vec::new();
    loop {
        let msg = match tokio::time::timeout(RECV_DEADLINE, c.next()).await {
            Ok(Some(Ok(m))) => m,
            Ok(Some(Err(_))) | Ok(None) => break,
            Err(_) => panic!("timed out waiting for a frame"),
        };
        let Message::Binary(b) = msg else { continue };
        let tag = b[0];
        frames.push(Frame { tag, bytes: b.to_vec() });
        if tag == wire::TAG_TERMINAL {
            break;
        }
    }
    assert_eq!(
        dp.json_frames_seen.load(std::sync::atomic::Ordering::SeqCst),
        0,
        "no JSON may appear on the data path, traced or not"
    );
    frames
}

#[tokio::test(flavor = "multi_thread")]
async fn tracing_changes_no_byte_on_the_wire() {
    let path = fixture();

    // Untraced first, so the traced run cannot be the one that establishes the baseline shape.
    assert!(!trace::is_enabled(), "tracing is off unless a trace is started");
    let untraced = collect_frames(&path).await;

    let guard = trace::start(TraceKey {
        dataset: DATASET.into(),
        physical_id: 0,
        lease_generation: 0,
        label: "wire-bytes-invariant".into(),
    })
    .expect("no other trace is running");
    assert!(trace::is_enabled(), "the traced run really is traced");
    let traced = collect_frames(&path).await;
    let traced_batches =
        guard.trace().events().iter().filter(|e| e.name == trace::BATCH_FULL).count();
    drop(guard);

    // If the traced run recorded nothing, the comparison is vacuous — two untraced runs would of
    // course agree. Checked before the interesting assertion rather than after.
    //
    // **Counting `batch_full` specifically, not any event.** A bare `events().len() > 0` was too
    // weak: `BatchStream::drop` used to stamp a cancellation instant on every drop, so the previous
    // run's teardown could make an otherwise-empty trace look non-empty and the guard would pass on
    // a trace that had recorded nothing about this run at all.
    assert!(
        traced_batches > 0,
        "the traced run stamped no batch_full, so this comparison proves nothing about tracing"
    );

    assert_eq!(
        untraced.len(),
        traced.len(),
        "tracing must not change how many frames are emitted ({} untraced vs {} traced)",
        untraced.len(),
        traced.len()
    );
    assert!(
        untraced.iter().any(|f| f.tag == wire::TAG_BATCH),
        "the run must emit batches, or there is nothing to compare"
    );
    assert!(
        untraced.iter().filter(|f| f.tag == wire::TAG_BATCH).count() > 1,
        "more than one batch, so 'every frame matches' is a real claim"
    );

    for (i, (a, b)) in untraced.iter().zip(traced.iter()).enumerate() {
        assert_eq!(a.tag, b.tag, "frame {i}: tag differs between the traced and untraced runs");

        if a.tag == wire::TAG_OPEN {
            // **The one exclusion, and why.** OPEN's payload is `"{operation_id} {stream_id}"`,
            // minted per process from a counter and the pid — so it differs between any two runs
            // with tracing untouched. Its length is what would move if an identifier were widened
            // or a field appended, which is the thing this test is actually guarding against.
            assert_eq!(
                a.bytes.len(),
                b.bytes.len(),
                "frame {i} (OPEN): the payload length must not change — its contents are \
                 per-process identities and are excluded, but a length change would mean a field \
                 was added or an identifier widened"
            );
            continue;
        }

        assert!(
            a.bytes == b.bytes,
            "frame {i} (tag {}) differs between the traced and untraced runs. Tracing is \
             instrument surface and must put nothing on the wire.\n  untraced: {} bytes\n  \
             traced:   {} bytes",
            a.tag,
            a.bytes.len(),
            b.bytes.len()
        );
    }
}

// ---- K-6 (B1 §4): the projection case, through the SKP ticket path -----------------------------
//
// The case above proves the invariant over the **raw** `StreamParams` path, `columns: null`
// throughout (F5: B1 gives that path no projection at all, so it could never regress on this).
// This is the same invariant over the path B1 actually adds to: a declared `columns` projection,
// minted as a ticket by `SkpHost::viewport_query` and redeemed exactly as `skp_admission.rs`'s own
// ticket tests redeem one, compared byte for byte with tracing on and off.

const PROJECTED_DATASET_HANDLE: &str = "ds_00000000000000000000000000000001";

fn projected_fixture() -> std::path::PathBuf {
    let dir = std::path::PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../target/fixtures");
    std::fs::create_dir_all(&dir).expect("fixture dir");
    let path = dir.join("wire-bytes-invariant-projected.parquet");
    write_geoparquet(
        &path,
        &FixtureSpec {
            features: FEATURES,
            avg_vertices: 24,
            hole_every: 7,
            attributes: AttributeMode::MultiType,
            ..Default::default()
        },
    )
    .expect("write fixture");
    path
}

/// As `collect_frames`, but the ticket path: `SkpHost::viewport_query` admits a `columns: [zone,
/// area]` projection and mints the ticket the client then redeems, on `skp_admission.rs`'s harness.
async fn collect_frames_via_ticket(path: &std::path::Path) -> Vec<Frame> {
    let handle: spatial_skp::v0::DatasetHandle = PROJECTED_DATASET_HANDLE.parse().unwrap();
    let catalog = Arc::new(Catalog::new());
    catalog.open(handle.as_str(), path, None).expect("open dataset");
    let tickets = StreamRegistry::new();
    let host =
        SkpHost::new(catalog.clone(), tickets.clone(), watch_support::no_watch_arm(), session_end_channel().0);

    let ticket = host
        .viewport_query(ViewportQueryRequest {
            skp: SKP_VERSION.to_string(),
            dataset: handle,
            bbox: None,
            bbox_crs: None,
            limit: None,
            filter: None,
            columns: Some(vec!["zone".to_string(), "area".to_string()]),
        })
        .expect("a declared projection over a real Float64/Utf8 pair must admit");

    let dp = spatial_data_plane::serve(DataPlaneConfig {
        factory: Arc::new(EngineSourceFactory::ticket_only(catalog, tickets, host.generations())),
        static_dir: None,
        expected_origin: None,
    })
    .await
    .expect("serve");
    let mut c = connect(&dp).await;

    let start = wire::frame(wire::TAG_START, &wire::start_payload(OPERATION, ticket.stream.as_str().as_bytes()));
    c.send(Message::Binary(start.into())).await.expect("start");
    let credit = wire::frame(wire::TAG_CREDIT, &u32::MAX.to_be_bytes());
    c.send(Message::Binary(credit.into())).await.expect("credit");

    let mut frames = Vec::new();
    loop {
        let msg = match tokio::time::timeout(RECV_DEADLINE, c.next()).await {
            Ok(Some(Ok(m))) => m,
            Ok(Some(Err(_))) | Ok(None) => break,
            Err(_) => panic!("timed out waiting for a frame"),
        };
        let Message::Binary(b) = msg else { continue };
        let tag = b[0];
        frames.push(Frame { tag, bytes: b.to_vec() });
        if tag == wire::TAG_TERMINAL {
            break;
        }
    }
    assert_eq!(
        dp.json_frames_seen.load(std::sync::atomic::Ordering::SeqCst),
        0,
        "no JSON may appear on the data path for a ticket-redeemed projected stream either"
    );
    frames
}

/// K-6: as `tracing_changes_no_byte_on_the_wire`, over the ticket path with a real `[zone, area]`
/// projection. Mutation: `attribute_columns` written only while tracing (i.e. the projected schema
/// metadata, and so the batch bytes carrying it, differ between the traced and untraced runs) — the
/// byte-for-byte comparison below then fails at the first `TAG_BATCH` frame.
#[tokio::test(flavor = "multi_thread")]
async fn wire_bytes_invariant_holds_for_the_projected_ticket_path_case_too() {
    let path = projected_fixture();

    assert!(!trace::is_enabled(), "tracing is off unless a trace is started");
    let untraced = collect_frames_via_ticket(&path).await;

    let guard = trace::start(TraceKey {
        dataset: PROJECTED_DATASET_HANDLE.into(),
        physical_id: 0,
        lease_generation: 0,
        label: "wire-bytes-invariant-projected".into(),
    })
    .expect("no other trace is running");
    assert!(trace::is_enabled(), "the traced run really is traced");
    let traced = collect_frames_via_ticket(&path).await;
    let traced_batches =
        guard.trace().events().iter().filter(|e| e.name == trace::BATCH_FULL).count();
    drop(guard);

    assert!(
        traced_batches > 0,
        "the traced run stamped no batch_full, so this comparison proves nothing about tracing"
    );
    assert_eq!(
        untraced.len(),
        traced.len(),
        "tracing must not change how many frames a projected, ticket-redeemed stream emits"
    );
    assert!(
        untraced.iter().any(|f| f.tag == wire::TAG_BATCH),
        "the projected run must emit batches, or there is nothing to compare"
    );

    for (i, (a, b)) in untraced.iter().zip(traced.iter()).enumerate() {
        assert_eq!(a.tag, b.tag, "frame {i}: tag differs between the traced and untraced runs");
        if a.tag == wire::TAG_OPEN {
            assert_eq!(a.bytes.len(), b.bytes.len(), "frame {i} (OPEN): payload length must not change");
            continue;
        }
        assert!(
            a.bytes == b.bytes,
            "frame {i} (tag {}) differs between the traced and untraced projected runs — the \
             projected schema metadata (`attribute_columns`) must ride the wire identically either \
             way",
            a.tag
        );
    }
}
