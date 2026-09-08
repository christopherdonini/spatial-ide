// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! ADR-020 Amendment 1 (rewritten 2026-09-08, the human's ruling on `DECISIONS-PENDING.md` entry
//! 55 = "(b)") — the data-plane's `expected_origin` (`DataPlaneConfig::expected_origin`,
//! `Session::with_origin`, unchanged by this file) is derived from **configuration the host
//! already holds**, never from a runtime read of the webview. `lib.rs`'s `setup()` gathers the
//! plain inputs below from `app.config()` and calls [`expected_origin_from_config`]; nothing in
//! that closure blocks, retries, sleeps, or pumps Win32 messages (`AI_DEVELOPMENT.md`'s "Never
//! block or pump inside Tauri's `setup()`" mechanic, `AI_DEVELOPMENT.md:147`, added the same day
//! as this rewrite).
//!
//! **The mirror, precisely.** [`expected_origin_from_config`] reproduces exactly the branch
//! `AppManager::get_app_url` takes for [`WebviewUrl::App`](tauri::WebviewUrl::App) resolution —
//! `tauri` **2.11.5**, `src/manager/mod.rs:353-367`: dev mode reads `config.build.dev_url`
//! directly, with no fallback; production reads `config.build.frontend_dist` if it is itself a
//! URL, else falls through to `AppManager::tauri_protocol_url` (`src/manager/mod.rs:339-346`):
//! `http(s)://tauri.localhost` on Windows/Android (`https` iff the window's `useHttpsScheme`,
//! default `false` — `tauri-utils` **2.9.3**, `src/config.rs:2153-2163`), `tauri://localhost`
//! everywhere else. `PROXY_DEV_SERVER` (`cfg!(all(dev, mobile))`) is inert for this reasoning: no
//! mobile target is built today (`lib.rs:102` carries the mobile entry-point attribute,
//! `#[cfg_attr(mobile, tauri::mobile_entry_point)]`, but nothing in this crate's `Cargo.toml`
//! actually builds one) — a mobile build would take that arm and is itself a §(e) reopen
//! condition, not a case this mirror's reasoning covers today.
//!
//! **This mirror also assumes the main window's own configured `url` is
//! [`WebviewUrl::App`](tauri::WebviewUrl::App).** `get_app_url`'s result becomes the webview's
//! actual navigation URL only in that arm (`tauri-2.11.5/src/manager/webview.rs:443-461`); the
//! adjacent `WebviewUrl::External` arm (`:462-471`) calls `get_app_url` too, but only to test
//! whether the configured external URL happens to coincide with it (`is_app_url`) — the webview
//! navigates to the configured EXTERNAL URL verbatim whenever it does not — and
//! `WebviewUrl::CustomProtocol` (`:473`) never calls `get_app_url` at all. [`main_window_url_is_app`]
//! below is `lib.rs`'s own fail-closed guard against a main window configured with either of those
//! other two shapes, which would otherwise silently diverge from this mirror.
//!
//! **Why the mirror cannot disagree with Tauri's own choice of window URL.** `tauri::is_dev()`
//! (`src/lib.rs:308-310`: `!cfg!(feature = "custom-protocol")`) and `get_app_url`'s own
//! `#[cfg(dev)]` branch (`src/manager/mod.rs:354`) are BOTH set by the `tauri` crate's OWN
//! `custom-protocol` feature, not by `tauri-build`: `tauri` **2.11.5**'s own `build.rs:255-261`
//! computes `dev = !has_feature("custom-protocol")` and emits BOTH `alias("dev", dev)` (tauri's own
//! internal `cfg(dev)` alias, which is what `get_app_url`'s `#[cfg(dev)]` reads) and a separate
//! `cargo:dev={dev}` metadata line. That second emission is read by `tauri-build` **2.6.3**'s
//! `is_dev()` (`src/lib.rs:425-429`, via `DEP_TAURI_DEV`) and its `cfg_alias("dev", is_dev())` call
//! (`src/lib.rs:519`) — but that call runs inside *this crate's own* `build.rs`
//! (`tauri_build::build()`), so it sets `cfg(dev)` for the **shell** crate, a mechanism this file's
//! code never uses (this crate has no `#[cfg(dev)]` anywhere in its own code — only
//! `tauri::is_dev()`, a direct runtime feature check compiled into the `tauri` library itself, with
//! no dependency on `tauri-build` or on this crate's own `cfg(dev)`). One underlying feature flag,
//! two independent propagation paths — the mirror (`tauri::is_dev()`) and Tauri's internal
//! window-URL resolution (`get_app_url`'s `#[cfg(dev)]`) read the SAME flag from the SAME crate's
//! build script and can never disagree.
//!
//! **This module's functions are pure**: no I/O, no process/window state, no network — callable
//! from a unit test with no Tauri runtime running (condition 2 of ADR-020 Amendment 1's original
//! text: "normalise to scheme + host + port only", still discharged by [`expected_origin_from_url`]
//! below, unchanged by this rewrite). *Reading* configuration out of a live `App`/`AppHandle` and
//! calling [`expected_origin_from_config`] with it lives in `lib.rs`'s `setup()` closure, not here.
//!
//! **The post-load self-check is a separate, later concern, deliberately not in this file.**
//! `lib.rs`'s `on_page_load` hook (registered on the `Builder`, before `.setup()`) reads
//! `Webview::url()` once the page has actually loaded and normalises it with
//! [`expected_origin_from_url`] to compare against the pinned value — an ASSERTION against the
//! value this module already computed, never a second selection. See `lib.rs` for that hook.

