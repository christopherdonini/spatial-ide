// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **`record_step` and the session history**, end to end from the real shape
//! (`kernel/B2-1B-RECORDING-PREREGISTRATION.md` §4, K1 to K7 and K9): a real `SkpHost::open_dataset`
//! over a fixture generated in-test, a `StepRecorder` on a scratch store root, and a read-back by
//! `recover`. A live history is locked, and on Windows a locked file cannot be read by another
//! handle, so each test drops its recorder first, which releases the lock as a crash does and
//! clears nothing. Nothing here times anything.

mod watch_support;

use std::fs::{File, OpenOptions};
use std::path::{Path, PathBuf};
use std::sync::Arc;
use std::time::{Duration, SystemTime};

use serde_json::Value;
use spatial_engine::fixture::{write_geoparquet, AttributeMode, FixtureSpec};
use spatial_kernel::dataset_ref::{DatasetRef, DatasetUri};
use spatial_kernel::session_history::{recover, StepRecorder};
use spatial_kernel::skp::{session_end_channel, SkpHost, StreamRegistry};
use spatial_kernel::Catalog;
use spatial_renderer::canonical::{sha256_hex, to_canonical_string, Json};
use spatial_skp::v0::{
    CloseDatasetRequest, DatasetHandle, Filter, FilterApplyParams, OpenDatasetRequest,
    OutlineWidthValue, PxUnit, RecordStepRequest, StepIntent, StyleSetParams, SKP_VERSION,
};

/// F1: 500 polygons, declared LV95, native `id`, a `zone` text column.
fn f1(seed: u64) -> FixtureSpec {
    FixtureSpec {
        features: 500,
        avg_vertices: 12,
        seed,
        attributes: AttributeMode::CategoricalZone,
        ..Default::default()
    }
}

/// A fresh scratch folder for one test: the store root is `<it>/store`.
fn scratch(name: &str) -> PathBuf {
    let dir = std::env::temp_dir()
        .join("spatial-ide-session-history-tests")
        .join(name);
    let _ = std::fs::remove_dir_all(&dir);
    std::fs::create_dir_all(&dir).expect("scratch folder");
    dir
}

