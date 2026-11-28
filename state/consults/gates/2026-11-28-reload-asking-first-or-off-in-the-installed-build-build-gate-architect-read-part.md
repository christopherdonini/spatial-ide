# The reload keys' Part A, the architect's build gate, the read part, at 5174676a (node:reload-asking-first-or-off-in-the-installed-build@build-gate-architect-read-part)

*Filed by the custodian at the report path its brief named. The architect (Opus) read main at 9d513c97 in D:/wt/read-1128g and the head 5174676a in D:/wt/read-keys. By the facts script its records run from 2026-11-28T06:37:03Z to 2026-11-28T06:47:34Z, and 1 of its calls ran with the main checkout as its working folder, the shell's start folder. By its completion notice it took 630730 ms and 67 tool uses. It gives no verdict and no gate-log row. Its hand-back is below as received, with the harness indent removed: 28317 bytes, sha256 87e92268a04ce7a97960d9ea81633985d1676a95e330cbfbd27e71e22ae407fe. Its words are the architect's.*

---

READ PART (no verdict word, no gate-log row): cut/reload-asking-first-or-off-in-the-installed-build @ 5174676a3028238214cc1144a2d333ed82685d02, against main @ 9d513c97e8688ccc77efb76edf5311cf10848f45

Cites into the code are read at 5174676a (D:/wt/read-keys). Cites into the form, the rulings and the reports are read at main 9d513c97 (D:/wt/read-1128g). Crate cites are under `<profile>/.cargo/registry/src/index.crates.io-1949cf8c6b5b557f/`, with the crate name and version. The Grep tool reported its hits in that folder under D:/caches/cargo-registry/src/…, so the folder resolves there; I read only through the given path. `<scratch>` is the custodian's scratch folder. Nothing below is a quotation unless it is marked verbatim (byte-copied from a Read). Everything else is paraphrase.

## 0. The locators

- I have no shell, so I did not recompute the byte sizes or sha256 of `<scratch>/keys-diff.txt` and `<scratch>/keys-numstat.txt`.
- Their contents agree with the files. Each file's `+` count in the diff matches the numstat row (6, 41, 38, 327, and 3/2). The added lines of `webview_chrome.rs` and of the `lib.rs` region read the same in the head files.
- There are 5 paths, all in Scope: `webview_chrome.rs`, `lib.rs`, `source-watch-idle.mjs`, `e2e/README.md`, and `scripts/plan/cfg-boundary.test.mjs` (class 9, Amendment 8 item 3).

## 1. §10's architect list

- **§2 against ADR-037's first not-decided bullet** (ADR-037 at the head, the "What this ADR does not decide" first bullet). §2 is met.
  - Option (iv) is reached by a third route that the bullet does not list: `with_webview` plus inherent WebView2 methods, since neither a builder call nor a config key exists (F-2).
  - Part A adds no crate, feature or lock change (the numstat has no Cargo path), so under the bullet's own rule it is product code under a form.
  - The bullet's not-established item (what the release menu shows) stays not established.
  - The bullet's last sentence holds: §3's end is untouched (`page.rs` is not in the diff). The ADR amendment records the route (§6 below).
- **docs/01, never block the canvas.** Kept.
  - `setup()` runs inside Ready on the main thread (tauri-2.11.5 `src/app.rs:1423-1424`).
  - There `with_webview` handles the message inline (tauri-runtime-wry-2.11.4 `src/lib.rs:239-248`, `:3993`, `:4030-4036`).
  - So the closure runs once, inside the call, before the event loop pumps. It makes four in-process COM property calls and one `SessionLog::append`, an uncontended mutex and a file write (`state.rs:68-79`). Nothing in it waits, pumps or takes a lock.
- **ADR-006.** No class.
  - The piece writes no project file and records no step.
  - The setting is per-webview runtime state, not persisted by this code.
  - The only write is the host's session-log line, ADR-037's own precedent (its "ADR-006 classes" consequence).
  - No undo claim is made.
