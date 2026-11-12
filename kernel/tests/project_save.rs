// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **Save project** (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md` §4, step 1): K-S1 to K-S5 and
//! K-S7 to K-S13, each from the real shape. A real `SkpHost::open_dataset` opens a fixture generated
//! in the test, a `StepRecorder` records steps over that open, and `Projects::save` saves it; the
//! file, the machine store and the session history are then read back by the readers the kernel
//! ships. A live history is locked, and on Windows a locked file cannot be read by another handle,
//! so a test that reads the history back drops the recorder and `Projects` first. Nothing here
//! times anything, apart from K-S7's bound on the call it makes.
//!
//! - **K-S7** (H6): a rename that keeps failing is tried [`MAX_SAVE_RENAME_ATTEMPTS`] times and then
//!   refused by name, and the failed save leaves nothing behind. The rename fails on every platform
//!   and every time here because `project.spatial` is a folder that holds a file: a file cannot be
//!   renamed over it.
//! - The other tests are written against `Projects::save`. Each states what it asserts and the
//!   mutation it was observed failing under. Two are not named by the form: the withheld mark and
//!   the first save without a folder.

mod watch_support;

use std::path::{Path, PathBuf};
use std::sync::mpsc;
use std::sync::Arc;
use std::time::Duration;

use serde_json::Value;
use spatial_engine::fixture::{write_geoparquet, AttributeMode, FixtureSpec};
use spatial_engine::Dataset;
use spatial_kernel::dataset_ref::{DatasetRef, Locator};
use spatial_kernel::project::file::{
    read_project, write_project, Clause, Lineage, Space, View, Workspace,
};
use spatial_kernel::project::resolver::{Carried, Why};
use spatial_kernel::project::store::{replace, KnownFolders, SaveError, MAX_SAVE_RENAME_ATTEMPTS};
use spatial_kernel::project::{HistoryMark, Projects, SaveFailure, Withheld, PROJECT_FILE_NAME};
use spatial_kernel::session_history::{recover, StepRecorder};
use spatial_kernel::skp::{session_end_channel, SkpHost, StreamRegistry};
use spatial_kernel::Catalog;
use spatial_renderer::canonical::{sha256_hex, to_canonical_string};
use spatial_renderer::style;
use spatial_skp::v0::{
    DatasetHandle, Filter, FilterApplyParams, OpenDatasetRequest, RecordStepRequest, StepIntent,
    StyleSetParams, SKP_VERSION,
};

#[test]
fn a_rename_that_keeps_failing_is_refused_by_name_after_the_declared_attempts() {
    let dir = std::env::temp_dir()
        .join("spatial-ide-project-save-tests")
        .join("ks7");
    let _ = std::fs::remove_dir_all(&dir);
    let blocker = dir.join("project.spatial");
    std::fs::create_dir_all(&blocker).expect("scratch folder");
    std::fs::write(blocker.join("keep.txt"), b"kept").expect("a file in the way");

    // A save that never gives up would never return, so the call is bounded here.
    let (done, result) = mpsc::channel();
    let folder = dir.clone();
    std::thread::spawn(move || drop(done.send(replace(&folder, b"new bytes"))));
    let refused = result
        .recv_timeout(Duration::from_secs(60))
        .expect("the save returned within 60 s")
        .expect_err("a rename over a folder cannot succeed");

    match &refused {
        SaveError::RenameKeepsFailing { attempts, .. } => {
            assert_eq!(*attempts, MAX_SAVE_RENAME_ATTEMPTS);
        }
        other => panic!("the refusal names the rename: {other}"),
    }
    assert!(refused
        .to_string()
        .contains(&MAX_SAVE_RENAME_ATTEMPTS.to_string()));
    let names: Vec<String> = std::fs::read_dir(&dir)
        .expect("the folder")
        .map(|e| e.expect("entry").file_name().to_string_lossy().into_owned())
        .collect();
    assert_eq!(
        names,
        ["project.spatial"],
        "the failed save left no temp file"
    );
    assert!(blocker.join("keep.txt").exists());
}

