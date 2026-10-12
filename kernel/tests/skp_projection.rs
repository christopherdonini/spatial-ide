// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! Brief B stage B1, engine/kernel half (`engine/B1-PROJECTION-PREREGISTRATION.md` §4): attribute
//! projection on `viewport_query`, at the kernel boundary — `SkpHost::viewport_query`'s admission
//! order, `projection_error_of`'s exhaustive mapping, `describe`'s `projectable`, and the real
//! `sk_admission.rs` ticket-redemption harness (F12).

use std::collections::{BTreeMap, BTreeSet};
use std::sync::Arc;
use std::time::Duration;

use arrow::array::Array;
use futures_util::{SinkExt, StreamExt};
use spatial_data_plane::server::DataPlaneConfig;
use spatial_data_plane::session::SUBPROTOCOL;
use spatial_data_plane::{wire, RunningDataPlane};
use spatial_engine::fixture::{
    f32_for, write_geoparquet, write_hostile_names, AttributeMode, CrsMode, FixtureSpec,
    HostileColumn, IdentityMode,
};
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

/// A file carrying one column whose name does not round-trip (§10 Amendment 12, wave-2 A2-1) — the
/// P0 probe's c01 shape, promoted through `engine::fixture::write_hostile_names`.
fn hostile_names_fixture(name: &str) -> std::path::PathBuf {
    let path = fixture_dir().join(format!("skp-projection-{name}.parquet"));
    write_hostile_names(
        &path,
        "id",
        &[HostileColumn {
            name: "nu\0l",
            int: false,
        }],
    );
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
    let mut req = format!("ws://127.0.0.1:{}/stream", dp.addr.port())
        .into_client_request()
        .unwrap();
    req.headers_mut().insert(
        "origin",
        format!("http://127.0.0.1:{}", dp.addr.port())
            .parse()
            .unwrap(),
    );
    req.headers_mut().insert(
        "sec-websocket-protocol",
        format!("{SUBPROTOCOL}, tok.{}", dp.session.token_for_delivery())
            .parse()
            .unwrap(),
    );
    tokio_tungstenite::connect_async(req)
        .await
        .expect("connect")
        .0
}

