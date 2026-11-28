// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **`open_project` as an SKP command** (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md`,
//! Amendment 43 item 8 (b): W-1 to W-6; Amendment 45 item 2 (c): W-4's three added cases; Amendment
//! 50 item 4 (d): W-7), from the real shape: a real `SkpHost`, `StepRecorder` and `Projects`, as
//! `project_save_skp.rs` has them, each request decoded from its wire JSON, and each reply as the
//! JSON the shell receives. Nothing here times anything.

mod watch_support;

use std::path::{Path, PathBuf};
use std::sync::Arc;

use serde_json::{json, Value};
use spatial_engine::fixture::{write_geoparquet, AttributeMode, FixtureSpec};
use spatial_kernel::project::file::{read_project, write_project, Lineage, ProjectFile};
use spatial_kernel::project::store::{
    locations_to_bytes, KnownFolders, LockRefused, ProjectLock, FOLDERS, LOCATIONS,
};
use spatial_kernel::project::{ProjectUri, Projects, PROJECT_FILE_NAME};
use spatial_kernel::session_history::{recover, StepRecorder};
use spatial_kernel::skp::{session_end_channel, SkpHost, StreamRegistry};
use spatial_kernel::Catalog;
use spatial_renderer::canonical::sha256_hex;
use spatial_skp::v0::{
    CloseDatasetRequest, DatasetHandle, DescribeRequest, HexF64, OpenDatasetRequest,
    OpenProjectRequest, OpenProjectResponse, RecordStepRequest, SaveProjectRequest, SkpError,
    StepIntent, StyleSetParams, SKP_VERSION,
};

const STYLE: &str = r##"{"style_version":1,"layer":{"geometry":"polygon","fill_color":{"literal":"#4285f4"},"fill_opacity":{"literal":0.35},"outline_color":{"literal":"#000000"},"outline_width":{"literal":1.5}}}"##;

struct Rig {
    dir: PathBuf,
    /// The project folder, which exists.
    folder: PathBuf,
    machine: PathBuf,
    host: Arc<SkpHost>,
    recorder: Arc<StepRecorder>,
    projects: Projects,
}

fn rig(name: &str) -> Rig {
    let dir = std::env::temp_dir()
        .join("spatial-ide-project-reopen-skp-tests")
        .join(name);
    let _ = std::fs::remove_dir_all(&dir);
    let folder = dir.join("project");
    std::fs::create_dir_all(&folder).expect("scratch folder");
    let machine = dir.join("machine");
    let host = Arc::new(SkpHost::new(
        Arc::new(Catalog::new()),
        StreamRegistry::new(),
        watch_support::no_watch_arm(),
        session_end_channel().0,
    ));
    let recorder = Arc::new(StepRecorder::new(dir.join("sessions"), host.clone()));
    let projects = Projects::new(machine.clone(), recorder.clone());
    Rig {
        dir,
        folder,
        machine,
        host,
        recorder,
        projects,
    }
}

/// F1: 500 polygons, declared LV95, a `zone` text column, written at `path`.
fn write_f1(path: &Path) {
    std::fs::create_dir_all(path.parent().expect("a parent")).expect("the data folder");
    let spec = FixtureSpec {
        features: 500,
        avg_vertices: 12,
        seed: 1,
        attributes: AttributeMode::CategoricalZone,
        ..Default::default()
    };
    write_geoparquet(path, &spec).expect("fixture");
}

/// A save's wire workspace: the clauses and filter given, [`STYLE`], and a view.
fn workspace(clauses: Value, filter: Value) -> Value {
    let hex = |x: f64| HexF64(x).to_hex();
    json!({
        "filter": filter,
        "clauses": clauses,
        "style": serde_json::from_str::<Value>(STYLE).expect("STYLE is JSON"),
        "view": {"centre": [hex(2_600_000.5), hex(1_200_000.25)], "zoom": hex(-4.5)}
    })
}

impl Rig {
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

    fn close(&self, handle: &DatasetHandle) {
        let (skp, dataset) = (SKP_VERSION.to_string(), handle.clone());
        let closed = self
            .host
            .close_dataset(CloseDatasetRequest { skp, dataset });
        closed.expect("closed");
    }

