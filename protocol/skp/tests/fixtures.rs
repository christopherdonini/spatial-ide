// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! One canonical request and one canonical response per command, read by this crate's own test and
//! by the shell's TypeScript test (`frontends/shell/src/skp/__tests__/fixtures.test.ts`), so a
//! writer and a reader with separate tables cannot silently disagree about the wire shape — the
//! pattern `renderer/tests/data/manifest-key-sets.json` already establishes for ADR-017.
//!
//! Each fixture is checked two ways: it deserializes into the declared type, and re-serializing
//! that value reproduces the same JSON *value* (compared structurally, not byte-for-byte, since key
//! order is not semantically significant on this boundary — `deny_unknown_fields` is what makes the
//! key *set* significant).

use spatial_skp::v0::*;

fn fixture(name: &str) -> serde_json::Value {
    let path = format!("{}/tests/data/{name}.json", env!("CARGO_MANIFEST_DIR"));
    let raw = std::fs::read_to_string(&path).unwrap_or_else(|e| panic!("{path}: {e}"));
    serde_json::from_str(&raw).unwrap_or_else(|e| panic!("{path}: not valid JSON: {e}"))
}

/// Deserialize `name` as `T`, re-serialize, and assert the result matches the file structurally.
fn round_trip<T>(name: &str)
where
    T: serde::Serialize + serde::de::DeserializeOwned,
{
    let original = fixture(name);
    let parsed: T = serde_json::from_value(original.clone())
        .unwrap_or_else(|e| panic!("{name}: fixture does not deserialize as the declared type: {e}"));
    let reserialized = serde_json::to_value(&parsed).unwrap();
    assert_eq!(reserialized, original, "{name}: round trip changed the JSON shape");
}

#[test]
fn open_dataset_fixtures_round_trip() {
    round_trip::<OpenDatasetRequest>("v0-open_dataset-request");
    round_trip::<OpenDatasetResponse>("v0-open_dataset-response");
}

/// `skp/0.2`: `crs_assertion`/`identity` are present (never omitted) on every `open_dataset`
/// request, including the unremediated one above (both `null`) and this variant, which carries
/// both — exactly `filter`'s own `viewport_query_request_with_a_filter_round_trips` precedent.
#[test]
fn open_dataset_request_with_crs_assertion_and_identity_round_trips() {
    let v = fixture("v0-open_dataset-request-with-crs_assertion-and-identity");
    let parsed: OpenDatasetRequest = serde_json::from_value(v.clone())
        .unwrap_or_else(|e| panic!("fixture does not deserialize as OpenDatasetRequest: {e}"));
    let crs = parsed.crs_assertion.as_ref().expect("this fixture's point is a present crs_assertion");
    assert_eq!(crs.identifier, "EPSG:2056");
    let identity = parsed.identity.as_ref().expect("this fixture's point is a present identity");
    assert_eq!(identity.column, "parcel_key");
    assert_eq!(serde_json::to_value(&parsed).unwrap(), v, "round trip changed the JSON shape");
}

/// **Known gap, not introduced by this piece.** `SKP-V0.md` §7.2 describes `bbox_crs`/`filter`'s
/// discipline as "the field carries no `#[serde(default)]`, so a request that omits the key
/// entirely is a deserialize failure" — but plain `Option<T>` struct fields are deserialized by
/// serde as `None` when their key is absent **regardless of `#[serde(default)]`'s presence or
/// absence**; there is no existing mechanism in this crate that makes an `Option<T>` field
/// wire-required (`Filter`'s own custom `Deserialize` validates *dialect*, not key presence, and
/// no field-presence check exists anywhere else in `v0::commands`). Confirmed against
/// `ViewportQueryRequest.filter` before writing this test, and reproduced here for the new
/// `crs_assertion`/`identity` fields, faithfully replicating (not inventing a fix for) the
/// existing mechanism per this piece's brief ("replicate the exact mechanism, do not invent a new
/// one"). Flagged for the custodian; a working "omitted key is refused" property, if wanted, is a
/// new mechanism applied uniformly to every optional field on the wire, not a P0 change.
#[test]
fn omitting_crs_assertion_or_identity_key_is_currently_tolerated_not_refused() {
    let v = serde_json::json!({
        "skp": SKP_VERSION,
        "path": "C:/data/parcels.parquet",
        "cancel_key": "open-1",
        "identity": null,
        // crs_assertion key omitted entirely
    });
    let parsed: OpenDatasetRequest = serde_json::from_value(v)
        .expect("documents current behavior: an omitted Option<T> key deserializes as None, not a failure");
    assert!(parsed.crs_assertion.is_none());
}

