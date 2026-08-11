# ADR-020 — Data-Plane Origin Admission for an Embedded-Webview Consumer

**Status:** Proposed — **binds nothing until accepted.** Not architect-blockable. `frontends/shell`
implements it today because, without it, every data-plane WebSocket upgrade this shell attempts is
refused (`403 origin`) and no batch can ever reach the canvas — the same standing under which
ADR-019 implements ahead of acceptance: the *implementation* is licensed by already-accepted
ADR-012's provisional transport and `docs/09`'s posture, neither of which this ADR removes or
weakens.
**Drafted by:** the architect, consulted mid-cut after the Custodian traced a "canvas renders
nothing" walkthrough failure to this cause (`frontends/shell` cut 1, 2026-08-11).
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
unchanged. **The session token remains the primary credential** — this ADR touches origin admission
only, not authentication.

`frontends/shell/src-tauri/src/lib.rs` supplies `http://localhost:5180` under `cfg!(debug_assertions)`
(matching `tauri dev`) and `http://tauri.localhost` otherwise (a packaged build) — a compile-time
distinction, not a runtime guess.

## Consequences

- **In dev, this admits any page a locally running Vite dev server on port 5180 serves**, not
  provably only `frontends/shell`'s own page. Windows' one-process-per-port binding makes an
  impersonating dev server on the same port unlikely but not impossible on a shared machine. This is
  dev-only — `cfg!(debug_assertions)` false in a packaged build — and is recorded here rather than
  assumed away.
- ADR-012's threat model gains a named consumer class: "embedded webview, different origin, same
  process, still loopback-only." Its own text should be amended to say so if this is accepted.
- `session.rs`'s existing rejection tests keep their `localhost`-is-not-`127.0.0.1` assertion
  unchanged; new tests assert a declared foreign origin is admitted and the port-derived default is
  not, both via `Session::with_origin` directly and end-to-end over a real socket
  (`kernel/tests/skp_admission.rs`).
- No wire, frame, or SKP-level change. `protocol/skp` and `SKP-V0.md` are untouched.

## If accepted

- This file's status line updates to Accepted, dated.
- ADR-012 gains a short amendment naming the embedded-webview consumer class and pointing here.

## If rejected

- `frontends/shell`'s data-plane connection needs a different mechanism to reach an admitted
  origin — e.g. serving the shell's own frontend from the data-plane process after all
  (`static_dir`), which ADR-019's Context section already gives reasons to have avoided. Whatever
  replaces this decision, the shell cannot render anything until *some* fix lands: this is not
  optional cut-1 polish.
