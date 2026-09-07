// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! ADR-020 Amendment 1 — the data-plane's `expected_origin` (`DataPlaneConfig::expected_origin`,
//! `Session::with_origin`, unchanged by this file) is derived from the shell's own webview
//! window's *actual* URL at process startup, replacing the retired `cfg!(debug_assertions)`
//! compile-time selector `lib.rs` used to carry (the selector `tauri build --debug` got wrong:
//! `debug_assertions == true` on a *packaged* build, so it picked the dev-server origin while the
//! webview actually loaded the packaged custom-protocol origin — every upgrade 403'd).
//!
//! **API + crate version (ADR-020 Amendment 1 condition 5):** `tauri::Webview::url(&self) ->
//! crate::Result<Url>` — tauri **2.11.5** (`Cargo.lock`), doc comment `"Returns the current url of
//! the webview."`, defined at `src/webview/mod.rs:1679-1680`. `lib.rs` calls it through
//! `tauri::WebviewWindow::url()` (same crate, `src/webview/webview_window.rs:2378-2381`), which is
//! a one-line forward to the same `Webview::url()` (`self.webview.url()`) — the window handle
//! `app.get_webview_window(label)` (`Manager::get_webview_window`, `src/lib.rs:576`) returns.
//! `tauri::Url` is a direct re-export of `url::Url` (`tauri-2.11.5/src/lib.rs:83`: `pub use
//! url::Url;`), so this module uses `tauri::Url` rather than adding a separate `url` dependency.
//!
//! **This module's own function is pure** (`expected_origin_from_url`): it takes an
//! already-parsed `Url` and does no I/O, no process/window state, no network — callable from a
//! unit test with no Tauri runtime running. It is condition 2's "normalise to scheme + host + port
//! only". Everything about *reading* the URL from a live webview (condition 1: once, in `setup()`,
//! before any page script runs; condition 4: fail closed if absent or unparseable) lives in
//! `lib.rs`'s `setup()` closure, not here, because that step needs a running `App`/`AppHandle`
//! this module deliberately does not depend on.

use tauri::Url;

/// Why a webview URL could not be turned into a pinned expected origin. Every path that produces
/// one of these is a **fail-closed refusal** (ADR-020 Amendment 1 condition 4): there is no
/// default value substituted for a missing or unusable origin, only a named, logged error the
/// caller (`lib.rs::run`) turns into "refuse to start".
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum OriginError {
    /// The URL parsed (it *is* a `Url`) but carries no host component at all, so there is nothing
    /// to pin scheme+host+port to. Covers `about:blank` (a real webview URL before its first
    /// navigation completes) and any non-special scheme with no authority (e.g. `data:`).
    ///
    /// Deliberately does **not** cover "the URL string itself failed to parse" or "empty string":
    /// those never reach this function as a `Url` value in the first place, because
    /// `tauri::Webview::url()` performs that parse internally
    /// (`url.parse().map_err(crate::Error::InvalidUrl)`, `src/webview/mod.rs:1685`) and returns
    /// `Err` before `lib.rs` ever calls `expected_origin_from_url`. `lib.rs` treats that `Err` the
    /// same way it treats this one: a named refusal, never a default.
    NoHost { url: String },
}

impl std::fmt::Display for OriginError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            OriginError::NoHost { url } => {
                write!(f, "webview URL {url:?} has no host component; refusing to pin an expected origin from it")
            }
        }
    }
}

impl std::error::Error for OriginError {}

/// Normalises a webview's actual URL down to exactly what the data plane's host-declared
/// exact-match origin check compares against (`Session::with_origin`, unchanged by this file):
/// `scheme://host` or `scheme://host:port`, dropping path, query, fragment, and any userinfo. Does
/// **not** append a scheme's default port when the URL carries none (`Url::port()`, not
/// `Url::port_or_known_default()`) — `http://tauri.localhost` (no explicit port) must normalise to
/// `http://tauri.localhost`, not `http://tauri.localhost:80`.
pub fn expected_origin_from_url(url: &Url) -> Result<String, OriginError> {
    let host = url
        .host_str()
        .ok_or_else(|| OriginError::NoHost { url: url.as_str().to_string() })?;
    let scheme = url.scheme();
    Ok(match url.port() {
        Some(port) => format!("{scheme}://{host}:{port}"),
        None => format!("{scheme}://{host}"),
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn dev_server_url_normalises_to_scheme_host_port() {
        let url = Url::parse("http://localhost:5180/").unwrap();
        assert_eq!(expected_origin_from_url(&url).unwrap(), "http://localhost:5180");
    }

    #[test]
    fn packaged_custom_protocol_url_drops_path_and_query_and_the_implicit_default_port() {
        let url = Url::parse("http://tauri.localhost/index.html?x=1").unwrap();
        assert_eq!(expected_origin_from_url(&url).unwrap(), "http://tauri.localhost");
    }

    #[test]
    fn an_explicit_non_default_port_is_kept() {
        let url = Url::parse("https://example.test:8443/a").unwrap();
        assert_eq!(expected_origin_from_url(&url).unwrap(), "https://example.test:8443");
    }

    #[test]
    fn about_blank_has_no_host_and_is_refused() {
        // A real webview can report this URL before its first navigation completes -- exactly the
        // shape condition 4 says must fail closed, never default to something guessed.
        let url = Url::parse("about:blank").unwrap();
        assert_eq!(
            expected_origin_from_url(&url),
            Err(OriginError::NoHost { url: "about:blank".to_string() })
        );
    }

    #[test]
    fn a_url_without_a_host_component_is_refused() {
        // `data:` is not a WHATWG "special" scheme, so it carries no authority/host at all --
        // exercises the same `NoHost` path via a scheme distinct from `about:blank` above.
        let url = Url::parse("data:text/plain,hello").unwrap();
        assert!(matches!(expected_origin_from_url(&url), Err(OriginError::NoHost { .. })));
    }

    #[test]
    fn empty_string_never_becomes_a_url_at_all() {
        // `expected_origin_from_url` takes an already-parsed `Url` (condition 2's signature) --
        // there is no `Url` value an empty string can produce, so the "empty" case in condition
        // 4's list is caught one step upstream of this function, at exactly the same boundary
        // `tauri::Webview::url()` itself uses internally (`url.parse().map_err(InvalidUrl)`,
        // `src/webview/mod.rs:1685`, quoted in this module's own doc comment). This test documents
        // that boundary directly rather than asserting something this function cannot see.
        assert!(Url::parse("").is_err());
    }
}
