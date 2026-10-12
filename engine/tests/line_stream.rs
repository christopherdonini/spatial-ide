// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! S-L1 to S-L3 of `engine/GEOMETRY-LINES-PREREGISTRATION.md` §4: the two line encodings as a real
//! stream carry one row per feature, a row of a type the open's encoding does not read stops the
//! stream at that row by name, and the batch-size estimate bounds a line batch.
//!
//! **Real shape.** Each case writes a real GeoParquet file through `spatial_engine::fixture`, opens
//! it through `Dataset::open`, streams it through `Dataset::stream`, and decodes the Arrow IPC bytes
//! that came out. The expected positions are written down first, as numbers, and encoded to WKB by
//! the fixture module's own encoders, so the oracle is not the decoder under test.
//!
//! **A multilinestring array has the polygon array's shape**, so every reader here is told which
//! encoding it is reading, from the open, and never works it out from the array.

use std::path::PathBuf;

use arrow::array::{Array, FixedSizeListArray, Float64Array, ListArray, RecordBatch, UInt64Array};
use spatial_engine::fixture::{
    encode_linestring, encode_multilinestring, line_l1, line_l1_rows, multilinestring_ml1,
    multilinestring_ml1_rows, point_p1_rows, write_geoparquet, DeclaredTypes, FixtureSpec,
    GeometryMode, E_LO, N_LO,
};
use spatial_engine::wkb::encode_polygon;
use spatial_engine::{CancelToken, Dataset, EngineError, GeometryEncoding, ViewportQuery};

fn workspace(name: &str) -> PathBuf {
    let d = std::env::temp_dir()
        .join("spatial-engine-line-stream")
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

/// The geometry column of a batch the open says is `geoarrow.linestring`: the list, the fixed-size
/// list under it (no second list level), and its coordinate run.
fn line_arrays(batch: &RecordBatch) -> (&ListArray, &FixedSizeListArray, &Float64Array) {
    let lines = batch
        .column(1)
        .as_any()
        .downcast_ref::<ListArray>()
        .expect("a linestring column is a list");
    let vertices = lines
        .values()
        .as_any()
        .downcast_ref::<FixedSizeListArray>()
        .expect("a linestring's children are coordinate pairs, with no second list level");
    let flat = vertices
        .values()
        .as_any()
        .downcast_ref::<Float64Array>()
        .expect("coordinates");
    (lines, vertices, flat)
}

fn pairs(flat: &Float64Array, from: usize, to: usize) -> Vec<[f64; 2]> {
    flat.values()[from * 2..to * 2]
        .chunks_exact(2)
        .map(|c| [c[0], c[1]])
        .collect()
}

/// A `geoarrow.linestring` batch as one position list per row.
fn lines_of(batch: &RecordBatch) -> Vec<Vec<[f64; 2]>> {
    let (lines, _, flat) = line_arrays(batch);
    let o = lines.value_offsets();
    (0..lines.len())
        .map(|i| pairs(flat, o[i] as usize, o[i + 1] as usize))
        .collect()
}

/// The arrays of a batch the open says is `geoarrow.multilinestring`: rows, parts, coordinates.
fn multiline_arrays(batch: &RecordBatch) -> (&ListArray, &ListArray, &Float64Array) {
    let rows = batch
        .column(1)
        .as_any()
        .downcast_ref::<ListArray>()
        .expect("a multilinestring column is a list");
    let parts = rows
        .values()
        .as_any()
        .downcast_ref::<ListArray>()
        .expect("a multilinestring's children are lines");
    let vertices = parts
        .values()
        .as_any()
        .downcast_ref::<FixedSizeListArray>()
        .expect("a line's children are coordinate pairs");
    let flat = vertices
        .values()
        .as_any()
        .downcast_ref::<Float64Array>()
        .expect("coordinates");
    (rows, parts, flat)
}

/// A `geoarrow.multilinestring` batch as one list of position lists per row.
fn multilines_of(batch: &RecordBatch) -> Vec<Vec<Vec<[f64; 2]>>> {
    let (rows, parts, flat) = multiline_arrays(batch);
    let (ro, po) = (rows.value_offsets(), parts.value_offsets());
    (0..rows.len())
        .map(|i| {
            (ro[i] as usize..ro[i + 1] as usize)
                .map(|p| pairs(flat, po[p] as usize, po[p + 1] as usize))
                .collect()
        })
        .collect()
}

fn ids_of(batch: &RecordBatch) -> Vec<u64> {
    let ids = batch
        .column(0)
        .as_any()
        .downcast_ref::<UInt64Array>()
        .expect("ids");
    ids.values().to_vec()
}

fn bits<'a>(positions: impl IntoIterator<Item = &'a [f64; 2]>) -> Vec<u64> {
    positions
        .into_iter()
        .flatten()
        .map(|v| v.to_bits())
        .collect()
}

