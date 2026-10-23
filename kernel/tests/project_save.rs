// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **K-S7** (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md` §4, step 1; H6): a rename that keeps
//! failing is tried [`MAX_SAVE_RENAME_ATTEMPTS`] times and then refused by name, and the failed save
//! leaves nothing behind. The rename fails on every platform and every time here because
//! `project.spatial` is a folder that holds a file: a file cannot be renamed over it.

use std::sync::mpsc;
use std::time::Duration;

use spatial_kernel::project::store::{replace, SaveError, MAX_SAVE_RENAME_ATTEMPTS};

#[test]
fn a_rename_that_keeps_failing_is_refused_by_name_after_the_declared_attempts() {
    let dir = std::env::temp_dir()
        .join("spatial-ide-project-save-tests")
        .join("ks7");
    let _ = std::fs::remove_dir_all(&dir);
    let blocker = dir.join("project.spatial");
    std::fs::create_dir_all(&blocker).expect("scratch folder");
    std::fs::write(blocker.join("keep.txt"), b"kept").expect("a file in the way");

    // A save that never gives up would never return, so the call is bounded here.
    let (done, result) = mpsc::channel();
    let folder = dir.clone();
    std::thread::spawn(move || drop(done.send(replace(&folder, b"new bytes"))));
    let refused = result
        .recv_timeout(Duration::from_secs(60))
        .expect("the save returned within 60 s")
        .expect_err("a rename over a folder cannot succeed");

    match &refused {
        SaveError::RenameKeepsFailing { attempts, .. } => {
            assert_eq!(*attempts, MAX_SAVE_RENAME_ATTEMPTS);
        }
        other => panic!("the refusal names the rename: {other}"),
    }
    assert!(refused
        .to_string()
        .contains(&MAX_SAVE_RENAME_ATTEMPTS.to_string()));
    let names: Vec<String> = std::fs::read_dir(&dir)
        .expect("the folder")
        .map(|e| e.expect("entry").file_name().to_string_lossy().into_owned())
        .collect();
    assert_eq!(
        names,
        ["project.spatial"],
        "the failed save left no temp file"
    );
    assert!(blocker.join("keep.txt").exists());
}