#[test]
fn describe_fixtures_round_trip() {
    round_trip::<DescribeRequest>("v0-describe-request");
    round_trip::<DescribeResponse>("v0-describe-response");
}

/// SF10 (reviewer gate, admission-remediation cut): P0's own precedent
/// (`v0-error-identity_unusable-with-candidates`, a populated fixture beside a null one) applied
/// to `describe`'s `CrsInfo` — until this fixture, every describe fixture on both the Rust and
/// TypeScript sides carried `definition_provenance: null` and no test ever exercised a *populated*
/// caller-asserted shape (`source`, `asserted_by`, `asserted_at`, `definition_provenance` all
/// non-null together).
#[test]
fn describe_response_with_a_caller_asserted_crs_round_trips() {
    let v = fixture("v0-describe-response-caller-asserted");
    let parsed: DescribeResponse = serde_json::from_value(v.clone())
        .unwrap_or_else(|e| panic!("fixture does not deserialize as DescribeResponse: {e}"));
    assert_eq!(parsed.crs.source, "caller_asserted");
    assert_eq!(parsed.crs.asserted_by.as_deref(), Some("os-user chris"));
    assert_eq!(parsed.crs.asserted_at.as_deref(), Some("2026-08-18T00:00:00Z"));
    assert_eq!(
        parsed.crs.definition_provenance.as_deref(),
        Some("catalog:epsg-2056@sha256:254016888ff4")
    );
    assert_eq!(serde_json::to_value(&parsed).unwrap(), v, "round trip changed the JSON shape");
}

/// **`skp/0.3`, Brief A P3** — boundary 9's four `describe` additions, exercised in their populated
/// shape on a session-tier dataset, the same precedent the caller-asserted fixture above set.
///
/// **And the A2 assertion in its wire form**: this response is the most generation-adjacent shape
/// the protocol has, and it carries no generation value anywhere. The session statement names the
/// tier without naming a number, because the number is kernel and client state.
/// Mutation: add a `dataset_session_generation` member to `IdentityInfo` and populate the
/// fixture. Expected failure:
/// `describe_response_for_a_session_ordinal_dataset_round_trips_and_carries_no_generation` fails
/// on its A2 sweep — which is the whole point of sweeping the serialized document.
#[test]
fn describe_response_for_a_session_ordinal_dataset_round_trips_and_carries_no_generation() {
    let v = fixture("v0-describe-response-session-ordinal");
    let parsed: DescribeResponse = serde_json::from_value(v.clone())
        .unwrap_or_else(|e| panic!("fixture does not deserialize as DescribeResponse: {e}"));
    assert_eq!(parsed.identity.class, "session-ordinal");
    assert_eq!(parsed.identity.source, "session-ordinal:file_row_number");
    assert_eq!(parsed.identity.uniqueness, "by-construction-within-generation");
    // Never counted, so never claimed — `None` is the honest answer and not a gap.
    assert_eq!(parsed.identity.verified_rows, None);
    assert_eq!(parsed.identity.js_exact, None);
    assert!(parsed.identity.session_statement.is_some());
    assert_eq!(parsed.crs.provenance, "crs:format-default");
    assert_eq!(parsed.crs.axis_provenance, "axis:declared");
    assert!(parsed.crs.display_convention.is_some());
    assert_eq!(parsed.sanity.level, "metadata");

    // **A2, asserted on the wire rather than only in the kernel.** The whole serialized document is
    // searched, so a future field cannot slip a generation onto `describe` without failing here.
    //
    // The word itself is not banned and cannot be: ADR-016's §6 record value is literally
    // `by-construction-within-generation`, and it is a *label for a basis*, not a value. What A2
    // forbids is a generation **value** — so the assertion is that `dataset_session_generation`
    // appears nowhere and that every occurrence of the word is that one label.
    let text = serde_json::to_string(&parsed).unwrap();
    assert!(
        !text.contains("dataset_session_generation"),
        "no generation value or field may appear on the wire (Brief A boundary 9, A2): {text}"
    );
    assert_eq!(
        text.matches("generation").count(),
        text.matches("by-construction-within-generation").count(),
        "the only occurrence of the word on the wire is the what-was-checked record value, \
         which names a \
         basis and is not a value (A2): {text}"
    );
    // **A1**, in the same sweep: no snapshot claim in any string this response carries.
    assert!(
        !text.to_lowercase().contains("snapshot"),
        "no snapshot-consistency claim may appear in any wire string (A1): {text}"
    );
    assert_eq!(serde_json::to_value(&parsed).unwrap(), v, "round trip changed the JSON shape");
}

