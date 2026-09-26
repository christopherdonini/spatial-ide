// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! T1–T3 of `STREAM-REGISTRY-BOUND-PREREGISTRATION.md` §4, over the real
//! `spatial_data_plane::serve` and a real loopback socket, in the shape of
//! `candidate_a.rs::connect_with`. T4 and T5 are unit tests in `server.rs`'s own
//! `#[cfg(test)] mod tests` — they read this registry's internal state, which this file cannot
//! reach over the wire.

use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;
use std::time::{Duration, Instant};

use futures_util::{SinkExt, StreamExt};
use spatial_data_plane::server::MAX_TERMINAL_RECORDS;
use spatial_data_plane::session::SUBPROTOCOL;
use spatial_data_plane::transport::{
    BatchMeta, BatchSource, OpenRequest, SourceCancel, SourceFactory,
};
use spatial_data_plane::{wire, DataPlaneConfig, RunningDataPlane, Terminal};
use tokio_tungstenite::tungstenite::client::IntoClientRequest;
use tokio_tungstenite::tungstenite::Message;

/// A hang bound on any single wait in this file — not a timing claim (§8 item 8), chosen far above
/// any real wait here so it can only fire on a genuine stall (`candidate_a.rs`'s `RECV_DEADLINE`).
const HANG_BOUND: Duration = Duration::from_secs(30);

/// More than `MAX_TERMINAL_RECORDS` retains, so T1 discriminates rather than only ever passing.
const STREAMS: usize = 200;
const _: () = assert!(STREAMS > MAX_TERMINAL_RECORDS);

struct Cancelled(AtomicBool);

impl SourceCancel for Cancelled {
    fn cancel(&self) {
        self.0.store(true, Ordering::SeqCst);
    }
}

/// Either half of §2's factory: one small batch then the end (`Finite`, the "finished stream"
/// half), or a source honouring `SourceCancel` that never ends on its own (`Endless`, the "live
/// stream" half). Selected by the first byte of `OpenRequest.params`: `1` is `Endless`.
enum Source {
    Finite(bool),
    Endless(Arc<Cancelled>),
}

impl BatchSource for Source {
    fn next_into(&mut self, out: &mut Vec<u8>) -> Option<Result<BatchMeta, String>> {
        match self {
            Source::Finite(sent) => {
                if *sent {
                    return None;
                }
                *sent = true;
            }
            Source::Endless(cancel) => {
                if cancel.0.load(Ordering::SeqCst) {
                    return None;
                }
                std::thread::sleep(Duration::from_millis(5));
            }
        }
        // Arrow IPC's continuation marker, so the JSON detector has nothing realistic to fire on.
        out.extend_from_slice(&[0xFF, 0xFF, 0xFF, 0xFF]);
        out.push(0xAB);
        Some(Ok(BatchMeta { rows: 1 }))
    }

    fn total_batches(&self) -> Option<u64> {
        matches!(self, Source::Finite(_)).then_some(1)
    }
}

struct Factory;

impl SourceFactory for Factory {
    fn create(
        &self,
        request: &OpenRequest,
    ) -> Result<(Box<dyn BatchSource>, Arc<dyn SourceCancel>), String> {
        let cancel = Arc::new(Cancelled(AtomicBool::new(false)));
        let source: Box<dyn BatchSource> = if request.params.first() == Some(&1) {
            Box::new(Source::Endless(cancel.clone()))
        } else {
            Box::new(Source::Finite(false))
        };
        Ok((source, cancel))
    }
}

async fn start() -> RunningDataPlane {
    spatial_data_plane::serve(DataPlaneConfig {
        factory: Arc::new(Factory),
        static_dir: None,
        expected_origin: None,
    })
    .await
    .expect("serve")
}

type Client =
    tokio_tungstenite::WebSocketStream<tokio_tungstenite::MaybeTlsStream<tokio::net::TcpStream>>;

async fn connect(dp: &RunningDataPlane) -> Result<Client, String> {
    let mut req = format!("ws://127.0.0.1:{}/stream", dp.addr.port())
        .into_client_request()
        .map_err(|e| e.to_string())?;
    let origin = format!("http://127.0.0.1:{}", dp.addr.port());
    req.headers_mut().insert("origin", origin.parse().unwrap());
    let token = dp.session.token_for_delivery().to_string();
    req.headers_mut()
        .insert("sec-websocket-protocol", format!("{SUBPROTOCOL}, tok.{token}").parse().unwrap());
    tokio_tungstenite::connect_async(req).await.map(|(s, _)| s).map_err(|e| e.to_string())
}

async fn send_start(c: &mut Client, params: &[u8]) {
    let f = wire::frame(wire::TAG_START, &wire::start_payload("synthetic", params));
    c.send(Message::Binary(f.into())).await.expect("start");
}

async fn grant(c: &mut Client, n: u32) {
    let f = wire::frame(wire::TAG_CREDIT, &n.to_be_bytes());
    c.send(Message::Binary(f.into())).await.expect("credit");
}

