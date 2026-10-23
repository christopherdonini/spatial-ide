// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! The audit log's default location, proved through the shipped binary.
//!
//! `PORT-2-MACOS-L1-AND-APP-DIRS-PREREGISTRATION.md` section 4, E-K, scenario S2. The
//! per-user data directory is decided in one place, `spatial_engine::app_dirs`, and the kernel's
//! `data_dir` delegates to it. This file starts from the real consumer: the binary's
//! `--audit-show` mode, with the audit-log override removed, resolves the same path
//! `AuditLog::open_for` would use, so what it prints is the location a publish would write.
//!
//! Each case sets or removes every variable the table could read, so the host's own values never
//! reach the child. Every child runs in an empty working directory of its own, and that directory
//! must still be empty afterwards: a relative or empty value is treated as unset, and nothing is
//! ever resolved against where the process happened to start.
//!
//! Temporary directories only, removed on drop. No user-profile path is read or written.

use std::ffi::OsString;
use std::path::{Path, PathBuf};
use std::process::{Command, Output};
use std::sync::atomic::{AtomicUsize, Ordering};

static NEXT: AtomicUsize = AtomicUsize::new(0);

/// A fresh directory under the canonical temporary directory, removed when dropped.
struct Scratch(PathBuf);

impl Scratch {
    fn new(tag: &str) -> Self {
        let n = NEXT.fetch_add(1, Ordering::SeqCst);
        let dir = std::fs::canonicalize(std::env::temp_dir())
            .expect("the temporary directory resolves")
            .join(format!("app-data-dir-{tag}-{}-{n}", std::process::id()));
        std::fs::create_dir_all(&dir).expect("create the scratch directory");
        Self(dir)
    }

    fn path(&self) -> &Path {
        &self.0
    }
}

impl Drop for Scratch {
    fn drop(&mut self) {
        let _ = std::fs::remove_dir_all(&self.0);
    }
}

/// What a case must show.
enum Expect {
    /// The log resolves under this data directory, and the reader reports it absent.
    Under(PathBuf),
    /// No data directory resolves, and the reader refuses with the existing message.
    NoDataDirectory,
}

