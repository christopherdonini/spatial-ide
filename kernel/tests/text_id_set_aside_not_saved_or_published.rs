// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **The choice to set aside a file's own `id` column is the session's alone** (ADR-016,
//! Amendment 3, C2): nothing of it is saved, recorded or published, and a project saved after an
//! open made by the choice refuses the column again when it is reopened, and opens on the session
//! tier only when the choice is made again.
//!
//! Every file is generated here by `spatial_engine::fixture`. Each scan below has a positive
//! control: the same scan finds what it looks for in a document that holds it. Nothing here times
//! anything.

mod watch_support;

use std::path::{Path, PathBuf};
use std::sync::Arc;

use serde_json::{json, Value};
use spatial_engine::fixture::{
    write_geoparquet, AttributeMode, CrsMode, FixtureSpec, IdentityMode,
};
use spatial_engine::{CancelToken, Dataset};
use spatial_kernel::project::{Projects, PROJECT_FILE_NAME};
use spatial_kernel::publish::{
    self, CorrespondingSource, CorrespondingSourceKind, PublishRequest, ViewerAsset, ViewerAssets,
    ViewerLicenseInput,
};
use spatial_kernel::session_history::{recover, StepRecorder};
use spatial_kernel::skp::{session_end_channel, SkpHost, StreamRegistry};
use spatial_kernel::Catalog;
use spatial_skp::v0::{
    CloseDatasetRequest, DatasetHandle, DescribeRequest, HexF64, OpenDatasetRequest,
    OpenProjectRequest, RecordStepRequest, SaveProjectRequest, SkpError, StepIntent,
    StyleSetParams, SKP_VERSION,
};

const STYLE: &str = r##"{"style_version":1,"layer":{"geometry":"polygon","fill_color":{"literal":"#4285f4"},"fill_opacity":{"literal":0.35},"outline_color":{"literal":"#000000"},"outline_width":{"literal":1.5}}}"##;

/// What a document may not hold after an open made by the choice. Lower case, matched without
/// regard to the case of the document.
const NEEDLES: [&str; 4] = [
    "set_aside",
    "set-aside",
    "file_row_number",
    "session-ordinal",
];

struct Rig {
    dir: PathBuf,
    folder: PathBuf,
    host: Arc<SkpHost>,
    recorder: Arc<StepRecorder>,
    projects: Projects,
}

fn rig(name: &str) -> Rig {
    let dir = std::env::temp_dir()
        .join("spatial-ide-text-id-set-aside-tests")
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
    let projects = Projects::new(dir.join("machine"), recorder.clone());
    Rig {
        dir,
        folder,
        host,
        recorder,
        projects,
    }
}

/// File A: a text `id` and no integer column, written at `path`, with a `zone` column.
fn write_text_id(path: &Path) {
    std::fs::create_dir_all(path.parent().expect("a parent")).expect("the data folder");
    let spec = FixtureSpec {
        features: 40,
        avg_vertices: 8,
        seed: 1,
        attributes: AttributeMode::CategoricalZone,
        identity: IdentityMode::StringIds,
        ..Default::default()
    };
    write_geoparquet(path, &spec).expect("fixture");
}

