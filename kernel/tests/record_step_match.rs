// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **`record_step` with a categorical match on `fillColor`** (`governance/forms/kernel/
//! B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md`, Amendment 7 item 2 (b): K-W1 and K-W2), end to end
//! from the real shape: a real `SkpHost::open_dataset` over a fixture generated in-test (`zone` is
//! a text column, `area` a `Float64` one), a `StepRecorder` on a scratch store root, and a
//! read-back by `recover`. A live history is locked, and on Windows a locked file cannot be read by
//! another handle, so each test drops its recorder first.

mod watch_support;

use std::path::{Path, PathBuf};
use std::sync::Arc;

use serde_json::{json, Value};
use spatial_engine::fixture::{write_geoparquet, AttributeMode, FixtureSpec};
use spatial_kernel::session_history::{recover, StepRecorder};
use spatial_kernel::skp::{session_end_channel, SkpHost, StreamRegistry};
use spatial_kernel::Catalog;
use spatial_skp::v0::{
    DatasetHandle, OpenDatasetRequest, RecordStepRequest, StepIntent, StyleSetParams, SKP_VERSION,
};

/// The request fixture a client sends for a match (W-F1's file), read from the protocol crate.
const FIXTURE: &str = "../protocol/skp/tests/data/v0-record_step-request-style-set-fill-match.json";

/// 500 polygons with the seven `MultiType` attribute columns: `zone` is text, `area` is not.
fn spec() -> FixtureSpec {
    FixtureSpec {
        features: 500,
        avg_vertices: 12,
        seed: 1,
        attributes: AttributeMode::MultiType,
        ..Default::default()
    }
}

fn scratch(name: &str) -> PathBuf {
    let dir = std::env::temp_dir()
        .join("spatial-ide-session-history-tests")
        .join(name);
    let _ = std::fs::remove_dir_all(&dir);
    std::fs::create_dir_all(&dir).expect("scratch folder");
    dir
}

fn host() -> Arc<SkpHost> {
    let (events, _) = session_end_channel();
    let arm = watch_support::no_watch_arm();
    Arc::new(SkpHost::new(
        Arc::new(Catalog::new()),
        StreamRegistry::new(),
        arm,
        events,
    ))
}

fn open(host: &SkpHost, dir: &Path) -> DatasetHandle {
    let path = dir.join("f.parquet");
    write_geoparquet(&path, &spec()).expect("fixture");
    let req = OpenDatasetRequest {
        skp: SKP_VERSION.to_string(),
        path: path.display().to_string(),
        cancel_key: "k".to_string(),
        crs_assertion: None,
        identity: None,
    };
    host.open_dataset(req).expect("open").dataset
}

/// The fixture's request, decoded with the open's own handle in place of the fixture's.
fn from_fixture(handle: &DatasetHandle) -> RecordStepRequest {
    let path = Path::new(env!("CARGO_MANIFEST_DIR")).join(FIXTURE);
    let text = std::fs::read_to_string(&path).expect("the fixture");
    let mut wire: Value = serde_json::from_str(&text).expect("JSON");
    wire["dataset"] = json!(handle.as_str());
    serde_json::from_value(wire).expect("decodes as the request")
}

/// A match request built from its parts, as a client would send it.
fn matching(handle: &DatasetHandle, column: &str, cases: &[(String, &str)]) -> RecordStepRequest {
    let cases: Vec<Value> = cases
        .iter()
        .map(|(when, then)| json!({ "when": when, "then": then }))
        .collect();
    let wire = json!({
        "skp": SKP_VERSION, "dataset": handle.as_str(),
        "intent": {"action": "style.set", "params": {"property": "fillColor", "value": {
            "match": {"column": column, "cases": cases,
                      "on_null": "#cccccc", "on_unmatched": "#999999"}}}}
    });
    serde_json::from_value(wire).expect("decodes as the request")
}

fn opacity(handle: &DatasetHandle, value: f64) -> RecordStepRequest {
    RecordStepRequest {
        skp: SKP_VERSION.to_string(),
        dataset: handle.clone(),
        intent: StepIntent::StyleSet(StyleSetParams::FillOpacity { value }),
    }
}

/// The one record in `root`, recovered whole: its lines as text.
fn read_back(root: &Path) -> Vec<String> {
    let dirs: Vec<PathBuf> = std::fs::read_dir(root)
        .expect("the store root")
        .map(|e| e.expect("entry").path())
        .collect();
    assert_eq!(dirs.len(), 1, "one record in {root:?}");
    let got = recover(&dirs[0]);
    assert!(got.failure.is_none(), "{:?}", got.failure);
    got.lines
}

