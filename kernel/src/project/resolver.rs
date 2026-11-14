// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **The resolver, at save** (inventory row 7; ADR-036 §5; `kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md`
//! §2.5): [`judge`] decides which locators a project file carries for the data a dataset was opened
//! over. It reads the file system and holds no handle: every call below is a path call, and nothing
//! it learns is kept.
//!
//! - A `machine-recorded` locator is always carried.
//! - A `project-relative` locator is carried when three things hold: the data is inside the project
//!   folder, it is reached without a link, and its path has a canonical spelling.
//! - Otherwise the reference keeps `machine-recorded` alone, and [`Carried`] says which of the three
//!   failed. The save is not refused for it.
//!
//! Containment is judged on this machine at the moment of the save. That the data later read is the
//! data judged here is not claimed (ADR-036 §5, last sentence).

use std::path::{Component, Path, PathBuf};

use super::file::MAX_LOCATOR_SEGMENTS;
use crate::dataset_ref::DatasetRef;

/// What a project file carries for the data, and, where it is `machine-recorded` alone, why.
#[derive(Clone, Debug, PartialEq, Eq)]
pub enum Carried {
    /// The `/`-separated path from the project folder, as the locator holds it.
    ProjectRelative(String),
    MachineRecordedOnly(Why),
}

/// Why a project-relative locator is not carried.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Why {
    /// The data, or the folder, could not be resolved at the save, or the data is not under the
    /// folder.
    Outside,
    /// The data is inside the folder, but its path has no canonical spelling on this machine: a
    /// segment that is not UTF-8, one the canonical form refuses (ADR-036 §5), or more segments than
    /// [`MAX_LOCATOR_SEGMENTS`].
    NoCanonicalSpelling,
    /// The data is inside the folder, and the way it was opened crosses a link.
    ThroughLink,
}

/// The reference to write, and the judgment it rests on.
#[derive(Clone, Debug)]
pub struct Judged {
    pub reference: DatasetRef,
    pub carried: Carried,
}

/// §2.5's steps at save, for `reference` (which holds `machine-recorded`), the data path `data` the
/// dataset was opened with and the project folder `folder`:
///
/// 1. canonicalize the data to P and the folder to F;
/// 2. P not under F: outside, `machine-recorded` only;
/// 3. the relative segments through the canonical-form text check
///    ([`DatasetRef::with_project_relative`]): a failure is `machine-recorded` only;
/// 4. the way the data was opened, from the folder down, crosses a link: `machine-recorded` only.
///
/// Step 4 walks the path as it was opened, not P: P has every link resolved, so a walk of P's
/// segments could never meet one.
pub fn judge(reference: &DatasetRef, data: &Path, folder: &Path) -> Judged {
    let only = |why| Judged {
        reference: reference.clone(),
        carried: Carried::MachineRecordedOnly(why),
    };
    let (Ok(p), Ok(f)) = (std::fs::canonicalize(data), std::fs::canonicalize(folder)) else {
        return only(Why::Outside);
    };
    let Ok(relative) = p.strip_prefix(&f) else {
        return only(Why::Outside);
    };
    let segments: Option<Vec<&str>> = relative
        .components()
        .map(|c| match c {
            Component::Normal(s) => s.to_str(),
            _ => None,
        })
        .collect();
    let at = segments
        .filter(|s| !s.is_empty() && s.len() <= MAX_LOCATOR_SEGMENTS)
        .map(|s| s.join("/"));
    let carried = at.and_then(|at| Some((reference.with_project_relative(&at).ok()?, at)));
    let Some((with, at)) = carried else {
        return only(Why::NoCanonicalSpelling);
    };
    if reached_through_link(data, &f) {
        return only(Why::ThroughLink);
    }
    Judged {
        reference: with,
        carried: Carried::ProjectRelative(at),
    }
}

/// Whether the path `data` was opened by crosses a link below the folder `f` (canonical), or does
/// not pass through the folder at all, which is a link somewhere above it. Each prefix is read by
/// `symlink_metadata`, which does not follow the last component; on Windows a link is a name
/// surrogate, and a cloud placeholder is not one (H1).
fn reached_through_link(data: &Path, f: &Path) -> bool {
    let Ok(data) = std::path::absolute(data) else {
        return true;
    };
    let mut prefix = PathBuf::new();
    let mut inside = false;
    for component in data.components() {
        prefix.push(component);
        if inside {
            let link = std::fs::symlink_metadata(&prefix).map(|m| m.file_type().is_symlink());
            if link.unwrap_or(true) {
                return true;
            }
        } else if prefix.has_root() && std::fs::canonicalize(&prefix).is_ok_and(|p| p == f) {
            inside = true;
        }
    }
    !inside
}
