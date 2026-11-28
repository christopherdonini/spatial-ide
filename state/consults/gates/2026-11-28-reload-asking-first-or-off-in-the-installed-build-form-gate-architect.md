# The reload keys in the installed build: the architect's form gate (node:reload-asking-first-or-off-in-the-installed-build@form-gate-architect): FAIL

*Filed by the custodian. The architect (Opus) read D:/wt/read-1128a at 9fca8614d175538384bd553a0e7b1b1d6a850f8a, D:/wt/reload at 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 and the registry sources its report names, read only, and wrote no file. By the facts script its records run from 2026-11-28T01:05:29Z to 2026-11-28T01:16:28Z, with no call in the main checkout. By its completion notice it took 659656 ms and 69 tool uses. Its hand-back is below as received, with the harness indent removed: 23120 bytes, sha256 d952ee837e0953447413d0cda35547aa872df2ca84448df514cd0a57324c9c87.*

---

FAIL. The form was read on main @ 9fca8614d175538384bd553a0e7b1b1d6a850f8a, and the code on cut/reload-ends-the-old-pages-opens @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645. The fail rests on Evidence (two mutations that cannot compile, and E-1's read path) and on one Correctness finding (an untrue statement of fact in F-5). None of these is the human's wording. The exact words for each are in the findings below. They go in by an appended amendment, since the form is append-only, with no re-gate (AUTONOMY §31). The PR body lists them.

Nothing below is a quotation unless it is marked verbatim. The Old strings are byte-copied from the form. Everything else is paraphrase.

## Check 1. Statements of fact against their tags

True as stated, each span read:
- **F-1:** wry lib.rs:1687-1688, webview2/mod.rs:571 and :582-586.
- **F-2:** greps of tauri-2.11.5/src and tauri-runtime-wry-2.11.4/src for the two builder calls, and of tauri-utils-2.9.3/src/config.rs for accelerator|context_menu|contextMenu, each found 0.
- **F-3:** tauri.conf.json:14-20. The window carries no label key, so its label is the default `main`, which matches capabilities/default.json:5.
- **F-4:** a case-insensitive search for contextmenu|beforeunload in frontends/shell/src finds 0. StudioLayout.tsx:279-304 checks out.
- **F-5:** with_webview at webview_window.rs:2369-2376 and webview/mod.rs:1666-1677 is gated on `wry`. Cargo.toml:84-91 has `wry` in default. The shell's Cargo.toml:58 keeps the defaults. PlatformWebview::controller is at mod.rs:149-151 and :177-184.
- **F-6:** every bindings.rs line number is right.
- **F-7:** tauri lib.rs:179-184 re-exports only on Android. wry lib.rs:377-415 holds no webview2_com re-export. The Cargo.lock lines 5586-5597, 5615-5619, 5690-5691 and 5703-5704 check out.
- **F-8:** the three sub-line spans match byte for byte, at :1713, :1716 and :1723.
- **F-9:** e2e page.reload at pan-anchor:64, project:414 and recentre-crossing:84. No F5, Ctrl+R or right-click appears in e2e.
- **Other cites:** ADR-037 :10, :130, :144, :164-182, :174, :175 and :178. lib.rs 270-341, 391-392, 533-536, 589-607, 607-612 and 616-639. B's form :58, :59, :60, :75, :322, :505, §6 and §7's Counting bullet. PLAN.yaml:7985.
- **§10's docs search:** on main it finds only ADR-035:133.
- **§2 item 2's window claim:** the comment at lib.rs:577-584 is confirmed at tauri app.rs:2524-2531. Windows with `create` true are built before the user's setup closure runs.

Not true, or not true as worded:
- **F-5, last bullet (form :53).** At the form's own call site the closure is not run through the event loop. setup() runs on the main thread (app.rs:1422-1426, and the context's main_thread_id is taken at tauri-runtime-wry lib.rs:2920). On that thread, `send_user_message` handles the message at once instead of posting it (tauri-runtime-wry lib.rs:239-248). So:
  - the closure runs inside the `with_webview` call, before setup() returns (:3993, :4030-4036);
  - `with_webview` returns Ok;
  - if the runtime holds no such webview, the closure is dropped with no error (:3745-3751, no else arm through :4056).