    fn step(&self, handle: &DatasetHandle, value: f64) {
        let req = RecordStepRequest {
            skp: SKP_VERSION.to_string(),
            dataset: handle.clone(),
            intent: StepIntent::StyleSet(StyleSetParams::FillOpacity { value }),
        };
        self.recorder.record_step(req).expect("recorded");
    }

    /// A first save of `handle` into the project folder, from its wire request: the identity.
    fn save(&self, handle: &DatasetHandle, workspace: Value) -> String {
        let wire = json!({
            "skp": SKP_VERSION, "dataset": handle.as_str(),
            "folder": self.folder.display().to_string(), "workspace": workspace
        });
        let req: SaveProjectRequest = serde_json::from_value(wire).expect("the save's request");
        self.projects.save_project(req).expect("saved").project
    }

    /// F1 written at `data`, opened, saved with no filter and closed, and the save's lock released
    /// as the shell's `close_dataset` releases it: the identity.
    fn saved(&self, data: &Path) -> String {
        write_f1(data);
        let handle = self.open(data);
        let project = self.save(&handle, workspace(json!([]), Value::Null));
        self.close(&handle);
        self.projects.release_ended();
        project
    }

    /// F1 at `data/parcels.parquet` in the project folder, saved: its locators are
    /// `machine-recorded` and `project-relative`.
    fn inside(&self) -> String {
        self.saved(&self.folder.join("data/parcels.parquet"))
    }

    /// F1 outside the project folder, saved: its one locator is `machine-recorded`.
    fn outside(&self) -> (String, PathBuf) {
        let data = self.dir.join("outside/parcels.parquet");
        (self.saved(&data), data)
    }

    /// One `open_project` call at `folder`, decoded from its wire JSON: the reply as JSON.
    fn reopen(
        &self,
        folder: &Path,
        answer: Value,
        relink: Option<&Path>,
    ) -> Result<Value, SkpError> {
        let wire = json!({
            "skp": SKP_VERSION, "folder": folder.display().to_string(), "cancel_key": "k",
            "answer": answer, "relink": relink.map(|p| p.display().to_string()),
            "set_aside_file_id": false
        });
        let req: OpenProjectRequest = serde_json::from_value(wire).expect("the request");
        let reply = self.projects.open_project_command(req)?;
        Ok(serde_json::to_value(&reply).expect("the reply serializes"))
    }

    fn machine_file(&self, project: &str, name: &str) -> PathBuf {
        let hex = project
            .strip_prefix("spatial://project/")
            .expect("an identity");
        self.machine.join(hex).join(name)
    }

    fn names(&self) -> Vec<String> {
        let mut names = self.host.catalog().names();
        names.sort();
        names
    }

    fn file(&self) -> PathBuf {
        self.folder.join(PROJECT_FILE_NAME)
    }

    /// The project file's text with `from`, found once, replaced by `to`.
    fn edit(&self, from: &str, to: &str) {
        let text = std::fs::read_to_string(self.file()).expect("the file");
        assert_eq!(text.matches(from).count(), 1, "{from}");
        std::fs::write(self.file(), text.replace(from, to)).expect("edited");
    }

    fn set_file(&self, edit: impl FnOnce(&mut ProjectFile)) {
        let mut file = read_project(&std::fs::read(self.file()).expect("the file")).expect("read");
        edit(&mut file);
        std::fs::write(self.file(), write_project(&file).expect("written")).expect("replaced");
    }
}

fn copy_project(from: &Path, to: &Path) {
    std::fs::create_dir_all(to.join("data")).expect("the copy's folders");
    for name in [PROJECT_FILE_NAME, "data/parcels.parquet"] {
        std::fs::copy(from.join(name), to.join(name)).expect("copied");
    }
}

/// The names in `dir`, sorted.
fn listing(dir: &Path) -> Vec<String> {
    let entries = std::fs::read_dir(dir).expect("the folder");
    let names = entries.map(|e| e.expect("an entry").file_name());
    let mut names: Vec<String> = names.map(|n| n.to_string_lossy().into_owned()).collect();
    names.sort();
    names
}

/// A link at `link` to the folder `target`: a junction on Windows, which needs no privilege, and a
/// symlink elsewhere.
fn make_link(link: &Path, target: &Path) {
    #[cfg(windows)]
    {
        // `cmd` reads a `/` in a path as a switch, so both paths are given with `\`.
        let back = |p: &Path| p.display().to_string().replace('/', "\\");
        let made = std::process::Command::new("cmd")
            .args(["/C", "mklink", "/J"])
            .arg(back(link))
            .arg(back(target))
            .output()
            .expect("cmd");
        assert!(made.status.success(), "mklink /J: {made:?}");
    }
    #[cfg(not(windows))]
    std::os::unix::fs::symlink(target, link).expect("symlink");
}

