// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! The two levers of the first-batch cut, tested for the properties that make them **safe** rather
//! than for the property that would make them useful.
//!
//! Neither lever's preregistered gate is answered here and neither may be. What is asserted is what
//! a measurement cannot establish and a reviewer should not have to take on trust:
//!
//! - **Lever A** — the time budget never reaches the publish path, never appears on a batch other
//!   than index 0, and returns exactly the rows the size-only policy returns.
//! - **Lever B2** — the row-group index returns exactly the rows the scan returns, its metadata
//!   column paths are the ones this DuckDB actually reports, and every refusal is a named variant.
//! - **Lever B1** — a clustered variant carries **the same features, byte for byte**, and its
//!   `geo` metadata survives the rewrite. The same is asserted of `ClusterOrder::Shuffled`, the
//!   import-layout cut's shuffled control `R` (`kernel/IMPORT-LAYOUT-PREREGISTRATION.md` §4/§5),
//!   which additionally has its own determinism condition to prove: `ORDER BY hash(id), id`, never
//!   `random()`.
//!
//! ## The comparison used throughout, and why it is not a concatenation hash
//!
//! `RowOrdering::Unordered` promises no order, and a layout variant necessarily has a different one,
//! so "byte-identical payload" is unachievable for B1 and unguaranteed for B2. The comparison is a
//! **sorted per-feature digest set** `{(id, sha256(wkb))}`: byte-level identity of every geometry,
//! order-independent by construction, and strictly stronger evidence of "exactly the same rows"
//! than a checksum over a concatenation.

use std::collections::BTreeSet;
use std::path::PathBuf;

use spatial_engine::fixture::{write_geoparquet, FixtureFacts, FixtureSpec};
use spatial_engine::layout::{
    hilbert_d2xy, hilbert_xy2d, write_clustered_variant, ClusterOrder, DeclaredExtent, VariantSpec,
    AXIS_CELLS,
};
use spatial_engine::rowgroup::RowGroupRefusal;
use spatial_engine::stream::{BatchCut, BatchSizePolicy, FilterPlan};
use spatial_engine::{Bbox, CancelToken, Dataset, ViewportQuery};

// ---- fixtures ----------------------------------------------------------------------------------

/// Small enough to be a unit-test cost, big enough to have **several row groups** — which is the
/// whole point: a single-row-group file has nothing to prune and would let every B2 assertion here
/// pass vacuously.
/// `row_group_rows` is **2 048, a multiple of DuckDB's vector size, and that is not arbitrary**: a
/// clustered variant is written by DuckDB's own parquet writer, which flushes on such a multiple, so
/// any other value would give the variant a different row-group layout than its source and confound
/// every comparison between them. `layout::write_clustered_variant` refuses that case outright; this
/// is the value that satisfies it.
fn multi_row_group() -> FixtureSpec {
    FixtureSpec {
        features: 8_192,
        avg_vertices: 16,
        chunk: 2_048,
        row_group_rows: 2_048,
        ..Default::default()
    }
}

fn write(name: &str, spec: &FixtureSpec) -> (PathBuf, FixtureFacts) {
    let dir = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../target/fixtures/first-batch");
    std::fs::create_dir_all(&dir).expect("fixture dir");
    let path = dir.join(format!("{name}.parquet"));
    let facts = write_geoparquet(&path, spec).expect("write fixture");
    (path, facts)
}

/// The fixture's grid, restated from `fixture::parcel`'s own arithmetic (those locals are private).
/// A generator change would move this silently, so every viewport below is checked against a row
/// count taken from the unindexed scan rather than against a number written here.
fn grid(spec: &FixtureSpec) -> (f64, f64) {
    let cols = (spec.features as f64).sqrt().ceil();
    (cols, 40.0)
}

fn quarter(spec: &FixtureSpec) -> Bbox {
    let (cols, cell) = grid(spec);
    // An edge on a cell **centre**, so inclusion is pure arithmetic and cannot depend on per-feature
    // vertex jitter — the correction `kernel/tests/scale_pass.rs::viewport_edge` records.
    let edge = ((cols as usize / 2) as f64) * cell + cell / 2.0;
    Bbox {
        xmin: 2_600_000.0,
        ymin: 1_200_000.0,
        xmax: 2_600_000.0 + edge,
        ymax: 1_200_000.0 + edge,
    }
}

/// The **far** quarter: the same x band, the y band at the top of the extent.
///
/// It exists because every viewport this repository had registered is south-west anchored, so its
/// matching rows sit at the *front* of a raster-ordered scan while row-group elimination removes
/// work from the *tail*. Without this cell, lever B2's effect on time-to-first-batch is answered by
/// arithmetic rather than by measurement.
fn far_quarter(spec: &FixtureSpec) -> Bbox {
    let (cols, cell) = grid(spec);
    let edge = ((cols as usize / 2) as f64) * cell + cell / 2.0;
    let top = 1_200_000.0 + (cols - 1.0) * cell + cell / 2.0;
    Bbox { xmin: 2_600_000.0, ymin: top - edge, xmax: 2_600_000.0 + edge, ymax: top }
}

