// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! A destination typed in another case is recorded in its on-disk case, on a real
//! case-insensitive volume.
//!
//! `PORT-2-MACOS-L1-AND-APP-DIRS-PREREGISTRATION.md` section 4, K1, scenario S4. The kernel folds
//! ASCII case when it compares path components on Windows only. A destination that does not exist
//! yet is resolved by canonicalizing its parent and rejoining the final component
//! (`permission::grant::resolve_destination`), so the case that reaches the audit record is the
//! case the filesystem reports for the parent, whatever case the operator typed. This file proves
//! that on the platforms whose default volumes are case-insensitive, from the real seam:
//! `resolve_destination` into `normalize_with`.
//!
//! The precondition is checked first and fails loudly. If the other-case spelling does not name
//! the directory that was created, the volume is case-sensitive and the test proves nothing.
//! Linux is not exercised: a case-insensitive Linux mount needs privilege or an install, and the
//! ignore reason names that.
//!
//! Temporary directories only, removed on drop.

use std::path::{Path, PathBuf};
use std::sync::atomic::{AtomicUsize, Ordering};

use spatial_kernel::permission::audit::normalize::normalize_with;
use spatial_kernel::permission::grant::resolve_destination;

static NEXT: AtomicUsize = AtomicUsize::new(0);

/// The probe root, removed when dropped.
struct Probe(PathBuf);

impl Drop for Probe {
    fn drop(&mut self) {
        let _ = std::fs::remove_dir_all(&self.0);
    }
}

/// Swaps the case of every ASCII letter, so every component with a letter in it is spelled
/// differently from the spelling that was created.
fn swap_case(s: &str) -> String {
    s.chars()
        .map(|c| {
            if c.is_ascii_uppercase() {
                c.to_ascii_lowercase()
            } else {
                c.to_ascii_uppercase()
            }
        })
        .collect()
}

/// A path as `normalize_with` expects a root: no verbatim prefix, one separator, no trailing one.
fn root_spelling(p: &Path) -> String {
    p.to_string_lossy()
        .trim_start_matches(r"\\?\")
        .replace('\\', "/")
        .trim_end_matches('/')
        .to_string()
}

#[test]
#[cfg_attr(
    not(any(windows, target_os = "macos")),
    ignore = "boundary: filesystem case policy (kernel/src/permission/audit/normalize.rs); a case-insensitive Linux volume is not exercised"
)]
fn on_a_case_insensitive_volume_a_destination_typed_in_another_case_is_recorded_in_its_on_disk_case_under_its_profile_token(
) {
    // RECORDED MUTATION: on_a_case_insensitive_volume_a_destination_typed_in_another_case_is_recorded_in_its_on_disk_case_under_its_profile_token
    // (M6, `resolve_destination` rejoins the typed parent instead of canonicalizing it): the first
    // failing assertion is the final equality, left `<user-home>/iNNER/bundle` and right
    // `<user-home>/Inner/bundle`; the precondition passes. Observed on Windows at
    // 6c21888e. Not observed on macOS: that observation is E3's, and E3 has not run.
    let n = NEXT.fetch_add(1, Ordering::SeqCst);
    let temp =
        std::fs::canonicalize(std::env::temp_dir()).expect("the temporary directory resolves");
    let created_root = format!("Case-Policy-Probe-{}-{n}", std::process::id());
    let probe_root = temp.join(&created_root);
    let probe = Probe(probe_root.clone());
    let inner = probe_root.join("Inner");
    std::fs::create_dir_all(&inner).expect("create the probe directories");

    // The destination, typed with both components' case changed.
    let typed_parent = temp.join(swap_case(&created_root)).join(swap_case("Inner"));
    assert_ne!(
        typed_parent.file_name(),
        inner.file_name(),
        "the typed spelling must differ from the created one"
    );
    assert!(
        typed_parent.exists(),
        "precondition: the other-case spelling must name the directory that was created, which \
         means the volume under the temporary directory is case-insensitive; this one is not, \
         so this run proves nothing about the case policy"
    );
    let typed = typed_parent.join("bundle");

    let resolved = resolve_destination(&typed).expect("the typed destination resolves");
    let recorded = normalize_with(&resolved, &[(root_spelling(&probe.0), "<user-home>")], &[]);
    assert_eq!(
        recorded, "<user-home>/Inner/bundle",
        "the destination must be recorded in its on-disk case under the profile token; resolved: {}",
        resolved.display()
    );
}
