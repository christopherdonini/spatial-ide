// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **The fixture S's regeneration entry point, on `regenerate_fixture.rs`'s model for G5.** It
//! writes `parcels-145mb.parquet` alone, with no watchdog and no measurement, from
//! `first_batch_factorial.rs`'s `spec_s()`, restated here field for field because that file's spec
//! is private to it. Before the write it reads the free space of the drive the output's folder
//! resolves to, junctions followed, and refuses below twice S's size. It writes to
//! `<name>.partial` and renames it to the output only when the file's full sha256 is S's;
//! otherwise it renames it to `<name>.mismatch` and stops. The hash is the restatement's pin: any
//! change to the copy, to `FixtureSpec`'s defaults or to the writer that moves S's bytes shows as a
//! mismatch. Off Windows the drive is not read and the entry point refuses. `kernel/FIXTURES.md`
//! records S.

mod support;

use std::path::{Component, Path, PathBuf, Prefix};
use std::process::Command;

use spatial_engine::fixture::{write_geoparquet_cancellable, FixtureSpec, LicenseMode};
use spatial_engine::CancelToken;

const OUT_VAR: &str = "SPATIAL_REGEN_OUT";
/// S's recorded size (`kernel/RESULTS.md`) and full sha256 (`import_layout_fixtures.rs`).
const S_BYTES: u64 = 151_629_665;
const S_SHA256: &str = "fe61e704fcc01d40b0e453d81a4987fc23862dcc38d62bd1f9635d124433ac7a";

fn spec_s() -> FixtureSpec {
    FixtureSpec {
        features: 100_000,
        avg_vertices: 100,
        hole_every: 7,
        seed: 0x5EED_2056_0000_0007,
        chunk: 8_192,
        row_group_rows: 8_192,
        license: LicenseMode::DeclaredBySource,
        ..Default::default()
    }
}

fn out_path(raw: &str) -> PathBuf {
    let p = PathBuf::from(raw);
    assert!(p.is_absolute(), "{OUT_VAR} must be absolute: `{raw}`");
    p
}

fn resolved(dir: &Path) -> PathBuf {
    std::fs::canonicalize(dir).expect("resolve the folder")
}

fn drive_of(p: &Path) -> Option<char> {
    match p.components().next() {
        Some(Component::Prefix(pre)) => match pre.kind() {
            Prefix::VerbatimDisk(d) | Prefix::Disk(d) => Some((d as char).to_ascii_uppercase()),
            _ => None,
        },
        _ => None,
    }
}

/// Refuses below `floor` free on the drive `dir` resolves to; returns the free bytes.
fn require_floor(dir: &Path, floor: u64) -> u64 {
    let d = drive_of(dir).unwrap_or_else(|| panic!("no drive in {}: refusing", dir.display()));
    let query = format!("(Get-PSDrive {d}).Free");
    let out = Command::new("powershell")
        .args(["-NoProfile", "-Command", &query])
        .output();
    let out = out.expect("run powershell");
    let free = String::from_utf8_lossy(&out.stdout).trim().parse();
    let free: u64 = free.unwrap_or_else(|_| panic!("cannot read free space on {d}:"));
    assert!(
        free >= floor,
        "{d}: has {free} B free, below the floor of {floor} B"
    );
    free
}

fn regenerate(out: &Path, spec: &FixtureSpec, expected: &str, floor: u64) {
    assert!(!out.exists(), "{} already exists", out.display());
    let dir = out.parent().expect("a folder");
    std::fs::create_dir_all(dir).expect("create the folder");
    let dir = resolved(dir);
    println!(
        "[regenerate] {}: {} B free",
        dir.display(),
        require_floor(&dir, floor)
    );
    let name = out.file_name().unwrap().to_string_lossy();
    let partial = out.with_file_name(format!("{name}.partial"));
    let mismatch = out.with_file_name(format!("{name}.mismatch"));
    write_geoparquet_cancellable(&partial, spec, &CancelToken::new(), None).expect("write");
    let (bytes, sha) = support::file_facts(&partial);
    if sha != expected {
        std::fs::rename(&partial, &mismatch).expect("keep as .mismatch");
        panic!(
            "sha256 mismatch: expected {expected}, got {sha}, kept {}",
            mismatch.display()
        );
    }
    std::fs::rename(&partial, out).expect("rename .partial");
    println!("[regenerate] {bytes} B, sha256 {sha}");
}

fn scratch(test: &str) -> PathBuf {
    let d = std::env::temp_dir().join(format!("fsre-{test}-{}", std::process::id()));
    let _ = std::fs::remove_dir_all(&d);
    std::fs::create_dir_all(&d).expect("create the scratch folder");
    d
}

fn tiny() -> FixtureSpec {
    FixtureSpec {
        features: 1,
        ..spec_s()
    }
}

