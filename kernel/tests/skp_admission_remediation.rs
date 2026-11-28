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
    write_geoparquet, AttributeMode, CrsMode, FixtureSpec, IdentityMode, NarrowColumn,
    NarrowValues, NarrowWidth, NullBearingValues, NullBearingWidth, LV95_PROJJSON,
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
        set_aside_file_id: false,
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

/// **K-1** (`identity-declaration-route-for-session-tier`, F-1 to F-3). The real `describe` of a real
/// open carries the engine's candidate list on the session tier alone: a file with no `id` column and
/// one `UInt64` `parcel_key` lists `["parcel_key"]`; the same file opened with that column declared
/// (a mapped identity) and a native file both carry `candidate_columns` present and null. Asserted on
/// `serde_json::to_value(&describe.identity)`, the real wire shape, whose key set is also the
/// `identity` key set of the shared fixture `v0-describe-response-session-ordinal.json`.
///
/// Mutation M-K1: `candidate_columns: None` always in `describe_dataset`. Expected failure: this
/// test fails at F-1.
#[test]
fn a_session_tier_describe_carries_the_engines_candidate_list_and_native_and_mapped_carry_null() {
    let keyless = fixture(
        "session-keyless",
        &FixtureSpec {
            identity: IdentityMode::ForeignKeyColumn,
            ..small_spec()
        },
    );
    let native = fixture("session-native", &small_spec());
    let host = host();
    let describe_of = |path: &std::path::Path, key: &str, identity: Option<IdentityDeclaration>| {
        let resp = host
            .open_dataset(open_req(path, key, None, identity))
            .expect("open");
        let describe = host
            .describe(DescribeRequest {
                skp: SKP_VERSION.to_string(),
                dataset: resp.dataset,
            })
            .expect("describe");
        serde_json::to_value(&describe.identity).expect("identity as JSON")
    };

    // F-1: the session tier carries the list, and nothing about it is ranked or chosen.
    let session = describe_of(&keyless, "session-list", None);
    assert_eq!(session["class"], "session-ordinal");
    assert_eq!(
        session["candidate_columns"],
        serde_json::json!(["parcel_key"])
    );

    // F-2: the same file with that column declared is a mapped identity, whose member is null.
    let mapped = describe_of(
        &keyless,
        "session-declared",
        Some(IdentityDeclaration {
            column: "parcel_key".to_string(),
        }),
    );
    assert_eq!(mapped["source"], "mapped:parcel_key");
    assert!(
        mapped.get("candidate_columns").is_some_and(|v| v.is_null()),
        "mapped: the key is present and null: {mapped}"
    );

    // F-3: a native file has the key present and null as well.
    let native = describe_of(&native, "session-native-open", None);
    assert_eq!(native["class"], "native");
    assert!(
        native.get("candidate_columns").is_some_and(|v| v.is_null()),
        "native: the key is present and null: {native}"
    );

    // The real response has no member the shared fixture lacks, and lacks none it has.
    let fixture_path = std::path::PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("../protocol/skp/tests/data/v0-describe-response-session-ordinal.json");
    let fixture_json: serde_json::Value =
        serde_json::from_str(&std::fs::read_to_string(&fixture_path).expect("read fixture"))
            .expect("fixture is JSON");
    let keys = |v: &serde_json::Value| -> std::collections::BTreeSet<String> {
        v.as_object().expect("object").keys().cloned().collect()
    };
    assert_eq!(keys(&session), keys(&fixture_json["identity"]));
    assert_eq!(keys(&mapped), keys(&session));
    assert_eq!(keys(&native), keys(&session));
}

