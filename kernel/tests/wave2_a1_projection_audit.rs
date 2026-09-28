// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! Wave-2 audit A1 (evidence only, no product change). Finding A1-1's reproducer, plus two passing
//! checks: O3's order (projection admission before filter admission) through
//! `SkpHost::viewport_query`, and O8 through the wire for a keyless file.

use std::sync::Arc;

use spatial_engine::fixture::{write_geoparquet, AttributeMode, CrsMode, FixtureSpec, IdentityMode};
use spatial_kernel::skp::{session_end_channel, SkpHost, StreamRegistry};
use spatial_kernel::Catalog;
use spatial_skp::v0::{DatasetHandle, Filter, ViewportQueryRequest, FILTER_DIALECT_DUCKDB_EXPR_0, SKP_VERSION};

mod watch_support;

fn fixture(name: &str, identity: IdentityMode) -> std::path::PathBuf {
    let dir = std::path::PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../target/fixtures");
    std::fs::create_dir_all(&dir).unwrap();
    let path = dir.join(format!("wave2-a1-{name}.parquet"));
    write_geoparquet(
        &path,
        &FixtureSpec {
            features: 30,
            avg_vertices: 12,
            hole_every: 0,
            attributes: AttributeMode::MultiType,
            identity,
            crs_mode: CrsMode::DeclaredLv95,
            ..Default::default()
        },
    )
    .unwrap();
    path
}

fn host_for(handle: &DatasetHandle, path: &std::path::Path) -> SkpHost {
    let catalog = Arc::new(Catalog::new());
    catalog.open(handle.as_str(), path, None).expect("open");
    SkpHost::new(catalog, StreamRegistry::new(), watch_support::no_watch_arm(), session_end_channel().0)
}

fn req(dataset: DatasetHandle, columns: Option<Vec<String>>, filter: Option<&str>) -> ViewportQueryRequest {
    ViewportQueryRequest {
        skp: SKP_VERSION.to_string(),
        dataset,
        bbox: None,
        bbox_crs: None,
        limit: None,
        filter: filter.map(|p| Filter::new(p, FILTER_DIALECT_DUCKDB_EXPR_0).unwrap()),
        columns,
    }
}

#[test]
fn o3_projection_refusal_precedes_filter_refusal() {
    let handle: DatasetHandle = "ds_000000000000000000000000000a1003".parse().unwrap();
    let host = host_for(&handle, &fixture("o3", IdentityMode::NativeUnique));
    let cases: Vec<(Option<Vec<String>>, &str, &str)> = vec![
        (Some(vec![]), "no_such_column > 1", "skp.projection_empty_list"),
        (Some(vec!["nope".into()]), "no_such_column > 1", "skp.projection_column_unknown"),
        (Some(vec!["d32".into()]), "d32 > 1", "skp.projection_type_not_admitted"),
        // A valid projection does not mask a filter refusal.
        (Some(vec!["f32".into()]), "no_such_column > 1", "skp.filter_unknown_column"),
        // Float32 filterable; dictionary-free file, so no dictionary case is reachable here (H2).
        (Some(vec!["f32".into()]), "f32 > 0.1", "<admitted>"),
    ];
    for (columns, predicate, expected) in cases {
        let outcome = host.viewport_query(req(handle.clone(), columns.clone(), Some(predicate)));
        let code = match &outcome {
            Ok(_) => "<admitted>".to_string(),
            Err(e) => e.code.clone(),
        };
        println!("columns={columns:?} filter={predicate:?} -> {code}");
        assert_eq!(code, expected, "columns={columns:?} filter={predicate:?}");
    }
}

#[test]
fn o8_reserved_id_on_a_keyless_file_is_identity_not_unknown() {
    let handle: DatasetHandle = "ds_000000000000000000000000000a1008".parse().unwrap();
    let host = host_for(&handle, &fixture("o8", IdentityMode::ForeignKeyColumn));
    let e = host.viewport_query(req(handle.clone(), Some(vec!["id".into()]), None)).expect_err("refused");
    println!("[id] on keyless file -> {} {:?} :: {}", e.code, e.fields, e.message);
    assert_eq!(e.code, "skp.projection_column_is_identity");
    let e = host
        .viewport_query(req(handle.clone(), Some(vec!["nope".into(), "id".into()]), None))
        .expect_err("refused");
    println!("[nope, id] -> {}", e.code);
    assert_eq!(e.code, "skp.projection_column_unknown");
}

/// Finding A1-1 (reproducer; FAILS at d4245fe). On a keyless file (the session tier, no declaration),
/// `describe` classes the identity `session-ordinal`, never `mapped`; the `[id]` refusal's message
/// nevertheless states "this dataset's identity is mapped from `file_row_number`". Preregistration §1:
/// "Engine messages state engine facts only"; §2.3: the Display "states whichever of the two facts
/// applies".
#[test]
fn a1_1_session_ordinal_identity_refusal_does_not_claim_a_mapping() {
    let handle: DatasetHandle = "ds_000000000000000000000000000a1011".parse().unwrap();
    let host = host_for(&handle, &fixture("a1-1", IdentityMode::ForeignKeyColumn));
    let describe = host
        .describe(spatial_skp::v0::DescribeRequest { skp: SKP_VERSION.to_string(), dataset: handle.clone() })
        .expect("describe");
    println!("describe.identity.class = {}", describe.identity.class);
    assert_eq!(describe.identity.class, "session-ordinal");
    let e = host.viewport_query(req(handle, Some(vec!["id".into()]), None)).expect_err("refused");
    println!("refusal: {} :: {}", e.code, e.message);
    assert_eq!(e.code, "skp.projection_column_is_identity");
    assert!(
        !e.message.contains("mapped"),
        "the refusal states a mapping that describe (class = {:?}) says does not exist: {:?}",
        describe.identity.class,
        e.message
    );
}
