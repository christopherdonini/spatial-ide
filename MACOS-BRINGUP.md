# macOS bring-up kit

**For:** the human, sitting at the 2019 MacBook Pro 13" (docs/07's open macOS/WKWebView hardware
gate, waiting for exactly this hardware). This document gets that machine from nothing installed to
the running shell app, and names what running it does and does not prove.

**What this is not.** Running the app on this Mac and clicking through the walkthrough is
**operator-verified bring-up**, not the docs/07 hardware-validation gate. That gate's own wording
(`docs/07_Roadmap.md`): *"ADR-003's acceptance on \[macOS/Linux] is architecture-level only — every
measured number in the spike (frame time, picking latency, precision, cancellation) is
Windows/WebView2/ANGLE-D3D11 evidence... and does not transfer by assumption... this gate is not
closed by CI going green"* — nor, by the same logic, is it closed by an operator walkthrough. Closing
it needs the spike's own measured probes (frame time, picking latency, precision, cancellation) run
and recorded on this hardware, with the spike's own discipline. Nothing in this document does that.
What this document *does* produce is real evidence of a different, narrower kind: does the app build,
launch, and render at all under WKWebView — the first time that has ever been observed on real
hardware. Record deviations plainly; they are findings, not failures (see "If it fails" below).

---

## 1. Prerequisites

Run these once, in order.

1. **Xcode Command Line Tools** (clang, make — this is also what `duckdb`'s bundled C++ build needs;
   no separate cmake install required, see the caveats section):
   ```
   xcode-select --install
   ```
   Follow the GUI prompt that appears; it downloads in the background.

2. **Homebrew** (needed to install Node the easy way; skip if already present):
   ```
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```
   Follow its own printed instructions to add `brew` to your shell PATH (it prints the exact lines
   for your shell at the end of the install).

3. **Rust (stable toolchain)**, official installer:
   ```
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```
   Accept the default (stable) profile. Restart the terminal, or `source "$HOME/.cargo/env"`,
   afterward.

4. **Node LTS**:
   ```
   brew install node
   ```
   (Alternative: download the LTS installer from nodejs.org directly, if you'd rather not use
   Homebrew for this.)

5. **Git access to the private repo.** This repository is private — either:
   - `gh auth login` (install with `brew install gh` first) — see GitHub's own CLI docs for the
     interactive flow: https://cli.github.com/manual/gh_auth_login, or
   - an SSH key added to your GitHub account — see
     https://docs.github.com/en/authentication/connecting-to-github-with-ssh

   Either route makes `git clone` below work; which one is a matter of preference, not covered
   further here.

## 2. Clone, build, run

```
git clone git@github.com:christopherdonini/spatial-ide.git
cd spatial-ide/frontends/shell
npm install
npm run tauri dev
```

**Expected first-build time: plausibly 30-60+ minutes.** This is expectation-setting, not a
measurement — nothing has been timed on this class of hardware. The long pole is `duckdb`'s bundled
C++ build (`engine`'s `duckdb = { features = ["bundled", ...] }` — a large vendored C++ tree compiled
from source via the `cc` crate, once, and cached in `target/` after). A 2019 i5/i7 13" MacBook Pro is
meaningfully slower at this than the Windows dev machine this codebase has been built on so far —
budget the time, don't interrupt it, and if it is still running after an hour that is itself a
finding worth recording (not necessarily a failure — first `cargo build` of a large vendored C++ tree
is genuinely slow on modest hardware). Every build after the first is fast (only this crate's own
sources rebuild).

When it finishes, a window titled "Spatial IDE" opens with an "Open GeoParquet…" button. That is the
bring-up succeeding.

**Session log location on macOS:** the app writes a session log via Tauri's `app_log_dir()`, which
resolves on macOS to
```
~/Library/Logs/dev.spatialide.shell/session-<timestamp>.log
```
(`dev.spatialide.shell` is this app's bundle identifier, `frontends/shell/src-tauri/tauri.conf.json`;
the resolution itself is verified against the vendored `tauri` crate's own source,
`tauri-2.11.5/src/path/desktop.rs`: macOS uses `~/Library/Logs/<bundle identifier>`, distinct from
Windows' and Linux's `<local-data-dir>/<bundle identifier>/logs`). The app also prints this exact
path to its own stdout/stderr on startup (`frontends/shell/src-tauri/src/lib.rs`: `eprintln!("[spatial-ide-shell] session log: ...")`) — read it from the terminal `npm run tauri dev` is running in if in doubt.