use tauri::Url;

/// Why the config mirror could not derive a pinned expected origin. Every path that produces one
/// of these is a **fail-closed refusal** (ADR-020 Amendment 1 condition 4, retained by the
/// rewrite): there is no default value substituted for a missing or unusable origin, only a named,
/// logged error the caller (`lib.rs::run`'s `setup()` closure) turns into "refuse to start".
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum OriginError {
    /// A candidate URL parsed (it *is* a `Url`) but carries no host component at all, so there is
    /// nothing to pin scheme+host+port to. Reachable here only through a configured `dev_url` or
    /// `frontend_dist` URL that itself has no host (e.g. `file:///...`) — the ordinary
    /// `tauri.conf.json` shapes this crate ships (`http://localhost:5180`, the tauri-protocol
    /// origins this module builds itself) always have one.
    NoHost { url: String },
    /// `tauri::is_dev()` is `true` but `app.config().build.dev_url` is `None`. `get_app_url`'s own
    /// dev-mode arm (`tauri-2.11.5/src/manager/mod.rs:354-355`) reads that same field directly,
    /// with no fallback of its own — this is the one branch the mirror cannot silently default
    /// through, so it refuses here instead, one step earlier than a hostless-URL parse would catch
    /// it.
    DevUrlNotConfigured,
}

impl std::fmt::Display for OriginError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            OriginError::NoHost { url } => {
                write!(f, "webview URL {url:?} has no host component; refusing to pin an expected origin from it")
            }
            OriginError::DevUrlNotConfigured => write!(
                f,
                "tauri::is_dev() is true but tauri.conf.json's build.devUrl is not set; refusing \
                 to guess a dev-server origin"
            ),
        }
    }
}

impl std::error::Error for OriginError {}

/// Normalises a webview's actual URL down to exactly what the data plane's host-declared
/// exact-match origin check compares against (`Session::with_origin`, unchanged by this file):
/// `scheme://host` or `scheme://host:port`, dropping path, query, fragment, and any userinfo. Does
/// **not** append a scheme's default port when the URL carries none (`Url::port()`, not
/// `Url::port_or_known_default()`) — `http://tauri.localhost` (no explicit port) must normalise to
/// `http://tauri.localhost`, not `http://tauri.localhost:80`; and an *explicit* default port
/// (`http://localhost:80/`) is dropped too, because `Url::parse` itself drops it at parse time —
/// `url.port()` is already `None` for that input (verified against the pinned `url` **2.5.8**;
/// `Url::port_or_known_default()` would reintroduce the default, which is why this function does
/// not use it).
///
/// **Host casing and IPv6 are already normalised by `url::Url` itself, not by this function** —
/// verified empirically against the pinned `url` **2.5.8**, not assumed: `host_str()` lower-cases a
/// domain host (`https://LOCALHOST:5180/` → `"localhost"`) and returns an IPv6 host **already
/// bracketed** (`http://[::1]:5180/` → `Some("[::1]")` — `url`'s own doc comment for `host_str`,
/// `src/lib.rs:1130`, states this: *"IPv6 addresses are given between `[` and `]` brackets"*), so
/// `format!("{scheme}://{host}:{port}")` below produces `http://[::1]:5180` directly with no
/// separate bracketing step needed.
///
/// Used two ways in this crate: by [`expected_origin_from_config`] below (the startup selection),
/// and directly by `lib.rs`'s `on_page_load` hook (the post-load self-check) — the same
/// normalisation rule applies to both, deliberately: the self-check must compare like with like.
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

