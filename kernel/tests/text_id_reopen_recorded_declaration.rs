// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **A refusal of `id` names the source the engine checked** (`text-id-reopen-with-a-recorded-
//! declaration`, the follow-up to text-id's C1): `engine.identity_unusable` carries `identity_source`
//! from the engine's own variant, and the kernel passes it through as it passes `column`. At a reopen
//! whose project file records a declaration of `id`, the field reads `mapped:id`, so that the shell
//! does not offer the choice to open by row position beside it (ADR-016 Amendment 3, Decision 1).
//!
//! Every file is generated here by `spatial_engine::fixture`. The reopens go through
//! `Projects::open_project_command`, the call the wire's `open_project` makes.

mod watch_support;

use std::path::{Path, PathBuf};
use std::sync::Arc;

use serde_json::{json, Value};
use spatial_engine::fixture::{write_geoparquet, AttributeMode, FixtureSpec, IdentityMode};
use spatial_kernel::project::{Projects, PROJECT_FILE_NAME};
use spatial_kernel::session_history::StepRecorder;
use spatial_kernel::skp::{session_end_channel, SkpHost, StreamRegistry};
use spatial_kernel::Catalog;
use spatial_skp::v0::{
    CloseDatasetRequest, DatasetHandle, HexF64, IdentityDeclaration, OpenDatasetRequest,
    OpenProjectRequest, SaveProjectRequest, SkpError, SKP_VERSION,
};

const STYLE: &str = r##"{"style_version":1,"layer":{"geometry":"polygon","fill_color":{"literal":"#4285f4"},"fill_opacity":{"literal":0.35},"outline_color":{"literal":"#000000"},"outline_width":{"literal":1.5}}}"##;

struct Rig {
    dir: PathBuf,
    folder: PathBuf,
    host: Arc<SkpHost>,
    projects: Projects,
}

fn rig(name: &str) -> Rig {
    let dir = std::env::temp_dir()
        .join("spatial-ide-text-id-reopen-recorded-declaration-tests")
        .join(name);
    let _ = std::fs::remove_dir_all(&dir);
    let folder = dir.join("project");
    std::fs::create_dir_all(&folder).expect("scratch folder");
    let host = Arc::new(SkpHost::new(
        Arc::new(Catalog::new()),
        StreamRegistry::new(),
        watch_support::no_watch_arm(),
        session_end_channel().0,
    ));
    let recorder = Arc::new(StepRecorder::new(dir.join("sessions"), host.clone()));
    let projects = Projects::new(dir.join("machine"), recorder);
    Rig {
        dir,
        folder,
        host,
        projects,
    }
}

/// A fixture at `path` in the given identity mode, with a `zone` column.
fn write_fixture(path: &Path, identity: IdentityMode) {
    std::fs::create_dir_all(path.parent().expect("a parent")).expect("the data folder");
    let spec = FixtureSpec {
        features: 40,
        avg_vertices: 8,
        seed: 1,
        attributes: AttributeMode::CategoricalZone,
        identity,
        ..Default::default()
    };
    write_geoparquet(path, &spec).expect("fixture");
}

fn open_request(
    path: &Path,
    identity: Option<&str>,
    set_aside_file_id: bool,
) -> OpenDatasetRequest {
    OpenDatasetRequest {
        skp: SKP_VERSION.to_string(),
        path: path.display().to_string(),
        cancel_key: "k".to_string(),
        crs_assertion: None,
        identity: identity.map(|column| IdentityDeclaration {
            column: column.to_string(),
        }),
        set_aside_file_id,
    }
}

fn workspace() -> Value {
    let hex = |x: f64| HexF64(x).to_hex();
    json!({
        "filter": Value::Null,
        "clauses": [],
        "style": serde_json::from_str::<Value>(STYLE).expect("STYLE is JSON"),
        "view": {"centre": [hex(2_600_000.5), hex(1_200_000.25)], "zoom": hex(-4.5)}
    })
}

impl Rig {
    fn data(&self) -> PathBuf {
        self.folder.join("data/parcels.parquet")
    }

    fn save(&self, handle: &DatasetHandle) {
        let wire = json!({
            "skp": SKP_VERSION, "dataset": handle.as_str(),
            "folder": self.folder.display().to_string(), "workspace": workspace()
        });
        let req: SaveProjectRequest = serde_json::from_value(wire).expect("the save's request");
        self.projects.save_project(req).expect("saved");
    }

    fn close(&self, handle: &DatasetHandle) {
        let (skp, dataset) = (SKP_VERSION.to_string(), handle.clone());
        let closed = self
            .host
            .close_dataset(CloseDatasetRequest { skp, dataset });
        closed.expect("closed");
        self.projects.release_ended();
    }

    fn reopen(&self, set_aside_file_id: bool) -> Result<Value, SkpError> {
        let wire = json!({
            "skp": SKP_VERSION, "folder": self.folder.display().to_string(),
            "cancel_key": "k", "answer": Value::Null, "relink": Value::Null,
            "set_aside_file_id": set_aside_file_id
        });
        let req: OpenProjectRequest = serde_json::from_value(wire).expect("the request");
        let reply = self.projects.open_project_command(req)?;
        Ok(serde_json::to_value(&reply).expect("the reply serializes"))
    }

