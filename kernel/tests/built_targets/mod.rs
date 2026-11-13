// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **Where a kernel test finds the targets cargo built beside it.**
//!
//! A test binary sits in `<profile>/deps/` on one cargo layout and under
//! `<profile>/build/<package>/<hash>/out/` on another, while the examples and binaries a test
//! runs sit under `<profile>/` on both. So the profile directory is the nearest ancestor of the
//! test binary named for the build's profile, not a fixed number of parents up. Test-only: this
//! module has no test target of its own.

use std::path::PathBuf;

/// The profile directory (`target/debug` or `target/release`) holding the built examples and
/// binaries: the nearest ancestor of the running test binary named for the build's profile.
///
/// RECORDED MUTATION: (pending)
///
/// Panics, naming the test binary's path, when no ancestor has that name.
pub fn profile_dir() -> PathBuf {
    let profile = if cfg!(debug_assertions) {
        "debug"
    } else {
        "release"
    };
    let me = std::env::current_exe().expect("the test binary knows where it is");
    me.ancestors()
        .skip(1)
        .find(|a| a.file_name().and_then(|n| n.to_str()) == Some(profile))
        .unwrap_or_else(|| {
            panic!(
                "no ancestor of the test binary {} is named `{profile}`",
                me.display()
            )
        })
        .to_path_buf()
}

/// The file name of a built executable on this OS.
pub fn exe_name(name: &str) -> String {
    if cfg!(windows) {
        format!("{name}.exe")
    } else {
        name.to_string()
    }
}