/// X12 (Amendment 5, row 5.6): SHA-256 of a file, on `kernel/tests/scale_pass.rs`'s own
/// `sha256_file` precedent — a fixture this small (hundreds of features, not 5 GB) is read whole
/// rather than streamed in blocks.
fn sha256_file(path: &std::path::Path) -> String {
    let bytes = std::fs::read(path).expect("read fixture for hashing");
    spatial_renderer::canonical::sha256_hex(&bytes)
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
/// fixture's own `columns: ["area", "zone"]` (X8: Amendment 5 row 5.6 — deliberately the reverse of
/// `engine/src/fixture.rs`'s own file order, `zone` then `area`, so the field-order assertion below
/// cannot pass by accident if admission silently returned file order instead of declared order) is
/// what is actually sent, over a real data-plane WebSocket, and the decoded frame is checked against
/// an independent DuckDB read (X11: keyed on `id`, covering both columns, NULLs included).
///
/// Mutation: `build_viewport_query` ignores `req.columns` — the schema would then carry no
/// `area`/`zone` fields at all, and the field-order assertion below fails by name.
// RECORDED MUTATION (observed at b438c58728d044e67466c438b35091f813e57be2): in
// `kernel/src/skp.rs::build_viewport_query`, replace the `projection` match with
// `let projection = None;`, ignoring `req.columns`. Observed: this test fails by name --
// "declared (request) order, id and geometry first / left: [\"id\", \"geometry\"] / right: [\"id\",
// \"geometry\", \"area\", \"zone\"]". Reverted.
// RECORDED MUTATION (X11; observed at b438c58728d044e67466c438b35091f813e57be2): in `stream.rs`'s
// chunk loop, slice each attribute run one row late (`run_start + 1` instead of `run_start` at the
// cut, and `row + 2` instead of `row + 1` at the final push; applied as a shift of both slice
// bounds, so the cut pushes `run_start + 1..row + 1`). Observed: this test fails by name -- "area
// mismatch at id 0" (the DuckDB oracle below; left 1034.3331505478782, right 8267.067509130165),
// the emitted values shifted by one row against the independent read. Reverted.
#[tokio::test(flavor = "multi_thread")]
async fn a_projected_viewport_query_from_the_wire_fixture_streams_the_declared_columns() {
    let fixture_json = std::fs::read_to_string(
        std::path::Path::new(env!("CARGO_MANIFEST_DIR"))
            .join("../protocol/skp/tests/data/v0-viewport_query-request-with-columns.json"),
    )
    .expect("read the committed wire fixture");
    let req: ViewportQueryRequest =
        serde_json::from_str(&fixture_json).expect("the committed fixture must deserialize");
    assert_eq!(
        req.columns,
        Some(vec!["area".to_string(), "zone".to_string()])
    );

    let path = multitype_fixture("k1-seam", 300);
    // X12 (Amendment 5, row 5.6): hashed before and after this run.
    let fixture_sha_before = sha256_file(&path);

    // X11: the oracle is an independent DuckDB read of the same file, keyed on `id`, covering both
    // projected columns, NULLs included — `live_projection.rs`'s E-8 own precedent.
    let mut oracle: BTreeMap<u64, (f64, Option<String>)> = BTreeMap::new();
    {
        let conn = spatial_engine::fixture::configured_connection().expect("conn");
        let path_str = path.to_string_lossy().to_string();
        let mut stmt = conn
            .prepare("SELECT id, area, zone FROM read_parquet(?)")
            .expect("prepare");
        for batch in stmt.query_arrow([path_str.as_str()]).expect("query") {
            let ids = batch
                .column_by_name("id")
                .unwrap()
                .as_any()
                .downcast_ref::<arrow::array::UInt64Array>()
                .unwrap();
            let areas = batch
                .column_by_name("area")
                .unwrap()
                .as_any()
                .downcast_ref::<arrow::array::Float64Array>()
                .unwrap();
            let zones = batch
                .column_by_name("zone")
                .unwrap()
                .as_any()
                .downcast_ref::<arrow::array::StringArray>()
                .unwrap();
            for r in 0..batch.num_rows() {
                let zone = (!zones.is_null(r)).then(|| zones.value(r).to_string());
                oracle.insert(ids.value(r), (areas.value(r), zone));
            }
        }
    }
    assert_eq!(oracle.len(), 300);

    let catalog = Arc::new(Catalog::new());
    catalog
        .open(req.dataset.as_str(), &path, None)
        .expect("open dataset under the fixture's own handle");
    let tickets = StreamRegistry::new();
    let host = SkpHost::new(
        catalog.clone(),
        tickets.clone(),
        watch_support::no_watch_arm(),
        session_end_channel().0,
    );
    host.generations()
        .mint_for_open(req.dataset.as_str(), spatial_skp::v0::SessionRef::mint());

    let ticket = host
        .viewport_query(req)
        .expect("the fixture's own request must admit");

    let dp = spatial_data_plane::serve(DataPlaneConfig {
        factory: Arc::new(EngineSourceFactory::ticket_only(
            catalog,
            tickets,
            host.generations(),
        )),
        static_dir: None,
        expected_origin: None,
    })
    .await
    .expect("serve");
    let mut c = connect(&dp).await;
    c.send(Message::Binary(
        wire::frame(
            wire::TAG_START,
            &wire::start_payload(OPERATION, ticket.stream.as_str().as_bytes()),
        )
        .into(),
    ))
    .await
    .expect("start");
    c.send(Message::Binary(
        wire::frame(wire::TAG_CREDIT, &u32::MAX.to_be_bytes()).into(),
    ))
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
        let Some(len) = wire::payload_len(&b) else {
            continue;
        };
        let payload = &b[wire::FRAME_PREFIX_LEN..wire::FRAME_PREFIX_LEN + len];
        match b.first() {
            Some(&wire::TAG_BATCH) => {
                let mut rdr =
                    arrow::ipc::reader::StreamReader::try_new(std::io::Cursor::new(payload), None)
                        .expect("ipc reader");
                if !checked_schema {
                    let schema = rdr.schema();
                    let names: Vec<&str> =
                        schema.fields().iter().map(|f| f.name().as_str()).collect();
                    assert_eq!(
                        names,
                        vec!["id", "geometry", "area", "zone"],
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
                    let zone_col = batch
                        .column_by_name("zone")
                        .unwrap()
                        .as_any()
                        .downcast_ref::<arrow::array::StringArray>()
                        .unwrap();
                    for r in 0..batch.num_rows() {
                        let id = id_col.value(r);
                        ids.insert(id);
                        // X11 (Amendment 5, row 5.6): the oracle is now an independent DuckDB read
                        // of the same file, keyed on `id`, covering both projected columns, NULLs
                        // included — the seam under test is the wire round trip (order, framing,
                        // ticket redemption) proven end to end against a source the generator did
                        // not compute, on `live_projection.rs`'s E-8 own precedent, rather than
                        // against the fixture's own pure generator function.
                        let (expected_area, expected_zone) = oracle
                            .get(&id)
                            .unwrap_or_else(|| panic!("id {id} in oracle"));
                        assert_eq!(
                            area_col.value(r),
                            *expected_area,
                            "area mismatch at id {id}"
                        );
                        let zone = (!zone_col.is_null(r)).then(|| zone_col.value(r).to_string());
                        assert_eq!(&zone, expected_zone, "zone mismatch at id {id}");
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

    // X12: hashed again, after the run — the fixture on disk must be exactly what it was before.
    assert_eq!(
        sha256_file(&path),
        fixture_sha_before,
        "the fixture file must be unchanged by this run"
    );
}

// ---- K-2, K-3, K-4, N-4: the eight typed refusals ----------------------------------------------

/// K-2: `every_projection_refusal_is_synchronous_typed_and_pre_mint`, over the eight codes with
/// their exact field keys (F11: after each refusal, no ticket exists for this dataset and the
/// connection pool's own lease count is unchanged). K-3
/// (`columns_empty_list_is_refused_never_read_as_null`) and K-4
/// (`projection_error_of_maps_each_variant_to_its_own_code`) are proven from the same table, since
/// all three read the same first seven codes. The eighth case, below the main loop, against a
/// second, hostile-named fixture opened under its own handle (F12's harness applied again), is
/// *this* test's own "changed existing test" (12.2's closing note: the closing `codes.len() == 7`
/// assertion becomes 8) — a case distinct from, but proving the same code as,
/// `a_projection_naming_a_nul_named_column_is_refused_synchronously_typed_and_pre_mint` (N-4,
/// §10 Amendment 12, wave-2 A2-1), which is its own standalone test elsewhere in this file, not
/// folded into this one.
///
/// Mutations: K-2 — admit after `open_engine_stream` (then a refusal would leave a live ticket or
/// a moved lease count). K-3 — map `Some([])` to `None` (then that one case admits instead of
/// refusing). K-4 — two variants sharing a code (then the `BTreeSet` below has fewer than 8
/// members).
// RECORDED MUTATION (K-4; observed at b438c58728d044e67466c438b35091f813e57be2): in
// `kernel/src/skp.rs::projection_error_of`, make the `ColumnIsGeometry` arm return
// `"projection_column_is_identity"` (sharing `ColumnIsIdentity`'s code). Observed:
// `every_projection_refusal_is_synchronous_typed_and_pre_mint` fails by name -- "geometry: wrong
// code / left: \"skp.projection_column_is_identity\" / right: \"skp.projection_column_is_geometry\""
// (the same test whose closing `codes.len() == 8` assertion is K-4's own claim). Reverted.
/// One case in K-2's own table: a label, the declared `columns`, the expected wire code, and the
/// expected exact field key set (a value where the value itself is a stable fact, `None` where
/// only presence is checked — `detail` in particular, sighted at B1's close). A named alias, not
/// the nested tuple type inline, on X20's own fix (R nit 3: clippy's `type_complexity` lint fired
/// on the un-aliased form at this file's own line 247, pre-Amendment-5).
type ProjectionRefusalCase = (
    &'static str,
    Vec<String>,
    &'static str,
    Vec<(&'static str, Option<&'static str>)>,
);

#[test]
fn every_projection_refusal_is_synchronous_typed_and_pre_mint() {
    let path = multitype_fixture("k2-refusals", 40);
    let handle: DatasetHandle = "ds_00000000000000000000000000000010".parse().unwrap();
    let catalog = Arc::new(Catalog::new());
    catalog
        .open(handle.as_str(), &path, None)
        .expect("open dataset");
    let tickets = StreamRegistry::new();
    let host = SkpHost::new(
        catalog.clone(),
        tickets.clone(),
        watch_support::no_watch_arm(),
        session_end_channel().0,
    );
    host.generations()
        .mint_for_open(handle.as_str(), spatial_skp::v0::SessionRef::mint());
    let ds = catalog.get(handle.as_str()).expect("dataset in catalog");

    // X9 (Amendment 5, row 5.6): each case's expected fields is now the **exact** key set (with
    // values checked wherever a value is a stable fact — `detail` is checked only for presence,
    // since its text is sighted at B1's close and named a placeholder until then), not a subset a
    // renamed or added key could silently slip past.
    let too_many: Vec<String> = (0..33).map(|i| format!("bogus_{i}")).collect();
    let cases: Vec<ProjectionRefusalCase> = vec![
        ("empty list", vec![], "skp.projection_empty_list", vec![]),
        (
            "too many columns",
            too_many,
            "skp.projection_too_many_columns",
            vec![("limit", Some("32")), ("saw", Some("33"))],
        ),
        (
            "unknown column",
            vec!["nope".to_string()],
            "skp.projection_column_unknown",
            vec![("column", Some("nope")), ("known_columns", None)],
        ),
        (
            "geometry",
            vec!["geometry".to_string()],
            "skp.projection_column_is_geometry",
            vec![("column", Some("geometry"))],
        ),
        (
            "identity",
            vec!["id".to_string()],
            "skp.projection_column_is_identity",
            vec![("column", Some("id")), ("id_column", Some("id"))],
        ),
        (
            "duplicated",
            vec!["zone".to_string(), "zone".to_string()],
            "skp.projection_column_duplicated",
            vec![("column", Some("zone"))],
        ),
        (
            "type not admitted",
            vec!["d32".to_string()],
            "skp.projection_type_not_admitted",
            vec![
                ("column", Some("d32")),
                ("arrow_type", Some("Date32")),
                ("detail", None),
            ],
        ),
    ];

    let mut codes = BTreeSet::new();
    for (label, columns, expected_code, expected_fields) in cases {
        let leases_before = ds.connections().leases_issued();
        let cancelled_before = tickets.cancel_all_for_dataset(handle.as_str());
        assert_eq!(
            cancelled_before, 0,
            "{label}: no ticket should exist before this case runs"
        );

        let err = host
            .viewport_query(base_request(handle.clone(), Some(columns)))
            .expect_err(&format!("{label}: must be refused"));
        assert_eq!(err.code, expected_code, "{label}: wrong code");
        let actual_keys: BTreeSet<&str> = err.fields.keys().map(String::as_str).collect();
        let expected_keys: BTreeSet<&str> = expected_fields.iter().map(|(k, _)| *k).collect();
        assert_eq!(actual_keys, expected_keys, "{label}: exact field key set");
        for (key, expected_value) in expected_fields {
            if let Some(value) = expected_value {
                assert_eq!(
                    err.fields.get(key).map(String::as_str),
                    Some(value),
                    "{label}: field `{key}`"
                );
            } else {
                assert!(
                    err.fields.contains_key(key),
                    "{label}: field `{key}` must be present"
                );
            }
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

    // The eighth case (§10 Amendment 12, wave-2 A2-1), against its own hostile-named file -- F12's
    // harness (`Catalog::open` under the fixture's own handle, `SkpHost::new`) applied a second
    // time, because the multitype fixture above carries no column whose name does not round-trip.
    // Distinct from, but proving the same code as, N-4's own standalone test (see the module doc
    // above). Mutation: in `kernel/src/skp.rs::projection_error_of`, map
    // `ProjectionError::ColumnNameNotAddressable` to `"projection_column_unknown"` instead (then
    // `err.code` below reads `skp.projection_column_unknown`, and this case's own assertion fails
    // by name).
    let hostile_path = fixture_dir().join("skp-projection-k2-refusals-hostile.parquet");
    write_hostile_names(
        &hostile_path,
        "id",
        &[HostileColumn {
            name: "nu\0l",
            int: false,
        }],
    );
    let hostile_fixture_sha_before = sha256_file(&hostile_path);
    let hostile_handle: DatasetHandle = "ds_00000000000000000000000000000011".parse().unwrap();
    catalog
        .open(hostile_handle.as_str(), &hostile_path, None)
        .expect("open hostile-named fixture");
    host.generations()
        .mint_for_open(hostile_handle.as_str(), spatial_skp::v0::SessionRef::mint());
    let hostile_ds = catalog
        .get(hostile_handle.as_str())
        .expect("hostile dataset in catalog");

    let leases_before = hostile_ds.connections().leases_issued();
    let cancelled_before = tickets.cancel_all_for_dataset(hostile_handle.as_str());
    assert_eq!(
        cancelled_before, 0,
        "nul-named column: no ticket should exist before this case runs"
    );

    let err = host
        .viewport_query(base_request(
            hostile_handle.clone(),
            Some(vec!["nu\u{0}l".to_string()]),
        ))
        .expect_err("nul-named column: must be refused");
    assert_eq!(
        err.code, "skp.projection_column_name_not_addressable",
        "nul-named column: wrong code"
    );
    let actual_keys: BTreeSet<&str> = err.fields.keys().map(String::as_str).collect();
    let expected_keys: BTreeSet<&str> = ["column", "detail"].into_iter().collect();
    assert_eq!(
        actual_keys, expected_keys,
        "nul-named column: exact field key set"
    );
    assert_eq!(
        err.fields.get("column").map(String::as_str),
        Some("nu\u{0}l")
    );
    codes.insert(err.code.clone());

    assert_eq!(
        tickets.cancel_all_for_dataset(hostile_handle.as_str()),
        0,
        "nul-named column: refused synchronously and pre-mint -- no ticket to have minted"
    );
    assert_eq!(
        hostile_ds.connections().leases_issued(),
        leases_before,
        "nul-named column: a projection refusal must not touch the stream connection pool at all"
    );
    assert_eq!(
        sha256_file(&hostile_path),
        hostile_fixture_sha_before,
        "the hostile fixture file must be unchanged by this run"
    );

    assert_eq!(
        codes.len(),
        8,
        "each of the eight refusals must map to its own code: {codes:?}"
    );
}

/// X9 (Amendment 5, row 5.6): `every_projection_refusal_matches_its_committed_error_fixture_shape`
/// — for each of the seven committed `v0-error-projection_*.json` fixtures, the kernel's own live
/// refusal for an equivalent case carries **exactly** the fixture's own field key set. Proves the
/// committed fixtures and the kernel's real output cannot drift apart silently (the same property
/// K-2's own key-set assertion proves against the declared table, this proves against the tracked
/// fixture files themselves).
/// Mutation: rename `known_columns` to (say) `candidate_columns` in `projection_error_of`'s
/// `ColumnUnknown` arm — the live refusal's key set then disagrees with the committed fixture's.
// RECORDED MUTATION (observed at b438c58728d044e67466c438b35091f813e57be2): in
// `kernel/src/skp.rs::projection_error_of`, rename the `ColumnUnknown` arm's `"known_columns"`
// field key to `"candidate_columns"`. Observed: this test fails by name --
// "skp.projection_column_unknown: live field key set must match the committed fixture's / left:
// {\"candidate_columns\", \"column\"} / right: {\"column\", \"known_columns\"}". Reverted.
#[test]
fn every_projection_refusal_matches_its_committed_error_fixture_shape() {
    let path = multitype_fixture("k-x9-fixture-shape", 40);
    let handle: DatasetHandle = "ds_00000000000000000000000000000015".parse().unwrap();
    let catalog = Arc::new(Catalog::new());
    catalog
        .open(handle.as_str(), &path, None)
        .expect("open dataset");
    let tickets = StreamRegistry::new();
    let host = SkpHost::new(
        catalog.clone(),
        tickets.clone(),
        watch_support::no_watch_arm(),
        session_end_channel().0,
    );
    host.generations()
        .mint_for_open(handle.as_str(), spatial_skp::v0::SessionRef::mint());

    // **N-17's kernel half** (§10 Amendment 12, wave-2 A2-1): the eighth committed fixture needs a
    // hostile-named file the multitype fixture above does not carry — a second dataset, opened
    // under its own handle (F12's harness applied again), queried only by that one case below.
    let hostile_path = fixture_dir().join("skp-projection-k-x9-fixture-shape-hostile.parquet");
    write_hostile_names(
        &hostile_path,
        "id",
        &[HostileColumn {
            name: "nu\0l",
            int: false,
        }],
    );
    let hostile_fixture_sha_before = sha256_file(&hostile_path);
    let hostile_handle: DatasetHandle = "ds_00000000000000000000000000000016".parse().unwrap();
    catalog
        .open(hostile_handle.as_str(), &hostile_path, None)
        .expect("open hostile-named fixture");
    host.generations()
        .mint_for_open(hostile_handle.as_str(), spatial_skp::v0::SessionRef::mint());

    let too_many: Vec<String> = (0..33).map(|i| format!("bogus_{i}")).collect();
    // (fixture file stem, the dataset handle this case queries, columns that reproduce an
    // equivalent live refusal)
    let cases: Vec<(&str, DatasetHandle, Vec<String>)> = vec![
        ("v0-error-projection_empty_list", handle.clone(), vec![]),
        (
            "v0-error-projection_too_many_columns",
            handle.clone(),
            too_many,
        ),
        (
            "v0-error-projection_column_unknown",
            handle.clone(),
            vec!["nope".to_string()],
        ),
        (
            "v0-error-projection_column_is_geometry",
            handle.clone(),
            vec!["geometry".to_string()],
        ),
        (
            "v0-error-projection_column_is_identity",
            handle.clone(),
            vec!["id".to_string()],
        ),
        (
            "v0-error-projection_column_duplicated",
            handle.clone(),
            vec!["zone".to_string(), "zone".to_string()],
        ),
        (
            "v0-error-projection_type_not_admitted",
            handle.clone(),
            vec!["d32".to_string()],
        ),
        (
            "v0-error-projection_column_name_not_addressable",
            hostile_handle.clone(),
            vec!["nu\u{0}l".to_string()],
        ),
    ];

    let fixtures_dir =
        std::path::Path::new(env!("CARGO_MANIFEST_DIR")).join("../protocol/skp/tests/data");
    for (fixture_stem, case_handle, columns) in cases {
        let fixture_json =
            std::fs::read_to_string(fixtures_dir.join(format!("{fixture_stem}.json")))
                .unwrap_or_else(|e| panic!("read {fixture_stem}.json: {e}"));
        let fixture_value: serde_json::Value =
            serde_json::from_str(&fixture_json).expect("fixture must be JSON");
        let fixture_code = fixture_value["code"]
            .as_str()
            .expect("fixture must carry `code`")
            .to_string();
        let fixture_keys: BTreeSet<String> = fixture_value["fields"]
            .as_object()
            .unwrap_or_else(|| panic!("{fixture_stem}: `fields` must be an object"))
            .keys()
            .cloned()
            .collect();

        let err = host
            .viewport_query(base_request(case_handle, Some(columns)))
            .expect_err(&format!("{fixture_stem}: must be refused"));
        assert_eq!(
            err.code, fixture_code,
            "{fixture_stem}: code must match the committed fixture"
        );
        let live_keys: BTreeSet<String> = err.fields.keys().cloned().collect();
        assert_eq!(
            live_keys, fixture_keys,
            "{}: live field key set must match the committed fixture's",
            err.code
        );
    }
    assert_eq!(
        sha256_file(&hostile_path),
        hostile_fixture_sha_before,
        "the hostile fixture file must be unchanged by this run"
    );
}

// ---- N-4: the nul-named column's own refusal test ---------------------------------------------

/// N-4 (§10 Amendment 12, wave-2 A2-1): `a_projection_naming_a_nul_named_column_is_refused_synchronously_typed_and_pre_mint`
/// (kernel, K-2's pattern, F12's harness) — its own standalone test, separate from the eighth case
/// folded into `every_projection_refusal_is_synchronous_typed_and_pre_mint` above. A hostile-named
/// file, opened under its own handle (F12's harness), queried for its one nul-named column.
///
/// Asserts: the refusal carries `skp.projection_column_name_not_addressable` with its exact key
/// set; `cancel_all_for_dataset` returns 0 both before and after; `leases_issued` is unchanged; and
/// the refusal matches the committed error fixture's own key set (X9's fixture-equality pattern).
///
/// Mutation: in `kernel/src/skp.rs::projection_error_of`, map `ProjectionError::ColumnNameNotAddressable`
/// to `"projection_column_unknown"` instead of its own code.
#[test]
fn a_projection_naming_a_nul_named_column_is_refused_synchronously_typed_and_pre_mint() {
    let hostile_path = fixture_dir().join("skp-projection-n4-refusal-hostile.parquet");
    write_hostile_names(
        &hostile_path,
        "id",
        &[HostileColumn {
            name: "nu\0l",
            int: false,
        }],
    );
    let fixture_sha_before = sha256_file(&hostile_path);
    let handle: DatasetHandle = "ds_00000000000000000000000000000017".parse().unwrap();
    let catalog = Arc::new(Catalog::new());
    catalog
        .open(handle.as_str(), &hostile_path, None)
        .expect("open hostile-named fixture");
    let tickets = StreamRegistry::new();
    let host = SkpHost::new(
        catalog.clone(),
        tickets.clone(),
        watch_support::no_watch_arm(),
        session_end_channel().0,
    );
    host.generations()
        .mint_for_open(handle.as_str(), spatial_skp::v0::SessionRef::mint());
    let ds = catalog.get(handle.as_str()).expect("dataset in catalog");

    let leases_before = ds.connections().leases_issued();
    let cancelled_before = tickets.cancel_all_for_dataset(handle.as_str());
    assert_eq!(
        cancelled_before, 0,
        "no ticket should exist before this case runs"
    );

    let err = host
        .viewport_query(base_request(
            handle.clone(),
            Some(vec!["nu\u{0}l".to_string()]),
        ))
        .expect_err("a nul-named column must be refused");
    assert_eq!(
        err.code, "skp.projection_column_name_not_addressable",
        "wrong code"
    );
    let actual_keys: BTreeSet<&str> = err.fields.keys().map(String::as_str).collect();
    let expected_keys: BTreeSet<&str> = ["column", "detail"].into_iter().collect();
    assert_eq!(actual_keys, expected_keys, "exact field key set");
    assert_eq!(
        err.fields.get("column").map(String::as_str),
        Some("nu\u{0}l")
    );

    assert_eq!(
        tickets.cancel_all_for_dataset(handle.as_str()),
        0,
        "refused synchronously and pre-mint -- no ticket to have minted"
    );
    assert_eq!(
        ds.connections().leases_issued(),
        leases_before,
        "a projection refusal must not touch the stream connection pool at all"
    );

    // X9's fixture-equality pattern: the live refusal's own key set matches the committed fixture's.
    let fixtures_dir =
        std::path::Path::new(env!("CARGO_MANIFEST_DIR")).join("../protocol/skp/tests/data");
    let fixture_json = std::fs::read_to_string(
        fixtures_dir.join("v0-error-projection_column_name_not_addressable.json"),
    )
    .expect("read v0-error-projection_column_name_not_addressable.json");
    let fixture_value: serde_json::Value =
        serde_json::from_str(&fixture_json).expect("fixture must be JSON");
    let fixture_code = fixture_value["code"]
        .as_str()
        .expect("fixture must carry `code`")
        .to_string();
    let fixture_keys: BTreeSet<String> = fixture_value["fields"]
        .as_object()
        .expect("`fields` must be an object")
        .keys()
        .cloned()
        .collect();
    assert_eq!(
        err.code, fixture_code,
        "code must match the committed fixture"
    );
    let live_keys: BTreeSet<String> = err.fields.keys().cloned().collect();
    assert_eq!(
        live_keys, fixture_keys,
        "live field key set must match the committed fixture's"
    );

    assert_eq!(
        sha256_file(&hostile_path),
        fixture_sha_before,
        "the fixture file must be unchanged by this run"
    );
}

// ---- N-13: the covering's kernel half -----------------------------------------------------------

/// N-13's kernel half (§10 Amendment 12, wave-2 A2-1; k1, k2; engine and kernel): a hostile-covering
/// file (k1's shape — the struct column's own name contains U+0000) opened through F12's harness.
/// `describe`'s `covering_bbox` is `false` for the unusable covering, and a bbox `viewport_query`
/// refuses `engine.no_covering_bbox` before the mint: no ticket exists before or after, and the
/// connection pool's own lease count is unchanged.
/// Mutation: `Dataset::covering()` (or its backing field) returns the declared covering whatever
/// its usability — the same mutation the engine half of N-13 uses
/// (`engine/tests/b1_projection_hostile_covering.rs`).
#[test]
fn a_hostile_covering_refuses_a_bbox_query_before_the_mint_and_describe_reports_no_covering() {
    let hostile_path = fixture_dir().join("skp-projection-n13-hostile-covering.parquet");
    spatial_engine::fixture::write_hostile_covering(
        &hostile_path,
        "bb\0ox",
        ["xmin", "ymin", "xmax", "ymax"],
        ("bb\0ox", ["xmin", "ymin", "xmax", "ymax"]),
    );
    let fixture_sha_before = sha256_file(&hostile_path);
    let handle: DatasetHandle = "ds_00000000000000000000000000000034".parse().unwrap();
    let catalog = Arc::new(Catalog::new());
    catalog
        .open(handle.as_str(), &hostile_path, None)
        .expect("open hostile-covering fixture");
    let tickets = StreamRegistry::new();
    let host = SkpHost::new(
        catalog.clone(),
        tickets.clone(),
        watch_support::no_watch_arm(),
        session_end_channel().0,
    );
    host.generations()
        .mint_for_open(handle.as_str(), spatial_skp::v0::SessionRef::mint());
    let ds = catalog.get(handle.as_str()).expect("dataset in catalog");

    let describe = host
        .describe(spatial_skp::v0::DescribeRequest {
            skp: SKP_VERSION.to_string(),
            dataset: handle.clone(),
        })
        .expect("describe");
    assert!(
        !describe.covering_bbox,
        "a covering whose path is not addressable is not usable"
    );

    let leases_before = ds.connections().leases_issued();
    let cancelled_before = tickets.cancel_all_for_dataset(handle.as_str());
    assert_eq!(
        cancelled_before, 0,
        "no ticket should exist before this case runs"
    );

    let mut req = base_request(handle.clone(), None);
    req.bbox = Some(spatial_skp::v0::Bbox {
        xmin: spatial_skp::v0::HexF64(2_599_000.0),
        ymin: spatial_skp::v0::HexF64(1_199_000.0),
        xmax: spatial_skp::v0::HexF64(2_601_000.0),
        ymax: spatial_skp::v0::HexF64(1_201_000.0),
    });
    req.bbox_crs = Some("EPSG:2056".to_string());
    let err = host
        .viewport_query(req)
        .expect_err("a hostile covering must refuse a bbox query");
    assert_eq!(err.code, "engine.no_covering_bbox", "wrong code");

    assert_eq!(
        tickets.cancel_all_for_dataset(handle.as_str()),
        0,
        "refused before the mint -- no ticket to have minted"
    );
    assert_eq!(
        ds.connections().leases_issued(),
        leases_before,
        "a covering refusal must not touch the stream connection pool at all"
    );
    assert_eq!(
        sha256_file(&hostile_path),
        fixture_sha_before,
        "the fixture file must be unchanged by this run"
    );
}

/// K-1 (`engine/COVERING-NAMES-MISSING-COLUMN-PREREGISTRATION.md` §4; k3 -- the covering names a
/// struct the file does not contain): `describe`'s `covering_bbox` is `false`; a bbox
/// `viewport_query` refuses `engine.no_covering_bbox` before the mint, with exactly the `detail`
/// field and the engine's own Display text as its message; no ticket exists and no lease was taken;
/// a `viewport_query` without a bbox still mints.
/// Mutation: `judge_covering`'s `Absent` result is replaced by `None` (the engine tests' C-1).
#[test]
fn a_covering_naming_a_column_the_file_lacks_refuses_a_bbox_viewport_query_before_the_mint_and_describe_reports_no_covering(
) {
    let path = fixture_dir().join("skp-projection-k1-covering-absent-column.parquet");
    spatial_engine::fixture::write_hostile_covering(
        &path,
        "bbox",
        ["xmin", "ymin", "xmax", "ymax"],
        ("nobbox", ["xmin", "ymin", "xmax", "ymax"]),
    );
    let fixture_sha_before = sha256_file(&path);
    let handle: DatasetHandle = "ds_00000000000000000000000000000035".parse().unwrap();
    let catalog = Arc::new(Catalog::new());
    catalog
        .open(handle.as_str(), &path, None)
        .expect("open the fixture");
    let tickets = StreamRegistry::new();
    let host = SkpHost::new(
        catalog.clone(),
        tickets.clone(),
        watch_support::no_watch_arm(),
        session_end_channel().0,
    );
    host.generations()
        .mint_for_open(handle.as_str(), spatial_skp::v0::SessionRef::mint());
    let ds = catalog.get(handle.as_str()).expect("dataset in catalog");

    let describe = host
        .describe(spatial_skp::v0::DescribeRequest {
            skp: SKP_VERSION.to_string(),
            dataset: handle.clone(),
        })
        .expect("describe");
    assert!(
        !describe.covering_bbox,
        "a covering naming an absent column is not usable"
    );

    let leases_before = ds.connections().leases_issued();
    assert_eq!(
        tickets.cancel_all_for_dataset(handle.as_str()),
        0,
        "no ticket should exist before this case runs"
    );

    let mut req = base_request(handle.clone(), None);
    req.bbox = Some(spatial_skp::v0::Bbox {
        xmin: spatial_skp::v0::HexF64(2_599_000.0),
        ymin: spatial_skp::v0::HexF64(1_199_000.0),
        xmax: spatial_skp::v0::HexF64(2_601_000.0),
        ymax: spatial_skp::v0::HexF64(1_201_000.0),
    });
    req.bbox_crs = Some("EPSG:2056".to_string());
    let err = host
        .viewport_query(req)
        .expect_err("a covering naming an absent column must refuse a bbox query");
    assert_eq!(err.code, "engine.no_covering_bbox", "wrong code");
    let live_keys: BTreeSet<String> = err.fields.keys().cloned().collect();
    assert_eq!(
        live_keys,
        BTreeSet::from(["detail".to_string()]),
        "the field key set is exactly {{detail}}"
    );
    let detail = err.fields["detail"].clone();
    assert!(detail.contains("nobbox.xmin"), "{detail}");
    assert_eq!(
        err.message,
        spatial_engine::EngineError::NoCoveringBbox { detail }.to_string(),
        "the message is the engine's own Display text"
    );

    assert_eq!(
        tickets.cancel_all_for_dataset(handle.as_str()),
        0,
        "refused before the mint -- no ticket to have minted"
    );
    assert_eq!(
        ds.connections().leases_issued(),
        leases_before,
        "a covering refusal must not touch the stream connection pool at all"
    );

    // A request without a bbox still mints.
    let minted = host
        .viewport_query(base_request(handle.clone(), None))
        .expect("a viewport_query without a bbox must still mint");
    assert_eq!(
        tickets.cancel_all_for_dataset(handle.as_str()),
        1,
        "the no-bbox request minted exactly one ticket ({})",
        minted.stream.as_str()
    );
    assert_eq!(
        sha256_file(&path),
        fixture_sha_before,
        "the fixture file must be unchanged by this run"
    );
}

// ---- X1: the filter refusal text for a still-refused type ------------------------------------

/// X1 (Amendment 5, row 5.6; O2): `a_filter_refusal_for_a_still_refused_type_keeps_todays_reason_byte_for_byte`
/// — a predicate naming `d32` (`Date32`, still refused) through the real
/// `viewport_query` filter admission path. The expected string is byte-copied by script from main's
/// rendering at `d6d9862` (`engine/src/attributes.rs`'s former final arm there, wrapped in
/// `EngineError::AttributeUnpublishable`'s `Display` at that same commit): "refused: `d32` cannot
/// be published as an attribute — type is Date32, which is not in the admissible set for a
/// published attribute (utf8, boolean, the 8/16/32/64-bit integers, float64). Nothing is cast,
/// widened or stringified to make a column fit; a conversion the caller did not ask for is the
/// silent conversion docs/01 principle 8 forbids".
/// Mutation: the branch's placeholder final arm (`admit_attribute_type`'s `other` arm, before X1).
// RECORDED MUTATION (observed at b438c58728d044e67466c438b35091f813e57be2): in
// `engine/src/attributes.rs::admit_attribute_type`, restore the placeholder text
// `"[B1 close placeholder] type is {other}, which is not in the admissible set for an
// attribute (utf8, boolean, the 8/16/32/64-bit integers, float32, float64, or a dictionary over one
// of those)"` in the `other` arm. Observed: this test fails by name -- "assertion `left == right`
// failed" (no message of its own): the `reason` field no longer matches the byte-copied expected
// string; it carries the placeholder prefix and the live admissible-set's own list instead.
// Reverted.
#[test]
fn a_filter_refusal_for_a_still_refused_type_keeps_todays_reason_byte_for_byte() {
    let path = multitype_fixture("x1-filter-refusal-text", 20);
    let handle: DatasetHandle = "ds_00000000000000000000000000000060".parse().unwrap();
    let catalog = Arc::new(Catalog::new());
    catalog
        .open(handle.as_str(), &path, None)
        .expect("open dataset");
    let tickets = StreamRegistry::new();
    let host = SkpHost::new(
        catalog.clone(),
        tickets.clone(),
        watch_support::no_watch_arm(),
        session_end_channel().0,
    );
    host.generations()
        .mint_for_open(handle.as_str(), spatial_skp::v0::SessionRef::mint());

    let mut req = base_request(handle, None);
    req.filter = Some(
        spatial_skp::v0::Filter::new("d32 > 0", spatial_skp::v0::FILTER_DIALECT_DUCKDB_EXPR_0)
            .expect("the one admitted wire dialect must construct"),
    );
    let err = host
        .viewport_query(req)
        .expect_err("a Date32 predicate must be refused");
    assert_eq!(err.code, "skp.filter_column_not_filterable");
    // Byte-copied by script from main's rendering at `d6d9862` (see this test's own doc comment).
    let expected_reason = "refused: `d32` cannot be published as an attribute — type is Date32, \
                            which is not in the admissible set for a published attribute (utf8, \
                            boolean, the 8/16/32/64-bit integers, float64). Nothing is cast, \
                            widened or stringified to make a column fit; a conversion the caller \
                            did not ask for is the silent conversion docs/01 principle 8 forbids";
    assert_eq!(
        err.fields.get("reason").map(String::as_str),
        Some(expected_reason)
    );
}

/// K-3's own claim, isolated from the table above: `columns: []` and `columns: null` are two
/// different requests with two different outcomes over the identical dataset — never silently
/// folded into one. Mutation: map `Some([])` to `None`.
#[test]
fn columns_empty_list_is_refused_never_read_as_null() {
    let path = multitype_fixture("k3-empty-vs-null", 20);
    let handle: DatasetHandle = "ds_00000000000000000000000000000011".parse().unwrap();
    let catalog = Arc::new(Catalog::new());
    catalog
        .open(handle.as_str(), &path, None)
        .expect("open dataset");
    let tickets = StreamRegistry::new();
    let host = SkpHost::new(
        catalog.clone(),
        tickets.clone(),
        watch_support::no_watch_arm(),
        session_end_channel().0,
    );
    host.generations()
        .mint_for_open(handle.as_str(), spatial_skp::v0::SessionRef::mint());

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
// RECORDED MUTATION (observed at b438c58728d044e67466c438b35091f813e57be2): in
// `kernel/src/skp.rs::describe_dataset`, compute `projectable` from
// `spatial_engine::attributes::admit_attribute_type(f.name(), f.data_type()).is_ok()` instead of
// `admit_projection_column`. Observed: this test fails by name -- "column `id` marked
// projectable, but viewport_query refused it: SkpError { code: \"skp.projection_column_is_identity\",
// ..." (message elided). Reverted.
#[tokio::test(flavor = "multi_thread")]
async fn describe_projectable_agrees_with_viewport_query_admission_for_every_column() {
    async fn check_one(
        handle: DatasetHandle,
        path: std::path::PathBuf,
        declared: Option<IdentityDeclaration>,
    ) {
        let catalog = Arc::new(Catalog::new());
        match declared {
            Some(declaration) => {
                // Mapped: declare the identity explicitly (K-5's "mapped" case, and X3's
                // mapped-to-`i64` case below).
                catalog
                    .open_cancellable(
                        handle.as_str(),
                        &path,
                        None,
                        Some(declaration),
                        &CancelToken::new(),
                    )
                    .expect("open with a declared identity mapping");
            }
            None => {
                catalog
                    .open(handle.as_str(), &path, None)
                    .expect("open dataset");
            }
        }
        let tickets = StreamRegistry::new();
        let host = SkpHost::new(
            catalog.clone(),
            tickets.clone(),
            watch_support::no_watch_arm(),
            session_end_channel().0,
        );
        host.generations()
            .mint_for_open(handle.as_str(), spatial_skp::v0::SessionRef::mint());

        let describe = host
            .describe(spatial_skp::v0::DescribeRequest {
                skp: SKP_VERSION.to_string(),
                dataset: handle.clone(),
            })
            .expect("describe");

        for field in &describe.schema {
            let outcome =
                host.viewport_query(base_request(handle.clone(), Some(vec![field.name.clone()])));
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
        None,
    )
    .await;
    check_one(
        "ds_0000000000000000000000000000002d".parse().unwrap(),
        mapped_multitype_fixture("k5-mapped", 20),
        Some(IdentityDeclaration::new(
            "parcel_key",
            "test",
            "2026-09-27T00:00:00Z",
        )),
    )
    .await;
    // Session-ordinal: the same keyless (`ForeignKeyColumn`) fixture shape, opened with **no**
    // identity declaration — `Dataset::open`'s own documented fallback (`session_identity.rs`:
    // `a_single_file_keyless_source_admits_on_the_session_tier_and_records_its_basis`).
    check_one(
        "ds_00000000000000000000000000000030".parse().unwrap(),
        mapped_multitype_fixture("k5-session-ordinal", 20),
        None,
    )
    .await;
    // **X3 (Amendment 5, row 5.6; gate 2's X3 ruling): the reserved `id` under a mapped identity.**
    // A native MultiType file, which carries its own `id` column, opened with the identity mapped
    // to `i64`, so that `id` is a column of the file unrelated to the identity. Opened through the
    // **engine-API route**, `Catalog::open_cancellable` with `skip_uniqueness_check = true`: the
    // wire always verifies uniqueness (`kernel/src/skp.rs`'s `host_minted_identity_declaration`),
    // and verification refuses this fixture, whose `i64` holds negative values
    // (`engine/src/fixture.rs`'s `i64_for`). Admission does not read uniqueness: `describe`'s
    // `projectable` and `Dataset::admit_projection` both read only the identity source column's
    // name, so the skipped scan is not an input to the property this case proves.
    // RECORDED MUTATION (observed at `ca3d7ae`, line numbers at that commit): remove the
    // `ID_COLUMN` arm from `engine/src/attributes.rs`'s `check_geometry_and_identity`. Observed:
    // this test fails by name -- "column `id` marked projectable, but viewport_query refused it:
    // ... skp.projection_column_is_identity ..." at `kernel/tests/skp_projection.rs:595`, on this
    // case. Reverted.
    let mut mapped_to_i64 = IdentityDeclaration::new("i64", "test", "2026-09-27T00:00:00Z");
    mapped_to_i64.skip_uniqueness_check = true;
    check_one(
        "ds_00000000000000000000000000000031".parse().unwrap(),
        multitype_fixture("k5-x3-mapped-to-i64", 20),
        Some(mapped_to_i64),
    )
    .await;
}

// ---- N-3: projectable and admission agree on a nul-named column, and describe carries the bound
// name -----------------------------------------------------------------------------------------

/// N-3 (§10 Amendment 12, wave-2 A2-1): `projectable_and_admission_agree_on_a_nul_named_column`
/// (c01, c02) — its own standalone test, separate from K-5's shared loop (the same deviation the
/// custodian corrected for N-4 in 303dca0). For each of c01 (`nu\0l` alone) and c02 (`zone\0x`
/// ahead of a real `zone`), `describe`'s own row carries the bound (DESCRIBE) name — never the Arrow
/// export's truncated one — and every row's `projectable` agrees with `viewport_query`'s own
/// admission (K-5's own agreement check).
/// Mutation: the name rule moves into `admit_projection`'s pass 1 only, dropped from the shared
/// `check_geometry_and_identity` helper `projectable` (`admit_projection_column`) also calls —
/// `projectable` would then admit a not-addressable column while `viewport_query`'s own
/// `admit_projection` still refuses it through pass 1, and the agreement assertion below fails.
#[tokio::test(flavor = "multi_thread")]
async fn projectable_and_admission_agree_on_a_nul_named_column() {
    async fn check(handle: DatasetHandle, path: std::path::PathBuf, expected_names: &[&str]) {
        let fixture_sha_before = sha256_file(&path);
        let catalog = Arc::new(Catalog::new());
        catalog
            .open(handle.as_str(), &path, None)
            .expect("open hostile-named fixture");
        let tickets = StreamRegistry::new();
        let host = SkpHost::new(
            catalog.clone(),
            tickets.clone(),
            watch_support::no_watch_arm(),
            session_end_channel().0,
        );
        host.generations()
            .mint_for_open(handle.as_str(), spatial_skp::v0::SessionRef::mint());

        let describe = host
            .describe(spatial_skp::v0::DescribeRequest {
                skp: SKP_VERSION.to_string(),
                dataset: handle.clone(),
            })
            .expect("describe");

        // Each row's `name` is the bound (DESCRIBE) name, not the Arrow export's truncated one.
        let names: Vec<&str> = describe.schema.iter().map(|f| f.name.as_str()).collect();
        for expected in expected_names {
            assert!(
                names.contains(expected),
                "describe must carry the bound name `{expected}` -- got {names:?}"
            );
        }

        for field in &describe.schema {
            let outcome =
                host.viewport_query(base_request(handle.clone(), Some(vec![field.name.clone()])));
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
        assert_eq!(
            sha256_file(&path),
            fixture_sha_before,
            "the fixture file must be unchanged by this run"
        );
    }

    // c01: `nu\0l` alone.
    check(
        "ds_00000000000000000000000000000032".parse().unwrap(),
        hostile_names_fixture("n3-c01-hostile-name"),
        &["id", "geometry", "nu\u{0}l"],
    )
    .await;
    // c02: `zone\0x` (Int64) ahead of a real `zone` (Utf8) -- the P0 output's own c02 order
    // (`state/drafts/a2-1-p0/p0-output.txt`, the c02-nul-int-before-utf8 row).
    let c02_path = fixture_dir().join("skp-projection-n3-c02-hostile-name.parquet");
    write_hostile_names(
        &c02_path,
        "id",
        &[
            HostileColumn {
                name: "zone\0x",
                int: true,
            },
            HostileColumn {
                name: "zone",
                int: false,
            },
        ],
    );
    check(
        "ds_00000000000000000000000000000033".parse().unwrap(),
        c02_path,
        &["id", "geometry", "zone", "zone\u{0}x"],
    )
    .await;
}

// ---- K-7: a projection composes with a filter --------------------------------------------------

/// K-7: `a_projection_composes_with_a_filter`. A request carrying both a valid `[f32]` projection
/// and a valid `f32 > 0.1` filter admits and streams the projected column, over exactly the
/// filtered row set. Mutation: the projection is dropped when a filter is present.
// RECORDED MUTATION (observed at b438c58728d044e67466c438b35091f813e57be2): in
// `kernel/src/skp.rs::build_viewport_query`, after computing `projection`, add
// `let projection = if req.filter.is_some() { None } else { projection };`. Observed: this test
// fails by name -- "assertion `left == right` failed" (no message of its own), with
// `left: ["id", "geometry"]` and `right: ["id", "geometry", "f32"]`. Reverted.
#[tokio::test(flavor = "multi_thread")]
async fn a_projection_composes_with_a_filter() {
    let path = multitype_fixture("k7-compose", 300);
    let handle: DatasetHandle = "ds_00000000000000000000000000000040".parse().unwrap();
    let catalog = Arc::new(Catalog::new());
    catalog
        .open(handle.as_str(), &path, None)
        .expect("open dataset");
    let tickets = StreamRegistry::new();
    let host = SkpHost::new(
        catalog.clone(),
        tickets.clone(),
        watch_support::no_watch_arm(),
        session_end_channel().0,
    );
    host.generations()
        .mint_for_open(handle.as_str(), spatial_skp::v0::SessionRef::mint());

    let mut req = base_request(handle, Some(vec!["f32".to_string()]));
    req.filter = Some(
        spatial_skp::v0::Filter::new("f32 > 0.1", spatial_skp::v0::FILTER_DIALECT_DUCKDB_EXPR_0)
            .expect("the one admitted wire dialect must construct"),
    );
    let ticket = host
        .viewport_query(req)
        .expect("a projection and a valid filter must compose");

    let dp = spatial_data_plane::serve(DataPlaneConfig {
        factory: Arc::new(EngineSourceFactory::ticket_only(
            catalog,
            tickets,
            host.generations(),
        )),
        static_dir: None,
        expected_origin: None,
    })
    .await
    .expect("serve");
    let mut c = connect(&dp).await;
    c.send(Message::Binary(
        wire::frame(
            wire::TAG_START,
            &wire::start_payload(OPERATION, ticket.stream.as_str().as_bytes()),
        )
        .into(),
    ))
    .await
    .expect("start");
    c.send(Message::Binary(
        wire::frame(wire::TAG_CREDIT, &u32::MAX.to_be_bytes()).into(),
    ))
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
        let Some(len) = wire::payload_len(&b) else {
            continue;
        };
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
    assert!(
        saw_schema_with_f32,
        "the projection must still be honoured alongside the filter"
    );
    c.close(None).await.ok();
    dp.shutdown().await;
}

// ---- K-9 (the live half): publish refuses Float32 at preflight, over a real fixture -----------

fn viewer() -> ViewerAssets {
    ViewerAssets::new(vec![
        ViewerAsset {
            path: "index.html".into(),
            bytes: b"<!doctype html><title>t</title>".to_vec(),
        },
        ViewerAsset {
            path: "app.js".into(),
            bytes: b"export const ok = 1;\n".to_vec(),
        },
        ViewerAsset {
            path: "NOTICE.txt".into(),
            bytes: b"stub notice\n".to_vec(),
        },
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

/// K-9 (the Float32 sub-case, live): `publish_refuses_float32_and_dictionary_columns_at_preflight_as_a_bundle_format_restriction_with_todays_text`,
/// over a real `AttributeMode::MultiType`
/// fixture's `f32` column — reached through the public `preflight_pinless` entry point, exactly as
/// a real publish call would reach it. The dictionary sub-case is unreachable through
/// `read_parquet` (H2) and is proven instead as a unit test in `kernel/src/publish/mod.rs`
/// (`admit_bundle_format_refuses_a_dictionary_column_with_todays_admit_attribute_type_text`, O6).
/// Nothing is written before the refusal (`preflight_pinless` never opens `req.destination`).
/// Mutation: remove the restriction (`admit_bundle_format` admitting `Float32`).
// RECORDED MUTATION (observed at b438c58728d044e67466c438b35091f813e57be2): in
// `kernel/src/publish/mod.rs::admit_bundle_format`, remove the `D::Float32` refusal arm (falls
// through to `_ => Ok(())`). Observed: this test fails by name -- "expected AttributeUnpublishable
// naming Float32 at preflight, got Err(Style(MissingKey { at: \"$\", key: \"style_version\" }))"
// (Float32 now admits, and preflight proceeds to its next, unrelated refusal). Reverted.
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
        Err(PublishError::Engine(spatial_engine::EngineError::AttributeUnpublishable {
            column,
            detail,
        })) => {
            assert_eq!(column, "f32");
            assert_eq!(
                detail,
                "type is Float32. The bundle carries doubles; widening f32 to f64 is exact but it \
                 is still a conversion this engine was not asked to perform, and a consumer \
                 reading `float64` would be told the source held one"
            );
        }
        other => {
            panic!("expected AttributeUnpublishable naming Float32 at preflight, got {other:?}")
        }
    }
    assert!(
        !destination.exists(),
        "nothing may be written before the refusal"
    );
}

/// X2 (Amendment 5, row 5.6; O1): `publish_refuses_a_multi_failure_list_by_shared_admission_before_the_bundle_format_restriction`.
/// `[f32, nope]` through the public `preflight_pinless` entry point: `f32` is admitted by shared
/// admission and refused only by the bundle-format restriction, while `nope` fails shared
/// admission's name pass. Shared admission runs first, so the refusal names `nope` as unknown and
/// never renders `f32`'s `Float32` text. Nothing is written before the refusal.
// RECORDED MUTATION (observed at `ca3d7ae`, line numbers at that commit): in
// `kernel/src/publish/mod.rs`'s `preflight_pinless_parts`, run the bundle-format restriction before
// `resolve_projection`, each declared name's type read from `file_schema()`. Observed: this test
// fails by name -- left "f32", right "nope" at `kernel/tests/skp_projection.rs:845`. Reverted. At
// `a472add` (before C-b made the loop read the admitted projection) R2-B3's own form, moving
// `resolve_projection` after the `admit_bundle_format` loop, failed the same way at `:848`.
#[test]
fn publish_refuses_a_multi_failure_list_by_shared_admission_before_the_bundle_format_restriction() {
    let path = multitype_fixture("x2-publish-order", 20);
    let ds = spatial_engine::Dataset::open(&path).expect("open");
    ds.pin_content(&CancelToken::new()).expect("pin");
    let viewer = viewer();
    let destination = fixture_dir().join("x2-publish-order-bundle-not-written");
    let _ = std::fs::remove_dir_all(&destination);

    let req = PublishRequest {
        dataset: &ds,
        dataset_name: "x2",
        query: spatial_engine::ViewportQuery::all(),
        attributes: vec!["f32".to_string(), "nope".to_string()],
        style_source: "{}",
        viewer: &viewer,
        viewer_license: viewer_license(),
        license: None,
        destination: destination.clone(),
        started_at: "2026-09-27T00:00:00Z".into(),
        finished_at: &|| "2026-09-27T00:00:01Z".to_string(),
    };

    let known: Vec<String> = ds
        .file_schema()
        .fields()
        .iter()
        .map(|f| f.name().clone())
        .collect();
    match preflight_pinless(&req) {
        Err(PublishError::Engine(spatial_engine::EngineError::AttributeUnpublishable {
            column,
            detail,
        })) => {
            assert_eq!(column, "nope", "shared admission's unknown name must be refused before the bundle-format restriction reaches `f32`");
            assert_eq!(
                detail,
                format!("the file has no such column (it has: {})", known.join(", "))
            );
        }
        other => panic!("expected AttributeUnpublishable naming `nope` as unknown, got {other:?}"),
    }
    assert!(
        !destination.exists(),
        "nothing may be written before the refusal"
    );
}

/// Cross-checks `f32_for`'s own bucket claim used by `live_projection.rs`'s E-20, so this file's
/// `k7` composed-filter test above (`f32 > 0.1`) is known in advance to select a real, non-vacuous
/// subset over its own 300-feature fixture.
#[test]
fn f32_for_exercises_both_sides_of_0_1_over_a_300_feature_run() {
    let seed = FixtureSpec::default().seed;
    let gt = (0..300u64).filter(|&id| f32_for(seed, id) > 0.1).count();
    let le = 300 - gt;
    assert!(
        gt > 0 && le > 0,
        "the fixture must exercise both sides of the 0.1 boundary"
    );
}
