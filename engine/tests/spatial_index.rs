//! The revision-keyed spatial index — `docs/07`'s open gate, tested for the two things that make
//! it safe rather than merely fast: **identical results to the unindexed scan**, and **a stale
//! index cannot serve a newer revision**.
//!
//! Authority for treating it as derived state is ADR-006 (pure transformation) and ADR-007 (owns no
//! mutation), **not** ADR-010 rule 5 — see `engine/src/index.rs`.

use std::path::PathBuf;

use spatial_engine::fixture::{write_geoparquet, FixtureFacts, FixtureSpec};
use spatial_engine::index::{
    compress_to_ranges, IndexKey, IndexMiss, ValidityHeuristic, ANSWERS_PREDICATE, BUILDER_VERSION,
};
use spatial_engine::stream::FilterPlan;
use spatial_engine::{Bbox, CancelToken, Dataset, ViewportQuery};

fn write(name: &str, spec: &FixtureSpec) -> (PathBuf, FixtureFacts) {
    let dir = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../target/fixtures/index");
    std::fs::create_dir_all(&dir).expect("fixture dir");
    let path = dir.join(format!("{name}.parquet"));
    let facts = write_geoparquet(&path, spec).expect("write fixture");
    (path, facts)
}

fn small() -> FixtureSpec {
    FixtureSpec { features: 4_000, avg_vertices: 16, ..Default::default() }
}

fn drain_ids(ds: &Dataset, q: &ViewportQuery) -> (Vec<u64>, FilterPlan) {
    let mut s = ds.stream(q).expect("stream");
    let plan = s.filter_plan();
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
    (ids, plan)
}

#[test]
fn an_indexed_query_returns_exactly_what_the_scan_returns() {
    // **The property that matters most.** The index narrows the scan; it does not replace the
    // predicate. If these two ever disagree, the index has become the system of record — which
    // ADR-006 says a pure transformation's cached output is not.
    let (path, facts) = write("equivalence", &small());

    let unindexed = Dataset::open(&path).expect("open");
    let e = facts.extent;
    let view = Bbox {
        xmin: e[0] + (e[2] - e[0]) * 0.15,
        ymin: e[1] + (e[3] - e[1]) * 0.15,
        xmax: e[0] + (e[2] - e[0]) * 0.55,
        ymax: e[1] + (e[3] - e[1]) * 0.55,
    };
    let q = ViewportQuery::viewport(view, "EPSG:2056");

    let (scan_ids, scan_plan) = drain_ids(&unindexed, &q);
    assert_eq!(scan_plan, FilterPlan::ScanOnly, "no index has been built yet");
    assert!(!scan_ids.is_empty(), "the viewport must select something for this to mean anything");

    let indexed = Dataset::open(&path).expect("open");
    let report = indexed.build_index(&CancelToken::new()).expect("build index");
    assert_eq!(report.indexed_features, facts.features);
    assert!(report.miss.is_some(), "the first build cannot be a cache hit");

    let (indexed_ids, indexed_plan) = drain_ids(&indexed, &q);
    assert!(
        matches!(indexed_plan, FilterPlan::IndexNarrowed { .. }),
        "the index should have been used, got {indexed_plan:?}"
    );
    assert_eq!(indexed_ids, scan_ids, "indexed and unindexed result sets must be identical");
}

#[test]
fn a_viewport_that_selects_nothing_is_answered_without_inventing_rows() {
    let (path, facts) = write("empty-view", &small());
    let ds = Dataset::open(&path).expect("open");
    ds.build_index(&CancelToken::new()).expect("build index");

    // Far outside the data's extent, still inside the declared CRS domain.
    let e = facts.extent;
    let away = Bbox {
        xmin: e[2] + 10_000.0,
        ymin: e[3] + 10_000.0,
        xmax: e[2] + 20_000.0,
        ymax: e[3] + 20_000.0,
    };
    let (ids, plan) = drain_ids(&ds, &ViewportQuery::viewport(away, "EPSG:2056"));
    assert!(ids.is_empty());
    assert_eq!(plan, FilterPlan::IndexNarrowed { ranges: 0, candidates: 0 });
}

