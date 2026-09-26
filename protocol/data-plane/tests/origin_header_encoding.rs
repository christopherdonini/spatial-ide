// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! §4 of `protocol/data-plane/ORIGIN-NON-ASCII-PREREGISTRATION.md`: a present `Origin` header whose
//! bytes are not visible ASCII must be refused the same way a stated foreign ASCII `Origin` already
//! is -- never silently read as absent and admitted on a forged `sec-fetch-site: same-origin` claim.
//!
//! Real `spatial_data_plane::serve` over a loopback socket, a real `tokio_tungstenite` client -- the
//! same shape `candidate_a.rs`'s `connect_with` and `kernel/tests/skp_admission.rs`'s `connect` use.
//! No stream is ever started here: every row in this file is decided at the WebSocket upgrade.

use std::sync::Arc;

use spatial_data_plane::server::DataPlaneConfig;
use spatial_data_plane::session::SUBPROTOCOL;
use spatial_data_plane::transport::{
    BatchMeta, BatchSource, CreatedSource, OpenRequest, SourceCancel, SourceFactory,
};
use spatial_data_plane::RunningDataPlane;
use tokio_tungstenite::tungstenite::client::IntoClientRequest;
use tokio_tungstenite::tungstenite::http::HeaderValue;

/// A source no test here ever reaches: every assertion is decided at the upgrade, before a START
/// frame could be sent.
struct Unreachable;

impl BatchSource for Unreachable {
    fn next_into(&mut self, _out: &mut Vec<u8>) -> Option<Result<BatchMeta, String>> {
        None
    }
}

struct NeverCalled;

impl SourceCancel for NeverCalled {
    fn cancel(&self) {}
}

struct UnreachableFactory;

impl SourceFactory for UnreachableFactory {
    fn create(&self, _request: &OpenRequest) -> Result<CreatedSource, String> {
        Ok((Box::new(Unreachable), Arc::new(NeverCalled)))
    }
}

async fn start(expected_origin: Option<String>) -> RunningDataPlane {
    spatial_data_plane::serve(DataPlaneConfig {
        factory: Arc::new(UnreachableFactory),
        static_dir: None,
        expected_origin,
    })
    .await
    .expect("serve")
}

/// `s`'s bytes with one byte outside UTF-8 (`0xFF`) appended -- H1's discriminator: `HeaderValue::
/// to_str` refuses this the same way it refuses valid-UTF-8 non-ASCII (H3: `HeaderValue::from_bytes`
/// itself accepts `0x80..=0xFF`, so this never panics building the request).
fn ascii_plus_invalid_byte(s: &str) -> Vec<u8> {
    let mut b = s.as_bytes().to_vec();
    b.push(0xFF);
    b
}

/// The shared helper (§2). Sends `origin_bytes` as the literal `Origin` header value -- `None` sends
/// no `Origin` header at all -- beside `sec-fetch-site: same-origin` and a valid `tok.` credential.
/// `Ok(())` on an admitted upgrade; `Err(status)` on `tungstenite::Error::Http` naming the refusal's
/// status. Any other error panics, so a client-side failure to construct or send the request can
/// never pass as a refusal.
async fn attempt(dp: &RunningDataPlane, origin_bytes: Option<&[u8]>) -> Result<(), u16> {
    let mut req = format!("ws://127.0.0.1:{}/stream", dp.addr.port())
        .into_client_request()
        .expect("a loopback ws:// URL always constructs");
    if let Some(bytes) = origin_bytes {
        req.headers_mut().insert(
            "origin",
            HeaderValue::from_bytes(bytes).expect("H3: 0x80..=0xFF constructs a HeaderValue"),
        );
    }
    req.headers_mut()
        .insert("sec-fetch-site", HeaderValue::from_static("same-origin"));
    req.headers_mut().insert(
        "sec-websocket-protocol",
        format!("{SUBPROTOCOL}, tok.{}", dp.session.token_for_delivery())
            .parse()
            .expect("the hex-encoded token is always a valid header value"),
    );
    match tokio_tungstenite::connect_async(req).await {
        Ok(_) => Ok(()),
        Err(tokio_tungstenite::tungstenite::Error::Http(resp)) => Err(resp.status().as_u16()),
        Err(e) => panic!("a non-HTTP error is not a refusal: {e}"),
    }
}