fn fixture(dir: &Path, name: &str, spec: &FixtureSpec) -> PathBuf {
    let path = dir.join(format!("{name}.parquet"));
    write_geoparquet(&path, spec).expect("fixture");
    path
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

fn open(host: &SkpHost, path: &Path) -> DatasetHandle {
    let req = OpenDatasetRequest {
        skp: SKP_VERSION.to_string(),
        path: path.display().to_string(),
        cancel_key: "k".to_string(),
        crs_assertion: None,
        identity: None,
    };
    host.open_dataset(req).expect("open").dataset
}

fn request(dataset: &DatasetHandle, intent: StepIntent) -> RecordStepRequest {
    RecordStepRequest {
        skp: SKP_VERSION.to_string(),
        dataset: dataset.clone(),
        intent,
    }
}

fn filter(dataset: &DatasetHandle, predicate: &str) -> RecordStepRequest {
    let f = Filter::new(predicate, "duckdb-expr/0").expect("dialect");
    request(
        dataset,
        StepIntent::FilterApply(FilterApplyParams { filter: Some(f) }),
    )
}

fn opacity(dataset: &DatasetHandle, value: f64) -> RecordStepRequest {
    request(
        dataset,
        StepIntent::StyleSet(StyleSetParams::FillOpacity { value }),
    )
}

fn colour(dataset: &DatasetHandle, value: &str) -> RecordStepRequest {
    let value = value.to_string();
    request(
        dataset,
        StepIntent::StyleSet(StyleSetParams::FillColor { value }),
    )
}

/// The record folders in a store root.
fn records(root: &Path) -> Vec<PathBuf> {
    let Ok(entries) = std::fs::read_dir(root) else {
        return Vec::new();
    };
    let mut dirs: Vec<PathBuf> = entries.map(|e| e.expect("entry").path()).collect();
    dirs.sort();
    dirs
}

/// The one record in `root`, recovered whole: its lines parsed.
fn read_back(root: &Path) -> Vec<Value> {
    let dirs = records(root);
    assert_eq!(dirs.len(), 1, "one record in {root:?}");
    let got = recover(&dirs[0]);
    assert!(got.failure.is_none(), "{:?}", got.failure);
    got.lines
        .iter()
        .map(|l| serde_json::from_str(l).expect("a JSON line"))
        .collect()
}

fn text(v: &Json) -> String {
    to_canonical_string(v).expect("canonical text")
}

/// **K1.** The seam from the real shape: a filter recorded through `record_step` over a real open
/// reads back with its dataset reference, its dependencies and its open's observation. The header's
/// entry is what `DatasetRef::linked` writes for this open, byte for byte; the step's `data` names
/// that reference and holds the open's observation; `dependencies` name the predicate's field with
/// the Arrow type `describe` spells, the CRS by its identifier, its provenance class and the hash of
/// its definition text, and the file's declared geometry types.
///
/// RECORDED MUTATION: the writer omits `data` from the step line. Expected failure: the read-back
/// finds the line refused (`recover` names it), and this test fails at `recover`'s failure.
#[test]
fn a_filter_step_recorded_through_record_step_reads_back_with_its_reference_dependencies_and_observation(
) {
    let dir = scratch("k1");
    let path = fixture(&dir, "f1", &f1(1));
    let host = host();
    let handle = open(&host, &path);
    let recorder = StepRecorder::new(dir.join("store"), host.clone());
    recorder
        .record_step(filter(&handle, "zone = 'civic'"))
        .expect("recorded");
    drop(recorder);

    let lines = read_back(&dir.join("store"));
    let ds = host.catalog().get(handle.as_str()).expect("open");
    let uri = lines[0]["datasets"][0]["resource"]["logical_uri"]
        .as_str()
        .expect("a reference");
    let linked =
        DatasetRef::linked(uri.parse::<DatasetUri>().expect("a URI"), &ds).expect("builds");
    let Json::Obj(entry) = linked.to_json() else {
        panic!("an object")
    };
    let observed = text(
        &entry
            .iter()
            .find(|m| m.0 == "observed")
            .expect("observed")
            .1,
    );
    let as_value = |t: String| serde_json::from_str::<Value>(&t).unwrap();
    assert_eq!(
        lines[0]["datasets"][0],
        as_value(text(&linked.to_json())),
        "the header's entry"
    );

    let step = &lines[1]["step"];
    assert_eq!(step["data"]["dataset"], uri);
    assert_eq!(step["data"]["identity"]["observed"], as_value(observed));
    assert_eq!(step["intent"]["action"], "filter.apply");
    assert_eq!(step["kind"], "data");
    let fields = serde_json::json!([{"name": "zone", "type": "Utf8"}]);
    assert_eq!(step["dependencies"]["fields"], fields);
    let definition = ds.crs().definition_json().expect("a declared definition");
    assert_eq!(step["dependencies"]["crs"]["identifier"], "EPSG:2056");
    assert_eq!(step["dependencies"]["crs"]["provenance"], "crs:declared");
    assert_eq!(
        step["dependencies"]["crs"]["definition"],
        sha256_hex(definition.as_bytes())
    );
    assert_eq!(
        step["dependencies"]["geometry_types"],
        serde_json::json!(ds.declared_geometry_types())
    );
}

/// **K2.** A refused predicate records nothing and returns its own typed code: the store root holds
/// no record, not even an empty folder.
///
/// RECORDED MUTATION: the record is created before admission. Expected failure: a record folder
/// exists after the refusal.
#[test]
fn a_refused_predicate_records_nothing_and_returns_its_own_typed_code() {
    let dir = scratch("k2");
    let host = host();
    let handle = open(&host, &fixture(&dir, "f1", &f1(1)));
    let recorder = StepRecorder::new(dir.join("store"), host);
    for (predicate, code) in [
        ("nosuchcolumn = 1", "skp.filter_unknown_column"),
        ("zone", "skp.filter_not_boolean"),
    ] {
        let e = recorder
            .record_step(filter(&handle, predicate))
            .unwrap_err();
        assert_eq!(e.code, code, "{predicate}");
    }
    assert!(
        records(&dir.join("store")).is_empty(),
        "nothing was recorded"
    );
}

/// A style value the style model refuses, and a colour that is not lowercase, are each refused by
/// name and record nothing (Amendment 1, item 4 (d): the kernel checks a value by wrapping it in a
/// whole style document and calling the renderer's `parse`, and the lowercase rule is its own).
///
/// RECORDED MUTATION: the `parse` call is removed. Expected failure: the opacity of 1.5 is recorded.
#[test]
fn a_style_value_the_style_model_refuses_is_refused_by_name_and_records_nothing() {
    let dir = scratch("style-parse");
    let host = host();
    let handle = open(&host, &fixture(&dir, "f1", &f1(1)));
    let recorder = StepRecorder::new(dir.join("store"), host);
    let width = |value| {
        request(
            &handle,
            StepIntent::StyleSet(StyleSetParams::OutlineWidth { value }),
        )
    };
    let too_wide = OutlineWidthValue {
        value: 100.0,
        unit: PxUnit::Px,
    };
    for req in [
        opacity(&handle, 1.5),
        colour(&handle, "red"),
        width(too_wide),
    ] {
        let e = recorder.record_step(req).unwrap_err();
        assert_eq!(e.code, "skp.style_value_not_admitted");
    }
    assert!(
        records(&dir.join("store")).is_empty(),
        "nothing was recorded"
    );
}

/// **RECORDED MUTATION** for the lowercase rule: it is removed. Expected failure: `#ABCDEF` is
/// recorded, since the renderer's own `parse` accepts capitals.
#[test]
fn a_colour_not_in_lowercase_is_refused_by_name_and_records_nothing() {
    let dir = scratch("style-lowercase");
    let host = host();
    let handle = open(&host, &fixture(&dir, "f1", &f1(1)));
    let recorder = StepRecorder::new(dir.join("store"), host);
    let e = recorder
        .record_step(colour(&handle, "#ABCDEF"))
        .unwrap_err();
    assert_eq!(e.code, "skp.style_value_not_admitted");
    assert!(e.message.contains("lowercase"), "{}", e.message);
    assert!(
        records(&dir.join("store")).is_empty(),
        "nothing was recorded"
    );
    recorder
        .record_step(colour(&handle, "#abcdef"))
        .expect("the lowercase spelling");
}

/// **K3.** A step on a dataset whose session has ended is refused with the end's own code, and
/// records nothing.
///
/// RECORDED MUTATION: the live check is skipped. Expected failure: the step is recorded.
#[test]
fn a_step_on_a_dataset_whose_generation_ended_is_refused_with_the_ends_code() {
    let dir = scratch("k3");
    let host = host();
    let handle = open(&host, &fixture(&dir, "f1", &f1(1)));
    let recorder = StepRecorder::new(dir.join("store"), host.clone());
    host.end_generation(handle.as_str());
    let e = recorder
        .record_step(filter(&handle, "zone = 'civic'"))
        .unwrap_err();
    assert_eq!(e.code, "engine.source_changed");
    assert!(records(&dir.join("store")).is_empty());
}

/// **K4.** Steps chain in the order the kernel received them, and the first one's parent is null.
///
/// RECORDED MUTATION: `parent` is always null. Expected failure: `recover` refuses the second step.
#[test]
fn steps_chain_in_the_order_the_kernel_received_them() {
    let dir = scratch("k4");
    let host = host();
    let handle = open(&host, &fixture(&dir, "f1", &f1(1)));
    let recorder = StepRecorder::new(dir.join("store"), host);
    recorder
        .record_step(filter(&handle, "zone = 'civic'"))
        .unwrap();
    recorder.record_step(opacity(&handle, 0.35)).unwrap();
    recorder.record_step(colour(&handle, "#4285f4")).unwrap();
    drop(recorder);
    let lines = read_back(&dir.join("store"));
    let steps: Vec<&Value> = lines[1..].iter().map(|l| &l["step"]).collect();
    assert_eq!(steps.len(), 3);
    assert_eq!(steps[0]["parent"], Value::Null);
    assert_eq!(steps[1]["parent"], steps[0]["id"]);
    assert_eq!(steps[2]["parent"], steps[1]["id"]);
    let actions: Vec<&Value> = steps.iter().map(|s| &s["intent"]["action"]).collect();
    assert_eq!(actions, ["filter.apply", "style.set", "style.set"]);
    assert_eq!(steps[1]["intent"]["params"]["value"], 0.35);
}

/// **K5.** A reopen of the same file, admitted under the same claims, continues its record, and
/// another file starts its own. The reopened file here was rewritten with a modification time 60 s
/// later, so the later step's observation differs.
///
/// RECORDED MUTATION: records are keyed by handle. Expected failure: the reopen starts a second
/// record.
#[test]
fn a_reopen_of_the_same_file_continues_its_record_and_another_file_starts_its_own() {
    let dir = scratch("k5");
    let store = dir.join("store");
    let (a, b) = (dir.join("a.parquet"), dir.join("b.parquet"));
    write_geoparquet(&a, &f1(1)).unwrap();
    write_geoparquet(&b, &f1(2)).unwrap();
    let host = host();
    let recorder = StepRecorder::new(store.clone(), host.clone());
    let first = open(&host, &a);
    recorder.record_step(opacity(&first, 0.5)).unwrap();
    let close = CloseDatasetRequest {
        skp: SKP_VERSION.to_string(),
        dataset: first,
    };
    host.close_dataset(close).unwrap();

    write_geoparquet(&a, &f1(1)).unwrap();
    let later = SystemTime::now() + Duration::from_secs(60);
    File::options()
        .write(true)
        .open(&a)
        .unwrap()
        .set_modified(later)
        .unwrap();
    let again = open(&host, &a);
    recorder.record_step(opacity(&again, 0.6)).unwrap();
    assert_eq!(records(&store).len(), 1, "the reopen continues the record");
    let other = open(&host, &b);
    recorder.record_step(opacity(&other, 0.7)).unwrap();
    assert_eq!(records(&store).len(), 2, "another file starts its own");
    drop(recorder);

    let dirs = records(&store);
    let steps = |d: &PathBuf| -> Vec<Value> {
        recover(d)
            .lines
            .iter()
            .skip(1)
            .map(|l| serde_json::from_str(l).unwrap())
            .collect()
    };
    let (one, two) = (steps(&dirs[0]), steps(&dirs[1]));
    let (long, short) = if one.len() == 2 {
        (one, two)
    } else {
        (two, one)
    };
    assert_eq!((long.len(), short.len()), (2, 1));
    let observed = |s: &Value| s["step"]["data"]["identity"]["observed"].clone();
    assert_ne!(
        observed(&long[0]),
        observed(&long[1]),
        "the later step's observation differs"
    );
    assert_eq!(
        long[0]["step"]["data"]["dataset"],
        long[1]["step"]["data"]["dataset"]
    );
    assert_eq!(long[1]["step"]["parent"], long[0]["step"]["id"]);
}

/// **K6.** `end_session` clears this run's records, their files and folders, and nothing else: a
/// record an earlier run left (here, a recorder dropped without ending) is untouched.
///
/// RECORDED MUTATION: every record under the root is deleted. Expected failure: the earlier run's
/// record is gone.
#[test]
fn end_session_clears_this_runs_records_only() {
    let dir = scratch("k6");
    let store = dir.join("store");
    let host = host();
    let handle = open(&host, &fixture(&dir, "f1", &f1(1)));
    let earlier = StepRecorder::new(store.clone(), host.clone());
    earlier.record_step(opacity(&handle, 0.5)).unwrap();
    drop(earlier);
    let left = records(&store);
    assert_eq!(left.len(), 1);

    let this_run = StepRecorder::new(store.clone(), host);
    this_run.record_step(opacity(&handle, 0.6)).unwrap();
    assert_eq!(records(&store).len(), 2);
    this_run.end_session();
    assert_eq!(
        records(&store),
        left,
        "only the earlier run's record remains"
    );
    let kept = recover(&left[0]);
    assert!(
        kept.failure.is_none() && kept.lines.len() == 2,
        "{:?}",
        kept.failure
    );
    assert!(left[0].join("locations.json").exists());
}

/// **K7.** A live history is locked against a second holder, and the lock is free once the
/// recorder is gone.
///
/// RECORDED MUTATION: no lock is taken. Expected failure: the second `try_lock` succeeds.
#[test]
fn a_live_history_is_locked_against_a_second_recorder() {
    let dir = scratch("k7");
    let host = host();
    let handle = open(&host, &fixture(&dir, "f1", &f1(1)));
    let recorder = StepRecorder::new(dir.join("store"), host);
    recorder.record_step(opacity(&handle, 0.5)).unwrap();
    let history = records(&dir.join("store"))[0].join("history.jsonl");
    let second = OpenOptions::new()
        .read(true)
        .write(true)
        .open(&history)
        .unwrap();
    assert!(matches!(
        second.try_lock(),
        Err(std::fs::TryLockError::WouldBlock)
    ));
    drop(recorder);
    assert!(
        second.try_lock().is_ok(),
        "the lock is released with its holder"
    );
}

/// The source scan K9 runs: the append path must flush each line to storage and hold no buffer.
fn append_path_faults(source: &str) -> Vec<&'static str> {
    let product = source.split("#[cfg(test)]").next().unwrap_or(source);
    let mut faults = Vec::new();
    for (needle, fault) in [
        (".sync_all()", "no sync_all"),
        ("(self.sync)(&mut self.out)", "no flush call"),
        ("write_all(&bytes)", "no single write_all"),
    ] {
        if !product.contains(needle) {
            faults.push(fault);
        }
    }
    for banned in ["BufWriter", "LineWriter"] {
        if product.contains(banned) {
            faults.push("a buffer in the process");
        }
    }
    faults
}

/// **K9.** A source scan, which proves the call is there and that no buffer stands in front of it,
/// not that the device honours the flush. Each rule fires on a planted positive control.
///
/// RECORDED MUTATION: `sync_all` removed. Expected failure: the scan finds `no sync_all`.
#[test]
fn the_append_path_flushes_each_line_before_it_returns() {
    let source = std::fs::read_to_string(
        Path::new(env!("CARGO_MANIFEST_DIR")).join("src/session_history.rs"),
    )
    .unwrap();
    assert_eq!(append_path_faults(&source), Vec::<&str>::new());
    let planted = "let w = BufWriter::new(file); w.write_all(&bytes)";
    assert_eq!(
        append_path_faults(planted),
        ["no sync_all", "no flush call", "a buffer in the process"]
    );
    assert_eq!(
        append_path_faults(&source.replace(".sync_all()", ".flush()")),
        ["no sync_all"]
    );
}
