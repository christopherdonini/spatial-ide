//! The viewer's files, as an **explicit input** to publishing.
//!
//! ## Why the publisher does not go and find them
//!
//! The obvious alternative is to embed a bundled viewer into the binary with `include_bytes!`. It
//! is rejected for two reasons that are not preferences:
//!
//! - `.gitignore` ignores `dist/`, so `include_bytes!` would not compile from a clean checkout, and
//!   un-ignoring one would put a machine-provenance build artifact into a repository whose derived
//!   rule is "version lineage, not data".
//! - `cargo test --workspace` must stay green without Node. Making the kernel's tests depend on a
//!   frontend build would put a toolchain boundary inside the workspace suite.
//!
//! So the assets are passed in. Rust tests hand over a few synthetic bytes; the acceptance run
//! hands over the real built viewer. "Viewer build reproducible" is then discharged by building
//! twice and comparing bytes, which the tester owns.
//!
//! ## Paths are validated, not trusted
//!
//! An unvalidated asset path is a **write-outside-staging primitive**: `../../etc/x` or `C:\\evil`
//! handed to a publisher that joins it onto a staging root writes wherever the caller likes
//! (`docs/09`). Every path here is checked to be relative, `..`-free, drive-letter-free and
//! component-clean **before** anything is written, and the refusal is typed.

use std::path::Path;

use super::PublishError;

/// Viewer assets one bundle may carry. Declared, not discovered (ADR-010 rule 6).
pub const MAX_VIEWER_ASSETS: usize = 64;
/// Bytes any single viewer asset may occupy.
pub const MAX_VIEWER_ASSET_BYTES: u64 = 16 * 1024 * 1024;

/// One file to write under the bundle's `viewer/` directory.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct ViewerAsset {
    /// Relative to `viewer/`, forward slashes. Validated by [`ViewerAssets::new`].
    pub path: String,
    pub bytes: Vec<u8>,
}

/// A validated, deterministically ordered set of viewer assets.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct ViewerAssets {
    assets: Vec<ViewerAsset>,
}

impl ViewerAssets {
    /// Validate and sort. **Sorted by path**, so the manifest's viewer list — and therefore the
    /// manifest's bytes — does not depend on the order a directory walk happened to return.
    pub fn new(mut assets: Vec<ViewerAsset>) -> Result<Self, PublishError> {
        if assets.len() > MAX_VIEWER_ASSETS {
            return Err(PublishError::CeilingExceeded {
                ceiling: "MAX_VIEWER_ASSETS",
                limit: MAX_VIEWER_ASSETS as u64,
                saw: assets.len() as u64,
            });
        }
        for a in &assets {
            validate_relative_path(&a.path)?;
            if a.bytes.len() as u64 > MAX_VIEWER_ASSET_BYTES {
                return Err(PublishError::CeilingExceeded {
                    ceiling: "MAX_VIEWER_ASSET_BYTES",
                    limit: MAX_VIEWER_ASSET_BYTES,
                    saw: a.bytes.len() as u64,
                });
            }
        }
        assets.sort_by(|a, b| a.path.cmp(&b.path));
        for pair in assets.windows(2) {
            if pair[0].path == pair[1].path {
                return Err(PublishError::ViewerAssetPathRejected {
                    path: pair[0].path.clone(),
                    detail: "named twice".into(),
                });
            }
        }
        Ok(Self { assets })
    }

