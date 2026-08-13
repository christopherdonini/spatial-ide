// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **`cut/sql-filter` P4 — the cancellation property for a late-matching filtered scan.**
//!
//! **A separate binary from `skp_admission.rs` and `wire_bytes_invariant.rs`, on purpose.**
//! `engine::trace` is a single process-wide slot (see `skp_admission.rs`'s own module doc, which
//! already made this call for its one trace-using test); `skp_admission.rs` gained two more
//! `viewport_query`-with-filter tests in this same piece that do **not** use tracing, so they stay
//! there, but this test — the cancellation-property test, which does use tracing — gets its own
//! process so it can never race `skp_admission.rs`'s own `cancel_reaches_the_producer_directly_and_
//! is_observed_on_its_own_clock`. Helper functions below are duplicated from `skp_admission.rs`
//! rather than shared, following the convention already stated elsewhere in this cut
//! (`CUT-STATE.md`): this workspace's integration test binaries do not import code from one another.

use std::sync::Arc;
use std::time::Duration;

use futures_util::{SinkExt, StreamExt};
use spatial_data_plane::server::DataPlaneConfig;
use spatial_data_plane::{wire, RunningDataPlane};
use spatial_engine::fixture::{write_geoparquet, FixtureSpec};
use spatial_engine::trace::{self, TraceKey};
use spatial_kernel::skp::{SkpHost, StreamRegistry};
use spatial_kernel::{Catalog, EngineSourceFactory, OPERATION};
use spatial_skp::v0::{DatasetHandle, Filter, ViewportQueryRequest, FILTER_DIALECT_DUCKDB_EXPR_0, SKP_VERSION};
use tokio_tungstenite::tungstenite::client::IntoClientRequest;
use tokio_tungstenite::tungstenite::Message;

const RECV_DEADLINE: Duration = Duration::from_secs(60);

type Client =
    tokio_tungstenite::WebSocketStream<tokio_tungstenite::MaybeTlsStream<tokio::net::TcpStream>>;

fn dataset_handle() -> DatasetHandle {
    "ds_00000000000000000000000000000000".parse().unwrap()
}

fn fixture(name: &str, features: usize) -> std::path::PathBuf {
    let dir = std::path::PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../target/fixtures");
    std::fs::create_dir_all(&dir).expect("fixture dir");
    let path = dir.join(format!("skp-filter-cancel-{name}.parquet"));
    write_geoparquet(&path, &FixtureSpec { features, avg_vertices: 12, hole_every: 0, ..Default::default() })
        .expect("write fixture");
    path
}

fn duckdb_filter(predicate: &str) -> Filter {
    Filter::new(predicate, FILTER_DIALECT_DUCKDB_EXPR_0)
        .expect("the one admitted wire dialect must construct")
}

async fn connect(dp: &RunningDataPlane) -> Client {
    let mut req = format!("ws://127.0.0.1:{}/stream", dp.addr.port()).into_client_request().unwrap();
    req.headers_mut()
        .insert("origin", format!("http://127.0.0.1:{}", dp.addr.port()).parse().unwrap());
    req.headers_mut().insert(
        "sec-websocket-protocol",
        format!("{}, tok.{}", spatial_data_plane::session::SUBPROTOCOL, dp.session.token_for_delivery())
            .parse()
            .unwrap(),
    );
    tokio_tungstenite::connect_async(req).await.expect("connect").0
}

/// A known instrumentation-ordering race in `engine::cancel::CancelToken::cancel_inner`, not a
/// failure of cancellation reach — the exact same race `skp_admission.rs`'s own
/// `cancel_reaches_the_producer_directly_and_is_observed_on_its_own_clock` documents and retries
/// around; this is the same underlying code path (now with a `WHERE` clause attached), so it is
/// retried the same way here.
struct OrderingRaceObserved {
    requested_nanos: u64,
    observed_nanos: u64,
}

/// Cancellation property (brief evidence item F), for a **filtered** scan whose predicate matches
/// only very late in the physical file (`id` correlates with scan order — the fixture writer
/// assigns ids in ascending physical row order — so `id > <near max>` is DuckDB's own version of
/// "true only for high ids", not a hand-simulated slowdown). `NEXT-CUT.md` design essential 7 names
/// the shortfall this exercises: progress is data-plane-batches-only, so a caller has no batch to
/// wait for before deciding to cancel a selective, late-matching scan — this proves cancellation
/// still reaches and is observed by the producer even though no output may exist yet to prove the
/// stream had started. **REACHED, never timed** (ADR-018 §1): the assertions below are that the
/// engine's own `CANCELLATION_REQUESTED`/`PRODUCER_CANCELLED` trace instants exist at all, not how
/// long either took.
///
/// **This test found, and this piece fixed, two real gaps in `engine/src/stream.rs::produce`'s
/// `PRODUCER_CANCELLED` instrumentation.** For a highly selective, late-matching predicate, DuckDB's
/// own `stream_arrow` call (bind+execute in one step) or the first `arrow.next()` pull can do *all*
/// of the non-matching prefix's scanning inside one call — there is no chunk boundary for this
/// producer to check `cancel.is_cancelled()` between until a match is found, so DuckDB's own
/// interrupt (not a periodic flag check) is what actually stops it, surfacing as that one call's own
/// `Err` or panic. Neither of those two error paths stamped `PRODUCER_CANCELLED` before this piece;
/// only the three pre-existing checks (before the loop, before `stream_arrow`, and inside the row
/// loop) did, none of which this scenario ever reaches. Fixed by marking on both paths, conditional
/// on `cancel.is_cancelled()`, mirroring the pattern the three existing sites already use.
#[tokio::test(flavor = "multi_thread")]
async fn cancel_reaches_the_producer_during_a_late_matching_filtered_scan() {
    const ATTEMPTS: u32 = 5;
    for attempt in 1..=ATTEMPTS {
        match cancel_reaches_the_producer_during_a_late_matching_filtered_scan_once().await {
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
                 (last: requested {} ns, observed {} ns)",
                race.requested_nanos, race.observed_nanos
            ),
        }
    }
}