/// Mirrors the two [`tauri::utils::config::FrontendDist`] shapes `get_app_url`'s production arm
/// distinguishes between (`tauri-2.11.5/src/manager/mod.rs:357-360`) — deliberately not that type
/// itself: this module takes only the one bit [`expected_origin_from_config`] needs (is this
/// build's `frontendDist` itself a URL, or anything else), so a unit test can construct either
/// variant with no `tauri::Config` value in hand at all.
#[derive(Debug, Clone, Copy)]
pub enum FrontendDistOrigin<'a> {
    /// `FrontendDist::Url(url)` — a production frontend served from a URL rather than embedded
    /// assets.
    Url(&'a Url),
    /// Every other `FrontendDist` shape (embedded `Directory`/`Files`, or `frontendDist` unset) —
    /// falls through to the tauri-protocol origin, exactly as `get_app_url`'s own `_ => None` arm
    /// does.
    Other,
}

/// Mirrors `AppManager::tauri_protocol_url`'s own platform split
/// (`tauri-2.11.5/src/manager/mod.rs:340-345`: `cfg!(windows) || cfg!(target_os = "android")`) as
/// a plain value, so [`expected_origin_from_config`] can be exercised for the non-Windows arm from
/// a unit test running on Windows (ADR-003's Resolution validates Windows/WebView2 only today;
/// docs/07's macOS/Linux hardware-validation gate is still open — this type lets that arm's own
/// logic be tested here regardless of which OS the test suite happens to run on, the same reason
/// `origin.rs`'s pre-existing `tauri_scheme_localhost_the_macos_linux_packaged_shape_normalises_too`
/// test below exercises `tauri://localhost` on a Windows CI runner).
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Platform {
    WindowsOrAndroid,
    Other,
}

impl Platform {
    /// This process's own platform, computed exactly the way `tauri_protocol_url` computes it.
    pub fn current() -> Self {
        if cfg!(windows) || cfg!(target_os = "android") {
            Platform::WindowsOrAndroid
        } else {
            Platform::Other
        }
    }
}

/// The fail-closed guard `lib.rs`'s `setup()` applies to the main window's own configured `url`
/// (architect review A2). This module's whole reasoning — [`expected_origin_from_config`]
/// reproduces `AppManager::get_app_url`'s resolution of a webview's URL — only describes the
/// webview Tauri actually creates when that window is configured as
/// [`tauri::utils::config::WebviewUrl::App`]; see this module's own top doc comment for why the
/// other two `WebviewUrl` shapes diverge. Pure so a unit test can exercise all three variants with
/// no `tauri::Config` value in hand at all.
pub fn main_window_url_is_app(url: &tauri::utils::config::WebviewUrl) -> bool {
    matches!(url, tauri::utils::config::WebviewUrl::App(_))
}

/// Mirrors `AppManager::tauri_protocol_url` exactly (`tauri-2.11.5/src/manager/mod.rs:339-346`):
/// `http(s)://tauri.localhost` on Windows/Android (`https` iff `use_https`), `tauri://localhost`
/// everywhere else. Private: the only caller is [`expected_origin_from_config`]'s production
/// fallback arm, immediately below.
fn tauri_protocol_url(use_https: bool, platform: Platform) -> Url {
    match platform {
        Platform::WindowsOrAndroid => {
            let scheme = if use_https { "https" } else { "http" };
            Url::parse(&format!("{scheme}://tauri.localhost"))
                .expect("a fixed, hand-written URL literal always parses")
        }
        Platform::Other => {
            Url::parse("tauri://localhost").expect("a fixed, hand-written URL literal always parses")
        }
    }
}

