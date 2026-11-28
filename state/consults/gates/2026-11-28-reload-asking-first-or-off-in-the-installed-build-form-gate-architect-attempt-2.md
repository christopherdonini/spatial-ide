# The reload keys' form: the architect's form gate, attempt 2 (PASS WITH NOTES), narrow under ADV-2026-11-28-05 item 4 (node:reload-asking-first-or-off-in-the-installed-build@form-gate-architect-2)

*Filed by the custodian. The architect (Opus) read the form on main at 8cacfdd1bbbd47e03a4252d60f8168c12aaa8593 in D:/wt/read-1128c and B's head at 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 in D:/wt/reload. Attempt 1 stays FAIL. By the facts script its records run from 2026-11-28T03:33:32Z to 2026-11-28T03:37:33Z, and 0 of its calls ran with the main checkout as its working folder. By its completion notice it took 240759 ms and 19 tool uses. By its own account, two Greps for `BOOL` went under the registry folder beyond the five crates its brief named, found nothing, and nothing was read from them. Its hand-back is below as received, with the harness indent removed: 10284 bytes, sha256 9786c63709efd45f1131ae6f92d11a445400d6b0b26c7808de13c5147e5dd644.*

---

PASS WITH NOTES, attempt 2. I read the form on main @ 8cacfdd1bbbd47e03a4252d60f8168c12aaa8593 (D:/wt/read-1128c) and the code on cut/reload-ends-the-old-pages-opens @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 (D:/wt/reload).

There are no Correctness or Evidence findings. Two findings are words only and block nothing: A3 must be fixed before Part A's code, and D7 before the merge. Neither sentence is the human's wording. Attempt 1 stays FAIL. Everything outside the five checks is carried forward. The only quotations here are the Old strings, byte-copied from the form and marked verbatim. Everything else is paraphrase.

## Check 1. Amendment 2 against my attempt 1 report

- **Item 1:** right. It has the commits, the FAIL verdict, the hand-back hash and the finding counts (C1, E1 to E3, A1 and A2, D1 to D6).
- **Item 2:** each of my words is applied as I gave it. That covers C1 and its follow-on, E1, E2, E3 and its second change, A1, A2, D2's first and third changes, D3, D5 and D6's first change. "A1 is met before Part A's build" is what my A1 heading said.
- **Item 3:** it gives the words my D6 second change left unworded, and adds nothing to it.
- **Item 4:** each item sent to the advisor is answered:
  - D2's second change by Amendment 3 item 2, as Amendment 5 item 2 replaces it;
  - D1 by Amendment 3 item 3;
  - D4 by Amendment 3 item 4.
  My D1 did not name the advisor, but sending it there is a routing choice and changes nothing in the application.
- **Item 5:** carried by ADV-2026-11-28-04 item 4.
- **The reviewer's check 7:** I agree with it and differ from it nowhere.

## Check 2. Amendment 3 against D1, D2 and D4, and the line claim

- **D2.** Amendment 3 item 2 carried the fence of ADV-2026-11-28-04 item 1. Amendment 5 item 2 puts the fence of ADV-2026-11-28-05 item 1 in its place. I compared the two fences: only the `unread` clause differs, and the rest matches byte for byte. §1's line claim now stands as the -05 fence.
  - It is consistent with the code at B's head and the crates:
    - called from `setup()` on the main thread, the closure runs inside `with_webview` (C1), so the line is written from `setup()`;
    - `controller()` returns the controller with no `Result` (tauri-2.11.5/src/webview/mod.rs:180-184), so the not-applied list leaves out nothing that can fail;
    - each getter returns `windows_core::Result` (webview2-com-sys bindings.rs:35003-35014, :35673-35684), so `unread` after a failed read can happen;
    - DOC-2's key getter returns `Err` with no WebView2 call, which is the clause's case without §0 item 3.
  - It is consistent with the other §1 claims as amended: bullet 1, D2's first change and EV-1's E-1 claim.
