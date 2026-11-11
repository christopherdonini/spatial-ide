// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **The project** (ADR-036 §1 to §5, §8 and §11, and its Amendment 1):
//! `kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md` §2.3, built in steps.
//!
//! - [`strict_json`]: the one reader for every file the ADR defines. It refuses what the writer
//!   would not write.
//! - [`file`]: the project file, `project.spatial`: its writer, which lays the document out through
//!   `spatial_renderer::canonical` (ADR-022 decision 3), and its reader.
//! - [`store`]: the identity, the machine store's paths, `folders.json`, and the atomic replace of
//!   `project.spatial`.
//! - [`resolver`]: [`resolver::judge`], which decides at save which locators the file carries.
//! - [`Projects::save`]: the save, in order: the checks that can refuse it, the judgment, the
//!   document, the machine store's files, the atomic replace of `project.spatial`, and last the
//!   history's two moves (the first save's record move and the `saved-here` mark), neither of which
//!   touches a record that another project of this run holds.
//! - [`Projects::save_project`]: the same save as an SKP command (SKP-V0 §11): the request's checks,
//!   the workspace built from its wire form, and each [`SaveFailure`] as its one SKP code.
//!
//! Nothing here holds a handle. The only file written in a project folder is `project.spatial`, and
//! only through [`store`]'s atomic replace.

pub mod file;
pub mod resolver;
pub mod store;
pub mod strict_json;

use std::fmt;
use std::io::Read;
use std::path::{Path, PathBuf};
use std::str::FromStr;
use std::sync::{Arc, Mutex};

use spatial_engine::Dataset;
use spatial_renderer::canonical::{sha256_hex, to_canonical_string, Json};
use spatial_renderer::style::{self, Value};
use spatial_skp::v0::{
    HistoryMarkState, ProjectRelativeLocator, ProjectWorkspace, SaveProjectRequest,
    SaveProjectResponse, SkpError,
};

use crate::dataset_ref::{DatasetRef, DatasetUri, RefBuildError};
use crate::session_history::{Reached, SavedHere, StepRecorder};
use crate::skp::{check_version, require_live};
use file::{
    read_project, write_project, Clause, Lineage, ProjectFile, ProjectFileRefused, Space, View,
    Workspace, MAX_PROJECT_FILE_BYTES,
};
use resolver::{judge, Carried, Why};
use store::{mint_identity, record_dir, replace, KnownFolders, MachineRecordRefused, SaveError};

/// The project file's name: one fixed name in the project folder (ADR-036 §1).
pub const PROJECT_FILE_NAME: &str = "project.spatial";

const PROJECT_URI_PREFIX: &str = "spatial://project/";
const PROJECT_HEX_LEN: usize = 32;

/// A project's identity: `spatial://project/` and 32 lowercase hex characters (ADR-036 §4).
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct ProjectUri(String);

impl ProjectUri {
    pub fn as_str(&self) -> &str {
        &self.0
    }

    /// The 32 hex characters: the project's record name in the machine store (ADR-036 §9).
    pub fn hex(&self) -> &str {
        &self.0[PROJECT_URI_PREFIX.len()..]
    }
}

/// Why a text is not a project identity.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct NotAProjectUri;

impl fmt::Display for NotAProjectUri {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(
            f,
            "expected `{PROJECT_URI_PREFIX}` and {PROJECT_HEX_LEN} lowercase hex characters"
        )
    }
}

impl std::error::Error for NotAProjectUri {}

impl FromStr for ProjectUri {
    type Err = NotAProjectUri;

    fn from_str(s: &str) -> Result<Self, NotAProjectUri> {
        let hex = s.strip_prefix(PROJECT_URI_PREFIX).ok_or(NotAProjectUri)?;
        let lower = |b: u8| matches!(b, b'0'..=b'9' | b'a'..=b'f');
        if hex.len() == PROJECT_HEX_LEN && hex.bytes().all(lower) {
            Ok(ProjectUri(s.to_string()))
        } else {
            Err(NotAProjectUri)
        }
    }
}

impl ProjectUri {
    /// From 16 random bytes: the store mints them from the operating system's CSPRNG.
    pub(crate) fn from_bytes(bytes: [u8; PROJECT_HEX_LEN / 2]) -> Self {
        let hex: String = bytes.iter().map(|b| format!("{b:02x}")).collect();
        ProjectUri(format!("{PROJECT_URI_PREFIX}{hex}"))
    }
}

