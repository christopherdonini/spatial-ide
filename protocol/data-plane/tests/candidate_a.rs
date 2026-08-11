// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! The adapter's own contract, exercised with a real WebSocket client and a synthetic source.
//!
//! A Rust client rather than a browser, deliberately: the bake-off's silent-truncation episode was
//! caught only because a Rust client disagreed with the browser, so the delivery guarantee is
//! pinned here, in process, where both clocks are the same clock and a producer-side observation
//! needs no clock-relation bound at all.
//!
//! The source here is synthetic and carries no geometry: this crate must not know what a batch
//! contains. The end-to-end assertions over real GeoArrow live in `kernel/tests`.

use std::sync::atomic::{AtomicBool, AtomicU64, Ordering};
use std::sync::Arc;
use std::time::{Duration, Instant};

use futures_util::{SinkExt, StreamExt};
use spatial_data_plane::server::{DataPlaneConfig, MAX_CONCURRENT_STREAMS};
use spatial_data_plane::session::SUBPROTOCOL;
use spatial_data_plane::transport::{
    BatchMeta, BatchSource, OpenRequest, SourceCancel, SourceFactory,
};
use spatial_data_plane::{wire, RunningDataPlane, Terminal};
use tokio_tungstenite::tungstenite::client::IntoClientRequest;
use tokio_tungstenite::tungstenite::Message;

/// A source that emits `batches` payloads of `bytes` each, blocking briefly per batch so a cancel
/// has something to interrupt.
struct Synthetic {
    remaining: usize,
    total: usize,
    bytes: usize,
    per_batch: Duration,
    cancel: Arc<Flag>,
}

#[derive(Default)]
struct Flag {
    cancelled: AtomicBool,
    cancel_calls: AtomicU64,
}

impl SourceCancel for Flag {
    fn cancel(&self) {
        self.cancelled.store(true, Ordering::SeqCst);
        self.cancel_calls.fetch_add(1, Ordering::SeqCst);
    }
}

impl BatchSource for Synthetic {
    fn next_into(&mut self, out: &mut Vec<u8>) -> Option<Result<BatchMeta, String>> {
        if self.cancel.cancelled.load(Ordering::SeqCst) || self.remaining == 0 {
            return None;
        }
        std::thread::sleep(self.per_batch);
        self.remaining -= 1;
        // Arrow IPC's continuation marker, so the JSON detector has something realistic to not fire
        // on. The bytes are otherwise meaningless here on purpose.
        out.extend_from_slice(&[0xFF, 0xFF, 0xFF, 0xFF]);
        out.resize(out.len() + self.bytes, 0xAB);
        Some(Ok(BatchMeta { rows: 1 }))
    }

    fn total_batches(&self) -> Option<u64> {
        Some(self.total as u64)
    }
}

struct SyntheticFactory {
    batches: usize,
    bytes: usize,
    per_batch: Duration,
    last: std::sync::Mutex<Vec<Arc<Flag>>>,
    fail_with: Option<String>,
}

impl SourceFactory for SyntheticFactory {
    fn create(
        &self,
        _request: &OpenRequest,
    ) -> Result<(Box<dyn BatchSource>, Arc<dyn SourceCancel>), String> {
        if let Some(e) = &self.fail_with {
            return Err(e.clone());
        }
        let flag = Arc::new(Flag::default());
        self.last.lock().unwrap().push(flag.clone());
        Ok((
            Box::new(Synthetic {
                remaining: self.batches,
                total: self.batches,
                bytes: self.bytes,
                per_batch: self.per_batch,
                cancel: flag.clone(),
            }),
            flag,
        ))
    }
}

async fn start(factory: Arc<SyntheticFactory>) -> RunningDataPlane {
    spatial_data_plane::serve(DataPlaneConfig { factory, static_dir: None, expected_origin: None })
        .await
        .expect("serve")
}

