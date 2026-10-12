// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! BF-1 of `engine/MULTIPOLYGON-MP1-PREREGISTRATION.md` §3 and §4: two engine-produced Arrow IPC
//! batches, committed under `engine/tests/data/geoarrow/`, that the shell's decode tests and the
//! bundle viewer's refusal test consume as the **real shape** of each encoding.
//!
//! - `lv95-polygon-batch.arrows`: one LV95 `geoarrow.polygon` batch of three generated features.
//! - `lv95-multipolygon-batch.arrows`: one LV95 `geoarrow.multipolygon` batch, §3's fixture F-1
//!   (three rows, six parts, a hole in the second part of row 0).
//!
//! - `lv95-point-batch.arrows`: one LV95 `geoarrow.point` batch, the points cut's fixture P-1 (six
//!   rows; BF-P of `engine/GEOMETRY-POINTS-PREREGISTRATION.md` §4).
//! - `lv95-linestring-batch.arrows` and `lv95-multilinestring-batch.arrows`: one LV95
//!   `geoarrow.linestring` batch, the lines cut's fixture L-1 (five rows), and one LV95
//!   `geoarrow.multilinestring` batch, its fixture ML-1 (three rows, six parts); BF-L and BF-ML of
//!   `engine/GEOMETRY-LINES-PREREGISTRATION.md` §4.
//!
//! The committed bytes must equal what the engine produces today from a real `Dataset::open` and a
//! real `Dataset::stream`, so a consumer test against these files is a test against the engine and
//! not against a hand-built imitation. If the engine's output changes on purpose, regenerate them
//! with `cargo test -p spatial-engine --test geoarrow_batch_fixtures -- --ignored` and review the
//! diff.

use std::path::{Path, PathBuf};

use spatial_engine::fixture::{
    line_l1_rows, multilinestring_ml1_rows, multipolygon_f1_rows, point_p1_rows, write_geoparquet,
    DeclaredTypes, FixtureSpec, GeometryMode, E_LO, N_LO,
};
use spatial_engine::{Dataset, ViewportQuery};

const POLYGON_FILE: &str = "lv95-polygon-batch.arrows";
const MULTIPOLYGON_FILE: &str = "lv95-multipolygon-batch.arrows";
const POINT_FILE: &str = "lv95-point-batch.arrows";
const LINESTRING_FILE: &str = "lv95-linestring-batch.arrows";
const MULTILINESTRING_FILE: &str = "lv95-multilinestring-batch.arrows";

fn data_dir() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("tests/data/geoarrow")
}

fn workspace(name: &str) -> PathBuf {
    let d = std::env::temp_dir()
        .join("spatial-engine-geoarrow-batch-fixtures")
        .join(name);
    let _ = std::fs::remove_dir_all(&d);
    std::fs::create_dir_all(&d).unwrap();
    d
}

/// The one batch a whole-file stream of `path` produces, as the IPC bytes the engine wrote.
fn only_batch(path: &Path) -> Vec<u8> {
    let ds = Dataset::open(path).expect("open");
    let mut s = ds.stream(&ViewportQuery::all()).expect("stream");
    let mut buf = Vec::new();
    s.next_into(&mut buf)
        .expect("a batch")
        .expect("not a refusal");
    assert!(
        s.next_into(&mut Vec::new()).is_none(),
        "the fixture is one batch"
    );
    buf
}

/// The polygon BF writer: three generated LV95 polygons, the first with a hole.
fn polygon_batch() -> Vec<u8> {
    let path = workspace("polygon").join("f.parquet");
    write_geoparquet(
        &path,
        &FixtureSpec {
            features: 3,
            ..Default::default()
        },
    )
    .expect("write");
    only_batch(&path)
}

