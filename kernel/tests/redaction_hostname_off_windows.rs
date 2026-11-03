// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! The machine's own name reaches an audit record's `residual_classes` on Linux when no
//! `HOSTNAME` is exported (`redaction::MachineIdentifiers::from_environment`'s file fallback).
//!
//! The test runs itself again as a child process whose environment has neither `HOSTNAME` nor
//! `COMPUTERNAME` and an absolute `SPATIAL_IDE_AUDIT_LOG`, so no variable is set in this process.
//! The child writes two intent records through `AuditLog::open_for` and `append_intent`: a control
//! that does not carry the name, and one that does, in `source_name` (not `principal_name`, which
//! would be attributed). The oracle is `uname -n`, a separate path to the same kernel name.

use std::path::PathBuf;
use std::process::Command;

use spatial_kernel::permission::audit::IntentRecord;
use spatial_kernel::permission::{AuditLog, AUDIT_LOG_ENV};

const TEST: &str = "an_audit_record_names_machine_identifier_on_linux_without_an_exported_hostname";
const CHILD_ENV: &str = "SPATIAL_IDE_RHOW_CHILD";

fn intent(attempt: &str, source_name: &str) -> IntentRecord {
    IntentRecord {
        attempt: attempt.into(),
        at: "2026-11-03T00:00:00Z".into(),
        operation: "publish-static-bundle",
        class: 3,
        reversibility: "irreversible",
        principal_kind: "os-user",
        principal_name: "test-operator".into(),
        source_name: source_name.into(),
        source_content_hash: "sha256:aa".into(),
        destination: "<user-home>/out".into(),
        style_hash: "sha256:bb".into(),
    }
}

/// The classes a written record line lists in `residual_classes`.
fn residual_classes(line: &str) -> Vec<String> {
    let v: serde_json::Value = serde_json::from_str(line).expect("a record line is JSON");
    v["residual_classes"]
        .as_array()
        .expect("residual_classes is a list")
        .iter()
        .map(|c| c.as_str().expect("a class is a string").to_string())
        .collect()
}

/// The child: write the control record and the named record, then check both lines read back.
fn child(dest: PathBuf) {
    let out = Command::new("uname").arg("-n").output().expect("uname -n");
    let name = String::from_utf8(out.stdout)
        .expect("uname -n is text")
        .trim()
        .to_string();
    assert!(
        name.len() >= 3,
        "the machine's name {name:?} is under 3 bytes, so the scan's floor ignores it and this test proves nothing here"
    );

    let log = AuditLog::open_for(&dest).expect("open the audit log");
    log.append_intent(&intent("rhow-control-0000", "parcels"))
        .expect("append the control record");
    log.append_intent(&intent("rhow-named-0000", &name))
        .expect("append the named record");

    let text = std::fs::read_to_string(log.path()).expect("read the audit log back");
    let lines: Vec<&str> = text.lines().collect();
    assert_eq!(lines.len(), 2, "the log holds exactly the two records");
    assert!(
        !lines[0]
            .to_ascii_lowercase()
            .contains(&name.to_ascii_lowercase()),
        "the control record carries the machine's name {name:?}, so it cannot be a control"
    );
    assert!(
        !residual_classes(lines[0]).contains(&"machine-identifier".to_string()),
        "the control record lists machine-identifier without carrying the name"
    );
    assert!(
        residual_classes(lines[1]).contains(&"machine-identifier".to_string()),
        "the record carrying the uname -n name {name:?} does not list machine-identifier in residual_classes"
    );
}

/// The audit log names the machine's identifier on Linux with `HOSTNAME` not exported.
#[test]
#[cfg_attr(
    not(target_os = "linux"),
    ignore = "boundary: machine identity (os_hostname in kernel/src/bundle/redaction.rs)"
)]
fn an_audit_record_names_machine_identifier_on_linux_without_an_exported_hostname() {
    if let Ok(dest) = std::env::var(CHILD_ENV) {
        child(PathBuf::from(dest));
        return;
    }
    let dir = std::env::temp_dir()
        .join("spatial-kernel-rhow-tests")
        .join("child");
    let _ = std::fs::remove_dir_all(&dir);
    std::fs::create_dir_all(&dir).expect("scratch folder");
    let log = dir.join("audit.jsonl");
    let dest = dir.join("out");

    let exe = std::env::current_exe().expect("the test binary");
    let out = Command::new(exe)
        .args(["--exact", TEST, "--nocapture", "--test-threads=1"])
        .env(CHILD_ENV, &dest)
        .env(AUDIT_LOG_ENV, &log)
        .env_remove("HOSTNAME")
        .env_remove("COMPUTERNAME")
        .output()
        .expect("the child");
    assert!(
        out.status.success(),
        "the child exited with {:?}; its stderr:\n{}",
        out.status,
        String::from_utf8_lossy(&out.stderr)
    );
}
