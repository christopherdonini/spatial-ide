// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **A `relink` after a refused locator, through `open_project` as an SKP command** (the form
//! `RELINK-AFTER-REFUSAL-AT-THE-RECORDED-PLACE-PREREGISTRATION.md`, section 4, K-F1), from the
//! real shape as `project_reopen_skp.rs` has it: a real `SkpHost`, `StepRecorder` and `Projects`,
//! each request decoded from its wire JSON, and each reply as the JSON the shell receives. Nothing
//! here times anything.
//!
//! The kernel is unchanged by this piece. The test pins what the shell's new choice relies on: a
//! project whose file records its data by a path from the project folder, with that file renamed in
//! the folder, is refused at a reopen, opened by a second call with a `relink`, refused again by a
//! call without one until a save, and opened without one after the save.

mod watch_support;

use std::path::{Path, PathBuf};
use std::sync::Arc;

use serde_json::{json, Value};
use spatial_engine::fixture::{write_geoparquet, AttributeMode, FixtureSpec};
use spatial_kernel::project::store::{read_locations, LOCATIONS};
use spatial_kernel::project::{Projects, PROJECT_FILE_NAME};
use spatial_kernel::session_history::StepRecorder;
use spatial_kernel::skp::{session_end_channel, SkpHost, StreamRegistry};
use spatial_kernel::Catalog;
use spatial_skp::v0::{
    CloseDatasetRequest, DatasetHandle, HexF64, OpenDatasetRequest, OpenProjectRequest,
    SaveProjectRequest, SkpError, SKP_VERSION,
};

const STYLE: &str = r##"{"style_version":1,"layer":{"geometry":"polygon","fill_color":{"literal":"#4285f4"},"fill_opacity":{"literal":0.35},"outline_color":{"literal":"#000000"},"outline_width":{"literal":1.5}}}"##;

struct Rig {
    /// The project folder, which exists.
    folder: PathBuf,
    machine: PathBuf,
    host: Arc<SkpHost>,
    projects: Projects,
}

