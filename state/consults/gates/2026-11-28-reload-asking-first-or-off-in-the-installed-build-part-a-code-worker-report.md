# The reload keys' Part A: the code worker's report at 8ba765d9 (node:reload-asking-first-or-off-in-the-installed-build@part-a)

*Filed by the custodian. The worker (Sonnet) worked in D:/wt/keys from B's head 5ce0525a and pushed 8ba765d9eaaa5a0ceb79a0e3baa4c2f597996e5e to `cut/reload-asking-first-or-off-in-the-installed-build`. By the facts script its records run from 2026-11-28T04:11:00Z to 2026-11-28T04:53:59Z, and 71 of its calls ran with the main checkout as its working folder, the shell's start folder. By its completion notice it took 2579762 ms and 84 tool uses. Its hand-back is below as received, with the harness indent removed: 14859 bytes, sha256 ea99ca3ad3a7c387dafe907036a42d7353c09e11696509a395d665edfac3a75c.*

---

8ba765d9eaaa5a0ceb79a0e3baa4c2f597996e5e is the pushed head (origin matches). Every step completed except M-E1's run (written, not run, as briefed), E-1 itself (never run) and one thing I could not do, which is keeping Part A inside §7's 330-line ceiling. The count is 412 lines over 4 files (see the §7 count below).

START CHECK: head was 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 and the tree clean in D:/wt/keys, as briefed.

COMMITS (each git commit -s, each with the Co-Authored-By trailer, no email)
- 95b73447 test: the reload keys' Part A, U-1 to U-6 over stubs, red
- 058dd08e feat: the reload keys' Part A, the installed build turns WebView2's default context menu off
- bffb4a22 test: the reload keys' Part A, E-1 in the source-watch-idle suite and its README entry
- 8ba765d9 chore: the reload keys' Part A, cargo fmt on webview_chrome.rs
Pushed after bffb4a22 and again after 8ba765d9, each push in its own call.

