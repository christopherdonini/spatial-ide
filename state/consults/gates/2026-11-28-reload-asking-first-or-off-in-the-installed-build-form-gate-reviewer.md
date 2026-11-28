# The reload keys in the installed build: the reviewer's form gate on the form with Amendments 1 to 3 (node:reload-asking-first-or-off-in-the-installed-build@form-gate-reviewer): FAIL

*Filed by the custodian. The reviewer (Opus) read the form at main 51f5e1daf1c05dc39e0d3ac94e49657f83bbe47f in D:/wt/read-1128a and the code at B's head 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 in D:/wt/reload, read only; it built nothing and wrote no file. By the facts script its records run from 2026-11-28T02:19:37Z to 2026-11-28T02:30:14Z, and 38 of its calls ran with the main checkout as its working folder, the shell's start folder. By its completion notice it took 637009 ms and 43 tool uses. Its hand-back is below as received, with the harness indent removed: 18562 bytes, sha256 9fe21cd14b4527eef3e17340f0c86a632276ad6634f7b41f125aab997a6530c5.*

---

FAIL. cut/reload-ends-the-old-pages-opens @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 (the code, read in D:/wt/reload). The form was read on main @ 51f5e1daf1c05dc39e0d3ac94e49657f83bbe47f (D:/wt/read-1128a). I read the pins at 01bb2de868f0835efcfb5e9bc6622dd9f73638a1. For the branches I used D:/wt/reload's existing remote refs, where origin/main is ff4f2f3755106433a6c0366751912ec2ff1fd4dd. I did not fetch.

The verdict fails on two Evidence findings, EV-1 and EV-2. Neither is the human's wording or ruled text. Each correction changes the form only, by an appended amendment. Except where marked as a quote, everything here is paraphrase.

## Check 1. Statements of fact at 5ce0525a and on main

Each statement below was checked by a sed, grep or git read and is true:
- **F-3:** tauri.conf.json:14-20 holds one window with no label key and no menu or keys setting. capabilities/default.json:5 names "main".
- **F-4:** a case-insensitive grep of frontends/shell/src for contextmenu and beforeunload finds 0. The window's one addEventListener("keydown") is StudioLayout.tsx:302. A grep for F5, KeyR and key==="r" in the non-test sources finds 0.
- **F-5:** Cargo.toml:58 is `tauri = { version = "2", features = [] }`, so the default features are kept.
- **F-7:** Cargo.lock 5586-5597 is webview2-com 0.38.2. 5615-5619 depends on windows-core 0.61.2. 5690-5691 is windows-core 0.61.2, and 5703-5704 is 0.62.2.
- **F-9:** page.reload is at pan-anchor.mjs:64, project.mjs:414 and recentre-crossing.mjs:84. No e2e file presses F5 or Ctrl+R or right-clicks.
- **lib.rs regions:**
  - :270-341 is the whole on_page_load closure.
  - :391-392 is the log-dir resolution.
  - :533-536 is PinnedOrigin.
  - :577-584 is the create-before-setup comment.
  - :589-607 is the measure-build block, and :612 is Box::leak.
  - :616-639 is the handler list.
- **D3's words:** main_window_config is bound at :418, :454 clones its label, and it is not used after that.
- **ADR-037 at B:** :10, :130, :144, :164-182, :174, :175 and :178 say what the form says.
- **[M] cites:** PLAN.yaml:7985 is the depends_on line. B's form :58, :59, :60, :75, :322 and :505 each say what is cited. Its Counting bullet is :390.
- **§10's docs search:** it finds only ADR-035:133.
- **Amendment 1 item 1:** ADR-037 is absent at 01bb2de8, and lib.rs has 610 lines on main.
- **Amendment 1 item 6:** 8b7f4eee is on main. At ff4f2f37, none of the 53 unmerged branches changes source-watch-idle.mjs.
- **Amendment 3 item 4:** `git merge-base --is-ancestor 5ce0525a 01bb2de8` returns 1, so 5ce0525a is not an ancestor of main.
- **C1 (Amendment 2), read in the registry sources:**
  - setup() runs in the Ready arm (tauri-2.11.5 app.rs:1423-1424). main_thread_id is taken in init (tauri-runtime-wry lib.rs:2920).
  - On that thread, send_user_message handles the message at once and returns Ok (:239-248).
  - The drop is the if-let at :3751.

