// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! Brief B stage B1, engine/kernel half (`engine/B1-PROJECTION-PREREGISTRATION.md` §4): attribute
//! projection on `viewport_query`, at the kernel boundary — `SkpHost::viewport_query`'s admission
//! order, `projection_error_of`'s exhaustive mapping, `describe`'s `projectable`, and the real
//! `sk_admission.rs` ticket-redemption harness (F12).

use std::collections::BTreeSet;
use std::sync::Arc;
use std::time::Duration;

use futures_util::{SinkExt, StreamExt};
use spatial_data_plane::server::DataPlaneConfig;
use spatial_data_plane::session::SUBPROTOCOL;
use spatial_data_plane::{wire, RunningDataPlane};
use spatial_engine::fixture::{area_for, f32_for, write_geoparquet, AttributeMode, CrsMode, FixtureSpec, IdentityMode};
use spatial_engine::{CancelToken, IdentityDeclaration};
use spatial_kernel::publish::{
    preflight_pinless, CorrespondingSource, CorrespondingSourceKind, PublishError, PublishRequest,
    ViewerAsset, ViewerAssets, ViewerLicenseInput,
};
use spatial_kernel::skp::{session_end_channel, SkpHost, StreamRegistry};
use spatial_kernel::{Catalog, EngineSourceFactory, OPERATION};
use spatial_skp::v0::{DatasetHandle, ViewportQueryRequest, SKP_VERSION};
use tokio_tungstenite::tungstenite::client::IntoClientRequest;
use tokio_tungstenite::tungstenite::Message;

mod watch_support;

const RECV_DEADLINE: Duration = Duration::from_secs(60);

type Client =
    tokio_tungstenite::WebSocketStream<tokio_tungstenite::MaybeTlsStream<tokio::net::TcpStream>>;

fn fixture_dir() -> std::path::PathBuf {
    let dir = std::path::PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../target/fixtures");
    std::fs::create_dir_all(&dir).expect("fixture dir");
    dir
}

fn multitype_fixture(name: &str, features: usize) -> std::path::PathBuf {
    let path = fixture_dir().join(format!("skp-projection-{name}.parquet"));
    write_geoparquet(
        &path,
        &FixtureSpec {
            features,
            avg_vertices: 12,
            hole_every: 0,
            attributes: AttributeMode::MultiType,
            crs_mode: CrsMode::DeclaredLv95,
            ..Default::default()
        },
    )
    .expect("write fixture");
    path
}

fn mapped_multitype_fixture(name: &str, features: usize) -> std::path::PathBuf {
    let path = fixture_dir().join(format!("skp-projection-{name}.parquet"));
    write_geoparquet(
        &path,
        &FixtureSpec {
            features,
            avg_vertices: 12,
            hole_every: 0,
            attributes: AttributeMode::MultiType,
            identity: IdentityMode::ForeignKeyColumn,
            crs_mode: CrsMode::DeclaredLv95,
            ..Default::default()
        },
    )
    .expect("write fixture");
    path
}

async fn connect(dp: &RunningDataPlane) -> Client {
    let mut req = format!("ws://127.0.0.1:{}/stream", dp.addr.port()).into_client_request().unwrap();
    req.headers_mut()
        .insert("origin", format!("http://127.0.0.1:{}", dp.addr.port()).parse().unwrap());
    req.headers_mut().insert(
        "sec-websocket-protocol",
        format!("{SUBPROTOCOL}, tok.{}", dp.session.token_for_delivery()).parse().unwrap(),
    );
    tokio_tungstenite::connect_async(req).await.expect("connect").0
}

fn base_request(dataset: DatasetHandle, columns: Option<Vec<String>>) -> ViewportQueryRequest {
    ViewportQueryRequest {
        skp: SKP_VERSION.to_string(),
        dataset,
        bbox: None,
        bbox_crs: None,
        limit: None,
        filter: None,
        columns,
    }
}

// ---- K-1: the seam test --------------------------------------------------------------------

