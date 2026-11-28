# The advisor's ruling ADV-2026-11-28-16, under the human's delegation of 2026-11-13, not the human's words: the reload keys' Part A after both read parts: ADR-037's amendment accepted in its words, the KNOWN-LIMITATIONS item and its comment worded, the reviewer's S-1 taken as U-7

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`GRANT`, item 3), never as the human's words. Source: PASTES/ADV-2026-11-28-16.md in the advisory folder, 19329 bytes, sha256 08a846573fe87f3e68d35a681a0dc02c9ffd7992931a96c19d64133c9fc1dada, UTF-8, last modified at 2026-11-28T08:41:26Z by the file system. It was named by a session message received before 2026-11-28T08:41:49Z (date -u, taken after it was copied). Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-28-16, to the custodian, 2026-11-28 (08:41Z). The reload keys' Part A after both read parts: ADR-037's amendment, the KNOWN-LIMITATIONS item with its comment, and the reviewer's suggestion S-1. It is the one ruling that ADV-2026-11-28-09 item 7 and ADV-2026-11-28-14 item 6 promised. It is worded for Part A alone: no approval of ADV-2026-11-27-45 is filed, by my search of `state/directives/` at 08:40Z.

Read by me. On main at 48eb003e: the reviewer's read part whole; the architect's read part whole (for ADV-2026-11-28-14); the filed reading of Microsoft's two pages whole; the form's §0 to §2; the worker's draft of the item with its sources. At 5174676a: ADR-037 whole; `webview_chrome.rs` lines 1 to 184; `lib.rs` lines 584 to 653; KNOWN-LIMITATIONS.md's items 67 to 75 with their comments; `docs/02_Architecture.md` line 24; the `tauri` line of the shell's `Cargo.toml`; the `build:measure` script. Not read by me: the crate sources. Every clause on them rests on the architect's and the reviewer's reads.

1. **ADR-037's amendment is accepted in the words below.**
   - It is appended after the ADR's last line. `<date>` is the date of the commit that lands it. `<n>` is 1 on this branch now; ADV-2026-11-27-44 item 3 gives it another number if the recovery offer's amendment reaches main first.
   - Nothing above its heading is edited. The Status line and the row in `docs/README.md` are not edited. If `verify:adr-index` asks for a change there, tell me first.

````text
## Amendment <n> — <date> — the first not-decided bullet, in part: the installed build sets WebView2's default context menu to off; its browser keys wait on the human; nothing asks first (node `reload-asking-first-or-off-in-the-installed-build`)

*Appended under the advisor's rulings ADV-2026-11-27-44, item 3, and ADV-2026-11-28-16, item 1, under the human's delegation of 2026-11-13, and accepted in the text the second of them gives. The words are the architect's, drafted at the build gate of the node, as the advisor changed them for a build that carries the context menu's part alone. None of them is the human's. Nothing above this heading is edited: each item names a passage above, and that passage is read with the item's words beside it. Code is named by symbol, and for the code the tree is authoritative. Crate sources are named by crate and version, as the architect read them at the build gate. Microsoft's pages are named as they were read on 2026-11-28; the reading is filed at `state/consults/gates/2026-11-28-reload-asking-first-or-off-in-the-installed-build-webview2-settings-pages-reading.md`. Text not marked verbatim is paraphrase.*

1. **Decided, of the four options of the first bullet of "What this ADR does not decide".**
   - Option (iv), switching off the default context menu, is taken and built.
   - Option (iii), switching off WebView2's browser accelerator keys, is taken only with the human's approval of two direct dependencies of the shell, `webview2-com` 0.38 and `windows-core` 0.61, and of the lockfile change they make. That approval has not been given at this amendment's landing, and (iii) is not built. If it is built, an amendment after this one records it.
   - Option (i), a `beforeunload` prompt, and option (ii), cancelling the keys in the page's `keydown` listener, are not taken. (ii) is not a stand-in for (iii).