/// Saves projects, and remembers which project each opened dataset was saved to in this run.
pub struct Projects {
    /// The machine store's `projects` folder: `<32 hex>/` for each identity.
    root: PathBuf,
    recorder: Arc<StepRecorder>,
    saved: Mutex<Vec<SavedProject>>,
}

#[derive(Clone)]
struct SavedProject {
    /// The catalog name of the dataset, which `open_dataset` mints once per open.
    dataset: String,
    project: ProjectUri,
    folder: PathBuf,
    /// The dataset entry's `logical_uri`, kept so every save of this open writes the same one.
    uri: DatasetUri,
}

/// What a save did.
#[derive(Debug)]
pub struct Saved {
    pub project: ProjectUri,
    pub history_mark: HistoryMark,
    /// The resolver's judgment: what the file carries for the data, and why it is
    /// `machine-recorded` alone where it is.
    pub carried: Carried,
}

/// Whether the history took the `saved-here` mark.
#[derive(Clone, Debug, PartialEq, Eq)]
pub enum HistoryMark {
    Written,
    Withheld(Withheld),
}

/// Why no `saved-here` mark was written. The project file was written in each case.
#[derive(Clone, Debug, PartialEq, Eq)]
pub enum Withheld {
    /// The history holds no step for this dataset.
    NoStepRecorded,
    /// The workspace differs from what the recorded steps reach, in the member named.
    WorkspaceDiffers(&'static str),
    /// The history's record for the dataset's file belongs to another project this run has saved,
    /// so none of this project's saves of this open writes a mark there.
    RecordHeldByAnotherProject,
    /// The history could not take the move or the line; the history's own message.
    HistoryUnwritable(String),
}

/// Why a save did not write the project file. Each variant states a fact about what was found.
#[derive(Debug)]
pub enum SaveFailure {
    /// The dataset has not been saved, and the request gave no folder.
    FolderRequired,
    /// The folder is not a folder this process can read.
    FolderUnusable(std::io::Error),
    /// A first save into a folder that already holds `project.spatial`.
    FolderHoldsProject(PathBuf),
    /// The open's observation is over the exact-integer bound, so no reference is bound to it.
    Bind(RefBuildError),
    /// The workspace, or the document built from it, breaks a rule the reader holds.
    FileRefused(ProjectFileRefused),
    /// The project file there now records a lineage, which this version does not keep.
    LineageNotKept,
    /// The project file, or the existing one, could not be written or read.
    ProjectFileUnwritable(SaveError),
    /// A machine store file could not be written.
    MachineStore {
        what: &'static str,
        source: std::io::Error,
    },
    /// `locations.json` or `folders.json` could not be written in its format; the refusal names
    /// the file.
    MachineRecordRefused(MachineRecordRefused),
}

impl fmt::Display for SaveFailure {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::FolderRequired => write!(
                f,
                "no folder was given, and this open of the dataset has no project to save to"
            ),
            Self::FolderUnusable(e) => write!(f, "the project folder cannot be read: {e}"),
            Self::FolderHoldsProject(p) => {
                write!(f, "{} already holds {PROJECT_FILE_NAME}", p.display())
            }
            Self::Bind(e) => write!(f, "no reference can be bound to the open: {e}"),
            Self::FileRefused(e) => write!(f, "{e}"),
            Self::LineageNotKept => write!(
                f,
                "{PROJECT_FILE_NAME} records a lineage, which this version of the application does not keep"
            ),
            Self::ProjectFileUnwritable(e) => write!(f, "{e}"),
            Self::MachineStore { what, source } => write!(f, "{what}: {source}"),
            Self::MachineRecordRefused(e) => write!(f, "{e}"),
        }
    }
}

impl std::error::Error for SaveFailure {}

impl Projects {
    /// `root` is the machine store's `projects` folder ([`store::projects_root`]), and `recorder`
    /// the session history the saved-here mark and the first save's record move go through.
    pub fn new(root: PathBuf, recorder: Arc<StepRecorder>) -> Self {
        Self {
            root,
            recorder,
            saved: Mutex::new(Vec::new()),
        }
    }