- **D1.** Amendment 3 item 3 carries it as I asked. It is declared as class 9 before the item's text lands, the Scope gains `KNOWN-LIMITATIONS.md` for one item, the file ceiling becomes 9, §7's own line is not edited, and an overrun is class 8 at the count.
- **D4.** Amendment 3 item 4 carries it, widened from my three e2e spans to the 11 files whose blob is the same on main.
  - The 17 others are named in words with their commit id, and `project.mjs:414` follows round 25 item 2 (d).
  - (iv) gives each of the 17 its pin after B's merge.
  - I did not recompute the hashes, or that 01bb2de8 is on main; I cannot run git. Both are carried from the reviewer's check 3 and from ADV-2026-11-28-04's own read on main at 01bb2de8.

## Check 3. EV-2's module function, under the caller rule

- **Placement:** in `webview_chrome.rs`, as Amendment 4 item 2 says ("adds one module function to §2's plan").
- **Callers:** `setup()` is the product caller at all four sites:
  - no main window;
  - `with_webview` returning `Err`;
  - a failed `CoreWebView2` or `Settings` call inside the closure, which runs inside `setup()` (C1);
  - settings reached.
  There is no test-only caller and no `pub` item outside the crate. The `Err` arm is a required arm of a `Result` (webview_window.rs:2371-2374), so it has a caller even though it cannot run today (ADV-2026-11-28-05 item 2).
- **The real interfaces at B's head:**
  - `SessionLog::append(&self, level: &str, message: &str)` is at state.rs:68, so a level returned as a string matches;
  - the line is written as `{ms} {level} {message}` (state.rs:76), so E-1 can see `info`.
- **U-5 and M-U5:** the mutation changes only the returned level string. It compiles and fails U-5's `error` assertion.
- **U-6 and M-U6:** the mutation changes one match arm (`Err` read as `off`). It compiles and fails the `context_menus=unread` assertion. Neither test needs a runtime.
- **Note, not a finding:** `session_log` is moved into managed state at lib.rs:529, before the region (:607-612). The closure is `Send + 'static` (webview_window.rs:2371), so it has to reach the log through a cloned `AppHandle` and the managed `SessionLog`. It cannot capture `&session_log`. The build gate reads this.
- **Gap:** §10's caller-rule bullet does not name the new function (D7).

## Check 4. DOC-2's key setter and getter, under A1

- They make no WebView2 call and name no `webview2-com` type, by DOC-2's own words.
- Part A stays buildable with no byte of `Cargo.toml` or `Cargo.lock` changed, on one condition the form does not state: the trait's error type must not be `windows_core`'s.
  - The shell's `Cargo.toml` at B's head names neither `windows*` nor `webview2*` (a Grep finds 0).
  - So `windows_core::Error` cannot be named under Part A.
  - A1's applied words bar only `webview2-com` types.
  - A trait written as returning `windows_core::Result` would fail to compile, and §5's first invalidator would then stop the piece to the advisor for no reason (A3).
- The getters' inferred out-parameter, `*mut windows_core::BOOL` (bindings.rs:35005, :35675), is still not compiled. That is carried forward from attempt 1 and covered by §5's first invalidator.

## Check 5. The named posture check (ADV-2026-11-26-18 item 3)

My attempt 1 answer stands after Amendments 2 to 5.

- **Part A:** no amendment changes network access, a listening socket, how the data plane admits a consumer, any file under `capabilities/`, or any dependency. What the amendments add:
  - words;
  - a not-applied line at `error`;
  - a module function and two unit tests;
  - key stubs that make no WebView2 call, so the keys stay on in the installed build;
  - an e2e-side reader of the app's own session-log file;
  - a `KNOWN-LIMITATIONS.md` item;
  - pins.
- **Part B:** still changes the dependency subject only, and that stays with the human (ADV-2026-11-27-45). Amendment 2 item 3's default-features line is the condition my no-new-feature reading rested on. Part B changes no network access, socket, data-plane admission or capability.