fn open_request(path: &Path, set_aside_file_id: bool) -> OpenDatasetRequest {
    OpenDatasetRequest {
        skp: SKP_VERSION.to_string(),
        path: path.display().to_string(),
        cancel_key: "k".to_string(),
        crs_assertion: None,
        identity: None,
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
    /// File A inside the project folder, opened by the choice.
    fn open_set_aside(&self) -> (DatasetHandle, PathBuf) {
        let data = self.folder.join("data/parcels.parquet");
        write_text_id(&data);
        let opened = self
            .host
            .open_dataset(open_request(&data, true))
            .expect("the choice opens the file");
        (opened.dataset, data)
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
}

/// The needles `text` holds, found without regard to case.
fn needles_in(text: &str) -> Vec<&'static str> {
    let lower = text.to_ascii_lowercase();
    NEEDLES
        .iter()
        .copied()
        .filter(|n| lower.contains(n))
        .collect()
}

/// Every needle fires on a document that holds it, so a clean result below means something.
fn the_scan_fires_on_what_it_guards() {
    for needle in NEEDLES {
        let planted = json!({ "planted": needle.to_ascii_uppercase() }).to_string();
        assert_eq!(needles_in(&planted), vec![needle], "{needle} is not found");
    }
}

/// **K-4.** The `project.spatial` that `save_project` writes after an open made by the choice
/// records the admission's identity as `null`, as for any open that declared none, and none of the
/// choice's words: not the member, not the row-position column, not the session tier's class.
///
/// Mutation M-13: `DatasetRef::linked` records a declared identity on `id` when the open set it
/// aside. Expected failure: this test fails at the identity assertion.
#[test]
fn a_project_file_after_a_set_aside_open_records_identity_null_and_no_choice() {
    let rig = rig("k4");
    let (handle, _data) = rig.open_set_aside();
    let ds = rig.host.catalog().get(handle.as_str()).expect("catalog");
    assert_eq!(ds.identity().set_aside_column(), Some("id"), "set aside");
    rig.save(&handle);

    let bytes = std::fs::read(rig.folder.join(PROJECT_FILE_NAME)).expect("the project file");
    let text = String::from_utf8(bytes).expect("UTF-8");
    let file: Value = serde_json::from_str(&text).expect("JSON");
    let entry = &file["datasets"][0];
    assert!(
        entry["admission"]
            .get("identity")
            .is_some_and(Value::is_null),
        "the identity is present and null: {}",
        entry["admission"]
    );
    assert_eq!(needles_in(&text), Vec::<&str>::new(), "{text}");
    the_scan_fires_on_what_it_guards();
}

/// **K-5.** The session history of a set-aside open, with a step recorded over it, holds none of the
/// choice's words in any line.
///
/// Mutation M-14: the admission object that `DatasetRef::to_json` writes gains the member
/// `set_aside_file_id`. Expected failure: the step's record is refused as `skp.session_history_unwritable` (the history's reader rule refuses an unknown member), so this test fails at `record_step`, before the scan of the history's lines.
#[test]
fn a_session_history_after_a_set_aside_open_records_no_choice() {
    let rig = rig("k5");
    let (handle, _data) = rig.open_set_aside();
    let step = RecordStepRequest {
        skp: SKP_VERSION.to_string(),
        dataset: handle.clone(),
        intent: StepIntent::StyleSet(StyleSetParams::FillOpacity { value: 0.5 }),
    };
    rig.recorder.record_step(step).expect("recorded");
    let sessions = rig.dir.join("sessions");
    // A live history is locked, and `projects` holds the recorder too: both go before the read.
    drop(rig.projects);
    drop(rig.recorder);

    let records: Vec<PathBuf> = std::fs::read_dir(&sessions)
        .expect("the store root")
        .map(|e| e.expect("entry").path())
        .collect();
    assert_eq!(records.len(), 1, "one record in {sessions:?}");
    let got = recover(&records[0]);
    assert!(got.failure.is_none(), "{:?}", got.failure);
    assert!(got.lines.len() >= 2, "a header and a step");
    for line in &got.lines {
        assert_eq!(needles_in(line), Vec::<&str>::new(), "{line}");
    }
    the_scan_fires_on_what_it_guards();
}

fn viewer() -> ViewerAssets {
    ViewerAssets::new(vec![
        ViewerAsset {
            path: "index.html".into(),
            bytes: b"<!doctype html><title>t</title>".to_vec(),
        },
        ViewerAsset {
            path: "NOTICE.txt".into(),
            bytes: b"stub notice\n".to_vec(),
        },
    ])
    .unwrap()
}

fn clock() -> String {
    "2026-11-27T12:00:00Z".to_string()
}

fn publish_request<'a>(
    ds: &'a Dataset,
    v: &'a ViewerAssets,
    destination: PathBuf,
) -> PublishRequest<'a> {
    PublishRequest {
        dataset: ds,
        dataset_name: "parcels",
        query: spatial_engine::ViewportQuery::all(),
        attributes: vec!["zone".to_string()],
        style_source: STYLE,
        viewer: v,
        viewer_license: ViewerLicenseInput {
            program: "Spatial IDE bundle viewer".into(),
            copyright: "Copyright (C) 2026 the Spatial IDE contributors".into(),
            license: "AGPL-3.0-or-later".into(),
            notice_path: "NOTICE.txt".into(),
            corresponding_source: CorrespondingSource {
                kind: CorrespondingSourceKind::Url,
                at: "https://example.org/spatial-ide".into(),
            },
        },
        license: None,
        destination,
        started_at: "2026-11-27T12:00:00Z".into(),
        finished_at: &clock,
    }
}