    /// Save `workspace` as the project of the dataset `ds`, which the catalog names `name`.
    ///
    /// - **A first save** needs `folder`. It mints the identity (ADR-036 §4), refuses a folder that
    ///   already holds `project.spatial`, and writes `folders.json` with the folder as `first`.
    /// - **A later save** keeps the identity and goes to the folder the first one used; it ignores
    ///   `folder`. It refuses to replace a project file that records a kept lineage, and one the
    ///   reader refuses, since either could hold what a rewrite would lose.
    /// - **Every save** writes `locations.json`, judges the locators ([`resolver::judge`]), checks
    ///   the document against the reader's rules, and replaces `project.spatial` whole or not at all.
    ///   Only then does the history take its moves: the first save's record move, unless another
    ///   project of this run holds the record, and a `saved-here` mark when the steps reach the
    ///   workspace and no other project holds the record. A history that cannot take them does not
    ///   undo the save; the result says so.
    pub fn save(
        &self,
        name: &str,
        ds: &Dataset,
        folder: Option<&Path>,
        workspace: Workspace,
    ) -> Result<Saved, SaveFailure> {
        let mut saved = self.saved.lock().unwrap_or_else(|e| e.into_inner());
        let known = saved.iter().find(|s| s.dataset == name).cloned();
        let first = known.is_none();
        let (project, folder, uri) = match known {
            Some(k) => (k.project, k.folder, k.uri),
            None => {
                let folder = folder.ok_or(SaveFailure::FolderRequired)?;
                (mint_identity(), folder.to_path_buf(), DatasetUri::mint())
            }
        };
        let target = folder.join(PROJECT_FILE_NAME);
        if first {
            std::fs::metadata(&folder)
                .and_then(|m| {
                    m.is_dir()
                        .then_some(())
                        .ok_or(std::io::ErrorKind::NotADirectory.into())
                })
                .map_err(SaveFailure::FolderUnusable)?;
            if std::fs::symlink_metadata(&target).is_ok() {
                return Err(SaveFailure::FolderHoldsProject(folder));
            }
        } else if let Some(there) = read_existing(&target)? {
            match read_project(&there) {
                Ok(f) if f.lineage != Lineage::NotKept => return Err(SaveFailure::LineageNotKept),
                Ok(_) => {}
                Err(e) => return Err(SaveFailure::FileRefused(e)),
            }
        }

        let reference = DatasetRef::linked(uri.clone(), ds).map_err(SaveFailure::Bind)?;
        let judged = judge(&reference, ds.path(), &folder);
        let file = ProjectFile {
            project: project.clone(),
            dataset: judged.reference,
            lineage: Lineage::NotKept,
            workspace: workspace.clone(),
        };
        let text = write_project(&file).map_err(SaveFailure::FileRefused)?;

        let dir = record_dir(&self.root, &project);
        let machine = |what| move |source| SaveFailure::MachineStore { what, source };
        std::fs::create_dir_all(&dir).map_err(machine("the project's machine folder"))?;
        let at = std::path::absolute(ds.path()).unwrap_or_else(|_| ds.path().to_path_buf());
        let locations = locations_json(&uri, &at).map_err(SaveFailure::MachineRecordRefused)?;
        write_machine_file(&dir, store::LOCATIONS, locations.as_bytes())
            .map_err(machine(store::LOCATIONS))?;
        if first {
            let first = std::path::absolute(&folder).unwrap_or_else(|_| folder.clone());
            let folders = KnownFolders {
                first,
                same: Vec::new(),
            };
            let bytes = folders
                .to_bytes()
                .map_err(SaveFailure::MachineRecordRefused)?;
            write_machine_file(&dir, store::FOLDERS, &bytes).map_err(machine(store::FOLDERS))?;
        }
        replace(&folder, text.as_bytes()).map_err(SaveFailure::ProjectFileUnwritable)?;
        if first {
            let dataset = name.to_string();
            saved.push(SavedProject {
                dataset,
                project: project.clone(),
                folder,
                uri,
            });
        }

        let history_mark = self.history(ds, &project, &workspace);
        Ok(Saved {
            project,
            history_mark,
            carried: judged.carried,
        })
    }