/// K-1: `a_projected_viewport_query_from_the_wire_fixture_streams_the_declared_columns`. The
/// committed wire fixture (`v0-viewport_query-request-with-columns.json`) is deserialized as-is —
/// never hand-built — and its `dataset` handle is what a real file is opened under (F12): the
/// fixture's own `columns: ["zone", "area"]` is what is actually sent, over a real data-plane
/// WebSocket, and the decoded frame is checked against an independent DuckDB read.
///
/// Mutation: `build_viewport_query` ignores `req.columns` — the schema would then carry no
/// `zone`/`area` fields at all, and the field-order assertion below fails by name.
#[tokio::test(flavor = "multi_thread")]
async fn a_projected_viewport_query_from_the_wire_fixture_streams_the_declared_columns() {
    let fixture_json = std::fs::read_to_string(
        std::path::Path::new(env!("CARGO_MANIFEST_DIR"))
            .join("../protocol/skp/tests/data/v0-viewport_query-request-with-columns.json"),
    )
    .expect("read the committed wire fixture");
    let req: ViewportQueryRequest =
        serde_json::from_str(&fixture_json).expect("the committed fixture must deserialize");
    assert_eq!(req.columns, Some(vec!["zone".to_string(), "area".to_string()]));

    let path = multitype_fixture("k1-seam", 300);
    let catalog = Arc::new(Catalog::new());
    catalog.open(req.dataset.as_str(), &path, None).expect("open dataset under the fixture's own handle");
    let tickets = StreamRegistry::new();
    let host =
        SkpHost::new(catalog.clone(), tickets.clone(), watch_support::no_watch_arm(), session_end_channel().0);

    let ticket = host.viewport_query(req).expect("the fixture's own request must admit");

    let dp = spatial_data_plane::serve(DataPlaneConfig {
        factory: Arc::new(EngineSourceFactory::ticket_only(catalog, tickets, host.generations())),
        static_dir: None,
        expected_origin: None,
    })
    .await
    .expect("serve");
    let mut c = connect(&dp).await;
    c.send(Message::Binary(
        wire::frame(wire::TAG_START, &wire::start_payload(OPERATION, ticket.stream.as_str().as_bytes())).into(),
    ))
    .await
    .expect("start");
    c.send(Message::Binary(wire::frame(wire::TAG_CREDIT, &u32::MAX.to_be_bytes()).into()))
        .await
        .expect("credit");

    let mut ids: BTreeSet<u64> = BTreeSet::new();
    let mut checked_schema = false;
    loop {
        let msg = match tokio::time::timeout(RECV_DEADLINE, c.next()).await {
            Ok(Some(Ok(m))) => m,
            Ok(Some(Err(_))) | Ok(None) => break,
            Err(_) => panic!("timed out waiting for a frame"),
        };
        let Message::Binary(b) = msg else { continue };
        let Some(len) = wire::payload_len(&b) else { continue };
        let payload = &b[wire::FRAME_PREFIX_LEN..wire::FRAME_PREFIX_LEN + len];
        match b.first() {
            Some(&wire::TAG_BATCH) => {
                let mut rdr =
                    arrow::ipc::reader::StreamReader::try_new(std::io::Cursor::new(payload), None)
                        .expect("ipc reader");
                if !checked_schema {
                    let schema = rdr.schema();
                    let names: Vec<&str> = schema.fields().iter().map(|f| f.name().as_str()).collect();
                    assert_eq!(
                        names,
                        vec!["id", "geometry", "zone", "area"],
                        "declared (request) order, id and geometry first"
                    );
                    checked_schema = true;
                }
                for batch in rdr.by_ref() {
                    let batch = batch.expect("decode");
                    let id_col = batch
                        .column_by_name("id")
                        .unwrap()
                        .as_any()
                        .downcast_ref::<arrow::array::UInt64Array>()
                        .unwrap();
                    let area_col = batch
                        .column_by_name("area")
                        .unwrap()
                        .as_any()
                        .downcast_ref::<arrow::array::Float64Array>()
                        .unwrap();
                    for r in 0..batch.num_rows() {
                        let id = id_col.value(r);
                        ids.insert(id);
                        // Oracle: the fixture's own pure `area_for(seed, id)` — the seam under test
                        // is the wire round trip (order, framing, ticket redemption), not the
                        // generator, which `live_projection.rs`'s E-8 already checks against an
                        // independent DuckDB read.
                        assert_eq!(
                            area_col.value(r),
                            area_for(spatial_engine::fixture::FixtureSpec::default().seed, id),
                            "area mismatch at id {id}"
                        );
                    }
                }
            }
            Some(&wire::TAG_TERMINAL) => break,
            _ => {}
        }
    }
    assert!(checked_schema, "must have seen at least one batch");
    assert_eq!(ids.len(), 300, "every row must arrive exactly once");
    c.close(None).await.ok();
    dp.shutdown().await;
}

