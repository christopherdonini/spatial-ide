// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! Destination normalization for the audit record.
//!
//! **The destination is the audit's subject, so it is recorded.** An audit of an irreversible
//! external side effect that did not say *where* would audit nothing. What is removed is the part
//! that is machine provenance rather than subject: the user-profile prefix, the verbatim
//! `\\?\` marker, and a username appearing as a whole path component.
//!
//! `docs/09` names "usernames and machine identifiers" as things that do not belong in artifacts,
//! and ADR-017 §13 applies that to bundles. The audit log is **not** a bundle — it never leaves this
//! machine (see [`super::log`]) — but the same normalization is applied anyway, because the log is
//! the most likely thing to be pasted into an issue, and a rule that only holds for the artifact
//! nobody copies is the wrong way round.
//!
//! ## What this is not
//!
//! Normalization is **component-exact**, and the limit is declared rather than glossed:
//! `D:/christopher-maps/out` is not normalized, because the username is *inside* a longer
//! component and rewriting it would corrupt a real directory name into something that no longer
//! identifies the destination. When that happens the record does not refuse — it carries the path
//! and names `username` in its own `residual_classes`, so the log states its own leakage instead of
//! hiding it.

use std::path::Path;

use crate::bundle::redaction::MachineIdentifiers;

/// The token a matched user-profile root becomes.
const HOME: &str = "<user-home>";
const LOCAL_APPDATA: &str = "<user-local-appdata>";
const APPDATA: &str = "<user-appdata>";
const TEMP: &str = "<temp>";
/// The token a bare username component becomes.
const USER: &str = "<user>";

/// Normalize a **resolved** destination for recording.
///
/// Ordered, and the order matters:
///
/// 1. Strip Windows verbatim prefixes — `\\?\UNC\` → `\\`, `\\?\` → nothing. `\\?\` is itself one
///    of `bundle::redaction`'s `local-filesystem-path` needles, so leaving it would guarantee a
///    finding on every Windows record.
/// 2. `\` → `/`. One spelling, so two records of one destination compare equal and the
///    drive-letter rule sees a single form.
/// 3. **User-profile roots, longest match first**, each to a stable token. Longest-first is
///    load-bearing: `LOCALAPPDATA` and `TEMP` live *under* `USERPROFILE`, and matching the shorter
///    root first would leave `<user-home>/AppData/Local/Temp` where `<temp>` belongs.
/// 4. Any remaining **whole component** equal to a known username becomes `<user>`. Applied after
///    step 3 rather than instead of it, so `C:/Users/x/backup/x/out` loses both occurrences.
pub fn normalize_destination(resolved: &Path) -> String {
    normalize_with(resolved, &roots_from_environment(), &usernames_from_environment())
}

