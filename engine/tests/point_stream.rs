// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! S-P1 to S-P3 of `engine/GEOMETRY-POINTS-PREREGISTRATION.md` §4: the point encoding as a real
//! stream carries one row per feature, a row of a type the open's encoding does not read stops the
//! stream at that row by name, and the batch-size estimate bounds a point batch.
//!
//! **Real shape.** Each case writes a real GeoParquet file through `spatial_engine::fixture`, opens
//! it through `Dataset::open`, streams it through `Dataset::stream`, and decodes the Arrow IPC bytes
//! that came out. The expected positions are written down first, as numbers, and encoded to WKB by
//! the fixture module's own encoder, so the oracle is not the decoder under test.

use std::path::PathBuf;

use arrow::array::{Array, FixedSizeListArray, Float64Array, RecordBatch, UInt64Array};
use spatial_engine::fixture::{
    encode_point, point_p1, point_p1_rows, write_geoparquet, DeclaredTypes, FixtureSpec,
    GeometryMode, E_LO, N_LO,
};
use spatial_engine::wkb::encode_polygon;
use spatial_engine::{CancelToken, Dataset, EngineError, GeometryEncoding, ViewportQuery};

fn workspace(name: &str) -> PathBuf {
    let d = std::env::temp_dir()
        .join("spatial-engine-point-stream")
        .join(name);
    let _ = std::fs::remove_dir_all(&d);
    std::fs::create_dir_all(&d).unwrap();
    d
}

fn open(name: &str, declared: &str, rows: Vec<Vec<u8>>) -> Dataset {
    let path = workspace(name).join("f.parquet");
    write_geoparquet(
        &path,
        &FixtureSpec {
            geometry: GeometryMode::Rows(rows),
            with_covering_bbox: false,
            declared_types: DeclaredTypes::Json(declared.to_string()),
            ..Default::default()
        },
    )
    .unwrap();
    Dataset::open(&path).unwrap()
}

fn decode(buf: &[u8]) -> RecordBatch {
    let mut r =
        arrow::ipc::reader::StreamReader::try_new(std::io::Cursor::new(buf), None).expect("ipc");
    let batch = r.next().expect("one batch").expect("decodes");
    assert!(r.next().is_none());
    batch
}

/// A point batch's geometry column: the fixed-size list, and its coordinate run.
fn points_of(batch: &RecordBatch) -> (&FixedSizeListArray, Vec<[f64; 2]>) {
    let points = batch
        .column(1)
        .as_any()
        .downcast_ref::<FixedSizeListArray>()
        .expect("a point column is a fixed-size list, with no list level above it");
    let flat = points
        .values()
        .as_any()
        .downcast_ref::<Float64Array>()
        .expect("coordinates");
    (
        points,
        flat.values()
            .chunks_exact(2)
            .map(|c| [c[0], c[1]])
            .collect(),
    )
}

fn ids_of(batch: &RecordBatch) -> Vec<u64> {
    let ids = batch
        .column(0)
        .as_any()
        .downcast_ref::<UInt64Array>()
        .expect("ids");
    ids.values().to_vec()
}

fn bits(points: &[[f64; 2]]) -> Vec<u64> {
    points.iter().flatten().map(|v| v.to_bits()).collect()
}

