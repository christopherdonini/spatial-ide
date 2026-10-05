// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **Credit gates batch frames only: a stream its owner ends reaches the client as a terminal even
//! when the client has granted no credit.**
//!
//! The real shape throughout: `SkpHost`, a ticket, `EngineSourceFactory::ticket_only`, `serve`
//! (`protocol/data-plane/TERMINAL-WITHOUT-CREDIT-PREREGISTRATION.md` §4, T1 and T1b). A separate
//! binary from `skp_admission.rs` on purpose: it starts no trace, because the engine's trace slot
//! is process-global and one traced stream is all it holds.
//!
//! The only timing here is [`RECV_DEADLINE`], a liveness bound: a stream that never ends is a named
//! failure rather than a hang. Nothing is measured.

use std::sync::Arc;
use std::time::{Duration, Instant};

use futures_util::{SinkExt, StreamExt};
use spatial_data_plane::server::DataPlaneConfig;
use spatial_data_plane::session::SUBPROTOCOL;
use spatial_data_plane::transport::StreamState;
use spatial_data_plane::{wire, RunningDataPlane, MAX_INFLIGHT_BATCHES};
use spatial_engine::fixture::{write_geoparquet, FixtureSpec};
use spatial_engine::EngineError;
use spatial_kernel::skp::{error_of, session_end_channel, SkpHost, StreamRegistry};
use spatial_kernel::{Catalog, EngineSourceFactory, OPERATION};
use spatial_skp::v0::{
    CancelRequest, CancelState, CloseDatasetRequest, ViewportQueryRequest, SKP_VERSION,
};
use tokio_tungstenite::tungstenite::client::IntoClientRequest;
use tokio_tungstenite::tungstenite::Message;

mod watch_support;

/// A liveness bound with the value `skp_admission.rs` declares for its own receives.
const RECV_DEADLINE: Duration = Duration::from_secs(60);

type Client =
    tokio_tungstenite::WebSocketStream<tokio_tungstenite::MaybeTlsStream<tokio::net::TcpStream>>;

/// The generator and spec `skp_admission.rs`'s cancel test uses, under this file's own names.
fn fixture(name: &str, features: usize) -> std::path::PathBuf {
    let dir = std::path::PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../target/fixtures");
    std::fs::create_dir_all(&dir).expect("fixture dir");
    let path = dir.join(format!("skp-cancel-terminal-{name}.parquet"));
    write_geoparquet(
        &path,
        &FixtureSpec {
            features,
            avg_vertices: 12,
            hole_every: 0,
            ..Default::default()
        },
    )
    .expect("write fixture");
    path
}

async fn connect(dp: &RunningDataPlane) -> Client {
    let mut req = format!("ws://127.0.0.1:{}/stream", dp.addr.port())
        .into_client_request()
        .unwrap();
    req.headers_mut().insert(
        "origin",
        format!("http://127.0.0.1:{}", dp.addr.port())
            .parse()
            .unwrap(),
    );
    req.headers_mut().insert(
        "sec-websocket-protocol",
        format!("{SUBPROTOCOL}, tok.{}", dp.session.token_for_delivery())
            .parse()
            .unwrap(),
    );
    tokio_tungstenite::connect_async(req)
        .await
        .expect("connect")
        .0
}

/// One receive, bounded, so a stall is a named failure and not a hang.
async fn recv_by(c: &mut Client, what: &str) -> Option<Vec<u8>> {
    loop {
        match tokio::time::timeout(RECV_DEADLINE, c.next()).await {
            Ok(Some(Ok(Message::Binary(b)))) => return Some(b.to_vec()),
            Ok(Some(Ok(_))) => {}
            Ok(Some(Err(_))) | Ok(None) => return None,
            Err(_) => panic!("timed out after {RECV_DEADLINE:?} waiting for {what}"),
        }
    }
}

/// How the stream's owner ends it.
enum OwnerAct {
    SkpCancel,
    CloseDataset,
}

struct Outcome {
    state: Arc<StreamState>,
    code: u8,
    detail: String,
    batches: usize,
}