## 3. What to run once it opens

The validation instrument here is the same one this codebase already uses for a human at the
keyboard: **`frontends/shell/MANUAL-WALKTHROUGH.md`, Parts A through F.** Follow it exactly as
written, step by step, recording pass/fail and any deviation verbatim — that is its own stated
evidence class (**operator-verified**), and on this hardware it is also the **first WKWebView run
this codebase has ever had**, so deviations from what the doc predicts are data, not noise.

Parts G/H (publish, and the 5 GB at-scale slice) are **not** in this bring-up's scope — they are
heavier, later-cut material; if you want to go further after A-F succeed, that's a separate decision,
not something this document is asking for.

**Fixtures must be regenerated ON the Mac.** `target/` is not in git (`.gitignore`), so every fixture
Parts A-F need has to be built fresh, from the committed generator, on this machine. From
`spatial-ide/` (repo root):

```
cargo test -p spatial-kernel --test manual_walkthrough_fixtures -- --ignored --nocapture
```
regenerates the four Part A-D fixtures (100k happy path, no-CRS, missing-identity, over-ceiling).
Then, for Part E's two fixtures specifically:
```
cargo test -p spatial-kernel --test manual_walkthrough_fixtures generate_the_filter_fixture -- --ignored --nocapture
cargo test -p spatial-kernel --test manual_walkthrough_fixtures generate_the_slow_filter_fixture -- --ignored --nocapture
```
Part F reuses Part E's `filter-zoned.parquet` fixture — no separate fixture of its own. (Exact paths
and purposes: `MANUAL-WALKTHROUGH.md`'s own "Prerequisites" and Part E fixture tables — the commands
above are copied from there verbatim, not re-derived.)

Part F's own F7 step ("the hero round-trip") is written in Windows syntax throughout — backslash
paths, a `.exe` suffix, PowerShell/`cmd` — since it was authored on the Windows dev machine. On the
Mac, translate mechanically: `cargo build -p spatial-kernel --bin publish-bundle` still builds the
same binary, just without `.exe` (invoke it as `./target/debug/publish-bundle` from a normal Terminal
shell); replace every `C:\dev\spatial-ide\...` path with the repo's actual path on this machine using
forward slashes. The flags and the binary's behavior are unaffected — only the shell syntax around
them is Windows-specific.

## 4. Known platform caveats (from the audit below)

