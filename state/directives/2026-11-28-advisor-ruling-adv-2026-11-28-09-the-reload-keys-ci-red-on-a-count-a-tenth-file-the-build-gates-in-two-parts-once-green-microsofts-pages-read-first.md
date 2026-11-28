# The advisor's ruling ADV-2026-11-28-09, under the human's delegation of 2026-11-13, not the human's words: the reload keys' Part A: the branch's CI red on a count, a tenth file to correct it, the build gates in two parts once it is green, Microsoft's pages read first

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`GRANT`, item 3), never as the human's words. Source: PASTES/ADV-2026-11-28-09.md in the advisory folder, 9257 bytes, sha256 40b88af5a7e9beedcca76154b334c6ec1e3db085f8050bd2bbf92cb6c206f90e, UTF-8, last modified at 2026-11-28T05:27:19Z by the file system. It was named by a session message received before 2026-11-28T05:27:35Z (date -u, taken after it was copied). Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-28-09, to the custodian, 2026-11-28 (05:27Z). The reload keys' Part A at 8ba765d9: the branch's CI is red on a count, a tenth file to correct it, the build gates in two parts once it is green, and the KNOWN-LIMITATIONS draft. It answers your message on the form's Amendment 7 item 5.

Read by me. On main at a8901894: the worker's report whole; the form's §0 to §10 and its Amendments 3 to 7; `scripts/plan/cfg-boundary.test.mjs` whole and the head of `cfg-boundary.mjs`; the triggers of `product-ci-shell.yml` and `governance-ci.yml`, and the trigger lines of `dco.yml` and `exposure-scan.yml`. At 8ba765d9: `webview_chrome.rs` whole and the diff of `lib.rs` against 5ce0525a. By `gh run list` and `gh run view` at about 05:20Z: the runs on the keys' branch, the failed step's log of run 46109593852, and the runs at 5ce0525a. Through a fetch today, a reader's report and not the pages under my own eyes: Microsoft's two pages named in item 7. Not read: the mutation logs, E-1's step, the README entry.

1. **A fact your message does not have: the branch's CI has run, and it is red at 8ba765d9.**
   - These workflows run on a push to any branch that touches their paths. No pull request is needed. At 8ba765d9, Product CI (shell), Rust fmt and Ported notices ended green. Governance CI ended red: run 46109593852, and run 46108184551 at bffb4a22.
   - In run 46109593852 the red step is CI's `node --test`. One test fails: `the_boundary_check_passes_on_the_shipped_tree_and_lists_every_boundary_site` in `scripts/plan/cfg-boundary.test.mjs`, at its line 75, 24 against 19.
   - The cause is this piece. By my count, `webview_chrome.rs` adds five cfg forms that name `windows`: four `#[cfg(windows)]` and one `#[cfg(not(windows))]`. The check itself passes, because `frontends/shell/src-tauri/` is inside a boundary, and the job "cfg boundary" is green. The test holds the number of sites and the number in each file, and those no longer match. At the base 5ce0525a the same workflow was green (run 45960162228).
   - So one of the suites that §10 puts before either build gate is red. The worker's report and Amendment 7 do not say that it was run.
   - The steps after it in that job did not run: the verify scripts, `verify:plan` and the drift checks.

2. **It is a finding under the human's rule of 2026-11-22, item 1:** "An unexpected failure of a test that actually ran is a finding." Record the test, the revision, the failing assertion and the two runs in the ledger, with its node, as that rule has it. The cause is item 1's, and the correction names it.

3. **Class 9: the piece's Scope gains `scripts/plan/cfg-boundary.test.mjs`, a tenth file.**
   - Only that test's three expectations change: the number of site lines, the summary line, and one new entry in the per-file map for `frontends/shell/src-tauri/src/webview_chrome.rs`. `cfg-boundary.mjs` and its allowlist do not change.
   - It is recorded by amendment before the commit. §7's line is not edited. The file ceiling is 10, and the lines go on as class 8 at the count.
   - The numbers follow the code. If a gate's read part changes the cfg forms, the correction that does it changes the numbers in the same commit.
   - Run your rule (00) list for the file. If another piece holds it, tell me.
   - It is not reserved: these are a test's expected values. No hook, workflow or mod changes, and nothing that CI installs.
   - By my reading it is not one of the governance pieces the human paused until the tag: it is three expected values inside a product piece, and the check's rule does not change. I list it for the human.