async fn send_cancel(c: &mut Client) {
    let f = wire::frame(wire::TAG_CANCEL, &[]);
    c.send(Message::Binary(f.into())).await.expect("cancel");
}

/// One receive, bounded by `HANG_BOUND`. Panics with the waiting context rather than hanging.
async fn recv_by(c: &mut Client, what: &str) -> Option<Message> {
    match tokio::time::timeout(HANG_BOUND, c.next()).await {
        Ok(Some(Ok(m))) => Some(m),
        Ok(Some(Err(_))) | Ok(None) => None,
        Err(_) => panic!("hit the hang bound waiting for {what}"),
    }
}

fn frame_payload(b: &[u8]) -> &[u8] {
    let len = wire::payload_len(b).expect("length");
    &b[wire::FRAME_PREFIX_LEN..wire::FRAME_PREFIX_LEN + len]
}

/// The stream id, read from the real OPEN frame (`wire::TAG_OPEN`; the payload is the operation id
/// and the stream id, space-separated — `adapter_ws::drive`'s own encoding).
fn parse_open_stream_id(b: &[u8]) -> String {
    let s = std::str::from_utf8(frame_payload(b)).expect("OPEN payload is opaque UTF-8");
    s.split(' ').nth(1).expect("operation and stream id are space-separated").to_string()
}

/// The server always sends OPEN as the very first frame on a stream (`adapter_ws::drive`, before
/// it ever waits on credit), so reading exactly one frame is enough.
async fn read_open_id(c: &mut Client) -> String {
    let msg = recv_by(c, "the OPEN frame").await.expect("connection ended before OPEN");
    let Message::Binary(b) = msg else { panic!("expected a binary OPEN frame") };
    assert_eq!(b[0], wire::TAG_OPEN, "the first frame is always OPEN");
    parse_open_stream_id(&b)
}

/// Reads frames until a TERMINAL arrives, returning its code. Panics if the connection ends first.
async fn read_terminal_code(c: &mut Client, what: &str) -> u8 {
    while let Some(msg) = recv_by(c, what).await {
        let Message::Binary(b) = msg else { continue };
        if b[0] == wire::TAG_TERMINAL {
            return frame_payload(&b)[0];
        }
    }
    panic!("connection ended before {what}");
}

async fn wait_for_terminal_recorded(dp: &RunningDataPlane, id: &str) {
    let end = Instant::now() + HANG_BOUND;
    while Instant::now() < end {
        if dp.registry.terminals().iter().any(|(sid, _)| sid == id) {
            return;
        }
        tokio::time::sleep(Duration::from_millis(5)).await;
    }
    panic!("the terminal outcome for {id} was never recorded");
}

/// Runs one stream to completion (F1's shape) and returns its id, read from the OPEN frame.
async fn run_finished_stream(dp: &RunningDataPlane) -> String {
    let mut c = connect(dp).await.expect("connect");
    send_start(&mut c, &[0]).await;
    let id = read_open_id(&mut c).await;
    grant(&mut c, 10).await;
    let code = read_terminal_code(&mut c, "the finished stream's terminal frame").await;
    assert_eq!(code, wire::TERM_COMPLETED, "the finite source must complete cleanly");
    c.close(None).await.ok();
    wait_for_terminal_recorded(dp, &id).await;
    id
}

/// T1 (F1, the finding's shape made to pass): after `STREAMS` finished streams, run one after
/// another, the registry retains exactly `MAX_TERMINAL_RECORDS` — the last opened, in order.
// MUTATION (T1), run at 2b99551, rustc 1.97.1 (8bab26f4f 2026-07-14): the count prune is removed; only the age
// prune runs. `the_registry_retains_at_most_the_declared_count_of_finished_streams` failed:
// Declared excerpt (copied by script):
// test the_registry_retains_at_most_the_declared_count_of_finished_streams ... FAILED
//
// failures:
//
// ---- the_registry_retains_at_most_the_declared_count_of_finished_streams stdout ----
//
// thread 'the_registry_retains_at_most_the_declared_count_of_finished_streams' (50196) panicked at protocol\data-plane\tests\stream_registry_bound.rs:208:5:
// assertion `left == right` failed: 200 finished streams must not all be retained
//   left: 200
//  right: 64
// Reverted; `git diff --stat` was empty afterward.
#[tokio::test]
async fn the_registry_retains_at_most_the_declared_count_of_finished_streams() {
    let dp = start().await;
    let mut opened: Vec<String> = Vec::with_capacity(STREAMS);
    for _ in 0..STREAMS {
        opened.push(run_finished_stream(&dp).await);
    }

    let recorded = dp.registry.terminals();
    assert_eq!(
        recorded.len(),
        MAX_TERMINAL_RECORDS,
        "{STREAMS} finished streams must not all be retained"
    );
    let want = &opened[STREAMS - MAX_TERMINAL_RECORDS..];
    let got: Vec<String> = recorded.into_iter().map(|(id, _)| id).collect();
    assert_eq!(got, want, "the last MAX_TERMINAL_RECORDS opened, in order");

    dp.shutdown().await;
}