/// `{(id, sha256(wkb))}` for a stream — the comparison this file's header describes.
fn digest_set(mut stream: spatial_engine::BatchStream) -> (BTreeSet<(u64, String)>, Vec<BatchCut>) {
    use arrow::array::Array;
    let mut out = BTreeSet::new();
    let mut cuts = Vec::new();
    let mut buf = Vec::new();
    while let Some(info) = stream.next_into(&mut buf) {
        let info = info.expect("batch");
        cuts.push(info.cut_by);
        let reader = arrow::ipc::reader::StreamReader::try_new(std::io::Cursor::new(&buf), None)
            .expect("ipc reader");
        for batch in reader {
            let batch = batch.expect("record batch");
            let ids = batch
                .column_by_name(spatial_engine::ID_COLUMN)
                .expect("id column")
                .as_any()
                .downcast_ref::<arrow::array::UInt64Array>()
                .expect("u64 ids")
                .clone();
            let geom = batch.column_by_name("geometry").expect("geometry column");
            for r in 0..batch.num_rows() {
                out.insert((ids.value(r), geometry_digest(geom, r)));
            }
        }
        buf.clear();
    }
    (out, cuts)
}

/// A stable digest of one feature's GeoArrow coordinates.
///
/// Taken over the **decoded coordinates**, not over WKB: the engine emits GeoArrow, so the WKB is
/// not on the wire to hash. Every f64 goes in, in order, so a swapped vertex, a swapped ring and a
/// swapped feature are all visible — which `coord_bits_xor`, being order-independent, is not.
fn geometry_digest(col: &arrow::array::ArrayRef, row: usize) -> String {
    use arrow::array::Array;
    use sha2::{Digest, Sha256};
    let list = col
        .as_any()
        .downcast_ref::<arrow::array::ListArray>()
        .expect("geometry is List<rings>");
    let rings = list.value(row);
    let rings = rings.as_any().downcast_ref::<arrow::array::ListArray>().expect("List<vertices>");
    let mut h = Sha256::new();
    for r in 0..rings.len() {
        let verts = rings.value(r);
        let verts = verts
            .as_any()
            .downcast_ref::<arrow::array::FixedSizeListArray>()
            .expect("FixedSizeList<xy>");
        let xy = verts.values();
        let xy = xy.as_any().downcast_ref::<arrow::array::Float64Array>().expect("f64 xy");
        h.update((xy.len() as u64).to_le_bytes());
        for v in xy.values() {
            h.update(v.to_bits().to_le_bytes());
        }
    }
    format!("{:x}", h.finalize())
}

// ---- lever A -----------------------------------------------------------------------------------

#[test]
fn the_budgeted_stream_returns_exactly_what_the_size_only_stream_returns() {
    let spec = multi_row_group();
    let (path, _) = write("lever-a", &spec);
    let ds = Dataset::open(&path).expect("open");
    let q = ViewportQuery::viewport(quarter(&spec), ds.crs().identifier());

    let (plain, _) = digest_set(ds.stream(&q).expect("plain stream"));
    let (budgeted, cuts) = digest_set(
        ds.stream_budgeted_experimental(&q, CancelToken::new()).expect("budgeted stream"),
    );

    assert!(!plain.is_empty(), "the viewport must select something or this test proves nothing");
    assert_eq!(plain, budgeted, "the time budget changed which rows a query returns");

    // **The invariant that is deterministic even though the budget's firing is not.** The budget is
    // armed for batch 0 only; a `TimeBudget` cut anywhere else would mean the guard on `emitted`
    // had been lost, and no timing would reveal it.
    for (i, cut) in cuts.iter().enumerate() {
        if *cut == BatchCut::TimeBudget {
            assert_eq!(i, 0, "the time budget cut batch {i}; it is armed for batch 0 only");
        }
    }
}

#[test]
fn a_size_only_stream_never_reports_a_time_budget_cut() {
    let spec = multi_row_group();
    let (path, _) = write("lever-a-disarmed", &spec);
    let ds = Dataset::open(&path).expect("open");
    let q = ViewportQuery::viewport(quarter(&spec), ds.crs().identifier());
    let (_, cuts) = digest_set(ds.stream(&q).expect("stream"));
    assert!(!cuts.is_empty());
    assert!(
        !cuts.contains(&BatchCut::TimeBudget),
        "a disarmed policy reported a budget cut: {cuts:?}"
    );
    // The last batch of any stream is the one the source ran out on.
    assert_eq!(cuts.last(), Some(&BatchCut::StreamEnd));
}

#[test]
fn the_publish_path_refuses_a_time_budget_rather_than_ignoring_it() {
    // The structural half of the ADR-017 §12 protection. `stream_for_publish` cannot *reach* the
    // budgeted policy — that is the point — so what is asserted here is the other half: the policy
    // it does use is size-only, and the refusal predicate that guards the combination is exercised
    // by `stream.rs`'s own truth-table unit test.
    assert_eq!(BatchSizePolicy::publish().cut, spatial_engine::BatchCutPolicy::SizeOnly);
}