- **Consequences of that for the form:**
  - §5's second invalidator is mis-framed;
  - the `not-applied` line on Err cannot be reached from setup();
  - in the dropped case §1's "one line" claim does not hold, because no line is written. Ordinary use does not reach that case.
- **§3 (form :175).** `newestSessionLog` (source-watch-idle.mjs:131-155) picks the newest file by mtime with no launch filter. It returns only the last 40 lines and the lines its own source-watch pattern matches, and neither carries a `webview-chrome` line. "Since that launch" is untrue of the cited function, and E-1 cannot read its line through the function as it stands.
- **F-7 (form :65).** `webview2-com` also re-exports its own modules' items (lib.rs:18-20). Only "of other crates, Microsoft only" holds. This does not change the conclusion.
- **§2 item 2 (form :164).** No clone before :533 is needed. `main_window_config` (bound at :418) is never moved; :454 clones its label. The clone the form describes would also sit outside the region §0 item 4 states.
- **F-6 / F-7 together.** Both getters take an out-parameter `*mut windows_core::BOOL` (bindings.rs:35005, :35675), which F-6 does not state. Part A's "no type named" claim depends on that out-parameter's type being inferred. It is plausible but not compiled. §5's first invalidator covers it.
- **Not verified by me:** Amendment 1 item 6's count of 52 branches (that needs git), and the item 10 hashes, which are the reviewer's.

## Check 2. The constitution

- **docs/01, never block the canvas:** kept. The closure makes a few synchronous COM property calls on the main thread inside setup(), with no wait and no pump.
- **Plain text:** kept. No new config format.
- **ADR-006:** no class. The piece writes no project file and records no step. It is not an external side effect: it writes only the host's session-log line, ADR-037's own precedent. No undo claim is made.
- **ADR-037:** kept. §6 holds because `get_webview_window` creates no webview. §7 holds: nothing crosses the wire. The ADR-020 closure is untouched. The Consequence that a cancelled publish is not shown stays true (ruling item 4).
- **docs/02:** the code sits correctly in the frontends module (frontends/shell/src-tauri). Configuring the shell's own webview chrome is client behaviour, not data logic.
- **The ADR-037 amendment (ruling item 3).** The form's description of its matter is not complete: §2 item 4 says only "records the decision". The full list is in finding A2.

## Check 3. Parts A and B

- §1 Declared unchanged, §2 item 5, §9 item 4 and Amendment 1 items 2-3 keep every Cargo.toml and Cargo.lock byte, and Part B's code, behind the human's typed approval of ADV-2026-11-27-45. That holds.
- Part A is buildable without Part B, on two conditions:
  1. The product impl must not name the settings type (finding A1). An impl whose Self is `ICoreWebView2Settings` needs `webview2-com` as a direct dependency.
  2. The getters' BOOL out-parameter must be inferred.
- Neither is compiled. §5's first invalidator stops the piece if either fails.

## Check 4. The development build

Yes. `chrome_for(cfg!(debug_assertions))` is the only test of a development build. The form does not use `tauri::is_dev()` and does not use the measure-build feature for it. E-1 runs under `tauri dev`, a debug build. OPEN-4 / Amendment 1 item 5 match ruling item 5.

## Check 5. The two session-log lines

- **The read-back line:** form :160 matches ruling item 7 byte for byte. It states no consequence.
- **The not-applied line:** Amendment 1 item 6 gives it as ruled, with no error text.
- **Gaps:**
  - The form does not say which line is written when `get_webview_window` finds no window, or when `CoreWebView2()` or `Settings()` fails inside the closure.
  - It does not name either line's level.
- **E-1:** the step is placed in source-watch-idle.mjs, as Amendment 1 item 6 says. As specified it cannot read its line (check 1). It also does not require `launched: true`, which "since launch" needs; the file itself warns at :299-303. It inherits the suite's early return when the 100k fixture is missing (:271-276).

## Check 6. Seams, tests, mutations, Block on sight

