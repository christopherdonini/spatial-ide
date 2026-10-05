// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! S-1 to S-3 of `engine/MULTIPOLYGON-MP1-PREREGISTRATION.md` §4: the multipolygon encoding as a
//! real stream carries one row per feature, a row of a type the open's encoding does not read stops
//! the stream at that row by name, and the batch-size estimate bounds the third offsets level.
//!
//! **Real shape.** Each case writes a real GeoParquet file through `spatial_engine::fixture`, opens
//! it through `Dataset::open`, streams it through `Dataset::stream`, and decodes the Arrow IPC bytes
//! that came out. The expected geometry is written down first, as structured rows, and encoded to
//! WKB by the fixture module's own encoders, so the oracle is not the decoder under test.

use std::path::PathBuf;

use arrow::array::{Array, FixedSizeListArray, Float64Array, ListArray, RecordBatch, UInt64Array};
use spatial_engine::fixture::{
    encode_multipolygon, multipolygon_f1, write_geoparquet, DeclaredTypes, FixtureSpec,
    GeometryMode, E_LO, N_LO,
};
use spatial_engine::wkb::encode_polygon;
use spatial_engine::{Dataset, EngineError, GeometryEncoding, ViewportQuery};

/// One feature: its parts, each part its rings, each ring its `[x, y]` positions.
type Row = Vec<Vec<Vec<[f64; 2]>>>;

fn workspace(name: &str) -> PathBuf {
    let d = std::env::temp_dir()
        .join("spatial-engine-multipolygon-stream")
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

fn list<'a>(a: &'a dyn Array) -> &'a ListArray {
    a.as_any()
        .downcast_ref::<ListArray>()
        .expect("a list level")
}