// ---- lever B2 ----------------------------------------------------------------------------------

#[test]
fn the_row_group_index_returns_exactly_what_the_scan_returns() {
    let spec = multi_row_group();
    let (path, facts) = write("lever-b2", &spec);
    let ds = Dataset::open(&path).expect("open");

    let report = ds.build_row_group_index(&CancelToken::new()).expect("build row-group index");
    assert!(report.miss.is_some(), "the first build cannot be a cache hit");
    assert_eq!(report.admissible, Ok(()), "the generator's ids are dense and ordered per row group");
    assert_eq!(
        report.row_groups,
        facts.features.div_ceil(spec.row_group_rows),
        "the file's row-group count is not what the writer was told to produce"
    );
    // Build cost and query benefit are separate numbers and are never netted here.
    assert!(report.build_millis >= 0.0 && report.content_hash_millis >= 0.0);
    // The declared bound is per entry and is checked against the type at compile time; here it is
    // checked to actually scale with what was built rather than being a constant nobody reads.
    assert_eq!(
        report.declared_memory_bytes,
        report.row_groups * spatial_engine::rowgroup::BYTES_PER_ROW_GROUP_ENTRY
    );

    // A cached build is a hit, and it is *reported* as one rather than inferred from being fast.
    let again = ds.build_row_group_index(&CancelToken::new()).expect("rebuild");
    assert!(again.miss.is_none(), "the second build should have been served from the cache");

    for (label, view) in [("near", quarter(&spec)), ("far", far_quarter(&spec))] {
        let q = ViewportQuery::viewport(view, ds.crs().identifier());
        let scan = ds.stream(&q).expect("scan");
        assert_eq!(scan.filter_plan(), FilterPlan::ScanOnly);
        let (scan_rows, _) = digest_set(scan);

        let pruned =
            ds.stream_rowgroup_pruned_experimental(&q, CancelToken::new()).expect("pruned");
        let plan = pruned.filter_plan();
        let (pruned_rows, _) = digest_set(pruned);

        assert!(!scan_rows.is_empty(), "{label}: the viewport selected nothing");
        assert_eq!(scan_rows, pruned_rows, "{label}: pruning changed the result set");

        // **`RowGroupsPruned` with `kept < total`, not "one of the plausible plans".**
        //
        // An earlier revision accepted `RowGroupsKeptAll` here too, and that made the test pass in
        // exactly the state this module names as its worst failure: get the `path_in_schema`
        // spelling wrong, every group loses its envelope, every group is retained, and the lever
        // reports a flawless null. This fixture's quarter viewport demonstrably excludes groups —
        // so requiring that is what makes the envelope logic load-bearing for the suite.
        match plan {
            FilterPlan::RowGroupsPruned { total, kept, ranges } => {
                assert!(kept < total, "{label}: plan claims pruning but kept {kept} of {total}");
                assert!(ranges >= 1);
                assert!(plan.claims_io_exclusion());
            }
            other => panic!("{label}: expected pruning, got {other:?}"),
        }
    }
}

#[test]
fn a_viewport_outside_the_extent_excludes_every_group_and_still_injects_nothing() {
    // `RowGroupsExcludeAll` is the arm whose own doc cites the historical bug where encoding an
    // empty candidate set as `WHERE 1=0` made every viewport query return zero rows. The behaviour
    // that replaces it — no range predicate at all, the scan reaching the same empty answer from
    // the file — has to be exercised, not just described.
    let spec = multi_row_group();
    let (path, _) = write("lever-b2-empty", &spec);
    let ds = Dataset::open(&path).expect("open");
    ds.build_row_group_index(&CancelToken::new()).expect("build");

    let far_away = Bbox { xmin: 2_900_000.0, ymin: 1_500_000.0, xmax: 2_900_100.0, ymax: 1_500_100.0 };
    let q = ViewportQuery::viewport(far_away, ds.crs().identifier());

    let (scan_rows, _) = digest_set(ds.stream(&q).expect("scan"));
    let pruned = ds.stream_rowgroup_pruned_experimental(&q, CancelToken::new()).expect("pruned");
    let plan = pruned.filter_plan();
    let (pruned_rows, _) = digest_set(pruned);

    assert!(scan_rows.is_empty(), "this viewport is outside the fixture's extent");
    assert_eq!(scan_rows, pruned_rows);
    assert!(
        matches!(plan, FilterPlan::RowGroupsExcludeAll { total } if total > 0),
        "expected every group excluded, got {plan:?}"
    );
    // And it must **not** be counted as an injection: nothing was put in the statement.
    assert!(
        !plan.claims_io_exclusion(),
        "a plan that injected no predicate must not claim to have excluded IO"
    );
}