/// **K-W1.** A match recorded through `record_step` over a real open reads back as the client sent
/// it, in the canonical member order, with its column named in `dependencies.fields` under the
/// Arrow type `describe` spells; `recover` keeps the line and chains the step after it.
///
/// RECORDED MUTATION: the match column is left out of the step's dependencies (the `referenced`
/// list `style_params` returns is empty). Expected failure: this test fails at its assertion on
/// `dependencies.fields`.
#[test]
fn a_recorded_fill_color_match_names_its_column_and_type_and_recover_chains() {
    let dir = scratch("kw1");
    let host = host();
    let handle = open(&host, &dir);
    let recorder = StepRecorder::new(dir.join("store"), host);
    recorder
        .record_step(from_fixture(&handle))
        .expect("the match is recorded");
    recorder
        .record_step(opacity(&handle, 0.5))
        .expect("a step after it");
    drop(recorder);

    let lines = read_back(&dir.join("store"));
    assert_eq!(lines.len(), 3, "the header and two steps");
    let canonical = r##""params":{"property":"fillColor","value":{"match":{"column":"zone","cases":[{"when":"civic","then":"#ff0000"},{"when":"park","then":"#00aa00"}],"on_null":"#cccccc","on_unmatched":"#999999"}}}"##;
    assert!(lines[1].contains(canonical), "{}", lines[1]);
    let steps: Vec<Value> = lines[1..]
        .iter()
        .map(|l| serde_json::from_str(l).expect("a JSON line"))
        .collect();
    let first = &steps[0]["step"];
    assert_eq!(first["kind"], "style");
    assert_eq!(first["intent"]["action"], "style.set");
    let fields = json!([{"name": "zone", "type": "Utf8"}]);
    assert_eq!(first["dependencies"]["fields"], fields);
    assert_eq!(steps[1]["step"]["parent"], first["id"]);
    assert_eq!(steps[1]["step"]["dependencies"]["fields"], json!([]));
}

/// **K-W2.** A match the style model refuses against the open is refused by name and writes
/// nothing: a column the file lacks, a column that is not text, 65 cases, a repeated `when` and an
/// uppercase colour (in a case and in `on_null`) each return `skp.style_value_not_admitted` for
/// `fillColor`, and the history holds the one step recorded before them and the one after.
///
/// RECORDED MUTATION: the match is checked by `style::parse` alone and never compiled against the
/// open's schema. Expected failure: the column the file lacks and the non-text column are not
/// refused as the style model refuses them (the missing one reaches the writer's own check and
/// returns another code, the non-text one is recorded), so this test fails at its first assertion.
#[test]
fn a_match_the_style_model_refuses_against_the_open_is_refused_by_name_and_writes_nothing() {
    let dir = scratch("kw2");
    let host = host();
    let handle = open(&host, &dir);
    let recorder = StepRecorder::new(dir.join("store"), host);
    recorder.record_step(opacity(&handle, 0.4)).expect("first");

    let one = [("civic".to_string(), "#ff0000")];
    let many: Vec<(String, &str)> = (0..65).map(|i| (format!("w{i}"), "#ff0000")).collect();
    let repeated = [
        ("civic".to_string(), "#ff0000"),
        ("civic".to_string(), "#00aa00"),
    ];
    let upper = [("civic".to_string(), "#FF0000")];
    let refused = [
        (
            "a column the file lacks",
            matching(&handle, "nosuchcolumn", &one),
        ),
        ("a column that is not text", matching(&handle, "area", &one)),
        ("65 cases", matching(&handle, "zone", &many)),
        ("a repeated `when`", matching(&handle, "zone", &repeated)),
        ("an uppercase colour", matching(&handle, "zone", &upper)),
    ];
    for (what, req) in refused {
        let e = recorder.record_step(req).unwrap_err();
        assert_eq!(e.code, "skp.style_value_not_admitted", "{what}: {e}");
        assert_eq!(
            e.fields.get("property").map(String::as_str),
            Some("fillColor")
        );
        assert!(!e.fields["detail"].is_empty(), "{what}: the rule is named");
    }
    let mut on_null = matching(&handle, "zone", &one);
    if let StepIntent::StyleSet(StyleSetParams::FillColorMatch { value }) = &mut on_null.intent {
        value.spec.on_null = "#CCCCCC".to_string();
    } else {
        panic!("a match request");
    }
    let e = recorder.record_step(on_null).unwrap_err();
    assert_eq!(e.code, "skp.style_value_not_admitted");
    assert!(e.message.contains("lowercase"), "{}", e.message);

    recorder.record_step(opacity(&handle, 0.5)).expect("after");
    drop(recorder);
    let lines = read_back(&dir.join("store"));
    assert_eq!(lines.len(), 3, "the header and the two valid steps only");
    let steps: Vec<Value> = lines[1..]
        .iter()
        .map(|l| serde_json::from_str(l).expect("a JSON line"))
        .collect();
    assert_eq!(steps[1]["step"]["parent"], steps[0]["step"]["id"]);
}