- **Seams:** read at their real shapes. `with_webview` at :2371 takes `FnOnce(PlatformWebview) + Send + 'static`. `controller()` is at :180-184. The F-6 methods are `pub unsafe fn`, and the getters take `*mut BOOL`.
- **M-U1 and M-U2:** each compiles and fails its test at an assertion.
- **M-U3:** as written ("`?` on the first setter") this is a compile error, E0277, because `apply` returns `Readback`, not a Result.
- **M-U4:** with `readback_line(&Readback)` holding no `Chrome`, building the line "from Chrome" needs a signature change, so it fails at compile. U-4 also has to go through `apply`, or an apply-level mutation would not touch it.
- **M-E1:** compiles; there are only dead-code warnings, and the crate has no `deny`. It makes E-1 red at an assertion.
- **Block on sight:** nothing bounds what else the closure may call on the full ICoreWebView2 (finding D5).

## Check 7. The class

Full form and both gates is right (ruling item 10). No matter here is the human's beyond ADV-2026-11-27-45, `release/v0.2` (the ruling's item 10) and posture under ADV-2026-11-26-18 item 6 (not engaged; check 8).

ADV-2026-11-27-45's dependency matter has a part its draft does not state. A direct `webview2-com` 0.38 ties the shell to tauri's own webview2-com version: tauri's doc comment at webview/mod.rs:1612-1613 warns that it can move in a tauri minor release. If it moves, the shell either stops compiling on a type mismatch or the lock holds two versions. Either way the next tauri update needs the human again. This is for the custodian to put in the human's digest. I propose no words for the draft.

## Check 8. The named posture check (ADV-2026-11-26-18 item 3)

**Part A does not change the security posture.**
- **Network access:** no network call is planned.
- **Listening socket:** none is added. The measure-build CDP block at lib.rs:589-607 is declared unchanged, and the piece sits after it.
- **How the data plane admits a consumer:** unchanged. `DataPlaneConfig` and `PinnedOrigin` (:488-503, :533-536) are neither written nor re-derived. Finding D3's words also remove the planned edit near :533.
- **Files under capabilities/:** declared unchanged (default.json:1-11). No command is added, so ADR-027 decision 4 is not engaged, and `tauri.conf.json` is unchanged.
- **Dependencies:** none (§9 item 4).
- **What it does change:** the installed webview offers fewer browser features. That narrows what it offers and adds no way in.
- **What I cannot rule out from the sources:** what the WebView2 runtime's menu and keys actually do (F-8). Switching them off can only remove routes.
- **What the build gate must confirm:** that the closure calls nothing beyond F-6's methods (finding D5).

**Part B changes dependencies only:** two direct dependencies, which are the human's under ADV-2026-11-27-45.
- **No new crate:** by the lock read, both crates are already in the graph.
- **No new feature:** webview2-com-0.38.2/Cargo.toml:68-69 already takes windows-core 0.61 with its default features (`std`, windows-core-0.61.2/Cargo.toml:34-35). So a shell line with default features adds none. That holds only if the shell's two lines take default features, and it is not compiled. The reviewer's lockfile read under ADV-2026-11-27-45 condition 3 is the proof.
- **The rest:** no other change to network, sockets, admission or capabilities.

**None of the five subjects is changed by Part A. Part B changes only the dependency subject, and that is with the human.**

## Findings

**C1 (Correctness): the untrue F-5 statement.**
- Old: `- The closure is sent to the event loop as a message (`tauri-runtime-wry-2.11.4/src/lib.rs:1618-1627`) and run where that message is handled (`:3993`).`
- New: `- The closure is wrapped in a message (`tauri-runtime-wry-2.11.4/src/lib.rs:1618-1627`). Called on the main thread, as `setup()` is (`tauri-2.11.5/src/app.rs:1422-1426`), `send_user_message` handles it at once instead of posting it (`tauri-runtime-wry-2.11.4/src/lib.rs:239-248`): the closure runs inside the `with_webview` call (`:3993`, `:4030-4036`), before `setup()` returns, and `with_webview` returns `Ok`. If the runtime holds no such webview, the message is dropped with no error and the closure does not run (`:3745-3751`).`
- Clause check:
  - the wrap is at :1618-1627;
  - Ready calls setup at app.rs:1424, on the event-loop thread, and main_thread_id is set at :2920;
  - the direct handling and the Ok return are at :239-248;
  - the closure runs at :4030-4036;
  - the drop is the if-let at :3751, with no else through :4056.