    fn project_bytes(&self) -> Vec<u8> {
        std::fs::read(self.folder.join(PROJECT_FILE_NAME)).expect("the project file")
    }
}

/// **K-R1.** A reopen names the source of the `id` it refused.
///
/// (i) P1, by a real save: the default spec opened with `identity {column: "id"}` (admitted as
/// `mapped:id`), saved, closed, and then the data file's bytes at the recorded place replaced by file
/// A's (a text `id`). Reopened with no choice, it is refused as `engine.identity_unusable`, naming
/// `id`, with `identity_source` `mapped:id`: the declaration is the project file's. Reopened with the
/// choice, it is refused as `engine.identity_set_aside_refused`, as before this piece: the
/// engine refuses the choice beside a declaration. (ii) P0, saved after a set-aside open of file A,
/// records `"identity": null`, and its reopen is refused with `identity_source` `file:id`. The bytes
/// of P1 are the same after both calls.
///
/// Mutation M-RD3: the `identity_unusable` arm of `error_of` writes `file:id` whatever the engine
/// carries. Expected failure: this test fails at (i)'s `identity_source` assertion.
#[test]
fn a_reopen_whose_project_file_records_a_declaration_of_id_names_it_mapped() {
    // (i) P1.
    let p1 = rig("kr1-p1");
    write_fixture(&p1.data(), IdentityMode::NativeUnique);
    let opened = p1
        .host
        .open_dataset(open_request(&p1.data(), Some("id"), false))
        .expect("the default spec opens with `id` declared");
    p1.save(&opened.dataset);
    p1.close(&opened.dataset);
    let recorded = String::from_utf8(p1.project_bytes()).expect("UTF-8");
    let file: Value = serde_json::from_str(&recorded).expect("JSON");
    assert_eq!(
        file["datasets"][0]["admission"]["identity"],
        json!({"column": "id"}),
        "P1 records the declaration of `id`: {recorded}"
    );
    write_fixture(&p1.data(), IdentityMode::StringIds);
    let before = p1.project_bytes();

    let refused = p1
        .reopen(false)
        .expect_err("a text `id` cannot serve as the declared identity");
    assert_eq!(refused.code, "engine.identity_unusable", "{refused:?}");
    assert_eq!(refused.fields.get("column").map(String::as_str), Some("id"));
    assert_eq!(
        refused.fields.get("identity_source").map(String::as_str),
        Some("mapped:id"),
        "(i) the declaration is the project file's: {refused:?}"
    );
    let chosen = p1
        .reopen(true)
        .expect_err("the choice beside a recorded declaration is refused");
    assert_eq!(
        chosen.code, "engine.identity_set_aside_refused",
        "{chosen:?}"
    );
    assert_eq!(before, p1.project_bytes(), "neither call wrote P1");

    // (ii) P0: saved after a set-aside open of file A, it records `null`.
    let p0 = rig("kr1-p0");
    write_fixture(&p0.data(), IdentityMode::StringIds);
    let opened = p0
        .host
        .open_dataset(open_request(&p0.data(), None, true))
        .expect("the choice opens file A");
    p0.save(&opened.dataset);
    p0.close(&opened.dataset);
    let refused = p0.reopen(false).expect_err("file A's `id` refuses");
    assert_eq!(refused.code, "engine.identity_unusable", "{refused:?}");
    assert_eq!(refused.fields.get("column").map(String::as_str), Some("id"));
    assert_eq!(
        refused.fields.get("identity_source").map(String::as_str),
        Some("file:id"),
        "(ii) no declaration was recorded: {refused:?}"
    );
}

/// **K-R2.** A direct open names the source of the column it refused: file A with no declaration,
/// `file:id`; with `nope` declared, `mapped:nope`. Each value is the engine's, as the engine built it.
///
/// Mutation M-RD4: the `identity_unusable` arm of `error_of` leaves the field out. Expected failure:
/// this test fails at the first assertion, on the missing field.
#[test]
fn a_direct_open_names_the_source_of_the_refused_column() {
    let rig = rig("kr2");
    let path = rig.dir.join("file-a.parquet");
    write_fixture(&path, IdentityMode::StringIds);

    let refused = rig
        .host
        .open_dataset(open_request(&path, None, false))
        .expect_err("file A's `id` refuses");
    assert_eq!(refused.code, "engine.identity_unusable", "{refused:?}");
    assert_eq!(
        refused.fields.get("identity_source").map(String::as_str),
        Some("file:id"),
        "no declaration: {refused:?}"
    );

    let refused = rig
        .host
        .open_dataset(open_request(&path, Some("nope"), false))
        .expect_err("a declared column the file lacks refuses");
    assert_eq!(refused.code, "engine.identity_unusable", "{refused:?}");
    assert_eq!(
        refused.fields.get("column").map(String::as_str),
        Some("nope")
    );
    assert_eq!(
        refused.fields.get("identity_source").map(String::as_str),
        Some("mapped:nope"),
        "`nope` declared: {refused:?}"
    );
}
