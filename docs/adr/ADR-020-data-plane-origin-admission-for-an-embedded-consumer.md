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

## Amendment 1 — the tauri build --debug origin selector replaced (2026-09-07, appended on the human's pre-approval)

**Authorization.** RELEASE-0.1.md Amendment 2's "Preregistration — item 1" records the human's
five conditions on design (a)+(b) and states *"ADR-020 Amendment 1 pre-approved in that shape"*
(DECISIONS-PENDING entry 54). This amendment is appended in that pre-approved shape, in the same
commit as the code it records.

**(a) The Status-paragraph sentence this amendment discharges, quoted verbatim:**

> The `tauri build --debug` origin mismatch recorded under Decision stays explicitly recorded as a
> **fail-closed implementation defect, owed before any packaged-debug support is claimed**.

**(b) The new selector.** `frontends/shell/src-tauri/src/lib.rs`'s `setup()` closure no longer
selects `webview_origin` from `cfg!(debug_assertions)`. It now reads the shell's own main webview
window's *actual* URL, once, before any page script can run (`setup()` itself is synchronous and
blocking; Tauri does not pump the event loop, and therefore cannot run page script, until this
closure returns), via:

- **API:** `tauri::Webview::url(&self) -> tauri::Result<Url>` — **tauri 2.11.5** (pinned in
  `frontends/shell/src-tauri/Cargo.lock`), doc comment `"Returns the current url of the webview."`,
  defined at `src/webview/mod.rs:1679-1680`. `lib.rs` reaches it through
  `tauri::WebviewWindow::url()` (`src/webview/webview_window.rs:2378-2381`, itself a one-line
  forward to `Webview::url()`), obtained from `app.get_webview_window(label)`
  (`Manager::get_webview_window`, `src/lib.rs:576`) using the label `tauri.conf.json`'s
  `app.windows[0]` declares.
- **Normalisation:** a new pure function, `expected_origin_from_url(&Url) -> Result<String,
  OriginError>` in its own module (`frontends/shell/src-tauri/src/origin.rs`), reduces the URL to
  exactly `scheme://host` or `scheme://host:port` — dropping path, query, fragment, and userinfo,
  and never appending a scheme's implicit default port.
- **Pinning:** the resulting `String` is used exactly once, as `DataPlaneConfig::expected_origin`,
  for the process's whole lifetime — the same field and the same `Session::with_origin`
  constructor this ADR's Decision already defined; neither changed.
- **Fail-closed:** if the configured window does not exist at setup time, if its URL cannot be
  read, or if that URL has no host component (e.g. `about:blank`), `setup()` panics with a named,
  descriptive message identifying which of the three happened — never a default value. An empty or
  otherwise unparseable URL string is refused one step upstream of this code, inside
  `Webview::url()` itself (`url.parse().map_err(crate::Error::InvalidUrl)`,
  `src/webview/mod.rs:1685`), which surfaces as the same `Err` path and the same fail-closed panic.

Design (b) — the dev origin's single declared source: `vite.config.ts`'s `server.port` remains the
declared source (it always was: `vite.config.ts`'s own top comment already states the port choice
and why); `tauri.conf.json`'s `build.devUrl` is the one remaining hand-written copy of it.
`lib.rs` no longer carries a third copy at all — `5180` does not appear anywhere in that file. The
mechanical link the preregistration requires is a new `npm run check:dev-origin`
(`frontends/shell/e2e/checkDevOriginConsistency.mjs`), wired into `npm run verify` ahead of
`build`: it reads both files as text/JSON (no code execution) and fails if `devUrl` does not equal
`http://localhost:<server.port>`. A unit test was considered and rejected in favor of this
`check:*` script, following `check:dist-clean`'s own existing precedent (`e2e/checkDistClean.mjs`):
the relationship being asserted is between two config files, neither of which is application
source under test, and `npm run verify`'s pipeline already has a `check:*` stage for exactly this
shape of drift check.

**(c)** Verbatim, as required:

> the accepted mechanism is unchanged; this replaces a selector the acceptance never covered.

`DataPlaneConfig::expected_origin` / `Session::with_origin` remain: host-supplied, never
page script, exact-match comparison, never a wildcard; `Origin: null` still rejected; the
`sec-fetch-site: same-origin` fallback for an absent header unchanged. The claim-carrying tests in
`kernel/tests/skp_admission.rs` — the port-derived default is not admitted, and admitted origin
plus a wrong token is refused (this ADR's Consequences, ADR-020:118-122) — were re-run unmodified
against this change and remain green.

**(d) The E2E harness's independent `import.meta.env.DEV` gate, under `--debug`, stated
truthfully.** The specific disagreement this ADR's Decision named — the origin-selection mismatch
between `cfg!(debug_assertions)` (Rust) and `import.meta.env.DEV` (Vite) under `tauri build
--debug` — is **closed** by this amendment: origin is no longer selected by `debug_assertions` at
all, so there is nothing left for it to disagree with; under `--debug`, the webview's own URL is
read directly and normalises to `http://tauri.localhost` regardless of either gate's value.

That said, the two gates remain independent mechanisms in this codebase for **other** purposes
untouched by this amendment, and they still disagree under `--debug` exactly as this ADR's Decision
section describes in general (`cfg!(debug_assertions)`, Rust, vs. `import.meta.env.DEV`, Vite, "are
independent mechanisms"): `lib.rs`'s `pool_poll` module and the E2E test seam command
`commands::binding_publish_prepare_e2e_destination` are both still gated by
`#[cfg(debug_assertions)]` (true under `--debug`, a packaged-but-debug build), while their
frontend-side counterparts are gated by `import.meta.env.DEV` (false under `--debug`'s production
`vite build`, so their frontend callers are dead-code-eliminated from the bundle). A `tauri build
--debug` artifact therefore still ships Rust-side debug-only surface with no frontend caller
reaching it — dormant, not reachable at runtime, but present in the binary. This is the same
general shape ADR-020 already named; it is unrelated to origin admission and this amendment does
not fix it. The packaged-`--debug` admission check named just below exercises the origin fix
specifically, not this separate, still-open gate disagreement.

**Declared, not executed here:** a packaged-`--debug` admission check — that a real `tauri build
--debug` artifact's webview is admitted by the data plane end to end — is preregistered
(RELEASE-0.1.md's item 1 preregistration) and runs as a Part M step on the artifact
RELEASE-0.1.md's item 3 (the packaged build) produces; it is not exercised by this piece, which
has no packaged artifact to test against.

**(e) Reopen condition, verbatim:**

> any future build mode whose webview origin is not readable at startup reopens this amendment
> rather than reintroducing a compile-time selector.

(E.g.: no `App`/`AppHandle` available at the point the origin must be known, or a consumer shape
with no webview to read a URL from at all.)

**Same-commit record updates:** `docs/02_Architecture.md`'s ADR-020 bullet and
`docs/README.md`'s conventions-paragraph ADR-020 entry — both of which stated the `--debug` defect
as owed — each gain a dated bracketed correction in place, in the style `docs/02`'s own ADR-009
bullet already uses, rather than being rewritten.
