// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **`save_project` as an SKP command** (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md`, P3; the
//! form's step 1 table does not name these tests), from the real shape: a real
//! `SkpHost::open_dataset` over a fixture generated in the test, a `StepRecorder`, and
//! `Projects::save_project` called with a request decoded from its wire JSON. The project file is
//! read back by the reader the kernel ships. A live history is locked, and on Windows a locked file
//! cannot be read by another handle, which no test here needs.

mod watch_support;

use std::path::{Path, PathBuf};
use std::sync::Arc;

use serde_json::{json, Value};
use spatial_engine::fixture::{write_geoparquet, AttributeMode, FixtureSpec};
use spatial_kernel::project::file::read_project;
use spatial_kernel::project::{Projects, PROJECT_FILE_NAME};
use spatial_kernel::session_history::StepRecorder;
use spatial_kernel::skp::{session_end_channel, SkpHost, StreamRegistry};
use spatial_kernel::Catalog;
use spatial_skp::v0::{
    DatasetHandle, HexF64, OpenDatasetRequest, ProjectRelativeLocator, RecordStepRequest,
    SaveProjectRequest, SkpError, StepIntent, StyleSetParams, SKP_VERSION,
};

const STYLE: &str = r##"{"style_version":1,"layer":{"geometry":"polygon","fill_color":{"literal":"#4285f4"},"fill_opacity":{"literal":0.35},"outline_color":{"literal":"#000000"},"outline_width":{"literal":1.5}}}"##;

struct Rig {
    dir: PathBuf,
    /// The project folder, which exists and is empty.
    folder: PathBuf,
    machine: PathBuf,
    host: Arc<SkpHost>,
    recorder: Arc<StepRecorder>,
    projects: Projects,
    handle: DatasetHandle,
}

fn rig(name: &str) -> Rig {
    let dir = std::env::temp_dir()
        .join("spatial-ide-project-save-skp-tests")
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
    let data = dir.join("data").join("parcels.parquet");
    std::fs::create_dir_all(data.parent().expect("a parent")).expect("the data folder");
    let spec = FixtureSpec {
        features: 500,
        avg_vertices: 12,
        seed: 1,
        attributes: AttributeMode::CategoricalZone,
        ..Default::default()
    };
    write_geoparquet(&data, &spec).expect("fixture");
    let req = OpenDatasetRequest {
        skp: SKP_VERSION.to_string(),
        path: data.display().to_string(),
        cancel_key: "k".to_string(),
        crs_assertion: None,
        identity: None,
    };
    let handle = host.open_dataset(req).expect("open").dataset;
    Rig {
        dir,
        folder,
        machine,
        host,
        recorder,
        projects,
        handle,
    }
}

impl Rig {
    /// The wire request for a save: `folder` as given, the style of [`STYLE`], no filter.
    fn wire(&self, folder: Option<&Path>, centre: [f64; 2], zoom: f64) -> Value {
        json!({
            "skp": SKP_VERSION,
            "dataset": self.handle.as_str(),
            "folder": folder.map(|f| f.display().to_string()),
            "workspace": {
                "filter": null,
                "clauses": [],
                "style": serde_json::from_str::<Value>(STYLE).expect("STYLE is JSON"),
                "view": {
                    "centre": [HexF64(centre[0]).to_hex(), HexF64(centre[1]).to_hex()],
                    "zoom": HexF64(zoom).to_hex(),
                }
            }
        })
    }

    fn save(&self, wire: Value) -> Result<spatial_skp::v0::SaveProjectResponse, SkpError> {
        let req: SaveProjectRequest = serde_json::from_value(wire).expect("decodes as the request");
        self.projects.save_project(req)
    }

    fn record_opacity(&self, value: f64) {
        let req = RecordStepRequest {
            skp: SKP_VERSION.to_string(),
            dataset: self.handle.clone(),
            intent: StepIntent::StyleSet(StyleSetParams::FillOpacity { value }),
        };
        self.recorder.record_step(req).expect("recorded");
    }

    /// The names in `dir`, sorted; empty if it does not exist.
    fn names(dir: &Path) -> Vec<String> {
        let Ok(entries) = std::fs::read_dir(dir) else {
            return Vec::new();
        };
        let mut names: Vec<String> = entries
            .map(|e| e.expect("entry").file_name().to_string_lossy().into_owned())
            .collect();
        names.sort();
        names
    }
}