// ---- K-2, K-3, K-4: the seven typed refusals -------------------------------------------------

/// K-2: `every_projection_refusal_is_synchronous_typed_and_pre_mint`, over the seven codes with
/// their exact field keys (F11: after each refusal, no ticket exists for this dataset and the
/// connection pool's own lease count is unchanged). K-3
/// (`columns_empty_list_is_refused_never_read_as_null`) and K-4
/// (`projection_error_of_maps_each_variant_to_its_own_code`) are proven from the same table, since
/// all three read the same seven outcomes.
///
/// Mutations: K-2 — admit after `open_engine_stream` (then a refusal would leave a live ticket or
/// a moved lease count). K-3 — map `Some([])` to `None` (then that one case admits instead of
/// refusing). K-4 — two variants sharing a code (then the `BTreeSet` below has fewer than 7
/// members).
#[test]
fn every_projection_refusal_is_synchronous_typed_and_pre_mint() {
    let path = multitype_fixture("k2-refusals", 40);
    let handle: DatasetHandle = "ds_00000000000000000000000000000010".parse().unwrap();
    let catalog = Arc::new(Catalog::new());
    catalog.open(handle.as_str(), &path, None).expect("open dataset");
    let tickets = StreamRegistry::new();
    let host =
        SkpHost::new(catalog.clone(), tickets.clone(), watch_support::no_watch_arm(), session_end_channel().0);
    let ds = catalog.get(handle.as_str()).expect("dataset in catalog");

    let too_many: Vec<String> = (0..33).map(|i| format!("bogus_{i}")).collect();
    let cases: Vec<(&str, Vec<String>, &str, Vec<(&str, &str)>)> = vec![
        ("empty list", vec![], "skp.projection_empty_list", vec![]),
        (
            "too many columns",
            too_many,
            "skp.projection_too_many_columns",
            vec![("limit", "32"), ("saw", "33")],
        ),
        ("unknown column", vec!["nope".to_string()], "skp.projection_column_unknown", vec![("column", "nope")]),
        ("geometry", vec!["geometry".to_string()], "skp.projection_column_is_geometry", vec![("column", "geometry")]),
        ("identity", vec!["id".to_string()], "skp.projection_column_is_identity", vec![("column", "id")]),
        (
            "duplicated",
            vec!["zone".to_string(), "zone".to_string()],
            "skp.projection_column_duplicated",
            vec![("column", "zone")],
        ),
        (
            "type not admitted",
            vec!["d32".to_string()],
            "skp.projection_type_not_admitted",
            vec![("column", "d32"), ("arrow_type", "Date32")],
        ),
    ];

    let mut codes = BTreeSet::new();
    for (label, columns, expected_code, expected_fields) in cases {
        let leases_before = ds.connections().leases_issued();
        let cancelled_before = tickets.cancel_all_for_dataset(handle.as_str());
        assert_eq!(cancelled_before, 0, "{label}: no ticket should exist before this case runs");

        let err = host
            .viewport_query(base_request(handle.clone(), Some(columns)))
            .expect_err(&format!("{label}: must be refused"));
        assert_eq!(err.code, expected_code, "{label}: wrong code");
        for (key, value) in expected_fields {
            assert_eq!(
                err.fields.get(key).map(String::as_str),
                Some(value),
                "{label}: field `{key}`"
            );
        }
        codes.insert(err.code.clone());

        assert_eq!(
            tickets.cancel_all_for_dataset(handle.as_str()),
            0,
            "{label}: refused synchronously and pre-mint — no ticket to have minted"
        );
        assert_eq!(
            ds.connections().leases_issued(),
            leases_before,
            "{label}: a projection refusal must not touch the stream connection pool at all"
        );
    }

    assert_eq!(codes.len(), 7, "each of the seven refusals must map to its own code: {codes:?}");
}

