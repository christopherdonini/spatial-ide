// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **The lineage reader**, `session_history::read_lineage`, on hand-built files: piece 1c writes
//! no lineage, so every lineage file and previous lineage file here is made by the test (the 1c
//! form, `governance/forms/kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md`, Amendment 31 item 5:
//! L1 to L4 and K-L5 to K-L8; ADR-036 §6 and §8, and its Amendment 1 items 2, 4 and 6). The file
//! names are the test's own: the reader is given both paths. Nothing here times anything.

use std::path::{Path, PathBuf};

use spatial_kernel::project::file::Lineage;
use spatial_kernel::session_history::{
    read_lineage, recover, FolderLineage, LineageRead, LineageRefused, PreviousLineage,
};
use spatial_renderer::canonical::sha256_hex;

const URI: &str = "spatial://dataset/ref/0123456789abcdef0123456789abcdef";
const PROJECT: &str = "spatial://project/fedcba9876543210fedcba9876543210";
const HASH: &str = "abababababababababababababababababababababababababababababababab";
const OBSERVED: &str = r#"{"byte_size":27132,"modified_ns":"1700000000000000000","footer_length":11806,"footer_sha256":"abababababababababababababababababababababababababababababababab"}"#;
const FILTER: &str = r#"{"action":"filter.apply","params":{"filter":{"predicate":"zone = 'civic'","dialect":"duckdb-expr/0"}}}"#;
const OPACITY: &str = r#"{"action":"style.set","params":{"property":"fillOpacity","value":0.5}}"#;
const COLOUR: &str =
    r##"{"action":"style.set","params":{"property":"fillColor","value":"#4285f4"}}"##;
const COMPLETE: &str = r#"{"state":"complete"}"#;
const AT_FIRST_SAVE: &str = r#"{"state":"at-first-save"}"#;

/// A dataset entry (ADR-036 §5) carrying `locators`.
fn entry(locators: &str) -> String {
    format!(
        r#"{{"resource":{{"logical_uri":"{URI}","content_hash":{{"state":"not-taken","basis":"b"}},"source_revision":{{"state":"none-pinned","basis":"b"}},"locators":[{locators}],"cache_status":"linked","portability_policy":"linked-live-file"}},"observed":{OBSERVED},"admission":{{"crs_assertion":null,"identity":null}}}}"#
    )
}

/// A lineage header. Its dataset entry carries the project file's locators, a `project-relative`
/// one among them (ADR-036 Amendment 1 item 4).
fn lineage_header(completeness: &str, starts: &str) -> String {
    let entry = entry(&format!(
        r#"{{"kind":"machine-recorded","at":"{URI}"}},{{"kind":"project-relative","at":"data/zones.parquet"}}"#
    ));
    format!(
        r#"{{"format":"spatial-steps","version":1,"purpose":"lineage","project":"{PROJECT}","actions":2,"datasets":[{entry}],"lineage":{{"completeness":{completeness},"starts":{starts}}}}}"#
    )
}

fn header() -> String {
    lineage_header(COMPLETE, AT_FIRST_SAVE)
}

