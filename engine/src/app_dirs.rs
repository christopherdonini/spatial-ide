// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! The application-directory boundary: where this program keeps per-user data on each platform.
//!
//! PORT-2-MACOS-L1-AND-APP-DIRS-PREREGISTRATION.md section 2 item 2 declares the table below, and
//! this is the only file in the workspace that decides it. The kernel's audit-log location
//! (`kernel/src/permission/audit/log.rs`, `data_dir`) and the engine's tier root
//! (`lod::tier_directory`) both call in here, so the platform rule has one home.
//!
//! | | Windows | macOS | Linux and other Unix | Other |
//! |---|---|---|---|---|
//! | data directory | `LOCALAPPDATA` | `HOME/Library/Application Support` | `XDG_DATA_HOME`, else `HOME/.local/share` | none |
//! | tier root | `LOCALAPPDATA` | none | none | none |
//!
//! **A value counts only when it is non-empty and an absolute path.** An empty or relative value is
//! treated as unset. Nothing here ever resolves against the working directory: a log or a cache
//! that lands wherever the process happened to start is not a per-user location. A variable the
//! table does not name for a platform is never read for it, so `XDG_DATA_HOME` is ignored on macOS
//! and Windows, and `LOCALAPPDATA` is ignored off Windows.
//!
//! The tier root is unavailable off Windows because no tier root is declared there yet
//! (`engine/LOD-PREREGISTRATION.md` Amendment 8 (a)); the typed refusal names that, and no
//! fallback directory is chosen here.
//!
//! No `dirs` or `directories` crate: that would be a new dependency, and the rule is four variables.
//!
//! The pure core ([`data_dir_for`], [`tier_root_for`]) takes the platform and a variable lookup, so
//! every row of the table is testable on any host. The shipped entries ([`user_data_dir`],
//! [`tier_cache_dir`]) bind the host's platform and the process environment.

use std::ffi::OsString;
use std::path::PathBuf;

/// The platform families the table distinguishes.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub(crate) enum Os {
    Windows,
    MacOs,
    OtherUnix,
    Other,
}

/// The platform this build runs on. Three cfg sites, in this one expression, and nowhere else.
pub(crate) const CURRENT: Os = if cfg!(windows) {
    Os::Windows
} else if cfg!(target_os = "macos") {
    Os::MacOs
} else if cfg!(unix) {
    Os::OtherUnix
} else {
    Os::Other
};

/// Where macOS keeps per-user application data, below `HOME`.
const MACOS_DATA_SUBDIR: &str = "Library/Application Support";

/// Where the XDG base-directory rule puts user data when `XDG_DATA_HOME` is not usable, below `HOME`.
const XDG_DATA_DEFAULT_SUBDIR: &str = ".local/share";

/// Why the tier root is unresolved on Windows: the one variable it reads is unusable.
pub(crate) const TIER_ROOT_REASON_WINDOWS: &str =
    "LOCALAPPDATA is not set, or is not an absolute path";

/// Why the tier root is unresolved on every other platform: none is declared.
pub(crate) const TIER_ROOT_REASON_UNDECLARED: &str =
    "no tier root is declared on this platform yet (engine/LOD-PREREGISTRATION.md Amendment 8 (a))";

/// A variable's value, only when it is non-empty and absolute; otherwise the variable is unset.
fn absolute_value(var: &dyn Fn(&str) -> Option<OsString>, name: &str) -> Option<PathBuf> {
    let value = var(name)?;
    if value.is_empty() {
        return None;
    }
    let path = PathBuf::from(value);
    path.is_absolute().then_some(path)
}

/// The per-user data directory for `os`, from the variables `var` supplies.
pub(crate) fn data_dir_for(os: Os, var: &dyn Fn(&str) -> Option<OsString>) -> Option<PathBuf> {
    match os {
        Os::Windows => absolute_value(var, "LOCALAPPDATA"),
        Os::MacOs => absolute_value(var, "HOME").map(|home| home.join(MACOS_DATA_SUBDIR)),
        Os::OtherUnix => absolute_value(var, "XDG_DATA_HOME")
            .or_else(|| absolute_value(var, "HOME").map(|home| home.join(XDG_DATA_DEFAULT_SUBDIR))),
        Os::Other => None,
    }
}

