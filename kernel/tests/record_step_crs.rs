// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **`dependencies.crs`** as a step records it (`kernel/B2-1B-RECORDING-PREREGISTRATION.md`,
//! Amendment 2 item 10; ADR-036 §6 as amended, blocks H and I): K10 to K12, against real opens.

mod watch_support;

use std::path::{Path, PathBuf};
use std::sync::Arc;

use serde_json::Value;
use spatial_engine::fixture::{
    write_geoparquet, CoordinateDomain, CrsMode, FixtureSpec, LV95_PROJJSON,
};
use spatial_kernel::session_history::{recover, StepRecorder};
use spatial_kernel::skp::{session_end_channel, SkpHost, StreamRegistry};
use spatial_kernel::Catalog;
use spatial_renderer::canonical::sha256_hex;
use spatial_skp::v0::{
    CrsAssertion, DescribeRequest, OpenDatasetRequest, RecordStepRequest, StepIntent,
    StyleSetParams, SKP_VERSION,
};

fn scratch(name: &str) -> PathBuf {
    let dir = std::env::temp_dir()
        .join("spatial-ide-session-history-tests")
        .join(name);
    let _ = std::fs::remove_dir_all(&dir);
    std::fs::create_dir_all(&dir).expect("scratch folder");
    dir
}

/// Open a fresh fixture under `dir` (in degrees when it declares no CRS and none is asserted,
/// which is the only case the format's default admits), record one style step, and return the
/// `dependencies.crs` the step holds and the provenance `describe` reports for the same open.
fn record(dir: &Path, mode: CrsMode, assertion: Option<&str>) -> (Value, String) {
    let absent = matches!(mode, CrsMode::AbsentKey) && assertion.is_none();
    let domain = if absent {
        CoordinateDomain::Wgs84Degrees
    } else {
        CoordinateDomain::Lv95Metres
    };
    let spec = FixtureSpec {
        features: 40,
        avg_vertices: 6,
        hole_every: 0,
        crs_mode: mode,
        domain,
        ..Default::default()
    };
    let path = dir.join("f.parquet");
    write_geoparquet(&path, &spec).expect("fixture");
    let (events, _) = session_end_channel();
    let arm = watch_support::no_watch_arm();
    let host = Arc::new(SkpHost::new(
        Arc::new(Catalog::new()),
        StreamRegistry::new(),
        arm,
        events,
    ));
    let crs_assertion = assertion.map(|d| CrsAssertion {
        identifier: "EPSG:2056".to_string(),
        definition_json: d.to_string(),
    });
    let open = OpenDatasetRequest {
        skp: SKP_VERSION.to_string(),
        path: path.display().to_string(),
        cancel_key: "k".to_string(),
        crs_assertion,
        identity: None,
    };
    let dataset = host.open_dataset(open).expect("open").dataset;
    let describe = DescribeRequest {
        skp: SKP_VERSION.to_string(),
        dataset: dataset.clone(),
    };
    let described = host.describe(describe).expect("describe").crs.provenance;
    let recorder = StepRecorder::new(dir.join("store"), host);
    let intent = StepIntent::StyleSet(StyleSetParams::FillOpacity { value: 0.5 });
    let request = RecordStepRequest {
        skp: SKP_VERSION.to_string(),
        dataset,
        intent,
    };
    recorder.record_step(request).expect("recorded");
    drop(recorder);
    let record = std::fs::read_dir(dir.join("store"))
        .unwrap()
        .next()
        .unwrap()
        .unwrap()
        .path();
    let got = recover(&record);
    assert!(got.failure.is_none(), "{:?}", got.failure);
    let step: Value = serde_json::from_str(&got.lines[1]).unwrap();
    (step["step"]["dependencies"]["crs"].clone(), described)
}

/// **K10.** The identifier is a label only: two caller assertions under one identifier, with two
/// spellings of the definition, record one label and two hashes, each of the text the caller sent.
///
/// RECORDED MUTATION: the writer hashes `crs.identifier()`. Expected failure: the hashes are equal.
#[test]
fn two_definitions_under_one_identifier_record_one_label_and_two_definition_hashes() {
    let texts = [LV95_PROJJSON.to_string(), format!("{LV95_PROJJSON}\n")];
    let crs: Vec<Value> = (0..2)
        .map(|i| {
            record(
                &scratch(&format!("k10-{i}")),
                CrsMode::AbsentKey,
                Some(&texts[i]),
            )
            .0
        })
        .collect();
    assert_eq!(crs[0]["identifier"], crs[1]["identifier"]);
    assert_eq!(crs[0]["provenance"], "crs:asserted");
    for (crs, text) in crs.iter().zip(&texts) {
        assert_eq!(crs["definition"], sha256_hex(text.as_bytes()));
    }
    assert_ne!(crs[0]["definition"], crs[1]["definition"]);
}

/// **K11.** A format-default admission (an absent `crs` key) admitted no definition: the step
/// records the named state `none-admitted`, not the hash of an empty text.
///
/// RECORDED MUTATION: the writer hashes an empty text when none was admitted. Expected failure:
/// `definition` is a hash.
#[test]
fn a_format_default_admission_records_the_none_admitted_state() {
    let (crs, _) = record(&scratch("k11"), CrsMode::AbsentKey, None);
    assert_eq!(crs["provenance"], "crs:format-default");
    assert_eq!(crs["definition"]["state"], "none-admitted");
}

/// **K12.** Each admission class records the provenance `describe` reports for the same open.
///
/// RECORDED MUTATION: the writer writes `crs.source().as_str()`. Expected failure: the word is
/// `file`, not `crs:declared`.
#[test]
fn each_admission_class_records_the_provenance_describe_reports() {
    let cases = [
        ("declared", CrsMode::DeclaredLv95, None),
        ("asserted", CrsMode::AbsentKey, Some(LV95_PROJJSON)),
        ("format-default", CrsMode::AbsentKey, None),
    ];
    for (name, mode, assertion) in cases {
        let (crs, described) = record(&scratch(&format!("k12-{name}")), mode, assertion);
        let word = format!("crs:{name}");
        assert_eq!(
            (crs["provenance"].as_str(), described.as_str()),
            (Some(word.as_str()), word.as_str())
        );
    }
}
