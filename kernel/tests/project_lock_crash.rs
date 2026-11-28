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
        let _ = said.send(lines.any(|l| l.contains(HELD)));
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

// K-O5 (the form's Amendment 36, item 7 (b)): a reopen's lock, freed by the crash of the process
// that holds it. A first save makes the project; the child reopens it and aborts.

mod watch_support;

use std::sync::Arc;

use spatial_engine::fixture::{write_geoparquet, FixtureSpec};
use spatial_kernel::project::file::{Space, View, Workspace};
use spatial_kernel::project::{OpenFailure, Projects, Reopen};
use spatial_kernel::session_history::StepRecorder;
use spatial_kernel::skp::{session_end_channel, SkpHost, StreamRegistry};
use spatial_kernel::Catalog;
use spatial_renderer::{canonical::sha256_hex, style};
use spatial_skp::v0::{OpenDatasetRequest, SKP_VERSION};

const KO5: &str = "the_second_open_refusal_never_outlives_a_crash";
const KO5_ENV: &str = "SPATIAL_IDE_KO5_CHILD_DIR";
const KO5_OPENED: &str = "ko5: the child holds the reopened project";
const STYLE: &str = r##"{"style_version":1,"layer":{"geometry":"polygon","fill_color":{"literal":"#4285f4"},"fill_opacity":{"literal":0.35},"outline_color":{"literal":"#000000"},"outline_width":{"literal":1.5}}}"##;

/// A host and `Projects` over `dir`'s machine store, with a session store root of their own.
fn run(dir: &Path, sessions: &str) -> (Arc<SkpHost>, Projects) {
    let (catalog, tickets) = (Arc::new(Catalog::new()), StreamRegistry::new());
    let arm = watch_support::no_watch_arm();
    let host = Arc::new(SkpHost::new(catalog, tickets, arm, session_end_channel().0));
    let recorder = Arc::new(StepRecorder::new(dir.join(sessions), host.clone()));
    (host, Projects::new(dir.join("machine"), recorder))
}

/// **K-O5** (Amendment 36 item 5 (j)). The child reopens a saved project and aborts while it holds
/// the lock; this process is refused while the child lives, and its reopen succeeds after the
/// child's exit has been waited for. Each wait is bounded at 60 s.
///
/// RECORDED MUTATION: a `create_new` marker file in place of the lock. Expected failure: the
/// reopen after the crash is refused as open elsewhere.
#[test]
fn the_second_open_refusal_never_outlives_a_crash() {
    if let Ok(dir) = std::env::var(KO5_ENV) {
        let (_host, projects) = run(Path::new(&dir), "child");
        let got = projects.open_project(&Path::new(&dir).join("project"), "k", None, None, false);
        assert!(matches!(got, Ok(Reopen::Opened(_))), "{got:?}");
        println!("{KO5_OPENED}");
        drop(std::io::stdin().read_line(&mut String::new()));
        std::process::abort();
    }
    let dir = std::env::temp_dir()
        .join("spatial-ide-project-lock-tests")
        .join("ko5");
    let _ = std::fs::remove_dir_all(&dir);
    let (folder, data) = (
        dir.join("project"),
        dir.join("project/data/parcels.parquet"),
    );
    std::fs::create_dir_all(data.parent().expect("a parent")).expect("the folders");
    let (features, avg_vertices) = (50, 6);
    let spec = FixtureSpec {
        features,
        avg_vertices,
        ..Default::default()
    };
    write_geoparquet(&data, &spec).expect("fixture");
    let (host, projects) = run(&dir, "first");
    let (skp, path, cancel_key) = (
        SKP_VERSION.to_string(),
        data.display().to_string(),
        "k".into(),
    );
    let (crs_assertion, identity) = (None, None);
    let req = OpenDatasetRequest {
        skp,
        path,
        cancel_key,
        crs_assertion,
        identity,
        set_aside_file_id: false,
    };
    let handle = host.open_dataset(req).expect("open").dataset;
    let ds = host.catalog().get(handle.as_str()).expect("catalog");
    let (identifier, provenance) = (ds.crs().identifier().to_string(), ds.admission());
    let provenance = provenance
        .expect("admitted")
        .crs_provenance
        .as_str()
        .to_string();
    let definition = ds.crs().definition_json().map(|d| sha256_hex(d.as_bytes()));
    let crs = Space {
        identifier,
        provenance,
        definition,
    };
    let style = style::parse(STYLE).expect("a style document");
    let view = View {
        crs,
        centre: [2_600_000.0, 1_200_000.0],
        zoom: 0.0,
    };
    let (filter, clauses) = (None, Vec::new());
    let ws = Workspace {
        filter,
        clauses,
        style,
        view,
    };
    projects
        .save(handle.as_str(), &ds, Some(&folder), ws)
        .expect("saved");
    drop((ds, projects, host));

    let exe = std::env::current_exe().expect("the test binary");
    let mut child = Command::new(exe)
        .args(["--exact", KO5, "--nocapture", "--test-threads=1"])
        .env(KO5_ENV, &dir)
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::null())
        .spawn()
        .expect("the child");
    let stdout = child.stdout.take().expect("the child's stdout");
    let (said, heard) = mpsc::channel();
    std::thread::spawn(move || {
        let mut lines = BufReader::new(stdout).lines().map_while(Result::ok);
        let _ = said.send(lines.any(|l| l.contains(KO5_OPENED)));
    });
    let reported = heard.recv_timeout(Duration::from_secs(60));
    if reported != Ok(true) {
        child.kill().expect("kill the child this test started");
        panic!("the child did not report its reopen within 60 s: {reported:?}");
    }
    let (_host, projects) = run(&dir, "second");
    let got = projects.open_project(&folder, "k", None, None, false);
    assert!(
        matches!(got, Err(OpenFailure::OpenElsewhere(_))),
        "while the child lives: {got:?}"
    );

    drop(child.stdin.take());
    let started = Instant::now();
    while child.try_wait().expect("wait").is_none() {
        if started.elapsed() > Duration::from_secs(60) {
            child.kill().expect("kill the child this test started");
            panic!("the child did not end within 60 s");
        }
        std::thread::sleep(Duration::from_millis(50));
    }
    let got = projects.open_project(&folder, "k", None, None, false);
    assert!(
        matches!(got, Ok(Reopen::Opened(_))),
        "after the child's crash: {got:?}"
    );
}