/// The multipolygon BF writer: F-1, declared `["MultiPolygon"]`, no covering.
fn multipolygon_batch() -> Vec<u8> {
    let path = workspace("multipolygon").join("f.parquet");
    write_geoparquet(
        &path,
        &FixtureSpec {
            geometry: GeometryMode::Rows(multipolygon_f1_rows([E_LO, N_LO], 10.0)),
            with_covering_bbox: false,
            declared_types: DeclaredTypes::Json(r#"["MultiPolygon"]"#.to_string()),
            ..Default::default()
        },
    )
    .expect("write");
    only_batch(&path)
}

/// The point BF writer: P-1, declared `["Point"]`, no covering.
fn point_batch() -> Vec<u8> {
    let path = workspace("point").join("f.parquet");
    write_geoparquet(
        &path,
        &FixtureSpec {
            geometry: GeometryMode::Rows(point_p1_rows([E_LO, N_LO], 10.0)),
            with_covering_bbox: false,
            declared_types: DeclaredTypes::Json(r#"["Point"]"#.to_string()),
            ..Default::default()
        },
    )
    .expect("write");
    only_batch(&path)
}

/// The linestring BF writer: L-1, declared `["LineString"]`, no covering.
fn linestring_batch() -> Vec<u8> {
    let path = workspace("linestring").join("f.parquet");
    write_geoparquet(
        &path,
        &FixtureSpec {
            geometry: GeometryMode::Rows(line_l1_rows([E_LO, N_LO], 10.0)),
            with_covering_bbox: false,
            declared_types: DeclaredTypes::Json(r#"["LineString"]"#.to_string()),
            ..Default::default()
        },
    )
    .expect("write");
    only_batch(&path)
}

/// The multilinestring BF writer: ML-1, declared `["MultiLineString"]`, no covering.
fn multilinestring_batch() -> Vec<u8> {
    let path = workspace("multilinestring").join("f.parquet");
    write_geoparquet(
        &path,
        &FixtureSpec {
            geometry: GeometryMode::Rows(multilinestring_ml1_rows([E_LO, N_LO], 10.0)),
            with_covering_bbox: false,
            declared_types: DeclaredTypes::Json(r#"["MultiLineString"]"#.to_string()),
            ..Default::default()
        },
    )
    .expect("write");
    only_batch(&path)
}

/// BF-1. The committed bytes equal what the engine produces now, for both encodings.
///
/// RECORDED MUTATION: in `fixture::multipolygon_f1`, change one coordinate (the first part's side
/// `2.0` to `2.5`). The multipolygon batch then differs from the committed file and this test fails
/// by name at the multipolygon comparison.
///
/// Observed over `d8276158` on the uncommitted tree of the engine commit:
/// `the_committed_batches_equal_the_engines_output_from_a_real_open_and_stream` FAILED with the
/// mutation applied, then reverted.
#[test]
fn the_committed_batches_equal_the_engines_output_from_a_real_open_and_stream() {
    let committed = |file: &str| {
        std::fs::read(data_dir().join(file))
            .unwrap_or_else(|e| panic!("read {file}: {e} (regenerate with `-- --ignored`)"))
    };
    assert!(
        committed(POLYGON_FILE) == polygon_batch(),
        "{POLYGON_FILE} no longer equals the engine's polygon batch"
    );
    assert!(
        committed(MULTIPOLYGON_FILE) == multipolygon_batch(),
        "{MULTIPOLYGON_FILE} no longer equals the engine's multipolygon batch"
    );
}

/// BF-P. The committed point batch equals what the engine produces now from a real open and
/// stream. BF-1's own test above is unchanged and still holds the two earlier files.
///
/// RECORDED MUTATION: in this file's `point_batch`, change the layout step `10.0` to `10.5`. Every
/// point but the first then moves and this test fails by name at the comparison.
///
/// Observed over `d3fe6055` on the uncommitted tree of the engine commit:
/// `the_committed_point_batch_equals_the_engines_output_from_a_real_open_and_stream` FAILED with
/// the mutation applied, at `lv95-point-batch.arrows no longer equals the engine's point batch`,
/// then reverted.
#[test]
fn the_committed_point_batch_equals_the_engines_output_from_a_real_open_and_stream() {
    let committed = std::fs::read(data_dir().join(POINT_FILE))
        .unwrap_or_else(|e| panic!("read {POINT_FILE}: {e} (regenerate with `-- --ignored`)"));
    assert!(
        committed == point_batch(),
        "{POINT_FILE} no longer equals the engine's point batch"
    );
}

/// BF-L and BF-ML. The committed linestring and multilinestring batches equal what the engine
/// produces now from a real open and stream. BF-1's and BF-P's own tests above are unchanged and
/// still hold the three earlier files.
///
/// RECORDED MUTATION: in this file's `linestring_batch`, change the layout step `10.0` to `10.5`.
/// Every position but the first moves and this test fails by name at the linestring comparison.
///
/// Observed over `6f4cc949` on the uncommitted tree of the engine commit:
/// `the_committed_line_batches_equal_the_engines_output_from_a_real_open_and_stream` FAILED with
/// the mutation applied, at `lv95-linestring-batch.arrows no longer equals the engine's linestring
/// batch`, then reverted.
#[test]
fn the_committed_line_batches_equal_the_engines_output_from_a_real_open_and_stream() {
    let committed = |file: &str| {
        std::fs::read(data_dir().join(file))
            .unwrap_or_else(|e| panic!("read {file}: {e} (regenerate with `-- --ignored`)"))
    };
    assert!(
        committed(LINESTRING_FILE) == linestring_batch(),
        "{LINESTRING_FILE} no longer equals the engine's linestring batch"
    );
    assert!(
        committed(MULTILINESTRING_FILE) == multilinestring_batch(),
        "{MULTILINESTRING_FILE} no longer equals the engine's multilinestring batch"
    );
}

/// Rewrites the five committed files from the engine's current output. Ignored: it changes tracked
/// bytes, so it runs only when someone asks.
///
/// RECORDED MUTATION: write the polygon batch to the multipolygon file's name. After this test runs,
/// `the_committed_batches_equal_the_engines_output_from_a_real_open_and_stream` fails by name.
///
/// Observed over `d8276158` on the uncommitted tree of the engine commit: with the mutation
/// applied and this test run, `the_committed_batches_equal_the_engines_output_from_a_real_open_and_stream`
/// FAILED; the mutation was reverted and this test run again to restore the files.
///
/// Re-observed over `d3fe6055` on the uncommitted tree of the engine commit, after this test also
/// writes the point file: the same mutation, and the same test FAILED at `lv95-multipolygon-batch.arrows
/// no longer equals the engine's multipolygon batch`; reverted, and this test run again.
///
/// Re-observed over `6f4cc949` on the uncommitted tree of the engine commit, after this test also
/// writes the two line files: the same mutation applied and this test run,
/// `the_committed_batches_equal_the_engines_output_from_a_real_open_and_stream` FAILED at
/// `lv95-multipolygon-batch.arrows no longer equals the engine's multipolygon batch`; reverted, and
/// this test run again to restore the files (the sha256 of all five files equal to their values
/// before the mutation).
#[test]
#[ignore = "rewrites the committed fixtures under engine/tests/data/geoarrow/"]
fn regenerate_the_committed_batches() {
    let dir = data_dir();
    std::fs::create_dir_all(&dir).unwrap();
    std::fs::write(dir.join(POLYGON_FILE), polygon_batch()).unwrap();
    std::fs::write(dir.join(MULTIPOLYGON_FILE), multipolygon_batch()).unwrap();
    std::fs::write(dir.join(POINT_FILE), point_batch()).unwrap();
    std::fs::write(dir.join(LINESTRING_FILE), linestring_batch()).unwrap();
    std::fs::write(dir.join(MULTILINESTRING_FILE), multilinestring_batch()).unwrap();
}
