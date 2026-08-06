//! **The product planner never consults the spatial index — proved, not timed.**
//!
//! `kernel/RESULTS.md`'s second section measured the fixed-grid index making every filtered query
//! slower (quarter extent, first batch: 140.2 → 190.1 ms; 1/64 extent: 49.7 → 58.4 ms), because its
//! candidate-ID ranges add work while DuckDB still scans the GeoParquet bbox columns. So the index
//! is out of the default planner. That leaves a claim that has to be *checkable*: not "it looks
//! like it isn't used", but "it is not reached".
//!
//! **A timing cannot establish this.** A query that happens to be fast is not a query that skipped
//! the index — that is exactly the inference `FilterPlan` exists to make unnecessary, and a
//! threshold would turn a structural property into a flaky test. `Dataset::admitted_index` counts
//! its own calls in a process-wide counter, and the assertion here is on the counter.
//!
//! ## Why this file exists rather than another test in `spatial_index.rs`
//!
//! **The counter and the index cache are both process-wide, and `cargo test` runs the tests inside
//! one integration-test binary in parallel threads.** A counter assertion sharing a process with
//! any other test that builds an index is racy, and a racy proof of a negative is worse than none.
//! Each integration-test *file* is its own binary and therefore its own process, so this file is
//! the isolation. It deliberately contains exactly one test.

use std::path::PathBuf;

use spatial_engine::dataset::index_consultations;
use spatial_engine::fixture::{write_geoparquet, FixtureSpec};
use spatial_engine::stream::FilterPlan;
use spatial_engine::{Bbox, CancelToken, Dataset, ViewportQuery};

#[test]
fn the_product_planner_never_reaches_the_index_seam() {
    let dir = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../target/fixtures/index");
    std::fs::create_dir_all(&dir).expect("fixture dir");
    let path = dir.join("planner-seam.parquet");
    let spec = FixtureSpec { features: 2_000, avg_vertices: 16, ..Default::default() };
    let facts = write_geoparquet(&path, &spec).expect("write fixture");

    let ds = Dataset::open(&path).expect("open");

    // An index that is built, cached, and admissible right now. Everything the old planner needed.
    let report = ds.build_index(&CancelToken::new()).expect("build index");
    assert!(report.miss.is_some(), "the first build cannot be a cache hit");
    assert_eq!(report.indexed_features, facts.features);

    let e = facts.extent;
    let view = Bbox {
        xmin: e[0] + (e[2] - e[0]) * 0.1,
        ymin: e[1] + (e[3] - e[1]) * 0.1,
        xmax: e[0] + (e[2] - e[0]) * 0.6,
        ymax: e[1] + (e[3] - e[1]) * 0.6,
    };
    let q = ViewportQuery::viewport(view, "EPSG:2056");

    // ---- the product path -------------------------------------------------------------------
    let before = index_consultations();
    let mut product = ds.stream(&q).expect("product stream");
    assert_eq!(product.filter_plan(), FilterPlan::ScanOnly, "the shipped plan is the scan");
    let product_ids = drain(&mut product);
    assert_eq!(
        index_consultations(),
        before,
        "the ordinary planner consulted the index seam; it must not reach it at all"
    );
    assert!(!product_ids.is_empty(), "the viewport must select something for this to mean anything");

    // A whole-file query does not reach it either — it never had a viewport to narrow.
    let before_whole = index_consultations();
    let mut whole = ds.stream(&ViewportQuery::all()).expect("whole-file stream");
    assert_eq!(whole.filter_plan(), FilterPlan::WholeFile);
    let whole_ids = drain(&mut whole);
    assert_eq!(whole_ids.len(), facts.features, "the whole file is still the whole file");
    assert_eq!(index_consultations(), before_whole);

    // ---- the experimental path, so the counter is shown to be able to move at all -----------
    //
    // Without this the assertions above would also pass against a counter that is never
    // incremented by anything, which would make them a test of nothing.
    let before_experimental = index_consultations();
    let mut experimental = ds
        .stream_indexed_experimental(&q, CancelToken::new())
        .expect("experimental stream");
    assert!(
        matches!(experimental.filter_plan(), FilterPlan::IndexNarrowed { .. }),
        "the experimental seam must actually reach the index, got {:?}",
        experimental.filter_plan()
    );
    let experimental_ids = drain(&mut experimental);
    assert!(
        index_consultations() > before_experimental,
        "the counter must be able to move, or the assertions above prove nothing"
    );

    // And the two planners agree about the rows, which is why removing the index from the default
    // path is a cost decision rather than a correctness one.
    assert_eq!(experimental_ids, product_ids, "both planners must select exactly the same rows");
}

fn drain(s: &mut spatial_engine::BatchStream) -> Vec<u64> {
    let mut ids = Vec::new();
    let mut buf = Vec::new();
    while let Some(info) = s.next_into(&mut buf) {
        info.expect("batch");
        let mut rdr =
            arrow::ipc::reader::StreamReader::try_new(std::io::Cursor::new(&buf), None).unwrap();
        let batch = rdr.next().unwrap().unwrap();
        let col = batch.column(0).as_any().downcast_ref::<arrow::array::UInt64Array>().unwrap();
        ids.extend(col.values().iter().copied());
        buf.clear();
    }
    ids.sort_unstable();
    ids
}