// ---------------------------------------------------------------------------------------------
// The rig: a real open, a recorder, and `Projects`
// ---------------------------------------------------------------------------------------------

const FILTER: &str = "zone = 'civic'";
const STYLE: &str = r##"{"style_version":1,"layer":{"geometry":"polygon","fill_color":{"literal":"#4285f4"},"fill_opacity":{"literal":0.35},"outline_color":{"literal":"#000000"},"outline_width":{"literal":1.5}}}"##;

struct Rig {
    dir: PathBuf,
    /// The project folder.
    folder: PathBuf,
    /// The session history's store root.
    sessions: PathBuf,
    /// The machine store's `projects` folder.
    machine: PathBuf,
    host: Arc<SkpHost>,
    recorder: Arc<StepRecorder>,
    projects: Projects,
}

fn rig(name: &str) -> Rig {
    let dir = std::env::temp_dir()
        .join("spatial-ide-project-save-tests")
        .join(name);
    let _ = std::fs::remove_dir_all(&dir);
    let folder = dir.join("project");
    std::fs::create_dir_all(&folder).expect("scratch folder");
    let (sessions, machine) = (dir.join("sessions"), dir.join("machine"));
    let host = Arc::new(SkpHost::new(
        Arc::new(Catalog::new()),
        StreamRegistry::new(),
        watch_support::no_watch_arm(),
        session_end_channel().0,
    ));
    let recorder = Arc::new(StepRecorder::new(sessions.clone(), host.clone()));
    let projects = Projects::new(machine.clone(), recorder.clone());
    Rig {
        dir,
        folder,
        sessions,
        machine,
        host,
        recorder,
        projects,
    }
}

