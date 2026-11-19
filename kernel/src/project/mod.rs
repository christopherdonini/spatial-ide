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
//! ([`Projects::open_project`]), until it is dropped. The only files this module writes in a
//! project folder are `project.spatial` and the temporary file that [`store`]'s atomic replace
//! renames over it.

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

/// Saves projects, and remembers which project each opened dataset was saved to in this run.
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
    /// The identity's open lock, taken by the first save. It is held for as long as this entry is,
    /// which is until [`Projects`] is dropped.
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
    /// - **Every save** judges the locators ([`resolver::judge`]), checks the document against the
    ///   reader's rules, and builds `locations.json`, and `folders.json` at a first save, each
    ///   refused where its reader would refuse it. A first save then takes the identity's open
    ///   lock ([`store::ProjectLock`]). The save then writes `locations.json`, and `folders.json`
    ///   at a first save, and replaces `project.spatial` whole or not at all. A first save that
    ///   replaces it keeps the lock in [`Projects`] until that is dropped; one refused after the
    ///   lock frees it.
    ///   Only then does the history take its moves: the open is bound to the project, which moves
    ///   the open's own record under the project's identity if the open has one, and a `saved-here`
    ///   mark is written in the project's record when the steps reach the workspace. A second open
    ///   of the same file is another open: its steps never go to the first open's record, and its
    ///   own first save binds it to a project of its own. A history that cannot take the moves does
    ///   not undo the save; the result says so.
    pub fn save(
        &self,
        name: &str,
        ds: &Dataset,
        folder: Option<&Path>,
        workspace: Workspace,
    ) -> Result<Saved, SaveFailure> {
        let mut saved = self.saved.lock().unwrap_or_else(|e| e.into_inner());
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
use crate::session_history::{read_lineage, LineageRead};
use resolver::{check_inside, CheckRefused};
use spatial_skp::v0::{
    CloseDatasetRequest, DatasetHandle, OpenDatasetRequest, SessionRef, SKP_VERSION,
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
    /// The folder is not known for the identity, and the first folder still holds this identity
    /// or cannot be read: nothing was written, and the caller asks and calls again with an answer.
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
    /// The cancel key was cancelled before the reopen ended.
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
            Self::FileRefused(e) => write!(f, "{e}"),
            Self::MachineRecordRefused(e) => write!(f, "{e}"),
            Self::KnownFoldersFull { project, count } => write!(
                f,
                "{} remembers {count} folders, and no more can be added",
                project.as_str()
            ),
            Self::OpenElsewhere(p) => write!(f, "{} is open elsewhere", p.as_str()),
            Self::MachineStore { what, source } => write!(f, "{what}: {source}"),
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
            Self::PathNotUnicode(p) => write!(f, "{} is not a Unicode path", p.display()),
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
    ///    from here until it returns; the token is checked after each step that reads.
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
    ///    writer would refuse it; its bytes are kept for step 6.
    /// 3. The identity's open lock, the new identity's after the answer `copy`; then this step's
    ///    writes: `folders.json`, and for a copy its `project.spatial` with the new identity.
    /// 4. The lineage (step 6 of §2.4, run here): [`read_lineage`] of the folder's
    ///    `.spatial/lineage.jsonl` and of `previous-lineage.jsonl` in the machine folder of the
    ///    identity the project file names.
    /// 5. The data. A `relink`, checked at step 2, is used first. Otherwise a `project-relative`
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
            None => match data_at(folder, &file.dataset, &dir)? {
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

/// Whether the saved view's space `saved` is the space `ds` was admitted in (V3).
fn view_state(saved: &Space, ds: &Dataset) -> ViewState {
    let named = |s: &Space| {
        let definition = s.definition.as_deref().unwrap_or("no definition");
        format!("{} ({}, {definition})", s.identifier, s.provenance)
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