2. **The route.** tauri 2.11.5, with tauri-runtime-wry 2.11.4 and tauri-utils 2.9.3, exposes neither a builder call nor a `tauri.conf.json` key for either setting. Once, in `setup()`, the shell calls `WebviewWindow::with_webview` on the main window. Called there, on the main thread, the closure runs inside the call. In it `webview_chrome::reach` takes the WebView2 controller, its `CoreWebView2` and its `Settings`, sets the context-menu setting and reads it back. It makes no call for the key setting. No crate, Cargo feature, command, listener, port, scheme or capability is added, and `tauri.conf.json` is unchanged.
3. **What each build decides** (`webview_chrome::chrome_for`). A development build is a build with `debug_assertions`, and nothing else. It sets the context-menu setting to on, WebView2's default. Every other build sets it to off. The measure build, as `build:measure` builds it, is one of them.
4. **The session-log line.** `setup()` writes one line at each start. When the settings are reached, it is `webview-chrome context_menus=<on|off|unread> accelerator_keys=<on|off|unread>` at `info`. `unread` says that this run read no value for that setting: a read failed, or the build makes no WebView2 call that reads it, which is the key setting's case in this build. When the settings are not reached, the line is `webview-chrome not-applied` at `error`, and nothing was set. The line states the values read, and not their effect. If the runtime drops the closure, no line is written; ordinary use does not reach that case. Off Windows the shell would write `not-applied` at each start. No job of this repository's CI compiles that arm, and macOS and Linux are not decided here.
5. **Not established. Read from the sources, not observed.**
   - What the runtime's default menu offers, and so whether it offered Reload.
   - Whether the setting applies to the first document. The shell's call comes after the window's build has asked the webview to navigate to that document, and before the event loop runs. Microsoft's `ICoreWebView2Settings` reference says that a change to a setting made after the `NavigationStarting` event, two named settings apart, does not apply until the next top-level navigation. The sources do not show where the shell's call falls against that event for the first document. So the line can read `context_menus=off` while the first document still shows the menu.
   - What Ctrl+R and F5 do in the installed build has not been observed. Microsoft's `ICoreWebView2Settings3` reference names Ctrl-R and F5 among the browser accelerator keys, for Reload, and gives the keys' setting as on by default. This build does not change that setting.
   - The one automated proof from the real shape is a step of the e2e suite `source-watch-idle.mjs`, in a development build, where the line reads `webview-chrome context_menus=on accelerator_keys=unread`. The installed build's off arm has no automated test. Its proof is the human's press in an installed candidate, a right-click on the first screen before any key and then the keys, with the custodian's reading of the line in that sitting's log.
6. **Costs, each with its source.**
   - With the menu off, its items are gone. If the runtime's menu offered cut, copy and paste in a text field, a right-click no longer offers them. These are the runtime's items, and none was observed. This piece changes no key.
   - If (iii) is built: by Microsoft's `ICoreWebView2Settings3` reference, the setting switches off the keys that reach a browser's own features, among them find, print, reload, zoom, the DevTools keys and the browser keys for back, forward and search. It leaves the keys for movement and text editing, among them cut, copy, paste, select all and undo.
7. **What stays true above.**
   - The bullet's last sentence stands: §3's end still runs for every reload that still happens. Those are a dev reload, the e2e suites' `page.reload()`, any other navigation, and a reload by Ctrl+R, by F5 or by a menu that the settings did not prevent.
   - In Consequences (d), "Nothing asks first" stays true. Its last bullet, "Not decided here", is read with item 1.
   - "A cancelled publish is not shown" stays true: this piece adds no line to the new page.
   - The Context's list of what replaces the page is unchanged for a development build.
8. **docs/02.** This is the client's configuration of its own webview. It is not data logic, and it is no exception to the frontends row of docs/02's module map.
9. **Versions.** `with_webview` hands the shell tauri's own WebView2 types, and this code calls methods on them through inferred types. tauri's doc comment on `with_webview` warns that `webview2-com` may move in a tauri minor release, and recommends pinning tauri's minor version (tauri 2.11.5). The shell's `Cargo.toml` asks for `tauri` at version `2`, and the lockfile holds 2.11.5. A tauri update that moves `webview2-com` can stop this code compiling. With (iii)'s direct dependency it could also leave two versions in the lock. A tauri update is a dependency change, and so the human's already.
````