/// RECORDED MUTATION: M-7, `spec_s()`'s seed `0x5EED_2056_0000_0008`;
/// observed at d505a6054f6d80e4c778623db15b32ee192896a8 (release, into the m7 folder):
/// fails with "sha256 mismatch: expected fe61e704..., got bfe55c91...".
///
/// `SPATIAL_REGEN_OUT=<an absolute path>/parcels-145mb.parquet cargo test --release -p
/// spatial-kernel --test regenerate_fixture_s -- --ignored --exact regenerate_parcels_145mb_fixture
/// --nocapture`
#[ignore = "writes S (151,629,665 B) to the absolute path SPATIAL_REGEN_OUT names; Windows only"]
#[test]
fn regenerate_parcels_145mb_fixture() {
    let raw = std::env::var(OUT_VAR).unwrap_or_else(|_| panic!("set {OUT_VAR} first"));
    regenerate(&out_path(&raw), &spec_s(), S_SHA256, 2 * S_BYTES);
}

/// RECORDED MUTATION: M-1, deleting `regenerate`'s `assert!(!out.exists(), ..)`;
/// observed at d505a6054f6d80e4c778623db15b32ee192896a8 (debug):
/// fails with "panic did not contain expected string", the panic being the sha256 mismatch.
#[test]
#[should_panic(expected = "already exists")]
fn refuses_to_overwrite_an_existing_output_path() {
    let path = scratch("overwrite").join("placeholder.parquet");
    std::fs::write(&path, b"not a real fixture").expect("create the placeholder");
    regenerate(&path, &tiny(), S_SHA256, 0);
}

/// RECORDED MUTATION: M-2, deleting `out_path`'s `assert!(p.is_absolute(), ..)`;
/// observed at d505a6054f6d80e4c778623db15b32ee192896a8 (debug):
/// fails with "test did not panic as expected".
#[test]
#[should_panic(expected = "absolute")]
fn refuses_a_relative_output_path() {
    out_path("target/x/parcels-145mb.parquet");
}

/// RECORDED MUTATION: M-3, `drive_of` returning `Some('C')`;
/// observed at d505a6054f6d80e4c778623db15b32ee192896a8 (debug):
/// fails at its first assertion, left `Some('C')`, right `Some('D')`.
#[cfg(windows)]
#[test]
fn the_drive_is_read_from_the_resolved_path() {
    assert_eq!(drive_of(Path::new(r"\\?\D:\a")), Some('D'));
    assert_eq!(drive_of(Path::new("e:/a")), Some('E'));
    assert_eq!(drive_of(Path::new(r"\\server\share\a")), None);
    assert!(drive_of(&resolved(&std::env::temp_dir())).is_some());
}

/// RECORDED MUTATION: M-4, `resolved` returning the folder as given;
/// observed at d505a6054f6d80e4c778623db15b32ee192896a8 (debug):
/// fails at `assert_eq!(via_link, direct, "the junction resolves to its target")`.
#[cfg(windows)]
#[test]
fn the_volume_read_follows_a_junction() {
    let d = scratch("junction");
    let (target, link) = (d.join("target"), d.join("link"));
    std::fs::create_dir_all(&target).expect("create the target");
    let mut mk = Command::new("cmd");
    mk.args(["/C", "mklink", "/J"]).arg(&link).arg(&target);
    let made = mk.output().expect("run mklink");
    assert!(made.status.success(), "mklink /J failed: {made:?}");
    let (via_link, direct) = (resolved(&link), resolved(&target));
    std::fs::remove_dir(&link).expect("remove the junction itself");
    assert_eq!(via_link, direct, "the junction resolves to its target");
    assert_ne!(via_link, link, "the volume read uses the resolved folder");
}

/// RECORDED MUTATION: M-5, deleting `require_floor`'s floor `assert!`;
/// observed at d505a6054f6d80e4c778623db15b32ee192896a8 (debug):
/// fails with "test did not panic as expected".
#[cfg(windows)]
#[test]
#[should_panic(expected = "below the floor")]
fn refuses_below_the_floor_on_the_outputs_volume() {
    require_floor(&resolved(&scratch("floor")), u64::MAX);
}

/// RECORDED MUTATION: M-6, deleting the `if sha != expected` block;
/// observed at d505a6054f6d80e4c778623db15b32ee192896a8 (debug):
/// fails at `expect_err("S accepted")`, message "S accepted: ()".
#[cfg(windows)]
#[test]
fn a_hash_mismatch_leaves_no_output_and_names_both_hashes() {
    let out = scratch("mismatch").join("parcels-145mb.parquet");
    let partial = out.with_file_name("parcels-145mb.parquet.partial");
    let kept = out.with_file_name("parcels-145mb.parquet.mismatch");
    let run = std::panic::catch_unwind(|| regenerate(&out, &tiny(), S_SHA256, 0));
    let msg = *run.expect_err("S accepted").downcast::<String>().unwrap();
    assert!(!out.exists(), "a mismatch must leave no output");
    assert!(!partial.exists() && kept.exists(), "renamed to .mismatch");
    let (_, actual) = support::file_facts(&kept);
    assert!(
        msg.contains(S_SHA256) && msg.contains(&actual),
        "both hashes: {msg}"
    );
    assert!(msg.contains(".mismatch"), "the kept path is named: {msg}");
}