/// **K-2** (`identity-declaration-route-for-session-tier`, Amendment 5 item 9; F-4 to F-6). The list
/// reaches both carriers for a column narrower than 64 bits, through `SkpHost::open_dataset` and
/// `SkpHost::describe` with no stub. (a) An `Int32` `parcel_key` and no `id`: a plain open is
/// admitted on the session tier and `describe.identity.candidate_columns` is `["parcel_key"]`. (b)
/// The column is taken from that JSON list and declared through the wire's `IdentityDeclaration`:
/// the open is mapped, verified over the whole file, and the member is null. (c) A `Utf8` `id` beside
/// the eight widths: a plain open is refused `engine.identity_unusable` and the refusal's
/// `candidate_columns` field names all eight widths in schema order.
///
/// Mutation M-K2: in `describe_dataset`, the member is computed from `ds.file_schema()`'s `Int64` and
/// `UInt64` fields in place of `identity.candidate_columns()`, under the same session-tier guard.
/// Expected failure: this test fails at (a) with `[]`.
#[test]
fn a_narrow_integer_key_is_offered_on_both_carriers_and_declaring_it_from_the_list_opens_mapped() {
    let host = host();

    // (a) an `Int32` key and no `id`: admitted on the session tier, the list names the key.
    let narrow = fixture(
        "narrow-parcel-key",
        &FixtureSpec {
            identity: IdentityMode::NarrowInteger {
                width: NarrowWidth::Int32,
                column: NarrowColumn::ParcelKey,
                values: NarrowValues::TopOfRange,
            },
            ..small_spec()
        },
    );
    let resp = host
        .open_dataset(open_req(&narrow, "narrow-plain", None, None))
        .expect("a plain open of a file with no id is admitted on the session tier");
    let describe = host
        .describe(DescribeRequest {
            skp: SKP_VERSION.to_string(),
            dataset: resp.dataset,
        })
        .expect("describe");
    let identity = serde_json::to_value(&describe.identity).expect("identity as JSON");
    assert_eq!(identity["class"], "session-ordinal");
    assert_eq!(
        identity["candidate_columns"],
        serde_json::json!(["parcel_key"])
    );

    // (b) the column is taken from the list, never typed here, and declared through the wire.
    let column = identity["candidate_columns"][0]
        .as_str()
        .expect("a candidate name")
        .to_string();
    let resp = host
        .open_dataset(open_req(
            &narrow,
            "narrow-declared",
            None,
            Some(IdentityDeclaration { column }),
        ))
        .expect("declaring a column taken from the list opens it mapped");
    let describe = host
        .describe(DescribeRequest {
            skp: SKP_VERSION.to_string(),
            dataset: resp.dataset,
        })
        .expect("describe");
    assert_eq!(describe.identity.source, "mapped:parcel_key");
    assert_eq!(describe.identity.uniqueness, "verified-at-open-full-file");
    let mapped = serde_json::to_value(&describe.identity).expect("identity as JSON");
    assert!(
        mapped.get("candidate_columns").is_some_and(|v| v.is_null()),
        "mapped: the key is present and null: {mapped}"
    );

    // (c) the refusal's field lists every width, in schema order.
    let every_width = fixture(
        "every-width-refused",
        &FixtureSpec {
            identity: IdentityMode::StringIds,
            attributes: AttributeMode::FilterWitness,
            features: 2,
            avg_vertices: 6,
            hole_every: 0,
            ..Default::default()
        },
    );
    let err = host
        .open_dataset(open_req(&every_width, "every-width-plain", None, None))
        .expect_err("a Utf8 `id` is not a usable identity");
    assert_eq!(err.code, "engine.identity_unusable");
    assert_eq!(
        err.fields.get("candidate_columns").map(String::as_str),
        Some("i8,i16,i32,i64,u8,u16,u32,u64")
    );
}

/// The caller's choice to set aside the file's own `id` column, as the wire carries it.
fn set_aside_req(path: &std::path::Path, cancel_key: &str) -> OpenDatasetRequest {
    OpenDatasetRequest {
        set_aside_file_id: true,
        ..open_req(path, cancel_key, None, None)
    }
}