async fn cancel_reaches_the_producer_during_a_late_matching_filtered_scan_once(
) -> Result<(), OrderingRaceObserved> {
    const FEATURES: usize = 2_000_000;
    let path = fixture("late-match", FEATURES);
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
        label: "skp-filter-cancel".into(),
    })
    .expect("no other trace is running in this process");

    // True only for the last 100 of 200,000 ids -- "matches late" per the fixture writer's own
    // ascending physical id order, admitted structurally as a plain COMPARISON over a real column.
    let ticket = host
        .viewport_query(ViewportQueryRequest {
            skp: SKP_VERSION.to_string(),
            dataset: handle,
            bbox: None,
            bbox_crs: None,
            limit: None,
            filter: Some(duckdb_filter(&format!("id > {}", FEATURES - 100))),
        })
        .expect("viewport_query with a late-matching predicate");
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
    // Generous credit: nothing here is meant to be gated by backpressure -- the predicate itself
    // (not withheld credit) is what keeps output from arriving for a while.
    c.send(Message::Binary(wire::frame(wire::TAG_CREDIT, &u32::MAX.to_be_bytes()).into()))
        .await
        .expect("credit");

    // Wait for `TAG_OPEN`, not a `TAG_BATCH` -- design essential 7's own shortfall: a selective,
    // late-matching scan may emit no batch for a long time, so this cannot wait for one before
    // cancelling. `TAG_OPEN` is sent by `adapter_ws::drive` immediately once the ticket is
    // *redeemed* (`protocol/data-plane/src/adapter_ws.rs`), strictly before the query itself is ever
    // polled for a batch -- waiting for it (rather than a fixed sleep) is what makes `host.cancel`
    // deterministically land on the registry's `Redeemed` state, so it reaches the engine's real
    // `CancelToken` instead of racing ahead of redemption into `CancelledBeforeRedeem` (a real state,
    // asserted by a different test, but one that never touches the engine and so never stamps
    // `CANCELLATION_REQUESTED` at all -- not what this test is about).
    loop {
        let msg = tokio::time::timeout(RECV_DEADLINE, c.next())
            .await
            .expect("no timeout waiting for TAG_OPEN")
            .expect("a frame")
            .expect("not a transport error");
        let Message::Binary(b) = msg else { continue };
        if b.first() == Some(&wire::TAG_OPEN) {
            break;
        }
    }

    let outcome = host.cancel(spatial_skp::v0::CancelRequest {
        skp: SKP_VERSION.to_string(),
        handle: stream_handle.as_str().to_string(),
    });
    assert_eq!(outcome.unwrap().state, "requested");

    // Drain to a terminal, whatever it is -- some of the tail rows may have already been produced
    // and delivered before the cancel landed, or none may have; either is consistent with this
    // property. What matters is that a terminal is reached at all.
    loop {
        let msg = match tokio::time::timeout(RECV_DEADLINE, c.next()).await {
            Ok(Some(Ok(m))) => m,
            Ok(Some(Err(_))) | Ok(None) => break,
            Err(_) => panic!("timed out waiting for the terminal frame after cancel"),
        };
        let Message::Binary(b) = msg else { continue };
        if b.first() == Some(&wire::TAG_TERMINAL) {
            break;
        }
    }

    let trace = guard.trace();
    let requested = trace.first(trace::CANCELLATION_REQUESTED);
    let observed = trace.first(trace::PRODUCER_CANCELLED);
    drop(guard);

    let requested = requested.expect("cancel_requested must be stamped -- CancelToken::cancel() ran");
    let observed = observed.expect(
        "cancel_observed must be stamped -- the producer must notice the interrupt and stop, even \
         mid-scan on a predicate that has not matched anything yet (ADR-018 item 1)",
    );
    if observed.offset_nanos < requested.offset_nanos {
        return Err(OrderingRaceObserved {
            requested_nanos: requested.offset_nanos,
            observed_nanos: observed.offset_nanos,
        });
    }
    Ok(())
}
