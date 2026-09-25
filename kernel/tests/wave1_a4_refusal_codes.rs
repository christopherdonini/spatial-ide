// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **Wave-1 audit A4 reproducers — refusal codes lost on a path.** Evidence only; no product code
//! changes. Each test asserts the documented contract ("a refusal crossing a string keeps its typed
//! `"<code>: "` prefix" — SKP-V0.md's `skp/0.3` notes; `typed_terminal_codes.rs`) on a path that
//! test file does not cover, and **fails at baseline bb98f71** — the failure is the reproduction.
//!
//! No duration, no rate and no performance word appears in this file (ADR-018).

use std::path::PathBuf;
use std::sync::Arc;

use spatial_data_plane::transport::{OpenRequest, SourceFactory};
use spatial_engine::fixture::{write_geoparquet, FixtureSpec, IdentityMode};
use spatial_engine::{CancelToken, EngineError};
use spatial_kernel::permission::BoundaryError;
use spatial_kernel::publish::error::PublishError;
use spatial_kernel::skp::error_of;
use spatial_kernel::{Catalog, EngineSourceFactory, StreamParams, OPERATION};

fn fixture(name: &str) -> PathBuf {
    let dir = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../target/fixtures/wave1-a4");
    std::fs::create_dir_all(&dir).expect("fixture dir");
    let path = dir.join(format!("{name}.parquet"));
    write_geoparquet(
        &path,
        &FixtureSpec {
            features: 200,
            avg_vertices: 12,
            identity: IdentityMode::NativeUnique,
            ..Default::default()
        },
    )
    .expect("write fixture");
    path
}

/// The same parse `frontends/shell/src/publish/formatPublishRefusal.ts` applies, transcribed: a
/// `publish.<snake>` head before the first `": "` is a code, anything else is `publish-refused`.
fn shell_publish_code(message: &str) -> String {
    if let Some(i) = message.find(": ") {
        let head = &message[..i];
        if let Some(rest) = head.strip_prefix("publish.") {
            if !rest.is_empty()
                && rest.chars().all(|c| c.is_ascii_lowercase() || c.is_ascii_digit() || c == '_')
            {
                return head.to_string();
            }
        }
    }
    "publish-refused".to_string()
}

/// A4-1. The **execute** site: `frontends/shell/src-tauri/src/publish.rs:734` sends
/// `ExecuteOutcome::Refused { message: e.to_string() }` for a `BoundaryError`, and
/// `BoundaryError::Publish(e)`'s `Display` (`kernel/src/permission/boundary.rs:155`) is the bare
/// `PublishError` `Display` — no `refusal_detail()`. Reproduced on the exact expression.
#[test]
fn a4_1_an_execute_time_publish_refusal_keeps_its_code() {
    let cases = [
        PublishError::Cancelled,
        PublishError::DestinationExists { path: "out/bundle".into() },
        PublishError::CeilingExceeded { ceiling: "MAX_PUBLISH_PARTITIONS", limit: 1, saw: 2 },
    ];
    let mut lost = Vec::new();
    for e in cases {
        let code = e.code();
        // `publish.rs:734`: `Err(e) => ExecuteOutcome::Refused { message: e.to_string() }`.
        let message = BoundaryError::from(e).to_string();
        let parsed = shell_publish_code(&message);
        if parsed != code {
            lost.push(format!("{code} -> shell sees `{parsed}` from {message:?}"));
        }
    }
    assert!(lost.is_empty(), "execute-time publish refusals lost their code:\n{}", lost.join("\n"));
}

/// A4-2. Every `EngineError` reaching the publish surface collapses to one code, `publish.engine`
/// (`kernel/src/publish/error.rs:206`), and `Display` for `Engine(e)` is `{e}` (`:354`), so the
/// engine's own code (`error_of`'s table) appears nowhere in the string the shell receives.
#[test]
fn a4_2_an_engine_refusal_on_the_publish_surface_keeps_its_engine_code() {
    let cases = [
        EngineError::SourceChangedUnderPublish {
            pinned: "sha256:aa".into(),
            observed: "sha256:bb".into(),
            detected_by: "content hash re-read at publish start",
        },
        EngineError::AttributeUnpublishable { column: "c".into(), detail: "not in file".into() },
        EngineError::ConnectionsExhausted { class: "stream", capacity: 4 },
    ];
    let mut lost = Vec::new();
    for e in cases {
        let engine_code = error_of(&e).code;
        let detail = PublishError::from(e).refusal_detail();
        if !detail.contains(&engine_code) {
            lost.push(format!("{engine_code} -> {detail:?}"));
        }
    }
    assert!(lost.is_empty(), "engine codes lost behind `publish.engine`:\n{}", lost.join("\n"));
}

/// A4-3. The **pin** phase: `frontends/shell/src-tauri/src/publish.rs:1073` maps a non-cancel
/// `EngineError` from `Dataset::pin_content_observed` to `EnsurePinnedOutcome::Failed(e.to_string())`,
/// and `:417` sends that string as `PrepareOutcome::Refused`. Reproduced with a real pin failure
/// (the source removed after open), applying the exact same `to_string()`.
#[test]
fn a4_3_a_pin_phase_engine_refusal_keeps_a_code() {
    let path = fixture("pin-fails");
    let catalog = Catalog::new();
    catalog.open("d", &path, None).expect("open dataset");
    let ds = catalog.get("d").expect("dataset");
    std::fs::remove_file(&path).expect("remove source after open");

    let e = ds
        .pin_content_observed(&CancelToken::new(), None)
        .expect_err("pinning a removed source must refuse");
    let engine_code = error_of(&e).code;
    // `publish.rs:1073` then `:417`.
    let message = e.to_string();
    let parsed = shell_publish_code(&message);
    assert!(
        message.contains(&engine_code) || parsed != "publish-refused",
        "the pin-phase refusal `{engine_code}` reaches the shell with no code (parsed `{parsed}`): \
         {message:?}"
    );
}

/// A4-4. The **raw-params** data-plane admission (`EngineSourceFactory::new` /
/// `with_connection_reports`, installed by `kernel/src/main.rs:158`): a create-time engine refusal
/// leaves as `open_engine_stream(..).map_err(|e| e.to_string())` (`kernel/src/lib.rs:366`) and the
/// data plane sends it as the `TERM_PRODUCER_FAILED` detail (`protocol/data-plane/src/server.rs:388-399`)
/// — without the `terminal_detail_of` prefix a mid-stream refusal on the same path carries.
#[test]
fn a4_4_a_raw_params_create_time_refusal_keeps_its_code() {
    let path = fixture("raw-create-refuses");
    let catalog = Arc::new(Catalog::new());
    catalog.open("d", &path, None).expect("open dataset");
    let factory = EngineSourceFactory::new(catalog);

    // A viewport in a CRS other than the fixture's EPSG:2056 — a typed engine refusal at create.
    let params = StreamParams {
        dataset: "d".into(),
        bbox: Some([0.0, 0.0, 1.0, 1.0]),
        bbox_crs: Some("EPSG:4326".into()),
        limit: None,
    };
    let detail = match factory.create(&OpenRequest {
        operation: OPERATION.to_string(),
        params: params.encode(),
    }) {
        Ok(_) => panic!("a viewport in another CRS must be refused at create"),
        Err(d) => d,
    };
    assert!(
        detail.starts_with("engine.") && detail.contains(": "),
        "the create-time terminal detail carries no `engine.<code>: ` prefix: {detail:?}"
    );
}
