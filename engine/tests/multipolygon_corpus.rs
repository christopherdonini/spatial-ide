// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! C-12S of `engine/MULTIPOLYGON-MP1-PREREGISTRATION.md` §3 and §4: corpus row #12, streamed whole.
//!
//! **Ignored, like the P4 generator it sits beside**, because it reads the on-disk compatibility
//! corpus, which is outside any worktree (`engine/tests/admission_p4_corpus.rs`'s `CORPUS_ROOT`,
//! the same absolute-path pattern `engine/tests/common/mod.rs` uses for `POLYGONS_100K`). Run it
//! with `cargo test -p spatial-engine --test multipolygon_corpus -- --ignored`.
//!
//! The prediction, registered before any run (§3): streaming #12 whole-file yields 1,375 rows, one
//! per feature, with unique ids and no refusal. Wrong is a result.

use std::collections::HashSet;
use std::path::Path;

use spatial_engine::{Dataset, GeometryEncoding, ViewportQuery};

/// `engine/tests/admission_p4_corpus.rs`'s `CORPUS_ROOT`, and row #12's `suffix` there.
const CORPUS_ROOT: &str = r"C:\dev\spatial-ide\target\fixtures\compat-corpus";
const ROW_12: &str = "overture/overture-2026-08-19.0-building-bern.parquet";

/// **RESULT, observed over `d8276158` (the golden commit) with this commit's tree: the registered
/// prediction is wrong.** Row #12 does not reach its stream. `Dataset::open` refuses it at
/// identity admission as `IdentityUnusable { column: "id", .. }` (`id` is a nullable `Utf8`
/// column, and no 64-bit integer column exists to declare a mapping over): the geometry-type gate
/// MP-1 widens sat before the identity gate, so that refusal was never reachable until now. The
/// assertion below is left as registered (§5: wrong is a result, never edited to match), the
/// result is reported to the custodian, and this test fails at its first `expect` when run.
///
/// RECORDED MUTATION: none is observable. The test fails at open, before any stream exists, so no
/// mutation can be shown to fail it by name. (§4 names "as G-1" for this row, which cannot fail a
/// file that declares `[MultiPolygon, Polygon]` either way.)
#[test]
#[ignore = "reads the on-disk compatibility corpus (C:\\dev\\spatial-ide\\target\\fixtures\\compat-corpus)"]
fn streaming_corpus_row_12_whole_file_yields_one_row_per_feature_with_unique_ids() {
    let path = Path::new(CORPUS_ROOT).join(ROW_12);
    let ds = Dataset::open(&path).expect("row #12 opens (§3's C-12)");

    assert_eq!(ds.geometry_encoding(), GeometryEncoding::MultiPolygon);
    assert_eq!(
        ds.declared_geometry_types(),
        Some(&["MultiPolygon".to_string(), "Polygon".to_string()][..]),
        "the declaration is kept as the file wrote it"
    );

    let mut s = ds.stream(&ViewportQuery::all()).expect("stream");
    let mut buf = Vec::new();
    let mut rows = 0usize;
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
            .downcast_ref::<arrow::array::UInt64Array>()
            .expect("ids");
        for id in col.values().iter() {
            assert!(ids.insert(*id), "id {id} repeated");
        }
    }
    assert_eq!(rows, 1_375, "one row per feature");
    assert_eq!(ids.len(), 1_375, "unique ids");
}
