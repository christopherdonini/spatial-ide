// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **The recovery offer after a process that aborts** (the form's K-C1, K-C3 and K-C19,
//! `governance/forms/kernel/B2-1C-STEP-3-RECOVERY-OFFER-PREREGISTRATION.md` §4): a child copy of
//! this test binary records steps against a real open and calls `process::abort`, so no destructor
//! runs and no buffer is flushed on the way out, as in `session_history_crash.rs`. The parent waits
//! for it with a timeout of 60 s, then lists, recovers and records through a new run of the
//! recorder on the same store.

mod watch_support;

use std::io::Write;
use std::path::{Path, PathBuf};
use std::process::{Command, Stdio};
use std::sync::Arc;
use std::time::{Duration, Instant};

use serde_json::{json, Value};
use spatial_engine::fixture::{write_geoparquet, AttributeMode, FixtureSpec};
use spatial_kernel::project::{Projects, PROJECT_FILE_NAME};
use spatial_kernel::session_history::StepRecorder;
use spatial_kernel::skp::{session_end_channel, SkpHost, StreamRegistry};
use spatial_kernel::Catalog;
use spatial_skp::v0::{
    DatasetHandle, Filter, FilterApplyParams, HexF64, ListRecoverableRequest, OpenDatasetRequest,
    OpenProjectRequest, RecordStepRequest, RecoverSessionRequest, RecoverableData,
    SaveProjectRequest, StepIntent, StyleSetParams, SKP_VERSION,
};

const CHILD_ENV: &str = "SPATIAL_IDE_RECOVERY_CHILD";
const STYLE: &str = r##"{"style_version":1,"layer":{"geometry":"polygon","fill_color":{"literal":"#4285f4"},"fill_opacity":{"literal":0.35},"outline_color":{"literal":"#000000"},"outline_width":{"literal":1.5}}}"##;

struct Run {
    host: Arc<SkpHost>,
    recorder: Arc<StepRecorder>,
    projects: Projects,
}

fn run(dir: &Path) -> Run {
    let host = Arc::new(SkpHost::new(
        Arc::new(Catalog::new()),
        StreamRegistry::new(),
        watch_support::no_watch_arm(),
        session_end_channel().0,
    ));
    let recorder = Arc::new(StepRecorder::new(dir.join("sessions"), host.clone()));
    let projects = Projects::new(dir.join("machine"), recorder.clone());
    Run {
        host,
        recorder,
        projects,
    }
}

impl Run {
    fn open(&self, dir: &Path) -> DatasetHandle {
        let req = OpenDatasetRequest {
            skp: SKP_VERSION.to_string(),
            path: dir
                .join("data")
                .join("parcels.parquet")
                .display()
                .to_string(),
            cancel_key: "k".to_string(),
            crs_assertion: None,
            identity: None,
            set_aside_file_id: false,
        };
        self.host.open_dataset(req).expect("open").dataset
    }

    fn step(&self, handle: &DatasetHandle, intent: StepIntent) {
        let req = RecordStepRequest {
            skp: SKP_VERSION.to_string(),
            dataset: handle.clone(),
            intent,
        };
        self.recorder.record_step(req).expect("recorded");
    }

    fn recover(
        &self,
        record: &str,
        at: Option<&DatasetHandle>,
    ) -> spatial_skp::v0::RecoverSessionResponse {
        let req = RecoverSessionRequest {
            skp: SKP_VERSION.to_string(),
            record: record.to_string(),
            cancel_key: "recover".to_string(),
            dataset: at.cloned(),
        };
        self.recorder.recover_session(req).expect("recovered")
    }

    fn list(&self, at: Option<&DatasetHandle>) -> spatial_skp::v0::ListRecoverableResponse {
        let req = ListRecoverableRequest {
            skp: SKP_VERSION.to_string(),
            dataset: at.cloned(),
        };
        self.recorder.list_recoverable(req).expect("listed")
    }
}

fn opacity(value: f64) -> StepIntent {
    StepIntent::StyleSet(StyleSetParams::FillOpacity { value })
}