/// The config mirror itself (ADR-020 Amendment 1, rewritten): reproduces `AppManager::get_app_url`
/// (`tauri-2.11.5/src/manager/mod.rs:353-367`) over plain inputs `lib.rs`'s `setup()` gathers from
/// `app.config()` / the main window's config, then normalises the result with
/// [`expected_origin_from_url`] — the SAME normalisation the pre-rewrite runtime read used, so the
/// final `String` shape this crate pins is unchanged by this rewrite; only how the `Url` it starts
/// from is obtained has changed.
///
/// - `is_dev`: `tauri::is_dev()` (`tauri-2.11.5/src/lib.rs:308-310`).
/// - `dev_url`: `app.config().build.dev_url.as_ref()` — read with **no fallback**, matching
///   `get_app_url`'s own dev arm exactly; `None` here is condition 4's fail-closed refusal
///   ([`OriginError::DevUrlNotConfigured`]), never a guessed default.
/// - `frontend_dist`: `app.config().build.frontend_dist`, reduced to [`FrontendDistOrigin`].
/// - `use_https`: the main window's `useHttpsScheme` (`tauri.conf.json`'s
///   `app.windows[0].useHttpsScheme`, default `false`).
/// - `platform`: [`Platform::current`] in production; either variant may be supplied directly by a
///   test.
pub fn expected_origin_from_config(
    is_dev: bool,
    dev_url: Option<&Url>,
    frontend_dist: FrontendDistOrigin<'_>,
    use_https: bool,
    platform: Platform,
) -> Result<String, OriginError> {
    if is_dev {
        let url = dev_url.ok_or(OriginError::DevUrlNotConfigured)?;
        expected_origin_from_url(url)
    } else {
        match frontend_dist {
            FrontendDistOrigin::Url(url) => expected_origin_from_url(url),
            FrontendDistOrigin::Other => {
                let url = tauri_protocol_url(use_https, platform);
                expected_origin_from_url(&url)
            }
        }
    }
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
        // A real webview can report this URL before its first navigation completes -- the
        // post-load self-check's own reason for treating an unreadable/hostless actual URL as a
        // mismatch rather than a crash (`lib.rs`'s `on_page_load` hook).
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
    fn a_file_url_has_no_host_and_is_refused() {
        // `file:///...` (triple slash, empty authority) is a WHATWG "special" scheme but its own
        // host is empty -- verified empirically this is `host_str() == None` (not `Some("")`) for
        // the pinned `url` 2.5.8, so this hits the same `NoHost` path, not a silently-accepted
        // empty-string host.
        let url = Url::parse("file:///C:/app/index.html").unwrap();
        assert!(matches!(expected_origin_from_url(&url), Err(OriginError::NoHost { .. })));
    }

    #[test]
    fn an_explicit_default_port_is_dropped_same_as_no_port() {
        // `http://localhost:80/` names the scheme's own default port explicitly -- `Url::parse`
        // itself drops it (`url.port()` is already `None`, verified empirically against the pinned
        // `url` 2.5.8), so this function's own `Url::port()` (not `port_or_known_default()`) choice
        // never even sees it; asserted here as the behaviour this function's contract depends on.
        let url = Url::parse("http://localhost:80/").unwrap();
        assert_eq!(expected_origin_from_url(&url).unwrap(), "http://localhost");
    }

    #[test]
    fn userinfo_and_fragment_are_dropped() {
        let url = Url::parse("http://user:pa55@localhost:5180/x#f").unwrap();
        assert_eq!(expected_origin_from_url(&url).unwrap(), "http://localhost:5180");
    }

    #[test]
    fn an_ipv6_host_keeps_its_brackets() {
        // `url::Url::host_str()` already returns an IPv6 host bracketed (verified empirically
        // against the pinned `url` 2.5.8: `Some("[::1]")`, not `Some("::1")`) -- this function does
        // no bracketing of its own; see its own doc comment for the citation.
        let url = Url::parse("http://[::1]:5180/index.html").unwrap();
        assert_eq!(expected_origin_from_url(&url).unwrap(), "http://[::1]:5180");
    }

    #[test]
    fn a_domain_host_is_lower_cased() {
        // `url::Url` itself lower-cases a domain host at parse time (verified empirically against
        // the pinned `url` 2.5.8) -- this function relies on that rather than lower-casing again.
        let url = Url::parse("https://LOCALHOST:5180/").unwrap();
        assert_eq!(expected_origin_from_url(&url).unwrap(), "https://localhost:5180");
    }

    #[test]
    fn tauri_scheme_localhost_the_macos_linux_packaged_shape_normalises_too() {
        // Named because `docs/adr/ADR-020...`'s own Windows/WebView2 packaged origin is
        // `http://tauri.localhost`, but Tauri's other platforms use a `tauri://localhost` custom
        // scheme instead -- this function is platform-agnostic (it operates on whatever URL is
        // handed to it), so it is exercised here even though only Windows/WebView2 is validated
        // today (docs/07's macOS/Linux hardware-validation gate, still open).
        let url = Url::parse("tauri://localhost/index.html").unwrap();
        assert_eq!(expected_origin_from_url(&url).unwrap(), "tauri://localhost");
    }

    // -- `expected_origin_from_config`: the config mirror's own branches (RELEASE-0.1.md Amendment
    // 6's preregistration for item 1 (b)) --------------------------------------------------------

    #[test]
    fn dev_with_dev_url_uses_it() {
        let dev_url = Url::parse("http://localhost:5180/").unwrap();
        let result = expected_origin_from_config(
            true,
            Some(&dev_url),
            FrontendDistOrigin::Other,
            false,
            Platform::WindowsOrAndroid,
        );
        assert_eq!(result.unwrap(), "http://localhost:5180");
    }

    #[test]
    fn dev_without_dev_url_refuses() {
        let result = expected_origin_from_config(
            true,
            None,
            FrontendDistOrigin::Other,
            false,
            Platform::WindowsOrAndroid,
        );
        assert_eq!(result, Err(OriginError::DevUrlNotConfigured));
    }

    #[test]
    fn production_frontend_dist_url_uses_it() {
        let dist_url = Url::parse("https://example.test/app/").unwrap();
        let result = expected_origin_from_config(
            false,
            None,
            FrontendDistOrigin::Url(&dist_url),
            false,
            Platform::WindowsOrAndroid,
        );
        assert_eq!(result.unwrap(), "https://example.test");
    }

    #[test]
    fn production_default_is_tauri_localhost_over_http() {
        let result = expected_origin_from_config(
            false,
            None,
            FrontendDistOrigin::Other,
            false,
            Platform::WindowsOrAndroid,
        );
        assert_eq!(result.unwrap(), "http://tauri.localhost");
    }

    #[test]
    fn production_default_with_use_https_scheme_is_https() {
        let result = expected_origin_from_config(
            false,
            None,
            FrontendDistOrigin::Other,
            true,
            Platform::WindowsOrAndroid,
        );
        assert_eq!(result.unwrap(), "https://tauri.localhost");
    }

    #[test]
    fn production_default_on_the_non_windows_arm_is_tauri_scheme_localhost() {
        // The non-Windows/Android arm ignores `use_https` entirely -- `tauri://localhost`
        // regardless (`AppManager::tauri_protocol_url`'s own `else` branch takes no `https`
        // parameter), asserted here with `use_https: true` specifically to prove that.
        let result = expected_origin_from_config(
            false,
            None,
            FrontendDistOrigin::Other,
            true,
            Platform::Other,
        );
        assert_eq!(result.unwrap(), "tauri://localhost");
    }

    #[test]
    fn dev_and_production_branches_are_not_interchangeable() {
        // Mutation note (corrected, empirically re-verified 2026-09-08 via a real
        // `if is_dev { <else body> } else { <if body> }` swap, then reverted -- `cargo test --lib`):
        // an earlier draft of this comment overstated its own uniqueness ("THIS test is the one
        // that fails"). All 7 of this module's `expected_origin_from_config` branch tests fail on
        // that swap, but through two different, verified shapes: `production_frontend_dist_url_
        // uses_it`, `production_default_is_tauri_localhost_over_http`,
        // `production_default_with_use_https_scheme_is_https`, and `production_default_on_the_
        // non_windows_arm_is_tauri_scheme_localhost` all set `dev_url: None`, so the swap turns
        // their `.unwrap()` into a PANIC on `Err(DevUrlNotConfigured)` -- an error, not a value
        // comparison. THIS test, plus `dev_with_dev_url_uses_it` and `dev_without_dev_url_refuses`,
        // instead fail via a plain `assert_eq!` value mismatch (two well-formed, differing results,
        // or an `Ok` compared against an `Err`) -- because `dev_url` and `frontend_dist`'s URL are
        // deliberately distinct, non-`None` values in all three, a swap returns a WRONG but
        // well-formed answer rather than panicking. This test is one of three sharing that shape,
        // not the only one -- kept for its own reason: it is the only one of the three that asserts
        // in BOTH directions (`is_dev: true` AND `is_dev: false`) in a single test.
        let dev_url = Url::parse("http://localhost:5180/").unwrap();
        let dist_url = Url::parse("https://example.test/app/").unwrap();

        let dev_result = expected_origin_from_config(
            true,
            Some(&dev_url),
            FrontendDistOrigin::Url(&dist_url),
            false,
            Platform::WindowsOrAndroid,
        );
        assert_eq!(dev_result.unwrap(), "http://localhost:5180");

        let prod_result = expected_origin_from_config(
            false,
            Some(&dev_url),
            FrontendDistOrigin::Url(&dist_url),
            false,
            Platform::WindowsOrAndroid,
        );
        assert_eq!(prod_result.unwrap(), "https://example.test");
    }
}