/// The root the LOD tier cache lives under for `os`, or the reason none can be resolved.
pub(crate) fn tier_root_for(
    os: Os,
    var: &dyn Fn(&str) -> Option<OsString>,
) -> Result<PathBuf, &'static str> {
    match os {
        Os::Windows => absolute_value(var, "LOCALAPPDATA").ok_or(TIER_ROOT_REASON_WINDOWS),
        Os::MacOs | Os::OtherUnix | Os::Other => Err(TIER_ROOT_REASON_UNDECLARED),
    }
}

/// The per-user data directory on this platform, from the process environment.
///
/// `None` when the table resolves nothing: the caller refuses, and never substitutes a directory.
/// Product callers: the kernel's audit-log location, which the session store and the shell's
/// session recorder reach through it.
pub fn user_data_dir() -> Option<PathBuf> {
    data_dir_for(CURRENT, &|name| std::env::var_os(name))
}

/// The tier cache root on this platform, from the process environment.
pub(crate) fn tier_cache_dir() -> Result<PathBuf, &'static str> {
    tier_root_for(CURRENT, &|name| std::env::var_os(name))
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::path::Path;

    const EVERY_OS: [Os; 4] = [Os::Windows, Os::MacOs, Os::OtherUnix, Os::Other];

    fn abs(name: &str) -> PathBuf {
        std::env::temp_dir().join(name)
    }

    /// A lookup that knows exactly these variables.
    fn env_of(pairs: Vec<(&'static str, OsString)>) -> impl Fn(&str) -> Option<OsString> {
        move |name| {
            pairs
                .iter()
                .find(|(k, _)| *k == name)
                .map(|(_, v)| v.clone())
        }
    }

    fn set(name: &'static str, value: &Path) -> (&'static str, OsString) {
        (name, value.as_os_str().to_owned())
    }

    #[test]
    fn the_rule_table_resolves_each_platform_from_its_own_variables() {
        // RECORDED MUTATION: the_rule_table_resolves_each_platform_from_its_own_variables
        // (M1, the macOS arm of `data_dir_for` joins `XDG_DATA_DEFAULT_SUBDIR` instead of
        // `MACOS_DATA_SUBDIR`): the first failing assertion is the macOS-with-all-variables one, message
        // `macOS uses the native location below HOME and ignores XDG_DATA_HOME`, left the `.local/share`
        // spelling and right the `Library/Application Support` spelling. Observed on Windows at 6c21888e.
        let (local, home, xdg) = (abs("p2-local"), abs("p2-home"), abs("p2-xdg"));
        let all = || {
            env_of(vec![
                set("LOCALAPPDATA", &local),
                set("HOME", &home),
                set("XDG_DATA_HOME", &xdg),
            ])
        };

        // Each platform reads its own variable and ignores the others.
        assert_eq!(data_dir_for(Os::Windows, &all()), Some(local.clone()));
        assert_eq!(
            data_dir_for(Os::MacOs, &all()),
            Some(home.join("Library").join("Application Support")),
            "macOS uses the native location below HOME and ignores XDG_DATA_HOME"
        );
        assert_eq!(data_dir_for(Os::OtherUnix, &all()), Some(xdg.clone()));
        assert_eq!(data_dir_for(Os::Other, &all()), None);

        // Linux falls back to HOME when XDG_DATA_HOME is not set.
        let home_only = env_of(vec![set("HOME", &home)]);
        assert_eq!(
            data_dir_for(Os::OtherUnix, &home_only),
            Some(home.join(".local").join("share"))
        );
        assert_eq!(
            data_dir_for(Os::MacOs, &home_only),
            Some(home.join("Library").join("Application Support"))
        );

        // A platform never reads another platform's variable.
        assert_eq!(
            data_dir_for(
                Os::Windows,
                &env_of(vec![set("HOME", &home), set("XDG_DATA_HOME", &xdg)])
            ),
            None
        );
        assert_eq!(
            data_dir_for(
                Os::MacOs,
                &env_of(vec![
                    set("LOCALAPPDATA", &local),
                    set("XDG_DATA_HOME", &xdg)
                ])
            ),
            None
        );
        assert_eq!(
            data_dir_for(Os::OtherUnix, &env_of(vec![set("LOCALAPPDATA", &local)])),
            None
        );
        assert_eq!(data_dir_for(Os::Windows, &env_of(vec![])), None);
    }

    #[test]
    fn an_empty_or_relative_value_is_treated_as_unset_never_as_a_relative_directory() {
        // RECORDED MUTATION: an_empty_or_relative_value_is_treated_as_unset_never_as_a_relative_directory
        // (M2, `absolute_value` drops its `is_absolute` check): the first failing assertion is the
        // Windows one in the second pass of the loop, message `Windows with LOCALAPPDATA = "rel"`, left
        // `Some("rel")` and right `None`; the empty value passes because the empty check stays. Observed
        // on Windows at 6c21888e.
        let home = abs("p2-home");
        for bad in ["", "rel"] {
            let bad_value = |name: &'static str| (name, OsString::from(bad));
            assert_eq!(
                data_dir_for(Os::Windows, &env_of(vec![bad_value("LOCALAPPDATA")])),
                None,
                "Windows with LOCALAPPDATA = {bad:?}"
            );
            assert_eq!(
                data_dir_for(Os::MacOs, &env_of(vec![bad_value("HOME")])),
                None,
                "macOS with HOME = {bad:?}"
            );
            assert_eq!(
                data_dir_for(Os::OtherUnix, &env_of(vec![bad_value("HOME")])),
                None,
                "Linux with HOME = {bad:?} and no XDG_DATA_HOME"
            );
            // A bad XDG_DATA_HOME falls back to HOME, and never becomes the directory itself.
            assert_eq!(
                data_dir_for(
                    Os::OtherUnix,
                    &env_of(vec![bad_value("XDG_DATA_HOME"), set("HOME", &home)])
                ),
                Some(home.join(".local").join("share")),
                "Linux with XDG_DATA_HOME = {bad:?}"
            );
            assert_eq!(
                data_dir_for(
                    Os::OtherUnix,
                    &env_of(vec![bad_value("XDG_DATA_HOME"), bad_value("HOME")])
                ),
                None
            );
            assert_eq!(
                tier_root_for(Os::Windows, &env_of(vec![bad_value("LOCALAPPDATA")])),
                Err(TIER_ROOT_REASON_WINDOWS),
                "the tier root with LOCALAPPDATA = {bad:?}"
            );
        }
    }

    #[test]
    fn the_tier_root_resolves_on_windows_only_and_never_from_localappdata_elsewhere() {
        // RECORDED MUTATION: the_tier_root_resolves_on_windows_only_and_never_from_localappdata_elsewhere
        // (M3, `tier_root_for` reads `LOCALAPPDATA` on every `Os`): the first failing assertion is the
        // loop's one for macOS, message `MacOs must not take a tier root from LOCALAPPDATA`, left an `Ok`
        // holding the temporary directory and right the undeclared-root `Err`. Observed on Windows at 6c21888e.
        let local = abs("p2-local");
        let env = env_of(vec![
            set("LOCALAPPDATA", &local),
            set("HOME", &abs("p2-home")),
        ]);
        assert_eq!(tier_root_for(Os::Windows, &env), Ok(local));
        for os in EVERY_OS.into_iter().filter(|os| *os != Os::Windows) {
            assert_eq!(
                tier_root_for(os, &env),
                Err(TIER_ROOT_REASON_UNDECLARED),
                "{os:?} must not take a tier root from LOCALAPPDATA"
            );
        }
        assert_eq!(
            tier_root_for(Os::Windows, &env_of(vec![])),
            Err(TIER_ROOT_REASON_WINDOWS)
        );
        assert!(TIER_ROOT_REASON_WINDOWS.contains("LOCALAPPDATA"));
        assert!(TIER_ROOT_REASON_UNDECLARED.contains("Amendment 8 (a)"));
    }
}
