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
/// 2. Each character this platform's path syntax calls a separator → `/` (`std::path::is_separator`:
///    `\` and `/` on Windows, `/` alone elsewhere, where `\` is a byte of a file name). One
///    spelling, so two records of one destination compare equal and the drive-letter rule sees a
///    single form.
/// 3. **User-profile roots, longest match first**, each to a stable token. Longest-first is
///    load-bearing: `LOCALAPPDATA` and `TEMP` live *under* `USERPROFILE`, and matching the shorter
///    root first would leave `<user-home>/AppData/Local/Temp` where `<temp>` belongs.
/// 4. Any remaining **whole component** equal to a known username becomes `<user>`. Applied after
///    step 3 rather than instead of it, so `C:/Users/x/backup/x/out` loses both occurrences.
pub fn normalize_destination(resolved: &Path) -> String {
    normalize_with(
        resolved,
        &roots_from_environment(),
        &usernames_from_environment(),
    )
}

/// The testable core: normalization against supplied roots and usernames rather than the
/// environment's, so a test can drive it with known values instead of depending on who is running
/// it — the same reason `MachineIdentifiers` takes its identifiers rather than discovering them.
pub fn normalize_with(
    resolved: &Path,
    roots: &[(String, &'static str)],
    usernames: &[String],
) -> String {
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
    let mut s = to_slashes(&stripped);

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
    roots_from(|key| std::env::var(key).ok())
}

/// The roots a lookup declares: `roots_from_environment` with the environment passed in.
fn roots_from(lookup: impl Fn(&str) -> Option<String>) -> Vec<(String, &'static str)> {
    let mut out: Vec<(String, &'static str)> = Vec::new();
    for (key, token) in [
        ("USERPROFILE", HOME),
        ("HOME", HOME),
        ("LOCALAPPDATA", LOCAL_APPDATA),
        ("APPDATA", APPDATA),
        ("TEMP", TEMP),
        ("TMP", TEMP),
        // `TMPDIR` is the variable `std::env::temp_dir()` itself reads on Unix, so leaving it out
        // meant the one temp root that actually gets used there was normalized by nothing.
        ("TMPDIR", TEMP),
    ] {
        if let Some(v) = lookup(key) {
            let v = to_slashes(&v);
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

/// `s` with each separator character of this platform's path syntax written as `/`.
fn to_slashes(s: &str) -> String {
    s.chars()
        .map(|c| if std::path::is_separator(c) { '/' } else { c })
        .collect()
}

fn usernames_from_environment() -> Vec<String> {
    MachineIdentifiers::from_environment().usernames
}

/// `s` with `root` removed, but only when `root` ends at a component boundary.
///
/// The boundary condition is what stops `C:/Users/someone2` becoming `<user-home>2`: a prefix
/// match alone is not a path-prefix match.
///
/// **The split is measured in characters of `s`, not in bytes of `root`, and that is a correctness
/// guard rather than a nicety.** `str::split_at` **panics** off a code-point boundary, `root` (an
/// environment variable) and `s` (a resolved destination) are unrelated strings, and a panic here
/// would take out the intent record and `PublishGrant`'s panic-safe `Debug`. Under `fold` a match
/// can also differ in byte length from `root` (`ⱥ` is 3 bytes, `Ⱥ` is 2). The index is the start of
/// the character after the match, or `s.len()` when `s` has exactly as many characters as `root`,
/// so a destination that is exactly the root matches with an empty rest; a shorter `s` gives `None`.
fn strip_component_prefix(s: &str, root: &str) -> Option<String> {
    let at = s
        .char_indices()
        .map(|(i, _)| i)
        .chain(std::iter::once(s.len()))
        .nth(root.chars().count())?;
    let (head, rest) = s.split_at(at);
    if !component_eq(head, root) {
        return None;
    }
    if rest.is_empty() || rest.starts_with('/') {
        Some(rest.to_string())
    } else {
        None
    }
}

/// Path-component comparison: case-insensitive on Windows (letters outside ASCII included, through
/// [`fold`]), case-sensitive elsewhere.
///
/// **Platform-specific by construction**, the same reason `publish::error::classify_io` keeps its
/// code tables separate: NTFS is case-insensitive and ext4 is not, and a single rule would be wrong
/// on one of them. On Windows a destination typed `c:/users/...` must normalize identically to
/// `C:/Users/...`; on Linux those are two different directories and collapsing them would rewrite a
/// path into one that does not exist.
fn component_eq(a: &str, b: &str) -> bool {
    a.chars().map(fold).eq(b.chars().map(fold))
}

/// One character of a name, folded for the platform's name comparison: the identity off Windows,
/// where names compare exactly, and on Windows NTFS's rule as closely as `std` allows.
///
/// NTFS upcases each UTF-16 unit through the volume's one-to-one table. This takes
/// `char::to_uppercase` where it gives exactly one character and `c` lies in the BMP, else `c`.
/// **It departs from NTFS in three declared ways.** (i) `std`'s Unicode version can fold letters an
/// older volume table does not (Georgian Mkhedruli): over-normalization, a false refusal in
/// `is_inside`. (ii) About 27 Greek letters with iota subscript (U+1F80-U+1FAF, U+1FB3, U+1FC3,
/// U+1FF3) have a two-character full uppercase and stay unfolded: a narrow residual in the leak
/// direction. (iii) `ı` and `ſ` fold to `I` and `S`, which Windows' table may not do.
pub(crate) fn fold(c: char) -> char {
    #[cfg(windows)]
    {
        let mut upper = c.to_uppercase();
        match (upper.next(), upper.next()) {
            (Some(u), None) if c.len_utf16() == 1 => u,
            _ => c,
        }
    }
    #[cfg(not(windows))]
    {
        c
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
        // The inputs are spelled with `\`; they are fed in this platform's own separator.
        let p = p.replace('\\', std::path::MAIN_SEPARATOR_STR);
        normalize_with(&PathBuf::from(p), &roots(), &users())
    }

    /// The worked example from the design record, end to end.
    ///
    /// RECORDED MUTATION (observed at 724cb1fbd65952d371c575620f51500b8eccb3fe on Windows: applied,
    /// this test run alone, reverted): `to_slashes` maps only `/`. OBSERVED FAILURE: the first
    /// assertion, left `"C:\\Users\\someone\\out"`, right `"<user-home>/out"`.
    #[cfg_attr(
        not(windows),
        ignore = "boundary: path syntax (std::path::is_separator); the `\\\\?\\` verbatim prefix is Windows-only"
    )]
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
        assert_eq!(
            norm(r"C:\Users\someone\backup\someone\out"),
            "<user-home>/backup/<user>/out"
        );
        assert_eq!(norm(r"D:\archive\someone\out"), "D:/archive/<user>/out");
    }

    /// **The declared limit, pinned as a limit.** A username inside a longer component is left
    /// alone, because rewriting it would corrupt a real directory name — and the record says so
    /// through `residual_classes` rather than through this function pretending it did more.
    #[test]
    fn a_username_inside_a_longer_component_is_deliberately_not_normalized() {
        assert_eq!(norm(r"D:\someone-maps\out"), "D:/someone-maps/out");
    }

    #[cfg_attr(
        not(windows),
        ignore = "boundary: path syntax (std::path::is_separator); the UNC share form is Windows-only"
    )]
    #[test]
    fn a_unc_path_keeps_its_share_form() {
        assert_eq!(norm(r"\\?\UNC\server\share\out"), "//server/share/out");
    }

    /// **A non-ASCII path must not abort the process.**
    ///
    /// `split_at` panics on an index that is not a code-point boundary, and a root read from the
    /// environment has no relationship to the destination being normalized. This used to abort
    /// inside the intent record, inside the unauditable-log refusal, and inside the `Debug` that
    /// exists so a grant can be safely formatted in a panic handler.
    #[test]
    fn a_non_ascii_root_or_destination_normalizes_instead_of_panicking() {
        let roots = vec![
            ("C:/Users/José".to_string(), HOME),
            ("C:/Users/José/AppData/Local/Temp".to_string(), TEMP),
        ];
        let users = vec!["José".to_string()];

        // The root's byte length lands inside a multi-byte character of the destination.
        let n = normalize_with(&PathBuf::from("D:/данные/bundle"), &roots, &users);
        assert_eq!(n, "D:/данные/bundle");

        // …and the matching case still matches, so the guard did not simply disable normalization.
        let n = normalize_with(&PathBuf::from("C:/Users/José/out"), &roots, &users);
        assert_eq!(n, "<user-home>/out");

        // A username component that is itself non-ASCII is substituted as any other would be.
        let n = normalize_with(&PathBuf::from("D:/archive/José/out"), &roots, &users);
        assert_eq!(n, "D:/archive/<user>/out");
    }

    /// **A backslash is a byte of a POSIX file name, and stays one.** `/home/x\b` is one directory
    /// under `/home`, `/home/x/b` is `b` under `x`: two destinations, so two audit strings, and a
    /// profile root holding a backslash is read as it is, or it would stop matching its own path.
    ///
    /// RECORDED MUTATION M1 (observed at a47d8f72fb5ea7b939dbb417e05d8ca2255977a2: applied alone on
    /// the branch, run 41719825618, its ubuntu-24.04 job 126209332158, reverted by
    /// d441774cf05a45bb96d885f68675058de16b216f): step 2 back to `stripped.replace('\\', "/")`.
    /// OBSERVED FAILURE: this test's second assertion, left `"/home/x/b/out"`, right
    /// `"<user-home>/out"`; in its binary 162 passed, 1 failed, and cargo stops at the first failing
    /// binary, so no test that ran before it failed.
    ///
    /// RECORDED MUTATION M2 (observed at cd29f057aeb2b98da60f37ff380de7e947fd529e: applied alone on
    /// the branch, run 41722839219, its ubuntu-24.04 job 126219815352, reverted by
    /// 761ff2132486b6ab92929d1b9e4f6a0f2a3de900): `roots_from` back to `v.replace('\\', "/")`.
    /// OBSERVED FAILURE: this test's first assertion, left `[("/home/x/b", "<user-home>")]`, right
    /// `[("/home/x\\b", "<user-home>")]`; in its binary 162 passed, 1 failed, and cargo stops at the
    /// first failing binary, so no test that ran before it failed. The windows job passed on both.
    #[cfg_attr(
        windows,
        ignore = "boundary: path syntax (std::path::is_separator); on Windows `\\` is a separator, so the rewrite is correct there"
    )]
    #[test]
    fn a_posix_backslash_stays_a_name_byte_in_a_profile_root_and_a_destination() {
        let roots = roots_from(|key| (key == "HOME").then(|| r"/home/x\b".to_string()));
        assert_eq!(roots, vec![(r"/home/x\b".to_string(), HOME)]);
        let n = normalize_with(&PathBuf::from(r"/home/x\b/out"), &roots, &[]);
        assert_eq!(n, "<user-home>/out");
        let n = normalize_with(&PathBuf::from("/home/x/b/out"), &roots, &[]);
        assert_eq!(n, "/home/x/b/out");
    }

    /// Two spellings of one destination normalize to one string, which is what makes two records
    /// of the same publish comparable.
    #[cfg_attr(
        not(windows),
        ignore = "boundary: filesystem case policy (kernel/src/permission/audit/normalize.rs); the case fold is Windows-only"
    )]
    #[test]
    fn case_differences_collapse_on_windows() {
        assert_eq!(norm(r"c:\users\SOMEONE\out"), "<user-home>/out");
    }

    /// NTFS compares names by their upper case, non-ASCII letters included, so a root, a username
    /// and a destination that differ only in such a letter's case are one name.
    ///
    /// RECORDED MUTATION M1 (2026-11-27, observed at f13dbd8722cece19ec1011c19b6564b8f99ba716 on Windows, applied alone, the `permission::audit` tests run, reverted): `fold` is `c.to_ascii_uppercase()`. OBSERVED FAILURE: (a), left "C:/Users/JOSÉ/out", right "<user-home>/out".
    /// RECORDED MUTATION M2 (same date, commit and way): the root strip splits `s` at `root.len()` bytes behind an `is_char_boundary` guard. OBSERVED FAILURE: (c), left "<user-home>/Ⱥtlas/out", right "<user-local-appdata>/out".
    /// RECORDED MUTATION M3 (same date, commit and way): the BMP condition is dropped from `fold`. OBSERVED FAILURE: (d), left "<temp>/out", right "D:/𐐀-maps/out".
    /// RECORDED MUTATION M5 (same date, commit and way): the split index is `s.char_indices().nth(..)` with no `s.len()` after it. OBSERVED FAILURE: (e), left "C:/Users/<user>", right "<user-home>"; (a) to (d) pass.
    #[cfg_attr(
        not(windows),
        ignore = "boundary: filesystem case policy (kernel/src/permission/audit/normalize.rs); the case fold is Windows-only"
    )]
    #[test]
    fn non_ascii_case_differences_collapse_as_ntfs_compares_names_on_windows() {
        let roots = vec![
            ("C:/Users/josé".to_string(), HOME),
            ("C:/Users/josé/ⱥtlas".to_string(), LOCAL_APPDATA),
            ("D:/𐐨-maps".to_string(), TEMP),
        ];
        let users = vec!["josé".to_string()];
        let n = |p: &str| normalize_with(&PathBuf::from(p), &roots, &users);
        assert_eq!(n(r"C:\Users\JOSÉ\out"), "<user-home>/out");
        assert_eq!(n(r"D:\archive\JOSÉ\out"), "D:/archive/<user>/out");
        assert_eq!(n(r"C:\Users\JOSÉ\Ⱥtlas\out"), "<user-local-appdata>/out");
        // A supplementary-plane letter is two UTF-16 units, which NTFS leaves as typed.
        assert_eq!(n(r"D:\𐐀-maps\out"), "D:/𐐀-maps/out");
        // The destination is exactly the root, typed in another case.
        assert_eq!(n(r"C:\Users\JOSÉ"), "<user-home>");
    }

    /// The resolved parent carries the directory's on-disk case and the typed final component
    /// keeps its own, so a username in the other case must still collapse.
    ///
    /// RECORDED MUTATION M1 (2026-11-27, observed at f13dbd8722cece19ec1011c19b6564b8f99ba716 on Windows, applied alone, the `permission::audit` tests run, reverted): `fold` is `c.to_ascii_uppercase()`. OBSERVED FAILURE: the second assertion, "a username in another case leaked: …/JOSÉ/out"; the first assertion passed.
    #[cfg_attr(
        not(windows),
        ignore = "boundary: filesystem case policy (kernel/src/permission/audit/normalize.rs); the case fold is Windows-only"
    )]
    #[test]
    fn the_resolved_parent_keeps_its_on_disk_case_and_a_username_in_another_case_still_collapses_on_windows(
    ) {
        let base =
            std::env::temp_dir().join(format!("spatial-kernel-case-fold-{}", std::process::id()));
        let _ = std::fs::remove_dir_all(&base);
        std::fs::create_dir_all(base.join("JOSÉ")).expect("create the probe directory");
        let resolved =
            crate::permission::grant::resolve_destination(&base.join("josé").join("out"));
        let _ = std::fs::remove_dir_all(&base);
        let resolved = resolved.expect("the typed destination resolves");
        let parent = resolved.parent().and_then(Path::file_name);
        assert_eq!(parent, Some(std::ffi::OsStr::new("JOSÉ")), "{resolved:?}");
        let n = normalize_with(&resolved, &[], &["josé".to_string()]);
        assert!(
            n.ends_with("/<user>/out"),
            "a username in another case leaked: {n}"
        );
    }

    /// A destination that is exactly a root becomes the root's token, on every platform.
    /// RECORDED MUTATION M5 (2026-11-27, observed at f13dbd8722cece19ec1011c19b6564b8f99ba716 on Windows, applied alone, the `permission::audit` tests run, reverted): see T1's record. OBSERVED FAILURE: left "C:/Users/<user>", right "<user-home>".
    #[test]
    fn a_destination_that_is_exactly_a_root_becomes_the_roots_token() {
        let n = normalize_with(&PathBuf::from("C:/Users/someone"), &roots(), &users());
        assert_eq!(n, "<user-home>");
    }
}
