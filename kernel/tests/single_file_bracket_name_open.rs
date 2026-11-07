// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! A host-opened dataset whose single file has a bracket in its name is that file: the open is
//! admitted, `describe` reports the file's own row count, and the stream the host's catalog serves
//! carries only that file's rows.

mod watch_support;

use std::collections::HashSet;
use std::path::PathBuf;
use std::sync::Arc;

use spatial_engine::fixture::{write_geoparquet, FixtureSpec, IdentityMode};
use spatial_engine::{CancelToken, ViewportQuery};
use spatial_kernel::skp::{session_end_channel, SkpHost, StreamRegistry};
use spatial_kernel::Catalog;
use spatial_skp::v0::{DescribeRequest, OpenDatasetRequest, SKP_VERSION};

const LITERAL_FEATURES: usize = 500;
const DECOY_FEATURES: usize = 300;
const DECOY_SEED: u64 = 0x5EED_2056_0000_0101;

fn spec(features: usize, seed: Option<u64>) -> FixtureSpec {
    let mut spec = FixtureSpec {
        features,
        avg_vertices: 12,
        identity: IdentityMode::NativeUnique,
        ..Default::default()
    };
    if let Some(seed) = seed {
        spec.seed = seed;
    }
    spec
}

#[test]
fn open_dataset_admits_an_existing_bracket_named_file_and_describe_reports_only_its_rows() {
    let dir = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .parent()
        .expect("the kernel crate sits in the workspace")
        .join("target/fixtures/single-file-bracket-name-open");
    let _ = std::fs::remove_dir_all(&dir);
    std::fs::create_dir_all(&dir).expect("fixture directory");
    let literal = dir.join("zones[1].parquet");
    let facts = write_geoparquet(&literal, &spec(LITERAL_FEATURES, None)).expect("write literal");
    let decoy = dir.join("zones1.parquet");
    let decoy_facts =
        write_geoparquet(&decoy, &spec(DECOY_FEATURES, Some(DECOY_SEED))).expect("write decoy");
    assert_eq!(facts.features, LITERAL_FEATURES);
    assert_eq!(decoy_facts.features, DECOY_FEATURES);

    let host = SkpHost::new(
        Arc::new(Catalog::new()),
        StreamRegistry::new(),
        watch_support::no_watch_arm(),
        session_end_channel().0,
    );
    let open = host
        .open_dataset(OpenDatasetRequest {
            skp: SKP_VERSION.to_string(),
            path: literal.display().to_string(),
            cancel_key: "open-bracket-named-file".to_string(),
            crs_assertion: None,
            identity: None,
        })
        .unwrap_or_else(|e| panic!("the open must succeed for an existing single file: {e:?}"));

    let described = host
        .describe(DescribeRequest {
            skp: SKP_VERSION.to_string(),
            dataset: open.dataset.clone(),
        })
        .expect("describe the opened dataset");
    assert_eq!(
        described.row_count.value.as_ref().map(|v| v.0),
        Some(LITERAL_FEATURES as u64),
        "describe reports the literal file's own row count"
    );
    assert_ne!(
        described.row_count.value.as_ref().map(|v| v.0),
        Some(DECOY_FEATURES as u64),
        "and not the decoy's"
    );
    assert_eq!(
        described.row_count.basis,
        "identity-uniqueness-scan-full-file"
    );
    // `extent` is a constant of `describe` (`not-established-at-open`), read from no file, so it
    // cannot tell the literal from its decoy; the stream below is what carries the file's rows.
    assert_eq!(described.extent.value, None);

    let ds = host
        .catalog()
        .get(open.dataset.as_str())
        .expect("the catalog holds the opened dataset");
    let mut stream = ds
        .stream_with_cancel(&ViewportQuery::all(), CancelToken::new())
        .expect("the stream is issued");
    let mut ids = Vec::new();
    let mut buf = Vec::new();
    while let Some(item) = stream.next_into(&mut buf) {
        item.expect("a batch");
        let reader = arrow::ipc::reader::StreamReader::try_new(std::io::Cursor::new(&buf), None)
            .expect("an IPC stream");
        for batch in reader {
            let batch = batch.expect("a record batch");
            let column = batch
                .column(0)
                .as_any()
                .downcast_ref::<arrow::array::UInt64Array>()
                .expect("column 0 is the u64 id");
            ids.extend(column.values().iter().copied());
        }
        buf.clear();
    }
    assert_eq!(
        ids.len(),
        LITERAL_FEATURES,
        "the stream carries the literal's rows"
    );
    let distinct: HashSet<u64> = ids.iter().copied().collect();
    assert_eq!(distinct.len(), ids.len(), "and each id once");
}
