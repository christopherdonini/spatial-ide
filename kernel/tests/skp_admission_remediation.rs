// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **P1 (kernel host) — threading `crs_assertion`/`identity` from `OpenDatasetRequest` into the
//! engine's admission path, and the host-minted attribution the wire never carries.**
//!
//! `NEXT-CUT.md` P1. Exercises `SkpHost::open_dataset` (not `Catalog::open_cancellable` or
//! `Dataset::open_cancellable` directly), because the host is the one place the wire's bare claim
//! (`identifier`/`definition_json`, `column`) meets the host-minted `by`/`at` (ADR-024 F-5) — a
//! test against the engine alone would prove the admission *policy*, already covered by
//! `engine/src/crs.rs` and `engine/src/identity.rs`'s own unit tests, but not that this crate wires
//! the two together, or that the wire never supplies attribution (I4).

use std::path::PathBuf;
use std::sync::Arc;

mod watch_support;

use spatial_engine::fixture::{
    write_geoparquet, AttributeMode, CrsMode, FixtureSpec, IdentityMode, LV95_PROJJSON,
};
use spatial_kernel::skp::{session_end_channel, SkpHost, StreamRegistry};
use spatial_kernel::Catalog;
use spatial_skp::v0::{
    CrsAssertion, DescribeRequest, Filter, IdentityDeclaration, OpenDatasetRequest,
    ViewportQueryRequest, FILTER_DIALECT_DUCKDB_EXPR_0, SKP_VERSION,
};

fn dir() -> PathBuf {
    let d =
        PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../target/fixtures/admission-remediation");
    std::fs::create_dir_all(&d).expect("fixture dir");
    d
}

/// Small on purpose (`NEXT-CUT.md` P1: "keep it tiny") — these fixtures exist only to reach a
/// named admission branch, not to measure anything.
fn fixture(name: &str, spec: &FixtureSpec) -> PathBuf {
    let path = dir().join(format!("{name}.parquet"));
    write_geoparquet(&path, spec).expect("write fixture");
    path
}

fn small_spec() -> FixtureSpec {
    FixtureSpec {
        features: 20,
        avg_vertices: 6,
        hole_every: 0,
        ..Default::default()
    }
}

fn host() -> SkpHost {
    SkpHost::new(
        Arc::new(Catalog::new()),
        StreamRegistry::new(),
        watch_support::no_watch_arm(),
        session_end_channel().0,
    )
}

fn open_req(
    path: &std::path::Path,
    cancel_key: &str,
    crs_assertion: Option<CrsAssertion>,
    identity: Option<IdentityDeclaration>,
) -> OpenDatasetRequest {
    OpenDatasetRequest {
        skp: SKP_VERSION.to_string(),
        path: path.display().to_string(),
        cancel_key: cancel_key.to_string(),
        crs_assertion,
        identity,
    }
}

/// (1) A request with `crs_assertion: null, identity: null` behaves byte-identically to the
/// pre-P1 path: file-declared CRS, native `id`, no `caller_asserted`/`mapped:` attribution
/// anywhere. This is the regression case P1's brief names explicitly — threading the two new
/// parameters must not change what a caller who never sets them observes.
#[test]
fn null_crs_assertion_and_null_identity_admit_exactly_as_before() {
    let path = fixture("null-null", &small_spec());
    let host = host();
    let resp = host
        .open_dataset(open_req(&path, "open-null-null", None, None))
        .expect("open");
    let describe = host
        .describe(DescribeRequest {
            skp: SKP_VERSION.to_string(),
            dataset: resp.dataset,
        })
        .expect("describe");
    assert_eq!(describe.crs.source, "file");
    assert!(
        describe.crs.asserted_by.is_none(),
        "no assertion means no asserted_by"
    );
    assert!(
        describe.crs.asserted_at.is_none(),
        "no assertion means no asserted_at"
    );
    assert_eq!(describe.identity.source, "file:id");
}