/// A multipolygon batch's geometry column as structured rows.
fn rows_of(batch: &RecordBatch) -> Vec<Row> {
    let geoms = list(batch.column(1));
    (0..geoms.len())
        .map(|g| {
            let parts = geoms.value(g);
            let parts = list(parts.as_ref());
            (0..parts.len())
                .map(|p| {
                    let rings = parts.value(p);
                    let rings = list(rings.as_ref());
                    (0..rings.len())
                        .map(|r| {
                            let verts = rings.value(r);
                            let verts = verts
                                .as_any()
                                .downcast_ref::<FixedSizeListArray>()
                                .expect("vertices");
                            let flat = verts
                                .values()
                                .as_any()
                                .downcast_ref::<Float64Array>()
                                .expect("coordinates");
                            flat.values()
                                .chunks_exact(2)
                                .map(|c| [c[0], c[1]])
                                .collect()
                        })
                        .collect()
                })
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

fn bits(rows: &[Row]) -> Vec<u64> {
    rows.iter()
        .flatten()
        .flatten()
        .flatten()
        .flat_map(|p| [p[0].to_bits(), p[1].to_bits()])
        .collect()
}

/// Stream the whole file; every batch's ids and rows, in arrival order.
fn drain(ds: &Dataset) -> (Vec<u64>, Vec<Row>) {
    let mut s = ds.stream(&ViewportQuery::all()).expect("stream");
    let (mut ids, mut rows) = (Vec::new(), Vec::new());
    let mut buf = Vec::new();
    while let Some(info) = s.next_into(&mut buf) {
        info.expect("a batch, not a refusal");
        let batch = decode(&buf);
        buf.clear();
        ids.extend(ids_of(&batch));
        rows.extend(rows_of(&batch));
    }
    (ids, rows)
}

fn square(x: f64, y: f64, s: f64) -> Vec<[f64; 2]> {
    vec![[x, y], [x + s, y], [x + s, y + s], [x, y + s], [x, y]]
}

/// S-1. F-1 and F-2 stream one row per feature, ids unique and unrepeated, every part, ring and
/// coordinate bit-identical to the WKB the fixture wrote. A Polygon row under the multipolygon
/// encoding arrives as a one-part row.
///
/// RECORDED MUTATION: in `MultiPolygonBuilder::push_wkb`, push the geometry offset once per part
/// (move `self.geom_offsets.push(..)` into `push_part`) so a feature of three parts becomes three
/// rows. The batch then has more geometry rows than ids and the stream ends in an error, so this
/// test fails by name at `a batch, not a refusal`.
///
/// Observed over `d8276158` on the uncommitted tree of the engine commit:
/// `f1_and_f2_stream_one_row_per_feature_with_bit_identical_parts` FAILED with the mutation
/// applied, then reverted.
#[test]
fn f1_and_f2_stream_one_row_per_feature_with_bit_identical_parts() {
    // F-1: three MultiPolygon rows, six parts.
    let f1: Vec<Row> = multipolygon_f1([E_LO, N_LO], 10.0);
    let ds = open(
        "s1-f1",
        r#"["MultiPolygon"]"#,
        f1.iter().map(|r| encode_multipolygon(r)).collect(),
    );
    assert_eq!(ds.geometry_encoding(), GeometryEncoding::MultiPolygon);
    let (ids, rows) = drain(&ds);
    assert_eq!(
        ids,
        vec![0, 1, 2],
        "one row per feature, and no id repeated"
    );
    assert_eq!(rows.len(), 3, "three features, not six parts");
    assert_eq!(rows, f1);
    assert_eq!(bits(&rows), bits(&f1), "coordinate bit patterns survive");

    // F-2: Polygon and MultiPolygon rows alternating, declared as both.
    let polygon = |x: f64| -> Row { vec![vec![square(E_LO + x, N_LO, 40.0)]] };
    let multi = |x: f64| -> Row {
        vec![
            vec![square(E_LO + x, N_LO + 100.0, 10.0)],
            vec![
                square(E_LO + x + 20.0, N_LO + 100.0, 30.0),
                square(E_LO + x + 25.0, N_LO + 105.0, 5.0),
            ],
        ]
    };
    let f2: Vec<Row> = vec![
        polygon(0.0),
        multi(100.0),
        polygon(200.0),
        multi(300.0),
        polygon(400.0),
        multi(500.0),
    ];
    let wkb: Vec<Vec<u8>> = f2
        .iter()
        .enumerate()
        .map(|(i, r)| {
            if i % 2 == 0 {
                encode_polygon(&r[0])
            } else {
                encode_multipolygon(r)
            }
        })
        .collect();
    let ds = open("s1-f2", r#"["Polygon","MultiPolygon"]"#, wkb);
    let (ids, rows) = drain(&ds);
    assert_eq!(ids, vec![0, 1, 2, 3, 4, 5]);
    assert_eq!(rows, f2, "a Polygon row is one part of its own rings");
    assert_eq!(bits(&rows), bits(&f2));
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

/// S-2. F-9 to F-11: a row of a type the open's encoding does not read ends the stream, typed
/// `engine.wkb`, at that row. Every earlier row was delivered, nothing after it is, and nothing is
/// skipped. The text carries the placeholder mark.
///
/// RECORDED MUTATION: in `stream.rs`'s producer loop, skip a row the builder refuses
/// (`if pending.builder.push_wkb(wkb).is_err() { continue; }` in place of the `?`). The stream then
/// ends cleanly with the row dropped and this test fails by name at `the stream ended cleanly`.
///
/// Observed over `d8276158` on the uncommitted tree of the engine commit:
/// `a_row_of_an_unread_type_stops_the_stream_at_that_row_by_name` FAILED with the mutation applied,
/// then reverted.
#[test]
fn a_row_of_an_unread_type_stops_the_stream_at_that_row_by_name() {
    const N: usize = 3_000;
    const BAD: usize = 2_500;
    let polygon = |i: usize| -> Vec<u8> {
        let x = E_LO + (i % 100) as f64 * 100.0;
        let y = N_LO + (i / 100) as f64 * 100.0;
        encode_polygon(&[square(x, y, 50.0)])
    };
    let point = {
        let mut p = vec![1u8];
        p.extend_from_slice(&1u32.to_le_bytes());
        p.extend_from_slice(&E_LO.to_le_bytes());
        p.extend_from_slice(&N_LO.to_le_bytes());
        p
    };
    let multipolygon = encode_multipolygon(&[vec![square(E_LO, N_LO, 50.0)]]);

    // (name, declared, the row planted at BAD, the type the refusal must name)
    let cases: [(&str, &str, &Vec<u8>, &str); 3] = [
        (
            "s2-f9",
            r#"["Polygon"]"#,
            &multipolygon,
            "geometry type 6 met",
        ),
        (
            "s2-f10",
            r#"["Polygon","MultiPolygon"]"#,
            &point,
            "geometry type 1 met",
        ),
        ("s2-f11", "[]", &point, "geometry type 1 met"),
    ];
    for (name, declared, bad, named) in cases {
        let rows: Vec<Vec<u8>> = (0..N)
            .map(|i| if i == BAD { bad.clone() } else { polygon(i) })
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
}

/// S-3. For every batch of a multipolygon stream cut at the default size targets, the geometry
/// array's own bytes (its three offset buffers and its coordinates) plus the 8 bytes per id fit
/// inside the target the batch was cut at. The estimate the cut is decided on is the polygon one,
/// unedited; this holds only if its `(rows + vertices) * 4` term bounds the part and ring offsets.
///
/// RECORDED MUTATION: in `stream.rs::estimate_bytes`, change `(rows + vertices) * 4` to
/// `rows * 4`. Batches are then packed past what the estimate should allow and this test fails by
/// name at the first batch whose bytes exceed its target.
///
/// Observed over `d8276158` on the uncommitted tree of the engine commit:
/// `every_multipolygon_batch_fits_its_target_under_the_unedited_estimate` FAILED with the mutation
/// applied, then reverted.
#[test]
fn every_multipolygon_batch_fits_its_target_under_the_unedited_estimate() {
    // 4 000 features of one to three parts, every fifth part holding a hole.
    let rows_in: Vec<Row> = (0..4_000usize)
        .map(|i| {
            (0..1 + i % 3)
                .map(|p| {
                    let x = E_LO + ((i % 80) * 3 + p) as f64 * 40.0;
                    let y = N_LO + (i / 80) as f64 * 40.0;
                    let mut rings = vec![square(x, y, 30.0)];
                    if (i + p) % 5 == 0 {
                        rings.push(square(x + 5.0, y + 5.0, 10.0));
                    }
                    rings
                })
                .collect()
        })
        .collect();
    let ds = open(
        "s3",
        r#"["MultiPolygon"]"#,
        rows_in.iter().map(|r| encode_multipolygon(r)).collect(),
    );
    let mut s = ds.stream(&ViewportQuery::all()).expect("stream");
    let mut buf = Vec::new();
    let (mut batches, mut multi_row_batches) = (0usize, 0usize);
    let mut delivered = 0usize;
    while let Some(info) = s.next_into(&mut buf) {
        let info = info.expect("a batch");
        let batch = decode(&buf);
        buf.clear();
        batches += 1;
        delivered += batch.num_rows();

        let geoms = list(batch.column(1));
        let parts = list(geoms.values().as_ref());
        let rings = list(parts.values().as_ref());
        let vertices = rings.values().len();
        // Three offset buffers, each one entry longer than the level it indexes, and 16 B a vertex.
        let geometry_bytes =
            4 * (geoms.len() + 1) + 4 * (parts.len() + 1) + 4 * (rings.len() + 1) + 16 * vertices;
        assert_eq!(vertices, info.vertices, "the batch's own vertex count");
        if batch.num_rows() > 1 {
            multi_row_batches += 1;
            assert!(
                geometry_bytes + 8 * batch.num_rows() <= info.target_bytes,
                "batch {}: {} B of geometry and ids exceed its {} B target ({} rows, {} parts, {} \
                 rings, {} vertices)",
                info.batch_index,
                geometry_bytes + 8 * batch.num_rows(),
                info.target_bytes,
                batch.num_rows(),
                parts.len(),
                rings.len(),
                vertices,
            );
        }
    }
    assert_eq!(delivered, rows_in.len(), "every feature was delivered");
    assert!(
        batches >= 3 && multi_row_batches >= 3,
        "the fixture must span several size-cut batches ({batches} batches)"
    );
}
