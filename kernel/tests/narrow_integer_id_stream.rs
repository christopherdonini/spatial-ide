// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

mod watch_support;

use std::collections::BTreeSet;
use std::io::Cursor;
use std::path::PathBuf;
use std::sync::Arc;

use arrow::array::UInt64Array;
use spatial_data_plane::transport::{OpenRequest, SourceFactory};
use spatial_engine::fixture::{
    write_geoparquet, FixtureSpec, IdentityMode, NarrowColumn, NarrowValues, NarrowWidth,
};
use spatial_kernel::skp::{session_end_channel, SkpHost, StreamRegistry};
use spatial_kernel::{Catalog, EngineSourceFactory, OPERATION};
use spatial_skp::v0::{DatasetHandle, ViewportQueryRequest, SKP_VERSION};

const FEATURES: usize = 100;

/// An Int32 `id` file (100 rows, written by the fixture's `NarrowInteger` mode at top of range)
/// is opened in the host's catalog. `SkpHost::viewport_query` mints the ticket, and
/// `EngineSourceFactory::ticket_only` redeems it into the source the data plane drains. The test
/// drains that source's `next_into` and asserts that no item is an error, that each buffer decodes
/// as an Arrow IPC stream whose `id` column is `UInt64`, and that the 100 ids are the written set.
///
/// RECORDED MUTATION (observed at `8cce80cade922cfbec62d8de6064f76fd1cab488`, on the uncommitted
/// tree): the Int32 arm removed from the engine's `column_u64`. Observed outcome: this test fails
/// by name at the terminal-error panic, with the detail ``engine.query: query: `id` is Int32;
/// expected a 64-bit integer``.
#[test]
fn a_narrow_integer_id_file_opened_through_the_kernel_streams_to_the_data_plane_without_a_terminal_error(
) {
    let dir = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("../target/fixtures/narrow-integer-id-stream-kernel");
    std::fs::create_dir_all(&dir).expect("fixture dir");
    let path = dir.join("int32-id.parquet");
    write_geoparquet(
        &path,
        &FixtureSpec {
            features: FEATURES,
            avg_vertices: 8,
            identity: IdentityMode::NarrowInteger {
                width: NarrowWidth::Int32,
                column: NarrowColumn::Id,
                values: NarrowValues::TopOfRange,
            },
            ..Default::default()
        },
    )
    .expect("write fixture");

    let handle = DatasetHandle::mint();
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
    let ticket = host
        .viewport_query(ViewportQueryRequest {
            skp: SKP_VERSION.to_string(),
            dataset: handle,
            bbox: None,
            bbox_crs: None,
            limit: None,
            filter: None,
            columns: None,
        })
        .expect("viewport_query mints a ticket");

    let factory = EngineSourceFactory::ticket_only(catalog, tickets, host.generations());
    let (mut source, _cancel) = factory
        .create(&OpenRequest {
            operation: OPERATION.to_string(),
            params: ticket.stream.as_str().as_bytes().to_vec(),
        })
        .expect("the ticket redeems into a source");

    let mut ids = Vec::new();
    let mut buf = Vec::new();
    while let Some(item) = source.next_into(&mut buf) {
        if let Err(detail) = item {
            panic!("the data plane received a terminal error: {detail}");
        }
        let reader = arrow::ipc::reader::StreamReader::try_new(Cursor::new(&buf), None)
            .expect("each buffer is an Arrow IPC stream");
        for batch in reader {
            let batch = batch.expect("decode batch");
            let col = batch
                .column_by_name("id")
                .expect("batch has id")
                .as_any()
                .downcast_ref::<UInt64Array>()
                .expect("id arrives as UInt64");
            ids.extend(col.values().iter().copied());
        }
        buf.clear();
    }
    assert_eq!(ids.len(), FEATURES, "row count");
    assert_eq!(
        ids.iter().copied().collect::<BTreeSet<_>>(),
        (0..FEATURES as u64)
            .map(|i| i32::MAX as u64 - i)
            .collect::<BTreeSet<_>>(),
        "ids equal the written set"
    );
}