- Follow-on, same class:
  - Old: `` `with_webview`'s closure never runs before the suite's bound. ``
  - New: `` `with_webview`'s closure does not run (C1's dropped case): E-1 then finds no line. ``

**E1 (Evidence): M-U3 fails at compile.**
- Old: ``M-U3: `?` on the first setter``
- New: ``M-U3: `apply` returns at once when the menu setter returns `Err`, before the key setter is called, with both fields `unread` ``
- Clause check: this compiles under `-> Readback`, and it fails U-3's assertion that the key setter is still called.

**E2 (Evidence): M-U4 fails at compile, and U-4 does not go through `apply`.**
- Old: ``| U-4 `the_line_states_the_values_read_back_not_the_decision` | the fake reads back values that differ from the decision, and the line carries the read-back values | M-U4: the line is built from `Chrome`, not from `Readback` |``
- New: ``| U-4 `the_line_states_the_values_read_back_not_the_decision` | `apply` runs over a fake whose getters return values that differ from the decision, and `readback_line` of what `apply` returns carries the getters' values | M-U4: `apply` fills the `Readback` from `chrome`, not from the getters |``
- Clause check: the signatures are unchanged, so it compiles, and it fails U-4 at an assertion.

**E3 (Evidence): E-1's read path.**
- Old: ``- E-1 uses the suite's own launch and resolves the newest session log since that launch, as `source-watch-idle.mjs` already does ([R] `frontends/shell/e2e/source-watch-idle.mjs:131-153`).``
- New: ``- E-1 uses the suite's own launch and asserts `launched: true`. It reads the newest `session-*.log` in the folder `newestSessionLog` resolves ([R] `frontends/shell/e2e/source-watch-idle.mjs:131-153`), by a function of its own that returns every line holding `webview-chrome`, because that helper has no launch filter and returns only the last 40 lines and its own pattern's matches. The step runs straight after the mount-readiness gate, before W1. It inherits the suite's early return when the 100k fixture is missing.``
- Clause check:
  - the mtime sort is at :137-140;
  - the return fields are at :145-151;
  - the launched warning is at :299-303;
  - the mount gate is at :323;
  - the fixture return is at :271-276;
  - one log file per open: state.rs:47.
- Second change, same class:
  - Old: `E-1 red at the base (there is no line) and green at the head`
  - New: `E-1, the head's suite file run against the base's build, red (there is no line), and green at the head`
  - Reason: at the base the suite has no E-1 step.

