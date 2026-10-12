// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! G-1: the Polygon-only wire, pinned by a golden file computed before any MultiPolygon code exists
//! (`engine/MULTIPOLYGON-MP1-PREREGISTRATION.md` §6, the engine half; §4's G-1 row).
//!
//! **What this proves, and no further.** The same test, green at the head of the MP-1 branch, proves
//! that the bytes below did not move when the multipolygon encoding landed (ADR-034's first
//! Consequence):
//!
//! - the default fixture file's sha256 (the generator still writes the file it always wrote);
//! - for `stream_for_publish`, whose ordered, flat plan declares its cuts reproducible, the row
//!   count and the sha256 of every batch's IPC bytes;
//! - for `stream_with_cancel` and `stream_projected_with_cancel`, the schema's metadata map, each
//!   field's name, type and metadata, and the sha256 of an id-keyed multiset of each row's geometry
//!   (its ring lengths and every coordinate's bit pattern). **Batch cut points are deliberately not
//!   pinned for these two unordered streams**, because no reproducibility is declared for them.
//!
//! **Real shape (the seam rule).** Every number is computed from the engine's own output: a real
//! `Dataset::open` and the three real streams, decoded back from their Arrow IPC bytes. Nothing here
//! calls a function this piece edits; the geometry is walked with Arrow's own array API, so the walk
//! is the same at the golden commit and at the head.
//!
//! **How the golden file was made.** The golden commit adds this file and the golden file together
//! and no product line. The golden file holds the text this test computes at that commit. A
//! mismatch prints the computed text in full.
//!
//! The golden file is `engine/tests/data/golden/polygon-wire.golden`.

use std::collections::BTreeMap;
use std::path::PathBuf;

use arrow::array::FixedSizeListArray;
use arrow::array::{Array, Float64Array, ListArray, RecordBatch, UInt64Array};
use sha2::{Digest, Sha256};
use spatial_engine::fixture::{write_geoparquet, AttributeMode, FixtureSpec};
use spatial_engine::{BatchStream, CancelToken, Dataset, ViewportQuery};

fn workspace(name: &str) -> PathBuf {
    let d = std::env::temp_dir()
        .join("spatial-engine-polygon-wire-golden")
        .join(name);
    let _ = std::fs::remove_dir_all(&d);
    std::fs::create_dir_all(&d).unwrap();
    d
}

fn sha256(bytes: &[u8]) -> String {
    format!("{:x}", Sha256::digest(bytes))
}

fn sha256_file(path: &std::path::Path) -> String {
    sha256(&std::fs::read(path).expect("read fixture for hashing"))
}

fn decode(buf: &[u8]) -> RecordBatch {
    let mut r =
        arrow::ipc::reader::StreamReader::try_new(std::io::Cursor::new(buf), None).expect("ipc");
    let batch = r.next().expect("one batch").expect("decodes");
    assert!(r.next().is_none(), "one batch per IPC stream");
    batch
}

/// One row's geometry as bytes: ring count, each ring's vertex count, then every coordinate's bits.
fn geometry_row_bytes(polys: &ListArray, row: usize) -> Vec<u8> {
    let rings = polys.value(row);
    let rings = rings.as_any().downcast_ref::<ListArray>().expect("rings");
    let mut out = Vec::new();
    out.extend_from_slice(&(rings.len() as u32).to_le_bytes());
    for ring in 0..rings.len() {
        let verts = rings.value(ring);
        let verts = verts
            .as_any()
            .downcast_ref::<FixedSizeListArray>()
            .expect("vertices");
        out.extend_from_slice(&(verts.len() as u32).to_le_bytes());
        let flat = verts
            .values()
            .as_any()
            .downcast_ref::<Float64Array>()
            .expect("coordinates");
        for v in flat.values().iter() {
            out.extend_from_slice(&v.to_bits().to_le_bytes());
        }
    }
    out
}

/// The schema facts a consumer reads, as sorted `key = value` lines under `prefix`.
fn schema_lines(prefix: &str, batch: &RecordBatch, out: &mut Vec<String>) {
    let schema = batch.schema();
    let md: BTreeMap<_, _> = schema.metadata().iter().collect();
    for (k, v) in md {
        out.push(format!("{prefix}.schema.metadata.{k} = {v}"));
    }
    for (i, f) in schema.fields().iter().enumerate() {
        out.push(format!(
            "{prefix}.field.{i} = {} : {:?} : nullable={}",
            f.name(),
            f.data_type(),
            f.is_nullable()
        ));
        let fmd: BTreeMap<_, _> = f.metadata().iter().collect();
        for (k, v) in fmd {
            // The geometry field's CRS block is the whole PROJJSON; its hash and length stand for it.
            if v.len() > 200 {
                out.push(format!(
                    "{prefix}.field.{i}.metadata.{k} = sha256:{} ({} bytes)",
                    sha256(v.as_bytes()),
                    v.len()
                ));
            } else {
                out.push(format!("{prefix}.field.{i}.metadata.{k} = {v}"));
            }
        }
    }
}

