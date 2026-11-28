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
//!   document, the machine store's documents built, at a first save the identity's open lock
//!   ([`store::ProjectLock`]), the machine store's documents written, the atomic replace of
//!   `project.spatial`, and last the history's two moves (binding the open to the project, which
//!   moves the open's own record under the project if it has one, and the `saved-here` mark in the
//!   project's record).
//! - [`Projects::save_project`]: the same save as an SKP command (SKP-V0 §11): the request's checks,
//!   the workspace built from its wire form, and each [`SaveFailure`] as its one SKP code.
//!
//! Nothing in this module holds a handle in a project folder. [`Projects`] holds one on
//! `open.lock` in the machine store for each identity it saved first or reopened
//! ([`Projects::open_project`]), until that open is closed, or, after its session ends, until this
//! process's next reopen or close ([`Projects::release_ended`]); or until [`Projects`] is dropped.
//! The only files this module writes in a project folder are `project.spatial` and the temporary
//! file that [`store`]'s atomic replace renames over it.

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
use spatial_renderer::canonical::sha256_hex;
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

/// Saves and reopens projects, and remembers which project each open of a dataset was saved to or
/// reopened as in this run.
pub struct Projects {
    /// The machine store's `projects` folder: `<32 hex>/` for each identity.
    root: PathBuf,
    recorder: Arc<StepRecorder>,
    saved: Mutex<Vec<SavedProject>>,
}

struct SavedProject {
    /// The catalog name of the dataset, which `open_dataset` mints once per open.
    dataset: String,
    project: ProjectUri,
    folder: PathBuf,
    /// The dataset entry's `logical_uri`, kept so every save of this open writes the same one.
    uri: DatasetUri,
    /// The identity's open lock, taken by the first save or by the reopen
    /// ([`Projects::open_project`]) that made this entry. It is held for as long as this entry is:
    /// until [`Projects::release_ended`] finds its open closed or its session ended, or until
    /// [`Projects`] is dropped.
    _lock: store::ProjectLock,
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
    /// The history holds no step for this open of the dataset.
    NoStepRecorded,
    /// The workspace differs from what the recorded steps reach, in the member named.
    WorkspaceDiffers(&'static str),
    /// The history could not take the move or the line; the history's own message.
    HistoryUnwritable(String),
}

/// Why a save did not write the project file. Each variant states a fact about what was found.
#[derive(Debug)]
pub enum SaveFailure {
    /// This open of the dataset has no project to save to, and the request gave no folder.
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
    /// At a later save, the project file in the open's folder names another project: `project` is
    /// the open's identity and `found` the one the file names. The file is kept as it is.
    FileNamesAnotherProject {
        project: ProjectUri,
        found: ProjectUri,
    },
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
    /// The catalog no longer holds the open, or its session has ended: the host's own error,
    /// found under the `saved` mutex.
    Open(SkpError),
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
            Self::FileNamesAnotherProject { found, .. } => write!(
                f,
                "the folder's {PROJECT_FILE_NAME} names another project, {}, and was not replaced",
                found.as_str()
            ),
            Self::ProjectFileUnwritable(e) => write!(f, "{e}"),
            Self::MachineStore { what, source } => write!(f, "{what}: {source}"),
            Self::MachineRecordRefused(e) => write!(f, "{e}"),
            Self::Open(e) => write!(f, "{}", e.message),
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

    /// Drop the entry, and with it the identity's open lock, of every open this [`Projects`] saved
    /// first or reopened that the catalog no longer holds or whose session has ended
    /// (`require_live`). The shell's `close_dataset` starts it on another thread after the host
    /// has closed the dataset and does not wait for it, [`Projects::open_project`] calls it
    /// before it takes a lock, and [`Projects::reply_of`]'s guard calls it after its own close of
    /// the dataset, when a panic unwinds out of building the `opened` reply. It takes the `saved`
    /// mutex before the catalog and the generations,
    /// as [`Projects::save`] does, so a save in progress ends before its entry is dropped. After
    /// `close_dataset` has replied, the lock can therefore still be held until a call of this
    /// function that began after the host's close has run: the one `close_dataset` started, or
    /// another close's or a reopen's if that comes first. Each call waits for whatever holds that
    /// mutex: a save, a reopen as it keeps its entry, or another call of this function. A
    /// `record_step` that passed its checks before the open was closed or its session ended can
    /// still write after this frees the lock, and after another process has taken it.
    pub fn release_ended(&self) {
        let mut saved = self.saved.lock().unwrap_or_else(|e| e.into_inner());
        let host = self.recorder.host();
        let (catalog, generations) = (host.catalog(), host.generations());
        let open =
            |name: &str| catalog.get(name).is_some() && require_live(&generations, name).is_ok();
        saved.retain(|s| open(&s.dataset));
    }

