// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **The recovery offer, Part 1** (`governance/forms/kernel/B2-1C-STEP-3-RECOVERY-OFFER-PREREGISTRATION.md`
//! §4's K-C rows as Amendments 2 to 10 leave them), from the real shape: a real `SkpHost`,
//! `StepRecorder` and `Projects` on one scratch store, a record left by a run that ended without
//! `end_session` (its recorder is dropped, which frees the lock as a crash does), and each command
//! called through the recorder with the wire types it takes. `recovery_crash.rs` holds the rows
//! that need a process that aborts. Nothing here times anything.

mod watch_support;

use std::fs::OpenOptions;
use std::path::{Path, PathBuf};
use std::sync::atomic::{AtomicU64, Ordering};
use std::sync::Arc;

use serde_json::{json, Value};
use spatial_engine::fixture::{write_geoparquet, AttributeMode, FixtureSpec};
use spatial_kernel::dataset_ref::DatasetUri;
use spatial_kernel::project::store::locations_to_bytes;
use spatial_kernel::project::{Projects, PROJECT_FILE_NAME};
use spatial_kernel::session_history::StepRecorder;
use spatial_kernel::skp::{session_end_channel, SkpHost, StreamRegistry};
use spatial_kernel::Catalog;
use spatial_skp::v0::{
    CannotBeOfferedReason, DatasetHandle, DiscardRecoverableRequest, DiscardRecoverableResponse,
    HexF64, ListRecoverableRequest, ListRecoverableResponse, OpenDatasetRequest,
    OpenProjectRequest, RecordStepRequest, RecoverSessionRequest, RecoverSessionResponse,
    RecoverableData, SaveProjectRequest, SkpError, StepIntent, StyleSetParams, SKP_VERSION,
};

const STYLE: &str = r##"{"style_version":1,"layer":{"geometry":"polygon","fill_color":{"literal":"#4285f4"},"fill_opacity":{"literal":0.35},"outline_color":{"literal":"#000000"},"outline_width":{"literal":1.5}}}"##;
const HISTORY: &str = "history.jsonl";
const LOCATIONS: &str = "locations.json";

struct Site {
    dir: PathBuf,
    /// The session store's root, where records are kept.
    root: PathBuf,
    /// The project folder, which exists.
    folder: PathBuf,
    data: PathBuf,
}

/// A scratch site named for the test, with F1 (500 polygons, declared LV95, a `zone` column)
/// written at `data`.
fn site(test: &str) -> Site {
    let dir = std::env::temp_dir()
        .join("spatial-ide-recovery-tests")
        .join(test);
    let _ = std::fs::remove_dir_all(&dir);
    let (folder, data) = (
        dir.join("project"),
        dir.join("data").join("parcels.parquet"),
    );
    std::fs::create_dir_all(&folder).expect("the project folder");
    write_f1(&data, 1);
    Site {
        root: dir.join("sessions"),
        dir,
        folder,
        data,
    }
}

fn write_f1(path: &Path, seed: u64) {
    std::fs::create_dir_all(path.parent().expect("a parent")).expect("the data folder");
    let spec = FixtureSpec {
        features: 500,
        avg_vertices: 12,
        seed,
        attributes: AttributeMode::CategoricalZone,
        ..Default::default()
    };
    write_geoparquet(path, &spec).expect("fixture");
}

/// One run of the application: a host, the recorder on the site's store, and the project store.
struct Run {
    host: Arc<SkpHost>,
    recorder: Arc<StepRecorder>,
    projects: Projects,
}

fn run(site: &Site) -> Run {
    let host = Arc::new(SkpHost::new(
        Arc::new(Catalog::new()),
        StreamRegistry::new(),
        watch_support::no_watch_arm(),
        session_end_channel().0,
    ));
    let recorder = Arc::new(StepRecorder::new(site.root.clone(), host.clone()));
    let projects = Projects::new(site.dir.join("machine"), recorder.clone());
    Run {
        host,
        recorder,
        projects,
    }
}

impl Run {
    fn open(&self, data: &Path) -> DatasetHandle {
        let req = OpenDatasetRequest {
            skp: SKP_VERSION.to_string(),
            path: data.display().to_string(),
            cancel_key: "k".to_string(),
            crs_assertion: None,
            identity: None,
            set_aside_file_id: false,
        };
        self.host.open_dataset(req).expect("open").dataset
    }

