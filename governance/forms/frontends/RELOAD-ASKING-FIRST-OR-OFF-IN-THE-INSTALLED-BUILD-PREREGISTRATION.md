# Asking first, or switching the reload off, in the installed build (PLAN node `reload-asking-first-or-off-in-the-installed-build`): preregistration, full form

**Path proposed:** `governance/forms/frontends/RELOAD-ASKING-FIRST-OR-OFF-IN-THE-INSTALLED-BUILD-PREREGISTRATION.md`.

**Authority** (rulings by id and item):
- ADV-2026-11-27-37 items 5 and 6 (d);
- ADV-2026-11-26-13 item 4 (the proposal, and the line between the advisor's and the human's);
- ADV-2026-11-26-17 item 3 (why a read counts);
- ADV-2026-11-16-06 item 2, which alone sets the class until v0.2 is tagged (ADV-2026-11-23-01 item 3);
- ADV-2026-11-26-18 items 3, 4 and 6 (the posture check, as OPEN-5 proposes).
- The design gap is ADR-037's "What this ADR does not decide", first bullet ([R] `ADR-037-main-window-page-lifecycle-and-kernel-held-opens.md:164-182`).

**Grounds** (ADV-2026-11-18-02 item 2): architecture.

**Drafted by:** the architect (ADV-2026-11-27-37 item 5). Every pin is historical. For the code, the piece's base (B's head) is authoritative.

**Committed before any code.** Append-only once committed. **Read the last amendment first.**

**Gating:** full form (§1). The form gates are a fresh architect and then the reviewer. The build gates are both of them too.