#[test]
fn build_cost_and_reuse_are_separate_numbers_and_a_reuse_is_reported_as_one() {
    let (path, _) = write("reuse", &small());
    let ds = Dataset::open(&path).expect("open");

    let first = ds.build_index(&CancelToken::new()).expect("build");
    assert!(first.miss.is_some(), "first build is a miss");
    assert!(first.build_millis > 0.0, "a build that took no time did not happen");
    assert!(first.scanned_rows > 0);

    let second = ds.build_index(&CancelToken::new()).expect("reuse");
    assert!(second.miss.is_none(), "the second call must reuse, not rebuild");
    assert_eq!(second.build_millis, 0.0, "a reuse has no build cost, and says so");
    // The content hash is re-read either way: it is what makes the reuse *safe*, so its cost is
    // reported separately rather than hidden inside "reuse was free".
    assert!(second.content_hash_millis > 0.0);
}

#[test]
fn a_stale_index_cannot_serve_a_newer_revision() {
    // The whole point of keying. The file is rewritten with different content under the same path;
    // the cached index must be refused, not served.
    let (path, _) = write("revision", &small());
    let ds = Dataset::open(&path).expect("open");
    ds.build_index(&CancelToken::new()).expect("build");

    // A different file at the same path: different feature count, so different content.
    let (path2, _) = write("revision", &FixtureSpec { features: 1_000, ..small() });
    assert_eq!(path, path2);

    let reopened = Dataset::open(&path).expect("reopen");
    let report = reopened.build_index(&CancelToken::new()).expect("rebuild");
    assert!(
        report.miss.is_some(),
        "a changed source must not reuse the cached index; got a hit"
    );
    assert_eq!(report.indexed_features, 1_000, "the rebuilt index describes the new revision");
}

#[test]
fn the_key_refuses_a_different_builder_predicate_or_parameter_set() {
    // Each component of the key exists because something could change while the bytes do not.
    let base = IndexKey::new("hash");
    assert_eq!(base, IndexKey::new("hash"));

    let mut newer_builder = IndexKey::new("hash");
    newer_builder.builder_version = BUILDER_VERSION + 1;
    assert_ne!(base, newer_builder, "different code produces a different derived object");

    let mut stronger_question = IndexKey::new("hash");
    stronger_question.answers = "geometry-intersects".to_string();
    assert_ne!(
        base, stronger_question,
        "a covering-bbox index must never be promoted to answer true intersection"
    );
    assert_eq!(base.answers, ANSWERS_PREDICATE);
}

#[test]
fn the_validity_heuristic_is_never_an_identity_and_fails_closed() {
    let (path, _) = write("heuristic", &small());
    let here = ValidityHeuristic::of(&path);
    assert!(here.is_some());
    // Unknown is never "unchanged" — the alternative is exactly the silent staleness principle 8
    // forbids.
    assert!(!ValidityHeuristic::fail_closed_matches(here.as_ref(), None));
    assert!(!ValidityHeuristic::fail_closed_matches(None, here.as_ref()));
    assert!(ValidityHeuristic::fail_closed_matches(here.as_ref(), here.as_ref()));
}

#[test]
fn a_fragmented_candidate_set_falls_back_to_the_scan_and_says_so() {
    // `IndexTooFragmented` exists so that "there was no index" and "the index could not help" stay
    // distinguishable in a measurement. Asserted at the compression layer, where the decision is.
    let scattered: Vec<u64> = (0..5_000).map(|i| i * 2).collect();
    assert_eq!(compress_to_ranges(&scattered, 8), None, "scattered ids cannot be ranged");
    let contiguous: Vec<u64> = (0..5_000).collect();
    assert_eq!(compress_to_ranges(&contiguous, 8), Some(vec![(0, 4_999)]));
}

#[test]
fn index_build_is_cancellable_because_it_reads_every_row() {
    let (path, _) = write("cancel", &FixtureSpec { features: 40_000, ..small() });
    let ds = Dataset::open(&path).expect("open");
    let cancel = CancelToken::new();
    cancel.cancel();
    // Reading every bbox is an operation, so principle 7 binds it exactly as it binds the stream.
    assert!(ds.build_index(&cancel).is_err(), "a cancelled build must not produce an index");
}

#[test]
fn the_index_declares_its_own_memory_bound() {
    // ADR-010 rule 6: declared, not discovered — and declared where the ceilings are, so the
    // composed figure in `kernel/README.md` can name it rather than omit it.
    let (path, facts) = write("bound", &small());
    let ds = Dataset::open(&path).expect("open");
    let report = ds.build_index(&CancelToken::new()).expect("build");
    assert_eq!(
        report.declared_memory_bytes,
        facts.features * spatial_engine::index::BYTES_PER_INDEXED_FEATURE
    );
}