/// **`skp/0.3`** — the two typed refusals boundary 9 names, plus the retyped internal-inconsistency
/// arm, each in its wire shape with its `detail` field populated.
/// Mutation: drop the `detail` field from `error_of`'s `SourceChanged` arm. Expected failure:
/// `the_new_typed_refusal_fixtures_round_trip_with_their_detail_fields` fails — a client that
/// must act on which component changed would have only prose.
#[test]
fn the_new_typed_refusal_fixtures_round_trip_with_their_detail_fields() {
    let changed = fixture("v0-error-source_changed");
    let parsed: SkpError = serde_json::from_value(changed.clone())
        .unwrap_or_else(|e| panic!("source_changed fixture does not deserialize: {e}"));
    assert_eq!(parsed.code, "engine.source_changed");
    // §4's adopted rule: the detail names every component that differed, not the first.
    assert_eq!(
        parsed.fields.get("detail").map(String::as_str),
        Some("{size, mtime, footer-length, footer-hash}")
    );
    // A1 again, on the refusal that is most tempting to phrase as a snapshot statement. The
    // previous form of this line was a tautology — it could not fail — and is replaced by the two
    // assertions that actually bite: the word appears only inside boundary 4's own denial, and the
    // affirmative phrasing appears nowhere.
    assert!(!parsed.message.contains("reads one snapshot"), "{}", parsed.message);
    assert!(parsed.message.contains("does not establish snapshot consistency"));
    assert_eq!(serde_json::to_value(&parsed).unwrap(), changed);

    for name in
        ["v0-error-identity_ordinal_partitioned_unsupported", "v0-error-internal_inconsistency"]
    {
        let v = fixture(name);
        let parsed: SkpError = serde_json::from_value(v.clone())
            .unwrap_or_else(|e| panic!("{name} does not deserialize as SkpError: {e}"));
        assert!(parsed.code.starts_with("engine."), "{name}: {}", parsed.code);
        assert!(parsed.fields.contains_key("detail"), "{name} must carry a detail field");
        assert_eq!(serde_json::to_value(&parsed).unwrap(), v, "{name} round trip changed the shape");
    }
}

#[test]
fn viewport_query_fixtures_round_trip() {
    round_trip::<ViewportQueryRequest>("v0-viewport_query-request");
    round_trip::<ViewportQueryResponse>("v0-viewport_query-response");
}

/// `skp/0.1`: `filter` is present (never omitted) on every `viewport_query` request, including the
/// unfiltered one above (`"filter": null`) and this variant, which carries one.
#[test]
fn viewport_query_request_with_a_filter_round_trips() {
    let v = fixture("v0-viewport_query-request-with-filter");
    let parsed: ViewportQueryRequest = serde_json::from_value(v.clone())
        .unwrap_or_else(|e| panic!("fixture does not deserialize as ViewportQueryRequest: {e}"));
    let filter = parsed.filter.as_ref().expect("this fixture's whole point is a present filter");
    assert_eq!(filter.predicate, "zone = 3 AND area > 100");
    assert_eq!(filter.dialect, "duckdb-expr/0");
    assert_eq!(serde_json::to_value(&parsed).unwrap(), v, "round trip changed the JSON shape");
}