fn session_header() -> String {
    let entry = entry(&format!(r#"{{"kind":"machine-recorded","at":"{URI}"}}"#));
    format!(
        r#"{{"format":"spatial-steps","version":1,"purpose":"session-history","project":{{"state":"not-yet-saved","basis":"b"}},"actions":2,"datasets":[{entry}],"lineage":null}}"#
    )
}

fn sid(n: u8) -> String {
    format!("step_{n:032x}")
}

fn parent(p: Option<u8>) -> String {
    p.map_or("null".to_string(), |p| format!("\"{}\"", sid(p)))
}

fn step(n: u8, p: Option<u8>, kind: &str, intent: &str) -> String {
    let crs = format!(
        r#"{{"identifier":"EPSG:2056","provenance":"crs:declared","definition":"sha256:{HASH}"}}"#
    );
    format!(
        r#"{{"step":{{"id":"{}","parent":{},"at":"2026-10-14T10:00:00Z","kind":"{kind}","effect":{{"class":"workspace-mutation"}},"actor":{{"kind":"user"}},"intent":{intent},"dependencies":{{"fields":[{{"name":"zone","type":"Utf8"}}],"crs":{crs},"geometry_types":["Polygon"]}},"data":{{"dataset":"{URI}","identity":{{"observed":{OBSERVED}}}}},"scope":{{"kind":"layer"}},"links":[]}}}}"#,
        sid(n),
        parent(p)
    )
}

fn withheld(n: u8, p: Option<u8>) -> String {
    format!(
        r#"{{"withheld":{{"id":"{}","parent":{}}}}}"#,
        sid(n),
        parent(p)
    )
}

/// The lineage of one save: a header, two steps and a withheld line.
fn saved() -> Vec<String> {
    vec![
        header(),
        step(1, None, "data", FILTER),
        step(2, Some(1), "style", OPACITY),
        withheld(3, Some(2)),
    ]
}

/// A valid lineage file from another save: its second step sets another property.
fn other_save() -> Vec<String> {
    vec![
        header(),
        step(1, None, "data", FILTER),
        step(2, Some(1), "style", COLOUR),
    ]
}

fn bytes(lines: &[String]) -> Vec<u8> {
    lines.iter().flat_map(|l| l.bytes().chain(*b"\n")).collect()
}

/// The member a project file records over `lines`: their sha256, each line with its LF, and the
/// number of their step and withheld lines.
fn member(lines: &[String]) -> Lineage {
    Lineage::Kept {
        sha256: sha256_hex(&bytes(lines)),
        steps: lines.len() as u64 - 1,
    }
}

fn scratch(name: &str) -> PathBuf {
    let dir = std::env::temp_dir()
        .join("spatial-ide-project-reopen-tests")
        .join(name);
    let _ = std::fs::remove_dir_all(&dir);
    std::fs::create_dir_all(&dir).expect("scratch folder");
    dir
}

/// The folder's lineage file and the previous one, in `dir`, each written when it is given.
fn files(dir: &Path, folder: Option<&[u8]>, previous: Option<&[u8]>) -> (PathBuf, PathBuf) {
    let (f, p) = (dir.join("folder.jsonl"), dir.join("previous.jsonl"));
    for (path, b) in [(&f, folder), (&p, previous)] {
        if let Some(b) = b {
            std::fs::write(path, b).expect("a hand-built file");
        }
    }
    (f, p)
}

fn read(dir: &Path, folder: Option<&[u8]>, previous: Option<&[u8]>, m: &Lineage) -> LineageRead {
    let (f, p) = files(dir, folder, previous);
    read_lineage(&f, &p, m)
}

/// L1. Mutation: arm 1's hash comparison removed. Expected failure: the control, a member that
/// records the same count over another save's bytes, reads as `Recorded`.
#[test]
fn a_lineage_file_whose_recorded_prefix_matches_the_member_is_the_projects_lineage() {
    let dir = scratch("l1");
    let lines = saved();
    let got = read(&dir, Some(&bytes(&lines)), None, &member(&lines));
    let want = LineageRead {
        folder_file: FolderLineage::Recorded,
        previous_file: None,
        lineage: Some(lines.clone()),
    };
    assert_eq!(got, want);
    let another = Lineage::Kept {
        sha256: sha256_hex(b"another save"),
        steps: 3,
    };
    let got = read(&dir, None, None, &another);
    assert_eq!(
        (got.folder_file, got.lineage),
        (FolderLineage::NotTheRecordedOne, None)
    );
}

/// L2. Mutation: the prefix taken as the whole file, not cut by the step count. Expected failure:
/// the file reads as `NotTheRecordedOne`.
#[test]
fn lines_after_the_recorded_prefix_are_named_and_not_read_as_the_projects() {
    let dir = scratch("l2");
    let lines = saved();
    let mut file = lines.clone();
    file.extend([
        step(4, Some(3), "data", FILTER),
        step(5, Some(4), "style", OPACITY),
    ]);
    let got = read(&dir, Some(&bytes(&file)), None, &member(&lines));
    let want = LineageRead {
        folder_file: FolderLineage::RecordedWithLinesAfter,
        previous_file: None,
        lineage: Some(lines),
    };
    assert_eq!(got, want);
}

/// L3. Mutation: arm 2 removed. Expected failure: the first case's previous file reads as
/// `NotTheRecordedOne`, with no lineage.
#[test]
fn a_previous_lineage_matching_the_member_is_used_and_the_folders_file_named() {
    let lines = saved();
    let cases = [
        (
            "l3-other",
            Some(bytes(&other_save())),
            FolderLineage::NotTheRecordedOne,
        ),
        ("l3-absent", None, FolderLineage::Absent),
    ];
    for (case, folder, fact) in cases {
        let dir = scratch(case);
        let got = read(
            &dir,
            folder.as_deref(),
            Some(&bytes(&lines)),
            &member(&lines),
        );
        let want = LineageRead {
            folder_file: fact,
            previous_file: Some(PreviousLineage::Used),
            lineage: Some(lines.clone()),
        };
        assert_eq!(got, want, "{case}");
    }
}

/// L4. Mutations: (a) arm 3 returns the folder's lines; (b) the not-kept check removed, so a
/// not-kept member names every folder's file `Absent`. Expected failures: (a) the first assertion,
/// whose lineage is the other save's lines; (b) the last, whose folder file reads as `Absent`.
#[test]
fn a_lineage_file_from_a_different_save_is_named_and_not_read_as_the_projects() {
    let lines = saved();
    let dir = scratch("l4-other");
    let got = read(&dir, Some(&bytes(&other_save())), None, &member(&lines));
    let want = LineageRead {
        folder_file: FolderLineage::NotTheRecordedOne,
        previous_file: Some(PreviousLineage::Absent),
        lineage: None,
    };
    assert_eq!(got, want);
    let dir = scratch("l4-none");
    let want = LineageRead {
        folder_file: FolderLineage::Absent,
        previous_file: Some(PreviousLineage::Absent),
        lineage: None,
    };
    assert_eq!(read(&dir, None, None, &member(&lines)), want);
    let none = |folder_file| LineageRead {
        folder_file,
        previous_file: None,
        lineage: None,
    };
    let got = read(&dir, None, None, &Lineage::NotKept);
    assert_eq!(got, none(FolderLineage::Absent));
    let dir = scratch("l4-not-kept");
    let file = bytes(&lines);
    let got = read(&dir, Some(&file), Some(&file), &Lineage::NotKept);
    assert_eq!(got, none(FolderLineage::NotRead));
}

/// K-L5 (Amendment 1 item 5, C1). Mutation: the file-size check removed. Expected failure: the
/// file extended to 33,554,433 bytes is read, and is refused as `Damaged` at its torn last line,
/// not as over its bound.
#[test]
fn a_lineage_file_over_its_bounds_is_named_and_not_read() {
    let lines = saved();
    let dir = scratch("k-l5-file");
    let (f, p) = files(&dir, Some(&bytes(&lines)), None);
    let file = std::fs::OpenOptions::new().write(true).open(&f).unwrap();
    file.set_len(33_554_433).unwrap();
    drop(file);
    let want = LineageRead {
        folder_file: FolderLineage::Refused(LineageRefused::OverBound {
            line: None,
            limit: 33_554_432,
        }),
        previous_file: Some(PreviousLineage::Absent),
        lineage: None,
    };
    assert_eq!(read_lineage(&f, &p, &member(&lines)), want);
    assert_eq!(std::fs::metadata(&f).unwrap().len(), 33_554_433);

    let base = step(1, None, "data", FILTER);
    let pad = "x".repeat(262_145 - base.len());
    let long = base.replacen("zone = 'civic'", &format!("zone = 'civic{pad}'"), 1);
    assert_eq!(long.len(), 262_145);
    let long = vec![header(), long];
    let dir = scratch("k-l5-line");
    let got = read(&dir, Some(&bytes(&long)), None, &member(&long));
    let over = LineageRefused::OverBound {
        line: Some(2),
        limit: 262_144,
    };
    assert_eq!(
        (got.folder_file, got.lineage),
        (FolderLineage::Refused(over), None)
    );
}

/// K-L6. Mutation: the reader keeps the valid prefix. Expected failure: each file reads as
/// `Recorded`, its prefix being the member's.
#[test]
fn a_torn_lineage_file_is_named_and_never_cut_back() {
    let lines = saved();
    let mut torn = bytes(&lines);
    torn.extend(step(4, Some(3), "data", FILTER).bytes());
    let mut unparsable = bytes(&lines);
    unparsable.extend(b"{\"step\":\n");
    for (case, file) in [("k-l6-torn", torn), ("k-l6-unparsable", unparsable)] {
        let dir = scratch(case);
        let (f, p) = files(&dir, Some(&file), None);
        let got = read_lineage(&f, &p, &member(&lines));
        let at = matches!(
            &got.folder_file,
            FolderLineage::Refused(LineageRefused::Damaged { line: 5, .. })
        );
        assert!(at, "{case}: {got:?}");
        assert_eq!(got.lineage, None, "{case}");
        assert_eq!(
            std::fs::read(&f).unwrap(),
            file,
            "{case}: the file is unchanged"
        );
    }
}

/// K-L7. Mutation: mark lines admitted in a lineage file. Expected failure: the file holding a
/// mark line reads as `RecordedWithLinesAfter`.
#[test]
fn a_lineage_header_and_withheld_lines_are_read_in_their_shape_and_a_mark_line_is_refused() {
    let first = step(1, None, "data", FILTER);
    let mark = format!(
        r#"{{"mark":{{"kind":"saved-here","after":"{}","at":"2026-10-14T10:00:05Z"}}}}"#,
        sid(1)
    );
    let cases = [
        (
            "k-l7-header",
            vec![session_header(), first.clone()],
            1,
            "$.purpose",
        ),
        (
            "k-l7-mark",
            vec![header(), first.clone(), mark],
            3,
            "$.mark",
        ),
        (
            "k-l7-chain",
            vec![header(), first, withheld(2, Some(9))],
            3,
            "$.withheld.parent",
        ),
    ];
    for (case, lines, at, path) in cases {
        let dir = scratch(case);
        let m = member(&lines[..at.max(2) - 1]);
        let got = read(&dir, Some(&bytes(&lines)), None, &m);
        match &got.folder_file {
            FolderLineage::Refused(LineageRefused::Damaged { line, rule }) => {
                assert_eq!(*line, at, "{case}: {rule}");
                assert!(rule.contains(path), "{case}: {rule}");
            }
            other => panic!("{case}: {other:?}"),
        }
        assert_eq!(got.lineage, None, "{case}");
    }
    let incomplete = r#"{"state":"incomplete","withheld":1,"kinds_not_recorded":["export"]}"#;
    let later = r#"{"state":"later","basis":"the steps before the first save are not kept"}"#;
    for (i, (c, s)) in [COMPLETE, incomplete]
        .into_iter()
        .flat_map(|c| [(c, AT_FIRST_SAVE), (c, later)])
        .enumerate()
    {
        let mut lines = saved();
        lines[0] = lineage_header(c, s);
        let dir = scratch(&format!("k-l7-forms-{i}"));
        let got = read(&dir, Some(&bytes(&lines)), None, &member(&lines));
        assert_eq!(got.folder_file, FolderLineage::Recorded, "{c} {s}");
    }
}

/// K-L8. It guards the shared framing, and its assertions hold at main by design. Mutation: the
/// lineage shapes admitted by `read_line`. Expected failure: the withheld line is kept.
#[test]
fn the_session_history_reader_still_refuses_a_withheld_line_and_a_lineage_header() {
    let dir = scratch("k-l8-withheld");
    let first = step(1, None, "data", FILTER);
    let lines = vec![session_header(), first.clone(), withheld(2, Some(1))];
    std::fs::write(dir.join("history.jsonl"), bytes(&lines)).unwrap();
    let got = recover(&dir);
    assert_eq!(got.lines, lines[..2]);
    let failure = got.failure.expect("the withheld line is named");
    assert_eq!(failure.line, 3, "{}", failure.rule);

    let dir = scratch("k-l8-header");
    std::fs::write(dir.join("history.jsonl"), bytes(&[header(), first])).unwrap();
    let got = recover(&dir);
    assert!(got.lines.is_empty() && got.header.is_none());
    let failure = got.failure.expect("the lineage header is named");
    assert_eq!(
        (failure.line, failure.rule.contains("$.purpose")),
        (1, true),
        "{}",
        failure.rule
    );
}

// ---------------------------------------------------------------------------------------------
// L5 to L7 (the form's Amendment 36, item 7 (b)): the reader as P2 merged it
// ---------------------------------------------------------------------------------------------

/// A link at `link` to the folder `target`: a junction on Windows, which needs no privilege, and a
/// symlink elsewhere (`project_save.rs`'s `make_link`).
fn link_to(link: &Path, target: &Path) {
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

/// **L5** (ADV-2026-11-18-23 item 2 (a)). A previous lineage file whose bytes have the member's
/// `sha256`, but whose step count is not the member's `steps`, is named `NotTheRecordedOne`, and
/// no lineage is used.
///
/// RECORDED MUTATION: the count comparison in `read_lineage`'s arm 2 removed. Expected failure: the
/// previous file reads as `Used`, with its lines.
#[test]
fn a_previous_lineage_whose_hash_matches_but_whose_step_count_does_not_is_named_and_not_used() {
    let lines = saved();
    let Lineage::Kept { sha256, steps } = member(&lines) else {
        unreachable!("member records a lineage")
    };
    let m = Lineage::Kept {
        sha256,
        steps: steps + 1,
    };
    let got = read(&scratch("l5"), None, Some(&bytes(&lines)), &m);
    let want = LineageRead {
        folder_file: FolderLineage::Absent,
        previous_file: Some(PreviousLineage::NotTheRecordedOne),
        lineage: None,
    };
    assert_eq!(got, want);
}

/// **L6** (Amendment 34 item 9). A lineage file with two broken lines, a withheld line whose
/// `parent` is not the line before it at line 3 and a mark line at line 5, is refused as `Damaged`
/// at line 3, the first in file order, and no lineage is read.
///
/// RECORDED MUTATION: the reader goes past the first failure and names the last. Expected failure:
/// the file is named at line 5.
#[test]
fn a_lineage_file_with_two_broken_lines_is_named_by_the_first() {
    let mark = format!(
        r#"{{"mark":{{"kind":"saved-here","after":"{}","at":"2026-10-14T10:00:05Z"}}}}"#,
        sid(3)
    );
    let lines = vec![
        header(),
        step(1, None, "data", FILTER),
        withheld(2, Some(9)),
        step(3, Some(2), "style", OPACITY),
        mark,
    ];
    let (dir, m) = (scratch("l6"), member(&saved()));
    let got = read(&dir, Some(&bytes(&lines)), None, &m);
    match &got.folder_file {
        FolderLineage::Refused(LineageRefused::Damaged { line, rule }) => {
            assert_eq!(*line, 3, "{rule}");
        }
        other => panic!("refused at a line: {other:?}"),
    }
    assert_eq!(got.lineage, None);
}

/// **L7** (ADV-2026-11-18-23 item 2 (c)). For a `not-kept` member, a link at the lineage file's
/// name whose target is gone (a junction on Windows, a symlink elsewhere) is named `NotRead`. It
/// is not followed: the link is still there, and nothing is made at its target.
///
/// RECORDED MUTATION: `symlink_metadata` replaced by `metadata` in `read_lineage`'s not-kept arm.
/// Expected failure: the link is followed to nothing, and the folder's file reads as `Absent`.
#[test]
fn a_link_at_the_lineage_name_beside_a_not_kept_member_is_named_and_never_followed() {
    let dir = scratch("l7");
    let (link, target) = (dir.join("folder.jsonl"), dir.join("gone"));
    std::fs::create_dir(&target).expect("the link's target, removed below");
    link_to(&link, &target);
    std::fs::remove_dir(&target).expect("the target removed");
    let got = read_lineage(&link, &dir.join("previous.jsonl"), &Lineage::NotKept);
    let want = LineageRead {
        folder_file: FolderLineage::NotRead,
        previous_file: None,
        lineage: None,
    };
    assert_eq!(got, want);
    assert!(std::fs::symlink_metadata(&link).is_ok(), "the link is kept");
    assert!(!target.exists(), "nothing is made at the target");
}

// ---------------------------------------------------------------------------------------------
// K-R1 to K-R4 and K-O1 to K-O23 (Amendment 36, item 7 (b)): `Projects::open_project` after a
// real save. A real `SkpHost::open_dataset` opens a fixture made here and `Projects::save` saves
// it; each test then reopens the folder. Unless a reopen replies `opened`, `reopen_at` asserts
// that the catalog holds no new entry and that the identity's `open.lock` is free.
// ---------------------------------------------------------------------------------------------

mod watch_support;

use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{Arc, Mutex};
use std::time::Duration;

use spatial_engine::fixture::{
    write_geoparquet, AttributeMode, CrsMode, FixtureSpec, IdentityMode, LV95_PROJJSON,
};
use spatial_engine::{ArmOutcome, Dataset, PlatformWatch, SourceWatchArm, WatchSink};
use spatial_kernel::dataset_ref::{Locator, RefCheck};
use spatial_kernel::project::file::{
    read_project, write_project, Clause, ProjectFile, Space, View, Workspace,
};
use spatial_kernel::project::resolver::CheckRefused;
use spatial_kernel::project::store::{
    read_locations, KnownFolders, Location, ProjectLock, FOLDERS, LOCATIONS,
};
use spatial_kernel::project::{
    Answer, HistoryMark, OpenFailure, Opened, ProjectUri, Projects, Reopen, SaveFailure, ViewState,
    Withheld, PROJECT_FILE_NAME,
};
use spatial_kernel::session_history::StepRecorder;
use spatial_kernel::skp::{session_end_channel, SkpHost, StreamRegistry};
use spatial_kernel::Catalog;
use spatial_renderer::style;
use spatial_skp::v0::{
    CancelRequest, CancelState, CloseDatasetRequest, CrsAssertion, DatasetHandle,
    IdentityDeclaration, OpenDatasetRequest, RecordStepRequest, StepIntent, StyleSetParams,
    SKP_VERSION,
};

const PREDICATE: &str = "zone = 'civic'";
const STYLE_DOC: &str = r##"{"style_version":1,"layer":{"geometry":"polygon","fill_color":{"literal":"#4285f4"},"fill_opacity":{"literal":0.35},"outline_color":{"literal":"#000000"},"outline_width":{"literal":1.5}}}"##;

/// An open's claims: a CRS assertion and an identity declaration.
type Claims = (Option<CrsAssertion>, Option<IdentityDeclaration>);

/// One run of the application: a host, a recorder over the session store root, and the machine
/// store's `projects` folder.
struct Run {
    host: Arc<SkpHost>,
    recorder: Arc<StepRecorder>,
    machine: PathBuf,
}

impl Run {
    fn with_arm(sessions: &Path, machine: &Path, arm: Arc<dyn SourceWatchArm>) -> Run {
        let (catalog, tickets) = (Arc::new(Catalog::new()), StreamRegistry::new());
        let host = Arc::new(SkpHost::new(catalog, tickets, arm, session_end_channel().0));
        let recorder = Arc::new(StepRecorder::new(sessions.to_path_buf(), host.clone()));
        let machine = machine.to_path_buf();
        Run {
            host,
            recorder,
            machine,
        }
    }

    /// A `Projects` of this run; dropping it frees each lock it holds.
    fn projects(&self) -> Projects {
        Projects::new(self.machine.clone(), self.recorder.clone())
    }

    fn open(
        &self,
        path: &Path,
        (crs_assertion, identity): Claims,
    ) -> (DatasetHandle, Arc<Dataset>) {
        let (skp, path) = (SKP_VERSION.to_string(), path.display().to_string());
        let cancel_key = "k".to_string();
        let req = OpenDatasetRequest {
            skp,
            path,
            cancel_key,
            crs_assertion,
            identity,
        };
        let handle = self.host.open_dataset(req).expect("open").dataset;
        (handle.clone(), self.dataset(&handle))
    }

    fn dataset(&self, handle: &DatasetHandle) -> Arc<Dataset> {
        self.host.catalog().get(handle.as_str()).expect("catalog")
    }

    fn close(&self, handle: &DatasetHandle) {
        let (skp, dataset) = (SKP_VERSION.to_string(), handle.clone());
        let closed = self
            .host
            .close_dataset(CloseDatasetRequest { skp, dataset });
        closed.expect("closed");
    }

    fn opacity_step(&self, handle: &DatasetHandle, value: f64) {
        let intent = StepIntent::StyleSet(StyleSetParams::FillOpacity { value });
        let (skp, dataset) = (SKP_VERSION.to_string(), handle.clone());
        let req = RecordStepRequest {
            skp,
            dataset,
            intent,
        };
        self.recorder.record_step(req).expect("recorded");
    }

    fn names(&self) -> Vec<String> {
        let mut names = self.host.catalog().names();
        names.sort();
        names
    }
}

/// A test's folders: the project folder, the session store root and the machine store.
struct Rig {
    dir: PathBuf,
    folder: PathBuf,
    sessions: PathBuf,
    machine: PathBuf,
}

fn rig(name: &str) -> Rig {
    let dir = scratch(name);
    let folder = dir.join("project");
    std::fs::create_dir_all(&folder).expect("the project folder");
    let (sessions, machine) = (dir.join("sessions"), dir.join("machine"));
    Rig {
        dir,
        folder,
        sessions,
        machine,
    }
}

impl Rig {
    fn run(&self) -> Run {
        Run::with_arm(&self.sessions, &self.machine, watch_support::no_watch_arm())
    }

    fn file(&self) -> PathBuf {
        self.folder.join(PROJECT_FILE_NAME)
    }

    /// A file in the identity's machine folder.
    fn machine_file(&self, project: &ProjectUri, name: &str) -> PathBuf {
        self.machine.join(project.hex()).join(name)
    }
}

/// F1: 500 polygons in LV95 with a `zone` column.
fn f1() -> FixtureSpec {
    let attributes = AttributeMode::CategoricalZone;
    FixtureSpec {
        features: 500,
        avg_vertices: 12,
        seed: 1,
        attributes,
        ..Default::default()
    }
}

fn fixture(path: &Path, spec: FixtureSpec) {
    std::fs::create_dir_all(path.parent().expect("a parent")).expect("the data folder");
    write_geoparquet(path, &spec).expect("fixture");
}

fn space_of(ds: &Dataset) -> Space {
    let (crs, admission) = (ds.crs(), ds.admission().expect("admitted"));
    Space {
        identifier: crs.identifier().to_string(),
        provenance: admission.crs_provenance.as_str().to_string(),
        definition: crs.definition_json().map(|d| sha256_hex(d.as_bytes())),
    }
}

fn workspace(ds: &Dataset, filter: Option<&str>) -> Workspace {
    let clause = |text: &str| Clause {
        text: text.to_string(),
        enabled: true,
    };
    let style = style::parse(STYLE_DOC).expect("a style document");
    let (crs, centre) = (space_of(ds), [2_600_000.5, 1_200_000.25]);
    Workspace {
        filter: filter.map(str::to_string),
        clauses: filter.map(clause).into_iter().collect(),
        style,
        view: View {
            crs,
            centre,
            zoom: -4.5,
        },
    }
}

/// A first save of `data` to `folder`; then the open is closed and the `Projects` dropped.
fn save_closed(run: &Run, folder: &Path, data: &Path, claims: Claims) -> ProjectUri {
    let (handle, ds) = run.open(data, claims);
    let ws = workspace(&ds, None);
    let saved = run.projects().save(handle.as_str(), &ds, Some(folder), ws);
    run.close(&handle);
    saved.expect("saved").project
}

/// F1 at `data/parcels.parquet` in the project folder, saved: its locators are `machine-recorded`
/// and `project-relative`.
fn saved_inside(rig: &Rig, run: &Run) -> ProjectUri {
    let data = rig.folder.join("data/parcels.parquet");
    fixture(&data, f1());
    save_closed(run, &rig.folder, &data, (None, None))
}

/// F1 outside the project folder, saved: its one locator is `machine-recorded`.
fn saved_outside(rig: &Rig, run: &Run) -> (ProjectUri, PathBuf) {
    let data = rig.dir.join("outside/parcels.parquet");
    fixture(&data, f1());
    (save_closed(run, &rig.folder, &data, (None, None)), data)
}

fn copy_project(from: &Path, to: &Path) {
    std::fs::create_dir_all(to.join("data")).expect("the copy's folders");
    for name in [PROJECT_FILE_NAME, "data/parcels.parquet"] {
        std::fs::copy(from.join(name), to.join(name)).expect("copied");
    }
}

fn lock_free(rig: &Rig, project: &ProjectUri) {
    let lock = ProjectLock::try_lock(&rig.machine, project);
    assert!(lock.is_ok(), "open.lock is free: {lock:?}");
}

/// One reopen by a `Projects` dropped after it. Unless the reply is `opened`, nothing was opened
/// and the lock is free.
fn reopen_at(
    rig: &Rig,
    run: &Run,
    project: &ProjectUri,
    folder: &Path,
    answer: Option<Answer>,
    relink: Option<&Path>,
) -> Result<Reopen, OpenFailure> {
    let before = run.names();
    let got = run.projects().open_project(folder, "k", answer, relink);
    if !matches!(got, Ok(Reopen::Opened(_))) {
        assert_eq!(run.names(), before, "nothing is opened: {got:?}");
        lock_free(rig, project);
    }
    got
}

fn reopen(rig: &Rig, run: &Run, project: &ProjectUri) -> Result<Reopen, OpenFailure> {
    reopen_at(rig, run, project, &rig.folder, None, None)
}

fn opened(got: Result<Reopen, OpenFailure>) -> Opened {
    match got {
        Ok(Reopen::Opened(opened)) => *opened,
        other => panic!("expected opened: {other:?}"),
    }
}

/// The project file's `project-relative` locator's JSON path.
fn relative_at(rig: &Rig) -> String {
    let file = read_project(&std::fs::read(rig.file()).expect("the file")).expect("read");
    let relative = |l: &Locator| matches!(l, Locator::ProjectRelative(_));
    let i = file.dataset.locators().iter().position(relative);
    format!("$.datasets[0].resource.locators[{}].at", i.expect("one"))
}

fn target_refused(rig: &Rig, run: &Run, project: &ProjectUri, want: CheckRefused) {
    let locator = relative_at(rig);
    match reopen(rig, run, project) {
        Err(OpenFailure::TargetRefused {
            locator: at,
            refused,
        }) => {
            assert_eq!((at, refused), (locator, want));
        }
        other => panic!("refused at the target: {other:?}"),
    }
}

fn record_refused(rig: &Rig, run: &Run, project: &ProjectUri, name: &str) {
    match reopen(rig, run, project) {
        Err(OpenFailure::MachineRecordRefused(r)) => assert_eq!(r.file, name, "{r}"),
        other => panic!("refused by the machine record: {other:?}"),
    }
}

fn set_file(rig: &Rig, edit: impl FnOnce(&mut ProjectFile)) {
    let mut file = read_project(&std::fs::read(rig.file()).expect("the file")).expect("read");
    edit(&mut file);
    std::fs::write(rig.file(), write_project(&file).expect("written")).expect("replaced");
}

/// The folder's lineage file, `.spatial/lineage.jsonl` (ADR-036 §1).
fn lineage_at(rig: &Rig, lines: &[String]) {
    std::fs::create_dir_all(rig.folder.join(".spatial")).expect("the folder");
    std::fs::write(rig.folder.join(".spatial/lineage.jsonl"), bytes(lines)).expect("written");
}

fn later_by_60_s(path: &Path, from: &Path) {
    let at = std::fs::metadata(from)
        .and_then(|m| m.modified())
        .expect("mtime");
    let file = std::fs::File::options()
        .write(true)
        .open(path)
        .expect("open");
    file.set_modified(at + Duration::from_secs(60))
        .expect("mtime set");
}

/// **K-R1** (ADV-2026-11-18-24 item 3 (b)). `data` becomes a link to the folder `real`, which is
/// also inside: refused as through a link at `data`. Off Windows, a symlink to a regular file as
/// the final segment is refused too.
///
/// RECORDED MUTATION: the data step joins `at` to the folder without `check_inside`. Expected
/// failure: the reopen replies `opened`.
#[test]
fn a_link_below_the_folder_is_refused_and_never_opened() {
    let rig = rig("k-r1");
    let run = rig.run();
    let project = saved_inside(&rig, &run);
    let (data, real) = (rig.folder.join("data"), rig.folder.join("real"));
    std::fs::rename(&data, &real).expect("moved");
    link_to(&data, &real);
    target_refused(
        &rig,
        &run,
        &project,
        CheckRefused::ThroughLink {
            segment: "data".to_string(),
        },
    );
    #[cfg(not(windows))]
    {
        std::fs::remove_file(&data).expect("the link removed");
        std::fs::rename(&real, &data).expect("moved back");
        let final_segment = data.join("parcels.parquet");
        std::fs::rename(&final_segment, data.join("real.parquet")).expect("moved");
        std::os::unix::fs::symlink(data.join("real.parquet"), &final_segment).expect("symlink");
        let segment = "data/parcels.parquet".to_string();
        target_refused(&rig, &run, &project, CheckRefused::ThroughLink { segment });
    }
}

/// **K-R2** (§2.9: Windows only, by a run-time check, naming the operating system). `data` becomes
/// a junction to a folder outside the project folder: refused as through a link at `data`.
///
/// RECORDED MUTATION: `check_inside` reads each segment by `metadata`, which follows reparse
/// points. Expected failure: the reopen replies `opened`.
#[test]
fn on_windows_a_junction_out_of_the_folder_is_refused() {
    println!("K-R2 runs on {}", std::env::consts::OS);
    if std::env::consts::OS != "windows" {
        return;
    }
    let rig = rig("k-r2");
    let run = rig.run();
    let project = saved_inside(&rig, &run);
    let (data, outside) = (rig.folder.join("data"), rig.dir.join("outside"));
    std::fs::rename(&data, &outside).expect("moved out");
    link_to(&data, &outside);
    let segment = "data".to_string();
    target_refused(&rig, &run, &project, CheckRefused::ThroughLink { segment });
}

/// **K-R3** (C-7). A device name and a trailing dot, edited into the file's `project-relative`
/// `at`, are refused by the file's reader at that locator's path, before any open.
///
/// RECORDED MUTATION: `DatasetRef::parse` does not call `in_canonical_form` for a
/// `project-relative` `at`. Expected failure: the reopen is refused at the target instead.
#[test]
fn a_device_name_or_trailing_dot_target_is_refused_at_read_before_any_open() {
    let rig = rig("k-r3");
    let run = rig.run();
    let project = saved_inside(&rig, &run);
    let locator = relative_at(&rig);
    let text = std::fs::read_to_string(rig.file()).expect("the file");
    let at = "\"data/parcels.parquet\"";
    assert_eq!(text.matches(at).count(), 1);
    for edited in ["\"data/NUL.parquet\"", "\"data/parcels.\""] {
        std::fs::write(rig.file(), text.replace(at, edited)).expect("edited");
        match reopen(&rig, &run, &project) {
            Err(OpenFailure::FileRefused(r)) => assert_eq!(r.path, locator, "{edited}: {r}"),
            other => panic!("{edited}: refused by the reader: {other:?}"),
        }
    }
}

/// **K-R4** (ADV-2026-11-19-04 item 5). A missing final segment, then a missing intermediate, each
/// refused as unresolvable, naming the segment.
///
/// RECORDED MUTATION: `check_inside` reads a segment it cannot find as a folder. Expected failure:
/// the final is refused as not a regular file.
#[test]
fn an_unresolvable_target_is_refused_by_name() {
    let rig = rig("k-r4");
    let run = rig.run();
    let project = saved_inside(&rig, &run);
    std::fs::remove_file(rig.folder.join("data/parcels.parquet")).expect("removed");
    let segment = "data/parcels.parquet".to_string();
    target_refused(&rig, &run, &project, CheckRefused::Unresolvable { segment });
    std::fs::remove_dir(rig.folder.join("data")).expect("removed");
    let segment = "data".to_string();
    target_refused(&rig, &run, &project, CheckRefused::Unresolvable { segment });
}

/// **K-O1**. F1 without a CRS key and with `parcel_key` for identity, opened under a CRS assertion
/// and an identity declaration, saved with a filter, reopened: the same claims, workspace, view
/// and identity, no change detected, and no lineage file.
///
/// RECORDED MUTATION: the open's claims dropped at reopen. Expected failure: the check differs.
#[test]
fn a_saved_project_reopens_with_its_data_claims_and_workspace() {
    let rig = rig("k-o1");
    let run = rig.run();
    let data = rig.folder.join("data/parcels.parquet");
    let spec = FixtureSpec {
        crs_mode: CrsMode::AbsentKey,
        identity: IdentityMode::ForeignKeyColumn,
        ..f1()
    };
    fixture(&data, spec);
    let identifier = "EPSG:2056".to_string();
    let definition_json = LV95_PROJJSON.to_string();
    let crs = CrsAssertion {
        identifier,
        definition_json,
    };
    let column = "parcel_key".to_string();
    let (handle, ds) = run.open(&data, (Some(crs), Some(IdentityDeclaration { column })));
    let ws = workspace(&ds, Some(PREDICATE));
    let saved = run
        .projects()
        .save(handle.as_str(), &ds, Some(&rig.folder), ws.clone());
    let project = saved.expect("saved").project;
    run.close(&handle);
    let o = opened(reopen(&rig, &run, &project));
    let again = run.dataset(&o.dataset);
    assert_eq!((o.project, o.check), (project, RefCheck::NoChangeDetected));
    assert_eq!((o.workspace, o.view), (ws.clone(), ViewState::Applies));
    assert_eq!(space_of(&again), ws.view.crs, "the assertion is applied");
    let absent = (FolderLineage::Absent, None, None);
    let lineage = o.lineage;
    assert_eq!(
        (lineage.folder_file, lineage.previous_file, lineage.lineage),
        absent
    );
}

/// **K-O1 (b)** (Amendment 31 item 6). The member set by hand to record a lineage file written by
/// hand: `Recorded` with its lines; then a file from another save: `NotTheRecordedOne`.
///
/// RECORDED MUTATION: step 6 not run (no lineage read). Expected failure: the fact is `Absent`.
#[test]
fn a_saved_project_whose_member_records_a_lineage_reopens_with_its_lineage_named() {
    let rig = rig("k-o1b");
    let run = rig.run();
    let project = saved_inside(&rig, &run);
    let lines = saved();
    set_file(&rig, |f| f.lineage = member(&lines));
    lineage_at(&rig, &lines);
    let o = opened(reopen(&rig, &run, &project));
    let recorded = (FolderLineage::Recorded, None, Some(lines));
    let got = (
        o.lineage.folder_file,
        o.lineage.previous_file,
        o.lineage.lineage,
    );
    assert_eq!(got, recorded);
    lineage_at(&rig, &other_save());
    let o = opened(reopen(&rig, &run, &project));
    let other = (
        FolderLineage::NotTheRecordedOne,
        Some(PreviousLineage::Absent),
    );
    assert_eq!((o.lineage.folder_file, o.lineage.previous_file), other);
    assert_eq!(o.lineage.lineage, None);
}

/// **K-O2** (F4). The data's modification time moved 60 s later: `mtime` is named, in the
/// descriptor's own vocabulary.
///
/// RECORDED MUTATION: only `byte_size` compared. Expected failure: no change detected.
#[test]
fn a_changed_file_is_reopened_with_each_differing_component_named() {
    let rig = rig("k-o2");
    let run = rig.run();
    let project = saved_inside(&rig, &run);
    let data = rig.folder.join("data/parcels.parquet");
    later_by_60_s(&data, &data);
    let o = opened(reopen(&rig, &run, &project));
    let (observed, admission) = (vec!["mtime"], vec![]);
    assert_eq!(
        o.check,
        RefCheck::Differs {
            observed,
            admission
        }
    );
}

/// **K-O3**. Data saved outside the folder, then removed, with a file of its name placed in the
/// project folder: `not_found` with the file's name. With no location recorded: `not_found` with
/// no name.
///
/// RECORDED MUTATION: a missing machine location falls back to the file's name in the folder.
/// Expected failure: the reopen replies `opened`.
#[test]
fn a_missing_file_returns_not_found_and_opens_nothing() {
    let rig = rig("k-o3");
    let run = rig.run();
    let (project, data) = saved_outside(&rig, &run);
    std::fs::remove_file(&data).expect("removed");
    fixture(&rig.folder.join("parcels.parquet"), f1());
    let named = Some("parcels.parquet".to_string());
    let got = reopen(&rig, &run, &project);
    let found = matches!(got, Ok(Reopen::NotFound { ref file_name }) if *file_name == named);
    assert!(found, "{got:?}");
    std::fs::remove_file(rig.machine_file(&project, LOCATIONS)).expect("removed");
    let got = reopen(&rig, &run, &project);
    assert!(
        matches!(got, Ok(Reopen::NotFound { file_name: None })),
        "{got:?}"
    );
}

const KO4: &str = "a_second_open_of_an_open_identity_is_refused_in_this_process_and_another";
const KO4_DIR: &str = "SPATIAL_IDE_KO4_CHILD_DIR";

/// **K-O4**. While a reopen holds the identity, a second open of the folder, and of a copy
/// answered `same`, is refused as open elsewhere, in this process and in a child copy of this
/// test binary; `folders.json` and `locations.json` stay byte for byte. Each wait is bounded.
///
/// RECORDED MUTATIONS: (a) no lock taken; expected failure: the second open replies `opened`.
/// (b) step 2's writes made before the lock; expected failure: `folders.json` gains the copy.
#[test]
fn a_second_open_of_an_open_identity_is_refused_in_this_process_and_another() {
    if let Ok(dir) = std::env::var(KO4_DIR) {
        let dir = Path::new(&dir);
        let run = Run::with_arm(
            &dir.join("child"),
            &dir.join("machine"),
            watch_support::no_watch_arm(),
        );
        let got = run
            .projects()
            .open_project(&dir.join("project"), "k", None, None);
        println!("ko4: {}", matches!(got, Err(OpenFailure::OpenElsewhere(_))));
        return;
    }
    let rig = rig("k-o4");
    let run = rig.run();
    let project = saved_inside(&rig, &run);
    let copy = rig.dir.join("copy");
    copy_project(&rig.folder, &copy);
    let files = [FOLDERS, LOCATIONS].map(|f| rig.machine_file(&project, f));
    let before = files
        .clone()
        .map(|f| std::fs::read(f).expect("a machine file"));
    let holder = run.projects();
    opened(holder.open_project(&rig.folder, "k", None, None));
    let names = run.names();
    for (folder, answer) in [(&rig.folder, None), (&copy, Some(Answer::Same))] {
        let got = run.projects().open_project(folder, "k", answer, None);
        let elsewhere = matches!(got, Err(OpenFailure::OpenElsewhere(ref p)) if *p == project);
        assert!(elsewhere, "{got:?}");
    }
    let exe = std::env::current_exe().expect("the test binary");
    let mut child = std::process::Command::new(exe)
        .args(["--exact", KO4, "--nocapture", "--test-threads=1"])
        .env(KO4_DIR, &rig.dir)
        .stdout(std::process::Stdio::piped())
        .stderr(std::process::Stdio::null())
        .spawn()
        .expect("the child");
    let out = std::io::BufReader::new(child.stdout.take().expect("the child's stdout"));
    let (said, heard) = std::sync::mpsc::channel();
    std::thread::spawn(move || {
        use std::io::BufRead;
        let mut lines = out.lines().map_while(Result::ok);
        let _ = said.send(lines.find_map(|l| Some(l.split_once("ko4: ")?.1.to_string())));
    });
    let reply = heard.recv_timeout(Duration::from_secs(60));
    let started = std::time::Instant::now();
    while child.try_wait().expect("wait").is_none() {
        if started.elapsed() > Duration::from_secs(60) {
            child.kill().expect("kill the child this test started");
            panic!("the child did not end within 60 s");
        }
        std::thread::sleep(Duration::from_millis(50));
    }
    assert_eq!(
        reply,
        Ok(Some("true".to_string())),
        "refused in another process"
    );
    assert_eq!(run.names(), names, "nothing more is opened");
    assert_eq!(
        files.map(|f| std::fs::read(f).expect("a machine file")),
        before
    );
}

/// **K-O6** (§2.4 step 2's cases; a refused `project.spatial` in the first folder asks). A copy of
/// the project is reopened while the first folder holds this identity, cannot be read, or holds a
/// file the reader refuses: the question, with nothing written. When the first folder holds
/// another project, holds none, or is gone: a move, with the copy as `first`.
///
/// RECORDED MUTATION: the question asked whenever the first folder exists. Expected failure: the
/// copy is asked when the first folder holds another project.
#[test]
fn the_question_is_asked_only_when_the_first_folder_holds_this_identity_or_cannot_be_reached() {
    let rig = rig("k-o6");
    let run = rig.run();
    let project = saved_inside(&rig, &run);
    let copy = rig.dir.join("copy");
    copy_project(&rig.folder, &copy);
    let folders = rig.machine_file(&project, FOLDERS);
    let remembered = std::fs::read(&folders).expect("folders.json");
    let o = opened(reopen(&rig, &run, &project));
    run.close(&o.dataset);
    assert_eq!(
        std::fs::read(&folders).expect("kept"),
        remembered,
        "known: no write"
    );
    let at_copy = || reopen_at(&rig, &run, &project, &copy, None, None);
    let asked = |case: &str| {
        assert!(matches!(at_copy(), Ok(Reopen::Question)), "{case}");
        assert_eq!(std::fs::read(&folders).expect("kept"), remembered, "{case}");
    };
    let moved = |case: &str| {
        run.close(&opened(at_copy()).dataset);
        let known = KnownFolders::from_bytes(&std::fs::read(&folders).expect("folders.json"));
        let first = std::path::absolute(&copy).expect("absolute");
        assert_eq!(known.expect("read").first, first, "{case}");
        std::fs::write(&folders, &remembered).expect("the first folder remembered again");
    };
    asked("holds this identity");
    readable(&rig.file(), false);
    let got = at_copy();
    readable(&rig.file(), true);
    assert!(
        matches!(got, Ok(Reopen::Question)),
        "cannot be reached: {got:?}"
    );
    std::fs::write(rig.file(), b"{}").expect("a file the reader refuses");
    asked("holds a refused file");
    std::fs::copy(copy.join(PROJECT_FILE_NAME), rig.file()).expect("restored");
    set_file(&rig, |f| {
        f.project = PROJECT.parse().expect("another identity")
    });
    moved("holds another");
    std::fs::remove_file(rig.file()).expect("removed");
    moved("holds none");
    std::fs::remove_dir_all(&rig.folder).expect("removed");
    moved("gone");
}

/// `file` made unreadable to this process, or readable again: on Windows by an entry denying
/// Everyone (`S-1-1-0`) read access, added and then removed by `icacls`; elsewhere by its mode.
fn readable(file: &Path, yes: bool) {
    if cfg!(windows) {
        let deny = ["/deny", "*S-1-1-0:(R)"];
        let args = if yes { ["/remove:d", "*S-1-1-0"] } else { deny };
        let path = file.display().to_string().replace('/', "\\");
        let status = std::process::Command::new("icacls")
            .arg(path)
            .args(args)
            .status();
        assert!(status.is_ok_and(|s| s.success()), "icacls {args:?}");
    }
    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;
        let mode = std::fs::Permissions::from_mode(if yes { 0o644 } else { 0o000 });
        std::fs::set_permissions(file, mode).expect("the mode set");
    }
}

/// **K-O6 (b)** (Amendment 30 item 6 (d)). After the folder moves, a reopen there makes it `first`
/// and forgets the old one; a copy placed back at the old path is then asked.
///
/// RECORDED MUTATION: `moved_to` keeps the old `first` in `same`. Expected failure: the copy at the
/// old path is known, and is opened with no question.
#[test]
fn a_move_answer_rewrites_folders_json_with_this_folder_first_and_asks_again_at_the_old_path() {
    let rig = rig("k-o6b");
    let run = rig.run();
    let project = saved_inside(&rig, &run);
    let moved = rig.dir.join("moved");
    std::fs::rename(&rig.folder, &moved).expect("the folder moved");
    let o = opened(reopen_at(&rig, &run, &project, &moved, None, None));
    run.close(&o.dataset);
    let bytes = std::fs::read(rig.machine_file(&project, FOLDERS)).expect("folders.json");
    let first = std::path::absolute(&moved).expect("absolute");
    let same = Vec::new();
    assert_eq!(
        KnownFolders::from_bytes(&bytes),
        Ok(KnownFolders { first, same })
    );
    copy_project(&moved, &rig.folder);
    assert!(matches!(reopen(&rig, &run, &project), Ok(Reopen::Question)));
}

/// **K-O7**. A copy answered `copy` gets a new identity in its own file, `folders.json` with it as
/// `first`, and its own `locations.json`; the first folder's file and the old identity's machine
/// files are unchanged.
///
/// RECORDED MUTATION: the new identity written to the first folder's file. Expected failure: the
/// first folder's file changes.
#[test]
fn a_copy_gets_a_new_identity_in_the_new_folder_and_its_own_links() {
    let rig = rig("k-o7");
    let run = rig.run();
    let project = saved_inside(&rig, &run);
    let copy = rig.dir.join("copy");
    copy_project(&rig.folder, &copy);
    let machine = |name| rig.machine_file(&project, name);
    let kept = [rig.file(), machine(FOLDERS), machine(LOCATIONS)];
    let before = kept.clone().map(|f| std::fs::read(f).expect("a file"));
    let o = opened(reopen_at(
        &rig,
        &run,
        &project,
        &copy,
        Some(Answer::Copy),
        None,
    ));
    assert_ne!(o.project, project);
    assert_eq!(kept.map(|f| std::fs::read(f).expect("a file")), before);
    let file = read_project(&std::fs::read(copy.join(PROJECT_FILE_NAME)).expect("the copy's"));
    let file = file.expect("read");
    assert_eq!(file.project, o.project);
    let bytes = std::fs::read(rig.machine_file(&o.project, FOLDERS)).expect("folders.json");
    let first = std::path::absolute(&copy).expect("absolute");
    let same = Vec::new();
    assert_eq!(
        KnownFolders::from_bytes(&bytes),
        Ok(KnownFolders { first, same })
    );
    let bytes = std::fs::read(rig.machine_file(&o.project, LOCATIONS)).expect("locations.json");
    let path = run.dataset(&o.dataset).path().to_path_buf();
    let dataset = file.dataset.uri().clone();
    assert_eq!(read_locations(&bytes), Ok(vec![Location { dataset, path }]));
}

/// **K-O8** (ADV-2026-11-18-18 item 4 (c)). Data saved outside, moved, and re-linked: a relative
/// re-link is refused naming `locations.json` and nothing is written; the absolute one is opened
/// and checked, its later time named, and `locations.json` then holds it.
///
/// RECORDED MUTATIONS: (a) the check skipped on re-link; expected failure: no change detected.
/// (b) the re-link written without `locations_to_bytes`; expected failure: the relative re-link is
/// not refused by the machine record.
#[test]
fn a_relinked_file_is_checked_against_the_observation_and_each_difference_named() {
    let rig = rig("k-o8");
    let run = rig.run();
    let (project, data) = saved_outside(&rig, &run);
    let relinked = rig.dir.join("elsewhere/parcels.parquet");
    std::fs::create_dir_all(relinked.parent().expect("a parent")).expect("the folder");
    std::fs::copy(&data, &relinked).expect("copied");
    later_by_60_s(&relinked, &data);
    std::fs::remove_file(&data).expect("removed");
    let locations = rig.machine_file(&project, LOCATIONS);
    let before = std::fs::read(&locations).expect("locations.json");
    let relative = Path::new("elsewhere/parcels.parquet");
    let got = reopen_at(&rig, &run, &project, &rig.folder, None, Some(relative));
    let named = matches!(got, Err(OpenFailure::MachineRecordRefused(ref r)) if r.file == LOCATIONS);
    assert!(named, "{got:?}");
    assert_eq!(std::fs::read(&locations).expect("kept"), before);
    let got = reopen_at(&rig, &run, &project, &rig.folder, None, Some(&relinked));
    let (observed, admission) = (vec!["mtime"], vec![]);
    assert_eq!(
        opened(got).check,
        RefCheck::Differs {
            observed,
            admission
        }
    );
    let at = read_locations(&std::fs::read(&locations).expect("locations.json"));
    assert_eq!(at.expect("read")[0].path, relinked);
}

/// **K-O9** (V3). The saved view's space is given another definition: the view's state names both
/// identifiers, and the view is not applied.
///
/// RECORDED MUTATION: the spaces compared by `identifier` only. Expected failure: `Applies`.
#[test]
fn a_view_saved_in_another_space_is_not_applied_and_the_reopen_names_it() {
    let rig = rig("k-o9");
    let run = rig.run();
    let project = saved_inside(&rig, &run);
    let other = Some(sha256_hex(b"another definition"));
    set_file(&rig, |f| f.workspace.view.crs.definition = other);
    match opened(reopen(&rig, &run, &project)).view {
        ViewState::SavedInAnotherSpace { basis } => {
            assert_eq!(basis.matches("EPSG:2056").count(), 2, "{basis}");
        }
        other => panic!("saved in another space: {other:?}"),
    }
}

/// The bytes of a `folders.json` in its format, with `n` folders, under an absolute root.
fn folders_of(n: usize) -> String {
    let root = if cfg!(windows) { "C:/k-o10" } else { "/k-o10" };
    let same: Vec<String> = (1..n).map(|i| format!("\"{root}/f{i}\"")).collect();
    let (first, same) = (format!("{root}/f0"), same.join(","));
    format!(r#"{{"format":"spatial-folders","version":1,"first":"{first}","same":[{same}]}}"#)
}

/// **K-O10** (M1). A `folders.json` with a duplicate key, then one of 257 folders (by hand):
/// each refuses the reopen naming the file, and is kept byte for byte.
///
/// RECORDED MUTATION: a refused `folders.json` read as absent. Expected failure: it is replaced.
#[test]
fn a_folders_json_the_reader_refuses_refuses_the_open_by_name_and_is_kept() {
    let rig = rig("k-o10");
    let run = rig.run();
    let project = saved_inside(&rig, &run);
    let path = rig.machine_file(&project, FOLDERS);
    let text = std::fs::read_to_string(&path).expect("folders.json");
    let twice = text.replacen("\"version\":1,", "\"version\":1,\"version\":1,", 1);
    assert_ne!(twice, text);
    for bad in [twice, folders_of(257) + "\n"] {
        std::fs::write(&path, &bad).expect("written");
        record_refused(&rig, &run, &project, FOLDERS);
        assert_eq!(std::fs::read_to_string(&path).expect("kept"), bad);
    }
}

/// **K-O10 (b)** (ADV-2026-11-18-18 item 4 (c)). A `locations.json` with a relative `path`, a bad
/// dataset URI, or another format: each refuses the reopen naming the file, and is kept.
///
/// RECORDED MUTATION: as K-O10's, for `locations.json`. Expected failure: `not_found`.
#[test]
fn a_locations_json_the_reader_refuses_refuses_the_open_by_name_and_is_kept() {
    let rig = rig("k-o10b");
    let run = rig.run();
    let (project, _) = saved_outside(&rig, &run);
    let path = rig.machine_file(&project, LOCATIONS);
    let file = read_project(&std::fs::read(rig.file()).expect("the file")).expect("read");
    let uri = file.dataset.uri().as_str().to_string();
    let absolute = if cfg!(windows) {
        "C:/k/p.parquet"
    } else {
        "/k/p.parquet"
    };
    let doc = |format: &str, uri: &str, path: &str| {
        let entry = format!(r#"{{"dataset":"{uri}","path":"{path}"}}"#);
        format!("{{\"format\":\"{format}\",\"version\":1,\"entries\":[{entry}]}}\n")
    };
    let (zz, kind) = ("spatial://dataset/ref/zz", "spatial-locations");
    let bad = [
        doc(kind, &uri, "k/p.parquet"),
        doc(kind, zz, absolute),
        doc("spatial-location", &uri, absolute),
    ];
    for bad in bad {
        std::fs::write(&path, &bad).expect("written");
        record_refused(&rig, &run, &project, LOCATIONS);
        assert_eq!(std::fs::read_to_string(&path).expect("kept"), bad);
    }
}

/// **K-O11** (M2). The identity remembers 256 folders; a copy answered `same` is refused, the list
/// full, and `folders.json` is kept byte for byte.
///
/// RECORDED MUTATION: `with_same` drops the oldest `same` entry. Expected failure: `opened`.
#[test]
fn a_same_answer_past_256_known_folders_is_refused_and_none_is_forgotten() {
    let rig = rig("k-o11");
    let run = rig.run();
    let project = saved_inside(&rig, &run);
    let first = std::path::absolute(&rig.folder).expect("absolute");
    let root = if cfg!(windows) { "C:/k-o11" } else { "/k-o11" };
    let same = (1..256)
        .map(|i| PathBuf::from(format!("{root}/f{i}")))
        .collect();
    let bytes = KnownFolders { first, same }
        .to_bytes()
        .expect("256 folders");
    let path = rig.machine_file(&project, FOLDERS);
    std::fs::write(&path, &bytes).expect("written");
    let copy = rig.dir.join("copy");
    copy_project(&rig.folder, &copy);
    let got = reopen_at(&rig, &run, &project, &copy, Some(Answer::Same), None);
    let full = matches!(got, Err(OpenFailure::KnownFoldersFull { count: 256, .. }));
    assert!(full, "{got:?}");
    assert_eq!(std::fs::read(&path).expect("kept"), bytes);
}

/// **K-O12** (class 9). `project.spatial` grown to 1,048,577 bytes, then to 4 MiB: each refused by
/// name, at 1,048,577 bytes read. The 4 MiB case is this part's own: at 1,048,577 bytes a read
/// that is not bounded reads the same bytes.
///
/// RECORDED MUTATION: the read unbounded. Expected failure: the 4 MiB case names 4,194,304 bytes.
#[test]
fn a_project_file_over_its_ceiling_is_refused_at_reopen_without_being_read_whole() {
    let rig = rig("k-o12");
    let run = rig.run();
    let project = saved_inside(&rig, &run);
    for len in [1_048_577, 4 * 1_048_576] {
        let file = std::fs::File::options().write(true).open(rig.file());
        file.and_then(|f| f.set_len(len)).expect("grown");
        match reopen(&rig, &run, &project) {
            Err(OpenFailure::FileRefused(r)) => assert!(r.rule.contains("is 1048577 bytes"), "{r}"),
            other => panic!("{len}: refused by size: {other:?}"),
        }
    }
}

/// A lineage file of at least `size` bytes: a header and style steps, each the next one's parent.
fn long_lineage(size: usize) -> Vec<String> {
    let template = step(1, None, "style", OPACITY);
    let head = format!("\"id\":\"{}\",\"parent\":null", sid(1));
    let (mut lines, mut at, mut n) = (vec![header()], 0, 0u32);
    while at < size {
        n += 1;
        let parent = if n > 1 {
            format!("\"step_{:032x}\"", n - 1)
        } else {
            "null".to_string()
        };
        let line = template.replacen(
            &head,
            &format!("\"id\":\"step_{n:032x}\",\"parent\":{parent}"),
            1,
        );
        at += line.len() + 1;
        lines.push(line);
    }
    lines
}

/// **K-O13** (class 9; ADV-2026-11-18-23 item 2 (b)). A valid lineage file of 30 MiB widens step 6,
/// and a thread cancels the key as soon as the registry holds it. The data is removed, so a reopen
/// the cancel did not end before the data step would be refused there instead: cancelled, nothing
/// opened, the lock free.
///
/// RECORDED MUTATION: the key registered only by the engine open. Expected failure: the reopen is
/// refused at the target.
#[test]
fn a_cancel_before_the_engine_open_ends_the_reopen_with_nothing_opened_and_no_lock_held() {
    let rig = rig("k-o13");
    let run = rig.run();
    let project = saved_inside(&rig, &run);
    let lines = long_lineage(30 * 1_048_576);
    set_file(&rig, |f| f.lineage = member(&lines));
    lineage_at(&rig, &lines);
    std::fs::remove_file(rig.folder.join("data/parcels.parquet")).expect("removed");
    let (host, stop) = (run.host.clone(), Arc::new(AtomicBool::new(false)));
    let until = stop.clone();
    let canceller = std::thread::spawn(move || {
        while !until.load(Ordering::SeqCst) {
            let handle = "k-o13".to_string();
            let req = CancelRequest {
                skp: SKP_VERSION.to_string(),
                handle,
            };
            if host.cancel(req).expect("cancel").state == CancelState::Requested {
                return true;
            }
            std::thread::yield_now();
        }
        false
    });
    let before = run.names();
    let got = run
        .projects()
        .open_project(&rig.folder, "k-o13", None, None);
    stop.store(true, Ordering::SeqCst);
    assert!(
        canceller.join().expect("the thread"),
        "the key was cancelled"
    );
    assert!(matches!(got, Err(OpenFailure::Cancelled)), "{got:?}");
    assert_eq!(run.names(), before);
    lock_free(&rig, &project);
}

/// **K-O14** (class 9). After a reopen that finds no file, one refused through a link, and one the
/// engine refuses after the lock (the data file's bytes are not a parquet file), the lock is free
/// (`reopen_at`'s check).
///
/// RECORDED MUTATION: the lock kept after an error. Expected failure: the lock is held.
#[test]
fn a_refused_or_cancelled_reopen_leaves_open_lock_free() {
    let rig = rig("k-o14");
    let run = rig.run();
    let (project, data) = saved_outside(&rig, &run);
    std::fs::remove_file(&data).expect("removed");
    assert!(matches!(
        reopen(&rig, &run, &project),
        Ok(Reopen::NotFound { .. })
    ));
    std::fs::remove_dir_all(&rig.folder).expect("removed");
    std::fs::create_dir(&rig.folder).expect("a new folder");
    let project = saved_inside(&rig, &run);
    let (inside, real) = (rig.folder.join("data"), rig.folder.join("real"));
    std::fs::rename(&inside, &real).expect("moved");
    link_to(&inside, &real);
    let got = reopen(&rig, &run, &project);
    assert!(
        matches!(got, Err(OpenFailure::TargetRefused { .. })),
        "{got:?}"
    );
    std::fs::remove_dir(&inside)
        .or_else(|_| std::fs::remove_file(&inside))
        .expect("unlinked");
    std::fs::rename(&real, &inside).expect("moved back");
    std::fs::write(inside.join("parcels.parquet"), b"not a parquet file").expect("written");
    let got = reopen(&rig, &run, &project);
    assert!(matches!(got, Err(OpenFailure::Open(_))), "{got:?}");
}

/// The product's watch arm, recording each path it is given and whether it armed a watch.
#[derive(Default)]
struct Recording(Mutex<Vec<(PathBuf, bool)>>);

impl SourceWatchArm for Recording {
    fn arm(&self, path: &Path, sink: WatchSink) -> ArmOutcome {
        let armed = PlatformWatch::new().arm(path, sink);
        let watching = matches!(armed, ArmOutcome::Watching(_));
        self.0
            .lock()
            .expect("the record")
            .push((path.to_path_buf(), watching));
        armed
    }
}

/// **K-O15** (class 9; H4; Windows only, by a run-time check). A reopen through a `project-relative`
/// locator arms the product's watch with the engine's own path, in the `\\?\` form, and it watches.
///
/// RECORDED MUTATION: the arm given the path without its `\\?\` prefix. Expected failure: the arm's
/// path is not the engine's.
#[test]
fn on_windows_a_reopened_project_relative_open_is_watched() {
    println!("K-O15 runs on {}", std::env::consts::OS);
    if std::env::consts::OS != "windows" {
        return;
    }
    let rig = rig("k-o15");
    let project = saved_inside(&rig, &rig.run());
    let arm = Arc::new(Recording::default());
    let run = Run::with_arm(&rig.sessions, &rig.machine, arm.clone());
    let o = opened(reopen(&rig, &run, &project));
    let path = run.dataset(&o.dataset).path().to_path_buf();
    assert!(
        path.to_string_lossy().starts_with(r"\\?\"),
        "{}",
        path.display()
    );
    assert_eq!(*arm.0.lock().expect("the record"), vec![(path, true)]);
}

/// Run 1 opens F1 inside the folder, saves it, then records a step, so the project's record holds
/// one step and no mark; it ends with no `end_session`, leaving the record. The identity, and the
/// record's history bytes.
fn left_by_another_run(rig: &Rig) -> (ProjectUri, PathBuf, Vec<u8>) {
    let run = rig.run();
    let data = rig.folder.join("data/parcels.parquet");
    fixture(&data, f1());
    let (handle, ds) = run.open(&data, (None, None));
    let saved = run.projects().save(
        handle.as_str(),
        &ds,
        Some(&rig.folder),
        workspace(&ds, None),
    );
    let project = saved.expect("saved").project;
    run.opacity_step(&handle, 0.5);
    drop((ds, run));
    let history = rig.sessions.join(project.hex()).join("history.jsonl");
    let bytes = std::fs::read(&history).expect("the record's history");
    (project, history, bytes)
}

/// The records named `unsaved-…` in the session store root, each read by `recover`.
fn own_records(rig: &Rig) -> Vec<Vec<String>> {
    let entries = std::fs::read_dir(&rig.sessions).expect("the store root");
    let names = entries.map(|e| e.expect("an entry").path());
    let own = names.filter(|p| {
        p.file_name()
            .is_some_and(|n| n.to_string_lossy().starts_with("unsaved-"))
    });
    own.map(|p| recover(&p).lines).collect()
}

fn withheld_unwritable(mark: &HistoryMark) -> bool {
    matches!(mark, HistoryMark::Withheld(Withheld::HistoryUnwritable(_)))
}

/// **K-O16** (sub-case 1; R3 (b)). A later run reopens the project another run left a record for,
/// records a step and saves: withheld as unwritable; the earlier record byte for byte; the open's
/// own record keeps its step; no mark in either.
///
/// RECORDED MUTATION: `copy_under` makes its folder with `create_dir_all`. Expected failure: the
/// earlier record is replaced.
#[test]
fn a_save_after_a_reopen_whose_project_record_another_run_left_replaces_neither_history() {
    let rig = rig("k-o16");
    let (project, history, earlier) = left_by_another_run(&rig);
    let run = rig.run();
    let projects = run.projects();
    let o = opened(projects.open_project(&rig.folder, "k", None, None));
    run.opacity_step(&o.dataset, 0.25);
    let ds = run.dataset(&o.dataset);
    let saved = projects.save(o.dataset.as_str(), &ds, None, o.workspace);
    let saved = saved.expect("the project file is saved");
    assert!(
        withheld_unwritable(&saved.history_mark),
        "{:?}",
        saved.history_mark
    );
    assert_eq!(saved.project, project);
    drop((ds, projects, run));
    assert_eq!(std::fs::read(&history).expect("kept"), earlier);
    let own = own_records(&rig);
    assert_eq!(
        own.iter().map(Vec::len).collect::<Vec<_>>(),
        [2],
        "a header and the step"
    );
    assert!(!own[0].iter().any(|l| l.contains("\"mark\"")));
    assert!(!String::from_utf8_lossy(&earlier).contains("\"mark\""));
}

/// **K-O18** (sub-case 2; ADV-2026-11-19-04 P-2 (i)). A later run reopens it and saves with no
/// step: withheld as unwritable, twice, since the open stays unbound; the earlier record is kept.
///
/// RECORDED MUTATION: `adopt_project` binds the open with no move over another run's folder.
/// Expected failure: the save's mark is withheld for no step.
#[test]
fn a_save_after_a_reopen_with_no_step_whose_project_record_another_run_left_leaves_it_and_keeps_the_open_unbound(
) {
    let rig = rig("k-o18");
    let (_, history, earlier) = left_by_another_run(&rig);
    let run = rig.run();
    let projects = run.projects();
    let o = opened(projects.open_project(&rig.folder, "k", None, None));
    let ds = run.dataset(&o.dataset);
    for _ in 0..2 {
        let saved = projects.save(o.dataset.as_str(), &ds, None, o.workspace.clone());
        let mark = saved.expect("the project file is saved").history_mark;
        assert!(withheld_unwritable(&mark), "{mark:?}");
    }
    assert_eq!(std::fs::read(&history).expect("kept"), earlier);
}

/// **K-O19** (R3 (b), under P-2 (i)). After that save, the first step is recorded under a record
/// of the open's own, and the leftover is unchanged.
///
/// RECORDED MUTATION (Amendment 40 item 3; K-O19's own): in `adopt_project`'s arm for a record
/// folder another run left, the open is bound to the project before the refusal is returned.
/// Seen failing at the step, after the save's `assert!` held: `Run::opacity_step`'s
/// `expect("recorded")`, since `create` refuses the record folder the other run left.
/// K-O18's mutation (Amendment 39, declared after the result was seen): item 5 (g)'s arm never
/// taken, so `adopt_project` binds the open with no move over another run's folder. Seen failing
/// at the `assert!` right after the save, before the step:
/// `withheld_unwritable(&saved.expect("saved").history_mark)`.
/// The declared mutation, `create`'s `create_dir` replaced by `create_dir_all`, did not fail this
/// test: under P-2 option (i) the first step never meets an existing folder (Amendment 39 item 1).
#[test]
fn the_first_step_after_that_save_meets_no_leftover_folder_and_has_a_record_of_its_own() {
    let rig = rig("k-o19");
    let (_, history, earlier) = left_by_another_run(&rig);
    let run = rig.run();
    let projects = run.projects();
    let o = opened(projects.open_project(&rig.folder, "k", None, None));
    let ds = run.dataset(&o.dataset);
    let saved = projects.save(o.dataset.as_str(), &ds, None, o.workspace);
    assert!(withheld_unwritable(&saved.expect("saved").history_mark));
    run.opacity_step(&o.dataset, 0.25);
    drop((ds, projects, run));
    assert_eq!(std::fs::read(&history).expect("kept"), earlier);
    assert_eq!(
        own_records(&rig).iter().map(Vec::len).collect::<Vec<_>>(),
        [2]
    );
}

/// **K-O20** (R3 (d)). A reopened project whose member records a lineage: its save is refused as
/// a lineage this version does not keep, and `project.spatial` and the lineage file are kept.
///
/// RECORDED MUTATION: the kept-lineage refusal removed. Expected failure: the file is replaced.
#[test]
fn a_later_save_of_a_reopened_project_whose_member_records_a_lineage_is_refused_and_the_files_are_kept(
) {
    let rig = rig("k-o20");
    let run = rig.run();
    let project = saved_inside(&rig, &run);
    let lines = saved();
    set_file(&rig, |f| f.lineage = member(&lines));
    lineage_at(&rig, &lines);
    let before = std::fs::read(rig.file()).expect("the file");
    let projects = run.projects();
    let o = opened(projects.open_project(&rig.folder, "k", None, None));
    assert_eq!(o.project, project);
    let ds = run.dataset(&o.dataset);
    let got = projects.save(o.dataset.as_str(), &ds, None, o.workspace);
    assert!(matches!(got, Err(SaveFailure::LineageNotKept)), "{got:?}");
    assert_eq!(std::fs::read(rig.file()).expect("kept"), before);
    let lineage = std::fs::read(rig.folder.join(".spatial/lineage.jsonl")).expect("kept");
    assert_eq!(lineage, bytes(&lines));
}

/// **K-O21** (O-11; O-6 item 2). A later run reopens, records a step and saves with no folder:
/// the same project and dataset URIs in the same folder's file, and the step's `data.dataset` is
/// the file's dataset URI.
///
/// RECORDED MUTATIONS: (a) the reopen not entered in the saved list; expected failure: the save
/// needs a folder. (b) the recorder's minted dataset URI kept; expected failure: the step's
/// `data.dataset` differs.
#[test]
fn a_save_after_a_reopen_keeps_the_project_and_dataset_identities_and_the_folder() {
    let rig = rig("k-o21");
    let project = saved_inside(&rig, &rig.run());
    let first = read_project(&std::fs::read(rig.file()).expect("the file")).expect("read");
    let run = rig.run();
    let projects = run.projects();
    let o = opened(projects.open_project(&rig.folder, "k", None, None));
    run.opacity_step(&o.dataset, 0.25);
    let ds = run.dataset(&o.dataset);
    let saved = projects.save(o.dataset.as_str(), &ds, None, o.workspace);
    assert_eq!(saved.expect("saved with no folder").project, project);
    let again = read_project(&std::fs::read(rig.file()).expect("the file")).expect("read");
    assert_eq!(
        (&again.project, again.dataset.uri()),
        (&project, first.dataset.uri())
    );
    drop((ds, projects, run));
    let lines = recover(&rig.sessions.join(project.hex())).lines;
    let step: serde_json::Value = serde_json::from_str(&lines[1]).expect("a step line");
    assert_eq!(
        step["step"]["data"]["dataset"],
        first.dataset.uri().as_str()
    );
}

/// **K-O22** (OPEN-N4 (a); O-6 item 1). In the run that holds the project's record (the first
/// `Projects` dropped, standing in for P3b's close), a reopen's first step continues that record.
///
/// RECORDED MUTATION: no bind at the reopen. Expected failure: the record holds one step.
#[test]
fn a_reopen_in_the_run_that_holds_the_projects_record_continues_it_from_the_first_step() {
    let rig = rig("k-o22");
    let run = rig.run();
    let data = rig.folder.join("data/parcels.parquet");
    fixture(&data, f1());
    let (handle, ds) = run.open(&data, (None, None));
    let saved = run.projects().save(
        handle.as_str(),
        &ds,
        Some(&rig.folder),
        workspace(&ds, None),
    );
    let project = saved.expect("saved").project;
    run.opacity_step(&handle, 0.5);
    let o = opened(reopen(&rig, &run, &project));
    run.opacity_step(&o.dataset, 0.25);
    drop((ds, run));
    let lines = recover(&rig.sessions.join(project.hex())).lines;
    let steps: Vec<serde_json::Value> = lines[1..]
        .iter()
        .map(|l| serde_json::from_str(l).expect("JSON"))
        .collect();
    assert_eq!(steps.len(), 2, "{lines:?}");
    assert_eq!(steps[1]["step"]["parent"], steps[0]["step"]["id"]);
}

/// **K-O23** (Windows only, by a run-time check). The folder spelled in upper case is the known
/// folder: opened with no question, and `folders.json` unchanged.
///
/// RECORDED MUTATION: the known check compares as written. Expected failure: the question.
#[test]
fn on_windows_a_folder_spelled_with_another_case_is_the_known_folder() {
    println!("K-O23 runs on {}", std::env::consts::OS);
    if std::env::consts::OS != "windows" {
        return;
    }
    let rig = rig("k-o23");
    let run = rig.run();
    let project = saved_inside(&rig, &run);
    let folders = rig.machine_file(&project, FOLDERS);
    let before = std::fs::read(&folders).expect("folders.json");
    let upper = PathBuf::from(rig.folder.display().to_string().to_uppercase());
    opened(reopen_at(&rig, &run, &project, &upper, None, None));
    assert_eq!(std::fs::read(&folders).expect("kept"), before);
}

/// **K-O25** (Amendment 41 item 4). A re-link the writer refuses (a relative path, as K-O8's) is
/// refused naming `locations.json`, with nothing written. Answered `copy` from a copy of the
/// folder: the copy's `project.spatial` is byte for byte as before, and the machine store gains no
/// folder for a new identity. At a first reopen on this machine (the identity's machine folder
/// removed, so no `folders.json`): the machine store holds no folder for the identity. The copy
/// runs first, since it needs the save's `folders.json` to ask. Both call `open_project` directly:
/// `reopen_at`'s lock check would make the identity's folder. Each case's refusal is asserted
/// first; the cases' "nothing written" verdicts are asserted together.
///
/// RECORDED MUTATION: the re-link's check by the writer put back after step 3's writes, its bytes
/// still kept. Expected failure: the assertion that nothing was written, naming both cases.
#[test]
fn a_relink_the_writer_refuses_writes_nothing_at_a_first_reopen_or_a_copy() {
    let rig = rig("k-o25");
    let run = rig.run();
    let project = saved_inside(&rig, &run);
    let relative = Path::new("elsewhere/parcels.parquet");
    let named = |got: &Result<Reopen, OpenFailure>| match got {
        Err(OpenFailure::MachineRecordRefused(r)) => r.file == LOCATIONS,
        _ => false,
    };
    let folders_in_store = || {
        let entries = std::fs::read_dir(&rig.machine).expect("the machine store");
        let mut all: Vec<PathBuf> = entries.map(|e| e.expect("an entry").path()).collect();
        all.sort();
        all
    };
    let mut written = Vec::new();

    let copy = rig.dir.join("copy");
    copy_project(&rig.folder, &copy);
    let copy_file = copy.join(PROJECT_FILE_NAME);
    let file_before = std::fs::read(&copy_file).expect("the copy's");
    let store_before = folders_in_store();
    let got = run
        .projects()
        .open_project(&copy, "k", Some(Answer::Copy), Some(relative));
    assert!(named(&got), "copy: {got:?}");
    if std::fs::read(&copy_file).expect("the copy's") != file_before {
        written.push("copy: the copy's project.spatial");
    }
    if folders_in_store() != store_before {
        written.push("copy: a machine folder for a new identity");
    }

    let identity_dir = rig.machine.join(project.hex());
    std::fs::remove_dir_all(&identity_dir).expect("the identity's machine folder removed");
    let got = run
        .projects()
        .open_project(&rig.folder, "k", None, Some(relative));
    assert!(named(&got), "first reopen: {got:?}");
    if identity_dir.exists() {
        written.push("first reopen: the identity's machine folder");
    }

    assert!(written.is_empty(), "nothing written: {written:?}");
}

// ---------------------------------------------------------------------------------------------
// K-O26, L8 and L9 (Amendment 43, item 7 (b)): the lock's release after a session end, and the
// lineage reader's two refusals
// ---------------------------------------------------------------------------------------------

use spatial_skp::v0::{HexF64, SaveProjectRequest};

/// The names in `dir`, sorted.
fn listing(dir: &Path) -> Vec<String> {
    let entries = std::fs::read_dir(dir).expect("the folder");
    let names = entries.map(|e| e.expect("an entry").file_name());
    let mut names: Vec<String> = names.map(|n| n.to_string_lossy().into_owned()).collect();
    names.sort();
    names
}

/// **K-O26** (Amendment 36 item 8; Amendment 43 items 6 and 20). A saved open holds its identity's
/// lock, so a reopen of its folder by the same `Projects` is refused as open elsewhere (the
/// control). After `SkpHost::end_generation` on the open, the same reopen gives `opened`. Then
/// `save_project` for the ended open, given an empty folder, is refused by the end's code, and the
/// machine store gains no folder.
///
/// RECORDED MUTATION: the release not run in `open_project`. Expected failure: the second reopen
/// is refused as open elsewhere, and this test fails at `opened`.
///
/// RECORDED MUTATION 2 (Amendment 46 item 1 (b)): `release_ended` drops every entry. Expected
/// failure: the control's reopen, through the `Projects` that holds the lock while the open is
/// live, frees that lock and replies `opened`, and this test fails at the assertion named the
/// control.
#[test]
fn a_reopen_after_a_session_end_in_the_same_process_takes_the_lock() {
    let rig = rig("k-o26");
    let run = rig.run();
    let data = rig.folder.join("data/parcels.parquet");
    fixture(&data, f1());
    let (handle, ds) = run.open(&data, (None, None));
    let projects = run.projects();
    let ws = workspace(&ds, None);
    let saved = projects.save(handle.as_str(), &ds, Some(&rig.folder), ws);
    let project = saved.expect("saved").project;
    let got = projects.open_project(&rig.folder, "k", None, None);
    let held = matches!(got, Err(OpenFailure::OpenElsewhere(ref p)) if *p == project);
    assert!(held, "the control: {got:?}");
    run.host.end_generation(handle.as_str());
    let o = opened(projects.open_project(&rig.folder, "k", None, None));
    assert_eq!(o.project, project);

    let empty = rig.dir.join("empty");
    std::fs::create_dir(&empty).expect("an empty folder");
    let store = listing(&rig.machine);
    let style: serde_json::Value = serde_json::from_str(STYLE_DOC).expect("JSON");
    let zero = HexF64(0.0).to_hex();
    let wire = serde_json::json!({
        "skp": SKP_VERSION, "dataset": handle.as_str(), "folder": empty.display().to_string(),
        "workspace": {"filter": null, "clauses": [], "style": style,
            "view": {"centre": [zero, zero], "zoom": zero}}
    });
    let req: SaveProjectRequest = serde_json::from_value(wire).expect("the request");
    let refused = projects.save_project(req).err();
    let code = refused.as_ref().map(|e| e.code.as_str());
    assert_eq!(code, Some("engine.source_changed"), "{refused:?}");
    let gained = listing(&rig.machine) != store;
    assert!(!gained, "the machine store gains no folder");
    assert!(!empty.join(PROJECT_FILE_NAME).exists());
}

/// **L8** (Amendment 43 item 7 (b)). A folder at `.spatial/lineage.jsonl` beside a kept member is
/// refused as unreadable, and no lineage is read.
///
/// RECORDED MUTATION: `lineage_file`'s `unreadable` back to `Damaged { line: 0 }`. Expected
/// failure: the file is refused as damaged, and this test fails at its `Unreadable` match.
#[test]
fn an_unreadable_lineage_file_is_named_unreadable() {
    let dir = scratch("l8");
    let file = dir.join(".spatial/lineage.jsonl");
    std::fs::create_dir_all(&file).expect("a folder at the lineage file's name");
    let got = read_lineage(&file, &dir.join("previous.jsonl"), &member(&saved()));
    let refused = match &got.folder_file {
        FolderLineage::Refused(refused) => Some(refused),
        _ => None,
    };
    let unreadable = matches!(refused, Some(LineageRefused::Unreadable { .. }));
    assert!(unreadable, "{got:?}");
    assert_eq!(got.lineage, None);
}

/// **L9** (Amendment 43 item 7 (b)). Beside a kept member, a link at the lineage file's name is
/// refused as a link and is not followed: off Windows a symlink to a file that holds the member's
/// lineage, on Windows a junction (`link_to`). The link is kept, and no lineage is read.
///
/// RECORDED MUTATION: the link test in `lineage_file` removed. Expected failure: off Windows the
/// link is followed and the file reads as the project's lineage; on Windows the junction is opened
/// and refused as `Unreadable`.
#[test]
fn a_link_at_the_lineage_name_beside_a_kept_member_is_refused_and_never_followed() {
    let dir = scratch("l9");
    let lines = saved();
    let (link, target) = (dir.join("folder.jsonl"), dir.join("target"));
    if cfg!(windows) {
        std::fs::create_dir(&target).expect("the junction's folder");
    } else {
        std::fs::write(&target, bytes(&lines)).expect("a file matching the member");
    }
    link_to(&link, &target);
    let got = read_lineage(&link, &dir.join("previous.jsonl"), &member(&lines));
    let want = LineageRead {
        folder_file: FolderLineage::Refused(LineageRefused::ThroughLink),
        previous_file: Some(PreviousLineage::Absent),
        lineage: None,
    };
    assert_eq!(got, want);
    assert!(std::fs::symlink_metadata(&link).is_ok(), "the link is kept");
}