    /// Save `workspace` as the project of the dataset `ds`, which the catalog names `name`.
    ///
    /// - **The open is checked first**, under the `saved` mutex that [`Projects::release_ended`]
    ///   also takes: the save is refused with the host's own error ([`SaveFailure::Open`]) when the
    ///   catalog no longer holds the open or its session has ended.
    /// - **A first save** needs `folder`. It mints the identity (ADR-036 §4), refuses a folder that
    ///   already holds `project.spatial`, and writes `folders.json` with the folder as `first`.
    /// - **A later save**, of an open this [`Projects`] saved first or reopened
    ///   ([`Projects::open_project`]), keeps the identity and goes to the folder the first save
    ///   used or the reopen opened from; it ignores `folder`. It refuses to replace a project file
    ///   that names another project, one that records a kept lineage, and one the reader refuses,
    ///   since each could hold what a rewrite would lose.
    /// - **Every save** judges the locators ([`resolver::judge`]), checks the document against the
    ///   reader's rules, and builds `locations.json`, and `folders.json` at a first save, each
    ///   refused where its reader would refuse it. A first save then takes the identity's open
    ///   lock ([`store::ProjectLock`]). The save then writes `locations.json`, and `folders.json`
    ///   at a first save, and replaces `project.spatial` whole or not at all. A first save that
    ///   replaces it keeps the lock in [`Projects`] until [`Projects::release_ended`] releases it;
    ///   one refused after the lock frees it.
    ///   Only then does the history take its moves: the open is bound to the project, which moves
    ///   the open's own record under the project's identity if the open has one, and a `saved-here`
    ///   mark is written in the project's record when the steps reach the workspace. A second open
    ///   of the same file through `open_dataset` is another open: its steps never go to the first
    ///   open's record, and its own first save binds it to a project of its own. A reopen
    ///   ([`Projects::open_project`]) in the run that holds the project's record continues that
    ///   record. A history that cannot take the moves does not undo the save; the result says so.
    pub fn save(
        &self,
        name: &str,
        ds: &Dataset,
        folder: Option<&Path>,
        workspace: Workspace,
    ) -> Result<Saved, SaveFailure> {
        // The lock order: the `saved` mutex first, then the host's catalog and generations, each
        // taken and released inside it. `release_ended` keeps the same order, and nothing takes the
        // `saved` mutex while it holds the catalog or the generations.
        let mut saved = self.saved.lock().unwrap_or_else(|e| e.into_inner());
        let host = self.recorder.host();
        let held = host
            .catalog()
            .get(name)
            .ok_or_else(|| SkpError::unknown_dataset(name));
        let live = held.and_then(|_| require_live(&host.generations(), name));
        live.map_err(SaveFailure::Open)?;
        let known = saved.iter().find(|s| s.dataset == name);
        let known = known.map(|k| (k.project.clone(), k.folder.clone(), k.uri.clone()));
        let first = known.is_none();
        let (project, folder, uri) = match known {
            Some(known) => known,
            None => {
                let folder = folder.ok_or(SaveFailure::FolderRequired)?;
                (
                    mint_identity(),
                    folder.to_path_buf(),
                    self.recorder.dataset_uri(name),
                )
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
                Ok(f) if f.project != project => {
                    let found = f.project;
                    return Err(SaveFailure::FileNamesAnotherProject { project, found });
                }
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
        // Both of the machine store's documents are built, and refused where their readers would
        // refuse them, before its first write: a refusal writes nothing (the form's Amendment 30,
        // item 4 (a)).
        let at = std::path::absolute(ds.path()).unwrap_or_else(|_| ds.path().to_path_buf());
        let locations =
            store::locations_to_bytes(&uri, &at).map_err(SaveFailure::MachineRecordRefused)?;
        let folders = if first {
            let first = std::path::absolute(&folder).unwrap_or_else(|_| folder.clone());
            let folders = KnownFolders {
                first,
                same: Vec::new(),
            };
            let bytes = folders
                .to_bytes()
                .map_err(SaveFailure::MachineRecordRefused)?;
            Some(bytes)
        } else {
            None
        };
        // A first save takes the identity's open lock after both documents are built, so that a
        // refusal above writes nothing, and before the documents are written; taking it makes the
        // identity's machine folder and `open.lock` (the form's Amendment 36, item 6 (a)). A lock
        // that cannot be taken refuses the save, naming `open.lock`.
        let lock_refused = |e| {
            let source = match e {
                store::LockRefused::Held => std::io::Error::other("another handle holds it"),
                store::LockRefused::Io(e) => e,
            };
            SaveFailure::MachineStore {
                what: store::OPEN_LOCK,
                source,
            }
        };
        let lock = if first {
            Some(store::ProjectLock::try_lock(&self.root, &project).map_err(lock_refused)?)
        } else {
            None
        };
        std::fs::create_dir_all(&dir).map_err(machine("the project's machine folder"))?;
        write_machine_file(&dir, store::LOCATIONS, &locations)
            .map_err(machine(store::LOCATIONS))?;
        if let Some(bytes) = folders {
            write_machine_file(&dir, store::FOLDERS, &bytes).map_err(machine(store::FOLDERS))?;
        }
        replace(&folder, text.as_bytes()).map_err(SaveFailure::ProjectFileUnwritable)?;
        if let Some(lock) = lock {
            let dataset = name.to_string();
            saved.push(SavedProject {
                dataset,
                project: project.clone(),
                folder,
                uri,
                _lock: lock,
            });
        }

        let history_mark = self.history(name, &project, &workspace);
        Ok(Saved {
            project,
            history_mark,
            carried: judged.carried,
        })
    }

    /// `save_project` (SKP-V0 §11), the checks in order: the version, the catalog entry of the
    /// handle, the live check, the workspace as the project file would hold it, then
    /// [`Projects::save`], whose refusals are each mapped to their SKP code by [`skp_error_of`].
    /// A refusal writes no project file. The reply carries the identity, whether the history took
    /// the mark, and the resolver's judgment ([`ProjectRelativeLocator`]), and no path.
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

    /// The history's moves after a save: the open the catalog names `name` is bound to the project
    /// (its own record, if it has one, moves under the project), and the mark is written in the
    /// project's record if the steps reach the workspace.
    fn history(&self, name: &str, project: &ProjectUri, workspace: &Workspace) -> HistoryMark {
        let unwritable = |e: spatial_skp::v0::SkpError| {
            HistoryMark::Withheld(Withheld::HistoryUnwritable(e.message))
        };
        if let Err(e) = self.recorder.adopt_project(name, project) {
            return unwritable(e);
        }
        match self
            .recorder
            .mark_saved_here(project, |reached| differs(reached, workspace))
        {
            Ok(SavedHere::Written) => HistoryMark::Written,
            Ok(SavedHere::NoStep) => HistoryMark::Withheld(Withheld::NoStepRecorded),
            Ok(SavedHere::Differs(member)) => {
                HistoryMark::Withheld(Withheld::WorkspaceDiffers(member))
            }
            Err(e) => unwritable(e),
        }
    }
}

// ---------------------------------------------------------------------------------------------
// The reopen (§2.4; the form's Amendment 36, items 5 and 7): `Projects::open_project`, its result
// types, and its private helpers.
// ---------------------------------------------------------------------------------------------

use crate::dataset_ref::{Locator, RefCheck};
use crate::session_history::{
    read_lineage, FolderLineage, LineageRead, LineageRefused, PreviousLineage,
};
use resolver::{check_inside, CheckRefused};
use spatial_engine::EngineError;
use spatial_skp::v0::{
    AdmissionChange, CloseDatasetRequest, DatasetHandle, Filter, FilterClause, FolderLineageFact,
    HexF64, LineageRefusal, ObservedChange, OpenDatasetRequest, OpenProjectRequest,
    OpenProjectResponse, OpenedProject, PreviousLineageFact, ProjectView, ReopenAnswer,
    ReopenCheck, ReopenLineage, ReopenNotFound, ReopenQuestion, ReopenQuestionKind, ReopenView,
    SessionRef, FILTER_DIALECT_DUCKDB_EXPR_0, SKP_VERSION,
};
use store::{locations_to_bytes, read_locations, LockRefused, ProjectLock};

/// A machine store document's read bound (the form's Amendment 36, item 5 (a)).
const MAX_MACHINE_DOCUMENT_BYTES: u64 = 2_097_152;
/// The folder's lineage file, `.spatial/lineage.jsonl` (ADR-036 §1), by its two segments.
const LINEAGE_FILE: [&str; 2] = [".spatial", "lineage.jsonl"];
/// The previous lineage file, kept in the identity's machine folder (ADR-036 Amendment 1, item 2).
const PREVIOUS_LINEAGE_FILE: &str = "previous-lineage.jsonl";

/// The answer to the question a reopen asked: given with the next call for the same folder.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Answer {
    /// The folder is a copy: it gets a new identity, written into its `project.spatial`, and
    /// machine store files of its own.
    Copy,
    /// The folder holds the same project: it is remembered in the identity's `folders.json`.
    Same,
}

/// What a reopen replies when it is not refused.
#[derive(Debug)]
pub enum Reopen {
    Opened(Box<Opened>),
    /// The folder is not known for the identity, and the first folder still holds a project file of
    /// this identity, or one the reader refuses, or cannot be read, it or its project file: nothing
    /// was written, and the caller asks and calls again with an answer.
    Question,
    /// No file was found for the dataset through the machine store, and the caller may re-link it.
    /// `file_name` is the last name of the recorded path that is missing; `None` when no location
    /// is recorded for the dataset.
    NotFound {
        file_name: Option<String>,
    },
}

/// A reopened project.
#[derive(Debug)]
pub struct Opened {
    /// The identity it is open under: a new one after the answer `copy`.
    pub project: ProjectUri,
    pub dataset: DatasetHandle,
    pub session: SessionRef,
    /// The workspace as the project file holds it, its view included; [`Opened::view`] says
    /// whether the view applies.
    pub workspace: Workspace,
    pub view: ViewState,
    /// The project file's reference against the reopened dataset ([`DatasetRef::check`]).
    pub check: RefCheck,
    pub lineage: LineageRead,
}

/// Whether the saved view applies to the reopened dataset (V3).
#[derive(Clone, Debug, PartialEq, Eq)]
pub enum ViewState {
    /// The saved view's space equals the space the dataset was admitted in, in all three members.
    Applies,
    /// It does not: `basis` names both spaces.
    SavedInAnotherSpace { basis: String },
}

/// Why a reopen was refused. Each variant states a fact about what was found. After any of them
/// the reopen holds no lock, and the catalog holds no dataset the reopen opened.
#[derive(Debug)]
pub enum OpenFailure {
    /// The host refused the cancel key, or the engine refused the open: the host's error.
    Open(SkpError),
    /// The reopen saw its cancel key cancelled, at one of its checks between steps or when the
    /// host's open returned an error. A `Question`, a `NotFound` or another refusal already decided
    /// can still follow a cancel. A cancel after the host's open returned a dataset is not seen:
    /// the reopen goes on as it would with none.
    Cancelled,
    /// The folder's `project.spatial` could not be read.
    ProjectFileUnreadable(std::io::Error),
    /// `project.spatial` breaks a rule the reader holds, or the copy's file would.
    FileRefused(ProjectFileRefused),
    /// `folders.json` or `locations.json` was refused by its reader, or a document by its writer;
    /// the file named is not rewritten.
    MachineRecordRefused(MachineRecordRefused),
    /// The answer `same` would take the identity past [`store::MAX_KNOWN_FOLDERS`] folders; `count`
    /// is how many it remembers.
    KnownFoldersFull { project: ProjectUri, count: usize },
    /// The identity's open lock is held, in this process or in another.
    OpenElsewhere(ProjectUri),
    /// A machine store file could not be read, written or locked.
    MachineStore {
        what: &'static str,
        source: std::io::Error,
    },
    /// The project folder could not be resolved at the data step.
    FolderUnresolvable(PathBuf),
    /// The `project-relative` locator's target was refused by [`resolver::check_inside`];
    /// `locator` is the locator's JSON path in the project file.
    TargetRefused {
        locator: String,
        refused: CheckRefused,
    },
    /// The copy's `project.spatial` could not be written.
    ProjectFileUnwritable(SaveError),
    /// The checked path is not valid Unicode, so it cannot be given to the engine.
    PathNotUnicode(PathBuf),
}

impl fmt::Display for OpenFailure {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::Open(e) => write!(f, "{}", e.message),
            Self::Cancelled => write!(f, "the reopen was cancelled"),
            Self::ProjectFileUnreadable(e) => write!(f, "{PROJECT_FILE_NAME} cannot be read: {e}"),
            Self::FileRefused(e) => write!(f, "the project file's reader refuses it: {e}"),
            Self::MachineRecordRefused(e) => write!(f, "{e}"),
            Self::KnownFoldersFull { project, count } => write!(
                f,
                "{} remembers {count} folders, and no more can be added",
                project.as_str()
            ),
            Self::OpenElsewhere(p) => write!(f, "{} is already open", p.as_str()),
            Self::MachineStore { what, source } => write!(
                f,
                "this machine's store for the project could not be used: {what}: {source}"
            ),
            Self::FolderUnresolvable(p) => write!(f, "{} cannot be resolved", p.display()),
            Self::TargetRefused { locator, refused } => {
                let (segment, fact) = match refused {
                    CheckRefused::NotCanonical(_) => return write!(f, "{locator}: not canonical"),
                    CheckRefused::FolderUnresolvable => {
                        return write!(f, "{locator}: the folder cannot be resolved")
                    }
                    CheckRefused::ThroughLink { segment } => (segment, "is a link"),
                    CheckRefused::Unresolvable { segment } => (segment, "cannot be resolved"),
                    CheckRefused::NotADirectory { segment } => (segment, "is not a folder"),
                    CheckRefused::NotARegularFile { segment } => (segment, "is not a regular file"),
                };
                write!(f, "{locator}: {segment} {fact}")
            }
            Self::ProjectFileUnwritable(e) => write!(f, "{e}"),
            Self::PathNotUnicode(_) => write!(f, "the data's path is not valid Unicode"),
        }
    }
}

