# The reload keys' form (node reload-asking-first-or-off-in-the-installed-build): the architect's draft

*Filed by the custodian, 2026-11-27, under `state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-37-the-recovery-offers-base-c1-with-b-merged-in-its-recover-open-counted-adr-037-amendment-1-the-posture-check-the-places.md`, items 5 and 6 (d). The architect (Opus) was dispatched with its brief byte for byte (brief-reload-keys-architect, pasted whole into its dispatch), read only. By the facts script, its run went from 2026-11-27T22:37:56Z to 2026-11-27T22:47:43Z; by its completion notice, 71 tool uses. It wrote no file. Its hand-back is below as received, with the harness indent removed. Nothing is committed at the form's path; its §0 item 3 and its OPEN items go to the advisor. Not a gate.*

---

REPORT PATH: state/drafts/2026-11-27-reload-asking-first-or-off-in-the-installed-build-form-architect-draft.md

What I read: [R] `cut/reload-ends-the-old-pages-opens` @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 (the commit is from `.git/refs/heads/cut/reload-ends-the-old-pages-opens`; I did not check the worktree for uncommitted changes). [M] the main checkout at ba5e7397, the HEAD in the session snapshot, plus the staged, uncommitted ADV-2026-11-27-37 directive, read as it is. [crate] means the registry sources at the versions [R] `frontends/shell/src-tauri/Cargo.lock` pins: tauri 2.11.5 (:4476-4477), tauri-runtime-wry 2.11.4 (:4694-4695), wry 0.55.1 (:6114-6115), webview2-com and webview2-com-sys 0.38.2 (:5586-5619), windows-core 0.61.2 (:5690-5691). This is a draft only. It carries no verdict and does not gate the form. Nothing was run. Every passage below is my paraphrase unless it is marked verbatim.

Note for the custodian before you commit this on main: the [R] line cites point into files that differ on main, and verify-cites gates rooted cites in `governance/forms/`. Check them first, as the reload form's own cites into lib.rs were checked.

---

# Asking first, or switching the reload off, in the installed build (PLAN node `reload-asking-first-or-off-in-the-installed-build`): preregistration, full form

**Path proposed:** `governance/forms/frontends/RELOAD-ASKING-FIRST-OR-OFF-IN-THE-INSTALLED-BUILD-PREREGISTRATION.md`.

**Authority** (rulings by id and item):
- ADV-2026-11-27-37 items 5 and 6 (d);
- ADV-2026-11-26-13 item 4 (the proposal, and the line between the advisor's and the human's);
- ADV-2026-11-26-17 item 3 (why a read counts);
- ADV-2026-11-16-06 item 2, which alone sets the class until v0.2 is tagged (ADV-2026-11-23-01 item 3);
- ADV-2026-11-26-18 items 3, 4 and 6 (the posture check, as OPEN-5 proposes).
- The design gap is ADR-037's "What this ADR does not decide", first bullet ([R] `docs/adr/ADR-037-main-window-page-lifecycle-and-kernel-held-opens.md:164-182`).

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
  - This piece's region is `setup()` after the `measure-build` block and before `Box::leak` ([R] `frontends/shell/src-tauri/src/lib.rs:607-612`), plus one `mod` line.
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

---

Files read (all read only): [M] `C:/dev/spatial-ide/governance/PLAN.yaml`, `C:/dev/spatial-ide/governance/forms/frontends/RELOAD-ENDS-THE-OLD-PAGES-OPENS-PREREGISTRATION.md`, and the five directive files of ADV-2026-11-27-37, -11-26-13, -11-26-17, -11-26-18 and -11-16-06 under `C:/dev/spatial-ide/state/directives/`; [R] `D:/wt/reload/docs/adr/ADR-037-main-window-page-lifecycle-and-kernel-held-opens.md`, `D:/wt/reload/frontends/shell/src-tauri/{src/lib.rs,Cargo.toml,Cargo.lock,tauri.conf.json,capabilities/default.json}`, `D:/wt/reload/frontends/shell/src/layout/StudioLayout.tsx`, and `D:/wt/reload/frontends/shell/e2e/source-watch-idle.mjs`; [crate] under `D:/caches/cargo-registry/src/index.crates.io-1949cf8c6b5b557f/`.
