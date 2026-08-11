// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **H1–H7, carried forward from the bake-off as permanent integration tests of the slice.**
//!
//! The bake-off's seven hard requirements were pass/fail gates for a measurement. They are kept here
//! as tests because a gate that only ran once is a claim about a commit, not a property of the
//! system. What changed: the payload is now **real variable-width GeoArrow read from a GeoParquet
//! file through DuckDB**, not a synthetic fixed-width generator, so every one of them is being asked
//! of the thing that will actually ship.
//!
//! Both ends run in this process, deliberately: a producer-side observation and a client-side one
//! are then on the **same clock**, so H2 needs no clock-relation bound and claims none. The bake-off
//! needed one because its consumer was a browser.
//!
//! **All comparisons here are within-session.** README §21 Q1 / §22.1: the machine drifts between
//! sessions, asymmetrically, so a ratio does not cancel it. Nothing in this file compares against a
//! number recorded in another session, and the evidence artifact records a per-session canary so a
//! future reader can see whether the machine was itself.

use std::sync::atomic::Ordering;
use std::sync::Arc;
use std::time::{Duration, Instant};

use arrow::array::{Array, FixedSizeListArray, Float64Array, ListArray, UInt64Array};
use futures_util::{SinkExt, StreamExt};
use spatial_data_plane::server::DataPlaneConfig;
use spatial_data_plane::session::SUBPROTOCOL;
use spatial_data_plane::{wire, RunningDataPlane};
use spatial_engine::fixture::{write_geoparquet, FixtureFacts, FixtureSpec};
use spatial_kernel::{Catalog, EngineSourceFactory, StreamParams, OPERATION};
use tokio_tungstenite::tungstenite::client::IntoClientRequest;
use tokio_tungstenite::tungstenite::Message;

const DATASET: &str = "parcels";