fn rig(name: &str) -> Rig {
    let dir = std::env::temp_dir()
        .join("spatial-ide-project-relink-inside-folder-skp-tests")
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
    let projects = Projects::new(machine.clone(), recorder);
    Rig {
        folder,
        machine,
        host,
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

/// A save's wire workspace: no filter and no clauses, [`STYLE`], and a view.
fn workspace() -> Value {
    let hex = |x: f64| HexF64(x).to_hex();
    json!({
        "filter": null,
        "clauses": [],
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
        };
        self.host.open_dataset(req).expect("open").dataset
    }

    /// A close as the shell's `close_dataset` makes it, then the release of the save's lock.
    fn close(&self, handle: &DatasetHandle) {
        let (skp, dataset) = (SKP_VERSION.to_string(), handle.clone());
        let closed = self
            .host
            .close_dataset(CloseDatasetRequest { skp, dataset });
        closed.expect("closed");
        self.projects.release_ended();
    }

    /// A save of `handle` from its wire request; a later save of a reopened project ignores `folder`.
    fn save(&self, handle: &DatasetHandle) -> String {
        let wire = json!({
            "skp": SKP_VERSION, "dataset": handle.as_str(),
            "folder": self.folder.display().to_string(), "workspace": workspace()
        });
        let req: SaveProjectRequest = serde_json::from_value(wire).expect("the save's request");
        self.projects.save_project(req).expect("saved").project
    }

    /// One `open_project` call at the project folder, decoded from its wire JSON: the reply as JSON.
    fn reopen(&self, relink: Option<&Path>) -> Result<Value, SkpError> {
        let wire = json!({
            "skp": SKP_VERSION, "folder": self.folder.display().to_string(), "cancel_key": "k",
            "answer": null, "relink": relink.map(|p| p.display().to_string())
        });
        let req: OpenProjectRequest = serde_json::from_value(wire).expect("the request");
        let reply = self.projects.open_project_command(req)?;
        Ok(serde_json::to_value(&reply).expect("the reply serializes"))
    }

    /// The handle in an `opened` reply.
    fn handle_of(reply: &Value) -> DatasetHandle {
        serde_json::from_value(reply["opened"]["dataset"].clone()).expect("a handle")
    }

    /// The path `locations.json` holds for the project's one dataset.
    fn recorded(&self, project: &str) -> PathBuf {
        let hex = project
            .strip_prefix("spatial://project/")
            .expect("an identity");
        let bytes = std::fs::read(self.machine.join(hex).join(LOCATIONS)).expect("locations.json");
        read_locations(&bytes).expect("read")[0].path.clone()
    }

    /// The `at` of the project file's `project-relative` locator, if it records one.
    fn relative_at(&self) -> Option<String> {
        let text = std::fs::read(self.folder.join(PROJECT_FILE_NAME)).expect("the file");
        let file: Value = serde_json::from_slice(&text).expect("the file is JSON");
        let locators = file["datasets"][0]["resource"]["locators"].as_array();
        let locators = locators.expect("the dataset's locators");
        let found = locators.iter().find(|l| l["kind"] == "project-relative");
        found.map(|l| l["at"].as_str().expect("an at").to_string())
    }
}

/// A refusal of the data step at a missing segment, checked: its code, its two fields and the
/// segment, which names the place the project file records.
fn refused_unresolvable(got: Result<Value, SkpError>, case: &str) {
    let e = got.expect_err(case);
    assert_eq!(e.code, "skp.project_target_unresolvable", "{case}: {e:?}");
    let names: Vec<&str> = e.fields.keys().map(String::as_str).collect();
    assert_eq!(names, ["locator", "segment"], "{case}");
    assert_eq!(e.fields["segment"], "data/parcels.parquet", "{case}");
}

/// **K-F1** (the form's section 4; F-1 to F-4 of its section 3). F1 is saved inside the project
/// folder at `data/parcels.parquet`, so the file records a `project-relative` locator, and the
/// file is renamed in the folder. F-1: the reopen is refused as `skp.project_target_unresolvable`
/// with the fields `locator` and `segment`, the segment the old name. F-2: the call with `relink`
/// to the renamed file replies `opened` under the same identity, and `locations.json` holds that
/// file's path. F-3: the open closed, a call without `relink` is refused as F-1, and the project
/// file still names the old place. F-4: a `relink` open, saved and closed, then a call without
/// `relink` replies `opened`, and the project file's `project-relative` `at` is the new name.
///
/// RECORDED MUTATIONS: (a) in `open_project`, `data_at` is consulted before the `relink`; expected
/// failure: F-2's reply. (b) in `Projects::save`, `judge` is skipped and the `reference` written;
/// expected failure: F-4's `at`.
#[test]
fn a_relink_after_a_refused_locator_opens_the_chosen_file_and_the_next_save_records_its_place() {
    let rig = rig("k-f1");
    let old = rig.folder.join("data/parcels.parquet");
    write_f1(&old);
    let handle = rig.open(&old);
    let project = rig.save(&handle);
    rig.close(&handle);
    assert_eq!(rig.relative_at().as_deref(), Some("data/parcels.parquet"));
    let new = rig.folder.join("data/renamed.parquet");
    std::fs::rename(&old, &new).expect("renamed");

    refused_unresolvable(rig.reopen(None), "F-1");

    let reply = rig.reopen(Some(&new)).expect("F-2: re-linked");
    assert_eq!(reply["opened"]["project"], project.as_str(), "{reply}");
    assert_eq!(rig.recorded(&project), new, "F-2: locations.json");
    rig.close(&Rig::handle_of(&reply));

    refused_unresolvable(rig.reopen(None), "F-3");
    assert_eq!(rig.relative_at().as_deref(), Some("data/parcels.parquet"));

    let reply = rig.reopen(Some(&new)).expect("F-2 again: re-linked");
    let handle = Rig::handle_of(&reply);
    assert_eq!(
        rig.save(&handle),
        project,
        "the later save keeps the identity"
    );
    rig.close(&handle);
    let at = rig.relative_at();
    assert_eq!(
        at.as_deref(),
        Some("data/renamed.parquet"),
        "F-4: the file's `at`"
    );

    let reply = rig.reopen(None).expect("F-4: opened without a re-link");
    assert_eq!(reply["opened"]["project"], project.as_str(), "{reply}");
}