impl std::error::Error for OpenFailure {}

/// Where step 2 leaves the identity and `folders.json`.
enum Place {
    /// The folder is known: nothing is written.
    Known,
    /// `folders.json` is replaced by this list: after a move, the answer `same`, or none there.
    Remember(KnownFolders),
    /// The answer `copy`: this new identity.
    Copy(ProjectUri),
}

/// What the data step found.
enum Data {
    At(PathBuf),
    NotFound(Option<String>),
}

impl Projects {
    /// `open_project` (§2.4): reopen the project saved in `folder`, under `cancel_key`. In order:
    ///
    /// 1. `cancel_key` is registered with the host's opens, so that `cancel` reaches this call
    ///    from here until it returns; the token is checked after step 1's read, in step 2 once the
    ///    folder's place is decided and the call goes on, after step 4, and in step 5 once the path
    ///    is found, before the host's open; and again if that open returns an error. A `Question`
    ///    or a `NotFound` is returned with no check after the read that decided it.
    ///    `project.spatial` is read up to its ceiling and one byte, and parsed by the strict
    ///    reader.
    /// 2. The identity and the folder, with nothing written. The folder is known when its
    ///    canonical form equals that of an entry of `folders.json`; an entry that does not resolve
    ///    is compared as written with the folder's absolute form. Otherwise the first folder is
    ///    looked at: gone, not a folder, holding no `project.spatial` or holding another project's
    ///    is a move; holding this identity, or a file or folder that cannot be read or a file the
    ///    reader refuses, asks. With no `answer` the question is the reply. With no `folders.json`
    ///    the folder is remembered as `first`. `answer` is read only when the question is asked.
    ///    Then a `relink` is checked by `locations.json`'s writer and refused by name when the
    ///    writer would refuse it; its bytes are kept for step 6. After the answer `copy` with no
    ///    `relink`, step 5's lookup of the data runs here, before the lock, so that a `not_found`
    ///    reply writes nothing. `folders.json` is read here, before the lock: another process can
    ///    replace it between this read and step 3's write.
    /// 3. [`Projects::release_ended`], then the identity's open lock, the new identity's after the
    ///    answer `copy`; then this step's writes: `folders.json`, and for a copy its
    ///    `project.spatial` with the new identity. A copy whose `project.spatial` cannot be
    ///    replaced is refused, and leaves the new identity's machine folder with its `folders.json`
    ///    and `open.lock`.
    /// 4. The lineage (step 6 of §2.4, run here): [`read_lineage`] of the folder's
    ///    `.spatial/lineage.jsonl` and of `previous-lineage.jsonl` in the machine folder of the
    ///    identity `project.spatial` named when step 1 read it, which after the answer `copy` is
    ///    the original identity, not the new one.
    /// 5. The data. A `relink`, checked at step 2, is used first, then the path step 2 found for
    ///    a copy. Otherwise a `project-relative`
    ///    locator goes through
    ///    [`resolver::check_inside`], and the engine is given the path it returns. Otherwise the
    ///    machine store's location for the dataset is used; none recorded, or a recorded path
    ///    that is missing, replies `not_found`. The open is the host's, under the token of step 1
    ///    and with the claims the project file recorded.
    /// 6. The check and the view's state; after a `relink` or a copy, `locations.json` with the
    ///    path opened (a write refused or failed closes the dataset); the open given the project
    ///    file's dataset identity in the history ([`StepRecorder`]); and the open entered with its
    ///    lock in this [`Projects`], so that its next save keeps both identities and its folder.
    ///
    /// Every refusal after step 3 frees the lock before it is returned. The resolver's check is
    /// claimed, not what the engine reads after it (§2.5's window).
    pub fn open_project(
        &self,
        folder: &Path,
        cancel_key: &str,
        answer: Option<Answer>,
        relink: Option<&Path>,
        set_aside_file_id: bool,
    ) -> Result<Reopen, OpenFailure> {
        let host = self.recorder.host();
        let (_end_open_on_drop, cancel) = host.begin_open(cancel_key).map_err(OpenFailure::Open)?;
        let live = || {
            if cancel.is_cancelled() {
                Err(OpenFailure::Cancelled)
            } else {
                Ok(())
            }
        };
        let bytes = read_bounded(
            &folder.join(PROJECT_FILE_NAME),
            MAX_PROJECT_FILE_BYTES as u64,
        );
        let bytes = bytes.map_err(OpenFailure::ProjectFileUnreadable)?;
        live()?;
        let mut file = read_project(&bytes).map_err(OpenFailure::FileRefused)?;
        let project = file.project.clone();
        let here = std::path::absolute(folder).unwrap_or_else(|_| folder.to_path_buf());

        let dir = record_dir(&self.root, &project);
        let known = match machine_document(&dir, store::FOLDERS)? {
            Some(bytes) => {
                Some(KnownFolders::from_bytes(&bytes).map_err(OpenFailure::MachineRecordRefused)?)
            }
            None => None,
        };
        let first = |here: &Path| KnownFolders {
            first: here.to_path_buf(),
            same: Vec::new(),
        };
        let place = match known {
            None => Place::Remember(first(&here)),
            Some(known) if is_known(&known, &here) => Place::Known,
            Some(known) if !asks(&known.first, &project) => Place::Remember(known.moved_to(&here)),
            Some(known) => match answer {
                None => return Ok(Reopen::Question),
                Some(Answer::Same) => Place::Remember(known.with_same(&here).map_err(|e| {
                    let project = project.clone();
                    OpenFailure::KnownFoldersFull {
                        project,
                        count: e.count,
                    }
                })?),
                Some(Answer::Copy) => Place::Copy(mint_identity()),
            },
        };
        live()?;
        let refused = OpenFailure::MachineRecordRefused;
        let (identity, folders, copy) = match place {
            Place::Known => (project.clone(), None, None),
            Place::Remember(k) => (project.clone(), Some(k.to_bytes().map_err(refused)?), None),
            Place::Copy(new) => {
                let folders = first(&here).to_bytes().map_err(refused)?;
                file.project = new.clone();
                let text = write_project(&file).map_err(OpenFailure::FileRefused)?;
                (new, Some(folders), Some(text))
            }
        };
        let uri = file.dataset.uri().clone();
        let relinked = match relink {
            Some(at) => Some(locations_to_bytes(&uri, at).map_err(refused)?),
            None => None,
        };
        // O5 (packet P-6 (ii)): a copy's data is looked up before its lock and its writes.
        let found = match (&copy, relink) {
            (Some(_), None) => match data_at(folder, &file.dataset, &dir)? {
                Data::NotFound(file_name) => return Ok(Reopen::NotFound { file_name }),
                found => Some(found),
            },
            _ => None,
        };

        self.release_ended();
        let lock = ProjectLock::try_lock(&self.root, &identity).map_err(|e| match e {
            LockRefused::Held => OpenFailure::OpenElsewhere(identity.clone()),
            LockRefused::Io(source) => OpenFailure::MachineStore {
                what: store::OPEN_LOCK,
                source,
            },
        })?;
        let identity_dir = record_dir(&self.root, &identity);
        let machine = |what| move |source| OpenFailure::MachineStore { what, source };
        if let Some(bytes) = folders {
            write_machine_file(&identity_dir, store::FOLDERS, &bytes)
                .map_err(machine(store::FOLDERS))?;
        }
        if let Some(text) = &copy {
            replace(folder, text.as_bytes()).map_err(OpenFailure::ProjectFileUnwritable)?;
        }

        let [lineage_dir, lineage_name] = LINEAGE_FILE;
        let folder_file = folder.join(lineage_dir).join(lineage_name);
        let lineage = read_lineage(
            &folder_file,
            &dir.join(PREVIOUS_LINEAGE_FILE),
            &file.lineage,
        );
        live()?;

        let path = match relink {
            Some(at) => at.to_path_buf(),
            None => match found.map_or_else(|| data_at(folder, &file.dataset, &dir), Ok)? {
                Data::At(path) => path,
                Data::NotFound(file_name) => return Ok(Reopen::NotFound { file_name }),
            },
        };
        live()?;
        let text = path
            .to_str()
            .ok_or_else(|| OpenFailure::PathNotUnicode(path.clone()));
        let admission = file.dataset.admission().clone();
        let req = OpenDatasetRequest {
            skp: SKP_VERSION.to_string(),
            path: text?.to_string(),
            cancel_key: cancel_key.to_string(),
            crs_assertion: admission.crs_assertion,
            identity: admission.identity,
            // The caller's choice at this reopen (ADR-016 Amendment 3), never the project file's:
            // the file records nothing of it.
            set_aside_file_id,
        };
        let opened = host.open_under(req, &cancel).map_err(|e| {
            if cancel.is_cancelled() {
                OpenFailure::Cancelled
            } else {
                OpenFailure::Open(e)
            }
        })?;
        let handle = opened.dataset;
        let close = || {
            let (skp, dataset) = (SKP_VERSION.to_string(), handle.clone());
            drop(host.close_dataset(CloseDatasetRequest { skp, dataset }));
        };
        // ADV-2026-11-19-26 item 3, row 5: this `skp.unknown_dataset`'s message offers "or never
        // opened this session", which cannot be the case here: it needs a close, inside this call,
        // of the handle `open_under` just returned, which the client has not received. Named, and
        // not changed.
        let Some(ds) = host.catalog().get(handle.as_str()) else {
            return Err(OpenFailure::Open(SkpError::unknown_dataset(
                handle.as_str(),
            )));
        };
        let check = file.dataset.check(&ds);
        let view = view_state(&file.workspace.view.crs, &ds);
        let locations = match (relinked, &copy) {
            (Some(bytes), _) => Some(Ok(bytes)),
            (None, Some(_)) => {
                let at = std::path::absolute(ds.path()).unwrap_or_else(|_| ds.path().to_path_buf());
                Some(locations_to_bytes(&uri, &at).map_err(refused))
            }
            (None, None) => None,
        };
        drop(ds);
        if let Some(bytes) = locations {
            let written = bytes.and_then(|bytes| {
                write_machine_file(&identity_dir, store::LOCATIONS, &bytes)
                    .map_err(machine(store::LOCATIONS))
            });
            if let Err(e) = written {
                close();
                return Err(e);
            }
        }
        self.recorder
            .reopened(handle.as_str(), uri.clone(), &identity);
        let mut saved = self.saved.lock().unwrap_or_else(|e| e.into_inner());
        saved.push(SavedProject {
            dataset: handle.as_str().to_string(),
            project: identity.clone(),
            folder: folder.to_path_buf(),
            uri,
            _lock: lock,
        });
        Ok(Reopen::Opened(Box::new(Opened {
            project: identity,
            dataset: handle,
            session: opened.session,
            workspace: file.workspace,
            view,
            check,
            lineage,
        })))
    }