/// The `data.dataset` of each step, in every record under `sessions`, that set the fill opacity to
/// `value`.
fn datasets_of_steps(sessions: &Path, value: f64) -> Vec<Value> {
    let mut out = Vec::new();
    for name in listing(sessions) {
        for line in recover(&sessions.join(name)).lines {
            let line: Value = serde_json::from_str(&line).expect("a JSON line");
            if line["step"]["intent"]["params"]["value"] == json!(value) {
                out.push(line["step"]["data"]["dataset"].clone());
            }
        }
    }
    out
}

/// **W-1** (the seam, from the real shape). F1 inside the folder is opened, a step recorded, and
/// the open saved with two clauses, one of them disabled, then closed. The reopen from its wire
/// request replies `opened`, and the reply decodes: the same identity; the workspace member for
/// member as the save's request gave it; `view` `applies`; both `check` lists empty; `folder_file`
/// `absent` and `previous_file` `null`. A step on the new handle carries the project file's
/// dataset identity (ADR-036 Amendment 4).
///
/// RECORDED MUTATIONS: (a) the reply's clauses built from the enabled ones only; expected failure:
/// `workspace`. (b) `StepRecorder::reopened` not called; expected failure: the step's
/// `data.dataset`.
#[test]
fn a_saved_project_reopens_through_the_command_from_its_wire_request() {
    let rig = rig("w-1");
    let data = rig.folder.join("data/parcels.parquet");
    write_f1(&data);
    let handle = rig.open(&data);
    rig.step(&handle, 0.35);
    let clauses = json!([
        {"text": "zone = 'civic'", "enabled": true},
        {"text": "zone = 'park'", "enabled": false}
    ]);
    let filter = json!({"predicate": "zone = 'civic'", "dialect": "duckdb-expr/0"});
    let saved = workspace(clauses, filter);
    let project = rig.save(&handle, saved.clone());
    rig.close(&handle);
    let reply = rig
        .reopen(&rig.folder, Value::Null, None)
        .expect("reopened");
    let decoded = serde_json::from_value::<OpenProjectResponse>(reply.clone());
    assert!(
        matches!(decoded, Ok(OpenProjectResponse::Opened(_))),
        "{reply}"
    );
    let o = &reply["opened"];
    assert_eq!(o["project"], project.as_str());
    assert_eq!(o["workspace"], saved);
    assert_eq!(o["view"], json!({"state": "applies"}));
    assert_eq!(o["check"], json!({"observed": [], "admission": []}));
    let lineage = json!({"folder_file": "absent", "previous_file": null});
    assert_eq!(o["lineage"], lineage);
    let again: DatasetHandle = serde_json::from_value(o["dataset"].clone()).expect("a handle");
    rig.step(&again, 0.25);
    let file = read_project(&std::fs::read(rig.file()).expect("the file")).expect("read");
    let uri = file.dataset.uri().as_str().to_string();
    let sessions = rig.dir.join("sessions");
    drop((rig.projects, rig.recorder));
    assert_eq!(datasets_of_steps(&sessions, 0.25), [json!(uri)]);
}

/// **W-2**. A copy of the folder, while the first folder holds the identity: `question` with
/// `copy-or-same`, and `folders.json` byte for byte unchanged; the second call, answered `same`,
/// replies `opened` under the same identity.
///
/// RECORDED MUTATION: `answer` decoded as `null`. Expected failure: the second call.
#[test]
fn a_question_reply_and_its_answered_second_call_through_the_command() {
    let rig = rig("w-2");
    let project = rig.inside();
    let copy = rig.dir.join("copy");
    copy_project(&rig.folder, &copy);
    let folders = rig.machine_file(&project, FOLDERS);
    let before = std::fs::read(&folders).expect("folders.json");
    let reply = rig.reopen(&copy, Value::Null, None).expect("asked");
    assert_eq!(reply, json!({"question": {"kind": "copy-or-same"}}));
    assert_eq!(std::fs::read(&folders).expect("kept"), before);
    let reply = rig.reopen(&copy, json!("same"), None).expect("answered");
    assert_eq!(reply["opened"]["project"], project.as_str(), "{reply}");
}

