// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **K-S6** (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md` §4, step 1; H6): a process that ends
//! after it has written and synced the new project file's temp file, and before the rename, leaves
//! the previous `project.spatial` whole. The test runs a child copy of its own binary, which stages
//! the new bytes and calls `process::abort` (no destructor runs on the way out). The parent waits
//! for the child with a timeout of 60 s. It then finds the previous bytes in place, the temp file
//! the child left, and that the next successful save removes that file and only files named by the
//! temp pattern.

use std::path::{Path, PathBuf};
use std::process::{Command, Stdio};
use std::time::{Duration, Instant};

use spatial_kernel::project::store::{replace, stage};

const TEST: &str = "an_abort_before_the_rename_leaves_the_previous_project_file_whole";
const CHILD_ENV: &str = "SPATIAL_IDE_KS6_CHILD_FOLDER";
const PREVIOUS: &[u8] = b"{\n  \"previous\": \"whole\"\n}\n";
const STAGED: &[u8] = b"{\n  \"staged\": \"by the child\"\n}\n";
const NEXT: &[u8] = b"{\n  \"next\": \"save\"\n}\n";

fn temp_names(folder: &Path) -> Vec<String> {
    let names = std::fs::read_dir(folder)
        .expect("the folder")
        .map(|e| e.expect("entry").file_name().to_string_lossy().into_owned());
    let mut names: Vec<String> = names.collect();
    names.sort();
    names
}

#[test]
fn an_abort_before_the_rename_leaves_the_previous_project_file_whole() {
    if let Ok(folder) = std::env::var(CHILD_ENV) {
        let _staged = stage(Path::new(&folder), STAGED).expect("the temp file is written");
        println!("staged");
        std::process::abort();
    }
    let dir: PathBuf = std::env::temp_dir()
        .join("spatial-ide-project-save-tests")
        .join("ks6");
    let _ = std::fs::remove_dir_all(&dir);
    std::fs::create_dir_all(&dir).expect("scratch folder");
    let project = dir.join("project.spatial");
    std::fs::write(&project, PREVIOUS).expect("the previous project file");

    let exe = std::env::current_exe().expect("the test binary");
    let mut child = Command::new(exe)
        .args(["--exact", TEST, "--nocapture", "--test-threads=1"])
        .env(CHILD_ENV, &dir)
        .stdout(Stdio::piped())
        .stderr(Stdio::null())
        .spawn()
        .expect("the child");
    let started = Instant::now();
    let status = loop {
        if let Some(status) = child.try_wait().expect("wait") {
            break status;
        }
        if started.elapsed() > Duration::from_secs(60) {
            child.kill().expect("kill the child this test started");
            panic!("the child did not end within 60 s");
        }
        std::thread::sleep(Duration::from_millis(50));
    };
    assert!(!status.success(), "the child aborted: {status:?}");

    assert_eq!(std::fs::read(&project).expect("project file"), PREVIOUS);
    let names = temp_names(&dir);
    let left: Vec<&String> = names
        .iter()
        .filter(|n| n.starts_with("project.spatial.tmp-"))
        .collect();
    assert_eq!(left.len(), 1, "the temp file the child left: {names:?}");
    assert_eq!(std::fs::read(dir.join(left[0])).expect("temp file"), STAGED);

    // Only the exact pattern is removed: 16 lowercase hex characters after the prefix.
    let others = [
        "project.spatial.tmp-0123456789ABCDEF",
        "project.spatial.tmp-1",
        "notes.txt",
    ];
    for name in others {
        std::fs::write(dir.join(name), b"kept").expect("an unrelated file");
    }
    replace(&dir, NEXT).expect("the next save");
    assert_eq!(std::fs::read(&project).expect("project file"), NEXT);
    let mut expected: Vec<String> = others.iter().map(|n| n.to_string()).collect();
    expected.push("project.spatial".to_string());
    expected.sort();
    assert_eq!(temp_names(&dir), expected);
}
