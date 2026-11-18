// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **The resolver at reopen** (`kernel/B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md` §2.5; Amendment 30
//! item 5 (c), T1 to T4): `check_inside` walks a project-relative `at` from the project folder one
//! segment at a time and refuses a link, a missing segment, an intermediate that is not a folder and
//! a final that is not a regular file, each naming the segment; otherwise it returns the engine path.
//! The data files here are a few bytes, not GeoParquet: the check reads no file's contents.
//!
//! A link is a junction on Windows and a symlink elsewhere (§2.9: `cfg` in test code only). T5, the
//! text check before any read, is a unit test in `kernel/src/project/resolver.rs`.

use std::path::{Path, PathBuf};

use spatial_kernel::project::resolver::{check_inside, CheckRefused};

/// A fresh project folder for one test, holding `data/real/parcels.parquet`.
fn project(name: &str) -> PathBuf {
    let folder = std::env::temp_dir()
        .join("spatial-ide-project-resolver-tests")
        .join(name);
    let _ = std::fs::remove_dir_all(&folder);
    std::fs::create_dir_all(folder.join("data/real")).expect("scratch folder");
    std::fs::write(folder.join("data/real/parcels.parquet"), b"PAR1").expect("a data file");
    folder
}

/// A link at `link` to the folder `target`: a junction on Windows, which needs no privilege, and a
/// symlink elsewhere. A copy of `make_link` in `kernel/tests/project_save.rs`, equal in what it does
/// (the advisor's ruling ADV-2026-11-16-18).
fn make_link(link: &Path, target: &Path) {
    #[cfg(windows)]
    {
        // `cmd` reads a `/` in a path as a switch, so both paths are given with `\`.
        let back = |p: &Path| p.display().to_string().replace('/', "\\");
        let made = std::process::Command::new("cmd")
            .args(["/C", "mklink", "/J"])
            .arg(back(link))
            .arg(back(target))
            .output()
            .expect("cmd");
        assert!(made.status.success(), "mklink /J: {made:?}");
    }
    #[cfg(not(windows))]
    std::os::unix::fs::symlink(target, link).expect("symlink");
}

/// A junction is removed with `remove_dir`, a symlink with `remove_file`; neither follows it.
fn remove_link(link: &Path) {
    std::fs::remove_dir(link)
        .or_else(|_| std::fs::remove_file(link))
        .expect("link removed");
}

/// **T1**: `data/alias` is a link to `data/real`, inside the folder. Reached through it as an
/// intermediate, and named as the final, the target is refused as through a link, naming the link.
///
/// MUTATION (Amendment 30 item 5 (c)): the link check skipped.
#[test]
fn check_inside_refuses_a_link_below_the_folder_naming_its_segment() {
    let folder = project("t1");
    let alias = folder.join("data/alias");
    make_link(&alias, &folder.join("data/real"));
    let intermediate = check_inside(&folder, "data/alias/parcels.parquet");
    let last = check_inside(&folder, "data/alias");
    remove_link(&alias);
    let through = CheckRefused::ThroughLink {
        segment: "data/alias".into(),
    };
    assert_eq!(
        intermediate,
        Err(through.clone()),
        "the link as an intermediate"
    );
    assert_eq!(last, Err(through), "the link as the final");
}

/// **T2**: a missing intermediate and a missing final are each refused as unresolvable, naming the
/// first segment that is missing.
///
/// MUTATION (Amendment 30 item 5 (c)): a missing segment treated as a directory.
#[test]
fn check_inside_refuses_a_missing_segment_as_unresolvable() {
    let folder = project("t2");
    assert_eq!(
        check_inside(&folder, "data/gone/parcels.parquet"),
        Err(CheckRefused::Unresolvable {
            segment: "data/gone".into()
        }),
        "a missing intermediate"
    );
    assert_eq!(
        check_inside(&folder, "data/real/gone.parquet"),
        Err(CheckRefused::Unresolvable {
            segment: "data/real/gone.parquet".into()
        }),
        "a missing final"
    );
}

/// **T3**: a regular file used as an intermediate is refused as not a folder, and a folder named as
/// the final is refused as not a regular file, each by name.
///
/// MUTATION (Amendment 30 item 5 (c)): the kind check skipped.
#[test]
fn check_inside_refuses_a_final_that_is_not_a_regular_file_or_an_intermediate_that_is_not_a_folder()
{
    let folder = project("t3");
    assert_eq!(
        check_inside(&folder, "data/real/parcels.parquet/inner.parquet"),
        Err(CheckRefused::NotADirectory {
            segment: "data/real/parcels.parquet".into()
        }),
        "a file as an intermediate"
    );
    assert_eq!(
        check_inside(&folder, "data/real"),
        Err(CheckRefused::NotARegularFile {
            segment: "data/real".into()
        }),
        "a folder as the final"
    );
}

/// **T4**: data reached without a link gives the canonical folder joined with each segment of `at`.
/// The folder is given through `spelled/..`, so only a canonicalized folder can match. On Windows,
/// checked at run time, the path is in the `\\?\` form (H4).
///
/// MUTATION (Amendment 30 item 5 (c)): the folder not canonicalized.
#[test]
fn check_inside_returns_the_engine_path_for_data_reached_without_a_link() {
    let folder = project("t4");
    std::fs::create_dir_all(folder.join("spelled")).expect("a folder to step out of");
    let given = folder.join("spelled").join("..");
    let engine = check_inside(&given, "data/real/parcels.parquet").expect("inside, no link");
    let canonical = std::fs::canonicalize(&folder).expect("the folder");
    assert_eq!(
        engine,
        canonical.join("data").join("real").join("parcels.parquet")
    );
    println!("ran on {}", std::env::consts::OS);
    if std::env::consts::OS == "windows" {
        assert!(engine.to_string_lossy().starts_with(r"\\?\"), "{engine:?}");
    }
}