/// **P-S1.** A request decoded from its wire JSON saves the project, and the reply is the identity,
/// the mark and the resolver's judgment, and nothing else. The file reads back with that identity
/// and with the view's numbers bit for bit; the space is the one the dataset was admitted in; a
/// later save with `folder` null goes to the same folder under the same identity.
///
/// Mutation: the view's centre is read in the order y, x. Expected failure: this test fails at the
/// centre assertion on the first save.
#[test]
fn a_save_project_request_saves_and_the_reply_names_the_identity_and_the_mark() {
    let rig = rig("saves");
    rig.record_opacity(0.35);
    let centre = [2_600_000.5, 1_200_000.25];
    let first = rig
        .save(rig.wire(Some(&rig.folder), centre, -4.5))
        .expect("saved");
    assert_eq!(
        serde_json::to_value(&first).expect("serializes"),
        json!({"project": first.project, "history_mark": "written", "project_relative": "outside"})
    );
    assert!(
        first.project.starts_with("spatial://project/"),
        "{}",
        first.project
    );

    let bytes = std::fs::read(rig.folder.join(PROJECT_FILE_NAME)).expect("project.spatial");
    let file = read_project(&bytes).expect("the reader accepts it");
    assert_eq!(file.project.as_str(), first.project);
    assert_eq!(file.workspace.view.centre, centre);
    assert_eq!(file.workspace.view.zoom, -4.5);
    let ds = rig.host.catalog().get(rig.handle.as_str()).expect("open");
    assert_eq!(file.workspace.view.crs.identifier, ds.crs().identifier());

    let later = rig
        .save(rig.wire(None, [centre[0] + 1.0, centre[1]], -3.0))
        .expect("saved again");
    assert_eq!(later.project, first.project, "the identity is kept");
    let bytes = std::fs::read(rig.folder.join(PROJECT_FILE_NAME)).expect("project.spatial");
    let file = read_project(&bytes).expect("the reader accepts it");
    assert_eq!(
        file.workspace.view.zoom, -3.0,
        "the later save went to the same file"
    );
    assert_eq!(
        Rig::names(&rig.folder),
        [PROJECT_FILE_NAME],
        "only the project file is in the folder"
    );
}

/// **P-S2.** Each refusal of a request returns its own code, and none writes a project file or a
/// machine store file: the version, an unknown handle, a first save with no folder, a style the
/// renderer refuses, a filter that is not what the clauses combine to, a folder that already holds
/// a project, and a folder that is not one. The save that follows them all is the first.
///
/// Mutation: `save_project` skips the version check. Expected failure: this test fails at the
/// first case, whose request is then saved.
#[test]
fn each_refusal_of_a_save_project_request_has_its_code_and_writes_nothing() {
    let rig = rig("refusals");
    let at = |wire: Value| rig.save(wire).unwrap_err();
    let good = rig.wire(Some(&rig.folder), [1.0, 2.0], 0.0);

    let mut old = good.clone();
    old["skp"] = json!("skp/0.12");
    assert_eq!(at(old).code, "skp.version_unsupported");

    let mut unknown = good.clone();
    unknown["dataset"] = json!("ds_00112233445566778899aabbccddeeff");
    assert_eq!(at(unknown).code, "skp.unknown_dataset");

    let none = rig.wire(None, [1.0, 2.0], 0.0);
    let e = at(none);
    assert_eq!(e.code, "skp.project_folder_not_given");
    assert!(e.fields.is_empty(), "{:?}", e.fields);

    let mut style = good.clone();
    style["workspace"]["style"] = json!({"style_version": 1});
    let e = at(style);
    assert_eq!(e.code, "skp.project_file_refused");
    assert_eq!(e.fields["path"], "$.workspace.style");

    let mut filter = good.clone();
    filter["workspace"]["filter"] =
        json!({"predicate": "zone = 'civic'", "dialect": "duckdb-expr/0"});
    let e = at(filter);
    assert_eq!(e.code, "skp.project_file_refused");
    assert_eq!(e.fields["path"], "$.workspace.filter");

    let taken = rig.dir.join("taken");
    std::fs::create_dir_all(&taken).expect("a folder");
    std::fs::write(taken.join(PROJECT_FILE_NAME), b"already here").expect("a project");
    let e = at(rig.wire(Some(&taken), [1.0, 2.0], 0.0));
    assert_eq!(e.code, "skp.project_folder_holds_project");
    assert_eq!(e.fields["folder"], taken.display().to_string());
    assert_eq!(
        std::fs::read(taken.join(PROJECT_FILE_NAME)).expect("kept"),
        b"already here"
    );

    let e = at(rig.wire(Some(&rig.dir.join("no-such-folder")), [1.0, 2.0], 0.0));
    assert_eq!(e.code, "skp.project_file_unwritable");
    assert!(!e.fields["detail"].is_empty());

    assert_eq!(
        Rig::names(&rig.folder),
        Vec::<String>::new(),
        "nothing was written"
    );
    assert_eq!(
        Rig::names(&rig.machine),
        Vec::<String>::new(),
        "no identity was kept"
    );
    rig.save(good).expect("a first save after the refusals");
    assert_eq!(Rig::names(&rig.folder), [PROJECT_FILE_NAME]);
}

