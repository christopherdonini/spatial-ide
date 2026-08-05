//! **In-situ instrumentation of the real concurrency pattern: a superseded query cancelled while
//! another stream keeps running.**
//!
//! ## What this is, and what it is not
//!
//! This is **hypothesis-forming, not a preregistered measurement**. The bake-off README §22.5
//! corrects its own N=2 mechanism diagnostic ("D1") to exactly that category, and the same label
//! binds here for the same reason: there is no preregistration, no counterbalanced block schedule,
//! no declared invalidator set, and no independent-session replication.
//!
//! Consequences, stated so a later reader cannot mistake this for evidence:
//!
//! - **It may not be cited in ADR-012 and may not re-open it.** ADR-012 open risk 1 re-opens only on
//!   "a properly accounted N=2 block", which means preregistered and admissible. This is neither.
//! - **It is raw material for the reserved ADR-014** (data-plane stream concurrency and admission
//!   control) — a question to design a measurement around, not an answer.
//! - **Every comparison is within-session.** README §21 Q1 / §22.1: the machine drifts between
//!   sessions and does so *asymmetrically*, so a ratio does not cancel it. The artifact carries a
//!   fixed, transport-insensitive **canary** so a future reader can see whether the machine was
//!   itself; §22.1 recommends exactly this instrument for any future phase.
//! - **No throughput claim is made or implied**, and nothing here is compared with any figure from
//!   any bake-off phase.
//!
//! ## Why this pattern
//!
//! It is what the hero slice does: a viewport moves, the query behind the old viewport is
//! superseded and cancelled, and the new one must not stall behind it. `docs/05` and `docs/06`
//! describe exactly this transient two-stream overlap, and ADR-012's own open risk 1 notes it "is
//! not a hypothetical configuration".

use std::sync::Arc;
use std::time::{Duration, Instant};

use futures_util::{SinkExt, StreamExt};
use spatial_data_plane::server::DataPlaneConfig;
use spatial_data_plane::session::SUBPROTOCOL;
use spatial_data_plane::{wire, RunningDataPlane};
use spatial_engine::fixture::{write_geoparquet, FixtureFacts, FixtureSpec};
use spatial_kernel::{Catalog, EngineSourceFactory, StreamParams, OPERATION};
use tokio_tungstenite::tungstenite::client::IntoClientRequest;
use tokio_tungstenite::tungstenite::Message;

/// Generous upper bound on any single blocking wait here.
///
/// **A test or instrument that can hang forever is itself a defect.** An unbounded receive
/// turned a stalled producer into a hung binary that exited `0xffffffff` and named nothing;
/// a deadline turns the same stall into a failure that says which wait it was. Set far above
/// any honest wait on these fixtures, so it can only fire on a genuine stall.
const RECV_DEADLINE: Duration = Duration::from_secs(60);

const DATASET: &str = "parcels";
const FEATURES: usize = 40_000;

type Client =
    tokio_tungstenite::WebSocketStream<tokio_tungstenite::MaybeTlsStream<tokio::net::TcpStream>>;