    fn step(&self, handle: &DatasetHandle, value: f64) {
        let req = RecordStepRequest {
            skp: SKP_VERSION.to_string(),
            dataset: handle.clone(),
            intent: StepIntent::StyleSet(StyleSetParams::FillOpacity { value }),
        };
        self.recorder.record_step(req).expect("recorded");
    }

    /// A first save of `handle` into `folder`: the project's identity.
    fn save(&self, handle: &DatasetHandle, folder: &Path) -> String {
        let hex = |x: f64| HexF64(x).to_hex();
        let wire = json!({
            "skp": SKP_VERSION, "dataset": handle.as_str(), "folder": folder.display().to_string(),
            "workspace": {
                "filter": null, "clauses": [],
                "style": serde_json::from_str::<Value>(STYLE).expect("STYLE is JSON"),
                "view": {"centre": [hex(2_600_000.5), hex(1_200_000.25)], "zoom": hex(-4.5)}
            }
        });
        let req: SaveProjectRequest = serde_json::from_value(wire).expect("the save's request");
        self.projects
            .save_project(req)
            .expect("saved")
            .project
            .as_str()
            .to_string()
    }

    /// One `open_project` call at `folder`: the reply as JSON.
    fn reopen(&self, folder: &Path, answer: Value) -> Value {
        let wire = json!({
            "skp": SKP_VERSION, "folder": folder.display().to_string(), "cancel_key": "k",
            "answer": answer, "relink": null, "set_aside_file_id": false
        });
        let req: OpenProjectRequest = serde_json::from_value(wire).expect("the request");
        let reply = self.projects.open_project_command(req).expect("reopened");
        serde_json::to_value(&reply).expect("the reply serializes")
    }

    /// The project at `folder` reopened: the open's handle.
    fn reopened(&self, folder: &Path) -> DatasetHandle {
        let reply = self.reopen(folder, Value::Null);
        serde_json::from_value(reply["opened"]["dataset"].clone()).expect("a handle")
    }

    fn list(&self, at: Option<&DatasetHandle>) -> ListRecoverableResponse {
        let req = ListRecoverableRequest {
            skp: SKP_VERSION.to_string(),
            dataset: at.cloned(),
        };
        self.recorder.list_recoverable(req).expect("listed")
    }

    fn recover(
        &self,
        record: &str,
        at: Option<&DatasetHandle>,
    ) -> Result<RecoverSessionResponse, SkpError> {
        self.recorder.recover_session(RecoverSessionRequest {
            skp: SKP_VERSION.to_string(),
            record: record.to_string(),
            cancel_key: "recover".to_string(),
            dataset: at.cloned(),
        })
    }

    fn discard(&self, record: &str) -> Result<DiscardRecoverableResponse, SkpError> {
        self.recorder
            .discard_recoverable(DiscardRecoverableRequest {
                skp: SKP_VERSION.to_string(),
                record: record.to_string(),
            })
    }
}

fn names(root: &Path) -> Vec<String> {
    let Ok(entries) = std::fs::read_dir(root) else {
        return Vec::new();
    };
    let mut names: Vec<String> = entries
        .map(|e| e.expect("entry").file_name().to_string_lossy().into_owned())
        .collect();
    names.sort();
    names
}

fn listed(l: &ListRecoverableResponse) -> Vec<&str> {
    l.records.iter().map(|r| r.record.as_str()).collect()
}

/// A run that records `steps` steps against the site's data and ends without `end_session`: the
/// name of the record it left.
fn crashed(site: &Site, steps: u32) -> String {
    let before = names(&site.root);
    let r = run(site);
    let handle = r.open(&site.data);
    for n in 0..steps {
        r.step(&handle, 0.1 + f64::from(n) / 100.0);
    }
    drop((handle, r));
    let after = names(&site.root);
    after
        .into_iter()
        .find(|n| !before.contains(n))
        .expect("a new record")
}