#[test]
fn cancel_fixtures_round_trip() {
    round_trip::<CancelRequest>("v0-cancel-request");
    round_trip::<CancelResponse>("v0-cancel-response");
}

#[test]
fn close_dataset_fixtures_round_trip() {
    round_trip::<CloseDatasetRequest>("v0-close_dataset-request");
    round_trip::<CloseDatasetResponse>("v0-close_dataset-response");
}

#[test]
fn error_fixture_round_trips() {
    round_trip::<SkpError>("v0-error-example");
}

/// `skp/0.2`: `engine.identity_unusable` gains a `candidate_columns` field (NEXT-CUT.md P0) — the
/// file's 64-bit integer columns, schema order, comma-joined (`SkpError::fields` has no list shape
/// on the wire — `kernel/src/skp.rs::error_of`). `message` stays whatever `EngineError::Display`
/// already produced; the candidate list rides only in `fields`.
#[test]
fn identity_unusable_error_fixture_carries_candidate_columns() {
    let v = fixture("v0-error-identity_unusable-with-candidates");
    let parsed: SkpError = serde_json::from_value(v.clone())
        .unwrap_or_else(|e| panic!("fixture does not deserialize as SkpError: {e}"));
    assert_eq!(parsed.code, "engine.identity_unusable");
    assert_eq!(
        parsed.fields.get("candidate_columns").map(String::as_str),
        Some("parcel_key,tax_lot_number")
    );
    assert_eq!(serde_json::to_value(&parsed).unwrap(), v, "round trip changed the JSON shape");
}

/// Every request fixture actually carries the version string a real host would check.
#[test]
fn every_request_fixture_carries_the_current_skp_version() {
    for name in [
        "v0-open_dataset-request",
        "v0-open_dataset-request-with-crs_assertion-and-identity",
        "v0-describe-request",
        "v0-viewport_query-request",
        "v0-viewport_query-request-with-filter",
        "v0-cancel-request",
        "v0-close_dataset-request",
    ] {
        let v = fixture(name);
        assert_eq!(
            v.get("skp").and_then(|s| s.as_str()),
            Some(SKP_VERSION),
            "{name}: `skp` field does not match the crate's own SKP_VERSION"
        );
    }
}

/// `skp/0.4`, crs-unit-fact-and-bounds. `CrsUnit` is a closed, exhaustive four-value wire enum:
/// round trip every declared value, and refuse every string that is not one of the four
/// (`"Degree"` wrong case, `"degrees"` a plural, `"meter"` the US spelling, `""` empty).
///
/// Mutation: `#[serde(alias = "meter")]` on `Metre`. Expected failure: this test fails by name.
#[test]
fn crs_unit_serializes_to_its_four_declared_strings_and_refuses_any_other() {
    for (value, wire) in [
        (CrsUnit::Degree, "degree"),
        (CrsUnit::Metre, "metre"),
        (CrsUnit::Other, "other"),
        (CrsUnit::Unestablished, "unestablished"),
    ] {
        let serialized = serde_json::to_value(value).unwrap();
        assert_eq!(
            serialized,
            serde_json::json!(wire),
            "{wire}: serialized form"
        );
        let parsed: CrsUnit = serde_json::from_value(serde_json::json!(wire))
            .unwrap_or_else(|e| panic!("{wire}: does not deserialize: {e}"));
        assert_eq!(parsed, value, "{wire}: round trip");
    }
    for bad in ["Degree", "degrees", "meter", ""] {
        let result: Result<CrsUnit, _> = serde_json::from_value(serde_json::json!(bad));
        assert!(
            result.is_err(),
            "{bad:?} deserialized as a CrsUnit, but it is not one of the four declared strings"
        );
    }
}

/// `skp/0.4`, crs-unit-fact-and-bounds. Mutation: the literal back to `"skp/0.3"`. Expected
/// failure: this test fails by name.
#[test]
fn skp_version_is_skp_0_4() {
    assert_eq!(SKP_VERSION, "skp/0.5");
}