/// **W-3**. The data saved outside the folder is moved: `not_found` with the file's last name,
/// which holds no separator; with no `locations.json`, `not_found` with `null`; the call with
/// `relink` to the moved file replies `opened`.
///
/// RECORDED MUTATION: `file_name` sent as the recorded path. Expected failure: the first reply.
#[test]
fn a_not_found_reply_names_the_file_and_a_relink_through_the_command_opens_it() {
    let rig = rig("w-3");
    let (project, data) = rig.outside();
    let moved = rig.dir.join("moved.parquet");
    std::fs::rename(&data, &moved).expect("moved");
    let reply = rig
        .reopen(&rig.folder, Value::Null, None)
        .expect("not found");
    assert_eq!(
        reply,
        json!({"not_found": {"file_name": "parcels.parquet"}})
    );
    std::fs::remove_file(rig.machine_file(&project, LOCATIONS)).expect("removed");
    let reply = rig
        .reopen(&rig.folder, Value::Null, None)
        .expect("not found");
    assert_eq!(reply, json!({"not_found": {"file_name": null}}));
    let reply = rig.reopen(&rig.folder, Value::Null, Some(&moved));
    let reply = reply.expect("re-linked");
    assert_eq!(reply["opened"]["project"], project.as_str(), "{reply}");
}

/// The spellings of `p` that a text could hold it in: as given, with `/`, with `\`, and with `\`
/// escaped as JSON escapes it.
fn spellings(p: &Path) -> Vec<String> {
    let given = p.display().to_string();
    let back = given.replace('/', "\\");
    vec![given.replace('\\', "/"), back.replace('\\', "\\\\"), back]
}

/// A refusal's code and field names, checked: its message, its fields and its JSON name none of
/// `paths` in any spelling, and hold no control character; each field is at most 262 bytes.
fn refused(got: Result<Value, SkpError>, code: &str, keys: &[&str], paths: &[PathBuf]) -> SkpError {
    let e = got.expect_err(code);
    assert_eq!(e.code, code, "{e:?}");
    let names: Vec<&str> = e.fields.keys().map(String::as_str).collect();
    assert_eq!(names, keys, "{code}");
    let wire = serde_json::to_string(&e).expect("the refusal serializes");
    let texts: Vec<&String> = std::iter::once(&e.message)
        .chain(e.fields.values())
        .collect();
    for text in std::iter::once(&wire).chain(texts) {
        assert!(!text.chars().any(char::is_control), "{code}: {text:?}");
        for s in paths.iter().flat_map(|p| spellings(p)) {
            assert!(!text.contains(&s), "{code} names {s}: {text}");
        }
    }
    for (k, v) in &e.fields {
        assert!(v.len() <= 262, "{code}: `{k}` is {} bytes", v.len());
    }
    e
}

