// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **K8** (`kernel/B2-1B-RECORDING-PREREGISTRATION.md` §4): a process that aborts after
//! `record_step` has replied loses none of the steps it was told were recorded. The test runs a
//! child copy of its own binary, which records five steps against a real open, prints one line per
//! reply, and calls `process::abort` (no destructor runs and no buffer is flushed on the way out).
//! The parent waits for the child with a timeout of 60 s, reads the store back, and finds the lock
//! free.

mod watch_support;

use std::io::{BufRead, BufReader};
use std::path::{Path, PathBuf};
use std::process::{Command, Stdio};
use std::sync::Arc;
use std::time::{Duration, Instant};

use spatial_engine::fixture::{write_geoparquet, AttributeMode, FixtureSpec};
use spatial_kernel::session_history::{recover, StepRecorder};
use spatial_kernel::skp::{session_end_channel, SkpHost, StreamRegistry};
use spatial_kernel::Catalog;
use spatial_skp::v0::{
    Filter, FilterApplyParams, OpenDatasetRequest, OutlineWidthValue, PxUnit, RecordStepRequest,
    StepIntent, StyleSetParams, SKP_VERSION,
};

const TEST: &str = "an_aborted_process_keeps_every_step_it_was_told_was_recorded";
const CHILD_ENV: &str = "SPATIAL_IDE_K8_CHILD_STORE";
const STEPS: usize = 5;

/// The child: open the fixture, record `STEPS` steps, print `told:<n>` after each reply, abort.
fn child(store: PathBuf, fixture: &Path) -> ! {
    let (events, _) = session_end_channel();
    let arm = watch_support::no_watch_arm();
    let host = Arc::new(SkpHost::new(
        Arc::new(Catalog::new()),
        StreamRegistry::new(),
        arm,
        events,
    ));
    let open = OpenDatasetRequest {
        skp: SKP_VERSION.to_string(),
        path: fixture.display().to_string(),
        cancel_key: "k".to_string(),
        crs_assertion: None,
        identity: None,
    };
    let dataset = host.open_dataset(open).expect("open").dataset;
    let recorder = StepRecorder::new(store, host);
    let filter = Filter::new("zone = 'civic'", "duckdb-expr/0").expect("dialect");
    let width = OutlineWidthValue {
        value: 2.5,
        unit: PxUnit::Px,
    };
    let intents = [
        StepIntent::FilterApply(FilterApplyParams {
            filter: Some(filter),
        }),
        StepIntent::StyleSet(StyleSetParams::FillOpacity { value: 0.35 }),
        StepIntent::StyleSet(StyleSetParams::FillColor {
            value: "#4285f4".to_string(),
        }),
        StepIntent::StyleSet(StyleSetParams::OutlineWidth { value: width }),
        StepIntent::FilterApply(FilterApplyParams { filter: None }),
    ];
    for (n, intent) in intents.into_iter().enumerate() {
        let req = RecordStepRequest {
            skp: SKP_VERSION.to_string(),
            dataset: dataset.clone(),
            intent,
        };
        recorder.record_step(req).expect("recorded");
        println!("told:{}", n + 1);
    }
    std::process::abort();
}

#[test]
fn an_aborted_process_keeps_every_step_it_was_told_was_recorded() {
    let dir = std::env::temp_dir()
        .join("spatial-ide-session-history-tests")
        .join("k8");
    let fixture = dir.join("f1.parquet");
    if let Ok(store) = std::env::var(CHILD_ENV) {
        child(PathBuf::from(store), &fixture);
    }
    let _ = std::fs::remove_dir_all(&dir);
    std::fs::create_dir_all(&dir).expect("scratch folder");
    let spec = FixtureSpec {
        features: 500,
        avg_vertices: 12,
        attributes: AttributeMode::CategoricalZone,
        ..Default::default()
    };
    write_geoparquet(&fixture, &spec).expect("fixture");

    let store = dir.join("store");
    let exe = std::env::current_exe().expect("the test binary");
    let mut child = Command::new(exe)
        .args(["--exact", TEST, "--nocapture", "--test-threads=1"])
        .env(CHILD_ENV, &store)
        .stdout(Stdio::piped())
        .stderr(Stdio::null())
        .spawn()
        .expect("the child");
    let out = child.stdout.take().expect("piped");
    let told = std::thread::spawn(move || {
        let lines = BufReader::new(out).lines().map_while(Result::ok);
        lines.filter(|l| l.contains("told:")).count()
    });
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
    let told = told.join().expect("reader");
    assert!(!status.success(), "the child aborted: {status:?}");
    assert_eq!(told, STEPS, "the child was told every step was recorded");

    let record: Vec<PathBuf> = std::fs::read_dir(&store)
        .expect("the store")
        .map(|e| e.expect("entry").path())
        .collect();
    assert_eq!(record.len(), 1);
    let history = record[0].join("history.jsonl");
    let free = std::fs::File::options()
        .read(true)
        .write(true)
        .open(&history)
        .expect("open");
    assert!(
        free.try_lock().is_ok(),
        "the operating system freed the dead process's lock"
    );
    drop(free);
    let got = recover(&record[0]);
    assert!(got.failure.is_none(), "{:?}", got.failure);
    assert_eq!(
        got.lines.len(),
        1 + STEPS,
        "the header and every step the child was told of"
    );
}
