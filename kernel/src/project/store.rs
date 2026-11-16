// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **The identity, the machine store and the atomic replace** (ADR-036 §1, §4 and Amendment 1,
//! item 3; `kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md` §2.3).
//!
//! - **The atomic replace** writes `project.spatial.tmp-<16 hex>` in the folder, `write_all`, then
//!   `sync_all`, then renames it over `project.spatial` ([`replace`], or [`stage`] and
//!   [`Staged::commit`] where a caller needs the two apart). A rename that fails is tried again up
//!   to [`MAX_SAVE_RENAME_ATTEMPTS`] times (a sharing violation from an indexer, an antivirus
//!   scanner or a sync client), and is then refused by name. A temp file a crash left belongs to no
//!   format; a successful save removes the files named by exactly the pattern, and nothing else.
//!   The kernel asks the operating system to flush. Survival of a power loss is not claimed.
//! - **The machine store** is `<data dir>/spatial-ide/projects/<32 hex>/`, beside the sessions the
//!   history keeps. None of its files is ever in a project folder.

use std::fs::{self, File, OpenOptions, TryLockError};
use std::io::Write;
use std::path::{Path, PathBuf};
use std::time::Duration;

use spatial_renderer::canonical::{to_canonical_string, Json};

use super::strict_json::{closed_in_order, read, Layout, Limits};
use super::{ProjectUri, PROJECT_FILE_NAME};
use crate::dataset_ref::DatasetUri;
use crate::permission::audit::log::data_dir;

/// How many times a save tries the rename over `project.spatial` before it refuses.
pub const MAX_SAVE_RENAME_ATTEMPTS: u32 = 5;
/// The pause between two attempts. No timing claim is made.
const RENAME_PAUSE: Duration = Duration::from_millis(100);
/// The most folders one identity remembers, the first folder included (ADR-036 Amendment 1, item 6).
pub const MAX_KNOWN_FOLDERS: usize = 256;

const TEMP_PREFIX: &str = "project.spatial.tmp-";
const TEMP_HEX_LEN: usize = 16;

/// The files of one project's folder in the machine store.
pub const LOCATIONS: &str = "locations.json";
pub const FOLDERS: &str = "folders.json";
/// The file [`ProjectLock`] locks. It is never written. Pre-committed with [`ProjectLock`]: see
/// there for its consumer (the form's Amendment 30, item 6 (d)).
pub const OPEN_LOCK: &str = "open.lock";

const FOLDERS_LIMITS: Limits = Limits {
    max_bytes: 2_097_152,
    max_depth: 4,
    max_string_bytes: 4_096,
};

/// The reader's bounds for `locations.json`, `folders.json`'s values (the form's Amendment 30,
/// item 6 (a); outside §7).
const LOCATIONS_LIMITS: Limits = Limits {
    max_bytes: 2_097_152,
    max_depth: 4,
    max_string_bytes: 4_096,
};

/// A new project identity: 128 bits from the operating system's CSPRNG (ADR-036 §4).
pub fn mint_identity() -> ProjectUri {
    let mut bytes = [0u8; 16];
    getrandom::fill(&mut bytes).expect("OS CSPRNG unavailable");
    ProjectUri::from_bytes(bytes)
}

/// `<per-user data directory>/spatial-ide/projects`, from the one resolver the audit log uses.
pub fn projects_root() -> Option<PathBuf> {
    data_dir().map(|d| d.join("spatial-ide").join("projects"))
}

/// The folder of one identity under `root`.
pub fn record_dir(root: &Path, id: &ProjectUri) -> PathBuf {
    root.join(id.hex())
}

/// Why a project file was not written.
#[derive(Debug)]
pub enum SaveError {
    Unwritable {
        what: &'static str,
        source: std::io::Error,
    },
    RenameKeepsFailing {
        attempts: u32,
        last: std::io::Error,
    },
}

impl std::fmt::Display for SaveError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Unwritable { what, source } => write!(f, "{what}: {source}"),
            Self::RenameKeepsFailing { attempts, last } => write!(
                f,
                "the rename over {PROJECT_FILE_NAME} failed {attempts} times; the last error was: {last}"
            ),
        }
    }
}

impl std::error::Error for SaveError {}

/// New bytes written to a temp file in the project folder and synced, not yet renamed.
#[derive(Debug)]
pub struct Staged {
    folder: PathBuf,
    temp: PathBuf,
}

fn unwritable(what: &'static str) -> impl FnOnce(std::io::Error) -> SaveError {
    move |source| SaveError::Unwritable { what, source }
}