/// **K-1** (`text-id-opens-for-the-session-by-row-position`). Through `SkpHost::open_dataset` and
/// `SkpHost::describe`, a file whose `id` is text, opened with the choice, is on the session tier:
/// `identity.set_aside_column` is `"id"`, the session statement is present as it is for any session
/// tier, and the schema still lists `id` as a column that cannot be projected. The same open of a
/// file with no `id` column, which is on the session tier with nothing set aside, carries the key
/// present and null.
///
/// Mutation M-10: `describe_dataset` sets `set_aside_column` to `None`. Expected failure: this test
/// fails at its first assertion on the member.
#[test]
fn an_open_setting_aside_a_text_id_describes_the_session_tier_with_set_aside_column_id() {
    let text_id = fixture(
        "set-aside-text-id",
        &FixtureSpec {
            identity: IdentityMode::StringIds,
            ..small_spec()
        },
    );
    let keyless = fixture(
        "set-aside-keyless",
        &FixtureSpec {
            identity: IdentityMode::ForeignKeyColumn,
            ..small_spec()
        },
    );
    let host = host();
    let describe_of = |req: OpenDatasetRequest| {
        let resp = host.open_dataset(req).expect("open");
        host.describe(DescribeRequest {
            skp: SKP_VERSION.to_string(),
            dataset: resp.dataset,
        })
        .expect("describe")
    };

    let chosen = describe_of(set_aside_req(&text_id, "set-aside-chosen"));
    let identity = serde_json::to_value(&chosen.identity).expect("identity as JSON");
    assert_eq!(identity["set_aside_column"], "id", "{identity}");
    assert_eq!(identity["class"], "session-ordinal");
    assert_eq!(identity["source"], "session-ordinal:file_row_number");
    assert!(
        chosen.identity.session_statement.is_some(),
        "the session statement is carried as for any session tier"
    );
    let id_field = chosen
        .schema
        .iter()
        .find(|f| f.name == "id")
        .expect("the file's own id stays in the schema");
    assert!(!id_field.projectable, "and cannot be projected");

    // A session tier with nothing set aside: the key is present and null.
    let plain = describe_of(open_req(&keyless, "set-aside-plain", None, None));
    let identity = serde_json::to_value(&plain.identity).expect("identity as JSON");
    assert_eq!(identity["class"], "session-ordinal");
    assert!(
        identity
            .get("set_aside_column")
            .is_some_and(|v| v.is_null()),
        "the key is present and null: {identity}"
    );
}

/// **K-2**. The three refusals of the choice reach the wire by their own code, with the one field
/// `detail` and the engine's own message: a file with no `id` column, an `id` that serves, and a
/// declared column beside the choice. None of them opens a dataset.
///
/// Mutation M-11: `error_of` maps `IdentitySetAsideRefused` to `engine.identity_unusable`. Expected
/// failure: this test fails at the first code assertion.
#[test]
fn the_set_aside_refusals_reach_the_wire_by_name() {
    let no_id = fixture(
        "set-aside-refused-no-id",
        &FixtureSpec {
            identity: IdentityMode::ForeignKeyColumn,
            ..small_spec()
        },
    );
    let serves = fixture("set-aside-refused-serves", &small_spec());
    let beside = fixture(
        "set-aside-refused-declared",
        &FixtureSpec {
            identity: IdentityMode::StringIdsBesideParcelKey,
            ..small_spec()
        },
    );
    let host = host();

    let declared = OpenDatasetRequest {
        identity: Some(IdentityDeclaration {
            column: "parcel_key".to_string(),
        }),
        ..set_aside_req(&beside, "refused-declared")
    };
    let cases = [
        (
            set_aside_req(&no_id, "refused-no-id"),
            "the file has no column named `id` to set aside",
        ),
        (
            set_aside_req(&serves, "refused-serves"),
            "the file's own `id` column serves as its identity, so it cannot be set aside",
        ),
        (
            declared,
            "setting aside the file's `id` column cannot be combined with a declared identity column",
        ),
    ];
    for (req, detail) in cases {
        let err = host
            .open_dataset(req)
            .expect_err("the choice cannot be taken");
        assert_eq!(err.code, "engine.identity_set_aside_refused", "{err:?}");
        assert_eq!(err.message, format!("refused: {detail}"));
        let keys: Vec<&String> = err.fields.keys().collect();
        assert_eq!(keys, vec!["detail"], "exact key set");
        assert_eq!(err.fields.get("detail").map(String::as_str), Some(detail));
    }
}

