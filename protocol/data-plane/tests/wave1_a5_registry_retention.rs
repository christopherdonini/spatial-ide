// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! Wave 1, item A5 (lifecycle audit) reproducer — evidence only, not a fix.
//!
//! `StreamRegistry` (`src/server.rs`) appends one `Arc<StreamState>` per admitted stream and one
//! `(String, Terminal)` per ended stream, and nothing in the crate ever removes either. The shell
//! keeps its `RunningDataPlane` (and so this registry) alive for the whole process
//! (`frontends/shell/src-tauri/src/lib.rs`, `Box::leak(Box::new(running))`), so every tile stream
//! a pan mints is retained until exit. (`active()` itself reads 0 once the streams have ended; the
//! assertion on it is a guard, not the finding.)
//!
//! The test states the property a bounded registry would hold after every stream has finished and
//! been recorded: retention not proportional to history. At the audited baseline it FAILS on the
//! retention assertion, which is the reproduction. It is `#[ignore]`d so this evidence branch does
//! not turn a CI run red; run it with `--ignored`.

use std::sync::Arc;
use std::time::Duration;

use futures_util::{SinkExt, StreamExt};
use spatial_data_plane::server::{DataPlaneConfig, MAX_CONCURRENT_STREAMS};
use spatial_data_plane::session::SUBPROTOCOL;
use spatial_data_plane::transport::{
    BatchMeta, BatchSource, OpenRequest, SourceCancel, SourceFactory,
};
use spatial_data_plane::{wire, RunningDataPlane};
use tokio_tungstenite::tungstenite::client::IntoClientRequest;
use tokio_tungstenite::tungstenite::Message;

struct NoCancel;
impl SourceCancel for NoCancel {
    fn cancel(&self) {}
}

/// One small batch, then end of stream.
struct OneBatch {
    left: usize,
}
impl BatchSource for OneBatch {
    fn next_into(&mut self, out: &mut Vec<u8>) -> Option<Result<BatchMeta, String>> {
        if self.left == 0 {
            return None;
        }
        self.left -= 1;
        out.extend_from_slice(&[0xFF, 0xFF, 0xFF, 0xFF]);
        out.resize(out.len() + 64, 0xAB);
        Some(Ok(BatchMeta { rows: 1 }))
    }
    fn total_batches(&self) -> Option<u64> {
        Some(1)
    }
}

struct Factory;
impl SourceFactory for Factory {
    fn create(
        &self,
        _request: &OpenRequest,
    ) -> Result<(Box<dyn BatchSource>, Arc<dyn SourceCancel>), String> {
        Ok((Box::new(OneBatch { left: 1 }), Arc::new(NoCancel)))
    }
}

type Client =
    tokio_tungstenite::WebSocketStream<tokio_tungstenite::MaybeTlsStream<tokio::net::TcpStream>>;

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

/// One ordinary stream, run to a Completed terminal, then closed by the client.
async fn one_completed_stream(dp: &RunningDataPlane) {
    let mut c = connect(dp).await;
    let start = wire::frame(
        wire::TAG_START,
        &wire::start_payload("synthetic", &[1, 2, 3]),
    );
    c.send(Message::Binary(start.into())).await.unwrap();
    c.send(Message::Binary(
        wire::frame(wire::TAG_CREDIT, &8u32.to_be_bytes()).into(),
    ))
    .await
    .unwrap();
    loop {
        let m = tokio::time::timeout(Duration::from_secs(30), c.next())
            .await
            .expect("frame within 30 s")
            .expect("connection open")
            .expect("frame");
        if let Message::Binary(b) = m {
            if b[0] == wire::TAG_TERMINAL {
                assert_eq!(b[wire::FRAME_PREFIX_LEN], wire::TERM_COMPLETED);
                break;
            }
        }
    }
    c.close(None).await.ok();
}

const STREAMS: usize = 200;

#[tokio::test(flavor = "multi_thread")]
#[ignore = "wave1-A5 reproducer: fails at bb98f71 (registry retains every stream ever served)"]
async fn a_finished_stream_is_not_retained_for_the_life_of_the_process() {
    let dp = spatial_data_plane::serve(DataPlaneConfig {
        factory: Arc::new(Factory),
        static_dir: None,
        expected_origin: None,
    })
    .await
    .expect("serve");

    for _ in 0..STREAMS {
        one_completed_stream(&dp).await;
    }
    // Every stream has ended; wait for the server side to record all of the terminals.
    let deadline = tokio::time::Instant::now() + Duration::from_secs(30);
    while dp.registry.terminals().len() < STREAMS && tokio::time::Instant::now() < deadline {
        tokio::time::sleep(Duration::from_millis(10)).await;
    }

    let retained = dp.registry.snapshot().len();
    let terminals = dp.registry.terminals().len();
    let active = dp.registry.active();
    eprintln!(
        "after {STREAMS} completed streams: snapshot().len()={retained} terminals().len()={terminals} active()={active}"
    );

    assert_eq!(
        active, 0,
        "no stream is running, yet active() reports {active}"
    );
    assert!(
        retained <= MAX_CONCURRENT_STREAMS,
        "the registry retains {retained} StreamStates after {STREAMS} finished streams \
         (grows with every stream served; no ceiling)"
    );
    assert!(
        terminals <= MAX_CONCURRENT_STREAMS,
        "the registry retains {terminals} terminal records after {STREAMS} finished streams"
    );
    dp.shutdown().await;
}