fn fixture(name: &str, features: usize) -> (std::path::PathBuf, FixtureFacts) {
    let dir = std::path::PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../target/fixtures");
    std::fs::create_dir_all(&dir).expect("fixture dir");
    let path = dir.join(format!("e2e-{name}.parquet"));
    let facts = write_geoparquet(
        &path,
        &FixtureSpec { features, avg_vertices: 24, hole_every: 7, ..Default::default() },
    )
    .expect("write fixture");
    (path, facts)
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

type Client =
    tokio_tungstenite::WebSocketStream<tokio_tungstenite::MaybeTlsStream<tokio::net::TcpStream>>;

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

async fn start(c: &mut Client, params: StreamParams) {
    let f = wire::frame(wire::TAG_START, &wire::start_payload(OPERATION, &params.encode()));
    c.send(Message::Binary(f.into())).await.expect("start");
}

async fn grant(c: &mut Client, n: u32) {
    let f = wire::frame(wire::TAG_CREDIT, &n.to_be_bytes());
    c.send(Message::Binary(f.into())).await.expect("credit");
}

async fn cancel(c: &mut Client) {
    let f = wire::frame(wire::TAG_CANCEL, &[]);
    c.send(Message::Binary(f.into())).await.expect("cancel");
}

fn params(bbox: Option<[f64; 4]>) -> StreamParams {
    StreamParams {
        dataset: DATASET.into(),
        bbox,
        bbox_crs: bbox.map(|_| "EPSG:2056".to_string()),
        limit: None,
    }
}

/// Wait until a counter stops moving, and return where it stopped.
///
/// A backpressured producer works ahead into its window and *then* stops, so sampling once after an
/// arbitrary delay reads a value mid-climb. Consecutive equal readings are what distinguish "it has
/// stopped" from "it has not got there yet"; a producer that never stops never plateaus.
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

#[derive(Default, Debug)]
struct Collected {
    batches: usize,
    rows: usize,
    vertices: usize,
    payload_bytes: usize,
    coord_bits: u64,
    ids: Vec<u64>,
    terminal: Option<(u8, String)>,
    progress: Vec<(u64, u64, u64)>,
    envelopes: Vec<(String, String, String)>,
    /// Every binary message carried exactly one frame, so a batch payload sits at a fixed 8-byte
    /// aligned offset in the buffer the consumer receives. Checked against what arrived.
    one_frame_per_message: bool,
    ring_counts: std::collections::BTreeSet<usize>,
    vertex_counts: std::collections::BTreeSet<usize>,
    first_batch_at: Option<Instant>,
}

/// Decode one BATCH frame's payload and fold it into the collection.
fn absorb(c: &mut Collected, payload: &[u8]) {
    let mut rdr =
        arrow::ipc::reader::StreamReader::try_new(std::io::Cursor::new(payload), None).expect("ipc");
    let batch = rdr.next().expect("one batch").expect("decode");

    let md = batch.schema().metadata().clone();
    c.envelopes.push((
        md.get("frame").cloned().unwrap_or_default(),
        md.get("crs").cloned().unwrap_or_default(),
        md.get("axis_order").cloned().unwrap_or_default(),
    ));

    let ids = batch.column(0).as_any().downcast_ref::<UInt64Array>().expect("ids");
    c.ids.extend(ids.values().iter().copied());
    c.rows += batch.num_rows();

    let polys = batch.column(1).as_any().downcast_ref::<ListArray>().expect("polygons");
    for p in 0..polys.len() {
        let rings = polys.value(p);
        let rings = rings.as_any().downcast_ref::<ListArray>().expect("rings");
        c.ring_counts.insert(rings.len());
        for r in 0..rings.len() {
            let verts = rings.value(r);
            let verts = verts.as_any().downcast_ref::<FixedSizeListArray>().expect("vertices");
            c.vertex_counts.insert(verts.len());
            let flat = verts.values().as_any().downcast_ref::<Float64Array>().expect("xy");
            for v in 0..verts.len() {
                let x = flat.value(v * 2);
                let y = flat.value(v * 2 + 1);
                c.coord_bits ^= x.to_bits().rotate_left(1) ^ y.to_bits();
                c.vertices += 1;
            }
        }
    }
}

/// Generous upper bound on any single blocking wait in this suite.
///
/// **A test that can hang forever is itself a defect.** When a product regression stopped a
/// producer mid-stream, the equivalent unbounded loop in `protocol/data-plane`'s suite did not
/// fail — it blocked forever, took the binary down with `exit code 0xffffffff`, and named no
/// property. These streams read a real 2,000-feature GeoParquet through DuckDB, so the bound is set
/// well above any honest wait and can only fire on a genuine stall.
const RECV_DEADLINE: Duration = Duration::from_secs(60);

/// One receive, bounded. Panics with the waiting context rather than hanging.
async fn recv_by(client: &mut Client, what: &str) -> Option<Message> {
    match tokio::time::timeout(RECV_DEADLINE, client.next()).await {
        Ok(Some(Ok(m))) => Some(m),
        Ok(Some(Err(_))) | Ok(None) => None,
        Err(_) => panic!("timed out after {RECV_DEADLINE:?} waiting for {what}"),
    }
}

/// Read frames until the terminal arrives (or the connection ends).
async fn drain(client: &mut Client, c: &mut Collected) {
    c.one_frame_per_message = true;
    while let Some(msg) = recv_by(client, "a frame, or the connection to end").await {
        let Message::Binary(b) = msg else { continue };
        let len = wire::payload_len(&b).expect("length");
        let payload = &b[wire::FRAME_PREFIX_LEN..wire::FRAME_PREFIX_LEN + len];
        match b[0] {
            wire::TAG_OPEN => {}
            wire::TAG_BATCH => {
                if c.first_batch_at.is_none() {
                    c.first_batch_at = Some(Instant::now());
                }
                c.batches += 1;
                c.payload_bytes += payload.len();
                if b.len() != wire::FRAME_PREFIX_LEN + len {
                    c.one_frame_per_message = false;
                }
                absorb(c, payload);
            }
            wire::TAG_PROGRESS => {
                let g = |o: usize| u64::from_be_bytes(payload[o..o + 8].try_into().unwrap());
                c.progress.push((g(0), g(8), g(16)));
            }
            wire::TAG_TERMINAL => {
                c.terminal = Some((payload[0], String::from_utf8_lossy(&payload[1..]).to_string()));
                break;
            }
            other => panic!("unknown tag {other}"),
        }
    }
}

// ---------------------------------------------------------------------------------------------
// H1 — payload correctness
// ---------------------------------------------------------------------------------------------

#[tokio::test]
async fn h1_the_payload_that_arrives_is_the_payload_the_file_holds() {
    let (path, facts) = fixture("h1", 8_000);
    let dp = host(&path).await;

    let mut runs = Vec::new();
    for _ in 0..2 {
        let mut client = connect(&dp).await;
        start(&mut client, params(None)).await;
        grant(&mut client, 64).await;
        let mut c = Collected::default();
        drain(&mut client, &mut c).await;
        client.close(None).await.ok();
        runs.push(c);
    }

    for c in &runs {
        assert_eq!(c.terminal.as_ref().unwrap().0, wire::TERM_COMPLETED);
        assert_eq!(c.rows, facts.features, "every feature arrives");
        assert_eq!(c.vertices, facts.vertices, "every vertex arrives");
        assert_eq!(
            c.coord_bits, facts.coord_bits_xor,
            "coordinates are bit-identical from GeoParquet through DuckDB, WKB decode, GeoArrow, \
             IPC and the wire — no tolerance, no rounding"
        );

        let mut ids = c.ids.clone();
        ids.sort_unstable();
        ids.dedup();
        assert_eq!(ids.len(), facts.features, "ids are unique and complete");
        assert_eq!(*ids.first().unwrap(), 0);
        assert_eq!(*ids.last().unwrap(), facts.features as u64 - 1);

        // The CRS tag is on **every** batch envelope, not just the first (ADR-010 rule 1).
        assert_eq!(c.envelopes.len(), c.batches);
        for (frame, crs, axis) in &c.envelopes {
            assert_eq!(frame, "authoritative-project-crs");
            assert_eq!(crs, "EPSG:2056");
            assert_eq!(axis, "easting,northing");
        }

        // Real GeoArrow shape: holes exist and rings differ in length.
        assert!(c.ring_counts.contains(&2), "some features carry an interior ring");
        assert!(c.vertex_counts.len() > 1, "ring vertex counts vary — this is not fixed-width");

        // 8-byte payload framing, carried forward: one frame per message is what puts the payload
        // at a fixed, 8-byte aligned offset in the consumer's buffer. Asserted against the delivered
        // messages rather than against the constant.
        assert!(
            c.one_frame_per_message,
            "a message carried more or less than one frame; the payload offset is then not fixed"
        );
        assert_eq!(wire::FRAME_PREFIX_LEN % 8, 0);
    }

    assert_eq!(runs[0].coord_bits, runs[1].coord_bits, "identical across runs");
    assert_eq!(runs[0].rows, runs[1].rows);
    dp.shutdown().await;
}

#[tokio::test]
async fn h1_a_viewport_filter_selects_a_subset_and_it_still_decodes() {
    let (path, facts) = fixture("h1-viewport", 4_000);
    let dp = host(&path).await;

    let cols = (4_000f64).sqrt().ceil();
    let extent = cols * 40.0;
    let bbox = [
        spatial_engine::fixture::E_LO,
        spatial_engine::fixture::N_LO,
        spatial_engine::fixture::E_LO + extent / 2.0,
        spatial_engine::fixture::N_LO + extent / 2.0,
    ];

    let mut client = connect(&dp).await;
    start(&mut client, params(Some(bbox))).await;
    grant(&mut client, 64).await;
    let mut c = Collected::default();
    drain(&mut client, &mut c).await;

    assert_eq!(c.terminal.as_ref().unwrap().0, wire::TERM_COMPLETED);
    assert!(c.rows > 0 && c.rows < facts.features, "a strict subset: {} of {}", c.rows, facts.features);
    client.close(None).await.ok();
    dp.shutdown().await;
}

// ---------------------------------------------------------------------------------------------
// H2 — producer-visible cancellation
// ---------------------------------------------------------------------------------------------

#[tokio::test]
async fn h2_cancellation_is_observed_by_the_producer_inside_the_budget() {
    let (path, _) = fixture("h2", 60_000);
    let dp = host(&path).await;
    let mut client = connect(&dp).await;

    start(&mut client, params(None)).await;
    grant(&mut client, 2).await;

    // Wait until the stream is genuinely producing.
    let mut seen = 0;
    while let Some(Message::Binary(b)) = recv_by(&mut client, "the stream to start producing").await
    {
        if b[0] == wire::TAG_BATCH {
            seen += 1;
            if seen == 2 {
                break;
            }
        }
    }

    let sent_at = Instant::now();
    cancel(&mut client).await;
    let mut c = Collected::default();
    drain(&mut client, &mut c).await;
    let to_terminal = sent_at.elapsed();

    assert_eq!(c.terminal.as_ref().unwrap().0, wire::TERM_CANCELLED);

    let states = dp.registry.snapshot();
    let state = states.last().expect("one stream");
    let latency = state.observed_at().expect("producer observed the cancel").duration_since(sent_at);
    assert!(
        latency < Duration::from_millis(100),
        "producer observed cancellation after {latency:?}; docs/08 budget is 100 ms"
    );
    assert!(
        state.batches_after_cancel() <= 1,
        "at most one batch may be generated after cancellation is observed"
    );
    assert!(to_terminal < Duration::from_secs(5), "the stream ended in {to_terminal:?}");
    client.close(None).await.ok();
    dp.shutdown().await;
}

#[tokio::test]
async fn h2_a_cancel_before_the_first_batch_still_stops_the_query() {
    // The case a flag polled between batches cannot serve: a filter that scans before it emits.
    // docs/08's budget is "any operation", which includes one that has produced nothing.
    let (path, _) = fixture("h2-early", 60_000);
    let dp = host(&path).await;
    let mut client = connect(&dp).await;

    start(&mut client, params(None)).await;
    // No credit granted, so nothing can be written; cancel while the producer is still working.
    tokio::time::sleep(Duration::from_millis(50)).await;
    let sent_at = Instant::now();
    cancel(&mut client).await;

    let mut c = Collected::default();
    drain(&mut client, &mut c).await;

    assert_eq!(c.batches, 0, "nothing was ever delivered");
    assert_eq!(c.terminal.as_ref().unwrap().0, wire::TERM_CANCELLED);

    let states = dp.registry.snapshot();
    let state = states.last().expect("one stream");
    let latency = state.observed_at().expect("observed").duration_since(sent_at);
    assert!(latency < Duration::from_millis(100), "observed after {latency:?}");
    client.close(None).await.ok();
    dp.shutdown().await;
}

// ---------------------------------------------------------------------------------------------
// H3, H5, H7
// ---------------------------------------------------------------------------------------------

#[tokio::test]
async fn h3_a_consumer_that_withholds_credit_bounds_producer_memory() {
    let (path, _) = fixture("h3", 60_000);
    let dp = host(&path).await;
    let mut client = connect(&dp).await;

    start(&mut client, params(None)).await;

    // Wait for the producer to work ahead into its window and stop, rather than guessing how long
    // that takes.
    let plateau = wait_for_plateau(Duration::from_secs(20), 25, || {
        dp.registry.snapshot().last().map(|s| s.batches_generated()).unwrap_or(0)
    })
    .await
    .expect("a backpressured producer stops; this one never did");

    let states = dp.registry.snapshot();
    let state = states.last().expect("one stream");
    assert_eq!(state.bytes_emitted(), 0, "no credit, no bytes");

    let peak = state.peak_resident_bytes();
    let bound = (spatial_data_plane::MAX_INFLIGHT_BATCHES + 1) * spatial_data_plane::MAX_FRAME_BYTES;
    assert!(peak > 0, "the producer worked ahead into its declared window");
    assert!(peak <= bound, "producer-resident {peak} exceeded the declared bound {bound}");

    // **The assertion that can actually fail.** The byte bound above is 80 MB and this fixture's
    // whole payload is smaller than that, so a producer with backpressure entirely removed would
    // still pass it. The batch count cannot be satisfied that way: with no credit granted, the
    // declared window is all the producer may fill.
    assert!(
        plateau <= (spatial_data_plane::MAX_INFLIGHT_BATCHES + 1) as u64,
        "generated {plateau} batches with no credit granted; the window is {}",
        spatial_data_plane::MAX_INFLIGHT_BATCHES
    );
    client.close(None).await.ok();
    dp.shutdown().await;
}

#[tokio::test]
async fn h5_and_h7_no_json_on_the_data_path_and_progress_is_honest() {
    let (path, _) = fixture("h5", 3_000);
    let dp = host(&path).await;
    let mut client = connect(&dp).await;

    start(&mut client, params(None)).await;
    grant(&mut client, 64).await;
    let mut c = Collected::default();
    drain(&mut client, &mut c).await;

    assert_eq!(dp.json_frames_seen.load(Ordering::SeqCst), 0, "H5: zero JSON on the data path");
    assert!(!c.progress.is_empty(), "H7: progress is reported");
    assert!(
        c.progress.windows(2).all(|w| w[0].0 < w[1].0 && w[0].1 <= w[1].1),
        "progress counters are monotonic"
    );
    assert!(
        c.progress.iter().all(|p| p.2 == spatial_data_plane::UNKNOWN_TOTAL),
        "a streaming filter reports its total as unknown rather than inventing a denominator"
    );
    assert_eq!(c.terminal.as_ref().unwrap().0, wire::TERM_COMPLETED);
    client.close(None).await.ok();
    dp.shutdown().await;
}

#[tokio::test]
async fn h7_an_engine_refusal_arrives_as_a_typed_terminal_with_its_own_words() {
    // A dataset the host never opened. The refusal is a terminal frame, not a dropped connection —
    // and not a partial stream that looks complete.
    let (path, _) = fixture("h7", 500);
    let dp = host(&path).await;
    let mut client = connect(&dp).await;

    start(
        &mut client,
        StreamParams { dataset: "not-open".into(), bbox: None, bbox_crs: None, limit: None },
    )
    .await;
    let mut c = Collected::default();
    drain(&mut client, &mut c).await;

    let (code, detail) = c.terminal.expect("terminal frame");
    assert_eq!(code, wire::TERM_PRODUCER_FAILED);
    assert!(detail.contains("unknown dataset"), "{detail}");
    assert_eq!(c.batches, 0);
    client.close(None).await.ok();
    dp.shutdown().await;
}

#[tokio::test]
async fn a_viewport_in_the_wrong_crs_is_refused_end_to_end() {
    let (path, _) = fixture("crs", 500);
    let dp = host(&path).await;
    let mut client = connect(&dp).await;

    start(
        &mut client,
        StreamParams {
            dataset: DATASET.into(),
            bbox: Some([7.0, 46.0, 8.0, 47.0]),
            bbox_crs: Some("EPSG:4326".into()),
            limit: None,
        },
    )
    .await;
    let mut c = Collected::default();
    drain(&mut client, &mut c).await;

    let (code, detail) = c.terminal.expect("terminal frame");
    assert_eq!(code, wire::TERM_PRODUCER_FAILED);
    assert!(detail.contains("EPSG:4326"), "the refusal names both CRSs: {detail}");
    assert_eq!(c.batches, 0, "nothing is drawn in the wrong CRS, not even provisionally");
    client.close(None).await.ok();
    dp.shutdown().await;
}

// ---------------------------------------------------------------------------------------------
// H6 — no transport vocabulary anywhere it does not belong
// ---------------------------------------------------------------------------------------------

// H6's engine-side scan lives in `engine/tests/slice.rs`, next to the source it protects — each
// module asserts its own hygiene, symmetric with `protocol/data-plane/tests/no_transport_leakage.rs`
// scanning the neutral interface. It ran from here until it was noticed that a non-recursive
// `read_dir` would silently stop covering the engine the first time anyone added a subdirectory
// under `engine/src/`, which is a test that passes by looking at less.

#[test]
fn the_engine_does_not_depend_on_the_data_plane_or_the_other_way_round() {
    let engine = std::fs::read_to_string(
        std::path::Path::new(env!("CARGO_MANIFEST_DIR")).join("../engine/Cargo.toml"),
    )
    .expect("engine manifest");
    let protocol = std::fs::read_to_string(
        std::path::Path::new(env!("CARGO_MANIFEST_DIR")).join("../protocol/data-plane/Cargo.toml"),
    )
    .expect("protocol manifest");

    assert!(!engine.contains("spatial-data-plane"), "engine must not depend on the binding");
    assert!(!protocol.contains("spatial-engine"), "the binding must not depend on the engine");
}
