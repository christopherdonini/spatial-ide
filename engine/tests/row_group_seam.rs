// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **The product planner never consults the row-group index — proved, not timed.**
//!
//! Lever B2's row-group index is out of the default planner, and its preregistered gate is
//! unanswered (`docs/07`: "an index that prunes actual IO is a separate, architect-first design with
//! its own preregistered gate"). That leaves a claim that has to be *checkable*: not "it looks like
//! it isn't used", but "it is not reached".
//!
//! **A timing cannot establish this**, for the reason `planner_seam.rs` gives about the fixed-grid
//! index: a query that happens to be fast is not a query that skipped an index, and a threshold
//! would turn a structural property into a flaky test. `Dataset::admitted_row_groups` counts its own
//! calls in a process-wide counter, and the assertion is on the counter.
//!
//! ## Why this is its own file, and it is not a style choice
//!
//! The counter and the index cache are process-wide, and `cargo test` runs one integration-test
//! file's tests in parallel threads inside a single binary. This assertion first lived in
//! `first_batch_and_pruning.rs` beside tests that *do* reach the seam, passed when that file was run
//! alone, and **failed in the full-workspace run** — which is the failure mode `planner_seam.rs`'s
//! header predicted in advance. Each integration-test file is its own process, so this file is the
//! isolation, and like its predecessor it deliberately contains exactly one test.

use std::path::PathBuf;

use spatial_engine::dataset::row_group_consultations;
use spatial_engine::fixture::{write_geoparquet, FixtureSpec};
use spatial_engine::stream::FilterPlan;
use spatial_engine::{Bbox, CancelToken, Dataset, ViewportQuery};

#[test]
fn the_product_planner_never_reaches_the_row_group_seam() {
    let dir = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../target/fixtures/first-batch");
    std::fs::create_dir_all(&dir).expect("fixture dir");
    let path = dir.join("row-group-seam.parquet");
    let spec = FixtureSpec {
        features: 8_192,
        avg_vertices: 16,
        chunk: 2_048,
        row_group_rows: 2_048,
        ..Default::default()
    };
    let facts = write_geoparquet(&path, &spec).expect("write fixture");

    let ds = Dataset::open(&path).expect("open");

    // An index that is built, cached and admissible right now — everything a planner would need if
    // it wanted one. The point is that the planner does not want one.
    let report = ds.build_row_group_index(&CancelToken::new()).expect("build");
    assert!(report.miss.is_some(), "the first build cannot be a cache hit");
    assert_eq!(report.admissible, Ok(()), "this fixture's layout is admissible, so the seam *could* serve");
    assert_eq!(report.row_groups, facts.features.div_ceil(spec.row_group_rows));

    let before = row_group_consultations();

    let cols = (spec.features as f64).sqrt().ceil();
    let edge = ((cols as usize / 2) as f64) * 40.0 + 20.0;
    let view = Bbox {
        xmin: 2_600_000.0,
        ymin: 1_200_000.0,
        xmax: 2_600_000.0 + edge,
        ymax: 1_200_000.0 + edge,
    };
    let q = ViewportQuery::viewport(view, ds.crs().identifier());

    // Both product entry points: the plain viewport stream and the publish stream.
    let mut stream = ds.stream(&q).expect("stream");
    assert_eq!(stream.filter_plan(), FilterPlan::ScanOnly);
    let mut buf = Vec::new();
    let mut rows = 0usize;
    while let Some(info) = stream.next_into(&mut buf) {
        rows += info.expect("batch").rows;
        buf.clear();
    }
    assert!(rows > 0, "the viewport selected nothing, so this proves nothing");

    let projection = ds.resolve_projection(&[]).expect("empty projection");
    let mut publish = ds.stream_for_publish(&q, &projection, CancelToken::new()).expect("publish");
    while let Some(info) = publish.next_into(&mut buf) {
        info.expect("publish batch");
        buf.clear();
    }

    assert_eq!(
        row_group_consultations(),
        before,
        "a product path consulted the row-group seam; it is measurement-only and must be \
         unreachable except through the explicitly-named experimental entry points"
    );

    // **The negative control, and without it this file is a test of nothing.**
    //
    // `planner_seam.rs` records the reason: every assertion above would also pass against a counter
    // that nothing ever increments, so deleting the `fetch_add` in `admitted_row_groups` would leave
    // the whole file green. This is the one call that must move it.
    let mut experimental = ds
        .stream_rowgroup_pruned_experimental(&q, CancelToken::new())
        .expect("experimental stream");
    assert!(
        matches!(
            experimental.filter_plan(),
            FilterPlan::RowGroupsPruned { .. } | FilterPlan::RowGroupsKeptAll { .. }
        ),
        "the experimental seam did not reach the index: {:?}",
        experimental.filter_plan()
    );
    while let Some(info) = experimental.next_into(&mut buf) {
        info.expect("experimental batch");
        buf.clear();
    }
    assert!(
        row_group_consultations() > before,
        "the experimental entry point did not consult the seam, so the assertion above is vacuous"
    );
}