    /// `save_project` (SKP-V0 §11), the checks in order: the version, the catalog entry of the
    /// handle, the live check, the workspace as the project file would hold it, then
    /// [`Projects::save`], whose refusals are each mapped to their SKP code by [`skp_error_of`].
    /// A refusal writes no project file. The reply carries the identity and whether the history
    /// took the mark, and no path.
    pub fn save_project(&self, req: SaveProjectRequest) -> Result<SaveProjectResponse, SkpError> {
        check_version(&req.skp)?;
        let name = req.dataset.as_str();
        let host = self.recorder.host();
        let ds = host
            .catalog()
            .get(name)
            .ok_or_else(|| SkpError::unknown_dataset(name))?;
        require_live(&host.generations(), name)?;
        let workspace = workspace_of(&ds, req.workspace)?;
        let folder = req.folder.as_deref().map(Path::new);
        let saved = self
            .save(name, &ds, folder, workspace)
            .map_err(skp_error_of)?;
        let history_mark = match saved.history_mark {
            HistoryMark::Written => HistoryMarkState::Written,
            HistoryMark::Withheld(_) => HistoryMarkState::Withheld,
        };
        Ok(SaveProjectResponse {
            project: saved.project.as_str().to_string(),
            history_mark,
            project_relative: project_relative_of(&saved.carried),
        })
    }

    /// The history's moves after a save: the record moves under the project if it has not and no
    /// project holds it, and the mark is written if the steps reach the workspace and no other
    /// project holds the record.
    fn history(&self, ds: &Dataset, project: &ProjectUri, workspace: &Workspace) -> HistoryMark {
        let unwritable = |e: spatial_skp::v0::SkpError| {
            HistoryMark::Withheld(Withheld::HistoryUnwritable(e.message))
        };
        if let Err(e) = self.recorder.adopt_project(ds, project) {
            return unwritable(e);
        }
        match self
            .recorder
            .mark_saved_here(ds, project, |reached| differs(reached, workspace))
        {
            Ok(SavedHere::Written) => HistoryMark::Written,
            Ok(SavedHere::NoStep) => HistoryMark::Withheld(Withheld::NoStepRecorded),
            Ok(SavedHere::Differs(member)) => {
                HistoryMark::Withheld(Withheld::WorkspaceDiffers(member))
            }
            Ok(SavedHere::HeldByAnotherProject) => {
                HistoryMark::Withheld(Withheld::RecordHeldByAnotherProject)
            }
            Err(e) => unwritable(e),
        }
    }
}

/// The resolver's judgment as the reply's closed value; the path of `Carried::ProjectRelative` is
/// dropped. One exhaustive `match` with no wildcard arm: a new [`Why`] is a compile error here
/// until it is mapped.
fn project_relative_of(carried: &Carried) -> ProjectRelativeLocator {
    match carried {
        Carried::ProjectRelative(_) => ProjectRelativeLocator::Carried,
        Carried::MachineRecordedOnly(Why::Outside) => ProjectRelativeLocator::Outside,
        Carried::MachineRecordedOnly(Why::NoCanonicalSpelling) => {
            ProjectRelativeLocator::NoCanonicalSpelling
        }
        Carried::MachineRecordedOnly(Why::ThroughLink) => ProjectRelativeLocator::ThroughLink,
    }
}

/// The space a dataset was admitted in, in `dependencies.crs`'s form, which a project's view names.
/// `None` for an open without an admission, which `open_dataset` never produces.
fn space_of(ds: &Dataset) -> Option<Space> {
    let crs = ds.crs();
    let admission = ds.admission()?;
    Some(Space {
        identifier: crs.identifier().to_string(),
        provenance: admission.crs_provenance.as_str().to_string(),
        definition: crs.definition_json().map(|d| sha256_hex(d.as_bytes())),
    })
}

/// The request's workspace as the project file holds it. The wire view has no `crs`: the space is
/// the one the dataset was admitted in. A style document the renderer's `parse` refuses is refused
/// by name; the reader's other rules (the filter against its clauses, the number grammar) are
/// applied when the document is built, by [`Projects::save`].
fn workspace_of(ds: &Dataset, w: ProjectWorkspace) -> Result<Workspace, SkpError> {
    let refused = |path: &str, rule: &str| SkpError::project_file_refused(path, rule);
    let style = style::parse(&w.style.to_string())
        .map_err(|e| refused("$.workspace.style", &e.to_string()))?;
    let crs = space_of(ds).ok_or_else(|| {
        refused(
            "$.workspace.view.crs",
            "the dataset has no admission to name a space from",
        )
    })?;
    let [x, y] = w.view.centre;
    Ok(Workspace {
        filter: w.filter.map(|f| f.predicate),
        clauses: w
            .clauses
            .into_iter()
            .map(|c| Clause {
                text: c.text,
                enabled: c.enabled,
            })
            .collect(),
        style,
        view: View {
            crs,
            centre: [x.0, y.0],
            zoom: w.view.zoom.0,
        },
    })
}

