// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **T6** (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md` Amendment 30, item 6 (c); H7): the
//! project lock on `open.lock` in the identity's machine folder is refused while it is held, in this
//! process and in another, and the operating system frees it when its holder crashes. The test runs
//! a child copy of its own binary (`project_save_crash.rs`'s pattern), which takes the lock, prints
//! a marker line, and calls `process::abort` when its standard input closes, so no destructor runs.
//! Each wait on the child is bounded at 60 s. `open.lock` is never written: it stays empty.
//!
//! RECORDED MUTATIONS: (a) no lock taken; expected failure: the second take in this process is not
//! refused. (b) a `create_new` marker file in place of the lock; expected failure: the lock is still
//! refused after the child aborts, since nothing removes the marker a crash leaves.

use std::io::{BufRead, BufReader};
use std::path::{Path, PathBuf};
use std::process::{Command, Stdio};
use std::sync::mpsc;
use std::time::{Duration, Instant};

use spatial_kernel::project::store::{LockRefused, ProjectLock, OPEN_LOCK};
use spatial_kernel::project::ProjectUri;

const TEST: &str =
    "the_project_lock_is_refused_while_held_in_this_process_and_in_another_and_freed_by_a_crash";
const CHILD_ENV: &str = "SPATIAL_IDE_T6_CHILD_ROOT";
const HELD: &str = "t6: the child holds the project lock";
const PROJECT: &str = "spatial://project/0123456789abcdef0123456789abcdef";

fn lock_len(root: &Path, project: &ProjectUri) -> u64 {
    let path = root.join(project.hex()).join(OPEN_LOCK);
    std::fs::metadata(path).expect("open.lock").len()
}

fn held(root: &Path, project: &ProjectUri) -> bool {
    matches!(ProjectLock::try_lock(root, project), Err(LockRefused::Held))
}

#[test]
fn the_project_lock_is_refused_while_held_in_this_process_and_in_another_and_freed_by_a_crash() {
    let project: ProjectUri = PROJECT.parse().expect("a project identity");
    if let Ok(root) = std::env::var(CHILD_ENV) {
        let _lock = ProjectLock::try_lock(Path::new(&root), &project).expect("the child's lock");
        println!("{HELD}");
        let mut line = String::new();
        drop(std::io::stdin().read_line(&mut line));
        std::process::abort();
    }
    let root: PathBuf = std::env::temp_dir()
        .join("spatial-ide-project-lock-tests")
        .join("t6");
    let _ = std::fs::remove_dir_all(&root);

    // In this process: the folder and `open.lock` are created, and a second take is refused while
    // the first is held.
    let first = ProjectLock::try_lock(&root, &project).expect("taken in a new machine store");
    assert!(held(&root, &project), "a second take in this process");
    assert_eq!(lock_len(&root, &project), 0);
    drop(first);
    drop(ProjectLock::try_lock(&root, &project).expect("taken after drop"));

    // In another process, which then aborts while it holds the lock.
    let exe = std::env::current_exe().expect("the test binary");
    let mut child = Command::new(exe)
        .args(["--exact", TEST, "--nocapture", "--test-threads=1"])
        .env(CHILD_ENV, &root)
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::null())
        .spawn()
        .expect("the child");
    let stdout = child.stdout.take().expect("the child's stdout");
    let (said, heard) = mpsc::channel();
    std::thread::spawn(move || {
        let mut lines = BufReader::new(stdout).lines().map_while(Result::ok);
        drop(said.send(lines.any(|l| l.contains(HELD))));
    });
    let reported = heard.recv_timeout(Duration::from_secs(60));
    if reported != Ok(true) {
        child.kill().expect("kill the child this test started");
        panic!("the child did not report the lock within 60 s: {reported:?}");
    }
    assert!(held(&root, &project), "held by the child");

    drop(child.stdin.take());
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

    let after = ProjectLock::try_lock(&root, &project).expect("taken after the child's crash");
    assert_eq!(lock_len(&root, &project), 0, "open.lock is never written");
    drop(after);
}