/// `skp/0.5`, the advisory source-change watcher. `OpenDatasetResponse` gains `session`.
/// Mutation: omit `session` from `error_of`/`open_dataset`'s response construction. Expected
/// failure: this test fails to deserialize the fixture (`session` is a required member, not
/// `Option`).
#[test]
fn open_dataset_response_carries_a_session_reference() {
    let v = fixture("v0-open_dataset-response");
    let parsed: OpenDatasetResponse = serde_json::from_value(v.clone())
        .unwrap_or_else(|e| panic!("fixture does not deserialize as OpenDatasetResponse: {e}"));
    assert!(parsed.session.as_str().starts_with("sr_"));
    assert_eq!(parsed.session.as_str().len(), 3 + 32);
    assert_eq!(serde_json::to_value(&parsed).unwrap(), v, "round trip changed the JSON shape");
}

/// `skp/0.5`. `coverage`, `checks` and `session_end` are three independent facts: none rewrites
/// another (addition 1). The session-ordinal fixture is populated with `coverage.state =
/// "watching"`, `checks.state = "degraded"` and a set `session_end` all at once, which is only
/// possible if the three are independent.
/// Mutation: merge `coverage` and `checks` into one field. Expected failure: this test fails to
/// deserialize the fixture, or its three independent assertions below fail.
#[test]
fn describe_carries_coverage_checks_and_session_end_as_independent_members() {
    let v = fixture("v0-describe-response-session-ordinal");
    let parsed: DescribeResponse = serde_json::from_value(v.clone())
        .unwrap_or_else(|e| panic!("fixture does not deserialize as DescribeResponse: {e}"));
    assert_eq!(parsed.coverage.state, CoverageState::Watching);
    assert_eq!(parsed.coverage.reason, None);
    assert_eq!(parsed.checks.state, ChecksState::Degraded);
    assert_eq!(parsed.checks.components, vec![CheckComponent::Mtime]);
    assert_eq!(parsed.session_end, Some(EndReason::ObservedChange));

    // The unpopulated shape, on the plain fixture: watching, full, no end.
    let plain = fixture("v0-describe-response");
    let parsed_plain: DescribeResponse = serde_json::from_value(plain.clone())
        .unwrap_or_else(|e| panic!("fixture does not deserialize as DescribeResponse: {e}"));
    assert_eq!(parsed_plain.coverage.state, CoverageState::Watching);
    assert!(parsed_plain.checks.components.is_empty());
    assert_eq!(parsed_plain.session_end, None);
    assert_eq!(serde_json::to_value(&parsed).unwrap(), v, "round trip changed the JSON shape");
}

/// `skp/0.5`. `DatasetSessionEnded` is `deny_unknown_fields` with exactly two members.
/// Mutation: add a third member (e.g. `dataset`) to the type. Expected failure: this test fails to
/// deserialize the fixture — an added member is refused, never tolerated.
#[test]
fn the_session_ended_event_fixture_decodes_with_exactly_two_members() {
    let v = fixture("v0-dataset_session_ended-event");
    assert_eq!(v.get("event").and_then(|e| e.as_str()), Some(DATASET_SESSION_ENDED_EVENT));
    let payload = v.get("payload").cloned().expect("fixture carries a payload member");
    let parsed: DatasetSessionEnded = serde_json::from_value(payload.clone())
        .unwrap_or_else(|e| panic!("payload does not deserialize as DatasetSessionEnded: {e}"));
    assert!(parsed.session.as_str().starts_with("sr_"));
    assert_eq!(parsed.reason, EndReason::ObservedChange);
    assert_eq!(serde_json::to_value(&parsed).unwrap(), payload, "round trip changed the JSON shape");

    // A third member is refused, never tolerated (deny_unknown_fields).
    let mut mutated = payload;
    mutated.as_object_mut().unwrap().insert("dataset".into(), serde_json::json!("ds_x"));
    assert!(
        serde_json::from_value::<DatasetSessionEnded>(mutated).is_err(),
        "a third member on the event payload must be refused, not tolerated"
    );
}