/// **W-4** (Amendment 43 item 5 (c) and (d); ADV-2026-11-19-26 item 1 (c)). Each refusal of a
/// reopen reaches the wire as its own code and fields, and no text of it names the machine store's
/// root or the data's machine-recorded path; for the data step's refusals, nor the project folder.
/// The cases: a `project.spatial` the reader refuses; one that cannot be read; a refused
/// `folders.json`; the identity held open; a link, a missing segment and a file as an intermediate
/// at the data step; a relative `relink`; 256 known folders and the answer `same`; and three files
/// the reader refuses with a long or control-bearing text, each bounded and with no control
/// character.
///
/// RECORDED MUTATIONS: (a) `ThroughLink` mapped to `project_target_unresolvable`; expected failure:
/// its code. (b) a data-step refusal sends the checked absolute path as `segment`; expected
/// failure: the scan. (c) the bounding helper returns its input; expected failure: the three last
/// cases.
#[test]
fn each_reopen_refusal_reaches_the_wire_as_its_code_with_no_path_it_was_not_given() {
    let case = |name: &str| {
        let rig = rig(&format!("w-4-{name}"));
        let project = rig.inside();
        (rig, project)
    };
    let none = |rig: &Rig| rig.reopen(&rig.folder, Value::Null, None);
    let (file_keys, record_keys) = (["path", "rule"], ["file", "rule"]);

    let (rig, _) = case("refused");
    std::fs::write(rig.file(), b"{}").expect("a file the reader refuses");
    let code = "skp.project_file_refused";
    refused(none(&rig), code, &file_keys, &paths_of(&rig, false));

    let (rig, _) = case("unreadable");
    std::fs::remove_file(rig.file()).expect("removed");
    std::fs::create_dir(rig.file()).expect("a folder at the file's name");
    let code = "skp.project_file_unreadable";
    refused(none(&rig), code, &["detail"], &paths_of(&rig, false));

    let (rig, project) = case("folders");
    std::fs::write(rig.machine_file(&project, FOLDERS), b"{}").expect("written");
    let code = "skp.project_machine_record_refused";
    let e = refused(none(&rig), code, &record_keys, &paths_of(&rig, false));
    assert_eq!(e.fields["file"], FOLDERS);

    let (rig, project) = case("held");
    rig.reopen(&rig.folder, Value::Null, None)
        .expect("the holder");
    let code = "skp.project_open_elsewhere";
    let e = refused(none(&rig), code, &["project"], &paths_of(&rig, false));
    assert_eq!(e.fields["project"], project);

    let target = ["locator", "segment"];
    let (rig, _) = case("link");
    let (inside, real) = (rig.folder.join("data"), rig.folder.join("real"));
    std::fs::rename(&inside, &real).expect("moved");
    make_link(&inside, &real);
    let code = "skp.project_target_through_link";
    let e = refused(none(&rig), code, &target, &paths_of(&rig, true));
    assert_eq!(e.fields["segment"], "data");

    let (rig, _) = case("missing");
    std::fs::remove_file(rig.folder.join("data/parcels.parquet")).expect("removed");
    let code = "skp.project_target_unresolvable";
    let e = refused(none(&rig), code, &target, &paths_of(&rig, true));
    assert_eq!(e.fields["segment"], "data/parcels.parquet");

    let (rig, _) = case("intermediate");
    std::fs::remove_dir_all(rig.folder.join("data")).expect("removed");
    std::fs::write(rig.folder.join("data"), b"a file").expect("a file as the folder");
    let (code, keys) = (
        "skp.project_target_wrong_kind",
        ["expected", "locator", "segment"],
    );
    let e = refused(none(&rig), code, &keys, &paths_of(&rig, true));
    assert_eq!(e.fields["segment"], "data");
    assert_eq!(e.fields["expected"], "folder");

    let (rig, _) = case("relink");
    let relative = Path::new("elsewhere/parcels.parquet");
    let got = rig.reopen(&rig.folder, Value::Null, Some(relative));
    let code = "skp.project_machine_record_refused";
    let e = refused(got, code, &record_keys, &paths_of(&rig, false));
    assert_eq!(e.fields["file"], LOCATIONS);

    let (rig, project) = case("full");
    let first = std::path::absolute(&rig.folder).expect("absolute");
    let root = if cfg!(windows) { "C:/w-4" } else { "/w-4" };
    let same = (1..256).map(|i| PathBuf::from(format!("{root}/f{i}")));
    let known = KnownFolders {
        first,
        same: same.collect(),
    };
    let bytes = known.to_bytes().expect("256 folders");
    std::fs::write(rig.machine_file(&project, FOLDERS), bytes).expect("written");
    let copy = rig.dir.join("copy");
    copy_project(&rig.folder, &copy);
    let got = rig.reopen(&copy, json!("same"), None);
    let (code, keys) = ("skp.project_known_folders_full", ["count", "project"]);
    let e = refused(got, code, &keys, &paths_of(&rig, false));
    assert_eq!(
        (e.fields["count"].as_str(), &e.fields["project"]),
        ("256", &project)
    );

    // The file as the writer lays it out: one member a line, `": "` between a key and its value.
    let digits = format!("\"version\": 1{},", "0".repeat(99_999));
    let word = format!("\"format\": \"{}\"", "x".repeat(4_096));
    let edits = [
        ("number", "\"version\": 1,", digits.as_str()),
        ("key", "{\n", "{\n  \"\\u0001\": 1,\n"),
        ("word", "\"format\": \"spatial-project\"", word.as_str()),
    ];
    for (name, from, to) in edits {
        let (rig, _) = case(name);
        let text = std::fs::read_to_string(rig.file()).expect("the file");
        assert!(text.contains(from), "{name}");
        std::fs::write(rig.file(), text.replacen(from, to, 1)).expect("edited");
        let code = "skp.project_file_refused";
        refused(none(&rig), code, &file_keys, &paths_of(&rig, false));
    }
}