fn factory(batches: usize, bytes: usize, per_batch_ms: u64) -> Arc<SyntheticFactory> {
    Arc::new(SyntheticFactory {
        batches,
        bytes,
        per_batch: Duration::from_millis(per_batch_ms),
        last: std::sync::Mutex::new(Vec::new()),
        fail_with: None,
    })
}

type Client = tokio_tungstenite::WebSocketStream<
    tokio_tungstenite::MaybeTlsStream<tokio::net::TcpStream>,
>;

async fn connect(dp: &RunningDataPlane) -> Result<Client, String> {
    connect_with(dp, Some(&format!("http://127.0.0.1:{}", dp.addr.port())), true).await
}

async fn connect_with(
    dp: &RunningDataPlane,
    origin: Option<&str>,
    valid_token: bool,
) -> Result<Client, String> {
    let mut req = format!("ws://127.0.0.1:{}/stream", dp.addr.port())
        .into_client_request()
        .map_err(|e| e.to_string())?;
    if let Some(o) = origin {
        req.headers_mut().insert("origin", o.parse().unwrap());
    }
    let token = if valid_token {
        dp.session.token_for_delivery().to_string()
    } else {
        "0".repeat(64)
    };
    req.headers_mut().insert(
        "sec-websocket-protocol",
        format!("{SUBPROTOCOL}, tok.{token}").parse().unwrap(),
    );
    tokio_tungstenite::connect_async(req)
        .await
        .map(|(s, _)| s)
        .map_err(|e| e.to_string())
}