/// Write `bytes` to a new temp file in `folder` and sync it. The project file is not touched.
pub fn stage(folder: &Path, bytes: &[u8]) -> Result<Staged, SaveError> {
    let mut random = [0u8; TEMP_HEX_LEN / 2];
    getrandom::fill(&mut random).expect("OS CSPRNG unavailable");
    let hex: String = random.iter().map(|b| format!("{b:02x}")).collect();
    let temp = folder.join(format!("{TEMP_PREFIX}{hex}"));
    let mut file = OpenOptions::new()
        .write(true)
        .create_new(true)
        .open(&temp)
        .map_err(unwritable("the temporary file"))?;
    let written = file.write_all(bytes).and_then(|()| file.sync_all());
    drop(file);
    if let Err(source) = written {
        drop(fs::remove_file(&temp));
        return Err(SaveError::Unwritable {
            what: "the temporary file",
            source,
        });
    }
    Ok(Staged {
        folder: folder.to_path_buf(),
        temp,
    })
}

impl Staged {
    /// Rename the temp file over `project.spatial`, trying again as declared, then flush the folder
    /// ([`sync_folder`]) and remove the temp files a crash left. Once the rename has succeeded, the
    /// save stands: a flush that fails after it is written to standard error, as the error's kind
    /// only, and refuses nothing (D-16; the form's Amendment 30, item 3, O-8).
    pub fn commit(self) -> Result<(), SaveError> {
        self.commit_with(sync_folder)
    }

    /// [`Staged::commit`] with the folder flush given, so that T7 can give one that fails.
    fn commit_with(self, flush: impl Fn(&Path) -> std::io::Result<()>) -> Result<(), SaveError> {
        let target = self.folder.join(PROJECT_FILE_NAME);
        let mut attempts = 1;
        let last = loop {
            match fs::rename(&self.temp, &target) {
                Ok(()) => {
                    if let Err(e) = flush(&self.folder) {
                        eprintln!(
                            "the folder flush after the project file's rename failed: {}",
                            e.kind()
                        );
                    }
                    remove_stale_temps(&self.folder);
                    return Ok(());
                }
                Err(e) if attempts >= MAX_SAVE_RENAME_ATTEMPTS => break e,
                Err(_) => {
                    attempts += 1;
                    std::thread::sleep(RENAME_PAUSE);
                }
            }
        };
        drop(fs::remove_file(&self.temp));
        Err(SaveError::RenameKeepsFailing { attempts, last })
    }
}

/// Replace `project.spatial` in `folder` with `bytes`, whole or not at all.
pub fn replace(folder: &Path, bytes: &[u8]) -> Result<(), SaveError> {
    stage(folder, bytes)?.commit()
}

/// Flush `folder` where the platform lets a program open a directory to flush it (POSIX). Where it
/// does not (Windows), the open is refused and there is nothing to flush with: that is `Ok`. A flush
/// that fails is an `Err`, which [`Staged::commit`] writes to standard error and refuses nothing over.
fn sync_folder(folder: &Path) -> std::io::Result<()> {
    match File::open(folder) {
        Ok(dir) => dir.sync_all(),
        Err(_) => Ok(()),
    }
}

/// Whether `name` is exactly `project.spatial.tmp-` and 16 lowercase hex characters.
fn is_temp_name(name: &str) -> bool {
    let hex = name.strip_prefix(TEMP_PREFIX);
    let lower = |b: u8| matches!(b, b'0'..=b'9' | b'a'..=b'f');
    hex.is_some_and(|h| h.len() == TEMP_HEX_LEN && h.bytes().all(lower))
}

fn remove_stale_temps(folder: &Path) {
    let Ok(entries) = fs::read_dir(folder) else {
        return;
    };
    for entry in entries.flatten() {
        let is_file = entry.file_type().is_ok_and(|t| t.is_file());
        if is_file && entry.file_name().to_str().is_some_and(is_temp_name) {
            drop(fs::remove_file(entry.path()));
        }
    }
}

/// An identity's open lock: an exclusive lock on [`OPEN_LOCK`] in the identity's machine folder,
/// freed when this is dropped, and by the operating system when the process ends, a crash included
/// (§2.4 step 3; H7).
///
/// Pre-committed producer, with [`OPEN_LOCK`], [`ProjectLock::try_lock`] and [`LockRefused`] (the
/// form's Amendment 30, item 6 (d)). Its consumers: `open_project`'s step 3 and `Projects::save` at
/// a first save (P3a), and the binding's lock state, dropped at `close_dataset` and by the
/// session-end forwarder (P3b). The seam's end-to-end tests are that row's: K-O4, K-O5, two named
/// there by working name, E-SECOND and E-CRASH-UNLOCK. Its own test is T6, in
/// `kernel/tests/project_lock_crash.rs`.
#[derive(Debug)]
pub struct ProjectLock {
    file: File,
}