2. **What I changed in the architect's draft, and why.**
   - **The heading and item 1:** the draft called the bullet decided, with the keys "with the human's approval". The approval is not given, so the text says what is built and what waits, and that a later amendment records (iii).
   - **Item 2:** the draft had `reach` set each setting and read it back. In this build it does that for the menu alone. This is the gates' C-1 and RC-1, met here as well.
   - **Item 3:** "nothing else" now defines the development build, as OPEN-4 has it. The measure build is named by how it is built, since `chrome_for` looks at `debug_assertions` alone.
   - **Item 4:** `unread`'s meaning as ADV-2026-11-28-05 has it; "nothing was set" for the not-reached case; "no job of this repository's CI" for "no build of ours".
   - **Item 5:** the consequence the architect drew under (a) is in the text: the line can read off while the first document shows the menu. Two bullets added: what the keys do is not observed, with what Microsoft's page says of them; and E-1 as the one automated proof. R-1's order is in the last bullet.
   - **Item 6:** the keys' cost is said of (iii) if it is built. "Among them" stands for the page's "including but not limited to" and "such as".
   - **Item 7:** a reload by a key or by a menu that the settings did not prevent is named. Consequences (d)'s last bullet is read with item 1.
   - **Item 8:** the draft put words in quotation marks that are not docs/02's. The row reads "Clients only — no logic", and the text now names the row without quoting it.
   - **Item 9:** the `path:line` into the crate is replaced by the crate and its version. The amendment carries no `path:line`.

3. **The KNOWN-LIMITATIONS item, in my words.** `NN` is the next unused number over the base and every unmerged branch (rule (00a)). It goes at the file's end, in the file's form for an item.

````text
NN. **The installed build sets the right-click menu that WebView2 gives the app's window to off and makes no change to Ctrl+R and F5, and what a right-click then shows has not been observed.**
    When the installed build starts, it sets the WebView2 setting for default context menus to off for the app's window, once. A development build sets it to on, which is WebView2's default. Microsoft's reference says that this setting is used to prevent the default context menus from being shown. What that menu offered is not known from the code or from that reference. If it offered Cut, Copy and Paste in a text field, a right-click no longer offers them; the keys for them are not changed. By the same reference, a change to this setting that is made after the event that starts a page's load does not apply until the next load of a page in the window, and the app makes the change after it has asked the window to load its first page. So whether a right-click on the first screen after a start still shows the menu is not known. The installed build makes no call for WebView2's setting for browser keys, so Ctrl+R and F5 do there what they did before this change. At each start the app writes one line to the session log that says what it read back for the two settings. From the installed build the code gives `webview-chrome context_menus=off accelerator_keys=unread`, where `unread` says that the app read no value for that setting. If the app cannot reach the settings it changes nothing, and the line is `webview-chrome not-applied`. The line says what a setting reads, not what a right-click or a key does. When this was written, no right-click, Ctrl+R or F5 had been tried in an installed build with this change, and the line had not been read from one.
````

4. **Its comment,** on the line after the item's body, indented as the other items' comments are. `<path>` is this ruling's filed path, which you put in.

````text
    <!-- The advisor's wording under the human's delegation of 2026-11-13 (state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md, items 2 and 3), not the human's words, ruled in ADV-2026-11-28-16 (<path>; item 3, its words copied byte for byte; the bold first sentence and the line break after it are this file's form for an item). The node is reload-asking-first-or-off-in-the-installed-build, and this item is for a build that carries its Part A alone. Each effect, with its source. From the code, by symbol: `chrome_for` in frontends/shell/src-tauri/src/webview_chrome.rs gives both fields its argument, and `setup()` in frontends/shell/src-tauri/src/lib.rs calls it once with `cfg!(debug_assertions)`, before it looks up the main window; `reach` in webview_chrome.rs, called in the closure that `setup()` gives `with_webview`, reaches the WebView2 settings and calls `apply`, which sets the context-menu setting through `Live` (`SetAreDefaultContextMenusEnabled`) and reads it back (`AreDefaultContextMenusEnabled`); `Live`'s key setter and getter make no WebView2 call, and `seen` reads the getter's error as `unread`; `log_entry` gives the read-back line at `info` and `webview-chrome not-applied` at `error` when the settings were not reached, and `setup()` writes it through the managed `SessionLog`; the piece changes no file under frontends/shell/src, so the page's handling of keys is as it was. From Microsoft's documentation, read on 2026-11-28 and filed at state/consults/gates/2026-11-28-reload-asking-first-or-off-in-the-installed-build-webview2-settings-pages-reading.md: https://learn.microsoft.com/en-us/microsoft-edge/webview2/reference/win32/icorewebview2settings (the property's sentence, its default, and the sentence on changes made after the `NavigationStarting` event); that page carries a note that the reference is no longer maintained, and the page the note names holds no text for the property. From the architect's read of tauri 2.11.5, tauri-runtime-wry 2.11.4 and wry 0.55.1 at the build gate (state/consults/gates/2026-11-28-reload-asking-first-or-off-in-the-installed-build-build-gate-architect-read-part.md, its section 3 (a)): the app's call comes after the window's build has asked the webview to navigate and before the event loop runs. From no observation: nothing in this item was seen in an installed build. Not observed when it was written: a right-click, Ctrl+R or F5 in an installed build with this change; the line from such a build; what the runtime's menu offers. The human's press on an installed candidate is owed (the node's form, section 0, item 2). -->