    /// `open_project` (SKP-V0 §12), built as [`Projects::save_project`] is: the version, then
    /// [`Projects::open_project`], each [`OpenFailure`] mapped to its SKP code by
    /// [`open_error_of`], and the reply built from what the reopen returned. No reply carries a
    /// path; `not_found`'s `file_name` passes through [`bounded`]. It can wait on the `saved` mutex
    /// ([`Projects::release_ended`] and the entry it keeps), so a host calls it off its main thread.
    /// A panic while the `opened` reply is built closes the reopened dataset and frees its lock
    /// before the panic leaves the call ([`Projects::reply_of`]).
    pub fn open_project_command(
        &self,
        req: OpenProjectRequest,
    ) -> Result<OpenProjectResponse, SkpError> {
        check_version(&req.skp)?;
        let answer = req.answer.map(|a| match a {
            ReopenAnswer::Copy => Answer::Copy,
            ReopenAnswer::Same => Answer::Same,
        });
        let relink = req.relink.as_deref().map(Path::new);
        let folder = Path::new(&req.folder);
        let reopened = self.open_project(
            folder,
            &req.cancel_key,
            answer,
            relink,
            req.set_aside_file_id,
        );
        Ok(match reopened.map_err(|e| open_error_of(e, &req.folder))? {
            Reopen::Question => OpenProjectResponse::Question(ReopenQuestion {
                kind: ReopenQuestionKind::CopyOrSame,
            }),
            Reopen::NotFound { file_name } => OpenProjectResponse::NotFound(ReopenNotFound {
                file_name: file_name.map(|n| bounded(&n)),
            }),
            Reopen::Opened(o) => OpenProjectResponse::Opened(Box::new(self.reply_of(*o))),
        })
    }

