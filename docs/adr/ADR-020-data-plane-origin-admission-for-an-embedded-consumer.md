# ADR-020 — Data-Plane Origin Admission for an Embedded-Webview Consumer

**Status:** **Accepted — 2026-08-13, by the human**, on the 2026-08-12 architect security review
(no docs/09 conflict, no ADR-012 H4 conflict, blocking text corrections applied) and the E2E
render evidence. Immutable from this acceptance; corrections are dated corrigenda.
**Scope of acceptance (the human's own framing):** accepted is the **host-declared exact-match
origin mechanism** (`DataPlaneConfig::expected_origin`, `Session::with_origin`) — **not** a claim
that `cfg!(debug_assertions)` is the final origin-selection method. The `tauri build --debug`
origin mismatch recorded under Decision stays explicitly recorded as a **fail-closed
implementation defect, owed before any packaged-debug support is claimed**.
**History:** proposed 2026-08-11. `frontends/shell`
implemented it ahead of acceptance because, without it, every data-plane WebSocket upgrade this shell attempts is
refused (`403 origin`) and no batch can ever reach the canvas. As with ADR-019, the
*implementation* is licensed by already-accepted **ADR-004** — the standing under which
`protocol/data-plane`'s WebSocket adapter itself proceeds while ADR-012 remains provisional
(ADR-012 is Proposed — twice withheld, binding nothing — and this ADR draws no authority from it). `docs/09`'s posture is not removed or
weakened — though `docs/09` is silent on this socket entirely, which makes that claim vacuous
until the docs/09 bullet owed under "If accepted" lands.
**Drafted by:** the architect, consulted mid-cut after the Custodian traced a "canvas renders
nothing" walkthrough failure to this cause (`frontends/shell` cut 1, 2026-08-11).
**Reviewed:** full architect scrutiny against `docs/09` and ADR-012 H4, 2026-08-12,
human-directed (security-posture red line); that review's corrections are applied to this draft
and its verdict — no H4 conflict, no exploitable weakening, blocking-on-text items fixed here —
is recorded in `DECISIONS-PENDING.md` entry 1 for the human's acceptance decision.
**Related:** ADR-012 (data-plane transport — loopback, ephemeral port, per-session auth, origin
validation), ADR-019 (control-plane admission tickets — the consumer class this ADR now names),
`docs/09` (loopback socket threat model), `protocol/data-plane/src/session.rs` (`Session`).

## Context

`protocol/data-plane`'s `Session` derives the one `Origin` it will admit from the data plane's own
bound port (`Session::new(port)` → `http://127.0.0.1:{port}`). That is correct for the consumer
`server.rs`'s `static_dir` was built for: a browser opening the page this server serves at `/`,
whose origin *is necessarily* that same `http://127.0.0.1:{port}` — `kernel::main`'s `slice-host`
binary and the ADR-003 spike's own harness are exactly that shape.

`frontends/shell` is a different shape, and `DataPlaneConfig::static_dir: None` says so explicitly
(`frontends/shell/src-tauri/src/lib.rs`: "No static assets: the shell's own webview loads the
frontend directly"). Its webview's origin is `http://localhost:5180` under `tauri dev`
(`vite.config.ts`'s fixed dev port, mirrored in `tauri.conf.json`'s `devUrl`) or
`http://tauri.localhost` in a packaged build (Tauri's default custom-protocol origin on
Windows/WebView2, the only platform ADR-003's Resolution validates) — in both cases, an origin with
no relationship to the data plane's own OS-assigned ephemeral port. `Session`'s port-derived
default can therefore never equal it. Every stream this shell has ever opened was refused at the
WebSocket upgrade (`server.rs`'s `upgrade` handler: `StatusCode::FORBIDDEN, "origin"`), silently:
`App.tsx` did not wire `ViewportStreamManager`'s `onTerminal` callback, so the resulting
`TransportFailed` terminal reached no banner and no console line. Fixed alongside this ADR
regardless of its acceptance (docs/01 principle 8 — no black boxes — does not wait on a threat-model
decision).

Two prior fixes this same walkthrough motivated (camera fit-to-bounds, viewport-query debounce)
were real and stay, but neither could have fixed this: the WebSocket handshake was refused before
any batch could exist to fit a camera to or throttle a query about.

## Decision (proposed)

Add an explicit expected origin to `DataPlaneConfig`, supplied by the *host process*, never by page
script and never a wildcard:

```rust
pub struct DataPlaneConfig {
    pub factory: Arc<dyn SourceFactory>,
    pub static_dir: Option<PathBuf>,
    /// The consumer's own origin, when it is not the same-origin page `static_dir` would serve.
    /// `None` preserves the original assumption.
    pub expected_origin: Option<String>,
}
```

`Session::with_origin(origin: String)` is the new constructor `serve()` calls when
`expected_origin` is `Some`; `Session::new(port)` (unchanged) is now defined in terms of it and
stays the default for every same-origin-page consumer. Exact-match comparison is unchanged;
`Origin: null` stays rejected; the `sec-fetch-site: same-origin` fallback for an absent header is
unchanged. **For this consumer class the 32-byte OS-CSPRNG session token is now the *only*
barrier a local attacker must clear**; origin validation remains as defence-in-depth against
browser-origin confusion only — against a local non-browser process it never was a barrier (any
local process sets `Origin:` freely; ADR-012 open risk 8: the token authenticates a session, not
a process). By `docs/09`'s own capability-grant standard the token is a blunt instrument — no
scope, no expiry, no revocation, no per-process attribution (`protocol/data-plane/src/session.rs`
claims no capability-grant model); ADR-019's tickets are the mitigation that narrows what a
stolen token authorizes. This ADR touches origin admission only, not authentication.

`frontends/shell/src-tauri/src/lib.rs` supplies `http://localhost:5180` under `cfg!(debug_assertions)`
(matching `tauri dev`) and `http://tauri.localhost` otherwise (a packaged build) — a compile-time
distinction, not a runtime guess. That distinction is **not** "is this `tauri dev`":
`tauri build --debug` produces a *packaged* build with `debug_assertions` on — webview at
`http://tauri.localhost`, data plane expecting `http://localhost:5180`, every upgrade 403'd. It
fails closed (a correctness defect, not a hole), and `5180` now lives in three places with no
mechanical link (`vite.config.ts`, `tauri.conf.json`'s `devUrl`, `lib.rs`). The alternative this
draft names but does not adopt: derive the expected origin from the webview's *actual* URL at
startup (Tauri 2 exposes the window's `url()`; verify the exact API before adopting) — still
host-supplied, never page script, no wildcard, no drift, no `--debug` mismatch. Related: the E2E
harness's dev gate (`import.meta.env.DEV`, Vite) and this one (`cfg!(debug_assertions)`, Rust)
are independent mechanisms, and `tauri build --debug` is precisely where they disagree.

## Consequences

- **What this newly admits, stated precisely.** Before: the admitted origin was
  `http://127.0.0.1:<ephemeral>`, and with `static_dir: None` no page can exist at that origin —
  the stated-`Origin` path was effectively closed. After: the admitted origin is a **fixed,
  predictable, non-exclusive** string. In dev, `http://localhost:5180`: a page at that origin in
  the user's ordinary browser is origin-admitted and faces only the token. Packaged,
  `http://tauri.localhost`: on Windows/WebView2 that is **Tauri v2's default custom-protocol
  origin for every Tauri app on the machine**, not an identity unique to this shell. Against a
  browser-class adversary the origin check has stopped being a second factor; against a local
  non-browser process it never was one (unchanged — ADR-012 open risk 8).
- **The hostile-`:5180` scenario is real but is not this ADR's boundary.** A hostile process that
  wins port 5180 before `tauri dev` starts becomes the shell's own frontend via
  `tauri.conf.json`'s `devUrl`, with Tauri IPC — including `binding_data_plane_attach`, which
  hands it the endpoint *and* the credential. That is whole-shell compromise, it exists with or
  without this ADR, and the data-plane origin check is not the boundary there. `"csp": null` in
  `tauri.conf.json` belongs in the same picture: with no CSP, any script that reaches the shell's
  page inherits the admitted origin.
- ADR-012's threat model gains a named consumer class: "embedded webview, different origin, same
  process, still loopback-only" — where *same process* describes the intended consumer, **not a
  property the origin check enforces**. Its own text should be amended to say so if this is
  accepted.
- `session.rs`'s existing rejection tests keep their `localhost`-is-not-`127.0.0.1` assertion
  unchanged; new tests assert a declared foreign origin is admitted and the port-derived default is
  not, both via `Session::with_origin` directly and end-to-end over a real socket
  (`kernel/tests/skp_admission.rs`) — plus the negative that converts this ADR's central claim
  from argument to test: **admitted origin + wrong token is refused**.
- No wire, frame, or SKP-level change. `protocol/skp` and `SKP-V0.md` are untouched.

## If accepted

*(All items below applied at acceptance, 2026-08-13: this status line; ADR-012 Amendment 1;
`docs/09`'s "Local listening sockets" section; the `docs/02` and `docs/README` entries.)*

- This file's status line updates to Accepted, dated.
- ADR-012 gains a short amendment that **quotes the sentence it amends** — its threat-model
  **Origin** bullet, not H4 — and states the delta plainly: the mechanics of all three of that
  bullet's sentences are preserved; only the referent of *foreign* changes, from "not this
  server's own origin" to "not the declared origin". One caveat appended: H4's PASS was obtained
  on a same-origin harness configuration that no longer describes this consumer — the PASS is
  inherited by argument, not by measurement.
- `docs/09` gains a "local listening sockets" bullet (it is marked *Evolves*; no ADR required), so
  the posture for the one listening socket this product ships stops living only inside Proposed
  ADRs. Draft wording is in the 2026-08-12 architect review (`DECISIONS-PENDING.md` entry 1).
- `docs/02`'s ADR list and `docs/README.md`'s conventions paragraph gain their ADR-020 entries.

## If rejected

- `frontends/shell`'s data-plane connection needs a different mechanism to reach an admitted
  origin — e.g. serving the shell's own frontend from the data-plane process after all
  (`static_dir`), which ADR-019's Context section already gives reasons to have avoided. Whatever
  replaces this decision, the shell cannot render anything until *some* fix lands: this is not
  optional cut-1 polish.

## Amendment 1 — the tauri build --debug origin selector replaced by a config mirror (2026-09-08, rewritten on the human's ruling)

**Authorization and provenance of this rewrite.** The text below REPLACES, in place, the Amendment
1 text this branch (`cut/release-adr020-origin`) carried since 2026-09-07 — that text was never
merged to `main` and never became part of the accepted historical record, so it is unmerged draft
text, not an accepted amendment this file is rewriting after the fact (accepted ADR text stays
append-only; this branch's own prior draft does not). `DECISIONS-PENDING.md` entry 55 records why:
the 2026-09-07 draft's own runtime-evidence pass (its own §(f), preserved below only in this
amendment's dated history paragraph) found the webview's URL is `about:blank` when `setup()` runs
and "fixed" that with a Win32 message pump inside `setup()`, adding a direct `windows` dependency
and the crate's only `unsafe`; two gates (architect + reviewer) both failed it, and the design
question went to the human as entry 55. The human's ruling, 2026-09-08, verbatim: *"55 = (b): config
mirror via tauri::is_dev(); Part M equivalence assertion under dev / build --debug / build; post-load
logged self-check of pinned vs actual origin with a typed mismatch state (assertion, never selection,
no pump); windows edge + unsafe removed; conditions (4)/(5) retained, (1)–(3) superseded; recorded as
ADR-020 Amendment 1's content; new mechanic: never block or pump inside setup()."* (also recorded at
`RELEASE-0.1.md` Amendment 6). This text is that content, per RELEASE-0.1.md Amendment 6's
"Preregistration — item 1 (b): the config mirror", which supersedes Amendment 2's item-1 conditions
(1)–(3) and retains conditions (4) and (5).

**(a) The Status-paragraph sentence this amendment discharges, quoted verbatim:**

> The `tauri build --debug` origin mismatch recorded under Decision stays explicitly recorded as a
> **fail-closed implementation defect, owed before any packaged-debug support is claimed**.

**(b) The new selector — the config mirror.** `frontends/shell/src-tauri/src/lib.rs`'s `setup()`
closure no longer selects `webview_origin` from `cfg!(debug_assertions)`, and no longer reads the
webview at all. It derives `expected_origin` from **configuration the host already holds**,
mirroring Tauri's own `WebviewUrl::App` resolution, via a pure function,
`origin::expected_origin_from_config` (`frontends/shell/src-tauri/src/origin.rs`):

- **API + versions (condition 5):** `tauri::is_dev() -> bool` — **tauri 2.11.5**,
  `src/lib.rs:308-310` (`!cfg!(feature = "custom-protocol")`). `AppManager::get_app_url`, the
  method this mirror reproduces — **tauri 2.11.5**, `src/manager/mod.rs:353-367` — reads
  `config.build.dev_url` in dev mode (no fallback) and falls through to
  `AppManager::tauri_protocol_url` (`src/manager/mod.rs:339-346`) in production unless
  `config.build.frontend_dist` is itself a URL. Both `tauri::is_dev()` here and `get_app_url`'s own
  `#[cfg(dev)]` branch descend from the identical single build-script emission: **tauri 2.11.5**'s
  `build.rs:255-261` computes `dev = !has_feature("custom-protocol")` and prints `cargo:dev={dev}`;
  **tauri-build 2.6.3**'s `is_dev()` (`src/lib.rs:425-429`) reads it back via `DEP_TAURI_DEV`, and
  `cfg_alias("dev", is_dev())` (`src/lib.rs:519`) is what gives this crate's own build the
  `#[cfg(dev)]`/`tauri::is_dev()` bit. One bit, two consumers — the mirror cannot disagree with
  Tauri's own choice of window URL however a build mode falls, which is exactly the property the
  retired `cfg!(debug_assertions)` selector lacked (`tauri build --debug` sets `debug_assertions`
  but not `dev`).
- **Logic, exactly:** `if tauri::is_dev() { origin_of(app.config().build.dev_url) — refuse to start
  if None } else { if let FrontendDist::Url(u) = app.config().build.frontend_dist { origin_of(u) }
  else { tauri_protocol_origin(https) } }`, where `tauri_protocol_origin` is
  `http(s)://tauri.localhost` on Windows/Android (`https` iff the main window's `useHttpsScheme`,
  default `false` — **tauri-utils 2.9.3**, `src/config.rs:2153-2163`) and `tauri://localhost`
  everywhere else — `AppManager::tauri_protocol_url`'s own platform split
  (`src/manager/mod.rs:340-345`). `PROXY_DEV_SERVER` (`cfg!(all(dev, mobile))`) is noted, inert:
  this crate is desktop-only, so that condition is always `false`.
- **Purity and inputs:** `expected_origin_from_config` takes plain values — `is_dev: bool`,
  `dev_url: Option<&Url>`, a `FrontendDistOrigin` (`Url(&Url)` or `Other`), `use_https: bool`, a
  `Platform` enum (`WindowsOrAndroid`/`Other`) — no `App`/`AppHandle`, no I/O, callable from a unit
  test with no Tauri runtime running. `setup()`'s own job is reduced to gathering those five values
  from `app.config()`/the main window's config and calling this one function; it performs no other
  logic of its own.
- **Normalisation:** the resulting `Url` (the configured `dev_url`, the configured
  `frontend_dist` URL, or the constructed tauri-protocol `Url`) is reduced by the SAME pure
  `expected_origin_from_url(&Url) -> Result<String, OriginError>` this ADR's original text already
  named — `scheme://host` or `scheme://host:port`, dropping path/query/fragment/userinfo, never
  appending an implicit default port (`url` **2.5.8**, pinned).
- **Pinning:** the resulting `String` is used exactly once, as `DataPlaneConfig::expected_origin`,
  for the process's whole lifetime — the same field and the same `Session::with_origin`
  constructor this ADR's Decision already defined; neither changed.
- **Fail-closed and visible, not a bare panic (condition 4 retained):** `SessionLog::open` runs
  BEFORE this selection (unchanged ordering from the branch's prior fix batch), so a refusal always
  has somewhere to log to. If the configured main window is absent from `tauri.conf.json`, if
  `tauri::is_dev()` is `true` with no `build.devUrl` configured
  (`OriginError::DevUrlNotConfigured`), or if a configured `dev_url`/`frontend_dist` URL has no host
  component (`OriginError::NoHost`), `lib.rs`'s own `refuse_to_start` function logs the named
  condition to the session log, shows a blocking native error dialog through the already-registered
  `tauri_plugin_dialog` plugin (a direct host-side call, not a `#[tauri::command]`, so ADR-027
  decision 4's unclassified-command scan does not apply), and exits the process with status 1 —
  never a default value, never silent (a plain release build has no console:
  `main.rs`'s `windows_subsystem = "windows"`).
- **No runtime read, no retry, no pump, no `windows` dependency, no `unsafe`.** There is nothing in
  `setup()` for a Win32 message pump to unblock: every input this selection needs is already fully
  resolved configuration by the time `setup()` begins. `Cargo.toml`'s `[target.'cfg(windows)'.
  dependencies]` block (the direct `windows` 0.61.3 edge) is removed entirely; `git diff main --
  frontends/shell/src-tauri/Cargo.toml frontends/shell/src-tauri/Cargo.lock` is empty (`windows`
  remains resolved only transitively, via `tauri`/`wry`, exactly as it was before ADR-020 Amendment
  1 first existed).

**The post-load self-check — an ASSERTION, never a second selection.** The config mirror above is
the ONLY place `expected_origin` is ever chosen; nothing described here feeds back into it or into
`DataPlaneConfig`. Registered on `tauri::Builder::on_page_load` (`frontends/shell/src-tauri/src/
lib.rs`, before `.setup()`) — **tauri 2.11.5**, `src/app.rs:1781-1789`:
`Fn(&Webview<R>, &PageLoadPayload<'_>) + Send + Sync + 'static`, called once per page-load event per
webview. Filtered to `PageLoadEvent::Finished` (`tauri::webview::PageLoadEvent`,
`tauri-2.11.5/src/webview/mod.rs:21`) and to this process's one configured main window (by label).
Reads `Webview::url() -> tauri::Result<Url>` (**tauri 2.11.5**, `src/webview/mod.rs:1679-1680`, doc
comment `"Returns the current url of the webview."`), normalises it with the SAME
`origin::expected_origin_from_url` the mirror itself uses, and compares the result against the
`PinnedOrigin` managed state `setup()` recorded at the moment it pinned `expected_origin`. The
comparison result is appended to the session log — `origin-self-check ok pinned=<origin>` on a
match, `origin-self-check MISMATCH pinned=<origin> actual=<origin>` (or `actual=<unreadable: ...>`
if `Webview::url()`/normalisation itself failed) otherwise — and, on a mismatch only, one typed
event, `origin-self-check-mismatch`, is emitted via `AppHandle::emit` (`Webview<R>: Emitter<R>`,
`Manager<R>`, both implemented directly — `tauri-2.11.5/src/webview/mod.rs:2291,2293` — so this
hook needs nothing `setup()` alone provides), payload `{ pinned: String, actual: String }`. **No new
Tauri command exists here** — ADR-027 decision 4's unclassified-command build-time scan is
unaffected. The frontend (`frontends/shell/src/diagnostics/originSelfCheck.ts`) listens with
`@tauri-apps/api/event`'s `listen` (an existing dependency — `@tauri-apps/api` is already in
`package.json`; `listen` is the sibling export of the `invoke` this crate's other modules already
use) and renders a typed, non-dismissable state (`OriginMismatchState.tsx`) naming the mismatch and
that the data plane will refuse; nothing in the frontend or host ever writes the pinned value back.
**This can only ever fire after `setup()` has returned** — page-load events are dispatched by the
app's own event loop, which does not begin pumping until `setup()`'s synchronous closure completes
(`tauri-2.11.5/src/app.rs:1422-1426`'s `RuntimeRunEvent::Ready` dispatch) — so every `app.manage(...)`
call `setup()` makes has already run by the time this hook can observe anything.

Design (b) — the dev origin's single declared source: `vite.config.ts`'s `server.port` remains the
declared source (it always was: `vite.config.ts`'s own top comment already states the port choice
and why); `tauri.conf.json`'s `build.devUrl` is the one remaining hand-written copy of it.
`lib.rs` no longer carries a third copy at all — `5180` does not appear anywhere in that file. The
mechanical link the preregistration requires is a new `npm run check:dev-origin`
(`frontends/shell/e2e/checkDevOriginConsistency.mjs`), wired into `npm run verify` ahead of
`build`: it parses `tauri.conf.json`'s `build.devUrl` as a URL (real JSON, no code execution) and
compares its own port against `vite.config.ts`'s `server.port` (read via a text scan for the
literal `server: { port: <number> }` shape — also no code execution), failing if they disagree OR
if the text scan finds anything other than exactly one match (an earlier version of this script
used `String.match`, which silently returns only the first hit and could be fooled by a stray
comment shaped like the real config; `matchAll` plus an exactly-one-match requirement, added on
reviewer gate, closes that). A unit test was considered and rejected in favor of this `check:*`
script, following `check:dist-clean`'s own existing precedent (`e2e/checkDistClean.mjs`): the
relationship being asserted is between two config files, neither of which is application source
under test, and `npm run verify`'s pipeline already has a `check:*` stage for exactly this shape of
drift check. **Rewritten this amendment (2026-09-08): this check is now load-bearing for TWO
things, not one.** Before, a `vite.config.ts`/`tauri.conf.json` drift only misdirected the webview
(the pre-rewrite selector read the webview's own URL back, so it would have pinned whatever origin
the webview actually landed on, correct or not). Now that the config mirror pins
`tauri.conf.json`'s own `build.devUrl` origin directly, a drift here means the config mirror pins
an origin the webview never actually navigates to, and every data-plane upgrade 403s — this script
is the only thing that would catch that before a human hits it at runtime.

**(c)** Verbatim, as required:

> the accepted mechanism is unchanged; this replaces a selector the acceptance never covered.

`DataPlaneConfig::expected_origin` / `Session::with_origin` remain: host-supplied, never
page script, exact-match comparison, never a wildcard; `Origin: null` still rejected; the
`sec-fetch-site: same-origin` fallback for an absent header unchanged. The claim-carrying tests in
`kernel/tests/skp_admission.rs` — the port-derived default is not admitted, and admitted origin
plus a wrong token is refused (this ADR's Consequences, ADR-020:118-122) — were re-run unmodified
against this rewrite too (`git diff main -- kernel/` empty) and remain green (9/9). `kernel/` sits
inside the root Cargo workspace;
`frontends/shell/src-tauri` is deliberately `exclude`d from it (root `Cargo.toml`) and carries its
own lockfile — so these tests exercise `Session::with_origin`/`DataPlaneConfig::expected_origin`
directly, over a real socket, with no dependency on `frontends/shell` at all. What they carry is the
**accepted mechanism**, proven unaffected by this amendment; they say nothing about, and cannot
regress on, how `frontends/shell` computes the `String` it now passes into that mechanism — that is
what `origin.rs`'s own unit tests and this amendment's §(f) runtime evidence cover instead.

**(d) The E2E harness's independent `import.meta.env.DEV` gate, under `--debug`, stated
truthfully.** The specific disagreement this ADR's Decision named — the origin-selection mismatch
between `cfg!(debug_assertions)` (Rust) and `import.meta.env.DEV` (Vite) under `tauri build
--debug` — is **closed** by this amendment: origin is no longer selected by `debug_assertions` at
all, so there is nothing left for it to disagree with; under `--debug`, the config mirror reads
`tauri::is_dev()` (`false` — `--debug` still compiles with the `custom-protocol` feature) and pins
`http://tauri.localhost`, regardless of either gate's value. §(f)(ii) below observes this directly.

That said, the two gates remain independent mechanisms in this codebase for **other** purposes
untouched by this amendment, and under `--debug` those other purposes are **two different shapes**,
not one — corrected here after a re-check found the first draft of this paragraph stated one of them
falsely:

- **`lib.rs`'s `pool_poll` module (`#[cfg(any(debug_assertions, feature = "measure-build"))]`,
  `lib.rs:26`) is NOT dormant under `--debug` — it runs.** It has no frontend counterpart to be dead-
  code-eliminated at all; it is started from `commands::open_dataset`, a command with no `cfg` gate
  of its own (`commands.rs:61-66`: the command is always registered, and the poll-start call inside
  it is gated only on the same `any(debug_assertions, feature = "measure-build")` condition, which is
  true under `--debug`) and stopped from `commands::close_dataset` the same way (`commands.rs:114-
  120`). A `tauri build --debug` artifact therefore actually runs a 1,000 ms poll of the engine
  pool's lease counts into the session log for as long as a dataset stays open — real, observable
  behaviour, not inert code sitting unreached in the binary.
- **`commands::binding_publish_prepare_e2e_destination` IS the dormant-but-present shape** the first
  draft of this paragraph described for both: `#[cfg(debug_assertions)]`-gated at both its own
  definition (`commands.rs:409`) and its `lib.rs` handler-list entry (`lib.rs:391` — absent from a
  release build's handler list entirely, not merely runtime-disabled), while its sole frontend caller
  is gated by `import.meta.env.DEV` (`PublishPanel.tsx:294`: `if (!import.meta.env.DEV) return;`,
  false under `--debug`'s production `vite build`, so the calling code is dead-code-eliminated from
  the bundle). A `tauri build --debug` artifact ships this command with no frontend caller able to
  reach it.

Both are unrelated to origin admission and this amendment does not fix either. The packaged-
`--debug` admission check named just below exercises the origin fix specifically, not these
separate, still-open gate disagreements.

**Declared, not fully executed here:** the FULL packaged-`--debug` admission check — that a real
`tauri build --debug` artifact's webview is admitted by the data plane end to end, over a real
WebSocket upgrade — is preregistered as Part M's own row (M12, RELEASE-0.1.md Amendment 6's item 1
(b) preregistration) and runs on the artifact RELEASE-0.1.md's item 3 (the packaged build) produces.
This amendment's own §(f) below DOES observe the mirror and the post-load self-check agreeing under
both `tauri dev` and a `tauri build --debug --no-bundle` executable (built and run directly from the
target directory, not installed) — the same pinned-origin/self-check-ok log-line pair Part M's row
asserts — but not the third build mode (`tauri build`, undertaken at Part M on PR #31's real
packaged artifact) nor a live data-plane WebSocket upgrade against the `--debug` executable, which
this piece has no admission-mint harness wired to attempt in isolation.

**(e) Reopen condition, verbatim** (RELEASE-0.1.md Amendment 6's "Preregistration — item 1 (b)"):

> any future build mode whose origin Tauri does not resolve from `cfg(dev)` + config reopens this
> amendment rather than reintroducing a compile-time selector.

(E.g.: no `App`/`AppHandle` available at the point the origin must be known, or a consumer shape
whose window URL Tauri itself does not resolve from `cfg(dev)` + `tauri.conf.json`'s `build` section
at all. This condition **supersedes** the 2026-09-07 draft's own §(e), which named "webview origin
not readable at startup" — that condition no longer applies to a design that never reads the
webview at startup in the first place.)

**(f) Runtime evidence, executed once on 2026-09-08, on the config mirror + the post-load
self-check.**

**(i) `npm run tauri dev`** (`frontends/shell`, launched 10:09:40, closed 10:20:33 — both times
this worker's own; a cargo rebuild for this worktree's package id took the usual ~48s, per
`AI_DEVELOPMENT.md`'s "E2E from a worktree" mechanic). stderr and the session log
(`C:\Users\Christopher\AppData\Local\dev.spatialide.shell\logs\session-1788855035.log`) agree,
byte-identical, verbatim:

> `[spatial-ide-shell] data-plane expected origin (config mirror): http://localhost:5180`

and the session log's own self-check line, immediately after the page loaded:

> `1788855040015 info origin-self-check ok pinned=http://localhost:5180`

**(ii) `npx tauri build --debug --no-bundle`** (`@tauri-apps/cli` **2.11.4**; `--no-bundle` verified
present via `npx tauri build --help` before use: *"Skip the bundling step even if `bundle > active`
is `true` in tauri config"* — confirmed, so the packaged-`custom-protocol` build could be produced
and run directly without downloading WiX, matching `main`'s `tauri.conf.json:27`
`"targets": "all"`'s cost this piece must not pay). Built at
`C:\dev\spatial-ide\frontends\shell\src-tauri\target\debug\spatial-ide-shell.exe` (`dev` profile,
`custom-protocol` feature — `Finished` in 1m 53s). Run directly from the target directory, not
installed: launched 10:24:01, closed 10:24:13. The session log
(`session-1788855843.log`) carries, verbatim:

> `1788855843233 info data-plane expected origin (config mirror): http://tauri.localhost`
> `1788855843282 info origin-self-check ok pinned=http://tauri.localhost`

`http://tauri.localhost` (not `http://localhost:5180`) confirms the config mirror correctly took
the production branch under `--debug` — the EXACT case ADR-020's original Decision recorded as a
fail-closed defect under the retired `cfg!(debug_assertions)` selector (`debug_assertions == true`
on this artifact would have picked the dev-server origin under that selector; `tauri::is_dev()`
correctly reads `false`, since `--debug` still compiles with the `custom-protocol` feature that
sets `dev = false`). The self-check `ok` line proves the webview's own actual URL agrees with that
pinned value — the equivalence Part M's row M12 also asserts, on this same artifact and on the
`tauri build` one Part M produces from PR #31.

**(iii) A release `tauri build` is Part M's own step (RELEASE-0.1.md's item-1(b) preregistration
§ "Part M equivalence assertion"), executed on PR #31's artifact, not here** — this piece has no
packaged, bundled artifact to test against and building one here would risk the WiX download this
piece's own environment notes warn against.

Both (i) and (ii) show the SAME two-line shape (pinned-origin line, then `origin-self-check ok`
line) with different origins for different build modes, exactly as the config mirror's branches
predict — direct runtime confirmation that the mirror and the self-check agree, not merely that
each compiles and unit-tests correctly in isolation.

**Same-commit record updates:** `docs/02_Architecture.md:83`'s ADR-020 bullet and
`docs/README.md:27`'s conventions-paragraph ADR-020 sentence — both carrying a 2026-09-07 dated
correction describing the retired webview-URL-read design — are each rewritten/appended (in place,
`docs/02`'s the same way `docs/README.md`'s is appended rather than replacing the ADR-030/ADR-025
sentences the 2026-09-08 rebase added to that line) to describe this rewrite's config-mirror design
instead. `commands.rs`'s own two cross-references to this amendment's line numbers (§(d) above) are
corrected in place, in the same file this amendment lives in, since this whole amendment is being
freshly authored today rather than appended to accepted text (see this amendment's own opening
"Authorization and provenance" paragraph).

**History — the disproved pump design (2026-09-08 note, appended to the surviving record; the
design itself is not restored anywhere in this codebase).**

Between 2026-09-07 and 2026-09-08 this amendment briefly carried a different design, now disproved
and superseded by (b) above. Recorded here — not as a still-live alternative, but so a future reader
of `git blame`/`git log` on this file understands why a webview-URL-read design was tried and
abandoned, per `AI_DEVELOPMENT.md`'s "accepted ADRs ... a stale provenance field is worse than a
missing one" discipline applied to a design's own history, not only to acceptance dates.

- **2026-09-07, `df0650f`:** a single, unretried `Webview::url()` read inside `setup()`, before
  `serve()`. **Refused to start on its very first real `tauri dev` launch** — the webview's URL is
  `about:blank` at the instant `setup()` runs (navigation has been *issued*, via
  `webview.Navigate(&url)`, but has not yet *landed*), and `about:blank` has no host component, so
  `expected_origin_from_url` correctly, fail-closed refused it. Not a bug in the refusal path — a
  genuine gap: a real value existed nowhere yet to read.
- **A sleep-only retry (no message pumping) was tried and empirically disproved**, the same
  evidence-gathering pass: 50 attempts over 5 seconds, all failed, because WebView2 delivers its
  navigation-completion notification entirely via posted Win32 window messages
  (`webview2-com` 0.38.2's own doc comment on `wait_with_pump`: *"The WebView2 threading model runs
  everything on the UI thread, including callbacks which it triggers with `PostMessage`"*) — nothing
  pumps this thread's message queue between `Navigate()` returning and `setup()` returning, so a
  plain sleep genuinely cannot observe the navigation land.
- **`5d22d7a` added a Win32 message pump** (`PeekMessageW`/`TranslateMessage`/`DispatchMessageW`
  with `PM_REMOVE`, non-blocking, called once per retry attempt, 250 attempts × 20 ms) — this
  "fixed" the symptom, and did produce a working, evidence-backed runtime record (an admitted
  WebSocket upgrade, real batches rendered). Its costs, found by the architect's re-check
  (`DECISIONS-PENDING.md` entry 55, `RELEASE-0.1.md` Amendment 4 in full): a direct `windows` 0.61.3
  target dependency (the crate's only new `Cargo.lock` edge); the crate's only `unsafe` block; and,
  substantively, **an IPC window before `setup()` returns**. tao itself buffers window events
  re-entrantly during `setup()`, but WebView2's own IPC delivery (`add_WebMessageReceived` →
  `create_ipc_handler` → tauri's `ipc::protocol::message_handler`) runs over the SAME posted-message
  queue the pump drains — meaning page script could, in principle, dispatch a Tauri command before
  `app.manage(...)` had registered the state that command needs. Every state-taking command would
  fail cleanly (`State<'_, T>`'s own `InvokeError` on missing state), but `binding_pick_file` (a
  native OS file picker, ADR-024's own class-3 external-effect boundary) takes no managed state and
  was reachable in that window. The amendment's own condition-1 argument ("the only navigation ever
  issued before the read is the host-configured one") had been airtight because *nothing pumped*;
  with a pump, it became a timing property dressed as a structural one.
- **Two gates (architect design review, reviewer text/mechanism review) both FAILED the pump
  design** on exactly this finding, reaching `AI_DEVELOPMENT.md`'s "two failed attempts → stop,
  record, queue for the human" rule. `DECISIONS-PENDING.md` entry 55 queued the design choice —
  keep the pump (accept the `windows`/`unsafe`/IPC-window costs) vs. switch to a pure config mirror
  — to the human, with the architect's own recommendation already for the mirror.
- **The human's ruling, 2026-09-08 (entry 55 = "(b)"), quoted in full in this amendment's own
  opening "Authorization" paragraph above**, selected the config mirror, named the new mechanic
  ("never block or pump inside `setup()`", now recorded in `AI_DEVELOPMENT.md`'s custodian
  mechanics), and this amendment's current (b)/(f) text is that ruling's content. The pump, its
  `pump_pending_windows_messages` function, its `windows` dependency, and its retry loop are removed
  from this codebase entirely — not merely superseded in this file's prose.