Not true:
- **§2 item 3 and §7 Scope** speak of "that suite's `e2e/README.md` entry" and "(its entry only)". At 5ce0525a and on origin/main, frontends/shell/e2e/README.md has no entry for source-watch-idle.mjs: `git grep -c source-watch-idle 5ce0525a -- frontends/shell/e2e/README.md` returns rc 1, and its headings name no such suite. See DOC-1.

## Check 2. The two session-log lines (Amendment 3 item 2), case by case

| Case | Reachable at 5ce0525a | Test or mutation in §4 as amended |
|---|---|---|
| Settings reached | Yes: tauri creates the window before setup(), or the measure-build block :589-607 does, before :612 | U-4 with M-U4 (E2's words); E-1 with M-E1 |
| A value's read failed (`unread`) | Yes: the getters return windows_core::Result (bindings.rs:35003-35014) | **Neither** |
| No main window | Only with a window set `create: false` outside the measure build; not by ordinary use | **Neither** |
| with_webview returns Err | Cannot run when called from setup(): on the main thread send_user_message returns Ok (:239-248), as C1 says | **Neither**; it cannot be tested |
| A CoreWebView2 or Settings call fails | Yes in code (both return Result); not by ordinary use | **Neither** |
| The closure is dropped | Ruled to write no line and to be named in the source comment | Neither, by the ruling; the build's architect gate reads it |

The `info` and `error` levels are tested nowhere. The bytes `webview-chrome not-applied` are asserted by no test. See EV-2.

## Check 3. The pins

I ran my own node script, which:
- parsed the 28 pins of Amendment 1 item 10 and the 11 of Amendment 3 (i) from the form;
- hashed lines a..b with LF ends from `git cat-file -p` of each blob;
- compared blobs at 01bb2de8 with those at 5ce0525a.

Results:
- All 28 hashes reproduce at 5ce0525a. For the control, I appended one space to each span's first line, and the hash differed in all 28 cases.
- 11 pins are in a file whose blob is the same at 01bb2de8 as at 5ce0525a. Each is re-pinned in Amendment 3 (i) at 01bb2de8, with the same hash, and the hash recomputed at 01bb2de8 matches.
- Those 11 blobs are also unchanged at origin/main ff4f2f37, so pin and tree agree. The pin at 01bb2de8 governs.
- The other 17 are in files whose blob differs (7 in ADR-037, 9 in lib.rs, and project.mjs:414). That is exactly Amendment 3 (ii)'s list, and none of their hashes reproduces at 01bb2de8.
- No CR is in any blob.

## Check 4. Scope and ceilings

- **Files.** The Scope is webview_chrome.rs, lib.rs, source-watch-idle.mjs, e2e/README.md, ADR-037, docs/README.md (if needed), Cargo.toml and Cargo.lock, which is 8. With KNOWN-LIMITATIONS.md (Amendment 3 item 3) it is 9.
- **Counting.** B's §7 Counting command (B's form :390) leaves out only the form, PLAN.yaml, CUSTODIAN-QUEUE.*, site/** and state/**. So KNOWN-LIMITATIONS.md and the ADR are counted, and 9 is consistent.
- **Lines.** The §7 estimates add up to 274 against the 330 ceiling. They give nothing for:
  - the KNOWN-LIMITATIONS item (recent items are about 4 lines);
  - E3's new reader function;
  - a new README entry (DOC-1);
  - EV-2's two tests.
- The ceiling still holds on paper, and an overrun is class 8 at the count by Amendment 3 item 3. This is not a finding.

## Check 5. Shared paths (`git diff --name-only origin/main...<branch>`, 53 unmerged branches)

- **lib.rs.** Shared with B, which is the base, and with the recovery offer at 97e2156d. The recovery offer's share comes only through B: `git diff --name-only 5ce0525a...origin/cut/b2-piece-1c-step-3-recovery-offer` lists no shell lib.rs, although its form plans the handler change. The form names it in §0 item 4, §8 and Amendment 1 item 9, and meets it by the order and a merge commit with the reviewer's narrow read.
- **ADR-037.** Shared the same way (B, and the recovery offer through B). The form names it in §8 and Amendment 1 item 4, and meets it by turns and renumbering.
- **docs/README.md.** Shared with B and the recovery offer (through B). The form does not name the share; the file is conditional.
- **KNOWN-LIMITATIONS.md.** Shared with 13 branches: a-second-save-is-announced, b2-piece-1c-step-3-recovery-offer, colour-by-refill-keeps-the-view, identity-declaration-route-for-session-tier, identity-scan-refuses-a-null-by-name, partitioned-ordinal-refusal-opens-the-identity-form, relink-after-refusal, shell-migration-milestone-5-pr-a, shell-migration-milestone-5-pr-b, shell-scale-display, text-id-opens-for-the-session-by-row-position, text-id-reopen-with-a-recorded-declaration and untiled-reissue-mint-window. Amendment 3 item 3 meets it with the item number taken by script. §8 does not name it.
- **frontends/shell/e2e/README.md.** Shared with 13 branches other than B: the KNOWN-LIMITATIONS list without untiled-reissue-mint-window, plus console-stream-lane. The form does not name it; only §8's line that rule (00) decides the rest covers it. See DOC-4.
- **No share:** source-watch-idle.mjs, webview_chrome.rs, the shell's Cargo.toml and Cargo.lock, and the form itself.

## Check 6. §8 and the red-before reasons

- **§8.** Its depends_on matches PLAN.yaml:7985, and it has no protocol/ path. The shares it names are true of the plans. It leaves out e2e/README.md and KNOWN-LIMITATIONS.md (DOC-4).
- **Mutations:**
  - M-U1 and E2's M-U4 compile and turn their tests red.
  - E1's M-U3 compiles, because apply returns Readback, and it fails U-3's key-setter-called assertion.
  - M-E1 compiles and leaves no line, so E-1 goes red.
- **E-1 red-before** (E3's second change): the head's suite against the base's build has no line, so it is red. That is well formed.
- **U-2 and U-3 under Part A alone, which is the build made first.** §2 item 1 says the key field "is not set" without Part B. It does not say whether the trait keeps the key setter. If it does not, U-2 ("both setters called") and U-3 ("the key setter is still called") cannot hold. See DOC-2.

## Check 7. Amendments 2 and 3 against the report and the two rulings

**Amendment 2:**
- Item 1 matches the report: 9fca8614 and 5ce0525a, FAIL, sha256 d952ee83…, and the finding counts C1, E1-E3, A1-A2 and D1-D6.
- Every Old that item 2 applies stands once in the form, by a node indexOf count. The ones counted are C1 and its follow-on, E1, E2, E3 and its second change, A1, A2, D2's first and third changes, D3, D5 and D6's first change.
- Item 3 gives words for D6's second change, which the report left without words. It adds nothing beyond what the report said the form should say.
- Items 4 and 5 match the report's check 7 and its D1, D2 and D4.
- Nothing is added.

**Amendment 3:**
- Item 2 matches ADV-2026-11-28-04 item 1: the fence replaces the gate's New, the levels and the dropped case are as ruled, and ADV-2026-11-27-44 item 7 is widened.
- Item 3 matches its item 2. It does not repeat the ruling's sentence that the file is met by the order, but item 1 lets the ruling's bytes govern.
- Item 4 (i) to (iv) and item 5 match its item 3.
- Item 6 matches the line that the keys' reviewer gate no longer waits for the advisor.
- Nothing is added.

**Outside check 7.** Amendment 1 item 9's "before the log folder's E-1" is not in ADV-2026-11-27-44 item 11, which says only the end of the port order. ADV-2026-11-27-47 item 7 puts the log folder's E-1 at the end too. The custodian should name the source of that ordering.

## Findings

**EV-1 (Evidence): §1's E-1 claim goes beyond what E-1 asserts.**
- Form line 121 claims both values are read back as on.
- The E-1 row (line 191) asserts only `context_menus=on`.
- Under Part A alone, the key reads `unread` (lines 161 and 179).
- Not the human's wording; the correction changes the form only.
- Old (stands once, checked by indexOf):
  `- E-1 (§4): in the dev build, that line is written, with both values read back as on.`
- New:
  `- E-1 (§4): in the dev build, that line is written once, at `info`, with `context_menus=on`, and `accelerator_keys=on` under Part B or `unread` without it.`
- Clause check:
  - the level is in the line, since SessionLog::append writes `{ms} {level} {message}` (state.rs:76);
  - the dev build sets both to on by chrome_for(true);
  - without Part B the key reads `unread` (§2 item 1).
- The E-1 row's own change is in EV-2's New.

**EV-2 (Evidence): ruled May-claims with no test and no mutation.**
- The claims are the not-applied line (its bytes and its `error` level), `unread` for a failed read, and the read-back line's `info` level (Amendment 3 item 2 and the D2 fence). Check 2 shows none has a test.
- Not the human's wording; the correction changes the form only. It adds one module function to §2's plan.
- **Old 1** (line 191, stands once):
  `| E-1 (OPEN-6's suite), dev build | exactly one `webview-chrome` line since launch, with `context_menus=on`, within the suite's existing bound (no sleep, no retry) | M-E1: the `with_webview` call removed from `setup()` |`
- **New 1:**
  `| U-5 `a_line_for_settings_not_reached_is_not_applied_at_error` | the module's function that gives `setup()` the level and the line for the closure's outcome gives `error` and exactly `webview-chrome not-applied` for settings not reached, and `info` and `readback_line` of the `Readback` for settings reached | M-U5: the not-applied line written at `info` |`
  `| U-6 `a_failed_read_reads_unread` | `apply` over a fake whose menu getter returns `Err` and whose key getter returns on gives a line with `context_menus=unread accelerator_keys=on` | M-U6: a failed read reported as `off` |`
  `| E-1 (OPEN-6's suite), dev build | exactly one `webview-chrome` line since launch, at `info`, with `context_menus=on`, and `accelerator_keys=on` under Part B or `accelerator_keys=unread` without it, within the suite's existing bound (no sleep, no retry) | M-E1: the `with_webview` call removed from `setup()` |`
- **Old 2** (stands once):
  `The off arm in the installed build has no automated test.`
- **New 2:**
  `The off arm in the installed build has no automated test. Nor do the places in `setup()` and its closure that write the not-applied line (no main window, `with_webview` returning `Err`, a failed `CoreWebView2` or `Settings` call): ordinary use reaches none of them, and called from `setup()` on the main thread `with_webview` returns `Ok` (C1). Each calls U-5's function, whose caller is `setup()`, and the build gates read each call.`
- Clause check:
  - M-U5 and M-U6 change only a string or a match arm, so each compiles and fails its own assertion;
  - U-6's values follow §2 item 1's on/off/unread read-back;
  - E-1 can see the level in the line (state.rs:76);
  - the Ok return is at tauri-runtime-wry lib.rs:239-248;
  - the fake needs no runtime (§3).

**DOC-1 (Documentation, must fix before merge): the README entry does not exist (check 1).**
- Not the human's wording; the correction changes the form only.
- Old (stands once):
  `3. **E-1:** one step in one e2e suite (OPEN-6), plus that suite's `e2e/README.md` entry.`
- New:
  `3. **E-1:** one step in one e2e suite (OPEN-6), plus a new `e2e/README.md` entry for that step: the suite has none at 5ce0525a (a search of `frontends/shell/e2e/README.md` for `source-watch-idle` finds 0).`
- Old (stands once):
  `  - `frontends/shell/e2e/README.md` (its entry only);`
- New:
  `  - `frontends/shell/e2e/README.md` (one new entry, for E-1's step only);`

**DOC-2 (Documentation, must fix before merge): U-2 and U-3 under Part A alone (check 6).**
- Not the human's wording; the correction changes the form only. If the advisor answers DOC-5 otherwise, these words follow that answer.
- Old (stands once):
  `Without §0 item 3 the key field is not set and reads `unread`, and the form's Part B claims drop (OPEN-1).`
- New:
  `Without §0 item 3 the trait keeps both settings' methods, and the product impl's key setter and getter make no WebView2 call and return `Err`: the key field is not set and reads `unread`, U-2 and U-3 run unchanged, and the form's Part B claims drop (OPEN-1).`
- Clause check:
  - the fake has both setters, so U-2 and U-3 hold;
  - apply maps a getter's Err to `unread` (§2 item 1);
  - no webview2-com type is named, as A1 requires.

**DOC-3 (Documentation, must fix before merge): Amendment 3 (ii) and (iv) leave out D3's two cites into B's head.**
- Amendment 2 applies D3's words, which cite `:418` and `:454` of lib.rs at 5ce0525a. That file's blob differs from main's.
- To append; there is no Old.
- New:
  `Amendment 2's D3 words cite lines 418 and 454 of `frontends/shell/src-tauri/src/lib.rs` at 5ce0525a; they are read in the words form with Amendment 3 (ii)'s 17 spans, and Amendment 3 (iv)'s row pins them too.`
- Checked: line 418 is `let main_window_config =` and line 454 is `let window_label = main_window_config.label.clone();`.

**DOC-4 (Documentation, must fix before merge): §8 does not name two shared files (check 5).**
- Not the human's wording; the correction changes the form only.
- Old (stands once):
  `- The custodian's rule (00) list at the base decides the rest.`
- New:
  `- `frontends/shell/e2e/README.md` (E-1's entry) and `KNOWN-LIMITATIONS.md` (one item, its number by the custodian's script, Amendment 3 item 3) are shared with other unmerged branches, by `git diff --name-only origin/main...<branch>`; each is met by the order, the later piece taking main in by a merge commit. The custodian's rule (00) list at the base decides the rest.`

**DOC-5 (Documentation, to the advisor, ruled text, no words proposed).**
- ADV-2026-11-28-04 item 1, third bullet, defines `unread` as a value whose read failed after the settings were reached.
- Under Part A alone, which is built first, the key value is never read at all: §2 item 1 and §3 predict `accelerator_keys=unread`.
- Whether that meaning of `unread` stands is for the advisor.
- Also for the advisor, as a fact and not a finding: the ruled not-applied case "with_webview returns Err" cannot run from setup() (C1, :239-248). The clause is conditional and is not untrue.

## Files read (all read only)

D:/wt/read-1128a:
- governance/forms/frontends/RELOAD-ASKING-FIRST-OR-OFF-IN-THE-INSTALLED-BUILD-PREREGISTRATION.md
- state/consults/gates/2026-11-28-reload-asking-first-or-off-in-the-installed-build-form-gate-architect.md
- state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-44-the-reload-keys-form-open-1-to-open-9-the-form-files-now-with-the-custodians-amendment-1-the-humans-line-a-draft-of-its-own.md
- state/directives/2026-11-28-advisor-ruling-adv-2026-11-28-04-the-reload-keys-form-not-applied-whenever-the-settings-are-not-reached-a-ninth-file-the-pins-at-bs-head-withdrawn.md
- governance/PLAN.yaml:7980-7990
- governance/forms/frontends/RELOAD-ENDS-THE-OLD-PAGES-OPENS-PREREGISTRATION.md (the cited lines)
- docs/PREREGISTRATION-TEMPLATE.md:174
- KNOWN-LIMITATIONS.md (headings)

D:/wt/reload @ 5ce0525a:
- frontends/shell/src-tauri/src/lib.rs
- frontends/shell/src-tauri/src/state.rs:44-95
- tauri.conf.json, capabilities/default.json, Cargo.toml and Cargo.lock (the spans)
- ADR-037 (the cited lines)
- source-watch-idle.mjs
- e2e/README.md (grep)
- frontends/shell/src (grep)

<profile>/.cargo/registry/src/index.crates.io-1949cf8c6b5b557f/:
- tauri-runtime-wry-2.11.4/src/lib.rs (:230-265, :1612-1630, :2915-2924, :3740-3755, :3985-4040)
- tauri-2.11.5/src/app.rs:1415-1430
- tauri-2.11.5/src/webview/mod.rs (:145-186, :1660-1680)
- tauri-2.11.5/src/webview/webview_window.rs:2365-2378
- tauri-2.11.5/src/lib.rs:179-184
- webview2-com-0.38.2/src/lib.rs
- webview2-com-sys-0.38.2/src/bindings.rs:35000-35028

There was no build, no test run and no write, and nothing was read in C:/dev/spatial-ide.