impl ProjectLock {
    /// Take `project`'s open lock under `root`, the machine store's `projects` folder, without
    /// waiting. The identity's folder and [`OPEN_LOCK`] are created if they are absent; the file is
    /// never truncated or written.
    pub fn try_lock(root: &Path, project: &ProjectUri) -> Result<ProjectLock, LockRefused> {
        let dir = record_dir(root, project);
        fs::create_dir_all(&dir).map_err(LockRefused::Io)?;
        let mut options = OpenOptions::new();
        options.read(true).write(true).create(true).truncate(false);
        let file = options.open(dir.join(OPEN_LOCK)).map_err(LockRefused::Io)?;
        match file.try_lock() {
            Ok(()) => Ok(ProjectLock { file }),
            Err(TryLockError::WouldBlock) => Err(LockRefused::Held),
            Err(TryLockError::Error(e)) => Err(LockRefused::Io(e)),
        }
    }
}

impl Drop for ProjectLock {
    fn drop(&mut self) {
        drop(self.file.unlock());
    }
}

/// Why [`ProjectLock::try_lock`] did not take the lock.
#[derive(Debug)]
pub enum LockRefused {
    /// Another handle holds it, in this process or in another.
    Held,
    /// The folder or the file could not be made or opened, or the lock call failed.
    Io(std::io::Error),
}

/// `folders.json` (ADR-036 Amendment 1, item 3): the folders this machine has opened an identity
/// from, by absolute path. `first` is the first folder; `same` holds each folder for which the
/// answer was the same project.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct KnownFolders {
    pub first: PathBuf,
    pub same: Vec<PathBuf>,
}

/// The answer `same` refused for a folder past [`MAX_KNOWN_FOLDERS`]: `count` is how many folders
/// the identity remembers, `first` included (M2).
///
/// Pre-committed producer, with [`KnownFolders::with_same`]: see there for its consumer (the
/// form's Amendment 30, item 6 (d)).
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct KnownFoldersFull {
    pub count: usize,
}

/// Why a machine store file was refused: the file's name and the rule.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct MachineRecordRefused {
    pub file: &'static str,
    pub rule: String,
}

impl std::fmt::Display for MachineRecordRefused {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}: {}", self.file, self.rule)
    }
}

impl std::error::Error for MachineRecordRefused {}

fn refused_folders(rule: impl Into<String>) -> MachineRecordRefused {
    MachineRecordRefused {
        file: FOLDERS,
        rule: rule.into(),
    }
}

/// `p` as a machine store reader takes a path: absolute, valid Unicode and at most `max` bytes.
/// Anything else is refused, naming `file`, so that a path is never written altered.
fn stored_path<'a>(
    p: &'a Path,
    file: &'static str,
    max: usize,
) -> Result<&'a str, MachineRecordRefused> {
    let rule = match p.to_str() {
        Some(s) if p.is_absolute() && s.len() <= max => return Ok(s),
        Some(s) if p.is_absolute() => {
            format!("a path of {} bytes, over the ceiling of {max}", s.len())
        }
        _ => format!("{} is not an absolute UTF-8 path", p.display()),
    };
    Err(MachineRecordRefused { file, rule })
}

impl KnownFolders {
    /// One canonical JSON document and an LF, like `locations.json`. A list [`Self::from_bytes`]
    /// refuses is refused here, naming the file (the form's Amendment 30, item 4 (a)): more than
    /// [`MAX_KNOWN_FOLDERS`] folders, a path that is not absolute, not valid Unicode or over the
    /// reader's string bound, and a document over the reader's byte bound.
    pub fn to_bytes(&self) -> Result<Vec<u8>, MachineRecordRefused> {
        let max = FOLDERS_LIMITS.max_string_bytes;
        let path = |p: &Path| stored_path(p, FOLDERS, max).map(Json::str);
        let same: Result<Vec<Json>, _> = self.same.iter().map(|p| path(p)).collect();
        let folders = Json::obj([
            ("format", Json::str("spatial-folders")),
            ("version", Json::Int(1)),
            ("first", path(&self.first)?),
            ("same", Json::Arr(same?)),
        ]);
        if 1 + self.same.len() > MAX_KNOWN_FOLDERS {
            return Err(refused_folders(format!(
                "more than {MAX_KNOWN_FOLDERS} folders"
            )));
        }
        let text = to_canonical_string(&folders).map_err(|e| refused_folders(e.to_string()))?;
        if text.len() > FOLDERS_LIMITS.max_bytes {
            let rule = format!(
                "the document is {} bytes, over the ceiling of {}",
                text.len(),
                FOLDERS_LIMITS.max_bytes
            );
            return Err(refused_folders(rule));
        }
        Ok((text + "\n").into_bytes())
    }