- **docs/02.** Kept. The piece is in `frontends/shell/src-tauri`, and it configures the client's own webview. It holds no data logic, and nothing crosses SKP, the data plane or MCP (`docs/02_Architecture.md:14`, `:24`).
- **The caller rule.** Met.
  - Every new item has a product call chain rooted in `setup()`:
    - `setup()` calls `chrome_for` (`lib.rs:616`), `reach` inside the `with_webview` closure (`lib.rs:638`), and `log_entry` through `note` at all three sites (`lib.rs:620`, `:625`, `:638`, `:641`);
    - `reach` builds `Live` and calls `apply` (`webview_chrome.rs:171-175`);
    - `log_entry` calls `readback_line` (`:119`).
  - A product caller reached through a product chain is a product caller. The rule bars test-only callers, not indirect ones. So Amendment 7 item 3's account (`apply` through `reach`, `readback_line` through `log_entry`) meets the rule.
  - Every item is `pub(crate)` or private. The fake is under `#[cfg(test)]` (`:184`).
  - §10's caller-rule sentence, as D7 rewrote it, says these items have `setup()` as their caller. That is true only of the root caller, and it leaves out `reach` (finding D-3).
- **§10's docs search.** On main, a case-insensitive search of docs/ for `context menu|accelerator|devtools|reload` finds only `docs/adr/ADR-035-dataset-session-ended-control-plane-event.md:133`. True. At the head it also finds ADR-037 and `docs/README.md`, which come from B.

## 2. OPEN-5: the named posture check (ADV-2026-11-26-18 item 3)

**Part A at 5174676a does not change the security posture, and this read leaves no change it cannot rule out on the check's terms.** Nothing goes to the human under §9 item 1 on this check. It rests on these lines:

- **Network access:** none. No network call is in `webview_chrome.rs` or in the `lib.rs` region at `:610-645`.
- **Listening sockets:** none added. The measure-build CDP block (`lib.rs:590-608`) appears in the diff only as context.
- **How the data plane admits a consumer (ADR-020 with its Amendment 1):** unchanged.
  - `DataPlaneConfig` (`lib.rs:489-508`) and `PinnedOrigin` (`:534-537`) are not in the diff.
  - The new code reads `main_window_config.label` and writes nothing that is pinned.
  - The `on_page_load` closure (`:271-342`), with its self-check, is untouched.
- **ADR-027 decision 4:** the handler list (`lib.rs:654-677`) is not in the diff, and no command is added.
- **`capabilities/`, `tauri.conf.json`, `Cargo.toml` and `Cargo.lock`:** not in the numstat.
- **docs/09:** local-first holds. Its rule that actions are logged gains one line. CSP is unchanged.
- **`unsafe`:** four calls, each wrapping only the WebView2 call (`webview_chrome.rs:158`, `:163`, `:167`). They are the same `Settings` calls wry makes on the same object at creation (wry-0.55.1 `src/webview2/mod.rs:569-571`), and they run on the main (STA) thread. The block-on-sight item from D5 is not engaged.
- **What changes:** the installed webview's default context-menu setting. That can only remove routes. What the runtime's menu offered is not known (F-8), but switching it off adds no route.

## 3. ADV-2026-11-28-09 item 5

**(a) When the setting takes effect: the sources do not show whether it comes before or after the first document's NavigationStarting.** What they do show:

- **The first navigation is requested before the shell's call.** tauri builds each `create: true` window (`app.rs:2524-2526`) before it runs the user's closure (`:2530-2531`). Building the window runs `init_webview`, which calls `webview.Navigate(&url)` (wry `src/webview2/mod.rs:531`). That call comes after wry's own settings (`:463`, `:571`).
  - The measure build is the same: its block builds the window (and so navigates) before the new region.
- **The host's NavigationStarting handler cannot run before the shell's call.**
  - tauri always installs a navigation handler (tauri-2.11.5 `src/manager/webview.rs:580`), and wry registers it on `NavigationStarting` (`mod.rs:674-693`).
  - That handler runs on the UI thread only when the thread dispatches messages.
  - The shell's call runs inline in `setup()`, before the event loop pumps.
  - On the paths I read between `Navigate` and the call, nothing waits on messages. The `wait_with_pump` calls (`mod.rs:363`, `:414`) come before `Navigate`, and `block_on(serve…)` is tokio's.
- **Not shown:**
  - I did not read every callee on that path, for example the plugins' setup hooks and the rest of tauri's window build, so I cannot rule out a message wait there;
  - and, more important, when the WebView2 runtime fixes a navigation's settings, compared with the host's handler. That is the runtime's.