/// (2) An assertion over a file with an absent `crs` key is admitted, and `describe` carries
/// `caller_asserted`, a non-empty `by`, and an RFC-3339-shaped `at` — the kernel's own mint. The
/// wire's `CrsAssertion` has no `by`/`at` field at all (P0), so there is nothing for the host to
/// echo; a non-null result here can only have come from `host_minted_crs_assertion`.
///
/// **Wording, post-Brief-A-P1 (same class, same ruling as the no-crs-refused.parquet re-aim):**
/// this fixture's own absent key no longer means the file "declares no CRS" plain-open — since
/// Brief A's P1/P2 it admits under GeoParquet's own OGC:CRS84 format default absent an assertion
/// (`engine/ADMISSION-PREREGISTRATION.md` §2b R-C2). R-C6 (a caller assertion, unchanged in every
/// respect) runs regardless of what a plain open of this same file would now do, so what this test
/// asserts is untouched by that change; only the fixture's own description here was stale.
#[test]
fn asserted_crs_over_a_crs_less_file_is_admitted_with_host_minted_attribution() {
    let path = fixture(
        "no-crs",
        &FixtureSpec {
            crs_mode: CrsMode::AbsentKey,
            ..small_spec()
        },
    );
    let host = host();
    let assertion = CrsAssertion {
        identifier: "EPSG:2056".to_string(),
        definition_json: LV95_PROJJSON.to_string(),
    };
    let resp = host
        .open_dataset(open_req(&path, "open-assert", Some(assertion), None))
        .expect("assertion over a CRS-less file must be admitted");
    let describe = host
        .describe(DescribeRequest {
            skp: SKP_VERSION.to_string(),
            dataset: resp.dataset,
        })
        .expect("describe");
    assert_eq!(describe.crs.source, "caller_asserted");
    assert_eq!(describe.crs.identifier, "EPSG:2056");
    let by = describe.crs.asserted_by.expect("by must be present");
    assert!(!by.trim().is_empty(), "by must be non-empty, got {by:?}");
    let at = describe.crs.asserted_at.expect("at must be present");
    assert!(
        at.contains('T') && at.ends_with('Z'),
        "at must be RFC-3339 UTC, got {at:?}"
    );
}

/// (3) An assertion over a file that already declares a CRS is refused as
/// `engine.crs_assertion_conflict` (ADR-015 §4) — and the refusal never compares the two
/// definitions: the payload names only the two *identifiers* (`declared`/`asserted` fields), never
/// a definition body. `coordinate_system` is a marker string that appears in the asserted PROJJSON
/// (`LV95_PROJJSON`) and nowhere else in this test, so its absence from every part of the payload
/// is what stands in for "no definition was echoed".
#[test]
fn asserted_crs_over_a_declaring_file_is_refused_without_echoing_a_definition_comparison() {
    let path = fixture("declaring", &small_spec());
    let host = host();
    let assertion = CrsAssertion {
        identifier: "EPSG:2056".to_string(),
        definition_json: LV95_PROJJSON.to_string(),
    };
    let err = host
        .open_dataset(open_req(&path, "open-conflict", Some(assertion), None))
        .expect_err("an assertion over a declaring file must be refused");
    assert_eq!(err.code, "engine.crs_assertion_conflict");
    assert!(
        !err.message.contains("coordinate_system"),
        "message must not echo the asserted definition body: {}",
        err.message
    );
    for (k, v) in &err.fields {
        assert!(
            !v.contains("coordinate_system"),
            "no field may carry a definition body ({k} = {v})"
        );
    }
}

/// (4) A declared identity mapping on a file whose stable key lives in `parcel_key` (no `id`
/// column at all) is admitted, and `describe` reads `mapped:parcel_key` with a verified
/// uniqueness scan.
#[test]
fn declared_identity_on_parcel_key_is_admitted_and_reads_mapped() {
    let path = fixture(
        "parcel-key",
        &FixtureSpec {
            identity: IdentityMode::ForeignKeyColumn,
            ..small_spec()
        },
    );
    let host = host();
    let decl = IdentityDeclaration {
        column: "parcel_key".to_string(),
    };
    let resp = host
        .open_dataset(open_req(&path, "open-identity", None, Some(decl)))
        .expect("a declared mapping to an existing unique column must be admitted");
    let describe = host
        .describe(DescribeRequest {
            skp: SKP_VERSION.to_string(),
            dataset: resp.dataset,
        })
        .expect("describe");
    assert_eq!(describe.identity.source, "mapped:parcel_key");
    assert_eq!(describe.identity.uniqueness, "verified-at-open-full-file");
}

/// (5a) A declared identity column the file does not carry is a typed `identity_unusable`
/// refusal, naming the missing column.
#[test]
fn declared_identity_naming_a_missing_column_is_refused() {
    let path = fixture("missing-col", &small_spec());
    let host = host();
    let decl = IdentityDeclaration {
        column: "does_not_exist".to_string(),
    };
    let err = host
        .open_dataset(open_req(&path, "open-missing-col", None, Some(decl)))
        .expect_err("a declaration naming an absent column must be refused");
    assert_eq!(err.code, "engine.identity_unusable");
    assert_eq!(
        err.fields.get("column").map(String::as_str),
        Some("does_not_exist")
    );
}