| Symptom | Disposition |
|---|---|
| `cargo test`/`cargo build --workspace` from repo root | **Expected to succeed unmodified.** No workspace member (`engine`, `protocol/data-plane`, `protocol/skp`, `renderer`, `kernel`) depends on a Windows-only crate (`windows-sys` etc. — only the workspace-**excluded** `protocol/transport-bakeoff` crate does, and it is never built by `--workspace`). Every `GetProcessIoCounters`/`K32GetProcessMemoryInfo` Windows measurement site is `#[cfg(windows)]`-gated with a `#[cfg(not(windows))]` fallback that returns `None` (never a fake zero) — those tests compile and run on macOS, they simply report the measurement as unavailable rather than failing. See the audit table below for every site. |
| A **packaged** (`tauri build`) macOS run's data plane refuses every WebSocket upgrade (`403 origin`) | **Known, fail-closed, by design — dev mode only bring-up.** ADR-020's origin admission hard-codes `http://tauri.localhost` as the packaged-build expected origin (`frontends/shell/src-tauri/src/lib.rs`), which is Tauri's default custom-protocol origin **on Windows/WebView2 only**. On macOS, a packaged Tauri app's webview origin is `tauri://localhost`, not `http://tauri.localhost` — so a packaged macOS build's own webview would never match the origin the data plane expects, and every stream would be refused closed (never open-but-wrong; ADR-020's own admission model fails closed). This bring-up kit only asks you to run `npm run tauri dev` (dev mode), where the origin is the fixed `http://localhost:5180` dev-server origin, unaffected by this — **do not attempt `tauri build` on this Mac and expect the data plane to work; that is a known, recorded gap, not something to debug.** |
| `npm run e2e:*` (any of the `e2e/*.mjs` suites) | **Does not run on macOS at all — do not attempt it.** The whole harness drives the app over the Chrome DevTools Protocol (`playwright-core`'s `chromium.connectOverCDP`, `frontends/shell/e2e/lib.mjs`) against a `--remote-debugging-port` flag WebView2/Chromium honors. macOS Tauri apps use WKWebView (Safari's engine), which has **no CDP support** at all — there is no equivalent flag, and no amount of config translates this harness to macOS. The operator walkthrough (`MANUAL-WALKTHROUGH.md`) and the Rust unit/integration test suites are the macOS validation instruments; the E2E suites simply have no macOS counterpart in this codebase today. |
| Windows-literal paths in `MANUAL-WALKTHROUGH.md` Part F/G (`C:\dev\spatial-ide\...`, `publish-bundle.exe`, PowerShell/`cmd` framing) | **Cosmetic — translate mechanically, not a functional gap.** See §3 above. |
| Audit log default location differs from macOS convention | **Functionally correct, just not the macOS-idiomatic path.** `kernel/src/permission/audit/log.rs::data_dir()` resolves the audit log's parent directory via `XDG_DATA_HOME`, falling back to `$HOME/.local/share`, on any non-Windows target — so on an unconfigured Mac the publish audit log lands at `~/.local/share/spatial-ide/audit/publish.jsonl`, not the more idiomatic `~/Library/Application Support/...`. This is a deliberate, documented choice (avoiding a `dirs` crate dependency, per the function's own doc comment), not a bug — the directory is created on demand and the log works correctly there. |
| `protocol/transport-bakeoff` (ADR-012 evidence crate) | **Not part of this bring-up at all.** Deliberately excluded from the Cargo workspace (root `Cargo.toml`); it hard-codes Windows Edge install paths (`protocol/transport-bakeoff/src/main.rs`) and depends on `windows-sys`. It is decision evidence pinned to the Windows trees it was measured on, not a module this bring-up needs to build or run — ignore it entirely. |

## 5. If it fails — triage

- **A `link.exe`-not-found-shaped error, or any C/C++ compiler error during `cargo build`:** the
  Xcode Command Line Tools are missing or incomplete. Re-run `xcode-select --install`, or (if it
  claims CLT is already installed but builds still fail) `sudo xcode-select --reset` then re-install.
- **Port 5180 already in use:** unlikely on a fresh Mac (5180 was chosen originally to dodge a
  *Windows* excluded-port range, `frontends/shell/vite.config.ts`'s own comment — that constraint is
  Windows-specific and does not apply here). If it does happen, whatever is holding the port is a
  local conflict on this machine, not a defect in this codebase; free it or set `VITE`'s dev server
  port via `vite.config.ts` for a one-off local override (do not commit that change).
- **WebKit-specific rendering oddities — a shape, color, or layout differing from what
  `MANUAL-WALKTHROUGH.md` predicts, deck.gl/WebGL artifacts, font/layout differences, anything that
  "looks wrong":** **record it verbatim rather than trying to fix it.** This is the first time this
  app's canvas has ever run under WKWebView. A deviation here is exactly the kind of finding the
  docs/07 hardware-validation gate exists to surface eventually — it is data, not a bug report against
  yourself. Note what you saw, the exact step, and move on; do not attempt to patch renderer code to
  make a first WKWebView observation match Windows/WebView2 behavior without that being its own,
  separate, deliberate piece of work.
- **The app window never opens / `npm run tauri dev` exits with an error before anything renders:**
  copy the terminal's full output verbatim into the result log — this is the single most useful
  artifact for diagnosing a first-run failure remotely.

---

## Audit method (for reference)

The caveats above come from a read-only grep-and-verify pass over the tree: every
`cfg(windows)`/`cfg(target_os)` site, every `GetProcessIoCounters`/process-memory measurement site,
the ADR-020 origin selection, path-handling literals, the port-5180 choice, and the E2E harness's CDP
dependency were each located and read at the cited file:line before being written up above. Nothing
in this section is a code change; this document and this section are the audit's only output.