    /// Read every file under `dir`, recursively, keeping paths relative to it.
    pub fn from_dir(dir: &Path) -> Result<Self, PublishError> {
        let mut out = Vec::new();
        let mut stack = vec![dir.to_path_buf()];
        while let Some(d) = stack.pop() {
            let entries = std::fs::read_dir(&d).map_err(|e| PublishError::Io {
                context: format!("read viewer asset directory {}", d.display()),
                raw_os_error: e.raw_os_error(),
                detail: e.to_string(),
            })?;
            for entry in entries {
                let entry = entry.map_err(|e| PublishError::Io {
                    context: "read viewer asset directory entry".into(),
                    raw_os_error: e.raw_os_error(),
                    detail: e.to_string(),
                })?;
                let path = entry.path();
                // **A symlink is not followed and not published.** Following one would let a link
                // inside the asset directory pull in a file from anywhere on the machine, which is
                // the same write-outside primitive read backwards.
                let meta = std::fs::symlink_metadata(&path).map_err(|e| PublishError::Io {
                    context: format!("stat {}", path.display()),
                    raw_os_error: e.raw_os_error(),
                    detail: e.to_string(),
                })?;
                if meta.file_type().is_symlink() {
                    return Err(PublishError::ViewerAssetPathRejected {
                        path: path.to_string_lossy().to_string(),
                        detail: "is a symlink; viewer assets are read as files, never followed"
                            .into(),
                    });
                }
                if meta.is_dir() {
                    stack.push(path);
                    continue;
                }
                let rel = path
                    .strip_prefix(dir)
                    .map_err(|_| PublishError::ViewerAssetPathRejected {
                        path: path.to_string_lossy().to_string(),
                        detail: "is not under the viewer asset directory".into(),
                    })?
                    .to_string_lossy()
                    .replace('\\', "/");
                let bytes = std::fs::read(&path).map_err(|e| PublishError::Io {
                    context: format!("read {}", path.display()),
                    raw_os_error: e.raw_os_error(),
                    detail: e.to_string(),
                })?;
                out.push(ViewerAsset { path: rel, bytes });
            }
        }
        if out.is_empty() {
            return Err(PublishError::ViewerAssetPathRejected {
                path: dir.to_string_lossy().to_string(),
                detail: "holds no files; a bundle without a viewer is not self-contained".into(),
            });
        }
        Self::new(out)
    }

    pub fn iter(&self) -> impl Iterator<Item = &ViewerAsset> {
        self.assets.iter()
    }

    pub fn len(&self) -> usize {
        self.assets.len()
    }

    pub fn is_empty(&self) -> bool {
        self.assets.is_empty()
    }
}

/// The path rules, in one place so the refusal and the reason stay together.
pub(crate) fn validate_relative_path(path: &str) -> Result<(), PublishError> {
    let reject = |detail: &str| {
        Err(PublishError::ViewerAssetPathRejected {
            path: path.to_string(),
            detail: detail.to_string(),
        })
    };
    if path.is_empty() {
        return reject("is empty");
    }
    if path.contains('\\') {
        return reject("contains a backslash; bundle paths use forward slashes only");
    }
    if path.starts_with('/') {
        return reject("is absolute");
    }
    if path.len() >= 2 && path.as_bytes()[1] == b':' {
        return reject("names a drive letter");
    }
    if path.ends_with('/') {
        return reject("names a directory rather than a file");
    }
    for component in path.split('/') {
        match component {
            "" => return reject("has an empty path component"),
            "." | ".." => return reject("contains a `.` or `..` component"),
            _ => {}
        }
        if component.chars().any(|c| c.is_control()) {
            return reject("contains a control character");
        }
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn traversal_and_absolute_paths_are_refused_before_anything_is_written() {
        // Each of these, joined onto a staging root, writes outside it.
        for bad in [
            "../escape.js",
            "a/../../escape.js",
            "/etc/passwd",
            "C:/evil.js",
            "C:\\evil.js",
            "sub\\file.js",
            "",
            "a//b.js",
            "dir/",
        ] {
            assert!(
                validate_relative_path(bad).is_err(),
                "`{bad}` must be refused as a viewer asset path"
            );
        }
        for good in ["index.html", "app.js", "assets/app.js", "a/b/c.css"] {
            assert!(validate_relative_path(good).is_ok(), "`{good}` should be admissible");
        }
    }

    #[test]
    fn assets_are_sorted_so_the_manifest_does_not_depend_on_directory_order() {
        let a = ViewerAssets::new(vec![
            ViewerAsset { path: "z.js".into(), bytes: vec![1] },
            ViewerAsset { path: "a.html".into(), bytes: vec![2] },
        ])
        .unwrap();
        let b = ViewerAssets::new(vec![
            ViewerAsset { path: "a.html".into(), bytes: vec![2] },
            ViewerAsset { path: "z.js".into(), bytes: vec![1] },
        ])
        .unwrap();
        assert_eq!(a, b, "two orders of the same assets must produce the same bundle");
        assert_eq!(a.iter().next().unwrap().path, "a.html");
    }

    #[test]
    fn a_duplicate_asset_path_is_refused_rather_than_last_one_wins() {
        let e = ViewerAssets::new(vec![
            ViewerAsset { path: "app.js".into(), bytes: vec![1] },
            ViewerAsset { path: "app.js".into(), bytes: vec![2] },
        ]);
        assert!(matches!(e, Err(PublishError::ViewerAssetPathRejected { .. })));
    }
}