// Mutation (§4 T1): request_allowed's `Some(o)` arm in session.rs also admits `sec_fetch_site == Some("same-origin")`. Applied, run, reverted.
// Printed failure (observed at d445c86, rustc 1.97.1), by script, not retyped:
//     left: Ok(())
//    right: Err(403)
//   test result: FAILED. 0 passed; 1 failed; 0 ignored; 0 measured; 4 filtered out; finished in 0.01s
#[tokio::test(flavor = "multi_thread")]
async fn a_stated_foreign_ascii_origin_with_a_same_origin_claim_is_refused_as_an_origin() {
    // F1, the control: an ASCII foreign Origin is refused even under a forged same-origin claim,
    // establishing that `attempt`'s helper adds no rescue of its own before any non-ASCII byte is
    // involved.
    let dp = start(None).await;
    let result = attempt(&dp, Some(b"http://evil.example")).await;
    assert_eq!(result, Err(403));
    dp.shutdown().await;
}

// Mutation (§4 T2): the fix's refusal arm in server.rs fires only when the value is valid UTF-8; a non-UTF-8 value is read as `None` instead. Applied, run, reverted.
// Printed failure (observed at d445c86, rustc 1.97.1), by script, not retyped:
//     left: Ok(())
//    right: Err(403)
//     left: Ok(())
//    right: Err(403)
//   test result: FAILED. 3 passed; 2 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.02s
#[tokio::test(flavor = "multi_thread")]
async fn a_stated_origin_with_a_non_utf8_byte_is_refused_as_a_foreign_origin() {
    // F2, Finding A1-1's own reproduction: a present Origin with a byte `to_str` refuses used to be
    // read as `None` and admitted on the forged same-origin claim.
    let dp = start(None).await;
    let result = attempt(&dp, Some(&ascii_plus_invalid_byte("http://evil.example"))).await;
    assert_eq!(result, Err(403));
    dp.shutdown().await;
}

// Mutation (§4 T3): the fix's refusal arm in server.rs fires only when the value is NOT valid UTF-8; a valid-UTF-8 non-ASCII value is read as `None` instead. Applied, run, reverted.
// Printed failure (observed at d445c86, rustc 1.97.1), by script, not retyped:
//     left: Ok(())
//    right: Err(403)
//   test result: FAILED. 4 passed; 1 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.02s
#[tokio::test(flavor = "multi_thread")]
async fn a_stated_origin_with_a_utf8_non_ascii_character_is_refused_as_a_foreign_origin() {
    // F3: valid UTF-8, but not visible ASCII -- `to_str` refuses this too (H1), and it must be
    // refused the same way as F2's non-UTF-8 byte, not treated as a distinct, unhandled case.
    let dp = start(None).await;
    let result = attempt(&dp, Some("http://\u{e9}vil.example".as_bytes())).await;
    assert_eq!(result, Err(403));
    dp.shutdown().await;
}

// Mutation (§4 T4): the fix reverted -- the Origin read restored to `.and_then(|v| v.to_str().ok())`. Applied, run, reverted.
// Printed failure (observed at d445c86, rustc 1.97.1), by script, not retyped:
//     left: Ok(())
//    right: Err(403)
//     left: Ok(())
//    right: Err(403)
//     left: Ok(())
//    right: Err(403)
//   test result: FAILED. 2 passed; 3 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.02s
#[tokio::test(flavor = "multi_thread")]
async fn a_stated_non_ascii_origin_is_refused_under_a_host_declared_expected_origin() {
    // F4a and F4b: the same refusal holds once a host declares `expected_origin` (ADR-020) -- both
    // a foreign origin (F4a) and the *correct* declared origin (F4b), each with the same trailing
    // non-UTF-8 byte, are refused rather than rescued by a close-enough comparison.
    let dp = start(Some("http://localhost:5180".to_string())).await;
    let f4a = attempt(&dp, Some(&ascii_plus_invalid_byte("http://evil.example"))).await;
    assert_eq!(f4a, Err(403));
    let f4b = attempt(&dp, Some(&ascii_plus_invalid_byte("http://localhost:5180"))).await;
    assert_eq!(f4b, Err(403));
    dp.shutdown().await;
}

// Mutation (§4 T5): `upgrade` in server.rs returns 403 whenever the Origin header is absent. Applied, run, reverted.
// Printed failure (observed at d445c86, rustc 1.97.1), by script, not retyped:
//     left: Err(403)
//    right: Ok(())
//   test result: FAILED. 4 passed; 1 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.02s
#[tokio::test(flavor = "multi_thread")]
async fn an_absent_origin_with_a_same_origin_claim_is_still_admitted() {
    // F5: the fallback for a truly absent Origin (`request_allowed`'s `None` arm) must stay
    // untouched by the fix -- a present-but-unreadable Origin is refused (T2, T3), but a genuinely
    // absent one is still admitted on `sec-fetch-site: same-origin`.
    let dp = start(None).await;
    let result = attempt(&dp, None).await;
    assert_eq!(result, Ok(()));
    dp.shutdown().await;
}