    /// The list after the answer `same` for `folder` (§2.4 step 2; M2). Pure: nothing is written.
    /// A folder already known gives the list unchanged. A new one is added to `same`, unless the
    /// list already holds [`MAX_KNOWN_FOLDERS`] folders, `first` counted: that is refused, and
    /// nothing is dropped to make room.
    ///
    /// Pre-committed producer, with [`KnownFoldersFull`] (the form's Amendment 30, item 6 (d)). Its
    /// consumer is `open_project`'s `same` arm (P3a); the seam's tests are K-O11 and K-O6. Its own
    /// test is T8, in `kernel/tests/project_store.rs`.
    pub fn with_same(&self, folder: &Path) -> Result<KnownFolders, KnownFoldersFull> {
        if self.first == folder || self.same.iter().any(|p| p == folder) {
            return Ok(self.clone());
        }
        let count = 1 + self.same.len();
        if count >= MAX_KNOWN_FOLDERS {
            return Err(KnownFoldersFull { count });
        }
        let mut next = self.clone();
        next.same.push(folder.to_path_buf());
        Ok(next)
    }

    /// The list after a move to `folder` (OPEN-S2-2 (a)). Pure: `folder` becomes `first` and leaves
    /// `same`, and the old `first` is forgotten.
    ///
    /// Pre-committed producer (the form's Amendment 30, item 6 (d)). Its consumer is
    /// `open_project`'s move arm (P3a); the seam's test is K-O6 widened, named there by working
    /// name. Its own test is T9, in `kernel/tests/project_store.rs`.
    pub fn moved_to(&self, folder: &Path) -> KnownFolders {
        let same = self.same.iter().filter(|p| *p != folder);
        KnownFolders {
            first: folder.to_path_buf(),
            same: same.cloned().collect(),
        }
    }

    /// Read `folders.json`, strictly.
    pub fn from_bytes(bytes: &[u8]) -> Result<Self, MachineRecordRefused> {
        let line = bytes
            .strip_suffix(b"\n")
            .ok_or_else(|| refused_folders("the document does not end in LF"))?;
        let doc = read(line, Layout::Compact, &FOLDERS_LIMITS)
            .map_err(|e| refused_folders(e.to_string()))?;
        let keys = ["format", "version", "first", "same"];
        let m = closed_in_order(&doc, "$", &keys)
            .map_err(|(path, rule)| refused_folders(format!("{path}: {rule}")))?;
        if *m[0] != Json::str("spatial-folders") || *m[1] != Json::Int(1) {
            return Err(refused_folders(
                "not a version 1 `spatial-folders` document",
            ));
        }
        let path = |v: &Json, at: String| match v {
            Json::Str(s) if Path::new(s).is_absolute() => Ok(PathBuf::from(s)),
            _ => Err(refused_folders(format!("{at}: expected an absolute path"))),
        };
        let Json::Arr(items) = m[3] else {
            return Err(refused_folders("$.same: expected an array"));
        };
        if 1 + items.len() > MAX_KNOWN_FOLDERS {
            return Err(refused_folders(format!(
                "more than {MAX_KNOWN_FOLDERS} folders"
            )));
        }
        let same: Result<Vec<PathBuf>, _> = items
            .iter()
            .enumerate()
            .map(|(i, v)| path(v, format!("$.same[{i}]")))
            .collect();
        Ok(KnownFolders {
            first: path(m[2], "$.first".to_string())?,
            same: same?,
        })
    }
}

/// One entry of `locations.json` (ADR-036 §9's `spatial-locations` format): where this machine
/// found a dataset.
///
/// Pre-committed producer, with [`read_locations`] (the form's Amendment 30, item 6 (d)). Its
/// consumer is `open_project`'s machine-location arm (P3a); the seam's tests are K-O3 and K-O10
/// widened, named there by working name. Its own tests are T10 and T13, in
/// `kernel/tests/project_store.rs`, and T11, in `kernel/tests/project_save.rs`.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct Location {
    pub dataset: DatasetUri,
    pub path: PathBuf,
}

fn refused_locations(rule: impl Into<String>) -> MachineRecordRefused {
    MachineRecordRefused {
        file: LOCATIONS,
        rule: rule.into(),
    }
}