/// START with no credit ever granted; wait for the producer to stop at its plateau; the owner ends
/// the stream; drain to the terminal.
async fn owner_ends_a_stream_with_no_credit_granted(name: &str, act: OwnerAct) -> Outcome {
    let path = fixture(name, 200_000);
    let handle: spatial_skp::v0::DatasetHandle =
        "ds_00000000000000000000000000000000".parse().unwrap();
    let catalog = Arc::new(Catalog::new());
    catalog
        .open(handle.as_str(), &path, None)
        .expect("open dataset");
    let tickets = StreamRegistry::new();
    let host = SkpHost::new(
        catalog.clone(),
        tickets.clone(),
        watch_support::no_watch_arm(),
        session_end_channel().0,
    );
    host.generations()
        .mint_for_open(handle.as_str(), spatial_skp::v0::SessionRef::mint());
    let ticket = host
        .viewport_query(ViewportQueryRequest {
            skp: SKP_VERSION.to_string(),
            dataset: handle.clone(),
            bbox: None,
            bbox_crs: None,
            limit: None,
            filter: None,
            columns: None,
        })
        .expect("viewport_query");

    let dp = spatial_data_plane::serve(DataPlaneConfig {
        factory: Arc::new(EngineSourceFactory::ticket_only(
            catalog,
            tickets,
            host.generations(),
        )),
        static_dir: None,
        expected_origin: None,
    })
    .await
    .expect("serve");

    let mut c = connect(&dp).await;
    c.send(Message::Binary(
        wire::frame(
            wire::TAG_START,
            &wire::start_payload(OPERATION, ticket.stream.as_str().as_bytes()),
        )
        .into(),
    ))
    .await
    .expect("start");
    // No CREDIT frame is ever sent. TAG_OPEN is sent once the ticket is redeemed, so the owner's act
    // below meets the registry's `Redeemed` state and reaches the engine's own cancel.
    loop {
        let b = recv_by(&mut c, "TAG_OPEN").await.expect("a frame");
        if b.first() == Some(&wire::TAG_OPEN) {
            break;
        }
    }

    // Wait for the producer to stop: it works ahead into its window and parks on a full channel.
    let state = dp.registry.snapshot().last().cloned().expect("a stream");
    let (mut last, mut stable) = (0, 0u32);
    let end = Instant::now() + RECV_DEADLINE;
    let plateau = loop {
        assert!(Instant::now() < end, "the producer never reached a plateau");
        tokio::time::sleep(Duration::from_millis(10)).await;
        let now = state.batches_generated();
        if now > 0 && now == last {
            stable += 1;
            if stable >= 50 {
                break now;
            }
        } else {
            (last, stable) = (now, 0);
        }
    };
    let window = MAX_INFLIGHT_BATCHES as u64;
    assert!(
        (window..=window + 1).contains(&plateau),
        "plateau {plateau} outside {window}..={}",
        window + 1
    );

    match act {
        OwnerAct::SkpCancel => {
            let outcome = host.cancel(CancelRequest {
                skp: SKP_VERSION.to_string(),
                handle: ticket.stream.as_str().to_string(),
            });
            assert_eq!(outcome.unwrap().state, CancelState::Requested);
        }
        OwnerAct::CloseDataset => {
            let closed = host
                .close_dataset(CloseDatasetRequest {
                    skp: SKP_VERSION.to_string(),
                    dataset: handle,
                })
                .expect("close_dataset");
            assert_eq!(closed.cancelled_streams, 1);
        }
    }

    let mut batches = 0;
    let (code, detail) = loop {
        let b = recv_by(&mut c, "the terminal after the owner's act")
            .await
            .expect("the stream ended with no terminal frame");
        match b.first() {
            Some(&wire::TAG_BATCH) => batches += 1,
            Some(&wire::TAG_TERMINAL) => {
                let p = &b[wire::FRAME_PREFIX_LEN..];
                break (p[0], String::from_utf8_lossy(&p[1..]).into_owned());
            }
            _ => {}
        }
    };
    c.close(None).await.ok();
    dp.shutdown().await;
    Outcome {
        state,
        code,
        detail,
        batches,
    }
}

/// The terminal every owner path owes: the engine's typed cancellation, as a producer failure.
fn assert_the_engines_cancellation_arrived(o: &Outcome) {
    assert_eq!(
        o.code,
        wire::TERM_PRODUCER_FAILED,
        "detail was: {}",
        o.detail
    );
    let prefix = format!("{}:", error_of(&EngineError::Cancelled).code);
    assert!(
        o.detail.starts_with(&prefix),
        "the detail must begin {prefix:?}, got: {}",
        o.detail
    );
    assert_eq!(
        o.batches, 0,
        "no credit was granted, so no batch may arrive"
    );
    assert_eq!(o.state.resident_bytes(), 0, "nothing stays resident");
    assert_eq!(
        o.state.batches_discarded(),
        o.state.batches_generated(),
        "every generated batch was discarded, none sent"
    );
}

/// RECORDED MUTATION (M1): delete the owner-cancel arm from the writer. It fails at `recv_by`.
#[tokio::test(flavor = "multi_thread")]
async fn an_skp_cancel_reaches_the_client_as_a_terminal_with_no_credit_granted() {
    let o = owner_ends_a_stream_with_no_credit_granted("cancel", OwnerAct::SkpCancel).await;
    assert_the_engines_cancellation_arrived(&o);
}

/// RECORDED MUTATION (M1): delete the owner-cancel arm from the writer. It fails at `recv_by`.
#[tokio::test(flavor = "multi_thread")]
async fn a_close_dataset_reaches_the_client_as_a_terminal_with_no_credit_granted() {
    let o = owner_ends_a_stream_with_no_credit_granted("close", OwnerAct::CloseDataset).await;
    assert_the_engines_cancellation_arrived(&o);
}