````

5. **Each clause, against what I read.**
   - `chrome_for(false)` gives `context_menus: false`, and `apply` calls the menu setter first and then both getters. `Live`'s key setter and getter return the module's error and make no call. `seen` turns that error into `unread`.
   - `setup()` calls `chrome_for` before `get_webview_window`, and moves the value into the closure. So the worker's source 1 is not carried (RD-2, and the architect's note).
   - No main window, a failed `with_webview`, and a failed `CoreWebView2` or `Settings` call each give `NotReached`, and nothing was set.
   - Microsoft's sentences are as the filed reading gives them. The item paraphrases them and quotes none.
   - "Asked the window to load its first page" and "before the event loop runs" rest on the architect's read alone.

6. **The checks on both texts.**
   - The reviewer's run part checks every clause of the amendment and of the item against the code at the correction's head and against the crate sources. That covers item 9's two sentences on tauri's doc comment, and item 2's first sentence, none of which I read. A clause that does not hold comes to me, and a changed text gets a new id.
   - At the merge check I compare the amendment, the item and its comment with this file byte for byte, apart from `<n>`, `<date>`, `NN` and `<path>`.

7. **S-1: taken. One more unit test, U-7, in this correction.**
   - Part A is likely to stand alone for a while, and the reviewer's probe shows that nothing in CI guards the line a build with Part A alone writes.
   - **U-7,** in `webview_chrome.rs`'s tests, on Windows: it builds `Live` from two closures over a value of its own, with no WebView2, calls `apply` with `chrome_for(false)`, and asserts that `readback_line` gives exactly `webview-chrome context_menus=off accelerator_keys=unread` and that the menu setter got `false`. Its name follows U-1 to U-6's.
   - **Its mutation, M-U7,** is the reviewer's probe: `Live::accelerator_keys` returns `Ok(true)`.
   - **It is not red before its code,** because its code is already there. Its evidence is its mutation alone: applied, run, recorded by name with its commit, and reverted, at the correction's head. The amendment declares this before the test is written, as the exception to §4's heading rule.
   - Class 9, recorded by amendment before the commit. Its lines count under class 8, recorded before the code this time.
   - If the test carries a cfg form that names `windows`, the cfg-boundary numbers change in the same commit (Amendment 8 item 3).
   - It runs in Product CI (shell). The push runs at the new head are green before the run parts read it.
   - If Part B is built, its tests replace U-7 under the form.

8. **Not ruled, and taken as the gates give them.**
   - C-1, D-1 and D-2 (the architect's words) and RC-1 (the reviewer's) are applied by the worker under AUTONOMY §31 (d). D-3 goes in by an appended amendment of the form. No two gates give different words for one place.
   - They are true of a build with Part A alone. If Part B is built, its worker changes them with it.
   - RD-1 is for the closing amendment, as the reviewer says.

9. **The order.**
   - One amendment of the form first: this ruling carried, U-7 with M-U7 as item 7 has it, and the lines as class 8.
   - Then one correction: U-7; C-1, D-1, D-2 and RC-1; the ADR's amendment; the KNOWN-LIMITATIONS item with its comment; the cfg-boundary numbers if they move.
   - Then the push runs are read at the new head. The run parts read the correction with E-1's series.

10. **If the human's word on ADV-2026-11-27-45 comes before the merge,** Part B is built under the form. The amendment's item 1, its items 2, 4 and 6 and the KNOWN-LIMITATIONS item then change, and they come to me before a word of them is committed. If the piece is ready to merge and the word has not come, tell me (ADV-2026-11-27-44 item 2).

11. Nothing here is reserved. The human's row for a candidate is still mine to write when a candidate is named, in the order of ADV-2026-11-28-14 item 4. For the human, in the digest: the decision record and the limitation for the reload keys are worded, for the first half alone; both say plainly that nothing was observed in an installed build yet; one more test is added.