struct Run {
    batches: usize,
    rows: usize,
    bytes: usize,
    coord_bits: u64,
    terminal: Option<u8>,
    first_batch_ms: Option<f64>,
    completed_ms: f64,
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

async fn open_stream(dp: &RunningDataPlane, credit: u32) -> Client {
    let mut c = connect(dp).await;
    let p = StreamParams { dataset: DATASET.into(), bbox: None, bbox_crs: None, limit: None };
    let f = wire::frame(wire::TAG_START, &wire::start_payload(OPERATION, &p.encode()));
    c.send(Message::Binary(f.into())).await.expect("start");
    let g = wire::frame(wire::TAG_CREDIT, &credit.to_be_bytes());
    c.send(Message::Binary(g.into())).await.expect("credit");
    c
}

fn coord_bits_of(payload: &[u8]) -> (u64, usize) {
    use arrow::array::{Array, FixedSizeListArray, Float64Array, ListArray};
    let mut rdr =
        arrow::ipc::reader::StreamReader::try_new(std::io::Cursor::new(payload), None).expect("ipc");
    let batch = rdr.next().expect("batch").expect("decode");
    let polys = batch.column(1).as_any().downcast_ref::<ListArray>().expect("polygons");
    let mut acc = 0u64;
    for p in 0..polys.len() {
        let rings = polys.value(p);
        let rings = rings.as_any().downcast_ref::<ListArray>().expect("rings");
        for r in 0..rings.len() {
            let verts = rings.value(r);
            let verts = verts.as_any().downcast_ref::<FixedSizeListArray>().expect("vertices");
            let flat = verts.values().as_any().downcast_ref::<Float64Array>().expect("xy");
            for v in 0..verts.len() {
                acc ^= flat.value(v * 2).to_bits().rotate_left(1) ^ flat.value(v * 2 + 1).to_bits();
            }
        }
    }
    (acc, batch.num_rows())
}

/// Read a stream, absorbing every batch into `run`, until its terminal arrives or `stop_after`
/// batches have been taken. Resumable: the same `run` accumulates across calls, so a warm-up phase
/// and the final read are one accounting.
async fn pump(
    c: &mut Client,
    run: &mut Run,
    t0: Instant,
    credit_block: u32,
    stop_after: Option<usize>,
) {
    let mut since_grant = 0u32;
    loop {
        if let Some(n) = stop_after {
            if run.batches >= n {
                return;
            }
        }
        // Bounded, and loud on elapse. An unbounded wait here would turn a stalled producer into a
        // hung instrument that reports nothing — and this file's whole job is to *observe* a
        // concurrency pattern, so a silent stall is the one failure it must never have. The bound
        // is far above any honest wait on these fixtures.
        let msg = match tokio::time::timeout(RECV_DEADLINE, c.next()).await {
            Ok(Some(Ok(m))) => m,
            Ok(Some(Err(e))) => {
                eprintln!("stream ended with a transport error after {} batches: {e}", run.batches);
                break;
            }
            Ok(None) => {
                eprintln!("stream ended with no terminal after {} batches", run.batches);
                break;
            }
            Err(_) => panic!(
                "timed out after {RECV_DEADLINE:?} waiting for a frame ({} batches in)",
                run.batches
            ),
        };
        let Message::Binary(b) = msg else { continue };
        let len = wire::payload_len(&b).expect("len");
        let payload = &b[wire::FRAME_PREFIX_LEN..wire::FRAME_PREFIX_LEN + len];
        match b[0] {
            wire::TAG_BATCH => {
                if run.first_batch_ms.is_none() {
                    run.first_batch_ms = Some(t0.elapsed().as_secs_f64() * 1000.0);
                }
                run.batches += 1;
                run.bytes += payload.len();
                let (bits, rows) = coord_bits_of(payload);
                run.coord_bits ^= bits;
                run.rows += rows;
                since_grant += 1;
                if since_grant >= credit_block / 2 {
                    let g = wire::frame(wire::TAG_CREDIT, &since_grant.to_be_bytes());
                    let _ = c.send(Message::Binary(g.into())).await;
                    since_grant = 0;
                }
            }
            wire::TAG_TERMINAL => {
                run.terminal = Some(payload[0]);
                break;
            }
            _ => {}
        }
    }
    run.completed_ms = t0.elapsed().as_secs_f64() * 1000.0;
}

fn new_run() -> Run {
    Run {
        batches: 0,
        rows: 0,
        bytes: 0,
        coord_bits: 0,
        terminal: None,
        first_batch_ms: None,
        completed_ms: 0.0,
    }
}

/// A fixed, transport-insensitive workload timed once per session.
///
/// §22.1's recommendation, adopted: it converts "the machine drifts between sessions" from an
/// unbounded worry into something a reader can check. It touches no socket and no database.
///
/// **The iteration count is load-bearing.** At 40 M iterations this lands near 7–15 ms on the
/// reference machine — inside the CPU's own frequency-transition window, where consecutive readings
/// on an *idle* machine were measured disagreeing by up to 3x. A canary that noisy certifies
/// nothing and would flag a steady session as drifting. 400 M lands near 130 ms, where the
/// measured spread across a session was 5.5 %. Found by the `docs/08` measurement pass; see
/// `kernel/RESULTS.md`.
const CANARY_ITERATIONS: u64 = 400_000_000;

fn canary_ms() -> f64 {
    let t = Instant::now();
    let mut acc = 0u64;
    for i in 0..CANARY_ITERATIONS {
        acc = acc.wrapping_add(i.rotate_left(7) ^ 0x9e37_79b9_7f4a_7c15);
    }
    std::hint::black_box(acc);
    t.elapsed().as_secs_f64() * 1000.0
}

#[tokio::test(flavor = "multi_thread", worker_threads = 4)]
async fn superseded_query_cancel_while_a_second_stream_continues() {
    let dir = std::path::PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../target/fixtures");
    std::fs::create_dir_all(&dir).expect("fixture dir");
    let path = dir.join("concurrency.parquet");
    let facts: FixtureFacts = write_geoparquet(
        &path,
        &FixtureSpec { features: FEATURES, avg_vertices: 24, hole_every: 7, ..Default::default() },
    )
    .expect("fixture");

    let mut catalog = Catalog::new();
    catalog.open(DATASET, &path, None).expect("open");
    let dp = spatial_data_plane::serve(DataPlaneConfig {
        factory: Arc::new(EngineSourceFactory::new(catalog)),
        static_dir: None,
    })
    .await
    .expect("serve");

    let canary_before = canary_ms();

    // ---- S1: the sequential baseline. One stream, nothing else running. ----------------------
    let mut solo = open_stream(&dp, 8).await;
    let t_solo = Instant::now();
    let mut solo_run = new_run();
    pump(&mut solo, &mut solo_run, t_solo, 8, None).await;
    solo.close(None).await.ok();

    assert_eq!(solo_run.terminal, Some(wire::TERM_COMPLETED));
    assert_eq!(solo_run.rows, facts.features);
    assert_eq!(solo_run.coord_bits, facts.coord_bits_xor);

    // ---- S2: two streams overlap; the older one is superseded and cancelled. -----------------
    let mut superseded = open_stream(&dp, 8).await;
    let t_super = Instant::now();

    // Let the superseded stream get properly under way before the new one starts. The same
    // collector is used throughout, so nothing consumed here goes unaccounted.
    let mut super_run = new_run();
    pump(&mut superseded, &mut super_run, t_super, 8, Some(3)).await;

    let mut survivor = open_stream(&dp, 8).await;
    let t_survivor = Instant::now();

    // The canvas has what it needs from the new viewport; the old query is now waste.
    let mut survivor_run = new_run();
    pump(&mut survivor, &mut survivor_run, t_survivor, 8, Some(2)).await;

    let cancel_sent_at = Instant::now();
    let cf = wire::frame(wire::TAG_CANCEL, &[]);
    superseded.send(Message::Binary(cf.into())).await.expect("cancel");

    // Both are read to their terminals concurrently — the survivor must not be blocked by the
    // teardown of the stream that was cancelled.
    tokio::join!(
        pump(&mut superseded, &mut super_run, t_super, 8, None),
        pump(&mut survivor, &mut survivor_run, t_survivor, 8, None),
    );
    let cancel_to_terminal_ms = cancel_sent_at.elapsed().as_secs_f64() * 1000.0;

    superseded.close(None).await.ok();
    survivor.close(None).await.ok();

    let canary_after = canary_ms();

    // ---- What must hold regardless of any timing --------------------------------------------
    assert_eq!(super_run.terminal, Some(wire::TERM_CANCELLED), "the superseded stream is cancelled");
    assert_eq!(survivor_run.terminal, Some(wire::TERM_COMPLETED), "the survivor completes");
    assert_eq!(
        survivor_run.rows,
        facts.features,
        "the survivor delivers the whole result while its peer was cancelled underneath it"
    );
    assert_eq!(
        survivor_run.coord_bits, facts.coord_bits_xor,
        "a cancelled peer stream does not corrupt the surviving stream's payload"
    );
    assert!(
        super_run.rows < facts.features,
        "a cancelled stream is partial — and its terminal says so rather than looking complete"
    );

    let states = dp.registry.snapshot();
    assert_eq!(states.len(), 3, "three streams were served");
    let cancelled_state = &states[1];
    let cancel_observed_ms = cancelled_state
        .observed_at()
        .expect("the producer observed the cancel")
        .duration_since(cancel_sent_at)
        .as_secs_f64()
        * 1000.0;
    assert!(
        cancel_observed_ms < 100.0,
        "producer observed cancellation after {cancel_observed_ms:.3} ms under concurrency"
    );
    assert!(cancelled_state.batches_after_cancel() <= 1);

    // ---- The record -------------------------------------------------------------------------
    let out_dir = std::path::PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../target/slice-evidence");
    std::fs::create_dir_all(&out_dir).expect("evidence dir");
    let artifact = out_dir.join("concurrency-in-situ.json");

    let json = format!(
        r#"{{
  "kind": "in-situ instrumentation",
  "status": "hypothesis-forming, NOT a preregistered measurement (bake-off README §22.5's D1 category)",
  "admissibility": "may not be cited in ADR-012 and may not re-open it; raw material for the reserved ADR-014",
  "comparison_scope": "within-session only (README §21 Q1 / §22.1) — no figure here may be compared with one from another session or another phase",
  "throughput_claim": "none made; no figure here is a transport throughput result",
  "profile": {{ "os": "Windows 10 Pro 22H2", "consumer": "in-process Rust client, not a browser", "note": "the WebView2 receive path §20.8 diagnosed by elimination is NOT exercised here" }},
  "canary_ms": {{ "before": {canary_before:.3}, "after": {canary_after:.3}, "iterations": {CANARY_ITERATIONS}, "purpose": "fixed transport-insensitive workload; if these two disagree, the session itself moved" }},
  "fixture": {{ "features": {}, "vertices": {}, "rings": {}, "bytes": {} }},
  "s1_sequential": {{ "batches": {}, "rows": {}, "bytes": {}, "first_batch_ms": {:.3}, "completed_ms": {:.3} }},
  "s2_overlapped": {{
    "superseded": {{ "batches": {}, "rows": {}, "bytes": {}, "first_batch_ms": {:.3}, "terminal": "Cancelled" }},
    "survivor": {{ "batches": {}, "rows": {}, "bytes": {}, "first_batch_ms": {:.3}, "completed_ms": {:.3}, "terminal": "Completed" }},
    "cancel_observed_producer_side_ms": {cancel_observed_ms:.3},
    "cancel_to_terminal_ms": {cancel_to_terminal_ms:.3},
    "batches_generated_after_cancel": {}
  }},
  "questions_for_adr_014": [
    "Does a superseded stream's teardown delay the survivor, and by how much, on a preregistered schedule?",
    "Is the admission slot released early enough that a viewport change never queues behind a cancelled query?",
    "Does the N=2 inversion recorded in bake-off §20.8 reproduce on a browser consumer with this payload shape?"
  ]
}}
"#,
        facts.features,
        facts.vertices,
        facts.rings,
        facts.bytes,
        solo_run.batches,
        solo_run.rows,
        solo_run.bytes,
        solo_run.first_batch_ms.unwrap_or(f64::NAN),
        solo_run.completed_ms,
        super_run.batches,
        super_run.rows,
        super_run.bytes,
        super_run.first_batch_ms.unwrap_or(f64::NAN),
        survivor_run.batches,
        survivor_run.rows,
        survivor_run.bytes,
        survivor_run.first_batch_ms.unwrap_or(f64::NAN),
        survivor_run.completed_ms,
        cancelled_state.batches_after_cancel(),
    );
    std::fs::write(&artifact, json).expect("write artifact");
    println!("in-situ concurrency record: {}", artifact.display());

    dp.shutdown().await;
}