/// The one batch of a whole-file stream: its bytes, and its info.
fn only_batch(ds: &Dataset) -> (RecordBatch, usize, usize) {
    let mut s = ds.stream(&ViewportQuery::all()).expect("stream");
    let mut buf = Vec::new();
    let info = s
        .next_into(&mut buf)
        .expect("a batch")
        .expect("not a refusal");
    let batch = decode(&buf);
    assert!(s.next_into(&mut Vec::new()).is_none(), "one batch");
    (batch, info.rows, info.vertices)
}

fn minmax(positions: &[[f64; 2]]) -> [f64; 4] {
    let min = |axis: usize| {
        positions
            .iter()
            .map(|p| p[axis])
            .fold(f64::INFINITY, f64::min)
    };
    let max = |axis: usize| {
        positions
            .iter()
            .map(|p| p[axis])
            .fold(f64::NEG_INFINITY, f64::max)
    };
    [min(0), min(1), max(0), max(1)]
}

/// The extent the publish stream reports for the dataset's one batch.
fn publish_bounds(ds: &Dataset) -> Option<[f64; 4]> {
    let fields = ds.resolve_projection(&[]).unwrap();
    let mut p = ds
        .stream_for_publish(&ViewportQuery::all(), &fields, CancelToken::new())
        .unwrap();
    p.next_into(&mut Vec::new())
        .expect("a batch")
        .expect("not a refusal")
        .xy_bounds
}