/// A run that records `before` steps, saves the project into the site's folder, records `after`
/// more and ends without `end_session`: the project's record name, its 32 hex.
fn saved(site: &Site, before: u32, after: u32) -> String {
    let r = run(site);
    let handle = r.open(&site.data);
    for _ in 0..before {
        r.step(&handle, 0.35);
    }
    let project = r.save(&handle, &site.folder);
    for n in 0..after {
        r.step(&handle, 0.5 + f64::from(n) / 100.0);
    }
    drop((handle, r));
    let hex = project
        .strip_prefix("spatial://project/")
        .expect("an identity");
    hex.to_string()
}

fn lines(site: &Site, name: &str) -> Vec<String> {
    let text = std::fs::read_to_string(site.root.join(name).join(HISTORY)).expect("a history");
    text.lines().map(str::to_string).collect()
}

fn file(site: &Site, name: &str, which: &str) -> Vec<u8> {
    std::fs::read(site.root.join(name).join(which)).unwrap_or_default()
}

/// A folder named `name` holding `lines` as its history (when given) and `locations`.
fn plant_as(site: &Site, name: &str, lines: Option<&[String]>, locations: &[u8]) -> String {
    let dir = site.root.join(name);
    std::fs::create_dir_all(&dir).expect("a record folder");
    std::fs::write(dir.join(LOCATIONS), locations).expect("locations");
    if let Some(lines) = lines {
        std::fs::write(
            dir.join(HISTORY),
            lines.iter().map(|l| format!("{l}\n")).collect::<String>(),
        )
        .expect("a history");
    }
    name.to_string()
}

/// An `unsaved-` record of its own.
fn plant(site: &Site, lines: &[String], locations: &[u8]) -> String {
    static NEXT: AtomicU64 = AtomicU64::new(0xabc);
    let name = format!("unsaved-{:032x}", NEXT.fetch_add(1, Ordering::Relaxed));
    plant_as(site, &name, Some(lines), locations)
}

/// A `<hex>` folder that holds the same two files as the record `name`: what a first save leaves
/// when it fails to remove the `unsaved-` record.
fn twin(site: &Site, name: &str) -> String {
    let hex = format!("{:032x}", 0xfedc_ba98_u64);
    plant_as(site, &hex, None, &file(site, name, LOCATIONS));
    std::fs::write(
        site.root.join(&hex).join(HISTORY),
        file(site, name, HISTORY),
    )
    .expect("twin");
    hex
}

/// A handle the test holds on a history, locked, as another run holds its own.
fn held(site: &Site, name: &str) -> std::fs::File {
    let file = OpenOptions::new()
        .read(true)
        .write(true)
        .open(site.root.join(name).join(HISTORY))
        .expect("the history");
    file.try_lock().expect("the lock");
    file
}

fn code<T: std::fmt::Debug>(result: Result<T, SkpError>) -> String {
    result.expect_err("a refusal").code
}

/// **K-C2.** Mutation: removal skipped. Expected failure: this test, at the folder's removal.
#[test]
fn declining_removes_the_record() {
    let s = site("kc2");
    let name = crashed(&s, 2);
    let r = run(&s);
    assert_eq!(listed(&r.list(None)), [name.as_str()]);
    r.discard(&name).expect("discarded");
    assert!(!s.root.join(&name).exists(), "the folder is gone");
    assert!(r.list(None).records.is_empty());
}

/// **K-C4.** Mutation: a project's record listed at a start. Expected failure: this test, at the
/// start's list.
#[test]
fn a_projects_record_is_offered_at_its_open_not_at_start() {
    let s = site("kc4");
    let hex = saved(&s, 1, 2);
    let r = run(&s);
    assert!(
        r.list(None).records.is_empty(),
        "a start offers no project's record"
    );
    let handle = r.reopened(&s.folder);
    let l = r.list(Some(&handle));
    assert_eq!(listed(&l), [hex.as_str()]);
    let entry = &l.records[0];
    assert_eq!(
        (entry.steps, entry.file_name.as_deref()),
        (3, Some("parcels.parquet"))
    );
    assert!(entry.last_step_at.is_some());
}

/// **K-C5.** Mutation: the state always `found`. Expected failure: this test, at the second list.
#[test]
fn the_offer_states_found_or_not_found_data() {
    let s = site("kc5");
    crashed(&s, 1);
    let r = run(&s);
    assert_eq!(r.list(None).records[0].data, RecoverableData::Found {});
    std::fs::remove_file(&s.data).expect("the data removed");
    assert_eq!(r.list(None).records[0].data, RecoverableData::NotFound {});
}