#[test]
fn a_whole_file_query_does_no_metadata_work_at_all() {
    // A gate condition in its own right: with no viewport there is nothing to prune, and the
    // row-group seam must not be consulted, must not appear in the plan, and must not change the
    // result. Asserted through the plan rather than through a timing.
    let spec = multi_row_group();
    let (path, facts) = write("lever-b2-whole", &spec);
    let ds = Dataset::open(&path).expect("open");
    ds.build_row_group_index(&CancelToken::new()).expect("build");

    let stream = ds
        .stream_rowgroup_pruned_experimental(&ViewportQuery::all(), CancelToken::new())
        .expect("whole file");
    assert_eq!(stream.filter_plan(), FilterPlan::WholeFile);
    let (rows, _) = digest_set(stream);
    assert_eq!(rows.len(), facts.features);
}

#[test]
fn an_inadmissible_file_still_returns_the_scan_s_rows_through_the_pruned_planner() {
    // The refusal is asserted at the index level elsewhere; this is the other half, and it is the
    // half that matters to a caller: a file whose layout refuses an injection must produce the
    // plain scan's result set, with the refusal *named* in the plan rather than absorbed.
    //
    // A clustered variant is the natural inadmissible file — its identity is no longer
    // row-group-ordered — and it is one this cut actually produces.
    let spec = multi_row_group();
    let (src, _) = write("lever-b2-inadmissible-src", &spec);
    let dst = src.with_file_name("lever-b2-inadmissible-hilbert16.parquet");
    let _ = std::fs::remove_file(&dst);
    let (cols, cell) = grid(&spec);
    write_clustered_variant(
        &src,
        &dst,
        &VariantSpec {
            order: ClusterOrder::Hilbert16,
            extent: DeclaredExtent {
                xmin: 2_600_000.0,
                ymin: 1_200_000.0,
                xmax: 2_600_000.0 + cols * cell,
                ymax: 1_200_000.0 + cols * cell,
            },
            row_group_rows: spec.row_group_rows,
            id_column: "id".into(),
        },
        &CancelToken::new(),
    )
    .expect("variant");

    let ds = Dataset::open(&dst).expect("open variant");
    let report = ds.build_row_group_index(&CancelToken::new()).expect("build");
    assert_eq!(report.admissible, Err(RowGroupRefusal::IdRangesOverlap));

    let q = ViewportQuery::viewport(quarter(&spec), ds.crs().identifier());
    let (scan_rows, _) = digest_set(ds.stream(&q).expect("scan"));
    let pruned = ds.stream_rowgroup_pruned_experimental(&q, CancelToken::new()).expect("pruned");
    let plan = pruned.filter_plan();
    let (pruned_rows, _) = digest_set(pruned);

    assert!(!scan_rows.is_empty());
    assert_eq!(scan_rows, pruned_rows, "a refused file must still return the scan's rows");
    assert!(
        matches!(
            plan,
            FilterPlan::RowGroupsNotPrunable { reason: RowGroupRefusal::IdRangesOverlap, .. }
        ),
        "the refusal must reach the plan by name, got {plan:?}"
    );
    assert!(!plan.claims_io_exclusion());
}

#[test]
fn the_control_layout_differs_from_a_clustered_one_only_in_the_row_order() {
    // **The confound control.** A variant is written by DuckDB's parquet writer; the fixtures it is
    // made from are written by arrow-rs. Differencing a clustered variant against its arrow-rs
    // source measures writer *and* order. `ClusterOrder::SourceIdentity` runs the identical `COPY`
    // with the identical writer settings and only the `ORDER BY` changed, so the pair differs by
    // the order alone — and this test is what says the control is really a control.
    let spec = multi_row_group();
    let (src, facts) = write("lever-b1-control-src", &spec);
    let (cols, cell) = grid(&spec);
    let extent = DeclaredExtent {
        xmin: 2_600_000.0,
        ymin: 1_200_000.0,
        xmax: 2_600_000.0 + cols * cell,
        ymax: 1_200_000.0 + cols * cell,
    };

    let mut written = Vec::new();
    for order in [ClusterOrder::SourceIdentity, ClusterOrder::Hilbert16] {
        let dst = src.with_file_name(format!("lever-b1-control-{}.parquet", order.as_str()));
        let _ = std::fs::remove_file(&dst);
        let out = write_clustered_variant(
            &src,
            &dst,
            &VariantSpec {
                order,
                extent,
                row_group_rows: spec.row_group_rows,
                id_column: "id".into(),
            },
            &CancelToken::new(),
        )
        .expect("variant");
        assert_eq!(out.features, facts.features as u64);
        written.push((order, dst));
    }

    // The control keeps the source's identity order, so it is still admissible to lever B2; the
    // clustered one is not. That difference *is* the row order, and nothing else in the pair
    // differs at all.
    let (_, control) = &written[0];
    let (_, clustered) = &written[1];
    assert!(
        id_ranges_are_disjoint_and_ordered(control),
        "the identity-order control should still be row-group-ordered"
    );
    assert!(
        !id_ranges_are_disjoint_and_ordered(clustered),
        "the clustered variant should not be"
    );

    // Same features in both, and the same features as the source.
    let (sa, _) = digest_set(Dataset::open(&src).expect("src").stream(&ViewportQuery::all()).expect("s"));
    for (order, p) in &written {
        let (sb, _) =
            digest_set(Dataset::open(p).expect("variant").stream(&ViewportQuery::all()).expect("v"));
        assert_eq!(sa, sb, "{} lost or changed a feature", order.as_str());
    }
}