    /// The `opened` reply of a reopen, built by [`opened_of`]. Its one product caller is
    /// [`Projects::open_project_command`]'s `Reopen::Opened` arm; K-D1 and K-D2 in this module's
    /// tests call it directly. If [`opened_of`] panics, its guard runs during the unwind, holding
    /// no lock: it closes the dataset through the host, as [`Projects::open_project`] closes it
    /// after a refused write, and then calls [`Projects::release_ended`], which drops the entry and
    /// with it the identity's open lock.
    // Fails a non-test build of the lib if the opened arm, its only caller outside tests, drops it.
    #[deny(dead_code)]
    fn reply_of(&self, o: Opened) -> OpenedProject {
        let dataset = o.dataset.clone();
        let _guard = ReplyGuard {
            projects: self,
            dataset,
        };
        opened_of(o)
    }
}

/// [`Projects::reply_of`]'s guard: only on an unwind, it closes `dataset` and frees its lock.
struct ReplyGuard<'a> {
    projects: &'a Projects,
    dataset: DatasetHandle,
}

impl Drop for ReplyGuard<'_> {
    fn drop(&mut self) {
        if std::thread::panicking() {
            let (skp, dataset) = (SKP_VERSION.to_string(), self.dataset.clone());
            let host = self.projects.recorder.host();
            drop(host.close_dataset(CloseDatasetRequest { skp, dataset }));
            self.projects.release_ended();
        }
    }
}

/// Each way a reopen is refused, as its SKP code (SKP-V0 §12). One exhaustive `match` with no
/// wildcard arm: a new [`OpenFailure`] or [`CheckRefused`] is a compile error here until it has a
/// code. An engine refusal through `Open` keeps the engine's message; any other refusal names no
/// path but the request's `folder` as sent. A reader's `path` and `rule` and a locator's `segment`
/// pass through [`bounded`].
fn open_error_of(e: OpenFailure, folder: &str) -> SkpError {
    match e {
        OpenFailure::Open(e) => e,
        OpenFailure::Cancelled => crate::skp::error_of(&EngineError::Cancelled),
        OpenFailure::ProjectFileUnreadable(e) => SkpError::project_file_unreadable(&e.to_string()),
        OpenFailure::FileRefused(r) => {
            SkpError::project_file_refused(&bounded(&r.path), &bounded(&r.rule))
        }
        OpenFailure::MachineRecordRefused(r) => {
            SkpError::project_machine_record_refused(r.file, &bounded(&r.rule))
        }
        OpenFailure::KnownFoldersFull { project, count } => {
            SkpError::project_known_folders_full(project.as_str(), count)
        }
        OpenFailure::OpenElsewhere(p) => SkpError::project_open_elsewhere(p.as_str()),
        OpenFailure::MachineStore { what, source } => {
            SkpError::project_machine_store_failed(&format!("{what}: {source}"))
        }
        OpenFailure::FolderUnresolvable(_) => SkpError::project_target_folder_unresolvable(folder),
        OpenFailure::TargetRefused { locator, refused } => match refused {
            CheckRefused::NotCanonical(_) => SkpError::project_target_not_canonical(&locator),
            CheckRefused::FolderUnresolvable => {
                SkpError::project_target_locator_folder_unresolvable(&locator)
            }
            CheckRefused::ThroughLink { segment } => {
                SkpError::project_target_through_link(&locator, &bounded(&segment))
            }
            CheckRefused::Unresolvable { segment } => {
                SkpError::project_target_segment_unresolvable(&locator, &bounded(&segment))
            }
            CheckRefused::NotADirectory { segment } => {
                SkpError::project_target_not_a_folder(&locator, &bounded(&segment))
            }
            CheckRefused::NotARegularFile { segment } => {
                SkpError::project_target_not_a_regular_file(&locator, &bounded(&segment))
            }
        },
        OpenFailure::ProjectFileUnwritable(e) => SkpError::project_file_unwritable(&e.to_string()),
        OpenFailure::PathNotUnicode(_) => SkpError::project_target_path_not_unicode(),
    }
}