/// **K-C6.** The lock is held by a handle the test opens and locks, on a history with a header and
/// two steps. Mutation: the lock probe removed, so the listing reads through its own handle (where
/// Windows refuses the read, the record is listed `cannot-be-offered`). Expected failure: this test,
/// at the first list.
#[test]
fn a_locked_record_is_never_offered() {
    let s = site("kc6");
    let name = crashed(&s, 2);
    let holder = held(&s, &name);
    let r = run(&s);
    assert!(
        r.list(None).records.is_empty(),
        "the record is in no state of the list"
    );
    assert_eq!(
        code(r.recover(&name, None)),
        "skp.recoverable_record_locked"
    );
    assert_eq!(code(r.discard(&name)), "skp.recoverable_record_locked");
    drop(holder);
    assert_eq!(listed(&r.list(None)), [name.as_str()]);
}

/// **K-C7.** Mutation: no dedupe. Expected failure: this test, at the start's list.
#[test]
fn an_unsaved_record_moved_to_a_project_record_is_not_offered_twice() {
    let s = site("kc7");
    let name = crashed(&s, 2);
    twin(&s, &name);
    let r = run(&s);
    assert!(
        r.list(None).records.is_empty(),
        "the moved record is offered at its project's open"
    );
    assert!(
        s.root.join(&name).join(HISTORY).exists(),
        "the list removes nothing"
    );
}

