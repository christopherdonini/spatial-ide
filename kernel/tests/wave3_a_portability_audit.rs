// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! Wave-3 A evidence: reproducers for the portability audit (lens:
//! `state/directives/PORTABILITY-2026-09-30.md`, R1 and R4), written at baseline
//! a02354677d6c03aaed4b2dbdf4d14b09621d5766.
//!
//! **Every test in this file fails at the baseline by design.** Each one asserts the property the
//! code states for itself (or R1's "never silently weakens"), and the failure message is the
//! observation. Test code only; no product source changed.
//!
//! - A3-1: shared path-string logic rewrites `\` to `/` on every platform. On Linux and macOS `\`
//!   is an ordinary filename byte, so two different destinations produce one audit string, and a
//!   viewer asset whose name contains `\` gets through the "contains a backslash" refusal as a
//!   nested path.
//! - A3-2: the redaction scan learns the hostname only from `COMPUTERNAME`/`HOSTNAME`. Windows
//!   always exports the first. On Linux `HOSTNAME` is a bash shell variable that bash does not
//!   export, so the `machine-identifier` class can never be found there.
//! - A3-3: the audit log's non-Windows default takes an empty or relative `XDG_DATA_HOME`
//!   verbatim. The log path then depends on the working directory, which `resolve_log_path` refuses
//!   for the `SPATIAL_IDE_AUDIT_LOG` override.

use std::path::{Path, PathBuf};
use std::process::Command;

use spatial_kernel::bundle::redaction::{scan, MachineIdentifiers};
use spatial_kernel::permission::audit::normalize_destination;
use spatial_kernel::permission::grant::resolve_destination;
use spatial_kernel::publish::ViewerAssets;

fn fresh_dir(name: &str) -> PathBuf {
    let d = std::env::temp_dir()
        .join("spatial-kernel-wave3-a")
        .join(name);
    let _ = std::fs::remove_dir_all(&d);
    std::fs::create_dir_all(&d).unwrap();
    std::fs::canonicalize(&d).unwrap()
}

/// A3-1(a): two real, distinct destinations on a POSIX filesystem record as one string.
///
/// `/…/maps/a\b` (one directory named `a\b` under `maps`) and `/…/maps/a/b` (`b` under `a`) are
/// different places on Linux. `normalize_destination` (normalize.rs:72) replaces every `\` with `/`
/// on all platforms, so the audit record cannot tell them apart. The component-case rule in the
/// same file (`component_eq`) refuses to merge two spellings on Linux for exactly this reason.
#[cfg_attr(
    windows,
    ignore = "on Windows `\\` is a separator, so the rewrite is correct there; the defect is POSIX-only"
)]
#[test]
fn a3_1a_two_distinct_posix_destinations_do_not_normalize_to_one_audit_string() {
    let root = fresh_dir("a3-1a");
    let maps = root.join("maps");
    // The parent of each destination must exist for `resolve_destination`: `maps` and `maps/a`.
    std::fs::create_dir_all(maps.join("a")).unwrap();

    let with_backslash = resolve_destination(&maps.join("a\\b")).expect("parent `maps` exists");
    let nested = resolve_destination(&maps.join("a").join("b")).expect("parent `maps/a` exists");
    assert_ne!(
        with_backslash, nested,
        "precondition: these are two different destinations"
    );

    let recorded_1 = normalize_destination(&with_backslash);
    let recorded_2 = normalize_destination(&nested);
    assert_ne!(
        recorded_1, recorded_2,
        "two distinct destinations are recorded as the same audit string `{recorded_1}`"
    );
}

/// A3-1(b): the viewer-asset walk turns a POSIX file name containing `\` into a nested bundle path
/// (viewer_assets.rs:127), so `validate_relative_path`'s "contains a backslash" refusal
/// (viewer_assets.rs:189) never sees the backslash. On Windows no file name can contain one.
#[cfg_attr(
    windows,
    ignore = "no Windows file name can contain `\\`; the defect is POSIX-only"
)]
#[test]
fn a3_1b_a_viewer_asset_named_with_a_backslash_is_refused_not_renamed() {
    let dir = fresh_dir("a3-1b");
    std::fs::write(dir.join("index.html"), b"<!doctype html>").unwrap();
    std::fs::write(dir.join("a\\b.js"), b"// asset").unwrap();

    match ViewerAssets::from_dir(&dir) {
        Err(e) => {
            let text = format!("{e:?}");
            assert!(
                text.contains("backslash"),
                "refused, but not for the backslash: {text}"
            );
        }
        Ok(assets) => {
            let paths: Vec<&str> = assets.iter().map(|a| a.path.as_str()).collect();
            panic!(
                "the file `a\\b.js` was admitted and renamed; the published paths are {paths:?}"
            );
        }
    }
}

const A3_2_CHILD: &str = "SPATIAL_WAVE3_A3_2_CHILD";

