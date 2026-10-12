// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! `engine/COVERING-NAMES-MISSING-COLUMN-PREREGISTRATION.md` §4 (Branch A, ruled by Amendment 2): a
//! declared covering that names a column the file's schema does not resolve is dropped at open.
//! The open succeeds, `Dataset::covering()` is `None`, and a bbox query refuses `NoCoveringBbox`
//! before any lease; a stream without a bbox is unchanged.
//!
//! Every fixture is generated in-test (`write_hostile_covering`, LV95, declared CRS; or
//! `FixtureSpec`, the format default) and hash-verified before and after each run. C-5 reads the
//! compatibility corpus's M-4 file and is `#[ignore]`d for the corpus's own reason.

use spatial_engine::fixture::{
    write_geoparquet, write_hostile_covering, CoordinateDomain, CrsMode, FixtureSpec,
};
use spatial_engine::geoparquet::{FieldPath, SanityLevel};
use spatial_engine::{Bbox, CancelToken, Dataset, EngineError, ViewportQuery};

const STD4: [&str; 4] = ["xmin", "ymin", "xmax", "ymax"];

fn path_for(tag: &str) -> std::path::PathBuf {
    let dir = std::env::temp_dir().join("spatial-engine-covering-names-missing-column");
    std::fs::create_dir_all(&dir).unwrap();
    dir.join(format!("{tag}.parquet"))
}

fn sha256_file(path: &std::path::Path) -> String {
    use sha2::{Digest, Sha256};
    let bytes = std::fs::read(path).expect("read fixture for hashing");
    Sha256::digest(&bytes)
        .iter()
        .map(|b| format!("{b:02x}"))
        .collect()
}

fn bbox_query(xmin: f64, ymin: f64, xmax: f64, ymax: f64, crs: &str) -> ViewportQuery {
    let mut q = ViewportQuery::all();
    q.bbox = Some(Bbox {
        xmin,
        ymin,
        xmax,
        ymax,
    });
    q.bbox_crs = Some(crs.to_string());
    q
}

fn lv95_query() -> ViewportQuery {
    bbox_query(
        2_599_000.0,
        1_199_000.0,
        2_601_000.0,
        1_201_000.0,
        "EPSG:2056",
    )
}

fn crs84_query() -> ViewportQuery {
    bbox_query(7.0, 46.0, 8.0, 47.0, "OGC:CRS84")
}

/// Batches a stream yields; every item must be `Ok`.
fn drain_ok(ds: &Dataset, q: &ViewportQuery) -> usize {
    let mut stream = ds
        .stream_with_cancel(q, CancelToken::new())
        .expect("the stream opens");
    let mut buf = Vec::new();
    let mut n = 0;
    while let Some(info) = stream.next_into(&mut buf) {
        info.expect("no item error");
        n += 1;
        buf.clear();
    }
    n
}

/// The bbox query must refuse `NoCoveringBbox` before any lease; returns its detail.
fn refused_pre_lease(ds: &Dataset, q: &ViewportQuery) -> String {
    let leases_before = ds.connections().leases_issued();
    let detail = match ds.stream_with_cancel(q, CancelToken::new()) {
        Err(EngineError::NoCoveringBbox { detail }) => detail,
        Err(other) => panic!("expected NoCoveringBbox, got {other:?}"),
        Ok(_) => panic!("expected NoCoveringBbox, got a stream"),
    };
    assert_eq!(
        ds.connections().leases_issued(),
        leases_before,
        "before any lease -- a covering refusal must not touch the connection pool"
    );
    detail
}

/// The detail the human wrote for the path `p` (ruling file, item 2, OPEN-2).
fn names(p: &str) -> String {
    format!("the covering names `{p}`, which the file's schema does not contain")
}

/// The sanity reason for a no-format-rule file, byte-unchanged by this piece.
const NO_RULE_REASON: &str = "no format rule was applied, so nothing about the coordinates was \
                              assumed and there is nothing to convict";

/// C-1 (k3): `a_covering_naming_a_column_the_file_lacks_is_unusable_and_a_bbox_query_refuses_
/// before_any_lease`. The open succeeds with the covering unusable, the sanity record unchanged, a
/// bbox query refusing `NoCoveringBbox` before any lease (never `Query`), and both index builds
/// refusing the same way. A stream without a bbox is unchanged.
/// Mutation: `judge_covering`'s `Absent` result is replaced by `None`.
#[test]
fn a_covering_naming_a_column_the_file_lacks_is_unusable_and_a_bbox_query_refuses_before_any_lease()
{
    let path = path_for("k3-nobbox");
    write_hostile_covering(&path, "bbox", STD4, ("nobbox", STD4));
    let sha_before = sha256_file(&path);
    let ds = Dataset::open(&path).expect("the open itself must still succeed");
    assert!(
        ds.covering().is_none(),
        "a covering naming an absent column is not usable"
    );
    let admission = ds.admission().expect("admission is always recorded");
    assert_eq!(admission.sanity_level, SanityLevel::NotChecked);
    assert_eq!(admission.sanity_reason, NO_RULE_REASON);

    let detail = refused_pre_lease(&ds, &lv95_query());
    assert!(detail.contains("nobbox.xmin"), "{detail}");
    assert_eq!(detail, names("nobbox.xmin"));
    assert!(!detail.contains("declares no covering"), "{detail}");
    assert!(!detail.contains("U+0000"), "{detail}");

    for built in [
        ds.build_index(&CancelToken::new()).map(|_| ()),
        ds.build_row_group_index(&CancelToken::new()).map(|_| ()),
    ] {
        match built {
            Err(EngineError::NoCoveringBbox { detail }) => {
                assert!(detail.contains("nobbox.xmin"), "{detail}")
            }
            other => panic!("expected NoCoveringBbox from an index build, got {other:?}"),
        }
    }

    assert!(
        drain_ok(&ds, &ViewportQuery::all()) > 0,
        "the no-bbox stream must still produce at least one batch"
    );
    assert_eq!(
        sha256_file(&path),
        sha_before,
        "the fixture must be unchanged"
    );
}