/// The testable core: normalization against supplied roots and usernames rather than the
/// environment's, so a test can drive it with known values instead of depending on who is running
/// it — the same reason `MachineIdentifiers` takes its identifiers rather than discovering them.
pub fn normalize_with(resolved: &Path, roots: &[(String, &'static str)], usernames: &[String]) -> String {
    let raw = resolved.to_string_lossy().to_string();

    // 1 — verbatim prefixes.
    let stripped = if let Some(rest) = raw.strip_prefix(r"\\?\UNC\") {
        format!(r"\\{rest}")
    } else if let Some(rest) = raw.strip_prefix(r"\\?\") {
        rest.to_string()
    } else {
        raw
    };

    // 2 — one separator.
    let mut s = stripped.replace('\\', "/");

    // 3 — profile roots, longest first. `roots_from_environment` sorts; a caller supplying its own
    // gets the same treatment here so the ordering property does not depend on the caller.
    let mut ordered: Vec<&(String, &'static str)> = roots.iter().collect();
    ordered.sort_by_key(|(p, _)| std::cmp::Reverse(p.len()));
    for (root, token) in ordered {
        if let Some(rest) = strip_component_prefix(&s, root) {
            s = format!("{token}{rest}");
            break;
        }
    }

    // 4 — a username standing alone as a path component.
    if !usernames.is_empty() {
        let parts: Vec<String> = s
            .split('/')
            .map(|c| {
                if usernames.iter().any(|u| component_eq(c, u)) {
                    USER.to_string()
                } else {
                    c.to_string()
                }
            })
            .collect();
        s = parts.join("/");
    }

    s
}

/// The user-profile roots this machine declares, already separator-normalized.
///
/// Read from the environment because that is where they are: there is no portable API for "the
/// user's home" in `std`, and a root this cannot read is simply not normalized — a gap in the
/// normalization, never a silent pass. `residual_classes` is what makes such a gap visible.
pub fn roots_from_environment() -> Vec<(String, &'static str)> {
    let mut out: Vec<(String, &'static str)> = Vec::new();
    for (key, token) in [
        ("USERPROFILE", HOME),
        ("HOME", HOME),
        ("LOCALAPPDATA", LOCAL_APPDATA),
        ("APPDATA", APPDATA),
        ("TEMP", TEMP),
        ("TMP", TEMP),
    ] {
        if let Ok(v) = std::env::var(key) {
            let v = v.replace('\\', "/");
            let v = v.trim_end_matches('/').to_string();
            // A root of `/` or `` would match everything and turn normalization into erasure — the
            // same degenerate case `redaction::declared_ranges` guards against with its length
            // floor.
            if v.len() >= 3 && !out.iter().any(|(p, _)| p == &v) {
                out.push((v, token));
            }
        }
    }
    out.sort_by_key(|(p, _)| std::cmp::Reverse(p.len()));
    out
}

fn usernames_from_environment() -> Vec<String> {
    MachineIdentifiers::from_environment().usernames
}

/// `s` with `root` removed, but only when `root` ends at a component boundary.
///
/// The boundary condition is what stops `C:/Users/Christopher2` becoming `<user-home>2`: a prefix
/// match alone is not a path-prefix match.
fn strip_component_prefix(s: &str, root: &str) -> Option<String> {
    if s.len() < root.len() {
        return None;
    }
    let (head, rest) = s.split_at(root.len());
    if !component_eq(head, root) {
        return None;
    }
    if rest.is_empty() || rest.starts_with('/') {
        Some(rest.to_string())
    } else {
        None
    }
}

/// Path-component comparison: case-insensitive on Windows, case-sensitive elsewhere.
///
/// **Platform-specific by construction**, the same reason `publish::error::classify_io` keeps its
/// code tables separate: NTFS is case-insensitive and ext4 is not, and a single rule would be wrong
/// on one of them. On Windows a destination typed `c:/users/...` must normalize identically to
/// `C:/Users/...`; on Linux those are two different directories and collapsing them would rewrite a
/// path into one that does not exist.
fn component_eq(a: &str, b: &str) -> bool {
    #[cfg(windows)]
    {
        a.eq_ignore_ascii_case(b)
    }
    #[cfg(not(windows))]
    {
        a == b
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::path::PathBuf;

    fn roots() -> Vec<(String, &'static str)> {
        vec![
            ("C:/Users/someone".into(), HOME),
            ("C:/Users/someone/AppData/Local".into(), LOCAL_APPDATA),
            ("C:/Users/someone/AppData/Local/Temp".into(), TEMP),
        ]
    }

    fn users() -> Vec<String> {
        vec!["someone".into()]
    }

    fn norm(p: &str) -> String {
        normalize_with(&PathBuf::from(p), &roots(), &users())
    }

    /// The worked example from the design record, end to end.
    #[test]
    fn a_user_profile_destination_becomes_a_token() {
        assert_eq!(norm(r"C:\Users\someone\out"), "<user-home>/out");
        assert_eq!(norm(r"\\?\C:\Users\someone\out"), "<user-home>/out");
    }

    /// Longest match first, or the temp root would be reported as a home-relative path.
    #[test]
    fn the_longest_matching_root_wins() {
        assert_eq!(
            norm(r"C:\Users\someone\AppData\Local\Temp\bundle"),
            "<temp>/bundle"
        );
        assert_eq!(
            norm(r"C:\Users\someone\AppData\Local\Programs\x"),
            "<user-local-appdata>/Programs/x"
        );
    }

    /// A root only matches at a component boundary — the case that would corrupt a real directory.
    #[test]
    fn a_root_that_is_a_string_prefix_but_not_a_path_prefix_does_not_match() {
        assert_eq!(norm(r"C:\Users\someone2\out"), "C:/Users/someone2/out");
    }

    /// A username elsewhere in the path is normalized too — step 3 does not end the job.
    #[test]
    fn a_username_component_after_the_root_is_also_normalized() {
        assert_eq!(norm(r"C:\Users\someone\backup\someone\out"), "<user-home>/backup/<user>/out");
        assert_eq!(norm(r"D:\archive\someone\out"), "D:/archive/<user>/out");
    }

    /// **The declared limit, pinned as a limit.** A username inside a longer component is left
    /// alone, because rewriting it would corrupt a real directory name — and the record says so
    /// through `residual_classes` rather than through this function pretending it did more.
    #[test]
    fn a_username_inside_a_longer_component_is_deliberately_not_normalized() {
        assert_eq!(norm(r"D:\someone-maps\out"), "D:/someone-maps/out");
    }

    #[test]
    fn a_unc_path_keeps_its_share_form() {
        assert_eq!(norm(r"\\?\UNC\server\share\out"), "//server/share/out");
    }

    /// Two spellings of one destination normalize to one string, which is what makes two records
    /// of the same publish comparable.
    #[cfg(windows)]
    #[test]
    fn case_differences_collapse_on_windows() {
        assert_eq!(norm(r"c:\users\SOMEONE\out"), "<user-home>/out");
    }
}
