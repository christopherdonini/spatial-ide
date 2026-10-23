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
//!
//! Nothing here opens a dataset or holds a handle. Only [`store`] touches a project folder, and it
//! writes one file there.

pub mod file;
pub mod store;
pub mod strict_json;

use std::fmt;
use std::str::FromStr;

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