#[test]
fn both_levers_at_once_still_return_the_scan_s_rows() {
    // The factorial has a cell with both levers armed, and a cell that cannot be constructed cannot
    // be measured. This is that cell's correctness assertion.
    let spec = multi_row_group();
    let (path, _) = write("lever-ab", &spec);
    let ds = Dataset::open(&path).expect("open");
    ds.build_row_group_index(&CancelToken::new()).expect("build");
    let q = ViewportQuery::viewport(quarter(&spec), ds.crs().identifier());

    let (scan, _) = digest_set(ds.stream(&q).expect("scan"));
    let (both, cuts) = digest_set(
        ds.stream_rowgroup_pruned_budgeted_experimental(&q, CancelToken::new()).expect("both"),
    );
    assert_eq!(scan, both);
    for (i, cut) in cuts.iter().enumerate() {
        if *cut == BatchCut::TimeBudget {
            assert_eq!(i, 0);
        }
    }
}

#[test]
fn a_file_whose_identity_is_not_row_group_ordered_is_refused_and_says_which_way() {
    // `IdentityMode::DuplicateIds` writes the constant 7 in every row, so every row group's id
    // interval is `[7, 7]` — overlapping, and therefore unusable for an id-range injection. The
    // file is refused *by name*, not by silently keeping every group, which would look like a
    // flawless null in a measurement.
    let spec = FixtureSpec {
        identity: spatial_engine::fixture::IdentityMode::DuplicateIds,
        ..multi_row_group()
    };
    let (path, _) = write("lever-b2-refused", &spec);
    // The engine refuses a duplicate identity at open time (ADR-016), so the refusal is asserted
    // on the index directly rather than through a `Dataset`.
    let conn = duckdb::Connection::open_in_memory().expect("conn");
    conn.execute_batch("SET enable_geoparquet_conversion=false;").expect("pragma");
    let covering = spatial_engine::geoparquet::GeoMeta::parse(&geo_key(&conn, &path))
        .expect("geo")
        .covering
        .expect("covering");
    let idx = spatial_engine::rowgroup::RowGroupIndex::build(
        &conn,
        path.to_str().unwrap(),
        &covering,
        "id",
        spatial_engine::rowgroup::RowGroupKey::new("test-hash", "id"),
        None,
        &CancelToken::new(),
        None,
    )
    .expect("build");
    assert_eq!(idx.admissible(), Err(RowGroupRefusal::IdRangesOverlap));
    assert_eq!(
        idx.ranges_for(&quarter(&spec)),
        Err(RowGroupRefusal::IdRangesOverlap),
        "an inadmissible file must narrow nothing, not narrow wrongly"
    );
}

#[test]
fn metadata_paths_match_what_duckdb_reports_for_a_struct_child() {
    // **This is the silent-failure guard.** DuckDB reports a struct child's `path_in_schema` as
    // `"bbox, xmin"` — comma and space — where the file's schema path is `bbox.xmin`. Getting it
    // wrong fails quietly in the worst possible way: every group would have no envelope, every
    // group would be retained, and the lever would report a perfect null.
    let spec = multi_row_group();
    let (path, _) = write("lever-b2-paths", &spec);
    let conn = duckdb::Connection::open_in_memory().expect("conn");
    let mut stmt = conn
        .prepare("SELECT DISTINCT path_in_schema FROM parquet_metadata(?)")
        .expect("prepare");
    let mut rows = stmt.query([path.to_str().unwrap()]).expect("query");
    let mut seen = BTreeSet::new();
    while let Some(r) = rows.next().expect("row") {
        seen.insert(r.get::<_, String>(0).expect("path"));
    }
    for want in ["bbox, xmin", "bbox, ymin", "bbox, xmax", "bbox, ymax", "id"] {
        assert!(seen.contains(want), "duckdb no longer reports `{want}`; it reports {seen:?}");
    }
}

// The proof that the product planner never reaches the row-group seam lives in its own file —
// `row_group_seam.rs` — and the reason is the one `planner_seam.rs` already records: the counter is
// process-wide, `cargo test` runs a file's tests in parallel threads inside one binary, and a
// counter assertion sharing a process with any test that *does* consult the seam is racy. It was
// here first and failed exactly that way in the full-workspace run.

// ---- lever B1 ----------------------------------------------------------------------------------