/// **K-3**. A filter naming `id` on a set-aside open is refused as ambiguous through the wire, before
/// any ticket is minted, with `source_column` `file_row_number` and the message that says the
/// dataset is identified by row position for this session.
///
/// Mutation M-12: `identity_alias_ambiguity`'s session-tier arm returns `by_row_position` false.
/// Expected failure: this test fails at the message assertion.
#[test]
fn a_filter_naming_id_on_a_set_aside_open_is_refused_as_ambiguous_through_skp() {
    let path = fixture(
        "set-aside-alias",
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
    let resp = host
        .open_dataset(set_aside_req(&path, "alias-set-aside"))
        .expect("the choice opens the file");

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
        Some("file_row_number")
    );
    assert_eq!(
        err.message,
        "refused: `id` is ambiguous — this dataset is identified by row position for this \
         session, and the file also carries its own column named `id`; a predicate cannot say \
         which one it means"
    );
    assert_eq!(tickets.cancel_all_for_dataset(resp.dataset.as_str()), 0);
}

/// F-1 of `identity-scan-refuses-a-null-by-name`: 100 features, `id` a nullable `UInt64` holding
/// one null in row 0.
fn null_in_id_fixture(name: &str) -> PathBuf {
    let identity = IdentityMode::NullBearing {
        width: NullBearingWidth::UInt64,
        column: NarrowColumn::Id,
        values: NullBearingValues::OneNull,
    };
    fixture(
        name,
        &FixtureSpec {
            features: 100,
            identity,
            ..small_spec()
        },
    )
}

/// **K1** (`identity-scan-refuses-a-null-by-name`, OPEN-A5). Through `SkpHost::open_dataset`, a null
/// in the file's own `id` reaches the wire as `engine.identity_unusable` naming `id`, with the
/// engine's detail for a null and the message that holds it.
///
/// Mutation M-8: the null refusal raised as `EngineError::Query`. Observed at commit 69e363251158: this test fails at
/// its code assertion, `engine.query` for `engine.identity_unusable`.
#[test]
fn a_null_in_the_files_own_id_reaches_the_wire_as_identity_unusable_naming_the_null() {
    let path = null_in_id_fixture("null-in-id-refused");
    let err = host()
        .open_dataset(open_req(&path, "open-null-in-id", None, None))
        .expect_err("a null in the file's own `id` must be refused");
    assert_eq!(err.code, "engine.identity_unusable");
    assert_eq!(err.fields.get("column").map(String::as_str), Some("id"));
    let (nulls, rows) = (1, 100);
    let detail = format!(
        "the column is null in {nulls} of {rows} rows, so not every feature carries an identity"
    );
    assert_eq!(err.fields.get("detail"), Some(&detail));
    assert!(err.message.contains(&detail), "{}", err.message);
}

/// **K2** (text-id's head). The same file opened with the choice to set the file's `id` aside
/// opens on the session tier by row position, naming `id` as the column set aside: a null refusal
/// is a refusal of the `id` column itself, which that choice answers.
///
/// Mutation M-8, the same: `Query` passes arm (d) through. Observed at commit 69e363251158: this test fails at the
/// `expect` of the open, which is refused as `engine.query`.
#[test]
fn a_null_in_the_files_own_id_opens_by_row_position_when_set_aside() {
    let path = null_in_id_fixture("null-in-id-set-aside");
    let host = host();
    let resp = host
        .open_dataset(set_aside_req(&path, "set-aside-null-in-id"))
        .expect("the choice opens the file");
    let described = host
        .describe(DescribeRequest {
            skp: SKP_VERSION.to_string(),
            dataset: resp.dataset,
        })
        .expect("describe");
    let identity = serde_json::to_value(&described.identity).expect("identity as JSON");
    assert_eq!(identity["source"], "session-ordinal:file_row_number");
    assert_eq!(identity["set_aside_column"], "id", "{identity}");
}