/// T2 (F2): a live stream (no terminal recorded) is never pruned at the count ceiling, and once it
/// does terminate, its own record is the newest.
// MUTATION (T2), run at 2b99551, rustc 1.97.1 (8bab26f4f 2026-07-14): the count prune evicts the oldest entry in
// admission order, live or terminal. `a_live_stream_is_never_pruned_at_the_count_ceiling` failed:
// Declared excerpt (copied by script):
// test a_live_stream_is_never_pruned_at_the_count_ceiling ... FAILED
//
// failures:
//
// ---- a_live_stream_is_never_pruned_at_the_count_ceiling stdout ----
//
// thread 'a_live_stream_is_never_pruned_at_the_count_ceiling' (9856) panicked at protocol\data-plane\tests\stream_registry_bound.rs:233:9:
// the live entry must never be pruned while it has no terminal record
// Reverted; `git diff --stat` was empty afterward.
#[tokio::test]
async fn a_live_stream_is_never_pruned_at_the_count_ceiling() {
    let dp = start().await;

    let mut live = connect(&dp).await.expect("connect");
    send_start(&mut live, &[1]).await; // the endless source
    let live_id = read_open_id(&mut live).await; // 0 credit granted: it stays live

    const EXTRA: usize = 8;
    for _ in 0..(MAX_TERMINAL_RECORDS + EXTRA) {
        run_finished_stream(&dp).await;
        assert!(
            dp.registry.snapshot().iter().any(|s| s.stream.as_str() == live_id),
            "the live entry must never be pruned while it has no terminal record"
        );
    }
    assert_eq!(
        dp.registry.snapshot().len(),
        MAX_TERMINAL_RECORDS + 1,
        "the count ceiling's retained terminals, plus the one live entry"
    );

    send_cancel(&mut live).await;
    let code = read_terminal_code(&mut live, "the live stream's terminal frame").await;
    assert_eq!(code, wire::TERM_CANCELLED);
    live.close(None).await.ok();
    wait_for_terminal_recorded(&dp, &live_id).await;

    let recorded = dp.registry.terminals();
    assert_eq!(
        recorded.last().map(|(id, _)| id.as_str()),
        Some(live_id.as_str()),
        "once terminated, the live stream's own record is the newest"
    );

    dp.shutdown().await;
}

/// T3 (F3, the data plane's late cancel): a CANCEL sent after the TERMINAL frame, during the peer
/// drain, is still observed by the producer, and the recorded terminal stays `Completed`. This
/// property predates and is unchanged by the fix (§1 "May claim").
// MUTATION (T3), run at 2b99551, rustc 1.97.1 (8bab26f4f 2026-07-14), outside this diff in `adapter_ws::drive`:
// the reader is aborted as soon as the terminal frame is sent, skipping the PEER_DRAIN_TIMEOUT
// wait. `a_cancel_after_the_terminal_frame_is_still_observed_by_the_producer` failed:
// Declared excerpt (copied by script):
// test a_cancel_after_the_terminal_frame_is_still_observed_by_the_producer ... FAILED
//
// failures:
//
// ---- a_cancel_after_the_terminal_frame_is_still_observed_by_the_producer stdout ----
//
// thread 'a_cancel_after_the_terminal_frame_is_still_observed_by_the_producer' (16988) panicked at protocol\data-plane\tests\stream_registry_bound.rs:285:5:
// the producer still observes a cancel sent during its own drain
// Reverted; `git diff --stat` was empty afterward.
#[tokio::test]
async fn a_cancel_after_the_terminal_frame_is_still_observed_by_the_producer() {
    let dp = start().await;
    let mut c = connect(&dp).await.expect("connect");
    send_start(&mut c, &[0]).await;
    let id = read_open_id(&mut c).await;
    grant(&mut c, 10).await;
    let code = read_terminal_code(&mut c, "the stream's terminal frame").await;
    assert_eq!(code, wire::TERM_COMPLETED);

    // The late cancel: sent after the terminal frame, while the producer is still in its own peer
    // drain (§0).
    send_cancel(&mut c).await;
    c.close(None).await.ok();

    wait_for_terminal_recorded(&dp, &id).await;
    let recorded = dp.registry.terminals();
    let (_, terminal) = recorded.iter().find(|(sid, _)| sid == &id).expect("recorded");
    assert_eq!(terminal, &Terminal::Completed, "the recorded terminal is unaffected by a late cancel");

    let states = dp.registry.snapshot();
    let state = states.iter().find(|s| s.stream.as_str() == id).expect("state retained");
    assert!(state.is_cancelled(), "the producer still observes a cancel sent during its own drain");

    dp.shutdown().await;
}