#[test]
fn a_clustered_variant_carries_the_same_features_and_the_same_geo_metadata() {
    let spec = multi_row_group();
    let (src, facts) = write("lever-b1-src", &spec);
    let dst = src.with_file_name("lever-b1-hilbert16.parquet");
    let _ = std::fs::remove_file(&dst);

    let (cols, cell) = grid(&spec);
    let variant = VariantSpec {
        order: ClusterOrder::Hilbert16,
        // The **declared** extent, from the generator's own grid arithmetic — never the measured
        // one, which would make the ordering depend on the last vertex's jitter.
        extent: DeclaredExtent {
            xmin: 2_600_000.0,
            ymin: 1_200_000.0,
            xmax: 2_600_000.0 + cols * cell,
            ymax: 1_200_000.0 + cols * cell,
        },
        row_group_rows: spec.row_group_rows,
        id_column: "id".into(),
    };
    let out = write_clustered_variant(&src, &dst, &variant, &CancelToken::new()).expect("variant");

    assert_eq!(out.features, facts.features as u64);
    assert_eq!(out.clamped_features, 0, "every centroid should be inside the declared extent");
    assert!(out.carried_metadata_keys.contains(&"geo".to_string()));
    assert_eq!(out.row_groups, facts.features.div_ceil(spec.row_group_rows) as u64);

    // **Same features, byte for byte.** Both files opened as datasets, both streamed whole, digest
    // sets compared. This is what makes a B1 timing a statement about layout and nothing else.
    let a = Dataset::open(&src).expect("open source");
    let b = Dataset::open(&dst).expect("open variant");
    assert_eq!(a.crs().identifier(), b.crs().identifier(), "the variant lost its CRS");
    let (sa, _) = digest_set(a.stream(&ViewportQuery::all()).expect("stream source"));
    let (sb, _) = digest_set(b.stream(&ViewportQuery::all()).expect("stream variant"));
    assert_eq!(sa, sb, "the variant is not the same features as its source");

    // And the same viewport selects the same rows through it.
    let q = ViewportQuery::viewport(quarter(&spec), a.crs().identifier());
    let (qa, _) = digest_set(a.stream(&q).expect("q source"));
    let (qb, _) = digest_set(b.stream(&q).expect("q variant"));
    assert_eq!(qa, qb);
}

// ---- lever B1's shuffled control, `R` (`kernel/IMPORT-LAYOUT-PREREGISTRATION.md` §4/§5) --------

#[test]
fn a_shuffled_variant_carries_the_same_features_and_the_same_geo_metadata() {
    // The same B1 correctness proof as the Hilbert test above, run against `ClusterOrder::Shuffled`
    // instead. `rewrite`'s F3 written-layout verification and the confound guard do not branch on
    // `order` at all, so this is what shows they apply to the shuffled control identically, rather
    // than resting on that as an unexercised claim about shared code.
    let spec = multi_row_group();
    let (src, facts) = write("lever-r-src", &spec);
    let dst = src.with_file_name("lever-r-shuffled.parquet");
    let _ = std::fs::remove_file(&dst);

    let (cols, cell) = grid(&spec);
    let variant = VariantSpec {
        order: ClusterOrder::Shuffled,
        extent: DeclaredExtent {
            xmin: 2_600_000.0,
            ymin: 1_200_000.0,
            xmax: 2_600_000.0 + cols * cell,
            ymax: 1_200_000.0 + cols * cell,
        },
        row_group_rows: spec.row_group_rows,
        id_column: "id".into(),
    };
    let out = write_clustered_variant(&src, &dst, &variant, &CancelToken::new()).expect("variant");

    assert_eq!(out.features, facts.features as u64);
    assert!(out.carried_metadata_keys.contains(&"geo".to_string()));
    assert_eq!(out.row_groups, facts.features.div_ceil(spec.row_group_rows) as u64);

    let a = Dataset::open(&src).expect("open source");
    let b = Dataset::open(&dst).expect("open variant");
    assert_eq!(a.crs().identifier(), b.crs().identifier(), "the variant lost its CRS");
    let (sa, _) = digest_set(a.stream(&ViewportQuery::all()).expect("stream source"));
    let (sb, _) = digest_set(b.stream(&ViewportQuery::all()).expect("stream variant"));
    assert_eq!(sa, sb, "the shuffled variant is not the same features as its source");

    // Structural evidence the shuffle actually reordered rows, on the same B2-admissibility check
    // the Hilbert test uses: `hash(id)` has no relationship to the source's raster order, so a
    // shuffled file's per-row-group id ranges must not still be disjoint and ascending.
    assert!(
        !id_ranges_are_disjoint_and_ordered(&dst),
        "a shuffled file's identity should not still be row-group-ordered"
    );
}

