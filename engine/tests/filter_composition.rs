// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! `cut/sql-filter` phase P2 (see `NEXT-CUT.md`, `CUT-STATE.md`): the identity/CRS preservation
//! property a filtered stream must hold relative to the same unfiltered stream — evidence item E in
//! the piece's brief.
//!
//! **What this file does not do.** It does not validate the predicate's SQL — `AdmittedPredicate::
//! assume_validated` is exactly what its name says, and structural/namespace/bind admission is a
//! later piece in this cut (P3, wired in P4). This file only proves that, once a predicate reaches
//! `build_sql` verbatim, the rows a filtered query keeps are **unmodified**: same ids, same geometry
//! bytes, same envelope — a filter selects rows, it never re-keys or reprojects them (`NEXT-CUT.md`
//! design essential 6; ADR-006 class 1: a pure transform, replayable, no undo owed).

use std::collections::BTreeMap;

use arrow::array::Array;
use spatial_engine::fixture::{write_geoparquet, AttributeMode, CrsMode, FixtureSpec, ZONE_VALUES};
use spatial_engine::{AdmittedPredicate, Dataset, ViewportQuery, ID_COLUMN};

fn dir(name: &str) -> std::path::PathBuf {
    let d = std::env::temp_dir().join("spatial-engine-filter-composition-tests").join(name);
    std::fs::create_dir_all(&d).unwrap();
    d
}

fn zoned_spec(features: usize) -> FixtureSpec {
    FixtureSpec {
        features,
        attributes: AttributeMode::CategoricalZone,
        crs_mode: CrsMode::DeclaredLv95,
        ..Default::default()
    }
}

/// A stable digest of one feature's GeoArrow coordinates.
///
/// Taken over the **decoded coordinates**, not over WKB: the engine emits GeoArrow, so WKB is not
/// on the wire to hash. The same construction `engine/tests/first_batch_and_pruning.rs`'s
/// `geometry_digest` uses — duplicated here rather than shared, since this workspace's integration
/// test binaries do not import code from one another.
fn geometry_digest(col: &arrow::array::ArrayRef, row: usize) -> String {
    use sha2::{Digest, Sha256};
    let list = col
        .as_any()
        .downcast_ref::<arrow::array::ListArray>()
        .expect("geometry is List<rings>");
    let rings = list.value(row);
    let rings = rings.as_any().downcast_ref::<arrow::array::ListArray>().expect("List<vertices>");
    let mut h = Sha256::new();
    for r in 0..rings.len() {
        let verts = rings.value(r);
        let verts = verts
            .as_any()
            .downcast_ref::<arrow::array::FixedSizeListArray>()
            .expect("FixedSizeList<xy>");
        let xy = verts.values();
        let xy = xy.as_any().downcast_ref::<arrow::array::Float64Array>().expect("f64 xy");
        h.update((xy.len() as u64).to_le_bytes());
        for v in xy.values() {
            h.update(v.to_bits().to_le_bytes());
        }
    }
    format!("{:x}", h.finalize())
}

/// Drain a whole stream into `(id -> geometry digest)`, plus the schema its envelope carried — as
/// decoded from the wire, not from `BatchStream::envelope()`, so the comparison is over what a
/// consumer actually receives rather than over the producer's own bookkeeping.
fn drain_digests(
    mut stream: spatial_engine::BatchStream,
) -> (BTreeMap<u64, String>, arrow::datatypes::SchemaRef) {
    let mut out = BTreeMap::new();
    let mut buf = Vec::new();
    let mut schema = None;
    while let Some(info) = stream.next_into(&mut buf) {
        info.expect("batch");
        let reader = arrow::ipc::reader::StreamReader::try_new(std::io::Cursor::new(&buf), None)
            .expect("ipc reader");
        if schema.is_none() {
            schema = Some(reader.schema());
        }
        for batch in reader {
            let batch = batch.expect("record batch");
            let ids = batch
                .column_by_name(ID_COLUMN)
                .expect("id column")
                .as_any()
                .downcast_ref::<arrow::array::UInt64Array>()
                .expect("u64 ids")
                .clone();
            let geom = batch.column_by_name("geometry").expect("geometry column");
            for r in 0..batch.num_rows() {
                out.insert(ids.value(r), geometry_digest(geom, r));
            }
        }
        buf.clear();
    }
    (out, schema.expect("a fully-drained stream produced at least one batch"))
}

/// Evidence item E: a filtered stream's rows are an id-keyed **subset** of the unfiltered stream's
/// over the same query otherwise, with **byte-identical per-id payloads**, and the envelope schema
/// metadata is byte-identical filtered vs. unfiltered.
///
/// The predicate (`zone = 'residential'`, one of `fixture::ZONE_VALUES`) is the simple attribute
/// predicate the fixture schema supports — `AttributeMode::CategoricalZone` is the only attribute
/// column any fixture in this crate writes, and its four named values plus NULL (`fixture.rs`'s own
/// module doc) partition ~3200 rows into five non-trivial buckets, so this predicate excludes real
/// rows rather than vacuously keeping everything.
#[test]
fn a_filtered_stream_is_an_id_keyed_subset_with_byte_identical_rows_and_envelope() {
    let spec = zoned_spec(4_000);
    let path = dir("subset").join("zoned.parquet");
    let facts = write_geoparquet(&path, &spec).expect("fixture");
    assert!(
        facts.zone_counts.iter().all(|&n| n > 0) && facts.zone_nulls > 0,
        "the fixture must actually exercise every zone plus NULL, or this test's subset claim is \
         vacuous: {:?}",
        facts.zone_counts
    );

    let ds = Dataset::open(&path).expect("open");

    let (unfiltered, unfiltered_schema) =
        drain_digests(ds.stream(&ViewportQuery::all()).expect("unfiltered stream"));

    let predicate = AdmittedPredicate::assume_validated(format!("zone = '{}'", ZONE_VALUES[0]));
    let filtered_query = ViewportQuery::all().with_filter(predicate);
    let (filtered, filtered_schema) =
        drain_digests(ds.stream(&filtered_query).expect("filtered stream"));

    assert!(!filtered.is_empty(), "the predicate selected nothing; this test proves nothing");
    assert!(
        filtered.len() < unfiltered.len(),
        "the predicate excluded nothing ({} == {}); this test proves nothing about filtering",
        filtered.len(),
        unfiltered.len()
    );

    // The subset property, id by id, with the byte-identical-payload check folded in: `digest` is
    // computed over the row's own decoded coordinates, so two different digests at the same id would
    // mean the filtered scan altered that row's geometry — never observed here.
    for (id, digest) in &filtered {
        let unfiltered_digest = unfiltered
            .get(id)
            .unwrap_or_else(|| panic!("filtered id {id} does not appear in the unfiltered stream"));
        assert_eq!(
            unfiltered_digest, digest,
            "row {id} survived the filter with different geometry bytes than the unfiltered stream \
             carries for the same id — a filter must select rows, never alter them"
        );
    }

    assert_eq!(
        filtered_schema, unfiltered_schema,
        "a WHERE predicate must not change the envelope's schema metadata: identity, CRS, frame and \
         projection are all unchanged by a row filter (ADR-010 rule 1; NEXT-CUT.md design essential 6)"
    );
}
