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

use std::fs::{self, File, OpenOptions};
use std::io::Write;
use std::path::{Path, PathBuf};
use std::time::Duration;

use spatial_renderer::canonical::{to_canonical_string, Json};

use super::strict_json::{closed_in_order, read, Layout, Limits};
use super::{ProjectUri, PROJECT_FILE_NAME};
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
pub const OPEN_LOCK: &str = "open.lock";

const FOLDERS_LIMITS: Limits = Limits {
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
    /// Rename the temp file over `project.spatial`, trying again as declared, then flush the
    /// folder where the platform lets it be flushed and remove the temp files a crash left.
    pub fn commit(self) -> Result<(), SaveError> {
        let target = self.folder.join(PROJECT_FILE_NAME);
        let mut attempts = 1;
        let last = loop {
            match fs::rename(&self.temp, &target) {
                Ok(()) => {
                    sync_folder(&self.folder)?;
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

/// A directory can be opened to be flushed where the platform lets a program do so (POSIX); where
/// it does not, the open is refused and there is nothing to flush with.
fn sync_folder(folder: &Path) -> Result<(), SaveError> {
    match File::open(folder) {
        Ok(dir) => dir.sync_all().map_err(unwritable("the project folder")),
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

/// `folders.json` (ADR-036 Amendment 1, item 3): the folders this machine has opened an identity
/// from, by absolute path. `first` is the first folder; `same` holds each folder for which the
/// answer was the same project.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct KnownFolders {
    pub first: PathBuf,
    pub same: Vec<PathBuf>,
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

impl KnownFolders {
    /// One canonical JSON document and an LF, like `locations.json`.
    pub fn to_bytes(&self) -> Result<Vec<u8>, MachineRecordRefused> {
        let path = |p: &Path| match p.to_str() {
            Some(s) if p.is_absolute() => Ok(Json::str(s)),
            _ => Err(refused_folders(format!(
                "{} is not an absolute UTF-8 path",
                p.display()
            ))),
        };
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
        Ok((text + "\n").into_bytes())
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