/// Each way a save is refused, as its SKP code (SKP-V0 §11.4). One exhaustive `match` with no
/// wildcard arm: a new `SaveFailure` is a compile error here until it has a code. Where the kernel
/// and the protocol state the same fact, the message is the same text.
fn skp_error_of(e: SaveFailure) -> SkpError {
    let detail = e.to_string();
    match e {
        SaveFailure::FolderRequired => SkpError::project_folder_not_given(),
        SaveFailure::FolderUnusable(_) => SkpError::project_file_unwritable(&detail),
        SaveFailure::FolderHoldsProject(folder) => {
            SkpError::project_folder_holds_project(&folder.display().to_string())
        }
        SaveFailure::Bind(_) => SkpError::project_file_refused("$.datasets[0]", &detail),
        SaveFailure::FileRefused(r) => SkpError::project_file_refused(&r.path, &r.rule),
        SaveFailure::LineageNotKept => SkpError::project_lineage_not_kept_by_this_version(),
        SaveFailure::ProjectFileUnwritable(_) => SkpError::project_file_unwritable(&detail),
        SaveFailure::MachineStore { .. } => SkpError::project_file_unwritable(&detail),
        SaveFailure::MachineRecordRefused(r) => SkpError::project_file_refused(r.file, &r.rule),
    }
}

/// The member of `workspace` that the recorded steps do not reach, if any (OPEN-9 (A)). The filter
/// is compared always: a workspace with a filter that no step applied differs. A style property is
/// compared only if a step set it, as a literal or, for the fill colour, as a match (compared case
/// by case, in order); one no step set carries the document the session started from, which the
/// history does not hold.
fn differs(reached: &Reached, workspace: &Workspace) -> Option<&'static str> {
    let applied = reached.filter.clone().flatten();
    if applied != workspace.filter {
        return Some("filter");
    }
    let style = &workspace.style;
    let colour = |set: &Option<String>, held: &Value<spatial_renderer::style::Rgb>| {
        set.as_ref()
            .is_none_or(|hex| matches!(held, Value::Literal(c) if c.to_hex() == *hex))
    };
    let number = |set: Option<f64>, held: &Value<f64>| {
        set.is_none_or(|v| matches!(held, Value::Literal(x) if *x == v))
    };
    let fill = reached
        .fill_color
        .as_ref()
        .is_none_or(|set| *set == style.fill_color);
    let reaches = fill
        && colour(&reached.outline_color, &style.outline_color)
        && number(reached.fill_opacity, &style.fill_opacity)
        && number(reached.outline_width, &style.outline_width);
    (!reaches).then_some("style")
}

/// The project file in `target`, if there is one, read up to the project file's ceiling plus one
/// byte, so that the reader refuses an oversize file by name.
fn read_existing(target: &Path) -> Result<Option<Vec<u8>>, SaveFailure> {
    let unreadable = |source| {
        SaveFailure::ProjectFileUnwritable(SaveError::Unwritable {
            what: "the existing project file",
            source,
        })
    };
    let file = match std::fs::File::open(target) {
        Ok(file) => file,
        Err(e) if e.kind() == std::io::ErrorKind::NotFound => return Ok(None),
        Err(e) => return Err(unreadable(e)),
    };
    let mut bytes = Vec::new();
    file.take(MAX_PROJECT_FILE_BYTES as u64 + 1)
        .read_to_end(&mut bytes)
        .map_err(unreadable)?;
    Ok(Some(bytes))
}

/// `locations.json` (ADR-036 §9's `spatial-locations` format): where this machine found the
/// dataset the project names.
fn locations_json(uri: &DatasetUri, at: &Path) -> Result<String, MachineRecordRefused> {
    let refused = |rule: String| MachineRecordRefused {
        file: store::LOCATIONS,
        rule,
    };
    let entry = Json::obj([
        ("dataset", Json::str(uri.as_str())),
        ("path", Json::str(at.to_string_lossy())),
    ]);
    let locations = Json::obj([
        ("format", Json::str("spatial-locations")),
        ("version", Json::Int(1)),
        ("entries", Json::Arr(vec![entry])),
    ]);
    to_canonical_string(&locations)
        .map(|text| text + "\n")
        .map_err(|e| refused(e.to_string()))
}