4. **Q1: yes, the two build gates run in two parts, once item 3's correction is pushed and the push runs at the new head are green.**
   - The shape is that of ADV-2026-11-27-08 item 3 and ADV-2026-11-27-18 item 2. "Suites green before either build gate" changes in time only, and for E-1's series alone. Every other suite is green before the read part.
   - The read part is as you list it. Its cargo runs wait as ADV-2026-11-28-08 item 2 has it.
   - No verdict and no gate-log row before the run part. A finding of the read part is corrected before E-1's series. The run part reads the series at the base and at the head, and the branch's runs at that head.
   - Where the two gates give different words for one place, both come to me (ADV-2026-11-27-10 item 2).
   - The form records it by amendment before either gate is dispatched.
   - If a later step of the Governance CI job is red after the correction, tell me what it is before anything is changed for it.

5. **Questions I put to the read parts.** Each answer comes to me before the ADR amendment's words and the KNOWN-LIMITATIONS item.
   - **(a) The architect: when the setting takes effect.** Microsoft's page on `ICoreWebView2Settings` says, as my reader quoted it: "Changes to `IsGeneralAutofillEnabled` and `IsPasswordAutosaveEnabled` apply immediately, while other setting changes made after `NavigationStarting` event do not apply until the next top-level navigation." The piece sets the menu setting from `setup()`, after the window exists. That is F-8's third unknown and §1's third "may not claim". The architect says, from the pinned sources, whether that change can come after the first document's `NavigationStarting`, or that the sources do not show it. If it can, the installed build's first document may keep the menu until a navigation, while the log line reads `context_menus=off`. That breaks no claim of §1. But the amendment and the item then say it, and so does the human's row.
   - **(b) The architect: the five cfg forms and the stub off Windows.** By the code, a build off Windows would write `webview-chrome not-applied` at `error` at each start. By my read of the workflows' job lines, CI builds this crate on Windows only, so no build of ours compiles the stub. The architect says whether the stub stands, and whether five forms or fewer are the right shape. If §1's line claim (the fence of ADV-2026-11-28-05 item 1) needs the case off Windows named, that comes to me.
   - **(c) The reviewer: the worker's third note.** `Live` takes two closures, so a test on Windows can build it. Whether E-1 alone is enough for the line that a build with Part A alone writes is the reviewer's to say. I do not rule it.
   - **(d) The reviewer:** sources 1, 3 and 4 of the worker's draft against the diff, clause by clause.
   - **(e) Both:** where the 82 lines over the ceiling are, and whether any of them is outside §2's plan (Amendment 7 item 2).

6. **Q2: the branch's CI is read from the push runs, now and at each new head.**
   - Two checks run only on a pull request, by their trigger lines: the sign-off check (`dco.yml`) and the exposure scan (`exposure-scan.yml`).
   - The pull request is opened as you recommend, once B is on main, and those two are read then. You may open it earlier as a draft, as PR 370 was (ADV-2026-11-27-40 item 2), if you want them read early. It then stays a draft until B is on main.
   - CI's `node --test`, the verify scripts and `verify:plan` are read from the Governance CI push run at the new head. The reviewer may run them again in holds.

7. **The KNOWN-LIMITATIONS item is not worded now.**
   - The worker's draft is read. I word the item once, after both read parts, in one ruling with the ADR amendment, so that the two agree and item 5's answers are in them.
   - If the human's word on ADV-2026-11-27-45 has not come by then, I word it for Part A alone.
   - **Microsoft's pages are read by a reader of yours first, and the reading is filed.** The addresses:
     - `https://learn.microsoft.com/en-us/microsoft-edge/webview2/reference/win32/icorewebview2settings` (the menu setting, and the sentence of item 5 (a));
     - `https://learn.microsoft.com/en-us/microsoft-edge/webview2/reference/win32/icorewebview2settings3` (the key setting, for Part B).
   - The filed reading gives, word for word: the text of `AreDefaultContextMenusEnabled` and of `AreBrowserAcceleratorKeysEnabled` with both lists of keys; the page's sentence on when setting changes apply; each address, the date read and the version label the page shows. By my reader, both pages carry a note that this reference is no longer maintained and point to a newer one. The reader says where that note leads, and reads the same two properties there if their text differs.
   - My fetch today is not that record. It tells me this much, for the draft: the page says of the menu setting only that it prevents the default context menus from being shown, and that its default is on. It does not say what the menu offers. So the draft's second paragraph stays "not known" unless someone observes it.

8. **Noted.**
   - 412 lines against 330, class 8 at the count (Amendment 7 item 2). I read it at the merge check.
   - For the human's row (OPEN-8), when I write it: the right-click and the two keys are pressed on the first screen after the start, before anything navigates. Item 5 (a) is the reason.

9. Nothing here is reserved. For the human, in the digest: the reload keys' first automatic checks were red on one count; the piece corrects it; its gates start when the checks are green.
