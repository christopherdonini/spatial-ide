// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! Runs the spec-derived fixtures in `fixtures/*.json` (written from `SKP-V0.md` alone — see this
//! directory's `README.md`) against this crate's wire types. Observation only: every fixture is
//! run, every outcome is printed, and the test fails at the end if any fixture diverged. A
//! `refused_any_layer` fixture that the type layer accepts is reported as deferred to the host
//! (`AMBIGUITIES.md` A3), not as a divergence.

use spatial_skp::v0::*;

/// Divergences observed and reported in `DIVERGENCES.md` (fixture ids). The run asserts the
/// observed set equals this one in both directions: a new divergence fails, and so does a reported
/// one that stops diverging — either way the report must be updated, never silently absorbed.
const REPORTED_DIVERGENCES: &[&str] = &["rej-resp-cancel-bad-state"];

#[derive(Debug)]
enum Outcome {
    Pass,
    DeferredToHost(String),
    Diverged(String),
}

fn check<T>(doc: &serde_json::Value, expect: &str, roundtrip: bool) -> Outcome
where
    T: serde::Serialize + serde::de::DeserializeOwned,
{
    let parsed = serde_json::from_value::<T>(doc.clone());
    match (expect, parsed) {
        ("accept", Ok(v)) => {
            if roundtrip {
                let back = serde_json::to_value(&v).unwrap();
                if &back != doc {
                    return Outcome::Diverged(format!("accepted, but re-serialized as {back}"));
                }
            }
            Outcome::Pass
        }
        ("accept", Err(e)) => Outcome::Diverged(format!("refused at deserialize: {e}")),
        ("reject_at_deserialize", Ok(v)) => Outcome::Diverged(format!(
            "accepted at deserialize; re-serialized as {}",
            serde_json::to_value(&v).unwrap()
        )),
        ("reject_at_deserialize", Err(_)) => Outcome::Pass,
        ("refused_any_layer", Ok(_)) => Outcome::DeferredToHost(
            "accepted at the type layer; host layer not observable here".into(),
        ),
        ("refused_any_layer", Err(_)) => Outcome::Pass,
        (other, _) => panic!("fixture has unknown expect {other:?}"),
    }
}

fn run(wire_type: &str, doc: &serde_json::Value, expect: &str, roundtrip: bool) -> Outcome {
    match wire_type {
        "open_dataset.request" => check::<OpenDatasetRequest>(doc, expect, roundtrip),
        "open_dataset.response" => check::<OpenDatasetResponse>(doc, expect, roundtrip),
        "describe.request" => check::<DescribeRequest>(doc, expect, roundtrip),
        "viewport_query.request" => check::<ViewportQueryRequest>(doc, expect, roundtrip),
        "viewport_query.response" => check::<ViewportQueryResponse>(doc, expect, roundtrip),
        "cancel.request" => check::<CancelRequest>(doc, expect, roundtrip),
        "cancel.response" => check::<CancelResponse>(doc, expect, roundtrip),
        "close_dataset.request" => check::<CloseDatasetRequest>(doc, expect, roundtrip),
        "close_dataset.response" => check::<CloseDatasetResponse>(doc, expect, roundtrip),
        "error" => check::<SkpError>(doc, expect, roundtrip),
        other => panic!("fixture names unknown wire_type {other:?}"),
    }
}

#[test]
fn spec_derived_fixtures_against_wire_types() {
    let dir = format!("{}/tests/conformance/fixtures", env!("CARGO_MANIFEST_DIR"));
    let mut files: Vec<_> = std::fs::read_dir(&dir)
        .unwrap()
        .map(|e| e.unwrap().path())
        .collect();
    files.sort();
    let (mut pass, mut deferred, mut diverged) = (0, 0, Vec::new());
    for path in files {
        let raw = std::fs::read_to_string(&path).unwrap();
        let fixtures: Vec<serde_json::Value> = serde_json::from_str(&raw).unwrap();
        for f in fixtures {
            let id = f["id"].as_str().unwrap();
            let outcome = run(
                f["wire_type"].as_str().unwrap(),
                &f["document"],
                f["expect"].as_str().unwrap(),
                f["roundtrip"].as_bool().unwrap(),
            );
            println!(
                "{:<14} {id} [{}]",
                format!("{outcome:?}").split('(').next().unwrap(),
                f["spec"]
            );
            match outcome {
                Outcome::Pass => pass += 1,
                Outcome::DeferredToHost(why) => {
                    println!("               {why}");
                    deferred += 1
                }
                Outcome::Diverged(why) => {
                    println!("               {why}");
                    diverged.push(id.to_string())
                }
            }
        }
    }
    println!(
        "pass={pass} deferred_to_host={deferred} diverged={}",
        diverged.len()
    );
    let mut reported: Vec<String> = REPORTED_DIVERGENCES.iter().map(|s| s.to_string()).collect();
    reported.sort();
    diverged.sort();
    assert_eq!(
        diverged, reported,
        "observed divergences differ from DIVERGENCES.md's reported set"
    );
}