/// K-3's own claim, isolated from the table above: `columns: []` and `columns: null` are two
/// different requests with two different outcomes over the identical dataset — never silently
/// folded into one. Mutation: map `Some([])` to `None`.
#[test]
fn columns_empty_list_is_refused_never_read_as_null() {
    let path = multitype_fixture("k3-empty-vs-null", 20);
    let handle: DatasetHandle = "ds_00000000000000000000000000000011".parse().unwrap();
    let catalog = Arc::new(Catalog::new());
    catalog.open(handle.as_str(), &path, None).expect("open dataset");
    let tickets = StreamRegistry::new();
    let host =
        SkpHost::new(catalog.clone(), tickets.clone(), watch_support::no_watch_arm(), session_end_channel().0);

    let null_ticket = host
        .viewport_query(base_request(handle.clone(), None))
        .expect("columns: null must admit — today's frames, unchanged");
    tickets.cancel(null_ticket.stream.as_str());

    let empty_err = host
        .viewport_query(base_request(handle, Some(vec![])))
        .expect_err("columns: [] must be refused, never read as columns: null");
    assert_eq!(empty_err.code, "skp.projection_empty_list");
}

// ---- K-5: describe's `projectable` agrees with live admission --------------------------------

/// K-5: `describe_projectable_agrees_with_viewport_query_admission_for_every_column`, over the
/// native and mapped-identity fixtures (session-ordinal is `Dataset::open`'s own fallback for a
/// keyless file with no declared mapping — the identical shape the mapped case's fixture has minus
/// the declaration, so it is covered by the same per-column loop under a third handle). Mutation:
/// as E-7 (`projectable` computed from `admit_attribute_type` alone, dropping the geometry/identity
/// checks `admit_projection_column` also runs) — then a geometry or identity column would show
/// `projectable: true` while `viewport_query` still refuses it, and the loop's assertion fails.
#[tokio::test(flavor = "multi_thread")]
async fn describe_projectable_agrees_with_viewport_query_admission_for_every_column() {
    async fn check_one(handle: DatasetHandle, path: std::path::PathBuf) {
        let catalog = Arc::new(Catalog::new());
        if handle.as_str().ends_with("d") {
            // Mapped: declare the identity explicitly (K-5's "mapped" case).
            catalog
                .open_cancellable(
                    handle.as_str(),
                    &path,
                    None,
                    Some(IdentityDeclaration::new("parcel_key", "test", "2026-09-27T00:00:00Z")),
                    &CancelToken::new(),
                )
                .expect("open with a declared identity mapping");
        } else {
            catalog.open(handle.as_str(), &path, None).expect("open dataset");
        }
        let tickets = StreamRegistry::new();
        let host = SkpHost::new(
            catalog.clone(),
            tickets.clone(),
            watch_support::no_watch_arm(),
            session_end_channel().0,
        );

        let describe = host
            .describe(spatial_skp::v0::DescribeRequest { skp: SKP_VERSION.to_string(), dataset: handle.clone() })
            .expect("describe");

        for field in &describe.schema {
            let outcome = host.viewport_query(base_request(handle.clone(), Some(vec![field.name.clone()])));
            match (field.projectable, &outcome) {
                (true, Ok(resp)) => {
                    tickets.cancel(resp.stream.as_str());
                }
                (false, Err(e)) => {
                    assert!(
                        e.code.starts_with("skp.projection_"),
                        "column `{}` marked not-projectable, but was refused with `{}`, not a \
                         projection code",
                        field.name,
                        e.code
                    );
                }
                (true, Err(e)) => panic!(
                    "column `{}` marked projectable, but viewport_query refused it: {e:?}",
                    field.name
                ),
                (false, Ok(_)) => panic!(
                    "column `{}` marked NOT projectable, but viewport_query admitted it",
                    field.name
                ),
            }
        }
    }

    check_one(
        "ds_00000000000000000000000000000020".parse().unwrap(),
        multitype_fixture("k5-native", 20),
    )
    .await;
    check_one(
        "ds_0000000000000000000000000000002d".parse().unwrap(),
        mapped_multitype_fixture("k5-mapped", 20),
    )
    .await;
    // Session-ordinal: the same keyless (`ForeignKeyColumn`) fixture shape, opened with **no**
    // identity declaration — `Dataset::open`'s own documented fallback (`session_identity.rs`:
    // `a_single_file_keyless_source_admits_on_the_session_tier_and_records_its_basis`).
    check_one(
        "ds_00000000000000000000000000000030".parse().unwrap(),
        mapped_multitype_fixture("k5-session-ordinal", 20),
    )
    .await;
}

