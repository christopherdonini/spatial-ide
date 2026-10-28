// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! `engine/CORPUS-LINE-FILES-PREREGISTRATION.md`'s T1 and T2: corpus row LF-1, a real-world
//! LineString file, opened and streamed whole against the outcomes its Amendment 1 registered
//! before any run.
//!
//! **Ignored**, because they read the on-disk corpus outside any worktree
//! (`engine/tests/admission_p4_corpus.rs`'s `CORPUS_ROOT`). Run: `cargo test -p spatial-engine
//! --test line_corpus -- --ignored`. The file is hash-verified against its observation before the
//! open and again after the last read. A prediction that misses is a result, never edited.

use std::collections::HashSet;
use std::path::{Path, PathBuf};

use arrow::array::{Array, FixedSizeListArray, Float64Array, ListArray, UInt64Array};
use sha2::{Digest, Sha256};
use spatial_engine::{Dataset, GeometryEncoding, ViewportQuery};

const CORPUS_ROOT: &str = r"C:\dev\spatial-ide\target\fixtures\compat-corpus";
const ROW: &str = "lines/msrd-pcn.parquet";
const OBSERVATION: &str = concat!(
    env!("CARGO_MANIFEST_DIR"),
    "/compat-corpus/lines/msrd-pcn.observe.txt"
);
/// The observation's `bbox` member, byte-copied by script, never parsed through serde_json's f64.
const BBOX: [f64; 4] = [
    -130.738645792007,
    -25.0744726064379,
    -130.096664428711,
    -23.9252873199134,
];

/// The file's sha256 and byte count from the observation (its first line is the path header).
fn observed() -> (String, u64) {
    let text = std::fs::read_to_string(OBSERVATION).expect("observation file");
    let json = text.split_once('\n').expect("header line").1;
    let v: serde_json::Value = serde_json::from_str(json).expect("observation is JSON");
    (
        v["sha256"].as_str().unwrap().to_string(),
        v["bytes"].as_u64().unwrap(),
    )
}

/// Whether the file holds the observed bytes and the observed sha256.
fn file_matches(path: &Path, sha: &str, bytes: u64) -> bool {
    let b = std::fs::read(path).expect("corpus file");
    b.len() as u64 == bytes && format!("{:x}", Sha256::digest(&b)) == sha
}

fn row_path() -> PathBuf {
    Path::new(CORPUS_ROOT).join(ROW)
}

/// T1. The file opens as its metadata says: `geoarrow.linestring`, no `crs` key so
/// `crs:format-default`, no `id` column so session ordinals, and a usable covering.
///
/// RECORDED MUTATION: M-1, in `encoding_for_declared_types` the all-LineString arm returns `MultiLineString`: this test FAILED at its encoding assertion (left MultiLineString, right LineString), observed over 3b9e0662fe9d4823c6d3d63f597444fd85e0352b, then reverted.
/// RECORDED MUTATION: M-3, `==` to `!=` in `file_matches`'s hash comparison: this test FAILED at `pre-open hash`, observed over 3b9e0662fe9d4823c6d3d63f597444fd85e0352b, then reverted.
#[test]
#[ignore = "reads the on-disk compatibility corpus (C:\\dev\\spatial-ide\\target\\fixtures\\compat-corpus)"]
fn a_real_world_line_file_opens_with_the_encoding_crs_provenance_and_identity_its_metadata_gives() {
    let (sha, bytes) = observed();
    assert!(file_matches(&row_path(), &sha, bytes), "pre-open hash");
    let ds = Dataset::open(row_path()).expect("LF-1 opens");
    assert_eq!(ds.geometry_encoding(), GeometryEncoding::LineString);
    assert_eq!(
        ds.declared_geometry_types(),
        Some(&["LineString".to_string()][..])
    );
    let md = ds.envelope().schema().metadata().clone();
    assert_eq!(md.get("crs_provenance").unwrap(), "crs:format-default");
    assert!(
        ds.identity().source().is_session_ordinal(),
        "no `id` column"
    );
    let c = ds.covering().expect("a usable covering");
    let paths = [&c.xmin, &c.ymin, &c.xmax, &c.ymax].map(|p| p.0.join("."));
    assert_eq!(paths, ["bbox.xmin", "bbox.ymin", "bbox.xmax", "bbox.ymax"]);
    assert!(file_matches(&row_path(), &sha, bytes), "post-open hash");
}

/// T2. Streamed whole with `ViewportQuery::all()`: no refusal, 12 rows with 12 unique ids, every
/// position inside the observation's `bbox` member, comparisons inclusive.
///
/// RECORDED MUTATION: M-1, as in T1: this test FAILED at the `coordinate pairs` downcast of the geometry column, observed over 3b9e0662fe9d4823c6d3d63f597444fd85e0352b, then reverted.
/// RECORDED MUTATION: M-2, in `read_line` y pushed before x: this test FAILED at `positions outside the bbox member` and T1 passed, observed over 3b9e0662fe9d4823c6d3d63f597444fd85e0352b, then reverted.
/// RECORDED MUTATION: M-3, `==` to `!=` in `file_matches`'s hash comparison: this test FAILED at `pre-open hash`, observed over 3b9e0662fe9d4823c6d3d63f597444fd85e0352b, then reverted.
#[test]
#[ignore = "reads the on-disk compatibility corpus (C:\\dev\\spatial-ide\\target\\fixtures\\compat-corpus)"]
fn a_real_world_line_file_streams_whole_one_row_per_feature_each_position_inside_its_bbox_member() {
    let (sha, bytes) = observed();
    assert!(file_matches(&row_path(), &sha, bytes), "pre-open hash");
    let ds = Dataset::open(row_path()).expect("LF-1 opens");
    let mut s = ds.stream(&ViewportQuery::all()).expect("stream");
    let (mut buf, mut rows, mut outside) = (Vec::new(), 0usize, Vec::new());
    let mut ids: HashSet<u64> = HashSet::new();
    while let Some(info) = s.next_into(&mut buf) {
        rows += info.expect("no refusal").rows;
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
        let lines = batch
            .column(1)
            .as_any()
            .downcast_ref::<ListArray>()
            .expect("a line column");
        let vertices = lines.values().as_any().downcast_ref::<FixedSizeListArray>();
        let flat = vertices.expect("coordinate pairs").values();
        let flat = flat
            .as_any()
            .downcast_ref::<Float64Array>()
            .expect("coordinates");
        for c in flat.values().chunks_exact(2) {
            let inside = c[0] >= BBOX[0] && c[0] <= BBOX[2] && c[1] >= BBOX[1] && c[1] <= BBOX[3];
            if !inside {
                outside.push([c[0], c[1]]);
            }
        }
    }
    assert_eq!(rows, 12, "one row per feature");
    assert_eq!(ids.len(), 12, "unique ids");
    assert!(
        outside.is_empty(),
        "positions outside the bbox member: {outside:?}"
    );
    assert!(file_matches(&row_path(), &sha, bytes), "post-read hash");
}