/// `locations.json` for the dataset `uri` found at `at`: one canonical JSON document and an LF. A
/// path [`read_locations`] refuses is refused here, naming the file, and never written altered:
/// one that is not absolute, not valid Unicode, or over the reader's string bound (the form's
/// Amendment 30, item 4 (a)). One entry within that bound is far below the document's byte bound.
/// Its product caller is `Projects::save`.
pub fn locations_to_bytes(uri: &DatasetUri, at: &Path) -> Result<Vec<u8>, MachineRecordRefused> {
    let max = LOCATIONS_LIMITS.max_string_bytes;
    let entry = Json::obj([
        ("dataset", Json::str(uri.as_str())),
        ("path", Json::str(stored_path(at, LOCATIONS, max)?)),
    ]);
    let locations = Json::obj([
        ("format", Json::str("spatial-locations")),
        ("version", Json::Int(1)),
        ("entries", Json::Arr(vec![entry])),
    ]);
    let text = to_canonical_string(&locations).map_err(|e| refused_locations(e.to_string()))?;
    Ok((text + "\n").into_bytes())
}

/// Read `locations.json`, strictly: one canonical JSON document and an LF within the reader's
/// bounds, its members `format`, `version` and `entries` in that order, and each entry a dataset
/// URI and an absolute path, in that order. Any other shape is refused, naming the file.
pub fn read_locations(bytes: &[u8]) -> Result<Vec<Location>, MachineRecordRefused> {
    let line = bytes
        .strip_suffix(b"\n")
        .ok_or_else(|| refused_locations("the document does not end in LF"))?;
    let doc = read(line, Layout::Compact, &LOCATIONS_LIMITS)
        .map_err(|e| refused_locations(e.to_string()))?;
    let m = closed_locations(&doc, "$", &["format", "version", "entries"])?;
    if *m[0] != Json::str("spatial-locations") || *m[1] != Json::Int(1) {
        return Err(refused_locations(
            "not a version 1 `spatial-locations` document",
        ));
    }
    let Json::Arr(items) = m[2] else {
        return Err(refused_locations("$.entries: expected an array"));
    };
    let entries = items.iter().enumerate();
    entries
        .map(|(i, v)| location(v, &format!("$.entries[{i}]")))
        .collect()
}

/// One entry of `locations.json`, at the path `at` in the document.
fn location(v: &Json, at: &str) -> Result<Location, MachineRecordRefused> {
    let e = closed_locations(v, at, &["dataset", "path"])?;
    let (Json::Str(dataset), Json::Str(path)) = (e[0], e[1]) else {
        return Err(refused_locations(format!("{at}: expected two strings")));
    };
    let dataset = dataset
        .parse::<DatasetUri>()
        .map_err(|e| refused_locations(format!("{at}.dataset: {e}")))?;
    if !Path::new(path).is_absolute() {
        let rule = format!("{at}.path: expected an absolute path");
        return Err(refused_locations(rule));
    }
    let path = PathBuf::from(path);
    Ok(Location { dataset, path })
}

fn closed_locations<'a>(
    v: &'a Json,
    at: &str,
    keys: &[&str],
) -> Result<Vec<&'a Json>, MachineRecordRefused> {
    closed_in_order(v, at, keys)
        .map_err(|(path, rule)| refused_locations(format!("{path}: {rule}")))
}

#[cfg(test)]
mod tests {
    use super::*;

    /// **T7** (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md` Amendment 30, item 6 (c); D-16): a
    /// folder flush that fails after the rename keeps the save. `commit_with` is `Ok`,
    /// `project.spatial` holds the new bytes, and no temp file is left.
    ///
    /// RECORDED MUTATION: the flush error returned. Expected failure: `commit_with` is an `Err`.
    #[test]
    fn a_folder_flush_failing_after_the_rename_keeps_the_save() {
        let folder = std::env::temp_dir()
            .join("spatial-ide-project-store-unit")
            .join("t7");
        let _ = fs::remove_dir_all(&folder);
        fs::create_dir_all(&folder).expect("scratch folder");
        let target = folder.join(PROJECT_FILE_NAME);
        fs::write(&target, b"previous").expect("the previous project file");
        let staged = stage(&folder, b"new bytes").expect("staged");
        let failing = |_: &Path| Err(std::io::Error::other("the flush failed"));
        staged.commit_with(failing).expect("the save is kept");
        assert_eq!(fs::read(&target).expect("project.spatial"), b"new bytes");
        let names: Vec<String> = fs::read_dir(&folder)
            .expect("the folder")
            .map(|e| e.expect("entry").file_name().to_string_lossy().into_owned())
            .collect();
        assert_eq!(names, [PROJECT_FILE_NAME], "no temp file is left");
    }
}
