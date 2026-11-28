# The reload keys' form: the reviewer's form gate, attempt 2 (PASS WITH NOTES), narrow under ADV-2026-11-28-05 item 4 (node:reload-asking-first-or-off-in-the-installed-build@form-gate-reviewer-2)

*Filed by the custodian. The reviewer (Opus) read the form on main at 8cacfdd1bbbd47e03a4252d60f8168c12aaa8593 in D:/wt/read-1128c and B's head at 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 in D:/wt/reload. Attempt 1 stays FAIL. By the facts script its records run from 2026-11-28T03:39:05Z to 2026-11-28T03:42:37Z, and 15 of its calls ran with the main checkout as its working folder, the shell's start folder. By its completion notice it took 212193 ms and 18 tool uses. By its own account, it counted with a node script in its session scratchpad; its brief asked for light commands and no change to any file. Its hand-back is below as received, with the harness indent removed: 10518 bytes, sha256 e0dfbfe83de2df5ed59ee9f5532b277150338f852f00f104e97a0d337aa07bbb.*

---

PASS WITH NOTES, attempt 2. I read the form at main 8cacfdd1bbbd47e03a4252d60f8168c12aaa8593 (D:/wt/read-1128c). For the code I read cut/reload-ends-the-old-pages-opens @ 5ce0525aa0c5a1bb5e3c240aadf4456764e9c645 (D:/wt/reload). I confirmed both with `git -C <checkout> rev-parse HEAD`. Except where marked verbatim, everything below is paraphrase.

**Summary:** Amendments 4 and 5 apply my attempt-1 words exactly, and every item Amendment 4 sent to the advisor is answered. U-5, U-6 and the E-1 row still hold against the code at B's head. There are no Correctness or Evidence findings. One Documentation finding (DOC-A, words only) must be fixed before the merge.

## Check 1. Amendment 4's items against my attempt-1 report

- **The filed hand-back matches its hash.** `sed -n '7,225p' <report> | sha256sum` printed 9fe21cd14b4527eef3e17340f0c86a632276ad6634f7b41f125aab997a6530c5, over 18562 bytes. That is the hash and size Amendment 4 item 1 states. `grep -c $'\r'` on the blob gave 0.
- **Amendment 4 item 1 is accurate:** main 51f5e1da, head 5ce0525a, pins at 01bb2de8, FAIL, two Evidence findings (EV-1, EV-2) and five Documentation findings (DOC-1 to DOC-5). These match report line 7 and the findings section.
- **Each Old stands once.** A node script in the session scratchpad takes each Old and New from its report line, strips the outer backticks and counts it with indexOf, with a one-character-appended text as the control.
  - Count 1 in the form, control 0: EV1_old, EV2_old1, EV2_old2, DOC1_old1, DOC1_old2, DOC2_old, DOC4_old.
  - DOC-3's New is also count 1 in the form (it is at Amendment 4 item 3, line 422), control 0.
- **Each New stands once, where the amendment puts it.** Item 2 applies the words by reference ("as that report writes them"), so the Old text stays in the form body and the New text is not repeated there.
  - In the form, every New except DOC-3 counts 0.
  - In the report, every New counts 1. EV2_old2 counts 2 there only because New 2 begins with it.
  - The by-reference reading matches the form's own rule ("Nothing above is edited") and the practice I accepted for Amendment 2 in attempt 1's check 7.
- **The other statements in item 2 are accurate.** EV-2 adds one module function, and §7's line ceiling of 330 with class 8 at the count agrees with Amendment 3 item 3 (`sed -n '377p'`).
- **The items Amendment 4 sent on are answered by Amendment 5:**
  - Item 4 (DOC-5, the meaning of `unread`): answered by Amendment 5 item 2.
  - Item 4 (the fact that `with_webview` returning `Err` cannot run from `setup()`): answered by Amendment 5 item 3.
  - Item 4 (DOC-2): answered by Amendment 5 item 4.
  - Item 6 ("unless that answer asks for one"): Amendment 5 items 5 and 7 carry the two narrow attempts.