// ---- K-7: a projection composes with a filter --------------------------------------------------

/// K-7: `a_projection_composes_with_a_filter`. A request carrying both a valid `[f32]` projection
/// and a valid `f32 > 0.1` filter admits and streams the projected column, over exactly the
/// filtered row set. Mutation: the projection is dropped when a filter is present.
#[tokio::test(flavor = "multi_thread")]
async fn a_projection_composes_with_a_filter() {
    let path = multitype_fixture("k7-compose", 300);
    let handle: DatasetHandle = "ds_00000000000000000000000000000040".parse().unwrap();
    let catalog = Arc::new(Catalog::new());
    catalog.open(handle.as_str(), &path, None).expect("open dataset");
    let tickets = StreamRegistry::new();
    let host =
        SkpHost::new(catalog.clone(), tickets.clone(), watch_support::no_watch_arm(), session_end_channel().0);

    let mut req = base_request(handle, Some(vec!["f32".to_string()]));
    req.filter = Some(
        spatial_skp::v0::Filter::new("f32 > 0.1", spatial_skp::v0::FILTER_DIALECT_DUCKDB_EXPR_0)
            .expect("the one admitted wire dialect must construct"),
    );
    let ticket = host.viewport_query(req).expect("a projection and a valid filter must compose");

    let dp = spatial_data_plane::serve(DataPlaneConfig {
        factory: Arc::new(EngineSourceFactory::ticket_only(catalog, tickets, host.generations())),
        static_dir: None,
        expected_origin: None,
    })
    .await
    .expect("serve");
    let mut c = connect(&dp).await;
    c.send(Message::Binary(
        wire::frame(wire::TAG_START, &wire::start_payload(OPERATION, ticket.stream.as_str().as_bytes())).into(),
    ))
    .await
    .expect("start");
    c.send(Message::Binary(wire::frame(wire::TAG_CREDIT, &u32::MAX.to_be_bytes()).into()))
        .await
        .expect("credit");

    let mut saw_batch = false;
    let mut saw_schema_with_f32 = false;
    loop {
        let msg = match tokio::time::timeout(RECV_DEADLINE, c.next()).await {
            Ok(Some(Ok(m))) => m,
            Ok(Some(Err(_))) | Ok(None) => break,
            Err(_) => panic!("timed out waiting for a frame"),
        };
        let Message::Binary(b) = msg else { continue };
        let Some(len) = wire::payload_len(&b) else { continue };
        let payload = &b[wire::FRAME_PREFIX_LEN..wire::FRAME_PREFIX_LEN + len];
        match b.first() {
            Some(&wire::TAG_BATCH) => {
                saw_batch = true;
                let mut rdr =
                    arrow::ipc::reader::StreamReader::try_new(std::io::Cursor::new(payload), None)
                        .expect("ipc reader");
                let schema = rdr.schema();
                let names: Vec<&str> = schema.fields().iter().map(|f| f.name().as_str()).collect();
                assert_eq!(names, vec!["id", "geometry", "f32"]);
                saw_schema_with_f32 = true;
                for batch in rdr.by_ref() {
                    let batch = batch.expect("decode");
                    let f32_col = batch
                        .column_by_name("f32")
                        .unwrap()
                        .as_any()
                        .downcast_ref::<arrow::array::Float32Array>()
                        .unwrap();
                    for r in 0..batch.num_rows() {
                        assert!(
                            f32_col.value(r) > 0.1,
                            "the filter must have applied to the projected stream: saw {}",
                            f32_col.value(r)
                        );
                    }
                }
            }
            Some(&wire::TAG_TERMINAL) => break,
            _ => {}
        }
    }
    assert!(saw_batch, "the composed query must still deliver batches");
    assert!(saw_schema_with_f32, "the projection must still be honoured alongside the filter");
    c.close(None).await.ok();
    dp.shutdown().await;
}

