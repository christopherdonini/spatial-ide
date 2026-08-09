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

#[test]
fn describe_fixtures_round_trip() {
    round_trip::<DescribeRequest>("v0-describe-request");
    round_trip::<DescribeResponse>("v0-describe-response");
}

#[test]
fn viewport_query_fixtures_round_trip() {
    round_trip::<ViewportQueryRequest>("v0-viewport_query-request");
    round_trip::<ViewportQueryResponse>("v0-viewport_query-response");
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

/// Every request fixture actually carries the version string a real host would check.
#[test]
fn every_request_fixture_carries_the_current_skp_version() {
    for name in [
        "v0-open_dataset-request",
        "v0-describe-request",
        "v0-viewport_query-request",
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
