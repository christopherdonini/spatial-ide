// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **R-a** — `engine/SOURCE-WATCHER-PREREGISTRATION.md`'s round 21 item 1, rider (a):
//! [`spatial_skp::v0::SessionRef`] routes only the end event and attributes no ticket. Its own
//! doc comment states the shape this test proves (paraphrased): no command's request type accepts
//! it, it authorizes nothing and is never looked up, and its only reads are the transition report
//! and the event.

mod watch_support;

use std::sync::Arc;
use std::time::Duration;

use spatial_engine::fixture::{write_geoparquet, FixtureSpec};
use spatial_kernel::skp::{session_end_channel, SkpHost, StreamRegistry, TicketLiveness};
use spatial_kernel::Catalog;
use spatial_skp::v0::{
    CancelRequest, CloseDatasetRequest, DatasetHandle, DescribeRequest, OpenDatasetRequest,
    SessionRef, ViewportQueryRequest, SKP_VERSION,
};

fn dir() -> std::path::PathBuf {
    let d = std::path::PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../target/fixtures/session-reference");
    std::fs::create_dir_all(&d).expect("fixture dir");
    d
}

fn fixture(name: &str) -> std::path::PathBuf {
    let path = dir().join(format!("{name}.parquet"));
    write_geoparquet(&path, &FixtureSpec { features: 20, avg_vertices: 5, hole_every: 0, ..Default::default() })
        .expect("write fixture");
    path
}

fn touch_modification_time(path: &std::path::Path) {
    let later = std::time::SystemTime::now() + Duration::from_secs(120);
    std::fs::File::options()
        .write(true)
        .open(path)
        .expect("reopen to touch mtime")
        .set_modified(later)
        .expect("touch mtime");
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

fn viewport_req(dataset: DatasetHandle) -> ViewportQueryRequest {
    ViewportQueryRequest { skp: SKP_VERSION.to_string(), dataset, bbox: None, bbox_crs: None, limit: None, filter: None }
}

/// **The whole rider, in one test**: a ticket's liveness answers from the ticket, before and after
/// the end (never from the `SessionRef`, which no request type accepts and no lookup ever consults);
/// the end event carries the open's own reference; and each of the five request types, with a
/// `session` member spliced onto its own valid JSON, fails to decode — proving no accidental default
/// or optional field silently admits it anywhere on the wire today.
///
/// RECORDED MUTATION: add `#[serde(default)] session: Option<SessionRef>` to `ViewportQueryRequest`
/// (`protocol/skp/src/v0/commands.rs`). Expected failure: only the `ViewportQueryRequest` case in
/// the five-request loop below stops failing (`from_value` now succeeds), which is exactly what the
/// per-request loop is built to catch — the other four still correctly fail.
#[test]
fn the_session_reference_routes_only_the_end_event_and_attributes_no_ticket() {
    let path = fixture("r-a");
    let (tx, rx) = session_end_channel();
    let host = SkpHost::new(
        Arc::new(Catalog::new()),
        StreamRegistry::new(),
        watch_support::no_watch_arm(),
        tx,
    );
    let open = host.open_dataset(open_req(&path, "r-a")).expect("open");
    let ticket = host.viewport_query(viewport_req(open.dataset.clone())).expect("mint a ticket");

    // Before the end: the ticket answers `Live` — from the ticket's own attribution, never from the
    // `SessionRef` (this test never gives the registry the reference to look anything up with).
    assert_eq!(host.generations().ticket_liveness(ticket.stream.as_str()), TicketLiveness::Live);

    touch_modification_time(&path);
    host.end_generation(open.dataset.as_str());

    // After the end: the SAME ticket handle now answers the typed reason — attribution is by
    // handle, not by reference.
    assert_eq!(
        host.generations().ticket_liveness(ticket.stream.as_str()),
        TicketLiveness::EndedBySourceChange
    );

    // The event is this reference's only carrier.
    let event = rx.recv_timeout(Duration::from_secs(5)).expect("one event");
    assert_eq!(event.session, open.session);
    assert!(rx.recv_timeout(Duration::from_millis(200)).is_err(), "exactly one event");

    // No command's request type accepts a `session` member — each of the five, valid otherwise,
    // fails to decode once one is spliced on.
    let session_value = serde_json::to_value(SessionRef::mint()).expect("SessionRef serializes bare");

    let mut open_value = serde_json::to_value(open_req(&path, "r-a-splice")).expect("serialize");
    open_value.as_object_mut().unwrap().insert("session".to_string(), session_value.clone());
    assert!(
        serde_json::from_value::<OpenDatasetRequest>(open_value).is_err(),
        "OpenDatasetRequest must refuse a spliced-on `session` member"
    );

    let mut describe_value = serde_json::to_value(DescribeRequest {
        skp: SKP_VERSION.to_string(),
        dataset: open.dataset.clone(),
    })
    .expect("serialize");
    describe_value.as_object_mut().unwrap().insert("session".to_string(), session_value.clone());
    assert!(
        serde_json::from_value::<DescribeRequest>(describe_value).is_err(),
        "DescribeRequest must refuse a spliced-on `session` member"
    );

    let mut viewport_value =
        serde_json::to_value(viewport_req(open.dataset.clone())).expect("serialize");
    viewport_value.as_object_mut().unwrap().insert("session".to_string(), session_value.clone());
    assert!(
        serde_json::from_value::<ViewportQueryRequest>(viewport_value).is_err(),
        "ViewportQueryRequest must refuse a spliced-on `session` member"
    );

    let mut cancel_value = serde_json::to_value(CancelRequest {
        skp: SKP_VERSION.to_string(),
        handle: ticket.stream.as_str().to_string(),
    })
    .expect("serialize");
    cancel_value.as_object_mut().unwrap().insert("session".to_string(), session_value.clone());
    assert!(
        serde_json::from_value::<CancelRequest>(cancel_value).is_err(),
        "CancelRequest must refuse a spliced-on `session` member"
    );

    let mut close_value =
        serde_json::to_value(CloseDatasetRequest { skp: SKP_VERSION.to_string(), dataset: open.dataset })
            .expect("serialize");
    close_value.as_object_mut().unwrap().insert("session".to_string(), session_value);
    assert!(
        serde_json::from_value::<CloseDatasetRequest>(close_value).is_err(),
        "CloseDatasetRequest must refuse a spliced-on `session` member"
    );
}