/// Drain an unordered stream into its first batch's schema lines and the id-keyed geometry digest.
fn unordered_lines(prefix: &str, mut stream: BatchStream, out: &mut Vec<String>) {
    let mut rows: BTreeMap<u64, Vec<u8>> = BTreeMap::new();
    let mut first = true;
    let mut buf = Vec::new();
    while let Some(info) = stream.next_into(&mut buf) {
        info.expect("batch");
        let batch = decode(&buf);
        buf.clear();
        if first {
            schema_lines(prefix, &batch, out);
            first = false;
        }
        let ids = batch
            .column(0)
            .as_any()
            .downcast_ref::<UInt64Array>()
            .expect("ids");
        let polys = batch
            .column(1)
            .as_any()
            .downcast_ref::<ListArray>()
            .expect("geometry");
        for row in 0..batch.num_rows() {
            let prior = rows.insert(ids.value(row), geometry_row_bytes(polys, row));
            assert!(prior.is_none(), "an id repeated on the wire");
        }
    }
    let mut h = Sha256::new();
    for (id, bytes) in &rows {
        h.update(id.to_le_bytes());
        h.update((bytes.len() as u64).to_le_bytes());
        h.update(bytes);
    }
    out.push(format!("{prefix}.rows = {}", rows.len()));
    out.push(format!("{prefix}.rows.sha256 = {:x}", h.finalize()));
}

fn computed() -> String {
    let dir = workspace("g1");
    let mut out: Vec<String> = Vec::new();

    // The default fixture, and a variant that carries a categorical attribute for the projected
    // stream. Each file's hash is taken after it is written and again after every stream has run.
    let default_path = dir.join("default.parquet");
    write_geoparquet(&default_path, &FixtureSpec::default()).expect("write default fixture");
    let zoned_path = dir.join("zoned.parquet");
    write_geoparquet(
        &zoned_path,
        &FixtureSpec {
            attributes: AttributeMode::CategoricalZone,
            ..Default::default()
        },
    )
    .expect("write zoned fixture");
    let default_before = sha256_file(&default_path);
    let zoned_before = sha256_file(&zoned_path);
    out.push(format!("fixture.default.sha256 = {default_before}"));
    out.push(format!(
        "fixture.default.bytes = {}",
        std::fs::metadata(&default_path).unwrap().len()
    ));
    out.push(format!("fixture.zoned.sha256 = {zoned_before}"));

    // The publish stream: every batch's own IPC bytes.
    let ds = Dataset::open(&default_path).expect("open default");
    let none = ds.resolve_projection(&[]).expect("empty projection");
    let mut publish = ds
        .stream_for_publish(&ViewportQuery::all(), &none, CancelToken::new())
        .expect("publish stream");
    let mut n = 0usize;
    let mut buf = Vec::new();
    while let Some(info) = publish.next_into(&mut buf) {
        let info = info.expect("publish batch");
        out.push(format!(
            "publish.batch.{n} = rows:{} sha256:{}",
            info.rows,
            sha256(&buf)
        ));
        buf.clear();
        n += 1;
    }
    out.push(format!("publish.batches = {n}"));

    // The viewport stream.
    let viewport = ds
        .stream_with_cancel(&ViewportQuery::all(), CancelToken::new())
        .expect("viewport stream");
    unordered_lines("viewport", viewport, &mut out);

    // The live projected stream, over the zoned fixture.
    let zoned = Dataset::open(&zoned_path).expect("open zoned");
    let projection = zoned
        .resolve_projection(&["zone".to_string()])
        .expect("zone projection");
    let projected = zoned
        .stream_projected_with_cancel(&ViewportQuery::all(), &projection, CancelToken::new())
        .expect("projected stream");
    unordered_lines("projected", projected, &mut out);

    // Hash-verified after, as before: nothing above may have written to a fixture.
    assert_eq!(
        sha256_file(&default_path),
        default_before,
        "default fixture changed"
    );
    assert_eq!(
        sha256_file(&zoned_path),
        zoned_before,
        "zoned fixture changed"
    );

    let mut text = out.join("\n");
    text.push('\n');
    text
}

// RECORDED MUTATION (observed on the uncommitted tree over `ff6bdddc`, the branch base, with the
// golden files as the only change; a golden commit cannot name its own id): in
// `engine/src/stream.rs::estimate_bytes`, change `rows * 8` to `rows * 9`. The publish stream's
// cut points move, and `the_polygon_only_wire_matches_the_golden_file` fails by name.
//
// RECORDED MUTATION (§4's own for this row, which needs code the golden commit does not have;
// observed over `d8276158`, the golden commit, on the uncommitted tree of the engine commit): in
// `engine/src/geoarrow.rs::encoding_for_declared_types`, select `MultiPolygon` where the all-
// `Polygon` branch selects `Polygon`. `the_polygon_only_wire_matches_the_golden_file` FAILED with
// the mutation applied, then it was reverted.
#[test]
fn the_polygon_only_wire_matches_the_golden_file() {
    let got = computed();
    let golden = include_str!("data/golden/polygon-wire.golden").replace("\r\n", "\n");
    assert_eq!(
        got, golden,
        "the Polygon-only wire moved (preregistration §5 invalidator I-2 at the head, I-1 at the \
         golden commit). Computed text:\n{got}"
    );
}