#[test]
fn the_shuffled_order_is_deterministic_across_two_independent_rewrites() {
    // The preregistration's determinism condition for `R`, made a fact rather than an intention:
    // `ORDER BY hash(id), id`, never `random()`. Two rewrites of the identical source, through the
    // identical `COPY`, from two separate calls — so nothing is cached or shared between them —
    // must land on byte-identical files.
    let spec = multi_row_group();
    let (src, _) = write("lever-r-determinism-src", &spec);
    let (cols, cell) = grid(&spec);
    let extent = DeclaredExtent {
        xmin: 2_600_000.0,
        ymin: 1_200_000.0,
        xmax: 2_600_000.0 + cols * cell,
        ymax: 1_200_000.0 + cols * cell,
    };

    let mut hashes = Vec::new();
    for i in 0..2 {
        let dst = src.with_file_name(format!("lever-r-determinism-{i}.parquet"));
        let _ = std::fs::remove_file(&dst);
        write_clustered_variant(
            &src,
            &dst,
            &VariantSpec {
                order: ClusterOrder::Shuffled,
                extent,
                row_group_rows: spec.row_group_rows,
                id_column: "id".into(),
            },
            &CancelToken::new(),
        )
        .expect("variant");
        let (hash, _) = spatial_engine::index::content_hash(&dst, &CancelToken::new())
            .expect("hash the written variant");
        hashes.push(hash);
    }
    assert_eq!(
        hashes[0], hashes[1],
        "`ORDER BY hash(id), id` must be deterministic across independent rewrites, unlike `random()`"
    );
}

#[test]
fn the_shuffled_order_is_exactly_hash_id_then_id_in_file_order() {
    // Not only "not raster order" (the structural test above) but the **exact** order the
    // preregistration names, checked against a query this module's own rewrite never issues:
    // reading the variant's ids in physical file order must match an independently-issued
    // `ORDER BY hash(id), id` over the untouched source.
    let spec = multi_row_group();
    let (src, _) = write("lever-r-order-src", &spec);
    let dst = src.with_file_name("lever-r-order.parquet");
    let _ = std::fs::remove_file(&dst);
    let (cols, cell) = grid(&spec);
    write_clustered_variant(
        &src,
        &dst,
        &VariantSpec {
            order: ClusterOrder::Shuffled,
            extent: DeclaredExtent {
                xmin: 2_600_000.0,
                ymin: 1_200_000.0,
                xmax: 2_600_000.0 + cols * cell,
                ymax: 1_200_000.0 + cols * cell,
            },
            row_group_rows: spec.row_group_rows,
            id_column: "id".into(),
        },
        &CancelToken::new(),
    )
    .expect("variant");

    let written = ids_in_file_order(&dst);
    let expected = ids_in_hash_id_order(&src);
    assert_eq!(written.len(), spec.features);
    assert_eq!(
        written, expected,
        "the shuffled variant's physical row order does not match an independent `ORDER BY \
         hash(id), id` over the source"
    );
}

/// `id`, in the physical order `read_parquet` returns with no `ORDER BY` at all — DuckDB's
/// `preserve_insertion_order` (on by default) is what makes this equal file order rather than
/// whatever a parallel scan's scheduling happened to produce.
fn ids_in_file_order(path: &std::path::Path) -> Vec<u64> {
    let conn = duckdb::Connection::open_in_memory().expect("conn");
    let mut stmt = conn.prepare("SELECT id FROM read_parquet(?)").expect("prepare");
    let mut rows = stmt.query([path.to_str().unwrap()]).expect("query");
    let mut out = Vec::new();
    while let Some(r) = rows.next().expect("row") {
        out.push(r.get::<_, u64>(0).expect("id"));
    }
    out
}

/// `id`, sorted by `hash(id), id` — the preregistration's exact wording, issued independently of
/// [`spatial_engine::layout::write_clustered_variant`]'s own SQL.
fn ids_in_hash_id_order(path: &std::path::Path) -> Vec<u64> {
    let conn = duckdb::Connection::open_in_memory().expect("conn");
    let mut stmt =
        conn.prepare("SELECT id FROM read_parquet(?) ORDER BY hash(id), id").expect("prepare");
    let mut rows = stmt.query([path.to_str().unwrap()]).expect("query");
    let mut out = Vec::new();
    while let Some(r) = rows.next().expect("row") {
        out.push(r.get::<_, u64>(0).expect("id"));
    }
    out
}

