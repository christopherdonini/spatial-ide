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
//! The committed bytes must equal what the engine produces today from a real `Dataset::open` and a
//! real `Dataset::stream`, so a consumer test against these files is a test against the engine and
//! not against a hand-built imitation. If the engine's output changes on purpose, regenerate them
//! with `cargo test -p spatial-engine --test geoarrow_batch_fixtures -- --ignored` and review the
//! diff.

use std::path::{Path, PathBuf};

use spatial_engine::fixture::{
    multipolygon_f1_rows, write_geoparquet, DeclaredTypes, FixtureSpec, GeometryMode, E_LO, N_LO,
};
use spatial_engine::{Dataset, ViewportQuery};

const POLYGON_FILE: &str = "lv95-polygon-batch.arrows";
const MULTIPOLYGON_FILE: &str = "lv95-multipolygon-batch.arrows";

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

/// Rewrites the two committed files from the engine's current output. Ignored: it changes tracked
/// bytes, so it runs only when someone asks.
///
/// RECORDED MUTATION: write the polygon batch to the multipolygon file's name. After this test runs,
/// `the_committed_batches_equal_the_engines_output_from_a_real_open_and_stream` fails by name.
///
/// Observed over `d8276158` on the uncommitted tree of the engine commit: with the mutation
/// applied and this test run, `the_committed_batches_equal_the_engines_output_from_a_real_open_and_stream`
/// FAILED; the mutation was reverted and this test run again to restore the files.
#[test]
#[ignore = "rewrites the committed fixtures under engine/tests/data/geoarrow/"]
fn regenerate_the_committed_batches() {
    let dir = data_dir();
    std::fs::create_dir_all(&dir).unwrap();
    std::fs::write(dir.join(POLYGON_FILE), polygon_batch()).unwrap();
    std::fs::write(dir.join(MULTIPOLYGON_FILE), multipolygon_batch()).unwrap();
}