/// **K-6.** A dataset opened by the choice is on the session tier, and publish refuses it before any
/// pin is taken and before anything is created, with the code it refuses every session-tier dataset.
///
/// Mutation M-15: the publish check exempts a dataset whose identity records a set-aside. Expected
/// failure: this test fails at "preflight_pinless admitted a set-aside open".
#[test]
fn publish_refuses_a_set_aside_open_as_session_tier() {
    let rig = rig("k6");
    let path = rig.dir.join("parcels.parquet");
    write_geoparquet(
        &path,
        &FixtureSpec {
            features: 200,
            attributes: AttributeMode::CategoricalZone,
            crs_mode: CrsMode::DeclaredLv95,
            identity: IdentityMode::StringIds,
            ..Default::default()
        },
    )
    .unwrap();
    let catalog = Catalog::new();
    catalog
        .open_cancellable_setting_aside_file_id("set_aside", &path, None, None, &CancelToken::new())
        .expect("the choice opens the file");
    let ds = catalog.get("set_aside").expect("the catalog holds it");
    assert_eq!(ds.identity().set_aside_column(), Some("id"));
    assert!(
        ds.content_pin().is_none(),
        "the refusal comes before any pin"
    );

    let v = viewer();
    let destination = rig.dir.join("bundle");
    let req = publish_request(&ds, &v, destination.clone());
    match publish::preflight_pinless(&req) {
        Err(e) => assert_eq!(e.code(), "publish.session_identity_not_publishable", "{e}"),
        Ok(()) => panic!("preflight_pinless admitted a set-aside open"),
    }
    assert!(ds.content_pin().is_none(), "no pin was taken");
    assert!(!destination.exists(), "nothing is created");
}

/// **K-7** (C2). A project saved after an open made by the choice reopens, with no choice made, as a
/// refusal of the file's own `id` column, which names that column; and with the choice made again, as
/// an open on the session tier whose `describe` carries the choice. The project file is the same
/// before and after: it holds nothing of the choice, and neither call writes it.
///
/// Mutation M-16: `open_project` passes `false` for the choice whatever the request carries.
/// Expected failure: this test fails at the second call, which is refused.
#[test]
fn a_project_saved_after_a_set_aside_open_refuses_on_reopen_and_opens_only_when_asked_again() {
    let rig = rig("k7");
    let (handle, _data) = rig.open_set_aside();
    rig.save(&handle);
    rig.close(&handle);
    let before = std::fs::read(rig.folder.join(PROJECT_FILE_NAME)).expect("the project file");

    let refused = rig.reopen(false).expect_err("the column refuses on reopen");
    assert_eq!(refused.code, "engine.identity_unusable", "{refused:?}");
    assert_eq!(
        refused.fields.get("column").map(String::as_str),
        Some("id"),
        "the refusal names the file's own id"
    );

    let opened = rig.reopen(true).expect("the choice, made again, opens it");
    let dataset = opened["opened"]["dataset"]
        .as_str()
        .expect("a dataset handle")
        .to_string();
    let described = rig
        .host
        .describe(DescribeRequest {
            skp: SKP_VERSION.to_string(),
            dataset: serde_json::from_value(Value::String(dataset)).expect("a handle"),
        })
        .expect("describe");
    assert_eq!(described.identity.set_aside_column.as_deref(), Some("id"));
    assert_eq!(described.identity.class, "session-ordinal");

    let after = std::fs::read(rig.folder.join(PROJECT_FILE_NAME)).expect("the project file");
    assert_eq!(before, after, "neither call wrote the project file");
}