/// The child: record steps against the fixture, print `told`, abort. `unsaved` records a filter, an
/// opacity and a colour; `project` records an opacity, saves the project into `project/`, and
/// records two more.
fn child(mode: &str, dir: &Path) -> ! {
    let r = run(dir);
    let handle = r.open(dir);
    if mode == "unsaved" {
        let filter = Filter::new("zone = 'civic'", "duckdb-expr/0").expect("dialect");
        r.step(
            &handle,
            StepIntent::FilterApply(FilterApplyParams {
                filter: Some(filter),
            }),
        );
        r.step(&handle, opacity(0.35));
        let value = "#4285f4".to_string();
        r.step(
            &handle,
            StepIntent::StyleSet(StyleSetParams::FillColor { value }),
        );
    } else {
        r.step(&handle, opacity(0.35));
        let hex = |x: f64| HexF64(x).to_hex();
        let wire = json!({
            "skp": SKP_VERSION, "dataset": handle.as_str(),
            "folder": dir.join("project").display().to_string(),
            "workspace": {
                "filter": null, "clauses": [],
                "style": serde_json::from_str::<Value>(STYLE).expect("STYLE is JSON"),
                "view": {"centre": [hex(2_600_000.5), hex(1_200_000.25)], "zoom": hex(-4.5)}
            }
        });
        let req: SaveProjectRequest = serde_json::from_value(wire).expect("the save's request");
        r.projects.save_project(req).expect("saved");
        r.step(&handle, opacity(0.5));
        r.step(&handle, opacity(0.6));
    }
    println!("told");
    std::process::abort();
}

/// Run the test named `test` again as a child in `mode`, and wait for it to abort.
fn crash_in(test: &str, mode: &str, dir: &Path) {
    let spec = FixtureSpec {
        features: 500,
        avg_vertices: 12,
        attributes: AttributeMode::CategoricalZone,
        ..Default::default()
    };
    write_geoparquet(dir.join("data").join("parcels.parquet"), &spec).expect("fixture");
    std::fs::create_dir_all(dir.join("project")).expect("the project folder");
    let exe = std::env::current_exe().expect("the test binary");
    let mut child = Command::new(exe)
        .args(["--exact", test, "--nocapture", "--test-threads=1"])
        .env(CHILD_ENV, format!("{mode}|{}", dir.display()))
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .spawn()
        .expect("the child");
    let started = Instant::now();
    let status = loop {
        if let Some(status) = child.try_wait().expect("wait") {
            break status;
        }
        if started.elapsed() > Duration::from_secs(60) {
            child.kill().expect("kill the child this test started");
            panic!("the child did not end within 60 s");
        }
        std::thread::sleep(Duration::from_millis(50));
    };
    assert!(!status.success(), "the child aborted: {status:?}");
}

/// The scratch folder of test `name`, or, in the child, never returns.
fn scratch(test: &str, mode: &str) -> PathBuf {
    let dir = std::env::temp_dir()
        .join("spatial-ide-recovery-crash-tests")
        .join(test);
    if let Ok(spec) = std::env::var(CHILD_ENV) {
        let (mode, dir) = spec.split_once('|').expect("mode and folder");
        child(mode, Path::new(dir));
    }
    let _ = std::fs::remove_dir_all(&dir);
    crash_in(test, mode, &dir);
    dir
}

fn names(dir: &Path) -> Vec<String> {
    let entries = std::fs::read_dir(dir.join("sessions")).expect("the store");
    let mut names: Vec<String> = entries
        .map(|e| e.expect("entry").file_name().to_string_lossy().into_owned())
        .collect();
    names.sort();
    names
}

fn history(dir: &Path, name: &str) -> PathBuf {
    dir.join("sessions").join(name).join("history.jsonl")
}

fn last_line(dir: &Path, name: &str) -> Value {
    let text = std::fs::read_to_string(history(dir, name)).expect("a history");
    serde_json::from_str(text.lines().last().expect("a line")).expect("a line")
}

/// **K-C1.** The parent holds a record of its own under the same store. Mutation: this run's
/// records listed. Expected failure: this test, at the one entry.
#[test]
fn a_crashed_unsaved_record_is_listed_with_its_dataset_and_time() {
    const TEST: &str = "a_crashed_unsaved_record_is_listed_with_its_dataset_and_time";
    let dir = scratch(TEST, "unsaved");
    let crashed = names(&dir);
    assert_eq!(crashed.len(), 1);
    let at = last_line(&dir, &crashed[0])["step"]["at"].clone();
    let r = run(&dir);
    let handle = r.open(&dir);
    r.step(&handle, opacity(0.9));
    assert_eq!(names(&dir).len(), 2, "this run holds a record of its own");
    let l = r.list(None);
    assert_eq!(l.records.len(), 1);
    let entry = &l.records[0];
    assert_eq!(entry.record, crashed[0]);
    assert_eq!(entry.file_name.as_deref(), Some("parcels.parquet"));
    assert_eq!(
        (entry.steps, entry.data.clone()),
        (3, RecoverableData::Found {})
    );
    assert_eq!(json!(entry.last_step_at), at);
}

