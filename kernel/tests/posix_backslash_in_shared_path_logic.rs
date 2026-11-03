// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! The viewer-asset walk and path syntax. Preregistered at
//! `governance/forms/kernel/POSIX-BACKSLASH-IN-SHARED-PATH-LOGIC-PREREGISTRATION.md`.
//!
//! On POSIX a `\` is a byte of a file name; only what `std::path::is_separator` names is a
//! separator. The walk names a file by its relative path with `/`, and that name meets
//! `validate_relative_path`'s backslash refusal.

use std::path::PathBuf;

use spatial_kernel::publish::ViewerAssets;

fn fresh_dir(name: &str) -> PathBuf {
    let d = std::env::temp_dir()
        .join("spatial-kernel-posix-backslash")
        .join(name);
    let _ = std::fs::remove_dir_all(&d);
    std::fs::create_dir_all(&d).unwrap();
    std::fs::canonicalize(&d).unwrap()
}

/// A3-1(b): a POSIX file name containing `\` must reach `validate_relative_path`'s "contains a
/// backslash" refusal (via `ViewerAssets::from_dir`'s walk and `ViewerAssets::new`), not be turned
/// into a nested bundle path first. On Windows no file name can contain one.
#[cfg_attr(
    windows,
    ignore = "boundary: path syntax (std::path::is_separator); no Windows file name can contain `\\`; the defect is POSIX-only"
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

/// A nested asset is named with `/` on every platform: the walk's mapping keeps what the platform
/// calls a separator becoming `/`, so Windows' `assets\app.js` is `assets/app.js` and
/// `validate_relative_path` admits it.
#[test]
fn a_nested_viewer_asset_is_named_with_forward_slashes_on_every_platform() {
    let dir = fresh_dir("nested");
    std::fs::write(dir.join("index.html"), b"<!doctype html>").unwrap();
    std::fs::create_dir_all(dir.join("assets")).unwrap();
    std::fs::write(dir.join("assets").join("app.js"), b"// asset").unwrap();

    let assets = ViewerAssets::from_dir(&dir).expect("a nested asset is admitted");
    let paths: Vec<&str> = assets.iter().map(|a| a.path.as_str()).collect();
    assert_eq!(paths, ["assets/app.js", "index.html"]);
}