/// C-2 (row c): `a_covering_naming_an_absent_child_under_an_existing_struct_is_unusable`. The
/// struct exists and three children resolve; the fourth does not.
/// Mutation: the walk in `field_path_exists` checks only the first segment.
#[test]
fn a_covering_naming_an_absent_child_under_an_existing_struct_is_unusable() {
    let path = path_for("row-c-absent-child");
    write_hostile_covering(
        &path,
        "bbox",
        STD4,
        ("bbox", ["xmin", "ymin", "xmax", "nomax"]),
    );
    let sha_before = sha256_file(&path);
    let ds = Dataset::open(&path).expect("the open itself must still succeed");
    assert!(
        ds.covering().is_none(),
        "a covering naming an absent child is not usable"
    );
    let detail = refused_pre_lease(&ds, &lv95_query());
    assert_eq!(detail, names("bbox.nomax"));
    assert!(drain_ok(&ds, &ViewportQuery::all()) > 0);
    assert_eq!(
        sha256_file(&path),
        sha_before,
        "the fixture must be unchanged"
    );
}

/// Whether DuckDB's binder resolves the four declared paths: the oracle (§3a).
fn oracle_binds(path: &std::path::Path, declared: (&str, [&str; 4])) -> bool {
    let conn = duckdb::Connection::open_in_memory().unwrap();
    let select: Vec<String> = declared
        .1
        .iter()
        .map(|c| FieldPath(vec![declared.0.to_string(), c.to_string()]).to_sql())
        .collect();
    let sql = format!("SELECT {} FROM read_parquet(?) LIMIT 0", select.join(", "));
    let p = path.to_string_lossy().to_string();
    match conn.prepare(&sql) {
        Ok(mut st) => st.query_arrow([p.as_str()]).is_ok(),
        Err(_) => false,
    }
}

