// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! C-5S and C-4A of `engine/GEOMETRY-POINTS-PREREGISTRATION.md` §3 and §4: corpus rows #5 and #4,
//! streamed whole.
//!
//! **Ignored, like the P4 generator and `multipolygon_corpus.rs` they sit beside**, because they
//! read the on-disk compatibility corpus, which is outside any worktree
//! (`engine/tests/admission_p4_corpus.rs`'s `CORPUS_ROOT`). Run them with
//! `cargo test -p spatial-engine --test point_corpus -- --ignored`.
//!
//! The predictions, registered before any run (§3): **C-5S**, row #5 streamed whole is 300 rows, one
//! per feature, unique ids, no refusal, every coordinate inside the file's own `bbox` member.
//! **C-4A**, row #4 opened with the catalog assertion `epsg-2056` is admitted, caller-asserted and
//! session-ordinal, and a whole-file stream gives 300 rows with every coordinate inside its `bbox`
//! member. Wrong is a result.

use std::collections::HashSet;
use std::path::Path;

use arrow::array::{Array, FixedSizeListArray, Float64Array, UInt64Array};
use spatial_engine::fixture::LV95_PROJJSON;
use spatial_engine::{CrsAssertion, Dataset, GeometryEncoding, ViewportQuery};

/// `engine/tests/admission_p4_corpus.rs`'s `CORPUS_ROOT`, and rows #4 and #5's `suffix` there.
const CORPUS_ROOT: &str = r"C:\dev\spatial-ide\target\fixtures\compat-corpus";
const ROW_4: &str = "duckdb-spatial/duckdb-lv95range-intkey.parquet";
const ROW_5: &str = "duckdb-spatial/duckdb-degreesrange-nokey.parquet";

/// The files' own `geo.columns.geom.bbox` members (`engine/compat-corpus/of-record/MANIFEST.json`'s
/// `bbox` for each row): `[xmin, ymin, xmax, ymax]`.
const BBOX_4: [f64; 4] = [2_600_000.0, 1_199_000.0, 2_607_992.0, 1_206_950.0];
const BBOX_5: [f64; 4] = [-3.0, 47.0, -0.01, 49.093];

/// Stream the whole file: its row count, its unique ids, and any coordinate outside `bbox`.
fn stream_whole(ds: &Dataset, bbox: [f64; 4]) -> (usize, usize, Vec<[f64; 2]>) {
    let mut s = ds.stream(&ViewportQuery::all()).expect("stream");
    let mut buf = Vec::new();
    let (mut rows, mut outside) = (0usize, Vec::new());
    let mut ids: HashSet<u64> = HashSet::new();
    while let Some(info) = s.next_into(&mut buf) {
        let info = info.expect("no refusal");
        rows += info.rows;
        let mut r =
            arrow::ipc::reader::StreamReader::try_new(std::io::Cursor::new(&buf), None).unwrap();
        let batch = r.next().unwrap().unwrap();
        buf.clear();
        let col = batch
            .column(0)
            .as_any()
            .downcast_ref::<UInt64Array>()
            .expect("ids");
        for id in col.values().iter() {
            assert!(ids.insert(*id), "id {id} repeated");
        }
        let points = batch
            .column(1)
            .as_any()
            .downcast_ref::<FixedSizeListArray>()
            .expect("a point column");
        assert_eq!(points.len(), batch.num_rows(), "one point per row");
        let flat = points
            .values()
            .as_any()
            .downcast_ref::<Float64Array>()
            .expect("coordinates");
        for c in flat.values().chunks_exact(2) {
            let inside = c[0] >= bbox[0] && c[0] <= bbox[2] && c[1] >= bbox[1] && c[1] <= bbox[3];
            if !inside {
                outside.push([c[0], c[1]]);
            }
        }
    }
    (rows, ids.len(), outside)
}

/// C-5S. Row #5, opened as the file declares it and streamed whole: 300 rows, one per feature,
/// unique ids, no refusal, every coordinate inside the `bbox` member.
///
/// RECORDED MUTATION: in `PointBuilder::push_wkb`, swap x and y when appending. Every coordinate is
/// then a longitude read as a latitude, and this test fails by name at the bounds assertion.
///
/// Observed over `d3fe6055` on the uncommitted tree of the engine commit:
/// `streaming_corpus_row_5_whole_file_yields_one_point_per_feature_inside_its_bbox` FAILED with the
/// mutation applied, at `coordinates outside the bbox member`, listing the points with their axes
/// swapped, then reverted.
#[test]
#[ignore = "reads the on-disk compatibility corpus (C:\\dev\\spatial-ide\\target\\fixtures\\compat-corpus)"]
fn streaming_corpus_row_5_whole_file_yields_one_point_per_feature_inside_its_bbox() {
    let ds = Dataset::open(Path::new(CORPUS_ROOT).join(ROW_5)).expect("row #5 opens (§3's C-5)");
    assert_eq!(ds.geometry_encoding(), GeometryEncoding::Point);
    assert_eq!(
        ds.declared_geometry_types(),
        Some(&["Point".to_string()][..]),
        "the declaration is kept as the file wrote it"
    );
    let (rows, unique, outside) = stream_whole(&ds, BBOX_5);
    assert_eq!(rows, 300, "one row per feature");
    assert_eq!(unique, 300, "unique ids");
    assert!(
        outside.is_empty(),
        "coordinates outside the bbox member: {outside:?}"
    );
}

/// C-4A. Row #4 opened with the catalog assertion `epsg-2056`: admitted, caller-asserted,
/// session-ordinal (no `id` column), and a whole-file stream gives 300 rows, every coordinate
/// inside its `bbox` member.
///
/// RECORDED MUTATION: as C-5S, swap x and y in `PointBuilder`. Eastings read as northings leave the
/// `bbox` member and this test fails by name at the bounds assertion.
///
/// Observed over `d3fe6055` on the uncommitted tree of the engine commit:
/// `streaming_corpus_row_4_with_the_catalog_assertion_yields_300_points_inside_its_bbox` FAILED
/// with the mutation applied, at `coordinates outside the bbox member`, listing the points with
/// their axes swapped, then reverted.
#[test]
#[ignore = "reads the on-disk compatibility corpus (C:\\dev\\spatial-ide\\target\\fixtures\\compat-corpus)"]
fn streaming_corpus_row_4_with_the_catalog_assertion_yields_300_points_inside_its_bbox() {
    let assertion = CrsAssertion {
        identifier: "EPSG:2056".into(),
        definition_json: Some(LV95_PROJJSON.to_string()),
        by: "point-corpus-test".into(),
        at: "2026-10-06T00:00:00Z".into(),
        definition_provenance: spatial_engine::definition_provenance(Some(LV95_PROJJSON)),
    };
    let ds = Dataset::open_with_asserted_crs(Path::new(CORPUS_ROOT).join(ROW_4), assertion)
        .expect("row #4 opens under the assertion (§3's C-4A)");
    assert_eq!(ds.geometry_encoding(), GeometryEncoding::Point);
    let md = ds.envelope().schema().metadata().clone();
    assert_eq!(md.get("crs_source").unwrap(), "caller_asserted");
    assert!(
        ds.identity().source().is_session_ordinal(),
        "no `id` column"
    );
    let (rows, unique, outside) = stream_whole(&ds, BBOX_4);
    assert_eq!(rows, 300, "one row per feature");
    assert_eq!(unique, 300, "unique ids");
    assert!(
        outside.is_empty(),
        "coordinates outside the bbox member: {outside:?}"
    );
}