/// The machine store's root and the data's recorded path, for a project saved with
/// [`Rig::inside`]; with `folder`, the project folder too.
fn paths_of(rig: &Rig, folder: bool) -> Vec<PathBuf> {
    let mut paths = vec![rig.machine.clone(), rig.folder.join("data/parcels.parquet")];
    paths.extend(folder.then(|| rig.folder.clone()));
    paths
}

/// **W-5** (ADV-2026-11-19-19 item 2). (a) A relative `relink`; (b) a `relink` whose
/// `locations.json` write fails after the engine's open, a folder standing at that name in the
/// identity's machine folder. Each is refused by its code, the catalog's names are unchanged, and
/// the identity's `open.lock` can be taken.
///
/// RECORDED MUTATIONS: (a) the re-link's check moved after the engine's open, with no close;
/// expected failure: the catalog at (a). (b) the dataset not closed when the write fails; expected
/// failure: the catalog at (b).
#[test]
fn a_refused_relink_through_the_command_leaves_no_catalog_entry_and_open_lock_free() {
    let rig = rig("w-5");
    let (project, data) = rig.outside();
    let uri: ProjectUri = project.parse().expect("an identity");
    let free = |case: &str| {
        let lock = ProjectLock::try_lock(&rig.machine, &uri);
        assert!(lock.is_ok(), "{case}: open.lock is free: {lock:?}");
    };
    let names = rig.names();
    let relative = Path::new("elsewhere/parcels.parquet");
    let e = rig.reopen(&rig.folder, Value::Null, Some(relative));
    let e = e.expect_err("a relative re-link");
    assert_eq!(e.code, "skp.project_machine_record_refused", "{e:?}");
    assert_eq!(rig.names(), names, "(a): the catalog");
    free("(a)");
    let locations = rig.machine_file(&project, LOCATIONS);
    std::fs::remove_file(&locations).expect("removed");
    std::fs::create_dir(&locations).expect("a folder at its name");
    let e = rig.reopen(&rig.folder, Value::Null, Some(&data));
    let e = e.expect_err("an unwritable locations.json");
    assert_eq!(e.code, "skp.project_machine_store_failed", "{e:?}");
    assert_eq!(rig.names(), names, "(b): the catalog");
    free("(b)");
}

const URI: &str = "spatial://dataset/ref/0123456789abcdef0123456789abcdef";
const PROJECT: &str = "spatial://project/fedcba9876543210fedcba9876543210";
const HASH: &str = "abababababababababababababababababababababababababababababababab";
const OBSERVED: &str = r#"{"byte_size":27132,"modified_ns":"1700000000000000000","footer_length":11806,"footer_sha256":"abababababababababababababababababababababababababababababababab"}"#;

/// A lineage of one save, as `project_reopen.rs` builds one: a header and one style step.
fn lineage() -> Vec<String> {
    let entry = format!(
        r#"{{"resource":{{"logical_uri":"{URI}","content_hash":{{"state":"not-taken","basis":"b"}},"source_revision":{{"state":"none-pinned","basis":"b"}},"locators":[{{"kind":"machine-recorded","at":"{URI}"}},{{"kind":"project-relative","at":"data/zones.parquet"}}],"cache_status":"linked","portability_policy":"linked-live-file"}},"observed":{OBSERVED},"admission":{{"crs_assertion":null,"identity":null}}}}"#
    );
    let header = format!(
        r#"{{"format":"spatial-steps","version":1,"purpose":"lineage","project":"{PROJECT}","actions":2,"datasets":[{entry}],"lineage":{{"completeness":{{"state":"complete"}},"starts":{{"state":"at-first-save"}}}}}}"#
    );
    let crs = format!(
        r#"{{"identifier":"EPSG:2056","provenance":"crs:declared","definition":"sha256:{HASH}"}}"#
    );
    let intent = r#"{"action":"style.set","params":{"property":"fillOpacity","value":0.5}}"#;
    let step = format!(
        r#"{{"step":{{"id":"step_{:032x}","parent":null,"at":"2026-10-14T10:00:00Z","kind":"style","effect":{{"class":"workspace-mutation"}},"actor":{{"kind":"user"}},"intent":{intent},"dependencies":{{"fields":[{{"name":"zone","type":"Utf8"}}],"crs":{crs},"geometry_types":["Polygon"]}},"data":{{"dataset":"{URI}","identity":{{"observed":{OBSERVED}}}}},"scope":{{"kind":"layer"}},"links":[]}}}}"#,
        1
    );
    vec![header, step]
}

