// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! Wave-1 audit reproducer (A1): a *stated* `Origin` whose bytes are not visible ASCII is treated as
//! an *absent* `Origin`.
//!
//! `server.rs::upgrade` reads the header with `.and_then(|v| v.to_str().ok())`, so a present header
//! that `HeaderValue::to_str` refuses (any obs-text byte, 0x80..=0xFF) becomes `None`, and
//! `Session::request_allowed(None, Some("same-origin"))` admits it. `session.rs`'s own contract is
//! "A stated `Origin` must match exactly", and docs/09 "Local listening sockets" states exact-match
//! `Origin` validation.
//!
//! The control case (the same foreign origin in plain ASCII) is refused, so the only variable is the
//! header's byte encoding. The token is valid in every case: this reproducer is about the origin
//! check alone, which docs/09 says is defence-in-depth, not the barrier against local processes.

use std::sync::Arc;

use spatial_data_plane::server::DataPlaneConfig;
use spatial_data_plane::session::SUBPROTOCOL;
use spatial_data_plane::transport::{BatchSource, OpenRequest, SourceCancel, SourceFactory};
use spatial_data_plane::RunningDataPlane;
use tokio_tungstenite::tungstenite::client::IntoClientRequest;
use tokio_tungstenite::tungstenite::http::HeaderValue;

struct NeverFactory;

impl SourceFactory for NeverFactory {
    fn create(
        &self,
        _request: &OpenRequest,
    ) -> Result<(Box<dyn BatchSource>, Arc<dyn SourceCancel>), String> {
        Err("this reproducer never starts an operation".to_string())
    }
}

async fn start(expected_origin: Option<String>) -> RunningDataPlane {
    spatial_data_plane::serve(DataPlaneConfig {
        factory: Arc::new(NeverFactory),
        static_dir: None,
        expected_origin,
    })
    .await
    .expect("serve")
}

/// `Ok(())` if the upgrade was admitted, `Err(detail)` if it was refused.
async fn upgrade_with_origin_bytes(dp: &RunningDataPlane, origin: &[u8]) -> Result<(), String> {
    let mut req = format!("ws://127.0.0.1:{}/stream", dp.addr.port())
        .into_client_request()
        .map_err(|e| e.to_string())?;
    req.headers_mut()
        .insert("origin", HeaderValue::from_bytes(origin).expect("obs-text is a legal header byte"));
    req.headers_mut().insert("sec-fetch-site", HeaderValue::from_static("same-origin"));
    req.headers_mut().insert(
        "sec-websocket-protocol",
        format!("{SUBPROTOCOL}, tok.{}", dp.session.token_for_delivery()).parse().unwrap(),
    );
    tokio_tungstenite::connect_async(req).await.map(|_| ()).map_err(|e| e.to_string())
}

#[tokio::test]
async fn control_a_foreign_ascii_origin_with_a_same_origin_claim_is_refused() {
    let dp = start(None).await;
    let r = upgrade_with_origin_bytes(&dp, b"http://evil.example").await;
    assert!(r.is_err(), "a stated foreign ASCII origin must be refused");
    dp.shutdown().await;
}

#[tokio::test]
async fn a_stated_non_ascii_origin_must_be_refused_like_any_other_foreign_origin() {
    let dp = start(None).await;
    // A stated, foreign origin carrying one obs-text byte.
    let r = upgrade_with_origin_bytes(&dp, b"http://evil.example\xff").await;
    assert!(
        r.is_err(),
        "a stated Origin that is not the expected one was ADMITTED because its bytes are not \
         visible ASCII (server.rs::upgrade's to_str().ok() turns it into an absent Origin)"
    );
    dp.shutdown().await;
}

#[tokio::test]
async fn the_same_holds_for_a_host_declared_origin_adr_020() {
    let dp = start(Some("http://localhost:5180".to_string())).await;
    let r = upgrade_with_origin_bytes(&dp, b"http://evil.example\xff").await;
    assert!(
        r.is_err(),
        "with expected_origin declared (ADR-020), a stated non-ASCII foreign Origin was ADMITTED"
    );
    dp.shutdown().await;
}