- **What Microsoft's pages say** (the filed reading, lines 30-31; paraphrase):
  - one sentence says changes made after NavigationStarting apply from the next top-level navigation;
  - the sample comment says changes apply at the next navigation, including the one after a NavigationStarting event.
  - Read together, they lean toward the change applying to the first document. They do not settle it.
- **Consequence:**
  - §1's third may-not-claim stays as it is.
  - The read-back line reads the setting, not its effect, so `context_menus=off` can stand beside a first document that still shows the menu.
  - The amendment and the KNOWN-LIMITATIONS item say so.
  - The human's right-click is the only observation that settles it. See R-1 for its order.

**(b) The `cfg(not(windows))` stub: it stands, and five forms are more than needed, but I do not ask for the change.**

- **Why it stands.** `lib.rs:638` calls `reach` with no cfg, so the crate needs some `reach` off Windows. `PlatformWebview` exists on every platform under feature `wry` (tauri-2.11.5 `src/webview/mod.rs:149-151`), but `controller()` exists only on Windows (`:178-184`). So the stub (`webview_chrome.rs:178-182`) is the right shape. Its caller is the same product line, and it names no claim.
- **The five forms** are at `webview_chrome.rs:20`, `:125`, `:131`, `:155` and `:179` (the cfg-boundary worker's list).
  - `Live` and its impl hold no Windows type (two `&dyn Fn` closures returning the module's own `ChromeError`).
  - The `use` at `:20` can be the full path, as the stub already uses.
  - So two forms (`reach` and its stub) would be enough.
  - If a correction changes this, the cfg-boundary numbers change in the same commit (Amendment 8 item 3).
- **The stub is compiled by no build of ours.** `product-ci-shell.yml:171` and `tauri-build.yml:30` run on `windows-2022`, and `product-ci-rust.yml:28-29` excludes the shell off Windows. Off Windows it would write `webview-chrome not-applied` at `error` at each start. Its source comment should say so (D-2).
- **§1's line claim does not need the off-Windows case named.**
  - §1 claims only "for the shipped Windows build" (form §1, its first sentence), and its may-not-claim list excludes macOS and Linux.
  - Nothing goes to the advisor on (b).
  - The ADR amendment names the case (§6 item 4).

**(e) The lines over the ceiling: 417 against 330, so 87 over.** Against §7's estimates for the files built so far (241 lines), by file:

| File | Estimate | Actual | Over | Where it comes from |
|---|---|---|---|---|
| `webview_chrome.rs` | 190 (code 80, tests 110) | 327 | +137 | See below |
| `lib.rs` | 12 | 38 | +26 | See below |
| `source-watch-idle.mjs` | 35 | 41 | +6 | E3's reader function |
| `README.md` | 4 | 6 | +2 | DOC-1's new entry |
| `cfg-boundary.test.mjs` | 0 | 5 | +5 | Class 9 |

- **`webview_chrome.rs`, product part (lines 1-183):**
  - module doc 15 lines;
  - `Value`, `Readback` and `Outcome` (`:39-69`), from §2's on/off/unread read-back and EV-2's outcome;
  - `ChromeError` and the trait (`:71-82`), from A3;
  - `log_entry` (`:114-121`), from EV-2;
  - `Live` and its impl, with DOC-2's key stubs and their ruled comment (`:123-149`), from A1, DOC-2 and ADV-2026-11-28-05 item 1;
  - `reach` (`:151-176`), from A1.
- **`webview_chrome.rs`, tests (`:184-327`, 144 lines):** U-1 to U-6. §4 planned 4 tests, and EV-2 added U-5 and U-6.
- **`lib.rs`:** the `note` closure, the three-arm match from ADV-2026-11-28-04's not-applied cases, and the 9-line source comment that ADV-2026-11-28-04 item 1 and ADV-2026-11-28-05 item 2 order.
- **Outside §2's plan:** only the `cfg(not(windows))` stub and the cfg attribute lines, about 9 lines (`webview_chrome.rs:20`, `:125`, `:131`, `:155`, `:178-182`). The stub is a code path inside a Scope file, not a scope addition. Everything else traces to §2 as amended (A1, A3, D2 with the -04 and -05 fences, DOC-2, EV-2 and E3).
- **Still to come:** the ADR amendment (the draft below is about 30 lines) and the KNOWN-LIMITATIONS item. Both add to the count, and it stays class 8 at the count.

## 4. Seams, each from the real shape at the head

- **`WebviewWindow::with_webview`** (tauri-2.11.5 `src/webview/webview_window.rs:2371-2376`) takes `FnOnce(PlatformWebview) + Send + 'static` and returns `crate::Result<()>`.
  - The call (`lib.rs:637-639`) passes a `move` closure that captures a clone of `note` (an `AppHandle` clone) and a `Copy` `Chrome`. It passes `&webview` to `reach`. This matches.
- **`PlatformWebview::controller`** (`src/webview/mod.rs:180-184`) returns `ICoreWebView2Controller` with no `Result`, and it is used that way (`webview_chrome.rs:157`).
- **The four webview2-com-sys 0.38.2 methods** (`src/bindings.rs`):
  - `CoreWebView2` (`:9175`) and `Settings` (`:1022`) each return `Result`, and the code chains them with `and_then` (`:158`);
  - the setter takes `bool` and returns `Result<()>` (`:35015-35018`), and the code uses it so (`:163`);
  - the getter takes `*mut windows_core::BOOL` and returns `Result<()>` (`:35003-35006`). The code passes `&mut value`, whose type is inferred, and reads it with `as_bool()` (`:166-169`).
  - No `webview2-com` or `windows-core` type is named (A1, A3).
- **`SessionLog::append(&self, &str, &str)`** (`state.rs:68`), reached through `try_state` (`lib.rs:619-621`). The log is managed at `lib.rs:530`, before the region.
- **The end-to-end proof from the real shape is E-1.**
  - It reads the session log that the real `setup()` path writes in the dev build. Its regex matches `state.rs`'s `<ms> <level> <message>`.
  - It is written and not run. It is the run part's to read.
  - The installed build's off arm has no automated test (§4, as EV-2 amended it).
- **The dropped-closure read still holds at the built head.**
  - The call is in `setup()` on the main thread, so it is handled inline (`:239-248`).
  - The `if let` at `:3751` has no else through `:4056`.
  - So ADV-2026-11-28-04 item 1's accepted read stands. See D-1 for the source comment that defers to this gate.

## 5. §1's claims and §9's Block on sight

**§1, May claim** (as amended):

| Claim | True or untrue at the head | Where |
|---|---|---|
| Without `debug_assertions`, `AreDefaultContextMenusEnabled` is set false on the main window's webview, once, from `setup()`; Part B is conditional | True | `webview_chrome.rs:32-37`, `:88`, `:163`; `lib.rs:616`, `:624`, `:637-639`. Once: tauri's `setup` runs once (`app.rs:2521-2531`). No Part B code: `:143-148` |
| With `debug_assertions`, the menu setting is set true; the key only under Part B (D2's first change) | True | — |
| The line claim (the fence of ADV-2026-11-28-05 item 1) | True for the shipped Windows build, case by case (next rows) | — |
| — Reached: the read-back line at `info` | True | `:116-120` |
| — `unread` for a failed read, or for the key without Part B | True | `:96-101`, `:146-148` |
| — `not-applied` at `error` when no window is found | True | `lib.rs:625` |
| — `not-applied` at `error` when `with_webview` returns `Err` | True | `:640-642` |
| — `not-applied` at `error` when `CoreWebView2` or `Settings` fails | True | `webview_chrome.rs:158-161` |
| — The dropped case is named in the source comment | True | `lib.rs:633-636` |
| — Exactly one line on each path | True: the `Err` arm runs only if the closure did not | — |
| E-1's claim (EV-1's words) | Matches the step's assertions | `source-watch-idle.mjs`, the `E1-webview-chrome-line` step. It stands or falls with the run part |

**§1, May not claim:** nothing in the diff claims that a key or a menu no longer reloads (`webview_chrome.rs:16-18`; the README's "What it proves not"), or that a setting applies to the loading document. Two doc comments overstate what is set: see C-1.

**§1, Declared unchanged:** each listed path is out of the diff. The `lib.rs` hunks are only `:34` and `:610-645`.

**§9, Block on sight:**

| Item | Status |
|---|---|
| 1. The posture stop | Not engaged (section 2) |
| 2. Diff outside §7, or a new command, listener, port, scheme or capability | Not met: 5 paths in Scope, no such addition |
| 3. A line of `on_page_load` changed | Not met |
| 4. Part B or a Cargo byte before the approval | Not met |
| 5. `unwrap`, `expect`, indexing or `eprintln!` on the apply path, or `setup()` failing; D5's bound on calls | Not met: none at `webview_chrome.rs:87-121` or `:156-176`, no `?` on `with_webview`, `setup()` returns `Ok` at `lib.rs:652`; only D5's calls, each `unsafe` around the call alone |
| 6. A no-longer-reloads claim | Not met |
| 7. A `verify-mutation` run called an observation | Not met: the worker's report names bffb4a22 for M-U1 to M-U6, M-E1 not run, no verify-mutation run |
| 8. Overrun not recorded, or §7 edited; class 9 after its code | Not met: class 8 in Amendments 7 and 9, and §7's line is unedited. Class 9 is Amendment 8 item 3. That it was on main before 5174676a is the custodian's fact (Amendment 8 item 8), not checked by me by git |
| 9. A hash at a branch commit, a bare self-line, or an unnamed test-text span | Not met in the diff: `lib.rs:629` and `:635` are crate cites, with no hash |

## 6. OPEN-2: ADR-037's amendment, a draft for the advisor's ruling

The draft is my words, not the human's or the advisor's. The number is left open.

````text
## Amendment <n> — <date> — the first not-decided bullet decided: the installed build switches off WebView2's default context menu and, with the human's approval, its browser keys; nothing asks first

*Drafted by the architect at the build gate of node `reload-asking-first-or-off-in-the-installed-build`; its words are ruled by the advisor. Nothing above is edited. Code is named by symbol at the commit that lands this amendment; crate sources by crate and version. Text not marked verbatim is paraphrase.*

1. **Decided.** The first bullet of "What this ADR does not decide" is decided for options (iii) and (iv). Option (i), a `beforeunload` prompt, and option (ii), cancelling keys in the page's `keydown` listener, are not taken; (ii) is not a stand-in for (iii).
2. **The route.** tauri 2.11.5 and tauri-runtime-wry 2.11.4 expose neither a builder call nor a `tauri.conf.json` key for either setting. Once, in `setup()`, the shell calls `WebviewWindow::with_webview` on the main window; called there, on the main thread, the closure runs inside the call. `webview_chrome::reach` takes the WebView2 controller, its `CoreWebView2` and its `Settings`, then sets each setting and reads it back. No crate, Cargo feature, command, listener, port, scheme or capability is added, and `tauri.conf.json` is unchanged.
3. **What each build decides** (`webview_chrome::chrome_for`). A build with `debug_assertions`, and nothing else, keeps WebView2's default, on. Every other build decides off, the measure build included.
   - (iv), the default context menu, is set in every build.
   - (iii), the browser accelerator keys, is set only once the human approves two direct dependencies, `webview2-com` 0.38 and `windows-core` 0.61, and the lockfile change they make. Until then, and if the human declines, the installed build neither sets nor reads the key setting, and Ctrl+R and F5 do there what they did before this amendment.
4. **The session-log line.** `setup()` writes one line. When the settings are reached, it is `webview-chrome context_menus=<on|off|unread> accelerator_keys=<on|off|unread>` at `info`; `unread` says this run read no value for that setting. When they are not reached, it is `webview-chrome not-applied` at `error`. The line states the values read, not their effect. No line is written if the runtime drops the closure, a case ordinary use does not reach. Off Windows the shell writes `not-applied` at each start. No build of ours compiles that arm, and macOS and Linux are not decided here.
5. **Not established; read from the source, not observed.**
   - What the runtime's default menu offers, and so whether it offered Reload.
   - Whether the setting applies to the first document. The shell's call comes after the window's build has asked the webview to navigate to that document, and before the event loop runs. Microsoft's `ICoreWebView2Settings` reference, read 2026-11-28, says that setting changes made after the `NavigationStarting` event, other than two named ones, apply from the next top-level navigation. The sources do not show where the shell's call falls against that event for the first document.
   - The proof for the installed build is the human's press in an installed candidate, with the right-click made on the first screen before any key that navigates, and the custodian's reading of the line in that sitting's log.
6. **Costs, each with its source.**
   - With the menu off, its items are gone. If the runtime offered them, that includes cut, copy and paste in a text field. These are the runtime's items, and none was observed.
   - With the keys off, by Microsoft's `ICoreWebView2Settings3` reference read 2026-11-28: find, print, reload, zoom, the devtools keys and the browser keys for back, forward and search are off, and the keys for movement and text editing stay on (cut, copy, paste, select all, undo).
7. **What stays true.**
   - §3's end still runs for every reload that still happens: dev reloads, the e2e suites' `page.reload()`, any other navigation, and Ctrl+R and F5 until (iii) lands. That is the bullet's last sentence.
   - "Nothing asks first" stays true.
   - "A cancelled publish is not shown" stays true: no line is added to the new page.
   - The Context's list of what replaces the page is unchanged for a development build.
8. **docs/02.** This is the client's configuration of its own webview. It is not data logic, and not an exception to "frontends: clients only, no logic".
9. **Versions.** `with_webview` hands the shell tauri's own WebView2 types. tauri's doc comment on it (`tauri-2.11.5/src/webview/mod.rs:1612-1613`) warns that `webview2-com` may move in a tauri minor release, and recommends pinning tauri's minor version. The shell's `Cargo.toml` asks for `tauri` "2", and the lockfile holds 2.11.5. A tauri update that moves `webview2-com` can stop this code compiling; with (iii)'s direct dependency, it can also leave two versions in the lock. A tauri update is a dependency change, and is the human's already.
````

## 7. Findings

**C-1 (Correctness, words only).** Two doc comments say the build sets the key setting. Under Part A it does not.
- The correction changes no code behaviour. These are a worker's doc comments, not the human's wording, so the worker applies the words with no re-gate and the PR body lists them.
- **Pair 1, `frontends/shell/src-tauri/src/webview_chrome.rs`.**
  - Old, verbatim, occurs once (`:6`): `in a build with them, both browser settings are set to WebView2's own`
  - New: `in a build with them, the context-menu setting is set to WebView2's own`
  - Clause check: `chrome_for(true)` gives `context_menus: true` (`:32-37`); `apply` calls `set_context_menus` (`:88`); `Live::set_accelerator_keys` makes no WebView2 call (`:143-145`). The next line goes on "default, on."
- **Pair 2, the same file.**
  - Old, verbatim, occurs once (`:31`): `/// any other build turns both off.`
  - New: `/// any other build decides off for both. Without Part B, `Live` neither sets nor reads the key setting.`
  - Clause check: `chrome_for(false)` gives both false (`:32-37`); the key stubs return `Err` with no call (`:143-148`).
- An operator cannot see either comment. They are Correctness because they state what the shipped code does, and they contradict the module's own Part A paragraph (`:10-12`).

**D-1 (Documentation, must fix before the merge; words only, no code change; not the human's wording).** The source comment defers to this gate, and after this gate that reads as still pending.
- File: `frontends/shell/src-tauri/src/lib.rs`.
- Old, verbatim, occurs once (`:636`): `that case; the build's architect gate says whether this read still holds.`
- New: `that case; the build's architect gate re-read it at 2.11.4: it holds.`
- Clause check: section 4, the dropped-closure bullet (`:239-248`, `:3751`, no else through `:4056`; the call at `lib.rs:637` is inside the `setup` closure that starts at `:343`).

**D-2 (Documentation, must fix before the merge; words only, no code change; not the human's wording).** The stub's comment does not say what the stub writes, or that no build compiles it.
- File: `frontends/shell/src-tauri/src/webview_chrome.rs`.
- Old, verbatim, occurs once (`:178`): `/// Only Windows has a WebView2 controller to reach.`
- New, two lines:
  `/// Only Windows has a WebView2 controller to reach. Off Windows, `setup()` therefore writes`
  `/// `webview-chrome not-applied` at `error` at each start; the shell's CI builds it on Windows only.`
- Clause check: `lib.rs:638` calls `reach`, then `NotReached`, then `log_entry`'s `error` arm (`webview_chrome.rs:118`); `product-ci-shell.yml:171`, `tauri-build.yml:30` and `product-ci-rust.yml:28-29`.

**D-3 (Documentation, must fix before the merge; form text, by an appended amendment; words only; not the human's wording).** §10's caller-rule sentence leaves out `reach`, and it says "their caller" where `setup()` is only the root caller.
- File: `governance/forms/frontends/RELOAD-ASKING-FIRST-OR-OFF-IN-THE-INSTALLED-BUILD-PREREGISTRATION.md`. The words are read in place of D7's New (Amendment 6 item 2).
- Old, verbatim, occurs once (a Grep count of 1 at 9d513c97): ``the caller rule: `chrome_for`, `apply` and `readback_line` have `setup()` as their caller, and the fake is test-only and not `pub`;``
- New: ``the caller rule: each new item has a product call chain rooted in `setup()`: `setup()` calls `chrome_for`, `reach` (inside the `with_webview` closure) and `log_entry` (U-5's function, at each not-applied site and in the closure once the settings are reached); `reach` builds `Live` and calls `apply`; `log_entry` calls `readback_line`; the `cfg(not(windows))` `reach` is the same call's arm off Windows; the fake is test-only, under `#[cfg(test)]`, and nothing is `pub`;``
- Clause check: section 1, the caller-rule bullet.

**Clauses in ruled texts (reported, no words proposed):**
- **R-1, ADV-2026-11-28-09 item 8, second bullet.** That bullet has the right-click and the two keys pressed on the first screen, before anything navigates. Under Part A alone, Ctrl+R and F5 reload (ADV-2026-11-28-05 item 5). So whichever action comes first is the only one made on the first document. For (a) to be observed, the right-click has to be first.
- **R-2, ADV-2026-11-27-44 item 12 (the digest line).** It says the installed build will offer no right-click menu. For the first document that rests on (a), which the sources do not settle.

**The KNOWN-LIMITATIONS draft.** I propose no words for it. One effect the code contradicts: source 1 says `chrome_for(cfg!(debug_assertions))` is called from inside `window.with_webview(...)`. It is called before `get_webview_window`, at `lib.rs:616`, and its value is moved into the closure. The draft's title and first sentence say the menu is off from the start; whether that holds for the first document is answer (a), for the advisor's wording.

No Architecture finding. No item goes to the human.

## Files read (read only)

- **D:/wt/read-1128g @ 9d513c97:**
  - the form, whole;
  - the seven gate and worker reports and the reading under `state/consults/gates/` named `2026-11-28-reload-asking-first-or-off-in-the-installed-build-*`;
  - the rulings ADV-2026-11-26-18, ADV-2026-11-27-44, ADV-2026-11-28-04, -05 and -09;
  - a Grep of `docs/`.
- **D:/wt/read-keys @ 5174676a:**
  - `frontends/shell/src-tauri/src/webview_chrome.rs:1-185`;
  - `lib.rs:1-34` and `:235-689`;
  - `state.rs` (Grep);
  - `frontends/shell/e2e/source-watch-idle.mjs` (Grep);
  - `docs/adr/ADR-037-…md` whole;
  - `docs/09_Security_and_Privacy.md`;
  - `docs/adr/ADR-027-…md:26-60`;
  - `docs/adr/ADR-020-…md` (headings);
  - `docs/02_Architecture.md` (Grep);
  - `.github/workflows` (Grep).
- **`<scratch>`:** `keys-diff.txt` and `keys-numstat.txt`.
- **`<profile>/.cargo/registry/src/index.crates.io-1949cf8c6b5b557f/`:**
  - tauri-runtime-wry-2.11.4 `src/lib.rs:215-264`, `:295-354`, `:1600-1639`, `:3690-3774`, `:3970-4060`, and Grep;
  - tauri-2.11.5 `src/app.rs:1366-1440` and `:2521-2565`, `src/webview/mod.rs:125-199`, `:1606-1615` and `:1660-1677`, `src/webview/webview_window.rs:2340-2379`, and `src/manager/webview.rs:570-599`;
  - wry-0.55.1 `src/webview2/mod.rs:80-709`;
  - webview2-com-sys-0.38.2 `src/bindings.rs:1018-1027`, `:9172-9181` and `:35000-35027`.

I ran nothing, wrote no file and sent no message. Nothing was read in or under C:/dev/spatial-ide, and no transcript was opened.