## Findings

**A3 (Architecture; words only; must be fixed before Part A's code; does not block).** The trait's error type has to be one Part A can name. Evidence: check 4.
- Old, verbatim from form line 67 (it stands once):
  `Inherent methods are called on values whose types are inferred. This is not compiled.`
- New:
  `Inherent methods are called on values whose types are inferred. `ChromeSettings`' methods return an error type of the module's own, never a `windows-core` or `webview2-com` type, since the shell's `Cargo.toml` names neither crate; each `windows_core::Result` is mapped to it where it is returned, unnamed, and DOC-2's key setter and getter return it with no WebView2 call. This is not compiled.`
- Clause check:
  - the shell's `Cargo.toml` at 5ce0525a has no `windows` or `webview2` line (Grep, 0 matches);
  - the four F-6 methods return `windows_core::Result<()>` (bindings.rs:35006, :35018, :35676, :35688);
  - mapping an error through a closure names no type;
  - DOC-2's stubs are as ADV-2026-11-28-05 item 3 applies them.

**D7 (Documentation; words only; must be fixed before the merge).** §10's caller-rule bullet leaves out EV-2's function. Evidence: check 3.
- Old, verbatim from form line 256 (it stands once, and no applied change touches it):
  `the caller rule: `chrome_for`, `apply` and `readback_line` have `setup()` as their caller, and the fake is test-only and not `pub`;`
- New:
  `the caller rule: `chrome_for`, `apply`, `readback_line` and U-5's function have `setup()` as their caller (U-5's function at each not-applied site and in the closure once the settings are reached), and the fake is test-only and not `pub`;`
- Clause check: the four sites are those of check 3, and the closure runs inside `setup()` (C1, tauri-runtime-wry lib.rs:239-248).

I found no clause in ruled text untrue.

## Files read (all read only)

- **D:/wt/read-1128c @ 8cacfdd1:**
  - governance/forms/frontends/RELOAD-ASKING-FIRST-OR-OFF-IN-THE-INSTALLED-BUILD-PREREGISTRATION.md (whole, plus a Grep count)
  - state/consults/gates/2026-11-28-reload-asking-first-or-off-in-the-installed-build-form-gate-architect.md
  - state/consults/gates/2026-11-28-reload-asking-first-or-off-in-the-installed-build-form-gate-reviewer.md
  - state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-44-the-reload-keys-form-open-1-to-open-9-the-form-files-now-with-the-custodians-amendment-1-the-humans-line-a-draft-of-its-own.md
  - state/directives/2026-11-28-advisor-ruling-adv-2026-11-28-04-the-reload-keys-form-not-applied-whenever-the-settings-are-not-reached-a-ninth-file-the-pins-at-bs-head-withdrawn.md
  - state/directives/2026-11-28-advisor-ruling-adv-2026-11-28-05-the-reload-keys-unread-under-part-a-alone-doc-2-as-the-gate-gives-it-one-narrow-second-attempt-of-each-form-gate.md
  - state/directives (a Glob of file names)
- **D:/wt/reload @ 5ce0525a:**
  - frontends/shell/src-tauri/src/lib.rs:380-649
  - frontends/shell/src-tauri/src/state.rs:25-104
  - frontends/shell/src-tauri/Cargo.toml (Grep)
- **<profile>/.cargo/registry/src/index.crates.io-1949cf8c6b5b557f/:**
  - tauri-2.11.5/src/webview/mod.rs:140-189
  - tauri-2.11.5/src/webview/webview_window.rs:2365-2378
  - webview2-com-sys-0.38.2/src/bindings.rs:35000-35029 and :35668-35697
- Two Greps for `BOOL` under the registry folder found nothing, and I read nothing from them. They went outside the five named crates (into windows-core). I stopped there.

I ran nothing, wrote no file and sent no message. Nothing was read in the main checkout.