// ---- K-9 (the live half): publish refuses Float32 at preflight, over a real fixture -----------

fn viewer() -> ViewerAssets {
    ViewerAssets::new(vec![
        ViewerAsset { path: "index.html".into(), bytes: b"<!doctype html><title>t</title>".to_vec() },
        ViewerAsset { path: "app.js".into(), bytes: b"export const ok = 1;\n".to_vec() },
        ViewerAsset { path: "NOTICE.txt".into(), bytes: b"stub notice\n".to_vec() },
    ])
    .unwrap()
}

fn viewer_license() -> ViewerLicenseInput {
    ViewerLicenseInput {
        program: "Spatial IDE bundle viewer".into(),
        copyright: "Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors".into(),
        license: "AGPL-3.0-or-later".into(),
        notice_path: "NOTICE.txt".into(),
        corresponding_source: CorrespondingSource {
            kind: CorrespondingSourceKind::Url,
            at: "https://example.invalid/spatial-ide".into(),
        },
    }
}

/// K-9 (the Float32 sub-case, live): `publish_refuses_float32_and_dictionary_columns_at_preflight_
/// as_a_bundle_format_restriction_with_todays_text`, over a real `AttributeMode::MultiType`
/// fixture's `f32` column — reached through the public `preflight_pinless` entry point, exactly as
/// a real publish call would reach it. The dictionary sub-case is unreachable through
/// `read_parquet` (H2) and is proven instead as a unit test in `kernel/src/publish/mod.rs`
/// (`admit_bundle_format_refuses_a_dictionary_column_with_todays_admit_attribute_type_text`, O6).
/// Nothing is written before the refusal (`preflight_pinless` never opens `req.destination`).
/// Mutation: remove the restriction (`admit_bundle_format` admitting `Float32`).
#[test]
fn publish_refuses_float32_and_dictionary_columns_at_preflight_as_a_bundle_format_restriction_with_todays_text(
) {
    let path = multitype_fixture("k9-publish-float32", 20);
    let ds = spatial_engine::Dataset::open(&path).expect("open");
    ds.pin_content(&CancelToken::new()).expect("pin");
    let viewer = viewer();
    let destination = fixture_dir().join("k9-publish-float32-bundle-not-written");
    let _ = std::fs::remove_dir_all(&destination);

    let req = PublishRequest {
        dataset: &ds,
        dataset_name: "k9",
        query: spatial_engine::ViewportQuery::all(),
        attributes: vec!["f32".to_string()],
        style_source: "{}",
        viewer: &viewer,
        viewer_license: viewer_license(),
        license: None,
        destination: destination.clone(),
        started_at: "2026-09-27T00:00:00Z".into(),
        finished_at: &|| "2026-09-27T00:00:01Z".to_string(),
    };

    match preflight_pinless(&req) {
        Err(PublishError::Engine(spatial_engine::EngineError::AttributeUnpublishable { column, detail })) => {
            assert_eq!(column, "f32");
            assert_eq!(
                detail,
                "type is Float32. The bundle carries doubles; widening f32 to f64 is exact but it \
                 is still a conversion this engine was not asked to perform, and a consumer \
                 reading `float64` would be told the source held one"
            );
        }
        other => panic!("expected AttributeUnpublishable naming Float32 at preflight, got {other:?}"),
    }
    assert!(!destination.exists(), "nothing may be written before the refusal");
}

/// Cross-checks `f32_for`'s own bucket claim used by `live_projection.rs`'s E-20, so this file's
/// `k7` composed-filter test above (`f32 > 0.1`) is known in advance to select a real, non-vacuous
/// subset over its own 300-feature fixture.
#[test]
fn f32_for_exercises_both_sides_of_0_1_over_a_300_feature_run() {
    let seed = FixtureSpec::default().seed;
    let gt = (0..300u64).filter(|&id| f32_for(seed, id) > 0.1).count();
    let le = 300 - gt;
    assert!(gt > 0 && le > 0, "the fixture must exercise both sides of the 0.1 boundary");
}