/// C-3 (rows a to g): `the_covering_decision_agrees_with_the_binder_on_every_p0_row`. For each row
/// the covering is kept exactly when the oracle's binder resolves the declared paths, and where it
/// is kept a bbox stream drains with no item error. The expected column restates the P0's result
/// (Amendment 1, item 2): d and e bind, g does not.
/// Mutation: the segment comparison in `field_path_exists` is swapped for byte equality.
#[test]
fn the_covering_decision_agrees_with_the_binder_on_every_p0_row() {
    type Row = (
        &'static str,
        &'static str,
        &'static str,
        [&'static str; 4],
        bool,
    );
    let rows: [Row; 7] = [
        ("a", "bbox", "bbox", STD4, true),
        ("b", "bbox", "nobbox", STD4, false),
        (
            "c",
            "bbox",
            "bbox",
            ["xmin", "ymin", "xmax", "nomax"],
            false,
        ),
        ("d", "bbox", "BBOX", STD4, true),
        ("e", "bbox", "bbox", ["XMIN", "ymin", "xmax", "ymax"], true),
        ("f", "bbox", "id", STD4, false),
        ("g", "b\u{f6}x", "B\u{d6}X", STD4, false),
    ];
    for (tag, written, declared_struct, declared_children, binds) in rows {
        let path = path_for(&format!("p0-row-{tag}"));
        write_hostile_covering(&path, written, STD4, (declared_struct, declared_children));
        let sha_before = sha256_file(&path);
        let oracle = oracle_binds(&path, (declared_struct, declared_children));
        assert_eq!(oracle, binds, "row {tag}: the oracle disagrees with the P0");
        let ds = Dataset::open(&path).expect("the open itself must still succeed");
        assert_eq!(
            ds.covering().is_some(),
            oracle,
            "row {tag}: the decision and the binder disagree"
        );
        if ds.covering().is_some() {
            assert!(
                drain_ok(&ds, &lv95_query()) > 0,
                "row {tag}: a kept covering must stream"
            );
        } else {
            refused_pre_lease(&ds, &lv95_query());
        }
        assert_eq!(
            sha256_file(&path),
            sha_before,
            "row {tag}: the fixture must be unchanged"
        );
    }
}

/// C-4 (both format-default rows): `a_format_rule_file_whose_covering_names_an_absent_column_keeps_
/// its_sanity_record_and_refuses_a_bbox_query_pre_lease`. Without a geo `bbox` member the sanity
/// record is R-S3's, byte-unchanged; with one it is the `metadata` level, unchanged. In both the
/// covering is unusable and a bbox query refuses before any lease.
/// Mutation: `sanity_check` ignores the decision passed in, treating it as none.
#[test]
fn a_format_rule_file_whose_covering_names_an_absent_column_keeps_its_sanity_record_and_refuses_a_bbox_query_pre_lease(
) {
    let spec = |with_geo_bbox: bool| FixtureSpec {
        features: 256,
        avg_vertices: 12,
        domain: CoordinateDomain::Wgs84Degrees,
        crs_mode: CrsMode::AbsentKey,
        covering_names_absent_column: true,
        with_geo_bbox,
        ..Default::default()
    };

    let path = path_for("format-default-covering-absent");
    write_geoparquet(&path, &spec(false)).expect("write fixture");
    let sha_before = sha256_file(&path);
    let ds = Dataset::open(&path).expect("open still succeeds");
    let admission = ds.admission().expect("admission is always recorded");
    assert_eq!(admission.sanity_level, SanityLevel::NotChecked);
    assert_eq!(
        admission.sanity_reason,
        "the covering names `no_such_bbox_column.xmin`, which the file's schema does not \
         contain, so no level could be decided from it. Not checked"
    );
    assert!(ds.covering().is_none());
    let detail = refused_pre_lease(&ds, &crs84_query());
    assert_eq!(detail, names("no_such_bbox_column.xmin"));
    assert_eq!(
        sha256_file(&path),
        sha_before,
        "the fixture must be unchanged"
    );

    let path = path_for("format-default-covering-absent-geo-bbox");
    write_geoparquet(&path, &spec(true)).expect("write fixture");
    let sha_before = sha256_file(&path);
    let ds = Dataset::open(&path).expect("open still succeeds");
    let admission = ds.admission().expect("admission is always recorded");
    assert_eq!(admission.sanity_level, SanityLevel::Metadata);
    assert!(
        admission
            .sanity_reason
            .contains("`geo` metadata's own `bbox` member"),
        "{}",
        admission.sanity_reason
    );
    assert!(ds.covering().is_none());
    refused_pre_lease(&ds, &crs84_query());
    assert_eq!(
        sha256_file(&path),
        sha_before,
        "the fixture must be unchanged"
    );
}

/// The compatibility corpus lives outside any one worktree (`admission_p4_corpus.rs`'s own root).
const CORPUS_ROOT: &str = r"C:\dev\spatial-ide\target\fixtures\compat-corpus";
const M4_SUFFIX: &str = "mutations/ogr2ogr-epsg2056-default-covering-absent-columns.parquet";

/// C-5 (M-4): `m4_the_corpus_mutation_opens_with_its_covering_unusable_and_refuses_a_bbox_query_
/// pre_lease`. The file is verified against `MANIFEST.json` and `DERIVATIONS.json` before and after.
/// `#[ignore]`d on every platform, for the corpus's own reason; the tester runs it explicitly.
/// Mutation: as C-1.
#[ignore = "reads the on-disk compatibility corpus under target/fixtures/compat-corpus; run \
            explicitly"]
#[test]
fn m4_the_corpus_mutation_opens_with_its_covering_unusable_and_refuses_a_bbox_query_pre_lease() {
    let root = std::path::Path::new(CORPUS_ROOT);
    let manifest: serde_json::Value =
        serde_json::from_str(&std::fs::read_to_string(root.join("MANIFEST.json")).unwrap())
            .unwrap();
    let manifest_sha = manifest["files"]
        .as_array()
        .unwrap()
        .iter()
        .find(|f| f["path"].as_str().is_some_and(|p| p.ends_with(M4_SUFFIX)))
        .and_then(|f| f["sha256"].as_str())
        .expect("M-4 is in MANIFEST.json")
        .to_string();
    let derivations: serde_json::Value = serde_json::from_str(
        &std::fs::read_to_string(root.join("mutations").join("DERIVATIONS.json")).unwrap(),
    )
    .unwrap();
    let derivations_sha = derivations["mutations"]
        .as_array()
        .unwrap()
        .iter()
        .find(|m| m["path"].as_str().is_some_and(|p| M4_SUFFIX.ends_with(p)))
        .and_then(|m| m["observed_difference"]["mutation_sha256"].as_str())
        .expect("M-4 is in DERIVATIONS.json")
        .to_string();

    let path = root.join(M4_SUFFIX);
    let sha_before = sha256_file(&path);
    assert_eq!(sha_before, manifest_sha, "M-4 differs from MANIFEST.json");
    assert_eq!(
        sha_before, derivations_sha,
        "M-4 differs from DERIVATIONS.json"
    );

    let ds = Dataset::open(&path).expect("M-4 opens");
    assert!(ds.covering().is_none());
    let detail = refused_pre_lease(&ds, &lv95_query());
    assert_eq!(detail, names("no_such_bbox_column.xmin"));
    assert_eq!(
        sha256_file(&path),
        sha_before,
        "the corpus file must be unchanged"
    );
}