fn bytes(lines: &[String]) -> Vec<u8> {
    lines.iter().flat_map(|l| l.bytes().chain(*b"\n")).collect()
}

/// **W-6** (O5; packet P-6 (ii)). The project file's member records a lineage, kept on this
/// machine as the previous lineage file. A copy of the folder answered `copy`, with the data moved
/// away: `not_found` with the file's name; the copy's `project.spatial` byte for byte unchanged and
/// no new folder in the machine store. The second call, answered `copy` with `relink`, replies
/// `opened` under a new identity, with `previous_file` `used`.
///
/// RECORDED MUTATION: the copy's data lookup made after the lock and the copy's writes (main's
/// order). Expected failure: the copy's `project.spatial`.
#[test]
fn a_copy_answer_whose_data_is_not_found_writes_nothing_and_its_second_call_keeps_the_file_name_and_the_previous_lineage(
) {
    let rig = rig("w-6");
    let (project, data) = rig.outside();
    let lines = lineage();
    let sha256 = sha256_hex(&bytes(&lines));
    rig.set_file(|f| f.lineage = Lineage::Kept { sha256, steps: 1 });
    let previous = rig.machine_file(&project, "previous-lineage.jsonl");
    std::fs::write(previous, bytes(&lines)).expect("the previous lineage file");
    let copy = rig.dir.join("copy");
    std::fs::create_dir_all(&copy).expect("the copy");
    let copied = copy.join(PROJECT_FILE_NAME);
    std::fs::copy(rig.file(), &copied).expect("copied");
    let moved = rig.dir.join("moved.parquet");
    std::fs::rename(&data, &moved).expect("moved");
    let (before, store) = (
        std::fs::read(&copied).expect("the copy's"),
        listing(&rig.machine),
    );
    let reply = rig.reopen(&copy, json!("copy"), None).expect("not found");
    let kept = std::fs::read(&copied).expect("the copy's") == before;
    assert!(kept, "the copy's project.spatial is unchanged: {reply}");
    assert_eq!(listing(&rig.machine), store, "no new identity's folder");
    assert_eq!(
        reply,
        json!({"not_found": {"file_name": "parcels.parquet"}})
    );
    let reply = rig
        .reopen(&copy, json!("copy"), Some(&moved))
        .expect("opened");
    let o = &reply["opened"];
    assert_ne!(o["project"], project.as_str(), "{reply}");
    assert_eq!(o["lineage"]["previous_file"], "used", "{reply}");
}