TESTS (webview_chrome::tests, in webview_chrome.rs; names are D2's U-1 name, then §4 and EV-2)
Red before, at 95b73447 (D:/wt/keys-logs/test-red.log): 96 passed and 6 failed, each at an assertion on a stub. U-1 to U-6 were all red.
Green after, at 058dd08e and again at 8ba765d9 (D:/wt/keys-logs/test-green2.log): 102 passed, 0 failed. The integration scan, sole_caller_scan, passes 2 of 2. The red run stopped after the lib tests, so it did not run the integration tests.
- U-1 chrome_for_decides_both_off_without_debug_assertions_and_both_on_with_them: red (stub returned on/on).
- U-2 apply_sets_each_setting_to_the_decided_value: red (stub made no setter call).
- U-3 a_failed_setting_does_not_skip_the_other_or_panic: red.
- U-4 the_line_states_the_values_read_back_not_the_decision: red (stub line was "").
- U-5 a_line_for_settings_not_reached_is_not_applied_at_error: red.
- U-6 a_failed_read_reads_unread: red.

MUTATIONS
Patch files are in D:/wt/keys-logs/mut/, each applied with git apply, run with `cargo test --locked --lib webview_chrome`, and reverted with git apply -R. git status was clean after each revert. All were observed with HEAD at bffb4a22 (bffb4a223a9f458ca6e5735c1503e7b962d01074). After the fmt commit 8ba765d9, git apply --check passes on all seven patches. Each run's log is mut/<id>.log.
- M-U1 (chrome_for ignores its argument, returns on/on), mut/M-U1.patch. Failed: chrome_for_decides_both_off_without_debug_assertions_and_both_on_with_them, apply_sets_each_setting_to_the_decided_value, a_failed_setting_does_not_skip_the_other_or_panic, a_line_for_settings_not_reached_is_not_applied_at_error. The last three fail because they decide through chrome_for.
- M-U2 (menu setter call removed from apply), mut/M-U2.patch. Failed: apply_sets_each_setting_to_the_decided_value, a_line_for_settings_not_reached_is_not_applied_at_error.
- M-U3 (apply returns early on a menu-setter Err, both fields unread), mut/M-U3.patch. Failed: a_failed_setting_does_not_skip_the_other_or_panic.
- M-U4 (apply fills the Readback from chrome, not from the getters), mut/M-U4.patch. Failed: the_line_states_the_values_read_back_not_the_decision, a_failed_read_reads_unread, a_failed_setting_does_not_skip_the_other_or_panic.
- M-U5 (the not-applied line written at info), mut/M-U5.patch. Failed: a_line_for_settings_not_reached_is_not_applied_at_error.
- M-U6 (a failed read reported as off), mut/M-U6.patch. Failed: a_failed_read_reads_unread.
- M-E1 (the with_webview call removed from setup(), lib.rs), mut/M-E1.patch: written and git apply --check clean, not run. E-1 runs at the port. No verify-mutation run was made.

CHECKS (each its own heavy command in a shared hold, CARGO_TARGET_DIR=D:/wt/keys-target)
- cargo test --locked: exit 0 at 8ba765d9.
- cargo clippy --locked --all-targets: exit 0 at 8ba765d9. One warning, large size difference between variants, at frontends/shell/src-tauri/src/publish.rs:359 (PrepareOutcome). It is not on a line I wrote and I left it. No clippy warning is on a line I wrote.
- cargo fmt --check: the first run exited 1 on three places in my webview_chrome.rs (no other file). I ran cargo fmt and committed 8ba765d9; the re-check exit is 0.
- npm run verify (frontends/shell): exit 0 at 8ba765d9 (123 test files and 1570 tests passed).
- npm ci in D:/wt/keys/frontends/shell and then in D:/wt/keys/renderer/bundle-viewer, each in its own call, both rc 0. The Rust build needs frontends/shell/dist (tauri.conf.json frontendDist is ../dist), so I ran npm run build in frontends/shell before the first cargo run. dist and node_modules are ignored and no file under either is tracked.
- Disk: C: stayed at about 41.5 GB free. D: fell from 22 GB to 12.7 GB free; the D: floor is 8000 MB. The fresh target is about 10 GB.

§7 COUNT (git diff --numstat 5ce0525a...HEAD with B's counting exclusions, at 8ba765d9)
- webview_chrome.rs 327 (about 140 of it is the test module)
- lib.rs 38 (the mod line plus the setup() region, 0 deletions)
- source-watch-idle.mjs 41
- e2e/README.md 6
- Total 412 insertions, 0 deletions, 4 files.
This is an OVERRUN of the 330-line ceiling by 82 lines. The file count, 4 against at most 8, is within the ceiling. I did not trim. I did not record the overrun, as briefed; it is the custodian's to record.
Cargo diff: git diff 5ce0525a -- frontends/shell/src-tauri/Cargo.toml frontends/shell/src-tauri/Cargo.lock is empty (0 bytes).

THE KNOWN-LIMITATIONS DRAFT (also at D:/wt/keys-logs/kl-draft.md; not put in KNOWN-LIMITATIONS.md)
---
The worker's draft of the KNOWN-LIMITATIONS item for the reload keys' Part A (the form's Amendment 1 item 7, ADV-2026-11-27-44 item 8). Not in KNOWN-LIMITATIONS.md. The words are the advisor's to give; this draft gives each effect with its source. No web page was read: this worker has no web access, so Microsoft's documentation is not cited, and every effect of the WebView2 runtime is named as not observed.

N. **The installed build turns WebView2's default right-click menu off in the main window and leaves its browser keys as they were.**
    The installed build sets the main window's WebView2 setting for the default context menus to off, once, when it starts. A build with `debug_assertions` sets it to on, WebView2's default. The installed build makes no call for the browser keys setting, so Ctrl+R, F5 and the other browser keys are as they were before this change. The application writes one line to the session log that says what it read back, and the line expected from an installed build is `webview-chrome context_menus=off accelerator_keys=unread`.
    What the menu offered before, and what the page loses with it, is the WebView2 runtime's and is not known from the code: the items Copy, Paste and Cut in a text field, if the runtime's menu offered them, are not offered once the menu is off. Whether the menu offered Reload is not known.

Sources, by effect:

1. **The setting is off in the installed build and on in a build with `debug_assertions`, once, at start.** The code: `chrome_for` in `frontends/shell/src-tauri/src/webview_chrome.rs` (both fields equal its `debug_build` argument), called from `setup()` in `frontends/shell/src-tauri/src/lib.rs` as `webview_chrome::chrome_for(cfg!(debug_assertions))`, after the measure-build block and before `Box::leak`, from inside `window.with_webview(...)`, whose closure calls `reach`. `reach` calls `ICoreWebView2Settings::SetAreDefaultContextMenusEnabled` (`webview2-com-sys-0.38.2/src/bindings.rs:35015`, read) through `apply`, then reads it back with `AreDefaultContextMenusEnabled` (`:35003`, read).
2. **That setting is the "default context menus" setting.** The wry crate's own doc comment on its `with_default_context_menus` builder call, which sets the same WebView2 setting at window creation, reads, verbatim, a sub-line span of `wry-0.55.1/src/lib.rs:1723` under `<profile>/.cargo/registry/src/index.crates.io-1949cf8c6b5b557f/`: "it disables all context menus on the webview". That is a crate's doc comment, not Microsoft's documentation, which was not read.
3. **The browser keys setting is not called.** The code: `Live::set_accelerator_keys` and `Live::accelerator_keys` in `webview_chrome.rs` return the module's own error and make no WebView2 call; `apply` reads that as `unread`. So the installed build neither sets nor reads the setting, and Ctrl+R and F5 do what the runtime does when no setting is made. That is the code's fact; what the runtime does with them is not observed.
4. **The line.** The code: `log_entry` in `webview_chrome.rs` (the read-back line at `info`, `webview-chrome not-applied` at `error` when the settings were not reached), written by `setup()` in `lib.rs` through the managed `SessionLog`.

Not observed in the installed build, when this draft was written:

- No installed build was made or run for this draft, and no right-click, Ctrl+R or F5 was pressed on any build. The line `webview-chrome context_menus=off accelerator_keys=unread` has not been seen; it is what the code reads as the installed build's line.
- Nothing was observed of the menu's items in the installed build, so that Copy, Paste and Cut are gone from a text field, or that Reload was or was not on the menu, is not known.
- Whether the setting, made after the window exists, applies to the document the window is already loading is not known (the form's F-8). The code makes the setting inside `setup()`, after the window is created.
- The case where the runtime holds no such webview and drops the closure writes no line (the form's C1); it is not reached in ordinary use and was not reached by any run.
- The only automated proof from the real shape is E-1, in a development build, which reads `webview-chrome context_menus=on accelerator_keys=unread`. E-1 was written and checked for syntax only and has not been run; it runs at the port.
---

NEW ITEMS AND THEIR CALLERS (D7 caller rule; grep of lib.rs and the module)
- chrome_for is called by setup() directly (lib.rs, `webview_chrome::chrome_for(cfg!(debug_assertions))`).
- log_entry is called by setup() directly, in the `note` closure, at all three sites: no main window, the with_webview Err arm, and inside the with_webview closure once the settings are reached or not. The Outcome type, which setup() names, is `pub(crate)`.
- reach (pub(crate), cfg(windows), plus a cfg(not(windows)) stub returning NotReached) is called by setup() inside the with_webview closure.
- apply is called by reach only. setup() reaches it only through reach (setup, then reach, then apply), not directly. I kept the trait ChromeSettings private as briefed, so apply cannot be a direct setup() call. D7's wording says setup() is the caller of apply; the chain above is what the code does.
- readback_line is called by log_entry only (setup, then log_entry, then readback_line). The same chain applies.
- Live (the product impl) is built in reach only. The Live key stubs are reached through apply.
- Value, Readback, Chrome, Outcome and ChromeError have no caller of their own beyond the above. The test fake is under #[cfg(test)], private, and not pub.
- The new Windows-only items (Live, reach) sit behind cfg(windows) with a cfg(not(windows)) stub. This is my addition (a few lines) so that the crate still builds off Windows; the form does not mention it.

DEPARTURES AND NOTES
- §7 overrun, 412 against 330 (above). I did not trim and did not record it.
- I added no unit test for the Part-A-alone key stub's `unread` (the form lists U-1 to U-6 only). Only E-1 proves it from the real shape, and E-1 is not run.
- Test-fixture choice: U-3 asserts the menu reads On after a failed set because the fake's stored value starts on, and the key reads Off.
- The step is E1-webview-chrome-line, placed right after the mount-readiness gate and before W1. It asserts launched: true. It reads the newest session log through a function of its own, webviewChromeLines. It requires exactly one line, at `info`, equal to the one fixed string `webview-chrome context_menus=on accelerator_keys=unread`. node --check exits 0, and I scanned the file for non-ASCII and found none. E-1 was never run. The README entry is new (DOC-1) and covers E-1's step only. It says there is no npm script for the suite, which I verified by grep of package.json.
- The source comments at the key stubs, at the with_webview Err arm and at the dropped-closure case are in webview_chrome.rs and lib.rs. The Err-arm comment names tauri-runtime-wry 2.11.4 `src/lib.rs:239-248` and tauri 2.11.5. I checked that line range in the registry source myself. It is a path:line inside a crate, not a hash pin.
- on_page_load, the handler list and the log-folder resolution are untouched: lib.rs has 0 deletions against 5ce0525a, and its additions are the `mod webview_chrome;` line and the setup() region.
- No unwrap, expect, indexing or eprintln! on the apply path. The with_webview closure's return is `.is_err()` only, and setup() still returns Ok.
- No claim in any comment, README entry or the KL draft says a key or menu no longer reloads (§9 item 6).
- The type inference for the getter's out-parameter (Default::default() coerced to *mut BOOL) compiled first time, so §5's first invalidator did not fire. Part A names no type of webview2-com or windows-core and needed no Cargo.toml or Cargo.lock byte.
- The fmt failure at bffb4a22 was my own formatting; I fixed it in 8ba765d9 and re-ran test, clippy and fmt there. The mutations stay observed at bffb4a22, per the brief's record-the-commit rule; the fmt commit changed only whitespace and line wrapping in webview_chrome.rs, and I re-checked that every patch still applies cleanly.
- No stop under §9 was hit. I opened no pull request and started no app, dev server or e2e suite. I read nothing in or under C:/dev/spatial-ide, no *.jsonl and no temp-folder file. The completion notices announced each background command, and I read their output only through my own logs in D:/wt/keys-logs.
- Model: I ran as Sonnet 5.5, with no override and no handoff received or produced.

PRE-GATE SELF-CHECK (the four classes)
- Cross-module seams: I read the other side's actual interfaces. They are tauri 2.11.5 `WebviewWindow::with_webview` (webview_window.rs:2371) and `PlatformWebview::controller` (webview/mod.rs:180-184), plus webview2-com-sys 0.38.2 `CoreWebView2`, `Settings` and the context-menu getter and setter at bindings.rs 9175, 1022, 35003 and 35015. The shell's SessionLog is a real managed state read through try_state. The single end-to-end proof from the real shape is E-1, written and not run.
- Completion claims: each points to a log under D:/wt/keys-logs: test-red.log, test-green2.log, clippy.log, fmt2.log, verify.log and the mut/ logs.
- User-facing text: the session-log lines and the README entry describe code that exists at 8ba765d9.
- Required tests: each reaches its assertion, with red-at-stub and red-under-mutation runs recorded above.