**A1 (Architecture, must fix before Part A's build): the product impl would name the settings type.**
- Old: `It has one product impl over the WebView2 settings (F-6) and one test fake.`
- New: `It has one product impl and one test fake. The product impl is a private struct whose fields are closures built inside the `with_webview` closure, where the WebView2 settings' type is inferred, so Part A names no type of `webview2-com` (F-7). An impl whose `Self` is the WebView2 settings type would name it, and so needs §0 item 3.`
- Clause check: an impl header names its Self type, and by F-7 that type is reachable only through a direct dependency. Greps of tauri and tauri-runtime-wry for a webview2_com re-export found 0.

**A2 (Architecture): the ADR-037 amendment's matter is incomplete.**
- Old: `4. **Under OPEN-2 only:** an appended amendment to ADR-037, drafted by the architect, its words ruled by the advisor.`
- New: `4. **Under OPEN-2 (ruled yes, Amendment 1 item 4):** an appended amendment to ADR-037, drafted by the architect, its words ruled by the advisor. Its matter: the first not-decided bullet decided, options (iii) and (iv) through `with_webview` because tauri 2.11.5 exposes neither a builder call nor a config key, and options (i) and (ii) not taken; Part B's dependency line the human's, and the state if they decline; a development build is one with `debug_assertions` alone, so the measure build behaves as installed; the two session-log lines; the costs, each with its source; that the installed behaviour is read from the source and owed to the human's press; that §3's end still stands, as the bullet's last sentence says; that "Nothing asks first" and the cancelled-publish Consequence stay true; that the piece is client configuration of the shell's own webview, not a docs/02 exception; and that Part B ties the shell's `webview2-com` version to tauri's (`tauri-2.11.5/src/webview/mod.rs:1612-1613`).`
- Clause check: ADR-037 :182, :130, :144, :175, :179; ruling items 2, 4, 5 and 7; mod.rs:1612-1613.

**D1 (Documentation): KNOWN-LIMITATIONS.md is not in §7's Scope.** Amendment 1 item 7 brings a KNOWN-LIMITATIONS.md item with the piece, but §7's Scope does not list that file, and it would be a ninth file against the cap of 8. Before that item's text lands, a class-9 amendment must declare it in Scope and raise the file ceiling to 9. §7's own line is not edited.

**D2 (Documentation): the claims must carry the Part B condition, and the line claim is incomplete.**
- First change:
  - Old: ``- In a build with `debug_assertions`, it sets both to true, WebView2's default (F-1).``
  - New: ``- In a build with `debug_assertions`, it sets `AreDefaultContextMenusEnabled` to true (Part A) and, under §0 item 3, `AreBrowserAcceleratorKeysEnabled` to true (Part B), WebView2's default (F-1).``
- Second change:
  - Old: `- One session-log line states the values read back after setting, or that they could not be read.`
  - New: `- One session-log line from `setup()`: the read-back line, with `unread` for each value not read (a failed `CoreWebView2` or `Settings` call reads both `unread`), or `webview-chrome not-applied` when no main window is found or `with_webview` returns `Err`. Not covered, and named in the source comment: the case where the runtime holds no such webview and drops the closure, so no line is written (C1). Ordinary use does not reach it.`
  - Using `not-applied` for the no-window case goes beyond what ruling item 7 names (that line is for a failed `with_webview`), so the advisor confirms it.
- Third change:
  - Old: ``U-1 `the_installed_build_turns_both_off_and_a_dev_build_keeps_both` ``
  - New: ``U-1 `chrome_for_decides_both_off_without_debug_assertions_and_both_on_with_them` ``
  - Reason: under Part A alone the installed build does not turn the keys off.

**D3 (Documentation): the region.**
- Old: ``get_webview_window` for the main window's label, cloned before it moves into `PinnedOrigin` (`:533-536`).``
- New: ``get_webview_window` for `main_window_config.label`, still in scope there (bound at `:418`, never moved; `:454` clones it), so no line outside this region changes.``
- These [R] cites are pinned as Amendment 1 item 10 does.

**D4 (Documentation): the pins at B's head.**
- Amendment 1 item 10 pins every [R] cite by hash at 5ce0525a, a branch commit. Round 15 (e) requires a hash reference in an append-only record to sit at a commit on main.
- project.mjs:414 is test text that exists only on B (main has no reload at :414). The round-25 item 2 rule fails by name a test-text span on an unmerged branch pinned by hash at a branch commit.
- The form's own §9 item 9 names "a hash at a branch commit".
- ADV-2026-11-27-44 item 11 ordered these pins. That conflict is a ruling-level matter for the advisor or the human, so I propose no words.
- pan-anchor:64, recentre-crossing:84 and source-watch-idle:131-153 have the same text at the same lines on main, so they could be pinned at 9fca8614.

**D5 (Documentation): bound what the closure may call.**
- Old: ``5. An `unwrap`, `expect`, indexing or `eprintln!` on the apply path, or `setup()` failing on a failed `with_webview`.``
- New: ``5. An `unwrap`, `expect`, indexing or `eprintln!` on the apply path, or `setup()` failing on a failed `with_webview`. Any WebView2 call in the closure other than `controller()`, `CoreWebView2`, `Settings`, F-6's setters and getters and Part B's `cast`, or an `unsafe` block around anything else.``
- Clause check: F-6's methods are `pub unsafe fn` (bindings.rs:35003, :35015, :35673, :35685).

**D6 (Documentation): smaller wording fixes.**
- F-7's "only":
  - Old: ``- `webview2-com` re-exports the `Microsoft` namespace only (`webview2-com-0.38.2/src/lib.rs:2`).``
  - New: ``- Of other crates, `webview2-com` re-exports only `webview2-com-sys`'s `Microsoft` namespace (`webview2-com-0.38.2/src/lib.rs:2`). Its other re-exports are its own modules' items (`:18-20`), and none is `windows_core`.``
- §2 item 5 should say that the two dependency lines take default features. Check 8's no-new-feature reading rests on that.

## Files read

All are read only.
- **D:/wt/read-1128a (main):**
  - governance/forms/frontends/RELOAD-ASKING-FIRST-OR-OFF-IN-THE-INSTALLED-BUILD-PREREGISTRATION.md
  - state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-44-the-reload-keys-form-open-1-to-open-9-the-form-files-now-with-the-custodians-amendment-1-the-humans-line-a-draft-of-its-own.md
  - state/consults/2026-11-27-advisor-draft-adv-2026-11-27-45-for-the-humans-approval-two-direct-dependencies-in-the-shells-cargo-toml-for-the-reload-keys-part-b-not-the-humans-words.md
  - state/directives/2026-11-26-advisor-ruling-adv-2026-11-26-18-the-started-arm-goes-into-adr-020s-closure-under-conditions-the-piece-shows-adr-020-unchanged-not-held-for-the-human.md
  - docs/README.md
  - docs/01_Principles.md
  - docs/02_Architecture.md (grep)
  - docs/09_Security_and_Privacy.md
  - docs/adr/ADR-006-lineage-undo-side-effects.md
  - docs/adr/ADR-001-frontend-stack.md (grep)
  - docs/ (grep)
  - governance/PLAN.yaml:7970-7994
  - governance/forms/frontends/RELOAD-ENDS-THE-OLD-PAGES-OPENS-PREREGISTRATION.md (:50-79, :500-509, grep)
  - frontends/shell/e2e (grep)
  - frontends/shell/e2e/source-watch-idle.mjs:129-155
  - KNOWN-LIMITATIONS.md (glob only)
- **D:/wt/reload @ 5ce0525a:**
  - docs/adr/ADR-037-main-window-page-lifecycle-and-kernel-held-opens.md
  - frontends/shell/src-tauri/src/lib.rs:1-60, :180-649
  - frontends/shell/src-tauri/src/state.rs:25-99
  - frontends/shell/src-tauri/tauri.conf.json
  - frontends/shell/src-tauri/capabilities/default.json
  - frontends/shell/src-tauri/Cargo.toml
  - frontends/shell/src-tauri/Cargo.lock:5580-5714
  - frontends/shell/src/layout/StudioLayout.tsx:270-309
  - frontends/shell/e2e/source-watch-idle.mjs
  - greps of frontends/shell/src, frontends/shell/e2e and src-tauri/src
- **<profile>/.cargo/registry/src/index.crates.io-1949cf8c6b5b557f/:**
  - wry-0.55.1/src/lib.rs:360-424, :1660-1749
  - wry-0.55.1/src/webview2/mod.rs:540-599
  - tauri-2.11.5/src/lib.rs:160-209
  - tauri-2.11.5/src/webview/mod.rs:130-199, :1600-1684
  - tauri-2.11.5/src/webview/webview_window.rs:2320-2384
  - tauri-2.11.5/src/app.rs:1419-1481 (grep), :2500-2544
  - tauri-2.11.5/Cargo.toml (grep)
  - tauri-2.11.5/src (grep)
  - tauri-runtime-wry-2.11.4/src/lib.rs:235-265, :1560-1639, :2919-2923, :3679-3779, :3960-4056, :4126-4138
  - tauri-utils-2.9.3/src/config.rs (grep)
  - webview2-com-0.38.2/src/lib.rs
  - webview2-com-0.38.2/Cargo.toml
  - webview2-com-sys-0.38.2/src/bindings.rs:1010-1034, :8910-8929, :9170-9184, :34880-35029, :35640-35699
  - windows-core-0.61.2/Cargo.toml (grep)