- **Item 5 (the order's source)** names ADV-2026-11-27-47 item 7. That agrees with what my attempt-1 outside check said that item holds. I did not re-read ADV-2026-11-27-47, which this brief does not name.

## Check 2. DOC-2 and §1's line claim against ADV-2026-11-28-05

- **DOC-2 is applied as my report gives it.** Amendment 5 item 4 applies it from the report's bytes (report line 169). Its Old (report line 167) counts 1 in the form, control 0, by the same script.
- **§1's line claim now reads as the ADV-2026-11-28-05 fence, by reference.** Amendment 5 item 2 names that fence, byte for byte, as §1's line claim in place of the ADV-2026-11-28-04 fence. Neither fence is reproduced in the form: a node count gave 0 for the 05 fence body, 0 for the 04 fence body and 0 for the control. That is consistent with "Nothing above is edited".
- **Comparing the two fences.** A node script found the fence body in each ruling file (lines 20 to 22 of each, one body line) and took the common prefix and suffix. It printed:
  - `common prefix 125 common suffix 343`
  - `04 differs: "whose read failed"` (verbatim)
  - `05 differs: "this run did not read: its read failed, or, without §0 item 3, the build makes no WebView2 call that reads the key setting"` (verbatim)
  - The prefix ends `back line, with `unread` for each value ` (verbatim).
- **So exactly one clause differs:** the `unread` clause of the read-back sentence. Every other byte is the same, as the ruling's item 1 says.
- **Line hashes, by `sed -n 21p | sha256sum`:**
  - 05 fence body line: 06423a23067e8a9cbbad42f1ebbb5e9e862fe7e00e521d1aa7a53aeaf6d49fe1
  - 04 fence body line: 6b8dac45a8f5b31bff4b236f88c84339d9a320104e4de616b60bea255d81e28f

## Check 3. U-5, U-6 and the E-1 row, with ADV-2026-11-28-05 item 1, against B's head

- **Log format.** At 5ce0525a, state.rs `SessionLog::append(&self, level: &str, message: &str)` writes `format!("{ms} {} {}\n", one_line(level), one_line(message))` (verbatim, from `git show 5ce0525a:frontends/shell/src-tauri/src/state.rs`). The level is therefore in the line. lib.rs already writes the `"info"` level (`session_log.append("info", &origin_line);` at :482) and `"error"` (:99, :309, :330), by `grep -n '\.append('`.
- **`with_webview`** at tauri-2.11.5 webview_window.rs:2371-2374 returns `crate::Result<()>`. In tauri-runtime-wry-2.11.4 lib.rs:239-248, on the main thread the message is handled and `Ok(())` is returned. This is unchanged from attempt 1, and the arm Amendment 5 item 3 describes still cannot run from `setup()`.
- **The settings methods.** webview2-com-sys-0.38.2 bindings.rs:35003-35025: `AreDefaultContextMenusEnabled(&self, enabled: *mut windows_core::BOOL) -> windows_core::Result<()>` and `SetAreDefaultContextMenusEnabled(&self, enabled: bool) -> windows_core::Result<()>` (verbatim). The key pair is on ICoreWebView2Settings3 (:35673, :35685). A failed read is a reachable `Err`, so U-6's case is a real case.
- **U-5 holds.** Item 1 keeps both lines, both levels and the not-applied cases. It also keeps `unread` from ever being written for settings that were not reached. U-5 asserts `error` with exactly `webview-chrome not-applied` when the settings were not reached, and `info` with `readback_line` when they were. Its mutation M-U5 assumes nothing the ruling changed.
- **U-6 holds.** A failed read is the first branch of the new `unread` clause. U-6 uses the test fake, whose key getter may return on in either build: DOC-2 keeps both methods on the trait. M-U6 (a failed read reported as `off`) is unaffected.
- **The E-1 row holds, and its predicted line is the one the ruling gives.** For a dev build with Part A alone, the row (report line 141) predicts one `webview-chrome` line at `info`, with `context_menus=on` and `accelerator_keys=unread`:
  - `chrome_for(true)` is on/on;
  - the menu setting reads back on;
  - the product key getter makes no WebView2 call and returns `Err`, so `apply` gives `unread` (DOC-2). That is the second branch of the new clause.
  - The line is at `info` by U-5's function.
- **E-1 is the end-to-end proof from the real shape** that the Part-A-alone key getter yields `unread`.
- **No test or mutation relies on a value the ruling withdrew.** U-1 to U-4 assert decisions, setter calls and the read-back, not the meaning of `unread`. U-2's Part-A-alone mutation removes the menu setter. §3's prediction ("`unread` without it") and EV-1's New both match the new clause.
- **An observation, not a finding, and outside this attempt (the architect's A1):** the getter's out-parameter is typed `*mut windows_core::BOOL`. To name no webview2-com or windows-core type under Part A alone, the worker relies on type inference at the call. That is for the build gates.

## Findings

**DOC-A (Documentation, must fix before the merge, words only): E-1's key value depends on the build, but the words do not say how the step knows the build.**
- **The gap.** The E-1 row I gave says `accelerator_keys=on` under Part B and `unread` without it. A step that accepts either value at run time would pass a Part B build whose key read failed. That build reads `unread`, which item 1 now also uses for "not read". E-1 would then not prove Part B's read.
- **Evidence.** `git show 5ce0525a:frontends/shell/e2e/source-watch-idle.mjs | grep -nci 'webview-chrome\|accelerator\|part b'` printed 0: the suite has nothing that tells it whether Part B is built. The row is applied by reference, so there is no Old in the form: `under Part B or` counts 0 in the form and 2 in the report.
- **Not the human's wording, and not ruled text.** It changes the form only, so it is applied with no third attempt.
- **To append (no Old), in the amendment that applies it:**
  `E-1's expected `accelerator_keys` value is one fixed string in the suite's source: `unread` in the commit that lands Part A alone, and `on` in the commit that adds §0 item 3; the step never accepts both.`
- **Its count is 0 in the form and 0 in the report today,** by the same node count.
- **Clause check:**
  - "a fixed string in the suite's source": the suite reads the raw log lines (source-watch-idle.mjs:144-145) and can compare them with a constant.
  - "`unread` … Part A alone": DOC-2 and ADV-2026-11-28-05 item 1's second branch.
  - "`on` … §0 item 3": chrome_for(true) in the dev build, read back through ICoreWebView2Settings3.
  - "never accepts both": closes the gap above.

There are no Correctness or Evidence findings. Nothing was built or run beyond the read commands named above. No file was written in either checkout, and nothing was read in or under the main checkout. Paths read:
- D:/wt/read-1128c/governance/forms/frontends/RELOAD-ASKING-FIRST-OR-OFF-IN-THE-INSTALLED-BUILD-PREREGISTRATION.md: §1 to §4, Amendment 3 items 1 to 4, Amendments 4 and 5
- D:/wt/read-1128c/state/consults/gates/2026-11-28-reload-asking-first-or-off-in-the-installed-build-form-gate-reviewer.md
- D:/wt/read-1128c/state/directives/2026-11-28-advisor-ruling-adv-2026-11-28-05-the-reload-keys-unread-under-part-a-alone-doc-2-as-the-gate-gives-it-one-narrow-second-attempt-of-each-form-gate.md
- D:/wt/read-1128c/state/directives/2026-11-28-advisor-ruling-adv-2026-11-28-04-the-reload-keys-form-not-applied-whenever-the-settings-are-not-reached-a-ninth-file-the-pins-at-bs-head-withdrawn.md: item 1 only
- 5ce0525a: frontends/shell/src-tauri/src/state.rs:44-95, lib.rs (an append grep), frontends/shell/e2e/source-watch-idle.mjs:125-160
- <profile>/.cargo/registry/src/index.crates.io-1949cf8c6b5b557f/: webview2-com-sys-0.38.2/src/bindings.rs:34995-35030 and a grep for the key methods; tauri-2.11.5/src/webview/webview_window.rs:2365-2378; tauri-2.11.5/src/webview/mod.rs (a grep); tauri-runtime-wry-2.11.4/src/lib.rs:239-248