/// (5b) A declared identity column that repeats a value is a typed `identity_unusable` refusal —
/// uniqueness is verified over the **declared** column even when its name happens to be `id`:
/// `engine::dataset::admit_identity` keys off whether a declaration was made, never off the
/// column's name, so declaring `id` explicitly still runs the mapped path rather than silently
/// reusing the native one. `IdentityMode::DuplicateIds` (an existing engine fixture mode — no new
/// fixture generator was needed for this refusal) writes a constant value into `id`, which is
/// legal parquet and a real non-unique mapped column once declared.
#[test]
fn declared_identity_naming_a_non_unique_column_is_refused() {
    let path = fixture(
        "dup-id",
        &FixtureSpec {
            identity: IdentityMode::DuplicateIds,
            ..small_spec()
        },
    );
    let host = host();
    let decl = IdentityDeclaration {
        column: "id".to_string(),
    };
    let err = host
        .open_dataset(open_req(&path, "open-dup", None, Some(decl)))
        .expect_err("a declaration naming a non-unique column must be refused");
    assert_eq!(err.code, "engine.identity_unusable");
    assert_eq!(err.fields.get("column").map(String::as_str), Some("id"));
}

/// (6) The file carries its own `id` (Utf8, so unusable as identity) beside a usable `u64` key. A
/// plain open refuses `engine.identity_unusable`; declaring `u64` through the wire's
/// `IdentityDeclaration` admits it as `mapped:u64`; and a `viewport_query` filter naming `id` is then
/// refused synchronously as `skp.filter_identity_alias_ambiguous` with exactly `column` and
/// `source_column`, before any ticket is minted. Every call is the one the shell's commands make
/// (`SkpHost::open_dataset`, `SkpHost::viewport_query`); the catalog's uniqueness-skipping route is
/// not used, and the wire cannot take it. The predicate (a Utf8 column against a text literal) would
/// pass the namespace, bind and type stages without the alias rule, so the step (iii) refusal can
/// only come from that rule.
///
/// Mutations, each observed by applying it, running this test, and reverting it:
/// - M-1: `engine::predicate::identity_alias_ambiguity`'s body returns `None`. Observed at
///   commit caf131fd: this test fails at the `expect_err` of step (iii), the predicate being admitted.
/// - M-2: in `SkpHost::open_dataset`, `host_minted_identity_declaration`'s result is replaced by
///   `None`. Observed at commit caf131fd: this test fails at the `expect` of step (ii), the declared
///   open refusing `engine.identity_unusable` on `id`.
#[tokio::test(flavor = "multi_thread")]
async fn a_declared_identity_beside_the_files_own_id_refuses_a_filter_naming_id_as_ambiguous() {
    let path = fixture(
        "alias-ambiguous",
        &FixtureSpec {
            identity: IdentityMode::StringIds,
            attributes: AttributeMode::FilterWitness,
            features: 2,
            avg_vertices: 6,
            hole_every: 0,
            ..Default::default()
        },
    );
    let tickets = StreamRegistry::new();
    let host = SkpHost::new(
        Arc::new(Catalog::new()),
        tickets.clone(),
        watch_support::no_watch_arm(),
        session_end_channel().0,
    );

    // (i) a plain open refuses: `id` is present but not a usable identity.
    let err = host
        .open_dataset(open_req(&path, "alias-plain", None, None))
        .expect_err("a Utf8 `id` is not a usable identity");
    assert_eq!(err.code, "engine.identity_unusable");
    assert_eq!(err.fields.get("column").map(String::as_str), Some("id"));
    let candidates = err.fields.get("candidate_columns").expect("candidates");
    assert!(
        candidates.split(',').any(|c| c == "u64"),
        "u64 must be offered as a candidate: {candidates}"
    );

    // (ii) the wire's declaration of `u64` admits it as a mapped identity.
    let decl = IdentityDeclaration {
        column: "u64".to_string(),
    };
    let resp = host
        .open_dataset(open_req(&path, "alias-declared", None, Some(decl)))
        .expect("a declared 64-bit key beside the file's own id must be admitted");
    let describe = host
        .describe(DescribeRequest {
            skp: SKP_VERSION.to_string(),
            dataset: resp.dataset.clone(),
        })
        .expect("describe");
    assert_eq!(describe.identity.source, "mapped:u64");

    // (iii) a filter naming `id` is ambiguous between the wire identity and the file's column.
    let err = host
        .viewport_query(ViewportQueryRequest {
            skp: SKP_VERSION.to_string(),
            dataset: resp.dataset.clone(),
            bbox: None,
            bbox_crs: None,
            limit: None,
            filter: Some(
                Filter::new("id = 'key-1'", FILTER_DIALECT_DUCKDB_EXPR_0).expect("dialect"),
            ),
            columns: None,
        })
        .expect_err("a predicate naming `id` must be refused as ambiguous");
    assert_eq!(err.code, "skp.filter_identity_alias_ambiguous");
    let mut keys: Vec<&String> = err.fields.keys().collect();
    keys.sort();
    assert_eq!(keys, vec!["column", "source_column"], "exact key set");
    assert_eq!(err.fields.get("column").map(String::as_str), Some("id"));
    assert_eq!(
        err.fields.get("source_column").map(String::as_str),
        Some("u64")
    );

    // (iv) the refusal came before any ticket was minted.
    assert_eq!(tickets.cancel_all_for_dataset(resp.dataset.as_str()), 0);
}