async fn send_start(c: &mut Client) {
    let f = wire::frame(wire::TAG_START, &wire::start_payload("synthetic", &[1, 2, 3]));
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

struct Received {
    batches: usize,
    terminal: Option<(u8, String)>,
    progress: Vec<(u64, u64, u64)>,
    opened: bool,
    /// Every binary message carried **exactly one** frame — no coalescing, no frame spanning two
    /// messages. That is the property that puts a batch payload at offset 8 of the buffer the
    /// consumer receives, which is what lets Arrow view it instead of realigning it. Checked
    /// against what arrived, not against a compile-time constant.
    one_frame_per_message: bool,
    /// Distinct payload offsets observed inside the delivered messages.
    payload_offsets: Vec<usize>,
}

/// Generous upper bound on any single blocking wait in this suite.
///
/// **A test that can hang forever is itself a defect**, however correct the property it asserts.
/// `every_batch_and_a_terminal_frame_are_delivered` pins the silent-truncation race, and when a
/// product regression stopped the producer mid-stream the test did not fail — it blocked forever on
/// `c.next()`, took the whole binary down with `exit code 0xffffffff`, and reported nothing about
/// which property had broken. A deadline turns that into a named failure.
///
/// It is deliberately far above any real wait here (whole streams complete in under a second) so it
/// can only fire on a genuine stall, never on a slow machine.
const RECV_DEADLINE: Duration = Duration::from_secs(30);

/// One receive, bounded. Panics with the waiting context rather than hanging.
async fn recv_by(c: &mut Client, what: &str) -> Option<Message> {
    match tokio::time::timeout(RECV_DEADLINE, c.next()).await {
        Ok(Some(Ok(m))) => Some(m),
        Ok(Some(Err(_))) | Ok(None) => None,
        Err(_) => panic!("timed out after {RECV_DEADLINE:?} waiting for {what}"),
    }
}

/// Read until a terminal frame arrives or the connection ends.
async fn drain(c: &mut Client) -> Received {
    let mut r = Received {
        batches: 0,
        terminal: None,
        progress: Vec::new(),
        opened: false,
        one_frame_per_message: true,
        payload_offsets: Vec::new(),
    };
    while let Some(msg) = recv_by(c, "a frame, or the connection to end").await {
        let Message::Binary(b) = msg else { continue };
        let tag = b[0];
        let len = wire::payload_len(&b).expect("length");
        let payload = &b[wire::FRAME_PREFIX_LEN..wire::FRAME_PREFIX_LEN + len];
        match tag {
            wire::TAG_OPEN => r.opened = true,
            wire::TAG_BATCH => {
                r.batches += 1;
                // Measured against the message that actually arrived: its length must be exactly the
                // prefix plus the declared payload, or a frame was coalesced with another or split
                // across messages — and the payload would no longer sit at a fixed offset.
                if b.len() != wire::FRAME_PREFIX_LEN + len {
                    r.one_frame_per_message = false;
                }
                if !r.payload_offsets.contains(&wire::FRAME_PREFIX_LEN) {
                    r.payload_offsets.push(wire::FRAME_PREFIX_LEN);
                }
            }
            wire::TAG_PROGRESS => {
                let g = |o: usize| u64::from_be_bytes(payload[o..o + 8].try_into().unwrap());
                r.progress.push((g(0), g(8), g(16)));
            }
            wire::TAG_TERMINAL => {
                r.terminal =
                    Some((payload[0], String::from_utf8_lossy(&payload[1..]).to_string()));
                break;
            }
            _ => panic!("unknown tag {tag}"),
        }
    }
    r
}

#[tokio::test]
async fn every_batch_and_a_terminal_frame_are_delivered() {
    let f = factory(12, 4096, 0);
    let dp = start(f.clone()).await;
    let mut c = connect(&dp).await.expect("connect");

    send_start(&mut c).await;
    grant(&mut c, 100).await;
    let r = drain(&mut c).await;

    assert!(r.opened, "the stream announces itself in band");
    assert_eq!(r.batches, 12, "every batch arrives");
    assert_eq!(r.terminal.as_ref().unwrap().0, wire::TERM_COMPLETED);
    assert!(
        r.one_frame_per_message,
        "a message carried more or less than one frame; the payload offset is then not fixed"
    );
    assert_eq!(r.payload_offsets, vec![wire::FRAME_PREFIX_LEN]);
    assert!(
        r.payload_offsets.iter().all(|o| o % 8 == 0),
        "payloads must start 8-byte aligned inside the delivered message"
    );
    assert_eq!(
        dp.json_frames_seen.load(Ordering::SeqCst),
        0,
        "H5: zero JSON bytes on the data path"
    );

    // Progress is monotonic and its total is known here, so it is a real denominator.
    assert!(r.progress.windows(2).all(|w| w[0].0 < w[1].0 && w[0].1 <= w[1].1));
    assert_eq!(r.progress.last().unwrap().2, 12);
    dp.shutdown().await;
}

#[tokio::test]
async fn a_cancel_control_frame_reaches_the_source_and_is_observed_producer_side() {
    // H2. Both ends are in this process, so the producer's instant and the client's instant are the
    // same clock — no clock-relation bound is needed, and none is claimed.
    let f = factory(10_000, 64 * 1024, 5);
    let dp = start(f.clone()).await;
    let mut c = connect(&dp).await.expect("connect");

    send_start(&mut c).await;
    grant(&mut c, 4).await;

    // Wait until the stream is actually producing before cancelling it.
    let mut seen = 0;
    while let Some(msg) = recv_by(&mut c, "the stream to start producing").await {
        if let Message::Binary(b) = msg {
            if b[0] == wire::TAG_BATCH {
                seen += 1;
                if seen == 2 {
                    break;
                }
            }
        }
    }

    let sent_at = Instant::now();
    send_cancel(&mut c).await;
    let r = drain(&mut c).await;
    let round_trip = sent_at.elapsed();

    assert_eq!(r.terminal.as_ref().unwrap().0, wire::TERM_CANCELLED);

    let states = dp.registry.snapshot();
    let state = states.last().expect("one stream");
    let observed = state.observed_at().expect("the producer observed the cancel");
    let latency = observed.duration_since(sent_at);
    assert!(
        latency < Duration::from_millis(100),
        "producer observed cancellation after {latency:?}, over the docs/08 budget"
    );
    assert!(
        round_trip < Duration::from_secs(5),
        "the stream must end promptly after a cancel, not run to completion ({round_trip:?})"
    );

    // Cloned out of the lock rather than holding the guard: a `MutexGuard` alive across an await
    // is a deadlock waiting for this test to move to a multi-thread runtime.
    let flag = f.last.lock().unwrap().last().cloned().expect("a source was created");
    assert!(
        flag.cancelled.load(Ordering::SeqCst),
        "the cancel reached the source, not merely the writer"
    );
    assert!(flag.cancel_calls.load(Ordering::SeqCst) >= 1);
    assert!(
        state.batches_after_cancel() <= 1,
        "at most one batch may be generated after cancellation is observed"
    );
    c.close(None).await.ok();
    dp.shutdown().await;
}

#[tokio::test]
async fn a_peer_that_closes_without_cancelling_still_stops_the_producer() {
    let f = factory(10_000, 64 * 1024, 5);
    let dp = start(f.clone()).await;
    let mut c = connect(&dp).await.expect("connect");
    send_start(&mut c).await;
    grant(&mut c, 4).await;

    // Let it start, then drop the connection outright.
    tokio::time::sleep(Duration::from_millis(60)).await;
    c.close(None).await.ok();
    drop(c);

    let stopped = tokio::time::timeout(Duration::from_secs(3), async {
        loop {
            if f.last.lock().unwrap().last().map(|f| f.cancelled.load(Ordering::SeqCst)) == Some(true)
            {
                return;
            }
            tokio::time::sleep(Duration::from_millis(10)).await;
        }
    })
    .await;
    assert!(stopped.is_ok(), "an abandoned stream must stop its source");
    dp.shutdown().await;
}

/// Poll a condition to a deadline instead of sleeping a fixed interval.
///
/// Every fixed sleep in a concurrency test is a race that passes on an idle machine: the workspace
/// suite runs DuckDB fixtures in parallel, and a 250 ms guess is not a synchronisation primitive.
async fn wait_until(deadline: Duration, mut cond: impl FnMut() -> bool) -> bool {
    let end = Instant::now() + deadline;
    while Instant::now() < end {
        if cond() {
            return true;
        }
        tokio::time::sleep(Duration::from_millis(10)).await;
    }
    cond()
}

/// Count BATCH frames arriving until `settle` passes with none.
/// Wait until a counter stops moving, and return where it stopped.
async fn wait_for_plateau(
    deadline: Duration,
    stable_samples: u32,
    mut read: impl FnMut() -> u64,
) -> Option<u64> {
    let end = Instant::now() + deadline;
    let mut last = read();
    let mut stable = 0;
    while Instant::now() < end {
        tokio::time::sleep(Duration::from_millis(10)).await;
        let now = read();
        if now == last && now > 0 {
            stable += 1;
            if stable >= stable_samples {
                return Some(now);
            }
        } else {
            stable = 0;
            last = now;
        }
    }
    None
}

/// Count BATCH frames arriving until `settle` passes with none.
async fn batches_until_quiet(c: &mut Client, settle: Duration) -> usize {
    let mut n = 0;
    loop {
        match tokio::time::timeout(settle, c.next()).await {
            Ok(Some(Ok(Message::Binary(b)))) => {
                if b[0] == wire::TAG_BATCH {
                    n += 1;
                }
            }
            Ok(Some(Ok(_))) => {}
            Ok(Some(Err(_))) | Ok(None) => break,
            Err(_) => break, // quiet for `settle`
        }
    }
    n
}

/// Wait for exactly `want` batches, then confirm no further batch arrives.
///
/// **The two halves need different clocks and used to share one.** `batches_until_quiet` with a
/// fixed settle window conflates "the producer sent no more" with "the producer had not sent them
/// *yet*": under load the arrival of a batch the grant does license can slip past the window, and
/// the test fails claiming credit was under-consumed. Measured at 1 failure in 33 runs.
///
/// So the *at least* half gets a generous deadline — a shortfall there is a real defect and a slow
/// machine cannot manufacture one — and only the *no more than* half keeps a settle window, where
/// a longer wait can only make the assertion stricter.
async fn expect_exactly(c: &mut Client, want: usize, deadline: Duration, quiet: Duration) -> usize {
    let mut n = 0;
    let until = tokio::time::Instant::now() + deadline;
    while n < want {
        match tokio::time::timeout_at(until, c.next()).await {
            Ok(Some(Ok(Message::Binary(b)))) => {
                if b[0] == wire::TAG_BATCH {
                    n += 1;
                }
            }
            Ok(Some(Ok(_))) => {}
            Ok(Some(Err(_))) | Ok(None) => return n,
            Err(_) => return n, // fewer than `want` arrived: a real shortfall
        }
    }
    n + batches_until_quiet(c, quiet).await
}

#[tokio::test]
async fn withholding_credit_bounds_producer_memory() {
    // H3. The producer may work ahead into its declared window and must then stop.
    let batch_bytes = 32 * 1024;
    let f = factory(10_000, batch_bytes, 0);
    let dp = start(f.clone()).await;
    let mut c = connect(&dp).await.expect("connect");

    send_start(&mut c).await;
    // Grant nothing, and wait for the producer to work ahead into its window and *stop* — sampling
    // once after an arbitrary delay would read a value mid-climb.
    let plateau = wait_for_plateau(Duration::from_secs(20), 25, || {
        dp.registry.snapshot().last().map(|s| s.batches_generated()).unwrap_or(0)
    })
    .await
    .expect("a backpressured producer stops; this one never did");
    let states = dp.registry.snapshot();
    let state = states.last().expect("a stream exists");

    assert_eq!(state.bytes_emitted(), 0, "no credit, no bytes on the wire");

    let frame_bytes = batch_bytes + 4 + wire::FRAME_PREFIX_LEN;
    let bound = (spatial_data_plane::MAX_INFLIGHT_BATCHES + 1) * frame_bytes;
    assert!(
        state.peak_resident_bytes() <= bound,
        "producer-resident {} exceeded the declared bound {bound}",
        state.peak_resident_bytes()
    );
    // The discriminating form: a producer with backpressure removed would run to 10 000 batches,
    // and a memory bound alone would not notice if the batches were small enough.
    assert!(
        plateau <= (spatial_data_plane::MAX_INFLIGHT_BATCHES + 1) as u64,
        "generated {plateau} batches with no credit granted"
    );
    c.close(None).await.ok();
    dp.shutdown().await;
}

#[tokio::test]
async fn a_grant_of_n_moves_exactly_n_batches() {
    // **The regression test for credit actually being consumed.** `Semaphore::acquire` returns a
    // permit that returns itself when dropped, so acquiring without `forget()` waits for a credit to
    // *exist* and hands it straight back — one grant would then license the whole stream, and the
    // demand signal the consumer thinks it is giving would do nothing. Bounded memory would still
    // hold, because the pump channel is bounded, which is exactly why no memory assertion catches
    // this and why this test counts batches instead.
    let f = factory(10_000, 4096, 0);
    let dp = start(f.clone()).await;
    let mut c = connect(&dp).await.expect("connect");

    send_start(&mut c).await;
    grant(&mut c, 3).await;
    let first = expect_exactly(&mut c, 3, Duration::from_secs(5), Duration::from_millis(400)).await;
    assert_eq!(first, 3, "a grant of 3 must move exactly 3 batches, not {first}");

    grant(&mut c, 2).await;
    let second = expect_exactly(&mut c, 2, Duration::from_secs(5), Duration::from_millis(400)).await;
    assert_eq!(second, 2, "a further grant of 2 must move exactly 2 batches, not {second}");

    c.close(None).await.ok();
    dp.shutdown().await;
}

#[tokio::test]
async fn the_declared_concurrency_ceiling_refuses_rather_than_queues() {
    // ADR-010 rule 6: declared, and then driven past deliberately. Queueing policy is the question
    // ADR-014 is reserved for, so N+1 is refused with a typed terminal instead.
    let f = factory(10_000, 8192, 5);
    let dp = start(f.clone()).await;

    let mut held = Vec::new();
    for _ in 0..MAX_CONCURRENT_STREAMS {
        let mut c = connect(&dp).await.expect("connect");
        send_start(&mut c).await;
        grant(&mut c, 1).await;
        held.push(c);
    }
    // Wait for the slots to actually be taken rather than guessing how long that takes.
    let taken = wait_until(Duration::from_secs(10), || {
        dp.registry.snapshot().len() >= MAX_CONCURRENT_STREAMS
    })
    .await;
    assert!(taken, "the admitted streams never started");

    let mut extra = connect(&dp).await.expect("connect");
    send_start(&mut extra).await;
    let r = drain(&mut extra).await;

    let (code, detail) = r.terminal.expect("the refusal is a terminal frame, not a dropped socket");
    assert_eq!(code, wire::TERM_PRODUCER_FAILED);
    assert!(detail.contains("MAX_CONCURRENT_STREAMS"), "the refusal names the ceiling: {detail}");
    assert!(detail.contains("not queued"));
    assert_eq!(r.batches, 0);
    assert_eq!(dp.registry.refusals(), 1);
    extra.close(None).await.ok();
    for mut c in held {
        c.close(None).await.ok();
    }
    dp.shutdown().await;
}

#[tokio::test]
async fn a_source_refusal_reaches_the_consumer_as_a_typed_terminal() {
    // H7: a failure is reported, never presented as a short-but-complete stream.
    let f = Arc::new(SyntheticFactory {
        batches: 10,
        bytes: 128,
        per_batch: Duration::ZERO,
        last: std::sync::Mutex::new(Vec::new()),
        fail_with: Some("refused: the file declares no CRS and none was asserted".into()),
    });
    let dp = start(f).await;
    let mut c = connect(&dp).await.expect("connect");
    send_start(&mut c).await;
    let r = drain(&mut c).await;

    let (code, detail) = r.terminal.expect("terminal frame");
    assert_eq!(code, wire::TERM_PRODUCER_FAILED);
    assert!(detail.contains("declares no CRS"), "the refusal's own words survive: {detail}");
    assert_eq!(r.batches, 0);
    c.close(None).await.ok();
    dp.shutdown().await;
}

#[tokio::test]
async fn credentials_and_origins_are_enforced_on_the_data_channel() {
    // H4. The bake-off left this path untested and recorded it as a gap (§15.8); it is tested here.
    let dp = start(factory(1, 16, 0)).await;
    let good_origin = format!("http://127.0.0.1:{}", dp.addr.port());

    assert!(connect_with(&dp, Some(&good_origin), false).await.is_err(), "wrong credential");
    assert!(connect_with(&dp, Some("http://evil.example"), true).await.is_err(), "foreign origin");
    assert!(connect_with(&dp, Some("null"), true).await.is_err(), "null origin");
    assert!(
        connect_with(&dp, None, true).await.is_err(),
        "a client presenting neither Origin nor a same-origin fetch-metadata signal is rejected"
    );
    assert!(connect_with(&dp, Some(&good_origin), true).await.is_ok(), "the real client connects");
    dp.shutdown().await;
}

#[tokio::test]
async fn a_completed_stream_is_recorded_with_its_terminal_outcome() {
    let dp = start(factory(3, 512, 0)).await;
    let mut c = connect(&dp).await.expect("connect");
    send_start(&mut c).await;
    grant(&mut c, 10).await;
    let r = drain(&mut c).await;
    assert_eq!(r.terminal.unwrap().0, wire::TERM_COMPLETED);

    // The producer never initiates the close: after its terminal frame it waits for the consumer.
    // So the stream is not finished server-side until the client closes — which is the behaviour
    // that stops a server-initiated close from racing frames still in the peer's receive path, and
    // is why this test closes before asserting.
    assert!(dp.registry.terminals().is_empty(), "the producer is still waiting for the peer");
    c.close(None).await.ok();

    let recorded = tokio::time::timeout(Duration::from_secs(3), async {
        loop {
            if !dp.registry.terminals().is_empty() {
                return dp.registry.terminals();
            }
            tokio::time::sleep(Duration::from_millis(10)).await;
        }
    })
    .await
    .expect("the terminal outcome is recorded once the peer closes");

    assert_eq!(recorded.len(), 1);
    assert_eq!(recorded[0].1, Terminal::Completed);
    dp.shutdown().await;
}

#[tokio::test]
async fn a_batch_over_the_declared_frame_ceiling_terminates_with_the_ceiling_named() {
    // ADR-010 rule 6 again, on the branch that had no test at all. `pump.rs` claims the frame
    // ceiling is "declared, and then actually enforced at the limit" — but nothing drove a payload
    // past it, so the enforcement arm had never executed. The bake-off had this coverage
    // (`web/src/regression.test.ts` sets a 1 KiB ceiling); it was not carried over with the rest.
    //
    // A ceiling nothing has ever crossed is a constant, not a ceiling.
    let f = factory(4, spatial_data_plane::MAX_FRAME_BYTES + 1, 0);
    let dp = start(f.clone()).await;
    let mut c = connect(&dp).await.expect("connect");

    send_start(&mut c).await;
    grant(&mut c, 4).await;

    let mut terminal: Option<(u8, String)> = None;
    let mut batches = 0;
    while let Some(Message::Binary(b)) =
        recv_by(&mut c, "a terminal naming the frame ceiling").await
    {
        match b[0] {
            wire::TAG_BATCH => batches += 1,
            wire::TAG_TERMINAL => {
                let payload = &b[wire::FRAME_PREFIX_LEN..];
                terminal =
                    Some((payload[0], String::from_utf8_lossy(&payload[1..]).into_owned()));
                break;
            }
            _ => {}
        }
    }

    let (code, detail) = terminal.expect("an over-ceiling batch must produce a terminal frame");
    assert_eq!(code, wire::TERM_PRODUCER_FAILED, "detail was: {detail}");
    assert!(
        detail.contains("frame ceiling") && detail.contains(&spatial_data_plane::MAX_FRAME_BYTES.to_string()),
        "the terminal must name the ceiling it hit, got: {detail}"
    );
    assert_eq!(batches, 0, "no over-ceiling batch may reach the consumer");

    c.close(None).await.ok();
    dp.shutdown().await;
}

#[tokio::test]
async fn an_idle_connection_holds_no_stream_slot_and_the_idle_ceiling_is_its_own() {
    // **What makes pre-warming a latency change rather than an admission-policy change.** A spare
    // is authenticated and idle; it must not consume `MAX_CONCURRENT_STREAMS`, or holding sockets
    // ready would starve the streams they exist to serve — and choosing how streams share capacity
    // is the question ADR-014 is reserved for, which this must not decide by accident.
    let f = factory(4, 4096, 0);
    let dp = start(f.clone()).await;

    // Fill the idle ceiling with connections that never start anything.
    let mut spares = Vec::new();
    for _ in 0..spatial_data_plane::server::MAX_IDLE_CONNECTIONS {
        spares.push(connect(&dp).await.expect("spare connects"));
    }

    // Streams are entirely unaffected: a full spare pool leaves stream capacity untouched.
    let mut c = connect(&dp).await.expect("connect");
    send_start(&mut c).await;
    grant(&mut c, 10).await;
    let r = drain(&mut c).await;
    assert_eq!(r.batches, 4, "idle spares must not consume stream capacity");
    assert_eq!(r.terminal.unwrap().0, wire::TERM_COMPLETED);

    // …and a connection *beyond* the ceiling that starts an operation immediately is served
    // normally. The ceiling bounds loitering, not connecting: refusing here would have starved the
    // streams pre-warming exists to serve, which is what the first version of this did.
    let mut over = connect(&dp).await.expect("the socket opens");
    send_start(&mut over).await;
    grant(&mut over, 10).await;
    let served = drain(&mut over).await;
    assert_eq!(served.batches, 4, "a crowded-pool connection that starts work is still served");

    for mut s in spares {
        s.close(None).await.ok();
    }
    c.close(None).await.ok();
    dp.shutdown().await;
}