struct Case {
    label: &'static str,
    /// Every variable the table could read: `Some` sets it, `None` removes it.
    vars: Vec<(&'static str, Option<OsString>)>,
    expect: Expect,
}

fn value(s: &str) -> Option<OsString> {
    Some(OsString::from(s))
}

fn path_value(p: &Path) -> Option<OsString> {
    Some(p.as_os_str().to_owned())
}

fn audit_show(working_dir: &Path, vars: &[(&'static str, Option<OsString>)]) -> Output {
    let mut command = Command::new(env!("CARGO_BIN_EXE_publish-bundle"));
    command
        .arg("--audit-show")
        .current_dir(working_dir)
        .env_remove(spatial_kernel::permission::AUDIT_LOG_ENV);
    for (name, v) in vars {
        match v {
            Some(v) => command.env(name, v),
            None => command.env_remove(name),
        };
    }
    command.output().expect("run publish-bundle --audit-show")
}

fn cases(a: &Path, b: &Path) -> Vec<Case> {
    if cfg!(windows) {
        let windows = |local: Option<OsString>| {
            vec![
                ("LOCALAPPDATA", local),
                ("XDG_DATA_HOME", path_value(b)),
                ("HOME", path_value(b)),
            ]
        };
        vec![
            Case {
                label: "LOCALAPPDATA absolute, XDG_DATA_HOME set and ignored",
                vars: windows(path_value(a)),
                expect: Expect::Under(a.to_path_buf()),
            },
            Case {
                label: "LOCALAPPDATA relative, XDG_DATA_HOME set and ignored",
                vars: windows(value("relative-data")),
                expect: Expect::NoDataDirectory,
            },
            Case {
                label: "LOCALAPPDATA empty",
                vars: windows(value("")),
                expect: Expect::NoDataDirectory,
            },
        ]
    } else if cfg!(target_os = "macos") {
        let macos = |home: Option<OsString>| {
            vec![
                ("HOME", home),
                ("XDG_DATA_HOME", path_value(b)),
                ("LOCALAPPDATA", path_value(b)),
            ]
        };
        vec![
            Case {
                label: "HOME absolute, XDG_DATA_HOME absolute and ignored",
                vars: macos(path_value(a)),
                expect: Expect::Under(a.join("Library").join("Application Support")),
            },
            Case {
                label: "HOME relative",
                vars: macos(value("relative-home")),
                expect: Expect::NoDataDirectory,
            },
        ]
    } else {
        let unix = |xdg: Option<OsString>, home: Option<OsString>| {
            vec![
                ("XDG_DATA_HOME", xdg),
                ("HOME", home),
                ("LOCALAPPDATA", path_value(b)),
            ]
        };
        let fallback = a.join(".local").join("share");
        vec![
            Case {
                label: "XDG_DATA_HOME unset, HOME absolute",
                vars: unix(None, path_value(a)),
                expect: Expect::Under(fallback.clone()),
            },
            Case {
                label: "XDG_DATA_HOME empty, HOME absolute",
                vars: unix(value(""), path_value(a)),
                expect: Expect::Under(fallback.clone()),
            },
            Case {
                label: "XDG_DATA_HOME relative, HOME absolute",
                vars: unix(value("relative-data"), path_value(a)),
                expect: Expect::Under(fallback),
            },
            Case {
                label: "XDG_DATA_HOME absolute, HOME absolute",
                vars: unix(path_value(b), path_value(a)),
                expect: Expect::Under(b.to_path_buf()),
            },
            Case {
                label: "XDG_DATA_HOME unset, HOME relative",
                vars: unix(None, value("relative-home")),
                expect: Expect::NoDataDirectory,
            },
            Case {
                label: "XDG_DATA_HOME relative, HOME relative",
                vars: unix(value("relative-data"), value("relative-home")),
                expect: Expect::NoDataDirectory,
            },
        ]
    }
}

#[test]
fn the_audit_log_resolves_under_this_platforms_data_directory_and_never_relative_to_the_working_directory(
) {
    let root = Scratch::new("cases");
    let (a, b) = (root.path().join("a"), root.path().join("b"));

    for (index, case) in cases(&a, &b).into_iter().enumerate() {
        let work = Scratch::new(&format!("work{index}"));
        let out = audit_show(work.path(), &case.vars);
        let stdout = String::from_utf8_lossy(&out.stdout).to_string();
        let stderr = String::from_utf8_lossy(&out.stderr).to_string();
        let context = format!(
            "{}\n--- status {} ---\n--- stdout ---\n{stdout}\n--- stderr ---\n{stderr}",
            case.label, out.status
        );

        match &case.expect {
            Expect::Under(data_dir) => {
                let log = data_dir
                    .join("spatial-ide")
                    .join("audit")
                    .join("publish.jsonl");
                assert!(out.status.success(), "{context}");
                let want = format!("no audit log at {} -- ", log.display());
                assert!(
                    stdout.starts_with(&want),
                    "the reader must name {} as the log location: {context}",
                    log.display()
                );
            }
            Expect::NoDataDirectory => {
                assert_eq!(out.status.code(), Some(1), "{context}");
                assert!(
                    stdout.is_empty(),
                    "a refused resolution prints nothing on stdout: {context}"
                );
                assert!(
                    stderr.contains("no per-user data directory could be determined"),
                    "the refusal is the existing no-data-directory message: {context}"
                );
            }
        }

        let left: Vec<_> = std::fs::read_dir(work.path())
            .expect("read the working directory")
            .map(|e| e.expect("entry").file_name())
            .collect();
        assert!(
            left.is_empty(),
            "nothing may be created under the working directory: {left:?}\n{context}"
        );
    }
}