/// **K-C9**, in its first form (Part 1). Mutation: the mark not considered. Expected failure: this
/// test, at the list at the open.
#[test]
fn a_project_record_with_nothing_after_its_saved_mark_is_not_offered() {
    let s = site("kc9");
    let hex = saved(&s, 1, 0);
    let last = lines(&s, &hex).pop().expect("a last line");
    assert!(
        last.starts_with(r#"{"mark":{"kind":"saved-here""#),
        "{last}"
    );
    let r = run(&s);
    let handle = r.reopened(&s.folder);
    assert!(r.list(Some(&handle)).records.is_empty());
    assert!(s.root.join(&hex).join(HISTORY).exists(), "the folder stays");
}

/// Three copies of the record `name`, each broken one way: no step, a later version, and a
/// `locations.json` the reader refuses.
fn broken(s: &Site, name: &str) -> [String; 3] {
    let (all, locations) = (lines(s, name), file(s, name, LOCATIONS));
    let later = all[0].replace("\"actions\":2", "\"actions\":3");
    let mut later_lines = vec![later];
    later_lines.extend_from_slice(&all[1..]);
    [
        plant(s, &all[..1], &locations),
        plant(s, &later_lines, &locations),
        plant(s, &all, b"{}\n"),
    ]
}

/// **K-C10.** Mutation: such a record removed. Expected failure: this test, at the files kept.
#[test]
fn a_record_that_cannot_be_offered_is_left_in_place() {
    let s = site("kc10");
    let name = crashed(&s, 2);
    let three = broken(&s, &name);
    let snapshot = |s: &Site| -> Vec<Vec<u8>> {
        three
            .iter()
            .flat_map(|n| [file(s, n, HISTORY), file(s, n, LOCATIONS)])
            .collect()
    };
    let before = snapshot(&s);
    assert!(before.iter().all(|b| !b.is_empty()));
    let r = run(&s);
    assert_eq!(r.list(None).records.len(), 4);
    assert_eq!(snapshot(&s), before);
}

/// **K-C15.** Mutation: such a record not listed. Expected failure: this test, at the entries.
#[test]
fn a_record_that_cannot_be_offered_is_listed_with_discard_only_and_refused_at_recover() {
    let s = site("kc15");
    let name = crashed(&s, 2);
    let [no_step, later, refused] = broken(&s, &name);
    let r = run(&s);
    let l = r.list(None);
    for (record, reason, file_name) in [
        (
            &no_step,
            CannotBeOfferedReason::NoStep,
            Some("parcels.parquet"),
        ),
        (
            &later,
            CannotBeOfferedReason::LaterVersion,
            Some("parcels.parquet"),
        ),
        (&refused, CannotBeOfferedReason::LocationsRefused, None),
    ] {
        let entry = l
            .records
            .iter()
            .find(|e| &e.record == record)
            .expect("listed");
        let data = RecoverableData::CannotBeOffered { reason };
        assert_eq!(
            (&entry.data, entry.file_name.as_deref()),
            (&data, file_name),
            "{record}"
        );
        assert_eq!(
            (entry.steps, entry.last_step_at.as_ref()),
            (0, None),
            "{record}"
        );
        let e = r.recover(record, None).expect_err("refused");
        assert_eq!(e.code, "skp.recoverable_record_refused", "{record}");
        assert_eq!(e.fields["record"], *record);
        assert!(e.fields.contains_key("file") && e.fields.contains_key("rule"));
    }
}

/// **K-C11.** A record planted outside the store is named by the two ways to reach it. Mutation:
/// validation skipped (`..\x`). Expected failure: this test, at the discard of `..\x`.
#[test]
fn a_record_name_outside_the_two_shapes_is_refused() {
    let s = site("kc11");
    let name = crashed(&s, 1);
    let outside = s.dir.join("x");
    std::fs::create_dir_all(&outside).expect("a folder");
    std::fs::write(outside.join(HISTORY), file(&s, &name, HISTORY)).expect("a history");
    std::fs::write(outside.join(LOCATIONS), file(&s, &name, LOCATIONS)).expect("locations");
    let r = run(&s);
    let (short, long) = (&name[..name.len() - 1], format!("{name}0"));
    let bad = [
        "..\\x",
        "../x",
        "x",
        "",
        short,
        &long,
        &name.to_uppercase(),
        "unsaved-xyz",
    ];
    for record in bad {
        assert_eq!(
            code(r.discard(record)),
            "skp.recoverable_record_unknown",
            "{record:?}"
        );
        assert_eq!(
            code(r.recover(record, None)),
            "skp.recoverable_record_unknown",
            "{record:?}"
        );
    }
    assert!(outside.join(HISTORY).exists() && outside.join(LOCATIONS).exists());
}

/// **K-C12.** Mutation: the check that the open holds no record removed. Expected failure: this
/// test, at the refusal.
#[test]
fn recovering_into_an_open_that_has_a_step_is_refused() {
    let s = site("kc12");
    let hex = saved(&s, 1, 2);
    let before = file(&s, &hex, HISTORY);
    let r = run(&s);
    let handle = r.reopened(&s.folder);
    r.step(&handle, 0.9);
    assert_eq!(
        code(r.recover(&hex, Some(&handle))),
        "skp.recoverable_record_not_for_this_open"
    );
    assert_eq!(file(&s, &hex, HISTORY), before);
    assert_eq!(
        listed(&r.list(Some(&handle))),
        [hex.as_str()],
        "its lock is released"
    );
}

/// **K-C13.** Mutation: the adopted record not pushed to the recorder's state (this fails K-C3 as
/// well). Expected failure: this test, at the folder's removal.
#[test]
fn a_normal_end_after_recovery_clears_the_record() {
    let s = site("kc13");
    let name = crashed(&s, 2);
    let r = run(&s);
    r.recover(&name, None).expect("recovered");
    r.recorder.end_session();
    assert!(names(&s.root).is_empty(), "{:?}", names(&s.root));
}

/// **K-C14.** The data's file is replaced between the crash and the accept. Mutation: `check`
/// skipped at accept. Expected failure: this test, at `observed`.
#[test]
fn accepting_runs_the_full_check_and_returns_its_differences() {
    let s = site("kc14");
    let name = crashed(&s, 2);
    write_f1(&s.data, 2);
    let reply = run(&s).recover(&name, None).expect("recovered");
    let opened = serde_json::to_value(reply.opened.expect("the kernel opened the data")).unwrap();
    assert!(
        !opened["check"]["observed"].as_array().unwrap().is_empty(),
        "{opened}"
    );
}

/// **K-C16.** Sixty-five `<hex>` histories sort before the `unsaved-` record. Mutation: every
/// examined folder, `<hex>` included, counted toward `MAX_RECOVERABLE_RECORDS`. Expected failure:
/// this test, at the list.
#[test]
fn unsaved_records_are_listed_beside_more_than_64_project_records() {
    let s = site("kc16");
    let name = crashed(&s, 1);
    for n in 0..65u64 {
        plant_as(&s, &format!("{:032x}", n + 1), Some(&lines(&s, &name)), b"");
    }
    let l = run(&s).list(None);
    assert_eq!((listed(&l), l.more), (vec![name.as_str()], false));
}

/// **K-C17.** Mutation: the state taken from `SourceDescriptor::of`. Expected failure: this test,
/// at `found`.
#[test]
fn the_listing_states_found_from_metadata_alone() {
    let s = site("kc17");
    crashed(&s, 1);
    std::fs::write(&s.data, b"").expect("the data replaced by an empty file");
    assert_eq!(
        run(&s).list(None).records[0].data,
        RecoverableData::Found {}
    );
}

/// A step line's `data.dataset`, and the header's dataset.
fn dataset_of(line: &str) -> String {
    let v: Value = serde_json::from_str(line).expect("a line");
    match v.get("step") {
        Some(step) => step["data"]["dataset"].as_str().expect("text").to_string(),
        None => v["datasets"][0]["resource"]["logical_uri"]
            .as_str()
            .expect("text")
            .to_string(),
    }
}

/// **K-C18.** Mutation: the open's identity not set at adopt. Expected failure: this test, at the
/// new step's dataset.
#[test]
fn a_step_after_recovery_carries_the_headers_dataset_identity() {
    let s = site("kc18");
    let name = crashed(&s, 2);
    let header = dataset_of(&lines(&s, &name)[0]);
    let r = run(&s);
    let reply = r.recover(&name, None).expect("recovered");
    r.step(&reply.dataset, 0.77);
    let last = lines(&s, &name).pop().expect("a last line");
    assert_eq!(dataset_of(&last), header);
}

/// **K-C20.** The other project is a copy, so only the open's project differs. Mutation: `reopened_as`
/// not compared. Expected failure: this test, at the refusal.
#[test]
fn recovering_a_projects_record_into_an_open_of_another_project_is_refused() {
    let s = site("kc20");
    let hex = saved(&s, 1, 2);
    let copy = s.dir.join("copy");
    std::fs::create_dir_all(&copy).expect("a folder");
    std::fs::copy(
        s.folder.join(PROJECT_FILE_NAME),
        copy.join(PROJECT_FILE_NAME),
    )
    .expect("copied");
    let before = file(&s, &hex, HISTORY);
    let r = run(&s);
    let reply = r.reopen(&copy, Value::Null);
    assert!(reply.get("question").is_some(), "{reply}");
    let reply = r.reopen(&copy, json!("copy"));
    let handle: DatasetHandle = serde_json::from_value(reply["opened"]["dataset"].clone()).unwrap();
    assert!(r.list(Some(&handle)).records.is_empty());
    assert_eq!(
        code(r.recover(&hex, Some(&handle))),
        "skp.recoverable_record_not_for_this_open"
    );
    assert_eq!(file(&s, &hex, HISTORY), before);
}

/// **K-C21.** Mutation: the held check moved after the lock probe. Expected failure: this test, at
/// the second recover.
#[test]
fn a_second_recover_of_a_record_this_run_holds_is_refused_as_unknown() {
    let s = site("kc21");
    let name = crashed(&s, 2);
    let r = run(&s);
    r.recover(&name, None).expect("recovered");
    assert_eq!(
        code(r.recover(&name, None)),
        "skp.recoverable_record_unknown"
    );
    assert_eq!(code(r.discard(&name)), "skp.recoverable_record_unknown");
}

/// **K-C22.** Mutation: the history handle kept after the refused open. Expected failure: this
/// test, at the second list.
#[test]
fn a_refused_open_at_accept_leaves_the_record_byte_for_byte_and_listed() {
    let s = site("kc22");
    let name = crashed(&s, 2);
    let before = (file(&s, &name, HISTORY), file(&s, &name, LOCATIONS));
    std::fs::remove_file(&s.data).expect("the data removed");
    let r = run(&s);
    let refused = code(r.recover(&name, None));
    assert!(refused.starts_with("engine."), "{refused}");
    assert_eq!(
        (file(&s, &name, HISTORY), file(&s, &name, LOCATIONS)),
        before
    );
    assert!(r.host.catalog().names().is_empty());
    let l = r.list(None);
    assert_eq!(listed(&l), [name.as_str()]);
    assert_eq!(l.records[0].data, RecoverableData::NotFound {});
}

/// **K-C23.** 256 `<hex>` folders that hold a `locations.json` are within the dedupe's bound, and a
/// 257th is past it. Mutation: the dedupe's bound not applied. Expected failure: this test, at the
/// second list.
#[test]
fn past_the_dedupe_bound_no_unsaved_record_is_listed_and_more_is_set() {
    let s = site("kc23");
    let name = crashed(&s, 1);
    let other = |n: u64| {
        let bytes = locations_to_bytes(&DatasetUri::mint(), &s.data).expect("locations");
        plant_as(&s, &format!("{:032x}", n + 1), None, &bytes);
    };
    (0..256).for_each(other);
    let r = run(&s);
    let l = r.list(None);
    assert_eq!((listed(&l), l.more), (vec![name.as_str()], false));
    other(256);
    let l = r.list(None);
    assert_eq!((l.records.len(), l.more), (0, true));
    assert!(s.root.join(&name).join(HISTORY).exists());
}

/// **K-C24.** Mutation: the empty-history check removed. Expected failure: this test, at the list.
#[test]
fn a_folder_with_no_or_an_empty_history_is_not_listed() {
    let s = site("kc24");
    let name = crashed(&s, 1);
    let locations = file(&s, &name, LOCATIONS);
    let none = plant_as(&s, &format!("unsaved-{:032x}", 1), None, &locations);
    let empty = plant_as(&s, &format!("unsaved-{:032x}", 2), None, &locations);
    std::fs::write(s.root.join(&empty).join(HISTORY), b"").expect("an empty history");
    let r = run(&s);
    assert_eq!(listed(&r.list(None)), [name.as_str()]);
    assert!(s.root.join(&none).exists() && s.root.join(&empty).join(HISTORY).exists());
    assert_eq!(file(&s, &empty, HISTORY), b"");
}

/// The record `name`'s locations for another dataset, as a `<hex>` folder another run holds.
fn other_data(s: &Site, name: &str) -> (String, std::fs::File) {
    let hex = format!("{:032x}", 0x1234_u64);
    let bytes = locations_to_bytes(&DatasetUri::mint(), &s.data).expect("locations");
    plant_as(s, &hex, Some(&lines(s, name)), &bytes);
    let holder = held(s, &hex);
    (hex, holder)
}

/// **K-C25.** Mutation: every held `<hex>` history withholds every taken record. Expected failure:
/// this test, at the list.
#[test]
fn a_project_record_another_run_holds_for_other_data_withholds_no_unsaved_offer() {
    let s = site("kc25");
    let name = crashed(&s, 1);
    let (_hex, _holder) = other_data(&s, &name);
    let l = run(&s).list(None);
    assert_eq!((listed(&l), l.more), (vec![name.as_str()], false));
}

/// **K-C26.** A live run holds the twin of the first of two records. Mutation: a candidate a lock
/// refuses read as not a twin. Expected failure: this test, at the list.
#[test]
fn an_unsaved_record_whose_twin_a_live_run_holds_is_withheld_alone_and_more_is_set() {
    let s = site("kc26");
    let (first, second) = (crashed(&s, 1), crashed(&s, 1));
    let hex = twin(&s, &first);
    let _holder = held(&s, &hex);
    let l = run(&s).list(None);
    assert_eq!((listed(&l), l.more), (vec![second.as_str()], true));
}

/// A project's record rewritten as the lines of a history that holds a `restored` mark: the
/// header, s1, s2, the mark to s1, s3 after it, and (when `saved`) a `saved-here` mark after s3.
fn restored(s: &Site, hex: &str, saved: bool) -> Vec<String> {
    let all = lines(s, hex);
    let step_ids: Vec<String> = all
        .iter()
        .filter_map(|l| serde_json::from_str::<Value>(l).ok())
        .filter_map(|v| v["step"]["id"].as_str().map(str::to_string))
        .collect();
    let [s1, s2, s3] = [&step_ids[0], &step_ids[1], &step_ids[2]];
    let steps: Vec<&String> = all.iter().filter(|l| l.starts_with("{\"step\":")).collect();
    let at = "2026-11-28T10:00:00Z";
    let mark = |kind: &str, key: &str, id: &str| {
        format!(r#"{{"mark":{{"kind":"{kind}","{key}":"{id}","at":"{at}"}}}}"#)
    };
    let third = steps[2].replacen(
        &format!("\"parent\":\"{s2}\""),
        &format!("\"parent\":\"{s1}\""),
        1,
    );
    let mut out = vec![all[0].clone(), steps[0].clone(), steps[1].clone()];
    out.extend([mark("restored", "to", s1), third]);
    if saved {
        out.push(mark("saved-here", "after", s3));
    }
    out
}

/// **K-C36.** At an open, a project's record that holds a `restored` mark is listed
/// `later-version` and stays, though nothing follows its last `saved-here` mark; the same lines
/// without that mark, as an `unsaved-` record at a start, are listed `later-version`. Mutation:
/// `restored` marks not considered (the project's record is then not listed, and the `unsaved-`
/// record is listed with its steps). Expected failure: this test, at the first entry.
#[test]
fn a_record_holding_a_restored_mark_is_listed_with_discard_only() {
    let s = site("kc36");
    let hex = saved(&s, 3, 0);
    let (with_mark, without_mark) = (restored(&s, &hex, true), restored(&s, &hex, false));
    let locations = file(&s, &hex, LOCATIONS);
    let kept = plant_as(&s, &hex, Some(&with_mark), &locations);
    let unsaved = plant(&s, &without_mark, &locations);
    let r = run(&s);
    let handle = r.reopened(&s.folder);
    let later = RecoverableData::CannotBeOffered {
        reason: CannotBeOfferedReason::LaterVersion,
    };
    let l = r.list(Some(&handle));
    assert_eq!(
        (listed(&l), &l.records[0].data),
        (vec![kept.as_str()], &later)
    );
    assert!(s.root.join(&kept).join(HISTORY).exists());
    // The two records hold the same first step, so the project's is removed before the start.
    std::fs::remove_dir_all(s.root.join(&kept)).expect("the project's record removed");
    let l = r.list(None);
    assert_eq!(
        (listed(&l), &l.records[0].data),
        (vec![unsaved.as_str()], &later)
    );
}

/// **K-C37.** A live run holds the twin of the record. Mutation: step 3a skipped. Expected failure:
/// this test, at the refusal.
#[test]
fn recovering_an_unsaved_record_whose_twin_a_live_run_holds_is_refused_as_locked() {
    let s = site("kc37");
    let name = crashed(&s, 2);
    let hex = twin(&s, &name);
    let _holder = held(&s, &hex);
    let before = file(&s, &name, HISTORY);
    let r = run(&s);
    assert_eq!(
        code(r.recover(&name, None)),
        "skp.recoverable_record_locked"
    );
    assert_eq!(file(&s, &name, HISTORY), before);
    assert!(r.host.catalog().names().is_empty());
}

/// **K-C38.** The `<hex>` folder holds a byte copy of the record's `locations.json` and a
/// temporary history, and no `history.jsonl`. Mutation: a candidate with no history withholds.
/// Expected failure: this test, at the list.
#[test]
fn an_unsaved_record_whose_projects_folder_holds_no_history_is_listed() {
    let s = site("kc38");
    let name = crashed(&s, 2);
    let hex = plant_as(
        &s,
        &format!("{:032x}", 7),
        None,
        &file(&s, &name, LOCATIONS),
    );
    std::fs::write(s.root.join(&hex).join("history.jsonl.tmp-0123"), b"x").expect("a temporary");
    let l = run(&s).list(None);
    assert_eq!((listed(&l), l.more), (vec![name.as_str()], false));
}

/// **K-C41.** A project's folder with an empty history is left unlocked at its open. Mutation: the
/// 0-byte check removed at an open. Expected failure: this test, at the list.
#[test]
fn a_projects_folder_with_an_empty_history_is_left_unlocked_at_its_open() {
    let s = site("kc41");
    let hex = saved(&s, 1, 2);
    std::fs::write(s.root.join(&hex).join(HISTORY), b"").expect("an empty history");
    let locations = file(&s, &hex, LOCATIONS);
    let r = run(&s);
    let handle = r.reopened(&s.folder);
    assert!(r.list(Some(&handle)).records.is_empty());
    assert_eq!(
        (file(&s, &hex, HISTORY), file(&s, &hex, LOCATIONS)),
        (Vec::new(), locations)
    );
}