/// S-P1. P-1 streams one row per feature, ids unique and unrepeated, every coordinate bit-identical
/// to the WKB the fixture wrote. The envelope key and the geometry field carry the one value, and
/// the publish stream's own `xy_bounds` is the points' minimum and maximum.
///
/// RECORDED MUTATION: in `PointBuilder::push_wkb`, push y before x. Every point then arrives with
/// its axes swapped and this test fails by name at the coordinate comparison.
///
/// Observed over `d3fe6055` on the uncommitted tree of the engine commit:
/// `p1_streams_one_row_per_feature_with_bit_identical_coordinates` FAILED with the mutation
/// applied, at the comparison of the streamed points with P-1's positions, then reverted.
#[test]
fn p1_streams_one_row_per_feature_with_bit_identical_coordinates() {
    let want = point_p1([E_LO, N_LO], 10.0);
    let ds = open("s-p1", r#"["Point"]"#, point_p1_rows([E_LO, N_LO], 10.0));
    assert_eq!(ds.geometry_encoding(), GeometryEncoding::Point);

    let mut s = ds.stream(&ViewportQuery::all()).expect("stream");
    let mut buf = Vec::new();
    let info = s
        .next_into(&mut buf)
        .expect("a batch")
        .expect("not a refusal");
    assert_eq!(info.rows, 6);
    assert_eq!(info.vertices, 6, "one vertex per row");
    let batch = decode(&buf);
    assert!(s.next_into(&mut Vec::new()).is_none(), "P-1 is one batch");
    let (points, got) = points_of(&batch);
    assert_eq!(points.len(), 6, "one row per feature");
    assert_eq!(ids_of(&batch), vec![0, 1, 2, 3, 4, 5], "no id repeated");
    assert_eq!(got, want);
    assert_eq!(bits(&got), bits(&want), "coordinate bit patterns survive");

    // The key, the field and the file's encoding are one value, in the batch as it travelled.
    let schema = batch.schema();
    assert_eq!(
        schema.metadata().get("geometry_encoding").unwrap(),
        "geoarrow.point"
    );
    assert_eq!(
        schema
            .field(1)
            .metadata()
            .get("ARROW:extension:name")
            .unwrap(),
        "geoarrow.point"
    );

    // The publish stream reports each batch's own extent: the points' minimum and maximum.
    let fields = ds.resolve_projection(&[]).unwrap();
    let mut p = ds
        .stream_for_publish(&ViewportQuery::all(), &fields, CancelToken::new())
        .unwrap();
    let info = p
        .next_into(&mut Vec::new())
        .expect("a batch")
        .expect("not a refusal");
    let min = |axis: usize| want.iter().map(|p| p[axis]).fold(f64::INFINITY, f64::min);
    let max = |axis: usize| {
        want.iter()
            .map(|p| p[axis])
            .fold(f64::NEG_INFINITY, f64::max)
    };
    assert_eq!(info.xy_bounds, Some([min(0), min(1), max(0), max(1)]));
}

/// Drain a stream that is expected to refuse: the ids of every batch delivered before the refusal,
/// the refusal itself, and whether the stream is over afterwards.
fn drain_to_refusal(ds: &Dataset) -> (Vec<u64>, EngineError, bool) {
    let mut s = ds.stream(&ViewportQuery::all()).expect("stream");
    let mut ids = Vec::new();
    let mut buf = Vec::new();
    loop {
        match s.next_into(&mut buf) {
            Some(Ok(_)) => {
                ids.extend(ids_of(&decode(&buf)));
                buf.clear();
            }
            Some(Err(e)) => {
                let ended = s.next_into(&mut buf).is_none();
                return (ids, e, ended);
            }
            None => panic!("the stream ended cleanly; the unreadable row was skipped or accepted"),
        }
    }
}

/// S-P2. P-6 and P-7: a Polygon row, or a MultiPoint row, under `["Point"]` ends the stream, typed
/// `engine.wkb`, at that row. Every earlier row was delivered, nothing after it is, and nothing is
/// skipped. The text names the type met and carries the placeholder mark.
///
/// RECORDED MUTATION: in `stream.rs`'s producer loop, skip a row the builder refuses
/// (`if pending.builder.push_wkb(wkb).is_err() { continue; }` in place of the `?`). The stream then
/// ends cleanly with the row dropped and this test fails by name at `the stream ended cleanly`.
///
/// Observed over `d3fe6055` on the uncommitted tree of the engine commit:
/// `a_row_of_an_unread_type_stops_a_point_stream_at_that_row_by_name` FAILED with the mutation
/// applied, at `the stream ended cleanly; the unreadable row was skipped or accepted`, then
/// reverted.
#[test]
fn a_row_of_an_unread_type_stops_a_point_stream_at_that_row_by_name() {
    const N: usize = 3_000;
    const BAD: usize = 2_500;
    let point = |i: usize| -> Vec<u8> {
        encode_point(
            E_LO + (i % 100) as f64 * 10.5,
            N_LO + (i / 100) as f64 * 10.5,
        )
    };
    let polygon = encode_polygon(&[vec![
        [E_LO, N_LO],
        [E_LO + 5.0, N_LO],
        [E_LO + 5.0, N_LO + 5.0],
        [E_LO, N_LO],
    ]]);
    let multipoint = {
        let mut m = vec![1u8];
        m.extend_from_slice(&4u32.to_le_bytes());
        m.extend_from_slice(&1u32.to_le_bytes());
        m.extend_from_slice(&encode_point(E_LO, N_LO));
        m
    };

    // (name, the row planted at BAD, the type the refusal must name)
    let cases: [(&str, &Vec<u8>, &str); 2] = [
        ("s-p2-p6", &polygon, "geometry type 3 met"),
        ("s-p2-p7", &multipoint, "geometry type 4 met"),
    ];
    for (name, bad, named) in cases {
        let rows: Vec<Vec<u8>> = (0..N)
            .map(|i| if i == BAD { bad.clone() } else { point(i) })
            .collect();
        let ds = open(name, r#"["Point"]"#, rows);
        let (ids, err, ended) = drain_to_refusal(&ds);
        let EngineError::Wkb(detail) = err else {
            panic!("{name}: expected engine.wkb, got {err}");
        };
        assert!(detail.starts_with("[P6 placeholder] "), "{name}: {detail}");
        assert!(detail.contains(named), "{name}: {detail}");
        assert!(ended, "{name}: a batch followed the refusal");
        assert!(!ids.is_empty(), "{name}: no batch preceded the refusal");
        assert!(
            ids.iter().all(|id| (*id as usize) < BAD),
            "{name}: a row at or after the refused one was delivered"
        );
        assert_eq!(
            ids,
            (0..ids.len() as u64).collect::<Vec<_>>(),
            "{name}: a row before the refused one was skipped"
        );
    }
}

/// S-P3. For every batch of a 50,000-point stream cut at the default size targets, the geometry
/// array's own bytes (16 B a coordinate pair, no offsets) are at most the geometry share of the
/// unedited estimate, 16 B a vertex plus 4 B per row and per vertex, and with the 8 B per id they
/// fit inside the target the batch was cut at (invalidator I-3).
///
/// RECORDED MUTATION: in `stream.rs::estimate_bytes`, change `vertices * 16` to `vertices * 4`.
/// Batches are then packed past what the estimate should allow and this test fails by name at the
/// first batch whose bytes exceed its target.
///
/// Observed over `d3fe6055` on the uncommitted tree of the engine commit:
/// `every_point_batch_fits_its_target_under_the_unedited_estimate` FAILED with the mutation
/// applied, at batch 0: 78,624 B of geometry and ids against its 65,536 B target, 3,276 rows, then
/// reverted.
#[test]
fn every_point_batch_fits_its_target_under_the_unedited_estimate() {
    const N: usize = 50_000;
    let rows: Vec<Vec<u8>> = (0..N)
        .map(|i| {
            encode_point(
                E_LO + (i % 250) as f64 * 10.25,
                N_LO + (i / 250) as f64 * 10.25,
            )
        })
        .collect();
    let ds = open("s-p3", r#"["Point"]"#, rows);
    let mut s = ds.stream(&ViewportQuery::all()).expect("stream");
    let mut buf = Vec::new();
    let (mut batches, mut multi_row_batches, mut delivered) = (0usize, 0usize, 0usize);
    while let Some(info) = s.next_into(&mut buf) {
        let info = info.expect("a batch");
        let batch = decode(&buf);
        buf.clear();
        batches += 1;
        delivered += batch.num_rows();

        let (points, got) = points_of(&batch);
        let vertices = got.len();
        assert_eq!(vertices, points.len(), "one vertex per row");
        assert_eq!(vertices, info.vertices, "the batch's own vertex count");
        let geometry_bytes = 16 * vertices;
        let share = 16 * vertices + 4 * (batch.num_rows() + vertices);
        assert!(
            geometry_bytes <= share,
            "batch {}: {geometry_bytes} B of geometry exceed the estimate's share of {share} B",
            info.batch_index
        );
        if batch.num_rows() > 1 {
            multi_row_batches += 1;
            assert!(
                geometry_bytes + 8 * batch.num_rows() <= info.target_bytes,
                "batch {}: {} B of geometry and ids exceed its {} B target ({} rows)",
                info.batch_index,
                geometry_bytes + 8 * batch.num_rows(),
                info.target_bytes,
                batch.num_rows(),
            );
        }
    }
    assert_eq!(delivered, N, "every feature was delivered");
    assert!(
        batches >= 3 && multi_row_batches >= 3,
        "the fixture must span several size-cut batches ({batches} batches)"
    );
}