/// The `opened` reply: the workspace in its wire form, whole, as the reader accepted it; the
/// view's state; the check's names; and the two lineage facts, with no text of a lineage file's
/// lines, no rule text and no error text: a refusal carries a line number where it has one. It
/// panics if the style does not write again as canonical JSON, if that JSON does not read back, or
/// if the check names a word the wire has none for. No file the reader accepts reaches any of
/// these, and [`Projects::reply_of`] closes the dataset and frees the lock if one fires.
fn opened_of(o: Opened) -> OpenedProject {
    let w = o.workspace;
    // The reader accepted the style only in ADR-017 §5a's canonical form, so it is written again
    // and read as JSON without a refusal.
    let style = spatial_renderer::canonical::to_canonical_string(&w.style.to_canonical_json());
    let style = style.expect("a style the reader accepted is canonical");
    let filter = w.filter.map(|predicate| Filter {
        predicate,
        dialect: FILTER_DIALECT_DUCKDB_EXPR_0.to_string(),
    });
    let clauses = w.clauses.into_iter();
    let clauses = clauses.map(|c| FilterClause {
        text: c.text,
        enabled: c.enabled,
    });
    let [x, y] = w.view.centre;
    let workspace = ProjectWorkspace {
        filter,
        clauses: clauses.collect(),
        style: serde_json::from_str(&style).expect("canonical JSON is JSON"),
        view: ProjectView {
            centre: [HexF64(x), HexF64(y)],
            zoom: HexF64(w.view.zoom),
        },
    };
    let view = match o.view {
        ViewState::Applies => ReopenView::Applies {},
        ViewState::SavedInAnotherSpace { basis } => ReopenView::SavedInAnotherSpace { basis },
    };
    let (observed, admission) = match o.check {
        RefCheck::NoChangeDetected => (Vec::new(), Vec::new()),
        RefCheck::Differs {
            observed,
            admission,
        } => (observed, admission),
    };
    // The words are `differing_components`'s and `DatasetRef::check`'s own closed sets.
    let observed = observed.into_iter().map(|w| match w {
        "size" => ObservedChange::Size,
        "mtime" => ObservedChange::Mtime,
        "footer-length" => ObservedChange::FooterLength,
        "footer-hash" => ObservedChange::FooterHash,
        other => unreachable!("an observation component the wire has no word for: {other}"),
    });
    let admission = admission.into_iter().map(|w| match w {
        "crs" => AdmissionChange::Crs,
        "identity" => AdmissionChange::Identity,
        other => unreachable!("an admission claim the wire has no word for: {other}"),
    });
    let check = ReopenCheck {
        observed: observed.collect(),
        admission: admission.collect(),
    };
    let folder_file = match o.lineage.folder_file {
        FolderLineage::Absent => FolderLineageFact::Absent,
        FolderLineage::NotRead => FolderLineageFact::NotRead,
        FolderLineage::Recorded => FolderLineageFact::Recorded,
        FolderLineage::RecordedWithLinesAfter => FolderLineageFact::RecordedWithLinesAfter,
        FolderLineage::NotTheRecordedOne => FolderLineageFact::NotTheRecordedOne,
        FolderLineage::Refused(r) => FolderLineageFact::Refused(lineage_refusal_of(r)),
    };
    let previous_file = o.lineage.previous_file.map(|p| match p {
        PreviousLineage::Absent => PreviousLineageFact::Absent,
        PreviousLineage::Used => PreviousLineageFact::Used,
        PreviousLineage::NotTheRecordedOne => PreviousLineageFact::NotTheRecordedOne,
        PreviousLineage::Refused(r) => PreviousLineageFact::Refused(lineage_refusal_of(r)),
    });
    OpenedProject {
        project: o.project.as_str().to_string(),
        dataset: o.dataset,
        session: o.session,
        workspace,
        view,
        check,
        lineage: ReopenLineage {
            folder_file,
            previous_file,
        },
    }
}

/// A lineage file's refusal on the wire: its line numbers, and no rule or reason text.
fn lineage_refusal_of(r: LineageRefused) -> LineageRefusal {
    match r {
        LineageRefused::OverBound { line, limit } => LineageRefusal::OverBound {
            line: line.map(|n| n as u64),
            limit,
        },
        LineageRefused::Damaged { line, .. } => LineageRefusal::Damaged { line: line as u64 },
        LineageRefused::Unreadable { .. } => LineageRefusal::Unreadable {},
        LineageRefused::ThroughLink => LineageRefusal::ThroughLink {},
    }
}

/// Whether `here`, an absolute folder, is one `known` holds (the form's Amendment 36, item 5 (d)):
/// canonical forms are compared, and an entry, or `here`, that does not resolve is compared as
/// written.
fn is_known(known: &KnownFolders, here: &Path) -> bool {
    let this = std::fs::canonicalize(here).ok();
    let mut entries = std::iter::once(&known.first).chain(&known.same);
    entries.any(|entry| match (std::fs::canonicalize(entry).ok(), &this) {
        (Some(entry), Some(this)) => entry == *this,
        _ => entry == here,
    })
}

/// Whether the first folder `first` asks the question for `project` (§2.4 step 2): it holds a
/// `project.spatial` of this identity, or one the reader refuses, or it or that file cannot be
/// read. Gone, not a folder, no `project.spatial` there, or another project's: a move.
fn asks(first: &Path, project: &ProjectUri) -> bool {
    let gone = |e: &std::io::Error| e.kind() == std::io::ErrorKind::NotFound;
    match std::fs::metadata(first) {
        Ok(m) if m.is_dir() => {}
        Ok(_) => return false,
        Err(e) => return !gone(&e),
    }
    let bytes = read_bounded(
        &first.join(PROJECT_FILE_NAME),
        MAX_PROJECT_FILE_BYTES as u64,
    );
    match bytes.map(|b| read_project(&b)) {
        Ok(Ok(there)) => there.project == *project,
        Ok(Err(_)) => true,
        Err(e) => !gone(&e),
    }
}

/// The data step's path, when no re-link is given: a `project-relative` locator's target as
/// [`resolver::check_inside`] returns it, else the machine store's location for the dataset.
fn data_at(folder: &Path, reference: &DatasetRef, dir: &Path) -> Result<Data, OpenFailure> {
    let mut relative = reference.locators().iter().enumerate();
    let relative = relative.find_map(|(i, l)| match l {
        Locator::ProjectRelative(at) => Some((i, at)),
        Locator::MachineRecorded => None,
    });
    if let Some((i, at)) = relative {
        return check_inside(folder, at)
            .map(Data::At)
            .map_err(|refused| match refused {
                CheckRefused::FolderUnresolvable => OpenFailure::FolderUnresolvable(folder.into()),
                refused => OpenFailure::TargetRefused {
                    locator: format!("$.datasets[0].resource.locators[{i}].at"),
                    refused,
                },
            });
    }
    let Some(bytes) = machine_document(dir, store::LOCATIONS)? else {
        return Ok(Data::NotFound(None));
    };
    let entries = read_locations(&bytes).map_err(OpenFailure::MachineRecordRefused)?;
    let Some(at) = entries.into_iter().find(|l| l.dataset == *reference.uri()) else {
        return Ok(Data::NotFound(None));
    };
    match std::fs::metadata(&at.path) {
        Err(e) if e.kind() == std::io::ErrorKind::NotFound => {
            let name = at
                .path
                .file_name()
                .map(|n| n.to_string_lossy().into_owned());
            Ok(Data::NotFound(name))
        }
        _ => Ok(Data::At(at.path)),
    }
}