#[tokio::test(flavor = "multi_thread", worker_threads = 4)]
async fn the_admission_slot_is_released_when_the_stream_ends_not_when_the_peer_leaves() {
    // ADR-014 is reserved for admission *policy*; this asserts only the mechanical property the
    // bake-off already fixed: a capacity slot is not held across the peer's shutdown, or the
    // declared ceiling becomes a function of client timing rather than of load.
    let dir = std::path::PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../target/fixtures");
    std::fs::create_dir_all(&dir).expect("dir");
    let path = dir.join("admission.parquet");
    write_geoparquet(&path, &FixtureSpec { features: 1_000, ..Default::default() }).expect("fixture");

    let mut catalog = Catalog::new();
    catalog.open(DATASET, &path, None).expect("open");
    let dp = spatial_data_plane::serve(DataPlaneConfig {
        factory: Arc::new(EngineSourceFactory::new(catalog)),
        static_dir: None,
    })
    .await
    .expect("serve");

    // Fill every slot, read each stream to its terminal, but never close the connections.
    let mut held = Vec::new();
    for _ in 0..spatial_data_plane::MAX_CONCURRENT_STREAMS {
        let mut c = open_stream(&dp, 64).await;
        let t = Instant::now();
        let mut run = new_run();
        pump(&mut c, &mut run, t, 64, None).await;
        assert_eq!(run.terminal, Some(wire::TERM_COMPLETED));
        held.push(c); // deliberately left open: the point is that a finished-but-open peer keeps no slot
    }

    // A new stream must still be admitted: the slots belong to streams, not to connections.
    let mut extra = open_stream(&dp, 64).await;
    let t = Instant::now();
    let mut run = new_run();
    tokio::time::timeout(Duration::from_secs(30), pump(&mut extra, &mut run, t, 64, None))
        .await
        .expect("a new stream is admitted while finished peers linger");
    assert_eq!(run.terminal, Some(wire::TERM_COMPLETED));
    assert_eq!(dp.registry.refusals(), 0);

    extra.close(None).await.ok();
    for mut c in held {
        c.close(None).await.ok();
    }
    dp.shutdown().await;
}