/// F1: 500 polygons, declared LV95, a `zone` text column, written at `path`.
fn f1(path: &Path) {
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

impl Rig {
    fn open(&self, path: &Path) -> (DatasetHandle, Arc<Dataset>) {
        let req = OpenDatasetRequest {
            skp: SKP_VERSION.to_string(),
            path: path.display().to_string(),
            cancel_key: "k".to_string(),
            crs_assertion: None,
            identity: None,
        };
        let handle = self.host.open_dataset(req).expect("open").dataset;
        let ds = self.host.catalog().get(handle.as_str()).expect("catalog");
        (handle, ds)
    }

    /// F1 at `<project folder>/<relative>`, opened.
    fn open_inside(&self, relative: &str) -> (DatasetHandle, Arc<Dataset>) {
        let path = self.folder.join(relative);
        f1(&path);
        self.open(&path)
    }

    fn step(&self, handle: &DatasetHandle, intent: StepIntent) {
        let req = RecordStepRequest {
            skp: SKP_VERSION.to_string(),
            dataset: handle.clone(),
            intent,
        };
        self.recorder.record_step(req).expect("recorded");
    }

    fn filter_step(&self, handle: &DatasetHandle) {
        let f = Filter::new(FILTER, "duckdb-expr/0").expect("dialect");
        let params = FilterApplyParams { filter: Some(f) };
        self.step(handle, StepIntent::FilterApply(params));
    }

    fn opacity_step(&self, handle: &DatasetHandle, value: f64) {
        let params = StyleSetParams::FillOpacity { value };
        self.step(handle, StepIntent::StyleSet(params));
    }

    fn project_file(&self) -> Vec<u8> {
        std::fs::read(self.folder.join(PROJECT_FILE_NAME)).expect("project.spatial")
    }
}

/// The space a dataset is admitted in, in `dependencies.crs`'s form.
fn space_of(ds: &Dataset) -> Space {
    let crs = ds.crs();
    let admission = ds.admission().expect("every open has an admission");
    Space {
        identifier: crs.identifier().to_string(),
        provenance: admission.crs_provenance.as_str().to_string(),
        definition: crs.definition_json().map(|d| sha256_hex(d.as_bytes())),
    }
}

/// A workspace over `ds`: the filter as one enabled clause (or none), the style of [`STYLE`].
fn workspace(ds: &Dataset, filter: Option<&str>, zoom: f64) -> Workspace {
    let clauses = filter
        .map(|text| Clause {
            text: text.to_string(),
            enabled: true,
        })
        .into_iter()
        .collect();
    Workspace {
        filter: filter.map(str::to_string),
        clauses,
        style: style::parse(STYLE).expect("a style document"),
        view: View {
            crs: space_of(ds),
            centre: [2_600_000.5, 1_200_000.25],
            zoom,
        },
    }
}

fn locators(bytes: &[u8]) -> Vec<Locator> {
    let file = read_project(bytes).expect("the reader accepts the file");
    file.dataset.locators().to_vec()
}

/// Whether `text` names `needle`, raw or as JSON writes it (a Windows path's backslashes).
fn names(text: &str, needle: &str) -> bool {
    let text = text.to_ascii_lowercase();
    let (raw, escaped) = (needle.to_ascii_lowercase(), needle.replace('\\', "\\\\"));
    text.contains(&raw) || text.contains(&escaped.to_ascii_lowercase())
}

fn file_names(dir: &Path) -> Vec<String> {
    let mut names: Vec<String> = std::fs::read_dir(dir)
        .expect("the folder")
        .map(|e| e.expect("entry").file_name().to_string_lossy().into_owned())
        .collect();
    names.sort();
    names
}

// ---------------------------------------------------------------------------------------------
// K-S1 to K-S5: what the file holds
// ---------------------------------------------------------------------------------------------

/// **K-S1**, the seam: `open_dataset`, then `Projects::save`, then the reader. The file is the
/// line-oriented layout (one member to a line, two spaces of indent per level, an LF at the end),
/// the reader accepts it and the writer gives back the same bytes, the workspace reads back as it
/// was sent, and the dataset entry's `observed` and `admission` are what `DatasetRef::linked`
/// builds for that open. The folder holds the data and `project.spatial`, and no temp file.
///
/// RECORDED MUTATION: `save` writes the one-line form instead of `write_project`'s layout.
/// Expected failure: the layout assertion on the file's first bytes.
#[test]
fn a_saved_project_reads_back_in_the_line_oriented_form_from_a_real_open() {
    let rig = rig("ks1");
    let (handle, ds) = rig.open_inside("data/parcels.parquet");
    let sent = workspace(&ds, Some(FILTER), -4.5);
    let saved = rig
        .projects
        .save(handle.as_str(), &ds, Some(&rig.folder), sent.clone())
        .expect("saved");

    let bytes = rig.project_file();
    let text = String::from_utf8(bytes.clone()).expect("UTF-8");
    let head = "{\n  \"format\": \"spatial-project\",\n  \"version\": 1,\n  \"project\": \"";
    assert!(
        text.starts_with(head),
        "the layout's first lines: {text:.120}"
    );
    assert!(text.ends_with("}\n") && !text.ends_with("\n\n"));
    assert!(text
        .lines()
        .all(|l| (l.len() - l.trim_start().len()) % 2 == 0));
    assert!(text.lines().count() > 20, "one member to a line");

    let read = read_project(&bytes).expect("the reader accepts the file");
    assert_eq!(write_project(&read).expect("written again"), text);
    assert_eq!(read.project, saved.project);
    assert_eq!(read.lineage, Lineage::NotKept);
    assert_eq!(read.workspace, sent);
    let json = |r: &DatasetRef| {
        let text = to_canonical_string(&r.to_json()).expect("text");
        serde_json::from_str::<Value>(&text).expect("JSON")
    };
    let linked = DatasetRef::linked(read.dataset.uri().clone(), &ds).expect("linked");
    let (got, want) = (json(&read.dataset), json(&linked));
    assert_eq!(got["observed"], want["observed"]);
    assert_eq!(got["admission"], want["admission"]);

    assert_eq!(file_names(&rig.folder), ["data", PROJECT_FILE_NAME]);
}

/// **K-S2**: the identity is minted at the first save and kept by every later one. The second save
/// is given no folder, goes to the first one, and writes the same identity; the machine store holds
/// one record for it.
///
/// RECORDED MUTATION: `save` mints an identity at every save. Expected failure: the second save's
/// identity differs from the first's.
#[test]
fn the_identity_is_minted_at_the_first_save_and_kept_after() {
    let rig = rig("ks2");
    let (handle, ds) = rig.open_inside("data/parcels.parquet");
    let first = rig
        .projects
        .save(
            handle.as_str(),
            &ds,
            Some(&rig.folder),
            workspace(&ds, None, -4.5),
        )
        .expect("first save");
    let read = read_project(&rig.project_file()).expect("file");
    assert_eq!(read.project, first.project);
    let hex = first.project.hex();
    assert_eq!(hex.len(), 32);
    assert!(hex.bytes().all(|b| matches!(b, b'0'..=b'9' | b'a'..=b'f')));

    let second = rig
        .projects
        .save(handle.as_str(), &ds, None, workspace(&ds, None, -3.0))
        .expect("second save");
    assert_eq!(second.project, first.project, "kept after the first save");
    let read = read_project(&rig.project_file()).expect("file");
    assert_eq!(read.project, first.project);
    assert_eq!(
        read.workspace.view.zoom, -3.0,
        "the second save wrote the file"
    );
    assert_eq!(
        file_names(&rig.machine),
        [hex],
        "one record for one identity"
    );
}

/// **K-S3**: data inside the folder, reached without a link, with a canonical spelling: the file
/// carries `machine-recorded` and then `project-relative`, and the judgment says so.
///
/// RECORDED MUTATION: `judge` never adds the `project-relative` locator. Expected failure: the
/// locators are `[machine-recorded]` alone.
#[test]
fn inside_data_reached_without_a_link_carries_project_relative_and_machine_recorded() {
    let rig = rig("ks3");
    let (handle, ds) = rig.open_inside("data/parcels.parquet");
    let saved = rig
        .projects
        .save(
            handle.as_str(),
            &ds,
            Some(&rig.folder),
            workspace(&ds, None, -4.5),
        )
        .expect("saved");
    let at = "data/parcels.parquet".to_string();
    assert_eq!(saved.carried, Carried::ProjectRelative(at.clone()));
    assert_eq!(
        locators(&rig.project_file()),
        [Locator::MachineRecorded, Locator::ProjectRelative(at)]
    );
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

/// **K-S4** (F3): the data is inside the folder, and the dataset was opened through a link below
/// it, `data/alias`, to the folder `data/real` that is also inside. The data resolves to a path
/// that is inside and spelled canonically, so only the link keeps the project-relative locator
/// out: the file carries `machine-recorded` alone, and the judgment names the link.
///
/// RECORDED MUTATION: `judge`'s walk does not look for links (it never reports one). Expected
/// failure: the locators include a `project-relative` one.
#[test]
fn data_reached_through_a_link_below_the_folder_carries_machine_recorded_only() {
    let rig = rig("ks4");
    f1(&rig.folder.join("data/real/parcels.parquet"));
    make_link(
        &rig.folder.join("data/alias"),
        &rig.folder.join("data/real"),
    );
    let (handle, ds) = rig.open(&rig.folder.join("data/alias/parcels.parquet"));
    let saved = rig
        .projects
        .save(
            handle.as_str(),
            &ds,
            Some(&rig.folder),
            workspace(&ds, None, -4.5),
        )
        .expect("saved: a link does not refuse the save");
    assert_eq!(
        saved.carried,
        Carried::MachineRecordedOnly(Why::ThroughLink)
    );
    assert_eq!(locators(&rig.project_file()), [Locator::MachineRecorded]);
    // A junction is removed with `remove_dir`, a symlink with `remove_file`; neither follows it.
    let alias = rig.folder.join("data/alias");
    std::fs::remove_dir(&alias)
        .or_else(|_| std::fs::remove_file(&alias))
        .expect("link removed");
}

/// **K-S5** (F2): the data is outside the folder. The file carries `machine-recorded` alone and no
/// text that names the data's path or its folder.
///
/// RECORDED MUTATION: `save` writes the data's absolute path into the file. Expected failure: the
/// file names the data's path.
#[test]
fn outside_data_carries_machine_recorded_only_and_no_absolute_path() {
    let rig = rig("ks5");
    let path = rig.dir.join("elsewhere").join("parcels.parquet");
    f1(&path);
    let (handle, ds) = rig.open(&path);
    let saved = rig
        .projects
        .save(
            handle.as_str(),
            &ds,
            Some(&rig.folder),
            workspace(&ds, None, -4.5),
        )
        .expect("saved");
    assert_eq!(saved.carried, Carried::MachineRecordedOnly(Why::Outside));
    let bytes = rig.project_file();
    assert_eq!(locators(&bytes), [Locator::MachineRecorded]);
    let text = String::from_utf8(bytes).expect("UTF-8");
    assert!(
        !names(&text, &path.display().to_string()),
        "the file names the data's path"
    );
    let elsewhere = path.parent().expect("parent").display().to_string();
    assert!(
        !names(&text, &elsewhere),
        "the file names the data's folder"
    );
}

// ---------------------------------------------------------------------------------------------
// K-S8, K-S9: the history's two moves
// ---------------------------------------------------------------------------------------------

/// The lines of the record in `dir`, parsed, after `recover` has chained them.
fn history(dir: &Path) -> Vec<Value> {
    let got = recover(dir);
    assert!(
        got.failure.is_none(),
        "the history chains: {:?}",
        got.failure
    );
    got.lines
        .iter()
        .map(|l| serde_json::from_str(l).expect("a JSON line"))
        .collect()
}

/// **K-S8**: a save writes one `saved-here` mark after the last step, when the workspace is what the
/// steps reach. `recover` reads the history back whole: the mark's `after` is the last step's id,
/// which is the chain rule `recover` holds, and the save's response says the mark was written.
///
/// RECORDED MUTATION: the mark's `after` is the first step's id. Expected failure: `recover` stops
/// at the mark (`$.mark.after`), and the history is not whole.
#[test]
fn a_save_appends_one_saved_here_mark_that_recover_chains() {
    let rig = rig("ks8");
    let (handle, ds) = rig.open_inside("data/parcels.parquet");
    rig.filter_step(&handle);
    rig.opacity_step(&handle, 0.35);
    let saved = rig
        .projects
        .save(
            handle.as_str(),
            &ds,
            Some(&rig.folder),
            workspace(&ds, Some(FILTER), -4.5),
        )
        .expect("saved");
    assert_eq!(saved.history_mark, HistoryMark::Written);
    let record = rig.sessions.join(saved.project.hex());
    drop(rig.projects);
    drop(rig.recorder);

    let lines = history(&record);
    assert_eq!(lines.len(), 4, "the header, two steps and one mark");
    let marks: Vec<&Value> = lines.iter().filter(|l| l.get("mark").is_some()).collect();
    assert_eq!(marks.len(), 1);
    assert_eq!(marks[0]["mark"]["kind"], "saved-here");
    assert_eq!(marks[0]["mark"]["after"], lines[2]["step"]["id"]);
    assert_ne!(lines[1]["step"]["id"], lines[2]["step"]["id"]);
}

/// **K-S9**: the first save moves the record under the project's identity: the store root holds
/// the project's record and no `unsaved-` one, the header's `project` is the project's URI, the
/// kept lines and `locations.json` came with it, and a step recorded after the save continues the
/// moved record.
///
/// RECORDED MUTATION: the `unsaved-` record is kept as well. Expected failure: the store root holds
/// two records.
#[test]
fn the_first_save_moves_the_record_under_the_project_identity() {
    let rig = rig("ks9");
    let (handle, ds) = rig.open_inside("data/parcels.parquet");
    rig.filter_step(&handle);
    let before = file_names(&rig.sessions);
    assert_eq!(before.len(), 1, "one unsaved record before the save");
    assert!(before[0].starts_with("unsaved-"), "{before:?}");
    let saved = rig
        .projects
        .save(
            handle.as_str(),
            &ds,
            Some(&rig.folder),
            workspace(&ds, Some(FILTER), -4.5),
        )
        .expect("saved");
    let hex = saved.project.hex().to_string();
    assert_eq!(
        file_names(&rig.sessions),
        std::slice::from_ref(&hex),
        "only the project's record remains"
    );

    rig.opacity_step(&handle, 0.35);
    let record = rig.sessions.join(&hex);
    drop(rig.projects);
    drop(rig.recorder);
    assert!(record.join("locations.json").is_file());
    let lines = history(&record);
    // The header, the filter step, the mark, then the step recorded after the save.
    assert_eq!(lines.len(), 4);
    assert_eq!(lines[0]["project"], saved.project.as_str());
    assert_eq!(lines[3]["step"]["parent"], lines[1]["step"]["id"]);
}

/// Not named by the form. A workspace the steps do not reach is saved, and the result says why no
/// mark was written: a style value that differs from the last step's, then a filter no step
/// applied. The history holds no mark after either save.
///
/// RECORDED MUTATION: `differs` reports no difference. Expected failure: the first save's mark is
/// written.
#[test]
fn a_workspace_the_steps_do_not_reach_is_saved_and_the_mark_is_withheld() {
    let rig = rig("withheld");
    let (handle, ds) = rig.open_inside("data/parcels.parquet");
    rig.opacity_step(&handle, 0.5);
    // The saved style says 0.35; the last step set 0.5.
    let first = rig
        .projects
        .save(
            handle.as_str(),
            &ds,
            Some(&rig.folder),
            workspace(&ds, None, -4.5),
        )
        .expect("saved");
    assert_eq!(
        first.history_mark,
        HistoryMark::Withheld(Withheld::WorkspaceDiffers("style"))
    );
    // The saved filter was never applied by a step.
    rig.opacity_step(&handle, 0.35);
    let second = rig
        .projects
        .save(
            handle.as_str(),
            &ds,
            None,
            workspace(&ds, Some(FILTER), -4.5),
        )
        .expect("saved");
    assert_eq!(
        second.history_mark,
        HistoryMark::Withheld(Withheld::WorkspaceDiffers("filter"))
    );
    let record = rig.sessions.join(first.project.hex());
    drop(rig.projects);
    drop(rig.recorder);
    let lines = history(&record);
    assert!(
        lines.iter().all(|l| l.get("mark").is_none()),
        "no mark was written"
    );
}

/// A style document whose fill colour is a match on `zone`: `cases` are `(when, then)` pairs, and
/// the other three properties are [`STYLE`]'s.
fn match_style(cases: &[(&str, &str)]) -> style::StyleDocument {
    let cases: Vec<Value> = cases
        .iter()
        .map(|(when, then)| serde_json::json!({ "when": when, "then": then }))
        .collect();
    let fill = serde_json::json!({"match": {"column": "zone", "cases": cases,
        "on_null": "#cccccc", "on_unmatched": "#999999"}});
    let mut document: Value = serde_json::from_str(STYLE).expect("STYLE is JSON");
    document["layer"]["fill_color"] = fill;
    style::parse(&document.to_string()).expect("a style document with a match")
}

/// **K-W3** (Amendment 7 item 2 (b)): a save after a recorded `fillColor` match marks the history
/// only if the saved workspace holds that match. The same match is `Written`; one case's colour
/// changed, or the cases in another order, is `Withheld` for the style; and a literal recorded after
/// the match, held by the saved workspace, is `Written`.
///
/// RECORDED MUTATION: `Reached` does not note a match (the `FillColorMatch` arm of `note` is
/// removed). Expected failure: the match is not compared, so the changed case colour is saved with
/// its mark written, and this test fails at the first `Withheld` assertion.
#[test]
fn a_save_after_a_recorded_match_marks_only_a_workspace_holding_that_match() {
    let rig = rig("kw3");
    let (handle, ds) = rig.open_inside("data/parcels.parquet");
    let recorded = [("civic", "#ff0000"), ("park", "#00aa00")];
    let wire = serde_json::json!({
        "skp": SKP_VERSION, "dataset": handle.as_str(),
        "intent": {"action": "style.set", "params": {"property": "fillColor", "value": {
            "match": {"column": "zone",
                "cases": [{"when": "civic", "then": "#ff0000"}, {"when": "park", "then": "#00aa00"}],
                "on_null": "#cccccc", "on_unmatched": "#999999"}}}}
    });
    let req: RecordStepRequest = serde_json::from_value(wire).expect("decodes as the request");
    rig.recorder
        .record_step(req)
        .expect("the match is recorded");
    let with = |cases: &[(&str, &str)]| Workspace {
        style: match_style(cases),
        ..workspace(&ds, None, -4.5)
    };

    let same = rig
        .projects
        .save(handle.as_str(), &ds, Some(&rig.folder), with(&recorded))
        .expect("saved");
    assert_eq!(same.history_mark, HistoryMark::Written);
    let differs = Some(HistoryMark::Withheld(Withheld::WorkspaceDiffers("style")));
    let changed = [("civic", "#ff0000"), ("park", "#00ab00")];
    let swapped = [("park", "#00aa00"), ("civic", "#ff0000")];
    for held in [&changed[..], &swapped[..]] {
        let saved = rig
            .projects
            .save(handle.as_str(), &ds, None, with(held))
            .expect("saved");
        assert_eq!(Some(saved.history_mark), differs, "{held:?}");
    }

    rig.step(
        &handle,
        StepIntent::StyleSet(StyleSetParams::FillColor {
            value: "#4285f4".to_string(),
        }),
    );
    let literal = rig
        .projects
        .save(handle.as_str(), &ds, None, workspace(&ds, None, -4.5))
        .expect("saved");
    assert_eq!(literal.history_mark, HistoryMark::Written);
    let record = rig.sessions.join(same.project.hex());
    drop(rig.projects);
    drop(rig.recorder);
    let marks = history(&record)
        .iter()
        .filter(|l| l.get("mark").is_some())
        .count();
    assert_eq!(
        marks, 2,
        "a mark for each of the two saves that held the steps"
    );
}

// ---------------------------------------------------------------------------------------------
// K-S10 to K-S13: refusals, and the folders record
// ---------------------------------------------------------------------------------------------

/// **K-S10**: a first save into a folder that already holds `project.spatial` is refused by name,
/// leaves the file as it was, and writes nothing in the machine store.
///
/// RECORDED MUTATION: the existence check is removed. Expected failure: the save returns `Ok`.
#[test]
fn a_first_save_into_a_folder_holding_a_project_is_refused() {
    let rig = rig("ks10");
    let (handle, ds) = rig.open_inside("data/parcels.parquet");
    let there = rig.folder.join(PROJECT_FILE_NAME);
    std::fs::write(&there, b"someone else's project").expect("a project file");
    let refused = rig
        .projects
        .save(
            handle.as_str(),
            &ds,
            Some(&rig.folder),
            workspace(&ds, None, -4.5),
        )
        .expect_err("the folder holds a project");
    assert!(
        matches!(&refused, SaveFailure::FolderHoldsProject(p) if *p == rig.folder),
        "{refused}"
    );
    assert!(refused.to_string().contains(PROJECT_FILE_NAME));
    assert_eq!(
        std::fs::read(&there).expect("file"),
        b"someone else's project"
    );
    assert!(
        !rig.machine.exists(),
        "nothing was written in the machine store"
    );
}

/// Not named by the form. A first save with no folder is refused by name and writes nothing.
///
/// RECORDED MUTATION: the folder requirement is removed (the folder defaults to the data's own).
/// Expected failure: the save returns `Ok`.
#[test]
fn a_first_save_without_a_folder_is_refused_and_writes_nothing() {
    let rig = rig("nofolder");
    let (handle, ds) = rig.open_inside("data/parcels.parquet");
    let refused = rig
        .projects
        .save(handle.as_str(), &ds, None, workspace(&ds, None, -4.5))
        .expect_err("no folder");
    assert!(matches!(refused, SaveFailure::FolderRequired), "{refused}");
    assert!(!rig.folder.join(PROJECT_FILE_NAME).exists());
    assert!(
        !rig.machine.exists(),
        "nothing was written in the machine store"
    );
}

/// **K-S11**: data inside the folder whose path has no canonical spelling is saved, not refused,
/// with `machine-recorded` alone, and the judgment says the spelling is why. The file's name holds
/// U+007F, which ADR-036 §5's canonical form refuses and which both Windows and POSIX file systems
/// accept.
///
/// RECORDED MUTATION: `save` refuses a judgment of `NoCanonicalSpelling`. Expected failure: the
/// save returns an error.
#[test]
fn inside_data_with_no_canonical_spelling_is_saved_with_machine_recorded_only() {
    let rig = rig("ks11");
    let (handle, ds) = rig.open_inside("data/par\u{7f}cels.parquet");
    let saved = rig
        .projects
        .save(
            handle.as_str(),
            &ds,
            Some(&rig.folder),
            workspace(&ds, None, -4.5),
        )
        .expect("the save is not refused");
    assert_eq!(
        saved.carried,
        Carried::MachineRecordedOnly(Why::NoCanonicalSpelling)
    );
    assert_eq!(locators(&rig.project_file()), [Locator::MachineRecorded]);
}

/// **K-S12**: a save over a project file that records a kept lineage is refused by name, and the
/// file is left as it was. The first save is made by `save`; the file is then replaced by one that
/// a later version would write, with a lineage member that records a lineage.
///
/// RECORDED MUTATION: the refusal is removed. Expected failure: the second save returns `Ok`.
#[test]
fn saving_over_a_kept_lineage_is_refused_by_name() {
    let rig = rig("ks12");
    let (handle, ds) = rig.open_inside("data/parcels.parquet");
    rig.projects
        .save(
            handle.as_str(),
            &ds,
            Some(&rig.folder),
            workspace(&ds, None, -4.5),
        )
        .expect("first save");
    let mut file = read_project(&rig.project_file()).expect("file");
    file.lineage = Lineage::Kept {
        sha256: format!("sha256:{}", "ab".repeat(32)),
        steps: 3,
    };
    let kept = write_project(&file).expect("a file with a kept lineage");
    std::fs::write(rig.folder.join(PROJECT_FILE_NAME), &kept).expect("replaced");

    let refused = rig
        .projects
        .save(handle.as_str(), &ds, None, workspace(&ds, None, -3.0))
        .expect_err("a kept lineage is not replaced");
    assert!(matches!(refused, SaveFailure::LineageNotKept), "{refused}");
    assert_eq!(rig.project_file(), kept.as_bytes());
}

/// **K-S13**: the first save records its folder as `first` in `folders.json` in the project's
/// machine folder, with an empty `same`, and `locations.json` beside it holds where the data was
/// found. The record is the identity's 32 hex characters.
///
/// RECORDED MUTATION: `folders.json` is not written at the first save. Expected failure: the file
/// is missing.
#[test]
fn the_first_save_records_its_folder_as_first_in_folders_json() {
    let rig = rig("ks13");
    let (handle, ds) = rig.open_inside("data/parcels.parquet");
    let saved = rig
        .projects
        .save(
            handle.as_str(),
            &ds,
            Some(&rig.folder),
            workspace(&ds, None, -4.5),
        )
        .expect("saved");
    let record = rig.machine.join(saved.project.hex());
    let bytes = std::fs::read(record.join("folders.json")).expect("folders.json");
    let known = KnownFolders::from_bytes(&bytes).expect("the reader accepts folders.json");
    let first = std::path::absolute(&rig.folder).expect("absolute");
    assert_eq!(
        known,
        KnownFolders {
            first,
            same: Vec::new()
        }
    );
    let locations = std::fs::read_to_string(record.join("locations.json")).expect("locations.json");
    assert!(
        names(
            &locations,
            &std::path::absolute(ds.path())
                .expect("abs")
                .display()
                .to_string()
        ),
        "locations.json holds the path"
    );
    assert_eq!(
        file_names(&record),
        ["folders.json", "locations.json"],
        "no temp file is left"
    );
}