/// Whether the saved view's space `saved` is the space `ds` was admitted in (V3). Each space's
/// identifier in `basis` passes through [`bounded`]; its provenance is a closed word and its
/// definition a hash, as the reader holds the saved space's and [`space_of`] builds the other's.
fn view_state(saved: &Space, ds: &Dataset) -> ViewState {
    let named = |s: &Space| {
        let definition = s.definition.as_deref().unwrap_or("no definition");
        format!(
            "{} ({}, {definition})",
            bounded(&s.identifier),
            s.provenance
        )
    };
    match space_of(ds) {
        Some(now) if now == *saved => ViewState::Applies,
        now => {
            let now = now.map_or("no space".to_string(), |s| named(&s));
            let basis = format!(
                "the view was saved in {}, and the data is admitted in {now}",
                named(saved)
            );
            ViewState::SavedInAnotherSpace { basis }
        }
    }
}

/// A machine store document in `dir`, read up to its bound and one byte; `None` when it is absent.
fn machine_document(dir: &Path, name: &'static str) -> Result<Option<Vec<u8>>, OpenFailure> {
    match read_bounded(&dir.join(name), MAX_MACHINE_DOCUMENT_BYTES) {
        Ok(bytes) => Ok(Some(bytes)),
        Err(e) if e.kind() == std::io::ErrorKind::NotFound => Ok(None),
        Err(source) => Err(OpenFailure::MachineStore { what: name, source }),
    }
}