/// **W-7** (ADV-2026-11-19-32 item 6; changed under ADV-2026-11-19-34 item 3). (a) The saved
/// view's space identifier, edited to fill the string ceiling with a control character written as
/// an escape: `opened`, the view `saved-in-another-space`, and a `basis` under 1,024 bytes with no
/// control character. Runs on every platform. (b1) A recorded data path whose last name is 278
/// bytes (90 characters of 3 bytes each and `.parquet`), the file missing: `not_found`, with a
/// `file_name` of at most 262 bytes that ends with the cut's mark. Compiled everywhere but Linux:
/// Linux holds at most 255 bytes in one name, so there the metadata lookup in `data_at` does not
/// answer "not found" for it, the path goes to the engine, and the reply is an `engine.source`
/// refusal, not `not_found`; so on Linux the cut of `file_name` is shown by no test. (b2) On every
/// platform: a recorded data path whose last name is short and holds U+0085 (a control character
/// that Windows, macOS and Linux all accept in a file name: Linux forbids only `/` and NUL, NTFS
/// only characters below U+0020 and its reserved ones; for macOS this rests on CI's run alone), the
/// file missing: `not_found`, with a `file_name` holding no control character, holding U+FFFD, and
/// not ending with the cut's mark.
///
/// RECORDED MUTATION: W-4's (c), the bounding helper returns its input. Expected failure: (a)'s
/// `basis`, (b1)'s `file_name` (Windows and macOS) and (b2)'s `file_name` (with W-4's three cases).
#[test]
fn basis_and_file_name_carry_a_text_read_from_a_file_only_bounded_and_with_no_control_character() {
    let a = rig("w-7a");
    a.inside();
    let identifier = format!("\"identifier\": \"\\u0001{}\"", "E".repeat(4_095));
    a.edit("\"identifier\": \"EPSG:2056\"", &identifier);
    let reply = a.reopen(&a.folder, Value::Null, None).expect("opened");
    let view = &reply["opened"]["view"];
    assert_eq!(view["state"], "saved-in-another-space", "{reply}");
    let basis = view["basis"].as_str().expect("a basis");
    assert!(!basis.chars().any(char::is_control), "{basis:?}");
    assert!(basis.len() < 1_024, "basis is {} bytes", basis.len());

    #[cfg(not(target_os = "linux"))]
    {
        let b = rig("w-7b");
        let (project, data) = b.outside();
        let file = read_project(&std::fs::read(b.file()).expect("the file")).expect("read");
        let long = data.with_file_name(format!("{}.parquet", "€".repeat(90)));
        let bytes = locations_to_bytes(file.dataset.uri(), &long).expect("a recorded path");
        std::fs::write(b.machine_file(&project, LOCATIONS), bytes).expect("written");
        let reply = b.reopen(&b.folder, Value::Null, None).expect("not found");
        let name = reply["not_found"]["file_name"].as_str().expect("a name");
        assert!(
            name.len() <= 262 && name.ends_with(" [cut]"),
            "{} bytes: {name}",
            name.len()
        );
    }

    let c = rig("w-7c");
    let (project, data) = c.outside();
    let file = read_project(&std::fs::read(c.file()).expect("the file")).expect("read");
    let odd = data.with_file_name("par\u{85}cels.parquet");
    let bytes = locations_to_bytes(file.dataset.uri(), &odd).expect("a recorded path");
    std::fs::write(c.machine_file(&project, LOCATIONS), bytes).expect("written");
    let reply = c.reopen(&c.folder, Value::Null, None).expect("not found");
    let name = reply["not_found"]["file_name"].as_str().expect("a name");
    assert!(!name.chars().any(char::is_control), "{name:?}");
    assert!(name.contains('�'), "{name:?}");
    assert!(!name.ends_with(" [cut]"), "{name:?}");
}

/// **W-8** (`governance/forms/frontends/DESCRIBE-FAILS-AFTER-OPENED-CLOSES-THE-HANDLE-PREREGISTRATION.md`
/// §4.3, the seam pin). A saved project is reopened, and `describe` on its `opened` handle is
/// refused as `skp.version_unsupported`: of the refusals `SkpHost::describe` gives, this is the only
/// one that leaves the handle in the catalog (`skp.unknown_dataset` needs it gone). The project's
/// `open.lock` is then held. After the close of that handle and `release_ended`, in the binding's
/// order, it can be taken. The kernel is unchanged, so this pins the contract the shell's close
/// rests on and is not a red/green test.
///
/// RECORDED MUTATION: KM1, the close removed and `release_ended` kept. Expected failure: the lock
/// after the release.
#[test]
fn a_reopen_whose_describe_is_refused_holds_its_lock_until_the_opened_handle_is_closed() {
    let rig = rig("w-8");
    let project = rig.inside();
    let uri: ProjectUri = project.parse().expect("an identity");
    let reply = rig.reopen(&rig.folder, Value::Null, None).expect("opened");
    let dataset = reply["opened"]["dataset"].clone();
    let handle: DatasetHandle = serde_json::from_value(dataset).expect("a handle");
    let skp = "skp/0.0".to_string();
    let described = rig.host.describe(DescribeRequest {
        skp,
        dataset: handle.clone(),
    });
    let e = described.expect_err("an unsupported version");
    assert_eq!(e.code, "skp.version_unsupported", "{e:?}");
    let held = ProjectLock::try_lock(&rig.machine, &uri);
    assert!(
        matches!(held, Err(LockRefused::Held)),
        "open.lock is held: {held:?}"
    );
    rig.close(&handle);
    rig.projects.release_ended();
    let free = ProjectLock::try_lock(&rig.machine, &uri);
    assert!(
        free.is_ok(),
        "open.lock is free after the close and the release: {free:?}"
    );
    drop(free);
}