**Merge:**
- Into main, after `reload-ends-the-old-pages-opens` (the node's `depends_on`, [M] `governance/PLAN.yaml:7985`), by a merge commit.
- Whether `release/v0.2` carries it is OPEN-9.

## §0. Disclosure

Reasoned from the code at [R] and from the pinned crate sources. Nothing was built or run.

### 1. The finding: read from the source, not observed (ADV-2026-11-27-37 item 5; ADV-2026-11-26-17 item 3)

**F-1. Both are on by default.**
- wry's Windows defaults keep WebView2's browser accelerator keys and its default context menus on ([crate] `wry-0.55.1/src/lib.rs:1687-1688`).
- They are applied at `wry-0.55.1/src/webview2/mod.rs:571` (the menu, always set from the attribute) and `:582-586` (the keys, set only when the attribute is `false`).

**F-2. The shell cannot reach wry's builder calls, and no config key exists.**
- tauri 2.11.5 and tauri-runtime-wry 2.11.4 never call `with_browser_accelerator_keys` or `with_default_context_menus` (B's S0, [M] `governance/forms/frontends/RELOAD-ENDS-THE-OLD-PAGES-OPENS-PREREGISTRATION.md:58`).
- `tauri-utils-2.9.3/src/config.rs` has no key for either ([M] the same form :59). My own case-insensitive search of that file for `accelerator|context_menu|contextMenu` found 0 matches.
- So under ADR-037 option (iii)/(iv)'s "Needs" ([R] ADR-037:174, :178): there is neither a builder call that tauri exposes nor a key in `tauri.conf.json`.

**F-3. The release build and the development build are the same today.**
- No `cfg` in the pinned sources tells the two builds apart for these two settings.
- [R] `tauri.conf.json:14-20` gives the one window no such key.
- Devtools are compiled in only under `debug_assertions` or tauri's `devtools` feature ([M] the reload form :60).

**F-4. The page handles neither.**
- There is no `beforeunload` handler and no `contextmenu` handler. A case-insensitive search of [R] `frontends/shell/src` for `contextmenu` finds nothing; ADR-037 states the `beforeunload` absence at [R] :130.
- The one `keydown` listener cancels only the app's own chords and keys ([R] `frontends/shell/src/layout/StudioLayout.tsx:279-304`).

**F-5. The path the shell can reach: `with_webview`.**
- tauri 2.11.5 exposes `WebviewWindow::with_webview` ([crate] `tauri-2.11.5/src/webview/webview_window.rs:2369-2376`) and `Webview::with_webview` (`tauri-2.11.5/src/webview/mod.rs:1666-1677`). Both are gated on feature `wry`.
- `wry` is one of tauri's default features ([crate] `tauri-2.11.5/Cargo.toml:84-91`, the registry's normalised manifest). The shell's `tauri` dependency keeps the default features ([R] `frontends/shell/src-tauri/Cargo.toml:58`). So no new Cargo feature is needed.
- `PlatformWebview::controller()` returns `webview2_com::Microsoft::Web::WebView2::Win32::ICoreWebView2Controller` (`tauri-2.11.5/src/webview/mod.rs:149-151`, `:177-184`).
- The closure is sent to the event loop as a message (`tauri-runtime-wry-2.11.4/src/lib.rs:1618-1627`) and run where that message is handled (`:3993`).

**F-6. The calls behind it.**
- The calls are inherent methods in [crate] `webview2-com-sys-0.38.2/src/bindings.rs`:
  - `ICoreWebView2Controller::CoreWebView2` (`:9175`, in the impl at `:8920`);
  - `ICoreWebView2::Settings` (`:1022`, impl at `:1021`);
  - `ICoreWebView2Settings::SetAreDefaultContextMenusEnabled(bool)` (`:35015-35026`) and its getter (`:35003-35014`), both on the base settings interface (impl at `:34885`).
- The accelerator-key setter and getter are only on `ICoreWebView2Settings3` (`:35672-35696`). That interface derefs upward (`:35660-35671`). Going down from `ICoreWebView2Settings` to it means naming the type and calling `windows_core::Interface::cast`.

**F-7. What each part needs.**
- tauri re-exports `wry` and `tao` on Android only ([crate] `tauri-2.11.5/src/lib.rs:179-184`).
- wry's re-exports name no `webview2_com` (`wry-0.55.1/src/lib.rs:377-415`).
- `webview2-com` re-exports the `Microsoft` namespace only (`webview2-com-0.38.2/src/lib.rs:2`).
- So, by this read:
  - **The context menu off** needs no type named and no new dependency. Inherent methods are called on values whose types are inferred. This is not compiled.
  - **The accelerator keys off** need two direct dependencies, `webview2-com` 0.38 and `windows-core` 0.61. The version 0.61 is the one webview2-com-sys uses ([R] `Cargo.lock:5615-5619`); the lock also holds 0.62.2 (`:5703-5704`). Both crates are already in the graph ([R] `Cargo.lock:5586-5597`, `:5690-5691`). The change is still an edit to `Cargo.toml` and to `Cargo.lock` (the shell package's dependency list), so it is the human's (§0 item 3).

**F-8. Which keys and menu items reload is the WebView2 runtime's behaviour, not these sources'.**
- wry's own doc comment on the key setting reads, verbatim, a sub-line span of `wry-0.55.1/src/lib.rs:1713`: "it disables all accelerator keys that access features specific to a web browser."
- A sub-line span of `:1716`, verbatim: "Setting to `false` does nothing on WebView2 Runtime version before 92.0.902.0".
- On the menu, a sub-line span of `:1723`, verbatim: "it disables all context menus on the webview".
- These sources do not show:
  - whether Ctrl+R, Shift+Ctrl+R, F5 and Shift+F5 are among those keys;
  - whether the release build's default menu offers Reload;
  - whether a setting changed after the first navigation has begun applies to that document.

**F-9. The e2e reloads go by CDP, not by a key or the menu.**
- The e2e suites reload with `page.reload()` ([R] `frontends/shell/e2e/pan-anchor.mjs:64`, `project.mjs:414`, `recentre-crossing.mjs:84`). No suite presses F5 or Ctrl+R, or right-clicks (a search of [R] `frontends/shell/e2e`).
- They run `tauri dev`, a debug build, which the proposal leaves unchanged.

### 2. What stays owed

- The human's press of Ctrl+R and F5 in the installed candidate stays owed. It sits on the advisor's row in the candidate's steps (ADV-2026-11-26-17 item 3; ADV-2026-11-27-37 item 5), as B's form records ([M] the reload form :75, :505).
- It does not hold this piece.
- A candidate built before this piece merges shows today's behaviour. For a candidate that carries this piece, the same row would also need a right-click and a reading of §2's read-back line (OPEN-8).

### 3. The human's line (ADV-2026-11-26-13 item 4; ADV-2026-11-27-37 item 5)

**Two new direct dependencies in `frontends/shell/src-tauri/Cargo.toml`, `webview2-com` 0.38 and `windows-core` 0.61, and the `Cargo.lock` change they make (the shell package's dependency list). No crate is added to the graph and no Cargo feature is added (F-5, F-7).** This is the human's, and it goes to the advisor for a draft. Part B of §2 lands only under that approval (OPEN-1). Nothing in this form designs around it.

### 4. Base and overlap facts (for the custodian to confirm by git)

- **Base:** B's head, 5ce0525a.
- **`lib.rs`:**
  - This piece's region is `setup()` after the `measure-build` block and before `Box::leak` ([R] `lib.rs:607-612`), plus one `mod` line.
  - The recovery offer's region is the handler list (`:616-639`).
  - The shared log folder's region is the log-folder resolution (`:391-392`).
  - Regions that do not overlap may share a file (ADV-2026-11-16-06 item 4).
- **`docs/adr/ADR-037-*`:** both this piece (if OPEN-2 is taken) and the recovery offer's Amendment 1 (ADV-2026-11-27-37 item 2) append at the end, so they go in turns (OPEN-2).

### 5. Intake

| Item | Disposition |
|---|---|
| The installed build offers no reload by the default context menu | In (Part A) |
| The installed build turns off WebView2's browser accelerator keys | In, under the human's approval only (Part B; §0 item 3) |
| A development build keeps both | In (OPEN-4 defines it) |
| B's end stays as the defence for a reload that still happens | In, unchanged (no line of `page.rs` or the hook) |
| One line in the new page after a reload that ended something | Out, proposed (OPEN-3) |
| A `beforeunload` prompt (ADR-037 option (i)) | Out: the leaning does not take it |
| Cancelling the keys in the page's `keydown` listener (option (ii)) | Out: not proposed, and not a stand-in for Part B |

## §1. May and may not claim

**May claim**, for the shipped Windows build, from the code and the read:
- In a build without `debug_assertions`, the shell sets WebView2's `AreDefaultContextMenusEnabled` to false (Part A) and, under §0 item 3, `AreBrowserAcceleratorKeysEnabled` to false (Part B), on the main window's webview, once, from `setup()`.
- In a build with `debug_assertions`, it sets both to true, WebView2's default (F-1).
- One session-log line states the values read back after setting, or that they could not be read.
- E-1 (§4): in the dev build, that line is written, with both values read back as on.

**May not claim:**
- that Ctrl+R, F5 or a menu item no longer reloads the installed build: that is owed to the human's press (§0 item 2, F-8);
- any behaviour on WebView2 runtimes before 92.0.902.0 (F-8);
- that a setting applies to the document already loading when it is set;
- any `docs/08` figure;
- macOS or Linux;
- a reload by any other route (dev, CDP, a navigation): B's end covers it, and this piece does not change that end.

**Class: full form and both gates** (ADV-2026-11-16-06 item 2 (a), alone by ADV-2026-11-23-01 item 3). It rests on these criteria:
- **(i) an ADR:** the piece decides the item ADR-037 leaves open, recorded as an appended amendment (OPEN-2);
- **(ii) security:** it changes what the webview offers, and ADV-2026-11-26-18 item 6 keeps any change of posture with the human until they answer (OPEN-5);
- **(iii) Part B's dependency line is the human's;**
- **(iv) "in doubt, full"** (item 2 (b), its last sentence; a paraphrase).

On size and module it would fit item 2 (b): one module, under 260 lines of product code. If the advisor rules OPEN-2 "no amendment", OPEN-3 out and OPEN-5 not engaged, five lines with the reviewer alone would fit. That is the advisor's to say.

**Declared unchanged:**
- `kernel/`, `engine/`, `protocol/`;
- `tauri.conf.json`;
- `capabilities/` ([R] `capabilities/default.json:1-11`);
- the handler list (`lib.rs:616-639`);
- the whole `on_page_load` closure (`lib.rs:270-341`), the `Finished` self-check and the `Started` arm included;
- `page.rs` and `commands.rs`;
- `frontends/shell/src/**`;
- the `measure-build` block (`lib.rs:589-607`).

`Cargo.toml` and `Cargo.lock` stay unchanged except under §0 item 3.

## §2. The change

1. **`frontends/shell/src-tauri/src/webview_chrome.rs` (new, private module):**
   - `fn chrome_for(debug_build: bool) -> Chrome`, with `Chrome { context_menus: bool, accelerator_keys: bool }`. Both fields equal `debug_build`.
   - A private trait `ChromeSettings` with set and read-back methods for each setting. It has one product impl over the WebView2 settings (F-6) and one test fake.
   - `fn apply(settings, chrome) -> Readback`:
     - It sets each setting. A failure of one does not skip the other.
     - It then reads each back: on, off, or unread.
     - There is no `unwrap`, `expect`, indexing or `eprintln!` on the path.
   - `fn readback_line(&Readback) -> String`. Its words are the advisor's (OPEN-6). Proposed: `webview-chrome context_menus=<on|off|unread> accelerator_keys=<on|off|unread>`. The line states only values read; it states no consequence.
   - **Part B only:** the `cast` to `ICoreWebView2Settings3` and the key setter and getter. Without §0 item 3 the key field is not set and reads `unread`, and the form's Part B claims drop (OPEN-1).
2. **`lib.rs`:**
   - `mod webview_chrome;`.
   - In `setup()`, after the `measure-build` block (`:607`) and before `Box::leak` (`:612`): `get_webview_window` for the main window's label, cloned before it moves into `PinnedOrigin` (`:533-536`).
   - Then `with_webview` (F-5), whose closure runs `apply(…, chrome_for(cfg!(debug_assertions)))` and appends `readback_line` to the `SessionLog`.
   - A failed `with_webview` writes one session-log line. Its words are the advisor's (OPEN-6). `setup()` still returns `Ok`.
   - The window comes from config before `setup()` runs, by the comment at `lib.rs:577-584` (that comment's claim, not re-read here).
3. **E-1:** one step in one e2e suite (OPEN-6), plus that suite's `e2e/README.md` entry.
4. **Under OPEN-2 only:** an appended amendment to ADR-037, drafted by the architect, its words ruled by the advisor. `docs/README.md` changes only if `verify:adr-index` needs it.
5. **Under §0 item 3 only:** the two dependency lines in `Cargo.toml`, and `Cargo.lock` as cargo writes it.

## §3. Fixtures and predicted outcomes

- The U tests use the fake `ChromeSettings`: no webview and no tauri runtime. The tauri mock runtime cannot run in this crate's tests ([M] the reload form :322).
- E-1 uses the suite's own launch and resolves the newest session log since that launch, as `source-watch-idle.mjs` already does ([R] `frontends/shell/e2e/source-watch-idle.mjs:131-153`).
- **Predictions:**
  - U-1 to U-4 green at the head;
  - E-1 red at the base (there is no line) and green at the head, with `context_menus=on`;
  - `accelerator_keys=on` under Part B, and `unread` without it.

## §4. Tests, one mutation each

Each mutation is a patch file outside the repository, applied, run and reverted, and named with its commit. A `verify-mutation` run is recorded as a run, never as an observation of a mutation.

| Test | Asserts | Mutation, predicted red |
|---|---|---|
| U-1 `the_installed_build_turns_both_off_and_a_dev_build_keeps_both` | `chrome_for(false)` is off/off and `chrome_for(true)` is on/on | M-U1: `chrome_for` ignores its argument and returns on/on |
| U-2 `apply_sets_each_setting_to_the_decided_value` | the fake records both setters called with off for `chrome_for(false)` | M-U2: the key setter call removed (Part B), or the menu setter call removed (Part A alone) |
| U-3 `a_failed_setting_does_not_skip_the_other_or_panic` | the menu setter returns `Err`, the key setter is still called, the read-back reports the menu as read, and nothing panics | M-U3: `?` on the first setter |
| U-4 `the_line_states_the_values_read_back_not_the_decision` | the fake reads back values that differ from the decision, and the line carries the read-back values | M-U4: the line is built from `Chrome`, not from `Readback` |
| E-1 (OPEN-6's suite), dev build | exactly one `webview-chrome` line since launch, with `context_menus=on`, within the suite's existing bound (no sleep, no retry) | M-E1: the `with_webview` call removed from `setup()` |

**The seam, from the real shape:** E-1 runs the real path in the shipped code: `with_webview`, then `controller`, then `CoreWebView2`, then `Settings`, then set and read back. The off arm in the installed build has no automated test. Its proof is the human's press and the candidate's session-log line (§0 item 2; OPEN-8).

## §5. Invalidators and falsification

- **Invalidators:**
  - Part A does not compile without a named type: then it too needs §0 item 3. That is a stop, to the advisor.
  - `with_webview`'s closure never runs before the suite's bound.
- **Falsification:**
  - E-1 red at the head;
  - E-1 green at the base;
  - any U test green under its own mutation.

## §6. Runs

As B's §6, by reference: the C: floor, the human's app closed, the log folder's rules ([M] the reload form §6). E-1 runs inside the machine's holds.

## §7. Declared values and ceilings

- No new constant.
- **Size:** at most 330 changed lines, insertions plus deletions, over at most 8 files (the Scope below, exactly).
- **Scope:**
  - `webview_chrome.rs` (new);
  - `lib.rs`;
  - OPEN-6's e2e suite;
  - `frontends/shell/e2e/README.md` (its entry only);
  - under OPEN-2: `docs/adr/ADR-037-…md` and, if needed, `docs/README.md`;
  - under §0 item 3: `Cargo.toml` and `Cargo.lock`.
- **Estimate:**
  - module code about 80 lines, its tests about 110;
  - `lib.rs` about 12;
  - E-1 about 35, README about 4;
  - ADR amendment about 25;
  - `Cargo.toml` about 6, `Cargo.lock` about 2.
- **Counting:** as B's §7 line ([M] the reload form §7, the Counting bullet).
- An overrun is class 8, and this line is never edited to match. A scope addition is class 9, recorded before its code. The two conditional rows are preregistered here and are not scope additions.

## §8. Overlap and merge order

- After `reload-ends-the-old-pages-opens`.
- `lib.rs` is shared with the recovery offer and with `app-log-folder-shared-with-test-runs` (§0 item 4).
- ADR-037 is shared with the recovery offer's Amendment 1 (OPEN-2).
- The custodian's rule (00) list at the base decides the rest.
- No `protocol/` path.

## §9. Stops and block-on-sight

1. **The posture stop**, if OPEN-5 is taken: a change found, or none that a gate can rule out, goes to the human.
2. Any diff outside §7, or to a declared-unchanged path. A new command, listener, port, scheme or capability.
3. Any line of the `on_page_load` closure changed.
4. Part B's code, or any `Cargo.toml` or `Cargo.lock` byte, landed before the human's approval is filed.
5. An `unwrap`, `expect`, indexing or `eprintln!` on the apply path, or `setup()` failing on a failed `with_webview`.
6. A claim that a key or menu no longer reloads, made before the human's press.
7. A `verify-mutation` run called an observation; a mutation named without its commit.
8. A §7 overrun not recorded as class 8, or §7 edited to match; a scope addition not recorded as class 9 before its code.
9. A hash at a branch commit; a bare self-line; a test-text span on an unmerged branch named without its commit id.

## §10. Gates

- **The architect's gates read:**
  - §2 against ADR-037, its first not-decided bullet;
  - docs/01's never-block rule (the closure runs once, on the event loop);
  - ADR-006: no class, since the piece is a configuration of the view;
  - docs/02;
  - the caller rule: `chrome_for`, `apply` and `readback_line` have `setup()` as their caller, and the fake is test-only and not `pub`;
  - under OPEN-5, ADV-2026-11-26-18 item 3's named check against ADR-020 with its Amendment 1, ADR-027 and `docs/09`.
  - A search of `docs/` on [M] for `context menu|accelerator|devtools|reload` finds only ADR-035:133.
- **The reviewer reads:**
  - the full diff;
  - each mutation observed;
  - the §7 count;
  - F-6's signatures against the build.
- **Seams**, each against its actual interface:
  - `WebviewWindow::with_webview` (`tauri-2.11.5/src/webview/webview_window.rs:2371`);
  - `PlatformWebview::controller` (`tauri-2.11.5/src/webview/mod.rs:180-184`);
  - the four webview2-com-sys methods of F-6.
- **Suites green before either build gate:**
  - `cargo test --locked`, fmt and clippy in `src-tauri`;
  - the shell's `npm run verify` (with `npm ci` in `renderer/bundle-viewer` too);
  - the verify scripts and `verify:plan`;
  - CI's `node --test`;
  - E-1's suite at the base and at the head, by a tester's series;
  - the branch's CI, read before gating.
- **Operator:** §0 item 2.

### §10a. Ticks against the filed rulings

- ADV-2026-11-27-37 item 5: §0 items 1 to 3, the header.
- ADV-2026-11-27-37 item 6 (d): the header.
- ADV-2026-11-26-13 item 4: Intake, §2, §0 item 3, OPEN-3.
- ADV-2026-11-26-17 item 3: §0 items 1 and 2.
- ADV-2026-11-16-06 item 2: §1, Class.

## OPEN questions (for the advisor)

1. **The human's line (§0 item 3).** The architect recommends:
   - Part A may be built at once.
   - Part B is preregistered here, and its code lands only after the human's approval is filed.
   - If the human declines, the piece lands Part A alone, its claims are cut to the menu, and the keys stay on in the installed build. Option (ii) is not offered as a substitute.
2. **An appended ADR-037 amendment** to record the decision. Recommended: yes. The piece decides an item the ADR leaves open, and ADR-037's Context ([R] :10) lists Ctrl+R, F5 and the menu's Reload as replacing the page. The questions are its number and its turn with the recovery offer's Amendment 1 (ADV-2026-11-27-37 item 2).
3. **The one line after a reload that ended something.** Recommended: out of this piece, as a node of its own if it is wanted.
   - The new page can learn of the end only through a new command, or through new state read by an existing command. Either is a posture question under ADV-2026-11-26-18, and the line is a P6 string.
   - ADR-037's Consequence that a cancelled publish is not shown ([R] :144) then stays true.
4. **"A development build"** = `debug_assertions` alone. Recommended. Under that rule the `measure-build` release binary behaves as installed, which suits a build meant to measure release behaviour. Its harness reloads over CDP (F-9).
5. **Whether ADV-2026-11-26-18 item 3's named check rides on this piece's two architect gates.** Recommended: yes, since in doubt.
   - My reading for the plan: no command, listener, port, scheme or capability is added; `tauri.conf.json` and `capabilities/` are unchanged; the ADR-020 closure is untouched; the installed webview offers fewer browser features.
   - That reading is not the gate's answer.
6. **The two session-log lines' words** (§2 items 1 and 2), and E-1's suite. Proposed: a step in `source-watch-idle.mjs`, which already resolves the session log.
7. **The operator-visible cost** in the installed build:
   - right-click Copy, Paste and Cut in text fields, if the runtime's menu offered them (F-8);
   - find, print and zoom keys under Part B ([R] ADR-037:175).
   - The question is whether a KNOWN-LIMITATIONS item or a walkthrough line comes with the piece. Those words are the advisor's (ADV-2026-11-16-06 item 2 (b)).
8. **The candidate row** (§0 item 2): for a candidate that carries this piece, whether the human's press adds a right-click and a check of the `webview-chrome` line in the sitting's copied log.
9. **Whether v0.2 is still untagged**, which decides whether ADV-2026-11-23-01 item 3 sets the class, and whether this piece merges into `release/v0.2`, which is the human's, as for B.

## §11. Amendments (opens empty, append-only; classes 1 to 9)

## Amendment 1 — 2026-11-28 — the custodian's: the form filed, ADV-2026-11-27-44 carried, the cites into B's head pinned

*References and hashes only. Nothing above is edited.*

1. **The source.** The text above is the architect's draft `state/drafts/2026-11-27-reload-asking-first-or-off-in-the-installed-build-form-architect-draft.md`, its lines 15 to 321 (23334 bytes with LF line ends, sha256 e4e99ab77fba8d82200406b74479f400bc2ce6135844f7d0d1db5be2a10cb0b1), filed by script. Two rooted cites, into files absent from main or shorter there, are shortened to their file names (ADV-2026-11-27-44 item 11); nothing else is changed:
   - `docs/adr/ADR-037-main-window-page-lifecycle-and-kernel-held-opens.md:164-182 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645` (the pin is added here, not in the draft) is filed as `ADR-037-main-window-page-lifecycle-and-kernel-held-opens.md:164-182` (absent on main).
   - `frontends/shell/src-tauri/src/lib.rs:607-612 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645` (the pin is added here, not in the draft) is filed as `lib.rs:607-612` (main has 610 lines).
2. **The ruling** is ADV-2026-11-27-44, filed at `state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-44-the-reload-keys-form-open-1-to-open-9-the-form-files-now-with-the-custodians-amendment-1-the-humans-line-a-draft-of-its-own.md`. Its words are the advisor's under the delegation of 2026-11-13, not the human's. The human's line (its item 1) is the draft ADV-2026-11-27-45, reserved for the human under the grant's item 4. No byte of the shell's Cargo.toml or Cargo.lock changes before the human's typed approval of that draft is filed.
3. **OPEN-1** (item 2): Part A is built once this form's gates pass. Part B's code lands only after that approval is filed. A refusal, or a piece ready to merge with no answer, goes to the advisor.
4. **OPEN-2** (item 3): an amendment appended to ADR-037 records the decision. The architect drafts it, and the advisor rules its words. Its number is given at landing. Of this piece and the recovery offer, the first to reach main takes Amendment 1. The second takes main in by a merge commit, then renumbers its amendment in one commit, with the reviewer's narrow read of both.
5. **OPEN-3** (item 4): out of this piece, and no node is opened for it. **OPEN-4** (item 5): a development build is one with `debug_assertions`, and nothing else. **OPEN-5** (item 6): the named posture check of ADV-2026-11-26-18 item 3 is part of both architect gates, form and build. A change found, or one that a gate cannot rule out, goes to the human through the advisor.
6. **OPEN-6** (item 7): the two session-log lines are the ruling's: `webview-chrome context_menus=<on|off|unread> accelerator_keys=<on|off|unread>`, and `webview-chrome not-applied` with no error text.
   - Under rule (00), E-1 is a step in `frontends/shell/e2e/source-watch-idle.mjs`. No unmerged branch changes that file: 52 were read, each by git diff --name-only from origin/main, three-dot, at 8b7f4eee.
7. **OPEN-7** (item 8): one KNOWN-LIMITATIONS item comes with the piece, in the advisor's words, given after the build. The worker's draft comes first, with a source for each effect: the code, Microsoft's documentation by address and the date it was read, or an observation. The item also says what was not observed in the installed build.
8. **OPEN-8** (item 9): the human's row for a candidate that carries this piece is one press of Ctrl+R, one of F5 and one right-click. The custodian reads the `webview-chrome` line in the sitting's copied log. **OPEN-9** (item 10): full form and both gates; the piece goes into main.
9. **The order** (item 11). The base is B's head, 5ce0525a, and the piece merges after B. The recovery offer also changes `frontends/shell/src-tauri/src/lib.rs` and the ADR file, and the log folder's piece changes `frontends/shell/src-tauri/src/lib.rs`. Whichever lands later takes main in by a merge commit, with the reviewer's narrow read. E-1's run is near the end of the port order, before the log folder's E-1.
10. **The pins.** These are this form's cites into B's head ([R]), each pinned by script over its lines with LF ends (ADV-2026-11-27-44 item 11). An evidence-reader made the inventory they are drawn from, filed at `state/consults/2026-11-28-reload-keys-form-cite-inventory-evidence-reader.md`. Its unresolved rows are resolved here to the shell's files. The [crate] cites are registry sources and are not pinned. The [M] cites are read on main.
- `docs/adr/ADR-037-main-window-page-lifecycle-and-kernel-held-opens.md:10 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 sha256:e4841b5cf8c48f3455d6b19a3510f203f65eff8dad93f04d1837712b7bdd6744`
- `docs/adr/ADR-037-main-window-page-lifecycle-and-kernel-held-opens.md:130 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 sha256:43b5580f7bfaf2c22fc52e9314d3972da43466cc7de904ce20d9ee4228cb7348`
- `docs/adr/ADR-037-main-window-page-lifecycle-and-kernel-held-opens.md:144 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 sha256:08b8bea5caa3ed23cca2132d8c62141c692b013611897a093364d7ad52bfeb90`
- `docs/adr/ADR-037-main-window-page-lifecycle-and-kernel-held-opens.md:164-182 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 sha256:07752873cf379719a9535b149197d90faf7c8b42523053ada11d9f12245c4248`
- `docs/adr/ADR-037-main-window-page-lifecycle-and-kernel-held-opens.md:174 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 sha256:9267d2c919ffdaf9f59a15456cee82207541551f8bbbdc478f9c6202b41d0979`
- `docs/adr/ADR-037-main-window-page-lifecycle-and-kernel-held-opens.md:175 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 sha256:dc4370d1e4f18bfa3ad81f7200e435a358bcc627c8d35b5747efd799c374d8f2`
- `docs/adr/ADR-037-main-window-page-lifecycle-and-kernel-held-opens.md:178 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 sha256:6a4740afeab8fb3ef35f3fee70005e2dcb635d746614deb73a9834fac03dfb86`
- `frontends/shell/src-tauri/tauri.conf.json:14-20 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 sha256:f2bc5843f85f7f4010a4d9cf1d91521d1ce8b36d1ddba2b300dee874baf23a2d`
- `frontends/shell/src-tauri/capabilities/default.json:1-11 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 sha256:2d3380b5f539ea2927767f2f4511c6f4c0c51d8583dbb9bdf305c7888bf750f0`
- `frontends/shell/src-tauri/Cargo.toml:58 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 sha256:6c1e8996a66a95a9d434f622c1eb9646bc20cde09800b1d47906dae5423dd18b`
- `frontends/shell/src-tauri/Cargo.lock:5586-5597 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 sha256:4ebd09a29625123353534d5e1cfb27fc08e29266d4a3223e02246516328b9165`
- `frontends/shell/src-tauri/Cargo.lock:5615-5619 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 sha256:2fd624db356812ed8619cd03e3a159bc3d89631d8ed588f3c4c89892ec960672`
- `frontends/shell/src-tauri/Cargo.lock:5690-5691 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 sha256:486d82462fc625befc775000b05eaac83093117b0a87826f518774b86f252586`
- `frontends/shell/src-tauri/Cargo.lock:5703-5704 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 sha256:98fe27ccd8c9d067de310a1d2df410d1c72f294bdc885afd84c84c0458818e3f`
- `frontends/shell/src-tauri/src/lib.rs:270-341 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 sha256:c0ce6f354999173f428ab110acf896fca37b8dabe783cd90eb91c13641d07ea6`
- `frontends/shell/src-tauri/src/lib.rs:391-392 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 sha256:8382cfd2f33b7e5738638d61c608901b32bc7465c16d5bc4b98a95a7d2e2018f`
- `frontends/shell/src-tauri/src/lib.rs:533-536 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 sha256:bbb71bbb566479a27ddf85965e2c58e8c6087d29b9424031947887fabe258a00`
- `frontends/shell/src-tauri/src/lib.rs:577-584 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 sha256:30f7349f5770cbca9407334ad2a74cad4277e30417f28f63b4683f50696b2ff6`
- `frontends/shell/src-tauri/src/lib.rs:589-607 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 sha256:e4cfaa1020896d022bd569e4e496b4b398d4eda2cdb97bc81e7672bc89a7140b`
- `frontends/shell/src-tauri/src/lib.rs:607 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 sha256:5522c42cd19c6d03d808c452720552825b7ea1c5b491b218511cac7415cf9d9b`
- `frontends/shell/src-tauri/src/lib.rs:607-612 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 sha256:29bbe5ee56cd1cb247ead0340f1c282b537269d7fb12b8f6f573b5b0aae0d059`
- `frontends/shell/src-tauri/src/lib.rs:612 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 sha256:4a3beea5482ae74c701000c2127b73dafc24ae68992b4756573d73f9a2eb5e72`
- `frontends/shell/src-tauri/src/lib.rs:616-639 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 sha256:7107b546774f543bf2621c1ac4f464c851482605c64ffc817640967c5ab808a6`
- `frontends/shell/src/layout/StudioLayout.tsx:279-304 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 sha256:0a91d0771cdc4d24c463e3ac7c29de7fa779c390ee9fe01cc4f2ba94639d897a`
- `frontends/shell/e2e/pan-anchor.mjs:64 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 sha256:4aae8de406c31b3eb926b6adc2fca10e807804f43ca38b94ad7a380404ac3414`
- `frontends/shell/e2e/project.mjs:414 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 sha256:4aae8de406c31b3eb926b6adc2fca10e807804f43ca38b94ad7a380404ac3414`
- `frontends/shell/e2e/recentre-crossing.mjs:84 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 sha256:4aae8de406c31b3eb926b6adc2fca10e807804f43ca38b94ad7a380404ac3414`
- `frontends/shell/e2e/source-watch-idle.mjs:131-153 @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 sha256:06d31ca2bd7bddef2b3bc1f6613a63ed53f9e24ce8102672757dd68e825a9a9a`
11. **Next:** a fresh architect form gate, then the reviewer's. Part A's code waits for both.

Read the last amendment first.

## Amendment 2 — 2026-11-28 — the custodian's: the architect's form gate (FAIL), its words applied but three, which go to the advisor

*References only. Nothing above is edited.*

1. **The architect's form gate** at main 9fca8614 and B's head 5ce0525a: FAIL, filed at `state/consults/gates/2026-11-28-reload-asking-first-or-off-in-the-installed-build-form-gate-architect.md` (its hand-back's sha256 d952ee837e0953447413d0cda35547aa872df2ca84448df514cd0a57324c9c87). It has one Correctness finding (C1), three Evidence findings (E1 to E3), two Architecture findings (A1, A2) and six Documentation findings (D1 to D6). Its words are the architect's, not the human's or the advisor's.
2. **Applied with no re-gate (§31), as that report writes them:** C1 with its follow-on, E1, E2, E3 with its second change, A1, A2, D2's first and third changes, D3, D5, and D6's first change. A1 is met before Part A's build.
3. **D6's second change:** §2 item 5's two dependency lines take their default features, and check 8's reading of Part B rests on that. Part B stays the human's (ADV-2026-11-27-45).
4. **To the advisor:** D2's second change, since it writes the not-applied line for a case ADV-2026-11-27-44 item 7 does not name (no main window found); D1, KNOWN-LIMITATIONS.md as a ninth file in §7's Scope; and D4, Amendment 1 item 10's pins at B's head beside round 15 (e) and round 25 item 2, a matter of rulings. The pins stand until that ruling.
5. **For the human's digest, beside ADV-2026-11-27-45** (that report's check 7): a direct `webview2-com` dependency ties the shell to the version tauri takes, which that report reads as able to move in a tauri minor release.
6. **Next:** after the advisor's ruling, the reviewer's form gate reads the form with this amendment. Part A's code waits for both gates.

Read the last amendment first.

## Amendment 3 — 2026-11-28 — the custodian's: ADV-2026-11-28-04 carried (the not-applied line, KNOWN-LIMITATIONS.md a ninth file, the pins read again)

*References and hashes only. Nothing above is edited.*

1. **The ruling** ADV-2026-11-28-04 is filed at `state/directives/2026-11-28-advisor-ruling-adv-2026-11-28-04-the-reload-keys-form-not-applied-whenever-the-settings-are-not-reached-a-ninth-file-the-pins-at-bs-head-withdrawn.md`. It answers Amendment 2 item 4. Where this amendment summarises it, the ruling's bytes govern.
2. **D2's second change** (its item 1): the words are that item's fence, byte for byte, in place of the gate's New. `webview-chrome not-applied` is written whenever the settings were not reached, and the read-back line, with `unread` for each value whose read failed, when they were. The read-back line is at `info` and the not-applied line at `error`. The case where the runtime drops the closure writes no line and is named in the source comment; the build's architect gate says whether the gate's read of it still holds at the built head. This widens ADV-2026-11-27-44 item 7's second bullet (`state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-44-the-reload-keys-form-open-1-to-open-9-the-form-files-now-with-the-custodians-amendment-1-the-humans-line-a-draft-of-its-own.md`); its other bullets and the bytes of both lines stand.
3. **D1** (its item 2): class 9 on ADV-2026-11-27-44 item 8, declared before the item's text lands. The Scope gains `KNOWN-LIMITATIONS.md`, for that one item, and the file ceiling is 9. §7's own line is not edited. The line ceiling stays 330; a count past it with the item is class 8 at the count. The item's number is taken by the custodian's script over every unmerged branch.
4. **D4, the pins** (its item 3). Round 15 (e) is the human's and stands; ADV-2026-11-27-44 item 11's first bullet is withdrawn as far as it ordered a hash at a commit not on main. Amendment 1 item 10 is read so, the departure's cause being that ruling. 5ce0525a is not an ancestor of main at 01bb2de868f0835efcfb5e9bc6622dd9f73638a1, by `git merge-base --is-ancestor`.
   - **(i) Pinned again at a commit on main.** The custodian's script read each of the 28 pins: each hash was reproduced at 5ce0525a over its lines with LF ends, and a changed text did not reproduce it. 11 are in a file whose blob is the same on main at 01bb2de868f0835efcfb5e9bc6622dd9f73638a1 as at 5ce0525a, and each is pinned again there, each hash equal to its old one. These pins govern:
     - `frontends/shell/src-tauri/tauri.conf.json:14-20 @ 01bb2de868f0835efcfb5e9bc6622dd9f73638a1 sha256:f2bc5843f85f7f4010a4d9cf1d91521d1ce8b36d1ddba2b300dee874baf23a2d`
     - `frontends/shell/src-tauri/capabilities/default.json:1-11 @ 01bb2de868f0835efcfb5e9bc6622dd9f73638a1 sha256:2d3380b5f539ea2927767f2f4511c6f4c0c51d8583dbb9bdf305c7888bf750f0`
     - `frontends/shell/src-tauri/Cargo.toml:58 @ 01bb2de868f0835efcfb5e9bc6622dd9f73638a1 sha256:6c1e8996a66a95a9d434f622c1eb9646bc20cde09800b1d47906dae5423dd18b`
     - `frontends/shell/src-tauri/Cargo.lock:5586-5597 @ 01bb2de868f0835efcfb5e9bc6622dd9f73638a1 sha256:4ebd09a29625123353534d5e1cfb27fc08e29266d4a3223e02246516328b9165`
     - `frontends/shell/src-tauri/Cargo.lock:5615-5619 @ 01bb2de868f0835efcfb5e9bc6622dd9f73638a1 sha256:2fd624db356812ed8619cd03e3a159bc3d89631d8ed588f3c4c89892ec960672`
     - `frontends/shell/src-tauri/Cargo.lock:5690-5691 @ 01bb2de868f0835efcfb5e9bc6622dd9f73638a1 sha256:486d82462fc625befc775000b05eaac83093117b0a87826f518774b86f252586`
     - `frontends/shell/src-tauri/Cargo.lock:5703-5704 @ 01bb2de868f0835efcfb5e9bc6622dd9f73638a1 sha256:98fe27ccd8c9d067de310a1d2df410d1c72f294bdc885afd84c84c0458818e3f`
     - `frontends/shell/src/layout/StudioLayout.tsx:279-304 @ 01bb2de868f0835efcfb5e9bc6622dd9f73638a1 sha256:0a91d0771cdc4d24c463e3ac7c29de7fa779c390ee9fe01cc4f2ba94639d897a`
     - `frontends/shell/e2e/pan-anchor.mjs:64 @ 01bb2de868f0835efcfb5e9bc6622dd9f73638a1 sha256:4aae8de406c31b3eb926b6adc2fca10e807804f43ca38b94ad7a380404ac3414`
     - `frontends/shell/e2e/recentre-crossing.mjs:84 @ 01bb2de868f0835efcfb5e9bc6622dd9f73638a1 sha256:4aae8de406c31b3eb926b6adc2fca10e807804f43ca38b94ad7a380404ac3414`
     - `frontends/shell/e2e/source-watch-idle.mjs:131-153 @ 01bb2de868f0835efcfb5e9bc6622dd9f73638a1 sha256:06d31ca2bd7bddef2b3bc1f6613a63ed53f9e24ce8102672757dd68e825a9a9a`
   - **(ii) Read in the words form until B is on main,** with no hash: 17 spans, each in a file that differs between main and 5ce0525a. The hashes written beside them in Amendment 1 item 10 are not references of this record until then:
     - line 10 of `docs/adr/ADR-037-main-window-page-lifecycle-and-kernel-held-opens.md` at 5ce0525a
     - line 130 of `docs/adr/ADR-037-main-window-page-lifecycle-and-kernel-held-opens.md` at 5ce0525a
     - line 144 of `docs/adr/ADR-037-main-window-page-lifecycle-and-kernel-held-opens.md` at 5ce0525a
     - lines 164 to 182 of `docs/adr/ADR-037-main-window-page-lifecycle-and-kernel-held-opens.md` at 5ce0525a
     - line 174 of `docs/adr/ADR-037-main-window-page-lifecycle-and-kernel-held-opens.md` at 5ce0525a
     - line 175 of `docs/adr/ADR-037-main-window-page-lifecycle-and-kernel-held-opens.md` at 5ce0525a
     - line 178 of `docs/adr/ADR-037-main-window-page-lifecycle-and-kernel-held-opens.md` at 5ce0525a
     - lines 270 to 341 of `frontends/shell/src-tauri/src/lib.rs` at 5ce0525a
     - lines 391 to 392 of `frontends/shell/src-tauri/src/lib.rs` at 5ce0525a
     - lines 533 to 536 of `frontends/shell/src-tauri/src/lib.rs` at 5ce0525a
     - lines 577 to 584 of `frontends/shell/src-tauri/src/lib.rs` at 5ce0525a
     - lines 589 to 607 of `frontends/shell/src-tauri/src/lib.rs` at 5ce0525a
     - line 607 of `frontends/shell/src-tauri/src/lib.rs` at 5ce0525a
     - lines 607 to 612 of `frontends/shell/src-tauri/src/lib.rs` at 5ce0525a
     - line 612 of `frontends/shell/src-tauri/src/lib.rs` at 5ce0525a
     - lines 616 to 639 of `frontends/shell/src-tauri/src/lib.rs` at 5ce0525a
     - line 414 of `frontends/shell/e2e/project.mjs` at 5ce0525a
   - **(iii)** Line 414 of `frontends/shell/e2e/project.mjs` is test text that exists only on B. It is named in words by the commit's id, with no hash, until the merge (round 25 item 2 (d)), as (ii) has it.
   - **(iv)** Once B is on main, an appended class 3 row gives each span of (ii) its hash pin: at 5ce0525a if it is then reachable from main, and otherwise at a commit on main by script. That row is on main before this piece leaves draft.
5. **From now on** (its item 3): a form built on a held base cites its base's text in the words form, with no hash, until that base is on main. The recovery form's pins stand as its gate's N-47 reads them.
6. **Next:** the reviewer's form gate reads the form with Amendments 2 and 3. Part A's code waits for it.

Read the last amendment first.

## Amendment 4 — 2026-11-28 — the custodian's: the reviewer's form gate (FAIL), its words applied but DOC-2, which waits with DOC-5 for the advisor

*References only. Nothing above is edited.*

1. **The reviewer's form gate** at main 51f5e1da, B's head 5ce0525a and the pins at 01bb2de8: FAIL, filed at `state/consults/gates/2026-11-28-reload-asking-first-or-off-in-the-installed-build-form-gate-reviewer.md` (its hand-back's sha256 9fe21cd14b4527eef3e17340f0c86a632276ad6634f7b41f125aab997a6530c5). It has two Evidence findings (EV-1, EV-2) and five Documentation findings (DOC-1 to DOC-5). Its words are the reviewer's, not the human's or the advisor's.
2. **Applied with no re-gate (§31), as that report writes them:** EV-1; EV-2's two pairs (U-5 and U-6 join §4 with the E-1 row as its New 1 has them, and the sentence of its New 2); DOC-1's two pairs; DOC-4. Each Old stands once in this form, by a node count, with a changed text as the control. EV-2 adds one module function to §2's plan. §7's line ceiling stays 330, and a count past it is class 8 at the count (Amendment 3 item 3).
3. **DOC-3,** appended byte for byte from that report: Amendment 2's D3 words cite lines 418 and 454 of `frontends/shell/src-tauri/src/lib.rs` at 5ce0525a; they are read in the words form with Amendment 3 (ii)'s 17 spans, and Amendment 3 (iv)'s row pins them too.
4. **To the advisor:** DOC-5, the meaning of `unread` for the key under Part A alone beside ADV-2026-11-28-04 item 1's third bullet, with that report's fact that the ruled case of `with_webview` returning `Err` cannot run from `setup()`; and DOC-2, whose words follow that answer. DOC-2 is not applied before it.
5. **The order's source** (that report's outside check): Amendment 1 item 9's "before the log folder's E-1" rests on ADV-2026-11-27-47 item 7, which is later than ADV-2026-11-27-44 item 11 and sends the log folder's E-1 run to the end of the port order.
6. **Next:** Part A's code waits for the advisor's answer on DOC-5. No further form gate is planned (§31), unless that answer asks for one.

Read the last amendment first.

## Amendment 5 — 2026-11-28 — the custodian's: ADV-2026-11-28-05 carried (`unread` under Part A alone, DOC-2 as the gate gives it), and one narrow second attempt of each form gate

*References only. Nothing above is edited.*

1. **The ruling** ADV-2026-11-28-05 is filed at `state/directives/2026-11-28-advisor-ruling-adv-2026-11-28-05-the-reload-keys-unread-under-part-a-alone-doc-2-as-the-gate-gives-it-one-narrow-second-attempt-of-each-form-gate.md`. It answers Amendment 4 item 4. Where this amendment summarises it, the ruling's bytes govern.
2. **`unread`** (its item 1): the third bullet of ADV-2026-11-28-04 item 1 is replaced by the ruling's item 1. §1's line claim is the fence of ADV-2026-11-28-05 item 1, byte for byte, in place of the fence of ADV-2026-11-28-04 item 1 (Amendment 3 item 2 is read so). The bytes of both lines, both levels and the not-applied cases stand. The source comment at the key setter and getter is the worker's, as the ruling's item 1 says.
3. **The case where `with_webview` returns `Err`** (its item 2) stands as the reviewer's gate reads it. The source comment at that arm says, in the worker's words, that it cannot run from `setup()` today, naming the crate version the gate read. No test is claimed for the arm.
4. **DOC-2** (its item 3) is applied as the reviewer's report gives it (Amendment 4 item 1), from that report's bytes. Its Old stands once in this form, by the node count of Amendment 4 item 2.
5. **The second attempts** (its item 4), each narrow, as the ruling lists what each reads: the reviewer's attempt 2 reads Amendment 4 and this amendment; the architect's attempt 2 reads Amendments 2 to 5. Everything else of each attempt 1 is carried forward. Words-only findings are applied with no third attempt; a FAIL on anything else goes to the advisor. They run in either order or at once. Both attempts 1 stay FAIL in every record.
6. **The candidate's row** (its item 5, OPEN-8) is the advisor's, written when a candidate is named.
7. **Next:** the two second attempts, now that this amendment is on main. Part A's code is dispatched when both have ended PASS or PASS WITH NOTES.

Read the last amendment first.

## Amendment 6 — 2026-11-28 — the custodian's: both form gates' attempts 2 (PASS WITH NOTES), their words applied, Part A's code next

*References only. Nothing above is edited.*

1. **The gate** is filed at `state/consults/gates/2026-11-28-reload-asking-first-or-off-in-the-installed-build-form-gate-architect-attempt-2.md`: PASS WITH NOTES, attempt 2, read at main 8cacfdd1bbbd47e03a4252d60f8168c12aaa8593 and B's head 5ce0525a. No Correctness or Evidence finding. Attempt 1 stays FAIL.
2. **Applied with no third attempt** (ADV-2026-11-28-05 item 4; §31): A3 (before Part A's code) and D7 (before the merge), each as that report gives it. The form reads each New in the place of its Old. Each Old stands once in this form, by a node count with a control, before this amendment.
3. **The note on `session_log`** in that report's check 3 is the build gate's to read, as the report says.
4. **The reviewer's attempt 2** is filed at `state/consults/gates/2026-11-28-reload-asking-first-or-off-in-the-installed-build-form-gate-reviewer-attempt-2.md`: PASS WITH NOTES, read at main 8cacfdd1 and B's head 5ce0525a. No Correctness or Evidence finding. Attempt 1 stays FAIL.
5. **DOC-A** (before the merge; words only, with no Old) is applied with no third attempt. Its words, appended here byte for byte from that report:

   > E-1's expected `accelerator_keys` value is one fixed string in the suite's source: `unread` in the commit that lands Part A alone, and `on` in the commit that adds §0 item 3; the step never accepts both.

6. **Next:** both attempts 2 ended PASS WITH NOTES (ADV-2026-11-28-05 item 4), so Part A's code is dispatched on B's head once this amendment is on main. Part B stays behind the human's typed approval of ADV-2026-11-27-45.

Read the last amendment first.

## Amendment 7 — 2026-11-28 — the custodian's: Part A's code at 8ba765d9, §7's line ceiling passed (class 8 at the count), the build gates' notes, and a question to the advisor

*References only. Nothing above is edited.*

1. **The report** is filed at `state/consults/gates/2026-11-28-reload-asking-first-or-off-in-the-installed-build-part-a-code-worker-report.md` (its hand-back's sha256 ea99ca3ad3a7c387dafe907036a42d7353c09e11696509a395d665edfac3a75c). Part A is at 8ba765d9eaaa5a0ceb79a0e3baa4c2f597996e5e on `cut/reload-asking-first-or-off-in-the-installed-build`, 4 commits over B's head 5ce0525a; `git diff --shortstat 5ce0525a...8ba765d9` gives: 4 files changed, 412 insertions(+). By the report, at 8ba765d9, `cargo test --locked`, `cargo clippy --locked --all-targets` and `cargo fmt --check` in `src-tauri` and the shell's `npm run verify` exited 0; U-1 to U-6 were red at 95b73447; M-U1 to M-U6 were observed at bffb4a223a9f458ca6e5735c1503e7b962d01074, each with the failing tests the report names; M-E1 and E-1 are written and not run. By the custodian's run, `git diff 5ce0525a 8ba765d9` over the shell's `Cargo.toml` and `Cargo.lock` is empty.
2. **Class 8 at the count** (§7; Amendment 3 item 3; Amendment 4 item 2). By `git diff --numstat 5ce0525a...8ba765d9`, insertions plus deletions, the custodian's run: 412 lines over 4 files, against at most 330 lines and 9 files, so over by 82 lines. By file: `webview_chrome.rs` 327, `lib.rs` 38, `source-watch-idle.mjs` 41, the e2e `README.md` 6. §7's line is not edited. The KNOWN-LIMITATIONS item, still to come, adds to the count.
3. **For the build gates, from the report** (the worker's account, not a ruling):
   - the caller rule of §10: `chrome_for` and `log_entry` are called by `setup()`; `apply` is reached from `setup()` only through `reach`, and `readback_line` only through `log_entry`, the trait being kept private. The architect's build gate says whether this meets §10's caller rule;
   - `reach` and `Live` sit behind `cfg(windows)`, with a `cfg(not(windows))` stub of `reach` that the form does not name: the worker's addition, inside a Scope file;
   - no unit test reads the key stub's `unread` under Part A alone; E-1 alone does, and it has not run;
   - one clippy warning, in `publish.rs` (`PrepareOutcome`), is on no line of this piece;
   - Amendment 6 item 3's note on `session_log` stands for the build gate.
4. **The KNOWN-LIMITATIONS item** (OPEN-7; Amendment 3 item 3). The worker's draft is in the report, with a source for each effect and what was not observed in the installed build. It names no Microsoft documentation, since the worker had no web access. Its words are the advisor's, given after the build; the draft goes to the advisor with item 5's question.
5. **Next: a question to the advisor.** §10 puts E-1's suite at the base and at the head, by a tester's series, and the branch's CI before either build gate. E-1 runs at port 5180, which the human holds, near the end of the port order. Whether the build gates run in two parts, as ADV-2026-11-27-08 item 3 and ADV-2026-11-27-18 item 2 have it for other pieces, is the advisor's to rule. No build gate is dispatched before that ruling. ADR-037's amendment under OPEN-2 is the architect's draft at its build gate. Part B stays behind the human's typed approval of ADV-2026-11-27-45.

Read the last amendment first.

## Amendment 8 — 2026-11-28 — the custodian's: ADV-2026-11-28-09 carried (the branch's CI red on a count, a finding; class 9, a tenth file; the build gates in two parts once green; five questions to the read parts) and ADV-2026-11-28-10's push runs

*References only. Nothing above is edited.*

1. **The rulings** are filed at `state/directives/2026-11-28-advisor-ruling-adv-2026-11-28-09-the-reload-keys-ci-red-on-a-count-a-tenth-file-the-build-gates-in-two-parts-once-green-microsofts-pages-read-first.md` and `state/directives/2026-11-28-advisor-ruling-adv-2026-11-28-10-a-piece-with-no-pull-request-has-its-ci-read-from-the-push-runs-the-recovery-offers-shell-run-at-96c3821a.md`.
2. **A finding** (the human's rule of 2026-11-22, item 1; ADV-2026-11-28-09 items 1 and 2). At 8ba765d9 the Governance CI push run 46109593852 is red at CI's `node --test`, and so is run 46108184551 at bffb4a22. One test fails, `the_boundary_check_passes_on_the_shipped_tree_and_lists_every_boundary_site` in `scripts/plan/cfg-boundary.test.mjs`, on the number of sites. At the base 5ce0525a that workflow was green (run 45960162228). The cause is this piece: `webview_chrome.rs` adds five cfg forms that name `windows` (ADV-2026-11-28-09 item 1). The report and Amendment 7 do not say that suite was run. The job's later steps did not run. Rust fmt was red at bffb4a22 (run 46108184529) and is green at 8ba765d9 (run 46109593817), the report's fmt commit.
3. **Class 9, recorded before its commit** (ADV-2026-11-28-09 item 3). §7's Scope gains `scripts/plan/cfg-boundary.test.mjs`, a tenth file, for that test's three expectations only: the number of site lines, the summary line, and one entry in the per-file map for `frontends/shell/src-tauri/src/webview_chrome.rs`. `scripts/plan/cfg-boundary.mjs` and its allowlist do not change. The file ceiling is 10. §7's line is not edited, and the lines count on as class 8 at the count (Amendment 7 item 2). If a read part changes the cfg forms, the correction that does so changes those numbers in the same commit. Rule (00): by the custodian's scan of `git diff --name-only origin/main...<branch>` over every branch on origin, no other branch changes either file.
4. **The build gates run in two parts** (ADV-2026-11-28-09 item 4; ADV-2026-11-27-08 item 3; ADV-2026-11-27-18 item 2), once item 3's correction is pushed and the push runs at the new head are green. §10's "Suites green before either build gate" changes in time only, and for E-1's series alone. The read part is the diff against the form; U-1 to U-6 and M-U1 to M-U6 again in holds; the caller rule; the OPEN-5 posture check; F-6's signatures against the build; the §7 count; and ADR-037's amendment under OPEN-2, drafted by the architect. Its cargo runs wait as ADV-2026-11-28-08 item 2 has it. There is no verdict and no gate-log row before the run part. A finding of the read part is corrected before E-1's series. The run part reads the series at the base and at the head, and the branch's push runs at that head. Where the two gates give different words for one place, both go to the advisor. A later step of the Governance CI job that is red after the correction goes to the advisor before anything is changed for it.
5. **Five questions to the read parts** (ADV-2026-11-28-09 item 5): (a) and (b) are the architect's, (c) and (d) the reviewer's, and (e) both gates', as that item words them. Each answer goes to the advisor before the ADR amendment's words and the KNOWN-LIMITATIONS item.
6. **The branch's CI** (ADV-2026-11-28-09 item 6; ADV-2026-11-28-10 item 1) is read from the push runs after each push and before a gate is dispatched on that head. The pull request is opened once B is on main, and the sign-off check and the exposure scan are read then.
7. **Microsoft's pages** (ADV-2026-11-28-09 item 7). The reading is filed at `state/consults/gates/2026-11-28-reload-asking-first-or-off-in-the-installed-build-webview2-settings-pages-reading.md`. Both pages carry a note that the reference is no longer maintained. The note's link leads to a landing page with no text for either property, so no newer text was read. The KNOWN-LIMITATIONS item is worded by the advisor after both read parts, in one ruling with the ADR amendment.
8. **Next.** Once this amendment is on main, a worker makes item 3's correction on the branch. Its push runs are read, and then the two read parts are dispatched. Part B stays behind the human's typed approval of ADV-2026-11-27-45.

Read the last amendment first.

## Amendment 9 — 2026-11-28 — the custodian's: the cfg-boundary correction at 5174676a, its push runs green, and the two read parts next

*References only. Nothing above is edited.*

1. **The correction** (Amendment 8 item 3). The report is filed at `state/consults/gates/2026-11-28-reload-asking-first-or-off-in-the-installed-build-part-a-cfg-boundary-correction-worker-report.md` (its hand-back's sha256 dfd6613be80b543545d09f281eca642a1863de25e173c0cb94805edb383aa35c). 5174676a is one commit over 8ba765d9, and by the custodian's run `git diff --numstat 8ba765d9 5174676a` gives 3 insertions and 2 deletions in `scripts/plan/cfg-boundary.test.mjs` alone: that test's three expectations. By the report, the test was red at 8ba765d9 on the number of sites and is green at 5174676a, and the steps of the Governance CI job from CI's `node --test` to its end passed when run in the worktree. Four of those steps' exit codes were not kept; their PASS lines are the report's evidence.
2. **The count** (§7; Amendment 7 item 2; Amendment 8 item 3). By `git diff --numstat 5ce0525a...5174676a`, insertions plus deletions, the custodian's run: 417 lines over 5 files, against at most 330 lines and 10 files, so over by 87 lines, class 8 at the count. §7's line is not edited.
3. **The push runs at 5174676a** (ADV-2026-11-28-10 item 1). Governance CI, run 46114973221: success. Ported notices, run 46114973284: success. Product CI (shell) and Rust fmt made no run at 5174676a, since their workflows' paths are not touched by it. At 8ba765d9, whose product files are the same, they are green (runs 46109593858 and 46109593817).
4. **A departure.** The worker opened one background task's output file, which its brief forbids, and reports that it was empty.
5. **Next.** The two build gates' read parts (Amendment 8 item 4) are dispatched on 5174676a, both on Opus, with Amendment 8 item 5's questions. Their cargo runs wait as ADV-2026-11-28-08 item 2 has it.

Read the last amendment first.

## Amendment 10 — 2026-11-28 — the custodian's: the architect's read part dispatched; the reviewer's waits for room on D:

*References only. Nothing above is edited.*

1. **The architect's read part** was dispatched at 2026-11-28T06:37:11Z (date -u) on 5174676a, on Opus, reading main at 9d513c97e8688ccc77efb76edf5311cf10848f45. It runs no cargo.
2. **The reviewer's read part is not dispatched**, in place of Amendment 9 item 5's word that both are. Its cargo runs need keys-target rebuilt (ADV-2026-11-28-08 item 2). keys-target was 9126 MB when it was removed, and D: had 12236 MB free at 2026-11-28T06:25:57Z (date -u), so a rebuild leaves D: under the 8,000 MB margin. The advisor was asked at 2026-11-28T06:35:37Z (date -u) which way to take, as that ruling's last line has it.

Read the last amendment first.

## Amendment 11 — 2026-11-28 — the custodian's: the architect's read part filed, its findings, and room on D: for the reviewer's (ADV-2026-11-28-11)

*References only. Nothing above is edited. Where this amendment summarises a ruling or a report, its bytes govern.*

1. **The architect's read part** is filed at `state/consults/gates/2026-11-28-reload-asking-first-or-off-in-the-installed-build-build-gate-architect-read-part.md` (its hand-back's sha256 87e92268a04ce7a97960d9ea81633985d1676a95e330cbfbd27e71e22ae407fe). It gives no verdict. By it: no Architecture finding; §9 item 1's posture stop is not engaged; §2, docs/01, ADR-006, docs/02 and the caller rule are met.
2. **Its findings, words only, no code behaviour:** C-1, D-1 and D-2 in two source files' comments, applied by a worker after the reviewer's read part, with that part's findings; D-3 in §10's caller-rule sentence, applied by a later amendment of this form. If the reviewer's words for a place differ, both go to the advisor first (ADV-2026-11-27-10 item 2).
3. **For the advisor, before any words are committed:** its answers to ADV-2026-11-28-09 item 5 (a), (b) and (e); its draft of ADR-037's amendment (OPEN-2); R-1 and R-2, clauses in ruled texts; and one effect of the KNOWN-LIMITATIONS draft that the code contradicts.
4. **Room on D:** ADV-2026-11-28-11 is filed at `state/directives/2026-11-28-advisor-ruling-adv-2026-11-28-11-c-comes-first-room-on-c-before-the-keys-rebuild-a-spare-target-on-d-goes-first.md`. The identity route's spare build, `D:/wt/idr/target/debug`, was removed at 2026-11-28T06:50:08Z (date -u); D: went from 12140 to 26859 MB. `D:/wt/idr-target` stays: its last build is the newer, by the file times of its `slice-host` binary (2026-11-27, against 2026-11-26 in the other). The route's port run's brief names it. `D:/wt/idr/target` keeps its `fixtures` and `slice-evidence`. A's `D:/wt/a2save/target` holds only test fixtures and `slice-evidence`, with no build; A's build is in `D:/wt/a2save-target`, which stays, so nothing of A's was removed.
5. **Next.** The reviewer's read part goes out when C: allows (ADV-2026-11-28-11 items 1 and 3); its cargo runs rebuild keys-target once, in holds, each after its own read of C:.

Read the last amendment first.

## Amendment 12 — 2026-11-28 — the custodian's: ADV-2026-11-28-14 carried: the architect's answers taken; the order of the human's row; the ADR amendment and the KNOWN-LIMITATIONS item after the reviewer's read part

*References only. Nothing above is edited. Where this amendment summarises the ruling, its bytes govern.*

1. **The ruling** is filed at `state/directives/2026-11-28-advisor-ruling-adv-2026-11-28-14-the-reload-keys-a-b-e-r-1-and-r-2-taken-the-adr-amendment-and-the-known-limitations-item-after-the-reviewers-read-part.md`.
2. **(a), (b) and (e) are taken** as the architect's read part gives them (its items 1 to 3). §1's third "may not claim" stands as it is. The stub and the five cfg forms stand, and no change to two forms is asked. The class 8 at the count stands as Amendments 7 and 9 record it; the stub is a code path inside a Scope file, and nothing more is owed for it.
3. **R-1 and R-2 are taken** (its items 4 and 5). The order of the human's row is the one its item 4 gives, the right-click first. Where a record quotes ADV-2026-11-27-44 item 12, it is read with the ruling's item 5.
4. **ADR-037's amendment (OPEN-2) and the KNOWN-LIMITATIONS item** (its item 6): no word of either is committed before the advisor's one ruling on both, after the reviewer's read part.
5. **C-1 and D-1 to D-3** (its item 7) are held until the reviewer's read part; where its words for a place differ, both go to the advisor first. D-3 goes in by an appended amendment.

Read the last amendment first.

## Amendment 13 — 2026-11-28 — the custodian's: the reviewer's read part filed; its findings; the advisor's one ruling on the ADR amendment and the KNOWN-LIMITATIONS item now due

*References only. Nothing above is edited. Where this amendment summarises the report, its bytes govern.*

1. **The reviewer's read part** at 5174676a is filed at `state/consults/gates/2026-11-28-reload-asking-first-or-off-in-the-installed-build-build-gate-reviewer-read-part.md` (its hand-back's sha256 e8aeb1ab8bfc86868d890c8824b99a7aec1e8f5247bdf790c24469ad94b65198). It gives no verdict. By it: the five paths are in Scope and the declared-unchanged paths are untouched; the count is 417 lines over 5 files, with class 8 as Amendments 7 and 9 record it; the caller rule is met; each of M-U1 to M-U6 turned its own test red at 5174676a, and those runs are the observations of record at that head (its check 4); the suites that start no app are green at the head; no item of §9 is met; the seams match the registry sources the lock names.
2. **Its findings:** RC-1, words only, in `lib.rs`'s region comment, with its Old and New; RD-1, a record: the closing amendment records `verify-mutation`'s exit 1 at the head as a run, never as an observation, and names the report's check 4 as the observation of record; RD-2, the KNOWN-LIMITATIONS draft's source 1 clause that the code contradicts, as the architect found, with no words proposed. It agrees with the architect's C-1, D-1 and D-2 and gives no words of its own for their places, so no two gates give differing words for one place.
3. **For the advisor now** (Amendment 12 item 4): its one ruling on ADR-037's amendment (OPEN-2) and the KNOWN-LIMITATIONS item, with RD-2; and the reviewer's suggestion S-1 under ADV-2026-11-28-09 item 5 (c), a Windows unit test over the live settings that would put the key stub under Product CI (shell), which is a suggestion and not a finding.
4. **For the run part:** E-1 at the base and at the head, with E1's FAIL note read as `found 0`; E-1's series is the only evidence that the settings call made inline from `setup()` runs without a panic.
5. **Next:** after the advisor's ruling, one worker applies C-1, D-1, D-2 and RC-1 (words only, no re-gate), and D-3 goes in by an appended amendment. `D:/wt/keys-target` (9006 MB, by the report) stays for the port run.

Read the last amendment first.

## Amendment 14 — 2026-11-28 — the custodian's: ADV-2026-11-28-16 carried (ADR-037's amendment, the KNOWN-LIMITATIONS item, U-7 with M-U7 as class 9); D-3 applied; the correction's lines as class 8, before its code

*References only. Nothing above is edited. Where this amendment summarises the ruling or a report, its bytes govern; every text to be written is taken from the ruling's file alone.*

1. **The ruling** is filed at `state/directives/2026-11-28-advisor-ruling-adv-2026-11-28-16-the-reload-keys-part-a-adr-037s-amendment-accepted-the-known-limitations-item-worded-s-1-taken-as-u-7.md`, in answer to the custodian's message sent at 2026-11-28T08:35:06Z (date -u). It is worded for Part A alone; no approval of ADV-2026-11-27-45 is filed.
2. **ADR-037's amendment** (its item 1): appended after the ADR's last line, in the ruling's first fence byte for byte, with `<n>` 1 and `<date>` the date of the commit that lands it. Nothing above its heading is edited; the Status line and the row in `docs/README.md` are not edited, and if `verify:adr-index` asks for a change there, it goes to the advisor first.
3. **The KNOWN-LIMITATIONS item and its comment** (its items 3 and 4): the second and third fences, byte for byte, at the file's end in the file's form for an item; `NN` the next unused number over the base and every unmerged branch (rule (00a)); `<path>` the ruling's filed path above. The worker's source 1 is not carried (RD-2).
4. **U-7, class 9 on §4 and §10** (its item 7): one more unit test in `webview_chrome.rs`'s tests, on Windows, named in U-1 to U-6's scheme. It builds `Live` from two closures over a value of its own, with no WebView2, calls `apply` with `chrome_for(false)`, and asserts that `readback_line` gives exactly the line its item 7 names and that the menu setter got false. **Declared here, before the test is written, as the exception to §4's heading rule:** U-7 is not red before its code, because its code is already there; its evidence is its mutation alone. **M-U7:** `Live::accelerator_keys` returns `Ok(true)` (the reviewer's probe); applied, run, recorded by name with its commit, and reverted, at the correction's head, and U-7 fails under it at its own assertion. If U-7 carries a cfg form that names `windows`, the cfg-boundary numbers change in the same commit (Amendment 8 item 3). It runs in Product CI (shell). If Part B is built, its tests replace U-7 under the form.
5. **D-3, applied:** §10's caller-rule sentence is read with D-3's New, byte for byte as the architect's read part gives it (`state/consults/gates/2026-11-28-reload-asking-first-or-off-in-the-installed-build-build-gate-architect-read-part.md`, its §7, D-3), in place of D7's New (Amendment 6 item 2).
6. **The correction's lines are class 8, recorded here before its code:** U-7; ADR-037's amendment; the KNOWN-LIMITATIONS item and its comment; C-1, D-1, D-2 and RC-1; the cfg-boundary numbers if they move. Its worker reports the count by §7's Counting command at the correction's head, and the closing amendment records it. §7 is not edited.
7. **Taken as the gates give them** (its item 8): C-1, D-1 and D-2 (the architect's words) and RC-1 (the reviewer's), applied by the worker with no re-gate (AUTONOMY §31 (d)); no two gates give different words for one place. RD-1 is for the closing amendment.
8. **The order** (its item 9): this amendment; then one correction carrying items 2 to 4, 6 and 7; then the push runs read at the new head; then the run parts with E-1's series at the port. The run part checks every clause of the amendment and of the item against the code at the correction's head and the crate sources (its item 6); a clause that does not hold goes to the advisor. If the human's word on ADV-2026-11-27-45 comes before the merge, the texts go back to the advisor before a word changes (its item 10).

Read the last amendment first.