/// A machine store file, written whole or not at all: a temp file in the same folder, synced, then
/// renamed over the name.
fn write_machine_file(dir: &Path, name: &str, bytes: &[u8]) -> std::io::Result<()> {
    use std::io::Write;
    let mut random = [0u8; 8];
    getrandom::fill(&mut random).expect("OS CSPRNG unavailable");
    let hex: String = random.iter().map(|b| format!("{b:02x}")).collect();
    let temp = dir.join(format!("{name}.tmp-{hex}"));
    let mut file = std::fs::OpenOptions::new()
        .write(true)
        .create_new(true)
        .open(&temp)?;
    let written = file.write_all(bytes).and_then(|()| file.sync_all());
    drop(file);
    written
        .and_then(|()| std::fs::rename(&temp, dir.join(name)))
        .inspect_err(|_| drop(std::fs::remove_file(&temp)))
}

#[cfg(test)]
mod tests {
    use super::*;

    fn io() -> std::io::Error {
        std::io::Error::other("the disk said no")
    }

    /// U-P1 (a P3 test the form does not name). Every `SaveFailure` has its own SKP code, the
    /// message is the kernel's own text where the two state one fact, and the named fields are the
    /// variant's own values.
    ///
    /// Mutation: `FolderUnusable` is mapped to `project_folder_holds_project`. Expected failure: this
    /// test fails at the code of the second case.
    #[test]
    fn each_save_failure_maps_to_its_own_code_with_the_kernels_text() {
        let cases: Vec<(SaveFailure, &str)> = vec![
            (SaveFailure::FolderRequired, "skp.project_folder_not_given"),
            (
                SaveFailure::FolderUnusable(io()),
                "skp.project_file_unwritable",
            ),
            (
                SaveFailure::FolderHoldsProject(PathBuf::from("C:/Projects/parcels")),
                "skp.project_folder_holds_project",
            ),
            (
                SaveFailure::Bind(RefBuildError::AssertionWithoutDefinition),
                "skp.project_file_refused",
            ),
            (
                SaveFailure::FileRefused(ProjectFileRefused {
                    path: "$.workspace.filter".to_string(),
                    rule: "a rule".to_string(),
                }),
                "skp.project_file_refused",
            ),
            (
                SaveFailure::LineageNotKept,
                "skp.project_lineage_not_kept_by_this_version",
            ),
            (
                SaveFailure::ProjectFileUnwritable(SaveError::Unwritable {
                    what: "the temp file",
                    source: io(),
                }),
                "skp.project_file_unwritable",
            ),
            (
                SaveFailure::MachineStore {
                    what: "locations.json",
                    source: io(),
                },
                "skp.project_file_unwritable",
            ),
            (
                SaveFailure::MachineRecordRefused(MachineRecordRefused {
                    file: "folders.json",
                    rule: "a rule".to_string(),
                }),
                "skp.project_file_refused",
            ),
        ];
        for (failure, code) in cases {
            let text = failure.to_string();
            let wording = matches!(
                failure,
                SaveFailure::FolderRequired
                    | SaveFailure::FolderHoldsProject(_)
                    | SaveFailure::LineageNotKept
            );
            let got = skp_error_of(failure);
            assert_eq!(got.code, code, "{text}");
            if wording {
                assert_eq!(
                    got.message, text,
                    "the kernel and the protocol say it alike"
                );
            } else {
                assert!(got.message.ends_with(&text), "{text}: {}", got.message);
            }
        }
        let refused = skp_error_of(SaveFailure::MachineRecordRefused(MachineRecordRefused {
            file: "folders.json",
            rule: "a rule".to_string(),
        }));
        assert_eq!(refused.fields["path"], "folders.json");
        assert_eq!(refused.fields["rule"], "a rule");
        let holds = skp_error_of(SaveFailure::FolderHoldsProject(PathBuf::from("C:/p")));
        assert_eq!(holds.fields["folder"], "C:/p");
    }

    /// U-P2 (not named by the form): `FolderRequired`'s text is the one the protocol gives its code.
    ///
    /// Mutation: the old text, `the dataset has not been saved and no folder was given`. Expected
    /// failure: this test fails at its only assertion.
    #[test]
    fn the_folder_required_text_is_what_a_client_is_shown_for_it() {
        assert_eq!(
            SaveFailure::FolderRequired.to_string(),
            "no folder was given, and this open of the dataset has no project to save to"
        );
    }
}