/// **K-C3.** A torn line follows the last kept step. Mutation: `parent` null after the adopt.
/// Expected failure: this test, at the new step's parent.
#[test]
fn accepting_truncates_to_the_kept_prefix_and_later_steps_chain() {
    const TEST: &str = "accepting_truncates_to_the_kept_prefix_and_later_steps_chain";
    let dir = scratch(TEST, "unsaved");
    let name = names(&dir).remove(0);
    let kept = std::fs::read(history(&dir, &name)).expect("a history");
    let last = last_line(&dir, &name)["step"]["id"].clone();
    let mut file = std::fs::OpenOptions::new()
        .append(true)
        .open(history(&dir, &name))
        .unwrap();
    file.write_all(br#"{"step":{"id":"ste"#)
        .expect("a torn line");
    drop(file);

    let r = run(&dir);
    let reply = r.recover(&name, None);
    assert!(reply.opened.is_some(), "the kernel opened the data");
    let intents = serde_json::to_value(&reply.steps).unwrap();
    let actions: Vec<_> = intents
        .as_array()
        .unwrap()
        .iter()
        .map(|i| i["action"].clone())
        .collect();
    assert_eq!(
        actions,
        [
            json!("filter.apply"),
            json!("style.set"),
            json!("style.set")
        ]
    );
    r.step(&reply.dataset, opacity(0.77));
    // The run ends without `end_session`, which frees the lock: on Windows a held lock stops a
    // read through any other handle.
    drop((reply, r));
    let bytes = std::fs::read(history(&dir, &name)).unwrap();
    assert!(bytes.starts_with(&kept), "the kept steps are as they were");
    let tail = serde_json::from_slice::<Value>(&bytes[kept.len()..]);
    let tail = tail.expect("one whole line follows the kept steps, so the torn one was cut");
    assert_eq!(tail["step"]["parent"], last);
}

/// **K-C19.** A project's record at its open: the open is bound, and the next step continues the
/// record. Mutation: the open not bound at adopt. Expected failure: this test, at the store's
/// names.
#[test]
fn recovering_at_a_projects_open_binds_the_open_and_its_next_step_continues_that_record() {
    const TEST: &str =
        "recovering_at_a_projects_open_binds_the_open_and_its_next_step_continues_that_record";
    let dir = scratch(TEST, "project");
    let hex = names(&dir).remove(0);
    let last = last_line(&dir, &hex)["step"]["id"].clone();
    let r = run(&dir);
    let wire = json!({
        "skp": SKP_VERSION, "folder": dir.join("project").display().to_string(),
        "cancel_key": "k", "answer": null, "relink": null, "set_aside_file_id": false
    });
    let req: OpenProjectRequest = serde_json::from_value(wire).expect("the request");
    let reply = r.projects.open_project_command(req).expect("reopened");
    let opened = serde_json::to_value(reply).expect("the reply serializes");
    let handle: DatasetHandle =
        serde_json::from_value(opened["opened"]["dataset"].clone()).expect("a handle");
    assert!(dir.join("project").join(PROJECT_FILE_NAME).exists());
    let l = r.list(Some(&handle));
    assert_eq!(
        l.records
            .iter()
            .map(|e| e.record.as_str())
            .collect::<Vec<_>>(),
        [hex.as_str()]
    );
    let reply = r.recover(&hex, Some(&handle));
    assert_eq!(
        (reply.dataset.as_str(), reply.opened.is_none()),
        (handle.as_str(), true)
    );
    r.step(&handle, opacity(0.99));
    assert_eq!(names(&dir), [hex.as_str()], "no record of its own was made");
    drop((reply, r)); // frees the lock: on Windows a held lock stops a read through another handle
    assert_eq!(last_line(&dir, &hex)["step"]["parent"], last);
}
