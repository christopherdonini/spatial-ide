// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! The tier root is refused by name where it is not declared, and nothing is written.
//!
//! `PORT-2-MACOS-L1-AND-APP-DIRS-PREREGISTRATION.md` section 4, E-L, scenario S3. The tier root is
//! decided by `engine/src/app_dirs.rs`: `LOCALAPPDATA` when it is an absolute path on Windows, and
//! no root anywhere else. This file starts from the real entry point, `build_tiers` on a real
//! `Dataset`, so the seam between `lod::tier_directory` and the boundary is proved from the shape
//! the engine is called in.
//!
//! **Its own test binary, because it sets `LOCALAPPDATA` for the process.** On Windows the variable
//! is relative, which the boundary treats as unset. Elsewhere it is an absolute temporary directory,
//! which a platform without a declared root must never read. Either way the build refuses with
//! `engine.lod_tier_root_unresolved`, and nothing is created under the value, under the working
//! directory, or beside the source.
//!
//! Temporary directories only, removed on drop.

use std::path::{Path, PathBuf};

use spatial_engine::cancel::CancelToken;
use spatial_engine::dataset::Dataset;
use spatial_engine::error::EngineError;
use spatial_engine::fixture::{write_geoparquet, FixtureSpec};
use spatial_engine::lod::{build_tiers, LOD_BUILD_WORKERS_ARM_S, LOD_TIER_ROOT_UNRESOLVED};

/// A fresh directory under the canonical temporary directory, removed when dropped.
struct Scratch(PathBuf);

impl Scratch {
    fn new() -> Self {
        let dir = std::fs::canonicalize(std::env::temp_dir())
            .expect("the temporary directory resolves")
            .join(format!("lod-tier-root-{}", std::process::id()));
        let _ = std::fs::remove_dir_all(&dir);
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

/// Removes a path relative to the working directory, if a faulty build ever creates one.
struct RemoveOnDrop(PathBuf);

impl Drop for RemoveOnDrop {
    fn drop(&mut self) {
        let _ = std::fs::remove_dir_all(&self.0);
    }
}

/// Puts `LOCALAPPDATA` back as it was.
struct RestoreLocalAppData(Option<std::ffi::OsString>);

impl Drop for RestoreLocalAppData {
    fn drop(&mut self) {
        match self.0.take() {
            Some(v) => std::env::set_var("LOCALAPPDATA", v),
            None => std::env::remove_var("LOCALAPPDATA"),
        }
    }
}

#[test]
fn the_tier_root_is_refused_by_name_where_it_is_not_declared_and_nothing_is_written() {
    // RECORDED MUTATION: the_tier_root_is_refused_by_name_where_it_is_not_declared_and_nothing_is_written
    // (M5, `tier_directory` reads `LOCALAPPDATA` directly): the first failing assertion is the refusal
    // identifier check, message `the refusal is the tier root's own, by name`, left
    // `engine.lod_insufficient_disk` and right `engine.lod_tier_root_unresolved`. Observed on Windows
    // (the form's OPEN-2 (a)) at 6c21888e.
    let scratch = Scratch::new();
    let source_path = scratch.path().join("source.parquet");
    write_geoparquet(
        &source_path,
        &FixtureSpec {
            features: 8,
            avg_vertices: 8,
            ..Default::default()
        },
    )
    .expect("write an 8-feature EPSG:2056 source");
    let source = Dataset::open(&source_path).expect("open the source");
    assert!(
        source.crs().identifier().contains("2056"),
        "the source is the EPSG:2056 fixture"
    );

    let working_dir = std::env::current_dir().expect("the working directory");
    let relative = format!("lod-tier-root-relative-{}", std::process::id());
    let local_app_data = scratch.path().join("localappdata");
    let _relative_cleanup = RemoveOnDrop(working_dir.join(&relative));

    // Windows: a relative value, which is treated as unset. Elsewhere: an absolute value, which a
    // platform with no declared tier root must not read.
    let value: PathBuf = if cfg!(windows) {
        PathBuf::from(&relative)
    } else {
        std::fs::create_dir_all(&local_app_data).expect("create the absolute value");
        local_app_data.clone()
    };
    let _restore = RestoreLocalAppData(std::env::var_os("LOCALAPPDATA"));
    std::env::set_var("LOCALAPPDATA", &value);

    let outcome = build_tiers(&source, LOD_BUILD_WORKERS_ARM_S, &CancelToken::new(), None);
    match outcome {
        Err(EngineError::LodRefused { refusal, detail }) => {
            assert_eq!(
                refusal, LOD_TIER_ROOT_UNRESOLVED,
                "the refusal is the tier root's own, by name: {detail}"
            );
            let reason = if cfg!(windows) {
                "LOCALAPPDATA is not set, or is not an absolute path"
            } else {
                "no tier root is declared on this platform yet"
            };
            assert!(
                detail.contains(reason),
                "the refusal states the engine fact for this platform: {detail}"
            );
            assert!(
                detail.contains("never written beside its source"),
                "the refusal keeps its no-fallback sentence: {detail}"
            );
        }
        other => panic!("the tier root must be refused by name, got {other:?}"),
    }

    // Nothing was created: not under the value, not under the working directory, not beside the
    // source.
    assert!(
        !working_dir.join(&relative).exists(),
        "a relative value must never be resolved against the working directory"
    );
    assert!(
        !working_dir.join("spatial-ide").exists(),
        "no tier root was made under the working directory"
    );
    if !cfg!(windows) {
        let under_value: Vec<_> = std::fs::read_dir(&local_app_data)
            .expect("read the value")
            .map(|e| e.expect("entry").file_name())
            .collect();
        assert!(
            under_value.is_empty(),
            "nothing may be created under LOCALAPPDATA off Windows: {under_value:?}"
        );
    }
    let mut beside_source: Vec<_> = std::fs::read_dir(scratch.path())
        .expect("read the source directory")
        .map(|e| e.expect("entry").file_name().to_string_lossy().to_string())
        .filter(|name| name != "localappdata")
        .collect();
    beside_source.sort();
    assert_eq!(
        beside_source,
        vec!["source.parquet".to_string()],
        "a tier is never written beside its source"
    );
}