/// A3-2: with no `HOSTNAME` in the environment, the scan knows no hostname, although the operating
/// system reports one.
///
/// The test runs itself again as a child without `HOSTNAME`, because that is how a desktop-launched
/// process starts on Linux: bash sets `HOSTNAME` as a shell variable and does not export it, and
/// zsh does not set it at all. (Observed in this container: the shell prints `$HOSTNAME`, and
/// `env` lists no `HOSTNAME`.) The audit log's `classify` (log.rs:245-251) calls this same `scan`
/// with `MachineIdentifiers::from_environment()`, so `machine-identifier` can never reach
/// `residual_classes` there.
///
/// The scan ignores hostnames shorter than three bytes. The wave-3 container's hostname is two
/// bytes (`vm`), so the recorded run gave the test a longer one in a private UTS namespace:
/// `unshare --uts sh -c 'hostname wave3-probe-host && cargo test -p spatial-kernel --test
/// wave3_a_portability_audit'`. Control: the child alone with `HOSTNAME=wave3-probe-host` exported
/// passes.
#[cfg_attr(
    not(target_os = "linux"),
    ignore = "reads the kernel hostname from /proc; macOS is code-path-only"
)]
#[test]
fn a3_2_the_scan_finds_the_machine_hostname_without_an_exported_hostname_variable() {
    if std::env::var_os(A3_2_CHILD).is_some() {
        let host = std::fs::read_to_string("/proc/sys/kernel/hostname").unwrap();
        let host = host.trim().to_string();
        assert!(
            host.len() >= 3,
            "precondition: the scan ignores hostnames shorter than 3 bytes"
        );

        let machine = MachineIdentifiers::from_environment();
        let line = format!("{{\"destination\":\"/srv/{host}/parcels-bundle\"}}");
        let found = scan("audit-record", line.as_bytes(), &machine);
        assert!(
            found.iter().any(|f| f.class == "machine-identifier"),
            "the OS reports a hostname, but from_environment() knows {:?} and the scan found {:?}",
            machine.hostnames,
            found.iter().map(|f| f.class).collect::<Vec<_>>()
        );
        return;
    }
    let out = Command::new(std::env::current_exe().unwrap())
        .args([
            "--exact",
            "a3_2_the_scan_finds_the_machine_hostname_without_an_exported_hostname_variable",
            "--nocapture",
            "--test-threads=1",
        ])
        .env(A3_2_CHILD, "1")
        .env_remove("HOSTNAME")
        .output()
        .unwrap();
    assert!(
        out.status.success(),
        "child without HOSTNAME failed:\n{}\n{}",
        String::from_utf8_lossy(&out.stdout),
        String::from_utf8_lossy(&out.stderr)
    );
}

/// A3-3: an empty or relative `XDG_DATA_HOME` makes the audit log's path relative to the working
/// directory.
///
/// `resolve_log_path` (log.rs:336-356) refuses a relative `SPATIAL_IDE_AUDIT_LOG`, because "a relative
/// one would put the audit log wherever the process happened to be started". It is documented as
/// "the one spelling" that `AuditLog::open_for` (log.rs:122) and `--audit-show` share. On
/// non-Windows, `data_dir` (log.rs:371-376) takes `XDG_DATA_HOME` verbatim. The XDG Base Directory
/// specification says to treat an empty value as unset and to ignore a relative one. Driven through
/// the shipped `publish-bundle --audit-show`, whose first line prints the resolved path.
#[cfg_attr(
    windows,
    ignore = "exercises data_dir's non-Windows arm (application-directory boundary)"
)]
#[test]
fn a3_3_an_empty_or_relative_xdg_data_home_never_yields_a_working_directory_relative_log() {
    let home = fresh_dir("a3-3-home");
    let cwd = fresh_dir("a3-3-cwd");
    for xdg in ["", "relative-data"] {
        let out = Command::new(env!("CARGO_BIN_EXE_publish-bundle"))
            .arg("--audit-show")
            .env_clear()
            .env("HOME", &home)
            .env("XDG_DATA_HOME", xdg)
            .current_dir(&cwd)
            .output()
            .unwrap();
        let stdout = String::from_utf8_lossy(&out.stdout).to_string();
        let first = stdout.lines().next().unwrap_or("").to_string();
        let path = first
            .strip_prefix("no audit log at ")
            .and_then(|r| r.split(" -- ").next())
            .or_else(|| {
                first
                    .strip_prefix("[audit log: ")
                    .and_then(|r| r.strip_suffix(']'))
            })
            .unwrap_or_else(|| {
                panic!(
                    "unexpected first line: {first:?}; stderr: {}",
                    String::from_utf8_lossy(&out.stderr)
                )
            });
        assert!(
            Path::new(path).is_absolute(),
            "XDG_DATA_HOME={xdg:?}: the audit log resolves to the working-directory-relative path \
             `{path}` (process started in a temporary directory)"
        );
    }
}