/// Up to `max` bytes and one more of the file at `path`, so that a reader refuses a longer file by
/// its size without the rest being read.
fn read_bounded(path: &Path, max: u64) -> std::io::Result<Vec<u8>> {
    let mut bytes = Vec::new();
    std::fs::File::open(path)?
        .take(max + 1)
        .read_to_end(&mut bytes)?;
    Ok(bytes)
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
/// and the protocol state the same fact, the message is the same text. A reader's `path` and
/// `rule` pass through [`bounded`].
fn skp_error_of(e: SaveFailure) -> SkpError {
    let detail = e.to_string();
    match e {
        SaveFailure::FolderRequired => SkpError::project_folder_not_given(),
        SaveFailure::FolderUnusable(_) => SkpError::project_file_unwritable(&detail),
        SaveFailure::FolderHoldsProject(folder) => {
            SkpError::project_folder_holds_project(&folder.display().to_string())
        }
        SaveFailure::Bind(_) => SkpError::project_file_refused("$.datasets[0]", &bounded(&detail)),
        SaveFailure::FileRefused(r) => {
            SkpError::project_file_refused(&bounded(&r.path), &bounded(&r.rule))
        }
        SaveFailure::LineageNotKept => SkpError::project_lineage_not_kept_by_this_version(),
        SaveFailure::FileNamesAnotherProject { project, found } => {
            SkpError::project_file_names_another_project(project.as_str(), found.as_str())
        }
        SaveFailure::ProjectFileUnwritable(_) => SkpError::project_file_unwritable(&detail),
        SaveFailure::MachineStore { .. } => SkpError::project_file_unwritable(&detail),
        SaveFailure::MachineRecordRefused(r) => {
            SkpError::project_machine_record_refused(r.file, &bounded(&r.rule))
        }
        SaveFailure::Open(e) => e,
    }
}

/// A text taken from a file the kernel did not write, as it may reach the wire: every control
/// character replaced by U+FFFD, then, past 256 bytes, cut at the last character boundary within
/// them and marked with ` [cut]`, so that it is at most 262 bytes.
fn bounded(text: &str) -> String {
    const MAX: usize = 256;
    let mut out: String = text
        .chars()
        .map(|c| if c.is_control() { '\u{fffd}' } else { c })
        .collect();
    if out.len() > MAX {
        let cut = (0..=MAX).rev().find(|&i| out.is_char_boundary(i));
        out.truncate(cut.unwrap_or(0));
        out.push_str(" [cut]");
    }
    out
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

/// A machine store file, written whole or not at all: a temp file in the same folder, synced, then
/// renamed over the name. A process that ends between the temp file's creation and the rename
/// leaves `<name>.tmp-<16 hex>` in `dir`, the identity's machine folder, and nothing removes it.
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
                "skp.project_machine_record_refused",
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
        assert_eq!(refused.fields["file"], "folders.json");
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

    /// K-D1's and K-D2's watch arm: none is armed, as `crate::skp`'s own `NoWatchArm`, which is
    /// private to that module, has it.
    struct ChecksOnly;

    impl spatial_engine::SourceWatchArm for ChecksOnly {
        fn arm(&self, _: &Path, _: spatial_engine::WatchSink) -> spatial_engine::ArmOutcome {
            spatial_engine::ArmOutcome::ChecksOnly {
                reason: "test fixture: no watch armed".to_string(),
            }
        }
    }

    /// A real host, recorder and [`Projects`], with F1 saved into `folder` and closed, and the
    /// save's lock released, as `kernel/tests/project_reopen_skp.rs`'s `Rig::saved` has it.
    struct Rig {
        folder: PathBuf,
        machine: PathBuf,
        host: Arc<crate::skp::SkpHost>,
        projects: Projects,
    }

    /// The rig, under a temp folder named for `test` alone and removed first. F1 (500 polygons,
    /// declared LV95, a `zone` column) is written per run and not hash-verified.
    fn rig(test: &str) -> Rig {
        let dir = std::env::temp_dir()
            .join("spatial-ide-project-mod-tests")
            .join(test);
        let _ = std::fs::remove_dir_all(&dir);
        let (folder, machine) = (dir.join("project"), dir.join("machine"));
        std::fs::create_dir_all(&folder).expect("the project folder");
        let host = Arc::new(crate::skp::SkpHost::new(
            Arc::new(crate::Catalog::new()),
            crate::skp::StreamRegistry::new(),
            Arc::new(ChecksOnly),
            crate::skp::session_end_channel().0,
        ));
        let recorder = Arc::new(StepRecorder::new(dir.join("sessions"), host.clone()));
        let projects = Projects::new(machine.clone(), recorder);

        let data = dir.join("outside").join("parcels.parquet");
        std::fs::create_dir_all(dir.join("outside")).expect("the data folder");
        let spec = spatial_engine::fixture::FixtureSpec {
            features: 500,
            avg_vertices: 12,
            seed: 1,
            attributes: spatial_engine::fixture::AttributeMode::CategoricalZone,
            ..Default::default()
        };
        spatial_engine::fixture::write_geoparquet(&data, &spec).expect("F1");
        let open = OpenDatasetRequest {
            skp: SKP_VERSION.to_string(),
            path: data.display().to_string(),
            cancel_key: "k".to_string(),
            crs_assertion: None,
            identity: None,
            set_aside_file_id: false,
        };
        let handle = host.open_dataset(open).expect("open").dataset;
        let style = r##"{"style_version":1,"layer":{"geometry":"polygon","fill_color":{"literal":"#4285f4"},"fill_opacity":{"literal":0.35},"outline_color":{"literal":"#000000"},"outline_width":{"literal":1.5}}}"##;
        let wire = serde_json::json!({
            "skp": SKP_VERSION, "dataset": handle.as_str(),
            "folder": folder.display().to_string(),
            "workspace": {
                "filter": null, "clauses": [],
                "style": serde_json::from_str::<serde_json::Value>(style).expect("JSON"),
                "view": {
                    "centre": [HexF64(2_600_000.5).to_hex(), HexF64(1_200_000.25).to_hex()],
                    "zoom": HexF64(-4.5).to_hex()
                }
            }
        });
        let req: SaveProjectRequest = serde_json::from_value(wire).expect("the save's request");
        projects.save_project(req).expect("saved");
        let (skp, dataset) = (SKP_VERSION.to_string(), handle);
        host.close_dataset(CloseDatasetRequest { skp, dataset })
            .expect("closed");
        projects.release_ended();
        Rig {
            folder,
            machine,
            host,
            projects,
        }
    }

    impl Rig {
        /// One reopen of the project folder: what `open_project_command`'s `Reopen::Opened` arm
        /// receives.
        fn reopened(&self) -> Opened {
            match self
                .projects
                .open_project(&self.folder, "k", None, None, false)
            {
                Ok(Reopen::Opened(o)) => *o,
                other => panic!("the reopen did not open: {other:?}"),
            }
        }

        /// Whether `saved` holds an entry for `handle`.
        fn kept(&self, handle: &DatasetHandle) -> bool {
            let saved = self.projects.saved.lock();
            let saved = saved.unwrap_or_else(|e| e.into_inner());
            saved.iter().any(|s| s.dataset == handle.as_str())
        }
    }

    /// K-D1 (`governance/forms/kernel/OPENED-OF-PANIC-SITES-FREE-THE-LOCK-PREREGISTRATION.md`
    /// §4, S1 to S3 of §3, in order on one rig): a panic at sites 3, 4 and 1 of `opened_of`,
    /// caught as it leaves [`Projects::reply_of`], has closed the dataset, dropped its entry and
    /// freed its lock. Each case reopens; since `open_project` runs `release_ended` before it takes
    /// the lock, that reopen shows only that the previous case closed the dataset, and (iv) is what
    /// shows the lock free.
    ///
    /// RECORDED MUTATION M1: the guard's `Drop` body emptied. OBSERVED at 378c6cfcd42b21691fe40a438d3fc54f0a4cbb4c: this test fails by name at S1's (ii), "S1: (ii) the catalog holds the dataset".
    /// RECORDED MUTATION M3: the guard calls only `release_ended`, without the close. OBSERVED at 378c6cfcd42b21691fe40a438d3fc54f0a4cbb4c: this test fails by name at S1's (ii), "S1: (ii) the catalog holds the dataset".
    /// RECORDED MUTATION M4: the guard closes only, without `release_ended`. OBSERVED at 378c6cfcd42b21691fe40a438d3fc54f0a4cbb4c: this test fails by name at S1's (iii), "S1: (iii) `saved` holds its entry".
    /// RECORDED MUTATION M5, an observation and not a failing test: the `Reopen::Opened` arm calls `opened_of(*o)` in place of `self.reply_of(*o)`. OBSERVED at 378c6cfcd42b21691fe40a438d3fc54f0a4cbb4c: no test fails, since this test and K-D2 call `reply_of` directly; `cargo build --locked -p spatial-kernel --lib` warns "method `reply_of` is never used", which the unmutated build does not warn, and every test of `cargo test --locked -p spatial-kernel` passed under the mutation.
    #[test]
    fn a_panic_while_the_opened_reply_is_built_frees_the_lock_and_closes_the_dataset() {
        let rig = rig("k-d1");
        let differs = |observed, admission| {
            Some(RefCheck::Differs {
                observed,
                admission,
            })
        };
        let (word, none) = (vec!["not-a-wire-word"], Vec::new);
        let cases = [
            (
                "S1",
                differs(word.clone(), none()),
                "an observation component the wire has no word for",
            ),
            (
                "S2",
                differs(none(), word),
                "an admission claim the wire has no word for",
            ),
            ("S3", None, "a style the reader accepted is canonical"),
        ];
        for (case, check, message) in cases {
            let mut o = rig.reopened();
            match check {
                Some(check) => o.check = check,
                None => o.workspace.style.fill_opacity = Value::Literal(f64::NAN),
            }
            let (project, handle) = (o.project.clone(), o.dataset.clone());
            let reply = || rig.projects.reply_of(o);
            let Err(payload) = std::panic::catch_unwind(std::panic::AssertUnwindSafe(reply)) else {
                panic!("{case}: (i) the reply was built without a panic");
            };
            let text = payload.downcast_ref::<String>().map_or("", String::as_str);
            assert!(text.contains(message), "{case}: (i) the payload: {text}");
            let in_catalog = rig.host.catalog().get(handle.as_str()).is_some();
            assert!(!in_catalog, "{case}: (ii) the catalog holds the dataset");
            assert!(!rig.kept(&handle), "{case}: (iii) `saved` holds its entry");
            let probe = store::ProjectLock::try_lock(&rig.machine, &project);
            assert!(probe.is_ok(), "{case}: (iv) the lock is held: {probe:?}");
            drop(probe);
        }
    }

    /// K-D2 (the same form's §4, S4 of §3): a reply built without a panic keeps the dataset in
    /// the catalog and the lock held.
    ///
    /// RECORDED MUTATION M2: the guard's `thread::panicking()` condition dropped. OBSERVED at 378c6cfcd42b21691fe40a438d3fc54f0a4cbb4c: this test fails by name at its catalog assertion, "the catalog does not hold the dataset".
    #[test]
    fn a_reply_built_without_a_panic_keeps_the_entry_and_the_lock() {
        let rig = rig("k-d2");
        let o = rig.reopened();
        let (project, handle) = (o.project.clone(), o.dataset.clone());
        let reply = rig.projects.reply_of(o);
        assert_eq!(reply.dataset, handle, "the reply's dataset");
        let in_catalog = rig.host.catalog().get(handle.as_str()).is_some();
        assert!(in_catalog, "the catalog does not hold the dataset");
        let probe = store::ProjectLock::try_lock(&rig.machine, &project);
        let held = matches!(probe, Err(LockRefused::Held));
        assert!(held, "the lock is not held: {probe:?}");
    }
}