/// **P-S3.** A save on a handle whose session has ended returns the end's own code and writes
/// nothing.
///
/// Mutation: the live check is skipped. Expected failure: the save succeeds and this test fails at
/// the refusal.
#[test]
fn a_save_on_a_dataset_whose_generation_ended_is_refused_with_the_ends_code() {
    let rig = rig("ended");
    rig.host.end_generation(rig.handle.as_str());
    let e = rig
        .save(rig.wire(Some(&rig.folder), [1.0, 2.0], 0.0))
        .unwrap_err();
    assert_eq!(e.code, "engine.source_changed");
    assert_eq!(Rig::names(&rig.folder), Vec::<String>::new());
    assert_eq!(Rig::names(&rig.machine), Vec::<String>::new());
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

impl Rig {
    /// F1 written at `data` and opened through the host, then saved into `folder` with the wire
    /// request of [`Rig::wire`] naming that open; the reply's `project_relative`.
    fn save_opened_at(&self, data: &Path, folder: &Path) -> ProjectRelativeLocator {
        let req = OpenDatasetRequest {
            skp: SKP_VERSION.to_string(),
            path: data.display().to_string(),
            cancel_key: "k".to_string(),
            crs_assertion: None,
            identity: None,
        };
        let handle = self.host.open_dataset(req).expect("open").dataset;
        let mut wire = self.wire(Some(folder), [1.0, 2.0], 0.0);
        wire["dataset"] = json!(handle.as_str());
        self.save(wire).expect("saved").project_relative
    }
}

/// **K-S14** (the seam: `SkpHost::open_dataset` through `Projects::save_project`). The reply names
/// the resolver's judgment, case by case: F1 inside the folder, F2 outside it, F1 reached through a
/// junction (Windows) or a symlink (Linux) below the folder, and F1 inside the folder under a name
/// that holds U+007F. The file kept for each is not read here; the reply is what the shell sees.
///
/// Mutation: `ThroughLink` is mapped to `Outside` in the kernel's map. Expected failure: this test
/// fails at the through-link case (left `Outside`, right `ThroughLink`).
#[test]
fn the_save_reply_names_the_resolvers_judgment_carried_outside_no_canonical_spelling_or_through_link(
) {
    let rig = rig("judgment");
    let case = |name: &str| {
        let folder = rig.dir.join(name);
        std::fs::create_dir_all(&folder).expect("a project folder");
        folder
    };

    let inside = case("inside");
    let data = inside.join("data").join("parcels.parquet");
    write_f1(&data);
    assert_eq!(
        rig.save_opened_at(&data, &inside),
        ProjectRelativeLocator::Carried
    );

    let outside = case("outside");
    let data = rig.dir.join("elsewhere").join("parcels.parquet");
    write_f1(&data);
    assert_eq!(
        rig.save_opened_at(&data, &outside),
        ProjectRelativeLocator::Outside
    );

    let linked = case("linked");
    write_f1(&linked.join("data/real/parcels.parquet"));
    let alias = linked.join("data/alias");
    make_link(&alias, &linked.join("data/real"));
    let through = rig.save_opened_at(&alias.join("parcels.parquet"), &linked);
    // A junction is removed with `remove_dir`, a symlink with `remove_file`; neither follows it.
    std::fs::remove_dir(&alias)
        .or_else(|_| std::fs::remove_file(&alias))
        .expect("link removed");
    assert_eq!(through, ProjectRelativeLocator::ThroughLink);

    let spelled = case("spelled");
    let data = spelled.join("data").join("par\u{7f}cels.parquet");
    write_f1(&data);
    assert_eq!(
        rig.save_opened_at(&data, &spelled),
        ProjectRelativeLocator::NoCanonicalSpelling
    );
}