/// S-L1. L-1 and ML-1 stream one row per feature, ids unique and unrepeated, every position
/// bit-identical to the WKB the fixture wrote and every part where the fixture put it (ML-1's six
/// parts over three rows, and a LineString row beside a MultiLineString row as one part, L-5). The
/// envelope key and the geometry field carry the one value, and the publish stream's own
/// `xy_bounds` is the vertices' minimum and maximum.
///
/// RECORDED MUTATION: in `read_line`, push y before x. Every position then arrives with its axes
/// swapped and this test fails by name at the position comparison.
///
/// Observed over `6f4cc949` on the uncommitted tree of the engine commit:
/// `l1_and_ml1_stream_one_row_per_feature_with_bit_identical_positions_and_parts` FAILED with the
/// mutation applied, at the `assert_eq!(got, want)` of L-1's streamed positions, every pair
/// swapped, then reverted.
#[test]
fn l1_and_ml1_stream_one_row_per_feature_with_bit_identical_positions_and_parts() {
    // L-1.
    let want = line_l1([E_LO, N_LO], 10.0);
    let ds = open(
        "s-l1",
        r#"["LineString"]"#,
        line_l1_rows([E_LO, N_LO], 10.0),
    );
    assert_eq!(ds.geometry_encoding(), GeometryEncoding::LineString);
    let (batch, rows, vertices) = only_batch(&ds);
    assert_eq!((rows, vertices), (5, 16), "one row per feature");
    assert_eq!(ids_of(&batch), vec![0, 1, 2, 3, 4], "no id repeated");
    let got = lines_of(&batch);
    assert_eq!(got, want);
    assert_eq!(
        bits(got.iter().flatten()),
        bits(want.iter().flatten()),
        "position bit patterns survive"
    );
    let schema = batch.schema();
    assert_eq!(
        schema.metadata().get("geometry_encoding").unwrap(),
        "geoarrow.linestring"
    );
    assert_eq!(
        schema
            .field(1)
            .metadata()
            .get("ARROW:extension:name")
            .unwrap(),
        "geoarrow.linestring"
    );
    let all: Vec<[f64; 2]> = want.iter().flatten().copied().collect();
    assert_eq!(publish_bounds(&ds), Some(minmax(&all)));

    // ML-1: three rows, six parts; the part ordinals are not the row indices.
    let want = multilinestring_ml1([E_LO, N_LO], 10.0);
    let ds = open(
        "s-ml1",
        r#"["MultiLineString"]"#,
        multilinestring_ml1_rows([E_LO, N_LO], 10.0),
    );
    assert_eq!(ds.geometry_encoding(), GeometryEncoding::MultiLineString);
    let (batch, rows, vertices) = only_batch(&ds);
    assert_eq!((rows, vertices), (3, 15), "one row per feature, parts kept");
    assert_eq!(ids_of(&batch), vec![0, 1, 2]);
    let got = multilines_of(&batch);
    assert_eq!(got, want);
    assert_eq!(
        bits(got.iter().flatten().flatten()),
        bits(want.iter().flatten().flatten())
    );
    let (_, parts, _) = multiline_arrays(&batch);
    assert_eq!(parts.len(), 6, "six parts over three rows");
    assert_eq!(
        batch.schema().metadata().get("geometry_encoding").unwrap(),
        "geoarrow.multilinestring"
    );
    let all: Vec<[f64; 2]> = want.iter().flatten().flatten().copied().collect();
    assert_eq!(publish_bounds(&ds), Some(minmax(&all)));

    // L-5: LineString rows beside MultiLineString rows, under one multilinestring encoding. A
    // LineString row is one part.
    let lines = line_l1([E_LO, N_LO], 10.0);
    let rows: Vec<Vec<u8>> = (0..3)
        .flat_map(|i| {
            [
                encode_linestring(&lines[i]),
                encode_multilinestring(&want[i]),
            ]
        })
        .collect();
    let ds = open("s-l5", r#"["LineString","MultiLineString"]"#, rows);
    assert_eq!(ds.geometry_encoding(), GeometryEncoding::MultiLineString);
    let (batch, rows, _) = only_batch(&ds);
    assert_eq!(rows, 6);
    let got = multilines_of(&batch);
    for i in 0..3 {
        assert_eq!(
            got[2 * i],
            vec![lines[i].clone()],
            "a LineString row is one part"
        );
        assert_eq!(got[2 * i + 1], want[i]);
    }
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

/// S-L2. L-7, L-9 and L-10: a row of a type the open's encoding does not read ends the stream,
/// typed `engine.wkb`, at that row. Every earlier row was delivered, nothing after it is, and
/// nothing is skipped. The text names the type met and carries the placeholder mark. L-9 meets the
/// refusal at row 0, so no batch precedes it.
///
/// RECORDED MUTATION: in `stream.rs`'s producer loop, skip a row the builder refuses
/// (`if pending.builder.push_wkb(wkb).is_err() { continue; }` in place of the `?`). The stream then
/// ends cleanly with the row dropped and this test fails by name at `the stream ended cleanly`.
///
/// Observed over `6f4cc949` on the uncommitted tree of the engine commit:
/// `a_row_of_an_unread_type_stops_a_line_stream_at_that_row_by_name` FAILED with the mutation
/// applied, at `the stream ended cleanly; the unreadable row was skipped or accepted`, then
/// reverted.
#[test]
fn a_row_of_an_unread_type_stops_a_line_stream_at_that_row_by_name() {
    const N: usize = 3_000;
    const BAD: usize = 2_500;
    let line = |i: usize| -> Vec<u8> {
        let x = E_LO + (i % 100) as f64 * 10.5;
        let y = N_LO + (i / 100) as f64 * 10.5;
        encode_linestring(&[[x, y], [x + 4.0, y + 3.0], [x + 8.0, y]])
    };
    let polygon = encode_polygon(&[vec![
        [E_LO, N_LO],
        [E_LO + 5.0, N_LO],
        [E_LO + 5.0, N_LO + 5.0],
        [E_LO, N_LO],
    ]]);
    let multiline = encode_multilinestring(&[vec![[E_LO, N_LO], [E_LO + 5.0, N_LO]]]);

    // (name, declared set, whether the other rows are polygons, the row planted at BAD, the type
    // the refusal must name). L-10: an empty declaration selects the multipolygon encoding, which
    // reads polygon rows and refuses a line.
    let line0 = line(0);
    let cases: [(&str, &str, bool, &Vec<u8>, &str); 3] = [
        (
            "s-l2-polygon",
            r#"["LineString"]"#,
            false,
            &polygon,
            "geometry type 3 met",
        ),
        (
            "s-l2-multiline",
            r#"["LineString"]"#,
            false,
            &multiline,
            "geometry type 5 met",
        ),
        ("s-l2-empty", "[]", true, &line0, "geometry type 2 met"),
    ];
    for (name, declared, others_are_polygons, bad, named) in cases {
        let rows: Vec<Vec<u8>> = (0..N)
            .map(|i| match (i == BAD, others_are_polygons) {
                (true, _) => bad.clone(),
                (false, true) => polygon.clone(),
                (false, false) => line(i),
            })
            .collect();
        let ds = open(name, declared, rows);
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

    // L-9: P-1's Point rows under `["LineString"]`. The open is admitted and row 0 is refused.
    let ds = open(
        "s-l9",
        r#"["LineString"]"#,
        point_p1_rows([E_LO, N_LO], 10.0),
    );
    assert_eq!(ds.geometry_encoding(), GeometryEncoding::LineString);
    let (ids, err, ended) = drain_to_refusal(&ds);
    let EngineError::Wkb(detail) = err else {
        panic!("L-9: expected engine.wkb, got {err}");
    };
    assert!(detail.contains("geometry type 1 met"), "{detail}");
    assert!(ids.is_empty(), "L-9: a batch preceded the refusal at row 0");
    assert!(ended);
}

/// The bytes of a line batch's geometry, read from its own Arrow buffers: 8 B for every coordinate
/// value and 4 B for every entry of every offsets buffer.
fn geometry_bytes(batch: &RecordBatch, multi: bool) -> (usize, usize) {
    if multi {
        let (rows, parts, flat) = multiline_arrays(batch);
        let vertices = flat.len() / 2;
        (
            8 * flat.len() + 4 * (parts.value_offsets().len() + rows.value_offsets().len()),
            vertices,
        )
    } else {
        let (lines, _, flat) = line_arrays(batch);
        (
            8 * flat.len() + 4 * lines.value_offsets().len(),
            flat.len() / 2,
        )
    }
}

/// S-L3. For every batch of a 20,000-linestring stream (2 to 50 positions each) and of a
/// 20,000-multilinestring stream (parts of two positions), cut at the default size targets, the
/// geometry array's own bytes, read from its Arrow buffers (8 B a coordinate value, 4 B an offsets
/// entry), are at most the geometry share of the unedited estimate, 16 B a vertex plus 4 B per row
/// and per vertex, and with the 8 B per id they fit inside the target the batch was cut at
/// (invalidator I-3). The bound is not recomputed from the quantity it bounds.
///
/// RECORDED MUTATION: in `stream.rs::estimate_bytes`, change `vertices * 16` to `vertices * 4`.
/// Batches are then packed past what the estimate should allow and this test fails by name at the
/// first batch whose bytes exceed its target.
///
/// Observed over `6f4cc949` on the uncommitted tree of the engine commit:
/// `every_line_batch_fits_its_target_under_the_unedited_estimate` FAILED with the mutation applied,
/// at batch 0 of the linestring stream: 126,968 B of geometry and ids against its 65,536 B target,
/// 335 rows, then reverted.
#[test]
fn every_line_batch_fits_its_target_under_the_unedited_estimate() {
    const N: usize = 20_000;
    let position = |i: usize, j: usize| -> [f64; 2] {
        [
            E_LO + (i % 200) as f64 * 10.25 + j as f64 * 0.5,
            N_LO + (i / 200) as f64 * 10.25 + (j % 7) as f64,
        ]
    };
    let lines: Vec<Vec<u8>> = (0..N)
        .map(|i| {
            let n = 2 + (i * 7) % 49;
            encode_linestring(&(0..n).map(|j| position(i, j)).collect::<Vec<_>>())
        })
        .collect();
    let multis: Vec<Vec<u8>> = (0..N)
        .map(|i| {
            let parts = 1 + i % 5;
            encode_multilinestring(
                &(0..parts)
                    .map(|p| vec![position(i, 2 * p), position(i, 2 * p + 1)])
                    .collect::<Vec<_>>(),
            )
        })
        .collect();

    for (name, declared, rows, multi) in [
        ("s-l3-lines", r#"["LineString"]"#, lines, false),
        ("s-l3-multi", r#"["MultiLineString"]"#, multis, true),
    ] {
        let ds = open(name, declared, rows);
        let mut s = ds.stream(&ViewportQuery::all()).expect("stream");
        let mut buf = Vec::new();
        let (mut batches, mut multi_row_batches, mut delivered) = (0usize, 0usize, 0usize);
        while let Some(info) = s.next_into(&mut buf) {
            let info = info.expect("a batch");
            let batch = decode(&buf);
            buf.clear();
            batches += 1;
            delivered += batch.num_rows();

            let (geometry, vertices) = geometry_bytes(&batch, multi);
            assert_eq!(
                vertices, info.vertices,
                "{name}: the batch's own vertex count"
            );
            let share = 16 * vertices + 4 * (batch.num_rows() + vertices);
            assert!(
                geometry <= share,
                "{name} batch {}: {geometry} B of geometry exceed the estimate's share of {share} B",
                info.batch_index
            );
            if batch.num_rows() > 1 {
                multi_row_batches += 1;
                assert!(
                    geometry + 8 * batch.num_rows() <= info.target_bytes,
                    "{name} batch {}: {} B of geometry and ids exceed its {} B target ({} rows)",
                    info.batch_index,
                    geometry + 8 * batch.num_rows(),
                    info.target_bytes,
                    batch.num_rows(),
                );
            }
        }
        assert_eq!(delivered, N, "{name}: every feature was delivered");
        assert!(
            batches >= 3 && multi_row_batches >= 3,
            "{name}: the fixture must span several size-cut batches ({batches} batches)"
        );
    }
}