#[test]
fn clustering_reorders_the_file_and_that_costs_it_lever_b2() {
    // **The structural consequence the two levers have for each other, and it is not a scoping
    // choice.**
    //
    // Lever B1 reorders rows by a space-filling curve. Lever B2 needs the identity column's
    // per-row-group statistics to be monotone and pairwise disjoint in file order — a property
    // ADR-016 never promised and which raster order happened to provide. Clustering destroys it, so
    // **a clustered file is refused by B2 by construction**: the two levers cannot both be in force
    // on one file. That is worth a test rather than a sentence, because it is the kind of fact that
    // would otherwise be discovered as a confusing null in a factorial cell.
    //
    // It is also the guard that the rewrite is not a no-op: a file whose identity is still
    // row-group-ordered was never reordered.
    //
    // **What this test deliberately does not assert:** that clustering prunes better. It does not
    // do so uniformly — measured on this shape, Hilbert keeps *more* row groups than raster order at
    // a quarter viewport and fewer at 1/64 — because raster strips span the full x extent and so
    // cost the viewport's *height*, while curve blobs cost its *area plus a boundary term* that
    // dominates when a file has few row groups. That is a measurement and belongs in the results,
    // not in an assertion here.
    // **Self-contained, with its own file names.** An earlier revision reused the previous test's
    // files and read one while the other test's thread was still writing it — `cargo test` runs a
    // file's tests in parallel threads inside one process, so a fixture shared between two tests is
    // a race, and a racy proof of a mechanism is worse than none.
    let spec = multi_row_group();
    let (src, _) = write("lever-b1-envelope-src", &spec);
    let dst = src.with_file_name("lever-b1-envelope-hilbert16.parquet");
    let _ = std::fs::remove_file(&dst);
    let (cols, cell) = grid(&spec);
    write_clustered_variant(
        &src,
        &dst,
        &VariantSpec {
            order: ClusterOrder::Hilbert16,
            extent: DeclaredExtent {
                xmin: 2_600_000.0,
                ymin: 1_200_000.0,
                xmax: 2_600_000.0 + cols * cell,
                ymax: 1_200_000.0 + cols * cell,
            },
            row_group_rows: spec.row_group_rows,
            id_column: "id".into(),
        },
        &CancelToken::new(),
    )
    .expect("variant");

    // The source is row-group-ordered in its identity; the variant is not. Both halves asserted,
    // because only the pair says "the rewrite happened AND it cost the property".
    assert!(id_ranges_are_disjoint_and_ordered(&src), "the source should be raster-ordered");
    assert!(
        !id_ranges_are_disjoint_and_ordered(&dst),
        "the clustered variant's identity is still row-group-ordered, so nothing was reordered"
    );

    // And the refusal is the named one, reached through the index rather than asserted about it.
    let conn = duckdb::Connection::open_in_memory().expect("conn");
    conn.execute_batch("SET enable_geoparquet_conversion=false;").expect("pragma");
    let covering = spatial_engine::geoparquet::GeoMeta::parse(&geo_key(&conn, &dst))
        .expect("geo")
        .covering
        .expect("covering");
    let idx = spatial_engine::rowgroup::RowGroupIndex::build(
        &conn,
        dst.to_str().unwrap(),
        &covering,
        "id",
        spatial_engine::rowgroup::RowGroupKey::new("variant-hash", "id"),
        None,
        &CancelToken::new(),
        None,
    )
    .expect("build over the variant");
    assert_eq!(
        idx.admissible(),
        Err(RowGroupRefusal::IdRangesOverlap),
        "a spatially clustered file must be refused by the row-group seam, by name"
    );
}

/// Whether a file's per-row-group identity intervals are ordered and disjoint — B2's admissibility
/// condition, computed here independently of the module under test so the test is not the code.
fn id_ranges_are_disjoint_and_ordered(path: &std::path::Path) -> bool {
    let conn = duckdb::Connection::open_in_memory().expect("conn");
    let sql = "SELECT row_group_id, \
                 max(CASE WHEN path_in_schema='id' THEN CAST(stats_min_value AS UBIGINT) END), \
                 max(CASE WHEN path_in_schema='id' THEN CAST(stats_max_value AS UBIGINT) END) \
               FROM parquet_metadata(?) GROUP BY row_group_id ORDER BY row_group_id";
    let mut stmt = conn.prepare(sql).expect("prepare");
    let mut rows = stmt.query([path.to_str().unwrap()]).expect("query");
    let mut prev_hi: Option<u64> = None;
    while let Some(r) = rows.next().expect("row") {
        let lo: u64 = r.get(1).expect("min");
        let hi: u64 = r.get(2).expect("max");
        if lo > hi {
            return false;
        }
        if let Some(p) = prev_hi {
            if lo <= p {
                return false;
            }
        }
        prev_hi = Some(hi);
    }
    prev_hi.is_some()
}

#[test]
fn the_curve_orders_the_plane_and_not_the_row_number() {
    // A guard against the whole lever being a no-op: two cells adjacent in y must be closer on the
    // curve than two cells a quadrant apart. Stated as a property of the curve rather than of a
    // file, so it holds without generating one.
    let d_near = hilbert_xy2d(1000, 1000).abs_diff(hilbert_xy2d(1000, 1001));
    let d_far = hilbert_xy2d(1000, 1000).abs_diff(hilbert_xy2d(50_000, 50_000));
    assert!(d_near < d_far);
    // And the grid the keys are drawn on is the declared one.
    assert_eq!(hilbert_d2xy(hilbert_xy2d(AXIS_CELLS - 1, 0)), (AXIS_CELLS - 1, 0));
}

/// The `geo` footer key of a file, read through DuckDB.
fn geo_key(conn: &duckdb::Connection, path: &std::path::Path) -> String {
    let mut stmt = conn
        .prepare("SELECT value FROM parquet_kv_metadata(?) WHERE key = 'geo'")
        .expect("prepare");
    let mut rows = stmt.query([path.to_str().unwrap()]).expect("query");
    let r = rows.next().expect("row").expect("a geo key");
    let v: Vec<u8> = r.get(0).expect("value");
    String::from_utf8(v).expect("utf-8")
}
